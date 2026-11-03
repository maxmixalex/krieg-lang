import type { ProvinceAtlas } from "./atlas.js";
import type { RailwayPlan } from "./atlas-railways.js";

export interface ModMetadata {
  name: string;
  version: string;
  supportedVersion: string;
  tags: string[];
  replacePath: string[];
  dependencies: string[];
  picture?: string;
  userDir?: string;
}

export interface AssetRule {
  from: string;
  to: string;
  /** Explicit permission for this layer to replace a dependency's same-path file. */
  override?: boolean;
}

export interface LocalisationRule {
  /** .json = JSON mapping; .yaml = YAML mapping; .yml = native HOI4. */
  format?: "json" | "yaml" | "hoi4";
  language: string;
  from: string;
}

export interface GameRoot {
  path: string;
  replacePath: string[];
}

export interface ProjectOptions {
  /** Override configured game roots, in vanilla-to-mod load order. Paths are resolved from the current directory. */
  gameRoots?: readonly (string | GameRoot)[];
  /** Additional routes planned against the final compiled world. A callback may use checked land references. */
  railways?: RailwayPlan | ((atlas: ProvinceAtlas) => RailwayPlan);
}

/** Read-only view of one validated mod file, available without writing a build directory. */
export interface InspectedOutput {
  readonly path: string;
  readonly source: string;
  readonly kind: OutputFile["kind"];
  readText(): string;
  /** Returns independent bytes; editing them cannot modify the mod. */
  readBytes(): Uint8Array;
}

/** Options for workflows that can refresh editor declarations from the same resolved inputs. */
export interface ProjectBuildOptions extends ProjectOptions {
  /** Write `.krieg` declarations as part of this build. Enabled by the CLI. */
  writeEditor?: boolean;
  /** Visit the final outputs after validation. With `check: true`, useful for previews and authoring tools. This is a host-side hook, never executed from Krieg source. */
  onOutput?: (output: InspectedOutput) => void;
}

export interface KriegConfig {
  name: string;
  rootDir: string;
  configPath: string;
  sourceDir: string;
  outDir: string;
  mod: ModMetadata;
  dependencies: string[];
  assets: AssetRule[];
  localisation: LocalisationRule[];
  gameRoots: GameRoot[];
  world: { countries: string[]; states: number[] };
  strictAssets: boolean;
  railways?: RailwayPlan;
}

export interface ProjectDiagnostic {
  code: string;
  severity: "error" | "warning";
  message: string;
  file?: string;
  line?: number;
  column?: number;
}

export interface ProjectLayer {
  config: KriegConfig;
  packageName?: string;
}

export interface OutputFile {
  /** Internal build provenance, stored only in the local build marker. */
  origins?: import("../compiler/types.js").NativeLineOrigin[];
  path: string;
  bytes: Uint8Array;
  source: string;
  kind: "script" | "asset" | "localisation" | "metadata";
}

export interface BuildResult {
  success: boolean;
  diagnostics: ProjectDiagnostic[];
  files: Array<{ path: string; bytes: number; sha256: string; kind: OutputFile["kind"] }>;
  outDir: string;
  launcherFile?: string;
  world: { countries: number; states: number; assets: number };
}
