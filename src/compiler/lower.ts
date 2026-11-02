import ts from "typescript";
import path from "node:path";
import * as pdx from "../pdx/ast.js";
import type { CwtSchema } from "../schema/types.js";
import { commandAllowed } from "./sdk.js";
import { commandValueError } from "./command-validation.js";
import type { CompileOptions, CompileOutput, KriegDiagnostic } from "./types.js";

type Value = unknown;
type Environment = Map<ts.Symbol, Value>;
type Scope = { _krg: "scope"; name: string; id: number; parent?: Scope };
type Callable = { _krg: "function"; node: ts.FunctionLikeDeclaration; env: Environment };
type Builtin = { _krg: "builtin"; name: string; module: "sdk" | "pdx" };
type Member = { _krg: "member"; object: Value; name: string };
type Trigger = { _krg: "trigger"; items: pdx.PdxItem[] };
type Variable = { _krg: "variable"; name: string; scope: Scope; mutable: boolean };
type Query = { _krg: "query"; name: string; scope: Scope; boolean?: boolean };
type Arithmetic = { _krg: "arithmetic"; operator: ts.SyntaxKind; left: Value; right: Value };
type Definition = {
  _krg: "definition";
  outputs: CompileOutput[];
  id?: string;
  name?: string;
  scope?: string;
  definitionKind?: "effect" | "trigger";
};
interface Context {
  env: Environment;
  mode: "top" | "effect" | "trigger";
  sink: pdx.PdxItem[];
  scope?: Scope;
  prefix: string;
  dynamicBranch?: boolean;
}
class CompileFailure extends Error {}
class ReturnValue {
  constructor(readonly value: Value) {}
}
function tagged<T extends string>(
  value: unknown,
  tag: T,
): value is Record<string, unknown> & { _krg: T } {
  return typeof value === "object" && value !== null && "_krg" in value && value._krg === tag;
}
function record(value: Value): value is Record<string, Value> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function safeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_]/g, "_");
}

const aliases: Record<string, string> = {
  addPoliticalPower: "add_political_power",
  addStability: "add_stability",
  addWarSupport: "add_war_support",
  setCountryFlag: "set_country_flag",
  clearCountryFlag: "clr_country_flag",
  addIdeas: "add_ideas",
  removeIdeas: "remove_ideas",
  countryEvent: "country_event",
  hasCountryFlag: "has_country_flag",
  hasIdea: "has_idea",
  isAi: "is_ai",
  addManpower: "add_manpower",
  setStateFlag: "set_state_flag",
  clearStateFlag: "clr_state_flag",
  hasStateFlag: "has_state_flag",
  isOwnedBy: "is_owned_by",
  isControlledBy: "is_controlled_by",
  setVariable: "set_variable",
  addToVariable: "add_to_variable",
};
const queries: Record<string, string> = {
  politicalPower: "has_political_power",
  stability: "has_stability",
  warSupport: "has_war_support",
  manpower: "state_population",
  isAI: "is_ai",
};
const definitions = new Set([
  "CountryEvent",
  "StateEvent",
  "NewsEvent",
  "FocusTree",
  "DecisionCategory",
  "Idea",
  "ScriptedEffect",
  "ScriptedTrigger",
  "StateScriptedEffect",
  "StateScriptedTrigger",
  "CountryHistory",
  "StateHistory",
  "SourceFile",
  "DataFile",
]);
const forbiddenKinds = new Set([
  ts.SyntaxKind.ClassDeclaration,
  ts.SyntaxKind.ClassExpression,
  ts.SyntaxKind.NewExpression,
  ts.SyntaxKind.AwaitExpression,
  ts.SyntaxKind.YieldExpression,
  ts.SyntaxKind.WhileStatement,
  ts.SyntaxKind.DoStatement,
  ts.SyntaxKind.ForStatement,
  ts.SyntaxKind.ForInStatement,
  ts.SyntaxKind.TryStatement,
  ts.SyntaxKind.ThrowStatement,
  ts.SyntaxKind.SwitchStatement,
  ts.SyntaxKind.WithStatement,
  ts.SyntaxKind.DeleteExpression,
  ts.SyntaxKind.ThisKeyword,
  ts.SyntaxKind.SuperKeyword,
  ts.SyntaxKind.RegularExpressionLiteral,
  ts.SyntaxKind.EnumDeclaration,
  ts.SyntaxKind.ModuleDeclaration,
  ts.SyntaxKind.JsxElement,
  ts.SyntaxKind.JsxSelfClosingElement,
  ts.SyntaxKind.NonNullExpression,
]);

/** A bounded AST interpreter for compile-time values and game IR, never JavaScript. */
export class Lowerer {
  private readonly checker: ts.TypeChecker;
  private readonly sources: ts.SourceFile[];
  private readonly cache = new Map<ts.Symbol, Value>();
  private readonly evaluating = new Set<ts.Symbol>();
  private readonly calls: ts.FunctionLikeDeclaration[] = [];
  private readonly outputs: CompileOutput[] = [];
  private readonly outputDefinitions = new Set<Definition>();
  private count = 0;
  private sequence = 0;
  private readonly schema: CwtSchema;
  constructor(
    private readonly program: ts.Program,
    private readonly options: CompileOptions & { schema: CwtSchema },
    private readonly diagnostics: KriegDiagnostic[],
  ) {
    this.checker = program.getTypeChecker();
    this.sources = program.getSourceFiles().filter((source) => !source.isDeclarationFile);
    this.schema = options.schema;
  }
  private report(node: ts.Node, code: string, message: string): void {
    const source = node.getSourceFile();
    const position = source.getLineAndCharacterOfPosition(node.getStart(source));
    this.diagnostics.push({
      code,
      severity: "error",
      message,
      file: source.fileName,
      line: position.line + 1,
      column: position.character + 1,
    });
  }
  private fail(node: ts.Node, code: string, message: string): never {
    this.report(node, code, message);
    throw new CompileFailure(message);
  }
  private tick(node: ts.Node): void {
    if (++this.count > (this.options.maxExpansion ?? 250_000))
      this.fail(
        node,
        "KRG2001",
        "Static expansion limit exceeded. Reduce generated declarations or raise maxExpansion.",
      );
  }
  private symbol(node: ts.Node): ts.Symbol | undefined {
    const symbol = this.checker.getSymbolAtLocation(node);
    return symbol && symbol.flags & ts.SymbolFlags.Alias
      ? this.checker.getAliasedSymbol(symbol)
      : symbol;
  }
  validate(): void {
    const trustedRoot = path.join(this.options.rootDir, ".krieg-compiler-virtual") + path.sep;
    for (const source of this.program.getSourceFiles()) {
      if (source.isDeclarationFile && !source.fileName.startsWith(trustedRoot))
        this.report(
          source,
          "KRG1015",
          "User declaration files are outside the Krieg symbol universe. Import source helpers from .krg.ts modules; project ambient declarations must be supplied through virtualModules.",
        );
    }
    for (const source of this.sources) {
      if (!source.fileName.endsWith(".krg.ts"))
        this.report(
          source,
          "KRG1000",
          "Krieg project implementation modules must use the .krg.ts extension.",
        );
      const scanner = ts.createScanner(
        ts.ScriptTarget.Latest,
        false,
        ts.LanguageVariant.Standard,
        source.text,
      );
      let token = scanner.scan();
      while (token !== ts.SyntaxKind.EndOfFileToken) {
        if (
          (token === ts.SyntaxKind.SingleLineCommentTrivia ||
            token === ts.SyntaxKind.MultiLineCommentTrivia) &&
          /@ts-(?:nocheck|ignore|expect-error)\b/.test(scanner.getTokenText())
        ) {
          const position = source.getLineAndCharacterOfPosition(scanner.getTokenPos());
          this.diagnostics.push({
            code: "KRG1016",
            severity: "error",
            message: "TypeScript error-suppression directives are not allowed in Krieg source.",
            file: source.fileName,
            line: position.line + 1,
            column: position.character + 1,
          });
        }
        token = scanner.scan();
      }
      const visit = (node: ts.Node): void => {
        if (forbiddenKinds.has(node.kind))
          this.report(
            node,
            "KRG1001",
            `${ts.SyntaxKind[node.kind]} is outside the statically compiled Krieg subset.`,
          );
        if (node.kind === ts.SyntaxKind.AnyKeyword)
          this.report(node, "KRG1002", "The any type bypasses game SDK safety and is not allowed.");
        if (
          ts.isVariableStatement(node) &&
          ts.isSourceFile(node.parent) &&
          !(node.declarationList.flags & ts.NodeFlags.Const)
        )
          this.report(
            node,
            "KRG1010",
            "Top-level values must be const. Mutable numeric variables belong inside effect callbacks.",
          );
        if (ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) {
          if (!(
            ts.isTypeReferenceNode(node.type) &&
            ts.isIdentifier(node.type.typeName) &&
            node.type.typeName.text === "const"
          ))
            this.report(
              node,
              "KRG1003",
              "Type assertions are not allowed; use a checked annotation or satisfies.",
            );
        }
        if (ts.isFunctionLike(node)) {
          if (
            (ts.canHaveModifiers(node) &&
              ts
                .getModifiers(node)
                ?.some((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword)) ||
            ("asteriskToken" in node && node.asteriskToken)
          )
            this.report(
              node,
              "KRG1004",
              "Async functions and generators cannot be lowered to game script.",
            );
          for (const parameter of node.parameters) {
            if (!parameter.type)
              this.report(
                parameter,
                "KRG1005",
                "Every function and callback parameter must have an explicit type annotation.",
              );
            if (!ts.isIdentifier(parameter.name) || parameter.dotDotDotToken)
              this.report(
                parameter,
                "KRG1006",
                "Use named parameters; rest and destructured parameters are not supported.",
              );
          }
        }
        if (
          ts.isForOfStatement(node) &&
          (!ts.isVariableDeclarationList(node.initializer) ||
            !(node.initializer.flags & ts.NodeFlags.Const) ||
            node.initializer.declarations.length !== 1 ||
            !ts.isIdentifier(node.initializer.declarations[0].name))
        )
          this.report(
            node,
            "KRG1007",
            "for-of iteration requires one const identifier and a compile-time array.",
          );
        if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
          const name = node.moduleSpecifier.text;
          if (
            !name.startsWith(".") &&
            name !== "krieg-lang/hoi4" &&
            name !== "krieg-lang/pdx" &&
            !this.options.virtualModules?.[name] &&
            !this.options.moduleFiles?.[name]
          )
            this.report(
              node,
              "KRG1008",
              `Module '${name}' is outside the game SDK and resolved project/package universe.`,
            );
        }
        if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword)
          this.report(
            node,
            "KRG1009",
            "Dynamic import is not part of the compile-time module system.",
          );
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
  }
  lower(): CompileOutput[] {
    const entryFiles = new Set(
      this.options.files.map((file) => path.resolve(this.options.rootDir, file)),
    );
    const emittedSources =
      this.options.emitDependencies === false
        ? this.sources.filter((source) => entryFiles.has(source.fileName))
        : this.sources;
    for (const source of emittedSources.sort((a, b) => a.fileName.localeCompare(b.fileName))) {
      const context: Context = {
        env: new Map(),
        mode: "top",
        sink: [],
        prefix: safeId(path.basename(source.fileName, ".krg.ts")),
      };
      for (const statement of source.statements) {
        try {
          if (ts.isVariableStatement(statement)) {
            if (!(statement.declarationList.flags & ts.NodeFlags.Const))
              this.fail(
                statement,
                "KRG1010",
                "Top-level values must be const. Mutable numeric variables belong inside effect callbacks.",
              );
            for (const declaration of statement.declarationList.declarations) {
              if (!ts.isIdentifier(declaration.name))
                this.fail(declaration, "KRG1011", "Destructured declarations are not supported.");
              this.emitValue(this.evaluate(declaration.name, context), declaration);
            }
          } else if (ts.isExportAssignment(statement)) {
            const moduleSymbol = this.checker.getSymbolAtLocation(source);
            const exported = moduleSymbol
              ? this.checker
                  .getExportsOfModule(moduleSymbol)
                  .find((symbol) => symbol.name === "default")
              : undefined;
            const value =
              exported && this.cache.has(exported)
                ? this.cache.get(exported)
                : this.evaluate(statement.expression, context);
            if (exported) this.cache.set(exported, value);
            this.emitValue(value, statement);
          } else if (ts.isExpressionStatement(statement))
            this.emitValue(this.evaluate(statement.expression, context), statement);
          else if (!(
            ts.isImportDeclaration(statement) ||
            ts.isExportDeclaration(statement) ||
            ts.isFunctionDeclaration(statement) ||
            ts.isInterfaceDeclaration(statement) ||
            ts.isTypeAliasDeclaration(statement) ||
            ts.isEmptyStatement(statement)
          ))
            this.fail(
              statement,
              "KRG1012",
              "Only imports, type declarations, helpers, constants, and game declarations are allowed at module scope.",
            );
        } catch (error) {
          if (!(error instanceof CompileFailure)) throw error;
        }
      }
    }
    const merged = new Map<string, CompileOutput>();
    for (const output of this.outputs) {
      const previous = merged.get(output.path);
      if (previous) {
        if (previous.representation !== output.representation)
          this.diagnostics.push({
            code: "KRG1013",
            severity: "error",
            message: `Output '${output.path}' mixes semantic and ordered-PDX declarations. Give them distinct explicit paths.`,
            file: output.sourceFile,
          });
        previous.document.items.push(...output.document.items);
      } else merged.set(output.path, { ...output, document: pdx.document(output.document.items) });
    }
    return [...merged.values()].sort((a, b) => a.path.localeCompare(b.path));
  }
  private emitValue(value: Value, node: ts.Node): void {
    if (Array.isArray(value)) {
      value.forEach((item) => this.emitValue(item, node));
      return;
    }
    if (tagged(value, "definition")) {
      const definition = value as Definition;
      if (!this.outputDefinitions.has(definition)) {
        this.outputDefinitions.add(definition);
        this.outputs.push(...definition.outputs);
      }
    } else if (record(value) && value.kind === "file") {
      this.outputs.push(
        this.output(
          this.string(value.path, node),
          value.document as pdx.PdxDocument,
          node,
          "ordered-pdx",
        ),
      );
    } else if (record(value) && value.kind === "document") {
      const relative = path
        .relative(this.options.rootDir, node.getSourceFile().fileName)
        .replaceAll(path.sep, "/")
        .replace(/^src\//, "")
        .replace(/\.krg\.ts$/, ".txt");
      this.outputs.push(
        this.output(relative, value as unknown as pdx.PdxDocument, node, "ordered-pdx"),
      );
    }
  }
  private output(
    outputPath: string,
    document: pdx.PdxDocument,
    node: ts.Node,
    representation: CompileOutput["representation"] = "semantic",
  ): CompileOutput {
    const normalized = outputPath.replaceAll("\\", "/");
    if (
      !normalized ||
      path.posix.isAbsolute(normalized) ||
      /^[a-zA-Z]:/.test(normalized) ||
      normalized.split("/").some((part) => part === ".." || !part)
    )
      this.fail(
        node,
        "KRG1014",
        `Output path '${outputPath}' must be a relative game path without traversal.`,
      );
    return {
      path: normalized,
      document,
      sourceFile: node.getSourceFile().fileName,
      representation,
    };
  }
  private string(value: Value, node: ts.Node): string {
    if (typeof value !== "string") this.fail(node, "KRG2002", "Expected a compile-time string.");
    return value;
  }
  private object(value: Value, node: ts.Node): Record<string, Value> {
    if (!record(value) || "_krg" in value)
      this.fail(node, "KRG2003", "Expected a compile-time record.");
    return value;
  }
  private array(value: Value, node: ts.Node): Value[] {
    if (!Array.isArray(value)) this.fail(node, "KRG2004", "Expected a compile-time array.");
    return value;
  }
  private checkKeys(
    value: Record<string, Value>,
    keys: string[],
    node: ts.Node,
    domain: string,
  ): void {
    const extra = Object.keys(value).filter((key) => !keys.includes(key));
    if (extra.length)
      this.fail(
        node,
        "KRG2070",
        `${domain} has unsupported fields: ${extra.join(", ")}. Use the typed API fields or an explicit structured/ordered data file.`,
      );
  }
  private lookup(identifier: ts.Identifier, context: Context, valueSymbol?: ts.Symbol): Value {
    if (identifier.text === "undefined") return undefined;
    const direct = valueSymbol ?? this.checker.getSymbolAtLocation(identifier);
    const importDeclaration = direct?.declarations?.find(ts.isNamespaceImport);
    if (importDeclaration)
      return {
        _krg: "namespace",
        name: (importDeclaration.parent.parent.moduleSpecifier as ts.StringLiteral).text,
      };
    const symbol = valueSymbol
      ? valueSymbol.flags & ts.SymbolFlags.Alias
        ? this.checker.getAliasedSymbol(valueSymbol)
        : valueSymbol
      : this.symbol(identifier);
    if (!symbol) this.fail(identifier, "KRG2005", `Cannot resolve '${identifier.text}'.`);
    if (context.env.has(symbol)) return context.env.get(symbol);
    if (this.cache.has(symbol)) return this.cache.get(symbol);
    const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
    if (!declaration)
      this.fail(identifier, "KRG2006", `No static declaration for '${identifier.text}'.`);
    const module = declaration.getSourceFile().fileName;
    if (module === path.join(this.options.rootDir, ".krieg-compiler-virtual/krieg-lang_hoi4.d.ts"))
      return { _krg: "builtin", name: symbol.name, module: "sdk" } as Builtin;
    if (module === path.join(this.options.rootDir, ".krieg-compiler-virtual/krieg-lang_pdx.d.ts"))
      return { _krg: "builtin", name: symbol.name, module: "pdx" } as Builtin;
    if (ts.isNamespaceImport(declaration))
      return {
        _krg: "namespace",
        name: (declaration.parent.parent.moduleSpecifier as ts.StringLiteral).text,
      };
    if (ts.isFunctionDeclaration(declaration) && declaration.body)
      return { _krg: "function", node: declaration, env: new Map(context.env) } as Callable;
    if (ts.isExportAssignment(declaration)) {
      if (this.evaluating.has(symbol))
        this.fail(identifier, "KRG2007", `Cyclic default export initializer '${identifier.text}'.`);
      this.evaluating.add(symbol);
      try {
        const result = this.evaluate(declaration.expression, {
          env: new Map(),
          mode: "top",
          sink: [],
          prefix: safeId(path.basename(declaration.getSourceFile().fileName, ".krg.ts")),
        });
        this.cache.set(symbol, result);
        return result;
      } finally {
        this.evaluating.delete(symbol);
      }
    }
    if (ts.isVariableDeclaration(declaration) && declaration.initializer) {
      if (this.evaluating.has(symbol))
        this.fail(identifier, "KRG2007", `Cyclic constant initializer '${identifier.text}'.`);
      this.evaluating.add(symbol);
      try {
        const topLevel =
          ts.isVariableDeclarationList(declaration.parent) &&
          ts.isVariableStatement(declaration.parent.parent) &&
          ts.isSourceFile(declaration.parent.parent.parent);
        if (!topLevel)
          this.fail(
            identifier,
            "KRG2072",
            `Local '${identifier.text}' was referenced before its initializer was lowered.`,
          );
        const declarationContext: Context = {
          env: new Map(),
          mode: "top",
          sink: [],
          prefix: safeId(path.basename(declaration.getSourceFile().fileName, ".krg.ts")),
        };
        const result = this.evaluate(declaration.initializer, declarationContext);
        this.cache.set(symbol, result);
        return result;
      } finally {
        this.evaluating.delete(symbol);
      }
    }
    if (declaration.getSourceFile().isDeclarationFile && module.includes(".krieg-compiler-virtual"))
      return this.typeValue(this.checker.getTypeAtLocation(identifier), identifier, 0);
    this.fail(
      identifier,
      "KRG2008",
      `The value '${identifier.text}' has no compile-time initializer.`,
    );
  }
  private typeValue(type: ts.Type, node: ts.Node, depth: number): Value {
    if (depth > 12) this.fail(node, "KRG2009", "Project symbol declaration is too deeply nested.");
    if (type.flags & ts.TypeFlags.StringLiteral) return (type as ts.StringLiteralType).value;
    if (type.flags & ts.TypeFlags.NumberLiteral) return (type as ts.NumberLiteralType).value;
    if (type.flags & ts.TypeFlags.BooleanLiteral) return this.checker.typeToString(type) === "true";
    const properties = this.checker.getPropertiesOfType(type);
    const result: Record<string, Value> = Object.create(null);
    for (const property of properties) {
      const propertyType = this.checker.getTypeOfSymbolAtLocation(property, node);
      if (propertyType.flags & (ts.TypeFlags.String | ts.TypeFlags.Number | ts.TypeFlags.Boolean))
        continue;
      result[property.name] = this.typeValue(propertyType, node, depth + 1);
    }
    if (!properties.length)
      this.fail(
        node,
        "KRG2010",
        "Project ambient values must resolve to literal strings, numbers, country/state references, or maps of those values.",
      );
    return result;
  }
  private evaluate(node: ts.Expression, context: Context): Value {
    this.tick(node);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isIdentifier(node)) return this.lookup(node, context);
    if (
      ts.isParenthesizedExpression(node) ||
      ts.isSatisfiesExpression(node) ||
      ts.isAsExpression(node)
    )
      return this.evaluate(node.expression, context);
    if (ts.isArrayLiteralExpression(node)) {
      const values: Value[] = [];
      for (const element of node.elements) {
        if (ts.isSpreadElement(element))
          values.push(...this.array(this.evaluate(element.expression, context), element));
        else if (ts.isOmittedExpression(element))
          this.fail(element, "KRG2011", "Sparse arrays are not supported.");
        else values.push(this.evaluate(element, context));
      }
      return values;
    }
    if (ts.isObjectLiteralExpression(node)) {
      const value: Record<string, Value> = Object.create(null);
      for (const property of node.properties) {
        if (ts.isSpreadAssignment(property)) {
          Object.assign(value, this.object(this.evaluate(property.expression, context), property));
          continue;
        }
        if (ts.isShorthandPropertyAssignment(property)) {
          value[property.name.text] = this.lookup(
            property.name,
            context,
            this.checker.getShorthandAssignmentValueSymbol(property),
          );
          continue;
        }
        if (!ts.isPropertyAssignment(property))
          this.fail(
            property,
            "KRG2012",
            "Object methods and accessors are not supported. Use a named function or arrow callback.",
          );
        const key = ts.isComputedPropertyName(property.name)
          ? this.evaluate(property.name.expression, context)
          : property.name.text;
        if (typeof key !== "string" && typeof key !== "number")
          this.fail(
            property.name,
            "KRG2013",
            "Record keys must be compile-time strings or numbers.",
          );
        if (Object.hasOwn(value, key))
          this.fail(
            property.name,
            "KRG2014",
            "Duplicate record keys lose game semantics. Use the ordered PDX API for repeated properties.",
          );
        value[String(key)] = this.evaluate(property.initializer, context);
      }
      return value;
    }
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node))
      return { _krg: "function", node, env: new Map(context.env) } as Callable;
    if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
      const object = this.evaluate(node.expression, context);
      const key = ts.isPropertyAccessExpression(node)
        ? node.name.text
        : this.evaluate(node.argumentExpression, context);
      if (typeof key !== "string" && typeof key !== "number")
        this.fail(node, "KRG2015", "Property indices must be compile-time strings or numbers.");
      const name = String(key);
      if (tagged(object, "namespace")) {
        const module = object.name;
        if (module === "krieg-lang/pdx" || module === "krieg-lang/hoi4")
          return {
            _krg: "builtin",
            name,
            module: module === "krieg-lang/pdx" ? "pdx" : "sdk",
          } as Builtin;
        if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.name))
          return this.lookup(node.name, context);
        const symbol = this.symbol(node);
        if (
          symbol?.valueDeclaration &&
          ts.isVariableDeclaration(symbol.valueDeclaration) &&
          symbol.valueDeclaration.initializer
        )
          return this.evaluate(symbol.valueDeclaration.initializer, context);
      }
      if (tagged(object, "scope")) {
        const scope = object as Scope;
        if (name === "scope") return scope.name;
        if (queries[name])
          return { _krg: "query", name: queries[name], scope, boolean: name === "isAI" } as Query;
        return { _krg: "member", object, name } as Member;
      }
      if (tagged(object, "member")) return { _krg: "member", object, name } as Member;
      if (Array.isArray(object)) return name === "length" ? object.length : object[Number(name)];
      if (typeof object === "string" && name === "length") return object.length;
      if (record(object) && Object.hasOwn(object, name)) return object[name];
      this.fail(node, "KRG2016", `Property '${name}' does not have a static value.`);
    }
    if (ts.isCallExpression(node))
      return this.call(
        this.evaluate(node.expression, context),
        node.arguments.map((argument) => {
          if (ts.isSpreadElement(argument))
            this.fail(argument, "KRG2017", "Spread call arguments are not supported.");
          return this.evaluate(argument, context);
        }),
        node,
        context,
      );
    if (ts.isBinaryExpression(node)) return this.binary(node, context);
    if (ts.isPrefixUnaryExpression(node)) {
      const value = this.evaluate(node.operand, context);
      if (node.operator === ts.SyntaxKind.ExclamationToken) {
        if (typeof value === "boolean") return !value;
        return {
          _krg: "trigger",
          items: [pdx.property("NOT", pdx.block(this.trigger(value, node, context)))],
        } as Trigger;
      }
      if (node.operator === ts.SyntaxKind.PlusToken && typeof value === "number") return value;
      if (node.operator === ts.SyntaxKind.MinusToken)
        return typeof value === "number"
          ? -value
          : ({
              _krg: "arithmetic",
              operator: ts.SyntaxKind.AsteriskToken,
              left: -1,
              right: value,
            } as Arithmetic);
      if (
        node.operator === ts.SyntaxKind.PlusPlusToken ||
        node.operator === ts.SyntaxKind.MinusMinusToken
      )
        return this.increment(
          node.operand,
          node.operator === ts.SyntaxKind.PlusPlusToken ? 1 : -1,
          node,
          context,
        );
      this.fail(node, "KRG2018", "This unary operation cannot be lowered.");
    }
    if (ts.isPostfixUnaryExpression(node))
      return this.increment(
        node.operand,
        node.operator === ts.SyntaxKind.PlusPlusToken ? 1 : -1,
        node,
        context,
      );
    if (ts.isConditionalExpression(node)) {
      const condition = this.evaluate(node.condition, context);
      if (typeof condition !== "boolean")
        this.fail(
          node,
          "KRG2019",
          "A conditional value requires a compile-time condition. Use if/else for runtime game branching.",
        );
      return this.evaluate(condition ? node.whenTrue : node.whenFalse, context);
    }
    if (ts.isTemplateExpression(node)) {
      let value = node.head.text;
      for (const span of node.templateSpans) {
        const item = this.evaluate(span.expression, context);
        if (!["string", "number", "boolean"].includes(typeof item))
          this.fail(span, "KRG2020", "Template interpolation requires compile-time scalar values.");
        value += String(item) + span.literal.text;
      }
      return value;
    }
    this.fail(
      node,
      "KRG2021",
      `Expression ${ts.SyntaxKind[node.kind]} is not implemented in the static compiler.`,
    );
  }

  private call(callable: Value, args: Value[], node: ts.CallExpression, context: Context): Value {
    if (tagged(callable, "builtin")) {
      const builtin = callable as Builtin;
      return builtin.module === "pdx"
        ? this.pdxCall(builtin.name, args, node)
        : this.sdkCall(builtin.name, args, node, context);
    }
    if (tagged(callable, "function")) return this.invoke(callable as Callable, args, node, context);
    if (tagged(callable, "member")) return this.memberCall(callable as Member, args, node, context);
    this.fail(
      node,
      "KRG2022",
      "Only resolved SDK operations and statically defined helper functions can be called.",
    );
  }
  private invoke(callable: Callable, args: Value[], call: ts.Node, context: Context): Value {
    if (this.calls.includes(callable.node))
      this.fail(call, "KRG2023", "Recursive helper expansion is not supported.");
    if (!callable.node.body) this.fail(call, "KRG2024", "Helper function has no body.");
    const env = new Map(callable.env);
    for (let index = 0; index < callable.node.parameters.length; index++) {
      const parameter = callable.node.parameters[index];
      const symbol = this.symbol(parameter.name);
      let argument =
        args[index] === undefined && parameter.initializer
          ? this.evaluate(parameter.initializer, { ...context, env })
          : args[index];
      if (
        context.mode === "effect" &&
        context.scope &&
        (tagged(argument, "variable") || tagged(argument, "arithmetic"))
      ) {
        const name = `krg_${context.prefix}_arg_${safeId(parameter.name.getText())}_${++this.sequence}`;
        this.variableEffect("set_variable", name, argument, call, context);
        argument = { _krg: "variable", name, scope: context.scope, mutable: false } as Variable;
      }
      if (symbol) env.set(symbol, argument);
    }
    const inner = { ...context, env };
    this.calls.push(callable.node);
    try {
      if (!ts.isBlock(callable.node.body)) return this.evaluate(callable.node.body, inner);
      try {
        this.statements(callable.node.body.statements, inner);
      } catch (error) {
        if (error instanceof ReturnValue) return error.value;
        throw error;
      }
      return undefined;
    } finally {
      this.calls.pop();
    }
  }
  private pdxCall(name: string, args: Value[], node: ts.Node): Value {
    switch (name) {
      case "atom":
        return pdx.atom(this.string(args[0], node), args[1] === true);
      case "quoted":
        return pdx.quoted(this.string(args[0], node));
      case "string":
        return pdx.string(this.string(args[0], node));
      case "block":
        return pdx.block(this.array(args[0], node) as pdx.PdxItem[]);
      case "document":
        return pdx.document(this.array(args[0], node) as pdx.PdxItem[]);
      case "entry":
      case "property":
        return pdx.property(
          args[0] as string | pdx.PdxAtom,
          args[1] as pdx.PdxValue,
          args[2] as pdx.PdxOperator | undefined,
        );
      case "tagged":
        return pdx.tagged(args[0] as string | pdx.PdxAtom, args[1] as pdx.PdxBlock);
      case "file":
        return { kind: "file", path: this.string(args[0], node), document: args[1] };
      default:
        this.fail(node, "KRG2025", `Unknown ordered-PDX constructor '${name}'.`);
    }
  }
  private sdkCall(name: string, args: Value[], node: ts.Node, context: Context): Value {
    if (name === "country") {
      const tag = this.string(args[0], node);
      if (!/^[A-Z0-9]{3}$/.test(tag))
        this.fail(
          node,
          "KRG2026",
          `Country tag '${tag}' must have exactly three uppercase ASCII letters/digits.`,
        );
      return { kind: "country", tag };
    }
    if (name === "state") {
      if (typeof args[0] !== "number" || !Number.isInteger(args[0]) || args[0] < 1)
        this.fail(node, "KRG2027", "State references require positive integer IDs.");
      return { kind: "state", id: args[0] };
    }
    if (name === "loc") return this.string(args[0], node);
    if (name === "cwt") return { kind: "cwt", items: this.array(args[0], node) };
    if (name === "Option" || name === "Focus" || name === "Decision")
      return this.object(args[0], node);
    if (definitions.has(name)) {
      if (context.mode !== "top")
        this.fail(
          node,
          "KRG2028",
          "Game declarations belong at module scope; effect helpers may only produce effects.",
        );
      const result: Definition = {
        _krg: "definition",
        outputs: this.definition(name, args, node, context),
      };
      if (record(args[0]) && typeof args[0].id === "string") result.id = args[0].id;
      if (name.includes("Scripted")) {
        result.name = this.string(args[0], node);
        result.scope =
          args.length === 3
            ? this.string(args[1], node)
            : name.startsWith("State")
              ? "state"
              : "country";
        result.definitionKind = name.endsWith("Trigger") ? "trigger" : "effect";
      }
      return result;
    }
    this.fail(node, "KRG2029", `SDK declaration '${name}' has no static lowering.`);
  }

  private callback(
    value: Value,
    scopeName: string,
    mode: "effect" | "trigger",
    node: ts.Node,
    outer: Context,
    parent?: Scope,
  ): pdx.PdxItem[] {
    if (!tagged(value, "function"))
      this.fail(node, "KRG2030", "Expected an explicitly typed game scope callback.");
    const scope: Scope = {
      _krg: "scope",
      name: scopeName,
      id: ++this.sequence,
      ...(parent ? { parent } : {}),
    };
    const sink: pdx.PdxItem[] = [];
    const context: Context = { env: new Map(), mode, sink, scope, prefix: outer.prefix };
    const result = this.invoke(value as Callable, [scope], node, context);
    if (mode === "trigger") return this.trigger(result, node, context);
    if (result !== undefined) this.fail(node, "KRG2031", "An effect callback must return void.");
    return sink;
  }
  private scopePath(target: Scope, current: Scope | undefined, node: ts.Node): string | undefined {
    if (!current)
      this.fail(node, "KRG2032", "Scope operations can only be used inside a game callback.");
    if (target.id === current.id) return undefined;
    let ancestor: Scope | undefined = current.parent;
    let depth = 1;
    while (ancestor) {
      if (ancestor.id === target.id) return Array(depth).fill("PREV").join(".");
      ancestor = ancestor.parent;
      depth++;
    }
    this.fail(
      node,
      "KRG2033",
      "This captured scope is not an ancestor of the active game scope. Select it through an explicit country/state reference.",
    );
  }
  private inScope(
    items: pdx.PdxItem[],
    target: Scope,
    context: Context,
    node: ts.Node,
  ): pdx.PdxItem[] {
    const scopePath = this.scopePath(target, context.scope, node);
    return scopePath ? [pdx.property(scopePath, pdx.block(items))] : items;
  }
  private memberCall(member: Member, args: Value[], node: ts.Node, context: Context): Value {
    if (tagged(member.object, "member")) {
      const namespace = member.object as Member;
      if (!tagged(namespace.object, "scope") || !["effects", "triggers"].includes(namespace.name))
        this.fail(node, "KRG2034", "Only typed scope effect/trigger namespaces are callable.");
      const scope = namespace.object as Scope;
      const kind = namespace.name === "effects" ? "effect" : "trigger";
      const name = aliases[member.name] ?? member.name;
      const commands = this.schema.commands.filter(
        (command) =>
          command.kind === kind && command.name === name && commandAllowed(command, scope.name),
      );
      if (!commands.length)
        this.fail(node, "KRG2035", `CWT has no ${kind} '${name}' valid in ${scope.name} scope.`);
      if (args.length !== 1)
        this.fail(node, "KRG2036", "A game command requires exactly one typed argument.");
      const pushed = commands
        .find((command) => command.pushScope)
        ?.pushScope?.toLowerCase()
        .replace("unitleader", "unit_leader");
      if (
        pushed &&
        (tagged(args[0], "function") || (record(args[0]) && tagged(args[0].effects, "function")))
      ) {
        if (kind === "effect" && context.mode !== "effect")
          this.fail(node, "KRG2037", "Effects cannot execute in triggers or module initializers.");
        const specification = tagged(args[0], "function")
          ? undefined
          : (args[0] as Record<string, Value>);
        const body = this.callback(
          specification?.effects ?? args[0],
          pushed,
          kind,
          node,
          context,
          scope,
        );
        if (specification?.limit !== undefined)
          body.unshift(
            pdx.property(
              "limit",
              pdx.block(
                this.callback(specification.limit, pushed, "trigger", node, context, scope),
              ),
            ),
          );
        const items = this.inScope([pdx.property(name, pdx.block(body))], scope, context, node);
        if (kind === "trigger") return { _krg: "trigger", items } as Trigger;
        context.sink.push(...items);
        return undefined;
      }
      const validation = commands.map((command) =>
        commandValueError(args[0], command.value, this.schema),
      );
      if (validation.every((error) => error !== undefined))
        this.fail(node, "KRG2071", `Invalid argument for '${name}': ${validation[0]}`);
      const commandContext: Context = { ...context, scope, sink: [] };
      const property = pdx.property(name, this.toPdx(args[0], node, commandContext));
      const items = this.inScope([...commandContext.sink, property], scope, context, node);
      if (kind === "trigger") return { _krg: "trigger", items } as Trigger;
      if (context.mode !== "effect")
        this.fail(node, "KRG2037", "Effects cannot execute in triggers or module initializers.");
      context.sink.push(...items);
      return undefined;
    }
    if (!tagged(member.object, "scope"))
      this.fail(node, "KRG2038", "Arbitrary JavaScript methods are not available.");
    const scope = member.object as Scope;
    if (member.name === "run" || member.name === "test") {
      const kind = member.name === "run" ? "effect" : "trigger";
      const definition = args[0];
      if (
        !tagged(definition, "definition") ||
        definition.definitionKind !== kind ||
        definition.scope !== scope.name
      )
        this.fail(node, "KRG2066", `Expected a scripted ${kind} handle for ${scope.name} scope.`);
      const items = this.inScope(
        [pdx.property(this.string(definition.name, node), pdx.atom("yes"))],
        scope,
        context,
        node,
      );
      if (kind === "trigger") return { _krg: "trigger", items } as Trigger;
      if (context.mode !== "effect")
        this.fail(node, "KRG2037", "Effects cannot execute in triggers or module initializers.");
      context.sink.push(...items);
      return undefined;
    }
    const methods: Record<
      string,
      { key: string; scope: string; mode: "effect" | "trigger"; target?: boolean }
    > = {
      country: { key: "", scope: "country", mode: "effect", target: true },
      state: { key: "", scope: "state", mode: "effect", target: true },
      everyCountry: { key: "every_country", scope: "country", mode: "effect" },
      randomCountry: { key: "random_country", scope: "country", mode: "effect" },
      anyCountry: { key: "any_country", scope: "country", mode: "trigger" },
      allCountries: { key: "all_country", scope: "country", mode: "trigger" },
      everyState: { key: "every_owned_state", scope: "state", mode: "effect" },
      anyState: { key: "any_owned_state", scope: "state", mode: "trigger" },
      allStates: { key: "all_owned_state", scope: "state", mode: "trigger" },
      capital: { key: "capital_scope", scope: "state", mode: "effect" },
      owner: { key: "owner", scope: "country", mode: "effect" },
      controller: { key: "controller", scope: "country", mode: "effect" },
    };
    const method = methods[member.name];
    if (!method) this.fail(node, "KRG2039", `Scope operation '${member.name}' is not supported.`);
    if (method.mode === "effect" && context.mode !== "effect")
      this.fail(node, "KRG2040", "Effect scope iteration is only valid inside effects.");
    let key = method.key;
    let body: Value;
    let limit: Value;
    if (method.target) {
      const reference = this.object(args[0], node);
      if (reference.kind !== method.scope)
        this.fail(node, "KRG2041", `Expected a ${method.scope} reference.`);
      key = String(method.scope === "country" ? reference.tag : reference.id);
      body = args[1];
    } else {
      body = args[args.length - 1];
      if (args.length === 2) limit = args[0];
    }
    const inner = this.callback(body, method.scope, method.mode, node, context, scope);
    if (limit !== undefined)
      inner.unshift(
        pdx.property(
          "limit",
          pdx.block(this.callback(limit, method.scope, "trigger", node, context, scope)),
        ),
      );
    const items = this.inScope([pdx.property(key, pdx.block(inner))], scope, context, node);
    if (method.mode === "trigger") return { _krg: "trigger", items } as Trigger;
    context.sink.push(...items);
    return undefined;
  }

  private trigger(value: Value, node: ts.Node, context: Context): pdx.PdxItem[] {
    if (typeof value === "boolean") return [pdx.property("always", pdx.atom(value ? "yes" : "no"))];
    if (tagged(value, "trigger")) return (value as Trigger).items;
    if (tagged(value, "query") && value.boolean) {
      const query = value as Query;
      return this.inScope([pdx.property(query.name, pdx.atom("yes"))], query.scope, context, node);
    }
    this.fail(node, "KRG2042", "A game trigger callback must return a boolean trigger expression.");
  }
  private toPdx(value: Value, node: ts.Node, context: Context): pdx.PdxValue {
    if (typeof value === "boolean") return pdx.atom(value ? "yes" : "no");
    if (typeof value === "number") {
      if (!Number.isFinite(value)) this.fail(node, "KRG2043", "Game numbers must be finite.");
      return pdx.atom(String(value));
    }
    if (typeof value === "string")
      return /^[^\s{}=#"<>!?]+$/.test(value) && value !== "" ? pdx.atom(value) : pdx.string(value);
    if (tagged(value, "variable")) {
      const variable = value as Variable;
      const prefix = this.scopePath(variable.scope, context.scope, node);
      return pdx.atom(prefix ? `${prefix}.${variable.name}` : variable.name);
    }
    if (tagged(value, "arithmetic"))
      return pdx.atom(this.materialize(value as Arithmetic, node, context));
    if (Array.isArray(value))
      return pdx.block(value.map((item) => this.toPdx(item, node, context)));
    if (record(value)) {
      if (value.kind === "country") return pdx.atom(this.string(value.tag, node));
      if (value.kind === "state") return pdx.atom(String(value.id));
      if (value.kind === "cwt") return pdx.block(value.items as pdx.PdxItem[]);
      if (["_krg"].some((key) => key in value))
        this.fail(node, "KRG2044", "This runtime value cannot be used as a game command argument.");
      return pdx.block(
        Object.entries(value)
          .filter(([, item]) => item !== undefined)
          .map(([key, item]) => pdx.property(key, this.toPdx(item, node, context))),
      );
    }
    this.fail(node, "KRG2045", "Undefined/null values cannot be emitted as game script.");
  }

  private binary(node: ts.BinaryExpression, context: Context): Value {
    const operator = node.operatorToken.kind;
    if (operator >= ts.SyntaxKind.FirstAssignment && operator <= ts.SyntaxKind.LastAssignment)
      return this.assignment(node, context);
    const left = this.evaluate(node.left, context);
    if (operator === ts.SyntaxKind.AmpersandAmpersandToken && left === false) return false;
    if (operator === ts.SyntaxKind.BarBarToken && left === true) return true;
    const right = this.evaluate(node.right, context);
    if (
      operator === ts.SyntaxKind.AmpersandAmpersandToken ||
      operator === ts.SyntaxKind.BarBarToken
    ) {
      if (typeof left === "boolean" && typeof right === "boolean")
        return operator === ts.SyntaxKind.AmpersandAmpersandToken ? left && right : left || right;
      const key = operator === ts.SyntaxKind.AmpersandAmpersandToken ? "AND" : "OR";
      return {
        _krg: "trigger",
        items: [
          pdx.property(
            key,
            pdx.block([
              ...this.trigger(left, node.left, context),
              ...this.trigger(right, node.right, context),
            ]),
          ),
        ],
      } as Trigger;
    }
    const comparisons: Partial<Record<ts.SyntaxKind, pdx.PdxOperator>> = {
      [ts.SyntaxKind.EqualsEqualsEqualsToken]: "=",
      [ts.SyntaxKind.ExclamationEqualsEqualsToken]: "!=",
      [ts.SyntaxKind.LessThanToken]: "<",
      [ts.SyntaxKind.LessThanEqualsToken]: "<=",
      [ts.SyntaxKind.GreaterThanToken]: ">",
      [ts.SyntaxKind.GreaterThanEqualsToken]: ">=",
    };
    if (comparisons[operator]) {
      if (
        (typeof left === "number" && typeof right === "number") ||
        (typeof left === "string" && typeof right === "string") ||
        (typeof left === "boolean" && typeof right === "boolean")
      ) {
        switch (operator) {
          case ts.SyntaxKind.EqualsEqualsEqualsToken:
            return left === right;
          case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            return left !== right;
          case ts.SyntaxKind.LessThanToken:
            return left < right;
          case ts.SyntaxKind.LessThanEqualsToken:
            return left <= right;
          case ts.SyntaxKind.GreaterThanToken:
            return left > right;
          case ts.SyntaxKind.GreaterThanEqualsToken:
            return left >= right;
        }
      }
      return this.compare(left, right, comparisons[operator]!, node, context);
    }
    if (
      operator === ts.SyntaxKind.EqualsEqualsToken ||
      operator === ts.SyntaxKind.ExclamationEqualsToken
    )
      this.fail(
        node,
        "KRG2046",
        "Use strict equality (=== or !==). JavaScript coercion is not supported.",
      );
    if (typeof left === "number" && typeof right === "number") {
      switch (operator) {
        case ts.SyntaxKind.PlusToken:
          return left + right;
        case ts.SyntaxKind.MinusToken:
          return left - right;
        case ts.SyntaxKind.AsteriskToken:
          return left * right;
        case ts.SyntaxKind.SlashToken:
          if (!right) this.fail(node, "KRG2047", "Division by zero.");
          return left / right;
        case ts.SyntaxKind.PercentToken:
          if (!right) this.fail(node, "KRG2047", "Modulo by zero.");
          return left % right;
        case ts.SyntaxKind.AsteriskAsteriskToken:
          return left ** right;
      }
    }
    if (
      operator === ts.SyntaxKind.PlusToken &&
      (typeof left === "string" || typeof right === "string") &&
      ["number", "string"].includes(typeof left) &&
      ["number", "string"].includes(typeof right)
    )
      return String(left) + String(right);
    if (
      [
        ts.SyntaxKind.PlusToken,
        ts.SyntaxKind.MinusToken,
        ts.SyntaxKind.AsteriskToken,
        ts.SyntaxKind.SlashToken,
        ts.SyntaxKind.PercentToken,
      ].includes(operator)
    ) {
      if (
        ![left, right].every(
          (value) =>
            typeof value === "number" || tagged(value, "variable") || tagged(value, "arithmetic"),
        )
      )
        this.fail(
          node,
          "KRG2048",
          "Runtime arithmetic supports numeric game variables and constants. Scope query properties are only valid in comparisons.",
        );
      return { _krg: "arithmetic", operator, left, right } as Arithmetic;
    }
    this.fail(node, "KRG2049", "This binary operation has no defined Krieg lowering.");
  }
  private compare(
    left: Value,
    right: Value,
    operator: pdx.PdxOperator,
    node: ts.Node,
    context: Context,
  ): Trigger {
    if (tagged(left, "query")) {
      const query = left as Query;
      const value = this.toPdx(right, node, { ...context, scope: query.scope });
      const less = pdx.property(query.name, value, "<");
      const greater = pdx.property(query.name, value, ">");
      const not = (item: pdx.PdxItem): pdx.PdxProperty => pdx.property("NOT", pdx.block([item]));
      let items: pdx.PdxItem[];
      if (query.boolean) {
        if (operator !== "=" && operator !== "!=")
          this.fail(node, "KRG2073", "Boolean game queries only support equality and inequality.");
        const property = pdx.property(query.name, value);
        items = [operator === "!=" ? not(property) : property];
      } else {
        switch (operator) {
          case "<":
            items = [less];
            break;
          case ">":
            items = [greater];
            break;
          case "<=":
            items = [not(greater)];
            break;
          case ">=":
            items = [not(less)];
            break;
          case "=":
            items = [pdx.property("AND", pdx.block([not(less), not(greater)]))];
            break;
          case "!=":
            items = [pdx.property("OR", pdx.block([less, greater]))];
            break;
          default:
            this.fail(node, "KRG2074", "Unsupported numeric query comparison.");
        }
      }
      return { _krg: "trigger", items: this.inScope(items, query.scope, context, node) };
    }
    if (tagged(left, "variable")) {
      const variable = left as Variable;
      const comparisons: Record<string, string> = {
        "=": "equals",
        "!=": "not_equals",
        "<": "less_than",
        "<=": "less_than_or_equals",
        ">": "greater_than",
        ">=": "greater_than_or_equals",
      };
      const check = pdx.property(
        "check_variable",
        pdx.block([
          pdx.property("var", this.toPdx(variable, node, context)),
          pdx.property("value", this.toPdx(right, node, context)),
          pdx.property("compare", pdx.atom(comparisons[operator])),
        ]),
      );
      return { _krg: "trigger", items: [check] };
    }
    if (tagged(right, "variable") || tagged(right, "query")) {
      const inverse: Record<string, pdx.PdxOperator> = {
        ">": "<",
        "<": ">",
        ">=": "<=",
        "<=": ">=",
        "=": "=",
        "!=": "!=",
      };
      return this.compare(right, left, inverse[operator], node, context);
    }
    if (
      (tagged(left, "trigger") || tagged(left, "query")) &&
      typeof right === "boolean" &&
      (operator === "=" || operator === "!=")
    ) {
      const items = this.trigger(left, node, context);
      return {
        _krg: "trigger",
        items: (operator === "=") === right ? items : [pdx.property("NOT", pdx.block(items))],
      };
    }
    this.fail(
      node,
      "KRG2050",
      "Runtime comparison requires a game variable or scope query on one side and a scalar value on the other.",
    );
  }
  private materialize(value: Arithmetic, node: ts.Node, context: Context): string {
    if (context.mode !== "effect" || !context.scope)
      this.fail(
        node,
        "KRG2051",
        "Runtime arithmetic requires an effect context. Calculate a variable before comparing it in a trigger.",
      );
    const name = `krg_${context.prefix}_tmp_${++this.sequence}`;
    this.variableEffect("set_variable", name, value.left, node, context);
    const operations: Partial<Record<ts.SyntaxKind, string>> = {
      [ts.SyntaxKind.PlusToken]: "add_to_variable",
      [ts.SyntaxKind.MinusToken]: "subtract_from_variable",
      [ts.SyntaxKind.AsteriskToken]: "multiply_variable",
      [ts.SyntaxKind.SlashToken]: "divide_variable",
      [ts.SyntaxKind.PercentToken]: "modulo_variable",
    };
    const operation = operations[value.operator];
    if (!operation) this.fail(node, "KRG2052", "Unsupported runtime arithmetic operator.");
    this.variableEffect(operation, name, value.right, node, context);
    return name;
  }
  private variableEffect(
    command: string,
    name: string,
    value: Value,
    node: ts.Node,
    context: Context,
  ): void {
    const encoded = this.toPdx(value, node, context);
    context.sink.push(
      pdx.property(
        command,
        pdx.block([pdx.property("var", pdx.atom(name)), pdx.property("value", encoded)]),
      ),
    );
  }
  private assignment(node: ts.BinaryExpression, context: Context): Value {
    if (context.mode !== "effect" || !ts.isIdentifier(node.left))
      this.fail(
        node,
        "KRG2053",
        "Assignments are limited to local numeric game variables inside effects.",
      );
    const variable = this.evaluate(node.left, context);
    if (!tagged(variable, "variable") || !variable.mutable)
      this.fail(node, "KRG2054", "Only let-declared numeric game variables can be assigned.");
    const target = variable as Variable;
    if (this.scopePath(target.scope, context.scope, node))
      this.fail(node, "KRG2055", "Assign a variable within its declaring scope.");
    const operations: Partial<Record<ts.SyntaxKind, string>> = {
      [ts.SyntaxKind.EqualsToken]: "set_variable",
      [ts.SyntaxKind.PlusEqualsToken]: "add_to_variable",
      [ts.SyntaxKind.MinusEqualsToken]: "subtract_from_variable",
      [ts.SyntaxKind.AsteriskEqualsToken]: "multiply_variable",
      [ts.SyntaxKind.SlashEqualsToken]: "divide_variable",
      [ts.SyntaxKind.PercentEqualsToken]: "modulo_variable",
    };
    const operation = operations[node.operatorToken.kind];
    if (!operation) this.fail(node, "KRG2056", "This assignment operator cannot be lowered.");
    this.variableEffect(operation, target.name, this.evaluate(node.right, context), node, context);
    return undefined;
  }
  private increment(
    operand: ts.Expression,
    amount: number,
    node: ts.Node,
    context: Context,
  ): Value {
    if (!ts.isExpressionStatement(node.parent))
      this.fail(
        node,
        "KRG2057",
        "Increment/decrement must be standalone statements because their old/new values differ.",
      );
    const variable = this.evaluate(operand, context);
    if (!tagged(variable, "variable") || !variable.mutable || context.mode !== "effect")
      this.fail(
        node,
        "KRG2058",
        "Increment/decrement requires a local numeric game variable in an effect.",
      );
    const target = variable as Variable;
    if (this.scopePath(target.scope, context.scope, node))
      this.fail(node, "KRG2055", "Assign a variable within its declaring scope.");
    this.variableEffect("add_to_variable", target.name, amount, node, context);
    return undefined;
  }
  private statements(
    statements: ts.NodeArray<ts.Statement> | readonly ts.Statement[],
    context: Context,
  ): void {
    for (const statement of statements) {
      this.tick(statement);
      if (ts.isVariableStatement(statement)) {
        if (!(statement.declarationList.flags & (ts.NodeFlags.Const | ts.NodeFlags.Let)))
          this.fail(
            statement,
            "KRG2067",
            "Use const for compile-time values and let for numeric game variables. var hoisting is not supported.",
          );
        for (const declaration of statement.declarationList.declarations) {
          if (!ts.isIdentifier(declaration.name) || !declaration.initializer)
            this.fail(
              declaration,
              "KRG2059",
              "Local declarations require a named identifier and initializer.",
            );
          const value = this.evaluate(declaration.initializer, context);
          const symbol = this.symbol(declaration.name)!;
          if (statement.declarationList.flags & ts.NodeFlags.Const) {
            if (tagged(value, "variable") || tagged(value, "arithmetic")) {
              if (context.mode !== "effect" || !context.scope)
                this.fail(
                  declaration,
                  "KRG2068",
                  "A runtime numeric snapshot requires an effect context.",
                );
              const name = `krg_${context.prefix}_${safeId(declaration.name.text)}_${++this.sequence}`;
              this.variableEffect("set_variable", name, value, declaration, context);
              context.env.set(symbol, {
                _krg: "variable",
                name,
                scope: context.scope,
                mutable: false,
              } as Variable);
            } else {
              if (context.mode === "effect" && (tagged(value, "trigger") || tagged(value, "query")))
                this.fail(
                  declaration,
                  "KRG2069",
                  "Store boolean predicates as typed helper functions, or use them directly in if. A runtime predicate cannot be stored as a compile-time constant.",
                );
              context.env.set(symbol, value);
            }
          } else {
            if (
              context.mode !== "effect" ||
              !context.scope ||
              !(
                typeof value === "number" ||
                tagged(value, "variable") ||
                tagged(value, "arithmetic")
              )
            )
              this.fail(
                declaration,
                "KRG2060",
                "let variables are numeric game variables and must be initialized inside an effect.",
              );
            const name = `krg_${context.prefix}_${safeId(declaration.name.text)}_${++this.sequence}`;
            const variable: Variable = {
              _krg: "variable",
              name,
              scope: context.scope,
              mutable: true,
            };
            this.variableEffect("set_variable", name, value, declaration, context);
            context.env.set(symbol, variable);
          }
        }
      } else if (ts.isExpressionStatement(statement)) {
        const value = this.evaluate(statement.expression, context);
        if (tagged(value, "trigger") || tagged(value, "query"))
          this.fail(
            statement,
            "KRG2061",
            "An unused game trigger has no effect. Return it or use it in a condition.",
          );
      } else if (ts.isReturnStatement(statement)) {
        if (context.dynamicBranch)
          this.fail(
            statement,
            "KRG2062",
            "Early returns inside runtime branches cannot be lowered safely. Restructure the branch.",
          );
        throw new ReturnValue(
          statement.expression ? this.evaluate(statement.expression, context) : undefined,
        );
      } else if (ts.isBlock(statement))
        this.statements(statement.statements, { ...context, env: new Map(context.env) });
      else if (ts.isIfStatement(statement)) {
        const condition = this.evaluate(statement.expression, { ...context, mode: "trigger" });
        if (typeof condition === "boolean") {
          const branch = condition ? statement.thenStatement : statement.elseStatement;
          if (branch) this.statements([branch], { ...context, env: new Map(context.env) });
        } else {
          if (context.mode !== "effect")
            this.fail(
              statement,
              "KRG2063",
              "Runtime if/else is supported in effects. Return a combined boolean expression from triggers.",
            );
          const thenItems: pdx.PdxItem[] = [
            pdx.property(
              "limit",
              pdx.block(this.trigger(condition, statement.expression, context)),
            ),
          ];
          this.statements([statement.thenStatement], {
            ...context,
            env: new Map(context.env),
            sink: thenItems,
            dynamicBranch: true,
          });
          context.sink.push(pdx.property("if", pdx.block(thenItems)));
          if (statement.elseStatement) {
            const elseItems: pdx.PdxItem[] = [];
            this.statements([statement.elseStatement], {
              ...context,
              env: new Map(context.env),
              sink: elseItems,
              dynamicBranch: true,
            });
            context.sink.push(pdx.property("else", pdx.block(elseItems)));
          }
        }
      } else if (ts.isForOfStatement(statement)) {
        const values = this.array(
          this.evaluate(statement.expression, context),
          statement.expression,
        );
        const declaration = (statement.initializer as ts.VariableDeclarationList).declarations[0];
        const symbol = this.symbol(declaration.name)!;
        for (const value of values) {
          const env = new Map(context.env);
          env.set(symbol, value);
          this.statements([statement.statement], { ...context, env });
        }
      } else if (
        ts.isFunctionDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isEmptyStatement(statement)
      )
        continue;
      else
        this.fail(
          statement,
          "KRG2064",
          `Statement ${ts.SyntaxKind[statement.kind]} has no static lowering.`,
        );
    }
  }

  private definition(
    name: string,
    args: Value[],
    node: ts.Node,
    context: Context,
  ): CompileOutput[] {
    if (name === "SourceFile")
      return [
        this.output(this.string(args[0], node), args[1] as pdx.PdxDocument, node, "ordered-pdx"),
      ];
    if (name === "DataFile") {
      const data = this.toPdx(this.object(args[1], node), node, context);
      return [
        this.output(
          this.string(args[0], node),
          pdx.document((data as pdx.PdxBlock).items),
          node,
          "structured-data",
        ),
      ];
    }
    if (name.includes("ScriptedEffect") || name.includes("ScriptedTrigger")) {
      const id = this.string(args[0], node);
      const mode = name.endsWith("Trigger") ? "trigger" : "effect";
      const scope =
        args.length === 3
          ? this.string(args[1], node)
          : name.startsWith("State")
            ? "state"
            : "country";
      const items = this.callback(args.length === 3 ? args[2] : args[1], scope, mode, node, {
        ...context,
        prefix: safeId(id),
      });
      return [
        this.output(
          `common/scripted_${mode}s/krieg_${safeId(id)}.txt`,
          pdx.document([pdx.property(id, pdx.block(items))]),
          node,
        ),
      ];
    }
    if (name === "StateHistory") {
      const spec = this.object(args[0], node);
      this.checkKeys(
        spec,
        [
          "state",
          "name",
          "manpower",
          "category",
          "provinces",
          "owner",
          "controller",
          "cores",
          "buildings",
          "resources",
          "victoryPoints",
          "localSupplies",
          "impassable",
          "history",
          "path",
        ],
        node,
        "StateHistory",
      );
      const reference = this.object(spec.state, node);
      const id = reference.id;
      const ctx = { ...context, prefix: `state_${String(id)}` };
      const items: pdx.PdxItem[] = [
        pdx.property("id", this.toPdx(id, node, ctx)),
        pdx.property("name", this.toPdx(spec.name, node, ctx)),
        pdx.property("manpower", this.toPdx(spec.manpower, node, ctx)),
        pdx.property("state_category", this.toPdx(spec.category, node, ctx)),
      ];
      if (spec.resources !== undefined)
        items.push(pdx.property("resources", this.toPdx(spec.resources, node, ctx)));
      const history: pdx.PdxItem[] = [];
      for (const key of ["owner", "controller", "buildings"])
        if (spec[key] !== undefined)
          history.push(pdx.property(key, this.toPdx(spec[key], node, ctx)));
      for (const core of this.array(spec.cores ?? [], node))
        history.push(pdx.property("add_core_of", this.toPdx(core, node, ctx)));
      for (const point of this.array(spec.victoryPoints ?? [], node)) {
        const value = this.object(point, node);
        this.checkKeys(value, ["province", "value"], node, "Victory point");
        history.push(
          pdx.property(
            "victory_points",
            pdx.block([this.toPdx(value.province, node, ctx), this.toPdx(value.value, node, ctx)]),
          ),
        );
      }
      if (spec.history !== undefined)
        history.push(...this.callback(spec.history, "state", "effect", node, ctx));
      items.push(
        pdx.property("history", pdx.block(history)),
        pdx.property("provinces", this.toPdx(spec.provinces, node, ctx)),
      );
      if (spec.localSupplies !== undefined)
        items.push(pdx.property("local_supplies", this.toPdx(spec.localSupplies, node, ctx)));
      if (spec.impassable !== undefined)
        items.push(pdx.property("impassable", this.toPdx(spec.impassable, node, ctx)));
      return [
        this.output(
          spec.path === undefined
            ? `history/states/${String(id)} - Krieg.txt`
            : this.string(spec.path, node),
          pdx.document([pdx.property("state", pdx.block(items))]),
          node,
        ),
      ];
    }
    if (name === "CountryHistory") {
      const spec = this.object(args[0], node);
      this.checkKeys(
        spec,
        ["country", "capital", "oob", "startingTrainBuffer", "history", "path"],
        node,
        "CountryHistory",
      );
      const reference = this.object(spec.country, node);
      const id = String(reference.tag);
      const ctx = { ...context, prefix: safeId(id) };
      const items: pdx.PdxItem[] = [pdx.property("capital", this.toPdx(spec.capital, node, ctx))];
      if (spec.oob !== undefined) items.push(pdx.property("oob", this.toPdx(spec.oob, node, ctx)));
      if (spec.startingTrainBuffer !== undefined)
        items.push(
          pdx.property("starting_train_buffer", this.toPdx(spec.startingTrainBuffer, node, ctx)),
        );
      if (spec.history !== undefined)
        items.push(...this.callback(spec.history, "country", "effect", node, ctx));
      return [
        this.output(
          spec.path === undefined
            ? `history/countries/${id} - Krieg.txt`
            : this.string(spec.path, node),
          pdx.document(items),
          node,
        ),
      ];
    }
    const spec = this.object(args[0], node);
    const id = this.string(spec.id, node);
    const ctx = { ...context, prefix: safeId(id) };
    const scalarFields = (mapping: Record<string, string>, object = spec): pdx.PdxItem[] =>
      Object.entries(mapping)
        .filter(([key]) => object[key] !== undefined)
        .map(([key, target]) => pdx.property(target, this.toPdx(object[key], node, ctx)));
    const callbackFields = (
      mapping: Record<string, ["effect" | "trigger", string]>,
      object = spec,
      scope = "country",
    ): pdx.PdxItem[] =>
      Object.entries(mapping)
        .filter(([key]) => object[key] !== undefined)
        .map(([key, [mode, target]]) =>
          pdx.property(target, pdx.block(this.callback(object[key], scope, mode, node, ctx))),
        );
    if (name.endsWith("Event")) {
      this.checkKeys(
        spec,
        [
          "id",
          "title",
          "description",
          "picture",
          "isTriggeredOnly",
          "fireOnlyOnce",
          "major",
          "hidden",
          "meanTimeToHappen",
          "trigger",
          "immediate",
          "options",
        ],
        node,
        name,
      );
      if (spec.hidden !== true && spec.title === undefined)
        this.fail(
          node,
          "KRG2075",
          "Visible events require a title localisation key. Set hidden: true for an invisible event.",
        );
      if (spec.meanTimeToHappen !== undefined)
        this.checkKeys(
          this.object(spec.meanTimeToHappen, node),
          ["days", "months", "years"],
          node,
          "meanTimeToHappen",
        );
      const scope = name === "StateEvent" ? "state" : "country";
      const eventKey =
        name === "NewsEvent"
          ? "news_event"
          : name === "StateEvent"
            ? "state_event"
            : "country_event";
      const items = scalarFields({
        id: "id",
        title: "title",
        description: "desc",
        picture: "picture",
        isTriggeredOnly: "is_triggered_only",
        fireOnlyOnce: "fire_only_once",
        major: "major",
        hidden: "hidden",
        meanTimeToHappen: "mean_time_to_happen",
      });
      items.push(
        ...callbackFields(
          { trigger: ["trigger", "trigger"], immediate: ["effect", "immediate"] },
          spec,
          scope,
        ),
      );
      for (const optionValue of this.array(spec.options ?? [], node)) {
        const option = this.object(optionValue, node);
        this.checkKeys(option, ["name", "trigger", "aiChance", "effects"], node, "Event option");
        const optionItems = scalarFields({ name: "name" }, option);
        if (option.aiChance !== undefined)
          optionItems.push(
            pdx.property(
              "ai_chance",
              pdx.block([pdx.property("base", this.toPdx(option.aiChance, node, ctx))]),
            ),
          );
        optionItems.push(...callbackFields({ trigger: ["trigger", "trigger"] }, option, scope));
        if (option.effects !== undefined)
          optionItems.push(...this.callback(option.effects, scope, "effect", node, ctx));
        items.push(pdx.property("option", pdx.block(optionItems)));
      }
      const namespace = id.includes(".") ? id.slice(0, id.lastIndexOf(".")) : undefined;
      const document = pdx.document([
        ...(namespace ? [pdx.property("add_namespace", pdx.atom(namespace))] : []),
        pdx.property(eventKey, pdx.block(items)),
      ]);
      return [this.output(`events/krieg_${safeId(id)}.txt`, document, node)];
    }
    if (name === "FocusTree") {
      this.checkKeys(spec, ["id", "country", "default", "focuses"], node, "FocusTree");
      const items = scalarFields({ id: "id", default: "default" });
      if (spec.country)
        items.push(
          pdx.property(
            "country",
            pdx.block([
              pdx.property("factor", pdx.atom("0")),
              pdx.property(
                "modifier",
                pdx.block([
                  pdx.property("add", pdx.atom("10")),
                  ...this.callback(spec.country, "country", "trigger", node, ctx),
                ]),
              ),
            ]),
          ),
        );
      else items.push(pdx.property("country", pdx.block([pdx.property("factor", pdx.atom("1"))])));
      for (const focusValue of this.array(spec.focuses, node)) {
        const focus = this.object(focusValue, node);
        this.checkKeys(
          focus,
          [
            "id",
            "icon",
            "x",
            "y",
            "cost",
            "relativePositionId",
            "prerequisites",
            "mutuallyExclusive",
            "available",
            "bypass",
            "cancelIfInvalid",
            "continueIfInvalid",
            "completionReward",
            "aiWillDo",
          ],
          node,
          "Focus",
        );
        const focusItems = scalarFields(
          {
            id: "id",
            icon: "icon",
            x: "x",
            y: "y",
            cost: "cost",
            relativePositionId: "relative_position_id",
            cancelIfInvalid: "cancel_if_invalid",
            continueIfInvalid: "continue_if_invalid",
          },
          focus,
        );
        for (const group of this.array(focus.prerequisites ?? [], node))
          focusItems.push(
            pdx.property(
              "prerequisite",
              pdx.block(
                this.array(group, node).map((value) =>
                  pdx.property("focus", this.toPdx(value, node, ctx)),
                ),
              ),
            ),
          );
        if (focus.mutuallyExclusive !== undefined)
          focusItems.push(
            pdx.property(
              "mutually_exclusive",
              pdx.block(
                this.array(focus.mutuallyExclusive, node).map((value) =>
                  pdx.property("focus", this.toPdx(value, node, ctx)),
                ),
              ),
            ),
          );
        focusItems.push(
          ...callbackFields(
            {
              available: ["trigger", "available"],
              bypass: ["trigger", "bypass"],
              completionReward: ["effect", "completion_reward"],
            },
            focus,
          ),
        );
        if (focus.aiWillDo !== undefined)
          focusItems.push(
            pdx.property(
              "ai_will_do",
              pdx.block([pdx.property("factor", this.toPdx(focus.aiWillDo, node, ctx))]),
            ),
          );
        items.push(pdx.property("focus", pdx.block(focusItems)));
      }
      return [
        this.output(
          `common/national_focus/krieg_${safeId(id)}.txt`,
          pdx.document([pdx.property("focus_tree", pdx.block(items))]),
          node,
        ),
      ];
    }
    if (name === "DecisionCategory") {
      this.checkKeys(
        spec,
        ["id", "icon", "visible", "allowed", "decisions"],
        node,
        "DecisionCategory",
      );
      const category = [
        ...scalarFields({ icon: "icon" }),
        ...callbackFields({ visible: ["trigger", "visible"], allowed: ["trigger", "allowed"] }),
      ];
      const decisions: pdx.PdxItem[] = [];
      for (const decisionValue of this.array(spec.decisions, node)) {
        const decision = this.object(decisionValue, node);
        this.checkKeys(
          decision,
          [
            "id",
            "icon",
            "cost",
            "daysRemove",
            "daysReEnable",
            "visible",
            "available",
            "completeEffect",
            "removeEffect",
            "aiWillDo",
          ],
          node,
          "Decision",
        );
        const items = scalarFields(
          { icon: "icon", cost: "cost", daysRemove: "days_remove", daysReEnable: "days_re_enable" },
          decision,
        );
        items.push(
          ...callbackFields(
            {
              visible: ["trigger", "visible"],
              available: ["trigger", "available"],
              completeEffect: ["effect", "complete_effect"],
              removeEffect: ["effect", "remove_effect"],
            },
            decision,
          ),
        );
        if (decision.aiWillDo !== undefined)
          items.push(
            pdx.property(
              "ai_will_do",
              pdx.block([pdx.property("factor", this.toPdx(decision.aiWillDo, node, ctx))]),
            ),
          );
        decisions.push(pdx.property(this.string(decision.id, node), pdx.block(items)));
      }
      return [
        this.output(
          `common/decisions/categories/krieg_${safeId(id)}.txt`,
          pdx.document([pdx.property(id, pdx.block(category))]),
          node,
        ),
        this.output(
          `common/decisions/krieg_${safeId(id)}.txt`,
          pdx.document([pdx.property(id, pdx.block(decisions))]),
          node,
        ),
      ];
    }
    if (name === "Idea") {
      this.checkKeys(
        spec,
        ["id", "picture", "allowed", "visible", "removalCost", "modifier", "onAdd", "onRemove"],
        node,
        "Idea",
      );
      if (spec.modifier !== undefined)
        this.checkKeys(
          this.object(spec.modifier, node),
          [
            "stability_factor",
            "war_support_factor",
            "political_power_gain",
            "political_power_factor",
            "consumer_goods_factor",
            "production_speed_buildings_factor",
            "industrial_capacity_factory",
            "research_speed_factor",
            "conscription_factor",
            "army_org_factor",
          ],
          node,
          "Idea modifier",
        );
      const items = [
        ...scalarFields({ picture: "picture", removalCost: "removal_cost", modifier: "modifier" }),
        ...callbackFields({
          allowed: ["trigger", "allowed"],
          visible: ["trigger", "visible"],
          onAdd: ["effect", "on_add"],
          onRemove: ["effect", "on_remove"],
        }),
      ];
      return [
        this.output(
          `common/ideas/krieg_${safeId(id)}.txt`,
          pdx.document([
            pdx.property(
              "ideas",
              pdx.block([pdx.property("country", pdx.block([pdx.property(id, pdx.block(items))]))]),
            ),
          ]),
          node,
        ),
      ];
    }
    this.fail(node, "KRG2065", `Definition '${name}' has no lowering.`);
  }
}
