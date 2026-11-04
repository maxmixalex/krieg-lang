import { ScriptedEffect, country, type CountryScope } from "krieg-lang/hoi4";
import { iconLayout } from "./icon-layout.krg.ts";

export const iconPlacement = ScriptedEffect("rq_icon_x", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_t",
    iconLayout,
    (c, icon) => {
      c.setTempVariable("rq_ix", icon.x);
      c.setTempVariable("rq_iy", icon.y);
      c.setTempVariable("rq_iw", icon.w);
      for (const variant of icon.variants) {
        if (
          variant.tags.some((tag) => c.triggers.tag(country(tag))) &&
          (variant.dlcs.length === 0 || variant.dlcs.some((dlc) => c.triggers.has_dlc(dlc)))
        ) {
          c.setTempVariable("rq_ix", variant.x);
          c.setTempVariable("rq_iy", variant.y);
          c.setTempVariable("rq_iw", variant.w);
        }
      }
    },
    { first: 1, outOfRange: "clamp" },
  );
});
