// Original audit fixture; native rule: history/states.cwt:97.
import { StateCategory } from "krieg-lang/hoi4";

export const sample = StateCategory({
  id: "krg_audit_statecategory",
  localBuildingSlots: 3,
  color: [200, 160, 0],
  buildingsMaxLevel: { naval_base: 8 },
});
