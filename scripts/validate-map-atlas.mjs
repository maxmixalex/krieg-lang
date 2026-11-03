import * as prettier from "prettier";
// Reproduce real-bitmap, stock TypeScript editor and native CLI railway checks.
// Private source files stay outside the repository; temporary builds are deleted.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { ProvinceAtlas, createRailwayOverlay, writeEditorProject } from "../dist/project/index.js";
import { editorService } from "../tests/support/editor-service.mjs";
import { walkFiles } from "../dist/project/files.js";

const repo = resolve(fileURLToPath(new URL("..", import.meta.url)));
const { values } = parseArgs({
  options: {
    corpora: { type: "string" },
    "provided-maps": { type: "string" },
    "kr-states": { type: "string" },
    "kr-states-manifest": { type: "string" },
    wiki: { type: "string" },
    out: { type: "string" },
  },
});
if (!values.corpora || !values["provided-maps"])
  throw new Error(
    "Usage: node scripts/validate-map-atlas.mjs --corpora <directory> --provided-maps <directory with KR/map and TNO/map> [--kr-states <verified root containing history/states>] [--wiki <offline-wiki>] [--out report.json]",
  );
const corpora = resolve(values.corpora),
  provided = resolve(values["provided-maps"]);
const vanilla = join(corpora, "Hearts of Iron IV");
const krMetadata = JSON.parse(
  readFileSync(join(repo, "examples/kaiserreich-complete/validation-base.json"), "utf8"),
);
const scratch = mkdtempSync(join(tmpdir(), "krieg-map-atlas-"));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bytes = (file) => file.bytes ?? readFileSync(file.source);
const edge = (a, b) => (a < b ? `${a}:${b}` : `${b}:${a}`);
const report = {
  schema: 1,
  packageVersion: JSON.parse(readFileSync(join(repo, "package.json"))).version,
  scope:
    "Supplied bitmap and text snapshots; deterministic geographic planning, actual TypeScript 5.9 language service, native CLI build, complete-base railway preservation. No game launch or runtime supply simulation.",
  wiki: values.wiki
    ? JSON.parse(readFileSync(join(resolve(values.wiki), "manifest.json"))).pages["4482"]
    : undefined,
  maps: [],
};
const cases = [
  { name: "Vanilla", roots: [vanilla] },
  {
    name: "Kaiserreich",
    roots: [
      vanilla,
      {
        path: join(corpora, "Kaiserreich"),
        replacePath: existsSync(join(corpora, "Kaiserreich/descriptor.mod"))
          ? []
          : krMetadata.replacePath,
      },
      join(provided, "KR"),
    ],
  },
  {
    name: "TNO",
    roots: [
      vanilla,
      join(corpora, "TNO"),
      { path: join(provided, "TNO"), replacePath: ["map/strategicregions"] },
    ],
  },
];
if (values["kr-states"]) {
  const layer = resolve(values["kr-states"]);
  const manifestBytes = readFileSync(
    values["kr-states-manifest"] ?? join(repo, "reports/validation/kr-map-state-provenance.json"),
  );
  const manifest = JSON.parse(manifestBytes);
  const stateFiles = walkFiles(join(layer, "history/states"));
  assert.equal(
    stateFiles.length,
    manifest.files.length,
    "Reference state layer differs from its verification manifest.",
  );
  for (const entry of manifest.files) {
    assert.match(entry.path, /^history\/states\/[^/]+\.txt$/);
    assert.equal(
      hash(readFileSync(join(layer, entry.path))),
      entry.sha256,
      `Reference state hash mismatch: ${entry.path}`,
    );
  }
  report.referenceStateLayer = {
    commit: manifest.source.commit,
    repository: manifest.source.repository,
    files: stateFiles.length,
    manifestSha256: hash(manifestBytes),
    scope: manifest.scope,
  };
  cases.push({
    name: "Kaiserreich-matched",
    roots: [
      ...cases[1].roots,
      { path: resolve(values["kr-states"]), replacePath: ["history/states"] },
    ],
    matchedStateLayer: true,
  });
}
function put(root, path, text) {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
}
function runCli(root) {
  const start = performance.now();
  const result = spawnSync(process.execPath, [join(repo, "dist/cli.js"), "build", root, "--json"], {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
  assert.ok(result.status === 0 || result.status === 1, result.stdout + result.stderr);
  return {
    milliseconds: Math.round(performance.now() - start),
    exitCode: result.status,
    result: JSON.parse(result.stdout),
  };
}
try {
  for (const item of cases) {
    const root = join(scratch, item.name.toLowerCase());
    const config = {
      name: `atlas-${item.name.toLowerCase()}`,
      gameRoots: item.roots,
      strictAssets: false,
    };
    put(root, "krgconfig.json", JSON.stringify(config));
    put(
      root,
      "package.json",
      JSON.stringify({ name: config.name, type: "module", version: "1.0.0" }),
    );
    put(
      root,
      "tsconfig.json",
      JSON.stringify({ extends: "./.krieg/tsconfig.json", include: ["src/**/*.krg.ts"] }),
    );
    put(root, "src/main.krg.ts", "export const unused = 0;\n");
    const editorStart = performance.now();
    const world = writeEditorProject(root);
    const editorMs = Math.round(performance.now() - editorStart);
    const atlasStart = performance.now(),
      atlas = new ProvinceAtlas(world.effectiveFiles);
    const atlasMs = Math.round(performance.now() - atlasStart);
    const base = Buffer.from(bytes(world.effectiveFiles.get("map/railways.txt")));
    const existing = new Set();
    let baseRows = 0;
    for (const row of base
      .toString("utf8")
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)) {
      const line = row.replace(/#.*/, "").trim();
      if (!line) continue;
      baseRows++;
      const fields = line.split(/\s+/).map(Number);
      for (let index = 3; index < fields.length; index++)
        existing.add(edge(fields[index - 1], fields[index]));
    }
    let waypoints;
    for (const province of atlas.geography.provinces.values()) {
      for (const other of atlas.neighbors(province.id)) {
        if (
          !atlas.canBuildRailwayBetween(province.id, other) ||
          existing.has(edge(province.id, other))
        )
          continue;
        const third = atlas
          .neighbors(other)
          .find(
            (id) =>
              id !== province.id &&
              atlas.canBuildRailwayBetween(other, id) &&
              !existing.has(edge(other, id)),
          );
        if (third !== undefined) {
          waypoints = [province.id, other, third];
          break;
        }
      }
      if (waypoints) break;
    }
    assert.ok(waypoints, `${item.name} needs an unused safe three-province corridor`);
    const route = atlas.planRailway({ via: waypoints });
    assert.deepEqual(route.provinces, waypoints);
    assert.deepEqual(atlas.planRailway({ via: waypoints }), route);
    const startProvince = atlas.land(waypoints[0]),
      stateId = startProvince.stateId;
    const regionId = startProvince.strategicRegionId;
    assert.throws(() => atlas.planRailway({ via: waypoints, avoidStates: [stateId] }), /excluded/);
    assert.throws(
      () => atlas.planRailway({ via: waypoints, avoidStrategicRegions: [regionId] }),
      /excluded/,
    );
    assert.throws(
      () => atlas.planRailway({ via: waypoints, avoidProvinces: [waypoints[1]] }),
      /excluded/,
    );
    const nonland = [...atlas.geography.provinces.values()].find(
      (province) => province.kind !== "land",
    );
    assert.throws(() => atlas.land(nonland.id), /be land/);
    assert.throws(() => atlas.land(2 ** 30), /must exist/);
    const plan = { routes: [{ name: "verified-corridor", level: 1, via: waypoints }] };
    const overlay = createRailwayOverlay(world.effectiveFiles, plan, "<validation>", atlas);
    assert.ok(
      overlay.diagnostics.every((diagnostic) => diagnostic.code === "KRG_RAILWAY_BASE_LAND"),
      JSON.stringify(overlay.diagnostics),
    );
    assert.equal(overlay.preservedRows, baseRows);
    if (overlay.file) {
      assert.equal(overlay.addedRows, 1);
      assert.deepEqual(Buffer.from(overlay.file.bytes).subarray(0, base.length), base);
      const updated = new Map(world.effectiveFiles);
      updated.set("map/railways.txt", { source: "<first-build>", bytes: overlay.file.bytes });
      const repeated = createRailwayOverlay(updated, plan, "<validation>", atlas);
      assert.equal(repeated.addedRows, 0);
      assert.deepEqual(repeated.file.bytes, overlay.file.bytes);
      const conflict = createRailwayOverlay(
        updated,
        { routes: [{ ...plan.routes[0], level: 2 }] },
        "<validation>",
        atlas,
      );
      assert.ok(
        conflict.diagnostics.some((diagnostic) => diagnostic.code === "KRG_RAILWAY_CONFLICT"),
      );
    } else assert.ok(overlay.diagnostics.length > 0);
    const source = `import { DataFile } from "krieg-lang/hoi4";\nimport { geography } from "@project/geography";\nDataFile("common/krieg/atlas_probe.txt", { province: geography.states[${stateId}].provinces["${waypoints[0]}"].id });\n`;
    put(root, "src/main.krg.ts", source);
    const languageServiceStart = performance.now();
    const service = editorService(join(root, "tsconfig.json"));
    const file = join(root, "src/main.krg.ts"),
      position = source.indexOf('provinces["') + 'provinces["'.length;
    const completions = service.getCompletionsAtPosition(file, position, {});
    const completionIds = completions.entries
      .map((entry) => Number(entry.name))
      .filter(Number.isSafeInteger)
      .sort((a, b) => a - b);
    const stateIds = [...atlas.geography.states.get(stateId).provinces.keys()].sort(
      (a, b) => a - b,
    );
    assert.deepEqual(completionIds, stateIds);
    assert.deepEqual(service.getSemanticDiagnostics(file), []);
    const quick = service.getQuickInfoAtPosition(file, position);
    assert.ok(ts.displayPartsToString(quick.displayParts).includes(`id: ${waypoints[0]}`));
    service.dispose();
    const languageServiceMs = Math.round(performance.now() - languageServiceStart);
    put(root, "krgconfig.json", JSON.stringify({ ...config, railways: plan }));
    const firstBuild = runCli(root);
    assert.equal(
      firstBuild.result.success,
      !!overlay.file,
      JSON.stringify(firstBuild.result.diagnostics),
    );
    assert.equal(firstBuild.exitCode, overlay.file ? 0 : 1);
    const nativePath = join(root, "build/mod/map/railways.txt");
    const first = overlay.file ? readFileSync(nativePath) : undefined;
    if (overlay.file) {
      assert.deepEqual(first, overlay.file.bytes);
      assert.match(
        readFileSync(join(root, "build/mod/common/krieg/atlas_probe.txt"), "utf8"),
        new RegExp(`province = ${waypoints[0]}(?:\\s|$)`),
      );
    } else {
      assert.equal(existsSync(nativePath), false);
      assert.ok(
        firstBuild.result.diagnostics.some(
          (diagnostic) => diagnostic.code === "KRG_RAILWAY_BASE_LAND",
        ),
      );
    }
    const secondBuild = runCli(root);
    assert.equal(secondBuild.result.success, firstBuild.result.success);
    if (first) assert.deepEqual(readFileSync(nativePath), first);
    else assert.deepEqual(secondBuild.result.diagnostics, firstBuild.result.diagnostics);
    let safeBorders = 0,
      landBorders = 0;
    for (const province of atlas.geography.provinces.values())
      for (const other of atlas.neighbors(province.id)) {
        if (
          other < province.id ||
          province.kind !== "land" ||
          atlas.geography.provinces.get(other).kind !== "land"
        )
          continue;
        landBorders++;
        if (atlas.canBuildRailwayBetween(province.id, other)) safeBorders++;
      }
    const result = {
      name: item.name,
      matchedStateLayer: item.matchedStateLayer === true,
      stateHistory: (() => {
        const entries = [...world.effectiveFiles]
          .filter(([path]) => /^history\/states\/.+\.txt$/i.test(path))
          .sort(([a], [b]) => a.localeCompare(b, "en"));
        return {
          files: entries.length,
          manifestSha256: hash(
            entries.map(([path, file]) => `${path}\0${hash(bytes(file))}\n`).join(""),
          ),
        };
      })(),
      inputs: Object.fromEntries(
        ["map/definition.csv", "map/provinces.bmp", "map/adjacencies.csv", "map/railways.txt"].map(
          (path) => [
            path,
            {
              bytes: bytes(world.effectiveFiles.get(path)).length,
              sha256: hash(bytes(world.effectiveFiles.get(path))),
            },
          ],
        ),
      ),
      width: atlas.width,
      height: atlas.height,
      provincesIncludingSentinel: atlas.geography.provinces.size,
      states: atlas.geography.states.size,
      strategicRegions: atlas.geography.strategicRegions.size,
      physicalBorders: atlas.borderCount,
      physicalLandBorders: landBorders,
      safeRailwayBorders: safeBorders,
      route: waypoints,
      level: 1,
      preservedBaseRows: baseRows,
      addedRows: overlay.addedRows,
      basePreservedByteForByte: overlay.file ? true : null,
      noOpRepeatedOverlay: overlay.file ? true : null,
      conflictRejected: overlay.file ? true : null,
      inputCompatibility: overlay.file
        ? "compatible"
        : "blocked: inherited railway provinces lack painted land/state membership",
      checkedExclusions: ["province", "state", "strategic region", "non-land", "nonexistent"],
      editor: {
        engine: `TypeScript ${ts.version}`,
        selectedState: stateId,
        completionIds,
        exactAreaCompletion: true,
        hoverLiteralId: true,
        semanticDiagnostics: 0,
        declarationBytes: Buffer.byteLength(world.virtualModules["@project/geography"]),
      },
      cli: {
        builds: 2,
        deterministicNativeSha256: first ? hash(first) : null,
        success: firstBuild.result.success,
        nativeOutputWritten: !!first,
        diagnostics: firstBuild.result.diagnostics.map((diagnostic) => ({
          ...diagnostic,
          file: diagnostic.file
            ?.replaceAll(corpora, "$CORPORA")
            .replaceAll(provided, "$PROVIDED_MAPS")
            .replaceAll(root, "$PROJECT"),
        })),
        outputPaths: firstBuild.result.files.map((entry) => entry.path),
      },
      timingsMs: {
        editorGeneration: editorMs,
        atlas: atlasMs,
        languageService: languageServiceMs,
        firstCliBuild: firstBuild.milliseconds,
        repeatedCliBuild: secondBuild.milliseconds,
      },
    };
    report.maps.push(result);
    if (values.out) {
      mkdirSync(dirname(resolve(values.out)), { recursive: true });
      writeFileSync(resolve(values.out), JSON.stringify(report, null, 2) + "\n");
    }
    console.log(
      `${item.name}: ${atlas.width}x${atlas.height}, ${atlas.geography.provinces.size} definitions, ${atlas.borderCount} borders; exact-area TypeScript + planning passed; ${first ? "CLI and complete railway preservation passed" : `CLI correctly blocked ${overlay.diagnostics.length} inherited invalid provinces`}.`,
    );
  }
  if (values.out) {
    mkdirSync(dirname(resolve(values.out)), { recursive: true });
    const outputPath = resolve(values.out);
    writeFileSync(
      outputPath,
      await prettier.format(JSON.stringify(report), {
        filepath: outputPath,
        ...(await prettier.resolveConfig(outputPath)),
      }),
    );
  } else console.log(JSON.stringify(report, null, 2));
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
