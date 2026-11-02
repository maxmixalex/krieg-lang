// Original audit fixture; native rule: common/doctrine_subdoctrines.cwt:29.
import { Subdoctrine } from "krieg-lang/hoi4";

export const sample = Subdoctrine({
  id: "krg_audit_subdoctrine",
  track: "fighter_aircraft",
  name: "KRG_AUDIT",
  description: "KRG_AUDIT",
  icon: "GFX_doctrine_low_echelon_support_medium",
  xpCost: 100,
  rewards: { target_prioritization: {} },
  xpType: "air",
});
