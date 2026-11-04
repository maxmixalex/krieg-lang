import type { CwtSchema, CwtValueRule, CwtCommandRule } from "../schema/types.js";

const scopes = [
  "country",
  "state",
  "character",
  "unit_leader",
  "operative",
  "project",
  "combat",
  "military_industrial_organization",
  "purchase_contract",
  "unit",
  "raid",
  "operation",
  "any",
] as const;
function scopeTypeName(scope: string): string {
  return scope
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
}
function identifier(name: string): boolean {
  return /^[a-zA-Z_][a-zA-Z_0-9]*$/.test(name);
}
function normalizedScope(scope: string): string {
  return scope.toLowerCase().replace("unitleader", "unit_leader");
}
export function commandAllowed(rule: CwtCommandRule, scope: string): boolean {
  return rule.scopes.some(
    (value) => normalizedScope(value) === "any" || normalizedScope(value) === scope,
  );
}
/** CWT's dynamic keys cannot be represented as fixed TypeScript property maps. */
export function cwtType(rule: CwtValueRule, schema: CwtSchema, depth = 0): string {
  if (depth > 12) return "CwtOpaque";
  if (rule.type === "block") {
    const fields = rule.fields ?? [];
    if (fields.length && fields.every((field) => field.name === "")) {
      return `readonly (${[...new Set(fields.map((field) => cwtType(field.value, schema, depth + 1)))].join(" | ")})[]`;
    }
    if (
      fields.some(
        (field) => !identifier(field.name) || ["scalar", "int", "float"].includes(field.name),
      )
    )
      return "CwtNode";
    const grouped = new Map<string, typeof fields>();
    for (const field of fields)
      grouped.set(field.name, [...(grouped.get(field.name) ?? []), field]);
    const properties = [...grouped].map(([name, group]) => {
      const optional = group.every((field) =>
        field.cardinality?.replace(/^~/, "").startsWith("0.."),
      );
      const type = [...new Set(group.map((field) => cwtType(field.value, schema, depth + 1)))].join(
        " | ",
      );
      // An object represents one occurrence. Use CwtNode for repeated properties.
      return `${JSON.stringify(name)}${optional ? "?" : ""}: ${type}`;
    });
    return properties.length ? `{ ${properties.join("; ")} } | CwtNode` : "CwtNode";
  }
  const expression = rule.expression;
  const alias = /^single_alias_right\[([^\]]+)\]$/.exec(expression);
  if (alias) {
    const alternatives =
      schema.singleAliasOverloads?.[alias[1]] ??
      (schema.singleAliases[alias[1]] ? [schema.singleAliases[alias[1]]] : []);
    return alternatives.length
      ? [
          ...new Set(alternatives.map((alternative) => cwtType(alternative, schema, depth + 1))),
        ].join(" | ")
      : "CwtOpaque";
  }
  if (expression === "bool") return "boolean";
  if (expression === "yes") return "true";
  if (expression === "no") return "false";
  if (
    /^(?:int|float|variable_field|int_variable_field|int_variable_field_32|variable_field_32)(?:\[|$)/.test(
      expression,
    )
  )
    return "number";
  if (expression === "enum[country_tags]" || expression === "scope[country]") return "CountryRef";
  if (expression === "<state>" || expression === "scope[state]") return "StateRef | StateTargetRef";
  if (expression === "enum[provinces]") return "number";
  if (expression === "scope_field") return "CountryRef | StateRef | StateTargetRef";
  if (/^scope\[[a-z_]+\]\.value\[variable\]$/.test(expression)) return "string";
  if (/^scope\[/.test(expression)) return "CwtOpaque";
  if (expression === "scalar")
    return "string | number | boolean | CountryRef | StateRef | StateTargetRef";
  if (
    /^(?:localisation|localisation_inline|date_field|datetime_field|filepath|icon)$/.test(
      expression,
    )
  )
    return "string";
  if (/[<\[|:]/.test(expression)) return "string";
  return JSON.stringify(expression);
}

/** Stable public declarations for every fixed CWT command, grouped by legal scope. */
export function generateCommandDeclarations(schema: CwtSchema, imported = true): string {
  const lines = [
    "// Generated from the bundled CWT projection. Do not edit by hand.",
    `// CWT SHA-256: ${schema.provenance.sha256}`,
  ];
  if (imported)
    lines.push(
      "import type { CountryRef, StateRef, StateTargetRef, CwtOpaque, CwtNode, ScopeByName, Effect, Trigger } from './index.js';",
    );
  for (const scope of scopes)
    for (const kind of ["effect", "trigger"] as const) {
      lines.push(
        `export interface Generated${scopeTypeName(scope)}${kind === "effect" ? "Effects" : "Triggers"} {`,
      );
      const seen = new Set<string>();
      for (const command of schema.commands
        .filter(
          (rule) => rule.kind === kind && identifier(rule.name) && commandAllowed(rule, scope),
        )
        .sort((a, b) => a.name.localeCompare(b.name))) {
        const pushed = command.pushScope ? normalizedScope(command.pushScope) : undefined;
        const callback =
          pushed && (scopes as readonly string[]).includes(pushed)
            ? `${kind === "effect" ? "Effect" : "Trigger"}<ScopeByName[${JSON.stringify(pushed)}]>`
            : undefined;
        const type = callback
          ? `${callback}${kind === "effect" ? ` | { limit?: Trigger<ScopeByName[${JSON.stringify(pushed)}]>; effects: ${callback} }` : ""} | ${cwtType(command.value, schema)}`
          : cwtType(command.value, schema);
        const signature = `  ${JSON.stringify(command.name)}(value: ${type}): ${kind === "effect" ? "void" : "boolean"};`;
        if (seen.has(signature)) continue;
        seen.add(signature);
        const description = (command.description ?? "")
          .replace(/\*\//g, "* /")
          .replace(/\s+/g, " ")
          .slice(0, 300);
        lines.push(`  /** ${description} CWT: ${command.source}:${command.line}. */`, signature);
      }
      lines.push("}");
    }
  for (const kind of ["effect", "trigger"] as const) {
    lines.push(`export interface Generated${kind === "effect" ? "Effects" : "Triggers"}ByScope {`);
    for (const scope of scopes)
      lines.push(
        `  ${JSON.stringify(scope)}: Generated${scopeTypeName(scope)}${kind === "effect" ? "Effects" : "Triggers"};`,
      );
    lines.push("}");
  }
  return `${lines.join("\n")}\n`;
}

export const PDX_DECLARATIONS = `
export type PdxOperator = '=' | '<' | '>' | '<=' | '>=' | '!=' | '==' | '?=';
export interface PdxAtom { kind: 'atom'; text: string; quoted: boolean }
export interface PdxBlock { kind: 'block'; items: PdxItem[] }
export interface PdxTagged { kind: 'tagged'; tag: PdxAtom; value: PdxBlock }
export type PdxValue = PdxAtom | PdxBlock | PdxTagged;
export interface PdxProperty { kind: 'property'; key: PdxAtom; operator: PdxOperator; value: PdxValue }
export type PdxItem = PdxProperty | PdxValue;
export interface PdxDocument { kind: 'document'; items: PdxItem[] }
export interface PdxFile { kind: 'file'; path: string; document: PdxDocument }
export declare function atom(text: string, quoted?: boolean): PdxAtom;
export declare function quoted(text: string): PdxAtom;
export declare function string(text: string): PdxAtom;
export declare function block(items: readonly PdxItem[]): PdxBlock;
export declare function property(key: string | PdxAtom, value: PdxValue, operator?: PdxOperator): PdxProperty;
export declare const entry: typeof property;
export declare function tagged(tag: string | PdxAtom, value: PdxBlock): PdxTagged;
export declare function document(items: readonly PdxItem[]): PdxDocument;
export declare function file(path: string, document: PdxDocument): PdxFile;
`;
