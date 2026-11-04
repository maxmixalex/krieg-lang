import { AudioBank } from "krieg-lang/hoi4";
import { Sprite, SpriteFile } from "krieg-lang/ui";
import { cards, games, resources, supported, betIdea } from "./catalogue.krg.ts";
export const numberWords = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
  "twenty_one",
  "twenty_two",
  "twenty_three",
  "twenty_four",
  "twenty_five",
  "twenty_six",
  "twenty_seven",
  "twenty_eight",
  "twenty_nine",
  "thirty",
  "thirty_one",
  "thirty_two",
  "thirty_three",
  "thirty_four",
  "thirty_five",
  "thirty_six",
] as const;
const fixed = [
  { id: "casino_background", path: "casino_background" },
  { id: "poker_chip", path: "poker_chip" },
  { id: "blackjack_background", path: "blackjack/blackjack_background" },
  { id: "card_covered", path: "blackjack/card_covered" },
  { id: "news_blackjack", path: "blackjack/event_blackjack" },
  { id: "news_insurance", path: "blackjack/event_insurance" },
  { id: "highlow_background", path: "highlow/background" },
  { id: "news_highlow", path: "highlow/event_highlow" },
  { id: "roulette_background", path: "roulette/background" },
  { id: "news_event_roulette", path: "roulette/event_roulette" },
  { id: "small_roulette", path: "roulette/roulette_small" },
  { id: "cups_background", path: "cups/background" },
  { id: "news_event_cups", path: "cups/event_cups" },
  { id: "empty_cup", path: "cups/cup" },
  { id: "cups_cloud", path: "cups/speech" },
  { id: "white_ball", path: "cups/ball" },
  ...[1, 2, 3].map((n) => ({ id: `cups_dealer${n}`, path: `cups/dealer${n}` })),
];
const placementPictures = [
  { idea: "roulette_color_red_bet", file: "red_color" },
  { idea: "roulette_color_black_bet", file: "black_color" },
  ...[
    "even",
    "odd",
    "dozen_one",
    "dozen_two",
    "dozen_three",
    "rank_one",
    "rank_two",
    "rank_three",
    "half_one",
    "half_two",
  ].map((id) => ({ idea: `roulette_${id}_bet`, file: id })),
];
function stakeTexture(id: string): string {
  return id === "trains" || id === "trucks"
    ? `bet_${id}`
    : id === "at_artillery"
      ? "bet_at_idea"
      : id === "aa_artillery"
        ? "bet_aa_idea"
        : `bet_${id}_idea`;
}
export const sprites = SpriteFile("interface/krieg_gamble.gfx", [
  ...fixed.map((row) =>
    Sprite({ name: `GFX_${row.id}`, textureFile: `gfx/interface/${row.path}.dds` }),
  ),
  ...cards.map((card) =>
    Sprite({ name: `GFX_${card.image}`, textureFile: `gfx/interface/blackjack/${card.image}.dds` }),
  ),
  ...games.flatMap((game) => [
    ...["on", "off"].map((state) =>
      Sprite({
        name: `GFX_idea_${game.id === "cups" ? "cups_ball" : game.id}_${state}`,
        textureFile:
          game.id === "cups"
            ? `gfx/interface/cups/cups_${state}.dds`
            : `gfx/interface/ideas/${game.id}_${state}.dds`,
      }),
    ),
    ...resources
      .filter((r) => supported(game, r))
      .map((r) =>
        Sprite({
          name: `GFX_idea_${betIdea(game, r)}`,
          textureFile: `gfx/interface/ideas/${stakeTexture(r.id)}.dds`,
        }),
      ),
  ]),
  ...placementPictures.map((row) =>
    Sprite({ name: `GFX_idea_${row.idea}`, textureFile: `gfx/interface/roulette/${row.file}.dds` }),
  ),
  ...numberWords.flatMap((word, n) => [
    Sprite({
      name: `GFX_number_${word}`,
      textureFile: `gfx/interface/roulette/number_${word}.dds`,
    }),
    Sprite({
      name: `GFX_idea_number_${n}_bet`,
      textureFile: `gfx/interface/roulette/number_${word}.dds`,
    }),
    Sprite({
      name: `GFX_idea_number_${n}_drawn`,
      textureFile: `gfx/interface/roulette/number_${word}.dds`,
    }),
    Sprite({
      name: `GFX_${word}_texticon`,
      textureFile: `gfx/texticons/number_${word}.dds`,
      lazyLoad: false,
    }),
  ]),
  ...[
    "red",
    "black",
    "artillery_equipment",
    "support_equipment",
    "war_support",
    "aa_artillery",
    "at_artillery",
    "command_power",
    "civilian_factory",
    "military_factory",
    "dockyard",
    "army_xp",
    "air_xp",
    "navy_xp",
    "convoy",
    "truck",
    "train",
  ].map((id) =>
    Sprite({
      name: `GFX_${id === "train" ? "train_bet" : id}_texticon`,
      textureFile: `gfx/texticons/${id}_texticon.dds`,
      lazyLoad: false,
    }),
  ),
]);
export const chips = AudioBank("Roulette", {
  path: "sound/krieg_chips.asset",
  volume: 0.35,
  maxAudible: 1,
  clips: { chips_place_sound: "roulette/chips.wav" },
  compressor: {
    enabled: true,
    pregain: 3,
    postgain: 0,
    ratio: 10,
    threshold: -15,
    attacktime: 0.03,
    releasetime: 1.2,
  },
});
export const dealing = AudioBank("Blackjack", {
  path: "sound/krieg_dealing.asset",
  volume: 0.5,
  maxAudible: 1,
  clips: {
    card_dealt1_sound: "blackjack/card_dealt1.wav",
    card_dealt2_sound: "blackjack/card_dealt2.wav",
  },
  compressor: {
    enabled: true,
    pregain: 3,
    postgain: 0,
    ratio: 10,
    threshold: -15,
    attacktime: 0.03,
    releasetime: 1.2,
  },
});
