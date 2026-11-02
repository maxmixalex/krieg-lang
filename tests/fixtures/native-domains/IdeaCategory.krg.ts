// Original audit fixture; native rule: common/idea_tags.cwt:23.
import { IdeaCategory } from "krieg-lang/hoi4";

export const sample = IdeaCategory({
  id: "krg_audit_ideacategory",
  cost: 150,
  removalCost: 0,
  ledger: "civilian",
  slot: ["mobilization_laws"],
});
