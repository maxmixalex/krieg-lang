import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parsePdx } from "../../dist/pdx/index.js";

export function properties(block) {
  return (block?.items ?? []).filter((x) => x.kind === "property");
}
export function field(block, key) {
  return properties(block).find((x) => x.key.text === key)?.value;
}
export function atom(block, key) {
  return field(block, key)?.text;
}
export function filesBelow(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? filesBelow(join(dir, e.name)) : [join(dir, e.name)],
  );
}
export function readDocument(file) {
  const r = parsePdx(readFileSync(file, "utf8"));
  if (r.diagnostics.some((d) => d.severity === "error"))
    throw new Error(`PDX parse failed: ${file}`);
  return r.document;
}
export function readDefinitions(root, folder) {
  const result = {};
  for (const file of filesBelow(join(root, folder)).filter((f) => f.endsWith(".txt"))) {
    for (const p of properties(readDocument(file))) result[p.key.text] = p.value;
  }
  return result;
}
export function readScriptedGui(root) {
  const result = {};
  for (const file of filesBelow(join(root, "common/scripted_guis")).filter((f) =>
    f.endsWith(".txt"),
  )) {
    for (const wrapper of properties(readDocument(file)))
      for (const gui of properties(wrapper.value)) result[gui.key.text] = gui.value;
  }
  return result;
}
export function readLocalisationDefinitions(root) {
  const result = {};
  for (const file of filesBelow(join(root, "common/scripted_localisation")).filter((f) =>
    f.endsWith(".txt"),
  )) {
    for (const p of properties(readDocument(file))) result[atom(p.value, "name")] = p.value;
  }
  return result;
}

/** Independent interpreter for the effect/trigger subset used by these three ports.
 * This is a deterministic differential oracle, not an implementation of the HOI4 engine.
 * It models floating-point arithmetic, scope ownership, arrays and the native 1,000-loop
 * bound. Engine fixed-point rounding, UI rendering and audio playback remain in-game checks.
 */
export class RewriteModel {
  constructor(world, definitions = {}, localisations = {}) {
    this.world = structuredClone(world);
    this.definitions = definitions;
    this.localisations = localisations;
    this.temp = {};
    this.randomCalls = 0;
    this.executed = 0;
  }
  context(tag = "AAA", selectedState) {
    const root = this.world.countries.find((c) => c.tag === tag);
    return {
      current: root,
      root,
      parents: [],
      selectedState: this.world.states.find((s) => s.id === selectedState),
    };
  }
  enter(ctx, target) {
    return { ...ctx, current: target, parents: [ctx.current, ...ctx.parents] };
  }
  scope(token, ctx) {
    if (token.startsWith("var:")) return this.read(token.slice(4), ctx);
    if (token === "FROM.FROM") return ctx.selectedState;
    const steps = token.toUpperCase().split(".");
    if (steps.every((x) => x === "PREV")) return ctx.parents[steps.length - 1];
    if (steps[0] === "ROOT") return ctx.root;
    if (steps[0] === "THIS") return ctx.current;
    if (steps[0] === "FROM") return ctx.selectedState ?? ctx.root;
    return (
      this.world.countries.find((c) => c.tag === token) ??
      this.world.states.find((s) => String(s.id) === token)
    );
  }
  location(name, ctx, temporary) {
    const caret = name.indexOf("^");
    if (caret >= 0) {
      const base = this.location(name.slice(0, caret), ctx, temporary);
      const indexName = name.slice(caret + 1);
      if (!Array.isArray(base.object[base.key])) base.object[base.key] = [];
      return {
        object: base.object[base.key],
        key: indexName === "num" ? "length" : this.read(indexName, ctx),
      };
    }
    let entity = ctx.current;
    let key = name;
    if (name.toLowerCase().startsWith("global."))
      return { object: this.world.global, key: name.slice(7) };
    const match = /^((?:(?:ROOT|THIS|PREV|FROM)\.)+)(.+)$/i.exec(name);
    if (match) {
      entity = this.scope(match[1].slice(0, -1), ctx);
      key = match[2];
    }
    if (!entity) throw new Error(`Missing scope for ${name}`);
    if (temporary || (temporary === undefined && Object.hasOwn(this.temp, key)))
      return { object: this.temp, key };
    return { object: entity.variables, key };
  }
  read(name, ctx) {
    if (typeof name === "number") return name;
    if (/^-?\d+(?:\.\d+)?$/.test(name)) return Number(name);
    if (name.toLowerCase() === "random") {
      this.randomCalls++;
      return 0.317;
    }
    if (/^(ROOT|THIS|PREV|FROM)(\.(ROOT|THIS|PREV|FROM))*$/i.test(name))
      return this.scope(name, ctx);
    const caret = name.indexOf("^");
    if (caret >= 0) {
      const loc = this.location(name, ctx);
      return loc.object[loc.key] ?? 0;
    }
    const loc = this.location(name, ctx);
    if (Object.hasOwn(loc.object, loc.key)) return loc.object[loc.key];
    let entity = ctx.current,
      key = name;
    const match = /^((?:(?:ROOT|THIS|PREV|FROM)\.)+)(.+)$/i.exec(name);
    if (match) {
      entity = this.scope(match[1].slice(0, -1), ctx);
      key = match[2];
    }
    if (key === "num_owned_states")
      return this.world.states.filter((s) => s.owner === entity.tag).length;
    if (key === "num_core_states")
      return this.world.states.filter((s) => s.cores.includes(entity.tag)).length;
    return entity?.builtins?.[key] ?? 0;
  }
  value(node, ctx) {
    if (!node) return 0;
    if (node.kind !== "atom") throw new Error("Expected scalar value");
    if (node.text === "yes") return true;
    if (node.text === "no") return false;
    if (this.world.countries.some((c) => c.tag === node.text)) return this.scope(node.text, ctx);
    return this.read(node.text, ctx);
  }
  write(name, value, ctx, temporary = false) {
    const loc = this.location(name, ctx, temporary);
    loc.object[loc.key] = value;
  }
  array(name, ctx, temporary) {
    const loc = this.location(name, ctx, temporary);
    return loc.object[loc.key] ?? (loc.object[loc.key] = []);
  }
  pair(block) {
    const variable = field(block, "var");
    if (variable) return [variable.text, field(block, "value")];
    const p = properties(block)[0];
    return [p.key.text, p.value];
  }
  test(block, ctx) {
    return properties(block).every((p) => this.condition(p, ctx));
  }
  condition(p, ctx) {
    const k = p.key.text,
      v = p.value;
    if (k === "always") return v.text === "yes";
    if (k === "AND" || k === "limit" || k === "trigger") return this.test(v, ctx);
    if (k === "OR") return properties(v).some((x) => this.condition(x, ctx));
    if (k === "NOT") return !this.test(v, ctx);
    if (k === "is_ai") return ctx.current.ai === (v.text === "yes");
    if (k === "has_idea") return ctx.current.ideas.includes(v.text);
    if (k === "original_tag") return ctx.current.tag === v.text;
    if (k === "has_state_category") return ctx.current.category === v.text;
    if (k === "is_in_home_area") return ctx.current.home === (v.text === "yes");
    if (k === "is_core_of") return ctx.current.cores.includes(this.scope(v.text, ctx)?.tag);
    if (k === "has_country_flag" || k === "has_state_flag")
      return ctx.current.flags.includes(v.text);
    if (k === "has_global_flag") return this.world.flags.includes(v.text);
    if (k === "has_variable") {
      const loc = this.location(v.text, ctx);
      return Object.hasOwn(loc.object, loc.key);
    }
    if (k === "check_variable") {
      const variable = field(v, "var");
      const comparisons = {
        equals: "=",
        not_equals: "!=",
        less_than: "<",
        greater_than: ">",
        less_than_or_equals: "<=",
        greater_than_or_equals: ">=",
      };
      const checks = variable
        ? [[variable.text, comparisons[atom(v, "compare")] ?? "=", field(v, "value")]]
        : properties(v).map((x) => [x.key.text, x.operator, x.value]);
      return checks.every(([name, op, val]) => {
        const a = this.read(name, ctx),
          b = this.value(val, ctx);
        return op === "="
          ? a === b
          : op === "!="
            ? a !== b
            : op === "<"
              ? a < b
              : op === ">"
                ? a > b
                : op === "<="
                  ? a <= b
                  : a >= b;
      });
    }
    if (k === "is_in_array") {
      const array = field(v, "array");
      const [name, val] = array ? [array.text, field(v, "value")] : this.pair(v);
      return this.array(name, ctx).includes(this.value(val, ctx));
    }
    if (["all_country", "all_other_country", "any_country", "any_owned_state"].includes(k)) {
      const targets =
        k === "any_owned_state"
          ? this.world.states.filter((s) => s.owner === ctx.current.tag)
          : this.world.countries.filter((c) => k !== "all_other_country" || c !== ctx.current);
      return k.startsWith("any_")
        ? targets.some((t) => this.test(v, this.enter(ctx, t)))
        : targets.every((t) => this.test(v, this.enter(ctx, t)));
    }
    const target = this.scope(k, ctx);
    if (target) return this.test(v, this.enter(ctx, target));
    throw new Error(`Unsupported trigger ${k}`);
  }
  run(name, ctx) {
    if (!this.definitions[name]) throw new Error(`Missing scripted effect ${name}`);
    this.effects(this.definitions[name], ctx);
  }
  effects(block, ctx) {
    let branch = false;
    for (const p of properties(block)) {
      if (++this.executed > 2_000_000) throw new Error("Oracle execution budget exceeded");
      const k = p.key.text,
        v = p.value;
      if (k === "if" || k === "else_if" || k === "else") {
        if (k === "if") branch = false;
        const active = !branch && (k === "else" || this.test(field(v, "limit"), ctx));
        if (active) {
          branch = true;
          this.effects({ items: properties(v).filter((x) => x.key.text !== "limit") }, ctx);
        }
        continue;
      }
      if (/^(set|add_to|subtract_from|multiply|divide|modulo)_(?:temp_)?variable$/.test(k)) {
        const [name, val] = this.pair(v),
          right = this.value(val, ctx),
          temporary = k.includes("temp_");
        const destination = this.location(name, ctx, temporary);
        const old = destination.object[destination.key] ?? 0;
        const next = k.startsWith("set_")
          ? right
          : k.startsWith("add_")
            ? old + right
            : k.startsWith("subtract_")
              ? old - right
              : k.startsWith("multiply_")
                ? old * right
                : k.startsWith("divide_")
                  ? right === 0
                    ? 0
                    : old / right
                  : old % right;
        this.write(name, next, ctx, temporary);
        continue;
      }
      if (k === "clamp_variable" || k === "clamp_temp_variable") {
        const name = atom(v, "var");
        this.write(
          name,
          Math.min(
            field(v, "max") ? this.value(field(v, "max"), ctx) : Infinity,
            Math.max(
              field(v, "min") ? this.value(field(v, "min"), ctx) : -Infinity,
              this.read(name, ctx),
            ),
          ),
          ctx,
          k.includes("temp_"),
        );
        continue;
      }
      if (k === "round_variable" || k === "round_temp_variable") {
        this.write(v.text, Math.round(this.read(v.text, ctx)), ctx, k.includes("temp_"));
        continue;
      }
      if (k === "clear_variable" || k === "clear_array" || k === "clear_temp_array") {
        const loc = this.location(v.text, ctx, k === "clear_temp_array");
        if (k.endsWith("array")) loc.object[loc.key] = [];
        else delete loc.object[loc.key];
        continue;
      }
      if (k === "add_to_array" || k === "add_to_temp_array") {
        const a = field(v, "array");
        const [name, val] = a ? [a.text, field(v, "value")] : this.pair(v);
        const array = this.array(name, ctx, k === "add_to_temp_array");
        const item = this.value(val, ctx);
        if (field(v, "index")) array.splice(this.value(field(v, "index"), ctx), 0, item);
        else array.push(item);
        continue;
      }
      if (k === "remove_from_array" || k === "remove_from_temp_array") {
        const array = this.array(atom(v, "array"), ctx, k === "remove_from_temp_array");
        const index = field(v, "index")
          ? this.value(field(v, "index"), ctx)
          : array.indexOf(this.value(field(v, "value"), ctx));
        if (index >= 0) array.splice(index, 1);
        continue;
      }
      if (k === "resize_array" || k === "resize_temp_array") {
        const array = this.array(atom(v, "array"), ctx, k === "resize_temp_array"),
          size = this.value(field(v, "size"), ctx);
        while (array.length < size) array.push(this.value(field(v, "value"), ctx));
        array.length = Math.max(0, size);
        continue;
      }
      if (k === "for_loop_effect") {
        const start = this.value(field(v, "start"), ctx),
          end = this.value(field(v, "end"), ctx),
          step = field(v, "add") ? this.value(field(v, "add"), ctx) : 1;
        const name = atom(v, "value") ?? "v";
        const stop = atom(v, "break") ?? "break";
        let iterations = 0;
        for (let n = start; step > 0 ? n < end : n > end; n += step) {
          if (++iterations > 1000) throw new Error("Engine loop bound reached");
          this.write(name, n, ctx, true);
          this.effects(
            {
              items: properties(v).filter(
                (x) => !["start", "end", "add", "compare", "value", "break"].includes(x.key.text),
              ),
            },
            ctx,
          );
          if (this.temp[stop]) break;
        }
        continue;
      }
      if (k === "while_loop_effect") {
        const stop = atom(v, "break") ?? "break";
        let iterations = 0;
        while (this.test(field(v, "limit"), ctx)) {
          if (++iterations > 1000) throw new Error("Engine loop bound reached");
          this.effects(
            { items: properties(v).filter((x) => !["limit", "break"].includes(x.key.text)) },
            ctx,
          );
          if (this.temp[stop]) break;
        }
        continue;
      }
      if (k === "for_each_loop") {
        const values = this.array(atom(v, "array"), ctx);
        const value = atom(v, "value") ?? "v";
        const index = atom(v, "index") ?? "i";
        const stop = atom(v, "break") ?? "break";
        for (let offset = 0; offset < values.length; offset++) {
          if (offset >= 1000) throw new Error("Engine loop bound reached");
          this.write(value, values[offset], ctx, true);
          this.write(index, offset, ctx, true);
          this.effects(
            {
              items: properties(v).filter(
                (x) => !["array", "value", "index", "break"].includes(x.key.text),
              ),
            },
            ctx,
          );
          if (this.temp[stop]) break;
        }
        continue;
      }
      if (k === "for_each_scope_loop") {
        for (const entity of [...this.array(atom(v, "array"), ctx)])
          this.effects(
            { items: properties(v).filter((x) => x.key.text !== "array") },
            this.enter(ctx, entity),
          );
        continue;
      }
      if (["every_country", "every_state", "every_owned_state"].includes(k)) {
        const targets =
          k === "every_country"
            ? this.world.countries
            : this.world.states.filter(
                (s) => k !== "every_owned_state" || s.owner === ctx.current.tag,
              );
        for (const target of targets) {
          const next = this.enter(ctx, target);
          if (!field(v, "limit") || this.test(field(v, "limit"), next))
            this.effects({ items: properties(v).filter((x) => x.key.text !== "limit") }, next);
        }
        continue;
      }
      if (k.toLowerCase() === "owner" || k.toLowerCase() === "controller") {
        const target = this.scope(ctx.current[k.toLowerCase()], ctx);
        this.effects(v, this.enter(ctx, target));
        continue;
      }
      if (k === "set_country_flag" || k === "set_state_flag" || k === "set_global_flag") {
        const flags = k === "set_global_flag" ? this.world.flags : ctx.current.flags;
        if (!flags.includes(v.text)) flags.push(v.text);
        continue;
      }
      if (k === "clr_country_flag" || k === "clr_state_flag" || k === "clr_global_flag") {
        const flags = k === "clr_global_flag" ? this.world.flags : ctx.current.flags;
        const i = flags.indexOf(v.text);
        if (i >= 0) flags.splice(i, 1);
        continue;
      }
      if (k === "add_core_of" || k === "remove_core_of") {
        const tag = this.scope(v.text, ctx)?.tag;
        const i = ctx.current.cores.indexOf(tag);
        if (k === "add_core_of" && i < 0) ctx.current.cores.push(tag);
        if (k === "remove_core_of" && i >= 0) ctx.current.cores.splice(i, 1);
        continue;
      }
      if (k === "transfer_state") {
        const state = this.scope(v.text, ctx);
        state.owner = ctx.current.tag;
        state.controller = ctx.current.tag;
        continue;
      }
      if (k === "force_update_map_mode") continue;
      if (k === "meta_effect") {
        const replacements = Object.fromEntries(
          properties(v)
            .filter((x) => x.key.text !== "text")
            .map((x) => [x.key.text, this.dynamicText(x.value.text, ctx)]),
        );
        const body = structuredClone(field(v, "text"));
        const replace = (node) => {
          if (node.kind === "atom")
            for (const [name, value] of Object.entries(replacements))
              node.text = node.text.replaceAll(`[${name}]`, value);
          else if (node.kind === "property") {
            replace(node.key);
            replace(node.value);
          } else for (const item of node.items ?? []) replace(item);
        };
        replace(body);
        this.effects(body, ctx);
        continue;
      }
      if (this.definitions[k]) {
        this.run(k, ctx);
        continue;
      }
      const target = this.scope(k, ctx);
      if (target) {
        this.effects(v, this.enter(ctx, target));
        continue;
      }
      throw new Error(`Unsupported effect ${k}`);
    }
  }
  dynamicText(text, ctx) {
    return text.replace(/\[([A-Za-z_.]+)\]/g, (_, token) => {
      const parts = token.split("."),
        name = parts.pop();
      const selected = parts.length ? this.enter(ctx, this.scope(parts.join("."), ctx)) : ctx;
      const def = this.localisations[name];
      if (!def) throw new Error(`Missing dynamic text ${name}`);
      for (const text of properties(def).filter((x) => x.key.text === "text"))
        if (!field(text.value, "trigger") || this.test(field(text.value, "trigger"), selected))
          return atom(text.value, "localization_key");
      return "";
    });
  }
}
