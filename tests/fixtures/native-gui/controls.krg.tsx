import {
  GuiFile,
  NativeContainer,
  DropDownBox,
  NativeButton,
  OverlappingElementsBox,
  NativeGridBox,
  NativeListBox,
  SmoothListBox,
  NativeIcon,
  Position,
  Browser,
  NativeText,
  EditBox,
  Checkbox,
  Scrollbar,
  ExtendedScrollbar,
} from "krieg-lang/ui";

// Original fixtures exercise every CWT-declared native control through static TSX.
// Their sprite is an original one-pixel audit asset, shared with domain fixtures.
GuiFile(
  "interface/audit_containerWindowType.gui",
  <NativeContainer
    name="krg_gui_container"
    position={{ x: 10, y: 10 }}
    size={{ width: 240, height: 160 }}
    orientation="UPPER_LEFT"
    clipping
  >
    <NativeText name="krg_gui_container_label" text="KRG_AUDIT" position={{ x: 8, y: 8 }} />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_dropDownBoxType.gui",
  <NativeContainer name="krg_audit_host_dropDownBoxType" size={{ width: 240, height: 180 }}>
    <DropDownBox
      name="krg_gui_dropdown"
      position={{ x: 10, y: 10 }}
      size={{ width: 160, height: 32 }}
      expandedOnTop
      switchFrameOnExpand
    >
      <NativeText name="krg_gui_dropdown_label" text="KRG_AUDIT" />
    </DropDownBox>
  </NativeContainer>,
);
GuiFile(
  "interface/audit_buttonType.gui",
  <NativeContainer name="krg_audit_host_buttonType" size={{ width: 240, height: 180 }}>
    <NativeButton
      name="krg_gui_button"
      spriteType="GFX_krieg_audit"
      size={{ x: 120, y: 32 }}
      position={{ x: 10, y: 10 }}
      buttonText="KRG_AUDIT"
    />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_OverlappingElementsBoxType.gui",
  <NativeContainer
    name="krg_audit_host_OverlappingElementsBoxType"
    size={{ width: 240, height: 180 }}
  >
    <OverlappingElementsBox
      name="krg_gui_overlap"
      position={{ x: 10, y: 10 }}
      size={{ width: 180, height: 32 }}
      spacing={5}
      format="left"
      firstOnTop
    />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_gridBoxType.gui",
  <NativeContainer name="krg_audit_host_gridBoxType" size={{ width: 240, height: 180 }}>
    <NativeGridBox
      name="krg_gui_grid"
      position={{ x: 10, y: 10 }}
      size={{ width: 180, height: 120 }}
      slotsize={{ width: 60, height: 40 }}
      addHorizontal
      maxSlotsHorizontal={3}
      maxSlotsVertical={3}
    />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_listBoxType.gui",
  <NativeContainer name="krg_audit_host_listBoxType" size={{ width: 240, height: 180 }}>
    <NativeListBox
      name="krg_gui_list"
      position={{ x: 10, y: 10 }}
      size={{ width: 180, height: 120 }}
      spacing={4}
      horizontal={0}
    />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_smoothListBoxType.gui",
  <NativeContainer name="krg_audit_host_smoothListBoxType" size={{ width: 240, height: 180 }}>
    <SmoothListBox
      name="krg_gui_smooth"
      position={{ x: 10, y: 10 }}
      size={{ width: 180, height: 120 }}
      spacing={4}
      horizontal={0}
      clipping
      priority={1}
    />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_iconType.gui",
  <NativeContainer name="krg_audit_host_iconType" size={{ width: 240, height: 180 }}>
    <NativeIcon
      name="krg_gui_icon"
      spriteType="GFX_krieg_audit"
      position={{ x: 10, y: 10 }}
      size={{ width: 32, height: 32 }}
      frame={1}
      alwaystransparent
    />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_positionType.gui",
  <NativeContainer name="krg_audit_host_positionType" size={{ width: 240, height: 180 }}>
    <Position name="krg_gui_anchor" position={{ x: 10, y: 10 }} scale={1} />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_browserType.gui",
  <NativeContainer name="krg_audit_host_browserType" size={{ width: 240, height: 180 }}>
    <Browser
      name="krg_gui_browser"
      spriteType="GFX_krieg_audit"
      position={{ x: 10, y: 10 }}
      size={{ x: 180, y: 120 }}
    />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_instantTextBoxType.gui",
  <NativeContainer name="krg_audit_host_instantTextBoxType" size={{ width: 240, height: 180 }}>
    <NativeText
      name="krg_gui_text"
      text="KRG_AUDIT"
      position={{ x: 10, y: 10 }}
      maxWidth={180}
      maxHeight={60}
      format={["left"]}
      multiline
    />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_editBoxType.gui",
  <NativeContainer name="krg_audit_host_editBoxType" size={{ width: 240, height: 180 }}>
    <EditBox
      name="krg_gui_edit"
      text="KRG_AUDIT"
      position={{ x: 10, y: 10 }}
      maxWidth={180}
      maxHeight={32}
      onlyNumbers={false}
      useSpecialChars
    />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_checkboxType.gui",
  <NativeContainer name="krg_audit_host_checkboxType" size={{ width: 240, height: 180 }}>
    <Checkbox
      name="krg_gui_checkbox"
      spriteType="GFX_krieg_audit"
      position={{ x: 10, y: 10 }}
      size={{ width: 24, height: 24 }}
      buttonText="KRG_AUDIT"
    />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_scrollbarType.gui",
  <NativeContainer name="krg_audit_host_scrollbarType" size={{ width: 240, height: 180 }}>
    <Scrollbar
      name="krg_gui_scrollbar"
      slider="krg_gui_slider"
      track="krg_gui_track"
      leftbutton="krg_gui_left"
      rightbutton="krg_gui_right"
      position={{ x: 10, y: 10 }}
      size={{ x: 180, y: 24 }}
      priority={1}
      borderSize={{ x: 0, y: 0 }}
      minValue={0}
      maxValue={100}
      startValue={0}
      stepSize={1}
      horizontal={1}
      guiButtonType={[
        { name: "krg_gui_slider", quadTextureSprite: "GFX_krieg_audit", position: { x: 0, y: 0 } },
        { name: "krg_gui_track", quadTextureSprite: "GFX_krieg_audit", position: { x: 0, y: 0 } },
        { name: "krg_gui_left", quadTextureSprite: "GFX_krieg_audit", position: { x: 0, y: 0 } },
        { name: "krg_gui_right", quadTextureSprite: "GFX_krieg_audit", position: { x: 160, y: 0 } },
      ]}
    />
  </NativeContainer>,
);
GuiFile(
  "interface/audit_extendedScrollbarType.gui",
  <NativeContainer name="krg_audit_host_extendedScrollbarType" size={{ width: 240, height: 180 }}>
    <ExtendedScrollbar
      name="krg_gui_extended"
      position={{ x: 10, y: 10 }}
      size={{ width: 180, height: 24 }}
      horizontal
      minValue={0}
      maxValue={100}
      startValue={0}
      stepSize={1}
      slider={{
        name: "krg_gui_extended_slider",
        spriteType: "GFX_krieg_audit",
        position: { x: 0, y: 0 },
      }}
      track={{
        name: "krg_gui_extended_track",
        spriteType: "GFX_krieg_audit",
        position: { x: 0, y: 0 },
      }}
      increaseButton={{
        name: "krg_gui_extended_increase",
        spriteType: "GFX_krieg_audit",
        position: { x: 160, y: 0 },
      }}
      decreaseButton={{
        name: "krg_gui_extended_decrease",
        spriteType: "GFX_krieg_audit",
        position: { x: 0, y: 0 },
      }}
    />
  </NativeContainer>,
);
