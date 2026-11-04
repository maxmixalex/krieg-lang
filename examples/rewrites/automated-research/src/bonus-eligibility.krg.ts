import {
  country,
  countryTarget,
  state,
  gameScripts,
  indexBy,
  type CountryScope,
} from "krieg-lang/hoi4";
import {
  dlcRequirements,
  technologyRequirements,
  focusRequirements,
  flagRequirements,
} from "./bonus-focus-facts.krg.ts";
const root = countryTarget("ROOT");
// This trigger belongs to the base game. Its state occupation rules stay owned by
// the game, just as focus rewards depend on the game's focus and project records.
const stateRules = gameScripts("state", {
  triggers: ["state_is_fully_controlled_by_ROOT_or_subject"],
});
export const bonusEligibility = {
  ...indexBy(
    dlcRequirements,
    (id) => `dlc:${id}` as const,
    (id) => (c: CountryScope) => c.triggers.has_dlc(id),
  ),
  ...indexBy(
    technologyRequirements,
    (id) => `technology:${id}` as const,
    (id) => (c: CountryScope) => c.triggers.has_tech(id),
  ),
  ...indexBy(
    focusRequirements,
    (id) => `focus:${id}` as const,
    (id) => (c: CountryScope) => c.triggers.has_completed_focus(id),
  ),
  ...indexBy(
    flagRequirements,
    (id) => `flag:${id}` as const,
    (id) => (c: CountryScope) => c.triggers.hasCountryFlag(id),
  ),
  "situation:threeResearchSlots": (c: CountryScope) => c.triggers.original_research_slots(3),
  "situation:noAgency": (c: CountryScope) => c.triggers.has_intelligence_agency(false),
  "situation:hasAgency": (c: CountryScope) => c.triggers.has_intelligence_agency(true),
  "situation:sharedEnemyWithUSA": (c: CountryScope) =>
    c.countryMatches(country("USA"), (us) =>
      us.triggers.any_enemy_country((enemy) => enemy.triggers.has_war_with(root)),
    ),
  "situation:foreignMajorPartner": (c: CountryScope) =>
    c.triggers.any_other_country(
      (other) =>
        other.triggers.is_major(true) &&
        other.triggers.capital_scope(
          (capital) =>
            capital.triggers.is_on_continent("europe") ||
            capital.triggers.is_on_continent("north_america"),
        ) &&
        other.triggers.is_subject(false) &&
        other.triggers.has_civil_war(false) &&
        !other.triggers.has_government("fascism") &&
        !other.triggers.has_war_with(root) &&
        !other.triggers.any_allied_country((ally) => ally.triggers.has_war_with(root)) &&
        !other.triggers.any_enemy_country((enemy) => enemy.triggers.is_in_faction_with(root)) &&
        other.triggers.any_enemy_country((enemy) => enemy.triggers.has_war_with(root)),
    ),
  "situation:peacefulFascistGermany": (c: CountryScope) =>
    c.countryMatches(
      country("GER"),
      (other) =>
        other.triggers.has_government("fascism") &&
        !other.triggers.has_war_with(root) &&
        !other.triggers.has_wargoal_against(root),
    ),
  "situation:peacefulFascistItaly": (c: CountryScope) =>
    c.countryMatches(
      country("ITA"),
      (other) =>
        other.triggers.has_government("fascism") &&
        !other.triggers.has_war_with(root) &&
        !other.triggers.has_wargoal_against(root),
    ),
  "situation:warGoalGermany": (c: CountryScope) => c.triggers.has_wargoal_against(country("GER")),
  "situation:warGoalItaly": (c: CountryScope) => c.triggers.has_wargoal_against(country("ITA")),
  "situation:nuclearReactorProject": (c: CountryScope) =>
    c.triggers.is_special_project_completed("sp:sp_nuclear_reactor"),
  "situation:ordnanceLevelThree": (c: CountryScope) =>
    c.variable("global.gun_and_shell_level") === 3,
  "situation:germanyExists": (c: CountryScope) => c.triggers.country_exists(country("GER")),
  "situation:warWithGermany": (c: CountryScope) => c.triggers.has_war_with(country("GER")),
  "situation:tripoliControlled": (c: CountryScope) =>
    c.stateMatches(state(448), (s) =>
      s.test(stateRules.triggers.state_is_fully_controlled_by_ROOT_or_subject),
    ),
  "situation:factionWithBritain": (c: CountryScope) =>
    c.triggers.is_in_faction_with(country("ENG")),
  "situation:factionWithFrance": (c: CountryScope) => c.triggers.is_in_faction_with(country("FRA")),
  "situation:germanSupport": (c: CountryScope) =>
    c.countryMatches(
      country("GER"),
      (other) => other.opinionOf(root) > 74 || other.triggers.has_guaranteed(root),
    ),
  "situation:frenchSupport": (c: CountryScope) =>
    c.countryMatches(
      country("FRA"),
      (other) => other.opinionOf(root) > 74 || other.triggers.has_guaranteed(root),
    ),
  "situation:britishSupport": (c: CountryScope) =>
    c.countryMatches(
      country("ENG"),
      (other) => other.opinionOf(root) > 74 || other.triggers.has_guaranteed(root),
    ),
  "situation:italianSupport": (c: CountryScope) =>
    c.countryMatches(
      country("ITA"),
      (other) => other.opinionOf(root) > 74 || other.triggers.has_guaranteed(root),
    ),
  "situation:americanSupport": (c: CountryScope) =>
    c.countryMatches(
      country("USA"),
      (other) => other.opinionOf(root) > 74 || other.triggers.has_guaranteed(root),
    ),
  "situation:sovietSupport": (c: CountryScope) =>
    c.countryMatches(
      country("SOV"),
      (other) => other.opinionOf(root) > 74 || other.triggers.has_guaranteed(root),
    ),
  "situation:communistGovernment": (c: CountryScope) => c.triggers.has_government("communism"),
  "situation:turkeyInGermanFaction": (c: CountryScope) =>
    c.countryMatches(country("TUR"), (other) => other.triggers.is_in_faction_with(country("GER"))),
  "situation:germanAdvancedTank": (c: CountryScope) =>
    c.countryMatches(country("GER"), (other) => other.triggers.has_tech("advanced_medium_tank")),
  "situation:germanImprovedTank": (c: CountryScope) =>
    c.countryMatches(country("GER"), (other) => other.triggers.has_tech("improved_medium_tank")),
  "situation:germanBasicTank": (c: CountryScope) =>
    c.countryMatches(country("GER"), (other) => other.triggers.has_tech("basic_medium_tank")),
  "situation:germanAdvancedChassis": (c: CountryScope) =>
    c.countryMatches(country("GER"), (other) =>
      other.triggers.has_tech("advanced_medium_tank_chassis"),
    ),
  "situation:germanImprovedChassis": (c: CountryScope) =>
    c.countryMatches(country("GER"), (other) =>
      other.triggers.has_tech("improved_medium_tank_chassis"),
    ),
  "situation:germanBasicChassis": (c: CountryScope) =>
    c.countryMatches(country("GER"), (other) =>
      other.triggers.has_tech("basic_medium_tank_chassis"),
    ),
  "situation:uruguayanOrigin": (c: CountryScope) => c.triggers.original_tag(country("URG")),
  "situation:brazilianOrigin": (c: CountryScope) => c.triggers.original_tag(country("BRA")),
};
