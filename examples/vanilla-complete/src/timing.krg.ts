import { Defines } from "krieg-lang/hoi4";

// Give the island congress fourteen days for an unanswered event option.
export const congressTiming = Defines("island_congress_timing", {
  NDefines: { NGame: { EVENT_TIMEOUT_DEFAULT: 14 } },
});
