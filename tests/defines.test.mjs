import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import luaparse from "luaparse";
import { compileSource, emitCompileOutput } from "../dist/compiler/index.js";

function compile(source) {
  const result = compileSource(source);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  return result.outputs;
}

test("defines emit real Lua assignments with independent Lua 5.1 syntax validation", () => {
  const [output] = compile(
    `import {Defines} from 'krieg-lang/hoi4';export default Defines('timing',{NDefines:{NGame:{EVENT_TIMEOUT_DEFAULT:14,GAME_SPEED_SECONDS:[2,0.5,0.2,0.1,0]}}});`,
  );
  assert.equal(output.format, "lua");
  assert.equal(output.path, "common/defines/krieg_timing.lua");
  assert.equal("document" in output, false);
  const text = emitCompileOutput(output);
  const ast = luaparse.parse(text, { luaVersion: "5.1" });
  assert.equal(ast.body.length, 2);
  assert.ok(ast.body.every((statement) => statement.type === "AssignmentStatement"));
  assert.equal(ast.body[0].variables[0].identifier.name, "EVENT_TIMEOUT_DEFAULT");
  assert.equal(ast.body[0].init[0].value, 14);
  assert.deepEqual(
    ast.body[1].init[0].fields.map((field) => field.value.value),
    [2, 0.5, 0.2, 0.1, 0],
  );
});

test("Lua quoting preserves control bytes followed by digits, quotes, backslashes and Unicode", () => {
  const text = 'quote" slash\\ newline\n nul\u00007 tail';
  const [output] = compile(
    `import {DefineFile} from 'krieg-lang/hoi4';DefineFile('common/defines/strings.lua',{NDefines:{NGame:{START_DATE:${JSON.stringify(text)},END_DATE:'中文'}}});`,
  );
  const lua = emitCompileOutput(output);
  assert.match(lua, /\\0007/);
  assert.doesNotMatch(lua, /\\u0000/);
  const ast = luaparse.parse(lua, { luaVersion: "5.1", encodingMode: "none" });
  assert.equal(ast.body.length, 2);
  // Parse the ASCII assignment independently in decoding mode, so escaping is tested by Lua's grammar.
  const decoded = luaparse.parse(
    lua
      .split("\n")
      .filter((line) => !line.includes("END_DATE"))
      .join("\n"),
    { luaVersion: "5.1", encodingMode: "pseudo-latin1" },
  );
  assert.equal(decoded.body[0].init[0].value, text);
  assert.ok(ast.body[1].init[0].raw.includes("中文"));
});

test("defines preserve each native root and reject invalid keys, value types and paths", () => {
  const schema = JSON.parse(
    fs.readFileSync(new URL("../src/schema/hoi4-defines.json", import.meta.url), "utf8"),
  );
  const graphics = Object.entries(schema.roots.NDefines_Graphics).flatMap(([namespace, fields]) =>
    Object.entries(fields)
      .filter(([, type]) => type.kind === "number")
      .map(([key]) => ({ namespace, key })),
  )[0];
  const [output] = compile(
    `import {Defines} from 'krieg-lang/hoi4';Defines('graphics',{NDefines_Graphics:{${graphics.namespace}:{${graphics.key}:1}}});`,
  );
  assert.match(emitCompileOutput(output), /^NDefines_Graphics\./m);
  assert.doesNotMatch(emitCompileOutput(output), /^NDefines\./m);
  for (const source of [
    `import {Defines} from 'krieg-lang/hoi4';Defines('bad',{NDefines:{NGame:{EVENT_TIMEOUT_DEFAULT:'bad'}}});`,
    `import {Defines} from 'krieg-lang/hoi4';Defines('bad',{NDefines:{NGame:{EVENT_TIMEOUT_DEFAULT:1/0}}});`,
    `import {DefineFile} from 'krieg-lang/hoi4';DefineFile('common/defines/../bad.lua',{NDefines:{NGame:{EVENT_TIMEOUT_DEFAULT:14}}});`,
    `import {Defines} from 'krieg-lang/hoi4';const overrides={NDefines:{NGame:{EVENT_TIMEOUT_DEFAULT:14,'unsafe;call()':1}}};Defines('bad',overrides);`,
    `import {Defines} from 'krieg-lang/hoi4';Defines('bad',{NDefines:{NGame:{NOT_A_NATIVE_DEFINE:1}}});`,
  ]) {
    const result = compileSource(source);
    assert.equal(result.success, false);
    assert.deepEqual(result.outputs, []);
  }
});
