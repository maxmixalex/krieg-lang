import { ScriptedEffect, variableState } from "krieg-lang/hoi4";

const seatVariables = variableState("country", {
  first: "variable_1",
  second: "variable_2",
  third: "variable_3",
});

function redistribute(
  values: number[],
  peers: number[],
  index: number,
  change: number,
  cap: number,
) {
  let checked = values[index] + change;
  let remaining = change;
  if (checked > cap) {
    checked -= cap;
    remaining -= checked;
  } else if (checked < 0) {
    // Preserve the source mod's signed lower-overflow calculation.
    checked *= -1;
    remaining -= checked;
  }
  values[index] += remaining;
  let moved = 1;
  if (remaining > 0) {
    while (remaining > 0 && moved > 0) {
      moved = 0;
      for (const peer of peers) {
        if (values[peer] > 0 && remaining > 0) {
          values[peer]--;
          remaining--;
          moved++;
        }
      }
    }
  } else {
    while (remaining < 0 && moved > 0) {
      moved = 0;
      for (const peer of peers) {
        if (values[peer] < cap && remaining < 0) {
          values[peer]++;
          remaining++;
          moved++;
        }
      }
    }
  }
  return { checked, remaining };
}

/** Redistribute a change among the other parties. The caller uses a zero-based index. */
export const sumCap = ScriptedEffect(
  "twr_allocate_seats",
  { values: "number[]", index: "number", change: "number", cap: "number" },
  (_country, { values, index, change, cap }) => {
    let peers: number[] = [];
    for (let i = 0; i < values.length; i++) {
      if (i !== index) peers.push(i);
    }
    redistribute(values, peers, index, change, cap);
  },
);

/** Keep the original one-based native entry point for mods that invoke sum_cap = yes. */
export const legacySumCap = ScriptedEffect("sum_cap", (c) => {
  c.subtractTempVariable("temp_index", 1);
  const index = c.variable("temp_index");
  const values = c.numberArray("temp_value_array");
  c.forRange({ start: 0, end: values.length }, (s) =>
    s.effects.add_to_temp_array({ array: "temp_array", value: s.variable("v") }),
  );
  c.effects.remove_from_temp_array({ array: "temp_array", value: index });
  const result = redistribute(
    values,
    c.numberArray("temp_array"),
    index,
    c.variable("temp_value"),
    c.variable("max"),
  );
  c.setTempVariable("temp", result.checked);
  c.setTempVariable("temp_value", result.remaining);
});

export const exampleAllocation = ScriptedEffect("example_sum_cap_usage", (country) => {
  const seats = country.variables(seatVariables);
  let values = [seats.first, seats.second, seats.third];
  sumCap(country, { values, index: 1, change: 10, cap: 100 });
  seats.first = values[0];
  seats.second = values[1];
  seats.third = values[2];
});
