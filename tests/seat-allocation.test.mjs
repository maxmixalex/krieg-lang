import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { compileSource } from "../dist/compiler/index.js";
import { properties, RewriteModel } from "../scripts/lib/rewrite-model.mjs";

test("the shipped TWR example redistributes seats on repeated calls and only saves the three totals", () => {
  const source = readFileSync(
    new URL("../examples/rewrites/twr-gdp-screen/src/seat-allocation.krg.ts", import.meta.url),
    "utf8",
  );
  const compiled = compileSource(source);
  assert.ok(compiled.success, JSON.stringify(compiled.diagnostics));
  const definitions = Object.fromEntries(
    compiled.outputs.flatMap((output) =>
      properties(output.document).map((p) => [p.key.text, p.value]),
    ),
  );
  const model = new RewriteModel(
    {
      countries: [{ tag: "AAA", variables: { variable_1: 35, variable_2: 40, variable_3: 25 } }],
      states: [],
      global: {},
    },
    definitions,
  );
  const ctx = model.context();
  for (const expected of [
    [30, 50, 20],
    [25, 60, 15],
  ]) {
    model.run("example_sum_cap_usage", ctx);
    assert.deepEqual(ctx.current.variables, {
      variable_1: expected[0],
      variable_2: expected[1],
      variable_3: expected[2],
    });
  }
});
