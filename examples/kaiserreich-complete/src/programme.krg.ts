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
import { credit, ready, refund } from "@krieg-examples/srd-civic-kit";

export const civicSpirit = Idea({
  id: "srd_civic_spirit",
  picture: "srd_civic_spirit",
  modifier: { political_power_gain: 0.1, production_speed_buildings_factor: 0.05 },
});
export const executeBond = ScriptedEffect("srd_redeem_bond", (country: CountryScope) => {
  MetaEffect(country, {
    text: "add_political_power = [AMOUNT]",
    parameters: { AMOUNT: "[?srd_bond_value|.0]" },
    debug: false,
  });
  country.effects.addToVariable({ var: "srd_gui_dirty", value: 1 });
});
export const successfulInvestment = ScriptedEffect(
  "srd_complete_investment",
  (country: CountryScope) => {
    country.effects.setCountryFlag("srd_invested");
    country.effects.addIdeas(civicSpirit.id);
    country.effects.add_dynamic_modifier({ modifier: "srd_workshops" });
    credit(country, 10);
    country.state(states[114], (island: StateScope) => {
      island.effects.addManpower(1500);
      island.effects.setStateFlag("srd_harbour_ready");
    });
    country.effects.build_railway({ level: 1, path: [11773, 9863, 9772] });
  },
);
export const report = CountryEvent({
  id: "srd_congress.1",
  title: "srd_congress.1.t",
  description: "srd_congress.1.d",
  isTriggeredOnly: true,
  fireOnlyOnce: true,
  options: [
    {
      name: "srd_congress.1.a",
      aiChance: 80,
      effects: (country: CountryScope) => country.run(successfulInvestment),
    },
    {
      name: "srd_congress.1.b",
      aiChance: 20,
      effects: (country: CountryScope) => country.run(refund),
    },
  ],
});
export const partnerVisit = CountryEvent({
  id: "srd_congress.2",
  title: "srd_congress.2.t",
  description: "srd_congress.2.d",
  isTriggeredOnly: true,
  options: [
    {
      name: "srd_congress.2.a",
      effects: (country: CountryScope) => {
        country.effects.add_opinion_modifier({
          target: countries.NFA,
          modifier: "srd_trade_partners",
          days: 180,
        });
        country.effects.addWarSupport(0.02);
      },
    },
  ],
});
export const relations = OpinionModifier({ id: "srd_trade_partners", value: 20, decay: 1 });
export const decisions = DecisionCategory({
  id: "srd_assembly",
  icon: "srd_assembly",
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRL),
  decisions: [
    {
      id: "srd_invest",
      cost: 25,
      available: (country: CountryScope) => country.test(ready),
      visible: (country: CountryScope) => !country.triggers.hasCountryFlag("srd_invested"),
      completeEffect: (country: CountryScope) => country.schedule(report, { days: 1 }),
    },
    {
      id: "srd_delegation",
      cost: 15,
      daysReEnable: 30,
      available: (country: CountryScope) => country.triggers.hasCountryFlag("srd_invested"),
      completeEffect: (country: CountryScope) => country.schedule(partnerVisit, { days: 2 }),
    },
  ],
});
export const focusTree = FocusGraph({
  id: "srd_island_tree",
  prefix: "srd",
  country: (country: CountryScope) => country.triggers.tag(countries.KRL),
  nodes: {
    charter: {
      icon: "GFX_srd_focus",
      position: { x: 1, y: 0 },
      cost: 3,
      completionReward: (country: CountryScope) => country.effects.addStability(0.05),
    },
    harbour: {
      icon: "GFX_srd_focus",
      position: { x: 0, y: 1 },
      cost: 5,
      completionReward: (country: CountryScope) => country.schedule(report, { days: 1 }),
    },
    bonds: {
      icon: "GFX_srd_focus",
      position: { x: 2, y: 1 },
      cost: 5,
      completionReward: (country: CountryScope) => {
        country.effects.setCountryFlag("srd_bonds_unlocked");
        country.run(executeBond);
      },
    },
    cooperation: {
      icon: "GFX_srd_focus",
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
export const status = ScriptedLocalisation("Get_srd_ProjectStatus", {
  scope: "country",
  texts: [
    {
      trigger: (country: CountryScope) => country.triggers.hasCountryFlag("srd_invested"),
      localisationKey: "srd_status_complete",
    },
    { localisationKey: "srd_status_pending" },
  ],
});

// Native database constructors connect a variable-backed modifier and scoped on-action.
export const workshops = DynamicModifier({
  id: "srd_workshops",
  enable: (country: CountryScope) => country.triggers.hasCountryFlag("srd_invested"),
  entries: { industrial_capacity_factory: "srd_workshop_bonus" },
});
export const introduction = CountryEvent({
  id: "srd_congress.0",
  title: "srd_congress.0.t",
  description: "srd_congress.0.d",
  isTriggeredOnly: true,
  fireOnlyOnce: true,
  options: [
    {
      name: "srd_congress.0.a",
      effects: (country: CountryScope) => country.effects.addPoliticalPower(5),
    },
  ],
});
export const startup = OnAction({
  id: "on_startup",
  outputPath: "common/on_actions/srd_startup.txt",
  effect: [
    (world: AnyScope) =>
      world.country(countries.KRL, (country: CountryScope) =>
        country.schedule(introduction, { days: 2 }),
      ),
  ],
});
