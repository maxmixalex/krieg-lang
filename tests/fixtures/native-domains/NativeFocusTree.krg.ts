// Original authored native audit fixture.
import { NativeFocusTree, type CountryScope } from "krieg-lang/hoi4";
export const sample = NativeFocusTree({
  id: "krg_audit_nativefocustree",
  country: { factor: 0 },
  focus: [
    {
      id: "krg_audit_native_focus",
      icon: ["GFX_krieg_audit"],
      cost: 1,
      x: 0,
      y: 0,
      completionReward: (country: CountryScope) => country.effects.addPoliticalPower(5),
    },
  ],
});
