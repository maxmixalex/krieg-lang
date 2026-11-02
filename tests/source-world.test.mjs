import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { importProject, buildProject, writeEditorProject } from "../dist/project/index.js";

function write(root, path, contents) {
  const destination = join(root, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, contents);
}

function config(root, options = {}) {
  write(
    root,
    "krgconfig.json",
    JSON.stringify({ name: "world-test", sourceDir: "src", outDir: "build/mod", ...options }),
  );
  write(
    root,
    "package.json",
    JSON.stringify({ name: "world-test", type: "module", version: "1.0.0" }),
  );
  write(root, "src/main.krg.ts", "export const unused = 0;");
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "krieg-source-world-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  config(root);
  return root;
}

test("native imports populate exact world declarations and stay current after source edits", (t) => {
  const parent = fixture(t);
  const original = join(parent, "native");
  write(original, "common/country_tags/example.txt", 'GER = "countries/Germany.txt"\n');
  write(
    original,
    "history/states/example.txt",
    "state = { id = 42 name = STATE_42 manpower = 1 state_category = rural history = { owner = GER } provinces = { 1 } }\n",
  );
  const project = join(parent, "imported");
  const imported = importProject(original, project);
  assert.equal(imported.success, true, JSON.stringify(imported.diagnostics));
  const world = writeEditorProject(project);
  assert.deepEqual(world.countries, ["GER"]);
  assert.deepEqual(world.states, [42]);
  write(
    project,
    "src/uses-world.krg.ts",
    `
    import { CountryEvent, type CountryScope, type StateScope } from "krieg-lang/hoi4";
    import { countries } from "@project/countries";
    import { states } from "@project/states";
    CountryEvent({ id: "world.1", hidden: true, immediate: (scope: CountryScope) => {
      scope.country(countries.GER, (country: CountryScope) => country.effects.addPoliticalPower(5));
      scope.state(states[42], (state: StateScope) => state.effects.setStateFlag("ready"));
    }});
  `,
  );
  const built = buildProject(project);
  assert.equal(built.success, true, JSON.stringify(built.diagnostics));
  const statePath = join(project, "src/history/states/example.txt.krg.ts");
  writeFileSync(
    statePath,
    readFileSync(statePath, "utf8").replace('pdx.atom("42")', 'pdx.atom("43")'),
  );
  const changed = writeEditorProject(project);
  assert.deepEqual(changed.states, [43]);
  const invalid = buildProject(project);
  assert.equal(invalid.success, false);
  assert.ok(
    invalid.diagnostics.some(
      (diagnostic) => diagnostic.code.startsWith("TS") && diagnostic.message.includes("42"),
    ),
  );
});

test("literal DataFile and complete StateHistory work through genuine SDK import aliases", (t) => {
  const root = fixture(t);
  write(
    root,
    "src/main.krg.ts",
    `
    import { DataFile as WorldFile, StateHistory as DeclareState, state as stateRef, country as countryRef } from "krieg-lang/hoi4";
    const id = 55;
    WorldFile("common/country_tags/krieg.txt", { KRG: "countries/Krieg.txt" });
    DeclareState({ state: stateRef(id), name: "STATE_55", manpower: 1,
      category: "rural", provinces: [1], owner: countryRef("KRG") });
  `,
  );
  const world = writeEditorProject(root);
  assert.deepEqual(world.countries, ["KRG"]);
  assert.deepEqual(world.states, [55]);
  assert.deepEqual(world.diagnostics, []);
  const result = buildProject(root);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
});

test("ordered PDX metadata resolves namespace and named constructor aliases", (t) => {
  const root = fixture(t);
  write(
    root,
    "src/main.krg.ts",
    `
    import * as syntax from "krieg-lang/pdx";
    export default syntax.file("common/country_tags/names.txt", syntax.document([
      syntax.property("GER", syntax.string("countries/Germany.txt"))
    ]));
  `,
  );
  assert.deepEqual(writeEditorProject(root).countries, ["GER"]);
  write(
    root,
    "src/main.krg.ts",
    `
    import { file as target, document as doc, property as entry, string as text } from "krieg-lang/pdx";
    export default target("common/country_tags/names.txt", doc([
      entry("FRA", text("countries/France.txt"))
    ]));
  `,
  );
  assert.deepEqual(writeEditorProject(root).countries, ["FRA"]);
});

test("world discovery does not mistake local names, forged objects, or unused helpers for declarations", (t) => {
  const root = fixture(t);
  write(
    root,
    "src/main.krg.ts",
    `
    function DataFile(path: string, value: Record<string, string>): void {}
    DataFile("common/country_tags/fake.txt", { BAD: "countries/Fake.txt" });
    const forge = { discoveryKind: "intrinsic", module: "sdk", name: "DataFile" };
  `,
  );
  assert.deepEqual(writeEditorProject(root).countries, []);
  write(
    root,
    "src/main.krg.ts",
    `
    import { StateHistory, state, country } from "krieg-lang/hoi4";
    function unused(): void {
      StateHistory({ state: state(99), name: "STATE_99", manpower: 1,
        category: "rural", provinces: [1], owner: country("GER") });
    }
  `,
  );
  assert.deepEqual(writeEditorProject(root).states, []);
});

test("metadata requiring helper expansion remains explicit and produces a diagnostic", (t) => {
  const root = fixture(t);
  const source = `
    import { StateHistory, state, country } from "krieg-lang/hoi4";
    function identifier(): number { return 77; }
    StateHistory({ state: state(identifier()), name: "STATE_77", manpower: 1,
      category: "rural", provinces: [1], owner: country("GER") });
  `;
  write(root, "src/main.krg.ts", source);
  const inferred = writeEditorProject(root);
  assert.deepEqual(inferred.states, []);
  assert.ok(inferred.diagnostics.some((diagnostic) => diagnostic.code === "KRG_WORLD_SOURCE"));
  config(root, { world: { states: [77], countries: ["GER"] } });
  write(root, "src/main.krg.ts", source);
  const explicit = writeEditorProject(root);
  assert.deepEqual(explicit.states, [77]);
  const result = buildProject(root);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
});

test("source-derived world files obey dependency load order and exact replacePath directories", (t) => {
  const root = fixture(t);
  const library = join(root, "library");
  config(library);
  write(
    library,
    "src/main.krg.ts",
    `
    import { DataFile } from "krieg-lang/hoi4";
    DataFile("history/states/base.txt", { state: { id: 2 } });
    DataFile("history/states/nested/keep.txt", { state: { id: 3 } });
  `,
  );
  config(root, { dependencies: ["./library"], mod: { replacePath: ["history/states"] } });
  write(
    root,
    "src/main.krg.ts",
    `
    import { DataFile } from "krieg-lang/hoi4";
    DataFile("history/states/new.txt", { state: { id: 1 } });
  `,
  );
  assert.deepEqual(writeEditorProject(root).states, [1, 3]);
});
