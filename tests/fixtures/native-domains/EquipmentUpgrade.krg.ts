// Original audit fixture; native rule: common/equipment.cwt:407.
import { EquipmentUpgrade } from "krieg-lang/hoi4";

export const sample = EquipmentUpgrade({
  id: "krg_audit_equipmentupgrade",
  maxLevel: 5,
  airAttack: 0.1,
  maximumSpeed: -0.01,
  reliability: -0.1,
});
