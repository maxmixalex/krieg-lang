import assert from "node:assert/strict";
import test from "node:test";
import { compileSource, emitCompileOutput } from "../dist/compiler/index.js";
import { comparePdxSemantic, parsePdx } from "../dist/pdx/index.js";

function good(source) {
  const result = compileSource(source);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  return result;
}
function bad(source, code, options = {}) {
  const result = compileSource(source, options);
  assert.equal(result.success, false);
  assert.deepEqual(result.outputs, []);
  assert.ok(
    result.diagnostics.some((d) => d.code === code),
    JSON.stringify(result.diagnostics),
  );
}
const imports = `import {ScriptedEffect,type CountryScope} from 'krieg-lang/hoi4';`;

test("rule-sized tables compose bounded static map/flatMap/filter without a runtime array API", () => {
  const result = good(`${imports}
 const cards=[1,2].flatMap(color=>[0,1].flatMap(rank=>(rank===0?[1]:[1,2]).map(copy=>({color,rank,copy}))));
 ScriptedEffect('cards',country=>{for(const card of cards.filter(card=>card.color===2))country.effects.setCountryFlag('card_'+card.color+'_'+card.rank+'_'+card.copy);});`);
  const expected = parsePdx(
    `cards={set_country_flag=card_2_0_1 set_country_flag=card_2_1_1 set_country_flag=card_2_1_2}`,
  ).document;
  assert.ok(
    comparePdxSemantic(result.outputs[0].document, expected),
    emitCompileOutput(result.outputs[0]),
  );
  bad(
    `${imports}ScriptedEffect('bad',c=>{const invalid=[1,2].filter(n=>c.politicalPower>n);});`,
    "KRG2721",
  );
  bad(`${imports}const xs=[1,2,3,4,5,6,7,8,9].flatMap(x=>[1,2,3,4,5].map(y=>x+y));`, "KRG2001", {
    maxExpansion: 35,
  });
});

test("finite some/every predicates lower to ordinary native OR/AND and constant empty-set identities", () => {
  const result = good(`${imports}ScriptedEffect('predicates',c=>{
 if(['red','blue'].some(name=>c.triggers.hasCountryFlag(name)))c.effects.addPoliticalPower(1);
 if(['red','blue'].every(name=>c.triggers.hasCountryFlag(name)))c.effects.addPoliticalPower(2);
 if([].every(name=>false))c.effects.addPoliticalPower(3);
 if([].some(name=>true))c.effects.addPoliticalPower(999);
 });`);
  const output = result.outputs.map(emitCompileOutput).join("\n");
  assert.match(output, /OR = \{\s+has_country_flag = red\s+has_country_flag = blue/);
  assert.match(output, /limit = \{\s+has_country_flag = red\s+has_country_flag = blue/);
  assert.match(output, /add_political_power = 3/);
  assert.doesNotMatch(output, /999/);
});

test("randomChoice preserves repeated native weights and turns eligibility into a zero-weight modifier", () => {
  const result = good(`${imports}ScriptedEffect('choose',country=>country.randomChoice([
 {weight:1,when:c=>c.triggers.hasCountryFlag('red'),effects:c=>c.effects.addPoliticalPower(10)},
 {weight:1,effects:c=>c.effects.addPoliticalPower(20)},
 {weight:country.variable('deck_card'),effects:c=>c.effects.setCountryFlag('drawn')}
 ]));`);
  const expected = parsePdx(`choose={random_list={
  1={modifier={factor=0 NOT={has_country_flag=red}} add_political_power=10}
  1={add_political_power=20}
  deck_card={set_country_flag=drawn}
 }}`).document;
  assert.ok(
    comparePdxSemantic(result.outputs[0].document, expected),
    emitCompileOutput(result.outputs[0]),
  );
  for (const weight of [-1, 0.5])
    bad(
      `${imports}ScriptedEffect('bad',c=>c.randomChoice([{weight:${weight},effects:c=>{}}]));`,
      "KRG2723",
    );
  bad(`${imports}ScriptedEffect('bad',c=>c.randomChoice([]));`, "KRG2722");
  bad(
    `${imports}ScriptedEffect('bad',c=>c.randomChoice([{weight:1,effects:c=>c.effects.setStateFlag('wrong')} ]));`,
    "TS2339",
  );
});
