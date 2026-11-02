import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

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
  run(process.execPath, [cli, "check"], project);
  run(process.execPath, [cli, "build"], project);
  run(process.execPath, [join(project, "node_modules/typescript/bin/tsc"), "--noEmit"], project);
  run(process.execPath, [cli, "pack"], project);
  if (!existsSync(join(project, "build/mod/descriptor.mod")))
    throw new Error("Installed package did not build a mod.");
  console.log(
    "Packed package: init, npm install, check, build, native tsc, and mod ZIP succeeded.",
  );
} finally {
  rmSync(root, { recursive: true, force: true });
}
