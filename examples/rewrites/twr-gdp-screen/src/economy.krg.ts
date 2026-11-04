import {
  ScriptedEffect,
  countryTarget,
  country,
  type CountryScope,
  type StateScope,
} from "krieg-lang/hoi4";
import { updatePosition } from "./ranking.krg";

function categoryFactor(s: StateScope): void {
  s.setVariable("state_category_factor", 1);
  if (s.triggers.has_state_category("megalopolis") || s.triggers.has_state_category("twelve"))
    s.multiplyVariable("state_category_factor", 3);
  else if (
    s.triggers.has_state_category("metropolis") ||
    s.triggers.has_state_category("eleven") ||
    s.triggers.has_state_category("nine")
  )
    s.multiplyVariable("state_category_factor", 2);
  else if (
    s.triggers.has_state_category("large_city") ||
    s.triggers.has_state_category("eight") ||
    s.triggers.has_state_category("seven")
  )
    s.multiplyVariable("state_category_factor", 1.5);
  else if (
    s.triggers.has_state_category("city") ||
    s.triggers.has_state_category("major_port") ||
    s.triggers.has_state_category("six")
  )
    s.multiplyVariable("state_category_factor", 1.25);
  else if (
    s.triggers.has_state_category("large_town") ||
    s.triggers.has_state_category("port") ||
    s.triggers.has_state_category("minor_port") ||
    s.triggers.has_state_category("five")
  )
    s.multiplyVariable("state_category_factor", 1);
  else if (s.triggers.has_state_category("town") || s.triggers.has_state_category("four"))
    s.multiplyVariable("state_category_factor", 0.75);
  else if (s.triggers.has_state_category("rural") || s.triggers.has_state_category("three"))
    s.multiplyVariable("state_category_factor", 0.6);
  else if (s.triggers.has_state_category("pastoral") || s.triggers.has_state_category("two"))
    s.multiplyVariable("state_category_factor", 0.25);
  else s.multiplyVariable("state_category_factor", 0.1);
  s.owner((owner) =>
    owner.addVariable("This.country_category_factor", owner.variable("PREV.state_category_factor")),
  );
}
function gather(s: StateScope, field: string, building: string, owner: boolean): void {
  s.setVariable("state_" + field, 0);
  s.addVariable("state_" + field, s.variable("This." + building));
  if (owner)
    s.owner((c) => c.addVariable("This.country_" + field, c.variable("PREV.state_" + field)));
  else
    s.controller((c) => c.addVariable("This.country_" + field, c.variable("PREV.state_" + field)));
}
function tally(
  c: CountryScope,
  field: string,
  building: string,
  owner: boolean,
  core: boolean,
): void {
  c.everyCountry((other) => other.setVariable("This.country_" + field, 0));
  if (core)
    c.everyGlobalState(
      (s) => s.triggers.is_core_of(countryTarget("PREV")),
      (s) => gather(s, field, building, owner),
    );
  else c.everyGlobalState((s) => gather(s, field, building, owner));
}
function factors(c: CountryScope, civ: number, mil: number, dock: number): void {
  c.multiplyTempVariable("temp_civ", civ);
  c.multiplyTempVariable("temp_mil", mil);
  c.multiplyTempVariable("temp_doc", dock);
}
function lawFactors(c: CountryScope): void {
  if (c.triggers.hasIdea("free_trade")) factors(c, 1, 1, 1);
  else if (c.triggers.hasIdea("export_focus")) factors(c, 0.97, 0.97, 0.97);
  else if (c.triggers.hasIdea("limited_exports")) factors(c, 0.95, 0.95, 0.95);
  else if (c.triggers.hasIdea("closed_economy")) factors(c, 0.9, 0.9, 0.9);
  else if (c.triggers.hasIdea("uncontrolled_exports")) factors(c, 0.95, 0.95, 0.95);
  if (c.triggers.hasIdea("tot_economic_mobilisation")) factors(c, 0.9, 0.99, 0.98);
  else if (c.triggers.hasIdea("isolation")) factors(c, 0.95, 0.95, 0.95);
  else if (c.triggers.hasIdea("war_economy")) factors(c, 0.93, 0.98, 0.96);
  else if (c.triggers.hasIdea("partial_economic_mobilisation")) factors(c, 0.96, 0.93, 0.93);
  else if (c.triggers.hasIdea("undisturbed_isolation")) factors(c, 1, 0.9, 0.9);
  else if (c.triggers.hasIdea("low_economic_mobilisation")) factors(c, 0.98, 0.92, 0.92);
  else if (c.triggers.hasIdea("civilian_economy")) factors(c, 1, 0.9, 0.9);
  if (c.triggers.hasIdea("service_by_requirement")) factors(c, 0.98, 0.9, 0.9);
  else if (c.triggers.hasIdea("all_adults_serve")) factors(c, 0.95, 0.85, 0.85);
  else if (c.triggers.hasIdea("scraping_the_barrel")) factors(c, 0.7, 0.5, 0.5);
  else if (c.triggers.hasIdea("ETH_chitet_law") && c.triggers.original_tag(country("ETH")))
    factors(c, 0.9, 0.9, 0.9);
  else if (c.triggers.hasIdea("TUR_debt_council") && c.triggers.original_tag(country("TUR")))
    factors(c, 0.95, 0.95, 0.95);
}
export const squareRoot = ScriptedEffect("math_square_root", (c) => {
  c.setTempVariable("math_sqrt_output", 1);
  c.forRange({ start: 0, end: 10 }, (s) => {
    s.setTempVariable("sqrt_temp", s.variable("math_sqrt_number"));
    s.divideTempVariable("sqrt_temp", s.variable("math_sqrt_output"));
    s.addTempVariable("math_sqrt_output", s.variable("sqrt_temp"));
    s.divideTempVariable("math_sqrt_output", 2);
  });
});
const resources = [
  { name: "oil", produced: 2000, exported: 50 },
  { name: "aluminium", produced: 2000, exported: 50 },
  { name: "rubber", produced: 3500, exported: 100 },
  { name: "tungsten", produced: 2500, exported: 50 },
  { name: "steel", produced: 2000, exported: 50 },
  { name: "chromium", produced: 3000, exported: 50 },
] as const;
export const calculateGDP = ScriptedEffect("calculate_GDP", (c) => {
  c.setVariable("country_GDP", 0);
  c.setTempVariable("temp_civ", 0);
  c.setTempVariable("temp_mil", 0);
  c.setTempVariable("temp_doc", c.variable("num_of_naval_factories"));
  c.setVariable("country_GDP_M", 0);
  c.setVariable("country_GDP_B", 0);
  c.setTempVariable("actual_core_manpower_k", 0);
  c.setTempVariable("actual_core_manpower_nocore_k", 0);
  c.effects.clearCountryFlag("gdp_menu");
  c.everyState(
    (s) => s.triggers.is_core_of(countryTarget("PREV")),
    (s) => s.addTempVariable("PREV.actual_core_manpower_k", s.variable("state_population_k")),
  );
  c.everyState((s) => s.addTempVariable("actual_manpower_k", s.variable("state_population_k")));
  c.everyState(
    (s) => !s.triggers.is_core_of(countryTarget("PREV")),
    (s) =>
      s.addTempVariable("PREV.actual_core_manpower_nocore_k", s.variable("state_population_k")),
  );
  c.everyCountry((other) => {
    other.setVariable("This.country_category_factor", 0);
    other.setVariable("This.country_num_states", other.variable("This.num_core_states"));
  });
  c.everyGlobalState((s) => s.triggers.is_core_of(countryTarget("PREV")), categoryFactor);
  c.everyCountry((other) => {
    other.divideVariable("This.country_category_factor", other.variable("This.country_num_states"));
    other.subtractVariable("country_category_factor", 1);
    other.divideVariable("country_category_factor", 10);
    other.setVariable("country_category_factor_1", 1);
    other.addVariable("country_category_factor_1", other.variable("country_category_factor"));
  });
  c.setVariable("temp_8", c.variable("country_category_factor_1"));
  c.everyCountry((other) => {
    other.setVariable("This.country_average_inf", 0);
    other.setVariable("This.country_num_states", other.variable("This.num_owned_states"));
  });
  c.everyGlobalState((s) => {
    s.setVariable("state_inf", 0);
    s.addVariable("state_inf", s.variable("This.infrastructure_level"));
    s.owner((owner) =>
      owner.addVariable("This.country_average_inf", owner.variable("Prev.state_inf")),
    );
  });
  c.everyCountry((other) =>
    other.divideVariable("This.country_average_inf", other.variable("This.country_num_states")),
  );
  tally(c, "civ", "industrial_complex_level", false, false);
  tally(c, "civ_own", "industrial_complex_level", true, false);
  tally(c, "civ_core", "industrial_complex_level", true, true);
  c.setVariable("country_civ_con", 0);
  c.addVariable("country_civ_con", c.variable("country_civ"));
  c.setVariable("country_civ_ocp_temp", c.variable("country_civ"));
  c.setVariable("country_civ_coreown_temp", c.variable("country_civ_core"));
  c.setVariable("country_civ_noncore_temp", c.variable("country_civ_own"));
  c.setVariable("country_civ_core_temp", c.variable("country_civ_core"));
  c.subtractVariable("country_civ_ocp_temp", c.variable("country_civ_own"));
  c.subtractVariable("country_civ_noncore_temp", c.variable("country_civ_core_temp"));
  c.subtractVariable("country_civ_con", c.variable("country_civ_noncore_temp"));
  c.subtractVariable("country_civ_ocp_temp", c.variable("country_civ_noncore_temp"));
  c.clampVariable("country_civ_ocp_temp", { min: 0 });
  c.setTempVariable("temp_9", c.variable("country_civ_ocp_temp"));
  c.subtractVariable("country_civ_con", c.variable("temp_9"));
  c.setTempVariable("temp_civ_con", c.variable("country_civ_con"));
  c.addTempVariable("temp_civ", c.variable("temp_civ_con"));
  c.addVariable("country_GDP", c.variable("temp_civ"));
  c.setVariable("temp_civ_all", c.variable("num_of_civilian_factories"));
  c.subtractVariable("temp_civ_all", c.variable("country_civ"));
  c.clampVariable("temp_civ_all", { min: 0 });
  c.setTempVariable("temp_2", c.variable("temp_civ_all"));
  c.divideTempVariable("temp_2", 1);
  c.addTempVariable("temp_civ", c.variable("temp_2"));
  c.setTempVariable("temp_4", c.variable("country_civ_ocp_temp"));
  c.divideTempVariable("temp_4", 10);
  c.setTempVariable("temp_6", c.variable("country_civ_noncore_temp"));
  c.divideTempVariable("temp_6", 1.5);
  c.addTempVariable("temp_civ", c.variable("temp_4"));
  c.addTempVariable("temp_civ", c.variable("temp_6"));
  tally(c, "arms", "arms_factory_level", false, false);
  tally(c, "arms_own", "arms_factory_level", true, false);
  tally(c, "arms_core", "arms_factory_level", true, true);
  c.setVariable("country_arms_con", 0);
  c.addVariable("country_arms_con", c.variable("country_arms"));
  c.setVariable("country_arms_ocp_temp", c.variable("country_arms"));
  c.setVariable("country_arms_coreown_temp", c.variable("country_arms_core"));
  c.setVariable("country_arms_noncore_temp", c.variable("country_arms_own"));
  c.setVariable("country_arms_core_temp", c.variable("country_arms_core"));
  c.subtractVariable("country_arms_ocp_temp", c.variable("country_arms_coreown_temp"));
  c.subtractVariable("country_arms_noncore_temp", c.variable("country_arms_core_temp"));
  c.subtractVariable("country_arms_con", c.variable("country_arms_noncore_temp"));
  c.subtractVariable("country_arms_ocp_temp", c.variable("country_arms_noncore_temp"));
  c.clampVariable("country_arms_ocp_temp", { min: 0 });
  // Original uses CIV occupancy here. Preserve it, with an explicit regression fixture.
  c.setTempVariable("temp_10", c.variable("country_civ_ocp_temp"));
  c.subtractVariable("country_arms_con", c.variable("temp_10"));
  c.setTempVariable("temp_arms_con", c.variable("country_arms_con"));
  c.addTempVariable("temp_mil", c.variable("temp_arms_con"));
  c.setTempVariable("temp_5", c.variable("country_arms_ocp_temp"));
  c.divideTempVariable("temp_5", 20);
  c.setTempVariable("temp_7", c.variable("country_arms_noncore_temp"));
  c.divideTempVariable("temp_7", 2.5);
  c.addTempVariable("temp_mil", c.variable("temp_5"));
  c.addTempVariable("temp_mil", c.variable("temp_7"));
  c.setVariable("overlord_factor", 1);
  c.setVariable("overlord_factor_2", c.variable("modifier@cic_to_overlord_factor"));
  c.multiplyVariable("overlord_factor_2", 0.99);
  c.subtractVariable("overlord_factor", c.variable("overlord_factor_2"));
  c.multiplyVariable("temp_civ", c.variable("overlord_factor"));
  c.setVariable("m_overlord_factor", 1);
  c.setVariable("m_overlord_factor_2", c.variable("modifier@mic_to_overlord_factor"));
  c.multiplyVariable("m_overlord_factor_2", 0.99);
  c.subtractVariable("m_overlord_factor", c.variable("m_overlord_factor_2"));
  c.multiplyVariable("temp_mil", c.variable("m_overlord_factor"));
  lawFactors(c);
  c.setTempVariable("temp_0", c.variable("temp_mil"));
  c.multiplyTempVariable("temp_0", 3);
  c.divideTempVariable("temp_0", 2);
  c.setTempVariable("temp_1", c.variable("temp_doc"));
  c.multiplyTempVariable("temp_1", 3);
  c.divideTempVariable("temp_1", 2);
  c.addVariable("country_GDP", c.variable("temp_0"));
  c.addVariable("country_GDP", c.variable("temp_1"));
  c.setVariable("population_modifier", 1);
  c.setVariable("population_modifier_civ", 1);
  c.setVariable("population_core_state", c.variable("actual_core_manpower_k"));
  c.setVariable("population_core_state_1", c.variable("actual_core_manpower_k"));
  c.setVariable("population_modifier_1", -1);
  c.setVariable("temp_nocore", c.variable("actual_core_manpower_nocore_k"));
  c.divideVariable("temp_nocore", 1.5);
  c.addVariable("population_core_state", c.variable("temp_nocore"));
  c.divideVariable("population_core_state", 3500);
  c.addVariable("population_modifier_1", c.variable("population_core_state"));
  if (c.variable("population_core_state") > 0.999) c.divideVariable("population_modifier_1", 500);
  c.addVariable("population_modifier", c.variable("population_modifier_1"));
  c.divideVariable("population_core_state_1", 3500);
  c.divideVariable("population_core_state_1", 100);
  c.addVariable("population_modifier_civ", c.variable("population_core_state_1"));
  c.clampVariable("population_modifier", { min: 0, max: 1.25 });
  c.multiplyVariable("country_GDP", c.variable("population_modifier"));
  c.clampVariable("population_modifier_civ", { min: 0, max: 5 });
  c.multiplyTempVariable("temp_civ", c.variable("population_modifier_civ"));
  c.setVariable("country_average_inf_1", 1);
  c.multiplyVariable("country_average_inf", 0.1);
  c.addVariable("country_average_inf_1", c.variable("country_average_inf"));
  c.multiplyVariable("country_average_inf_1", c.variable("population_modifier"));
  c.multiplyVariable("country_GDP", c.variable("country_average_inf_1"));
  c.multiplyVariable("temp_8", c.variable("population_modifier"));
  c.multiplyVariable("country_GDP", c.variable("temp_8"));
  c.multiplyTempVariable("temp_civ", 3);
  c.setVariable("temp_civ_resource", 1);
  c.setVariable("temp_civ_resource_1", c.variable("temp_civ"));
  c.multiplyVariable("temp_civ_resource_1", 0.5);
  c.addVariable("temp_civ_resource", c.variable("temp_civ_resource_1"));
  for (const r of resources) {
    c.setTempVariable("math_sqrt_number", c.variable("resource_produced@" + r.name));
    c.divideTempVariable("math_sqrt_number", r.produced);
    c.run(squareRoot);
    c.multiplyTempVariable("math_sqrt_output", c.variable("temp_civ_resource"));
    c.addVariable("country_GDP", c.variable("math_sqrt_output"));
  }
  for (const r of resources) {
    c.setTempVariable("math_sqrt_number", c.variable("resource_exported@" + r.name));
    c.divideTempVariable("math_sqrt_number", r.exported);
    c.run(squareRoot);
    c.addVariable("country_GDP", c.variable("math_sqrt_output"));
  }
  c.clampTempVariable("temp_civ", { min: 1 });
  c.setVariable("factory_output", 1);
  c.setVariable("factory_output_2", c.variable("modifier@industrial_capacity_factory"));
  c.multiplyVariable("factory_output_2", 0.2);
  c.addVariable("factory_output", c.variable("factory_output_2"));
  c.clampVariable("factory_output", { min: 0.5, max: 1.5 });
  c.multiplyVariable("country_GDP", c.variable("factory_output"));
  c.multiplyVariable("country_GDP", 0.107);
  c.setVariable("percentage_of_GDP", c.variable("country_GDP"));
  c.multiplyVariable("percentage_of_GDP", 100);
  c.divideVariable("percentage_of_GDP", c.variable("global.GDP_total"));
  c.clampVariable("percentage_of_GDP", { min: 0 });
  c.clampVariable("country_GDP", { min: 0 });
  c.setVariable("country_GDP_per_capita", c.variable("country_GDP"));
  c.multiplyVariable("country_GDP_per_capita", 1000);
  c.divideVariable("country_GDP_per_capita", c.variable("actual_core_manpower_k"));
  c.multiplyVariable("country_GDP_per_capita", 1000);
  c.clampVariable("country_GDP_per_capita", { min: 0 });
  if (
    c.allCountries((other) => other.arrayContains("global.GDP_list_array", countryTarget("THIS")))
  )
    c.run(updatePosition);
  c.addVariable("country_GDP_B", c.variable("country_GDP"));
  c.addVariable("country_GDP_M", c.variable("country_GDP"));
  c.addVariable("country_GDP_T", c.variable("country_GDP"));
  c.multiplyVariable("country_GDP_M", 1000);
  c.multiplyVariable("country_GDP_T", 0.001);
});
export const growth = ScriptedEffect("GDP_growth_calculation", (c) => {
  c.setVariable("GDP_growth_value", c.variable("country_GDP"));
  c.multiplyVariable("GDP_growth_value", 100);
  c.divideVariable("GDP_growth_value", c.variable("gdp_value_last"));
  // Preserve the original equality gate; this is not an unconditional percentage subtraction.
  if (c.variable("GDP_growth_value") === 100 || c.variable("GDP_growth_value") === 0)
    c.subtractVariable("GDP_growth_value", 100);
  if (c.variable("GDP_growth_value") === -0.001) c.multiplyVariable("GDP_growth_value", 0);
  c.multiplyVariable("GDP_growth_value", 1);
  c.setVariable("gdp_value_last", c.variable("country_GDP"));
});
