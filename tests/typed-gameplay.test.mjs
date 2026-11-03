import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { compileProject, compileSource } from "../dist/compiler/index.js";
import { comparePdxSemantic, emitPdx, parsePdx } from "../dist/pdx/index.js";
import { writeEditorProject } from "../dist/project/index.js";
import { editorService } from "./support/editor-service.mjs";

const imports = `import {FocusGraph, CountryEvent, StateEvent, NewsEvent, ScriptedEffect,
  ScriptedTrigger, StateScriptedEffect, Idea, state, type CountryScope, type StateScope,
  type FocusNodeSpec} from 'krieg-lang/hoi4';`;

function compiled(source, options = {}) {
  const result = compileSource(source, options);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  return result;
}

function rejected(source, code) {
  const result = compileSource(`${imports}\n${source}`);
  assert.equal(result.success, false, "Expected a checked gameplay failure");
  assert.deepEqual(result.outputs, [], "Failed gameplay must not produce partial output");
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.code === code),
    JSON.stringify(result.diagnostics, null, 2),
  );
}

function semantic(output, native) {
  const expected = parsePdx(native);
  assert.deepEqual(expected.diagnostics, []);
  assert.ok(comparePdxSemantic(output.document, expected.document), emitPdx(output.document));
}

test("FocusGraph expands paths, all/any joins, symmetric choices and stable automatic layout", () => {
  const result = compiled(`${imports}
    export const tree = FocusGraph({id:'rebuild',prefix:'REC',nodes:{
      charter:{cost:3}, industry:{cost:5}, relief:{cost:5}, assembly:{cost:5},
      trade:{cost:3}, congress:{cost:5}
    },sequences:[['charter','industry'],['charter','relief'],['charter','trade']],
      choices:[['industry','relief']],
      joins:[{to:'assembly',any:['industry','relief']},{to:'congress',all:['assembly','trade']}]});`);
  assert.equal(result.outputs.length, 1);
  assert.equal(result.outputs[0].path, "common/national_focus/krieg_rebuild.txt");
  semantic(
    result.outputs[0],
    `focus_tree = {
    id = rebuild country = { factor = 1 }
    focus = { id = REC_charter x = 0 y = 0 cost = 3 }
    focus = { id = REC_industry x = 0 y = 1 cost = 5 prerequisite = { focus = REC_charter } mutually_exclusive = { focus = REC_relief } }
    focus = { id = REC_relief x = 2 y = 1 cost = 5 prerequisite = { focus = REC_charter } mutually_exclusive = { focus = REC_industry } }
    focus = { id = REC_assembly x = 0 y = 2 cost = 5 prerequisite = { focus = REC_industry focus = REC_relief } }
    focus = { id = REC_trade x = 4 y = 1 cost = 3 prerequisite = { focus = REC_charter } }
    focus = { id = REC_congress x = 0 y = 3 cost = 5 prerequisite = { focus = REC_assembly } prerequisite = { focus = REC_trade } }
  }`,
  );
});

test("composed paths deduplicate shared steps, preserve node IDs, and respect explicit positions", () => {
  const result = compiled(`${imports}
    const common = {start:{cost:1},middle:{cost:2}};
    export const tree = FocusGraph({id:'paths',nodes:{...common,left:{position:{x:-2,y:7}},right:{}},
      sequences:[['start','middle','left'],['start','middle','right']],layout:{columnSpacing:4,rowSpacing:2}});`);
  const text = emitPdx(result.outputs[0].document);
  assert.equal((text.match(/focus = paths_start/g) ?? []).length, 1);
  assert.match(text, /id = paths_left\s+x = -2\s+y = 7/);
  assert.match(text, /id = paths_right\s+x = 4\s+y = 4/);
});

test("graph callbacks, event recipients and typed focus references compose across modules and aliases", () => {
  const result = compileProject({
    rootDir: "/virtual/typed-gameplay",
    files: ["main.krg.ts"],
    sources: {
      "events.krg.ts": `import {CountryEvent as Event,type CountryScope} from 'krieg-lang/hoi4';
        export const report=Event({id:'report.1',hidden:true,isTriggeredOnly:true,
          immediate:(c:CountryScope)=>c.effects.addPoliticalPower(10)});`,
      "graph.krg.ts": `import * as gameplay from 'krieg-lang/hoi4';import {report} from './events.krg.js';
        export const graph=gameplay.FocusGraph({id:'tree',prefix:'ISL',nodes:{
          charter:{completionReward:(c:gameplay.CountryScope)=>c.schedule(report,{days:1})},harbour:{}
        },sequences:[['charter','harbour']]});`,
      "main.krg.ts": `import {ScriptedEffect,ScriptedTrigger,type CountryScope,type StateScope,state} from 'krieg-lang/hoi4';
        import {graph} from './graph.krg.js';import {report} from './events.krg.js';
        export const ready=ScriptedTrigger('ready',(c:CountryScope)=>c.hasCompletedFocus(graph.focuses.harbour));
        export const finish=ScriptedEffect('finish',(c:CountryScope)=>{
          c.state(state(1),(s:StateScope)=>{c.completeFocus(graph.focuses.charter);c.schedule(report,{hours:6,randomHours:3});});
        });`,
    },
  });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  assert.equal(result.outputs.length, 4);
  semantic(
    result.outputs.find((output) => output.path.includes("scripted_triggers")),
    `ready = { has_completed_focus = ISL_harbour }`,
  );
  semantic(
    result.outputs.find((output) => output.path.includes("scripted_effects")),
    `finish = {
    1 = { PREV = { complete_national_focus = ISL_charter }
      PREV = { country_event = { id = report.1 hours = 6 random_hours = 3 } } }
  }`,
  );
});

test("declared event chains support forward references, cycles and self-rescheduling without expansion", () => {
  const result = compiled(`${imports}
    export const first=CountryEvent({id:'chain.1',hidden:true,isTriggeredOnly:true,
      immediate:(c:CountryScope)=>c.schedule(second,{days:1})});
    export const second=CountryEvent({id:'chain.2',hidden:true,isTriggeredOnly:true,
      immediate:(c:CountryScope)=>{c.schedule(first,{days:2});c.schedule(second,{months:1});}});`);
  assert.equal(result.outputs.length, 2);
  semantic(
    result.outputs[0],
    `add_namespace = chain country_event = {
    id = chain.1 is_triggered_only = yes hidden = yes immediate = { country_event = { id = chain.2 days = 1 } }
  }`,
  );
  semantic(
    result.outputs[1],
    `add_namespace = chain country_event = {
    id = chain.2 is_triggered_only = yes hidden = yes immediate = {
      country_event = { id = chain.1 days = 2 } country_event = { id = chain.2 months = 1 }
    }
  }`,
  );
});

test("graph callbacks can reference the graph's own typed handles after identities are registered", () => {
  const result = compiled(`${imports}
    export const tree=FocusGraph({id:'self',nodes:{charter:{},assembly:{
      available:(c):boolean=>c.hasCompletedFocus(tree.focuses.charter),
      completionReward:c=>c.completeFocus(tree.focuses.charter)
    }}});`);
  const text = emitPdx(result.outputs[0].document);
  assert.match(text, /available = \{\s+has_completed_focus = self_charter/);
  assert.match(text, /completion_reward = \{\s+complete_national_focus = self_charter/);
});

test("schedule lowers additive delay fields and preserves country/news versus state recipient semantics", () => {
  const result = compiled(`${imports}
    export const news=NewsEvent({id:'delivery.1',hidden:true,isTriggeredOnly:true});
    export const local=StateEvent({id:'delivery.2',hidden:true,isTriggeredOnly:true});
    export const deliver=ScriptedEffect('deliver',(c:CountryScope)=>{
      c.schedule(news,{months:1,days:2,hours:3,randomDays:4,randomHours:5});
      c.state(state(1),(s:StateScope)=>s.schedule(local));
    });`);
  semantic(
    result.outputs.find((output) => output.path.includes("scripted_effects")),
    `deliver = {
    country_event = { id = delivery.1 hours = 3 days = 2 months = 1 random_hours = 5 random_days = 4 }
    1 = { state_event = { id = delivery.2 } }
  }`,
  );
});

test("graph references remain closed and node properties are checked by stock TypeScript inference", () => {
  rejected(`FocusGraph({id:'bad',nodes:{a:{},b:{}},sequences:[['a','missing']]});`, "TS2322");
  rejected(`FocusGraph({id:'bad',nodes:{a:{},b:{}},joins:[{to:'missing',all:['a']}]});`, "TS2322");
  rejected(`FocusGraph({id:'bad',nodes:{a:{},b:{}},choices:[['a','missing']]});`, "TS2322");
  rejected(`FocusGraph({id:'bad',nodes:{a:{costt:2}}});`, "TS2561");
  rejected(
    `const nodes:Record<string,FocusNodeSpec>={a:{}};FocusGraph({id:'bad',nodes});`,
    "TS2322",
  );
  rejected(`const graph=FocusGraph({id:'bad',nodes:{a:{}}});graph.focuses.missing;`, "TS2339");
  rejected(
    `FocusGraph({id:'bad',nodes:{a:{completionReward:(s:StateScope)=>s.effects.addManpower(1)}}});`,
    "TS2322",
  );
});

test("graph rejects topology cycles, empty groups and proven exclusive-branch deadlocks", () => {
  rejected(`FocusGraph({id:'bad',nodes:{a:{},b:{}},sequences:[['a','b'],['b','a']]});`, "KRG2603");
  rejected(`FocusGraph({id:'bad',nodes:{a:{}},joins:[{to:'a',any:['a']}]});`, "KRG2603");
  rejected(
    `FocusGraph({id:'bad',nodes:{a:{},b:{},end:{}},choices:[['a','b']],joins:[{to:'end',all:['a','b']}]});`,
    "KRG2604",
  );
  rejected(
    `FocusGraph({id:'bad',nodes:{a:{},b:{},left:{},right:{},end:{}},choices:[['a','b']],sequences:[['a','left','end'],['b','right','end']]});`,
    "KRG2604",
  );
  rejected(`FocusGraph({id:'bad',nodes:{a:{},b:{}},choices:[['a','a']]});`, "KRG2601");
  rejected(`FocusGraph({id:'bad',nodes:{}});`, "KRG2601");
  rejected(`FocusGraph({id:'bad',nodes:{a:{},b:{}},joins:[{to:'b',any:[]}]});`, "TS2322");
  rejected(`FocusGraph({id:'bad',nodes:{a:{}},layout:{rowSpacing:0}});`, "KRG2601");
});

test("OR joins reject every branch conflicting with an AND requirement but preserve a viable alternative", () => {
  rejected(
    `FocusGraph({id:'blocked',nodes:{a:{},b:{},c:{},end:{}},
      choices:[['a','b'],['a','c']],
      joins:[{to:'end',all:['a']},{to:'end',any:['b','c']}]});`,
    "KRG2604",
  );
  rejected(
    `FocusGraph({id:'blocked',nodes:{a:{},b:{},c:{},left:{},right:{},end:{}},
      choices:[['a','b'],['a','c']],sequences:[['b','left'],['c','right']],
      joins:[{to:'end',all:['a']},{to:'end',any:['left','right']}]});`,
    "KRG2604",
  );
  const result = compiled(`${imports}
    FocusGraph({id:'viable',nodes:{a:{},b:{},c:{},end:{}},choices:[['a','b']],
      joins:[{to:'end',all:['a']},{to:'end',any:['b','c']}]});`);
  assert.match(
    emitPdx(result.outputs[0].document),
    /id = viable_end[\s\S]*prerequisite = \{\s+focus = viable_a\s+\}\s+prerequisite = \{\s+focus = viable_b\s+focus = viable_c/,
  );
});

test("typed event and focus handles reject wrong recipient scopes, unrelated definitions and forged records", () => {
  rejected(
    `const e=StateEvent({id:'scope.1',hidden:true});ScriptedEffect('bad',(c:CountryScope)=>c.schedule(e));`,
    "TS2345",
  );
  rejected(
    `const e=CountryEvent({id:'scope.1',hidden:true});StateScriptedEffect('bad',(s:StateScope)=>s.schedule(e));`,
    "TS2345",
  );
  rejected(
    `const idea=Idea({id:'not_an_event'});ScriptedEffect('bad',(c:CountryScope)=>c.schedule(idea));`,
    "TS2345",
  );
  rejected(
    `ScriptedEffect('bad',(c:CountryScope)=>c.schedule({id:'fake.1',eventScope:'country'}));`,
    "TS2345",
  );
  rejected(
    `ScriptedTrigger('bad',(c:CountryScope)=>c.hasCompletedFocus({id:'fake_focus'}));`,
    "TS2345",
  );
  rejected(
    `const e=CountryEvent({id:'scope.1',hidden:true});ScriptedTrigger('bad',(c:CountryScope)=>{c.schedule(e);return true;});`,
    "KRG2037",
  );
});

test("event IDs and timing reject malformed numeric suffixes, negative delays and runtime values", () => {
  rejected(`CountryEvent({id:'bad.named',hidden:true});`, "TS2322");
  rejected(`CountryEvent({id:'bad.-1',hidden:true});`, "TS2322");
  rejected(`CountryEvent({id:'bad.0x1',hidden:true});`, "TS2322");
  rejected(`CountryEvent({id:'bad.1e3',hidden:true});`, "TS2322");
  rejected(`CountryEvent({id:'bad-namespace.1',hidden:true});`, "KRG2605");
  rejected(`const id:string='bad.named';CountryEvent({id,hidden:true});`, "KRG2605");
  rejected(
    `function event(id:string){return CountryEvent({id,hidden:true});}event('bad.-1');`,
    "KRG2605",
  );
  rejected(
    `const e=CountryEvent({id:'delay.1',hidden:true});ScriptedEffect('bad',(c:CountryScope)=>c.schedule(e,{days:-1}));`,
    "KRG2606",
  );
  rejected(
    `const e=CountryEvent({id:'delay.1',hidden:true});ScriptedEffect('bad',(c:CountryScope)=>c.schedule(e,{hours:1.5}));`,
    "KRG2606",
  );
  rejected(
    `const e=CountryEvent({id:'delay.1',hidden:true});ScriptedEffect('bad',(c:CountryScope)=>{let days:number=1;c.schedule(e,{days});});`,
    "KRG2606",
  );
  rejected(
    `const e=CountryEvent({id:'delay.1',hidden:true});ScriptedEffect('bad',(c:CountryScope)=>c.schedule(e,{random_days:1}));`,
    "TS2561",
  );
});

test("annotated event specs and source factories retain compatibility without bypassing ID validation", () => {
  const result = compiled(`${imports}
    import type {EventSpec} from 'krieg-lang/hoi4';
    const country:EventSpec<CountryScope>={id:'factory.001',hidden:true,isTriggeredOnly:true};
    const location:EventSpec<StateScope>={id:'factory.002',hidden:true,isTriggeredOnly:true};
    function news(spec:EventSpec<CountryScope>){return NewsEvent(spec);}
    export const report=CountryEvent(country);
    export const inspection=StateEvent(location);
    export const bulletin=news({id:'factory.003',hidden:true,isTriggeredOnly:true});
    export const deliver=ScriptedEffect('factory_delivery',c=>{
      c.schedule(report);c.schedule(bulletin,{days:1});
      c.state(state(1),s=>s.schedule(inspection));
    });`);
  assert.equal(result.outputs.length, 4);
  semantic(
    result.outputs.find((output) => output.path.includes("scripted_effects")),
    `factory_delivery = {
      country_event = { id = factory.001 }
      country_event = { id = factory.003 days = 1 }
      1 = { state_event = { id = factory.002 } }
    }`,
  );
});

test("zero-padded decimal IDs and dotted namespaces from vanilla and KR retain their spelling", () => {
  const ids = [
    "SEA_japan_air_accidents_events.01",
    "japan_legations_crisis_events.000",
    "UPC.chinademocraticleague.001",
  ];
  const result = compiled(`${imports}
    export default [${ids.map((id) => `CountryEvent({id:'${id}',hidden:true,isTriggeredOnly:true})`).join(",")}];`);
  assert.equal(result.outputs.length, ids.length);
  const text = result.outputs.map((output) => emitPdx(output.document)).join("\n");
  for (const id of ids) assert.ok(text.includes(`id = ${id}`), id);
  assert.match(text, /add_namespace = UPC\.chinademocraticleague/);
  assert.deepEqual(result.diagnostics, []);
});

test("large decimal event suffixes remain compatible and warn about namespace allocation overlap", () => {
  const result = compiled(
    `${imports}export const event=CountryEvent({id:'WORLD.181210',hidden:true});`,
  );
  assert.match(emitPdx(result.outputs[0].document), /id = WORLD\.181210/);
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, "KRG2609");
  assert.equal(result.diagnostics[0].severity, "warning");
});

test("semantic declarations reject duplicate event and generated focus IDs before emitting files", () => {
  rejected(
    `export const a=CountryEvent({id:'duplicate.1',hidden:true});export const b=StateEvent({id:'duplicate.1',hidden:true});`,
    "KRG2607",
  );
  rejected(
    `export const a=CountryEvent({id:'duplicate.1',hidden:true});export const b=CountryEvent({id:'duplicate.001',hidden:true});`,
    "KRG2607",
  );
  rejected(
    `export const a=FocusGraph({id:'one',prefix:'DUP',nodes:{root:{}}});export const b=FocusGraph({id:'two',prefix:'DUP',nodes:{root:{}}});`,
    "KRG2607",
  );
});

function project(t, source) {
  const root = mkdtempSync(join(tmpdir(), "krieg-gameplay-editor-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (file, content) => {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), content);
  };
  write("krgconfig.json", JSON.stringify({ name: "gameplay-types" }));
  write(
    "package.json",
    JSON.stringify({ name: "gameplay-types", version: "1.0.0", type: "module" }),
  );
  write("src/main.krg.ts", source);
  write(
    "tsconfig.json",
    JSON.stringify({ extends: "./.krieg/tsconfig.json", include: ["src/**/*.krg.ts"] }),
  );
  writeEditorProject(root);
  return { root, write };
}

function tsc(root) {
  return spawnSync(
    process.execPath,
    [
      resolve("node_modules/typescript/bin/tsc"),
      "--noEmit",
      "--pretty",
      "false",
      "--project",
      join(root, "tsconfig.json"),
    ],
    { encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
}

test("published declarations pass stock tsc and retain exact IDs and contextual callback types", (t) => {
  const { root } = project(
    t,
    `${imports}
    export const event=CountryEvent({id:'typed.1',hidden:true,isTriggeredOnly:true});
    const padded=CountryEvent({id:'typed.subtopic.0001',hidden:true});
    export const graph=FocusGraph({id:'typed_tree',prefix:'TYP',nodes:{
      charter:{completionReward:c=>c.schedule(event,{days:1})}, harbour:{}
    },sequences:[['charter','harbour']]});
    const exactEvent:'typed.1'=event.id;
    const exactPadded:'typed.subtopic.0001'=padded.id;
    const exactFocus:'TYP_harbour'=graph.focuses.harbour.id;
    const annotated:import('krieg-lang/hoi4').EventSpec<CountryScope>={id:'typed.2',hidden:true};
    const compatible=CountryEvent(annotated);
    function eventFactory(id:string){return CountryEvent({id,hidden:true});}
    const factoryEvent=eventFactory('typed.3');
    ScriptedEffect('compatible',c=>{c.schedule(compatible);c.schedule(factoryEvent);});
    export const reward=ScriptedEffect('reward',c=>{if(c.hasCompletedFocus(graph.focuses.charter))c.completeFocus(graph.focuses.harbour);});`,
  );
  const result = tsc(root);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("stock tsc rejects graph typos, wrong scope calls and forged handles without compiler-only checks", (t) => {
  const { root } = project(
    t,
    `${imports}
    const e=StateEvent({id:'typed.1',hidden:true});
    const tree=FocusGraph({id:'typed',nodes:{first:{},second:{}},sequences:[['first','missing']]});
    ScriptedEffect('bad',c=>{c.schedule(e);c.completeFocus({id:'fake'});});
    tree.focuses.no_such_focus;
    FocusGraph({id:'fields',nodes:{first:{completionReward:s=>s.effects.addManpower(1)}}});`,
  );
  const result = tsc(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /"missing".*"first" \| "second"/);
  assert.match(result.stdout, /EventDefinition<"state", "typed\.1">/);
  assert.match(result.stdout, /__kriegFocus/);
  assert.match(result.stdout, /no_such_focus/);
  assert.match(result.stdout, /addManpower/);
});

test("TypeScript language service completes exact graph keys, references, scope methods and delay fields", (t) => {
  const source = `${imports}
    const e=CountryEvent({id:'editor.1',hidden:true});
    const tree=FocusGraph({id:'editor',prefix:'ED',nodes:{charter:{},harbour:{},assembly:{}},
      sequences:[['charter','__KEY__']],joins:[{to:'__JOIN__',all:['charter']}]});
    tree.focuses.__FOCUS__;
    ScriptedEffect('edit',c=>{c.__SCOPE__;c.schedule(e,{__DELAY__:1});});
    const exact=tree.focuses.harbour;
  `;
  const { root } = project(t, source);
  const service = editorService(join(root, "tsconfig.json"));
  t.after(() => service.dispose());
  const file = join(root, "src/main.krg.ts");
  const entries = (marker) =>
    service
      .getCompletionsAtPosition(file, source.indexOf(marker), {})
      ?.entries.map((entry) => entry.name) ?? [];
  for (const marker of ["__KEY__", "__JOIN__", "__FOCUS__"])
    assert.deepEqual(entries(marker).sort(), ["assembly", "charter", "harbour"], marker);
  for (const name of ["schedule", "hasCompletedFocus", "completeFocus", "effects", "triggers"])
    assert.ok(entries("__SCOPE__").includes(name), name);
  assert.deepEqual(
    entries("__DELAY__").sort(),
    ["days", "hours", "months", "randomDays", "randomHours"].sort(),
  );
  const info = service.getQuickInfoAtPosition(file, source.lastIndexOf("harbour") + 2);
  assert.match(info.displayParts.map((part) => part.text).join(""), /FocusReference<"ED_harbour">/);
});
