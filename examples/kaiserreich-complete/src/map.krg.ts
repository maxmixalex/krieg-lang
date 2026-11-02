import { StrategicRegion } from "krieg-lang/hoi4";

// Exact region membership is factual base-world data; the weather profile is authored here.
// All islands remain in region 169. Other provinces, bitmaps and map tables come from the base.
export const tyrrhenian = StrategicRegion({
  outputPath: "map/strategicregions/169 - Tyrrhenian Sea.txt",
  id: 169,
  name: "STRATEGICREGION_169",
  provinces: [
    902, 1452, 3838, 5555, 5579, 5656, 5681, 6891, 8965, 9772, 9851, 9863, 11755, 11773, 11804,
    11824, 11874,
  ],
  navalTerrain: "water_shallow_sea",
  weather: {
    period: [
      {
        between: ["0.0", "30.11"],
        temperature: [8, 26],
        noPhenomenon: 0.6,
        rainLight: 0.3,
        rainHeavy: 0.1,
        snow: 0,
        blizzard: 0,
        arcticWater: 0,
        mud: 0.1,
        sandstorm: 0,
        minSnowLevel: 0,
      },
    ],
  },
});
