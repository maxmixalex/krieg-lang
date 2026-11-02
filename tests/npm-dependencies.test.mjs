import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import {
  buildProject,
  loadConfig,
  resolveDependencies,
  writeEditorProject,
} from "../dist/project/index.js";
import { gamePath } from "../dist/project/files.js";

function write(root, path, contents) {
  const destination = join(root, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, contents);
}

function json(root, path, contents) {
  write(root, path, JSON.stringify(contents, null, 2));
}

function edit(root, path, update) {
  const value = JSON.parse(readFileSync(join(root, path), "utf8"));
  update(value);
  json(root, path, value);
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "krieg-npm-dependencies-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  json(root, "package.json", {
    name: "consumer",
    version: "1.0.0",
    type: "module",
    dependencies: {},
  });
  json(root, "krgconfig.json", { name: "consumer", sourceDir: "src", outDir: "build/mod" });
  write(root, "src/main.krg.ts", "export const marker = 0;\n");
  return root;
}

/** The on-disk result of a local npm installation; never contacts a registry. */
function installedPackage(parent, name, options = {}) {
  const root = join(parent, "node_modules", ...name.split("/"));
  const manifest = {
    name,
    version: options.version ?? "1.0.0",
    type: "module",
    dependencies: options.dependencies ?? {},
    krieg: {
      config: "krgconfig.json",
      exports: options.exports ?? { ".": "src/index.krg.ts" },
    },
  };
  json(root, "package.json", manifest);
  json(root, "krgconfig.json", {
    name: name.replace(/^@/, "").replaceAll("/", "-"),
    sourceDir: "src",
    outDir: "build/mod",
  });
  write(root, "src/index.krg.ts", "export const marker = 0;\n");
  return root;
}

function depend(root, dependencies) {
  edit(root, "package.json", (manifest) => {
    manifest.dependencies = dependencies;
  });
}

function success(result) {
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
}

test("ordinary npm dependencies opt in, export helpers and preserve typed scripted handles", (t) => {
  const root = fixture(t);
  const library = installedPackage(root, "@fixtures/rewards", {
    exports: { ".": "src/index.krg.ts", "./rewards": "src/rewards.krg.ts" },
  });
  depend(root, { "@fixtures/rewards": "1.0.0" });
  write(
    library,
    "src/index.krg.ts",
    'export { sharedReward, isPrepared } from "./rewards.krg.js";',
  );
  write(
    library,
    "src/rewards.krg.ts",
    `
    import { ScriptedEffect, ScriptedTrigger, type CountryScope } from "krieg-lang/hoi4";
    export const sharedReward = ScriptedEffect("package_reward", (country: CountryScope) => {
      country.effects.addPoliticalPower(7);
    });
    export const isPrepared = ScriptedTrigger("package_prepared", (country: CountryScope) =>
      country.triggers.hasCountryFlag("ready"));
    export function grantReward(country: CountryScope, amount: number): void {
      country.effects.addPoliticalPower(amount);
    }
  `,
  );
  write(
    root,
    "src/main.krg.ts",
    `
    import { CountryEvent, type CountryScope } from "krieg-lang/hoi4";
    import { sharedReward, isPrepared } from "@fixtures/rewards";
    import { grantReward } from "@fixtures/rewards/rewards";
    CountryEvent({ id: "consumer.1", hidden: true, isTriggeredOnly: true,
      immediate: (country: CountryScope) => {
        if (country.test(isPrepared)) {
          country.run(sharedReward);
          grantReward(country, 3);
        }
      },
    });
  `,
  );
  const graph = resolveDependencies(loadConfig(root));
  assert.deepEqual(
    graph.layers.map((layer) => layer.packageName ?? "root"),
    ["@fixtures/rewards", "root"],
  );
  assert.equal(graph.moduleFiles["@fixtures/rewards"], join(library, "src/index.krg.ts"));
  assert.equal(graph.moduleFiles["@fixtures/rewards/rewards"], join(library, "src/rewards.krg.ts"));
  const result = buildProject(root);
  success(result);
  const event = result.files.find((file) => file.path.startsWith("events/"));
  const text = readFileSync(join(result.outDir, event.path), "utf8");
  assert.match(text, /package_prepared = yes/);
  assert.match(text, /package_reward = yes/);
  assert.match(text, /add_political_power = 3/);
  assert.equal(
    result.files.filter((file) => file.path.includes("krieg_package_reward.txt")).length,
    1,
  );
  assert.equal(
    result.files.filter((file) => file.path.includes("krieg_package_prepared.txt")).length,
    1,
  );
  writeEditorProject(root);
  const editor = JSON.parse(readFileSync(join(root, ".krieg/tsconfig.json"), "utf8"));
  assert.ok(editor.compilerOptions.paths["@fixtures/rewards"]);
  assert.ok(editor.compilerOptions.paths["@fixtures/rewards/rewards"]);

  const previous = readFileSync(join(result.outDir, ".krieg-build.json"), "utf8");
  write(
    root,
    "src/main.krg.ts",
    `
    import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
    import { grantReward } from "@fixtures/rewards/rewards";
    ScriptedEffect("invalid", (country: CountryScope) => grantReward(country, "wrong"));
  `,
  );
  const invalid = buildProject(root);
  assert.equal(invalid.success, false);
  assert.ok(invalid.diagnostics.some((diagnostic) => diagnostic.code.startsWith("TS")));
  assert.equal(readFileSync(join(result.outDir, ".krieg-build.json"), "utf8"), previous);
});

test("ordinary JavaScript packages are ignored until explicitly requested as Krieg dependencies", (t) => {
  const root = fixture(t);
  json(root, "node_modules/plain-runtime/package.json", {
    name: "plain-runtime",
    version: "1.0.0",
    main: "index.js",
  });
  write(root, "node_modules/plain-runtime/index.js", 'throw new Error("must never execute");');
  depend(root, { "plain-runtime": "1.0.0" });
  success(buildProject(root));
  edit(root, "krgconfig.json", (config) => {
    config.dependencies = ["plain-runtime"];
  });
  const invalid = buildProject(root);
  assert.equal(invalid.success, false);
  assert.ok(
    invalid.diagnostics.some((diagnostic) =>
      /missing package.json krieg field/.test(diagnostic.message),
    ),
  );
});

test("package assets keep dependency order and require explicit same-path override", (t) => {
  const root = fixture(t);
  const library = installedPackage(root, "@fixtures/assets");
  depend(root, { "@fixtures/assets": "1.0.0" });
  write(library, "assets/common/scripted_variables/shared.txt", "@shared_value = 1\n");
  edit(library, "krgconfig.json", (config) => {
    config.assets = [{ from: "assets", to: "" }];
  });
  write(root, "assets/common/scripted_variables/shared.txt", "@shared_value = 2\n");
  edit(root, "krgconfig.json", (config) => {
    config.assets = [{ from: "assets", to: "" }];
  });
  const conflict = buildProject(root);
  assert.equal(conflict.success, false);
  assert.ok(conflict.diagnostics.some((diagnostic) => diagnostic.code === "KRG_OUTPUT_CONFLICT"));
  edit(root, "krgconfig.json", (config) => {
    config.assets[0].override = true;
  });
  const result = buildProject(root);
  success(result);
  assert.equal(
    readFileSync(join(result.outDir, "common/scripted_variables/shared.txt"), "utf8"),
    "@shared_value = 2\n",
  );
});

test("replacePath removes direct dependency files while retaining nested folders", (t) => {
  const root = fixture(t);
  const library = installedPackage(root, "@fixtures/layer");
  depend(root, { "@fixtures/layer": "1.0.0" });
  write(library, "assets/common/scripted_variables/old.txt", "@old_value = 1\n");
  write(library, "assets/common/scripted_variables/nested/retained.txt", "@retained_value = 2\n");
  edit(library, "krgconfig.json", (config) => {
    config.assets = [{ from: "assets", to: "" }];
  });
  write(root, "assets/common/scripted_variables/new.txt", "@new_value = 3\n");
  edit(root, "krgconfig.json", (config) => {
    config.assets = [{ from: "assets", to: "" }];
    config.mod = { replacePath: ["common/scripted_variables"] };
  });
  const result = buildProject(root);
  success(result);
  const paths = result.files.map((file) => file.path);
  assert.ok(!paths.includes("common/scripted_variables/old.txt"));
  assert.ok(paths.includes("common/scripted_variables/nested/retained.txt"));
  assert.ok(paths.includes("common/scripted_variables/new.txt"));
  assert.match(
    readFileSync(join(result.outDir, "descriptor.mod"), "utf8"),
    /replace_path="common\/scripted_variables"/,
  );
});

test("replacePath also replaces generated scripts from earlier dependency layers", (t) => {
  const root = fixture(t);
  const library = installedPackage(root, "@fixtures/generated-layer");
  depend(root, { "@fixtures/generated-layer": "1.0.0" });
  write(
    library,
    "src/index.krg.ts",
    `
    import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
    ScriptedEffect("dependency_old", (country: CountryScope) => country.effects.addPoliticalPower(1));
  `,
  );
  write(
    root,
    "src/main.krg.ts",
    `
    import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
    ScriptedEffect("consumer_new", (country: CountryScope) => country.effects.addPoliticalPower(2));
  `,
  );
  edit(root, "krgconfig.json", (config) => {
    config.mod = { replacePath: ["common/scripted_effects"] };
  });
  const result = buildProject(root);
  success(result);
  const paths = result.files.map((file) => file.path);
  assert.ok(!paths.includes("common/scripted_effects/krieg_dependency_old.txt"));
  assert.ok(paths.includes("common/scripted_effects/krieg_consumer_new.txt"));
});

test("installed package cycles and duplicated package versions are diagnosed", (t) => {
  const root = fixture(t);
  const first = installedPackage(root, "@fixtures/first", {
    dependencies: { "@fixtures/second": "1.0.0" },
  });
  const second = installedPackage(root, "@fixtures/second", {
    dependencies: { "@fixtures/first": "1.0.0" },
  });
  depend(root, { "@fixtures/first": "1.0.0" });
  const cycle = buildProject(root);
  assert.equal(cycle.success, false);
  assert.ok(cycle.diagnostics.some((diagnostic) => /Cyclic Krieg/.test(diagnostic.message)));

  depend(first, { "@fixtures/shared": "1.0.0" });
  depend(second, { "@fixtures/shared": "2.0.0" });
  installedPackage(root, "@fixtures/shared", { version: "1.0.0" });
  installedPackage(second, "@fixtures/shared", { version: "2.0.0" });
  depend(root, { "@fixtures/first": "1.0.0", "@fixtures/second": "1.0.0" });
  const versions = buildProject(root);
  assert.equal(versions.success, false);
  assert.ok(
    versions.diagnostics.some((diagnostic) =>
      /Two installed copies of @fixtures\/shared/.test(diagnostic.message),
    ),
  );
});

test("package metadata cannot export sources outside its package or ordinary TypeScript files", (t) => {
  const root = fixture(t);
  const library = installedPackage(root, "@fixtures/invalid");
  depend(root, { "@fixtures/invalid": "1.0.0" });
  edit(library, "package.json", (manifest) => {
    manifest.krieg.exports["."] = "../../outside.krg.ts";
  });
  const traversal = buildProject(root);
  assert.equal(traversal.success, false);
  assert.ok(traversal.diagnostics.some((diagnostic) => /path|escapes/i.test(diagnostic.message)));
  edit(library, "package.json", (manifest) => {
    manifest.krieg.exports["."] = "src/index.ts";
  });
  const extension = buildProject(root);
  assert.equal(extension.success, false);
  assert.ok(
    extension.diagnostics.some((diagnostic) => /Invalid Krieg export/.test(diagnostic.message)),
  );
});

test("portable project paths reject Windows devices and trailing aliases", (t) => {
  for (const path of [
    "gfx/CON.dds",
    "gfx/aux",
    "COM1.txt",
    "gfx/Lpt9.png",
    "gfx/flag.dds.",
    "gfx/flag.dds ",
  ]) {
    assert.throws(() => gamePath(path), /path|portable|reserved/i, path);
  }
  assert.equal(gamePath("gfx/common/flag.dds"), "gfx/common/flag.dds");
  const root = fixture(t);
  edit(root, "krgconfig.json", (config) => {
    config.name = "CON";
  });
  assert.throws(() => loadConfig(root), /path|portable|reserved/i);
});

test("local source exports share npm identities, deduplicate the same copy and reject different copies or escaping exports", (t) => {
  const root = fixture(t);
  const library = installedPackage(root, "@fixtures/shared");
  edit(root, "krgconfig.json", (config) => {
    config.dependencies = ["./node_modules/@fixtures/shared", "@fixtures/shared"];
  });
  const graph = resolveDependencies(loadConfig(root));
  assert.equal(graph.layers.length, 2, "the same source package appears once before the consumer");
  assert.equal(graph.layers[0].packageName, "@fixtures/shared");
  assert.equal(graph.moduleFiles["@fixtures/shared"], join(library, "src/index.krg.ts"));

  installedPackage(join(root, "local"), "@fixtures/shared", { version: "2.0.0" });
  edit(root, "krgconfig.json", (config) => {
    config.dependencies = ["./local/node_modules/@fixtures/shared", "@fixtures/shared"];
  });
  assert.throws(() => resolveDependencies(loadConfig(root)), /Two .*copies.*@fixtures\/shared/);

  edit(root, "krgconfig.json", (config) => {
    config.dependencies = ["./node_modules/@fixtures/shared"];
  });
  edit(library, "package.json", (manifest) => {
    manifest.krieg.exports["."] = "../../outside.krg.ts";
  });
  assert.throws(() => resolveDependencies(loadConfig(root)), /path|escapes/i);
});
