import {
  CountryDefinition,
  Character,
  CountryHistory,
  SourceFile,
  StateHistory,
  country,
  state,
  cwt,
  type CountryScope,
} from "krieg-lang/hoi4";
import * as pdx from "krieg-lang/pdx";
import { initialiseDevelopment } from "./systems.krg.ts";

// An original fictional country placed in the supplied world's actual state/province layout.
export const nation = CountryDefinition({
  id: "KRG",
  graphicalCulture: "western_european_gfx",
  graphicalCulture2d: "western_european_2d",
  color: [26, 91, 108],
  outputPath: "common/countries/Civic Republic.txt",
});
export const leader = Character({
  id: "civ_valenti",
  name: "civ_valenti",
  gender: "female",
  portraits: { civilian: { large: "GFX_civ_leader" } },
  countryLeader: [
    { ideology: "liberalism", desc: "civ_valenti_desc", traits: [], expire: "1965.1.1.1" },
    { ideology: "civ_cooperativism", traits: [], expire: "1965.1.1.1" },
  ],
});
export const history = CountryHistory({
  country: country("KRG"),
  capital: state(1),
  oob: "civ_1936",
  startingTrainBuffer: 1,
  history: (country: CountryScope) => {
    country.effects.set_politics({
      ruling_party: "democratic",
      elections_allowed: true,
      last_election: "1935.1.1",
      election_frequency: 48,
    });
    country.effects.set_popularities(cwt([pdx.property("democratic", pdx.atom("100"))]));
    country.effects.set_technology(cwt([pdx.property("infantry_weapons", pdx.atom("1"))]));
    initialiseDevelopment(country);
    country.effects.set_stability(0.65);
    country.effects.set_war_support(0.2);
    country.effects.set_political_power(100);
    country.effects.recruit_character("civ_valenti");
    country.effects.setVariable({ var: "civ_workshop_bonus", value: 0.03 });
    country.effects.setVariable({ var: "civ_investment", value: 0 });
    country.effects.setVariable({ var: "civ_gui_dirty", value: 0 });
    country.effects.setVariable({ var: "civ_bond_value", value: 10 });
  },
});
export const island = StateHistory({
  state: state(1),
  path: "history/states/1-France.txt",
  name: "civ_island_name",
  manpower: 325000,
  category: "town",
  provinces: [3838, 9851, 11804],
  owner: country("KRG"),
  cores: [country("KRG"), country("FRA")],
  resources: { steel: 2 },
  buildings: {
    infrastructure: 3,
    industrial_complex: 2,
    arms_factory: 1,
    air_base: 1,
    3838: { naval_base: 2, supply_node: 1 },
  },
  victoryPoints: [{ province: 3838, value: 5 }],
  localSupplies: 0.2,
});

// Full native ordered syntax expresses repeated infantry entries without object-key loss.
export const units = SourceFile(
  "history/units/civ_1936.txt",
  pdx.document([
    pdx.property(
      "division_template",
      pdx.block([
        pdx.property("name", pdx.string("Island Guard")),
        pdx.property(
          "regiments",
          pdx.block([
            pdx.property(
              "infantry",
              pdx.block([pdx.property("x", pdx.atom("0")), pdx.property("y", pdx.atom("0"))]),
            ),
            pdx.property(
              "infantry",
              pdx.block([pdx.property("x", pdx.atom("0")), pdx.property("y", pdx.atom("1"))]),
            ),
            pdx.property(
              "infantry",
              pdx.block([pdx.property("x", pdx.atom("1")), pdx.property("y", pdx.atom("0"))]),
            ),
            pdx.property(
              "infantry",
              pdx.block([pdx.property("x", pdx.atom("1")), pdx.property("y", pdx.atom("1"))]),
            ),
          ]),
        ),
      ]),
    ),
    pdx.property(
      "units",
      pdx.block([
        pdx.property(
          "division",
          pdx.block([
            pdx.property("name", pdx.string("1st Island Guard")),
            pdx.property("location", pdx.atom("3838")),
            pdx.property("division_template", pdx.string("Island Guard")),
            pdx.property("start_experience_factor", pdx.atom("0.2")),
            pdx.property("start_equipment_factor", pdx.atom("1")),
          ]),
        ),
      ]),
    ),
  ]),
);
