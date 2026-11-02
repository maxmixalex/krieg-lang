// Original native audit fixture; CWT rule: common/consolidated_ai.cwt:249.
import { AiEquipmentDesignGroup } from "krieg-lang/hoi4";

export const sample = AiEquipmentDesignGroup({
  id: "krg_audit_aiequipmentdesigngroup",
  category: "naval",
  roles: ["naval_screen"],
  entries: {
    krg_audit_screen: { priority: { base: 1 }, targetVariant: { type: "ship_hull_light_1" } },
  },
});
