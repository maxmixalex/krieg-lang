// Original audit fixture; native rule: gfx/lights.cwt:10.
import { Light } from "krieg-lang/hoi4";

export const sample = Light({
  id: "krg_audit_light",
  color: { r: [1], g: [1], b: [1] },
  radius: 1,
  falloff: 1,
  position: { x: 1, y: 1, z: 1 },
});
