import test from "node:test";
import assert from "node:assert/strict";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import ts from "typescript";
import { ESLint } from "eslint";
import prettier from "prettier";
import { compileProject, emitCompileOutput } from "../dist/compiler/index.js";
import { buildProject, writeEditorProject, traceOutput } from "../dist/project/index.js";
import plugin from "../dist/eslint/index.js";
import { editorService } from "./support/editor-service.mjs";

function compile(css, layout = '<Button name="button" className={styles.button}/>', extra = {}) {
  return compileProject({
    rootDir: "/virtual/styles",
    files: ["main.krg.tsx"],
    ...extra,
    sources: {
      "main.krg.tsx": `import {GuiFile,Container,Button,Text,Icon,NativeButton,NativeText,Window,GuiButton,Stack,For,ScriptedWindow,type GuiClass,type GuiElement} from 'krieg-lang/ui'; import styles from './panel.krg.css'; GuiFile('interface/panel.gui', ${layout});`,
      "panel.krg.css": css,
      ...extra.sources,
    },
  });
}
function output(result, file = "interface/panel.gui") {
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  return emitCompileOutput(result.outputs.find((item) => item.path === file));
}
function rejects(css, layout, code, extra = {}) {
  const result = compile(css, layout, extra);
  assert.equal(result.success, false);
  assert.deepEqual(result.outputs, []);
  const diagnostic = result.diagnostics.find((issue) => issue.code === code);
  assert.ok(diagnostic, JSON.stringify(result.diagnostics, null, 2));
  return diagnostic;
}
function write(root, name, value) {
  const file = join(root, name);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, value);
  return file;
}
function json(root, name, value) {
  return write(root, name, JSON.stringify(value, null, 2));
}
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "krieg-styles-"));
  t.after(() => {
    const readonlyDirectory = join(root, "node_modules/@fixtures/installed-kit/src");
    if (existsSync(readonlyDirectory)) chmodSync(readonlyDirectory, 0o755);
    rmSync(root, { recursive: true, force: true });
  });
  json(root, "package.json", { name: "style-consumer", version: "1.0.0", type: "module" });
  json(root, "krgconfig.json", { name: "style-consumer", sourceDir: "src", outDir: "build/mod" });
  json(root, "tsconfig.json", {
    extends: "./.krieg/tsconfig.json",
    include: ["src/**/*.krg.ts", "src/**/*.krg.tsx", ".krieg/types/**/*.d.ts"],
  });
  return root;
}
function diagnostics(service) {
  return ts.getPreEmitDiagnostics(service.getProgram()).map((issue) => ({
    code: issue.code,
    message: ts.flattenDiagnosticMessageText(issue.messageText, "\n"),
  }));
}

test("styles lower native fields with module tokens, composition, ordered overrides and atomic inline props", () => {
  const result = compile(
    `
    :root { --base-font: hoi_16mbs; --font: var(--base-font); --width: 200px; }
    .base { font:var(--font); size:var(--width) 30px; position:10px 20px; }
    .button { composes:base; font:hoi_18mbs; sprite-type:"GFX_button"; }
    .large { size:240px var(--missing, 40px); font:hoi_20mbs; }
  `,
    '<Button name="button" className={[styles.button,styles.large]} position={{x:7,y:9}} font="hoi_inline"/>',
  );
  const gui = output(result);
  assert.match(gui, /buttonType = \{/);
  assert.match(gui, /position = \{\s+x = 7\s+y = 9/);
  assert.match(gui, /size = \{\s+x = 240\s+y = 40/);
  assert.match(gui, /buttonFont = "hoi_inline"/);
  assert.match(gui, /spriteType = "GFX_button"/);
  assert.equal((gui.match(/buttonFont =/g) ?? []).length, 1);
  assert.doesNotMatch(gui, /className|composes|--font|px|var\(/);
  assert.match(output(compile(".button {font:old; font:new;}")), /buttonFont = "new"/);
});

test("styles apply to source components, schema-native controls and JSX intrinsic controls", () => {
  const result = compile(
    ".button {position:4 8; size:100 24; font:hoi_18mbs;} .badge {sprite-type:GFX_badge;}",
    '<><NativeButton name="native" className={styles.button}/><buttonType name="intrinsic" className={styles.button}/><Icon name="badge" className={styles.badge}/></>',
  );
  const gui = output(result);
  assert.equal((gui.match(/buttonFont = "hoi_18mbs"/g) ?? []).length, 2);
  assert.equal((gui.match(/size = \{\s+x = 100\s+y = 24/g) ?? []).length, 2);
  assert.match(gui, /spriteType = "GFX_badge"/);
  const legacy = output(
    compile(
      ".geometry {size:100px 24px;position:10% @offset;} .button {size:100 24;font:hoi_18mbs;}",
      '<><Window name="legacy" className={styles.geometry}/><GuiButton name="button" className={styles.button}/></>',
    ),
  );
  assert.match(legacy.split("\tguiButtonType")[0], /size = \{\s+x = 100\s+y = 24/);
  assert.match(legacy, /position = \{\s+x = 10%\s+y = @offset/);
  assert.match(legacy, /guiButtonType = \{[\s\S]*buttonFont = "hoi_18mbs"/);
  rejects(
    ".button {font:hoi_18mbs;}",
    '<Icon name="missing" className={styles.button}/>',
    "TS2322",
  );
  const component = compile(".button {font:hoi_18mbs;}", undefined, {
    sources: {
      "component.krg.tsx": `import {Button,type GuiClass,type GuiElement} from 'krieg-lang/ui'; export function Row(props:{style:GuiClass}):GuiElement {return <Button name="row" className={props.style}/>;}`,
      "main.krg.tsx": `import {GuiFile} from 'krieg-lang/ui'; import {Row} from './component.krg.js'; import styles from './panel.krg.css'; GuiFile('interface/panel.gui',<Row style={styles.button}/>);`,
    },
  });
  assert.match(output(component), /buttonFont = "hoi_18mbs"/);
});

test("styles fail closed on unsupported selectors, properties, values and composition", () => {
  for (const css of [
    ".button:hover {font:x;}",
    ".parent .button {font:x;}",
    ".button, .other {font:x;}",
    "@media (width:100px) {.button {font:x;}}",
    ".button {.child {font:x;}}",
  ])
    assert.equal(rejects(css, undefined, "KRG2202").file, "/virtual/styles/panel.krg.css");
  for (const css of [
    ".button {display:flex;}",
    ".button {name:bad;}",
    ".button {click:bad;}",
    ".button {--local:10;}",
  ])
    rejects(css, undefined, "KRG2204");
  for (const css of [
    ".button {position:1rem 2px;}",
    ".button {size:calc(2 + 3) 4;}",
    ".button {position:1 2 3;}",
    ".button {hide:maybe;}",
    ".button {frame:1.5;}",
    ".button {font:two words;}",
  ])
    rejects(css, undefined, "KRG2206");
  rejects(".button {font:x !important;}", undefined, "KRG2203");
  rejects(".button {font:x;} .button {font:y;}", undefined, "KRG2205");
  rejects(":root {--x:1;--x:2;} .button {frame:1;}", undefined, "KRG2205");
  rejects(".button {font:var(--missing);}", undefined, "KRG2207");
  rejects(":root {--a:var(--b);--b:var(--a);} .button {font:var(--a);}", undefined, "KRG2208");
  rejects(".button {composes:missing;}", undefined, "KRG2209");
  rejects(".button {composes:other;} .other {composes:button;}", undefined, "KRG2209");
  rejects(".button {font:x;", undefined, "KRG2200");
});

test("the compiler reports native control compatibility at the stylesheet declaration", () => {
  const issue = rejects(
    ".button {\n  font: hoi_18mbs;\n}",
    '<Container name="wrong" className={styles.button}/>',
    "KRG2211",
  );
  assert.equal(issue.file, "/virtual/styles/panel.krg.css");
  assert.equal(issue.line, 2);
  assert.equal(issue.column, 3);
  assert.match(issue.message, /containerWindowType at \/virtual\/styles\/main.krg.tsx:/);
  rejects(".button {orientation:BOTTOMISH;}", undefined, "KRG2211");
  rejects(
    ".button {padding:1 2;}",
    '<Text name="wrong" text="TEXT" className={styles.button}/>',
    "KRG2211",
  );
  rejects(".button {font:x;}", '<Button name="wrong" className={styles.unknown}/>', "TS2339");
  rejects(".button {font:x;}", '<Button name="wrong" className="button"/>', "TS2322");
});

test("static Stack and For preserve ScriptedWindow bindings while computing native coordinates", () => {
  const result = compile(".button {size:100px 24px; font:hoi_18mbs;}", undefined, {
    sources: {
      "main.krg.tsx": `import {ScriptedWindow,Stack,For} from 'krieg-lang/ui'; import styles from './panel.krg.css';
      const choices=[{name:'first',cost:5},{name:'second',cost:10}] as const;
      ScriptedWindow({name:'panel',path:'interface/panel.gui',context:'player_context'},ui=><ui.Container name="window"><Stack position={{x:12,y:30}} gap={6}><For each={choices}>{choice=><ui.Button name={choice.name} className={styles.button} click={country=>country.effects.addPoliticalPower(-choice.cost)}/>}</For></Stack></ui.Container>);`,
    },
  });
  const gui = output(result);
  assert.match(gui, /name = "first"[\s\S]*position = \{\s+x = 12\s+y = 30/);
  assert.match(gui, /name = "second"[\s\S]*position = \{\s+x = 12\s+y = 60/);
  assert.equal((gui.match(/containerWindowType =/g) ?? []).length, 1);
  const script = output(result, "common/scripted_guis/krieg_panel.txt");
  assert.match(script, /first_click = \{\s+add_political_power = -5/);
  assert.match(script, /second_click = \{\s+add_political_power = -10/);
  rejects(
    ".button {font:x;}",
    '<Stack><Button name="no_size" className={styles.button}/></Stack>',
    "KRG2214",
  );
  rejects(
    ".button {size:100 20;position:1 2;}",
    '<Stack><Button name="positioned" className={styles.button}/></Stack>',
    "KRG2214",
  );
  rejects(
    ".button {size:100 20%;}",
    '<Stack><Button name="relative" className={styles.button}/></Stack>',
    "KRG2214",
  );
  rejects(
    ".button {size:100 20;orientation:CENTER;}",
    '<Stack><Button name="centered" className={styles.button}/></Stack>',
    "KRG2214",
  );
  const horizontal = output(
    compile(
      ".button {size:10 20;}",
      '<Stack direction="horizontal" gap={2}><Button name="one" className={styles.button}/><Button name="two" className={styles.button}/></Stack>',
    ),
  );
  assert.match(horizontal, /name = "two"[\s\S]*position = \{\s+x = 12\s+y = 0/);
});

test("stock TypeScript and LanguageService resolve isolated styles from local and readonly installed source packages", (t) => {
  const root = fixture(t);
  const local = join(root, "packages/local-kit");
  const installed = join(root, "node_modules/@fixtures/installed-kit");
  for (const [dir, name, unique, font] of [
    [local, "@fixtures/local-kit", "localOnly", "hoi_local"],
    [installed, "@fixtures/installed-kit", "installedOnly", "hoi_installed"],
  ]) {
    json(dir, "package.json", {
      name,
      version: "1.0.0",
      type: "module",
      krieg: {
        config: "krgconfig.json",
        exports: { ".": "src/index.krg.tsx", "./theme": "src/panel.krg.css" },
      },
    });
    json(dir, "krgconfig.json", { name: unique, sourceDir: "src", outDir: "build/mod" });
    write(dir, "src/panel.krg.css", `.shared {font:${font};} .${unique} {position:1 2;}`);
    write(
      dir,
      "src/index.krg.tsx",
      `import {Button,type GuiElement} from 'krieg-lang/ui'; import s from './panel.krg.css'; export function Row(props:{name:string}):GuiElement {return <Button name={props.name} className={s.shared}/>;}`,
    );
  }
  chmodSync(join(installed, "src/panel.krg.css"), 0o444);
  chmodSync(join(installed, "src/index.krg.tsx"), 0o444);
  chmodSync(join(installed, "src"), 0o555);
  json(root, "package.json", {
    name: "style-consumer",
    version: "1.0.0",
    type: "module",
    dependencies: { "@fixtures/installed-kit": "1.0.0" },
  });
  json(root, "krgconfig.json", {
    name: "style-consumer",
    sourceDir: "src",
    outDir: "build/mod",
    dependencies: ["./packages/local-kit"],
  });
  const source = `import {GuiFile,Button} from 'krieg-lang/ui';
import {Row as LocalRow} from '@fixtures/local-kit';
import {Row as InstalledRow} from '@fixtures/installed-kit';
import localStyles from '@fixtures/local-kit/theme';
import installedStyles from '@fixtures/installed-kit/theme';
const a=localStyles.localOnly; const b=installedStyles.installedOnly;
GuiFile('interface/packages.gui',<><LocalRow name="local"/><InstalledRow name="installed"/><Button name="direct" className={[localStyles.shared,installedStyles.shared]}/></>);`;
  const main = write(root, "src/main.krg.tsx", source);
  const world = writeEditorProject(root);
  assert.deepEqual(world.diagnostics, []);
  const service = editorService(join(root, "tsconfig.json"));
  assert.deepEqual(diagnostics(service), []);
  for (const [variable, expected] of [
    ["localStyles", ["localOnly", "shared"]],
    ["installedStyles", ["installedOnly", "shared"]],
  ]) {
    const position =
      source.indexOf(`${variable}.`, source.indexOf("const a=")) + variable.length + 1;
    assert.deepEqual(
      service
        .getCompletionsAtPosition(main, position, {})
        ?.entries.map((entry) => entry.name)
        .sort(),
      expected,
    );
  }
  service.dispose();
  const tsc = spawnSync(
    process.execPath,
    [resolve("node_modules/typescript/bin/tsc"), "--noEmit", "-p", join(root, "tsconfig.json")],
    { encoding: "utf8" },
  );
  assert.equal(tsc.status, 0, tsc.stdout + tsc.stderr);
  const build = buildProject(root, { writeEditor: true });
  assert.equal(build.success, true, JSON.stringify(build.diagnostics));
  const gui = readFileSync(join(build.outDir, "interface/packages.gui"), "utf8");
  assert.match(gui, /name = "local"\s+buttonFont = "hoi_local"/);
  assert.match(gui, /name = "installed"\s+buttonFont = "hoi_installed"/);
  assert.match(gui, /name = "direct"\s+buttonFont = "hoi_installed"/);
  assert.deepEqual(readdirSync(join(installed, "src")).sort(), ["index.krg.tsx", "panel.krg.css"]);
  assert.deepEqual(readdirSync(join(local, "src")).sort(), ["index.krg.tsx", "panel.krg.css"]);
  assert.ok(!existsSync(join(root, "src/main.krg.d.css.ts")));
  const generated = JSON.parse(readFileSync(join(root, ".krieg/tsconfig.json"), "utf8"));
  const localDecl = resolve(
    root,
    ".krieg",
    generated.compilerOptions.paths["@fixtures/local-kit/theme"][0],
  );
  const installedDecl = resolve(
    root,
    ".krieg",
    generated.compilerOptions.paths["@fixtures/installed-kit/theme"][0],
  );
  assert.notEqual(localDecl, installedDecl);
  const before = statSync(localDecl).mtimeMs;
  writeEditorProject(root);
  assert.equal(statSync(localDecl).mtimeMs, before);
  write(local, "src/panel.krg.css", ".shared {font:hoi_local;} .renamed {position:1 2;}");
  writeEditorProject(root);
  const refreshed = editorService(join(root, "tsconfig.json"));
  assert.ok(
    diagnostics(refreshed).some(
      (issue) => issue.code === 2339 && issue.message.includes("localOnly"),
    ),
  );
  refreshed.dispose();
});

test("CLI build and source tracing retain the winning CSS declaration and inline override provenance", (t) => {
  const root = fixture(t);
  write(
    root,
    "src/panel.krg.css",
    ".base {\n font:hoi_old;\n size:100 20;\n}\n.button {\n composes:base;\n font:hoi_new;\n}\n",
  );
  write(
    root,
    "src/main.krg.tsx",
    `import {GuiFile,Button} from 'krieg-lang/ui';\nimport styles from './panel.krg.css';\nGuiFile('interface/panel.gui',<>\n<Button name="styled" className={styles.button}/>\n<Button name="inline" className={styles.button} font="hoi_inline"/>\n</>);`,
  );
  const cli = spawnSync(process.execPath, [resolve("dist/cli.js"), "build", root, "--json"], {
    encoding: "utf8",
  });
  assert.equal(cli.status, 0, cli.stdout + cli.stderr);
  const result = JSON.parse(cli.stdout);
  assert.equal(result.success, true);
  const lines = readFileSync(join(result.outDir, "interface/panel.gui"), "utf8").split("\n");
  const styled = traceOutput(
    root,
    "interface/panel.gui",
    lines.findIndex((line) => line.includes('buttonFont = "hoi_new"')) + 1,
  );
  assert.equal(styled.precision, "style");
  assert.equal(styled.source, "src/panel.krg.css");
  assert.equal(styled.line, 7);
  assert.ok(styled.via.some((item) => item.source === "src/main.krg.tsx" && item.line === 4));
  const inline = traceOutput(
    root,
    "interface/panel.gui",
    lines.findIndex((line) => line.includes('buttonFont = "hoi_inline"')) + 1,
  );
  assert.notEqual(inline.precision, "style");
  assert.equal(inline.source, "src/main.krg.tsx");
});

test("ESLint shares CSS diagnostics and Prettier formats the supported syntax", async () => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [plugin.configs.recommended, plugin.configs.styles],
  });
  const valid = await eslint.lintText(":root {--font:hoi_18mbs;} .button {font:var(--font);}", {
    filePath: "panel.krg.css",
  });
  assert.equal(valid[0].errorCount, 0, JSON.stringify(valid[0].messages));
  const invalid = await eslint.lintText(".button {\n display:flex;\n}", {
    filePath: "panel.krg.css",
  });
  assert.equal(invalid[0].errorCount, 1);
  assert.equal(invalid[0].messages[0].line, 2);
  assert.match(invalid[0].messages[0].message, /KRG2204/);
  const imports = await eslint.lintText("import styles from './panel.krg.css';", {
    filePath: "main.krg.tsx",
  });
  assert.equal(imports[0].errorCount, 0);
  const formatted = await prettier.format(".button{position:1px 2px;font:var(--font)}", {
    filepath: "panel.krg.css",
  });
  assert.match(formatted, /position: 1px 2px;/);
});
