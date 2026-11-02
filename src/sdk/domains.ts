/** Generated from MIT CWT definitions and observed legacy GUI field facts. Run scripts/generate-domains.mjs; do not edit. */

import type { Definition, IdentifiedDefinition, CwtNode, Effect, Trigger, ScopeByName } from './index.js';

/** Native common/abilities; schema: common/abilities.cwt:9. */

export interface AbilitySpec extends AbilityBody {
  id: string;
  outputPath?: string;
}

export declare function Ability(spec: AbilitySpec): IdentifiedDefinition;

/** Native common/aces; schema: common/aces.cwt:8. */

export interface AceSpec extends AceBody {
  id: string;
  outputPath?: string;
}

export declare function Ace(spec: AceSpec): IdentifiedDefinition;

/** Native common/achievements; schema: common/achievements.cwt:9. */

export interface AchievementSpec extends AchievementBody {
  id: string;
  outputPath?: string;
}

export declare function Achievement(spec: AchievementSpec): IdentifiedDefinition;

/** Native common/ai_strategy; schema: common/ai_strategy.cwt:11. */

export interface AiStrategySpec extends AiStrategyBody {
  id: string;
  outputPath?: string;
}

export declare function AiStrategy(spec: AiStrategySpec): IdentifiedDefinition;

/** Native common/ai_strategy_plans; schema: common/ai_strategy.cwt:42. */

export interface AiStrategyPlanSpec extends AiStrategyPlanBody {
  id: string;
  outputPath?: string;
}

export declare function AiStrategyPlan(spec: AiStrategyPlanSpec): IdentifiedDefinition;

/** Native common/autonomous_states; schema: common/autonomous_states.cwt:9. */

export interface AutonomyStateSpec extends AutonomyStateBody {
  id: string;
  outputPath?: string;
}

export declare function AutonomyState(spec: AutonomyStateSpec): IdentifiedDefinition;

/** Native common/bookmarks; schema: common/bookmarks.cwt:8. */

export interface BookmarkSpec extends BookmarkBody {
  id: string;
  outputPath?: string;
}

export declare function Bookmark(spec: BookmarkSpec): IdentifiedDefinition;

/** Native common/bop; schema: common/bop.cwt:7. */

export interface BalanceOfPowerSpec extends BalanceOfPowerBody {
  id: string;
  outputPath?: string;
}

export declare function BalanceOfPower(spec: BalanceOfPowerSpec): IdentifiedDefinition;

/** Native common/buildings; schema: common/buildings.cwt:36. */

export interface BuildingSpec extends BuildingBody {
  id: string;
  outputPath?: string;
}

export declare function Building(spec: BuildingSpec): IdentifiedDefinition;

/** Native common/buildings; schema: common/buildings.cwt:246. */

export interface SpawnPointSpec extends SpawnPointBody {
  id: string;
  outputPath?: string;
}

export declare function SpawnPoint(spec: SpawnPointSpec): IdentifiedDefinition;

/** Native common/characters; schema: common/characters.cwt:97. */

export interface CharacterSpec extends CharacterBody {
  id: string;
  outputPath?: string;
}

export declare function Character(spec: CharacterSpec): IdentifiedDefinition;

/** Native common/collections; schema: common/collections.cwt:41. */

export interface CollectionSpec extends CollectionBody {
  id: string;
  outputPath?: string;
}

export declare function Collection(spec: CollectionSpec): IdentifiedDefinition;

/** Native common; schema: common/combat_tactics.cwt:16. */

export interface CombatTacticSpec extends CombatTacticBody {
  id: string;
  outputPath?: string;
}

export declare function CombatTactic(spec: CombatTacticSpec): IdentifiedDefinition;

/** Native common/ai_areas; schema: common/consolidated_ai.cwt:36. */

export interface AiAreaSpec extends AiAreaBody {
  id: string;
  outputPath?: string;
}

export declare function AiArea(spec: AiAreaSpec): IdentifiedDefinition;

/** Native common/ai_focuses; schema: common/consolidated_ai.cwt:49. */

export interface AiFocusSpec extends AiFocusBody {
  id: string;
  outputPath?: string;
}

export declare function AiFocus(spec: AiFocusSpec): IdentifiedDefinition;

/** Native common/ai_peace; schema: common/consolidated_ai.cwt:70. */

export interface AiPeaceSpec extends AiPeaceBody {
  id: string;
  outputPath?: string;
}

export declare function AiPeace(spec: AiPeaceSpec): IdentifiedDefinition;

/** Native common/ai_templates; schema: common/consolidated_ai.cwt:137. */

export interface AiTemplateSpec extends AiTemplateBody {
  id: string;
  outputPath?: string;
}

export declare function AiTemplate(spec: AiTemplateSpec): IdentifiedDefinition;

/** Native common/ai_equipment; schema: common/consolidated_ai.cwt:249. */

export interface AiEquipmentDesignGroupSpec extends AiEquipmentDesignGroupBody {
  id: string;
  outputPath?: string;
}

export declare function AiEquipmentDesignGroup(spec: AiEquipmentDesignGroupSpec): IdentifiedDefinition;

/** Native common/ai_faction_theaters; schema: common/consolidated_ai.cwt:401. */

export interface AiFactionTheaterSpec extends AiFactionTheaterBody {
  id: string;
  outputPath?: string;
}

export declare function AiFactionTheater(spec: AiFactionTheaterSpec): IdentifiedDefinition;

/** Native common/countries; schema: common/countries.cwt:29. */

export interface CountryDefinitionSpec extends NativeCountry {
  id: string;
  outputPath?: string;
}

export declare function CountryDefinition(spec: CountryDefinitionSpec): IdentifiedDefinition;

/** Native common/country_tag_aliases; schema: common/country_tag_aliases.cwt:20. */

export interface CountryTagAliasSpec extends CountryTagAliasBody {
  id: string;
  outputPath?: string;
}

export declare function CountryTagAlias(spec: CountryTagAliasSpec): IdentifiedDefinition;

/** Native common/difficulty_settings; schema: common/difficulty_settings.cwt:8. */

export interface DifficultySettingSpec extends DifficultySettingBody {
  id: string;
  outputPath?: string;
}

export declare function DifficultySetting(spec: DifficultySettingSpec): IdentifiedDefinition;

/** Native common/doctrines/folders; schema: common/doctrine_folders.cwt:9. */

export interface DoctrineFolderSpec extends DoctrineFolderBody {
  id: string;
  outputPath?: string;
}

export declare function DoctrineFolder(spec: DoctrineFolderSpec): IdentifiedDefinition;

/** Native common/doctrines/grand_doctrines; schema: common/doctrine_grand_doctrines.cwt:30. */

export interface GrandDoctrineSpec extends GrandDoctrineBody {
  id: string;
  outputPath?: string;
}

export declare function GrandDoctrine(spec: GrandDoctrineSpec): IdentifiedDefinition;

/** Native common/doctrines/subdoctrines; schema: common/doctrine_subdoctrines.cwt:29. */

export interface SubdoctrineSpec extends SubdoctrineBody {
  id: string;
  outputPath?: string;
}

export declare function Subdoctrine(spec: SubdoctrineSpec): IdentifiedDefinition;

/** Native common/doctrines/tracks; schema: common/doctrine_tracks.cwt:29. */

export interface DoctrineTrackSpec extends DoctrineTrackBody {
  id: string;
  outputPath?: string;
}

export declare function DoctrineTrack(spec: DoctrineTrackSpec): IdentifiedDefinition;

/** Native common/dynamic_modifiers; schema: common/dynamic_modifiers.cwt:8. */

export interface DynamicModifierSpec extends DynamicModifierBody {
  id: string;
  outputPath?: string;
}

export declare function DynamicModifier(spec: DynamicModifierSpec): IdentifiedDefinition;

/** Native common/equipment_groups; schema: common/equipment_groups.cwt:7. */

export interface EquipmentGroupSpec extends EquipmentGroupBody {
  id: string;
  outputPath?: string;
}

export declare function EquipmentGroup(spec: EquipmentGroupSpec): IdentifiedDefinition;

/** Native common/units/equipment; schema: common/equipment.cwt:121. */

export interface EquipmentSpec extends EquipmentBody {
  id: string;
  outputPath?: string;
}

export declare function Equipment(spec: EquipmentSpec): IdentifiedDefinition;

/** Native common/units/equipment/upgrades; schema: common/equipment.cwt:407. */

export interface EquipmentUpgradeSpec extends EquipmentUpgradeBody {
  id: string;
  outputPath?: string;
}

export declare function EquipmentUpgrade(spec: EquipmentUpgradeSpec): IdentifiedDefinition;

/** Native common/units/equipment/modules; schema: common/equipment.cwt:489. */

export interface EquipmentModuleSpec extends EquipmentModuleBody {
  id: string;
  outputPath?: string;
}

export declare function EquipmentModule(spec: EquipmentModuleSpec): IdentifiedDefinition;

/** Native common/units/critical_parts; schema: common/equipment.cwt:654. */

export interface CriticalPartSpec extends CriticalPartBody {
  id: string;
  outputPath?: string;
}

export declare function CriticalPart(spec: CriticalPartSpec): IdentifiedDefinition;

/** Native common/factions/goals; schema: common/factions.cwt:39. */

export interface FactionGoalSpec extends FactionGoalBody {
  id: string;
  outputPath?: string;
}

export declare function FactionGoal(spec: FactionGoalSpec): IdentifiedDefinition;

/** Native common/factions/member_upgrades; schema: common/factions.cwt:322. */

export interface FactionMemberUpgradeSpec extends FactionMemberUpgradeBody {
  id: string;
  outputPath?: string;
}

export declare function FactionMemberUpgrade(spec: FactionMemberUpgradeSpec): IdentifiedDefinition;

/** Native common/factions/rules; schema: common/factions.cwt:343. */

export interface FactionRuleSpec extends FactionRuleBody {
  id: string;
  outputPath?: string;
}

export declare function FactionRule(spec: FactionRuleSpec): IdentifiedDefinition;

/** Native common/factions/rules/groups; schema: common/factions.cwt:569. */

export interface FactionRuleGroupSpec extends FactionRuleGroupBody {
  id: string;
  outputPath?: string;
}

export declare function FactionRuleGroup(spec: FactionRuleGroupSpec): IdentifiedDefinition;

/** Native common/factions/templates; schema: common/factions.cwt:477. */

export interface FactionTemplateSpec extends FactionTemplateBody {
  id: string;
  outputPath?: string;
}

export declare function FactionTemplate(spec: FactionTemplateSpec): IdentifiedDefinition;

/** Native common/factions/upgrades; schema: common/factions.cwt:540. */

export interface FactionUpgradeSpec extends FactionUpgradeBody {
  id: string;
  outputPath?: string;
}

export declare function FactionUpgrade(spec: FactionUpgradeSpec): IdentifiedDefinition;

/** Native common/game_rules; schema: common/game_rules.cwt:8. */

export interface GameRuleSpec extends GameRuleBody {
  id: string;
  outputPath?: string;
}

export declare function GameRule(spec: GameRuleSpec): IdentifiedDefinition;

/** Native common/idea_tags; schema: common/idea_tags.cwt:23. */

export interface IdeaCategorySpec extends IdeaCategoryBody {
  id: string;
  outputPath?: string;
}

export declare function IdeaCategory(spec: IdeaCategorySpec): IdentifiedDefinition;

/** Native common/ideologies; schema: common/ideologies.cwt:17. */

export interface IdeologySpec extends IdeologyBody {
  id: string;
  outputPath?: string;
}

export declare function Ideology(spec: IdeologySpec): IdentifiedDefinition;

/** Native common/intelligence_agencies; schema: common/intelligence_agencies.cwt:8. */

export interface IntelligenceAgencySpec extends IntelligenceAgencyBody {
  id: string;
  outputPath?: string;
}

export declare function IntelligenceAgency(spec: IntelligenceAgencySpec): IdentifiedDefinition;

/** Native common/intelligence_agency_upgrades; schema: common/intelligence_agency_updates.cwt:14. */

export interface IntelligenceAgencyUpgradeSpec extends IntelligenceAgencyUpgradeBody {
  id: string;
  outputPath?: string;
  branch: "branch_intelligence" | "branch_defense" | "branch_operation" | "branch_operative" | "branch_crypto";
}

export declare function IntelligenceAgencyUpgrade(spec: IntelligenceAgencyUpgradeSpec): IdentifiedDefinition;

/** Native common/map_modes; schema: common/map_modes.cwt:32. */

export interface ScriptedMapModeSpec extends ScriptedMapModeBody {
  id: string;
  outputPath?: string;
}

export declare function ScriptedMapMode(spec: ScriptedMapModeSpec): IdentifiedDefinition;

/** Native common/military_industrial_organization/organizations; schema: common/military_industrial_organizations.cwt:8. */

export interface MilitaryIndustrialOrganizationSpec extends MilitaryIndustrialOrganizationBody {
  id: string;
  outputPath?: string;
}

export declare function MilitaryIndustrialOrganization(spec: MilitaryIndustrialOrganizationSpec): IdentifiedDefinition;

/** Native common/military_industrial_organization/policies; schema: common/mio_policies.cwt:8. */

export interface MioPolicySpec extends MioPolicyBody {
  id: string;
  outputPath?: string;
}

export declare function MioPolicy(spec: MioPolicySpec): IdentifiedDefinition;

/** Native common/modifier_definitions; schema: common/modifier_definitions.cwt:10. */

export interface ModifierDefinitionSpec extends ModifierDefinitionBody {
  id: string;
  outputPath?: string;
}

export declare function ModifierDefinition(spec: ModifierDefinitionSpec): IdentifiedDefinition;

/** Native common/mtth; schema: common/mtth.cwt:9. */

export interface MeanTimeToHappenSpec extends MeanTimeToHappenBody {
  id: string;
  outputPath?: string;
}

export declare function MeanTimeToHappen(spec: MeanTimeToHappenSpec): IdentifiedDefinition;

/** Native common/occupation_laws; schema: common/occupation_laws.cwt:8. */

export interface OccupationLawSpec extends OccupationLawBody {
  id: string;
  outputPath?: string;
}

export declare function OccupationLaw(spec: OccupationLawSpec): IdentifiedDefinition;

/** Native common/operation_phases; schema: common/operation_phases.cwt:8. */

export interface OperationPhaseSpec extends OperationPhaseBody {
  id: string;
  outputPath?: string;
}

export declare function OperationPhase(spec: OperationPhaseSpec): IdentifiedDefinition;

/** Native common/operation_tokens; schema: common/operation_tokens.cwt:8. */

export interface OperationTokenSpec extends OperationTokenBody {
  id: string;
  outputPath?: string;
}

export declare function OperationToken(spec: OperationTokenSpec): IdentifiedDefinition;

/** Native common/operations; schema: common/operations.cwt:10. */

export interface OperationSpec extends OperationBody {
  id: string;
  outputPath?: string;
}

export declare function Operation(spec: OperationSpec): IdentifiedDefinition;

/** Native common/opinion_modifiers; schema: common/opinions.cwt:8. */

export interface OpinionModifierSpec extends OpinionModifierBody {
  id: string;
  outputPath?: string;
}

export declare function OpinionModifier(spec: OpinionModifierSpec): IdentifiedDefinition;

/** Native common/peace_conference/categories; schema: common/peace_conference.cwt:31. */

export interface PeaceActionCategorySpec extends PeaceActionCategoryBody {
  id: string;
  outputPath?: string;
}

export declare function PeaceActionCategory(spec: PeaceActionCategorySpec): IdentifiedDefinition;

/** Native common/peace_conference/ai_peace; schema: common/peace_conference.cwt:38. */

export interface PeaceAiDesireSpec extends PeaceAiDesireBody {
  id: string;
  outputPath?: string;
}

export declare function PeaceAiDesire(spec: PeaceAiDesireSpec): IdentifiedDefinition;

/** Native common/peace_conference/cost_modifiers; schema: common/peace_conference.cwt:70. */

export interface PeaceActionModifierSpec extends PeaceActionModifierBody {
  id: string;
  outputPath?: string;
}

export declare function PeaceActionModifier(spec: PeaceActionModifierSpec): IdentifiedDefinition;

/** Native common/raids/categories; schema: common/raids.cwt:13. */

export interface RaidCategorySpec extends RaidCategoryBody {
  id: string;
  outputPath?: string;
}

export declare function RaidCategory(spec: RaidCategorySpec): IdentifiedDefinition;

/** Native common/raids; schema: common/raids.cwt:36. */

export interface RaidSpec extends RaidBody {
  id: string;
  outputPath?: string;
}

export declare function Raid(spec: RaidSpec): IdentifiedDefinition;

/** Native common/resistance_compliance_modifiers; schema: common/resistance_compliance_modifiers.cwt:23. */

export interface ResistanceComplianceModifierSpec extends ResistanceComplianceModifierBody {
  id: string;
  outputPath?: string;
}

export declare function ResistanceComplianceModifier(spec: ResistanceComplianceModifierSpec): IdentifiedDefinition;

/** Native common/resources; schema: common/resources.cwt:8. */

export interface ResourceSpec extends ResourceBody {
  id: string;
  outputPath?: string;
}

export declare function Resource(spec: ResourceSpec): IdentifiedDefinition;

/** Native common/scorers/country; schema: common/scorers.cwt:7. */

export interface CountryScorerSpec extends CountryScorerBody {
  id: string;
  outputPath?: string;
}

export declare function CountryScorer(spec: CountryScorerSpec): IdentifiedDefinition;

/** Native common/special_projects/projects; schema: common/special_projects.cwt:14. */

export interface SpecialProjectSpec extends SpecialProjectBody {
  id: string;
  outputPath?: string;
}

export declare function SpecialProject(spec: SpecialProjectSpec): IdentifiedDefinition;

/** Native common/special_projects/prototype_rewards; schema: common/special_projects.cwt:266. */

export interface PrototypeRewardSpec extends PrototypeRewardBody {
  id: string;
  outputPath?: string;
}

export declare function PrototypeReward(spec: PrototypeRewardSpec): IdentifiedDefinition;

/** Native common/special_projects/specialization; schema: common/special_projects.cwt:400. */

export interface SpecializationSpec extends SpecializationBody {
  id: string;
  outputPath?: string;
}

export declare function Specialization(spec: SpecializationSpec): IdentifiedDefinition;

/** Native common/modifiers; schema: common/static_modifiers.cwt:13. */

export interface StaticModifierSpec extends StaticModifierBody {
  id: string;
  outputPath?: string;
}

export declare function StaticModifier(spec: StaticModifierSpec): IdentifiedDefinition;

/** Native common/strategic_locations; schema: common/strategic_locations.cwt:31. */

export interface StrategicLocationSpec extends StrategicLocationBody {
  id: string;
  outputPath?: string;
}

export declare function StrategicLocation(spec: StrategicLocationSpec): IdentifiedDefinition;

/** Native common/technologies; schema: common/technologies.cwt:28. */

export interface TechnologySpec extends TechnologyBody {
  id: string;
  outputPath?: string;
}

export declare function Technology(spec: TechnologySpec): IdentifiedDefinition;

/** Native common/technology_sharing; schema: common/technologies.cwt:278. */

export interface TechnologySharingGroupSpec extends TechnologySharingGroupBody {
  id: string;
  outputPath?: string;
}

export declare function TechnologySharingGroup(spec: TechnologySharingGroupSpec): IdentifiedDefinition;

/** Native common/terrain; schema: common/terrain.cwt:30. */

export interface TerrainSpec extends TerrainBody {
  id: string;
  outputPath?: string;
}

export declare function Terrain(spec: TerrainSpec): IdentifiedDefinition;

/** Native common/terrain; schema: common/terrain.cwt:81. */

export interface GraphicalTerrainSpec extends GraphicalTerrainBody {
  id: string;
  outputPath?: string;
}

export declare function GraphicalTerrain(spec: GraphicalTerrainSpec): IdentifiedDefinition;

/** Native common/country_leader; schema: common/traits.cwt:52. */

export interface CountryLeaderTraitSpec extends CountryLeaderTraitBody {
  id: string;
  outputPath?: string;
}

export declare function CountryLeaderTrait(spec: CountryLeaderTraitSpec): IdentifiedDefinition;

/** Native common/unit_leader; schema: common/traits.cwt:99. */

export interface UnitLeaderTraitSpec extends UnitLeaderTraitBody {
  id: string;
  outputPath?: string;
}

export declare function UnitLeaderTrait(spec: UnitLeaderTraitSpec): IdentifiedDefinition;

/** Native common/scientist_traits; schema: common/traits.cwt:288. */

export interface ScientistTraitSpec extends ScientistTraitBody {
  id: string;
  outputPath?: string;
}

export declare function ScientistTrait(spec: ScientistTraitSpec): IdentifiedDefinition;

/** Native common/unit_medals; schema: common/unit_medals.cwt:10. */

export interface UnitMedalSpec extends UnitMedalBody {
  id: string;
  outputPath?: string;
}

export declare function UnitMedal(spec: UnitMedalSpec): IdentifiedDefinition;

/** Native common/units; schema: common/units.cwt:37. */

export interface UnitSpec extends UnitBody {
  id: string;
  outputPath?: string;
}

export declare function Unit(spec: UnitSpec): IdentifiedDefinition;

/** Native common/units/names_divisions; schema: common/units.cwt:324. */

export interface DivisionNamesSpec extends DivisionNamesBody {
  id: string;
  outputPath?: string;
}

export declare function DivisionNames(spec: DivisionNamesSpec): IdentifiedDefinition;

/** Native common/units/names_ships; schema: common/units.cwt:272. */

export interface ShipNamesSpec extends ShipNamesBody {
  id: string;
  outputPath?: string;
}

export declare function ShipNames(spec: ShipNamesSpec): IdentifiedDefinition;

/** Native common/wargoals; schema: common/wargoals.cwt:9. */

export interface WargoalSpec extends WargoalBody {
  id: string;
  outputPath?: string;
}

export declare function Wargoal(spec: WargoalSpec): IdentifiedDefinition;

/** Native gfx/interface/equipmentdesigner/graphic_db; schema: gfx/graphic_db.cwt:14. */

export interface GraphicDatabaseSpec extends GraphicDatabaseBody {
  id: string;
  outputPath?: string;
}

export declare function GraphicDatabase(spec: GraphicDatabaseSpec): IdentifiedDefinition;

/** Native gfx/models; schema: gfx/lights.cwt:10. */

export interface LightSpec extends LightBody {
  id: string;
  outputPath?: string;
}

export declare function Light(spec: LightSpec): IdentifiedDefinition;

/** Native gfx; schema: gfx/model_entities.cwt:25. */

export interface MeshSpec extends MeshBody {
  id: string;
  outputPath?: string;
}

export declare function Mesh(spec: MeshSpec): IdentifiedDefinition;

/** Native gfx; schema: gfx/model_entities.cwt:71. */

export interface EntitySpec extends EntityBody {
  id: string;
  outputPath?: string;
}

export declare function Entity(spec: EntitySpec): IdentifiedDefinition;

/** Native gfx; schema: gfx/model_entities.cwt:212. */

export interface ModelAnimationSpec extends ModelAnimationBody {
  id: string;
  outputPath?: string;
}

export declare function ModelAnimation(spec: ModelAnimationSpec): IdentifiedDefinition;

/** Native gfx/models; schema: gfx/particles.cwt:22. */

export interface PdxParticleSpec extends PdxParticleBody {
  id: string;
  outputPath?: string;
}

export declare function PdxParticle(spec: PdxParticleSpec): IdentifiedDefinition;

/** Native gfx/models; schema: gfx/particles.cwt:30. */

export interface ParticleSpec extends ParticleBody {
  id: string;
  outputPath?: string;
}

export declare function Particle(spec: ParticleSpec): IdentifiedDefinition;

/** Native history/units; schema: history/oobs.cwt:68. */

export interface UnitHistorySpec extends UnitHistoryBody {
  id: string;
  outputPath?: string;
}

export declare function UnitHistory(spec: UnitHistorySpec): IdentifiedDefinition;

/** Native common/state_category; schema: history/states.cwt:97. */

export interface StateCategorySpec extends StateCategoryBody {
  id: string;
  outputPath?: string;
}

export declare function StateCategory(spec: StateCategorySpec): IdentifiedDefinition;

/** Native interface; schema: interface/gfx.cwt:156. */

export interface BitmapFontSpec extends BitmapFontBody {
  id: string;
  outputPath?: string;
}

export declare function BitmapFont(spec: BitmapFontSpec): IdentifiedDefinition;

/** Native map; schema: map/map_consolidated.cwt:19. */

export interface AdjacencyRuleSpec extends AdjacencyRuleBody {
  id: string;
  outputPath?: string;
}

export declare function AdjacencyRule(spec: AdjacencyRuleSpec): IdentifiedDefinition;

/** Native map/supplyareas; schema: map/regions.cwt:12. */

export interface SupplyAreaSpec extends SupplyAreaBody {
  id: number;
  outputPath?: string;
}

export declare function SupplyArea(spec: SupplyAreaSpec): Definition;

/** Native map/strategicregions; schema: map/regions.cwt:22. */

export interface StrategicRegionSpec extends StrategicRegionBody {
  id: number;
  outputPath?: string;
}

export declare function StrategicRegion(spec: StrategicRegionSpec): Definition;

/** Native music; schema: music.cwt:26. */

export interface MusicPlaylistEntrySpec extends MusicPlaylistEntryBody {
  id: string;
  outputPath?: string;
}

export declare function MusicPlaylistEntry(spec: MusicPlaylistEntrySpec): IdentifiedDefinition;

/** Native music; schema: music.cwt:20. */

export interface MusicAssetSpec extends MusicAssetBody {
  id: string;
  outputPath?: string;
}

export declare function MusicAsset(spec: MusicAssetSpec): IdentifiedDefinition;

/** Native portraits; schema: portraits.cwt:19. */

export interface PortraitSpec extends PortraitBody {
  id: string;
  outputPath?: string;
}

export declare function Portrait(spec: PortraitSpec): IdentifiedDefinition;

/** Native sound; schema: sound.cwt:93. */

export interface SoundCategorySpec extends SoundCategoryBody {
  id: string;
  outputPath?: string;
}

export declare function SoundCategory(spec: SoundCategorySpec): IdentifiedDefinition;

/** Native sound; schema: sound.cwt:34. */

export interface SoundEffectSpec extends SoundEffectBody {
  id: string;
  outputPath?: string;
}

export declare function SoundEffect(spec: SoundEffectSpec): IdentifiedDefinition;

/** Native sound; schema: sound.cwt:25. */

export interface SoundAssetSpec extends SoundAssetBody {
  id: string;
  outputPath?: string;
}

export declare function SoundAsset(spec: SoundAssetSpec): IdentifiedDefinition;

/** Native events; schema: events.cwt:39. */

export interface NativeCountryEventSpec extends NativeCountryEventBody {
  id: string;
  outputPath?: string;
}

export declare function NativeCountryEvent(spec: NativeCountryEventSpec): IdentifiedDefinition;

/** Native events; schema: events.cwt:39. */

export interface NativeStateEventSpec extends NativeStateEventBody {
  id: string;
  outputPath?: string;
}

export declare function NativeStateEvent(spec: NativeStateEventSpec): IdentifiedDefinition;

/** Native events; schema: events.cwt:39. */

export interface NativeNewsEventSpec extends NativeNewsEventBody {
  id: string;
  outputPath?: string;
}

export declare function NativeNewsEvent(spec: NativeNewsEventSpec): IdentifiedDefinition;

/** Native events; schema: events.cwt:39. */

export interface NativeUnitLeaderEventSpec extends NativeUnitLeaderEventBody {
  id: string;
  outputPath?: string;
}

export declare function NativeUnitLeaderEvent(spec: NativeUnitLeaderEventSpec): IdentifiedDefinition;

/** Native events; schema: events.cwt:39. */

export interface NativeOperativeEventSpec extends NativeOperativeEventBody {
  id: string;
  outputPath?: string;
}

export declare function NativeOperativeEvent(spec: NativeOperativeEventSpec): IdentifiedDefinition;

/** Native common/national_focus; schema: common/national_focus.cwt:63. */

export interface NativeFocusTreeSpec extends NativeFocusTreeBody {
  id: string;
  outputPath?: string;
}

export declare function NativeFocusTree(spec: NativeFocusTreeSpec): IdentifiedDefinition;

/** Native common/continuous_focus; schema: common/national_focus.cwt:820. */

export interface ContinuousFocusPaletteSpec extends ContinuousFocusPaletteBody {
  id: string;
  outputPath?: string;
}

export declare function ContinuousFocusPalette(spec: ContinuousFocusPaletteSpec): IdentifiedDefinition;

/** Native common/national_focus; schema: common/national_focus.cwt:592. */

export interface SharedFocusSpec extends SharedFocusBody {
  id: string;
  outputPath?: string;
}

export declare function SharedFocus(spec: SharedFocusSpec): IdentifiedDefinition;

/** Native common/national_focus; schema: common/national_focus.cwt:592. */

export interface JointFocusSpec extends JointFocusBody {
  id: string;
  outputPath?: string;
}

export declare function JointFocus(spec: JointFocusSpec): IdentifiedDefinition;

/** Native common/national_focus; schema: common/national_focus.cwt:920. */

export interface FocusStyleSpec extends FocusStyleBody {
  id: string;
  outputPath?: string;
}

export declare function FocusStyle(spec: FocusStyleSpec): IdentifiedDefinition;

/** Native common/decisions/categories; schema: common/decisions.cwt:80. */

export interface NativeDecisionCategorySpec extends NativeDecisionCategoryBody {
  id: string;
  outputPath?: string;
}

export declare function NativeDecisionCategory(spec: NativeDecisionCategorySpec): IdentifiedDefinition;

/** Native common/decisions; schema: common/decisions.cwt:232. */

export interface NativeDecisionSpec extends NativeDecisionBody {
  id: string;
  outputPath?: string;
  category: string;
}

export declare function NativeDecision(spec: NativeDecisionSpec): IdentifiedDefinition;

/** Native common/ideas; schema: common/ideas.cwt:14. */

export interface NativeIdeasSpec extends NativeIdeasBody {
  id: string;
  outputPath?: string;
}

export declare function NativeIdeas(spec: NativeIdeasSpec): IdentifiedDefinition;

/** Native common/on_actions; schema: on_actions.cwt:548. */

export type OnActionSpec = { id: "on_startup"; outputPath?: string; } & NativeShape413 | { id: "on_daily"; outputPath?: string; } & NativeShape414 | { id: "on_weekly"; outputPath?: string; } & NativeShape414 | { id: "on_monthly"; outputPath?: string; } & NativeShape414 | { id: "on_stage_coup"; outputPath?: string; } & NativeShape415 | { id: "on_coup_succeeded"; outputPath?: string; } & NativeShape414 | { id: "on_government_change"; outputPath?: string; } & NativeShape414 | { id: "on_ruling_party_change"; outputPath?: string; } & NativeShape414 | { id: "on_ruling_party_change_immediate"; outputPath?: string; } & NativeShape414 | { id: "on_new_term_election"; outputPath?: string; } & NativeShape414 | { id: "on_peaceconference_ended"; outputPath?: string; } & NativeShape414 | { id: "on_peaceconference_started"; outputPath?: string; } & NativeShape416 | { id: "on_send_volunteers"; outputPath?: string; } & NativeShape414 | { id: "on_recall_volunteers"; outputPath?: string; } & NativeShape414 | { id: "on_border_war_lost"; outputPath?: string; } & NativeShape415 | { id: "on_war_relation_added"; outputPath?: string; } & NativeShape414 | { id: "on_declare_war"; outputPath?: string; } & NativeShape414 | { id: "on_war"; outputPath?: string; } & NativeShape414 | { id: "on_peace"; outputPath?: string; } & NativeShape414 | { id: "on_capitulation"; outputPath?: string; } & NativeShape414 | { id: "on_capitulation_immediate"; outputPath?: string; } & NativeShape414 | { id: "on_uncapitulation"; outputPath?: string; } & NativeShape414 | { id: "on_annex"; outputPath?: string; } & NativeShape414 | { id: "on_civil_war_end_before_annexation"; outputPath?: string; } & NativeShape414 | { id: "on_civil_war_end"; outputPath?: string; } & NativeShape414 | { id: "on_puppet"; outputPath?: string; } & NativeShape414 | { id: "on_force_government"; outputPath?: string; } & NativeShape414 | { id: "on_liberate"; outputPath?: string; } & NativeShape414 | { id: "on_release_as_free"; outputPath?: string; } & NativeShape414 | { id: "on_release_as_puppet"; outputPath?: string; } & NativeShape414 | { id: "on_guarantee"; outputPath?: string; } & NativeShape414 | { id: "on_military_access"; outputPath?: string; } & NativeShape414 | { id: "on_offer_military_access"; outputPath?: string; } & NativeShape414 | { id: "on_call_allies"; outputPath?: string; } & NativeShape414 | { id: "on_join_allies"; outputPath?: string; } & NativeShape414 | { id: "on_lend_lease"; outputPath?: string; } & NativeShape414 | { id: "on_incoming_lend_lease"; outputPath?: string; } & NativeShape414 | { id: "on_send_expeditionary_force"; outputPath?: string; } & NativeShape414 | { id: "on_return_expeditionary_forces"; outputPath?: string; } & NativeShape414 | { id: "on_request_expeditionary_forces"; outputPath?: string; } & NativeShape414 | { id: "on_ask_for_state_control"; outputPath?: string; } & NativeShape414 | { id: "on_give_state_control"; outputPath?: string; } & NativeShape414 | { id: "on_peace_proposal"; outputPath?: string; } & NativeShape414 | { id: "on_send_attache"; outputPath?: string; } & NativeShape414 | { id: "on_create_faction"; outputPath?: string; } & NativeShape414 | { id: "on_faction_formed"; outputPath?: string; } & NativeShape414 | { id: "on_offer_join_faction"; outputPath?: string; } & NativeShape414 | { id: "on_join_faction"; outputPath?: string; } & NativeShape414 | { id: "on_assume_faction_leadership"; outputPath?: string; } & NativeShape414 | { id: "on_leave_faction"; outputPath?: string; } & NativeShape414 | { id: "on_subject_annexed"; outputPath?: string; } & NativeShape414 | { id: "on_subject_free"; outputPath?: string; } & NativeShape414 | { id: "on_subject_autonomy_level_change"; outputPath?: string; } & NativeShape414 | { id: "on_government_exiled"; outputPath?: string; } & NativeShape414 | { id: "on_host_changed_from_capitulation"; outputPath?: string; } & NativeShape414 | { id: "on_exile_government_reinstated"; outputPath?: string; } & NativeShape414 | { id: "on_state_control_changed"; outputPath?: string; } & NativeShape414 | { id: "on_generate_wargoal"; outputPath?: string; } & NativeShape414 | { id: "on_justifying_wargoal_pulse"; outputPath?: string; } & NativeShape414 | { id: "on_wargoal_expire"; outputPath?: string; } & NativeShape414 | { id: "on_unit_leader_created"; outputPath?: string; } & NativeShape417 | { id: "on_army_leader_daily"; outputPath?: string; } & NativeShape417 | { id: "on_army_leader_won_combat"; outputPath?: string; } & NativeShape417 | { id: "on_army_leader_lost_combat"; outputPath?: string; } & NativeShape417 | { id: "on_unit_leader_level_up"; outputPath?: string; } & NativeShape417 | { id: "on_army_leader_promoted"; outputPath?: string; } & NativeShape417 | { id: "on_unit_leader_promote_from_ranks_veteran"; outputPath?: string; } & NativeShape417 | { id: "on_unit_leader_promote_from_ranks_green"; outputPath?: string; } & NativeShape417 | { id: "on_nuke_drop"; outputPath?: string; } & NativeShape414 | { id: "on_pride_of_the_fleet_sunk"; outputPath?: string; } & NativeShape414 | { id: "on_naval_invasion"; outputPath?: string; } & NativeShape415 | { id: "on_paradrop"; outputPath?: string; } & NativeShape415 | { id: "on_units_paradropped_in_state"; outputPath?: string; } & NativeShape418 | { id: "on_add_history"; outputPath?: string; } & NativeShape416 | { id: "on_ace_promoted"; outputPath?: string; } & NativeShape414 | { id: "on_ace_killed"; outputPath?: string; } & NativeShape414 | { id: "on_ace_killed_on_accident"; outputPath?: string; } & NativeShape414 | { id: "on_non_ace_killed_other_ace"; outputPath?: string; } & NativeShape414 | { id: "on_ace_killed_by_ace"; outputPath?: string; } & NativeShape414 | { id: "on_ace_killed_other_ace"; outputPath?: string; } & NativeShape414 | { id: "on_aces_killed_each_other"; outputPath?: string; } & NativeShape414 | { id: "on_operation_completed"; outputPath?: string; } & NativeShape419 | { id: "on_operative_detected_during_operation"; outputPath?: string; } & NativeShape420 | { id: "on_operative_on_mission_spotted"; outputPath?: string; } & NativeShape420 | { id: "on_operative_captured"; outputPath?: string; } & NativeShape420 | { id: "on_operative_created"; outputPath?: string; } & NativeShape420 | { id: "on_operative_death"; outputPath?: string; } & NativeShape420 | { id: "on_operative_recruited"; outputPath?: string; } & NativeShape420 | { id: "on_fully_decrypted_cipher"; outputPath?: string; } & NativeShape414 | { id: "on_activated_active_decryption_bonuses"; outputPath?: string; } & NativeShape414 | { id: "on_mio_size_increased"; outputPath?: string; } & NativeShape421 | { id: "on_mio_design_team_assigned_to_tech"; outputPath?: string; } & NativeShape421 | { id: "on_mio_design_team_assigned_to_variant"; outputPath?: string; } & NativeShape421 | { id: "on_mio_industrial_manufacturer_assigned"; outputPath?: string; } & NativeShape421 | { id: "on_mio_tech_research_cancelled"; outputPath?: string; } & NativeShape421 | { id: "on_mio_tech_research_completed"; outputPath?: string; } & NativeShape421 | { id: "on_mio_industrial_manufacturer_unassigned"; outputPath?: string; } & NativeShape421 | { id: "on_project_completion"; outputPath?: string; } & NativeShape416 | { id: "on_before_peace_conference_start"; outputPath?: string; } & NativeShape416 | { id: "on_contract_started"; outputPath?: string; } & NativeShape422 | { id: "on_contract_finished"; outputPath?: string; } & NativeShape422 | { id: "on_contract_cancelled"; outputPath?: string; } & NativeShape422 | { id: "on_deployed_leader_defeated"; outputPath?: string; } & NativeShape416;

export declare function OnAction(spec: OnActionSpec): IdentifiedDefinition;

interface NativeShape1 {
  "entries"?: { readonly [key: string]: number } | { readonly [key: string]: number };
  "hiddenModifier"?: CwtNode;
  "customModifierTooltip"?: string;
}

interface NativeShape2 {
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: CwtNode };
  "noPhenomenon"?: CwtNode;
  "rainLight"?: CwtNode;
  "rainHeavy"?: CwtNode;
  "snow"?: CwtNode;
  "blizzard"?: CwtNode;
  "arcticWater"?: CwtNode;
  "mud"?: CwtNode;
  "sandstorm"?: CwtNode;
  "night"?: CwtNode;
  "amphibious"?: CwtNode;
  "fort"?: CwtNode;
  "river"?: CwtNode;
}

interface NativeShape3 {
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: CwtNode };
  "noPhenomenon"?: CwtNode;
  "rainLight"?: CwtNode;
  "rainHeavy"?: CwtNode;
  "snow"?: CwtNode;
  "blizzard"?: CwtNode;
  "arcticWater"?: CwtNode;
  "mud"?: CwtNode;
  "sandstorm"?: CwtNode;
  "night"?: CwtNode;
  "amphibious"?: CwtNode;
  "fort"?: CwtNode;
  "river"?: NativeShape2;
}

interface NativeShape4 {
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: CwtNode };
  "noPhenomenon"?: CwtNode;
  "rainLight"?: CwtNode;
  "rainHeavy"?: CwtNode;
  "snow"?: CwtNode;
  "blizzard"?: CwtNode;
  "arcticWater"?: CwtNode;
  "mud"?: CwtNode;
  "sandstorm"?: CwtNode;
  "night"?: CwtNode;
  "amphibious"?: CwtNode;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
}

interface NativeShape5 {
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: CwtNode };
  "noPhenomenon"?: CwtNode;
  "rainLight"?: CwtNode;
  "rainHeavy"?: CwtNode;
  "snow"?: CwtNode;
  "blizzard"?: CwtNode;
  "arcticWater"?: CwtNode;
  "mud"?: CwtNode;
  "sandstorm"?: CwtNode;
  "night"?: CwtNode;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
}

interface NativeShape6 {
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: CwtNode };
  "noPhenomenon"?: CwtNode;
  "rainLight"?: CwtNode;
  "rainHeavy"?: CwtNode;
  "snow"?: CwtNode;
  "blizzard"?: CwtNode;
  "arcticWater"?: CwtNode;
  "mud"?: CwtNode;
  "sandstorm"?: CwtNode;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
}

interface NativeShape7 {
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: CwtNode };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
}

interface NativeShape8 {
  "entries"?: { readonly [key: string]: number } | { readonly [key: string]: number } | { readonly [key: string]: NativeShape7 };
  "hiddenModifier"?: NativeShape1;
  "customModifierTooltip"?: string;
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
}

interface NativeShape9 {
  "add"?: number | string;
  "factor"?: number | string;
  "trigger"?: Trigger<ScopeByName["unit_leader"]>;
}

interface NativeShape10 {
  "base"?: number;
  "factor"?: number;
  "modifier"?: NativeShape9;
}

interface AbilityBody {
  "name": string;
  "desc": string;
  "icon"?: string;
  "soundEffect"?: string;
  "type": "army_leader";
  "requiresDeployedHq"?: boolean;
  "allowed"?: Trigger<ScopeByName["unit_leader"]>;
  "cost": number;
  "duration": number;
  "cooldown"?: number;
  "unitModifiers"?: NativeShape8;
  "oneTimeEffect"?: Effect<ScopeByName["unit_leader"]>;
  "cancelable"?: boolean;
  "aiWillDo"?: NativeShape10;
}

interface NativeShape12 {
  "entries"?: { readonly [key: string]: number } | { readonly [key: string]: number };
  "hiddenModifier"?: NativeShape1;
  "customModifierTooltip"?: string;
}

interface AceBody {
  "type": "air_transport" | "cas" | "fighter" | "interceptor" | "missile" | "naval_bomber" | "scout_plane" | "strategic_bomber" | "suicide" | "tactical_bomber" | "maritime_patrol_plane" | "heavy_fighter" | "ballistic_missile" | "emplacement_gun_ammo" | "nuclear_missile" | "sam_missile" | readonly ("air_transport" | "cas" | "fighter" | "interceptor" | "missile" | "naval_bomber" | "scout_plane" | "strategic_bomber" | "suicide" | "tactical_bomber" | "maritime_patrol_plane" | "heavy_fighter" | "ballistic_missile" | "emplacement_gun_ammo" | "nuclear_missile" | "sam_missile")[];
  "chance": number;
  "effect": NativeShape12;
}

interface NativeShape14 {
  "frames": readonly (number)[];
  "colors": readonly (readonly (number)[])[];
}

interface AchievementBody {
  "possible": Trigger<ScopeByName["country"]>;
  "happened": Trigger<ScopeByName["country"]>;
  "ribbon"?: NativeShape14;
}

interface NativeShape16 {
  "type": "role_ratio" | "build_army" | "build_airplane" | "build_ship";
  "id": string;
  "value": number;
}

interface NativeShape17 {
  "type": "equipment_production_factor" | "template_prio" | "unit_ratio";
  "id": string;
  "value": number;
}

interface NativeShape18 {
  "type": "equipment_production_min_factories";
  "id": string | "cv_fighter" | "cv_interceptor" | "cv_cas" | "cv_naval_bomber" | "cv_suicide" | "heavy_fighter";
  "value": number;
}

interface NativeShape19 {
  "type": "equipment_production_min_factories_archetype";
  "id": string;
  "value": number;
}

interface NativeShape20 {
  "type": "equipment_variant_production_factor" | "save_equipment" | "production_upgrade_desire_offset" | "equipment_production_surplus_management" | "equipment_market_buying_threshold" | "equipment_market_for_sale_threshold" | "equipment_market_for_sale_factor" | "equipment_market_min_for_sale" | "equipment_market_max_for_sale" | "equipment_market_spend_factories";
  "id": string | "cv_fighter" | "cv_interceptor" | "cv_cas" | "cv_naval_bomber" | "cv_suicide" | "heavy_fighter";
  "value": number;
}

interface NativeShape21 {
  "type": "pp_spend_amount" | "pp_spend_priority";
  "id": "admiral" | "general" | "idea" | "decision" | "relation" | "guarantee" | "supportive_scientist" | "become_faction_leader" | "embargo" | string;
  "value": number;
}

interface NativeShape22 {
  "type": "land_xp_spend_priority";
  "id": "division_template" | "upgrade_xp_cutoff" | "unlock_doctrine";
  "value": number;
}

interface NativeShape23 {
  "type": "air_xp_spend_priority";
  "id": "division_template" | "upgrade_xp_cutoff" | "unlock_doctrine";
  "value": number;
}

interface NativeShape24 {
  "type": "navy_xp_spend_priority";
  "id": "division_template" | "upgrade_xp_cutoff" | "unlock_doctrine";
  "value": number;
}

interface NativeShape25 {
  "type": "naval_dominance" | "area_priority";
  "id": string;
  "value": number;
}

interface NativeShape26 {
  "type": "alliance" | "antagonize" | "avoid_starting_wars" | "asking_foreign_garrison" | "befriend" | "conquer" | "consider_weak" | "contain" | "declare_war" | "diplo_action_acceptance" | "diplo_action_desire" | "dont_defend_ally_borders" | "dont_join_wars_with" | "equipment_market_trade_desire" | "force_defend_ally_borders" | "force_concentration_factor" | "front_armor_score" | "ignore" | "ignore_claim" | "influence" | "invade" | "occupation_policy" | "prepare_for_war" | "protect" | "send_lend_lease_desire" | "send_volunteers_desire" | "support" | "raid_target_country" | "garrison";
  "id": string;
  "value": number;
}

interface NativeShape27 {
  "type": "alliance" | "antagonize" | "avoid_starting_wars" | "asking_foreign_garrison" | "befriend" | "conquer" | "consider_weak" | "contain" | "declare_war" | "diplo_action_acceptance" | "diplo_action_desire" | "dont_defend_ally_borders" | "dont_join_wars_with" | "equipment_market_trade_desire" | "force_defend_ally_borders" | "force_concentration_factor" | "front_armor_score" | "ignore" | "ignore_claim" | "influence" | "invade" | "occupation_policy" | "prepare_for_war" | "protect" | "send_lend_lease_desire" | "send_volunteers_desire" | "support" | "raid_target_country" | "garrison";
  "target": string;
  "value": number;
}

interface NativeShape28 {
  "type": "conquer" | "antagonize" | "befriend";
  "id": string;
}

interface NativeShape29 {
  "type": "recruit_scientist";
  "id": string;
  "value": number;
}

interface NativeShape30 {
  "type": "dont_join_wars_with";
  "id"?: string;
  "targetCountry"?: string;
  "value": number;
}

interface NativeShape31 {
  "type": "naval_convoy_raid_region" | "naval_avoid_region" | "strategic_air_importance" | "strike_force_home_base" | "naval_dominance";
  "id": string;
  "value": number;
}

interface NativeShape32 {
  "type": "naval_dominance";
  "id": string;
  "value": number;
}

interface NativeShape33 {
  "type": "strike_force_home_base";
  "id": string;
}

interface NativeShape34 {
  "type": "added_military_to_civilian_factory_ratio" | "air_factory_balance" | "dockyard_to_military_factory_ratio" | "equipment_stockpile_surplus_ratio" | "ignore_army_incompetence" | "spare_unit_factor" | "template_xp_reserve" | "force_build_armies" | "garrison" | "produce_unit_for_subject_supply_chunks" | "intelligence_agency_usable_factories" | "agency_ai_base_num_factories_factor" | "agency_ai_per_upgrade_factories_factor" | "garrison_reinforcement_priority" | "operation_equipment_priority" | "railway_gun_divisions_ratio" | "naval_invasion_focus" | "naval_invasion_dominance_weight" | "avoid_starting_wars" | "min_wanted_supply_trucks" | "wanted_supply_trucks" | "min_wanted_supply_trains" | "wanted_supply_trains" | "ai_wanted_divisions_factor" | "equipment_market_spend_factories" | "force_concentration_factor" | "become_spymaster" | "become_head_of_crypto" | "become_head_of_operations" | "become_head_of_counter_intel";
  "value": number;
}

interface NativeShape35 {
  "type": "theatre_distribution_demand_increase" | "factory_build_score_factor";
  "target": string;
  "value": number;
}

interface NativeShape36 {
  "type": "theatre_distribution_demand_increase" | "factory_build_score_factor";
  "id": string;
  "value": number;
}

interface NativeShape37 {
  "type": "build_building";
  "id": string;
  "target"?: number;
  "value": number;
}

interface NativeShape38 {
  "type": "diplo_action_desire" | "diplo_action_acceptance";
  "id": string;
  "target": "non_aggression_pact" | "guarantee" | "puppet" | "military_access" | "offer_military_access" | "docking_rights" | "offer_docking_rights" | "declare_war" | "join_allies" | "call_allies" | "improve_relation" | "befriend" | "market_access_rights" | "embargo" | "create_faction" | "offer_join_faction" | "join_faction" | "request_access_to_licence_production" | "send_volunteers" | "give_state_control" | "air_base_access" | "lend_lease" | "incoming_lend_lease" | "send_expeditionary_force" | "request_expeditionary_forces" | "return_expeditionary_forces" | "send_attache" | "naval_blockade";
  "value": number;
}

interface NativeShape39 {
  "type": "naval_mission_threshold";
  "id": "MISSION_TRAINING" | "MISSION_PATROL" | "MISSION_STRIKE_FORCE" | "MISSION_CONVOY_ESCORT" | "MISSION_CONVOY_RAIDING" | "MISSION_MINES_PLANTING" | "MISSION_MINES_SWEEPING";
  "value": number;
}

interface NativeShape40 {
  "type": "building_target";
  "id": string;
  "value": number;
}

interface NativeShape41 {
  "type": "research_tech" | "research_weight_factor";
  "id": string | number;
  "value": number;
}

interface NativeShape42 {
  "type": "scorched_earth_prio";
  "id": string;
  "value"?: number;
  "states"?: readonly (string)[];
}

interface NativeShape43 {
  "type": "put_unit_buffers";
  "ratio": number;
  "orderId"?: number;
  "states"?: readonly (string)[];
  "area"?: readonly (string)[];
  "subtractInvasionsFromNeed"?: readonly (boolean)[];
  "subtractFrontsFromNeed"?: readonly (boolean)[];
}

interface NativeShape44 {
  "type": "front_control";
  "tag"?: readonly (string)[];
  "id"?: string;
  "state"?: readonly (string)[];
  "area"?: readonly (string)[];
  "strategicRegion"?: readonly (string)[];
  "countryTrigger"?: Trigger<ScopeByName["country"]>;
  "stateTrigger"?: Trigger<ScopeByName["state"]>;
  "ratio"?: number;
  "priority"?: number;
  "ordertype"?: "front" | "invasion";
  "executionType"?: "careful" | "balanced" | "rush" | "rush_weak";
  "executeOrder"?: boolean;
  "manualAttack"?: boolean;
  "value"?: number;
}

interface NativeShape45 {
  "type": "front_unit_request" | "invasion_unit_request";
  "tag"?: readonly (string)[];
  "id"?: readonly (string)[];
  "state"?: readonly (string)[];
  "strategicRegion"?: readonly (string)[];
  "area"?: readonly (string)[];
  "countryTrigger"?: Trigger<ScopeByName["country"]>;
  "stateTrigger"?: Trigger<ScopeByName["state"]>;
  "value": number;
  "ratio"?: number;
}

interface NativeShape46 {
  "type": "intelligence_agency_branch_desire_factor";
  "id": "branch_intelligence" | "branch_defense" | "branch_operation" | "branch_operative" | "branch_crypto";
  "value": number;
}

interface NativeShape47 {
  "type": "spent_faction_initiative_priority";
  "id": "unlock_faction_commander" | "unlock_doctrine_sharing" | "program";
  "value": number;
}

interface NativeShape48 {
  "type": "asking_foreign_garrison";
  "value": number;
  "id"?: string;
}

interface NativeShape49 {
  "type": "operative_mission";
  "mission": "build_intel_network" | "counter_intelligence" | "quiet_network" | "boost_ideology" | "propaganda" | "root_out_resistance" | "control_trade" | "diplomatic_pressure" | "no_mission";
  "value": number;
  "missionTarget"?: string;
  "state"?: readonly (string)[];
  "priority"?: number;
  "numOperatives"?: number;
}

interface NativeShape50 {
  "type": "operative_operation";
  "operation": string | number;
  "value": number;
  "operationTarget": string | number;
}

interface NativeShape51 {
  "type": "equipment_market_buy";
  "equipmentType"?: string;
  "seller"?: string;
  "value": number;
}

interface NativeShape52 {
  "type": "force_concentration_front_factor";
  "tag"?: readonly (string)[];
  "state"?: readonly (string)[];
  "strategicRegion"?: readonly (string)[];
  "area"?: readonly (string)[];
  "countryTrigger"?: Trigger<ScopeByName["country"]>;
  "stateTrigger"?: Trigger<ScopeByName["state"]>;
  "ratio"?: number;
  "value": number;
}

interface NativeShape53 {
  "type": "force_concentration_target_weight";
  "tag"?: readonly (string)[];
  "state"?: readonly (string)[];
  "strategicRegion"?: readonly (string)[];
  "area"?: readonly (string)[];
  "countryTrigger"?: Trigger<ScopeByName["country"]>;
  "stateTrigger"?: Trigger<ScopeByName["state"]>;
  "value": number;
}

interface NativeShape54 {
  "type": "convoy_raiding_target";
  "id": string;
  "value": number;
}

interface NativeShape55 {
  "type": "naval_blockade";
  "targetCountry": string;
  "id": string;
  "value": number;
}

interface AiStrategyBody {
  "allowed"?: Trigger<ScopeByName["country"]>;
  "targetArray"?: string;
  "targets"?: readonly (string)[];
  "enableReverse"?: Trigger<ScopeByName["country"]>;
  "enable"?: Trigger<ScopeByName["country"]>;
  "abort"?: Trigger<ScopeByName["country"]>;
  "abortWhenNotEnabled"?: boolean;
  "reversed"?: boolean;
  "aiStrategy"?: NativeShape16 | NativeShape17 | NativeShape18 | NativeShape19 | NativeShape20 | NativeShape21 | NativeShape22 | NativeShape23 | NativeShape24 | NativeShape25 | NativeShape26 | NativeShape27 | NativeShape28 | NativeShape29 | NativeShape30 | NativeShape31 | NativeShape33 | NativeShape34 | NativeShape35 | NativeShape36 | NativeShape37 | NativeShape38 | NativeShape39 | NativeShape40 | NativeShape41 | NativeShape42 | NativeShape43 | NativeShape44 | NativeShape45 | NativeShape46 | NativeShape47 | NativeShape48 | NativeShape49 | NativeShape50 | NativeShape51 | NativeShape52 | NativeShape53 | NativeShape54 | NativeShape55;
  "addAiStrategy"?: NativeShape32;
}

interface NativeShape57 {
  "add"?: number | string;
  "factor"?: number | string;
  "trigger"?: Trigger<ScopeByName["country"]>;
}

interface NativeShape58 {
  "base"?: number;
  "factor"?: number;
  "modifier"?: NativeShape57;
}

interface AiStrategyPlanBody {
  "name"?: string | number | boolean;
  "desc"?: string;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "enable": Trigger<ScopeByName["country"]>;
  "abort"?: Trigger<ScopeByName["country"]>;
  "abortWhenNotEnabled"?: boolean;
  "aiNationalFocuses"?: readonly (string)[];
  "focusFactors"?: { readonly [key: string]: number };
  "research"?: { readonly [key: string]: number };
  "ideas"?: { readonly [key: string]: number };
  "traits"?: { readonly [key: string]: number };
  "aiStrategy"?: NativeShape16 | NativeShape17 | NativeShape18 | NativeShape19 | NativeShape20 | NativeShape21 | NativeShape22 | NativeShape23 | NativeShape24 | NativeShape25 | NativeShape26 | NativeShape27 | NativeShape28 | NativeShape29 | NativeShape30 | NativeShape31 | NativeShape33 | NativeShape34 | NativeShape35 | NativeShape36 | NativeShape37 | NativeShape38 | NativeShape39 | NativeShape40 | NativeShape41 | NativeShape42 | NativeShape43 | NativeShape44 | NativeShape45 | NativeShape46 | NativeShape47 | NativeShape48 | NativeShape49 | NativeShape50 | NativeShape51 | NativeShape52 | NativeShape53 | NativeShape54 | NativeShape55;
  "addAiStrategy"?: NativeShape32;
  "weight"?: NativeShape58;
}

interface NativeShape60 {
  "desc"?: string;
  "canBeCalledToWar"?: boolean;
  "canBeSpymaster"?: boolean;
  "canBoostOtherIdeologies"?: boolean;
  "canCreateCollaborationGovernment"?: boolean;
  "canCreateFactions"?: boolean;
  "canDeclareWarOnSameIdeology"?: boolean;
  "canDeclareWarWithoutWargoalWhenInWar"?: boolean;
  "canDeclineCallToWar"?: boolean;
  "canForceGovernment"?: boolean;
  "canGenerateFemaleAces"?: boolean;
  "canGuaranteeOtherIdeologies"?: boolean;
  "canJoinFactions"?: boolean;
  "canJoinFactionsNotAllowedDiplomacy"?: boolean;
  "canJoinOppositeFactions"?: boolean;
  "canLowerTension"?: boolean;
  "canNotDeclareWar"?: boolean;
  "canOccupyNonWar"?: boolean;
  "canOnlyJustifyWarOnThreatCountry"?: boolean;
  "canPuppet"?: boolean;
  "canSendVolunteers"?: boolean;
  "canUseKamikazePilots"?: boolean;
  "contributesOperatives"?: boolean;
  "unitsDeployedToOverlord"?: boolean;
  "canBoostOwnIdeology"?: boolean;
  "canGenerateFemaleUnitLeaders"?: boolean;
  "canGenerateFemaleCountryLeaders"?: boolean;
  "canAccessMarket"?: boolean;
  "canUseUnderwayReplenishment"?: boolean;
}

interface NativeShape61 {
  "trigger"?: Trigger<ScopeByName["country"]>;
  "add"?: number;
  "factor"?: number;
}

interface NativeShape62 {
  "add"?: number;
  "factor"?: number;
  "modifier"?: NativeShape61;
}

interface AutonomyStateBody {
  "default"?: boolean;
  "isPuppet"?: boolean;
  "useOverlordColor"?: boolean;
  "minFreedomLevel": number;
  "peaceConferenceInitialFreedom"?: number;
  "manpowerInfluence"?: number;
  "rule": NativeShape60;
  "modifier": NativeShape12;
  "aiSubjectWantsHigher": NativeShape62;
  "aiOverlordWantsLower": NativeShape62;
  "aiOverlordWantsGarrison"?: Trigger<ScopeByName["country"]>;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "allowedLevelsFilter"?: readonly (string)[];
  "useForPeaceConferenceWeight"?: NativeShape58;
  "canTakeLevel"?: Trigger<ScopeByName["country"]>;
  "canLoseLevel"?: Trigger<ScopeByName["country"]>;
}

interface NativeShape64 {
  "minor"?: true;
  "history": string;
  "requiredDlc"?: readonly ("Poland: United and Ready" | "Together for Victory" | "Axis Armor Pack" | "Death or Dishonor" | "Waking the Tiger" | "Man the Guns" | "La Resistance" | "Battle for the Bosporus" | "No Step Back" | "By Blood Alone" | "Arms Against Tyranny" | "Trial of Allegiance" | "Gotterdammerung" | "Graveyard of Empires" | "Expansion Pass 1: Supporter Pack" | "No Compromise, No Surrender" | "Peace For Our Time" | "Thunder at Our Gates")[];
  "ideology": string;
  "version"?: string | number | boolean;
  "label"?: readonly (string | number | boolean)[];
  "assumeNotPlayedIfMissingData"?: boolean;
  "overrideLeaderPortrait"?: string;
  "available"?: Trigger<ScopeByName["country"]>;
  "ideas"?: readonly (string)[];
  "focuses"?: readonly (string)[];
}

interface NativeShape65 {
  "minor"?: true;
  "history": string;
}

interface NativeShape66 {
  "randomizeWeather": 12345 | 22345;
}

interface BookmarkBody {
  "name": string;
  "desc": string;
  "date": string;
  "picture": string | number | boolean;
  "defaultCountry": string;
  "filters"?: readonly (string | number | boolean)[];
  "sortUnplayedFirst"?: false;
  "includeMajorsInMinorList"?: false;
  "applyFilterToMajors"?: true;
  "applyFilterToOtherCountry"?: true;
  "labelOrder"?: readonly (string | number | boolean)[];
  "scrollableCountryList"?: true;
  "default"?: boolean;
  "entries"?: { readonly [key: string]: NativeShape64 } | { readonly [key: string]: NativeShape65 };
  "effect": NativeShape66;
}

interface NativeShape68 {
  "limit"?: readonly (Trigger<ScopeByName["country"]>)[];
  "effects"?: Effect<ScopeByName["country"]>;
}

interface NativeShape69 {
  "id": string;
  "min": number;
  "max": number;
  "modifier"?: NativeShape12;
  "onActivate"?: NativeShape68;
  "onDeactivate"?: NativeShape68;
}

interface NativeShape70 {
  "id": string;
  "icon": string | "GFX_bop_ITA_democratic_side" | "GFX_bop_ITA_mussolini_side";
  "range": readonly (NativeShape69)[];
}

interface BalanceOfPowerBody {
  "initialValue"?: number;
  "leftSide": string;
  "rightSide": string;
  "decisionCategory"?: string;
  "range"?: readonly (NativeShape69)[];
  "side": readonly (NativeShape70)[];
}

interface NativeShape72 {
  "localizationKey": string;
  "entries"?: { readonly [key: string]: string | number | boolean } | { readonly [key: string]: CwtNode };
}

interface NativeShape73 {
  "localizationKey": string;
  "entries"?: { readonly [key: string]: string | number | boolean } | { readonly [key: string]: NativeShape72 };
}

interface NativeShape74 {
  "hasDlc"?: "Poland: United and Ready" | "Together for Victory" | "Axis Armor Pack" | "Death or Dishonor" | "Waking the Tiger" | "Man the Guns" | "La Resistance" | "Battle for the Bosporus" | "No Step Back" | "By Blood Alone" | "Arms Against Tyranny" | "Trial of Allegiance" | "Gotterdammerung" | "Graveyard of Empires" | "Expansion Pass 1: Supporter Pack" | "No Compromise, No Surrender" | "Peace For Our Time" | "Thunder at Our Gates";
}

interface NativeShape75 {
  "building": string;
  "level": number | string;
}

interface NativeShape76 {
  "buildingDependency": NativeShape75;
}

interface NativeShape77 {
  "stateMax"?: number;
  "provinceMax"?: number;
  "sharesSlots"?: boolean;
  "groupBy"?: "reactors" | "special_project_facility" | "infrastructure_keystone" | "rocket_launchers";
  "exclusiveWith"?: string;
}

interface NativeShape78 {
  "enableForControllers"?: readonly (string)[];
  "modifiers": NativeShape12;
}

interface NativeShape79 {
  "trigger": Trigger<ScopeByName["country"]>;
  "factor": number;
}

interface BuildingBody {
  "baseCost": number;
  "perControlledBuildingExtraCost"?: number;
  "baseCostConversion"?: number;
  "perLevelExtraCost"?: number;
  "missingTechLoc"?: NativeShape73;
  "value"?: number;
  "iconFrame": number;
  "showOnMap"?: number;
  "showOnMapMeshes"?: number;
  "alwaysShown"?: boolean;
  "drawnAtDistance"?: boolean;
  "hasDestroyedMesh"?: boolean;
  "dlcAllowed"?: NativeShape74;
  "alliedBuild"?: boolean;
  "centered"?: boolean;
  "supplyNode"?: boolean;
  "infrastructureConstructionEffect"?: boolean;
  "damageFactor"?: number;
  "onlyCostal"?: boolean;
  "disabledInDmz"?: boolean;
  "infrastructure"?: boolean;
  "airBase"?: boolean;
  "isPort"?: boolean;
  "antiAir"?: boolean;
  "refinery"?: true;
  "radar"?: boolean;
  "nuclearReactor"?: boolean;
  "navalSupplyHub"?: boolean;
  "navalHeadquarter"?: boolean;
  "militaryProduction"?: number;
  "generalProduction"?: number;
  "navalProduction"?: number;
  "landFort"?: number;
  "navalFort"?: number;
  "rocketProduction"?: number;
  "rocketLaunchCapacity"?: number;
  "airDefence"?: number;
  "gunEmplacement"?: true;
  "isBuildable"?: boolean;
  "affectsEnergy"?: boolean;
  "buildingPrerequisite"?: NativeShape76;
  "onlyDisplayIfExists"?: boolean;
  "needSupply"?: boolean;
  "needDetection"?: boolean;
  "detectingIntelType"?: "navy" | "army" | "civilian" | "airforce";
  "showModifier"?: true;
  "fuelSilo"?: true;
  "levelCap": NativeShape77;
  "countryModifiers"?: NativeShape78;
  "entries"?: { readonly [key: string]: number };
  "stateModifiers"?: NativeShape12;
  "stateDamageModifier"?: readonly (string)[];
  "provinceDamageModifiers"?: readonly (string)[];
  "hideIfMissingTech"?: boolean;
  "spawnPoint"?: string;
  "specialIcon"?: string;
  "tags"?: readonly (string)[];
  "specialization"?: readonly (string)[];
  "repairSpeedFactor"?: number | string;
  "constructionSpeedFactor"?: NativeShape79;
  "disableGrowAnimation"?: boolean;
  "modules"?: readonly (string | number | boolean)[];
}

interface SpawnPointBody {
  "type": "state" | "province";
  "max": number;
  "onlyCostal"?: boolean;
  "disableAutoNudging"?: boolean;
}

interface NativeShape82 {
  "large"?: string;
  "small"?: string;
}

interface NativeShape83 {
  "civilian"?: NativeShape82;
  "army"?: NativeShape82;
  "navy"?: NativeShape82;
  "operative"?: NativeShape82;
}

interface NativeShape84 {
  "ideology": string;
  "desc"?: string;
  "expire"?: string;
  "name"?: string;
  "traits"?: readonly (string)[];
  "researchBonus"?: { readonly [key: string]: number };
  "id"?: string;
  "legacyId"?: string;
}

interface NativeShape85 {
  "desc"?: string;
  "expire"?: string;
  "skill": number;
  "attackSkill": number;
  "defenseSkill": number;
  "planningSkill": number;
  "logisticsSkill": number;
  "id"?: string;
  "legacyId"?: string;
  "name"?: string;
  "traits"?: readonly (string)[];
  "visible"?: Trigger<ScopeByName["character"]>;
}

interface NativeShape86 {
  "desc"?: string;
  "expire"?: string;
  "skill": number;
  "attackSkill": number;
  "defenseSkill": number;
  "planningSkill": number;
  "logisticsSkill": number;
  "id"?: string;
  "legacyId"?: string;
  "traits"?: readonly (string)[];
  "visible"?: Trigger<ScopeByName["character"]>;
}

interface NativeShape87 {
  "desc"?: string;
  "expire"?: string;
  "skill": number;
  "attackSkill": number;
  "defenseSkill": number;
  "maneuveringSkill": number;
  "coordinationSkill": number;
  "id"?: string;
  "legacyId"?: string;
  "name"?: string;
  "traits"?: readonly (string)[];
  "visible"?: Trigger<ScopeByName["character"]>;
}

interface NativeShape88 {
  "add"?: number | string;
  "factor"?: number | string;
  "trigger"?: Trigger<ScopeByName["character"]>;
}

interface NativeShape89 {
  "base"?: number | string;
  "factor"?: number | string;
  "modifier"?: NativeShape88;
}

interface NativeShape90 {
  "slot": string;
  "name"?: string;
  "desc"?: string;
  "ideaToken"?: string;
  "allowed"?: Trigger<ScopeByName["character"]>;
  "visible"?: Trigger<ScopeByName["character"]>;
  "available"?: Trigger<ScopeByName["character"]>;
  "traits": readonly (string)[];
  "researchBonus"?: { readonly [key: string]: number };
  "ledger"?: "army" | "navy" | "air" | "military" | "invalid" | "civilian" | "hidden" | "all";
  "cost"?: number;
  "removalCost"?: number;
  "aiWillDo"?: NativeShape89;
  "onAdd"?: readonly (Effect<ScopeByName["character"]>)[];
  "onRemove"?: readonly (Effect<ScopeByName["character"]>)[];
  "doEffect"?: Trigger<ScopeByName["character"]>;
  "modifier"?: NativeShape12;
  "canBeFired"?: boolean;
}

interface NativeShape91 {
  "desc"?: string;
  "visible"?: Trigger<ScopeByName["character"]>;
  "traits"?: readonly (string)[];
  "skills": { readonly [key: string]: number };
}

interface NativeShape92 {
  "slot": string;
  "ideaToken"?: string;
  "name"?: string;
  "desc"?: string;
  "allowed"?: Trigger<ScopeByName["character"]>;
  "visible"?: Trigger<ScopeByName["character"]>;
  "available"?: Trigger<ScopeByName["character"]>;
  "traits": readonly (string)[];
  "researchBonus"?: { readonly [key: string]: number };
  "ledger"?: "army" | "navy" | "air" | "military" | "invalid" | "civilian" | "hidden" | "all";
  "cost"?: number;
  "removalCost"?: number;
  "aiWillDo"?: NativeShape89;
  "alwaysShowOnActionsTooltip"?: boolean;
  "onAdd"?: readonly (Effect<ScopeByName["character"]>)[];
  "onRemove"?: readonly (Effect<ScopeByName["character"]>)[];
  "doEffect"?: Trigger<ScopeByName["character"]>;
  "modifier"?: NativeShape12;
  "canBeFired"?: boolean;
}

interface NativeShape93 {
  "allowed": Trigger<ScopeByName["character"]>;
  "canBeCaptured"?: false;
  "portraits": NativeShape83;
  "name"?: string;
  "gender"?: "female" | "male" | "undefined";
  "allowedCivilWar"?: Trigger<ScopeByName["character"]>;
  "countryLeader"?: readonly (NativeShape84)[];
  "corpsCommander"?: NativeShape85;
  "fieldMarshal"?: NativeShape85;
  "navyLeader"?: NativeShape87;
  "advisor"?: readonly (NativeShape92)[];
  "scientist"?: readonly (NativeShape91)[];
}

interface CharacterBody {
  "canBeCaptured"?: false;
  "portraits"?: NativeShape83;
  "allowedCivilWar"?: Trigger<ScopeByName["character"]>;
  "name"?: string;
  "gender"?: "female" | "male" | "undefined";
  "countryLeader"?: readonly (NativeShape84)[];
  "corpsCommander"?: NativeShape85;
  "fieldMarshal"?: NativeShape86;
  "navyLeader"?: NativeShape87;
  "advisor"?: readonly (NativeShape90)[];
  "scientist"?: readonly (NativeShape91)[];
  "instance"?: readonly (NativeShape93)[];
}

interface NativeShape95 {
  "values"?: readonly (string)[];
  "limit"?: Trigger<ScopeByName["country"]>;
}

interface CollectionBody {
  "input": "game:empty" | "game:scope" | "game:all_countries" | "game:all_possible_countries" | "game:all_states" | "country:faction_members" | "collection:<collection>" | string;
  "name"?: readonly (string)[];
  "operators"?: NativeShape95;
}

interface NativeShape97 {
  "isAttacker": boolean;
  "phase": string | false;
  "trigger"?: Trigger<ScopeByName["combat"]>;
}

interface NativeShape98 {
  "add"?: number | string;
  "factor"?: number | string;
  "trigger"?: Trigger<ScopeByName["combat"]>;
}

interface NativeShape99 {
  "base"?: number;
  "factor"?: number;
  "modifier"?: NativeShape98;
}

interface CombatTacticBody {
  "onlyShowFor"?: string;
  "isAttacker": boolean;
  "trigger": NativeShape97;
  "active"?: boolean;
  "base": NativeShape99;
  "picture": string | number | boolean;
  "counteredBy"?: string;
  "phase"?: string | false;
  "displayPhase"?: string;
  "attacker"?: number;
  "defender"?: number;
  "attackerMovementSpeed"?: number;
  "defenderOrgDamageModifier"?: number;
  "attackerOrgDamageModifier"?: number;
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
}

interface AiAreaBody {
  "continents"?: readonly (string)[];
  "strategicRegions"?: readonly (string)[];
}

interface NativeShape102 {
  "defensive"?: number;
  "offensive"?: number;
  "carrier"?: number;
  "battleship"?: number;
  "cruiser"?: number;
  "entries"?: { readonly [key: string]: number };
}

interface AiFocusBody {
  "research"?: NativeShape102;
  "aiNationalFocuses"?: readonly (string)[];
}

interface NativeShape104 {
  "add"?: number | string;
  "factor"?: number | string;
  "trigger"?: Trigger<ScopeByName["state"]>;
}

interface NativeShape105 {
  "base"?: number;
  "factor"?: number;
  "modifier"?: NativeShape104;
}

interface AiPeaceBody {
  "enable": Trigger<ScopeByName["country"]>;
  "annexRandomness": number;
  "liberateRandomness": number;
  "puppetRandomness": number;
  "takeStatesRandomness": number;
  "forceGovernmentRandomness": number;
  "buildTempVars"?: Trigger<ScopeByName["country"]>;
  "annex": NativeShape58;
  "liberate": NativeShape58;
  "puppet": NativeShape58;
  "puppetAll": NativeShape58;
  "puppetState": NativeShape105;
  "takeStates": NativeShape58;
  "forceGovernment": NativeShape58;
}

interface NativeShape107 {
  "support"?: { readonly [key: string]: number };
  "regiments": { readonly [key: string]: number };
  "regimentalSupport"?: { readonly [key: string]: number };
}

interface NativeShape108 {
  "reinforcePrio"?: number;
  "customIcon"?: number;
  "divisionNamesGroup"?: string;
  "upgradePrio": NativeShape58;
  "enable"?: Trigger<ScopeByName["country"]>;
  "canUpgradeInField"?: Trigger<ScopeByName["country"]>;
  "targetTemplate": NativeShape107;
  "replaceAtMatch"?: number;
  "replaceWith"?: string;
  "targetMinMatch"?: number;
}

interface AiTemplateBody {
  "blockedFor"?: readonly (string)[];
  "availableFor"?: readonly (string)[];
  "role": string;
  "frontRoleOverride"?: "defence" | "offence";
  "upgradePrio": NativeShape58;
  "entries"?: { readonly [key: string]: NativeShape108 };
}

interface NativeShape110 {
  "module"?: readonly (string | "empty")[];
  "anyOf"?: readonly (readonly (string)[])[];
  "upgrade"?: "current";
}

interface NativeShape111 {
  "base"?: number;
  "factor"?: number;
  "modifier"?: readonly (NativeShape61)[];
}

interface NativeShape112 {
  "matchValue"?: number;
  "type": string | "small_plane_airframe_0" | "small_plane_airframe_1" | "small_plane_airframe_2" | "small_plane_airframe_3" | "small_plane_airframe_4" | "cv_small_plane_airframe_0" | "cv_small_plane_airframe_1" | "cv_small_plane_airframe_2" | "cv_small_plane_airframe_3" | "cv_small_plane_airframe_4" | "small_plane_cas_airframe_0" | "small_plane_cas_airframe_1" | "small_plane_cas_airframe_2" | "small_plane_cas_airframe_3" | "small_plane_cas_airframe_4" | "cv_small_plane_cas_airframe_0" | "cv_small_plane_cas_airframe_1" | "cv_small_plane_cas_airframe_2" | "cv_small_plane_cas_airframe_3" | "cv_small_plane_cas_airframe_4" | "small_plane_naval_bomber_airframe_0" | "small_plane_naval_bomber_airframe_1" | "small_plane_naval_bomber_airframe_2" | "small_plane_naval_bomber_airframe_3" | "small_plane_naval_bomber_airframe_4" | "cv_small_plane_naval_bomber_airframe_0" | "cv_small_plane_naval_bomber_airframe_1" | "cv_small_plane_naval_bomber_airframe_2" | "cv_small_plane_naval_bomber_airframe_3" | "cv_small_plane_naval_bomber_airframe_4" | "small_plane_suicide_airframe" | "small_plane_suicide_airframe_0" | "small_plane_suicide_airframe_1" | "small_plane_suicide_airframe_2" | "small_plane_suicide_airframe_3" | "small_plane_suicide_airframe_4" | "small_plane_strike_airframe" | "small_plane_strike_airframe_0" | "small_plane_strike_airframe_1" | "small_plane_strike_airframe_2" | "small_plane_strike_airframe_3" | "small_plane_strike_airframe_4" | "cv_small_plane_strike_airframe" | "cv_small_plane_strike_airframe_0" | "cv_small_plane_strike_airframe_1" | "cv_small_plane_strike_airframe_2" | "cv_small_plane_strike_airframe_3" | "cv_small_plane_strike_airframe_4" | "cv_small_plane_suicide_airframe" | "cv_small_plane_suicide_airframe_0" | "cv_small_plane_suicide_airframe_1" | "cv_small_plane_suicide_airframe_2" | "cv_small_plane_suicide_airframe_3" | "cv_small_plane_suicide_airframe_4" | "medium_plane_airframe_0" | "medium_plane_airframe_1" | "medium_plane_airframe_2" | "medium_plane_airframe_3" | "medium_plane_airframe_4" | "medium_plane_fighter_airframe_0" | "medium_plane_fighter_airframe_1" | "medium_plane_fighter_airframe_2" | "medium_plane_fighter_airframe_3" | "medium_plane_fighter_airframe_4" | "medium_plane_cas_airframe" | "medium_plane_cas_airframe_0" | "medium_plane_cas_airframe_1" | "medium_plane_cas_airframe_2" | "medium_plane_cas_airframe_3" | "medium_plane_cas_airframe_4" | "cv_medium_plane_cas_airframe" | "cv_medium_plane_cas_airframe_0" | "cv_medium_plane_cas_airframe_1" | "cv_medium_plane_cas_airframe_2" | "cv_medium_plane_cas_airframe_3" | "cv_medium_plane_cas_airframe_4" | "medium_plane_suicide_airframe" | "medium_plane_suicide_airframe_0" | "medium_plane_suicide_airframe_1" | "medium_plane_suicide_airframe_2" | "medium_plane_suicide_airframe_3" | "medium_plane_suicide_airframe_4" | "medium_plane_maritime_patrol_airframe" | "medium_plane_maritime_patrol_airframe_0" | "medium_plane_maritime_patrol_airframe_1" | "medium_plane_maritime_patrol_airframe_2" | "medium_plane_maritime_patrol_airframe_3" | "medium_plane_maritime_patrol_airframe_4" | "medium_plane_air_transport_airframe" | "medium_plane_air_transport_airframe_0" | "medium_plane_air_transport_airframe_1" | "medium_plane_air_transport_airframe_2" | "medium_plane_air_transport_airframe_3" | "medium_plane_air_transport_airframe_4" | "cv_medium_plane_scout_airframe" | "cv_medium_plane_scout_airframe_0" | "cv_medium_plane_scout_airframe_1" | "cv_medium_plane_scout_airframe_2" | "cv_medium_plane_scout_airframe_3" | "cv_medium_plane_scout_airframe_4" | "cv_medium_plane_maritime_patrol_airframe" | "cv_medium_plane_maritime_patrol_airframe_0" | "cv_medium_plane_maritime_patrol_airframe_1" | "cv_medium_plane_maritime_patrol_airframe_2" | "cv_medium_plane_maritime_patrol_airframe_3" | "cv_medium_plane_maritime_patrol_airframe_4" | "cv_medium_plane_air_transport_airframe" | "cv_medium_plane_air_transport_airframe_0" | "cv_medium_plane_air_transport_airframe_1" | "cv_medium_plane_air_transport_airframe_2" | "cv_medium_plane_air_transport_airframe_3" | "cv_medium_plane_air_transport_airframe_4" | "cv_medium_plane_fighter_airframe" | "cv_medium_plane_fighter_airframe_0" | "cv_medium_plane_fighter_airframe_1" | "cv_medium_plane_fighter_airframe_2" | "cv_medium_plane_fighter_airframe_3" | "cv_medium_plane_fighter_airframe_4" | "cv_medium_plane_airframe" | "cv_medium_plane_airframe_0" | "cv_medium_plane_airframe_1" | "cv_medium_plane_airframe_2" | "cv_medium_plane_airframe_3" | "cv_medium_plane_airframe_4" | "large_plane_airframe_0" | "large_plane_airframe_1" | "large_plane_airframe_2" | "large_plane_airframe_3" | "large_plane_airframe_4" | "large_plane_air_transport_airframe" | "large_plane_air_transport_airframe_0" | "large_plane_air_transport_airframe_1" | "large_plane_air_transport_airframe_2" | "large_plane_air_transport_airframe_3" | "large_plane_air_transport_airframe_4" | "large_plane_awacs_airframe" | "large_plane_awacs_airframe_0" | "large_plane_awacs_airframe_1" | "large_plane_awacs_airframe_2" | "large_plane_awacs_airframe_3" | "large_plane_awacs_airframe_4" | "large_plane_maritime_patrol_airframe" | "large_plane_maritime_patrol_airframe_0" | "large_plane_maritime_patrol_airframe_1" | "large_plane_maritime_patrol_airframe_2" | "large_plane_maritime_patrol_airframe_3" | "large_plane_maritime_patrol_airframe_4" | "large_plane_cas_airframe" | "large_plane_cas_airframe_0" | "large_plane_cas_airframe_1" | "large_plane_cas_airframe_2" | "large_plane_cas_airframe_3" | "large_plane_cas_airframe_4";
  "modules"?: { readonly [key: string]: string | "empty" | NativeShape110 };
  "upgrades"?: { readonly [key: string]: number | NativeShape111 };
}

interface NativeShape113 {
  "module"?: readonly (string)[];
}

interface NativeShape114 {
  "priority": NativeShape58;
  "name"?: string | number | boolean;
  "roleIconIndex"?: number;
  "designTeam"?: string;
  "enable"?: Trigger<ScopeByName["country"]>;
  "visible"?: boolean;
  "history"?: boolean;
  "targetVariant"?: NativeShape112;
  "requirements"?: NativeShape113;
  "allowedModules"?: readonly (string)[];
}

interface AiEquipmentDesignGroupBody {
  "category": "naval" | "land" | "air";
  "blockedFor"?: readonly (string)[];
  "availableFor"?: readonly (string)[];
  "roles": readonly (string)[];
  "priority"?: NativeShape58;
  "entries": { readonly [key: string]: NativeShape114 };
}

interface NativeShape116 {
  "base"?: number | string;
  "factor"?: number | string;
  "modifier"?: NativeShape57;
}

interface AiFactionTheaterBody {
  "name": string;
  "aiWillDo": NativeShape116;
  "cancel"?: Trigger<ScopeByName["country"]>;
  "regions": readonly (string)[];
  "preferredCountries"?: readonly (string)[];
  "canSkipFirstRegion"?: boolean;
}

interface CountryTagAliasBody {
  "variable"?: number | string;
  "globalEventTarget"?: string;
  "eventTarget"?: string;
  "originalTag"?: string;
  "targets"?: readonly (string | number)[];
  "targetArray"?: string;
  "countryScore"?: NativeShape116;
  "fallback"?: string;
  "trigger"?: Trigger<ScopeByName["country"]>;
}

interface DifficultySettingBody {
  "key": string;
  "modifier": string;
  "countries": readonly (string)[];
  "multiplier": number;
}

interface DoctrineFolderBody {
  "allowed"?: Trigger<ScopeByName["country"]>;
  "name"?: string;
  "ledger"?: "army" | "navy" | "air" | "all" | "hidden";
  "ledgerGfx"?: string;
  "tabGfx"?: string;
  "colorFrame"?: number;
  "sound"?: string;
}

interface NativeShape123 {
  "entries"?: { readonly [key: string]: number | string };
  "instant"?: boolean;
}

interface NativeShape124 {
  "category": readonly (string)[];
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "add"?: boolean;
  "displayAsPercentage"?: boolean;
}

interface NativeShape125 {
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
  "battalionMult"?: readonly (NativeShape124)[];
}

interface NativeShape126 {
  "effect"?: Effect<ScopeByName["country"]>;
  "equipmentBonus"?: { readonly [key: string]: NativeShape123 };
  "entries"?: { readonly [key: string]: NativeShape125 } | { readonly [key: string]: number } | { readonly [key: string]: number };
  "enableTactic"?: readonly (string)[];
  "modifier"?: NativeShape12;
  "hiddenModifier"?: NativeShape1;
  "customModifierTooltip"?: string;
}

interface GrandDoctrineBody {
  "folder": string;
  "name": string;
  "description": string;
  "icon": string;
  "xpCost": number;
  "xpType": "army" | "navy" | "air";
  "available"?: Trigger<ScopeByName["country"]>;
  "visible"?: Trigger<ScopeByName["country"]>;
  "aiWillDo"?: NativeShape58;
  "tracks"?: readonly (string)[];
  "maxTrackRows"?: number;
  "maxTrackColumns"?: number;
  "effect"?: Effect<ScopeByName["country"]>;
  "equipmentBonus"?: { readonly [key: string]: NativeShape123 };
  "entries"?: { readonly [key: string]: NativeShape125 } | { readonly [key: string]: number } | { readonly [key: string]: number };
  "enableTactic"?: readonly (string)[];
  "modifier"?: NativeShape12;
  "hiddenModifier"?: NativeShape1;
  "customModifierTooltip"?: string;
  "milestones": readonly (NativeShape126)[];
}

interface NativeShape128 {
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 } | { readonly [key: string]: number | string };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
  "battalionMult"?: readonly (NativeShape124)[];
}

interface NativeShape129 {
  "effect"?: Effect<ScopeByName["country"]>;
  "equipmentBonus"?: readonly ({ readonly [key: string]: NativeShape123 })[];
  "entries"?: { readonly [key: string]: NativeShape128 } | { readonly [key: string]: number } | { readonly [key: string]: number };
  "enableTactic"?: readonly (string)[];
  "modifier"?: NativeShape12;
  "hiddenModifier"?: NativeShape1;
  "customModifierTooltip"?: string;
}

interface NativeShape130 {
  "multiplier"?: number;
  "categories"?: readonly (string)[];
  "subUnits"?: readonly (string)[];
  "equipment"?: readonly (string)[];
}

interface SubdoctrineBody {
  "xpType"?: "land" | "air" | "navy" | "army" | "navy" | "air";
  "track": string | readonly (string)[];
  "name": string;
  "description": string;
  "icon": string;
  "xpCost": number;
  "available"?: Trigger<ScopeByName["country"]>;
  "visible"?: Trigger<ScopeByName["country"]>;
  "xor"?: readonly (string)[];
  "aiWillDo"?: NativeShape58;
  "effect"?: Effect<ScopeByName["country"]>;
  "equipmentBonus"?: readonly ({ readonly [key: string]: NativeShape123 })[];
  "entries"?: { readonly [key: string]: NativeShape125 } | { readonly [key: string]: number } | { readonly [key: string]: number };
  "enableTactic"?: readonly (string)[];
  "modifier"?: NativeShape12;
  "hiddenModifier"?: NativeShape1;
  "customModifierTooltip"?: string;
  "rewards": { readonly [key: string]: NativeShape129 };
  "mastery"?: readonly (NativeShape130)[];
}

interface DoctrineTrackBody {
  "name": string;
  "background": string;
  "icon": string;
  "iconFrame": string;
  "backgroundOffset"?: number;
  "active"?: Trigger<ScopeByName["country"]>;
  "mastery": NativeShape130;
}

interface DynamicModifierBody {
  "icon"?: string;
  "attackerModifier"?: true;
  "enable"?: Trigger<ScopeByName["country"]>;
  "removeTrigger"?: Trigger<ScopeByName["country"]>;
  "entries"?: { readonly [key: string]: number | string };
  "hiddenModifier"?: number | string;
  "customModifierTooltip"?: readonly (number | string)[];
}

interface EquipmentGroupBody {
  "description"?: string | number | boolean;
  "equipmentType": readonly (string | "modern_tank_amphibious_chassis" | "super_heavy_tank_flame_chassis" | "modern_tank_flame_chassis")[];
}

interface NativeShape135 {
  "modifier": string;
  "value": number;
  "type": string | number | boolean;
}

interface NativeShape136 {
  "set": number;
}

interface NativeShape137 {
  "findAndReplace"?: readonly (readonly (string | number | boolean)[])[];
}

interface NativeShape138 {
  "airSuperiority"?: NativeShape136;
  "cas"?: NativeShape136;
  "interception"?: NativeShape136;
  "strategicBomber"?: NativeShape136;
  "navalBomber"?: NativeShape136;
  "dropNuke"?: NativeShape136;
  "paradrop"?: NativeShape136;
  "navalKamikaze"?: NativeShape136;
  "portStrike"?: NativeShape136;
  "attackLogistics"?: NativeShape136;
  "airSupply"?: NativeShape136;
  "training"?: NativeShape136;
  "navalMinesPlanting"?: NativeShape136;
  "navalMinesSweeping"?: NativeShape136;
  "recon"?: NativeShape136;
  "navalPatrol"?: NativeShape136;
  "barrageMission"?: NativeShape136;
  "samMission"?: NativeShape136;
  "variantName"?: readonly (NativeShape137)[];
  "entries"?: { readonly [key: string]: NativeShape136 };
}

interface NativeShape139 {
  "required": boolean;
  "allowedModuleCategories": readonly (string)[];
  "gfx"?: string | number | boolean;
}

interface NativeShape140 {
  "category"?: string;
  "module"?: string;
  "count": number;
}

interface NativeShape141 {
  "upgrade": string;
  "override": string;
}

interface EquipmentBody {
  "year"?: number;
  "isArchetype"?: boolean;
  "isBuildable"?: boolean;
  "isConvertable"?: boolean;
  "oneUseOnly"?: boolean;
  "active"?: boolean;
  "canLicense"?: boolean;
  "sprite"?: string | number | boolean;
  "alias"?: string;
  "interfaceCategory"?: "interface_category_land" | "interface_category_armor" | "interface_category_capital_ships" | "interface_category_screen_ships" | "interface_category_other_ships" | "interface_category_air" | "missile";
  "maxDockyardFactories"?: number;
  "maxMilitaryFactories"?: number | number;
  "priority"?: number | NativeShape58;
  "canBeProduced"?: Trigger<ScopeByName["country"]>;
  "canBeLendLeased"?: Trigger<ScopeByName["country"]>;
  "supplyTruck"?: boolean;
  "modifierStat"?: NativeShape135;
  "picture"?: string | number | boolean;
  "carrierCapable"?: true;
  "allowMissionType"?: "air_superiority" | "cas" | "interception" | "strategic_bomber" | "naval_bomber" | "drop_nuke" | "paradrop" | "naval_kamikaze" | "port_strike" | "attack_logistics" | "air_supply" | "training" | "naval_mines_planting" | "naval_mines_sweeping" | "recon" | "naval_patrol" | "barrage_mission" | "sam_mission" | readonly ("air_superiority" | "cas" | "interception" | "strategic_bomber" | "naval_bomber" | "drop_nuke" | "paradrop" | "naval_kamikaze" | "port_strike" | "attack_logistics" | "air_supply" | "training" | "naval_mines_planting" | "naval_mines_sweeping" | "recon" | "naval_patrol" | "barrage_mission" | "sam_mission")[];
  "forbidMissionType"?: readonly ("air_superiority" | "cas" | "interception" | "strategic_bomber" | "naval_bomber" | "drop_nuke" | "paradrop" | "naval_kamikaze" | "port_strike" | "attack_logistics" | "air_supply" | "training" | "naval_mines_planting" | "naval_mines_sweeping" | "recon" | "naval_patrol" | "barrage_mission" | "sam_mission")[];
  "forEach"?: NativeShape138;
  "groupBy"?: "archetype" | "type";
  "family"?: string;
  "onlyDuplicateArchetype"?: true;
  "variantName"?: { readonly [key: string]: string };
  "moduleSlots"?: "none" | { readonly [key: string]: NativeShape139 | string | "inherit" } | "inherit";
  "airMapIconFrame"?: number;
  "interfaceOverviewCategoryIndex"?: number;
  "allowedTypes"?: "air_transport" | "cas" | "fighter" | "interceptor" | "missile" | "naval_bomber" | "scout_plane" | "strategic_bomber" | "suicide" | "tactical_bomber" | "maritime_patrol_plane" | "heavy_fighter" | "ballistic_missile" | "emplacement_gun_ammo" | "nuclear_missile" | "sam_missile" | readonly ("air_transport" | "cas" | "fighter" | "interceptor" | "missile" | "naval_bomber" | "scout_plane" | "strategic_bomber" | "suicide" | "tactical_bomber" | "maritime_patrol_plane" | "heavy_fighter" | "ballistic_missile" | "emplacement_gun_ammo" | "nuclear_missile" | "sam_missile")[];
  "typeOverride"?: string;
  "substitute"?: string;
  "derivedVariantName"?: string;
  "aiType"?: "cv_fighter" | "cv_interceptor" | "cv_cas" | "cv_naval_bomber" | "cv_suicide" | "heavy_fighter";
  "abbreviation"?: string;
  "archetype"?: string;
  "parent"?: string;
  "visualLevel"?: number;
  "canConvertFrom"?: readonly (string)[];
  "isFrame"?: boolean;
  "moduleCountLimit"?: readonly (NativeShape140)[];
  "defaultModules"?: { readonly [key: string]: string | "empty" | "inherit" };
  "visualTechLevelAddition"?: number;
  "model"?: string | number | boolean;
  "railwayGunAttackRangeIndexInDefine"?: number;
  "railwayGunAnnexRatio"?: number;
  "railwayGunHoursBetweenRedistribution"?: number;
  "type"?: string | readonly (string)[];
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
  "offensiveWeapons"?: boolean;
  "resources"?: { readonly [key: string]: number };
  "upgrades"?: readonly (readonly (string)[])[];
  "upgradeWindowOverride"?: readonly (NativeShape141)[];
}

interface NativeShape143 {
  "costByLevel"?: number;
  "costByLevelForLicensedEquipment"?: number;
}

interface NativeShape144 {
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
}

interface EquipmentUpgradeBody {
  "abbreviation"?: string;
  "maxLevel": number;
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "cost"?: "naval" | "air" | "land";
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
  "levelRequirement"?: { readonly [key: string]: Trigger<ScopeByName["country"]> };
  "linearCost"?: NativeShape143;
  "levelRequirements"?: { readonly [key: string]: Trigger<ScopeByName["country"]> };
  "resourceCostThresholds"?: { readonly [key: string]: { readonly [key: string]: number } };
  "addStats"?: NativeShape144;
  "multiplyStats"?: NativeShape144;
}

interface NativeShape146 {
  "moduleCategory"?: string;
  "module"?: string;
  "convertCostIc": number;
  "convertCostResources"?: { readonly [key: string]: number };
}

interface NativeShape147 {
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
}

interface NativeShape148 {
  "limit": readonly ("air_superiority" | "cas" | "interception" | "strategic_bomber" | "naval_bomber" | "drop_nuke" | "paradrop" | "naval_kamikaze" | "port_strike" | "attack_logistics" | "air_supply" | "training" | "naval_mines_planting" | "naval_mines_sweeping" | "recon" | "naval_patrol" | "barrage_mission" | "sam_mission")[];
  "addStats"?: NativeShape144;
  "addAverageStats"?: NativeShape147;
  "multiplyStats"?: NativeShape147;
}

interface EquipmentModuleBody {
  "abbreviation"?: string;
  "category": string;
  "guiCategory"?: string | number | boolean;
  "parent"?: string;
  "gfx"?: string | number | boolean;
  "sfx"?: string | number | boolean;
  "allowEquipmentType"?: string | readonly (string)[];
  "forbidEquipmentTypeExactMatch"?: string;
  "forbidEquipmentType"?: string | readonly (string)[];
  "forbidEquipmentTypeExactMatchForCategory"?: { readonly [key: string]: string | readonly (string)[] };
  "addEquipmentType"?: string | readonly (string)[];
  "addStats"?: { readonly [key: string]: number };
  "megaCarrier"?: boolean;
  "manpower"?: number;
  "buildCostResources"?: { readonly [key: string]: number };
  "addAverageStats"?: { readonly [key: string]: number };
  "multiplyStats"?: readonly ({ readonly [key: string]: number })[];
  "forbidModuleCategories"?: readonly (string)[];
  "canConvertFrom"?: readonly (NativeShape146)[];
  "criticalParts"?: readonly (string)[];
  "dismantleCostIc"?: number;
  "dismantleCostResources"?: { readonly [key: string]: number };
  "allowedModuleCategories"?: { readonly [key: string]: readonly (string)[] };
  "allowMissionType"?: "air_superiority" | "cas" | "interception" | "strategic_bomber" | "naval_bomber" | "drop_nuke" | "paradrop" | "naval_kamikaze" | "port_strike" | "attack_logistics" | "air_supply" | "training" | "naval_mines_planting" | "naval_mines_sweeping" | "recon" | "naval_patrol" | "barrage_mission" | "sam_mission" | readonly ("air_superiority" | "cas" | "interception" | "strategic_bomber" | "naval_bomber" | "drop_nuke" | "paradrop" | "naval_kamikaze" | "port_strike" | "attack_logistics" | "air_supply" | "training" | "naval_mines_planting" | "naval_mines_sweeping" | "recon" | "naval_patrol" | "barrage_mission" | "sam_mission")[];
  "missionTypeStats"?: readonly (NativeShape148)[];
  "xpCost"?: number;
}

interface NativeShape150 {
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
}

interface CriticalPartBody {
  "icon": string;
  "frame": number;
  "statPenalties"?: NativeShape150;
  "modifier"?: NativeShape150;
  "strDamage"?: number;
  "orgDamage"?: number;
  "strDamageMultiplier"?: number;
  "orgDamageMultiplier"?: number;
  "chance"?: number;
  "baseDamageInstance"?: number;
  "damageInstancePerAddedModule"?: number;
  "maxDamageInstance"?: number;
}

interface NativeShape152 {
  "min"?: number;
  "max"?: number;
  "modifier"?: NativeShape12;
}

interface NativeShape153 {
  "progressSections": { readonly [key: string]: NativeShape152 };
}

interface NativeShape154 {
  "input": "game:empty" | "game:scope" | "game:all_countries" | "game:all_possible_countries" | "game:all_states" | "country:faction_members" | "collection:<collection>" | string;
  "name"?: string;
  "operators"?: NativeShape95;
}

interface NativeShape155 {
  "min"?: number;
  "max"?: number;
}

interface NativeShape156 {
  "scale"?: NativeShape12;
  "reversed"?: NativeShape12;
  "totalAmountCollection"?: "collection:<collection>" | "game:empty" | "game:scope" | "game:all_countries" | "game:all_possible_countries" | "game:all_states" | "country:faction_members" | NativeShape154;
  "completedAmountCollection"?: "collection:<collection>" | "game:empty" | "game:scope" | "game:all_countries" | "game:all_possible_countries" | "game:all_states" | "country:faction_members" | NativeShape154;
  "completedAmountCustomTooltip"?: string;
  "totalAmountCustomTooltip"?: string;
  "totalAmount"?: number | string;
  "completedAmount"?: number | string;
  "range"?: NativeShape155;
  "progressSections"?: { readonly [key: string]: NativeShape152 };
}

interface FactionGoalBody {
  "name": string;
  "description": string;
  "isManifest"?: false | true;
  "category"?: "short_term" | "medium_term" | "long_term";
  "allowed"?: Trigger<ScopeByName["country"]>;
  "visible"?: Trigger<ScopeByName["country"]>;
  "available"?: Trigger<ScopeByName["country"]>;
  "completed"?: Trigger<ScopeByName["country"]>;
  "group"?: string | number | boolean;
  "autoComplete"?: boolean;
  "lockedGoal"?: false | true;
  "aiWillDo"?: NativeShape116;
  "completeEffect"?: Effect<ScopeByName["country"]>;
  "cancel"?: Trigger<ScopeByName["country"]>;
  "cancelEffect"?: Effect<ScopeByName["country"]>;
  "selectEffect"?: Effect<ScopeByName["country"]>;
  "removeEffect"?: Effect<ScopeByName["country"]>;
  "progress"?: NativeShape153;
  "ratioProgress"?: NativeShape156;
}

interface FactionMemberUpgradeBody {
  "name"?: string;
  "desc"?: string;
  "icon"?: string | number | boolean;
  "upgradeCost"?: number;
  "bonus": number;
}

interface FactionRuleBody {
  "type": string | number | boolean;
  "visible"?: Trigger<ScopeByName["country"]>;
  "available"?: Trigger<ScopeByName["country"]>;
  "canRemove"?: Trigger<ScopeByName["country"]>;
  "trigger"?: Trigger<ScopeByName["country"]>;
  "dismissMemberTrigger"?: Trigger<ScopeByName["country"]>;
  "governmentInExileAllowedTrigger"?: Trigger<ScopeByName["country"]>;
  "modifier"?: { readonly [key: string]: string | number | boolean };
  "effect"?: Effect<ScopeByName["country"]>;
  "peaceActionModifiers"?: readonly (string)[];
  "aiWillDo"?: NativeShape116;
}

interface FactionRuleGroupBody {
  "defaultRule"?: string;
  "rules": readonly (string)[];
}

interface FactionTemplateBody {
  "name"?: string;
  "icon"?: string | number | boolean;
  "color"?: readonly (number)[];
  "visible"?: Trigger<ScopeByName["country"]>;
  "available"?: Trigger<ScopeByName["country"]>;
  "canLeaderJoinOtherFactions"?: boolean;
  "manifest": string;
  "goals"?: readonly (string)[];
  "defaultRules"?: readonly (string)[];
}

interface FactionUpgradeBody {
  "name"?: string;
  "desc"?: string;
  "icon"?: string | number | boolean;
  "upgradeCost"?: number;
  "bonus": number;
  "aiWillDo"?: NativeShape116;
}

interface NativeShape163 {
  "name": string;
  "text": string;
  "desc": string;
  "allowAchievements"?: boolean;
  "requiredDlc"?: "Poland: United and Ready" | "Together for Victory" | "Axis Armor Pack" | "Death or Dishonor" | "Waking the Tiger" | "Man the Guns" | "La Resistance" | "Battle for the Bosporus" | "No Step Back" | "By Blood Alone" | "Arms Against Tyranny" | "Trial of Allegiance" | "Gotterdammerung" | "Graveyard of Empires" | "Expansion Pass 1: Supporter Pack" | "No Compromise, No Surrender" | "Peace For Our Time" | "Thunder at Our Gates";
  "excludeDlc"?: "Poland: United and Ready" | "Together for Victory" | "Axis Armor Pack" | "Death or Dishonor" | "Waking the Tiger" | "Man the Guns" | "La Resistance" | "Battle for the Bosporus" | "No Step Back" | "By Blood Alone" | "Arms Against Tyranny" | "Trial of Allegiance" | "Gotterdammerung" | "Graveyard of Empires" | "Expansion Pass 1: Supporter Pack" | "No Compromise, No Surrender" | "Peace For Our Time" | "Thunder at Our Gates";
}

interface GameRuleBody {
  "name": string;
  "requiredDlc"?: "Poland: United and Ready" | "Together for Victory" | "Axis Armor Pack" | "Death or Dishonor" | "Waking the Tiger" | "Man the Guns" | "La Resistance" | "Battle for the Bosporus" | "No Step Back" | "By Blood Alone" | "Arms Against Tyranny" | "Trial of Allegiance" | "Gotterdammerung" | "Graveyard of Empires" | "Expansion Pass 1: Supporter Pack" | "No Compromise, No Surrender" | "Peace For Our Time" | "Thunder at Our Gates";
  "desc"?: string;
  "group": string;
  "icon"?: string;
  "option"?: readonly (NativeShape163)[];
  "default"?: NativeShape163;
}

interface IdeaCategoryBody {
  "hidden"?: boolean;
  "type"?: "national_spirit" | "army_spirit" | "navy_spirit" | "air_spirit";
  "cost"?: number;
  "removalCost"?: number;
  "ledger"?: "army" | "navy" | "air" | "military" | "invalid" | "civilian" | "hidden" | "all";
  "politicsTab"?: boolean;
  "slot"?: readonly (string)[];
  "characterSlot"?: readonly (string)[];
}

interface NativeShape166 {
  "canBeRandomlySelected"?: boolean;
  "color"?: readonly (number)[] | readonly (number)[];
}

interface NativeShape167 {
  "canForceGovernment"?: boolean;
  "canPuppet"?: boolean;
  "canBeCalledToWar"?: boolean;
  "canBeSpymaster"?: boolean;
  "canBoostOtherIdeologies"?: boolean;
  "canCreateCollaborationGovernment"?: boolean;
  "canCreateFactions"?: boolean;
  "canDeclareWarOnSameIdeology"?: boolean;
  "canDeclareWarWithoutWargoalWhenInWar"?: boolean;
  "canDeclineCallToWar"?: boolean;
  "canGenerateFemaleAces"?: boolean;
  "canGuaranteeOtherIdeologies"?: boolean;
  "canJoinFactions"?: boolean;
  "canJoinFactionsNotAllowedDiplomacy"?: boolean;
  "canJoinOppositeFactions"?: boolean;
  "canLowerTension"?: boolean;
  "canNotDeclareWar"?: boolean;
  "canOccupyNonWar"?: boolean;
  "canOnlyJustifyWarOnThreatCountry"?: boolean;
  "canSendVolunteers"?: boolean;
  "canUseKamikazePilots"?: boolean;
  "contributesOperatives"?: boolean;
  "unitsDeployedToOverlord"?: boolean;
  "canBoostOwnIdeology"?: boolean;
  "canGenerateFemaleUnitLeaders"?: boolean;
  "canGenerateFemaleCountryLeaders"?: boolean;
  "canAccessMarket"?: boolean;
  "canUseUnderwayReplenishment"?: boolean;
}

interface IdeologyBody {
  "types"?: { readonly [key: string]: NativeShape166 };
  "aiIdeologyWantedUnitsFactor"?: number;
  "aiGiveCoreStateControlThreshold"?: number;
  "dynamicFactionNames"?: readonly (string | number | boolean)[];
  "color"?: readonly (number)[];
  "rules"?: NativeShape167;
  "canHostGovernmentInExile"?: boolean;
  "warImpactOnWorldTension"?: number;
  "factionImpactOnWorldTension"?: number;
  "modifiers"?: NativeShape12;
  "factionModifiers"?: NativeShape12;
  "canBeBoosted"?: boolean;
  "canCollaborate"?: boolean;
  "aiFascist"?: boolean;
  "aiCommunist"?: boolean;
  "aiDemocratic"?: boolean;
  "aiNeutral"?: boolean;
}

interface IntelligenceAgencyBody {
  "picture": string;
  "names": readonly (string)[];
  "default": Trigger<ScopeByName["country"]>;
  "available": Trigger<ScopeByName["country"]>;
}

interface NativeShape170 {
  "modifier"?: NativeShape12;
  "completeEffect"?: Effect<ScopeByName["country"]>;
}

interface IntelligenceAgencyUpgradeBody {
  "picture": string;
  "frame"?: string | number | boolean;
  "sound"?: string;
  "aiWillDo"?: NativeShape58;
  "modifiersDuringProgress"?: NativeShape12;
  "available"?: Trigger<ScopeByName["country"]>;
  "visible"?: Trigger<ScopeByName["country"]>;
  "level": readonly (NativeShape170)[];
}

interface NativeShape172 {
  "type": "none";
}

interface NativeShape173 {
  "trigger"?: Trigger<ScopeByName["country"]>;
}

interface NativeShape174 {
  "type": "none" | "country" | "state" | "state_controller" | "game_map_mode_country" | "game_map_mode_states" | "game_map_mode_diplomacy" | "game_map_mode_players" | "game_map_mode_factions" | "game_map_mode_ideology";
  "color"?: NativeShape173;
  "targets"?: Trigger<ScopeByName["country"]>;
  "thickness"?: boolean;
}

interface ScriptedMapModeBody {
  "top"?: NativeShape172 | NativeShape174;
  "bottom"?: NativeShape172 | NativeShape174;
  "farText": "none" | "country" | "state" | "faction" | "player";
  "nearText"?: "none" | "country" | "state" | "faction" | "player";
  "updateDaily"?: boolean;
}

interface NativeShape176 {
  "text": string;
  "x": number;
}

interface NativeShape177 {
  "add"?: number | string;
  "factor"?: number | string;
  "trigger"?: Trigger<ScopeByName["military_industrial_organization"]>;
}

interface NativeShape178 {
  "base"?: number;
  "factor"?: number;
  "modifier"?: NativeShape177;
}

interface NativeShape179 {
  "entries": { readonly [key: string]: number | string };
  "instant"?: boolean;
}

interface NativeShape180 {
  "token"?: string;
  "name"?: string;
  "icon"?: string;
  "limitToEquipmentType"?: readonly (string)[];
  "equipmentBonus"?: NativeShape179;
  "productionBonus"?: { readonly [key: string]: number | string };
  "organizationModifier"?: NativeShape12;
}

interface NativeShape181 {
  "traits": readonly (string)[];
  "numParentsNeeded"?: number;
}

interface NativeShape182 {
  "x": number;
  "y": number;
}

interface NativeShape183 {
  "token": string;
  "name"?: string;
  "icon"?: string;
  "specialTraitBackground"?: true | false;
  "parent"?: NativeShape181;
  "anyParent"?: readonly (readonly (string)[])[];
  "allParents"?: readonly (readonly (string)[])[];
  "mutuallyExclusive"?: readonly (string)[];
  "visible"?: Trigger<ScopeByName["military_industrial_organization"]>;
  "available"?: Trigger<ScopeByName["military_industrial_organization"]>;
  "onComplete"?: Effect<ScopeByName["military_industrial_organization"]>;
  "limitToEquipmentType"?: readonly (string)[];
  "equipmentBonus"?: NativeShape179;
  "productionBonus"?: { readonly [key: string]: number | string };
  "organizationModifier"?: NativeShape12;
  "position"?: NativeShape182;
  "relativePositionId"?: string;
  "aiWillDo"?: NativeShape178;
}

interface NativeShape184 {
  "x": number;
  "y": number;
}

interface NativeShape185 {
  "token": string;
  "name"?: string;
  "icon"?: string;
  "specialTraitBackground"?: true | false;
  "parent"?: NativeShape181;
  "anyParent"?: readonly (readonly (string)[])[];
  "allParents"?: readonly (readonly (string)[])[];
  "mutuallyExclusive"?: readonly (string)[];
  "visible"?: Trigger<ScopeByName["military_industrial_organization"]>;
  "available"?: Trigger<ScopeByName["military_industrial_organization"]>;
  "onComplete"?: Effect<ScopeByName["military_industrial_organization"]>;
  "limitToEquipmentType"?: readonly (string)[];
  "equipmentBonus"?: NativeShape179;
  "productionBonus"?: { readonly [key: string]: number | string };
  "organizationModifier"?: NativeShape12;
  "position": NativeShape184;
  "relativePositionId"?: string;
  "aiWillDo"?: NativeShape178;
}

interface NativeShape186 {
  "token": string;
  "name"?: string;
  "icon"?: string;
  "specialTraitBackground"?: true | false;
  "parent"?: NativeShape181;
  "anyParent"?: readonly (readonly (string)[])[];
  "allParents"?: readonly (readonly (string)[])[];
  "mutuallyExclusive"?: readonly (string)[];
  "visible"?: Trigger<ScopeByName["military_industrial_organization"]>;
  "available"?: Trigger<ScopeByName["military_industrial_organization"]>;
  "onComplete"?: Effect<ScopeByName["military_industrial_organization"]>;
  "limitToEquipmentType"?: readonly (string)[];
  "equipmentBonus"?: NativeShape179;
  "productionBonus"?: { readonly [key: string]: number | string };
  "organizationModifier"?: NativeShape12;
  "position"?: NativeShape184;
  "relativePositionId"?: string;
  "aiWillDo"?: NativeShape178;
  "deleteIncludedValues"?: readonly ("name" | string | "allowed" | "visible" | "available" | "equipment_type" | "research_categories" | "on_design_team_assigned_to_tech" | "on_design_team_assigned_to_variant" | "on_industrial_manufacturer_assigned" | "on_tech_research_cancelled" | "on_tech_research_completed" | "on_industrial_manufacturer_unassigned" | "research_bonus" | "task_capacity" | "tree_header_text" | "ai_will_do")[];
}

interface MilitaryIndustrialOrganizationBody {
  "name"?: string;
  "icon"?: string;
  "background"?: string;
  "include"?: string;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "visible"?: Trigger<ScopeByName["military_industrial_organization"]>;
  "available"?: Trigger<ScopeByName["military_industrial_organization"]>;
  "equipmentType"?: readonly (string)[];
  "researchCategories"?: readonly (string)[];
  "onDesignTeamAssignedToTech"?: Effect<ScopeByName["military_industrial_organization"]>;
  "onDesignTeamAssignedToVariant"?: Effect<ScopeByName["military_industrial_organization"]>;
  "onIndustrialManufacturerAssigned"?: Effect<ScopeByName["military_industrial_organization"]>;
  "onTechResearchCancelled"?: Effect<ScopeByName["military_industrial_organization"]>;
  "onTechResearchCompleted"?: Effect<ScopeByName["military_industrial_organization"]>;
  "onIndustrialManufacturerUnassigned"?: Effect<ScopeByName["military_industrial_organization"]>;
  "researchBonus"?: number;
  "taskCapacity"?: number;
  "treeHeaderText"?: readonly (NativeShape176)[];
  "aiWillDo"?: NativeShape178;
  "initialTrait"?: NativeShape180;
  "trait"?: readonly (NativeShape183)[];
  "deleteIncludedValues"?: readonly ("name" | string | "allowed" | "visible" | "available" | "equipment_type" | "research_categories" | "on_design_team_assigned_to_tech" | "on_design_team_assigned_to_variant" | "on_industrial_manufacturer_assigned" | "on_tech_research_cancelled" | "on_tech_research_completed" | "on_industrial_manufacturer_unassigned" | "research_bonus" | "task_capacity" | "tree_header_text" | "ai_will_do")[];
  "addTrait"?: readonly (NativeShape185)[];
  "removeTrait"?: readonly (readonly (string)[])[];
  "overrideTrait"?: readonly (NativeShape186)[];
}

interface NativeShape188 {
  "entries"?: { readonly [key: string]: { readonly [key: string]: number | string } };
  "sameAsMio"?: readonly ({ readonly [key: string]: number | string })[];
}

interface MioPolicyBody {
  "name"?: string | number | boolean;
  "icon"?: string | number | boolean;
  "cost"?: number;
  "cooldown"?: number;
  "allowed"?: Trigger<ScopeByName["military_industrial_organization"]>;
  "visible"?: Trigger<ScopeByName["military_industrial_organization"]>;
  "available"?: Trigger<ScopeByName["military_industrial_organization"]>;
  "equipmentBonus"?: NativeShape188;
  "productionBonus"?: NativeShape188;
  "organizationModifier"?: NativeShape12;
  "onAdd"?: Effect<ScopeByName["military_industrial_organization"]>;
  "onRemove"?: Effect<ScopeByName["military_industrial_organization"]>;
  "aiWillDo"?: NativeShape178;
}

interface ModifierDefinitionBody {
  "colorType"?: "good" | "neutral" | "bad";
  "valueType"?: "number" | "percentage" | "percentage_in_hundred" | "yes_no";
  "precision"?: number;
  "postfix"?: "none" | "days" | "hours" | "daily";
  "category"?: readonly ("none" | "all" | "naval" | "air" | "unit_leader" | "country" | "state" | "army" | "peace" | "politics" | "ai" | "defensive" | "aggressive" | "war_production" | "military_advancements" | "military_equipment" | "autonomy" | "government_in_exile" | "intelligence_agency" | "character" | "faction" | "scientist")[];
}

interface MeanTimeToHappenBody {
  "base"?: number | string;
  "factor"?: number | string;
  "modifier"?: NativeShape57;
}

interface OccupationLawBody {
  "tooltip"?: string;
  "icon"?: string | number | boolean | number;
  "soundEffect"?: string;
  "visible"?: Trigger<ScopeByName["country"]>;
  "available"?: Trigger<ScopeByName["country"]>;
  "fallbackLaw"?: string;
  "defaultLaw"?: boolean;
  "startingLaw"?: boolean;
  "mainFallbackLaw"?: boolean;
  "missingGarrisonLaw"?: boolean;
  "stateModifier"?: NativeShape12;
  "suppressedStateModifier"?: NativeShape12;
  "guiOrder"?: number;
  "aiWillDo"?: NativeShape105;
}

interface NativeShape192 {
  "amount": number;
  "days": number;
}

interface NativeShape193 {
  "entries"?: { readonly [key: string]: number };
  "civilianFactories"?: readonly (number | NativeShape192)[];
}

interface OperationPhaseBody {
  "name": string;
  "desc": string;
  "icon": string;
  "picture": string;
  "outcome"?: string;
  "mapIcon"?: string;
  "outcomeExtra"?: string;
  "riskExtra"?: string;
  "requirements"?: Trigger<ScopeByName["country"]>;
  "returnOnComplete"?: boolean;
  "equipment"?: NativeShape193;
}

interface OperationTokenBody {
  "name": string;
  "desc": string;
  "icon": string;
  "textIcon": string;
  "targetedModifier"?: readonly (string)[];
  "intelSource"?: "navy" | "army" | "civilian" | "airforce";
  "intelGain"?: number;
}

interface NativeShape196 {
  "targets": readonly (string)[];
}

interface OperationBody {
  "icon": string;
  "mapIcon": string;
  "name": string;
  "desc": string;
  "priority"?: number;
  "days": number;
  "dangerLevel"?: number;
  "operatives": number;
  "isCapturedCipher"?: boolean;
  "networkStrength": number;
  "preventCapturedOperativeToDie"?: boolean;
  "isStagedCoup"?: true;
  "timeMultiplier"?: number;
  "costMultiplier"?: number;
  "experience"?: number;
  "scaleCostIndependentOfTarget"?: boolean;
  "phases": readonly ({ readonly [key: string]: NativeShape58 })[];
  "aiWillDo"?: NativeShape58;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "available"?: Trigger<ScopeByName["country"]>;
  "visible"?: Trigger<ScopeByName["country"]>;
  "riskChance"?: number;
  "riskModifiers"?: readonly ("alias_keys_field[modifier]" | "alias_keys_field[unit_leader_modifier]")[];
  "awardedTokens"?: readonly (string)[];
  "costModifiers"?: readonly ("alias_keys_field[modifier]" | "alias_keys_field[unit_leader_modifier]" | "operation_coup_cost")[];
  "operationTarget"?: NativeShape196;
  "selectionTarget"?: NativeShape196;
  "selectionTargetState"?: Trigger<ScopeByName["state"]>;
  "targetType"?: "province" | "strategic_region";
  "equipment"?: NativeShape193;
  "requiredTokens"?: readonly (string)[];
  "targetWeight"?: NativeShape58;
  "requirements"?: Trigger<ScopeByName["country"]>;
  "returnOnComplete"?: true;
  "onStart"?: Effect<ScopeByName["operation"]>;
  "outcomePotential"?: Effect<ScopeByName["country"]>;
  "outcomeExtraChance"?: number;
  "outcomeModifiers"?: readonly ("alias_keys_field[modifier]" | "alias_keys_field[unit_leader_modifier]")[];
  "outcomeExecute"?: Effect<ScopeByName["operation"]>;
  "outcomeExtraExecute"?: Effect<ScopeByName["operation"]>;
  "willLeadToWarWith"?: boolean;
}

interface OpinionModifierBody {
  "value": number;
  "trade"?: boolean;
  "decay"?: number;
  "minTrust"?: number;
  "maxTrust"?: number;
  "target"?: boolean;
  "days"?: number;
  "months"?: number;
  "years"?: number;
}

interface PeaceActionCategoryBody {
  "default"?: true;
  "name": string;
}

interface PeaceAiDesireBody {
  "peaceActionType": "take_states" | "puppet" | "force_government" | "liberate" | "take_navy" | readonly ("take_states" | "puppet" | "force_government" | "liberate" | "take_navy")[] | readonly ("take_states" | "puppet")[] | readonly ("take_states" | "force_government")[] | readonly ("take_states" | "liberate")[] | readonly ("puppet" | "force_government")[] | readonly ("puppet" | "liberate")[] | readonly ("force_government" | "liberate")[] | readonly ("take_states" | "puppet" | "force_government")[] | readonly ("take_states" | "puppet" | "liberate")[] | readonly ("take_states" | "force_government" | "liberate")[] | readonly ("puppet" | "force_government" | "liberate")[] | readonly ("take_states" | "puppet" | "force_government" | "liberate")[];
  "enable": Trigger<ScopeByName["country"]>;
  "aiDesire": number;
}

interface PeaceActionModifierBody {
  "peaceActionType": "take_states" | "puppet" | "force_government" | "liberate" | "take_navy" | readonly ("take_states" | "puppet" | "force_government" | "liberate" | "take_navy")[] | readonly ("take_states" | "puppet")[] | readonly ("take_states" | "force_government")[] | readonly ("take_states" | "liberate")[] | readonly ("take_states" | "take_navy")[] | readonly ("puppet" | "force_government")[] | readonly ("puppet" | "liberate")[] | readonly ("puppet" | "take_navy")[] | readonly ("force_government" | "liberate")[] | readonly ("force_government" | "take_navy")[] | readonly ("liberate" | "take_navy")[] | readonly ("take_states" | "puppet" | "force_government")[] | readonly ("take_states" | "puppet" | "liberate")[] | readonly ("take_states" | "puppet" | "take_navy")[] | readonly ("take_states" | "force_government" | "liberate")[] | readonly ("take_states" | "force_government" | "take_navy")[] | readonly ("take_states" | "liberate" | "take_navy")[] | readonly ("puppet" | "force_government" | "liberate")[] | readonly ("puppet" | "force_government" | "take_navy")[] | readonly ("puppet" | "liberate" | "take_navy")[] | readonly ("force_government" | "liberate" | "take_navy")[] | readonly ("take_states" | "puppet" | "force_government" | "liberate")[] | readonly ("take_states" | "puppet" | "force_government" | "take_navy")[] | readonly ("take_states" | "puppet" | "liberate" | "take_navy")[] | readonly ("take_states" | "force_government" | "liberate" | "take_navy")[] | readonly ("puppet" | "force_government" | "liberate" | "take_navy")[] | readonly ("take_states" | "puppet" | "force_government" | "liberate" | "take_navy")[];
  "enable"?: Trigger<ScopeByName["country"]>;
  "costMultiplier": number;
  "factionModifier"?: boolean;
  "category"?: string;
}

interface RaidCategoryBody {
  "available"?: Trigger<ScopeByName["country"]>;
  "visible"?: Trigger<ScopeByName["country"]>;
  "intelSource": "air" | "naval" | "army" | "civilian";
  "freeTargeting"?: boolean;
  "factionInfluenceScoreOnSuccess"?: number | string;
}

interface NativeShape203 {
  "type": "line" | "ballistic" | "air" | "naval" | "land";
}

interface NativeShape204 {
  "equipment"?: string;
  "entity"?: string;
  "scale"?: number;
}

interface NativeShape205 {
  "state": string;
  "intro"?: string;
  "atProgress"?: number;
}

interface NativeShape206 {
  "stage": readonly (NativeShape205)[];
}

interface NativeShape207 {
  "base": number;
  "modifier"?: readonly (NativeShape61)[];
}

interface NativeShape208 {
  "min"?: number;
  "max"?: number;
}

interface NativeShape209 {
  "type"?: string;
  "tags"?: string;
  "level"?: NativeShape208;
  "isCoastal"?: boolean;
}

interface NativeShape210 {
  "province"?: readonly (number | string)[];
  "building"?: readonly (NativeShape209)[];
  "state"?: readonly (Trigger<ScopeByName["state"]>)[];
  "capturedArmyLeader"?: true;
}

interface NativeShape211 {
  "types"?: readonly ("air_base" | "naval_base" | "rocket_site" | "carrier" | "submarine")[];
  "buildingTypes"?: readonly (string)[];
  "allowFactionBuildings"?: boolean;
}

interface NativeShape212 {
  "airSuperiority"?: number;
  "navalSupremacy"?: number;
}

interface NativeShape213 {
  "type": readonly (string)[];
  "modules"?: readonly (string)[];
  "amount"?: NativeShape208;
}

interface NativeShape214 {
  "battalionTypes"?: readonly ({ readonly [key: string]: NativeShape208 })[];
  "equipment"?: readonly (NativeShape213)[];
  "experience"?: NativeShape208;
}

interface NativeShape215 {
  "entries"?: { readonly [key: string]: number };
  "nukes"?: number;
}

interface NativeShape216 {
  "launch": number;
}

interface NativeShape217 {
  "entity": string;
  "animation": string | number | boolean;
}

interface NativeShape218 {
  "effects"?: Effect<ScopeByName["raid"]>;
  "entries"?: { readonly [key: string]: Effect<ScopeByName["raid"]> };
}

interface NativeShape219 {
  "effects"?: Effect<ScopeByName["raid"]>;
  "entries"?: { readonly [key: string]: Effect<ScopeByName["raid"]> };
}

interface NativeShape220 {
  "customSound"?: string;
  "visualEffect"?: readonly (NativeShape217)[];
  "actorEffects"?: NativeShape218;
  "victimEffects"?: NativeShape219;
  "divisionEffects"?: Effect<ScopeByName["unit"]>;
  "destroyAdditionalEquipment"?: number;
  "outcomeDescription"?: string;
  "outcomeDescriptionAttacker"?: string;
  "outcomeDescriptionDefender"?: string;
}

interface NativeShape221 {
  "failure": NativeShape220;
  "limitedSuccess": NativeShape220;
  "success": NativeShape220;
  "criticalSuccess": NativeShape220;
}

interface NativeShape222 {
  "weight": number;
  "reference"?: number;
  "startWeight"?: number;
  "startReference"?: number;
}

interface NativeShape223 {
  "base": number;
  "modifier"?: NativeShape57;
}

interface NativeShape224 {
  "scope"?: "country" | "state" | "character" | "unit";
  "formula": NativeShape223;
  "weight": number;
  "reference": number;
  "canActorAffect": boolean;
  "canTargetAffect": boolean;
}

interface NativeShape225 {
  "base"?: number;
  "prepTime"?: NativeShape222;
  "experience"?: NativeShape222;
  "antiAir"?: NativeShape222;
  "resistance"?: NativeShape222;
  "enemyUnits"?: NativeShape222;
  "airSuperiority"?: NativeShape222;
  "navalSupremacy"?: NativeShape222;
  "interception"?: NativeShape222;
  "radar"?: NativeShape222;
  "intel"?: NativeShape222;
  "airDefence"?: NativeShape222;
  "airAgility"?: NativeShape222;
  "strategicBomber"?: NativeShape222;
  "reliability"?: NativeShape222;
  "recon"?: NativeShape222;
  "organisation"?: NativeShape222;
  "strength"?: NativeShape222;
  "entries"?: { readonly [key: string]: NativeShape224 };
}

interface NativeShape226 {
  "success": NativeShape225;
  "critical"?: NativeShape225;
  "disaster"?: NativeShape225;
}

interface RaidBody {
  "category": string;
  "customMapIcon"?: string;
  "unitIcon"?: string;
  "targetIcon"?: string;
  "targetLocKey"?: string;
  "equipmentIcon"?: string;
  "launchSound"?: string;
  "commandPower": number;
  "arrow": NativeShape203;
  "unitModel"?: NativeShape204;
  "unitAnimations"?: NativeShape206;
  "aiWillDo"?: NativeShape207;
  "aiMinSuccessChance"?: number;
  "maxDistance"?: number;
  "fireOnlyOnce"?: boolean;
  "daysReEnable"?: number;
  "daysToPrepare": number;
  "speedMultiplier"?: number;
  "rangeFactor"?: number;
  "unlimitedAiRange"?: boolean;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "visible"?: Trigger<ScopeByName["country"]>;
  "showTarget": Trigger<ScopeByName["country"]>;
  "available": Trigger<ScopeByName["country"]>;
  "launchable"?: Trigger<ScopeByName["country"]>;
  "cancelTrigger"?: Trigger<ScopeByName["country"]>;
  "targetType": NativeShape210;
  "startingPoint": NativeShape211;
  "preparationTime"?: number;
  "cost"?: number;
  "targetRequirements"?: NativeShape212;
  "targetRequirementTime"?: number;
  "unitRequirements"?: readonly (NativeShape214)[];
  "essentialEquipment"?: NativeShape215;
  "additionalEquipment"?: NativeShape215;
  "nukeType"?: "nuclear_bomb" | "thermonuclear_bomb";
  "intelLevels"?: NativeShape216;
  "successLevels": NativeShape221;
  "successFactors": NativeShape226;
}

interface ResistanceComplianceModifierBody {
  "type": "state_resistance_modifier" | "state_compliance_modifier" | "core_resistance_modifier" | "core_compliance_modifier";
  "icon": string | number | boolean;
  "smallIcon": string | number | boolean;
  "threshold": number;
  "margin": number;
  "alertLevel"?: "high" | "medium" | "low";
  "alertMargin"?: number;
  "stateModifier"?: NativeShape12;
  "visible"?: Trigger<ScopeByName["country"]> | Trigger<ScopeByName["state"]>;
  "enabled"?: Trigger<ScopeByName["country"]> | Trigger<ScopeByName["state"]>;
  "onEnable"?: Effect<ScopeByName["country"]> | Effect<ScopeByName["state"]>;
  "onDisable"?: Effect<ScopeByName["country"]> | Effect<ScopeByName["state"]>;
  "isDynamic"?: true;
}

interface ResourceBody {
  "iconFrame": number;
  "cic": number;
  "convoys": number;
}

interface NativeShape230 {
  "targetsDynamic"?: boolean;
  "targetNonExisting"?: boolean;
  "targetArray"?: readonly (string)[];
  "targets"?: readonly (string | number)[];
  "targetRootTrigger"?: Trigger<ScopeByName["country"]>;
  "targetTrigger"?: Trigger<ScopeByName["country"]>;
  "score"?: NativeShape116;
}

interface CountryScorerBody {
  "targets": NativeShape230;
}

interface NativeShape232 {
  "tag"?: readonly (string)[];
  "originalTag"?: readonly (string)[];
  "hasDlc"?: readonly ("Poland: United and Ready" | "Together for Victory" | "Axis Armor Pack" | "Death or Dishonor" | "Waking the Tiger" | "Man the Guns" | "La Resistance" | "Battle for the Bosporus" | "No Step Back" | "By Blood Alone" | "Arms Against Tyranny" | "Trial of Allegiance" | "Gotterdammerung" | "Graveyard of Empires" | "Expansion Pass 1: Supporter Pack" | "No Compromise, No Surrender" | "Peace For Our Time" | "Thunder at Our Gates")[];
}

interface NativeShape233 {
  "always"?: boolean;
  "tag"?: readonly (string)[];
  "originalTag"?: readonly (string)[];
  "hasDlc"?: readonly ("Poland: United and Ready" | "Together for Victory" | "Axis Armor Pack" | "Death or Dishonor" | "Waking the Tiger" | "Man the Guns" | "La Resistance" | "Battle for the Bosporus" | "No Step Back" | "By Blood Alone" | "Arms Against Tyranny" | "Trial of Allegiance" | "Gotterdammerung" | "Graveyard of Empires" | "Expansion Pass 1: Supporter Pack" | "No Compromise, No Surrender" | "Peace For Our Time" | "Thunder at Our Gates")[];
  "NOT"?: readonly (NativeShape232)[];
  "AND"?: readonly (NativeShape232)[];
  "hasDlcGtd"?: readonly (true)[];
  "hasDlcMtg"?: readonly (true)[];
  "hasDlcNsb"?: readonly (true)[];
  "hasDlcNcns"?: readonly (true)[];
  "hasDlcPfot"?: readonly (true)[];
}

interface NativeShape234 {
  "trigger"?: Trigger<ScopeByName["project"]>;
  "add"?: number;
  "factor"?: number;
}

interface NativeShape235 {
  "base": number;
  "modifier": readonly (NativeShape234)[];
}

interface NativeShape236 {
  "name"?: string;
  "desc"?: string;
}

interface NativeShape237 {
  "resources": { readonly [key: string]: number };
}

interface NativeShape238 {
  "base": number;
  "modifier"?: readonly (NativeShape234)[];
}

interface NativeShape239 {
  "hasDlc"?: readonly ("Poland: United and Ready" | "Together for Victory" | "Axis Armor Pack" | "Death or Dishonor" | "Waking the Tiger" | "Man the Guns" | "La Resistance" | "Battle for the Bosporus" | "No Step Back" | "By Blood Alone" | "Arms Against Tyranny" | "Trial of Allegiance" | "Gotterdammerung" | "Graveyard of Empires" | "Expansion Pass 1: Supporter Pack" | "No Compromise, No Surrender" | "Peace For Our Time" | "Thunder at Our Gates")[];
}

interface NativeShape240 {
  "hasDlc"?: readonly ("Poland: United and Ready" | "Together for Victory" | "Axis Armor Pack" | "Death or Dishonor" | "Waking the Tiger" | "Man the Guns" | "La Resistance" | "Battle for the Bosporus" | "No Step Back" | "By Blood Alone" | "Arms Against Tyranny" | "Trial of Allegiance" | "Gotterdammerung" | "Graveyard of Empires" | "Expansion Pass 1: Supporter Pack" | "No Compromise, No Surrender" | "Peace For Our Time" | "Thunder at Our Gates")[];
  "NOT"?: readonly (NativeShape239)[];
  "AND"?: readonly (NativeShape239)[];
}

interface NativeShape241 {
  "limit"?: NativeShape240;
  "values"?: readonly (string)[];
}

interface NativeShape242 {
  "limit"?: NativeShape240;
  "values"?: readonly (string)[];
}

interface NativeShape243 {
  "limit"?: NativeShape240;
  "values": readonly (string)[];
}

interface NativeShape244 {
  "need"?: readonly ({ readonly [key: string]: number })[];
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6 | NativeShape147;
  "rainLight"?: NativeShape6 | NativeShape147;
  "rainHeavy"?: NativeShape6 | NativeShape147;
  "snow"?: NativeShape6 | NativeShape147;
  "blizzard"?: NativeShape6 | NativeShape147;
  "arcticWater"?: NativeShape6 | NativeShape147;
  "mud"?: NativeShape6 | NativeShape147;
  "sandstorm"?: NativeShape6 | NativeShape147;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
  "battalionMult"?: readonly (NativeShape124)[];
}

interface NativeShape245 {
  "instant"?: boolean;
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
}

interface NativeShape246 {
  "countryEffects"?: Effect<ScopeByName["country"]>;
  "facilityStateEffects"?: Effect<ScopeByName["state"]>;
  "scientistEffects"?: Effect<ScopeByName["character"]>;
  "enableEquipments"?: readonly (NativeShape241)[];
  "enableEquipmentModules"?: readonly (NativeShape242)[];
  "enableSubunits"?: NativeShape243;
  "subUnitBonus"?: { readonly [key: string]: NativeShape244 };
  "equipmentBonus"?: { readonly [key: string]: NativeShape245 };
}

interface NativeShape247 {
  "name"?: string;
  "desc"?: string;
}

interface NativeShape248 {
  "min": number;
  "max": number;
}

interface NativeShape249 {
  "base"?: number;
  "factor"?: number;
  "modifier"?: readonly (NativeShape234)[];
}

interface NativeShape250 {
  "name"?: string;
}

interface NativeShape251 {
  "token": string;
  "default"?: true;
  "narrative"?: NativeShape250;
  "iterationOutput"?: NativeShape246;
}

interface NativeShape252 {
  "narrative"?: NativeShape247;
  "icon"?: string;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "fireOnlyOnce"?: boolean;
  "forceRewardIfAvailable"?: boolean;
  "threshold"?: NativeShape248;
  "weight"?: NativeShape249;
  "option": readonly (NativeShape251)[];
}

interface SpecialProjectBody {
  "specialization": string;
  "allowed"?: NativeShape233;
  "available"?: Trigger<ScopeByName["project"]>;
  "visible"?: Trigger<ScopeByName["project"]>;
  "breakthroughCost"?: { readonly [key: string]: number | NativeShape235 };
  "narrative"?: NativeShape236;
  "icon"?: string;
  "projectTags"?: string | readonly (string)[];
  "blueprintImage"?: string;
  "resourceCost"?: NativeShape237;
  "prototypeTime"?: number | string | number | boolean;
  "complexity"?: number | string | number | boolean;
  "aiWillDo"?: NativeShape238;
  "specialProjectParent"?: readonly (string)[];
  "projectOutput"?: NativeShape246;
  "genericPrototypeRewards"?: readonly (string)[];
  "uniquePrototypeRewards"?: { readonly [key: string]: NativeShape252 };
  "emptyRewardWeight"?: NativeShape238;
}

interface PrototypeRewardBody {
  "narrative"?: NativeShape247;
  "icon"?: string;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "fireOnlyOnce"?: boolean;
  "forceRewardIfAvailable"?: boolean;
  "threshold"?: NativeShape248;
  "weight"?: NativeShape249;
  "option": readonly (NativeShape251)[];
}

interface SpecializationBody {
  "blueprintImage"?: string;
  "color": readonly (number)[];
  "programBackground"?: string;
}

interface StaticModifierBody {
  "entries"?: { readonly [key: string]: number } | { readonly [key: string]: number } | { readonly [key: string]: NativeShape7 };
  "hiddenModifier"?: NativeShape1;
  "customModifierTooltip"?: string;
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "carrierSize"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
  "antiAirAttack"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "validRelationTrigger"?: Trigger<ScopeByName["country"]>;
}

interface StrategicLocationBody {
  "entries": { readonly [key: string]: number };
}

interface NativeShape256 {
  "limit"?: Trigger<ScopeByName["country"]>;
  "values"?: readonly (string)[];
}

interface NativeShape257 {
  "building": string;
  "level": number;
}

interface NativeShape258 {
  "leadsToTech"?: string;
  "researchCostCoeff"?: number;
  "ignoreForLayout"?: boolean;
}

interface NativeShape259 {
  "name": string;
  "position": NativeShape182;
}

interface NativeShape260 {
  "defensive"?: number;
  "offensive"?: number;
  "carrier"?: number;
  "battleship"?: number;
  "cruiser"?: number;
  "entries"?: { readonly [key: string]: number };
}

interface NativeShape261 {
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
  "need"?: { readonly [key: string]: number };
}

interface NativeShape262 {
  "need"?: readonly ({ readonly [key: string]: number })[];
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6 | NativeShape147;
  "rainLight"?: NativeShape6 | NativeShape147;
  "rainHeavy"?: NativeShape6 | NativeShape147;
  "snow"?: NativeShape6 | NativeShape147;
  "blizzard"?: NativeShape6 | NativeShape147;
  "arcticWater"?: NativeShape6 | NativeShape147;
  "mud"?: NativeShape6 | NativeShape147;
  "sandstorm"?: NativeShape6 | NativeShape147;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
  "battalionMult"?: readonly (NativeShape124)[];
  "transport"?: string;
}

interface TechnologyBody {
  "doctrineName"?: string | number | boolean;
  "showEquipmentIcon"?: boolean;
  "desc"?: string;
  "xpResearchType"?: "army" | "navy" | "air";
  "xpResearchCost"?: number;
  "xpBoostCost"?: number;
  "xpResearchBonus"?: number;
  "xpUnlockCost"?: number;
  "allow"?: Trigger<ScopeByName["country"]>;
  "allowBranch"?: Trigger<ScopeByName["country"]>;
  "isSpecialProjectTech"?: boolean;
  "xor"?: readonly (string)[];
  "enableSubunits"?: readonly (NativeShape243)[];
  "enableEquipments"?: readonly (NativeShape256)[];
  "enableEquipmentModules"?: readonly (readonly (string)[])[];
  "enableBuilding"?: readonly (NativeShape257)[];
  "enableTactic"?: readonly (string)[];
  "subTechnologies"?: readonly (string)[];
  "path"?: readonly (NativeShape258)[];
  "dependencies"?: { readonly [key: string]: number };
  "researchCost"?: number;
  "startYear"?: number;
  "subTechIndex"?: number;
  "folder"?: readonly (NativeShape259)[];
  "doctrine"?: boolean;
  "aiWillDo"?: NativeShape58;
  "aiResearchWeights"?: NativeShape260;
  "categories"?: readonly (string)[];
  "specialProjectSpecialization"?: readonly (string)[];
  "entries"?: { readonly [key: string]: NativeShape261 } | { readonly [key: string]: NativeShape262 } | { readonly [key: string]: number } | { readonly [key: string]: number } | { readonly [key: string]: NativeShape7 };
  "modifier"?: NativeShape12;
  "onResearchCompleteLimit"?: Trigger<ScopeByName["country"]>;
  "onResearchComplete"?: Effect<ScopeByName["country"]>;
  "forceUseSmallTechLayout"?: true;
  "showEffectAsDesc"?: boolean;
  "nuclearProduction"?: number;
  "hiddenModifier"?: NativeShape1;
  "customModifierTooltip"?: string;
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
}

interface TechnologySharingGroupBody {
  "name": string;
  "desc": string;
  "picture": string;
  "researchSharingPerCountryBonus": number;
  "isFactionSharing"?: true;
  "categories"?: readonly (string)[];
  "available"?: Trigger<ScopeByName["country"]>;
}

interface NativeShape265 {
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "airAttack"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
}

interface NativeShape266 {
  "units"?: NativeShape265;
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
}

interface TerrainBody {
  "color": readonly (number)[];
  "movementCost"?: number;
  "soundType"?: string | number | boolean;
  "isWater"?: true;
  "navalTerrain"?: true;
  "entries"?: { readonly [key: string]: NativeShape266 };
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "minimumSeazoneDominance"?: number;
  "combatWidth"?: number;
  "combatSupportWidth"?: number;
  "supplyFlowPenaltyFactor"?: number;
  "truckAttritionFactor"?: number;
  "attrition"?: number;
  "enemyArmyBonusAirSuperiorityFactor"?: number;
  "sicknessChance"?: number;
  "aiTerrainImportanceFactor"?: number;
  "matchValue"?: number;
  "units"?: NativeShape265;
  "buildingsMaxLevel"?: { readonly [key: string]: number };
}

interface GraphicalTerrainBody {
  "type": string;
  "color": readonly (number)[];
  "texture": number;
  "spawnCity"?: true;
  "permSnow"?: true;
}

interface NativeShape269 {
  "tag": string;
  "entries"?: { readonly [key: string]: number } | { readonly [key: string]: number };
  "hiddenModifier"?: NativeShape1;
  "customModifierTooltip"?: string;
}

interface CountryLeaderTraitBody {
  "random"?: boolean;
  "sprite"?: number;
  "entries"?: { readonly [key: string]: number } | { readonly [key: string]: number };
  "hiddenModifier"?: NativeShape1;
  "customModifierTooltip"?: string;
  "aiStrategy"?: NativeShape16 | NativeShape17 | NativeShape18 | NativeShape19 | NativeShape20 | NativeShape21 | NativeShape22 | NativeShape23 | NativeShape24 | NativeShape25 | NativeShape26 | NativeShape27 | NativeShape28 | NativeShape29 | NativeShape30 | NativeShape31 | NativeShape33 | NativeShape34 | NativeShape35 | NativeShape36 | NativeShape37 | NativeShape38 | NativeShape39 | NativeShape40 | NativeShape41 | NativeShape42 | NativeShape43 | NativeShape44 | NativeShape45 | NativeShape46 | NativeShape47 | NativeShape48 | NativeShape49 | NativeShape50 | NativeShape51 | NativeShape52 | NativeShape53 | NativeShape54 | NativeShape55;
  "addAiStrategy"?: NativeShape32;
  "equipmentBonus"?: { readonly [key: string]: NativeShape245 };
  "targetedModifier"?: NativeShape269;
  "aiWillDo"?: NativeShape58;
  "commandCapIncrease"?: "@tier1_cp_cap_increase" | "@tier2_cp_cap_increase" | "@tier3_cp_cap_increase";
  "commandPower"?: "@tier1_cp_cost" | "@tier2_cp_cost" | "@tier3_cp_cost";
}

interface NativeShape271 {
  "entries"?: { readonly [key: string]: number } | { readonly [key: string]: number } | { readonly [key: string]: NativeShape265 };
  "hiddenModifier"?: NativeShape1;
  "customModifierTooltip"?: string;
  "airSuperiorityBonusInCombat"?: number;
  "cannotUseAbilities"?: number;
  "casDamageReduction"?: number;
  "equipmentCapture"?: number;
  "extraMarineSupplyGrace"?: number;
  "extraParatrooperSupplyGrace"?: number;
  "maxArmyGroupSize"?: number;
  "maxCommanderArmySize"?: number;
  "orgLossWhenMoving"?: number;
  "promoteCostFactor"?: number;
  "reassignmentDurationFactor"?: number;
  "reconFactorWhileEntrenched"?: number;
  "shoreBombardmentBonus"?: number;
  "skillBonusFactor"?: number;
  "woundedChanceFactor"?: number;
  "night"?: NativeShape265;
  "amphibious"?: NativeShape265;
  "fort"?: NativeShape265;
  "river"?: NativeShape265;
}

interface NativeShape272 {
  "type": readonly (string)[];
}

interface NativeShape273 {
  "traits": readonly (string)[];
  "numParentsNeeded": number;
}

interface UnitLeaderTraitBody {
  "type": "all" | "corps_commander" | "field_marshal" | "navy" | "land" | "operative" | readonly ("all" | "corps_commander" | "field_marshal" | "navy" | "land" | "operative")[];
  "traitType"?: "assignable_terrain_trait" | "basic_terrain_trait" | "personality_trait" | "assignable_trait" | "status_trait" | "exile" | "basic_trait";
  "countryTrigger"?: Trigger<ScopeByName["country"]>;
  "attackSkill"?: number;
  "defenseSkill"?: number;
  "logisticsSkill"?: number;
  "planningSkill"?: number;
  "attackSkillFactor"?: number;
  "defenseSkillFactor"?: number;
  "logisticsSkillFactor"?: number;
  "planningSkillFactor"?: number;
  "leaderDefaultProximityOffset"?: number;
  "coordinationSkillFactor"?: number;
  "maneuveringSkillFactor"?: number;
  "gainXpOnSpotting"?: number;
  "subUnitModifiers"?: { readonly [key: string]: NativeShape147 };
  "allowedShipEquipments"?: readonly (string)[];
  "gainXp"?: Trigger<ScopeByName["combat"]>;
  "gainXpLeader"?: Trigger<ScopeByName["unit_leader"]> | Trigger<ScopeByName["operative"]>;
  "cost"?: number;
  "guiRow"?: number;
  "guiColumn"?: number;
  "customGainXpTriggerTooltip"?: string;
  "parent"?: readonly (string | NativeShape273)[];
  "mutuallyExclusive"?: readonly (string)[];
  "prerequisites"?: Trigger<ScopeByName["country"]>;
  "customPrerequisiteTooltip"?: string;
  "numParentsNeeded"?: number;
  "slot"?: string;
  "specialistAdvisorTrait"?: string;
  "expertAdvisorTrait"?: string;
  "geniusAdvisorTrait"?: string;
  "fieldMarshalModifier"?: NativeShape271;
  "corpsCommanderModifier"?: NativeShape271;
  "customEffectTooltip"?: string;
  "overrideEffectTooltip"?: string;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "modifier"?: NativeShape271;
  "nonSharedModifier"?: NativeShape271;
  "enableAbility"?: readonly (string)[];
  "newCommanderWeight"?: NativeShape58;
  "traitXpFactor"?: { readonly [key: string]: number };
  "onAdd"?: Effect<ScopeByName["unit_leader"]>;
  "onRemove"?: Effect<ScopeByName["unit_leader"]>;
  "aiWillDo"?: NativeShape58;
  "unitTrigger"?: Trigger<ScopeByName["country"]>;
  "unitType"?: NativeShape272;
  "anyParent"?: readonly (string)[];
}

interface ScientistTraitBody {
  "name"?: string;
  "icon"?: string;
  "available"?: Trigger<ScopeByName["country"]>;
  "modifier"?: NativeShape12;
  "specialization"?: readonly (string)[];
}

interface UnitMedalBody {
  "available"?: Trigger<ScopeByName["country"]>;
  "visible"?: Trigger<ScopeByName["country"]>;
  "frame": number;
  "icon": string;
  "cost": "@cost" | number;
  "unitModifiers"?: NativeShape12;
  "shipModifiers"?: NativeShape12;
  "oneTimeEffect"?: Effect<ScopeByName["country"]>;
  "officerXp": number;
}

interface NativeShape277 {
  "airSuperiorityBonusInCombat"?: number;
  "cannotUseAbilities"?: number;
  "casDamageReduction"?: number;
  "equipmentCapture"?: number;
  "extraMarineSupplyGrace"?: number;
  "extraParatrooperSupplyGrace"?: number;
  "maxArmyGroupSize"?: number;
  "maxCommanderArmySize"?: number;
  "orgLossWhenMoving"?: number;
  "promoteCostFactor"?: number;
  "reassignmentDurationFactor"?: number;
  "reconFactorWhileEntrenched"?: number;
  "shoreBombardmentBonus"?: number;
  "skillBonusFactor"?: number;
  "woundedChanceFactor"?: number;
  "entries"?: { readonly [key: string]: number } | { readonly [key: string]: NativeShape265 };
  "night"?: NativeShape265;
  "amphibious"?: NativeShape265;
  "fort"?: NativeShape265;
  "river"?: NativeShape265;
}

interface UnitBody {
  "abbreviation"?: string | number | boolean;
  "sprite": string | number | boolean;
  "group"?: string | number | boolean | readonly (string | number | boolean)[] | "support";
  "need"?: { readonly [key: string]: number };
  "aiPriority"?: number;
  "mapIconCategory"?: "infantry" | "armored" | "other" | "ship" | "transport" | "uboat" | "other";
  "cavalry"?: boolean;
  "specialForces"?: boolean;
  "marines"?: boolean;
  "mountaineers"?: boolean;
  "canBeParachuted"?: boolean;
  "canExfiltrateFromCoast"?: boolean;
  "affectsSpeed"?: boolean;
  "rangers"?: boolean;
  "isArtilleryBrigade"?: boolean;
  "transport"?: string;
  "type"?: readonly ("infantry" | "support" | "artillery" | "rocket" | "anti_tank" | "anti_air" | "motorized" | "mechanized" | "armor" | "amphibious" | "flame" | "railway_gun" | "land_cruiser")[] | readonly ("battle_cruiser" | "battleship" | "capital_ship" | "carrier" | "convoy" | "destroyer" | "heavy_cruiser" | "light_cruiser" | "screen_ship" | "submarine" | "support_ship" | "corvette" | "frigate" | "attack_submarine" | "missile_submarine" | "helicopter_operator" | "stealth_destroyer" | "anti_air" | "artillery")[] | "air_transport" | "cas" | "fighter" | "interceptor" | "missile" | "naval_bomber" | "scout_plane" | "strategic_bomber" | "suicide" | "tactical_bomber" | "maritime_patrol_plane" | "heavy_fighter" | "ballistic_missile" | "emplacement_gun_ammo" | "nuclear_missile" | "sam_missile" | readonly ("air_transport" | "cas" | "fighter" | "interceptor" | "missile" | "naval_bomber" | "scout_plane" | "strategic_bomber" | "suicide" | "tactical_bomber" | "maritime_patrol_plane" | "heavy_fighter" | "ballistic_missile" | "emplacement_gun_ammo" | "nuclear_missile" | "sam_missile")[];
  "allowedBattalionGroups"?: readonly (string | number | boolean)[];
  "divisional"?: boolean;
  "regimental"?: boolean;
  "sameSupportType"?: readonly (string | "infantry" | "support" | "artillery" | "rocket" | "anti_tank" | "anti_air" | "motorized" | "mechanized" | "armor" | "amphibious" | "flame" | "railway_gun" | "land_cruiser")[];
  "battalionMult"?: NativeShape124;
  "needEquipment"?: { readonly [key: string]: number };
  "needEquipmentModules"?: { readonly [key: string]: { readonly [key: string]: number } };
  "antiAirAttack"?: number;
  "carrierSize"?: number;
  "convoyRaidingCoordination"?: number;
  "evasion"?: number;
  "fireRange"?: number;
  "hgArmorPiercing"?: number;
  "hgAttack"?: number;
  "lgArmorPiercing"?: number;
  "lgAttack"?: number;
  "minesPlanting"?: number;
  "minesSweeping"?: number;
  "navalAccidentsChance"?: number;
  "navalDamageFactor"?: number;
  "navalHeavyGunHitChanceFactor"?: number;
  "navalInvasionPenalty"?: number;
  "navalLightGunHitChanceFactor"?: number;
  "navalMineHitChance"?: number;
  "navalMinesDamageFactor"?: number;
  "navalMoraleFactor"?: number;
  "navalMorale"?: number;
  "navalRange"?: number;
  "navalRetreatChance"?: number;
  "navalRetreatSpeed"?: number;
  "navalTorpedoEnemyCriticalChanceFactor"?: number;
  "navalTorpedoDamageReductionFactor"?: number;
  "navalSpeedFactor"?: number;
  "navalSpeed"?: number;
  "navalDominanceFactor"?: number;
  "navalTorpedoHitChanceFactor"?: number;
  "navalWeatherPenaltyFactor"?: number;
  "navyCasualtyOnSink"?: number;
  "navyFuelConsumptionFactor"?: number;
  "navyOrgFactor"?: number;
  "navyVisibility"?: number;
  "portCapacityUsage"?: number;
  "positioning"?: number;
  "searchAndDestroyCoordination"?: number;
  "shoreBombardment"?: number;
  "strikeForceMovementOrgLoss"?: number;
  "subAttack"?: number;
  "subDetection"?: number;
  "subVisibility"?: number;
  "surfaceDetection"?: number;
  "surfaceVisibility"?: number;
  "torpedoAttack"?: number;
  "criticalParts"?: readonly (string)[];
  "criticalPartDamageChanceMult"?: number;
  "hitProfileMult"?: number;
  "airAgility"?: number;
  "airAttackFactor"?: number;
  "airAttack"?: number;
  "airBombing"?: number;
  "airDefence"?: number;
  "airDefense"?: number;
  "airGroundAttack"?: number;
  "airRange"?: number;
  "airSuperiority"?: number;
  "airMissionEfficiency"?: number;
  "airCasEfficiency"?: number;
  "airNavEfficiency"?: number;
  "defaultCarrierCompositionWeight"?: number;
  "groundAttackFactor"?: number;
  "navalStrikeAttack"?: number;
  "navalStrikeAttackFactor"?: number;
  "navalStrikeTargetting"?: number;
  "navalStrikeTargettingFactor"?: number;
  "thrust"?: number;
  "nightPenalty"?: number;
  "landAirWingSize"?: number;
  "carrierAirWingSize"?: number;
  "megaCarrierAirWingSize"?: number;
  "submarineCarrierAirWingSize"?: number;
  "test"?: number;
  "priority": number;
  "division_3dModelPriority"?: number;
  "active": boolean;
  "acclimatizationColdClimateGainFactor"?: number;
  "acclimatizationHotClimateGainFactor"?: number;
  "apAttack"?: number;
  "armorValue"?: number;
  "attack"?: number;
  "breakthrough"?: number;
  "buildCostIc"?: number;
  "casualtyTrickleback"?: number;
  "combatWidth"?: number;
  "defaultMorale"?: number;
  "defence"?: number;
  "defense"?: number;
  "dontLoseDigInOnAttack"?: number;
  "entrenchment"?: number;
  "equipmentCaptureFactor"?: number;
  "experienceLossFactor"?: number;
  "fortificationCollateralChance"?: number;
  "fortificationDamage"?: number;
  "fuelConsumptionFactor"?: number;
  "fuelConsumption"?: number;
  "hardAttack"?: number;
  "hardness"?: number;
  "initiative"?: number;
  "initiativeFactor"?: number;
  "lendLeaseCost"?: number;
  "manpower"?: number;
  "maxOrganisation"?: number;
  "maxStrength"?: number;
  "maximumSpeed"?: number;
  "movement"?: number;
  "navalInvasionPrepSpeed"?: number;
  "paradropOrganizationFactor"?: number;
  "paratrooperAaDefense"?: number;
  "paratrooperCountPerPlane"?: number;
  "railwayGunAttack"?: number;
  "recon"?: number;
  "reliabilityFactor"?: number;
  "reliability"?: number;
  "riverCrossingFactor"?: number;
  "softAttack"?: number;
  "supplyConsumptionFactor"?: number;
  "supplyConsumption"?: number;
  "suppressionFactor"?: number;
  "suppression"?: number;
  "trainingTime"?: number;
  "weight"?: number;
  "additionalCollateralDamage"?: number;
  "recovery"?: number;
  "strength"?: number;
  "entries"?: { readonly [key: string]: NativeShape7 };
  "noPhenomenon"?: NativeShape6;
  "rainLight"?: NativeShape6;
  "rainHeavy"?: NativeShape6;
  "snow"?: NativeShape6;
  "blizzard"?: NativeShape6;
  "arcticWater"?: NativeShape6;
  "mud"?: NativeShape6;
  "sandstorm"?: NativeShape6;
  "night"?: NativeShape5;
  "amphibious"?: NativeShape4;
  "fort"?: NativeShape3;
  "river"?: NativeShape2;
  "deploymentCost"?: number;
  "allowInArmyHq"?: boolean;
  "allowInNonArmyHq"?: boolean;
  "requiredDlc"?: readonly ("Poland: United and Ready" | "Together for Victory" | "Axis Armor Pack" | "Death or Dishonor" | "Waking the Tiger" | "Man the Guns" | "La Resistance" | "Battle for the Bosporus" | "No Step Back" | "By Blood Alone" | "Arms Against Tyranny" | "Trial of Allegiance" | "Gotterdammerung" | "Graveyard of Empires" | "Expansion Pass 1: Supporter Pack" | "No Compromise, No Surrender" | "Peace For Our Time" | "Thunder at Our Gates")[];
  "enableAbility"?: readonly (string)[];
  "deployedLeaderModifiers"?: NativeShape277;
  "ownEquipmentFuelConsumptionMult"?: number;
  "essential"?: readonly (string)[];
  "categories"?: readonly (string)[];
}

interface DivisionNamesBody {
  "name": string;
  "forCountries": readonly (string)[];
  "canUse"?: Trigger<ScopeByName["country"]>;
  "divisionTypes": readonly (string)[];
  "linkNumberingWith"?: readonly (string)[];
  "fallbackName"?: string | number | boolean;
  "unordered"?: { readonly [key: string]: readonly (string | number | boolean)[] };
  "ordered"?: { readonly [key: string]: readonly (string | number | boolean)[] };
}

interface ShipNamesBody {
  "name": string;
  "forCountries"?: readonly (string)[];
  "canUse"?: Trigger<ScopeByName["country"]>;
  "type": "ship";
  "shipTypes"?: readonly (string | "battle_cruiser" | "battleship" | "capital_ship" | "carrier" | "convoy" | "destroyer" | "heavy_cruiser" | "light_cruiser" | "screen_ship" | "submarine" | "support_ship" | "corvette" | "frigate" | "attack_submarine" | "missile_submarine" | "helicopter_operator" | "stealth_destroyer" | "anti_air" | "artillery")[];
  "linkNumberingWith"?: readonly (string)[];
  "prefix"?: string | number | boolean;
  "fallbackName"?: string | number | boolean;
  "unique"?: readonly (string | number | boolean)[];
  "unordered"?: { readonly [key: string]: readonly (string | number | boolean)[] };
  "ordered"?: { readonly [key: string]: readonly (string | number | boolean)[] };
}

interface WargoalBody {
  "warName"?: string;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "available"?: Trigger<ScopeByName["country"]>;
  "takeStates"?: Trigger<ScopeByName["state"]>;
  "puppet"?: Trigger<ScopeByName["country"]>;
  "liberate"?: Trigger<ScopeByName["country"]>;
  "generateBaseCost"?: number;
  "generatePerStateCost"?: number;
  "takeStatesLimit"?: number;
  "takeStatesCost"?: number;
  "puppetCost"?: number;
  "annexThreatFactor"?: number;
  "annexCost"?: number;
  "forceGovernmentCost"?: number;
  "takeStatesThreatFactor"?: number;
  "expire"?: number;
  "threat"?: number;
}

interface NativeShape282 {
  "limit"?: Trigger<ScopeByName["country"]>;
  "subUnits"?: readonly (string)[];
  "cultures"?: readonly (string | number | boolean)[];
  "weight"?: number;
  "modelsWeight"?: number;
  "iconsWeight"?: number;
  "icons"?: readonly (string)[];
  "models"?: readonly (string)[];
}

interface NativeShape283 {
  "pool": readonly (NativeShape282)[];
}

interface GraphicDatabaseBody {
  "entries": { readonly [key: string]: NativeShape283 };
}

interface NativeShape284 {
  "r": readonly (number)[];
  "g": readonly (number)[];
  "b": readonly (number)[];
}

interface NativeShape285 {
  "x": number;
  "y": number;
  "z": number;
}

interface NativeShape286 {
  "name": string | number | boolean;
  "start": number;
  "duration": number;
  "repeat"?: boolean;
  "op": "MUL" | "ADD" | "ABS";
  "minValue"?: number;
  "maxValue"?: number;
  "curve": readonly (number)[];
}

interface LightBody {
  "color": NativeShape284;
  "intensity"?: string | number | boolean | number;
  "values"?: readonly (string)[];
  "radius": number;
  "falloff": number;
  "duration"?: number;
  "position": NativeShape285;
  "animation"?: NativeShape286;
}

interface NativeShape288 {
  "id": string | number | boolean;
  "type": string;
}

interface NativeShape289 {
  "name"?: string | number | boolean;
  "index"?: number;
  "textureDiffuse"?: string | number | boolean;
  "textureNormal"?: string | number | boolean;
  "textureSpecular"?: string | number | boolean;
  "shader"?: string | number | boolean;
}

interface NativeShape290 {
  "weight": number;
  "pdxmesh": string;
}

interface MeshBody {
  "file": string;
  "scale"?: number;
  "animation"?: readonly (NativeShape288)[];
  "meshsettings"?: readonly (NativeShape289)[];
  "variant"?: readonly (NativeShape290)[];
  "cullDistance"?: number;
}

interface NativeShape292 {
  "name": string | number | boolean;
  "position": readonly (number)[];
  "rotation"?: readonly (number)[];
}

interface NativeShape293 {
  "time": number;
  "type": "big" | "small";
}

interface NativeShape294 {
  "hitmissEffect"?: readonly (NativeShape293)[];
}

interface NativeShape295 {
  "soundeffect": string;
}

interface NativeShape296 {
  "id"?: "a_1_bomb" | "a_1_crash" | "a_1_fire" | "a_1_firebomb" | "a_1_idle" | "a_1_supply" | "a_2_bomb" | "a_2_crash" | "a_2_fire" | "a_2_firebomb" | "a_2_idle" | "a_2_supply" | "a_3_bomb" | "a_3_crash" | "a_3_fire" | "a_3_firebomb" | "a_3_idle" | "a_3_supply" | "a_bomb" | "a_crash" | "a_explode" | "a_fire" | "a_firebomb" | "a_idle" | "a_supply" | "d_1_crash" | "d_1_fire" | "d_1_idle" | "d_2_crash" | "d_2_fire" | "d_2_idle" | "d_3_crash" | "d_3_fire" | "d_3_idle" | "d_bomb" | "d_crash" | "d_fire" | "d_idle";
  "triggerOnce"?: boolean;
  "node"?: string | number | boolean;
  "entity"?: string;
  "life"?: number;
  "time"?: number;
  "particle"?: string;
  "keepParticle"?: boolean;
  "sound"?: NativeShape295;
  "light"?: string;
}

interface NativeShape297 {
  "name": string | number | boolean;
  "stateTime"?: number;
  "nextState"?: string;
  "animation"?: string;
  "animationSpeed"?: number;
  "animationBlendTime"?: number;
  "looping"?: boolean;
  "chance"?: number;
  "timeOffset"?: readonly (number)[];
  "propagateState"?: readonly ({ readonly [key: string]: string })[];
  "gameData"?: NativeShape294;
  "event"?: readonly (NativeShape296)[];
}

interface NativeShape298 {
  "name": string | number | boolean;
  "entries": { readonly [key: string]: string };
}

interface NativeShape299 {
  "textureAnimSpeed"?: number;
}

interface EntityBody {
  "clone"?: string;
  "pdxmesh"?: string | "empty_mesh";
  "version"?: number;
  "cullRadius"?: number;
  "scale"?: number;
  "locator"?: readonly (NativeShape292)[];
  "defaultState"?: string | "no_state";
  "getStateFromParent"?: boolean;
  "state"?: readonly (NativeShape297)[];
  "attach"?: readonly (NativeShape298)[];
  "gameData"?: NativeShape299;
}

interface ModelAnimationBody {
  "file": string | number | boolean;
}

interface PdxParticleBody {
  "type": string;
  "scale"?: number;
}

interface NativeShape303 {
  "file": string;
  "shader": string | number | boolean;
  "x"?: number;
  "y"?: number;
}

interface NativeShape304 {
  "r"?: readonly (number)[];
  "g"?: readonly (number)[];
  "b"?: readonly (number)[];
  "alpha"?: readonly (number | string | number | boolean)[] | string | number | boolean;
  "x"?: string | number | boolean | readonly (string | number | boolean)[];
  "y"?: string | number | boolean | readonly (string | number | boolean)[];
  "z"?: string | number | boolean | readonly (string | number | boolean)[];
}

interface NativeShape305 {
  "x"?: number | readonly (number)[];
  "y"?: number | readonly (number)[];
  "z"?: number | readonly (number)[];
}

interface NativeShape306 {
  "x"?: number;
  "y"?: number;
  "z"?: number;
}

interface NativeShape307 {
  "name"?: string | number | boolean;
  "maxAmount"?: number;
  "slaveParticles"?: number;
  "emitterType"?: "point" | "sphere" | "box";
  "invert"?: boolean;
  "trail"?: boolean;
  "localSpace"?: boolean;
  "billboard"?: boolean;
  "hide"?: boolean;
  "texture"?: NativeShape303;
  "color"?: NativeShape304;
  "position"?: NativeShape306;
  "duration": number;
  "life": readonly (number)[] | number;
  "emission"?: number | string | boolean | readonly (number)[];
  "size": readonly (string | number | boolean)[] | number;
  "rotation"?: number | readonly (string | number | boolean)[];
  "rotationSpeedRoll"?: readonly (number)[];
  "sort"?: "depth" | "age" | "distance";
  "rotationSpeed"?: number | readonly (number)[];
  "rotationSpeedYaw"?: number | readonly (number)[];
  "rotationSpeedPitch"?: number | readonly (number)[];
  "sphereEmitterRadius"?: number | readonly (string | number | boolean)[];
  "sphereEmitterYaw"?: number | readonly (number)[];
  "sphereEmitterPitch"?: readonly (number)[];
  "start"?: number | readonly (number)[];
  "boxEmitterX"?: number | string | boolean | readonly (number)[];
  "boxEmitterY"?: readonly (number)[] | string | number | boolean;
  "boxEmitterZ"?: readonly (number)[] | string | number | boolean;
  "velocity"?: string | number | boolean | readonly (string | number | boolean)[];
  "velocityPitch"?: readonly (number)[] | string | number | boolean;
  "velocityYaw"?: readonly (number)[] | number;
  "emitterPitch"?: string | number | boolean | readonly (string | number | boolean)[];
  "emitterYaw"?: string | number | boolean | readonly (string | number | boolean)[];
  "emissionPulseDuration"?: number;
  "emissionPulseSilence"?: number;
  "particlePitch"?: readonly (number)[] | number;
  "particleYaw"?: readonly (number)[] | number;
  "particleRoll"?: readonly (number)[];
  "force"?: string | number | boolean;
}

interface NativeShape308 {
  "name"?: string | number | boolean;
  "maxAmount"?: number;
  "slaveParticles"?: number;
  "emitterType"?: "point" | "sphere" | "box";
  "invert"?: boolean;
  "trail"?: boolean;
  "localSpace"?: boolean;
  "billboard"?: boolean;
  "hide"?: boolean;
  "texture"?: NativeShape303;
  "color"?: NativeShape304;
  "position"?: NativeShape305;
  "duration": number;
  "life": readonly (number)[] | number;
  "emission"?: number | string | boolean | readonly (number)[];
  "size": readonly (string | number | boolean)[] | number | string | boolean;
  "rotation"?: number | string | boolean | readonly (string | number | boolean)[];
  "rotationSpeedRoll"?: readonly (number)[];
  "sort"?: "depth" | "age" | "distance";
  "rotationSpeed"?: number | readonly (number)[];
  "rotationSpeedYaw"?: number | readonly (number)[];
  "rotationSpeedPitch"?: number | readonly (number)[];
  "sphereEmitterRadius"?: number | readonly (string | number | boolean)[];
  "sphereEmitterYaw"?: number | readonly (number)[];
  "sphereEmitterPitch"?: number | readonly (number)[];
  "start"?: number | readonly (number)[];
  "boxEmitterX"?: number | string | boolean | readonly (number)[];
  "boxEmitterY"?: readonly (number)[] | string | number | boolean;
  "boxEmitterZ"?: readonly (number)[] | string | number | boolean;
  "velocity"?: string | number | boolean | readonly (string | number | boolean)[];
  "velocityPitch"?: readonly (number)[] | string | number | boolean;
  "velocityYaw"?: readonly (number)[] | number;
  "emitterPitch"?: string | number | boolean | readonly (string | number | boolean)[];
  "emitterYaw"?: string | number | boolean | readonly (string | number | boolean)[];
  "emissionPulseDuration"?: number;
  "emissionPulseSilence"?: number;
  "particlePitch"?: readonly (number)[] | number;
  "particleYaw"?: readonly (string | number | boolean)[] | string | number | boolean;
  "particleRoll"?: readonly (number)[];
  "force"?: string | number | boolean;
  "mass"?: number | readonly (number)[];
  "childsystem"?: NativeShape307;
}

interface NativeShape309 {
  "name": string | number | boolean;
  "start": number;
  "duration": number;
  "repeat"?: boolean;
  "minValue": number;
  "maxValue": number;
  "curve": readonly (number)[];
  "op": "MUL" | "ADD" | "ABS";
  "time": "life" | "life_abs" | "system" | "spawn";
}

interface NativeShape310 {
  "name": string | number | boolean;
  "type": "friction" | "planar" | "point" | "spin" | "turbulence" | "vortex";
  "position"?: readonly (number)[];
  "direction"?: readonly (number)[];
  "localForce"?: boolean;
  "yaw"?: number;
  "division"?: number;
  "amount"?: number | readonly (number)[] | string | boolean;
}

interface ParticleBody {
  "subsystem": readonly (NativeShape308)[];
  "animation"?: readonly (NativeShape309)[];
  "force"?: readonly (NativeShape310)[];
}

interface NativeShape312 {
  "current": string;
  "progress": number;
}

interface NativeShape313 {
  "x": number;
  "y": number;
}

interface NativeShape314 {
  "x": 0;
  "y": number;
}

interface NativeShape315 {
  "name": string;
  "localizationKey"?: string;
  "divisionNamesGroup"?: string;
  "role"?: string;
  "frontRoleOverride"?: "defence" | "offence";
  "overrideModel"?: string;
  "templateCounter"?: number;
  "isArmyHq"?: boolean;
  "isLocked"?: boolean;
  "forceAllowRecruiting"?: boolean;
  "obsolete"?: boolean;
  "divisionCap"?: number;
  "regiments": { readonly [key: string]: NativeShape313 };
  "support"?: { readonly [key: string]: NativeShape314 };
  "regimentalSupport"?: { readonly [key: string]: NativeShape313 };
  "priority"?: number;
  "isFakeIntelDivision"?: boolean;
  "foreignTemplateTag"?: string;
  "originType"?: "subject";
}

interface NativeShape316 {
  "subject": string;
  "divisionTemplate": NativeShape315;
}

interface NativeShape317 {
  "isNameOrdered": boolean;
  "nameOrder"?: number;
}

interface NativeShape318 {
  "owner": string;
  "creator"?: string;
  "versionName"?: string | number | boolean;
  "amount"?: number;
}

interface NativeShape319 {
  "large"?: string | number | boolean;
  "small"?: string | number | boolean;
}

interface NativeShape320 {
  "army": readonly (NativeShape319)[];
}

interface NativeShape321 {
  "name": string | number | boolean;
  "portraits"?: NativeShape320;
}

interface NativeShape322 {
  "coldClimate"?: number | string;
  "hotClimate"?: number | string;
  "maxAcclimatization"?: number | string;
}

interface NativeShape323 {
  "tag": string;
  "value": number | string;
}

interface NativeShape324 {
  "value": readonly (NativeShape323)[];
}

interface NativeShape325 {
  "armyManpowerValue"?: NativeShape324;
  "armyManpowerNeed"?: NativeShape324;
}

interface NativeShape326 {
  "name"?: string | number | boolean;
  "divisionName"?: NativeShape317;
  "location": number | string;
  "divisionTemplate": string;
  "unique"?: readonly (string | number | boolean)[];
  "startExperienceFactor"?: number;
  "startEquipmentFactor"?: number;
  "startManpowerFactor"?: number;
  "forceEquipmentVariants"?: readonly ({ readonly [key: string]: NativeShape318 })[];
  "officer"?: readonly (NativeShape321)[];
  "acclimatization"?: NativeShape322;
  "armyManpower"?: NativeShape325;
}

interface NativeShape327 {
  "amount": number;
  "owner": string;
  "versionName"?: string | number | boolean;
  "creator"?: string;
  "createIfMissing"?: boolean;
}

interface NativeShape328 {
  "owner": string;
  "creator"?: string;
  "createIfMissing"?: boolean;
  "amount": number;
}

interface NativeShape329 {
  "modifier": string;
  "name": string;
  "surname": string;
  "callsign"?: string;
  "portrait"?: number;
  "isFemale"?: true;
}

interface NativeShape330 {
  "entries"?: { readonly [key: string]: NativeShape328 };
  "ace"?: readonly (NativeShape329)[];
  "startExperienceFactor"?: readonly (number)[];
  "name"?: readonly (string)[];
}

interface NativeShape331 {
  "name"?: string | number | boolean;
  "orderedName"?: string | number | boolean;
  "prideOfTheFleet"?: true;
  "definition": string;
  "startExperienceFactor"?: number;
  "equipment": { readonly [key: string]: NativeShape327 };
  "airWings"?: NativeShape330;
}

interface NativeShape332 {
  "name"?: string | number | boolean;
  "location": number | string;
  "base"?: number | string;
  "ship": readonly (NativeShape331)[];
}

interface NativeShape333 {
  "name": string | number | boolean;
  "navalBase": number | string;
  "taskForce": readonly (NativeShape332)[];
}

interface NativeShape334 {
  "division"?: readonly (NativeShape326)[];
  "fleet"?: readonly (NativeShape333)[];
}

interface NativeShape335 {
  "owner": string;
  "creator"?: string;
  "createIfMissing"?: boolean;
  "amount": number;
  "versionName"?: string;
}

interface NativeShape336 {
  "entries"?: { readonly [key: string]: NativeShape335 };
  "ace"?: readonly (NativeShape329)[];
  "startExperienceFactor"?: readonly (number)[];
  "name"?: readonly (string)[];
}

interface NativeShape337 {
  "value": 1;
}

interface NativeShape338 {
  "name": string | number | boolean;
  "desc"?: string;
  "picture"?: string | number | boolean;
  "portraitPath"?: string | number | boolean;
  "flags"?: { readonly [key: string]: NativeShape337 };
  "gfx"?: string | number | boolean;
  "traits": readonly (string)[];
  "skill": number;
  "attackSkill": number;
  "defenseSkill": number;
  "maneuveringSkill": number;
  "coordinationSkill": number;
  "id"?: string;
  "female"?: boolean;
}

interface NativeShape339 {
  "name": string | number | boolean;
  "desc"?: string;
  "picture"?: string | number | boolean;
  "portraitPath"?: string | number | boolean;
  "flags"?: { readonly [key: string]: NativeShape337 };
  "gfx"?: string | number | boolean;
  "traits": readonly (string)[];
  "skill": number;
  "attackSkill": number;
  "defenseSkill": number;
  "planningSkill": number;
  "logisticsSkill": number;
  "id"?: string;
  "female"?: boolean;
}

interface NativeShape340 {
  "name"?: string | number | boolean;
  "desc"?: string;
  "picture"?: string | number | boolean;
  "portraitPath"?: string | number | boolean;
  "flags"?: { readonly [key: string]: NativeShape337 };
  "gfx"?: string | number | boolean;
  "traits": readonly (string)[];
  "skill": number;
  "attackSkill": number;
  "defenseSkill": number;
  "planningSkill": number;
  "logisticsSkill": number;
  "id"?: string;
  "female"?: boolean;
}

interface UnitHistoryBody {
  "startEquipmentFactor"?: number;
  "focus"?: NativeShape312;
  "divisionTemplate"?: readonly (NativeShape315)[];
  "createColonialDivisionTemplate"?: readonly (NativeShape316)[];
  "instantEffect"?: readonly (Effect<ScopeByName["country"]>)[];
  "units"?: NativeShape334;
  "airWings"?: { readonly [key: string]: NativeShape336 };
  "navyLeader"?: readonly (NativeShape338)[];
  "fieldMarshal"?: readonly (NativeShape339)[];
  "corpsCommander"?: readonly (NativeShape340)[];
}

interface StateCategoryBody {
  "localBuildingSlots": number;
  "color": readonly (number)[];
  "buildingsMaxLevel"?: { readonly [key: string]: number };
}

interface BitmapFontBody {
  "entries"?: { readonly [key: string]: readonly (number)[] };
  "path"?: string | number | boolean;
  "fontfiles"?: readonly (string | number | boolean)[];
  "color"?: string | number | boolean;
  "textcolors"?: { readonly [key: string]: readonly (number)[] };
  "borderColor"?: string | number | boolean;
  "cursorOffset"?: readonly (number)[];
  "languages"?: readonly (string | number | boolean)[];
}

interface NativeShape344 {
  "army": boolean;
  "navy": boolean;
  "submarine": boolean;
  "trade": boolean;
}

interface NativeShape345 {
  "trigger"?: Trigger<ScopeByName["country"]>;
  "tooltip"?: string;
}

interface AdjacencyRuleBody {
  "isFriend"?: Trigger<ScopeByName["country"]>;
  "isNeutral"?: Trigger<ScopeByName["country"]>;
  "isEnemy"?: Trigger<ScopeByName["country"]>;
  "contested": NativeShape344;
  "enemy": NativeShape344;
  "friend": NativeShape344;
  "neutral": NativeShape344;
  "requiredProvinces": readonly (number | string)[];
  "icon": number;
  "offset": readonly (number)[];
  "isDisabled"?: NativeShape345;
}

interface SupplyAreaBody {
  "name": string;
  "value": number;
  "states": readonly (string)[];
}

interface NativeShape348 {
  "between": readonly (number | `${number}.${number}`)[];
  "temperature": readonly (number)[];
  "temperatureDayNight"?: readonly (number)[];
  "noPhenomenon"?: number;
  "rainLight"?: number;
  "rainHeavy"?: number;
  "snow"?: number;
  "blizzard"?: number;
  "arcticWater"?: number;
  "mud"?: number;
  "sandstorm"?: number;
  "minSnowLevel": number;
}

interface NativeShape349 {
  "period"?: readonly (NativeShape348)[];
}

interface StrategicRegionBody {
  "name": string;
  "provinces": readonly (number | string)[];
  "navalTerrain"?: string;
  "staticModifiers"?: { readonly [key: string]: "always" };
  "weather": NativeShape349;
}

interface MusicPlaylistEntryBody {
  "chance"?: NativeShape58;
}

interface MusicAssetBody {
  "file": string | number | boolean;
  "volume"?: number;
}

interface NativeShape353 {
  "male"?: readonly (string)[];
  "female"?: readonly (string)[];
}

interface PortraitBody {
  "name"?: string;
  "male"?: readonly (string)[];
  "female"?: readonly (string)[];
  "army"?: NativeShape353;
  "navy"?: NativeShape353;
  "operative"?: NativeShape353;
  "political"?: { readonly [key: string]: NativeShape353 };
  "scientist"?: NativeShape353;
}

interface NativeShape355 {
  "enabled"?: boolean;
  "pregain"?: number;
  "postgain"?: number;
  "ratio"?: number;
  "threshold"?: number;
  "attacktime"?: number;
  "releasetime"?: number;
}

interface SoundCategoryBody {
  "soundeffects": readonly (string)[];
  "compressor"?: NativeShape355 | string | number | boolean;
}

interface NativeShape357 {
  "sound": readonly (string)[];
}

interface NativeShape358 {
  "sound": string;
  "weight": number;
}

interface NativeShape359 {
  "weightedSound": readonly (NativeShape358)[];
}

interface SoundEffectBody {
  "falloff"?: string | number | boolean;
  "sounds"?: NativeShape357 | NativeShape359;
  "loop"?: boolean;
  "is3d"?: boolean;
  "randomSoundWhenLooping"?: boolean;
  "maxAudible"?: number;
  "maxAudibleBehaviour"?: "fail";
  "volume"?: number;
  "fadeIn"?: number;
  "fadeOut"?: number;
  "polyphony"?: number;
  "delayRandomOffset"?: readonly (number)[];
  "loopingDelayRandomOffset"?: boolean;
  "playbackrateRandomOffset"?: readonly (number)[];
  "loopingPlaybackrateRandomOffset"?: boolean;
  "volumeRandomOffset"?: readonly (number)[];
  "preventRandomRepetition"?: boolean;
}

interface SoundAssetBody {
  "file": string;
  "alwaysLoad"?: boolean;
  "volume"?: number;
}

interface NativeShape362 {
  "trigger": Trigger<ScopeByName["country"]>;
  "text": string;
}

interface NativeShape363 {
  "days"?: number;
  "months"?: number;
  "years"?: number;
  "modifier"?: NativeShape57;
}

interface NativeShape364 {
  "base"?: readonly (number | string)[];
  "factor"?: readonly (number | string)[];
  "modifier"?: NativeShape57;
}

interface NativeShape365 {
  "name"?: string | number | boolean;
  "trigger"?: Trigger<ScopeByName["country"]>;
  "effects"?: Effect<ScopeByName["country"]>;
  "aiChance"?: NativeShape364;
}

interface NativeCountryEventBody {
  "title"?: readonly (string | number | boolean | NativeShape362)[];
  "desc"?: readonly (string | number | boolean | NativeShape362)[];
  "picture"?: string;
  "hidden"?: true | false;
  "major"?: true | false;
  "fireOnlyOnce"?: true | false;
  "isTriggeredOnly"?: true | false;
  "minorFlavor"?: true | false;
  "timeoutDays"?: number;
  "trigger"?: Trigger<ScopeByName["country"]>;
  "showMajor"?: Trigger<ScopeByName["country"]>;
  "fireForSender"?: boolean;
  "meanTimeToHappen"?: NativeShape363;
  "immediate"?: readonly (Effect<ScopeByName["country"]>)[];
  "after"?: readonly (Effect<ScopeByName["country"]>)[];
  "option"?: readonly (NativeShape365)[];
}

interface NativeShape367 {
  "trigger": Trigger<ScopeByName["state"]>;
  "text": string;
}

interface NativeShape368 {
  "days"?: number;
  "months"?: number;
  "years"?: number;
  "modifier"?: NativeShape104;
}

interface NativeShape369 {
  "base"?: readonly (number | string)[];
  "factor"?: readonly (number | string)[];
  "modifier"?: NativeShape104;
}

interface NativeShape370 {
  "name"?: string | number | boolean;
  "trigger"?: Trigger<ScopeByName["state"]>;
  "effects"?: Effect<ScopeByName["state"]>;
  "aiChance"?: NativeShape369;
}

interface NativeStateEventBody {
  "title"?: readonly (string | number | boolean | NativeShape367)[];
  "desc"?: readonly (string | number | boolean | NativeShape367)[];
  "picture"?: string;
  "hidden"?: true | false;
  "major"?: true | false;
  "fireOnlyOnce"?: true | false;
  "isTriggeredOnly"?: true | false;
  "minorFlavor"?: true | false;
  "timeoutDays"?: number;
  "trigger"?: Trigger<ScopeByName["state"]>;
  "showMajor"?: Trigger<ScopeByName["state"]>;
  "fireForSender"?: boolean;
  "meanTimeToHappen"?: NativeShape368;
  "immediate"?: readonly (Effect<ScopeByName["state"]>)[];
  "after"?: readonly (Effect<ScopeByName["state"]>)[];
  "option"?: readonly (NativeShape370)[];
}

interface NativeNewsEventBody {
  "title"?: readonly (string | number | boolean | NativeShape362)[];
  "desc"?: readonly (string | number | boolean | NativeShape362)[];
  "picture"?: string;
  "hidden"?: true | false;
  "major"?: true | false;
  "fireOnlyOnce"?: true | false;
  "isTriggeredOnly"?: true | false;
  "minorFlavor"?: true | false;
  "timeoutDays"?: number;
  "trigger"?: Trigger<ScopeByName["country"]>;
  "showMajor"?: Trigger<ScopeByName["country"]>;
  "fireForSender"?: boolean;
  "meanTimeToHappen"?: NativeShape363;
  "immediate"?: readonly (Effect<ScopeByName["country"]>)[];
  "after"?: readonly (Effect<ScopeByName["country"]>)[];
  "option"?: readonly (NativeShape365)[];
}

interface NativeShape372 {
  "trigger": Trigger<ScopeByName["unit_leader"]>;
  "text": string;
}

interface NativeShape373 {
  "days"?: number;
  "months"?: number;
  "years"?: number;
  "modifier"?: NativeShape9;
}

interface NativeShape374 {
  "base"?: readonly (number | string)[];
  "factor"?: readonly (number | string)[];
  "modifier"?: NativeShape9;
}

interface NativeShape375 {
  "name"?: string | number | boolean;
  "trigger"?: Trigger<ScopeByName["unit_leader"]>;
  "effects"?: Effect<ScopeByName["unit_leader"]>;
  "aiChance"?: NativeShape374;
}

interface NativeUnitLeaderEventBody {
  "title"?: readonly (string | number | boolean | NativeShape372)[];
  "desc"?: readonly (string | number | boolean | NativeShape372)[];
  "picture"?: string;
  "hidden"?: true | false;
  "major"?: true | false;
  "fireOnlyOnce"?: true | false;
  "isTriggeredOnly"?: true | false;
  "minorFlavor"?: true | false;
  "timeoutDays"?: number;
  "trigger"?: Trigger<ScopeByName["unit_leader"]>;
  "showMajor"?: Trigger<ScopeByName["unit_leader"]>;
  "fireForSender"?: boolean;
  "meanTimeToHappen"?: NativeShape373;
  "immediate"?: readonly (Effect<ScopeByName["unit_leader"]>)[];
  "after"?: readonly (Effect<ScopeByName["unit_leader"]>)[];
  "option"?: readonly (NativeShape375)[];
}

interface NativeShape377 {
  "trigger": Trigger<ScopeByName["operative"]>;
  "text": string;
}

interface NativeShape378 {
  "add"?: number | string;
  "factor"?: number | string;
  "trigger"?: Trigger<ScopeByName["operative"]>;
}

interface NativeShape379 {
  "days"?: number;
  "months"?: number;
  "years"?: number;
  "modifier"?: NativeShape378;
}

interface NativeShape380 {
  "base"?: readonly (number | string)[];
  "factor"?: readonly (number | string)[];
  "modifier"?: NativeShape378;
}

interface NativeShape381 {
  "name"?: string | number | boolean;
  "trigger"?: Trigger<ScopeByName["operative"]>;
  "effects"?: Effect<ScopeByName["operative"]>;
  "aiChance"?: NativeShape380;
}

interface NativeOperativeEventBody {
  "title"?: readonly (string | number | boolean | NativeShape377)[];
  "desc"?: readonly (string | number | boolean | NativeShape377)[];
  "picture"?: string;
  "hidden"?: true | false;
  "major"?: true | false;
  "fireOnlyOnce"?: true | false;
  "isTriggeredOnly"?: true | false;
  "minorFlavor"?: true | false;
  "timeoutDays"?: number;
  "trigger"?: Trigger<ScopeByName["operative"]>;
  "showMajor"?: Trigger<ScopeByName["operative"]>;
  "fireForSender"?: boolean;
  "meanTimeToHappen"?: NativeShape379;
  "immediate"?: readonly (Effect<ScopeByName["operative"]>)[];
  "after"?: readonly (Effect<ScopeByName["operative"]>)[];
  "option"?: readonly (NativeShape381)[];
}

interface NativeShape383 {
  "x": number;
  "y": number;
}

interface NativeShape384 {
  "name": string;
  "target": string;
  "scrollWheelFactor"?: number;
  "trigger"?: Trigger<ScopeByName["country"]>;
}

interface NativeShape385 {
  "x": number;
  "y": number;
  "trigger": Trigger<ScopeByName["country"]>;
}

interface NativeShape386 {
  "id": string;
  "position": NativeShape383;
  "overridePosition"?: readonly (NativeShape385)[];
}

interface NativeShape387 {
  "x"?: number;
  "y"?: number;
  "trigger": Trigger<ScopeByName["country"]>;
}

interface NativeShape388 {
  "focus"?: string;
  "x"?: number;
  "y"?: number;
  "offset"?: readonly (NativeShape387)[];
}

interface NativeShape389 {
  "x"?: number;
  "y"?: number;
  "trigger"?: Trigger<ScopeByName["country"]>;
}

interface NativeShape390 {
  "focus"?: readonly (string)[];
}

interface NativeShape391 {
  "id": string;
  "icon": readonly (string | { readonly [key: string]: Trigger<ScopeByName["country"]> | true })[];
  "textIcon"?: string;
  "overlay"?: string;
  "alternateIcon"?: string;
  "cost": number;
  "x": number;
  "y": number;
  "offset"?: readonly (NativeShape389)[];
  "relativePositionId"?: string;
  "dynamic"?: true | false;
  "availableIfCapitulated"?: true | false;
  "cancelIfInvalid"?: false | true;
  "continueIfInvalid"?: true | false;
  "cancelable"?: false | true;
  "bypassIfUnavailable"?: true | false;
  "willLeadToWarWith"?: readonly (string)[];
  "prerequisite"?: readonly (NativeShape390)[];
  "mutuallyExclusive"?: readonly (NativeShape390)[];
  "bypass"?: Trigger<ScopeByName["country"]>;
  "bypassEffect"?: Effect<ScopeByName["country"]>;
  "enableAutomaticBypass"?: boolean;
  "allowBranch"?: Trigger<ScopeByName["country"]>;
  "available"?: Trigger<ScopeByName["country"]>;
  "cancel"?: Trigger<ScopeByName["country"]>;
  "historicalAi"?: Trigger<ScopeByName["country"]>;
  "selectEffect"?: Effect<ScopeByName["country"]>;
  "cancelEffect"?: Effect<ScopeByName["country"]>;
  "completeTooltip"?: Effect<ScopeByName["country"]>;
  "onUncomplete"?: Effect<ScopeByName["country"]>;
  "completionReward": Effect<ScopeByName["country"]>;
  "aiWillDo"?: NativeShape58;
  "searchFilters"?: readonly (string)[];
}

interface NativeShape392 {
  "id": string | number | boolean;
  "text": string;
  "icon": readonly (string | { readonly [key: string]: Trigger<ScopeByName["country"]> | true })[];
  "textIcon"?: string;
  "overlay"?: string;
  "alternateIcon"?: string;
  "cost": number;
  "x": number;
  "y": number;
  "offset"?: readonly (NativeShape389)[];
  "relativePositionId"?: string;
  "dynamic"?: true | false;
  "availableIfCapitulated"?: true | false;
  "cancelIfInvalid"?: false | true;
  "continueIfInvalid"?: true | false;
  "cancelable"?: false | true;
  "bypassIfUnavailable"?: true | false;
  "willLeadToWarWith"?: readonly (string)[];
  "prerequisite"?: readonly (NativeShape390)[];
  "mutuallyExclusive"?: readonly (NativeShape390)[];
  "bypass"?: Trigger<ScopeByName["country"]>;
  "bypassEffect"?: Effect<ScopeByName["country"]>;
  "enableAutomaticBypass"?: boolean;
  "allowBranch"?: Trigger<ScopeByName["country"]>;
  "available"?: Trigger<ScopeByName["country"]>;
  "cancel"?: Trigger<ScopeByName["country"]>;
  "historicalAi"?: Trigger<ScopeByName["country"]>;
  "selectEffect"?: Effect<ScopeByName["country"]>;
  "cancelEffect"?: Effect<ScopeByName["country"]>;
  "completeTooltip"?: Effect<ScopeByName["country"]>;
  "onUncomplete"?: Effect<ScopeByName["country"]>;
  "completionReward": Effect<ScopeByName["country"]>;
  "aiWillDo"?: NativeShape58;
  "searchFilters"?: readonly (string)[];
}

interface NativeFocusTreeBody {
  "country": NativeShape58;
  "default"?: boolean;
  "resetOnCivilwar"?: boolean;
  "sharedFocus"?: readonly (string)[];
  "continuousFocusPosition"?: NativeShape383;
  "shortcut"?: readonly (NativeShape384)[];
  "inlayWindow"?: readonly (NativeShape386)[];
  "initialShowPosition"?: NativeShape388;
  "alternateIconSet"?: string;
  "focus"?: readonly (NativeShape391 | NativeShape392)[];
}

interface NativeShape394 {
  "id": string;
  "icon": readonly (string | { readonly [key: string]: Trigger<ScopeByName["country"]> | true })[];
  "dailyCost": number;
  "availableIfCapitulated"?: true | false;
  "available"?: Trigger<ScopeByName["country"]>;
  "enable"?: Trigger<ScopeByName["country"]>;
  "supportsAiStrategy"?: string;
  "modifier"?: NativeShape12;
  "idea"?: string;
  "selectEffect"?: Effect<ScopeByName["country"]>;
  "cancelEffect"?: Effect<ScopeByName["country"]>;
  "aiWillDo"?: NativeShape58;
}

interface ContinuousFocusPaletteBody {
  "country": NativeShape58;
  "default"?: boolean;
  "resetOnCivilwar"?: boolean;
  "position"?: NativeShape383;
  "focus"?: readonly (NativeShape394)[];
}

interface SharedFocusBody {
  "text"?: string;
  "icon"?: readonly (string | { readonly [key: string]: Trigger<ScopeByName["country"]> | true })[];
  "overlay"?: string;
  "textIcon"?: string;
  "cost": number;
  "x": number;
  "y": number;
  "offset"?: readonly (NativeShape389)[];
  "relativePositionId"?: string;
  "dynamic"?: true | false;
  "availableIfCapitulated"?: true | false;
  "cancelIfInvalid"?: true | false;
  "continueIfInvalid"?: true | false;
  "cancelable"?: false | true;
  "bypassIfUnavailable"?: true | false;
  "willLeadToWarWith"?: readonly (string)[];
  "prerequisite"?: readonly (NativeShape390)[];
  "mutuallyExclusive"?: readonly (NativeShape390)[];
  "bypass"?: Trigger<ScopeByName["country"]>;
  "bypassEffect"?: Effect<ScopeByName["country"]>;
  "allowBranch"?: Trigger<ScopeByName["country"]>;
  "available"?: Trigger<ScopeByName["country"]>;
  "cancel"?: Trigger<ScopeByName["country"]>;
  "jointTrigger"?: Trigger<ScopeByName["country"]>;
  "completionRewardJointOriginator"?: Effect<ScopeByName["country"]>;
  "completionRewardJointMember"?: Effect<ScopeByName["country"]>;
  "completionReward"?: Effect<ScopeByName["country"]>;
  "historicalAi"?: Trigger<ScopeByName["country"]>;
  "selectEffect"?: Effect<ScopeByName["country"]>;
  "completeTooltip"?: Effect<ScopeByName["country"]>;
  "onUncomplete"?: Effect<ScopeByName["country"]>;
  "aiWillDo"?: NativeShape58;
  "searchFilters"?: readonly (string)[];
}

interface JointFocusBody {
  "text"?: string;
  "icon"?: readonly (string | { readonly [key: string]: Trigger<ScopeByName["country"]> | true })[];
  "overlay"?: string;
  "textIcon"?: string;
  "cost": number;
  "x": number;
  "y": number;
  "offset"?: readonly (NativeShape389)[];
  "relativePositionId"?: string;
  "dynamic"?: true | false;
  "availableIfCapitulated"?: true | false;
  "cancelIfInvalid"?: true | false;
  "continueIfInvalid"?: true | false;
  "cancelable"?: false | true;
  "bypassIfUnavailable"?: true | false;
  "willLeadToWarWith"?: readonly (string)[];
  "prerequisite"?: readonly (NativeShape390)[];
  "mutuallyExclusive"?: readonly (NativeShape390)[];
  "bypass"?: Trigger<ScopeByName["country"]>;
  "bypassEffect"?: Effect<ScopeByName["country"]>;
  "allowBranch"?: Trigger<ScopeByName["country"]>;
  "available"?: Trigger<ScopeByName["country"]>;
  "cancel"?: Trigger<ScopeByName["country"]>;
  "jointTrigger"?: Trigger<ScopeByName["country"]>;
  "completionRewardJointOriginator"?: Effect<ScopeByName["country"]>;
  "completionRewardJointMember"?: Effect<ScopeByName["country"]>;
  "completionReward"?: Effect<ScopeByName["country"]>;
  "historicalAi"?: Trigger<ScopeByName["country"]>;
  "selectEffect"?: Effect<ScopeByName["country"]>;
  "completeTooltip"?: Effect<ScopeByName["country"]>;
  "onUncomplete"?: Effect<ScopeByName["country"]>;
  "aiWillDo"?: NativeShape58;
  "searchFilters"?: readonly (string)[];
}

interface FocusStyleBody {
  "default"?: true | false;
  "unavailable": string;
  "completed": string;
  "available": string;
  "current": string;
}

interface NativeShape398 {
  "key": string | number | boolean;
  "trigger": Trigger<ScopeByName["country"]>;
}

interface NativeShape399 {
  "tag": string;
  "value": string | number | boolean;
  "desc": string;
  "visible": Trigger<ScopeByName["country"]>;
}

interface NativeShape400 {
  "state": readonly (string | number)[];
}

interface NativeShape401 {
  "highlightStatesTrigger"?: Trigger<ScopeByName["state"]>;
  "highlightStateTargets"?: NativeShape400;
  "highlightProvinces"?: readonly (number | string)[];
  "highlightOnlyProvinces"?: boolean;
  "highlightColorBeforeActive"?: "0..";
  "highlightColorWhileActive"?: "0..3";
}

interface NativeShape402 {
  "name": string;
  "zoom": number;
  "state"?: string;
  "targets"?: readonly (string)[];
  "targetArray"?: readonly (string)[];
  "targetTrigger"?: Trigger<ScopeByName["country"]>;
  "targetRootTrigger"?: Trigger<ScopeByName["country"]>;
}

interface NativeDecisionCategoryBody {
  "icon"?: readonly (string | number | boolean | NativeShape398)[];
  "picture"?: string | { readonly [key: string]: Trigger<ScopeByName["country"]> };
  "priority"?: number | NativeShape58;
  "visibleWhenEmpty"?: boolean;
  "available"?: Trigger<ScopeByName["country"]>;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "visible"?: Trigger<ScopeByName["country"]>;
  "cancelTrigger"?: Trigger<ScopeByName["country"]>;
  "customIcon"?: readonly (NativeShape399)[];
  "highlightStates"?: NativeShape401;
  "visibilityType"?: "map_only" | "decision_view_only" | "map_and_decisions_view" | "always";
  "onMapArea"?: readonly (NativeShape402)[];
  "scriptedGui"?: string;
}

interface NativeShape404 {
  "highlightStatesTrigger"?: Trigger<ScopeByName["state"]>;
  "highlightStateTargets"?: NativeShape400;
  "highlightProvinces"?: readonly (number | string)[];
  "highlightOnlyProvinces"?: boolean;
  "highlightColorBeforeActive"?: number;
  "highlightColorWhileActive"?: number;
}

interface NativeShape405 {
  "highlightStatesTrigger"?: Trigger<ScopeByName["state"]>;
  "highlightStateTargets"?: NativeShape400;
  "highlightOnlyProvinces"?: boolean;
  "highlightProvinces"?: readonly (number | string)[];
}

interface NativeShape406 {
  "values"?: readonly (string)[] | readonly (number | string)[];
  "state"?: readonly (string)[];
}

interface NativeDecisionBody {
  "icon"?: readonly (string | number | boolean | NativeShape398)[];
  "cosmeticTag"?: string;
  "cosmeticIdeology"?: string;
  "priority"?: number | NativeShape58;
  "name"?: string;
  "desc"?: string;
  "fireOnlyOnce"?: boolean;
  "aiHintPpCost"?: number;
  "stateTarget"?: false | true | string | "any_owned_state" | "any_controlled_state";
  "available"?: Trigger<ScopeByName["country"]>;
  "visible"?: Trigger<ScopeByName["country"]>;
  "completeEffect"?: Effect<ScopeByName["country"]>;
  "cancelTrigger"?: Trigger<ScopeByName["country"]>;
  "removeEffect"?: Effect<ScopeByName["country"]>;
  "cancelEffect"?: Effect<ScopeByName["country"]>;
  "aiWillDo"?: NativeShape116;
  "targetNonExisting"?: boolean;
  "cancelIfNotVisible"?: boolean;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "cost"?: number | string;
  "customCostTrigger"?: Trigger<ScopeByName["country"]>;
  "customCostText"?: string;
  "highlightStates"?: NativeShape404 | NativeShape405;
  "highlightColorBeforeActive"?: number;
  "highlightColorWhileActive"?: number;
  "removeTrigger"?: Trigger<ScopeByName["country"]>;
  "daysRemove"?: number | string;
  "targetedModifier"?: NativeShape269;
  "modifier"?: NativeShape12;
  "activation"?: Trigger<ScopeByName["country"]>;
  "isGood"?: boolean;
  "daysMissionTimeout"?: number | string;
  "timeoutEffect"?: Effect<ScopeByName["country"]>;
  "selectableMission"?: boolean;
  "targetTrigger"?: Trigger<ScopeByName["country"]>;
  "targets"?: readonly (string | number)[] | NativeShape406;
  "targetsDynamic"?: boolean;
  "targetRootTrigger"?: Trigger<ScopeByName["country"]>;
  "targetArray"?: readonly (string)[];
  "warWithOnRemove"?: string;
  "warWithOnComplete"?: string;
  "warWithOnTimeout"?: string;
  "warWithTargetOnRemove"?: boolean;
  "warWithTargetOnComplete"?: boolean;
  "warWithTargetOnTimeout"?: boolean;
  "daysReEnable"?: number | string;
  "fixedRandomSeed"?: boolean;
  "onMapMode"?: "map_only" | "decision_view_only" | "map_and_decisions_view" | "always";
}

interface NativeShape408 {
  "canBeCalledToWar"?: boolean;
  "canBeSpymaster"?: boolean;
  "canBoostOtherIdeologies"?: boolean;
  "canCreateCollaborationGovernment"?: boolean;
  "canCreateFactions"?: boolean;
  "canDeclareWarOnSameIdeology"?: boolean;
  "canDeclareWarWithoutWargoalWhenInWar"?: boolean;
  "canDeclineCallToWar"?: boolean;
  "canForceGovernment"?: boolean;
  "canGenerateFemaleAces"?: boolean;
  "canGuaranteeOtherIdeologies"?: boolean;
  "canJoinFactions"?: boolean;
  "canJoinFactionsNotAllowedDiplomacy"?: boolean;
  "canJoinOppositeFactions"?: boolean;
  "canLowerTension"?: boolean;
  "canNotDeclareWar"?: boolean;
  "canOccupyNonWar"?: boolean;
  "canOnlyJustifyWarOnThreatCountry"?: boolean;
  "canPuppet"?: boolean;
  "canSendVolunteers"?: boolean;
  "canUseKamikazePilots"?: boolean;
  "contributesOperatives"?: boolean;
  "unitsDeployedToOverlord"?: boolean;
  "canBoostOwnIdeology"?: boolean;
  "canGenerateFemaleUnitLeaders"?: boolean;
  "canGenerateFemaleCountryLeaders"?: boolean;
  "canAccessMarket"?: boolean;
  "canUseUnderwayReplenishment"?: boolean;
  "desc"?: string | number | boolean;
}

interface NativeShape409 {
  "name"?: string;
  "cancelIfInvalid"?: false | true;
  "visible"?: Trigger<ScopeByName["country"]>;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "cancel"?: Trigger<ScopeByName["country"]>;
  "available"?: Trigger<ScopeByName["country"]>;
  "allowedCivilWar"?: Trigger<ScopeByName["country"]>;
  "picture"?: string | number | boolean;
  "cost"?: number;
  "removalCost"?: number;
  "modifier"?: NativeShape12;
  "targetedModifier"?: NativeShape269;
  "rule"?: NativeShape408;
  "researchBonus"?: { readonly [key: string]: number };
  "equipmentBonus"?: { readonly [key: string]: NativeShape245 };
  "traits"?: readonly (string)[];
  "onAdd"?: readonly (Effect<ScopeByName["country"]>)[];
  "onRemove"?: readonly (Effect<ScopeByName["country"]>)[];
  "doEffect"?: Trigger<ScopeByName["country"]>;
  "aiWillDo"?: NativeShape58;
}

interface NativeShape410 {
  "name"?: string;
  "level"?: number;
  "default"?: boolean;
  "cancelIfInvalid"?: false | true;
  "cancel"?: Trigger<ScopeByName["country"]>;
  "visible"?: Trigger<ScopeByName["country"]>;
  "allowed"?: Trigger<ScopeByName["country"]>;
  "available"?: Trigger<ScopeByName["country"]>;
  "allowedCivilWar"?: Trigger<ScopeByName["country"]>;
  "allowedToRemove"?: Trigger<ScopeByName["country"]>;
  "picture"?: string | number | boolean;
  "cost"?: number;
  "removalCost"?: number;
  "modifier"?: NativeShape12;
  "targetedModifier"?: NativeShape269;
  "rule"?: NativeShape408;
  "equipmentBonus"?: { readonly [key: string]: NativeShape245 };
  "aiWillDo"?: NativeShape58;
  "traits"?: readonly (string)[];
  "onAdd"?: readonly (Effect<ScopeByName["country"]>)[];
  "onRemove"?: readonly (Effect<ScopeByName["country"]>)[];
  "doEffect"?: Trigger<ScopeByName["country"]>;
  "researchBonus"?: { readonly [key: string]: number };
  "ledger"?: "army" | "navy" | "air" | "military" | "invalid" | "civilian" | "hidden" | "all";
}

interface NativeShape411 {
  "law"?: boolean;
  "useListView"?: boolean;
  "designer"?: boolean;
  "entries": { readonly [key: string]: NativeShape410 };
}

type NativeShape412 = { readonly [key: string]: never };

interface NativeIdeasBody {
  "entries": { readonly [key: string]: { readonly [key: string]: NativeShape409 } | NativeShape411 | NativeShape412 };
}

interface NativeShape413 {
  "randomEvents"?: { readonly [key: string]: 0 | string };
  "effect"?: readonly (Effect<ScopeByName["any"]>)[];
}

interface NativeShape414 {
  "randomEvents"?: readonly ({ readonly [key: string]: 0 | string })[];
  "effect"?: readonly (Effect<ScopeByName["country"]>)[];
}

interface NativeShape415 {
  "randomEvents"?: readonly ({ readonly [key: string]: 0 | string })[];
  "effect"?: readonly (Effect<ScopeByName["state"]>)[];
}

interface NativeShape416 {
  "effect"?: readonly (Effect<ScopeByName["country"]>)[];
}

interface NativeShape417 {
  "randomEvents"?: { readonly [key: string]: 0 | string };
  "effect"?: readonly (Effect<ScopeByName["unit_leader"]>)[];
}

interface NativeShape418 {
  "effect"?: readonly (Effect<ScopeByName["state"]>)[];
}

interface NativeShape419 {
  "randomEvents"?: { readonly [key: string]: 0 | string };
  "effect"?: readonly (Effect<ScopeByName["operation"]>)[];
}

interface NativeShape420 {
  "randomEvents"?: { readonly [key: string]: 0 | string };
  "effect"?: readonly (Effect<ScopeByName["operative"]>)[];
}

interface NativeShape421 {
  "effect"?: readonly (Effect<ScopeByName["military_industrial_organization"]>)[];
}

interface NativeShape422 {
  "effect"?: readonly (Effect<ScopeByName["any"]>)[];
}

interface NativeCountry {
  "graphicalCulture": string;
  "graphicalCulture2d"?: string;
  "color": readonly (number)[];
  "useLegacyAiPpSpend"?: boolean;
}

interface NativeShape423 {
  "x"?: number | string;
  "y"?: number | string;
}

interface NativeShape424 {
  "width"?: number | number | string;
  "height"?: number | number | string;
}

interface NativeShape425 {
  "width"?: number | number | string;
  "height"?: number | number | string;
  "min"?: NativeShape424;
  "max"?: NativeShape424;
  "preserveAspectRatio"?: boolean;
}

interface NativeShape426 {
  "top"?: number;
  "bottom"?: number;
  "left"?: number;
  "right"?: number;
}

interface NativeShape427 {
  "x"?: number;
  "y"?: number;
  "relative"?: boolean;
  "below"?: boolean;
}

interface NativeShape428 {
  "name"?: string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "spriteType"?: string | "GFX_power_balance_left" | "GFX_power_balance_right";
  "quadTextureSprite"?: string | "GFX_bop_glow_effect";
  "alwaystransparent"?: boolean;
  "frame"?: number;
  "centerposition"?: boolean;
  "upsound"?: string;
  "downsound"?: string;
  "showSound"?: string;
  "hideSound"?: string;
  "clicksound"?: string;
  "oversound"?: string;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
}

interface NativeShape429 {
  "x": number | number | string;
  "y": number | number | string;
}

export interface NativeContainerProps {
  "name": string;
  "moveable"?: boolean;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "clipping"?: boolean;
  "fullscreen"?: boolean;
  "background"?: readonly (NativeShape428)[];
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "showPosition"?: NativeShape429;
  "hidePosition"?: NativeShape429;
  "closedPosition"?: NativeShape429;
  "openPosition"?: NativeShape429;
  "peekPosition"?: NativeShape429;
  "peekCheckTopLeft"?: NativeShape429;
  "peekCheckSize"?: NativeShape425;
  "showAnimationType"?: "decelerated" | "accelerated" | "linear";
  "hideAnimationType"?: "decelerated" | "accelerated" | "linear";
  "animationType"?: "decelerated" | "accelerated" | "linear";
  "animationTime"?: number;
  "fadeTime"?: number;
  "fadeType"?: "linear" | "accelerated";
  "fadeDelay"?: number;
  "upsound"?: string;
  "downsound"?: string;
  "showSound"?: string;
  "hideSound"?: string;
  "clicksound"?: string;
  "oversound"?: string;
  "verticalScrollbar"?: string;
  "horizontalScrollbar"?: string;
  "autohideScrollbars"?: boolean;
  "dragScroll"?: readonly ("left" | "middle" | "right")[];
  "clickToFront"?: boolean;
  "smoothScrolling"?: boolean | number;
  "scrollWheelFactor"?: number;
}

interface NativeShape431 {
  "name": string;
  "size"?: NativeShape423 | NativeShape425;
  "position"?: NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "spriteType"?: string | "GFX_power_balance_left" | "GFX_power_balance_right";
  "quadTextureSprite"?: string | "GFX_bop_glow_effect";
  "alwaystransparent"?: boolean;
  "frame"?: number;
  "centerposition"?: boolean;
  "buttonText"?: string;
  "buttonFont"?: string;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
  "shortcut"?: readonly (string | number | boolean)[];
  "hintTag"?: string;
  "upsound"?: string;
  "downsound"?: string;
  "showSound"?: string;
  "hideSound"?: string;
  "clicksound"?: string;
  "oversound"?: string;
  "format"?: "left" | "center" | "centre" | "right" | "down";
  "multiline"?: boolean;
  "font"?: string;
  "webLink"?: string | number | boolean;
}

interface NativeShape432 {
  "name": string;
  "size"?: NativeShape423 | NativeShape425;
  "borderSize"?: NativeShape423;
  "position"?: NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "spriteType"?: string | "GFX_power_balance_left" | "GFX_power_balance_right";
  "quadTextureSprite"?: string | "GFX_bop_glow_effect";
  "alwaystransparent"?: boolean;
  "frame"?: number;
  "centerposition"?: boolean;
  "buttonText"?: string;
  "buttonFont"?: string;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
  "shortcut"?: readonly (string | number | boolean)[];
  "hintTag"?: string;
  "upsound"?: string;
  "downsound"?: string;
  "showSound"?: string;
  "hideSound"?: string;
  "clicksound"?: string;
  "oversound"?: string;
  "format"?: "left" | "center" | "centre" | "right" | "down";
  "multiline"?: boolean;
  "font"?: string;
  "webLink"?: string | number | boolean;
  "noClicksound"?: boolean;
}

interface NativeShape433 {
  "name": string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "spacing"?: number;
  "format"?: "left" | "center" | "centre" | "right" | "down";
  "firstOnTop"?: boolean;
}

interface NativeShape434 {
  "name": string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "slotsize"?: NativeShape425;
  "addHorizontal"?: boolean;
  "maxSlotsHorizontal"?: number;
  "maxSlotsVertical"?: number;
  "maxSlots"?: NativeShape383;
  "padding"?: NativeShape426;
  "format"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "background"?: NativeShape428;
}

interface NativeShape435 {
  "name": string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "horizontal"?: number;
  "spacing"?: number;
  "alwaystransparent"?: boolean;
  "scrollbartype"?: string;
  "borderSize"?: NativeShape423;
  "offset"?: NativeShape383;
  "backGround"?: string;
}

interface NativeShape436 {
  "name": string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "horizontal"?: number;
  "spacing"?: number;
  "alwaystransparent"?: boolean;
  "scrollbartype"?: string;
  "borderSize"?: NativeShape423;
  "offset"?: NativeShape383;
  "clipping"?: boolean;
  "priority"?: number;
}

interface NativeShape437 {
  "name": string;
  "entries"?: { readonly [key: string]: CwtNode };
  "spriteType"?: string | "GFX_power_balance_left" | "GFX_power_balance_right";
  "quadTextureSprite"?: string | "GFX_bop_glow_effect";
  "alwaystransparent"?: boolean;
  "frame"?: number;
  "centerposition"?: boolean;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
}

interface NativeShape438 {
  "name": string;
  "position": NativeShape423;
  "scale"?: number;
}

interface NativeShape439 {
  "name": string;
  "font"?: string;
  "maxWidth"?: number | number | string;
  "maxHeight"?: number | number | string;
  "format"?: readonly ("left" | "center" | "centre" | "right" | "down")[];
  "multiline"?: boolean;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
  "alwaystransparent"?: boolean;
  "borderSize"?: NativeShape423;
  "textureFile"?: string;
  "verticalAlignment"?: "top" | "center" | "centre" | "bottom";
  "scrollbartype"?: string;
  "fixedsize"?: boolean;
  "textColorCode"?: string | number | boolean;
  "truncate"?: boolean;
}

interface NativeShape440 {
  "name": string;
  "text"?: string;
  "font"?: string;
  "maxWidth"?: number;
  "maxHeight"?: number;
  "format"?: readonly ("left" | "center" | "centre" | "right" | "down")[];
  "onlyNumbers"?: boolean;
  "multiline"?: boolean;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
  "alwaystransparent"?: boolean;
  "borderSize"?: NativeShape423;
  "textureFile"?: string;
  "verticalAlignment"?: "top" | "center" | "centre" | "bottom";
  "scrollbartype"?: string;
  "fixedsize"?: boolean;
  "textColorCode"?: string | number | boolean;
  "truncate"?: boolean;
  "instantTextBoxType"?: boolean;
  "useSpecialChars"?: boolean;
  "cursor"?: NativeShape383;
  "isMultiline"?: boolean;
  "ignoreEnter"?: boolean;
}

interface NativeShape441 {
  "name": string;
  "buttonText"?: string;
  "buttonFont"?: string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "spriteType"?: string | "GFX_power_balance_left" | "GFX_power_balance_right";
  "quadTextureSprite"?: string | "GFX_bop_glow_effect";
  "alwaystransparent"?: boolean;
  "frame"?: number;
  "centerposition"?: boolean;
  "upsound"?: string;
  "downsound"?: string;
  "showSound"?: string;
  "hideSound"?: string;
  "clicksound"?: string;
  "oversound"?: string;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
}

interface NativeShape442 {
  "name": string;
  "quadTextureSprite": string;
  "position": NativeShape423;
  "clicksound"?: string | "click";
  "parent"?: string;
}

interface NativeShape443 {
  "name": string;
  "slider": string | number | boolean;
  "track": string | number | boolean;
  "leftbutton": string | number | boolean;
  "rightbutton": string | number | boolean;
  "size": NativeShape423;
  "position": NativeShape423;
  "priority": number;
  "borderSize": NativeShape423;
  "maxValue": number;
  "minValue": number;
  "stepSize": number;
  "startValue": number;
  "horizontal": number;
  "guiButtonType": readonly (NativeShape442)[];
}

interface NativeShape444 {
  "name": string;
  "spriteType"?: string | "GFX_power_balance_left" | "GFX_power_balance_right";
  "quadTextureSprite"?: string | "GFX_bop_glow_effect";
  "alwaystransparent"?: boolean;
  "frame"?: number;
  "centerposition"?: boolean;
  "position": NativeShape423;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
}

interface NativeShape445 {
  "name": string;
  "spriteType"?: string | "GFX_power_balance_left" | "GFX_power_balance_right";
  "quadTextureSprite"?: string | "GFX_bop_glow_effect";
  "alwaystransparent"?: boolean;
  "frame"?: number;
  "centerposition"?: boolean;
  "upsound"?: string;
  "downsound"?: string;
  "showSound"?: string;
  "hideSound"?: string;
  "clicksound"?: string;
  "oversound"?: string;
  "position": NativeShape423;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
}

interface NativeShape446 {
  "name": string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "background"?: NativeShape428;
  "tileSize"?: NativeShape425;
  "maxValue"?: number;
  "minValue"?: number;
  "startValue"?: number;
  "stepSize"?: number;
  "horizontal"?: boolean;
  "smoothScrolling"?: boolean | number;
  "clickonly"?: boolean;
  "setTrackFrameOnChange"?: boolean;
  "slider"?: NativeShape444;
  "track": NativeShape444;
  "increaseButton"?: NativeShape445;
  "decreaseButton"?: NativeShape445;
}

interface NativeShape447 {
  "name": string;
  "moveable"?: boolean;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "clipping"?: boolean;
  "fullscreen"?: boolean;
  "switchFrameOnExpand"?: boolean;
  "expandedOnTop"?: boolean;
  "background"?: readonly (NativeShape428)[];
  "containerWindowType"?: CwtNode;
  "dropDownBoxType"?: CwtNode;
  "buttonType"?: NativeShape432;
  "OverlappingElementsBoxType"?: NativeShape433;
  "gridBoxType"?: NativeShape434;
  "listBoxType"?: NativeShape435;
  "smoothListBoxType"?: NativeShape436;
  "iconType"?: NativeShape437;
  "positionType"?: NativeShape438;
  "browserType"?: NativeShape437;
  "instantTextBoxType"?: NativeShape439;
  "editBoxType"?: NativeShape440;
  "checkboxType"?: NativeShape441;
  "scrollbarType"?: NativeShape443;
  "extendedScrollbarType"?: NativeShape446;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "showPosition"?: NativeShape429;
  "hidePosition"?: NativeShape429;
  "closedPosition"?: NativeShape429;
  "openPosition"?: NativeShape429;
  "peekPosition"?: NativeShape429;
  "peekCheckTopLeft"?: NativeShape429;
  "peekCheckSize"?: NativeShape425;
  "showAnimationType"?: "decelerated" | "accelerated" | "linear";
  "hideAnimationType"?: "decelerated" | "accelerated" | "linear";
  "animationType"?: "decelerated" | "accelerated" | "linear";
  "animationTime"?: number;
  "fadeTime"?: number;
  "fadeType"?: "linear" | "accelerated";
  "fadeDelay"?: number;
  "upsound"?: string;
  "downsound"?: string;
  "showSound"?: string;
  "hideSound"?: string;
  "clicksound"?: string;
  "oversound"?: string;
  "verticalScrollbar"?: string;
  "horizontalScrollbar"?: string;
  "autohideScrollbars"?: boolean;
  "dragScroll"?: readonly ("left" | "middle" | "right")[];
  "clickToFront"?: boolean;
  "smoothScrolling"?: boolean | number;
  "scrollWheelFactor"?: number;
  "expandButton"?: NativeShape431;
  "expandedWindow"?: CwtNode;
}

interface NativeShape448 {
  "name": string;
  "moveable"?: boolean;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "clipping"?: boolean;
  "fullscreen"?: boolean;
  "background"?: readonly (NativeShape428)[];
  "containerWindowType"?: CwtNode;
  "dropDownBoxType"?: NativeShape447;
  "buttonType"?: NativeShape432;
  "OverlappingElementsBoxType"?: NativeShape433;
  "gridBoxType"?: NativeShape434;
  "listBoxType"?: NativeShape435;
  "smoothListBoxType"?: NativeShape436;
  "iconType"?: NativeShape437;
  "positionType"?: NativeShape438;
  "browserType"?: NativeShape437;
  "instantTextBoxType"?: NativeShape439;
  "editBoxType"?: NativeShape440;
  "checkboxType"?: NativeShape441;
  "scrollbarType"?: NativeShape443;
  "extendedScrollbarType"?: NativeShape446;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "showPosition"?: NativeShape429;
  "hidePosition"?: NativeShape429;
  "closedPosition"?: NativeShape429;
  "openPosition"?: NativeShape429;
  "peekPosition"?: NativeShape429;
  "peekCheckTopLeft"?: NativeShape429;
  "peekCheckSize"?: NativeShape425;
  "showAnimationType"?: "decelerated" | "accelerated" | "linear";
  "hideAnimationType"?: "decelerated" | "accelerated" | "linear";
  "animationType"?: "decelerated" | "accelerated" | "linear";
  "animationTime"?: number;
  "fadeTime"?: number;
  "fadeType"?: "linear" | "accelerated";
  "fadeDelay"?: number;
  "upsound"?: string;
  "downsound"?: string;
  "showSound"?: string;
  "hideSound"?: string;
  "clicksound"?: string;
  "oversound"?: string;
  "verticalScrollbar"?: string;
  "horizontalScrollbar"?: string;
  "autohideScrollbars"?: boolean;
  "dragScroll"?: readonly ("left" | "middle" | "right")[];
  "clickToFront"?: boolean;
  "smoothScrolling"?: boolean | number;
  "scrollWheelFactor"?: number;
}

interface NativeShape449 {
  "name": string;
  "moveable"?: boolean;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "clipping"?: boolean;
  "fullscreen"?: boolean;
  "background"?: readonly (NativeShape428)[];
  "containerWindowType"?: NativeShape448;
  "dropDownBoxType"?: NativeShape447;
  "buttonType"?: NativeShape432;
  "OverlappingElementsBoxType"?: NativeShape433;
  "gridBoxType"?: NativeShape434;
  "listBoxType"?: NativeShape435;
  "smoothListBoxType"?: NativeShape436;
  "iconType"?: NativeShape437;
  "positionType"?: NativeShape438;
  "browserType"?: NativeShape437;
  "instantTextBoxType"?: NativeShape439;
  "editBoxType"?: NativeShape440;
  "checkboxType"?: NativeShape441;
  "scrollbarType"?: NativeShape443;
  "extendedScrollbarType"?: NativeShape446;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "showPosition"?: NativeShape429;
  "hidePosition"?: NativeShape429;
  "closedPosition"?: NativeShape429;
  "openPosition"?: NativeShape429;
  "peekPosition"?: NativeShape429;
  "peekCheckTopLeft"?: NativeShape429;
  "peekCheckSize"?: NativeShape425;
  "showAnimationType"?: "decelerated" | "accelerated" | "linear";
  "hideAnimationType"?: "decelerated" | "accelerated" | "linear";
  "animationType"?: "decelerated" | "accelerated" | "linear";
  "animationTime"?: number;
  "fadeTime"?: number;
  "fadeType"?: "linear" | "accelerated";
  "fadeDelay"?: number;
  "upsound"?: string;
  "downsound"?: string;
  "showSound"?: string;
  "hideSound"?: string;
  "clicksound"?: string;
  "oversound"?: string;
  "verticalScrollbar"?: string;
  "horizontalScrollbar"?: string;
  "autohideScrollbars"?: boolean;
  "dragScroll"?: readonly ("left" | "middle" | "right")[];
  "clickToFront"?: boolean;
  "smoothScrolling"?: boolean | number;
  "scrollWheelFactor"?: number;
}

export interface DropDownBoxProps {
  "name": string;
  "moveable"?: boolean;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "clipping"?: boolean;
  "fullscreen"?: boolean;
  "switchFrameOnExpand"?: boolean;
  "expandedOnTop"?: boolean;
  "background"?: readonly (NativeShape428)[];
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "showPosition"?: NativeShape429;
  "hidePosition"?: NativeShape429;
  "closedPosition"?: NativeShape429;
  "openPosition"?: NativeShape429;
  "peekPosition"?: NativeShape429;
  "peekCheckTopLeft"?: NativeShape429;
  "peekCheckSize"?: NativeShape425;
  "showAnimationType"?: "decelerated" | "accelerated" | "linear";
  "hideAnimationType"?: "decelerated" | "accelerated" | "linear";
  "animationType"?: "decelerated" | "accelerated" | "linear";
  "animationTime"?: number;
  "fadeTime"?: number;
  "fadeType"?: "linear" | "accelerated";
  "fadeDelay"?: number;
  "upsound"?: string;
  "downsound"?: string;
  "showSound"?: string;
  "hideSound"?: string;
  "clicksound"?: string;
  "oversound"?: string;
  "verticalScrollbar"?: string;
  "horizontalScrollbar"?: string;
  "autohideScrollbars"?: boolean;
  "dragScroll"?: readonly ("left" | "middle" | "right")[];
  "clickToFront"?: boolean;
  "smoothScrolling"?: boolean | number;
  "scrollWheelFactor"?: number;
  "expandButton"?: NativeShape431;
  "expandedWindow"?: NativeShape449;
}

export interface NativeButtonProps {
  "name": string;
  "size"?: NativeShape423;
  "borderSize"?: NativeShape423;
  "position"?: NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "spriteType"?: string | "GFX_power_balance_left" | "GFX_power_balance_right";
  "quadTextureSprite"?: string | "GFX_bop_glow_effect";
  "alwaystransparent"?: boolean;
  "frame"?: number;
  "centerposition"?: boolean;
  "buttonText"?: string;
  "buttonFont"?: string;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
  "shortcut"?: readonly (string | number | boolean)[];
  "hintTag"?: string;
  "upsound"?: string;
  "downsound"?: string;
  "showSound"?: string;
  "hideSound"?: string;
  "clicksound"?: string;
  "oversound"?: string;
  "format"?: "left" | "center" | "centre" | "right" | "down";
  "multiline"?: boolean;
  "font"?: string;
  "webLink"?: string | number | boolean;
  "noClicksound"?: boolean;
}

export interface OverlappingElementsBoxProps {
  "name": string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "spacing"?: number;
  "format"?: "left" | "center" | "centre" | "right" | "down";
  "firstOnTop"?: boolean;
}

export interface NativeGridBoxProps {
  "name": string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "slotsize"?: NativeShape425;
  "addHorizontal"?: boolean;
  "maxSlotsHorizontal"?: number;
  "maxSlotsVertical"?: number;
  "maxSlots"?: NativeShape383;
  "padding"?: NativeShape426;
  "format"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "background"?: NativeShape428;
}

export interface NativeListBoxProps {
  "name": string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "horizontal"?: number;
  "spacing"?: number;
  "alwaystransparent"?: boolean;
  "scrollbartype"?: string;
  "borderSize"?: NativeShape423;
  "offset"?: NativeShape383;
  "backGround"?: string;
}

export interface SmoothListBoxProps {
  "name": string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "horizontal"?: number;
  "spacing"?: number;
  "alwaystransparent"?: boolean;
  "scrollbartype"?: string;
  "borderSize"?: NativeShape423;
  "offset"?: NativeShape383;
  "clipping"?: boolean;
  "priority"?: number;
}

export interface NativeIconProps {
  "name": string;
  "entries"?: { readonly [key: string]: CwtNode };
  "spriteType"?: string | "GFX_power_balance_left" | "GFX_power_balance_right";
  "quadTextureSprite"?: string | "GFX_bop_glow_effect";
  "alwaystransparent"?: boolean;
  "frame"?: number;
  "centerposition"?: boolean;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
}

export interface PositionProps {
  "name": string;
  "position": NativeShape423;
  "scale"?: number;
}

export interface BrowserProps {
  "name": string;
  "entries"?: { readonly [key: string]: CwtNode };
  "spriteType"?: string | "GFX_power_balance_left" | "GFX_power_balance_right";
  "quadTextureSprite"?: string | "GFX_bop_glow_effect";
  "alwaystransparent"?: boolean;
  "frame"?: number;
  "centerposition"?: boolean;
  "position"?: NativeShape423;
  "size"?: NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
}

export interface NativeTextProps {
  "name": string;
  "font"?: string;
  "maxWidth"?: number | number | string;
  "maxHeight"?: number | number | string;
  "format"?: readonly ("left" | "center" | "centre" | "right" | "down")[];
  "multiline"?: boolean;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
  "alwaystransparent"?: boolean;
  "borderSize"?: NativeShape423;
  "textureFile"?: string;
  "verticalAlignment"?: "top" | "center" | "centre" | "bottom";
  "scrollbartype"?: string;
  "fixedsize"?: boolean;
  "textColorCode"?: string | number | boolean;
  "truncate"?: boolean;
}

export interface EditBoxProps {
  "name": string;
  "text"?: string;
  "font"?: string;
  "maxWidth"?: number;
  "maxHeight"?: number;
  "format"?: readonly ("left" | "center" | "centre" | "right" | "down")[];
  "onlyNumbers"?: boolean;
  "multiline"?: boolean;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
  "alwaystransparent"?: boolean;
  "borderSize"?: NativeShape423;
  "textureFile"?: string;
  "verticalAlignment"?: "top" | "center" | "centre" | "bottom";
  "scrollbartype"?: string;
  "fixedsize"?: boolean;
  "textColorCode"?: string | number | boolean;
  "truncate"?: boolean;
  "instantTextBoxType"?: boolean;
  "useSpecialChars"?: boolean;
  "cursor"?: NativeShape383;
  "isMultiline"?: boolean;
  "ignoreEnter"?: boolean;
}

export interface CheckboxProps {
  "name": string;
  "buttonText"?: string;
  "buttonFont"?: string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "spriteType"?: string | "GFX_power_balance_left" | "GFX_power_balance_right";
  "quadTextureSprite"?: string | "GFX_bop_glow_effect";
  "alwaystransparent"?: boolean;
  "frame"?: number;
  "centerposition"?: boolean;
  "upsound"?: string;
  "downsound"?: string;
  "showSound"?: string;
  "hideSound"?: string;
  "clicksound"?: string;
  "oversound"?: string;
  "pdxTooltip"?: string;
  "pdxTooltipDelayed"?: string;
  "pdxTooltipAnchor"?: NativeShape427;
  "tooltip"?: string;
  "text"?: string;
  "pdxDisabledTooltip"?: string;
  "pdxDisabledTooltipDelayed"?: string;
  "boundTooltip"?: NativeShape73;
  "contextAwareTooltip"?: string | NativeShape73;
  "tooltipText"?: string;
  "delayedTooltipText"?: string;
  "contextAwareText"?: string | NativeShape73;
}

export interface ScrollbarProps {
  "name": string;
  "slider": string | number | boolean;
  "track": string | number | boolean;
  "leftbutton": string | number | boolean;
  "rightbutton": string | number | boolean;
  "size": NativeShape423;
  "position": NativeShape423;
  "priority": number;
  "borderSize": NativeShape423;
  "maxValue": number;
  "minValue": number;
  "stepSize": number;
  "startValue": number;
  "horizontal": number;
  "guiButtonType": readonly (NativeShape442)[];
}

export interface ExtendedScrollbarProps {
  "name": string;
  "position"?: NativeShape423;
  "size"?: NativeShape425 | NativeShape423;
  "margin"?: NativeShape426;
  "backgroundMargin"?: NativeShape426;
  "scale"?: number;
  "rotation"?: number;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "origo"?: "center" | "center_up" | "center_down" | "center_left" | "center_right" | "lower_left" | "lower_right" | "upper_right" | "upper_left" | "right" | "left";
  "hide"?: boolean;
  "verticalScrollStep"?: number;
  "background"?: NativeShape428;
  "tileSize"?: NativeShape425;
  "maxValue"?: number;
  "minValue"?: number;
  "startValue"?: number;
  "stepSize"?: number;
  "horizontal"?: boolean;
  "smoothScrolling"?: boolean | number;
  "clickonly"?: boolean;
  "setTrackFrameOnChange"?: boolean;
  "slider"?: NativeShape444;
  "track": NativeShape444;
  "increaseButton"?: NativeShape445;
  "decreaseButton"?: NativeShape445;
}

export interface WindowProps {
  "name": string;
  "backGround"?: string;
  "position"?: NativeShape423;
  "size"?: NativeShape423;
  "moveable"?: number;
  "dontRender"?: string;
  "horizontalBorder"?: string | number;
  "verticalBorder"?: string;
  "fullscreen"?: boolean;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "showPosition"?: NativeShape423;
  "hidePosition"?: NativeShape423;
  "animationTime"?: number;
}

export interface TextBoxProps {
  "position"?: NativeShape423;
  "name": string;
  "textureFile"?: string;
  "borderSize"?: NativeShape423;
  "font"?: string;
  "text"?: string | number;
  "maxWidth"?: number;
  "maxHeight"?: number;
}

export interface GuiButtonProps {
  "name": string;
  "quadTextureSprite"?: string;
  "position"?: NativeShape423;
  "clicksound"?: string;
  "orientation"?: "CENTER" | "CENTER_LEFT" | "CENTER_RIGHT" | "UPPER_LEFT" | "LOWER_LEFT" | "UPPER_RIGHT" | "LOWER_RIGHT" | "RIGHT" | "LEFT" | "CENTER_UP" | "CENTER_DOWN" | "CENTER_LOWER" | "UP" | "DOWN";
  "buttonText"?: string | number;
  "buttonFont"?: string;
  "size"?: NativeShape423;
  "noClicksound"?: boolean;
  "parent"?: string;
  "hintTag"?: string;
  "format"?: "left" | "center" | "centre" | "right" | "down";
  "shortcut"?: string | number;
  "frame"?: number;
  "scale"?: number;
  "alwaystransparent"?: boolean;
  "pdxTooltip"?: string;
  "oversound"?: string;
  "pdxTooltipDelayed"?: string;
}
