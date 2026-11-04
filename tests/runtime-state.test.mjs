import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";
import { compileSource, emitCompileOutput } from "../dist/compiler/index.js";
import { writeEditorProject } from "../dist/project/index.js";
import { editorService } from "./support/editor-service.mjs";

const imports = `import {ScriptedEffect,ScriptedTrigger,countryTarget,stateTarget,AudioBank} from 'krieg-lang/hoi4';`;
function compile(source) {
  const r = compileSource(imports + source);
  assert.equal(r.success, true, JSON.stringify(r.diagnostics));
  return r.outputs.map(emitCompileOutput).join("\n");
}
function fails(source, code) {
  const r = compileSource(imports + source);
  assert.equal(r.success, false);
  assert.ok(
    r.diagnostics.some((d) => d.code === code),
    JSON.stringify(r.diagnostics),
  );
}

test("named variables retain global names across captured scopes and resolve ordinary ancestors", () => {
  const native = compile(
    `ScriptedEffect('capture',c=>{c.everyState(s=>{s.setVariable('own',c.variable('balance'));s.setVariable('world',c.variable('global.total'));s.setVariable('player',c.variable('ROOT.balance'));});});`,
  );
  assert.match(native, /value = PREV.balance/);
  assert.match(native, /value = global.total/);
  assert.match(native, /value = ROOT.balance/);
  assert.doesNotMatch(native, /PREV.global|PREV.ROOT/);
});
test("explicit target operations distinguish owned states from world states and preserve state targets", () => {
  const native = compile(
    `ScriptedEffect('transfer',c=>{c.everyState(s=>s.effects.setStateFlag('owned'));c.everyGlobalState(s=>s.triggers.hasStateFlag('marked'),s=>s.country(countryTarget('var:recipient'),r=>r.effects.transfer_state(stateTarget('PREV'))));c.state(stateTarget('FROM.FROM'),s=>s.effects.clearStateFlag('marked'));});ScriptedTrigger('visible',c=>c.countryMatches(countryTarget('ROOT'),r=>!r.isAI));`,
  );
  assert.match(native, /every_owned_state/);
  assert.match(native, /every_state/);
  assert.match(native, /var:recipient = \{\s*transfer_state = PREV/);
  assert.match(native, /FROM.FROM =/);
  assert.match(native, /ROOT = \{/);
});
test("numeric operators and arrays reject malformed source and preserve scope in runtime loops", () => {
  const native = compile(
    `ScriptedEffect('loop',c=>{c.setVariable('balance',c.variable('global.total')*2);c.forRange({start:0,end:c.variable('count'),index:'i'},same=>{same.addVariable('balance',1);c.addVariable('global.total',1);});c.whileLoop(s=>s.variable('remaining')>0,s=>s.subtractVariable('remaining',1));c.arrayPush('global.players',countryTarget('THIS'));c.forEachCountryInArray('global.players',r=>r.addVariable('global.total',r.variable('score')));});`,
  );
  assert.match(native, /for_loop_effect = \{\s*start = 0\s*end = count\s*value = i/);
  assert.match(native, /while_loop_effect/);
  assert.doesNotMatch(native, /PREV =/);
  assert.match(native, /for_each_scope_loop/);
  fails(`ScriptedEffect('bad',c=>c.divideVariable('x',0));`, "KRG2704");
  fails(`ScriptedEffect('bad',c=>c.setVariable('x = injected',1));`, "KRG2702");
  fails(`ScriptedEffect('bad',c=>c.forRange({start:0,end:3,step:0},()=>{}));`, "KRG2706");
  fails(`ScriptedTrigger('bad',c=>{c.clearArray('x');return true;});`, "KRG2037");
  fails(`countryTarget('var:unsafe}');`, "KRG2701");
});
test("AudioBank builds each audio triple and rejects traversal with a useful diagnostic", () => {
  const native = compile(
    `export const bank=AudioBank('Keys',{path:'sound/keys.asset',volume:0.8,clips:{C:'piano/C.wav',Db:'piano/Db.wav'},compressor:{enabled:true,threshold:-10}});`,
  );
  assert.equal((native.match(/^sound =/gm) || []).length, 2);
  assert.equal((native.match(/^soundeffect =/gm) || []).length, 2);
  assert.match(native, /soundeffects = \{\s*C\s*Db/);
  assert.match(native, /volume = 0.8/);
  assert.match(native, /threshold = -10/);
  fails(`AudioBank('Keys',{path:'sound/keys.asset',clips:{C:'../escape.wav'}});`, "KRG2705");
});
test("real consumer language service completes scope operations and audio keys", () => {
  const dir = mkdtempSync(join(tmpdir(), "krieg-state-editor-"));
  try {
    mkdirSync(join(dir, "src"));
    writeFileSync(
      join(dir, "krgconfig.json"),
      JSON.stringify({ name: "state-editor", sourceDir: "src", outDir: "build/mod" }),
    );
    const source =
      imports +
      `\nconst bank=AudioBank('Keys',{path:'sound/keys.asset',clips:{C:'C.wav',Db:'Db.wav'}});\nScriptedEffect('edit',country=>{country.setVariable('x',country.variable('num_owned_states'));country.state(stateTarget('FROM.FROM'),state=>state.effects.setStateFlag('selected'));});\nconst sound=bank.sounds.C;`;
    const file = join(dir, "src/main.krg.ts");
    writeFileSync(file, source);
    writeEditorProject(dir);
    writeFileSync(
      join(dir, "tsconfig.json"),
      JSON.stringify({
        extends: "./.krieg/tsconfig.json",
        include: ["src/**/*.krg.ts", ".krieg/types/**/*.d.ts"],
      }),
    );
    const service = editorService(join(dir, "tsconfig.json"));
    const errors = ts
      .getPreEmitDiagnostics(service.getProgram())
      .filter((d) => d.category === ts.DiagnosticCategory.Error);
    assert.deepEqual(
      errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")),
      [],
    );
    const scopeItems =
      service
        .getCompletionsAtPosition(
          file,
          source.indexOf("country.setVariable") + "country.".length,
          {},
        )
        ?.entries.map((x) => x.name) || [];
    assert.ok(scopeItems.includes("variable"));
    assert.ok(scopeItems.includes("forRange"));
    assert.ok(scopeItems.includes("everyGlobalState"));
    const audioItems =
      service
        .getCompletionsAtPosition(file, source.indexOf("bank.sounds.C") + "bank.sounds.".length, {})
        ?.entries.map((x) => x.name) || [];
    assert.ok(audioItems.includes("C"));
    assert.ok(audioItems.includes("Db"));
    service.dispose();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("array indexing and mutation APIs preserve native indexed semantics and same-scope loops", () => {
  const native = compile(
    `ScriptedEffect('queue',c=>{c.arrayInsert('queue',2,c.variable('next'));c.arrayRemoveAt('queue',1);c.arrayRemoveValue('queue',5);c.arraySet('queue',c.variable('index'),3);c.setVariable('count',c.arrayLength('queue'));c.setVariable('head',c.arrayAt('queue',0));c.forEachValue('queue',{value:'item',index:'index',break:'stop'},same=>{same.addVariable('sum',same.variable('item'));c.addVariable('count',1);});});`,
  );
  assert.match(native, /add_to_array = \{\s*array = queue\s*index = 2\s*value = next/);
  assert.match(native, /remove_from_array = \{\s*array = queue\s*index = 1/);
  assert.match(native, /var = queue\^index/);
  assert.match(native, /value = queue\^num/);
  assert.match(native, /value = queue\^0/);
  assert.match(
    native,
    /for_each_loop = \{\s*array = queue\s*value = item\s*index = index\s*break = stop/,
  );
  assert.doesNotMatch(native, /PREV =/);
  fails(`ScriptedEffect('bad',c=>c.arrayAt('queue',-1));`, "KRG2708");
});

test("country heatmaps share a single schema wrapper and validate authored palettes", () => {
  const source = `import {CountryHeatmap} from 'krieg-lang/hoi4';const palette={bands:[{fraction:0.5,color:[0,1,0]}],maximumColor:[0,0.5,0],fallbackColor:[1,0,0]} as const;CountryHeatmap({...palette,id:'gdp',metric:'gdp'});CountryHeatmap({...palette,id:'income',metric:'income'});`;
  const native = compile(source);
  assert.equal((native.match(/scripted_map_modes =/g) || []).length, 1);
  assert.match(native, /gdp =/);
  assert.match(native, /income =/);
  const invalid = compileSource(
    `import {CountryHeatmap} from 'krieg-lang/hoi4';CountryHeatmap({id:'bad',metric:'gdp',bands:[{fraction:0.5,color:[0,1,0]},{fraction:0.8,color:[1,0,0]}],maximumColor:[0,0,0],fallbackColor:[1,1,1]});`,
  );
  assert.equal(invalid.success, false);
  assert.ok(invalid.diagnostics.some((d) => d.code === "KRG2707"));
});
