import assert from "node:assert/strict";
import test from "node:test";
import { parsePdx } from "../dist/pdx/index.js";
import { UnoNativeMachine } from "./support/uno-native-machine.mjs";
test("HOI4 direct NOT children are NOR; an explicit AND inside NOT is NAND", () => {
  const machine = new UnoNativeMachine(new Map()),
    c = machine.countries[0];
  const direct = parsePdx("NOT = { has_country_flag = a has_country_flag = b }").document;
  const grouped = parsePdx(
    "NOT = { AND = { has_country_flag = a has_country_flag = b } }",
  ).document;
  for (const a of [false, true])
    for (const b of [false, true]) {
      c.flags = new Set([...(a ? ["a"] : []), ...(b ? ["b"] : [])]);
      assert.equal(machine.condition(direct, c), !a && !b);
      assert.equal(machine.condition(grouped, c), !(a && b));
    }
});
