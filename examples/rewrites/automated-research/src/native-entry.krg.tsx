import { GuiFile, Container, Icon, Button, Text, GridBox } from "krieg-lang/ui";
// Engine-owned names are retained so the vanilla research and facility handlers
// continue to populate these templates. Only rq_* hosts belong to our scripts.
export const researchEntry = GuiFile("interface/countrytechnologyview.gui", [
  <Container
    name="technology_idea_entry"
    position={{ x: 0, y: 0 }}
    size={{ width: 64, height: 64 }}
    background={{ name: "Background", spriteType: "GFX_tech_idea_bg" }}
  >
    <Icon
      name="idea_traits"
      position={{ x: 43, y: 46 }}
      spriteType="GFX_idea_traits_strip"
      centerPosition
      frame={1}
    />
  </Container>,
  <positionType name="technology_sharing_offset" position={{ x: 100, y: 0 }} />,
  <positionType name="technology_sharing_faction_offset" position={{ x: 75, y: -5 }} />,
  <Container
    name="technology_sharing_entry"
    position={{ x: 0, y: 0 }}
    size={{ width: 64, height: 64 }}
    background={{ name: "Background", spriteType: "GFX_commonwealth_research" }}
  />,
  <Container
    name="countrytechnologyview"
    position={{ x: -606, y: 78 }}
    showPosition={{ x: -6, y: 78 }}
    showAnimationType="decelerated"
    hideAnimationType="accelerated"
    animationTime={300}
    size={{ width: 550, height: "100%%" }}
    margin={{ bottom: -5 }}
    showSound="menu_open_window"
    background={{ name: "Background", spriteType: "GFX_tiled_plain_bg" }}
  >
    <Container
      name="rq_q_frame"
      position={{ x: 538, y: 0 }}
      size={{ width: 430, height: "100%%" }}
      clipping
    />
    <Container
      name="rq_dlg_host"
      position={{ x: 0, y: 0 }}
      size={{ width: 7680, height: 4320 }}
      clipping={false}
    />
    <Icon name="production_header_bg" position={{ x: 5, y: 7 }} spriteType="GFX_header_bg" />
    <Text
      name="research_title"
      position={{ x: 5, y: 8 }}
      text="RESEARCH_RESEARCH"
      font="hoi_36header"
      maxWidth={543}
      maxHeight={40}
      format="center"
    />
    <Container name="tabs" position={{ x: 0, y: 44 }} size={{ width: "100%%", height: 30 }}>
      <Button
        name="research_slots_tab"
        position={{ x: -250, y: -15 }}
        orientation="CENTER"
        spriteType="GFX_tab_large"
        text="RESEARCH_TAB_SLOTS"
        font="hoi_18mbs"
        frame={1}
      />
      <Button
        name="facilities_tab"
        position={{ x: 0, y: -15 }}
        orientation="CENTER"
        spriteType="GFX_tab_large"
        text="RESEARCH_TAB_FACILITIES"
        font="hoi_18mbs"
        frame={2}
      />
    </Container>
    <Container
      name="research_slots"
      position={{ x: 0, y: 80 }}
      size={{ width: 550, height: -5 }}
      background={{ name: "Background", spriteType: "GFX_tiled_window2_1b_border" }}
    >
      <Container
        name="overlay"
        position={{ x: 0, y: 0 }}
        size={{ width: "100%%", height: "100%%" }}
        background={{ name: "Background", spriteType: "GFX_tiled_generic_overlay_bg1" }}
      />
      <Container
        name="slots_window"
        position={{ x: 0, y: 140 }}
        size={{ width: 550, height: -1 }}
        verticalScrollbar="right_vertical_slider"
        scrollWheelFactor={40}
        smoothScrolling
        background={{ name: "Background", spriteType: "GFX_tiled_window_transparent" }}
      >
        <GridBox
          name="research_slots_grid"
          position={{ x: 15, y: 0 }}
          size={{ width: -20, height: "100%%" }}
          slotsize={{ width: 500, height: 100 }}
          format="UPPER_LEFT"
          maxSlotsHorizontal={1}
        />
      </Container>
      <Container
        name="research_win_top"
        position={{ x: 1, y: 0 }}
        size={{ width: "100%", height: "80%" }}
        background={{ name: "Background", spriteType: "GFX_rq_research_top_win" }}
      >
        <Container
          name="rq_tq_host"
          position={{ x: 190, y: 107 }}
          size={{ width: 156, height: 28 }}
        />
        <Icon
          name="focus_bonuses"
          position={{ x: 119, y: 108 }}
          spriteType="GFX_focus_bonuses_icon"
        />
        <Text
          name="limited_research_bonus_text"
          position={{ x: 16, y: 111 }}
          text="LIMITED_RESEARCH_BONUS"
          font="hoi_16mbs"
          maxWidth={112}
          maxHeight={20}
        />
        <Text
          name="limited_research_bonus_value"
          position={{ x: 155, y: 111 }}
          text=""
          font="hoi_16mbs"
          maxWidth={30}
          maxHeight={20}
        />
        <Icon
          name="research_speed_icon"
          position={{ x: 447, y: 108 }}
          spriteType="GFX_research_speed_icon"
        />
        <Text
          name="research_speed_text"
          position={{ x: 350, y: 111 }}
          text="RESEARCH_SPEED"
          font="hoi_16mbs"
          maxWidth={106}
          maxHeight={20}
        />
        <Text
          name="research_speed_value"
          position={{ x: 481, y: 111 }}
          text=""
          font="hoi_16mbs"
          maxWidth={48}
          maxHeight={20}
        />
        <GridBox
          name="research_groups_grid"
          position={{ x: 325, y: 5 }}
          size={{ width: 192, height: 128 }}
          slotsize={{ width: 64, height: 64 }}
          format="RIGHT"
          maxSlotsHorizontal={1}
          maxSlotsVertical={8}
        />
      </Container>
    </Container>
    <Container name="facilities" position={{ x: 0, y: 80 }} size={{ width: 550, height: -5 }} />
    <Container
      name="research_win_bottom"
      position={{ x: 1, y: 0 }}
      size={{ width: 546, height: 20 }}
      orientation="LOWER_LEFT"
      background={{ name: "Background", spriteType: "GFX_production_win_bottom" }}
    />
    <Button
      name="close_button"
      position={{ x: -43, y: 9 }}
      orientation="UPPER_RIGHT"
      spriteType="GFX_closebutton"
      shortcut="ESCAPE"
      tooltip="CLOSE"
      clickSound="click_close"
    />
  </Container>,
  <Container
    name="research_slot_entry"
    position={{ x: 0, y: 0 }}
    size={{ width: 500, height: 100 }}
    background={{ name: "Background", spriteType: "GFX_research_line_bg" }}
  >
    <Icon name="empty_research_slot_glow" position={{ x: 12, y: 10 }} spriteType="GFX_rq_none" />
    <Icon
      name="technology"
      position={{ x: 252, y: 49 }}
      spriteType="GFX_research_folder_strip"
      centerPosition
      alwaysTransparent
    />
    <Icon
      name="designer"
      position={{ x: 450, y: 49 }}
      spriteType="GFX_research_folder_strip"
      centerPosition
      alwaysTransparent
    />
    <Icon
      name="equipment"
      position={{ x: 328, y: 27 }}
      spriteType="GFX_land_equipment_role_icons"
      frame={1}
    />
    <Icon
      name="carrier_fighter"
      position={{ x: 349, y: 31 }}
      spriteType="GFX_airwing_carrier_icon"
    />
    <Text
      name="title"
      position={{ x: 57, y: 12 }}
      text=""
      font="hoi_18mbs"
      maxWidth={400}
      maxHeight={30}
    />
    <Text
      name="year"
      position={{ x: 57, y: 60 }}
      text=""
      font="hoi_18mbs"
      maxWidth={50}
      maxHeight={22}
    />
    <Text
      name="eta"
      position={{ x: 335, y: 12 }}
      text=""
      font="hoi_18mbs"
      maxWidth={125}
      maxHeight={22}
      format="right"
    />
    <Icon
      name="research_progressbar_frame_icon"
      position={{ x: 62, y: 79 }}
      spriteType="GFX_research_progressbar_frame"
    />
    <Icon
      name="research_progressbar"
      position={{ x: 65, y: 81 }}
      spriteType="Gfx_research_progressbar"
    />
  </Container>,
]);
export const alerts = GuiFile("interface/alerts.gui", [
  <Container
    name="global_alerticon_window"
    position={{ x: 0, y: 0 }}
    size={{ width: 43, height: 38 }}
  >
    <Button
      name="icon"
      spriteType="GFX_global_alert_icons"
      position={{ x: 0, y: 0 }}
      overSound="ui_menu_over"
    />
    <Icon
      name="red_alert_glow"
      spriteType="GFX_red_alert_glow"
      position={{ x: 0, y: 0 }}
      alwaysTransparent
    />
    <Icon
      name="yellow_alert_glow"
      spriteType="GFX_yellow_alert_glow"
      position={{ x: 0, y: 0 }}
      alwaysTransparent
    />
  </Container>,
  <positionType name="alerticon_startposition" position={{ x: 674, y: 38 }} />,
  <positionType name="alerticon_startposition_extended" position={{ x: 730, y: 38 }} />,
  <positionType name="alerticon_offset" position={{ x: 48, y: 44 }} />,
  <positionType name="alerticon_endposition" position={{ x: 315, y: 0 }} />,
  <Container
    name="global_diplorequesticon_window"
    position={{ x: 0, y: 0 }}
    size={{ width: 43, height: 38 }}
  >
    <Button
      name="icon"
      spriteType="GFX_global_diplorequest_icons"
      position={{ x: 0, y: 0 }}
      overSound="ui_menu_over"
    />
    <Icon name="country_flag" spriteType="GFX_flag_smallest" position={{ x: 12, y: 28 }} />
  </Container>,
]);
