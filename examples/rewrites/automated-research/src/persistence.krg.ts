import {
  CountryEvent,
  DefinitionSeries,
  DynamicModifier,
  FlagAchievements,
  GameRule,
} from "krieg-lang/hoi4";

// The original cross-save format reserves 8,192 flags. Their numbers are part of its save ABI.
export const saveBits = FlagAchievements("research_queue_rq", {
  prefix: "rq_b",
  count: 8192,
  storage: { array: "rq_bits", index: "rq_bj", load: "rq_bits_load", mark: "rq_bit_on" },
  outputPath: "common/achievements/rq_achievements.txt",
});
// One political-power maintenance slot per supported industrial organisation.
DefinitionSeries(1, 525, (slot) =>
  DynamicModifier({
    id: "rq_mpp_" + slot,
    outputPath: "common/dynamic_modifiers/rq_mio_pp.txt",
    entries: { political_power_gain: "rq_mppv_" + slot },
  }),
);
GameRule({
  id: "rq_lock_slots",
  name: "RQ_RULE_LOCK",
  group: "RQ_RULE_GROUP",
  default: { name: "OFF", text: "RQ_RULE_LOCK_OFF", desc: "RQ_RULE_LOCK_OFF_DESC" },
  option: [{ name: "ON", text: "RQ_RULE_LOCK_ON", desc: "RQ_RULE_LOCK_ON_DESC" }],
});
CountryEvent({
  id: "rq_cheat.1",
  hidden: true,
  isTriggeredOnly: true,
  immediate: (c) => c.effects.setCountryFlag("rq_cheat"),
});
CountryEvent({
  id: "rq_cheat.2",
  hidden: true,
  isTriggeredOnly: true,
  immediate: (c) => c.effects.clr_country_flag("rq_cheat"),
});
