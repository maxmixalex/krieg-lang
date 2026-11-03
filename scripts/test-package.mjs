import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const repo = process.cwd();
const manifest = JSON.parse(readFileSync(join(repo, "package.json"), "utf8"));
const root = mkdtempSync(join(tmpdir(), "krieg-package-"));
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
  const result = spawnSync(command, args, { cwd, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 });
  assert.notEqual(result.status, null, result.error?.message);
  assert.notEqual(result.status, 0, `${command} ${args.join(" ")} unexpectedly succeeded`);
  const text = result.stdout + result.stderr;
  for (const pattern of expected) assert.match(text, pattern);
}
try {
  run("npm", ["pack", "--pack-destination", root], repo);
  console.log("Packed tarball built; running isolated installed consumer checks.");
  const tarball = join(
    root,
    readdirSync(root).find((n) => n.endsWith(".tgz")),
  );
  const project = join(root, "example");
  run(process.execPath, [join(repo, "dist/cli.js"), "init", project]);
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
  const uiSource = `import {GuiFile, Container, Text, ScriptedWindow, For, GuiVariable} from "krieg-lang/ui";
import {messages, translated} from "@project/localisation";
import {tree} from "./graph.krg.js";
import {report} from "./events.krg.js";
export default GuiFile("interface/package_demo.gui",
  <Container name="package_demo" position={{x:10,y:20}} size={{width:300,height:100}}>
    <Text name="label" text={messages.package_demo_label} font="hoi_18mbs"/>
  </Container>);
const choices = [{key:"industry",cost:5},{key:"relief",cost:10}] as const;
const frame = GuiVariable("package_frame");
ScriptedWindow({name:"package_actions",path:"interface/package_actions.gui",context:"player_context"},
  ui => <ui.Container name="package_actions_window">
    <For each={choices}>{(row,index) => <ui.Button name={"action_" + row.key}
      text={translated.krieg_demo_begin} position={{x:8,y:index*30}}
      enabled={country => country.politicalPower >= row.cost}
      click={country => {
        country.effects.addPoliticalPower(-row.cost);
        country.completeFocus(tree.focuses[row.key]);
        country.schedule(report,{days:1});
      }}/>}</For>
    <ui.Icon name="status" spriteType="GFX_status" properties={{frame}}/>
  </ui.Container>);
`;
  writeFileSync(uiPath, uiSource);
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
import {report,bulletin,inspection} from "./events.krg.js";
export const tree=FocusGraph({id:"package_tree",prefix:"PKG",nodes:{
  charter:{cost:3,completionReward:country=>country.schedule(report,{hours:6,randomHours:3})},
  industry:{cost:5},relief:{cost:5},assembly:{cost:5}
},sequences:[["charter","industry"],["charter","relief"]],
choices:[["industry","relief"]],joins:[{to:"assembly",any:["industry","relief"]}]});
const exactFocusId:"PKG_assembly"=tree.focuses.assembly.id;
export const finish=ScriptedEffect("package_complete",country=>{
  if(country.hasCompletedFocus(tree.focuses.assembly))country.schedule(bulletin,{days:2});
  country.state(state(1),location=>location.schedule(inspection));
});
`,
  );
  writeFileSync(
    join(project, "eslint.config.mjs"),
    'import krieg from "krieg-lang/eslint";\nexport default [krieg.configs.recommended];\n',
  );
  writeFileSync(
    join(project, "src/defines.krg.ts"),
    'import { DefineFile } from "krieg-lang/hoi4";\nexport default DefineFile("common/defines/package_demo.lua", { NDefines: { NGame: { EVENT_TIMEOUT_DEFAULT: 14 } } });\n',
  );
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
  run(process.execPath, [cli, "check"], project);
  run(process.execPath, [cli, "build"], project);
  const tsc = join(project, "node_modules/typescript/bin/tsc");
  const eslint = join(project, "node_modules/eslint/bin/eslint.js");
  run(process.execPath, [tsc, "--noEmit"], project);
  run(process.execPath, [eslint, "src", "--max-warnings", "0"], project);
  const gui = readFileSync(join(project, "build/mod/interface/package_demo.gui"), "utf8");
  assert.match(gui, /containerWindowType\s*=\s*\{/);
  assert.match(gui, /name = "package_demo"/);
  const readOutput = (path) => readFileSync(join(project, "build/mod", path), "utf8");
  const graph = readOutput("common/national_focus/krieg_package_tree.txt");
  assert.match(graph, /prerequisite = \{\s+focus = PKG_industry\s+focus = PKG_relief/);
  assert.match(graph, /mutually_exclusive = \{\s+focus = PKG_relief/);
  assert.match(graph, /mutually_exclusive = \{\s+focus = PKG_industry/);
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
  assert.match(
    readOutput("interface/package_actions.gui"),
    /name = "action_relief"\s+position = \{\s+x = 8\s+y = 30/,
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

  // Exercise the declarations shipped in the tarball, independently of the
  // compiler's virtual SDK: an invalid GUI coordinate must fail native tsc.
  writeFileSync(uiPath, uiSource.replace("x:10", 'x:"left"'));
  rejects(process.execPath, [tsc, "--noEmit"], [/TS2322/], project);
  writeFileSync(uiPath, uiSource);
  const invalidPath = join(project, "src/invalid.krg.tsx");
  writeFileSync(
    invalidPath,
    `import {CountryEvent,FocusGraph,ScriptedEffect} from "krieg-lang/hoi4";
import {ScriptedWindow} from "krieg-lang/ui";
import {translated} from "@project/localisation";
import {inspection} from "./events.krg.js";
ScriptedEffect("wrong_recipient",country=>country.schedule(inspection));
FocusGraph({id:"invalid",nodes:{first:{},second:{}},sequences:[["first","missing"]]});
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
  ];
  rejects(process.execPath, [tsc, "--noEmit", "--pretty", "false"], invalidPatterns, project);
  rejects(process.execPath, [cli, "check"], [/TS2345/, /TS2322/, /TS2339/], project);
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
  run(process.execPath, [cli, "pack"], project);
  if (!existsSync(join(project, "build/mod/descriptor.mod")))
    throw new Error("Installed package did not build a mod.");
  console.log(
    "Packed package: npm install, all public entrypoints, cross-module FocusGraph/events, inferred TSX ScriptedWindow/For/GuiVariable, translated keys, YAML, typed Lua defines, stock tsc and ESLint (valid and invalid), semantic binding collision checks, and mod ZIP succeeded.",
  );
} finally {
  rmSync(root, { recursive: true, force: true });
}
