import { cpSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

function copyData(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) copyData(path);
    else if (entry.name.endsWith(".d.ts") || /\.(json|cwt|md)$/.test(entry.name)) {
      const dest = path.replace(/^src\//, "dist/");
      mkdirSync(dirname(dest), { recursive: true });
      cpSync(path, dest);
    }
  }
}
copyData("src");
