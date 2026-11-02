// Original authored native audit fixture.
import { Technology, type CountryScope } from "krieg-lang/hoi4";
export const sample = Technology({
  id: "krg_audit_technology",
  researchCost: 0.5,
  startYear: 1936,
  categories: ["industry"],
  folder: [{ name: "industry_folder", position: { x: 0, y: 8 } }],
  onResearchComplete: (country: CountryScope) => country.effects.addPoliticalPower(5),
});
