// Original authored native audit fixture.
import { OnAction, type CountryScope } from "krieg-lang/hoi4";
export const sample = OnAction({
  id: "on_daily",
  effect: [(country: CountryScope) => country.effects.setCountryFlag("krg_audit_day_seen")],
});
