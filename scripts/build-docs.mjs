import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { writeDocRedirects } from "./write-doc-redirects.mjs";
import { writeApiRedirects } from "./write-api-redirects.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
// Zensical's --clean resets its build cache. Clear retired output URLs as well,
// otherwise a removed source page can survive in a local preview or artifact.
fs.rmSync(path.join(root, "site"), {
  recursive: true,
  force: true,
  maxRetries: 5,
  retryDelay: 100,
});
const result = spawnSync("zensical", ["build", "--clean", "--strict"], {
  cwd: root,
  stdio: "inherit",
});
if (result.error) {
  console.error(
    "Install requirements-docs.txt and add its environment to PATH before building docs.",
  );
  throw result.error;
}
if (result.status !== 0) process.exit(result.status ?? 1);
writeApiRedirects(root);
writeDocRedirects(root);
await import("./check-docs.mjs");
