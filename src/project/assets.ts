import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, extname, relative } from "node:path";
import { gamePath, safeChild, slash, walkFiles } from "./files.js";
import type { KriegConfig, OutputFile, ProjectDiagnostic } from "./types.js";

export interface CollectedAsset extends OutputFile {
  override: boolean;
}

export function collectAssets(config: KriegConfig): CollectedAsset[] {
  const files: CollectedAsset[] = [];
  for (const rule of config.assets) {
    const source = safeChild(config.rootDir, rule.from);
    if (!existsSync(source)) throw new Error(`Asset input does not exist: ${rule.from}`);
    const directory = statSync(source).isDirectory();
    for (const path of walkFiles(source)) {
      const suffix = directory ? slash(relative(source, path)) : "";
      const destination = gamePath([rule.to, suffix].filter(Boolean).join("/") || basename(path));
      if (destination === "descriptor.mod" || destination === ".krieg-build.json")
        throw new Error(`Asset ${rule.from} targets compiler-owned metadata ${destination}.`);
      files.push({
        path: destination,
        bytes: readFileSync(path),
        source: path,
        kind: "asset",
        override: rule.override === true,
      });
    }
  }
  return files;
}

export interface ImageInfo {
  format: string;
  width: number;
  height: number;
  bits?: number;
}

/** Inspect headers without recompressing or changing the user's bytes. */
export function imageInfo(bytes: Uint8Array, extension: string): ImageInfo | undefined {
  const b = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (extension === ".png") {
    if (
      b.length < 33 ||
      b.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" ||
      b.toString("ascii", 12, 16) !== "IHDR"
    )
      throw new Error("Invalid PNG header.");
    return { format: "png", width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  if (extension === ".dds") {
    if (b.length < 128 || b.toString("ascii", 0, 4) !== "DDS " || b.readUInt32LE(4) !== 124)
      throw new Error("Invalid DDS header.");
    return { format: "dds", width: b.readUInt32LE(16), height: b.readUInt32LE(12) };
  }
  if (extension === ".bmp") {
    if (b.length < 54 || b.toString("ascii", 0, 2) !== "BM" || b.readUInt32LE(14) < 40)
      throw new Error("Invalid Windows BMP header.");
    const width = b.readInt32LE(18),
      height = Math.abs(b.readInt32LE(22)),
      bits = b.readUInt16LE(28);
    const offset = b.readUInt32LE(10),
      compression = b.readUInt32LE(30);
    if (width <= 0 || height <= 0 || offset > b.length)
      throw new Error("Invalid BMP dimensions or pixel offset.");
    if (compression === 0 && offset + Math.ceil((width * bits) / 32) * 4 * height > b.length)
      throw new Error("Truncated BMP pixel data.");
    return { format: "bmp", width, height, bits };
  }
  if (extension === ".tga") {
    if (b.length < 18 || ![1, 2, 3, 9, 10, 11].includes(b[2]))
      throw new Error("Invalid TGA header.");
    return { format: "tga", width: b.readUInt16LE(12), height: b.readUInt16LE(14), bits: b[16] };
  }
  return undefined;
}

export function validateAsset(file: OutputFile): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = [];
  const extension = extname(file.path).toLowerCase();
  const b = Buffer.from(file.bytes);
  try {
    const info = imageInfo(file.bytes, extension);
    if (info && (!info.width || !info.height))
      throw new Error("Image dimensions must be positive.");
    if (extension === ".ogg" && (b.length < 27 || b.toString("ascii", 0, 4) !== "OggS"))
      throw new Error("Invalid Ogg stream header.");
    if (
      extension === ".wav" &&
      (b.length < 12 ||
        b.toString("ascii", 0, 4) !== "RIFF" ||
        b.toString("ascii", 8, 12) !== "WAVE")
    )
      throw new Error("Invalid WAV header.");
    if (extension === ".yml") {
      const text = b.toString("utf8");
      if (text.replace(/^\uFEFF/, "").trim() === "") return diagnostics;
      if (text.charCodeAt(0) !== 0xfeff)
        throw new Error("HOI4 localisation must have a UTF-8 BOM.");
      const language = /^\uFEFF\s*l_([a-z_]+)\s*:/m.exec(text)?.[1];
      if (!language || !basename(file.path).includes(`l_${language}`))
        throw new Error("Localisation header and l_language filename must agree.");
    }
  } catch (error) {
    diagnostics.push({
      code: "KRG_ASSET",
      severity: "error",
      file: file.source,
      message: (error as Error).message,
    });
  }
  return diagnostics;
}
