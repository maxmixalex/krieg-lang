import { readFileSync } from "node:fs";
import type { CwtSchema } from "./types.js";
export * from "./cwt.js";
export type * from "./types.js";
let bundled: CwtSchema | undefined;
export function loadBundledSchema(): CwtSchema {
  return (bundled ??= JSON.parse(
    readFileSync(new URL("./hoi4-schema.json", import.meta.url), "utf8"),
  ) as CwtSchema);
}
