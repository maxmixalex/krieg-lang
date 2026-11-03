import { ProvinceAtlas, ProvinceAtlasError } from "./atlas.js";
import { fileBytes } from "./world.js";
import type { PlannedRailwayRoute, RailwayRouteRequest } from "./atlas.js";
import type { OutputFile, ProjectDiagnostic } from "./types.js";
import type { WorldFile } from "./world.js";

/** Native default railway levels. Mods changing the engine's maximum need a separately authored file. */
export type RailwayLevel = 1 | 2 | 3 | 4 | 5;

/** A named author request, resolved against the final effective map during build. */
export interface RailwayRouteSpec extends RailwayRouteRequest {
  readonly name: string;
  readonly level: RailwayLevel;
}

/**
 * Add routes to a complete inherited railway file without deleting its existing network.
 * @example
 * const plan: RailwayPlan = {
 *   routes: [{ name: "berlin-link", level: 2, via: [6521, 6282], avoidStates: [65] }],
 * };
 */
export interface RailwayPlan {
  readonly routes: readonly RailwayRouteSpec[];
  /** Permit a missing map/railways.txt only when deliberately creating a new network. */
  readonly allowEmptyBase?: boolean;
}

/** Result of a complete, additive railway overlay. Any error suppresses the output file. */
export interface RailwayOverlayResult {
  readonly file?: OutputFile;
  readonly diagnostics: readonly ProjectDiagnostic[];
  readonly routes: readonly (PlannedRailwayRoute & {
    readonly name: string;
    readonly level: RailwayLevel;
  })[];
  readonly preservedRows: number;
  readonly addedRows: number;
}

function edge(a: number, b: number): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

/** Validate JSON configuration without coercing malformed IDs, levels or unknown fields. */
export function parseRailwayPlan(value: unknown, label = "railways"): RailwayPlan {
  const object = (input: unknown, name: string): Record<string, unknown> => {
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new Error(`${name} must be an object.`);
    return input as Record<string, unknown>;
  };
  const keys = (input: Record<string, unknown>, allowed: string[], name: string): void => {
    for (const key of Object.keys(input))
      if (!allowed.includes(key))
        throw new Error(`Unknown ${name} property ${JSON.stringify(key)}.`);
  };
  const ids = (input: unknown, name: string, minimum = 0): number[] => {
    if (
      !Array.isArray(input) ||
      input.length < minimum ||
      input.some((id) => typeof id !== "number" || !Number.isSafeInteger(id) || id < 1)
    )
      throw new Error(
        `${name} must contain ${minimum ? `at least ${minimum} ` : ""}positive integer province/area IDs.`,
      );
    return input as number[];
  };
  const plan = object(value, label);
  keys(plan, ["routes", "allowEmptyBase"], label);
  if (!Array.isArray(plan.routes)) throw new Error(`${label}.routes must be an array.`);
  if (plan.allowEmptyBase !== undefined && typeof plan.allowEmptyBase !== "boolean")
    throw new Error(`${label}.allowEmptyBase must be boolean.`);
  return {
    ...(plan.allowEmptyBase === undefined
      ? {}
      : { allowEmptyBase: plan.allowEmptyBase as boolean }),
    routes: plan.routes.map((input, index) => {
      const name = `${label}.routes[${index}]`;
      const route = object(input, name);
      keys(
        route,
        ["name", "level", "via", "avoidProvinces", "avoidStates", "avoidStrategicRegions"],
        name,
      );
      if (typeof route.name !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(route.name))
        throw new Error(`${name}.name must be a portable nonempty identifier.`);
      if (typeof route.level !== "number" || ![1, 2, 3, 4, 5].includes(route.level))
        throw new Error(`${name}.level must be an integer from 1 to 5.`);
      return {
        name: route.name,
        level: route.level as RailwayLevel,
        via: ids(route.via, `${name}.via`, 2),
        ...(route.avoidProvinces === undefined
          ? {}
          : { avoidProvinces: ids(route.avoidProvinces, `${name}.avoidProvinces`) }),
        ...(route.avoidStates === undefined
          ? {}
          : { avoidStates: ids(route.avoidStates, `${name}.avoidStates`) }),
        ...(route.avoidStrategicRegions === undefined
          ? {}
          : {
              avoidStrategicRegions: ids(
                route.avoidStrategicRegions,
                `${name}.avoidStrategicRegions`,
              ),
            }),
      };
    }),
  };
}

/**
 * Plan safe new land paths, retain the complete base file byte-for-byte, and append only absent edges.
 * Existing special connections are preserved, not reinterpreted as ordinary land borders.
 * Equal-level overlaps are shared; conflicting levels are errors, never implicit upgrades.
 * @example
 * const overlay = createRailwayOverlay(world.effectiveFiles, {
 *   routes: [{ name: "new-corridor", level: 2, via: [6521, 6282] }],
 * });
 * if (overlay.file) console.log(overlay.file.path); // map/railways.txt
 */
export function createRailwayOverlay(
  files: ReadonlyMap<string, WorldFile>,
  plan: RailwayPlan,
  source = "<railway plan>",
  suppliedAtlas?: ProvinceAtlas,
): RailwayOverlayResult {
  const diagnostics: ProjectDiagnostic[] = [];
  const routes: Array<PlannedRailwayRoute & { name: string; level: RailwayLevel }> = [];
  const additions: string[] = [];
  let preservedRows = 0;
  const report = (code: string, message: string, file = source, line?: number): void => {
    diagnostics.push({ code, severity: "error", message, file, line });
  };
  const result = (): RailwayOverlayResult => ({
    diagnostics,
    routes,
    preservedRows,
    addedRows: additions.length,
  });
  if (!plan.routes.length) return result();
  const original = files.get("map/railways.txt");
  if (!original && !plan.allowEmptyBase) {
    report(
      "KRG_RAILWAY_BASE",
      "No effective map/railways.txt exists. Supply the complete base map, or set railways.allowEmptyBase:true when intentionally starting an empty network.",
    );
    return result();
  }
  const base = original ? Buffer.from(fileBytes(original)) : Buffer.alloc(0);
  const occupied = new Map<string, { levels: Set<number>; source: string }>();
  const baseProvinces = new Map<number, number>();
  const rows = base
    .toString("utf8")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/);
  for (const [index, raw] of rows.entries()) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const fields = line.split(/\s+/).map(Number);
    if (
      fields.some((value) => !Number.isSafeInteger(value)) ||
      fields.length < 4 ||
      fields[0] < 1 ||
      fields[1] !== fields.length - 2 ||
      fields.slice(2).some((id) => id < 1) ||
      new Set(fields.slice(2)).size !== fields.length - 2
    ) {
      report(
        "KRG_RAILWAY_BASE",
        "Cannot safely extend a malformed native railway row; repair the baseline first.",
        original!.source,
        index + 1,
      );
      continue;
    }
    preservedRows++;
    for (const id of fields.slice(2)) if (!baseProvinces.has(id)) baseProvinces.set(id, index + 1);
    for (let i = 3; i < fields.length; i++) {
      const key = edge(fields[i - 1], fields[i]);
      const existing = occupied.get(key);
      // Real native networks contain overlapping rows at different levels.
      // Preserve their order and bytes; only reject a new request touching an ambiguous edge.
      if (existing) existing.levels.add(fields[0]);
      else
        occupied.set(key, {
          levels: new Set([fields[0]]),
          source: `${original!.source}:${index + 1}`,
        });
    }
  }
  if (diagnostics.length) return result();
  try {
    const atlas = suppliedAtlas ?? new ProvinceAtlas(files);
    for (const [id, line] of baseProvinces) {
      try {
        atlas.land(id);
      } catch {
        report(
          "KRG_RAILWAY_BASE_LAND",
          `Inherited railway province ${id} must be painted land with a state. Supply matching map and state-history snapshots; the original network has not been altered.`,
          original!.source,
          line,
        );
      }
    }
    if (diagnostics.length) return result();
    const names = new Set<string>();
    for (const spec of plan.routes) {
      if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(spec.name) || names.has(spec.name)) {
        report(
          "KRG_RAILWAY_NAME",
          `Route name ${JSON.stringify(spec.name)} is invalid or duplicated.`,
        );
        continue;
      }
      names.add(spec.name);
      if (![1, 2, 3, 4, 5].includes(spec.level)) {
        report("KRG_RAILWAY_LEVEL", `Route ${spec.name} requires a level from 1 to 5.`);
        continue;
      }
      const route = atlas.planRailway(spec);
      routes.push({ ...route, name: spec.name, level: spec.level });
      let pending: number[] = [];
      const flush = (): void => {
        if (pending.length > 1)
          additions.push(`${spec.level} ${pending.length} ${pending.join(" ")}`);
        pending = [];
      };
      for (let index = 1; index < route.provinces.length; index++) {
        const from = route.provinces[index - 1],
          to = route.provinces[index];
        const key = edge(from, to),
          previous = occupied.get(key);
        if (previous) {
          flush();
          if (previous.levels.size !== 1 || !previous.levels.has(spec.level))
            report(
              "KRG_RAILWAY_CONFLICT",
              `Route ${spec.name} requests level ${spec.level} on edge ${key}, already assigned level(s) ${[...previous.levels].sort((a, b) => a - b).join(", ")} from ${previous.source}. Choose a different route or edit the complete base network explicitly.`,
            );
        } else {
          if (!pending.length) pending.push(from);
          pending.push(to);
          occupied.set(key, { levels: new Set([spec.level]), source: spec.name });
        }
      }
      flush();
    }
  } catch (error) {
    if (error instanceof ProvinceAtlasError)
      report(error.code, error.message, error.file ?? source, error.line);
    else report("KRG_RAILWAY_PLAN", error instanceof Error ? error.message : String(error));
  }
  if (diagnostics.length) return result();
  const separator = base.length && base[base.length - 1] !== 10 ? "\n" : "";
  const suffix = additions.length
    ? `${separator}# Krieg geographic railway additions\n${additions.join("\n")}\n`
    : "";
  return {
    ...result(),
    file: {
      path: "map/railways.txt",
      bytes: Buffer.concat([base, Buffer.from(suffix)]),
      source,
      kind: "script",
    },
  };
}
