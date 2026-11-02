import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { buildProject, loadConfig, parseNativeLocalisation } from "../dist/project/index.js";
import { localisationFiles } from "../dist/project/localisation.js";

function fixture(t, contents, rules) {
  const root = mkdtempSync(join(tmpdir(), "krieg-localisation-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [file, bytes] of Object.entries(contents)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), bytes);
  }
  mkdirSync(join(root, "src"), { recursive: true });
  writeFileSync(
    join(root, "krgconfig.json"),
    JSON.stringify({ name: "localisation-test", localisation: rules }),
  );
  return root;
}
const rule = (from, language = "english", format) => ({
  from,
  language,
  ...(format ? { format } : {}),
});

test("YAML mapping compiles multiline Unicode, quoted colon/hash, substitutions and quotes to BOM localisation", (t) => {
  const root = fixture(
    t,
    {
      "english.yaml":
        'TITLE: "Ports: #1"\nDETAIL: |\n  The \'Union\' says "ready".\n  §G[ROOT.GetName]§! £political_power $OTHER$\n',
    },
    [rule("english.yaml")],
  );
  const result = buildProject(root);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  const text = readFileSync(
    join(result.outDir, result.files.find((file) => file.kind === "localisation").path),
    "utf8",
  );
  assert.equal(text.charCodeAt(0), 0xfeff);
  assert.match(text, /TITLE:0 "Ports: #1"/);
  assert.match(
    text,
    /DETAIL:0 .*\\"ready\\"\.\\n.*§G\[ROOT.GetName\]§! £political_power \$OTHER\$\\n/,
  );
});

test("native HOI4 format retains BOM, CRLF, comments, source order, versions and escape bytes", (t) => {
  const native =
    '\uFEFFl_english: # metadata\r\n # Author comment\r\n Z_KEY:12 "[ROOT.GetName] \\n \\"quoted\\"" # after text\r\n A_KEY:0 "§Y£pol_power§!"\r\n';
  const root = fixture(t, { "source.yml": native }, [rule("source.yml")]);
  const [output] = localisationFiles(loadConfig(root));
  assert.deepEqual(Buffer.from(output.bytes), Buffer.from(native));
});

test("explicit format removes extension ambiguity and native files without BOM get one", (t) => {
  const root = fixture(
    t,
    { "mapping.yml": 'TITLE: "General YAML"', "native.yaml": 'l_french:\n TITLE:4 "France"\n' },
    [rule("mapping.yml", "english", "yaml"), rule("native.yaml", "french", "hoi4")],
  );
  const files = localisationFiles(loadConfig(root));
  assert.match(Buffer.from(files[0].bytes).toString(), /TITLE:0 "General YAML"/);
  assert.equal(Buffer.from(files[1].bytes).toString(), '\uFEFFl_french:\n TITLE:4 "France"\n');
});

for (const [name, text] of [
  ["duplicate YAML key", 'KEY: "one"\nKEY: "two"'],
  ["nested mapping", 'KEY:\n  nested: "value"'],
  ["boolean scalar", "KEY: true"],
  ["number scalar", "KEY: 12"],
  ["alias", 'KEY: &name "text"\nOTHER: *name'],
  ["malformed quote", 'KEY: "unfinished'],
  ["multiple documents", 'KEY: "first"\n---\nKEY: "second"'],
  ["locale wrapper", 'l_english:\n  KEY: "value"'],
])
  test(`YAML rejects ${name} with source diagnostics`, (t) => {
    const root = fixture(t, { "bad.yaml": text }, [rule("bad.yaml")]);
    assert.throws(() => localisationFiles(loadConfig(root)), /bad.yaml/);
  });

test("JSON duplicate keys are rejected before last-value overwrite can hide them", (t) => {
  const root = fixture(t, { "bad.json": '{"SAME":"one","SAME":"two"}' }, [rule("bad.json")]);
  assert.throws(() => localisationFiles(loadConfig(root)), /unique|duplicate/i);
});

for (const [name, text, expected] of [
  ["duplicate key", 'l_english:\n KEY:0 "one"\n KEY:1 "two"', /:3: Duplicate/],
  ["missing quote", "l_english:\n KEY:0 text", /:2: Expected/],
  ["wrong header", 'l_klingon:\n KEY:0 "text"', /:1: Unsupported/],
  ["multiple headers", 'l_english:\n KEY:0 "text"\nl_french:', /:3:.*exactly one/],
  ["text before header", ' KEY:0 "text"', /:1:.*header/],
])
  test(`native localisation rejects ${name}`, () => {
    assert.throws(() => parseNativeLocalisation(text, "native.yml"), expected);
  });

test("native header must match configured language", (t) => {
  const root = fixture(t, { "bad.yml": 'l_french:\n KEY:0 "texte"' }, [rule("bad.yml")]);
  assert.throws(() => localisationFiles(loadConfig(root)), /configured language is english/);
});

test("duplicates across formats and dependency/native assets fail while distinct locales may share keys", (t) => {
  const root = fixture(
    t,
    { "a.yaml": 'SAME: "one"', "b.json": '{"SAME":"two"}', "fr.yaml": 'SAME: "un"' },
    [rule("a.yaml"), rule("fr.yaml", "french")],
  );
  assert.equal(buildProject(root).success, true);
  const config = JSON.parse(readFileSync(join(root, "krgconfig.json"), "utf8"));
  config.localisation.push(rule("b.json"));
  writeFileSync(join(root, "krgconfig.json"), JSON.stringify(config));
  let bad = buildProject(root);
  assert.equal(bad.success, false);
  assert.ok(bad.diagnostics.some((d) => d.code === "KRG_LOCALISATION_DUPLICATE"));
  config.localisation.pop();
  config.dependencies = ["./dependency"];
  mkdirSync(join(root, "dependency/localisation"), { recursive: true });
  writeFileSync(
    join(root, "dependency/krgconfig.json"),
    JSON.stringify({
      name: "dependency",
      assets: [{ from: "localisation", to: "localisation/english" }],
    }),
  );
  writeFileSync(
    join(root, "dependency/localisation/duplicate_l_english.yml"),
    '\uFEFFl_english:\n SAME:0 "asset"\n',
  );
  writeFileSync(join(root, "krgconfig.json"), JSON.stringify(config));
  bad = buildProject(root);
  assert.equal(bad.success, false);
  assert.ok(bad.diagnostics.some((d) => d.code === "KRG_LOCALISATION_DUPLICATE"));
});

test("native localisation rejects invalid UTF-8 rather than replacing input bytes", (t) => {
  const root = fixture(t, { "invalid.yml": Buffer.from([0xff, 0x6c, 0x5f, 0x65]) }, [
    rule("invalid.yml"),
  ]);
  assert.throws(
    () => localisationFiles(loadConfig(root)),
    /invalid.yml: Localisation must be valid UTF-8/,
  );
});
