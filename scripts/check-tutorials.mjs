import { RewriteModel } from "./lib/rewrite-model.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildProject,
  importProject,
  initProject,
  writeEditorProject,
} from "../dist/project/index.js";
import { comparePdxSemantic, parsePdx } from "../dist/pdx/index.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "krieg-tutorials-"));
const project = path.join(temporary, "hello-krieg");
function installLocal(directory) {
  fs.mkdirSync(path.join(directory, "node_modules"), { recursive: true });
  fs.symlinkSync(root, path.join(directory, "node_modules/krieg-lang"), "junction");
}
function markedFiles(page, marker = "file") {
  const source = fs.readFileSync(path.join(root, "docs/tutorials", page), "utf8");
  const pattern = new RegExp(
    `<!-- tutorial:${marker} ([^\\s]+) -->\\s*\x60\x60\x60[^\\n]*\\n([\\s\\S]*?)\\n\x60\x60\x60`,
    "g",
  );
  return [...source.matchAll(pattern)].map((match) => ({
    filename: match[1],
    source: match[2] + "\n",
  }));
}
function build(label, directory = project) {
  writeEditorProject(directory);
  const result = buildProject(directory);
  assert.equal(result.success, true, `${label}: ${JSON.stringify(result.diagnostics, null, 2)}`);
  const read = (prefix) =>
    result.files
      .filter((file) => file.path.startsWith(prefix))
      .map((file) => fs.readFileSync(path.join(result.outDir, file.path), "utf8"))
      .join("\n");
  console.log(`${label}: ${result.files.length} output files`);
  return { result, read };
}
try {
  initProject(project);
  installLocal(project);
  let output = build("01 first mod");
  assert.match(output.read("events/"), /id = krieg_demo\.1/);
  for (const [index, page] of [
    "event-and-localisation.md",
    "focus-and-action.md",
    "action-window.md",
  ].entries()) {
    const files = markedFiles(page);
    assert.ok(files.length, `${page}: no complete tutorial files found`);
    for (const file of files) {
      const target = path.resolve(project, file.filename);
      assert.ok(
        target.startsWith(`${project}${path.sep}`),
        `${page}: file escapes tutorial project`,
      );
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, file.source);
    }
    output = build(`0${index + 2} ${page}`);
    assert.match(output.read("events/"), /id = tutorial\.1/);
    assert.match(output.read("localisation/simp_chinese/"), /tutorial\.1\.t:0 "新的开始"/);
    if (index >= 1) {
      assert.match(
        output.read("common/national_focus/"),
        /prerequisite = \{\s*focus = TUT_authorize\s*\}/,
      );
      const decisions = output.read("common/decisions/");
      assert.match(decisions, /cost = 25/);
      assert.match(decisions, /tutorial_aid_perform = yes/);
      assert.doesNotMatch(decisions, /tutorial_aid_execute = yes/);
      const effects = output.read("common/scripted_effects/");
      assert.match(effects, /add_political_power = -25/);
      assert.match(effects, /set_country_flag = tutorial_aid_received/);
    }
    if (index === 2) {
      assert.match(output.read("interface/"), /name = "request_aid"/);
      const gui = output.read("common/scripted_guis/");
      assert.match(gui, /window_name = "tutorial_window"/);
      assert.match(gui, /request_aid_click_enabled/);
      assert.match(gui, /tutorial_aid_execute = yes/);
    }
  }
  const native = markedFiles("native-port.md", "native");
  assert.equal(native.length, 1);
  const input = path.join(temporary, native[0].filename);
  fs.writeFileSync(input, native[0].source);
  const destination = path.join(temporary, "migrated-aid");
  const nativePath = "common/scripted_effects/tutorial_legacy_aid.txt";
  const imported = importProject(input, destination, { outputPath: nativePath });
  assert.equal(imported.success, true, JSON.stringify(imported.diagnostics));
  installLocal(destination);
  const migrated = build("05 native port", destination);
  const rebuilt = fs.readFileSync(path.join(migrated.result.outDir, nativePath), "utf8");
  assert.equal(
    comparePdxSemantic(parsePdx(native[0].source).document, parsePdx(rebuilt).document),
    true,
  );
  assert.equal([...rebuilt.matchAll(/set_country_flag/g)].length, 2);
  const [supply] = markedFiles("typed-allocation.md");
  assert.equal(supply.filename, "src/supply.krg.ts");
  fs.writeFileSync(path.join(project, supply.filename), supply.source);
  const supplyBuild = build("06 typed stock transfer");
  const definitions = Object.fromEntries(
    parsePdx(supplyBuild.read("common/scripted_effects/"))
      .document.items.filter((item) => item.kind === "property")
      .map((item) => [item.key.text, item.value]),
  );
  for (const [rear, front, expectedRear, expectedFront] of [
    [18, 2, 8, 12],
    [6, 4, 0, 10],
    [0, 5, 0, 5],
  ]) {
    const model = new RewriteModel(
      {
        countries: [{ tag: "AAA", variables: { supply_rear: rear, supply_front: front } }],
        states: [],
        global: {},
      },
      definitions,
    );
    const ctx = model.context();
    model.run("tutorial_supply_front", ctx);
    assert.deepEqual(ctx.current.variables, {
      supply_rear: expectedRear,
      supply_front: expectedFront,
    });
  }
  console.log(
    "Verified six tutorial stages from published Markdown, including cross-file actions, GUI wiring and ordered native round-trip.",
  );
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
