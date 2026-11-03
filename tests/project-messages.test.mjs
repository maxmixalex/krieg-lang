import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { buildProject, initProject, writeEditorProject } from "../dist/project/index.js";
import { editorService } from "./support/editor-service.mjs";

test("project messages complete real keys, preview translations and reject incompletely translated keys", (t) => {
  const root = mkdtempSync(join(tmpdir(), "krieg-translated-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  initProject(root);
  const put = (path, text) => {
    const dest = join(root, path);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, text);
  };
  const config = JSON.parse(readFileSync(join(root, "krgconfig.json"), "utf8"));
  config.sourceDir = "authored";
  config.localisation = [
    { language: "english", from: "text/en.yaml" },
    { language: "simp_chinese", from: "text/zh.yml" },
  ];
  put("krgconfig.json", JSON.stringify(config));
  put(
    "tsconfig.json",
    JSON.stringify({
      extends: "./.krieg/tsconfig.json",
      include: ["authored/**/*.krg.ts", ".krieg/types/**/*.d.ts"],
    }),
  );
  put(
    "text/en.yaml",
    'audit_title: "Council convenes */ safely"\naudit_description: "Ready to vote"\n',
  );
  put("text/zh.yml", '\uFEFFl_simp_chinese:\n audit_title:0 "议会开幕"\n');
  const source =
    'import { CountryEvent } from "krieg-lang/hoi4";\nimport { messages, translated } from "@project/localisation";\nCountryEvent({id:"audit.1",hidden:true,isTriggeredOnly:true,title:translated.audit_title,description:messages.audit_description});';
  put("authored/main.krg.ts", source);
  writeEditorProject(root);
  const file = join(root, "authored/main.krg.ts");
  const service = editorService(join(root, "tsconfig.json"));
  try {
    assert.deepEqual(service.getSemanticDiagnostics(file), []);
    const completions = (before) =>
      service
        .getCompletionsAtPosition(file, source.indexOf(before) + before.length, {})
        ?.entries.map((e) => e.name);
    assert.deepEqual(completions("title:translated."), ["audit_title"]);
    assert.deepEqual(completions("description:messages.").sort(), [
      "audit_description",
      "audit_title",
    ]);
    const hover = service.getQuickInfoAtPosition(
      file,
      source.indexOf("messages.audit_description") + "messages.au".length,
    );
    assert.match(hover.documentation.map((s) => s.text).join(""), /english — Ready to vote/);
  } finally {
    service.dispose();
  }
  const build = buildProject(root);
  assert.equal(build.success, true, JSON.stringify(build.diagnostics));
  const event = build.files.find((f) => f.path.startsWith("events/"));
  const native = readFileSync(join(build.outDir, event.path), "utf8");
  assert.match(native, /title = audit_title/);
  assert.match(native, /desc = audit_description/);
  put(
    "authored/main.krg.ts",
    source.replace("translated.audit_title", "translated.audit_description"),
  );
  const bad = buildProject(root, { check: true });
  assert.equal(bad.success, false);
  assert.ok(bad.diagnostics.some((d) => d.code === "TS2339"));
});
