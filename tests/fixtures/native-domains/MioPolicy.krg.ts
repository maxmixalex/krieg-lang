// Original audit fixture; native rule: common/mio_policies.cwt:8.
import { MioPolicy, type ScopeByName } from "krieg-lang/hoi4";

export const sample = MioPolicy({
  id: "krg_audit_miopolicy",
  icon: "GFX_idea_eng_spirit_of_the_industrial_revolution",
  allowed: (_scope: ScopeByName["military_industrial_organization"]) => true,
  available: (_scope: ScopeByName["military_industrial_organization"]) => true,
  productionBonus: { sameAsMio: [{ production_resource_need_factor: -0.1 }] },
});
