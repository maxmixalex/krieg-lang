import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { compileProject, compileSource } from "../dist/compiler/index.js";
import { emitPdx, parsePdx } from "../dist/pdx/index.js";
import { writeEditorProject } from "../dist/project/index.js";
import { editorService } from "./support/editor-service.mjs";
import { UnoNativeMachine } from "./support/uno-native-machine.mjs";

const imports = `import {ScriptedEffect, StateScriptedEffect, state,
  type CountryScope, type ScriptedEffectDefinition} from 'krieg-lang/hoi4';`;

function compile(source) {
  const result = compileSource(`${imports}\n${source}`);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  for (const output of result.outputs)
    assert.deepEqual(parsePdx(emitPdx(output.document)).diagnostics, []);
  return result;
}

function scripts(result) {
  return new Map(
    result.outputs.map((output) => [output.document.items[0].key.text, emitPdx(output.document)]),
  );
}

function rejected(source, code) {
  const result = compileSource(`${imports}\n${source}`);
  assert.equal(result.success, false, "Expected invalid parameterized content to fail");
  assert.deepEqual(result.outputs, []);
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.code === code),
    JSON.stringify(result.diagnostics),
  );
}

test("typed effect calls snapshot numbers and emit ordinary native specializations", () => {
  const result = scripts(
    compile(`
    const reward=ScriptedEffect('reward',{amount:'number'},(c,p)=>c.effects.addPoliticalPower(p.amount));
    ScriptedEffect('use',c=>{
      let amount:number=4;
      reward(c,{amount:amount+2});
      c.run(reward,{amount:7});
    });`),
  );
  assert.equal(result.size, 3);
  assert.ok(!result.has("reward"));
  const caller = result.get("use");
  assert.match(caller, /set_temp_variable =/);
  for (const [name, body] of result) {
    if (name === "use") continue;
    assert.match(caller, new RegExp(`${name} = yes`));
    assert.match(caller, new RegExp(`var = ${name}_param_amount`));
    assert.match(body, new RegExp(`add_political_power = ${name}_param_amount`));
    assert.doesNotMatch(body, /\$|meta_effect/);
  }
});

test("nested calls preserve outer parameters and scope overloads retain legacy calls", () => {
  const result = scripts(
    compile(`
    const inner=ScriptedEffect('inner',{amount:'number'},(c,p)=>c.effects.addPoliticalPower(p.amount));
    const outer=ScriptedEffect('outer',{amount:'number'},(c,p)=>{
      inner(c,{amount:p.amount+1});
      c.effects.addPoliticalPower(p.amount);
    });
    const local=ScriptedEffect('local','state',{amount:'number'},(s,p)=>s.effects.addManpower(p.amount));
    const alias=StateScriptedEffect('alias',{amount:'number'},(s,p)=>s.effects.addManpower(p.amount));
    const old=ScriptedEffect('old',c=>c.effects.addPoliticalPower(1));
    ScriptedEffect('use',c=>{outer(c,{amount:10});old(c,false);c.run(old);c.state(state(1),s=>{local(s,{amount:5});s.run(alias,{amount:6});});});`),
  );
  assert.match(result.get("use"), /old = no[\s\S]*old = yes/);
  const [outerName, outerBody] = [...result].find(([name]) => /^krg_use_call_outer_/.test(name));
  assert.match(outerBody, new RegExp(`add_political_power = ${outerName}_param_amount`));
  const [innerName, innerBody] = [...result].find(([name]) => name.includes("_call_inner_"));
  assert.match(innerBody, new RegExp(`add_political_power = ${innerName}_param_amount`));
  assert.notEqual(innerName, outerName);
  assert.match(result.get("use"), /1 = \{[\s\S]*_call_local_\d+ = yes[\s\S]*_call_alias_\d+ = yes/);
});

test("numeric array parameters borrow their caller's temporary storage", () => {
  const result = scripts(
    compile(`
    const increase=ScriptedEffect('increase',{values:'number[]',amount:'number'},(c,p)=>{
      p.values[0]+=p.amount;
      c.effects.addPoliticalPower(p.values[0]);
    });
    ScriptedEffect('use',c=>{let values:number[]=[1,2];increase(c,{values,amount:3});c.effects.addPoliticalPower(values[0]);});`),
  );
  const caller = result.get("use");
  const arrayName = /clear_temp_array = (\w+)/.exec(caller)[1];
  const [name, body] = [...result].find(([key]) => key !== "use");
  assert.match(body, new RegExp(`var = ${arrayName}\\^0`));
  assert.match(body, new RegExp(`value = ${name}_param_amount`));
  assert.doesNotMatch(body, /clear_temp_array|clear_array/);
  assert.match(caller, new RegExp(`add_political_power = ${arrayName}\\^0`));
});

test("record construction and effectful argument evaluation preserve numeric values", () => {
  const result = compile(`
    function change(c:CountryScope):number {c.setVariable('source',20);return 2;}
    function ordinary(c:CountryScope,first:number,second:number):void {c.setVariable('ordinary_result',first);}
    const remember=ScriptedEffect('remember',{first:'number',second:'number'},(c,p)=>{
      c.setVariable('first',p.first);c.setVariable('second',p.second);
    });
    ScriptedEffect('order',c=>{
      c.setVariable('source',10);
      remember(c,{first:c.variable('source'),second:change(c)});
      c.setVariable('direct_result',c.variable('first'));
      const saved={first:c.variable('source'),second:3};
      c.setVariable('source',30);
      c.run(remember,saved);
      c.setVariable('saved_result',c.variable('first'));
      ordinary(c,c.variable('source'),change(c));
      c.setVariable('source',40);
      remember(c,{first:c.variable('source')+change(c),second:0});
      c.setVariable('arithmetic_result',c.variable('first'));
    });`);
  const definitions = new Map(
    result.outputs.map((output) => {
      const effect = output.document.items[0];
      return [effect.key.text, effect.value];
    }),
  );
  const machine = new UnoNativeMachine(definitions);
  const country = machine.countries[0];
  machine.execute(definitions.get("order"), country);
  assert.equal(country.vars.direct_result, 10);
  assert.equal(country.vars.saved_result, 20);
  assert.equal(country.vars.ordinary_result, 30);
  assert.equal(country.vars.arithmetic_result, 42);
});

test("array parameters retain persistent storage and temporary cross-scope references", () => {
  const result = scripts(
    compile(`
    const increase=ScriptedEffect('increase',{values:'number[]',amount:'number'},(c,p)=>p.values[0]+=p.amount);
    ScriptedEffect('use',c=>{
      increase(c,{values:c.numberArray('seats'),amount:3});
      let values:number[]=[1];
      c.everyCountry(other=>increase(other,{values,amount:4}));
    });`),
  );
  const bodies = [...result].filter(([name]) => name !== "use").map(([, body]) => body);
  assert.ok(bodies.some((body) => /add_to_variable = \{\s+var = seats\^0/.test(body)));
  assert.ok(
    bodies.some((body) => /add_to_temp_variable = \{\s+var = krg_use_values_\d+\^0/.test(body)),
  );
  assert.doesNotMatch(bodies.join("\n"), /PREV\./);
  rejected(
    `const increase=ScriptedEffect('increase',{values:'number[]'},(c,p)=>p.values[0]+=1);
    ScriptedEffect('bad',c=>{const values=c.numberArray('seats');c.everyCountry(other=>increase(other,{values}));});`,
    "KRG2613",
  );
});

test("imports create distinct specializations owned by each caller", () => {
  const result = compileProject({
    rootDir: "/virtual/parameters",
    files: ["a.krg.ts", "b.krg.ts"],
    sources: {
      "defs.krg.ts": `${imports}export const shared=ScriptedEffect('shared',{amount:'number'},(c,p)=>c.effects.addPoliticalPower(p.amount));export function apply(c:CountryScope):void {shared(c,{amount:1});}`,
      "a.krg.ts": `${imports}import {apply} from './defs.krg.js';ScriptedEffect('a',c=>apply(c));`,
      "b.krg.ts": `${imports}import {shared} from './defs.krg.js';ScriptedEffect('b',c=>c.run(shared,{amount:2}));`,
    },
  });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  const output = scripts(result);
  assert.equal(output.size, 4);
  assert.match(output.get("a"), /krg_a_call_shared_\d+ = yes/);
  assert.match(output.get("b"), /krg_b_call_shared_\d+ = yes/);
  for (const file of result.outputs.filter((file) => file.path.includes("_call_shared_")))
    assert.ok(/\/[ab]\.krg\.ts$/.test(file.sourceFile), file.sourceFile);
});

test("parameter contracts reject missing, wrong, extra, forged and static-array arguments", () => {
  const declaration = `const reward=ScriptedEffect('reward',{amount:'number'},(c,p)=>c.effects.addPoliticalPower(p.amount));`;
  rejected(`${declaration}ScriptedEffect('bad',c=>reward(c,{}));`, "TS2345");
  rejected(`${declaration}ScriptedEffect('bad',c=>reward(c,{amount:'bad'}));`, "TS2322");
  rejected(`${declaration}ScriptedEffect('bad',c=>c.run(reward));`, "TS2554");
  rejected(`${declaration}StateScriptedEffect('bad',s=>reward(s,{amount:1}));`, "TS2345");
  rejected(
    `${declaration}const inputs={amount:1,extra:2};ScriptedEffect('bad',c=>reward(c,inputs));`,
    "KRG2613",
  );
  rejected(
    `${declaration}ScriptedEffect('bad',c=>reward(c,{amount:'bad' as unknown as number}));`,
    "KRG1003",
  );
  rejected(`ScriptedEffect('bad',{'invalid-key':'number'},(c,p)=>{});`, "KRG2612");
  rejected(
    `const sum=ScriptedEffect('sum',{values:'number[]'},(c,p)=>{});const values=[1,2];ScriptedEffect('bad',c=>sum(c,{values}));`,
    "KRG2613",
  );
  rejected(
    `const recursive:ScriptedEffectDefinition<'country',{amount:'number'}>=ScriptedEffect('recursive',{amount:'number'},(c,p)=>recursive(c,p));ScriptedEffect('bad',c=>recursive(c,{amount:1}));`,
    "KRG2023",
  );
});

test("editor completion and diagnostics infer parameter names and numeric array operations", (t) => {
  const root = mkdtempSync(join(tmpdir(), "krieg-parameters-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "src"));
  writeFileSync(join(root, "krgconfig.json"), JSON.stringify({ name: "parameters" }));
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({ name: "parameters", version: "1.0.0", type: "module" }),
  );
  writeFileSync(
    join(root, "tsconfig.json"),
    JSON.stringify({ extends: "./.krieg/tsconfig.json", include: ["src/**/*.krg.ts"] }),
  );
  const source = `${imports}
    const sum=ScriptedEffect('sum',{cap:'number',values:'number[]'},(c,p)=>{
      c.effects.addPoliticalPower(p.__PARAM__);
      p.values.__ARRAY__;
    });
    ScriptedEffect('use',c=>{let values:number[]=[];sum(c,{__INPUT__:1,values});sum(c,{cap:'bad',values});});`;
  const file = join(root, "src/main.krg.ts");
  writeFileSync(file, source);
  writeEditorProject(root);
  const service = editorService(join(root, "tsconfig.json"));
  t.after(() => service.dispose());
  const completions = (marker) =>
    service
      .getCompletionsAtPosition(file, source.indexOf(marker), {})
      ?.entries.map((entry) => entry.name)
      .sort();
  assert.deepEqual(completions("__PARAM__"), ["cap", "values"]);
  assert.ok(completions("__INPUT__").includes("cap"));
  assert.ok(completions("__ARRAY__").includes("length"));
  assert.ok(service.getSemanticDiagnostics(file).some((diagnostic) => diagnostic.code === 2322));
});
