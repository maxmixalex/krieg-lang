// Original audit fixture; native rule: common/units.cwt:37.
import { Unit } from "krieg-lang/hoi4";

export const sample = Unit({
  id: "krg_audit_unit",
  sprite: "light_plane",
  priority: 1,
  active: true,
  need: { cv_small_plane_airframe: 1 },
  type: "fighter",
  landAirWingSize: 100,
});
