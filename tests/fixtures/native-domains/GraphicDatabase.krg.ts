// Original native audit fixture; CWT rule: gfx/graphic_db.cwt:14.
import { GraphicDatabase } from "krieg-lang/hoi4";

export const sample = GraphicDatabase({
  id: "default",
  entries: {
    infantry: { pool: [{ weight: 1, icons: ["GFX_krieg_audit"], models: ["krg_audit_entity"] }] },
  },
});
