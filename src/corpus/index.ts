import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { comparePdxSemantic, emitPdx, parsePdx, semanticPdx } from "../pdx/index.js";
import { importDocumentToKrieg, recompileImportedKrieg } from "../importer/index.js";
export interface CorpusCompileInput {
  source: string;
  sourcePath: string;
  outputPath: string;
  expectedSemanticHash: string;
}
export interface CorpusCompileResult {
  sourcePath: string;
  success: boolean;
  diagnostics: unknown[];
  semanticHash?: string;
}
export interface CorpusOptions {
  rootDir: string;
  name?: string;
  reportPath?: string;
  importedDir?: string;
  generatedDir?: string;
  compileBatch?: (files: CorpusCompileInput[]) => Promise<CorpusCompileResult[]>;
  batchMaxBytes?: number;
  batchMaxFiles?: number;
  onProgress?: (progress: {
    processed: number;
    total: number;
    path: string;
    phase: string;
  }) => void;
}
export type CorpusClass =
  "pdx" | "localisation" | "map-table" | "credits" | "documentation" | "binary-asset" | "other";
export interface CorpusFileResult {
  path: string;
  category: CorpusClass;
  bytes: number;
  sha256: string;
  encoding?: string;
  status: string;
  diagnostics?: unknown[];
}
export interface CorpusLevel {
  attempted: number;
  passed: number;
  failed: number;
  skipped: number;
}
export interface CorpusReport {
  formatVersion: 1;
  name: string;
  rootDir: string;
  completedAt: string;
  durationMs: number;
  inventory: {
    files: number;
    bytes: number;
    sha256: string;
    byClass: Record<string, number>;
    byExtension: Record<string, number>;
  };
  levels: {
    parse: CorpusLevel;
    canonicalSemanticRoundtrip: CorpusLevel;
    constructorStaticRecompile: CorpusLevel;
    typescriptCompile: CorpusLevel;
    ancillarySyntax: CorpusLevel;
  };
  representation: "ordered-pdx";
  engineValidation: "not-run";
  limitations: string[];
  files: CorpusFileResult[];
}
export function classifyCorpusPath(path: string): CorpusClass {
  const normalized = path.replaceAll("\\", "/");
  if (/\.(yml|yaml)$/i.test(normalized) && /(^|\/)locali[sz]ation\//i.test(normalized))
    return "localisation";
  if (
    /^map\/(railways|supply_nodes|buildings|positions|unitstacks|weatherpositions)\.txt$/i.test(
      normalized,
    ) ||
    /^map\/(definition|adjacencies)\.csv$/i.test(normalized)
  )
    return "map-table";
  if (/(^|\/)credits(?:_.*)?\.txt$/i.test(normalized)) return "credits";
  if (
    /(^|\/)(documentation|docs|licenses?)\//i.test(normalized) ||
    /\.(md|html)$/i.test(normalized) ||
    /(^|\/)(readme|changelog)(\.|$)/i.test(normalized)
  )
    return "documentation";
  if (/\.(txt|gfx|gui|asset|map|mod|sfx)$/i.test(normalized)) return "pdx";
  // One supplied TNO achievement script has no extension; inspect this known game folder too.
  if (!extname(normalized) && /^common\/achievements\//i.test(normalized)) return "pdx";
  if (/\.(dds|bmp|png|tga|jpg|jpeg|mesh|anim|ogg|wav|ttf)$/i.test(normalized))
    return "binary-asset";
  return "other";
}
export function decodeCorpusText(bytes: Uint8Array): { text: string; encoding: string } {
  try {
    return {
      text: new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes),
      encoding: "utf-8",
    };
  } catch {
    return {
      text: new TextDecoder("windows-1252", { fatal: true, ignoreBOM: true }).decode(bytes),
      encoding: "windows-1252",
    };
  }
}
async function filesUnder(root: string): Promise<string[]> {
  const files: string[] = [];
  for (const dirent of await readdir(root, { withFileTypes: true })) {
    const path = join(root, dirent.name);
    if (dirent.isDirectory()) files.push(...(await filesUnder(path)));
    else if (dirent.isFile()) files.push(path);
  }
  return files.sort();
}
const sha256 = (value: string | Uint8Array): string =>
  createHash("sha256").update(value).digest("hex");
const level = (): CorpusLevel => ({ attempted: 0, passed: 0, failed: 0, skipped: 0 });
export function validateAncillarySyntax(
  path: string,
  text: string,
  category: CorpusClass,
): { line: number; message: string }[] {
  const diagnostics: { line: number; message: string }[] = [];
  const rows = text.replace(/^\uFEFF/, "").split(/\r?\n/);
  if (category === "localisation") {
    let header = false,
      entries = 0;
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index]!.trim();
      if (!row || row.startsWith("#")) continue;
      if (/^l_[a-z_]+\s*:\s*(?:#.*)?$/.test(row)) {
        header = true;
        continue;
      }
      entries++;
      if (!header)
        diagnostics.push({
          line: index + 1,
          message: "Localisation entry precedes an l_language: header",
        });
      // HOI4 localisation is not standard YAML: embedded quotation marks occur
      // in shipped rows. This checks the row envelope, leaving full checks to CWTools.
      if (!/^[^\s:]+:\s*\d*\s*".*"\s*(?:#.*)?$/.test(row))
        diagnostics.push({ line: index + 1, message: 'Expected localisation key:version "text"' });
    }
    if (!header && entries)
      diagnostics.push({ line: 1, message: "Missing localisation language header" });
  } else if (category === "map-table") {
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index]!.replace(/#.*/, "").trim();
      if (!row) continue;
      if (/\/(railways|supply_nodes)\.txt$/i.test(path)) {
        const values = row.split(/\s+/).map(Number);
        const railway = /railways\.txt$/i.test(path);
        if (
          values.some((n) => !Number.isSafeInteger(n)) ||
          (railway ? values.length < 4 || values[1] !== values.length - 2 : values.length !== 2)
        )
          diagnostics.push({
            line: index + 1,
            message: railway
              ? "Invalid railway row or province count"
              : "Invalid supply-node level/province row",
          });
      } else if (!row.includes(";") && !/positions\.txt$/i.test(path))
        diagnostics.push({ line: index + 1, message: "Expected semicolon-delimited map row" });
    }
  }
  return diagnostics;
}
/** Bounded corpus validation with every input classified and failed inputs retained in reports. */
export async function runCorpus(options: CorpusOptions): Promise<CorpusReport> {
  const started = Date.now(),
    root = resolve(options.rootDir);
  const allFiles = await filesUnder(root);
  for (const target of [options.importedDir, options.generatedDir, options.reportPath])
    if (target && (resolve(target) === root || resolve(target).startsWith(root + sep)))
      throw new Error("Corpus outputs must be outside the input directory");
  const report: CorpusReport = {
    formatVersion: 1,
    name: options.name ?? root.split(sep).at(-1)!,
    rootDir: root,
    completedAt: "",
    durationMs: 0,
    inventory: { files: allFiles.length, bytes: 0, sha256: "", byClass: {}, byExtension: {} },
    levels: {
      parse: level(),
      canonicalSemanticRoundtrip: level(),
      constructorStaticRecompile: level(),
      typescriptCompile: level(),
      ancillarySyntax: level(),
    },
    representation: "ordered-pdx",
    engineValidation: "not-run",
    limitations: [
      "Canonical output normalizes whitespace and omits comments; original-source emission is a separate passthrough mode.",
      "Constructor static recompilation validates the ordered PDX representation, not game-semantic scopes or references.",
      "Ancillary validation checks localisation/map row syntax only; it does not prove complete world validity.",
      "No HOI4 engine was launched.",
    ],
    files: [],
  };
  if (!options.compileBatch)
    report.limitations.push(
      "The main TypeScript compiler was not requested; typescriptCompile is explicitly skipped.",
    );
  else
    report.limitations.push(
      "The lightweight constructor interpreter is skipped because full TypeScript compilation and semantic-hash comparison supersede it; this avoids retaining two TypeScript ASTs for large inputs.",
    );
  const inventoryHash = createHash("sha256"),
    resultsBySource = new Map<string, CorpusFileResult>();
  let pending: CorpusCompileInput[] = [],
    pendingBytes = 0,
    processed = 0;
  const flush = async () => {
    if (!pending.length || !options.compileBatch) return;
    const batch = pending;
    pending = [];
    pendingBytes = 0;
    let results: CorpusCompileResult[];
    try {
      results = await options.compileBatch(batch);
    } catch (error) {
      results = batch.map((input) => ({
        sourcePath: input.sourcePath,
        success: false,
        diagnostics: [{ message: error instanceof Error ? error.message : String(error) }],
      }));
    }
    const byPath = new Map(results.map((r) => [r.sourcePath, r]));
    for (const input of batch) {
      const file = resultsBySource.get(input.sourcePath)!;
      const result = byPath.get(input.sourcePath);
      report.levels.typescriptCompile.attempted++;
      if (result?.success && result.semanticHash === input.expectedSemanticHash) {
        report.levels.typescriptCompile.passed++;
        file.status = "typescript-compiled-semantic-match";
      } else {
        report.levels.typescriptCompile.failed++;
        file.status = "typescript-compile-failed";
        file.diagnostics = [
          ...(file.diagnostics ?? []),
          ...(result?.diagnostics ?? [{ message: "Compiler returned no result for input" }]),
          ...(result?.success && result.semanticHash !== input.expectedSemanticHash
            ? [{ message: "Compiled ordered PDX semantic hash differs from original" }]
            : []),
        ];
        if (options.generatedDir) {
          const target = join(options.generatedDir, file.path);
          await mkdir(dirname(target), { recursive: true });
          await copyFile(join(root, file.path), target);
        }
      }
    }
  };
  for (const absolute of allFiles) {
    const path = relative(root, absolute).replaceAll("\\", "/"),
      bytes = await readFile(absolute),
      category = classifyCorpusPath(path),
      hash = sha256(bytes);
    report.inventory.bytes += bytes.length;
    report.inventory.byClass[category] = (report.inventory.byClass[category] ?? 0) + 1;
    const extension = extname(path).toLowerCase() || "(none)";
    report.inventory.byExtension[extension] = (report.inventory.byExtension[extension] ?? 0) + 1;
    inventoryHash.update(path).update("\0").update(hash).update("\0");
    const file: CorpusFileResult = {
      path,
      category,
      bytes: bytes.length,
      sha256: hash,
      status: "not-pdx-input",
    };
    report.files.push(file);
    let generated: string | undefined;
    if (category === "pdx") {
      report.levels.parse.attempted++;
      const decoded = decodeCorpusText(bytes);
      file.encoding = decoded.encoding;
      const parsed = parsePdx(decoded.text, { sourceName: path, retainSource: false });
      if (parsed.diagnostics.some((d) => d.severity === "error")) {
        report.levels.parse.failed++;
        file.status = "input-parse-failed";
        file.diagnostics = parsed.diagnostics;
        report.levels.canonicalSemanticRoundtrip.skipped++;
        report.levels.constructorStaticRecompile.skipped++;
        report.levels.typescriptCompile.skipped++;
      } else {
        report.levels.parse.passed++;
        report.levels.canonicalSemanticRoundtrip.attempted++;
        generated = emitPdx(parsed.document);
        const reparsed = parsePdx(generated, { retainSource: false });
        if (
          reparsed.diagnostics.length ||
          !comparePdxSemantic(parsed.document, reparsed.document)
        ) {
          report.levels.canonicalSemanticRoundtrip.failed++;
          file.status = "canonical-semantic-mismatch";
          file.diagnostics = reparsed.diagnostics;
          report.levels.constructorStaticRecompile.skipped++;
          report.levels.typescriptCompile.skipped++;
        } else {
          report.levels.canonicalSemanticRoundtrip.passed++;
          const source = importDocumentToKrieg(parsed.document, {
            outputPath: path,
            sourceName: path,
          });
          const sourcePath = path + ".krg.ts";
          // The main compiler already checks constructor signatures and lowers the
          // actual TypeScript AST. Running a second interpreter here doubles peak
          // memory for generated modules without adding an independent guarantee.
          const recompiled = options.compileBatch
            ? undefined
            : recompileImportedKrieg(source, sourcePath);
          if (options.compileBatch) report.levels.constructorStaticRecompile.skipped++;
          else report.levels.constructorStaticRecompile.attempted++;
          if (
            recompiled &&
            (!recompiled.file ||
              recompiled.diagnostics.length ||
              recompiled.file.path !== path ||
              !comparePdxSemantic(parsed.document, recompiled.file.document))
          ) {
            report.levels.constructorStaticRecompile.failed++;
            file.status = "constructor-recompile-failed";
            file.diagnostics = recompiled.diagnostics;
            report.levels.typescriptCompile.skipped++;
          } else {
            if (!options.compileBatch) report.levels.constructorStaticRecompile.passed++;
            file.status = options.compileBatch
              ? "awaiting-typescript-compilation"
              : "constructor-recompiled-semantic-match";
            if (options.importedDir) {
              const target = join(options.importedDir, sourcePath);
              await mkdir(dirname(target), { recursive: true });
              await writeFile(target, source);
            }
            if (options.compileBatch) {
              if (
                pending.length &&
                (pending.length >= (options.batchMaxFiles ?? 50) ||
                  pendingBytes + Buffer.byteLength(source) >
                    (options.batchMaxBytes ?? 8 * 1024 * 1024))
              )
                await flush();
              const input = {
                source,
                sourcePath,
                outputPath: path,
                expectedSemanticHash: sha256(JSON.stringify(semanticPdx(parsed.document))),
              };
              pending.push(input);
              pendingBytes += Buffer.byteLength(source);
              resultsBySource.set(sourcePath, file);
            } else report.levels.typescriptCompile.skipped++;
          }
        }
      }
    } else if (category === "localisation" || category === "map-table") {
      const decoded = decodeCorpusText(bytes);
      file.encoding = decoded.encoding;
      const diagnostics = validateAncillarySyntax(path, decoded.text, category);
      report.levels.ancillarySyntax.attempted++;
      if (diagnostics.length) {
        report.levels.ancillarySyntax.failed++;
        file.status = "ancillary-syntax-diagnostics";
        file.diagnostics = diagnostics;
      } else {
        report.levels.ancillarySyntax.passed++;
        file.status = "ancillary-syntax-passed";
      }
    }
    if (options.generatedDir) {
      const target = join(options.generatedDir, path);
      await mkdir(dirname(target), { recursive: true });
      if (generated !== undefined && !file.status.includes("mismatch"))
        await writeFile(target, generated);
      else await copyFile(absolute, target);
    }
    processed++;
    options.onProgress?.({ processed, total: allFiles.length, path, phase: "corpus" });
  }
  await flush();
  report.inventory.sha256 = inventoryHash.digest("hex");
  report.completedAt = new Date().toISOString();
  report.durationMs = Date.now() - started;
  if (options.reportPath) {
    await mkdir(dirname(options.reportPath), { recursive: true });
    await writeFile(options.reportPath, JSON.stringify(report, null, 2) + "\n");
  }
  return report;
}
