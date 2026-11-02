import { readdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { buildProject, writeEditorProject } from "../dist/project/index.js";

let count = 0;
for (const entry of readdirSync("examples", { withFileTypes: true })) {
  if (!entry.isDirectory() || !existsSync(join("examples", entry.name, "krgconfig.json"))) continue;
  const project = resolve("examples", entry.name);
  writeEditorProject(project);
  const result = buildProject(project);
  if (!result.success)
    throw new Error(`${entry.name}: ${JSON.stringify(result.diagnostics, null, 2)}`);
  console.log(`${entry.name}: ${result.files.length} files`);
  count++;
}
if (!count) throw new Error("No example projects were tested.");
