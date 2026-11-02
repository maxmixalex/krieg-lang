import { createHash, randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, relative, resolve } from "node:path";
import { compileProjectChunks } from "./compilation.js";
import { comparePdxSemantic, emitPdx, parsePdx } from "../pdx/index.js";
import { classifyCorpusPath, decodeCorpusText } from "../corpus/index.js";
import { loadConfig } from "./config.js";
import { resolveDependencies } from "./dependencies.js";
import { collectAssets, validateAsset } from "./assets.js";
import { localisationFiles } from "./localisation.js";
import { createWorld } from "./world.js";
import { validateFileReferences, validateMap } from "./map.js";
import { gamePath, safeChild, slash, walkFiles } from "./files.js";
import type {
  BuildResult,
  KriegConfig,
  ModMetadata,
  OutputFile,
  ProjectDiagnostic,
} from "./types.js";

export function descriptor(mod: ModMetadata, launcherPath?: string): string {
  const quote = (value: string): string => `"${value.replace(/\\/g, "/").replace(/"/g, '\\"')}"`;
  const lines = [
    `name=${quote(mod.name)}`,
    `version=${quote(mod.version)}`,
    `supported_version=${quote(mod.supportedVersion)}`,
  ];
  if (mod.tags.length) lines.push(`tags={ ${mod.tags.map(quote).join(" ")} }`);
  if (mod.dependencies.length)
    lines.push(`dependencies={ ${mod.dependencies.map(quote).join(" ")} }`);
  for (const path of mod.replacePath) lines.push(`replace_path=${quote(path)}`);
  if (mod.picture) lines.push(`picture=${quote(mod.picture)}`);
  if (mod.userDir) lines.push(`user_dir=${quote(mod.userDir)}`);
  if (launcherPath) lines.push(`path=${quote(launcherPath)}`);
  return lines.join("\n") + "\n";
}

export function buildProject(project = ".", options: { check?: boolean } = {}): BuildResult {
  const diagnostics: ProjectDiagnostic[] = [];
  let config: KriegConfig | undefined;
  const result: BuildResult = {
    success: false,
    diagnostics,
    files: [],
    outDir: "",
    world: { countries: 0, states: 0, assets: 0 },
  };
  try {
    config = loadConfig(project);
    result.outDir = safeChild(config.rootDir, config.outDir);
    const graph = resolveDependencies(config);
    const effectiveMod: ModMetadata = {
      ...config.mod,
      replacePath: [...new Set(graph.layers.flatMap((l) => l.config.mod.replacePath))],
      dependencies: [...new Set(graph.layers.flatMap((l) => l.config.mod.dependencies))],
    };
    const layers = graph.layers.map(({ config: layer }) => ({
      config: layer,
      files: [...collectAssets(layer), ...localisationFiles(layer)],
    }));
    const world = createWorld(config, layers);
    diagnostics.push(...world.diagnostics);
    result.world = {
      countries: world.countries.length,
      states: world.states.length,
      assets: world.assets.length,
    };
    const output = new Map<string, OutputFile>();
    const casePaths = new Map<string, string>();
    function add(file: OutputFile, override = false): void {
      const path = gamePath(file.path);
      const casePrevious = casePaths.get(path.toLowerCase());
      if (casePrevious && casePrevious !== path) {
        diagnostics.push({
          code: "KRG_PATH_CASE",
          severity: "error",
          file: file.source,
          message: `Output paths ${casePrevious} and ${path} collide on case-insensitive systems.`,
        });
        return;
      }
      const previous = output.get(path);
      if (previous && !override) {
        diagnostics.push({
          code: "KRG_OUTPUT_CONFLICT",
          severity: "error",
          file: file.source,
          message: `Output ${path} is also provided by ${previous.source}; give assets explicit override:true or use a different path.`,
        });
        return;
      }
      output.set(path, { ...file, path });
      casePaths.set(path.toLowerCase(), path);
    }
    for (const layer of layers) {
      for (const path of layer.config.mod.replacePath)
        for (const previous of output.keys())
          if (slash(dirname(previous)) === path) {
            output.delete(previous);
            casePaths.delete(previous.toLowerCase());
          }
      for (const file of layer.files) {
        if (layer.config.strictAssets) diagnostics.push(...validateAsset(file));
        if (classifyCorpusPath(file.path) === "pdx") {
          const parsed = parsePdx(decodeCorpusText(file.bytes).text, { sourceName: file.source });
          for (const d of parsed.diagnostics)
            diagnostics.push({
              code: d.code,
              severity: d.severity,
              message: d.message,
              file: file.source,
              line: d.span.line,
              column: d.span.column,
            });
        }
        add(file, "override" in file && file.override === true);
      }
      const entries = walkFiles(safeChild(layer.config.rootDir, layer.config.sourceDir)).filter(
        (path) => path.endsWith(".krg.ts"),
      );
      for (const compiled of compileProjectChunks({
        rootDir: config.rootDir,
        files: entries,
        virtualModules: world.virtualModules,
        moduleFiles: graph.moduleFiles,
        emitDependencies: false,
      })) {
        diagnostics.push(...compiled.diagnostics);
        for (const file of compiled.outputs) {
          const path = gamePath(file.path);
          if (path === "descriptor.mod" || path === ".krieg-build.json")
            throw new Error(`Source cannot replace compiler-owned metadata ${path}.`);
          const text = emitPdx(file.document);
          const parsed = parsePdx(text, { sourceName: file.sourceFile });
          for (const d of parsed.diagnostics)
            diagnostics.push({
              code: d.code,
              severity: d.severity,
              message: d.message,
              file: file.sourceFile,
              line: d.span.line,
              column: d.span.column,
            });
          if (!comparePdxSemantic(file.document, parsed.document))
            diagnostics.push({
              code: "KRG_EMIT_SEMANTICS",
              severity: "error",
              file: file.sourceFile,
              message: `Emitting ${path} changes its ordered syntax tree; use valid atoms and escaped strings.`,
            });
          add({ path, bytes: Buffer.from(text, "utf8"), source: file.sourceFile, kind: "script" });
        }
      }
    }
    for (const [path, file] of output)
      world.effectiveFiles.set(path, { source: file.source, bytes: file.bytes });
    diagnostics.push(...validateMap(world.effectiveFiles));
    if (config.strictAssets)
      diagnostics.push(
        ...validateFileReferences(
          world.effectiveFiles,
          new Set(output.keys()),
          config.gameRoots.length > 0,
        ),
      );
    if (config.mod.picture && !world.effectiveFiles.has(config.mod.picture))
      diagnostics.push({
        code: "KRG_PICTURE",
        severity: "error",
        message: `mod.picture ${config.mod.picture} is not included in the project.`,
      });
    add({
      path: "descriptor.mod",
      bytes: Buffer.from(descriptor(effectiveMod)),
      source: config.configPath,
      kind: "metadata",
    });
    const files = [...output.values()].sort((a, b) => a.path.localeCompare(b.path, "en"));
    result.files = files.map((file) => ({
      path: file.path,
      bytes: file.bytes.byteLength,
      sha256: createHash("sha256").update(file.bytes).digest("hex"),
      kind: file.kind,
    }));
    if (diagnostics.some((d) => d.severity === "error")) return result;
    if (!options.check) {
      writeBuild({ ...config, mod: effectiveMod }, files, result.files);
      result.launcherFile = resolve(dirname(result.outDir), `${config.name}.mod`);
    }
    result.success = true;
  } catch (error) {
    diagnostics.push({
      code: "KRG_PROJECT",
      severity: "error",
      message: (error as Error).message,
      file: config?.configPath,
    });
  }
  return result;
}

function writeBuild(
  config: KriegConfig,
  files: OutputFile[],
  manifest: BuildResult["files"],
): void {
  const output = safeChild(config.rootDir, config.outDir);
  if (existsSync(output) && readdirSync(output).length) {
    const marker = resolve(output, ".krieg-build.json");
    if (!existsSync(marker))
      throw new Error(`Refusing to replace non-Krieg directory ${output}; choose an empty outDir.`);
    const previous: unknown = JSON.parse(readFileSync(marker, "utf8"));
    if (
      !previous ||
      typeof previous !== "object" ||
      (previous as { name?: string }).name !== config.name
    )
      throw new Error("Output directory belongs to another Krieg project.");
  }
  const parent = dirname(output);
  mkdirSync(parent, { recursive: true });
  const stage = resolve(parent, `.${basename(output)}-krieg-stage-${randomUUID()}`);
  const backup = resolve(parent, `.${basename(output)}-krieg-previous-${randomUUID()}`);
  const launcher = resolve(parent, `${config.name}.mod`);
  // Do not replace a descriptor unrelated to our previous build.
  if (existsSync(launcher) && !existsSync(resolve(output, ".krieg-build.json")))
    throw new Error(`Launcher descriptor already exists: ${launcher}`);
  mkdirSync(stage);
  try {
    for (const file of files) {
      const path = resolve(stage, gamePath(file.path));
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, file.bytes);
    }
    writeFileSync(
      resolve(stage, ".krieg-build.json"),
      JSON.stringify(
        {
          format: 1,
          name: config.name,
          compiler: "krieg-lang@0.1.0",
          files: manifest,
          sources: files.map((f) => ({
            path: f.path,
            source: slash(relative(config.rootDir, f.source)),
          })),
        },
        null,
        2,
      ) + "\n",
    );
    const hadOutput = existsSync(output);
    if (hadOutput) renameSync(output, backup);
    try {
      renameSync(stage, output);
      const tempLauncher = launcher + `.${randomUUID()}.tmp`;
      try {
        writeFileSync(tempLauncher, descriptor(config.mod, slash(output)));
        renameSync(tempLauncher, launcher);
      } finally {
        if (existsSync(tempLauncher)) rmSync(tempLauncher);
      }
    } catch (error) {
      if (existsSync(output)) rmSync(output, { recursive: true, force: true });
      if (hadOutput) renameSync(backup, output);
      throw error;
    }
    if (hadOutput) rmSync(backup, { recursive: true, force: true });
  } finally {
    if (existsSync(stage)) rmSync(stage, { recursive: true, force: true });
  }
}
