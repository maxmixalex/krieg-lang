// Original native audit fixture; CWT rule: gfx/particles.cwt:30.
import { Particle } from "krieg-lang/hoi4";

export const sample = Particle({
  id: "krg_audit_particle",
  subsystem: [
    {
      name: "krg_audit_spark",
      duration: 1,
      life: [0.1, 0.2],
      size: 0.5,
      maxAmount: 1,
      texture: { file: "gfx/interface/krieg_audit.dds", shader: "particle" },
    },
  ],
});
