import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { importPdxToKrieg } from "../dist/importer/index.js";
import { semanticPdx } from "../dist/pdx/index.js";
import { compileCorpusBatch } from "../dist/corpus/compiler-runner.js";

test("isolated full TypeScript compiler preserves native ordered constructs", async () => {
  const fixtures = [
    [
      "events/test.txt",
      "add_namespace=demo country_event={id=demo.1 is_triggered_only=yes option={name=demo.a add_stability=0.05}}",
    ],
    [
      "interface/test.gfx",
      'spriteTypes={spriteType={name="GFX_one" texturefile="gfx/one.dds"} spriteType={name="GFX_two" texturefile="gfx/two.dds"}}',
    ],
    [
      "common/example/values.txt",
      '@value=3 colors={rgb{10 20 30} hsv{0.1 0.2 0.3}} limits={amount>3 amount<=8} text="a \\"quoted\\" word"',
    ],
  ];
  const inputs = fixtures.map(([path, text]) => {
    const imported = importPdxToKrieg(text, { outputPath: path });
    assert.equal(imported.diagnostics.length, 0);
    return {
      source: imported.source,
      sourcePath: path + ".krg.ts",
      outputPath: path,
      expectedSemanticHash: createHash("sha256")
        .update(JSON.stringify(semanticPdx(imported.document)))
        .digest("hex"),
    };
  });
  const outputs = await compileCorpusBatch(inputs);
  assert.equal(outputs.length, inputs.length);
  for (let i = 0; i < inputs.length; i++) {
    assert.equal(outputs[i].success, true, JSON.stringify(outputs[i].diagnostics));
    assert.equal(outputs[i].semanticHash, inputs[i].expectedSemanticHash);
  }
});

test("full compiler workers return type errors instead of treating source as passthrough", async () => {
  const [result] = await compileCorpusBatch([
    {
      source:
        'import * as pdx from "krieg-lang/pdx"; export default pdx.file("events/bad.txt", pdx.document([pdx.atom(42)]));',
      sourcePath: "bad.krg.ts",
      outputPath: "events/bad.txt",
      expectedSemanticHash: "invalid",
    },
  ]);
  assert.equal(result.success, false);
  assert(result.diagnostics.some((d) => d.code === "TS2345"));
});
