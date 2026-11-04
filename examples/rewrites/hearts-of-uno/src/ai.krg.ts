import { type CountryScope, type GuiAiWeight } from "krieg-lang/hoi4";
import { cards, colors, type Card } from "./cards.krg.ts";

function holdsColor(country: CountryScope, color: number): boolean {
  return cards.some((card) => card.color === color && country.arrayContains("ku_hand", card.id));
}

/** Keep the original distinct preferences for ordinary, wild and draw-four cards. */
export function cardWeight(card: Card): GuiAiWeight<CountryScope> {
  if (card.rank === 13)
    return {
      aiWillDo: {
        base: 1,
        modifiers: [
          {
            factor: 50000,
            trigger: (country) =>
              country.variable("global.ku_dealing") <= 0 &&
              colors.some(
                (color) =>
                  country.variable("global.ku_color") === color.id &&
                  !holdsColor(country, color.id),
              ),
          },
        ],
      },
    };
  if (card.rank === 14)
    return {
      aiWillDo: {
        base: 1,
        modifiers: [
          {
            factor: 999999,
            trigger: (country) =>
              country.variable("global.ku_dealing") <= 0 &&
              (country.variable("global.ku_rank") === 12 ||
                country.variable("global.ku_rank") === 14),
          },
          {
            factor: 10,
            trigger: (country) =>
              country.variable("global.ku_dealing") <= 0 &&
              colors.some((color) => country.variable("global.ku_color") === color.id),
          },
        ],
      },
    };
  return {
    aiWillDo: {
      base: 1,
      modifiers: [
        {
          factor: 10000,
          trigger: (country) =>
            country.variable("global.ku_dealing") <= 0 &&
            (country.variable("global.ku_color") === card.color ||
              country.variable("global.ku_rank") === card.rank),
        },
      ],
    },
  };
}

export function colorWeight(color: number): GuiAiWeight<CountryScope> {
  return {
    aiWillDo: {
      base: 10,
      modifiers: [{ factor: 10000, trigger: (country) => holdsColor(country, color) }],
    },
  };
}

export const deckWeight: GuiAiWeight<CountryScope> = { aiWillDo: { base: 1000 } };
