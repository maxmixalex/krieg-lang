import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { auditAlpha } from "../scripts/audit-alpha-rewrites.mjs";

const inputs = resolve(process.env.KRIEG_PRIVATE_MODS ?? "../private-mods");
const available =
  existsSync(resolve(inputs, "Playable-Piano/descriptor.mod")) &&
  existsSync(resolve("examples/rewrites/twr-gdp-screen/build/mod/interface/TWR_GDP.gui"));
test(
  "private input differential oracle: piano bindings, state-transfer transitions, GDP formulas and sorting",
  {
    skip: available
      ? false
      : "Restore the user-owned mods and build the three ports to run this input-backed audit.",
  },
  () => {
    const report = auditAlpha(inputs);
    assert.equal(report.mods["playable-piano"].keys.length, 25);
    assert.equal(report.mods["twr-gdp-screen"].quicksortSpecializations.length, 12);
    assert.equal(report.mods["twr-gdp-screen"].scenarios.length, 3);
    assert.equal(report.mods["twr-gdp-screen"].effects.length, 8);
    assert.equal(report.mods["twr-gdp-screen"].allocations.length, 11);
    for (const check of report.mods["twr-gdp-screen"].allocations)
      if (check.effect === "example_sum_cap_usage") {
        assert.equal(check.selected, 2);
        assert.equal(check.change, 10);
      }
    assert.ok(report.mods["state-transfer-tool"].checks.length >= 40);
  },
);
