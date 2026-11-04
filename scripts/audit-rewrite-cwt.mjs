import { readFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { parseArgs } from "node:util";
import { inputs, hash, portsRoot, readOriginal } from "./rewrite-inputs.mjs";
import { oversizedFiles, prepareCwtoolsInputs } from "./lib/cwtools-inputs.mjs";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    corpora: { type: "string" },
    originals: { type: "string" },
    out: { type: "string" },
    "game-root": { type: "string" },
    "include-large-files": { type: "boolean", default: false },
  },
});
if (!values.corpora || !values.originals || !values.out)
  throw Error(
    "Usage: node scripts/audit-rewrite-cwt.mjs --corpora <cwtools bundle> --originals <unpacked mods> --out <summary.json> [--game-root <HOI4>] [--include-large-files] [port ...]",
  );
const cwd = resolve(values.corpora),
  exe = join(cwd, process.platform === "win32" ? "cwtools.exe" : "cwtools"),
  rules = join(cwd, "cwtools-hoi4-config-master/cwtools-hoi4-config-master"),
  base = resolve(values["game-root"] ?? join(cwd, "Hearts of Iron IV"));
const temp = mkdtempSync(join(tmpdir(), "krieg-ports-cwt-")),
  summary = {
    schema: 1,
    toolSha256: hash(readFileSync(exe)),
    scope:
      "External CWTools diagnostics using the same supplied rules and game base on both inputs. This does not execute the game or prove equal behavior.",
    ports: {},
  };
function run(id, label, root) {
  const dest = join(temp, id + "-" + label + ".json");
  const started = Date.now();
  console.log(`${id}: validating ${label}`);
  const child = spawnSync(
    exe,
    [
      "validate",
      "--game",
      "hoi4",
      "--directory",
      root,
      "--rules",
      rules,
      "--vanilla",
      base,
      "--no-vanilla-cache",
      "--report-type",
      "json",
      "--output-file",
      dest,
    ],
    { encoding: "utf8", timeout: 480000, maxBuffer: 64 * 1024 * 1024 },
  );
  if (child.error || ![0, 1].includes(child.status) || !existsSync(dest))
    throw Error(
      id +
        "/" +
        label +
        ": " +
        (child.error?.message ?? (child.stderr || child.stdout).slice(-500)),
    );
  const raw = JSON.parse(readFileSync(dest, "utf8"));
  if (!Array.isArray(raw)) throw Error("Unexpected CWTools report");
  const counts = {},
    examples = {},
    messages = new Map();
  for (const v of raw) {
    const sig = v.severity + ":" + v.code;
    counts[sig] = (counts[sig] ?? 0) + 1;
    examples[sig] ??= [];
    const location = {
      path: String(v.file ?? "")
        .replaceAll("\\", "/")
        .replace(root.replaceAll("\\", "/") + "/", "")
        .replace(base.replaceAll("\\", "/") + "/", "game/"),
      line: v.line,
      message: v.message,
    };
    if (examples[sig].length < 2) examples[sig].push(location);
    const key = JSON.stringify([v.severity, v.code, v.message]);
    const entry = messages.get(key) ?? {
      severity: v.severity,
      code: v.code,
      message: v.message,
      count: 0,
      examples: [],
    };
    entry.count++;
    if (entry.examples.length < 3) entry.examples.push(location);
    messages.set(key, entry);
  }
  return {
    exitCode: child.status,
    durationMs: Date.now() - started,
    diagnostics: raw.length,
    counts,
    examples,
    messages: [...messages.values()],
    omittedOversizedFiles: oversizedFiles(root),
  };
}
function difference(left, right) {
  const counts = new Map(
    right.messages.map((entry) => [
      JSON.stringify([entry.severity, entry.code, entry.message]),
      entry.count,
    ]),
  );
  return left.messages
    .map((entry) => ({
      ...entry,
      count:
        entry.count -
        (counts.get(JSON.stringify([entry.severity, entry.code, entry.message])) ?? 0),
    }))
    .filter((entry) => entry.count > 0);
}
try {
  for (const id of positionals.length ? positionals : Object.keys(inputs)) {
    readOriginal(resolve(values.originals), id);
    const oldRoot = resolve(values.originals, inputs[id].source),
      built = join(portsRoot, id, "build/mod");
    if (!existsSync(join(built, "descriptor.mod"))) throw Error(id + " needs a successful build.");
    const original = run(id, "original", oldRoot),
      rewrite = run(id, "rewrite", built);
    summary.ports[id] = {
      original,
      rewrite,
      comparison: "Diagnostic message multiset by severity and code, ignoring file and line.",
      added: difference(rewrite, original),
      removed: difference(original, rewrite),
    };
    if (
      values["include-large-files"] &&
      (original.omittedOversizedFiles.length || rewrite.omittedOversizedFiles.length)
    ) {
      const originalRoot = join(temp, `${id}-original-normalized`);
      const rewriteRoot = join(temp, `${id}-rewrite-normalized`);
      const changes = {
        original: prepareCwtoolsInputs(oldRoot, originalRoot),
        rewrite: prepareCwtoolsInputs(built, rewriteRoot),
      };
      const normalizedOriginal = run(id, "original-normalized", originalRoot);
      const normalizedRewrite = run(id, "rewrite-normalized", rewriteRoot);
      summary.ports[id].includingLargeFiles = {
        method:
          "Temporary copies compact oversized PDX whitespace and split at top-level definition boundaries, asserting identical PDX semantics. Localisation splits preserve the exact entry-line sequence and repeat the language header. Rules and original/build inputs are unchanged.",
        changes,
        original: normalizedOriginal,
        rewrite: normalizedRewrite,
        added: difference(normalizedRewrite, normalizedOriginal),
        removed: difference(normalizedOriginal, normalizedRewrite),
      };
    }
    console.log(
      id +
        " CWTools diagnostics: original " +
        original.diagnostics +
        ", rewrite " +
        rewrite.diagnostics,
    );
    mkdirSync(dirname(resolve(values.out)), { recursive: true });
    writeFileSync(resolve(values.out), JSON.stringify(summary, null, 2) + "\n");
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
