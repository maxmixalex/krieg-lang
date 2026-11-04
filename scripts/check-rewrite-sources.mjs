// Public CI can compile every authored program. It cannot redistribute the
// upstream mods and therefore cannot replace the private installer/behavior run.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { compileProject } from "../dist/compiler/index.js";
import { inputs, portsRoot } from "./rewrite-inputs.mjs";
import { auditRewriteSources } from "./lib/rewrite-source-audit.mjs";
const id = process.argv[2],
  self = fileURLToPath(import.meta.url);
if (!id) {
  for (const port of Object.keys(inputs)) {
    const run = spawnSync(process.execPath, ["--max-old-space-size=5120", self, port], {
      stdio: "inherit",
    });
    if (run.error || run.status !== 0)
      throw Error(port + ": " + (run.error?.message ?? run.status ?? run.signal));
  }
} else {
  assert.ok(Object.hasOwn(inputs, id));
  const project = join(portsRoot, id),
    cfg = JSON.parse(readFileSync(join(project, "krgconfig.json"), "utf8"));
  auditRewriteSources(join(project, cfg.sourceDir ?? "src"));
  const files = readdirSync(join(project, cfg.sourceDir ?? "src"), { recursive: true })
    .filter((n) => /\.krg\.tsx?$/.test(n))
    .map((n) => resolve(project, cfg.sourceDir ?? "src", n));
  assert.ok(files.length > 0);
  const r = compileProject({
    rootDir: project,
    files,
    maxExpansion: cfg.compiler?.maxExpansion ?? 250000,
    emitDependencies: false,
  });
  if (!r.success) throw Error(id + ": " + JSON.stringify(r.diagnostics.slice(0, 15)));
  const paths = r.outputs.map((f) => f.path);
  assert.ok(
    paths.some((p) => p.startsWith("common/")) && paths.some((p) => p.startsWith("interface/")),
    id + " must emit the actual gameplay and UI",
  );
  assert.ok(existsSync(join(project, "src")), id + " is not an installed input tree");
  console.log(
    id +
      ": " +
      files.length +
      " authored modules compiled to " +
      paths.length +
      " native outputs (private media not required)",
  );
}
