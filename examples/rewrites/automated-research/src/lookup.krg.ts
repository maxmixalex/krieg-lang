import { nationalNames } from "./national-name-facts.krg.ts";
import { ScriptedEffect, country, type CountryScope } from "krieg-lang/hoi4";
import { technologies } from "./technologies.krg.ts";

// Technology 1 and the final entry are also the native table's end buckets.
const compatibility = { first: 1, outOfRange: "clamp" } as const;
export const grant = ScriptedEffect("rq_grant_tech", (country: CountryScope) => {
  country.dispatchByIndex(
    "rq_t",
    technologies,
    (c, tech) => {
      c.grantTechnology(tech.id, { popup: true });
    },
    compatibility,
  );
});
export const costAndDate = ScriptedEffect("rq_tech_data", (country: CountryScope) => {
  country.dispatchByIndex(
    "rq_t",
    technologies,
    (c, tech) => {
      c.setTempVariable("rq_base_cost", tech.baseCost);
      c.setTempVariable("rq_start_months", tech.startMonths);
    },
    compatibility,
  );
});
export const nameFont = ScriptedEffect("rq_name_fs", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_t",
    technologies,
    (owner, tech, ordinal) => {
      owner.setTempVariable("rq_fs", tech.font);
      for (const choice of nationalNames[ordinal - 1].font) {
        if (owner.triggers.tag(country(choice.tag))) owner.setTempVariable("rq_fs", choice.value);
      }
    },
    compatibility,
  );
});
export const nameRank = ScriptedEffect("rq_name_rank", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_t",
    technologies,
    (owner, tech, ordinal) => {
      owner.setTempVariable("rq_nr", tech.rank);
      for (const choice of nationalNames[ordinal - 1].rank) {
        if (owner.triggers.tag(country(choice.tag))) owner.setTempVariable("rq_nr", choice.value);
      }
    },
    compatibility,
  );
});
export const owned = ScriptedEffect("rq_check_owned", (country: CountryScope) => {
  country.setTempVariable("rq_owned", 0);
  country.dispatchByIndex(
    "rq_t",
    technologies,
    (c, tech) => {
      if (c.triggers.has_tech(tech.id)) c.setTempVariable("rq_owned", 1);
    },
    compatibility,
  );
});
