/** Checked compile-time data for finite families of ordinary native scripts. */
export class ScriptedFamilyError extends Error {}

export interface ScriptedVariant {
  key: string;
  name: string;
  parameters: Record<string, unknown>;
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value) || "_krg" in value)
    throw new ScriptedFamilyError(`${label} must be a compile-time record.`);
  return value as Record<string, unknown>;
}

function scalar(value: unknown): boolean {
  if (typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const reference = value as Record<string, unknown>;
  const keys = Object.keys(reference);
  if (reference.kind === "country")
    return (
      keys.length === 2 &&
      typeof reference.tag === "string" &&
      /^[A-Z][A-Z0-9]{2}$/.test(reference.tag)
    );
  return (
    reference.kind === "state" &&
    keys.length === 2 &&
    typeof reference.id === "number" &&
    Number.isSafeInteger(reference.id) &&
    reference.id > 0
  );
}

/** Validate before invoking any callback; parameter values are never native source text. */
export function normalizeScriptedFamily(prefix: unknown, input: unknown): ScriptedVariant[] {
  if (typeof prefix !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(prefix))
    throw new ScriptedFamilyError(
      "A scripted family prefix must start with an ASCII letter or underscore and contain only letters, digits or underscores.",
    );
  const variants = record(input, "Scripted family variants");
  const keys = Object.keys(variants);
  if (!keys.length)
    throw new ScriptedFamilyError("A scripted family requires at least one variant.");
  return keys.map((key) => {
    if (!/^[A-Za-z0-9_]+$/.test(key))
      throw new ScriptedFamilyError(
        `Scripted variant key '${key}' must contain only ASCII letters, digits or underscores.`,
      );
    const parameters = record(variants[key], `Scripted variant '${key}' parameters`);
    for (const [field, value] of Object.entries(parameters)) {
      if (!scalar(value))
        throw new ScriptedFamilyError(
          `Scripted variant '${key}.${field}' requires a finite number, boolean, string, country reference or positive integer state reference.`,
        );
    }
    return { key, name: `${prefix}_${key}`, parameters };
  });
}
