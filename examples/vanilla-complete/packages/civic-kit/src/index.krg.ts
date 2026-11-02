import { ScriptedEffect, ScriptedTrigger, type CountryScope } from "krieg-lang/hoi4";

// A reusable source package emits shared resources once and inlines helper calls.
export function credit(country: CountryScope, amount: number): void {
  country.effects.addPoliticalPower(amount);
  country.effects.addToVariable({ var: "civ_investment", value: 1 });
  country.effects.addToVariable({ var: "civ_gui_dirty", value: 1 });
}
export const ready = ScriptedTrigger(
  "civ_can_invest",
  (country: CountryScope) =>
    country.politicalPower >= 25 && !country.triggers.hasCountryFlag("civ_invested"),
);
export const refund = ScriptedEffect("civ_refund", (country: CountryScope) => credit(country, 5));
