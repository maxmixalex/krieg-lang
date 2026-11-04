import {
  ScriptedTrigger,
  type CountryScope,
  country,
  countryTarget,
  gameScripts,
} from "krieg-lang/hoi4";

const inherited = gameScripts("country", {
  triggers: ["anti_submarine_strategy_required_trigger", "PHI_SEA"] as const,
});
// Explicit game queries shared by technology preference rules. The numeric IDs
// are catalogue references, not opcodes; conditions remain ordinary typed code.
export const aiPolicies = [
  ScriptedTrigger("rq_policy_1", (c: CountryScope) => c.triggers.tag(country("GER"))),
  ScriptedTrigger("rq_policy_2", (c: CountryScope) => c.triggers.tag(country("SOV"))),
  ScriptedTrigger(
    "rq_policy_3",
    (c: CountryScope) => c.triggers.has_war_with("GER") && c.triggers.tag(country("SOV")),
  ),
  ScriptedTrigger("rq_policy_4", (c: CountryScope) => c.deployedAircraft("cas") > 400),
  ScriptedTrigger(
    "rq_policy_5",
    (c: CountryScope) => c.triggers.has_war_with("GER") || c.triggers.has_war_with("SOV"),
  ),
  ScriptedTrigger("rq_policy_6", (c: CountryScope) => c.deployedAircraft("cas") > 500),
  ScriptedTrigger(
    "rq_policy_7",
    (c: CountryScope) =>
      c.triggers.has_tech("basic_small_airframe") ||
      c.triggers.has_tech("basic_medium_airframe") ||
      c.triggers.has_tech("basic_large_airframe"),
  ),
  ScriptedTrigger(
    "rq_policy_8",
    (c: CountryScope) =>
      c.triggers.tag(country("GER")) ||
      c.triggers.tag(country("SOV")) ||
      c.triggers.tag(country("ENG")),
  ),
  ScriptedTrigger(
    "rq_policy_9",
    (c: CountryScope) =>
      c.triggers.has_tech("improved_small_airframe") ||
      c.triggers.has_tech("improved_medium_airframe") ||
      c.triggers.has_tech("improved_large_airframe"),
  ),
  ScriptedTrigger(
    "rq_policy_10",
    (c: CountryScope) => c.triggers.tag(country("USA")) || c.triggers.tag(country("GER")),
  ),
  ScriptedTrigger(
    "rq_policy_11",
    (c: CountryScope) =>
      c.triggers.has_tech("iw_small_airframe") ||
      c.triggers.has_tech("iw_medium_airframe") ||
      c.triggers.has_tech("iw_large_airframe"),
  ),
  ScriptedTrigger("rq_policy_12", (c: CountryScope) => c.triggers.tag(country("USA"))),
  ScriptedTrigger("rq_policy_13", (c: CountryScope) => c.triggers.tag(country("JAP"))),
  ScriptedTrigger("rq_policy_14", (c: CountryScope) => c.dateAfter("1942.1.6")),
  ScriptedTrigger("rq_policy_15", (c: CountryScope) => c.dateAfter("1943.1.1")),
  ScriptedTrigger("rq_policy_16", (c: CountryScope) => c.militaryFactories < 50),
  ScriptedTrigger("rq_policy_17", (c: CountryScope) => c.triggers.has_war_with("GER")),
  ScriptedTrigger("rq_policy_18", (c: CountryScope) =>
    c.test(inherited.triggers.anti_submarine_strategy_required_trigger),
  ),
  ScriptedTrigger("rq_policy_19", (c: CountryScope) => c.triggers.original_tag(country("GER"))),
  ScriptedTrigger("rq_policy_20", (c: CountryScope) => c.triggers.tag(country("ENG"))),
  ScriptedTrigger(
    "rq_policy_21",
    (c: CountryScope) =>
      c.triggers.tag(country("ENG")) ||
      c.triggers.tag(country("USA")) ||
      c.triggers.tag(country("JAP")),
  ),
  ScriptedTrigger("rq_policy_22", (c: CountryScope) => c.triggers.has_war(true)),
  ScriptedTrigger("rq_policy_23", (c: CountryScope) => c.importedResource("coal") > 0),
  ScriptedTrigger("rq_policy_24", (c: CountryScope) => c.energyRatio < 0.9),
  ScriptedTrigger(
    "rq_policy_25",
    (c: CountryScope) =>
      c.triggers.has_tech("modern_art") ||
      c.triggers.can_research("modern_art") ||
      c.triggers.is_researching_technology("main_battle_tank"),
  ),
  ScriptedTrigger("rq_policy_26", (c: CountryScope) =>
    c.triggers.has_tech("advanced_ship_hull_heavy"),
  ),
  ScriptedTrigger(
    "rq_policy_27",
    (c: CountryScope) => c.triggers.tag(country("GER")) || c.triggers.tag(country("JAP")),
  ),
  ScriptedTrigger(
    "rq_policy_28",
    (c: CountryScope) =>
      c.triggers.has_tech("modern_spaa") ||
      c.triggers.can_research("modern_spaa") ||
      c.triggers.is_researching_technology("main_battle_tank"),
  ),
  ScriptedTrigger("rq_policy_29", (c: CountryScope) => c.dateAfter("1944.1.1")),
  ScriptedTrigger("rq_policy_30", (c: CountryScope) => c.dateAfter("1945.1.1")),
  ScriptedTrigger("rq_policy_31", (c: CountryScope) => c.dateAfter("1946.1.1")),
  ScriptedTrigger(
    "rq_policy_32",
    (c: CountryScope) => c.triggers.tag(country("USA")) && c.dateAfter("1944.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_33",
    (c: CountryScope) =>
      c.triggers.has_tech("modern_td") ||
      c.triggers.can_research("modern_td") ||
      c.triggers.is_researching_technology("main_battle_tank"),
  ),
  ScriptedTrigger("rq_policy_34", (c: CountryScope) => c.dateAfter("1942.1.1")),
  ScriptedTrigger("rq_policy_35", (c: CountryScope) => c.militaryFactories > 150),
  ScriptedTrigger("rq_policy_36", (c: CountryScope) => c.dateAfter("1944.1.6")),
  ScriptedTrigger("rq_policy_37", (c: CountryScope) =>
    c.triggers.has_tech("advanced_ship_hull_light"),
  ),
  ScriptedTrigger("rq_policy_38", (c: CountryScope) => c.triggers.is_major(false)),
  ScriptedTrigger(
    "rq_policy_39",
    (c: CountryScope) => c.triggers.tag(country("USA")) && c.dateAfter("1943.3.1"),
  ),
  ScriptedTrigger(
    "rq_policy_40",
    (c: CountryScope) =>
      c.triggers.tag(country("SOV")) &&
      c.triggers.has_war(true) &&
      c.triggers.any_enemy_country((e) =>
        e.countryMatches(
          countryTarget("ROOT"),
          (root) => root.estimatedMaxArmor(countryTarget("PREV")) > 27,
        ),
      ),
  ),
  ScriptedTrigger("rq_policy_41", (c: CountryScope) => c.dateAfter("1939.1.1")),
  ScriptedTrigger(
    "rq_policy_42",
    (c: CountryScope) => c.triggers.is_major(true) && c.dateAfter("1944.1.1"),
  ),
  ScriptedTrigger("rq_policy_43", (c: CountryScope) => c.deployedAircraft("tactical_bomber") > 500),
  ScriptedTrigger(
    "rq_policy_44",
    (c: CountryScope) => c.triggers.is_major(true) && c.dateAfter("1945.1.1"),
  ),
  ScriptedTrigger("rq_policy_45", (c: CountryScope) =>
    c.triggers.has_template_containing_unit("medium_sp_artillery_brigade"),
  ),
  ScriptedTrigger(
    "rq_policy_46",
    (c: CountryScope) =>
      c.triggers.tag(country("GER")) &&
      c.dateAfter("1942.6.1") &&
      c.triggers.has_completed_focus("GER_expand_kummersdorfs_capacity") &&
      c.triggers.has_tech_bonus({ category: "cat_medium_armor" }),
  ),
  ScriptedTrigger(
    "rq_policy_47",
    (c: CountryScope) => c.triggers.tag(country("ENG")) && c.dateAfter("1943.6.1"),
  ),
  ScriptedTrigger(
    "rq_policy_48",
    (c: CountryScope) =>
      (c.triggers.tag(country("GER")) || c.triggers.tag(country("SOV"))) &&
      c.triggers.any_enemy_country((e) =>
        e.countryMatches(
          countryTarget("ROOT"),
          (root) => root.estimatedMaxArmor(countryTarget("PREV")) > 35,
        ),
      ),
  ),
  ScriptedTrigger("rq_policy_49", (c: CountryScope) =>
    c.triggers.has_template_containing_unit("medium_tank_destroyer_brigade"),
  ),
  ScriptedTrigger(
    "rq_policy_50",
    (c: CountryScope) => c.triggers.tag(country("USA")) || c.triggers.tag(country("ENG")),
  ),
  ScriptedTrigger(
    "rq_policy_51",
    (c: CountryScope) =>
      (c.triggers.tag(country("GER")) ||
        c.triggers.tag(country("ITA")) ||
        c.triggers.tag(country("JAP"))) &&
      c.triggers.has_war(true),
  ),
  ScriptedTrigger("rq_policy_52", (c: CountryScope) => c.resource("rubber") > 10),
  ScriptedTrigger("rq_policy_53", (c: CountryScope) => c.resource("rubber") > 20),
  ScriptedTrigger("rq_policy_54", (c: CountryScope) => c.resource("rubber") > 30),
  ScriptedTrigger("rq_policy_55", (c: CountryScope) => c.triggers.is_major(true)),
  ScriptedTrigger("rq_policy_56", (c: CountryScope) => c.dateAfter("1942.3.1")),
  ScriptedTrigger(
    "rq_policy_57",
    (c: CountryScope) =>
      (c.triggers.tag(country("GER")) || c.triggers.tag(country("ITA"))) &&
      c.triggers.has_war(true),
  ),
  ScriptedTrigger(
    "rq_policy_58",
    (c: CountryScope) =>
      c.triggers.tag(country("ENG")) ||
      c.triggers.tag(country("JAP")) ||
      c.triggers.tag(country("USA")),
  ),
  ScriptedTrigger(
    "rq_policy_59",
    (c: CountryScope) => c.triggers.tag(country("ENG")) || c.triggers.tag(country("USA")),
  ),
  ScriptedTrigger(
    "rq_policy_60",
    (c: CountryScope) => c.triggers.tag(country("GER")) || c.triggers.tag(country("USA")),
  ),
  ScriptedTrigger("rq_policy_61", (c: CountryScope) => c.dateAfter("1941.1.1")),
  ScriptedTrigger("rq_policy_62", (c: CountryScope) => c.dateAfter("1947.1.1")),
  ScriptedTrigger("rq_policy_63", (c: CountryScope) => c.dateAfter("1948.1.1")),
  ScriptedTrigger(
    "rq_policy_64",
    (c: CountryScope) =>
      c.triggers.tag(country("GER")) ||
      c.triggers.tag(country("USA")) ||
      c.triggers.tag(country("ENG")),
  ),
  ScriptedTrigger(
    "rq_policy_65",
    (c: CountryScope) =>
      c.triggers.original_tag(country("USA")) || c.triggers.original_tag(country("JAP")),
  ),
  ScriptedTrigger(
    "rq_policy_66",
    (c: CountryScope) => !c.triggers.any_controlled_state((s) => s.triggers.is_coastal(true)),
  ),
  ScriptedTrigger(
    "rq_policy_67",
    (c: CountryScope) => c.triggers.is_major(true) && !c.triggers.tag(country("GER")),
  ),
  ScriptedTrigger(
    "rq_policy_68",
    (c: CountryScope) =>
      (c.triggers.tag(country("JAP")) ||
        c.triggers.tag(country("ENG")) ||
        c.triggers.tag(country("USA"))) &&
      (c.triggers.has_war_with("JAP") ||
        c.triggers.has_war_with("USA") ||
        c.triggers.has_war_with("ENG")),
  ),
  ScriptedTrigger("rq_policy_69", (c: CountryScope) =>
    c.triggers.any_enemy_country((e) =>
      e.countryMatches(
        countryTarget("ROOT"),
        (root) => root.estimatedMaxArmor(countryTarget("PREV")) > 30,
      ),
    ),
  ),
  ScriptedTrigger(
    "rq_policy_70",
    (c: CountryScope) =>
      c.triggers.tag(country("JAP")) &&
      !(c.triggers.has_war_with("SOV") || c.triggers.has_war_with("USA")),
  ),
  ScriptedTrigger("rq_policy_71", (c: CountryScope) => c.dateAfter("1939.1.6")),
  ScriptedTrigger("rq_policy_72", (c: CountryScope) => c.dateAfter("1940.1.1")),
  ScriptedTrigger("rq_policy_73", (c: CountryScope) => c.dateAfter("1939.1.9")),
  ScriptedTrigger(
    "rq_policy_74",
    (c: CountryScope) => c.triggers.tag(country("USA")) && c.triggers.has_war(false),
  ),
  ScriptedTrigger("rq_policy_75", (c: CountryScope) => c.dateAfter("1940.1.6")),
  ScriptedTrigger("rq_policy_76", (c: CountryScope) =>
    c.triggers.any_enemy_country((e) =>
      e.countryMatches(
        countryTarget("ROOT"),
        (root) => root.estimatedMaxArmor(countryTarget("PREV")) > 32,
      ),
    ),
  ),
  ScriptedTrigger(
    "rq_policy_77",
    (c: CountryScope) => c.triggers.original_tag(country("GER")) && c.triggers.has_war_with("SOV"),
  ),
  ScriptedTrigger("rq_policy_78", (c: CountryScope) =>
    c.triggers.any_enemy_country((e) =>
      e.countryMatches(
        countryTarget("ROOT"),
        (root) => root.estimatedMaxArmor(countryTarget("PREV")) > 35,
      ),
    ),
  ),
  ScriptedTrigger("rq_policy_79", (c: CountryScope) => c.dateAfter("1942.1.9")),
  ScriptedTrigger("rq_policy_80", (c: CountryScope) => c.dateAfter("1943.1.6")),
  ScriptedTrigger("rq_policy_81", (c: CountryScope) => c.dateAfter("1937.1.1")),
  ScriptedTrigger("rq_policy_82", (c: CountryScope) => c.dateAfter("1938.1.1")),
  ScriptedTrigger("rq_policy_83", (c: CountryScope) => c.dateAfter("1938.1.9")),
  ScriptedTrigger("rq_policy_84", (c: CountryScope) => c.dateAfter("1941.1.6")),
  ScriptedTrigger("rq_policy_85", (c: CountryScope) => c.dateAfter("1941.1.9")),
  ScriptedTrigger(
    "rq_policy_86",
    (c: CountryScope) => c.triggers.is_major(true) && c.dateAfter("1943.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_87",
    (c: CountryScope) =>
      c.test(inherited.triggers.PHI_SEA) && c.triggers.has_completed_focus("PHI_weapons_of_war"),
  ),
  ScriptedTrigger(
    "rq_policy_88",
    (c: CountryScope) =>
      c.triggers.has_tech("early_ship_hull_light") ||
      c.triggers.has_tech("early_ship_hull_cruiser") ||
      c.triggers.has_tech("early_ship_hull_heavy"),
  ),
  ScriptedTrigger(
    "rq_policy_89",
    (c: CountryScope) =>
      c.triggers.can_research("improved_fire_control_system") ||
      c.triggers.has_tech("improved_fire_control_system"),
  ),
  ScriptedTrigger(
    "rq_policy_90",
    (c: CountryScope) =>
      c.triggers.has_tech("improved_heavy_art") ||
      c.triggers.can_research("improved_heavy_art") ||
      c.triggers.is_researching_technology("improved_heavy_tank"),
  ),
  ScriptedTrigger("rq_policy_91", (c: CountryScope) =>
    c.triggers.has_tech("basic_ship_hull_heavy"),
  ),
  ScriptedTrigger(
    "rq_policy_92",
    (c: CountryScope) => c.triggers.is_major(true) && c.triggers.has_war(true),
  ),
  ScriptedTrigger(
    "rq_policy_93",
    (c: CountryScope) =>
      c.triggers.tag(country("USA")) ||
      c.triggers.tag(country("ENG")) ||
      c.triggers.tag(country("JAP")) ||
      c.triggers.tag(country("ITA")),
  ),
  ScriptedTrigger(
    "rq_policy_94",
    (c: CountryScope) =>
      c.triggers.has_tech("improved_heavy_spaa") ||
      c.triggers.can_research("improved_heavy_spaa") ||
      c.triggers.is_researching_technology("improved_heavy_tank"),
  ),
  ScriptedTrigger("rq_policy_95", (c: CountryScope) => c.triggers.tag(country("FRA"))),
  ScriptedTrigger(
    "rq_policy_96",
    (c: CountryScope) => c.triggers.tag(country("JAP")) && c.militaryFactories < 100,
  ),
  ScriptedTrigger(
    "rq_policy_97",
    (c: CountryScope) =>
      c.triggers.can_research("improved_heavy_tank") || c.triggers.has_tech("improved_heavy_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_98",
    (c: CountryScope) =>
      c.triggers.has_tech("improved_heavy_td") ||
      c.triggers.can_research("improved_heavy_td") ||
      c.triggers.is_researching_technology("improved_heavy_tank"),
  ),
  ScriptedTrigger("rq_policy_99", (c: CountryScope) =>
    c.triggers.has_template_containing_unit("light_sp_artillery_brigade"),
  ),
  ScriptedTrigger(
    "rq_policy_100",
    (c: CountryScope) =>
      c.triggers.has_tech("improved_light_art") ||
      c.triggers.can_research("improved_light_art") ||
      c.triggers.is_researching_technology("improved_light_tank"),
  ),
  ScriptedTrigger("rq_policy_101", (c: CountryScope) =>
    c.triggers.has_tech("basic_ship_hull_light"),
  ),
  ScriptedTrigger(
    "rq_policy_102",
    (c: CountryScope) =>
      c.triggers.has_tech("improved_light_spaa") ||
      c.triggers.can_research("improved_light_spaa") ||
      c.triggers.is_researching_technology("improved_light_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_103",
    (c: CountryScope) =>
      (c.triggers.tag(country("GER")) || c.triggers.tag(country("SOV"))) &&
      c.triggers.has_war(true) &&
      c.triggers.any_enemy_country((e) =>
        e.countryMatches(
          countryTarget("ROOT"),
          (root) => root.estimatedMaxArmor(countryTarget("PREV")) > 25,
        ),
      ),
  ),
  ScriptedTrigger("rq_policy_104", (c: CountryScope) =>
    c.triggers.has_template_containing_unit("light_tank_destroyer_brigade"),
  ),
  ScriptedTrigger(
    "rq_policy_105",
    (c: CountryScope) => c.militaryFactories > 50 && c.militaryFactories < 120,
  ),
  ScriptedTrigger(
    "rq_policy_106",
    (c: CountryScope) =>
      c.triggers.has_tech("improved_light_td") ||
      c.triggers.can_research("improved_light_td") ||
      c.triggers.is_researching_technology("improved_light_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_107",
    (c: CountryScope) => c.triggers.is_major(true) && c.dateAfter("1936.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_108",
    (c: CountryScope) => c.triggers.is_major(true) && c.dateAfter("1938.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_109",
    (c: CountryScope) => c.triggers.is_major(true) && c.dateAfter("1940.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_110",
    (c: CountryScope) =>
      c.triggers.has_tech("improved_medium_art") ||
      c.triggers.can_research("improved_medium_art") ||
      c.triggers.is_researching_technology("improved_medium_tank"),
  ),
  ScriptedTrigger("rq_policy_111", (c: CountryScope) =>
    c.triggers.tag(country("Ger", { spelling: "verbatim" })),
  ),
  ScriptedTrigger(
    "rq_policy_112",
    (c: CountryScope) =>
      c.triggers.has_tech("improved_medium_spaa") ||
      c.triggers.can_research("improved_medium_spaa") ||
      c.triggers.is_researching_technology("improved_medium_tank"),
  ),
  // Source NOT with two children is NOR. Both negations are intentional.
  ScriptedTrigger(
    "rq_policy_113",
    (c: CountryScope) =>
      c.triggers.is_major(true) &&
      !c.triggers.tag(country("JAP")) &&
      !(c.militaryFactories < 50) &&
      c.dateAfter("1938.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_114",
    (c: CountryScope) =>
      c.triggers.tag(country("GER")) && c.triggers.has_opinion_modifier("sov_ger_treaty"),
  ),
  ScriptedTrigger(
    "rq_policy_115",
    (c: CountryScope) =>
      c.triggers.is_major(true) &&
      !(c.triggers.tag(country("JAP")) && c.militaryFactories < 50) &&
      c.dateAfter("1938.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_116",
    (c: CountryScope) => c.triggers.tag(country("USA")) && c.dateAfter("1940.3.1"),
  ),
  ScriptedTrigger(
    "rq_policy_117",
    (c: CountryScope) =>
      c.triggers.tag(country("GER")) &&
      c.triggers.has_completed_focus("GER_advanced_panzer_research") &&
      c.triggers.has_tech_bonus({ category: "cat_medium_armor" }),
  ),
  ScriptedTrigger(
    "rq_policy_118",
    (c: CountryScope) =>
      c.triggers.tag(country("GER")) &&
      !c.triggers.has_completed_focus("GER_advanced_panzer_research"),
  ),
  ScriptedTrigger(
    "rq_policy_119",
    (c: CountryScope) => c.triggers.tag(country("ENG")) && c.dateAfter("1938.11.1"),
  ),
  ScriptedTrigger(
    "rq_policy_120",
    (c: CountryScope) =>
      c.triggers.tag(country("SOV")) &&
      c.triggers.any_enemy_country((e) =>
        e.countryMatches(
          countryTarget("ROOT"),
          (root) => root.estimatedMaxArmor(countryTarget("PREV")) > 30,
        ),
      ),
  ),
  ScriptedTrigger(
    "rq_policy_121",
    (c: CountryScope) =>
      c.triggers.has_tech("improved_medium_td") ||
      c.triggers.can_research("improved_medium_td") ||
      c.triggers.is_researching_technology("improved_medium_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_122",
    (c: CountryScope) =>
      c.triggers.tag(country("GER")) ||
      c.triggers.tag(country("USA")) ||
      c.triggers.tag(country("ENG")) ||
      c.triggers.tag(country("SOV")),
  ),
  ScriptedTrigger(
    "rq_policy_123",
    (c: CountryScope) => c.triggers.tag(country("ENG")) || c.triggers.tag(country("JAP")),
  ),
  ScriptedTrigger(
    "rq_policy_124",
    (c: CountryScope) => c.triggers.tag(country("GER")) || c.triggers.tag(country("HOL")),
  ),
  ScriptedTrigger(
    "rq_policy_125",
    (c: CountryScope) => !c.triggers.has_war_with("ENG") && !c.triggers.has_war_with("USA"),
  ),
  ScriptedTrigger(
    "rq_policy_126",
    (c: CountryScope) =>
      c.triggers.tag(country("JAP")) ||
      c.triggers.tag(country("USA")) ||
      c.triggers.tag(country("GER")),
  ),
  ScriptedTrigger("rq_policy_127", (c: CountryScope) => c.factories > 25),
  ScriptedTrigger("rq_policy_128", (c: CountryScope) => c.dateAfter("1936.1.1")),
  ScriptedTrigger("rq_policy_129", (c: CountryScope) => c.triggers.tag(country("ENG"))),
  ScriptedTrigger(
    "rq_policy_130",
    (c: CountryScope) => c.triggers.tag(country("USA")) || c.dateAfter("1939.6.1"),
  ),
  ScriptedTrigger("rq_policy_131", (c: CountryScope) => c.dateBefore("1938.1.1")),
  ScriptedTrigger("rq_policy_132", (c: CountryScope) => c.dateAfter("1939.6.1")),
  ScriptedTrigger("rq_policy_133", (c: CountryScope) => c.dateAfter("1940.6.1")),
  ScriptedTrigger("rq_policy_134", (c: CountryScope) => c.dateBefore("1940.1.1")),
  ScriptedTrigger("rq_policy_135", (c: CountryScope) => c.dateAfter("1938.1.6")),
  ScriptedTrigger("rq_policy_136", (c: CountryScope) => !c.triggers.tag(country("GER"))),
  ScriptedTrigger("rq_policy_137", (c: CountryScope) => c.triggers.has_tech("dispersed_industry")),
  ScriptedTrigger("rq_policy_138", (c: CountryScope) =>
    c.triggers.is_researching_technology("dispersed_industry"),
  ),
  ScriptedTrigger("rq_policy_139", (c: CountryScope) => c.triggers.has_war(false)),
  ScriptedTrigger(
    "rq_policy_140",
    (c: CountryScope) =>
      c.triggers.has_tech("CAS2") || c.triggers.is_researching_technology("CAS2"),
  ),
  ScriptedTrigger(
    "rq_policy_141",
    (c: CountryScope) => c.triggers.tag(country("USA")) || c.triggers.tag(country("JAP")),
  ),
  ScriptedTrigger(
    "rq_policy_142",
    (c: CountryScope) => c.triggers.has_war_with("USA") || c.triggers.has_war_with("JAP"),
  ),
  ScriptedTrigger("rq_policy_143", (c: CountryScope) => c.navySize("carrier") > 0),
  ScriptedTrigger("rq_policy_144", (c: CountryScope) => c.navySize("carrier") < 1),
  ScriptedTrigger(
    "rq_policy_145",
    (c: CountryScope) =>
      c.triggers.has_tech("CAS3") || c.triggers.is_researching_technology("CAS3"),
  ),
  ScriptedTrigger(
    "rq_policy_146",
    (c: CountryScope) =>
      c.triggers.has_tech("fighter1") || c.triggers.is_researching_technology("fighter1"),
  ),
  ScriptedTrigger("rq_policy_147", (c: CountryScope) => c.navySize("carrier") > 3),
  ScriptedTrigger(
    "rq_policy_148",
    (c: CountryScope) =>
      c.triggers.has_tech("fighter2") || c.triggers.is_researching_technology("fighter2"),
  ),
  ScriptedTrigger(
    "rq_policy_149",
    (c: CountryScope) => c.triggers.is_historical_focus_on(true) && c.triggers.tag(country("JAP")),
  ),
  ScriptedTrigger("rq_policy_150", (c: CountryScope) => c.dateAfter("1941.6.1")),
  ScriptedTrigger(
    "rq_policy_151",
    (c: CountryScope) =>
      c.triggers.has_tech("fighter3") || c.triggers.is_researching_technology("fighter3"),
  ),
  ScriptedTrigger(
    "rq_policy_152",
    (c: CountryScope) =>
      c.triggers.has_tech("naval_bomber2") || c.triggers.is_researching_technology("naval_bomber2"),
  ),
  ScriptedTrigger(
    "rq_policy_153",
    (c: CountryScope) =>
      c.triggers.has_tech("naval_bomber3") || c.triggers.is_researching_technology("naval_bomber3"),
  ),
  ScriptedTrigger(
    "rq_policy_154",
    (c: CountryScope) =>
      c.triggers.has_war_with("USA") ||
      c.triggers.has_war_with("JAP") ||
      c.triggers.has_war_with("ENG"),
  ),
  ScriptedTrigger("rq_policy_155", (c: CountryScope) => c.dateBefore("1937.1.1")),
  ScriptedTrigger("rq_policy_156", (c: CountryScope) => c.navySize() < 10),
  ScriptedTrigger(
    "rq_policy_157",
    (c: CountryScope) => c.triggers.is_historical_focus_on(true) && c.triggers.tag(country("JAP")),
  ),
  ScriptedTrigger("rq_policy_158", (c: CountryScope) => c.dateBefore("1939.1.1")),
  ScriptedTrigger("rq_policy_159", (c: CountryScope) => c.dateBefore("1941.1.1")),
  ScriptedTrigger("rq_policy_160", (c: CountryScope) =>
    c.triggers.has_tech("concentrated_industry"),
  ),
  ScriptedTrigger("rq_policy_161", (c: CountryScope) =>
    c.triggers.is_researching_technology("concentrated_industry"),
  ),
  ScriptedTrigger("rq_policy_162", (c: CountryScope) => c.militaryFactories < 10),
  ScriptedTrigger(
    "rq_policy_163",
    (c: CountryScope) => c.triggers.is_major(true) && c.dateAfter("1940.6.1"),
  ),
  ScriptedTrigger(
    "rq_policy_164",
    (c: CountryScope) => c.triggers.original_tag(country("GER")) && c.dateBefore("1940.12.1"),
  ),
  ScriptedTrigger(
    "rq_policy_165",
    (c: CountryScope) =>
      c.resource("oil") > 0 ||
      c.resource("aluminium") > 0 ||
      c.resource("rubber") > 0 ||
      c.resource("tungsten") > 0 ||
      c.resource("steel") > 0 ||
      c.resource("chromium") > 0 ||
      c.resource("coal") > 0,
  ),
  ScriptedTrigger(
    "rq_policy_166",
    (c: CountryScope) =>
      c.resource("oil") > 8 ||
      c.resource("aluminium") > 8 ||
      c.resource("rubber") > 8 ||
      c.resource("tungsten") > 8 ||
      c.resource("steel") > 8 ||
      c.resource("chromium") > 8 ||
      c.resource("coal") > 8,
  ),
  ScriptedTrigger(
    "rq_policy_167",
    (c: CountryScope) => c.triggers.original_tag(country("GER")) && c.dateBefore("1941.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_168",
    (c: CountryScope) =>
      (c.triggers.tag(country("USA")) ||
        c.triggers.tag(country("ENG")) ||
        c.triggers.tag(country("JAP")) ||
        c.triggers.tag(country("ITA"))) &&
      c.dateAfter("1939.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_169",
    (c: CountryScope) =>
      (c.triggers.tag(country("USA")) ||
        c.triggers.tag(country("ENG")) ||
        c.triggers.tag(country("JAP")) ||
        c.triggers.tag(country("ITA"))) &&
      c.dateAfter("1941.1.1"),
  ),
  ScriptedTrigger("rq_policy_170", (c: CountryScope) => c.militaryFactories > 10),
  ScriptedTrigger("rq_policy_171", (c: CountryScope) => c.militaryFactories > 20),
  ScriptedTrigger("rq_policy_172", (c: CountryScope) => c.militaryFactories > 30),
  ScriptedTrigger("rq_policy_173", (c: CountryScope) => c.navalFactories > 10),
  ScriptedTrigger("rq_policy_174", (c: CountryScope) => c.navalFactories > 20),
  ScriptedTrigger("rq_policy_175", (c: CountryScope) => c.navalFactories > 30),
  ScriptedTrigger("rq_policy_176", (c: CountryScope) => c.militaryFactories > 40),
  ScriptedTrigger("rq_policy_177", (c: CountryScope) => c.navalFactories > 40),
  ScriptedTrigger("rq_policy_178", (c: CountryScope) => c.resource("oil") > 10),
  ScriptedTrigger("rq_policy_179", (c: CountryScope) => c.resource("oil") > 20),
  ScriptedTrigger("rq_policy_180", (c: CountryScope) => c.resource("oil") > 30),
  ScriptedTrigger("rq_policy_181", (c: CountryScope) => c.militaryFactories > 50),
  ScriptedTrigger("rq_policy_182", (c: CountryScope) => c.navalFactories > 50),
  ScriptedTrigger(
    "rq_policy_183",
    (c: CountryScope) =>
      c.triggers.can_research("advanced_fire_control_system") ||
      c.triggers.has_tech("advanced_fire_control_system"),
  ),
  ScriptedTrigger("rq_policy_184", (c: CountryScope) =>
    c.triggers.has_tech("improved_ship_hull_heavy"),
  ),
  ScriptedTrigger(
    "rq_policy_185",
    (c: CountryScope) =>
      c.triggers.has_tech("advanced_heavy_art") ||
      c.triggers.can_research("advanced_heavy_art") ||
      c.triggers.is_researching_technology("advanced_heavy_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_186",
    (c: CountryScope) =>
      c.triggers.has_tech("advanced_heavy_spaa") ||
      c.triggers.can_research("advanced_heavy_spaa") ||
      c.triggers.is_researching_technology("advanced_heavy_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_187",
    (c: CountryScope) =>
      c.triggers.can_research("advanced_heavy_tank") || c.triggers.has_tech("advanced_heavy_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_188",
    (c: CountryScope) =>
      c.triggers.tag(country("GER")) &&
      c.triggers.has_completed_focus("GER_expand_kummersdorfs_capacity") &&
      c.triggers.has_tech_bonus({ category: "cat_heavy_armor" }),
  ),
  ScriptedTrigger(
    "rq_policy_189",
    (c: CountryScope) =>
      c.triggers.has_tech("advanced_heavy_td") ||
      c.triggers.can_research("advanced_heavy_td") ||
      c.triggers.is_researching_technology("advanced_heavy_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_190",
    (c: CountryScope) =>
      c.triggers.has_tech("advanced_light_art") ||
      c.triggers.can_research("advanced_light_art") ||
      c.triggers.is_researching_technology("advanced_light_tank"),
  ),
  ScriptedTrigger("rq_policy_191", (c: CountryScope) =>
    c.triggers.has_tech("improved_ship_hull_light"),
  ),
  ScriptedTrigger(
    "rq_policy_192",
    (c: CountryScope) =>
      c.triggers.tag(country("USA")) ||
      c.triggers.tag(country("ENG")) ||
      c.triggers.tag(country("ITA")) ||
      c.triggers.tag(country("JAP")),
  ),
  ScriptedTrigger(
    "rq_policy_193",
    (c: CountryScope) =>
      c.triggers.has_tech("advanced_light_spaa") ||
      c.triggers.can_research("advanced_light_spaa") ||
      c.triggers.is_researching_technology("advanced_light_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_194",
    (c: CountryScope) =>
      c.triggers.is_major(true) && !c.triggers.tag(country("JAP")) && !(c.militaryFactories < 50),
  ),
  ScriptedTrigger(
    "rq_policy_195",
    (c: CountryScope) =>
      c.triggers.is_major(true) && !c.triggers.tag(country("JAP")) && c.triggers.has_war(true),
  ),
  ScriptedTrigger(
    "rq_policy_196",
    (c: CountryScope) =>
      c.triggers.is_major(true) && !(c.triggers.tag(country("JAP")) && c.militaryFactories < 50),
  ),
  ScriptedTrigger(
    "rq_policy_197",
    (c: CountryScope) => c.triggers.tag(country("ENG")) && c.dateAfter("1936.9.1"),
  ),
  ScriptedTrigger(
    "rq_policy_198",
    (c: CountryScope) => c.triggers.tag(country("USA")) && c.dateAfter("1940.9.1"),
  ),
  ScriptedTrigger(
    "rq_policy_199",
    (c: CountryScope) =>
      c.triggers.has_tech("advanced_light_td") ||
      c.triggers.can_research("advanced_light_td") ||
      c.triggers.is_researching_technology("advanced_light_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_200",
    (c: CountryScope) => c.triggers.is_major(true) && c.dateAfter("1941.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_201",
    (c: CountryScope) =>
      c.triggers.has_tech("advanced_medium_art") ||
      c.triggers.can_research("advanced_medium_art") ||
      c.triggers.is_researching_technology("advanced_medium_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_202",
    (c: CountryScope) =>
      c.triggers.has_tech("advanced_medium_spaa") ||
      c.triggers.can_research("advanced_medium_spaa") ||
      c.triggers.is_researching_technology("advanced_medium_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_203",
    (c: CountryScope) => c.triggers.tag(country("SOV")) && c.dateAfter("1940.3.1"),
  ),
  ScriptedTrigger(
    "rq_policy_204",
    (c: CountryScope) => c.triggers.tag(country("USA")) && c.dateAfter("1941.6.1"),
  ),
  ScriptedTrigger(
    "rq_policy_205",
    (c: CountryScope) => c.triggers.tag(country("ENG")) && c.dateAfter("1942.9.1"),
  ),
  ScriptedTrigger(
    "rq_policy_206",
    (c: CountryScope) =>
      c.triggers.tag(country("SOV")) &&
      c.triggers.has_war(true) &&
      c.triggers.any_enemy_country((e) =>
        e.countryMatches(
          countryTarget("ROOT"),
          (root) => root.estimatedMaxArmor(countryTarget("PREV")) > 32,
        ),
      ),
  ),
  ScriptedTrigger(
    "rq_policy_207",
    (c: CountryScope) =>
      c.triggers.has_tech("advanced_medium_td") ||
      c.triggers.can_research("advanced_medium_td") ||
      c.triggers.is_researching_technology("advanced_medium_tank"),
  ),
  ScriptedTrigger(
    "rq_policy_208",
    (c: CountryScope) => c.triggers.original_tag(country("GER")) && c.triggers.has_war(true),
  ),
  ScriptedTrigger("rq_policy_209", (c: CountryScope) => c.dateAfter("1939.8.1")),
  ScriptedTrigger(
    "rq_policy_210",
    (c: CountryScope) => c.triggers.original_tag(country("GER")) && c.dateBefore("1940.2.1"),
  ),
  ScriptedTrigger("rq_policy_211", (c: CountryScope) => c.dateAfter("1938.6.1")),
  ScriptedTrigger(
    "rq_policy_212",
    (c: CountryScope) =>
      c.triggers.original_tag(country("CHI")) &&
      (c.dateAfter("1937.1.1") || c.countryMatches(country("JAP"), (jap) => !jap.isAI)),
  ),
  ScriptedTrigger("rq_policy_213", (c: CountryScope) => c.dateAfter("1936.1.3")),
  ScriptedTrigger(
    "rq_policy_214",
    (c: CountryScope) => c.dateBefore("1939.1.1") && c.triggers.original_tag(country("PRC")),
  ),
  ScriptedTrigger(
    "rq_policy_215",
    (c: CountryScope) =>
      c.triggers.tag(country("CHI")) ||
      c.triggers.tag(country("PRC")) ||
      c.triggers.tag(country("XSM")) ||
      c.triggers.tag(country("SIK")) ||
      c.triggers.tag(country("GXC")) ||
      c.triggers.tag(country("SHX")) ||
      c.triggers.tag(country("YUN")),
  ),
  ScriptedTrigger(
    "rq_policy_216",
    (c: CountryScope) => c.dateBefore("1939.1.1") && c.triggers.tag(country("PRC")),
  ),
  ScriptedTrigger(
    "rq_policy_217",
    (c: CountryScope) =>
      c.triggers.tag(country("JAP")) &&
      !(c.triggers.has_war_with("SOV") || c.triggers.has_war_with("USA")),
  ),
  ScriptedTrigger("rq_policy_218", (c: CountryScope) => c.triggers.original_tag(country("JAP"))),
  ScriptedTrigger("rq_policy_219", (c: CountryScope) => c.militaryFactories < 30),
  ScriptedTrigger(
    "rq_policy_220",
    (c: CountryScope) => c.triggers.tag(country("USA")) && c.dateAfter("1937.1.1"),
  ),
  ScriptedTrigger("rq_policy_221", (c: CountryScope) => c.militaryFactories < 15),
  ScriptedTrigger("rq_policy_222", (c: CountryScope) => c.militaryFactories < 7),
  ScriptedTrigger(
    "rq_policy_223",
    (c: CountryScope) => c.deployedAircraft("strategic_bomber") > 500,
  ),
  ScriptedTrigger("rq_policy_224", (c: CountryScope) => !c.triggers.has_war(true)),
  ScriptedTrigger(
    "rq_policy_225",
    (c: CountryScope) =>
      c.triggers.tag(country("JAP")) &&
      (c.triggers.has_war_with("USA") ||
        c.countryMatches(
          country("CHI"),
          (chi) =>
            chi.triggers.has_capitulated(true) ||
            chi.triggers.exists(false) ||
            chi.triggers.is_subject_of(country("JAP")),
        )),
  ),
  ScriptedTrigger(
    "rq_policy_226",
    (c: CountryScope) =>
      (c.triggers.tag(country("ENG")) || c.triggers.tag(country("USA"))) &&
      c.triggers.has_war_with("GER"),
  ),
  ScriptedTrigger(
    "rq_policy_227",
    (c: CountryScope) =>
      (c.triggers.tag(country("ENG")) || c.triggers.tag(country("USA"))) &&
      c.triggers.has_war_with("GER") &&
      c.countryMatches(country("GER"), (ger) => ger.triggers.has_war_with("SOV")),
  ),
  ScriptedTrigger(
    "rq_policy_228",
    (c: CountryScope) => c.triggers.tag(country("ENG")) && c.dateAfter("1944.9.1"),
  ),
  ScriptedTrigger(
    "rq_policy_229",
    (c: CountryScope) => c.triggers.tag(country("USA")) && c.dateAfter("1942.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_230",
    (c: CountryScope) => c.triggers.tag(country("ENG")) && c.dateAfter("1941.6.1"),
  ),
  ScriptedTrigger("rq_policy_231", (c: CountryScope) => c.triggers.has_war_with("JAP")),
  ScriptedTrigger(
    "rq_policy_232",
    (c: CountryScope) =>
      c.triggers.has_war_with("ENG") ||
      c.triggers.has_war_with("USA") ||
      c.triggers.has_war_with("JAP"),
  ),
  ScriptedTrigger("rq_policy_233", (c: CountryScope) => c.deployedAircraft("naval_bomber") > 500),
  ScriptedTrigger("rq_policy_234", (c: CountryScope) => c.dateAfter("1945.1.9")),
  ScriptedTrigger("rq_policy_235", (c: CountryScope) => c.dateAfter("1946.1.6")),
  ScriptedTrigger(
    "rq_policy_236",
    (c: CountryScope) => c.triggers.original_tag(country("GER")) && c.dateAfter("1937.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_237",
    (c: CountryScope) => c.triggers.tag(country("USA")) && c.dateAfter("1943.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_238",
    (c: CountryScope) =>
      c.triggers.tag(country("GER")) &&
      c.triggers.has_completed_focus("GER_anschluss") &&
      c.countryMatches(country("CZE"), (cze) => !cze.isAI),
  ),
  ScriptedTrigger(
    "rq_policy_239",
    (c: CountryScope) =>
      c.triggers.tag(country("GER")) && c.triggers.has_completed_focus("GER_fallschirmjager"),
  ),
  ScriptedTrigger("rq_policy_240", (c: CountryScope) =>
    c.triggers.has_tech("basic_medium_airframe"),
  ),
  ScriptedTrigger(
    "rq_policy_241",
    (c: CountryScope) => c.triggers.tag(country("GER")) || c.triggers.tag(country("SOV")),
  ),
  ScriptedTrigger("rq_policy_242", (c: CountryScope) => c.triggers.tag(country("BRA"))),
  ScriptedTrigger(
    "rq_policy_243",
    (c: CountryScope) => c.triggers.tag(country("SOV")) && c.dateAfter("1941.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_244",
    (c: CountryScope) => c.triggers.original_tag(country("GER")) && c.dateAfter("1938.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_245",
    (c: CountryScope) =>
      c.triggers.has_tech("fighter1") &&
      c.triggers.has_tech("tactical_bomber1") &&
      c.triggers.has_tech("CAS1"),
  ),
  ScriptedTrigger(
    "rq_policy_246",
    (c: CountryScope) =>
      c.triggers.has_tech("fighter2") &&
      c.triggers.has_tech("tactical_bomber2") &&
      c.triggers.has_tech("CAS2"),
  ),
  ScriptedTrigger(
    "rq_policy_247",
    (c: CountryScope) =>
      c.dateAfter("1943.9.1") &&
      !c.triggers.has_government("democratic") &&
      c.militaryFactories > 150,
  ),
  ScriptedTrigger(
    "rq_policy_248",
    (c: CountryScope) =>
      c.triggers.original_tag(country("GER")) &&
      c.dateAfter("1944.5.1") &&
      c.surrenderProgress < 0.1 &&
      c.triggers.has_government("fascism") &&
      c.triggers.has_war_with("SOV"),
  ),
  ScriptedTrigger(
    "rq_policy_249",
    (c: CountryScope) => c.triggers.tag(country("GER")) && c.triggers.is_historical_focus_on(true),
  ),
  ScriptedTrigger(
    "rq_policy_250",
    (c: CountryScope) =>
      c.triggers.original_tag(country("CHI")) ||
      c.triggers.original_tag(country("PRC")) ||
      c.triggers.original_tag(country("XSM")) ||
      c.triggers.original_tag(country("SIK")) ||
      c.triggers.original_tag(country("GXC")) ||
      c.triggers.original_tag(country("SHX")) ||
      c.triggers.original_tag(country("YUN")) ||
      c.triggers.original_tag(country("MAN")) ||
      c.triggers.original_tag(country("MEN")) ||
      c.triggers.original_tag(country("JAP")) ||
      c.triggers.original_tag(country("GSM")) ||
      c.triggers.original_tag(country("NXM")) ||
      c.triggers.original_tag(country("HBC")) ||
      c.triggers.original_tag(country("SND")) ||
      c.triggers.original_tag(country("GDC")) ||
      c.triggers.original_tag(country("KHM")),
  ),
  ScriptedTrigger("rq_policy_251", (c: CountryScope) => c.triggers.has_war(true)),
  ScriptedTrigger(
    "rq_policy_252",
    (c: CountryScope) =>
      c.triggers.original_tag(country("CHI")) && !c.triggers.has_dlc("No Compromise, No Surrender"),
  ),
  ScriptedTrigger(
    "rq_policy_253",
    (c: CountryScope) => c.triggers.tag(country("GER")) && c.dateAfter("1942.1.1"),
  ),
  ScriptedTrigger(
    "rq_policy_254",
    (c: CountryScope) =>
      c.triggers.tag(country("GER")) &&
      c.countryMatches(country("POL"), (pol) => pol.triggers.has_capitulated(true)) &&
      c.countryMatches(country("GER"), (ger) => ger.triggers.has_war(true)),
  ),
  ScriptedTrigger("rq_policy_255", (c: CountryScope) => c.triggers.tag(country("ITA"))),
] as const;
