// Original audit fixture; native rule: common/factions.cwt:477.
import { FactionTemplate } from "krieg-lang/hoi4";

export const sample = FactionTemplate({
  id: "krg_audit_factiontemplate",
  manifest: "faction_manifest_defense_of_democracy_allies",
  name: "KRG_AUDIT",
  icon: "GFX_faction_icon_allies",
  goals: [
    "faction_goal_the_arteries_of_trade",
    "faction_goal_the_atomic_race",
    "faction_goal_rule_the_waves",
  ],
});
