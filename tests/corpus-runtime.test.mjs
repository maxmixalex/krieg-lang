import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { corpusRuntimeArguments } from "../dist/corpus/compiler-runner.js";

const cli = fileURLToPath(new URL("../dist/cli.js", import.meta.url));

test("corpus runtime defaults preserve explicit Node heap choices", () => {
  assert.deepEqual(corpusRuntimeArguments([], undefined, false), [
    "--expose-gc",
    "--max-old-space-size=3072",
  ]);
  for (const args of [
    ["--max-old-space-size=1024"],
    ["--max_old_space_size", "1024"],
    ["--max-old-space-size-percentage=50"],
    ["--max-heap-size=2048"],
  ]) {
    assert.deepEqual(corpusRuntimeArguments(args, undefined, false), [...args, "--expose-gc"]);
    assert.equal(corpusRuntimeArguments(args, undefined, true), undefined);
  }
  for (const options of [
    "--max-old-space-size=1024",
    '"--max_old_space_size=1024"',
    "--max-old-space-size-percentage=50",
    "--max-heap-size=2048",
  ]) {
    assert.deepEqual(corpusRuntimeArguments([], options, false), ["--expose-gc"]);
    assert.equal(corpusRuntimeArguments([], options, true), undefined);
  }
});

test("official no-flag corpus CLI configures its parent, collects before workers, and compiles", () => {
  // Spaces exercise argument-array and NODE_OPTIONS quoting on every platform.
  const temporary = mkdtempSync(join(tmpdir(), "krieg corpus runtime "));
  try {
    const input = join(temporary, "input");
    mkdirSync(join(input, "events"), { recursive: true });
    writeFileSync(
      join(input, "events", "example.txt"),
      "alpha = { repeated = first repeated = second }\n",
    );
    const probe = join(temporary, "runtime probe.cjs");
    writeFileSync(
      probe,
      `
const fs = require('node:fs');
const v8 = require('node:v8');
const log = value => fs.appendFileSync(process.env.KRIEG_TEST_RUNTIME_LOG, JSON.stringify(value) + '\\n');
log({ kind:'startup', pid:process.pid, argv:process.argv, execArgv:process.execArgv,
  nodeOptions:process.env.NODE_OPTIONS, gcExposed:typeof global.gc === 'function',
  heapLimitMiB:Math.round(v8.getHeapStatistics().heap_size_limit / 1024 / 1024) });
if (typeof global.gc === 'function') {
  const collect = global.gc;
  global.gc = (...args) => { log({ kind:'gc', pid:process.pid }); return collect(...args); };
}
`,
    );
    for (const [name, heap] of [
      ["default", ""],
      ["explicit", "--max-old-space-size=384"],
    ]) {
      const log = join(temporary, `${name}.jsonl`);
      const reportPath = join(temporary, `${name}.json`);
      const env = {
        ...process.env,
        NODE_OPTIONS: `${heap} --require ${JSON.stringify(probe)}`.trim(),
        KRIEG_TEST_RUNTIME_LOG: log,
      };
      delete env.KRIEG_CORPUS_RUNTIME_REEXEC;
      const child = spawnSync(
        process.execPath,
        [cli, "corpus", input, "--out", reportPath, "--json"],
        { env, encoding: "utf8", timeout: 60_000 },
      );
      assert.equal(child.error, undefined);
      assert.equal(child.status, 0, child.stderr);
      const report = JSON.parse(readFileSync(reportPath, "utf8"));
      assert.equal(report.levels.typescriptCompile.passed, 1);
      assert.equal(report.levels.typescriptCompile.failed, 0);
      assert.equal(report.files[0].status, "typescript-compiled-semantic-match");
      const entries = readFileSync(log, "utf8")
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
      const parents = entries.filter(
        (entry) => entry.kind === "startup" && resolve(entry.argv[1]) === cli,
      );
      assert.equal(parents.length, 2, "exactly one corpus relaunch");
      assert.equal(parents[0].gcExposed, false);
      assert.equal(parents[1].gcExposed, true);
      assert.equal(parents[1].execArgv.includes("--max-old-space-size=3072"), name === "default");
      if (name === "explicit")
        assert.ok(
          parents[1].heapLimitMiB < 1000,
          "explicit 384 MiB old-space choice remains active",
        );
      const workerIndex = entries.findIndex(
        (entry) => entry.kind === "startup" && entry.argv[1].endsWith("compiler-worker.js"),
      );
      assert.ok(workerIndex >= 0);
      assert.ok(entries[workerIndex].execArgv.includes("--max-old-space-size=5632"));
      const gcIndex = entries.findIndex(
        (entry) => entry.kind === "gc" && entry.pid === parents[1].pid,
      );
      assert.ok(gcIndex >= 0, "the relaunched parent performs collection");
      assert.ok(gcIndex < workerIndex, "collection precedes the compiler worker");
    }
    const versionLog = join(temporary, "version.jsonl");
    const versionEnv = {
      ...process.env,
      NODE_OPTIONS: `--require ${JSON.stringify(probe)}`,
      KRIEG_TEST_RUNTIME_LOG: versionLog,
    };
    delete versionEnv.KRIEG_CORPUS_RUNTIME_REEXEC;
    const version = spawnSync(process.execPath, [cli, "--version"], {
      env: versionEnv,
      encoding: "utf8",
      timeout: 30_000,
    });
    assert.equal(version.error, undefined);
    assert.equal(version.status, 0, version.stderr);
    assert.equal(version.stdout.trim(), "0.1.0");
    const versionEntries = readFileSync(versionLog, "utf8")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(versionEntries.length, 1, "non-corpus commands do not relaunch or collect");
    assert.equal(versionEntries[0].gcExposed, false);
    assert.deepEqual(versionEntries[0].execArgv, []);
    writeFileSync(join(input, "events", "example.txt"), "broken = {");
    const env = { ...process.env, NODE_OPTIONS: "" };
    delete env.KRIEG_CORPUS_RUNTIME_REEXEC;
    const failed = spawnSync(
      process.execPath,
      [cli, "corpus", input, "--out", join(temporary, "failed.json")],
      { env, encoding: "utf8", timeout: 30_000 },
    );
    assert.equal(failed.error, undefined);
    assert.equal(failed.status, 1, "input-failure exit status survives the launcher");
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
