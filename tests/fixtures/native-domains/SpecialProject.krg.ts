// Original audit fixture; native rule: common/special_projects.cwt:14.
import { SpecialProject, type ScopeByName } from "krieg-lang/hoi4";

export const sample = SpecialProject({
  id: "krg_audit_specialproject",
  specialization: "specialization_air",
  allowed: { hasDlc: ["Gotterdammerung"] },
  available: (_scope: ScopeByName["project"]) => true,
  breakthroughCost: { specialization_air: 1 },
});
