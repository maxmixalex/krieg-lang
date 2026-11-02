import ts from "typescript";
import * as pdx from "../pdx/index.js";
import type { PdxDiagnostic, PdxDocument, PdxFile, PdxItem, PdxValue } from "../pdx/index.js";
export interface ImportPdxOptions {
  outputPath: string;
  sourceName?: string;
}
export interface ImportedKrieg {
  source: string;
  document: PdxDocument;
  diagnostics: PdxDiagnostic[];
  representation: "ordered-pdx";
}
const literal = (text: string): string =>
  JSON.stringify(text)
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
/** Editable structural migration. It deliberately does not claim game-semantic typing. */
export function importDocumentToKrieg(document: PdxDocument, options: ImportPdxOptions): string {
  function item(node: PdxItem, depth: number): string {
    if (node.kind === "atom")
      return `pdx.atom(${literal(node.text)}${node.quoted ? ", true" : ""})`;
    if (node.kind === "tagged")
      return `pdx.tagged(${item(node.tag, depth)}, ${item(node.value, depth)})`;
    if (node.kind === "property")
      return `pdx.property(${item(node.key, depth)}, ${item(node.value, depth)}${node.operator === "=" ? "" : `, ${literal(node.operator)}`})`;
    return `pdx.block(${items(node.items, depth)})`;
  }
  function items(nodes: PdxItem[], depth: number): string {
    return nodes.length
      ? `[\n${nodes.map((n) => `${"  ".repeat(depth + 1)}${item(n, depth + 1)}`).join(",\n")}\n${"  ".repeat(depth)}]`
      : "[]";
  }
  return `// Editable ordered PDX import. Game-semantic typing is not inferred.\nimport * as pdx from 'krieg-lang/pdx';\n\nexport default pdx.file(${literal(options.outputPath)}, pdx.document(${items(document.items, 0)}));\n`;
}
export function importPdxToKrieg(text: string, options: ImportPdxOptions): ImportedKrieg {
  const parsed = pdx.parsePdx(text, { sourceName: options.sourceName });
  return {
    source: parsed.diagnostics.some((d) => d.severity === "error")
      ? ""
      : importDocumentToKrieg(parsed.document, options),
    document: parsed.document,
    diagnostics: parsed.diagnostics,
    representation: "ordered-pdx",
  };
}
export interface RecompiledImport {
  file?: PdxFile;
  diagnostics: { code: string; message: string; line?: number; column?: number }[];
}
/** Strict, non-executing evaluator for the constructor-only migration format.
 * Separate from the main compiler's TypeScript program/game semantic checking.
 */
export function recompileImportedKrieg(
  source: string,
  sourceName = "imported.krg.ts",
): RecompiledImport {
  const sf = ts.createSourceFile(
    sourceName,
    source,
    ts.ScriptTarget.ES2022,
    true,
    ts.ScriptKind.TS,
  );
  const diagnostics: RecompiledImport["diagnostics"] = [];
  const fail = (node: ts.Node, message: string): never => {
    const pos = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    const error = new Error(message);
    diagnostics.push({
      code: "KRG_IMPORT_CONSTRUCTOR",
      message,
      line: pos.line + 1,
      column: pos.character + 1,
    });
    throw error;
  };
  const syntax =
    (sf as ts.SourceFile & { parseDiagnostics?: readonly ts.Diagnostic[] }).parseDiagnostics ?? [];
  for (const d of syntax)
    diagnostics.push({
      code: `TS${d.code}`,
      message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
    });
  if (diagnostics.length) return { diagnostics };
  function evaluate(node: ts.Expression): unknown {
    if (ts.isStringLiteral(node)) return node.text;
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (ts.isArrayLiteralExpression(node)) return node.elements.map((e) => evaluate(e));
    if (
      !ts.isCallExpression(node) ||
      !ts.isPropertyAccessExpression(node.expression) ||
      !ts.isIdentifier(node.expression.expression) ||
      node.expression.expression.text !== "pdx" ||
      node.typeArguments?.length
    )
      return fail(node, "Only literal pdx constructor calls are allowed in structural imports");
    const name = node.expression.name.text,
      args = node.arguments.map(evaluate);
    const isAtom = (v: unknown): v is pdx.PdxAtom =>
      typeof v === "object" && v !== null && (v as pdx.PdxAtom).kind === "atom";
    const isValue = (v: unknown): v is PdxValue =>
      typeof v === "object" &&
      v !== null &&
      ["atom", "block", "tagged"].includes((v as PdxValue).kind);
    const isItem = (v: unknown): v is PdxItem =>
      isValue(v) || (typeof v === "object" && v !== null && (v as PdxItem).kind === "property");
    if (
      name === "atom" &&
      args.length >= 1 &&
      args.length <= 2 &&
      typeof args[0] === "string" &&
      (args[1] === undefined || typeof args[1] === "boolean")
    )
      return pdx.atom(args[0], args[1] as boolean | undefined);
    if (name === "quoted" && args.length === 1 && typeof args[0] === "string")
      return pdx.quoted(args[0]);
    if (name === "string" && args.length === 1 && typeof args[0] === "string")
      return pdx.string(args[0]);
    if (
      (name === "block" || name === "document") &&
      args.length === 1 &&
      Array.isArray(args[0]) &&
      args[0].every(isItem)
    )
      return name === "block" ? pdx.block(args[0]) : pdx.document(args[0]);
    if (
      (name === "property" || name === "entry") &&
      args.length >= 2 &&
      args.length <= 3 &&
      (isAtom(args[0]) || typeof args[0] === "string") &&
      isValue(args[1]) &&
      (args[2] === undefined || pdx.operators.has(args[2] as pdx.PdxOperator))
    )
      return pdx.property(args[0], args[1], args[2] as pdx.PdxOperator | undefined);
    if (
      name === "tagged" &&
      args.length === 2 &&
      (isAtom(args[0]) || typeof args[0] === "string") &&
      typeof args[1] === "object" &&
      args[1] !== null &&
      (args[1] as PdxValue).kind === "block"
    )
      return pdx.tagged(args[0], args[1] as pdx.PdxBlock);
    if (
      name === "file" &&
      args.length === 2 &&
      typeof args[0] === "string" &&
      typeof args[1] === "object" &&
      args[1] !== null &&
      (args[1] as PdxDocument).kind === "document"
    )
      return pdx.file(args[0], args[1] as PdxDocument);
    return fail(node, `Invalid arguments or unsupported constructor pdx.${name}`);
  }
  let imported = false,
    result: PdxFile | undefined;
  try {
    for (const statement of sf.statements) {
      if (
        ts.isImportDeclaration(statement) &&
        ts.isStringLiteral(statement.moduleSpecifier) &&
        statement.moduleSpecifier.text === "krieg-lang/pdx" &&
        statement.importClause?.namedBindings &&
        !statement.importClause.isTypeOnly &&
        !statement.importClause.name &&
        ts.isNamespaceImport(statement.importClause.namedBindings) &&
        statement.importClause.namedBindings.name.text === "pdx" &&
        !imported
      ) {
        imported = true;
        continue;
      }
      if (ts.isExportAssignment(statement) && !statement.isExportEquals && imported && !result) {
        const value = evaluate(statement.expression);
        if (typeof value !== "object" || value === null || (value as PdxFile).kind !== "file")
          fail(statement, "Default export must be pdx.file(path, document)");
        result = value as PdxFile;
        continue;
      }
      fail(statement, "Only one pdx namespace import and one default file export are supported");
    }
    if (!result)
      diagnostics.push({ code: "KRG_IMPORT_NO_FILE", message: "No default pdx.file export" });
  } catch (error) {
    if (!diagnostics.length)
      diagnostics.push({
        code: "KRG_IMPORT_INTERNAL",
        message: error instanceof Error ? error.message : String(error),
      });
  }
  return { file: diagnostics.length ? undefined : result, diagnostics };
}
