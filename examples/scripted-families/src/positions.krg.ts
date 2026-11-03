import { ScriptedEffect, ScriptedEffectFamily, ScriptedTriggerFamily } from "krieg-lang/hoi4";

// The supplied TNO economy scripts repeat a fixed percentage plus a shared
// display update for each slider position. This standalone example uses its
// own variable and flag; it does not require TNO or copy its economy logic.
const positions = {
  low: { percent: 20, cost: 10 },
  medium: { percent: 50, cost: 25 },
  high: { percent: 80, cost: 40 },
} as const;

const dirty = ScriptedEffect("family_refresh_display", (country) => {
  country.effects.setCountryFlag("family_display_dirty");
});

export const setPosition = ScriptedEffectFamily("family_set_position", positions, (country, p) => {
  country.effects.setVariable({ var: "family_consumer_goods_minimum", value: p.percent });
  country.effects.addPoliticalPower(-p.cost);
  country.run(dirty);
});

export const canSetPosition = ScriptedTriggerFamily(
  "family_can_set_position",
  positions,
  (country, p) => country.politicalPower >= p.cost,
);
