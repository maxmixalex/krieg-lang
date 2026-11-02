// Original audit fixture; native rule: map/map_consolidated.cwt:19.
import { AdjacencyRule, type ScopeByName } from "krieg-lang/hoi4";

export const sample = AdjacencyRule({
  id: "krg_audit_adjacencyrule",
  contested: { army: false, navy: false, submarine: false, trade: false },
  enemy: { army: false, navy: false, submarine: false, trade: false },
  friend: { army: true, navy: true, submarine: true, trade: true },
  neutral: { army: false, navy: false, submarine: false, trade: true },
  requiredProvinces: [9833, 11829],
  icon: 9833,
  offset: [-2, 0, -9],
  isFriend: (_scope: ScopeByName["country"]) => true,
});
