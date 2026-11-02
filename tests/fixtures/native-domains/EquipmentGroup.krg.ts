// Original audit fixture; native rule: common/equipment_groups.cwt:7.
import { EquipmentGroup } from "krieg-lang/hoi4";

export const sample = EquipmentGroup({
  id: "krg_audit_equipmentgroup",
  equipmentType: ["light_tank_chassis", "amphibious_tank_chassis"],
});
