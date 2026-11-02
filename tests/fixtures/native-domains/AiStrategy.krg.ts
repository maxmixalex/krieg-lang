// Original audit fixture; native rule: common/ai_strategy.cwt:11.
import { AiStrategy, type ScopeByName } from "krieg-lang/hoi4";

export const sample = AiStrategy({
  id: "krg_audit_aistrategy",
  allowed: (_scope: ScopeByName["country"]) => true,
  enable: (_scope: ScopeByName["country"]) => true,
  abort: (_scope: ScopeByName["country"]) => true,
  aiStrategy: { type: "build_army", id: "mountaineers", value: 3 },
});
