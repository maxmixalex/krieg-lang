import assert from "node:assert/strict";
import test from "node:test";
import { ESLint } from "eslint";
import prettier from "prettier";
import plugin from "../dist/eslint/index.js";

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: [plugin.configs.recommended],
});

async function lint(source, filePath = "example.krg.ts") {
  const [result] = await eslint.lintText(source, { filePath });
  return result.messages;
}

test("ordinary TypeScript syntax and typed callbacks use the stock parser", async () => {
  const messages = await lint(`
    import { CountryEvent, type CountryScope } from "krieg-lang/hoi4";
    const amount = 25;
    CountryEvent({ id: "sample.1", immediate: (country: CountryScope) => {
      if (country.triggers.hasCountryFlag("ready")) {
        country.effects.addPoliticalPower(amount);
      }
      for (const value of [1, 2]) { country.effects.addPoliticalPower(value); }
    }});
  `);
  assert.deepEqual(messages, []);
});

test("unsupported runtime syntax and any have useful locations", async () => {
  const messages = await lint("const value: any = 1;\nwhile (value) { console.log(value); }\n");
  assert.ok(messages.some((message) => message.ruleId === "krieg/no-any" && message.line === 1));
  assert.ok(
    messages.some((message) => message.ruleId === "krieg/supported-syntax" && message.line === 2),
  );
  assert.ok(messages.some((message) => message.message.includes("console")));
});

test("runtime imports are rejected and local source inclusion is allowed", async () => {
  const messages = await lint(
    'import fs from "node:fs";\nimport "./side.krg.js";\nimport("./more.krg.js");\n',
  );
  assert.equal(messages.filter((message) => message.ruleId === "krieg/allowed-imports").length, 1);
  assert.ok(messages.some((message) => message.message.includes("dynamic imports")));
  assert.deepEqual(await lint('import "./definitions.krg.js";'), []);
});

test("typed local modules are allowed and opted-in npm source packages are configurable", async () => {
  assert.deepEqual(await lint('import { helper } from "./helpers.krg.js";'), []);
  assert.deepEqual(await lint('import { countries } from "@project/countries";'), []);
  assert.deepEqual(await lint('import { states } from "@project/states";'), []);
  assert.deepEqual(await lint('import { assets } from "@project/assets";'), []);
  const configured = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      plugin.configs.recommended,
      {
        rules: { "krieg/allowed-imports": ["error", { packages: ["@example/krieg-common"] }] },
      },
    ],
  });
  const [result] = await configured.lintText(
    'import { helper } from "@example/krieg-common/effects";',
    { filePath: "example.krg.ts" },
  );
  assert.deepEqual(result.messages, []);
  const [rejected] = await configured.lintText(
    'import { helper } from "@example/krieg-common-evil";',
    { filePath: "example.krg.ts" },
  );
  assert.equal(rejected.errorCount, 1);
});

test("callback parameter annotations and compile-time loop bindings are required", async () => {
  const messages = await lint("const effect = (country) => {};\nfor (let x of [1, 2]) {}\n");
  assert.ok(messages.some((message) => message.ruleId === "krieg/explicit-parameters"));
  assert.ok(messages.some((message) => message.message.includes("const identifier")));
});

test("type escapes are rejected without matching harmless text in strings", async () => {
  for (const directive of ["nocheck", "ignore", "expect-error"]) {
    const messages = await lint(`// @ts-${directive}\nconst value = 1;`);
    assert.ok(messages.some((message) => message.message.includes("suppression")));
  }
  assert.deepEqual(await lint('const text = "@ts-nocheck";'), []);
  assert.deepEqual(await lint("const value = [1, 2] as const;"), []);
  assert.ok(
    (await lint('const value = "wrong" as unknown as number;')).some((message) =>
      message.message.includes("type assertions"),
    ),
  );
  assert.ok(
    (await lint('import type { Unsafe } from "./unsafe.d.ts";')).some(
      (message) => message.ruleId === "krieg/allowed-imports",
    ),
  );
});

test("Prettier's built-in TypeScript parser formats .krg.ts without a custom plugin", async () => {
  const output = await prettier.format("const amount:number=25;", { filepath: "example.krg.ts" });
  assert.equal(output, "const amount: number = 25;\n");
});
