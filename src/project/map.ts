import { parsePdx } from "../pdx/index.js";
import { imageInfo } from "./assets.js";
import { fileBytes, properties } from "./world.js";
import type { WorldFile } from "./world.js";
import type { PdxItem } from "../pdx/ast.js";
import type { ProjectDiagnostic } from "./types.js";

interface Province {
  id: number;
  color: number;
  type: string;
  terrain: string;
  continent: number;
}

export function validateMap(
  files: Map<string, WorldFile>,
  ownedPaths?: ReadonlySet<string>,
): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = [];
  const ownedSources =
    ownedPaths && new Set([...ownedPaths].map((path) => files.get(path)?.source));
  const report = (
    code: string,
    message: string,
    file?: string,
    line?: number,
    severity: ProjectDiagnostic["severity"] = "error",
  ): void => {
    if (ownedSources && file && !ownedSources.has(file)) return;
    diagnostics.push({ code, message, file, line, severity });
  };
  const provinces = new Map<number, Province>();
  const colors = new Map<number, number>();
  const definition = files.get("map/definition.csv");
  if (definition) {
    const lines = Buffer.from(fileBytes(definition))
      .toString("utf8")
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/);
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index].trim();
      if (!line || line.startsWith("#")) continue;
      const fields = line.split(";");
      if (fields.length < 8 || fields.slice(0, 4).some((f) => !/^\d+$/.test(f))) {
        report(
          "KRG_MAP_DEFINITION",
          "Expected id;red;green;blue;type;coastal;terrain;continent.",
          definition.source,
          index + 1,
        );
        continue;
      }
      const [id, r, g, b] = fields.slice(0, 4).map(Number);
      if (!Number.isSafeInteger(id) || [r, g, b].some((c) => c < 0 || c > 255)) {
        report(
          "KRG_MAP_COLOR",
          "Province ID or RGB component is out of range.",
          definition.source,
          index + 1,
        );
        continue;
      }
      const color = (r << 16) | (g << 8) | b;
      if (provinces.has(id))
        report(
          "KRG_MAP_DUPLICATE",
          `Province ${id} is defined twice.`,
          definition.source,
          index + 1,
        );
      if (colors.has(color))
        report(
          "KRG_MAP_COLOR",
          `RGB ${r},${g},${b} belongs to both province ${colors.get(color)} and ${id}.`,
          definition.source,
          index + 1,
        );
      provinces.set(id, {
        id,
        color,
        type: fields[4],
        terrain: fields[6],
        continent: Number(fields[7]),
      });
      if (!/^\d+$/.test(fields[7]) || !Number.isSafeInteger(Number(fields[7])))
        report(
          "KRG_MAP_CONTINENT",
          "Continent must be a non-negative integer.",
          definition.source,
          index + 1,
        );
      if (id !== 0 && fields[4] === "land" && Number(fields[7]) === 0)
        report(
          "KRG_MAP_CONTINENT",
          `Land province ${id} must belong to a continent.`,
          definition.source,
          index + 1,
        );
      if (id !== 0 && fields[4] === "sea" && fields[6] !== "ocean")
        report(
          "KRG_MAP_TERRAIN",
          `Sea province ${id} requires ocean terrain.`,
          definition.source,
          index + 1,
        );
      if (id !== 0 && fields[4] === "sea" && Number(fields[7]) > 0)
        report(
          "KRG_MAP_CONTINENT",
          `Sea province ${id} uses continent ${fields[7]}; native sea provinces normally use 0.`,
          definition.source,
          index + 1,
          "warning",
        );
      if (id !== 0 && fields[4] === "lake" && fields[6] !== "lakes")
        report(
          "KRG_MAP_TERRAIN",
          `Lake province ${id} requires lakes terrain.`,
          definition.source,
          index + 1,
        );
      colors.set(color, id);
      if (id !== 0 && !["land", "sea", "lake"].includes(fields[4]))
        report("KRG_MAP_TYPE", `Unknown province type ${fields[4]}.`, definition.source, index + 1);
      if (id !== 0 && !["true", "false"].includes(fields[5]))
        report(
          "KRG_MAP_COAST",
          "Coastal flag must be true or false.",
          definition.source,
          index + 1,
        );
    }
  }
  const bitmap = files.get("map/provinces.bmp");
  let dimensions: { width: number; height: number } | undefined;
  if (bitmap) {
    try {
      const bytes = Buffer.from(fileBytes(bitmap));
      const info = imageInfo(bytes, ".bmp")!;
      dimensions = info;
      if (bytes.readUInt32LE(14) !== 40 || bytes.readUInt16LE(26) !== 1)
        report(
          "KRG_MAP_BITMAP",
          "Map BMPs require a 40-byte BITMAPINFOHEADER and one color plane.",
          bitmap.source,
        );
      if (info.width % 256 || info.height % 256)
        report(
          "KRG_MAP_DIMENSIONS",
          "Province bitmap width and height must be multiples of 256.",
          bitmap.source,
        );
      if (info.bits !== 24 || bytes.readUInt32LE(30) !== 0)
        report(
          "KRG_MAP_BITMAP",
          "Province bitmap must be an uncompressed 24-bit BMP.",
          bitmap.source,
        );
      else if (definition && provinces.size) {
        const offset = bytes.readUInt32LE(10);
        const stride = Math.ceil((info.width * 3) / 4) * 4;
        const unknown = new Set<number>();
        for (let row = 0; row < info.height; row++)
          for (let col = 0; col < info.width; col++) {
            const i = offset + row * stride + col * 3;
            const color = (bytes[i + 2] << 16) | (bytes[i + 1] << 8) | bytes[i];
            if (!colors.has(color)) unknown.add(color);
          }
        if (unknown.size)
          report(
            "KRG_MAP_UNKNOWN_COLOR",
            `${unknown.size} bitmap colors are absent from definition.csv; first: ${[...unknown]
              .slice(0, 8)
              .map((c) => "#" + c.toString(16).padStart(6, "0"))
              .join(", ")}.`,
            bitmap.source,
          );
      }
    } catch (error) {
      report("KRG_MAP_BITMAP", (error as Error).message, bitmap.source);
    }
  }
  const continentFile = files.get("map/continent.txt");
  if (definition && continentFile) {
    const doc = parsePdx(Buffer.from(fileBytes(continentFile)).toString("utf8")).document;
    const list = properties(doc.items).find((prop) => prop.key.text === "continents");
    if (list?.value.kind === "block") {
      const count = list.value.items.filter((item) => item.kind === "atom").length;
      for (const province of provinces.values())
        if (province.continent > count)
          report(
            "KRG_MAP_CONTINENT",
            `Province ${province.id} references undefined continent ${province.continent}; continent.txt defines ${count}.`,
            definition.source,
          );
    }
  }
  for (const [path, expectedBits] of [
    ["map/terrain.bmp", 8],
    ["map/heightmap.bmp", 8],
    ["map/rivers.bmp", 8],
    ["map/trees.bmp", 8],
    ["map/cities.bmp", 8],
    ["map/world_normal.bmp", 24],
  ] as const) {
    const file = files.get(path);
    if (!file) continue;
    try {
      const bytes = Buffer.from(fileBytes(file));
      const info = imageInfo(bytes, ".bmp")!;
      if (
        info.bits !== expectedBits ||
        bytes.readUInt32LE(30) !== 0 ||
        bytes.readUInt32LE(14) !== 40
      )
        report(
          "KRG_MAP_BITMAP",
          `${path} requires an uncompressed ${expectedBits}-bit BMP with BITMAPINFOHEADER.`,
          file.source,
        );
      if (expectedBits === 8 && bytes.readUInt32LE(10) < 54 + 256 * 4)
        report(
          "KRG_MAP_PALETTE",
          `${path} must preserve a complete 256-color palette.`,
          file.source,
        );
      if (
        dimensions &&
        path !== "map/trees.bmp" &&
        (info.width !== dimensions.width || info.height !== dimensions.height)
      )
        report("KRG_MAP_DIMENSIONS", `${path} dimensions must match provinces.bmp.`, file.source);
    } catch (error) {
      report("KRG_MAP_BITMAP", (error as Error).message, file.source);
    }
  }
  const defaultMap = files.get("map/default.map");
  if (defaultMap) {
    const doc = parsePdx(Buffer.from(fileBytes(defaultMap)).toString("utf8")).document;
    for (const prop of properties(doc.items))
      if (dimensions && ["width", "height"].includes(prop.key.text) && prop.value.kind === "atom") {
        const expected = dimensions[prop.key.text as "width" | "height"];
        if (Number(prop.value.text) !== expected)
          report(
            "KRG_MAP_DIMENSIONS",
            `${prop.key.text}=${prop.value.text} does not match provinces.bmp (${expected}).`,
            defaultMap.source,
          );
      } else if (
        prop.value.kind === "atom" &&
        [
          "definitions",
          "provinces",
          "terrain",
          "rivers",
          "heightmap",
          "tree_definition",
          "continent",
          "adjacency_rules",
          "adjacencies",
          "ambient_object",
          "seasons",
        ].includes(prop.key.text)
      ) {
        const reference = prop.value.text.replaceAll("\\", "/");
        if (!files.has(`map/${reference}`))
          report(
            "KRG_MAP_FILE",
            `default.map references missing map/${reference}.`,
            defaultMap.source,
          );
      }
  }
  const stateMembers = new Map<string, number[]>();
  const stateOwners = new Map<number, string>();
  const regionOwners = new Map<number, string>();
  const stateIds = new Map<number, string>();
  const regionIds = new Map<number, string>();
  function inspectGroups(path: string, file: WorldFile, type: "state" | "strategic_region"): void {
    const doc = parsePdx(Buffer.from(fileBytes(file)).toString("utf8"), {
      sourceName: file.source,
    });
    for (const group of properties(doc.document.items)) {
      if (group.key.text !== type || group.value.kind !== "block") continue;
      const props = properties(group.value.items);
      const id = props.find((p) => p.key.text === "id");
      const ids = type === "state" ? stateIds : regionIds;
      if (id?.value.kind === "atom") {
        const numeric = Number(id.value.text);
        if (!Number.isSafeInteger(numeric) || numeric <= 0)
          report("KRG_MAP_ID", `${type} ID must be a positive integer.`, file.source);
        if (ids.has(numeric))
          report(
            "KRG_MAP_DUPLICATE_ID",
            `${type} ${numeric} is defined in both ${ids.get(numeric)} and ${path}.`,
            file.source,
          );
        ids.set(numeric, path);
      }
      const members = props.find((p) => p.key.text === "provinces");
      if (members?.value.kind !== "block") continue;
      const owners = type === "state" ? stateOwners : regionOwners;
      if (type === "state") stateMembers.set(path, []);
      for (const member of members.value.items)
        if (member.kind === "atom" && /^\d+$/.test(member.text)) {
          const province = Number(member.text);
          if (type === "state") stateMembers.get(path)!.push(province);
          if (definition && !provinces.has(province))
            report(
              "KRG_MAP_REFERENCE",
              `${type} contains undefined province ${province}.`,
              file.source,
            );
          if (owners.has(province))
            report(
              "KRG_MAP_OWNERSHIP",
              `Province ${province} appears in ${owners.get(province)} and ${path}.`,
              file.source,
            );
          owners.set(province, path);
          if (
            type === "state" &&
            provinces.has(province) &&
            provinces.get(province)!.type !== "land"
          )
            report("KRG_MAP_LAND", `State contains non-land province ${province}.`, file.source);
        }
    }
  }
  for (const [path, file] of files) {
    if (path.startsWith("history/states/") && path.endsWith(".txt"))
      inspectGroups(path, file, "state");
    if (path.startsWith("map/strategicregions/") && path.endsWith(".txt"))
      inspectGroups(path, file, "strategic_region");
  }
  if (regionIds.size)
    for (const [path, members] of stateMembers) {
      const regions = new Set(members.map((id) => regionOwners.get(id)).filter(Boolean));
      const missing = members.filter((id) => !regionOwners.has(id));
      if (missing.length)
        report(
          "KRG_MAP_REGION",
          `State provinces ${missing.join(", ")} have no strategic region.`,
          files.get(path)!.source,
        );
      if (regions.size > 1)
        report(
          "KRG_MAP_REGION",
          "All provinces of a state must belong to one strategic region.",
          files.get(path)!.source,
        );
    }
  for (const path of ["map/railways.txt", "map/supply_nodes.txt"]) {
    const file = files.get(path);
    if (!file) continue;
    const lines = Buffer.from(fileBytes(file))
      .toString("utf8")
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/#.*/, "").trim();
      if (!line) continue;
      const fields = line.split(/\s+/).map(Number);
      if (fields.some((n) => !Number.isSafeInteger(n))) {
        report("KRG_MAP_TABLE", "Map network rows must contain integers.", file.source, i + 1);
        continue;
      }
      const railway = path.endsWith("railways.txt");
      if (railway ? fields.length < 4 || fields[1] !== fields.length - 2 : fields.length !== 2)
        report(
          "KRG_MAP_TABLE",
          railway
            ? "Railway province count does not match row length."
            : "Supply node needs level and province.",
          file.source,
          i + 1,
        );
      if (fields[0] < 1)
        report("KRG_MAP_LEVEL", "Network level must be a positive integer.", file.source, i + 1);
      const members = fields.slice(railway ? 2 : 1);
      if (railway && new Set(members).size !== members.length)
        report("KRG_MAP_NETWORK", "A railway path cannot repeat a province.", file.source, i + 1);
      for (const id of members) {
        if (definition && provinces.has(id) && provinces.get(id)!.type !== "land")
          report("KRG_MAP_LAND", `Network uses non-land province ${id}.`, file.source, i + 1);
        if (stateIds.size && !stateOwners.has(id))
          report("KRG_MAP_STATE", `Network uses stateless province ${id}.`, file.source, i + 1);
        if (definition && !provinces.has(id))
          report(
            "KRG_MAP_REFERENCE",
            `Network references undefined province ${id}.`,
            file.source,
            i + 1,
          );
      }
    }
  }
  for (const path of ["map/buildings.txt", "map/unitstacks.txt"]) {
    const file = files.get(path);
    if (!file) continue;
    const building = path.endsWith("buildings.txt");
    const lines = Buffer.from(fileBytes(file))
      .toString("utf8")
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/);
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index].replace(/#.*/, "").trim();
      if (!line) continue;
      const fields = line.split(";");
      if (
        fields.length !== 7 ||
        !/^\d+$/.test(fields[0]) ||
        fields.slice(2).some((value) => !value.trim() || !Number.isFinite(Number(value)))
      ) {
        report(
          "KRG_MAP_POSITIONS",
          "Position rows require seven semicolon-separated fields and finite numeric coordinates.",
          file.source,
          index + 1,
        );
        continue;
      }
      const id = Number(fields[0]);
      if (building && stateIds.size && !stateIds.has(id))
        report(
          "KRG_MAP_STATE",
          `Building model references undefined state ${id}.`,
          file.source,
          index + 1,
        );
      if (!building && definition && !provinces.has(id))
        report(
          "KRG_MAP_REFERENCE",
          `Unit stack references undefined province ${id}.`,
          file.source,
          index + 1,
        );
      if (!building && !/^\d+$/.test(fields[1]))
        report(
          "KRG_MAP_POSITIONS",
          "Unit stack type must be a non-negative integer.",
          file.source,
          index + 1,
        );
      if (building && ["naval_base", "naval_base_spawn", "floating_harbor"].includes(fields[1])) {
        const province = Number(fields[6]);
        // Native floating-harbor rows can reference their land endpoint. Naval
        // base models (including the native spawn name) require the sea endpoint.
        const allowedTypes = fields[1] === "floating_harbor" ? ["land", "sea"] : ["sea"];
        if (
          !Number.isInteger(province) ||
          province <= 0 ||
          (definition && !allowedTypes.includes(provinces.get(province)?.type ?? ""))
        )
          report(
            "KRG_MAP_COAST",
            `${fields[1]} requires a ${allowedTypes.join(" or ")} province reference; found ${fields[6]}.`,
            file.source,
            index + 1,
          );
      }
      if (
        dimensions &&
        (Number(fields[2]) < 0 ||
          Number(fields[2]) > dimensions.width ||
          Number(fields[4]) < 0 ||
          Number(fields[4]) > dimensions.height)
      )
        report(
          "KRG_MAP_POSITIONS",
          "Position X/Z coordinates fall outside the province map dimensions.",
          file.source,
          index + 1,
        );
    }
  }
  const adjacencies = files.get("map/adjacencies.csv");
  if (adjacencies) {
    let ended = false;
    const rules = new Set<string>();
    const rulesFile = files.get("map/adjacency_rules.txt");
    if (rulesFile) {
      const parsed = parsePdx(Buffer.from(fileBytes(rulesFile)).toString("utf8")).document;
      for (const rule of properties(parsed.items))
        if (rule.value.kind === "block") {
          const name = properties(rule.value.items).find((item) => item.key.text === "name");
          if (name?.value.kind === "atom") rules.add(name.value.text);
        }
    }
    const lines = Buffer.from(fileBytes(adjacencies))
      .toString("utf8")
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith("#") || /^From;To;/i.test(line)) continue;
      const fields = line.split(";");
      if (
        fields.length >= 9 &&
        (fields[2] === "" || fields[2] === "-1") &&
        [0, 1, 3, 4, 5, 6, 7, 8].every((index) => fields[index] === "-1")
      ) {
        ended = true;
        continue;
      }
      if (ended) {
        report(
          "KRG_MAP_ADJACENCY",
          "Adjacency entries after the -1 terminator would be ignored.",
          adjacencies.source,
          i + 1,
        );
        continue;
      }
      if (
        fields.length < 9 ||
        ![0, 1, 3, 4, 5, 6, 7].every((index) => /^-?\d+$/.test(fields[index]))
      ) {
        report(
          "KRG_MAP_ADJACENCY",
          "Expected from;to;type;through;start_x;start_y;stop_x;stop_y;rule;comment.",
          adjacencies.source,
          i + 1,
        );
        continue;
      }
      if (!["", "sea", "impassable"].includes(fields[2]))
        report(
          "KRG_MAP_ADJACENCY",
          `Unsupported adjacency type ${fields[2]}.`,
          adjacencies.source,
          i + 1,
        );
      for (const index of [0, 1, 3]) {
        const id = Number(fields[index]);
        if (index === 3 && id === -1) continue;
        if (definition && !provinces.has(id))
          report(
            "KRG_MAP_REFERENCE",
            `Adjacency references undefined province ${id}.`,
            adjacencies.source,
            i + 1,
          );
      }
      if (Number(fields[0]) === Number(fields[1]))
        report(
          "KRG_MAP_ADJACENCY",
          "An adjacency must connect different provinces.",
          adjacencies.source,
          i + 1,
        );
      if (fields[8] && !rules.has(fields[8]))
        report(
          "KRG_MAP_ADJACENCY_RULE",
          `Undefined adjacency rule ${fields[8]}.`,
          adjacencies.source,
          i + 1,
        );
    }
    if (!ended)
      report(
        "KRG_MAP_ADJACENCY",
        "Adjacencies require a final -1;-1;;-1;-1;-1;-1;-1;-1 terminator (an explicit -1 type is also accepted).",
        adjacencies.source,
      );
  }
  return diagnostics;
}

/** References here are explicit filenames, unlike HOI4 database identifiers. */
export function validateFileReferences(
  files: Map<string, WorldFile>,
  ownedPaths: Set<string>,
  completeWorld: boolean,
): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = [];
  function scan(items: PdxItem[], file: WorldFile): void {
    for (const item of items) {
      if (item.kind === "block") scan(item.items, file);
      if (item.kind !== "property") continue;
      if (item.value.kind === "block") scan(item.value.items, file);
      if (
        item.value.kind === "atom" &&
        [
          "texturefile",
          "textureFile",
          "texture",
          "effectFile",
          "animation",
          "file",
          "font",
          "name",
        ].includes(item.key.text)
      ) {
        const value = item.value.text.replaceAll("\\\\", "/");
        if (
          !/^(gfx|music|sound|interface)\/.+\.(dds|tga|png|ogg|wav|mesh|anim|fx|ttf)$/i.test(value)
        )
          continue;
        if (!files.has(value))
          diagnostics.push({
            code: "KRG_ASSET_REFERENCE",
            severity: completeWorld ? "error" : "warning",
            file: file.source,
            message: `Referenced file ${value} is not present${completeWorld ? "" : "; configure gameRoots to check inherited game assets"}.`,
          });
      }
    }
  }
  for (const path of ownedPaths) {
    if (!/\.(gfx|gui|asset|txt)$/.test(path)) continue;
    const file = files.get(path);
    if (!file) continue;
    // Maps have separate table grammars; only definition files can carry media references.
    if (!(
      path.startsWith("interface/") ||
      path.startsWith("gfx/") ||
      path.startsWith("music/") ||
      path.startsWith("sound/")
    ))
      continue;
    const parsed = parsePdx(Buffer.from(fileBytes(file)).toString("utf8"), {
      sourceName: file.source,
    });
    scan(parsed.document.items, file);
  }
  return diagnostics;
}
