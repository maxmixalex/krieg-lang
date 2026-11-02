import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { safeChild } from "./files.js";
import type { KriegConfig, OutputFile } from "./types.js";

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

export function localisationFiles(config: KriegConfig): OutputFile[] {
  const result: OutputFile[] = [];
  const seen = new Set<string>();
  for (const rule of config.localisation) {
    if (!(languages as readonly string[]).includes(rule.language))
      throw new Error(`Unsupported HOI4 localisation language: ${rule.language}`);
    const path = safeChild(config.rootDir, rule.from);
    const data: unknown = JSON.parse(readFileSync(path, "utf8").replace(/^\uFEFF/, ""));
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw new Error(`Localisation ${rule.from} must be a JSON object of keys and strings.`);
    const lines = [`\uFEFFl_${rule.language}:`];
    for (const [key, text] of Object.entries(data).sort(([a], [b]) => a.localeCompare(b, "en"))) {
      if (!/^[a-zA-Z0-9_.-]+$/.test(key))
        throw new Error(`Invalid localisation key ${key} in ${rule.from}.`);
      if (typeof text !== "string") throw new Error(`Localisation ${key} must be a string.`);
      const identity = `${rule.language}:${key}`;
      if (seen.has(identity)) throw new Error(`Duplicate localisation key ${identity}.`);
      seen.add(identity);
      const escaped = text
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\r\n|\r|\n/g, "\\n")
        .replace(/\t/g, "\\t");
      lines.push(` ${key}:0 "${escaped}"`);
    }
    const stem = basename(rule.from)
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    result.push({
      path: `localisation/${rule.language}/${config.name}_${stem}_l_${rule.language}.yml`,
      bytes: Buffer.from(lines.join("\n") + "\n", "utf8"),
      source: path,
      kind: "localisation",
    });
  }
  return result;
}
