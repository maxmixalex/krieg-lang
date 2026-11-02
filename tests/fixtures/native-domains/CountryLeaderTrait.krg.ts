// Original audit fixture; native rule: common/traits.cwt:52.
import { CountryLeaderTrait } from "krieg-lang/hoi4";

export const sample = CountryLeaderTrait({
  id: "krg_audit_countryleadertrait",
  random: false,
  targetedModifier: { tag: "CHI" },
  aiWillDo: { factor: 1 },
});
