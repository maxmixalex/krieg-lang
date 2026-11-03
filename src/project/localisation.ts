import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";
import { isMap, isScalar, parseDocument } from "yaml";
import { safeChild } from "./files.js";
import type { KriegConfig, LocalisationRule, OutputFile, ProjectDiagnostic } from "./types.js";

export const languages = [
  "english",
  "french",
  "german",
  "spanish",
  "braz_por",
  "polish",
  "russian",
  "japanese",
  "simp_chinese",
  "korean",
] as const;

const keyPattern = /^[a-zA-Z0-9_.-]+$/;
function decodeUtf8(bytes: Uint8Array, source: string): string {
  try {
    return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
  } catch {
    throw new Error(`${source}: Localisation must be valid UTF-8.`);
  }
}

export interface LocalisationEntry {
  key: string;
  line: number;
  /** Native quoted contents, with game escapes intact. Used in editor hover previews. */
  text: string;
}
export interface NativeLocalisation {
  language: string;
  entries: LocalisationEntry[];
}

/** HOI4's versioned localisation dialect is not YAML. Validate without rewriting its text. */
export function parseNativeLocalisation(text: string, source: string): NativeLocalisation {
  let language = "";
  const entries: LocalisationEntry[] = [];
  const seen = new Set<string>();
  const lines = text.replace(/^\uFEFF/, "").split(/\r\n|\n|\r/);
  const fail = (line: number, message: string): never => {
    throw new Error(`${source}:${line}: ${message}`);
  };
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (/^\s*(#.*)?$/.test(line)) continue;
    const header = /^l_([a-z_]+):\s*(?:#.*)?$/.exec(line);
    if (header) {
      if (language)
        fail(index + 1, "A native localisation file must have exactly one language header.");
      language = header[1];
      if (!(languages as readonly string[]).includes(language))
        fail(index + 1, `Unsupported HOI4 localisation language: ${language}.`);
      continue;
    }
    if (!language) fail(index + 1, "Expected an l_language: header before localisation entries.");
    const entry =
      /^[ \t]+([a-zA-Z0-9_.-]+):(?:[0-9]+)?[ \t]+"((?:[^"\\\x00-\x1f]|\\[^\r\n])*)"[ \t]*(?:#.*)?$/.exec(
        line,
      );
    if (!entry)
      return fail(
        index + 1,
        'Expected an indented KEY:0 "text" entry; quote text and escape internal quotes.',
      );
    const key = entry[1];
    if (seen.has(key)) fail(index + 1, `Duplicate localisation key ${language}:${key}.`);
    seen.add(key);
    entries.push({ key, line: index + 1, text: entry[2] });
  }
  if (!language) fail(1, "Expected an l_language: header.");
  return { language, entries };
}

function format(rule: LocalisationRule): "json" | "yaml" | "hoi4" {
  if (rule.format) return rule.format;
  switch (extname(rule.from).toLowerCase()) {
    case ".json":
      return "json";
    case ".yaml":
      return "yaml";
    case ".yml":
      return "hoi4";
    default:
      throw new Error(
        `Cannot infer localisation format for ${rule.from}; set format to json, yaml or hoi4.`,
      );
  }
}

function mapping(text: string, source: string, inputFormat: "json" | "yaml"): [string, string][] {
  if (inputFormat === "json") {
    try {
      JSON.parse(text);
    } catch (error) {
      throw new Error(`${source}: Invalid JSON: ${(error as Error).message}`);
    }
  }
  const document = parseDocument(text, { uniqueKeys: true, strict: true, prettyErrors: true });
  if (document.errors.length) throw new Error(`${source}: ${document.errors[0].message}`);
  if (document.warnings.length) throw new Error(`${source}: ${document.warnings[0].message}`);
  if (!isMap(document.contents))
    throw new Error(
      `Localisation ${source} must be a flat ${inputFormat.toUpperCase()} mapping of keys to strings.`,
    );
  const entries: [string, string][] = [];
  for (const pair of document.contents.items) {
    if (
      !isScalar(pair.key) ||
      typeof pair.key.value !== "string" ||
      !keyPattern.test(pair.key.value)
    )
      throw new Error(
        `Invalid localisation key in ${source}; keys must contain only letters, digits, underscores, dots and hyphens.`,
      );
    if (!isScalar(pair.value) || typeof pair.value.value !== "string")
      throw new Error(
        `Localisation ${pair.key.value} in ${source} must be a string; aliases, nested mappings and non-string scalars are not supported.`,
      );
    entries.push([pair.key.value, pair.value.value]);
  }
  return entries;
}

export function localisationFiles(config: KriegConfig): OutputFile[] {
  const result: OutputFile[] = [];
  for (const rule of config.localisation) {
    if (!(languages as readonly string[]).includes(rule.language))
      throw new Error(`Unsupported HOI4 localisation language: ${rule.language}`);
    const path = safeChild(config.rootDir, rule.from);
    const text = decodeUtf8(readFileSync(path), rule.from);
    const inputFormat = format(rule);
    let bytes: Uint8Array;
    if (inputFormat === "hoi4") {
      const parsed = parseNativeLocalisation(text, rule.from);
      if (parsed.language !== rule.language)
        throw new Error(
          `Localisation ${rule.from} has l_${parsed.language}, but its configured language is ${rule.language}.`,
        );
      bytes = Buffer.from(text.startsWith("\uFEFF") ? text : "\uFEFF" + text, "utf8");
    } else {
      const lines = [`\uFEFFl_${rule.language}:`];
      for (const [key, value] of mapping(text.replace(/^\uFEFF/, ""), rule.from, inputFormat).sort(
        ([a], [b]) => a.localeCompare(b, "en"),
      )) {
        const escaped = value
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/\r\n|\r|\n/g, "\\n")
          .replace(/\t/g, "\\t");
        lines.push(` ${key}:0 "${escaped}"`);
      }
      bytes = Buffer.from(lines.join("\n") + "\n", "utf8");
    }
    const stem = basename(rule.from)
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    result.push({
      path: `localisation/${rule.language}/${config.name}_${stem}_l_${rule.language}.yml`,
      bytes,
      source: path,
      kind: "localisation",
    });
  }
  return result;
}

/** Check the final project/dependency overlay, including native files supplied as assets. */
export function validateLocalisation(files: Iterable<OutputFile>): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = [];
  const seen = new Map<string, { source: string; line: number }>();
  for (const file of files) {
    if (!/^localisation\/.+\.yml$/i.test(file.path)) continue;
    try {
      const text = decodeUtf8(file.bytes, file.source);
      if (!text.replace(/^\uFEFF/, "").trim()) continue;
      const parsed = parseNativeLocalisation(text, file.source);
      for (const entry of parsed.entries) {
        const identity = `${parsed.language}:${entry.key}`;
        const previous = seen.get(identity);
        if (previous)
          diagnostics.push({
            code: "KRG_LOCALISATION_DUPLICATE",
            severity: "error",
            file: file.source,
            line: entry.line,
            message: `Duplicate localisation key ${identity}; first declared at ${previous.source}:${previous.line}.`,
          });
        else seen.set(identity, { source: file.source, line: entry.line });
      }
    } catch (error) {
      diagnostics.push({
        code: "KRG_LOCALISATION",
        severity: "error",
        file: file.source,
        message: (error as Error).message,
      });
    }
  }
  return diagnostics;
}
