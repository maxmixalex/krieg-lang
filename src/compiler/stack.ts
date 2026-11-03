import type ts from "typescript";
import * as pdx from "../pdx/ast.js";
import { guiElements, type GuiElementValue } from "./scripted-window.js";

/** A bounded compile-time flow over explicit engine dimensions. */
export function stackElements(
  props: Record<string, unknown>,
  node: ts.Node,
  fail: (node: ts.Node, code: string, message: string) => never,
  mark: (position: pdx.PdxProperty) => void,
): GuiElementValue[] {
  const direction = props.direction ?? "vertical";
  const gap = props.gap ?? 0;
  const start = (props.position ?? { x: 0, y: 0 }) as { x?: unknown; y?: unknown };
  if (!["vertical", "horizontal"].includes(String(direction)))
    fail(node, "KRG2214", "Stack direction must be vertical or horizontal.");
  if (typeof gap !== "number" || !Number.isFinite(gap) || gap < 0)
    fail(node, "KRG2214", "Stack gap must be a finite, nonnegative number.");
  if (
    typeof start.x !== "number" ||
    typeof start.y !== "number" ||
    !Number.isFinite(start.x) ||
    !Number.isFinite(start.y)
  )
    fail(node, "KRG2214", "Stack position requires finite numeric x and y.");
  let cursor = 0;
  return guiElements(props.children, node, fail).map((child) => {
    const origin = child.source ?? node;
    const block = child.property.value;
    if (block.kind !== "block")
      fail(origin, "KRG2214", "Stack children must be native GUI controls.");
    const field = (key: string): pdx.PdxValue | undefined =>
      block.items.find(
        (item): item is pdx.PdxProperty => item.kind === "property" && item.key.text === key,
      )?.value;
    if (field("position"))
      fail(
        origin,
        "KRG2214",
        "Stack assigns child positions. Put the group position on Stack and remove child position styles/props.",
      );
    for (const [key, expected] of [
      ["orientation", "UPPER_LEFT"],
      ["origo", "upper_left"],
      ["scale", "1"],
      ["rotation", "0"],
    ]) {
      const value = field(key);
      if (value && (value.kind !== "atom" || value.text !== expected))
        fail(
          origin,
          "KRG2214",
          "Stack children require upper-left anchoring, scale 1 and rotation 0.",
        );
    }
    const size = field("size");
    if (!size || size.kind !== "block")
      fail(
        origin,
        "KRG2214",
        "Stack children need an explicit numeric size; native text measurement and sprite dimensions are not inferred.",
      );
    const dimension = direction === "vertical" ? ["height", "y"] : ["width", "x"];
    const extent = size.items.find(
      (item): item is pdx.PdxProperty =>
        item.kind === "property" && dimension.includes(item.key.text),
    )?.value;
    if (
      !extent ||
      extent.kind !== "atom" ||
      extent.quoted ||
      !/^\d+(?:\.\d+)?$/.test(extent.text) ||
      !Number.isFinite(Number(extent.text))
    )
      fail(
        origin,
        "KRG2214",
        "Stack requires a nonnegative numeric child size along its direction; percentages and @constants are not measured.",
      );
    const position = pdx.property(
      "position",
      pdx.block([
        pdx.property(
          "x",
          pdx.atom(String((start.x as number) + (direction === "horizontal" ? cursor : 0))),
        ),
        pdx.property(
          "y",
          pdx.atom(String((start.y as number) + (direction === "vertical" ? cursor : 0))),
        ),
      ]),
    );
    mark(position);
    cursor += Number(extent.text) + gap;
    if (!Number.isFinite(cursor))
      fail(origin, "KRG2214", "Stack coordinates exceed finite numeric limits.");
    return {
      ...child,
      property: { ...child.property, value: pdx.block([...block.items, position]) },
    };
  });
}
