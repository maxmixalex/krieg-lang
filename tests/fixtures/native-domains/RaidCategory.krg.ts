// Original audit fixture; native rule: common/raids.cwt:13.
import { RaidCategory, type ScopeByName } from "krieg-lang/hoi4";

export const sample = RaidCategory({
  id: "krg_audit_raidcategory",
  intelSource: "air",
  available: (_scope: ScopeByName["country"]) => true,
  visible: (_scope: ScopeByName["country"]) => true,
  factionInfluenceScoreOnSuccess: 100,
});
