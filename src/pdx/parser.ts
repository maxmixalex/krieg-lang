import type { PdxAtom, PdxItem, PdxOperator, PdxParseResult, PdxValue, SourceSpan } from "./ast.js";
import { lexPdx, type PdxToken } from "./lexer.js";
export interface ParsePdxOptions {
  sourceName?: string;
  retainSource?: boolean;
  maxDepth?: number;
}
const colorTags = new Set(["rgb", "rgba", "hsv", "hsv360"]);
export function parsePdx(source: string, options: ParsePdxOptions = {}): PdxParseResult {
  const { tokens, diagnostics } = lexPdx(source, options.sourceName);
  let i = 0;
  const maxDepth = options.maxDepth ?? 512;
  const error = (code: string, message: string, span: SourceSpan) =>
    diagnostics.push({ code, severity: "error", message, sourceName: options.sourceName, span });
  const atomOf = (token: PdxToken): PdxAtom => ({
    kind: "atom",
    text: token.text,
    quoted: token.quoted,
    span: token.span,
  });
  function value(depth: number): PdxValue | undefined {
    const token = tokens[i++];
    if (!token) return undefined;
    if (token.kind === "atom") {
      const atom = atomOf(token);
      if (!token.quoted && colorTags.has(token.text.toLowerCase()) && tokens[i]?.kind === "open") {
        const child = value(depth);
        if (child?.kind === "block")
          return {
            kind: "tagged",
            tag: atom,
            value: child,
            span: { ...token.span, end: child.span?.end ?? token.span.end },
          };
      }
      return atom;
    }
    if (token.kind === "open") {
      if (depth >= maxDepth) {
        error("PDX_DEPTH_LIMIT", `Nesting exceeds ${maxDepth}`, token.span);
        let balance = 1;
        while (i < tokens.length && balance > 0) {
          const t = tokens[i++]!;
          if (t.kind === "open") balance++;
          if (t.kind === "close") balance--;
        }
        return { kind: "block", items: [], span: token.span };
      }
      const items = body(true, depth + 1);
      return {
        kind: "block",
        items,
        span: { ...token.span, end: tokens[i - 1]?.span.end ?? token.span.end },
      };
    }
    error("PDX_EXPECTED_VALUE", `Expected value, received ${token.text}`, token.span);
    return undefined;
  }
  function body(nested: boolean, depth: number): PdxItem[] {
    const items: PdxItem[] = [];
    while (i < tokens.length) {
      const token = tokens[i]!;
      if (token.kind === "close") {
        i++;
        if (nested) return items;
        error("PDX_UNEXPECTED_CLOSE", "Unexpected closing brace", token.span);
        continue;
      }
      // Font color tables can use an unquoted punctuation key: < = { 1 2 3 }.
      if (
        (token.kind === "atom" || (token.kind === "operator" && tokens[i + 1]?.text === "=")) &&
        tokens[i + 1]?.kind === "operator"
      ) {
        i += 2;
        const operator = tokens[i - 1]!;
        if (!tokens[i] || tokens[i]!.kind === "close" || tokens[i]!.kind === "operator") {
          error(
            "PDX_MISSING_VALUE",
            `Missing value after ${token.text} ${operator.text}`,
            operator.span,
          );
          continue;
        }
        const child = value(depth);
        if (child)
          items.push({
            kind: "property",
            key: atomOf(token),
            operator: operator.text as PdxOperator,
            value: child,
            span: { ...token.span, end: child.span?.end ?? token.span.end },
          });
      } else {
        const child = value(depth);
        if (child) items.push(child);
      }
    }
    if (nested)
      error(
        "PDX_UNCLOSED_BLOCK",
        "Unclosed block; expected }",
        tokens[tokens.length - 1]?.span ?? {
          start: source.length,
          end: source.length,
          line: 1,
          column: 1,
        },
      );
    return items;
  }
  const items = body(false, 0);
  return {
    document: {
      kind: "document",
      items,
      sourceName: options.sourceName,
      ...(options.retainSource === false ? {} : { source }),
    },
    diagnostics,
  };
}
