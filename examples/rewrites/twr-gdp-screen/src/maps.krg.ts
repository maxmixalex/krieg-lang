import { CountryHeatmap, ScriptedLocalisation } from "krieg-lang/hoi4";
import { Sprite, SpriteFile } from "krieg-lang/ui";

const bands = [
  { fraction: 0.95, color: [0, 0.4, 0] },
  { fraction: 0.9, color: [0, 0.6, 0] },
  { fraction: 0.85, color: [0, 0.8, 0] },
  { fraction: 0.8, color: [0, 1, 0] },
  { fraction: 0.75, color: [0.2, 1, 0] },
  { fraction: 0.7, color: [0.3, 1, 0] },
  { fraction: 0.65, color: [0.4, 1, 0] },
  { fraction: 0.6, color: [0.5, 1, 0] },
  { fraction: 0.55, color: [0.6, 1, 0] },
  { fraction: 0.5, color: [0.7, 1, 0] },
  { fraction: 0.45, color: [0.8, 1, 0] },
  { fraction: 0.4, color: [0.9, 1, 0] },
  { fraction: 0.35, color: [1, 1, 0] },
  { fraction: 0.3, color: [1, 0.85, 0] },
  { fraction: 0.25, color: [1, 0.7, 0] },
  { fraction: 0.2, color: [1, 0.55, 0] },
  { fraction: 0.15, color: [1, 0.4, 0] },
  { fraction: 0.1, color: [1, 0.25, 0] },
  { fraction: 0.05, color: [0.694, 0.1, 0] },
] as const;
const palette = {
  path: "common/map_modes/TWR_map_mode.txt",
  bands,
  maximumColor: [0, 0.5, 0],
  fallbackColor: [0.392, 0.1, 0],
  roundThresholds: true,
  highlightMaximum: true,
  updateDaily: true,
} as const;
export const maps = [
  CountryHeatmap({
    ...palette,
    id: "TWR_GDP_map_mode",
    metric: "country_GDP",
    maximumDivisor: 5.5,
  }),
  CountryHeatmap({
    ...palette,
    id: "TWR_GDP_per_capita_map_mode",
    metric: "country_GDP_per_capita",
    maximumDivisor: 1,
  }),
];
export const sprites = SpriteFile("interface/TWR_GDP.gfx", [
  Sprite({
    name: "GFX_mapmode_buttons_deselected_small_twr_government_type_map_mode",
    textureFile: "gfx/interface/mapmode/dollarsign_mapmode.dds",
  }),
  Sprite({
    name: "GFX_mapmode_buttons_selected_small_twr_government_type_map_mode",
    textureFile: "gfx/interface/mapmode/dollarsign_mapmode_selected.dds",
  }),
  Sprite({
    name: "GFX_mapmode_buttons_deselected_small_twr_industrialisation_map_mode",
    textureFile: "gfx/interface/mapmode/dollarsign_mapmode.dds",
  }),
  Sprite({
    name: "GFX_mapmode_buttons_selected_small_twr_industrialisation_map_mode",
    textureFile: "gfx/interface/mapmode/dollarsign_mapmode_selected.dds",
  }),
  Sprite({
    name: "GFX_mapmode_buttons_deselected_small_twr_gdp_map_mode",
    textureFile: "gfx/interface/mapmode/dollarsign_mapmode.dds",
  }),
  Sprite({
    name: "GFX_mapmode_buttons_selected_small_twr_gdp_map_mode",
    textureFile: "gfx/interface/mapmode/dollarsign_mapmode_selected.dds",
  }),
  Sprite({
    name: "GFX_mapmode_buttons_deselected_small_twr_gdp_per_capita_map_mode",
    textureFile: "gfx/interface/mapmode/dollarsign_mapmode.dds",
  }),
  Sprite({
    name: "GFX_mapmode_buttons_selected_small_twr_gdp_per_capita_map_mode",
    textureFile: "gfx/interface/mapmode/dollarsign_mapmode_selected.dds",
  }),
]);
function formatGDP(name: string, million: string, trillion: string, billion: string) {
  return ScriptedLocalisation(name, {
    scope: "country",
    texts: [
      { trigger: (c) => c.variable("country_GDP") < 1, localisationKey: million },
      { trigger: (c) => c.variable("country_GDP") > 999, localisationKey: trillion },
      { localisationKey: billion },
    ],
  });
}
export const localisation = [
  formatGDP("country_GDP_f", "country_GDP_M", "country_GDP_T", "country_GDP_B"),
  formatGDP("country_GDP_f_d", "country_GDP_M_d", "country_GDP_T_d", "country_GDP_B_d"),
  formatGDP(
    "country_GDP_f_map",
    "country_GDP_M_map_tooltip",
    "country_GDP_T_map_tooltip",
    "country_GDP_B_map_tooltip",
  ),
  formatGDP(
    "country_GDP_f_map_d",
    "country_GDP_M_map_1",
    "country_GDP_T_map_2",
    "country_GDP_B_map_3",
  ),
  ScriptedLocalisation("GetMapModeIndustrialisationLevel", {
    scope: "country",
    texts: [
      {
        trigger: (c) => c.triggers.hasIdea("consumerist_nation"),
        localisationKey: "consumerist_nation",
      },
      {
        trigger: (c) => c.triggers.hasIdea("industrialised_nation"),
        localisationKey: "industrialised_nation",
      },
      {
        trigger: (c) => c.triggers.hasIdea("semi_industrialised_nation"),
        localisationKey: "semi_industrialised_nation",
      },
      { trigger: (c) => c.triggers.hasIdea("agrarian_nation"), localisationKey: "agrarian_nation" },
    ],
  }),
  ScriptedLocalisation("GetSortArray", {
    scope: "country",
    texts: [
      {
        trigger: (c) => c.variable("temp_array_sort") === 1,
        localisationKey: "RUS_duma_government_array",
      },
      {
        trigger: (c) => c.variable("temp_array_sort") === 2,
        localisationKey: "RUS_duma_neutral_array",
      },
      {
        trigger: (c) => c.variable("temp_array_sort") === 3,
        localisationKey: "RUS_duma_opposition_array",
      },
      {
        trigger: (c) => c.variable("temp_array_sort") === 4,
        localisationKey: "global.GDP_list_array",
      },
    ],
  }),
  ScriptedLocalisation("GetSortValue", {
    scope: "country",
    texts: [
      { trigger: (c) => c.variable("temp_value_sort") === 1, localisationKey: "RUS_duma_seat" },
      { trigger: (c) => c.variable("temp_value_sort") === 2, localisationKey: "country_GDP" },
      {
        trigger: (c) => c.variable("temp_value_sort") === 3,
        localisationKey: "country_GDP_per_capita",
      },
    ],
  }),
];
