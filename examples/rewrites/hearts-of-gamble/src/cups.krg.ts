import { CountryEvent, DecisionCategory, ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { cups, difficulties, games, mission } from "./catalogue.krg.ts";
import { bets, hasBet, payout } from "./economy.krg.ts";
const game = games[1];
export function chooseDealer(c: CountryScope, n: number): void {
  for (const i of [1, 2, 3]) c.effects.clearCountryFlag(`cups_dealer${i}`);
  c.effects.setCountryFlag(`cups_dealer${n}`);
  c.effects.clearCountryFlag("choosing_dealer");
}
export function difficulty(c: CountryScope, id: string): void {
  for (const d of difficulties) c.effects.clearCountryFlag(`cups_difficulty_${d.id}`);
  c.effects.setCountryFlag(`cups_difficulty_${id}`);
  c.effects.setCountryFlag("difficulty_has_been_chosen");
  c.effects.clearCountryFlag("cups_difficulty");
}
export function resetCups(c: CountryScope, clearStake = true): void {
  if (clearStake) c.effects.clearCountryFlag("you_put_a_bet_cups");
  for (const flag of ["cant_change_options", "hide_the_cloud", "hide_the_ball"])
    c.effects.clearCountryFlag(flag);
  for (const n of cups) {
    c.effects.clearCountryFlag(`cups_results${n}`);
    c.effects.clearCountryFlag(`player_picked_cup_${n}`);
  }
}
export function cupsWin(c: CountryScope): boolean {
  return cups.some(
    (n) =>
      c.triggers.hasCountryFlag(`cups_results${n}`) &&
      c.triggers.hasCountryFlag(`player_picked_cup_${n}`),
  );
}
export const cupResult = CountryEvent({
  id: "cups.1",
  title: "cups.1.t",
  description: "cups.1.d",
  picture: "GFX_news_event_cups",
  timeoutDays: 3,
  isTriggeredOnly: true,
  options: [
    ...difficulties.map((d) => ({
      name: `cups.1.${d.option}`,
      trigger: (c: CountryScope) =>
        c.triggers.hasIdea(game.on) &&
        c.triggers.hasCountryFlag(`cups_difficulty_${d.id}`) &&
        cupsWin(c),
      effects: (c: CountryScope) => {
        payout(c, game, d.rate);
        resetCups(c);
      },
    })),
    {
      name: "cups.1.f",
      trigger: (c) => !cupsWin(c),
      effects: (c) => {
        payout(c, game, 0);
        resetCups(c);
      },
    },
  ],
});
export function canStartCups(c: CountryScope): boolean {
  return (
    !c.triggers.hasCountryFlag(game.lock) &&
    hasBet(c, game) &&
    difficulties.some((d) => c.triggers.hasCountryFlag(`cups_difficulty_${d.id}`))
  );
}
export const startCups = ScriptedEffect("kg_cups_start", (c) => {
  if (canStartCups(c)) {
    for (const flag of ["cant_change_options", "hide_the_ball", "hide_the_cloud"])
      c.effects.setCountryFlag(flag);
    c.effects.activate_mission("cups_ball_shuffle1");
  }
});
export function pickCup(c: CountryScope, n: number): void {
  if (c.triggers.hasCountryFlag("player_chooses_a_cup") && c.triggers.hasCountryFlag(game.lock)) {
    c.effects.activate_mission("dealer_reveals_a_cup");
    c.effects.clearCountryFlag("player_chooses_a_cup");
    c.effects.setCountryFlag(`player_picked_cup_${n}`);
    c.effects.setCountryFlag("hide_the_cloud");
  }
}
export const cupsDecisions = DecisionCategory({
  id: game.category,
  icon: "GFX_poker_chip",
  priority: 1002,
  visible: (c) => c.triggers.hasIdea(game.on),
  decisions: [
    mission(game, "cups_ball_shuffle1", 2, (c) => c.effects.activate_mission("cups_ball_shuffle2")),
    mission(game, "cups_ball_shuffle2", 2, (c) => c.effects.activate_mission("cups_ball_shuffle3")),
    mission(game, "cups_ball_shuffle3", 2, (c) => {
      c.effects.setCountryFlag("player_chooses_a_cup");
      c.effects.setCountryFlag("clickable_cups");
      c.effects.clearCountryFlag("hide_the_cloud");
    }),
    mission(game, "dealer_reveals_a_cup", 2, (c) => {
      c.effects.activate_mission("cups_ball_summarize");
      for (const d of difficulties)
        if (c.triggers.hasCountryFlag(`cups_difficulty_${d.id}`))
          c.randomChoice(
            cups
              .filter((n) => n >= d.first && n <= d.last)
              .map((n) => ({
                weight: 1,
                effects: (s: CountryScope) => {
                  s.effects.setCountryFlag(`cups_results${n}`);
                  if (n === 4) s.effects.clearCountryFlag("hide_the_ball");
                },
              })),
          );
    }),
    mission(game, "cups_ball_summarize", 1, (c) => c.schedule(cupResult)),
    {
      id: "start_cups_game",
      priority: 9000,
      available: canStartCups,
      completeEffect: (c) => c.run(startCups),
    },
    {
      id: "choose_dealer",
      visible: (c) =>
        !c.triggers.hasCountryFlag("choosing_dealer") &&
        !c.triggers.hasCountryFlag("cups_difficulty") &&
        !c.triggers.hasCountryFlag(game.lock),
      completeEffect: (c) => c.effects.setCountryFlag("choosing_dealer"),
    },
    ...[
      { n: 1, id: "one" },
      { n: 2, id: "two" },
      { n: 3, id: "three" },
    ].map((row) => ({
      id: `dealer_${row.id}`,
      visible: (c: CountryScope) =>
        c.triggers.hasCountryFlag("choosing_dealer") &&
        !c.triggers.hasCountryFlag(`cups_dealer${row.n}`),
      completeEffect: (c: CountryScope) => chooseDealer(c, row.n),
    })),
    {
      id: "dealer_choosing_cancel",
      visible: (c) => c.triggers.hasCountryFlag("choosing_dealer"),
      completeEffect: (c) => c.effects.clearCountryFlag("choosing_dealer"),
    },
    {
      id: "choose_difficulty",
      visible: (c) =>
        !c.triggers.hasCountryFlag("cups_difficulty") &&
        !c.triggers.hasCountryFlag("choosing_dealer") &&
        !c.triggers.hasCountryFlag(game.lock) &&
        [1, 2, 3].some((n) => c.triggers.hasCountryFlag(`cups_dealer${n}`)),
      completeEffect: (c) => c.effects.setCountryFlag("cups_difficulty"),
    },
    ...difficulties.map((d) => ({
      id: `cups_difficulty_${d.id}`,
      visible: (c: CountryScope) => c.triggers.hasCountryFlag("cups_difficulty"),
      completeEffect: (c: CountryScope) => difficulty(c, d.id),
    })),
    {
      id: "cups_difficulty_cancel",
      visible: (c) => c.triggers.hasCountryFlag("cups_difficulty"),
      completeEffect: (c) => c.effects.clearCountryFlag("cups_difficulty"),
    },
    ...bets(game),
  ],
});
