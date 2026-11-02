// Original audit fixture; native rule: common/equipment.cwt:654.
import { CriticalPart } from "krieg-lang/hoi4";

export const sample = CriticalPart({
  id: "krg_audit_criticalpart",
  icon: "GFX_default_critical_damage_icons",
  frame: 4,
  statPenalties: { torpedoAttack: -0.5 },
  strDamageMultiplier: 1.25,
});
