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
