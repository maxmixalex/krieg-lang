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
}

export function validateMap(files: Map<string, WorldFile>): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = [];
  const report = (code: string, message: string, file?: string, line?: number): void => {
    diagnostics.push({ code, message, file, line, severity: "error" });
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
      provinces.set(id, { id, color, type: fields[4] });
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
  const defaultMap = files.get("map/default.map");
  if (defaultMap && dimensions) {
    const doc = parsePdx(Buffer.from(fileBytes(defaultMap)).toString("utf8")).document;
    for (const prop of properties(doc.items))
      if (["width", "height"].includes(prop.key.text) && prop.value.kind === "atom") {
        const expected = dimensions[prop.key.text as "width" | "height"];
        if (Number(prop.value.text) !== expected)
          report(
            "KRG_MAP_DIMENSIONS",
            `${prop.key.text}=${prop.value.text} does not match provinces.bmp (${expected}).`,
            defaultMap.source,
          );
      }
  }
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
      for (const member of members.value.items)
        if (member.kind === "atom" && /^\d+$/.test(member.text)) {
          const province = Number(member.text);
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
      for (const id of fields.slice(railway ? 2 : 1))
        if (definition && !provinces.has(id))
          report(
            "KRG_MAP_REFERENCE",
            `Network references undefined province ${id}.`,
            file.source,
            i + 1,
          );
    }
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
