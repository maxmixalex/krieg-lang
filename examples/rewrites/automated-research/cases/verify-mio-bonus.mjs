import assert from "node:assert/strict";
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePdx } from "../../../../dist/pdx/index.js";
import { MioNativeMachine } from "./mio-native-machine.mjs";
const here = dirname(fileURLToPath(import.meta.url)),
  project = resolve(here, "..");
const source = resolve(
  process.argv[2] ?? join(project, "../../../../private-mods/Automated-Research"),
);
const built = resolve(process.argv[3] ?? join(project, "build/mod"));
const props = (b) => (b?.items ?? []).filter((x) => x.kind === "property");
function load(root, folder) {
  const map = new Map();
  if (!existsSync(join(root, folder))) return map;
  for (const file of readdirSync(join(root, folder)).filter((x) => x.endsWith(".txt"))) {
    const parsed = parsePdx(readFileSync(join(root, folder, file), "utf8"));
    assert.equal(parsed.diagnostics.length, 0);
    for (const p of props(parsed.document)) {
      assert.ok(!map.has(p.key.text), "Duplicate " + p.key.text);
      map.set(p.key.text, p.value);
    }
  }
  return map;
}
const native = load(source, "common/scripted_effects"),
  rewrite = load(built, "common/scripted_effects");
const nativeTriggers = load(source, "common/scripted_triggers"),
  rewriteTriggers = load(built, "common/scripted_triggers");
function facts(file, name) {
  const s = readFileSync(join(project, "src", file), "utf8"),
    start = s.indexOf("export const " + name + " = ") + ("export const " + name + " = ").length,
    end = s.indexOf(" as const;", start);
  return JSON.parse(s.slice(start, end).replace(/,\s*]$/, " ]"));
}
const technology = facts("mio-facts.krg.ts", "mioTechnologyFacts"),
  focusFacts = facts("bonus-focus-facts.krg.ts", "focusBonuses");
const bonusColumns = [
  "rq_bnk",
  "rq_bnv",
  "rq_bna",
  "rq_bnu",
  "rq_bnq",
  "rq_atk",
  "rq_atv",
  "rq_ata",
];
let checks = 0;
const results = [];
function equivalent(a, b, path = "state") {
  if (typeof a === "number" && typeof b === "number") {
    assert.ok(
      Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(a), Math.abs(b)),
      `${path}: ${a} != ${b}`,
    );
    return;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    assert.equal(a.length, b.length, path + " length");
    a.forEach((x, i) => equivalent(x, b[i], path + "[" + i + "]"));
    return;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), path + " keys");
    for (const k of Object.keys(a)) equivalent(a[k], b[k], path + "." + k);
    return;
  }
  assert.deepEqual(a, b, path);
}
const scalar = (v) => (typeof v === "object" && v !== null ? (v.id ?? v.tag) : v);
function state(m, arrays = [], vars = [], c = m.countries[0]) {
  return {
    arrays: Object.fromEntries(arrays.map((k) => [k, m.array(k, c).map(scalar)])),
    vars: Object.fromEntries(vars.map((k) => [k, scalar(m.get(k, c))])),
  };
}
function pairs(setup = () => {}) {
  return [
    [native, nativeTriggers],
    [rewrite, rewriteTriggers],
  ].map(([d, t]) => {
    const m = new MioNativeMachine(d, t);
    setup(m, m.countries[0]);
    return m;
  });
}
function check(effect, setup, projection, scope) {
  const pair = pairs(setup);
  for (const m of pair) {
    if (scope) m.run(effect, scope(m));
    else m.run(effect);
  }
  equivalent(projection(pair[0]), projection(pair[1]), effect);
  checks++;
  return pair;
}
function group(name, fn) {
  if (process.env.RESEARCH_CASE_FILTER && !new RegExp(process.env.RESEARCH_CASE_FILTER).test(name))
    return;
  const n = checks,
    t = Date.now();
  fn();
  results.push({ name, checks: checks - n, milliseconds: Date.now() - t });
  console.log("PASS", name, checks - n);
}
function queue(c, ids, mios = ids.map(() => 0)) {
  c.arrays.rq_queue = ids;
  c.arrays.rq_qprog = ids.map(() => 0);
  c.arrays.rq_qmio = mios;
  c.arrays.rq_qsrc = ids.map(() => 0);
}
// Build stimuli from the original's identity branches, independently of the port's catalogue.
const organizationIds = new Map();
function collectIdentities(block) {
  for (const entry of props(block)) {
    const children = props(entry.value);
    const field = (group, key) =>
      props(children.find((x) => x.key.text === group)?.value).find((x) => x.key.text === key)
        ?.value.text;
    const id = field("limit", "is_military_industrial_organization");
    const index = field("set_temp_variable", "rq_mio_i");
    if (id && index) {
      assert.ok(!organizationIds.has(Number(index)));
      organizationIds.set(Number(index), id);
    }
    collectIdentities(entry.value);
  }
}
collectIdentities(native.get("rq_mio_index_this"));
assert.equal(organizationIds.size, 525);
function org(m, id = 1, opts = {}) {
  return m.organization(organizationIds.get(id), opts);
}
function awards(c, k = [11, 1], v = [0.5, 0.5], a = [0, 0], u = [1, 1]) {
  c.arrays.rq_bnk = k;
  c.arrays.rq_bnv = v;
  c.arrays.rq_bna = a;
  c.arrays.rq_bnu = u;
  c.arrays.rq_bnq = k.map(() => 0);
}

group("All 552 bonus category sets and 273 engine-presence categories", () => {
  for (let t = 1; t <= 552; t++)
    check(
      "rq_bn_tkinds",
      (m, c) => (c.vars.rq_t = t),
      (m) => state(m, ["rq_tk"]),
    );
  for (let kind = 1; kind <= 273; kind++)
    for (const have of [false, true])
      check(
        "rq_bn_present",
        (m, c) => {
          c.vars.rq_lbk = kind;
          c.techBonuses = new Set();
          if (have) {
            for (const t of technology)
              for (const category of t.categories) c.techBonuses.add(category);
          }
        },
        (m) => state(m, [], ["rq_lbp"]),
      );
});
group(
  "1234 focus discoveries are idempotent with DLC, technology and special-project branches",
  () => {
    const allDlc = [
      "Arms Against Tyranny",
      "By Blood Alone",
      "Death or Dishonor",
      "Gotterdammerung",
      "La Resistance",
      "Man the Guns",
      "No Compromise, No Surrender",
      "No Step Back",
    ];
    for (const record of focusFacts)
      for (const mode of [0, 1]) {
        const pair = check(
          "rq_bn_poll",
          (m, c) => {
            c.focusTrees = new Set(record.tree ? [record.tree] : []);
            c.focuses = new Set([record.focus]);
            if (mode) {
              allDlc.forEach((x) => m.dlcs.add(x));
              technology.forEach((t) => c.tech.add(t.id));
              c.projects = new Set(["sp:sp_nuclear_reactor"]);
              c.originalResearchSlots = 4;
              c.agency = true;
              m.global.vars.gun_and_shell_level = 3;
            }
          },
          (m) => ({ state: state(m, bonusColumns), flags: [...m.countries[0].flags].sort() }),
        );
        for (const m of pair) m.run("rq_bn_poll");
        equivalent(state(pair[0], bonusColumns), state(pair[1], bonusColumns));
        checks++;
      }
  },
);
group(
  "bonus competition, queue reservations, partial progress, native adoption and consumed-use reconciliation",
  () => {
    for (const progress of [0, 75, 219])
      for (const year of [1936, 1940, 1944]) {
        const pair = check(
          "rq_bn_prep",
          (m, c) => {
            queue(c, [4, 5, 6]);
            c.arrays.rq_qprog = [progress, 0, 0];
            awards(c, [11, 39], [0.5, 0], [0, 2], [1, 1]);
            Object.assign(c.vars, { rq_now_y: year, rq_now_doy: 150, rq_speed_shown: 1 });
          },
          (m) => state(m, ["rq_tsv", "rq_tst", "rq_tsc", "rq_bt1", "rq_bt2", "rq_btt", "rq_btt2"]),
        );
        for (const t of [4, 5, 6]) {
          for (const m of pair) {
            m.countries[0].vars.rq_t = t;
            m.run("rq_bonus_get");
          }
          equivalent(
            state(pair[0], [], ["rq_lbv", "rq_lba", "rq_bh_any", "rq_bh_for"]),
            state(pair[1], [], ["rq_lbv", "rq_lba", "rq_bh_any", "rq_bh_for"]),
          );
          checks++;
        }
      }
    const pair = pairs((m, c) => {
      queue(c, [4, 5]);
      awards(c, [11], [0.5], [0], [1]);
      Object.assign(c.vars, { rq_t: 4, rq_now_y: 1940, rq_speed_shown: 1 });
    });
    for (const [effect, vars] of [
      ["rq_bn_activate", { rq_t: 4, rq_bn_real: 0 }],
      ["rq_bn_activate", { rq_t: 5, rq_bn_real: 1 }],
      ["rq_bn_activate", { rq_t: 5, rq_bn_real: 1 }],
    ]) {
      for (const m of pair) {
        Object.assign(m.countries[0].vars, vars);
        m.run(effect);
      }
      equivalent(state(pair[0], bonusColumns), state(pair[1], bonusColumns), effect);
      checks++;
    }
    for (const have of [false, true])
      for (const paused of [0, 1])
        check(
          "rq_bn_check",
          (m, c) => {
            awards(c, [11], [0.5], [0], [1]);
            c.arrays.rq_bnq = [1];
            c.techBonuses = new Set(have ? ["air_equipment", "industry"] : []);
            c.vars.rq_no_progress = paused;
            c.arrays.rq_atk = [4, 5];
            c.arrays.rq_atv = [0.5, 0.5];
            c.arrays.rq_ata = [0, 0];
            c.tech.add("CAS1");
            c.tech.add("CAS2");
          },
          (m) => state(m, bonusColumns),
        );
  },
);
group("525 organization IDs and their cached identity bits", () => {
  for (let i = 1; i <= 525; i++) {
    const pair = check(
      "rq_mio_index_this",
      (m) => org(m, i),
      (m) => ({
        index: m.get("rq_mio_i", m.organizations[0]),
        flags: [...m.organizations[0].flags].sort(),
      }),
      (m) => m.organizations[0],
    );
    for (const m of pair) m.run("rq_mio_index_this", m.organizations[0]);
    equivalent(
      pair[0].get("rq_mio_i", pair[0].organizations[0]),
      pair[1].get("rq_mio_i", pair[1].organizations[0]),
    );
    checks++;
  }
});
group("552 MIO eligibility sets, exact equipment preference, funds and design variants", () => {
  for (const tech of technology)
    for (const mode of ["none", "category", "equipment"])
      check(
        "rq_mio_fits",
        (m) => {
          const o = org(m);
          o.vars.rq_t = tech.index;
          if (mode === "category") tech.categories.forEach((x) => o.categories.add(x));
          if (mode === "equipment") tech.equipment.forEach((x) => o.equipment.add(x));
        },
        (m) => state(m, [], ["rq_fit", "rq_fiteq"], m.organizations[0]),
        (m) => m.organizations[0],
      );
  for (const tech of technology) {
    check(
      "rq_mio_funds",
      (m, c) => (c.vars.rq_t = tech.index),
      (m) => state(m, [], ["rq_funds"]),
    );
    for (const tag of ["TST", "GER"])
      check(
        "rq_mio_design",
        (m, c) => {
          c.tag = tag;
          c.vars.rq_t = tech.index;
          c.vars["rq_m_" + tech.id] = org(m);
        },
        (m) => m.variants,
      );
  }
});
group("MIO scope assignment, bonus, invalidation, used flags and completion growth", () => {
  for (const available of [true, false])
    check(
      "rq_mio_upkeep",
      (m, c) => {
        queue(c, [4, 5], [1, 2]);
        c.vars.rq_m_CAS1 = org(m, 1, { available });
        org(m, 2);
      },
      (m) => ({
        state: state(m, ["rq_qmio"], ["rq_m_CAS1", "rq_m_CAS2"]),
        flags: m.organizations.map((o) => [...o.flags].sort()),
      }),
    );
  for (const tech of [4, 37, 552])
    for (const bonus of [0, 0.15, 0.4])
      check(
        "rq_mio_bonus",
        (m, c) => {
          c.vars.rq_t = tech;
          c.vars["rq_m_" + technology[tech - 1].id] = org(m, 1, {
            vars: { research_bonus: bonus },
          });
        },
        (m) => state(m, [], ["rq_mb"]),
      );
  for (const tech of [1, 4, 37, 552])
    check(
      "rq_mio_pay",
      (m, c) => {
        c.vars.rq_t = tech;
        c.vars["rq_m_" + technology[tech - 1].id] = org(m);
      },
      (m) => m.organizations.map((o) => o.funds),
    );
});
group(
  "maintenance cost counts concurrent lanes, resets per tick and removes stale modifiers",
  () => {
    const pair = pairs((m, c) => {
      c.arrays.rq_mppc = [1, 1, 525];
      c.arrays.rq_mppon = [2];
      c.vars.rq_mppv_2 = -0.2;
      c.modifiers = new Set(["rq_mpp_2"]);
    });
    for (const ids of [[1, 1, 525], [1, 525], [], [525, 525, 525]]) {
      for (const m of pair) {
        m.countries[0].arrays.rq_mppc = ids;
        m.run("rq_mpp_apply");
      }
      equivalent(
        {
          state: state(pair[0], ["rq_mppon"], ["rq_mppv_1", "rq_mppv_2", "rq_mppv_525"]),
          modifiers: [...pair[0].countries[0].modifiers].sort(),
        },
        {
          state: state(pair[1], ["rq_mppon"], ["rq_mppv_1", "rq_mppv_2", "rq_mppv_525"]),
          modifiers: [...pair[1].countries[0].modifiers].sort(),
        },
      );
      checks++;
    }
  },
);
group("popup list ordering, assigned state, saved-scope restore and native task matching", () => {
  for (const current of [0, 2])
    check(
      "rq_ml_refresh",
      (m, c) => {
        queue(c, [4], [current]);
        c.vars.rq_ml_t = 4;
        for (let i = 1; i <= 12; i++)
          org(m, i, {
            categories: new Set(["air_equipment"]),
            vars: { research_bonus: i / 100, number_of_currently_assigned_tasks: i % 2 },
          });
      },
      (m) =>
        state(
          m,
          [],
          [
            "rq_ml_n",
            "rq_ml_cur",
            "rq_ml_funds",
            ...Array.from({ length: 10 }, (_, i) => [
              "rq_ml" + (i + 1) + "_i",
              "rq_ml" + (i + 1) + "_s",
              "rq_ml" + (i + 1) + "_b",
              "rq_ml" + (i + 1) + "_ref",
            ]).flat(),
          ],
        ),
    );
  for (const available of [true, false])
    check(
      "rq_mio_restore",
      (m, c) => {
        queue(c, [4]);
        Object.assign(c.vars, { rq_t: 4, rq_lm: 2 });
        org(m, 2, { available, categories: new Set(["air_equipment"]) });
      },
      (m) => state(m, ["rq_qmio"], ["rq_mgot", "rq_m_CAS1"]),
    );
  const pair = pairs((m, c) => {
    queue(c, [4, 5]);
    c.arrays.rq_vanilla = [4, 5];
    org(m, 1, { equipment: new Set(["small_plane_cas_airframe"]) });
  });
  for (const tasks of [0, 1, 2, 1]) {
    for (const m of pair) {
      m.organizations[0].vars.number_of_currently_assigned_tasks = tasks;
      m.run("rq_vanilla_mio");
    }
    equivalent(
      state(pair[0], ["rq_qmio", "rq_mtc"], ["rq_m_CAS1", "rq_m_CAS2"]),
      state(pair[1], ["rq_qmio", "rq_mtc"], ["rq_m_CAS1", "rq_m_CAS2"]),
    );
    checks++;
  }
});
const report = {
  checks,
  groups: results,
  limitations: [
    "Native PDX interpreter, not an HOI4 engine run.",
    "Base-game focus/project/DLC and organization availability queries are modeled inputs.",
    "Focus political-relation combinations beyond the explicit scenario matrix need in-game verification.",
  ],
};
if (!process.env.RESEARCH_CASE_FILTER)
  writeFileSync(join(here, "verification-mio-bonus.json"), JSON.stringify(report, null, 2) + "\n");
console.log("PASS total", checks);
