import { readFileSync } from "node:fs";

/** The installed package version, shared by the CLI and project scaffolding. */
export const VERSION = (
  JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
    version: string;
  }
).version;
