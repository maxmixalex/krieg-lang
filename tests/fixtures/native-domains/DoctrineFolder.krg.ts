// Original audit fixture; native rule: common/doctrine_folders.cwt:9.
import { DoctrineFolder, type ScopeByName } from "krieg-lang/hoi4";

export const sample = DoctrineFolder({
  id: "krg_audit_doctrinefolder",
  allowed: (_scope: ScopeByName["country"]) => true,
  name: "KRG_AUDIT",
  ledger: "army",
  ledgerGfx: "GFX_land_doctrine_folder_icon",
});
