import type { PdxAtom, PdxDocument, PdxItem, PdxValue } from "./ast.js";
export interface EmitPdxOptions {
  format?: "canonical" | "original";
  indent?: string;
  newline?: string;
}
export function emitPdx(document: PdxDocument, options: EmitPdxOptions = {}): string {
  if (options.format === "original") {
    if (document.source === undefined) throw new Error("Original source was not retained");
    return document.source;
  }
  const unit = options.indent ?? "\t",
    newline = options.newline ?? "\n";
  const atom = (value: PdxAtom) => (value.quoted ? `"${value.text}"` : value.text);
  function value(value: PdxValue, depth: number): string {
    if (value.kind === "atom") return atom(value);
    if (value.kind === "tagged")
      return `${atom(value.tag)} ${valueOfBlock(value.value.items, depth)}`;
    return valueOfBlock(value.items, depth);
  }
  function valueOfBlock(items: PdxItem[], depth: number): string {
    return items.length
      ? `{${newline}${items.map((item) => unit.repeat(depth + 1) + itemText(item, depth + 1)).join(newline)}${newline}${unit.repeat(depth)}}`
      : "{ }";
  }
  function itemText(item: PdxItem, depth: number): string {
    return item.kind === "property"
      ? `${atom(item.key)} ${item.operator} ${value(item.value, depth)}`
      : value(item, depth);
  }
  return document.items.length
    ? document.items.map((item) => itemText(item, 0)).join(newline) + newline
    : "";
}
/** Semantic fingerprint ignores trivia/spans but retains duplicates/order/quoting/operators. */
export function semanticPdx(document: PdxDocument): unknown {
  const value = (item: PdxItem): unknown =>
    item.kind === "atom"
      ? ["atom", item.text, item.quoted]
      : item.kind === "block"
        ? ["block", item.items.map(value)]
        : item.kind === "tagged"
          ? ["tagged", value(item.tag), value(item.value)]
          : ["property", value(item.key), item.operator, value(item.value)];
  return document.items.map(value);
}
export function comparePdxSemantic(a: PdxDocument, b: PdxDocument): boolean {
  return JSON.stringify(semanticPdx(a)) === JSON.stringify(semanticPdx(b));
}
