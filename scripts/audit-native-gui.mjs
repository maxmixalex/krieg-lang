#!/usr/bin/env node
/** Compile original TSX controls, then check positive and deliberately invalid native GUI files. */
import fs from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { compileProject, emitCompileOutput } from "../dist/compiler/index.js";
import { emitPdx, parsePdx } from "../dist/pdx/index.js";
import { DOMAIN_SCHEMA } from "../dist/compiler/domain-registry.js";

const repo = fileURLToPath(new URL("../", import.meta.url));
const fixture = "tests/fixtures/native-gui/controls.krg.tsx";
const { values } = parseArgs({
  options: {
    cwtools: { type: "string" },
    rules: { type: "string" },
    vanilla: { type: "string" },
    work: { type: "string" },
    out: { type: "string" },
    "compile-only": { type: "boolean" },
  },
});
const hash = (value) => createHash("sha256").update(value).digest("hex");
const work = values.work
  ? path.resolve(values.work)
  : fs.mkdtempSync(path.join(tmpdir(), "krieg-gui-audit-"));
const baseline = path.join(work, "baseline"),
  generated = path.join(work, "generated"),
  negative = path.join(work, "negative");
for (const root of [baseline, generated, negative]) fs.mkdirSync(root, { recursive: true });
const shared = path.join(repo, "tests/fixtures/native-domains/support");
const support = ["gfx/interface/krieg_audit.dds", "interface/krieg_audit.gfx"];
for (const root of [baseline, generated]) {
  for (const file of support) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.copyFileSync(path.join(shared, file), path.join(root, file));
  }
  fs.mkdirSync(path.join(root, "localisation/english"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "localisation/english/gui_audit_l_english.yml"),
    '\uFEFFl_english:\n KRG_AUDIT:0 "Original GUI audit label"\n',
  );
}
const compilation = compileProject({ rootDir: repo, files: [fixture] });
const controls = Object.fromEntries(
  Object.entries(DOMAIN_SCHEMA.gui)
    .filter(([, control]) => control.validation !== "corpus-observed")
    .map(([native, control]) => [
      native,
      {
        factory: control.name,
        fixture,
        compile: { attempted: true, passed: compilation.success },
        path: `interface/audit_${native}.gui`,
        nativeCwt: { attempted: false, passed: false, diagnostics: [] },
        ruleMatch: { attempted: false, passed: false },
        engineValidation: "not-run",
      },
    ]),
);
for (const output of compilation.outputs) {
  const control = Object.values(controls).find((control) => control.path === output.path);
  if (!control) throw new Error(`Unexpected GUI fixture output ${output.path}`);
  const text = emitCompileOutput(output);
  fs.writeFileSync(path.join(generated, output.path), text);
  control.outputSha256 = hash(text);
}
fs.cpSync(generated, negative, { recursive: true });
for (const [native, control] of Object.entries(controls)) {
  const target = path.join(negative, control.path);
  if (!fs.existsSync(target)) continue;
  const document = parsePdx(fs.readFileSync(target, "utf8"), { retainSource: false }).document;
  const gui = document.items.find(
    (item) => item.kind === "property" && item.key.text === "guiTypes",
  );
  function findControl(items) {
    for (const item of items) {
      if (item.kind !== "property" || item.value.kind !== "block") continue;
      if (item.key.text === native) return item;
      const nested = findControl(item.value.items);
      if (nested) return nested;
    }
  }
  const element = gui?.value.kind === "block" ? findControl(gui.value.items) : undefined;
  if (element?.value.kind !== "block") throw new Error(`Missing native control ${native}`);
  const before = element.value.items.length;
  const requiredField = native === "positionType" ? "position" : "name";
  element.value.items = element.value.items.filter(
    (item) => item.kind !== "property" || item.key.text !== requiredField,
  );
  if (element.value.items.length !== before - 1)
    throw new Error(`Expected exactly one ${requiredField} in ${native}`);
  fs.writeFileSync(target, emitPdx(document));
  control.ruleMatch.mutation = `remove-required-${requiredField}`;
  control.ruleMatch.field = requiredField;
}
const report = {
  formatVersion: 1,
  generatedAt: new Date().toISOString(),
  scope:
    "One original static-TSX sample for each declared CWT native GUI kind; a required-field deletion proves that each control matches a native rule. This is sample-level validation, not a rendered game test.",
  schema: DOMAIN_SCHEMA.provenance,
  fixtureSha256: hash(fs.readFileSync(path.join(repo, fixture))),
  support: support.map((file) => ({
    path: `tests/fixtures/native-domains/support/${file}`,
    sha256: hash(fs.readFileSync(path.join(shared, file))),
  })),
  compilation: { success: compilation.success, diagnostics: compilation.diagnostics },
  controls,
  engineValidation: "not-run",
};
function save() {
  const destination = path.resolve(
    values.out ?? path.join(repo, "reports/validation/gui-native-audit.json"),
  );
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(
    destination,
    JSON.stringify(report, null, 2)
      .replaceAll(repo, "$REPO/")
      .replaceAll(work, "$WORK")
      .replaceAll(values.vanilla ? path.resolve(values.vanilla) : "\0", "$VANILLA")
      .replaceAll(values.rules ? path.resolve(values.rules) : "\0", "$RULES")
      .replaceAll(values.cwtools ? path.resolve(values.cwtools) : "\0", "$CWTOOLS") + "\n",
  );
}
if (!compilation.success) {
  save();
  console.error(JSON.stringify(compilation.diagnostics, null, 2));
  process.exitCode = 1;
} else if (values["compile-only"]) {
  save();
  console.log(`Compiled ${compilation.outputs.length} native GUI controls; CWTools was not run.`);
} else {
  if (!values.cwtools || !values.rules || !values.vanilla)
    throw new Error(
      "Specify --cwtools, --rules, --vanilla for native validation, or --compile-only.",
    );
  const binary = path.resolve(values.cwtools),
    rules = path.resolve(values.rules),
    vanilla = path.resolve(values.vanilla);
  const version = spawnSync(binary, ["--version"], { encoding: "utf8" });
  if (version.status !== 0) throw new Error(version.stderr);
  report.tool = { version: version.stdout.trim(), sha256: hash(fs.readFileSync(binary)) };
  const run = (name, directory) => {
    const destination = path.join(work, `${name}.json`);
    const args = [
      "validate",
      "--game",
      "hoi4",
      "--directory",
      directory,
      "--rules",
      rules,
      "--vanilla",
      vanilla,
      "--no-vanilla-cache",
      "--report-type",
      "json",
      "--output-file",
      destination,
    ];
    const start = Date.now();
    const result = spawnSync(binary, args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
    fs.writeFileSync(path.join(work, `${name}.log`), result.stdout + result.stderr);
    if (result.error || ![0, 1].includes(result.status) || !fs.existsSync(destination))
      throw result.error ?? new Error(`CWTools ${name} failed: ${result.status}`);
    const diagnostics = JSON.parse(fs.readFileSync(destination, "utf8"));
    if (!Array.isArray(diagnostics)) throw new Error(`Invalid CWTools ${name} report`);
    return {
      exitCode: result.status,
      durationMs: Date.now() - start,
      command: [binary, ...args],
      diagnostics,
    };
  };
  report.baseline = run("baseline", baseline);
  report.native = run("generated", generated);
  report.negative = run("negative", negative);
  const key = (diagnostic, root) =>
    JSON.stringify([
      diagnostic.file.replaceAll(root, ""),
      diagnostic.code,
      diagnostic.severity,
      diagnostic.message,
    ]);
  const baselineKeys = new Set(report.baseline.diagnostics.map((item) => key(item, baseline)));
  const additions = report.native.diagnostics.filter(
    (item) => !baselineKeys.has(key(item, generated)),
  );
  const positiveKeys = new Set(report.native.diagnostics.map((item) => key(item, generated)));
  const probes = report.negative.diagnostics.filter(
    (item) => !positiveKeys.has(key(item, negative)),
  );
  const normalize = (diagnostic, root) => ({
    ...diagnostic,
    file: path.relative(root, diagnostic.file).replaceAll(path.sep, "/"),
  });
  for (const control of Object.values(controls)) {
    control.nativeCwt = {
      attempted: true,
      passed: false,
      diagnostics: additions
        .filter(
          (item) => path.relative(generated, item.file).replaceAll(path.sep, "/") === control.path,
        )
        .map((item) => normalize(item, generated)),
    };
    const diagnostics = probes
      .filter(
        (item) => path.relative(negative, item.file).replaceAll(path.sep, "/") === control.path,
      )
      .map((item) => normalize(item, negative));
    control.ruleMatch = {
      ...control.ruleMatch,
      attempted: true,
      passed: diagnostics.length > 0,
      diagnostics,
    };
    control.nativeCwt.passed =
      control.nativeCwt.diagnostics.length === 0 && control.ruleMatch.passed;
  }
  report.unassignedDiagnostics = additions
    .filter(
      (item) =>
        !Object.values(controls).some(
          (control) =>
            control.path === path.relative(generated, item.file).replaceAll(path.sep, "/"),
        ),
    )
    .map((item) => normalize(item, generated));
  report.summary = {
    controls: Object.keys(controls).length,
    compilerPassed: compilation.outputs.length,
    nativeCwtPassed: Object.values(controls).filter((control) => control.nativeCwt.passed).length,
    ruleMatchPassed: Object.values(controls).filter((control) => control.ruleMatch.passed).length,
    baselineDiagnostics: report.baseline.diagnostics.length,
    addedDiagnostics: additions.length,
  };
  save();
  console.log(JSON.stringify(report.summary));
  if (
    report.summary.nativeCwtPassed !== report.summary.controls ||
    report.unassignedDiagnostics.length
  )
    process.exitCode = 1;
}
if (!values.work) fs.rmSync(work, { recursive: true, force: true });
