// Original audit fixture; native rule: common/abilities.cwt:9.
import { Ability } from "krieg-lang/hoi4";

export const sample = Ability({
  id: "krg_audit_ability",
  name: "KRG_AUDIT",
  desc: "KRG_AUDIT",
  type: "army_leader",
  cost: 0.11,
  duration: 168,
  icon: "GFX_ability_chi_force_attack",
  soundEffect: "krg_audit_soundeffect",
});
