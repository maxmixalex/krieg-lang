// Produce one self-contained launcher + mod directory for a privately hydrated original.
import { unzipSync } from "fflate";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { packProject } from "../dist/project/index.js";
import { compareFiles } from "./compare-rewrite.mjs";
import { hash, hydrate, inputs, portsRoot, readOriginal } from "./rewrite-inputs.mjs";
import { auditRewriteSources } from "./lib/rewrite-source-audit.mjs";
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { out: { type: "string" }, report: { type: "string" } },
});
const [source, id] = positionals;
if (!values.out || !values.report || !source || !Object.hasOwn(inputs, id))
  throw Error(
    "Usage: node scripts/package-rewrite.mjs <mods.zip|unpacked originals> <port> --out installer.zip --report detailed.json",
  );
const project = join(portsRoot, id);
const sourceAudit = auditRewriteSources(join(project, "src"));
hydrate(resolve(source), id);
const assembled = packProject(project, join(project, "build", "krieg-worked-port.zip"));
if (!assembled.archive)
  throw Error("Port build failed: " + JSON.stringify(assembled.build.diagnostics));
const archive = readFileSync(assembled.archive);
const payload = unzipSync(archive),
  folder = JSON.parse(readFileSync(join(project, "krgconfig.json"), "utf8")).name;
const native = new Map();
for (const [path, bytes] of Object.entries(payload)) {
  if (path === folder + ".mod") continue;
  if (!path.startsWith(folder + "/")) throw Error("Unexpected installer root " + path);
  const target = path.slice(folder.length + 1);
  if (target.split("/").some((s) => !s || s.startsWith(".") || s === "original-assets"))
    throw Error("Unexpected game output " + target);
  native.set(target, bytes);
  if (hash(bytes) !== hash(readFileSync(join(assembled.build.outDir, target))))
    throw Error("Installer changed compiled bytes: " + target);
}
if (
  !native.has("descriptor.mod") ||
  !Buffer.from(payload[folder + ".mod"] ?? [])
    .toString("utf8")
    .includes('path="mod/' + folder + '"')
)
  throw Error("Invalid launcher layout");
const originals = readOriginal(resolve(source), id),
  comparison = compareFiles(originals, native);
const sourceScriptFiles = [...originals.entries()].filter(([path]) =>
  /\.(?:txt|gui|gfx|asset|lua)$/i.test(path),
);
const sourceTextLines = sourceScriptFiles.reduce((sum, [, bytes]) => {
  const t = Buffer.from(bytes).toString("utf8");
  return sum + t.split(/\r\n|\r|\n/).length - (t.endsWith("\n") ? 1 : 0);
}, 0);
const version = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
).version;
mkdirSync(dirname(resolve(values.out)), { recursive: true });
writeFileSync(values.out, archive);
const report = {
  version,
  port: id,
  source: inputs[id],
  archive: {
    filename: values.out.split(/[\\/]/).at(-1),
    sha256: hash(archive),
    bytes: archive.length,
    gameFiles: native.size,
    launcher: folder + ".mod",
    launcherPath: "mod/" + folder,
  },
  authoring: sourceAudit,
  originalNativeText: { files: sourceScriptFiles.length, linesIncludingComments: sourceTextLines },
  ...comparison,
};
mkdirSync(dirname(resolve(values.report)), { recursive: true });
writeFileSync(values.report, JSON.stringify(report, null, 2) + "\n");
console.log(
  id +
    ": " +
    native.size +
    " game files; " +
    report.archive.sha256 +
    "; " +
    report.definitions.changed +
    " changed definition groups to examine under the behavior oracles.",
);
