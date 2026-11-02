// Original audit fixture; native rule: common/doctrine_grand_doctrines.cwt:30.
import { GrandDoctrine, type ScopeByName } from "krieg-lang/hoi4";

export const sample = GrandDoctrine({
  id: "krg_audit_granddoctrine",
  folder: "air",
  name: "KRG_AUDIT",
  description: "KRG_AUDIT",
  icon: "GFX_doctrine_strategic_destruction_medium",
  xpCost: 100,
  xpType: "air",
  milestones: [
    { effect: (_scope: ScopeByName["country"]) => {} },
    { effect: (_scope: ScopeByName["country"]) => {} },
    { effect: (_scope: ScopeByName["country"]) => {} },
  ],
});
