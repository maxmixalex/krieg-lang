// Original native audit fixture; CWT rule: common/bop.cwt:7.
import { BalanceOfPower } from "krieg-lang/hoi4";

export const sample = BalanceOfPower({
  id: "krg_audit_balanceofpower",
  leftSide: "krg_audit_left",
  rightSide: "krg_audit_right",
  initialValue: 0,
  range: [{ id: "krg_audit_mid", min: -0.1, max: 0.1 }],
  side: [
    {
      id: "krg_audit_left",
      icon: "GFX_krieg_audit",
      range: [{ id: "krg_audit_low", min: -1, max: -0.1 }],
    },
    {
      id: "krg_audit_right",
      icon: "GFX_krieg_audit",
      range: [{ id: "krg_audit_high", min: 0.1, max: 1 }],
    },
  ],
});
