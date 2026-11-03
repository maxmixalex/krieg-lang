import type ts from "typescript";
import type { PdxDocument, PdxItem } from "../pdx/ast.js";
import type { AuthorLocation, AuthorOrigin, NativeLineOrigin, TracePoint } from "./types.js";

/** Walk entries in native order, preserving duplicate keys and nested mixed blocks. */
function visit(items: readonly PdxItem[], fn: (item: PdxItem, ordinal: number) => void): void {
  let ordinal = 0;
  function descend(list: readonly PdxItem[]): void {
    for (const item of list) {
      fn(item, ordinal++);
      const value = item.kind === "property" ? item.value : item;
      if (value.kind === "block") descend(value.items);
      if (value.kind === "tagged") descend(value.value.items);
    }
  }
  descend(items);
}

export class NativeOrigins {
  private readonly marks = new WeakMap<PdxItem, AuthorOrigin>();
  private readonly locations = new WeakMap<ts.Node, AuthorLocation>();
  readonly helpers: ts.Node[] = [];
  private location(node: ts.Node): AuthorLocation {
    const cached = this.locations.get(node);
    if (cached) return cached;
    const sf = node.getSourceFile();
    const pos = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    const location = { source: sf.fileName, line: pos.line + 1, column: pos.character + 1 };
    this.locations.set(node, location);
    return location;
  }
  mark(
    items: readonly PdxItem[],
    node: ts.Node,
    precision: AuthorOrigin["precision"],
    first = 0,
  ): void {
    let origin: AuthorOrigin | undefined;
    for (let i = first; i < items.length; i++) {
      const item = items[i];
      if (this.marks.has(item)) continue;
      origin ??= {
        ...this.location(node),
        precision,
        ...(this.helpers.length
          ? {
              via: this.helpers
                .slice(-6)
                .reverse()
                .map((n) => this.location(n)),
            }
          : {}),
      };
      this.marks.set(item, origin);
    }
  }
  declaration(node: ts.Node): AuthorOrigin {
    return {
      ...this.location(node),
      precision: "declaration",
      ...(this.helpers.length
        ? {
            via: this.helpers
              .slice(-6)
              .reverse()
              .map((n) => this.location(n)),
          }
        : {}),
    };
  }
  markStyle(item: PdxItem, location: AuthorLocation, use: ts.Node): void {
    this.marks.set(item, {
      ...location,
      precision: "style",
      via: [
        this.location(use),
        ...this.helpers
          .slice(-5)
          .reverse()
          .map((n) => this.location(n)),
      ],
    });
  }
  collect(doc: PdxDocument): TracePoint[] {
    const points: TracePoint[] = [];
    visit(doc.items, (item, ordinal) => {
      const origin = this.marks.get(item);
      if (origin) points.push({ ordinal, origin });
    });
    return points;
  }
}

/** Use the spans of the *actual serialized file*, including multiline strings and closing braces. */
export function nativeLineOrigins(
  doc: PdxDocument,
  text: string,
  points: readonly TracePoint[],
): NativeLineOrigin[] {
  if (!points.length) return [];
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) starts.push(i + 1);
  function line(offset: number) {
    let lo = 0,
      hi = starts.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (starts[mid] <= offset) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  const marks = new Map(points.map((p) => [p.ordinal, p.origin]));
  const ranges: NativeLineOrigin[] = [];
  visit(doc.items, (item, ordinal) => {
    const origin = marks.get(ordinal);
    if (origin && item.span)
      ranges.push({
        from: item.span.line,
        to: line(Math.max(item.span.start, item.span.end - 1)),
        ...origin,
      });
  });
  return ranges;
}
