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
interface CompileOutputBase {
  path: string;
  sourceFile: string;
  representation: "semantic" | "schema-native" | "ordered-pdx" | "structured-data";
}
export interface PdxCompileOutput extends CompileOutputBase {
  format: "pdx";
  document: PdxDocument;
}
export interface LuaCompileOutput extends CompileOutputBase {
  format: "lua";
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
  /** Explicitly resolved .krg.ts package entry points. */
  moduleFiles?: Record<string, string>;
  /** In-memory source overrides, keyed by absolute or root-relative filename. */
  sources?: Record<string, string>;
  schema?: CwtSchema;
  include?: string[];
  maxExpansion?: number;
  /** Project batch drivers set false and compile each source as an entry exactly once. */
  emitDependencies?: boolean;
}
