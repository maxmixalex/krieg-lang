import assert from "node:assert/strict";
import test from "node:test";
import { ESLint } from "eslint";
import { compileSource, emitCompileOutput } from "../dist/compiler/index.js";
import plugin from "../dist/eslint/index.js";
import { UnoNativeMachine } from "./support/uno-native-machine.mjs";

const imports = `import { ScriptedEffect, variableState, type CountryScope } from 'krieg-lang/hoi4';`;
function compile(source) {
  const result = compileSource(imports + source);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  return result;
}

test("typed scripted callback object fields infer names, borrow arrays and allow renaming", () => {
  const result = compile(`
    const adjust = ScriptedEffect('adjust', {values:'number[]', change:'number'},
      (country, {values, change:delta}) => {
        values[0] += delta;
        country.setVariable('result', values[0]);
      });
    ScriptedEffect('use', country => {
      let values:number[] = [2];
      adjust(country, {values, change:3});
      country.setVariable('after', values[0]);
    });`);
  const caller = emitCompileOutput(
    result.outputs.find((output) => output.document.items[0].key.text === "use"),
  );
  const callee = emitCompileOutput(
    result.outputs.find((output) => output.document.items[0].key.text !== "use"),
  );
  const array = /clear_temp_array = (\w+)/.exec(caller)[1];
  assert.match(callee, new RegExp(`var = ${array}\\^0`));
  assert.match(callee, /value = krg_\w+_arg_delta_\d+/);
  assert.match(caller, new RegExp(`var = after\\s*value = ${array}\\^0`));
  assert.doesNotMatch(callee, /clear_(?:temp_)?array/);
});

test("destructured helper numbers snapshot at entry for records and typed global state", () => {
  const result = compile(`
    const game = variableState('global', {dealing:'ku_dealing'});
    function record(country:CountryScope, {amount:before, flag}:{amount:number;flag:string}):void {
      game.dealing = 100;
      country.setVariable('record_before', before);
      country.effects.setCountryFlag(flag);
    }
    function state(country:CountryScope, {dealing}:{dealing:number}):void {
      game.dealing = 200;
      country.setVariable('state_before', dealing);
    }
    ScriptedEffect('use', country => {
      game.dealing = 7;
      record(country, {amount:game.dealing, flag:'captured'});
      state(country, game);
    });`);
  const definitions = new Map(
    result.outputs.map((output) => [
      output.document.items[0].key.text,
      output.document.items[0].value,
    ]),
  );
  const machine = new UnoNativeMachine(definitions);
  machine.run("use");
  assert.equal(machine.countries[0].vars.record_before, 7);
  assert.equal(machine.countries[0].vars.state_before, 100);
  assert.equal(machine.global.vars.ku_dealing, 200);
  assert.equal(machine.countries[0].flags.has("captured"), true);
});

test("ordinary typed helpers and inferred static callbacks accept shallow object parameters", () => {
  const result = compile(`
    function scale({value:amount}:{value:number}):number { return amount*2; }
    const rows = [{value:2,flag:'two'}, {value:3,flag:'three'}];
    const amounts = rows.map(({value}) => scale({value}));
    ScriptedEffect('use', country => {
      for (const amount of amounts) country.effects.addPoliticalPower(amount);
      for (const row of rows) mark(country, row);
    });
    function mark(country:CountryScope, {'flag':name}:{flag:string}):void {
      country.effects.setCountryFlag(name);
    }`);
  const native = result.outputs.map(emitCompileOutput).join("\n");
  assert.match(native, /add_political_power = 4[\s\S]*add_political_power = 6/);
  assert.match(native, /set_country_flag = two[\s\S]*set_country_flag = three/);
});

test("destructured callback fields retain inferred TypeScript validation", () => {
  const result = compileSource(
    imports +
      `
    ScriptedEffect('bad', {amount:'number'}, (country, {missing}) => {
      country.setVariable('result', missing);
    });`,
  );
  assert.equal(result.success, false);
  assert.deepEqual(result.outputs, []);
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === "TS2339"));
});

test("compiler and ESLint accept shallow bindings and report unsupported parameter patterns", async () => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [plugin.configs.recommended],
  });
  const accepted =
    imports +
    `
    function helper(country:CountryScope, {amount:change}:{amount:number}):void {
      country.effects.addPoliticalPower(change);
    }
    ScriptedEffect('use', {amount:'number'}, (country, {amount}) => helper(country, {amount}));`;
  const [valid] = await eslint.lintText(accepted, { filePath: "parameters.krg.ts" });
  assert.deepEqual(valid.messages, []);
  const invalid = [
    ["function bad({amount=1}:{amount?:number}):void {}", "defaults in destructured parameters"],
    ["function bad({amount,...other}:{amount:number;other:number}):void {}", "rest properties"],
    [
      "function bad({nested:{amount}}:{nested:{amount:number}}):void {}",
      "nested parameter destructuring",
    ],
    [
      "function bad({amount}:{amount:number}={amount:1}):void {}",
      "defaults on destructured parameters",
    ],
    ["function bad([amount]:readonly number[]):void {}", "array parameter destructuring"],
    ["function bad(...amount:number[]):void {}", "rest parameters"],
    ['function bad({["amount"]:value}:{amount:number}):void {}', "computed keys"],
  ];
  for (const [source, feature] of invalid) {
    const compiled = compileSource(imports + source);
    assert.equal(compiled.success, false, source);
    assert.ok(
      compiled.diagnostics.some(
        (diagnostic) => diagnostic.code === "KRG1006" && diagnostic.message.includes(feature),
      ),
      JSON.stringify(compiled.diagnostics),
    );
    const [linted] = await eslint.lintText(source, { filePath: "parameters.krg.ts" });
    assert.ok(
      linted.messages.some(
        (message) =>
          message.ruleId === "krieg/supported-syntax" && message.message.includes(feature),
      ),
      JSON.stringify(linted.messages),
    );
  }
});
