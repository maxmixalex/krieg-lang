// Original audit fixture; native rule: common/intelligence_agency_updates.cwt:14.
import { IntelligenceAgencyUpgrade } from "krieg-lang/hoi4";

export const sample = IntelligenceAgencyUpgrade({
  id: "krg_audit_intelligenceagencyupgrade",
  branch: "branch_intelligence",
  picture: "GFX_agency_defense_department",
  level: [{ modifier: {} }],
  frame: "GFX_upgrade_frame_defense",
  sound: "krg_audit_soundeffect",
  aiWillDo: { factor: 2 },
});
