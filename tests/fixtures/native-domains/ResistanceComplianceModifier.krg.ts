// Original audit fixture; native rule: common/resistance_compliance_modifiers.cwt:23.
import { ResistanceComplianceModifier } from "krieg-lang/hoi4";

export const sample = ResistanceComplianceModifier({
  id: "krg_audit_resistancecompliancemodifier",
  type: "core_compliance_modifier",
  icon: "GFX_occupation_compliance_modifier_strip:5",
  smallIcon: "GFX_occupation_compliance_modifier_small_strip:5",
  threshold: 80,
  margin: 2,
});
