// Original audit fixture; native rule: common/units.cwt:324.
import { DivisionNames, type ScopeByName } from "krieg-lang/hoi4";

export const sample = DivisionNames({
  id: "krg_audit_divisionnames",
  name: "KRG_AUDIT",
  forCountries: ["AFA"],
  divisionTypes: ["infantry"],
  canUse: (_scope: ScopeByName["country"]) => true,
});
