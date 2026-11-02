import { existsSync, lstatSync, readdirSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

export const slash = (path: string): string => path.replaceAll("\\", "/");

export function inside(root: string, path: string): boolean {
  const rel = relative(resolve(root), resolve(path));
  return rel === "" || (!rel.startsWith(`..${sep}`) && rel !== ".." && !isAbsolute(rel));
}

/** Relative game paths must be portable across Windows and Unix. */
export function gamePath(path: string, allowEmpty = false): string {
  if (typeof path !== "string") throw new Error("A path must be a string.");
  const value = slash(path).replace(/\/$/, "");
  if (allowEmpty && (value === "" || value === ".")) return "";
  if (
    !value ||
    /[\0-\x1f<>:"|?*]/.test(value) ||
    value.startsWith("/") ||
    value.split("/").some((part) => part === ".." || part === "." || part === "")
  ) {
    throw new Error(`Unsafe or nonportable relative path: ${JSON.stringify(path)}`);
  }
  if (
    value
      .split("/")
      .some(
        (part) =>
          /[ .]$/.test(part) || /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part),
      )
  )
    throw new Error(`Path is reserved or not portable on Windows: ${JSON.stringify(path)}`);
  return value;
}

/** Reject ancestor symlinks too: lexical containment alone is not sufficient. */
export function safeChild(root: string, path: string): string {
  const result = resolve(root, gamePath(path));
  if (!inside(root, result)) throw new Error(`Path escapes project: ${path}`);
  let probe = result;
  while (!existsSync(probe) && dirname(probe) !== probe) probe = dirname(probe);
  const realRoot = realpathSync(root);
  if (!inside(realRoot, realpathSync(probe))) throw new Error(`Symlink escapes project: ${path}`);
  return result;
}

/** Deterministic enumeration; symlinks are rejected, never followed silently. */
export function walkFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  const rootStat = lstatSync(root);
  if (rootStat.isSymbolicLink()) throw new Error(`Symlink input is not supported: ${root}`);
  if (rootStat.isFile()) return [root];
  const files: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name, "en"),
  )) {
    const path = resolve(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink input is not supported: ${path}`);
    if (entry.isDirectory()) files.push(...walkFiles(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}
