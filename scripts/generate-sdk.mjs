import fs from "node:fs";
import { generateCommandDeclarations } from "../dist/compiler/index.js";

// Run `npm run build` first. Generation is explicit and never runs during check.
const schema = JSON.parse(
  fs.readFileSync(new URL("../src/schema/hoi4-schema.json", import.meta.url), "utf8"),
);
const content = generateCommandDeclarations(schema);
const file = new URL("../src/sdk/commands.ts", import.meta.url);
if (process.argv.includes("--check")) {
  if (fs.readFileSync(file, "utf8") !== content) {
    console.error("Generated SDK is stale. Run node scripts/generate-sdk.mjs, then rebuild.");
    process.exitCode = 1;
  }
} else {
  fs.writeFileSync(file, content);
  console.log("Generated src/sdk/commands.ts from the bundled CWT projection.");
}
