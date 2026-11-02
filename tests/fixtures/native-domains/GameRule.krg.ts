// Original native audit fixture; CWT rule: common/game_rules.cwt:8.
import { GameRule } from "krieg-lang/hoi4";

export const sample = GameRule({
  id: "krg_audit_gamerule",
  name: "KRG_AUDIT",
  group: "KRG_AUDIT",
  option: [{ name: "krg_audit_rule_enabled", text: "KRG_AUDIT", desc: "KRG_AUDIT" }],
});
