#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractCwtSchema } from "../dist/schema/cwt.js";

const rules = process.argv[2];
if (!rules || rules === "--help") {
  console.log("Usage: node scripts/generate-schema.mjs <CWTools-rules-directory> [output.json]");
  console.log("Build Krieg first. Rule data is read locally; no game files are bundled.");
  process.exit(rules ? 0 : 2);
}
const output = process.argv[3]
  ? resolve(process.argv[3])
  : fileURLToPath(new URL("../src/schema/hoi4-schema.json", import.meta.url));
const schema = await extractCwtSchema(
  resolve(rules),
  "https://github.com/cwtools/cwtools-hoi4-config (uploaded snapshot)",
);
if (schema.diagnostics.length) {
  console.error(JSON.stringify(schema.diagnostics, null, 2));
  process.exitCode = 1;
}
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(schema, null, 2) + "\n");
console.log(
  JSON.stringify({
    output,
    files: schema.provenance.files,
    sourceSha256: schema.provenance.sha256,
    overloads: schema.commands.length,
    commands: new Set(schema.commands.map((command) => `${command.kind}:${command.name}`)).size,
    diagnostics: schema.diagnostics.length,
  }),
);
