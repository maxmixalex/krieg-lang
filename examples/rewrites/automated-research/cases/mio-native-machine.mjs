import assert from "node:assert/strict";
import { ResearchNativeMachine } from "./native-machine.mjs";
const props = (b) => (b?.items ?? []).filter((p) => p.kind === "property");
const field = (b, k) => props(b).find((p) => p.key.text === k)?.value;
const text = (a) => {
  assert.equal(a?.kind, "atom");
  return a.text;
};
// Organization-aware execution of native PDX. HOI4 temporary variables belong
// to the event/effect invocation, so a MIO callback can return a scalar to its
// owner without storing a permanent variable on either scope.
export class MioNativeMachine extends ResearchNativeMachine {
  constructor(definitions, triggers) {
    super(definitions, triggers);
    this.sharedTemps = {};
    this.sharedArrays = {};
    this.organizations = [];
    this.variants = [];
    this.states = [];
  }
  organization(id, options = {}) {
    const owner = options.owner ?? this.countries[0];
    const o = {
      id,
      owner,
      vars: { research_bonus: 0, number_of_currently_assigned_tasks: 0 },
      arrays: {},
      flags: new Set(),
      categories: new Set(),
      equipment: new Set(),
      available: true,
      funds: 0,
      ...options,
    };
    this.organizations.push(o);
    return o;
  }
  get(name, c, r = c, p = c) {
    const [, key] = this.resolve(name, c, r, p);
    if (Object.hasOwn(this.sharedTemps, key)) return this.sharedTemps[key];
    return super.get(name, c, r, p);
  }
  set(name, value, c, r = c, p = c, temporary = false) {
    if (temporary) {
      const [, key] = this.resolve(name, c, r, p);
      this.sharedTemps[key] = value;
      return;
    }
    super.set(name, value, c, r, p, false);
  }
  array(name, c, r = c, p = c, temporary) {
    const [, key] = this.resolve(name, c, r, p);
    if (temporary === true) return (this.sharedArrays[key] ??= []);
    if (temporary !== false && Object.hasOwn(this.sharedArrays, key)) return this.sharedArrays[key];
    return super.array(name, c, r, p, temporary);
  }
  run(name, c = this.countries[0]) {
    this.sharedTemps = {};
    this.sharedArrays = {};
    super.run(name, c);
  }
  target(v, c, r, p) {
    const t = text(v);
    if (t === "ROOT") return r;
    if (t === "PREV") return p;
    if (t === "THIS") return c;
    return this.countries.find((x) => x.tag === t);
  }
  trigger(x, c, r, p) {
    const key = x.key.text.toLowerCase(),
      v = x.value;
    if (key === "has_variable") {
      const [target, name] = this.resolve(text(v), c, r, p);
      return Object.hasOwn(this.sharedTemps, name) || Object.hasOwn(target.vars, name);
    }
    if (key === "any_military_industrial_organization")
      return this.organizations.some((o) => o.owner === c && this.condition(v, o, r, c));
    if (key === "is_mio_available") return c.available === (text(v) === "yes");
    if (key === "is_mio_assigned_to_task")
      return c.vars.number_of_currently_assigned_tasks > 0 === (text(v) === "yes");
    if (key === "has_mio_research_category") return c.categories.has(text(v));
    if (key === "has_mio_equipment_type") return c.equipment.has(text(v));
    if (key === "is_military_industrial_organization") return c.id === text(v);
    if (key === "has_mio_flag") return c.flags.has(text(v));
    if (key === "has_dynamic_modifier")
      return c.modifiers?.has(text(field(v, "modifier"))) ?? false;
    if (key === "original_research_slots")
      return this.compare(
        c.originalResearchSlots ?? 2,
        this.number(v, c, r, p),
        x.operator === "=" ? ">=" : x.operator,
      );
    if (key === "has_intelligence_agency") return (c.agency ?? false) === (text(v) === "yes");
    if (key === "is_special_project_completed") return c.projects?.has(text(v)) ?? false;
    if (key === "has_war_with")
      return c.enemies?.has(this.target(v, c, r, p)?.tag ?? text(v)) ?? false;
    if (key === "has_wargoal_against")
      return c.wargoals?.has(this.target(v, c, r, p)?.tag ?? text(v)) ?? false;
    if (key === "has_guaranteed")
      return c.guarantees?.has(this.target(v, c, r, p)?.tag ?? text(v)) ?? false;
    if (key === "country_exists") return !!this.target(v, c, r, p);
    if (key === "is_in_faction_with") {
      const target = this.target(v, c, r, p);
      return !!c.faction && c.faction === target?.faction;
    }
    if (key === "has_opinion") {
      const target = this.target(field(v, "target"), c, r, p),
        q = props(v).find((y) => y.key.text === "value");
      return this.compare(c.opinion?.[target?.tag] ?? 0, this.number(q.value, c, r, p), q.operator);
    }
    if (key === "any_enemy_country")
      return this.countries.some((o) => c.enemies?.has(o.tag) && this.condition(v, o, r, c));
    if (key === "any_allied_country")
      return this.countries.some(
        (o) => o !== c && !!c.faction && o.faction === c.faction && this.condition(v, o, r, c),
      );
    if (key === "any_other_country")
      return this.countries.some((o) => o !== c && this.condition(v, o, r, c));
    if (key === "is_major") return (c.major ?? false) === (text(v) === "yes");
    if (key === "is_subject") return !!c.subjectOf === (text(v) === "yes");
    if (key === "has_civil_war") return (c.civilWar ?? false) === (text(v) === "yes");
    if (key === "capital_scope")
      return this.condition(v, c.capital ?? { continent: "europe" }, r, c);
    if (key === "is_on_continent") return c.continent === text(v);
    if (/^\d+$/.test(key) && v.kind === "block")
      return this.condition(v, this.states.find((s) => s.id === +key) ?? { id: +key }, r, c);
    if (key === "state_is_fully_controlled_by_root_or_subject")
      return (c.controlledBy === r.tag || r.subjects?.has(c.controlledBy)) === (text(v) === "yes");
    if (key.startsWith("var:")) {
      const target = this.get(x.key.text.slice(4), c, r, p);
      return !!target && this.condition(v, target, r, c);
    }
    return super.trigger(x, c, r, p);
  }
  execute(block, c, r = c, p = c) {
    let taken = false;
    for (const x of props(block)) {
      const key = x.key.text.toLowerCase(),
        v = x.value;
      if (["if", "else_if", "else"].includes(key)) {
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
      if (key === "every_military_industrial_organization") {
        for (const o of this.organizations)
          if (o.owner === c && (!field(v, "limit") || this.condition(field(v, "limit"), o, r, c)))
            this.execute(v, o, r, c);
        continue;
      }
      if (key.startsWith("var:")) {
        const target = this.get(x.key.text.slice(4), c, r, p);
        if (target) this.execute(v, target, r, c);
        continue;
      }
      if (key === "set_mio_flag") {
        c.flags.add(text(v));
        continue;
      }
      if (key === "clr_mio_flag") {
        c.flags.delete(text(v));
        continue;
      }
      if (key === "clear_variable") {
        const [target, name] = this.resolve(text(v), c, r, p);
        delete target.vars[name];
        continue;
      }
      if (key === "add_mio_funds") {
        c.funds += this.number(v, c, r, p);
        continue;
      }
      if (key === "add_dynamic_modifier") {
        (c.modifiers ??= new Set()).add(text(field(v, "modifier")));
        continue;
      }
      if (key === "remove_dynamic_modifier") {
        c.modifiers?.delete(text(field(v, "modifier")));
        continue;
      }
      if (key === "create_equipment_variant") {
        this.variants.push(
          Object.fromEntries(
            props(v).map((y) => [
              y.key.text,
              y.key.text === "design_team"
                ? this.get(text(y.value).slice(4), c, r, p)?.id
                : text(y.value),
            ]),
          ),
        );
        continue;
      }
      if (/^[A-Z0-9]{3}$/.test(x.key.text) && v.kind === "block") {
        const target = this.countries.find((o) => o.tag === x.key.text);
        if (target) this.execute(v, target, r, c);
        continue;
      }
      super.execute({ kind: "block", items: [x] }, c, r, p);
    }
  }
}
