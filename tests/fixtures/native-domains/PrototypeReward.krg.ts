// Original audit fixture; native rule: common/special_projects.cwt:266.
import { PrototypeReward, type ScopeByName } from "krieg-lang/hoi4";

export const sample = PrototypeReward({
  id: "krg_audit_prototypereward",
  option: [
    {
      token: "sp_nuclear_major_political_interference_generic_reward_option_keep",
      iterationOutput: {
        countryEffects: (_scope: ScopeByName["country"]) => {},
        scientistEffects: (_scope: ScopeByName["character"]) => {},
      },
    },
  ],
  fireOnlyOnce: true,
  threshold: { min: 15, max: 85 },
  weight: { base: 1, modifier: [{ factor: 0.25 }] },
});
