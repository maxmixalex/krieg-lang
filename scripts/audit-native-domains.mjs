#!/usr/bin/env node
/** Public domain API -> authored fixture -> native CWTools audit. Never launches HOI4. */
import fs from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { compileProject } from "../dist/compiler/index.js";
import { emitPdx, parsePdx, atom, block, property } from "../dist/pdx/index.js";

const repo = fileURLToPath(new URL("../", import.meta.url));
const fixtures = path.join(repo, "tests/fixtures/native-domains");
const schema = JSON.parse(fs.readFileSync(path.join(repo, "src/schema/hoi4-domains.json"), "utf8"));
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const { values } = parseArgs({
  options: {
    vanilla: { type: "string" },
    rules: { type: "string" },
    cwtools: { type: "string" },
    assets: { type: "string" },
    out: { type: "string" },
    work: { type: "string" },
    seed: { type: "boolean" },
    "fetch-assets": { type: "boolean" },
    "compile-only": { type: "boolean" },
    "keep-work": { type: "boolean" },
  },
});
const vanilla = values.vanilla && path.resolve(values.vanilla);
const props = (items) => (items ?? []).filter((item) => item.kind === "property");
const blockItems = (value) =>
  value?.kind === "block" ? value.items : value?.kind === "tagged" ? value.value.items : [];
function walk(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, "en"))
    .flatMap((entry) =>
      entry.isDirectory() ? walk(path.join(root, entry.name)) : [path.join(root, entry.name)],
    );
}
const parsed = new Map();
function nativeDocument(file) {
  if (!parsed.has(file))
    parsed.set(file, parsePdx(fs.readFileSync(file, "utf8"), { retainSource: false }).document);
  return parsed.get(file);
}
function nativeReference(definition) {
  if (!vanilla) return undefined;
  const names = new Set(Object.values(schema.shapes[definition.shape]).map((field) => field.name));
  const folder = path.join(vanilla, definition.folder);
  const files = definition.fileName
    ? [path.join(folder, definition.fileName)]
    : walk(folder).filter((file) => /\.(txt|gfx|asset)$/.test(file));
  let best;
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const document = nativeDocument(file);
    const candidates = [];
    function collect(items, depth = 0) {
      if (depth > 5) return;
      candidates.push(items);
      for (const property of props(items))
        if (property.value.kind === "block") collect(property.value.items, depth + 1);
    }
    collect(document.items);
    for (const items of candidates) {
      const score = props(items).filter((property) => names.has(property.key.text)).length;
      if (score && (!best || score > best.score))
        best = {
          file: path.relative(vanilla, file).replaceAll(path.sep, "/"),
          sha256: sha256(fs.readFileSync(file)),
          items,
          score,
        };
    }
    if (best && best.score >= Math.min(5, names.size)) break;
  }
  return best;
}
function literal(rule, native, fieldName = "") {
  const atom = native?.kind === "atom" ? native : undefined;
  if (rule.literals?.length) {
    const match = rule.literals.find(
      (value) =>
        String(value) === atom?.text ||
        (typeof value === "boolean" && (value ? "yes" : "no") === atom?.text),
    );
    return JSON.stringify(match ?? rule.literals[0]);
  }
  if (rule.format === "day-month") return JSON.stringify(atom?.text ?? "0.0");
  if (rule.type === "number") {
    const number = atom && /^[-+]?\d+(?:\.\d+)?$/.test(atom.text) ? Number(atom.text) : undefined;
    return String(
      number !== undefined &&
        (!rule.integer || Number.isInteger(number)) &&
        (rule.min === undefined || number >= rule.min) &&
        (rule.max === undefined || number <= rule.max)
        ? number
        : (rule.min ?? (rule.max !== undefined && rule.max < 0 ? rule.max : 1)),
    );
  }
  if (rule.type === "boolean") return atom?.text === "no" ? "false" : "true";
  if (/^(name|desc|description|text|title|farText|nearText)$/.test(fieldName)) return '"KRG_AUDIT"';
  if (/sound/i.test(fieldName)) return '"krg_audit_soundeffect"';
  if (atom && atom.text.length < 90 && !/[\r\n]/.test(atom.text)) return JSON.stringify(atom.text);
  if (/date|expire/i.test(fieldName)) return '"1936.1.1"';
  if (/country|tag/i.test(fieldName)) return '"GER"';
  if (/icon|picture|sprite/i.test(fieldName)) return '"GFX_krieg_audit"';
  return '"KRG_AUDIT"';
}
function sampleValue(rule, native, fieldName, depth = 0) {
  if (depth > 12) return "cwt([])";
  if (rule.kind === "union") {
    const exact = rule.variants.find(
      (variant) =>
        variant.kind === "scalar" &&
        variant.literals?.some(
          (value) =>
            String(value) === native?.text ||
            (typeof value === "boolean" && (value ? "yes" : "no") === native?.text),
        ),
    );
    const match =
      exact ??
      rule.variants.find((variant) =>
        native?.kind === "block"
          ? ["object", "list", "map"].includes(variant.kind)
          : variant.kind === "scalar" &&
            (native?.kind === "atom" && /^[-+]?\d+(?:\.\d+)?$/.test(native.text)
              ? variant.type === "number"
              : variant.type === "string"),
      );
    return sampleValue(match ?? rule.variants[0], native, fieldName, depth + 1);
  }
  if (rule.kind === "scalar") return literal(rule, native, fieldName);
  if (rule.kind === "callback")
    return `(_scope: ScopeByName[${JSON.stringify(rule.scope)}]) => ${rule.mode === "trigger" ? "true" : "{}"}`;
  if (rule.kind === "opaque") return "cwt([])";
  if (rule.kind === "list") {
    const values = blockItems(native)
      .filter((item) => item.kind !== "property")
      .slice(0, 3);
    return `[${(values.length ? values : [undefined]).map((item) => sampleValue(rule.element, item, fieldName, depth + 1)).join(", ")}]`;
  }
  if (rule.kind === "map") {
    const first = props(blockItems(native)).find(
      (item) => !["category", "enable", "factor", "priority"].includes(item.key.text),
    );
    return `{ ${JSON.stringify(first?.key.text ?? rule.keys?.[0] ?? "krg_audit_entry")}: ${sampleValue(rule.value, first?.value, fieldName, depth + 1)} }`;
  }
  return `{ ${sampleFields(rule.shape, blockItems(native), depth + 1).join(", ")} }`;
}
function sampleFields(shape, items, depth = 0) {
  const fields = Object.entries(schema.shapes[shape]);
  const actual = props(items);
  const required = fields.filter(([, field]) => field.required);
  const observed = fields.filter(([, field]) =>
    actual.some((item) => item.key.text === field.name),
  );
  const selected = [
    ...new Map(
      [...required, ...observed.slice(0, depth ? 2 : 4)].map((entry) => [entry[0], entry]),
    ).values(),
  ];
  return selected.map(([key, field]) => {
    const match = actual.find((item) => item.key.text === field.name);
    const value = sampleValue(
      field.value,
      match?.value ?? (key === "entries" ? { kind: "block", items } : undefined),
      key,
      depth,
    );
    return `${JSON.stringify(key)}: ${field.repeated ? `[${Array.from({ length: Math.max(1, field.minCount ?? 0) }, () => value).join(", ")}]` : value}`;
  });
}

if (values.seed) {
  if (!vanilla)
    throw new Error(
      "--seed requires --vanilla to choose factual native reference IDs; no game scripts are copied.",
    );
  const manifest = {
    formatVersion: 1,
    authored:
      "Synthetic minimal samples. Only identifiers, enum values and numeric facts are selected from native references; effect/trigger bodies are newly authored.",
    domains: {},
  };
  for (const [index, [name, definition]] of Object.entries(Object.entries(schema.definitions))) {
    const reference = nativeReference(definition);
    const id =
      definition.kind === "event"
        ? `krg_audit.${Number(index) + 1}`
        : name === "CombatTactic"
          ? "tactic_krieg_audit"
          : name === "MusicPlaylistEntry"
            ? "krg_audit_musicasset"
            : definition.kind === "country"
              ? "KQA"
              : definition.byId
                ? "on_daily"
                : definition.idType === "number"
                  ? 8000 + Number(index)
                  : `krg_audit_${name.toLowerCase()}`;
    const shape = definition.byId?.[id] ?? definition.shape;
    const data =
      definition.kind === "country"
        ? ['graphicalCulture: "western_european_gfx"', "color: [40, 80, 120]"]
        : sampleFields(shape, reference?.items ?? []);
    if (definition.rootField)
      data.unshift(
        `${definition.rootField}: ${JSON.stringify(definition.rootValues?.[0] ?? "krg_audit_nativedecisioncategory")}`,
      );
    const payload = data.join(", ");
    const imports = [
      name,
      ...(payload.includes("cwt(") ? ["cwt"] : []),
      ...(payload.includes("ScopeByName[") ? ["type ScopeByName"] : []),
    ];
    const source = `// Original audit fixture; native rule: ${definition.source}:${definition.line}.\nimport { ${imports.join(", ")} } from "krieg-lang/hoi4";\n\nexport const sample = ${name}({ id: ${JSON.stringify(id)}, ${payload} });\n`;
    fs.mkdirSync(fixtures, { recursive: true });
    fs.writeFileSync(path.join(fixtures, `${name}.krg.ts`), source);
    manifest.domains[name] = {
      file: `${name}.krg.ts`,
      reference: reference ? { file: reference.file, sha256: reference.sha256 } : null,
      cwt: { source: definition.source, line: definition.line },
    };
  }
  fs.writeFileSync(path.join(fixtures, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `Prepared ${Object.keys(manifest.domains).length} authored fixture candidates. Native validation is still required.`,
  );
  process.exit(0);
}

const fixtureManifest = JSON.parse(fs.readFileSync(path.join(fixtures, "manifest.json"), "utf8"));
const names = Object.keys(schema.definitions);
const missing = names.filter((name) => !fixtureManifest.domains[name]);
if (missing.length) throw new Error(`Missing domain fixtures: ${missing.join(", ")}`);
const files = names.map((name) => fixtureManifest.domains[name].file);
if (values["compile-only"] && !values.out)
  throw new Error("--compile-only requires --out so it cannot replace a reviewed native report.");
const work = values.work
  ? path.resolve(values.work)
  : fs.mkdtempSync(path.join(tmpdir(), "krieg-domain-audit-"));
fs.mkdirSync(work, { recursive: true });
if (fs.existsSync(path.join(work, "generated")))
  throw new Error(`Audit work directory is not fresh: ${work}`);
const generated = path.join(work, "generated"),
  baseline = path.join(work, "baseline");
fs.mkdirSync(generated, { recursive: true });
fs.mkdirSync(baseline, { recursive: true });
const externalAssets = JSON.parse(
  fs.readFileSync(path.join(fixtures, "external-assets.json"), "utf8"),
);
let assetRoot = values.assets && path.resolve(values.assets);
if (values["fetch-assets"] && !assetRoot) {
  assetRoot = path.join(work, "external-assets");
  for (const asset of externalAssets.files) {
    const target = path.join(assetRoot, asset.auditPath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const result = spawnSync(
      "curl",
      ["--fail", "--silent", "--show-error", "--location", "--output", target, asset.url],
      { encoding: "utf8" },
    );
    if (result.error || result.status !== 0)
      throw (
        result.error ??
        new Error(`External audit asset download failed: ${asset.path}: ${result.stderr}`)
      );
  }
}
if (assetRoot)
  for (const asset of externalAssets.files) {
    const bytes = fs.readFileSync(path.join(assetRoot, asset.auditPath));
    const gitBlob = createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
    if (
      sha256(bytes) !== asset.sha256 ||
      gitBlob !== asset.gitBlob ||
      !bytes.subarray(0, 4).equals(Buffer.from("@@b@"))
    )
      throw new Error(`External asset integrity mismatch: ${asset.auditPath}`);
  }
if (!values["compile-only"] && !assetRoot)
  throw new Error(
    "Native audit requires --assets DIR or --fetch-assets; copyrighted model assets are kept outside the repository.",
  );
for (const support of [path.join(fixtures, "support"), ...(assetRoot ? [assetRoot] : [])])
  for (const file of walk(support)) {
    const relative = path.relative(support, file);
    for (const directory of [generated, baseline]) {
      const target = path.join(directory, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(file, target);
    }
  }
const mutations = {};
const compilation = compileProject({ rootDir: fixtures, files });
const domains = Object.fromEntries(
  names.map((name) => [
    name,
    {
      fixture: `tests/fixtures/native-domains/${fixtureManifest.domains[name].file}`,
      fixtureSha256: sha256(
        fs.readFileSync(path.join(fixtures, fixtureManifest.domains[name].file)),
      ),
      nativeReference: fixtureManifest.domains[name].reference,
      cwt: fixtureManifest.domains[name].cwt,
      compile: { attempted: true, passed: compilation.success },
      outputs: [],
      nativeCwt: { attempted: false, passed: false, diagnostics: [] },
      engineValidation: "not-run",
    },
  ]),
);
const bySource = new Map(
  names.map((name) => [path.resolve(fixtures, fixtureManifest.domains[name].file), name]),
);
for (const output of compilation.outputs) {
  const name = bySource.get(path.resolve(output.sourceFile));
  if (!name) throw new Error(`Output has no declared fixture: ${output.sourceFile}`);
  if (output.representation !== "schema-native")
    throw new Error(`${name} bypassed the named schema-native constructor.`);
  const text = emitPdx(output.document);
  const target = path.join(generated, output.path);
  if (fs.existsSync(target)) throw new Error(`Duplicate audit output: ${output.path}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
  domains[name].outputs.push({ path: output.path, sha256: sha256(text) });
}
const negative = path.join(work, "negative");
fs.cpSync(generated, negative, { recursive: true });
for (const [name, domain] of Object.entries(domains)) {
  const definition = schema.definitions[name];
  const output =
    domain.outputs.find((item) => item.path.startsWith(`${definition.folder}/`)) ??
    domain.outputs[0];
  if (!output) continue;
  const target = path.join(negative, output.path);
  const document = parsePdx(fs.readFileSync(target, "utf8"), { retainSource: false }).document;
  let items = document.items;
  if (definition.root || definition.rootField)
    items = blockItems(props(items).find((item) => item.value.kind === "block")?.value);
  if (definition.idMode !== "anonymous")
    items = blockItems(props(items).find((item) => item.value.kind === "block")?.value);
  const before = emitPdx({ items });
  const identifiers = items.filter(
    (item) => item.kind === "property" && item.key.text === definition.idField,
  );
  const specific = {
    AiFocus: [property("research", block([property("defensive", atom("not_a_number"))]))],
    CountryTagAlias: [
      property("fallback", atom("GER")),
      property("fallback", atom("FRA")),
      property("fallback", atom("ENG")),
    ],
    DynamicModifier: [property("attacker_modifier", atom("no"))],
    Ideology: [
      property("types", block([property("krg_audit_subtype", block([]))])),
      property("color", block([atom("not_an_integer")])),
    ],
    OnAction: [property("random_events", block([property("not_an_integer", atom("0"))]))],
    ContinuousFocusPalette: [property("country", block([property("base", atom("not_a_number"))]))],
    FocusStyle: [],
    ScientistTrait: [property("icon", atom("GFX_KRG_MISSING"))],
  }[name];
  items.splice(
    0,
    items.length,
    ...identifiers,
    ...(specific ?? [
      property(
        "krg_invalid_rule_field",
        block([property("krg_invalid_nested", atom("krg_invalid_value"))]),
      ),
    ]),
  );
  mutations[name] = {
    path: output.path,
    field: specific ? "domain-specific-invalid-field-value" : "krg_invalid_rule_field",
    beforeSha256: sha256(before),
    mutation: specific
      ? "preserve-subtype-and-inject-invalid-value"
      : "remove-fields-and-insert-invalid-block",
  };
  fs.writeFileSync(target, emitPdx(document));
}
const report = {
  formatVersion: 2,
  supportFiles: walk(path.join(fixtures, "support")).map((file) => ({
    path: path.relative(fixtures, file).replaceAll(path.sep, "/"),
    sha256: sha256(fs.readFileSync(file)),
  })),
  externalAssets,
  schemaSha256: sha256(fs.readFileSync(path.join(repo, "src/schema/hoi4-domains.json"))),
  generatedAt: new Date().toISOString(),
  scope:
    "One authored minimal public-constructor sample per domain. Passing is sample-level CWT evidence, not exhaustive API semantics or game execution.",
  schema: schema.provenance,
  fixtureManifestSha256: sha256(fs.readFileSync(path.join(fixtures, "manifest.json"))),
  compilation: { success: compilation.success, diagnostics: compilation.diagnostics },
  baseline: { attempted: false },
  domains,
  engineValidation: "not-run",
};
function save() {
  const destination = path.resolve(
    values.out ?? path.join(repo, "reports/validation/domain-native-audit.json"),
  );
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(
    destination,
    JSON.stringify(report, null, 2)
      .replaceAll(repo, "$REPO/")
      .replaceAll(work, "$WORK")
      .replaceAll(vanilla ?? "\0", "$VANILLA")
      .replaceAll(values.rules ? path.resolve(values.rules) : "\0", "$RULES")
      .replaceAll(values.cwtools ? path.resolve(values.cwtools) : "\0", "$CWTOOLS")
      .replaceAll(assetRoot ?? "\0", "$EXTERNAL_ASSETS") + "\n",
  );
}
if (!compilation.success) {
  save();
  console.error(JSON.stringify(compilation.diagnostics, null, 2));
  process.exitCode = 1;
} else if (values["compile-only"]) {
  save();
  console.log(
    `Compiled ${names.length} named constructors to ${compilation.outputs.length} native files; native CWTools not run.`,
  );
} else {
  if (!values.cwtools || !values.rules || !vanilla)
    throw new Error(
      "Native audit requires --cwtools, --rules and --vanilla; use --compile-only explicitly to skip.",
    );
  const binary = path.resolve(values.cwtools),
    rules = path.resolve(values.rules);
  const version = spawnSync(binary, ["--version"], { encoding: "utf8" });
  if (version.error || version.status !== 0) throw version.error ?? new Error(version.stderr);
  report.tool = { version: version.stdout.trim(), sha256: sha256(fs.readFileSync(binary)) };
  const run = (name, directory, selectedRules = rules) => {
    const out = path.join(work, `${name}.json`);
    const args = [
      "validate",
      "--game",
      "hoi4",
      "--directory",
      directory,
      "--rules",
      selectedRules,
      "--vanilla",
      vanilla,
      "--no-vanilla-cache",
      "--report-type",
      "json",
      "--output-file",
      out,
    ];
    const start = Date.now();
    const result = spawnSync(binary, args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
    fs.writeFileSync(path.join(work, `${name}.log`), result.stdout + result.stderr);
    if (result.error || ![0, 1].includes(result.status) || !fs.existsSync(out))
      throw (
        result.error ??
        new Error(
          `CWTools ${name} failed: status=${result.status} signal=${result.signal}; see ${work}`,
        )
      );
    const diagnostics = JSON.parse(fs.readFileSync(out, "utf8"));
    if (!Array.isArray(diagnostics)) throw new Error(`Invalid diagnostic output for ${name}`);
    return {
      attempted: true,
      exitCode: result.status,
      signal: result.signal,
      durationMs: Date.now() - start,
      command: [binary, ...args],
      diagnostics,
    };
  };
  const ruleFiles = walk(rules)
    .filter((file) => file.endsWith(".cwt"))
    .map((file) => ({
      path: path.relative(rules, file).replaceAll(path.sep, "/"),
      sha256: sha256(fs.readFileSync(file)),
    }));
  report.rulesSnapshot = { files: ruleFiles, sha256: sha256(JSON.stringify(ruleFiles)) };
  const compatibility = path.join(work, "compatibility-rules");
  fs.cpSync(rules, compatibility, { recursive: true });
  const corrections = [
    {
      domain: "ScientistTrait",
      file: "common/traits.cwt",
      before: 'path = "game/common/scientist_trait"',
      after: 'path = "game/common/scientist_traits"',
      evidence: "common/scientist_traits/00_traits.txt",
      reason:
        "The supplied rules use a singular directory; the supplied native game uses the plural directory.",
    },
    {
      domain: "FocusStyle",
      file: "common/national_focus.cwt",
      before: "\nstyle = {",
      after: "\nfocus_style = {",
      evidence: "common/national_focus/00_titlebar_styles.txt",
      reason:
        "Align the rule-body identifier with type[focus_style]; the native style node and every field remain unchanged.",
    },
    {
      domain: "ContinuousFocusPalette",
      file: "common/national_focus.cwt",
      before: "continous_focus_tree",
      after: "continuous_focus_palette",
      evidence: "common/continuous_focus/generic.txt",
      reason:
        "Align the internal type/rule spelling with the native type_key_filter for cwtools 2.3.0; field rules remain unchanged.",
    },
    {
      domain: "OnAction",
      file: "on_actions.cwt",
      before: "type[on_action]",
      after: "type[on_actions]",
      evidence: "common/on_actions/00_on_actions.txt",
      reason:
        "Align the generic type identifier with the fixed native on_actions root for cwtools 2.3.0; hook bodies are preserved.",
    },
    {
      domain: "OnAction",
      file: "on_actions.cwt",
      before: "\non_action = {",
      after: "\non_actions = {",
      evidence: "common/on_actions/00_on_actions.txt",
      reason:
        "Use the same aligned identifier for the existing rule body; no hook constraints are relaxed.",
    },
  ];
  for (const correction of corrections) {
    const target = path.join(compatibility, correction.file);
    const before = fs.readFileSync(target, "utf8");
    if (!before.includes(correction.before))
      throw new Error(
        `Expected compatibility correction no longer applies: ${correction.file}: ${correction.before}`,
      );
    const after = before.replaceAll(correction.before, correction.after);
    fs.writeFileSync(target, after);
    correction.beforeSha256 = sha256(before);
    correction.afterSha256 = sha256(after);
    const evidence = path.join(vanilla, correction.evidence);
    if (!fs.existsSync(evidence))
      throw new Error(
        `Missing native evidence for compatibility correction: ${correction.evidence}`,
      );
    correction.evidenceSha256 = sha256(fs.readFileSync(evidence));
  }
  report.ruleCorrections = corrections;
  const key = (item, directory) =>
    JSON.stringify([
      item.file.replaceAll(directory, "").replaceAll(vanilla, "$VANILLA"),
      item.code,
      item.severity,
      item.message,
    ]);
  const difference = (after, before, afterDir, beforeDir) => {
    const counts = new Map();
    for (const item of before) {
      const id = key(item, beforeDir);
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return after.filter((item) => {
      const id = key(item, afterDir),
        count = counts.get(id) ?? 0;
      if (!count) return true;
      counts.set(id, count - 1);
      return false;
    });
  };
  const byPath = new Map(
    Object.entries(domains).flatMap(([name, domain]) =>
      domain.outputs.map((output) => [output.path, name]),
    ),
  );
  function assess(label, selectedRules) {
    const base = run(`${label}-baseline`, baseline, selectedRules);
    const positive = run(`${label}-positive`, generated, selectedRules);
    const invalid = run(`${label}-negative`, negative, selectedRules);
    const added = difference(positive.diagnostics, base.diagnostics, generated, baseline);
    const negativeAdded = difference(
      invalid.diagnostics,
      positive.diagnostics,
      negative,
      generated,
    );
    const results = Object.fromEntries(
      names.map((name) => [
        name,
        {
          nativeCwt: { attempted: true, passed: false, diagnostics: [] },
          ruleMatch: { attempted: true, passed: false, ...mutations[name], diagnostics: [] },
        },
      ]),
    );
    const unassigned = [];
    for (const diagnostic of added) {
      const relative = path.relative(generated, diagnostic.file).replaceAll(path.sep, "/");
      const name = byPath.get(relative),
        normalized = { ...diagnostic, file: relative };
      if (name) results[name].nativeCwt.diagnostics.push(normalized);
      else unassigned.push(normalized);
    }
    for (const [name, result] of Object.entries(results)) {
      const probe = mutations[name];
      result.ruleMatch.diagnostics = negativeAdded
        .filter(
          (item) => path.relative(negative, item.file).replaceAll(path.sep, "/") === probe?.path,
        )
        .map((item) => ({ ...item, file: probe.path }));
      result.ruleMatch.passed = result.ruleMatch.diagnostics.length > 0;
      result.nativeCwt.passed =
        domains[name].outputs.length > 0 &&
        result.nativeCwt.diagnostics.length === 0 &&
        result.ruleMatch.passed;
    }
    return {
      base,
      positive,
      invalid,
      addedDiagnostics: added.length,
      unassignedDiagnostics: unassigned,
      domains: results,
      summary: {
        domains: names.length,
        compilerPassed: names.length,
        nativeCwtPassed: Object.values(results).filter((domain) => domain.nativeCwt.passed).length,
        nativeCwtFailed: Object.values(results).filter((domain) => !domain.nativeCwt.passed).length,
        ruleMatchPassed: Object.values(results).filter((domain) => domain.ruleMatch.passed).length,
        baselineDiagnostics: base.diagnostics.length,
        addedDiagnostics: added.length,
      },
    };
  }
  report.originalRules = assess("original", rules);
  report.compatibilityRules = assess("compatibility", compatibility);
  for (const [name, domain] of Object.entries(domains)) {
    domain.originalNativeCwt = report.originalRules.domains[name].nativeCwt;
    domain.originalRuleMatch = report.originalRules.domains[name].ruleMatch;
    domain.nativeCwt = report.compatibilityRules.domains[name].nativeCwt;
    domain.ruleMatch = report.compatibilityRules.domains[name].ruleMatch;
    domain.ruleCorrections = corrections
      .filter((correction) => correction.domain === name)
      .map(({ file, reason }) => ({ file, reason }));
  }
  delete report.originalRules.domains;
  delete report.compatibilityRules.domains;
  report.summary = {
    ...report.compatibilityRules.summary,
    originalRulesPassed: report.originalRules.summary.nativeCwtPassed,
    compatibilityCorrectedDomains: new Set(corrections.map((correction) => correction.domain)).size,
  };
  report.unassignedDiagnostics = report.compatibilityRules.unassignedDiagnostics;
  save();
  console.log(JSON.stringify(report.summary));
  if (report.summary.nativeCwtFailed || report.unassignedDiagnostics.length) process.exitCode = 1;
}
if (!values["keep-work"] && !values.work) fs.rmSync(work, { recursive: true, force: true });
