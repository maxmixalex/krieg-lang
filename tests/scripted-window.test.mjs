import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";
import { ESLint } from "eslint";
import { compileProject, compileSource, emitCompileOutput } from "../dist/compiler/index.js";
import { initProject, writeEditorProject } from "../dist/project/index.js";
import plugin from "../dist/eslint/index.js";
import { editorService } from "./support/editor-service.mjs";

const imports = `import {ScriptedWindow,For,GuiVariable,Container,Text,type GuiBindings,type GuiElement} from 'krieg-lang/ui';`;
const spec = `{name:'investment',path:'interface/investment.gui',context:'player_context',parentWindowToken:'politics_tab'}`;
const sample = `${imports}
const frame = GuiVariable('investment_frame');
const dirty = GuiVariable('investment_dirty');
const choices = [{name:'economy',cost:5},{name:'industry',cost:10}] as const;
ScriptedWindow({...${spec},dirty:dirty.name}, ui => <ui.Container name="investment_window">
  <For each={choices}>{(choice,index) => <ui.Button
    name={choice.name} text={choice.name} position={{x:8,y:index*30}}
    click={country => {
      country.effects.addPoliticalPower(-choice.cost);
      country.effects.setVariable({var:frame.name,value:2});
      country.effects.addToVariable({var:dirty.name,value:1});
    }}
    enabled={country => country.politicalPower >= choice.cost}
    visible={country => !country.isAI}
    aiWeight={{aiWillDo:{base:10,modifiers:[{trigger:country => country.politicalPower > 100,factor:2}]}}}
  />}</For>
  {true && <ui.Icon name="status" spriteType="GFX_status" properties={{frame,image:'[GetInvestmentImage]',x:GuiVariable('investment_x'),y:4}}/>}
  {false && <ui.Button name="omitted" click={country=>country.effects.addPoliticalPower(999)}/>}
  {false ? <ui.Text name="also_omitted" text="NO"/> : null}
</ui.Container>);`;

function success(source, options = {}) {
  const result = compileSource(source, { fileName: "panel.krg.tsx", ...options });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  return Object.fromEntries(
    result.outputs.map((output) => [output.path, emitCompileOutput(output)]),
  );
}
function failure(source, code) {
  const result = compileSource(source, { fileName: "panel.krg.tsx" });
  assert.equal(result.success, false, "source unexpectedly compiled");
  assert.deepEqual(result.outputs, []);
  assert.ok(
    result.diagnostics.some((diagnostic) =>
      code ? diagnostic.code === code : diagnostic.code.startsWith("TS"),
    ),
    JSON.stringify(result.diagnostics, null, 2),
  );
  return result.diagnostics;
}
function withLayout(layout, options = spec) {
  return `${imports}ScriptedWindow(${options}, ui => ${layout});`;
}
function nativeDiagnostics(service) {
  return ts.getPreEmitDiagnostics(service.getProgram()).map((diagnostic) => ({
    code: diagnostic.code,
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
  }));
}

test("ScriptedWindow expands typed TSX lists and emits colocated native bindings in source order", () => {
  const outputs = success(sample);
  assert.deepEqual(Object.keys(outputs).sort(), [
    "common/scripted_guis/krieg_investment.txt",
    "interface/investment.gui",
  ]);
  const gui = outputs["interface/investment.gui"];
  const script = outputs["common/scripted_guis/krieg_investment.txt"];
  assert.match(
    gui,
    /name = "investment_window"[\s\S]*name = "economy"[\s\S]*name = "industry"[\s\S]*name = "status"/,
  );
  assert.match(gui, /name = "industry"\s+position = \{\s+x = 8\s+y = 30/);
  assert.equal((gui.match(/buttonType =/g) ?? []).length, 2);
  assert.doesNotMatch(gui, /effects|triggers|click|enabled|properties|omitted|999/);
  assert.match(
    script,
    /window_name = "investment_window"\s+context_type = player_context\s+parent_window_token = politics_tab/,
  );
  assert.match(script, /economy_click = \{\s+add_political_power = -5/);
  assert.match(script, /industry_click = \{\s+add_political_power = -10/);
  assert.match(script, /set_variable = \{\s+var = investment_frame\s+value = 2/);
  assert.match(script, /add_to_variable = \{\s+var = investment_dirty\s+value = 1/);
  assert.match(script, /dirty = investment_dirty/);
  assert.match(script, /economy_click_enabled = \{\s+NOT = \{\s+has_political_power < 5/);
  assert.match(script, /industry_click_enabled = \{\s+NOT = \{\s+has_political_power < 10/);
  assert.match(script, /industry_visible = \{\s+NOT = \{\s+is_ai = yes/);
  assert.match(
    script,
    /frame = investment_frame\s+image = "\[GetInvestmentImage\]"\s+x = investment_x\s+y = 4/,
  );
  assert.match(script, /ai_weights = \{\s+economy_click = \{\s+ai_will_do =/);
  assert.match(script, /modifier = \{\s+factor = 2\s+has_political_power > 100/);
  assert.doesNotMatch(script, /omitted|999/);
});

test("bound controls survive imported source components, ordinary containers, arrays and fragments", () => {
  const result = compileProject({
    rootDir: "/virtual/window-components",
    files: ["main.krg.tsx"],
    sources: {
      "row.krg.tsx": `import type {CountryScope} from 'krieg-lang/hoi4';
        import {Container,type GuiBindings,type GuiElement} from 'krieg-lang/ui';
        export function Row(props:{ui:GuiBindings<CountryScope>;name:string;cost:number}):GuiElement {
          return <Container name={props.name + '_group'}><props.ui.Button name={props.name}
            click={country => country.effects.addPoliticalPower(-props.cost)}
            enabled={country => country.politicalPower >= props.cost}/></Container>;
        }`,
      "main.krg.tsx": `${imports}import {Row} from './row.krg.js';
        ScriptedWindow(${spec}, ui => <Container name="window">{[
          <><Row ui={ui} name="first" cost={3}/></>,
          <Row ui={ui} name="second" cost={8}/>,
          false, null, undefined,
        ]}</Container>);`,
    },
  });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  const output = result.outputs.map(emitCompileOutput).join("\n");
  assert.match(output, /first_click = \{\s+add_political_power = -3/);
  assert.match(output, /second_click = \{\s+add_political_power = -8/);
  assert.match(output, /name = "first_group"[\s\S]*name = "second_group"/);
});

test("selected-state window callbacks infer StateScope and preserve explicit owner transitions", () => {
  const outputs = success(
    withLayout(
      `<ui.Container name="state_window"><ui.Button name="recruit"
      click={state=>{state.effects.addManpower(5);state.owner(country=>country.effects.addPoliticalPower(-1));}}
      enabled={state=>state.manpower>100}/></ui.Container>`,
      `{name:'state_panel',path:'interface/state.gui',context:'selected_state_context',parentWindowToken:'selected_state_view'}`,
    ),
  );
  const script = outputs["common/scripted_guis/krieg_state_panel.txt"];
  assert.match(script, /context_type = selected_state_context/);
  assert.match(
    script,
    /recruit_click = \{\s+add_manpower = 5\s+owner = \{\s+add_political_power = -1/,
  );
  assert.match(script, /state_population > 100/);
  failure(
    withLayout(
      `<ui.Container name="window"><ui.Button name="bad" click={state=>state.effects.addPoliticalPower(1)}/></ui.Container>`,
      `{name:'state_panel',path:'interface/state.gui',context:'selected_state_context'}`,
    ),
    "TS2339",
  );
});

test("native element discriminants reject unsupported bindings and browser events", () => {
  for (const element of [
    `<ui.Text name="text" text="TEXT" click={country=>country.effects.addPoliticalPower(1)}/>`,
    `<ui.Text name="text" text="TEXT" properties={{image:'GFX_image'}}/>`,
    `<ui.Button name="button" onClick={country=>country.effects.addPoliticalPower(1)}/>`,
    `<ui.Icon name="icon" spriteType="GFX_icon" properties={{frame:'untyped_variable'}}/>`,
    `<ui.Icon name="icon" spriteType="GFX_icon" properties={{width:10}}/>`,
  ])
    failure(withLayout(`<ui.Container name="window">${element}</ui.Container>`));
  failure(
    withLayout(
      `<ui.Container name="window"/>`,
      `{name:'bad',path:'interface/bad.gui',context:'player_context',parentWindowToken:'top_bar',parentWindowName:'other'}`,
    ),
  );
  failure(
    withLayout(
      `<ui.Container name="window"/>`,
      `{name:'bad',path:'interface/bad.gui',context:'decision_category',parentWindowToken:'top_bar'}`,
    ),
  );
});

test("scripted windows reject ambiguous names and malformed roots after component expansion", () => {
  const duplicate = failure(
    withLayout(
      `<ui.Container name="window"><For each={[1,2]}>{index=><ui.Button name="same"/>}</For></ui.Container>`,
    ),
    "KRG2132",
  );
  assert.ok(duplicate.some((diagnostic) => diagnostic.line && diagnostic.column));
  failure(
    withLayout(`<ui.Container name="window"><Container name="window"/></ui.Container>`),
    "KRG2132",
  );
  failure(
    withLayout(`<ui.Container name="window"><ui.Button name="invalid name"/></ui.Container>`),
    "KRG2131",
  );
  failure(withLayout(`<ui.Button name="button"/>`), "KRG2130");
  failure(withLayout(`<><ui.Container name="one"/><ui.Container name="two"/></>`), "KRG2130");
  failure(withLayout(`<ui.Container name="window" visible={country=>country.isAI}/>`), "KRG2138");
  failure(`${imports}const variable=GuiVariable('invalid variable');`, "KRG2136");
});

test("expanded bindings reject extra fields hidden by structural TypeScript assignment", () => {
  failure(
    `${imports}import type {CountryScope} from 'krieg-lang/hoi4';
    const text={name:'text',text:'TEXT',click:(country:CountryScope)=>country.effects.addPoliticalPower(1)};
    ScriptedWindow(${spec},ui=><ui.Container name="window"><ui.Text {...text}/></ui.Container>);`,
    "KRG2134",
  );
  failure(
    `${imports}const properties={x:1,image:'GFX_invalid_for_text'};
    ScriptedWindow(${spec},ui=><ui.Container name="window"><ui.Text name="text" text="TEXT" properties={properties}/></ui.Container>);`,
    "KRG2135",
  );
});

test("For uses bounded static expansion and regular GuiFile supports boolean/null composition", () => {
  const outputs = success(`import {GuiFile,Container,Text,For} from 'krieg-lang/ui';
    GuiFile('interface/composition.gui',<Container name="window">
      {true && <Text name="yes" text="YES"/>}
      {false || <Text name="fallback" text="FALLBACK"/>}
      {false && <Text name="no" text="NO"/>}
      {true ? null : <Text name="unselected" text="NO"/>}
      <For each={[] as const}>{item => <Text name="never" text="NO"/>}</For>
    </Container>);`);
  assert.match(outputs["interface/composition.gui"], /name = "yes"[\s\S]*name = "fallback"/);
  assert.doesNotMatch(outputs["interface/composition.gui"], /"no"|unselected|never/);
  const bounded = compileSource(sample, { fileName: "panel.krg.tsx", maxExpansion: 30 });
  assert.equal(bounded.success, false);
  assert.ok(bounded.diagnostics.some((diagnostic) => diagnostic.code === "KRG2001"));
});

test("contextual inference keeps implicit-any helpers and runtime JSX rejected", () => {
  failure(
    `${imports}function invalid(value) {return value;} ScriptedWindow(${spec},ui=><ui.Container name="window"/>);`,
    "KRG1005",
  );
  failure(
    `import {ScriptedEffect} from 'krieg-lang/hoi4';${imports}
    ScriptedEffect('bad',country=>{const layout=<Text name="text" text="TEXT"/>;});`,
    "KRG2080",
  );
});

test("stock TypeScript accepts and rejects the public TSX API using the generated editor project", () => {
  const root = mkdtempSync(join(tmpdir(), "krieg-window-editor-"));
  try {
    initProject(root);
    const file = join(root, "src", "window.krg.tsx");
    writeFileSync(file, sample);
    writeEditorProject(root);
    const config = join(root, "tsconfig.json");
    const valid = editorService(config);
    assert.deepEqual(nativeDiagnostics(valid), []);
    valid.dispose();
    for (const bad of [
      withLayout(
        `<ui.Container name="window"><ui.Button name="bad" click={country=>country.effects.setStateFlag('bad')}/></ui.Container>`,
      ),
      withLayout(
        `<ui.Container name="window"><ui.Text name="bad" text="BAD" properties={{frame:2}}/></ui.Container>`,
      ),
      withLayout(
        `<ui.Container name="window"/>`,
        `{name:'bad',path:'interface/bad.txt',context:'player_context'}`,
      ),
      `${imports}const untyped = value => value;`,
    ]) {
      writeFileSync(file, bad);
      const invalid = editorService(config);
      assert.ok(nativeDiagnostics(invalid).length > 0, bad);
      invalid.dispose();
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("real TypeScript LanguageService offers component, scope, row and prop-specific completions", () => {
  const root = mkdtempSync(join(tmpdir(), "krieg-window-completions-"));
  try {
    initProject(root);
    const cases = [
      {
        name: "components",
        source: withLayout(`<ui./*complete*/ />`),
        include: ["Container", "Button", "Icon", "Text"],
        exclude: ["div", "useState"],
      },
      {
        name: "button",
        source: withLayout(
          `<ui.Container name="window"><ui.Button name="button" /*complete*/ /></ui.Container>`,
        ),
        include: ["click", "enabled", "visible", "properties", "aiWeight"],
        exclude: ["onClick", "children"],
      },
      {
        name: "country",
        source: withLayout(
          `<ui.Container name="window"><ui.Button name="button" click={country=>country.effects./*complete*/}/></ui.Container>`,
        ),
        include: ["addPoliticalPower", "setCountryFlag"],
        exclude: ["setStateFlag"],
      },
      {
        name: "state",
        source: withLayout(
          `<ui.Container name="window"><ui.Button name="button" click={state=>state.effects./*complete*/}/></ui.Container>`,
          `{name:'state',path:'interface/state.gui',context:'selected_state_context'}`,
        ),
        include: ["addManpower", "setStateFlag"],
        exclude: ["addPoliticalPower", "setCountryFlag"],
      },
      {
        name: "text",
        source: withLayout(
          `<ui.Container name="window"><ui.Text name="text" text="TEXT" properties={{/*complete*/}}/></ui.Container>`,
        ),
        include: ["x", "y"],
        exclude: ["image", "frame", "width"],
      },
      {
        name: "icon",
        source: withLayout(
          `<ui.Container name="window"><ui.Icon name="icon" spriteType="GFX_icon" properties={{/*complete*/}}/></ui.Container>`,
        ),
        include: ["image", "frame", "x", "y"],
        exclude: ["width", "text"],
      },
      {
        name: "row",
        source: withLayout(
          `<ui.Container name="window"><For each={[{name:'one',cost:5}]}>{(row,index)=><ui.Button name={row./*complete*/}/>}</For></ui.Container>`,
        ),
        include: ["name", "cost"],
        exclude: ["width", "click"],
      },
    ];
    for (const item of cases) writeFileSync(join(root, "src", `${item.name}.krg.tsx`), item.source);
    writeEditorProject(root);
    const service = editorService(join(root, "tsconfig.json"));
    for (const item of cases) {
      const file = join(root, "src", `${item.name}.krg.tsx`);
      const position = item.source.indexOf("/*complete*/");
      assert.ok(position >= 0);
      const names = new Set(
        service.getCompletionsAtPosition(file, position, {})?.entries.map((entry) => entry.name),
      );
      for (const name of item.include)
        assert.ok(names.has(name), `${item.name}: missing ${name}; got ${[...names].join(", ")}`);
      for (const name of item.exclude)
        assert.equal(names.has(name), false, `${item.name}: unexpected ${name}`);
    }
    const countryFile = join(root, "src", "country.krg.tsx");
    const countrySource = readFileSync(countryFile, "utf8");
    const info = service.getQuickInfoAtPosition(
      countryFile,
      countrySource.indexOf("country=>") + 1,
    );
    assert.match(ts.displayPartsToString(info?.displayParts), /CountryScope/);
    service.dispose();
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("ESLint permits inferred callbacks throughout static TSX composition", async () => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [plugin.configs.recommended],
  });
  const [result] = await eslint.lintText(sample, { filePath: "panel.krg.tsx" });
  assert.deepEqual(result.messages, []);
});
