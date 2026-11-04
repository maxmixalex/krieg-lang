import { CountryEvent, DecisionCategory, Idea, type CountryScope } from "krieg-lang/hoi4";
import {
  games,
  numbers,
  rouletteBets,
  rouletteIdea,
  bettingOpen,
  mission,
  type RouletteBet,
} from "./catalogue.krg.ts";
import { bets, hasBet, payout } from "./economy.krg.ts";
const game = games[0];
export const rouletteIdeas = [
  ...numbers.map((n) =>
    Idea({
      id: `number_${n}_drawn`,
      removalCost: -1,
      allowed: () => true,
      allowedCivilWar: () => true,
    }),
  ),
  ...rouletteBets.map((b) =>
    Idea({
      id: rouletteIdea(b),
      removalCost: -1,
      allowed: () => true,
      allowedCivilWar: () => true,
    }),
  ),
];
export function wonRate(c: CountryScope, rate: number): boolean {
  return rouletteBets
    .filter((b) => b.rate === rate)
    .some(
      (b) =>
        c.triggers.hasIdea(rouletteIdea(b)) &&
        b.numbers.some((n) => c.triggers.hasIdea(`number_${n}_drawn`)),
    );
}
export function clearRouletteBets(c: CountryScope): void {
  for (const b of rouletteBets) c.effects.removeIdeas(rouletteIdea(b));
  c.effects.clearCountryFlag(game.betFlag);
}
export const rouletteResult = CountryEvent({
  id: "gamble.1",
  title: "gamble.1.t",
  description: "gamble.1.d",
  picture: "GFX_news_event_roulette",
  timeoutDays: 3,
  isTriggeredOnly: true,
  options: [
    ...[
      { rate: 2, option: "a" },
      { rate: 3, option: "b" },
      { rate: 36, option: "c" },
    ].map((row) => ({
      name: `gamble.1.${row.option}`,
      trigger: (c: CountryScope) => wonRate(c, row.rate),
      effects: (c: CountryScope) => {
        payout(c, game, row.rate);
        clearRouletteBets(c);
      },
    })),
    {
      name: "gamble.1.f",
      trigger: (c) => !wonRate(c, 2) && !wonRate(c, 3) && !wonRate(c, 36),
      effects: (c) => {
        payout(c, game, 0);
        clearRouletteBets(c);
      },
    },
  ],
});
export function canPlace(c: CountryScope): boolean {
  return c.triggers.hasCountryFlag(game.betFlag) && bettingOpen(c, game);
}
export function placeRoulette(c: CountryScope, b: RouletteBet): void {
  if (canPlace(c)) {
    c.effects.addIdeas(rouletteIdea(b));
    c.effects.clearCountryFlag(`roulette_${b.group}_flag`);
    c.effects.scoped_sound_effect("chips_place_sound");
  }
}
export const rouletteDecisions = DecisionCategory({
  id: game.category,
  priority: 1000,
  icon: "GFX_poker_chip",
  scriptedGui: "gambling_ui",
  visible: (c) => c.triggers.hasIdea(game.on),
  decisions: [
    mission(game, "roulette_start", 3, (c) => {
      c.effects.activate_mission("bet_time");
      c.effects.clearCountryFlag("roulette_start_flag");
    }),
    mission(game, "bet_time", 30, (c) => {
      c.effects.activate_mission("spin_time");

      for (const n of numbers) c.effects.clearCountryFlag(`number_${n}_drawn`);
    }),
    mission(game, "spin_time", 3, (c) => {
      c.effects.activate_mission("result_time");
      c.randomChoice(
        numbers.map((n) => ({
          weight: 1,
          effects: (s: CountryScope) => {
            s.effects.addIdeas(`number_${n}_drawn`);
            s.effects.setCountryFlag(`number_${n}_drawn`);
          },
        })),
      );
    }),
    mission(game, "result_time", 3, (c) => {
      c.effects.activate_mission("bet_time");

      if (
        c.triggers.hasIdea(game.on) &&
        hasBet(c, game) &&
        rouletteBets.some((b) => c.triggers.hasIdea(rouletteIdea(b)))
      )
        c.schedule(rouletteResult);
      // Preserve original event/cleanup order: color and straight bets disappear here,
      // other selections disappear when the event option is taken. Drawn flags remain.
      for (const b of rouletteBets.filter((b) => b.group === "color" || b.group === "number"))
        c.effects.removeIdeas(rouletteIdea(b));
      for (const n of numbers) c.effects.removeIdeas(`number_${n}_drawn`);
    }),
    ...["color", "even_odd", "number", "dozen", "rank", "half"].map((group) => ({
      id: `roulette_${group}`,
      visible: (c: CountryScope) =>
        !["color", "even_odd", "number", "dozen", "rank", "half"].some((g) =>
          c.triggers.hasCountryFlag(`roulette_${g}_flag`),
        ),
      available: (c: CountryScope) =>
        bettingOpen(c, game) && !rouletteBets.some((b) => c.triggers.hasIdea(rouletteIdea(b))),
      completeEffect: (c: CountryScope) => c.effects.setCountryFlag(`roulette_${group}_flag`),
    })),
    ...rouletteBets.map((b) => ({
      id: b.id,
      visible: (c: CountryScope) => c.triggers.hasCountryFlag(`roulette_${b.group}_flag`),
      available: canPlace,
      completeEffect: (c: CountryScope) => placeRoulette(c, b),
    })),
    ...["color", "even_odd", "number", "dozen", "rank", "half"].map((group) => ({
      id: `roulette_${group}_cancel`,
      visible: (c: CountryScope) => c.triggers.hasCountryFlag(`roulette_${group}_flag`),
      available: (c: CountryScope) => bettingOpen(c, game),
      completeEffect: (c: CountryScope) => c.effects.clearCountryFlag(`roulette_${group}_flag`),
    })),
  ],
});
export const rouletteEconomy = DecisionCategory({
  id: "betting_decision",
  priority: 999,
  icon: "GFX_poker_chip",
  visible: (c) => c.triggers.hasIdea(game.on),
  decisions: bets(game),
});
