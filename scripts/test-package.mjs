import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const repo = process.cwd();
const root = mkdtempSync(join(tmpdir(), "krieg-package-"));
function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: process.env,
    shell: process.platform === "win32",
  });
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
try {
  run("npm", ["pack", "--pack-destination", root], repo);
  const tarball = join(
    root,
    readdirSync(root).find((n) => n.endsWith(".tgz")),
  );
  const project = join(root, "example");
  run(process.execPath, [join(repo, "dist/cli.js"), "init", project]);
  run("npm", ["install", "--ignore-scripts", tarball], project);
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
  const uiSource = `import {GuiFile, Container, Text} from "krieg-lang/ui";
export default GuiFile("interface/package_demo.gui",
  <Container name="package_demo" position={{x:10,y:20}} size={{width:300,height:100}}>
    <Text name="label" text="package_demo_label" font="hoi_18mbs"/>
  </Container>);
`;
  writeFileSync(uiPath, uiSource);
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
  assert.equal(
    run(process.execPath, [cli, "--version"], project).trim(),
    JSON.parse(readFileSync(join(repo, "package.json"), "utf8")).version,
  );
  run(process.execPath, [cli, "check"], project);
  run(process.execPath, [cli, "build"], project);
  const tsc = join(project, "node_modules/typescript/bin/tsc");
  run(process.execPath, [tsc, "--noEmit"], project);
  const gui = readFileSync(join(project, "build/mod/interface/package_demo.gui"), "utf8");
  assert.match(gui, /containerWindowType\s*=\s*\{/);
  assert.match(gui, /name = "package_demo"/);
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
  const invalidTypes = spawnSync(process.execPath, [tsc, "--noEmit"], {
    cwd: project,
    encoding: "utf8",
  });
  assert.notEqual(invalidTypes.status, 0);
  assert.match(invalidTypes.stdout + invalidTypes.stderr, /TS2322/);
  writeFileSync(uiPath, uiSource);
  run(process.execPath, [cli, "pack"], project);
  if (!existsSync(join(project, "build/mod/descriptor.mod")))
    throw new Error("Installed package did not build a mod.");
  console.log(
    "Packed package: init, npm install, all public entrypoints, TSX, YAML, typed Lua defines, check, build, native tsc (valid and invalid), and mod ZIP succeeded.",
  );
} finally {
  rmSync(root, { recursive: true, force: true });
}
