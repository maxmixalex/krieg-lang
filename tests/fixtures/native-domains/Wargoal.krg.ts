// Original audit fixture; native rule: common/wargoals.cwt:9.
import { Wargoal, type ScopeByName } from "krieg-lang/hoi4";

export const sample = Wargoal({
  id: "krg_audit_wargoal",
  allowed: (_scope: ScopeByName["country"]) => true,
  available: (_scope: ScopeByName["country"]) => true,
  takeStates: (_scope: ScopeByName["state"]) => true,
  generateBaseCost: 200,
});
