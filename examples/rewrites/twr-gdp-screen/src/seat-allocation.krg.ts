import { ScriptedEffect } from "krieg-lang/hoi4";

/** Original auxiliary allocation contract, retained even though the GDP window does not call it. */
export const sumCap = ScriptedEffect("sum_cap", (c) => {
  c.subtractTempVariable("temp_index", 1);
  c.setTempVariable("temp", c.variable("temp_value_array^temp_index"));
  c.addTempVariable("temp", c.variable("temp_value"));
  if (c.variable("temp") > c.variable("max")) {
    c.subtractTempVariable("temp", c.variable("max"));
    c.subtractTempVariable("temp_value", c.variable("temp"));
  } else if (c.variable("temp") < 0) {
    c.multiplyTempVariable("temp", -1);
    c.subtractTempVariable("temp_value", c.variable("temp"));
  }
  c.forRange({ start: 0, end: c.variable("temp_value_array^num") }, (same) =>
    same.effects.add_to_temp_array({ array: "temp_array", value: same.variable("v") }),
  );
  c.effects.remove_from_temp_array({ array: "temp_array", value: c.variable("temp_index") });
  c.addVariable("temp_value_array^temp_index", c.variable("temp_value"));
  if (c.variable("temp_value") > 0) {
    c.whileLoop(
      (s) => s.variable("temp_value") > 0,
      (s) => {
        s.forRange({ start: 0, end: s.variable("temp_array^num") }, (loop) => {
          if (
            loop.variable("temp_value_array^temp_array^v") > 0 &&
            loop.variable("temp_value") > 0
          ) {
            loop.subtractVariable("temp_value_array^temp_array^v", 1);
            loop.subtractTempVariable("temp_value", 1);
          }
        });
      },
    );
  } else if (c.variable("temp_value") < 0) {
    c.whileLoop(
      (s) => s.variable("temp_value") < 0,
      (s) => {
        s.forRange({ start: 0, end: s.variable("temp_array^num") }, (loop) => {
          if (
            loop.variable("temp_value_array^temp_array^v") < loop.variable("max") &&
            loop.variable("temp_value") < 0
          ) {
            loop.addVariable("temp_value_array^temp_array^v", 1);
            loop.addTempVariable("temp_value", 1);
          }
        });
      },
    );
  }
});
export const exampleAllocation = ScriptedEffect("example_sum_cap_usage", (c) => {
  c.setTempVariable("max", 100);
  c.setTempVariable("temp_value", 10);
  c.setTempVariable("temp_index", 2);
  c.arrayPush("temp_value_array", c.variable("variable_1"));
  c.arrayPush("temp_value_array", c.variable("variable_2"));
  c.arrayPush("temp_value_array", c.variable("variable_3"));
  c.run(sumCap);
  c.setVariable("variable_1", c.variable("temp_value_array^0"));
  c.setVariable("variable_2", c.variable("temp_value_array^1"));
  c.setVariable("variable_3", c.variable("temp_value_array^2"));
  c.clearArray("temp_value_array");
});
