// Original authored native audit fixture.
import { IntelligenceAgency, type CountryScope } from "krieg-lang/hoi4";
export const sample = IntelligenceAgency({
  id: "krg_audit_intelligenceagency",
  picture: "GFX_krieg_audit",
  names: ["KRG_AUDIT"],
  default: (country: CountryScope) => !country.isAI,
  available: (country: CountryScope) => !country.isAI,
});
