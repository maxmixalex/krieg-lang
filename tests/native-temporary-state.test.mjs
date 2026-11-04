import assert from "node:assert/strict";
import test from "node:test";
import { parsePdx } from "../dist/pdx/index.js";
import { UnoNativeMachine } from "./support/uno-native-machine.mjs";

test("the native oracle shares temporary arithmetic across scopes and clears it after an effect", () => {
  const effect = parsePdx(`
    set_variable = { var = scratch value = 90 }
    set_temp_variable = { var = scratch value = 10 }
    subtract_from_temp_variable = { var = scratch value = 2 }
    multiply_temp_variable = { var = scratch value = 3 }
    divide_temp_variable = { var = scratch value = 4 }
    modulo_temp_variable = { var = scratch value = 4 }
    every_country = {
      add_to_temp_variable = { var = scratch value = 1 }
      add_to_variable = { var = scratch value = 1 }
      set_variable = { var = observed value = scratch }
    }
  `).document;
  const machine = new UnoNativeMachine(new Map([["sample", effect]]));
  machine.run("sample");
  assert.deepEqual(
    machine.countries.map((country) => country.vars.observed),
    [3, 4, 5, 6, 7, 8],
  );
  assert.deepEqual(
    machine.countries.map((country) => country.vars.scratch),
    [91, 1, 1, 1, 1, 1],
  );
  assert.deepEqual(machine.temporary, {});
  assert.equal(machine.variable("scratch", machine.countries[0]), 91);
});
