import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { buildProject, packProject, traceGameLog, traceOutput } from "../dist/project/index.js";
import { unzipSync } from "fflate";
const helper = `import type { CountryScope } from "krieg-lang/hoi4";
export function grant(c:CountryScope) {
  c.effects.addPoliticalPower(7);
  c.effects.setCountryFlag("trace_granted");
}`;
const main = `import {CountryEvent, DataFile} from "krieg-lang/hoi4";
import {grant} from "./helpers.krg.ts";
CountryEvent({id:"trace.1", hidden:true, isTriggeredOnly:true, immediate:(c)=>{
  if (c.politicalPower >= 5) {
    grant(c);
  }
  c.effects.addPoliticalPower(3);
}});
DataFile("common/test/merge.txt", {first:1});
DataFile("common/test/merge.txt", {second:2});`;
function fixture(t) {
  const p = mkdtempSync(join(tmpdir(), "krieg-trace-"));
  t.after(() => rmSync(p, { recursive: true, force: true }));
  mkdirSync(join(p, "src"));
  writeFileSync(join(p, "krgconfig.json"), JSON.stringify({ name: "trace-native" }));
  writeFileSync(join(p, "src/main.krg.ts"), main);
  writeFileSync(join(p, "src/helpers.krg.ts"), helper);
  return p;
}
const line = (text, needle) => {
  const i = text.split("\n").findIndex((l) => l.includes(needle));
  assert.notEqual(i, -1, needle);
  return i + 1;
};
test("game diagnostics trace helper expansions and merged entries to their actual authoring lines", (t) => {
  const project = fixture(t),
    r = buildProject(project);
  assert.equal(r.success, true, JSON.stringify(r.diagnostics));
  const file = r.files.find((f) => f.path.startsWith("events/")).path;
  const text = readFileSync(join(r.outDir, file), "utf8");
  const hit = traceOutput(project, file, line(text, "add_political_power = 7"));
  assert.equal(hit.source, "src/helpers.krg.ts");
  assert.equal(hit.line, line(helper, "addPoliticalPower"));
  assert.equal(hit.precision, "expression");
  assert.equal(hit.via[0].source, "src/main.krg.ts");
  assert.equal(hit.via[0].line, line(main, "grant(c);"));
  const direct = traceOutput(project, file, line(text, "add_political_power = 3"));
  assert.equal(direct.line, line(main, "addPoliticalPower(3)"));
  assert.equal(direct.source, "src/main.krg.ts");
  const doc = traceOutput(project, file, line(text, "country_event ="));
  assert.equal(doc.precision, "declaration");
  assert.equal(doc.line, line(main, "CountryEvent({"));
  assert.equal(traceOutput(project, "common/test/merge.txt", 2).line, line(main, "{second:2}"));
  const cli = spawnSync(
    process.execPath,
    ["dist/cli.js", "trace", project, "--at", `${file}:${hit.generatedLine}`, "--json"],
    { encoding: "utf8" },
  );
  assert.equal(cli.status, 0, cli.stderr);
  assert.deepEqual(JSON.parse(cli.stdout), hit);
  assert.throws(() => traceOutput(project, file, 99999), /outside/);
  assert.throws(() => traceOutput(project, "../foo.txt", 1), /Unsafe/);
  writeFileSync(join(r.outDir, file), "changed\n" + text);
  assert.throws(() => traceOutput(project, file, 1), /changed since/);
});
test("authoring metadata stays outside distributable ZIPs and failed builds retain matching maps", (t) => {
  const project = fixture(t);
  const packed = packProject(project, join(project, "release.zip"));
  assert.ok(packed.archive, JSON.stringify(packed.build.diagnostics));
  const paths = Object.keys(unzipSync(readFileSync(packed.archive)));
  assert.ok(!paths.some((p) => p.includes(".krieg-build") || p.endsWith(".map.json")));
  const before = readFileSync(join(packed.build.outDir, ".krieg-build.json"), "utf8");
  writeFileSync(join(project, "src/main.krg.ts"), 'const broken: number = "x";');
  assert.equal(buildProject(project).success, false);
  assert.equal(readFileSync(join(packed.build.outDir, ".krieg-build.json"), "utf8"), before);
});
test("validated output hooks support previews without writing files or mutating native output", (t) => {
  const project = fixture(t);
  let file, expected;
  const result = buildProject(project, {
    check: true,
    onOutput(out) {
      if (out.path.startsWith("events/")) {
        file = out.path;
        expected = out.readText();
        out.readBytes().fill(0);
        assert.equal(out.readText(), expected);
      }
    },
  });
  assert.ok(result.success, JSON.stringify(result.diagnostics));
  assert.ok(file);
  assert.ok(!existsSync(result.outDir));
  writeFileSync(join(project, "src/main.krg.ts"), 'const x: number = "wrong";');
  let calls = 0;
  assert.equal(
    buildProject(project, {
      check: true,
      onOutput() {
        calls++;
      },
    }).success,
    false,
  );
  assert.equal(calls, 0);
});

test("bulk game logs retain foreign records, skip C++ lines, and resolve merged Lua definitions", (t) => {
  const project = fixture(t);
  const defines = `import {DefineFile} from "krieg-lang/hoi4";
DefineFile("common/defines/tune.lua",{NDefines:{NGame:{EVENT_TIMEOUT_DEFAULT:14}}});
DefineFile("common/defines/tune.lua",{NDefines:{NGame:{START_DATE:"1936.1.1.12"}}});`;
  writeFileSync(join(project, "src/tune.krg.ts"), defines);
  const r = buildProject(project);
  assert.ok(r.success, JSON.stringify(r.diagnostics));
  const file = "common/defines/tune.lua",
    body = readFileSync(join(r.outDir, file), "utf8");
  const first = line(body, "EVENT_TIMEOUT_DEFAULT"),
    second = line(body, "START_DATE");
  const log = [
    "[persistent.cpp:120] only an engine message",
    `file: "${file}", near line: ${second}`,
    `${file.replaceAll("/", "\\")}:${first}`,
    "invalid effect at events/a foreign mod.txt line: 4",
    `${file}:9999`,
  ].join("\r\n");
  const rows = traceGameLog(project, log);
  assert.deepEqual(
    rows.map((r) => r.logLine),
    [2, 3, 4, 5],
  );
  assert.equal(rows[0].location.line, line(defines, "START_DATE"));
  assert.equal(rows[1].location.line, line(defines, "EVENT_TIMEOUT_DEFAULT"));
  assert.equal(rows[0].location.precision, "declaration");
  assert.equal(rows[2].path, "events/a foreign mod.txt");
  assert.match(rows[2].reason, /No such output/);
  assert.match(rows[3].reason, /outside/);
  const input = join(project, "error.log");
  writeFileSync(input, log);
  const cli = spawnSync(
    process.execPath,
    ["dist/cli.js", "trace", project, "--log", input, "--json"],
    { encoding: "utf8" },
  );
  assert.equal(cli.status, 0, cli.stderr);
  assert.deepEqual(JSON.parse(cli.stdout), rows);
});
