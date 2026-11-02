/** Ordered concrete PDX syntax. Objects must never be used as property maps. */
export interface SourceSpan {
  start: number;
  end: number;
  line: number;
  column: number;
}
export type PdxOperator = "=" | "<" | ">" | "<=" | ">=" | "!=" | "==" | "?=";
export interface PdxAtom {
  kind: "atom";
  /** Exact token content, excluding surrounding quotes. */ text: string;
  quoted: boolean;
  span?: SourceSpan;
}
export interface PdxBlock {
  kind: "block";
  items: PdxItem[];
  span?: SourceSpan;
}
export interface PdxTagged {
  kind: "tagged";
  tag: PdxAtom;
  value: PdxBlock;
  span?: SourceSpan;
}
export type PdxValue = PdxAtom | PdxBlock | PdxTagged;
export interface PdxProperty {
  kind: "property";
  key: PdxAtom;
  operator: PdxOperator;
  value: PdxValue;
  span?: SourceSpan;
}
export type PdxItem = PdxProperty | PdxValue;
export interface PdxDocument {
  kind: "document";
  items: PdxItem[];
  sourceName?: string;
  /** Used only by explicit original-source emission, never semantic emission. */ source?: string;
}
export interface PdxDiagnostic {
  code: string;
  severity: "error" | "warning";
  message: string;
  sourceName?: string;
  span: SourceSpan;
}
export interface PdxParseResult {
  document: PdxDocument;
  diagnostics: PdxDiagnostic[];
}
export interface PdxFile {
  kind: "file";
  path: string;
  document: PdxDocument;
}

/** Token content is literal; quoted token escape sequences remain explicit. */
export function atom(text: string, quoted = false): PdxAtom {
  return { kind: "atom", text, quoted };
}
export function quoted(text: string): PdxAtom {
  return atom(text, true);
}
/** Construct a game string from ordinary text, escaping quotes and backslashes. */
export function string(text: string): PdxAtom {
  return quoted(text.replace(/\\/g, "\\\\").replace(/"/g, '\\"'));
}
export function block(items: readonly PdxItem[]): PdxBlock {
  return { kind: "block", items: [...items] };
}
export function property(
  key: string | PdxAtom,
  value: PdxValue,
  operator: PdxOperator = "=",
): PdxProperty {
  return { kind: "property", key: typeof key === "string" ? atom(key) : key, operator, value };
}
export const entry = property;
export function tagged(tag: string | PdxAtom, value: PdxBlock): PdxTagged {
  return { kind: "tagged", tag: typeof tag === "string" ? atom(tag) : tag, value };
}
export function document(items: readonly PdxItem[]): PdxDocument {
  return { kind: "document", items: [...items] };
}
/** Explicit destination path, retaining .gui/.gfx/.asset extensions during migration. */
export function file(path: string, value: PdxDocument): PdxFile {
  return { kind: "file", path, document: value };
}
