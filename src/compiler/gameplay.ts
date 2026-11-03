/** Pure normalization of the gameplay graph; callbacks remain compiler values. */
export class GameplayError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

type RecordValue = Record<string, unknown>;
const nodeFields = [
  "icon",
  "cost",
  "position",
  "available",
  "bypass",
  "cancelIfInvalid",
  "continueIfInvalid",
  "completionReward",
  "aiWillDo",
  "requires",
  "exclusiveWith",
];

function invalid(code: string, message: string): never {
  throw new GameplayError(code, message);
}

function object(value: unknown, label: string): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value) || "_krg" in value)
    invalid("KRG2601", `${label} must be a compile-time record.`);
  return value as RecordValue;
}

function fields(value: RecordValue, keys: readonly string[], label: string): void {
  const extra = Object.keys(value).filter((key) => !keys.includes(key));
  if (extra.length) invalid("KRG2601", `${label} has unsupported fields: ${extra.join(", ")}.`);
}

function list(value: unknown, label: string, minimum = 0): unknown[] {
  if (!Array.isArray(value) || value.length < minimum)
    invalid("KRG2601", `${label} requires at least ${minimum} entries.`);
  return value;
}

function identifier(value: unknown, label: string): string {
  if (typeof value !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(value))
    invalid(
      "KRG2601",
      `${label} must contain ASCII letters, digits or underscores and start with a letter or underscore.`,
    );
  return value;
}

function finite(value: unknown, label: string, positive = false): number {
  if (typeof value !== "number" || !Number.isFinite(value) || (positive && value <= 0))
    invalid("KRG2601", `${label} must be a finite ${positive ? "positive " : ""}number.`);
  return value;
}

export interface NormalizedFocusGraph {
  spec: RecordValue;
  focuses: Record<string, { _krg: "focus-reference"; id: string }>;
}

type LocalFocusKey = { _krg: "focus-node-key"; key: string };
type FocusSelector = Record<string, LocalFocusKey>;
type ResolveFocusSelector = (callback: unknown, selector: FocusSelector) => unknown;

/**
 * Convert a positive boolean expression to the game's AND-of-OR groups.
 * Subsumption keeps common `a OR (a AND b)` expressions small. Limits apply
 * before hostile nesting or distributive products can exhaust the compiler.
 */
function focusRequirement(
  value: unknown,
  reference: (value: unknown) => string,
  label: string,
): string[][] {
  let combinations = 0;
  const limit = (): never =>
    invalid(
      "KRG2610",
      `${label} is too complex to expand into native prerequisite groups (maximum 256 groups, 4096 references, 16384 combinations and 64 nesting levels). Introduce intermediate focuses or simplify the nested 'any'/'all' expression.`,
    );
  const append = (groups: string[][], group: string[]): void => {
    const unique = [...new Set(group)];
    // A implies (A OR B), so the larger clause is redundant inside an AND.
    if (groups.some((existing) => existing.every((key) => unique.includes(key)))) return;
    for (let index = groups.length - 1; index >= 0; index--)
      if (unique.every((key) => groups[index].includes(key))) groups.splice(index, 1);
    groups.push(unique);
    if (groups.length > 256 || groups.reduce((size, clause) => size + clause.length, 0) > 4096)
      limit();
  };
  const visit = (expression: unknown, depth: number): string[][] => {
    if (depth > 64) limit();
    if (
      expression &&
      typeof expression === "object" &&
      "_krg" in expression &&
      expression._krg === "focus-node-key"
    )
      return [[reference(expression)]];
    const condition = object(expression, label);
    fields(condition, ["all", "any"], label);
    if ((condition.all === undefined) === (condition.any === undefined))
      invalid("KRG2601", `${label} requires a selected node or exactly one of 'all' and 'any'.`);
    const inputs = list(condition.all ?? condition.any, label, 1);
    let groups: string[][] = [];
    for (const input of inputs) {
      const next = visit(input, depth + 1);
      if (condition.all !== undefined || groups.length === 0) {
        for (const clause of next) append(groups, clause);
      } else {
        const product: string[][] = [];
        for (const left of groups)
          for (const right of next) {
            if (++combinations > 16384) limit();
            append(product, [...left, ...right]);
          }
        groups = product;
      }
    }
    return groups;
  };
  return visit(value, 0);
}

/** Expand graph operations into ordinary FocusTree input without executing user code. */
export function normalizeFocusGraph(
  value: unknown,
  resolve?: ResolveFocusSelector,
): NormalizedFocusGraph {
  const graph = object(value, "FocusGraph");
  fields(
    graph,
    ["id", "prefix", "country", "default", "nodes", "sequences", "joins", "choices", "layout"],
    "FocusGraph",
  );
  const id = identifier(graph.id, "FocusGraph.id");
  const prefix = identifier(graph.prefix ?? id, "FocusGraph.prefix");
  const nodes = object(graph.nodes, "FocusGraph.nodes");
  const keys = Object.keys(nodes);
  if (!keys.length) invalid("KRG2601", "FocusGraph requires at least one node.");
  const prerequisites = new Map(keys.map((key) => [key, [] as string[][]]));
  const exclusions = new Map(keys.map((key) => [key, new Set<string>()]));
  const specs = new Map<string, RecordValue>();
  const selector: FocusSelector = Object.create(null);
  for (const key of keys) {
    identifier(key, "Focus node key");
    const spec = object(nodes[key], `Focus node '${key}'`);
    fields(spec, nodeFields, `Focus node '${key}'`);
    specs.set(key, spec);
    selector[key] = { _krg: "focus-node-key", key };
  }
  const reference = (value: unknown): string => {
    if (typeof value !== "string" || !Object.hasOwn(nodes, value))
      invalid(
        "KRG2602",
        `Unknown focus node '${String(value)}'; choose one of ${keys.join(", ")}.`,
      );
    return value;
  };
  const group = (value: unknown, label: string, minimum: number): string[] => {
    const result = list(value, label, minimum).map(reference);
    if (new Set(result).size !== result.length)
      invalid("KRG2601", `${label} contains a repeated node.`);
    return result;
  };
  const addPrerequisite = (to: string, from: string[]): void => {
    if (from.includes(to)) invalid("KRG2603", `Focus '${to}' cannot require itself.`);
    const requirements = prerequisites.get(to)!;
    const key = [...from].sort().join("\0");
    if (!requirements.some((previous) => [...previous].sort().join("\0") === key))
      requirements.push(from);
  };
  const localReference = (value: unknown): string => {
    if (
      !value ||
      typeof value !== "object" ||
      !("key" in value) ||
      typeof value.key !== "string" ||
      !Object.hasOwn(selector, value.key) ||
      selector[value.key] !== value
    )
      invalid(
        "KRG2602",
        "Focus requirements and exclusions must use nodes from their own selector; external IDs and fabricated node keys are not allowed.",
      );
    return value.key;
  };
  const select = (value: unknown, label: string): unknown => {
    if (!resolve) invalid("KRG2601", `${label} requires a statically evaluated selector callback.`);
    return resolve(value, selector);
  };
  for (const key of keys) {
    const spec = specs.get(key)!;
    if (spec.requires !== undefined) {
      const label = `Requirements of focus '${key}'`;
      const condition = select(spec.requires, label);
      for (const clause of focusRequirement(condition, localReference, label))
        addPrerequisite(key, clause);
    }
    if (spec.exclusiveWith !== undefined) {
      const selected = select(spec.exclusiveWith, `Exclusions of focus '${key}'`);
      const alternatives = Array.isArray(selected)
        ? list(selected, `Exclusions of focus '${key}'`, 1).map(localReference)
        : [localReference(selected)];
      if (new Set(alternatives).size !== alternatives.length)
        invalid("KRG2601", `Exclusions of focus '${key}' contain a repeated node.`);
      for (const alternative of alternatives) {
        if (alternative === key) invalid("KRG2603", `Focus '${key}' cannot exclude itself.`);
        exclusions.get(key)!.add(alternative);
        exclusions.get(alternative)!.add(key);
      }
    }
  }
  for (const value of list(graph.sequences ?? [], "FocusGraph.sequences")) {
    const sequence = group(value, "A focus sequence", 2);
    for (let index = 1; index < sequence.length; index++)
      addPrerequisite(sequence[index], [sequence[index - 1]]);
  }
  for (const value of list(graph.joins ?? [], "FocusGraph.joins")) {
    const join = object(value, "A focus join");
    fields(join, ["to", "all", "any"], "A focus join");
    const to = reference(join.to);
    if ((join.all === undefined) === (join.any === undefined))
      invalid("KRG2601", `Join for '${to}' requires exactly one of 'all' or 'any'.`);
    const from = group(join.all ?? join.any, `Join for '${to}'`, 1);
    if (join.all !== undefined) from.forEach((key) => addPrerequisite(to, [key]));
    else addPrerequisite(to, from);
  }
  for (const value of list(graph.choices ?? [], "FocusGraph.choices")) {
    const choice = group(value, "A mutually exclusive choice", 2);
    for (const left of choice)
      for (const right of choice) if (left !== right) exclusions.get(left)!.add(right);
  }

  // A closed graph deliberately requires an acyclic topology, including OR edges.
  const parents = new Map(keys.map((key) => [key, [...new Set(prerequisites.get(key)!.flat())]]));
  const children = new Map(keys.map((key) => [key, [] as string[]]));
  const pending = new Map(keys.map((key) => [key, parents.get(key)!.length]));
  for (const key of keys) for (const parent of parents.get(key)!) children.get(parent)!.push(key);
  const ordered = keys.filter((key) => pending.get(key) === 0);
  const depths = new Map<string, number>();
  for (let index = 0; index < ordered.length; index++) {
    const key = ordered[index];
    depths.set(
      key,
      parents.get(key)!.reduce((row, parent) => Math.max(row, depths.get(parent)! + 1), 0),
    );
    for (const child of children.get(key)!) {
      pending.set(child, pending.get(child)! - 1);
      if (pending.get(child) === 0) ordered.push(child);
    }
  }
  if (ordered.length !== keys.length) {
    const path: string[] = [];
    let key = keys.find((name) => pending.get(name)! > 0)!;
    while (!path.includes(key)) {
      path.push(key);
      key = parents.get(key)!.find((name) => pending.get(name)! > 0)!;
    }
    invalid(
      "KRG2603",
      `Focus prerequisite cycle: ${[...path.slice(path.indexOf(key)), key].join(" -> ")}.`,
    );
  }

  // Intersect the mandatory ancestors of OR alternatives, union separate groups.
  // This proves common deadlocks without rejecting legitimate alternative branches.
  const mandatory = new Map<string, Set<string>>();
  for (const key of ordered) {
    // Only choice participants can contribute to an exclusivity deadlock. Keeping
    // those ancestors avoids a quadratic transitive closure for long plain paths.
    const result = new Set(exclusions.get(key)!.size ? [key] : []);
    for (const group of prerequisites.get(key)!) {
      const alternatives = group.map((parent) => mandatory.get(parent)!);
      for (const ancestor of alternatives[0])
        if (alternatives.every((set) => set.has(ancestor))) result.add(ancestor);
    }
    for (const left of result)
      for (const right of exclusions.get(left)!)
        if (result.has(right))
          invalid(
            "KRG2604",
            `Focus '${key}' cannot be completed: '${left}' and '${right}' are mutually exclusive but both are unavoidable.`,
          );
    // OR alternatives need not share an ancestor to all be impossible: a
    // separate AND requirement may exclude every branch. Reject only when each
    // alternative has a proven conflict with an unavoidable choice participant.
    for (const group of prerequisites.get(key)!) {
      if (group.length < 2) continue;
      const blocked = group.every((parent) => {
        for (const ancestor of mandatory.get(parent)!)
          for (const excluded of exclusions.get(ancestor)!) if (result.has(excluded)) return true;
        return false;
      });
      if (blocked)
        invalid(
          "KRG2604",
          `Focus '${key}' cannot be completed: every alternative in [${group.join(", ")}] conflicts with an unavoidable mutually exclusive prerequisite.`,
        );
    }
    mandatory.set(key, result);
  }

  const layout = object(graph.layout ?? {}, "FocusGraph.layout");
  fields(layout, ["columnSpacing", "rowSpacing"], "FocusGraph.layout");
  const columnSpacing = finite(layout.columnSpacing ?? 2, "columnSpacing", true);
  const rowSpacing = finite(layout.rowSpacing ?? 1, "rowSpacing", true);
  const columns = new Map<number, number>();
  const focuses: NormalizedFocusGraph["focuses"] = Object.create(null);
  const focusSpecs = keys.map((key) => {
    const source = specs.get(key)!;
    const { position, requires: _requires, exclusiveWith: _exclusiveWith, ...spec } = source;
    const row = depths.get(key)!;
    const column = columns.get(row) ?? 0;
    columns.set(row, column + 1);
    const xy =
      position === undefined
        ? { x: column * columnSpacing, y: row * rowSpacing }
        : object(position, `Position of '${key}'`);
    fields(xy, ["x", "y"], `Position of '${key}'`);
    const focusId = `${prefix}_${key}`;
    focuses[key] = { _krg: "focus-reference", id: focusId };
    const requirements = prerequisites.get(key)!;
    const exclusive = [...exclusions.get(key)!];
    return {
      id: focusId,
      ...spec,
      x: finite(xy.x, `Position x of '${key}'`),
      y: finite(xy.y, `Position y of '${key}'`),
      ...(requirements.length
        ? { prerequisites: requirements.map((group) => group.map((name) => `${prefix}_${name}`)) }
        : {}),
      ...(exclusive.length
        ? { mutuallyExclusive: exclusive.map((name) => `${prefix}_${name}`) }
        : {}),
    };
  });
  return {
    spec: {
      id,
      ...(graph.country === undefined ? {} : { country: graph.country }),
      ...(graph.default === undefined ? {} : { default: graph.default }),
      focuses: focusSpecs,
    },
    focuses,
  };
}

/** Validate decimal IDs and normalize only their identity, not their emitted spelling. */
export function validateEventIdentifier(value: string): string {
  const match = /^([A-Za-z0-9_.]+)\.([0-9]+)$/.exec(value);
  if (!match)
    invalid(
      "KRG2605",
      `Event '${value}' needs a word-character namespace and a non-negative decimal integer suffix (for example 'congress.001').`,
    );
  return `${match[1]}.${match[2].replace(/^0+(?=[0-9])/, "")}`;
}

/** Validate timing and translate the semantic field names to native names. */
export function normalizeEventDelay(value: unknown): Record<string, number> {
  const delay = object(value ?? {}, "Event delay");
  const names: Record<string, string> = {
    hours: "hours",
    days: "days",
    months: "months",
    randomHours: "random_hours",
    randomDays: "random_days",
  };
  for (const key of Object.keys(delay))
    if (!Object.hasOwn(names, key))
      invalid("KRG2606", `Event delay has unsupported field '${key}'.`);
  const result: Record<string, number> = {};
  for (const [key, native] of Object.entries(names)) {
    if (!Object.hasOwn(delay, key)) continue;
    const value = delay[key];
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0)
      invalid("KRG2606", `Event delay '${key}' must be a non-negative compile-time integer.`);
    result[native] = value;
  }
  return result;
}
