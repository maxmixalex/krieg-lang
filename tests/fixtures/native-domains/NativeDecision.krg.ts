// Original audit fixture; native rule: common/decisions.cwt:232.
import { NativeDecision, type ScopeByName } from "krieg-lang/hoi4";

export const sample = NativeDecision({
  id: "krg_audit_nativedecision",
  category: "krg_audit_nativedecisioncategory",
  icon: ["generic_research"],
  fireOnlyOnce: false,
  available: (_scope: ScopeByName["country"]) => true,
  visible: (_scope: ScopeByName["country"]) => true,
});
