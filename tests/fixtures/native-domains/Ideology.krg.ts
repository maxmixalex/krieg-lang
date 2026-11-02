// Original authored native audit fixture.
import { Ideology } from "krieg-lang/hoi4";
export const sample = Ideology({
  id: "krg_audit_ideology",
  types: { krg_audit_cooperative: {} },
  aiIdeologyWantedUnitsFactor: 1,
  dynamicFactionNames: ["KRG_AUDIT"],
  color: [30, 120, 160],
  rules: { canForceGovernment: false, canPuppet: false },
  warImpactOnWorldTension: 1,
  factionImpactOnWorldTension: 1,
  modifiers: { entries: { political_power_gain: 0.01 } },
  factionModifiers: { entries: { political_power_gain: 0.01 } },
  aiDemocratic: true,
});
