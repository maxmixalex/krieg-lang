import type { PdxDocument } from "../pdx/ast.js";
import type { CwtSchema } from "../schema/types.js";

export interface KriegDiagnostic {
  code: string;
  message: string;
  severity: "error" | "warning";
  file?: string;
  line?: number;
  column?: number;
}
/** One-based source position from the program actually compiled. */
export interface AuthorLocation {
  source: string;
  line: number;
  column: number;
}
/** Origin of a native item, with the most specific source the lowerer can identify. */
export interface AuthorOrigin extends AuthorLocation {
  precision: "expression" | "declaration" | "style";
  /** Expansion call sites, nearest first (up to six). */
  via?: AuthorLocation[];
}
/** Link an entry in the ordered PDX tree (preorder, starting at zero) to its author.
 * These indices refer to the final merged document; do not reuse them after editing the tree. */
export interface TracePoint {
  ordinal: number;
  origin: AuthorOrigin;
}
/** Inclusive, one-based range in the emitted text. Nested ranges can point to more precise expressions. */
export interface NativeLineOrigin extends AuthorOrigin {
  from: number;
  to: number;
}
interface CompileOutputBase {
  path: string;
  sourceFile: string;
  representation: "semantic" | "schema-native" | "ordered-pdx" | "structured-data";
}
export interface PdxCompileOutput extends CompileOutputBase {
  format: "pdx";
  document: PdxDocument;
  /** Sparse entry origins, when source tracing was requested. */
  tracePoints?: TracePoint[];
}
export interface LuaCompileOutput extends CompileOutputBase {
  format: "lua";
  /** Declaration ranges for real Lua outputs (including merged files). */
  lineOrigins?: NativeLineOrigin[];
  text: string;
}
export type CompileOutput = PdxCompileOutput | LuaCompileOutput;
export interface CompileResult {
  success: boolean;
  outputs: CompileOutput[];
  diagnostics: KriegDiagnostic[];
}
export interface CompileOptions {
  rootDir: string;
  files: string[];
  outDir?: string;
  /** Declaration-only module bodies. Never evaluated as JavaScript. */
  virtualModules?: Record<string, string>;
  /** Explicitly resolved .krg.ts, .krg.tsx or .krg.css source-package exports. */
  moduleFiles?: Record<string, string>;
  /** In-memory source overrides, keyed by absolute or root-relative filename. */
  sources?: Record<string, string>;
  schema?: CwtSchema;
  include?: string[];
  maxExpansion?: number;
  /** Record native entry origins for source-level debugging. Project builds enable this automatically. */
  traceSources?: boolean;
  /** Project batch drivers set false and compile each source as an entry exactly once. */
  emitDependencies?: boolean;
}
