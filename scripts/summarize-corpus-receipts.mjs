// Resume an interrupted release audit without claiming unexecuted corpus passes.
// Every input report requires an execution receipt tied to the same frozen runtime.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import * as prettier from "prettier";

const repo = fileURLToPath(new URL("..", import.meta.url));
const { values } = parseArgs({
  options: {
    raw: { type: "string" },
    out: { type: "string" },
    recovery: { type: "string" },
  },
});
if (!values.raw || !values.out)
  throw new Error(
    "Usage: node scripts/summarize-corpus-receipts.mjs --raw <receipt directory> --out <summary.json> [--recovery <recovery evidence.json>]",
  );
const digest = (value) => createHash("sha256").update(value).digest("hex");
const rawDirectory = resolve(values.raw);
// Receipts retain the actual invocation paths; evidence is read from the supplied
// archive directory so the audit can be replayed after moving that directory.
const evidencePath = (recordedPath) => join(rawDirectory, basename(recordedPath));
function runtimeManifest() {
  const root = join(repo, "dist"),
    files = [];
  function walk(parent) {
    for (const item of readdirSync(parent, { withFileTypes: true })) {
      const path = join(parent, item.name);
      if (item.isDirectory()) walk(path);
      else if (item.isFile())
        files.push({
          path: relative(root, path).split("\\").join("/"),
          sha256: digest(readFileSync(path)),
        });
    }
  }
  walk(root);
  files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return { files: files.length, sha256: digest(JSON.stringify(files)) };
}
const dist = runtimeManifest();
const baseline = JSON.parse(
  readFileSync(join(repo, "reports/validation/v0.2.0-corpus-summary.json"), "utf8"),
);
const datasets = [];
for (const name of ["kaiserreich", "tno", "vanilla"]) {
  const receiptPath = join(rawDirectory, `${name}.receipt.json`);
  const receiptBytes = readFileSync(receiptPath),
    receipt = JSON.parse(receiptBytes);
  assert.equal(receipt.schema, 1, `${name} receipt schema`);
  assert.equal(receipt.name, name, `${name} receipt identity`);
  assert.equal(receipt.nodeVersion, process.version, `${name} Node version`);
  assert.deepEqual(receipt.distBefore, dist, `${name} initial frozen runtime`);
  assert.deepEqual(receipt.distAfter, dist, `${name} final frozen runtime`);
  assert.equal(receipt.signal, null, `${name} process signal`);
  assert.equal(receipt.command.length, 8, `${name} must use the standard strict CLI`);
  assert.equal(receipt.command[2], "corpus");
  assert.deepEqual(receipt.command.slice(4, 7), ["--name", name, "--out"]);
  assert.ok(receipt.command[1].endsWith("/dist/cli.js"));
  if (receipt.origin === "recovered-from-observed-run") {
    assert.ok(
      receipt.log && receipt.observation,
      `${name} recovered receipt needs execution evidence`,
    );
    const log = readFileSync(evidencePath(receipt.log.path));
    assert.equal(digest(log), receipt.log.sha256, `${name} execution log hash`);
    assert.ok(
      log.toString("utf8").includes(`"report": ${JSON.stringify(receipt.command[7])}`),
      `${name} standard CLI report completion`,
    );
    assert.ok(
      log.toString("utf8").includes(receipt.log.completionMarker),
      `${name} completion marker`,
    );
  } else assert.equal(receipt.origin, "recorded-by-validation-runner");
  const raw = readFileSync(evidencePath(receipt.raw.path));
  assert.equal(digest(raw), receipt.raw.sha256, `${name} raw report hash`);
  const result = JSON.parse(raw),
    expected = baseline.datasets.find((entry) => entry.name === name);
  assert.equal(result.name, name);
  assert.equal(result.representation, "ordered-pdx");
  assert.equal(result.rootDir, receipt.command[3], `${name} actual CLI input`);
  assert.ok(Date.parse(result.completedAt) >= Date.parse(receipt.startedAt));
  assert.ok(Date.parse(result.completedAt) <= Date.parse(receipt.completedAt));
  assert.equal(receipt.exitCode, expected.exitCode, `${name} expected CLI exit`);
  assert.equal(
    receipt.exitCode,
    Object.values(result.levels).some((level) => level.failed > 0) ? 1 : 0,
  );
  assert.deepEqual(result.inventory, expected.inventory, `${name} fixed input inventory`);
  assert.deepEqual(result.levels, expected.levels, `${name} per-layer outcomes`);
  const inputFailurePaths = result.files
    .filter((file) => file.status === "input-parse-failed")
    .map((file) => file.path)
    .sort();
  assert.deepEqual(
    inputFailurePaths,
    [...expected.inputFailurePaths].sort(),
    `${name} parse failure paths`,
  );
  datasets.push({
    name,
    inventory: result.inventory,
    levels: result.levels,
    durationMs: result.durationMs,
    cliExit: receipt.exitCode,
    inputFailurePaths,
    ancillaryFailurePaths: result.files
      .filter((file) => file.status === "ancillary-syntax-diagnostics")
      .map((file) => file.path)
      .sort(),
    execution: {
      receiptOrigin: receipt.origin,
      receiptFile: basename(receiptPath),
      rawReportFile: basename(receipt.raw.path),
      logFile: receipt.log && basename(receipt.log.path),
      receiptSha256: digest(receiptBytes),
      rawReportSha256: receipt.raw.sha256,
      logSha256: receipt.log?.sha256,
      startedAt: receipt.startedAt,
      completedAt: receipt.completedAt,
      command: [
        "node",
        "$FROZEN_RUNTIME/dist/cli.js",
        "corpus",
        "$DATASET",
        "--name",
        name,
        "--out",
        "$RAW_REPORT",
      ],
    },
  });
}
assert.deepEqual(runtimeManifest(), dist, "Runtime changed during receipt verification");
const report = {
  version: JSON.parse(readFileSync(join(repo, "package.json"), "utf8")).version,
  startedAt: datasets.map((dataset) => dataset.execution.startedAt).sort()[0],
  completedAt: new Date().toISOString(),
  nodeVersion: process.version,
  typescriptVersion: JSON.parse(
    readFileSync(join(repo, "node_modules/typescript/package.json"), "utf8"),
  ).version,
  dist,
  distHashAlgorithm: "SHA-256 of compact JSON [{path,sha256},...] sorted by relative dist path",
  scope:
    "Full strict TypeScript compilation of ordered imports; canonical native semantic identity. Completed runs are independently revalidated from execution receipts, raw reports and fixed baseline inventories. No incomplete run is counted.",
  engineValidation: "not-run",
  ...(values.recovery
    ? { recovery: JSON.parse(readFileSync(resolve(values.recovery), "utf8")) }
    : {}),
  datasets,
  totals: Object.fromEntries(
    ["attempted", "passed", "failed", "skipped"].map((key) => [
      key,
      datasets.reduce((sum, dataset) => sum + dataset.levels.typescriptCompile[key], 0),
    ]),
  ),
};
const out = resolve(values.out);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  await prettier.format(JSON.stringify(report), {
    filepath: out,
    ...(await prettier.resolveConfig(out)),
  }),
);
console.log(
  `${report.totals.passed} strict TypeScript passes verified from three completed execution receipts.`,
);
