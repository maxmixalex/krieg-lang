// Original audit fixture; native rule: common/collections.cwt:41.
import { Collection, type ScopeByName } from "krieg-lang/hoi4";

export const sample = Collection({
  id: "krg_audit_collection",
  input: "game:all_countries",
  name: ["KRG_AUDIT"],
  operators: { limit: (_scope: ScopeByName["country"]) => true },
});
