import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { compileProject } from "../dist/compiler/index.js";
import { emitCompileOutput } from "../dist/compiler/index.js";

const repo = fileURLToPath(new URL("../", import.meta.url));
const fixtures = path.join(repo, "tests/fixtures/native-domains");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const read = (file) => readFileSync(path.join(repo, file));

// Expected hashes come from an external native-validator run. This test never regenerates them.
test("audited native domain fixtures retain their reviewed paths and output hashes", () => {
  const report = JSON.parse(read("reports/validation/domain-native-audit.json"));
  const schema = JSON.parse(read("src/schema/hoi4-domains.json"));
  const manifest = JSON.parse(read("tests/fixtures/native-domains/manifest.json"));
  assert.equal(report.compilation.success, true);
  assert.equal(report.summary.nativeCwtFailed, 0);
  assert.equal(report.summary.addedDiagnostics, 0);
  assert.equal(report.engineValidation, "not-run");
  assert.equal(
    report.schemaSha256,
    hash(read("src/schema/hoi4-domains.json")),
    "Native schema changed; rerun the explicit external native audit.",
  );
  assert.equal(
    report.fixtureManifestSha256,
    hash(read("tests/fixtures/native-domains/manifest.json")),
  );
  assert.deepEqual(Object.keys(report.domains).sort(), Object.keys(schema.definitions).sort());
  for (const support of report.supportFiles) {
    assert.equal(
      hash(readFileSync(path.join(fixtures, support.path))),
      support.sha256,
      `Audited support asset changed: ${support.path}`,
    );
  }
  const supportFiles = readdirSync(path.join(fixtures, "support"), {
    recursive: true,
    withFileTypes: true,
  }).filter((entry) => entry.isFile());
  assert.equal(
    supportFiles.length,
    report.supportFiles.length,
    "New support files require a fresh external audit.",
  );
  const files = Object.keys(report.domains).map((name) => manifest.domains[name].file);
  const result = compileProject({ rootDir: fixtures, files });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  const actual = new Map(
    result.outputs.map((output) => {
      assert.equal(output.representation, "schema-native");
      return [output.path, hash(emitCompileOutput(output))];
    }),
  );
  assert.equal(actual.size, result.outputs.length, "Native outputs must have unique paths.");
  let expectedCount = 0;
  for (const [name, domain] of Object.entries(report.domains)) {
    assert.equal(
      hash(read(domain.fixture)),
      domain.fixtureSha256,
      `${name}: fixture changed without native review`,
    );
    assert.equal(
      domain.nativeCwt.passed,
      true,
      `${name}: positive native validation was not reviewed`,
    );
    assert.equal(
      domain.ruleMatch.passed,
      true,
      `${name}: native negative probe did not match a rule`,
    );
    assert.ok(
      domain.ruleMatch.diagnostics.length > 0,
      `${name}: missing external negative evidence`,
    );
    if (domain.ruleCorrections.length) {
      assert.equal(
        domain.originalRuleMatch.passed,
        false,
        `${name}: correction provenance must remain explicit`,
      );
    } else {
      assert.equal(
        domain.originalNativeCwt.passed,
        true,
        `${name}: original upstream rules did not pass`,
      );
    }
    for (const output of domain.outputs) {
      assert.equal(
        actual.get(output.path),
        output.sha256,
        `${name}: reviewed native output changed at ${output.path}`,
      );
      expectedCount++;
    }
  }
  assert.equal(actual.size, expectedCount);
});
