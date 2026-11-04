import { ScriptedEffect, country, type CountryScope } from "krieg-lang/hoi4";
import { searchWords } from "./search-words.krg.ts";

export const nameCodes = ScriptedEffect("rq_name_codes", (c: CountryScope) => {
  c.clearArray("rq_nc");
  c.dispatchByIndex(
    "rq_t",
    searchWords,
    (c, word) => {
      for (const code of word.codes) c.arrayPush("rq_nc", code);
      for (const spelling of word.variants) {
        if (spelling.tags.some((tag) => c.triggers.tag(country(tag)))) {
          c.clearArray("rq_nc");
          for (const code of spelling.codes) c.arrayPush("rq_nc", code);
        }
      }
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const searchPrep = ScriptedEffect("rq_search_prep", (c: CountryScope) => {
  c.clearArray("rq_ql");
  c.forEachValue("rq_tx_s", { value: "rq_search_char" }, (c) => {
    c.setTempVariable("rq_c", c.variable("rq_search_char"));
    if (c.variable("rq_c") > 26 && c.variable("rq_c") < 53) c.subtractTempVariable("rq_c", 26);
    c.arrayPush("rq_ql", c.variable("rq_c"));
  });
});
export const searchMatch = ScriptedEffect("rq_search_match", (c: CountryScope) => {
  c.run(nameCodes);
  c.setTempVariable("rq_hit", 0);
  c.setTempVariable("rq_ms", 0);
  c.setTempVariable("rq_mend", c.arrayLength("rq_nc") - c.arrayLength("rq_ql") + 1);
  c.whileLoop(
    (c) => c.variable("rq_hit") === 0 && c.variable("rq_ms") < c.variable("rq_mend"),
    (c) => {
      c.setTempVariable("rq_mok", 1);
      c.setTempVariable("rq_mj", 0);
      c.whileLoop(
        (c) => c.variable("rq_mok") === 1 && c.variable("rq_mj") < c.arrayLength("rq_ql"),
        (c) => {
          c.setTempVariable("rq_mx", c.variable("rq_ms") + c.variable("rq_mj"));
          if (c.arrayAt("rq_nc", c.variable("rq_mx")) !== c.arrayAt("rq_ql", c.variable("rq_mj")))
            c.setTempVariable("rq_mok", 0);
          c.addTempVariable("rq_mj", 1);
        },
      );
      if (c.variable("rq_mok") === 1) c.setTempVariable("rq_hit", 1);
      c.addTempVariable("rq_ms", 1);
    },
  );
});
export function searchFilter(c: CountryScope) {
  if (c.arrayLength("rq_tx_s") > 0) {
    c.run(searchPrep);
    c.clearArray("rq_search_view");
    c.forEachValue("rq_view", { value: "rq_search_row" }, (c) => {
      c.setTempVariable("rq_t", c.arrayAt("rq_queue", c.variable("rq_search_row")));
      c.run(searchMatch);
      if (c.variable("rq_hit") === 1) c.arrayPush("rq_search_view", c.variable("rq_search_row"));
    });
    c.clearArray("rq_view");
    c.forEachValue("rq_search_view", { value: "rq_search_row" }, (c) =>
      c.arrayPush("rq_view", c.variable("rq_search_row")),
    );
    c.clearArray("rq_search_view");
  }
}
