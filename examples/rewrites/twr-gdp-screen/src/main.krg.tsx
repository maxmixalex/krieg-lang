import { ScriptedWindow } from "krieg-lang/ui";
import { countryTarget } from "krieg-lang/hoi4";
import styles from "./panel.krg.css";
import { calculateGDP, growth, squareRoot } from "./economy.krg";
import { updatePosition, sortGDP, sortPerCapita, scopedQuicksort } from "./ranking.krg";
import { lifecycle, initialEstimate, legacyGrowth } from "./lifecycle.krg";
import { maps, sprites, localisation } from "./maps.krg";

import { sumCap, exampleAllocation } from "./seat-allocation.krg";

export default [
  sumCap,
  exampleAllocation,
  scopedQuicksort,
  calculateGDP,
  growth,
  squareRoot,
  updatePosition,
  sortGDP,
  sortPerCapita,
  lifecycle,
  initialEstimate,
  legacyGrowth,
  maps,
  sprites,
  localisation,
  ScriptedWindow(
    {
      name: "view_GDP",
      path: "interface/TWR_GDP.gui",
      context: "player_context",
      parentWindowToken: "top_bar",
      dirty: "show_GDP_main",
      visible: (c) => !c.isAI,
    },
    (ui) => (
      <ui.Container
        name="view_GDP_container"
        position={{ x: -20, y: -310 }}
        size={{ width: 30, height: 20 }}
        orientation="LOWER_RIGHT"
      >
        <ui.Button
          name="view_GDP_button"
          position={{ x: 0, y: 0 }}
          spriteType="GFX_minimap_handle_default"
          tooltip="view_GDP_button_tt"
          shortcut="shift+g"
          click={(c) => {
            if (c.triggers.has_variable("show_GDP_main")) c.clearVariable("show_GDP_main");
            else c.setVariable("show_GDP_main", 1);
            c.clearArray("global.GDP_list_array");
            c.everyCountry((other) => {
              if (!other.arrayContains("global.GDP_list_array", countryTarget("THIS"))) {
                other.arrayPush("global.GDP_list_array", countryTarget("THIS"));
                other.run(calculateGDP);
              }
            });
            c.clearArray("GDP_selected_country_array");
            c.arrayPush("GDP_selected_country_array", countryTarget("THIS"));
            c.run(updatePosition);
          }}
        />
      </ui.Container>
    ),
  ),
  ScriptedWindow(
    {
      name: "GDP_main",
      path: "interface/TWR_GDP.gui",
      context: "player_context",
      parentWindowToken: "top_bar",
      dirty: "show_GDP_main",
      visible: (c) => c.variable("show_GDP_main") > 0,
    },
    (ui) => (
      <ui.Container
        name="GDP_main_container"
        position={{ x: 0, y: 0 }}
        size={{ width: 700, height: 550 }}
        orientation="CENTER"
        origo="center"
        moveable
        background={{ name: "Background", spriteType: "GFX_tiled_bg" }}
      >
        <ui.Button
          name="close_GDP_button"
          position={{ x: 663, y: 5 }}
          spriteType="GFX_closebutton"
          tooltip="CLOSE"
          clickSound="click_close"
          shortcut="ESCAPE"
          click={(c) => c.clearVariable("show_GDP_main")}
        />
        <ui.Text
          name="GDP_main_title"
          position={{ x: 0, y: 40 }}
          font="hoi_36header"
          text="GDP_main_title"
          format="center"
          maxWidth={700}
        />
        <ui.Text
          name="GDP_main_text"
          position={{ x: 20, y: 100 }}
          font="hoi_18mbs"
          text="GDP_main_text"
          format="left"
          maxWidth={250}
        />
        <ui.Button
          name="GDP_list_sort_button"
          position={{ x: 450, y: 115 }}
          className={styles.sort}
          text="GDP_list_sort_button_text"
          click={(c) => {
            c.run(sortGDP);
            c.addVariable("show_GDP_main", 1);
          }}
        />
        <ui.Button
          name="GDP_per_capita_list_sort_button"
          position={{ x: 550, y: 115 }}
          className={styles.sort}
          text="GDP_per_capita_list_sort_button_text"
          click={(c) => {
            c.run(sortPerCapita);
            c.addVariable("show_GDP_main", 1);
          }}
        />
        <ui.Container
          name="top_ten_GDP_grid_container"
          margin={{ top: 10, bottom: 10 }}
          position={{ x: 0, y: 140 }}
          size={{ width: 360, height: 410 }}
          orientation="UPPER_LEFT"
          background={{ name: "top_ten_GDP_grid_background", spriteType: "GFX_tiled_bg" }}
        >
          <ui.Text
            name="top_ten_GDP_grid_title"
            position={{ x: 75, y: 205 }}
            font="hoi_24header"
            text="Top 10 GDP"
            format="center"
            maxWidth={200}
            maxHeight={24}
            fixedSize
          />
          <ui.GridBox
            name="top_ten_GDP_grid"
            position={{ x: 0, y: 0 }}
            size={{ width: "100%%", height: "100%%" }}
            slotsize={{ width: 70, height: 60 }}
            maxSlotsHorizontal={5}
            maxSlotsVertical={2}
            addHorizontal
            list={{
              array: "global.top_ten_GDP_array",
              entryScope: "country",
              entry: (
                <ui.Container
                  name="top_ten_GDP_entry"
                  position={{ x: 0, y: 0 }}
                  size={{ width: 80, height: 60 }}
                >
                  <ui.Text
                    name="top_ten_GDP_rank"
                    position={{ x: -355, y: 295 }}
                    text="top_ten_GDP_rank"
                    maxWidth={500}
                    className={styles.small}
                  />
                  <ui.Icon
                    name="top_ten_GDP_country_flag_icon"
                    position={{ x: -123, y: 260 }}
                    spriteType="GFX_flag_small2"
                    tooltip="top_ten_GDP_country_flag_icon_tt"
                    properties={{ image: "[THIS.GetFlag]" }}
                  />
                  <ui.Icon
                    name="top_ten_GDP_flag_frame"
                    position={{ x: -128, y: 256 }}
                    spriteType="GFX_diplo_countrylist_flag_frame"
                    alwaysTransparent
                  />
                </ui.Container>
              ),
            }}
          />
        </ui.Container>
        <ui.Container
          name="GDP_list_grid_container"
          margin={{ top: 10, bottom: 10 }}
          position={{ x: 350, y: 140 }}
          size={{ width: 345, height: 405 }}
          orientation="UPPER_LEFT"
          verticalScrollbar="right_vertical_slider"
          background={{
            name: "GDP_list_grid_background",
            spriteType: "GFX_tiled_window_1b_thin_border",
          }}
        >
          <ui.GridBox
            name="GDP_list_grid"
            position={{ x: -95, y: 0 }}
            padding={{ top: 0, bottom: 10 }}
            size={{ width: "100%%", height: "100%%" }}
            slotsize={{ width: 150, height: 35 }}
            maxSlotsHorizontal={1}
            addHorizontal={false}
            list={{
              array: "global.GDP_list_array",
              entryScope: "country",
              entry: (
                <ui.Container
                  name="GDP_list_entry"
                  position={{ x: 0, y: 0 }}
                  size={{ width: 150, height: 30 }}
                >
                  <ui.Text
                    name="GDP_list_text"
                    position={{ x: -100, y: 8 }}
                    text="GDP_list_text"
                    maxWidth={400}
                    className={styles.small}
                  />
                  <ui.Text
                    name="GDP_per_capita_list_text"
                    position={{ x: 0, y: 8 }}
                    text="GDP_per_capita_list_text"
                    maxWidth={400}
                    className={styles.small}
                  />
                  <ui.Button
                    name="GDP_list_flag_button"
                    position={{ x: -20, y: 4 }}
                    spriteType="GFX_flag_small2"
                    tooltip="GDP_list_flag_button_tt"
                    properties={{ image: "[THIS.GetFlag]" }}
                    click={(entry) => {
                      entry.country(countryTarget("ROOT"), (player) => {
                        player.clearArray("GDP_selected_country_array");
                        player.arrayPush("GDP_selected_country_array", countryTarget("PREV"));
                        player.addVariable("show_GDP_main", 1);
                      });
                    }}
                  />
                  <ui.Icon
                    name="GDP_list_flag_frame"
                    position={{ x: -25, y: 0 }}
                    spriteType="GFX_diplo_countrylist_flag_frame"
                    alwaysTransparent
                  />
                </ui.Container>
              ),
            }}
          />
        </ui.Container>
        <ui.Container
          name="GDP_selected_country_grid_container"
          margin={{ top: 10, bottom: 10 }}
          position={{ x: 0, y: 140 }}
          size={{ width: 360, height: 210 }}
          orientation="UPPER_LEFT"
          background={{ name: "GDP_selected_country_grid_background", spriteType: "GFX_tiled_bg" }}
        >
          <ui.GridBox
            name="GDP_selected_country_grid"
            position={{ x: 0, y: 0 }}
            size={{ width: "100%%", height: "100%%" }}
            slotsize={{ width: 150, height: 30 }}
            maxSlotsHorizontal={1}
            addHorizontal={false}
            list={{
              array: "GDP_selected_country_array",
              entryScope: "country",
              entry: (
                <ui.Container
                  name="GDP_selected_country_entry"
                  position={{ x: 0, y: 0 }}
                  size={{ width: 150, height: 30 }}
                >
                  <ui.Text
                    name="GDP_selected_country_title"
                    position={{ x: -100, y: 10 }}
                    text="[THIS.GetName]"
                    className={styles.header}
                  />
                  <ui.Icon
                    name="GDP_selected_country_flag_icon"
                    position={{ x: 35, y: 65 }}
                    spriteType="GFX_shield_medium"
                    tooltip="GDP_selected_country_flag_icon_tt"
                    properties={{ image: "[THIS.GetFlag]" }}
                  />
                  <ui.Text
                    name="GDP_selected_country_rank"
                    position={{ x: -100, y: 130 }}
                    text="GDP_selected_country_rank"
                    className={styles.header}
                  />
                </ui.Container>
              ),
            }}
          />
        </ui.Container>
      </ui.Container>
    ),
  ),
];
