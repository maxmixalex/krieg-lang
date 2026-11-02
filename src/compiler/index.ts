import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadBundledSchema } from "../schema/index.js";
import { MINIMAL_LIB } from "./minimal-lib.js";
import { generateCommandDeclarations, PDX_DECLARATIONS } from "./sdk.js";
import { Lowerer } from "./lower.js";
import { emitPdx, comparePdxSemantic } from "../pdx/emitter.js";
import { parsePdx } from "../pdx/parser.js";
import type { CompileOptions, CompileOutput, CompileResult, KriegDiagnostic } from "./types.js";

export * from "./types.js";
export type * from "../schema/types.js";
export { MINIMAL_LIB } from "./minimal-lib.js";
export { generateCommandDeclarations } from "./sdk.js";

/** Serialize the compiler's explicitly discriminated native output formats. */
export function emitCompileOutput(output: CompileOutput): string {
  return output.format === "lua" ? output.text : emitPdx(output.document);
}

function sdkSource(relative = "sdk/index"): string {
  const directory = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.join(directory, `../${relative}.d.ts`),
    path.join(directory, `../${relative}.ts`),
  ];
  const file = candidates.find((candidate) => fs.existsSync(candidate));
  if (!file) throw new Error("Krieg SDK declarations are missing from this installation.");
  return fs.readFileSync(file, "utf8");
}

/** Type-check and statically lower a project. User source is never executed. */
export function compileProject(options: CompileOptions): CompileResult {
  const rootDir = path.resolve(options.rootDir);
  const schema = options.schema ?? loadBundledSchema();
  const virtualRoot = path.join(rootDir, ".krieg-compiler-virtual");
  const virtual = new Map<string, string>();
  const modules = new Map<string, string>();
  const addModule = (name: string, source: string): void => {
    const file = path.join(virtualRoot, `${name.replace(/[^a-zA-Z0-9._-]/g, "_")}.d.ts`);
    virtual.set(file, source);
    modules.set(name, file);
  };
  const sdk = sdkSource()
    .replace(
      /import type\s*\{[^}]+\}\s*from\s*['"]\.\/commands\.js['"];?/,
      generateCommandDeclarations(schema, false),
    )
    .replace(/['"]\.\.\/pdx\/ast\.js['"]/g, "'krieg-lang/pdx'")
    .replace(/['"]\.\/domains\.js['"]/g, "'krieg-lang/hoi4/domains'")
    .replace(/['"]\.\/defines\.js['"]/g, "'krieg-lang/hoi4/defines'");
  addModule("krieg-lang/hoi4", sdk);
  addModule(
    "krieg-lang/hoi4/domains",
    sdkSource("sdk/domains").replace(/['"]\.\/index\.js['"]/g, "'krieg-lang/hoi4'"),
  );
  addModule(
    "krieg-lang/hoi4/defines",
    sdkSource("sdk/defines").replace(/['"]\.\/index\.js['"]/g, "'krieg-lang/hoi4'"),
  );
  addModule("krieg-lang/pdx", PDX_DECLARATIONS);
  addModule(
    "krieg-lang/ui",
    sdkSource("ui/index")
      .replace(/['"]\.\.\/sdk\/index\.js['"]/g, "'krieg-lang/hoi4'")
      .replace(/['"]\.\/native\.js['"]/g, "'krieg-lang/ui/native'"),
  );
  addModule(
    "krieg-lang/ui/native",
    sdkSource("ui/native")
      .replace(/['"]\.\/index\.js['"]/g, "'krieg-lang/ui'")
      .replace(/['"]\.\.\/sdk\/domains\.js['"]/g, "'krieg-lang/hoi4/domains'"),
  );
  addModule(
    "krieg-lang/ui/jsx-runtime",
    sdkSource("ui/jsx-runtime").replace(/['"]\.\/index\.js['"]/g, "'krieg-lang/ui'"),
  );
  for (const [name, source] of Object.entries(options.virtualModules ?? {}))
    addModule(name, source);
  const libFile = path.join(virtualRoot, "lib.krieg.d.ts");
  virtual.set(libFile, MINIMAL_LIB);
  for (const [file, source] of Object.entries(options.sources ?? {}))
    virtual.set(path.resolve(rootDir, file), source);
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    noLib: true,
    noEmit: true,
    types: [],
    skipLibCheck: false,
    allowImportingTsExtensions: true,
    noUncheckedIndexedAccess: false,
    exactOptionalPropertyTypes: true,
    jsx: ts.JsxEmit.Preserve,
    jsxImportSource: "krieg-lang/ui",
  };
  const host = ts.createCompilerHost(compilerOptions);
  const baseRead = host.readFile.bind(host);
  const baseExists = host.fileExists.bind(host);
  host.readFile = (file) => virtual.get(path.resolve(file)) ?? baseRead(file);
  host.fileExists = (file) => virtual.has(path.resolve(file)) || baseExists(file);
  host.getSourceFile = (file, languageVersion) => {
    const text = host.readFile(file);
    return text === undefined ? undefined : ts.createSourceFile(file, text, languageVersion, true);
  };
  host.resolveModuleNames = (names, containingFile) =>
    names.map((name) => {
      const supplied = modules.get(name) ?? options.moduleFiles?.[name];
      if (supplied)
        return {
          resolvedFileName: path.resolve(rootDir, supplied),
          extension: supplied.endsWith(".d.ts")
            ? ts.Extension.Dts
            : supplied.endsWith(".tsx")
              ? ts.Extension.Tsx
              : ts.Extension.Ts,
        };
      if (!name.startsWith(".")) return undefined;
      const base = path.resolve(path.dirname(containingFile), name);
      const candidates = [
        base,
        `${base}.krg.ts`,
        `${base}.krg.tsx`,
        `${base}.ts`,
        `${base}.tsx`,
        path.join(base, "index.krg.ts"),
        path.join(base, "index.krg.tsx"),
      ];
      if (/\.js$/.test(base))
        candidates.push(
          base.replace(/\.js$/, ".ts"),
          base.replace(/\.js$/, ".krg.ts"),
          base.replace(/\.js$/, ".tsx"),
          base.replace(/\.js$/, ".krg.tsx"),
        );
      const found = candidates.find((candidate) => host.fileExists(candidate));
      return found
        ? {
            resolvedFileName: found,
            extension: found.endsWith(".d.ts")
              ? ts.Extension.Dts
              : found.endsWith(".tsx")
                ? ts.Extension.Tsx
                : ts.Extension.Ts,
          }
        : undefined;
    });
  const files = options.files.map((file) => path.resolve(rootDir, file));
  const program = ts.createProgram([...files, libFile], compilerOptions, host);
  const diagnostics: KriegDiagnostic[] = ts.getPreEmitDiagnostics(program).map((diagnostic) => {
    const position =
      diagnostic.file && diagnostic.start !== undefined
        ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
        : undefined;
    return {
      code: `TS${diagnostic.code}`,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
      severity: diagnostic.category === ts.DiagnosticCategory.Warning ? "warning" : "error",
      ...(diagnostic.file ? { file: diagnostic.file.fileName } : {}),
      ...(position ? { line: position.line + 1, column: position.character + 1 } : {}),
    };
  });
  const lowerer = new Lowerer(program, { ...options, rootDir, schema }, diagnostics);
  lowerer.validate();
  if (diagnostics.some((diagnostic) => diagnostic.severity === "error"))
    return { success: false, outputs: [], diagnostics };
  const outputs = lowerer.lower();
  for (const output of outputs) {
    if (output.format !== "pdx") continue;
    const encoded = emitPdx(output.document);
    const parsed = parsePdx(encoded, { sourceName: output.path, retainSource: false });
    if (
      parsed.diagnostics.some((diagnostic) => diagnostic.severity === "error") ||
      !comparePdxSemantic(output.document, parsed.document)
    ) {
      diagnostics.push({
        code: "KRG3001",
        severity: "error",
        file: output.sourceFile,
        message: `Output '${output.path}' contains an invalid or ambiguous PDX token. Use pdx.string for ordinary quoted text and preserve raw tokens only when they round-trip exactly.`,
      });
    }
  }
  const success = !diagnostics.some((diagnostic) => diagnostic.severity === "error");
  return { success, outputs: success ? outputs : [], diagnostics };
}

export function compileSource(
  source: string,
  options: Omit<CompileOptions, "rootDir" | "files"> & { fileName?: string; rootDir?: string } = {},
): CompileResult {
  const rootDir = path.resolve(options.rootDir ?? process.cwd());
  const fileName = path.resolve(rootDir, options.fileName ?? "main.krg.ts");
  return compileProject({
    ...options,
    rootDir,
    files: [fileName],
    sources: { ...options.sources, [fileName]: source },
  });
}
