// Symbolic comparison of ordered flag transitions and per-track numeric writes.
// Engine predicates are independent Boolean inputs. A reduced ordered decision
// diagram compares *all* combinations without assuming a particular playthrough.
import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import { parsePdx } from "../../../../dist/pdx/index.js";
const key = (p) => p.key.text.toLowerCase(),
  items = (p) => p.value.items ?? [],
  text = (p) => p.value.text;
class Bdd {
  nodes = [null, null];
  unique = new Map();
  memo = new Map();
  make(atom, lo, hi) {
    if (lo === hi) return hi;
    const k = JSON.stringify([atom, lo, hi]);
    let id = this.unique.get(k);
    if (id === undefined) {
      id = this.nodes.length;
      this.unique.set(k, id);
      this.nodes.push({ atom, lo, hi });
    }
    return id;
  }
  var(s) {
    return this.make(s, 0, 1);
  }
  apply(op, a, b) {
    if (a <= 1 && b <= 1) return Number(op === "and" ? a && b : op === "or" ? a || b : a !== b);
    const k = op + ":" + Math.min(a, b) + ":" + Math.max(a, b);
    if (this.memo.has(k)) return this.memo.get(k);
    const left = this.nodes[a],
      right = this.nodes[b],
      v = left && right ? (left.atom < right.atom ? left.atom : right.atom) : (left ?? right).atom;
    const lo = this.apply(op, left?.atom === v ? left.lo : a, right?.atom === v ? right.lo : b),
      hi = this.apply(op, left?.atom === v ? left.hi : a, right?.atom === v ? right.hi : b);
    const out = this.make(v, lo, hi);
    this.memo.set(k, out);
    return out;
  }
  not(a) {
    return this.apply("xor", a, 1);
  }
  fold(xs, or = false) {
    return xs.reduce((acc, x) => this.apply(or ? "or" : "and", acc, x), or ? 0 : 1);
  }
}
function simulated(tree, bdd) {
  const varWrites = new Map(),
    flagWrites = [],
    calls = [],
    scopeBlocks = new Set([
      "SOV",
      "JAP",
      "SWE",
      "CZE",
      "AUS",
      "FRA",
      "ENG",
      "GER",
      "OVERLORD",
      "any_country_with_original_tag",
      "any_enemy_country",
      "any_owned_state",
      "ROOT",
      "PREV",
    ]);
  const blockPred = (list, or = false) => bdd.fold(list.map(predicate), or);
  function predicate(p) {
    const k = key(p);
    if (k === "and" || k === "or" || k === "not") {
      const id = blockPred(items(p), k !== "and");
      return k === "not" ? bdd.not(id) : id;
    }
    if (k === "always") return Number(text(p) === "yes");
    if (scopeBlocks.has(p.key.text))
      return bdd.var(JSON.stringify(["scope", p.key.text, blockPred(items(p))]));
    if (p.value.kind === "atom") {
      const b = text(p) === "yes" || text(p) === "no",
        ref = bdd.var(JSON.stringify([k, p.operator, b ? "yes" : text(p)]));
      return b && text(p) === "no" ? bdd.not(ref) : ref;
    }
    // Native parameter records here contain scalar fields; sorting preserves the value
    // of comparisons without conflating nested scope predicates or duplicate fields.
    assert.ok(
      items(p).every((c) => c.value.kind === "atom"),
      "unsupported trigger " + p.key.text,
    );
    return bdd.var(
      JSON.stringify([
        k,
        items(p)
          .map((c) => [key(c), c.operator, text(c)])
          .sort(),
      ]),
    );
  }
  function body(list, parent) {
    let untaken;
    for (const p of list) {
      const k = key(p);
      if (k === "if" || k === "else_if" || k === "else") {
        const limit = items(p).find((c) => key(c) === "limit");
        if (k === "if") untaken = parent;
        assert.notEqual(untaken, undefined, "unpaired else");
        const cond = k === "else" ? 1 : blockPred(items(limit)),
          when = bdd.apply("and", untaken, cond);
        body(
          items(p).filter((c) => key(c) !== "limit"),
          when,
        );
        untaken = bdd.apply("and", untaken, bdd.not(cond));
        continue;
      }
      untaken = undefined;
      if (!parent) continue;
      if (k === "set_country_flag" || k === "clr_country_flag") {
        flagWrites.push([k, text(p), parent]);
        continue;
      }
      if (["set_variable", "add_to_variable", "multiply_variable"].includes(k)) {
        const parts = items(p);
        const ident =
          parts.length === 1 ? parts[0].key.text : text(parts.find((c) => key(c) === "var"));
        const val =
          parts.length === 1 ? text(parts[0]) : text(parts.find((c) => key(c) === "value"));
        const entries = varWrites.get(ident) ?? [];
        entries.push([k, Number(val), parent]);
        assert.ok(Number.isFinite(+val), "not a constant delta");
        varWrites.set(ident, entries);
        continue;
      }
      if (p.value.kind === "atom" && text(p) === "yes") {
        calls.push([k, parent]);
        continue;
      }
      throw Error("Unsupported effect " + k);
    }
  }
  body(items(tree), 1);
  return { flags: flagWrites, tracks: Object.fromEntries([...varWrites.entries()].sort()), calls };
}
export function audit(original, compiled) {
  const parse = (file) => {
    const p = parsePdx(readFileSync(file, "utf8"));
    assert.equal(p.diagnostics.length, 0);
    return p.document.items;
  };
  const native = parse(original);
  const report = {};
  for (const which of ["rq_ap_strat", "rq_ap_profile"]) {
    const bdd = new Bdd(),
      lhs = simulated(
        native.find((p) => key(p) === which),
        bdd,
      ),
      rhs = simulated(
        parse(join(compiled, "krieg_" + which + ".txt")).find((p) => key(p) === which),
        bdd,
      );
    assert.deepEqual(rhs.flags, lhs.flags, which + " ordered flag transitions");
    assert.deepEqual(rhs.calls, lhs.calls, which + " scripted calls");
    assert.deepEqual(Object.keys(rhs.tracks), Object.keys(lhs.tracks), which + " track names");
    for (const [name, rows] of Object.entries(lhs.tracks))
      assert.deepEqual(rhs.tracks[name], rows, which + " updates for " + name);
    report[which] = {
      orderedFlagWrites: lhs.flags.length,
      numericTracks: Object.keys(lhs.tracks).length,
      guardedNumericWrites: Object.values(lhs.tracks).flat().length,
      symbolicDecisionNodes: bdd.nodes.length - 2,
      allComparedGuardsEquivalent: true,
    };
  }
  return report;
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const base = fileURLToPath(new URL("../", import.meta.url)),
    source = resolve(
      process.argv[2] ??
        join(
          base,
          "../../../../private-mods/Automated-Research/common/scripted_effects/rq_auto.txt",
        ),
    ),
    generated = resolve(process.argv[3] ?? join(base, "build/mod/common/scripted_effects"));
  console.log(JSON.stringify(audit(source, generated), null, 2));
}
