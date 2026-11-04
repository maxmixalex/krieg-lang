import { Idea, type CountryScope, type DecisionSpec } from "krieg-lang/hoi4";
import {
  games,
  resources,
  supported,
  bettingOpen,
  betId,
  betIdea,
  type Game,
  type Resource,
} from "./catalogue.krg.ts";
export function amount(game: Game, resource: Resource): number {
  return game.id === "roulette" ? resource.rouletteAmount : resource.amount;
}
export function affordable(c: CountryScope, game: Game, r: Resource): boolean {
  const n = amount(game, r);
  if (r.kind === "pp") return c.politicalPower > n;
  if (r.kind === "stability") return c.stability > n;
  if (r.kind === "ws") return c.warSupport > n;
  if (r.kind === "manpower") return c.availableManpower > n;
  if (r.kind === "command") return c.commandPower > n;
  if (r.kind === "army") return c.armyExperience > n;
  if (r.kind === "air") return c.airExperience > n;
  if (r.kind === "navy") return c.navyExperience > n;
  if (r.kind === "equipment")
    return (
      (r.tech === "" || c.triggers.has_tech(r.tech)) &&
      c.hasEquipment(r.id === "convoys" ? "convoy" : r.equipment, n - 1, "moreThan")
    );
  if (r.id === "military_factories") return c.militaryFactories > 1;
  if (r.id === "civilian_factories") return c.civilianFactories > 1;
  return c.navalFactories > 1 && c.triggers.any_core_state((s) => s.triggers.is_coastal(true));
}
export function transfer(c: CountryScope, r: Resource, n: number): void {
  if (r.kind === "pp") c.effects.addPoliticalPower(n);
  if (r.kind === "stability") c.effects.addStability(n);
  if (r.kind === "ws") c.effects.addWarSupport(n);
  if (r.kind === "manpower") c.effects.add_manpower(n);
  if (r.kind === "command") c.effects.add_command_power(n);
  if (r.kind === "army") c.effects.army_experience(n);
  if (r.kind === "air") c.effects.air_experience(n);
  if (r.kind === "navy") c.effects.navy_experience(n);
  if (r.kind === "equipment")
    c.effects.add_equipment_to_stockpile({ type: r.equipment, amount: n });
  if (r.kind === "factory") {
    if (n < 0)
      c.effects.random_owned_controlled_state({
        limit: (s) => s.buildingLevel(r.equipment) > 0,
        effects: (s) => {
          s.effects.remove_building({ type: r.equipment, level: 1 });
          s.effects.add_extra_state_shared_building_slots(-1);
        },
      });
    else if (n === 36) {
      for (const _repeat of [1, 2, 3, 4])
        c.effects.random_core_state({
          limit: (s) => r.id !== "dockyards" || s.triggers.is_coastal(true),
          effects: (s) => {
            s.effects.add_building_construction({
              type: r.equipment,
              level: 9,
              instant_build: true,
            });
            s.effects.add_extra_state_shared_building_slots(9);
          },
        });
    } else
      c.effects.random_core_state({
        limit: (s) => r.id !== "dockyards" || s.triggers.is_coastal(true),
        effects: (s) => {
          s.effects.add_building_construction({ type: r.equipment, level: n, instant_build: true });
          s.effects.add_extra_state_shared_building_slots(n);
        },
      });
  }
}
export function hasBet(c: CountryScope, game: Game): boolean {
  return resources
    .filter((r) => supported(game, r))
    .some((r) => c.triggers.hasIdea(betIdea(game, r)));
}
export function canBet(c: CountryScope, game: Game, r: Resource): boolean {
  return (
    c.triggers.hasIdea(game.on) &&
    bettingOpen(c, game) &&
    !c.triggers.hasIdea(betIdea(game, r)) &&
    affordable(c, game, r)
  );
}
export function wager(c: CountryScope, game: Game, r: Resource): void {
  if (canBet(c, game, r)) {
    transfer(c, r, -amount(game, r));
    c.effects.addIdeas(betIdea(game, r));
    c.effects.setCountryFlag(game.betFlag);
  }
}
export function payout(c: CountryScope, game: Game, rate: number): void {
  for (const r of resources.filter((r) => supported(game, r)))
    if (c.triggers.hasIdea(betIdea(game, r))) {
      if (rate > 0) transfer(c, r, amount(game, r) * rate);
      c.effects.removeIdeas(betIdea(game, r));
    }
}
export function bets(game: Game): readonly DecisionSpec[] {
  return resources
    .filter((r) => supported(game, r))
    .map((r, i) => ({
      id: betId(game, r),
      priority: 1000 - i,
      icon: "GFX_poker_chip",
      available: (c: CountryScope) => canBet(c, game, r),
      completeEffect: (c: CountryScope) => wager(c, game, r),
    }));
}
export const accountIdeas = games.flatMap((game) => [
  Idea({ id: game.on, removalCost: -1, allowed: () => true, allowedCivilWar: () => true }),
  Idea({ id: game.off, removalCost: -1, allowed: () => true, allowedCivilWar: () => true }),
  ...resources
    .filter((r) => supported(game, r))
    .map((r) =>
      Idea({
        id: betIdea(game, r),
        removalCost: -1,
        allowed: () => true,
        allowedCivilWar: () => true,
      }),
    ),
]);

// Original declarations with no normal wager button remain addressable by old saves.
export const compatibilityIdeas = [
  "blackjack_start",
  "highlow_start",
  "bet_idea",
  "spin_idea",
  "result_idea",
  ...games
    .filter((g) => g.id === "cups" || g.id === "highlow")
    .flatMap((g) => resources.filter((r) => r.kind === "factory").map((r) => betIdea(g, r))),
].map((id) => Idea({ id, removalCost: -1, allowed: () => true, allowedCivilWar: () => true }));
