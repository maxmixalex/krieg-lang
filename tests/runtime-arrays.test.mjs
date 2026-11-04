import assert from "node:assert/strict";
import test from "node:test";
import { compileSource, emitCompileOutput } from "../dist/compiler/index.js";
import { RewriteModel, properties } from "../scripts/lib/rewrite-model.mjs";

const imports = 'import {ScriptedEffect,ScriptedTrigger,type CountryScope} from "krieg-lang/hoi4";';

function compile(source) {
  const result = compileSource(imports + source);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  const definitions = Object.fromEntries(
    result.outputs.flatMap((output) =>
      properties(output.document).map((property) => [property.key.text, property.value]),
    ),
  );
  return { definitions, text: result.outputs.map(emitCompileOutput).join("\n") };
}

function execute(definitions, name, variables = {}) {
  const world = {
    countries: [{ tag: "AAA", variables, flags: [] }],
    states: [1, 2].map((id) => ({ id, owner: "AAA", variables: {}, flags: [] })),
    global: {},
    flags: [],
  };
  const model = new RewriteModel(world, definitions);
  const context = model.context();
  model.run(name, context);
  return { model, context, variables: context.current.variables };
}

function rejected(source, code) {
  const result = compileSource(imports + source);
  assert.equal(result.success, false);
  assert.deepEqual(result.outputs, []);
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.code === code),
    JSON.stringify(result.diagnostics),
  );
}

test("numeric local arrays preserve aliases, indexed writes, push results, splice and iteration", () => {
  const { definitions, text } = compile(`
    function adjust(values:number[], amount:number) { values[0] += amount; }
    ScriptedEffect('arrays', c => {
      let values:number[]=[1,2];
      const alias=values;
      values[0]+=3;
      alias[1]++;
      let index=1;
      const before=values[index];
      values[index]=5;
      values.push(before,7);
      const count=values.push(8);
      values.splice(1,2,9,10);
      adjust(values,2);
      let total=0;
      for(const value of values) total+=value;
      if(values.includes(10) && values[index]===9) c.setVariable('matched',1);
      c.setVariable('total',total);
      c.setVariable('count',count);
      c.setVariable('before',before);
      values.length=0;
      c.setVariable('remaining',values.length);
    });`);
  const { model, context, variables } = execute(definitions, "arrays");
  assert.deepEqual(variables, { matched: 1, total: 40, count: 5, before: 3, remaining: 0 });
  model.run("arrays", context);
  assert.equal(variables.total, 40);
  assert.match(text, /clear_temp_array = krg_arrays_values_/);
  assert.match(text, /for_each_loop =/);
  assert.doesNotMatch(text, /(?:set_variable|add_to_variable) = \{\s+var = krg_/);
});

test("temporary arrays and numeric locals retain their identity through nested scope callbacks", () => {
  const { definitions, text } = compile(`
    ScriptedEffect('capture', c => {
      let values=[1];
      let amount=2;
      c.everyState(s=>{
        values[0]+=amount;
        amount++;
        values.push(values[0]);
        s.setVariable('seen',values[0]);
      });
      c.setVariable('result',values[0]);
      c.setVariable('size',values.length);
      c.setVariable('amount',amount);
    });`);
  const { model, variables } = execute(definitions, "capture");
  assert.deepEqual(variables, { result: 6, size: 3, amount: 4 });
  assert.deepEqual(
    model.world.states.map((state) => state.variables.seen),
    [3, 6],
  );
  assert.doesNotMatch(text, /PREV\.krg_capture_/);
});

test("persistent numeric array references update original storage and support ancestor captures", () => {
  const { definitions } = compile(`
    ScriptedEffect('persistent',c=>{
      const values=c.numberArray('scores');
      c.everyState(s=>{values[0]++; values.push(2);});
      let total=0;
      for(const value of values)total+=value;
      c.setVariable('total',total);
      c.setVariable('length',values.length);
    });`);
  const { variables, model } = execute(definitions, "persistent", { scores: [3, 4] });
  assert.deepEqual(variables, { scores: [5, 4, 2, 2], total: 13, length: 4 });
  assert.deepEqual(
    model.world.states.map((state) => state.variables),
    [{}, {}],
  );
});

test("array arguments and indexed assignment locations are captured before later mutations", () => {
  const { definitions } = compile(`
    ScriptedEffect('order',c=>{
      let values=[1,2];
      values.push(values.length, values.length);
      let index=0;
      const move=()=>{index=1;return 9;};
      values[index]=move();
      const choose=()=>{index++;return 0;};
      ++values[choose()];
      c.setVariable('first',values[0]);
      c.setVariable('second',values[1]);
      c.setVariable('third',values[2]);
      c.setVariable('fourth',values[3]);
      c.setVariable('index',index);
    });`);
  assert.deepEqual(execute(definitions, "order").variables, {
    first: 10,
    second: 2,
    third: 2,
    fourth: 2,
    index: 2,
  });
});

test("annotated const arrays use temporary storage and ordinary const tables remain static", () => {
  const { definitions, text } = compile(`
    const table=[1,2];
    ScriptedEffect('const_arrays',c=>{
      const values:number[]=[];
      for(const value of table)values.push(value);
      values[0]++;
      c.setVariable('first',values[0]);
    });`);
  assert.equal(execute(definitions, "const_arrays").variables.first, 2);
  assert.equal((text.match(/add_to_temp_array =/g) ?? []).length, 2);
  assert.doesNotMatch(text, /for_each_loop =/);
});

test("array literals and push arguments snapshot values before a later helper mutates them", () => {
  const { definitions } = compile(`
    ScriptedEffect('values',c=>{
      let source=3;
      const change=()=>{source=9;return 4;};
      let values=[source,change()];
      const append=()=>{values.push(20);return 30;};
      values.push(values.length,append());
      c.setVariable('first',values[0]);
      c.setVariable('second',values[1]);
      c.setVariable('third',values[2]);
      c.setVariable('fourth',values[3]);
      c.setVariable('fifth',values[4]);
    });`);
  assert.deepEqual(execute(definitions, "values").variables, {
    first: 3,
    second: 4,
    third: 20,
    fourth: 2,
    fifth: 30,
  });
});

test("runtime array limitations and element types produce diagnostics", () => {
  rejected(`ScriptedEffect('bad',c=>{let values=['bad'];});`, "KRG2751");
  rejected(`ScriptedEffect('bad',c=>{let values:number[]=[];values.push('bad');});`, "TS2345");
  rejected(`ScriptedEffect('bad',c=>{let values=[1];values[-1]=2;});`, "KRG2708");
  rejected(`ScriptedEffect('bad',c=>{let values=[1];values[0.5]=2;});`, "KRG2708");
  rejected(`ScriptedEffect('bad',c=>{let values=[1];values.length=2;});`, "KRG2750");
  rejected(
    `ScriptedEffect('bad',c=>{let values=[1];const removed=values.splice(0,1);});`,
    "KRG2750",
  );
  rejected(`ScriptedTrigger('bad',c=>{let values=[1];return values[0]>0;});`, "KRG2060");
  rejected(
    `ScriptedEffect('bad',c=>{let values=[1];for(const value of values){return;}});`,
    "KRG2062",
  );
  rejected(`ScriptedEffect('bad',c=>{const values=c.numberArray('unsafe.name');});`, "KRG2702");
  rejected(`ScriptedEffect('bad',c=>{const values:readonly number[]=[1];values[0]=2;});`, "TS2542");
});
