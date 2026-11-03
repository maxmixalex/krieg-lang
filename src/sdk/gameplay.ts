import type { CountryScope, FocusSpec, IdentifiedDefinition, Trigger } from "./index.js";

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
 * @remarks Sequences and joins generate native prerequisite groups. Each choice
 * group creates pairwise, symmetric mutual exclusions. Defaults position nodes
 * by dependency depth, with columns assigned in declaration order within a row.
 */
export interface FocusGraphSpec<Id extends string, Key extends string, Prefix extends string = Id> {
  readonly id: Id;
  /** Focus IDs are `${prefix}_${nodeKey}`; the default prefix is the tree ID. */
  readonly prefix?: Prefix;
  readonly country?: Trigger<CountryScope>;
  readonly default?: boolean;
  readonly nodes: { readonly [Name in Key]: FocusNodeSpec } & (string extends Key
    ? { readonly __kriegLiteralNodeKeys: never }
    : unknown);
  readonly sequences?: readonly FocusSequence<NoInfer<Key>>[];
  readonly joins?: readonly FocusJoin<NoInfer<Key>>[];
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
 * Build a complete focus graph from gameplay nodes, paths, joins and choices.
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
 *     industry: { cost: 5, completionReward: c => c.effects.addPoliticalPower(50) },
 *     relief: { cost: 5 },
 *     assembly: { cost: 5 },
 *   },
 *   sequences: [["charter", "industry"], ["charter", "relief"]],
 *   choices: [["industry", "relief"]],
 *   joins: [{ to: "assembly", any: ["industry", "relief"] }],
 * });
 * @category Typed gameplay
 */
export declare function FocusGraph<
  const Id extends string,
  const Key extends string,
  const Prefix extends string = Id,
>(spec: FocusGraphSpec<Id, Key, Prefix>): FocusGraphDefinition<Id, Key, Prefix>;
