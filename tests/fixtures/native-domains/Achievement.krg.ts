// Original audit fixture; native rule: common/achievements.cwt:9.
import { Achievement, type ScopeByName } from "krieg-lang/hoi4";

export const sample = Achievement({
  id: "krg_audit_achievement",
  possible: (_scope: ScopeByName["country"]) => true,
  happened: (_scope: ScopeByName["country"]) => true,
});
