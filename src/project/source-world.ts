import { readFileSync } from "node:fs";
import ts from "typescript";
import * as pdx from "../pdx/index.js";
import { recompileImportedKrieg } from "../importer/index.js";
import { gamePath, safeChild, walkFiles } from "./files.js";
import type { KriegConfig, OutputFile, ProjectDiagnostic } from "./types.js";

const discoveryMarker = Symbol("krieg-world-discovery");

interface Intrinsic {
  readonly [discoveryMarker]: "intrinsic";
  readonly module: "sdk" | "pdx" | "states";
  readonly name: string;
}
interface Namespace {
  readonly [discoveryMarker]: "namespace";
  readonly module: Intrinsic["module"];
}
interface Declaration {
  readonly [discoveryMarker]: "declaration";
  readonly path: string;
  readonly document: pdx.PdxDocument;
}
const unknownValue = Symbol("not-statically-discoverable");
const metadataModules = new Map<string, Intrinsic["module"]>([
  ["krieg-lang/hoi4", "sdk"],
  ["krieg-lang/pdx", "pdx"],
  ["@project/states", "states"],
]);
const metadataNames = new Set(["DataFile", "SourceFile", "StateHistory"]);

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function tagged<T extends string>(
  value: unknown,
  kind: T,
): value is Record<string, unknown> & { [discoveryMarker]: T } {
  return record(value) && (value as { [discoveryMarker]?: unknown })[discoveryMarker] === kind;
}

function isMetadataPath(path: string): boolean {
  return /^(common\/country_tags|history\/states)\/.+\.txt$/.test(path.replaceAll("\\", "/"));
}

function containsUnknown(value: unknown): boolean {
  if (value === unknownValue) return true;
  if (Array.isArray(value)) return value.some(containsUnknown);
  return record(value) && Object.values(value).some(containsUnknown);
}

/** Discover declaration metadata without executing source or checking against its own world. */
export function discoverSourceWorld(config: KriegConfig): {
  files: OutputFile[];
  diagnostics: ProjectDiagnostic[];
} {
  const files: OutputFile[] = [];
  const diagnostics: ProjectDiagnostic[] = [];
  for (const file of walkFiles(safeChild(config.rootDir, config.sourceDir))) {
    if (!file.endsWith(".krg.ts")) continue;
    const source = readFileSync(file, "utf8");
    // Canonical imports retain their destination literal. Avoid parsing large event/UI imports.
    if (!/country_tags|history[\\/]+states|StateHistory|DataFile|SourceFile/.test(source)) continue;
    const imported = recompileImportedKrieg(source, file);
    if (imported.file) {
      if (isMetadataPath(imported.file.path)) {
        try {
          const path = gamePath(imported.file.path);
          files.push({
            path,
            source: file,
            bytes: Buffer.from(pdx.emitPdx(imported.file.document)),
            kind: "script",
          });
        } catch (error) {
          diagnostics.push({
            code: "KRG_WORLD_SOURCE",
            severity: "error",
            file,
            message: error instanceof Error ? error.message : String(error),
          });
        }
      }
      continue;
    }
    const syntax = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const syntaxDiagnostics =
      (syntax as ts.SourceFile & { parseDiagnostics?: readonly ts.Diagnostic[] })
        .parseDiagnostics ?? [];
    if (syntaxDiagnostics.length) continue; // The full compiler owns syntax diagnostics.
    const bindings = new Map<string, Intrinsic | Namespace>();
    const constants = new Map<string, ts.Expression>();
    const cache = new Map<string, unknown>();
    const evaluating = new Set<string>();
    const warned = new Set<number>();
    const pendingDocuments = new Map<string, pdx.PdxDocument>();
    let visits = 0;

    function warn(node: ts.Node, message: string): void {
      const start = node.getStart(syntax);
      if (warned.has(start)) return;
      warned.add(start);
      const position = syntax.getLineAndCharacterOfPosition(start);
      diagnostics.push({
        code: "KRG_WORLD_SOURCE",
        severity: "warning",
        file,
        line: position.line + 1,
        column: position.character + 1,
        message: `${message} Declare its exact country tags/state IDs in krgconfig.json world when metadata requires helper expansion.`,
      });
    }

    for (const statement of syntax.statements) {
      if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
        const module = metadataModules.get(statement.moduleSpecifier.text);
        const clause = statement.importClause;
        if (!module || !clause || clause.isTypeOnly || !clause.namedBindings) continue;
        if (ts.isNamespaceImport(clause.namedBindings))
          bindings.set(clause.namedBindings.name.text, { [discoveryMarker]: "namespace", module });
        else
          for (const element of clause.namedBindings.elements) {
            if (!element.isTypeOnly)
              bindings.set(element.name.text, {
                [discoveryMarker]: "intrinsic",
                module,
                name: (element.propertyName ?? element.name).text,
              });
          }
      }
      if (
        ts.isVariableStatement(statement) &&
        statement.declarationList.flags & ts.NodeFlags.Const
      ) {
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name) && declaration.initializer)
            constants.set(declaration.name.text, declaration.initializer);
        }
      }
    }

    function nameValue(name: string): unknown {
      if (cache.has(name)) return cache.get(name);
      const initializer = constants.get(name);
      if (initializer) {
        if (evaluating.has(name)) return unknownValue;
        evaluating.add(name);
        const value = evaluate(initializer);
        evaluating.delete(name);
        cache.set(name, value);
        return value;
      }
      return bindings.get(name) ?? unknownValue;
    }

    function dataValue(value: unknown): pdx.PdxValue | undefined {
      if (tagged(value, "intrinsic") || tagged(value, "namespace") || tagged(value, "declaration"))
        return undefined;
      if (typeof value === "string")
        return /^[^\s{}=#<>!"\\]+$/.test(value) ? pdx.atom(value) : pdx.string(value);
      if (typeof value === "number" && Number.isFinite(value)) return pdx.atom(String(value));
      if (typeof value === "boolean") return pdx.atom(value ? "yes" : "no");
      if (Array.isArray(value)) {
        const items = value.map(dataValue);
        return items.every((item): item is pdx.PdxValue => item !== undefined)
          ? pdx.block(items)
          : undefined;
      }
      if (record(value)) {
        if (value.kind === "state" && typeof value.id === "number")
          return pdx.atom(String(value.id));
        if (value.kind === "country" && typeof value.tag === "string") return pdx.atom(value.tag);
        const items: pdx.PdxItem[] = [];
        for (const [key, item] of Object.entries(value)) {
          const parsed = dataValue(item);
          if (!parsed) return undefined;
          items.push(pdx.property(key, parsed));
        }
        return pdx.block(items);
      }
      return undefined;
    }

    function declaration(path: string, document: pdx.PdxDocument): Declaration {
      return { [discoveryMarker]: "declaration", path, document };
    }

    function call(intrinsic: Intrinsic, node: ts.CallExpression): unknown {
      const args = node.arguments.map((argument) => evaluate(argument));
      if (intrinsic.module === "sdk") {
        if (
          intrinsic.name === "state" &&
          typeof args[0] === "number" &&
          Number.isSafeInteger(args[0]) &&
          args[0] > 0
        )
          return { kind: "state", id: args[0] };
        if (intrinsic.name === "country" && typeof args[0] === "string")
          return { kind: "country", tag: args[0] };
        if (intrinsic.name === "loc" && typeof args[0] === "string") return args[0];
        if (intrinsic.name === "StateHistory") {
          const spec = args[0];
          const reference = record(spec) ? spec.state : undefined;
          if (
            !record(reference) ||
            reference.kind !== "state" ||
            typeof reference.id !== "number" ||
            !Number.isSafeInteger(reference.id) ||
            reference.id <= 0
          ) {
            warn(
              node,
              "StateHistory's state reference is not a statically discoverable positive ID.",
            );
            return unknownValue;
          }
          const outputPath =
            record(spec) && spec.path !== undefined
              ? spec.path
              : `history/states/${reference.id} - Krieg.txt`;
          if (typeof outputPath !== "string") {
            warn(node, "StateHistory's output path is not a literal value.");
            return unknownValue;
          }
          // This projection indexes only a declaration's identity. The compiler supplies the full file.
          return declaration(
            outputPath,
            pdx.document([
              pdx.property(
                "state",
                pdx.block([pdx.property("id", pdx.atom(String(reference.id)))]),
              ),
            ]),
          );
        }
        if (intrinsic.name === "DataFile") {
          if (typeof args[0] !== "string") {
            warn(node, "DataFile's output path is not a literal value.");
            return unknownValue;
          }
          if (!isMetadataPath(args[0])) return unknownValue;
          if (containsUnknown(args[1])) {
            warn(node, "DataFile world metadata contains a value that requires full compilation.");
            return unknownValue;
          }
          const value = dataValue(args[1]);
          if (value?.kind === "block") return declaration(args[0], pdx.document(value.items));
          warn(node, "DataFile world metadata is not a statically discoverable record.");
          return unknownValue;
        }
        if (
          intrinsic.name === "SourceFile" &&
          typeof args[0] === "string" &&
          record(args[1]) &&
          args[1].kind === "document"
        )
          return declaration(args[0], args[1] as unknown as pdx.PdxDocument);
        if (metadataNames.has(intrinsic.name))
          warn(node, "World declaration metadata is not a literal value.");
        return unknownValue;
      }
      if (intrinsic.module !== "pdx") return unknownValue;
      if (args.some(containsUnknown)) {
        if (intrinsic.name === "file")
          warn(
            node,
            "Ordered PDX world metadata requires a static output path and constructor document.",
          );
        return unknownValue;
      }
      const atom = (value: unknown): value is pdx.PdxAtom => record(value) && value.kind === "atom";
      const value = (input: unknown): input is pdx.PdxValue =>
        record(input) && ["atom", "block", "tagged"].includes(String(input.kind));
      const item = (input: unknown): input is pdx.PdxItem =>
        value(input) || (record(input) && input.kind === "property");
      switch (intrinsic.name) {
        case "atom":
          if (
            typeof args[0] === "string" &&
            (args[1] === undefined || typeof args[1] === "boolean")
          )
            return pdx.atom(args[0], args[1]);
          break;
        case "quoted":
          if (typeof args[0] === "string") return pdx.quoted(args[0]);
          break;
        case "string":
          if (typeof args[0] === "string") return pdx.string(args[0]);
          break;
        case "block":
        case "document":
          if (Array.isArray(args[0]) && args[0].every(item))
            return intrinsic.name === "block" ? pdx.block(args[0]) : pdx.document(args[0]);
          break;
        case "property":
        case "entry":
          if (
            (typeof args[0] === "string" || atom(args[0])) &&
            value(args[1]) &&
            (args[2] === undefined || pdx.operators.has(args[2] as pdx.PdxOperator))
          )
            return pdx.property(args[0], args[1], args[2] as pdx.PdxOperator | undefined);
          break;
        case "tagged":
          if (
            (typeof args[0] === "string" || atom(args[0])) &&
            record(args[1]) &&
            args[1].kind === "block"
          )
            return pdx.tagged(args[0], args[1] as unknown as pdx.PdxBlock);
          break;
        case "file":
          if (typeof args[0] === "string" && record(args[1]) && args[1].kind === "document")
            return declaration(args[0], args[1] as unknown as pdx.PdxDocument);
          warn(
            node,
            "Ordered PDX world metadata requires a static output path and constructor document.",
          );
      }
      return unknownValue;
    }

    function evaluate(node: ts.Expression): unknown {
      if (++visits > 250_000) return unknownValue;
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
      if (ts.isNumericLiteral(node)) return Number(node.text);
      if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
      if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
      if (ts.isIdentifier(node)) return nameValue(node.text);
      if (ts.isParenthesizedExpression(node) || ts.isSatisfiesExpression(node))
        return evaluate(node.expression);
      if (
        ts.isAsExpression(node) &&
        ts.isTypeReferenceNode(node.type) &&
        ts.isIdentifier(node.type.typeName) &&
        node.type.typeName.text === "const"
      )
        return evaluate(node.expression);
      if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) {
        const value = evaluate(node.operand);
        return typeof value === "number" ? -value : unknownValue;
      }
      if (ts.isArrayLiteralExpression(node))
        return node.elements.map((element) =>
          ts.isSpreadElement(element) ? unknownValue : evaluate(element),
        );
      if (ts.isObjectLiteralExpression(node)) {
        const result: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
        for (const property of node.properties) {
          if (ts.isShorthandPropertyAssignment(property))
            result[property.name.text] = nameValue(property.name.text);
          else if (ts.isPropertyAssignment(property) && !ts.isComputedPropertyName(property.name))
            result[property.name.text] = evaluate(property.initializer);
          else return unknownValue;
        }
        return result;
      }
      if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
        const object = evaluate(node.expression);
        const key = ts.isPropertyAccessExpression(node)
          ? node.name.text
          : evaluate(node.argumentExpression);
        if (typeof key !== "string" && typeof key !== "number") return unknownValue;
        if (tagged(object, "namespace"))
          return { [discoveryMarker]: "intrinsic", module: object.module, name: String(key) };
        if (
          tagged(object, "intrinsic") &&
          object.module === "states" &&
          object.name === "states" &&
          Number.isSafeInteger(Number(key)) &&
          Number(key) > 0
        )
          return { kind: "state", id: Number(key) };
        return record(object) && Object.hasOwn(object, key) ? object[key] : unknownValue;
      }
      if (ts.isCallExpression(node)) {
        const callable = evaluate(node.expression);
        if (tagged(callable, "intrinsic")) return call(callable as unknown as Intrinsic, node);
        if (
          [...bindings.values()].some(
            (binding) =>
              binding.module === "sdk" &&
              (tagged(binding, "namespace") || metadataNames.has((binding as Intrinsic).name)),
          )
        ) {
          warn(
            node,
            "World metadata produced by a helper call is not discovered during the literal declaration pass.",
          );
        }
        return unknownValue;
      }
      return unknownValue;
    }

    function collect(value: unknown): void {
      if (Array.isArray(value)) {
        value.forEach(collect);
        return;
      }
      if (!tagged(value, "declaration")) return;
      const entry = value as unknown as Declaration;
      if (!isMetadataPath(entry.path)) return;
      const path = gamePath(entry.path);
      const previous = pendingDocuments.get(path);
      if (previous) previous.items.push(...entry.document.items);
      else pendingDocuments.set(path, pdx.document(entry.document.items));
    }

    try {
      for (const statement of syntax.statements) {
        if (
          ts.isVariableStatement(statement) &&
          statement.declarationList.flags & ts.NodeFlags.Const
        ) {
          for (const entry of statement.declarationList.declarations)
            if (ts.isIdentifier(entry.name)) collect(nameValue(entry.name.text));
        } else if (ts.isExpressionStatement(statement) || ts.isExportAssignment(statement))
          collect(evaluate(statement.expression));
      }
      for (const [path, document] of pendingDocuments)
        files.push({
          path,
          source: file,
          bytes: Buffer.from(pdx.emitPdx(document)),
          kind: "script",
        });
    } catch (error) {
      diagnostics.push({
        code: "KRG_WORLD_SOURCE",
        severity: "error",
        file,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return { files, diagnostics };
}
