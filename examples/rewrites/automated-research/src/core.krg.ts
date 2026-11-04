import { snap as juggleSnap, follow as juggleFollow } from "./juggle.krg.ts";
import { uiState, setTreePosition, treeMarkers } from "./display-state.krg.ts";
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { technologies } from "./technologies.krg.ts";
import { capture, scanDlc } from "./graph.krg.ts";
import { calendar } from "./calendar.krg.ts";
import { defaults, toggleSetting } from "./settings.krg.ts";
import {
  clean,
  vanillaTop,
  vanillaTrack,
  lanes,
  categoryBonuses,
  shareScan,
  breakthroughTick,
  xpTick,
  xpSize,
} from "./progress.krg.ts";
import {
  find,
  remove,
  move,
  fixOrder,
  orderInfo,
  prune,
  clearEditable,
  treeEdit,
} from "./queue.krg.ts";
import { tick as plannerTick, forget, clean as plannerClean } from "./planner.krg.ts";
import {
  clearMio,
  upkeep as mioUpkeep,
  vanillaMio,
  refresh as mioRefresh,
  mslotSet,
  treeSlots,
} from "./mio.krg.ts";
import {
  poll as bonusPoll,
  prep as bonusPrep,
  check as bonusCheck,
  lanes as bonusLanes,
} from "./bonus.krg.ts";
import { saveClear, streamLoad } from "./storage.krg.ts";
import { refresh } from "./view.krg.ts";

// Refreshing the interface never advances research. A daily call takes the same
// observation/cleanup path, then advances each available lane exactly once.
function engineStep(c: CountryScope) {
  c.addVariable("rq_dirty", 1);
  if (c.variable("rq_build") !== 6895) {
    c.setVariable("rq_build", 6895);
    c.setVariable("rq_bp_ok", 0);
    c.forEachValue("rq_posprev", { value: "pv", index: "pj" }, (c) => {
      c.setTempVariable("rq_t", c.variable("pv"));
      c.setTempVariable("rq_val", 0);
      c.run(setTreePosition);
      if (c.arrayAt("rq_qmprev", c.variable("pj")) > 0) c.run(mslotSet);
    });
    for (const array of [
      "rq_queue",
      "rq_qprog",
      "rq_qmio",
      "rq_qsrc",
      "rq_posprev",
      "rq_qmprev",
      "rq_mslot",
      "rq_qrt",
      "rq_cix",
      "rq_ciy",
      "rq_ciw",
      "rq_cfs",
      "rq_ccs",
      "rq_done",
      "rq_donem",
    ])
      c.clearArray(array);
    c.run(saveClear);
    c.setVariable("rq_st_f", 0);
    c.setVariable("rq_st_l", 0);
    c.setVariable("rq_ml_t", 0);
    c.setVariable("rq_t_frame", 1);
    c.effects.clr_country_flag("rq_q_open");
    c.effects.clr_country_flag("rq_q_shown");
  }
  c.setVariable("rq_slots", c.variable("amount_research_slots"));
  c.run(defaults);
  c.run(calendar);
  c.run(capture);
  c.clearArray("rq_vanilla");
  c.forEachValue("rq_captured", { value: "cv" }, (c) =>
    c.arrayPush("rq_vanilla", c.variable("cv")),
  );
  c.setVariable("rq_speed_shown", c.variable("modifier@research_speed_factor") + 1);
  c.clampVariable("rq_speed_shown", { min: 0.1 });
  if (c.variable("rq_no_progress") !== 1 || !c.triggers.has_country_flag("rq_cb_ready")) {
    c.effects.setCountryFlag("rq_cb_ready");
    c.run(categoryBonuses);
  }
  if (c.variable("rq_cbd") < 1 || !c.triggers.has_country_flag("rq_sh_ready")) {
    c.effects.setCountryFlag("rq_sh_ready");
    c.run(shareScan);
    c.setVariable("rq_cbd", 7);
  } else if (c.variable("rq_no_progress") !== 1) c.subtractVariable("rq_cbd", 1);
  c.setTempVariable("rq_bn_for", -1);
  c.setTempVariable("rq_ya_for", -1);
  c.setTempVariable("rq_tb_for", -1);
  if (c.variable("rq_no_progress") !== 1 || !c.triggers.has_country_flag("rq_fp_ready")) {
    c.effects.setCountryFlag("rq_fp_ready");
    c.run(bonusPoll);
  }
  c.run(clean);
  c.run(vanillaTop);
  c.run(vanillaMio);
  c.run(vanillaTrack);
  c.run(bonusPrep);
  c.run(plannerTick);
  c.run(mioUpkeep);
  c.run(lanes);
  c.run(breakthroughTick);
  c.run(xpTick);
  c.run(bonusCheck);
  c.run(bonusLanes);
  if (c.arrayLength("rq_completed") > 0) c.run(mioUpkeep);
  c.setVariable("rq_tq_n", c.arrayLength("rq_queue"));
  if (c.triggers.has_country_flag("rq_q_open")) {
    c.setTempVariable("rq_daily", 1);
    c.run(refresh);
    c.setTempVariable("rq_daily", 0);
    c.run(uiState);
    c.run(treeSlots);
    c.run(mioRefresh);
  } else if (c.triggers.has_country_flag("rq_qmode")) {
    c.run(treeMarkers);
    c.run(treeSlots);
    c.run(mioRefresh);
  }
}
export const tick = ScriptedEffect("rq_tick", (c: CountryScope) => {
  c.setTempVariable("rq_no_progress", 0);
  engineStep(c);
});
export const update = ScriptedEffect("rq_update", (c: CountryScope) => {
  if (c.variable("rq_typing") === 1 && c.variable("rq_keep_typing") !== 1)
    c.setVariable("rq_typing", 0);
  c.setTempVariable("rq_no_progress", 1);
  c.run(fixOrder);
  engineStep(c);
  c.setTempVariable("rq_no_progress", 0);
});
export const init = ScriptedEffect("rq_init", (c: CountryScope) => {
  c.run(scanDlc);
  c.effects.setCountryFlag("rq_active");
  c.setVariable("rq_off", 0);
  c.setVariable("rq_bank", 1);
  c.setVariable("rq_ml_t", 0);
  c.effects.clr_country_flag("rq_q_open");
  c.effects.clr_country_flag("rq_q_shown");
  c.effects.clr_country_flag("rq_ml_auto");
  c.setVariable("rq_t_frame", 1);
  c.setVariable("rq_ml_autof", 1);
  for (const name of ["rq_dlg", "rq_typing", "rq_msg", "rq_msg_cn"]) c.setVariable(name, 0);
  c.clearArray("rq_catalogue");
  for (const tech of technologies) {
    if (!c.arrayContains("global.rq_hid", tech.index)) c.arrayPush("rq_catalogue", tech.index);
  }
  c.run(update);
  c.run(streamLoad);
});
export const treeClick = ScriptedEffect("rq_tree_click", (c: CountryScope) => {
  treeEdit(c);
  c.run(update);
});
export const clearAll = ScriptedEffect("rq_clr_all", (c: CountryScope) => {
  clearEditable(c);
  c.run(plannerClean);
  c.run(update);
});
export const rowRemove = ScriptedEffect("rq_row_remove", (c: CountryScope) => {
  c.setTempVariable("rq_t", c.arrayAt("rq_queue", c.variable("rq_k")));
  if (!(
    c.triggers.has_game_rule({ rule: "rq_lock_slots", option: "ON" }) &&
    c.arrayContains("rq_active", c.variable("rq_t"))
  )) {
    c.setTempVariable("rq_jg_only", c.arrayAt("rq_queue", c.variable("rq_k")));
    c.run(juggleSnap);
    c.setTempVariable("rq_qi", c.variable("rq_k"));
    c.setTempVariable("rq_t", c.arrayAt("rq_queue", c.variable("rq_k")));
    if (c.arrayContains("rq_ap_set", c.variable("rq_t"))) {
      c.arrayPush("rq_ap_ban", c.variable("rq_t"));
      c.run(forget);
    }
    c.run(clearMio);
    c.run(remove);
    c.run(juggleFollow);
    if (c.variable("rq_ml_t") === c.variable("rq_t")) c.setVariable("rq_ml_t", 0);
    c.run(prune);
    c.run(update);
  }
});
export const downFind = ScriptedEffect("rq_down_find", (c: CountryScope) => {
  c.setTempVariable("rq_dt", -1);
  c.setTempVariable("rq_dr", 2);
  c.setTempVariable("rq_dsb", 0);
  c.setTempVariable("rq_dsg", c.arrayAt("rq_qst", c.variable("rq_dk")));
  c.setTempVariable("rq_dwi", c.variable("rq_dvi") + 1);
  if (c.variable("rq_dwi") < c.arrayLength("rq_view")) c.setTempVariable("rq_dr", 3);
  c.whileLoop(
    (c) => c.variable("rq_dsb") === 0 && c.variable("rq_dwi") < c.arrayLength("rq_view"),
    (c) => {
      c.setTempVariable("dw", c.arrayAt("rq_view", c.variable("rq_dwi")));
      if (
        c.variable("rq_grp_on") === 1 &&
        c.variable("rq_dsg") < 3 &&
        c.arrayAt("rq_qst", c.variable("dw")) > 3
      )
        c.setTempVariable("rq_dr", 5);
      else if (
        c.variable("dw") > c.variable("rq_dk") &&
        c.arrayAt("rq_qpar", c.variable("dw")) < c.variable("rq_dk")
      ) {
        c.setTempVariable("rq_dt", c.variable("dw"));
        c.setTempVariable("rq_dr", 1);
        c.setTempVariable("rq_dsb", 1);
      }
      c.addTempVariable("rq_dwi", 1);
    },
  );
});
export const rowMove = ScriptedEffect("rq_row_move", (c: CountryScope) => {
  c.setTempVariable("rq_jg_only", 0);
  c.run(juggleSnap);
  c.setTempVariable("rq_t", c.arrayAt("rq_queue", c.variable("rq_k")));
  c.run(forget);
  c.run(orderInfo);
  c.setTempVariable("rq_qi", c.variable("rq_k"));
  c.setTempVariable("rq_qj", -1);
  c.setTempVariable("rq_opar", c.arrayAt("rq_qpar", c.variable("rq_k")));
  c.setTempVariable("rq_ovi", -1);
  c.setTempVariable("rq_opp", -1);
  c.forEachValue("rq_view", { value: "ov", index: "ovi" }, (c) => {
    if (c.variable("ov") === c.variable("rq_k")) c.setTempVariable("rq_ovi", c.variable("ovi"));
  });
  if (c.variable("rq_ovi") > 0) {
    c.setTempVariable("rq_ovj", c.variable("rq_ovi") - 1);
    c.setTempVariable("rq_opp", c.arrayAt("rq_view", c.variable("rq_ovj")));
  }
  if (c.variable("rq_sortn_f") > 1 || c.variable("rq_sortt_f") > 1) c.setTempVariable("rq_dir", 0);
  if (c.variable("rq_dir") === -1) {
    if (
      c.variable("rq_opp") > -1 &&
      c.variable("rq_opp") < c.variable("rq_k") &&
      c.variable("rq_opp") >= c.arrayLength("rq_vanilla") &&
      c.variable("rq_opar") < c.variable("rq_opp")
    )
      c.setTempVariable("rq_qj", c.variable("rq_opp"));
  } else if (c.variable("rq_dir") === -2) {
    c.setTempVariable("rq_qj", c.arrayLength("rq_vanilla"));
    if (c.variable("rq_opar") > -1 && c.variable("rq_opar") > c.variable("rq_qj"))
      c.setTempVariable("rq_qj", c.variable("rq_opar"));
    if (c.variable("rq_opar") > -1 && c.variable("rq_opar") === c.variable("rq_qj"))
      c.addTempVariable("rq_qj", 1);
    if (c.variable("rq_qj") >= c.variable("rq_k")) c.setTempVariable("rq_qj", -1);
  } else if (c.variable("rq_dir") === 1) {
    c.setTempVariable("rq_dk", c.variable("rq_k"));
    c.setTempVariable("rq_dvi", c.variable("rq_ovi"));
    c.run(downFind);
    if (c.variable("rq_dt") > -1) {
      c.setTempVariable("rq_qi", c.variable("rq_dt"));
      c.setTempVariable("rq_qj", c.variable("rq_k"));
    }
  } else if (c.variable("rq_dir") === 2) {
    c.clearArray("rq_mvl");
    c.clearArray("rq_dsc");
    c.arrayPush("rq_mvl", c.arrayAt("rq_queue", c.variable("rq_k")));
    c.forEachValue("rq_qpar", { value: "dpv", index: "dpi" }, (c) => {
      if (
        c.variable("dpi") > c.variable("rq_k") &&
        (c.variable("dpv") === c.variable("rq_k") || c.arrayContains("rq_dsc", c.variable("dpv")))
      ) {
        c.arrayPush("rq_dsc", c.variable("dpi"));
        c.arrayPush("rq_mvl", c.arrayAt("rq_queue", c.variable("dpi")));
      }
    });
    c.forEachValue("rq_mvl", { value: "mv" }, (c) => {
      c.setTempVariable("rq_t", c.variable("mv"));
      c.run(find);
      c.setTempVariable("rq_qj", c.arrayLength("rq_queue"));
      c.run(move);
    });
    c.setTempVariable("rq_qj", -1);
  }
  if (c.variable("rq_qj") > -1 && c.variable("rq_qj") !== c.variable("rq_qi")) c.run(move);
  c.run(juggleFollow);
  c.run(update);
});
export const groupClick = ScriptedEffect("rq_group_click", (c: CountryScope) => {
  if (c.variable("rq_grp_on") === 1) c.setVariable("rq_grp_on", 0);
  else c.setVariable("rq_grp_on", 1);
  c.run(update);
});
export const sortClick = ScriptedEffect("rq_sort_click", (c: CountryScope) => {
  c.setTempVariable("rq_f", c.variable("rq_sortn_f"));
  if (c.variable("rq_sb") === 2) c.setTempVariable("rq_f", c.variable("rq_sortt_f"));
  c.addTempVariable("rq_f", 1);
  if (c.variable("rq_f") > 3) c.setTempVariable("rq_f", 1);
  c.setVariable("rq_sortn_f", 1);
  c.setVariable("rq_sortt_f", 1);
  if (c.variable("rq_sb") === 1) c.setVariable("rq_sortn_f", c.variable("rq_f"));
  else c.setVariable("rq_sortt_f", c.variable("rq_f"));
  c.run(update);
});
const tabs = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const tabClear = ScriptedEffect("rq_tab_clear", (c: CountryScope) => {
  for (const tab of tabs) c.setVariable("rq_tabm" + tab, 0);
  c.setVariable("rq_tabn", 0);
});
export const tabFrames = ScriptedEffect("rq_tab_frames", (c: CountryScope) => {
  for (const tab of tabs) {
    c.setVariable("rq_tabf" + (tab - 1), 1);
    if (c.variable("rq_tabm" + tab) === 1) c.setVariable("rq_tabf" + (tab - 1), 2);
  }
});
export const tabCount = ScriptedEffect("rq_tab_count", (c: CountryScope) => {
  c.setVariable("rq_tabn", 0);
  for (const tab of tabs) {
    if (c.variable("rq_tabm" + tab) === 1) c.addVariable("rq_tabn", 1);
  }
  if (c.variable("rq_tabn") === 9) c.run(tabClear);
});
export const tabPick = ScriptedEffect("rq_tab_pick", (c: CountryScope) => {
  c.setTempVariable("rq_tw", 0);
  for (const tab of tabs) {
    if (c.variable("rq_tabk") === tab && c.variable("rq_tabm" + tab) === 1)
      c.setTempVariable("rq_tw", 1);
  }
  if (c.variable("rq_tw") === 1 && c.variable("rq_tabn") === 1) c.run(tabClear);
  else {
    c.run(tabClear);
    for (const tab of tabs) {
      if (c.variable("rq_tabk") === tab) c.setVariable("rq_tabm" + tab, 1);
    }
  }
  c.run(tabCount);
  c.run(tabFrames);
  c.run(update);
});
export const tabAdd = ScriptedEffect("rq_tab_add", (c: CountryScope) => {
  for (const tab of tabs) {
    if (c.variable("rq_tabk") === tab) {
      if (c.variable("rq_tabm" + tab) === 1) c.setVariable("rq_tabm" + tab, 0);
      else c.setVariable("rq_tabm" + tab, 1);
    }
  }
  c.run(tabCount);
  c.run(tabFrames);
  c.run(update);
});
export const xpToggle = ScriptedEffect("rq_xp_toggle", (c: CountryScope) => {
  c.run(xpSize);
  c.setTempVariable("rq_xpt", c.arrayAt("rq_queue", c.variable("rq_k")));
  if (c.arrayAt("rq_xpb", c.variable("rq_xpt")) !== 1) {
    c.setTempVariable("rq_xpn", 1);
    if (c.arrayAt("rq_xpw", c.variable("rq_xpt")) === 1) c.setTempVariable("rq_xpn", 0);
    c.arraySet("rq_xpw", c.variable("rq_xpt"), c.variable("rq_xpn"));
  }
  c.run(update);
});
export const xpPreference = ScriptedEffect("rq_aps_xp", (c: CountryScope) => {
  toggleSetting(c, "rq_ap_xpf");
  c.run(update);
});
