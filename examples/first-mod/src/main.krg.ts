import {
  CountryEvent,
  DecisionCategory,
  type CountryScope,
} from "krieg-lang/hoi4";

function celebrate(country: CountryScope, amount: number): void {
  country.effects.addStability(amount);
  country.effects.setCountryFlag("krieg_demo_complete");
}

export default [
  CountryEvent({
    id: "krieg_demo.1",
    title: "krieg_demo.1.t",
    description: "krieg_demo.1.d",
    isTriggeredOnly: true,
    options: [
      {
        name: "krieg_demo.1.a",
        effects: (country: CountryScope) => celebrate(country, 0.05),
      },
    ],
  }),
  DecisionCategory({
    id: "krieg_demo_category",
    decisions: [
      {
        id: "krieg_demo_begin",
        cost: 25,
        visible: (country: CountryScope) =>
          !country.triggers.hasCountryFlag("krieg_demo_complete"),
        completeEffect: (country: CountryScope) => {
          country.effects.countryEvent({ id: "krieg_demo.1", days: 1 });
        },
      },
    ],
  }),
];
