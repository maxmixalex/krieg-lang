// Reproduce project + external CWT validation using private installed/supplied bases.
// No source corpus is modified; effective overlays and optional upstream supplements live in scratch.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  constants,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { buildProject, createWorld, loadConfig } from "../dist/project/index.js";
import { walkFiles, slash } from "../dist/project/files.js";

const repo = resolve(fileURLToPath(new URL("..", import.meta.url)));
const { values } = parseArgs({
  options: {
    corpora: { type: "string" },
    "kr-map": { type: "string" },
    "fetch-kr-map": { type: "boolean" },
    out: { type: "string" },
  },
});
if (!values.corpora)
  throw new Error(
    "Usage: node scripts/validate-complete-examples.mjs --corpora <directory> [--kr-map <supplement>] [--fetch-kr-map] [--out report.json]",
  );
const corpus = resolve(values.corpora);
const vanilla = join(corpus, "Hearts of Iron IV"),
  kr = join(corpus, "Kaiserreich");
const executable = join(corpus, process.platform === "win32" ? "cwtools.exe" : "cwtools");
const rules = join(corpus, "cwtools-hoi4-config-master", "cwtools-hoi4-config-master");
const metadata = JSON.parse(
  readFileSync(join(repo, "examples/kaiserreich-complete/validation-base.json"), "utf8"),
);
const scratch = mkdtempSync(join(tmpdir(), "krieg-complete-validation-"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
function fingerprint(root) {
  const hash = createHash("sha256");
  let count = 0,
    bytes = 0;
  for (const file of walkFiles(root)) {
    const data = readFileSync(file);
    hash.update(slash(relative(root, file)) + "\0" + sha256(data) + "\n");
    count++;
    bytes += data.length;
  }
  return { files: count, bytes, manifestSha256: hash.digest("hex") };
}
function sanitize(value) {
  return JSON.parse(
    JSON.stringify(value)
      .replaceAll(repo, "$REPO")
      .replaceAll(corpus, "$CORPORA")
      .replaceAll(scratch, "$SCRATCH"),
  );
}
async function fetchMap(root) {
  const api = `https://api.github.com/repos/Kaiserreich/Kaiserreich-HOI4/git/trees/${metadata.commit}?recursive=1`;
  const response = await fetch(api);
  if (!response.ok) throw new Error(`${api}: ${response.status}`);
  const tree = await response.json();
  if (tree.truncated)
    throw new Error("GitHub returned a truncated tree; no incomplete supplement is accepted.");
  const pending = tree.tree.filter(
    (file) =>
      file.type === "blob" && file.path.startsWith("map/") && /\.(txt|csv|map)$/.test(file.path),
  );
  const output = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (cursor < pending.length) {
        const file = pending[cursor++];
        const url = `https://raw.githubusercontent.com/Kaiserreich/Kaiserreich-HOI4/${metadata.commit}/${file.path.split("/").map(encodeURIComponent).join("/")}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${url}: ${response.status}`);
        const data = Buffer.from(await response.arrayBuffer());
        const gitBlob = createHash("sha1")
          .update(`blob ${data.length}\0`)
          .update(data)
          .digest("hex");
        if (gitBlob !== file.sha) throw new Error(`Pinned Git blob hash mismatch: ${file.path}`);
        const target = join(root, file.path);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, data);
        output.push({ path: file.path, bytes: data.length, sha256: sha256(data), gitBlob });
      }
    }),
  );
  output.sort((a, b) => a.path.localeCompare(b.path, "en"));
  const provenance = {
    source: "https://github.com/Kaiserreich/Kaiserreich-HOI4",
    commit: metadata.commit,
    files: output,
  };
  writeFileSync(join(root, "provenance.json"), JSON.stringify(provenance, null, 2) + "\n");
  return provenance;
}
try {
  const before = { vanilla: fingerprint(vanilla), kaiserreich: fingerprint(kr) };
  let mapRoot = values["kr-map"] && resolve(values["kr-map"]),
    supplement;
  if (!existsSync(join(kr, "map/strategicregions")) && !mapRoot) {
    if (!values["fetch-kr-map"])
      throw new Error(
        "Kaiserreich snapshot has no map directory. Pass --kr-map <verified supplement> or --fetch-kr-map to read pinned official map text into scratch.",
      );
    mapRoot = join(scratch, "kaiserreich-map");
    mkdirSync(mapRoot);
    supplement = await fetchMap(mapRoot);
  }
  if (mapRoot) {
    supplement ??= JSON.parse(readFileSync(join(mapRoot, "provenance.json"), "utf8"));
    if (supplement.commit !== metadata.commit)
      throw new Error(
        "Kaiserreich map supplement and descriptor must use the same pinned upstream revision.",
      );
    for (const file of supplement.files)
      if (sha256(readFileSync(join(mapRoot, file.path))) !== file.sha256)
        throw new Error(`Map supplement hash mismatch: ${file.path}`);
  }
  const checks = [];
  for (const [name, roots] of [
    ["vanilla-complete", [vanilla]],
    [
      "kaiserreich-complete",
      [
        vanilla,
        {
          path: kr,
          replacePath: existsSync(join(kr, "descriptor.mod")) ? [] : metadata.replacePath,
        },
        ...(mapRoot ? [mapRoot] : []),
      ],
    ],
  ]) {
    const project = join(repo, "examples", name),
      options = { gameRoots: roots };
    const build = buildProject(project, options);
    if (!build.success)
      throw new Error(`${name}: ${JSON.stringify(sanitize(build.diagnostics), null, 2)}`);
    const config = loadConfig(project, options),
      effective = createWorld(config, []).effectiveFiles;
    const base = join(scratch, name);
    mkdirSync(base);
    for (const [path, file] of effective) {
      if (path === "provenance.json") continue;
      const target = join(base, path);
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(file.source, target, constants.COPYFILE_FICLONE);
    }
    const output = join(scratch, name + "-cwtools.json");
    const args = [
      "validate",
      "--game",
      "hoi4",
      "--directory",
      build.outDir,
      "--rules",
      rules,
      "--vanilla",
      base,
      "--no-vanilla-cache",
      "--report-type",
      "json",
      "--output-file",
      output,
    ];
    const start = Date.now();
    const external = spawnSync(executable, args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
    if (external.error) throw external.error;
    const diagnostics = existsSync(output) ? JSON.parse(readFileSync(output, "utf8")) : [];
    checks.push(
      sanitize({
        name,
        selectedBase:
          name === "vanilla-complete"
            ? "supplied vanilla text snapshot"
            : "supplied vanilla + supplied Kaiserreich text snapshot with pinned official descriptor replacement paths and pinned official map text supplement",
        effectiveBaseFiles: effective.size,
        project: {
          success: build.success,
          diagnostics: build.diagnostics,
          world: build.world,
          files: build.files,
        },
        external: {
          exitCode: external.status,
          durationMs: Date.now() - start,
          command: [executable, ...args],
          stdout: external.stdout,
          stderr: external.stderr,
          diagnostics,
        },
      }),
    );
  }
  const after = { vanilla: fingerprint(vanilla), kaiserreich: fingerprint(kr) };
  if (JSON.stringify(before) !== JSON.stringify(after))
    throw new Error("Input fingerprint changed during validation.");
  const report = {
    schema: 1,
    generatedAt: new Date().toISOString(),
    scope:
      "Authored complete-example outputs checked against explicit effective bases. CWT and project validation are static checks, not an in-game launch or save/load test.",
    limitations: [
      "Supplied corpus versions are not identified by the downloaded upstream descriptor.",
      "The supplied snapshots omit proprietary art; original example flags, portraits and UI textures are included.",
      "Kaiserreich's missing map text is supplemented from the pinned public commit; binaries remain inherited from the installed game and are not validated here.",
    ],
    kaiserreichDescriptor: metadata,
    mapSupplement: supplement,
    inputIntegrity: { before, after, unchanged: true },
    checks,
  };
  const destination = resolve(
    values.out ?? join(repo, "reports/validation/complete-examples.json"),
  );
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, JSON.stringify(report, null, 2) + "\n");
  for (const check of checks)
    console.log(
      `${check.name}: ${check.project.files.length} output files, CWT exit ${check.external.exitCode}, ${check.external.diagnostics.length} diagnostics`,
    );
  console.log(slash(relative(repo, destination)));
  if (
    checks.some(
      (check) =>
        check.external.exitCode !== 0 ||
        check.external.diagnostics.some((d) => String(d.severity).toLowerCase() === "error"),
    )
  )
    process.exitCode = 1;
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
