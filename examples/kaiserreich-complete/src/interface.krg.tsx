import { ScriptedGui, type CountryScope } from "krieg-lang/hoi4";
import {
  GuiFile,
  SpriteFile,
  Sprite,
  Container,
  Icon,
  Button,
  Text,
  type GuiElement,
} from "krieg-lang/ui";
import { countries } from "@project/countries";
import { assets } from "@project/assets";
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
export const sprites = SpriteFile("interface/srd_sprites.gfx", [
  Sprite({ name: "GFX_srd_panel", textureFile: assets["gfx/interface/srd_panel.tga"] }),
  Sprite({ name: "GFX_srd_button", textureFile: assets["gfx/interface/srd_button.tga"] }),
  Sprite({ name: "GFX_srd_focus", textureFile: assets["gfx/interface/srd_icon.tga"] }),
  Sprite({ name: "GFX_idea_srd_civic_spirit", textureFile: assets["gfx/interface/srd_icon.tga"] }),
  Sprite({
    name: "GFX_decision_category_srd_assembly",
    textureFile: assets["gfx/interface/srd_icon.tga"],
  }),
  Sprite({ name: "GFX_srd_leader", textureFile: assets["gfx/leaders/KRL/srd_leader.tga"] }),
]);
export const panel = GuiFile(
  "interface/srd_assembly.gui",
  <Container
    name="srd_assembly_window"
    position={{ x: 15, y: 80 }}
    size={{ width: 350, height: 190 }}
  >
    <Icon name="background" spriteType="GFX_srd_panel" />
    <Text
      name="title"
      position={{ x: 18, y: 14 }}
      maxWidth={300}
      maxHeight={26}
      font="hoi_18mbs"
      text="srd_gui_title"
    />
    <StatusLine text="srd_gui_status" y={54} />
    <Button
      name="redeem"
      position={{ x: 18, y: 118 }}
      size={{ width: 150, height: 32 }}
      spriteType="GFX_srd_button"
      font="hoi_16mbs"
      text="srd_gui_redeem"
      tooltip="srd_gui_redeem_tt"
    />
  </Container>,
);
export const scriptedPanel = ScriptedGui({
  name: "srd_assembly_panel",
  windowName: "srd_assembly_window",
  context: "player_context",
  parentWindowToken: "politics_tab",
  dirty: "srd_gui_dirty",
  visible: (country: CountryScope) => country.triggers.tag(countries.KRL),
  effects: {
    redeem_click: (country: CountryScope) => {
      country.run(executeBond);
      country.effects.clearCountryFlag("srd_bonds_unlocked");
    },
  },
  triggers: {
    redeem_click_enabled: (country: CountryScope) =>
      country.triggers.hasCountryFlag("srd_bonds_unlocked"),
  },
});
