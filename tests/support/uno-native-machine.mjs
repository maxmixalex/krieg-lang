import assert from "node:assert/strict";

/** Small independent interpreter for the native commands exercised by UNO tests.
 * It executes emitted PDX, not Krieg source, and rejects unknown commands/triggers.
 * It is a test oracle for the listed rules, not an HOI4 engine replacement.
 */
export function properties(block) {
  return block.items.filter((item) => item.kind === "property");
}
export function field(block, key) {
  return properties(block).find((item) => item.key.text === key)?.value;
}
export function fields(block) {
  return Object.fromEntries(properties(block).map((item) => [item.key.text, item.value]));
}
export function atom(value) {
  assert.equal(value?.kind, "atom");
  return value.text;
}
export class UnoNativeMachine {
  constructor(definitions, seed = 43) {
    this.definitions = definitions;
    this.global = { vars: {}, flags: new Set(), arrays: {} };
    this.countries = Array.from({ length: 6 }, (_, i) => ({
      tag: `C${i + 1}`,
      vars: {},
      flags: new Set(),
      arrays: {},
      ai: i > 0,
    }));
    this.targets = {};
    this.temporary = {};
    this.events = [];
    this.sounds = [];
    this.seed = seed;
  }
  variable(name, country, includeTemporary = true) {
    if (includeTemporary && Object.hasOwn(this.temporary, name)) return this.temporary[name];
    const parts = name.split(".");
    const target = parts[0] === "global" ? this.global : country;
    const key = parts[0] === "global" ? parts.slice(1).join(".") : name;
    if (key.endsWith("^num")) return (target.arrays[key.slice(0, -4)] ?? []).length;
    return target.vars[key] ?? 0;
  }
  set(name, value, country) {
    if (name.startsWith("global.")) this.global.vars[name.slice(7)] = value;
    else country.vars[name] = value;
  }
  number(value, country) {
    const text = typeof value === "string" ? value : atom(value);
    return /^-?\d+(\.\d+)?$/.test(text) ? Number(text) : this.variable(text, country);
  }
  compare(left, right, operator) {
    return {
      equals: left === right,
      not_equals: left !== right,
      greater_than: left > right,
      less_than: left < right,
      greater_than_or_equals: left >= right,
      less_than_or_equals: left <= right,
      "=": left === right,
      ">": left > right,
      "<": left < right,
      ">=": left >= right,
      "<=": left <= right,
    }[operator];
  }
  condition(block, country, root = country) {
    return properties(block).every((item) => this.trigger(item, country, root));
  }
  trigger(item, country, root) {
    const key = item.key.text.toLowerCase(),
      value = item.value;
    if (key === "and" || key === "root")
      return this.condition(value, key === "root" ? root : country, root);
    if (key === "or") return properties(value).some((child) => this.trigger(child, country, root));
    // HOI4's implicit NOT group is NOR: every direct child must be false.
    // NAND must be written explicitly as NOT = { AND = { ... } }.
    if (key === "not")
      return !properties(value).some((child) => this.trigger(child, country, root));
    if (key === "always") return atom(value) === "yes";
    if (key === "has_country_flag") return country.flags.has(atom(value));
    if (key === "has_global_flag") return this.global.flags.has(atom(value));
    if (key === "is_ai") return country.ai === (atom(value) === "yes");
    if (key.startsWith("event_target:")) {
      const target = this.targets[item.key.text.slice(13)];
      return Boolean(target && this.condition(value, target, root));
    }
    if (key === "any_country")
      return this.countries.some((other) => this.condition(value, other, root));
    if (key === "check_variable") {
      const map = fields(value);
      if (map.var)
        return this.compare(
          this.number(map.var, country),
          this.number(map.value, country),
          map.compare ? atom(map.compare) : "equals",
        );
      return properties(value).every((v) =>
        this.compare(this.variable(v.key.text, country), this.number(v.value, country), v.operator),
      );
    }
    if (key === "is_in_array") {
      const map = fields(value);
      return (country.arrays[atom(map.array)] ?? []).includes(this.number(map.value, country));
    }
    throw new Error(`Unsupported native UNO trigger ${item.key.text}`);
  }
  run(name, country = this.countries[0]) {
    const block = this.definitions.get(name);
    assert.ok(block, `Missing effect ${name}`);
    this.temporary = {};
    try {
      this.execute(block, country, country);
    } finally {
      this.temporary = {};
    }
  }
  execute(block, country, root = country) {
    let branchTaken = false;
    for (const item of properties(block)) {
      const key = item.key.text.toLowerCase(),
        value = item.value;
      if (key === "if" || key === "else_if" || key === "else") {
        if (key === "if") branchTaken = false;
        const eligible = key === "else" || this.condition(field(value, "limit"), country, root);
        if (!branchTaken && eligible) {
          this.execute(value, country, root);
          branchTaken = true;
        }
        continue;
      }
      if (key === "limit") continue;
      branchTaken = false;
      if (key === "root") {
        this.execute(value, root, root);
        continue;
      }
      if (key.startsWith("event_target:")) {
        const target = this.targets[item.key.text.slice(13)];
        assert.ok(target, item.key.text);
        this.execute(value, target, root);
        continue;
      }
      if (key === "every_country" || key === "random_country") {
        const limit = field(value, "limit");
        const eligible = this.countries.filter((c) => !limit || this.condition(limit, c, root));
        for (const other of key === "every_country" ? eligible : eligible.slice(0, 1))
          this.execute(value, other, root);
        continue;
      }
      if (key === "random_list") {
        const choices = properties(value).map((choice) => {
          let weight = this.number(choice.key.text, country);
          for (const mod of properties(choice.value).filter(
            (child) => child.key.text === "modifier",
          )) {
            const triggers = {
              kind: "block",
              items: properties(mod.value).filter((child) => child.key.text !== "factor"),
            };
            if (this.condition(triggers, country, root))
              weight *= this.number(field(mod.value, "factor"), country);
          }
          return { choice, weight };
        });
        this.seed = (1664525 * this.seed + 1013904223) >>> 0;
        let roll = (this.seed / 2 ** 32) * choices.reduce((sum, entry) => sum + entry.weight, 0);
        for (const { choice, weight } of choices) {
          if (weight > 0 && roll < weight) {
            this.execute(choice.value, country, root);
            break;
          }
          roll -= weight;
        }
        continue;
      }
      if (key === "modifier") continue;
      const operation = key.replace(/_temp_variable$/, "_variable");
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
        const map = fields(value),
          entry = properties(value)[0],
          name = map.var ? atom(map.var) : entry.key.text;
        const temporary = key !== operation;
        const amount = this.number(map.value ?? entry.value, country),
          before = temporary ? (this.temporary[name] ?? 0) : this.variable(name, country, false);
        const result = {
          set_variable: amount,
          add_to_variable: before + amount,
          subtract_from_variable: before - amount,
          multiply_variable: before * amount,
          divide_variable: before / amount,
          modulo_variable: before % amount,
        }[operation];
        if (temporary) this.temporary[name] = result;
        else this.set(name, result, country);
        continue;
      }
      if (key === "clear_variable") {
        this.set(atom(value), 0, country);
        continue;
      }
      if (key === "set_country_flag") {
        country.flags.add(atom(value));
        continue;
      }
      if (key === "clr_country_flag") {
        country.flags.delete(atom(value));
        continue;
      }
      if (key === "set_global_flag") {
        this.global.flags.add(atom(value));
        continue;
      }
      if (key === "clr_global_flag") {
        this.global.flags.delete(atom(value));
        continue;
      }
      if (key === "save_global_event_target_as") {
        this.targets[atom(value)] = country;
        continue;
      }
      if (key === "clear_global_event_target") {
        delete this.targets[atom(value)];
        continue;
      }
      if (key === "clear_array") {
        country.arrays[atom(value)] = [];
        continue;
      }
      if (key === "add_to_array" || key === "remove_from_array") {
        const map = fields(value),
          array = atom(map.array),
          number = this.number(map.value, country);
        const data = (country.arrays[array] ??= []);
        if (key === "add_to_array") data.push(number);
        else {
          const index = data.indexOf(number);
          if (index !== -1) data.splice(index, 1);
        }
        continue;
      }
      if (key === "sound_effect") {
        this.sounds.push(atom(value));
        continue;
      }
      if (key === "country_event") {
        this.events.push({
          country: country.tag,
          id: value.kind === "atom" ? value.text : atom(field(value, "id")),
        });
        continue;
      }
      if (this.definitions.has(item.key.text)) {
        this.execute(this.definitions.get(item.key.text), country, root);
        continue;
      }
      throw new Error(`Unsupported native UNO effect ${item.key.text}`);
    }
  }
}
