import { ScriptedWindow, GuiVariable, type GuiBindings } from "krieg-lang/ui";
import { type CountryScope } from "krieg-lang/hoi4";
import { typeChar, typeBack, typeEnter, typeEscape, dialogClose } from "./ui-actions.krg.ts";
import { saveDo, loadDo, saveDelete } from "./storage.krg.ts";
import styles from "./research.krg.css";
const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;
const keys = [
  ...letters.map((letter, i) => ({ code: i + 27, shortcut: "shift+" + letter })),
  { code: 67, shortcut: "shift+1" },
  { code: 68, shortcut: "shift+9" },
  { code: 69, shortcut: "shift+0" },
  ...letters.map((letter, i) => ({ code: i + 1, shortcut: letter })),
  ...["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "SPACE", ",", "-", "."].map((key, i) => ({
    code: i + 53,
    shortcut: key,
  })),
];

function caps(c: CountryScope) {
  if (c.variable("rq_caps") === 1) {
    c.setVariable("rq_caps", 0);
    c.setVariable("rq_capsf", 1);
  } else {
    c.setVariable("rq_caps", 1);
    c.setVariable("rq_capsf", 2);
  }
}
export const keyboard = ScriptedWindow(
  {
    name: "rq_keys_gui",
    path: "interface/rq_io.gui",
    context: "player_context",
    parentWindowName: "countrytechnologyview",
    dirty: "rq_dirty",
    visible: (c) => c.triggers.has_country_flag("rq_active") && c.variable("rq_typing") > 0,
  },
  (ui) => (
    <ui.Container
      name="rq_keys_window"
      position={{ x: 0, y: 0 }}
      size={{ width: 10, height: 10 }}
      clipping={false}
    >
      {keys.map((key) => (
        <ui.Button
          clickSound="click_default"
          name={"rq_k" + key.code}
          position={{ x: -1000, y: 0 }}
          spriteType="GFX_rq_ml_hit"
          shortcut={key.shortcut}
          click={(c) => {
            c.addVariable("rq_dirty", 1);
            c.setTempVariable("rq_ch", key.code);
            c.run(typeChar);
          }}
        />
      ))}
      <ui.Button
        clickSound="click_default"
        name="rq_kbs"
        position={{ x: -1000, y: 0 }}
        spriteType="GFX_rq_ml_hit"
        shortcut="BACKSPACE"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.run(typeBack);
        }}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_kret"
        position={{ x: -1000, y: 0 }}
        spriteType="GFX_rq_ml_hit"
        shortcut="RETURN"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.run(typeEnter);
        }}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_kesc"
        position={{ x: -1000, y: 0 }}
        spriteType="GFX_rq_ml_hit"
        shortcut="ESCAPE"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.run(typeEscape);
        }}
      />
    </ui.Container>
  ),
);
export const typingCatch = ScriptedWindow(
  {
    name: "rq_catch_gui",
    path: "interface/rq_io.gui",
    context: "player_context",
    parentWindowName: "countrytechnologyview",
    dirty: "rq_dirty",
    visible: (c) => c.triggers.has_country_flag("rq_active") && c.variable("rq_typing") === 1,
  },
  (ui) => (
    <ui.Container
      name="rq_catch_window"
      position={{ x: 0, y: 0 }}
      size={{ width: 10, height: 10 }}
      clipping={false}
    >
      <ui.Button
        clickSound="click_default"
        name="rq_catch"
        position={{ x: -2600, y: -2600 }}
        spriteType="GFX_rq_catch"
        scale={80}
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setVariable("rq_typing", 0);
        }}
      />
      {[0, 1].map((upper) => (
        <ui.Button
          clickSound="click_default"
          name={upper === 0 ? "rq_cq_capsl" : "rq_cq_capsu"}
          position={{ x: 811, y: 56 }}
          spriteType="GFX_rq_qcaps"
          text={upper === 0 ? "RQ_Q_CAPSL" : "RQ_Q_CAPSU"}
          font="hoi_16mbs"
          tooltip="RQ_Q_CAPS_TT"
          visible={(c) => (upper === 1 ? c.variable("rq_caps") === 1 : c.variable("rq_caps") !== 1)}
          click={(c) => {
            c.addVariable("rq_dirty", 1);
            caps(c);
          }}
        />
      ))}
    </ui.Container>
  ),
);
function MessageAnimation(ui: GuiBindings<CountryScope>, mode: "sd" | "ld") {
  return [false, true].flatMap((error) =>
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((cycle) => (
      <ui.Icon
        name={"rq_" + mode + "_cv" + (error ? "no" : "ok") + cycle}
        position={{ x: mode === "sd" ? 20 : 12, y: mode === "sd" ? 148 : error ? 502 : 572 }}
        spriteType={"GFX_rq_" + mode + "_cv" + (error ? "no" : "ok")}
        alwaysTransparent
        visible={(c) =>
          c.variable("rq_msg_cn") === cycle + 1 &&
          (mode === "sd"
            ? error
              ? c.variable("rq_msg") > 10 && c.variable("rq_msg") < 20
              : c.variable("rq_msg") > 0 && c.variable("rq_msg") < 3
            : error
              ? c.variable("rq_msg") === 21
              : c.variable("rq_msg") === 3)
        }
      />
    )),
  );
}
export const saveWindow = ScriptedWindow(
  {
    name: "rq_save_gui",
    path: "interface/rq_io.gui",
    context: "player_context",
    parentWindowName: "rq_dlg_host",
    dirty: "rq_dirty",
    visible: (c) =>
      c.triggers.has_country_flag("rq_active") &&
      c.triggers.has_country_flag("rq_q_open") &&
      c.variable("rq_dlg") === 1,
  },
  (ui) => (
    <ui.Container
      name="rq_save_window"
      position={{ x: 963, y: 4 }}
      size={{ width: 360, height: 256 }}
      moveable
      clipping={false}
      background={{ name: "Background", spriteType: "GFX_tiled_window_transparent" }}
    >
      <ui.Button
        clickSound="click_default"
        name="rq_sd_catch"
        position={{ x: -2600, y: -2600 }}
        spriteType="GFX_rq_catch"
        scale={80}
        visible={(c) => c.variable("rq_typing") === 2}
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setVariable("rq_typing", 0);
        }}
      />
      <ui.Icon
        name="rq_sd_bg"
        position={{ x: 0, y: 0 }}
        spriteType="GFX_rq_sd_bg"
        alwaysTransparent
      />
      <ui.Text
        name="rq_sd_title"
        position={{ x: 10, y: 12 }}
        text="RQ_SD_TITLE"
        className={styles.heading}
        maxWidth={340}
        maxHeight={26}
        format="center"
      />
      <ui.Text
        name="rq_sd_label"
        position={{ x: 10, y: 58 }}
        text="RQ_SD_LABEL"
        font="hoi_18mbs"
        maxWidth={340}
        maxHeight={20}
        format="center"
      />
      <ui.Icon
        name="rq_sd_box"
        position={{ x: 30, y: 84 }}
        spriteType="GFX_rq_dlg_box"
        alwaysTransparent
      />
      <ui.Button
        clickSound="click_default"
        name="rq_sd_boxhit"
        position={{ x: 30, y: 84 }}
        spriteType="GFX_rq_dlg_boxhit"
        tooltip="RQ_SD_BOX_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setVariable("rq_typing", 2);
        }}
      />
      <ui.Text
        name="rq_sd_name"
        position={{ x: 40, y: 90 }}
        text="RQ_SD_NAME"
        font="hoi_18mbs"
        maxWidth={240}
        maxHeight={20}
        fixedSize
        truncate
      />
      <ui.Button
        clickSound="click_default"
        name="rq_sd_caps"
        position={{ x: 298, y: 84 }}
        spriteType="GFX_rq_caps"
        text="RQ_SD_CAPS"
        font="hoi_16mbs"
        tooltip="RQ_SD_CAPS_TT"
        properties={{ frame: GuiVariable("rq_capsf") }}
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          caps(c);
          c.setVariable("rq_typing", 2);
        }}
      />
      <ui.Text
        name="rq_sd_info"
        position={{ x: 24, y: 124 }}
        text="RQ_SD_INFO"
        className={styles.label}
        maxWidth={312}
        format="center"
      />
      <ui.Text
        name="rq_sd_msg"
        position={{ x: 20, y: 148 }}
        text="RQ_SD_MSG"
        className={styles.label}
        maxWidth={320}
        maxHeight={44}
        format="center"
      />
      <ui.Button
        clickSound="click_default"
        name="rq_sd_cancel"
        position={{ x: 26, y: 200 }}
        text="RQ_SD_CANCEL"
        className={styles.action}
        tooltip="RQ_SD_CANCEL_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.run(dialogClose);
        }}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_sd_ok"
        position={{ x: 186, y: 200 }}
        text="RQ_SD_OK"
        className={styles.action}
        tooltip="RQ_SD_OK_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.run(saveDo);
        }}
      />
      {MessageAnimation(ui, "sd")}
    </ui.Container>
  ),
);
function SavedRow(ui: GuiBindings<CountryScope>) {
  return (
    <ui.Container
      name="rq_ld_entry"
      position={{ x: 0, y: 0 }}
      size={{ width: 348, height: 80 }}
      clipping={false}
    >
      <ui.Button
        clickSound="click_default"
        name="rq_sl_row"
        position={{ x: 0, y: 0 }}
        spriteType="GFX_rq_sl_row"
        tooltip="RQ_SL_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setTempVariable("rq_lsi", c.variable("rq_si"));
          c.run(loadDo);
        }}
      />
      <ui.Text
        name="rq_sl_name"
        position={{ x: 10, y: 8 }}
        text="RQ_SL_NAME"
        font="hoi_18mbs"
        maxWidth={238}
        maxHeight={22}
        fixedSize
        truncate
        alwaysTransparent
      />
      <ui.Text
        name="rq_sl_info"
        position={{ x: 10, y: 44 }}
        text="RQ_SL_INFOT"
        className={styles.label}
        maxWidth={198}
        alwaysTransparent
      />
      <ui.Icon
        name="rq_sl_flag"
        position={{ x: 272, y: 10 }}
        spriteType="GFX_rq_flag_none"
        scale={0.8}
        alwaysTransparent
        properties={{ image: "[rq_sl_flag]" }}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_sl_del"
        position={{ x: 238, y: 44 }}
        spriteType="GFX_NV_btn_delete"
        tooltip="RQ_SL_DEL_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setTempVariable("rq_lsi", c.variable("rq_si"));
          c.run(saveDelete);
        }}
      />
    </ui.Container>
  );
}
export const loadWindow = ScriptedWindow(
  {
    name: "rq_load_gui",
    path: "interface/rq_io.gui",
    context: "player_context",
    parentWindowName: "rq_dlg_host",
    dirty: "rq_dirty",
    visible: (c) =>
      c.triggers.has_country_flag("rq_active") &&
      c.triggers.has_country_flag("rq_q_open") &&
      c.variable("rq_dlg") === 2,
  },
  (ui) => (
    <ui.Container
      name="rq_load_window"
      position={{ x: 963, y: 4 }}
      size={{ width: 400, height: 620 }}
      moveable
      clipping={false}
      background={{ name: "Background", spriteType: "GFX_tiled_window_transparent" }}
    >
      <ui.Icon
        name="rq_ld_bg"
        position={{ x: 0, y: 0 }}
        spriteType="GFX_rq_ld_bg"
        alwaysTransparent
      />
      <ui.Text
        name="rq_ld_title"
        position={{ x: 10, y: 12 }}
        text="RQ_LD_TITLE"
        className={styles.heading}
        maxWidth={380}
        maxHeight={26}
        format="center"
      />
      <ui.Text
        name="rq_ld_sub"
        position={{ x: 20, y: 50 }}
        text="RQ_LD_SUB"
        className={styles.label}
        maxWidth={360}
        format="center"
      />
      <ui.Text
        name="rq_ld_empty"
        position={{ x: 24, y: 84 }}
        text="RQ_LD_EMPTY"
        className={styles.label}
        maxWidth={352}
        format="center"
        visible={(c) => c.arrayLength("rq_svlen") < 1}
      />
      <ui.Text
        name="rq_ld_ok"
        position={{ x: 16, y: 576 }}
        text="RQ_LD_OKT"
        className={styles.label}
        maxWidth={202}
        fixedSize
        truncate
      />
      <ui.Text
        name="rq_ld_msg"
        position={{ x: 16, y: 502 }}
        text="RQ_LD_MSG"
        className={styles.label}
        maxWidth={202}
        maxHeight={104}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_ld_back"
        position={{ x: 228, y: 568 }}
        text="RQ_LD_BACK"
        className={styles.action}
        tooltip="RQ_SD_CANCEL_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.run(dialogClose);
        }}
      />
      {MessageAnimation(ui, "ld")}
      <ui.Container
        name="rq_ld_scroll"
        position={{ x: 16, y: 80 }}
        size={{ width: 372, height: 412 }}
        verticalScrollbar="right_vertical_slider"
        scrollWheelFactor={40}
        smoothScrolling
        clipping
        background={{ name: "Background", spriteType: "GFX_tiled_window_transparent" }}
      >
        <ui.GridBox
          name="rq_ld_list"
          position={{ x: 0, y: 0 }}
          size={{ width: 348, height: "100%%" }}
          slotsize={{ width: 348, height: 80 }}
          format="UPPER_LEFT"
          maxSlotsHorizontal={1}
          list={{
            array: "rq_svlen",
            index: GuiVariable("rq_si"),
            value: GuiVariable("rq_sv"),
            entry: SavedRow(ui),
          }}
        />
      </ui.Container>
    </ui.Container>
  ),
);
