import assert from "node:assert/strict";
import test from "node:test";
import { compileSource, emitCompileOutput } from "../dist/compiler/index.js";

const source = `import {ScriptedWindow,GuiVariable} from 'krieg-lang/ui';
ScriptedWindow({name:'research',path:'interface/research.gui',context:'player_context'}, ui =>
  <ui.Container name="research_window" position={{x:-430,y:0}} showPosition={{x:0,y:0}} showAnimationType="decelerated" hideAnimationType="accelerated" animationTime={300}>
    <ui.Button name="technology" properties={{frame:GuiVariable('positions^selected')}}
      click={c=>c.setVariable('top',0)}
      events={{rightClick:c=>c.setVariable('priority',1),shiftClick:c=>c.setVariable('organization',1),controlClick:c=>c.setVariable('top',1)}}/>
    <ui.Text name="name" text="TITLE" truncate />
  </ui.Container>);`;
const compile = (s) => compileSource(s, { fileName: "mouse.krg.tsx" });
test("TSX modifier events and indexed frames survive composition without leaking into GUI layout", () => {
  const result = compile(source);
  assert.ok(result.success, JSON.stringify(result.diagnostics));
  const gui = emitCompileOutput(result.outputs.find((x) => x.path === "interface/research.gui"));
  const script = result.outputs
    .filter((x) => x.path.includes("scripted_guis"))
    .map(emitCompileOutput)
    .join("\n");
  for (const suffix of ["click", "right_click", "shift_click", "control_click"])
    assert.ok(script.includes("technology_" + suffix + " ="));
  assert.match(script, /frame = positions\^selected/);
  assert.match(gui, /show_position = \{\s+x = 0\s+y = 0/);
  assert.match(gui, /show_animation_type = "decelerated"/);
  assert.match(gui, /hide_animation_type = "accelerated"/);
  assert.match(gui, /animation_time = 300/);
  assert.match(gui, /truncate = yes/);
  assert.doesNotMatch(gui, /events|rightClick|controlClick|positions/);
});
test("modifier events reject unknown gestures, wrong scopes, non-buttons and malformed array references", () => {
  for (const invalid of [
    source.replace("rightClick:", "doubleClick:"),
    source.replace("c.setVariable('priority',1)", "c.effects.setStateFlag('bad')"),
    source.replace(
      '<ui.Button name="technology"',
      '<ui.Icon spriteType="GFX_tech" name="technology"',
    ),
    source.replace("positions^selected", "positions^selected^other"),
    source.replace("positions^selected", "positions;injected"),
  ]) {
    const result = compile(invalid);
    assert.equal(result.success, false);
    assert.deepEqual(result.outputs, []);
  }
});
