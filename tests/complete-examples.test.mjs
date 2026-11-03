import test from "node:test";
import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { unzipSync } from "fflate";
import {
  buildProject,
  loadConfig,
  packProject,
  writeEditorProject,
} from "../dist/project/index.js";
import { parsePdx } from "../dist/pdx/index.js";

function copyExample(t, name) {
  const root = mkdtempSync(join(tmpdir(), "krieg-complete-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  cpSync(resolve("examples", name), root, {
    recursive: true,
    filter: (path) => !/(?:^|\/)(?:build|\.krieg|node_modules)(?:\/|$)/.test(path),
  });
  return root;
}
function success(result) {
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
}
function native(result, predicate) {
  const files = result.files.filter((file) =>
    typeof predicate === "string" ? file.path === predicate : predicate(file.path),
  );
  assert.ok(files.length, `Expected native output matching ${predicate}`);
  return files.map((file) => readFileSync(join(result.outDir, file.path), "utf8")).join("\n");
}
const scenarios = [
  {
    name: "vanilla-complete",
    p: "civ",
    tag: "KRG",
    state: 1,
    province: 3838,
    partner: "FRA",
    party: "democratic",
    stateFile: "1-France.txt",
    region: "169-Tyrrhenian Sea.txt",
    category: "town",
    variants: 4,
  },
  {
    name: "kaiserreich-complete",
    p: "srd",
    tag: "KRL",
    state: 114,
    province: 11773,
    partner: "NFA",
    party: "social_democrat",
    stateFile: "114 - Sardinia.txt",
    region: "169 - Tyrrhenian Sea.txt",
    category: "three",
    variants: 10,
  },
];

for (const scenario of scenarios)
  test(`${scenario.name}: country, map, research, politics, intelligence, industry and UI form connected native outputs`, (t) => {
    const root = copyExample(t, scenario.name),
      { p, tag, state, province, partner, party } = scenario;
    const world = writeEditorProject(root);
    assert.ok(world.countries.includes(tag));
    assert.ok(world.states.includes(state));
    assert.ok(
      !loadConfig(root).world.countries.includes(tag),
      "country is discovered from authored CountryDefinition",
    );
    const result = buildProject(root);
    success(result);
    for (const file of result.files.filter(
      (f) => f.kind === "script" && !f.path.endsWith(".lua"),
    )) {
      const parsed = parsePdx(readFileSync(join(result.outDir, file.path), "utf8"));
      assert.equal(parsed.diagnostics.length, 0, file.path);
    }
    assert.match(
      native(result, `common/country_tags/krieg_${tag}.txt`),
      new RegExp(`${tag} = "countries/`),
    );
    assert.match(
      native(result, (path) => path.startsWith("common/countries/")),
      /color = rgb/,
    );
    assert.match(
      native(result, "common/defines/krieg_island_congress_timing.lua"),
      /^NDefines\.NGame\.EVENT_TIMEOUT_DEFAULT = 14$/m,
    );
    const history = native(result, (path) => path.startsWith("history/countries/"));
    assert.match(history, new RegExp(`capital = ${state}`));
    assert.match(history, new RegExp(`ruling_party = ${party}`));
    assert.match(history, new RegExp(`oob = ${p}_1936`));
    assert.match(history, /recruit_character/);
    assert.match(history, /set_power_balance/);
    const island = native(result, `history/states/${scenario.stateFile}`);
    assert.match(island, new RegExp(`owner = ${tag}`));
    assert.match(island, new RegExp(`state_category = ${scenario.category}`));
    assert.match(island, new RegExp(`${province} = \\{`));
    assert.match(island, /supply_node = 1/);
    const region = native(result, `map/strategicregions/${scenario.region}`);
    assert.match(region, /id = 169/);
    assert.match(region, /weather = \{/);
    assert.match(region, new RegExp(String(province)));
    assert.equal(
      (native(result, `history/units/${p}_1936.txt`).match(/infantry = \{/g) ?? []).length,
      4,
      "ordered OOB retains four repeated battalions",
    );
    const focuses = native(result, (path) => path.startsWith("common/national_focus/"));
    assert.equal((focuses.match(/\tfocus = \{/g) ?? []).length, 4);
    assert.match(focuses, new RegExp(`${p}_congress.1`));
    const reward = native(result, (path) =>
      path.includes(`scripted_effects/krieg_${p}_complete_investment`),
    );
    assert.match(reward, /build_railway/);
    assert.match(reward, /add_dynamic_modifier/);
    assert.match(reward, /add_manpower = 1500/);
    const events = native(result, (path) => path.startsWith("events/"));
    assert.match(events, new RegExp(`target = ${partner}`));
    assert.match(events, /set_autonomy/);
    assert.match(events, new RegExp(`${p}_refund = yes`));
    assert.equal(
      result.files.filter((f) => f.path.endsWith(`krieg_${p}_refund.txt`)).length,
      1,
      "source dependency emits shared resources once",
    );
    assert.match(
      native(result, (path) => path.startsWith("common/on_actions/")),
      /on_startup/,
    );
    assert.match(
      native(result, (path) => path.startsWith("common/technologies/")),
      /enable_equipments/,
    );
    assert.match(
      native(result, (path) => path.startsWith("common/technologies/")),
      new RegExp(`${p}_island_engineers`),
    );
    assert.match(
      native(result, (path) => path.startsWith("common/units/equipment/")),
      /archetype = infantry_equipment/,
    );
    assert.match(
      native(result, `history/units/${p}_engineers.txt`),
      new RegExp(`${p}_island_engineers = \\{`),
    );
    assert.match(
      native(result, (path) => path.startsWith("common/bop/")),
      /side = \{/,
    );
    assert.match(
      native(result, (path) => path.startsWith("common/ideologies/")),
      new RegExp(`${p}_cooperativism`),
    );
    assert.match(
      native(result, (path) => path.startsWith("common/autonomous_states/")),
      /autonomy_state = \{/,
    );
    const agency = native(result, (path) => path.startsWith("common/intelligence_agencies/"));
    assert.match(agency, /^intelligence_agency = \{/m);
    assert.match(agency, /La Resistance/);
    assert.match(
      native(result, (path) => path.startsWith("common/operations/")),
      new RegExp(`${p}_survey_phase`),
    );
    assert.match(
      native(result, (path) => path.startsWith("common/military_industrial_organization/")),
      /generic_infantry_equipment_organization/,
    );
    assert.match(
      native(result, (path) => path.startsWith("common/special_projects/projects/")),
      /country_effects/,
    );
    assert.match(
      native(result, (path) => path.startsWith("common/raids/")),
      /naval_base/,
    );
    assert.match(
      native(result, (path) => path.startsWith("common/ai_strategy_plans/")),
      new RegExp(`${p}_harbour`),
    );
    assert.match(
      native(result, (path) => path.startsWith("common/bookmarks/")),
      new RegExp(`default_country = ${tag}`),
    );
    const gui = native(result, `interface/${p}_assembly.gui`);
    assert.match(gui, /containerWindowType/);
    assert.match(gui, /buttonText/);
    assert.doesNotMatch(gui, /StatusLine|<Container/);
    assert.match(
      native(result, (path) => path.startsWith("common/scripted_guis/")),
      /redeem_click_enabled/,
    );
    const decisions = native(result, `common/decisions/krieg_${p}_assembly.txt`);
    assert.match(decisions, new RegExp(`${p}_invest = \\{\\s+cost = 25`));
    assert.match(decisions, new RegExp(`${p}_request_investment_eligible = yes`));
    assert.match(decisions, new RegExp(`${p}_request_investment_perform = yes`));
    assert.match(decisions, new RegExp(`${p}_delegation = \\{\\s+cost = 15`));
    assert.doesNotMatch(decisions, /add_political_power|_execute = yes/);
    const investment = native(
      result,
      `common/scripted_effects/krieg_${p}_request_investment_action.txt`,
    );
    assert.match(
      investment,
      new RegExp(
        `${p}_request_investment_perform = \\{\\s+country_event = \\{\\s+id = ${p}_congress.1\\s+days = 1`,
      ),
    );
    assert.equal((investment.match(/add_political_power = -25/g) ?? []).length, 1);
    const scriptedGui = native(result, (path) => path.startsWith("common/scripted_guis/"));
    assert.match(scriptedGui, new RegExp(`redeem_click = \\{\\s+${p}_redeem_execute = yes`));
    assert.match(
      scriptedGui,
      new RegExp(`redeem_click_enabled = \\{\\s+${p}_redeem_available = yes`),
    );
    const redeem = native(result, `common/scripted_effects/krieg_${p}_redeem_action.txt`);
    assert.match(
      redeem,
      new RegExp(
        `${p}_redeem_perform = \\{\\s+${p}_redeem_bond = yes\\s+clr_country_flag = ${p}_bonds_unlocked`,
      ),
    );
    assert.match(redeem, /if = \{\s+limit = \{/);
    assert.doesNotMatch(redeem, /add_political_power/);
    assert.match(
      native(result, (path) => path.startsWith("common/scripted_localisation/")),
      new RegExp(`${p}_status_complete`),
    );
    assert.match(
      native(result, (path) => path.includes(`scripted_effects/krieg_${p}_redeem_bond`)),
      /meta_effect/,
    );
    assert.match(
      native(result, (path) => path.includes(`scripted_effects/krieg_${p}_redeem_bond`)),
      new RegExp(`\\[\\?${p}_bond_value\\|.0\\]`),
    );
    const localisation = native(result, (path) => path.startsWith("localisation/english/"));
    assert.match(localisation, new RegExp(`${tag}_DEF:0`));
    assert.match(localisation, new RegExp(`${p}_coastal_survey:0`));
    const chinese = result.files.find((f) => f.path.includes("_l_simp_chinese.yml"));
    assert.deepEqual(
      readFileSync(join(result.outDir, chinese.path)),
      readFileSync(join(root, "localisation/chinese.yml")),
    );
    assert.equal(
      result.files.filter((f) => f.path.startsWith("gfx/flags/")).length,
      (scenario.variants + 1) * 3,
    );
    for (const file of result.files.filter((f) => f.kind === "asset"))
      assert.deepEqual(
        readFileSync(join(result.outDir, file.path)),
        readFileSync(join(root, "assets", file.path)),
      );
    if (scenario.name.startsWith("kaiserreich"))
      assert.match(native(result, "descriptor.mod"), /dependencies=\{ "Kaiserreich" \}/);
  });

test("complete project rejects missing typed assets and localisation conflicts without replacing successful output", (t) => {
  const root = copyExample(t, "vanilla-complete");
  const result = buildProject(root);
  success(result);
  const before = readFileSync(join(result.outDir, ".krieg-build.json"));
  rmSync(join(root, "assets/gfx/interface/civ_icon.tga"));
  const badAsset = buildProject(root);
  assert.equal(badAsset.success, false);
  assert.ok(badAsset.diagnostics.some((d) => d.code.startsWith("TS")));
  assert.deepEqual(readFileSync(join(result.outDir, ".krieg-build.json")), before);
  cpSync(
    resolve("examples/vanilla-complete/assets/gfx/interface/civ_icon.tga"),
    join(root, "assets/gfx/interface/civ_icon.tga"),
  );
  writeFileSync(
    join(root, "packages/civic-kit/localisation/english.yaml"),
    'civ_charter: "Conflicting package name"\n',
  );
  const badLoc = buildProject(root);
  assert.equal(badLoc.success, false);
  assert.ok(badLoc.diagnostics.some((d) => d.code === "KRG_LOCALISATION_DUPLICATE"));
  assert.deepEqual(readFileSync(join(result.outDir, ".krieg-build.json")), before);
});

test("complete mod archive is reproducible, carries original flags and relocatable launcher metadata", (t) => {
  const root = copyExample(t, "vanilla-complete");
  const first = packProject(root, join(root, "first.zip"));
  success(first.build);
  const second = packProject(root, join(root, "second.zip"));
  success(second.build);
  assert.deepEqual(readFileSync(first.archive), readFileSync(second.archive));
  const entries = unzipSync(readFileSync(first.archive));
  assert.ok(entries["vanilla-complete/gfx/flags/KRG.tga"]);
  assert.match(
    Buffer.from(entries["vanilla-complete.mod"]).toString(),
    /path="mod\/vanilla-complete"/,
  );
  assert.ok(
    !Object.keys(entries).some((path) => path.includes(".krieg") || path.includes("node_modules")),
  );
});

test("CLI ordered game roots and explicit replacement refresh exact editor types without rewriting configuration", (t) => {
  const root = mkdtempSync(join(tmpdir(), "krieg-cli-bases-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (file, text) => {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), text);
  };
  write("krgconfig.json", JSON.stringify({ name: "base-selection" }));
  const configBefore = readFileSync(join(root, "krgconfig.json"));
  write("vanilla/common/country_tags/old.txt", 'AAA="countries/Old.txt"');
  write("overlay/common/country_tags/new.txt", 'BBB="countries/New.txt"');
  write(
    "src/main.krg.ts",
    'import {ScriptedTrigger,type CountryScope} from "krieg-lang/hoi4"; import {countries} from "@project/countries"; export const allowed=ScriptedTrigger("base_selected",(c:CountryScope)=>c.triggers.tag(countries.BBB));',
  );
  const args = [
    resolve("dist/cli.js"),
    "check",
    root,
    "--game-root",
    join(root, "vanilla"),
    "--game-root",
    join(root, "overlay"),
    "--game-replace-path",
    "common/country_tags",
    "--json",
  ];
  const child = spawnSync(process.execPath, args, { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  assert.equal(child.status, 0, child.error?.message ?? child.stderr);
  success(JSON.parse(child.stdout));
  const types = readFileSync(join(root, ".krieg/types/countries.d.ts"), "utf8");
  assert.match(types, /readonly BBB/);
  assert.doesNotMatch(types, /readonly AAA/);
  assert.deepEqual(readFileSync(join(root, "krgconfig.json")), configBefore);
  assert.equal(existsSync(join(root, "build/mod")), false);
});
