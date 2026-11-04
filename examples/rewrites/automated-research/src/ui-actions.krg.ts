import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { init, update, tabClear, tabFrames } from "./core.krg.ts";
import { defaults } from "./settings.krg.ts";
import { replan } from "./planner.krg.ts";
import { historyRefresh } from "./history.krg.ts";
import { saveDo } from "./storage.krg.ts";

export const apsClose = ScriptedEffect("rq_aps_close", (c: CountryScope) => {
  c.setVariable("rq_ap_win", 0);
  if (c.variable("rq_ap_dirty") === 1 && c.triggers.has_country_flag("rq_ap_on")) c.run(replan);
  c.setVariable("rq_ap_dirty", 0);
});
export const apsToggle = ScriptedEffect("rq_aps_toggle", (c: CountryScope) => {
  if (c.variable("rq_ap_win") === 1) c.run(apsClose);
  else {
    c.run(defaults);
    c.setVariable("rq_ap_win", 1);
    c.setVariable("rq_ap_prin", c.arrayLength("rq_ap_pri"));
    c.setVariable("rq_ml_t", 0);
    c.setVariable("rq_dlg", 0);
  }
  c.run(update);
});
export const queueToggle = ScriptedEffect("rq_queue_toggle", (c: CountryScope) => {
  if (!c.triggers.has_country_flag("rq_active")) c.run(init);
  if (c.triggers.has_country_flag("rq_q_open")) {
    c.effects.clr_country_flag("rq_q_open");
    c.effects.clr_country_flag("rq_q_shown");
    c.setVariable("rq_t_frame", 1);
    c.run(tabClear);
    c.run(tabFrames);
    c.setVariable("rq_dlg", 0);
    c.setVariable("rq_clr", 0);
    c.run(apsClose);
    c.setVariable("rq_typing", 0);
  } else {
    c.run(tabFrames);
    if (c.variable("rq_sortn_f") < 1) c.setVariable("rq_sortn_f", 1);
    if (c.variable("rq_sortt_f") < 1) c.setVariable("rq_sortt_f", 1);
    c.effects.setCountryFlag("rq_q_open");
    c.effects.setCountryFlag("rq_q_shown");
    c.setVariable("rq_t_frame", 2);
  }
  c.run(update);
});
export const modeToggle = ScriptedEffect("rq_mode_toggle", (c: CountryScope) => {
  if (c.variable("rq_typing") < 1) {
    if (!c.triggers.has_country_flag("rq_active")) c.run(init);
    if (c.triggers.has_country_flag("rq_qmode")) {
      c.effects.clr_country_flag("rq_qmode");
      c.setVariable("rq_ml_t", 0);
    } else c.effects.setCountryFlag("rq_qmode");
    c.run(update);
  }
});
export const dialogClose = ScriptedEffect("rq_dlg_close", (c: CountryScope) => {
  c.setVariable("rq_dlg", 0);
  c.setVariable("rq_msg", 0);
  if (c.variable("rq_typing") === 2) c.setVariable("rq_typing", 0);
});
export const clearOpen = ScriptedEffect("rq_clr_open", (c: CountryScope) => {
  c.setVariable("rq_clrn", c.arrayLength("rq_queue") - c.arrayLength("rq_vanilla"));
  if (c.triggers.has_game_rule({ rule: "rq_lock_slots", option: "ON" }))
    c.subtractVariable("rq_clrn", c.arrayLength("rq_active"));
  if (c.variable("rq_clrn") > 0) {
    c.setVariable("rq_clr", 1);
    c.setVariable("rq_ml_t", 0);
    c.setVariable("rq_dlg", 0);
    c.run(apsClose);
  }
});
export const dialogToggle = ScriptedEffect("rq_dlg_toggle", (c: CountryScope) => {
  if (c.variable("rq_dlg") === c.variable("rq_dk")) c.run(dialogClose);
  else {
    c.setVariable("rq_msg", 0);
    c.setVariable("rq_dlg", c.variable("rq_dk"));
    c.run(apsClose);
    c.setVariable("rq_ml_t", 0);
    c.setVariable("rq_typing", 0);
    if (c.variable("rq_dk") === 3) c.run(historyRefresh);
    if (c.variable("rq_dk") === 1) {
      c.clearArray("rq_tx_n");
      c.setVariable("rq_sv_n", c.arrayLength("rq_done"));
      c.forEachValue("rq_qsrc", { value: "rq_src" }, (c) => {
        if (c.variable("rq_src") < 1) c.addVariable("rq_sv_n", 1);
      });
    }
  }
});
export const typeChar = ScriptedEffect("rq_type_char", (c: CountryScope) => {
  if (c.variable("rq_caps") === 1 && c.variable("rq_ch") < 27) c.addTempVariable("rq_ch", 26);
  if (c.variable("rq_typing") === 1 && c.arrayLength("rq_tx_s") < 16) {
    c.arrayPush("rq_tx_s", c.variable("rq_ch"));
    c.setTempVariable("rq_keep_typing", 1);
    c.run(update);
  } else if (c.variable("rq_typing") === 2 && c.arrayLength("rq_tx_n") < 24)
    c.arrayPush("rq_tx_n", c.variable("rq_ch"));
});
export const typeBack = ScriptedEffect("rq_type_back", (c: CountryScope) => {
  if (c.variable("rq_typing") === 1 && c.arrayLength("rq_tx_s") > 0) {
    c.arrayRemoveAt("rq_tx_s", c.arrayLength("rq_tx_s") - 1);
    c.setTempVariable("rq_keep_typing", 1);
    c.run(update);
  } else if (c.variable("rq_typing") === 2 && c.arrayLength("rq_tx_n") > 0)
    c.arrayRemoveAt("rq_tx_n", c.arrayLength("rq_tx_n") - 1);
});
export const typeEnter = ScriptedEffect("rq_type_enter", (c: CountryScope) => {
  if (c.variable("rq_typing") === 2 && c.variable("rq_dlg") === 1) c.run(saveDo);
  else c.setVariable("rq_typing", 0);
});
export const typeEscape = ScriptedEffect("rq_type_escape", (c: CountryScope) => {
  if (c.variable("rq_typing") === 2 && c.variable("rq_dlg") === 1) c.run(dialogClose);
  else c.setVariable("rq_typing", 0);
});
export const guideDaily = ScriptedEffect("rq_guide_daily", (c: CountryScope) => {
  if (!c.triggers.has_country_flag("rq_guide_seen")) {
    c.effects.setCountryFlag("rq_guide_seen");
    c.effects.setCountryFlag("rq_guide");
    c.setVariable("rq_gtab", 0);
  }
  if (c.arrayLength("rq_queue") > 0) c.effects.clr_country_flag("rq_alert_off");
  c.addVariable("rq_dirty", 1);
});
