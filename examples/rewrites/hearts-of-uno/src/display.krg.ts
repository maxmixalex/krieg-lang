import { ScriptedEffect } from "krieg-lang/hoi4";
import { colors, seats } from "./cards.krg.ts";

/** Presentation counters preserve the original ten-language text contracts. */
export const updateDisplay = ScriptedEffect("ku_update_display", (country) => {
  country.setVariable("global.num_of_all_cards", country.variable("global.ku_remaining"));
  country.setVariable("global.seven_cards", country.variable("global.ku_dealing"));
  country.setVariable("seven_first_cards", 0);
  if (country.variable("ku_deal_remaining") > 0)
    country.setVariable("seven_first_cards", country.variable("ku_deal_remaining") - 1);
  country.setTempVariable("ku_penalty_seat", country.variable("global.ku_turn"));
  if (country.variable("global.ku_choose_color") === 1) {
    country.addTempVariable("ku_penalty_seat", country.variable("global.ku_direction"));
    if (country.variable("ku_penalty_seat") > 6) country.setTempVariable("ku_penalty_seat", 1);
    if (country.variable("ku_penalty_seat") < 1) country.setTempVariable("ku_penalty_seat", 6);
  }
  for (const seat of seats) {
    if (country.variable("ku_seat") === seat)
      country.setVariable(`global.p${seat}_num_of_cards`, country.variable("ku_hand^num"));
    country.setVariable(`global.num_of_cards_to_draw_p${seat}`, 0);
    if (country.variable("ku_penalty_seat") === seat)
      country.setVariable(
        `global.num_of_cards_to_draw_p${seat}`,
        country.variable("global.ku_pending"),
      );
  }
});

export const deckColors = [...colors, { name: "wild", id: 0 }];
