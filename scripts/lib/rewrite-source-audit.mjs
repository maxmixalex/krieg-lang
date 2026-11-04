import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import ts from "typescript";

const sourceExtension = /\.krg\.(?:ts|tsx|css)$/;
const typedEntryPoints = new Set(["krieg-lang/hoi4", "krieg-lang/ui"]);
const nativeEscapes = new Set([
  "SourceFile",
  "PdxFile",
  "DataFile",
  "RawFile",
  "cwt",
  "MetaEffect",
]);

// These worked ports use named SDK imports and local authored modules. Keep
// private input parsing and generic native writers outside their source graph.
export function auditRewriteSources(sourceDirectory) {
  const root = resolve(sourceDirectory);
  let files = 0;
  let lines = 0;
  let tableFiles = 0;

  function inspectModule(node, file) {
    const module = node.moduleSpecifier;
    if (!module) return;
    if (!ts.isStringLiteral(module)) throw Error("Static source import required: " + file);
    const name = module.text;
    if (name.startsWith(".")) {
      const target = resolve(file, "..", name);
      const withinRoot = relative(root, target);
      if (withinRoot.startsWith("..") || !/\.krg(?:\.(?:ts|tsx|css))?$/.test(target))
        throw Error("Local imports must remain in the authored source tree: " + file);
      return;
    }
    if (!typedEntryPoints.has(name))
      throw Error("Only typed SDK entry points are permitted in a semantic rewrite: " + file);
    const bindings = ts.isImportDeclaration(node)
      ? node.importClause?.namedBindings
      : node.exportClause;
    if (
      !bindings ||
      (!ts.isNamedImports(bindings) && !ts.isNamedExports(bindings)) ||
      (ts.isImportDeclaration(node) && node.importClause?.name)
    )
      throw Error("Named SDK imports and exports are required for source auditing: " + file);
    for (const symbol of bindings.elements)
      if (nativeEscapes.has(symbol.propertyName?.text ?? symbol.name.text))
        throw Error("Native syntax escapes cannot establish a semantic rewrite: " + file);
  }

  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name);
      if (entry.isSymbolicLink())
        throw Error("Source links cannot bypass source auditing: " + file);
      if (entry.isDirectory()) {
        walk(file);
        continue;
      }
      if (!sourceExtension.test(file)) continue;
      files++;
      const source = readFileSync(file, "utf8");
      lines += source.split(/\r\n|\r|\n/).length - (source.endsWith("\n") ? 1 : 0);
      if (/facts|catalogue|display|technologies|palette|data/.test(entry.name)) tableFiles++;
      if (file.endsWith(".css")) continue;
      const unit = ts.createSourceFile(
        file,
        source,
        ts.ScriptTarget.Latest,
        true,
        file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
      );
      function visit(node) {
        if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) inspectModule(node, file);
        if (
          ts.isImportEqualsDeclaration(node) ||
          (ts.isCallExpression(node) &&
            (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
              (ts.isIdentifier(node.expression) && node.expression.text === "require")))
        )
          throw Error("Static source imports are required for source auditing: " + file);
        ts.forEachChild(node, visit);
      }
      visit(unit);
    }
  }

  walk(root);
  return { files, linesIncludingCommentsAndData: lines, tableFilenameCount: tableFiles };
}
