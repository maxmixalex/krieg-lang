import { CountryEvent } from "krieg-lang/hoi4";
import { canSetPosition, setPosition } from "./positions.krg.js";

export const selectMedium = CountryEvent({
  id: "family_positions.1",
  hidden: true,
  isTriggeredOnly: true,
  immediate: (country) => {
    if (country.test(canSetPosition.medium)) country.run(setPosition.medium);
  },
});

export const restoreMedium = CountryEvent({
  id: "family_positions.2",
  hidden: true,
  isTriggeredOnly: true,
  immediate: (country) => {
    if (country.test(canSetPosition.medium)) country.run(setPosition.medium);
  },
});
