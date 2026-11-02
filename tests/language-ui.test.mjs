import test from "node:test";
import assert from "node:assert/strict";
import { compileSource, compileProject } from "../dist/compiler/index.js";
import { emitPdx } from "../dist/pdx/index.js";
import { ESLint } from "eslint";
import plugin from "../dist/eslint/index.js";
import ts from "typescript";
import { fileURLToPath } from "node:url";
import { MINIMAL_LIB } from "../dist/compiler/minimal-lib.js";

function compile(source, options = {}) {
  const result = compileSource(source, options);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  return result.outputs.map((output) => ({ ...output, text: emitPdx(output.document) }));
}
function rejected(source, code, options = {}) {
  const result = compileSource(source, options);
  assert.equal(result.success, false);
  assert.deepEqual(result.outputs, []);
  if (code)
    assert.ok(
      result.diagnostics.some((item) => item.code === code),
      JSON.stringify(result.diagnostics),
    );
}
const sdk = `import {ScriptedLocalisation, ScriptedGui, ScriptedEffect, MetaEffect, type CountryScope, type StateScope} from 'krieg-lang/hoi4';`;

test("published SDK, UI and ordered PDX declarations typecheck with the exact noLib editor ambient types", () => {
  const lib = fileURLToPath(new URL("../dist/compiler/__editor_lib.d.ts", import.meta.url));
  const options = {
    strict: true,
    noLib: true,
    noEmit: true,
    types: [],
    skipLibCheck: false,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
  };
  const host = ts.createCompilerHost(options);
  const read = host.getSourceFile.bind(host);
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreate) =>
    fileName === lib
      ? ts.createSourceFile(fileName, MINIMAL_LIB, languageVersion, true)
      : read(fileName, languageVersion, onError, shouldCreate);
  const files = ["pdx/index.d.ts", "sdk/index.d.ts", "ui/index.d.ts", "ui/jsx-runtime.d.ts"].map(
    (file) => fileURLToPath(new URL(`../dist/${file}`, import.meta.url)),
  );
  const program = ts.createProgram([lib, ...files], options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.deepEqual(
    diagnostics.map((item) => ts.flattenDiagnosticMessageText(item.messageText, "\n")),
    [],
  );
  rejected("const runtime = new Set<number>();", "TS2585");
});

test("scripted localisation preserves priority, dynamic strings and repeated random weights", () => {
  const [output] = compile(`${sdk}
    export default ScriptedLocalisation('GetStatus',{scope:'country',texts:[
      {trigger:(c:CountryScope)=>c.triggers.hasCountryFlag('ready'),localisationKey:'READY'},
      {randomList:[{weight:10,localisationKey:'VARIANT_[?version|.0]'},
        {weight:10,localisationKey:'FALLBACK',modifiers:[{trigger:(c:CountryScope)=>c.isAI,factor:2}]}],seed:'status_seed'}
    ]});`);
  assert.equal(output.path, "common/scripted_localisation/krieg_GetStatus.txt");
  assert.match(output.text, /defined_text = \{\s+name = GetStatus/);
  assert.match(output.text, /localization_key = READY[\s\S]*random_list =/);
  assert.match(output.text, /localization_key = "VARIANT_\[\?version\|\.0\]"/);
  assert.equal((output.text.match(/10 = \{/g) ?? []).length, 2);
  assert.match(output.text, /modifier = \{\s+factor = 2\s+is_ai = yes/);
});

test("scripted localisation rejects unreachable branches and wrong callback scope", () => {
  rejected(
    `${sdk}ScriptedLocalisation('Bad',{scope:'country',texts:[{localisationKey:'FIRST'},{localisationKey:'LAST'}]});`,
    "KRG2099",
  );
  rejected(
    `${sdk}ScriptedLocalisation('Bad',{scope:'state',texts:[{trigger:(c:CountryScope)=>c.isAI,localisationKey:'BAD'}]});`,
    "TS2322",
  );
  rejected(
    `${sdk}ScriptedLocalisation('Bad',{scope:'country',texts:[{randomList:[{weight:0,localisationKey:'BAD'}]}]});`,
    "KRG2103",
  );
});

test("meta effect retains native template and quotes runtime substitutions", () => {
  const [output] = compile(`${sdk}export default ScriptedEffect('meta',(c:CountryScope)=>{
    MetaEffect(c,{text:'add_ideas = krg_idea_[TIER]',parameters:{TIER:'[?tier|.0]'},debug:false});
  });`);
  assert.match(output.text, /meta_effect = \{\s+text = \{\s+add_ideas = krg_idea_\[TIER\]/);
  assert.match(output.text, /TIER = "\[\?tier\|\.0\]"/);
  assert.match(output.text, /debug = no/);
});

test("meta effects require exact parameters, valid PDX, and an effect context", () => {
  rejected(
    `${sdk}ScriptedEffect('bad',(c:CountryScope)=>MetaEffect(c,{text:'add_ideas = demo_[TIER]',parameters:{}}));`,
    "TS2741",
  );
  rejected(
    `${sdk}ScriptedEffect('bad',(c:CountryScope)=>MetaEffect(c,{text:'add_ideas = {',parameters:{}}));`,
    "KRG2093",
  );
  rejected(
    `${sdk}ScriptedLocalisation('bad',{scope:'country',texts:[{localisationKey:'BAD',trigger:(c:CountryScope)=>{MetaEffect(c,{text:'add_political_power = 5',parameters:{}});return true;}}]});`,
    "KRG2092",
  );
});

test("scripted GUI emits context, event callbacks, repeated AI targets and dynamic lists", () => {
  const [output] =
    compile(`${sdk}export default ScriptedGui({name:'panel',windowName:'panel_window',context:'selected_state_context',parentWindowToken:'selected_state_view',
    dirty:'panel_dirty',visible:(s:StateScope)=>s.manpower > 0,
    effects:{apply_click:(s:StateScope)=>s.effects.addManpower(10)},
    triggers:{apply_click_enabled:(s:StateScope)=>!s.triggers.hasStateFlag('blocked')},
    properties:{status:{image:'[GetStatusSprite]',frame:'frame_variable',x:4}},
    dynamicLists:{rows:{array:'row_values',entryContainer:'row_window',index:'row_index',value:'row_value'}},
    aiEnabled:(c:CountryScope)=>c.isAI,aiTestScopes:['test_self_owned_states','test_neighbouring_states'],
    aiWeights:{apply_click:{aiWillDo:{base:10,modifiers:[{trigger:(s:StateScope)=>s.manpower > 100,factor:2}]}}}
  });`);
  assert.equal(output.path, "common/scripted_guis/krieg_panel.txt");
  assert.match(output.text, /scripted_gui = \{\s+panel = \{/);
  assert.match(output.text, /window_name = "panel_window"/);
  assert.match(output.text, /apply_click = \{\s+add_manpower = 10/);
  assert.match(output.text, /entry_container = "row_window"/);
  assert.equal((output.text.match(/ai_test_scopes =/g) ?? []).length, 2);
  assert.match(output.text, /image = "\[GetStatusSprite\]"/);
  rejected(
    `${sdk}ScriptedGui({name:'bad',windowName:'bad',context:'selected_state_context',effects:{apply_click:(c:CountryScope)=>c.effects.addPoliticalPower(5)}});`,
    "TS2322",
  );
});

test("TSX components, fragments, source helpers and native tags emit ordered native GUI", () => {
  const outputs = compile(
    `import {GuiFile,Container,Button,Text,Icon,GridBox,Sprite,SpriteFile,type GuiElement} from 'krieg-lang/ui';
    function Label(props:{name:string;text:string}):GuiElement{return <Text name={props.name} text={props.text} font="hoi_18mbs"/>;}
    const icon=<Icon name="badge" spriteType="GFX_badge"/>;
    export const sprites=SpriteFile('interface/demo.gfx',Sprite({name:'GFX_badge',textureFile:'gfx/interface/demo.dds',noOfFrames:1}));
    export default GuiFile('interface/demo.gui',<><Container name="demo_window" size={{width:300,height:200}}>
      <Button name="apply" position={{x:10,y:20}} spriteType="GFX_button" text="APPLY"/>
      <Label name="status" text="STATUS"/>{icon}
      <gridBoxType name="rows" slotsize={{width:100,height:30}} maxSlotsVertical={5}/>
    </Container><Container name="row_window"><Text name="row_name" text="ROW"/></Container></>);`,
    { fileName: "panel.krg.tsx" },
  );
  const gui = outputs.find((output) => output.path.endsWith(".gui"));
  assert.ok(gui);
  assert.match(gui.text, /guiTypes = \{\s+containerWindowType =/);
  assert.match(gui.text, /buttonText = "APPLY"/);
  assert.match(gui.text, /instantTextBoxType = \{\s+name = "status"/);
  assert.match(gui.text, /gridBoxType = \{\s+name = "rows"/);
  assert.equal((gui.text.match(/containerWindowType =/g) ?? []).length, 2);
  const gfx = outputs.find((output) => output.path.endsWith(".gfx"));
  assert.match(gfx.text, /spriteTypes = \{\s+spriteType =/);
  assert.match(gfx.text, /texturefile = "gfx\/interface\/demo.dds"/);
});

test("TSX imports resolve .krg.tsx helpers without executing JavaScript", () => {
  const result = compileProject({
    rootDir: "/virtual/tsx",
    files: ["main.krg.tsx"],
    sources: {
      "helper.krg.tsx": `import {Text,type GuiElement} from 'krieg-lang/ui'; export function Label(props:{name:string}):GuiElement {return <Text name={props.name} text="LABEL"/>;}`,
      "main.krg.tsx": `import {GuiFile,Container} from 'krieg-lang/ui';import {Label} from './helper.krg.js';export default GuiFile('interface/import.gui',<Container name="window"><Label name="label"/></Container>);`,
    },
  });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  assert.match(emitPdx(result.outputs[0].document), /name = "label"/);
  rejected(
    `import {GuiFile,Container} from 'krieg-lang/ui';GuiFile('interface/invalid.gui',<Container name="invalid" position={{x:'left',y:0}}/>);`,
    "TS2322",
    { fileName: "bad.krg.tsx" },
  );
  rejected(
    `import {GuiFile,Container} from 'krieg-lang/ui';GuiFile('interface/invalid.gui',<Container name="invalid">raw text</Container>);`,
    undefined,
    { fileName: "bad.krg.tsx" },
  );
  rejected(
    `import {GuiFile,Container} from 'krieg-lang/ui';const x=fetch('https://invalid.test');GuiFile('interface/invalid.gui',<Container name="invalid"/>);`,
    "TS2304",
    { fileName: "bad.krg.tsx" },
  );
});

test("ESLint applies static language rules to TSX and permits UI imports", async () => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [plugin.configs.recommended],
  });
  const [valid] = await eslint.lintText(
    `import {GuiFile,Container} from 'krieg-lang/ui';GuiFile('interface/demo.gui',<Container name="demo"/>);`,
    { filePath: "demo.krg.tsx" },
  );
  assert.deepEqual(valid.messages, []);
  const [invalid] = await eslint.lintText(`const x:any=fetch('https://invalid.test');`, {
    filePath: "invalid.krg.tsx",
  });
  assert.ok(invalid.messages.some((message) => message.ruleId === "krieg/no-any"));
  assert.ok(invalid.messages.some((message) => message.ruleId === "krieg/supported-syntax"));
});

test("native TSX controls include checkbox, edit box and the uppercase overlapping element engine type", () => {
  const [output] = compile(
    `import {GuiFile,Container,Checkbox,EditBox,OverlappingElementsBox,Button} from 'krieg-lang/ui';export default GuiFile('interface/widgets.gui',<Container name="widgets"><Checkbox name="enabled"/><EditBox name="input"/><OverlappingElementsBox name="portraits" spacing={4}/><Button name="apply" size={{width:100,height:30}}/></Container>);`,
    { fileName: "widgets.krg.tsx" },
  );
  assert.match(output.text, /checkboxType = \{/);
  assert.match(output.text, /editBoxType = \{/);
  assert.match(output.text, /OverlappingElementsBoxType = \{/);
  assert.match(output.text, /size = \{\s+x = 100\s+y = 30/);
  rejected(
    `import {GuiFile,Container,NativeText,Button} from 'krieg-lang/ui';GuiFile('interface/bad.gui',<Container name="bad"><NativeText name="text"><Button name="bad"/></NativeText></Container>);`,
    undefined,
    { fileName: "bad.krg.tsx" },
  );
});

test("scope-changing GUI lists type row callbacks independently and reject repeated handlers", () => {
  const [output] = compile(
    `${sdk}ScriptedGui({name:'scoped',windowName:'scoped_window',context:'player_context',dynamicLists:{rows:{array:'state_array',entryContainer:'state_row',entryScope:'state',effects:{row_click:(s:StateScope)=>s.effects.addManpower(5)},triggers:{row_click_enabled:(s:StateScope)=>s.manpower>100}}}});`,
  );
  assert.match(output.text, /change_scope = yes/);
  assert.match(output.text, /row_click = \{\s+add_manpower = 5/);
  rejected(
    `${sdk}ScriptedGui({name:'dupe',windowName:'dupe',context:'player_context',effects:{row_click:(c:CountryScope)=>c.effects.addPoliticalPower(5)},dynamicLists:{rows:{array:'states',entryContainer:'row',entryScope:'state',effects:{row_click:(s:StateScope)=>s.effects.addManpower(5)}}}});`,
    "KRG2110",
  );
});
