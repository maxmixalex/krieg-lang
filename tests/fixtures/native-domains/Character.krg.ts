// Original audit fixture; native rule: common/characters.cwt:97.
import { Character } from "krieg-lang/hoi4";

export const sample = Character({
  id: "krg_audit_character",
  portraits: {
    civilian: {
      large: "GFX_portrait_AOI_amedeo_di_savoia_aosta",
      small: "GFX_portrait_AOI_amedeo_di_savoia_aosta_small",
    },
  },
  name: "KRG_AUDIT",
  countryLeader: [{ ideology: "fascism_ideology", expire: "1943.1.1.1" }],
  fieldMarshal: { skill: 2, attackSkill: 2, defenseSkill: 2, planningSkill: 2, logisticsSkill: 2 },
});
