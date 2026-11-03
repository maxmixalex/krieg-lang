import postcss, { type ChildNode, type Declaration, type Rule } from "postcss";
import valueParser from "postcss-value-parser";
import type { KriegDiagnostic } from "./types.js";

export interface StyleDeclaration {
  property: string;
  value: unknown;
  file: string;
  line: number;
  column: number;
}
export interface StyleClassValue {
  _krg: "gui-style";
  name: string;
  declarations: StyleDeclaration[];
}
export interface StyleModule {
  classes: Record<string, StyleClassValue>;
  declaration: string;
  diagnostics: KriegDiagnostic[];
}

/** A deliberately finite native layout vocabulary, not browser CSS. */
export const STYLE_PROPERTIES: Record<string, { prop: string; kind: string }> = {
  position: { prop: "position", kind: "position" },
  size: { prop: "size", kind: "size" },
  "border-size": { prop: "borderSize", kind: "position" },
  offset: { prop: "offset", kind: "position" },
  "slot-size": { prop: "slotsize", kind: "size" },
  padding: { prop: "padding", kind: "padding" },
  orientation: { prop: "orientation", kind: "word" },
  origo: { prop: "origo", kind: "word" },
  format: { prop: "format", kind: "word" },
  "vertical-alignment": { prop: "verticalAlignment", kind: "word" },
  font: { prop: "font", kind: "string" },
  "sprite-type": { prop: "spriteType", kind: "string" },
  "vertical-scrollbar": { prop: "verticalScrollbar", kind: "string" },
  "horizontal-scrollbar": { prop: "horizontalScrollbar", kind: "string" },
  "scrollbar-type": { prop: "scrollbartype", kind: "string" },
  "max-width": { prop: "maxWidth", kind: "coordinate" },
  "max-height": { prop: "maxHeight", kind: "coordinate" },
  scale: { prop: "scale", kind: "number" },
  rotation: { prop: "rotation", kind: "number" },
  frame: { prop: "frame", kind: "integer" },
  spacing: { prop: "spacing", kind: "integer" },
  horizontal: { prop: "horizontal", kind: "integer" },
  "max-slots-horizontal": { prop: "maxSlotsHorizontal", kind: "integer" },
  "max-slots-vertical": { prop: "maxSlotsVertical", kind: "integer" },
  "scroll-wheel-factor": { prop: "scrollWheelFactor", kind: "number" },
  hide: { prop: "hide", kind: "boolean" },
  clipping: { prop: "clipping", kind: "boolean" },
  moveable: { prop: "moveable", kind: "boolean" },
  fullscreen: { prop: "fullscreen", kind: "boolean" },
  multiline: { prop: "multiline", kind: "boolean" },
  "fixed-size": { prop: "fixedSize", kind: "boolean" },
  "always-transparent": { prop: "alwaysTransparent", kind: "boolean" },
  "center-position": { prop: "centerPosition", kind: "boolean" },
  "add-horizontal": { prop: "addHorizontal", kind: "boolean" },
  "click-to-front": { prop: "clickToFront", kind: "boolean" },
  "autohide-scrollbars": { prop: "autohideScrollbars", kind: "boolean" },
  "smooth-scrolling": { prop: "smoothScrolling", kind: "boolean" },
  "no-click-sound": { prop: "noClickSound", kind: "boolean" },
};

/** Field names differ between the ergonomic and schema-native controls. */
export const STYLE_NATIVE_NAMES: Record<string, string> = {
  verticalAlignment: "vertical_alignment",
  alwaysTransparent: "alwaystransparent",
  centerPosition: "centerposition",
  fixedSize: "fixedsize",
  addHorizontal: "add_horizontal",
  maxSlotsHorizontal: "max_slots_horizontal",
  maxSlotsVertical: "max_slots_vertical",
  clickToFront: "click_to_front",
  autohideScrollbars: "autohide_scrollbars",
  smoothScrolling: "smooth_scrolling",
  scrollWheelFactor: "scroll_wheel_factor",
  noClickSound: "no_clicksound",
};

class StyleFailure extends Error {}

/** Parse once for both compiler values and stock TypeScript declarations. */
export function parseStyleModule(source: string, file: string): StyleModule {
  const diagnostics: KriegDiagnostic[] = [];
  const classes: Record<string, StyleClassValue> = Object.create(null);
  const rules = new Map<string, Rule>();
  const tokens = new Map<string, Declaration>();
  function fail(node: ChildNode, code: string, message: string): never {
    diagnostics.push({
      code,
      message,
      severity: "error",
      file,
      line: node.source?.start?.line ?? 1,
      column: node.source?.start?.column ?? 1,
    });
    throw new StyleFailure(message);
  }
  const attempt = (run: () => void): void => {
    try {
      run();
    } catch (error) {
      if (!(error instanceof StyleFailure)) throw error;
    }
  };
  const declarations = (rule: Rule): Declaration[] => {
    const result: Declaration[] = [];
    for (const child of rule.nodes) {
      if (child.type === "comment") continue;
      if (child.type !== "decl")
        fail(child, "KRG2202", "Nested rules and at-rules are not supported in Krieg styles.");
      if (child.important)
        fail(
          child,
          "KRG2203",
          "!important is not supported. Class order and inline props determine overrides.",
        );
      result.push(child);
    }
    return result;
  };
  let root;
  try {
    root = postcss.parse(source, { from: file });
  } catch (error) {
    const issue = error as { reason?: string; line?: number; column?: number };
    return {
      classes,
      declaration: "declare const styles: {}; export default styles;\n",
      diagnostics: [
        {
          code: "KRG2200",
          message: issue.reason ?? String(error),
          severity: "error",
          file,
          line: issue.line ?? 1,
          column: issue.column ?? 1,
        },
      ],
    };
  }
  for (const node of root.nodes)
    attempt(() => {
      if (node.type === "comment") return;
      if (node.type !== "rule")
        fail(
          node,
          "KRG2202",
          "Only a single .class selector or :root token block is supported; no at-rules.",
        );
      if (node.selector === ":root") {
        for (const declaration of declarations(node)) {
          if (!/^--[A-Za-z_][A-Za-z0-9_-]*$/.test(declaration.prop))
            fail(
              declaration,
              "KRG2204",
              ":root may contain only custom properties such as --row-height.",
            );
          if (tokens.has(declaration.prop))
            fail(
              declaration,
              "KRG2205",
              `Duplicate token '${declaration.prop}'. Give each module token one definition.`,
            );
          tokens.set(declaration.prop, declaration);
        }
        return;
      }
      const match = /^\.([A-Za-z_][A-Za-z0-9_-]*)$/.exec(node.selector);
      if (!match)
        fail(
          node,
          "KRG2202",
          `Unsupported selector '${node.selector}'. Use one .class; descendants, lists, IDs and pseudo-classes have no native GUI semantics.`,
        );
      const name = match[1];
      if (rules.has(name))
        fail(
          node,
          "KRG2205",
          `Duplicate class '${name}'. Compose distinct classes or override through className order.`,
        );
      declarations(node);
      rules.set(name, node);
    });

  let expansions = 0;
  const expand = (value: string, origin: Declaration, chain: string[] = []): string => {
    if (++expansions > 100_000 || value.length > 1_000_000)
      fail(origin, "KRG2208", "Custom property expansion exceeds the static style budget.");
    if (chain.length > 100)
      fail(origin, "KRG2208", "Custom property expansion exceeds 100 references.");
    const parsed = valueParser(value);
    parsed.walk((node) => {
      if (node.type !== "function") return;
      if (node.value !== "var")
        fail(
          origin,
          "KRG2206",
          `Unsupported function '${node.value}()'. Krieg styles support only static var() references.`,
        );
      const comma = node.nodes.findIndex((part) => part.type === "div" && part.value === ",");
      const name = valueParser
        .stringify(comma < 0 ? node.nodes : node.nodes.slice(0, comma))
        .trim();
      if (!/^--[A-Za-z_][A-Za-z0-9_-]*$/.test(name))
        fail(origin, "KRG2206", "var() requires a custom property name.");
      if (chain.includes(name))
        fail(origin, "KRG2208", `Cyclic custom properties: ${[...chain, name].join(" → ")}.`);
      const token = tokens.get(name);
      if (!token && comma < 0)
        fail(
          origin,
          "KRG2207",
          `Unknown custom property '${name}'. Define it in this module's :root or supply a var() fallback.`,
        );
      const replacement = token
        ? expand(token.value, token, [...chain, name])
        : expand(valueParser.stringify(node.nodes.slice(comma + 1)), origin, chain);
      // A word containing serialized tokens is intentional: stringify emits it verbatim,
      // and the final value is reparsed into its fully expanded token sequence below.
      Object.assign(node, { type: "word", value: replacement });
      return false;
    });
    return parsed.toString();
  };
  const value = (declaration: Declaration, kind: string): unknown => {
    const parts = valueParser(expand(declaration.value, declaration)).nodes.filter(
      (part) => part.type !== "space" && part.type !== "comment",
    );
    if (!parts.length || parts.some((part) => part.type !== "word" && part.type !== "string"))
      fail(
        declaration,
        "KRG2206",
        `Invalid '${declaration.prop}' value. Use native constants, not browser expressions.`,
      );
    const coordinate = (part: (typeof parts)[number]): number | string => {
      if (part.type !== "word")
        fail(
          declaration,
          "KRG2206",
          "Coordinates must be unquoted numbers, px, percentages, or @native_constants.",
        );
      if (/^@[A-Za-z_][A-Za-z0-9_]*$/.test(part.value)) return part.value;
      if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)%$/.test(part.value)) return part.value;
      if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:px)?$/.test(part.value))
        fail(
          declaration,
          "KRG2206",
          `Unsupported coordinate '${part.value}'. Use numbers, px, %, or @native_constants.`,
        );
      const number = Number(part.value.replace(/px$/, ""));
      if (!Number.isFinite(number)) fail(declaration, "KRG2206", "Coordinates must be finite.");
      return number;
    };
    if (kind === "position" || kind === "size") {
      if (parts.length !== 2)
        fail(declaration, "KRG2206", `'${declaration.prop}' requires exactly two coordinates.`);
      return kind === "position"
        ? { x: coordinate(parts[0]), y: coordinate(parts[1]) }
        : { width: coordinate(parts[0]), height: coordinate(parts[1]) };
    }
    if (kind === "padding") {
      if (parts.length < 1 || parts.length > 4)
        fail(
          declaration,
          "KRG2206",
          "padding requires one to four numeric values: top right bottom left.",
        );
      const values = parts.map(coordinate);
      if (values.some((part) => typeof part !== "number"))
        fail(declaration, "KRG2206", "Native padding requires numeric pixel values.");
      const [top, right = top, bottom = top, left = right] = values;
      return { top, right, bottom, left };
    }
    if (parts.length !== 1)
      fail(
        declaration,
        "KRG2206",
        `'${declaration.prop}' requires one value; quote strings containing spaces.`,
      );
    const part = parts[0];
    if (kind === "coordinate") return coordinate(part);
    if (kind === "string") {
      if (part.value.includes("\\"))
        fail(
          declaration,
          "KRG2206",
          "CSS escapes are not supported in native names; use the literal name.",
        );
      return part.value;
    }
    if (part.type !== "word")
      fail(declaration, "KRG2206", `'${declaration.prop}' requires an unquoted native value.`);
    if (kind === "boolean") {
      if (!["yes", "no", "true", "false"].includes(part.value))
        fail(declaration, "KRG2206", `'${declaration.prop}' requires yes/no or true/false.`);
      return part.value === "yes" || part.value === "true";
    }
    if (kind === "word") {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(part.value))
        fail(declaration, "KRG2206", `'${declaration.prop}' requires a native enum identifier.`);
      return part.value;
    }
    const number = Number(part.value);
    if (
      !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(part.value) ||
      !Number.isFinite(number) ||
      (kind === "integer" && !Number.isInteger(number))
    )
      fail(declaration, "KRG2206", `'${declaration.prop}' requires a finite ${kind}.`);
    return number;
  };
  const resolving = new Set<string>();
  const resolveClass = (name: string, origin?: Declaration): StyleClassValue => {
    if (classes[name]) return classes[name];
    const rule = rules.get(name);
    if (!rule)
      fail(
        origin!,
        "KRG2209",
        `Unknown composed class '${name}'. composes references classes in this module.`,
      );
    if (resolving.has(name))
      fail(origin ?? rule, "KRG2209", `Cyclic class composition involving '${name}'.`);
    resolving.add(name);
    const result: StyleDeclaration[] = [];
    try {
      for (const declaration of declarations(rule).filter((item) => item.prop === "composes")) {
        const names = postcss.list.space(declaration.value);
        if (!names.length || names.some((part) => !/^[A-Za-z_][A-Za-z0-9_-]*$/.test(part)))
          fail(
            declaration,
            "KRG2209",
            "composes requires space-separated local class names; cross-module composition uses className arrays.",
          );
        for (const parent of names) {
          const inherited = resolveClass(parent, declaration).declarations;
          if (result.length + inherited.length > 100_000)
            fail(declaration, "KRG2209", "Class composition exceeds 100000 expanded declarations.");
          result.push(...inherited);
        }
      }
      for (const declaration of declarations(rule)) {
        if (declaration.prop === "composes") continue;
        const property = Object.hasOwn(STYLE_PROPERTIES, declaration.prop)
          ? STYLE_PROPERTIES[declaration.prop]
          : undefined;
        if (!property)
          fail(
            declaration,
            "KRG2204",
            `Unsupported style property '${declaration.prop}'. Krieg styles use the documented native GUI subset; custom properties belong in :root.`,
          );
        result.push({
          property: property.prop,
          value: value(declaration, property.kind),
          file,
          line: declaration.source?.start?.line ?? 1,
          column: declaration.source?.start?.column ?? 1,
        });
      }
      return (classes[name] = { _krg: "gui-style", name: `${file}#${name}`, declarations: result });
    } finally {
      resolving.delete(name);
    }
  };
  for (const [name, token] of tokens)
    attempt(() => {
      expand(token.value, token, [name]);
    });
  for (const name of rules.keys())
    attempt(() => {
      resolveClass(name);
    });
  const declaration = `// Generated from ${file.replace(/[\r\n]/g, " ")}; run krieg world after editing styles.\nimport type { GuiClass } from "krieg-lang/ui";\ndeclare const styles: {\n${[
    ...rules.keys(),
  ]
    .map((name) => {
      const keys = [...new Set(classes[name]?.declarations.map((item) => item.property) ?? [])];
      return `  readonly ${JSON.stringify(name)}: GuiClass<{ ${keys.map((key) => `readonly ${JSON.stringify(key)}: ${key === "spriteType" ? "string" : "unknown"};`).join(" ")} }>;`;
    })
    .join("\n")}\n};\nexport default styles;\n`;
  return { classes, declaration, diagnostics };
}
