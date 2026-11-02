// Original audit fixture; native rule: common/factions.cwt:39.
import { FactionGoal, type ScopeByName } from "krieg-lang/hoi4";

export const sample = FactionGoal({
  id: "krg_audit_factiongoal",
  name: "KRG_AUDIT",
  description: "KRG_AUDIT",
  category: "long_term",
  allowed: (_scope: ScopeByName["country"]) => true,
});
