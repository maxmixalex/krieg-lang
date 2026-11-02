#!/usr/bin/env node
import { existsSync, watch, type FSWatcher } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import {
  buildProject,
  initProject,
  importProject,
  loadConfig,
  packProject,
  resolveDependencies,
  writeEditorProject,
} from "./project/index.js";
import { compileCorpusBatch } from "./corpus/compiler-runner.js";
import { runCorpus } from "./corpus/index.js";
import type { BuildResult, ProjectDiagnostic } from "./project/types.js";

const help = `Krieg 0.1.0 — statically compile TypeScript to an HOI4 mod

  krieg init <directory>                 Create a complete example project
  krieg check [project]                  Check types, scripts, assets and maps
  krieg build [project]                  Build a mod and launcher descriptor
  krieg pack [project] [--out file.zip]   Build a portable, reproducible mod ZIP
  krieg world [project]                  Refresh editor project declarations
  krieg watch [project]                  Rebuild when project inputs change
  krieg import <input> --out <directory> Convert native files to ordered .krg.ts
      --path events/name.txt            Required game path for a single-file import
  krieg corpus <dataset> --out report.json
      --name vanilla|KR|TNO              Label this dataset
      --generated <directory>           Write reconstructed native files
      --imported <directory>            Write migrated .krg.ts sources
      --skip-typecheck                  Explicitly skip the full TS compiler pass

  --json                                Machine-readable results
  --version                             Print compiler version
  --help                                Show help
`;

function diagnostics(items: ProjectDiagnostic[]): void {
  for (const item of items.slice(0, 60))
    console.error(
      `${item.file ?? "project"}${item.line ? `:${item.line}:${item.column ?? 1}` : ""}: ${item.severity} ${item.code}: ${item.message}`,
    );
  if (items.length > 60)
    console.error(`... ${items.length - 60} more diagnostics. Use --json to see all.`);
}

function showBuild(result: BuildResult, json: boolean): void {
  if (json) console.log(JSON.stringify(result, null, 2));
  else {
    diagnostics(result.diagnostics);
    console.log(
      result.success
        ? `Validated ${result.files.length} files (${result.files.reduce((n, f) => n + f.bytes, 0)} bytes).${result.launcherFile ? `\nMod: ${result.outDir}\nLauncher: ${result.launcherFile}` : ""}`
        : "Build failed; previous output was preserved.",
    );
  }
  if (!result.success) process.exitCode = 1;
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean" },
      json: { type: "boolean" },
      out: { type: "string", short: "o" },
      path: { type: "string" },
      name: { type: "string" },
      generated: { type: "string" },
      imported: { type: "string" },
      "skip-typecheck": { type: "boolean" },
    },
  });
  const [command, argument] = positionals;
  if (values.version) {
    console.log("0.1.0");
    return;
  }
  if (values.help || !command) {
    console.log(help);
    return;
  }
  if (positionals.length > 2) throw new Error("Too many positional arguments. See krieg --help.");
  const project = argument ?? ".";
  switch (command) {
    case "init": {
      if (!argument) throw new Error("krieg init needs a destination directory.");
      const root = initProject(argument);
      console.log(
        values.json
          ? JSON.stringify({ project: root })
          : `Created ${root}. Install Krieg in the project, then run npx krieg build.`,
      );
      break;
    }
    case "check":
    case "build": {
      writeEditorProject(project);
      showBuild(buildProject(project, { check: command === "check" }), values.json === true);
      break;
    }
    case "world":
    case "types": {
      const world = writeEditorProject(project);
      const summary = {
        countries: world.countries.length,
        states: world.states.length,
        assets: world.assets.length,
        diagnostics: world.diagnostics,
      };
      console.log(JSON.stringify(summary, null, 2));
      if (world.diagnostics.some((d) => d.severity === "error")) process.exitCode = 1;
      break;
    }
    case "pack": {
      writeEditorProject(project);
      const result = packProject(project, values.out);
      if (values.json) console.log(JSON.stringify(result, null, 2));
      else {
        showBuild(result.build, false);
        if (result.archive) console.log(`Archive: ${result.archive}`);
      }
      if (!result.build.success) process.exitCode = 1;
      break;
    }
    case "import": {
      if (!argument || !values.out)
        throw new Error("krieg import needs an input and --out directory.");
      const result = importProject(argument, values.out, { outputPath: values.path });
      if (result.success) writeEditorProject(result.destination);
      if (values.json) console.log(JSON.stringify(result, null, 2));
      else {
        diagnostics(result.diagnostics);
        console.log(
          `${result.converted} scripts converted, ${result.copied} other files copied. ${result.success ? `Project: ${result.destination}` : "Import failed; destination was not replaced."}`,
        );
      }
      if (!result.success) process.exitCode = 1;
      break;
    }
    case "corpus": {
      if (!argument || !values.out)
        throw new Error("krieg corpus needs a dataset directory and --out report.json.");
      const report = await runCorpus({
        rootDir: resolve(argument),
        name: values.name,
        reportPath: resolve(values.out),
        generatedDir: values.generated ? resolve(values.generated) : undefined,
        importedDir: values.imported ? resolve(values.imported) : undefined,
        compileBatch: values["skip-typecheck"] ? undefined : compileCorpusBatch,
        onProgress: (progress) => {
          if (
            !values.json &&
            (progress.processed % 100 === 0 || progress.processed === progress.total)
          )
            console.error(`${progress.processed}/${progress.total} ${progress.path}`);
        },
      });
      console.log(
        JSON.stringify(
          values.json
            ? report
            : {
                name: report.name,
                inventory: report.inventory,
                levels: report.levels,
                report: resolve(values.out),
              },
          null,
          2,
        ),
      );
      if (Object.values(report.levels).some((level) => level.failed > 0)) process.exitCode = 1;
      break;
    }
    case "watch": {
      if (values.json)
        throw new Error("--json is not supported with the continuous watch command.");
      const config = loadConfig(project);
      const graph = resolveDependencies(config);
      let timer: NodeJS.Timeout | undefined;
      let building = false;
      const rebuild = (): void => {
        if (building) return;
        building = true;
        try {
          writeEditorProject(project);
          showBuild(buildProject(project), false);
        } catch (error) {
          console.error((error as Error).message);
        } finally {
          building = false;
        }
      };
      rebuild();
      const watchers: FSWatcher[] = [];
      for (const { config: layer } of graph.layers)
        if (existsSync(layer.rootDir))
          watchers.push(
            watch(layer.rootDir, { recursive: true }, (_event, file) => {
              const path = String(file ?? "").replaceAll("\\", "/");
              if (
                !path ||
                path.startsWith(".krieg/") ||
                path.startsWith("node_modules/") ||
                path.startsWith(".git/") ||
                path === layer.outDir ||
                path.startsWith(layer.outDir + "/") ||
                path.includes("-krieg-") ||
                path.endsWith(".mod") ||
                path.startsWith("build/")
              )
                return;
              if (timer) clearTimeout(timer);
              timer = setTimeout(rebuild, 150);
            }),
          );
      console.log(`Watching ${config.rootDir}. Press Ctrl+C to stop.`);
      await new Promise<void>((done) => {
        const stop = (): void => {
          if (timer) clearTimeout(timer);
          for (const watcher of watchers) watcher.close();
          done();
        };
        process.once("SIGINT", stop);
        process.once("SIGTERM", stop);
      });
      break;
    }
    default:
      throw new Error(`Unknown command ${command}. See krieg --help.`);
  }
}
main().catch((error: unknown) => {
  console.error(`krieg: ${(error as Error).message}`);
  process.exitCode = 1;
});
