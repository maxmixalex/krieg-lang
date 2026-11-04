import type { CountryScope, DecisionSpec, Effect } from "krieg-lang/hoi4";
export const games = [
  {
    id: "roulette",
    category: "roulette_decision",
    on: "roulette_on",
    off: "roulette_off",
    prefix: "bet_",
    suffix: "_idea",
    betFlag: "you_put_a_bet",
    lock: "kg_roulette_locked",
  },
  {
    id: "cups",
    category: "cups_ball_decision",
    on: "cups_ball_on",
    off: "cups_ball_off",
    prefix: "cups_bet_",
    suffix: "_idea",
    betFlag: "you_put_a_bet_cups",
    lock: "cant_change_options",
  },
  {
    id: "highlow",
    category: "highlow_decision",
    on: "highlow_on",
    off: "highlow_off",
    prefix: "hl_bet_",
    suffix: "_idea",
    betFlag: "kg_hl_bet",
    lock: "hl_game_started",
  },
  {
    id: "blackjack",
    category: "blackjack_decision",
    on: "blackjack_on",
    off: "blackjack_off",
    prefix: "bet_",
    suffix: "_bj_idea",
    betFlag: "you_put_a_bet_bj",
    lock: "cant_cancel_blackjack",
  },
] as const;
export type Game = (typeof games)[number];
export const resources = [
  {
    id: "pp",
    kind: "pp",
    amount: 50,
    rouletteAmount: 50,
    equipment: "",
    tech: "",
    blackjack: true,
  },
  {
    id: "stability",
    kind: "stability",
    amount: 0.02,
    rouletteAmount: 0.02,
    equipment: "",
    tech: "",
    blackjack: true,
  },
  {
    id: "ws",
    kind: "ws",
    amount: 0.02,
    rouletteAmount: 0.02,
    equipment: "",
    tech: "",
    blackjack: true,
  },
  {
    id: "manpower",
    kind: "manpower",
    amount: 10000,
    rouletteAmount: 10000,
    equipment: "",
    tech: "",
    blackjack: true,
  },
  {
    id: "guns",
    kind: "equipment",
    amount: 1000,
    rouletteAmount: 1000,
    equipment: "infantry_equipment",
    tech: "infantry_weapons",
    blackjack: true,
  },
  {
    id: "support",
    kind: "equipment",
    amount: 500,
    rouletteAmount: 500,
    equipment: "support_equipment",
    tech: "tech_support",
    blackjack: true,
  },
  {
    id: "artillery",
    kind: "equipment",
    amount: 500,
    rouletteAmount: 500,
    equipment: "artillery_equipment",
    tech: "gw_artillery",
    blackjack: true,
  },
  {
    id: "aa_artillery",
    kind: "equipment",
    amount: 250,
    rouletteAmount: 250,
    equipment: "anti_air_equipment",
    tech: "interwar_antiair",
    blackjack: false,
  },
  {
    id: "at_artillery",
    kind: "equipment",
    amount: 250,
    rouletteAmount: 250,
    equipment: "anti_tank_equipment",
    tech: "interwar_antitank",
    blackjack: false,
  },
  {
    id: "command_power",
    kind: "command",
    amount: 20,
    rouletteAmount: 10,
    equipment: "",
    tech: "",
    blackjack: false,
  },
  {
    id: "army_xp",
    kind: "army",
    amount: 30,
    rouletteAmount: 15,
    equipment: "",
    tech: "",
    blackjack: false,
  },
  {
    id: "air_xp",
    kind: "air",
    amount: 30,
    rouletteAmount: 15,
    equipment: "",
    tech: "",
    blackjack: false,
  },
  {
    id: "navy_xp",
    kind: "navy",
    amount: 30,
    rouletteAmount: 15,
    equipment: "",
    tech: "",
    blackjack: false,
  },
  {
    id: "convoys",
    kind: "equipment",
    amount: 50,
    rouletteAmount: 50,
    equipment: "convoy_1",
    tech: "",
    blackjack: false,
  },
  {
    id: "trucks",
    kind: "equipment",
    amount: 250,
    rouletteAmount: 250,
    equipment: "motorized_equipment",
    tech: "tech_trucks",
    blackjack: false,
  },
  {
    id: "trains",
    kind: "equipment",
    amount: 20,
    rouletteAmount: 15,
    equipment: "train_equipment",
    tech: "basic_train",
    blackjack: false,
  },
  {
    id: "military_factories",
    kind: "factory",
    amount: 1,
    rouletteAmount: 1,
    equipment: "arms_factory",
    tech: "",
    blackjack: false,
  },
  {
    id: "civilian_factories",
    kind: "factory",
    amount: 1,
    rouletteAmount: 1,
    equipment: "industrial_complex",
    tech: "",
    blackjack: false,
  },
  {
    id: "dockyards",
    kind: "factory",
    amount: 1,
    rouletteAmount: 1,
    equipment: "dockyard",
    tech: "",
    blackjack: false,
  },
] as const;
export type Resource = (typeof resources)[number];
export function supported(game: Game, resource: Resource): boolean {
  return (
    game.id === "roulette" ||
    (game.id === "blackjack" ? resource.blackjack : resource.kind !== "factory")
  );
}
export function betId(game: Game, resource: Resource): string {
  return (
    game.prefix +
    (game.id === "blackjack" && resource.id === "stability" ? "st" : resource.id) +
    (game.id === "blackjack" ? "_bj" : "")
  );
}
export function betIdea(game: Game, resource: Resource): string {
  return betId(game, resource) + "_idea";
}
export function bettingOpen(c: CountryScope, game: Game): boolean {
  return game.id === "roulette"
    ? !c.triggers.has_active_mission("roulette_start") &&
        !c.triggers.has_active_mission("spin_time") &&
        !c.triggers.has_active_mission("result_time")
    : !c.triggers.hasCountryFlag(game.lock);
}
export function mission(
  game: Game,
  id: string,
  days: number,
  timeout: Effect<CountryScope>,
): DecisionSpec {
  return {
    id,
    icon: "mission_icon",
    priority: 30000,
    available: () => false,
    mission: {
      days,
      activation: (c) =>
        game.id === "blackjack"
          ? c.triggers.hasIdea("blackjack_start")
          : game.id === "highlow"
            ? c.triggers.hasIdea("highlow_start")
            : game.id === "cups"
              ? false
              : id === "roulette_start"
                ? c.triggers.hasCountryFlag("roulette_start_flag") &&
                  !c.triggers.hasIdea("roulette_off")
                : c.triggers.hasIdea(
                    id === "bet_time"
                      ? "bet_idea"
                      : id === "spin_time"
                        ? "spin_idea"
                        : "result_idea",
                  ),
      cancel: (c) => c.triggers.hasIdea(game.off),
      timeout,
      selectable: false,
      isGood: true,
    },
  };
}
export const ranks = [
  { name: "ace", short: "A", power: 14, value: 11 },
  { name: "king", short: "K", power: 13, value: 10 },
  { name: "queen", short: "Q", power: 12, value: 10 },
  { name: "jack", short: "J", power: 11, value: 10 },
  { name: "ten", short: "10", power: 10, value: 10 },
  { name: "nine", short: "9", power: 9, value: 9 },
  { name: "eight", short: "8", power: 8, value: 8 },
  { name: "seven", short: "7", power: 7, value: 7 },
  { name: "six", short: "6", power: 6, value: 6 },
  { name: "five", short: "5", power: 5, value: 5 },
  { name: "four", short: "4", power: 4, value: 4 },
  { name: "three", short: "3", power: 3, value: 3 },
  { name: "two", short: "2", power: 2, value: 2 },
] as const;
export const suits = [
  { name: "hearts", short: "H" },
  { name: "diamonds", short: "D" },
  { name: "spades", short: "S" },
  { name: "clubs", short: "C" },
] as const;
export const cards = suits.flatMap((suit, s) =>
  ranks.map((rank, r) => ({
    id: 1 + s * 13 + r,
    rank: rank.power,
    value: rank.value,
    code: rank.short + suit.short,
    image: rank.name + "_of_" + suit.name,
  })),
);
export type Card = (typeof cards)[number];
export const slots = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export const cups = [1, 2, 3, 4, 5, 6, 7] as const;
export const difficulties = [
  { id: "easy", first: 3, last: 5, rate: 1.5, option: "a" },
  { id: "medium", first: 2, last: 6, rate: 2.5, option: "b" },
  { id: "hard", first: 1, last: 7, rate: 3.5, option: "c" },
] as const;
export const numbers = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
] as const;
export const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36] as const;
export const rouletteBets = [
  {
    id: "roulette_color_red",
    group: "color",
    rate: 2,
    numbers: numbers.filter((n) => reds.some((r) => r === n)),
  },
  {
    id: "roulette_color_black",
    group: "color",
    rate: 2,
    numbers: numbers.filter((n) => n > 0 && !reds.some((r) => r === n)),
  },
  {
    id: "roulette_even",
    group: "even_odd",
    rate: 2,
    numbers: numbers.filter((n) => n > 0 && n % 2 === 0),
  },
  { id: "roulette_odd", group: "even_odd", rate: 2, numbers: numbers.filter((n) => n % 2 === 1) },
  ...[
    { id: "one", i: 0 },
    { id: "two", i: 1 },
    { id: "three", i: 2 },
  ].map((row) => ({
    id: `roulette_dozen_${row.id}`,
    group: "dozen",
    rate: 3,
    numbers: numbers.filter((n) => n > row.i * 12 && n <= (row.i + 1) * 12),
  })),
  ...[
    { id: "one", i: 1 },
    { id: "two", i: 2 },
    { id: "three", i: 0 },
  ].map((row) => ({
    id: `roulette_rank_${row.id}`,
    group: "rank",
    rate: 3,
    numbers: numbers.filter((n) => n > 0 && n % 3 === row.i),
  })),
  ...[
    { id: "one", i: 0 },
    { id: "two", i: 1 },
  ].map((row) => ({
    id: `roulette_half_${row.id}`,
    group: "half",
    rate: 2,
    numbers: numbers.filter((n) => n > row.i * 18 && n <= (row.i + 1) * 18),
  })),
  ...numbers.map((n) => ({ id: `roulette_number_${n}`, group: "number", rate: 36, numbers: [n] })),
];
export type RouletteBet = (typeof rouletteBets)[number];
export function rouletteIdea(bet: RouletteBet): string {
  return bet.group === "number" ? `number_${bet.numbers[0]}_bet` : bet.id + "_bet";
}
