import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import ts from "typescript";
import { parseStyleModule } from "../compiler/styles.js";
import { relativeSourceModule } from "../compiler/modules.js";
import type { KriegDiagnostic } from "../compiler/types.js";
import { inside, safeChild, slash, walkFiles } from "./files.js";
import type { DependencyGraph } from "./dependencies.js";

/** Mirror only declarations into .krieg. Source packages can remain read-only. */
export function writeStyleDeclarations(
  generated: string,
  graph: DependencyGraph,
): { rootDirs: string[]; declarations: Map<string, string>; diagnostics: KriegDiagnostic[] } {
  const pending = graph.layers.flatMap(({ config }) =>
    walkFiles(safeChild(config.rootDir, config.sourceDir)).filter((file) =>
      /\.krg\.tsx?$/.test(file),
    ),
  );
  pending.push(...Object.values(graph.moduleFiles));
  const visited = new Set<string>();
  const styles = new Set<string>();
  while (pending.length) {
    const file = resolve(pending.pop()!);
    if (visited.has(file)) continue;
    visited.add(file);
    if (file.endsWith(".krg.css")) {
      styles.add(file);
      continue;
    }
    if (!/\.krg\.tsx?$/.test(file) || !existsSync(file)) continue;
    for (const imported of ts.preProcessFile(readFileSync(file, "utf8"), true, true)
      .importedFiles) {
      const target =
        graph.moduleFiles[imported.fileName] ??
        relativeSourceModule(imported.fileName, file, existsSync);
      if (target) pending.push(target);
    }
  }
  let common = dirname(generated);
  for (const file of styles) while (!inside(common, file)) common = dirname(common);
  const mirror = resolve(generated, "styles");
  mkdirSync(mirror, { recursive: true });
  const declarations = new Map<string, string>();
  const diagnostics: KriegDiagnostic[] = [];
  const written: string[] = [];
  for (const file of [...styles].sort()) {
    const style = parseStyleModule(readFileSync(file, "utf8"), file);
    diagnostics.push(...style.diagnostics);
    const declaration = safeChild(
      mirror,
      slash(relative(common, file)).replace(/\.css$/, ".d.css.ts"),
    );
    mkdirSync(dirname(declaration), { recursive: true });
    if (!existsSync(declaration) || readFileSync(declaration, "utf8") !== style.declaration)
      writeFileSync(declaration, style.declaration);
    declarations.set(file, declaration);
    written.push(slash(relative(mirror, declaration)));
  }
  const manifest = resolve(mirror, "manifest.json");
  const previous: unknown = existsSync(manifest) ? JSON.parse(readFileSync(manifest, "utf8")) : [];
  if (Array.isArray(previous))
    for (const entry of previous) {
      if (typeof entry === "string" && entry.endsWith(".d.css.ts") && !written.includes(entry))
        rmSync(safeChild(mirror, entry), { force: true });
    }
  const nextManifest = JSON.stringify(written, null, 2) + "\n";
  if (!existsSync(manifest) || readFileSync(manifest, "utf8") !== nextManifest)
    writeFileSync(manifest, nextManifest);
  return {
    rootDirs: [slash(relative(generated, common)) || ".", "./styles"],
    declarations,
    diagnostics,
  };
}
