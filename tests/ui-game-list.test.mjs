import assert from "node:assert/strict";
import test from "node:test";
import { compileSource, emitCompileOutput } from "../dist/compiler/index.js";
import { comparePdxSemantic, parsePdx } from "../dist/pdx/index.js";

const imports = `import {ScriptedWindow,GuiVariable,SpriteFile,AnimatedSprite,type GuiBindings,type GuiElement} from 'krieg-lang/ui';
import type {CountryScope} from 'krieg-lang/hoi4';`;
const spec = `{name:'hand',path:'interface/hand.gui',context:'player_context'}`;
const hand = `${imports}
function Card(props:{ui:GuiBindings<CountryScope>;prefix:string}):GuiElement {
  return <props.ui.Container name={props.prefix+'_entry'}>
    <props.ui.Button name={props.prefix+'_play'} text="PLAY"
      click={country=>country.effects.addPoliticalPower(-5)}
      enabled={country=>country.politicalPower>=5}
      properties={{frame:GuiVariable('card_value')}} />
  </props.ui.Container>;
}
ScriptedWindow(${spec},ui=><ui.Container name="hand_window">
  <ui.GridBox name="cards" slotsize={{width:50,height:80}} maxSlotsHorizontal={12}
    list={{array:'cards_in_hand',index:GuiVariable('card_index'),value:GuiVariable('card_value'),entry:<Card ui={ui} prefix="card"/>}} />
</ui.Container>);`;

function compile(source) {
  return compileSource(source, { fileName: "cards.krg.tsx" });
}
function fail(source, code) {
  const result = compile(source);
  assert.equal(result.success, false);
  assert.deepEqual(result.outputs, []);
  assert.ok(
    result.diagnostics.some((item) => item.code === code),
    JSON.stringify(result.diagnostics),
  );
}

test("a reusable card entry emits one native template and a game-array binding", () => {
  const result = compile(hand);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  const expected = parsePdx(`guiTypes={
    containerWindowType={name="hand_window" gridBoxType={name="cards" slotsize={width=50 height=80} max_slots_horizontal=12}}
    containerWindowType={name="card_entry" buttonType={name="card_play" buttonText="PLAY"}}
  }`).document;
  const gui = result.outputs.find((item) => item.path === "interface/hand.gui");
  assert.ok(comparePdxSemantic(gui.document, expected), emitCompileOutput(gui));
  const script = emitCompileOutput(
    result.outputs.find((item) => item.path.includes("scripted_guis")),
  );
  assert.match(
    script,
    /dynamic_lists = \{\s+cards = \{\s+array = cards_in_hand\s+index = card_index\s+value = card_value\s+entry_container = "card_entry"/,
  );
  assert.match(script, /card_play_click = \{\s+add_political_power = -5/);
  assert.match(script, /card_play_click_enabled = \{/);
  assert.match(script, /frame = card_value/);
  assert.doesNotMatch(emitCompileOutput(gui), /list|click|card_value|card_index/);
});

test("native dynamic entries reject ambiguous templates, invalid references and structural prop leaks", () => {
  fail(
    hand
      .replace('prefix="card"', 'prefix="hand_window"')
      .replace("props.prefix+'_entry'", "props.prefix"),
    "KRG2132",
  );
  fail(
    hand.replace(
      '<Card ui={ui} prefix="card"/>',
      '<><ui.Container name="first"/><ui.Container name="second"/></>',
    ),
    "KRG2142",
  );
  fail(
    hand.replace('<Card ui={ui} prefix="card"/>', '<ui.Button name="invalid_entry"/>'),
    "KRG2142",
  );
  fail(hand.replace("array:'cards_in_hand'", "array:'bad array'"), "KRG2141");
  fail(
    `${imports}const leak={name:'bad',list:{array:'hand',entry:null}};
    ScriptedWindow(${spec},ui=><ui.Container name="window"><ui.Button {...leak}/></ui.Container>);`,
    "KRG2140",
  );
  fail(hand.replace("index:GuiVariable('card_index')", "index:'card_index'"), "TS2322");
  fail(
    hand.replace("country.effects.addPoliticalPower(-5)", "country.effects.setStateFlag('bad')"),
    "TS2339",
  );
});

test("country array entries select country scope and native button images remain bound", () => {
  const result = compile(
    hand
      .replace("array:'cards_in_hand'", "array:'countries',entryScope:'country'")
      .replace(
        "frame:GuiVariable('card_value')",
        "frame:GuiVariable('card_value'),image:'[THIS.GetFlag]'",
      ),
  );
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  const output = result.outputs.map(emitCompileOutput).join("\n");
  assert.match(output, /change_scope = yes/);
  assert.match(output, /image = "\[THIS.GetFlag\]"/);
  fail(hand.replace("array:'cards_in_hand'", "array:'states',entryScope:'state'"), "TS2322");
});

test("piano sound, background, fade and frame animation author native UI fields", () => {
  const result = compile(`${imports}
    ScriptedWindow(${spec},ui=><ui.Container name="keyboard" background={{name:'panel',spriteType:'GFX_panel'}} showSound="menu_open_window" fadeTime={300} fadeType="linear" margin={{top:10,bottom:10}}>
      <ui.Button name="key" clickSound="piano_C4" overSound="click_over" webLink="https://example.com"/>
      <ui.Icon name="metronome" spriteType="GFX_metronome" clickSound="click_close" shortcut="ESCAPE"/>
    </ui.Container>);
    SpriteFile('interface/metronome.gfx',AnimatedSprite({name:'GFX_metronome',textureFile:'gfx/metronome.dds',noOfFrames:4,animationRateFps:2,looping:true,playOnShow:true,pauseOnLoop:0,alwaysTransparent:true}));`);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  const output = result.outputs.map(emitCompileOutput).join("\n");
  assert.match(output, /background = \{\s+name = "panel"\s+quadTextureSprite = "GFX_panel"/);
  assert.match(output, /show_sound = menu_open_window/);
  assert.match(output, /fade_time = 300\s+fade_type = linear/);
  assert.match(output, /margin = \{\s+top = 10\s+bottom = 10/);
  assert.match(output, /clicksound = click_close\s+shortcut = "ESCAPE"/);
  assert.match(
    output,
    /clicksound = piano_C4\s+oversound = click_over\s+web_link = "https:\/\/example.com"/,
  );
  assert.match(
    output,
    /frameAnimatedSpriteType = \{[\s\S]*animation_rate_fps = 2[\s\S]*looping = yes[\s\S]*play_on_show = yes[\s\S]*pause_on_loop = 0[\s\S]*alwaystransparent = yes/,
  );
  fail(
    `${imports}SpriteFile('interface/bad.gfx',AnimatedSprite({name:'GFX_bad',textureFile:'gfx/bad.dds',noOfFrames:0,animationRateFps:2}));`,
    "KRG2143",
  );
});
