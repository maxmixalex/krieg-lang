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
