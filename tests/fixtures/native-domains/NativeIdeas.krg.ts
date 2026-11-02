// Original native audit fixture; CWT rule: common/ideas.cwt:14.
import { NativeIdeas } from "krieg-lang/hoi4";

export const sample = NativeIdeas({
  id: "krg_audit_nativeideas",
  entries: {
    country: {
      krg_audit_original_idea: {
        picture: "GFX_krieg_audit",
        removalCost: -1,
        modifier: { entries: { political_power_gain: 0.05 } },
      },
    },
  },
});
