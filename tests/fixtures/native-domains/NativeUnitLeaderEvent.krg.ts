// Original audit fixture; native rule: events.cwt:39.
import { NativeUnitLeaderEvent } from "krieg-lang/hoi4";

export const sample = NativeUnitLeaderEvent({
  id: "krg_audit.101",
  title: ["KRG_AUDIT"],
  desc: ["KRG_AUDIT"],
  picture: "GFX_report_event_generic_rally2",
  isTriggeredOnly: true,
  option: [{ name: "KRG_AUDIT" }],
});
