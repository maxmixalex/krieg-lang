// Re-run the real CLI on the three fixed private inputs used for release regression testing.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import * as prettier from "prettier";
const repo = fileURLToPath(new URL("..", import.meta.url));
const { values } = parseArgs({
  options: {
    corpora: { type: "string" },
    "vanilla-root": { type: "string" },
    out: { type: "string" },
    raw: { type: "string" },
  },
});
if (!values.corpora)
  throw new Error(
    "Usage: node scripts/verify-supplied-corpora.mjs --corpora <directory> [--vanilla-root <freshly extracted vanilla>] [--raw <report directory>] [--out <summary.json>]",
  );
const version = JSON.parse(readFileSync(join(repo, "package.json"), "utf8")).version;
const raw = resolve(values.raw ?? join(repo, "reports/local", version));
mkdirSync(raw, { recursive: true });
const out = resolve(
  values.out ?? join(repo, "reports/validation", `v${version}-corpus-summary.json`),
);
const baseline = JSON.parse(
  readFileSync(join(repo, "reports/validation/v0.2.0-corpus-summary.json"), "utf8"),
);
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
function runtimeManifest() {
  const dir = join(repo, "dist");
  const files = [];
  function walk(parent) {
    for (const item of readdirSync(parent, { withFileTypes: true })) {
      const file = join(parent, item.name);
      if (item.isDirectory()) walk(file);
      else if (item.isFile())
        files.push({
          path: relative(dir, file).split("\\").join("/"),
          sha256: digest(readFileSync(file)),
        });
    }
  }
  walk(dir);
  files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return { files: files.length, sha256: digest(JSON.stringify(files)) };
}
const before = runtimeManifest();
const startedAt = new Date().toISOString();
const datasets = [];
for (const [name, fold] of [
  ["kaiserreich", "Kaiserreich"],
  ["tno", "TNO"],
  ["vanilla", "Hearts of Iron IV"],
]) {
  const expected = baseline.datasets.find((d) => d.name === name);
  const target = join(raw, `${name}.json`);
  // Never accept a previous successful report after a fresh process exits abnormally.
  // Keep the old report intact until this run has passed every comparison.
  const pending = mkdtempSync(join(raw, `${name}-`));
  const fresh = join(pending, "report.json");
  const command = [
    process.execPath,
    join(repo, "dist/cli.js"),
    "corpus",
    name === "vanilla" && values["vanilla-root"]
      ? resolve(values["vanilla-root"])
      : join(resolve(values.corpora), fold),
    "--name",
    name,
    "--out",
    fresh,
  ];
  const datasetStartedAt = new Date().toISOString();
  console.log(`Starting full ${name} corpus (strict TypeScript, native semantic roundtrip)`);
  try {
    const proc = spawnSync(command[0], command.slice(1), { cwd: repo, stdio: "inherit" });
    if (proc.error) throw proc.error;
    assert.equal(proc.signal, null, `${name} CLI terminated by signal`);
    assert.equal(proc.status, expected.exitCode, `${name} CLI exit`);
    const result = JSON.parse(readFileSync(fresh, "utf8"));
    assert.equal(result.name, name, `${name} report identity`);
    assert.equal(result.representation, "ordered-pdx", `${name} report representation`);
    assert.equal(
      proc.status,
      Object.values(result.levels).some((level) => level.failed > 0) ? 1 : 0,
      `${name} CLI exit must reflect recorded validation failures`,
    );
    assert.deepEqual(
      result.inventory,
      expected.inventory,
      `${name} input inventory differs from the supplied fixed snapshot`,
    );
    assert.deepEqual(result.levels, expected.levels, `${name} per-layer outcome differs`);
    const failures = result.files
      .filter((f) => f.status === "input-parse-failed")
      .map((f) => f.path)
      .sort();
    assert.deepEqual(
      failures,
      [...expected.inputFailurePaths].sort(),
      `${name} failing inputs differ`,
    );
    datasets.push({
      name,
      inventory: result.inventory,
      levels: result.levels,
      durationMs: result.durationMs,
      cliExit: proc.status,
      inputFailurePaths: failures,
      ancillaryFailurePaths: result.files
        .filter((f) => f.status === "ancillary-syntax-diagnostics")
        .map((f) => f.path)
        .sort(),
    });
    console.log(
      `Passed ${name}: ${result.levels.typescriptCompile.passed} scripts; recorded input failures unchanged.`,
    );
    renameSync(fresh, target);
    const after = runtimeManifest();
    assert.deepEqual(after, before, `${name} runtime changed during validation`);
    writeFileSync(
      join(raw, `${name}.receipt.json`),
      JSON.stringify(
        {
          schema: 1,
          name,
          origin: "recorded-by-validation-runner",
          startedAt: datasetStartedAt,
          completedAt: new Date().toISOString(),
          nodeVersion: process.version,
          command,
          exitCode: proc.status,
          signal: proc.signal,
          distBefore: before,
          distAfter: after,
          raw: { path: target, sha256: digest(readFileSync(target)) },
        },
        null,
        2,
      ) + "\n",
    );
  } finally {
    rmSync(pending, { recursive: true, force: true });
  }
}
assert.deepEqual(
  runtimeManifest(),
  before,
  "Dist was modified during validation; rebuild once and run again.",
);
const report = {
  version,
  startedAt,
  completedAt: new Date().toISOString(),
  nodeVersion: process.version,
  typescriptVersion: JSON.parse(
    readFileSync(join(repo, "node_modules/typescript/package.json"), "utf8"),
  ).version,
  dist: before,
  distHashAlgorithm: "SHA-256 of compact JSON [{path,sha256},...] sorted by relative dist path",
  scope:
    "Full strict TypeScript compilation of ordered imports; canonical native semantic identity. The supplied map supplements are separately validated as real map overlays, not mixed into this fixed regression input.",
  engineValidation: "not-run",
  datasets,
  totals: Object.fromEntries(
    ["attempted", "passed", "failed", "skipped"].map((k) => [
      k,
      datasets.reduce((s, d) => s + d.levels.typescriptCompile[k], 0),
    ]),
  ),
};
mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  await prettier.format(JSON.stringify(report), {
    filepath: out,
    ...(await prettier.resolveConfig(out)),
  }),
);
console.log(
  `${report.totals.passed} full TypeScript passes across three unchanged input snapshots.`,
);
