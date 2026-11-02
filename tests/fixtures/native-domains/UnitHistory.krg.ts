// Original audit fixture; native rule: history/oobs.cwt:68.
import { UnitHistory, type ScopeByName } from "krieg-lang/hoi4";

export const sample = UnitHistory({
  id: "krg_audit_unithistory",
  divisionTemplate: [
    {
      name: "KRG_AUDIT",
      regiments: { infantry: { x: 0, y: 0 } },
      divisionNamesGroup: "SPAN_INF_02",
    },
  ],
  instantEffect: [(_scope: ScopeByName["country"]) => {}],
  units: {
    division: [
      {
        location: 12364,
        divisionTemplate: "División de Infanteria",
        divisionName: { isNameOrdered: true, nameOrder: 1 },
      },
    ],
  },
});
