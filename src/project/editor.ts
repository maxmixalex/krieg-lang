import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MINIMAL_LIB } from "../compiler/minimal-lib.js";
import { loadConfig } from "./config.js";
import { resolveDependencies, type DependencyGraph } from "./dependencies.js";
import { collectAssets } from "./assets.js";
import { localisationFiles } from "./localisation.js";
import { createWorld } from "./world.js";
import { safeChild, slash } from "./files.js";
import type { KriegConfig, ProjectOptions } from "./types.js";
import type { ProjectWorld } from "./world.js";
import { writeStyleDeclarations } from "./style-editor.js";

// Keeping mtimes stable lets TypeScript reuse unchanged declaration files while Krieg watches a project.
function writeChanged(path: string, contents: string): void {
  if (!existsSync(path) || readFileSync(path, "utf8") !== contents) writeFileSync(path, contents);
}

/** Refresh the declarations and tsconfig used by the author's TypeScript editor. Uses the same layer order as a build, including translations from source-package dependencies. Unchanged files keep their modification times. */
export function writeEditorProject(project = ".", options: ProjectOptions = {}): ProjectWorld {
  const config = loadConfig(project, options);
  const graph = resolveDependencies(config);
  const layers = graph.layers.map(({ config: layer }) => ({
    config: layer,
    files: [...collectAssets(layer), ...localisationFiles(layer)],
  }));
  const world = createWorld(config, layers);
  writeEditorDeclarations(config, graph, world);
  return world;
}

/** Internal: write the same world and source-package resolution that the build actually uses. */
export function writeEditorDeclarations(
  config: KriegConfig,
  graph: DependencyGraph,
  world: ProjectWorld,
): void {
  const generated = safeChild(config.rootDir, ".krieg");
  const types = resolve(generated, "types");
  mkdirSync(types, { recursive: true });
  const styles = writeStyleDeclarations(generated, graph);
  world.diagnostics.push(...styles.diagnostics);
  for (const [name, contents] of Object.entries(world.virtualModules))
    writeChanged(resolve(types, name.slice("@project/".length) + ".d.ts"), contents);
  writeChanged(resolve(types, "lib.d.ts"), MINIMAL_LIB);
  const paths: Record<string, string[]> = {
    "@project/*": ["./types/*.d.ts"],
    "krieg-lang/hoi4": [
      slash(relative(generated, fileURLToPath(new URL("../sdk/index.d.ts", import.meta.url)))),
    ],
    "krieg-lang/ui": [
      slash(relative(generated, fileURLToPath(new URL("../ui/index.d.ts", import.meta.url)))),
    ],
    "krieg-lang/ui/jsx-runtime": [
      slash(relative(generated, fileURLToPath(new URL("../ui/jsx-runtime.d.ts", import.meta.url)))),
    ],
    "krieg-lang/pdx": [
      slash(relative(generated, fileURLToPath(new URL("../pdx/index.d.ts", import.meta.url)))),
    ],
  };
  for (const [name, path] of Object.entries(graph.moduleFiles)) {
    const target = slash(relative(generated, styles.declarations.get(path) ?? path));
    paths[name] = [target.startsWith(".") ? target : `./${target}`];
  }
  writeChanged(
    resolve(generated, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES5",
          module: "ESNext",
          jsx: "preserve",
          jsxImportSource: "krieg-lang/ui",
          moduleResolution: "Bundler",
          noLib: true,
          types: [],
          strict: true,
          exactOptionalPropertyTypes: true,
          noEmit: true,
          skipLibCheck: false,
          paths,
          allowImportingTsExtensions: true,
          allowArbitraryExtensions: true,
          rootDirs: styles.rootDirs,
          forceConsistentCasingInFileNames: true,
        },
        files: ["./types/lib.d.ts"],
      },
      null,
      2,
    ) + "\n",
  );
}
