import { parseNativeLocalisation } from "./localisation.js";
import type { OutputFile } from "./types.js";

/** Project translations only: a base game's hundreds of thousands of keys must not enter the compiler program. */
export function messagesDeclaration(files: Iterable<OutputFile>): string {
  const byKey = new Map<string, Map<string, string>>();
  const languages = new Set<string>();
  for (const file of files) {
    if (!/^localisation\/.+\.yml$/i.test(file.path)) continue;
    try {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(file.bytes);
      const parsed = parseNativeLocalisation(text, file.source);
      languages.add(parsed.language);
      for (const entry of parsed.entries) {
        let translations = byKey.get(entry.key);
        if (!translations) byKey.set(entry.key, (translations = new Map()));
        translations.set(parsed.language, entry.text);
      }
    } catch {
      // The normal localisation validator reports malformed assets with their source and line.
      // Never advertise keys from an invalid file as valid editor completions.
    }
  }
  const keys = [...byKey.keys()].sort();
  const declarations = keys.map((key) => {
    const translations = byKey.get(key)!;
    const available = [...translations.keys()].sort();
    const sample = (translations.get("english") ?? translations.get(available[0]) ?? "")
      .replaceAll("*/", "* /")
      .replace(/[\r\n\u2028\u2029]/g, " ")
      .slice(0, 160);
    return `  /** ${available.join(", ")} — ${sample} */\n  readonly ${JSON.stringify(key)}: ${JSON.stringify(key)};`;
  });
  const complete = keys.filter((key) => byKey.get(key)!.size === languages.size);
  return `/** Keys supplied by this project and its source-package dependencies. */\nexport declare const messages: {\n${declarations.join("\n")}\n};\nexport type MessageKey = keyof typeof messages;\n/** Keys supplied in every language present in the project's effective localisation files. */\nexport declare const translated: {\n${complete.map((key) => `  readonly ${JSON.stringify(key)}: ${JSON.stringify(key)};`).join("\n")}\n};\nexport type TranslatedKey = keyof typeof translated;\n`;
}
