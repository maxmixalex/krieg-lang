import {
  Technology,
  Equipment,
  Unit,
  UnitHistory,
  BalanceOfPower,
  Ideology,
  AutonomyState,
  IntelligenceAgency,
  IntelligenceAgencyUpgrade,
  Operation,
  OperationPhase,
  OperationToken,
  MilitaryIndustrialOrganization,
  SpecialProject,
  Raid,
  RaidCategory,
  AiStrategyPlan,
  Bookmark,
  CountryEvent,
  DecisionCategory,
  cwt,
  type CountryScope,
  type StateScope,
  type RaidScope,
  type OperationScope,
  type MilitaryIndustrialOrganizationScope,
} from "krieg-lang/hoi4";
import * as pdx from "krieg-lang/pdx";
import { countries } from "@project/countries";
import { states } from "@project/states";

// Research, production and a deployable engineering unit form one development chain.
export const tools = Equipment({
  id: "civ_field_tools",
  archetype: "infantry_equipment",
  parent: "infantry_equipment_0",
  year: 1936,
  active: false,
  reliability: 0.85,
  softAttack: 4,
  defense: 18,
  buildCostIc: 0.45,
});
export const engineers = Unit({
  id: "civ_island_engineers",
  abbreviation: "ENG",
  sprite: "infantry",
  mapIconCategory: "infantry",
  group: "infantry",
  type: ["infantry"],
  categories: ["category_front_line", "category_army"],
  active: false,
  need: { infantry_equipment: 80 },
  manpower: 800,
  maxStrength: 20,
  maxOrganisation: 55,
  defaultMorale: 0.3,
  combatWidth: 2,
  priority: 550,
  trainingTime: 60,
  supplyConsumption: 0.05,
});
export const workshops = Technology({
  id: "civ_workshop_methods",
  researchCost: 0.35,
  startYear: 1936,
  allow: (country: CountryScope) => country.triggers.tag(countries.KRG),
  categories: ["industry"],
  folder: [{ name: "industry_folder", position: { x: 1, y: 7 } }],
  enableEquipments: [{ values: [tools.id] }],
  enableSubunits: [{ values: [engineers.id] }],
  onResearchComplete: (country: CountryScope) => {
    country.effects.setCountryFlag("civ_methods_ready");
    country.effects.add_equipment_to_stockpile({ type: tools.id, amount: 100 });
  },
});
export const engineeringOrder = UnitHistory({
  id: "civ_engineers",
  outputPath: "history/units/civ_engineers.txt",
  divisionTemplate: [
    {
      name: "Island Engineering Group",
      regiments: { civ_island_engineers: { x: 0, y: 0 }, infantry: { x: 1, y: 0 } },
    },
  ],
  units: {
    division: [
      {
        name: "Island Engineering Group",
        location: 3838,
        divisionTemplate: "Island Engineering Group",
        startExperienceFactor: 0.1,
        startEquipmentFactor: 1,
      },
    ],
  },
});

// National politics: a real balance, an optional ideology and a voluntary treaty status.
export const assemblyBalance = BalanceOfPower({
  id: "civ_assembly_balance",
  initialValue: 0,
  leftSide: "civ_councils",
  rightSide: "civ_workshops_side",
  decisionCategory: "civ_development",
  range: [
    {
      id: "civ_balanced",
      min: -0.1,
      max: 0.1,
      modifier: { entries: { political_power_gain: 0.05 } },
    },
  ],
  side: [
    {
      id: "civ_councils",
      icon: "GFX_civ_focus",
      range: [
        {
          id: "civ_council_majority",
          min: -1,
          max: -0.1,
          modifier: { entries: { stability_factor: 0.03 } },
        },
      ],
    },
    {
      id: "civ_workshops_side",
      icon: "GFX_civ_focus",
      range: [
        {
          id: "civ_workshop_majority",
          min: 0.1,
          max: 1,
          modifier: { entries: { production_speed_buildings_factor: 0.03 } },
        },
      ],
    },
  ],
});
export const cooperativePolitics = Ideology({
  id: "civ_cooperative",
  types: { civ_cooperativism: {} },
  color: [40, 140, 125],
  aiDemocratic: true,
  rules: {
    canForceGovernment: false,
    canPuppet: false,
    canCreateFactions: true,
    canJoinFactions: true,
    canGuaranteeOtherIdeologies: true,
    canSendVolunteers: false,
  },
  modifiers: { entries: { political_power_gain: 0.02 } },
  canBeBoosted: true,
});
export const treatyStatus = AutonomyState({
  id: "civ_treaty_associate",
  isPuppet: true,
  useOverlordColor: false,
  minFreedomLevel: 0.75,
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRG),
  allowedLevelsFilter: ["autonomy_free"],
  manpowerInfluence: 0.1,
  rule: { canBeCalledToWar: true, canCreateFactions: false, canJoinFactions: false },
  aiSubjectWantsHigher: { factor: 0 },
  aiOverlordWantsLower: { factor: 0 },
  modifier: { entries: { political_power_gain: 0.05 } },
});
export function initialiseDevelopment(country: CountryScope): void {
  country.effects.set_power_balance({ id: assemblyBalance.id, set_value: 0 });
}
export function researchMethods(country: CountryScope): void {
  country.effects.set_technology(cwt([pdx.property("civ_workshop_methods", pdx.atom("1"))]));
  country.effects.add_equipment_to_stockpile({ type: tools.id, amount: 100 });
  country.effects.load_oob("civ_engineers");
  country.effects.add_power_balance_value({ id: assemblyBalance.id, value: 0.15 });
}

// Optional DLC systems are explicitly gated while the core programme remains available.
// This adds one country-specific name/logo option to the base agency list.
export const agency = IntelligenceAgency({
  id: "civ_coastal_service",
  names: ["civ_coastal_service"],
  picture: "GFX_civ_focus",
  default: (country: CountryScope) => country.triggers.tag(countries.KRG),
  available: (country: CountryScope) =>
    country.triggers.tag(countries.KRG) && country.triggers.has_dlc("La Resistance"),
});
export const agencyTraining = IntelligenceAgencyUpgrade({
  branch: "branch_intelligence",
  id: "civ_harbour_contacts",
  picture: "GFX_civ_focus",
  available: (country: CountryScope) => country.triggers.tag(countries.KRG),
  level: [
    {
      modifier: { entries: { civilian_intel_factor: 0.05 } },
      completeEffect: (country: CountryScope) =>
        country.effects.setCountryFlag("civ_contacts_ready"),
    },
  ],
});
export const surveyPhase = OperationPhase({
  id: "civ_survey_phase",
  name: "civ_survey_phase",
  desc: "civ_survey_phase_desc",
  icon: "GFX_civ_focus",
  picture: "GFX_civ_panel",
  outcome: "civ_survey_success",
  returnOnComplete: true,
  equipment: { entries: { infantry_equipment: 10 } },
});
export const surveyToken = OperationToken({
  id: "civ_harbour_charts",
  name: "civ_harbour_charts",
  desc: "civ_harbour_charts_desc",
  icon: "GFX_civ_focus",
  textIcon: "GFX_civ_focus",
  intelSource: "navy",
  intelGain: 5,
});
export const survey = Operation({
  id: "civ_coastal_survey",
  name: "civ_coastal_survey",
  desc: "civ_coastal_survey_desc",
  icon: "GFX_civ_focus",
  mapIcon: "GFX_civ_focus",
  days: 30,
  operatives: 1,
  networkStrength: 10,
  riskChance: 0.05,
  awardedTokens: [surveyToken.id],
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRG),
  available: (country: CountryScope) => country.triggers.hasCountryFlag("civ_invested"),
  phases: [{ civ_survey_phase: { base: 1 } }],
  outcomeExecute: (operation: OperationScope) =>
    operation.country(countries.KRG, (country: CountryScope) =>
      country.effects.addPoliticalPower(10),
    ),
  returnOnComplete: true,
});
export const designCooperative = MilitaryIndustrialOrganization({
  id: "civ_design_cooperative",
  name: "civ_design_cooperative",
  icon: "GFX_civ_focus",
  include: "generic_infantry_equipment_organization",
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRG),
  available: (mio: MilitaryIndustrialOrganizationScope) =>
    mio.triggers.has_dlc("Arms Against Tyranny"),
  researchBonus: 0.05,
  onTechResearchCompleted: (mio: MilitaryIndustrialOrganizationScope) =>
    mio.effects.add_mio_funds(5),
});
export const beacon = SpecialProject({
  id: "civ_coastal_beacon",
  specialization: "specialization_air",
  icon: "GFX_civ_focus",
  narrative: { name: "civ_coastal_beacon", desc: "civ_coastal_beacon_desc" },
  allowed: { tag: ["KRG"], hasDlc: ["Gotterdammerung"] },
  breakthroughCost: { specialization_air: 1 },
  prototypeTime: 30,
  complexity: 1,
  resourceCost: { resources: { steel: 1 } },
  projectOutput: {
    countryEffects: (country: CountryScope) => {
      country.effects.addStability(0.02);
      country.effects.setCountryFlag("civ_beacon_ready");
    },
    facilityStateEffects: (island: StateScope) => island.effects.addManpower(100),
  },
});
export const reconnaissance = RaidCategory({
  id: "civ_coastal_recon",
  intelSource: "naval",
  visible: (country: CountryScope) => country.triggers.tag(countries.KRG),
  available: (country: CountryScope) => country.triggers.has_dlc("Gotterdammerung"),
});
export const coastalPatrol = Raid({
  id: "civ_coastal_patrol",
  category: reconnaissance.id,
  arrow: { type: "naval" },
  showTarget: (country: CountryScope) => country.triggers.has_war(true),
  successFactors: { success: { base: 0.65 }, critical: { base: 0.1 }, disaster: { base: 0.05 } },
  commandPower: 5,
  daysToPrepare: 10,
  unitIcon: "GFX_civ_focus",
  targetIcon: "GFX_civ_focus",
  targetLocKey: "civ_patrol_target",
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRG),
  available: (country: CountryScope) => country.triggers.has_war(true),
  targetType: { state: [(island: StateScope) => island.triggers.is_coastal(true)] },
  startingPoint: { types: ["naval_base"] },
  essentialEquipment: { entries: { infantry_equipment: 20 } },
  successLevels: {
    failure: {
      outcomeDescription: "civ_patrol_failure",
      actorEffects: {
        effects: (raid: RaidScope) =>
          raid.country(countries.KRG, (country: CountryScope) =>
            country.effects.addPoliticalPower(-1),
          ),
      },
    },
    limitedSuccess: {
      outcomeDescription: "civ_patrol_limited",
      actorEffects: {
        effects: (raid: RaidScope) =>
          raid.country(countries.KRG, (country: CountryScope) =>
            country.effects.addPoliticalPower(2),
          ),
      },
    },
    criticalSuccess: {
      outcomeDescription: "civ_patrol_critical",
      actorEffects: {
        effects: (raid: RaidScope) =>
          raid.country(countries.KRG, (country: CountryScope) =>
            country.effects.addPoliticalPower(10),
          ),
      },
    },
    success: {
      outcomeDescription: "civ_patrol_success",
      actorEffects: {
        effects: (raid: RaidScope) =>
          raid.country(countries.KRG, (country: CountryScope) =>
            country.effects.addPoliticalPower(5),
          ),
      },
    },
  },
});

export const aiPlan = AiStrategyPlan({
  id: "civ_civic_plan",
  name: "civ_civic_plan",
  desc: "civ_civic_plan_desc",
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRG),
  enable: (country: CountryScope) => country.triggers.tag(countries.KRG),
  aiNationalFocuses: ["civ_charter", "civ_harbour", "civ_bonds", "civ_cooperation"],
  research: { industry: 1.5 },
  weight: { base: 1 },
});
export const bookmark = Bookmark({
  id: "civ_island_start",
  name: "civ_island_start",
  desc: "civ_island_start_desc",
  date: "1936.1.1.12",
  picture: "GFX_civ_panel",
  defaultCountry: "KRG",
  default: false,
  effect: { randomizeWeather: 12345 },
  entries: {
    KRG: { history: "civ_island_history", ideology: "democratic", focuses: ["civ_charter"] },
  },
});
export const treaty = CountryEvent({
  id: "civ_congress.3",
  title: "civ_congress.3.t",
  description: "civ_congress.3.d",
  isTriggeredOnly: true,
  options: [
    {
      name: "civ_congress.3.a",
      effects: (country: CountryScope) =>
        country.country(countries.FRA, (parent: CountryScope) =>
          parent.effects.set_autonomy({
            target: countries.KRG,
            autonomy_state: treatyStatus.id,
            freedom_level: 0.9,
          }),
        ),
    },
    {
      name: "civ_congress.3.b",
      effects: (country: CountryScope) => country.effects.addStability(0.01),
    },
  ],
});
export const development = DecisionCategory({
  id: "civ_development",
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRG),
  decisions: [
    {
      id: "civ_train_engineers",
      cost: 35,
      available: (country: CountryScope) => country.triggers.hasCountryFlag("civ_invested"),
      visible: (country: CountryScope) =>
        !country.triggers.hasCountryFlag("civ_engineers_deployed"),
      completeEffect: (country: CountryScope) => {
        researchMethods(country);
        country.effects.setCountryFlag("civ_engineers_deployed");
      },
    },
    {
      id: "civ_cooperative_vote",
      cost: 10,
      visible: (country: CountryScope) =>
        !country.triggers.hasCountryFlag("civ_cooperative_vote_done"),
      completeEffect: (country: CountryScope) => {
        country.effects.set_politics({
          ruling_party: cooperativePolitics.id,
          elections_allowed: true,
        });
        country.effects.set_popularities(cwt([pdx.property("civ_cooperative", pdx.atom("100"))]));
        country.effects.setCountryFlag("civ_cooperative_vote_done");
      },
    },
    {
      id: "civ_treaty_talks",
      cost: 10,
      completeEffect: (country: CountryScope) =>
        country.effects.countryEvent({ id: treaty.id, days: 1 }),
    },
    {
      id: "civ_establish_service",
      cost: 20,
      visible: (country: CountryScope) => country.triggers.has_dlc("La Resistance"),
      available: (country: CountryScope) => !country.triggers.hasCountryFlag("civ_service_created"),
      completeEffect: (country: CountryScope) => {
        country.effects.create_intelligence_agency({
          name: "civ_coastal_service",
          icon: "GFX_civ_focus",
        });
        country.effects.setCountryFlag("civ_service_created");
      },
    },
    {
      id: "civ_demonstrate_beacon",
      cost: 50,
      visible: (country: CountryScope) => country.triggers.has_dlc("Gotterdammerung"),
      available: (country: CountryScope) => !country.triggers.hasCountryFlag("civ_beacon_ready"),
      completeEffect: (country: CountryScope) =>
        country.effects.complete_special_project({ project: beacon.id, state: states[1] }),
    },
  ],
});
