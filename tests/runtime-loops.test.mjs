import assert from "node:assert/strict";
import test from "node:test";
import { ESLint } from "eslint";
import { compileSource } from "../dist/compiler/index.js";
import plugin from "../dist/eslint/index.js";
import { parsePdx } from "../dist/pdx/index.js";
import { RewriteModel, properties } from "../scripts/lib/rewrite-model.mjs";

const imports = 'import {ScriptedEffect,ScriptedTrigger} from "krieg-lang/hoi4";';

test("counted loops recheck changed bounds, run updates after the body, and isolate nested counters", () => {
  const compiled = compileSource(
    imports +
      `
    ScriptedEffect("count", c => {
      let limit = c.variable("limit");
      let sum = 0;
      for (let i = 0; i < limit; i++) {
        limit--;
        for (let j = 2; j > 0; j -= 1) { sum += i; }
      }
      while (sum > 6) { sum -= 2; }
      c.setVariable("result", sum);
    });`,
  );
  assert.ok(compiled.success, JSON.stringify(compiled.diagnostics));
  const defs = Object.fromEntries(
    compiled.outputs.flatMap((o) => properties(o.document).map((p) => [p.key.text, p.value])),
  );
  for (const [limit, expected] of [
    [0, 0],
    [1, 0],
    [3, 2],
    [7, 6],
  ]) {
    const model = new RewriteModel(
      { countries: [{ tag: "AAA", variables: { limit } }], states: [], global: {} },
      defs,
    );
    const ctx = model.context();
    model.run("count", ctx);
    assert.equal(ctx.current.variables.result, expected);
  }
});

test("unsupported loop forms and control transfers fail at their source locations", () => {
  for (const [source, message] of [
    [
      'ScriptedEffect("x", c => { for (;;) { c.addVariable("v", 1); } });',
      /initialized let counter/,
    ],
    ['ScriptedEffect("x", c => { let other=0; for (let i=0; i<2; other++) {} });', /their counter/],
    ['ScriptedEffect("x", c => { const again=true; while (again) {} });', /can become false/],
    ['ScriptedEffect("x", c => { while(c.variable("v") > 0){ return; } });', /[Ee]arly returns/],
    ['ScriptedEffect("x", c => { while(c.variable("v") > 0){ break; } });', /break statements/],
    ['ScriptedEffect("x", c => { for(let i=0;i<2;i++){ continue; } });', /continue statements/],
    [
      'ScriptedTrigger("x", c => { while(c.variable("v") > 0) {} return true; });',
      /effect callback/,
    ],
    ["while (false) {}", /outside effect callbacks/],
  ]) {
    const result = compileSource(imports + "\n" + source);
    assert.equal(result.success, false, source);
    assert.ok(
      result.diagnostics.some((d) => d.line === 2 && message.test(d.message)),
      JSON.stringify(result.diagnostics),
    );
  }
});

test("loop syntax diagnostics agree with ESLint for unsupported control transfers", async () => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [plugin.configs.recommended],
  });
  const [valid] = await eslint.lintText(
    imports +
      `ScriptedEffect('x', c => {
    for(let i=0;i<2;i++) c.addVariable('result', 1);
  });`,
    { filePath: "loops.krg.ts" },
  );
  assert.deepEqual(valid.messages, []);
  for (const control of ["break", "continue"]) {
    const [invalid] = await eslint.lintText(
      imports +
        `ScriptedEffect('x', c => {
      while(c.variable('running') > 0) { ${control}; }
    });`,
      { filePath: "loops.krg.ts" },
    );
    assert.ok(
      invalid.messages.some(
        (message) =>
          message.ruleId === "krieg/supported-syntax" &&
          message.message.includes(control + " statements"),
      ),
    );
  }
});

test("generated nested loops isolate native break variables and reset them on repeat calls", () => {
  const compiled = compileSource(
    imports +
      `
    ScriptedEffect('isolate', c => {
      c.setTempVariable('break', 1);
      let count = 0;
      for (let i = 0; i < 3; i++) {
        let j = 0;
        while (j < 2) {
          c.setTempVariable('break', 1);
          count++;
          j++;
        }
      }
      c.setVariable('result', count);
    });`,
  );
  assert.ok(compiled.success, JSON.stringify(compiled.diagnostics));
  const definitions = Object.fromEntries(
    compiled.outputs.flatMap((output) =>
      properties(output.document).map((property) => [property.key.text, property.value]),
    ),
  );
  const model = new RewriteModel(
    { countries: [{ tag: "AAA", variables: {} }], states: [], global: {} },
    definitions,
  );
  const ctx = model.context();
  model.run("isolate", ctx);
  assert.equal(ctx.current.variables.result, 6);
  assert.equal(model.temp.break, 1);
  const guards = Object.keys(model.temp).filter((name) => name.includes("_loop_break_"));
  assert.equal(guards.length, 2);
  for (const name of guards) model.temp[name] = 1;
  model.run("isolate", ctx);
  assert.equal(ctx.current.variables.result, 6);
  assert.ok(guards.every((name) => model.temp[name] === 0));
});

test("the native loop oracle honors default and explicit break variables", () => {
  const source = parsePdx(`
    set_variable = { var = break value = 1 }
    for_loop_effect = {
      start = 0 end = 2
      add_to_variable = { var = warmup value = 1 }
    }
    for_loop_effect = {
      start = 0 end = 5
      add_to_variable = { var = count value = 1 }
      set_temp_variable = { var = break value = 1 }
    }
    while_loop_effect = {
      break = custom_stop
      limit = { check_variable = { var = count value = 8 compare = less_than } }
      add_to_variable = { var = count value = 1 }
      set_temp_variable = { var = custom_stop value = 1 }
    }
    set_temp_variable = { var = break value = 0 }
    for_each_loop = {
      array = values
      add_to_variable = { var = count value = 1 }
      set_temp_variable = { var = break value = 1 }
    }
  `).document;
  const model = new RewriteModel(
    { countries: [{ tag: "AAA", variables: { values: [1, 2, 3] } }], states: [], global: {} },
    { native: source },
  );
  const ctx = model.context();
  model.run("native", ctx);
  assert.equal(ctx.current.variables.warmup, 2);
  assert.equal(ctx.current.variables.count, 3);
});
