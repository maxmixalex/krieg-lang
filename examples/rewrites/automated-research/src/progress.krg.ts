import { ScriptedEffect, countryTarget, type CountryScope } from "krieg-lang/hoi4";
import {
  clearMio,
  bonus as mioBonus,
  pay as mioPay,
  design as mioDesign,
  maintenance,
  vanillaMioSpeed,
} from "./mio.krg.ts";
import { bankApply, plan as jugglePlan } from "./juggle.krg.ts";
import { historyDay, historySaved, historyRecord } from "./history.krg.ts";
import { assignedBonus, activate as activateBonus } from "./bonus.krg.ts";
import { technologies } from "./technologies.krg.ts";
import { ideaResearchBonuses, sharingGroups } from "./research-facts.krg.ts";
import { xpTechnologies, breakthroughTechnologies } from "./progress-facts.krg.ts";
import { available, dead, technologyBonus } from "./graph.krg.ts";
import { grant, costAndDate, owned } from "./lookup.krg.ts";
import {
  find,
  read,
  remove,
  insert,
  setProgress,
  takeVanillaProgress,
  storeVanillaProgress,
} from "./queue.krg.ts";

const categories = [
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
export const categoryBonuses = ScriptedEffect("rq_cat_bonus", (c: CountryScope) => {
  for (const category of categories) c.setVariable("rq_cb_" + category, 0);
  for (const idea of ideaResearchBonuses) {
    if (c.triggers.has_idea(idea.id)) {
      for (const bonus of idea.bonuses) c.addVariable("rq_cb_" + bonus.category, bonus.value);
    }
  }
});
export const shareScan = ScriptedEffect("rq_share_scan", (c: CountryScope) => {
  c.clearArray("rq_shm");
  c.setVariable("rq_shp", 0);
  c.setTempVariable("rq_shf", 1 + c.variable("modifier@research_sharing_per_country_bonus_factor"));
  for (const group of sharingGroups) {
    if (c.triggers.is_in_tech_sharing_group(group.id)) {
      c.setTempVariable("rq_shb", group.bonus * c.variable("rq_shf"));
      if (c.variable("rq_shb") > c.variable("rq_shp"))
        c.setVariable("rq_shp", c.variable("rq_shb"));
      c.everyCountry(
        (other) =>
          !other.triggers.tag(countryTarget("ROOT")) &&
          other.triggers.is_in_tech_sharing_group(group.id),
        (other) => {
          if (!other.arrayContains("ROOT.rq_shm", countryTarget("THIS")))
            other.arrayPush("ROOT.rq_shm", countryTarget("THIS"));
        },
      );
    }
  }
});
export const technologyShare = ScriptedEffect("rq_tech_share", (c: CountryScope) => {
  c.setVariable("rq_tshn", 0);
  c.dispatchByIndex(
    "rq_t",
    technologies,
    (c, tech) => {
      c.forEachCountryInArray("rq_shm", (other) => {
        if (other.triggers.has_tech(tech.id)) c.addVariable("rq_tshn", 1);
      });
    },
    { first: 1, outOfRange: "clamp" },
  );
  c.setTempVariable("rq_tsh", c.variable("rq_tshn") * c.variable("rq_shp"));
});
export const yearsAhead = ScriptedEffect("rq_ya_calc", (c: CountryScope) => {
  c.run(costAndDate);
  c.setTempVariable(
    "rq_ya0",
    c.variable("rq_start_months") / 12 - c.variable("rq_now_y") - c.variable("rq_now_doy") / 365,
  );
  c.clampTempVariable("rq_ya0", { min: 0 });
});
export const computeCost = ScriptedEffect("rq_compute_cost", (c: CountryScope) => {
  c.run(assignedBonus);
  c.run(yearsAhead);
  c.setTempVariable("rq_ya", c.variable("rq_ya0") - c.variable("rq_lba"));
  c.clampTempVariable("rq_ya", { min: 0 });
  c.setTempVariable("rq_ahead", c.variable("rq_ya") * 2 + 1);
  c.setTempVariable("rq_cost", c.variable("rq_base_cost") * c.variable("rq_ahead"));
});
export const xpInfo = ScriptedEffect("rq_xp_info", (c: CountryScope) => {
  c.setTempVariable("rq_xpk", 0);
  c.setTempVariable("rq_xpc", 0);
  c.setTempVariable("rq_xpv", 0);
  for (const tech of xpTechnologies) {
    if (c.variable("rq_xpt") === tech.index) {
      c.setTempVariable("rq_xpk", tech.kind);
      c.setTempVariable("rq_xpc", tech.cost);
      c.setTempVariable("rq_xpv", tech.speed);
    }
  }
});
export const technologySpeed = ScriptedEffect("rq_tech_speed", (c: CountryScope) => {
  c.run(technologyBonus);
  c.run(technologyShare);
  c.run(assignedBonus);
  c.setTempVariable(
    "rq_tspd",
    c.variable("rq_speed_shown") +
      c.variable("rq_tb") +
      c.variable("rq_tsh") +
      c.variable("rq_lbv"),
  );
  if (
    c.arrayLength("rq_xpb") > c.variable("rq_t") &&
    c.arrayAt("rq_xpb", c.variable("rq_t")) === 1
  ) {
    c.setTempVariable("rq_xpt", c.variable("rq_t"));
    c.run(xpInfo);
    c.addTempVariable("rq_tspd", c.variable("rq_xpv"));
  }
  c.clampTempVariable("rq_tspd", { min: 0.1 });
});
// Integrate decreasing ahead-of-time penalties in 30-, 5-, then 1-day steps.
// This is the native estimator's algorithm, expressed once for every technology.
export const daysLeft = ScriptedEffect("rq_days_left", (c: CountryScope) => {
  c.setTempVariable("rq_x", 0);
  c.setTempVariable("rq_dd", c.variable("rq_ya") * 365 - 1);
  if (c.variable("rq_vdl") === 1) c.subtractTempVariable("rq_dd", 0.6);
  c.setTempVariable("rq_rk", c.variable("rq_r") * 1000);
  c.setTempVariable("rq_sk", c.variable("rq_spd") * 1000);
  c.setTempVariable("rq_dbig", 30);
  c.setTempVariable("rq_db", 0);
  c.whileLoop(
    (c) => c.variable("rq_db") === 0 && c.variable("rq_dd") > 0 && c.variable("rq_rk") > 0,
    (c) => {
      c.setTempVariable("rq_dst", c.variable("rq_dbig"));
      if (c.variable("rq_dd") < c.variable("rq_dst"))
        c.setTempVariable("rq_dst", c.variable("rq_dd"));
      c.setTempVariable("rq_dc", ((c.variable("rq_dd") - c.variable("rq_dst") / 2) * 2) / 365 + 1);
      c.setTempVariable("rq_dr", c.variable("rq_sk") / c.variable("rq_dc"));
      c.setTempVariable("rq_dm", c.variable("rq_dr") * c.variable("rq_dst"));
      if (c.variable("rq_dm") > c.variable("rq_rk")) {
        if (c.variable("rq_dbig") === 30) c.setTempVariable("rq_dbig", 5);
        else if (c.variable("rq_dbig") === 5) c.setTempVariable("rq_dbig", 1);
        else {
          c.addTempVariable("rq_x", c.variable("rq_rk") / c.variable("rq_dr"));
          c.setTempVariable("rq_rk", 0);
          c.setTempVariable("rq_db", 1);
        }
      } else {
        c.subtractTempVariable("rq_rk", c.variable("rq_dm"));
        c.addTempVariable("rq_x", c.variable("rq_dst"));
        c.subtractTempVariable("rq_dd", c.variable("rq_dst"));
      }
    },
  );
  if (c.variable("rq_rk") > 0) c.addTempVariable("rq_x", c.variable("rq_rk") / c.variable("rq_sk"));
});
export const cleanDo = ScriptedEffect("rq_clean_do", (c: CountryScope) => {
  c.setTempVariable("rq_dchk", 0);
  if (
    c.variable("rq_newt") === 1 ||
    c.variable("rq_cbd") === 7 ||
    c.variable("rq_no_progress") === 1
  )
    c.setTempVariable("rq_dchk", 1);
  c.setVariable("rq_newt", 0);
  c.setTempVariable("rq_ci", c.arrayLength("rq_queue"));
  c.whileLoop(
    (c) => c.variable("rq_ci") > 0,
    (c) => {
      c.subtractTempVariable("rq_ci", 1);
      c.setTempVariable("rq_t", c.arrayAt("rq_queue", c.variable("rq_ci")));
      c.run(owned);
      c.setTempVariable("rq_dead", 0);
      if (c.variable("rq_dchk") === 1) c.run(dead);
      if (c.variable("rq_owned") === 1) c.setVariable("rq_newt", 1);
      if (
        c.variable("rq_owned") === 1 ||
        c.variable("rq_dead") === 1 ||
        (c.arrayAt("rq_qsrc", c.variable("rq_ci")) === 1 &&
          !c.arrayContains("rq_vanilla", c.variable("rq_t")))
      ) {
        if (c.variable("rq_owned") === 1) {
          if (c.arrayContains("rq_vanprev", c.variable("rq_t"))) {
            c.addVariable("rq_st_ns", 1);
            c.setTempVariable("rq_qi", c.variable("rq_ci"));
            c.run(yearsAhead);
            c.run(historyRecord);
          }
          if (
            c.arrayAt("rq_qsrc", c.variable("rq_ci")) !== 1 &&
            !c.arrayContains("rq_done", c.variable("rq_t"))
          ) {
            c.arrayPush("rq_done", c.variable("rq_t"));
            c.arrayPush("rq_donem", c.arrayAt("rq_qmio", c.variable("rq_ci")));
          }
        }
        if (c.variable("rq_owned") === 0 && c.arrayContains("rq_vanprev", c.variable("rq_t"))) {
          c.setTempVariable("rq_val", c.arrayAt("rq_qprog", c.variable("rq_ci")));
          c.run(storeVanillaProgress);
        }
        c.run(clearMio);
        c.setTempVariable("rq_qi", c.variable("rq_ci"));
        c.run(remove);
      }
    },
  );
});
export const clean = ScriptedEffect("rq_clean", (c: CountryScope) => {
  c.setTempVariable("rq_cl_sum", 0);
  c.forEachValue("rq_vanilla", { value: "clv" }, (c) =>
    c.addTempVariable("rq_cl_sum", c.variable("clv")),
  );
  if (!(
    c.variable("rq_no_progress") === 1 &&
    c.variable("rq_cl_v") === c.variable("rq_rows_v") &&
    c.variable("rq_cl_d") === c.variable("global.num_days") &&
    c.variable("rq_cl_vn") === c.arrayLength("rq_vanilla") &&
    c.variable("rq_cl_vs") === c.variable("rq_cl_sum")
  )) {
    c.run(cleanDo);
    c.setVariable("rq_cl_v", c.variable("rq_rows_v"));
    c.setVariable("rq_cl_d", c.variable("global.num_days"));
    c.setVariable("rq_cl_vn", c.arrayLength("rq_vanilla"));
    c.setVariable("rq_cl_vs", c.variable("rq_cl_sum"));
  }
});
export const vanillaTop = ScriptedEffect("rq_vanilla_top", (c: CountryScope) => {
  c.setTempVariable("rq_top", 0);
  c.forEachValue("rq_vanilla", { value: "cv" }, (c) => {
    c.setTempVariable("rq_t", c.variable("cv"));
    c.run(find);
    if (c.variable("rq_qi") > -1) {
      c.run(read);
      c.run(remove);
    } else {
      c.setTempVariable("rq_ins_p", 0);
      c.setTempVariable("rq_ins_m", 0);
      c.setTempVariable("rq_ins_s", 1);
    }
    c.setTempVariable("rq_ins_t", c.variable("cv"));
    c.setTempVariable("rq_qi", c.variable("rq_top"));
    c.run(insert);
    c.addTempVariable("rq_top", 1);
  });
});
export const vanillaTrack = ScriptedEffect("rq_vanilla_track", (c: CountryScope) => {
  c.forEachValue("rq_queue", { value: "vq", index: "vi" }, (c) => {
    if (c.arrayContains("rq_vanilla", c.variable("vq"))) {
      c.setTempVariable("rq_qi", c.variable("vi"));
      c.setTempVariable("rq_val", c.arrayAt("rq_qprog", c.variable("vi")));
      c.setTempVariable("rq_t", c.variable("vq"));
      if (!c.arrayContains("rq_vanprev", c.variable("vq"))) {
        c.setTempVariable("rq_bn_real", 1);
        c.run(activateBonus);
      }
      c.run(computeCost);
      c.run(technologySpeed);
      c.run(vanillaMioSpeed);
      c.setTempVariable("rq_vspeed", c.variable("rq_tspd") / c.variable("rq_ahead"));
      c.clampTempVariable("rq_vspeed", { min: 0.1 });
      if (!c.arrayContains("rq_vanprev", c.variable("vq"))) {
        c.setTempVariable("rq_val", c.variable("rq_vspeed") * c.variable("rq_bank"));
        c.run(takeVanillaProgress);
        c.addTempVariable("rq_val", c.variable("rq_gpv_r"));
      }
      if (c.variable("rq_no_progress") !== 1) {
        c.addTempVariable("rq_val", c.variable("rq_vspeed"));
        c.setTempVariable("rq_stv", c.variable("rq_tspd") / c.variable("rq_ahead"));
        c.run(historySaved);
      }
      c.run(setProgress);
    }
  });
  if (c.arrayLength("rq_vanilla") >= c.variable("rq_slots")) c.setVariable("rq_bank", 0);
  c.forEachValue("rq_vanprev", { value: "gv" }, (c) => {
    if (!c.arrayContains("rq_vanilla", c.variable("gv"))) {
      c.setTempVariable("rq_t", c.variable("gv"));
      c.run(owned);
      if (c.variable("rq_owned") === 0) {
        c.run(find);
        if (c.variable("rq_qi") > -1) {
          c.setTempVariable("rq_val", c.arrayAt("rq_qprog", c.variable("rq_qi")));
          c.run(storeVanillaProgress);
        }
      }
    }
  });
  c.clearArray("rq_vanprev");
  c.forEachValue("rq_vanilla", { value: "vq" }, (c) => c.arrayPush("rq_vanprev", c.variable("vq")));
  if (c.variable("rq_no_progress") !== 1 && c.arrayLength("rq_vanilla") < c.variable("rq_slots")) {
    c.addVariable("rq_bank", 1);
    c.clampVariable("rq_bank", { max: 30 });
  }
});
export const bankPop = ScriptedEffect("rq_bk_pop", (c: CountryScope) => {
  c.setTempVariable("rq_bk_v", 0);
  c.setTempVariable("rq_bk_i", -1);
  c.forEachValue("rq_lb", { value: "blv", index: "bli" }, (c) => {
    if (c.variable("blv") > c.variable("rq_bk_v")) {
      c.setTempVariable("rq_bk_v", c.variable("blv"));
      c.setTempVariable("rq_bk_i", c.variable("bli"));
    }
  });
  if (c.variable("rq_bk_i") === -1 && c.arrayLength("rq_lb") > 0) c.setTempVariable("rq_bk_i", 0);
  if (c.variable("rq_bk_i") > -1) c.arrayRemoveAt("rq_lb", c.variable("rq_bk_i"));
});
export const bankTrack = ScriptedEffect("rq_bk_track", (c: CountryScope) => {
  c.setTempVariable("rq_bk_k", 0);
  c.forEachValue("rq_active", { value: "bav" }, (c) => {
    if (!c.arrayContains("rq_bk_prev", c.variable("bav"))) c.addTempVariable("rq_bk_k", 1);
  });
  c.forEachValue("rq_bk_prev", { value: "bpv" }, (c) => {
    if (!c.arrayContains("rq_active", c.variable("bpv"))) c.subtractTempVariable("rq_bk_k", 1);
  });
  c.setTempVariable("rq_bk_n", c.variable("rq_lanes_n") - c.variable("rq_bk_ln"));
  c.clampTempVariable("rq_bk_n", { min: 0 });
  c.subtractTempVariable("rq_bk_k", c.variable("rq_bk_n"));
  c.forEachValue("rq_active", { value: "bav" }, (c) => {
    if (c.variable("rq_bk_k") > 0 && !c.arrayContains("rq_bk_prev", c.variable("bav"))) {
      c.subtractTempVariable("rq_bk_k", 1);
      c.run(bankPop);
      if (c.variable("rq_bk_v") > 0) {
        c.arrayPush("rq_bkp_t", c.variable("bav"));
        c.arrayPush("rq_bkp_v", c.variable("rq_bk_v"));
      }
    }
  });
  c.setTempVariable("rq_bk_k", 0);
  c.whileLoop(
    (c) => c.arrayLength("rq_lb") > c.variable("rq_lanes") && c.variable("rq_bk_k") < 50,
    (c) => {
      c.addTempVariable("rq_bk_k", 1);
      c.run(bankPop);
    },
  );
  c.whileLoop(
    (c) => c.arrayLength("rq_lb") < c.variable("rq_lanes") && c.variable("rq_bk_k") < 100,
    (c) => {
      c.addTempVariable("rq_bk_k", 1);
      c.arrayPush("rq_lb", 0);
    },
  );
  c.setTempVariable("rq_bk_w", 0);
  if (c.variable("rq_no_progress") !== 1) {
    c.forEachValue("rq_lb", { value: "blv", index: "bli" }, (c) => {
      if (c.variable("blv") < 30) c.arraySet("rq_lb", c.variable("bli"), c.variable("blv") + 1);
      else c.addTempVariable("rq_bk_w", 1);
    });
  }
  c.clearArray("rq_bk_prev");
  c.forEachValue("rq_active", { value: "bav" }, (c) =>
    c.arrayPush("rq_bk_prev", c.variable("bav")),
  );
  c.setVariable("rq_bk_ln", c.variable("rq_lanes_n"));
});
export const lanes = ScriptedEffect("rq_lanes", (c: CountryScope) => {
  c.setVariable("rq_lanes_n", c.variable("rq_slots") - c.arrayLength("rq_vanilla"));
  c.clampVariable("rq_lanes_n", { min: 0 });
  c.setTempVariable("rq_lanes", c.variable("rq_lanes_n"));
  for (const array of [
    "rq_active",
    "rq_completed",
    "rq_lh_t",
    "rq_lh_i",
    "rq_lh_s",
    "rq_lh_c",
    "rq_lh_b",
    "rq_lh_y",
    "rq_mppc",
  ])
    c.clearArray(array);
  c.setTempVariable("rq_b1", 0);
  c.forEachValue("rq_queue", { value: "qv", index: "qi", break: "rq_b1" }, (c) => {
    if (c.variable("rq_lanes") < 1) c.setTempVariable("rq_b1", 1);
    else if (!c.arrayContains("rq_vanilla", c.variable("qv"))) {
      c.setTempVariable("rq_t", c.variable("qv"));
      c.run(available);
      if (c.variable("rq_avail") === 1) {
        c.arrayPush("rq_active", c.variable("qv"));
        if (c.arrayAt("rq_qmio", c.variable("qi")) > 0)
          c.arrayPush("rq_mppc", c.arrayAt("rq_qmio", c.variable("qi")));
        c.subtractTempVariable("rq_lanes", 1);
        c.setTempVariable("rq_bn_real", 0);
        c.run(activateBonus);
        if (c.variable("rq_no_progress") !== 1) {
          c.run(computeCost);
          c.run(technologySpeed);
          c.setTempVariable("rq_spd", c.variable("rq_tspd"));
          if (c.arrayAt("rq_qmio", c.variable("qi")) > 0) {
            c.run(mioBonus);
            c.addTempVariable("rq_spd", c.variable("rq_mb"));
          }
          c.divideTempVariable("rq_spd", c.variable("rq_ahead"));
          c.setTempVariable("rq_stv", c.variable("rq_spd"));
          c.clampTempVariable("rq_spd", { min: 0.1 });
          c.run(historySaved);
          c.arrayPush("rq_lh_b", c.variable("rq_spd") * c.variable("rq_ahead"));
          c.arrayPush("rq_lh_y", c.variable("rq_ya"));
          c.arrayPush("rq_lh_t", c.variable("qv"));
          c.arrayPush("rq_lh_i", c.variable("qi"));
          c.arrayPush("rq_lh_s", c.variable("rq_spd"));
          c.arrayPush("rq_lh_c", c.variable("rq_base_cost"));
        }
      }
    }
  });
  c.run(bankTrack);
  c.run(bankApply);
  c.run(jugglePlan);
  if (c.variable("rq_no_progress") !== 1) {
    c.forEachValue("rq_lh_t", { value: "lhv", index: "lhi" }, (c) => {
      if (!c.arrayContains("rq_jga", c.variable("lhv"))) {
        c.setTempVariable("rq_qi", c.arrayAt("rq_lh_i", c.variable("lhi")));
        c.setTempVariable(
          "rq_val",
          c.arrayAt("rq_qprog", c.variable("rq_qi")) + c.arrayAt("rq_lh_s", c.variable("lhi")),
        );
        c.run(setProgress);
        c.setTempVariable("rq_completed_progress", c.variable("rq_val") + 0.001);
        if (
          c.variable("rq_completed_progress") > c.arrayAt("rq_lh_c", c.variable("lhi")) ||
          c.triggers.has_country_flag("rq_cheat")
        )
          c.arrayPush("rq_completed", c.variable("lhv"));
      }
    });
    c.forEachValue("rq_jg_fire", { value: "jfv" }, (c) => {
      c.arrayPush("rq_jg_u", c.variable("jfv"));
      c.setTempVariable("rq_jg_fi", -1);
      c.forEachValue("rq_jg_r", { value: "jrv", index: "jri" }, (c) => {
        if (c.variable("jrv") === c.variable("jfv"))
          c.setTempVariable("rq_jg_fi", c.variable("jri"));
      });
      if (c.variable("rq_jg_fi") > -1) {
        c.arrayRemoveAt("rq_jg_r", c.variable("rq_jg_fi"));
        c.arrayRemoveAt("rq_jg_d", c.variable("rq_jg_fi"));
      }
    });
    c.run(maintenance);
    c.run(historyDay);
    c.forEachValue("rq_completed", { value: "dv" }, (c) => {
      c.setTempVariable("rq_t", c.variable("dv"));
      c.run(find);
      if (c.variable("rq_qi") > -1) {
        c.addVariable("rq_st_nq", 1);
        c.run(yearsAhead);
        c.run(historyRecord);
        c.setTempVariable("rq_hasmio", 0);
        if (c.arrayAt("rq_qmio", c.variable("rq_qi")) > 0) {
          c.run(mioPay);
          c.setTempVariable("rq_hasmio", 1);
        }
        c.run(grant);
        c.setVariable("rq_newt", 1);
        if (c.variable("rq_hasmio") === 1) {
          c.run(mioDesign);
          c.run(clearMio);
        }
        c.run(remove);
        c.arrayRemoveValue("rq_active", c.variable("dv"));
      }
    });
  } else c.run(maintenance);
});
export const breakthroughTick = ScriptedEffect("rq_bt_tick", (c: CountryScope) => {
  if (c.triggers.has_dlc("Gotterdammerung") && c.variable("rq_no_progress") !== 1) {
    c.forEachValue("rq_active", { value: "btv" }, (c) => {
      for (const tech of breakthroughTechnologies) {
        if (c.variable("btv") === tech.index)
          for (const grant of tech.grants) c.addVariable("rq_bt_" + grant.kind, grant.value);
      }
    });
    for (const kind of ["air", "land", "naval", "nuclear"]) {
      c.whileLoop(
        (c) => c.variable("rq_bt_" + kind) > 9,
        (c) => {
          c.effects.add_breakthrough_progress({
            specialization: "specialization_" + kind,
            value: 0.001,
          });
          c.subtractVariable("rq_bt_" + kind, 10);
        },
      );
    }
  }
});
export const xpSize = ScriptedEffect("rq_xp_size", (c: CountryScope) => {
  for (const array of ["rq_xpw", "rq_xpb"])
    c.whileLoop(
      (c) => c.arrayLength(array) < 553,
      (c) => c.arrayPush(array, 0),
    );
});
export const xpPay = ScriptedEffect("rq_xp_pay", (c: CountryScope) => {
  for (const tech of xpTechnologies) {
    if (c.variable("rq_xpt") === tech.index && !(c.navyExperience < tech.cost)) {
      c.effects.navy_experience(-tech.cost);
      c.setTempVariable("rq_xpok", 1);
    }
  }
});
export const xpTick = ScriptedEffect("rq_xp_tick", (c: CountryScope) => {
  c.run(xpSize);
  c.forEachValue("rq_active", { value: "xav" }, (c) => {
    if (c.arrayAt("rq_xpb", c.variable("xav")) !== 1) {
      c.setTempVariable("rq_xpt", c.variable("xav"));
      c.run(xpInfo);
      c.setTempVariable("rq_xpok", 0);
      if (
        c.arrayAt("rq_xpw", c.variable("xav")) === 1 ||
        (c.variable("rq_ap_xpf") === 2 && c.variable("rq_xpk") === 2)
      )
        c.run(xpPay);
      if (c.variable("rq_xpok") === 1) {
        c.arraySet("rq_xpb", c.variable("xav"), 1);
        c.setVariable("rq_rfull", 1);
      }
    }
  });
});
