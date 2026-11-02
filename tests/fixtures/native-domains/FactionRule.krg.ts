// Original audit fixture; native rule: common/factions.cwt:343.
import { FactionRule, type ScopeByName } from "krieg-lang/hoi4";

export const sample = FactionRule({
  id: "krg_audit_factionrule",
  type: "change_leader_rules",
  available: (_scope: ScopeByName["country"]) => true,
  canRemove: (_scope: ScopeByName["country"]) => true,
  trigger: (_scope: ScopeByName["country"]) => true,
});
