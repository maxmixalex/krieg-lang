// Original audit fixture; native rule: common/military_industrial_organizations.cwt:8.
import { MilitaryIndustrialOrganization, type ScopeByName } from "krieg-lang/hoi4";

export const sample = MilitaryIndustrialOrganization({
  id: "krg_audit_militaryindustrialorganization",
  icon: "GFX_idea_generic_air_manufacturer_1",
  allowed: (_scope: ScopeByName["country"]) => true,
  equipmentType: [
    "mio_cat_eq_only_light_fighter",
    "small_plane_cas_airframe",
    "cv_small_plane_cas_airframe",
  ],
  researchCategories: ["mio_cat_all_light_fighter_and_modules", "mio_cat_all_cas_and_modules"],
});
