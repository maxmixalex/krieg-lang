import { DecisionCategory } from "krieg-lang/hoi4";
import { guestSeats } from "./cards.krg.ts";
import { host, start, ready, assignSeat, fillAI, removeAI, reset, reshuffle } from "./game.krg.ts";

export const lobby = DecisionCategory({
  id: "UNO_decisions",
  icon: "GFX_UNO_big",
  priority: 100000,
  decisions: [
    {
      id: "UNO_on",
      priority: 1000000,
      icon: "GFX_UNO_small",
      visible: (country) => !country.triggers.hasCountryFlag("ku_open"),
      completeEffect: (country) => {
        country.effects.custom_effect_tooltip("UNO_ON_TT");
        country.effects.setCountryFlag("ku_open");
      },
    },
    {
      id: "UNO_off",
      priority: 1000000,
      icon: "GFX_UNO_small",
      visible: (country) => country.triggers.hasCountryFlag("ku_open"),
      completeEffect: (country) => {
        country.effects.custom_effect_tooltip("UNO_OFF_TT");
        country.effects.clearCountryFlag("ku_open");
      },
    },
    {
      id: "UNO_host_the_game",
      priority: 100001,
      icon: "GFX_UNO_small",
      available: (country) =>
        !country.isAI &&
        country.triggers.hasCountryFlag("ku_open") &&
        !country.triggers.hasCountryFlag("ku_joined") &&
        !country.triggers.has_global_flag("ku_lobby"),
      completeEffect: (country) => country.run(host),
    },
    ...guestSeats.map((seat) => ({
      id: `UNO_join_game${seat}`,
      priority: 1000000,
      icon: "GFX_UNO_small",
      visible: (country: import("krieg-lang/hoi4").CountryScope) =>
        !country.triggers.has_global_flag(`ku_seat_${seat}`) &&
        !country.triggers.hasCountryFlag("ku_joined"),
      available: (country: import("krieg-lang/hoi4").CountryScope) =>
        country.triggers.has_global_flag("ku_lobby") &&
        !country.triggers.has_global_flag("ku_started") &&
        !country.triggers.hasCountryFlag("ku_joined") &&
        !country.triggers.has_global_flag(`ku_seat_${seat}`),
      completeEffect: (country: import("krieg-lang/hoi4").CountryScope) => {
        if (
          country.triggers.has_global_flag("ku_lobby") &&
          !country.triggers.has_global_flag("ku_started") &&
          !country.triggers.hasCountryFlag("ku_joined") &&
          !country.triggers.has_global_flag(`ku_seat_${seat}`)
        )
          assignSeat(country, seat);
      },
    })),
    {
      id: "UNO_start_the_game",
      priority: 100000,
      icon: "GFX_UNO_small",
      available: ready,
      completeEffect: (country) => {
        country.effects.custom_effect_tooltip("UNO_GAME_START_TT");
        country.hiddenEffect((hidden) => hidden.run(start));
      },
    },
    {
      id: "UNO_ai_can_join",
      priority: 99000,
      icon: "GFX_UNO_small",
      visible: (country) => !country.triggers.has_global_flag("ku_allow_ai"),
      available: (country) =>
        country.triggers.hasCountryFlag("ku_host") &&
        !country.triggers.has_global_flag("ku_started"),
      completeEffect: (country) => {
        country.effects.custom_effect_tooltip("AI_JOIN_TOOLTIP");
        country.hiddenEffect((hidden) => hidden.run(fillAI));
      },
    },
    {
      id: "UNO_ai_cannot_join",
      priority: 99000,
      icon: "GFX_UNO_small",
      visible: (country) => country.triggers.has_global_flag("ku_allow_ai"),
      available: (country) =>
        country.triggers.hasCountryFlag("ku_host") &&
        !country.triggers.has_global_flag("ku_started"),
      completeEffect: (country) => {
        country.effects.custom_effect_tooltip("AI_CANNOT_JOIN_TT");
        country.hiddenEffect((hidden) => hidden.run(removeAI));
      },
    },
    {
      id: "UNO_reshuffle_the_deck",
      priority: 98500,
      icon: "GFX_UNO_small",
      available: (country) =>
        country.triggers.has_global_flag("ku_started") &&
        country.variable("global.ku_remaining") === 0,
      completeEffect: (country) => {
        country.effects.custom_effect_tooltip("NUM_OF_CARDS_LEFT");
        if (
          country.triggers.has_global_flag("ku_started") &&
          country.variable("global.ku_remaining") === 0
        )
          country.run(reshuffle);
      },
    },
    {
      id: "UNO_complete_game_reset",
      priority: 0,
      icon: "GFX_UNO_small",
      available: (country) => country.triggers.hasCountryFlag("ku_host"),
      completeEffect: (country) => {
        country.effects.custom_effect_tooltip("COMPLETE_RESET_TT");
        country.hiddenEffect((hidden) => hidden.run(reset));
      },
    },
  ],
});
