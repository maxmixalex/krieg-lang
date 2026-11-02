// Original audit fixture; native rule: common/buildings.cwt:36.
import { Building } from "krieg-lang/hoi4";

export const sample = Building({
  id: "krg_audit_building",
  baseCost: 20000,
  iconFrame: 26,
  levelCap: { provinceMax: 1 },
  value: 5,
  showOnMap: 1,
});
