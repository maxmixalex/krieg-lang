import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { buildProject } from "../dist/project/index.js";

const event = (id) =>
  `import {CountryEvent} from 'krieg-lang/hoi4';export const event=CountryEvent({id:'${id}',hidden:true});`;

function project(t, config = {}) {
  const root = mkdtempSync(join(tmpdir(), "krieg-project-event-ids-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, text) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  write("krgconfig.json", JSON.stringify({ name: "event-ids", strictAssets: false, ...config }));
  write("package.json", JSON.stringify({ name: "event-ids", type: "module" }));
  return { root, write };
}

function dependency(write) {
  write("lib/krgconfig.json", JSON.stringify({ name: "event-library", strictAssets: false }));
  write("lib/package.json", JSON.stringify({ name: "event-library", type: "module" }));
  write("lib/src/event.krg.ts", event("a.1"));
}

test("project rejects equivalent event IDs across compiler batches while distinct IDs pass", (t) => {
  const { root, write } = project(t);
  write("src/00.krg.ts", event("a.1"));
  for (let i = 1; i < 50; i++)
    write(`src/${String(i).padStart(2, "0")}.krg.ts`, "export const ignored = 1;");
  write("src/50.krg.ts", event("a.001"));
  const duplicate = buildProject(root, { check: true });
  assert.equal(duplicate.success, false);
  const diagnostic = duplicate.diagnostics.find((entry) => entry.code === "KRG2607");
  assert.ok(diagnostic, JSON.stringify(duplicate.diagnostics));
  assert.equal(diagnostic.file, join(root, "src/50.krg.ts"));
  assert.ok(diagnostic.message.includes(join(root, "src/00.krg.ts")));
  assert.match(diagnostic.message, /events\/krieg_a_001\.txt/);
  assert.match(diagnostic.message, /events\/krieg_a_1\.txt/);

  write("src/50.krg.ts", event("a.002"));
  const distinct = buildProject(root, { check: true });
  assert.equal(distinct.success, true, JSON.stringify(distinct.diagnostics));
});

test("project checks semantic event identities across dependency layers", (t) => {
  const { root, write } = project(t, { dependencies: ["./lib"] });
  dependency(write);
  write("src/event.krg.ts", event("a.001"));
  const result = buildProject(root, { check: true });
  assert.equal(result.success, false);
  const diagnostic = result.diagnostics.find((entry) => entry.code === "KRG2607");
  assert.ok(diagnostic, JSON.stringify(result.diagnostics));
  assert.ok(diagnostic.message.includes(join(root, "lib/src/event.krg.ts")));
  assert.ok(diagnostic.message.includes(join(root, "src/event.krg.ts")));
});

test("replace_path removes discarded semantic events before the identity check", (t) => {
  const { root, write } = project(t, {
    dependencies: ["./lib"],
    mod: { replacePath: ["events"] },
  });
  dependency(write);
  write("src/event.krg.ts", event("a.001"));
  const result = buildProject(root, { check: true });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  assert.equal(
    result.files.some((file) => file.path === "events/krieg_a_1.txt"),
    false,
  );
});

test("explicit native asset overrides remove discarded semantic event identities", (t) => {
  const { root, write } = project(t, {
    dependencies: ["./lib"],
    assets: [{ from: "native.txt", to: "events/krieg_a_1.txt", override: true }],
  });
  dependency(write);
  write("native.txt", "add_namespace=a country_event={id=a.2 hidden=yes}");
  write("src/event.krg.ts", event("a.001"));
  const result = buildProject(root, { check: true });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
});

test("inherited and native compatibility events do not acquire semantic duplicate restrictions", (t) => {
  const { root, write } = project(t, {
    gameRoots: ["base"],
    assets: [{ from: "native.txt", to: "events/native.txt" }],
  });
  write("base/events/inherited.txt", "add_namespace=a country_event={id=a.1 hidden=yes}");
  write("native.txt", "add_namespace=a country_event={id=a.001 hidden=yes}");
  write("src/event.krg.ts", event("a.1"));
  const result = buildProject(root, { check: true });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
});
