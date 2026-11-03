// Fetch only the pinned official state text, verify Git objects, and create a
// separate read-only reference layer. Never edits supplied corpora or map files.
// Run npm run build first so the ordinary PDX parser is available.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";

const repository = "https://github.com/Kaiserreich/Kaiserreich-HOI4.git";
const commit = "b603c934c871c7e4ef1c08a2dad19a77e6342ca1";
const statesTree = "cb2b59aabbcc9e96c52aadce2c35184e8f3a42a8";
const { values } = parseArgs({
  options: {
    checkout: { type: "string" },
    layer: { type: "string" },
    "verify-existing": { type: "boolean", default: false },
    offline: { type: "boolean", default: false },
    "supplied-states": { type: "string" },
    "provided-map": { type: "string" },
    "map-manifest": { type: "string", default: "reports/validation/complete-examples.json" },
    out: { type: "string", default: "reports/validation/kr-map-state-provenance.json" },
  },
});
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const blobId = (bytes) =>
  createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
if (values.offline) {
  assert.ok(
    values.layer,
    "Offline usage: --offline --layer <existing-layer> --out <existing-manifest.json>",
  );
  const root = resolve(values.layer),
    report = JSON.parse(readFileSync(resolve(values.out), "utf8"));
  assert.equal(report.source.commit, commit);
  assert.equal(report.source.statesTree, statesTree);
  const treeEntries = report.files
    .map((entry) => {
      assert.match(entry.path, /^history\/states\/[^/]+\.txt$/);
      const path = join(root, entry.path),
        bytes = readFileSync(path);
      assert.equal(bytes.length, entry.bytes, entry.path);
      assert.equal(sha256(bytes), entry.sha256, entry.path);
      assert.equal(blobId(bytes), entry.gitBlob, entry.path);
      assert.equal(statSync(path).mode & 0o777, 0o444);
      const name = entry.path.slice("history/states/".length);
      return {
        name,
        bytes: Buffer.concat([Buffer.from(`100644 ${name}\0`), Buffer.from(entry.gitBlob, "hex")]),
      };
    })
    .sort((a, b) => Buffer.compare(Buffer.from(a.name), Buffer.from(b.name)));
  const treeBytes = Buffer.concat(treeEntries.map((entry) => entry.bytes));
  assert.equal(
    createHash("sha1").update(`tree ${treeBytes.length}\0`).update(treeBytes).digest("hex"),
    statesTree,
    "Full subtree must match the pinned official tree, including filenames and completeness.",
  );
  assert.deepEqual(
    filesUnder(root)
      .map((path) => relative(root, path))
      .sort(),
    ["descriptor.mod", ...report.files.map((entry) => entry.path)].sort(),
  );
  assert.equal(sha256(readFileSync(join(root, "descriptor.mod"))), report.layer.descriptor.sha256);
  assert.equal(statSync(root).mode & 0o777, 0o555);
  console.log(
    JSON.stringify(
      {
        offline: true,
        layer: root,
        commit,
        statesTree,
        verifiedFiles: report.files.length,
        verifiedSha256: true,
        verifiedGitBlobs: true,
        verifiedCompleteGitTree: true,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}
if (!values.checkout || !values.layer || !values["supplied-states"] || !values["provided-map"])
  throw new Error(
    "Usage: node scripts/fetch-kr-reference-states.mjs --checkout <external-git-directory> --layer <new-external-layer> --supplied-states <original-history/states> --provided-map <KR/map> [--out report.json] [--verify-existing]",
  );
const checkout = resolve(values.checkout),
  layer = resolve(values.layer);
assert.equal(
  existsSync(layer),
  values["verify-existing"],
  "Use a new output layer, or --verify-existing for read-only validation; never mix state versions.",
);
const { parsePdx } = await import("../dist/pdx/index.js");
function git(...args) {
  return execFileSync(
    "git",
    ["-C", checkout, "-c", "credential.helper=", "-c", "core.autocrlf=false", ...args],
    {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    },
  );
}
mkdirSync(checkout, { recursive: true });
if (!existsSync(join(checkout, ".git"))) {
  git("init");
  git("remote", "add", "origin", repository);
}
assert.equal(git("remote", "get-url", "origin").trim(), repository);
let alreadyFetched = false;
try {
  alreadyFetched = git("rev-parse", "HEAD").trim() === commit;
} catch {
  /* A fresh repository has no HEAD. */
}
if (!alreadyFetched) {
  git("-c", "protocol.version=2", "fetch", "--filter=blob:none", "--depth=1", "origin", commit);
  git("sparse-checkout", "set", "--no-cone", "/history/states/");
  git("checkout", "--detach", "FETCH_HEAD");
}
assert.equal(git("rev-parse", "HEAD").trim(), commit);
assert.equal(git("rev-parse", "HEAD:history/states").trim(), statesTree);
const entries = git("ls-tree", "-r", "-z", commit, "--", "history/states/")
  .split("\0")
  .filter(Boolean)
  .map((entry) => {
    const match = /^(\d+) (\w+) ([0-9a-f]{40})\t(.+)$/.exec(entry);
    assert.ok(match, `Invalid Git tree entry: ${entry}`);
    assert.equal(match[2], "blob");
    assert.equal(match[1], "100644");
    return { path: match[4], gitBlob: match[3] };
  });
assert.ok(entries.length > 900, "Expected the complete official state subtree.");
function filesUnder(root) {
  return readdirSync(root, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(root, entry.name);
      return entry.isDirectory() ? filesUnder(path) : [path];
    })
    .sort();
}
assert.deepEqual(
  filesUnder(join(checkout, "history/states"))
    .map((path) => relative(checkout, path))
    .sort(),
  entries.map((entry) => entry.path).sort(),
  "Working tree must contain the entire subtree without extra files.",
);
// Read canonical blob bytes: upstream .gitattributes can request CRLF checkout
// even with core.autocrlf=false. Never mistake checkout conversion for source.
const blobStream = execFileSync("git", ["-C", checkout, "cat-file", "--batch"], {
  input: entries.map((entry) => entry.gitBlob).join("\n") + "\n",
  maxBuffer: 32 * 1024 * 1024,
});
const rawBlobs = new Map();
let offset = 0;
for (const entry of entries) {
  const end = blobStream.indexOf(10, offset);
  assert.ok(end >= 0);
  const [id, kind, sizeText] = blobStream.subarray(offset, end).toString("utf8").split(" ");
  assert.equal(id, entry.gitBlob);
  assert.equal(kind, "blob");
  const size = Number(sizeText);
  assert.ok(Number.isSafeInteger(size) && size >= 0);
  const bytes = blobStream.subarray(end + 1, end + 1 + size);
  assert.equal(blobId(bytes), entry.gitBlob, entry.path);
  rawBlobs.set(entry.path, bytes);
  offset = end + 2 + size;
}
assert.equal(offset, blobStream.length);
function readStates(root, paths, read = (path) => readFileSync(join(root, path))) {
  const membership = new Map(),
    files = [],
    ids = new Set();
  for (const path of paths) {
    const bytes = read(path);
    files.push({ path, bytes: bytes.length, sha256: sha256(bytes), gitBlob: blobId(bytes) });
    if (!path.endsWith(".txt")) continue;
    const parsed = parsePdx(bytes.toString("utf8"), { sourceName: path });
    assert.deepEqual(
      parsed.diagnostics.filter((item) => item.severity === "error"),
      [],
    );
    const state = parsed.document.items.find(
      (item) => item.kind === "property" && item.key.text === "state",
    )?.value;
    assert.equal(state?.kind, "block", path);
    const property = (name) =>
      state.items.find((item) => item.kind === "property" && item.key.text === name)?.value;
    const id = Number(property("id")?.text),
      name = property("name")?.text;
    assert.ok(
      Number.isSafeInteger(id) && id > 0 && !ids.has(id),
      `Invalid or duplicate state ID: ${path}`,
    );
    ids.add(id);
    const provinces = property("provinces");
    assert.equal(provinces?.kind, "block", path);
    for (const atom of provinces.items) {
      assert.equal(atom.kind, "atom", path);
      const province = Number(atom.text);
      assert.ok(Number.isSafeInteger(province) && province > 0, path);
      const owners = membership.get(province) ?? [];
      owners.push({ state: id, name, path });
      membership.set(province, owners);
    }
  }
  return { membership, files, states: ids.size };
}
const reference = readStates(
  checkout,
  entries.map((entry) => entry.path),
  (path) => rawBlobs.get(path),
);
for (let index = 0; index < entries.length; index++)
  assert.equal(reference.files[index].gitBlob, entries[index].gitBlob, entries[index].path);
assert.ok(
  [...reference.membership.values()].every((owners) => owners.length === 1),
  "Duplicate official province membership.",
);
const suppliedRoot = resolve(values["supplied-states"]);
const supplied = readStates(
  suppliedRoot,
  filesUnder(suppliedRoot).map((path) => relative(suppliedRoot, path)),
);
const mapRoot = resolve(values["provided-map"]);
const railway = readFileSync(join(mapRoot, "railways.txt"));
const orphanRows = new Map();
for (const [index, raw] of railway
  .toString("utf8")
  .replace(/^\uFEFF/, "")
  .split(/\r?\n/)
  .entries()) {
  const line = raw.replace(/#.*/, "").trim();
  if (!line) continue;
  const fields = line.split(/\s+/).map(Number);
  assert.ok(fields.every(Number.isSafeInteger));
  assert.equal(fields.length, fields[1] + 2);
  for (const province of fields.slice(2))
    if (!supplied.membership.has(province)) {
      const rows = orphanRows.get(province) ?? new Set();
      rows.add(index + 1);
      orphanRows.set(province, rows);
    }
}
const expected = [
  13909, 13946, 13947, 13950, 13933, 13926, 13928, 13929, 13930, 13920, 13919, 13911, 13910, 13942,
  13923, 13922, 13918, 13938,
].sort((a, b) => a - b);
assert.deepEqual(
  [...orphanRows.keys()].sort((a, b) => a - b),
  expected,
);
const resolved = expected.map((province) => {
  const owners = reference.membership.get(province);
  assert.equal(owners?.length, 1, `Official reference does not resolve province ${province}`);
  return {
    province,
    suppliedRailwayLines: [...orphanRows.get(province)].sort((a, b) => a - b),
    ...owners[0],
  };
});
const mapManifest = JSON.parse(readFileSync(resolve(values["map-manifest"]), "utf8")).mapSupplement;
assert.equal(mapManifest.commit, commit);
const officialMapBlobs = new Map(
  git("ls-tree", "-r", "-z", commit, "--", "map/")
    .split("\0")
    .filter(Boolean)
    .map((entry) => {
      const match = /^(\d+) (\w+) ([0-9a-f]{40})\t(.+)$/.exec(entry);
      assert.ok(match, `Invalid Git map tree entry: ${entry}`);
      return [match[4], match[3]];
    }),
);
const suppliedMapFiles = new Map(
  filesUnder(mapRoot).map((path) => [`map/${relative(mapRoot, path)}`.toLowerCase(), path]),
);
const caseDifferences = [];
let normalizedMatches = 0;
for (const entry of mapManifest.files) {
  assert.equal(
    entry.gitBlob,
    officialMapBlobs.get(entry.path),
    `Existing manifest disagrees with official commit: ${entry.path}`,
  );
  const path = suppliedMapFiles.get(entry.path.toLowerCase());
  assert.ok(path, `Missing supplied map text: ${entry.path}`);
  const bytes = Buffer.from(readFileSync(path, "utf8").replace(/\r\n/g, "\n"), "utf8");
  assert.equal(blobId(bytes), entry.gitBlob, entry.path);
  if (`map/${relative(mapRoot, path)}` !== entry.path)
    caseDifferences.push({ official: entry.path, supplied: `map/${relative(mapRoot, path)}` });
  normalizedMatches++;
}
const descriptor = `name="Kaiserreich official state reference ${commit.slice(0, 8)}"\nreplace_path="history/states"\n`;
if (!values["verify-existing"]) {
  mkdirSync(layer, { recursive: true });
  for (const entry of reference.files) {
    const path = join(layer, entry.path);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, rawBlobs.get(entry.path), { flag: "wx", mode: 0o444 });
  }
  writeFileSync(join(layer, "descriptor.mod"), descriptor, { flag: "wx", mode: 0o444 });
}
function makeReadOnly(root) {
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) makeReadOnly(path);
    else chmodSync(path, 0o444);
  }
  chmodSync(root, 0o555);
}
if (!values["verify-existing"]) makeReadOnly(layer);
assert.deepEqual(
  filesUnder(layer)
    .map((path) => relative(layer, path))
    .sort(),
  ["descriptor.mod", ...reference.files.map((entry) => entry.path)].sort(),
);
assert.equal(readFileSync(join(layer, "descriptor.mod"), "utf8"), descriptor);
for (const entry of reference.files) {
  assert.equal(blobId(readFileSync(join(layer, entry.path))), entry.gitBlob, entry.path);
  assert.equal(statSync(join(layer, entry.path)).mode & 0o777, 0o444);
}
const report = {
  schema: 1,
  source: {
    repository,
    commit,
    tree: git("rev-parse", "HEAD^{tree}").trim(),
    statesTree: git("rev-parse", "HEAD:history/states").trim(),
  },
  retrieval: {
    transport: "anonymous Git HTTPS",
    filter: "blob:none",
    depth: 1,
    sparsePath: "history/states",
    canonicalBytes: "git cat-file --batch bypasses checkout EOL conversion",
    verification:
      "Every file Git SHA-1 blob hash equals the pinned commit tree; SHA-256 also recorded.",
  },
  scope:
    "Independent official reference layer. Original supplied state corpus remains unchanged and its 18 unassigned railway provinces remain a separately reported blocked input. This validates map text provenance and official state memberships, not binary map provenance, complete mod version identity, game launch, or supply simulation.",
  mapTextCrossCheck: {
    sourceManifest: relative(process.cwd(), resolve(values["map-manifest"])),
    commit,
    manifestBlobsVerifiedAgainstOfficialTree: true,
    matchedFiles: normalizedMatches,
    normalization: "CRLF to LF only; case-insensitive path lookup",
    caseDifferences,
  },
  supplied: {
    states: supplied.states,
    stateFiles: supplied.files.length,
    stateManifestSha256: sha256(Buffer.from(JSON.stringify(supplied.files))),
    railwaysSha256: sha256(railway),
    unassignedRailwayProvinces: expected.length,
  },
  reference: {
    states: reference.states,
    stateFiles: reference.files.length,
    totalBytes: reference.files.reduce((sum, file) => sum + file.bytes, 0),
    uniqueProvinces: reference.membership.size,
    verifiedGitBlobs: reference.files.length,
  },
  layer: {
    path: relative(process.cwd(), layer),
    replacePath: ["history/states"],
    descriptor: { generated: true, sha256: sha256(Buffer.from(descriptor)) },
    filesMode: "0444",
    directoriesMode: "0555",
  },
  resolvedRailwayProvinces: resolved,
  files: reference.files,
};
mkdirSync(dirname(resolve(values.out)), { recursive: true });
writeFileSync(resolve(values.out), JSON.stringify(report, null, 2) + "\n");
assert.equal(statSync(layer).mode & 0o777, 0o555);
console.log(
  JSON.stringify(
    {
      layer,
      report: resolve(values.out),
      reference: report.reference,
      mapTextCrossCheck: report.mapTextCrossCheck,
      resolvedRailwayProvinces: resolved,
    },
    null,
    2,
  ),
);
