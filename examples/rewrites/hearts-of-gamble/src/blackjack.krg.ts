import { CountryEvent, DecisionCategory, ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { games, cards, slots, resources, betIdea, mission, type Card } from "./catalogue.krg.ts";
import { bets, hasBet, payout, transfer } from "./economy.krg.ts";
const game = games[3];
const hitCards = [1, 27, 14, 40].flatMap((first) =>
  cards.filter((card) => card.id >= first && card.id < first + 13),
);
export function resetBlackjack(c: CountryScope, round = true): void {
  for (const name of [
    "blackjack_player",
    "blackjack_dealer",
    "number_of_aces_player",
    "number_of_aces_dealer",
  ])
    c.clearVariable(name);
  for (const flag of [
    "dealer_has_no_blackjack",
    "dealer_has_blackjack",
    "dealer_cant_draw_KQJ10",
    "normal_blackjack_game",
    "bought_insurance",
    "card_dealer_covered",
  ])
    c.effects.clearCountryFlag(flag);
  if (round)
    for (const flag of [
      "no_blackjack_dealer_text",
      "you_put_a_bet_bj",
      "insurance_pp",
      "insurance_st",
      "insurance_ws",
      "insurance_manpower",
      "insurance_guns",
      "insurance_artillery",
      "insurance_support",
    ])
      c.effects.clearCountryFlag(flag);
  // Original clears dealer_has_no_blackjack, while checks set dealer_has_not_blackjack.
  // Preserve that persistent flag mismatch for old saves and repeated rounds.
  for (const slot of slots) {
    c.effects.clearCountryFlag(`card_slot_${slot}`);
    for (const who of ["player", "dealer"])
      for (const card of cards) c.effects.clearCountryFlag(`card_${card.code}_${slot}_slot_${who}`);
  }
  c.effects.setCountryFlag("cant_make_hit");
  c.effects.setCountryFlag("cant_make_stand");
  c.effects.setCountryFlag("can_start_new_blackjack");
}
function scoreCard(
  c: CountryScope,
  who: string,
  slot: number,
  card: Card,
  mode: string,
  cover: string,
): void {
  c.effects.setCountryFlag(`card_${card.code}_${slot}_slot_${who}`);
  if (mode === "late" && card.rank === 14) {
    if (c.variable(`blackjack_${who}`) >= 11) c.addVariable(`blackjack_${who}`, 1);
    else c.addVariable(`blackjack_${who}`, 11);
  } else {
    c.addVariable(`blackjack_${who}`, card.value);
    if (card.rank === 14 && mode !== "plain") c.addVariable(`number_of_aces_${who}`, 1);
    if (mode === "full" || (mode === "initial" && card.rank === 14))
      if (c.variable(`blackjack_${who}`) > 21 && c.variable(`number_of_aces_${who}`) > 0) {
        c.subtractVariable(`blackjack_${who}`, 10);
        c.subtractVariable(`number_of_aces_${who}`, 1);
        if (cover === "restricted" && card.code === "AH")
          c.effects.clearCountryFlag("card_dealer_covered");
      }
  }
}
function draw(
  c: CountryScope,
  who: string,
  slot: number,
  deck: readonly Card[],
  mode: string,
  cover: string,
): void {
  c.randomChoice(
    deck.map((card) => ({
      weight: 1,
      effects: (s: CountryScope) => {
        scoreCard(s, who, slot, card, mode, cover);
        if (who === "dealer" || slot <= 2)
          s.effects.scoped_sound_effect(
            who === "dealer" || (slot === 2 && card.code === "2C")
              ? "card_dealt2_sound"
              : "card_dealt1_sound",
          );
        if (cover === "clear" || (cover === "restricted" && card.code !== "AH"))
          s.effects.clearCountryFlag("card_dealer_covered");
      },
    })),
  );
}
export function settleBlackjack(c: CountryScope, rate: number): void {
  payout(c, game, rate);
  c.effects.setCountryFlag("can_start_new_blackjack");
  c.effects.clearCountryFlag(game.lock);
}
export function buyInsurance(c: CountryScope, natural: boolean): void {
  for (const r of resources.filter((r) => r.blackjack))
    if (c.triggers.hasIdea(betIdea(game, r))) {
      transfer(c, r, -r.amount / 2);
      c.effects.setCountryFlag(
        `insurance_${r.id === "stability" || (natural && r.id === "ws") ? "st" : r.id}`,
      );
      c.effects.setCountryFlag("bought_insurance");
    }
}
export const insuranceEvents = ([1, 2] as const).map((id) =>
  CountryEvent({
    id: `blackjack.${id}`,
    title: `blackjack.${id}.t`,
    description: `blackjack.${id}.d`,
    picture: "GFX_news_insurance",
    timeoutDays: 3,
    isTriggeredOnly: true,
    options: [
      {
        name: `blackjack.${id}.a`,
        effects: (c) => {
          buyInsurance(c, id === 1);
          c.effects.activate_mission(`dealer_is_checking_blackjack_${id}`);
        },
      },
      {
        name: `blackjack.${id}.b`,
        effects: (c) => c.effects.activate_mission(`dealer_is_checking_blackjack_${id}`),
      },
    ],
  }),
);
export const blackjackResults = (
  [
    { id: 3, rate: 2.5 },
    { id: 5, rate: 2 },
    { id: 6, rate: 1 },
    { id: 7, rate: 0 },
  ] as const
).map((row) =>
  CountryEvent({
    id: `blackjack.${row.id}`,
    title: `blackjack.${row.id}.t`,
    description: `blackjack.${row.id}.d`,
    picture: "GFX_news_blackjack",
    timeoutDays: 3,
    isTriggeredOnly: true,
    options: [{ name: `blackjack.${row.id}.a`, effects: (c) => settleBlackjack(c, row.rate) }],
  }),
);
export const insuranceWin = CountryEvent({
  id: "blackjack.4",
  title: "blackjack.4.t",
  description: "blackjack.4.d",
  picture: "GFX_news_insurance",
  timeoutDays: 3,
  isTriggeredOnly: true,
  options: [
    {
      name: "blackjack.4.a",
      effects: (c) => {
        for (const r of resources.filter((r) => r.blackjack)) {
          const flag = `insurance_${r.id === "stability" ? "st" : r.id}`;
          if (c.triggers.hasCountryFlag(flag)) {
            transfer(c, r, r.amount);
            c.effects.clearCountryFlag(flag);
          }
        }
      },
    },
  ],
});
export function canStartBlackjack(c: CountryScope): boolean {
  return !c.triggers.hasCountryFlag(game.lock) && hasBet(c, game);
}
export const startBlackjack = ScriptedEffect("kg_blackjack_start", (c) => {
  if (canStartBlackjack(c)) {
    resetBlackjack(c);
    c.effects.setCountryFlag(game.lock);
    c.effects.activate_mission("blackjack_start");
  }
});
export function canHit(c: CountryScope): boolean {
  return c.variable("blackjack_player") <= 21 && !c.triggers.hasCountryFlag("cant_make_hit");
}
export function canStand(c: CountryScope): boolean {
  return c.variable("blackjack_player") <= 21 && !c.triggers.hasCountryFlag("cant_make_stand");
}
export const hit = ScriptedEffect("kg_blackjack_hit", (c) => {
  c.effects.scoped_sound_effect("card_dealt1_sound");
  // Pick the first unused slot once; the native source stops after its first branch.
  c.setTempVariable("kg_hit_done", 0);
  for (const slot of [3, 4, 5, 6, 7, 8])
    if (!c.triggers.hasCountryFlag(`card_slot_${slot}`) && c.variable("kg_hit_done") === 0) {
      c.setTempVariable("kg_hit_done", 1);
      c.effects.setCountryFlag(`card_slot_${slot}`);
      draw(c, "player", slot, hitCards, slot < 5 ? "full" : "late", "none");
      if (c.variable("blackjack_player") > 21) c.effects.countryEvent({ id: "blackjack.7" });
    }
});
export const stand = ScriptedEffect("kg_blackjack_stand", (c) => {
  c.effects.setCountryFlag("cant_make_hit");
  c.effects.setCountryFlag("cant_make_stand");
  if (c.triggers.hasCountryFlag("dealer_cant_draw_KQJ10"))
    c.effects.activate_mission("dealer_reveals_second_card_1");
  else if (c.triggers.hasCountryFlag("normal_blackjack_game"))
    c.effects.activate_mission("dealer_reveals_second_card_2");
});
function judgeDealer(c: CountryScope, slot: number): void {
  if (c.variable("blackjack_dealer") > 21) c.effects.countryEvent({ id: "blackjack.5" });
  else if (slot < 8 && c.variable("blackjack_dealer") <= 16)
    c.effects.activate_mission(`dealer_card${slot + 1}`);
  else if (c.variable("blackjack_dealer") > c.variable("blackjack_player"))
    c.effects.countryEvent({ id: "blackjack.7" });
  else if (c.variable("blackjack_dealer") === c.variable("blackjack_player"))
    c.effects.countryEvent({ id: "blackjack.6" });
  else c.effects.countryEvent({ id: "blackjack.5" });
}
export const blackjackDecisions = DecisionCategory({
  id: game.category,
  priority: 1001,
  icon: "GFX_poker_chip",
  visible: (c) => c.triggers.hasIdea(game.on),
  decisions: [
    {
      id: "start_new_blackjack",
      priority: 30000,
      available: canStartBlackjack,
      completeEffect: (c) => c.run(startBlackjack),
    },
    mission(game, "blackjack_start", 3, (c) => {
      c.setVariable("blackjack_player", 0);
      c.setVariable("blackjack_dealer", 0);
      c.effects.activate_mission("player_card1");
    }),
    ...[
      { id: "player_card1", who: "player", slot: 1, next: "dealer_card1" },
      { id: "dealer_card1", who: "dealer", slot: 1, next: "player_card2" },
      { id: "player_card2", who: "player", slot: 2, next: "dealer_card2_covered" },
    ].map((row) =>
      mission(game, row.id, 1, (c) => {
        draw(c, row.who, row.slot, cards, row.slot === 1 ? "first" : "initial", "none");
        c.effects.activate_mission(row.next);
      }),
    ),
    mission(game, "dealer_card2_covered", 1, (c) => {
      c.effects.setCountryFlag("card_dealer_covered");
      c.effects.scoped_sound_effect("card_dealt2_sound");
      c.effects.activate_mission("summing_round");
    }),
    mission(game, "summing_round", 1, (c) => {
      if (c.variable("blackjack_dealer") === 11) {
        if (c.variable("blackjack_player") === 21) c.effects.countryEvent({ id: "blackjack.1" });
        else c.effects.countryEvent({ id: "blackjack.2" });
      } else if (c.variable("blackjack_player") === 21 && c.variable("blackjack_dealer") === 10)
        c.effects.activate_mission("dealer_is_checking_blackjack_3");
      else if (c.variable("blackjack_player") === 21) {
        draw(
          c,
          "dealer",
          2,
          cards.filter((card) => card.rank < 10),
          "plain",
          "clear",
        );
        c.effects.countryEvent({ id: "blackjack.3" });
      } else {
        c.effects.setCountryFlag("normal_blackjack_game");
        c.effects.clearCountryFlag("cant_make_hit");
        c.effects.clearCountryFlag("cant_make_stand");
      }
    }),
    ...[1, 2, 3].map((check) =>
      mission(game, `dealer_is_checking_blackjack_${check}`, 1, (c) => {
        c.randomChoice([
          {
            weight: check === 3 ? 8 : 30,
            effects: (s: CountryScope) => s.effects.setCountryFlag("dealer_has_blackjack"),
          },
          {
            weight: check === 3 ? 92 : 70,
            effects: (s: CountryScope) => s.effects.setCountryFlag("dealer_has_not_blackjack"),
          },
        ]);
        if (c.triggers.hasCountryFlag("dealer_has_blackjack")) {
          draw(
            c,
            "dealer",
            2,
            cards.filter((card) => (check === 3 ? card.rank === 14 : card.value === 10)),
            "plain",
            "clear",
          );
          if (check === 3) c.effects.countryEvent({ id: "blackjack.6" });
          else {
            if (c.triggers.hasCountryFlag("bought_insurance")) c.schedule(insuranceWin);
            c.effects.countryEvent({ id: check === 1 ? "blackjack.3" : "blackjack.7" });
          }
        }
        // Check three uses an independent IF in the original, including the stale flag.
        if (
          (check === 3 || !c.triggers.hasCountryFlag("dealer_has_blackjack")) &&
          c.triggers.hasCountryFlag("dealer_has_not_blackjack")
        ) {
          if (check === 2) {
            c.effects.clearCountryFlag("cant_make_hit");
            c.effects.clearCountryFlag("cant_make_stand");
            c.effects.setCountryFlag("dealer_cant_draw_KQJ10");
          } else {
            draw(
              c,
              "dealer",
              2,
              cards.filter((card) => (check === 3 ? card.rank !== 14 : card.value !== 10)),
              check === 1 ? "initial" : "plain",
              "clear",
            );
            c.effects.countryEvent({ id: "blackjack.3" });
          }
        }
      }),
    ),
    ...[1, 2].map((mode) =>
      mission(game, `dealer_reveals_second_card_${mode}`, 1, (c) => {
        draw(
          c,
          "dealer",
          2,
          cards.filter((card) => mode === 2 || card.value !== 10),
          "initial",
          mode === 1 ? "restricted" : "clear",
        );
        judgeDealer(c, 2);
      }),
    ),
    ...[3, 4, 5, 6, 7, 8].map((slot) =>
      mission(game, `dealer_card${slot}`, 1, (c) => {
        if (slot === 3) c.effects.setCountryFlag("no_blackjack_dealer_text");
        draw(c, "dealer", slot, cards, "full", "none");
        judgeDealer(c, slot);
      }),
    ),
    ...bets(game),
  ],
});
