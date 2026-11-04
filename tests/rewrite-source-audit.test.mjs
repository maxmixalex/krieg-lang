import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { auditRewriteSources } from "../scripts/lib/rewrite-source-audit.mjs";
import { inputs, portsRoot } from "../scripts/rewrite-inputs.mjs";

function audit(source) {
  const directory = mkdtempSync(join(tmpdir(), "krieg-source-audit-"));
  try {
    writeFileSync(join(directory, "main.krg.ts"), source);
    return auditRewriteSources(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("all six public rewrites use typed authoring imports", () => {
  for (const id of Object.keys(inputs)) {
    const result = auditRewriteSources(join(portsRoot, id, "src"));
    assert.ok(result.files > 0, id);
    assert.ok(result.linesIncludingCommentsAndData > 0, id);
  }
});

test("rewrite source audit rejects generic native writers and syntax escapes, including aliases", () => {
  for (const symbol of ["SourceFile", "PdxFile", "DataFile", "RawFile", "cwt", "MetaEffect"])
    for (const declaration of [
      `import { ${symbol} } from "krieg-lang/hoi4";`,
      `import { ${symbol} as other } from "krieg-lang/hoi4";`,
      `export { ${symbol} as other } from "krieg-lang/hoi4";`,
    ])
      assert.throws(() => audit(declaration), /Native syntax escapes/, declaration);
});

test("rewrite source audit rejects namespace, dynamic, and out-of-tree import bypasses", () => {
  for (const source of [
    'import { parse } from "krieg-lang/pdx";',
    'export * from "krieg-lang/pdx";',
    'import { pdx } from "krieg-lang";',
    'import * as sdk from "krieg-lang/hoi4"; sdk.SourceFile("a", []);',
    'import * as sdk from "krieg-lang/hoi4"; sdk["SourceFile"]("a", []);',
    'export * from "krieg-lang/hoi4";',
    'import("krieg-lang/hoi4");',
    'const sdk = require("krieg-lang/hoi4");',
    'import sdk = require("krieg-lang/hoi4");',
    'import { helper } from "../outside.krg.ts";',
    'import { helper } from "./hidden.mjs";',
  ])
    assert.throws(() => audit(source), /source|rewrite|SDK/, source);
});

test("rewrite source audit retains literal facts and counts data and comments", () => {
  const result = audit(
    'import { ScriptedEffect as Effect } from "krieg-lang/hoi4";\n' +
      'import { Window } from "krieg-lang/ui";\n' +
      'import { facts } from "./facts.krg.ts";\n' +
      "// Native-looking text is ordinary data here.\n" +
      'const labels = ["SourceFile", "MetaEffect", "cwt"];\n',
  );
  assert.deepEqual(result, { files: 1, linesIncludingCommentsAndData: 5, tableFilenameCount: 0 });
});
