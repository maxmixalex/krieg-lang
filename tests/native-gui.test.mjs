import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { compileProject, compileSource, emitCompileOutput } from "../dist/compiler/index.js";
import { DOMAIN_SCHEMA } from "../dist/compiler/domain-registry.js";

const repo = fileURLToPath(new URL("../", import.meta.url));
const fixture = "tests/fixtures/native-gui/controls.krg.tsx";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

test("original TSX samples cover every upstream CWT GUI kind and match the independently validated outputs", () => {
  const result = compileProject({ rootDir: repo, files: [fixture] });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  const upstreamControls = Object.entries(DOMAIN_SCHEMA.gui).filter(
    ([, control]) => control.validation !== "corpus-observed",
  );
  assert.equal(result.outputs.length, upstreamControls.length);
  const report = JSON.parse(
    fs.readFileSync(
      new URL("../reports/validation/gui-native-audit.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(
    report.fixtureSha256,
    sha256(fs.readFileSync(new URL(`../${fixture}`, import.meta.url))),
  );
  assert.equal(report.engineValidation, "not-run");
  assert.equal(report.summary.nativeCwtPassed, result.outputs.length);
  assert.equal(report.summary.ruleMatchPassed, result.outputs.length);
  for (const [native, control] of upstreamControls) {
    const audited = report.controls[native];
    assert.equal(audited.factory, control.name);
    assert.equal(audited.nativeCwt.passed, true, native);
    assert.deepEqual(audited.nativeCwt.diagnostics, [], native);
    assert.equal(audited.ruleMatch.passed, true, native);
    assert.ok(
      audited.ruleMatch.diagnostics.some((item) => item.message.includes(audited.ruleMatch.field)),
      native,
    );
    const output = result.outputs.find((output) => output.path === audited.path);
    assert.ok(output, native);
    assert.equal(
      sha256(emitCompileOutput(output)),
      audited.outputSha256,
      `Stale native evidence for ${native}`,
    );
  }
});

test("native GUI leaf children and fixed repeated-field cardinality are rejected before emission", () => {
  for (const factory of ["NativeText", "NativeIcon", "Checkbox"]) {
    const result = compileSource(
      `import {GuiFile,${factory},Button} from 'krieg-lang/ui';GuiFile('interface/bad.gui',<${factory} name="bad"><Button name="child" /></${factory}>);`,
      { fileName: "bad.krg.tsx" },
    );
    assert.equal(result.success, false, factory);
    assert.ok(
      result.diagnostics.some((diagnostic) => diagnostic.code.startsWith("TS")),
      factory,
    );
  }
  const schema = DOMAIN_SCHEMA.shapes.ScrollbarProps.guiButtonType;
  assert.equal(schema.minCount, 4);
  assert.equal(schema.maxCount, 4);
  const source = fs.readFileSync(new URL(`../${fixture}`, import.meta.url), "utf8");
  const malformed = source.replace(
    "guiButtonType={[",
    'guiButtonType={[{name:"extra",quadTextureSprite:"GFX_krieg_audit",position:{x:0,y:0}},',
  );
  assert.notEqual(malformed, source);
  const result = compileSource(malformed, { fileName: "too-many.krg.tsx" });
  assert.equal(result.success, false);
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.message.includes("at most 4")),
    JSON.stringify(result.diagnostics),
  );
});

test("legacy Window, TextBox and GuiButton cover every field observed in the native corpora without claiming upstream CWT validation", () => {
  const facts = JSON.parse(
    fs.readFileSync(new URL("../src/schema/hoi4-legacy-gui.json", import.meta.url), "utf8"),
  );
  const result = compileProject({
    rootDir: repo,
    files: ["tests/fixtures/native-gui/legacy.krg.tsx"],
  });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  assert.equal(result.outputs.length, 1);
  const blocks = new Map();
  function visit(items) {
    for (const item of items) {
      if (item.kind !== "property" || item.value.kind !== "block") continue;
      if (facts.controls[item.key.text]) blocks.set(item.key.text, item.value.items);
      visit(item.value.items);
    }
  }
  visit(result.outputs[0].document.items);
  for (const [native, fact] of Object.entries(facts.controls)) {
    assert.equal(DOMAIN_SCHEMA.gui[native].validation, "corpus-observed");
    const fields = DOMAIN_SCHEMA.shapes[DOMAIN_SCHEMA.gui[native].shape];
    assert.deepEqual(Object.keys(fields).sort(), Object.keys(fact.fields).sort());
    const items = blocks.get(native);
    assert.ok(items, native);
    for (const field of Object.values(fields))
      assert.ok(
        items.some((item) => item.kind === "property" && item.key.text === field.name),
        `${native}.${field.name}`,
      );
    const invalid = compileSource(
      `import {GuiFile,${fact.name}} from 'krieg-lang/ui';GuiFile('interface/invalid.gui',<${fact.name} name="bad" unknownLegacyProperty={1}/>);`,
      { fileName: "legacy-bad.krg.tsx" },
    );
    assert.equal(invalid.success, false, native);
    assert.ok(invalid.diagnostics.some((diagnostic) => diagnostic.code === "TS2322"));
  }
  const invalid = compileSource(
    `import {GuiFile,Window} from 'krieg-lang/ui';GuiFile('interface/invalid.gui',<Window name="bad" size={{width:10,height:20}}/>);`,
    { fileName: "legacy-bad.krg.tsx" },
  );
  assert.equal(invalid.success, false);
  assert.ok(invalid.diagnostics.some((diagnostic) => diagnostic.code.startsWith("TS")));
});
