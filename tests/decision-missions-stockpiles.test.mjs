import assert from "node:assert/strict";
import test from "node:test";
import { compileSource, emitCompileOutput } from "../dist/compiler/index.js";
import { properties } from "./support/uno-native-machine.mjs";
import { GambleNativeMachine, gambleInventory } from "./support/gamble-native-machine.mjs";
const imports = `import {AudioBank,DecisionCategory,CountryAction,ScriptedEffect,StateScriptedEffect,ScriptedTrigger,type CountryScope} from 'krieg-lang/hoi4';`;
function compile(source) {
  return compileSource(imports + source, { fileName: "mission.krg.ts" });
}
test("missions retain native lifecycle, placement priority and typed timeout effects", () => {
  const result = compile(
    `DecisionCategory({id:'clock',priority:20,scriptedGui:'clock_ui',decisions:[{id:'wait',priority:9,available:()=>false,mission:{days:3,activation:c=>c.triggers.hasCountryFlag('start'),cancel:c=>c.triggers.hasCountryFlag('closed'),selectable:false,isGood:true,timeout:c=>c.effects.addPoliticalPower(5)}}]});`,
  );
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  const text = result.outputs.map(emitCompileOutput).join("\n");
  for (const token of [
    "days_mission_timeout = 3",
    "cancel_trigger",
    "timeout_effect",
    "selectable_mission = no",
    "scripted_gui = clock_ui",
    "priority = 20",
  ])
    assert.ok(text.includes(token), token);
  const machine = new GambleNativeMachine(
    gambleInventory(result.outputs.map((o) => [o.path, o.document])),
  );
  machine.timeout("wait");
  assert.equal(machine.country.money.pp, 1005);
  machine.country.flags.add("closed");
  machine.timeout("wait");
  assert.equal(machine.country.money.pp, 1005);
});
test("equipment comparisons distinguish exact equality and state building comparisons preserve >", () => {
  const result = compile(
    `ScriptedTrigger('inclusive',c=>c.hasEquipment('infantry_equipment',1000));ScriptedTrigger('strict',c=>c.hasEquipment('infantry_equipment',1000,'moreThan'));StateScriptedEffect('remove',s=>{if(s.buildingLevel('arms_factory')>0)s.effects.remove_building({type:'arms_factory',level:1});});`,
  );
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  const triggers = new Map(
    result.outputs
      .filter((o) => o.path.includes("scripted_triggers"))
      .flatMap((o) => properties(o.document).map((p) => [p.key.text, p.value])),
  );
  const m = new GambleNativeMachine(
    gambleInventory(result.outputs.map((o) => [o.path, o.document])),
  );
  for (const n of [999, 1000, 1001]) {
    m.country.equipment.infantry_equipment = n;
    assert.equal(m.condition(triggers.get("inclusive"), m.country), n >= 1000);
    assert.equal(m.condition(triggers.get("strict"), m.country), n > 1000);
  }
  for (const n of [0, 1, 2]) {
    const s = m.country.states[0];
    s.buildings.arms_factory = n;
    m.run("remove", s);
    assert.equal(s.buildings.arms_factory, n > 0 ? n - 1 : n);
  }
});
test("helper returns are local to their call while dynamic early exits remain rejected", () => {
  const ok = compile(
    `function price():number{return 5;}function allowed(c:CountryScope):boolean{return c.politicalPower>10;}ScriptedEffect('pay',c=>{if(c.triggers.hasCountryFlag('start')){if(allowed(c))c.effects.addPoliticalPower(-price());}});`,
  );
  assert.equal(ok.success, true, JSON.stringify(ok.diagnostics));
  const bad = compile(
    `ScriptedEffect('bad',c=>{if(c.politicalPower>10)return;c.effects.addPoliticalPower(5);});`,
  );
  assert.equal(bad.success, false);
  assert.ok(bad.diagnostics.some((d) => d.code === "KRG2062"));
});
test("missions reject fractional days and CountryAction price bindings", () => {
  for (const source of [
    `DecisionCategory({id:'x',decisions:[{id:'m',mission:{days:1.5,timeout:c=>c.effects.addPoliticalPower(1)}}]});`,
    `const a=CountryAction('a',{politicalPowerCost:5,perform:c=>c.effects.addStability(.1)});DecisionCategory({id:'x',decisions:[{id:'m',action:a,mission:{days:1,timeout:c=>c.effects.addPoliticalPower(1)}}]});`,
  ]) {
    const r = compile(source);
    assert.equal(r.success, false);
    assert.deepEqual(r.outputs, []);
  }
});

test("audio banks preserve audible-instance caps without untyped native records", () => {
  const result = compile(
    `AudioBank('table',{path:'sound/table.asset',clips:{deal:'deal.wav'},maxAudible:1});`,
  );
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  const text = result.outputs.map(emitCompileOutput).join("\n");
  assert.match(text, /max_audible = 1/);
  assert.match(text, /max_audible_behaviour = fail/);
  for (const n of [0, -1, 1.5])
    assert.equal(
      compile(
        `AudioBank('table',{path:'sound/table.asset',clips:{deal:'deal.wav'},maxAudible:${n}});`,
      ).success,
      false,
    );
});
