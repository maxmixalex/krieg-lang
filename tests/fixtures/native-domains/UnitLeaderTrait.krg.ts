// Original audit fixture; native rule: common/traits.cwt:99.
import { UnitLeaderTrait, type ScopeByName } from "krieg-lang/hoi4";

export const sample = UnitLeaderTrait({
  id: "krg_audit_unitleadertrait",
  type: "corps_commander",
  traitType: "assignable_trait",
  gainXp: (_scope: ScopeByName["combat"]) => true,
  cost: 500,
});
