import assert from "node:assert/strict";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { compileProject } from "../../../../dist/compiler/index.js";
import { parsePdx } from "../../../../dist/pdx/index.js";
import { ResearchNativeMachine } from "./native-machine.mjs";

// An authoring experiment: change exactly one fact in memory. The repository's
// source and compiled mod remain untouched; no original native script is read.
const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const path = "src/technologies.krg.ts",
  source = readFileSync(join(project, path), "utf8");
const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
let edit;
const property = (node, name) =>
  node.properties.find(
    (p) =>
      ts.isPropertyAssignment(p) &&
      (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) &&
      p.name.text === name,
  );
function visit(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const id = property(node, "id"),
      cost = property(node, "baseCost");
    if (id && ts.isStringLiteral(id.initializer) && id.initializer.text === "early_fighter") {
      assert.ok(cost && ts.isNumericLiteral(cost.initializer));
      assert.equal(cost.initializer.text, "220");
      edit = {
        start: cost.initializer.getStart(file),
        end: cost.initializer.getEnd(),
        before: 220,
        after: 230,
      };
    }
  }
  ts.forEachChild(node, visit);
}
visit(file);
assert.ok(edit);
const modified = source.slice(0, edit.start) + edit.after + source.slice(edit.end);
const result = compileProject({
  rootDir: project,
  files: ["src/core.krg.ts", "src/storage.krg.ts", "src/planner.krg.ts"],
  sources: { [path]: modified },
  maxExpansion: 20000000,
});
assert.equal(result.success, true, JSON.stringify(result.diagnostics));
const properties = (block) => (block.items ?? []).filter((p) => p.kind === "property");
const effects = new Map(),
  triggers = new Map();
for (const output of result.outputs)
  for (const property of properties(output.document)) {
    if (output.path.startsWith("common/scripted_effects/"))
      effects.set(property.key.text, property.value);
    if (output.path.startsWith("common/scripted_triggers/"))
      triggers.set(property.key.text, property.value);
  }
const baselineEffects = new Map(),
  baselineTriggers = new Map();
const build = resolve(process.argv[2] ?? join(project, "build/mod"));
for (const [directory, map] of [
  ["common/scripted_effects", baselineEffects],
  ["common/scripted_triggers", baselineTriggers],
])
  for (const name of readdirSync(join(build, directory)))
    if (name.endsWith(".txt"))
      for (const property of properties(
        parsePdx(readFileSync(join(build, directory, name), "utf8")).document,
      ))
        map.set(property.key.text, property.value);
function machine(definitions, conditions) {
  const m = new ResearchNativeMachine(definitions, conditions),
    c = m.countries[0];
  Object.assign(c.vars, { rq_t: 226, rq_slots: 1, rq_now_y: 1936, rq_speed_shown: 1 });
  c.arrays.rq_queue = [226];
  c.arrays.rq_qprog = [219];
  c.arrays.rq_qmio = [0];
  c.arrays.rq_qsrc = [0];
  return m;
}
const before = machine(baselineEffects, baselineTriggers),
  after = machine(effects, triggers);
before.run("rq_tech_data");
after.run("rq_tech_data");
assert.equal(before.get("rq_base_cost", before.countries[0]), 220);
assert.equal(after.get("rq_base_cost", after.countries[0]), 230);
function completion(m) {
  for (let day = 1; day <= 20; day++) {
    m.run("rq_lanes");
    if (m.grants.length) {
      assert.deepEqual(m.grants, ["early_fighter"]);
      return day;
    }
  }
  throw Error("No completion");
}
const baselineDay = completion(before),
  modifiedDay = completion(after);
assert.equal(baselineDay, 1);
assert.equal(modifiedDay, 11);
const report = {
  schemaVersion: 1,
  editedFile: path,
  editedTechnology: "early_fighter",
  authoredNumericEdits: 1,
  baseCost: { before: 220, after: 230 },
  completionDay: { before: baselineDay, after: modifiedDay },
  grantUnchanged: "early_fighter",
  nativeFilesEdited: 0,
  scope:
    "Both outcomes execute actual compiled native lane handlers. This demonstrates propagation of one technology fact through cost and completion; it does not estimate human development time or engine performance.",
};
writeFileSync(join(project, "cases/authoring.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
