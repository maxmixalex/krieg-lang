// Original native audit fixture; CWT rule: common/dynamic_modifiers.cwt:8.
import { DynamicModifier, type CountryScope } from "krieg-lang/hoi4";

export const sample = DynamicModifier({
  id: "krg_audit_dynamicmodifier",
  icon: "GFX_krieg_audit",
  enable: (_country: CountryScope) => true,
  customModifierTooltip: ["KRG_AUDIT"],
  entries: { political_power_gain: 0.1 },
});
