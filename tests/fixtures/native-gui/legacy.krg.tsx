import { GuiFile, Window, TextBox, GuiButton } from "krieg-lang/ui";

// Original examples of legacy control kinds observed in the supplied game GUI.
// Current upstream CWTools has no rules for these kinds; these are structural fixtures.
GuiFile(
  "interface/audit_legacy.gui",
  <Window
    name="krg_legacy_window"
    backGround=""
    position={{ x: 10, y: 10 }}
    size={{ x: 320, y: 180 }}
    moveable={0}
    dontRender=""
    horizontalBorder=""
    verticalBorder=""
    fullscreen={false}
    orientation="UPPER_LEFT"
    showPosition={{ x: 10, y: 10 }}
    hidePosition={{ x: 10, y: -180 }}
    animationTime={0.2}
  >
    <TextBox
      name="krg_legacy_text"
      position={{ x: 10, y: 10 }}
      textureFile="gfx/interface/krieg_audit.dds"
      borderSize={{ x: 1, y: 1 }}
      font="hoi_16mbs"
      text="KRG_AUDIT"
      maxWidth={240}
      maxHeight={40}
    />
    <GuiButton
      name="krg_legacy_button"
      quadTextureSprite="GFX_krieg_audit"
      position={{ x: 10, y: 60 }}
      clicksound="click"
      orientation="UPPER_LEFT"
      buttonText="KRG_AUDIT"
      buttonFont="hoi_16mbs"
      size={{ x: 140, y: 32 }}
      noClicksound={false}
      parent="krg_legacy_window"
      hintTag="krg_legacy_hint"
      format="left"
      shortcut="K"
      frame={1}
      scale={1}
      alwaystransparent={false}
      pdxTooltip="KRG_AUDIT"
      oversound="click"
      pdxTooltipDelayed="KRG_AUDIT"
    />
  </Window>,
);
