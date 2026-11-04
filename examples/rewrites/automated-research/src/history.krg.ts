import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { iconPlacement } from "./icon-state.krg.ts";
import { technologies } from "./technologies.krg.ts";

export const historyDay = ScriptedEffect("rq_st_day", (c: CountryScope) => {
  if (!c.triggers.hasCountryFlag("rq_st_on")) {
    c.effects.setCountryFlag("rq_st_on");
    c.setVariable("rq_st_sm", c.variable("rq_now_months"));
    c.setVariable("rq_st_sd", c.variable("rq_dom"));
  }
  c.addVariable("rq_st_days", 1);
  c.addVariable("rq_st_qd", c.arrayLength("rq_active"));
  if (c.variable("rq_bk_w") > 0) c.addVariable("rq_st_waste", c.variable("rq_bk_w"));
});
export const historySaved = ScriptedEffect("rq_st_saved", (c: CountryScope) => {
  c.setTempVariable(
    "rq_stv",
    (c.variable("rq_stv") * (c.variable("rq_ya0") * 2 + 1)) / c.variable("rq_speed_shown") - 1,
  );
  c.clampTempVariable("rq_stv", { min: 0 });
  c.addVariable("rq_st_save", c.variable("rq_stv"));
  c.clampVariable("rq_st_save", { min: 0 });
});
// Completion counts belong to the engine's native/mod completion paths. This
// record is shared by both and captures the date and sources before row removal.
export const historyRecord = ScriptedEffect("rq_st_done", (c: CountryScope) => {
  if (c.arrayAt("rq_qmio", c.variable("rq_qi")) > 0) c.addVariable("rq_st_mio", 1);
  if (c.arrayContains("rq_ap_set", c.variable("rq_t"))) c.addVariable("rq_st_ap", 1);
  if (c.variable("rq_ya0") > 0.01) c.addVariable("rq_st_ah", 1);
  if (c.variable("rq_st_f") < 1) {
    c.setVariable("rq_st_f", c.variable("rq_t"));
    c.setVariable("rq_st_fm", c.variable("rq_now_months"));
    c.setVariable("rq_st_fd", c.variable("rq_dom"));
  }
  c.setVariable("rq_st_l", c.variable("rq_t"));
  c.setVariable("rq_st_lm", c.variable("rq_now_months"));
  c.setVariable("rq_st_ld", c.variable("rq_dom"));
});
export const historyRefresh = ScriptedEffect("rq_st_refresh", (c: CountryScope) => {
  c.setVariable("rq_st_kn", 0);
  for (const tech of technologies) {
    if (c.triggers.has_tech(tech.id)) c.addVariable("rq_st_kn", 1);
  }
  c.setVariable("rq_st_tot", technologies.length - c.arrayLength("global.rq_hid"));
  c.setVariable("rq_st_n", c.variable("rq_st_nq") + c.variable("rq_st_ns"));
  c.setVariable("rq_st_sv", c.arrayLength("rq_svlen"));
  c.setVariable("rq_st_avg", c.variable("rq_st_days"));
  if (c.variable("rq_st_n") > 0) c.divideVariable("rq_st_avg", c.variable("rq_st_n"));
  for (const date of ["f", "l", "s"]) {
    c.setVariable("rq_st_" + date + "mo", c.variable("rq_st_" + date + "m") % 12);
    c.setVariable(
      "rq_st_" + date + "y",
      (c.variable("rq_st_" + date + "m") - c.variable("rq_st_" + date + "mo")) / 12,
    );
    c.effects.round_variable("rq_st_" + date + "y");
    c.setVariable("rq_st_" + date + "yy", c.variable("rq_st_" + date + "y") - 1900);
    c.setVariable("rq_st_" + date + "dd", c.variable("rq_st_" + date + "d") + 1);
  }
  for (const event of ["f", "l"]) {
    if (c.variable("rq_st_" + event) > 0) {
      c.setTempVariable("rq_t", c.variable("rq_st_" + event));
      c.run(iconPlacement);
      if (c.variable("rq_iw") > 99) {
        c.subtractTempVariable("rq_iw", 100);
        c.addTempVariable("rq_ix", -144);
        c.addTempVariable("rq_iy", event === "f" ? 143 : 213);
      } else {
        c.addTempVariable("rq_ix", -168);
        c.addTempVariable("rq_iy", event === "f" ? 134 : 204);
      }
      c.setVariable("rq_st_" + event + "xo", c.variable("rq_ix"));
      c.setVariable("rq_st_" + event + "y", c.variable("rq_iy"));
      c.setVariable("rq_st_" + event + "w", c.variable("rq_iw"));
    }
  }
});
