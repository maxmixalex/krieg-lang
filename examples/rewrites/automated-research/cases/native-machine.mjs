import assert from "node:assert/strict";

// An independent evaluator for the native command subset exercised below. It never
// imports Krieg source or a second copy of the queue algorithm. Unsupported native
// commands fail loudly; this is not an HOI4 engine or an in-game validation claim.
const props = (b) => (b?.items ?? []).filter((x) => x.kind === "property");
const field = (b, key) => props(b).find((x) => x.key.text === key)?.value;
const fields = (b) => Object.fromEntries(props(b).map((x) => [x.key.text, x.value]));
const text = (a) => {
  assert.equal(a?.kind, "atom");
  return a.text;
};
export class ResearchNativeMachine {
  constructor(definitions, triggerDefinitions = new Map()) {
    this.definitions = definitions;
    this.triggerDefinitions = triggerDefinitions;
    this.global = { vars: { num_days: 0 }, arrays: {}, flags: new Set() };
    this.countries = [this.country("TST"), this.country("ALLY")];
    this.dlcs = new Set();
    this.rules = {};
    this.date = "1936.1.1";
    this.grants = [];
    this.breakthroughs = {};
    this.sharedTemps = {};
    this.sharedArrays = {};
    this.boundaryCalls = [];
    this.calls = 0;
    this.commands = 0;
    this.steps = 0;
  }
  country(tag) {
    return {
      tag,
      vars: { amount_research_slots: 2 },
      arrays: {},
      flags: new Set(),
      tech: new Set(),
      researching: new Set(),
      ideas: new Set(),
      groups: new Set(),
      cannotResearch: new Set(),
      ai: false,
      xp: 0,
    };
  }
  resolve(name, country, root = country, prev = country) {
    if (name.startsWith("global.")) return [this.global, name.slice(7)];
    if (name.startsWith("ROOT.")) return this.resolve(name.slice(5), root, root, prev);
    if (name.startsWith("PREV.")) return this.resolve(name.slice(5), prev, root, country);
    return [country, name];
  }
  get(name, c, r = c, p = c) {
    const [target, key] = this.resolve(name, c, r, p);
    if (key.includes("^")) {
      const [, index] = key.split("^");
      return index === "num"
        ? this.array(name.split("^")[0], c, r, p).length
        : (this.array(name.split("^")[0], c, r, p)[this.number(index, c, r, p)] ?? 0);
    }
    return this.sharedTemps[key] ?? target.vars[key] ?? 0;
  }
  set(name, value, c, r = c, p = c, temporary = false) {
    const [target, key] = this.resolve(name, c, r, p);
    if (key.includes("^")) {
      const [array, index] = key.split("^");
      (temporary ? (this.sharedArrays[array] ??= []) : (target.arrays[array] ??= []))[
        this.number(index, c, r, p)
      ] = value;
    } else if (temporary) this.sharedTemps[key] = value;
    else target.vars[key] = value;
  }
  array(name, c, r = c, p = c, temporary) {
    const [target, key] = this.resolve(name, c, r, p);
    if (temporary === true) return (this.sharedArrays[key] ??= []);
    if (temporary !== false && Object.hasOwn(this.sharedArrays, key)) return this.sharedArrays[key];
    return (target.arrays[key] ??= []);
  }
  number(value, c, r = c, p = c) {
    const valueText = typeof value === "string" ? value : text(value);
    if (/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(valueText)) return Number(valueText);
    if (valueText === "THIS") return c;
    if (valueText === "ROOT") return r;
    if (valueText === "PREV") return p;
    return this.get(valueText, c, r, p);
  }
  compare(a, b, op) {
    return {
      "=": a === b,
      "<": a < b,
      ">": a > b,
      "<=": a <= b,
      ">=": a >= b,
      "!=": a !== b,
      equals: a === b,
      not_equals: a !== b,
      less_than: a < b,
      greater_than: a > b,
      less_than_or_equals: a <= b,
      greater_than_or_equals: a >= b,
    }[op];
  }
  day(date) {
    const [y, m, d, h = 0] = date.split(".").map(Number);
    return y * 400 + m * 32 + d + h / 24;
  }
  condition(block, c, r = c, p = c) {
    return props(block).every((x) => this.trigger(x, c, r, p));
  }
  trigger(x, c, r, p) {
    const key = x.key.text.toLowerCase(),
      v = x.value;
    if (key === "and") return this.condition(v, c, r, p);
    if (key === "or") return props(v).some((y) => this.trigger(y, c, r, p));
    if (key === "not") return props(v).every((y) => !this.trigger(y, c, r, p));
    if (key === "root") return this.condition(v, r, r, c);
    if (key === "prev") return this.condition(v, p, r, c);
    if (key === "always") return text(v) === "yes";
    if (key === "is_ai") return c.ai === (text(v) === "yes");
    if (key === "check_variable") {
      const f = fields(v);
      if (f.var)
        return this.compare(
          this.number(f.var, c, r, p),
          this.number(f.value, c, r, p),
          f.compare ? text(f.compare) : "equals",
        );
      return props(v).every((y) =>
        this.compare(this.get(y.key.text, c, r, p), this.number(y.value, c, r, p), y.operator),
      );
    }
    if (key === "is_in_array") {
      const f = fields(v);
      return this.array(text(f.array), c, r, p).includes(this.number(f.value, c, r, p));
    }
    if (key === "has_variable") {
      const [target, key] = this.resolve(text(v), c, r, p);
      return Object.hasOwn(this.sharedTemps, key) || Object.hasOwn(target.vars, key);
    }
    if (key === "has_country_flag")
      return c.flags.has(v.kind === "block" ? text(field(v, "flag")) : text(v));
    if (key === "has_global_flag") return this.global.flags.has(text(v));
    if (key === "has_completed_custom_achievement")
      return this.achievements?.has(text(field(v, "achievement"))) ?? false;
    if (key === "has_dlc") return this.dlcs.has(text(v));
    if (key === "has_tech") return c.tech.has(text(v));
    if (key === "can_research") return !c.cannotResearch.has(text(v));
    if (key === "is_researching_technology") return c.researching.has(text(v));
    if (key === "has_idea") return c.ideas.has(text(v));
    if (key === "is_in_tech_sharing_group") return c.groups.has(text(v));
    if (key === "has_game_rule")
      return (this.rules[text(field(v, "rule"))] ?? "OFF") === text(field(v, "option"));
    if (key === "has_navy_experience")
      return this.compare(c.xp, this.number(v, c, r, p), x.operator);
    if (key === "date") return this.compare(this.day(this.date), this.day(text(v)), x.operator);
    if (key === "has_government") return (c.government ?? "neutrality") === text(v);
    if (key === "original_tag") return (c.originalTag ?? c.tag) === text(v);
    if (key === "tag")
      return c.tag === (text(v) === "ROOT" ? r.tag : text(v) === "THIS" ? c.tag : text(v));
    if (key === "has_war") return (c.atWar ?? false) === (text(v) === "yes");
    if (key === "has_war_with") return c.enemies?.has(text(v)) ?? false;
    if (key === "any_enemy_country")
      return this.countries.some((q) => c.enemies?.has(q.tag) && this.condition(v, q, r, c));
    if (key === "any_owned_state" || key === "any_controlled_state")
      return (key === "any_owned_state" ? (c.ownedStates ?? []) : (c.controlledStates ?? [])).some(
        (q) => this.condition(v, q, r, c),
      );
    if (key === "is_coastal") return (c.coastal ?? false) === (text(v) === "yes");
    if (key === "is_major") return (c.major ?? false) === (text(v) === "yes");
    if (key === "is_historical_focus_on") return (this.historical ?? false) === (text(v) === "yes");
    if (key === "has_template_containing_unit") return c.templates?.has(text(v)) ?? false;
    if (key === "has_completed_focus") return c.focuses?.has(text(v)) ?? false;
    if (key === "has_active_mission") return c.missions?.has(text(v)) ?? false;
    if (key === "has_opinion_modifier") return c.opinions?.has(text(v)) ?? false;
    if (key === "has_tech_bonus")
      return c.techBonuses?.has(text(field(v, "category") ?? field(v, "technology"))) ?? false;
    if (key === "has_capitulated") return (c.capitulated ?? false) === (text(v) === "yes");
    if (key === "exists") return (c.exists ?? true) === (text(v) === "yes");
    if (key === "is_subject") return Boolean(c.subjectOf) === (text(v) === "yes");
    if (key === "has_focus_tree") return c.focusTrees?.has(text(v)) ?? false;
    if (key === "is_subject_of") return c.subjectOf === text(v);
    if (
      [
        "num_of_military_factories",
        "num_of_naval_factories",
        "num_of_civilian_factories",
        "num_of_factories",
        "energy_ratio",
        "surrender_progress",
      ].includes(key)
    )
      return this.compare(c.engine?.[key] ?? 0, this.number(v, c, r, p), x.operator);
    if (["oil", "rubber", "aluminium", "tungsten", "steel", "chromium", "coal"].includes(key))
      return this.compare(c.resources?.[key] ?? 0, this.number(v, c, r, p), x.operator);
    if (key === "has_deployed_air_force_size" || key === "has_navy_size") {
      const f = fields(v),
        size = props(v).find((q) => q.key.text === "size"),
        kind = f.type ? text(f.type) : "all";
      return this.compare(
        (key === "has_navy_size" ? c.navy : c.aircraft)?.[kind] ?? 0,
        this.number(size.value, c, r, p),
        size.operator,
      );
    }
    if (key === "estimated_intel_max_armor") {
      const f = fields(v),
        target = text(f.tag) === "PREV" ? p.tag : text(f.tag) === "ROOT" ? r.tag : text(f.tag),
        amount = props(v).find((q) => q.key.text === "value");
      return this.compare(
        c.intelArmor?.[target] ?? 0,
        this.number(amount.value, c, r, p),
        amount.operator,
      );
    }
    if (key === "has_resources_in_country") {
      const f = fields(v),
        amount = props(v).find((q) => q.key.text === "amount");
      assert.equal(text(f.only_imported), "yes");
      return this.compare(
        c.imports?.[text(f.resource)] ?? 0,
        this.number(amount.value, c, r, p),
        amount.operator,
      );
    }
    if (
      [
        "anti_submarine_strategy_required_trigger",
        "phi_sea",
        "is_literally_china",
        "is_chinese_warlord",
      ].includes(key)
    )
      return this.externalTriggers?.has(key) ?? false;
    if (this.triggerDefinitions.has(x.key.text))
      return (
        this.condition(this.triggerDefinitions.get(x.key.text), c, r, p) === (text(v) === "yes")
      );
    if (/^[A-Za-z0-9]{3}$/.test(x.key.text) && v.kind === "block") {
      const target = this.countries.find((q) => q.tag === x.key.text);
      return target ? this.condition(v, target, r, c) : false;
    }
    if (key === "any_country") return this.countries.some((q) => this.condition(v, q, r, c));
    if (key === "has_dynamic_modifier") return false;
    throw new Error("Unsupported native research trigger " + x.key.text);
  }
  run(name, c = this.countries[0]) {
    this.sharedTemps = {};
    this.sharedArrays = {};
    for (const target of [this.global, ...this.countries]) {
      target.tempVars = {};
      target.tempArrays = {};
    }
    const block = this.definitions.get(name);
    assert.ok(block, "Missing native effect " + name);
    this.execute(block, c, c, c);
  }
  execute(block, c, r = c, p = c) {
    if (++this.calls > 2000000) throw Error("Native call guard");
    let taken = false;
    for (const x of props(block)) {
      this.commands++;
      const key = x.key.text.toLowerCase(),
        v = x.value;
      if (key === "if" || key === "else_if" || key === "else") {
        if (key === "if") taken = false;
        if (!taken && (key === "else" || this.condition(field(v, "limit"), c, r, p))) {
          this.execute(v, c, r, p);
          taken = true;
        }
        continue;
      }
      if (
        key === "limit" ||
        ["array", "value", "index", "break", "start", "end", "step"].includes(key)
      )
        continue;
      taken = false;
      if (key === "root" || key === "prev") {
        this.execute(v, key === "root" ? r : p, r, c);
        continue;
      }
      if (key === "every_country" || key === "every_other_country") {
        for (const q of this.countries)
          if (
            (key !== "every_other_country" || q !== c) &&
            (!field(v, "limit") || this.condition(field(v, "limit"), q, r, c))
          )
            this.execute(v, q, r, c);
        continue;
      }
      if (key === "every_military_industrial_organization") continue; // Test worlds contain none.
      if (key === "for_each_loop" || key === "for_each_scope_loop") {
        const a = [...this.array(text(field(v, "array")), c, r, p)],
          valueName = field(v, "value") ? text(field(v, "value")) : "v",
          indexName = field(v, "index") ? text(field(v, "index")) : "i";
        for (let i = 0; i < a.length; i++) {
          if (field(v, "break") && this.get(text(field(v, "break")), c, r, p) !== 0) break;
          if (key === "for_each_scope_loop") this.execute(v, a[i], r, c);
          else {
            this.set(valueName, a[i], c, r, p, true);
            this.set(indexName, i, c, r, p, true);
            this.execute(v, c, r, p);
          }
        }
        continue;
      }
      if (key === "for_loop_effect") {
        const start = this.number(field(v, "start"), c, r, p),
          end = this.number(field(v, "end"), c, r, p),
          step = field(v, "step") ? this.number(field(v, "step"), c, r, p) : 1,
          name = text(field(v, "value"));
        for (let i = start; step > 0 ? i < end : i > end; i += step) {
          if (field(v, "break") && this.get(text(field(v, "break")), c, r, p) !== 0) break;
          this.set(name, i, c, r, p, true);
          this.execute(v, c, r, p);
        }
        continue;
      }
      if (key === "while_loop_effect") {
        let n = 0;
        while (this.condition(field(v, "limit"), c, r, p)) {
          if (++n > 20000) throw Error("Native loop guard");
          this.execute(v, c, r, p);
        }
        continue;
      }
      const operation = key.replace("_temp_variable", "_variable");
      if (
        [
          "set_variable",
          "add_to_variable",
          "subtract_from_variable",
          "multiply_variable",
          "divide_variable",
          "modulo_variable",
        ].includes(operation)
      ) {
        const f = fields(v),
          first = props(v)[0],
          name = f.var ? text(f.var) : first.key.text,
          amount = this.number(f.value ?? first.value, c, r, p),
          old = this.get(name, c, r, p);
        const next = {
          set_variable: amount,
          add_to_variable: old + amount,
          subtract_from_variable: old - amount,
          multiply_variable: old * amount,
          divide_variable: old / amount,
          modulo_variable: old % amount,
        }[operation];
        if (typeof next === "number" && !Number.isFinite(next)) throw Error("Nonfinite " + name);
        this.set(name, next, c, r, p, key.includes("_temp_"));
        continue;
      }
      if (operation === "clamp_variable") {
        const f = fields(v),
          name = text(f.var);
        let n = this.get(name, c, r, p);
        if (f.min) n = Math.max(n, this.number(f.min, c, r, p));
        if (f.max) n = Math.min(n, this.number(f.max, c, r, p));
        this.set(name, n, c, r, p, key.includes("_temp_"));
        continue;
      }
      if (operation === "round_variable") {
        this.set(text(v), Math.round(this.get(text(v), c, r, p)), c, r, p, key.includes("_temp_"));
        continue;
      }
      if (operation === "clear_variable") {
        const [target, name] = this.resolve(text(v), c, r, p);
        delete (key.includes("_temp_") ? this.sharedTemps : target.vars)[name];
        continue;
      }
      if (key === "set_global_flag") {
        this.global.flags.add(text(v));
        continue;
      }
      if (key === "clr_global_flag") {
        this.global.flags.delete(text(v));
        continue;
      }
      if (key === "set_country_flag") {
        c.flags.add(text(v));
        continue;
      }
      if (key === "clr_country_flag") {
        c.flags.delete(text(v));
        continue;
      }
      if (key === "clear_array" || key === "clear_temp_array") {
        this.array(text(v), c, r, p, key === "clear_temp_array").length = 0;
        continue;
      }
      if (
        [
          "add_to_array",
          "add_to_temp_array",
          "remove_from_array",
          "remove_from_temp_array",
          "resize_array",
        ].includes(key)
      ) {
        const f = fields(v),
          first = props(v)[0],
          name = f.array ? text(f.array) : first.key.text,
          a = this.array(name, c, r, p, key.includes("_temp_")),
          amount = f.value ? this.number(f.value, c, r, p) : this.number(first.value, c, r, p);
        if (key === "resize_array") {
          const size = this.number(f.size, c, r, p);
          while (a.length < size) a.push(amount);
          a.length = size;
        } else if (key.startsWith("add")) {
          if (f.index) a.splice(this.number(f.index, c, r, p), 0, amount);
          else a.push(amount);
        } else {
          const index = f.index ? this.number(f.index, c, r, p) : a.indexOf(amount);
          if (index >= 0 && index < a.length) a.splice(index, 1);
        }
        continue;
      }
      if (key === "set_technology") {
        for (const y of props(v).filter((y) => y.key.text !== "popup")) {
          c.tech.add(y.key.text);
          this.grants.push(y.key.text);
        }
        continue;
      }
      if (key === "navy_experience") {
        c.xp += this.number(v, c, r, p);
        continue;
      }
      if (key === "add_breakthrough_progress") {
        const f = fields(v),
          name = text(f.specialization);
        this.breakthroughs[name] = (this.breakthroughs[name] ?? 0) + this.number(f.value, c, r, p);
        continue;
      }
      if (key === "set_temp_variable_to_random") {
        const f = fields(v);
        this.set(text(f.var), this.number(f.min, c, r, p), c, r, p, true);
        continue;
      }
      if (key === "force_update_dynamic_modifier") continue;
      if (key === "log") continue; // Logging is recorded by neither game's state nor this test projection.
      if (this.definitions.has(x.key.text)) {
        if (this.effectBoundaries?.has(x.key.text)) {
          this.boundaryCalls.push(x.key.text);
          continue;
        }
        this.execute(this.definitions.get(x.key.text), c, r, p);
        continue;
      }
      throw new Error("Unsupported native research effect " + x.key.text);
    }
  }
}
