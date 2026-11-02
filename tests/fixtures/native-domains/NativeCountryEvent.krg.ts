// Original audit fixture; native rule: events.cwt:39.
import { NativeCountryEvent } from "krieg-lang/hoi4";

export const sample = NativeCountryEvent({
  id: "krg_audit.98",
  title: ["KRG_AUDIT"],
  desc: ["KRG_AUDIT"],
  picture: "GFX_report_event_generic_rally2",
  isTriggeredOnly: true,
  option: [{ name: "KRG_AUDIT" }],
});
