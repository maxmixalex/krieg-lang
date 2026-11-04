import { CountryEvent, DecisionCategory, ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { games, cards, mission } from "./catalogue.krg.ts";
import { bets, hasBet, payout } from "./economy.krg.ts";
const game = games[2];
export const highlowResult = CountryEvent({
  id: "highlow.1",
  title: "highlow.1.t",
  description: "highlow.1.d",
  picture: "GFX_news_highlow",
  timeoutDays: 3,
  isTriggeredOnly: true,
  options: [
    ...[
      { rate: 2, option: "a" },
      { rate: 4, option: "b" },
      { rate: 6, option: "c" },
      { rate: 8, option: "e" },
      { rate: 0, option: "f" },
    ].map((row) => ({
      name: `highlow.1.${row.option}`,
      trigger: (c: CountryScope) => c.variable("multiplier") === row.rate,
      effects: (c: CountryScope) => {
        payout(c, game, row.rate);
        c.effects.clearCountryFlag("hl_game_started");
      },
    })),
  ],
});
const stages = [
  { slot: 1, name: "first", check: "second" },
  { slot: 2, name: "second", check: "third" },
  { slot: 3, name: "third", check: "fourth" },
  { slot: 4, name: "fourth", check: "fifth" },
  { slot: 5, name: "fifth", check: "done" },
] as const;
export function resetHighlow(c: CountryScope): void {
  for (const stage of stages) {
    c.clearVariable(`${stage.name}_card_power`);
    for (const card of cards) c.effects.clearCountryFlag(`hl_card_${card.code}_slot${stage.slot}`);
  }
  for (const flag of [
    "higher_chosen",
    "even_chosen",
    "lower_chosen",
    "checking_second_card",
    "checking_third_card",
    "checking_fourth_card",
    "checking_fifth_card",
    "payout_2",
    "payout_4",
    "payout_6",
    "payout_8",
  ])
    c.effects.clearCountryFlag(flag);
  c.setVariable("multiplier", 0);
}
export function canStartHighlow(c: CountryScope): boolean {
  return !c.triggers.hasCountryFlag(game.lock) && hasBet(c, game);
}
export const startHighlow = ScriptedEffect("kg_highlow_start", (c) => {
  if (canStartHighlow(c)) {
    resetHighlow(c);
    c.effects.setCountryFlag(game.lock);
    c.effects.setCountryFlag("hl_cannot_click_button");
    c.effects.activate_mission("highlow_start");
  }
});
export function guess(c: CountryScope, direction: string): void {
  c.effects.setCountryFlag(`${direction}_chosen`);
  for (const stage of stages.filter((s) => s.slot > 1))
    if (c.triggers.hasCountryFlag(`checking_${stage.name}_card`)) {
      c.effects.activate_mission(`highlow_card${stage.slot}`);
      c.effects.setCountryFlag("hl_cannot_click_button");
    }
}
export function cashOut(c: CountryScope): void {
  for (const rate of [2, 4, 6, 8])
    if (c.variable("multiplier") === rate) {
      c.effects.setCountryFlag(`payout_${rate}`);
      c.schedule(highlowResult);
    }
  c.effects.setCountryFlag("hl_cannot_click_button");
}
export const highlowDecisions = DecisionCategory({
  id: game.category,
  priority: 10001,
  icon: "GFX_poker_chip",
  visible: (c) => c.triggers.hasIdea(game.on),
  decisions: [
    {
      id: "start_new_highlow",
      priority: 30000,
      available: canStartHighlow,
      completeEffect: (c) => c.run(startHighlow),
    },
    mission(game, "highlow_start", 3, (c) => c.effects.activate_mission("highlow_card1")),
    ...stages.map((stage) =>
      mission(game, `highlow_card${stage.slot}`, 1, (c) => {
        c.effects.clearCountryFlag(`checking_${stage.name}_card`);
        if (stage.slot < 5) c.effects.setCountryFlag(`checking_${stage.check}_card`);
        c.randomChoice(
          cards.map((card) => ({
            weight: 2,
            effects: (s: CountryScope) => {
              s.effects.setCountryFlag(`hl_card_${card.code}_slot${stage.slot}`);
              s.setVariable(`${stage.name}_card_power`, card.rank);
              s.effects.scoped_sound_effect("card_dealt1_sound");
            },
          })),
        );
        if (stage.slot === 1) {
          c.setVariable("multiplier", 0);
          c.effects.clearCountryFlag("hl_cannot_click_button");
        } else {
          const previous = stages[stage.slot - 2];
          if (
            (c.triggers.hasCountryFlag("higher_chosen") &&
              c.variable(`${stage.name}_card_power`) > c.variable(`${previous.name}_card_power`)) ||
            (c.triggers.hasCountryFlag("even_chosen") &&
              c.variable(`${stage.name}_card_power`) ===
                c.variable(`${previous.name}_card_power`)) ||
            (c.triggers.hasCountryFlag("lower_chosen") &&
              c.variable(`${stage.name}_card_power`) < c.variable(`${previous.name}_card_power`))
          ) {
            c.setVariable("multiplier", (stage.slot - 1) * 2);
            for (const direction of ["higher", "even", "lower"])
              c.effects.clearCountryFlag(`${direction}_chosen`);
            c.effects.setCountryFlag(`payout_${(stage.slot - 1) * 2}`);
            if (stage.slot > 2) c.effects.clearCountryFlag(`payout_${(stage.slot - 2) * 2}`);
            if (stage.slot === 5) c.schedule(highlowResult);
            else c.effects.clearCountryFlag("hl_cannot_click_button");
          } else {
            c.setVariable("multiplier", 0);
            c.schedule(highlowResult);
          }
        }
      }),
    ),
    ...bets(game),
  ],
});
