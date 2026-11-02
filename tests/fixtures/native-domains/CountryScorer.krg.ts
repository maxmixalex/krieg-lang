// Original audit fixture; native rule: common/scorers.cwt:7.
import { CountryScorer } from "krieg-lang/hoi4";

export const sample = CountryScorer({
  id: "krg_audit_countryscorer",
  targets: {
    targetArray: ["potential_and_current_enemies"],
    score: { base: 100, modifier: { factor: 0 } },
  },
});
