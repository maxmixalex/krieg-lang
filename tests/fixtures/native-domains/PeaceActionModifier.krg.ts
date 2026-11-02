// Original audit fixture; native rule: common/peace_conference.cwt:70.
import { PeaceActionModifier, type ScopeByName } from "krieg-lang/hoi4";

export const sample = PeaceActionModifier({
  id: "krg_audit_peaceactionmodifier",
  peaceActionType: "take_states",
  costMultiplier: 0.25,
  enable: (_scope: ScopeByName["country"]) => true,
  category: "is_core",
});
