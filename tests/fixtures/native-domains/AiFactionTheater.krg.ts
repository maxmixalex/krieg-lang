// Original audit fixture; native rule: common/consolidated_ai.cwt:401.
import { AiFactionTheater, type ScopeByName } from "krieg-lang/hoi4";

export const sample = AiFactionTheater({
  id: "krg_audit_aifactiontheater",
  name: "KRG_AUDIT",
  aiWillDo: { base: 0, modifier: { add: 10 } },
  regions: ["8", "38", "39"],
  cancel: (_scope: ScopeByName["country"]) => true,
});
