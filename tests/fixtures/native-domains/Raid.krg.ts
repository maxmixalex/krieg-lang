// Original audit fixture; native rule: common/raids.cwt:36.
import { Raid, type ScopeByName } from "krieg-lang/hoi4";

export const sample = Raid({
  id: "krg_audit_raid",
  category: "air_raids",
  commandPower: 15,
  arrow: { type: "air" },
  daysToPrepare: 35,
  showTarget: (_scope: ScopeByName["country"]) => true,
  available: (_scope: ScopeByName["country"]) => true,
  targetType: { province: [4180] },
  startingPoint: { types: ["carrier"] },
  successLevels: {
    failure: {
      visualEffect: [{ entity: "krg_audit_entity", animation: "attack" }],
      actorEffects: {},
    },
    limitedSuccess: {
      visualEffect: [{ entity: "krg_audit_entity", animation: "attack" }],
      actorEffects: {},
    },
    success: {
      visualEffect: [{ entity: "krg_audit_entity", animation: "attack" }],
      actorEffects: {},
    },
    criticalSuccess: {
      visualEffect: [{ entity: "krg_audit_entity", animation: "attack" }],
      actorEffects: {},
    },
  },
  successFactors: {
    success: { base: 0.75, experience: { weight: 0.05, reference: 1 } },
    critical: { base: 0.1 },
  },
  customMapIcon: "GFX_raid_target_icon_carrier_raid",
  targetIcon: "GFX_naval_base_target_icon",
  launchSound: "krg_audit_soundeffect",
});
