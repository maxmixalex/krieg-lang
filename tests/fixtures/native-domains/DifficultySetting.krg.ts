// Original audit fixture; native rule: common/difficulty_settings.cwt:8.
import { DifficultySetting } from "krieg-lang/hoi4";

export const sample = DifficultySetting({
  id: "krg_audit_difficultysetting",
  key: "custom_diff_strong_ger",
  modifier: "diff_strong_ai_generic",
  countries: ["GER"],
  multiplier: 2,
});
