import { ScriptedEffect, countryTarget, type CountryScope } from "krieg-lang/hoi4";

/** A semantic rewrite of Yard1's iterative randomized quicksort, with reimu's country projection.
 * The original shared sort_var/last_sort_var reversal behavior is deliberately retained.
 */
function quicksort(c: CountryScope, array: string, metric: string): void {
  c.setVariable("high", c.variable(array + "^num"));
  c.subtractVariable("high", 1);
  c.setVariable("low", 0);
  c.setTempVariable("stack_size", c.variable("high"));
  c.subtractTempVariable("stack_size", c.variable("low"));
  c.addTempVariable("stack_size", 1);
  c.effects.resize_temp_array({ array: "stack", value: 0, size: c.variable("stack_size") });
  c.setTempVariable("top", 0);
  c.setTempVariable("stack^top", c.variable("low"));
  c.addTempVariable("top", 1);
  c.setTempVariable("stack^top", c.variable("high"));
  c.whileLoop(
    (s) => s.variable("top") >= 0,
    (s) => {
      s.setVariable("high", s.variable("stack^top"));
      s.subtractTempVariable("top", 1);
      s.setVariable("low", s.variable("stack^top"));
      s.subtractTempVariable("top", 1);
      s.setVariable("random_pivot", s.variable("random"));
      s.multiplyVariable("random_pivot", s.variable("high"));
      s.effects.round_variable("random_pivot");
      s.addVariable("random_pivot", s.variable("low"));
      s.clampVariable("random_pivot", { min: s.variable("low"), max: s.variable("high") });
      swap(s, array, "high", "random_pivot");
      s.setTempVariable("idx", s.variable("low"));
      s.subtractTempVariable("idx", 1);
      s.country(countryTarget(`var:${array}^high`), (pivot) =>
        pivot.setVariable("PREV.minimum", pivot.variable(metric)),
      );
      s.forRange({ start: s.variable("low"), end: s.variable("high") }, (loop) => {
        loop.country(countryTarget(`var:${array}^v`), (entry) =>
          entry.setVariable("PREV.tmp", entry.variable(metric)),
        );
        if (loop.variable("tmp") >= loop.variable("minimum")) {
          loop.addTempVariable("idx", 1);
          swap(loop, array, "idx", "v");
        }
      });
      s.addTempVariable("idx", 1);
      swap(s, array, "idx", "high");
      s.setTempVariable("qs_partition_return", s.variable("idx"));
      s.setTempVariable("qs_partition_return_plus_1", s.variable("qs_partition_return"));
      s.setTempVariable("qs_partition_return_minus_1", s.variable("qs_partition_return"));
      s.addTempVariable("qs_partition_return_plus_1", 1);
      s.subtractTempVariable("qs_partition_return_minus_1", 1);
      if (s.variable("qs_partition_return_minus_1") > s.variable("low")) {
        s.addTempVariable("top", 1);
        s.setTempVariable("stack^top", s.variable("low"));
        s.addTempVariable("top", 1);
        s.setTempVariable("stack^top", s.variable("qs_partition_return_minus_1"));
      }
      if (s.variable("qs_partition_return_plus_1") < s.variable("high")) {
        s.addTempVariable("top", 1);
        s.setTempVariable("stack^top", s.variable("qs_partition_return_plus_1"));
        s.addTempVariable("top", 1);
        s.setTempVariable("stack^top", s.variable("high"));
      }
    },
  );
  c.clearVariable("minimum");
  c.clearVariable("tmp");
  c.clearVariable("random_pivot");
}
function swap(c: CountryScope, array: string, a: string, b: string): void {
  c.setTempVariable("swap", c.variable(array + "^" + a));
  c.setVariable(array + "^" + a, c.variable(array + "^" + b));
  c.setVariable(array + "^" + b, c.variable("swap"));
}
function sort(c: CountryScope, selector: number): void {
  if (c.variable("last_sort_var") === c.variable("sort_var")) {
    c.setVariable("middle", c.variable("global.GDP_list_array^num"));
    c.setTempVariable("len", c.variable("global.GDP_list_array^num"));
    c.subtractTempVariable("len", 1);
    c.divideVariable("middle", 2);
    c.effects.round_variable("middle");
    c.forRange({ start: 0, end: c.variable("middle") }, (s) => {
      s.setTempVariable("reverse", s.variable("len"));
      s.subtractTempVariable("reverse", s.variable("v"));
      swap(s, "global.GDP_list_array", "v", "reverse");
    });
    c.clearVariable("middle");
    c.setVariable("last_sort_var", 0);
  } else {
    c.setTempVariable("temp_array_sort", 4);
    c.setTempVariable("temp_value_sort", selector);
    c.run(scopedQuicksort);
    c.setVariable("last_sort_var", c.variable("sort_var"));
  }
}
const sortableArrays = [
  { selector: 1, name: "RUS_duma_government_array" },
  { selector: 2, name: "RUS_duma_neutral_array" },
  { selector: 3, name: "RUS_duma_opposition_array" },
  { selector: 4, name: "global.GDP_list_array" },
] as const;
const sortableMetrics = [
  { selector: 1, name: "RUS_duma_seat" },
  { selector: 2, name: "country_GDP" },
  { selector: 3, name: "country_GDP_per_capita" },
] as const;
/** Compile finite selectors into typed specializations instead of runtime source-text macros. */
export const scopedQuicksort = ScriptedEffect("scoped_quicksort", (c) => {
  for (const array of sortableArrays)
    if (c.variable("temp_array_sort") === array.selector) {
      for (const metric of sortableMetrics)
        if (c.variable("temp_value_sort") === metric.selector)
          quicksort(c, array.name, metric.name);
    }
});
export const sortGDP = ScriptedEffect("create_GDP_sorted_array", (c) => sort(c, 2));
export const sortPerCapita = ScriptedEffect("create_GDP_per_capita_sorted_array", (c) =>
  sort(c, 3),
);
export const updatePosition = ScriptedEffect("update_position", (c) => {
  c.clearArray("global.top_ten_GDP_array");
  c.clearVariable("global.GDP_total");
  c.clearVariable("global.GDP_per_capita_total");
  c.setTempVariable("position", 0);
  c.setVariable("sort_var", 1);
  c.setVariable("last_sort_var", 0);
  c.run(sortGDP);
  c.forEachCountryInArray("global.GDP_list_array", (entry) => {
    entry.addTempVariable("position", 1);
    entry.setVariable("THIS.GDP_position", entry.variable("position"));
    if (entry.variable("THIS.GDP_position") < 11)
      entry.arrayPush("global.top_ten_GDP_array", countryTarget("THIS"));
    entry.addVariable("global.GDP_total", entry.variable("country_GDP"));
    entry.addVariable("global.GDP_per_capita_total", entry.variable("country_GDP_per_capita"));
  });
  c.setVariable("global.average_GDP", c.variable("global.GDP_total"));
  c.divideVariable("global.average_GDP", c.variable("global.GDP_list_array^num"));
  c.setVariable("global.average_GDP_per_capita", c.variable("global.GDP_per_capita_total"));
  c.divideVariable("global.average_GDP_per_capita", c.variable("global.GDP_list_array^num"));
  c.effects.force_update_map_mode({ mapmode: "TWR_GDP_map_mode" });
  c.effects.force_update_map_mode({ mapmode: "TWR_GDP_per_capita_map_mode" });
});
