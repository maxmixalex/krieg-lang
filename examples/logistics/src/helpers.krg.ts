import type { CountryScope } from "krieg-lang/hoi4";

export function awardPlanningBonus(country: CountryScope, amount: number): void {
  if (country.stability < 0.5) {
    country.effects.addStability(0.05);
  }
  country.effects.addPoliticalPower(amount);
  for (const flag of ["krieg_planning_started", "krieg_planning_rewarded"]) {
    country.effects.setCountryFlag(flag);
  }
}
