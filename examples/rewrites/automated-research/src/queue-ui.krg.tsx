import { ScriptedWindow, GuiVariable, type GuiBindings } from "krieg-lang/ui";
import { type CountryScope } from "krieg-lang/hoi4";
import {
  update,
  rowMove,
  rowRemove,
  clearAll,
  groupClick,
  sortClick,
  tabPick,
  tabAdd,
  xpToggle,
} from "./core.krg.ts";
import { toggle, replan } from "./planner.krg.ts";
import { queueToggle, modeToggle, dialogToggle, apsToggle, clearOpen } from "./ui-actions.krg.ts";
import { rowMio } from "./mio.krg.ts";

const scales = [0.3, 0.33, 0.36, 0.4, 0.43, 0.46, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8] as const;
function row(c: CountryScope, key: string) {
  return c.arrayAt("rq_" + key, c.variable("rq_ev"));
}
function QueueRow(ui: GuiBindings<CountryScope>) {
  return (
    <ui.Container
      name="rq_q_entry"
      position={{ x: 0, y: 0 }}
      size={{ width: 410, height: 64 }}
      clipping={false}
    >
      {[0, 1].map((dim) => [
        <ui.Icon
          name={dim === 0 ? "rq_qe_bg" : "rq_qe_bgd"}
          spriteType={dim === 0 ? "GFX_rq_row_bg" : "GFX_rq_row_bgd"}
          position={{ x: 0, y: 1 }}
          alwaysTransparent
          visible={(c) => (dim === 0 ? row(c, "qst") < 3 : row(c, "qst") > 2)}
        />,
        <ui.Text
          name={dim === 0 ? "rq_qe_num" : "rq_qe_numd"}
          text={dim === 0 ? "RQ_QE_NUM" : "RQ_QE_NUMD"}
          position={{ x: 9, y: 26 }}
          font="hoi_18mbs"
          maxWidth={38}
          maxHeight={20}
          format="center"
          visible={(c) => (dim === 0 ? row(c, "qst") < 3 : row(c, "qst") > 2)}
        />,
      ])}
      {[1, 2].map((font) => (
        <ui.Text
          name={font === 1 ? "rq_qe_name" : "rq_qe_names"}
          text="RQ_QE_NAME"
          position={{ x: 56, y: font === 1 ? 10 : 11 }}
          font={font === 1 ? "hoi_18mbs" : "hoi_16mbs"}
          maxWidth={160}
          maxHeight={20}
          fixedSize
          truncate
          visible={(c) => row(c, "qfs") === font}
        />
      ))}
      {[0, 1].map((wide) => (
        <ui.Text
          name={wide === 0 ? "rq_qe_state" : "rq_qe_statew"}
          text="RQ_QE_STATE"
          position={{ x: 56, y: 30 }}
          font="hoi_16mbs"
          maxWidth={wide === 0 ? 166 : 116}
          maxHeight={18}
          fixedSize={wide === 1}
          truncate={wide === 1}
          visible={(c) => (wide === 0 ? row(c, "qiw") < 100 : row(c, "qiw") > 99)}
        />
      ))}
      <ui.Container
        name="rq_qe_barclip"
        position={{ x: 56, y: 49 }}
        size={{ width: 160, height: 10 }}
        clipping
      >
        <ui.Icon
          name="rq_qe_barbg"
          spriteType="GFX_rq_qbar_bg"
          position={{ x: 0, y: 0 }}
          alwaysTransparent
        />
        <ui.Icon
          name="rq_qe_bar"
          spriteType="GFX_rq_qbar_fill"
          position={{ x: 0, y: 0 }}
          properties={{ x: GuiVariable("rq_qbarx^rq_ev") }}
          alwaysTransparent
          visible={(c) => row(c, "qpct") > 0}
        />
        <ui.Icon
          name="rq_qe_barfx"
          spriteType="GFX_rq_qbar_anim"
          position={{ x: 0, y: 0 }}
          properties={{ x: GuiVariable("rq_qbarx^rq_ev") }}
          alwaysTransparent
          visible={(c) => row(c, "qpct") > 0 && row(c, "qst") < 3}
        />
      </ui.Container>
      <ui.Icon
        name="rq_qe_barframe"
        position={{ x: 54, y: 47 }}
        spriteType="GFX_rq_qbar_frame"
        tooltip="RQ_BAR_TT"
      />
      <ui.Icon
        name="rq_qe_bnu"
        position={{ x: 6, y: 47 }}
        spriteType="GFX_rq_bonus_on"
        tooltip="RQ_BNU_TT"
        visible={(c) => row(c, "qbn") === 1 && row(c, "qbv") > 0 && row(c, "qla") <= 0}
      />
      <ui.Icon
        name="rq_qe_bnh"
        position={{ x: 6, y: 47 }}
        spriteType="GFX_rq_bonus_held"
        tooltip="RQ_BNH_TT"
        visible={(c) => row(c, "qbn") === 2 && row(c, "qla") <= 0}
      />
      <ui.Icon
        name="rq_qe_bns"
        position={{ x: 6, y: 47 }}
        spriteType="GFX_rq_bonus_on"
        tooltip="RQ_BNS_TT"
        visible={(c) => row(c, "qbn") < 1 && row(c, "qsh") > 0 && row(c, "qla") <= 0}
      />
      <ui.Icon
        name="rq_qe_sw"
        position={{ x: 8, y: 45 }}
        spriteType="GFX_rq_ahead"
        tooltip="RQ_SW_TT"
        visible={(c) => row(c, "qla") > 0}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_qe_xp"
        position={{ x: 29, y: 48 }}
        spriteType="GFX_rq_xp"
        properties={{ frame: GuiVariable("rq_qxs^rq_ev") }}
        tooltip="RQ_QE_XP_TT"
        visible={(c) => row(c, "qxs") > 0}
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setTempVariable("rq_k", c.variable("rq_ev"));
          c.run(xpToggle);
        }}
      />
      {scales.map((scale, i) => (
        <ui.Icon
          name={"rq_qe_icon" + i}
          spriteType="GFX_technology_medium"
          scale={scale}
          alwaysTransparent
          properties={{
            image: "[rq_qe_icon]",
            x: GuiVariable("rq_qix^rq_ev"),
            y: GuiVariable("rq_qiy^rq_ev"),
          }}
          visible={(c) => row(c, "qiw") === i || row(c, "qiw") === i + 100}
        />
      ))}
      <ui.Button
        clickSound="click_default"
        name="rq_qe_mionone"
        position={{ x: 310, y: 24 }}
        spriteType="GFX_design_team_icon"
        tooltip="RQ_QE_MIO_TT"
        visible={(c) => row(c, "qst") !== 1 && row(c, "qc") === 1 && row(c, "qmio") < 1}
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setTempVariable("rq_k", c.variable("rq_ev"));
          c.run(rowMio);
        }}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_qe_mio"
        position={{ x: 301, y: 14 }}
        spriteType="GFX_design_team_icon"
        scale={0.65}
        properties={{ image: "[rq_qe_mioicon]" }}
        tooltip="RQ_QE_MIO_TT"
        visible={(c) => row(c, "qst") !== 1 && row(c, "qmio") > 0}
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setTempVariable("rq_k", c.variable("rq_ev"));
          c.run(rowMio);
        }}
      />
      <ui.Icon
        name="rq_qe_miov"
        position={{ x: 301, y: 14 }}
        spriteType="GFX_design_team_icon"
        scale={0.65}
        properties={{ image: "[rq_qe_mioicon]" }}
        tooltip="RQ_QE_MIOV_TT"
        visible={(c) => row(c, "qst") === 1 && row(c, "qmio") > 0}
      />
      <ui.Icon
        name="rq_qe_ap"
        position={{ x: 270, y: 38 }}
        spriteType="GFX_rq_ap_mark"
        tooltip="RQ_AP_ROW_TT"
        visible={(c) => row(c, "qau") === 1}
      />
      {[-1, 1].map((dir) => [
        <ui.Button
          clickSound="click_default"
          name={dir < 0 ? "rq_qe_up" : "rq_qe_down"}
          position={{ x: 347, y: dir < 0 ? 12 : 36 }}
          spriteType={dir < 0 ? "GFX_arrow_up_small" : "GFX_arrow_down_small"}
          scale={0.85}
          tooltip={dir < 0 ? "RQ_UP_TT" : "RQ_DOWN_TT"}
          visible={(c) => row(c, "qst") !== 1 && row(c, dir < 0 ? "qcu" : "qcd") === 1}
          click={(c) => {
            c.addVariable("rq_dirty", 1);
            c.setTempVariable("rq_k", c.variable("rq_ev"));
            c.setTempVariable("rq_dir", dir);
            c.run(rowMove);
          }}
          events={{
            shiftClick: (c) => {
              c.addVariable("rq_dirty", 1);
              c.setTempVariable("rq_k", c.variable("rq_ev"));
              c.setTempVariable("rq_dir", dir * 2);
              c.run(rowMove);
            },
          }}
        />,
        [
          { state: 0, suffix: "x", tip: dir < 0 ? "RQ_UPX_TT" : "RQ_DOWNX_TT" },
          { state: 2, suffix: "e", tip: dir < 0 ? "RQ_UPE_TT" : "RQ_DOWNE_TT" },
          { state: 3, suffix: "b", tip: "RQ_DOWNB_TT" },
          { state: 4, suffix: "s", tip: "RQ_SORTED_TT" },
          { state: 5, suffix: "g", tip: "RQ_GROUPED_TT" },
        ]
          .filter((marker) => dir > 0 || marker.state !== 3)
          .map((marker) => (
            <ui.Icon
              name={"rq_qe_" + (dir < 0 ? "up" : "down") + marker.suffix}
              position={{ x: 347, y: dir < 0 ? 12 : 36 }}
              spriteType={dir < 0 ? "GFX_rq_arrow_up_off" : "GFX_rq_arrow_down_off"}
              scale={0.85}
              tooltip={marker.tip}
              visible={(c) =>
                row(c, "qst") !== 1 && row(c, dir < 0 ? "qcu" : "qcd") === marker.state
              }
            />
          )),
      ])}
      <ui.Button
        clickSound="click_default"
        name="rq_qe_remove"
        position={{ x: 368, y: 18 }}
        spriteType="GFX_NV_btn_delete"
        tooltip="RQ_REMOVE_TT"
        visible={(c) =>
          row(c, "qst") !== 1 &&
          !(
            c.triggers.has_game_rule({ rule: "rq_lock_slots", option: "ON" }) && row(c, "qst") === 2
          )
        }
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setTempVariable("rq_k", c.variable("rq_ev"));
          c.run(rowRemove);
        }}
        events={{
          shiftClick: (c) => {
            c.addVariable("rq_dirty", 1);
            c.run(clearOpen);
          },
        }}
      />
    </ui.Container>
  );
}
export const queue = ScriptedWindow(
  {
    name: "rq_queue_gui",
    path: "interface/rq_queue.gui",
    context: "player_context",
    parentWindowName: "rq_q_frame",
    dirty: "rq_dirty",
    visible: (c) =>
      c.triggers.has_country_flag("rq_active") && c.triggers.has_country_flag("rq_q_open"),
  },
  (ui) => (
    <ui.Container
      name="rq_queue_window"
      position={{ x: -430, y: 0 }}
      showPosition={{ x: 0, y: 0 }}
      showAnimationType="decelerated"
      hideAnimationType="accelerated"
      animationTime={300}
      size={{ width: 430, height: "100%%" }}
      clipping={false}
    >
      <ui.Icon name="rq_q_bg" position={{ x: 0, y: 0 }} spriteType="GFX_rq_queue_bg" />
      <ui.Icon
        name="rq_q_bgbottom"
        position={{ x: 0, y: -64 }}
        orientation="LOWER_LEFT"
        spriteType="GFX_rq_queue_bg_bottom"
      />
      <ui.Icon
        name="rq_q_hbg"
        position={{ x: 4, y: 47 }}
        spriteType="GFX_rq_head_bg"
        alwaysTransparent
      />
      <ui.Icon
        name="rq_q_head"
        position={{ x: 5, y: 7 }}
        spriteType="GFX_rq_queue_header"
        alwaysTransparent
      />
      <ui.Text
        name="rq_q_title"
        position={{ x: 5, y: 8 }}
        text="RQ_Q_TITLE"
        font="hoi_36header"
        maxWidth={420}
        maxHeight={20}
        format="center"
      />
      {[
        { key: 1, name: "save", x: 10, y: 55 },
        { key: 2, name: "load", x: 42, y: 55 },
        { key: 3, name: "stats", x: 389, y: 11 },
      ].flatMap((dlg) =>
        [0, 1].map((on) => (
          <ui.Button
            clickSound="click_default"
            name={"rq_q_" + dlg.name + (on === 1 ? "on" : "")}
            position={{ x: dlg.x, y: dlg.y }}
            spriteType={"GFX_rq_btn_" + dlg.name + (on === 1 ? "_on" : "")}
            tooltip={dlg.key === 1 ? "RQ_SAVE_TT" : dlg.key === 2 ? "RQ_LOAD_TT" : "RQ_STATS_TT"}
            visible={(c) =>
              on === 1 ? c.variable("rq_dlg") === dlg.key : c.variable("rq_dlg") !== dlg.key
            }
            click={(c) => {
              c.addVariable("rq_dirty", 1);
              c.setTempVariable("rq_dk", dlg.key);
              c.run(dialogToggle);
            }}
          />
        )),
      )}
      {[0, 1].map((on) => (
        <ui.Button
          clickSound="click_default"
          name={on === 0 ? "rq_q_auto" : "rq_q_autoon"}
          position={{ x: 74, y: 55 }}
          spriteType={on === 0 ? "GFX_rq_btn_auto" : "GFX_rq_btn_auto_on"}
          tooltip={on === 0 ? "RQ_AP_OFF_TT" : "RQ_AP_ON_TT"}
          visible={(c) =>
            on === 1
              ? c.triggers.has_country_flag("rq_ap_on")
              : !c.triggers.has_country_flag("rq_ap_on")
          }
          click={(c) => {
            c.addVariable("rq_dirty", 1);
            c.run(toggle);
          }}
          events={{
            rightClick: (c) => {
              c.addVariable("rq_dirty", 1);
              c.run(apsToggle);
            },
            shiftClick: (c) => {
              if (c.triggers.has_country_flag("rq_ap_on")) {
                c.addVariable("rq_dirty", 1);
                c.run(replan);
                c.run(update);
              }
            },
          }}
        />
      ))}
      {[0, 1].map((on) => (
        <ui.Button
          clickSound="click_default"
          name={on === 0 ? "rq_q_groupoff" : "rq_q_group"}
          position={{ x: 106, y: 56 }}
          spriteType={on === 0 ? "GFX_rq_group_off" : "GFX_rq_group_on"}
          tooltip={on === 0 ? "RQ_GROUP_OFF_TT" : "RQ_GROUP_ON_TT"}
          visible={(c) =>
            on === 1 ? c.variable("rq_grp_on") === 1 : c.variable("rq_grp_on") !== 1
          }
          click={(c) => {
            c.addVariable("rq_dirty", 1);
            c.run(groupClick);
          }}
        />
      ))}
      <ui.Icon
        name="rq_q_search"
        position={{ x: 140, y: 57 }}
        spriteType="GFX_rq_search_bg"
        alwaysTransparent
      />
      <ui.Button
        clickSound="click_default"
        name="rq_q_sbox"
        position={{ x: 140, y: 57 }}
        spriteType="GFX_rq_sbox_hit"
        tooltip="RQ_SEARCH_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          if (c.variable("rq_typing") === 1) c.setVariable("rq_typing", 0);
          else c.setVariable("rq_typing", 1);
        }}
      />
      <ui.Text
        name="rq_q_shint"
        position={{ x: 148, y: 61 }}
        text="RQ_Q_SHINT"
        font="hoi_16mbs"
        maxWidth={114}
        maxHeight={20}
        visible={(c) => c.arrayLength("rq_tx_s") < 1}
      />
      <ui.Text
        name="rq_q_stext"
        position={{ x: 148, y: 61 }}
        text="RQ_Q_STEXT"
        font="hoi_16mbs"
        maxWidth={114}
        maxHeight={20}
        fixedSize
        truncate
      />
      <ui.Button
        clickSound="click_default"
        name="rq_q_cap"
        position={{ x: 273, y: 56 }}
        spriteType="GFX_rq_qcap"
        properties={{ frame: GuiVariable("rq_vcf") }}
        tooltip="RQ_Q_CAP_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.addVariable("rq_vcm", 1);
          if (c.variable("rq_vcm") > 4) c.setVariable("rq_vcm", 0);
          c.setVariable("rq_rfull", 1);
          c.run(update);
        }}
      />
      {[1, 2].map((sort) => (
        <ui.Button
          clickSound="click_default"
          name={sort === 1 ? "rq_q_sortname" : "rq_q_sorttime"}
          position={{ x: sort === 1 ? 305 : 392, y: 56 }}
          spriteType={sort === 1 ? "GFX_sort_up_down_button_83x29" : "GFX_rq_sort_time"}
          text={sort === 1 ? "RQ_SORT_NAME" : ""}
          font="hoi_16mbs"
          tooltip={sort === 1 ? "RQ_SORTN_TT" : "RQ_SORTT_TT"}
          properties={{ frame: GuiVariable(sort === 1 ? "rq_sortn_f" : "rq_sortt_f") }}
          click={(c) => {
            c.addVariable("rq_dirty", 1);
            c.setTempVariable("rq_sb", sort);
            c.run(sortClick);
          }}
        />
      ))}
      {[10, 56, 102, 148, 194, 239, 285, 331, 377].map((x, i) => (
        <ui.Button
          clickSound="click_default"
          name={"rq_q_tab" + i}
          position={{ x, y: 88 }}
          spriteType={"GFX_rq_tab" + i}
          tooltip="RQ_SOON_TAB"
          properties={{ frame: GuiVariable("rq_tabf" + i) }}
          click={(c) => {
            c.addVariable("rq_dirty", 1);
            c.setTempVariable("rq_tabk", i + 1);
            c.run(tabPick);
          }}
          events={{
            shiftClick: (c) => {
              c.addVariable("rq_dirty", 1);
              c.setTempVariable("rq_tabk", i + 1);
              c.run(tabAdd);
            },
          }}
        />
      ))}
      <ui.Text
        name="rq_q_empty"
        position={{ x: 20, y: 138 }}
        text="RQ_Q_EMPTY"
        font="hoi_16mbs"
        maxWidth={390}
        maxHeight={80}
        visible={(c) => c.variable("rq_qn") < 1}
      />
      <ui.Text
        name="rq_q_tabempty"
        position={{ x: 20, y: 138 }}
        text="RQ_Q_TABEMPTY"
        font="hoi_16mbs"
        maxWidth={390}
        maxHeight={80}
        visible={(c) => c.variable("rq_qn") > 0 && c.arrayLength("rq_view") < 1}
      />
      <ui.Container
        name="rq_q_scroll"
        position={{ x: 8, y: 128 }}
        size={{ width: 423, height: -14 }}
        verticalScrollbar="right_vertical_slider"
        scrollWheelFactor={40}
        smoothScrolling
        clipping
        background={{ name: "Background", spriteType: "GFX_tiled_window_transparent" }}
      >
        <ui.GridBox
          name="rq_q_list"
          position={{ x: 0, y: 0 }}
          size={{ width: 410, height: "100%%" }}
          slotsize={{ width: 410, height: 64 }}
          format="UPPER_LEFT"
          maxSlotsHorizontal={1}
          list={{
            array: "rq_vshow",
            value: GuiVariable("rq_ev"),
            index: GuiVariable("rq_ei"),
            entry: QueueRow(ui),
          }}
        />
      </ui.Container>
    </ui.Container>
  ),
);
export const queueOpener = ScriptedWindow(
  {
    name: "rq_toggle_gui",
    path: "interface/rq_queue.gui",
    context: "player_context",
    parentWindowName: "countrytechnologyview",
    dirty: "rq_dirty",
    visible: (c) => !c.isAI,
  },
  (ui) => (
    <ui.Container
      name="rq_toggle_window"
      position={{ x: -80, y: 6 }}
      size={{ width: 40, height: 40 }}
      orientation="UPPER_RIGHT"
      clipping={false}
    >
      <ui.Button
        clickSound="click_default"
        name="rq_t_arrow"
        position={{ x: 0, y: 3 }}
        spriteType="GFX_rq_toggle"
        tooltip="RQ_T_ARROW_TT"
        properties={{ frame: GuiVariable("rq_t_frame") }}
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.run(queueToggle);
        }}
      />
    </ui.Container>
  ),
);
export const treeMode = ScriptedWindow(
  {
    name: "rq_bar_gui",
    path: "interface/rq_queue.gui",
    context: "player_context",
    parentWindowName: "countrytechtreeview",
    dirty: "rq_dirty",
    visible: (c) => !c.isAI,
  },
  (ui) => (
    <ui.Container
      name="rq_bar_window"
      position={{ x: -290, y: 6 }}
      size={{ width: 221, height: 34 }}
      orientation="UPPER_RIGHT"
    >
      <ui.Button
        clickSound="click_default"
        name="rq_b_mode"
        position={{ x: 0, y: 0 }}
        spriteType="GFX_button_221x34"
        text="RQ_B_MODE"
        font="hoi_18mbs"
        shortcut="q"
        tooltip="RQ_B_MODE_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.run(modeToggle);
        }}
      />
    </ui.Container>
  ),
);
export const totalQueued = ScriptedWindow(
  {
    name: "rq_tq_gui",
    path: "interface/rq_queue.gui",
    context: "player_context",
    parentWindowName: "rq_tq_host",
    dirty: "rq_dirty",
    visible: (c) => !c.isAI && c.triggers.has_country_flag("rq_active"),
  },
  (ui) => (
    <ui.Container name="rq_tq_window" position={{ x: 0, y: 0 }} size={{ width: 156, height: 28 }}>
      <ui.Text
        name="rq_tq_text"
        position={{ x: 0, y: 4 }}
        text="RQ_TQ_TEXT"
        font="hoi_16mbs"
        maxWidth={92}
        maxHeight={20}
        tooltip="RQ_TQ_TT"
      />
      <ui.Icon name="rq_tq_icon" position={{ x: 86, y: 1 }} spriteType="GFX_rq_q_icon" />
      <ui.Text
        name="rq_tq_value"
        position={{ x: 122, y: 4 }}
        text="RQ_TQ_VALUE"
        font="hoi_16mbs"
        maxWidth={32}
        maxHeight={20}
      />
    </ui.Container>
  ),
);
export const clearDialog = ScriptedWindow(
  {
    name: "rq_clr_gui",
    path: "interface/rq_queue.gui",
    context: "player_context",
    parentWindowName: "countrytechnologyview",
    dirty: "rq_dirty",
    visible: (c) =>
      c.triggers.has_country_flag("rq_active") &&
      c.triggers.has_country_flag("rq_q_open") &&
      c.variable("rq_clr") === 1,
  },
  (ui) => (
    <ui.Container
      name="rq_clr_window"
      position={{ x: 974, y: 60 }}
      size={{ width: 360, height: 150 }}
    >
      <ui.Icon name="rq_clr_bg" position={{ x: 0, y: 0 }} spriteType="GFX_rq_clr_bg" />
      <ui.Text
        name="rq_clr_q"
        position={{ x: 20, y: 20 }}
        text="RQ_CLR_Q"
        font="hoi_18mbs"
        maxWidth={320}
        maxHeight={70}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_clr_yes"
        position={{ x: 20, y: 96 }}
        spriteType="GFX_button_148x34"
        text="RQ_CLR_YES"
        font="hoi_18mbs"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setVariable("rq_clr", 0);
          c.run(clearAll);
        }}
      />
      <ui.Button
        clickSound="click_default"
        name="rq_clr_no"
        position={{ x: 192, y: 96 }}
        spriteType="GFX_button_148x34"
        text="RQ_CLR_NO"
        font="hoi_18mbs"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setVariable("rq_clr", 0);
        }}
      />
    </ui.Container>
  ),
);
