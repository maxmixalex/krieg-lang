import { ScriptedWindow, SpriteFile, Sprite, Text, type GuiElement } from "krieg-lang/ui";
import { countries } from "@project/countries";
import { assets } from "@project/assets";
import { messages } from "@project/localisation";
import { redeemBond } from "./programme.krg.ts";
import styles from "./interface.krg.css";

function StatusLine(props: { text: string; y: number }): GuiElement {
  return (
    <Text
      name="programme_status"
      className={styles.status}
      position={{ x: 18, y: props.y }}
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
    <ui.Container name="civ_assembly_window" className={styles.panel}>
      <ui.Icon name="background" className={styles.background} />
      <ui.Text name="title" className={styles.title} text={messages["civ_gui_title"]} />
      <StatusLine text={messages["civ_gui_status"]} y={54} />
      <ui.Button
        name="redeem"
        className={styles.redeem}
        text="civ_gui_redeem"
        tooltip="civ_gui_redeem_tt"
        action={redeemBond}
      />
    </ui.Container>
  ),
);
