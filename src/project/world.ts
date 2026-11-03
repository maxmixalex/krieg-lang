import { existsSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { parsePdx } from "../pdx/index.js";
import type { PdxItem, PdxProperty } from "../pdx/ast.js";
import { slash, walkFiles } from "./files.js";
import { discoverSourceWorld } from "./source-world.js";
import { messagesDeclaration } from "./messages.js";
import { geographyDeclaration, indexGeography } from "./atlas.js";
import type { GeographyIndex } from "./atlas.js";
import type { KriegConfig, OutputFile, ProjectDiagnostic } from "./types.js";

export interface WorldFile {
  source: string;
  bytes?: Uint8Array;
}
export interface ProjectWorld {
  countries: string[];
  states: number[];
  assets: string[];
  virtualModules: Record<string, string>;
  effectiveFiles: Map<string, WorldFile>;
  diagnostics: ProjectDiagnostic[];
  geography: GeographyIndex;
  baseGeography: GeographyIndex;
}

export function fileBytes(file: WorldFile): Uint8Array {
  return file.bytes ?? readFileSync(file.source);
}
export function properties(items: PdxItem[]): PdxProperty[] {
  return items.filter((item): item is PdxProperty => item.kind === "property");
}

/** replace_path clears direct children of indexed folders; it is not recursive. */
export function applyReplacePaths(files: Map<string, WorldFile>, paths: string[]): void {
  for (const path of paths)
    for (const key of files.keys()) if (slash(dirname(key)) === path) files.delete(key);
}

function descriptorReplacePaths(root: string): string[] {
  const path = resolve(root, "descriptor.mod");
  if (!existsSync(path)) return [];
  const parsed = parsePdx(readFileSync(path, "utf8"), { sourceName: path });
  return properties(parsed.document.items)
    .filter((p) => p.key.text === "replace_path" && p.value.kind === "atom")
    .map((p) => (p.value.kind === "atom" ? slash(p.value.text) : ""));
}

export function createWorld(
  config: KriegConfig,
  layers: Array<{ config: KriegConfig; files: OutputFile[] }>,
): ProjectWorld {
  const effectiveFiles = new Map<string, WorldFile>();
  const projectTranslations = new Map<WorldFile, OutputFile>();
  const diagnostics: ProjectDiagnostic[] = [];
  for (const root of config.gameRoots) {
    if (!existsSync(root.path)) throw new Error(`Game data root does not exist: ${root.path}`);
    applyReplacePaths(effectiveFiles, [...descriptorReplacePaths(root.path), ...root.replacePath]);
    for (const path of walkFiles(root.path))
      effectiveFiles.set(slash(relative(root.path, path)), { source: path });
  }
  const geographyPath = (path: string): boolean =>
    path === "map/definition.csv" ||
    /^(history\/states|map\/strategicregions)\/.+\.txt$/i.test(path);
  const baseGeographyFiles = new Map([...effectiveFiles].filter(([path]) => geographyPath(path)));
  for (const layer of layers) {
    applyReplacePaths(effectiveFiles, layer.config.mod.replacePath);
    for (const file of layer.files) {
      const entry = { source: file.source, bytes: file.bytes };
      effectiveFiles.set(file.path, entry);
      if (/^localisation\/.+\.yml$/i.test(file.path)) projectTranslations.set(entry, file);
    }
    const discovered = discoverSourceWorld(layer.config);
    diagnostics.push(...discovered.diagnostics);
    for (const file of discovered.files)
      effectiveFiles.set(file.path, { source: file.source, bytes: file.bytes });
  }
  const countrySet = new Set<string>();
  const stateSet = new Set<number>();
  for (const [path, file] of effectiveFiles) {
    if (
      !(path.startsWith("common/country_tags/") || path.startsWith("history/states/")) ||
      !path.endsWith(".txt")
    )
      continue;
    const parsed = parsePdx(Buffer.from(fileBytes(file)).toString("utf8"), {
      sourceName: file.source,
    });
    for (const diagnostic of parsed.diagnostics)
      diagnostics.push({
        code: diagnostic.code,
        severity: diagnostic.severity,
        message: diagnostic.message,
        file: file.source,
        line: diagnostic.span.line,
        column: diagnostic.span.column,
      });
    for (const prop of properties(parsed.document.items)) {
      if (path.startsWith("common/country_tags/") && /^[A-Z][A-Z0-9]{2}$/.test(prop.key.text))
        countrySet.add(prop.key.text);
      if (
        path.startsWith("history/states/") &&
        prop.key.text === "state" &&
        prop.value.kind === "block"
      ) {
        const id = properties(prop.value.items).find((p) => p.key.text === "id");
        if (id?.value.kind === "atom" && /^\d+$/.test(id.value.text))
          stateSet.add(Number(id.value.text));
      }
    }
  }
  for (const layer of layers) {
    for (const tag of layer.config.world.countries) countrySet.add(tag);
    for (const id of layer.config.world.states) stateSet.add(id);
  }
  const countries = [...countrySet].sort();
  const states = [...stateSet].sort((a, b) => a - b);
  const assets = [...effectiveFiles.keys()]
    .filter((p) => /\.(dds|tga|png|bmp|jpg|jpeg|ogg|wav|mesh|anim)$/i.test(p))
    .sort();
  const geography = indexGeography(effectiveFiles);
  const currentGeographyFiles = [...effectiveFiles].filter(([path]) => geographyPath(path));
  const baseGeography =
    currentGeographyFiles.length === baseGeographyFiles.size &&
    currentGeographyFiles.every(([path, file]) => baseGeographyFiles.get(path) === file)
      ? geography
      : indexGeography(baseGeographyFiles);
  diagnostics.push(
    ...geography.diagnostics.filter((diagnostic) => diagnostic.code === "KRG_ATLAS_INCOMPLETE"),
  );
  const virtualModules: Record<string, string> = {
    "@project/geography": geographyDeclaration(geography, baseGeography),
    "@project/localisation": messagesDeclaration(
      [...projectTranslations]
        .filter(([entry, file]) => effectiveFiles.get(file.path) === entry)
        .map(([, file]) => file),
    ),
    "@project/countries": `import type { CountryRef } from "krieg-lang/hoi4";\nexport declare const countries: {\n${countries.map((tag) => `readonly ${tag}: CountryRef & {readonly tag:${JSON.stringify(tag)}};`).join("\n")}\n};\n`,
    "@project/states": `import type { StateRef } from "krieg-lang/hoi4";\nexport declare const states: {\n${states.map((id) => `readonly ${id}: StateRef & {readonly id:${id}};`).join("\n")}\n};\n`,
    "@project/assets": `export declare const assets: {\n${assets.map((p) => `readonly ${JSON.stringify(p)}:${JSON.stringify(p)};`).join("\n")}\n};\n`,
  };
  return {
    countries,
    states,
    assets,
    virtualModules,
    effectiveFiles,
    diagnostics,
    geography,
    baseGeography,
  };
}
