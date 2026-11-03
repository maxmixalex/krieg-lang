import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import ts from "typescript";
import { compileProject, compileSource, emitCompileOutput } from "../dist/compiler/index.js";
import { comparePdxSemantic, parsePdx } from "../dist/pdx/index.js";
import { initProject, writeEditorProject } from "../dist/project/index.js";
import { editorService } from "./support/editor-service.mjs";

const imports = `import {CountryAction,CountryEvent,Decision,DecisionCategory,ScriptedEffect,
  ScriptedTrigger,StateScriptedEffect,StateScriptedTrigger,type CountryActionDefinition,
  type CountryActionSpec,type CountryScope,type StateScope} from 'krieg-lang/hoi4';
  import {ScriptedWindow} from 'krieg-lang/ui';`;
const action = `const aid=CountryAction('aid',{politicalPowerCost:25,
  available:c=>c.triggers.hasCountryFlag('unlocked')&&!c.triggers.hasCountryFlag('received'),
  perform:c=>{c.effects.addStability(0.05);c.effects.setCountryFlag('received');}});`;
const sample = `${imports}${action}
  CountryEvent({id:'aid.1',title:'aid.t',isTriggeredOnly:true,options:[{
    name:'aid.a',trigger:c=>c.test(aid.available),effects:c=>c.run(aid.execute)
  }]});
  DecisionCategory({id:'aid_category',decisions:[Decision({id:'aid_decision',action:aid})]});
  ScriptedWindow({name:'aid_panel',path:'interface/aid.gui',context:'player_context'},ui=>
    <ui.Container name='aid_window'><ui.Button name='buy' action={aid}/></ui.Container>);`;

function compiled(source, options = {}) {
  const result = compileSource(source, { fileName: "actions.krg.tsx", ...options });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  return result;
}
function rejected(source, code) {
  const result = compileSource(`${imports}${source}`, { fileName: "actions.krg.tsx" });
  assert.equal(result.success, false, "Expected a checked action failure");
  assert.deepEqual(result.outputs, [], "Failed actions must not produce partial output");
  assert.ok(
    result.diagnostics.some((d) => (code ? d.code === code : d.code.startsWith("TS"))),
    JSON.stringify(result.diagnostics, null, 2),
  );
}
function semantic(result, path, source) {
  const expected = parsePdx(source);
  assert.deepEqual(expected.diagnostics, []);
  const actual = result.outputs.find((output) => output.path === path);
  assert.ok(actual, path);
  assert.ok(comparePdxSemantic(actual.document, expected.document), emitCompileOutput(actual));
}

test("CountryAction shares named eligibility and settlement across events, buttons and native-cost decisions", () => {
  const result = compiled(sample);
  assert.equal(result.outputs.length, 7);
  semantic(
    result,
    "common/scripted_triggers/krieg_aid_action.txt",
    `
    aid_eligible={AND={has_country_flag=unlocked NOT={has_country_flag=received}}}
    aid_available={aid_eligible=yes NOT={has_political_power<25}}`,
  );
  semantic(
    result,
    "common/scripted_effects/krieg_aid_action.txt",
    `
    aid_perform={add_stability=0.05 set_country_flag=received}
    aid_execute={if={limit={aid_available=yes} add_political_power=-25 aid_perform=yes}}`,
  );
  semantic(
    result,
    "common/decisions/krieg_aid_category.txt",
    `
    aid_category={aid_decision={cost=25 available={aid_eligible=yes} complete_effect={aid_perform=yes}}}`,
  );
  semantic(
    result,
    "common/scripted_guis/krieg_aid_panel.txt",
    `
    scripted_gui={aid_panel={window_name="aid_window" context_type=player_context
      effects={buy_click={aid_execute=yes}} triggers={buy_click_enabled={aid_available=yes}}}}`,
  );
  const event = emitCompileOutput(
    result.outputs.find((output) => output.path.startsWith("events/")),
  );
  assert.match(event, /trigger = \{\s+aid_available = yes/);
  assert.match(event, /aid_execute = yes/);
  const all = result.outputs.map(emitCompileOutput).join("\n");
  assert.equal((all.match(/add_political_power = -25/g) ?? []).length, 1);
  assert.equal((all.match(/add_stability = 0.05/g) ?? []).length, 1);
});

// Execute the emitted native subset against balances and flags. This is a contract
// test for the generated script; in-game decision/UI timing still needs game testing.
function nativeHarness(result) {
  const triggers = new Map();
  const effects = new Map();
  for (const output of result.outputs) {
    const map = output.path.includes("/scripted_triggers/")
      ? triggers
      : output.path.includes("/scripted_effects/")
        ? effects
        : undefined;
    if (map) for (const entry of output.document.items) map.set(entry.key.text, entry.value.items);
  }
  const check = (entries, state) =>
    entries.every((entry) => {
      const key = entry.key.text;
      if (key === "AND") return check(entry.value.items, state);
      if (key === "NOT") return !check(entry.value.items, state);
      if (key === "always") return entry.value.text === "yes";
      if (key === "has_country_flag") return state.flags.has(entry.value.text);
      if (key === "has_political_power" && entry.operator === "<")
        return state.pp < Number(entry.value.text);
      assert.ok(triggers.has(key), `unexpected native trigger ${key}`);
      return check(triggers.get(key), state);
    });
  const run = (entries, state) => {
    for (const entry of entries) {
      const key = entry.key.text;
      if (key === "if") {
        const limit = entry.value.items.find((item) => item.key.text === "limit");
        if (check(limit.value.items, state))
          run(
            entry.value.items.filter((item) => item !== limit),
            state,
          );
      } else if (key === "add_political_power") state.pp += Number(entry.value.text);
      else if (key === "add_stability") state.stability += Number(entry.value.text);
      else if (key === "set_country_flag") state.flags.add(entry.value.text);
      else {
        assert.ok(effects.has(key), `unexpected native effect ${key}`);
        run(effects.get(key), state);
      }
    }
  };
  return {
    available: (state) => check(triggers.get("aid_available"), state),
    execute: (state) => run(effects.get("aid_execute"), state),
    decide(state) {
      const output = result.outputs.find(
        (output) => output.path === "common/decisions/krieg_aid_category.txt",
      );
      const fields = output.document.items[0].value.items[0].value.items;
      const field = (key) => fields.find((entry) => entry.key.text === key).value;
      const cost = Number(field("cost").text);
      if (state.pp < cost || !check(field("available").items, state)) return;
      state.pp -= cost; // The native decision engine owns this payment.
      run(field("complete_effect").items, state);
    },
  };
}

test("exact funds, insufficient funds, changed eligibility and repeats obey both payment paths", () => {
  const game = nativeHarness(compiled(sample));
  for (const entry of ["execute", "decide"]) {
    for (const balance of [24, 25, 26]) {
      const state = { pp: balance, stability: 0, flags: new Set(["unlocked"]) };
      assert.equal(game.available(state), balance >= 25);
      game[entry](state);
      assert.equal(state.pp, balance >= 25 ? balance - 25 : balance, entry);
      assert.equal(state.stability, balance >= 25 ? 0.05 : 0, entry);
      game[entry](state);
      assert.equal(state.stability, balance >= 25 ? 0.05 : 0, "repeat must not settle again");
    }
    const stale = { pp: 100, stability: 0, flags: new Set(["unlocked"]) };
    assert.equal(game.available(stale), true);
    stale.flags.delete("unlocked");
    game[entry](stale);
    assert.equal(stale.pp, 100, "execution rechecks eligibility after display");
    assert.equal(stale.stability, 0);
  }
});

test("zero cost is free at negative political power and does not emit a zero deduction", () => {
  const result = compiled(`${imports}const aid=CountryAction('aid',{politicalPowerCost:0,
    perform:c=>c.effects.addStability(0.05)});`);
  const game = nativeHarness(result);
  const state = { pp: -20, stability: 0, flags: new Set() };
  assert.equal(game.available(state), true);
  game.execute(state);
  assert.equal(state.pp, -20);
  assert.equal(state.stability, 0.05);
  assert.doesNotMatch(
    result.outputs.map(emitCompileOutput).join("\n"),
    /has_political_power|add_political_power/,
  );
});

test("cross-file aliases, inline actions and source factories emit their resources once with batch ownership", () => {
  const sources = {
    "factory.krg.ts": `import * as sdk from 'krieg-lang/hoi4';
      export function make(id:string){return sdk.CountryAction(id,{politicalPowerCost:10,perform:c=>c.effects.addStability(.01)});}`,
    "shared.krg.ts": `import {CountryAction as Action} from 'krieg-lang/hoi4';
      export const shared=Action('shared',{politicalPowerCost:20,perform:c=>c.effects.addWarSupport(.01)});`,
    "main.krg.ts": `${imports}import {make} from './factory.krg.js';import {shared} from './shared.krg.js';
      DecisionCategory({id:'shared_category',decisions:[{id:'inline',action:make('inline')},{id:'one',action:shared},{id:'two',action:shared}]});`,
  };
  for (const emitDependencies of [true, false]) {
    const result = compileProject({
      rootDir: "/virtual/actions",
      files: ["main.krg.ts"],
      sources,
      emitDependencies,
    });
    assert.equal(result.success, true, JSON.stringify(result.diagnostics));
    assert.equal(result.outputs.length, emitDependencies ? 6 : 4);
    assert.equal(
      result.outputs.filter((output) => output.path.includes("krieg_inline_action")).length,
      2,
    );
    assert.equal(
      result.outputs.filter((output) => output.path.includes("krieg_shared_action")).length,
      emitDependencies ? 2 : 0,
    );
  }
  const inline = compiled(`${imports}DecisionCategory({id:'category',decisions:[{id:'inline',
    action:CountryAction('inline',{politicalPowerCost:5,perform:c=>c.effects.addStability(.01)})}]});`);
  assert.equal(inline.outputs.length, 4);
});

test("action identifiers, costs, fields and generated native name collisions are checked", () => {
  for (const cost of ["-1", "0.5", "9007199254740992", "1e100"])
    rejected(`CountryAction('bad',{politicalPowerCost:${cost},perform:c=>{}});`, "KRG2620");
  rejected(`CountryAction('bad-name',{politicalPowerCost:1,perform:c=>{}});`, "KRG2620");
  rejected(
    `const specification={politicalPowerCost:25,perform:(c:CountryScope)=>{},cost:5};CountryAction('bad',specification);`,
    "KRG2620",
  );
  for (const suffix of ["eligible", "available", "perform", "execute"]) {
    const constructor = ["eligible", "available"].includes(suffix)
      ? "ScriptedTrigger"
      : "ScriptedEffect";
    const body = constructor === "ScriptedTrigger" ? "true" : "{}";
    rejected(`${action}${constructor}('aid_${suffix}',c=>${body});`, "KRG2611");
  }
  rejected(`${action}CountryAction('aid',{politicalPowerCost:1,perform:c=>{}});`, "KRG2611");
});

test("country scope, forged handles, effect/trigger roles and mixed ownership fail statically", () => {
  rejected(
    `CountryAction('bad',{politicalPowerCost:1,perform:(s:StateScope)=>s.effects.addManpower(1)});`,
  );
  rejected(
    `CountryAction('bad',{politicalPowerCost:1,available:(s:StateScope)=>s.triggers.hasStateFlag('bad'),perform:c=>{}});`,
  );
  rejected(`${action}StateScriptedEffect('bad',s=>s.run(aid.execute));`);
  rejected(`${action}StateScriptedTrigger('bad',s=>s.test(aid.available));`);
  rejected(`${action}ScriptedEffect('bad',c=>c.run(aid.available));`);
  rejected(`${action}ScriptedTrigger('bad',c=>c.test(aid.execute));`);
  rejected(`const fake:CountryActionDefinition={id:'fake',politicalPowerCost:0};`);
  rejected(
    `const fake={id:'fake',politicalPowerCost:0} as CountryActionDefinition;DecisionCategory({id:'bad',decisions:[{id:'fake',action:fake}]});`,
    "KRG1003",
  );
  rejected(
    `${action}const fake={...aid,politicalPowerCost:0};DecisionCategory({id:'bad',decisions:[{id:'fake',action:fake}]});`,
    "KRG2003",
  );
  rejected(
    `${action}const fake:CountryActionDefinition={id:aid.id,politicalPowerCost:0,available:aid.available,execute:aid.execute,
    __kriegCountryAction:aid.__kriegCountryAction,__kriegDefinition:aid.__kriegDefinition};
    DecisionCategory({id:'bad',decisions:[{id:'fake',action:fake}]});`,
    "KRG2016",
  );
  for (const field of [
    "cost:5",
    "available:(c:CountryScope)=>true",
    "completeEffect:(c:CountryScope)=>{}",
  ])
    rejected(`${action}DecisionCategory({id:'bad',decisions:[{id:'bad',action:aid,${field}}]});`);
  for (const field of ["click={c=>{}}", "enabled={c=>true}"])
    rejected(`${action}ScriptedWindow({name:'bad',path:'interface/bad.gui',context:'player_context'},ui=>
      <ui.Container name='window'><ui.Button name='bad' action={aid} ${field}/></ui.Container>);`);
  for (const context of ["global_context", "selected_state_context", "state_mapicon"])
    rejected(`${action}ScriptedWindow({name:'bad',path:'interface/bad.gui',context:'${context}'},ui=>
      <ui.Container name='window'><ui.Button name='bad' action={aid}/></ui.Container>);`);
  rejected(`${action}const mixed={action:aid,cost:5};Decision({id:'bad',...mixed});`);
  rejected(
    `${action}const raw={id:'hidden_cost',cost:5};const visual:{id:string}=raw;
    DecisionCategory({id:'bad',decisions:[{...visual,action:aid}]});`,
    "KRG2622",
  );
  rejected(
    `${action}const raw={name:'hidden_enabled',enabled:(c:CountryScope)=>true};const visual:{name:string}=raw;
    ScriptedWindow({name:'bad',path:'interface/bad.gui',context:'player_context'},ui=>
      <ui.Container name='window'><ui.Button {...visual} action={aid}/></ui.Container>);`,
    "KRG2622",
  );
  rejected(
    `ScriptedEffect('bad',c=>{CountryAction('nested',{politicalPowerCost:5,perform:s=>{}});});`,
    "KRG2028",
  );
});

test("stock TypeScript and its LanguageService infer action callbacks, handles and binding completions", () => {
  const root = mkdtempSync(join(tmpdir(), "krieg-action-editor-"));
  try {
    initProject(root);
    const file = join(root, "src", "actions.krg.tsx");
    writeFileSync(file, sample);
    writeEditorProject(root);
    const config = join(root, "tsconfig.json");
    const service = editorService(config);
    const errors = ts.getPreEmitDiagnostics(service.getProgram());
    assert.deepEqual(
      errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")),
      [],
    );
    service.dispose();
    for (const probe of [
      {
        source: `${imports}CountryAction('aid',{politicalPowerCost:25,perform:c=>c.effects./*complete*/});`,
        include: ["addPoliticalPower", "setCountryFlag"],
        exclude: ["setStateFlag"],
      },
      {
        source: `${imports}${action}aid./*complete*/;`,
        include: ["available", "execute", "politicalPowerCost"],
        exclude: ["perform", "eligible"],
      },
      {
        source: `${imports}${action}Decision({id:'aid',/*complete*/});`,
        include: ["action", "visible"],
        exclude: ["click"],
      },
      {
        source: `${imports}${action}ScriptedWindow({name:'aid',path:'interface/aid.gui',context:'player_context'},ui=><ui.Container name='window'><ui.Button name='buy' /*complete*/ /></ui.Container>);`,
        include: ["action", "visible"],
        exclude: ["onClick"],
      },
    ]) {
      const position = probe.source.indexOf("/*complete*/");
      writeFileSync(file, probe.source.replace("/*complete*/", ""));
      const completion = editorService(config);
      const names =
        completion
          .getCompletionsAtPosition(file, position, {})
          ?.entries.map((entry) => entry.name) ?? [];
      for (const name of probe.include)
        assert.ok(names.includes(name), `${name} missing from ${names}`);
      for (const name of probe.exclude)
        assert.ok(!names.includes(name), `${name} leaked into ${names}`);
      completion.dispose();
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
