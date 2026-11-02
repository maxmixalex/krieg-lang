// Original authored native audit fixture.
import { ContinuousFocusPalette } from "krieg-lang/hoi4";
export const sample = ContinuousFocusPalette({
  id: "krg_audit_continuousfocuspalette",
  country: { factor: 0 },
  position: { x: 50, y: 1000 },
  focus: [
    {
      id: "krg_audit_continuous_focus",
      icon: ["GFX_krieg_audit"],
      dailyCost: 0.5,
      modifier: { entries: { political_power_gain: 0.1 } },
    },
  ],
});
