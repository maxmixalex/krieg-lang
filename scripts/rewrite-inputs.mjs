// Reproduce the media and translated strings of a worked port without distributing the upstream mod.
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  statSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { unzipSync } from "fflate";

export const portsRoot = fileURLToPath(new URL("../examples/rewrites/", import.meta.url));
export const inputs = JSON.parse(readFileSync(join(portsRoot, "inputs.json"), "utf8"));
export const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
export function fileTree(dir) {
  const rows = new Map();
  function visit(parent) {
    for (const name of readdirSync(join(dir, parent))) {
      const key = parent ? parent + "/" + name : name;
      const stat = lstatSync(join(dir, key));
      if (stat.isSymbolicLink()) throw new Error("Refusing symlink in input: " + key);
      if (stat.isDirectory()) visit(key);
      else if (stat.isFile()) rows.set(key, readFileSync(join(dir, key)));
    }
  }
  visit("");
  return rows;
}
function safe(key) {
  const parts = key.replace(/\/$/, "").split("/");
  if (
    !key ||
    key.includes("\\") ||
    key.includes(":") ||
    parts.some(
      (part) =>
        !part || part === ".." || part === "." || part === "__proto__" || /[\x00-\x1F]/.test(part),
    )
  )
    throw new Error("Unsafe archive path: " + JSON.stringify(key));
  return key;
}
function archive(bytes, only) {
  let count = 0;
  const unpacked = unzipSync(bytes, {
    filter(info) {
      safe(info.name);
      if (only && info.name !== only) return false;
      count += info.originalSize;
      if (count > 256 * 1024 * 1024) throw new Error("Input exceeds the supported archive size");
      return !info.name.endsWith("/");
    },
  });
  return new Map(Object.entries(unpacked));
}
export function readOriginal(source, id) {
  if (!Object.hasOwn(inputs, id)) throw new Error("Unknown port " + id);
  const meta = inputs[id];
  let rows;
  if (statSync(source).isDirectory())
    rows = fileTree(existsSync(join(source, meta.source)) ? join(source, meta.source) : source);
  else {
    const bytes = readFileSync(source),
      name = meta.source + ".zip";
    const inner = hash(bytes) === meta.zipSha256 ? bytes : archive(bytes, name).get(name);
    if (!inner || hash(inner) !== meta.zipSha256)
      throw new Error("Archive does not contain the pinned " + name + " revision.");
    rows = archive(inner);
  }
  const tree = hash(
    [...rows.keys()]
      .sort()
      .map((k) => safe(k) + "\0" + hash(rows.get(k)) + "\n")
      .join(""),
  );
  if (rows.size !== meta.inputFiles || tree !== meta.treeSha256)
    throw new Error(
      "The original " + meta.source + " differs from the pinned case study. No files were written.",
    );
  return rows;
}
// Native script, UI declarations, Lua and sound/sprite registrations are deliberately outside this allowlist.
export const dataFile = (k) =>
  /\.(?:dds|tga|png|jpe?g|wav|ogg|bmp|ttf|otf|mesh|anim)$/i.test(k) ||
  /^localisation\/.+\.yml$/i.test(k);
/** Preserve upstream text and byte encoding; give flush-left localisation entries
 * the indentation used by native Krieg output. Quoted text and comments are untouched. */
export function restoreDataFile(key, bytes) {
  if (!/^localisation\/.+\.yml$/i.test(key)) return bytes;
  const original = Buffer.from(bytes);
  const source = original.toString("latin1");
  let clean = source.replace(/^([A-Za-z0-9_.-]+:\d*[ \t]+")/gm, " $1");
  // This particular upstream revision lacks the closing quote of one Japanese label.
  // The byte digest prevents this targeted repair from being applied to later translations.
  if (
    key === "localisation/TWR_GDP_l_japanese.yml" &&
    hash(original) === "3d16af7938d36f7e3a55d7316069c5f657acd0d57279676dbb66b7e08a5958c1"
  )
    clean = clean.replace(/^( MAPMODE_TWR_GOVERNMENT_TYPE_MAP_MODE:0 "[^"\r\n]*)(?=\r?$)/m, '$1"');
  // These four pinned upstream files each repeat two casino menu keys with
  // different text. Retain their alternatives under a namespaced key rather
  // than dropping a translation. The menu file owns the unsuffixed names.
  const alternate = {
    f31df9fbd0ea84e27fd7052425677bd03968cf500cd4aaba960ab38756ed938a: "blackjack",
    "050c50990def440cd093851a9375b14f4077b83129eaa423ace9626337b05ffd": "roulette",
    b8402c15d194fe018e8925e73ce0ad52d83083dd964e44750632f2c219dcca44: "blackjack",
    "1b98ea0204b272e7a17ad84890027272931570400a9bd505693998f1c90f8225": "roulette",
  }[hash(original)];
  if (alternate)
    clean = clean.replace(
      new RegExp("^([ \\t]*)(" + alternate + "_(?:on|off)):", "gm"),
      "$1krg_gamble_alternate_$2:",
    );
  return source === clean ? bytes : Buffer.from(clean, "latin1");
}

export function hydrate(source, id, project = join(portsRoot, id)) {
  const rows = readOriginal(source, id),
    target = join(project, "original-assets"),
    marker = join(project, ".hydrated-input.json");
  mkdirSync(project, { recursive: true });
  if (
    existsSync(target) &&
    (!existsSync(marker) ||
      JSON.parse(readFileSync(marker, "utf8")).port !== id ||
      lstatSync(target).isSymbolicLink())
  )
    throw new Error("Unmanaged original-assets directory: " + target);
  const temp = mkdtempSync(join(project, ".hydrate-")),
    stage = join(temp, "new"),
    old = join(temp, "previous");
  mkdirSync(stage);
  let count = 0;
  try {
    for (const [key, bytes] of rows)
      if (dataFile(key)) {
        const outputKey =
          id === "hearts-of-gamble" &&
          key === "localisation/simp_chinese/casino_l_english.yml" &&
          hash(bytes) === "98e970d7f8f9ab5cf97037991a7e9bf8d7d14cb3dd97c67681c696a5ba26191f"
            ? "localisation/simp_chinese/casino_l_simp_chinese.yml"
            : key;
        const out = join(stage, outputKey);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, restoreDataFile(key, bytes));
        count++;
      }
    if (existsSync(target)) renameSync(target, old);
    try {
      renameSync(stage, target);
    } catch (e) {
      if (existsSync(old)) renameSync(old, target);
      throw e;
    }
    writeFileSync(
      marker,
      JSON.stringify({ port: id, sourceTree: inputs[id].treeSha256, dataFiles: count }, null, 2) +
        "\n",
    );
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
  return count;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [source, ...names] = process.argv.slice(2);
  if (!source)
    throw new Error(
      "Usage: node scripts/rewrite-inputs.mjs <mods.zip|original-directory> [port ...]",
    );
  for (const id of names.length ? names : Object.keys(inputs))
    console.log(
      id +
        ": restored " +
        hydrate(resolve(source), id) +
        " media/translation files; zero native scripts copied",
    );
}
