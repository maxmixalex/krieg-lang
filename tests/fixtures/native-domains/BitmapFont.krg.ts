// Original audit fixture; native rule: interface/gfx.cwt:156.
import { BitmapFont } from "krieg-lang/hoi4";

export const sample = BitmapFont({
  id: "krg_audit_bitmapfont",
  fontfiles: ["gfx/fonts/hoi_24header"],
  color: "0xffffffff",
  textcolors: { G: [86, 172, 91] },
  cursorOffset: [0, 4],
});
