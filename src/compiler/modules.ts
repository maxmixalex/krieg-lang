import path from "node:path";

/** Shared source resolution for the static compiler and generated editor project. */
export function relativeSourceModule(
  name: string,
  containingFile: string,
  exists: (file: string) => boolean,
): string | undefined {
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
  return candidates.find(exists);
}
