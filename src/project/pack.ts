import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { zipSync, type Zippable } from "fflate";
import { buildProject } from "./build.js";
import { loadConfig } from "./config.js";
import { slash, walkFiles } from "./files.js";
import type { BuildResult } from "./types.js";

export function packProject(
  project = ".",
  destination?: string,
): { build: BuildResult; archive?: string } {
  const config = loadConfig(project);
  const build = buildProject(project);
  if (!build.success) return { build };
  const archive = destination
    ? resolve(destination)
    : resolve(config.rootDir, "build", `${config.name}-${config.mod.version}.zip`);
  const content: Zippable = {};
  const mtime = new Date(1980, 0, 1);
  for (const file of walkFiles(build.outDir)) {
    const path = slash(relative(build.outDir, file));
    if (path === ".krieg-build.json") continue;
    content[`${config.name}/${path}`] = [readFileSync(file), { mtime }];
  }
  content[`${config.name}.mod`] = [
    Buffer.from(
      readFileSync(resolve(build.outDir, "descriptor.mod"), "utf8") + `path="mod/${config.name}"\n`,
    ),
    { mtime },
  ];
  mkdirSync(dirname(archive), { recursive: true });
  writeFileSync(archive, zipSync(content, { level: 9, mtime }));
  return { build, archive };
}
