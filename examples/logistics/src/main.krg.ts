import {
  CountryEvent,
  DecisionCategory,
  FocusTree,
  Idea,
  ScriptedEffect,
  ScriptedTrigger,
  type CountryScope,
} from "krieg-lang/hoi4";
import { countries } from "@project/countries";
import { awardPlanningBonus } from "./helpers.krg.ts";

// A module can export reusable helpers and several game resources together.
export const planning = Idea({
  id: "krieg_planning",
  modifier: { production_speed_buildings_factor: 0.05 },
});

export const planningReward = ScriptedEffect("krieg_planning_reward", (country: CountryScope) => {
  awardPlanningBonus(country, 25);
  country.effects.addIdeas(planning.id);
});

export const planningReady = ScriptedTrigger(
  "krieg_planning_ready",
  (country: CountryScope) =>
    country.politicalPower >= 50 && !country.triggers.hasCountryFlag("krieg_planning_rewarded"),
);

export const report = CountryEvent({
  id: "krieg_logistics.1",
  title: "krieg_logistics.1.t",
  description: "krieg_logistics.1.d",
  isTriggeredOnly: true,
  options: [
    {
      name: "krieg_logistics.1.a",
      effects: (country: CountryScope) => awardPlanningBonus(country, 10),
    },
    {
      name: "krieg_logistics.1.b",
      effects: (country: CountryScope) => country.effects.addWarSupport(0.02),
    },
  ],
});

export const decisions = DecisionCategory({
  id: "krieg_logistics_category",
  decisions: [
    {
      id: "krieg_logistics_begin",
      cost: 50,
      available: (country: CountryScope) => country.stability >= 0.3 && country.test(planningReady),
      visible: (country: CountryScope) =>
        !country.triggers.hasCountryFlag("krieg_planning_rewarded"),
      completeEffect: (country: CountryScope) => {
        country.effects.countryEvent({ id: report.id, days: 1 });
      },
    },
  ],
});

export const focusTree = FocusTree({
  id: "krieg_logistics_tree",
  country: (country: CountryScope) => country.triggers.tag(countries.GER),
  focuses: [
    {
      id: "krieg_logistics_prepare",
      icon: "GFX_goal_generic_production",
      x: 0,
      y: 0,
      cost: 5,
      completionReward: (country: CountryScope) => {
        country.effects.addIdeas(planning.id);
      },
    },
    {
      id: "krieg_logistics_infrastructure",
      icon: "GFX_goal_generic_construct_infrastructure",
      x: 0,
      y: 1,
      cost: 5,
      prerequisites: [["krieg_logistics_prepare"]],
      completionReward: (country: CountryScope) => country.run(planningReward),
    },
  ],
});
