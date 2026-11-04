import { CountryEvent, DecisionCategory, FocusGraph, FocusNodes } from "krieg-lang/hoi4";

export const report = CountryEvent({
  id: "reconstruction.1",
  hidden: true,
  isTriggeredOnly: true,
  immediate: (country) => country.effects.addPoliticalPower(50),
});

// 一个可跨文件导出的模块；内部也有精确的节点名补全。
export const infrastructure = FocusNodes({
  charter: { cost: 3 },
  trade: { requires: (focus) => focus.charter, cost: 3 },
});

export const reconstruction = FocusGraph({
  id: "reconstruction_tree",
  prefix: "REC",
  nodes: {
    ...infrastructure,
    industry: {
      requires: (focus) => focus.charter,
      exclusiveWith: (focus) => focus.relief,
      cost: 5,
    },
    relief: {
      requires: (focus) => focus.charter,
      cost: 5,
    },
    assembly: {
      requires: (focus) => ({ any: [focus.industry, focus.relief] }),
      cost: 5,
    },
    congress: {
      requires: (focus) => ({ all: [focus.assembly, focus.trade] }),
      cost: 5,
      completionReward: (country) => country.schedule(report, { hours: 6, randomHours: 3 }),
    },
  },
});

export const decisions = DecisionCategory({
  id: "REC_administration",
  decisions: [
    {
      id: "REC_review",
      cost: 25,
      available: (country) => country.hasCompletedFocus(reconstruction.focuses.congress),
      completeEffect: (country) => country.schedule(report, { days: 1 }),
    },
  ],
});
