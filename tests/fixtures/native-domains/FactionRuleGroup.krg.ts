// Original audit fixture; native rule: common/factions.cwt:569.
import { FactionRuleGroup } from "krieg-lang/hoi4";

export const sample = FactionRuleGroup({
  id: "krg_audit_factionrulegroup",
  rules: [
    "manpower_contribution_small",
    "manpower_contribution_medium",
    "manpower_contribution_high",
  ],
});
