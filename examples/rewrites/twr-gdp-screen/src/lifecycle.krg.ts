import { OnAction, ScriptedEffect, countryTarget } from "krieg-lang/hoi4";
import { calculateGDP, growth } from "./economy.krg";

export const initialEstimate = ScriptedEffect("gdp_init_calc", (c) => {
  c.setTempVariable("factory_count_temp", c.variable("num_of_civilian_factories"));
  c.setTempVariable("pop_k_temp", c.variable("max_manpower_k"));
  if (c.variable("pop_k_temp") > 150000) c.multiplyTempVariable("pop_k_temp", 0.0009);
  if (c.variable("pop_k_temp") < 15000) c.multiplyTempVariable("pop_k_temp", 0.007);
  if (c.variable("pop_k_temp") < 30000 && c.variable("pop_k_temp") > 15000)
    c.multiplyTempVariable("pop_k_temp", 0.004);
  if (c.variable("pop_k_temp") < 90000 && c.variable("pop_k_temp") > 30000)
    c.multiplyTempVariable("pop_k_temp", 0.002);
  if (c.variable("pop_k_temp") < 150000 && c.variable("pop_k_temp") > 90000)
    c.multiplyTempVariable("pop_k_temp", 0.001);
  c.multiplyTempVariable("factory_count_temp", c.variable("pop_k_temp"));
  c.setVariable("gdp_calc", c.variable("factory_count_temp"));
});
const adjustments = [
  { idea: "undisturbed_isolation", amount: -0.002 },
  { idea: "isolation", amount: -0.001 },
  { idea: "civilian_economy", amount: 0.005 },
  { idea: "low_economic_mobilisation", amount: 0.002 },
  { idea: "partial_economic_mobilisation", amount: 0.001 },
  { idea: "war_economy", amount: -0.002 },
  { idea: "tot_economic_mobilisation", amount: -0.004 },
  { idea: "free_trade", amount: 0.003 },
  { idea: "export_focus", amount: 0.004 },
  { idea: "limited_exports", amount: 0.001 },
  { idea: "closed_economy", amount: -0.001 },
] as const;
export const legacyGrowth = ScriptedEffect("gdp_growth_calc", (c) => {
  c.everyCountry((other) => {
    other.setVariable("gdp_growth_calc", 0.01);
    for (const adjustment of adjustments)
      if (other.triggers.hasIdea(adjustment.idea))
        other.addVariable("gdp_growth_calc", adjustment.amount);
    other.setTempVariable("gdp_calc_temp", other.variable("gdp_calc"));
    other.multiplyTempVariable("gdp_calc_temp", other.variable("gdp_growth_calc"));
    // Retain the original temp write rather than changing it to persistent gdp_calc.
    other.addTempVariable("gdp_calc", other.variable("gdp_calc_temp"));
  });
});
export const lifecycle = [
  OnAction({
    id: "on_startup",
    outputPath: "common/on_actions/TWR_GDP_on_actions.txt",
    effect: [
      (world) => {
        world.everyCountry((c) => {
          if (!c.arrayContains("global.GDP_list_array", countryTarget("THIS")))
            c.arrayPush("global.GDP_list_array", countryTarget("THIS"));
          // Preserve the author's explicit invocation token `no`.
          c.run(calculateGDP, false);
          c.run(growth);
          c.run(legacyGrowth);
        });
      },
    ],
  }),
  OnAction({
    id: "on_monthly",
    outputPath: "common/on_actions/TWR_GDP_on_actions.txt",
    effect: [
      (c) => {
        c.run(calculateGDP);
        c.run(growth);
        c.effects.force_update_map_mode({ mapmode: "TWR_government_type_map_mode" });
        c.effects.force_update_map_mode({ mapmode: "TWR_industrialisation_map_mode" });
      },
    ],
  }),
];
