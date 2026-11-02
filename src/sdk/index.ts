/**
 * Compile-time HOI4 SDK. These declarations have no JavaScript implementation.
 * Krieg resolves their symbols through the TypeScript checker and lowers calls
 * directly to game script. Import them only from .krg.ts modules.
 */
import type {
  GeneratedCountryEffects,
  GeneratedStateEffects,
  GeneratedCharacterEffects,
  GeneratedUnitLeaderEffects,
  GeneratedAnyEffects,
  GeneratedCountryTriggers,
  GeneratedStateTriggers,
  GeneratedCharacterTriggers,
  GeneratedUnitLeaderTriggers,
  GeneratedAnyTriggers,
  GeneratedEffectsByScope,
  GeneratedTriggersByScope,
} from "./commands.js";
import type { PdxDocument, PdxItem } from "../pdx/ast.js";
export * from "./domains.js";
export * from "./defines.js";

export interface CountryRef {
  readonly kind: "country";
  readonly tag: string;
}
export interface StateRef {
  readonly kind: "state";
  readonly id: number;
}
export type Country = CountryRef;
export type State = StateRef;
export type LocalisationKey = string;
export type IdeaId = string;
export type FocusId = string;
export type EventId = string;
export type FlagId = string;
export type AssetId = string;
export type VariableName = string;
export type ScopeName = keyof GeneratedEffectsByScope;
/** Deliberately opaque for CWT expressions which cannot be represented safely. */
export interface CwtOpaque {
  readonly __cwtOpaque: unique symbol;
}
export interface CwtNode {
  readonly kind: "cwt";
  readonly items: readonly PdxItem[];
}
export type CwtValue = string | number | boolean | CountryRef | StateRef | CwtNode;
export type Effect<S> = (scope: S) => void;
export type Trigger<S> = (scope: S) => boolean;
export interface Definition {
  readonly __kriegDefinition: unique symbol;
}
export interface IdentifiedDefinition extends Definition {
  readonly id: string;
}
export interface ScriptedEffectDefinition<S extends ScopeName> extends Definition {
  readonly name: string;
  readonly scope: S;
  readonly __effect: unique symbol;
}
export interface ScriptedTriggerDefinition<S extends ScopeName> extends Definition {
  readonly name: string;
  readonly scope: S;
  readonly __trigger: unique symbol;
}

export interface CountryEffects extends GeneratedCountryEffects {
  addPoliticalPower(amount: number): void;
  addStability(amount: number): void;
  addWarSupport(amount: number): void;
  setCountryFlag(flag: FlagId): void;
  clearCountryFlag(flag: FlagId): void;
  addIdeas(idea: IdeaId): void;
  removeIdeas(idea: IdeaId): void;
  countryEvent(event: { id: EventId; days?: number; hours?: number; random_days?: number }): void;
  setVariable(variable: { var: VariableName; value: number }): void;
  addToVariable(variable: { var: VariableName; value: number }): void;
}
export interface StateEffects extends GeneratedStateEffects {
  addManpower(amount: number): void;
  setStateFlag(flag: FlagId): void;
  clearStateFlag(flag: FlagId): void;
}
export interface CountryTriggers extends GeneratedCountryTriggers {
  hasCountryFlag(flag: FlagId): boolean;
  hasIdea(idea: IdeaId): boolean;
  isAi(value: boolean): boolean;
  tag(country: CountryRef): boolean;
}
export interface StateTriggers extends GeneratedStateTriggers {
  hasStateFlag(flag: FlagId): boolean;
  isOwnedBy(country: CountryRef): boolean;
  isControlledBy(country: CountryRef): boolean;
}
export interface ScopeBase<S extends ScopeName = ScopeName> {
  run(effect: ScriptedEffectDefinition<S>): void;
  test(trigger: ScriptedTriggerDefinition<S>): boolean;
  country(target: CountryRef, effect: Effect<CountryScope>): void;
  state(target: StateRef, effect: Effect<StateScope>): void;
  everyCountry(effect: Effect<CountryScope>): void;
  everyCountry(limit: Trigger<CountryScope>, effect: Effect<CountryScope>): void;
  randomCountry(effect: Effect<CountryScope>): void;
  randomCountry(limit: Trigger<CountryScope>, effect: Effect<CountryScope>): void;
  anyCountry(trigger: Trigger<CountryScope>): boolean;
  allCountries(trigger: Trigger<CountryScope>): boolean;
}
export interface CountryScope extends ScopeBase<"country"> {
  readonly scope: "country";
  readonly effects: CountryEffects;
  readonly triggers: CountryTriggers;
  readonly politicalPower: number;
  readonly stability: number;
  readonly warSupport: number;
  readonly isAI: boolean;
  everyState(effect: Effect<StateScope>): void;
  everyState(limit: Trigger<StateScope>, effect: Effect<StateScope>): void;
  anyState(trigger: Trigger<StateScope>): boolean;
  allStates(trigger: Trigger<StateScope>): boolean;
  capital(effect: Effect<StateScope>): void;
}
export interface StateScope extends ScopeBase<"state"> {
  readonly scope: "state";
  readonly effects: StateEffects;
  readonly triggers: StateTriggers;
  readonly manpower: number;
  owner(effect: Effect<CountryScope>): void;
  controller(effect: Effect<CountryScope>): void;
}
export interface CharacterScope extends ScopeBase<"character"> {
  readonly scope: "character";
  readonly effects: GeneratedCharacterEffects;
  readonly triggers: GeneratedCharacterTriggers;
}
export interface UnitLeaderScope extends ScopeBase<"unit_leader"> {
  readonly scope: "unit_leader";
  readonly effects: GeneratedUnitLeaderEffects;
  readonly triggers: GeneratedUnitLeaderTriggers;
}
export interface AnyScope extends ScopeBase<"any"> {
  readonly scope: "any";
  readonly effects: GeneratedAnyEffects;
  readonly triggers: GeneratedAnyTriggers;
}
export interface Scope<S extends ScopeName> extends ScopeBase<S> {
  readonly scope: S;
  readonly effects: GeneratedEffectsByScope[S];
  readonly triggers: GeneratedTriggersByScope[S];
}
export type OperativeScope = Scope<"operative">;
export type ProjectScope = Scope<"project">;
export type CombatScope = Scope<"combat">;
export type MilitaryIndustrialOrganizationScope = Scope<"military_industrial_organization">;
export type PurchaseContractScope = Scope<"purchase_contract">;
export type UnitScope = Scope<"unit">;
export type RaidScope = Scope<"raid">;
export type OperationScope = Scope<"operation">;
export interface ScopeByName {
  country: CountryScope;
  state: StateScope;
  character: CharacterScope;
  unit_leader: UnitLeaderScope;
  operative: OperativeScope;
  project: ProjectScope;
  combat: CombatScope;
  military_industrial_organization: MilitaryIndustrialOrganizationScope;
  purchase_contract: PurchaseContractScope;
  unit: UnitScope;
  raid: RaidScope;
  operation: OperationScope;
  any: AnyScope;
}

export interface EventOption<S> {
  name: LocalisationKey;
  trigger?: Trigger<S>;
  aiChance?: number;
  effects?: Effect<S>;
}
export interface EventSpec<S> {
  id: EventId;
  title?: LocalisationKey;
  description?: LocalisationKey;
  picture?: AssetId;
  isTriggeredOnly?: boolean;
  fireOnlyOnce?: boolean;
  major?: boolean;
  hidden?: boolean;
  trigger?: Trigger<S>;
  immediate?: Effect<S>;
  meanTimeToHappen?: { days?: number; months?: number; years?: number };
  options?: readonly EventOption<S>[];
}
export declare function CountryEvent(spec: EventSpec<CountryScope>): IdentifiedDefinition;
export declare function StateEvent(spec: EventSpec<StateScope>): IdentifiedDefinition;
export declare function NewsEvent(spec: EventSpec<CountryScope>): IdentifiedDefinition;
export declare function Option<S>(spec: EventOption<S>): EventOption<S>;

export interface FocusSpec {
  id: FocusId;
  icon?: AssetId;
  x?: number;
  y?: number;
  cost?: number;
  relativePositionId?: FocusId;
  /** Each inner list is an OR group; separate groups must all be completed. */
  prerequisites?: readonly (readonly FocusId[])[];
  mutuallyExclusive?: readonly FocusId[];
  available?: Trigger<CountryScope>;
  bypass?: Trigger<CountryScope>;
  cancelIfInvalid?: boolean;
  continueIfInvalid?: boolean;
  completionReward?: Effect<CountryScope>;
  aiWillDo?: number;
}
export interface FocusTreeSpec {
  id: string;
  country?: Trigger<CountryScope>;
  default?: boolean;
  focuses: readonly FocusSpec[];
}
export declare function Focus(spec: FocusSpec): FocusSpec;
export declare function FocusTree(spec: FocusTreeSpec): IdentifiedDefinition;

export interface DecisionSpec {
  id: string;
  icon?: AssetId;
  cost?: number;
  daysRemove?: number;
  daysReEnable?: number;
  visible?: Trigger<CountryScope>;
  available?: Trigger<CountryScope>;
  completeEffect?: Effect<CountryScope>;
  removeEffect?: Effect<CountryScope>;
  aiWillDo?: number;
}
export interface DecisionCategorySpec {
  id: string;
  icon?: AssetId;
  visible?: Trigger<CountryScope>;
  allowed?: Trigger<CountryScope>;
  decisions: readonly DecisionSpec[];
}
export declare function Decision(spec: DecisionSpec): DecisionSpec;
export declare function DecisionCategory(spec: DecisionCategorySpec): IdentifiedDefinition;
export interface IdeaModifiers {
  stability_factor?: number;
  war_support_factor?: number;
  political_power_gain?: number;
  political_power_factor?: number;
  consumer_goods_factor?: number;
  production_speed_buildings_factor?: number;
  industrial_capacity_factory?: number;
  research_speed_factor?: number;
  conscription_factor?: number;
  army_org_factor?: number;
}
export interface IdeaSpec {
  id: IdeaId;
  picture?: AssetId;
  allowed?: Trigger<CountryScope>;
  visible?: Trigger<CountryScope>;
  removalCost?: number;
  modifier?: IdeaModifiers;
  onAdd?: Effect<CountryScope>;
  onRemove?: Effect<CountryScope>;
}
export declare function Idea(spec: IdeaSpec): IdentifiedDefinition;
export declare function ScriptedEffect(
  name: string,
  effect: Effect<CountryScope>,
): ScriptedEffectDefinition<"country">;
export declare function ScriptedEffect<S extends ScopeName>(
  name: string,
  scope: S,
  effect: Effect<ScopeByName[S]>,
): ScriptedEffectDefinition<S>;
export declare function ScriptedTrigger(
  name: string,
  trigger: Trigger<CountryScope>,
): ScriptedTriggerDefinition<"country">;
export declare function ScriptedTrigger<S extends ScopeName>(
  name: string,
  scope: S,
  trigger: Trigger<ScopeByName[S]>,
): ScriptedTriggerDefinition<S>;
export declare function StateScriptedEffect(
  name: string,
  effect: Effect<StateScope>,
): ScriptedEffectDefinition<"state">;
export declare function StateScriptedTrigger(
  name: string,
  trigger: Trigger<StateScope>,
): ScriptedTriggerDefinition<"state">;
/** Complete country history. Set path to the exact original file when replacing an existing history. */
export interface CountryHistorySpec {
  country: CountryRef;
  capital: StateRef;
  oob?: string;
  startingTrainBuffer?: number;
  history?: Effect<CountryScope>;
  path?: string;
}
export declare function CountryHistory(spec: CountryHistorySpec): Definition;
export interface ProvinceBuildings {
  naval_base?: number;
  bunker?: number;
  coastal_bunker?: number;
  supply_node?: number;
}
export interface StateBuildings {
  infrastructure?: number;
  industrial_complex?: number;
  arms_factory?: number;
  dockyard?: number;
  air_base?: number;
  anti_air_building?: number;
  radar_station?: number;
  synthetic_refinery?: number;
  fuel_silo?: number;
  rocket_site?: number;
  nuclear_reactor?: number;
  readonly [province: number]: ProvinceBuildings;
}
export interface StateResources {
  steel?: number;
  aluminium?: number;
  tungsten?: number;
  chromium?: number;
  oil?: number;
  rubber?: number;
}
/** A complete state definition; state-history edits are not automatically merged into vanilla files. */
export interface StateHistorySpec {
  state: StateRef;
  name: LocalisationKey;
  manpower: number;
  category: string;
  provinces: readonly number[];
  owner: CountryRef;
  controller?: CountryRef;
  cores?: readonly CountryRef[];
  buildings?: StateBuildings;
  resources?: StateResources;
  victoryPoints?: readonly { province: number; value: number }[];
  localSupplies?: number;
  impassable?: true;
  history?: Effect<StateScope>;
  /** Exact game path for replacement of an existing state definition. */
  path?: string;
}
export declare function StateHistory(spec: StateHistorySpec): Definition;
/** Explicit ordered PDX representation; no semantic-rewrite guarantee is implied. */
export declare function SourceFile(path: string, document: PdxDocument): Definition;
/** Structured game data. This API checks data shape, not domain-specific game rules. */
export interface DataRecord {
  readonly [key: string]: DataValue;
}
export type DataValue =
  string | number | boolean | CountryRef | StateRef | DataRecord | readonly DataValue[];
export declare function DataFile(path: string, data: DataRecord): Definition;
export declare function country(tag: string): CountryRef;
export declare function state(id: number): StateRef;
export declare function loc(key: string): LocalisationKey;
/** A deliberate typed escape to ordered syntax for a CWT block argument. */
export declare function cwt(items: readonly PdxItem[]): CwtNode;

/** First matching text wins; preserve the array order and put an unconditional fallback last. */
export type ScriptedLocalisationText<S> = {
  trigger?: Trigger<S>;
} & (
  | { localisationKey: LocalisationKey; randomList?: never }
  | {
      localisationKey?: never;
      randomList: readonly {
        weight: number;
        localisationKey: LocalisationKey;
        modifiers?: readonly WeightModifier<S>[];
      }[];
      seed?: number | string;
    }
);
export interface WeightModifier<S> {
  trigger: Trigger<S>;
  factor?: number | string;
  add?: number | string;
}
export interface ScriptedLocalisationSpec<S extends ScopeName> {
  scope: S;
  texts: readonly ScriptedLocalisationText<ScopeByName[S]>[];
}
export interface ScriptedLocalisationDefinition<S extends ScopeName> extends Definition {
  readonly name: string;
  readonly scope: S;
}
export declare function ScriptedLocalisation<S extends ScopeName>(
  name: string,
  spec: ScriptedLocalisationSpec<S>,
): ScriptedLocalisationDefinition<S>;

/** Native meta_effect substitutions are evaluated by HOI4, never by the compiler. */
export type MetaParameterNames<Text extends string> =
  Text extends `${string}[${infer Name}]${infer Rest}` ? Name | MetaParameterNames<Rest> : never;
export type MetaParameterValue = string | number | boolean | CountryRef | StateRef;
export interface MetaEffectSpec<Text extends string> {
  /** An effect block body without outer braces, containing [PARAMETER] placeholders. */
  text: Text;
  parameters: { readonly [Name in MetaParameterNames<Text>]: MetaParameterValue };
  debug?: boolean;
}
export declare function MetaEffect<const Text extends string>(
  scope: { readonly scope: ScopeName },
  specification: MetaEffectSpec<Text>,
): void;

export type ScriptedGuiContext =
  | "global_context"
  | "player_context"
  | "selected_country_context"
  | "selected_state_context"
  | "diplomacy_target_context"
  | "decision_category"
  | "diplomatic_action"
  | "national_focus_context"
  | "country_mapicon"
  | "state_mapicon";
export type ScriptedGuiScope<C extends ScriptedGuiContext> = C extends
  "selected_state_context" | "state_mapicon"
  ? StateScope
  : C extends "global_context"
    ? AnyScope
    : CountryScope;
export type GuiParentWindowToken =
  | "top_bar"
  | "decision_tab"
  | "technology_tab"
  | "trade_tab"
  | "construction_tab"
  | "production_tab"
  | "deployment_tab"
  | "logistics_tab"
  | "diplomacy_tab"
  | "national_focus"
  | "politics_tab"
  | "selected_country_view"
  | "selected_state_view"
  | "selected_country_view_info"
  | "selected_country_view_diplomacy"
  | "army_ledger"
  | "navy_ledger"
  | "civilian_ledger"
  | "air_ledger"
  | "tech_infantry_folder"
  | "tech_support_folder"
  | "tech_armor_folder"
  | "tech_artillery_folder"
  | "tech_land_doctrine_folder"
  | "tech_naval_folder"
  | "tech_naval_doctrine_folder"
  | "tech_air_techs_folder"
  | "tech_air_doctrine_folder"
  | "tech_electronics_folder"
  | "tech_industry_folder";
export interface ScriptedGuiProperties {
  image?: string;
  frame?: number | string;
  x?: number | string;
  y?: number | string;
}
export interface GuiWeight<S> {
  base?: number | string;
  factor?: number | string;
  add?: number | string;
  modifiers?: readonly WeightModifier<S>[];
}
export interface GuiAiWeight<S> {
  aiWillDo: GuiWeight<S>;
  ignoreLowerWeights?: GuiWeight<S>;
}
export type GuiClickName = `${string}_click`;
export type GuiTriggerName = `${string}_visible` | `${string}_click_enabled`;
export type GuiAiTestScope =
  | "test_self_country"
  | "test_enemy_countries"
  | "test_ally_countries"
  | "test_neighbouring_countries"
  | "test_neighbouring_ally_countries"
  | "test_neighbouring_enemy_countries"
  | "test_self_owned_states"
  | "test_enemy_owned_states"
  | "test_ally_owned_states"
  | "test_self_controlled_states"
  | "test_enemy_controlled_states"
  | "test_ally_controlled_states"
  | "test_neighbouring_states"
  | "test_neighbouring_enemy_states"
  | "test_neighbouring_ally_states"
  | "test_our_neighbouring_states"
  | "test_our_neighbouring_states_against_allies"
  | "test_our_neighbouring_states_against_enemies"
  | "test_contesded_states"
  | "test_if_only_major"
  | "test_if_only_coastal";
export type GuiDynamicList<S> = {
  array: string;
  value?: string;
  index?: string;
  changeScope?: false;
  effects?: { readonly [action: GuiClickName]: Effect<S> };
  triggers?: { readonly [action: GuiTriggerName]: Trigger<S> };
  aiWeights?: { readonly [action: GuiClickName]: GuiAiWeight<S> };
} & (
  | { entryContainer: string; countryScopeEntryContainer?: never }
  | { entryContainer?: never; countryScopeEntryContainer: string }
);
/** entryScope emits change_scope=yes and checks row callbacks against that scope. */
export type ScopedGuiDynamicList = {
  [S in ScopeName]: Omit<GuiDynamicList<ScopeByName[S]>, "changeScope"> & { entryScope: S };
}[ScopeName];
export interface ScriptedGuiSpec<C extends ScriptedGuiContext> {
  name: string;
  windowName: string;
  context: C;
  parentWindowToken?: GuiParentWindowToken;
  parentWindowName?: string;
  parentScriptedGui?: string;
  dirty?: string;
  visible?: Trigger<ScriptedGuiScope<C>>;
  effects?: { readonly [action: GuiClickName]: Effect<ScriptedGuiScope<C>> };
  triggers?: { readonly [action: GuiTriggerName]: Trigger<ScriptedGuiScope<C>> };
  properties?: { readonly [element: string]: ScriptedGuiProperties };
  dynamicLists?: {
    readonly [element: string]: GuiDynamicList<ScriptedGuiScope<C>> | ScopedGuiDynamicList;
  };
  aiEnabled?: Trigger<CountryScope>;
  aiCheck?: Trigger<CountryScope>;
  aiCheckScope?: Trigger<ScriptedGuiScope<C>>;
  aiTestParent?: string;
  aiTestInterval?: number;
  aiTestVariance?: number;
  aiTestScopes?: readonly GuiAiTestScope[];
  aiMaxWeightTakenPerTest?: number;
  aiWeights?: { readonly [action: GuiClickName]: GuiAiWeight<ScriptedGuiScope<C>> };
  mapiconTargets?: { targetArray?: string; targetTrigger?: Trigger<ScriptedGuiScope<C>> };
}
export declare function ScriptedGui<C extends ScriptedGuiContext>(
  spec: ScriptedGuiSpec<C>,
): Definition;
