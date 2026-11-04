import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { compileProject, compileSource } from "../dist/compiler/index.js";
import { comparePdxSemantic, emitPdx, parsePdx } from "../dist/pdx/index.js";
import { buildProject, writeEditorProject } from "../dist/project/index.js";
import { editorService } from "./support/editor-service.mjs";

const imports = `import {ScriptedEffectFamily, ScriptedTriggerFamily, ScriptedEffect,
  ScriptedTrigger, CountryEvent, country, state, type CountryScope, type StateScope,
  type ScriptedEffectDefinition} from 'krieg-lang/hoi4';`;

function success(result) {
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  return result;
}

function rejected(source, code) {
  const result = compileSource(`${imports}\n${source}`);
  assert.equal(result.success, false, "Expected compilation to reject invalid scripted content");
  assert.deepEqual(result.outputs, []);
  assert.ok(
    result.diagnostics.some((d) => d.code === code),
    JSON.stringify(result.diagnostics),
  );
}

function native(result, suffix, expected) {
  const output = result.outputs.find((item) => item.path.endsWith(suffix));
  assert.ok(output, suffix);
  const parsed = parsePdx(expected);
  assert.deepEqual(parsed.diagnostics, []);
  assert.ok(comparePdxSemantic(output.document, parsed.document), emitPdx(output.document));
}

test("finite effect families specialize typed scalar data into ordinary native effects", () => {
  const result = success(
    compileSource(`${imports}
    export const rewards=ScriptedEffectFamily('reward',{
      harbour:{cost:25,workers:100,enabled:true,flag:'harbour',target:country('FRA'),place:state(1)},
      depot:{cost:40,workers:200,enabled:false,flag:'depot',target:country('GER'),place:state(2)}
    },(c,p)=>{
      if(p.enabled)c.effects.addPoliticalPower(-p.cost * 2);
      c.state(p.place,s=>s.effects.addManpower(p.workers));
      c.country(p.target,target=>target.effects.setCountryFlag(p.flag));
    });
    export const use=ScriptedEffect('use',c=>{c.run(rewards.harbour);c.run(rewards.harbour);c.run(rewards.depot);});`),
  );
  assert.equal(result.outputs.length, 3);
  native(
    result,
    "krieg_reward_harbour.txt",
    `reward_harbour = {
    add_political_power = -50 1 = { add_manpower = 100 } FRA = { set_country_flag = harbour }
  }`,
  );
  native(
    result,
    "krieg_reward_depot.txt",
    `reward_depot = {
    2 = { add_manpower = 200 } GER = { set_country_flag = depot }
  }`,
  );
  native(
    result,
    "krieg_use.txt",
    "use = { reward_harbour = yes reward_harbour = yes reward_depot = yes }",
  );
});

test("trigger and state families preserve live game conditions and native scope calls", () => {
  const result = success(
    compileSource(`${imports}
    const ready=ScriptedTriggerFamily('ready',{harbour:{cost:25},depot:{cost:40}},
      (c,p)=>c.politicalPower >= p.cost);
    const owned=ScriptedTriggerFamily('owned','state',{france:{owner:country('FRA')}},
      (s,p)=>s.triggers.isOwnedBy(p.owner));
    const gains=ScriptedEffectFamily('gains','state',{small:{amount:100}},
      (s,p)=>s.effects.addManpower(p.amount));
    ScriptedEffect('use',c=>{if(c.test(ready.harbour))c.state(state(1),s=>{
      if(!s.test(owned.france))s.run(gains.small);
    });});`),
  );
  native(
    result,
    "krieg_ready_harbour.txt",
    "ready_harbour = { NOT = { has_political_power < 25 } }",
  );
  native(result, "krieg_ready_depot.txt", "ready_depot = { NOT = { has_political_power < 40 } }");
  native(result, "krieg_owned_france.txt", "owned_france = { is_owned_by = FRA }");
  native(
    result,
    "krieg_use.txt",
    `use = { if = { limit = { ready_harbour = yes }
    1 = { if = { limit = { NOT = { owned_france = yes } } gains_small = yes } }
  } }`,
  );
});

test("cross-module family aliases and repeated imports emit each definition exactly once", () => {
  const result = success(
    compileProject({
      rootDir: "/virtual/families",
      files: ["main.krg.ts"],
      sources: {
        "family.krg.ts": `${imports}export const grants=ScriptedEffectFamily('grant',
        {small:{amount:5},large:{amount:10}},(c,p)=>c.effects.addPoliticalPower(p.amount));`,
        "consumer.krg.ts": `${imports}import {grants} from './family.krg.js';
        export const forwarded=grants.small;export const use=ScriptedEffect('other',c=>c.run(forwarded));`,
        "main.krg.ts": `${imports}import {grants} from './family.krg.js';
        import {forwarded,use} from './consumer.krg.js';
        ScriptedEffect('main',c=>{c.run(grants.small);c.run(forwarded);c.run(grants.large);c.run(use);});`,
      },
    }),
  );
  assert.equal(result.outputs.length, 4);
  for (const name of ["grant_small", "grant_large"])
    assert.equal(
      result.outputs.flatMap((o) => o.document.items).filter((p) => p.key?.text === name).length,
      1,
    );
  native(
    result,
    "krieg_main.txt",
    "main = { grant_small = yes grant_small = yes grant_large = yes other = yes }",
  );
});

test("family data rejects wrong payload types, unknown keys and unsupported native parameters", () => {
  rejected(
    `ScriptedEffectFamily('bad',{one:{amount:'$AMOUNT$'}},(c,p)=>c.effects.addPoliticalPower(p.amount));`,
    "TS2345",
  );
  rejected(
    `ScriptedEffectFamily('bad',{one:{amount:1},two:{amount:'wrong'}},
    (c,p:{amount:number})=>c.effects.addPoliticalPower(p.amount));`,
    "TS2345",
  );
  rejected(`ScriptedEffectFamily('bad',{one:{amount:[1,2]}},(c,p)=>{});`, "TS2322");
  rejected(
    `const f=ScriptedEffectFamily('ok',{one:{amount:1}},(c,p)=>{});
    ScriptedEffect('bad',c=>c.run(f.missing));`,
    "TS2339",
  );
  rejected(
    `const f=ScriptedEffectFamily('ok',{one:{amount:1}},(c,p)=>{});
    ScriptedEffect('bad',c=>c.run(f.one,{amount:2}));`,
    "TS2345",
  );
});

test("family handles enforce effect/trigger distinction and country/state scope", () => {
  rejected(
    `const f=ScriptedEffectFamily('gain','state',{one:{amount:1}},(s,p)=>s.effects.addManpower(p.amount));
    ScriptedEffect('bad',c=>c.run(f.one));`,
    "TS2345",
  );
  rejected(
    `const f=ScriptedTriggerFamily('check','state',{one:{flag:'ready'}},(s,p)=>s.triggers.hasStateFlag(p.flag));
    ScriptedTrigger('bad',c=>c.test(f.one));`,
    "TS2345",
  );
  rejected(
    `const f=ScriptedTriggerFamily('check',{one:{flag:'ready'}},(c,p)=>c.triggers.hasCountryFlag(p.flag));
    ScriptedEffect('bad',c=>c.run(f.one));`,
    "TS2345",
  );
  rejected(
    `ScriptedEffectFamily('bad','state',{one:{amount:1}},(c:CountryScope,p)=>{});`,
    "TS2345",
  );
  rejected(
    `const f=ScriptedEffectFamily('gain','state',{one:{amount:1}},(s,p)=>s.effects.addManpower(p.amount));
    ScriptedEffect('bad',c=>c.run(f.one as unknown as ScriptedEffectDefinition<'country'>));`,
    "KRG1003",
  );
});

test("family normalization rejects unsafe names, non-finite values and forged references", () => {
  for (const input of [
    "'bad } injected = yes',{one:{amount:1}}",
    "'safe',{'bad-key':{amount:1}}",
    "'safe',{}",
    "'safe',{one:{amount:1e999}}",
    "'safe',{one:{target:{kind:'country',tag:'INVALID'}}}",
    "'safe',{one:{target:{kind:'state',id:-1}}}",
  ])
    rejected(`ScriptedEffectFamily(${input},(c,p)=>{});`, "KRG2610");
});

test("native name collisions fail for families, regular definitions and cross-module declarations", () => {
  rejected(
    `ScriptedEffectFamily('reward',{one:{amount:1}},(c,p)=>{});
    ScriptedEffect('reward_one',c=>{});`,
    "KRG2611",
  );
  rejected(
    `ScriptedEffect('reward_one',c=>{});
    ScriptedEffectFamily('reward',{one:{amount:1}},(c,p)=>{});`,
    "KRG2611",
  );
  rejected(
    `ScriptedTriggerFamily('ready',{one:{amount:1}},(c,p)=>true);
    ScriptedTriggerFamily('ready',{one:{amount:2}},(c,p)=>false);`,
    "KRG2611",
  );
  // Effects and triggers are separate native namespaces.
  success(
    compileSource(`${imports}ScriptedEffectFamily('same',{one:{}},c=>{});
    ScriptedTriggerFamily('same',{one:{}},c=>true);`),
  );
});

function write(root, file, content) {
  mkdirSync(dirname(join(root, file)), { recursive: true });
  writeFileSync(join(root, file), content);
}

function project(t, source) {
  const root = mkdtempSync(join(tmpdir(), "krieg-scripted-families-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "krgconfig.json", JSON.stringify({ name: "families" }));
  write(
    root,
    "package.json",
    JSON.stringify({ name: "families", version: "1.0.0", type: "module" }),
  );
  write(root, "src/main.krg.ts", source);
  write(
    root,
    "tsconfig.json",
    JSON.stringify({ extends: "./.krieg/tsconfig.json", include: ["src/**/*.krg.ts"] }),
  );
  return root;
}

test("published types and editor completion retain exact family keys, payload fields and scope", (t) => {
  const source = `${imports}
    export const rewards=ScriptedEffectFamily('reward',{
      harbour:{cost:25,reward:1},depot:{cost:40,reward:2}
    },(c,p)=>c.effects.addPoliticalPower(p.reward));
    const name:'reward_harbour'=rewards.harbour.name;
    const scope:'country'=rewards.harbour.scope;
    const states=ScriptedEffectFamily('state_gain','state',{small:{amount:1}},(s,p)=>s.effects.addManpower(p.amount));
    const ready=ScriptedTriggerFamily('ready',{small:{cost:1}},(c,p)=>c.politicalPower>=p.cost);
    ScriptedEffect('use',c=>{c.run(rewards.harbour);if(c.test(ready.small))c.state(state(1),s=>s.run(states.small));});`;
  const root = project(t, source);
  writeEditorProject(root);
  const tsc = () =>
    spawnSync(
      process.execPath,
      [
        resolve("node_modules/typescript/bin/tsc"),
        "--noEmit",
        "--pretty",
        "false",
        "-p",
        join(root, "tsconfig.json"),
      ],
      { encoding: "utf8" },
    );
  const valid = tsc();
  assert.equal(valid.status, 0, valid.stdout + valid.stderr);
  const editor =
    source
      .replace("p.reward", "p.__PAYLOAD__")
      .replace("c.run(rewards.harbour)", "c.run(rewards.__KEY__)") +
    "\nScriptedEffect('bad',c=>c.run(states.small));";
  write(root, "src/main.krg.ts", editor);
  const invalid = tsc();
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stdout, /__PAYLOAD__/);
  assert.match(invalid.stdout, /__KEY__/);
  assert.match(invalid.stdout, /ScriptedEffectDefinition<"state">/);
  const service = editorService(join(root, "tsconfig.json"));
  t.after(() => service.dispose());
  const complete = (marker) =>
    service
      .getCompletionsAtPosition(join(root, "src/main.krg.ts"), editor.indexOf(marker), {})
      ?.entries.map((entry) => entry.name)
      .sort();
  assert.deepEqual(complete("__PAYLOAD__"), ["cost", "reward"]);
  assert.deepEqual(complete("__KEY__"), ["depot", "harbour"]);
});

test("source packages and project batches emit each family variant once across many consumers", (t) => {
  const root = project(t, "export const empty=0;");
  const dependency = join(root, "node_modules/@fixtures/families");
  write(
    root,
    "package.json",
    JSON.stringify({
      name: "family-consumer",
      version: "1.0.0",
      type: "module",
      dependencies: { "@fixtures/families": "1.0.0" },
    }),
  );
  write(
    dependency,
    "package.json",
    JSON.stringify({
      name: "@fixtures/families",
      version: "1.0.0",
      type: "module",
      krieg: { config: "krgconfig.json", exports: { ".": "src/index.krg.ts" } },
    }),
  );
  write(dependency, "krgconfig.json", JSON.stringify({ name: "family-library" }));
  write(
    dependency,
    "src/families.krg.ts",
    `${imports}
    export const gains=ScriptedEffectFamily('gain',{small:{amount:5},large:{amount:10}},(c,p)=>c.effects.addPoliticalPower(p.amount));
    export const ready=ScriptedTriggerFamily('ready',{small:{amount:5},large:{amount:10}},(c,p)=>c.politicalPower>=p.amount);`,
  );
  write(dependency, "src/index.krg.ts", "export {gains,ready} from './families.krg.js';");
  for (let i = 0; i < 51; i++)
    write(
      root,
      `src/use_${i}.krg.ts`,
      `${imports}
    import {gains,ready} from '@fixtures/families';
    ScriptedEffect('use_${i}',c=>{if(c.test(ready.small)){c.run(gains.small);c.run(gains.small);}c.run(gains.large);});`,
    );
  const built = success(buildProject(root));
  const definitions = built.files.filter((file) =>
    /common\/scripted_(?:effects|triggers)\//.test(file.path),
  );
  assert.equal(definitions.length, 55);
  for (const name of ["gain_small", "gain_large", "ready_small", "ready_large"]) {
    const files = definitions.filter((file) => file.path.endsWith(`krieg_${name}.txt`));
    assert.equal(files.length, 1);
    const text = readFileSync(join(built.outDir, files[0].path), "utf8");
    assert.equal(parsePdx(text).document.items.length, 1);
  }
  const call = readFileSync(join(built.outDir, "common/scripted_effects/krieg_use_50.txt"), "utf8");
  assert.match(call, /ready_small = yes/);
  assert.equal((call.match(/gain_small = yes/g) ?? []).length, 2);
  assert.doesNotMatch(call, /add_political_power|\$AMOUNT\$|meta_effect|set_temp_variable/);
});

test("project output validation rejects a family name collision across separate compiler batches", (t) => {
  const root = project(t, "export const empty=0;");
  write(
    root,
    "src/00_family.krg.ts",
    `${imports}
    ScriptedEffectFamily('reward',{a:{amount:5}},(c,p)=>c.effects.addPoliticalPower(p.amount));`,
  );
  for (let i = 0; i < 50; i++) write(root, `src/middle_${i}.krg.ts`, `export const value=${i};`);
  write(
    root,
    "src/zz_collision.krg.ts",
    `${imports}
    ScriptedEffect('reward_a',c=>c.effects.addPoliticalPower(10));`,
  );
  const result = buildProject(root);
  assert.equal(result.success, false);
  assert.ok(
    result.diagnostics.some(
      (d) => d.code === "KRG_OUTPUT_CONFLICT" && d.message.includes("krieg_reward_a.txt"),
    ),
    JSON.stringify(result.diagnostics),
  );
});
