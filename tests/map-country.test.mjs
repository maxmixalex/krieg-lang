import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  buildProject,
  importProject,
  validateCountries,
  validateMap,
} from "../dist/project/index.js";

function put(files, path, text) {
  files.set(path, { source: path, bytes: Buffer.isBuffer(text) ? text : Buffer.from(text) });
}
function bmp(bits = 24, width = 256, height = 256, color = [10, 20, 30]) {
  const offset = 54 + (bits === 8 ? 1024 : 0),
    stride = Math.ceil((width * bits) / 32) * 4;
  const bytes = Buffer.alloc(offset + stride * height);
  bytes.write("BM");
  bytes.writeUInt32LE(bytes.length, 2);
  bytes.writeUInt32LE(offset, 10);
  bytes.writeUInt32LE(40, 14);
  bytes.writeInt32LE(width, 18);
  bytes.writeInt32LE(height, 22);
  bytes.writeUInt16LE(1, 26);
  bytes.writeUInt16LE(bits, 28);
  if (bits === 8)
    for (let i = 0; i < 256; i++)
      for (let component = 0; component < 3; component++) bytes[54 + i * 4 + component] = i;
  if (bits === 24)
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const offsetAt = offset + y * stride + x * 3;
        bytes[offsetAt] = color[2];
        bytes[offsetAt + 1] = color[1];
        bytes[offsetAt + 2] = color[0];
      }
  return bytes;
}
function mapFixture() {
  const files = new Map();
  put(
    files,
    "map/definition.csv",
    "0;0;0;0;land;false;unknown;0\n1;10;20;30;land;true;plains;1\n2;30;40;50;land;true;hills;1\n3;60;70;80;sea;true;ocean;0\n",
  );
  put(files, "map/provinces.bmp", bmp());
  for (const name of ["terrain", "rivers", "heightmap", "trees", "cities"])
    put(files, `map/${name}.bmp`, bmp(8));
  put(files, "map/world_normal.bmp", bmp());
  put(files, "map/continent.txt", "continents = { europe }");
  put(
    files,
    "map/default.map",
    'width=256 height=256 definitions="definition.csv" provinces="provinces.bmp" terrain="terrain.bmp"',
  );
  put(
    files,
    "history/states/1.txt",
    "state={id=1 name=STATE_1 provinces={1 2} history={owner=KRG}}",
  );
  put(files, "map/strategicregions/1.txt", "strategic_region={id=1 provinces={1 2 3}}");
  put(files, "map/railways.txt", "1 2 1 2\n");
  put(files, "map/supply_nodes.txt", "1 1\n");
  put(
    files,
    "map/adjacencies.csv",
    "From;To;Type;Through;start_x;start_y;stop_x;stop_y;adjacency_rule_name;Comment\n1;2;sea;3;-1;-1;-1;-1;TEST_STRAIT;Authored fixture\n-1;-1;-1;-1;-1;-1;-1;-1;-1\n",
  );
  put(files, "map/buildings.txt", "1;naval_base;30;10;40;0;3\n");
  put(files, "map/unitstacks.txt", "1;0;30;10;40;0;0.3\n");
  put(files, "map/adjacency_rules.txt", 'adjacency_rule={name="TEST_STRAIT" friend={army=yes}}');
  return files;
}

test("complete authored map fixture passes bitmap, province, continent, state, region, strait and supply validation", () => {
  assert.deepEqual(validateMap(mapFixture()), []);
});

test("native adjacency terminator permits an empty type column and still ends the file", () => {
  const files = mapFixture();
  const native = "1;2;sea;3;-1;-1;-1;-1;TEST_STRAIT;Authored fixture\n-1;-1;;-1;-1;-1;-1;-1;-1\n";
  put(files, "map/adjacencies.csv", native);
  assert.deepEqual(validateMap(files), []);
  put(files, "map/adjacencies.csv", native + "1;2;sea;3;-1;-1;-1;-1;;\n");
  assert.ok(
    validateMap(files).some(
      (diagnostic) =>
        diagnostic.code === "KRG_MAP_ADJACENCY" &&
        diagnostic.message.includes("after the -1 terminator"),
    ),
  );
});

test("native strait rules may omit their default sea adjacency type", () => {
  const files = mapFixture();
  put(
    files,
    "map/adjacencies.csv",
    "1;2;;3;-1;-1;-1;-1;TEST_STRAIT;Authored fixture\n-1;-1;;-1;-1;-1;-1;-1;-1\n",
  );
  assert.deepEqual(validateMap(files), []);
  files.delete("map/adjacency_rules.txt");
  assert.ok(validateMap(files).some((diagnostic) => diagnostic.code === "KRG_MAP_ADJACENCY_RULE"));
});

test("native floating harbors accept land endpoints and naval base spawns use sea endpoints", () => {
  const files = mapFixture();
  put(
    files,
    "map/buildings.txt",
    "1;floating_harbor;30;10;40;0;1\n1;naval_base_spawn;30;10;40;0;3\n",
  );
  assert.deepEqual(validateMap(files), []);
});

test("native sea continents are advisory while undefined continent references remain errors", () => {
  const files = mapFixture();
  const path = "map/definition.csv";
  const definition = Buffer.from(files.get(path).bytes).toString("utf8");
  put(files, path, definition.replace("sea;true;ocean;0", "sea;true;ocean;1"));
  const diagnostics = validateMap(files);
  assert.equal(diagnostics.length, 1);
  assert.equal(diagnostics[0].code, "KRG_MAP_CONTINENT");
  assert.equal(diagnostics[0].severity, "warning");
  put(files, path, definition.replace("sea;true;ocean;0", "sea;true;ocean;99"));
  assert.ok(
    validateMap(files).some(
      (diagnostic) => diagnostic.code === "KRG_MAP_CONTINENT" && diagnostic.severity === "error",
    ),
  );
});

for (const [name, mutate, code] of [
  ["undefined continent", (f) => put(f, "map/continent.txt", "continents={}"), "KRG_MAP_CONTINENT"],
  [
    "sea terrain",
    (f) => put(f, "map/definition.csv", "3;60;70;80;sea;true;plains;1"),
    "KRG_MAP_TERRAIN",
  ],
  ["32-bit province bitmap", (f) => put(f, "map/provinces.bmp", bmp(32)), "KRG_MAP_BITMAP"],
  [
    "mismatched terrain dimensions",
    (f) => put(f, "map/terrain.bmp", bmp(8, 128, 256)),
    "KRG_MAP_DIMENSIONS",
  ],
  [
    "unknown province bitmap color",
    (f) => put(f, "map/provinces.bmp", bmp(24, 256, 256, [1, 2, 3])),
    "KRG_MAP_UNKNOWN_COLOR",
  ],
  [
    "default.map missing file",
    (f) => put(f, "map/default.map", 'terrain="missing.bmp"'),
    "KRG_MAP_FILE",
  ],
  [
    "state split across regions",
    (f) => {
      put(f, "map/strategicregions/1.txt", "strategic_region={id=1 provinces={1 3}}");
      put(f, "map/strategicregions/2.txt", "strategic_region={id=2 provinces={2}}");
    },
    "KRG_MAP_REGION",
  ],
  [
    "state with missing strategic region",
    (f) => put(f, "map/strategicregions/1.txt", "strategic_region={id=1 provinces={1 3}}"),
    "KRG_MAP_REGION",
  ],
  ["non-land railway", (f) => put(f, "map/railways.txt", "1 2 1 3"), "KRG_MAP_LAND"],
  ["stateless supply node", (f) => put(f, "map/supply_nodes.txt", "1 3"), "KRG_MAP_STATE"],
  ["zero railway level", (f) => put(f, "map/railways.txt", "0 2 1 2"), "KRG_MAP_LEVEL"],
  ["railway loop", (f) => put(f, "map/railways.txt", "1 3 1 2 1"), "KRG_MAP_NETWORK"],
  [
    "undefined building state",
    (f) => put(f, "map/buildings.txt", "999;arms_factory;30;10;40;0;0"),
    "KRG_MAP_STATE",
  ],
  [
    "inland naval base",
    (f) => put(f, "map/buildings.txt", "1;naval_base;30;10;40;0;2"),
    "KRG_MAP_COAST",
  ],
  [
    "inland naval base spawn",
    (f) => put(f, "map/buildings.txt", "1;naval_base_spawn;30;10;40;0;2"),
    "KRG_MAP_COAST",
  ],
  [
    "undefined floating harbor endpoint",
    (f) => put(f, "map/buildings.txt", "1;floating_harbor;30;10;40;0;999"),
    "KRG_MAP_COAST",
  ],
  [
    "zero floating harbor endpoint",
    (f) => put(f, "map/buildings.txt", "1;floating_harbor;30;10;40;0;0"),
    "KRG_MAP_COAST",
  ],
  [
    "unknown unit stack province",
    (f) => put(f, "map/unitstacks.txt", "99;0;30;10;40;0;0.3"),
    "KRG_MAP_REFERENCE",
  ],
  [
    "malformed model position",
    (f) => put(f, "map/buildings.txt", "1;arms_factory;NaN;10;40;0;0"),
    "KRG_MAP_POSITIONS",
  ],
  [
    "missing adjacency sentinel",
    (f) => put(f, "map/adjacencies.csv", "1;2;sea;3;-1;-1;-1;-1;;"),
    "KRG_MAP_ADJACENCY",
  ],
  [
    "unknown adjacency province",
    (f) => put(f, "map/adjacencies.csv", "1;99;sea;3;-1;-1;-1;-1;;\n-1;-1;-1;-1;-1;-1;-1;-1;-1"),
    "KRG_MAP_REFERENCE",
  ],
  [
    "unknown adjacency type",
    (f) => put(f, "map/adjacencies.csv", "1;2;teleport;3;-1;-1;-1;-1;;\n-1;-1;;-1;-1;-1;-1;-1;-1"),
    "KRG_MAP_ADJACENCY",
  ],
  [
    "undefined adjacency rule",
    (f) => f.delete("map/adjacency_rules.txt"),
    "KRG_MAP_ADJACENCY_RULE",
  ],
])
  test(`map rejects ${name}`, () => {
    const files = mapFixture();
    mutate(files);
    assert.ok(
      validateMap(files).some((d) => d.code === code),
      JSON.stringify(validateMap(files)),
    );
  });

test("base diagnostics do not mask authored violations or report inherited content as authored", () => {
  const files = mapFixture();
  put(files, "map/railways.txt", "0 2 1 2");
  assert.deepEqual(validateMap(files, new Set(["history/states/1.txt"])), []);
  assert.ok(
    validateMap(files, new Set(["map/railways.txt"])).some((d) => d.code === "KRG_MAP_LEVEL"),
  );
});

function countryFixture() {
  const files = new Map();
  put(files, "common/country_tags/test.txt", 'KRG="countries/Krieg.txt"');
  put(
    files,
    "common/countries/Krieg.txt",
    "graphical_culture=western_european_gfx color=rgb {10 20 30}",
  );
  put(
    files,
    "common/characters/test.txt",
    "characters={KRG_leader={name=KRG_leader country_leader={ideology=liberalism}}}",
  );
  put(
    files,
    "history/countries/KRG - Krieg.txt",
    "capital=1 oob=KRG_1936 recruit_character=KRG_leader",
  );
  put(files, "history/units/KRG_1936.txt", 'division_template={name="Guard"}');
  put(files, "history/states/1.txt", "state={id=1 history={owner=KRG add_core_of=KRG}}");
  return files;
}
const countryWorld = { countries: ["KRG"], states: [1] };

test("country tag, tagged color, history, capital, character, OOB and state ownership resolve together", () => {
  const files = countryFixture();
  assert.deepEqual(validateCountries(files, new Set(files.keys()), countryWorld, true), []);
});

test("native dynamic tag controls and untagged integer or float country colors remain valid", () => {
  for (const color of ["{10 20 30}", "{0.1 0.2 0.3}", "rgb {@red 20 30}"]) {
    const files = countryFixture();
    put(files, "common/country_tags/test.txt", 'dynamic_tags=yes KRG="countries/Krieg.txt"');
    put(files, "common/countries/Krieg.txt", `color=${color}`);
    assert.deepEqual(validateCountries(files, new Set(files.keys()), countryWorld, true), []);
  }
});

test("native dynamic country controls, bare colors and adjacency terminators survive import and project check", (t) => {
  const root = mkdtempSync(join(tmpdir(), "krieg-native-project-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const native = join(root, "native");
  for (const [path, text] of Object.entries({
    "common/country_tags/dynamic.txt": 'dynamic_tags = yes\nD01 = "countries/Dynamic.txt"\n',
    "common/countries/Dynamic.txt":
      "graphical_culture = western_european_gfx\ncolor = { 10 20 30 }\n",
    "map/adjacencies.csv": "1;2;sea;-1;-1;-1;-1;-1;;\n-1;-1;;-1;-1;-1;-1;-1;-1\n",
  })) {
    const target = join(native, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text);
  }
  const imported = importProject(native, join(root, "project"));
  assert.equal(imported.success, true, JSON.stringify(imported.diagnostics));
  const checked = buildProject(imported.destination, { check: true });
  assert.equal(checked.success, true, JSON.stringify(checked.diagnostics));
  assert.deepEqual(checked.diagnostics, []);
});
for (const [name, mutate, code] of [
  [
    "missing common country file",
    (f) => f.delete("common/countries/Krieg.txt"),
    "KRG_COUNTRY_FILE",
  ],
  [
    "invalid tag",
    (f) => put(f, "common/country_tags/test.txt", 'krg="countries/Krieg.txt"'),
    "KRG_COUNTRY_TAG",
  ],
  [
    "missing capital state",
    (f) => put(f, "history/countries/KRG - Krieg.txt", "capital=999"),
    "KRG_COUNTRY_CAPITAL",
  ],
  ["missing OOB", (f) => f.delete("history/units/KRG_1936.txt"), "KRG_COUNTRY_OOB"],
  ["missing character", (f) => f.delete("common/characters/test.txt"), "KRG_COUNTRY_CHARACTER"],
  [
    "undefined state owner",
    (f) => put(f, "history/states/1.txt", "state={id=1 history={owner=XYZ}}"),
    "KRG_COUNTRY_STATE",
  ],
  [
    "incomplete country color",
    (f) => put(f, "common/countries/Krieg.txt", "color={10 20}"),
    "KRG_COUNTRY_COLOR",
  ],
  [
    "nonnumeric country color",
    (f) => put(f, "common/countries/Krieg.txt", "color=rgb {red 20 30}"),
    "KRG_COUNTRY_COLOR",
  ],
  [
    "invalid dynamic tag control",
    (f) => put(f, "common/country_tags/test.txt", 'dynamic_tags=no KRG="countries/Krieg.txt"'),
    "KRG_COUNTRY_TAG",
  ],
])
  test(`country creation rejects ${name}`, () => {
    const files = countryFixture();
    mutate(files);
    const diagnostics = validateCountries(files, new Set(files.keys()), countryWorld, true);
    assert.ok(diagnostics.some((d) => d.code === code && d.severity === "error"));
  });

test("country flag dimensions are checked by large/medium/small destination", () => {
  const files = countryFixture();
  const bytes = Buffer.alloc(18 + 4 * 10 * 7);
  bytes[2] = 2;
  bytes.writeUInt16LE(10, 12);
  bytes.writeUInt16LE(7, 14);
  bytes[16] = 32;
  put(files, "gfx/flags/small/KRG.tga", bytes);
  assert.deepEqual(validateCountries(files, new Set(files.keys()), countryWorld, true), []);
  put(files, "gfx/flags/KRG.tga", bytes);
  assert.ok(
    validateCountries(files, new Set(files.keys()), countryWorld, true).some(
      (d) => d.code === "KRG_COUNTRY_FLAG",
    ),
  );
});
