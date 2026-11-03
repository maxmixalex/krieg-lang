import { existsSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { loadConfig, readJson } from "./config.js";
import { safeChild } from "./files.js";
import type { KriegConfig, ProjectLayer } from "./types.js";

export interface DependencyGraph {
  layers: ProjectLayer[];
  moduleFiles: Record<string, string>;
}

function packageRoot(name: string, from: string): string {
  if (!/^(?:@[a-zA-Z0-9_.-]+\/)?[a-zA-Z0-9_.-]+$/.test(name))
    throw new Error(`Invalid npm package name ${name}. Install packages with npm first.`);
  let dir = from;
  for (;;) {
    const candidate = resolve(dir, "node_modules", name);
    if (existsSync(resolve(candidate, "package.json"))) return realpathSync(candidate);
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`Krieg dependency ${name} is not installed. Run npm install in ${from}.`);
}

export function resolveDependencies(config: KriegConfig): DependencyGraph {
  const layers: ProjectLayer[] = [];
  const moduleFiles: Record<string, string> = {};
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const versions = new Map<string, string>();
  function visit(current: KriegConfig, packageName?: string): void {
    const id = realpathSync(current.configPath);
    if (visiting.has(id)) throw new Error(`Cyclic Krieg project dependency at ${id}.`);
    if (visited.has(id)) return;
    visiting.add(id);
    const manifestPath = resolve(current.rootDir, "package.json");
    const manifest = existsSync(manifestPath) ? readJson(manifestPath) : {};
    const explicit = new Set(current.dependencies);
    const ordinary =
      manifest.dependencies && typeof manifest.dependencies === "object"
        ? Object.keys(manifest.dependencies)
        : [];
    const specs = [...explicit];
    // Ordinary npm dependencies opt in by carrying a krieg field.
    for (const name of ordinary.sort()) {
      if (explicit.has(name) || name === "krieg-lang") continue;
      const root = packageRoot(name, current.rootDir);
      if (readJson(resolve(root, "package.json")).krieg !== undefined) specs.push(name);
    }
    for (const spec of specs) {
      let dependency: KriegConfig;
      let dependencyName: string | undefined;
      if (spec.startsWith(".") || isAbsolute(spec)) {
        dependency = loadConfig(resolve(current.rootDir, spec));
        // A local source package exposes the same public imports as its npm installation.
        const manifest = resolve(dependency.rootDir, "package.json");
        if (existsSync(manifest)) {
          const pkg = readJson(manifest);
          const metadata = pkg.krieg;
          if (
            typeof pkg.name === "string" &&
            metadata &&
            typeof metadata === "object" &&
            !Array.isArray(metadata)
          ) {
            const entries = (metadata as Record<string, unknown>).exports;
            if (entries !== undefined) {
              if (!entries || typeof entries !== "object" || Array.isArray(entries))
                throw new Error(
                  `${pkg.name}.krieg.exports must map module paths to .krg.ts, .krg.tsx or .krg.css sources.`,
                );
              const packageDirectory = realpathSync(dependency.rootDir);
              const previous = versions.get(pkg.name);
              if (previous && previous !== packageDirectory)
                throw new Error(
                  `Two source copies of ${pkg.name} would share generated game symbols. Deduplicate or alias the package.`,
                );
              versions.set(pkg.name, packageDirectory);
              for (const [subpath, value] of Object.entries(entries)) {
                if (
                  typeof value !== "string" ||
                  !/\.krg\.(?:tsx?|css)$/.test(value) ||
                  (subpath !== "." && !subpath.startsWith("./"))
                )
                  throw new Error(`Invalid Krieg export ${pkg.name}/${subpath}.`);
                const name = subpath === "." ? pkg.name : pkg.name + subpath.slice(1);
                const file = realpathSync(safeChild(dependency.rootDir, value));
                if (moduleFiles[name] && moduleFiles[name] !== file)
                  throw new Error(`Two source packages expose the same Krieg import ${name}.`);
                moduleFiles[name] = file;
              }
              dependencyName = pkg.name;
            }
          }
        }
      } else {
        const root = packageRoot(spec, current.rootDir);
        const pkg = readJson(resolve(root, "package.json"));
        const previous = versions.get(spec);
        if (previous && previous !== root)
          throw new Error(
            `Two installed copies of ${spec} would share generated game symbols. Deduplicate or alias the package.`,
          );
        versions.set(spec, root);
        const krieg = pkg.krieg;
        if (krieg === undefined)
          throw new Error(
            `${spec} is a JavaScript package, not a Krieg package (missing package.json krieg field).`,
          );
        let configFile = "krgconfig.json";
        let exports: Record<string, unknown> = {};
        if (typeof krieg === "string") configFile = krieg;
        else if (krieg && typeof krieg === "object" && !Array.isArray(krieg)) {
          const data = krieg as Record<string, unknown>;
          if (data.config !== undefined && typeof data.config !== "string")
            throw new Error(`${spec}.krieg.config must be a path.`);
          configFile = (data.config as string) ?? configFile;
          if (data.exports !== undefined) {
            if (!data.exports || typeof data.exports !== "object" || Array.isArray(data.exports))
              throw new Error(
                `${spec}.krieg.exports must map module paths to .krg.ts, .krg.tsx or .krg.css sources.`,
              );
            exports = data.exports as Record<string, unknown>;
          }
        } else throw new Error(`Invalid krieg metadata in ${spec}.`);
        for (const [subpath, value] of Object.entries(exports)) {
          if (
            typeof value !== "string" ||
            !/\.krg\.(?:tsx?|css)$/.test(value) ||
            (subpath !== "." && !subpath.startsWith("./"))
          )
            throw new Error(`Invalid Krieg export ${spec}/${subpath}.`);
          moduleFiles[subpath === "." ? spec : spec + subpath.slice(1)] = safeChild(root, value);
        }
        dependency = loadConfig(safeChild(root, configFile));
        dependencyName = spec;
      }
      visit(dependency, dependencyName);
    }
    visiting.delete(id);
    visited.add(id);
    layers.push({ config: current, packageName });
  }
  visit(config);
  return { layers, moduleFiles };
}
