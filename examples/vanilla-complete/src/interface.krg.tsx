import { ScriptedWindow, SpriteFile, Sprite, Text, type GuiElement } from "krieg-lang/ui";
import { countries } from "@project/countries";
import { assets } from "@project/assets";
import { messages } from "@project/localisation";
import { executeBond } from "./programme.krg.ts";

function StatusLine(props: { text: string; y: number }): GuiElement {
  return (
    <Text
      name="programme_status"
      position={{ x: 18, y: props.y }}
      maxWidth={300}
      maxHeight={50}
      font="hoi_16mbs"
      text={props.text}
    />
  );
}
export const sprites = SpriteFile("interface/civ_sprites.gfx", [
  Sprite({ name: "GFX_civ_panel", textureFile: assets["gfx/interface/civ_panel.tga"] }),
  Sprite({ name: "GFX_civ_button", textureFile: assets["gfx/interface/civ_button.tga"] }),
  Sprite({ name: "GFX_civ_focus", textureFile: assets["gfx/interface/civ_icon.tga"] }),
  Sprite({ name: "GFX_idea_civ_civic_spirit", textureFile: assets["gfx/interface/civ_icon.tga"] }),
  Sprite({
    name: "GFX_decision_category_civ_assembly",
    textureFile: assets["gfx/interface/civ_icon.tga"],
  }),
  Sprite({ name: "GFX_civ_leader", textureFile: assets["gfx/leaders/KRG/civ_leader.tga"] }),
]);
export const panel = ScriptedWindow(
  {
    name: "civ_assembly_panel",
    path: "interface/civ_assembly.gui",
    context: "player_context",
    parentWindowToken: "politics_tab",
    dirty: "civ_gui_dirty",
    visible: (country) => country.triggers.tag(countries.KRG),
  },
  (ui) => (
    <ui.Container
      name="civ_assembly_window"
      position={{ x: 15, y: 80 }}
      size={{ width: 350, height: 190 }}
    >
      <ui.Icon name="background" spriteType="GFX_civ_panel" />
      <ui.Text
        name="title"
        position={{ x: 18, y: 14 }}
        maxWidth={300}
        maxHeight={26}
        font="hoi_18mbs"
        text={messages["civ_gui_title"]}
      />
      <StatusLine text={messages["civ_gui_status"]} y={54} />
      <ui.Button
        name="redeem"
        position={{ x: 18, y: 118 }}
        size={{ width: 150, height: 32 }}
        spriteType="GFX_civ_button"
        font="hoi_16mbs"
        text="civ_gui_redeem"
        tooltip="civ_gui_redeem_tt"
        click={(country) => {
          country.run(executeBond);
          country.effects.clearCountryFlag("civ_bonds_unlocked");
        }}
        enabled={(country) => country.triggers.hasCountryFlag("civ_bonds_unlocked")}
      />
    </ui.Container>
  ),
);
