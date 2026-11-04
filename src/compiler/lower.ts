import { runtimeLoopIssue } from "./loop-syntax.js";
import { parameterBindingIssue } from "./parameter-syntax.js";
import { flagStorage } from "./flag-storage.js";
import { indexDispatch } from "./indexed-dispatch.js";
import ts from "typescript";
import path from "node:path";
import * as pdx from "../pdx/ast.js";
import { NativeOrigins } from "./native-trace.js";
import { parsePdx } from "../pdx/parser.js";
import type { CwtSchema } from "../schema/types.js";
import { commandAllowed } from "./sdk.js";
import { commandValueError } from "./command-validation.js";
import { CountryActions } from "./country-actions.js";
import { DOMAIN_DEFINITIONS, DOMAIN_SCHEMA, type NativeValue } from "./domain-registry.js";
import { lowerDefines } from "./defines.js";
import { audioBank } from "./audio-bank.js";
import { countryHeatmap } from "./country-heatmap.js";
import { stackElements } from "./stack.js";
import {
  STYLE_NATIVE_NAMES,
  type StyleModule,
  type StyleClassValue,
  type StyleDeclaration,
} from "./styles.js";
import { normalizeScriptedFamily, ScriptedFamilyError } from "./scripted-families.js";
import {
  GameplayError,
  normalizeEventDelay,
  normalizeFocusGraph,
  validateEventIdentifier,
} from "./gameplay.js";
import {
  composeScriptedWindow,
  guiElements,
  GUI_BINDING_KEYS,
  SCRIPTED_WINDOW_COMPONENTS,
  type GuiElementValue,
} from "./scripted-window.js";
import type { CompileOptions, CompileOutput, PdxCompileOutput, KriegDiagnostic } from "./types.js";

type Value = unknown;
type Environment = Map<ts.Symbol, Value>;
type Scope = { _krg: "scope"; name: string; id: number; parent?: Scope };
type Callable = { _krg: "function"; node: ts.FunctionLikeDeclaration; env: Environment };
type Builtin = {
  _krg: "builtin";
  name: string;
  module: "sdk" | "pdx" | "ui";
  guiOwner?: number;
};
type Member = { _krg: "member"; object: Value; name: string };
type Trigger = { _krg: "trigger"; items: pdx.PdxItem[] };
type Variable = {
  _krg: "variable";
  name: string;
  scope: Scope;
  mutable: boolean;
  property?: true;
  temporary?: boolean;
  lengthOf?: RuntimeArray;
};
type VariableState = {
  _krg: "variable-state";
  scope: string;
  names: Record<string, string>;
};
type BoundVariableState = {
  _krg: "bound-variable-state";
  scope: Scope;
  names: Record<string, string>;
};
type Query = {
  _krg: "query";
  name: string;
  scope: Scope;
  boolean?: boolean;
  metric?: { field: string; before: pdx.PdxItem[]; after: pdx.PdxItem[] };
};
type RuntimeArray = { _krg: "array"; name: string; scope: Scope; temporary?: boolean };
type Arithmetic = { _krg: "arithmetic"; operator: ts.SyntaxKind; left: Value; right: Value };
type Definition = {
  _krg: "definition";
  outputs: CompileOutput[];
  id?: string;
  name?: string;
  scope?: string;
  definitionKind?: "effect" | "trigger";
  eventScope?: "country" | "state";
  focuses?: Record<string, { _krg: "focus-reference"; id: string }>;
  pendingOutput?: () => CompileOutput[];
};
type ParameterizedEffect = {
  parameters: Record<string, "number" | "number[]">;
  callback: Callable;
};
interface Context {
  env: Environment;
  mode: "top" | "effect" | "trigger";
  sink: pdx.PdxItem[];
  scope?: Scope;
  prefix: string;
  declarationFile?: string;
  dynamicBranch?: boolean;
  immediateRecord?: ts.Expression;
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
  availableManpower: "has_manpower",
  commandPower: "command_power",
  militaryFactories: "num_of_military_factories",
  civilianFactories: "num_of_civilian_factories",
  navalFactories: "num_of_naval_factories",
  politicalPower: "has_political_power",
  armyExperience: "has_army_experience",
  navyExperience: "has_navy_experience",
  airExperience: "has_air_experience",
  stability: "has_stability",
  warSupport: "has_war_support",
  manpower: "state_population",
  isAI: "is_ai",
  energyRatio: "energy_ratio",
  factories: "num_of_factories",
  surrenderProgress: "surrender_progress",
};
const definitions = new Set([
  ...Object.keys(DOMAIN_DEFINITIONS),
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
  "ScriptedLocalisation",
  "ScriptedGui",
  "Defines",
  "DefineFile",
]);
const forbiddenKinds = new Set([
  ts.SyntaxKind.ClassDeclaration,
  ts.SyntaxKind.ClassExpression,
  ts.SyntaxKind.NewExpression,
  ts.SyntaxKind.AwaitExpression,
  ts.SyntaxKind.YieldExpression,
  ts.SyntaxKind.DoStatement,
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
  ts.SyntaxKind.NonNullExpression,
]);

/** A bounded AST interpreter for compile-time values and game IR, never JavaScript. */
export class Lowerer {
  private readonly origins = new NativeOrigins();
  private readonly styleOrigins = new WeakMap<object, Map<string, StyleDeclaration>>();
  private readonly checker: ts.TypeChecker;
  private readonly sources: ts.SourceFile[];
  private readonly cache = new Map<ts.Symbol, Value>();
  private readonly evaluating = new Set<ts.Symbol>();
  private readonly calls: ts.FunctionLikeDeclaration[] = [];
  private readonly outputs: CompileOutput[] = [];
  private readonly outputDefinitions = new Set<Definition>();
  private readonly scriptedFamilies = new WeakMap<object, Definition[]>();
  private readonly parameterizedEffects = new WeakMap<object, ParameterizedEffect>();
  private readonly scriptedNames = new Set<string>();
  private readonly gameplayIds = new Set<string>();
  private readonly countryActions = new CountryActions((node, code, message) =>
    this.fail(node, code, message),
  );
  private readonly pendingActions = new Map<Definition, { node: ts.Node; source: string }>();
  private count = 0;
  private sequence = 0;
  private guiSequence = 0;
  private readonly schema: CwtSchema;
  constructor(
    private readonly program: ts.Program,
    private readonly options: CompileOptions & { schema: CwtSchema },
    private readonly diagnostics: KriegDiagnostic[],
    private readonly styleModules: ReadonlyMap<string, StyleModule> = new Map(),
  ) {
    this.checker = program.getTypeChecker();
    this.sources = program.getSourceFiles().filter((source) => !source.isDeclarationFile);
    this.schema = options.schema;
  }
  private report(
    node: ts.Node,
    code: string,
    message: string,
    severity: KriegDiagnostic["severity"] = "error",
  ): void {
    const source = node.getSourceFile();
    const position = source.getLineAndCharacterOfPosition(node.getStart(source));
    this.diagnostics.push({
      code,
      severity,
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
      if (!/\.krg\.tsx?$/.test(source.fileName))
        this.report(
          source,
          "KRG1000",
          "Krieg project implementation modules must use the .krg.ts or .krg.tsx extension.",
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
        const loopIssue = runtimeLoopIssue(node);
        if (loopIssue) this.report(node, "KRG1001", `Krieg does not support ${loopIssue}.`);
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
            if (
              !parameter.type &&
              this.checker.getTypeAtLocation(parameter).flags & ts.TypeFlags.Any
            )
              this.report(
                parameter,
                "KRG1005",
                "A parameter requires an explicit type or a safe type inferred from its callback context.",
              );
            const bindingIssue = parameterBindingIssue(parameter);
            if (bindingIssue)
              this.report(
                parameter,
                "KRG1006",
                `Krieg does not support ${bindingIssue}. Use identifiers or shallow named object fields.`,
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
            name !== "krieg-lang/ui" &&
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
        declarationFile: source.fileName,
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
    const emittedFiles = new Set(emittedSources.map((source) => source.fileName));
    for (const [action, origin] of this.pendingActions) {
      if (!emittedFiles.has(origin.source)) continue;
      try {
        this.emitValue(action, origin.node);
      } catch (error) {
        if (!(error instanceof CompileFailure)) throw error;
      }
    }
    const merged = new Map<string, CompileOutput>();
    for (const output of this.outputs) {
      const previous = merged.get(output.path);
      if (previous) {
        if (previous.representation !== output.representation || previous.format !== output.format)
          this.diagnostics.push({
            code: "KRG1013",
            severity: "error",
            message: `Output '${output.path}' mixes semantic and ordered-PDX declarations. Give them distinct explicit paths.`,
            file: output.sourceFile,
          });
        if (previous.format === "pdx" && output.format === "pdx") {
          // The engine schema permits one map-mode wrapper per file. Semantic
          // map declarations share that wrapper; ordered documents stay literal.
          const left = previous.document.items[0];
          const right = output.document.items[0];
          if (
            previous.representation === "semantic" &&
            output.representation === "semantic" &&
            output.path.startsWith("common/map_modes/") &&
            previous.document.items.length === 1 &&
            output.document.items.length === 1 &&
            left?.kind === "property" &&
            right?.kind === "property" &&
            left.key.text === "scripted_map_modes" &&
            right.key.text === "scripted_map_modes" &&
            left.value.kind === "block" &&
            right.value.kind === "block"
          )
            left.value.items.push(...right.value.items);
          else previous.document.items.push(...output.document.items);
        } else if (previous.format === "lua" && output.format === "lua") {
          if (output.lineOrigins?.length) {
            const offset = previous.text.split("\n").length - 1;
            (previous.lineOrigins ??= []).push(
              ...output.lineOrigins.map((r) => ({
                ...r,
                from: r.from + offset,
                to: r.to + offset,
              })),
            );
          }
          previous.text += output.text;
        }
      } else
        merged.set(
          output.path,
          output.format === "pdx"
            ? { ...output, document: pdx.document(output.document.items) }
            : { ...output },
        );
    }
    if (this.options.traceSources)
      for (const output of merged.values()) {
        if (output.format === "pdx" && output.representation !== "ordered-pdx")
          output.tracePoints = this.origins.collect(output.document);
      }
    return [...merged.values()].sort((a, b) => a.path.localeCompare(b.path));
  }
  private emitValue(value: Value, node: ts.Node): void {
    if (record(value) && this.scriptedFamilies.has(value)) {
      this.scriptedFamilies.get(value)!.forEach((definition) => this.emitValue(definition, node));
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => this.emitValue(item, node));
      return;
    }
    if (tagged(value, "definition")) {
      const definition = value as Definition;
      if (!this.outputDefinitions.has(definition)) {
        this.outputDefinitions.add(definition);
        if (definition.pendingOutput) {
          definition.outputs = definition.pendingOutput();
          delete definition.pendingOutput;
        }
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
        .replace(/\.krg\.tsx?$/, ".txt");
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
  ): PdxCompileOutput {
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
    if (this.options.traceSources && representation !== "ordered-pdx")
      this.origins.mark(document.items, node, "declaration");
    return {
      format: "pdx",
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
    const styleModule = this.styleModules.get(module);
    if (styleModule) return styleModule.classes;
    if (
      [
        "krieg-lang_hoi4.d.ts",
        "krieg-lang_hoi4_domains.d.ts",
        "krieg-lang_hoi4_defines.d.ts",
        "krieg-lang_hoi4_gameplay.d.ts",
      ].some((file) => module === path.join(this.options.rootDir, ".krieg-compiler-virtual", file))
    )
      return { _krg: "builtin", name: symbol.name, module: "sdk" } as Builtin;
    if (module === path.join(this.options.rootDir, ".krieg-compiler-virtual/krieg-lang_pdx.d.ts"))
      return { _krg: "builtin", name: symbol.name, module: "pdx" } as Builtin;
    if (
      module === path.join(this.options.rootDir, ".krieg-compiler-virtual/krieg-lang_ui.d.ts") ||
      module ===
        path.join(this.options.rootDir, ".krieg-compiler-virtual/krieg-lang_ui_native.d.ts")
    )
      return { _krg: "builtin", name: symbol.name, module: "ui" } as Builtin;
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
          declarationFile: declaration.getSourceFile().fileName,
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
          declarationFile: declaration.getSourceFile().fileName,
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
  // A project map may contain tens of thousands of literal provinces. Resolve a
  // literal access from its genuine ambient root without materializing every area.
  // Walk the declaration's own type; source casts and asserted property types are
  // deliberately not trusted as compile-time values.
  private projectPropertyValue(node: ts.Expression): { value: Value } | undefined {
    const keys: string[] = [];
    let root = node;
    while (ts.isPropertyAccessExpression(root) || ts.isElementAccessExpression(root)) {
      if (ts.isPropertyAccessExpression(root)) keys.unshift(root.name.text);
      else if (
        ts.isStringLiteral(root.argumentExpression) ||
        ts.isNumericLiteral(root.argumentExpression)
      )
        keys.unshift(root.argumentExpression.text);
      else return undefined;
      root = root.expression;
    }
    if (!ts.isIdentifier(root) || !keys.length) return undefined;
    const symbol = this.symbol(root);
    const declaration = symbol?.valueDeclaration;
    const trustedRoot = path.join(this.options.rootDir, ".krieg-compiler-virtual") + path.sep;
    if (
      !declaration ||
      !ts.isVariableDeclaration(declaration) ||
      declaration.initializer ||
      !declaration.getSourceFile().isDeclarationFile ||
      this.styleModules.has(declaration.getSourceFile().fileName) ||
      !declaration.getSourceFile().fileName.startsWith(trustedRoot)
    )
      return undefined;
    let type = this.checker.getTypeAtLocation(declaration);
    for (const key of keys) {
      const property = this.checker.getPropertyOfType(type, key);
      if (!property) return undefined;
      type = this.checker.getTypeOfSymbolAtLocation(property, declaration);
    }
    return { value: this.typeValue(type, node, 0) };
  }
  private evaluate(node: ts.Expression, context: Context): Value {
    if (!this.options.traceSources) return this.evaluateExpression(node, context);
    const before = context.sink.length;
    const value = this.evaluateExpression(node, context);
    if (context.sink.length > before) this.origins.mark(context.sink, node, "expression", before);
    if (tagged(value, "trigger") && Array.isArray(value.items))
      this.origins.mark(value.items, node, "expression");
    return value;
  }
  private evaluateExpression(node: ts.Expression, context: Context): Value {
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
      return this.evaluate(node.expression, {
        ...context,
        immediateRecord:
          context.immediateRecord === node ? node.expression : context.immediateRecord,
      });
    if (ts.isArrayLiteralExpression(node)) {
      let values: Value[] = [];
      const immediate = context.immediateRecord === node;
      for (const element of node.elements) {
        if (ts.isOmittedExpression(element))
          this.fail(element, "KRG2011", "Sparse arrays are not supported.");
        const expression = ts.isSpreadElement(element) ? element.expression : element;
        const pending = {
          ...context,
          sink: [] as pdx.PdxItem[],
          immediateRecord: immediate ? expression : undefined,
        };
        const value = this.evaluate(expression, pending);
        if (pending.sink.length)
          values = values.map((earlier) => this.snapshotValue(earlier, element, context));
        context.sink.push(...pending.sink);
        const items = ts.isSpreadElement(element) ? this.array(value, element) : [value];
        values.push(
          ...items.map((item) => (immediate ? item : this.snapshotNumber(item, element, context))),
        );
      }
      return values;
    }
    if (ts.isObjectLiteralExpression(node)) {
      const value: Record<string, Value> = Object.create(null);
      const immediate = context.immediateRecord === node;
      for (const property of node.properties) {
        const pending = { ...context, sink: [] as pdx.PdxItem[] };
        const store = (entries: Record<string, Value>): void => {
          if (pending.sink.length)
            for (const key of Object.keys(value))
              value[key] = this.snapshotValue(value[key], property, context);
          context.sink.push(...pending.sink);
          for (const [key, item] of Object.entries(entries))
            value[key] = immediate ? item : this.snapshotNumber(item, property, context);
        };
        if (ts.isSpreadAssignment(property)) {
          if (immediate) pending.immediateRecord = property.expression;
          store(this.object(this.evaluate(property.expression, pending), property));
          continue;
        }
        if (ts.isShorthandPropertyAssignment(property)) {
          store({
            [property.name.text]: this.lookup(
              property.name,
              pending,
              this.checker.getShorthandAssignmentValueSymbol(property),
            ),
          });
          continue;
        }
        if (!ts.isPropertyAssignment(property))
          this.fail(
            property,
            "KRG2012",
            "Object methods and accessors are not supported. Use a named function or arrow callback.",
          );
        const key = ts.isComputedPropertyName(property.name)
          ? this.evaluate(property.name.expression, pending)
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
        if (immediate) pending.immediateRecord = property.initializer;
        store({ [String(key)]: this.evaluate(property.initializer, pending) });
      }
      return value;
    }
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node))
      return { _krg: "function", node, env: new Map(context.env) } as Callable;
    if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
      const projectValue = this.projectPropertyValue(node);
      if (projectValue) return projectValue.value;
      const object = this.evaluate(node.expression, context);
      const key = ts.isPropertyAccessExpression(node)
        ? node.name.text
        : this.evaluate(node.argumentExpression, context);
      if (tagged(object, "array")) {
        const array = object as RuntimeArray;
        if (key === "length") return this.arrayVariable(array, "num", false);
        if (typeof key === "string" && ["push", "includes", "splice"].includes(key))
          return { _krg: "member", object, name: key } as Member;
        if (ts.isElementAccessExpression(node)) {
          const parent = node.parent;
          const assigned =
            (ts.isBinaryExpression(parent) &&
              parent.left === node &&
              parent.operatorToken.kind >= ts.SyntaxKind.FirstAssignment &&
              parent.operatorToken.kind <= ts.SyntaxKind.LastAssignment) ||
            ts.isPostfixUnaryExpression(parent) ||
            ts.isPrefixUnaryExpression(parent);
          const index =
            assigned && context.mode === "effect" ? this.arrayArgument(key, node, context) : key;
          return this.arrayVariable(array, this.arrayIndex(index, node, context), true);
        }
        this.fail(
          node,
          "KRG2750",
          "Runtime arrays support indexed access, length, push, includes and standalone splice.",
        );
      }
      if (typeof key !== "string" && typeof key !== "number")
        this.fail(node, "KRG2015", "Property indices must be compile-time strings or numbers.");
      const name = String(key);
      if (tagged(object, "namespace")) {
        const module = object.name;
        if (
          module === "krieg-lang/pdx" ||
          module === "krieg-lang/hoi4" ||
          module === "krieg-lang/ui"
        )
          return {
            _krg: "builtin",
            name,
            module: module === "krieg-lang/pdx" ? "pdx" : module === "krieg-lang/ui" ? "ui" : "sdk",
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
      if (
        tagged(object, "bound-variable-state") ||
        (tagged(object, "variable-state") && object.scope === "global")
      ) {
        return this.stateProperty(
          object as VariableState | BoundVariableState,
          name,
          node,
          context,
        );
      }
      if (tagged(object, "member")) return { _krg: "member", object, name } as Member;
      if (Array.isArray(object)) {
        if (["push", "splice", "includes"].includes(name))
          this.fail(
            node,
            "KRG2750",
            "Use let or an explicit number[] annotation for a runtime array.",
          );
        if (["map", "flatMap", "filter", "some", "every"].includes(name))
          return { _krg: "member", object, name } as Member;
        return name === "length" ? object.length : object[Number(name)];
      }
      if (typeof object === "string" && name === "length") return object.length;
      if (record(object) && Object.hasOwn(object, name)) return object[name];
      this.fail(node, "KRG2016", `Property '${name}' does not have a static value.`);
    }
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node))
      return this.jsx(node, context);
    if (ts.isCallExpression(node)) {
      const callable = this.evaluate(node.expression, context);
      const nativeCommand =
        tagged(callable, "member") &&
        (tagged(callable.object, "scope") ||
          (tagged(callable.object, "member") &&
            ["effects", "triggers"].includes(String(callable.object.name)) &&
            tagged(callable.object.object, "scope")));
      const parameterCall =
        tagged(callable, "definition") && this.parameterizedEffects.has(callable);
      let args: Value[] = [];
      for (const argument of node.arguments) {
        if (ts.isSpreadElement(argument))
          this.fail(argument, "KRG2017", "Spread call arguments are not supported.");
        const pending = {
          ...context,
          sink: [] as pdx.PdxItem[],
          immediateRecord:
            nativeCommand || (args.length === 1 && parameterCall) ? argument : undefined,
        };
        const value = this.evaluate(argument, pending);
        if (pending.sink.length)
          args = args.map((earlier) => this.snapshotValue(earlier, argument, context));
        context.sink.push(...pending.sink);
        args.push(value);
      }
      return this.call(callable, args, node, context);
    }
    if (ts.isBinaryExpression(node)) return this.binary(node, context);
    if (ts.isPrefixUnaryExpression(node)) {
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

  private call(callable: Value, args: Value[], node: ts.Node, context: Context): Value {
    if (tagged(callable, "definition") && callable.definitionKind === "effect") {
      if (!tagged(args[0], "scope"))
        this.fail(node, "KRG2066", "A scripted effect call requires its typed game scope first.");
      return this.memberCall(
        { _krg: "member", object: args[0], name: "run" },
        [callable, ...args.slice(1)],
        node,
        context,
      );
    }
    if (tagged(callable, "builtin")) {
      const builtin = callable as Builtin;
      return builtin.module === "pdx"
        ? this.pdxCall(builtin.name, args, node)
        : builtin.module === "ui"
          ? this.uiCall(builtin.name, args, node, context, builtin.guiOwner)
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
  private snapshotValue(value: Value, node: ts.Node, context: Context): Value {
    if (context.mode !== "effect") return value;
    if (Array.isArray(value)) return value.map((item) => this.snapshotValue(item, node, context));
    if (record(value) && !("_krg" in value))
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, this.snapshotValue(item, node, context)]),
      );
    return this.snapshotNumber(value, node, context);
  }
  private snapshotNumber(value: Value, node: ts.Node, context: Context): Value {
    if (
      context.mode !== "effect" ||
      !context.scope ||
      (!tagged(value, "variable") && !tagged(value, "arithmetic"))
    )
      return value;
    if (
      tagged(value, "variable") &&
      value.temporary &&
      !value.mutable &&
      !value.property &&
      !String(value.name).includes("^")
    )
      return value;
    const name = `krg_${context.prefix}_value_${++this.sequence}`;
    this.variableEffect("set_temp_variable", name, value, node, context);
    return {
      _krg: "variable",
      name,
      scope: context.scope,
      mutable: false,
      temporary: true,
    } as Variable;
  }
  private invoke(callable: Callable, args: Value[], call: ts.Node, context: Context): Value {
    if (this.calls.includes(callable.node))
      this.fail(call, "KRG2023", "Recursive helper expansion is not supported.");
    if (!callable.node.body) this.fail(call, "KRG2024", "Helper function has no body.");
    const env = new Map(callable.env);
    const bind = (identifier: ts.Identifier, argument: Value): void => {
      if (
        context.mode === "effect" &&
        context.scope &&
        (tagged(argument, "variable") || tagged(argument, "arithmetic"))
      ) {
        const name = `krg_${context.prefix}_arg_${safeId(identifier.text)}_${++this.sequence}`;
        this.variableEffect("set_temp_variable", name, argument, call, context);
        argument = {
          _krg: "variable",
          name,
          scope: context.scope,
          mutable: false,
          temporary: true,
        } as Variable;
      }
      const symbol = this.symbol(identifier);
      if (symbol) env.set(symbol, argument);
    };
    for (let index = 0; index < callable.node.parameters.length; index++) {
      const parameter = callable.node.parameters[index];
      const argument =
        args[index] === undefined && parameter.initializer
          ? this.evaluate(parameter.initializer, { ...context, env })
          : args[index];
      if (ts.isIdentifier(parameter.name)) {
        bind(parameter.name, argument);
      } else if (ts.isObjectBindingPattern(parameter.name)) {
        if (!record(argument) || tagged(argument, "scope"))
          this.fail(
            parameter,
            "KRG2746",
            "Object parameters require a record. Bind game scopes by name.",
          );
        const bindingIssue = parameterBindingIssue(parameter);
        if (bindingIssue)
          this.fail(parameter, "KRG2746", `Krieg does not support ${bindingIssue}.`);
        for (const element of parameter.name.elements) {
          if (
            !ts.isIdentifier(element.name) ||
            (element.propertyName && ts.isComputedPropertyName(element.propertyName))
          )
            this.fail(element, "KRG2746", "Use shallow named or renamed parameter fields.");
          const key = element.propertyName?.text ?? element.name.text;
          const value =
            tagged(argument, "bound-variable-state") ||
            (tagged(argument, "variable-state") && argument.scope === "global")
              ? this.stateProperty(
                  argument as VariableState | BoundVariableState,
                  key,
                  element,
                  context,
                )
              : argument[key];
          bind(element.name, value);
        }
      } else {
        this.fail(parameter, "KRG2746", "Use identifiers or shallow named object parameters.");
      }
    }
    // A return exits this helper, not the runtime branch that called it.
    // Branches opened inside the helper still mark their own dynamic context.
    const inner = { ...context, env, dynamicBranch: false };
    const traceHelper =
      this.options.traceSources &&
      ts.isCallExpression(call) &&
      ts.isFunctionDeclaration(callable.node);
    if (traceHelper) this.origins.helpers.push(call);
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
      if (traceHelper) this.origins.helpers.pop();
    }
  }
  private stateProperty(
    state: VariableState | BoundVariableState,
    name: string,
    node: ts.Node,
    context: Context,
  ): Variable {
    if (!Object.hasOwn(state.names, name))
      this.fail(node, "KRG2745", `Variable state has no property '${name}'.`);
    if (!context.scope || context.mode === "top")
      this.fail(node, "KRG2745", "Read variable state inside a game callback.");
    return {
      _krg: "variable",
      name: state.scope === "global" ? `global.${state.names[name]}` : state.names[name],
      scope: state.scope === "global" ? context.scope : state.scope,
      mutable: true,
      property: true,
    } as Variable;
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
    if (name === "variableState") {
      if (context.mode !== "top")
        this.fail(node, "KRG2745", "Declare variable state at module scope.");
      const scope = this.string(args[0], node);
      if (
        !this.schema.scopes.some(
          (value) => value.toLowerCase().replace("unitleader", "unit_leader") === scope,
        ) &&
        !["global", "country", "state", "character", "unit_leader", "any"].includes(scope)
      )
        this.fail(node, "KRG2745", `Unknown variable state scope '${scope}'.`);
      const names = this.object(args[1], node);
      const nativeNames = new Set<string>();
      for (const [key, value] of Object.entries(names)) {
        if (
          ["_krg", "__proto__", "prototype", "constructor"].includes(key) ||
          typeof value !== "string" ||
          !/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)
        )
          this.fail(
            node,
            "KRG2745",
            "Variable state requires property names mapped to simple native identifiers.",
          );
        if (nativeNames.has(value))
          this.fail(node, "KRG2745", `Duplicate native variable '${value}' in variable state.`);
        nativeNames.add(value);
      }
      return { _krg: "variable-state", scope, names } as VariableState;
    }
    if (name === "CountryHeatmap") {
      if (context.mode !== "top")
        this.fail(node, "KRG2028", "Country heatmaps belong at module scope.");
      try {
        const map = countryHeatmap(args[0]);
        return {
          _krg: "definition",
          id: map.id,
          outputs: [this.output(map.path, map.document, node)],
        };
      } catch (error) {
        this.fail(
          node,
          "KRG2707",
          error instanceof Error ? error.message : "Invalid CountryHeatmap.",
        );
      }
    }
    if (name === "gameScripts") {
      const scope = this.string(args[0], node);
      if (
        !this.schema.scopes.some((s) => s.toLowerCase() === scope.toLowerCase()) &&
        !["country", "state", "character", "unit_leader", "any"].includes(scope)
      )
        this.fail(node, "KRG2735", "Unsupported scope in external script contract: " + scope);
      const spec = this.object(args[1], node);
      this.checkKeys(spec, ["triggers", "effects"], node, "External scripts");
      const handles = (items: Value, kind: "effect" | "trigger") => {
        const out: Record<string, Definition> = Object.create(null);
        for (const n of this.array(items ?? [], node)) {
          if (
            typeof n !== "string" ||
            !/^[A-Za-z_][A-Za-z0-9_]*$/.test(n) ||
            ["_krg", "constructor", "prototype", "__proto__"].includes(n) ||
            Object.hasOwn(out, n)
          )
            this.fail(node, "KRG2735", "A script contract requires distinct native identifiers.");
          out[n] = { _krg: "definition", scope, definitionKind: kind, name: n, outputs: [] };
        }
        return out;
      };
      return {
        triggers: handles(spec.triggers, "trigger"),
        effects: handles(spec.effects, "effect"),
      };
    }
    if (name === "indexBy") {
      const [rows, select, project] = args;
      if (
        !Array.isArray(rows) ||
        rows.length > 16384 ||
        !tagged(select, "function") ||
        (project !== undefined && !tagged(project, "function"))
      )
        this.fail(
          node,
          "KRG2734",
          "indexBy requires a finite table and static key/value functions (at most 16384 rows).",
        );
      const result: Record<string, Value> = Object.create(null);
      for (let i = 0; i < rows.length; i++) {
        this.tick(node);
        const parameters = [rows[i], i],
          pure: Context = { ...context, mode: "top", sink: [] };
        const key = this.invoke(select as Callable, parameters, node, pure);
        if (
          typeof key !== "string" ||
          !key ||
          ["__proto__", "prototype", "constructor", "_krg"].includes(key)
        )
          this.fail(node, "KRG2734", "indexBy keys must be nonempty, non-reserved static strings.");
        if (Object.hasOwn(result, key))
          this.fail(node, "KRG2734", "Duplicate catalogue key '" + key + "' at row " + i + ".");
        result[key] =
          project === undefined
            ? rows[i]
            : this.invoke(project as Callable, parameters, node, pure);
      }
      return result;
    }
    if (name === "DefinitionSeries") {
      if (context.mode !== "top")
        this.fail(node, "KRG2732", "DefinitionSeries belongs at module scope.");
      const [first, count, make] = args;
      if (
        typeof first !== "number" ||
        typeof count !== "number" ||
        !Number.isSafeInteger(first) ||
        !Number.isSafeInteger(count) ||
        count < 1 ||
        count > 16384 ||
        !Number.isSafeInteger(first + count) ||
        !tagged(make, "function")
      )
        this.fail(
          node,
          "KRG2732",
          "A series requires a safe first index, 1–16384 entries, and a static declaration factory.",
        );
      const members: Definition[] = [];
      for (let i = 0; i < count; i++) {
        this.tick(node);
        const batch = this.invoke(make as Callable, [first + i], node, context);
        for (const child of Array.isArray(batch) ? batch : [batch]) {
          if (!tagged(child, "definition"))
            this.fail(
              node,
              "KRG2732",
              "Series callbacks must return compiler-created declarations.",
            );
          members.push(child as Definition);
        }
      }
      const handle = Object.create(null) as Record<string, Value>;
      this.scriptedFamilies.set(handle, members);
      return handle;
    }
    if (name === "FlagAchievements") {
      if (context.mode !== "top")
        this.fail(node, "KRG2732", "FlagAchievements belongs at module scope.");
      const id = this.string(args[0], node),
        opts = this.object(args[1], node);
      this.checkKeys(
        opts,
        ["prefix", "count", "first", "scope", "outputPath", "storage"],
        node,
        "FlagAchievements",
      );
      const { prefix, count } = opts,
        first = opts.first ?? 0,
        variant = opts.scope ?? "global";
      if (
        !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(id) ||
        typeof prefix !== "string" ||
        !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(prefix) ||
        typeof count !== "number" ||
        typeof first !== "number" ||
        !Number.isSafeInteger(count) ||
        !Number.isSafeInteger(first) ||
        first < 0 ||
        !Number.isSafeInteger(first + count) ||
        count < 1 ||
        count > 16384 ||
        !["country", "global"].includes(String(variant))
      )
        this.fail(
          node,
          "KRG2732",
          "Expected valid identifiers, a numbered flag range of 1–16384, and a country or global scope.",
        );
      const path =
        opts.outputPath === undefined
          ? `common/achievements/krieg_${id}.txt`
          : this.string(opts.outputPath, node);
      if (!/^common\/achievements\/[a-zA-Z0-9_.-]+\.txt$/.test(path))
        this.fail(
          node,
          "KRG2732",
          "Achievement groups must be written to common/achievements/*.txt.",
        );
      const items: pdx.PdxItem[] = [pdx.property("unique_id", pdx.atom(id))];
      for (let i = 0; i < count; i++) {
        this.tick(node);
        const flag = prefix + (first + i);
        items.push(
          pdx.property(
            flag,
            pdx.block([
              pdx.property("possible", pdx.block([pdx.property("always", pdx.atom("yes"))])),
              pdx.property(
                "happened",
                pdx.block([
                  pdx.property(
                    variant === "global" ? "has_global_flag" : "has_country_flag",
                    pdx.atom(flag),
                  ),
                ]),
              ),
            ]),
          ),
        );
      }
      const outputs = [this.output(path, pdx.document(items), node)];
      if (opts.storage !== undefined) {
        const storage = this.object(opts.storage, node);
        this.checkKeys(storage, ["array", "index", "load", "mark"], node, "Flag storage");
        const { array, index, load, mark } = storage;
        if (
          first !== 0 ||
          typeof array !== "string" ||
          typeof index !== "string" ||
          typeof load !== "string" ||
          typeof mark !== "string" ||
          ![array, index, load, mark].every((n) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(n)) ||
          array === index ||
          load === mark
        )
          this.fail(
            node,
            "KRG2732",
            "Storage requires distinct load/mark script names and array/index names, with zero-based achievement flags.",
          );
        const routines = flagStorage(
          id,
          prefix,
          count,
          variant as "global" | "country",
          array,
          index,
        );
        const handle = (name: string, body: pdx.PdxItem[]) => {
          this.claimScriptedName("effect", name, node);
          outputs.push(
            this.output(
              "common/scripted_effects/krieg_" + name + ".txt",
              pdx.document([pdx.property(name, pdx.block(body))]),
              node,
            ),
          );
          return {
            _krg: "definition",
            scope: "country",
            definitionKind: "effect",
            name,
            outputs: [],
          } as Definition;
        };
        return {
          _krg: "definition",
          load: handle(load, routines.load),
          mark: handle(mark, routines.mark),
          outputs,
        } as Definition;
      }
      return { _krg: "definition", outputs } as Definition;
    }
    if (name === "AudioBank") {
      if (context.mode !== "top") this.fail(node, "KRG2028", "Audio banks belong at module scope.");
      try {
        const bank = audioBank(args[0], args[1]);
        return {
          _krg: "definition",
          sounds: bank.sounds,
          outputs: [this.output(bank.path, bank.document, node)],
        };
      } catch (error) {
        this.fail(node, "KRG2705", error instanceof Error ? error.message : "Invalid AudioBank.");
      }
    }
    if (name === "countryTarget" || name === "stateTarget" || name === "mioTarget") {
      const target = this.string(args[0], node);
      if (
        !/^(?:(?:ROOT|THIS|PREV|FROM)(?:\.(?:ROOT|THIS|PREV|FROM))*|(?:var|event_target):[A-Za-z_][A-Za-z0-9_.]*(?:\^[A-Za-z0-9_]+)?)$/.test(
          target,
        )
      )
        this.fail(node, "KRG2701", `Invalid engine scope target '${target}'.`);
      return name === "countryTarget"
        ? { kind: "country", tag: target }
        : {
            kind: name === "mioTarget" ? "military_industrial_organization" : "state",
            path: target,
          };
    }
    if (name === "MetaEffect") return this.metaEffect(args, node, context);
    if (name === "CountryAction") {
      if (context.mode !== "top")
        this.fail(node, "KRG2028", "Country actions belong at module scope.");
      const action = this.countryActions.declare(args[0], args[1], node, {
        claim: (mode, id) => this.claimScriptedName(mode, id, node),
        callback: (value, mode, prefix) =>
          this.callback(value, "country", mode, node, { ...context, prefix }),
        output: (file, document) => this.output(file, document, node),
      });
      this.pendingActions.set(action, {
        node,
        source: context.declarationFile ?? node.getSourceFile().fileName,
      });
      return action;
    }
    if (name === "ScriptedEffectFamily" || name === "ScriptedTriggerFamily")
      return this.scriptedFamily(name, args, node, context);
    if (name === "FocusGraph") {
      if (context.mode !== "top")
        this.fail(node, "KRG2028", "Focus graphs belong at module scope.");
      const graph = this.gameplay(node, () =>
        normalizeFocusGraph(args[0], (callback, selector) => {
          if (!tagged(callback, "function"))
            this.fail(
              node,
              "KRG2601",
              "Focus rules require a statically defined selector callback.",
            );
          return this.invoke(callback as Callable, [selector], node, context);
        }),
      );
      return {
        _krg: "definition",
        id: graph.spec.id,
        focuses: graph.focuses,
        outputs: [],
        pendingOutput: () => this.definition("FocusTree", [graph.spec], node, context),
      } as Definition;
    }
    if (name === "country") {
      const tag = this.string(args[0], node);
      const spelling = args[1] === undefined ? {} : this.object(args[1], node);
      this.checkKeys(spelling, ["spelling"], node, "Country tag spelling");
      if (spelling.spelling !== undefined && spelling.spelling !== "verbatim")
        this.fail(node, "KRG2026", "Unknown country tag spelling mode.");
      if (
        !(
          spelling.spelling === "verbatim" ? /^[A-Za-z][A-Za-z0-9]{2}$/ : /^[A-Z][A-Z0-9]{2}$/
        ).test(tag)
      )
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
    if (name === "Option" || name === "Focus" || name === "Decision" || name === "FocusNodes")
      return this.object(args[0], node);
    if (definitions.has(name)) {
      if (context.mode !== "top")
        this.fail(
          node,
          "KRG2028",
          "Game declarations belong at module scope; effect helpers may only produce effects.",
        );
      if (
        (name === "ScriptedEffect" || name === "StateScriptedEffect") &&
        (args.length === 4 || (args.length === 3 && typeof args[1] !== "string"))
      )
        return this.parameterizedEffect(name, args, node);
      // Publish event identity before lowering its callbacks. This allows declared
      // event chains (including a delayed self-loop) without recursive expansion.
      if (["CountryEvent", "StateEvent", "NewsEvent"].includes(name)) {
        const spec = this.object(args[0], node);
        const id = this.string(spec.id, node);
        this.gameplay(node, () => validateEventIdentifier(id));
        return {
          _krg: "definition",
          outputs: [],
          id,
          eventScope: name === "StateEvent" ? "state" : "country",
          pendingOutput: () => this.definition(name, args, node, context),
        } as Definition;
      }
      const result: Definition = {
        _krg: "definition",
        outputs: this.definition(name, args, node, context),
      };
      if (record(args[0]) && typeof args[0].id === "string") result.id = args[0].id;
      if (name.includes("ScriptedEffect") || name.includes("ScriptedTrigger")) {
        result.name = this.string(args[0], node);
        result.scope =
          args.length === 3
            ? this.string(args[1], node)
            : name.startsWith("State")
              ? "state"
              : "country";
        result.definitionKind = name.endsWith("Trigger") ? "trigger" : "effect";
      }
      if (name === "ScriptedLocalisation") {
        result.name = this.string(args[0], node);
        result.scope = this.string(this.object(args[1], node).scope, node);
      }
      return result;
    }
    this.fail(node, "KRG2029", `SDK declaration '${name}' has no static lowering.`);
  }

  private claimScriptedName(kind: "effect" | "trigger", name: string, node: ts.Node): void {
    const key = `${kind}:${name}`;
    if (this.scriptedNames.has(key))
      this.fail(node, "KRG2611", `Duplicate scripted ${kind} name '${name}'.`);
    this.scriptedNames.add(key);
  }

  private parameterizedEffect(name: string, args: Value[], node: ts.Node): Definition {
    const explicitScope = args.length === 4;
    const parameters = this.object(args[explicitScope ? 2 : 1], node);
    for (const [key, type] of Object.entries(parameters)) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) || !["number", "number[]"].includes(String(type)))
        this.fail(
          node,
          "KRG2612",
          "Scripted effect parameters require identifier keys and 'number' or 'number[]' types.",
        );
    }
    const callback = args[explicitScope ? 3 : 2];
    if (!tagged(callback, "function"))
      this.fail(node, "KRG2030", "Expected a typed game scope callback.");
    const id = this.string(args[0], node);
    this.claimScriptedName("effect", id, node);
    const definition: Definition = {
      _krg: "definition",
      name: id,
      scope: explicitScope
        ? this.string(args[1], node)
        : name.startsWith("State")
          ? "state"
          : "country",
      definitionKind: "effect",
      outputs: [],
    };
    this.parameterizedEffects.set(definition, {
      parameters: parameters as ParameterizedEffect["parameters"],
      callback: callback as Callable,
    });
    return definition;
  }

  private runParameterizedEffect(
    definition: Definition,
    effect: ParameterizedEffect,
    args: Value[],
    scope: Scope,
    node: ts.Node,
    context: Context,
  ): void {
    if (context.mode !== "effect")
      this.fail(node, "KRG2037", "Effects cannot execute in triggers or module initializers.");
    if (args.length !== 2 || !record(args[1]) || "_krg" in args[1] || Array.isArray(args[1]))
      this.fail(node, "KRG2613", "A parameterized effect call requires its parameter record.");
    const inputs = args[1] as Record<string, Value>;
    const keys = Object.keys(effect.parameters);
    const missing = keys.filter((key) => !Object.hasOwn(inputs, key));
    const extra = Object.keys(inputs).filter((key) => !Object.hasOwn(effect.parameters, key));
    if (missing.length || extra.length)
      this.fail(
        node,
        "KRG2613",
        `Invalid scripted effect arguments.${missing.length ? ` Missing: ${missing.join(", ")}.` : ""}${extra.length ? ` Unknown: ${extra.join(", ")}.` : ""}`,
      );
    const name = `krg_${context.prefix}_call_${safeId(definition.name!)}_${++this.sequence}`;
    const bindings: Record<string, Variable | RuntimeArray> = Object.create(null);
    const setup: pdx.PdxItem[] = [];
    const caller = { ...context, sink: setup };
    for (const key of keys) {
      const input = inputs[key];
      if (effect.parameters[key] === "number[]") {
        if (!tagged(input, "array"))
          this.fail(
            node,
            "KRG2613",
            `Parameter '${key}' requires a mutable runtime numeric array.`,
          );
        const array = input as RuntimeArray;
        if (!array.temporary && array.scope.id !== scope.id)
          this.fail(
            node,
            "KRG2613",
            `Persistent array parameter '${key}' must belong to the effect's target scope.`,
          );
        bindings[key] = array;
      } else {
        if (!(
          typeof input === "number" ||
          tagged(input, "variable") ||
          tagged(input, "arithmetic")
        ))
          this.fail(
            node,
            "KRG2613",
            `Parameter '${key}' requires a number or runtime numeric value.`,
          );
        const parameterName = `${name}_param_${key}`;
        this.variableEffect("set_temp_variable", parameterName, input, node, caller);
        bindings[key] = {
          _krg: "variable",
          name: parameterName,
          scope,
          mutable: false,
          temporary: true,
        };
      }
    }
    this.claimScriptedName("effect", name, node);
    const body = this.callback(
      effect.callback,
      scope.name,
      "effect",
      node,
      { ...context, prefix: name },
      undefined,
      [],
      (target) => [
        Object.fromEntries(
          Object.entries(bindings).map(([key, value]) => [key, { ...value, scope: target }]),
        ),
      ],
    );
    this.outputs.push({
      ...this.output(
        `common/scripted_effects/krieg_${name}.txt`,
        pdx.document([pdx.property(name, pdx.block(body))]),
        node,
      ),
      sourceFile: context.declarationFile ?? node.getSourceFile().fileName,
    });
    context.sink.push(
      ...setup,
      ...this.inScope([pdx.property(name, pdx.atom("yes"))], scope, context, node),
    );
  }

  private scriptedFamily(name: string, args: Value[], node: ts.Node, context: Context): Value {
    if (context.mode !== "top")
      this.fail(node, "KRG2028", "Scripted families belong at module scope.");
    const explicitScope = args.length === 4;
    const scope = explicitScope ? this.string(args[1], node) : "country";
    const mode = name === "ScriptedTriggerFamily" ? "trigger" : "effect";
    const callback = args[explicitScope ? 3 : 2];
    let variants;
    try {
      variants = normalizeScriptedFamily(args[0], args[explicitScope ? 2 : 1]);
    } catch (error) {
      if (error instanceof ScriptedFamilyError) this.fail(node, "KRG2610", error.message);
      throw error;
    }
    const handles: Record<string, Definition> = Object.create(null);
    for (const variant of variants) {
      this.claimScriptedName(mode, variant.name, node);
      const items = this.callback(
        callback,
        scope,
        mode,
        node,
        { ...context, prefix: variant.name },
        undefined,
        [variant.parameters],
      );
      handles[variant.key] = {
        _krg: "definition",
        name: variant.name,
        scope,
        definitionKind: mode,
        outputs: [
          this.output(
            `common/scripted_${mode}s/krieg_${variant.name}.txt`,
            pdx.document([pdx.property(variant.name, pdx.block(items))]),
            node,
          ),
        ],
      };
    }
    this.scriptedFamilies.set(handles, Object.values(handles));
    return handles;
  }

  private gameplay<T>(node: ts.Node, action: () => T): T {
    try {
      return action();
    } catch (error) {
      if (error instanceof GameplayError) this.fail(node, error.code, error.message);
      throw error;
    }
  }

  private claimGameplayId(kind: "event" | "focus", id: string, node: ts.Node): void {
    const key = `${kind}:${id}`;
    if (this.gameplayIds.has(key))
      this.fail(node, "KRG2607", `Duplicate ${kind} ID '${id}' in semantic declarations.`);
    this.gameplayIds.add(key);
  }

  private jsx(
    node: ts.JsxElement | ts.JsxSelfClosingElement | ts.JsxFragment,
    context: Context,
  ): Value {
    if (context.mode !== "top")
      this.fail(node, "KRG2080", "GUI elements belong in static interface declarations.");
    const children: Value[] = [];
    const childNodes = ts.isJsxSelfClosingElement(node) ? [] : node.children;
    for (const child of childNodes) {
      if (ts.isJsxText(child)) {
        if (child.text.trim())
          this.fail(
            child,
            "KRG2081",
            "Use a Text component with a localisation key; literal JSX text is not a game UI element.",
          );
      } else if (ts.isJsxExpression(child)) {
        if (child.dotDotDotToken)
          this.fail(
            child,
            "KRG2082",
            "JSX spread children are not supported; pass a static array expression.",
          );
        if (child.expression) children.push(this.evaluate(child.expression, context));
      } else children.push(this.jsx(child, context));
    }
    if (ts.isJsxFragment(node)) return { _krg: "gui-fragment", children };
    const opening = ts.isJsxElement(node) ? node.openingElement : node;
    const props: Record<string, Value> = Object.create(null);
    for (const attribute of opening.attributes.properties) {
      if (ts.isJsxSpreadAttribute(attribute)) {
        Object.assign(props, this.object(this.evaluate(attribute.expression, context), attribute));
        continue;
      }
      if (ts.isJsxNamespacedName(attribute.name))
        this.fail(
          attribute,
          "KRG2083",
          "XML namespaced attributes are not part of HOI4 GUI syntax.",
        );
      const name = attribute.name.text;
      if (Object.hasOwn(props, name))
        this.fail(attribute, "KRG2084", `Duplicate GUI property '${name}'.`);
      props[name] = !attribute.initializer
        ? true
        : ts.isStringLiteral(attribute.initializer)
          ? attribute.initializer.text
          : ts.isJsxExpression(attribute.initializer) && attribute.initializer.expression
            ? this.evaluate(attribute.initializer.expression, context)
            : this.fail(
                attribute,
                "KRG2085",
                "GUI attribute values must be static strings or expressions.",
              );
    }
    if (children.length) {
      if (Object.hasOwn(props, "children"))
        this.fail(node, "KRG2084", "Use either a children attribute or nested elements.");
      props.children = children;
    }
    const tag = opening.tagName;
    if (ts.isIdentifier(tag) && /^[a-z]/.test(tag.text)) {
      const native = DOMAIN_SCHEMA.gui[tag.text]?.name;
      if (!native) this.fail(tag, "KRG2086", `Unknown native GUI element '${tag.text}'.`);
      return this.uiCall(native, [props], node, context);
    }
    if (ts.isJsxNamespacedName(tag)) this.fail(tag, "KRG2083", "XML namespaces are not supported.");
    return this.call(this.evaluate(tag, context), [props], node, context);
  }
  private guiChildren(value: Value, node: ts.Node): pdx.PdxProperty[] {
    return guiElements(value, node, (origin, code, message) =>
      this.fail(origin, code, message),
    ).map((element) => {
      if (this.options.traceSources)
        this.origins.mark([element.property], element.source ?? node, "expression");
      return element.property;
    });
  }
  private uiCall(
    name: string,
    args: Value[],
    node: ts.Node,
    context: Context,
    guiOwner?: number,
  ): Value {
    if (context.mode !== "top")
      this.fail(node, "KRG2080", "GUI declarations belong at module scope.");
    if (guiOwner !== undefined) {
      const props = this.object(args[0], node);
      const element = this.uiCall(
        name,
        [
          Object.fromEntries(
            Object.entries(props).filter(([key]) => !GUI_BINDING_KEYS.includes(key)),
          ),
        ],
        node,
        context,
      ) as GuiElementValue;
      return {
        ...element,
        binding: {
          owner: guiOwner,
          props: Object.fromEntries(
            Object.entries(props).filter(([key]) => GUI_BINDING_KEYS.includes(key)),
          ),
        },
      } satisfies GuiElementValue;
    }
    if (name === "GuiVariable") {
      const variable = this.string(args[0], node);
      if (!/^[A-Za-z_][A-Za-z0-9_.:]*(?:\^(?:[A-Za-z_][A-Za-z0-9_.:]*|\d+))?$/.test(variable))
        this.fail(node, "KRG2136", "GuiVariable requires a non-empty native variable name.");
      return { _krg: "gui-variable", name: variable };
    }
    if (name === "For") {
      const props = this.object(args[0], node);
      this.checkKeys(props, ["each", "children"], node, "For");
      const children =
        Array.isArray(props.children) && props.children.length === 1
          ? props.children[0]
          : props.children;
      if (!tagged(children, "function"))
        this.fail(node, "KRG2137", "For requires one static child-rendering callback.");
      return {
        _krg: "gui-fragment",
        children: this.array(props.each, node).map((item, index) => {
          this.tick(node);
          return this.invoke(children as Callable, [item, index], node, context);
        }),
      };
    }
    if (name === "Stack") {
      const props = this.object(args[0], node);
      this.checkKeys(props, ["direction", "gap", "position", "children"], node, "Stack");
      return {
        _krg: "gui-fragment",
        children: stackElements(
          props,
          node,
          (origin, code, message) => this.fail(origin, code, message),
          (position) => {
            if (this.options.traceSources) this.origins.mark([position], node, "expression");
          },
        ),
      };
    }
    if (name === "ScriptedWindow") {
      const spec = this.object(args[0], node);
      this.checkKeys(
        spec,
        [
          "name",
          "path",
          "context",
          "parentWindowToken",
          "parentWindowName",
          "parentScriptedGui",
          "dirty",
          "visible",
          "aiEnabled",
          "aiCheck",
          "aiCheckScope",
          "aiTestParent",
          "aiTestInterval",
          "aiTestVariance",
          "aiTestScopes",
          "aiMaxWeightTakenPerTest",
          "mapiconTargets",
        ],
        node,
        "ScriptedWindow",
      );
      if (!tagged(args[1], "function"))
        this.fail(node, "KRG2137", "ScriptedWindow requires a static layout callback.");
      const owner = ++this.guiSequence;
      const components = Object.fromEntries(
        SCRIPTED_WINDOW_COMPONENTS.map((component) => [
          component,
          { _krg: "builtin", name: component, module: "ui", guiOwner: owner } satisfies Builtin,
        ]),
      );
      const layout = this.invoke(args[1] as Callable, [components], node, context);
      const templates: GuiElementValue[] = [];
      const scripted = composeScriptedWindow(
        spec,
        layout,
        owner,
        node,
        (origin, code, message) => this.fail(origin, code, message),
        (props, origin) => this.countryActions.button(props, spec.context, origin),
        templates,
      );
      const gui = this.uiCall(
        "GuiFile",
        [spec.path, [layout, ...templates]],
        node,
        context,
      ) as Definition;
      return {
        _krg: "definition",
        outputs: [...gui.outputs, ...this.scriptedGui([scripted], node, context)],
      } as Definition;
    }
    if (name === "GuiFile" || name === "SpriteFile") {
      const file = this.string(args[0], node);
      const extension = name === "GuiFile" ? ".gui" : ".gfx";
      if (!file.startsWith("interface/") || !file.endsWith(extension))
        this.fail(node, "KRG2088", `${name} requires an interface/*${extension} game path.`);
      const elements = this.guiChildren(args[1], node);
      for (const element of elements) {
        if (
          (name === "SpriteFile") !==
          ["spriteType", "frameAnimatedSpriteType"].includes(element.key.text)
        )
          this.fail(
            node,
            "KRG2089",
            "Sprite elements belong in SpriteFile; interface elements belong in GuiFile.",
          );
      }
      return {
        _krg: "definition",
        outputs: [
          this.output(
            file,
            pdx.document([
              pdx.property(name === "GuiFile" ? "guiTypes" : "spriteTypes", pdx.block(elements)),
            ]),
            node,
          ),
        ],
      } as Definition;
    }
    const native = Object.entries(DOMAIN_SCHEMA.gui).find(([, value]) => value.name === name);
    if (native) {
      const spec = this.styledProps(this.object(args[0], node), native[0], node);
      const props = Object.fromEntries(Object.entries(spec).filter(([key]) => key !== "children"));
      const rule: NativeValue = { kind: "object", shape: native[1].shape };
      const error = this.nativeValueError(props, rule);
      if (error) this.fail(node, "KRG2119", `${name}: ${error}`);
      const block = this.nativeValue(props, rule, node, context) as pdx.PdxBlock;
      this.traceStyleFields(
        spec,
        block.items,
        Object.fromEntries(
          Object.entries(DOMAIN_SCHEMA.shapes[native[1].shape]).map(([key, field]) => [
            key,
            field.name,
          ]),
        ),
        node,
      );
      for (const field of block.items)
        if (
          field.kind === "property" &&
          ["name", "text", "buttonText", "font", "buttonFont", "spriteType"].includes(
            field.key.text,
          ) &&
          field.value.kind === "atom" &&
          !field.value.quoted
        )
          field.value = pdx.string(field.value.text);
      if (spec.children !== undefined) {
        if (!native[1].children)
          this.fail(node, "KRG2120", `${name} does not accept nested GUI controls.`);
        block.items.push(...this.guiChildren(spec.children, node));
      }
      return {
        _krg: "gui-element",
        property: pdx.property(native[0], block),
        children: spec.children,
        source: node,
      } satisfies GuiElementValue;
    }
    const base: Record<string, string> = {
      name: "name",
      position: "position",
      size: "size",
      orientation: "orientation",
      origo: "origo",
      scale: "scale",
      rotation: "rotation",
      hide: "hide",
      tooltip: "pdx_tooltip",
      tooltipDelayed: "pdx_tooltip_delayed",
    };
    const kinds: Record<string, { type: string; fields: Record<string, string> }> = {
      Container: {
        type: "containerWindowType",
        fields: {
          moveable: "moveable",
          clipping: "clipping",
          fullscreen: "fullscreen",
          verticalScrollbar: "verticalScrollbar",
          horizontalScrollbar: "horizontalScrollbar",
          autohideScrollbars: "autohide_scrollbars",
          clickToFront: "click_to_front",
          smoothScrolling: "smooth_scrolling",
          scrollWheelFactor: "scroll_wheel_factor",
          background: "background",
          showSound: "show_sound",
          fadeTime: "fade_time",
          fadeType: "fade_type",
          showPosition: "show_position",
          showAnimationType: "show_animation_type",
          hideAnimationType: "hide_animation_type",
          animationTime: "animation_time",
          margin: "margin",
        },
      },
      Icon: {
        type: "iconType",
        fields: {
          spriteType: "spriteType",
          frame: "frame",
          alwaysTransparent: "alwaystransparent",
          centerPosition: "centerposition",
          clickSound: "clicksound",
          shortcut: "shortcut",
        },
      },
      Button: {
        type: "buttonType",
        fields: {
          spriteType: "spriteType",
          text: "buttonText",
          font: "buttonFont",
          shortcut: "shortcut",
          frame: "frame",
          borderSize: "borderSize",
          format: "format",
          multiline: "multiline",
          noClickSound: "no_clicksound",
          clickSound: "clicksound",
          overSound: "oversound",
          webLink: "web_link",
        },
      },
      Text: {
        type: "instantTextBoxType",
        fields: {
          text: "text",
          font: "font",
          maxWidth: "maxWidth",
          maxHeight: "maxHeight",
          format: "format",
          verticalAlignment: "vertical_alignment",
          multiline: "multiline",
          fixedSize: "fixedsize",
          truncate: "truncate",
          alwaysTransparent: "alwaystransparent",
          borderSize: "borderSize",
        },
      },
      GridBox: {
        type: "gridBoxType",
        fields: {
          slotsize: "slotsize",
          maxSlotsHorizontal: "max_slots_horizontal",
          maxSlotsVertical: "max_slots_vertical",
          format: "format",
          addHorizontal: "add_horizontal",
          padding: "padding",
        },
      },
      ListBox: {
        type: "listBoxType",
        fields: {
          horizontal: "horizontal",
          spacing: "spacing",
          scrollbartype: "scrollbartype",
          borderSize: "borderSize",
          offset: "offset",
          alwaysTransparent: "alwaystransparent",
        },
      },
      Sprite: {
        type: "spriteType",
        fields: {
          name: "name",
          textureFile: "texturefile",
          noOfFrames: "noOfFrames",
          effectFile: "effectFile",
          transparenceCheck: "transparencecheck",
          loadType: "loadType",
          lazyLoad: "legacy_lazy_load",
        },
      },
      AnimatedSprite: {
        type: "frameAnimatedSpriteType",
        fields: {
          name: "name",
          textureFile: "texturefile",
          noOfFrames: "noOfFrames",
          effectFile: "effectFile",
          transparenceCheck: "transparencecheck",
          loadType: "loadType",
          lazyLoad: "legacy_lazy_load",
          animationRateFps: "animation_rate_fps",
          looping: "looping",
          playOnShow: "play_on_show",
          pauseOnLoop: "pause_on_loop",
          alwaysTransparent: "alwaystransparent",
        },
      },
    };
    const kind = kinds[name];
    if (!kind) this.fail(node, "KRG2090", `Unknown interface constructor '${name}'.`);
    const sprite = name === "Sprite" || name === "AnimatedSprite";
    const mapping = sprite ? kind.fields : { ...base, ...kind.fields };
    const spec = sprite
      ? this.object(args[0], node)
      : this.styledProps(this.object(args[0], node), kind.type, node, mapping);
    this.checkKeys(
      spec,
      [...Object.keys(mapping), ...(name === "Container" ? ["children"] : [])],
      node,
      name,
    );
    if (!this.string(spec.name, node))
      this.fail(node, "KRG2091", "GUI elements require non-empty names.");
    if (
      name === "AnimatedSprite" &&
      (typeof spec.noOfFrames !== "number" ||
        !Number.isInteger(spec.noOfFrames) ||
        spec.noOfFrames < 1 ||
        typeof spec.animationRateFps !== "number" ||
        !Number.isFinite(spec.animationRateFps) ||
        spec.animationRateFps <= 0 ||
        (spec.pauseOnLoop !== undefined &&
          (typeof spec.pauseOnLoop !== "number" ||
            !Number.isFinite(spec.pauseOnLoop) ||
            spec.pauseOnLoop < 0)))
    )
      this.fail(
        node,
        "KRG2143",
        "AnimatedSprite requires positive frames/FPS and a nonnegative loop pause.",
      );
    if (name === "Icon" && typeof spec.spriteType !== "string")
      this.fail(
        node,
        "KRG2213",
        "Icon requires spriteType, either explicitly or in its style classes.",
      );
    const rawStrings = new Set([
      "orientation",
      "origo",
      "format",
      "verticalAlignment",
      "maxWidth",
      "maxHeight",
      "fadeType",
      "showSound",
      "clickSound",
      "overSound",
    ]);
    const items = Object.entries(mapping)
      .filter(([key]) => spec[key] !== undefined)
      .map(([key, target]) => {
        const value = spec[key];
        if (key === "background") {
          const background = this.object(value, node);
          this.checkKeys(background, ["name", "spriteType"], node, "Container.background");
          return pdx.property(
            target,
            pdx.block([
              pdx.property("name", pdx.string(this.string(background.name, node))),
              pdx.property(
                "quadTextureSprite",
                pdx.string(this.string(background.spriteType, node)),
              ),
            ]),
          );
        }
        if (["position", "offset", "size", "slotsize", "borderSize"].includes(key)) {
          const coordinates = this.object(value, node);
          this.checkKeys(
            coordinates,
            ["position", "offset", "borderSize"].includes(key) ? ["x", "y"] : ["width", "height"],
            node,
            `${name}.${key}`,
          );
          if (key === "size" && name === "Button")
            return pdx.property(
              target,
              this.toPdx({ x: coordinates.width, y: coordinates.height }, node, context),
            );
        }
        return pdx.property(
          target,
          typeof value === "string" && !rawStrings.has(key)
            ? pdx.string(value)
            : this.toPdx(value, node, context),
        );
      });
    this.traceStyleFields(spec, items, mapping, node);
    if (spec.children !== undefined) items.push(...this.guiChildren(spec.children, node));
    return {
      _krg: "gui-element",
      property: pdx.property(kind.type, pdx.block(items)),
      children: spec.children,
      source: node,
    } satisfies GuiElementValue;
  }
  /** Resolve opaque style values before ordinary native validation and serialization. */
  private styledProps(
    input: Record<string, Value>,
    nativeType: string,
    node: ts.Node,
    mapping?: Record<string, string>,
  ): Record<string, Value> {
    if (input.className === undefined) return input;
    const selected = Array.isArray(input.className) ? input.className : [input.className];
    const fields = DOMAIN_SCHEMA.shapes[DOMAIN_SCHEMA.gui[nativeType].shape];
    const result: Record<string, Value> = {};
    const origins = new Map<string, StyleDeclaration>();
    for (const candidate of selected) {
      if (!tagged(candidate, "gui-style"))
        this.fail(
          node,
          "KRG2210",
          "className requires imported .krg.css classes or an ordered array of those classes.",
        );
      for (const declaration of (candidate as unknown as StyleClassValue).declarations) {
        const nativeName = mapping
          ? mapping[declaration.property]
          : declaration.property === "font" && ["buttonType", "guiButtonType"].includes(nativeType)
            ? "buttonFont"
            : (STYLE_NATIVE_NAMES[declaration.property] ?? declaration.property);
        const entry = nativeName
          ? Object.entries(fields).find(([, field]) => field.name === nativeName)
          : undefined;
        const report = (message: string): never => {
          const location = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());
          this.diagnostics.push({
            code: "KRG2211",
            severity: "error",
            file: declaration.file,
            line: declaration.line,
            column: declaration.column,
            message: `${message} Applied to ${nativeType} at ${node.getSourceFile().fileName}:${location.line + 1}:${location.character + 1}.`,
          });
          throw new CompileFailure(message);
        };
        if (!entry)
          return report(
            `Style property '${declaration.property}' is not supported by this control.`,
          );
        let value = declaration.value;
        let error = this.nativeValueError(value, entry[1].value);
        if (declaration.property === "size" && error) {
          const size = value as { width: unknown; height: unknown };
          const coordinates = { x: size.width, y: size.height };
          if (!this.nativeValueError(coordinates, entry[1].value)) {
            value = coordinates;
            error = undefined;
          }
        }
        if (error) report(`Invalid style '${declaration.property}': ${error}`);
        const key = mapping ? declaration.property : entry[0];
        result[key] = mapping ? declaration.value : value;
        origins.set(key, declaration);
      }
    }
    for (const [key, value] of Object.entries(input))
      if (key !== "className") {
        result[key] = value;
        origins.delete(key);
      }
    this.styleOrigins.set(result, origins);
    return result;
  }
  private traceStyleFields(
    spec: object,
    items: pdx.PdxItem[],
    mapping: Record<string, string>,
    node: ts.Node,
  ): void {
    if (!this.options.traceSources) return;
    for (const [key, origin] of this.styleOrigins.get(spec) ?? []) {
      const field = items.find(
        (item) => item.kind === "property" && item.key.text === mapping[key],
      );
      if (field)
        this.origins.markStyle(
          field,
          { source: origin.file, line: origin.line, column: origin.column },
          node,
        );
    }
  }
  private metaEffect(args: Value[], node: ts.Node, context: Context): Value {
    if (context.mode !== "effect" || !tagged(args[0], "scope"))
      this.fail(node, "KRG2092", "MetaEffect requires an active game effect scope.");
    const scope = args[0] as Scope;
    const spec = this.object(args[1], node);
    this.checkKeys(spec, ["text", "parameters", "debug"], node, "MetaEffect");
    const source = this.string(spec.text, node);
    const parsed = parsePdx(source, { retainSource: false });
    if (
      !parsed.document.items.length ||
      parsed.diagnostics.some((diagnostic) => diagnostic.severity === "error") ||
      parsed.document.items.some((item) => item.kind !== "property")
    )
      this.fail(
        node,
        "KRG2093",
        "MetaEffect text must be a well-formed native effect block body without outer braces.",
      );
    const parameters = this.object(spec.parameters, node);
    const names = [...new Set([...source.matchAll(/\[([^\[\]]+)\]/g)].map((match) => match[1]))];
    for (const name of names) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name) || name === "text" || name === "debug")
        this.fail(
          node,
          "KRG2094",
          `Invalid meta parameter '[${name}]'; put dynamic localisation in its parameter value.`,
        );
      if (!Object.hasOwn(parameters, name))
        this.fail(node, "KRG2095", `MetaEffect is missing parameter '${name}'.`);
    }
    this.checkKeys(parameters, names, node, "MetaEffect parameters");
    const body: pdx.PdxItem[] = [pdx.property("text", pdx.block(parsed.document.items))];
    const commandContext = { ...context, scope, sink: [] };
    for (const [name, value] of Object.entries(parameters)) {
      const token = this.toPdx(value, node, commandContext);
      if (token.kind !== "atom")
        this.fail(node, "KRG2096", "MetaEffect parameters must be scalar substitutions.");
      body.push(pdx.property(name, typeof value === "string" ? pdx.string(value) : token));
    }
    if (spec.debug !== undefined)
      body.push(pdx.property("debug", this.toPdx(spec.debug, node, commandContext)));
    context.sink.push(
      ...this.inScope(
        [...commandContext.sink, pdx.property("meta_effect", pdx.block(body))],
        scope,
        context,
        node,
      ),
    );
    return undefined;
  }

  private callback(
    value: Value,
    scopeName: string,
    mode: "effect" | "trigger",
    node: ts.Node,
    outer: Context,
    parent?: Scope,
    parameters: Value[] = [],
    bindParameters?: (scope: Scope) => Value[],
  ): pdx.PdxItem[] {
    const actionCallback = this.countryActions.callback(value, scopeName, mode, node);
    if (actionCallback) return actionCallback;
    if (!tagged(value, "function"))
      this.fail(node, "KRG2030", "Expected a typed game scope callback.");
    const scope: Scope = {
      _krg: "scope",
      name: scopeName,
      id: ++this.sequence,
      ...(parent ? { parent } : {}),
    };
    const sink: pdx.PdxItem[] = [];
    const context: Context = {
      env: new Map(),
      mode,
      sink,
      scope,
      prefix: outer.prefix,
      declarationFile: outer.declarationFile ?? node.getSourceFile().fileName,
    };
    const result = this.invoke(
      value as Callable,
      [scope, ...(bindParameters?.(scope) ?? parameters)],
      node,
      context,
    );
    if (mode === "trigger") return this.flattenLogical(this.trigger(result, node, context));
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
  private arrayVariable(array: RuntimeArray, index: string, mutable: boolean): Variable {
    return {
      _krg: "variable",
      name: `${array.name}^${index}`,
      scope: array.scope,
      mutable,
      temporary: array.temporary,
      property: true,
      ...(index === "num" ? { lengthOf: array } : {}),
    };
  }
  private arrayIndex(index: Value, node: ts.Node, context: Context): string {
    if (typeof index !== "number" && !tagged(index, "variable") && !tagged(index, "arithmetic"))
      this.fail(node, "KRG2708", "Array indices must be numeric.");
    if (typeof index === "number" && (!Number.isSafeInteger(index) || index < 0))
      this.fail(node, "KRG2708", "Literal array indices must be non-negative integers.");
    const encoded = this.toPdx(index, node, context);
    if (encoded.kind !== "atom") this.fail(node, "KRG2708", "Invalid array index.");
    return encoded.text;
  }
  private arrayArgument(value: Value, node: ts.Node, context: Context): Value {
    if (typeof value === "number") return value;
    if (!tagged(value, "variable") && !tagged(value, "arithmetic"))
      this.fail(node, "KRG2751", "Runtime arrays contain numeric values.");
    return this.snapshotNumber(value, node, context);
  }
  private runtimeArrayCall(
    array: RuntimeArray,
    method: string,
    args: Value[],
    node: ts.Node,
    context: Context,
  ): Value {
    const local = array.temporary ? context : { ...context, scope: array.scope, sink: [] };
    const numeric = (value: Value): pdx.PdxValue => {
      if (typeof value !== "number" && !tagged(value, "variable") && !tagged(value, "arithmetic"))
        this.fail(node, "KRG2751", "Runtime arrays contain numeric values.");
      return this.toPdx(value, node, local);
    };
    if (method === "includes") {
      if (args.length !== 1)
        this.fail(node, "KRG2750", "Runtime includes requires one numeric value.");
      return {
        _krg: "trigger",
        items: this.inScope(
          [
            pdx.property(
              "is_in_array",
              pdx.block([
                pdx.property("array", pdx.atom(array.name)),
                pdx.property("value", numeric(args[0])),
              ]),
            ),
          ],
          array.temporary ? context.scope! : array.scope,
          context,
          node,
        ),
      } as Trigger;
    }
    if (context.mode !== "effect" || !context.scope)
      this.fail(node, "KRG2037", "Array mutations require an effect callback.");
    const add = array.temporary ? "add_to_temp_array" : "add_to_array";
    if (method === "push") {
      const values = args.map((value) => this.arrayArgument(value, node, context));
      for (const value of values)
        local.sink.push(
          pdx.property(
            add,
            pdx.block([
              pdx.property("array", pdx.atom(array.name)),
              pdx.property("value", numeric(value)),
            ]),
          ),
        );
    } else {
      if (!ts.isExpressionStatement(node.parent))
        this.fail(
          node,
          "KRG2750",
          "splice must be a standalone statement; its removed values are not available.",
        );
      const count = args[1];
      if (args.length < 2 || typeof count !== "number" || !Number.isSafeInteger(count) || count < 0)
        this.fail(
          node,
          "KRG2750",
          "splice requires a non-negative index and a constant non-negative delete count.",
        );
      const index = this.arrayIndex(this.arrayArgument(args[0], node, context), node, context);
      const values = args.slice(2).map((value) => this.arrayArgument(value, node, context));
      for (let offset = 0; offset < count; offset++) {
        this.tick(node);
        local.sink.push(
          pdx.property(
            array.temporary ? "remove_from_temp_array" : "remove_from_array",
            pdx.block([
              pdx.property("array", pdx.atom(array.name)),
              pdx.property("index", pdx.atom(index)),
            ]),
          ),
        );
      }
      for (const value of values.reverse())
        local.sink.push(
          pdx.property(
            add,
            pdx.block([
              pdx.property("array", pdx.atom(array.name)),
              pdx.property("index", pdx.atom(index)),
              pdx.property("value", numeric(value)),
            ]),
          ),
        );
    }
    if (!array.temporary)
      context.sink.push(...this.inScope(local.sink, array.scope, context, node));
    if (method !== "push" || !ts.isCallExpression(node) || ts.isExpressionStatement(node.parent))
      return undefined;
    const name = `krg_${context.prefix}_length_${++this.sequence}`;
    this.variableEffect(
      "set_temp_variable",
      name,
      this.arrayVariable(array, "num", false),
      node,
      context,
    );
    return {
      _krg: "variable",
      name,
      scope: context.scope,
      mutable: false,
      temporary: true,
    } as Variable;
  }
  private memberCall(member: Member, args: Value[], node: ts.Node, context: Context): Value {
    if (tagged(member.object, "array"))
      return this.runtimeArrayCall(member.object as RuntimeArray, member.name, args, node, context);
    if (
      Array.isArray(member.object) &&
      ["map", "flatMap", "filter", "some", "every"].includes(member.name)
    ) {
      if (args.length !== 1 || !tagged(args[0], "function"))
        this.fail(node, "KRG2720", "Static array transforms require one source callback.");
      const output: Value[] = [];
      for (let index = 0; index < member.object.length; index++) {
        this.tick(node);
        const item = member.object[index];
        const result = this.invoke(
          args[0] as Callable,
          [item, index, member.object],
          node,
          context,
        );
        if (member.name === "some" || member.name === "every") {
          if (typeof result === "boolean") {
            if (member.name === "some" && result) return true;
            if (member.name === "every" && !result) return false;
          } else output.push(result);
        } else if (member.name === "filter") {
          if (typeof result !== "boolean")
            this.fail(
              node,
              "KRG2721",
              "Static array filter predicates require compile-time booleans.",
            );
          if (result) output.push(item);
        } else if (member.name === "flatMap" && Array.isArray(result)) output.push(...result);
        else output.push(result);
      }
      if (member.name === "some" || member.name === "every") {
        if (!output.length) return member.name === "every";
        return {
          _krg: "trigger",
          items: [
            pdx.property(
              member.name === "some" ? "OR" : "AND",
              pdx.block(output.flatMap((value) => this.trigger(value, node, context))),
            ),
          ],
        } as Trigger;
      }
      return output;
    }
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
    if (member.name === "numberArray") {
      const name = this.string(args[0], node);
      if (args.length !== 1 || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(name))
        this.fail(node, "KRG2702", "numberArray requires one simple native array name.");
      return { _krg: "array", name, scope } as RuntimeArray;
    }
    if (member.name === "variables") {
      const layout = args[0];
      if (!tagged(layout, "variable-state") || layout.scope !== scope.name)
        this.fail(node, "KRG2745", `Variable state must match the '${scope.name}' scope.`);
      return {
        _krg: "bound-variable-state",
        scope,
        names: layout.names,
      } as BoundVariableState;
    }
    if (
      [
        "arrayLength",
        "arrayAt",
        "arraySet",
        "arrayInsert",
        "arrayRemoveAt",
        "arrayRemoveValue",
        "forEachValue",
      ].includes(member.name)
    ) {
      const name = this.string(args[0], node);
      if (!/^[A-Za-z_][A-Za-z0-9_.]*$/.test(name))
        this.fail(node, "KRG2702", "Invalid array name.");
      const read = member.name === "arrayLength" || member.name === "arrayAt";
      if (!read && context.mode !== "effect")
        this.fail(node, "KRG2037", "Array mutations require an effect callback.");
      const local: Context = { ...context, scope, sink: [] };
      const indexToken = (index: Value): string => {
        if (typeof index !== "number" && !tagged(index, "variable") && !tagged(index, "arithmetic"))
          this.fail(node, "KRG2708", "Array indices must be numeric.");
        if (typeof index === "number" && (!Number.isSafeInteger(index) || index < 0))
          this.fail(node, "KRG2708", "Literal array indices must be non-negative integers.");
        const encoded = this.toPdx(index, node, local);
        if (encoded.kind !== "atom") this.fail(node, "KRG2708", "Invalid array index.");
        return encoded.text;
      };
      if (read) {
        const token = member.name === "arrayLength" ? "num" : indexToken(args[1]);
        context.sink.push(...this.inScope(local.sink, scope, context, node));
        return { _krg: "variable", name: `${name}^${token}`, scope, mutable: false } as Variable;
      }
      if (member.name === "arraySet")
        this.variableEffect("set_variable", `${name}^${indexToken(args[1])}`, args[2], node, local);
      else if (member.name === "forEachValue") {
        const bindings = this.object(args[1], node);
        this.checkKeys(bindings, ["value", "index", "break"], node, "Array loop bindings");
        const fields = [pdx.property("array", pdx.atom(name))];
        for (const [key, value] of Object.entries(bindings)) {
          if (typeof value !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(value))
            this.fail(node, "KRG2708", "Array loop binding names must be simple identifiers.");
          fields.push(pdx.property(key, pdx.atom(value)));
        }
        if (!tagged(args[2], "function"))
          this.fail(node, "KRG2030", "Array loops require a typed callback.");
        const body: Context = { ...local, sink: [] };
        const result = this.invoke(args[2] as Callable, [scope], node, body);
        if (result !== undefined)
          this.fail(node, "KRG2031", "Array loop effects must return void.");
        local.sink.push(pdx.property("for_each_loop", pdx.block([...fields, ...body.sink])));
      } else {
        const fields = [pdx.property("array", pdx.atom(name))];
        if (member.name === "arrayInsert" || member.name === "arrayRemoveAt")
          fields.push(pdx.property("index", pdx.atom(indexToken(args[1]))));
        if (member.name !== "arrayRemoveAt")
          fields.push(
            pdx.property(
              "value",
              this.toPdx(args[member.name === "arrayInsert" ? 2 : 1], node, local),
            ),
          );
        local.sink.push(
          pdx.property(
            member.name === "arrayInsert" ? "add_to_array" : "remove_from_array",
            pdx.block(fields),
          ),
        );
      }
      context.sink.push(...this.inScope(local.sink, scope, context, node));
      return undefined;
    }
    if (member.name === "forRange" || member.name === "whileLoop") {
      if (context.mode !== "effect")
        this.fail(node, "KRG2037", "Runtime loops require an effect callback.");
      const local: Context = { ...context, scope, sink: [] };
      const invokeHere = (value: Value, mode: "effect" | "trigger"): pdx.PdxItem[] => {
        if (!tagged(value, "function"))
          this.fail(node, "KRG2030", "Runtime loops require typed callbacks.");
        const inner: Context = { ...local, mode, sink: [] };
        const result = this.invoke(value as Callable, [scope], node, inner);
        if (mode === "trigger") return this.flattenLogical(this.trigger(result, node, inner));
        if (result !== undefined) this.fail(node, "KRG2031", "Loop effects must return void.");
        return inner.sink;
      };
      const fields: pdx.PdxItem[] = [];
      if (member.name === "forRange") {
        const range = this.object(args[0], node);
        this.checkKeys(range, ["start", "end", "step", "index"], node, "Runtime range");
        for (const key of ["start", "end"])
          if (
            typeof range[key] !== "number" &&
            !tagged(range[key], "variable") &&
            !tagged(range[key], "arithmetic")
          )
            this.fail(node, "KRG2706", "Runtime ranges require numeric bounds.");
        if (
          range.step !== undefined &&
          (typeof range.step !== "number" || !Number.isFinite(range.step) || range.step === 0)
        )
          this.fail(
            node,
            "KRG2706",
            "Runtime range step must be a finite, non-zero compile-time number.",
          );
        const index = range.index ?? "v";
        if (typeof index !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(index))
          this.fail(node, "KRG2706", "Runtime range index must be a simple variable name.");
        fields.push(
          pdx.property("start", this.toPdx(range.start, node, local)),
          pdx.property("end", this.toPdx(range.end, node, local)),
        );
        if (range.step !== undefined)
          fields.push(pdx.property("add", this.toPdx(range.step, node, local)));
        if (typeof range.step === "number" && range.step < 0)
          fields.push(pdx.property("compare", pdx.atom("greater_than")));
        fields.push(pdx.property("value", pdx.atom(index)));
      } else fields.push(pdx.property("limit", pdx.block(invokeHere(args[0], "trigger"))));
      fields.push(...invokeHere(args[1], "effect"));
      local.sink.push(
        pdx.property(
          member.name === "forRange" ? "for_loop_effect" : "while_loop_effect",
          pdx.block(fields),
        ),
      );
      context.sink.push(...this.inScope(local.sink, scope, context, node));
      return undefined;
    }
    if (member.name === "buildingLevel") {
      const building = this.string(args[0], node);
      if (scope.name !== "state" || !/^[A-Za-z][A-Za-z0-9_]*$/.test(building))
        this.fail(node, "KRG2736", "Building levels require a state scope and a building ID.");
      return { _krg: "query", name: building, scope } as Query;
    }
    if (member.name === "hasEquipment") {
      if (scope.name !== "country")
        this.fail(node, "KRG2734", "Equipment stockpiles require a country scope.");
      const equipment = this.string(args[0], node),
        comparison = args[2] ?? "atLeast";
      if (
        !/^[A-Za-z0-9_]+$/.test(equipment) ||
        (comparison !== "atLeast" && comparison !== "moreThan")
      )
        this.fail(node, "KRG2734", "Expected an equipment ID and atLeast or moreThan comparison.");
      if (typeof args[1] !== "number" || !Number.isFinite(args[1]) || args[1] < 0)
        this.fail(node, "KRG2734", "Equipment thresholds must be finite non-negative numbers.");
      const check = pdx.property(
        "has_equipment",
        pdx.block([
          pdx.property(equipment, pdx.atom(String(args[1])), comparison === "atLeast" ? "<" : ">"),
        ]),
      );
      const items = [comparison === "atLeast" ? pdx.property("NOT", pdx.block([check])) : check];
      return { _krg: "trigger", items: this.inScope(items, scope, context, node) } as Trigger;
    }
    if (
      member.name === "dateBefore" ||
      member.name === "dateAfter" ||
      member.name === "dateOnOrAfter"
    ) {
      const date = this.string(args[0], node),
        m = /^(\d{1,4})\.(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?$/.exec(date);
      const days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (
        !m ||
        +m[1] < 1 ||
        +m[2] < 1 ||
        +m[2] > 12 ||
        +m[3] < 1 ||
        +m[3] > days[+m[2] - 1] ||
        (m[4] !== undefined && +m[4] > 23)
      )
        this.fail(node, "KRG2733", "Expected a game date in YYYY.M.D or YYYY.M.D.H format.");
      const before = pdx.property("date", pdx.atom(date), member.name === "dateAfter" ? ">" : "<");
      return {
        _krg: "trigger",
        items:
          member.name !== "dateOnOrAfter" ? [before] : [pdx.property("NOT", pdx.block([before]))],
      } as Trigger;
    }
    if (member.name === "anyOriginalCountry" || member.name === "overlordMatches") {
      if (scope.name !== "country")
        this.fail(node, "KRG2731", "This history query requires a country scope.");
      const filtered = member.name === "anyOriginalCountry",
        body: pdx.PdxItem[] = [];
      if (filtered) {
        const target = args[0];
        if (
          !record(target) ||
          target.kind !== "country" ||
          typeof target.tag !== "string" ||
          !/^[A-Z][A-Z0-9]{2}$/.test(target.tag)
        )
          this.fail(node, "KRG2731", "anyOriginalCountry requires an explicit country tag.");
        body.push(pdx.property("original_tag_to_check", pdx.atom(target.tag)));
      }
      body.push(
        ...this.callback(
          args[filtered ? 1 : 0],
          "country",
          "trigger",
          node,
          { ...context, scope },
          scope,
        ),
      );
      return {
        _krg: "trigger",
        items: this.inScope(
          [pdx.property(filtered ? "any_country_with_original_tag" : "OVERLORD", pdx.block(body))],
          scope,
          context,
          node,
        ),
      } as Trigger;
    }
    if (
      [
        "deployedAircraft",
        "navySize",
        "estimatedMaxArmor",
        "opinionOf",
        "resource",
        "importedResource",
      ].includes(member.name)
    ) {
      if (scope.name !== "country")
        this.fail(node, "KRG2731", "This query requires a country scope.");
      let name: string,
        field = "size";
      const before: pdx.PdxItem[] = [],
        after: pdx.PdxItem[] = [];
      if (member.name === "deployedAircraft" || member.name === "navySize") {
        name = member.name === "navySize" ? "has_navy_size" : "has_deployed_air_force_size";
        if (args[0] !== undefined) {
          const role = this.string(args[0], node);
          if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(role))
            this.fail(node, "KRG2731", "Invalid equipment role.");
          (member.name === "navySize" ? before : after).push(pdx.property("type", pdx.atom(role)));
        }
      } else if (member.name === "estimatedMaxArmor" || member.name === "opinionOf") {
        if (!record(args[0]) || args[0].kind !== "country" || typeof args[0].tag !== "string")
          this.fail(node, "KRG2731", "Expected a country target.");
        name = member.name === "opinionOf" ? "has_opinion" : "estimated_intel_max_armor";
        field = "value";
        before.push(
          pdx.property(member.name === "opinionOf" ? "target" : "tag", pdx.atom(args[0].tag)),
        );
      } else {
        const resource = this.string(args[0], node);
        if (
          !["oil", "rubber", "aluminium", "steel", "chromium", "coal", "tungsten"].includes(
            resource,
          )
        )
          this.fail(node, "KRG2731", "Unknown resource: " + resource);
        if (member.name === "resource") return { _krg: "query", scope, name: resource } as Query;
        name = "has_resources_in_country";
        field = "amount";
        before.push(pdx.property("resource", pdx.atom(resource)));
        after.push(pdx.property("only_imported", pdx.atom("yes")));
      }
      return { _krg: "query", scope, name, metric: { field, before, after } } as Query;
    }
    if (member.name === "grantTechnology") {
      if (scope.name !== "country" || context.mode !== "effect")
        this.fail(node, "KRG2731", "grantTechnology requires a country effect.");
      const tech = this.string(args[0], node);
      if (!/^[A-Za-z0-9_]+$/.test(tech) || tech === "popup")
        this.fail(node, "KRG2731", "Expected a technology ID.");
      const opt = args[1] === undefined ? {} : this.object(args[1], node);
      this.checkKeys(opt, ["popup"], node, "grantTechnology");
      if (opt.popup !== undefined && typeof opt.popup !== "boolean")
        this.fail(node, "KRG2731", "popup must be a boolean.");
      context.sink.push(
        pdx.property(
          "set_technology",
          pdx.block([
            pdx.property(tech, pdx.atom("1")),
            ...(opt.popup === undefined
              ? []
              : [pdx.property("popup", pdx.atom(opt.popup ? "yes" : "no"))]),
          ]),
        ),
      );
      return undefined;
    }
    if (member.name === "hiddenEffect") {
      if (context.mode !== "effect")
        this.fail(node, "KRG2037", "Hidden effects require an effect callback.");
      const inner = { ...context, scope, sink: [] as pdx.PdxItem[] };
      const [body] = args;
      const shared = this.countryActions.callback(body, scope.name, "effect", node);
      if (shared) inner.sink.push(...shared);
      else {
        if (!tagged(body, "function"))
          this.fail(node, "KRG2030", "Expected a typed effect callback.");
        const result = this.invoke(body as Callable, [scope], node, inner);
        if (result !== undefined)
          this.fail(node, "KRG2031", "An effect callback must return void.");
      }
      context.sink.push(
        ...this.inScope(
          [pdx.property("hidden_effect", pdx.block(inner.sink))],
          scope,
          context,
          node,
        ),
      );
      return undefined;
    }
    if (member.name === "dispatchByIndex") {
      if (context.mode !== "effect") this.fail(node, "KRG2037", "Catalogue dispatch is an effect.");
      const [variable, rows, apply, raw] = args;
      if (typeof variable !== "string" || !/^[A-Za-z_][A-Za-z0-9_.]*$/.test(variable))
        this.fail(node, "KRG2730", "dispatchByIndex requires a static numeric variable name.");
      if (
        !Array.isArray(rows) ||
        rows.length < 1 ||
        rows.length > 4096 ||
        !tagged(apply, "function")
      )
        this.fail(
          node,
          "KRG2730",
          "dispatchByIndex requires 1–4096 finite rows and an effect callback.",
        );
      const opts = raw === undefined ? {} : this.object(raw, node);
      this.checkKeys(opts, ["first", "outOfRange"], node, "Catalogue dispatch");
      const first = opts.first ?? 0,
        outside = opts.outOfRange ?? "ignore";
      if (
        typeof first !== "number" ||
        !Number.isSafeInteger(first) ||
        !Number.isSafeInteger(first + rows.length) ||
        (outside !== "clamp" && outside !== "ignore")
      )
        this.fail(
          node,
          "KRG2730",
          "Catalogue bounds must be safe integers; outOfRange must be ignore or clamp.",
        );
      context.sink.push(
        ...indexDispatch(variable, rows.length, first, outside, (offset) => {
          this.tick(node);
          return this.callback(
            apply,
            scope.name,
            "effect",
            node,
            { ...context, scope },
            undefined,
            [rows[offset], first + offset],
          );
        }),
      );
      return undefined;
    }
    if (member.name === "randomChoice") {
      if (context.mode !== "effect")
        this.fail(node, "KRG2037", "Random choices require an effect callback.");
      const choices = this.array(args[0], node);
      if (!choices.length) this.fail(node, "KRG2722", "Random choices require at least one entry.");
      const local: Context = { ...context, scope, sink: [] };
      const entries = choices.map((value) => {
        this.tick(node);
        const choice = this.object(value, node);
        this.checkKeys(choice, ["weight", "when", "effects"], node, "Random choice");
        const weight = choice.weight;
        if (
          !(typeof weight === "number" && Number.isInteger(weight) && weight >= 0) &&
          !tagged(weight, "variable")
        )
          this.fail(
            node,
            "KRG2723",
            "Random weights must be nonnegative integer constants or named game variables.",
          );
        const key = this.toPdx(weight, node, local);
        if (key.kind !== "atom")
          this.fail(node, "KRG2723", "Random weights must be scalar values.");
        const fields: pdx.PdxItem[] = [];
        if (choice.when !== undefined) {
          if (!tagged(choice.when, "function"))
            this.fail(node, "KRG2030", "Expected a typed random-choice trigger.");
          const condition = this.invoke(choice.when as Callable, [scope], node, {
            ...local,
            mode: "trigger",
            sink: [],
          });
          fields.push(
            pdx.property(
              "modifier",
              pdx.block([
                pdx.property("factor", pdx.atom("0")),
                pdx.property(
                  "NOT",
                  pdx.block(this.flattenLogical(this.trigger(condition, node, local))),
                ),
              ]),
            ),
          );
        }
        if (!tagged(choice.effects, "function"))
          this.fail(node, "KRG2030", "Expected a typed random-choice effect.");
        const result = this.invoke(choice.effects as Callable, [scope], node, {
          ...local,
          sink: fields,
        });
        if (result !== undefined)
          this.fail(node, "KRG2031", "A random-choice effect must return void.");
        return pdx.property(key.text, pdx.block(fields));
      });
      context.sink.push(
        ...this.inScope(
          [...local.sink, pdx.property("random_list", pdx.block(entries))],
          scope,
          context,
          node,
        ),
      );
      return undefined;
    }
    const variableOperations: Record<string, string> = {
      setVariable: "set_variable",
      addVariable: "add_to_variable",
      subtractVariable: "subtract_from_variable",
      multiplyVariable: "multiply_variable",
      divideVariable: "divide_variable",
      moduloVariable: "modulo_variable",
      setTempVariable: "set_temp_variable",
      addTempVariable: "add_to_temp_variable",
      subtractTempVariable: "subtract_from_temp_variable",
      multiplyTempVariable: "multiply_temp_variable",
      divideTempVariable: "divide_temp_variable",
    };
    if (
      member.name === "variable" ||
      variableOperations[member.name] ||
      [
        "clearVariable",
        "clampVariable",
        "clampTempVariable",
        "arrayContains",
        "arrayPush",
        "clearArray",
        "forEachCountryInArray",
      ].includes(member.name)
    ) {
      const name = this.string(args[0], node);
      if (!/^[A-Za-z_][A-Za-z0-9_.@]*(?:\^[A-Za-z0-9_.]+)*$/.test(name))
        this.fail(node, "KRG2702", `Invalid variable or array name '${name}'.`);
      if (member.name === "variable")
        return { _krg: "variable", name, scope, mutable: false } as Variable;
      if (member.name !== "arrayContains" && context.mode !== "effect")
        this.fail(node, "KRG2037", "Variable and array mutations require an effect callback.");
      const local: Context = { ...context, scope, sink: [] };
      if (variableOperations[member.name]) {
        const value = args[1];
        if (!(
          typeof value === "number" ||
          tagged(value, "variable") ||
          tagged(value, "arithmetic") ||
          (member.name.startsWith("set") &&
            record(value) &&
            ["country", "state", "military_industrial_organization"].includes(String(value.kind)))
        ))
          this.fail(
            node,
            "KRG2703",
            "Variable operations require a number, numeric expression, or a scope reference for set.",
          );
        if (
          (member.name === "divideVariable" ||
            member.name === "divideTempVariable" ||
            member.name === "moduloVariable") &&
          value === 0
        )
          this.fail(node, "KRG2704", "Division or modulo by constant zero is invalid.");
        this.variableEffect(variableOperations[member.name], name, value, node, local);
      } else if (member.name === "clearVariable" || member.name === "clearArray") {
        local.sink.push(
          pdx.property(
            member.name === "clearArray" ? "clear_array" : "clear_variable",
            pdx.atom(name),
          ),
        );
      } else if (member.name === "clampVariable" || member.name === "clampTempVariable") {
        const bounds = this.object(args[1], node);
        this.checkKeys(bounds, ["min", "max"], node, "Variable clamp");
        if (bounds.min === undefined && bounds.max === undefined)
          this.fail(node, "KRG2703", "A variable clamp requires at least one bound.");
        if (
          typeof bounds.min === "number" &&
          typeof bounds.max === "number" &&
          bounds.min > bounds.max
        )
          this.fail(node, "KRG2703", "Variable clamp minimum exceeds maximum.");
        local.sink.push(
          pdx.property(
            member.name === "clampVariable" ? "clamp_variable" : "clamp_temp_variable",
            this.toPdx({ var: name, ...bounds }, node, local),
          ),
        );
      } else if (member.name === "forEachCountryInArray") {
        local.sink.push(
          pdx.property(
            "for_each_scope_loop",
            pdx.block([
              pdx.property("array", pdx.atom(name)),
              ...this.callback(args[1], "country", "effect", node, local, scope),
            ]),
          ),
        );
      } else {
        const body = pdx.block([
          pdx.property("array", pdx.atom(name)),
          pdx.property("value", this.toPdx(args[1], node, local)),
        ]);
        local.sink.push(
          pdx.property(member.name === "arrayContains" ? "is_in_array" : "add_to_array", body),
        );
      }
      const items = this.inScope(local.sink, scope, context, node);
      if (member.name === "arrayContains") return { _krg: "trigger", items } as Trigger;
      context.sink.push(...items);
      return undefined;
    }
    if (member.name === "schedule") {
      if (context.mode !== "effect")
        this.fail(node, "KRG2037", "Events can only be scheduled inside an effect callback.");
      const event = args[0];
      if (!tagged(event, "definition") || event.eventScope !== scope.name)
        this.fail(node, "KRG2608", `Expected a declared event for ${scope.name} recipients.`);
      const delay = this.gameplay(node, () => normalizeEventDelay(args[1]));
      const body = this.toPdx({ id: this.string(event.id, node), ...delay }, node, context);
      context.sink.push(
        ...this.inScope(
          [pdx.property(scope.name === "state" ? "state_event" : "country_event", body)],
          scope,
          context,
          node,
        ),
      );
      return undefined;
    }
    if (member.name === "hasCompletedFocus" || member.name === "completeFocus") {
      const focus = args[0];
      if (scope.name !== "country" || !tagged(focus, "focus-reference"))
        this.fail(node, "KRG2608", "Expected a declared focus graph reference in country scope.");
      const isTrigger = member.name === "hasCompletedFocus";
      const items = this.inScope(
        [
          pdx.property(
            isTrigger ? "has_completed_focus" : "complete_national_focus",
            pdx.atom(this.string(focus.id, node)),
          ),
        ],
        scope,
        context,
        node,
      );
      if (isTrigger) return { _krg: "trigger", items } as Trigger;
      if (context.mode !== "effect")
        this.fail(node, "KRG2037", "Focus completion requires an effect callback.");
      context.sink.push(...items);
      return undefined;
    }
    if (member.name === "run" || member.name === "test") {
      const kind = member.name === "run" ? "effect" : "trigger";
      const definition = args[0];
      if (
        !tagged(definition, "definition") ||
        definition.definitionKind !== kind ||
        definition.scope !== scope.name
      )
        this.fail(node, "KRG2066", `Expected a scripted ${kind} handle for ${scope.name} scope.`);
      const parameterized = this.parameterizedEffects.get(definition);
      if (parameterized) {
        this.runParameterizedEffect(
          definition as Definition,
          parameterized,
          args,
          scope,
          node,
          context,
        );
        return undefined;
      }
      if (
        args.length > (kind === "effect" ? 2 : 1) ||
        (args[1] !== undefined && typeof args[1] !== "boolean")
      )
        this.fail(
          node,
          "KRG2613",
          "An ordinary scripted call accepts only its optional boolean invocation value.",
        );
      const items = this.inScope(
        [
          pdx.property(
            this.string(definition.name, node),
            pdx.atom(args[1] === false ? "no" : "yes"),
          ),
        ],
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
      militaryOrganization: {
        key: "",
        scope: "military_industrial_organization",
        mode: "effect",
        target: true,
      },
      countryMatches: { key: "", scope: "country", mode: "trigger", target: true },
      stateMatches: { key: "", scope: "state", mode: "trigger", target: true },
      everyGlobalState: { key: "every_state", scope: "state", mode: "effect" },
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
      key = String(method.scope === "country" ? reference.tag : (reference.path ?? reference.id));
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

  /** A trigger/limit block is already a conjunction. Only unwrap AND in
   * that context; OR and NOT retain their explicitly grouped operands. */
  private flattenLogical(items: pdx.PdxItem[], key: "AND" | "OR" = "AND"): pdx.PdxItem[] {
    return items.flatMap((item) =>
      item.kind === "property" &&
      item.key.text === key &&
      item.operator === "=" &&
      item.value.kind === "block"
        ? this.flattenLogical(item.value.items, key)
        : [item],
    );
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
      if (variable.temporary) return pdx.atom(variable.name);
      if (/^(?:global|ROOT|FROM)\./i.test(variable.name)) return pdx.atom(variable.name);
      const prefix = this.scopePath(variable.scope, context.scope, node);
      return pdx.atom(prefix ? `${prefix}.${variable.name}` : variable.name);
    }
    if (tagged(value, "arithmetic"))
      return pdx.atom(this.materialize(value as Arithmetic, node, context));
    if (Array.isArray(value))
      return pdx.block(value.map((item) => this.toPdx(item, node, context)));
    if (record(value)) {
      if (value.kind === "country") return pdx.atom(this.string(value.tag, node));
      if (value.kind === "state") return pdx.atom(String(value.path ?? value.id));
      if (value.kind === "military_industrial_organization")
        return pdx.atom(this.string(value.path, node));
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
    let left = this.evaluate(node.left, context);
    if (operator === ts.SyntaxKind.AmpersandAmpersandToken && left === false) return false;
    if (operator === ts.SyntaxKind.BarBarToken && left === true) return true;
    if (
      (operator === ts.SyntaxKind.AmpersandAmpersandToken && left === true) ||
      (operator === ts.SyntaxKind.BarBarToken && left === false)
    )
      return this.evaluate(node.right, context);
    const pending = { ...context, sink: [] as pdx.PdxItem[] };
    const right = this.evaluate(node.right, pending);
    if (pending.sink.length) left = this.snapshotNumber(left, node.left, context);
    context.sink.push(...pending.sink);
    if (
      operator === ts.SyntaxKind.AmpersandAmpersandToken ||
      operator === ts.SyntaxKind.BarBarToken
    ) {
      if (typeof left === "boolean" && typeof right === "boolean")
        return operator === ts.SyntaxKind.AmpersandAmpersandToken ? left && right : left || right;
      const key = operator === ts.SyntaxKind.AmpersandAmpersandToken ? "AND" : "OR";
      const leftItems = this.trigger(left, node.left, context),
        rightItems = this.trigger(right, node.right, context);
      // Several sibling triggers form an implicit AND. Preserve that grouping when
      // they contribute a single alternative to an OR.
      const children = [leftItems, rightItems].flatMap((items) =>
        key === "OR" && items.length > 1 ? [pdx.property("AND", pdx.block(items))] : items,
      );
      return {
        _krg: "trigger",
        items: [pdx.property(key, pdx.block(this.flattenLogical(children, key)))],
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
      const compared = (op: pdx.PdxOperator) =>
        query.metric
          ? pdx.property(
              query.name,
              pdx.block([
                ...query.metric.before,
                pdx.property(query.metric.field, value, op),
                ...query.metric.after,
              ]),
            )
          : pdx.property(query.name, value, op);
      const less = compared("<");
      const greater = compared(">");
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
    this.variableEffect("set_temp_variable", name, value.left, node, context);
    const operations: Partial<Record<ts.SyntaxKind, string>> = {
      [ts.SyntaxKind.PlusToken]: "add_to_variable",
      [ts.SyntaxKind.MinusToken]: "subtract_from_variable",
      [ts.SyntaxKind.AsteriskToken]: "multiply_variable",
      [ts.SyntaxKind.SlashToken]: "divide_variable",
      [ts.SyntaxKind.PercentToken]: "modulo_variable",
    };
    const operation = operations[value.operator];
    if (!operation) this.fail(node, "KRG2052", "Unsupported runtime arithmetic operator.");
    this.variableEffect(
      operation.replace("variable", "temp_variable"),
      name,
      value.right,
      node,
      context,
    );
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
    if (
      context.mode !== "effect" ||
      !(
        ts.isIdentifier(node.left) ||
        ts.isPropertyAccessExpression(node.left) ||
        ts.isElementAccessExpression(node.left)
      )
    )
      this.fail(
        node,
        "KRG2053",
        "Assign numeric game variables or variable state properties inside effects.",
      );
    const variable = this.evaluate(node.left, context);
    if (tagged(variable, "variable") && variable.lengthOf) {
      if (
        node.operatorToken.kind !== ts.SyntaxKind.EqualsToken ||
        this.evaluate(node.right, context) !== 0
      )
        this.fail(
          node,
          "KRG2750",
          "Runtime array length can only be assigned zero to clear the array.",
        );
      const array = variable.lengthOf as RuntimeArray;
      const item = pdx.property(
        array.temporary ? "clear_temp_array" : "clear_array",
        pdx.atom(array.name),
      );
      context.sink.push(
        ...(array.temporary ? [item] : this.inScope([item], array.scope, context, node)),
      );
      return undefined;
    }
    if (tagged(variable, "array"))
      this.fail(
        node,
        "KRG2750",
        "Runtime array bindings cannot be reassigned. Update elements, push, splice, or clear length.",
      );
    if (!tagged(variable, "variable") || !variable.mutable)
      this.fail(
        node,
        "KRG2054",
        "Only mutable game variables or variable state properties can be assigned.",
      );
    const target = variable as Variable;
    if (!target.property && !target.temporary && this.scopePath(target.scope, context.scope, node))
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
    const value = this.evaluate(node.right, context);
    if (!(typeof value === "number" || tagged(value, "variable") || tagged(value, "arithmetic")))
      this.fail(node, "KRG2703", "Variable assignment requires a number or numeric expression.");
    if ((operation === "divide_variable" || operation === "modulo_variable") && value === 0)
      this.fail(node, "KRG2704", "Division or modulo by constant zero is invalid.");
    const name = (this.toPdx(target, node, context) as pdx.PdxAtom).text;
    this.variableEffect(
      target.temporary ? operation.replace(/_variable$/, "_temp_variable") : operation,
      name,
      value,
      node,
      context,
    );
    return undefined;
  }
  private increment(
    operand: ts.Expression,
    amount: number,
    node: ts.Node,
    context: Context,
  ): Value {
    if (
      !ts.isExpressionStatement(node.parent) &&
      !(ts.isForStatement(node.parent) && node.parent.incrementor === node)
    )
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
        "Increment/decrement requires a mutable numeric game variable in an effect.",
      );
    const target = variable as Variable;
    if (!target.property && !target.temporary && this.scopePath(target.scope, context.scope, node))
      this.fail(node, "KRG2055", "Assign a variable within its declaring scope.");
    const name = (this.toPdx(target, node, context) as pdx.PdxAtom).text;
    this.variableEffect(
      target.temporary ? "add_to_temp_variable" : "add_to_variable",
      name,
      amount,
      node,
      context,
    );
    return undefined;
  }
  private localDeclarations(declarations: ts.VariableDeclarationList, context: Context): void {
    if (!(declarations.flags & (ts.NodeFlags.Const | ts.NodeFlags.Let)))
      this.fail(
        declarations,
        "KRG2067",
        "Use const for compile-time values and let for numeric game variables. var hoisting is not supported.",
      );
    for (const declaration of declarations.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer)
        this.fail(
          declaration,
          "KRG2059",
          "Local declarations require a named identifier and initializer.",
        );
      const value = this.evaluate(declaration.initializer, context);
      const symbol = this.symbol(declaration.name)!;
      const type = this.checker.getTypeAtLocation(declaration.name);
      const numericArray = this.checker.isArrayType(type) && type.symbol?.name === "Array";
      if (tagged(value, "array")) {
        context.env.set(symbol, value);
        continue;
      }
      if (
        Array.isArray(value) &&
        (!(declarations.flags & ts.NodeFlags.Const) || (declaration.type && numericArray))
      ) {
        if (context.mode !== "effect" || !context.scope)
          this.fail(declaration, "KRG2060", "Runtime arrays must be initialized inside an effect.");
        const element = this.checker.getIndexTypeOfType(type, ts.IndexKind.Number);
        if (
          !element ||
          element.flags & ts.TypeFlags.Any ||
          !this.checker.isTypeAssignableTo(element, this.checker.getNumberType())
        )
          this.fail(
            declaration,
            "KRG2751",
            "Runtime arrays require a numeric element type. Annotate an empty array as number[].",
          );
        const name = `krg_${context.prefix}_${safeId(declaration.name.text)}_${++this.sequence}`;
        const array: RuntimeArray = { _krg: "array", name, scope: context.scope, temporary: true };
        context.sink.push(pdx.property("clear_temp_array", pdx.atom(name)));
        this.runtimeArrayCall(array, "push", value, declaration, context);
        context.env.set(symbol, array);
        continue;
      }
      if (declarations.flags & ts.NodeFlags.Const) {
        if (tagged(value, "variable") || tagged(value, "arithmetic")) {
          if (context.mode !== "effect" || !context.scope)
            this.fail(
              declaration,
              "KRG2068",
              "A runtime numeric snapshot requires an effect context.",
            );
          const name = `krg_${context.prefix}_${safeId(declaration.name.text)}_${++this.sequence}`;
          this.variableEffect("set_temp_variable", name, value, declaration, context);
          context.env.set(symbol, {
            _krg: "variable",
            name,
            scope: context.scope,
            mutable: false,
            temporary: true,
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
          !(typeof value === "number" || tagged(value, "variable") || tagged(value, "arithmetic"))
        )
          this.fail(
            declaration,
            "KRG2060",
            "let variables must be numeric values or numeric arrays initialized inside an effect.",
          );
        const name = `krg_${context.prefix}_${safeId(declaration.name.text)}_${++this.sequence}`;
        const variable: Variable = {
          _krg: "variable",
          name,
          scope: context.scope,
          mutable: true,
          temporary: true,
        };
        this.variableEffect("set_temp_variable", name, value, declaration, context);
        context.env.set(symbol, variable);
      }
    }
  }
  private runtimeLoop(statement: ts.WhileStatement | ts.ForStatement, context: Context): void {
    if (context.mode !== "effect" || !context.scope)
      this.fail(statement, "KRG2063", "Runtime loops require an effect callback.");
    const loop: Context = { ...context, env: new Map(context.env) };
    const counted = ts.isForStatement(statement);
    if (counted) {
      const initializer = statement.initializer as ts.VariableDeclarationList;
      const declaration = initializer.declarations[0];
      if (
        !this.checker.isTypeAssignableTo(
          this.checker.getTypeAtLocation(declaration.name),
          this.checker.getNumberType(),
        )
      )
        this.fail(declaration, "KRG2060", "A runtime for-loop counter must be numeric.");
      this.localDeclarations(initializer, loop);
    }
    const test = counted ? statement.condition! : statement.expression;
    const predicate: Context = { ...loop, mode: "trigger", sink: [] };
    const value = this.evaluate(test, predicate);
    if (value === false) return;
    if (value === true)
      this.fail(test, "KRG1001", "A runtime loop needs a condition that can become false in game.");
    const limit = this.flattenLogical(this.trigger(value, test, predicate));
    const stop = `krg_${context.prefix}_loop_break_${++this.sequence}`;
    this.variableEffect("set_temp_variable", stop, 0, statement, context);
    const body: Context = { ...loop, sink: [], dynamicBranch: true };
    this.statements([statement.statement], body);
    if (counted) this.evaluate(statement.incrementor!, body);
    context.sink.push(
      pdx.property(
        "while_loop_effect",
        pdx.block([
          pdx.property("limit", pdx.block(limit)),
          pdx.property("break", pdx.atom(stop)),
          ...body.sink,
        ]),
      ),
    );
  }
  private statements(
    statements: ts.NodeArray<ts.Statement> | readonly ts.Statement[],
    context: Context,
  ): void {
    for (const statement of statements) {
      this.tick(statement);
      if (ts.isVariableStatement(statement)) {
        this.localDeclarations(statement.declarationList, context);
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
              pdx.block(
                this.flattenLogical(this.trigger(condition, statement.expression, context)),
              ),
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
      } else if (ts.isWhileStatement(statement) || ts.isForStatement(statement)) {
        this.runtimeLoop(statement, context);
      } else if (ts.isForOfStatement(statement)) {
        const source = this.evaluate(statement.expression, context);
        const declaration = (statement.initializer as ts.VariableDeclarationList).declarations[0];
        const symbol = this.symbol(declaration.name)!;
        if (tagged(source, "array")) {
          if (context.mode !== "effect" || !context.scope)
            this.fail(statement, "KRG2037", "Runtime array iteration requires an effect callback.");
          const array = source as RuntimeArray;
          const name = `krg_${context.prefix}_${safeId(declaration.name.getText())}_${++this.sequence}`;
          const env = new Map(context.env);
          env.set(symbol, {
            _krg: "variable",
            name,
            scope: context.scope,
            mutable: false,
            temporary: true,
          } as Variable);
          const sink: pdx.PdxItem[] = [];
          this.statements([statement.statement], { ...context, env, sink, dynamicBranch: true });
          const prefix = array.temporary
            ? undefined
            : this.scopePath(array.scope, context.scope, statement);
          this.variableEffect("set_temp_variable", `${name}_break`, 0, statement, context);
          context.sink.push(
            pdx.property(
              "for_each_loop",
              pdx.block([
                pdx.property("array", pdx.atom(prefix ? `${prefix}.${array.name}` : array.name)),
                pdx.property("value", pdx.atom(name)),
                pdx.property("index", pdx.atom(`${name}_index`)),
                pdx.property("break", pdx.atom(`${name}_break`)),
                ...sink,
              ]),
            ),
          );
          continue;
        }
        const values = this.array(source, statement.expression);
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
    if (name === "Defines" || name === "DefineFile") {
      const outputPath =
        name === "Defines"
          ? `common/defines/krieg_${safeId(this.string(args[0], node))}.lua`
          : this.string(args[0], node);
      if (!outputPath.startsWith("common/defines/") || !outputPath.endsWith(".lua"))
        this.fail(node, "KRG2121", "Defines output must use a common/defines/*.lua path.");
      // Reuse path validation; the emitted Lua variant carries text, never a PDX document.
      const validated = this.output(outputPath, pdx.document([]), node, "schema-native");
      try {
        const text = lowerDefines(args[1]);
        return [
          {
            format: "lua",
            path: validated.path,
            sourceFile: validated.sourceFile,
            representation: "schema-native",
            text,
            ...(this.options.traceSources && text
              ? {
                  lineOrigins: [
                    {
                      from: 1,
                      to: text.trimEnd().split("\n").length,
                      ...this.origins.declaration(node),
                    },
                  ],
                }
              : {}),
          },
        ];
      } catch (error) {
        this.fail(node, "KRG2122", error instanceof Error ? error.message : String(error));
      }
    }
    if (DOMAIN_DEFINITIONS[name]) return this.nativeDefinition(name, args, node, context);
    if (name === "ScriptedLocalisation") return this.scriptedLocalisation(args, node, context);
    if (name === "ScriptedGui") return this.scriptedGui(args, node, context);
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
      this.claimScriptedName(mode, id, node);
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
      const identity = this.gameplay(node, () => validateEventIdentifier(id));
      this.claimGameplayId("event", identity, node);
      if (identity.slice(identity.lastIndexOf(".") + 1).length > 5)
        this.report(
          node,
          "KRG2609",
          `Event '${id}' uses a suffix above 99999. The game accepts it, but it can collide with another namespace's internal event IDs.`,
          "warning",
        );
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
          "timeoutDays",
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
        timeoutDays: "timeout_days",
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
        this.claimGameplayId("focus", this.string(focus.id, node), node);
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
        ["id", "icon", "visible", "allowed", "decisions", "priority", "scriptedGui"],
        node,
        "DecisionCategory",
      );
      const category = [
        ...scalarFields({ icon: "icon", priority: "priority", scriptedGui: "scripted_gui" }),
        ...callbackFields({ visible: ["trigger", "visible"], allowed: ["trigger", "allowed"] }),
      ];
      const decisions: pdx.PdxItem[] = [];
      for (const decisionValue of this.array(spec.decisions, node)) {
        const decision = this.countryActions.decision(this.object(decisionValue, node), node);
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
            "priority",
            "mission",
          ],
          node,
          "Decision",
        );
        const items = scalarFields(
          {
            icon: "icon",
            cost: "cost",
            daysRemove: "days_remove",
            daysReEnable: "days_re_enable",
            priority: "priority",
          },
          decision,
        );
        if (decision.mission !== undefined) {
          const mission = this.object(decision.mission, node);
          this.checkKeys(
            mission,
            ["days", "activation", "cancel", "timeout", "selectable", "isGood"],
            node,
            "Decision mission",
          );
          if (
            decision.action !== undefined ||
            typeof mission.days !== "number" ||
            !Number.isSafeInteger(mission.days) ||
            mission.days < 1 ||
            mission.timeout === undefined
          )
            this.fail(
              node,
              "KRG2735",
              "A mission requires positive whole days, a timeout effect, and cannot bind a CountryAction.",
            );
          items.push(
            ...scalarFields(
              { days: "days_mission_timeout", selectable: "selectable_mission", isGood: "is_good" },
              mission,
            ),
          );
          items.push(
            ...callbackFields(
              {
                activation: ["trigger", "activation"],
                cancel: ["trigger", "cancel_trigger"],
                timeout: ["effect", "timeout_effect"],
              },
              mission,
            ),
          );
        }
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
        [
          "id",
          "picture",
          "allowed",
          "allowedCivilWar",
          "visible",
          "removalCost",
          "modifier",
          "onAdd",
          "onRemove",
        ],
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
          allowedCivilWar: ["trigger", "allowed_civil_war"],
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

  private nativeValueError(value: Value, rule: NativeValue, depth = 0): string | undefined {
    if (depth > 64) return "Native definition nesting exceeds the compiler limit.";
    if (rule.kind === "union") {
      const errors = rule.variants.map((variant) =>
        this.nativeValueError(value, variant, depth + 1),
      );
      return errors.some((error) => error === undefined) ? undefined : errors[0];
    }
    if (rule.kind === "scalar") {
      if (typeof value !== rule.type) return `Expected ${rule.type}.`;
      if (rule.literals && !rule.literals.includes(value as string | number | boolean))
        return `Expected one of ${rule.literals.join(", ")}.`;
      if (
        rule.format === "day-month" &&
        (typeof value !== "string" || !/^\d{1,2}\.\d{1,2}$/.test(value))
      )
        return "Expected a native day.month string, such as 0.0 or 30.11.";
      if (
        typeof value === "number" &&
        (!Number.isFinite(value) ||
          (rule.integer && !Number.isInteger(value)) ||
          (rule.min !== undefined && value < rule.min) ||
          (rule.max !== undefined && value > rule.max))
      )
        return "Number does not satisfy the native CWT bounds.";
      return undefined;
    }
    if (rule.kind === "callback") {
      if (!tagged(value, "function")) return "Expected a typed game scope callback.";
      const declaredScope = this.nativeCallbackScope(value as Callable);
      return declaredScope !== undefined && declaredScope !== rule.scope
        ? `Expected a ${rule.scope} callback, received ${declaredScope}.`
        : undefined;
    }
    if (rule.kind === "opaque")
      return record(value) && value.kind === "cwt"
        ? undefined
        : `This CWT form requires cwt([...]): ${rule.reason}.`;
    if (rule.kind === "list") {
      if (!Array.isArray(value)) return "Expected an array of native list values.";
      return value
        .map((entry) => this.nativeValueError(entry, rule.element, depth + 1))
        .find((error) => error !== undefined);
    }
    if (!record(value) || "_krg" in value) return "Expected a native field record.";
    if (rule.kind === "map")
      return Object.entries(value)
        .map(([key, entry]) =>
          rule.keys && !rule.keys.includes(key)
            ? `Unknown native map key '${key}'.`
            : this.nativeValueError(entry, rule.value, depth + 1),
        )
        .find((error) => error !== undefined);
    const fields = DOMAIN_SCHEMA.shapes[rule.shape];
    for (const key of Object.keys(value))
      if (!Object.hasOwn(fields, key)) return `Unknown native field '${key}'.`;
    for (const [key, field] of Object.entries(fields)) {
      if (value[key] === undefined) {
        if (field.required) return `Required native field '${key}' is missing.`;
        continue;
      }
      if (field.repeated && !Array.isArray(value[key]))
        return `Repeated native field '${key}' requires an array.`;
      const entries = field.repeated ? (value[key] as Value[]) : [value[key]];
      if (field.repeated) {
        const minCount = field.minCount ?? (field.required ? 1 : 0);
        if (entries.length < minCount)
          return `Repeated native field '${key}' requires at least ${minCount} entries.`;
        if (field.maxCount !== undefined && entries.length > field.maxCount)
          return `Repeated native field '${key}' allows at most ${field.maxCount} entries.`;
      }
      for (const entry of entries) {
        const error = this.nativeValueError(entry, field.value, depth + 1);
        if (error) return `${key}: ${error}`;
      }
    }
    return undefined;
  }
  private nativeCallbackScope(value: Callable): string | undefined {
    const parameter = value.node.parameters[0];
    if (!parameter) return undefined;
    const type = this.checker.getTypeAtLocation(parameter);
    const property = this.checker.getPropertyOfType(type, "scope");
    if (!property) return undefined;
    const scope = this.checker.getTypeOfSymbolAtLocation(property, parameter);
    return scope.isStringLiteral() ? scope.value : undefined;
  }
  private nativeValue(
    value: Value,
    rule: NativeValue,
    node: ts.Node,
    context: Context,
  ): pdx.PdxValue {
    if (rule.kind === "union") {
      const candidate = rule.variants.find(
        (variant) => this.nativeValueError(value, variant) === undefined,
      );
      if (!candidate)
        this.fail(node, "KRG2111", this.nativeValueError(value, rule) ?? "Invalid native field.");
      return this.nativeValue(value, candidate, node, context);
    }
    if (rule.kind === "callback")
      return pdx.block(this.callback(value, rule.scope, rule.mode, node, context));
    if (rule.kind === "scalar" || rule.kind === "opaque") return this.toPdx(value, node, context);
    if (rule.kind === "list")
      return pdx.block(
        this.array(value, node).map((entry) =>
          this.nativeValue(entry, rule.element, node, context),
        ),
      );
    if (rule.kind === "map")
      return pdx.block(
        Object.entries(this.object(value, node)).map(([key, entry]) =>
          pdx.property(key, this.nativeValue(entry, rule.value, node, context)),
        ),
      );
    const spec = this.object(value, node);
    const fields = DOMAIN_SCHEMA.shapes[rule.shape];
    const items: pdx.PdxItem[] = [];
    for (const [key, field] of Object.entries(fields)) {
      if (spec[key] === undefined) continue;
      for (const entry of field.repeated ? this.array(spec[key], node) : [spec[key]]) {
        const encoded = this.nativeValue(entry, field.value, node, context);
        if (field.name) items.push(pdx.property(field.name, encoded));
        else if (encoded.kind === "block") items.push(...encoded.items);
        else this.fail(node, "KRG2112", "Inline native fields must produce a block or a list.");
      }
    }
    return pdx.block(items);
  }
  private nativeDefinition(
    name: string,
    args: Value[],
    node: ts.Node,
    context: Context,
  ): CompileOutput[] {
    const definition = DOMAIN_DEFINITIONS[name];
    const spec = this.object(args[0], node);
    const id = spec.id;
    if (
      (definition.idType === "number" &&
        (typeof id !== "number" || !Number.isInteger(id) || id < 1)) ||
      (definition.idType !== "number" && (typeof id !== "string" || !id))
    )
      this.fail(
        node,
        "KRG2113",
        `${name} requires a ${definition.idType === "number" ? "positive integer" : "non-empty string"} id.`,
      );
    const shape = definition.byId?.[String(id)] ?? definition.shape;
    if (definition.byId && !Object.hasOwn(definition.byId, String(id)))
      this.fail(node, "KRG2114", `Unknown on-action hook '${String(id)}'.`);
    const data = Object.fromEntries(
      Object.entries(spec).filter(
        ([key]) => key !== "id" && key !== "outputPath" && key !== definition.rootField,
      ),
    );
    const error = this.nativeValueError(data, { kind: "object", shape });
    if (error) this.fail(node, "KRG2115", `${name}: ${error}`);
    const items = (
      this.nativeValue(data, { kind: "object", shape }, node, {
        ...context,
        prefix: safeId(String(id)),
      }) as pdx.PdxBlock
    ).items;
    const outputPath =
      spec.outputPath === undefined
        ? `${definition.folder}/${definition.fileName ?? `krieg_${safeId(String(id))}${definition.extension ?? ".txt"}`}`
        : this.string(spec.outputPath, node);
    if (definition.kind === "country") {
      if (!/^[A-Z][A-Z0-9]{2}$/.test(String(id)))
        this.fail(
          node,
          "KRG2116",
          "CountryDefinition id must start with an uppercase letter followed by two uppercase letters or digits.",
        );
      if (!outputPath.startsWith("common/countries/") || !outputPath.endsWith(".txt"))
        this.fail(
          node,
          "KRG2117",
          "CountryDefinition outputPath must be a common/countries/*.txt game path.",
        );
      const color = items.find((item) => item.kind === "property" && item.key.text === "color") as
        pdx.PdxProperty | undefined;
      if (!color || color.value.kind !== "block" || color.value.items.length !== 3)
        this.fail(
          node,
          "KRG2118",
          "Country RGB color requires exactly three integers from 0 to 255.",
        );
      color.value = pdx.tagged("rgb", color.value);
      return [
        this.output(outputPath, pdx.document(items), node, "schema-native"),
        this.output(
          `common/country_tags/krieg_${String(id)}.txt`,
          pdx.document([pdx.property(String(id), pdx.string(outputPath.slice("common/".length)))]),
          node,
          "schema-native",
        ),
      ];
    }
    if (definition.idMode === "field")
      items.unshift(pdx.property(definition.idField ?? "id", this.toPdx(id, node, context)));
    let body =
      definition.idMode === "anonymous"
        ? items
        : [pdx.property(definition.nodeName ?? String(id), pdx.block(items))];
    if (definition.rootField) {
      const root = this.string(spec[definition.rootField], node);
      if (definition.rootValues && !definition.rootValues.includes(root))
        this.fail(
          node,
          "KRG2124",
          `${name} has an invalid native ${definition.rootField} '${root}'.`,
        );
      body = [pdx.property(root, pdx.block(body))];
    }
    if (definition.root) body = [pdx.property(definition.root, pdx.block(body))];
    if (definition.kind === "event") {
      const match = /^([A-Za-z_][A-Za-z0-9_]*)\.([0-9]+)$/.exec(String(id));
      if (!match)
        this.fail(
          node,
          "KRG2123",
          "Native event IDs require an identifier namespace and numeric suffix, such as krg.1.",
        );
      body.unshift(pdx.property("add_namespace", pdx.atom(match[1])));
    }
    return [this.output(outputPath, pdx.document(body), node, "schema-native")];
  }

  private weight(value: Value, scope: string, node: ts.Node, context: Context): pdx.PdxBlock {
    const spec = this.object(value, node);
    this.checkKeys(spec, ["base", "factor", "add", "modifiers"], node, "Weight");
    const items: pdx.PdxItem[] = [];
    for (const key of ["base", "factor", "add"])
      if (spec[key] !== undefined)
        items.push(pdx.property(key, this.toPdx(spec[key], node, context)));
    for (const entry of this.array(spec.modifiers ?? [], node)) {
      const modifier = this.object(entry, node);
      this.checkKeys(modifier, ["trigger", "factor", "add"], node, "Weight modifier");
      if (modifier.factor === undefined && modifier.add === undefined)
        this.fail(node, "KRG2097", "A weight modifier requires factor or add.");
      const fields: pdx.PdxItem[] = [];
      for (const key of ["factor", "add"])
        if (modifier[key] !== undefined)
          fields.push(pdx.property(key, this.toPdx(modifier[key], node, context)));
      fields.push(...this.callback(modifier.trigger, scope, "trigger", node, context));
      items.push(pdx.property("modifier", pdx.block(fields)));
    }
    return pdx.block(items);
  }
  private scriptedLocalisation(args: Value[], node: ts.Node, context: Context): CompileOutput[] {
    const name = this.string(args[0], node);
    const spec = this.object(args[1], node);
    this.checkKeys(spec, ["scope", "texts"], node, "ScriptedLocalisation");
    const scope = this.string(spec.scope, node);
    const texts = this.array(spec.texts, node);
    if (!texts.length)
      this.fail(node, "KRG2098", "Scripted localisation requires at least one text choice.");
    const items: pdx.PdxItem[] = [pdx.property("name", this.toPdx(name, node, context))];
    for (let index = 0; index < texts.length; index++) {
      const entry = this.object(texts[index], node);
      this.checkKeys(
        entry,
        ["trigger", "localisationKey", "randomList", "seed"],
        node,
        "Scripted localisation text",
      );
      if (entry.trigger === undefined && index < texts.length - 1)
        this.fail(
          node,
          "KRG2099",
          "An unconditional scripted localisation fallback must be the last text choice.",
        );
      if ((entry.localisationKey !== undefined) === (entry.randomList !== undefined))
        this.fail(
          node,
          "KRG2100",
          "A text choice requires exactly one localisationKey or randomList.",
        );
      const fields: pdx.PdxItem[] = [];
      if (entry.trigger !== undefined)
        fields.push(
          pdx.property(
            "trigger",
            pdx.block(this.callback(entry.trigger, scope, "trigger", node, context)),
          ),
        );
      const localisation = (key: Value): pdx.PdxProperty => {
        const text = this.string(key, node);
        return pdx.property(
          "localization_key",
          /\[/.test(text) ? pdx.string(text) : this.toPdx(text, node, context),
        );
      };
      if (entry.localisationKey !== undefined) {
        if (entry.seed !== undefined)
          this.fail(node, "KRG2101", "A random seed belongs to a randomList text choice.");
        fields.push(localisation(entry.localisationKey));
      } else {
        const choices = this.array(entry.randomList, node);
        if (!choices.length)
          this.fail(node, "KRG2102", "A random localisation list must contain a weighted choice.");
        const weighted: pdx.PdxItem[] = [];
        if (entry.seed !== undefined)
          weighted.push(pdx.property("seed", this.toPdx(entry.seed, node, context)));
        for (const choice of choices) {
          const item = this.object(choice, node);
          this.checkKeys(
            item,
            ["weight", "localisationKey", "modifiers"],
            node,
            "Random localisation choice",
          );
          if (typeof item.weight !== "number" || !Number.isInteger(item.weight) || item.weight <= 0)
            this.fail(node, "KRG2103", "Localisation weights must be positive integers.");
          const body = [
            localisation(item.localisationKey),
            ...this.weight({ modifiers: item.modifiers ?? [] }, scope, node, context).items,
          ];
          weighted.push(pdx.property(String(item.weight), pdx.block(body)));
        }
        fields.push(pdx.property("random_list", pdx.block(weighted)));
      }
      items.push(pdx.property("text", pdx.block(fields)));
    }
    return [
      this.output(
        `common/scripted_localisation/krieg_${safeId(name)}.txt`,
        pdx.document([pdx.property("defined_text", pdx.block(items))]),
        node,
      ),
    ];
  }
  private scriptedGui(args: Value[], node: ts.Node, context: Context): CompileOutput[] {
    const spec = this.object(args[0], node);
    const scalar: Record<string, string> = {
      windowName: "window_name",
      context: "context_type",
      parentWindowToken: "parent_window_token",
      parentWindowName: "parent_window_name",
      parentScriptedGui: "parent_scripted_gui",
      dirty: "dirty",
      aiTestParent: "ai_test_parent",
      aiTestInterval: "ai_test_interval",
      aiTestVariance: "ai_test_variance",
      aiMaxWeightTakenPerTest: "ai_max_weight_taken_per_test",
    };
    this.checkKeys(
      spec,
      [
        "name",
        ...Object.keys(scalar),
        "visible",
        "effects",
        "triggers",
        "properties",
        "dynamicLists",
        "aiEnabled",
        "aiCheck",
        "aiCheckScope",
        "aiTestScopes",
        "aiWeights",
        "mapiconTargets",
      ],
      node,
      "ScriptedGui",
    );
    const name = this.string(spec.name, node);
    const guiContext = this.string(spec.context, node);
    const scope =
      guiContext === "selected_state_context" || guiContext === "state_mapicon"
        ? "state"
        : guiContext === "global_context"
          ? "any"
          : "country";
    const parents = ["parentWindowToken", "parentWindowName", "parentScriptedGui"].filter(
      (key) => spec[key] !== undefined,
    );
    if (parents.length > 1)
      this.fail(
        node,
        "KRG2104",
        "Choose one scripted GUI parent: token, window name, or scripted GUI.",
      );
    if (guiContext === "decision_category" && parents.length)
      this.fail(
        node,
        "KRG2105",
        "Decision-category GUIs are attached through the category and cannot specify a parent window.",
      );
    const items: pdx.PdxItem[] = [];
    for (const [key, native] of Object.entries(scalar))
      if (spec[key] !== undefined)
        items.push(
          pdx.property(
            native,
            ["windowName", "parentWindowName", "parentScriptedGui"].includes(key)
              ? pdx.string(this.string(spec[key], node))
              : this.toPdx(spec[key], node, context),
          ),
        );
    for (const [key, native, callbackScope] of [
      ["visible", "visible", scope],
      ["aiEnabled", "ai_enabled", "country"],
      ["aiCheck", "ai_check", "country"],
      ["aiCheckScope", "ai_check_scope", scope],
    ])
      if (spec[key] !== undefined)
        items.push(
          pdx.property(
            native,
            pdx.block(this.callback(spec[key], callbackScope, "trigger", node, context)),
          ),
        );
    const eventCallbacks = (
      value: Value,
      mode: "effect" | "trigger",
      callbackScope = scope,
    ): pdx.PdxItem[] =>
      Object.entries(this.object(value, node)).map(([event, callback]) => {
        if (!(mode === "effect" ? /_click$/ : /_(?:visible|click_enabled)$/).test(event))
          this.fail(node, "KRG2106", `Scripted GUI ${mode} '${event}' has no native event suffix.`);
        return pdx.property(
          event,
          pdx.block(this.callback(callback, callbackScope, mode, node, context)),
        );
      });
    const effects = spec.effects === undefined ? [] : eventCallbacks(spec.effects, "effect");
    const triggers = spec.triggers === undefined ? [] : eventCallbacks(spec.triggers, "trigger");
    if (spec.properties !== undefined) {
      const properties = Object.entries(this.object(spec.properties, node)).map(
        ([element, value]) => {
          const property = this.object(value, node);
          this.checkKeys(property, ["image", "frame", "x", "y"], node, "Scripted GUI property");
          return pdx.property(
            element,
            pdx.block(
              Object.entries(property)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) =>
                  pdx.property(
                    key,
                    key === "image"
                      ? pdx.string(this.string(value, node))
                      : this.toPdx(value, node, context),
                  ),
                ),
            ),
          );
        },
      );
      items.push(pdx.property("properties", pdx.block(properties)));
    }
    const aiWeights = (value: Value, callbackScope = scope): pdx.PdxBlock =>
      pdx.block(
        Object.entries(this.object(value, node)).map(([event, weight]) => {
          if (!/_click$/.test(event))
            this.fail(node, "KRG2106", `Scripted GUI AI action '${event}' must end in _click.`);
          const specification = this.object(weight, node);
          this.checkKeys(specification, ["aiWillDo", "ignoreLowerWeights"], node, "GUI AI weight");
          const fields: pdx.PdxItem[] = [
            pdx.property(
              "ai_will_do",
              this.weight(specification.aiWillDo, callbackScope, node, context),
            ),
          ];
          if (specification.ignoreLowerWeights !== undefined)
            fields.push(
              pdx.property(
                "ignore_lower_weights",
                this.weight(specification.ignoreLowerWeights, callbackScope, node, context),
              ),
            );
          return pdx.property(event, pdx.block(fields));
        }),
      );
    if (spec.aiWeights !== undefined)
      items.push(pdx.property("ai_weights", aiWeights(spec.aiWeights)));
    for (const target of this.array(spec.aiTestScopes ?? [], node))
      items.push(pdx.property("ai_test_scopes", this.toPdx(target, node, context)));
    if (spec.dynamicLists !== undefined) {
      const lists = Object.entries(this.object(spec.dynamicLists, node)).map(([element, value]) => {
        const list = this.object(value, node);
        const mapping: Record<string, string> = {
          array: "array",
          index: "index",
          value: "value",
          changeScope: "change_scope",
          entryContainer: "entry_container",
          countryScopeEntryContainer: "country_scope_entry_container",
        };
        this.checkKeys(
          list,
          [...Object.keys(mapping), "aiWeights", "effects", "triggers", "entryScope"],
          node,
          "GUI dynamic list",
        );
        if (list.changeScope === true)
          this.fail(
            node,
            "KRG2107",
            "Scope-changing dynamic lists require an explicitly scoped entry declaration.",
          );
        if ((list.entryContainer !== undefined) === (list.countryScopeEntryContainer !== undefined))
          this.fail(node, "KRG2108", "A dynamic list requires exactly one entry container.");
        const fields = Object.entries(mapping)
          .filter(([key]) => list[key] !== undefined)
          .map(([key, native]) =>
            pdx.property(
              native,
              key.endsWith("Container")
                ? pdx.string(this.string(list[key], node))
                : this.toPdx(list[key], node, context),
            ),
          );
        const entryScope =
          list.entryScope === undefined ? scope : this.string(list.entryScope, node);
        if (list.entryScope !== undefined)
          fields.push(pdx.property("change_scope", pdx.atom("yes")));
        if (list.effects !== undefined)
          effects.push(...eventCallbacks(list.effects, "effect", entryScope));
        if (list.triggers !== undefined)
          triggers.push(...eventCallbacks(list.triggers, "trigger", entryScope));
        if (list.aiWeights !== undefined)
          fields.push(pdx.property("ai_weights", aiWeights(list.aiWeights, entryScope)));
        return pdx.property(element, pdx.block(fields));
      });
      items.push(pdx.property("dynamic_lists", pdx.block(lists)));
    }
    for (const [key, callbacks] of [
      ["effects", effects],
      ["triggers", triggers],
    ] as const) {
      const names = new Set<string>();
      for (const callback of callbacks) {
        if (callback.kind !== "property") continue;
        if (names.has(callback.key.text))
          this.fail(
            node,
            "KRG2110",
            `Scripted GUI '${name}' repeats ${key} handler '${callback.key.text}'.`,
          );
        names.add(callback.key.text);
      }
      if (callbacks.length) items.push(pdx.property(key, pdx.block(callbacks)));
    }
    if (spec.mapiconTargets !== undefined) {
      if (!guiContext.endsWith("mapicon"))
        this.fail(
          node,
          "KRG2109",
          "mapiconTargets requires a country_mapicon or state_mapicon context.",
        );
      const targets = this.object(spec.mapiconTargets, node);
      this.checkKeys(targets, ["targetArray", "targetTrigger"], node, "Map icon targets");
      const fields: pdx.PdxItem[] = [];
      if (targets.targetArray !== undefined)
        fields.push(pdx.property("target_array", this.toPdx(targets.targetArray, node, context)));
      if (targets.targetTrigger !== undefined)
        fields.push(
          pdx.property(
            "target_trigger",
            pdx.block(this.callback(targets.targetTrigger, scope, "trigger", node, context)),
          ),
        );
      items.push(pdx.property("mapicon_targets", pdx.block(fields)));
    }
    return [
      this.output(
        `common/scripted_guis/krieg_${safeId(name)}.txt`,
        pdx.document([
          pdx.property("scripted_gui", pdx.block([pdx.property(name, pdx.block(items))])),
        ]),
        node,
      ),
    ];
  }
}
