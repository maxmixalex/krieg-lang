import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as pdx from "../dist/pdx/index.js";
import { importPdxToKrieg, recompileImportedKrieg } from "../dist/importer/index.js";
import { classifyCorpusPath, runCorpus } from "../dist/corpus/index.js";
import { extractCwtSchema } from "../dist/schema/cwt.js";

test("ordered PDX preserves duplicates, quoted lexemes, operators, colors, and macros", () => {
  const input =
    '\uFEFF# comment\r\n"quoted key" = "value\\"quoted"\r\na = 1\na >= -2.5\ncolor = rgb { 001 2 3 }\n$TARGET$ = { value = @[ base + 2 ] < = { 1 2 3 } }\n';
  const parsed = pdx.parsePdx(input);
  assert.deepEqual(parsed.diagnostics, []);
  assert.equal(parsed.document.items.length, 5);
  assert.equal(parsed.document.items[0].key.quoted, true);
  assert.equal(parsed.document.items[2].operator, ">=");
  assert.equal(parsed.document.items[3].value.kind, "tagged");
  assert.equal(pdx.emitPdx(parsed.document, { format: "original" }), input);
  const canonical = pdx.emitPdx(parsed.document);
  assert.notEqual(canonical, input);
  const again = pdx.parsePdx(canonical);
  assert.deepEqual(again.diagnostics, []);
  assert.equal(pdx.comparePdxSemantic(parsed.document, again.document), true);
});

test("malformed syntax is reported and cannot be migrated as a successful import", () => {
  for (const input of ["a = { b = 1", "a = }", 'a = "unterminated', "}"]) {
    const result = importPdxToKrieg(input, { outputPath: "events/example.txt" });
    assert.ok(result.diagnostics.some((d) => d.severity === "error"));
    assert.equal(result.source, "");
  }
  assert.throws(() => pdx.emitPdx(pdx.document([]), { format: "original" }), /not retained/);
});

test("glued comparison operators and multiline quoted tokens retain their lexical meaning", () => {
  const parsed = pdx.parsePdx('value> -10\nlabel = "first\r\nsecond"\n');
  assert.deepEqual(parsed.diagnostics, []);
  assert.equal(parsed.document.items[0].operator, ">");
  assert.equal(parsed.document.items[1].value.text, "first\r\nsecond");
  assert.equal(
    pdx.comparePdxSemantic(parsed.document, pdx.parsePdx(pdx.emitPdx(parsed.document)).document),
    true,
  );
});

test("constructor import is editable TypeScript and statically recompiles with exact destination", () => {
  const migrated = importPdxToKrieg(
    'spriteTypes = { spriteType = { name = "one" } spriteType = { name = "two" } }',
    { outputPath: "interface/example.gfx" },
  );
  assert.match(migrated.source, /pdx\.property/);
  assert.doesNotMatch(migrated.source, /raw\(|parsePdx|eval\(/);
  const compiled = recompileImportedKrieg(migrated.source);
  assert.deepEqual(compiled.diagnostics, []);
  assert.equal(compiled.file.path, "interface/example.gfx");
  assert.equal(pdx.comparePdxSemantic(migrated.document, compiled.file.document), true);
  const edited = recompileImportedKrieg(
    migrated.source.replace('pdx.atom("two", true)', 'pdx.atom("changed", true)'),
  );
  assert.match(pdx.emitPdx(edited.file.document), /"changed"/);
});

test("import interpreter refuses executable JavaScript and bad constructor types", () => {
  for (const expression of [
    "process.exit(1)",
    "pdx.file(123, pdx.document([]))",
    'pdx.file("x.txt", pdx.block([]))',
    '(()=>pdx.file("x.txt",pdx.document([])))()',
  ]) {
    const result = recompileImportedKrieg(
      `import * as pdx from 'krieg-lang/pdx'; export default ${expression};`,
    );
    assert.ok(result.diagnostics.length > 0);
    assert.equal(result.file, undefined);
  }
  assert.ok(
    recompileImportedKrieg(
      "import type * as pdx from 'krieg-lang/pdx'; export default pdx.file('x.txt',pdx.document([]));",
    ).diagnostics.length,
  );
});

test("CWT extraction preserves overloads, nested cardinality and scope transitions", async () => {
  const dir = await mkdtemp(join(tmpdir(), "krieg-cwt-"));
  try {
    await writeFile(
      join(dir, "sample.cwt"),
      "## scope = { country state }\n## push_scope = country\nalias[effect:test] = {\n## cardinality = 0..1\namount = int\n}\n## scope = any\nalias[effect:test] = bool\nsingle_alias[clause] = bool\nsingle_alias[clause] = { alias_name[effect] = alias_match_left[effect] }\n",
    );
    const schema = await extractCwtSchema(dir);
    assert.equal(schema.commands.length, 2);
    assert.deepEqual(schema.commands[0].scopes, ["country", "state"]);
    assert.equal(schema.commands[0].pushScope, "country");
    assert.equal(schema.commands[0].value.fields[0].cardinality, "0..1");
    assert.equal(schema.singleAliases.clause.type, "block");
    assert.equal(schema.singleAliasOverloads.clause.length, 2);
    assert.deepEqual(schema.diagnostics, []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("corpus report accounts for files and distinguishes original errors from successful compilation", async () => {
  const temp = await mkdtemp(join(tmpdir(), "krieg-corpus-"));
  const root = join(temp, "input");
  try {
    await mkdir(join(root, "events"), { recursive: true });
    await mkdir(join(root, "interface"), { recursive: true });
    await mkdir(join(root, "localisation/english"), { recursive: true });
    await writeFile(
      join(root, "events/valid.txt"),
      "# preserved if compilation fails\na = { repeated = one repeated = two }",
    );
    await writeFile(join(root, "events/invalid.txt"), "a = {");
    await writeFile(join(root, "interface/credits.txt"), "Thank you!");
    await writeFile(
      join(root, "localisation/english/example_l_english.yml"),
      '\uFEFFl_english:\n example:0 "Example"\n',
    );
    const report = await runCorpus({
      rootDir: root,
      generatedDir: join(temp, "generated"),
      compileBatch: async (entries) =>
        entries.map((e) => ({
          sourcePath: e.sourcePath,
          success: true,
          diagnostics: [],
          semanticHash: e.expectedSemanticHash,
        })),
    });
    assert.equal(report.inventory.files, 4);
    assert.equal(report.levels.parse.passed, 1);
    assert.equal(report.levels.parse.failed, 1);
    assert.equal(report.levels.constructorStaticRecompile.attempted, 0);
    assert.equal(report.levels.constructorStaticRecompile.skipped, 2);
    assert.equal(report.levels.typescriptCompile.passed, 1);
    assert.ok(report.limitations.some((message) => message.includes("supersede")));
    assert.equal(
      report.files.find((file) => file.path === "events/valid.txt").status,
      "typescript-compiled-semantic-match",
    );
    assert.equal(report.levels.ancillarySyntax.passed, 1);
    assert.equal(await readFile(join(temp, "generated/events/invalid.txt"), "utf8"), "a = {");
    assert.equal(classifyCorpusPath("map/railways.txt"), "map-table");
    const failed = await runCorpus({
      rootDir: root,
      generatedDir: join(temp, "failed"),
      compileBatch: async (entries) =>
        entries.map((e) => ({
          sourcePath: e.sourcePath,
          success: true,
          diagnostics: [],
          semanticHash: "wrong",
        })),
    });
    assert.equal(failed.levels.typescriptCompile.failed, 1);
    assert.equal(
      await readFile(join(temp, "failed/events/valid.txt"), "utf8"),
      await readFile(join(root, "events/valid.txt"), "utf8"),
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
