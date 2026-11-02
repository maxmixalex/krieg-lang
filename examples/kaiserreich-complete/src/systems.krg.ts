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
  id: "srd_field_tools",
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
  id: "srd_island_engineers",
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
  id: "srd_workshop_methods",
  researchCost: 0.35,
  startYear: 1936,
  allow: (country: CountryScope) => country.triggers.tag(countries.KRL),
  categories: ["industry"],
  folder: [{ name: "industry_folder", position: { x: 1, y: 7 } }],
  enableEquipments: [{ values: [tools.id] }],
  enableSubunits: [{ values: [engineers.id] }],
  onResearchComplete: (country: CountryScope) => {
    country.effects.setCountryFlag("srd_methods_ready");
    country.effects.add_equipment_to_stockpile({ type: tools.id, amount: 100 });
  },
});
export const engineeringOrder = UnitHistory({
  id: "srd_engineers",
  outputPath: "history/units/srd_engineers.txt",
  divisionTemplate: [
    {
      name: "Island Engineering Group",
      regiments: { srd_island_engineers: { x: 0, y: 0 }, infantry: { x: 1, y: 0 } },
    },
  ],
  units: {
    division: [
      {
        name: "Island Engineering Group",
        location: 11773,
        divisionTemplate: "Island Engineering Group",
        startExperienceFactor: 0.1,
        startEquipmentFactor: 1,
      },
    ],
  },
});

// National politics: a real balance, an optional ideology and a voluntary treaty status.
export const assemblyBalance = BalanceOfPower({
  id: "srd_assembly_balance",
  initialValue: 0,
  leftSide: "srd_councils",
  rightSide: "srd_workshops_side",
  decisionCategory: "srd_development",
  range: [
    {
      id: "srd_balanced",
      min: -0.1,
      max: 0.1,
      modifier: { entries: { political_power_gain: 0.05 } },
    },
  ],
  side: [
    {
      id: "srd_councils",
      icon: "GFX_srd_focus",
      range: [
        {
          id: "srd_council_majority",
          min: -1,
          max: -0.1,
          modifier: { entries: { stability_factor: 0.03 } },
        },
      ],
    },
    {
      id: "srd_workshops_side",
      icon: "GFX_srd_focus",
      range: [
        {
          id: "srd_workshop_majority",
          min: 0.1,
          max: 1,
          modifier: { entries: { production_speed_buildings_factor: 0.03 } },
        },
      ],
    },
  ],
});
export const cooperativePolitics = Ideology({
  id: "srd_cooperative",
  types: { srd_cooperativism: {} },
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
  id: "srd_treaty_associate",
  isPuppet: true,
  useOverlordColor: false,
  minFreedomLevel: 0.75,
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRL),
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
  country.effects.set_technology(cwt([pdx.property("srd_workshop_methods", pdx.atom("1"))]));
  country.effects.add_equipment_to_stockpile({ type: tools.id, amount: 100 });
  country.effects.load_oob("srd_engineers");
  country.effects.add_power_balance_value({ id: assemblyBalance.id, value: 0.15 });
}

// Optional DLC systems are explicitly gated while the core programme remains available.
// This adds one country-specific name/logo option to the base agency list.
export const agency = IntelligenceAgency({
  id: "srd_coastal_service",
  names: ["srd_coastal_service"],
  picture: "GFX_srd_focus",
  default: (country: CountryScope) => country.triggers.tag(countries.KRL),
  available: (country: CountryScope) =>
    country.triggers.tag(countries.KRL) && country.triggers.has_dlc("La Resistance"),
});
export const agencyTraining = IntelligenceAgencyUpgrade({
  branch: "branch_intelligence",
  id: "srd_harbour_contacts",
  picture: "GFX_srd_focus",
  available: (country: CountryScope) => country.triggers.tag(countries.KRL),
  level: [
    {
      modifier: { entries: { civilian_intel_factor: 0.05 } },
      completeEffect: (country: CountryScope) =>
        country.effects.setCountryFlag("srd_contacts_ready"),
    },
  ],
});
export const surveyPhase = OperationPhase({
  id: "srd_survey_phase",
  name: "srd_survey_phase",
  desc: "srd_survey_phase_desc",
  icon: "GFX_srd_focus",
  picture: "GFX_srd_panel",
  outcome: "srd_survey_success",
  returnOnComplete: true,
  equipment: { entries: { infantry_equipment: 10 } },
});
export const surveyToken = OperationToken({
  id: "srd_harbour_charts",
  name: "srd_harbour_charts",
  desc: "srd_harbour_charts_desc",
  icon: "GFX_srd_focus",
  textIcon: "GFX_srd_focus",
  intelSource: "navy",
  intelGain: 5,
});
export const survey = Operation({
  id: "srd_coastal_survey",
  name: "srd_coastal_survey",
  desc: "srd_coastal_survey_desc",
  icon: "GFX_srd_focus",
  mapIcon: "GFX_srd_focus",
  days: 30,
  operatives: 1,
  networkStrength: 10,
  riskChance: 0.05,
  awardedTokens: [surveyToken.id],
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRL),
  available: (country: CountryScope) => country.triggers.hasCountryFlag("srd_invested"),
  phases: [{ srd_survey_phase: { base: 1 } }],
  outcomeExecute: (operation: OperationScope) =>
    operation.country(countries.KRL, (country: CountryScope) =>
      country.effects.addPoliticalPower(10),
    ),
  returnOnComplete: true,
});
export const designCooperative = MilitaryIndustrialOrganization({
  id: "srd_design_cooperative",
  name: "srd_design_cooperative",
  icon: "GFX_srd_focus",
  include: "generic_infantry_equipment_organization",
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRL),
  available: (mio: MilitaryIndustrialOrganizationScope) =>
    mio.triggers.has_dlc("Arms Against Tyranny"),
  researchBonus: 0.05,
  onTechResearchCompleted: (mio: MilitaryIndustrialOrganizationScope) =>
    mio.effects.add_mio_funds(5),
});
export const beacon = SpecialProject({
  id: "srd_coastal_beacon",
  specialization: "specialization_air",
  icon: "GFX_srd_focus",
  narrative: { name: "srd_coastal_beacon", desc: "srd_coastal_beacon_desc" },
  allowed: { tag: ["KRL"], hasDlc: ["Gotterdammerung"] },
  breakthroughCost: { specialization_air: 1 },
  prototypeTime: 30,
  complexity: 1,
  resourceCost: { resources: { steel: 1 } },
  projectOutput: {
    countryEffects: (country: CountryScope) => {
      country.effects.addStability(0.02);
      country.effects.setCountryFlag("srd_beacon_ready");
    },
    facilityStateEffects: (island: StateScope) => island.effects.addManpower(100),
  },
});
export const reconnaissance = RaidCategory({
  id: "srd_coastal_recon",
  intelSource: "naval",
  visible: (country: CountryScope) => country.triggers.tag(countries.KRL),
  available: (country: CountryScope) => country.triggers.has_dlc("Gotterdammerung"),
});
export const coastalPatrol = Raid({
  id: "srd_coastal_patrol",
  category: reconnaissance.id,
  arrow: { type: "naval" },
  showTarget: (country: CountryScope) => country.triggers.has_war(true),
  successFactors: { success: { base: 0.65 }, critical: { base: 0.1 }, disaster: { base: 0.05 } },
  commandPower: 5,
  daysToPrepare: 10,
  unitIcon: "GFX_srd_focus",
  targetIcon: "GFX_srd_focus",
  targetLocKey: "srd_patrol_target",
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRL),
  available: (country: CountryScope) => country.triggers.has_war(true),
  targetType: { state: [(island: StateScope) => island.triggers.is_coastal(true)] },
  startingPoint: { types: ["naval_base"] },
  essentialEquipment: { entries: { infantry_equipment: 20 } },
  successLevels: {
    failure: {
      outcomeDescription: "srd_patrol_failure",
      actorEffects: {
        effects: (raid: RaidScope) =>
          raid.country(countries.KRL, (country: CountryScope) =>
            country.effects.addPoliticalPower(-1),
          ),
      },
    },
    limitedSuccess: {
      outcomeDescription: "srd_patrol_limited",
      actorEffects: {
        effects: (raid: RaidScope) =>
          raid.country(countries.KRL, (country: CountryScope) =>
            country.effects.addPoliticalPower(2),
          ),
      },
    },
    criticalSuccess: {
      outcomeDescription: "srd_patrol_critical",
      actorEffects: {
        effects: (raid: RaidScope) =>
          raid.country(countries.KRL, (country: CountryScope) =>
            country.effects.addPoliticalPower(10),
          ),
      },
    },
    success: {
      outcomeDescription: "srd_patrol_success",
      actorEffects: {
        effects: (raid: RaidScope) =>
          raid.country(countries.KRL, (country: CountryScope) =>
            country.effects.addPoliticalPower(5),
          ),
      },
    },
  },
});

export const aiPlan = AiStrategyPlan({
  id: "srd_civic_plan",
  name: "srd_civic_plan",
  desc: "srd_civic_plan_desc",
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRL),
  enable: (country: CountryScope) => country.triggers.tag(countries.KRL),
  aiNationalFocuses: ["srd_charter", "srd_harbour", "srd_bonds", "srd_cooperation"],
  research: { industry: 1.5 },
  weight: { base: 1 },
});
export const bookmark = Bookmark({
  id: "srd_island_start",
  name: "srd_island_start",
  desc: "srd_island_start_desc",
  date: "1936.1.1.12",
  picture: "GFX_srd_panel",
  defaultCountry: "KRL",
  default: false,
  effect: { randomizeWeather: 12345 },
  entries: {
    KRL: { history: "srd_island_history", ideology: "social_democrat", focuses: ["srd_charter"] },
  },
});
export const treaty = CountryEvent({
  id: "srd_congress.3",
  title: "srd_congress.3.t",
  description: "srd_congress.3.d",
  isTriggeredOnly: true,
  options: [
    {
      name: "srd_congress.3.a",
      effects: (country: CountryScope) =>
        country.country(countries.NFA, (parent: CountryScope) =>
          parent.effects.set_autonomy({
            target: countries.KRL,
            autonomy_state: treatyStatus.id,
            freedom_level: 0.9,
          }),
        ),
    },
    {
      name: "srd_congress.3.b",
      effects: (country: CountryScope) => country.effects.addStability(0.01),
    },
  ],
});
export const development = DecisionCategory({
  id: "srd_development",
  allowed: (country: CountryScope) => country.triggers.tag(countries.KRL),
  decisions: [
    {
      id: "srd_train_engineers",
      cost: 35,
      available: (country: CountryScope) => country.triggers.hasCountryFlag("srd_invested"),
      visible: (country: CountryScope) =>
        !country.triggers.hasCountryFlag("srd_engineers_deployed"),
      completeEffect: (country: CountryScope) => {
        researchMethods(country);
        country.effects.setCountryFlag("srd_engineers_deployed");
      },
    },
    {
      id: "srd_cooperative_vote",
      cost: 10,
      visible: (country: CountryScope) =>
        !country.triggers.hasCountryFlag("srd_cooperative_vote_done"),
      completeEffect: (country: CountryScope) => {
        country.effects.set_politics({
          ruling_party: cooperativePolitics.id,
          elections_allowed: true,
        });
        country.effects.set_popularities(cwt([pdx.property("srd_cooperative", pdx.atom("100"))]));
        country.effects.setCountryFlag("srd_cooperative_vote_done");
      },
    },
    {
      id: "srd_treaty_talks",
      cost: 10,
      completeEffect: (country: CountryScope) =>
        country.effects.countryEvent({ id: treaty.id, days: 1 }),
    },
    {
      id: "srd_establish_service",
      cost: 20,
      visible: (country: CountryScope) => country.triggers.has_dlc("La Resistance"),
      available: (country: CountryScope) => !country.triggers.hasCountryFlag("srd_service_created"),
      completeEffect: (country: CountryScope) => {
        country.effects.create_intelligence_agency({
          name: "srd_coastal_service",
          icon: "GFX_srd_focus",
        });
        country.effects.setCountryFlag("srd_service_created");
      },
    },
    {
      id: "srd_demonstrate_beacon",
      cost: 50,
      visible: (country: CountryScope) => country.triggers.has_dlc("Gotterdammerung"),
      available: (country: CountryScope) => !country.triggers.hasCountryFlag("srd_beacon_ready"),
      completeEffect: (country: CountryScope) =>
        country.effects.complete_special_project({ project: beacon.id, state: states[114] }),
    },
  ],
});
