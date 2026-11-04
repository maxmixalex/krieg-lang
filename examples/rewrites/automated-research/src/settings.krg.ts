import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";

export const settings = [
  { key: 1, name: "rq_ap_cap", initial: 6, min: 1, max: 20 },
  { key: 2, name: "rq_ap_days", initial: 70, min: 10, max: 360 },
  { key: 3, name: "rq_ap_ldays", initial: 60, min: 0, max: 720 },
  { key: 4, name: "rq_ap_gl", initial: 1, min: 0, max: 3 },
  { key: 5, name: "rq_ap_gn", initial: 1, min: 0, max: 3 },
  { key: 6, name: "rq_ap_ga", initial: 1, min: 0, max: 3 },
  { key: 7, name: "rq_ap_gi", initial: 1, min: 0, max: 3 },
] as const;
export const defaults = ScriptedEffect("rq_ap_defaults", (c: CountryScope) => {
  if (c.variable("rq_ap_cfgv") !== 1) {
    for (const setting of settings) c.setVariable(setting.name, setting.initial);
    c.setVariable("rq_ap_jumpf", 2);
    c.setVariable("rq_ap_miof", 1);
    c.setVariable("rq_ap_jgf", 1);
    c.setVariable("rq_ap_xpf", 1);
    c.setVariable("rq_ap_cfgv", 1);
  }
  for (const name of ["rq_ap_xpf", "rq_ap_miof", "rq_ap_jgf"]) {
    if (c.variable(name) < 1) c.setVariable(name, 1);
  }
  if (c.variable("rq_ap_jumpf") < 1) c.setVariable("rq_ap_jumpf", 2);
  c.whileLoop(
    (c) => c.arrayLength("rq_ap_pr") < c.arrayLength("rq_ap_set"),
    (c) => c.arrayPush("rq_ap_pr", 0),
  );
});
export const change = ScriptedEffect("rq_aps_change", (c: CountryScope) => {
  for (const setting of settings) {
    if (c.variable("rq_apk") === setting.key) {
      c.addVariable(setting.name, c.variable("rq_apd"));
      c.clampVariable(setting.name, { min: setting.min, max: setting.max });
    }
  }
  c.setVariable("rq_ap_dirty", 1);
  c.setVariable("rq_ap_next", c.variable("rq_ap_last") + c.variable("rq_ap_days"));
});
export const reset = ScriptedEffect("rq_aps_reset", (c: CountryScope) => {
  c.setVariable("rq_ap_cfgv", 0);
  c.run(defaults);
  c.setVariable("rq_ap_dirty", 1);
  c.setVariable("rq_ap_next", c.variable("rq_ap_last") + c.variable("rq_ap_days"));
});
export const clearPriorities = ScriptedEffect("rq_aps_clearpri", (c: CountryScope) => {
  c.clearArray("rq_ap_pri");
  c.clearArray("rq_jgl");
  c.setVariable("rq_ap_prin", 0);
  c.setVariable("rq_ap_dirty", 1);
});
export function toggleSetting(c: CountryScope, name: string) {
  if (c.variable(name) === 2) c.setVariable(name, 1);
  else c.setVariable(name, 2);
  c.setVariable("rq_ap_dirty", 1);
}
