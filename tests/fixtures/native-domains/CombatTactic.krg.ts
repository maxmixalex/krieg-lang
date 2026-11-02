// Original audit fixture; native rule: common/combat_tactics.cwt:16.
import { CombatTactic } from "krieg-lang/hoi4";

export const sample = CombatTactic({
  id: "tactic_krieg_audit",
  isAttacker: true,
  trigger: { isAttacker: true, phase: false },
  base: { factor: 4, modifier: { add: 4 } },
  picture: "SOV_tank_desant_blitz",
  onlyShowFor: "SOV",
  active: false,
});
