import { ScriptedWindow } from "krieg-lang/ui";
import { countryTarget } from "krieg-lang/hoi4";
import styles from "./panel.krg.css";
import {
  startup,
  textRules,
  toolVisible,
  hasMarks,
  isMarked,
  markFlag,
  toggleEnabled,
  toggleHidden,
  markState,
  unmarkState,
  markCountry,
  clearMarks,
  settleStates,
} from "./actions.krg";

export default [
  startup,
  textRules,
  ScriptedWindow(
    {
      name: "st_open",
      path: "interface/statetransf.gui",
      context: "player_context",
      visible: (c) => !c.triggers.has_global_flag("hidden_switch"),
    },
    (ui) => (
      <ui.Container name="st_open_container" position={{ x: 1100, y: 2 }}>
        <ui.Button
          name="open_ST"
          position={{ x: 0, y: 0 }}
          spriteType="GFX_generic_text_bg_203"
          shortcut="ctrl+shift+t"
          tooltip="[ST_TOOLTIP]"
          clickSound="click_ok"
          overSound="ui_menu_over"
          enabled={() => true}
          click={toggleEnabled}
        />
        <ui.Text
          name="title"
          position={{ x: 22, y: 5 }}
          text="[transfer_states_tooltip]"
          className={styles.title}
        />
      </ui.Container>
    ),
  ),
  ScriptedWindow(
    {
      name: "st_hide",
      path: "interface/statetransf.gui",
      context: "player_context",
      visible: () => true,
    },
    (ui) => (
      <ui.Container name="st_hide_container" position={{ x: 10000, y: 2 }}>
        <ui.Button
          name="hide_ST"
          position={{ x: 0, y: 0 }}
          spriteType="GFX_generic_text_bg_203"
          shortcut="ctrl+shift+h"
          clickSound="click_ok"
          overSound="ui_menu_over"
          enabled={() => true}
          click={toggleHidden}
        />
      </ui.Container>
    ),
  ),
  ScriptedWindow(
    {
      name: "st_state_manager_powers",
      path: "interface/statetransf.gui",
      context: "selected_state_context",
      visible: toolVisible,
    },
    (ui) => (
      <ui.Container
        name="st_state_manager_powers_container"
        position={{ x: 1250, y: 170 }}
        size={{ width: 250, height: 80 }}
        fadeTime={300}
        fadeType="linear"
        moveable
        background={{ name: "Background", spriteType: "GFX_BPT_areadef_conf_bg" }}
      >
        <ui.Text
          name="title"
          position={{ x: 14, y: 6 }}
          text="[This.GetName]"
          className={styles.title}
        />
        <ui.Button
          name="st_state_manager_power_mark_for_transfer"
          className={styles.state}
          shortcut="ctrl+z"
          frame={1}
          text="[This.mark_status]"
          tooltip="ST_STATE_MARK_FOR_TRANSFER"
          visible={(s) => !isMarked(s)}
          enabled={(s) => !isMarked(s)}
          click={markState}
        />
        <ui.Button
          name="st_state_manager_power_unmark_for_transfer"
          className={styles.state}
          shortcut="ctrl+z"
          frame={2}
          text="[This.mark_status]"
          tooltip="ST_STATE_UNMARK_FOR_TRANSFER"
          visible={isMarked}
          click={unmarkState}
        />
        <ui.Text
          name="marking"
          position={{ x: 155, y: 20 }}
          font="hoi_18mbs"
          borderSize={{ x: 0, y: 0 }}
          text="[This.mark_state_tooltip]"
          maxWidth={300}
          maxHeight={100}
        />
      </ui.Container>
    ),
  ),
  ScriptedWindow(
    {
      name: "st_country_powers",
      path: "interface/statetransf.gui",
      context: "selected_country_context",
      visible: toolVisible,
    },
    (ui) => (
      <ui.Container
        name="st_subject_powers_container"
        position={{ x: 1250, y: 50 }}
        size={{ width: 300, height: 200 }}
        fadeTime={300}
        fadeType="linear"
        moveable
        background={{ name: "Background", spriteType: "GFX_generic_bg_307x113" }}
      >
        <ui.Icon
          name="title_background"
          spriteType="GFX_generic_text_bg_154"
          position={{ x: 3, y: 3 }}
          orientation="UPPER_LEFT"
          alwaysTransparent
        />
        <ui.Text
          name="title"
          position={{ x: 14, y: 8 }}
          text="[This.GetName]"
          className={styles.title}
        />
        <ui.Button
          name="mark_all_states"
          position={{ x: 15, y: 50 }}
          spriteType="GFX_global_alert_icons"
          frame={39}
          shortcut="ctrl+a"
          tooltip="MARK_ALL_STATES"
          tooltipDelayed="MARK_ALL_STATES_DELAYED"
          enabled={(c) => c.anyState((s) => !s.triggers.hasStateFlag(markFlag))}
          click={(c) => markCountry(c, false)}
        />
        <ui.Button
          name="clear_all_markings"
          position={{ x: 70, y: 50 }}
          spriteType="GFX_global_alert_icons"
          frame={38}
          shortcut="ctrl+x"
          tooltip="CLEAR_ALL_MARKINGS"
          tooltipDelayed="CLEAR_ALL_MARKINGS_DELAYED"
          enabled={hasMarks}
          click={clearMarks}
        />
        <ui.Button
          name="mark_colonial_states"
          position={{ x: 125, y: 51 }}
          spriteType="GFX_global_diplorequest_icons"
          frame={11}
          scale={0.95}
          shortcut="ctrl+c"
          tooltip="MARK_COLONIES"
          tooltipDelayed="MARK_COLONIES_DELAYED"
          enabled={(c) =>
            c.anyState(
              (s) =>
                !s.triggers.is_in_home_area(true) &&
                !s.triggers.hasStateFlag(markFlag) &&
                !s.triggers.is_core_of(countryTarget("THIS")),
            )
          }
          click={(c) => markCountry(c, true)}
        />
        <ui.Icon
          name="Transfer_background"
          spriteType="GFX_tiled_window_small"
          position={{ x: 189, y: 9 }}
          orientation="UPPER_LEFT"
          alwaysTransparent
        />
        <ui.Button
          name="award_states"
          position={{ x: 193, y: 62 }}
          className={styles.action}
          shortcut="ctrl+t"
          text="Transfer"
          tooltip="AWARD_STATES"
          tooltipDelayed="AWARD_STATES_DELAYED"
          enabled={hasMarks}
          click={(c) => settleStates(c, false)}
        />
        <ui.Button
          name="core_states"
          position={{ x: 193, y: 20 }}
          className={styles.action}
          shortcut="ctrl+r"
          text="Core"
          tooltip="CORE_STATES"
          tooltipDelayed="CORE_STATES_DELAYED"
          enabled={hasMarks}
          click={(c) => settleStates(c, true)}
        />
      </ui.Container>
    ),
  ),
];
