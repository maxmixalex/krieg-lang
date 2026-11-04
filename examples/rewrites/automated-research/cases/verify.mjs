import assert from "node:assert/strict";
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { parsePdx } from "../../../../dist/pdx/index.js";
import { ResearchNativeMachine } from "./native-machine.mjs";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const original = resolve(
  process.argv[2] ?? join(project, "../../../../private-mods/Automated-Research"),
);
const built = resolve(process.argv[3] ?? join(project, "build/mod"));
const props = (b) => b.items.filter((x) => x.kind === "property");
const sourceFiles = (root, folder = "common/scripted_effects") =>
  existsSync(join(root, folder))
    ? readdirSync(join(root, folder))
        .filter((x) => x.endsWith(".txt"))
        .sort()
        .map((x) => join(root, folder, x))
    : [];
function load(root, folder) {
  const map = new Map();
  for (const file of sourceFiles(root, folder)) {
    const parsed = parsePdx(readFileSync(file, "utf8"));
    assert.equal(parsed.diagnostics.length, 0, file);
    for (const p of props(parsed.document)) {
      assert.ok(!map.has(p.key.text), "Duplicate native definition " + p.key.text);
      map.set(p.key.text, p.value);
    }
  }
  return map;
}
const native = load(original),
  rewrite = load(built),
  nativeTriggers = load(original, "common/scripted_triggers"),
  rewriteTriggers = load(built, "common/scripted_triggers"),
  results = [];
let assertions = 0;
function equivalent(a, b, path = "state") {
  if (typeof a === "number" && typeof b === "number") {
    assert.ok(
      Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b)),
      `${path}: ${a} != ${b}`,
    );
    return;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    assert.equal(a.length, b.length, path + " length");
    for (let i = 0; i < a.length; i++) equivalent(a[i], b[i], path + "[" + i + "]");
    return;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), path + " keys");
    for (const key of Object.keys(a)) equivalent(a[key], b[key], path + "." + key);
    return;
  }
  assert.deepEqual(a, b, path);
}
function pair(setup = () => {}) {
  const a = new ResearchNativeMachine(native, nativeTriggers),
    b = new ResearchNativeMachine(rewrite, rewriteTriggers);
  setup(a, a.countries[0]);
  setup(b, b.countries[0]);
  return [a, b];
}
function projectState(m, arrays = [], vars = []) {
  const c = m.countries[0];
  return {
    arrays: Object.fromEntries(
      arrays.map((k) => [k, m.array(k, c).map((x) => (typeof x === "object" ? x.tag : x))]),
    ),
    vars: Object.fromEntries(vars.map((k) => [k, m.get(k, c)])),
    grants: [...m.grants],
  };
}
function check(name, setup, projection, pairs = 1) {
  const [a, b] = pair(setup);
  a.run(name);
  b.run(name);
  equivalent(projection(a), projection(b), name);
  assertions += pairs;
  return [a, b];
}
function group(name, fn) {
  const before = assertions;
  const start = Date.now();
  fn();
  results.push({ name, checks: assertions - before, milliseconds: Date.now() - start });
  console.log("PASS", name, assertions - before);
}
const ids = [];
for (let n = 1; n <= 552; n++) {
  const m = new ResearchNativeMachine(native);
  m.countries[0].vars.rq_t = n;
  m.run("rq_grant_tech");
  ids.push(m.grants[0]);
}
const id = (name) => {
  const i = ids.indexOf(name) + 1;
  assert.ok(i > 0, name);
  return i;
};
function queue(c, rows) {
  c.arrays.rq_queue = rows.map((x) => (typeof x === "number" ? x : x.id));
  c.arrays.rq_qprog = rows.map((x) => (typeof x === "number" ? 0 : (x.progress ?? 0)));
  c.arrays.rq_qmio = rows.map((x) => (typeof x === "number" ? 0 : (x.mio ?? 0)));
  c.arrays.rq_qsrc = rows.map((x) => (typeof x === "number" ? 0 : (x.source ?? 0)));
}
const queueArrays = ["rq_queue", "rq_qprog", "rq_qmio", "rq_qsrc", "rq_sp_t", "rq_sp_v"];

group("552 technology grants, costs, dates and prerequisite alternatives", () => {
  for (let n = 1; n <= 552; n++) {
    check(
      "rq_grant_tech",
      (m, c) => (c.vars.rq_t = n),
      (m) => m.grants,
    );
    check(
      "rq_tech_data",
      (m, c) => (c.vars.rq_t = n),
      (m) => projectState(m, [], ["rq_base_cost", "rq_start_months"]),
    );
    for (const ownership of [0, 1])
      check(
        "rq_parents_get",
        (m, c) => {
          c.vars.rq_t = n;
          if (ownership)
            ids.forEach((tech, i) => {
              if (i % 3 === 0) c.tech.add(tech);
            });
        },
        (m) => projectState(m, ["rq_pars"], ["rq_have"]),
      );
    check(
      "rq_first_parent",
      (m, c) => (c.vars.rq_t = n),
      (m) => projectState(m, [], ["rq_fp"]),
    );
  }
  for (const n of [-10, 0, 553, 10000])
    check(
      "rq_grant_tech",
      (m, c) => (c.vars.rq_t = n),
      (m) => m.grants,
    );
});
group("DLC branches and unavailable/owned technology gates", () => {
  const major = [
    "Man the Guns",
    "No Step Back",
    "By Blood Alone",
    "La Resistance",
    "Gotterdammerung",
  ];
  for (let mask = 0; mask < 32; mask++)
    check(
      "rq_dlc_scan",
      (m) =>
        major.forEach((dlc, i) => {
          if (mask & (1 << i)) m.dlcs.add(dlc);
        }),
      (m) => projectState(m, ["global.rq_vis", "global.rq_hid"]),
    );
  for (let n = 1; n <= 552; n++)
    for (let state = 0; state < 3; state++)
      check(
        "rq_check_available",
        (m, c) => {
          c.vars.rq_t = n;
          ids.forEach((tech, i) => {
            if (i % 5 === 0) c.tech.add(tech);
          });
          if (state === 1) c.cannotResearch.add(ids[n - 1]);
          if (state === 2) c.arrays["global.rq_hid"] = [];
          if (state === 2) m.global.arrays.rq_hid = [n];
        },
        (m) => projectState(m, [], ["rq_avail"]),
      );
  for (const n of [189, 215, 261, 485])
    for (const state of ["owned", "vanilla", "hidden"])
      check(
        "rq_check_blocked",
        (m, c) => {
          c.vars.rq_t = n;
          const peer = { 189: 215, 215: 189, 261: 485, 485: 261 }[n];
          if (state === "owned") c.tech.add(ids[peer - 1]);
          if (state === "vanilla") c.arrays.rq_vanilla = [peer];
          if (state === "hidden") m.global.arrays.rq_hid = [n];
        },
        (m) => projectState(m, [], ["rq_dead"]),
      );
});
group("row insertion, removal, movement and progress restoration", () => {
  const [a, b] = pair((m, c) => queue(c, [{ id: 4, progress: 35, mio: 0, source: 0 }, 5, 6]));
  for (const [effect, input] of [
    ["rq_q_remove_at", { rq_qi: 0 }],
    ["rq_q_insert_at", { rq_qi: 1, rq_ins_t: 4, rq_ins_p: 0, rq_ins_m: 0, rq_ins_s: 0 }],
    ["rq_q_move", { rq_qi: 1, rq_qj: 0 }],
    ["rq_set_prog", { rq_qi: 0, rq_val: 40.5 }],
    ["rq_q_remove_at", { rq_qi: 0 }],
    ["rq_q_insert_at", { rq_qi: 100, rq_ins_t: 4, rq_ins_p: 12, rq_ins_m: 0, rq_ins_s: 0 }],
  ]) {
    for (const m of [a, b]) {
      Object.assign(m.countries[0].vars, input);
      m.run(effect);
    }
    equivalent(projectState(a, queueArrays), projectState(b, queueArrays), effect);
    assertions++;
  }
  assert.equal(b.countries[0].arrays.rq_qprog.at(-1), 40.5);
});
group("prerequisite chain insertion, alternative parents and dependency repair", () => {
  for (const rows of [[6], [6, 226, 4, 5], [49, 66], [49, 295], [47, 57]])
    check(
      "rq_prereqs",
      (m, c) => {
        queue(c, rows);
        c.vars.rq_t = rows[0];
        c.vars.rq_pp = 0;
      },
      (m) => projectState(m, [...queueArrays, "rq_added"]),
    );
  for (const rows of [
    [6, 5, 4, 226],
    [49, 66],
    [47, 57],
    [226, 6, 4, 5],
  ])
    check(
      "rq_fix_order",
      (m, c) => {
        queue(c, rows);
        c.vars.rq_rows_v = 1;
        c.vars.rq_fx_v = -1;
      },
      (m) => projectState(m, queueArrays),
    );
  for (const rows of [
    [4, 5, 6],
    [226, 5, 6],
    [189, 215],
    [49, 66],
  ])
    check(
      "rq_prune",
      (m, c) => queue(c, rows),
      (m) => projectState(m, queueArrays),
    );
  check(
    "rq_xor_sweep",
    (m, c) => {
      queue(c, [189, 215]);
      c.arrays.rq_added = [215];
    },
    (m) => projectState(m, queueArrays),
  );
});
group("1040 national idea modifiers and research sharing", () => {
  const ideas = props(native.get("rq_cat_bonus"))
    .filter((x) => x.key.text === "if")
    .map((x) => props(props(x.value)[0].value)[0].value.text);
  for (const idea of ideas)
    check(
      "rq_cat_bonus",
      (m, c) => c.ideas.add(idea),
      (m) =>
        Object.fromEntries(
          Object.entries(m.countries[0].vars).filter(([k]) => k.startsWith("rq_cb_")),
        ),
    );
  check(
    "rq_cat_bonus",
    (m, c) => ideas.forEach((idea) => c.ideas.add(idea)),
    (m) =>
      Object.fromEntries(
        Object.entries(m.countries[0].vars).filter(([k]) => k.startsWith("rq_cb_")),
      ),
  );
  for (const name of ["AFG_SOV_tech_sharing_group", "ARG_italian_argentine_tech_sharing_group"]) {
    const [a, b] = check(
      "rq_share_scan",
      (m, c) => {
        c.groups.add(name);
        m.countries[1].groups.add(name);
        c.vars["modifier@research_sharing_per_country_bonus_factor"] = 0.2;
      },
      (m) => projectState(m, ["rq_shm"], ["rq_shp"]),
    );
    for (const m of [a, b]) {
      m.countries[0].vars.rq_t = 4;
      m.countries[1].tech.add("CAS1");
      m.run("rq_tech_share");
    }
    equivalent(projectState(a, [], ["rq_tsh"]), projectState(b, [], ["rq_tsh"]));
    assertions++;
  }
});
group("ahead-of-time cost and decreasing-penalty days estimator", () => {
  for (const n of [4, 5, 6, 37, 189, 552])
    for (const year of [1936, 1940, 1944])
      check(
        "rq_compute_cost",
        (m, c) => {
          Object.assign(c.vars, {
            rq_t: n,
            rq_now_y: year,
            rq_now_doy: 150,
            rq_bn_for: n,
            rq_lbv_c: 0,
            rq_lba_c: 0,
          });
        },
        (m) => projectState(m, [], ["rq_base_cost", "rq_ya0", "rq_ya", "rq_ahead", "rq_cost"]),
      );
  for (const remaining of [0.1, 1, 50, 219.8])
    for (const ahead of [0, 0.1, 1, 4])
      for (const speed of [0.1, 1, 2.5])
        check(
          "rq_days_left",
          (m, c) =>
            Object.assign(c.vars, { rq_r: remaining, rq_ya: ahead, rq_spd: speed, rq_vdl: 0 }),
          (m) => projectState(m, [], ["rq_x"]),
        );
});
group("daily lanes, native slot reservation, completion and idle banking", () => {
  const first = id("early_fighter"),
    second = id("basic_machine_tools");
  for (const test of [
    { slots: 1, native: [], progress: 0 },
    { slots: 2, native: [first], progress: 0 },
    { slots: 0, native: [], progress: 0 },
    { slots: 2, native: [], progress: 109.8 },
    { slots: 2, native: [], progress: 0, noProgress: 1 },
  ])
    check(
      "rq_lanes",
      (m, c) => {
        queue(c, [{ id: first, progress: test.progress }, second]);
        c.arrays.rq_vanilla = test.native;
        Object.assign(c.vars, {
          rq_slots: test.slots,
          rq_now_y: 1936,
          rq_now_doy: 0,
          rq_speed_shown: 1,
          rq_no_progress: test.noProgress ?? 0,
        });
      },
      (m) =>
        projectState(
          m,
          ["rq_queue", "rq_qprog", "rq_qmio", "rq_qsrc", "rq_active", "rq_lb"],
          ["rq_lanes_n", "rq_st_nq", "rq_st_days", "rq_st_qd", "rq_st_waste"],
        ),
    );
  const [a, b] = pair((m, c) => {
    queue(c, []);
    Object.assign(c.vars, { rq_slots: 2, rq_now_y: 1936, rq_speed_shown: 1 });
  });
  for (let day = 0; day < 35; day++) {
    for (const m of [a, b]) m.run("rq_lanes");
    equivalent(
      projectState(a, ["rq_lb"], ["rq_st_waste"]),
      projectState(b, ["rq_lb"], ["rq_st_waste"]),
    );
    assertions++;
  }
  for (const m of [a, b]) {
    queue(m.countries[0], [first, second]);
    m.run("rq_lanes");
  }
  equivalent(
    projectState(a, ["rq_queue", "rq_qprog", "rq_active", "rq_lb"]),
    projectState(b, ["rq_queue", "rq_qprog", "rq_active", "rq_lb"]),
  );
  assertions++;
  assert.equal(b.countries[0].arrays.rq_qprog[0], 31);
});
group("experience purchases are paid once and breakthroughs respect DLC/pause", () => {
  for (const n of [39, 131, 289, 458, 462, 479])
    for (const xp of [0, 49, 50, 74, 75, 200])
      check(
        "rq_xp_tick",
        (m, c) => {
          c.arrays.rq_active = [n];
          c.xp = xp;
          c.vars.rq_ap_xpf = 2;
        },
        (m) => ({ state: projectState(m, ["rq_xpb"]), xp: m.countries[0].xp }),
      );
  const [a, b] = pair((m, c) => {
    c.arrays.rq_active = [39];
    c.xp = 200;
    c.vars.rq_ap_xpf = 2;
  });
  for (let i = 0; i < 3; i++) {
    a.run("rq_xp_tick");
    b.run("rq_xp_tick");
    equivalent(
      { state: projectState(a, ["rq_xpb"]), xp: a.countries[0].xp },
      { state: projectState(b, ["rq_xpb"]), xp: b.countries[0].xp },
    );
    assertions++;
  }
  assert.equal(b.countries[0].xp, 150);
  for (const enabled of [false, true])
    for (const paused of [0, 1])
      for (const n of [4, 24, 37, 110, 552])
        check(
          "rq_bt_tick",
          (m, c) => {
            if (enabled) m.dlcs.add("Gotterdammerung");
            c.arrays.rq_active = [n];
            c.vars.rq_no_progress = paused;
          },
          (m) => ({
            breakthroughs: m.breakthroughs,
            state: projectState(m, [], ["rq_bt_air", "rq_bt_land", "rq_bt_naval", "rq_bt_nuclear"]),
          }),
        );
});
group("settings defaults, bounds and stable queue view sorting", () => {
  check(
    "rq_ap_defaults",
    () => {},
    (m) =>
      projectState(
        m,
        [],
        [
          "rq_ap_cap",
          "rq_ap_days",
          "rq_ap_ldays",
          "rq_ap_gl",
          "rq_ap_gn",
          "rq_ap_ga",
          "rq_ap_gi",
          "rq_ap_jumpf",
          "rq_ap_miof",
          "rq_ap_jgf",
          "rq_ap_xpf",
        ],
      ),
  );
  for (let key = 1; key <= 7; key++)
    for (const delta of [-1000, 1, 1000])
      check(
        "rq_aps_change",
        (m, c) =>
          Object.assign(c.vars, {
            rq_apk: key,
            rq_apd: delta,
            rq_ap_cap: 6,
            rq_ap_days: 70,
            rq_ap_ldays: 60,
            rq_ap_gl: 1,
            rq_ap_gn: 1,
            rq_ap_ga: 1,
            rq_ap_gi: 1,
            rq_ap_last: 5,
          }),
        (m) =>
          projectState(
            m,
            [],
            [
              "rq_ap_cap",
              "rq_ap_days",
              "rq_ap_ldays",
              "rq_ap_gl",
              "rq_ap_gn",
              "rq_ap_ga",
              "rq_ap_gi",
              "rq_ap_next",
            ],
          ),
      );
  for (const order of [1, 2, 3])
    check(
      "rq_sort_view",
      (m, c) => {
        queue(c, [4, 5, 6, 37]);
        c.arrays.rq_view = [0, 1, 2, 3];
        c.arrays.rq_qdays = [9, 2, 9, 5];
        c.vars.rq_sortt_f = order;
      },
      (m) => projectState(m, ["rq_view"]),
    );
  for (const mode of [0, 1, 2, 3, 4])
    check(
      "rq_view_cap",
      (m, c) => {
        c.arrays.rq_view = Array.from({ length: 110 }, (_, i) => i);
        c.arrays.rq_qst = Array.from({ length: 110 }, (_, i) => (i === 108 ? 2 : 4));
        c.vars.rq_vcm = mode;
      },
      (m) => projectState(m, ["rq_vshow"], ["rq_vcf"]),
    );
});
group("v3 cross-game stream, names, MIO palettes and DLC compatibility", () => {
  for (const test of [
    { picks: [4, 5, 6], mio: [0, 0, 0], name: [43, 21, 5, 21, 5, 63, 54] },
    { picks: [1, 34, 552, 189], mio: [1, 525, 1, 0], name: [1, 2, 3] },
    {
      picks: Array.from({ length: 63 }, (_, i) => i + 1),
      mio: Array.from({ length: 63 }, (_, i) => i % 16),
      name: Array.from({ length: 24 }, (_, i) => i + 1),
    },
  ]) {
    const [a, b] = check(
      "rq_stream_put",
      (m, c) => {
        c.arrays.rq_bits = Array(8192).fill(0);
        c.arrays.rq_wp = test.picks;
        c.arrays.rq_wpm = test.mio;
        c.arrays.rq_tx_n = test.name;
        c.vars.rq_fc = 42;
        m.dlcs.add("No Step Back");
      },
      (m) => ({
        flags: [...m.global.flags].sort(),
        state: projectState(m, ["rq_bits"], ["rq_bend", "rq_pid", "rq_bsaves"]),
      }),
    );
    for (const m of [a, b]) m.run("rq_stream_load");
    equivalent(
      projectState(
        a,
        [
          "rq_svq",
          "rq_svm",
          "rq_svlen",
          "rq_svf",
          "rq_svpid",
          "rq_svok",
          "rq_svva",
          "rq_svvb",
          "rq_svvc",
          "rq_nm0",
          "rq_sd6",
        ],
        ["rq_bend"],
      ),
      projectState(
        b,
        [
          "rq_svq",
          "rq_svm",
          "rq_svlen",
          "rq_svf",
          "rq_svpid",
          "rq_svok",
          "rq_svva",
          "rq_svvb",
          "rq_svvc",
          "rq_nm0",
          "rq_sd6",
        ],
        ["rq_bend"],
      ),
    );
    assertions++;
    // Feed source-written achievements into a fresh rewrite process.
    const reader = new ResearchNativeMachine(rewrite);
    reader.achievements = new Set(a.global.flags);
    reader.dlcs.add("No Step Back");
    reader.run("rq_stream_load");
    equivalent(reader.countries[0].arrays.rq_svq, test.picks);
    equivalent(reader.countries[0].arrays.rq_svm, test.mio);
    assertions++;
    reader.countries[0].vars.rq_lsi = 0;
    reader.run("rq_sv_delete");
    const afterDelete = new ResearchNativeMachine(rewrite);
    afterDelete.achievements = new Set([...reader.achievements, ...reader.global.flags]);
    afterDelete.dlcs.add("No Step Back");
    afterDelete.run("rq_stream_load");
    assert.equal(afterDelete.array("rq_svlen", afterDelete.countries[0]).length, 0);
    assertions++;
    const incompatible = new ResearchNativeMachine(rewrite);
    incompatible.achievements = new Set(a.global.flags);
    incompatible.run("rq_stream_load");
    assert.deepEqual(incompatible.countries[0].arrays.rq_svok, [0]);
    assertions++;
  }
});
group("255 AI policy queries and all technology preference weights", () => {
  const key = (x) => x?.key?.text,
    items = (x) => x?.value?.items ?? [];
  function leaves(a) {
    if (
      a.length === 2 &&
      key(a[0]) === "if" &&
      key(a[1]) === "else" &&
      key(items(items(a[0])[0])[0]) === "check_variable" &&
      key(items(items(items(a[0])[0])[0])[0]) === "rq_t"
    )
      return [...leaves(items(a[0]).slice(1)), ...leaves(items(a[1]))];
    return [a];
  }
  const brief = (x) =>
    x.value.kind === "block" ? [key(x), items(x).map(brief)] : [key(x), x.operator, x.value.text];
  const rows = leaves(props(native.get("rq_ap_weigh")).slice(2, 4)),
    policies = [];
  const seen = new Set();
  for (const row of rows)
    for (const action of row)
      if (key(action) === "if") {
        const condition = items(action)[0].value,
          signature = JSON.stringify(props(condition).map(brief));
        if (!seen.has(signature)) {
          seen.add(signature);
          policies.push(condition);
        }
      }
  assert.equal(policies.length, 255);
  const factors = [...new Set(JSON.stringify(rows).match(/rq_ap[nf]_[A-Za-z0-9_]+/g))];
  const tags = ["GER", "SOV", "USA", "ENG", "JAP", "FRA", "ITA", "CHI", "PRC", "HOL", "BRA", "TST"];
  const setup = (fixture) => (m, c) => {
    c.tag = tags[fixture % tags.length];
    c.originalTag = c.tag;
    c.major = fixture % 3 !== 0;
    c.atWar = fixture % 2 === 1;
    for (const tag of [
      "GER",
      "SOV",
      "USA",
      "ENG",
      "JAP",
      "FRA",
      "ITA",
      "CHI",
      "PRC",
      "HOL",
      "BRA",
      "CZE",
      "POL",
    ])
      if (!m.countries.some((q) => q.tag === tag)) m.countries.push(m.country(tag));
    c.enemies = new Set(fixture % 2 ? ["GER", "SOV", "USA", "ENG", "JAP"] : []);
    c.intelArmor = { GER: 36, SOV: 33, USA: 31, ENG: 28, JAP: 26 };
    c.engine = {
      num_of_military_factories: [0, 6, 15, 49, 51, 100, 151][fixture % 7],
      num_of_naval_factories: fixture * 5,
      num_of_factories: fixture * 11,
      energy_ratio: fixture % 2 ? 0.8 : 1,
      surrender_progress: fixture % 2 ? 0.09 : 0.2,
    };
    c.resources = { oil: fixture * 3, rubber: fixture * 2, coal: fixture, steel: fixture };
    c.imports = { coal: fixture % 2 };
    c.aircraft = {
      cas: fixture * 90,
      tactical_bomber: fixture * 100,
      strategic_bomber: fixture * 80,
      naval_bomber: fixture * 120,
    };
    c.navy = { carrier: fixture % 5, all: fixture * 4 };
    c.controlledStates = fixture % 3 ? [{ coastal: true }] : [];
    c.ownedStates = c.controlledStates;
    c.government = fixture % 2 ? "fascism" : "democratic";
    c.templates = new Set(
      [
        "light_sp_artillery_brigade",
        "medium_sp_artillery_brigade",
        "medium_tank_destroyer_brigade",
        "light_tank_destroyer_brigade",
      ].filter((_, i) => i % 2 === fixture % 2),
    );
    c.focuses = new Set(
      [
        "GER_expand_kummersdorfs_capacity",
        "GER_advanced_panzer_research",
        "GER_anschluss",
        "GER_fallschirmjager",
        "PHI_weapons_of_war",
      ].filter((_, i) => (i + fixture) % 3 === 0),
    );
    c.techBonuses = new Set(fixture % 2 ? ["cat_medium_armor", "cat_heavy_armor"] : []);
    c.opinions = new Set(fixture % 2 ? ["sov_ger_treaty"] : []);
    for (const target of m.countries) {
      target.ai = fixture % 2 === 0;
      if (target.tag === "CHI") {
        target.capitulated = fixture % 3 === 0;
        target.subjectOf = fixture % 3 === 1 ? "JAP" : undefined;
      }
      if (target.tag === "POL") target.capitulated = fixture % 2 === 1;
      if (target.tag === "GER") {
        target.enemies = new Set(fixture % 2 ? ["SOV"] : []);
        target.atWar = fixture % 2 === 1;
      }
    }
    ids.forEach((tech, i) => {
      if ((i + fixture) % 7 === 0) c.tech.add(tech);
      if ((i + fixture) % 13 === 0) c.researching.add(tech);
      if ((i + fixture) % 5 === 0) c.cannotResearch.add(tech);
    });
    m.historical = fixture % 2 === 0;
    m.date = 1936 + (fixture % 12) + "." + ((fixture % 12) + 1) + "." + ((fixture % 27) + 1);
    m.externalTriggers = new Set(
      fixture % 2 ? ["anti_submarine_strategy_required_trigger", "phi_sea"] : [],
    );
    for (const [i, factor] of factors.entries()) c.vars[factor] = (((i + fixture) % 5) - 2) * 50;
    for (const name of [
      "nav",
      "air",
      "tank",
      "art",
      "at",
      "aa",
      "mot",
      "para",
      "mar",
      "mnt",
      "rng",
      "oil",
      "rub",
      "wland",
      "wair",
      "wsea",
      "ind",
      "gl",
      "gn",
      "ga",
      "gi",
    ])
      c.vars["rq_ap_" + name] = [0, 0.5, 1, 1.3, 2][(fixture + name.length) % 5];
  };
  for (let fixture = 0; fixture < 24; fixture++) {
    const [a, b] = pair(setup(fixture));
    for (let i = 0; i < policies.length; i++) {
      assert.equal(
        a.condition(policies[i], a.countries[0]),
        b.condition(rewriteTriggers.get("rq_policy_" + (i + 1)), b.countries[0]),
        "policy " + (i + 1) + " fixture " + fixture,
      );
      assertions++;
    }
    if (fixture < 12)
      for (let n = 1; n <= 552; n++) {
        for (const m of [a, b]) {
          m.countries[0].vars.rq_t = n;
          m.run("rq_ap_weigh");
        }
        equivalent(
          projectState(a, [], ["rq_ap_w", "rq_ap_n"]),
          projectState(b, [], ["rq_ap_w", "rq_ap_n"]),
          "AI weight " + n + " fixture " + fixture,
        );
        assertions++;
      }
  }
});
group("automatic planner selection, priority ancestry and manual ownership", () => {
  const apRecords = [
    "rq_ap_pr",
    "rq_ap_set",
    "rq_ap_sc",
    "rq_ap_aw",
    "rq_ap_af",
    "rq_ap_ab",
    "rq_ap_an",
  ];
  for (const priorities of [[], [6], [49, 6], [215, 189]])
    check(
      "rq_ap_pri_prep",
      (m, c) => {
        c.arrays.rq_ap_pri = priorities;
      },
      (m) => projectState(m, ["rq_ap_pri", "rq_ap_pb", "rq_jgl"], ["rq_ap_prin"]),
    );
  for (const rows of [
    [226, 4, 5, 6],
    [189, 215],
    [34, 37, 226],
  ]) {
    check(
      "rq_ap_claim",
      (m, c) => {
        queue(c, rows);
        c.vars.rq_t = rows.at(-1);
        for (const col of apRecords) c.arrays[col] = [...rows];
      },
      (m) => projectState(m, apRecords),
    );
    check(
      "rq_ap_drop",
      (m, c) => {
        queue(c, rows);
        for (const col of apRecords) c.arrays[col] = [...rows];
      },
      (m) => projectState(m, [...queueArrays, ...apRecords]),
    );
  }
  for (const slotCount of [0, 1, 4])
    check(
      "rq_ap_run",
      (m, c) => {
        Object.assign(c.vars, {
          rq_slots: slotCount,
          rq_now_y: 1936,
          rq_now_doy: 0,
          rq_now_months: 23232,
          rq_speed_shown: 1,
          rq_bn_for: -1,
        });
        m.global.vars.num_days = 20;
      },
      (m) =>
        projectState(
          m,
          [...queueArrays, ...apRecords],
          ["rq_ap_last", "rq_ap_next", "rq_ap_lopen", "rq_ap_runs"],
        ),
    );
});
group("priority lane borrowing, lock rules, bank cap and queue edits", () => {
  const first = id("early_fighter"),
    second = id("basic_machine_tools"),
    third = id("electronic_mechanical_engineering");
  const arrays = [
    "rq_queue",
    "rq_qprog",
    "rq_active",
    "rq_bu_t",
    "rq_bu_v",
    "rq_jg_r",
    "rq_jg_d",
    "rq_jg_u",
    "rq_jg_fire",
    "rq_jga",
    "rq_jgr",
    "rq_jgx",
    "rq_jg_el",
    "rq_jg_prev",
  ];
  for (const locked of [false, true])
    for (const used of [0, 20, 30])
      for (const age of [0, 9, 29])
        for (const paused of [0, 1])
          check(
            "rq_lanes",
            (m, c) => {
              queue(c, [{ id: first, progress: 5 }, second, third]);
              c.flags.add("rq_ap_on");
              if (locked) m.rules.rq_lock_slots = "ON";
              Object.assign(c.vars, {
                rq_ap_jgf: 2,
                rq_slots: 3,
                rq_now_y: 1936,
                rq_now_doy: 0,
                rq_speed_shown: 1,
                rq_no_progress: paused,
              });
              c.arrays.rq_jgl = [first];
              c.arrays.rq_bu_t = [first];
              c.arrays.rq_bu_v = [used];
              if (age > 0) {
                c.arrays.rq_jg_r = [first];
                c.arrays.rq_jg_d = [age];
              }
            },
            (m) => projectState(m, arrays, ["rq_st_days", "rq_st_qd", "rq_st_save"]),
          );
  for (const locked of [false, true]) {
    const [a, b] = pair((m, c) => {
      queue(c, [first, second, third]);
      c.flags.add("rq_ap_on");
      if (locked) m.rules.rq_lock_slots = "ON";
      Object.assign(c.vars, {
        rq_ap_jgf: 2,
        rq_slots: 3,
        rq_now_y: 1936,
        rq_now_doy: 0,
        rq_speed_shown: 1,
      });
      c.arrays.rq_jgl = [first];
    });
    for (let day = 0; day < 40; day++) {
      a.run("rq_lanes");
      b.run("rq_lanes");
      equivalent(
        projectState(a, arrays),
        projectState(b, arrays),
        "borrow day " + day + " locked " + locked,
      );
      assertions++;
    }
  }
  for (const only of [0, first]) {
    const [a, b] = pair((m, c) => {
      queue(c, [first, second, third]);
      c.arrays.rq_jg_r = [first, second];
      c.arrays.rq_jg_d = [5, 7];
      c.vars.rq_jg_only = only;
    });
    for (const m of [a, b]) {
      m.run("rq_jg_snap");
      m.countries[0].arrays.rq_jg_sr = [...m.array("rq_jg_sr", m.countries[0])];
      m.countries[0].vars.rq_qi = 0;
      m.countries[0].vars.rq_qj = 2;
      m.run("rq_q_move");
      m.run("rq_jg_follow");
    }
    equivalent(projectState(a, ["rq_queue", "rq_jg_r"]), projectState(b, ["rq_queue", "rq_jg_r"]));
    assertions++;
  }
});
group("legacy streams, append limits and actual save clicks", () => {
  const saves = [
    "rq_svq",
    "rq_svm",
    "rq_svlen",
    "rq_svpid",
    "rq_svf",
    "rq_svtag",
    "rq_svx",
    "rq_svok",
    "rq_svva",
    "rq_svvb",
    "rq_svvc",
    "rq_nm0",
    "rq_nm1",
    "rq_nm23",
  ];
  function record(version, deleted = 0) {
    const bits = [],
      put = (value, width) => {
        for (let i = 0; i < width; i++) bits.push((value >> i) & 1);
      };
    put(1, 1);
    put(deleted, 1);
    put(533, 10);
    if (version === 2) put(31, 5);
    put(2, 5);
    put(27, 7);
    put(54, 7);
    put(42, 11);
    put(3, 6);
    for (const n of [4, 49, 552]) put(n, 10);
    if (version === 2) {
      put(2, 4);
      put(525, 10);
      put(7, 10);
      for (const n of [1, 0, 2]) put(n, 2);
    }
    return bits;
  }
  for (const version of [1, 2])
    for (const deleted of [0, 1])
      check(
        "rq_stream_load",
        (m) => {
          const bits = record(version, deleted);
          m.achievements = new Set(bits.flatMap((bit, i) => (bit ? ["rq_b" + i] : [])));
        },
        (m) => projectState(m, saves, ["rq_bend"]),
      );
  check(
    "rq_stream_load",
    (m) => {
      const bits = [...record(1), ...record(2, 1), ...record(2)];
      m.achievements = new Set(bits.flatMap((bit, i) => (bit ? ["rq_b" + i] : [])));
    },
    (m) => projectState(m, saves, ["rq_bend"]),
  );
  check(
    "rq_stream_put",
    (m, c) => {
      c.vars.rq_bend = 8190;
      c.arrays.rq_bits = Array(8192).fill(0);
      c.arrays.rq_wp = [4];
      c.arrays.rq_wpm = [525];
      c.arrays.rq_tx_n = [27];
    },
    (m) => ({
      state: projectState(m, ["rq_bits"], ["rq_bend", "rq_pid"]),
      flags: [...m.global.flags],
    }),
  );
  const [a, b] = pair((m, c) => {
    queue(c, [226, 4, 5, 6, 157]);
    c.arrays.rq_bits = Array(8192).fill(0);
  });
  for (let click = 0; click < 2; click++) {
    a.run("rq_save_do");
    b.run("rq_save_do");
    equivalent(
      projectState(a, saves, ["rq_msg", "rq_bend"]),
      projectState(b, saves, ["rq_msg", "rq_bend"]),
    );
    assertions++;
  }
  assert.equal(b.countries[0].vars.rq_msg, 13);
  assert.equal(b.countries[0].arrays.rq_svlen.length, 1);
  check(
    "rq_save_do",
    (m, c) => {
      queue(c, []);
    },
    (m) => projectState(m, saves, ["rq_msg"]),
  );
  check(
    "rq_save_do",
    (m, c) => {
      queue(c, [226]);
      c.arrays.rq_svlen = Array(30).fill(0);
    },
    (m) => projectState(m, saves, ["rq_msg"]),
  );
});
group("calendar extraction and 1936/1939 or out-of-range starts", () => {
  const tick = props(native.get("rq_tick"));
  function containsDate(block) {
    return props(block).some(
      (p) =>
        p.key.text.toLowerCase() === "date" || (p.value.kind === "block" && containsDate(p.value)),
    );
  }
  const start = tick.findIndex(
    (p) =>
      p.key.text === "if" &&
      containsDate(props(p.value).find((q) => q.key.text === "limit")?.value),
  );
  const end = tick.findIndex(
    (p, i) =>
      i > start &&
      p.key.text === "set_temp_variable" &&
      props(p.value)[0]?.key.text === "rq_bn_for",
  );
  assert.ok(start > 0 && end > start);
  const calendarBody = { ...native.get("rq_tick"), items: tick.slice(start, end) };
  for (const date of [
    "1899.12.31",
    "1900.1.1",
    "1936.1.1",
    "1936.2.28",
    "1939.9.1",
    "1940.2.29",
    "1942.12.31",
    "1960.12.1",
    "1961.1.1",
  ])
    for (const globalDay of [0, 59, 243, 730, 12345])
      for (const paused of [0, 1]) {
        const [a, b] = pair((m, c) => {
          m.date = date;
          m.global.vars.num_days = globalDay;
          Object.assign(c.vars, { rq_dom: 8, rq_dom_m: 1936 * 12, rq_no_progress: paused });
        });
        a.execute(calendarBody, a.countries[0]);
        b.run("rq_calendar");
        equivalent(
          projectState(a, [], ["rq_now_months", "rq_now_y", "rq_now_doy", "rq_dom", "rq_dom_m"]),
          projectState(b, [], ["rq_now_months", "rq_now_y", "rq_now_doy", "rq_dom", "rq_dom_m"]),
          "calendar " + date + " day " + globalDay,
        );
        assertions++;
      }
});
group("player tree and row handlers up to their refresh boundary", () => {
  const rows = [226, 4, 5, 6, 157, 236];
  function fixture(m, c) {
    m.effectBoundaries = new Set(["rq_update"]);
    queue(c, rows);
    c.arrays.rq_vanilla = [226];
    c.arrays.rq_active = [4, 157];
    c.arrays.rq_view = [0, 1, 2, 3, 4, 5];
    c.arrays.rq_qst = [1, 2, 4, 4, 2, 3];
    Object.assign(c.vars, { rq_sortn_f: 1, rq_sortt_f: 1 });
  }
  const projection = (m) => ({
    state: projectState(m, [...queueArrays, "rq_ap_set", "rq_ap_ban", "rq_jg_r"], ["rq_ml_t"]),
    refreshCalls: m.boundaryCalls,
  });
  for (let row = 0; row < rows.length; row++)
    for (const direction of [-2, -1, 1, 2])
      for (const grouped of [0, 1])
        check(
          "rq_row_move",
          (m, c) => {
            fixture(m, c);
            Object.assign(c.vars, { rq_k: row, rq_dir: direction, rq_grp_on: grouped });
          },
          projection,
        );
  for (let row = 1; row < rows.length; row++)
    for (const locked of [false, true])
      check(
        "rq_row_remove",
        (m, c) => {
          fixture(m, c);
          c.vars.rq_k = row;
          c.arrays.rq_ap_set = [4, 157];
          if (locked) m.rules.rq_lock_slots = "ON";
        },
        projection,
      );
  for (const technology of [4, 6, 157, 498])
    for (const top of [0, 1])
      for (const locked of [false, true])
        check(
          "rq_tree_click",
          (m, c) => {
            fixture(m, c);
            Object.assign(c.vars, { rq_t: technology, rq_top: top, rq_mopen: 0 });
            if (locked) m.rules.rq_lock_slots = "ON";
          },
          projection,
        );
  for (const locked of [false, true])
    check(
      "rq_clr_all",
      (m, c) => {
        fixture(m, c);
        c.arrays.rq_ap_set = [4, 157];
        if (locked) m.rules.rq_lock_slots = "ON";
      },
      projection,
    );
});
group("complete daily engine and repeated paused refreshes", () => {
  const first = id("early_fighter"),
    second = id("basic_machine_tools");
  const projection = (m) =>
    projectState(
      m,
      [
        ...queueArrays,
        "rq_active",
        "rq_vanilla",
        "rq_lb",
        "rq_atk",
        "rq_atv",
        "rq_ata",
        "rq_bu_t",
        "rq_bu_v",
      ],
      [
        "rq_slots",
        "rq_now_months",
        "rq_now_y",
        "rq_now_doy",
        "rq_st_days",
        "rq_st_qd",
        "rq_st_nq",
        "rq_st_ns",
        "rq_st_save",
        "rq_speed_shown",
      ],
    );
  for (const nativeSlot of [false, true]) {
    const [a, b] = pair((m, c) => {
      queue(c, [first, second]);
      c.vars.rq_build = 6895;
      c.vars.rq_bank = 1;
      c.flags.add("rq_active");
      if (nativeSlot) c.researching.add("early_fighter");
    });
    for (let day = 0; day < 5; day++) {
      for (const m of [a, b]) {
        m.global.vars.num_days = day;
        m.date = "1936.1." + (day + 1);
        m.run("rq_tick");
      }
      equivalent(projection(a), projection(b), "daily engine " + day + " native " + nativeSlot);
      assertions++;
      const before = b.countries[0].arrays.rq_qprog.slice();
      for (let click = 0; click < 3; click++) {
        a.run("rq_update");
        b.run("rq_update");
        equivalent(projection(a), projection(b), "paused refresh " + click + " day " + day);
        assertions++;
      }
      equivalent(b.countries[0].arrays.rq_qprog, before, "refresh never advances research");
    }
  }
});
const hash = (root) => {
  const h = createHash("sha256");
  for (const f of sourceFiles(root)) h.update(readFileSync(f));
  return h.digest("hex");
};
const report = {
  schemaVersion: 1,
  originalEffectsSha256: hash(original),
  builtEffectsSha256: hash(built),
  checks: assertions,
  groups: results,
  scope:
    "Independent native PDX execution against the uploaded original; projected states are specified by cases/verify.mjs. Not an HOI4 engine run or full equivalence certification.",
  unproved: [
    "MIO selection, assignment, upkeep and bonus lifecycle in organization-aware fixtures",
    "National-focus one-use bonus discovery, reservation and consumption in focus-aware fixtures",
    "Original native technology-tree replacement layout and icon variants",
    "In-game renderer, full saved-game migration, engine loop budget and multiplayer behavior",
  ],
};
writeFileSync(join(project, "cases/verification.json"), JSON.stringify(report, null, 2) + "\n");
console.log("Verified", assertions, "checks in", results.length, "groups.");
