import {
  ScriptedEffect,
  country,
  countryTarget,
  state,
  gameScripts,
  indexBy,
  type CountryScope,
} from "krieg-lang/hoi4";
import {
  doctrines,
  priorities,
  originValues,
  dlcValues,
  afterValues,
  flagValues,
  technologyValues,
  nationValues,
  missionValues,
  focusValues,
  ruleValues,
  treeValues,
  ideaValues,
  governmentValues,
  enemyValues,
} from "./strategy-facts.krg.ts";

const game = gameScripts("country", { triggers: ["is_chinese_warlord", "is_literally_china"] });
const root = countryTarget("ROOT");
const observations = {
  always: (_c: CountryScope) => true,
  war: (c: CountryScope) => c.triggers.has_war(true),
  subject: (c: CountryScope) => c.triggers.is_subject(true),
  historical: (c: CountryScope) => c.triggers.is_historical_focus_on(true),
  chineseWarlord: (c: CountryScope) => c.test(game.triggers.is_chinese_warlord),
  literalChina: (c: CountryScope) => c.test(game.triggers.is_literally_china),
  ...indexBy(
    originValues,
    (v) => `origin:${v}` as const,
    (v) => (c: CountryScope) => c.triggers.original_tag(country(v)),
  ),
  ...indexBy(
    nationValues,
    (v) => `nation:${v}` as const,
    (v) => (c: CountryScope) => c.triggers.tag(country(v)),
  ),
  ...indexBy(
    dlcValues,
    (v) => `dlc:${v}` as const,
    (v) => (c: CountryScope) => c.triggers.has_dlc(v),
  ),
  ...indexBy(
    afterValues,
    (v) => `after:${v}` as const,
    (v) => (c: CountryScope) => c.dateAfter(v),
  ),
  ...indexBy(
    flagValues,
    (v) => `flag:${v}` as const,
    (v) => (c: CountryScope) => c.triggers.hasCountryFlag(v),
  ),
  ...indexBy(
    technologyValues,
    (v) => `technology:${v}` as const,
    (v) => (c: CountryScope) => c.triggers.has_tech(v),
  ),
  ...indexBy(
    missionValues,
    (v) => `mission:${v}` as const,
    (v) => (c: CountryScope) => c.triggers.has_active_mission(v),
  ),
  ...indexBy(
    focusValues,
    (v) => `focus:${v}` as const,
    (v) => (c: CountryScope) => c.triggers.has_completed_focus(v),
  ),
  ...indexBy(
    treeValues,
    (v) => `tree:${v}` as const,
    (v) => (c: CountryScope) => c.triggers.has_focus_tree(v),
  ),
  ...indexBy(
    ideaValues,
    (v) => `idea:${v}` as const,
    (v) => (c: CountryScope) => c.triggers.has_idea(v),
  ),
  ...indexBy(
    governmentValues,
    (v) => `government:${v}` as const,
    (v) => (c: CountryScope) => c.triggers.has_government(v),
  ),
  ...indexBy(
    enemyValues,
    (v) => `enemy:${v}` as const,
    (v) => (c: CountryScope) => c.triggers.has_war_with(country(v)),
  ),
  ...indexBy(
    ruleValues,
    (v) => `rule:${v.rule}=${v.option}` as const,
    (v) => (c: CountryScope) => c.triggers.has_game_rule({ rule: v.rule, option: v.option }),
  ),
  "control:527": (c: CountryScope) => c.triggers.controls_state(state(527)),
  "situation:japanAbsent": (c: CountryScope) =>
    c.countryMatches(country("JAP"), (j) => j.triggers.exists(false)),
  "situation:lowSovietOpinion": (c: CountryScope) =>
    c.countryMatches(country("SOV"), (s) => s.opinionOf(root) < 90),
  "situation:highSovietOpinion": (c: CountryScope) =>
    c.countryMatches(country("SOV"), (s) => s.opinionOf(root) > 90),
  "situation:largeRecruitmentPool": (c: CountryScope) => c.availableManpower > 200000,
  "situation:smallRecruitmentPool": (c: CountryScope) => c.availableManpower < 200000,
  "situation:germanyNonFascist": (c: CountryScope) =>
    c.countryMatches(country("GER"), (g) => !g.triggers.has_government("fascism")),
  "situation:franceNonDemocratic": (c: CountryScope) =>
    c.countryMatches(country("FRA"), (f) => !f.triggers.has_government("democratic")),
  "situation:germanOpposition": (c: CountryScope) =>
    c.countryMatches(
      country("GER"),
      (g) =>
        !g.triggers.has_government("fascism") ||
        ["GER_oppose_hitler", "GER_oppose_hitler_ww"].some((k) =>
          g.triggers.has_completed_focus(k),
        ) ||
        (!g.isAI && g.triggers.has_completed_focus("GER_heed_von_neuraths_concerns")),
    ),
  "situation:communistSweden": (c: CountryScope) =>
    c.countryMatches(country("SWE"), (g) => g.triggers.has_government("communism")),
  "situation:nonCommunistSoviets": (c: CountryScope) =>
    c.countryMatches(country("SOV"), (g) => !g.triggers.has_government("communism")),
  "situation:nonDemocraticBritain": (c: CountryScope) =>
    c.countryMatches(country("ENG"), (g) => !g.triggers.has_government("democratic")),
  "situation:habsburgHungary": (c: CountryScope) =>
    c.anyOriginalCountry(country("HUN"), (g) =>
      g.triggers.has_completed_focus("HUN_invite_the_habsburg_prince"),
    ),
  "situation:austriaSubjectToCzechoslovakia": (c: CountryScope) =>
    c.countryMatches(country("AUS"), (a) => a.triggers.is_subject_of(country("CZE"))),
  "situation:peacefulUnitedCzechoslovakia": (c: CountryScope) =>
    c.countryMatches(
      country("CZE"),
      (g) =>
        !g.triggers.has_war(true) &&
        [4, 152, 153, 848, 975].every((n) => g.triggers.has_full_control_of_state(state(n))),
    ),
  "situation:czechIndependence": (c: CountryScope) =>
    c.countryMatches(
      country("CZE"),
      (g) =>
        (g.triggers.is_in_faction(true) ||
          (g.triggers.is_major(true) &&
            [
              "CZE_appeal_to_the_castle",
              "CZE_form_a_federation",
              "CZE_expand_the_communist_press",
            ].some((f) => g.triggers.has_completed_focus(f)))) &&
        !g.triggers.has_war_with(root) &&
        !g.triggers.is_subject_of(root),
    ),
  "situation:polarisedFrance": (c: CountryScope) =>
    c.anyOriginalCountry(country("FRA"), (g) =>
      [
        "FRA_utilize_the_leagues",
        "FRA_invite_communist_ministers",
        "FRA_leftist_rhetoric",
        "FRA_right_wing_rhetoric",
      ].some((f) => g.triggers.has_completed_focus(f)),
    ),
  "situation:americanWarPlans": (c: CountryScope) =>
    c.anyOriginalCountry(country("USA"), (g) =>
      ["USA_war_plan_red", "USA_war_plan_white"].some((f) => g.triggers.has_completed_focus(f)),
    ),
  "situation:austrianImperialCouncil": (c: CountryScope) =>
    c.countryMatches(country("AUS"), (g) =>
      g.triggers.has_completed_focus("AUS_reinstate_the_imperial_council"),
    ),
  "situation:austrianPlayerResistance": (c: CountryScope) =>
    c.countryMatches(
      country("AUS"),
      (g) => !g.isAI && g.triggers.has_completed_focus("AUS_austria_against_fascism"),
    ),
  "situation:smallIndustry": (c: CountryScope) => c.factories < 35,
  "situation:nonCommunistOverlord": (c: CountryScope) =>
    c.overlordMatches((g) => !g.triggers.has_government("communism")),
} as const;

export const strategy = ScriptedEffect("rq_ap_strat", (c: CountryScope) => {
  for (const doctrine of doctrines) {
    if (
      doctrine.situations.some(
        (s) =>
          s.requires.every((k) => observations[k](c)) &&
          s.excludes.every((k) => !observations[k](c)),
      )
    ) {
      if (doctrine.mode === "retire") c.effects.clr_country_flag(doctrine.flag);
      else c.effects.setCountryFlag(doctrine.flag);
    } else {
      if (doctrine.mode === "follow") c.effects.clr_country_flag(doctrine.flag);
    }
  }
  for (const track of priorities) {
    c.setVariable(track.variable, 0);
    for (const bonus of track.bonuses) {
      if (c.triggers.hasCountryFlag(bonus.flag)) c.addVariable(track.variable, bonus.delta);
    }
  }
});
const formations = [
  {
    variable: "rq_ap_tank",
    base: 0.6,
    active: 1.4,
    units: ["light_armor", "medium_armor", "heavy_armor", "modern_armor"],
  },
  { variable: "rq_ap_art", base: 0.8, active: 1.3, units: ["artillery_brigade", "artillery"] },
  { variable: "rq_ap_at", base: 0.8, active: 1.3, units: ["anti_tank_brigade", "anti_tank"] },
  { variable: "rq_ap_aa", base: 0.8, active: 1.3, units: ["anti_air_brigade", "anti_air"] },
  { variable: "rq_ap_mot", base: 0.8, active: 1.3, units: ["motorized", "mechanized"] },
  { variable: "rq_ap_para", base: 0.5, active: 1.4, units: ["paratrooper"] },
  { variable: "rq_ap_mar", base: 0.5, active: 1.4, units: ["marine"] },
  { variable: "rq_ap_mnt", base: 0.5, active: 1.4, units: ["mountaineers"] },
  { variable: "rq_ap_rng", base: 0.5, active: 1.4, units: ["ranger_battalion"] },
] as const;
export const profile = ScriptedEffect("rq_ap_profile", (c: CountryScope) => {
  c.run(strategy);
  c.setVariable("rq_ap_nav", 1);
  if (!c.triggers.any_owned_state((s) => s.triggers.is_coastal(true)))
    c.setVariable("rq_ap_nav", 0);
  else if (c.navalFactories < 1 && c.navySize() < 5) c.setVariable("rq_ap_nav", 0.15);
  else if (c.navalFactories < 5) c.setVariable("rq_ap_nav", 0.4);
  else if (c.navalFactories < 15) c.setVariable("rq_ap_nav", 0.8);
  else if (c.navalFactories < 30) c.setVariable("rq_ap_nav", 1.2);
  else c.setVariable("rq_ap_nav", 1.6);
  c.setVariable("rq_ap_air", 1.1);
  if (c.militaryFactories < 10) c.setVariable("rq_ap_air", 0.6);
  else if (c.militaryFactories < 25) c.setVariable("rq_ap_air", 0.9);
  if (c.deployedAircraft() > 200) c.multiplyVariable("rq_ap_air", 1.2);
  for (const f of formations) {
    c.setVariable(f.variable, f.base);
    if (f.units.some((u) => c.triggers.has_template_containing_unit(u)))
      c.setVariable(f.variable, f.active);
  }
  c.setVariable("rq_ap_oil", 1);
  if (!(c.resource("oil") > 10)) c.setVariable("rq_ap_oil", 1.5);
  c.setVariable("rq_ap_rub", 1);
  if (!(c.resource("rubber") > 10)) c.setVariable("rq_ap_rub", 1.5);
  c.setVariable("rq_ap_wland", 1);
  c.setVariable("rq_ap_wair", 1);
  c.setVariable("rq_ap_wsea", 1);
  c.setVariable("rq_ap_ind", 1.2);
  if (c.triggers.has_war(true)) {
    c.setVariable("rq_ap_wland", 1.3);
    c.setVariable("rq_ap_wair", 1.3);
    c.setVariable("rq_ap_wsea", 0.8);
    c.setVariable("rq_ap_ind", 0.8);
    if (c.triggers.any_enemy_country((enemy) => enemy.navySize() > 10))
      c.setVariable("rq_ap_wsea", 1.3);
  }
});
