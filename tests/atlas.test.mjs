import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import ts from "typescript";
import {
  ProvinceAtlas,
  buildProject,
  createRailwayOverlay,
  indexGeography,
  parseRailwayPlan,
  writeEditorProject,
} from "../dist/project/index.js";
import { editorService } from "./support/editor-service.mjs";

const pixels = [
  [1, 2, 3, 4, 9],
  [1, 5, 6, 4, 9],
  [7, 7, 8, 8, 9],
];
const rgb = (id) => [17 * id, 11 * id + 3, 23 * id + 5];
function bitmap(grid, topDown = false, width = grid[0].length, height = grid.length) {
  const stride = Math.ceil((width * 3) / 4) * 4;
  const bytes = Buffer.alloc(54 + stride * height, 0);
  bytes.write("BM");
  bytes.writeUInt32LE(bytes.length, 2);
  bytes.writeUInt32LE(54, 10);
  bytes.writeUInt32LE(40, 14);
  bytes.writeInt32LE(width, 18);
  bytes.writeInt32LE(topDown ? -height : height, 22);
  bytes.writeUInt16LE(1, 26);
  bytes.writeUInt16LE(24, 28);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const id =
        grid[Math.floor((y * grid.length) / height)][Math.floor((x * grid[0].length) / width)];
      const [r, g, b] = rgb(id),
        offset = 54 + (topDown ? y : height - y - 1) * stride + 3 * x;
      bytes[offset] = b;
      bytes[offset + 1] = g;
      bytes[offset + 2] = r;
    }
  return bytes;
}
function put(files, path, value) {
  files.set(path, { source: path, bytes: Buffer.isBuffer(value) ? value : Buffer.from(value) });
}
function fixture({ topDown = false, large = false } = {}) {
  const files = new Map();
  put(
    files,
    "map/definition.csv",
    Array.from(
      { length: 11 },
      (_, id) =>
        `${id};${rgb(id).join(";")};${id === 9 ? "sea" : "land"};false;${id === 9 ? "ocean" : "plains"};${id === 0 || id === 9 ? 0 : 1}`,
    ).join("\n"),
  );
  put(files, "map/provinces.bmp", bitmap(pixels, topDown, large ? 256 : 5, large ? 256 : 3));
  put(files, "history/states/1.txt", 'state={id=1 name="STATE_ONE" provinces={1 2 3 4 5 6}}');
  put(files, "history/states/2.txt", 'state={id=2 name="STATE_TWO" provinces={7 8}}');
  put(
    files,
    "map/strategicregions/1.txt",
    'strategic_region={id=1 name="REGION_ONE" provinces={1 2 3 4 5 6 7 8 9}}',
  );
  put(files, "map/railways.txt", "# preserve this complete network\r\n1 2 1 2\r\n");
  put(files, "common/country_tags/krieg.txt", 'KRG = "countries/Krieg.txt"');
  put(files, "common/countries/Krieg.txt", "color = { 1 2 3 }");
  return files;
}
function project(t, extra = {}) {
  const root = mkdtempSync(join(tmpdir(), "krieg-atlas-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, text) => {
    const destination = join(root, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, text);
  };
  for (const [path, file] of fixture({ large: true })) write(`base/${path}`, file.bytes);
  write(
    "krgconfig.json",
    JSON.stringify({ name: "atlas-test", gameRoots: ["base"], strictAssets: false, ...extra }),
  );
  write("package.json", '{"name":"atlas-test","type":"module"}');
  write("tsconfig.json", '{"extends":"./.krieg/tsconfig.json","include":["src/**/*.krg.ts"]}');
  write("src/main.krg.ts", "export const unused = 0;");
  return { root, write };
}

test("atlas decodes BGR, padded rows and both BMP orientations to the same physical graph", () => {
  const lower = new ProvinceAtlas(fixture(), { wrapX: false }),
    upper = new ProvinceAtlas(fixture({ topDown: true }), { wrapX: false });
  assert.equal(lower.width, 5);
  assert.equal(lower.height, 3);
  for (let y = 0; y < 3; y++)
    for (let x = 0; x < 5; x++) {
      assert.equal(lower.provinceAt(x, y)?.id, pixels[y][x]);
      assert.equal(upper.provinceAt(x, y)?.id, pixels[y][x]);
    }
  assert.deepEqual(lower.neighbors(1), [2, 5, 7]);
  assert.deepEqual(upper.neighbors(1), lower.neighbors(1));
  assert.equal(lower.provinceAt(-1, 0), undefined);
  assert.deepEqual(lower.planRailway({ via: [1, 4] }).provinces, [1, 2, 3, 4]);
  assert.deepEqual(lower.planRailway({ via: [1, 4], avoidProvinces: [2] }).provinces, [1, 5, 6, 4]);
  assert.deepEqual(lower.planRailway({ via: [1, 8, 4] }).provinces, [1, 7, 8, 4]);
  assert.throws(() => lower.planRailway({ via: [1, 4, 2] }), /revisit/);
  assert.throws(() => lower.planRailway({ via: [1, 4], avoidStates: [1] }), /excluded/);
  assert.throws(
    () => lower.planRailway({ via: [1, 4], avoidStrategicRegions: [99] }),
    /Unknown avoided/,
  );
  assert.throws(() => lower.planRailway({ via: [1, 9] }), /be land/);
  assert.throws(() => lower.land(10), /exist in the bitmap/);
});

test("diagonal pixels do not connect and only the horizontal seam wraps", () => {
  const files = fixture();
  put(
    files,
    "map/provinces.bmp",
    bitmap([
      [1, 9, 4],
      [9, 2, 9],
    ]),
  );
  const plane = new ProvinceAtlas(files, { wrapX: false }),
    world = new ProvinceAtlas(files);
  assert.equal(plane.canBuildRailwayBetween(1, 2), false);
  assert.equal(plane.canBuildRailwayBetween(1, 4), false);
  assert.equal(world.canBuildRailwayBetween(1, 4), true);
  assert.equal(world.canBuildRailwayBetween(1, 2), false);
});

test("impassable and conditional special borders and impassable states are excluded", () => {
  const files = fixture();
  put(
    files,
    "map/adjacencies.csv",
    "From;To;Type;Through;start_x;start_y;stop_x;stop_y;adjacency_rule_name;Comment\n2;3;impassable;-1;-1;-1;-1;-1;;\n5;6;;9;-1;-1;-1;-1;RULE;\n-1;-1;;-1;-1;-1;-1;-1;-1\n",
  );
  const atlas = new ProvinceAtlas(files, { wrapX: false });
  assert.equal(atlas.canBuildRailwayBetween(2, 3), false);
  assert.equal(atlas.canBuildRailwayBetween(5, 6), false);
  assert.deepEqual(atlas.planRailway({ via: [1, 4] }).provinces, [1, 7, 8, 4]);
  assert.throws(() => atlas.planRailway({ via: [1, 4], avoidStates: [2] }), /No safe land route/);
  put(files, "history/states/2.txt", "state={id=2 impassable=yes provinces={7 8}}");
  const blocked = new ProvinceAtlas(files, { wrapX: false });
  assert.throws(() => blocked.planRailway({ via: [1, 4] }), /No safe land route/);
});

test("bitmap truncation, unknown colors and ambiguous state membership fail clearly", () => {
  let files = fixture();
  put(files, "map/provinces.bmp", files.get("map/provinces.bmp").bytes.subarray(0, 58));
  assert.throws(() => new ProvinceAtlas(files), /truncated/);
  files = fixture();
  put(files, "map/provinces.bmp", bitmap([[15]]));
  assert.throws(() => new ProvinceAtlas(files), /no province definition/);
  files = fixture();
  put(files, "history/states/3.txt", "state={id=3 provinces={1}}");
  assert.throws(() => new ProvinceAtlas(files), /multiple states/);
});

test("railway overlays preserve every original byte and share equal-level edges", () => {
  const files = fixture(),
    original = files.get("map/railways.txt").bytes;
  const output = createRailwayOverlay(files, { routes: [{ name: "east", level: 1, via: [1, 4] }] });
  assert.deepEqual(output.diagnostics, []);
  assert.equal(output.preservedRows, 1);
  assert.equal(output.addedRows, 1);
  assert.deepEqual(Buffer.from(output.file.bytes).subarray(0, original.length), original);
  assert.match(Buffer.from(output.file.bytes).toString(), /1 3 2 3 4\n$/);
  const again = new Map(files);
  again.set("map/railways.txt", { source: "first-pass", bytes: output.file.bytes });
  const noOp = createRailwayOverlay(again, { routes: [{ name: "same", level: 1, via: [1, 4] }] });
  assert.equal(noOp.addedRows, 0);
  assert.deepEqual(noOp.file.bytes, output.file.bytes);
  const conflict = createRailwayOverlay(files, {
    routes: [{ name: "upgrade", level: 2, via: [1, 4] }],
  });
  assert.equal(conflict.file, undefined);
  assert.ok(conflict.diagnostics.some((entry) => entry.code === "KRG_RAILWAY_CONFLICT"));
});

test("existing special connections are preserved, while missing bases and malformed rows cannot erase the network", () => {
  const files = fixture();
  put(files, "map/railways.txt", "1 2 1 4\n");
  const result = createRailwayOverlay(files, {
    routes: [{ name: "south", level: 1, via: [7, 8] }],
  });
  assert.deepEqual(result.diagnostics, []);
  assert.match(Buffer.from(result.file.bytes).toString(), /^1 2 1 4\n/);
  files.delete("map/railways.txt");
  const plan = { routes: [{ name: "east", level: 1, via: [1, 4] }] };
  assert.equal(createRailwayOverlay(files, plan).diagnostics[0].code, "KRG_RAILWAY_BASE");
  assert.ok(createRailwayOverlay(files, { ...plan, allowEmptyBase: true }).file);
  put(files, "map/railways.txt", "1 99 1 2\n");
  assert.equal(createRailwayOverlay(files, plan).diagnostics[0].code, "KRG_RAILWAY_BASE");
  assert.throws(
    () => parseRailwayPlan({ routes: [{ name: "bad", level: 7, via: [1, 2] }] }),
    /level/,
  );
  assert.throws(() => parseRailwayPlan({ routes: [], typo: true }), /Unknown/);
});

test("overlapping native base levels are preserved and only block requests touching that ambiguous edge", () => {
  const files = fixture();
  const native = Buffer.from("1 2 1 2\n2 2 1 2\n");
  put(files, "map/railways.txt", native);
  const independent = createRailwayOverlay(files, {
    routes: [{ name: "south", level: 1, via: [7, 8] }],
  });
  assert.deepEqual(independent.diagnostics, []);
  assert.deepEqual(Buffer.from(independent.file.bytes).subarray(0, native.length), native);
  assert.equal(independent.preservedRows, 2);
  const ambiguous = createRailwayOverlay(files, {
    routes: [{ name: "ambiguous", level: 1, via: [1, 2] }],
  });
  assert.equal(ambiguous.file, undefined);
  assert.ok(ambiguous.diagnostics.some((entry) => entry.code === "KRG_RAILWAY_CONFLICT"));
});

test("a full railway overlay refuses a mismatched base with inherited stateless provinces", () => {
  const files = fixture();
  put(files, "history/states/1.txt", "state={id=1 provinces={1 3 4 5 6}}");
  const result = createRailwayOverlay(files, {
    routes: [{ name: "south", level: 1, via: [7, 8] }],
  });
  assert.equal(result.file, undefined);
  assert.ok(
    result.diagnostics.some(
      (entry) =>
        entry.code === "KRG_RAILWAY_BASE_LAND" &&
        entry.message.includes("province 2") &&
        entry.line === 2,
    ),
  );
});

test("CLI builds a complete native railway overlay from an author route declaration", (t) => {
  const { root } = project(t, { railways: { routes: [{ name: "east", level: 1, via: [1, 4] }] } });
  const run = spawnSync(process.execPath, [resolve("dist/cli.js"), "build", root], {
    encoding: "utf8",
  });
  assert.equal(run.status, 0, run.stdout + run.stderr);
  const base = readFileSync(join(root, "base/map/railways.txt"));
  const output = readFileSync(join(root, "build/mod/map/railways.txt"));
  assert.deepEqual(output.subarray(0, base.length), base);
  assert.match(output.toString(), /1 3 2 3 4\n$/);
  const api = buildProject(root, {
    check: true,
    railways: (atlas) => ({
      routes: [{ name: "south", level: 1, via: [atlas.land(7), atlas.land(8)] }],
    }),
  });
  assert.equal(api.success, true, JSON.stringify(api.diagnostics));
});

test("stock TypeScript completes only the selected area's provinces and the compiler emits their numeric IDs", (t) => {
  const { root, write } = project(t);
  const source = `import { DataFile } from "krieg-lang/hoi4";\nimport { geography } from "@project/geography";\nDataFile("common/krieg/atlas.txt", { province: geography.states[1].provinces["2"].id });\n`;
  write("src/main.krg.ts", source);
  writeEditorProject(root);
  const service = editorService(join(root, "tsconfig.json")),
    file = join(root, "src/main.krg.ts");
  const position = source.indexOf('provinces["') + 'provinces["'.length;
  const completions = service.getCompletionsAtPosition(file, position, {});
  const names = completions.entries.map((entry) => entry.name);
  assert.ok(names.includes("2"));
  assert.ok(!names.includes("7"));
  assert.ok(!names.includes("9"));
  const hover = service.getQuickInfoAtPosition(file, source.indexOf('["2"]') + 2);
  assert.match(ts.displayPartsToString(hover.displayParts), /id: 2/);
  assert.deepEqual(service.getSemanticDiagnostics(file), []);
  service.dispose();
  const built = buildProject(root);
  assert.equal(built.success, true, JSON.stringify(built.diagnostics));
  assert.match(
    readFileSync(join(root, "build/mod/common/krieg/atlas.txt"), "utf8"),
    /province = 2/,
  );
  write("src/main.krg.ts", source.replace('provinces["2"]', "provinces[9]"));
  const invalid = buildProject(root, { check: true });
  assert.equal(invalid.success, false);
  assert.ok(invalid.diagnostics.some((entry) => entry.code.startsWith("TS")));
});

test("source metadata, replacements and incomplete projections cannot expose stale province memberships", (t) => {
  const { root, write } = project(t);
  write(
    "src/main.krg.ts",
    `import { StateHistory, state, country } from "krieg-lang/hoi4";\nStateHistory({state:state(1), path:"history/states/1.txt", name:"STATE_ONE", manpower:1, category:"rural", owner:country("KRG"), provinces:[1,2,3,4,5]});`,
  );
  let world = writeEditorProject(root);
  assert.deepEqual([...world.geography.states.get(1).provinces.keys()], [1, 2, 3, 4, 5]);
  assert.deepEqual([...world.baseGeography.states.get(1).provinces.keys()], [1, 2, 3, 4, 5, 6]);
  write(
    "src/main.krg.ts",
    `import { StateHistory, state, country } from "krieg-lang/hoi4";\nfunction members(): number[] { return [1,2,3,4,5,6]; }\nStateHistory({state:state(1), path:"history/states/1.txt", name:"STATE_ONE", manpower:1, category:"rural", owner:country("KRG"), provinces:members()});`,
  );
  world = writeEditorProject(root);
  assert.equal(world.geography.states.get(1).provinces.size, 0);
  assert.ok(
    world.diagnostics.some(
      (entry) => entry.code === "KRG_ATLAS_INCOMPLETE" && entry.severity === "warning",
    ),
  );
  const built = buildProject(root, { check: true });
  assert.equal(built.success, true, JSON.stringify(built.diagnostics));
  const railway = buildProject(root, {
    check: true,
    railways: { routes: [{ name: "east", level: 1, via: [1, 4] }] },
  });
  assert.equal(railway.success, true, JSON.stringify(railway.diagnostics));
  write(
    "krgconfig.json",
    JSON.stringify({
      name: "atlas-test",
      gameRoots: ["base"],
      strictAssets: false,
      mod: { replacePath: ["history/states", "map/strategicregions"] },
    }),
  );
  write(
    "src/main.krg.ts",
    `import { DataFile } from "krieg-lang/hoi4";\nDataFile("history/states/new.txt", {state:{id:3,name:"NEW",provinces:[1,2]}});\nDataFile("map/strategicregions/new.txt", {strategic_region:{id:3,name:"NEW_REGION",provinces:[1,2]}});`,
  );
  world = writeEditorProject(root);
  assert.deepEqual([...world.geography.states.keys()], [3]);
  assert.deepEqual([...world.geography.strategicRegions.keys()], [3]);
  assert.equal(indexGeography(world.effectiveFiles).provinces.get(3).stateId, undefined);
});

test("a real StateHistory declaration can read the base snapshot while replacing its own state", (t) => {
  const { root, write } = project(t);
  write(
    "src/main.krg.ts",
    `import { StateHistory, state, country } from "krieg-lang/hoi4";\nimport { baseGeography } from "@project/geography";\nStateHistory({state:state(1), path:"history/states/1.txt", name:"STATE_ONE", manpower:1, category:"rural", owner:country("KRG"), provinces:[baseGeography.states[1].provinces[1].id,2,3,4,5,6]});`,
  );
  const world = writeEditorProject(root);
  assert.equal(world.geography.states.get(1).provinces.size, 0);
  assert.equal(world.baseGeography.states.get(1).provinces.get(1).id, 1);
  const result = buildProject(root, {
    railways: { routes: [{ name: "east", level: 1, via: [1, 4] }] },
  });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  assert.match(
    readFileSync(join(root, "build/mod/history/states/1.txt"), "utf8"),
    /provinces = \{[\s\S]*1[\s\S]*6/,
  );
  const service = editorService(join(root, "tsconfig.json"));
  assert.deepEqual(service.getSemanticDiagnostics(join(root, "src/main.krg.ts")), []);
  service.dispose();
});

test("literal project-property optimization does not use forged source assertion types", (t) => {
  const { root, write } = project(t);
  write(
    "src/main.krg.ts",
    `import { DataFile } from "krieg-lang/hoi4";\nimport { geography } from "@project/geography";\nDataFile("common/krieg/safe.txt", { province: (geography.states[1].provinces[2] as { id: 999 }).id });`,
  );
  const result = buildProject(root, { check: true });
  assert.equal(result.success, false);
  assert.ok(
    result.diagnostics.some((entry) => entry.code.startsWith("TS") || entry.code.startsWith("KRG")),
  );
  write(
    "src/main.krg.ts",
    `import { DataFile } from "krieg-lang/hoi4";\nimport { geography } from "@project/geography";\nfunction land(province: { id: number; kind: "land" }): number { return province.id; }\nDataFile("common/krieg/safe.txt", { province: land(geography.strategicRegions[1].provinces[9]) });`,
  );
  const water = buildProject(root, { check: true });
  assert.equal(water.success, false);
  assert.ok(
    water.diagnostics.some((entry) => entry.code.startsWith("TS") && entry.message.includes("sea")),
  );
});

test("the typed StrategicRegion declaration updates geographic completion metadata before compilation", (t) => {
  const { root, write } = project(t);
  write(
    "src/main.krg.ts",
    `import { StrategicRegion } from "krieg-lang/hoi4";\nStrategicRegion({id:1,outputPath:"map/strategicregions/1.txt",name:"NEW_REGION",provinces:[1,2,3,4,5,6,7,8],weather:{period:[{between:[0,30],temperature:[11,28],minSnowLevel:0}]}});`,
  );
  const world = writeEditorProject(root);
  assert.equal(world.geography.strategicRegions.get(1).provinces.has(9), false);
  assert.equal(world.baseGeography.strategicRegions.get(1).provinces.has(9), true);
  assert.equal(world.geography.strategicRegions.get(1).name, "NEW_REGION");
  const result = buildProject(root);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  assert.match(
    readFileSync(join(root, "build/mod/map/strategicregions/1.txt"), "utf8"),
    /name = NEW_REGION/,
  );
});
