// Original audit fixture; native rule: common/buildings.cwt:246.
import { SpawnPoint } from "krieg-lang/hoi4";

export const sample = SpawnPoint({
  id: "krg_audit_spawnpoint",
  type: "province",
  max: 1,
  onlyCostal: true,
});
