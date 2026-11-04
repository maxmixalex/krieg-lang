import assert from "node:assert/strict";
import test from "node:test";
import { compileSource, emitCompileOutput } from "../dist/compiler/index.js";
import { compareFiles } from "../scripts/compare-rewrite.mjs";
import { restoreDataFile } from "../scripts/rewrite-inputs.mjs";

const compile = (body) =>
  compileSource(
    `import {ScriptedEffect, StateScriptedEffect, CountryEvent, DefinitionSeries, DynamicModifier, FlagAchievements, type CountryScope} from "krieg-lang/hoi4";\n${body}`,
  );
const field = (block, key) => block.find((x) => x.key?.text === key);
function visit(items, n, checks = { count: 0 }) {
  const branch = field(items, "if");
  if (!branch) return field(items, "set_technology")?.value.items[0].key.text;
  const conditions = field(branch.value.items, "limit").value.items;
  const take = conditions.every((c) => {
    checks.count++;
    const negated = c.key.text === "NOT";
    const p = (negated ? c.value.items[0] : c).value.items[0];
    assert.equal(p.operator, "<");
    return negated ? !(n < +p.value.text) : n < +p.value.text;
  });
  return take
    ? visit(branch.value.items.slice(1), n, checks)
    : visit(field(items, "else")?.value.items ?? [], n, checks);
}
test("catalogue dispatch preserves indexed rows, clamp/ignore bounds and logarithmic comparisons", () => {
  for (const outside of ["ignore", "clamp"]) {
    const rows = Array.from({ length: 65 }, (_, i) => ({ tech: "naval_" + i }));
    const r = compile(`const catalog=${JSON.stringify(rows)} as const;
    ScriptedEffect("pick",(c:CountryScope)=>c.dispatchByIndex("active_slot",catalog,(country,row,ordinal)=>country.grantTechnology(row.tech,{popup:true}),{first:1,outOfRange:"${outside}"}));`);
    assert.ok(r.success, JSON.stringify(r.diagnostics));
    const body = r.outputs[0].document.items[0].value.items;
    for (let n = -1; n <= 67; n++) {
      const checks = { count: 0 };
      assert.equal(
        visit(body, n, checks),
        outside === "ignore" && (n < 1 || n > 65)
          ? undefined
          : "naval_" + Math.max(0, Math.min(64, n - 1)),
      );
      assert.ok(checks.count <= 9);
    }
  }
});
test("series use ordinary typed declarations; achievement flags and native calendar keep their engine identities", () => {
  const r = compile(`FlagAchievements("service",{prefix:"medal_",first:5,count:2,scope:"country"});
 DefinitionSeries(12,2,i=>DynamicModifier({id:"office_"+i, outputPath:"common/dynamic_modifiers/offices.txt",entries:{political_power_gain:"amount_"+i}}));
 CountryEvent({id:"clock.1",hidden:true,isTriggeredOnly:true,immediate:c=>{if(c.dateBefore("1939.9.1") && c.dateOnOrAfter("1936.1.1.12") && !(c.navyExperience < 25)){c.effects.addPoliticalPower(1);}}});`);
  assert.ok(r.success, JSON.stringify(r.diagnostics));
  const native = r.outputs.map(emitCompileOutput).join("\n");
  for (const k of [
    "medal_5",
    "medal_6",
    "has_country_flag = medal_6",
    "office_12",
    "office_13",
    "date < 1939.9.1",
    "date < 1936.1.1.12",
    "has_navy_experience < 25",
    "NOT =",
  ])
    assert.ok(native.includes(k), k);
  for (const body of [
    'FlagAchievements("bad",{prefix:"b",count:18000});',
    'DefinitionSeries(0,-1,i=>DynamicModifier({id:"x"}));',
    'ScriptedEffect("bad",(c:CountryScope)=>c.dispatchByIndex("x",[],()=>{}));',
    'ScriptedEffect("bad",(c:CountryScope)=>{if(c.dateBefore("1939.19.42")) c.effects.addPoliticalPower(2);});',
    'ScriptedEffect("bad",(c:CountryScope)=>c.dispatchByIndex("x",[{cost:3}],(country,row)=>country.effects.addPoliticalPower(row.coast)));',
    'StateScriptedEffect("bad",s=>s.grantTechnology("army"));',
  ])
    assert.ok(!compile(body).success, body);
});
test("native comparison keeps duplicate keys, statement order, operators and unrecognised localisation visible", () => {
  const src = (s) =>
    new Map([
      ["common/scripted_effects/one.txt", Buffer.from(s)],
      ["localisation/english/test_l_english.yml", Buffer.from('l_english:\n A: "ok"\n broken')],
    ]);
  let result = compareFiles(src("x={a=1 a=2}"), src("x={a=2 a=1}"));
  assert.equal(result.definitions.changed, 1);
  assert.equal(result.exactComparedContents, false);
  assert.equal(result.unrecognizedTranslationLines.original, 1);
  result = compareFiles(src("x={ a = {v>2}}"), src("x={ a = {v<2}}"));
  assert.equal(result.definitions.changed, 1);
  const text = Buffer.from('﻿l_english:\r\nHELLO: "你好 #world" # note\r\n');
  assert.equal(
    restoreDataFile("localisation/a.yml", text).toString(),
    '﻿l_english:\r\n HELLO: "你好 #world" # note\r\n',
  );
});

test("conjunctions compact only under implicit AND; mixed OR and native NOR keep groups", () => {
  const r = compile(`ScriptedEffect("logic",(c:CountryScope)=> {
   if(!(c.triggers.hasCountryFlag("a") && c.triggers.hasCountryFlag("b"))) c.effects.addPoliticalPower(1);
   if((c.triggers.hasCountryFlag("a") && c.triggers.hasCountryFlag("b")) || c.triggers.hasCountryFlag("d")) c.effects.addPoliticalPower(2);
 });`);
  assert.ok(r.success, JSON.stringify(r.diagnostics));
  const items = r.outputs[0].document.items[0].value.items,
    trigger = (i) => field(items[i].value.items, "limit").value.items[0];
  assert.equal(trigger(0).key.text, "NOT");
  assert.equal(trigger(0).value.items[0].key.text, "AND");
  assert.equal(trigger(1).key.text, "OR");
  assert.equal(trigger(1).value.items[0].key.text, "AND");
});
test("persistence banks read achievement OR flag, encode scale-independent selection, and expose country handles", () => {
  const r =
    compile(`const bank=FlagAchievements("profile",{prefix:"saved_",count:4,storage:{array:"values",index:"cursor",load:"restore_bits",mark:"set_bit"}});
 CountryEvent({id:"save.1",hidden:true,isTriggeredOnly:true,immediate:c=>{c.run(bank.load);c.run(bank.mark);}});`);
  assert.ok(r.success, JSON.stringify(r.diagnostics));
  const raw = r.outputs.map(emitCompileOutput).join("\n");
  assert.match(raw, /has_global_flag = saved_3/);
  assert.match(
    raw,
    /has_completed_custom_achievement = \{\s+mod = profile\s+achievement = saved_3/,
  );
  assert.match(raw, /remove_from_array = \{\s+array = values\s+index = cursor/);
  assert.match(raw, /restore_bits = yes\s+set_bit = yes/);
});
