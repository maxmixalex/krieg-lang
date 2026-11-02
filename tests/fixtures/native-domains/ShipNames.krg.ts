// Original audit fixture; native rule: common/units.cwt:272.
import { ShipNames } from "krieg-lang/hoi4";

export const sample = ShipNames({
  id: "krg_audit_shipnames",
  name: "KRG_AUDIT",
  type: "ship",
  forCountries: ["ARG"],
  shipTypes: ["ship_hull_light", "destroyer"],
});
