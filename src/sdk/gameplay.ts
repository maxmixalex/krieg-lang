import type {
  CountryScope,
  Effect,
  FocusSpec,
  IdentifiedDefinition,
  ScriptedEffectDefinition,
  ScriptedTriggerDefinition,
  Trigger,
} from "./index.js";

/** One country action's shared eligibility, political-power price and settlement. */
export interface CountryActionSpec {
  /** Non-negative compile-time safe integer; zero is free even at a negative balance. */
  readonly politicalPowerCost: number;
  /** Gameplay eligibility. The compiler adds the affordability check where required. */
  readonly available?: Trigger<CountryScope>;
  /** Shared settlement. The compiler handles the price separately. */
  readonly perform: Effect<CountryScope>;
}

/**
 * A compiler-created paid country action, reusable across modules and entry points.
 * @remarks `available` includes eligibility and affordability. `execute` rechecks
 * both in native if/limit, deducts the price once, then runs the shared settlement.
 * Bind the action directly to a decision so the game's cost system collects the price.
 */
export interface CountryActionDefinition<Id extends string = string> extends IdentifiedDefinition {
  readonly id: Id;
  readonly politicalPowerCost: number;
  readonly available: ScriptedTriggerDefinition<"country"> & { readonly name: `${Id}_available` };
  readonly execute: ScriptedEffectDefinition<"country"> & { readonly name: `${Id}_execute` };
  readonly __kriegCountryAction: unique symbol;
}

/**
 * Declare reusable eligibility, price and settlement for a country action.
 * @remarks Buttons use `action={aid}`. Events use `country.run(aid.execute)`;
 * an optional display condition is `country.test(aid.available)`. Decisions use
 * `{ id: "request_aid", action: aid }` and cannot override cost, available or
 * completeEffect. Ordinary decisions pay through native cost and call settlement
 * directly, without checking the already-deducted balance or charging again.
 * Generated names are `${id}_eligible`, `${id}_available`, `${id}_perform` and
 * `${id}_execute`; these names are reserved against other scripted declarations.
 * @category Typed gameplay
 */
export declare function CountryAction<const Id extends string>(
  id: Id,
  spec: CountryActionSpec,
): CountryActionDefinition<Id>;

type DecimalDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type DecimalDigits<Value extends string> = Value extends `${DecimalDigit}${infer Rest}`
  ? Rest extends ""
    ? true
    : DecimalDigits<Rest>
  : false;
type LastEventPart<Value extends string> = Value extends `${string}.${infer Rest}`
  ? LastEventPart<Rest>
  : Value;
/**
 * Validate a literal event ID's decimal suffix without losing leading zeros.
 * @remarks Dotted namespaces are supported. Negative, hexadecimal and exponent
 * suffixes are rejected by TypeScript. The compiler additionally validates the
 * namespace, warns about numeric namespace overflow, and checks duplicate IDs.
 * Widened strings remain usable by annotated specs and source helpers; the
 * compiler validates their statically evaluated value before emitting an event.
 */
export type EventIdentifier<Id extends string> = string extends Id
  ? Id
  : Id extends `${string}.${string}`
    ? DecimalDigits<LastEventPart<Id>> extends true
      ? Id
      : never
    : never;

/**
 * An event declaration that can be scheduled only in its recipient scope.
 * @remarks Country and news events both have country recipients. State events
 * require a state recipient. The literal ID remains available for native APIs.
 * @category Typed gameplay
 */
export interface EventDefinition<
  S extends "country" | "state",
  Id extends string = string,
> extends IdentifiedDefinition {
  readonly id: Id;
  readonly eventScope: S;
  readonly __kriegEvent: unique symbol;
}

/**
 * Delay before an event is delivered. All fields add together; a month is 30 days.
 * @remarks Random fields add a uniformly sampled value from zero through the
 * supplied maximum. Values must be non-negative compile-time integers. An empty
 * delay delivers the event immediately. Delayed events recheck their trigger
 * when delivered, and their timer pauses while the receiving country is absent.
 * @category Typed gameplay
 */
export interface EventDelay {
  readonly hours?: number;
  readonly days?: number;
  readonly months?: number;
  readonly randomHours?: number;
  readonly randomDays?: number;
}

/** A compiler-created reference to a focus declared by a FocusGraph. */
export interface FocusReference<Id extends string = string> {
  readonly id: Id;
  readonly __kriegFocus: unique symbol;
}

/**
 * Gameplay for one focus; graph topology supplies IDs, prerequisites and layout.
 * @remarks Cost uses the game's focus points (normally seven days per point),
 * not a fixed duration. The configured NFocus.FOCUS_POINT_DAYS define controls it.
 */
export interface FocusNodeSpec extends Omit<
  FocusSpec,
  "id" | "x" | "y" | "relativePositionId" | "prerequisites" | "mutuallyExclusive"
> {
  /** Optional absolute position; otherwise the graph assigns a row and column. */
  readonly position?: { readonly x: number; readonly y: number };
}

/** A local node selected while declaring a graph's prerequisites or exclusions. */
export interface FocusNodeKey<Key extends string = string> {
  readonly key: Key;
  readonly __kriegFocusNode: unique symbol;
}

/** Exact node-name completion for a graph or reusable node module. */
export type FocusSelector<Key extends string> = {
  readonly [Name in Key]: FocusNodeKey<Name>;
};

/**
 * A completed focus, every requirement in `all`, or one requirement in `any`.
 * @remarks Nested groups retain their boolean meaning. The compiler distributes
 * OR over AND to produce the game's prerequisite blocks, with a checked limit
 * on expansion. This describes accumulated completed focuses, not a state machine.
 */
export type FocusRequirement<Key extends string = string> =
  | FocusNodeKey<Key>
  | {
      readonly all: readonly [FocusRequirement<Key>, ...FocusRequirement<Key>[]];
      readonly any?: never;
    }
  | {
      readonly any: readonly [FocusRequirement<Key>, ...FocusRequirement<Key>[]];
      readonly all?: never;
    };

/** Gameplay and its local unlocking rules, written together on the same node. */
export interface FocusGraphNodeSpec<Key extends string> extends FocusNodeSpec {
  /** Select completed predecessors; omit this on a root node. */
  readonly requires?: (focus: FocusSelector<Key>) => FocusRequirement<Key>;
  /** Select alternatives to exclude. The compiler supplies the reverse links. */
  readonly exclusiveWith?: (
    focus: FocusSelector<Key>,
  ) => FocusNodeKey<Key> | readonly [FocusNodeKey<Key>, ...FocusNodeKey<Key>[]];
}

/** A node module retains its exact names and contextual gameplay callback types. */
export type FocusNodeSet<Key extends string> = {
  readonly [Name in Key]: FocusGraphNodeSpec<NoInfer<Key>>;
} & (string extends Key ? { readonly __kriegLiteralNodeKeys: never } : unknown);

/**
 * Define a reusable, typed collection of focus nodes without emitting a tree.
 * @remarks Spread the returned nodes into one or more FocusGraphs. Internal
 * selectors are checked here; graph-level selectors also see the imported nodes.
 * Each consuming graph supplies its own ID prefix and layout. A module owns its
 * node names; use distinct names when combining modules in the same tree.
 * @category Typed gameplay
 */
export declare function FocusNodes<const Key extends string>(
  nodes: FocusNodeSet<Key>,
): FocusNodeSet<Key>;

/** A chain creates one prerequisite for every consecutive pair of nodes. */
export type FocusSequence<Key extends string> = readonly [Key, Key, ...Key[]];

/**
 * A join requires every `all` node, or at least one `any` node.
 * @remarks Separate joins and incoming sequences are combined with AND.
 */
export type FocusJoin<Key extends string> =
  | { readonly to: Key; readonly all: readonly [Key, ...Key[]]; readonly any?: never }
  | { readonly to: Key; readonly any: readonly [Key, ...Key[]]; readonly all?: never };

/**
 * A focus tree with topology checked against the exact keys of `nodes`.
 * @remarks Node-local requirements generate native prerequisite groups. Each choice
 * group creates pairwise, symmetric mutual exclusions. Defaults position nodes
 * by dependency depth, with columns assigned in declaration order within a row.
 */
export interface FocusGraphSpec<Id extends string, Key extends string, Prefix extends string = Id> {
  readonly id: Id;
  /** Focus IDs are `${prefix}_${nodeKey}`; the default prefix is the tree ID. */
  readonly prefix?: Prefix;
  readonly country?: Trigger<CountryScope>;
  readonly default?: boolean;
  readonly nodes: FocusNodeSet<Key>;
  /** Compatible with 0.3; node-local `requires` is usually easier to read. */
  readonly sequences?: readonly FocusSequence<NoInfer<Key>>[];
  /** Compatible with 0.3; combines with node-local `requires` using AND. */
  readonly joins?: readonly FocusJoin<NoInfer<Key>>[];
  /** Compatible with 0.3; node-local `exclusiveWith` also makes symmetric links. */
  readonly choices?: readonly FocusSequence<NoInfer<Key>>[];
  readonly layout?: { readonly columnSpacing?: number; readonly rowSpacing?: number };
}

/** A focus tree and the exact, typed references exported by its node names. */
export interface FocusGraphDefinition<
  Id extends string,
  Key extends string,
  Prefix extends string = Id,
> extends IdentifiedDefinition {
  readonly id: Id;
  readonly focuses: { readonly [Name in Key]: FocusReference<`${Prefix}_${Name}`> };
}

/**
 * Build a complete focus graph from gameplay nodes and their local requirements.
 * @remarks Rejects missing nodes, cycles, empty groups, and unavoidable mutually
 * exclusive prerequisites. Generated IDs are stable under node reordering. Use
 * the returned `focuses` references with `country.hasCompletedFocus` and
 * `country.completeFocus`. External/shared-focus graphs use the lower-level
 * FocusTree API, because this graph deliberately describes a closed DAG.
 * @example
 * const tree = FocusGraph({
 *   id: "reconstruction", prefix: "REC",
 *   nodes: {
 *     charter: { cost: 3 },
 *     industry: {
 *       requires: f => f.charter, exclusiveWith: f => f.relief,
 *       cost: 5, completionReward: c => c.effects.addPoliticalPower(50),
 *     },
 *     relief: { requires: f => f.charter, cost: 5 },
 *     assembly: { requires: f => ({ any: [f.industry, f.relief] }), cost: 5 },
 *   },
 * });
 * @category Typed gameplay
 */
export declare function FocusGraph<
  const Id extends string,
  const Key extends string,
  const Prefix extends string = Id,
>(spec: FocusGraphSpec<Id, Key, Prefix>): FocusGraphDefinition<Id, Key, Prefix>;
