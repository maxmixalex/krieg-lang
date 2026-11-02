// Original audit fixture; native rule: common/doctrine_tracks.cwt:29.
import { DoctrineTrack } from "krieg-lang/hoi4";

export const sample = DoctrineTrack({
  id: "krg_audit_doctrinetrack",
  name: "KRG_AUDIT",
  background: "GFX_air_superiority_bg",
  icon: "GFX_doctrine_milestone_fighter_air",
  iconFrame: "GFX_doctrine_decor_air",
  mastery: { multiplier: 8, equipment: ["fighter", "interceptor"] },
});
