// Original audit fixture; native rule: common/bookmarks.cwt:8.
import { Bookmark } from "krieg-lang/hoi4";

export const sample = Bookmark({
  id: "krg_audit_bookmark",
  name: "KRG_AUDIT",
  desc: "KRG_AUDIT",
  date: "1939.8.14.12",
  picture: "GFX_select_date_1939",
  defaultCountry: "GER",
  effect: { randomizeWeather: 12345 },
});
