// Original audit fixture; native rule: common/static_modifiers.cwt:13.
import { StaticModifier } from "krieg-lang/hoi4";

export const sample = StaticModifier({
  id: "krg_audit_staticmodifier",
  supplyConsumptionFactor: 0.1,
  airMissionEfficiency: -0.3,
  navalRetreatSpeed: 0.1,
  navalSpeedFactor: -0.1,
});
