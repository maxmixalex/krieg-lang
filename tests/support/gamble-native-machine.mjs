import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parsePdx } from "../../dist/pdx/index.js";
import { UnoNativeMachine, properties, field, fields, atom } from "./uno-native-machine.mjs";
export { properties, field, fields, atom };
const block = (items) => ({ kind: "block", items });
export function gambleInventory(documents) {
  const data = {
    effects: new Map(),
    ideas: new Map(),
    decisions: new Map(),
    events: new Map(),
    windows: new Map(),
    layouts: new Map(),
    sprites: new Map(),
  };
  for (const [r, document] of documents)
    for (const p of properties(document)) {
      if (r.startsWith("common/ideas/"))
        for (const group of properties(p.value))
          for (const idea of properties(group.value)) data.ideas.set(idea.key.text, idea.value);
      if (r.startsWith("common/scripted_effects/")) data.effects.set(p.key.text, p.value);
      if (r.startsWith("common/decisions/") && !r.includes("/categories/"))
        for (const d of properties(p.value)) data.decisions.set(d.key.text, d.value);
      if (r.startsWith("events/") && p.key.text === "country_event")
        data.events.set(atom(field(p.value, "id")), p.value);
      if (r.startsWith("common/scripted_guis/"))
        for (const w of properties(p.value)) {
          data.windows.set(w.key.text, w.value);
          for (const e of properties(field(w.value, "effects") ?? block([])))
            data.effects.set(w.key.text + "/" + e.key.text, e.value);
        }
      if (r.startsWith("interface/") && p.key.text.toLowerCase() === "guitypes")
        for (const w of properties(p.value))
          data.layouts.set(atom(field(w.value, "name")), w.value);
      if (r.startsWith("interface/") && p.key.text.toLowerCase() === "spritetypes")
        for (const s of properties(p.value)) {
          const props = fields(s.value);
          data.sprites.set(atom(props.name), {
            texture: atom(props.textureFile ?? props.texturefile),
            frames: Number(props.noOfFrames?.text ?? 1),
          });
        }
    }
  return data;
}
export function loadGamble(directory) {
  const documents = [];
  function visit(dir, rel = "") {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith(".")) continue;
      const path = join(dir, e.name),
        r = rel ? rel + "/" + e.name : e.name;
      if (e.isDirectory()) visit(path, r);
      else if (/\.(txt|gui|gfx)$/.test(r)) {
        const parsed = parsePdx(readFileSync(path, "utf8").replace(/^\uFEFF/, ""));
        assert.equal(parsed.diagnostics.length, 0, r);
        documents.push([r, parsed.document]);
      }
    }
  }
  visit(directory);
  return gambleInventory(documents);
}
/** Independent native-code executor. It never imports a rewrite gameplay module.
 * Game-specific behavior lives only in loaded original/emitted PDX. */
export class GambleNativeMachine extends UnoNativeMachine {
  constructor(data, rolls = []) {
    super(data.effects);
    this.data = data;
    this.rolls = [...rolls];
    this.countries = [this.countries[0]];
    const c = this.countries[0];
    c.ideas = new Set();
    c.missions = new Set();
    c.techs = new Set([
      "infantry_weapons",
      "tech_support",
      "gw_artillery",
      "interwar_antiair",
      "interwar_antitank",
      "tech_trucks",
      "basic_train",
    ]);
    c.money = {
      pp: 1000,
      stability: 1,
      ws: 1,
      manpower: 1000000,
      command: 500,
      army: 500,
      air: 500,
      navy: 500,
    };
    c.equipment = {
      infantry_equipment: 100000,
      support_equipment: 100000,
      artillery_equipment: 100000,
      anti_air_equipment: 100000,
      anti_tank_equipment: 100000,
      convoy_1: 100000,
      motorized_equipment: 100000,
      train_equipment: 100000,
    };
    c.states = [
      {
        vars: {},
        flags: new Set(),
        arrays: {},
        buildings: { arms_factory: 20, industrial_complex: 20, dockyard: 20 },
        coastal: true,
        slots: 60,
      },
    ];
  }
  get country() {
    return this.countries[0];
  }
  trigger(item, c, root) {
    const key = item.key.text.toLowerCase(),
      v = item.value;
    if (key === "has_idea") return c.ideas.has(atom(v));
    if (key === "has_active_mission") return c.missions.has(atom(v));
    if (key === "has_tech") return c.techs.has(atom(v));
    const numeric = {
      has_political_power: "pp",
      has_stability: "stability",
      has_war_support: "ws",
      has_manpower: "manpower",
      command_power: "command",
      has_army_experience: "army",
      has_air_experience: "air",
      has_navy_experience: "navy",
    };
    if (numeric[key])
      return this.compare(
        c.money[numeric[key]],
        this.number(v, c),
        item.operator === "=" ? ">=" : item.operator,
      );
    if (key === "has_equipment")
      return properties(v).every((p) =>
        this.compare(
          c.equipment[p.key.text === "convoy" ? "convoy_1" : p.key.text] ?? 0,
          this.number(p.value, c),
          p.operator === "=" ? ">=" : p.operator,
        ),
      );
    const factories = {
      num_of_military_factories: "arms_factory",
      num_of_civilian_factories: "industrial_complex",
      num_of_naval_factories: "dockyard",
    };
    if (factories[key])
      return this.compare(
        c.states.reduce((n, s) => n + (s.buildings[factories[key]] ?? 0), 0),
        this.number(v, c),
        item.operator === "=" ? ">=" : item.operator,
      );
    if (key === "any_core_state") return c.states.some((s) => this.condition(v, s, root));
    if (key === "is_coastal") return c.coastal === (atom(v) === "yes");
    if (["arms_factory", "industrial_complex", "dockyard"].includes(key))
      return this.compare(
        c.buildings[key] ?? 0,
        this.number(v, c),
        item.operator === "=" ? ">=" : item.operator,
      );
    return super.trigger(item, c, root);
  }
  execute(body, c, root = c) {
    let taken = false;
    for (const p of properties(body)) {
      const key = p.key.text.toLowerCase(),
        v = p.value;
      if (["if", "else_if", "else"].includes(key)) {
        if (key === "if") taken = false;
        if (!taken && (key === "else" || this.condition(field(v, "limit"), c, root))) {
          this.execute(v, c, root);
          taken = true;
        }
        continue;
      }
      if (["limit", "trigger", "name", "ai_chance", "modifier"].includes(key)) continue;
      taken = false;
      if (key === "hidden_effect") {
        this.execute(v, c, root);
        continue;
      }
      if (key === "add_ideas") {
        c.ideas.add(atom(v));
        continue;
      }
      if (key === "remove_ideas") {
        c.ideas.delete(atom(v));
        continue;
      }
      if (key === "activate_mission") {
        c.missions.add(atom(v));
        continue;
      }
      const change = {
        add_political_power: "pp",
        add_stability: "stability",
        add_war_support: "ws",
        add_manpower: "manpower",
        add_command_power: "command",
        army_experience: "army",
        air_experience: "air",
        navy_experience: "navy",
      };
      if (change[key]) {
        c.money[change[key]] += this.number(v, c);
        continue;
      }
      if (key === "add_equipment_to_stockpile") {
        const f = fields(v),
          type = atom(f.type);
        c.equipment[type] = (c.equipment[type] ?? 0) + this.number(f.amount, c);
        continue;
      }
      if (key === "add_extra_state_shared_building_slots") {
        c.slots += this.number(v, c);
        continue;
      }
      if (key === "remove_building" || key === "add_building_construction") {
        const f = fields(v),
          type = atom(f.type);
        c.buildings[type] =
          (c.buildings[type] ?? 0) + (key === "remove_building" ? -1 : 1) * this.number(f.level, c);
        continue;
      }
      if (key === "random_core_state" || key === "random_owned_controlled_state") {
        const limit = field(v, "limit"),
          choices = c.states.filter((s) => !limit || this.condition(limit, s, root));
        if (choices.length) this.execute(v, choices[0], root);
        continue;
      }
      if (key === "scoped_sound_effect") {
        this.sounds.push(atom(v));
        continue;
      }
      if (key === "random_list") {
        const choices = properties(v).map((p) => ({ p, weight: Number(p.key.text) }));
        const total = choices.reduce((s, p) => s + p.weight, 0);
        let roll = this.rolls.length ? this.rolls.shift() : 0.5;
        assert.ok(roll >= 0 && roll < 1);
        roll *= total;
        for (const { p, weight } of choices) {
          if (roll < weight) {
            this.execute(p.value, c, root);
            break;
          }
          roll -= weight;
        }
        continue;
      }
      if (key.includes("temp_variable")) {
        const translated = {
          set_temp_variable: "set_variable",
          add_to_temp_variable: "add_to_variable",
          subtract_from_temp_variable: "subtract_from_variable",
          multiply_temp_variable: "multiply_variable",
          divide_temp_variable: "divide_variable",
        }[key];
        assert.ok(translated, key);
        super.execute(block([{ ...p, key: { ...p.key, text: translated } }]), c, root);
        continue;
      }
      super.execute(block([p]), c, root);
    }
  }
  decision(id, force = false) {
    const d = this.data.decisions.get(id);
    assert.ok(d, "missing decision " + id);
    const available = field(d, "available");
    if (!force && available && !this.condition(available, this.country)) return false;
    const effect = field(d, "complete_effect");
    if (effect) this.execute(effect, this.country);
    return true;
  }
  timeout(id) {
    const d = this.data.decisions.get(id);
    assert.ok(d, "missing mission " + id);
    this.country.missions.delete(id);
    const cancel = field(d, "cancel_trigger");
    if (cancel && this.condition(cancel, this.country)) return;
    this.execute(field(d, "timeout_effect"), this.country);
  }
  option(id, name) {
    const event = this.data.events.get(id);
    assert.ok(event, "missing event " + id);
    const option = properties(event)
      .filter((p) => p.key.text === "option")
      .find((p) => atom(field(p.value, "name")) === name);
    assert.ok(option, "missing option " + name);
    this.execute(option.value, this.country);
  }
  options(id) {
    return properties(this.data.events.get(id))
      .filter(
        (p) =>
          p.key.text === "option" &&
          (!field(p.value, "trigger") || this.condition(field(p.value, "trigger"), this.country)),
      )
      .map((p) => atom(field(p.value, "name")));
  }
  visible(gui, name) {
    const w = this.data.windows.get(gui),
      triggers = field(w, "triggers");
    const test = triggers && field(triggers, name + "_visible");
    return !test || this.condition(test, this.country);
  }
  enabled(gui, name) {
    const w = this.data.windows.get(gui),
      triggers = field(w, "triggers");
    const test =
      triggers && (field(triggers, name + "_click_enabled") ?? field(triggers, name + "_enabled"));
    return !test || this.condition(test, this.country);
  }
  click(gui, name) {
    if (!this.enabled(gui, name)) return false;
    this.run(gui + "/" + name + "_click");
    return true;
  }
  projection() {
    const c = this.country;
    return {
      money: c.money,
      equipment: c.equipment,
      states: c.states.map((s) => ({ buildings: s.buildings, slots: s.slots })),
      events: this.events.map((e) => e.id),
      sounds: this.sounds,
      missions: [...c.missions].sort(),
    };
  }
}
