import { CountryEvent, ScriptedEffect, countryTarget, type CountryScope } from "krieg-lang/hoi4";
import { cards, seats, guestSeats, type Card } from "./cards.krg.ts";
import { deckColors, updateDisplay } from "./display.krg.ts";

export function turn(country: CountryScope): boolean {
  return (
    country.triggers.has_global_flag("ku_started") &&
    country.variable("ku_seat") === country.variable("global.ku_turn")
  );
}
export function canPlay(country: CountryScope, card: Card): boolean {
  return (
    turn(country) &&
    (card.rank !== 13 || country.variable("global.ku_dealing") <= 0) &&
    country.arrayContains("ku_hand", card.id) &&
    (country.variable("global.ku_choose_color") === 1 ||
      country.variable("global.ku_pending") === 0 ||
      ((card.rank === 12 || card.rank === 14) &&
        country.variable("global.ku_penalty_started") === 0)) &&
    (card.color === 0 ||
      country.variable("global.ku_color") === card.color ||
      country.variable("global.ku_rank") === card.rank)
  );
}

export const advance = ScriptedEffect("ku_advance", (country) => {
  country.addVariable("global.ku_turn", country.variable("global.ku_direction"));
  if (country.variable("global.ku_turn") > 6) country.setVariable("global.ku_turn", 1);
  if (country.variable("global.ku_turn") < 1) country.setVariable("global.ku_turn", 6);
});

export const reshuffle = ScriptedEffect("ku_reshuffle", (country) => {
  country.setVariable("global.ku_remaining", 0);
  for (const color of deckColors) country.setVariable(`global.num_of_${color.name}_cards`, 0);
  for (const card of cards) {
    country.setVariable(`global.ku_deck_${card.id}`, 0);
    if (!country.anyCountry((player) => player.arrayContains("ku_hand", card.id))) {
      country.setVariable(`global.ku_deck_${card.id}`, 1);
      country.addVariable("global.ku_remaining", 1);
      for (const color of deckColors)
        if (color.id === card.color) country.addVariable(`global.num_of_${color.name}_cards`, 1);
    }
  }
  country.effects.sound_effect("ku_shuffle");
  country.run(updateDisplay);
});

export const drawOne = ScriptedEffect("ku_draw_one", (country) => {
  if (country.variable("global.ku_remaining") > 0) {
    country.randomChoice(
      cards.map((card) => ({
        weight: country.variable(`global.ku_deck_${card.id}`),
        effects: (player: CountryScope) => {
          player.setVariable(`global.ku_deck_${card.id}`, 0);
          player.subtractVariable("global.ku_remaining", 1);
          player.arrayPush("ku_hand", card.id);
          for (const color of deckColors)
            if (color.id === card.color)
              player.subtractVariable(`global.num_of_${color.name}_cards`, 1);
        },
      })),
    );
    country.effects.sound_effect("ku_draw");
  }
});

export const draw = ScriptedEffect("ku_draw", (country) => {
  if (
    turn(country) &&
    country.variable("global.ku_choose_color") === 0 &&
    country.variable("global.ku_remaining") > 0
  ) {
    country.run(drawOne);
    if (country.variable("global.ku_dealing") > 0) {
      country.subtractVariable("global.ku_dealing", 1);
      country.subtractVariable("ku_deal_remaining", 1);
      if (country.variable("ku_deal_remaining") === 0) country.run(advance);
    } else {
      if (country.variable("global.ku_pending") > 0) {
        country.setVariable("global.ku_penalty_started", 1);
        country.subtractVariable("global.ku_pending", 1);
        if (country.variable("global.ku_pending") === 0) {
          country.setVariable("global.ku_penalty_started", 0);
          country.run(advance);
        }
      } else country.run(advance);
    }
    country.run(updateDisplay);
  }
});

function play(country: CountryScope, card: Card): void {
  if (canPlay(country, card)) {
    country.effects.remove_from_array({ array: "ku_hand", value: card.id });
    country.setVariable("global.ku_top", card.id);
    country.setVariable("global.ku_rank", card.rank);
    country.setVariable("global.ku_color", card.color);
    if (card.rank === 10) country.effects.sound_effect("ku_skip");
    if (card.rank === 11) {
      country.multiplyVariable("global.ku_direction", -1);
      country.effects.sound_effect("ku_reverse");
    }
    if (card.rank === 12) {
      country.addVariable("global.ku_pending", 2);
      country.effects.sound_effect("ku_plus_two");
    }
    if (card.rank === 14) {
      if (country.variable("global.ku_choose_color") === 1)
        country.setVariable("global.ku_pending", 4);
      else country.addVariable("global.ku_pending", 4);
      country.effects.sound_effect("ku_plus_four");
    }
    country.effects.sound_effect("ku_place");
    if (
      card.rank < 10 &&
      country.variable("global.ku_dealing") <= 0 &&
      country.variable("ku_hand^num") === 1
    )
      country.effects.sound_effect("ku_uno");
    if (card.color === 0) country.setVariable("global.ku_choose_color", 1);
    else {
      country.run(advance);
      if (card.rank === 10) {
        country.run(advance);
      }
    }
    if (country.variable("global.ku_dealing") <= 0 && country.variable("ku_hand^num") === 0) {
      country.effects.setCountryFlag("ku_winner");
      country.effects.save_global_event_target_as("ku_winner");
      country.everyCountry((player) => player.effects.countryEvent({ id: "uno.1" }));
    }
    country.run(updateDisplay);
  }
}
export const plays = cards.map((card) =>
  ScriptedEffect(`ku_play_${card.id}`, (country) => play(country, card)),
);

export function chooseColor(country: CountryScope, color: number): void {
  if (turn(country) && country.variable("global.ku_choose_color") === 1) {
    country.setVariable("global.ku_color", color);
    country.setVariable("global.ku_choose_color", 0);
    for (const choice of [
      { id: 1, name: "red" },
      { id: 2, name: "blue" },
      { id: 3, name: "yellow" },
      { id: 4, name: "green" },
    ])
      if (color === choice.id) country.effects.sound_effect(`ku_${choice.name}`);
    country.run(advance);
    country.run(updateDisplay);
  }
}
export function assignSeat(country: CountryScope, seat: number): void {
  country.setVariable("ku_seat", seat);
  country.setVariable("ku_deal_remaining", 7);
  country.effects.setCountryFlag("ku_joined");
  country.effects.set_global_flag(`ku_seat_${seat}`);
  country.effects.save_global_event_target_as(`ku_p${seat}`);
  country.effects.save_global_event_target_as(`p_${seat}`);
  country.effects.setCountryFlag("ku_open");
  country.run(updateDisplay);
}
function initializeDeck(country: CountryScope): void {
  country.setVariable("global.ku_remaining", 108);
  for (const color of deckColors)
    country.setVariable(`global.num_of_${color.name}_cards`, color.id === 0 ? 8 : 25);
  for (const card of cards) country.setVariable(`global.ku_deck_${card.id}`, 1);
}
export const host = ScriptedEffect("ku_host", (country) => {
  if (!country.triggers.has_global_flag("ku_lobby")) {
    country.effects.set_global_flag("ku_lobby");
    country.effects.setCountryFlag("ku_host");
    country.setVariable("global.ku_turn", 1);
    initializeDeck(country);
    assignSeat(country, 1);
  }
});
export const fillAI = ScriptedEffect("ku_fill_ai", (country) => {
  if (
    country.triggers.hasCountryFlag("ku_host") &&
    !country.triggers.has_global_flag("ku_started")
  ) {
    country.effects.set_global_flag("ku_allow_ai");
    for (const seat of guestSeats) {
      if (!country.triggers.has_global_flag(`ku_seat_${seat}`)) {
        country.randomCountry(
          (player) => player.isAI && !player.triggers.hasCountryFlag("ku_joined"),
          (player) => assignSeat(player, seat),
        );
      }
    }
  }
});
export const removeAI = ScriptedEffect("ku_remove_ai", (country) => {
  if (
    country.triggers.hasCountryFlag("ku_host") &&
    !country.triggers.has_global_flag("ku_started")
  ) {
    country.effects.clr_global_flag("ku_allow_ai");
    for (const seat of guestSeats) {
      if (country.triggers.has_global_flag(`ku_seat_${seat}`)) {
        country.country(countryTarget(`event_target:ku_p${seat}`), (player) => {
          if (player.isAI) {
            player.effects.clearCountryFlag("ku_joined");
            player.effects.clearCountryFlag("ku_open");
            player.effects.clr_global_flag(`ku_seat_${seat}`);
            player.effects.clear_global_event_target(`ku_p${seat}`);
            player.effects.clear_global_event_target(`p_${seat}`);
            player.setVariable("ku_seat", 0);
            player.clearArray("ku_hand");
          }
        });
      }
    }
  }
});
export function ready(country: CountryScope): boolean {
  return (
    country.triggers.hasCountryFlag("ku_host") &&
    !country.triggers.has_global_flag("ku_started") &&
    country.triggers.has_global_flag("ku_seat_2") &&
    country.triggers.has_global_flag("ku_seat_3") &&
    country.triggers.has_global_flag("ku_seat_4") &&
    country.triggers.has_global_flag("ku_seat_5") &&
    country.triggers.has_global_flag("ku_seat_6")
  );
}
export const start = ScriptedEffect("ku_start", (country) => {
  if (ready(country)) {
    country.effects.set_global_flag("ku_started");
    country.setVariable("global.ku_turn", 1);
    country.setVariable("global.ku_direction", 1);
    country.setVariable("global.ku_pending", 0);
    country.setVariable("global.ku_penalty_started", 0);
    country.setVariable("global.ku_dealing", 42);
    country.setVariable("global.ku_choose_color", 0);
    country.setVariable("global.ku_top", 0);
    initializeDeck(country);
    for (const seat of seats) {
      country.country(countryTarget(`event_target:ku_p${seat}`), (player) => {
        player.clearArray("ku_hand");
        player.setVariable("ku_deal_remaining", 7);
        player.setVariable("seven_first_cards", 6);
        player.effects.clearCountryFlag("ku_winner");
      });
      country.setVariable(`global.p${seat}_num_of_cards`, 0);
    }
    country.randomChoice(
      cards
        .filter((card) => card.color !== 0)
        .map((card) => ({
          weight: country.variable(`global.ku_deck_${card.id}`),
          effects: (player: CountryScope) => {
            player.setVariable(`global.ku_deck_${card.id}`, 0);
            player.setVariable("global.ku_top", card.id);
            player.setVariable("global.ku_color", card.color);
            player.setVariable("global.ku_rank", card.rank);
            player.subtractVariable("global.ku_remaining", 1);
            for (const color of deckColors)
              if (color.id === card.color)
                player.subtractVariable(`global.num_of_${color.name}_cards`, 1);
          },
        })),
    );
    country.run(updateDisplay);
  }
});
export const reset = ScriptedEffect("ku_reset", (country) => {
  if (country.triggers.hasCountryFlag("ku_host")) {
    country.effects.clr_global_flag("ku_started");
    country.effects.clr_global_flag("ku_lobby");
    country.effects.clr_global_flag("ku_allow_ai");
    for (const name of [
      "turn",
      "direction",
      "pending",
      "penalty_started",
      "dealing",
      "choose_color",
      "top",
      "remaining",
      "rank",
      "color",
    ])
      country.clearVariable(`global.ku_${name}`);
    for (const card of cards) country.clearVariable(`global.ku_deck_${card.id}`);
    for (const seat of seats) {
      country.effects.clr_global_flag(`ku_seat_${seat}`);
      country.effects.clear_global_event_target(`ku_p${seat}`);
      country.effects.clear_global_event_target(`p_${seat}`);
      country.clearVariable(`global.p${seat}_num_of_cards`);
      country.clearVariable(`global.num_of_cards_to_draw_p${seat}`);
    }
    for (const color of deckColors) country.clearVariable(`global.num_of_${color.name}_cards`);
    country.clearVariable("global.num_of_all_cards");
    country.clearVariable("global.seven_cards");
    country.effects.clear_global_event_target("ku_winner");
    country.everyCountry((player) => {
      player.clearArray("ku_hand");
      player.clearVariable("ku_seat");
      player.clearVariable("ku_deal_remaining");
      player.clearVariable("seven_first_cards");
      for (const flag of ["ku_joined", "ku_host", "ku_winner"])
        player.effects.clearCountryFlag(flag);
    });
  }
});

export const gameOver = CountryEvent({
  id: "uno.1",
  title: "uno.1.t",
  description: "uno.1.d",
  picture: "GFX_UNO_event",
  isTriggeredOnly: true,
  timeoutDays: 5,
  options: [
    {
      name: "uno.1.a",
      effects: (country) =>
        country.everyCountry((player) => {
          if (player.triggers.hasCountryFlag("ku_host")) player.run(reset);
        }),
    },
  ],
});
