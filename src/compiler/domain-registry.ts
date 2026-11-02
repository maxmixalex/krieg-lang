import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export type NativeValue =
  | {
      kind: "scalar";
      type: "string" | "number" | "boolean";
      literals?: (string | number | boolean)[];
      integer?: boolean;
      min?: number;
      max?: number;
      format?: "day-month";
    }
  | { kind: "object"; shape: string }
  | { kind: "list"; element: NativeValue }
  | { kind: "map"; value: NativeValue; keys?: string[] }
  | { kind: "callback"; mode: "effect" | "trigger"; scope: string }
  | { kind: "opaque"; reason: string }
  | { kind: "union"; variants: NativeValue[] };
export interface NativeField {
  name: string;
  value: NativeValue;
  repeated?: boolean;
  minCount?: number;
  maxCount?: number;
  required?: boolean;
  description?: string;
}
export interface NativeDomainDefinition {
  folder: string;
  root?: string;
  rootField?: string;
  rootValues?: string[];
  nodeName?: string;
  idField?: string;
  idType?: "number" | "string";
  idMode: "key" | "field" | "anonymous";
  extension?: string;
  fileName?: string;
  shape: string;
  source: string;
  line: number;
  kind?: "country" | "event";
  byId?: Record<string, string>;
}
export interface NativeDomainSchema {
  formatVersion: 1;
  provenance: { source: string; sha256: string; files: number };
  definitions: Record<string, NativeDomainDefinition>;
  shapes: Record<string, Record<string, NativeField>>;
  gui: Record<
    string,
    {
      name: string;
      shape: string;
      children?: boolean;
      validation?: "upstream-cwt" | "corpus-observed";
    }
  >;
  limitations: string[];
}
export const DOMAIN_SCHEMA = JSON.parse(
  readFileSync(fileURLToPath(new URL("../schema/hoi4-domains.json", import.meta.url)), "utf8"),
) as NativeDomainSchema;
export const DOMAIN_DEFINITIONS = DOMAIN_SCHEMA.definitions;
