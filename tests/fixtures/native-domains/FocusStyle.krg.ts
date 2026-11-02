// Original audit fixture; native rule: common/national_focus.cwt:920.
import { FocusStyle } from "krieg-lang/hoi4";

export const sample = FocusStyle({
  id: "krg_audit_focusstyle",
  unavailable: "GFX_focus_unavailable",
  completed: "GFX_focus_completed",
  available: "GFX_focus_can_start",
  current: "GFX_focus_current",
  default: true,
});
