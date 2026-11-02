// Original audit fixture; native rule: common/traits.cwt:288.
import { ScientistTrait, type ScopeByName } from "krieg-lang/hoi4";

export const sample = ScientistTrait({
  id: "krg_audit_scientisttrait",
  available: (_scope: ScopeByName["country"]) => true,
  modifier: {},
  specialization: ["specialization_air"],
});
