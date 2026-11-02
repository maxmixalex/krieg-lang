import type { PdxDiagnostic, PdxOperator, SourceSpan } from "./ast.js";
export interface PdxToken {
  kind: "atom" | "open" | "close" | "operator";
  text: string;
  quoted: boolean;
  span: SourceSpan;
}
export interface PdxLexResult {
  tokens: PdxToken[];
  diagnostics: PdxDiagnostic[];
}
export const operators = new Set<PdxOperator>(["=", "<", ">", "<=", ">=", "!=", "==", "?="]);
/** Lex PDX without normalizing numbers, dates, escapes, macros, or quoted keys. */
export function lexPdx(source: string, sourceName?: string): PdxLexResult {
  const tokens: PdxToken[] = [],
    diagnostics: PdxDiagnostic[] = [];
  let i = 0,
    line = 1,
    column = 1;
  const advance = () => {
    const c = source[i++]!;
    if (c === "\n") {
      line++;
      column = 1;
    } else column++;
    return c;
  };
  while (i < source.length) {
    const c = source[i]!;
    if (/\s|\uFEFF/.test(c)) {
      advance();
      continue;
    }
    if (c === "#") {
      while (i < source.length && source[i] !== "\n") advance();
      continue;
    }
    const span: SourceSpan = { start: i, end: i, line, column };
    if (c === "{" || c === "}") {
      advance();
      span.end = i;
      tokens.push({ kind: c === "{" ? "open" : "close", text: c, quoted: false, span });
      continue;
    }
    if (c === '"') {
      advance();
      const start = i;
      let closed = false;
      while (i < source.length) {
        const ch = advance();
        if (ch === "\\" && i < source.length) advance();
        else if (ch === '"') {
          closed = true;
          break;
        }
      }
      span.end = i;
      tokens.push({
        kind: "atom",
        text: source.slice(start, closed ? i - 1 : i),
        quoted: true,
        span,
      });
      if (!closed)
        diagnostics.push({
          code: "PDX_UNTERMINATED_STRING",
          severity: "error",
          message: "Unterminated quoted token",
          sourceName,
          span,
        });
      continue;
    }
    if ("=<>".includes(c) || ((c === "?" || c === "!") && source[i + 1] === "=")) {
      let text = advance();
      if (source[i] === "=") text += advance();
      span.end = i;
      if (!operators.has(text as PdxOperator))
        diagnostics.push({
          code: "PDX_INVALID_OPERATOR",
          severity: "error",
          message: `Unsupported operator ${text}`,
          sourceName,
          span,
        });
      tokens.push({ kind: "operator", text, quoted: false, span });
      continue;
    }
    const start = i;
    // @[...] arithmetic is one PDX value even when its expression contains spaces.
    if (c === "@" && source[i + 1] === "[") {
      advance();
      advance();
      let depth = 1;
      while (i < source.length && depth > 0) {
        const ch = advance();
        if (ch === "[") depth++;
        if (ch === "]") depth--;
      }
      if (depth !== 0)
        diagnostics.push({
          code: "PDX_UNTERMINATED_EXPRESSION",
          severity: "error",
          message: "Unterminated @[ ... ] expression",
          sourceName,
          span: { ...span, end: i },
        });
    } else {
      while (
        i < source.length &&
        !/[\s\uFEFF{}#"=<>]/.test(source[i]!) &&
        !((source[i] === "?" || source[i] === "!") && source[i + 1] === "=")
      )
        advance();
    }
    span.end = i;
    tokens.push({ kind: "atom", text: source.slice(start, i), quoted: false, span });
  }
  return { tokens, diagnostics };
}
