import ts from "typescript";
import { parser } from "typescript-eslint";
import type { ESLint, Linter, Rule, SourceCode } from "eslint";

const sourceFiles = new WeakMap<SourceCode, ts.SourceFile>();

function sourceFile(context: Rule.RuleContext): ts.SourceFile {
  const source = context.sourceCode;
  let file = sourceFiles.get(source);
  if (!file) {
    file = ts.createSourceFile(context.filename, source.text, ts.ScriptTarget.Latest, true);
    sourceFiles.set(source, file);
  }
  return file;
}

function walk(node: ts.Node, visitor: (node: ts.Node) => void): void {
  visitor(node);
  ts.forEachChild(node, (child) => walk(child, visitor));
}

function report(
  context: Rule.RuleContext,
  file: ts.SourceFile,
  node: ts.Node,
  messageId: string,
  data?: Record<string, string>,
): void {
  const start = file.getLineAndCharacterOfPosition(node.getStart(file));
  const end = file.getLineAndCharacterOfPosition(node.getEnd());
  context.report({
    loc: {
      start: { line: start.line + 1, column: start.character },
      end: { line: end.line + 1, column: end.character },
    },
    messageId,
    data,
  });
}

const noAny: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Keep Krieg source inside the statically typed language subset",
      url: "https://maxmixalex.github.io/krieg-lang/editor/#eslint",
    },
    schema: [],
    messages: {
      noAny: "Krieg does not support 'any'. Use the concrete SDK type or a typed record.",
    },
  },
  create(context) {
    return {
      Program() {
        const file = sourceFile(context);
        walk(file, (node) => {
          if (node.kind === ts.SyntaxKind.AnyKeyword) report(context, file, node, "noAny");
        });
      },
    };
  },
};

function isAllowedImport(value: string, packages: readonly string[]): boolean {
  if (value === "krieg-lang/hoi4" || value === "krieg-lang/pdx") return true;
  if (["@project/countries", "@project/states", "@project/assets"].includes(value)) return true;
  if (value.startsWith("./") || value.startsWith("../")) {
    return !/\.(?:[cm]?js|[cm]?ts|json)$/.test(value) || /\.krg\.(?:js|ts)$/.test(value);
  }
  return packages.some((name) => value === name || value.startsWith(`${name}/`));
}

const allowedImports: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Import SDK declarations, generated project references, relative sources, or allowed Krieg packages",
      url: "https://maxmixalex.github.io/krieg-lang/editor/#eslint",
    },
    schema: [
      {
        type: "object",
        properties: {
          packages: { type: "array", items: { type: "string", minLength: 1 }, uniqueItems: true },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      import:
        "'{{module}}' is not an allowed Krieg source import. Use the SDK, a relative source module, or configure an opted-in Krieg package.",
      equals:
        "Use an ES module named import in Krieg source; import-equals and require are not supported.",
    },
  },
  create(context) {
    const option = context.options[0] as { packages?: string[] } | undefined;
    const packages = option?.packages ?? [];
    return {
      Program() {
        const file = sourceFile(context);
        walk(file, (node) => {
          if (ts.isImportEqualsDeclaration(node)) {
            report(context, file, node, "equals");
            return;
          }
          if (!ts.isImportDeclaration(node) && !ts.isExportDeclaration(node)) return;
          const specifier = node.moduleSpecifier;
          if (!specifier || !ts.isStringLiteral(specifier)) return;
          if (!isAllowedImport(specifier.text, packages)) {
            report(context, file, specifier, "import", { module: specifier.text });
          }
        });
      },
    };
  },
};

const unsupportedKinds = new Map<ts.SyntaxKind, string>([
  [ts.SyntaxKind.ClassDeclaration, "classes"],
  [ts.SyntaxKind.ClassExpression, "classes"],
  [ts.SyntaxKind.NewExpression, "new expressions"],
  [ts.SyntaxKind.AwaitExpression, "await"],
  [ts.SyntaxKind.YieldExpression, "yield"],
  [ts.SyntaxKind.WhileStatement, "while loops"],
  [ts.SyntaxKind.DoStatement, "do/while loops"],
  [ts.SyntaxKind.ForStatement, "C-style for loops"],
  [ts.SyntaxKind.ForInStatement, "for/in loops"],
  [ts.SyntaxKind.TryStatement, "try/catch"],
  [ts.SyntaxKind.ThrowStatement, "throw"],
  [ts.SyntaxKind.SwitchStatement, "switch"],
  [ts.SyntaxKind.WithStatement, "with"],
  [ts.SyntaxKind.DeleteExpression, "delete"],
  [ts.SyntaxKind.ThisKeyword, "this"],
  [ts.SyntaxKind.SuperKeyword, "super"],
  [ts.SyntaxKind.RegularExpressionLiteral, "regular expressions"],
  [ts.SyntaxKind.EnumDeclaration, "enums"],
  [ts.SyntaxKind.ModuleDeclaration, "namespaces"],
  [ts.SyntaxKind.NonNullExpression, "non-null assertions"],
]);

const runtimeGlobals = new Set([
  "eval",
  "require",
  "fetch",
  "setTimeout",
  "setInterval",
  "queueMicrotask",
  "Function",
  "Date",
  "Promise",
  "Math",
  "JSON",
  "Object",
  "Array",
  "Reflect",
  "Buffer",
  "console",
  "process",
  "globalThis",
  "window",
  "document",
]);

function rootIdentifier(expression: ts.Expression): ts.Identifier | undefined {
  if (ts.isIdentifier(expression)) return expression;
  if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
    return rootIdentifier(expression.expression);
  }
  return undefined;
}

const supportedSyntax: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Reject JavaScript runtime features outside the Krieg language subset",
      url: "https://maxmixalex.github.io/krieg-lang/language/",
    },
    schema: [],
    messages: {
      unsupported:
        "Krieg does not support {{feature}}. Source is lowered statically to Paradox script.",
      async: "Krieg functions cannot be async or generators.",
      runtime: "'{{name}}' is a JavaScript runtime API and cannot be used in Krieg source.",
      mutableLoop:
        "A Krieg for/of loop must bind a const identifier and iterate a compile-time constant array.",
      variable: "Use const or a typed let declaration; var is outside the Krieg language subset.",
      typeSuppression: "TypeScript error-suppression directives are not allowed in Krieg source.",
    },
  },
  create(context) {
    return {
      Program() {
        const file = sourceFile(context);
        for (const comment of context.sourceCode.getAllComments()) {
          if (/@ts-(?:nocheck|ignore|expect-error)\b/.test(comment.value) && comment.loc) {
            context.report({ loc: comment.loc, messageId: "typeSuppression" });
          }
        }
        walk(file, (node) => {
          const feature = unsupportedKinds.get(node.kind);
          if (feature) report(context, file, node, "unsupported", { feature });
          if (
            (ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) &&
            !(
              ts.isTypeReferenceNode(node.type) &&
              ts.isIdentifier(node.type.typeName) &&
              node.type.typeName.text === "const"
            )
          ) {
            report(context, file, node, "unsupported", {
              feature: "type assertions other than as const",
            });
          }
          if (
            ts.isFunctionDeclaration(node) ||
            ts.isFunctionExpression(node) ||
            ts.isArrowFunction(node)
          ) {
            if (
              node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword) ||
              ("asteriskToken" in node && node.asteriskToken)
            ) {
              report(context, file, node, "async");
            }
          }
          if (ts.isCallExpression(node)) {
            if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
              report(context, file, node, "unsupported", { feature: "dynamic imports" });
            }
            const root = rootIdentifier(node.expression);
            if (root && runtimeGlobals.has(root.text))
              report(context, file, root, "runtime", { name: root.text });
          }
          if (
            ts.isVariableDeclarationList(node) &&
            !(node.flags & (ts.NodeFlags.Const | ts.NodeFlags.Let))
          ) {
            report(context, file, node, "variable");
          }
          if (ts.isForOfStatement(node)) {
            if (node.awaitModifier)
              report(context, file, node, "unsupported", { feature: "for await" });
            const declaration = ts.isVariableDeclarationList(node.initializer)
              ? node.initializer.declarations[0]
              : undefined;
            if (
              !ts.isVariableDeclarationList(node.initializer) ||
              !(node.initializer.flags & ts.NodeFlags.Const) ||
              !declaration ||
              !ts.isIdentifier(declaration.name)
            ) {
              report(context, file, node.initializer, "mutableLoop");
            }
          }
        });
      },
    };
  },
};

const explicitParameters: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Make callback scope and helper argument types explicit",
      url: "https://maxmixalex.github.io/krieg-lang/scopes/",
    },
    schema: [],
    messages: {
      annotation: "Annotate this Krieg parameter explicitly, for example (country: CountryScope).",
    },
  },
  create(context) {
    return {
      Program() {
        const file = sourceFile(context);
        walk(file, (node) => {
          if (
            ts.isParameter(node) &&
            !node.type &&
            (ts.isFunctionDeclaration(node.parent) ||
              ts.isFunctionExpression(node.parent) ||
              ts.isArrowFunction(node.parent))
          ) {
            report(context, file, node, "annotation");
          }
        });
      },
    };
  },
};

/** ESLint flat-config plugin. The compiler remains the final semantic authority. */
const plugin: ESLint.Plugin & { configs: { recommended: Linter.Config } } = {
  meta: { name: "krieg-lang", version: "0.1.0" },
  rules: {
    "no-any": noAny,
    "allowed-imports": allowedImports,
    "supported-syntax": supportedSyntax,
    "explicit-parameters": explicitParameters,
  },
  configs: { recommended: {} },
};

plugin.configs.recommended = {
  name: "krieg/recommended",
  files: ["**/*.krg.ts"],
  languageOptions: {
    parser,
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: { krieg: plugin },
  rules: {
    "krieg/no-any": "error",
    "krieg/allowed-imports": "error",
    "krieg/supported-syntax": "error",
    "krieg/explicit-parameters": "error",
  },
};

export default plugin;
export const configs = plugin.configs;
export const rules = plugin.rules;
