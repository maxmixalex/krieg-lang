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
import type { EventDefinition, EventDelay, EventIdentifier, FocusReference } from "./gameplay.js";
export * from "./domains.js";
export * from "./defines.js";
export * from "./gameplay.js";

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

/** Literal compile-time inputs, never runtime native text substitutions. */
export type ScriptedVariantValue = string | number | boolean | CountryRef | StateRef;
/** Finite variant names mapped to flat, typed parameter records. */
export type ScriptedVariants = Readonly<
  Record<string, Readonly<Record<string, ScriptedVariantValue>>>
>;
/** Exact keys select ordinary native effect handles for their declared scope. */
export type ScriptedEffectFamilyDefinition<
  Prefix extends string,
  S extends ScopeName,
  Variants extends ScriptedVariants,
> = {
  readonly [Key in keyof Variants]: ScriptedEffectDefinition<S> & {
    readonly name: `${Prefix}_${Key & (string | number)}`;
  };
};
/** Exact keys select ordinary native trigger handles for their declared scope. */
export type ScriptedTriggerFamilyDefinition<
  Prefix extends string,
  S extends ScopeName,
  Variants extends ScriptedVariants,
> = {
  readonly [Key in keyof Variants]: ScriptedTriggerDefinition<S> & {
    readonly name: `${Prefix}_${Key & (string | number)}`;
  };
};

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
  /** Emit one native `name = yes` call; the handle must match the active scope. */
  run(effect: ScriptedEffectDefinition<S>): void;
  /** Test a native trigger handle; negate with `!scope.test(handle)`. */
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
  /** Deliver a declared country/news event now or after a checked static delay. */
  schedule(event: EventDefinition<"country">, delay?: EventDelay): void;
  /** Test a declared focus using its compiler-created graph reference. */
  hasCompletedFocus(focus: FocusReference): boolean;
  /** Complete a declared focus using the native complete_national_focus effect. */
  completeFocus(focus: FocusReference): void;
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
  /** Deliver a declared state event now or after a checked static delay. */
  schedule(event: EventDefinition<"state">, delay?: EventDelay): void;
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
/** Declare a country event and return its typed handle. Keep the handle when scheduling from another definition: TypeScript checks the receiver scope and preserves the literal event ID.
 * @example
 * ```ts
 * const grant = CountryEvent({
 *   id: "council.001", hidden: true, isTriggeredOnly: true,
 *   immediate: country => country.effects.addPoliticalPower(10),
 * });
 * // In a country effect callback: country.schedule(grant, { days: 2 }).
 * ```
 * @see {@link StateEvent} */
export declare function CountryEvent<const Id extends string>(
  spec: EventSpec<CountryScope> & { id: Id & EventIdentifier<Id> },
): EventDefinition<"country", Id>;
/** Declare an event received by a state. Its callbacks operate in state scope, and its handle can be passed to a state scope's `schedule` method.
 * @see {@link CountryEvent} */
export declare function StateEvent<const Id extends string>(
  spec: EventSpec<StateScope> & { id: Id & EventIdentifier<Id> },
): EventDefinition<"state", Id>;
/** Declare a news event; the scheduling receiver is a country. The returned handle retains the actual event identifier.
 * @see {@link CountryEvent} */
export declare function NewsEvent<const Id extends string>(
  spec: EventSpec<CountryScope> & { id: Id & EventIdentifier<Id> },
): EventDefinition<"country", Id>;
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
/** Write a focus tree with explicit native identifiers and per-node layout. Use {@link FocusGraph} when the project owns the nodes and you want completion, graph checks, and automatic layout.
 * @see {@link FocusTreeSpec} */
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
/** Group decisions under one category. `available` checks whether a decision may be taken; `completeEffect` describes the effect of taking it.
 * @example
 * ```ts
 * DecisionCategory({ id: "council_budget", decisions: [{
 *   id: "council_vote", cost: 25,
 *   available: country => !country.isAI,
 *   completeEffect: country => country.effects.setCountryFlag("council_voted"),
 * }] });
 * ``` */
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
/**
 * Specialize one typed callback into one native effect per finite variant.
 * @remarks Each name is `${prefix}_${key}`. Values and arithmetic are evaluated
 * at compile time; calls use `scope.run(family.key)` without native parameters.
 * Prefixes and keys must form safe ASCII identifiers; duplicate native names fail.
 */
export declare function ScriptedEffectFamily<
  const Prefix extends string,
  const Variants extends ScriptedVariants,
>(
  prefix: Prefix,
  variants: Variants,
  effect: (scope: CountryScope, parameters: NoInfer<Variants[keyof Variants]>) => void,
): ScriptedEffectFamilyDefinition<Prefix, "country", Variants>;
/** Explicit scope variant of ScriptedEffectFamily. */
export declare function ScriptedEffectFamily<
  const Prefix extends string,
  S extends ScopeName,
  const Variants extends ScriptedVariants,
>(
  prefix: Prefix,
  scope: S,
  variants: Variants,
  effect: (scope: ScopeByName[NoInfer<S>], parameters: NoInfer<Variants[keyof Variants]>) => void,
): ScriptedEffectFamilyDefinition<Prefix, S, Variants>;
/**
 * Specialize a typed condition into ordinary `${prefix}_${key}` native triggers.
 * @remarks Select with `scope.test(family.key)`. Parameters are compile-time
 * values, not `$PARAM$` macros or implicit game variables.
 */
export declare function ScriptedTriggerFamily<
  const Prefix extends string,
  const Variants extends ScriptedVariants,
>(
  prefix: Prefix,
  variants: Variants,
  trigger: (scope: CountryScope, parameters: NoInfer<Variants[keyof Variants]>) => boolean,
): ScriptedTriggerFamilyDefinition<Prefix, "country", Variants>;
/** Explicit scope variant of ScriptedTriggerFamily. */
export declare function ScriptedTriggerFamily<
  const Prefix extends string,
  S extends ScopeName,
  const Variants extends ScriptedVariants,
>(
  prefix: Prefix,
  scope: S,
  variants: Variants,
  trigger: (
    scope: ScopeByName[NoInfer<S>],
    parameters: NoInfer<Variants[keyof Variants]>,
  ) => boolean,
): ScriptedTriggerFamilyDefinition<Prefix, S, Variants>;
/** Complete country history. Set path to the exact original file when replacing an existing history. */
export interface CountryHistorySpec {
  country: CountryRef;
  capital: StateRef;
  oob?: string;
  startingTrainBuffer?: number;
  history?: Effect<CountryScope>;
  path?: string;
}
/** Write the starting history of a country: its capital, government, order of battle and setup effects. The project still needs a country tag, common definition and flags.
 * @see [Countries and maps](https://maxmixalex.github.io/krieg-lang/countries-maps/) */
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
/** Write a complete state history file. When replacing an existing state, give its exact native path and preserve the province membership that should remain in the state.
 * @example
 * ```ts
 * StateHistory({ state: state(1), name: "STATE_1", owner: country("KRG"),
 *   manpower: 180000, category: "rural", provinces: [3838, 9851, 11804],
 *   buildings: { infrastructure: 2 }, path: "history/states/1-France.txt" });
 * ```
 * @see {@link StateHistorySpec} */
export declare function StateHistory(spec: StateHistorySpec): Definition;
/** Explicit ordered PDX representation; no semantic-rewrite guarantee is implied. */
export declare function SourceFile(path: string, document: PdxDocument): Definition;
/** Structured game data. This API checks data shape, not domain-specific game rules. */
export interface DataRecord {
  readonly [key: string]: DataValue;
}
export type DataValue =
  string | number | boolean | CountryRef | StateRef | DataRecord | readonly DataValue[];
/** Emit structured native data at an explicit game-relative path. Prefer a named domain constructor for game-specific field checking. For repeated keys, mixed blocks or explicit native operators, use the ordered PDX API instead. */
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
