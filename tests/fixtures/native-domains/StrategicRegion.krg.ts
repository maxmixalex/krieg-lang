// Original audit fixture; native rule: map/regions.cwt:22.
import { StrategicRegion } from "krieg-lang/hoi4";

export const sample = StrategicRegion({
  id: 8090,
  name: "KRG_AUDIT",
  provinces: [2712, 2736, 2759],
  weather: { period: [{ between: [0, 30], temperature: [11, 28], minSnowLevel: 0 }] },
  navalTerrain: "water_deep_ocean",
  staticModifiers: { water_modifier_shark_infested: "always" },
});
