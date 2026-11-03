import { FocusNodes, type EventDefinition } from "krieg-lang/hoi4";

// Reuse this infrastructure branch in another graph with that graph's own IDs.
// The event is an explicit input, so the module does not depend on programme.ts.
export function civicInfrastructure(report: EventDefinition<"country">) {
  return FocusNodes({
    charter: {
      icon: "GFX_civ_focus",
      position: { x: 1, y: 0 },
      cost: 3,
      completionReward: (country) => country.effects.addStability(0.05),
    },
    harbour: {
      requires: (focus) => focus.charter,
      icon: "GFX_civ_focus",
      position: { x: 0, y: 1 },
      cost: 5,
      completionReward: (country) => country.schedule(report, { days: 1 }),
    },
  });
}
