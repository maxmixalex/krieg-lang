// Original audit fixture; native rule: common/operations.cwt:10.
import { Operation } from "krieg-lang/hoi4";

export const sample = Operation({
  id: "krg_audit_operation",
  icon: "GFX_operations_make_resistance_contacts",
  mapIcon: "GFX_operations_make_resistance_contacts_map",
  name: "KRG_AUDIT",
  desc: "KRG_AUDIT",
  days: 60,
  operatives: 2,
  networkStrength: 40,
  phases: [{ infiltration_border: { base: 25 } }],
});
