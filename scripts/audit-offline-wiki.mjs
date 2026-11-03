/** Verify the user's immutable export. Only bibliographic metadata and mappings are published. */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync, strFromU8 } from "fflate";
import * as prettier from "prettier";

const root = fileURLToPath(new URL("../", import.meta.url));
const input = process.argv[2];
if (!input) throw new Error("Usage: node scripts/audit-offline-wiki.mjs export.zip [--check]");
const inventory = JSON.parse(readFileSync(resolve(root, "docs/coverage-inventory.json"), "utf8"));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const normalized = (title) => decodeURIComponent(title).replaceAll("_", " ").toLowerCase();
const familiesByTitle = new Map();
for (const topic of inventory.families)
  for (const url of topic.wiki) {
    const title = normalized(new URL(url).pathname.split("/").at(-1));
    const ids = familiesByTitle.get(title) ?? new Set();
    ids.add(topic.id);
    familiesByTitle.set(title, ids);
  }
// Explicit editorial mappings for redirects, tool pages, and pages that cover multiple families.
const special = {
  Effect: ["effects", "meta-effects"],
  "List of modifiers": ["modifiers"],
  Mods: ["project"],
  "Mod structure": ["project"],
  Nudger: ["map", "troubleshooting"],
  Modding: ["project", "troubleshooting"],
};
const entries = unzipSync(readFileSync(resolve(input)), {
  filter: (file) => file.name === "manifest.json" || /^pages\/[^/]+\.wiki$/.test(file.name),
});
const manifest = JSON.parse(strFromU8(entries["manifest.json"]));
const pages = Object.values(manifest.pages)
  .map((page) => {
    const bytes = entries[page.file];
    if (!bytes || hash(bytes) !== page.sha256)
      throw new Error(`Source integrity mismatch: ${page.title}`);
    const families = special[page.title] ?? [
      ...(familiesByTitle.get(normalized(page.title)) ?? []),
    ];
    if (
      !families.length ||
      families.some((id) => !inventory.families.some((topic) => topic.id === id))
    )
      throw new Error(`Review the unmapped Wiki topic: ${page.title}`);
    return {
      pageId: page.pageid,
      title: page.title,
      revision: page.revision_id,
      revisionTimestamp: page.revision_timestamp,
      sourceUrl: page.source_url,
      sha256: page.sha256,
      families: [...families].sort(),
    };
  })
  .sort((a, b) => a.pageId - b.pageId);
if (
  pages.length !== manifest.saved_page_count ||
  Object.keys(entries).length !== pages.length + 1 ||
  new Set(pages.map((p) => p.pageId)).size !== pages.length
)
  throw new Error("Inconsistent Wiki export inventory");
const report = {
  source: manifest.wiki,
  category: manifest.root_category,
  exportedAt: manifest.created_utc,
  unavailable: manifest.unavailable,
  verifiedPageCount: pages.length,
  scope:
    "Every saved page was verified against its manifest SHA-256 and linked to the authoring coverage inventory. These are topic-level relationships, not claims that every example or engine behavior was tested.",
  pages,
};
const dest = resolve(root, "reports/validation/offline-wiki-inventory.json");
const text = await prettier.format(JSON.stringify(report), {
  filepath: dest,
  ...(await prettier.resolveConfig(dest)),
});
if (process.argv.includes("--check")) {
  if (readFileSync(dest, "utf8") !== text)
    throw new Error("Offline Wiki report differs; review new revisions and run without --check.");
} else writeFileSync(dest, text);
console.log(
  `Verified and mapped ${pages.length} offline Wiki pages; unavailable in export: ${manifest.unavailable.length}.`,
);
