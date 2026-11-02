// Original audit fixture; native rule: common/ai_strategy.cwt:42.
import { AiStrategyPlan, type ScopeByName } from "krieg-lang/hoi4";

export const sample = AiStrategyPlan({
  id: "krg_audit_aistrategyplan",
  enable: (_scope: ScopeByName["country"]) => true,
  name: "KRG_AUDIT",
  desc: "KRG_AUDIT",
  allowed: (_scope: ScopeByName["country"]) => true,
});
