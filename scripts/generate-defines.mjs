#!/usr/bin/env node
/** Extract identifier/type facts from native Lua; never evaluate source or copy defaults. */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import luaparse from "luaparse";

const mode = process.argv[2];
const directory = path.resolve(import.meta.dirname, "../src");
const schemaFile = path.join(directory, "schema/hoi4-defines.json");
if (!mode)
  throw new Error(
    "Usage: node scripts/generate-defines.mjs <native defines directory> | --from-schema | --check",
  );
function union(values) {
  const variants = [
    ...new Map(
      values
        .flatMap((value) => (value.kind === "union" ? value.variants : [value]))
        .map((value) => [JSON.stringify(value), value]),
    ).values(),
  ];
  return variants.length === 1 ? variants[0] : { kind: "union", variants };
}
function valueType(node) {
  if (
    node.type === "NumericLiteral" ||
    node.type === "UnaryExpression" ||
    node.type === "BinaryExpression"
  )
    return { kind: "number" };
  if (node.type === "StringLiteral") return { kind: "string" };
  if (node.type === "BooleanLiteral") return { kind: "boolean" };
  if (
    node.type === "TableConstructorExpression" &&
    node.fields.every((field) => field.type === "TableValue")
  )
    return {
      kind: "array",
      element: node.fields.length
        ? union(node.fields.map((field) => valueType(field.value)))
        : union([{ kind: "number" }, { kind: "string" }, { kind: "boolean" }]),
    };
  return { kind: "unsupported" };
}
let schema;
if (mode === "--from-schema" || mode === "--check")
  schema = JSON.parse(fs.readFileSync(schemaFile, "utf8"));
else {
  const roots = {},
    omitted = [];
  const sources = fs
    .readdirSync(mode)
    .filter((name) => name.endsWith(".lua"))
    .sort()
    .map((name) => ({ name, text: fs.readFileSync(path.join(mode, name), "utf8") }));
  for (const source of sources) {
    const ast = luaparse.parse(source.text, { luaVersion: "5.1" });
    for (const statement of ast.body) {
      if (statement.type !== "AssignmentStatement") continue;
      statement.variables.forEach((variable, index) => {
        const table = statement.init[index];
        if (
          variable.type !== "Identifier" ||
          !/^NDefines(?:_[A-Za-z]+)?$/.test(variable.name) ||
          table?.type !== "TableConstructorExpression"
        )
          return;
        const namespaces = (roots[variable.name] ??= {});
        for (const namespace of table.fields) {
          if (
            namespace.type !== "TableKeyString" ||
            namespace.value.type !== "TableConstructorExpression"
          )
            continue;
          const entries = (namespaces[namespace.key.name] ??= {});
          for (const entry of namespace.value.fields) {
            if (entry.type !== "TableKeyString") continue;
            const type = valueType(entry.value);
            if (type.kind === "unsupported")
              omitted.push(`${variable.name}.${namespace.key.name}.${entry.key.name}`);
            else entries[entry.key.name] = type;
          }
        }
      });
    }
  }
  schema = {
    formatVersion: 1,
    provenance: {
      source:
        "User-supplied HOI4 native Lua; identifier and value-type facts only; defaults and comments excluded",
      sha256: createHash("sha256")
        .update(sources.map((source) => source.name + "\n" + source.text).join("\n"))
        .digest("hex"),
      files: sources.map((source) => source.name),
    },
    roots,
    omitted,
  };
  fs.writeFileSync(schemaFile, JSON.stringify(schema, null, 2) + "\n");
}
function tsType(type) {
  return type.kind === "array"
    ? `readonly (${tsType(type.element)})[]`
    : type.kind === "union"
      ? type.variants.map(tsType).join(" | ")
      : type.kind === "unsupported"
        ? "never"
        : type.kind;
}
const declarations = [
  "/** Generated native Lua identifier/type facts. No game default values are included. */",
  "import type { Definition } from './index.js';",
  "export interface DefineOverrides {",
];
for (const [root, namespaces] of Object.entries(schema.roots)) {
  declarations.push(`  ${JSON.stringify(root)}?: {`);
  for (const [namespace, fields] of Object.entries(namespaces)) {
    declarations.push(`    ${JSON.stringify(namespace)}?: {`);
    for (const [name, type] of Object.entries(fields))
      declarations.push(`      ${JSON.stringify(name)}?: ${tsType(type)};`);
    declarations.push("    };");
  }
  declarations.push("  };");
}
declarations.push(
  "}",
  "export declare function Defines(name: string, overrides: DefineOverrides): Definition;",
  "export declare function DefineFile(path: string, overrides: DefineOverrides): Definition;",
);
const result = declarations.join("\n") + "\n";
const target = path.join(directory, "sdk/defines.ts");
if (mode === "--check") {
  if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== result) {
    console.error("Generated file is stale: src/sdk/defines.ts");
    process.exitCode = 1;
  }
} else fs.writeFileSync(target, result);
console.log(
  JSON.stringify({
    roots: Object.keys(schema.roots),
    keys: Object.values(schema.roots)
      .flatMap((namespaces) => Object.values(namespaces))
      .reduce((sum, fields) => sum + Object.keys(fields).length, 0),
    omitted: schema.omitted,
  }),
);
