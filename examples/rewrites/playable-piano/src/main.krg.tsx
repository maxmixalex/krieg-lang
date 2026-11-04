import { ScriptedWindow, For, Sprite, AnimatedSprite, SpriteFile } from "krieg-lang/ui";
import styles from "./keyboard.krg.css";
import { whiteKeys, blackKeys, piano } from "./notes.krg";

export default [
  piano,
  ScriptedWindow(
    {
      name: "PI_open_button_gui",
      path: "interface/PI_scripted_gui.gui",
      context: "player_context",
      parentWindowToken: "top_bar",
      aiCheck: () => false,
      visible: () => true,
    },
    (ui) => (
      <ui.Container
        name="PI_open_button_gui_container"
        position={{ x: 0, y: 0 }}
        orientation="UPPER_RIGHT"
      >
        <ui.Button
          name="button_open"
          position={{ x: -550, y: 1 }}
          spriteType="GFX_button_148x34"
          font="hoi_16mbs"
          text="PI_KEYBOARD"
          enabled={(c) => !c.triggers.hasCountryFlag("piano_window_open")}
          click={(c) => c.effects.setCountryFlag("piano_window_open")}
        />
      </ui.Container>
    ),
  ),
  ScriptedWindow(
    {
      name: "PI_keyboard_gui",
      path: "interface/PI_scripted_gui.gui",
      context: "player_context",
      visible: (c) => c.triggers.hasCountryFlag("piano_window_open"),
    },
    (ui) => (
      <ui.Container
        name="PI_keyboard_gui_window"
        position={{ x: -200, y: -200 }}
        size={{ width: 766, height: 340 }}
        orientation="CENTER"
        moveable
        clickToFront
        fadeTime={300}
        fadeType="linear"
        showSound="menu_open_window"
        background={{ name: "Background", spriteType: "GFX_tiled_plain_bg" }}
      >
        <ui.Icon
          name="top_icon"
          position={{ x: 194, y: 4 }}
          spriteType="GFX_diplo_action_justify_wargoals_top_bg"
          scale={0.75}
          clickSound="click_close"
          tooltip="CLOSE"
          shortcut="ESCAPE"
          alwaysTransparent
        />
        <ui.Icon
          name="PI_metronome"
          position={{ x: 606, y: 8 }}
          spriteType="GFX_PI_metronome"
          clickSound="click_close"
          tooltip="CLOSE"
          shortcut="ESCAPE"
          alwaysTransparent
        />
        <ui.Text
          name="piano_title"
          position={{ x: 0, y: 4 }}
          font="hoi_36header"
          maxWidth={766}
          maxHeight={23}
          format="center"
          text="PI_TITLE"
          alwaysTransparent
        />
        <ui.Text
          name="key_label_left"
          position={{ x: 22, y: 43 }}
          text="PI_KEYS"
          className={styles.label}
        />
        <ui.Text
          name="key_label_Right"
          position={{ x: 372, y: 43 }}
          text="PI_KEYS"
          className={styles.label}
        />
        <ui.Text
          name="PI_credit"
          position={{ x: 40, y: 12 }}
          text="PI_AUTHOR"
          className={styles.label}
        />
        <ui.Button
          name="button_close"
          position={{ x: 728, y: 8 }}
          spriteType="GFX_NV_btn_close"
          clickSound="click_close"
          tooltip="CLOSE"
          shortcut="ESCAPE"
          click={(c) => c.effects.clearCountryFlag("piano_window_open")}
        />
        <ui.Button
          name="button_steam"
          position={{ x: 8, y: 6 }}
          spriteType="GFX_icon_steam"
          scale={0.75}
          clickSound="click_close"
          tooltip="PI_WORKSHOP"
          shortcut="F1"
          webLink="https://steamcommunity.com/id/thedrowse/myworkshopfiles/?appid=394360"
        />
        <For each={whiteKeys}>
          {(key, i) => (
            <ui.Button
              name={key.note + "_key"}
              position={{ x: 8 + i * 50, y: 60 }}
              className={styles.white}
              shortcut={key.shortcut}
              clickSound={piano.sounds[`${key.note}_piano_note`]}
            />
          )}
        </For>
        <For each={blackKeys}>
          {(key) => (
            <ui.Button
              name={key.note + "_key"}
              position={{ x: 43 + key.after * 50, y: 60 }}
              className={styles.black}
              shortcut={key.shortcut}
              clickSound={piano.sounds[`${key.note}_piano_note`]}
            />
          )}
        </For>
      </ui.Container>
    ),
  ),
  SpriteFile("interface/PI_scripted_gui.gfx", [
    Sprite({ name: "GFX_PI_Ivory", textureFile: "gfx/Piano_gui/PI_Ivory.dds" }),
    Sprite({ name: "GFX_PI_Ebony", textureFile: "gfx/Piano_gui/PI_Ebony.dds" }),
    Sprite({ name: "GFX_PI_Ivory_808", textureFile: "gfx/Piano_gui/PI_Ivory_808.dds" }),
    Sprite({ name: "GFX_PI_Ebony_808", textureFile: "gfx/Piano_gui/PI_Ebony_808.dds" }),
    Sprite({ name: "GFX_icon_steam", textureFile: "gfx/Piano_gui/icon_steam.dds" }),
    AnimatedSprite({
      name: "GFX_PI_metronome",
      textureFile: "gfx/Piano_gui/PI_metronome.dds",
      noOfFrames: 4,
      animationRateFps: 2,
      looping: true,
      playOnShow: true,
      pauseOnLoop: 0,
      alwaysTransparent: true,
    }),
  ]),
];
