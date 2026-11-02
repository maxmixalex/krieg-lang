import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, relative, resolve } from "node:path";
import { importPdxToKrieg } from "../importer/index.js";
import { classifyCorpusPath, decodeCorpusText } from "../corpus/index.js";
import { parsePdx } from "../pdx/index.js";
import { gamePath, inside, slash, walkFiles } from "./files.js";
import { properties } from "./world.js";
import type { ProjectDiagnostic } from "./types.js";

export interface ImportProjectResult {
  success: boolean;
  converted: number;
  copied: number;
  diagnostics: ProjectDiagnostic[];
  destination: string;
}

export function isPdxPath(path: string): boolean {
  return classifyCorpusPath(path) === "pdx";
}

/** Import is transactional; malformed scripts leave the destination untouched. */
export function importProject(
  input: string,
  destination: string,
  options: { outputPath?: string } = {},
): ImportProjectResult {
  const source = resolve(input),
    target = resolve(destination);
  const result: ImportProjectResult = {
    success: false,
    converted: 0,
    copied: 0,
    diagnostics: [],
    destination: target,
  };
  if (!existsSync(source)) throw new Error(`Input does not exist: ${source}`);
  if (inside(source, target))
    throw new Error("Import destination cannot be inside the source directory.");
  if (existsSync(target) && readdirSync(target).length)
    throw new Error("Import destination must be empty.");
  const directory = statSync(source).isDirectory();
  if (!directory && !options.outputPath)
    throw new Error("A single-file import needs --path, for example --path events/example.txt.");
  mkdirSync(dirname(target), { recursive: true });
  const stage = mkdtempSync(resolve(dirname(target), ".krieg-import-"));
  const name =
    basename(target)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/^[^a-zA-Z0-9]+/, "") || "imported-mod";
  const mod: Record<string, unknown> = { name, version: "0.1.0", supportedVersion: "1.19.*" };
  try {
    for (const file of walkFiles(source)) {
      const path = gamePath(directory ? slash(relative(source, file)) : options.outputPath!);
      if (
        path.split("/").some((part) => [".git", ".github", "node_modules", ".krieg"].includes(part))
      )
        continue;
      if (path === "descriptor.mod") {
        const parsed = parsePdx(readFileSync(file, "utf8"), { sourceName: file });
        const replacements: string[] = [];
        for (const prop of properties(parsed.document.items)) {
          if (prop.value.kind === "atom") {
            const map: Record<string, string> = {
              name: "name",
              version: "version",
              supported_version: "supportedVersion",
              picture: "picture",
              user_dir: "userDir",
            };
            if (map[prop.key.text]) mod[map[prop.key.text]] = prop.value.text;
            if (prop.key.text === "replace_path") replacements.push(prop.value.text);
          } else if (
            prop.value.kind === "block" &&
            ["tags", "dependencies"].includes(prop.key.text)
          )
            mod[prop.key.text] = prop.value.items
              .filter((i) => i.kind === "atom")
              .map((i) => (i.kind === "atom" ? i.text : ""));
        }
        if (replacements.length) mod.replacePath = replacements;
        continue;
      }
      if (isPdxPath(path)) {
        const imported = importPdxToKrieg(decodeCorpusText(readFileSync(file)).text, {
          outputPath: path,
          sourceName: file,
        });
        for (const d of imported.diagnostics)
          result.diagnostics.push({
            code: d.code,
            severity: d.severity,
            message: d.message,
            file,
            line: d.span.line,
            column: d.span.column,
          });
        if (imported.diagnostics.some((d) => d.severity === "error")) continue;
        const output = resolve(stage, "src", path + ".krg.ts");
        mkdirSync(dirname(output), { recursive: true });
        writeFileSync(output, imported.source);
        result.converted++;
      } else {
        const output = resolve(stage, "assets", path);
        mkdirSync(dirname(output), { recursive: true });
        cpSync(file, output);
        result.copied++;
      }
    }
    if (result.diagnostics.some((d) => d.severity === "error")) return result;
    mkdirSync(resolve(stage, "src"), { recursive: true });
    writeFileSync(
      resolve(stage, "krgconfig.json"),
      JSON.stringify(
        {
          name,
          sourceDir: "src",
          outDir: "build/mod",
          mod,
          ...(result.copied ? { assets: [{ from: "assets", to: "" }] } : {}),
        },
        null,
        2,
      ) + "\n",
    );
    writeFileSync(
      resolve(stage, "package.json"),
      JSON.stringify(
        {
          name: name.toLowerCase(),
          private: true,
          type: "module",
          version: "0.1.0",
          scripts: { build: "krieg build", check: "krieg check" },
          devDependencies: { "krieg-lang": "^0.2.0" },
        },
        null,
        2,
      ) + "\n",
    );
    writeFileSync(
      resolve(stage, "tsconfig.json"),
      JSON.stringify(
        {
          extends: "./.krieg/tsconfig.json",
          include: ["src/**/*.krg.ts", "src/**/*.krg.tsx", ".krieg/types/**/*.d.ts"],
        },
        null,
        2,
      ) + "\n",
    );
    writeFileSync(resolve(stage, ".gitignore"), "node_modules/\nbuild/\n.krieg/\n");
    if (existsSync(target)) rmSync(target, { recursive: true });
    renameSync(stage, target);
    result.success = true;
    return result;
  } finally {
    if (existsSync(stage)) rmSync(stage, { recursive: true, force: true });
  }
}
