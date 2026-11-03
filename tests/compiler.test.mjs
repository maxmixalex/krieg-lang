import test from "node:test";
import assert from "node:assert/strict";
import { compileSource, compileProject } from "../dist/compiler/index.js";
import { emitPdx, parsePdx, comparePdxSemantic } from "../dist/pdx/index.js";

function ok(source, options = {}) {
  const result = compileSource(source, options);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  return result;
}
function fail(source, code, options = {}) {
  const result = compileSource(source, options);
  assert.equal(result.success, false, "Expected compilation to fail");
  assert.equal(result.outputs.length, 0, "No partial output after a failed build");
  if (code)
    assert.ok(
      result.diagnostics.some((diagnostic) => diagnostic.code === code),
      JSON.stringify(result.diagnostics, null, 2),
    );
  return result;
}
const imports = `import { CountryEvent, ScriptedEffect, ScriptedTrigger, type CountryScope, type StateScope } from 'krieg-lang/hoi4';`;

test("semantic event emits scoped trigger, helper effects, runtime if/else and namespace", () => {
  const result = ok(`${imports}
    function reward(country: CountryScope, amount: number): void { country.effects.addPoliticalPower(amount); }
    export default CountryEvent({id:'test.1', title:'test.1.t', description:'test.1.d',
      trigger:(c:CountryScope)=>c.triggers.hasCountryFlag('ready') && !c.isAI,
      options:[{name:'test.1.a',effects:(c:CountryScope)=>{
        if(c.stability >= 0.5){ reward(c, 10 + 20); } else { c.effects.setCountryFlag('recover'); }
      }}]});`);
  const actual = result.outputs[0];
  assert.equal(actual.path, "events/krieg_test_1.txt");
  assert.equal(actual.representation, "semantic");
  const expected = parsePdx(`add_namespace = test
    country_event = { id = test.1 title = test.1.t desc = test.1.d
      trigger = { AND = { has_country_flag = ready NOT = { is_ai = yes } } }
      option = { name = test.1.a if = { limit = { NOT = { has_stability < 0.5 } } add_political_power = 30 } else = { set_country_flag = recover } }
    }`).document;
  assert.ok(comparePdxSemantic(actual.document, expected), emitPdx(actual.document));
});

test("cross-module helpers, constants, import aliases and namespace helpers resolve by symbol", () => {
  const result = compileProject({
    rootDir: "/virtual/project",
    files: ["main.krg.ts"],
    sources: {
      "helper.krg.ts": `import {type CountryScope} from 'krieg-lang/hoi4'; export const POWER=40; export function reward(c:CountryScope,n:number):void {c.effects.addPoliticalPower(n);}`,
      "main.krg.ts": `import {CountryEvent as Event,type CountryScope} from 'krieg-lang/hoi4';import * as helper from './helper.krg.js';import {POWER} from './helper.krg.js';export default Event({id:'module.1',hidden:true,immediate:(c:CountryScope)=>helper.reward(c,POWER)});`,
    },
  });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  assert.match(emitPdx(result.outputs[0].document), /add_political_power = 40/);
});

test("let variables and arithmetic preserve runtime updates and comparisons", () => {
  const result = ok(`${imports} export default ScriptedEffect('economy',(c:CountryScope)=>{
    let budget:number=10; budget += 5; let doubled:number=budget*2;
    if(doubled > 20){c.effects.addPoliticalPower(doubled);} else {budget--;}
  });`);
  const text = emitPdx(result.outputs[0].document);
  assert.match(text, /set_variable =/);
  assert.match(text, /add_to_variable =/);
  assert.match(text, /multiply_variable =/);
  assert.match(text, /check_variable =/);
  assert.match(text, /value = 20/);
  assert.match(text, /compare = greater_than/);
  assert.match(text, /add_political_power = krg_economy_doubled_/);
});

test("constant for-of unrolls in source order", () => {
  const result = ok(
    `${imports} export default ScriptedEffect('flags',(c:CountryScope)=>{for(const flag of ['one','two','three'] as const){c.effects.setCountryFlag(flag);}});`,
  );
  assert.equal((emitPdx(result.outputs[0].document).match(/set_country_flag/g) ?? []).length, 3);
  assert.match(emitPdx(result.outputs[0].document), /one[\s\S]*two[\s\S]*three/);
});

test("generated CWT command types include legal scopes and block fields", () => {
  const result = ok(`${imports} export default ScriptedEffect('build',(c:CountryScope)=>{
    c.everyState((s:StateScope)=>s.effects.add_building_construction({type:'industrial_complex',level:1,instant_build:true}));
  });`);
  assert.match(emitPdx(result.outputs[0].document), /every_owned_state =/);
  assert.match(emitPdx(result.outputs[0].document), /add_building_construction =/);
  fail(
    `${imports} export default ScriptedEffect('bad',(c:CountryScope)=>c.effects.add_building_construction({type:'industrial_complex',level:1}));`,
    "TS2339",
  );
  fail(
    `${imports} export default ScriptedEffect('bad',(c:CountryScope)=>c.effects.add_political_power('fifty'));`,
    "TS2345",
  );
});

test("CWT scope-pushing canonical commands accept explicit typed callbacks", () => {
  const result = ok(`${imports} export default ScriptedEffect('nested',(c:CountryScope)=>{
    c.effects.every_country({limit:(other:CountryScope)=>other.triggers.hasCountryFlag('ready'),effects:(other:CountryScope)=>other.effects.addPoliticalPower(5)});
  });`);
  const text = emitPdx(result.outputs[0].document);
  assert.match(text, /every_country =/);
  assert.match(text, /limit =/);
});

test("ancestor scope capture lowers PREV and PREV.PREV safely", () => {
  const result = ok(`${imports} export default ScriptedEffect('capture',(c:CountryScope)=>{
    c.everyState((s:StateScope)=>{c.effects.addPoliticalPower(1); s.owner((owner:CountryScope)=>{c.effects.addStability(0.01);});});
  });`);
  const text = emitPdx(result.outputs[0].document);
  assert.match(text, /PREV =/);
  assert.match(text, /PREV\.PREV =/);
});

test("scripted handles invoke emitted scripts and preserve scope types", () => {
  const result = ok(`${imports}
    export const ready=ScriptedTrigger('ready',(c:CountryScope)=>c.triggers.hasCountryFlag('ready'));
    export const reward=ScriptedEffect('reward',(c:CountryScope)=>c.effects.addPoliticalPower(5));
    export const event=CountryEvent({id:'handle.1',hidden:true,trigger:(c:CountryScope)=>c.test(ready),immediate:(c:CountryScope)=>c.run(reward)});
    export const caller=ScriptedEffect('caller',(c:CountryScope)=>c.effects.countryEvent({id:event.id,days:1}));`);
  assert.equal(result.outputs.length, 4);
  const event = result.outputs.find((output) => output.path.startsWith("events/"));
  assert.match(emitPdx(event.document), /ready = yes/);
  assert.match(emitPdx(event.document), /reward = yes/);
  fail(
    `${imports} import {StateScriptedEffect} from 'krieg-lang/hoi4';const state=StateScriptedEffect('state',(s:StateScope)=>s.effects.addManpower(2));export default ScriptedEffect('bad',(c:CountryScope)=>c.run(state));`,
    "TS2345",
  );
});

test("project universe provides exact references and rejects absent entries", () => {
  const virtualModules = {
    "@project/countries": `import type {CountryRef} from 'krieg-lang/hoi4';export declare const countries:{readonly GER:CountryRef & {readonly tag:'GER'}};`,
  };
  const result = ok(
    `${imports} import {countries} from '@project/countries';export default CountryEvent({id:'refs.1',hidden:true,trigger:(c:CountryScope)=>c.triggers.tag(countries.GER)});`,
    { virtualModules },
  );
  assert.match(emitPdx(result.outputs[0].document), /tag = GER/);
  fail(
    `${imports} import {countries} from '@project/countries';export default CountryEvent({id:'refs.1',trigger:(c:CountryScope)=>c.triggers.tag(countries.ZZZ)});`,
    "TS2339",
    { virtualModules },
  );
});

test("ordered constructors preserve duplicates, anonymous values, operators, escaping and paths", () => {
  const result =
    ok(`import * as pdx from 'krieg-lang/pdx';export default pdx.file('interface/test.gui',pdx.document([
    pdx.property('foo',pdx.block([pdx.property('x',pdx.atom('1'),'>'),pdx.property('x',pdx.atom('2')),
      pdx.atom('anonymous'),pdx.string('quoted "value"'),pdx.tagged('rgb',pdx.block([pdx.atom('1'),pdx.atom('2'),pdx.atom('3')]))]))]));`);
  assert.equal(result.outputs[0].path, "interface/test.gui");
  assert.equal(result.outputs[0].representation, "ordered-pdx");
  const text = emitPdx(result.outputs[0].document);
  assert.match(text, /x > 1/);
  assert.match(text, /x = 2/);
  assert.match(text, /rgb/);
  assert.ok(comparePdxSemantic(result.outputs[0].document, parsePdx(text).document));
});

test("structured DataFile covers non-script game data without claiming semantic schema checking", () => {
  const result = ok(
    `import {DataFile} from 'krieg-lang/hoi4';export default DataFile('common/units/equipment/demo.txt',{equipments:{demo_tank:{year:1936,is_archetype:true,reliability:0.8,type:['armor']}}});`,
  );
  assert.equal(result.outputs[0].representation, "structured-data");
  assert.match(emitPdx(result.outputs[0].document), /type = \{\s+armor/);
});

test("all high-level domains compile with explicit file conventions", () => {
  const result =
    ok(`import {FocusTree,Focus,DecisionCategory,Idea,type CountryScope} from 'krieg-lang/hoi4';
    export default [FocusTree({id:'tree',focuses:[Focus({id:'focus_a',cost:5,prerequisites:[['focus_b','focus_c'],['focus_d']],completionReward:(c:CountryScope)=>c.effects.addPoliticalPower(10)})]}),
      DecisionCategory({id:'category',decisions:[{id:'decision',cost:10,completeEffect:(c:CountryScope)=>c.effects.addStability(0.01)}]}),
      Idea({id:'idea',modifier:{stability_factor:0.1}})];`);
  assert.deepEqual(
    result.outputs.map((output) => output.path),
    [
      "common/decisions/categories/krieg_category.txt",
      "common/decisions/krieg_category.txt",
      "common/ideas/krieg_idea.txt",
      "common/national_focus/krieg_tree.txt",
    ],
  );
  assert.equal((emitPdx(result.outputs[3].document).match(/prerequisite =/g) ?? []).length, 2);
});

test("no JavaScript ambient universe and no execution of source", () => {
  fail(`export const x=Date.now();`, "TS2304");
  fail(`export const x=console.log('never executed');`);
  fail(`import fs from 'node:fs';fs.writeFileSync('/tmp/should-not-exist','bad');`, "KRG1008");
});

test("unsafe language features fail before any output is returned", () => {
  fail(`${imports}function untyped(c) { c.effects.addPoliticalPower(5); }`, "KRG1005");
  fail(`const value:any=5;`, "KRG1002");
  fail(`class X {}`, "KRG1001");
  fail(
    `${imports}export default ScriptedEffect('bad',(c:CountryScope)=>{while(true){c.effects.addPoliticalPower(1);}});`,
    "KRG1001",
  );
  fail(
    `${imports}function recurse(c:CountryScope):void{recurse(c);}export default ScriptedEffect('bad',(c:CountryScope)=>recurse(c));`,
    "KRG2023",
  );
});

test("runtime trigger effects and early returns are rejected", () => {
  fail(
    `${imports}function impure(c:CountryScope):boolean{c.effects.addPoliticalPower(1);return true;}export default CountryEvent({id:'bad.1',hidden:true,trigger:(c:CountryScope)=>impure(c)});`,
    "KRG2037",
  );
  fail(
    `${imports}export default ScriptedEffect('bad',(c:CountryScope)=>{if(c.isAI){return;}c.effects.addPoliticalPower(1);});`,
    "KRG2062",
  );
});

test("output traversal and invalid low-level token construction fail safely", () => {
  fail(
    `import * as pdx from 'krieg-lang/pdx';export default pdx.file('../escape.txt',pdx.document([]));`,
    "KRG1014",
  );
  fail(
    `import * as pdx from 'krieg-lang/pdx';export default pdx.file('events/bad.txt',pdx.document([pdx.atom('a=b')]));`,
    "KRG3001",
  );
});

test("numeric queries use real CWT triggers and preserve exact comparator semantics", () => {
  const result = ok(`${imports} export default [
    ScriptedTrigger('less',(c:CountryScope)=>c.politicalPower < 100),
    ScriptedTrigger('at_most',(c:CountryScope)=>c.stability <= 0.5),
    ScriptedTrigger('at_least',(c:CountryScope)=>c.stability >= 0.5),
    ScriptedTrigger('equal',(c:CountryScope)=>c.warSupport === 0.5),
    ScriptedTrigger('different',(c:CountryScope)=>c.warSupport !== 0.5)];`);
  const text = result.outputs.map((output) => emitPdx(output.document)).join("\n");
  assert.match(text, /has_political_power < 100/);
  assert.match(text, /at_most = \{\s+NOT = \{\s+has_stability > 0\.5/);
  assert.match(text, /at_least = \{\s+NOT = \{\s+has_stability < 0\.5/);
  assert.match(text, /equal = \{\s+AND =/);
  assert.match(text, /different = \{\s+OR =/);
  assert.doesNotMatch(text, /(?:^|\s)(?:political_power|stability|war_support) [<=>]/);
});

test("numeric const and helper arguments snapshot values before mutable updates", () => {
  const result = ok(`${imports} export default ScriptedEffect('snapshot',(c:CountryScope)=>{
    let counter:number=10;
    const before:number=counter;
    function spend(amount:number):void {counter+=1;c.effects.addPoliticalPower(amount);}
    counter+=5;spend(before);
  });`);
  const text = emitPdx(result.outputs[0].document);
  assert.match(text, /var = krg_snapshot_before_\d+\s+value = krg_snapshot_counter_/);
  assert.match(text, /var = krg_snapshot_arg_amount_\d+\s+value = krg_snapshot_before_/);
  assert.match(text, /add_political_power = krg_snapshot_arg_amount_/);
  fail(
    `${imports}export default ScriptedEffect('bad',(c:CountryScope)=>{const predicate=c.triggers.hasCountryFlag('ready');if(predicate){c.effects.addPoliticalPower(1);}});`,
    "KRG2069",
  );
});

test("expanded semantic records reject fields hidden by TypeScript structural assignment", () => {
  fail(
    `${imports}const spec={id:'unknown.1' as const,unsupported:true};export default CountryEvent(spec);`,
    "KRG2070",
  );
  fail(
    `${imports}const argument={id:'unknown.1',nonsense:10};export default ScriptedEffect('bad',(c:CountryScope)=>c.effects.countryEvent(argument));`,
    "KRG2071",
  );
  fail(
    `${imports}export default ScriptedEffect('bad',(c:CountryScope)=>c.effects.set_stability(2));`,
    "KRG2071",
  );
});

test("user declaration files and TypeScript suppression comments cannot bypass checking", () => {
  fail(
    `${imports} import type {Unsafe} from './unsafe.d.ts'; const wrong:Unsafe='bad';export default ScriptedEffect('bad',(c:CountryScope)=>c.effects.addPoliticalPower(wrong));`,
    "KRG1015",
    { sources: { "unsafe.d.ts": "export type Unsafe=any;" } },
  );
  for (const directive of ["@ts-nocheck", "@ts-ignore", "@ts-expect-error"]) {
    fail(
      `// ${directive}\n${imports}\nexport default ScriptedEffect('bad',(c:CountryScope)=>{\n// ${directive}\nc.effects.addPoliticalPower('bad');});`,
      "KRG1016",
    );
  }
  ok(`export const text='@ts-nocheck';`);
});

test("StateHistory requires and emits a complete native state definition", () => {
  const result =
    ok(`import {StateHistory,state,country,type StateScope} from 'krieg-lang/hoi4';export default StateHistory({
    state:state(1),name:'STATE_1',manpower:100000,category:'city',provinces:[123,456],owner:country('GER'),cores:[country('GER')],
    resources:{steel:3},buildings:{infrastructure:2,123:{naval_base:1}},victoryPoints:[{province:123,value:5}],
    history:(s:StateScope)=>s.effects.setStateFlag('prepared')});`);
  assert.equal(result.outputs[0].path, "history/states/1 - Krieg.txt");
  const text = emitPdx(result.outputs[0].document);
  const expected =
    parsePdx(`state={id=1 name=STATE_1 manpower=100000 state_category=city resources={steel=3}
    history={owner=GER buildings={123={naval_base=1} infrastructure=2} add_core_of=GER victory_points={123 5} set_state_flag=prepared}
    provinces={123 456}}`).document;
  assert.ok(comparePdxSemantic(result.outputs[0].document, expected), text);
});

test("entry-only emission still evaluates imported handles in module lexical context", () => {
  const sources = {
    "defs.krg.ts": `${imports} export const bonus=ScriptedEffect('bonus',(c:CountryScope)=>c.effects.addPoliticalPower(1));`,
    "main.krg.ts": `${imports} import {bonus} from './defs.krg.js'; export default ScriptedEffect('caller',(c:CountryScope)=>c.run(bonus));`,
  };
  const result = compileProject({
    rootDir: "/virtual/entry-only",
    files: ["main.krg.ts"],
    sources,
    emitDependencies: false,
  });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  assert.equal(result.outputs.length, 1);
  assert.match(emitPdx(result.outputs[0].document), /bonus = yes/);
});

test("default exported values are resolved statically across source modules", () => {
  const result = compileProject({
    rootDir: "/virtual/default-import",
    files: ["main.krg.ts"],
    emitDependencies: false,
    sources: {
      "amount.krg.ts": "export default 17;",
      "main.krg.ts": `${imports}import amount from './amount.krg.js';export default ScriptedEffect('default_value',(c:CountryScope)=>c.effects.addPoliticalPower(amount));`,
    },
  });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  assert.match(emitPdx(result.outputs[0].document), /add_political_power = 17/);
});

test("native event options, history prerequisites and focus selection match the CWT model", () => {
  const result =
    ok(`${imports} import {CountryHistory,country,state,FocusTree} from 'krieg-lang/hoi4';
    export default [CountryEvent({id:'native.1',title:'native.1.t',options:[{name:'native.1.a',aiChance:25,trigger:(c:CountryScope)=>true}]}),
      CountryHistory({country:country('GER'),capital:state(64),path:'history/countries/GER - Germany.txt',history:(c:CountryScope)=>c.effects.addPoliticalPower(1)}),
      FocusTree({id:'native_tree',focuses:[]})];`);
  const event = result.outputs.find((output) => output.path.startsWith("events/"));
  assert.match(emitPdx(event.document), /ai_chance = \{\s+base = 25/);
  const history = result.outputs.find((output) => output.path.startsWith("history/"));
  assert.equal(history.path, "history/countries/GER - Germany.txt");
  assert.match(emitPdx(history.document), /^capital = 64/);
  const tree = result.outputs.find((output) => output.path.includes("national_focus"));
  assert.match(emitPdx(tree.document), /country = \{\s+factor = 1/);
  fail(`${imports}export default CountryEvent({id:'visible.1'});`, "KRG2075");
  fail(
    `${imports}export default CountryEvent({id:'invalid.1',hidden:true,options:[{name:'invalid.1.a',hidden:true}]});`,
    "TS2353",
  );
});

test("country idea modifiers use actual country modifier names", () => {
  const result = ok(
    `import {Idea} from 'krieg-lang/hoi4'; export default Idea({id:'industry',modifier:{industrial_capacity_factory:0.1,conscription_factor:0.05}});`,
  );
  assert.match(emitPdx(result.outputs[0].document), /industrial_capacity_factory = 0\.1/);
  fail(
    `import {Idea} from 'krieg-lang/hoi4';const modifier={factory_output:0.1,stability_factor:0.1};export default Idea({id:'bad',modifier});`,
    "KRG2070",
  );
});
