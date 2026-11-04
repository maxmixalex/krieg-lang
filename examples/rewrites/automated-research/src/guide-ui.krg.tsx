import { ScriptedWindow } from "krieg-lang/ui";
const pages = [
  { x: 346, y: 80, body: 80 },
  { x: 28, y: 119, body: 346 },
  { x: 258, y: 116, body: 350 },
  { x: 104, y: 116, body: 350 },
  { x: 144, y: 116, body: 350 },
  { x: 149, y: 116, body: 350 },
  { x: 141, y: 116, body: 350 },
  { x: 136, y: 121, body: 344 },
  { x: 259, y: 116, body: 350 },
  { x: 28, y: 120, body: 345 },
  { x: 198, y: 178, body: 288 },
  { x: 198, y: 178, body: 288 },
  { x: 198, y: 178, body: 288 },
  { x: 346, y: 224, body: 116 },
] as const;
export const guide = ScriptedWindow(
  {
    name: "rq_guide_gui",
    path: "interface/rq_guide.gui",
    context: "player_context",
    dirty: "rq_dirty",
    visible: (c) => !c.isAI && c.triggers.has_country_flag("rq_guide"),
  },
  (ui) => (
    <ui.Container
      name="rq_guide_window"
      position={{ x: -500, y: -406 }}
      size={{ width: 1000, height: 812 }}
      orientation="CENTER"
      moveable
      clipping={false}
      background={{ name: "Background", spriteType: "GFX_tiled_window_transparent" }}
    >
      <ui.Icon
        name="rq_g_bg"
        position={{ x: 0, y: 0 }}
        spriteType="GFX_rq_g_bg"
        alwaysTransparent
      />
      <ui.Text
        name="rq_g_head"
        position={{ x: 80, y: 6 }}
        text="RQ_G_HEAD"
        font="hoi_36header"
        maxWidth={840}
        maxHeight={40}
        format="center"
      />
      <ui.Button
        clickSound="click_default"
        name="rq_g_x"
        position={{ x: 954, y: 8 }}
        spriteType="GFX_closebutton"
        tooltip="RQ_G_CLOSE_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.effects.clr_country_flag("rq_guide");
        }}
      />
      {pages.map((page, i) => [
        <ui.Button
          clickSound="click_default"
          name={"rq_g_t" + i}
          position={{ x: 704, y: 74 + i * 46 }}
          spriteType="GFX_rq_g_tab"
          visible={(c) => c.variable("rq_gtab") !== i}
          click={(c) => {
            c.addVariable("rq_dirty", 1);
            c.setVariable("rq_gtab", i);
          }}
        />,
        <ui.Button
          clickSound="click_default"
          name={"rq_g_ton" + i}
          position={{ x: 704, y: 74 + i * 46 }}
          spriteType="GFX_rq_g_tabon"
          visible={(c) => c.variable("rq_gtab") === i}
        />,
        <ui.Text
          name={"rq_g_tl" + i}
          position={{ x: 718, y: 85 + i * 46 }}
          text={"RQ_G_TAB" + i}
          font="hoi_18mbs"
          maxWidth={240}
          maxHeight={22}
          alwaysTransparent
        />,
        i > 0 && (
          <ui.Text
            name={"rq_g_title" + i}
            position={{ x: 28, y: 74 }}
            text={"RQ_G_T" + i}
            font="hoi_24header"
            maxWidth={640}
            maxHeight={32}
            visible={(c) => c.variable("rq_gtab") === i}
          />
        ),
        <ui.Icon
          name={"rq_g_img" + i}
          position={{ x: page.x, y: page.y }}
          spriteType={"GFX_rq_g_img" + i}
          alwaysTransparent
          visible={(c) => c.variable("rq_gtab") === i}
        />,
        <ui.Text
          name={"rq_g_body" + i}
          position={{ x: 28, y: page.body }}
          text={"RQ_G_B" + i}
          font="hoi_16mbs"
          maxWidth={640}
          maxHeight={738 - page.body}
          visible={(c) => c.variable("rq_gtab") === i}
        />,
      ])}
      {[
        {
          name: "cge",
          key: "CGE",
          x: 180,
          link: "https://steamcommunity.com/workshop/filedetails/?id=3798594347",
        },
        { name: "discord", key: "DISCORD", x: 388, link: "https://discord.gg/cBY7afWrBA" },
      ].map((link) => [
        <ui.Button
          clickSound="click_default"
          name={"rq_g_link_" + link.name}
          position={{ x: link.x, y: 300 }}
          spriteType={"GFX_rq_link_" + link.name}
          tooltip={"RQ_G_LINK_" + link.key + "_TT"}
          webLink={link.link}
          visible={(c) => c.variable("rq_gtab") === 13}
        />,
        <ui.Text
          name={"rq_g_linkl_" + link.name}
          position={{ x: link.x - 40, y: 436 }}
          text={"RQ_G_LINK_" + link.key}
          font="hoi_18mbs"
          maxWidth={208}
          maxHeight={44}
          format="center"
          alwaysTransparent
          visible={(c) => c.variable("rq_gtab") === 13}
        />,
      ])}
      <ui.Button
        clickSound="click_default"
        name="rq_g_close"
        position={{ x: 237, y: 752 }}
        spriteType="GFX_button_221x34"
        text="RQ_G_CLOSE"
        font="hoi_16mbs"
        tooltip="RQ_G_CLOSE_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.effects.clr_country_flag("rq_guide");
        }}
      />
    </ui.Container>
  ),
);
export const helpButton = ScriptedWindow(
  {
    name: "rq_ghelp_gui",
    path: "interface/rq_guide.gui",
    context: "player_context",
    parentWindowName: "countrytechnologyview",
    dirty: "rq_dirty",
    visible: (c) => !c.isAI,
  },
  (ui) => (
    <ui.Container
      name="rq_ghelp_window"
      position={{ x: 16, y: 14 }}
      size={{ width: 32, height: 32 }}
    >
      <ui.Button
        clickSound="click_default"
        name="rq_g_help"
        position={{ x: 0, y: 0 }}
        spriteType="GFX_help_button"
        tooltip="RQ_G_HELP_TT"
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          if (c.triggers.has_country_flag("rq_guide")) c.effects.clr_country_flag("rq_guide");
          else {
            c.effects.setCountryFlag("rq_guide");
            c.setVariable("rq_gtab", 0);
          }
        }}
      />
    </ui.Container>
  ),
);
export const emptyQueueAlerts = [false, true].map((extended) =>
  ScriptedWindow(
    {
      name: extended ? "rq_alert_ext_gui" : "rq_alert_gui",
      path: "interface/rq_guide.gui",
      context: "player_context",
      dirty: "rq_dirty",
      visible: (c) =>
        !c.isAI &&
        c.triggers.has_country_flag("rq_active") &&
        c.arrayLength("rq_queue") < 1 &&
        !c.triggers.has_country_flag("rq_alert_off") &&
        (extended ? c.triggers.has_dlc("La Resistance") : !c.triggers.has_dlc("La Resistance")),
    },
    (ui) => (
      <ui.Container
        name={extended ? "rq_alert_ext_window" : "rq_alert_window"}
        position={{ x: extended ? 678 : 622, y: 37 }}
        size={{ width: 43, height: 38 }}
      >
        <ui.Button
          clickSound="click_default"
          name="rq_alert_btn"
          position={{ x: 0, y: 0 }}
          spriteType="GFX_rq_alert"
          tooltip="RQ_ALERT_TT"
          events={{
            rightClick: (c) => {
              c.addVariable("rq_dirty", 1);
              c.effects.setCountryFlag("rq_alert_off");
            },
          }}
        />
        <ui.Icon
          name="rq_alert_glow"
          position={{ x: 0, y: 0 }}
          spriteType="GFX_yellow_alert_glow"
          alwaysTransparent
        />
      </ui.Container>
    ),
  ),
);
