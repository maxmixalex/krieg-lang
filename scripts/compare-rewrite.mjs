// Compare all runtime definitions in a port, not just its file count or whether it type-checks.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { parsePdx, semanticPdx } from "../dist/pdx/index.js";
import { dataFile, fileTree, hash, portsRoot, readOriginal } from "./rewrite-inputs.mjs";

const field = (p, k) =>
  p.value?.items?.find(
    (i) => i.kind === "property" && i.key.text.toLowerCase() === k && i.value.kind === "atom",
  )?.value.text;
const digest = (p) => hash(JSON.stringify(semanticPdx({ items: [p] })));
const nativePath = (k) => /\.(txt|gui|gfx|asset|lua)$/i.test(k);
function decode(bytes) {
  const b = Buffer.from(bytes);
  return (
    b[0] === 0xff && b[1] === 0xfe ? b.toString("utf16le") : new TextDecoder("utf-8").decode(b)
  ).replace(/^\uFEFF/, "");
}
function add(map, k, v) {
  const seq = map.get(k) ?? [];
  seq.push(v);
  map.set(k, seq);
}
export function nativeInventory(files) {
  const definitions = new Map(),
    media = new Map(),
    translations = new Map(),
    unparsed = [],
    scriptPaths = [];
  let unequalLocalisationSyntax = 0;
  for (const path of [...files.keys()].sort()) {
    if (path.endsWith(".mod") || path.startsWith(".") || path === ".krieg-build.json") continue;
    const bytes = files.get(path);
    if (/^localisation\/.+\.yml$/i.test(path)) {
      let lang = null;
      for (const line of decode(bytes).split(/\r\n|\n|\r/)) {
        if (!line.trim() || /^\s*#/.test(line)) continue;
        const header = /^\s*l_([a-zA-Z_]+)\s*:\s*(?:#.*)?$/.exec(line);
        if (header) {
          lang = header[1];
          continue;
        }
        const entry = /^\s*([^\s:#]+)\s*:\s*\d*\s*"(.*)"\s*(?:#.*)?$/.exec(line);
        if (!entry || !lang) {
          unequalLocalisationSyntax++;
          continue;
        }
        add(translations, lang + ":" + entry[1], hash(entry[2]));
      }
    } else if (dataFile(path)) media.set(path, [hash(bytes)]);
    else if (nativePath(path)) {
      scriptPaths.push(path);
      if (path.endsWith(".lua")) {
        unparsed.push(path);
        continue;
      }
      const parsed = parsePdx(decode(bytes));
      if (parsed.diagnostics?.length) {
        unparsed.push(path);
        continue;
      }
      const domain = path
        .split("/")
        .slice(0, path.startsWith("common/") ? 2 : 1)
        .join("/");
      function store(p, container = "") {
        if (p.kind !== "property") {
          add(definitions, domain + "::" + path + "::@literal", digest(p));
          return;
        }
        const k = p.key.text.toLowerCase(),
          prefix = domain + "::" + container;
        // The native game groups these by declared name. Their physical source file can change.
        if (
          [
            "scripted_gui",
            "on_actions",
            "spritetypes",
            "guitypes",
            "objecttypes",
            "soundeffects",
            "soundtypes",
          ].includes(k) &&
          p.value.kind === "block"
        ) {
          for (const c of p.value.items) store(c, container + k + "/");
          return;
        }
        // Count ideas and decisions by their leaf IDs, not by a single wrapper.
        if (!container && domain === "common/ideas" && k === "ideas" && p.value.kind === "block") {
          for (const group of p.value.items)
            if (group.kind === "property" && group.value.kind === "block")
              for (const child of group.value.items) store(child, "ideas/" + group.key.text + "/");
          return;
        }
        if (
          !container &&
          domain === "common/decisions" &&
          !path.startsWith("common/decisions/categories/") &&
          p.value.kind === "block"
        ) {
          for (const d of p.value.items) store(d, "decisions/" + p.key.text + "/");
          return;
        }
        const id = field(p, "name") ?? field(p, "id");
        // GUI layouts are resolved by widget name, while events and defined_text repeat top-level kinds.
        const named =
          [
            "event",
            "country_event",
            "news_event",
            "state_event",
            "unit_leader_event",
            "operative_leader_event",
            "defined_text",
            "sound",
            "soundeffect",
            "sprite",
            "map_mode",
          ].includes(k) ||
          container.includes("guitypes/") ||
          container.includes("spritetypes/");
        const identity = p.key.text + (id && named ? "/" + id : "");
        add(definitions, prefix + identity, digest(p));
      }
      for (const p of parsed.document.items) store(p);
    }
  }
  return {
    definitions,
    media,
    translations,
    unparsed,
    scriptPaths,
    unrecognizedTranslationLines: unequalLocalisationSyntax,
  };
}
function difference(left, right) {
  const exact = [],
    changed = [],
    missing = [],
    additional = [];
  for (const [id, values] of left) {
    const match = right.get(id);
    if (!match) missing.push(id);
    else if (values.length === match.length && values.every((x, i) => x === match[i]))
      exact.push(id);
    else changed.push(id);
  }
  for (const id of right.keys()) if (!left.has(id)) additional.push(id);
  return {
    original: left.size,
    generated: right.size,
    exact: exact.length,
    changed: changed.length,
    missing: missing.length,
    additional: additional.length,
    details: { changed, missing, additional },
  };
}
export function compareFiles(original, output) {
  const a = nativeInventory(original),
    b = nativeInventory(output);
  const definitions = difference(a.definitions, b.definitions),
    media = difference(a.media, b.media),
    translations = difference(a.translations, b.translations);
  const same = (r) => !r.changed && !r.missing && !r.additional;
  return {
    schema: 1,
    scope:
      "Ordered native definition bodies and data. Changed bodies require separate behavior oracles; matching names alone do not prove parity. Engine not run.",
    definitions,
    media,
    translations,
    unparsed: { original: a.unparsed, compiled: b.unparsed },
    unrecognizedTranslationLines: {
      original: a.unrecognizedTranslationLines,
      compiled: b.unrecognizedTranslationLines,
    },
    scriptFiles: { original: a.scriptPaths.length, compiled: b.scriptPaths.length },
    exactComparedContents:
      [definitions, media, translations].every(same) &&
      ![...a.unparsed, ...b.unparsed].length &&
      !a.unrecognizedTranslationLines &&
      !b.unrecognizedTranslationLines,
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { out: { type: "string" }, output: { type: "string" }, exact: { type: "boolean" } },
  });
  const [source, id] = positionals;
  if (!source || !id)
    throw Error(
      "Usage: node scripts/compare-rewrite.mjs <mods.zip|original-directory> <port> [--output built/mod] [--out report.json] [--exact]",
    );
  const output = values.output ?? join(portsRoot, id, "build", "mod");
  if (!existsSync(join(output, "descriptor.mod"))) throw Error("Build the port first.");
  const result = compareFiles(readOriginal(resolve(source), id), fileTree(resolve(output)));
  if (values.out) {
    mkdirSync(dirname(resolve(values.out)), { recursive: true });
    writeFileSync(values.out, JSON.stringify(result, null, 2) + "\n");
  }
  for (const [name, cmp] of Object.entries({
    definitions: result.definitions,
    media: result.media,
    translations: result.translations,
  }))
    console.log(id, name, JSON.stringify({ ...cmp, details: undefined }));
  if (values.exact && !result.exactComparedContents) process.exitCode = 1;
}
