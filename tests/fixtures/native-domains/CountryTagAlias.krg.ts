// Original audit fixture; native rule: common/country_tag_aliases.cwt:20.
import { CountryTagAlias } from "krieg-lang/hoi4";

export const sample = CountryTagAlias({
  id: "krg_audit_countrytagalias",
  originalTag: "SOV",
  countryScore: { base: 1, modifier: { add: 1 } },
});
