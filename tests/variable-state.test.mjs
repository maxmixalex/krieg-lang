import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";
import { compileSource, emitCompileOutput } from "../dist/compiler/index.js";
import { writeEditorProject } from "../dist/project/index.js";
import { editorService } from "./support/editor-service.mjs";

const imports = `import {ScriptedEffect, ScriptedTrigger, variableState} from 'krieg-lang/hoi4';`;
const declarations = `const game = variableState('global', {dealing:'ku_dealing', turn:'ku_turn'});
  const playerState = variableState('country', {score:'ku_score'});
  const provinceState = variableState('state', {supply:'ku_supply'});`;
function compile(source) {
  const result = compileSource(imports + declarations + source);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  return result.outputs.map(emitCompileOutput).join("\n");
}
function fails(source, code) {
  const result = compileSource(imports + declarations + source);
  assert.equal(result.success, false);
  assert.deepEqual(result.outputs, []);
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.code === code),
    JSON.stringify(result.diagnostics),
  );
}

test("global variable properties preserve explicit native names and emit no implicit initialization", () => {
  assert.equal(compile(""), "");
  const native = compile(`
    ScriptedTrigger('ready', c => game.dealing <= 0 && game.turn === c.variable('ku_seat'));
    ScriptedEffect('deal', c => {
      game.dealing = 42;
      game.dealing += 2;
      game.dealing -= 1;
      game.dealing *= 2;
      game.dealing /= 2;
      game.dealing %= 7;
      game.dealing++;
      game.dealing--;
      c.setVariable('copy', game.dealing);
    });`);
  for (const command of [
    "set_variable",
    "add_to_variable",
    "subtract_from_variable",
    "multiply_variable",
    "divide_variable",
    "modulo_variable",
  ])
    assert.match(native, new RegExp(`${command} = \\{\\s*var = global\\.ku_dealing`));
  assert.match(native, /var = global.ku_dealing\s*value = 0\s*compare = less_than_or_equals/);
  assert.match(native, /var = global.ku_turn\s*value = ku_seat/);
  assert.match(native, /var = copy\s*value = global.ku_dealing/);
  assert.match(native, /var = global.ku_dealing\s*value = -1/);
});

test("bound state properties retain selected scopes across nested callbacks and same-scope loops", () => {
  const native = compile(`ScriptedEffect('capture', c => {
    const player = c.variables(playerState);
    player.score = 10;
    c.everyState(s => {
      const province = s.variables(provinceState);
      province.supply = player.score;
      player.score += province.supply;
      player.score++;
      if (player.score > province.supply) game.dealing--;
      s.owner(owner => {
        owner.variables(playerState).score = player.score;
        player.score += 1;
      });
    });
    c.forRange({start:0,end:2}, same => { player.score++; });
  });`);
  assert.match(native, /var = ku_supply\s*value = PREV.ku_score/);
  assert.match(native, /var = PREV.ku_score\s*value = ku_supply/);
  assert.match(native, /var = ku_score\s*value = PREV.PREV.ku_score/);
  assert.match(native, /var = PREV.PREV.ku_score\s*value = 1/);
  assert.doesNotMatch(native, /PREV.global/);
  assert.match(
    native,
    /for_loop_effect = \{\s*start = 0\s*end = 2\s*value = v\s*add_to_variable = \{\s*var = ku_score/,
  );
});

test("variable state rejects misspellings, wrong values, wrong scope bindings and trigger writes", () => {
  fails(`ScriptedTrigger('bad', c => game.deeling > 0);`, "TS2551");
  fails(`ScriptedEffect('bad', c => { game.dealing = 'many'; });`, "TS2322");
  fails(`ScriptedEffect('bad', c => { c.variables(provinceState).supply = 1; });`, "TS2345");
  fails(`ScriptedTrigger('bad', c => { game.dealing = 1; return true; });`, "KRG2053");
  fails(`ScriptedTrigger('bad', c => { game.dealing++; return true; });`, "KRG2058");
  fails(`const snapshot = game.dealing;`, "KRG2745");
  fails(
    `ScriptedEffect('bad', c => { game.dealing = ('many' as unknown as number); });`,
    "KRG1003",
  );
  fails(`ScriptedEffect('bad', c => { game.dealing /= 0; });`, "KRG2704");
  fails(`ScriptedEffect('bad', c => { game.dealing %= 0; });`, "KRG2704");
  fails(`ScriptedEffect('bad', c => { c.setVariable('copy', game.dealing++); });`, "KRG2057");
});

test("variable layouts validate names and reject asserted property or scope access", () => {
  fails(`const invalid = variableState('global', {bad:'global.already_prefixed'});`, "KRG2745");
  fails(`const invalid = variableState('country', {bad:'value = injected'});`, "KRG2745");
  fails(`const invalid = variableState('global', {first:'same', second:'same'});`, "KRG2745");
  fails(`ScriptedTrigger('bad', c => game['missing' as 'dealing'] > 0);`, "KRG1003");
  fails(
    `ScriptedEffect('bad', c => { c.variables(provinceState as unknown as typeof playerState).score = 1; });`,
    "KRG1003",
  );
});

test("consumer language service completes declared global and bound numeric properties", () => {
  const dir = mkdtempSync(join(tmpdir(), "krieg-variable-state-"));
  try {
    mkdirSync(join(dir, "src"));
    writeFileSync(
      join(dir, "krgconfig.json"),
      JSON.stringify({ name: "variable-state", sourceDir: "src", outDir: "build/mod" }),
    );
    const source =
      imports +
      declarations +
      `
      ScriptedEffect('edit', country => {
        const player = country.variables(playerState);
        game.dealing = player.score;
      });`;
    const file = join(dir, "src/main.krg.ts");
    writeFileSync(file, source);
    writeEditorProject(dir);
    writeFileSync(
      join(dir, "tsconfig.json"),
      JSON.stringify({
        extends: "./.krieg/tsconfig.json",
        include: ["src/**/*.krg.ts", ".krieg/types/**/*.d.ts"],
      }),
    );
    const service = editorService(join(dir, "tsconfig.json"));
    try {
      const errors = ts
        .getPreEmitDiagnostics(service.getProgram())
        .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
      assert.deepEqual(
        errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")),
        [],
      );
      const globalProperties =
        service
          .getCompletionsAtPosition(file, source.indexOf("game.dealing =") + "game.".length, {})
          ?.entries.map((entry) => entry.name) ?? [];
      assert.deepEqual(globalProperties.sort(), ["dealing", "turn"]);
      const boundProperties =
        service
          .getCompletionsAtPosition(file, source.indexOf("player.score") + "player.".length, {})
          ?.entries.map((entry) => entry.name) ?? [];
      assert.deepEqual(boundProperties, ["score"]);
    } finally {
      service.dispose();
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
