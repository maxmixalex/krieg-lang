import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { AuthorLocation, NativeLineOrigin } from "../compiler/types.js";
import { loadConfig } from "./config.js";
import { gamePath, safeChild } from "./files.js";

/** A native line resolved against the last successful build. Source paths are relative to the project. */
export interface TracedLocation {
  path: string;
  generatedLine: number;
  source: string;
  line?: number;
  column?: number;
  /** File-level fallbacks omit line and column. Style hits identify the winning CSS declaration. */
  precision: "expression" | "declaration" | "style" | "file";
  via?: AuthorLocation[];
}
interface DebugMarker {
  name: string;
  files: { path: string; sha256: string }[];
  sources: { path: string; source: string; origins?: NativeLineOrigin[] }[];
}
/** Locate a generated line in authoring source. Refuses edited native bytes rather than reporting a stale location.
 * @example
 * ```ts
 * const location = traceOutput('./my-mod', 'events/krg_example.txt', 12);
 * console.log(location.source, location.line, location.precision);
 * ```
 */
export function traceOutput(project: string, path: string, generatedLine: number): TracedLocation {
  return tracer(project)(path, generatedLine);
}
function tracer(project: string) {
  const config = loadConfig(project);
  const out = safeChild(config.rootDir, config.outDir);
  let marker: DebugMarker;
  try {
    marker = JSON.parse(readFileSync(resolve(out, ".krieg-build.json"), "utf8"));
  } catch {
    throw new Error("No readable build marker; build this project before tracing native output.");
  }
  if (marker.name !== config.name || !Array.isArray(marker.files) || !Array.isArray(marker.sources))
    throw new Error("Build marker does not belong to this project.");
  const infos = new Map(marker.files.map((f) => [f.path, f]));
  const entries = new Map(marker.sources.map((f) => [f.path, f]));
  const counts = new Map<string, number>();
  return (path: string, generatedLine: number): TracedLocation => {
    if (!Number.isSafeInteger(generatedLine) || generatedLine < 1)
      throw new Error("Generated line must be a positive integer.");
    const key = gamePath(path);
    const info = infos.get(key),
      entry = entries.get(key);
    if (!info || !entry) throw new Error(`No such output in the last successful build: ${key}`);
    let count = counts.get(key);
    if (count === undefined) {
      const data = readFileSync(safeChild(out, key));
      if (createHash("sha256").update(data).digest("hex") !== info.sha256)
        throw new Error(
          `Generated output changed since the recorded build: ${key}. Rebuild before tracing.`,
        );
      if (!/\.(?:txt|gfx|gui|asset|lua|yml|csv|mod|map|json)$/i.test(key) || data.includes(0))
        throw new Error(`Output is not a traceable text file: ${key}`);
      const lines = data.toString("utf8").split(/\r\n|\r|\n/);
      if (lines.at(-1) === "") lines.pop();
      count = lines.length;
      counts.set(key, count);
    }
    if (generatedLine > count)
      throw new Error(`Line ${generatedLine} is outside ${key} (${count} lines).`);
    let best: NativeLineOrigin | undefined;
    for (const segment of entry.origins ?? [])
      if (
        segment.from <= generatedLine &&
        generatedLine <= segment.to &&
        (!best || segment.to - segment.from <= best.to - best.from)
      )
        best = segment;
    return best
      ? {
          path: key,
          generatedLine,
          source: best.source,
          line: best.line,
          column: best.column,
          precision: best.precision,
          ...(best.via?.length ? { via: best.via } : {}),
        }
      : { path: key, generatedLine, source: entry.source, precision: "file" };
  };
}

/** One recognized native filename and line number from a HOI4 text log. */
export type TracedLogEntry = { logLine: number; path: string; generatedLine: number } & (
  { location: TracedLocation; reason?: never } | { location?: never; reason: string }
);
/** Translate common `path:line`, `file: "path" near line: N` and `path line: N` diagnostics. Locations outside this mod are reported separately; unrelated log messages are skipped. */
export function traceGameLog(project: string, log: string): TracedLogEntry[] {
  const resolveLocation = tracer(project),
    rows: TracedLogEntry[] = [];
  const pattern =
    /\b((?:common|events|history|interface|map|gfx|localisation|music|sound|portraits|country_metadata)[/\\][^"'<>:|?*\r\n]+?\.(?:txt|gfx|gui|asset|lua|yml|csv|map|json))["']?\s*(?::\s*|,?\s*(?:near\s+|at\s+)?line\s*[:=]?\s*)([1-9]\d*)\b/gi;
  for (const [index, line] of log.split(/\r\n|\r|\n/).entries())
    for (const match of line.matchAll(pattern)) {
      const path = match[1].replaceAll("\\", "/"),
        generatedLine = Number(match[2]),
        base = { logLine: index + 1, path, generatedLine };
      try {
        rows.push({ ...base, location: resolveLocation(path, generatedLine) });
      } catch (error) {
        rows.push({ ...base, reason: (error as Error).message });
      }
    }
  return rows;
}
