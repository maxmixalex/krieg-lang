// Original audit fixture; native rule: common/opinions.cwt:8.
import { OpinionModifier } from "krieg-lang/hoi4";

export const sample = OpinionModifier({
  id: "krg_audit_opinionmodifier",
  value: -10,
  decay: 1,
  minTrust: -10,
  days: 10,
});
