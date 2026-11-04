import { ScriptedWindow, GuiVariable, type GuiBindings } from "krieg-lang/ui";
import { type CountryScope } from "krieg-lang/hoi4";
import { update, xpPreference } from "./core.krg.ts";
import { change, reset, clearPriorities, toggleSetting } from "./settings.krg.ts";
import { apsClose, dialogClose } from "./ui-actions.krg.ts";
import { pick, close } from "./mio.krg.ts";
import styles from "./research.krg.css";

function MioContent(ui: GuiBindings<CountryScope>) {
  return [
    <ui.Icon
      name="rq_ml_bg"
      position={{ x: 0, y: 0 }}
      spriteType="GFX_rq_ml_bg"
      alwaysTransparent
    />,
    <ui.Text
      name="rq_ml_title"
      position={{ x: 18, y: 12 }}
      text="RQ_ML_TITLE"
      className={styles.heading}
      maxWidth={320}
    />,
    <ui.Button
      clickSound="click_default"
      name="rq_ml_close"
      position={{ x: 354, y: 8 }}
      spriteType="GFX_closebutton"
      tooltip="RQ_ML_CLOSE_TT"
      click={(c) => {
        c.addVariable("rq_dirty", 1);
        c.run(close);
      }}
    />,
    <ui.Text
      name="rq_ml_tech"
      position={{ x: 20, y: 54 }}
      text="RQ_ML_TECH"
      font="hoi_18mbs"
      maxWidth={360}
      maxHeight={22}
      fixedSize
      truncate
    />,
    <ui.Text
      name="rq_ml_sub"
      position={{ x: 20, y: 78 }}
      text="RQ_ML_SUB"
      className={styles.label}
      maxWidth={360}
    />,
    <ui.Text
      name="rq_ml_hint"
      position={{ x: 20, y: 98 }}
      text="RQ_ML_HINT"
      className={styles.label}
      maxWidth={360}
    />,
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((slot) => [
      slot % 2 === 0 && (
        <ui.Icon
          name={"rq_ml" + slot + "_row"}
          position={{ x: 20, y: 126 + slot * 40 }}
          spriteType="GFX_rq_ml_row"
          alwaysTransparent
          visible={(c) => slot === 0 || c.variable("rq_ml" + slot + "_i") > 0}
        />
      ),
      <ui.Icon
        name={"rq_ml" + slot + "_sel"}
        position={{ x: 20, y: 126 + slot * 40 }}
        spriteType="GFX_rq_ml_sel"
        alwaysTransparent
        visible={(c) =>
          slot === 0
            ? c.variable("rq_ml_cur") < 1
            : c.variable("rq_ml" + slot + "_i") > 0 && c.variable("rq_ml" + slot + "_s") === 3
        }
      />,
      <ui.Button
        clickSound="click_default"
        name={"rq_ml" + slot + "_pick"}
        position={{ x: 20, y: 126 + slot * 40 }}
        spriteType="GFX_rq_ml_hit"
        tooltip={"RQ_ML" + slot + "_PICK_TT"}
        visible={(c) => slot === 0 || c.variable("rq_ml" + slot + "_i") > 0}
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setTempVariable("rq_mlk", slot);
          c.setTempVariable("rq_mlsh", 0);
          c.run(pick);
        }}
        events={{
          shiftClick: (c) => {
            c.addVariable("rq_dirty", 1);
            c.setTempVariable("rq_mlk", slot);
            c.setTempVariable("rq_mlsh", 1);
            c.run(pick);
          },
        }}
      />,
      slot > 0 && (
        <ui.Icon
          name={"rq_ml" + slot + "_icon"}
          position={{ x: 26, y: 130 + slot * 40 }}
          spriteType="GFX_design_team_icon"
          scale={0.5}
          alwaysTransparent
          properties={{ image: "[rq_ml" + slot + "_icon]" }}
          visible={(c) => c.variable("rq_ml" + slot + "_i") > 0}
        />
      ),
      <ui.Text
        name={"rq_ml" + slot + "_name"}
        position={{ x: 64, y: (slot === 0 ? 136 : 128) + slot * 40 }}
        text={"RQ_ML" + slot + "_NAME"}
        className={styles.label}
        maxWidth={304}
        fixedSize
        truncate
        visible={(c) => slot === 0 || c.variable("rq_ml" + slot + "_i") > 0}
      />,
      slot > 0 && (
        <ui.Text
          name={"rq_ml" + slot + "_info"}
          position={{ x: 64, y: 145 + slot * 40 }}
          text={"RQ_ML" + slot + "_INFO"}
          className={styles.label}
          maxWidth={304}
          maxHeight={18}
          visible={(c) => c.variable("rq_ml" + slot + "_i") > 0}
        />
      ),
    ]),
    <ui.Text
      name="rq_ml_none"
      position={{ x: 28, y: 176 }}
      text="RQ_ML_NONE"
      className={styles.label}
      maxWidth={344}
      maxHeight={40}
      visible={(c) => c.variable("rq_ml_n") < 1}
    />,
  ];
}
export const mioWindows = [false, true].map((tree) =>
  ScriptedWindow(
    {
      name: tree ? "rq_mio_tree_gui" : "rq_mio_gui",
      path: "interface/rq_queue.gui",
      context: "player_context",
      parentWindowName: tree ? "countrytechtreeview" : "rq_dlg_host",
      dirty: "rq_dirty",
      visible: (c) =>
        c.triggers.has_country_flag("rq_active") &&
        c.variable("rq_ml_t") > 0 &&
        (tree ? c.triggers.has_country_flag("rq_qmode") : c.triggers.has_country_flag("rq_q_open")),
    },
    (ui) => (
      <ui.Container
        name={tree ? "rq_mio_tree_window" : "rq_mio_window"}
        position={{ x: tree ? -440 : 963, y: tree ? 60 : 4 }}
        size={{ width: 400, height: 582 }}
        orientation={tree ? "UPPER_RIGHT" : "UPPER_LEFT"}
        moveable
        clipping={false}
        background={{ name: "Background", spriteType: "GFX_tiled_window_transparent" }}
      >
        {MioContent(ui)}
      </ui.Container>
    ),
  ),
);
export const plannerSettings = ScriptedWindow(
  {
    name: "rq_aps_gui",
    path: "interface/rq_queue.gui",
    context: "player_context",
    parentWindowName: "rq_dlg_host",
    dirty: "rq_dirty",
    visible: (c) =>
      c.triggers.has_country_flag("rq_active") &&
      c.triggers.has_country_flag("rq_q_open") &&
      c.variable("rq_ap_win") === 1 &&
      c.variable("rq_ml_t") < 1 &&
      c.variable("rq_dlg") < 1 &&
      c.variable("rq_clr") < 1,
  },
  (ui) => (
    <ui.Container
      name="rq_aps_window"
      position={{ x: 963, y: 4 }}
      size={{ width: 360, height: 574 }}
      moveable
      clipping={false}
      background={{ name: "Background", spriteType: "GFX_tiled_window_transparent" }}
    >
      <ui.Icon
        name="rq_aps_bg"
        position={{ x: 0, y: 0 }}
        spriteType="GFX_rq_aps_bg"
        alwaysTransparent
      />
      <ui.Text
        name="rq_aps_title"
        position={{ x: 18, y: 12 }}
        text="RQ_APS_TITLE"
        className={styles.heading}
        maxWidth={280}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_aps_close"
        position={{ x: 314, y: 8 }}
        spriteType="GFX_closebutton"
        tooltip="RQ_APS_CLOSE_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.run(apsClose);
          c.run(update);
        }}
      />
      {[1, 10, 10, 0.25, 0.25, 0.25, 0.25].map((step, i) => [
        <ui.Text
          name={"rq_aps" + i + "_name"}
          position={{ x: 16, y: 56 + i * 34 }}
          text={"RQ_APS" + i + "_NAME"}
          className={styles.label}
          maxWidth={210}
          tooltip={"RQ_APS" + i + "_TT"}
        />,
        <ui.Text
          name={"rq_aps" + i + "_val"}
          position={{ x: 222, y: 56 + i * 34 }}
          text={"RQ_APS" + i + "_VAL"}
          className={styles.label}
          maxWidth={70}
          format="right"
        />,
        [-1, 1].map((sign) => (
          <ui.Button
            clickSound="click_default"
            name={"rq_aps" + i + (sign < 0 ? "_minus" : "_plus")}
            position={{ x: sign < 0 ? 298 : 326, y: (sign < 0 ? 51 : 50) + i * 34 }}
            spriteType={sign < 0 ? "GFX_subtract_one" : "GFX_add_one"}
            tooltip={sign < 0 ? "RQ_APS_MINUS_TT" : "RQ_APS_PLUS_TT"}
            click={(c) => {
              c.addVariable("rq_dirty", 1);
              c.setTempVariable("rq_apk", i + 1);
              c.setTempVariable("rq_apd", sign * step);
              c.run(change);
            }}
            events={{
              shiftClick: (c) => {
                c.addVariable("rq_dirty", 1);
                c.setTempVariable("rq_apk", i + 1);
                c.setTempVariable("rq_apd", sign * (i < 3 ? step * 5 : 1));
                c.run(change);
              },
            }}
          />
        )),
      ])}
      {[
        { name: "jump", key: "JUMP" },
        { name: "mio", key: "MIO" },
        { name: "jg", key: "JG" },
        { name: "xp", key: "XP" },
      ].map((toggle, i) => [
        <ui.Button
          clickSound="click_default"
          name={"rq_aps_" + toggle.name}
          position={{ x: 12, y: 289 + i * 34 }}
          spriteType="GFX_generic_checkbox"
          properties={{ frame: GuiVariable("rq_ap_" + toggle.name + "f") }}
          tooltip={"RQ_APS_" + toggle.key + "_TT"}
          click={(c) => {
            c.addVariable("rq_dirty", 1);
            if (toggle.name === "xp") c.run(xpPreference);
            else toggleSetting(c, "rq_ap_" + toggle.name + "f");
          }}
        />,
        <ui.Text
          name={"rq_aps_" + toggle.name + "n"}
          position={{ x: 52, y: 295 + i * 34 }}
          text={"RQ_APS_" + toggle.key}
          className={styles.label}
          maxWidth={298}
          tooltip={"RQ_APS_" + toggle.key + "_TT"}
        />,
      ])}
      <ui.Text
        name="rq_aps_pri"
        position={{ x: 16, y: 428 }}
        text="RQ_APS_PRI"
        className={styles.label}
        maxWidth={328}
        maxHeight={40}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_aps_reset"
        position={{ x: 16, y: 472 }}
        text="RQ_APS_RESET"
        className={styles.action}
        tooltip="RQ_APS_RESET_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.run(reset);
        }}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_aps_clearpri"
        position={{ x: 180, y: 472 }}
        text="RQ_APS_CLEARPRI"
        className={styles.action}
        tooltip="RQ_APS_CLEARPRI_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.run(clearPriorities);
        }}
      />
      <ui.Text
        name="rq_aps_note"
        position={{ x: 16, y: 516 }}
        text="RQ_APS_NOTE"
        className={styles.label}
        maxWidth={328}
        maxHeight={40}
      />
    </ui.Container>
  ),
);
export const stats = ScriptedWindow(
  {
    name: "rq_stats_gui",
    path: "interface/rq_stats.gui",
    context: "player_context",
    parentWindowName: "rq_dlg_host",
    dirty: "rq_dirty",
    visible: (c) =>
      c.triggers.has_country_flag("rq_active") &&
      c.triggers.has_country_flag("rq_q_open") &&
      c.variable("rq_dlg") === 3,
  },
  (ui) => (
    <ui.Container
      name="rq_stats_window"
      position={{ x: 963, y: 4 }}
      size={{ width: 440, height: 568 }}
      moveable
      clipping={false}
      background={{ name: "Background", spriteType: "GFX_tiled_window_transparent" }}
    >
      <ui.Icon
        name="rq_st_bg"
        position={{ x: 0, y: 0 }}
        spriteType="GFX_rq_st_bg"
        alwaysTransparent
      />
      <ui.Text
        name="rq_st_title"
        position={{ x: 18, y: 12 }}
        text="RQ_ST_TITLE"
        className={styles.heading}
        maxWidth={360}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_st_close"
        position={{ x: 394, y: 8 }}
        spriteType="GFX_closebutton"
        tooltip="RQ_APS_CLOSE_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.run(dialogClose);
        }}
      />
      {["queue", "done", "save", "waste"].map((name, i) => [
        <ui.Text
          name={"rq_st_t" + name + "n"}
          position={{ x: 20 + i * 102, y: 66 }}
          text={"RQ_ST_T" + i + "N"}
          className={styles.heading}
          maxWidth={92}
          format="center"
          tooltip={"RQ_ST_T" + i + "TT"}
        />,
        <ui.Text
          name={"rq_st_t" + name + "l"}
          position={{ x: 20 + i * 102, y: 100 }}
          text={"RQ_ST_T" + i + "L"}
          className={styles.label}
          maxWidth={92}
          format="center"
          tooltip={"RQ_ST_T" + i + "TT"}
        />,
      ])}
      {[
        { name: "f", key: "F", y: 147 },
        { name: "l", key: "L", y: 217 },
      ].map((event) => [
        <ui.Text
          name={"rq_st_" + event.name + "lab"}
          position={{ x: 162, y: event.y }}
          text={"RQ_ST_" + event.key + "LAB"}
          className={styles.label}
          maxWidth={140}
        />,
        <ui.Text
          name={"rq_st_" + event.name + "date"}
          position={{ x: 290, y: event.y }}
          text={"RQ_ST_" + event.key + "DATE"}
          className={styles.label}
          maxWidth={120}
          format="right"
        />,
        <ui.Text
          name={"rq_st_" + event.name + "name"}
          position={{ x: 162, y: event.y + 23 }}
          text={"RQ_ST_" + event.key + "NAME"}
          font="hoi_18mbs"
          maxWidth={248}
          maxHeight={22}
          fixedSize
          truncate
        />,
        [0.3, 0.33, 0.36, 0.4, 0.43, 0.46, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8].map((scale, i) => (
          <ui.Icon
            name={"rq_st_" + event.name + "i" + i}
            spriteType="GFX_technology_medium"
            scale={scale}
            alwaysTransparent
            properties={{
              image: "[rq_st_" + event.name + "icon]",
              x: GuiVariable("rq_st_" + event.name + "xo"),
              y: GuiVariable("rq_st_" + event.name + "y"),
            }}
            visible={(c) =>
              c.variable("rq_st_" + event.name) > 0 && c.variable("rq_st_" + event.name + "w") === i
            }
          />
        )),
      ])}
      {["known", "nq", "ns", "mio", "ap", "ah", "qd", "avg", "sv", "since"].map((name, i) => [
        <ui.Text
          name={"rq_st_r" + name}
          position={{ x: 28, y: 287 + i * 26 }}
          text={"RQ_ST_R" + i}
          className={styles.label}
          maxWidth={254}
          tooltip={"RQ_ST_R" + i + "TT"}
        />,
        <ui.Text
          name={"rq_st_r" + name + "v"}
          position={{ x: 282, y: 287 + i * 26 }}
          text={"RQ_ST_R" + i + "V"}
          className={styles.label}
          maxWidth={130}
          format="right"
          tooltip={"RQ_ST_R" + i + "TT"}
        />,
      ])}
    </ui.Container>
  ),
);
