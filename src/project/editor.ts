import { mkdirSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MINIMAL_LIB } from "../compiler/minimal-lib.js";
import { loadConfig } from "./config.js";
import { resolveDependencies } from "./dependencies.js";
import { collectAssets } from "./assets.js";
import { createWorld } from "./world.js";
import { safeChild, slash } from "./files.js";
import type { ProjectOptions } from "./types.js";
import type { ProjectWorld } from "./world.js";

export function writeEditorProject(project = ".", options: ProjectOptions = {}): ProjectWorld {
  const config = loadConfig(project, options);
  const graph = resolveDependencies(config);
  const layers = graph.layers.map(({ config: layer }) => ({
    config: layer,
    files: collectAssets(layer),
  }));
  const world = createWorld(config, layers);
  const generated = safeChild(config.rootDir, ".krieg");
  const types = resolve(generated, "types");
  mkdirSync(types, { recursive: true });
  for (const [name, contents] of Object.entries(world.virtualModules))
    writeFileSync(resolve(types, name.slice("@project/".length) + ".d.ts"), contents);
  writeFileSync(resolve(types, "lib.d.ts"), MINIMAL_LIB);
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
  for (const [name, path] of Object.entries(graph.moduleFiles))
    paths[name] = [slash(relative(generated, path))];
  writeFileSync(
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
          noEmit: true,
          skipLibCheck: false,
          paths,
          allowImportingTsExtensions: true,
          forceConsistentCasingInFileNames: true,
        },
        files: ["./types/lib.d.ts"],
      },
      null,
      2,
    ) + "\n",
  );
  return world;
}
