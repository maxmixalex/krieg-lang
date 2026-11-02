// Original audit fixture; native rule: common/occupation_laws.cwt:8.
import { OccupationLaw, type ScopeByName } from "krieg-lang/hoi4";

export const sample = OccupationLaw({
  id: "krg_audit_occupationlaw",
  icon: 1,
  soundEffect: "krg_audit_soundeffect",
  visible: (_scope: ScopeByName["country"]) => true,
  missingGarrisonLaw: true,
});
