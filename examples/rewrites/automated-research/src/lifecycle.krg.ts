import { OnAction } from "krieg-lang/hoi4";
import { init, tick } from "./core.krg.ts";
import { messageTick } from "./storage.krg.ts";
import { guideDaily } from "./ui-actions.krg.ts";
export const lifecycle = [
  OnAction({
    id: "on_startup",
    outputPath: "common/on_actions/rq_lifecycle.txt",
    effect: [
      (world) =>
        world.everyCountry((c) => {
          if (!c.isAI) {
            c.run(init);
            c.run(guideDaily);
          }
        }),
    ],
  }),
  OnAction({
    id: "on_daily",
    outputPath: "common/on_actions/rq_lifecycle.txt",
    effect: [
      (c) => {
        if (!c.isAI) {
          if (!c.triggers.has_country_flag("rq_active")) c.run(init);
          else {
            c.run(messageTick);
            c.run(tick);
          }
          c.run(guideDaily);
        }
      },
    ],
  }),
];
