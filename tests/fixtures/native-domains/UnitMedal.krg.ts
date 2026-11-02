// Original audit fixture; native rule: common/unit_medals.cwt:10.
import { UnitMedal, type ScopeByName } from "krieg-lang/hoi4";

export const sample = UnitMedal({
  id: "krg_audit_unitmedal",
  frame: 1,
  icon: "GFX_medal_icon_nor",
  cost: "@cost",
  officerXp: 100,
  available: (_scope: ScopeByName["country"]) => true,
});
