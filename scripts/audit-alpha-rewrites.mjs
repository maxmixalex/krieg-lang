#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  RewriteModel,
  properties,
  field,
  atom,
  filesBelow,
  readDocument,
  readDefinitions,
  readScriptedGui,
  readLocalisationDefinitions,
} from "./lib/rewrite-model.mjs";

const operations = new Set([
  "set_variable",
  "set_temp_variable",
  "add_to_variable",
  "add_to_temp_variable",
  "subtract_from_variable",
  "subtract_from_temp_variable",
  "multiply_variable",
  "multiply_temp_variable",
  "divide_variable",
  "divide_temp_variable",
  "modulo_variable",
]);
const compare = {
  equals: "=",
  not_equals: "!=",
  greater_than: ">",
  less_than: "<",
  greater_than_or_equals: ">=",
  less_than_or_equals: "<=",
};
function scalar(node) {
  if (!node) return null;
  const s = node.text;
  return /^-?\d+(\.\d+)?$/.test(s)
    ? Number(s)
    : s.replace(/\b(this|prev|root|from)(?=\.|$)/gi, (m) => m.toUpperCase());
}
function normalizedEntry(p) {
  if (p.kind !== "property") return scalar(p);
  let k = p.key.text;
  const v = p.value;
  if (/^(owner|controller|this|prev|root|from)(\.(prev|root|from))*$/i.test(k)) k = k.toUpperCase();
  if (operations.has(k)) {
    const name = field(v, "var");
    return name
      ? [k, scalar(name), scalar(field(v, "value"))]
      : [k, scalar(properties(v)[0].key), scalar(properties(v)[0].value)];
  }
  if (k === "check_variable") {
    const name = field(v, "var");
    if (name)
      return [k, scalar(name), compare[atom(v, "compare")] ?? "=", scalar(field(v, "value"))];
    const checks = properties(v).map((x) => [k, scalar(x.key), x.operator, scalar(x.value)]);
    return checks.length === 1 ? checks[0] : ["AND", checks];
  }
  if (["add_to_array", "add_to_temp_array", "is_in_array"].includes(k)) {
    const name = field(v, "array");
    return name
      ? [k, scalar(name), scalar(field(v, "value"))]
      : [k, scalar(properties(v)[0].key), scalar(properties(v)[0].value)];
  }
  if (k === "OR") return [k, "=", normalize(v).flatMap((x) => (x[0] === "OR" ? x[2] : [x]))];
  if (k === "for_loop_effect")
    return [
      k,
      "=",
      normalize({
        items: properties(v).filter((x) => !(x.key.text === "value" && x.value.text === "v")),
      }),
    ];
  return [k, p.operator, v.kind === "block" ? normalize(v) : scalar(v)];
}
export function normalize(block) {
  return (block.items ?? []).map(normalizedEntry).flatMap((x) => {
    if (Array.isArray(x) && x[0] === "AND") return x[2] ?? x[1];
    if (Array.isArray(x) && x[0] === "else" && x[2]?.[0]?.[0] === "if")
      return [["else_if", x[2][0][1], x[2][0][2]], ...x[2].slice(1)];
    return [x];
  });
}
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const blockHash = (block) => hash(JSON.stringify(normalize(block)));
function equal(label, a, b) {
  assert.deepEqual(a, b, label);
  return { check: label, passed: true };
}
function fixture() {
  const world = { global: { GDP_total: 100 }, flags: [], countries: [], states: [] };
  for (const [index, tag] of ["AAA", "BBB", "CCC"].entries())
    world.countries.push({
      kind: "country",
      tag,
      ai: index > 0,
      ideas: [
        ["free_trade", "civilian_economy"],
        ["export_focus", "war_economy", "service_by_requirement"],
        ["limited_exports", "partial_economic_mobilisation", "all_adults_serve"],
      ][index],
      flags: [],
      variables: { country_GDP: 0, country_GDP_per_capita: 0, marked_states: 0 },
      builtins: {
        num_of_civilian_factories: 10 + index * 6,
        num_of_naval_factories: 2 + index,
        max_manpower_k: 5000 + index * 4000,
        "modifier@cic_to_overlord_factor": index * 0.1,
        "modifier@mic_to_overlord_factor": index * 0.05,
        "modifier@industrial_capacity_factory": index * 0.15,
        "resource_produced@oil": 300 + index * 100,
        "resource_produced@aluminium": 100 + index * 90,
        "resource_produced@rubber": 50 + index * 20,
        "resource_produced@tungsten": 45 + index * 30,
        "resource_produced@steel": 250 + index * 100,
        "resource_produced@chromium": 60 + index * 50,
        "resource_exported@oil": 50 + index * 10,
        "resource_exported@aluminium": 40 + index * 10,
        "resource_exported@rubber": 20 + index * 5,
        "resource_exported@tungsten": 20 + index * 5,
        "resource_exported@steel": 70 + index * 15,
        "resource_exported@chromium": 15 + index * 7,
      },
    });
  const specs = [
    ["AAA", "AAA", ["AAA"], true, "metropolis"],
    ["AAA", "BBB", [], false, "rural"],
    ["BBB", "BBB", ["BBB"], true, "large_city"],
    ["BBB", "CCC", [], false, "pastoral"],
    ["CCC", "CCC", ["CCC"], true, "city"],
    ["CCC", "AAA", ["AAA"], false, "town"],
  ];
  specs.forEach(([owner, controller, cores, home, category], i) =>
    world.states.push({
      kind: "state",
      id: i + 1,
      owner,
      controller,
      cores,
      home,
      category,
      flags: [],
      variables: {},
      builtins: {
        state_population_k: 3000 + i * 900,
        infrastructure_level: 2 + (i % 3),
        industrial_complex_level: 3 + i,
        arms_factory_level: 2 + ((i * 2) % 5),
      },
    }),
  );
  world.global.GDP_list_array = [...world.countries];
  return world;
}
function snapshot(model) {
  return {
    countries: model.world.countries.map((c) => ({
      tag: c.tag,
      flags: [...c.flags].sort(),
      variables: c.variables,
    })),
    states: model.world.states.map((s) => ({
      id: s.id,
      owner: s.owner,
      controller: s.controller,
      cores: [...s.cores].sort(),
      flags: [...s.flags].sort(),
      variables: s.variables,
    })),
    global: Object.fromEntries(
      Object.entries(model.world.global).map(([k, v]) => [
        k,
        Array.isArray(v) ? v.map((x) => x?.tag ?? x) : v,
      ]),
    ),
    flags: [...model.world.flags].sort(),
    randomCalls: model.randomCalls,
  };
}
function controls(file) {
  const found = [];
  function visit(block) {
    for (const p of properties(block)) {
      if (
        [
          "buttonType",
          "iconType",
          "frameAnimatedSpriteType",
          "spriteType",
          "sound",
          "soundeffect",
          "category",
        ].includes(p.key.text)
      )
        found.push({ type: p.key.text, name: atom(p.value, "name"), body: p.value });
      if (p.value.kind === "block") visit(p.value);
    }
  }
  visit(readDocument(file));
  return found;
}
function modelPair(original, built, world = fixture()) {
  const sourceDefs = existsSync(join(original, "common/scripted_effects"))
    ? readDefinitions(original, "common/scripted_effects")
    : {};
  const outputDefs = existsSync(join(built, "common/scripted_effects"))
    ? readDefinitions(built, "common/scripted_effects")
    : {};
  const sourceLoc = existsSync(join(original, "common/scripted_localisation"))
    ? readLocalisationDefinitions(original)
    : {};
  const outputLoc = existsSync(join(built, "common/scripted_localisation"))
    ? readLocalisationDefinitions(built)
    : {};
  return [
    new RewriteModel(world, sourceDefs, sourceLoc),
    new RewriteModel(world, outputDefs, outputLoc),
  ];
}
function auditPiano(original, built) {
  const oldGui = controls(join(original, "interface/PI_scripted_gui.gui")),
    newGui = controls(join(built, "interface/PI_scripted_gui.gui"));
  const oldAudio = controls(join(original, "sound/piano_sound.asset")),
    newAudio = controls(join(built, "sound/piano_sound.asset"));
  const keys = oldGui.filter((x) => x.type === "buttonType" && x.name.endsWith("_key"));
  const rows = [];
  for (const key of keys) {
    const replacement = newGui.find((x) => x.name === key.name);
    assert.ok(replacement, key.name);
    const sound = atom(key.body, "clicksound");
    for (const prop of ["shortcut", "clicksound", "position"])
      assert.deepEqual(
        normalize({
          items: [
            {
              kind: "property",
              key: { kind: "atom", text: prop },
              operator: "=",
              value: field(key.body, prop),
            },
          ],
        }),
        normalize({
          items: [
            {
              kind: "property",
              key: { kind: "atom", text: prop },
              operator: "=",
              value: field(replacement.body, prop),
            },
          ],
        }),
        `${key.name}.${prop}`,
      );
    assert.equal(
      atom(key.body, "quadTextureSprite") ?? atom(key.body, "spriteType"),
      atom(replacement.body, "quadTextureSprite") ?? atom(replacement.body, "spriteType"),
    );
    const clip = oldAudio.find((x) => x.type === "sound" && x.name === sound),
      newClip = newAudio.find((x) => x.type === "sound" && x.name === sound);
    equal(sound, normalize(clip.body), normalize(newClip.body));
    const asset = atom(clip.body, "file");
    const digest = hash(readFileSync(join(original, "sound", asset)));
    assert.equal(hash(readFileSync(join(built, "sound", asset))), digest);
    rows.push({
      key: key.name,
      shortcut: atom(key.body, "shortcut"),
      sound,
      clip: asset,
      sha256: digest,
    });
  }
  assert.equal(keys.length, 25);
  assert.equal(newGui.filter((x) => x.type === "buttonType" && x.name.endsWith("_key")).length, 25);
  for (const effect of oldAudio.filter((x) => x.type === "soundeffect"))
    equal(
      effect.name,
      normalize(effect.body),
      normalize(newAudio.find((x) => x.type === "soundeffect" && x.name === effect.name).body),
    );
  const category = oldAudio.find((x) => x.type === "category"),
    newCategory = newAudio.find((x) => x.type === "category");
  equal(
    "piano compressor",
    normalize(field(category.body, "compressor")),
    normalize(field(newCategory.body, "compressor")),
  );
  equal(
    "piano category clips",
    field(category.body, "soundeffects")
      .items.map((x) => x.text)
      .sort(),
    field(newCategory.body, "soundeffects")
      .items.map((x) => x.text)
      .sort(),
  );
  const oldSprite = controls(join(original, "interface/PI_scripted_gui.gfx")).find(
    (x) => x.type === "frameAnimatedSpriteType",
  );
  const newSprite = controls(join(built, "interface/PI_scripted_gui.gfx")).find(
    (x) => x.type === "frameAnimatedSpriteType",
  );
  equal("metronome animation", normalize(oldSprite.body), normalize(newSprite.body));
  const oldLogic = readScriptedGui(original),
    newLogic = readScriptedGui(built);
  const models = modelPair(original, built);
  const history = [];
  for (const [window, button] of [
    ["PI_open_button_gui", "button_open_click"],
    ["PI_keyboard_gui", "button_close_click"],
  ]) {
    models.forEach((m, i) =>
      m.effects(field(field((i ? newLogic : oldLogic)[window], "effects"), button), m.context()),
    );
    history.push(equal(button, snapshot(models[0]), snapshot(models[1])));
  }
  return {
    keys: rows,
    checks: [
      { check: "25 key → shortcut → sound → original binary hash mappings", passed: true },
      { check: "25 effect volumes, sound category and compressor", passed: true },
      { check: "four-frame two-FPS metronome playback flags", passed: true },
      ...history,
    ],
  };
}
function auditStateTransfer(original, built) {
  const oldLogic = readScriptedGui(original),
    newLogic = readScriptedGui(built);
  const models = modelPair(original, built);
  const rows = [];
  const actions = [
    ["st_open", "open_ST_click", "AAA"],
    ["st_country_powers", "mark_all_states_click", "BBB"],
    ["st_country_powers", "core_states_click", "BBB"],
    ["st_country_powers", "mark_colonial_states_click", "CCC"],
    ["st_country_powers", "award_states_click", "AAA"],
    ["st_state_manager_powers", "st_state_manager_power_mark_for_transfer_click", "AAA", 2],
    ["st_state_manager_powers", "st_state_manager_power_unmark_for_transfer_click", "AAA", 2],
    ["st_country_powers", "mark_all_states_click", "CCC"],
    ["st_country_powers", "clear_all_markings_click", "AAA"],
    ["st_hide", "hide_ST_click", "AAA"],
  ];
  for (const [window, button, selected, state] of actions) {
    models.forEach((m, i) => {
      const ctx = m.context("AAA", state);
      ctx.current = state ? ctx.selectedState : m.world.countries.find((c) => c.tag === selected);
      m.effects(field(field((i ? newLogic : oldLogic)[window], "effects"), button), ctx);
    });
    rows.push(equal(button, snapshot(models[0]), snapshot(models[1])));
  }
  for (const marked of [false, true])
    for (const hidden of [false, true])
      for (const enabled of [false, true]) {
        models.forEach((m) => {
          m.world.flags = [
            ...(hidden ? ["hidden_switch"] : []),
            ...(enabled ? ["transfer_enabled"] : []),
          ];
          m.world.states[1].flags = marked ? ["marked_for_transfer"] : [];
        });
        for (const name of Object.keys(oldLogic))
          models.forEach((m, i) => {
            const ctx = m.context("AAA", 2);
            if (name === "st_state_manager_powers") ctx.current = ctx.selectedState;
            const visibility = m.test(field((i ? newLogic : oldLogic)[name], "visible"), ctx);
            if (i === 0)
              rows.push({
                check: `${name} visibility marked=${marked} hidden=${hidden} enabled=${enabled}`,
                expected: visibility,
                passed: true,
              });
            else assert.equal(visibility, rows.at(-1).expected);
          });
      }
  assert.equal(models[0].world.states[5].owner, "AAA");
  assert.deepEqual(models[0].world.states[2].cores, []);
  assert.ok(models[0].world.states[3].cores.includes("BBB"));
  assert.equal(models[0].world.countries[0].variables.marked_states, 0);
  return {
    fixture: "Three countries, six states, differing owner/controller/core/home-area",
    checks: rows,
    final: snapshot(models[0]),
  };
}
function auditAllocation(source, output) {
  const cases = [
    { values: [35, 40, 25], selected: 2, change: 10 },
    { values: [10, 95, 30], selected: 2, change: 10 },
    { values: [60, 20, 20], selected: 1, change: -7 },
    { values: [10, 30, 60], selected: 3, change: 0 },
    { values: [0, 3, 97], selected: 2, change: -5 },
    { values: [5, 15, 70, 10], selected: 4, change: 12 },
  ];
  const checks = [];
  for (const { values, selected, change } of cases) {
    const effects = values.length === 3 ? ["sum_cap", "example_sum_cap_usage"] : ["sum_cap"];
    for (const effect of effects) {
      const results = [source, output].map((defs) => {
        const model = new RewriteModel(fixture(), defs);
        const ctx = model.context();
        if (effect === "sum_cap") {
          ctx.current.variables.temp_value_array = [...values];
          Object.assign(model.temp, { max: 100, temp_index: selected, temp_value: change });
          model.run(effect, ctx);
          return {
            values: ctx.current.variables.temp_value_array,
            index: model.temp.temp_index,
            remainder: model.temp.temp_value,
            checked: model.temp.temp,
            peers: model.read("temp_array", ctx),
          };
        }
        values.forEach((amount, i) => model.write(`variable_${i + 1}`, amount, ctx));
        model.run(effect, ctx);
        return values.map((_, i) => model.read(`variable_${i + 1}`, ctx));
      });
      equal(`${effect} [${values}]`, results[0], results[1]);
      checks.push({
        effect,
        values,
        selected: effect === "sum_cap" ? selected : 2,
        change: effect === "sum_cap" ? change : 10,
        result: results[1],
      });
    }
  }
  return checks;
}

function auditGDP(original, built) {
  const models = modelPair(original, built);
  const source = models[0].definitions,
    output = models[1].definitions;
  const allocations = auditAllocation(source, output);
  const structure = [];
  for (const name of Object.keys(source))
    if (name !== "scoped_quicksort" && !allocations.some((entry) => entry.effect === name)) {
      equal(name, normalize(source[name]), normalize(output[name]));
      structure.push({ effect: name, canonicalSha256: blockHash(source[name]), matched: true });
    }
  const macro = field(source.scoped_quicksort, "meta_effect"),
    template = field(macro, "text");
  const selectors = [
      ["RUS_duma_government_array", 1],
      ["RUS_duma_neutral_array", 2],
      ["RUS_duma_opposition_array", 3],
      ["global.GDP_list_array", 4],
    ],
    metrics = [
      ["RUS_duma_seat", 1],
      ["country_GDP", 2],
      ["country_GDP_per_capita", 3],
    ];
  const generated = properties(output.scoped_quicksort);
  const specializations = [];
  for (const [array, ai] of selectors)
    for (const [metric, mi] of metrics) {
      const body = structuredClone(template);
      const replace = (node) => {
        if (node.kind === "atom")
          node.text = node.text.replaceAll("[SORTARRAY]", array).replaceAll("[SORTVALUE]", metric);
        else if (node.kind === "property") {
          replace(node.key);
          replace(node.value);
        } else for (const item of node.items ?? []) replace(item);
      };
      replace(body);
      const outer = generated[ai - 1].value;
      const inner = properties(outer).filter((x) => x.key.text === "if")[mi - 1].value;
      const specialized = { items: properties(inner).filter((x) => x.key.text !== "limit") };
      equal(`${array}/${metric}`, normalize(body), normalize(specialized));
      specializations.push({ array, metric, matched: true });
    }
  const tests = [];
  for (const scenario of ["base", "severe-mobilisation", "zero-resources"]) {
    const world = fixture();
    if (scenario === "severe-mobilisation")
      world.countries.forEach((c) => {
        c.ideas = ["closed_economy", "tot_economic_mobilisation", "scraping_the_barrel"];
        c.builtins["modifier@cic_to_overlord_factor"] = 0.8;
      });
    if (scenario === "zero-resources")
      world.countries.forEach((c) => {
        for (const key of Object.keys(c.builtins))
          if (key.startsWith("resource_")) c.builtins[key] = 0;
      });
    const pair = modelPair(original, built, world);
    for (const tag of ["AAA", "BBB", "CCC"])
      pair.forEach((m) => {
        const ctx = m.context(tag);
        m.run("calculate_GDP", ctx);
        m.run("GDP_growth_calculation", ctx);
      });
    equal(`GDP scenario ${scenario}`, snapshot(pair[0]), snapshot(pair[1]));
    const before = pair[0].world.global.GDP_list_array.map((c) => c.tag);
    const selectorPair = modelPair(original, built, world);
    for (const tag of ["AAA", "BBB", "CCC"])
      selectorPair.forEach((m) => m.run("calculate_GDP", m.context(tag)));
    selectorPair.forEach((m) => m.run("create_GDP_per_capita_sorted_array", m.context()));
    equal(
      `shared-selector reversal ${scenario}`,
      snapshot(selectorPair[0]),
      snapshot(selectorPair[1]),
    );
    assert.deepEqual(
      selectorPair[0].world.global.GDP_list_array.map((c) => c.tag),
      [...before].reverse(),
    );
    pair.forEach((m) => m.run("create_GDP_sorted_array", m.context()));
    equal(`GDP reverse ${scenario}`, snapshot(pair[0]), snapshot(pair[1]));
    const reversed = pair[0].world.global.GDP_list_array.map((c) => c.tag);
    assert.deepEqual(reversed, [...before].reverse());
    pair.forEach((m) => m.run("create_GDP_per_capita_sorted_array", m.context()));
    equal(`Per-capita sort ${scenario}`, snapshot(pair[0]), snapshot(pair[1]));
    tests.push({
      scenario,
      passed: true,
      countries: pair[0].world.countries.map((c) => ({
        tag: c.tag,
        GDP: c.variables.country_GDP,
        perCapita: c.variables.country_GDP_per_capita,
        growth: c.variables.GDP_growth_value,
      })),
      descending: before,
      reversed,
      perCapitaOrder: pair[0].world.global.GDP_list_array.map((c) => c.tag),
      randomCalls: pair[0].randomCalls,
    });
  }
  for (const [value, last, expected] of [
    [105, 100, 105],
    [100, 100, 0],
    [0, 100, -100],
  ]) {
    const pair = modelPair(original, built);
    pair.forEach((m) => {
      m.world.countries[0].variables.country_GDP = value;
      m.world.countries[0].variables.gdp_value_last = last;
      m.run("GDP_growth_calculation", m.context());
    });
    equal("legacy growth equality gate", snapshot(pair[0]), snapshot(pair[1]));
    assert.equal(pair[0].world.countries[0].variables.GDP_growth_value, expected);
  }
  const getMaps = (root) => {
    const defs = {};
    for (const file of filesBelow(join(root, "common/map_modes")).filter((f) => f.endsWith(".txt")))
      for (const wrapper of properties(readDocument(file)))
        for (const map of properties(wrapper.value)) defs[map.key.text] = map.value;
    return defs;
  };
  const oldMaps = getMaps(original),
    newMaps = getMaps(built);
  for (const name of Object.keys(oldMaps))
    equal(name, normalize(oldMaps[name]), normalize(newMaps[name]));
  return {
    effects: structure,
    allocations,
    quicksortSpecializations: specializations,
    scenarios: tests,
    mapModes: Object.keys(oldMaps).map((id) => ({ id, matched: true })),
    preservedQuirks: [
      "civilian occupancy subtraction in the military term",
      "growth subtracts 100 only at exact ratios zero or 100",
      "country_GDP_T accumulates before rescaling",
      "shared sort selector reversal",
      "startup calculate_GDP invocation remains no",
    ],
  };
}
export function auditAlpha(inputs, repo = resolve(".")) {
  const specs = [
    ["playable-piano", "Playable-Piano", auditPiano],
    ["state-transfer-tool", "State-Transfer-Tool", auditStateTransfer],
    ["twr-gdp-screen", "TWR-GDP-Screen", auditGDP],
  ];
  const result = {
    method:
      "Private original files and independently parsed generated PDX execute through the same small deterministic oracle; a separate canonical structural comparison covers all GDP arithmetic and all 12 quicksort specializations.",
    limitations: [
      "No HOI4 executable was launched.",
      "The oracle uses floating-point arithmetic and defines zero division as zero; game fixed-point overflow and exact engine temp-scope rules are not simulated.",
      "GUI layout is compared structurally; actual rendering, input delivery and audio playback require the game.",
    ],
    mods: {},
  };
  for (const [id, folder, audit] of specs)
    result.mods[id] = audit(join(inputs, folder), join(repo, "examples/rewrites", id, "build/mod"));
  return result;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const inputs = resolve(process.argv[2] ?? "../private-mods"),
    output = resolve(process.argv[3] ?? "reports/local/alpha-rewrites.json");
  const report = auditAlpha(inputs);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
  console.log(`Piano, State Transfer and GDP differential checks passed. Report: ${output}`);
}
