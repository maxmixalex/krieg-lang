// Original audit fixture; native rule: common/consolidated_ai.cwt:137.
import { AiTemplate } from "krieg-lang/hoi4";

export const sample = AiTemplate({
  id: "krg_audit_aitemplate",
  role: "mechanized_assault",
  upgradePrio: { base: 0, modifier: { add: 2 } },
  availableFor: ["GER"],
  frontRoleOverride: "offence",
});
