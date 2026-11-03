import {
  CountryEvent,
  DecisionCategory,
  FocusGraph,
  Idea,
  ScriptedEffect,
  ScriptedLocalisation,
  MetaEffect,
  OpinionModifier,
  DynamicModifier,
  OnAction,
  type AnyScope,
  type CountryScope,
  type StateScope,
} from "krieg-lang/hoi4";
import { countries } from "@project/countries";
import { states } from "@project/states";
import { credit, ready, refund } from "@krieg-examples/civ-civic-kit";

export const civicSpirit = Idea({
  id: "civ_civic_spirit",
  picture: "civ_civic_spirit",
  modifier: { political_power_gain: 0.1, production_speed_buildings_factor: 0.05 },
});
export const executeBond = ScriptedEffect("civ_redeem_bond", (country: CountryScope) => {
  MetaEffect(country, {
    text: "add_political_power = [AMOUNT]",
    parameters: { AMOUNT: "[?civ_bond_value|.0]" },
    debug: false,
  });
  country.effects.addToVariable({ var: "civ_gui_dirty", value: 1 });
});
export const successfulInvestment = ScriptedEffect(
  "civ_complete_investment",
  (country: CountryScope) => {
    country.effects.setCountryFlag("civ_invested");
    country.effects.addIdeas(civicSpirit.id);
    country.effects.add_dynamic_modifier({ modifier: "civ_workshops" });
    credit(country, 10);
    country.state(states[1], (island: StateScope) => {
      island.effects.addManpower(1500);
      island.effects.setStateFlag("civ_harbour_ready");
    });
    country.effects.build_railway({ level: 1, path: [3838, 9851] });
  },
);
export const report = CountryEvent({
  id: "civ_congress.1",
  title: "civ_congress.1.t",
  description: "civ_congress.1.d",
  isTriggeredOnly: true,
  fireOnlyOnce: true,
  options: [
    {
      name: "civ_congress.1.a",
      aiChance: 80,
      effects: (country: CountryScope) => country.run(successfulInvestment),
    },
    {
      name: "civ_congress.1.b",
      aiChance: 20,
      effects: (country: CountryScope) => country.run(refund),
    },
  ],
});
export const partnerVisit = CountryEvent({
  id: "civ_congress.2",
  title: "civ_congress.2.t",
  description: "civ_congress.2.d",
  isTriggeredOnly: true,
  options: [
    {
      name: "civ_congress.2.a",
      effects: (country: CountryScope) => {
        country.effects.add_opinion_modifier({
          target: countries.FRA,
          modifier: "civ_trade_partners",
          days: 180,
        });
        country.effects.addWarSupport(0.02);
      },
    },
  ],
});
export const relations = OpinionModifier({ id: "civ_trade_partners", value: 20, decay: 1 });
export const decisions = DecisionCategory({
  id: "civ_assembly",
  icon: "civ_assembly",
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRG),
  decisions: [
    {
      id: "civ_invest",
      cost: 25,
      available: (country: CountryScope) => country.test(ready),
      visible: (country: CountryScope) => !country.triggers.hasCountryFlag("civ_invested"),
      completeEffect: (country: CountryScope) => country.schedule(report, { days: 1 }),
    },
    {
      id: "civ_delegation",
      cost: 15,
      daysReEnable: 30,
      available: (country: CountryScope) => country.triggers.hasCountryFlag("civ_invested"),
      completeEffect: (country: CountryScope) => country.schedule(partnerVisit, { days: 2 }),
    },
  ],
});
export const focusTree = FocusGraph({
  id: "civ_island_tree",
  prefix: "civ",
  country: (country: CountryScope) => country.triggers.tag(countries.KRG),
  nodes: {
    charter: {
      icon: "GFX_civ_focus",
      position: { x: 1, y: 0 },
      cost: 3,
      completionReward: (country: CountryScope) => country.effects.addStability(0.05),
    },
    harbour: {
      icon: "GFX_civ_focus",
      position: { x: 0, y: 1 },
      cost: 5,
      completionReward: (country: CountryScope) => country.schedule(report, { days: 1 }),
    },
    bonds: {
      icon: "GFX_civ_focus",
      position: { x: 2, y: 1 },
      cost: 5,
      completionReward: (country: CountryScope) => {
        country.effects.setCountryFlag("civ_bonds_unlocked");
        country.run(executeBond);
      },
    },
    cooperation: {
      icon: "GFX_civ_focus",
      position: { x: 1, y: 2 },
      cost: 5,
      completionReward: (country: CountryScope) => country.schedule(partnerVisit, { days: 1 }),
    },
  },
  sequences: [
    ["charter", "harbour"],
    ["charter", "bonds"],
  ],
  joins: [{ to: "cooperation", all: ["harbour", "bonds"] }],
});
export const status = ScriptedLocalisation("Get_civ_ProjectStatus", {
  scope: "country",
  texts: [
    {
      trigger: (country: CountryScope) => country.triggers.hasCountryFlag("civ_invested"),
      localisationKey: "civ_status_complete",
    },
    { localisationKey: "civ_status_pending" },
  ],
});

// Native database constructors connect a variable-backed modifier and scoped on-action.
export const workshops = DynamicModifier({
  id: "civ_workshops",
  enable: (country: CountryScope) => country.triggers.hasCountryFlag("civ_invested"),
  entries: { industrial_capacity_factory: "civ_workshop_bonus" },
});
export const introduction = CountryEvent({
  id: "civ_congress.0",
  title: "civ_congress.0.t",
  description: "civ_congress.0.d",
  isTriggeredOnly: true,
  fireOnlyOnce: true,
  options: [
    {
      name: "civ_congress.0.a",
      effects: (country: CountryScope) => country.effects.addPoliticalPower(5),
    },
  ],
});
export const startup = OnAction({
  id: "on_startup",
  outputPath: "common/on_actions/civ_startup.txt",
  effect: [
    (world: AnyScope) =>
      world.country(countries.KRG, (country: CountryScope) =>
        country.schedule(introduction, { days: 2 }),
      ),
  ],
});
