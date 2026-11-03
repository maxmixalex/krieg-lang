import type ts from "typescript";
import type { PdxProperty } from "../pdx/ast.js";

/** Static element metadata survives source components, fragments and arrays. */
export interface GuiElementValue {
  _krg: "gui-element";
  property: PdxProperty;
  children?: unknown;
  source?: ts.Node;
  binding?: { owner: number; props: Record<string, unknown> };
}

type Fail = (node: ts.Node, code: string, message: string) => never;
export const SCRIPTED_WINDOW_COMPONENTS = [
  "Container",
  "Button",
  "Icon",
  "Text",
  "GridBox",
  "ListBox",
] as const;
export const GUI_BINDING_KEYS = ["visible", "properties", "click", "enabled", "aiWeight"];

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Flatten compile-time child composition without discarding behavior metadata. */
export function guiElements(value: unknown, node: ts.Node, fail: Fail): GuiElementValue[] {
  if (value === undefined || value === null || typeof value === "boolean") return [];
  if (Array.isArray(value)) return value.flatMap((item) => guiElements(item, node, fail));
  if (record(value) && value._krg === "gui-fragment")
    return guiElements(value.children, node, fail);
  if (record(value) && value._krg === "gui-element") return [value as unknown as GuiElementValue];
  return fail(node, "KRG2087", "GUI children must be statically authored interface elements.");
}

/** Convert colocated bindings to the existing native ScriptedGui lowering contract. */
export function composeScriptedWindow(
  specification: Record<string, unknown>,
  layout: unknown,
  owner: number,
  node: ts.Node,
  fail: Fail,
): Record<string, unknown> {
  const roots = guiElements(layout, node, fail);
  if (roots.length !== 1 || roots[0].property.key.text !== "containerWindowType")
    fail(node, "KRG2130", "ScriptedWindow requires exactly one root Container.");
  const names = new Set<string>();
  const effects: Record<string, unknown> = Object.create(null);
  const triggers: Record<string, unknown> = Object.create(null);
  const properties: Record<string, unknown> = Object.create(null);
  const aiWeights: Record<string, unknown> = Object.create(null);
  let windowName = "";

  const visit = (element: GuiElementValue, root = false): void => {
    const origin = element.source ?? node;
    const block = element.property.value;
    const field =
      block.kind === "block"
        ? block.items.find((item) => item.kind === "property" && item.key.text === "name")
        : undefined;
    if (!field || field.kind !== "property" || field.value.kind !== "atom")
      fail(origin, "KRG2131", "Every ScriptedWindow element requires a stable name.");
    // Native PDX quoted values are escaped. Restrict names to safe native event identifiers.
    const name = field.value.text;
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name))
      fail(origin, "KRG2131", `ScriptedWindow element '${name}' must be a native identifier.`);
    if (names.has(name))
      fail(
        origin,
        "KRG2132",
        `ScriptedWindow repeats element name '${name}'. Give each expanded element a unique name.`,
      );
    names.add(name);
    if (root) windowName = name;
    const binding = element.binding;
    if (binding) {
      if (binding.owner !== owner)
        fail(origin, "KRG2133", "A bound GUI component belongs to a different ScriptedWindow.");
      const props = binding.props;
      if (root && Object.values(props).some((value) => value !== undefined))
        fail(
          origin,
          "KRG2138",
          "Put window visibility on ScriptedWindow's spec; element bindings belong to descendants of the root container.",
        );
      const button = element.property.key.text === "buttonType";
      if (!button && ["click", "enabled", "aiWeight"].some((key) => props[key] !== undefined))
        fail(origin, "KRG2134", "Only a bound Button accepts click, enabled and aiWeight.");
      if (props.click !== undefined) effects[`${name}_click`] = props.click;
      if (props.enabled !== undefined) triggers[`${name}_click_enabled`] = props.enabled;
      if (props.visible !== undefined) triggers[`${name}_visible`] = props.visible;
      if (props.aiWeight !== undefined) aiWeights[`${name}_click`] = props.aiWeight;
      if (props.properties !== undefined) {
        if (!record(props.properties))
          fail(origin, "KRG2135", "GUI property bindings require a static property record.");
        const icon = element.property.key.text === "iconType";
        const supported = icon
          ? ["image", "frame", "x", "y"]
          : button
            ? ["frame", "x", "y"]
            : ["x", "y"];
        const values: Record<string, unknown> = Object.create(null);
        for (const [key, value] of Object.entries(props.properties)) {
          if (value === undefined) continue;
          if (!supported.includes(key))
            fail(
              origin,
              "KRG2135",
              `Property '${key}' is not supported by this bound GUI element.`,
            );
          if (key === "image") {
            if (typeof value !== "string")
              fail(
                origin,
                "KRG2135",
                "A GUI image binding must be a sprite or scripted localisation string.",
              );
            values[key] = value;
          } else if (typeof value === "number" && Number.isFinite(value)) {
            values[key] = value;
          } else if (
            record(value) &&
            value._krg === "gui-variable" &&
            typeof value.name === "string"
          ) {
            values[key] = value.name;
          } else {
            fail(
              origin,
              "KRG2135",
              `Property '${key}' requires a numeric constant or GuiVariable reference.`,
            );
          }
        }
        properties[name] = values;
      }
    }
    for (const child of guiElements(element.children, origin, fail)) visit(child);
  };
  visit(roots[0], true);
  const result: Record<string, unknown> = { ...specification, windowName };
  for (const [key, value] of Object.entries({ effects, triggers, properties, aiWeights }))
    if (Object.keys(value).length) result[key] = value;
  delete result.path;
  return result;
}
