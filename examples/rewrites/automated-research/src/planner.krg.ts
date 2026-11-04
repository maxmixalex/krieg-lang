import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { technologies } from "./technologies.krg.ts";
import { aiResearch } from "./ai-facts.krg.ts";
import { rawWeight, weigh } from "./weights.krg.ts";
import { available, blocked, parents } from "./graph.krg.ts";
import { owned } from "./lookup.krg.ts";
import { computeCost, technologySpeed } from "./progress.krg.ts";
import {
  insert,
  remove,
  move,
  find,
  orderInfo,
  prerequisites,
  exclusiveSweep,
} from "./queue.krg.ts";
import { defaults } from "./settings.krg.ts";
import { profile } from "./strategy-profile.krg.ts";
import { clearMio, applyAuto, plannerMio } from "./mio.krg.ts";
import { prep as bonusPrep } from "./bonus.krg.ts";
import { update } from "./core.krg.ts";

const records = [
  "rq_ap_pr",
  "rq_ap_set",
  "rq_ap_sc",
  "rq_ap_aw",
  "rq_ap_af",
  "rq_ap_ab",
  "rq_ap_an",
] as const;
const candidates = [
  "rq_ap_ct",
  "rq_ap_cs",
  "rq_ap_cw",
  "rq_ap_cf",
  "rq_ap_cb",
  "rq_ap_cn",
  "rq_ap_cp",
  "rq_ap_ca",
] as const;
export const forget = ScriptedEffect("rq_ap_forget", (c: CountryScope) => {
  c.setTempVariable("rq_ap_fi", -1);
  c.forEachValue("rq_ap_set", { value: "apv", index: "api" }, (c) => {
    if (c.variable("apv") === c.variable("rq_t")) c.setTempVariable("rq_ap_fi", c.variable("api"));
  });
  if (c.variable("rq_ap_fi") > -1)
    for (const column of records) c.arrayRemoveAt(column, c.variable("rq_ap_fi"));
});
export const clean = ScriptedEffect("rq_ap_clean", (c: CountryScope) => {
  c.setTempVariable("rq_ap_go", 1);
  c.setTempVariable("rq_ap_k", 0);
  c.whileLoop(
    (c) => c.variable("rq_ap_go") === 1 && c.variable("rq_ap_k") < 50,
    (c) => {
      c.addTempVariable("rq_ap_k", 1);
      c.setTempVariable("rq_ap_go", 0);
      c.setTempVariable("rq_ap_fi", -1);
      c.forEachValue("rq_ap_set", { value: "apv", index: "api" }, (c) => {
        if (!c.arrayContains("rq_queue", c.variable("apv")))
          c.setTempVariable("rq_ap_fi", c.variable("api"));
      });
      if (c.variable("rq_ap_fi") > -1) {
        for (const column of records) c.arrayRemoveAt(column, c.variable("rq_ap_fi"));
        c.setTempVariable("rq_ap_go", 1);
      }
    },
  );
});
export const claim = ScriptedEffect("rq_ap_claim", (c: CountryScope) => {
  if (c.arrayLength("rq_ap_set") > 0) {
    c.setTempVariable("rq_ap_ct0", c.variable("rq_t"));
    c.run(orderInfo);
    c.run(find);
    c.setTempVariable("rq_ap_k", 0);
    c.whileLoop(
      (c) => c.variable("rq_qi") > -1 && c.variable("rq_ap_k") < 60,
      (c) => {
        c.addTempVariable("rq_ap_k", 1);
        c.setTempVariable("rq_t", c.arrayAt("rq_queue", c.variable("rq_qi")));
        c.run(forget);
        c.setTempVariable("rq_qi", c.arrayAt("rq_qpar", c.variable("rq_qi")));
      },
    );
    c.setTempVariable("rq_t", c.variable("rq_ap_ct0"));
  }
});
export const drop = ScriptedEffect("rq_ap_drop", (c: CountryScope) => {
  c.run(clean);
  c.setTempVariable("rq_ap_go", 1);
  c.setTempVariable("rq_ap_k", 0);
  c.whileLoop(
    (c) => c.variable("rq_ap_go") === 1 && c.variable("rq_ap_k") < 40,
    (c) => {
      c.addTempVariable("rq_ap_k", 1);
      c.setTempVariable("rq_ap_go", 0);
      c.run(orderInfo);
      c.setTempVariable("rq_ap_rm", -1);
      c.forEachValue("rq_queue", { value: "apq", index: "apqi" }, (c) => {
        if (
          c.arrayContains("rq_ap_set", c.variable("apq")) &&
          !c.arrayContains("rq_vanilla", c.variable("apq")) &&
          !c.arrayContains("rq_active", c.variable("apq")) &&
          !(c.arrayAt("rq_qprog", c.variable("apqi")) > 0) &&
          !c.arrayContains("rq_qpar", c.variable("apqi"))
        )
          c.setTempVariable("rq_ap_rm", c.variable("apqi"));
      });
      if (c.variable("rq_ap_rm") > -1) {
        c.setTempVariable("rq_qi", c.variable("rq_ap_rm"));
        c.setTempVariable("rq_t", c.arrayAt("rq_queue", c.variable("rq_ap_rm")));
        c.run(clearMio);
        c.run(remove);
        c.run(forget);
        c.setTempVariable("rq_ap_go", 1);
      }
    },
  );
});
export const priorityPrepare = ScriptedEffect("rq_ap_pri_prep", (c: CountryScope) => {
  c.setTempVariable("rq_ap_go", 1);
  c.setTempVariable("rq_ap_k", 0);
  c.whileLoop(
    (c) => c.variable("rq_ap_go") === 1 && c.variable("rq_ap_k") < 20,
    (c) => {
      c.addTempVariable("rq_ap_k", 1);
      c.setTempVariable("rq_ap_go", 0);
      c.setTempVariable("rq_ap_fi", -1);
      c.forEachValue("rq_ap_pri", { value: "ppv", index: "ppi" }, (c) => {
        c.setTempVariable("rq_t", c.variable("ppv"));
        c.run(owned);
        if (c.variable("rq_owned") === 1) c.setTempVariable("rq_ap_fi", c.variable("ppi"));
      });
      if (c.variable("rq_ap_fi") > -1) {
        c.arrayRemoveAt("rq_ap_pri", c.variable("rq_ap_fi"));
        c.setTempVariable("rq_ap_go", 1);
      }
    },
  );
  c.clearArray("rq_ap_pb");
  c.clearArray("rq_ap_pw");
  c.forEachValue("rq_ap_pri", { value: "ppv" }, (c) => c.arrayPush("rq_ap_pw", c.variable("ppv")));
  c.setTempVariable("rq_ap_k", 0);
  c.whileLoop(
    (c) => c.arrayLength("rq_ap_pw") > 0 && c.variable("rq_ap_k") < 400,
    (c) => {
      c.addTempVariable("rq_ap_k", 1);
      c.setTempVariable("rq_t", c.arrayAt("rq_ap_pw", 0));
      c.arrayRemoveAt("rq_ap_pw", 0);
      if (!c.arrayContains("rq_ap_pb", c.variable("rq_t"))) {
        c.arrayPush("rq_ap_pb", c.variable("rq_t"));
        c.run(parents);
        if (c.variable("rq_have") === 0)
          c.forEachValue("rq_pars", { value: "ppa" }, (c) => {
            c.setTempVariable("rq_t", c.variable("ppa"));
            c.run(owned);
            if (c.variable("rq_owned") === 0) c.arrayPush("rq_ap_pw", c.variable("ppa"));
          });
      }
    },
  );
  c.clearArray("rq_jgl");
  c.forEachValue("rq_ap_pb", { value: "jgv" }, (c) => c.arrayPush("rq_jgl", c.variable("jgv")));
  c.setVariable("rq_ap_prin", c.arrayLength("rq_ap_pri"));
});
export const score = ScriptedEffect("rq_ap_score", (c: CountryScope) => {
  c.setTempVariable("rq_ap_s", 0);
  if (c.variable("rq_ap_w") > 0 && c.variable("rq_ap_n") > 0) {
    c.run(computeCost);
    c.run(technologySpeed);
    c.setTempVariable(
      "rq_ap_x",
      (c.variable("rq_cost") - c.variable("rq_base_cost")) / c.variable("rq_tspd"),
    );
    if (c.variable("rq_ap_p") === 1 || !(c.variable("rq_ap_x") > c.variable("rq_ap_lim"))) {
      c.setTempVariable("rq_ap_f", 1 / c.variable("rq_ahead") / c.variable("rq_ahead"));
      c.setTempVariable("rq_ap_b", c.variable("rq_tspd") / c.variable("rq_speed_shown"));
      c.setTempVariable(
        "rq_ap_s",
        c.variable("rq_ap_w") *
          c.variable("rq_ap_f") *
          c.variable("rq_ap_b") *
          c.variable("rq_ap_n"),
      );
      if (c.variable("rq_ap_s") > 0) {
        c.arrayPush("rq_ap_ct", c.variable("rq_t"));
        c.arrayPush("rq_ap_cs", c.variable("rq_ap_s"));
        c.arrayPush("rq_ap_cw", c.variable("rq_ap_w"));
        c.arrayPush("rq_ap_cf", c.variable("rq_ap_f"));
        c.arrayPush("rq_ap_cb", c.variable("rq_ap_b"));
        c.arrayPush("rq_ap_cn", c.variable("rq_ap_n"));
        c.arrayPush("rq_ap_cp", c.variable("rq_ap_p"));
        c.run(available);
        c.arrayPush("rq_ap_ca", c.variable("rq_avail"));
      }
    }
  }
});
export const one = ScriptedEffect("rq_ap_one", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_t",
    aiResearch,
    (c, preference) => {
      if (preference.automatic) {
        const tech = technologies[preference.index - 1];
        c.setTempVariable("rq_ap_parent", 0);
        for (const parent of tech.parents)
          if (c.arrayContains("rq_queue", parent)) c.setTempVariable("rq_ap_parent", 1);
        c.setTempVariable("rq_ap_exclusive", 0);
        for (const pair of [
          { index: 189, peer: 215 },
          { index: 215, peer: 189 },
          { index: 261, peer: 485 },
          { index: 485, peer: 261 },
        ]) {
          if (
            preference.index === pair.index &&
            (c.triggers.has_tech(technologies[pair.peer - 1].id) ||
              c.arrayContains("rq_queue", pair.peer))
          )
            c.setTempVariable("rq_ap_exclusive", 1);
        }
        if (
          !c.triggers.has_tech(tech.id) &&
          !c.arrayContains("rq_queue", preference.index) &&
          !c.arrayContains("rq_ap_ban", preference.index) &&
          !c.arrayContains("global.rq_hid", preference.index) &&
          c.variable("rq_ap_exclusive") === 0 &&
          (c.triggers.can_research(tech.id) || c.variable("rq_ap_parent") === 1)
        ) {
          c.setTempVariable("rq_ap_ok", 1);
          if (c.variable("rq_ap_chk") === 0) {
            c.setTempVariable("rq_t", preference.index);
            c.run(rawWeight);
            c.setTempVariable("rq_ap_p", 0);
            if (c.arrayContains("rq_ap_pb", preference.index)) c.setTempVariable("rq_ap_p", 1);
            c.run(score);
          }
        }
      }
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const scan = ScriptedEffect("rq_ap_scan", (c: CountryScope) => {
  c.setTempVariable("rq_ap_chk", 0);
  c.forRange({ start: 1, end: 553, index: "rq_ap_si" }, (c) => {
    c.setTempVariable("rq_t", c.variable("rq_ap_si"));
    c.run(one);
  });
});
export const children = ScriptedEffect("rq_ap_kids", (c: CountryScope) => {
  c.setTempVariable("rq_ap_chk", 0);
  c.dispatchByIndex(
    "rq_t",
    aiResearch,
    (c, preference) => {
      for (const child of preference.children) {
        c.setTempVariable("rq_t", child);
        c.run(one);
      }
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const add = ScriptedEffect("rq_ap_add", (c: CountryScope) => {
  c.setTempVariable("rq_ins_t", c.variable("rq_t"));
  c.setTempVariable("rq_ins_p", 0);
  c.setTempVariable("rq_ins_m", 0);
  c.setTempVariable("rq_ins_s", 0);
  c.setTempVariable("rq_qi", c.arrayLength("rq_queue"));
  c.run(insert);
  c.run(find);
  c.run(applyAuto);
  c.setTempVariable("rq_tc", c.variable("rq_t"));
  c.run(find);
  c.setTempVariable("rq_pp", c.variable("rq_qi"));
  c.clearArray("rq_added");
  c.arrayPush("rq_added", c.variable("rq_tc"));
  c.run(prerequisites);
  c.run(exclusiveSweep);
  c.setTempVariable("rq_t", c.variable("rq_tc"));
  c.arrayPush("rq_ap_pr", c.variable("rq_ap_bp"));
  c.arrayPush("rq_ap_set", c.variable("rq_t"));
  c.arrayPush("rq_ap_sc", c.variable("rq_ap_bs"));
  c.arrayPush("rq_ap_aw", c.variable("rq_ap_bw"));
  c.arrayPush("rq_ap_af", c.variable("rq_ap_bf"));
  c.arrayPush("rq_ap_ab", c.variable("rq_ap_bb"));
  c.arrayPush("rq_ap_an", c.variable("rq_ap_bn"));
});
export const jump = ScriptedEffect("rq_ap_jump", (c: CountryScope) => {
  if (c.variable("rq_ap_jumpf") !== 1) {
    c.setTempVariable("rq_jt", c.variable("rq_t"));
    c.setTempVariable("rq_ja", c.variable("rq_ap_bw") * c.variable("rq_ap_bn") * 1.5);
    c.run(parents);
    c.clearArray("rq_jpars");
    c.forEachValue("rq_pars", { value: "jpv" }, (c) => c.arrayPush("rq_jpars", c.variable("jpv")));
    c.setTempVariable("rq_jgo", 1);
    c.setTempVariable("rq_jn", 0);
    c.setTempVariable("rq_t", c.variable("rq_jt"));
    c.run(find);
    c.setTempVariable("rq_jpos", c.variable("rq_qi"));
    c.setTempVariable("rq_jfrom", c.variable("rq_qi"));
    c.whileLoop(
      (c) => c.variable("rq_jgo") === 1 && c.variable("rq_jn") < 60,
      (c) => {
        c.addTempVariable("rq_jn", 1);
        c.setTempVariable("rq_jgo", 0);
        c.setTempVariable("rq_jj", c.variable("rq_jpos") - 1);
        if (c.variable("rq_jpos") > 0 && !(c.variable("rq_jj") < c.arrayLength("rq_vanilla"))) {
          c.setTempVariable("rq_jo", c.arrayAt("rq_queue", c.variable("rq_jj")));
          if (
            !c.arrayContains("rq_jpars", c.variable("rq_jo")) &&
            !c.arrayContains("rq_ap_set", c.variable("rq_jo")) &&
            !c.arrayContains("rq_jgl", c.variable("rq_jo"))
          ) {
            c.setTempVariable("rq_t", c.variable("rq_jo"));
            c.run(weigh);
            c.setTempVariable("rq_jb", c.variable("rq_ap_w"));
            c.setTempVariable("rq_jsum", c.variable("rq_ja") + c.variable("rq_jb"));
            c.effects.set_temp_variable_to_random({ var: "rq_jr", min: 0, max: 1 });
            c.multiplyTempVariable("rq_jr", c.variable("rq_jsum"));
            if (c.variable("rq_jr") < c.variable("rq_ja") || !(c.variable("rq_jb") > 0)) {
              c.setTempVariable("rq_jpos", c.variable("rq_jj"));
              c.setTempVariable("rq_jgo", 1);
            }
          }
        }
      },
    );
    if (c.variable("rq_jpos") < c.variable("rq_jfrom")) {
      c.setTempVariable("rq_qi", c.variable("rq_jfrom"));
      c.setTempVariable("rq_qj", c.variable("rq_jpos"));
      c.run(move);
    }
    c.setTempVariable("rq_t", c.variable("rq_jt"));
  }
});
export const openCount = ScriptedEffect("rq_ap_open_count", (c: CountryScope) => {
  c.setTempVariable("rq_ap_open", c.variable("rq_slots") - c.arrayLength("rq_vanilla"));
  c.setTempVariable("rq_ap_ob", 0);
  if (c.variable("rq_ap_open") < 1) c.setTempVariable("rq_ap_ob", 1);
  c.forEachValue("rq_queue", { value: "aov", break: "rq_ap_ob" }, (c) => {
    if (!c.arrayContains("rq_vanilla", c.variable("aov"))) {
      c.setTempVariable("rq_t", c.variable("aov"));
      c.run(available);
      if (c.variable("rq_avail") === 1) {
        c.subtractTempVariable("rq_ap_open", 1);
        if (c.variable("rq_ap_open") < 1) c.setTempVariable("rq_ap_ob", 1);
      }
    }
  });
  c.clampTempVariable("rq_ap_open", { min: 0 });
});
export const prioritySlot = ScriptedEffect("rq_ap_pri_slot", (c: CountryScope) => {
  c.setTempVariable("rq_ps_at", c.arrayLength("rq_vanilla"));
  c.forEachValue("rq_ap_pri", { value: "psv" }, (c) => {
    c.clearArray("rq_ps_w");
    c.clearArray("rq_ps_seen");
    c.arrayPush("rq_ps_w", c.variable("psv"));
    c.setTempVariable("rq_ps_pick", 0);
    c.setTempVariable("rq_ps_k", 0);
    c.whileLoop(
      (c) =>
        c.variable("rq_ps_pick") === 0 &&
        c.arrayLength("rq_ps_w") > 0 &&
        c.variable("rq_ps_k") < 200,
      (c) => {
        c.addTempVariable("rq_ps_k", 1);
        c.setTempVariable("rq_t", c.arrayAt("rq_ps_w", 0));
        c.arrayRemoveAt("rq_ps_w", 0);
        if (!c.arrayContains("rq_ps_seen", c.variable("rq_t"))) {
          c.arrayPush("rq_ps_seen", c.variable("rq_t"));
          c.run(owned);
          c.run(blocked);
          if (c.variable("rq_owned") === 0 && c.variable("rq_dead") === 0) {
            c.run(available);
            if (c.variable("rq_avail") === 1) c.setTempVariable("rq_ps_pick", c.variable("rq_t"));
            else {
              c.run(parents);
              if (c.variable("rq_have") === 0)
                c.forEachValue("rq_pars", { value: "psp" }, (c) => {
                  c.setTempVariable("rq_t", c.variable("psp"));
                  c.run(owned);
                  if (c.variable("rq_owned") === 0) c.arrayPush("rq_ps_w", c.variable("psp"));
                });
            }
          }
        }
      },
    );
    if (c.variable("rq_ps_pick") > 0 && !c.arrayContains("rq_vanilla", c.variable("rq_ps_pick"))) {
      c.setTempVariable("rq_t", c.variable("rq_ps_pick"));
      c.run(find);
      if (c.variable("rq_qi") === -1) {
        c.setTempVariable("rq_ap_bp", 1);
        for (const value of ["rq_ap_bs", "rq_ap_bw", "rq_ap_bf", "rq_ap_bb", "rq_ap_bn"])
          c.setTempVariable(value, 0);
        c.run(add);
        c.setTempVariable("rq_t", c.variable("rq_ps_pick"));
        c.run(find);
      }
      if (c.variable("rq_qi") > -1 && !(c.variable("rq_qi") < c.variable("rq_ps_at"))) {
        if (c.variable("rq_qi") > c.variable("rq_ps_at")) {
          c.setTempVariable("rq_qj", c.variable("rq_ps_at"));
          c.run(move);
        }
        c.addTempVariable("rq_ps_at", 1);
      }
    }
  });
});
export const replan = ScriptedEffect("rq_ap_run", (c: CountryScope) => {
  c.addVariable("rq_ap_runs", 1);
  c.run(defaults);
  c.setVariable("rq_ap_next", c.variable("global.num_days") + c.variable("rq_ap_days"));
  c.setVariable("rq_ap_last", c.variable("global.num_days"));
  c.setTempVariable("rq_ap_lim", c.variable("rq_ap_ldays"));
  c.run(profile);
  c.run(priorityPrepare);
  c.run(drop);
  c.run(bonusPrep);
  c.setTempVariable("rq_ap_cnt", c.arrayLength("rq_ap_set"));
  for (const column of candidates) c.clearArray(column);
  c.setTempVariable("rq_bn_for", -1);
  c.run(scan);
  c.run(openCount);
  c.setTempVariable("rq_ap_go", 1);
  c.setTempVariable("rq_ap_k", 0);
  c.whileLoop(
    (c) =>
      c.variable("rq_ap_go") === 1 &&
      (c.variable("rq_ap_cnt") < c.variable("rq_ap_cap") || c.variable("rq_ap_open") > 0) &&
      c.variable("rq_ap_k") < 200,
    (c) => {
      c.addTempVariable("rq_ap_k", 1);
      c.setTempVariable("rq_ap_mi", -1);
      c.setTempVariable("rq_ap_mx", 0);
      // Available research fills idle slots before prioritised or future projects.
      if (c.variable("rq_ap_open") > 0) {
        c.forEachValue("rq_ap_cs", { value: "csv", index: "csi" }, (c) => {
          if (
            c.variable("csv") > c.variable("rq_ap_mx") &&
            c.arrayAt("rq_ap_ca", c.variable("csi")) === 1
          ) {
            c.setTempVariable("rq_ap_mx", c.variable("csv"));
            c.setTempVariable("rq_ap_mi", c.variable("csi"));
          }
        });
        if (c.variable("rq_ap_mi") === -1) c.setTempVariable("rq_ap_open", 0);
      }
      if (c.variable("rq_ap_mi") === -1 && c.variable("rq_ap_cnt") < c.variable("rq_ap_cap"))
        c.forEachValue("rq_ap_cs", { value: "csv", index: "csi" }, (c) => {
          if (
            c.variable("csv") > c.variable("rq_ap_mx") &&
            c.arrayAt("rq_ap_cp", c.variable("csi")) === 1
          ) {
            c.setTempVariable("rq_ap_mx", c.variable("csv"));
            c.setTempVariable("rq_ap_mi", c.variable("csi"));
          }
        });
      if (c.variable("rq_ap_mi") === -1 && c.variable("rq_ap_cnt") < c.variable("rq_ap_cap"))
        c.forEachValue("rq_ap_cs", { value: "csv", index: "csi" }, (c) => {
          if (c.variable("csv") > c.variable("rq_ap_mx")) {
            c.setTempVariable("rq_ap_mx", c.variable("csv"));
            c.setTempVariable("rq_ap_mi", c.variable("csi"));
          }
        });
      if (c.variable("rq_ap_mi") === -1) c.setTempVariable("rq_ap_go", 0);
      else {
        c.setTempVariable("rq_t", c.arrayAt("rq_ap_ct", c.variable("rq_ap_mi")));
        c.setTempVariable("rq_ap_bs", c.arrayAt("rq_ap_cs", c.variable("rq_ap_mi")));
        c.setTempVariable("rq_ap_bw", c.arrayAt("rq_ap_cw", c.variable("rq_ap_mi")));
        c.setTempVariable("rq_ap_bf", c.arrayAt("rq_ap_cf", c.variable("rq_ap_mi")));
        c.setTempVariable("rq_ap_bb", c.arrayAt("rq_ap_cb", c.variable("rq_ap_mi")));
        c.setTempVariable("rq_ap_bn", c.arrayAt("rq_ap_cn", c.variable("rq_ap_mi")));
        c.setTempVariable("rq_ap_bp", c.arrayAt("rq_ap_cp", c.variable("rq_ap_mi")));
        c.setTempVariable("rq_ap_ba", c.arrayAt("rq_ap_ca", c.variable("rq_ap_mi")));
        for (const column of candidates) c.arrayRemoveAt(column, c.variable("rq_ap_mi"));
        c.setTempVariable("rq_ap_pk", c.variable("rq_t"));
        c.setTempVariable("rq_ap_ok", 0);
        c.setTempVariable("rq_ap_chk", 1);
        c.run(one);
        c.setTempVariable("rq_ap_chk", 0);
        if (c.variable("rq_ap_ok") === 1) {
          c.setTempVariable("rq_t", c.variable("rq_ap_pk"));
          c.run(add);
          c.setTempVariable("rq_t", c.variable("rq_ap_pk"));
          c.run(jump);
          c.addTempVariable("rq_ap_cnt", 1);
          if (c.variable("rq_ap_ba") === 1) c.subtractTempVariable("rq_ap_open", 1);
          c.setTempVariable("rq_bn_for", -1);
          c.setTempVariable("rq_t", c.variable("rq_ap_pk"));
          c.run(children);
        }
      }
    },
  );
  c.setVariable("rq_ap_lopen", c.variable("rq_ap_open"));
  c.run(prioritySlot);
  c.setTempVariable("rq_bn_for", -1);
  c.run(plannerMio);
});
export const tick = ScriptedEffect("rq_ap_tick", (c: CountryScope) => {
  if (c.triggers.has_country_flag("rq_ap_on") && c.variable("rq_no_progress") !== 1) {
    c.setTempVariable("rq_ap_due", 0);
    c.setTempVariable("rq_ap_x", c.variable("global.num_days"));
    if (!(c.variable("rq_ap_x") < c.variable("rq_ap_next"))) c.setTempVariable("rq_ap_due", 1);
    c.setTempVariable("rq_ap_y", c.variable("rq_ap_last") + 7);
    c.setTempVariable("rq_ap_z", c.arrayLength("rq_active") + c.arrayLength("rq_vanilla"));
    if (
      (!(c.arrayLength("rq_queue") > c.variable("rq_slots")) ||
        c.variable("rq_ap_z") < c.variable("rq_slots")) &&
      !(c.variable("rq_ap_x") < c.variable("rq_ap_y"))
    )
      c.setTempVariable("rq_ap_due", 1);
    c.setTempVariable("rq_ap_idle", c.variable("rq_slots") - c.variable("rq_ap_z"));
    if (c.variable("rq_ap_idle") < c.variable("rq_ap_lopen"))
      c.setVariable("rq_ap_lopen", c.variable("rq_ap_idle"));
    if (c.variable("rq_ap_idle") > c.variable("rq_ap_lopen")) c.setTempVariable("rq_ap_due", 1);
    if (c.variable("rq_ap_due") === 1) {
      c.run(replan);
      if (c.variable("rq_ap_lopen") < c.variable("rq_ap_idle"))
        c.setVariable("rq_ap_lopen", c.variable("rq_ap_idle"));
    }
  }
});
export const toggle = ScriptedEffect("rq_ap_toggle", (c: CountryScope) => {
  if (c.triggers.has_country_flag("rq_ap_on")) {
    c.effects.clr_country_flag("rq_ap_on");
    c.run(drop);
    for (const column of records) c.clearArray(column);
    for (const column of ["rq_ap_ban", "rq_ap_pri", "rq_jgl"]) c.clearArray(column);
    c.setVariable("rq_ap_prin", 0);
  } else {
    c.effects.set_country_flag("rq_ap_on");
    c.clearArray("rq_ap_pri");
    c.clearArray("rq_jgl");
    c.setVariable("rq_ap_prin", 0);
    c.run(defaults);
    c.run(replan);
  }
  c.run(update);
});
export const priorityClick = ScriptedEffect("rq_ap_pri_click", (c: CountryScope) => {
  if (c.triggers.has_country_flag("rq_ap_on")) {
    if (c.arrayContains("rq_ap_pri", c.variable("rq_t")))
      c.arrayRemoveValue("rq_ap_pri", c.variable("rq_t"));
    else if (c.arrayLength("rq_ap_pri") < 5) c.arrayPush("rq_ap_pri", c.variable("rq_t"));
    c.setVariable("rq_ap_prin", c.arrayLength("rq_ap_pri"));
    c.run(replan);
    c.run(update);
  }
});
