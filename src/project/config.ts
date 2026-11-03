import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { gamePath, inside, safeChild } from "./files.js";
import type { KriegConfig, ProjectOptions } from "./types.js";
import { parseRailwayPlan } from "./atlas-railways.js";

export function readJson(path: string): Record<string, unknown> {
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(path, "utf8").replace(/^\uFEFF/, ""));
  } catch (error) {
    throw new Error(`Cannot read JSON ${path}: ${(error as Error).message}`);
  }
  return object(data, path);
}

function object(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${label} must be an object.`);
  return value as Record<string, unknown>;
}
function str(value: unknown, fallback: string, label: string): string {
  if (value === undefined) return fallback;
  if (typeof value !== "string" || !value.trim() || /[\0\r\n]/.test(value))
    throw new Error(`${label} must be a nonempty single-line string.`);
  return value;
}
function strings(value: unknown, label: string): string[] {
  if (value === undefined) return [];
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string" || !item || /[\0\r\n]/.test(item))
  )
    throw new Error(`${label} must be an array of strings.`);
  return value as string[];
}
function array(value: unknown, label: string): unknown[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
  return value;
}
function keys(value: Record<string, unknown>, allowed: string[], label: string): void {
  for (const key of Object.keys(value))
    if (!allowed.includes(key))
      throw new Error(`Unknown ${label} property ${JSON.stringify(key)}.`);
}

export function loadConfig(path = ".", options: ProjectOptions = {}): KriegConfig {
  const absolute = resolve(path);
  const configPath =
    existsSync(absolute) && statSync(absolute).isFile()
      ? absolute
      : resolve(absolute, "krgconfig.json");
  const data = readJson(configPath);
  keys(
    data,
    [
      "$schema",
      "name",
      "sourceDir",
      "outDir",
      "mod",
      "dependencies",
      "assets",
      "localisation",
      "gameRoots",
      "world",
      "strictAssets",
      "railways",
    ],
    "configuration",
  );
  const rootDir = dirname(configPath);
  const name = str(data.name, basename(rootDir), "name");
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(name))
    throw new Error("name must contain only letters, numbers, underscores and hyphens.");
  gamePath(`${name}.mod`);
  const mod = object(data.mod ?? {}, "mod");
  keys(
    mod,
    [
      "name",
      "version",
      "supportedVersion",
      "tags",
      "replacePath",
      "dependencies",
      "picture",
      "userDir",
    ],
    "mod",
  );
  const world = object(data.world ?? {}, "world");
  keys(world, ["countries", "states"], "world");
  const countryTags = strings(world.countries, "world.countries");
  if (countryTags.some((tag) => !/^[A-Z][A-Z0-9]{2}$/.test(tag)))
    throw new Error(
      "Country tags must have three uppercase letters/digits and start with a letter.",
    );
  const states = array(world.states, "world.states");
  if (states.some((id) => typeof id !== "number" || !Number.isSafeInteger(id) || id <= 0))
    throw new Error("State IDs must be positive safe integers.");
  if (data.strictAssets !== undefined && typeof data.strictAssets !== "boolean")
    throw new Error("strictAssets must be boolean.");
  const sourceDir = gamePath(str(data.sourceDir, "src", "sourceDir"));
  const outDir = gamePath(str(data.outDir, "build/mod", "outDir"));
  if (
    inside(resolve(rootDir, outDir), resolve(rootDir, sourceDir)) ||
    inside(resolve(rootDir, sourceDir), resolve(rootDir, outDir))
  )
    throw new Error("outDir and sourceDir must be separate directories.");
  if (outDir.split("/").some((p) => ["node_modules", ".git", ".krieg"].includes(p)))
    throw new Error("outDir cannot be inside a managed package or metadata directory.");
  const config: KriegConfig = {
    name,
    rootDir,
    configPath,
    sourceDir,
    outDir,
    mod: {
      name: str(mod.name, name, "mod.name"),
      version: str(mod.version, "0.1.0", "mod.version"),
      supportedVersion: str(mod.supportedVersion, "1.19.*", "mod.supportedVersion"),
      tags: strings(mod.tags, "mod.tags"),
      replacePath: strings(mod.replacePath, "mod.replacePath").map((p) => gamePath(p)),
      dependencies: strings(mod.dependencies, "mod.dependencies"),
      ...(mod.picture === undefined
        ? {}
        : { picture: gamePath(str(mod.picture, "", "mod.picture")) }),
      ...(mod.userDir === undefined ? {} : { userDir: str(mod.userDir, "", "mod.userDir") }),
    },
    dependencies: strings(data.dependencies, "dependencies"),
    assets: array(data.assets, "assets").map((value, i) => {
      const rule = object(value, `assets[${i}]`);
      keys(rule, ["from", "to", "override"], `assets[${i}]`);
      if (rule.override !== undefined && typeof rule.override !== "boolean")
        throw new Error(`assets[${i}].override must be boolean.`);
      if (typeof rule.from !== "string" || typeof rule.to !== "string")
        throw new Error(`assets[${i}] needs from and to strings.`);
      return {
        from: gamePath(rule.from),
        to: gamePath(rule.to, true),
        override: rule.override === true,
      };
    }),
    localisation: array(data.localisation, "localisation").map((value, i) => {
      const rule = object(value, `localisation[${i}]`);
      keys(rule, ["language", "from", "format"], `localisation[${i}]`);
      if (rule.format !== undefined && !["json", "yaml", "hoi4"].includes(String(rule.format)))
        throw new Error(`localisation[${i}].format must be json, yaml or hoi4.`);
      return {
        ...(rule.format === undefined ? {} : { format: rule.format as "json" | "yaml" | "hoi4" }),
        language: str(rule.language, "english", "language"),
        from: gamePath(str(rule.from, "", "from")),
      };
    }),
    gameRoots: array(data.gameRoots, "gameRoots").map((value, i) => {
      if (typeof value === "string") return { path: resolve(rootDir, value), replacePath: [] };
      const rule = object(value, `gameRoots[${i}]`);
      keys(rule, ["path", "replacePath"], `gameRoots[${i}]`);
      return {
        path: resolve(rootDir, str(rule.path, "", "path")),
        replacePath: strings(rule.replacePath, "replacePath").map((p) => gamePath(p)),
      };
    }),
    world: { countries: [...new Set(countryTags)], states: [...new Set(states as number[])] },
    strictAssets: data.strictAssets !== false,
    ...(data.railways === undefined ? {} : { railways: parseRailwayPlan(data.railways) }),
  };
  if (options.gameRoots !== undefined)
    config.gameRoots = options.gameRoots.map((root) =>
      typeof root === "string"
        ? { path: resolve(root), replacePath: [] }
        : { path: resolve(root.path), replacePath: root.replacePath.map((path) => gamePath(path)) },
    );
  if (!/^[A-Za-z0-9][A-Za-z0-9_.+-]*$/.test(config.mod.version))
    throw new Error("mod.version must be a portable version string without path separators.");
  safeChild(rootDir, sourceDir);
  safeChild(rootDir, outDir);
  for (const rule of [...config.assets, ...config.localisation]) {
    const input = safeChild(rootDir, rule.from);
    const output = resolve(rootDir, outDir);
    if (inside(input, output) || inside(output, input))
      throw new Error(`Output overlaps input ${rule.from}.`);
  }
  return config;
}
