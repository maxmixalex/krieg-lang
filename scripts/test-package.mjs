import { spawnSync } from "node:child_process";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";

const repo = process.cwd();
const manifest = JSON.parse(readFileSync(join(repo, "package.json"), "utf8"));
const root = mkdtempSync(join(tmpdir(), "krieg-package-"));
const readonlyDirectories = [];
function write(directory, path, text) {
  const file = join(directory, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
  return file;
}
function json(directory, path, value) {
  return write(directory, path, JSON.stringify(value, null, 2) + "\n");
}
function snapshot(directory) {
  return readdirSync(directory, { recursive: true })
    .map(String)
    .sort()
    .map((path) => [path, join(directory, path)])
    .filter(([, file]) => statSync(file).isFile())
    .map(([path, file]) => [path, createHash("sha256").update(readFileSync(file)).digest("hex")]);
}
function line(text, fragment) {
  const index = text.split("\n").findIndex((text) => text.includes(fragment));
  assert.notEqual(index, -1, `Missing source/output fragment ${fragment}`);
  return index + 1;
}
function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: process.env,
    maxBuffer: 4 * 1024 * 1024,
    shell: process.platform === "win32",
  });
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
function rejects(command, args, expected, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: process.env,
    maxBuffer: 4 * 1024 * 1024,
    shell: process.platform === "win32",
  });
  assert.notEqual(result.status, null, result.error?.message);
  assert.notEqual(result.status, 0, `${command} ${args.join(" ")} unexpectedly succeeded`);
  const text = result.stdout + result.stderr;
  for (const pattern of expected) assert.match(text, pattern);
  return text;
}
try {
  run("npm", ["pack", "--pack-destination", root], repo);
  console.log("Packed tarball built; running isolated installed consumer checks.");
  const tarball = join(
    root,
    readdirSync(root).find((n) => n.endsWith(".tgz")),
  );
  // Even init must come from the installed tarball: using repo/dist here can
  // accidentally make the generated editor paths validate repository declarations.
  const bootstrap = join(root, "bootstrap");
  json(bootstrap, "package.json", { name: "krieg-package-bootstrap", private: true });
  run("npm", ["install", "--ignore-scripts", tarball], bootstrap);
  const project = join(root, "example consumer");
  run(process.execPath, [join(bootstrap, "node_modules/krieg-lang/dist/cli.js"), "init", project]);
  run(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--save-dev",
      tarball,
      `eslint@${manifest.devDependencies.eslint}`,
    ],
    project,
  );
  // Publish and install a real opt-in source package, rather than manufacturing
  // node_modules fixtures. Its relative CSS import and public CSS/focus exports
  // must work with the declarations and resolver actually shipped to consumers.
  const kit = join(root, "content-kit");
  json(kit, "package.json", {
    name: "@krieg-package-smoke/content-kit",
    version: "1.0.0",
    type: "module",
    files: ["src", "krgconfig.json"],
    krieg: {
      config: "krgconfig.json",
      exports: {
        ".": "src/index.krg.tsx",
        "./focuses": "src/focuses.krg.ts",
        "./theme": "src/panel.krg.css",
      },
    },
  });
  json(kit, "krgconfig.json", { name: "package-content-kit" });
  write(
    kit,
    "src/index.krg.tsx",
    `import {Button,type GuiElement} from "krieg-lang/ui";
import styles from "./panel.krg.css";
export function PackageButton(props:{name:string}):GuiElement {
  return <Button name={props.name} className={styles.button}/>;
}
`,
  );
  write(
    kit,
    "src/panel.krg.css",
    ".button {font:hoi_package; size:180px 28px;}\n.badge {sprite-type:GFX_package_badge;}\n",
  );
  write(
    kit,
    "src/focuses.krg.ts",
    `import {FocusNodes,type EventDefinition} from "krieg-lang/hoi4";
export function infrastructure(report:EventDefinition<"country">) {
  return FocusNodes({
    foundation:{cost:3},
    harbour:{requires:f=>f.foundation,cost:5,
      completionReward:country=>country.schedule(report,{days:1})}
  });
}
`,
  );
  const [packedKit] = JSON.parse(
    run("npm", ["pack", "--ignore-scripts", "--json", "--pack-destination", root], kit),
  );
  run("npm", ["install", "--ignore-scripts", "--save", join(root, packedKit.filename)], project);
  const installedKit = join(project, "node_modules/@krieg-package-smoke/content-kit");
  const kitSnapshot = snapshot(installedKit);
  const readonlyEntries = readdirSync(installedKit, { recursive: true }).map((path) =>
    join(installedKit, String(path)),
  );
  for (const file of readonlyEntries.filter((file) => statSync(file).isFile()))
    chmodSync(file, 0o444);
  for (const directory of [
    installedKit,
    ...readonlyEntries.filter((file) => statSync(file).isDirectory()),
  ]) {
    chmodSync(directory, 0o555);
    readonlyDirectories.push(directory);
  }
  const cli = join(project, "node_modules/krieg-lang/dist/cli.js");
  const configPath = join(project, "krgconfig.json");
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  config.localisation.push({
    language: "english",
    from: "localisation/package.yaml",
  });
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
  writeFileSync(
    join(project, "localisation/package.yaml"),
    'package_demo_label: "Installed package: 安装验证"\n',
  );
  const uiPath = join(project, "src/panel.krg.tsx");
  const uiSource = `import {GuiFile,Container,Button,Text,Icon,NativeButton,Window,ScriptedWindow,Stack,For,GuiVariable} from "krieg-lang/ui";
import {messages, translated} from "@project/localisation";
import {PackageButton} from "@krieg-package-smoke/content-kit";
import theme from "@krieg-package-smoke/content-kit/theme";
import styles from "./panel.krg.css";
import {tree} from "./graph.krg.js";
import {report} from "./events.krg.js";
import {investment} from "./actions.krg.js";
export default GuiFile("interface/package_demo.gui",
  <Container name="package_demo" className={styles.panel} position={{x:10,y:20}} size={{width:300,height:100}}>
    <Text name="label" text={messages.package_demo_label} className={styles.label}/>
    <NativeButton name="native_style" className={styles.button}/>
    <buttonType name="intrinsic_style" className={styles.button}/>
    <Window name="legacy_style" className={styles.window}/>
    <PackageButton name="package_component"/>
    <Button name="package_theme" className={[styles.button,theme.button]}/>
    <Icon name="style_icon" className={theme.badge}/>
  </Container>);
const choices = [{key:"industry",cost:5},{key:"relief",cost:10}] as const;
const frame = GuiVariable("package_frame");
ScriptedWindow({name:"package_actions",path:"interface/package_actions.gui",context:"player_context"},
  ui => <ui.Container name="package_actions_window" className={styles.panel}>
    <Stack position={{x:8,y:12}} gap={6}>
    <For each={choices}>{row => <ui.Button name={"action_" + row.key}
      text={translated.krieg_demo_begin} className={styles.button}
      enabled={country => country.politicalPower >= row.cost}
      click={country => {
        country.effects.addPoliticalPower(-row.cost);
        country.completeFocus(tree.focuses[row.key]);
        country.schedule(report,{days:1});
      }}/>}</For>
    </Stack>
    <ui.Button name="invest" className={styles.button} action={investment}/>
    <ui.Button name="inline_font" className={styles.button} font="hoi_inline"/>
    <ui.Icon name="status" spriteType="GFX_status" properties={{frame}}/>
  </ui.Container>);
`;
  writeFileSync(uiPath, uiSource);
  const cssSource = `:root { --button-width:240px; --font:hoi_16mbs; }
.panel { size:300px 160px; clipping:yes; }
.base { size:var(--button-width) 24px; font:var(--font); }
.button {
  composes:base;
  font:hoi_18mbs;
  sprite-type:GFX_package_button;
}
.label { font:hoi_18mbs; max-width:220px; max-height:36px; format:center; }
.window { size:100px 30px; }
`;
  const cssPath = write(project, "src/panel.krg.css", cssSource);
  writeFileSync(
    join(project, "src/events.krg.ts"),
    `import {CountryEvent,NewsEvent,StateEvent,type CountryScope,type EventSpec} from "krieg-lang/hoi4";
const reportSpec:EventSpec<CountryScope>={id:"package.report.001",hidden:true,isTriggeredOnly:true};
export const report=CountryEvent(reportSpec);
export const bulletin=NewsEvent({id:"package.news.01",hidden:true,isTriggeredOnly:true});
export const inspection=StateEvent({id:"package.state.1",hidden:true,isTriggeredOnly:true});
const exactNewsId:"package.news.01"=bulletin.id;
`,
  );
  writeFileSync(
    join(project, "src/graph.krg.ts"),
    `import {FocusGraph,ScriptedEffect,state} from "krieg-lang/hoi4";
import {infrastructure} from "@krieg-package-smoke/content-kit/focuses";
import {report,bulletin,inspection} from "./events.krg.js";
export const tree=FocusGraph({id:"package_tree",prefix:"PKG",nodes:{
  ...infrastructure(report),
  charter:{cost:3,completionReward:country=>country.schedule(report,{hours:6,randomHours:3})},
  industry:{requires:f=>f.charter,exclusiveWith:f=>f.relief,cost:5},
  relief:{requires:f=>f.charter,cost:5},
  assembly:{requires:f=>({any:[f.industry,f.relief]}),cost:5},
  congress:{requires:f=>({all:[f.assembly,f.harbour]}),cost:5}
},sequences:[["charter","industry"],["charter","relief"]],
choices:[["industry","relief"]],joins:[{to:"assembly",any:["industry","relief"]}]});
const exactFocusId:"PKG_assembly"=tree.focuses.assembly.id;
export const coast=FocusGraph({id:"package_coast",prefix:"COAST",nodes:infrastructure(report)});
const exactModuleId:"COAST_harbour"=coast.focuses.harbour.id;
export const finish=ScriptedEffect("package_complete",country=>{
  if(country.hasCompletedFocus(tree.focuses.assembly))country.schedule(bulletin,{days:2});
  country.state(state(1),location=>location.schedule(inspection));
});
`,
  );
  const actionSource = `import {CountryAction} from "krieg-lang/hoi4";
import {report} from "./events.krg.js";
import {tree} from "./graph.krg.js";
export const investment=CountryAction("package_invest",{
  politicalPowerCost:25,
  available:country=>!country.hasCompletedFocus(tree.focuses.harbour),
  perform:country=>{
    country.completeFocus(tree.focuses.harbour);
    country.schedule(report,{days:2});
  }
});
const exactActionId:"package_invest"=investment.id;
const exactExecuteName:"package_invest_execute"=investment.execute.name;
const exactAvailableName:"package_invest_available"=investment.available.name;
`;
  write(project, "src/actions.krg.ts", actionSource);
  write(
    project,
    "src/parameters.krg.ts",
    `import {ScriptedEffect} from "krieg-lang/hoi4";
export const increase=ScriptedEffect("package_increase",{values:"number[]",amount:"number"},(country,{values,amount})=>{
  values[0]+=amount;
});
ScriptedEffect("package_parameters",country=>{
  let values:number[]=[1,2];
  increase(country,{values,amount:3});
  country.run(increase,{values,amount:4});
  country.everyCountry(other=>increase(other,{values,amount:1}));
  country.setVariable("package_result",values[0]);
});
`,
  );
  write(
    project,
    "src/entrypoints.krg.ts",
    `import {CountryEvent,Decision,DecisionCategory} from "krieg-lang/hoi4";
import {investment} from "./actions.krg.js";
CountryEvent({id:"package.invest.1",hidden:true,isTriggeredOnly:true,
  immediate:country=>{if(country.test(investment.available))country.run(investment.execute);}});
DecisionCategory({id:"package_category",decisions:[
  Decision({id:"package_invest_decision",action:investment})
]});
`,
  );
  writeFileSync(
    join(project, "eslint.config.mjs"),
    `import krieg from "krieg-lang/eslint";
export default [krieg.configs.recommended,krieg.configs.styles,{
  files:["**/*.krg.ts","**/*.krg.tsx"],
  rules:{"krieg/allowed-imports":["error",{packages:["@krieg-package-smoke/content-kit"]}]}
}];
`,
  );
  writeFileSync(
    join(project, "src/defines.krg.ts"),
    'import { DefineFile } from "krieg-lang/hoi4";\nexport default DefineFile("common/defines/package_demo.lua", { NDefines: { NGame: { EVENT_TIMEOUT_DEFAULT: 14 } } });\n',
  );
  const sourceSnapshot = snapshot(join(project, "src"));
  run(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `for (const entry of ["krieg-lang", "krieg-lang/compiler", "krieg-lang/hoi4", "krieg-lang/pdx", "krieg-lang/project", "krieg-lang/ui", "krieg-lang/ui/jsx-runtime", "krieg-lang/eslint"]) await import(entry);`,
    ],
    project,
  );
  assert.equal(run(process.execPath, [cli, "--version"], project).trim(), manifest.version);
  // .krieg is gitignored. A newly cloned project must recover its complete editor
  // project from the documented check command, including installed source packages.
  rmSync(join(project, ".krieg"), { recursive: true, force: true });
  run("npm", ["run", "check"], project);
  const editor = JSON.parse(readFileSync(join(project, ".krieg/tsconfig.json"), "utf8"));
  assert.equal(editor.compilerOptions.exactOptionalPropertyTypes, true);
  assert.equal(
    resolve(project, ".krieg", editor.compilerOptions.paths["krieg-lang/hoi4"][0]),
    join(project, "node_modules/krieg-lang/dist/sdk/index.d.ts"),
    "Consumer tsc must use the installed declarations, never repository or bootstrap declarations",
  );
  assert.equal(existsSync(join(project, "build/mod")), false);
  const previewPath = join(project, "preview/focus.mmd");
  const preview = JSON.parse(
    run(
      process.execPath,
      [cli, "graph", "--focus", "package_tree", "--out", previewPath, "--json"],
      project,
    ),
  );
  assert.equal(preview.success, true);
  assert.equal(readFileSync(previewPath, "utf8"), preview.mermaid);
  assert.match(preview.mermaid, /^flowchart TD/);
  for (const expected of [/PKG_harbour/, /PKG_congress/, /\{"AND"\}/, /\{"OR"\}/, /exclusive/])
    assert.match(preview.mermaid, expected);
  assert.equal(existsSync(join(project, "build/mod")), false);
  run("npm", ["run", "build"], project);
  const tsc = join(project, "node_modules/typescript/bin/tsc");
  const eslint = join(project, "node_modules/eslint/bin/eslint.js");
  run(process.execPath, [tsc, "--noEmit"], project);
  run(process.execPath, [eslint, "src", "--max-warnings", "0"], project);
  const gui = readFileSync(join(project, "build/mod/interface/package_demo.gui"), "utf8");
  assert.match(gui, /containerWindowType\s*=\s*\{/);
  assert.match(gui, /name = "package_demo"/);
  assert.match(gui, /size = \{\s+width = 300\s+height = 100/);
  assert.match(gui, /maxWidth = 220/);
  assert.match(gui, /maxHeight = 36/);
  assert.match(gui, /size = \{\s+x = 240\s+y = 24/);
  assert.match(gui, /size = \{\s+x = 100\s+y = 30/);
  assert.equal((gui.match(/buttonFont = "hoi_package"/g) ?? []).length, 2);
  assert.match(gui, /spriteType = "GFX_package_badge"/);
  assert.doesNotMatch(gui, /className|composes|var\(|\bStack\b|\bpx\b/);
  const readOutput = (path) => readFileSync(join(project, "build/mod", path), "utf8");
  const parameters = readOutput("common/scripted_effects/krieg_package_parameters.txt");
  assert.equal((parameters.match(/_call_package_increase_\d+ = yes/g) ?? []).length, 3);
  assert.match(parameters, /set_temp_variable =/);
  assert.doesNotMatch(parameters, /\$|package_increase = \{/);
  const graph = readOutput("common/national_focus/krieg_package_tree.txt");
  assert.match(graph, /prerequisite = \{\s+focus = PKG_industry\s+focus = PKG_relief/);
  assert.match(graph, /mutually_exclusive = \{\s+focus = PKG_relief/);
  assert.match(graph, /mutually_exclusive = \{\s+focus = PKG_industry/);
  assert.match(graph, /id = PKG_harbour/);
  assert.match(graph, /prerequisite = \{\s+focus = PKG_foundation/);
  assert.match(
    graph,
    /prerequisite = \{\s+focus = PKG_assembly\s+\}\s+prerequisite = \{\s+focus = PKG_harbour/,
  );
  assert.match(readOutput("common/national_focus/krieg_package_coast.txt"), /id = COAST_harbour/);
  assert.match(
    graph,
    /country_event = \{\s+id = package\.report\.001\s+hours = 6\s+random_hours = 3/,
  );
  assert.match(
    readOutput("events/krieg_package_report_001.txt"),
    /add_namespace = package\.report/,
  );
  assert.match(
    readOutput("common/scripted_effects/krieg_package_complete.txt"),
    /state_event = \{\s+id = package\.state\.1/,
  );
  const scripted = readOutput("common/scripted_guis/krieg_package_actions.txt");
  assert.match(scripted, /action_industry_click = \{\s+add_political_power = -5/);
  assert.match(scripted, /action_relief_click = \{\s+add_political_power = -10/);
  assert.match(scripted, /complete_national_focus = PKG_relief/);
  assert.match(scripted, /status = \{\s+frame = package_frame/);
  assert.match(scripted, /invest_click = \{\s+package_invest_execute = yes/);
  assert.match(scripted, /invest_click_enabled = \{\s+package_invest_available = yes/);
  const scriptedLayout = readOutput("interface/package_actions.gui");
  assert.match(scriptedLayout, /name = "action_relief"[\s\S]*?position = \{\s+x = 8\s+y = 42/);
  assert.equal((scriptedLayout.match(/containerWindowType =/g) ?? []).length, 1);
  assert.doesNotMatch(scriptedLayout, /className|composes|\bStack\b/);
  const actionTrigger = readOutput("common/scripted_triggers/krieg_package_invest_action.txt");
  assert.match(
    actionTrigger,
    /package_invest_eligible = \{\s+NOT = \{\s+has_completed_focus = PKG_harbour/,
  );
  assert.match(
    actionTrigger,
    /package_invest_available = \{\s+package_invest_eligible = yes\s+NOT = \{\s+has_political_power < 25/,
  );
  const actionEffect = readOutput("common/scripted_effects/krieg_package_invest_action.txt");
  assert.match(
    actionEffect,
    /package_invest_execute = \{\s+if = \{\s+limit = \{\s+package_invest_available = yes\s+\}\s+add_political_power = -25\s+package_invest_perform = yes/,
  );
  assert.equal((actionEffect.match(/add_political_power = -25/g) ?? []).length, 1);
  assert.match(actionEffect, /complete_national_focus = PKG_harbour/);
  assert.match(readOutput("events/krieg_package_invest_1.txt"), /package_invest_execute = yes/);
  const decision = readOutput("common/decisions/krieg_package_category.txt");
  assert.match(decision, /cost = 25/);
  assert.match(decision, /available = \{\s+package_invest_eligible = yes/);
  assert.match(decision, /complete_effect = \{\s+package_invest_perform = yes/);
  assert.doesNotMatch(
    decision,
    /add_political_power|package_invest_execute|package_invest_available/,
  );
  assert.match(
    readFileSync(join(project, "build/mod/common/defines/package_demo.lua"), "utf8"),
    /NDefines\.NGame\.EVENT_TIMEOUT_DEFAULT\s*=\s*14/,
  );
  const localisationDir = join(project, "build/mod/localisation");
  const localisation = readdirSync(localisationDir, { recursive: true })
    .filter((path) => String(path).endsWith(".yml"))
    .map((path) => readFileSync(join(localisationDir, String(path)), "utf8"))
    .find((text) => text.includes("package_demo_label:"));
  assert.ok(localisation?.startsWith("\uFEFFl_english:"));
  assert.match(localisation, /package_demo_label:0 "Installed package: 安装验证"/);

  // Query the installed CLI against an actual successful build, preserving
  // winning CSS declarations, TSX overrides and cross-module action callbacks.
  const trace = (path, fragment) =>
    JSON.parse(
      run(
        process.execPath,
        [cli, "trace", "--at", `${path}:${line(readOutput(path), fragment)}`, "--json"],
        project,
      ),
    );
  const styled = trace("interface/package_actions.gui", 'buttonFont = "hoi_18mbs"');
  assert.equal(styled.source, "src/panel.krg.css");
  assert.equal(styled.precision, "style");
  assert.equal(styled.line, line(cssSource, "font:hoi_18mbs"));
  assert.ok(
    styled.via?.some(
      (frame) =>
        frame.source === "src/panel.krg.tsx" &&
        frame.line === line(uiSource, "<For each={choices}>"),
    ),
  );
  const overridden = trace("interface/package_actions.gui", 'buttonFont = "hoi_inline"');
  assert.equal(overridden.source, "src/panel.krg.tsx");
  assert.equal(overridden.line, line(uiSource, 'name="inline_font"'));
  assert.notEqual(overridden.precision, "style");
  const performed = trace(
    "common/scripted_effects/krieg_package_invest_action.txt",
    "complete_national_focus",
  );
  assert.equal(performed.source, "src/actions.krg.ts");
  assert.equal(performed.line, line(actionSource, "country.completeFocus"));
  assert.equal(performed.precision, "expression");
  const logPath = write(
    project,
    "error.log",
    [
      "[persistent.cpp:120] engine message without a mod path",
      `file: "${styled.path}", near line: ${styled.generatedLine}`,
      `${performed.path.replaceAll("/", "\\")}:${performed.generatedLine}`,
      "events/foreign_mod.txt line: 9",
    ].join("\r\n"),
  );
  const tracedLog = JSON.parse(
    run(process.execPath, [cli, "trace", "--log", logPath, "--json"], project),
  );
  assert.deepEqual(
    tracedLog.map((entry) => entry.logLine),
    [2, 3, 4],
  );
  assert.deepEqual(tracedLog[0].location, styled);
  assert.deepEqual(tracedLog[1].location, performed);
  assert.match(tracedLog[2].reason, /No such output/);
  console.log(
    "Installed consumer: build, stock tsc/ESLint, packaged source modules, focus preview, styles/Stack, CountryAction and source tracing passed.",
  );

  // Exercise the declarations shipped in the tarball, independently of the
  // compiler's virtual SDK: an invalid GUI coordinate must fail native tsc.
  writeFileSync(uiPath, uiSource.replace("x:10", 'x:"left"'));
  rejects(process.execPath, [tsc, "--noEmit"], [/TS2322/], project);
  writeFileSync(uiPath, uiSource);
  const invalidPath = join(project, "src/invalid.krg.tsx");
  writeFileSync(
    invalidPath,
    `import {CountryEvent,FocusGraph,FocusNodes,ScriptedEffect} from "krieg-lang/hoi4";
import {ScriptedWindow} from "krieg-lang/ui";
import {translated} from "@project/localisation";
import styles from "./panel.krg.css";
import theme from "@krieg-package-smoke/content-kit/theme";
import {infrastructure} from "@krieg-package-smoke/content-kit/focuses";
import {inspection} from "./events.krg.js";
import {report} from "./events.krg.js";
ScriptedEffect("wrong_recipient",country=>country.schedule(inspection));
FocusGraph({id:"invalid",nodes:{first:{},second:{}},sequences:[["first","missing"]]});
FocusNodes({first:{},second:{requires:f=>f.missingLocal}});
FocusGraph({id:"missing_import",nodes:{...infrastructure(report),finish:{requires:f=>f.missingImported}}});
FocusGraph({id:"wrong_exclusion",nodes:{first:{},second:{exclusiveWith:f=>f.missingExclusive}}});
FocusNodes({invalidUndefined:{cost:undefined}});
const missingClass=styles.buttn;
const foreignClass=theme.panel;
CountryEvent({id:"invalid.named",hidden:true});
const missingTranslation=translated.package_demo_label;
ScriptedWindow({name:"invalid",path:"interface/invalid.gui",context:"player_context"},
  ui=><ui.Container name="window"><ui.Icon name="icon" spriteType="GFX_icon" properties={{frame:"untyped_variable"}}/></ui.Container>);
`,
  );
  const invalidPatterns = [
    /EventDefinition<"state", "package\.state\.1">/,
    /"missing"/,
    /never/,
    /package_demo_label/,
    /GuiVariable/,
    /missingLocal/,
    /missingImported/,
    /missingExclusive/,
    /buttn/,
    /Property 'panel'/,
    /TS2375/,
  ];
  rejects(process.execPath, [tsc, "--noEmit", "--pretty", "false"], invalidPatterns, project);
  rejects(process.execPath, [cli, "check"], [/TS2345/, /TS2322/, /TS2339/, /TS2375/], project);
  rejects(
    process.execPath,
    [cli, "graph", "--focus", "package_tree", "--out", previewPath, "--json"],
    [/"success": false/, /TS2339/],
    project,
  );
  assert.equal(readFileSync(previewPath, "utf8"), preview.mermaid);
  assert.deepEqual(
    trace("interface/package_actions.gui", 'buttonFont = "hoi_18mbs"'),
    styled,
    "Failed checks must preserve the last successful build's trace data",
  );
  writeFileSync(
    invalidPath,
    `import {Decision,StateEvent,type CountryScope} from "krieg-lang/hoi4";
import {ScriptedWindow} from "krieg-lang/ui";
import {investment} from "./actions.krg.js";
Decision({id:"wrong_cost",action:investment,cost:2});
Decision({id:"wrong_available",action:investment,available:(country:CountryScope)=>country.politicalPower>0});
Decision({id:"wrong_settlement",action:investment,completeEffect:(country:CountryScope)=>country.effects.addPoliticalPower(1)});
StateEvent({id:"wrong.action.1",hidden:true,isTriggeredOnly:true,
  trigger:state=>state.test(investment.available),immediate:state=>state.run(investment.execute)});
ScriptedWindow({name:"wrong_button",path:"interface/wrong_button.gui",context:"player_context"},
  ui=><ui.Container name="window"><ui.Button name="conflict" action={investment} click={(country:CountryScope)=>country.effects.addPoliticalPower(1)}/></ui.Container>);
ScriptedWindow({name:"wrong_scope",path:"interface/wrong_scope.gui",context:"selected_state_context"},
  ui=><ui.Container name="window"><ui.Button name="wrong_scope" action={investment}/></ui.Container>);
`,
  );
  // Require each misuse to be diagnosed by the real consumer's declarations.
  const actionErrors = rejects(
    process.execPath,
    [tsc, "--noEmit", "--pretty", "false"],
    [/TS2345/, /TS2322/],
    project,
  );
  for (const sourceLine of [4, 5, 6, 8, 10, 12])
    assert.match(actionErrors, new RegExp(`invalid\\.krg\\.tsx\\(${sourceLine},`));
  rejects(process.execPath, [cli, "check"], [/TS2345/, /TS2322/], project);
  writeFileSync(
    invalidPath,
    `import {ScriptedEffect,StateScriptedEffect} from "krieg-lang/hoi4";
import {increase} from "./parameters.krg.js";
ScriptedEffect("wrong_parameter",country=>{let values:number[]=[];increase(country,{values,amount:"bad"});});
StateScriptedEffect("wrong_parameter_scope",state=>{let values:number[]=[];increase(state,{values,amount:1});});
`,
  );
  rejects(process.execPath, [tsc, "--noEmit", "--pretty", "false"], [/TS2322/, /TS2345/], project);
  rejects(process.execPath, [cli, "check"], [/TS2322/, /TS2345/], project);
  writeFileSync(
    invalidPath,
    `import {ScriptedEffect} from "krieg-lang/hoi4";
import {increase} from "./parameters.krg.js";
ScriptedEffect("wrong_array_scope",country=>{
  const values=country.numberArray("seats");
  country.everyCountry(other=>increase(other,{values,amount:1}));
});
`,
  );
  run(process.execPath, [tsc, "--noEmit"], project);
  rejects(process.execPath, [cli, "check"], [/KRG2613/, /target scope/], project);
  writeFileSync(invalidPath, "const unsafe:any=1;\n");
  rejects(process.execPath, [eslint, "src", "--max-warnings", "0"], [/krieg\/no-any/], project);
  writeFileSync(
    invalidPath,
    `import {ScriptedWindow,For} from "krieg-lang/ui";
ScriptedWindow({name:"collision",path:"interface/collision.gui",context:"player_context"},
  ui=><ui.Container name="window"><For each={["same","same"] as const}>
    {name=><ui.Button name={name} click={country=>country.effects.addPoliticalPower(1)}/>}
  </For></ui.Container>);
`,
  );
  run(process.execPath, [tsc, "--noEmit"], project);
  rejects(process.execPath, [cli, "check"], [/KRG2132/, /same/], project);
  rmSync(invalidPath);
  writeFileSync(cssPath, cssSource + "\n.invalid {display:flex;}\n");
  rejects(
    process.execPath,
    [eslint, "src", "--max-warnings", "0"],
    [/krieg\/styles/, /KRG2204/],
    project,
  );
  rejects(process.execPath, [cli, "check"], [/panel\.krg\.css/, /KRG2204/], project);
  writeFileSync(cssPath, cssSource);
  run(process.execPath, [cli, "pack"], project);
  if (!existsSync(join(project, "build/mod/descriptor.mod")))
    throw new Error("Installed package did not build a mod.");
  const archive = join(project, "build", `${config.name}-${config.mod.version}.zip`);
  // Read the real archive through the installed dependency: local debug metadata,
  // CSS and TypeScript sources must never be shipped as game assets.
  const archiveEntries = JSON.parse(
    run(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `
    import {readFileSync} from "node:fs";
    import {unzipSync} from "fflate";
    console.log(JSON.stringify(Object.keys(unzipSync(readFileSync(process.argv[1]))).sort()));
  `,
        archive,
      ],
      project,
    ),
  );
  assert.ok(archiveEntries.includes(`${config.name}/descriptor.mod`));
  assert.ok(archiveEntries.includes(`${config.name}.mod`));
  assert.ok(
    archiveEntries.includes(
      `${config.name}/common/scripted_effects/krieg_package_invest_action.txt`,
    ),
  );
  assert.ok(
    archiveEntries.every((path) => !/\.krieg|\.krg\.(?:tsx?|css)|\.map$/.test(path)),
    archiveEntries.join("\n"),
  );
  assert.deepEqual(
    snapshot(installedKit),
    kitSnapshot,
    "Editor/build/pack cannot write into dependency packages",
  );
  assert.deepEqual(
    snapshot(join(project, "src")),
    sourceSnapshot,
    "Generated declarations must stay outside authoring sources",
  );
  assert.equal(existsSync(join(installedKit, ".krieg")), false);
  // Retain exactly the tarball installed above, only after every consumer check
  // succeeds. CI can offer this verified package without publishing to a registry.
  if (process.env.KRIEG_VERIFIED_PACKAGE_DIR) {
    const directory = resolve(repo, process.env.KRIEG_VERIFIED_PACKAGE_DIR);
    const filename = basename(tarball);
    const sha256 = createHash("sha256").update(readFileSync(tarball)).digest("hex");
    mkdirSync(directory, { recursive: true });
    copyFileSync(tarball, join(directory, filename));
    writeFileSync(join(directory, "SHA256SUMS"), `${sha256}  ${filename}\n`);
    console.log(`Verified npm package: ${join(directory, filename)} (SHA-256 ${sha256})`);
  }
  console.log(
    "Packed package: installed CLI init and fresh-clone recovery, all public entrypoints, readonly npm source packages, FocusNodes/local and legacy graph rules, CountryAction decision/event/UI settlement, CSS Modules/native fields/Stack, trace --at/--log, translated keys, YAML, typed Lua defines, stock tsc and ESLint positive/negative checks, graph failure preservation, and clean mod ZIP succeeded.",
  );
} finally {
  for (const directory of readonlyDirectories)
    if (existsSync(directory)) chmodSync(directory, 0o755);
  rmSync(root, { recursive: true, force: true });
}
