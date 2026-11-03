import { parsePdx } from "../pdx/index.js";
import { fileBytes, properties } from "./world.js";
import type { PdxItem } from "../pdx/ast.js";
import type { ProjectDiagnostic } from "./types.js";
import type { WorldFile } from "./world.js";

/** A map province from the effective definition.csv, with its discovered area membership. */
export interface AtlasProvince {
  readonly id: number;
  readonly kind: "land" | "sea" | "lake";
  readonly terrain: string;
  readonly coastal: boolean;
  readonly continent: number;
  readonly color: number;
  readonly stateId?: number;
  readonly strategicRegionId?: number;
}

/** A reference accepted by typed railway APIs. Sea and lake references are rejected by TypeScript. */
export interface LandProvinceRef {
  readonly id: number;
  readonly kind: "land";
}

/** State or strategic-region membership; names remain native localisation keys. */
export interface AtlasArea {
  readonly id: number;
  readonly name: string;
  readonly impassable: boolean;
  readonly provinces: ReadonlyMap<number, AtlasProvince>;
}

/** Lightweight metadata shared by the editor and bitmap-backed atlas. No bitmap is decoded here. */
export interface GeographyIndex {
  readonly provinces: ReadonlyMap<number, AtlasProvince>;
  readonly states: ReadonlyMap<number, AtlasArea>;
  readonly strategicRegions: ReadonlyMap<number, AtlasArea>;
  readonly diagnostics: readonly ProjectDiagnostic[];
}

/** A precise failure in map input or a proposed geographic route. */
export class ProvinceAtlasError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly file?: string,
    public readonly line?: number,
  ) {
    super(message);
    this.name = "ProvinceAtlasError";
  }
}

function text(file: WorldFile): string {
  return Buffer.from(fileBytes(file))
    .toString("utf8")
    .replace(/^\uFEFF/, "");
}

function atom(items: PdxItem[], key: string): string | undefined {
  const item = properties(items).find((item) => item.key.text === key);
  return item?.value.kind === "atom" ? item.value.text : undefined;
}

/**
 * Index the effective map definitions, state files and strategic regions without reading pixels.
 * @example
 * const geography = indexGeography(world.effectiveFiles);
 * const berlin = geography.states.get(64);
 * console.log(berlin?.provinces.size);
 */
export function indexGeography(files: ReadonlyMap<string, WorldFile>): GeographyIndex {
  const provinces = new Map<number, AtlasProvince>();
  const states = new Map<number, AtlasArea>();
  const strategicRegions = new Map<number, AtlasArea>();
  const diagnostics: ProjectDiagnostic[] = [];
  const report = (code: string, message: string, file: WorldFile, line?: number): void => {
    diagnostics.push({ code, severity: "error", message, file: file.source, line });
  };
  const colors = new Map<number, number>();
  const definition = files.get("map/definition.csv");
  if (definition)
    for (const [line, raw] of text(definition).split(/\r?\n/).entries()) {
      const row = raw.replace(/#.*/, "").trim();
      if (!row) continue;
      const fields = row.split(";").map((value) => value.trim());
      if (
        fields.length < 8 ||
        fields.slice(0, 4).some((value) => !/^\d+$/.test(value)) ||
        !/^\d+$/.test(fields[7])
      ) {
        report(
          "KRG_ATLAS_DEFINITION",
          "Expected id;red;green;blue;type;coastal;terrain;continent.",
          definition,
          line + 1,
        );
        continue;
      }
      const [id, r, g, b] = fields.slice(0, 4).map(Number);
      const kind = fields[4];
      if (
        !Number.isSafeInteger(id) ||
        id > 0x7fffffff ||
        [r, g, b].some((value) => value < 0 || value > 255) ||
        !["land", "sea", "lake"].includes(kind) ||
        !["true", "false"].includes(fields[5])
      ) {
        report("KRG_ATLAS_DEFINITION", `Invalid province definition ${id}.`, definition, line + 1);
        continue;
      }
      const color = (r << 16) | (g << 8) | b;
      if (provinces.has(id) || colors.has(color)) {
        report(
          "KRG_ATLAS_DEFINITION",
          `Duplicate province ID or RGB color at province ${id}.`,
          definition,
          line + 1,
        );
        continue;
      }
      provinces.set(id, {
        id,
        color,
        kind: kind as AtlasProvince["kind"],
        terrain: fields[6],
        coastal: fields[5] === "true",
        continent: Number(fields[7]),
      });
      colors.set(color, id);
    }
  for (const [path, file] of [...files].sort(([a], [b]) => a.localeCompare(b, "en"))) {
    const state = /^history\/states\/.+\.txt$/i.test(path);
    if (!state && !/^map\/strategicregions\/.+\.txt$/i.test(path)) continue;
    const parsed = parsePdx(text(file), { sourceName: file.source });
    for (const diagnostic of parsed.diagnostics)
      if (diagnostic.severity === "error")
        report("KRG_ATLAS_AREA", diagnostic.message, file, diagnostic.span.line);
    for (const property of properties(parsed.document.items)) {
      if (
        property.key.text !== (state ? "state" : "strategic_region") ||
        property.value.kind !== "block"
      )
        continue;
      const items = property.value.items;
      const idText = atom(items, "id");
      if (!idText || !/^\d+$/.test(idText) || Number(idText) < 1) continue;
      const id = Number(idText);
      const areas = state ? states : strategicRegions;
      if (areas.has(id))
        report(
          "KRG_ATLAS_AREA",
          `Duplicate ${state ? "state" : "strategic region"} ID ${id}.`,
          file,
        );
      const members = properties(items).find((item) => item.key.text === "provinces");
      if (!members || members.value.kind !== "block") {
        // Source identity projections must never silently inherit an older province list.
        if (definition)
          diagnostics.push({
            code: "KRG_ATLAS_INCOMPLETE",
            severity: "warning",
            message: `${state ? "State" : "Strategic region"} ${id} has no statically available province list. Use a literal province list or complete native metadata; geography cannot infer its own source declaration.`,
            file: file.source,
          });
        areas.set(id, {
          id,
          name: atom(items, "name") ?? "",
          impassable: atom(items, "impassable") === "yes",
          provinces: new Map(),
        });
        continue;
      }
      const memberIds = members.value.items
        .filter((item) => item.kind === "atom")
        .map((item) => (item.kind === "atom" ? Number(item.text) : NaN));
      const areaProvinces = new Map<number, AtlasProvince>();
      for (const provinceId of memberIds) {
        const province = provinces.get(provinceId);
        if (!province || provinceId === 0) {
          if (definition)
            report(
              "KRG_ATLAS_AREA",
              `Area ${id} references undefined province ${provinceId}.`,
              file,
            );
          continue;
        }
        const key = state ? "stateId" : "strategicRegionId";
        if (province[key] !== undefined && province[key] !== id)
          report(
            "KRG_ATLAS_AREA",
            `Province ${provinceId} belongs to multiple ${state ? "states" : "strategic regions"}.`,
            file,
          );
        // Objects stay shared with each area's map while the index is assembled.
        (province as { stateId?: number; strategicRegionId?: number })[key] = id;
        areaProvinces.set(provinceId, province);
      }
      areas.set(id, {
        id,
        name: atom(items, "name") ?? "",
        impassable: atom(items, "impassable") === "yes",
        provinces: areaProvinces,
      });
    }
  }
  return { provinces, states, strategicRegions, diagnostics };
}

function oneGeographyDeclaration(
  index: GeographyIndex,
  name: "geography" | "baseGeography",
): string {
  const typeName = name === "geography" ? "ProvinceTypes" : "BaseProvinceTypes";
  const provinceTypes = [...index.provinces.values()]
    .filter((province) => province.id !== 0)
    .sort((a, b) => a.id - b.id)
    .map(
      (province) =>
        `/** ${province.kind}; ${province.terrain.replace(/\*\//g, "* /")}; state ${province.stateId ?? "none"}; region ${province.strategicRegionId ?? "none"}. */\nreadonly ${province.id}: { readonly id: ${province.id}; readonly kind: ${JSON.stringify(province.kind)}; readonly terrain: ${JSON.stringify(province.terrain)}; };`,
    )
    .join("\n");
  const areas = (values: ReadonlyMap<number, AtlasArea>): string =>
    [...values.values()]
      .sort((a, b) => a.id - b.id)
      .map((area) => {
        const members = [...area.provinces.values()]
          .sort((a, b) => a.id - b.id)
          .map(
            (province) =>
              `/** ${province.kind}; ${province.terrain.replace(/\*\//g, "* /")}; state ${province.stateId ?? "none"}; region ${province.strategicRegionId ?? "none"}. */\nreadonly ${province.id}: ${typeName}[${province.id}];`,
          )
          .join("\n");
        return `/** ${area.name.replace(/\*\//g, "* /")} */\nreadonly ${area.id}: { readonly id: ${area.id}; readonly name: ${JSON.stringify(area.name)}; readonly provinces: {\n${members}\n}; };`;
      })
      .join("\n");
  return `interface ${typeName} {\n${provinceTypes}\n}\n/** ${name === "baseGeography" ? "Game-root snapshot before project overlays." : "Current discoverable project geography."} Province references are grouped by state and strategic region. Use .id in native numeric fields. */\nexport declare const ${name}: { readonly states: {\n${areas(index.states)}\n}; readonly strategicRegions: {\n${areas(index.strategicRegions)}\n}; };\n`;
}

/** Generate precise per-area values for stock TypeScript completion, hover and checking. */
export function geographyDeclaration(index: GeographyIndex, base: GeographyIndex = index): string {
  return (
    oneGeographyDeclaration(index, "geography") +
    (base === index
      ? "/** Game-root snapshot before project overlays. */\nexport declare const baseGeography: typeof geography;\n"
      : oneGeographyDeclaration(base, "baseGeography"))
  );
}

/** Geographic constraints for a route. IDs are checked against the loaded map. */
export interface RailwayRouteRequest {
  /** At least two ordered waypoints; each segment minimizes the number of province borders. */
  readonly via: readonly (number | LandProvinceRef)[];
  readonly avoidProvinces?: readonly (number | LandProvinceRef)[];
  readonly avoidStates?: readonly number[];
  readonly avoidStrategicRegions?: readonly number[];
}

/** A deterministic geographic path; no claims about ownership, diplomacy or runtime supply. */
export interface PlannedRailwayRoute {
  readonly provinces: readonly number[];
  readonly steps: number;
}

export interface ProvinceAtlasOptions {
  /** HOI4 world maps wrap horizontally; disable only for deliberately non-wrapping test maps. */
  readonly wrapX?: boolean;
}

/**
 * Decode province borders once and reuse the index for many land routes.
 * Only orthogonal pixel contacts count; impassable and conditional special borders are excluded.
 * @example
 * const atlas = new ProvinceAtlas(world.effectiveFiles);
 * const route = atlas.planRailway({ via: [atlas.land(6521), atlas.land(6282)], avoidStates: [65] });
 * console.log(route.provinces);
 */
export class ProvinceAtlas {
  readonly geography: GeographyIndex;
  readonly width: number;
  readonly height: number;
  readonly wrapX: boolean;
  readonly borderCount: number;
  private readonly bitmap: Buffer;
  private readonly stride: number;
  private readonly offset: number;
  private readonly topDown: boolean;
  private readonly colorIds = new Map<number, number>();
  private readonly borders = new Map<number, readonly number[]>();
  private readonly excludedEdges = new Set<string>();
  private readonly present = new Set<number>();

  constructor(files: ReadonlyMap<string, WorldFile>, options: ProvinceAtlasOptions = {}) {
    this.geography = indexGeography(files);
    const invalid = this.geography.diagnostics.find(
      (diagnostic) => diagnostic.severity === "error" || diagnostic.code === "KRG_ATLAS_INCOMPLETE",
    );
    if (invalid)
      throw new ProvinceAtlasError(invalid.code, invalid.message, invalid.file, invalid.line);
    if (!files.has("map/definition.csv"))
      throw new ProvinceAtlasError(
        "KRG_ATLAS_MISSING",
        "Province atlas requires map/definition.csv.",
      );
    const bitmap = files.get("map/provinces.bmp");
    if (!bitmap)
      throw new ProvinceAtlasError(
        "KRG_ATLAS_MISSING",
        "Province atlas requires map/provinces.bmp.",
      );
    const bytes = fileBytes(bitmap);
    this.bitmap = Buffer.isBuffer(bytes)
      ? bytes
      : Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const failBitmap = (message: string): never => {
      throw new ProvinceAtlasError("KRG_ATLAS_BITMAP", message, bitmap.source);
    };
    if (this.bitmap.length < 54 || this.bitmap.toString("ascii", 0, 2) !== "BM")
      failBitmap("Province bitmap is not a complete BMP.");
    this.width = this.bitmap.readInt32LE(18);
    const signedHeight = this.bitmap.readInt32LE(22);
    this.height = Math.abs(signedHeight);
    this.topDown = signedHeight < 0;
    this.offset = this.bitmap.readUInt32LE(10);
    this.stride = Math.ceil((this.width * 3) / 4) * 4;
    this.wrapX = options.wrapX !== false;
    if (
      this.bitmap.readUInt32LE(14) !== 40 ||
      this.bitmap.readUInt16LE(26) !== 1 ||
      this.bitmap.readUInt16LE(28) !== 24 ||
      this.bitmap.readUInt32LE(30) !== 0
    )
      failBitmap(
        "Province atlas requires an uncompressed 24-bit BMP with BITMAPINFOHEADER and one color plane.",
      );
    if (
      this.width <= 0 ||
      this.height <= 0 ||
      this.offset < 54 ||
      this.offset + this.stride * this.height > this.bitmap.length
    )
      failBitmap("Province bitmap has invalid dimensions, pixel offset or truncated pixel rows.");
    for (const province of this.geography.provinces.values())
      this.colorIds.set(province.color, province.id);
    const adjacency = new Map<number, Set<number>>();
    const connect = (a: number, b: number): void => {
      if (a === b || a === 0 || b === 0) return;
      if (!adjacency.has(a)) adjacency.set(a, new Set());
      if (!adjacency.has(b)) adjacency.set(b, new Set());
      adjacency.get(a)!.add(b);
      adjacency.get(b)!.add(a);
    };
    let previous = new Int32Array(this.width);
    let current = new Int32Array(this.width);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const color = this.pixelColor(x, y);
        const id = this.colorIds.get(color);
        if (id === undefined)
          failBitmap(
            `Bitmap color #${color.toString(16).padStart(6, "0")} at (${x}, ${y}) has no province definition.`,
          );
        current[x] = id!;
        this.present.add(id!);
        if (x) connect(current[x - 1], id!);
        if (y) connect(previous[x], id!);
      }
      if (this.wrapX) connect(current[0], current[this.width - 1]);
      [previous, current] = [current, previous];
    }
    for (const [id, neighbors] of adjacency)
      this.borders.set(
        id,
        [...neighbors].sort((a, b) => a - b),
      );
    this.borderCount =
      [...this.borders.values()].reduce((total, neighbors) => total + neighbors.length, 0) / 2;
    const special = files.get("map/adjacencies.csv");
    if (special)
      for (const [line, raw] of text(special).split(/\r?\n/).entries()) {
        const row = raw.replace(/#.*/, "").trim();
        if (!row || /^from;/i.test(row)) continue;
        const fields = row.split(";").map((value) => value.trim());
        if (fields[0] === "-1" && fields[1] === "-1") break;
        const [a, b] = fields.slice(0, 2).map(Number);
        if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || a <= 0 || b <= 0)
          throw new ProvinceAtlasError(
            "KRG_ATLAS_ADJACENCY",
            "Cannot safely interpret a special adjacency endpoint.",
            special.source,
            line + 1,
          );
        // Even if endpoints also touch in the bitmap, a special rule may restrict passage.
        this.excludedEdges.add(this.edge(a, b));
      }
  }

  private edge(a: number, b: number): string {
    return a < b ? `${a}:${b}` : `${b}:${a}`;
  }
  private pixelColor(x: number, y: number): number {
    const i = this.offset + (this.topDown ? y : this.height - 1 - y) * this.stride + x * 3;
    return (this.bitmap[i + 2] << 16) | (this.bitmap[i + 1] << 8) | this.bitmap[i];
  }

  /** Look up a pixel using top-left raster coordinates; BMP row orientation is handled internally. */
  provinceAt(x: number, y: number): AtlasProvince | undefined {
    if (
      !Number.isInteger(x) ||
      !Number.isInteger(y) ||
      x < 0 ||
      y < 0 ||
      x >= this.width ||
      y >= this.height
    )
      return undefined;
    return this.geography.provinces.get(this.colorIds.get(this.pixelColor(x, y))!);
  }

  /** Get a checked land reference; nonexistent, unpainted and stateless provinces are rejected. */
  land(id: number): AtlasProvince & LandProvinceRef {
    const province = this.geography.provinces.get(id);
    if (
      !province ||
      id === 0 ||
      province.kind !== "land" ||
      !this.present.has(id) ||
      province.stateId === undefined
    )
      throw new ProvinceAtlasError(
        "KRG_ATLAS_LAND",
        `Province ${id} must exist in the bitmap, be land and belong to a state.`,
      );
    return province as AtlasProvince & LandProvinceRef;
  }

  /** All physical four-neighbor contacts, including water; this is not an engine movement graph. */
  neighbors(id: number): readonly number[] {
    return this.borders.get(id) ?? [];
  }

  /** Whether this border is a safe candidate for a new geographic land railway. */
  canBuildRailwayBetween(a: number, b: number): boolean {
    const first = this.geography.provinces.get(a);
    const second = this.geography.provinces.get(b);
    return !!(
      first?.kind === "land" &&
      second?.kind === "land" &&
      first.stateId !== undefined &&
      second.stateId !== undefined &&
      !this.geography.states.get(first.stateId)?.impassable &&
      !this.geography.states.get(second.stateId)?.impassable &&
      !this.excludedEdges.has(this.edge(a, b)) &&
      this.neighbors(a).includes(b)
    );
  }

  /**
   * Find minimum-border paths between ordered waypoints. Equal choices use ascending province IDs.
   * Revisited provinces are rejected instead of emitting an invalid native railway loop.
   * @example
   * atlas.planRailway({ via: [6521, 6282], avoidProvinces: [3340] });
   */
  planRailway(request: RailwayRouteRequest): PlannedRailwayRoute {
    if (request.via.length < 2)
      throw new ProvinceAtlasError(
        "KRG_ATLAS_ROUTE",
        "A railway route requires at least two ordered waypoints.",
      );
    const id = (value: number | LandProvinceRef): number =>
      typeof value === "number" ? value : value.id;
    const via = request.via.map(id);
    const excluded = new Set((request.avoidProvinces ?? []).map(id));
    for (const province of excluded) this.land(province);
    for (const [ids, areas, label] of [
      [request.avoidStates ?? [], this.geography.states, "state"],
      [request.avoidStrategicRegions ?? [], this.geography.strategicRegions, "strategic region"],
    ] as const)
      for (const areaId of ids) {
        const area = areas.get(areaId);
        if (!area)
          throw new ProvinceAtlasError("KRG_ATLAS_ROUTE", `Unknown avoided ${label} ${areaId}.`);
        for (const province of area.provinces.keys()) excluded.add(province);
      }
    for (const waypoint of via) {
      const province = this.land(waypoint);
      if (excluded.has(waypoint) || this.geography.states.get(province.stateId!)?.impassable)
        throw new ProvinceAtlasError(
          "KRG_ATLAS_ROUTE",
          `Waypoint ${waypoint} is excluded or belongs to an impassable state.`,
        );
    }
    if (new Set(via).size !== via.length)
      throw new ProvinceAtlasError("KRG_ATLAS_ROUTE", "Railway waypoints cannot repeat.");
    const result = [via[0]];
    for (let segment = 1; segment < via.length; segment++) {
      const start = via[segment - 1],
        end = via[segment];
      const previous = new Map<number, number>([[start, start]]);
      const queue = [start];
      for (let head = 0; head < queue.length && !previous.has(end); head++)
        for (const next of this.neighbors(queue[head])) {
          if (
            excluded.has(next) ||
            previous.has(next) ||
            !this.canBuildRailwayBetween(queue[head], next)
          )
            continue;
          previous.set(next, queue[head]);
          queue.push(next);
          if (next === end) break;
        }
      if (!previous.has(end))
        throw new ProvinceAtlasError(
          "KRG_ATLAS_NO_ROUTE",
          `No safe land route from province ${start} to ${end} under the requested exclusions.`,
        );
      const path = [end];
      while (path[path.length - 1] !== start) path.push(previous.get(path[path.length - 1])!);
      result.push(...path.reverse().slice(1));
    }
    if (new Set(result).size !== result.length)
      throw new ProvinceAtlasError(
        "KRG_ATLAS_ROUTE_LOOP",
        "Shortest waypoint segments revisit a province. Choose different waypoints or split this into separate railway routes.",
      );
    return { provinces: result, steps: result.length - 1 };
  }
}
