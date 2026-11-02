// Original audit fixture; native rule: common/terrain.cwt:30.
import { Terrain } from "krieg-lang/hoi4";

export const sample = Terrain({
  id: "krg_audit_terrain",
  color: [127, 191, 0],
  movementCost: 1.5,
  soundType: "krg_audit_soundeffect",
  combatWidth: 60,
});
