// Original audit fixture; native rule: common/peace_conference.cwt:38.
import { PeaceAiDesire, type ScopeByName } from "krieg-lang/hoi4";

export const sample = PeaceAiDesire({
  id: "krg_audit_peaceaidesire",
  peaceActionType: ["take_states"],
  enable: (_scope: ScopeByName["country"]) => true,
  aiDesire: 100,
});
