// Original audit fixture; native rule: common/consolidated_ai.cwt:70.
import { AiPeace, type ScopeByName } from "krieg-lang/hoi4";

export const sample = AiPeace({
  id: "krg_audit_aipeace",
  enable: (_scope: ScopeByName["country"]) => true,
  annexRandomness: 1,
  liberateRandomness: 1,
  puppetRandomness: 1,
  takeStatesRandomness: 1,
  forceGovernmentRandomness: 1,
  annex: {},
  liberate: {},
  puppet: {},
  puppetAll: {},
  puppetState: {},
  takeStates: {},
  forceGovernment: {},
});
