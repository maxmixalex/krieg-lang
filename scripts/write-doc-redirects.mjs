import fs from "node:fs";
import path from "node:path";

export const docUrl = (page) => {
  const [file, hash] = page.split("#");
  const pathname = file === "index.md" ? "" : file.replace(/(?:\/index)?\.md$/, "/");
  return `${pathname}${hash ? `#${hash}` : ""}`;
};

/** Keep published guide fragments while moving content outside the old search locations. */
export function writeDocRedirects(root) {
  const redirects = JSON.parse(fs.readFileSync(path.join(root, "docs/redirects.json"), "utf8"));
  const siteUrl = fs
    .readFileSync(path.join(root, "zensical.toml"), "utf8")
    .match(/^site_url\s*=\s*"([^"]+)"/m)[1];
  const escape = (value) =>
    value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
  for (const entry of redirects) {
    const route = docUrl(entry.from);
    const relativeUrl = (target) => {
      const [pathname, hash] = docUrl(target).split("#");
      return `${path.posix.relative(route, pathname) || "."}/${hash ? `#${hash}` : ""}`;
    };
    const destination = relativeUrl(entry.to);
    const targets = Object.fromEntries(
      Object.entries(entry.anchors).map(([anchor, target]) => [anchor, relativeUrl(target)]),
    );
    const script = `const targets=${JSON.stringify(targets).replaceAll("<", "\\u003c")};let fragment=location.hash.slice(1);try{fragment=decodeURIComponent(fragment)}catch{}location.replace(targets[fragment]||${JSON.stringify(destination)});`;
    const canonical = new URL(docUrl(entry.to), siteUrl).href;
    const filename = path.join(root, "site", route, "index.html");
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(
      filename,
      `<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${escape(canonical)}"><meta http-equiv="refresh" content="0; url=${escape(destination)}"><title>文档位置已更新</title><script>${script}</script></head><body><p><a href="${escape(destination)}">打开对应文档</a></p></body></html>\n`,
    );
  }
  console.log(`Wrote ${redirects.length} guide redirects with preserved 0.4 fragments.`);
}
