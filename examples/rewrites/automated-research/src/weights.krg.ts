import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { aiResearch } from "./ai-facts.krg.ts";
import { aiPolicies } from "./ai-policy.krg.ts";

// A preference is a base weight, ordered conditional adjustments, an optional
// technology strategy percentage, category demand and country capability factors.
export const rawWeight = ScriptedEffect("rq_preference_data", (c: CountryScope) => {
  c.setTempVariable("rq_ap_w", 1);
  c.setTempVariable("rq_ap_n", 1);
  c.dispatchByIndex(
    "rq_t",
    aiResearch,
    (c, preference) => {
      c.setTempVariable("rq_ap_w", preference.weight);
      for (const adjustment of preference.rules) {
        if (c.test(aiPolicies[adjustment.condition - 1])) {
          c.multiplyTempVariable("rq_ap_w", adjustment.multiplier);
          c.addTempVariable("rq_ap_w", adjustment.increment);
          c.clampTempVariable("rq_ap_w", { min: 0, max: 100000 });
        }
      }
      if (preference.specific !== "") {
        c.setTempVariable("rq_ap_g", c.variable("rq_apf_" + preference.specific) / 100 + 1);
        c.clampTempVariable("rq_ap_g", { min: 0 });
        c.multiplyTempVariable("rq_ap_w", c.variable("rq_ap_g"));
      }
      if (preference.strategy.length > 0) {
        c.setTempVariable("rq_ap_h", 0);
        for (const category of preference.strategy)
          c.addTempVariable("rq_ap_h", c.variable("rq_apn_" + category));
        c.multiplyTempVariable("rq_ap_h", 0.01);
        c.addTempVariable("rq_ap_h", 1);
        c.multiplyTempVariable("rq_ap_w", c.variable("rq_ap_h"));
      }
      c.clampTempVariable("rq_ap_w", { min: 0, max: 100000 });
      for (const factor of preference.profile)
        c.multiplyTempVariable("rq_ap_n", c.variable("rq_ap_" + factor));
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const weigh = ScriptedEffect("rq_ap_weigh", (c: CountryScope) => {
  c.run(rawWeight);
  c.multiplyTempVariable("rq_ap_w", c.variable("rq_ap_n"));
});
