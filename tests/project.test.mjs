import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { unzipSync } from "fflate";
import {
  buildProject,
  initProject,
  loadConfig,
  packProject,
  writeEditorProject,
} from "../dist/project/index.js";
import { validateMap } from "../dist/project/map.js";
import { applyReplacePaths } from "../dist/project/world.js";
import { safeChild } from "../dist/project/files.js";

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "krieg-project-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  initProject(root);
  return root;
}
function write(root, path, contents) {
  const dest = join(root, path);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, contents);
}
function editConfig(root, fn) {
  const p = join(root, "krgconfig.json");
  const c = JSON.parse(readFileSync(p, "utf8"));
  fn(c);
  writeFileSync(p, JSON.stringify(c));
}
function expectSuccess(result) {
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
}

test("starter builds events, decisions, BOM localisation, descriptors and deterministic manifest", (t) => {
  const root = fixture(t);
  const result = buildProject(root);
  expectSuccess(result);
  const names = result.files.map((f) => f.path);
  assert(names.some((n) => n.startsWith("events/")));
  assert(names.some((n) => n.startsWith("common/decisions/")));
  assert(names.some((n) => n.startsWith("common/decisions/categories/")));
  const event = names.find((n) => n.startsWith("events/"));
  const text = readFileSync(join(result.outDir, event), "utf8");
  assert.match(text, /add_namespace\s*=\s*krieg_demo/);
  assert.match(text, /add_stability\s*=\s*0\.05/);
  const loc = names.find((n) => n.endsWith("_l_simp_chinese.yml"));
  assert.equal(readFileSync(join(result.outDir, loc), "utf8").charCodeAt(0), 0xfeff);
  assert.match(readFileSync(result.launcherFile, "utf8"), /path=/);
  assert.doesNotMatch(readFileSync(join(result.outDir, "descriptor.mod"), "utf8"), /^path=/m);
  const again = buildProject(root);
  expectSuccess(again);
  assert.deepEqual(again.files, result.files);
});

test("type errors fail without replacing the last successful build", (t) => {
  const root = fixture(t);
  const ok = buildProject(root);
  expectSuccess(ok);
  const before = readFileSync(join(ok.outDir, ".krieg-build.json"), "utf8");
  write(
    root,
    "src/main.krg.ts",
    'import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4"; export default ScriptedEffect("bad",(c:CountryScope)=>c.effects.addPoliticalPower("wrong"));',
  );
  const bad = buildProject(root);
  assert.equal(bad.success, false);
  assert(bad.diagnostics.some((d) => d.severity === "error"));
  assert.equal(readFileSync(join(ok.outDir, ".krieg-build.json"), "utf8"), before);
});

test("ordinary assets preserve bytes; duplicate destinations fail", (t) => {
  const root = fixture(t);
  const bytes = Buffer.from([0, 255, 37, 22, 0, 19]);
  write(root, "resources/data.bin", bytes);
  editConfig(root, (c) => {
    c.assets = [{ from: "resources", to: "gfx/test" }];
  });
  const result = buildProject(root);
  expectSuccess(result);
  assert.deepEqual(readFileSync(join(result.outDir, "gfx/test/data.bin")), bytes);
  editConfig(root, (c) => c.assets.push({ from: "resources", to: "gfx/test" }));
  const bad = buildProject(root);
  assert.equal(bad.success, false);
  assert(bad.diagnostics.some((d) => d.code === "KRG_OUTPUT_CONFLICT"));
});

test("path traversal, overlapping output, misspelled configuration are rejected", (t) => {
  const root = fixture(t);
  assert.throws(() => safeChild(root, "../escape"), /path/i);
  editConfig(root, (c) => {
    c.outDir = "src/generated";
  });
  assert.throws(() => loadConfig(root), /separate/);
  editConfig(root, (c) => {
    c.outDir = "build/mod";
    c.sourceDirs = "typo";
  });
  assert.throws(() => loadConfig(root), /Unknown/);
});

test("non-Krieg output directories are never deleted", (t) => {
  const root = fixture(t);
  write(root, "build/mod/important.txt", "keep me");
  const result = buildProject(root);
  assert.equal(result.success, false);
  assert.equal(readFileSync(join(root, "build/mod/important.txt"), "utf8"), "keep me");
});

test("pack writes reproducible portable archive and relocatable descriptor", (t) => {
  const root = fixture(t);
  const a = packProject(root, join(root, "a.zip"));
  expectSuccess(a.build);
  const b = packProject(root, join(root, "b.zip"));
  expectSuccess(b.build);
  assert.deepEqual(readFileSync(a.archive), readFileSync(b.archive));
  const entries = unzipSync(readFileSync(a.archive));
  const descriptor = Object.keys(entries).find((k) => k.endsWith(".mod") && !k.includes("/"));
  assert.match(Buffer.from(entries[descriptor]).toString(), /path="mod\//);
  assert(!Object.keys(entries).some((k) => k.includes(".krieg-build")));
});

test("effective world respects non-recursive replace_path and generates exact tag types", (t) => {
  const root = fixture(t);
  write(root, "game/common/country_tags/old.txt", 'GER = "countries/Germany.txt"');
  write(root, "game/common/country_tags/subfolder/retained.txt", 'FRA = "countries/France.txt"');
  write(root, "assets/common/country_tags/new.txt", 'KRG = "countries/Krieg.txt"');
  editConfig(root, (c) => {
    c.gameRoots = ["game"];
    c.assets = [{ from: "assets", to: "" }];
    c.mod.replacePath = ["common/country_tags"];
  });
  const world = writeEditorProject(root);
  assert.deepEqual(world.countries, ["FRA", "KRG"]);
  assert.match(world.virtualModules["@project/countries"], /readonly KRG/);
  assert.doesNotMatch(world.virtualModules["@project/countries"], /readonly GER/);
  const map = new Map([
    ["common/a.txt", {}],
    ["common/nested/b.txt", {}],
  ]);
  applyReplacePaths(map, ["common"]);
  assert.deepEqual([...map.keys()], ["common/nested/b.txt"]);
});

test("map validates colors, province references and railway row lengths", () => {
  const files = new Map([
    [
      "map/definition.csv",
      {
        source: "map/definition.csv",
        bytes: Buffer.from(
          "0;0;0;0;land;false;unknown;0\n1;10;20;30;land;false;plains;1\n2;10;20;30;land;false;plains;1\n",
        ),
      },
    ],
    [
      "history/states/1.txt",
      { source: "history/states/1.txt", bytes: Buffer.from("state={id=1 provinces={1 99}}") },
    ],
    ["map/railways.txt", { source: "map/railways.txt", bytes: Buffer.from("1 3 1 2\n") }],
  ]);
  const diagnostics = validateMap(files);
  assert(diagnostics.some((d) => d.code === "KRG_MAP_COLOR"));
  assert(diagnostics.some((d) => d.code === "KRG_MAP_REFERENCE"));
  assert(diagnostics.some((d) => d.code === "KRG_MAP_TABLE"));
});

test("local package dependencies are ordered and cycles fail", (t) => {
  const root = fixture(t);
  const lib = join(root, "lib");
  mkdirSync(lib);
  initProject(lib);
  write(lib, "src/main.krg.ts", "export const amount = 25;");
  editConfig(root, (c) => {
    c.dependencies = ["./lib"];
  });
  editConfig(lib, (c) => {
    c.localisation = [];
  });
  expectSuccess(buildProject(root));
  editConfig(lib, (c) => {
    c.dependencies = [".."];
  });
  const bad = buildProject(root);
  assert.equal(bad.success, false);
  assert(bad.diagnostics.some((d) => /Cyclic/.test(d.message)));
});

test("check validates without creating mod output", (t) => {
  const root = fixture(t);
  const result = buildProject(root, { check: true });
  expectSuccess(result);
  assert.equal(existsSync(result.outDir), false);
});

test("large entry sets compile in bounded batches without duplicate imported resources", (t) => {
  const root = fixture(t);
  rmSync(join(root, "src/main.krg.ts"));
  write(
    root,
    "src/shared.krg.ts",
    'import {ScriptedEffect,type CountryScope} from "krieg-lang/hoi4"; export const shared=ScriptedEffect("shared_bonus", (c:CountryScope)=>c.effects.addPoliticalPower(1));',
  );
  for (let i = 0; i < 51; i++)
    write(
      root,
      `src/entry_${i}.krg.ts`,
      `import {ScriptedEffect,type CountryScope} from "krieg-lang/hoi4"; import {shared} from "./shared.krg.ts"; export default ScriptedEffect("use_shared_${i}",(c:CountryScope)=>c.run(shared));`,
    );
  const result = buildProject(root);
  expectSuccess(result);
  assert.equal(
    result.files.filter((f) => f.path.startsWith("common/scripted_effects/")).length,
    52,
  );
});
