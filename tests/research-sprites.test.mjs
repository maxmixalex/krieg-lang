import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";
import { compileProject } from "../dist/compiler/index.js";

test("research save headers have one sprite for every flag ID, including country defaults", () => {
  const result = compileProject({
    rootDir: resolve("examples/rewrites/automated-research"),
    files: ["src/sprites.krg.tsx"],
  });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  assert.equal(result.outputs.length, 1);
  assert.equal(result.outputs[0].path, "interface/rq_assets.gfx");
  const entries = result.outputs[0].document.items[0].value.items;
  const fields = (entry) =>
    Object.fromEntries(entry.value.items.map((field) => [field.key.text, field.value.text]));
  const sprites = entries.map(fields);
  const flags = sprites.filter((sprite) => /^GFX_rq_flag_\d+$/.test(sprite.name));
  assert.equal(flags.length, 1400);
  const byName = new Map(flags.map((flag) => [flag.name, flag]));
  assert.equal(byName.size, 1400);
  for (let id = 1; id <= 1400; id++) assert.ok(byName.has(`GFX_rq_flag_${id}`), `flag ${id}`);
  for (const [id, texture] of [
    [73, "SER.tga"],
    [145, "CAN.tga"],
    [1360, "RUT.tga"],
    [1, "GER_neutrality.tga"],
    [146, "CAN_democratic.tga"],
  ])
    assert.equal(byName.get(`GFX_rq_flag_${id}`).texturefile, `gfx/flags/${texture}`);
});
