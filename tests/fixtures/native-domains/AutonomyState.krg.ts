// Original audit fixture; native rule: common/autonomous_states.cwt:9.
import { AutonomyState } from "krieg-lang/hoi4";

export const sample = AutonomyState({
  id: "krg_audit_autonomystate",
  minFreedomLevel: 0,
  rule: { desc: "KRG_AUDIT", canBeSpymaster: false },
  modifier: {},
  aiSubjectWantsHigher: { factor: 0 },
  aiOverlordWantsLower: { factor: 0 },
  isPuppet: true,
  useOverlordColor: true,
  manpowerInfluence: 0,
});
