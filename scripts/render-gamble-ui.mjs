// Native-state projections for visual inspection; this does not impersonate game screenshots.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
import {
  loadGamble,
  GambleNativeMachine,
  properties,
  fields,
  atom,
} from "../tests/support/gamble-native-machine.mjs";
const originalRoot = resolve(process.argv[2] ?? "../private-mods/Hearts-of-Gamble");
const project = resolve("examples/rewrites/hearts-of-gamble"),
  output = join(project, "build/ui-projections");
mkdirSync(output, { recursive: true });
const original = loadGamble(originalRoot),
  rewritten = loadGamble(join(project, "build/mod"));
const scenes = [
  {
    id: "blackjack-active",
    gui: "blackjack_ui",
    window: "blackjack_ui_window",
    flags: [
      "card_AH_1_slot_player",
      "card_6S_2_slot_player",
      "card_5H_1_slot_dealer",
      "card_dealer_covered",
      "normal_blackjack_game",
    ],
    vars: { blackjack_player: 17, blackjack_dealer: 5 },
    ideas: ["blackjack_on", "bet_pp_bj_idea"],
  },
  {
    id: "blackjack-bust",
    gui: "blackjack_ui",
    window: "blackjack_ui_window",
    flags: [
      "card_KH_1_slot_player",
      "card_7S_2_slot_player",
      "card_8D_3_slot_player",
      "card_slot_3",
      "card_5H_1_slot_dealer",
      "card_dealer_covered",
    ],
    vars: { blackjack_player: 25, blackjack_dealer: 5 },
    ideas: ["blackjack_on", "bet_pp_bj_idea"],
  },
  {
    id: "highlow-payout",
    gui: "highlow_ui",
    window: "highlow_ui_window",
    flags: [
      "hl_card_6H_slot1",
      "hl_card_KS_slot2",
      "hl_card_3D_slot3",
      "checking_fourth_card",
      "hl_game_started",
      "payout_4",
    ],
    vars: { multiplier: 4 },
    ideas: ["highlow_on", "hl_bet_pp_idea", "hl_bet_guns_idea"],
  },
  {
    id: "cups-choose",
    gui: "cups_ball_ui",
    window: "cups_ball_ui_window",
    flags: [
      "cups_dealer2",
      "cups_difficulty_medium",
      "difficulty_has_been_chosen",
      "hide_the_ball",
      "player_chooses_a_cup",
      "cant_change_options",
    ],
    vars: {},
    ideas: ["cups_ball_on", "cups_bet_pp_idea"],
  },
  {
    id: "cups-reveal",
    gui: "cups_ball_ui",
    window: "cups_ball_ui_window",
    flags: [
      "cups_dealer2",
      "cups_difficulty_medium",
      "difficulty_has_been_chosen",
      "hide_the_ball",
      "hide_the_cloud",
      "cups_results2",
      "player_picked_cup_5",
      "cant_change_options",
    ],
    vars: {},
    ideas: ["cups_ball_on", "cups_bet_pp_idea"],
  },
  {
    id: "roulette-zero",
    gui: "gambling_ui",
    window: "gambling_ui_window",
    flags: ["number_0_drawn"],
    vars: {},
    ideas: ["roulette_on"],
  },
  {
    id: "roulette-thirty-five",
    gui: "gambling_ui",
    window: "gambling_ui_window",
    flags: ["number_35_drawn"],
    vars: {},
    ideas: ["roulette_on"],
  },
];
function localisation(dir) {
  const result = {};
  function walk(d) {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith("_l_english.yml"))
        for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
          const m = /^\s*([^\s:#]+)\s*:\s*\d*\s*"(.*)"\s*$/.exec(line);
          if (m) result[m[1]] = m[2];
        }
    }
  }
  walk(dir);
  return result;
}
const translations = localisation(join(project, "build/mod/localisation"));
function projectScene(data, assets, scene) {
  const m = new GambleNativeMachine(data);
  Object.assign(m.country.vars, scene.vars);
  m.country.flags = new Set(scene.flags);
  m.country.ideas = new Set(scene.ideas);
  const layout = data.layouts.get(scene.window),
    nodes = [];
  function walk(body, parent = { x: 0, y: 0 }) {
    for (const p of properties(body)) {
      if (p.value.kind !== "block") continue;
      const f = fields(p.value),
        kind = p.key.text.toLowerCase();
      if (!f.name) continue;
      const name = atom(f.name);
      if (kind !== "background" && !m.visible(scene.gui, name)) continue;
      const pos = f.position ? fields(f.position) : {},
        x = parent.x + Number(pos.x?.text ?? 0),
        y = parent.y + Number(pos.y?.text ?? 0);
      const sprite = f.spriteType ?? f.spritetype ?? f.quadTextureSprite;
      let texture = sprite && data.sprites.get(atom(sprite))?.texture;
      if (texture) texture = join(assets, texture.replace(/^\//, ""));
      let text = f.text ?? f.buttonText;
      if (text) {
        text = translations[atom(text)] ?? atom(text);
        text = text
          .replace(/\[\?([A-Za-z0-9_]+)(?:\|[^\]]+)?\]/g, (_, key) =>
            String(m.country.vars[key] ?? 0),
          )
          .replace(/§./g, "")
          .replace(/£[^£]*£/g, "")
          .replace(/\\n/g, "\n");
      }
      if (texture || text || kind.includes("button"))
        nodes.push({
          name,
          kind,
          x,
          y,
          texture,
          text,
          scale: Number(f.scale?.text ?? 1),
          align: f.format?.text ?? "left",
          width: Number(f.maxWidth?.text ?? f.maxwidth?.text ?? 123),
          height: Number(f.maxHeight?.text ?? f.maxheight?.text ?? 34),
          enabled: m.enabled(scene.gui, name),
        });
      if (kind.includes("container")) walk(p.value, { x, y });
    }
  }
  walk(layout);
  return nodes;
}
const record = {
  scope:
    "Independent renderer of native layout and scripted visibility. Original DDS assets are used. Font metrics, HOI4 widget skin rendering, animation and actual in-game execution are not tested.",
  scenes: scenes.map((scene) => ({
    ...scene,
    original: projectScene(original, originalRoot, scene),
    rewritten: projectScene(rewritten, join(project, "build/mod"), scene),
  })),
};
writeFileSync(join(output, "states.json"), JSON.stringify(record, null, 2));
const result = spawnSync(
  process.env.CODEX_PRIMARY_RUNTIME_PYTHON ?? "python3",
  ["scripts/lib/render-gamble-ui.py", join(output, "states.json"), output],
  { encoding: "utf8" },
);
if (result.status !== 0) throw Error(result.stderr);
console.log(result.stdout.trim());
