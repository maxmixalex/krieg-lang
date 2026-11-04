import assert from "node:assert/strict";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePdx } from "../../../../dist/pdx/index.js";
import { ResearchNativeMachine } from "./native-machine.mjs";
const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const original = resolve(
  process.argv.slice(2).find((x) => !x.startsWith("--")) ??
    join(project, "../../../../private-mods/Automated-Research"),
);
const built = join(project, "build/mod");
const props = (b) => (b?.items ?? []).filter((x) => x.kind === "property");
const field = (b, k) => props(b).find((x) => x.key.text === k)?.value;
const atom = (b, k) => field(b, k)?.text;
function files(root, folder, ext) {
  return readdirSync(join(root, folder), { recursive: true })
    .filter((x) => x.endsWith(ext))
    .sort()
    .map((x) => join(root, folder, x));
}
function documents(root, folder, ext) {
  return files(root, folder, ext).map((file) => {
    const p = parsePdx(readFileSync(file, "utf8"));
    assert.equal(p.diagnostics.length, 0, file);
    return p.document;
  });
}
function definitions(root, folder, wrapper) {
  const result = new Map();
  for (const d of documents(root, folder, ".txt"))
    for (const p of props(wrapper ? field(d, wrapper) : d)) result.set(p.key.text, p.value);
  return result;
}
function localisations(root) {
  const result = new Map();
  for (const d of documents(root, "common/scripted_localisation", ".txt"))
    for (const p of props(d)) {
      assert.equal(p.key.text, "defined_text");
      const name = atom(p.value, "name");
      assert.ok(!result.has(name), "duplicate " + name);
      result.set(
        name,
        props(p.value)
          .filter((x) => x.key.text === "text")
          .map((x) => x.value),
      );
    }
  return result;
}
const nativeEffects = definitions(original, "common/scripted_effects");
const rewriteEffects = definitions(built, "common/scripted_effects");
const aLoc = localisations(original),
  bLoc = localisations(built);
const strings = new Map();
for (const file of files(original, "localisation/english", ".yml"))
  for (const l of readFileSync(file, "utf8").split("\n")) {
    const m = l.match(/^\s*([^#\s:]+):(?:\d+)?\s*"(.*)"\s*$/);
    if (m) strings.set(m[1], m[2]);
  }
function selected(map, name, m, depth = 0) {
  assert.ok(depth < 32, "localisation cycle");
  const choices = map.get(name);
  assert.ok(choices, "missing getter " + name);
  const c = m.countries[0];
  for (const choice of choices) {
    const trigger = field(choice, "trigger");
    if (!trigger || m.condition(trigger, c)) {
      const key = atom(choice, "localisation_key");
      const wrapper = strings.get(key)?.match(/^\[([a-zA-Z0-9_]+)\]$/);
      return wrapper && map.has(wrapper[1]) ? selected(map, wrapper[1], m, depth + 1) : key;
    }
  }
  return "";
}
let checks = 0;
const groups = [];
function group(name, fn) {
  const begin = checks,
    time = Date.now();
  fn();
  groups.push({ name, checks: checks - begin, milliseconds: Date.now() - time });
  console.log("PASS", name, checks - begin);
}
function compareLabel(name, setup) {
  const m = new ResearchNativeMachine(nativeEffects);
  setup?.(m, m.countries[0]);
  assert.equal(
    selected(bLoc, name, m),
    selected(aLoc, name, m),
    name +
      " " +
      JSON.stringify({ tag: m.countries[0].tag, vars: m.countries[0].vars, dlcs: [...m.dlcs] }),
  );
  checks++;
}
function deepTags(name, seen = new Set(), tags = new Set(), dlcs = new Set()) {
  if (seen.has(name)) return { tags, dlcs };
  seen.add(name);
  for (const b of aLoc.get(name) ?? []) {
    function visit(n) {
      for (const p of props(n)) {
        if (p.key.text === "tag") tags.add(p.value.text);
        if (p.key.text === "has_dlc") dlcs.add(p.value.text);
        if (p.value.kind === "block") visit(p.value);
      }
    }
    visit(b);
    const match = strings.get(atom(b, "localisation_key"))?.match(/^\[([a-zA-Z0-9_]+)\]$/);
    if (match) deepTags(match[1], seen, tags, dlcs);
  }
  return { tags, dlcs };
}
const techIds = [];
for (let i = 1; i <= 552; i++) {
  const m = new ResearchNativeMachine(nativeEffects);
  m.countries[0].vars.rq_t = i;
  m.run("rq_grant_tech");
  techIds.push(m.grants[0]);
}
if (!process.argv.includes("--ui-only")) {
  group("552 national technology labels, DLC artwork and tree labels", () => {
    for (let i = 1; i <= 552; i++) {
      const tree = "rq_trname_" + i;
      const baseSetup = (m, c) => {
        c.arrays.rq_queue = [i];
        c.vars.rq_ev = 0;
        c.vars.rq_ml_t = i;
        c.vars.rq_st_f = i;
        c.vars.rq_st_l = i;
        c.arrays.rq_qbf = [i];
      };
      for (const name of [
        "rq_qe_name",
        "rq_qe_icon",
        "rq_ml_tname",
        "rq_qe_bnfor",
        "rq_st_fnamel",
        "rq_st_ficon",
        "rq_st_lnamel",
        "rq_st_licon",
        tree,
      ])
        compareLabel(name, baseSetup);
      for (const kind of ["name", "icon"]) {
        const deps = deepTags("rq_qe_" + kind + "_t" + i);
        for (const tag of deps.tags) {
          const modes = [[], [...deps.dlcs], ...[...deps.dlcs].map((d) => [d])];
          for (const dlcs of modes) {
            compareLabel("rq_qe_" + kind, (m, c) => {
              baseSetup(m, c);
              c.tag = tag;
              m.dlcs = new Set(dlcs);
            });
            if (kind === "name")
              compareLabel(tree, (m, c) => {
                baseSetup(m, c);
                c.tag = tag;
                m.dlcs = new Set(dlcs);
              });
          }
        }
      }
    }
  });
  group("525 organization names, icons, types and all 16 tree slots", () => {
    for (let org = 0; org <= 525; org++) {
      for (const name of ["rq_qe_mioname", "rq_qe_mioicon"])
        compareLabel(name, (m, c) => {
          c.arrays.rq_qmio = [org];
          c.vars.rq_ev = 0;
        });
      for (const slot of [1, 5, 10])
        for (const field of ["icon", "mname", "mtype"])
          compareLabel(
            "rq_ml" + slot + "_" + field,
            (m, c) => (c.vars["rq_ml" + slot + "_i"] = org),
          );
      for (let slot = 1; slot <= 16; slot++)
        compareLabel("rq_msl" + slot, (m, c) => (c.vars["rq_msv" + slot] = org));
    }
  });
  group("69 input characters, saved names and 1400 flag frames", () => {
    for (let code = 0; code <= 70; code++)
      for (const i of [0, 15, 23]) {
        for (const kind of ["cn", "cl", "cm"])
          compareLabel("rq_" + kind + i, (m, c) => {
            c.arrays.rq_tx_n = Array(24).fill(code);
            c.arrays["rq_nm" + i] = [code];
            c.vars.rq_si = 0;
            c.vars.rq_msg_si = 0;
          });
        if (i < 16)
          for (const kind of ["cs", "sx_mc", "ly_mc"])
            compareLabel("rq_" + kind + i, (m, c) => {
              c.arrays.rq_tx_s = Array(16).fill(code);
              c.arrays["rq_mn" + i] = [code];
              c.vars.rq_si = 0;
              c.vars.rq_msg_si = 0;
            });
      }
    for (let flag = 0; flag <= 1401; flag++)
      compareLabel("rq_sl_flag", (m, c) => {
        c.arrays.rq_svf = [flag];
        c.vars.rq_si = 0;
      });
  });
  // Remaining fixed selectors are tested at every branch's equality boundary.
  group("display singleton branch boundaries", () => {
    const excluded =
      /^(rq_(?:qe_(?:name|icon|mioname|mioicon|bnfor)|tr(?:name|h|m)_|ml\d+_(?:icon|mname|mtype)|ml_tname|msl\d+|c[snlm]\d+|s[xt]_mc\d+|ly_mc\d+|sl_flag|st_[fl](?:namel|icon)))/;
    for (const [name, choices] of bLoc) {
      if (excluded.test(name) || !aLoc.has(name)) continue;
      const vars = new Map();
      function collect(block) {
        for (const p of props(block)) {
          if (p.key.text === "check_variable") {
            const v = field(p.value, "var");
            if (v) {
              const value = Number(atom(p.value, "value"));
              if (Number.isFinite(value)) {
                const list = vars.get(v.text) ?? new Set([0]);
                [value - 1, value, value + 1].forEach((x) => list.add(x));
                vars.set(v.text, list);
              }
            } else
              for (const q of props(p.value)) {
                const value = Number(q.value.text);
                if (Number.isFinite(value)) {
                  const list = vars.get(q.key.text) ?? new Set([0]);
                  [value - 1, value, value + 1].forEach((x) => list.add(x));
                  vars.set(q.key.text, list);
                }
              }
          }
          if (p.value.kind === "block") collect(p.value);
        }
      }
      choices.forEach(collect);
      compareLabel(name);
      for (const [variable, values] of vars)
        for (const value of values)
          compareLabel(name, (m, c) => {
            const [array, index] = variable.split("^");
            if (index === "num") c.arrays[array] = Array(Math.max(0, Math.min(40, value))).fill(0);
            else if (index !== undefined) {
              c.arrays[array] = [value];
              c.vars[index] = 0;
            } else c.vars[variable] = value;
          });
    }
  });
  group("combined queue states and positive save-compatibility branches", () => {
    for (const status of [0, 1, 2, 3, 4])
      for (const fraction of [0, 0.01, 0.5, 1])
        for (const juggle of [0, 1])
          compareLabel("rq_qe_state", (m, c) => {
            c.arrays.rq_qst = [status];
            c.arrays.rq_qpct = [fraction];
            c.arrays.rq_qjg = [juggle];
          });
    for (const [name, flag] of [
      ["rq_t_tt", "rq_q_open"],
      ["rq_b_mode", "rq_qmode"],
      ["rq_ml_auto_txt", "rq_ml_auto"],
    ])
      compareLabel(name, (m, c) => c.flags.add(flag));
    const dlcs = [
      [3, "Man the Guns"],
      [4, "La Resistance"],
      [6, "No Step Back"],
      [7, "By Blood Alone"],
      [8, "Arms Against Tyranny"],
      [10, "Gotterdammerung"],
      [11, "Graveyard of Empires"],
      [12, "Thunder at Our Gates"],
      [13, "Peace For Our Time"],
      [14, "No Compromise, No Surrender"],
    ];
    for (const mode of ["sx", "ly"]) {
      const names = [...bLoc.keys()].filter(
        (k) => k.startsWith("rq_" + mode + "_") && !k.includes("_mc"),
      );
      const scenarios = [
        { saved: 0, installed: 0 },
        { saved: 1023, installed: 1023 },
        { saved: 1023, installed: 0 },
        { saved: 0, installed: 1023 },
        { saved: 341, installed: 682 },
      ];
      for (let i = 0; i < 10; i++) {
        scenarios.push({ saved: 1 << i, installed: 0 });
        scenarios.push({ saved: 0, installed: 1 << i });
      }
      for (const { saved, installed } of scenarios)
        for (const name of names)
          compareLabel(name, (m, c) => {
            c.vars.rq_si = 0;
            c.vars.rq_msg_si = 0;
            for (const [column, value] of [
              ["rq_svx", 1],
              ["rq_svtag", 0],
              ["rq_svva", 1],
              ["rq_svvb", 19],
              ["rq_svvc", 3],
              ["rq_svmod", 1],
              ["rq_svok", 1],
              ["rq_mn0", 1],
            ])
              c.arrays[column] = [value];
            dlcs.forEach(([id, dlc], i) => {
              c.arrays["rq_sd" + id] = [(saved >> i) & 1];
              if ((installed >> i) & 1) m.dlcs.add(dlc);
            });
          });
      for (const version of [
        [1, 19, 3],
        [1, 19, 2],
        [1, 18, 3],
        [2, 19, 3],
        [0, 0, 0],
      ])
        for (const extended of [0, 1])
          for (const tag of [0, 1])
            for (const mod of [0, 1])
              for (const name of ["rver", "rtag", "rmod", "rmodx"])
                compareLabel("rq_" + mode + "_" + name, (m, c) => {
                  for (const [column, value] of [
                    ["rq_svx", extended],
                    ["rq_svtag", tag],
                    ["rq_svva", version[0]],
                    ["rq_svvb", version[1]],
                    ["rq_svvc", version[2]],
                    ["rq_svmod", mod],
                    ["rq_mn0", 1],
                  ])
                    c.arrays[column] = [value];
                });
    }
  });
}
if (!process.argv.includes("--labels-only")) {
  const aGui = definitions(original, "common/scripted_guis", "scripted_gui"),
    bGui = definitions(built, "common/scripted_guis", "scripted_gui");
  const gui = (root) => {
    const roots = new Map();
    for (const d of documents(root, "interface", ".gui"))
      for (const p of props(d)
        .filter((x) => x.key.text === "guiTypes")
        .flatMap((x) => props(x.value))) {
        const name = atom(p.value, "name");
        if (name) roots.set(name, p.value);
      }
    return roots;
  };
  const aWindows = gui(original),
    bWindows = gui(built);
  const desc = (b) => {
    const out = new Map();
    function walk(node) {
      for (const p of props(node)) {
        if (p.value.kind !== "block") continue;
        const name = atom(p.value, "name");
        if (name) out.set(name, p.value);
        walk(p.value);
      }
    }
    walk(b);
    return out;
  };
  const xy = (b) => Object.fromEntries(props(b).map((p) => [p.key.text, p.value.text]));
  group("native entry hosts, keyboard, all 467 tree rectangles and marker geometry", () => {
    for (const name of [
      "countrytechnologyview",
      "research_slot_entry",
      "global_alerticon_window",
      "global_diplorequesticon_window",
      "medal_popup_window",
      "ribbon_popup_window",
      "custom_achievement_popup_window",
    ]) {
      assert.ok(bWindows.has(name), name);
      const aa = desc(aWindows.get(name)),
        bb = desc(bWindows.get(name));
      for (const key of aa.keys()) {
        assert.ok(bb.has(key), name + "/" + key);
        checks++;
      }
    }
    for (const [name, a] of aWindows) {
      if (!name.startsWith("rq_tree_")) continue;
      const b = bWindows.get(name);
      assert.ok(b, name);
      const aa = desc(a),
        bb = desc(b);
      assert.deepEqual([...bb.keys()].sort(), [...aa.keys()].sort(), name);
      for (const [key, el] of aa) {
        const other = bb.get(key);
        assert.deepEqual(
          xy(field(other, "position")),
          xy(field(el, "position")),
          key + " position",
        );
        if (key.endsWith("_hitbox"))
          assert.deepEqual(xy(field(other, "size")), xy(field(el, "size")), key + " size");
        checks++;
      }
    }
    const aKeys = desc(aWindows.get("rq_keys_window")),
      bKeys = desc(bWindows.get("rq_keys_window"));
    for (const [name, a] of aKeys) {
      assert.equal(atom(bKeys.get(name), "shortcut"), atom(a, "shortcut"), name);
      checks++;
    }
  });
  group("queue, settings, typing, save, history and alert visibility states", () => {
    for (const name of [
      "rq_queue_gui",
      "rq_mio_gui",
      "rq_mio_tree_gui",
      "rq_aps_gui",
      "rq_clr_gui",
      "rq_stats_gui",
      "rq_tq_gui",
      "rq_keys_gui",
      "rq_catch_gui",
      "rq_save_gui",
      "rq_load_gui",
      "rq_guide_gui",
      "rq_alert_gui",
      "rq_alert_ext_gui",
    ]) {
      const a = aGui.get(name),
        b = bGui.get(name);
      assert.ok(a && b, name);
      const elements = new Set(
        [...props(field(a, "triggers")), ...props(field(b, "triggers"))].map((x) => x.key.text),
      );
      for (let seed = 0; seed < 168; seed++) {
        const m = new ResearchNativeMachine(nativeEffects),
          c = m.countries[0];
        c.flags = new Set(["rq_active", "rq_q_open", "rq_q_shown", "rq_qmode", "rq_guide"]);
        if (seed % 3 === 0) c.flags.add("rq_ap_on");
        if (seed % 7 === 0) c.flags.delete("rq_q_open");
        if (seed % 11 === 0) c.flags.delete("rq_active");
        if (seed % 5 === 0) c.flags.add("rq_alert_off");
        c.ai = seed % 13 === 0;
        c.vars.rq_dlg = seed % 4;
        c.vars.rq_clr = seed % 2;
        c.vars.rq_ap_win = seed % 2;
        c.vars.rq_ml_t = seed % 3;
        c.vars.rq_ml_cur = seed % 3;
        c.vars.rq_ml_n = seed % 3;
        c.vars.rq_typing = seed % 3;
        c.vars.rq_caps = seed % 2;
        c.vars.rq_gtab = seed % 14;
        c.vars.rq_qn = seed % 3;
        c.vars.rq_grp_on = seed % 2;
        c.vars.rq_msg = [0, 1, 2, 3, 11, 12, 13, 21][seed % 8];
        c.vars.rq_msg_cn = seed % 17;
        c.vars.rq_st_f = seed % 2;
        c.vars.rq_st_l = seed % 3;
        c.vars.rq_st_fw = seed % 13;
        c.vars.rq_st_lw = seed % 13;
        if (seed % 2) m.dlcs.add("La Resistance");
        c.arrays.rq_queue = seed % 3 ? [1] : [];
        c.arrays.rq_view = seed % 2 ? [0] : [];
        c.arrays.rq_tx_s = seed % 2 ? [1] : [];
        c.arrays.rq_svlen = seed % 2 ? [1] : [];
        for (const [field, value] of [
          ["qst", seed % 5],
          ["qfs", (seed % 2) + 1],
          ["qiw", (seed % 13) + (seed % 2 ? 100 : 0)],
          ["qpct", seed % 2 ? 0.5 : 0],
          ["qc", seed % 2],
          ["qmio", seed % 3],
          ["qcu", seed % 6],
          ["qcd", Math.floor(seed / 6) % 6],
          ["qau", seed % 2],
          ["qxs", seed % 4],
          ["qbn", seed % 3],
          ["qbv", seed % 2 ? 0.5 : 0],
          ["qla", seed % 3 ? 1 : 0],
          ["qsh", seed % 2],
        ])
          c.arrays["rq_" + field] = [value];
        for (let slot = 1; slot <= 10; slot++) {
          c.vars["rq_ml" + slot + "_i"] = seed % 2;
          c.vars["rq_ml" + slot + "_s"] = seed % 4;
        }
        if (seed % 2) m.rules.rq_lock_slots = "ON";
        const av = !field(a, "visible") || m.condition(field(a, "visible"), c),
          bv = !field(b, "visible") || m.condition(field(b, "visible"), c);
        assert.equal(bv, av, name + " window " + seed);
        checks++;
        for (const el of elements) {
          const at = field(field(a, "triggers"), el),
            bt = field(field(b, "triggers"), el);
          assert.equal(
            bv && (!bt || m.condition(bt, c)),
            av && (!at || m.condition(at, c)),
            name + "/" + el + " " + seed,
          );
          checks++;
        }
      }
    }
  });
  group("all sprite facts and custom interface references", () => {
    function sprites(root) {
      const map = new Map();
      const numericFields = new Set(["noofframes", "animation_rate_fps", "pause_on_loop"]);
      for (const d of documents(root, "interface", ".gfx"))
        for (const wrapper of props(d))
          for (const p of props(wrapper.value)) {
            const name = atom(p.value, "name");
            if (name) {
              assert.ok(!map.has(name), "duplicate sprite " + name);
              map.set(name, {
                type: p.key.text,
                fields: Object.fromEntries(
                  props(p.value).map((q) => {
                    const key = q.key.text.toLowerCase();
                    assert.equal(q.value.kind, "atom", name + "/" + key);
                    // Native numeric fields retain the same value after 0.0 emits as 0.
                    const value = numericFields.has(key) ? Number(q.value.text) : q.value.text;
                    if (numericFields.has(key)) assert.ok(Number.isFinite(value), name + "/" + key);
                    return [key, value];
                  }),
                ),
              });
            }
          }
      return map;
    }
    const a = sprites(original),
      b = sprites(built);
    assert.equal(b.size, a.size);
    for (const [name, facts] of a) {
      assert.deepEqual(b.get(name), facts, name);
      checks++;
    }
    for (const [name, window] of bWindows)
      for (const [elName, el] of desc(window))
        for (const p of props(el)) {
          if (p.value.kind !== "atom") continue;
          const value = p.value.text;
          if (
            ["spritetype", "quadtexturesprite"].includes(p.key.text.toLowerCase()) &&
            value.startsWith("GFX_rq_")
          ) {
            assert.ok(b.has(value), name + "/" + elName + " sprite " + value);
            checks++;
          }
          if (
            ["text", "buttontext", "pdx_tooltip"].includes(p.key.text.toLowerCase()) &&
            value.startsWith("RQ_")
          ) {
            assert.ok(strings.has(value), name + "/" + elName + " localisation " + value);
            checks++;
          }
        }
  });
  group("tree hit visibility, marker ranges and all click modifiers", () => {
    for (const [name, a] of aGui) {
      if (!name.startsWith("rq_tree_")) continue;
      const b = bGui.get(name);
      assert.ok(b, name);
      const at = field(a, "triggers"),
        bt = field(b, "triggers"),
        ae = field(a, "effects"),
        be = field(b, "effects");
      for (const effect of props(ae)) {
        const other = field(be, effect.key.text);
        assert.ok(other, effect.key.text);
        function projection(block, definitions) {
          const m = new ResearchNativeMachine(definitions),
            calls = [];
          const commands = props(block).filter((p) => {
            if (definitions.has(p.key.text)) {
              calls.push(p.key.text);
              return false;
            }
            return true;
          });
          m.execute({ ...block, items: commands }, m.countries[0]);
          return {
            inputs: Object.fromEntries(
              ["rq_t", "rq_top", "rq_mopen"].map((v) => [v, m.get(v, m.countries[0])]),
            ),
            calls,
          };
        }
        assert.deepEqual(
          projection(other, rewriteEffects),
          projection(effect.value, nativeEffects),
          effect.key.text,
        );
        checks++;
      }
      for (const trigger of props(at)) {
        const other = field(bt, trigger.key.text);
        assert.ok(other, trigger.key.text);
        const match = trigger.key.text.match(/rq_tr\d+_(\d+)_/);
        if (!match) continue;
        const i = Number(match[1]),
          id = techIds[i - 1];
        for (const position of [0, 1, 99, 100, 549, 550, 1000])
          for (const hidden of [false, true]) {
            const m = new ResearchNativeMachine(nativeEffects),
              c = m.countries[0];
            c.flags.add("rq_qmode");
            c.flags.add("rq_ap_on");
            c.vars["rq_p_" + id] = position;
            c.vars["rq_ms_" + id] = position;
            c.arrays.rq_ap_pri = [i];
            if (hidden) {
              c.tech.add(id);
              m.global.arrays.rq_hid = [i];
            }
            assert.equal(
              m.condition(other, c),
              m.condition(trigger.value, c),
              trigger.key.text + " " + position + " " + hidden,
            );
            checks++;
          }
      }
    }
  });
}
writeFileSync(
  join(project, "cases/ui-verification.json"),
  JSON.stringify(
    {
      scope:
        "Independent interpretation of uploaded native script and generated native output; no HOI4 client",
      originalLocalisationDefinitions: aLoc.size,
      rewriteLocalisationDefinitions: bLoc.size,
      checks,
      groups,
      unverified: [
        "Actual rendering, engine event dispatch and keyboard focus",
        "HOI4 1.19 client and DLC-specific runtime layout",
      ],
    },
    null,
    2,
  ) + "\n",
);
console.log("UI oracle passed", checks);
