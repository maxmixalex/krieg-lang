import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { apiUrl } from "./write-api-redirects.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const site = path.join(root, "site");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "docs/api/manifest.json"), "utf8"));
const baseUrl = new URL(
  fs.readFileSync(path.join(root, "zensical.toml"), "utf8").match(/^site_url\s*=\s*"([^"]+)"/m)[1],
);
if (!fs.existsSync(path.join(site, "index.html")))
  throw new Error("Build the documentation first: zensical build --clean --strict");
const files = fs.readdirSync(site, { recursive: true }).filter((file) => file.endsWith(".html"));
const pages = new Map();
const failures = [];
const redirects = JSON.parse(fs.readFileSync(path.join(root, "docs/api/redirects.json"), "utf8"));
const redirectByUrl = new Map(redirects.map((entry) => [`${apiUrl(entry.from)}index.html`, entry]));
const authorApis = [
  {
    name: "CountryEvent",
    module: "krieg-lang/hoi4",
    types: ["EventSpec", "EventDefinition"],
    samePage: true,
    example: true,
  },
  {
    name: "DecisionCategory",
    module: "krieg-lang/hoi4",
    types: ["DecisionCategorySpec", "DecisionSpec"],
    samePage: true,
  },
  {
    name: "FocusGraph",
    module: "krieg-lang/hoi4",
    types: ["FocusGraphSpec", "FocusGraphDefinition"],
    samePage: true,
    example: true,
  },
  {
    name: "ScriptedWindow",
    module: "krieg-lang/ui",
    types: ["ScriptedWindowSpec", "GuiBindings"],
    samePage: true,
    example: true,
  },
  {
    name: "ProvinceAtlas",
    module: "krieg-lang/project",
    types: ["WorldFile", "ProvinceAtlasOptions"],
    example: true,
  },
  {
    name: "ScriptedEffectFamily",
    module: "krieg-lang/hoi4",
    types: ["ScriptedEffectFamilyDefinition", "ScriptedVariantValue"],
  },
  {
    name: "ScriptedTriggerFamily",
    module: "krieg-lang/hoi4",
    types: ["ScriptedTriggerFamilyDefinition", "ScriptedVariantValue"],
  },
  {
    name: "buildProject",
    module: "krieg-lang/project",
    types: ["BuildResult", "ProjectBuildOptions"],
    samePage: true,
  },
  {
    name: "compileSource",
    module: "krieg-lang/compiler",
    types: ["CompileOptions", "CompileResult"],
    samePage: true,
  },
  { name: "Button", module: "krieg-lang/ui", types: ["ButtonProps"], samePage: true },
  { name: "Text", module: "krieg-lang/ui", types: ["TextProps"], samePage: true },
  { name: "Container", module: "krieg-lang/ui", types: ["ContainerProps"], samePage: true },
  {
    name: "importProject",
    module: "krieg-lang/project",
    types: ["ImportProjectResult"],
    samePage: true,
  },
];
const unescape = (value) =>
  value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'");
for (const file of files) {
  const source = fs.readFileSync(path.join(site, file), "utf8");
  const ids = new Set(
    [...source.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => unescape(match[1])),
  );
  pages.set(file.replaceAll(path.sep, "/"), { source, ids });
  if (file.startsWith("api/reference/") && !redirectByUrl.has(file)) {
    const article = source.match(/<article\b[\s\S]*?<\/article>/)?.[0] ?? "";
    const articleIds = [...article.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
    if (new Set(articleIds).size !== articleIds.length)
      failures.push(`${file}: duplicate rendered article IDs`);
    if (Buffer.byteLength(article) > 450000)
      failures.push(`${file}: reference article exceeds 450 KB`);
  }
}
let checked = 0;
function checkHref(file, href) {
  if (/^(mailto:|tel:|data:|javascript:)/i.test(href)) return;
  let url;
  try {
    url = new URL(unescape(href), new URL(file, baseUrl));
  } catch {
    failures.push(`${file}: invalid URL ${href}`);
    return;
  }
  if (url.origin !== baseUrl.origin) return;
  // A leading slash is meaningful on project Pages. Do not silently accept a
  // root-relative URL that loses /krieg-lang/.
  if (!url.pathname.startsWith(baseUrl.pathname)) {
    failures.push(`${file}: local link escapes site base: ${href}`);
    return;
  }
  let target = decodeURIComponent(url.pathname.slice(baseUrl.pathname.length));
  if (!target || target.endsWith("/")) target += "index.html";
  if (!fs.existsSync(path.join(site, target))) {
    failures.push(`${file}: missing target ${href} -> ${target}`);
    return;
  }
  const redirect = redirectByUrl.get(target);
  if (redirect) {
    const anchor = decodeURIComponent(url.hash.slice(1));
    checkHref("index.html", apiUrl(redirect.anchors[anchor] ?? redirect.to));
    checked++;
    return;
  }
  if (url.hash && pages.has(target)) {
    const anchor = decodeURIComponent(url.hash.slice(1));
    if (anchor && !pages.get(target).ids.has(anchor))
      failures.push(`${file}: missing anchor ${href}`);
  }
  checked++;
}
for (const [file, { source }] of pages) {
  for (const match of source.matchAll(/<(?:a|link)\b[^>]*\bhref=["']([^"']*)["']/g))
    checkHref(file, match[1]);
  for (const match of source.matchAll(/<(?:img|script|source)\b[^>]*\bsrc=["']([^"']*)["']/g))
    checkHref(file, match[1]);
}

// Every real export must lead to a rendered page/anchor, including re-exports.
for (const entry of manifest.exports) {
  checkHref("index.html", apiUrl(entry.page));
  if (redirectByUrl.has(`${apiUrl(entry.page).split("#")[0]}index.html`))
    failures.push(`Export points to a compatibility redirect: ${entry.module}:${entry.name}`);
}
// Validate every captured 0.3 fragment through its redirect/fallback, and the
// concrete script/canonical link used in the final deployed HTML.
const baseline = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/api-legacy-0.3.json"), "utf8"),
);
for (const entry of baseline.pages) {
  checkHref("index.html", apiUrl(entry.page));
  for (const anchor of entry.anchors) checkHref("index.html", `${apiUrl(entry.page)}#${anchor}`);
}
for (const redirect of redirects) {
  if (fs.existsSync(path.join(root, "docs/api", redirect.from)))
    failures.push(`Compatibility URL must not have a Markdown source page: ${redirect.from}`);
  checkHref("index.html", apiUrl(redirect.to));
  for (const target of new Set(Object.values(redirect.anchors)))
    checkHref("index.html", apiUrl(target));
  const html = pages.get(`${apiUrl(redirect.from)}index.html`)?.source ?? "";
  if (!html.includes('name="robots" content="noindex"') || !html.includes("location.replace("))
    failures.push(`Compatibility URL is not a lightweight redirect: ${redirect.from}`);
}
const apiFiles = fs.readdirSync(path.join(root, "docs/api"), { recursive: true });
if (files.some((file) => file.replaceAll(path.sep, "/").startsWith("api/structures/")))
  failures.push("Retired implementation-only structure pages remain in the rendered site");
for (const file of apiFiles.filter((file) => file.endsWith(".md"))) {
  if (/NativeShape\d+/.test(fs.readFileSync(path.join(root, "docs/api", file), "utf8")))
    failures.push(
      `api/${file}: implementation-only NativeShape ID leaked into reader documentation`,
    );
}

// Check the actual search artifact, rather than assuming successful Markdown
// rendering implies that the site-wide search has indexed API content.
const searchPath = path.join(site, "search.json");
if (!fs.existsSync(searchPath)) failures.push("Zensical search index was not generated");
else {
  const search = JSON.parse(fs.readFileSync(searchPath, "utf8"));
  const records = search.items ?? [];
  const text = records.map((record) => `${record.title ?? ""} ${record.text ?? ""}`).join("\n");
  for (const term of [
    "CountryEvent",
    "completionReward",
    "ScriptedEffect",
    "add_political_power",
    "START_DATE",
  ])
    if (!text.includes(term)) failures.push(`Search index is missing API content: ${term}`);
  if (!records.some((record) => record.location?.startsWith("api/reference/")))
    failures.push("Search index does not contain TypeDoc reference pages");
  const indexedLocations = new Set(records.map((record) => record.location));
  for (const entry of manifest.exports) {
    if (!indexedLocations.has(apiUrl(entry.page)))
      failures.push(
        `Public export is not directly searchable: ${entry.module}:${entry.name} (${apiUrl(entry.page)})`,
      );
  }
  for (const redirect of redirects)
    if (records.some((record) => record.location?.split("#")[0] === apiUrl(redirect.from)))
      failures.push(`Compatibility redirect pollutes search: ${redirect.from}`);
  for (const api of authorApis) {
    const entry = manifest.exports.find(
      (item) => item.name === api.name && item.module === api.module,
    );
    if (!entry) {
      failures.push(`Missing author API export: ${api.module}:${api.name}`);
      continue;
    }
    const location = apiUrl(entry.page).split("#")[0];
    const ownRecords = records.filter((record) => record.location?.split("#")[0] === location);
    if (!ownRecords.some((record) => record.title?.includes(api.name)))
      failures.push(`Search index is missing the canonical ${api.name} reference page`);
    const page = pages.get(`${location}index.html`);
    const article = page?.source.match(/<article\b[\s\S]*?<\/article>/)?.[0] ?? "";
    if (!article.includes(">Parameters<"))
      failures.push(`${api.name}: rendered parameter documentation is missing`);
    if (api.example && !article.includes(">Example<"))
      failures.push(`${api.name}: rendered JSDoc example is missing`);
    if (!article.includes("完整示例与工作流"))
      failures.push(`${api.name}: tested workflow guide is missing`);
    if (!article.includes(`https://github.com/maxmixalex/krieg-lang/blob/main/${entry.source}#L`))
      failures.push(`${api.name}: source link is missing`);
    for (const type of api.types) {
      const target = manifest.exports.find(
        (item) => item.name === type && item.module === api.module,
      );
      if (!target) {
        failures.push(`${api.name}: type export ${type} is missing`);
        continue;
      }
      if (api.samePage && entry.page.split("#")[0] !== target.page.split("#")[0])
        failures.push(`${api.name} and ${type} are not readable on the same page`);
      const expected = new URL(apiUrl(target.page), baseUrl).href;
      if (
        ![...article.matchAll(/\bhref=["']([^"']*)["']/g)].some(
          (match) =>
            new URL(unescape(match[1]), new URL(`${location}index.html`, baseUrl)).href.replace(
              /\/index\.html(?=#|$)/,
              "/",
            ) === expected,
        )
      )
        failures.push(`${api.name}: rendered ${type} type link is missing`);
    }
  }
}
if (failures.length)
  throw new Error(
    `Documentation verification failed:\n${failures.slice(0, 100).join("\n")}\n${failures.length} total failures`,
  );
console.log(
  `Checked ${pages.size} rendered pages, ${checked} local links/assets, ${manifest.exports.length} directly searchable public exports, ${manifest.referencePages.length} bounded task reference pages, ${baseline.pages.length} legacy URLs with ${manifest.compatibility.anchors} anchors, and ${authorApis.length} author workflows with parameters, source and type links.`,
);
