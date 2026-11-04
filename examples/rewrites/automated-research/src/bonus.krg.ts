import { focusBonuses } from "./bonus-focus-facts.krg.ts";
import { bonusEligibility } from "./bonus-eligibility.krg.ts";
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { bonusTechnologyKinds, bonusKinds, bonusRecovery } from "./bonus-facts.krg.ts";
import { technologyBonus } from "./graph.krg.ts";
import { costAndDate, owned } from "./lookup.krg.ts";
import { positions } from "./queue.krg.ts";

// One record per independently granted award. Uses still in the engine (bnq)
// are separate from unreserved uses (bnu); a mod lane reserves an engine use.
export const add = ScriptedEffect("rq_bn_add", (c: CountryScope) => {
  for (const column of [
    { array: "rq_bnk", value: "rq_nb_k" },
    { array: "rq_bnv", value: "rq_nb_v" },
    { array: "rq_bna", value: "rq_nb_a" },
    { array: "rq_bnu", value: "rq_nb_u" },
  ])
    c.arrayPush(column.array, c.variable(column.value));
  c.arrayPush("rq_bnq", 0);
  c.setTempVariable("rq_bn_for", -1);
});
export const technologyKinds = ScriptedEffect("rq_bn_tkinds", (c: CountryScope) => {
  c.clearArray("rq_tk");
  c.dispatchByIndex(
    "rq_t",
    bonusTechnologyKinds,
    (c, tech) => {
      for (const kind of tech.kinds) c.arrayPush("rq_tk", kind);
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const present = ScriptedEffect("rq_bn_present", (c: CountryScope) => {
  c.setTempVariable("rq_lbp", 0);
  c.dispatchByIndex(
    "rq_lbk",
    bonusKinds,
    (c, kind) => {
      if (kind.always) c.setTempVariable("rq_lbp", 1);
      for (const term of kind.terms) {
        if (c.triggers.has_tech_bonus({ category: term.category })) c.setTempVariable("rq_lbp", 1);
        if (term.technology !== "" && c.triggers.has_tech_bonus({ technology: term.technology }))
          c.setTempVariable("rq_lbp", 1);
      }
    },
    { first: 1, outOfRange: "clamp" },
  );
});
const years = ScriptedEffect("rq_bn_years", (c: CountryScope) => {
  c.run(costAndDate);
  c.setTempVariable(
    "rq_ya0",
    c.variable("rq_start_months") / 12 - c.variable("rq_now_y") - c.variable("rq_now_doy") / 365,
  );
  c.clampTempVariable("rq_ya0", { min: 0 });
});
export const valueBase = ScriptedEffect("rq_bn_val_base", (c: CountryScope) => {
  c.run(years);
  c.run(technologyBonus);
  c.setTempVariable("rq_hs", c.variable("rq_speed_shown") + c.variable("rq_tb"));
  c.clampTempVariable("rq_hs", { min: 0.1 });
  c.setTempVariable("rq_hx", (c.variable("rq_ya0") * 2 + 1) / c.variable("rq_hs"));
  c.setTempVariable("rq_hw", c.variable("rq_base_cost") - c.variable("rq_hp"));
  c.clampTempVariable("rq_hw", { min: 0 });
});
export const valueTail = ScriptedEffect("rq_bn_val_tail", (c: CountryScope) => {
  c.setTempVariable("rq_hy", c.variable("rq_ya0") - c.arrayAt("rq_bna", c.variable("rq_hb")));
  c.clampTempVariable("rq_hy", { min: 0 });
  c.setTempVariable("rq_hs2", c.variable("rq_hs") + c.arrayAt("rq_bnv", c.variable("rq_hb")));
  c.setTempVariable("rq_hy", (c.variable("rq_hy") * 2 + 1) / c.variable("rq_hs2"));
  c.setTempVariable("rq_hv", (c.variable("rq_hx") - c.variable("rq_hy")) * c.variable("rq_hw"));
});
export const value = ScriptedEffect("rq_bn_val", (c: CountryScope) => {
  c.run(valueBase);
  c.run(valueTail);
});
export const mark = ScriptedEffect("rq_bn_mark", (c: CountryScope) => {
  if (!c.arrayContains("rq_bdt", c.variable("rq_bm_t")))
    c.arrayPush("rq_bdt", c.variable("rq_bm_t"));
});
export const thresholds = ScriptedEffect("rq_bn_thr", (c: CountryScope) => {
  for (const column of ["rq_bt1", "rq_bt2", "rq_btt", "rq_btt2"]) c.clearArray(column);
  c.forEachValue("rq_bnk", { value: "bp_k", index: "bp_i" }, (c) => {
    for (const v of ["rq_p1", "rq_p2", "rq_pt1", "rq_pt2"]) c.setTempVariable(v, 0);
    if (c.arrayAt("rq_bnu", c.variable("bp_i")) > 0) {
      c.setTempVariable("rq_ts0", c.variable("bp_i") * 11);
      c.setTempVariable("rq_tsn", c.arrayAt("rq_tsc", c.variable("bp_i")));
      c.setTempVariable("rq_pu", c.arrayAt("rq_bnu", c.variable("bp_i")));
      c.clampTempVariable("rq_pu", { max: 10 });
      if (c.variable("rq_tsn") > 0)
        c.setTempVariable("rq_pt1", c.arrayAt("rq_tst", c.variable("rq_ts0")));
      if (c.variable("rq_tsn") > 1)
        c.setTempVariable("rq_pt2", c.arrayAt("rq_tst", c.variable("rq_ts0") + 1));
      if (c.variable("rq_tsn") >= c.variable("rq_pu") && c.variable("rq_pu") > 0)
        c.setTempVariable(
          "rq_p1",
          c.arrayAt("rq_tsv", c.variable("rq_ts0") + c.variable("rq_pu") - 1),
        );
      c.setTempVariable("rq_pu1", c.variable("rq_pu") + 1);
      if (c.variable("rq_tsn") >= c.variable("rq_pu1"))
        c.setTempVariable("rq_p2", c.arrayAt("rq_tsv", c.variable("rq_ts0") + c.variable("rq_pu")));
    }
    c.arrayPush("rq_bt1", c.variable("rq_p1"));
    c.arrayPush("rq_bt2", c.variable("rq_p2"));
    c.arrayPush("rq_btt", c.variable("rq_pt1"));
    c.arrayPush("rq_btt2", c.variable("rq_pt2"));
  });
});
// Keep the eleven largest time savings for each award. Equal values retain queue
// order, so a move or progress edit deterministically changes reservation priority.
export const prepareAll = ScriptedEffect("rq_bn_prep_do", (c: CountryScope) => {
  if (c.arrayLength("rq_bpsel") === 0) {
    for (const column of ["rq_tsv", "rq_tst", "rq_tsc"]) c.clearArray(column);
    c.forEachValue("rq_bnk", { value: "tsk" }, (c) => {
      c.arrayPush("rq_tsc", 0);
      c.forRange({ start: 0, end: 11, index: "rq_tsx" }, (c) => {
        c.arrayPush("rq_tsv", 0);
        c.arrayPush("rq_tst", 0);
      });
    });
  } else
    c.forEachValue("rq_bpsel", { value: "bsv" }, (c) => c.arraySet("rq_tsc", c.variable("bsv"), 0));
  c.forEachValue("rq_queue", { value: "hv", index: "hi" }, (c) => {
    if (
      !c.arrayContains("rq_vanilla", c.variable("hv")) &&
      !c.arrayContains("rq_atk", c.variable("hv"))
    ) {
      c.setTempVariable("rq_t", c.variable("hv"));
      c.run(technologyKinds);
      c.setTempVariable("rq_hp", c.arrayAt("rq_qprog", c.variable("hi")));
      c.run(valueBase);
      c.forEachValue("rq_bnk", { value: "fk", index: "fi" }, (c) => {
        if (
          c.arrayAt("rq_bnu", c.variable("fi")) > 0 &&
          c.arrayContains("rq_tk", c.variable("fk")) &&
          (c.arrayLength("rq_bpsel") === 0 || c.arrayContains("rq_bpsel", c.variable("fi")))
        ) {
          c.setTempVariable("rq_hb", c.variable("fi"));
          c.run(valueTail);
          c.setTempVariable("rq_ts0", c.variable("fi") * 11);
          c.setTempVariable("rq_tsn", c.arrayAt("rq_tsc", c.variable("fi")));
          c.setTempVariable("rq_tsr", 0);
          c.setTempVariable("rq_tsb", 0);
          c.whileLoop(
            (c) => c.variable("rq_tsb") === 0 && c.variable("rq_tsr") < c.variable("rq_tsn"),
            (c) => {
              c.setTempVariable("rq_tsx", c.variable("rq_ts0") + c.variable("rq_tsr"));
              if (c.arrayAt("rq_tsv", c.variable("rq_tsx")) < c.variable("rq_hv"))
                c.setTempVariable("rq_tsb", 1);
              else c.addTempVariable("rq_tsr", 1);
            },
          );
          if (c.variable("rq_tsr") < 11) {
            c.arrayRemoveAt("rq_tsv", c.variable("rq_ts0") + 10);
            c.arrayRemoveAt("rq_tst", c.variable("rq_ts0") + 10);
            c.arrayInsert(
              "rq_tsv",
              c.variable("rq_ts0") + c.variable("rq_tsr"),
              c.variable("rq_hv"),
            );
            c.arrayInsert("rq_tst", c.variable("rq_ts0") + c.variable("rq_tsr"), c.variable("hv"));
            if (c.variable("rq_tsn") < 11)
              c.arraySet("rq_tsc", c.variable("fi"), c.variable("rq_tsn") + 1);
          }
        }
      });
    }
  });
  c.run(thresholds);
});
// A progress edit only changes that technology's candidate rank. If it falls
// out of a full eleven-entry shortlist, rebuild that award's list to recover the
// previously excluded candidate; unchanged awards retain their cached values.
export const prepareUpdate = ScriptedEffect("rq_bn_prep_upd", (c: CountryScope) => {
  c.setTempVariable("rq_fany", 0);
  c.forEachValue("rq_bnu", { value: "fu", break: "rq_fany" }, (c) => {
    if (c.variable("fu") > 0) c.setTempVariable("rq_fany", 1);
  });
  if (c.variable("rq_fany") === 1) {
    c.run(positions);
    c.forEachValue("rq_bdt", { value: "ut" }, (c) => {
      c.setTempVariable("rq_t", c.variable("ut"));
      c.run(technologyKinds);
      if (c.arrayLength("rq_tk") > 0) {
        c.setTempVariable("rq_ui", c.arrayAt("rq_qpos", c.variable("ut")));
        c.setTempVariable("rq_uq", 0);
        if (
          c.variable("rq_ui") > -1 &&
          !c.arrayContains("rq_vanilla", c.variable("ut")) &&
          !c.arrayContains("rq_atk", c.variable("ut"))
        ) {
          c.setTempVariable("rq_uq", 1);
          c.setTempVariable("rq_hp", c.arrayAt("rq_qprog", c.variable("rq_ui")));
        }
        c.setTempVariable("rq_fbase", 0);
        c.forEachValue("rq_bnk", { value: "fk", index: "fi" }, (c) => {
          if (
            c.arrayAt("rq_bnu", c.variable("fi")) > 0 &&
            c.arrayContains("rq_tk", c.variable("fk"))
          ) {
            c.setTempVariable("rq_ts0", c.variable("fi") * 11);
            c.setTempVariable("rq_tsn", c.arrayAt("rq_tsc", c.variable("fi")));
            c.setTempVariable("rq_ufull", 0);
            if (c.variable("rq_tsn") > 10) c.setTempVariable("rq_ufull", 1);
            c.setTempVariable("rq_uwas", 0);
            c.setTempVariable("rq_tsr", 0);
            c.whileLoop(
              (c) => c.variable("rq_uwas") === 0 && c.variable("rq_tsr") < c.variable("rq_tsn"),
              (c) => {
                c.setTempVariable("rq_tsx", c.variable("rq_ts0") + c.variable("rq_tsr"));
                if (c.arrayAt("rq_tst", c.variable("rq_tsx")) === c.variable("ut")) {
                  c.setTempVariable("rq_uwas", 1);
                  c.arrayRemoveAt("rq_tsv", c.variable("rq_tsx"));
                  c.arrayRemoveAt("rq_tst", c.variable("rq_tsx"));
                  c.arrayInsert("rq_tsv", c.variable("rq_ts0") + 10, 0);
                  c.arrayInsert("rq_tst", c.variable("rq_ts0") + 10, 0);
                  c.subtractTempVariable("rq_tsn", 1);
                  c.arraySet("rq_tsc", c.variable("fi"), c.variable("rq_tsn"));
                } else c.addTempVariable("rq_tsr", 1);
              },
            );
            c.setTempVariable("rq_tsr", 11);
            if (c.variable("rq_uq") === 1) {
              if (c.variable("rq_fbase") === 0) {
                c.setTempVariable("rq_t", c.variable("ut"));
                c.run(valueBase);
                c.setTempVariable("rq_fbase", 1);
              }
              c.setTempVariable("rq_hb", c.variable("fi"));
              c.run(valueTail);
              c.setTempVariable("rq_ts0", c.variable("fi") * 11);
              c.setTempVariable("rq_tsn", c.arrayAt("rq_tsc", c.variable("fi")));
              c.setTempVariable("rq_tsr", 0);
              c.setTempVariable("rq_tsb", 0);
              c.whileLoop(
                (c) => c.variable("rq_tsb") === 0 && c.variable("rq_tsr") < c.variable("rq_tsn"),
                (c) => {
                  c.setTempVariable("rq_tsx", c.variable("rq_ts0") + c.variable("rq_tsr"));
                  c.setTempVariable("rq_utp", c.arrayAt("rq_tst", c.variable("rq_tsx")));
                  c.setTempVariable("rq_utq", c.arrayAt("rq_qpos", c.variable("rq_utp")));
                  if (
                    c.arrayAt("rq_tsv", c.variable("rq_tsx")) < c.variable("rq_hv") ||
                    (c.arrayAt("rq_tsv", c.variable("rq_tsx")) === c.variable("rq_hv") &&
                      c.variable("rq_utq") > c.variable("rq_ui"))
                  )
                    c.setTempVariable("rq_tsb", 1);
                  else c.addTempVariable("rq_tsr", 1);
                },
              );
              if (c.variable("rq_tsr") < 11) {
                c.arrayRemoveAt("rq_tsv", c.variable("rq_ts0") + 10);
                c.arrayRemoveAt("rq_tst", c.variable("rq_ts0") + 10);
                c.arrayInsert(
                  "rq_tsv",
                  c.variable("rq_ts0") + c.variable("rq_tsr"),
                  c.variable("rq_hv"),
                );
                c.arrayInsert(
                  "rq_tst",
                  c.variable("rq_ts0") + c.variable("rq_tsr"),
                  c.variable("ut"),
                );
                if (c.variable("rq_tsn") < 11) {
                  c.addTempVariable("rq_tsn", 1);
                  c.arraySet("rq_tsc", c.variable("fi"), c.variable("rq_tsn"));
                }
              }
            }
            if (
              c.variable("rq_uwas") === 1 &&
              c.variable("rq_ufull") === 1 &&
              c.variable("rq_tsr") > 9
            )
              c.arrayPush("rq_bpsel", c.variable("fi"));
          }
        });
      }
    });
  }
  if (c.arrayLength("rq_bpsel") > 0) c.run(prepareAll);
  else c.run(thresholds);
});
const categoryWeights = [
  "air_equipment",
  "armor",
  "artillery",
  "bb_tech",
  "bc_tech",
  "ca_tech",
  "cas_bomber",
  "cat_fortification",
  "cat_production",
  "construction_tech",
  "cv_tech",
  "dd_tech",
  "decryption_tech",
  "electronics",
  "encryption_tech",
  "excavation_tech",
  "heavy_air",
  "industry",
  "infantry_weapons",
  "jet_technology",
  "light_air",
  "medium_air",
  "mot_rockets",
  "motorized_equipment",
  "naval_air",
  "naval_equipment",
  "naval_minelaying",
  "naval_mines",
  "nuclear",
  "radar_tech",
  "rocketry",
  "ship_modules_tech",
  "ss_tech",
  "support_tech",
  "synth_resources",
  "tactical_bomber",
  "train_tech",
] as const;
export const prep = ScriptedEffect("rq_bn_prep", (c: CountryScope) => {
  c.setTempVariable("rq_bpd", 0);
  if (c.variable("rq_bpg0") !== c.variable("rq_speed_shown")) c.setTempVariable("rq_bpd", 1);
  c.setVariable("rq_bpg0", c.variable("rq_speed_shown"));
  for (const signature of [
    { array: "rq_vanilla", length: 1, sum: 2 },
    { array: "rq_atk", length: 3, sum: 4 },
    { array: "rq_bnk", length: 5, sum: 6 },
    { array: "rq_bnu", length: 7, sum: 8 },
    { array: "rq_bnq", length: 9, sum: 10 },
  ]) {
    if (c.variable("rq_bpg" + signature.length) !== c.arrayLength(signature.array))
      c.setTempVariable("rq_bpd", 1);
    c.setVariable("rq_bpg" + signature.length, c.arrayLength(signature.array));
    c.setTempVariable("rq_sgv", 0);
    c.forEachValue(signature.array, { value: "sgv" }, (c) =>
      c.addTempVariable("rq_sgv", c.variable("sgv")),
    );
    if (c.variable("rq_bpg" + signature.sum) !== c.variable("rq_sgv"))
      c.setTempVariable("rq_bpd", 1);
    c.setVariable("rq_bpg" + signature.sum, c.variable("rq_sgv"));
  }
  c.setTempVariable("rq_sgv", 0);
  for (const weight of categoryWeights.map((name, index) => ({ name, weight: index + 1 })))
    c.addTempVariable("rq_sgv", c.variable("rq_cb_" + weight.name) * weight.weight);
  if (c.variable("rq_bpg11") !== c.variable("rq_sgv")) c.setTempVariable("rq_bpd", 1);
  c.setVariable("rq_bpg11", c.variable("rq_sgv"));
  if (c.variable("rq_bp_ok") !== 1) c.setTempVariable("rq_bpd", 1);
  c.clearArray("rq_bpsel");
  if (c.variable("rq_bpd") === 1) {
    c.setVariable("rq_bp_ok", 1);
    c.clearArray("rq_bdt");
    c.run(prepareAll);
  } else if (c.arrayLength("rq_bdt") > 0) {
    c.run(prepareUpdate);
    c.clearArray("rq_bdt");
  }
});
export const hold = ScriptedEffect("rq_bn_hold", (c: CountryScope) => {
  c.setTempVariable("rq_hold", 0);
  for (const state of ["t", "ya0", "bs", "tb", "base_cost", "start_months", "qi"])
    c.setTempVariable("rq_hold_saved_" + state, c.variable("rq_" + state));
  c.setTempVariable("rq_hb", c.variable("lb_i"));
  c.setTempVariable("rq_hp", 0);
  c.setTempVariable("rq_qi", -1);
  c.forEachValue("rq_queue", { value: "rq_hold_t", index: "rq_hold_i" }, (c) => {
    if (c.variable("rq_hold_t") === c.variable("rq_t")) {
      c.setTempVariable("rq_qi", c.variable("rq_hold_i"));
      c.setTempVariable("rq_hp", c.arrayAt("rq_qprog", c.variable("rq_hold_i")));
    }
  });
  c.run(value);
  c.setTempVariable("rq_h_mine", c.variable("rq_hv") * 1.05);
  c.setTempVariable("rq_h_thr", 0);
  c.setTempVariable("rq_h_for", 0);
  if (c.variable("rq_hb") < c.arrayLength("rq_bt1")) {
    c.setTempVariable("rq_h_thr", c.arrayAt("rq_bt1", c.variable("rq_hb")));
    c.setTempVariable("rq_h_for", c.arrayAt("rq_btt", c.variable("rq_hb")));
    if (
      c.variable("rq_qi") > -1 &&
      !c.arrayContains("rq_vanilla", c.variable("rq_t")) &&
      !c.arrayContains("rq_atk", c.variable("rq_t")) &&
      c.variable("rq_hv") >= c.variable("rq_h_thr")
    )
      c.setTempVariable("rq_h_thr", c.arrayAt("rq_bt2", c.variable("rq_hb")));
    if (c.variable("rq_h_for") === c.variable("rq_t"))
      c.setTempVariable("rq_h_for", c.arrayAt("rq_btt2", c.variable("rq_hb")));
  }
  if (c.variable("rq_h_thr") > c.variable("rq_h_mine")) c.setTempVariable("rq_hold", 1);
  for (const state of ["t", "ya0", "bs", "tb", "base_cost", "start_months", "qi"])
    c.setTempVariable("rq_" + state, c.variable("rq_hold_saved_" + state));
});
export const pickBonus = ScriptedEffect("rq_bn_pick", (c: CountryScope) => {
  c.run(technologyKinds);
  c.run(years);
  c.run(technologyBonus);
  c.setTempVariable("rq_bs", c.variable("rq_speed_shown") + c.variable("rq_tb"));
  c.setTempVariable("rq_bpi", -1);
  c.setTempVariable("rq_lbv", 0);
  c.setTempVariable("rq_lba", 0);
  c.setTempVariable("rq_bh_any", 0);
  c.setTempVariable("rq_bbest", c.variable("rq_bs") / (c.variable("rq_ya0") * 2 + 1) + 0.0005);
  c.forEachValue("rq_bnk", { value: "lb_v", index: "lb_i" }, (c) => {
    if (
      c.arrayContains("rq_tk", c.variable("lb_v")) &&
      (c.arrayAt("rq_bnu", c.variable("lb_i")) > 0 ||
        (c.variable("rq_bn_real") === 1 && c.arrayAt("rq_bnq", c.variable("lb_i")) > 0))
    ) {
      c.setTempVariable("rq_bya", c.variable("rq_ya0") - c.arrayAt("rq_bna", c.variable("lb_i")));
      c.clampTempVariable("rq_bya", { min: 0 });
      c.setTempVariable(
        "rq_bsc",
        (c.variable("rq_bs") + c.arrayAt("rq_bnv", c.variable("lb_i"))) /
          (c.variable("rq_bya") * 2 + 1),
      );
      c.setTempVariable("rq_hold", 0);
      if (c.variable("rq_bn_real") === 0 && c.variable("rq_bsc") > c.variable("rq_bbest")) {
        c.run(hold);
        if (c.variable("rq_hold") === 1) {
          c.setTempVariable("rq_bh_any", 1);
          c.setTempVariable("rq_bh_for", c.variable("rq_h_for"));
          c.setTempVariable("rq_bh_v", c.arrayAt("rq_bnv", c.variable("lb_i")));
        }
      }
      if (c.variable("rq_bsc") > c.variable("rq_bbest") && c.variable("rq_hold") === 0) {
        c.setTempVariable("rq_bbest", c.variable("rq_bsc"));
        c.setTempVariable("rq_bpi", c.variable("lb_i"));
        c.setTempVariable("rq_lbv", c.arrayAt("rq_bnv", c.variable("lb_i")));
        c.setTempVariable("rq_lba", c.arrayAt("rq_bna", c.variable("lb_i")));
      }
    }
  });
});
export const activeFind = ScriptedEffect("rq_bn_at_find", (c: CountryScope) => {
  c.setTempVariable("rq_ati", -1);
  c.forEachValue("rq_atk", { value: "at_v", index: "at_i" }, (c) => {
    if (c.variable("at_v") === c.variable("rq_t")) c.setTempVariable("rq_ati", c.variable("at_i"));
  });
});
export const activate = ScriptedEffect("rq_bn_activate", (c: CountryScope) => {
  c.run(activeFind);
  if (c.variable("rq_ati") === -1) {
    c.run(pickBonus);
    if (c.variable("rq_bpi") > -1) {
      c.arrayPush("rq_atk", c.variable("rq_t"));
      c.arrayPush("rq_atv", c.variable("rq_lbv"));
      c.arrayPush("rq_ata", c.variable("rq_lba"));
      if (c.arrayAt("rq_bnu", c.variable("rq_bpi")) > 0) {
        c.arraySet("rq_bnu", c.variable("rq_bpi"), c.arrayAt("rq_bnu", c.variable("rq_bpi")) - 1);
        if (c.variable("rq_bn_real") === 0)
          c.arraySet("rq_bnq", c.variable("rq_bpi"), c.arrayAt("rq_bnq", c.variable("rq_bpi")) + 1);
      } else
        c.arraySet("rq_bnq", c.variable("rq_bpi"), c.arrayAt("rq_bnq", c.variable("rq_bpi")) - 1);
    }
  }
  c.setTempVariable("rq_bn_for", -1);
});
export const assignedBonus = ScriptedEffect("rq_bonus_get", (c: CountryScope) => {
  if (c.variable("rq_bn_for") !== c.variable("rq_t")) {
    c.setTempVariable("rq_bn_for", c.variable("rq_t"));
    c.setTempVariable("rq_lbv", 0);
    c.setTempVariable("rq_lba", 0);
    c.run(activeFind);
    if (c.variable("rq_ati") > -1) {
      c.setTempVariable("rq_lbv", c.arrayAt("rq_atv", c.variable("rq_ati")));
      c.setTempVariable("rq_lba", c.arrayAt("rq_ata", c.variable("rq_ati")));
    } else if (!c.arrayContains("rq_vanilla", c.variable("rq_t"))) {
      c.setTempVariable("rq_bn_real", 0);
      c.run(pickBonus);
    }
    c.setTempVariable("rq_lbv_c", c.variable("rq_lbv"));
    c.setTempVariable("rq_lba_c", c.variable("rq_lba"));
  }
  c.setTempVariable("rq_lbv", c.variable("rq_lbv_c"));
  c.setTempVariable("rq_lba", c.variable("rq_lba_c"));
});
export const lanes = ScriptedEffect("rq_bn_lanes", (c: CountryScope) => {
  for (const column of ["rq_bhk", "rq_bhf", "rq_bhv"]) c.clearArray(column);
  c.forEachValue("rq_active", { value: "la_v" }, (c) => {
    if (!c.arrayContains("rq_atk", c.variable("la_v"))) {
      c.setTempVariable("rq_t", c.variable("la_v"));
      c.setTempVariable("rq_bn_real", 0);
      c.run(activate);
      if (c.variable("rq_bh_any") === 1 && !c.arrayContains("rq_atk", c.variable("la_v"))) {
        c.arrayPush("rq_bhk", c.variable("la_v"));
        c.arrayPush("rq_bhf", c.variable("rq_bh_for"));
        c.arrayPush("rq_bhv", c.variable("rq_bh_v"));
      }
    }
  });
});
export const check = ScriptedEffect("rq_bn_check", (c: CountryScope) => {
  c.setTempVariable("rq_bcd", 0);
  c.setTempVariable("rq_bn_vsum", 0);
  c.forEachValue("rq_vanilla", { value: "rq_bn_v" }, (c) =>
    c.addTempVariable("rq_bn_vsum", c.variable("rq_bn_v")),
  );
  if (
    c.variable("rq_bc_ok") !== 1 ||
    c.variable("rq_bcg0") !== c.arrayLength("rq_vanilla") ||
    c.variable("rq_bcg1") !== c.variable("rq_bn_vsum")
  )
    c.setTempVariable("rq_bcd", 1);
  c.setVariable("rq_bc_ok", 1);
  c.setVariable("rq_bcg0", c.arrayLength("rq_vanilla"));
  c.setVariable("rq_bcg1", c.variable("rq_bn_vsum"));
  if (c.variable("rq_bcd") === 1)
    c.forEachValue("rq_bnk", { value: "lb_v", index: "lb_i" }, (c) => {
      if (
        c.arrayAt("rq_bnu", c.variable("lb_i")) > 0 ||
        c.arrayAt("rq_bnq", c.variable("lb_i")) > 0
      ) {
        c.setTempVariable("rq_lbk", c.variable("lb_v"));
        c.run(present);
        if (c.variable("rq_lbp") === 0) {
          c.arraySet("rq_bnu", c.variable("lb_i"), 0);
          c.arraySet("rq_bnq", c.variable("lb_i"), 0);
        }
      }
    });
  if (c.variable("rq_no_progress") !== 1) {
    for (const award of bonusRecovery) {
      c.setTempVariable("rq_bn_engine", 0);
      if (c.triggers.has_tech_bonus({ category: award.category }))
        c.setTempVariable("rq_bn_engine", 1);
      if (award.technology !== "" && c.triggers.has_tech_bonus({ technology: award.technology }))
        c.setTempVariable("rq_bn_engine", 1);
      if (c.variable("rq_bn_engine") === 1) {
        c.setTempVariable("rq_cov", 0);
        for (const kind of award.coverage) {
          if (c.arrayContains("rq_bnk", kind)) c.setTempVariable("rq_cov", 1);
        }
        if (c.variable("rq_cov") === 0) {
          c.setTempVariable("rq_nb_k", award.kind);
          c.setTempVariable("rq_nb_v", award.speed);
          c.setTempVariable("rq_nb_a", award.ahead);
          c.setTempVariable("rq_nb_u", award.uses);
          c.run(add);
        }
      }
    }
    c.setTempVariable("rq_rmi", -1);
    c.forEachValue("rq_atk", { value: "at_v", index: "at_i" }, (c) => {
      c.setTempVariable("rq_t", c.variable("at_v"));
      c.run(owned);
      if (c.variable("rq_owned") === 1) c.setTempVariable("rq_rmi", c.variable("at_i"));
    });
    if (c.variable("rq_rmi") > -1)
      for (const column of ["rq_atk", "rq_atv", "rq_ata"])
        c.arrayRemoveAt(column, c.variable("rq_rmi"));
  }
  c.setTempVariable("rq_bn_for", -1);
});

export const poll = ScriptedEffect("rq_bn_poll", (c: CountryScope) => {
  for (const focus of focusBonuses) {
    if (
      (focus.tree === "" || c.triggers.has_focus_tree(focus.tree)) &&
      !c.triggers.hasCountryFlag(focus.flag) &&
      c.triggers.has_completed_focus(focus.focus)
    ) {
      c.effects.setCountryFlag(focus.flag);
      for (const award of focus.awards) {
        c.setTempVariable("rq_focus_eligible", 0);
        for (const situation of award.when) {
          c.setTempVariable("rq_focus_match", 1);
          for (const requirement of situation.requires)
            if (!bonusEligibility[requirement](c)) c.setTempVariable("rq_focus_match", 0);
          for (const exclusion of situation.excludes)
            if (bonusEligibility[exclusion](c)) c.setTempVariable("rq_focus_match", 0);
          if (c.variable("rq_focus_match") === 1) c.setTempVariable("rq_focus_eligible", 1);
        }
        if (c.variable("rq_focus_eligible") === 1) {
          c.setTempVariable("rq_nb_k", award.kind);
          c.setTempVariable("rq_nb_v", award.speed);
          c.setTempVariable("rq_nb_a", award.ahead);
          c.setTempVariable("rq_nb_u", award.uses);
          c.run(add);
        }
      }
    }
  }
});

// Focus/event callback entry points whose awards are not always observed by a
// completed-focus poll (including a special-project dependent industrial event).
export const danishConvertedCarriers = ScriptedEffect(
  "rq_mb_DEN_get_converted_air_carriers",
  (c: CountryScope) => {
    c.setTempVariable("rq_nb_k", 209);
    c.setTempVariable("rq_nb_v", 0.5);
    c.setTempVariable("rq_nb_a", 0);
    c.setTempVariable("rq_nb_u", 3);
    c.run(add);
  },
);
export const danishProperCarriers = ScriptedEffect(
  "rq_mb_DEN_get_proper_air_carriers",
  (c: CountryScope) => {
    c.setTempVariable("rq_nb_k", 209);
    c.setTempVariable("rq_nb_v", 0.5);
    c.setTempVariable("rq_nb_a", 0);
    c.setTempVariable("rq_nb_u", 2);
    c.run(add);
  },
);
export const italianIndustrialSuccess = ScriptedEffect(
  "rq_mb_ITA_missiolini_industrial_research_success_effect",
  (c: CountryScope) => {
    c.setTempVariable("rq_nb_k", 210);
    c.setTempVariable("rq_nb_v", 0.5);
    if (c.triggers.has_completed_focus("ITA_to_live_as_a_lion")) c.setTempVariable("rq_nb_v", 0.75);
    c.setTempVariable("rq_nb_a", 0);
    c.setTempVariable("rq_nb_u", 2);
    c.run(add);
  },
);
export const norwegianTank = ScriptedEffect(
  "rq_mb_NOR_rikstanken_creation_effect",
  (c: CountryScope) => {
    c.setTempVariable("rq_nb_k", 22);
    c.setTempVariable("rq_nb_v", 0.75);
    c.setTempVariable("rq_nb_a", 0);
    c.setTempVariable("rq_nb_u", 2);
    c.run(add);
  },
);
export const thaiOSS = ScriptedEffect(
  "rq_mb_SIA_thai_students_in_the_oss_effect",
  (c: CountryScope) => {
    if (!c.triggers.has_dlc("La Resistance")) {
      c.setTempVariable("rq_nb_k", 211);
      c.setTempVariable("rq_nb_v", 2);
      c.setTempVariable("rq_nb_a", 0);
      c.setTempVariable("rq_nb_u", 2);
      c.run(add);
    }
  },
);
export const sovietArmor = ScriptedEffect(
  "rq_mb_give_SOV_armor_research_bonuses",
  (c: CountryScope) => {
    if (!c.triggers.has_dlc("No Step Back")) {
      c.setTempVariable("rq_nb_k", 38);
      c.setTempVariable("rq_nb_v", 0);
      c.setTempVariable("rq_nb_a", 2);
      c.setTempVariable("rq_nb_u", 1);
      c.run(add);
      c.setTempVariable("rq_nb_k", 22);
      c.setTempVariable("rq_nb_v", 1);
      c.setTempVariable("rq_nb_a", 0);
      c.setTempVariable("rq_nb_u", 1);
      c.run(add);
    } else {
      c.setTempVariable("rq_nb_k", 22);
      c.setTempVariable("rq_nb_v", 1);
      c.setTempVariable("rq_nb_a", 0);
      c.setTempVariable("rq_nb_u", 2);
      c.run(add);
    }
  },
);
export const indianOrdnance = ScriptedEffect(
  "rq_mb_upgrade_ordance_factories_art_no_aat",
  (c: CountryScope) => {
    if (c.variable("global.gun_and_shell_level") === 3) {
      c.setTempVariable("rq_nb_k", 16);
      c.setTempVariable("rq_nb_v", 0.5);
      c.setTempVariable("rq_nb_a", 0);
      c.setTempVariable("rq_nb_u", 2);
      c.run(add);
    }
  },
);
