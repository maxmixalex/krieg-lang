import type { CwtSchema, CwtValueRule } from "../schema/types.js";

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function numeric(value: unknown): boolean {
  return (
    typeof value === "number" ||
    (object(value) && ["variable", "arithmetic"].includes(String(value._krg)))
  );
}
function fixedKey(value: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value) && !["scalar", "int", "float"].includes(value);
}

/** Validate values again after static expansion; TS structural assignability permits extra keys. */
export function commandValueError(
  value: unknown,
  rule: CwtValueRule,
  schema: CwtSchema,
  depth = 0,
): string | undefined {
  if (depth > 12)
    return "CWT alias expansion exceeded the supported depth; use cwt(orderedItems) explicitly.";
  const alias = /^single_alias_right\[([^\]]+)\]$/.exec(rule.expression);
  if (alias && schema.singleAliases[alias[1]]) {
    const errors = (
      schema.singleAliasOverloads?.[alias[1]] ?? [schema.singleAliases[alias[1]]]
    ).map((alternative) => commandValueError(value, alternative, schema, depth + 1));
    return errors.some((error) => error === undefined) ? undefined : errors[0];
  }
  if (rule.type === "block") {
    if (object(value) && value.kind === "cwt") return undefined;
    const fields = rule.fields ?? [];
    if (fields.length && fields.every((field) => field.name === "")) {
      if (!Array.isArray(value)) return "Expected an anonymous value list.";
      for (const item of value)
        if (
          !fields.some(
            (field) => commandValueError(item, field.value, schema, depth + 1) === undefined,
          )
        )
          return "A list item does not match its CWT value type.";
      return undefined;
    }
    if (!object(value) || value._krg)
      return "Expected a command argument record or cwt(orderedItems).";
    if (fields.some((field) => !fixedKey(field.name)))
      return "This command has dynamic CWT keys; use cwt(orderedItems) explicitly.";
    const groups = new Map<string, typeof fields>();
    for (const field of fields) groups.set(field.name, [...(groups.get(field.name) ?? []), field]);
    for (const key of Object.keys(value)) {
      const group = groups.get(key);
      if (!group) return `Unknown command field '${key}'.`;
      const errors = group.map((field) =>
        commandValueError(value[key], field.value, schema, depth + 1),
      );
      if (errors.every((error) => error !== undefined)) return `Field '${key}': ${errors[0]}`;
    }
    for (const [key, group] of groups)
      if (
        !(key in value) &&
        !group.every((field) => field.cardinality?.replace(/^~/, "").startsWith("0.."))
      )
        return `Missing required command field '${key}'.`;
    return undefined;
  }
  const expression = rule.expression;
  if (expression === "bool") return typeof value === "boolean" ? undefined : "Expected a boolean.";
  if (expression === "yes" || expression === "no")
    return value === (expression === "yes")
      ? undefined
      : `Expected ${expression === "yes" ? "true" : "false"}.`;
  if (
    /^(?:int|float|variable_field|int_variable_field|int_variable_field_32|variable_field_32)(?:\[|$)/.test(
      expression,
    )
  ) {
    if (!numeric(value)) return "Expected a numeric value or numeric game variable.";
    if (typeof value === "number") {
      if (!Number.isFinite(value)) return "Expected a finite number.";
      if (/^int(?:\[|$)/.test(expression) && !Number.isInteger(value))
        return "Expected an integer.";
      const bounds = /\[(-?(?:\d+(?:\.\d+)?|inf))\.\.(-?(?:\d+(?:\.\d+)?|inf))\]/.exec(expression);
      if (bounds) {
        const lower = bounds[1] === "-inf" ? -Infinity : Number(bounds[1]);
        const upper = bounds[2] === "inf" ? Infinity : Number(bounds[2]);
        if (value < lower || value > upper)
          return `Value ${value} is outside the CWT range ${bounds[1]}..${bounds[2]}.`;
      }
    }
    return undefined;
  }
  if (expression === "enum[country_tags]" || expression === "scope[country]")
    return object(value) && value.kind === "country" ? undefined : "Expected a CountryRef.";
  if (expression === "<state>" || expression === "scope[state]")
    return object(value) && value.kind === "state" ? undefined : "Expected a StateRef.";
  if (expression === "enum[provinces]")
    return typeof value === "number" && Number.isInteger(value) && value > 0
      ? undefined
      : "Expected a positive province ID.";
  if (expression === "scope_field")
    return object(value) && ["country", "state"].includes(String(value.kind))
      ? undefined
      : "Expected a country/state reference.";
  if (expression === "scalar")
    return ["string", "number", "boolean"].includes(typeof value) ||
      numeric(value) ||
      (object(value) && ["country", "state"].includes(String(value.kind)))
      ? undefined
      : "Expected a scalar token.";
  if (typeof value !== "string") return "Expected a string identifier/token.";
  if (
    !/[<\[|:]/.test(expression) &&
    ![
      "localisation",
      "localisation_inline",
      "date_field",
      "datetime_field",
      "filepath",
      "icon",
    ].includes(expression) &&
    value !== expression
  )
    return `Expected the literal '${expression}'.`;
  return undefined;
}
