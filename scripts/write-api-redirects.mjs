import fs from "node:fs";
import path from "node:path";

export const apiUrl = (page) => {
  const [file, hash] = page.split("#");
  const pathname = `api/${file}`.replace(/(?:\/index)?\.md$/, "/");
  return `${pathname}${hash ? `#${hash}` : ""}`;
};

/** Render compatibility URLs outside Zensical's navigation and search index. */
export function writeApiRedirects(root) {
  const redirects = JSON.parse(fs.readFileSync(path.join(root, "docs/api/redirects.json"), "utf8"));
  const siteUrl = fs
    .readFileSync(path.join(root, "zensical.toml"), "utf8")
    .match(/^site_url\s*=\s*"([^"]+)"/m)[1];
  const escape = (value) =>
    value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
  for (const entry of redirects) {
    const route = apiUrl(entry.from);
    const relativeUrl = (target) => {
      const [pathname, hash] = apiUrl(target).split("#");
      return `${path.posix.relative(route, pathname) || "."}/${hash ? `#${hash}` : ""}`;
    };
    const destination = relativeUrl(entry.to);
    const canonical = new URL(apiUrl(entry.to), siteUrl).href;
    const anchors = Object.fromEntries(
      Object.entries(entry.anchors)
        .filter(([, target]) => target !== entry.to)
        .map(([anchor, target]) => [anchor, relativeUrl(target)]),
    );
    // The redirect retains the exact old field destination when known, and
    // otherwise opens the owning symbol. Unknown hashes never target another
    // symbol's similarly named Properties or Parameters section.
    const script = `const targets=${JSON.stringify(anchors).replaceAll("<", "\\u003c")};let fragment=location.hash.slice(1);try{fragment=decodeURIComponent(fragment)}catch{}location.replace(targets[fragment]||${JSON.stringify(destination)});`;
    const html = `<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${escape(canonical)}"><meta http-equiv="refresh" content="0; url=${escape(destination)}"><title>参考位置已更新</title><script>${script}</script></head><body><p><a href="${escape(destination)}">打开对应参考</a></p></body></html>\n`;
    const filename = path.join(root, "site", route, "index.html");
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, html);
  }
  console.log(`Wrote ${redirects.length} compatibility redirects outside navigation and search.`);
}
