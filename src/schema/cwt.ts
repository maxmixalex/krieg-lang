import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import type { CwtSchema, CwtValueRule, CwtCommandRule, CwtFieldRule } from "./types.js";
export type * from "./types.js";

interface Token {
  text: string;
  line: number;
  comments: string[];
}
interface Node {
  key: string;
  value: string | Node[];
  line: number;
  comments: string[];
}
/** CWT is a schema dialect: angle and square brackets belong inside tokens. */
function tokens(text: string): Token[] {
  const out: Token[] = [];
  let i = 0,
    line = 1,
    comments: string[] = [];
  while (i < text.length) {
    const c = text[i]!;
    if (/\s|\uFEFF/.test(c)) {
      if (c === "\n") line++;
      i++;
      continue;
    }
    if (c === "#") {
      const start = i;
      while (i < text.length && text[i] !== "\n") i++;
      comments.push(text.slice(start, i).trim());
      continue;
    }
    const start = i,
      startLine = line;
    if (c === "{" || c === "}" || c === "=") i++;
    else if (c === '"') {
      i++;
      while (i < text.length) {
        const ch = text[i++]!;
        if (ch === "\n") line++;
        if (ch === "\\" && i < text.length) {
          if (text[i] === "\n") line++;
          i++;
        } else if (ch === '"') break;
      }
    } else {
      let brackets = 0;
      while (i < text.length) {
        const ch = text[i]!;
        if (brackets === 0 && /[\s{}=#]/.test(ch)) break;
        if (ch === "[") brackets++;
        if (ch === "]") brackets--;
        if (ch === "\n") line++;
        i++;
      }
    }
    out.push({ text: text.slice(start, i), line: startLine, comments });
    comments = [];
  }
  return out;
}
function parseRules(text: string, source: string, diagnostics: CwtSchema["diagnostics"]): Node[] {
  const ts = tokens(text);
  let i = 0;
  function body(nested: boolean): Node[] {
    const nodes: Node[] = [];
    while (i < ts.length) {
      const t = ts[i++]!;
      if (t.text === "}") {
        if (!nested)
          diagnostics.push({ source, line: t.line, message: "Unexpected closing brace in CWT" });
        return nodes;
      }
      if (t.text === "{") {
        nodes.push({ key: "", value: body(true), line: t.line, comments: t.comments });
        continue;
      }
      if (t.text === "=") {
        diagnostics.push({ source, line: t.line, message: `Unexpected ${t.text} in CWT` });
        continue;
      }
      if (ts[i]?.text !== "=") {
        nodes.push({ key: "", value: t.text, line: t.line, comments: t.comments });
        continue;
      }
      i++;
      const v = ts[i++];
      if (!v || v.text === "}") {
        diagnostics.push({ source, line: t.line, message: `Missing value for ${t.text}` });
        continue;
      }
      nodes.push({
        key: t.text,
        value: v.text === "{" ? body(true) : v.text,
        line: t.line,
        comments: t.comments,
      });
    }
    if (nested)
      diagnostics.push({
        source,
        line: ts[ts.length - 1]?.line ?? 1,
        message: "Unclosed CWT block",
      });
    return nodes;
  }
  return body(false);
}
function annotation(comments: string[], name: string): string | undefined {
  const re = new RegExp(`^##\\s*${name}\\s*=\\s*(.*?)\\s*$`);
  for (const comment of comments) {
    const match = re.exec(comment);
    if (match) return match[1];
  }
  return undefined;
}
function description(comments: string[]): string | undefined {
  const value = comments
    .filter((c) => c.startsWith("###"))
    .map((c) => c.replace(/^###\s*/, ""))
    .join("\n");
  return value || undefined;
}
function valueOf(node: Node): CwtValueRule {
  if (typeof node.value === "string") return { type: "scalar", expression: node.value };
  return {
    type: "block",
    expression: "{...}",
    fields: node.value.map((n): CwtFieldRule => ({
      name: n.key,
      value: valueOf(n),
      ...(annotation(n.comments, "cardinality")
        ? { cardinality: annotation(n.comments, "cardinality") }
        : {}),
      ...(description(n.comments) ? { description: description(n.comments) } : {}),
    })),
  };
}
async function cwtFiles(root: string): Promise<string[]> {
  const result: string[] = [];
  for (const dirent of await readdir(root, { withFileTypes: true })) {
    const path = join(root, dirent.name);
    if (dirent.isDirectory()) result.push(...(await cwtFiles(path)));
    else if (dirent.isFile() && dirent.name.endsWith(".cwt")) result.push(path);
  }
  return result.sort();
}
/** Extract commands and nested argument shapes, retaining overloads and unsupported expressions. */
export async function extractCwtSchema(
  root: string,
  source = "CWTools HOI4 CWT rules",
): Promise<CwtSchema> {
  const files = await cwtFiles(root);
  const hash = createHash("sha256");
  const schema: CwtSchema = {
    formatVersion: 1,
    provenance: { source, sha256: "", files: files.length },
    commands: [],
    scopes: [],
    singleAliases: {},
    singleAliasOverloads: {},
    diagnostics: [],
  };
  const scopes = new Set<string>();
  for (const file of files) {
    const name = relative(root, file).replaceAll("\\", "/");
    const buffer = await readFile(file);
    hash.update(name).update("\0").update(buffer).update("\0");
    const nodes = parseRules(buffer.toString("utf8"), name, schema.diagnostics);
    for (const node of nodes) {
      const command = /^alias\[(effect|trigger):(.+)\]$/.exec(node.key);
      if (command) {
        const scopeText = annotation(node.comments, "scope") ?? "any";
        const commandScopes = scopeText.replace(/[{}]/g, "").trim().split(/\s+/).filter(Boolean);
        commandScopes.forEach((s) => scopes.add(s));
        const rule: CwtCommandRule = {
          name: command[2]!,
          kind: command[1] as "effect" | "trigger",
          scopes: commandScopes,
          value: valueOf(node),
          source: name,
          line: node.line,
        };
        const pushScope = annotation(node.comments, "push_scope");
        if (pushScope) rule.pushScope = pushScope;
        const desc = description(node.comments);
        if (desc) rule.description = desc;
        schema.commands.push(rule);
      }
      const single = /^single_alias\[(.+)\]$/.exec(node.key);
      if (single) {
        const value = valueOf(node);
        schema.singleAliases[single[1]!] = value;
        (schema.singleAliasOverloads![single[1]!] ??= []).push(value);
      }
      if (node.key === "scopes" && Array.isArray(node.value)) {
        for (const scope of node.value)
          if (Array.isArray(scope.value))
            for (const child of scope.value)
              if (child.key === "aliases" && Array.isArray(child.value))
                for (const alias of child.value)
                  if (typeof alias.value === "string")
                    scopes.add(alias.value.replace(/^"|"$/g, ""));
      }
    }
  }
  schema.scopes = [...scopes].sort();
  schema.provenance.sha256 = hash.digest("hex");
  return schema;
}
