import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { compileProject, compileSource, emitCompileOutput } from "../dist/compiler/index.js";
import { emitPdx } from "../dist/pdx/index.js";
import { initProject, writeEditorProject } from "../dist/project/index.js";

const repository = fileURLToPath(new URL("../", import.meta.url));
const virtualModules = {
  "@project/localisation": `export declare const messages: { reconstruction_desc: "reconstruction_desc"; "reconstruction.1.a": "reconstruction.1.a" }; export declare const translated: { reconstruction_title: "reconstruction_title" };`,
  "@project/countries": `import type { CountryRef } from "krieg-lang/hoi4";
    export declare const countries: { readonly GER: CountryRef & { readonly tag: "GER" } };`,
  "@project/states": `import type { StateRef } from "krieg-lang/hoi4";
    export declare const states: { readonly 1: StateRef & { readonly id: 1 } };`,
};
const helperSource = `import type { CountryScope } from "krieg-lang/hoi4";
  export function grantReward(country: CountryScope, amount: number): void {
    country.effects.addPoliticalPower(amount);
  }`;

function compile(source, options = {}) {
  return compileSource(source, { fileName: "integration.krg.ts", ...options });
}

function assertSuccess(result, label = "source") {
  assert.equal(result.success, true, `${label}: ${JSON.stringify(result.diagnostics, null, 2)}`);
}

test("the tutorials' complete TypeScript examples compile against the public SDK", () => {
  const pages = readdirSync(join(repository, "docs"))
    .filter((file) => file.endsWith(".md"))
    .sort();
  let checked = 0;
  for (const page of pages) {
    const markdown = readFileSync(join(repository, "docs", page), "utf8");
    const snippets = [...markdown.matchAll(/```(typescript|tsx|css)\n([\s\S]*?)```/g)].map(
      (match) => ({
        language: match[1],
        source: match[2],
        file:
          match[2].match(/^\/\/ (src\/[^\n]+\.krg\.(?:tsx?|css))\n/)?.[1] ??
          markdown.slice(0, match.index).match(/`(src\/[^`\n]+\.krg\.(?:tsx?|css))`[：:]\s*$/)?.[1],
      }),
    );
    const sources = {
      "rewards.krg.ts": helperSource,
      ...Object.fromEntries(
        snippets.filter((snippet) => snippet.file).map((snippet) => [snippet.file, snippet.source]),
      ),
    };
    const files = snippets
      .filter((snippet) => snippet.file && snippet.language !== "css")
      .map((snippet) => snippet.file);
    if (files.length) {
      const result = compileProject({
        rootDir: join(repository, "tutorial-examples", page),
        files,
        sources,
        virtualModules,
        moduleFiles: { "@my-team/krieg-common/rewards": "rewards.krg.ts" },
      });
      assertSuccess(result, `${page} named source project`);
      assert.ok(result.outputs.length > 0, `${page} named source project should generate content`);
      if (page === "recipes.md") {
        const outputs = new Map(
          result.outputs.map((output) => [output.path, emitCompileOutput(output)]),
        );
        assert.match(
          outputs.get("common/decisions/krieg_reconstruction_decisions.txt") ?? "",
          /cost = 25/,
        );
        assert.match(outputs.get("interface/reconstruction.gui") ?? "", /name = "request_aid"/);
        assert.match(
          outputs.get("events/krieg_reconstruction_1.txt") ?? "",
          /emergency_aid_execute = yes/,
        );
        assert.match(
          outputs.get("common/national_focus/krieg_reconstruction_tree.txt") ?? "",
          /focus = reconstruction_authorize/,
        );
        const action = outputs.get("common/scripted_effects/krieg_emergency_aid_action.txt") ?? "";
        assert.equal((action.match(/add_political_power = -25/g) ?? []).length, 1);
      }
      checked += files.length;
    }
    for (let index = 0; index < snippets.length; index++) {
      const snippet = snippets[index];
      if (snippet.file || snippet.language === "css") continue;
      const result = compile(snippet.source, {
        fileName: `docs-${page}-${index}.krg.${snippet.language === "tsx" ? "tsx" : "ts"}`,
        virtualModules,
        sources,
        moduleFiles: { "@my-team/krieg-common/rewards": "rewards.krg.ts" },
      });
      assertSuccess(result, `${page} example ${index + 1}`);
      assert.ok(
        result.outputs.length > 0,
        `${page} example ${index + 1} should generate game content`,
      );
      checked++;
    }
  }
  assert.ok(checked >= 25, "the tutorial suite should contain complete runnable examples");
});

test("SDK symbols resolve through named aliases and namespace imports", () => {
  for (const source of [
    `import { CountryEvent as Event, type CountryScope as Scope } from "krieg-lang/hoi4";
     Event({ id: "alias.1", hidden: true, immediate: (country: Scope) => {
       country.effects.addPoliticalPower(7);
     }});`,
    `import * as hoi4 from "krieg-lang/hoi4";
     hoi4.CountryEvent({ id: "namespace.1", hidden: true, immediate: (country: hoi4.CountryScope) => {
       country.effects.addPoliticalPower(7);
     }});`,
  ]) {
    const result = compile(source);
    assertSuccess(result);
    assert.match(
      result.outputs.map((output) => emitPdx(output.document)).join("\n"),
      /add_political_power = 7/,
    );
  }
});

test("ordered PDX works through namespace and renamed constructor imports", () => {
  const sources = [
    `import * as pdx from "krieg-lang/pdx";
     export default pdx.file("common/test.txt", pdx.document([
       pdx.property("value", pdx.atom("1")), pdx.property("value", pdx.atom("2"))
     ]));`,
    `import { file as target, document as doc, property as item, atom as token } from "krieg-lang/pdx";
     export default target("common/test.txt", doc([
       item("value", token("1")), item("value", token("2"))
     ]));`,
  ];
  for (const source of sources) {
    const result = compile(source);
    assertSuccess(result);
    assert.equal(result.outputs[0].path, "common/test.txt");
    assert.equal(result.outputs[0].representation, "ordered-pdx");
    assert.match(emitPdx(result.outputs[0].document), /value = 1\s+value = 2/);
  }
});

test("intrinsics are identified by resolved symbol, not by helper spelling", () => {
  const result = compile(`
    function CountryEvent(value: number): number { return value + 1; }
    const amount = CountryEvent(4);
  `);
  assertSuccess(result);
  assert.equal(result.outputs.length, 0);
});

test("explicit any, assertion escapes, ambient calls, and runtime APIs are rejected", () => {
  for (const source of [
    "const value: any = 1;",
    'const value = "wrong" as unknown as number;',
    'const value = <number><unknown>"wrong";',
    "declare function external(value: number): void; external(1);",
    "const value = Math.random();",
    'const value = JSON.parse("{}");',
    'fetch("https://example.invalid");',
    "const value = [1, 2].map((value: number) => value + 1);",
    'import { readFileSync } from "node:fs"; const value = readFileSync("secret");',
  ]) {
    const result = compile(source);
    assert.equal(result.success, false, `accepted unsupported source: ${source}`);
    assert.ok(result.diagnostics.some((diagnostic) => diagnostic.severity === "error"));
    assert.deepEqual(result.outputs, []);
  }
});

test("source imports and calls cannot execute JavaScript side effects", () => {
  const root = mkdtempSync(join(tmpdir(), "krieg-no-execution-"));
  try {
    const marker = join(root, "executed.txt");
    const source = `import { writeFileSync } from "node:fs";
      writeFileSync(${JSON.stringify(marker)}, "executed");`;
    const result = compile(source);
    assert.equal(result.success, false);
    assert.equal(existsSync(marker), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("ambient aliases and TypeScript suppression directives cannot bypass strict command types", () => {
  const effect = `import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
    ScriptedEffect("strict_effect", (country: CountryScope) => {
      country.effects.addPoliticalPower("not_a_number");
    });`;
  const ambient = compile(
    `import type { Unsafe } from "./unsafe.d.ts";
    import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
    const amount: Unsafe = "not_a_number";
    ScriptedEffect("ambient_escape", (country: CountryScope) => {
      country.effects.addPoliticalPower(amount);
    });`,
    { sources: { "unsafe.d.ts": "export type Unsafe = any;" } },
  );
  assert.equal(ambient.success, false);
  assert.ok(ambient.diagnostics.some((diagnostic) => diagnostic.code === "KRG1015"));
  for (const directive of ["nocheck", "ignore", "expect-error"]) {
    const source =
      directive === "nocheck"
        ? `// @ts-nocheck\n${effect}`
        : effect.replace(
            "country.effects.addPoliticalPower",
            `// @ts-${directive}\ncountry.effects.addPoliticalPower`,
          );
    const result = compile(source);
    assert.equal(result.success, false, `accepted @ts-${directive}`);
    assert.deepEqual(result.outputs, []);
  }
});

test("native tsc accepts finite loops, local imports, and generated exact world references", () => {
  const root = mkdtempSync(join(tmpdir(), "krieg-native-ts-"));
  try {
    initProject(root);
    const configPath = join(root, "krgconfig.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    config.world = { countries: ["GER"], states: [1] };
    writeFileSync(configPath, JSON.stringify(config));
    writeFileSync(join(root, "src", "rewards.krg.ts"), helperSource);
    const source = `import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
      import { countries } from "@project/countries";
      import { grantReward } from "./rewards.krg.js";
      ScriptedEffect("native_editor_test", (country: CountryScope) => {
        for (const flag of ["ready", "prepared"]) { country.effects.setCountryFlag(flag); }
        country.country(countries.GER, (target: CountryScope) => { grantReward(target, 25); });
      });`;
    const sourcePath = join(root, "src", "main.krg.ts");
    writeFileSync(sourcePath, source);
    writeEditorProject(root);
    const tsc = resolve(repository, "node_modules/typescript/bin/tsc");
    const run = () => {
      const result = spawnSync(
        process.execPath,
        [tsc, "--noEmit", "--project", join(root, "tsconfig.json")],
        {
          encoding: "utf8",
        },
      );
      assert.equal(result.error, undefined, result.error?.message);
      return result;
    };
    const valid = run();
    assert.equal(valid.status, 0, valid.stdout + valid.stderr);
    writeFileSync(sourcePath, source + "\nconst invalidCountry = countries.ZZZ;\n");
    const invalid = run();
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stdout + invalid.stderr, /ZZZ/);
    writeFileSync(sourcePath, source + "\nconst timer = setTimeout;\n");
    const runtime = run();
    assert.notEqual(runtime.status, 0);
    assert.match(runtime.stdout + runtime.stderr, /setTimeout/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
