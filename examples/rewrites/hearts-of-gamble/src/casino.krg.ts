import { DecisionCategory, type CountryScope } from "krieg-lang/hoi4";
import { games, numbers, difficulties, type Game } from "./catalogue.krg.ts";
import { hasBet } from "./economy.krg.ts";
import { resetBlackjack } from "./blackjack.krg.ts";
import { resetCups } from "./cups.krg.ts";
import { clearRouletteBets } from "./roulette.krg.ts";
export function canClose(c: CountryScope, game: Game): boolean {
  return game.id === "roulette"
    ? !c.triggers.has_active_mission("spin_time") &&
        !c.triggers.has_active_mission("result_time") &&
        !c.triggers.hasCountryFlag(game.betFlag)
    : !c.triggers.hasCountryFlag(game.lock);
}
export function openGame(c: CountryScope, game: Game): void {
  c.effects.addIdeas(game.on);
  c.effects.removeIdeas(game.off);
  if (game.id === "roulette") {
    c.effects.setCountryFlag("roulette_start_flag");
    if (hasBet(c, game)) c.effects.setCountryFlag(game.betFlag);
  }
  if (game.id === "blackjack") resetBlackjack(c, false);
  if (game.id === "highlow") c.effects.setCountryFlag("hl_cannot_click_button");
}
export function closeGame(c: CountryScope, game: Game): void {
  if (canClose(c, game)) {
    c.effects.addIdeas(game.off);
    c.effects.removeIdeas(game.on);
    if (game.id === "cups") {
      resetCups(c, false);
      for (const flag of [
        "cups_dealer1",
        "cups_dealer2",
        "cups_dealer3",
        "difficulty_has_been_chosen",
        "player_chooses_a_cup",
        "cup_clicked",
        "cups_ready",
        "clickable_cups",
      ])
        c.effects.clearCountryFlag(flag);
      for (const d of difficulties) c.effects.clearCountryFlag(`cups_difficulty_${d.id}`);
    }
    if (game.id === "roulette") {
      clearRouletteBets(c);
      for (const n of numbers) c.effects.clearCountryFlag(`number_${n}_drawn`);
      for (const group of ["color", "even_odd", "number", "dozen", "rank", "half"])
        c.effects.clearCountryFlag(`roulette_${group}_flag`);
    }
  }
}
export const casino = DecisionCategory({
  id: "casino_games_decision",
  priority: 100000,
  icon: "GFX_poker_chip",
  scriptedGui: "casino_ui",
  decisions: games.flatMap((game) => [
    {
      id: game.on,
      icon: "GFX_poker_chip",
      visible: (c: CountryScope) => !c.triggers.hasIdea(game.on),
      completeEffect: (c: CountryScope) => openGame(c, game),
    },
    {
      id: game.off,
      icon: "GFX_poker_chip",
      visible: (c: CountryScope) => c.triggers.hasIdea(game.on),
      available: (c: CountryScope) => canClose(c, game),
      completeEffect: (c: CountryScope) => closeGame(c, game),
    },
  ]),
});
