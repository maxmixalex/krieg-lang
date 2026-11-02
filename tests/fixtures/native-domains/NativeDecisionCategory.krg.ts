// Original audit fixture; native rule: common/decisions.cwt:80.
import { NativeDecisionCategory, type ScopeByName } from "krieg-lang/hoi4";

export const sample = NativeDecisionCategory({
  id: "krg_audit_nativedecisioncategory",
  allowed: (_scope: ScopeByName["country"]) => true,
  visible: (_scope: ScopeByName["country"]) => true,
  visibilityType: "map_and_decisions_view",
  onMapArea: [{ name: "KRG_AUDIT", zoom: 650 }],
});
