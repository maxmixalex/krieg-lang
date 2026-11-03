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
      className={[styles.bodyText, styles.status]}
      position={{ x: 18, y: props.y }}
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
export const panel = ScriptedWindow(
  {
    name: "srd_assembly_panel",
    path: "interface/srd_assembly.gui",
    context: "player_context",
    parentWindowToken: "politics_tab",
    dirty: "srd_gui_dirty",
    visible: (country) => country.triggers.tag(countries.KRL),
  },
  (ui) => (
    <ui.Container name="srd_assembly_window" className={styles.panel}>
      <ui.Icon name="background" className={styles.background} />
      <ui.Text
        name="title"
        className={[styles.bodyText, styles.title]}
        text={messages["srd_gui_title"]}
      />
      <StatusLine text={messages["srd_gui_status"]} y={54} />
      <ui.Button
        name="redeem"
        className={styles.redeem}
        text="srd_gui_redeem"
        tooltip="srd_gui_redeem_tt"
        click={(country) => country.run(redeemBond.execute)}
        enabled={(country) => country.test(redeemBond.available)}
      />
    </ui.Container>
  ),
);
