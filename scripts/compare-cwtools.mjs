#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const [binaryArg, rulesArg, originalArg, generatedArg, reportsArg, vanillaArg] =
  process.argv.slice(2);
if (!reportsArg) {
  console.error(
    "Usage: node scripts/compare-cwtools.mjs <cwtools> <rules-dir> <original-dir> <generated-dir> <reports-dir> [vanilla-dir]",
  );
  process.exit(2);
}
const binary = resolve(binaryArg),
  rules = resolve(rulesArg),
  original = resolve(originalArg),
  generated = resolve(generatedArg),
  reports = resolve(reportsArg);
mkdirSync(reports, { recursive: true });
const version = spawnSync(binary, ["--version"], { encoding: "utf8" });
if (version.error || version.status !== 0) throw version.error ?? new Error(version.stderr);
const executions = [];
for (const [name, directory] of [
  ["original", original],
  ["generated", generated],
]) {
  const args = [
    "validate",
    "--game",
    "hoi4",
    "--directory",
    directory,
    "--rules",
    rules,
    "--report-type",
    "json",
    "--output-file",
    join(reports, `${name}.json`),
  ];
  if (vanillaArg) args.push("--vanilla", resolve(vanillaArg), "--no-vanilla-cache");
  const start = Date.now(),
    result = spawnSync(binary, args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (result.error) throw result.error;
  writeFileSync(join(reports, `${name}.log`), result.stdout + result.stderr);
  executions.push({
    name,
    command: [binary, ...args],
    exitCode: result.status,
    durationMs: Date.now() - start,
  });
  // Exit 1 means diagnostics were found. Empty/incomplete runs are not success.
  if (result.status !== 0 && result.status !== 1)
    throw new Error(
      `CWTools ${name} validation failed with exit ${result.status}; see ${name}.log`,
    );
}
function read(name, root) {
  const diagnostics = JSON.parse(readFileSync(join(reports, `${name}.json`), "utf8"));
  if (!Array.isArray(diagnostics)) throw new Error("Expected CWTools JSON diagnostic array");
  const counts = new Map(),
    severities = {};
  for (const diagnostic of diagnostics) {
    const key = JSON.stringify({
      file: relative(root, diagnostic.file).replaceAll("\\", "/"),
      severity: diagnostic.severity,
      code: diagnostic.code,
      message: diagnostic.message,
    });
    counts.set(key, (counts.get(key) ?? 0) + 1);
    severities[diagnostic.severity] = (severities[diagnostic.severity] ?? 0) + 1;
  }
  return { total: diagnostics.length, severities, counts };
}
const before = read("original", original),
  after = read("generated", generated);
function difference(left, right) {
  return [...left]
    .filter(([key, count]) => count > (right.get(key) ?? 0))
    .map(([key, count]) => ({ ...JSON.parse(key), count: count - (right.get(key) ?? 0) }));
}
const summary = {
  formatVersion: 1,
  binaryVersion: version.stdout.trim(),
  binarySha256: createHash("sha256").update(readFileSync(binary)).digest("hex"),
  executions,
  comparison:
    "Multiset of relative path, severity, code, and message. Diagnostic line numbers and hashes are excluded, but line numbers embedded in message text remain visible.",
  original: { total: before.total, severities: before.severities },
  generated: { total: after.total, severities: after.severities },
  added: difference(after.counts, before.counts),
  removed: difference(before.counts, after.counts),
  engineValidation: "not-run",
};
writeFileSync(join(reports, "comparison.json"), JSON.stringify(summary, null, 2) + "\n");
console.log(
  JSON.stringify({
    original: summary.original,
    generated: summary.generated,
    added: summary.added.reduce((n, x) => n + x.count, 0),
    removed: summary.removed.reduce((n, x) => n + x.count, 0),
  }),
);
process.exitCode = summary.added.some((d) => d.severity === "Error") ? 1 : 0;
