import fs from "node:fs";
import path from "node:path";
import { ReflectionKind } from "typedoc";
import { topics, topicForName, nativeGroups } from "./api-topics.mjs";

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+$/, "");
const headingSlug = (name) =>
  name
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replaceAll("\\", "")
    .replace(/<[^>]*>/g, "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replace(/[^\p{L}\p{N}_\s-]/gu, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
const relative = (from, to) => {
  const [file, anchor] = to.split("#");
  return `${file === from ? "" : path.posix.relative(path.posix.dirname(from), file)}${anchor ? `#${anchor}` : ""}`;
};

/** Assemble task pages from TypeDoc's Markdown. This does not render signatures. */
export function generateTaskReference({ root, generated, manifest, rawPages, header }) {
  const groups = new Map();
  const destinations = new Map();
  const anchorDestinations = new Map();
  const forwarded = new Map();
  const native = JSON.parse(
    fs.readFileSync(path.join(root, "src/schema/hoi4-domains.json"), "utf8"),
  );
  const publicNames = new Set(manifest.exports.map((entry) => entry.name));
  // CWT FooSpec includes every inherited FooBody field. Keep that complete
  // Spec as the canonical table instead of publishing the same fields twice.
  for (const page of rawPages.values()) {
    if (!page.name.endsWith("Body") || publicNames.has(page.name)) continue;
    const owner = [...rawPages.values()].find(
      (item) => item.name === `${page.name.slice(0, -4)}Spec` && item.source === page.source,
    );
    if (owner) forwarded.set(page.old, owner.old);
  }

  function classify(page) {
    const { name, source, old } = page;
    const explicit = topicForName.get(name);
    if (explicit) return explicit;
    if (old.includes("/field-types/")) {
      const owner = name.split(".")[0].replace(/ fields$/, "");
      if (topicForName.has(owner)) return topicForName.get(owner);
    }
    if (/JSX\//.test(old) || /jsx-runtime\//.test(old)) return "ui/jsx";
    if (source?.startsWith("src/ui/")) return "ui/styles";
    if (source?.startsWith("src/project/")) {
      if (/trace|source-map/.test(source) || /Trace|SourceMap|OutputSource/.test(name))
        return "project/debugging";
      return "project/configuration";
    }
    if (source?.startsWith("src/compiler/") || source?.startsWith("src/schema/"))
      return "compiler/compile";
    if (source?.startsWith("src/pdx/")) return "pdx/construct";
    if (source?.startsWith("src/eslint/")) return "eslint/configuration";
    if (source === "src/sdk/gameplay.ts")
      return /Focus/.test(name) ? "hoi4/focus-graphs" : "hoi4/events";
    if (/Scope$/.test(name))
      return `hoi4/scopes-${/Character|UnitLeader|Operative/.test(name) ? "people" : "specialized"}`;
    if (source === "src/sdk/domains.ts") {
      const base = name
        .replace(/Spec$/, "")
        .replace(/Body$/, "")
        .split(".")[0]
        .replace(/Spec$/, "");
      const category = nativeGroups.find(([, , pattern]) => pattern.test(base));
      return `domains/${category[0]}`;
    }
    if (old.includes("/field-types/")) {
      const owner = name.split(".")[0].replace(/ fields$/, "");
      if (topicForName.has(owner)) return topicForName.get(owner);
      if (/Decimal|EventPart/.test(name)) return "hoi4/events";
    }
    throw new Error(`Public reference has no task grouping: ${old} (${source})`);
  }

  // Remove repeated, generated command bodies from inherited effect/trigger
  // interfaces. Their canonical catalog contains every overload and scope.
  // TypeDoc still renders the hand-written wrapper methods and inheritance.
  const commandTarget = (name, method) => {
    const kind = /Triggers?$/.test(name) ? "trigger" : "effect";
    if (!method) return "commands/index.md";
    const command = manifest.commands.find(
      (item) => item.kind === kind && slug(item.name) === slug(method),
    );
    return command?.page ?? "commands/index.md";
  };
  for (const page of rawPages.values()) {
    if (forwarded.has(page.old)) continue;
    if (/^Generated.*(?:Effects|Triggers)(?:ByScope)?$/.test(page.name)) {
      destinations.set(page.old, "commands/index.md");
      for (const match of page.content.matchAll(/<a id="([^"]+)"><\/a>/g))
        anchorDestinations.set(`${page.old}#${match[1]}`, commandTarget(page.name, match[1]));
      continue;
    }
    if (
      (page.old.endsWith("/index.md") && page.name !== "JSX") ||
      page.old === "reference/index.md"
    )
      continue;
    page.content = page.content.slice(page.content.indexOf("# "));
    page.content = page.content.replace(
      /## Extends\n\n- \[`([^`]+Body)`\]\([^\n]+\)\n/g,
      "共享基础结构的继承字段已完整列在本页。\n",
    );
    if (/^(Country|State)(Effects|Triggers)$/.test(page.name)) {
      page.content = page.content.replace(
        /<a id="([^"]+)"><\/a>\n\n### [\s\S]*?(?=\n<a id="|$)/g,
        (section, anchor) => {
          if (!section.includes("src/sdk/commands.ts")) return section;
          anchorDestinations.set(`${page.old}#${anchor}`, commandTarget(page.name, anchor));
          return "";
        },
      );
      page.content +=
        "\n继承的原生命令集中在[效果与条件目录](../../../commands/index.md)，每项含全部签名、合法作用域和 CWT 来源。\n";
    }
    if (page.name === "DefineOverrides") {
      let luaRoot = "ndefines";
      let namespace;
      const roots = [];
      for (const line of page.content.split("\n")) {
        const heading = line.match(/^(#{3,5}) (.+)$/);
        if (!heading) continue;
        const name = heading[2].replaceAll("\\", "").replace(/\?$/, "");
        if (heading[1].length === 3) {
          luaRoot = slug(name);
          roots.push(name);
          anchorDestinations.set(
            `${page.old}#${headingSlug(heading[2])}`,
            `defines/namespaces.md#${luaRoot}`,
          );
        } else if (heading[1].length === 4) {
          namespace = slug(name);
          anchorDestinations.set(
            `${page.old}#${headingSlug(heading[2])}`,
            `defines/${luaRoot}-${namespace}.md`,
          );
        } else if (namespace) {
          const key = name.slice(name.indexOf(".") + 1);
          anchorDestinations.set(
            `${page.old}#${headingSlug(heading[2])}`,
            `defines/${luaRoot}-${namespace}.md#${slug(key)}`,
          );
        }
      }
      page.content = page.content.split("## Properties")[0];
      page.content +=
        "## Properties\n\n所有层级的键均为可选。按下表展开命名空间即可查看每个键的实际值类型；这些表从同一个 DefineOverrides 声明生成。\n\n| Lua 根 | 字段目录 |\n| --- | --- |\n";
      for (const name of roots) {
        const field = slug(name);
        page.content += `| \`${name}\` | [命名空间与全部字段](../../../defines/namespaces.md#${field}) |\n`;
        anchorDestinations.set(`${page.old}#property-${field}`, `defines/namespaces.md#${field}`);
      }
    }
    const key = classify(page);
    let group = groups.get(key);
    if (!group) {
      const category = nativeGroups.find(([id]) => `domains/${id}` === key);
      group = {
        key,
        page: `reference/${key}.md`,
        title:
          topics[key]?.title ??
          category?.[1] ??
          (key.endsWith("people") ? "人物、将领与特工作用域" : "战斗、行动与特殊作用域"),
        entries: [],
      };
      groups.set(key, group);
    }
    page.group = group;
    group.entries.push(page);
  }

  for (const group of [...groups.values()]) {
    if (
      group.entries.reduce((bytes, entry) => bytes + Buffer.byteLength(entry.content), 0) <= 85000
    )
      continue;
    const fields = group.entries.filter(
      (entry) => entry.old.includes("/field-types/") && entry.name.includes("."),
    );
    if (!fields.length) continue;
    group.entries = group.entries.filter((entry) => !fields.includes(entry));
    group.children ??= [];
    const buckets = new Map();
    for (const entry of fields) {
      const property = entry.name.split(".")[1].toLowerCase();
      const bucket =
        ["a-f", "g-m", "n-s", "t-z"].find(
          (range) => property[0] >= range[0] && property[0] <= range[2],
        ) ?? "other";
      const values = buckets.get(bucket) ?? [];
      values.push(entry);
      buckets.set(bucket, values);
    }
    for (const [bucket, entries] of buckets) {
      const key = `${group.key}/fields-${bucket}`;
      const child = {
        key,
        page: `reference/${key}.md`,
        title: `${group.title}：复杂字段 ${bucket.toUpperCase()}`,
        entries,
        parent: group,
      };
      for (const entry of entries) entry.group = child;
      groups.set(key, child);
      group.children.push(child);
    }
  }

  // A task may contain dozens of native families. Keep constructor, Spec and
  // its shared fields adjacent, then split at family boundaries before a page
  // becomes a large HTML download. Stable family slugs avoid numbered pages.
  for (const group of [...groups.values()]) {
    group.entries.sort((a, b) => {
      const preferred = topics[group.key]?.names.split(" ");
      if (preferred) {
        const index = (entry) =>
          preferred.includes(entry.name) ? preferred.indexOf(entry.name) : preferred.length;
        if (index(a) !== index(b)) return index(a) - index(b);
      }
      const base = (item) => item.name.replace(/Spec$/, "").replace(/Body$/, "").split(".")[0];
      const order = (item) =>
        item.kind === ReflectionKind.Function ? 0 : item.old.includes("/field-types/") ? 2 : 1;
      return (
        base(a).localeCompare(base(b), "en") ||
        order(a) - order(b) ||
        a.name.localeCompare(b.name, "en") ||
        a.old.localeCompare(b.old, "en")
      );
    });
    if (
      group.entries.reduce((bytes, entry) => bytes + Buffer.byteLength(entry.content), 0) <= 90000
    )
      continue;
    if (!group.key.startsWith("domains/") && !group.key.startsWith("ui/native-controls"))
      throw new Error(`Task ${group.key} exceeds 90KB; split it into meaningful subtopics`);
    const families = new Map();
    for (const entry of group.entries) {
      const base = entry.name
        .split(".")[0]
        .replace(/ fields$/, "")
        .replace(/Spec$/, "")
        .replace(/Body$/, "")
        .replace(/Props$/, "");
      const values = families.get(base) ?? [];
      values.push(entry);
      families.set(base, values);
    }
    group.children ??= [];
    group.entries = [];
    for (const [name, entries] of families) {
      const key = `${group.key}/${slug(name)}`;
      const child = {
        key,
        page: `reference/${key}.md`,
        title: `${name}：构造器与字段`,
        entries,
        parent: group,
      };
      for (const entry of entries) entry.group = child;
      groups.set(key, child);
      group.children.push(child);
    }
  }

  for (const group of groups.values()) {
    if (
      group.entries.length > 1 &&
      group.entries.every((entry) => entry.old.includes("/field-types/")) &&
      group.entries.reduce((bytes, entry) => bytes + Buffer.byteLength(entry.content), 0) > 65000
    ) {
      const buckets = new Map();
      for (const entry of group.entries) {
        const letter = entry.name
          .split(".")
          .at(-1)
          .replace(/ fields$/, "")[0]
          .toLowerCase();
        const bucket =
          ["a-c", "d-g", "h-l", "m-r", "s-z"].find(
            (range) => letter >= range[0] && letter <= range[2],
          ) ?? "other";
        const values = buckets.get(bucket) ?? [];
        values.push(entry);
        buckets.set(bucket, values);
      }
      if (buckets.size > 1) {
        group.entries = [];
        group.children ??= [];
        for (const [bucket, entries] of buckets) {
          const key = `${group.key}/${bucket}`;
          const child = {
            key,
            page: `reference/${key}.md`,
            title: `${group.title} · ${bucket.toUpperCase()}`,
            entries,
            parent: group,
          };
          for (const entry of entries) entry.group = child;
          groups.set(key, child);
          group.children.push(child);
        }
      }
    }
  }

  for (const group of groups.values()) {
    const counts = new Map();
    for (const entry of group.entries) {
      const base = slug(entry.name);
      const count = counts.get(base) ?? 0;
      counts.set(base, count + 1);
      // Type/value pairs, e.g. GuiVariable and country/Country, have separate
      // destinations. The anchor is deterministic and independent of order.
      const collision = group.entries.filter((other) => slug(other.name) === base).length > 1;
      entry.anchor = collision ? `${base}-${slug(ReflectionKind[entry.kind])}` : base;
      if (
        group.entries.filter((other) => slug(other.name) === base && other.kind === entry.kind)
          .length > 1
      )
        entry.anchor += `-${slug(path.posix.basename(entry.old, ".md"))}`;
      if (group.entries.some((other) => other !== entry && other.anchor === entry.anchor))
        throw new Error(`Duplicate task anchor: ${group.page}#${entry.anchor}`);
      destinations.set(entry.old, `${group.page}#${entry.anchor}`);
    }
  }

  // Explicit section and field IDs are scoped by their owning symbol. This
  // prevents every included Spec from claiming #properties / #property-id.
  for (const group of groups.values()) {
    for (const entry of group.entries) {
      const counts = new Map();
      const ids = new Map();
      const unique = (base) => {
        const count = counts.get(base) ?? 0;
        counts.set(base, count + 1);
        return count ? `${base}-${count}` : base;
      };
      entry.content = entry.content.replace(/<a id="([^"]+)"><\/a>/g, (_, old) => {
        const id = unique(`${entry.anchor}-${old}`);
        if (!ids.has(old)) {
          ids.set(old, id);
          anchorDestinations.set(`${entry.old}#${old}`, `${group.page}#${id}`);
        }
        return `<a id="${id}"></a>`;
      });
      let fence = false;
      const headingCounts = new Map();
      entry.content = entry.content
        .split("\n")
        .map((line) => {
          if (/^```/.test(line)) fence = !fence;
          if (fence) return line;
          const match = line.match(/^(#{1,6}) (.+)$/);
          if (!match) return line;
          const [, level, title] = match;
          const oldBase = headingSlug(title);
          const oldCount = headingCounts.get(oldBase) ?? 0;
          headingCounts.set(oldBase, oldCount + 1);
          const old = oldCount ? `${oldBase}_${oldCount}` : oldBase;
          const id =
            level.length === 1 ? entry.anchor : unique(`${entry.anchor}-section-${oldBase}`);
          if (!anchorDestinations.has(`${entry.old}#${old}`))
            anchorDestinations.set(`${entry.old}#${old}`, `${group.page}#${id}`);
          return `${"#".repeat(Math.min(level.length + 1, 6))} ${title.replace(/^(Interface|Type Alias|Function|Variable|Namespace|Class): /, "")} { #${id} }`;
        })
        .join("\n");
    }
  }

  // Preserve entry-point URLs with compact indexes; re-exports share the same
  // canonical destination, including project symbols TypeDoc locates at root.
  for (const module of manifest.modules) destinations.set(module.page, module.page);
  destinations.set("reference/index.md", "reference/index.md");
  for (const [old, target] of forwarded) {
    destinations.set(old, destinations.get(target));
    for (const [source, destination] of anchorDestinations)
      if (source.startsWith(`${target}#`))
        anchorDestinations.set(old + source.slice(target.length), destination);
  }
  for (const page of rawPages.values()) {
    if (!destinations.has(page.old)) {
      if (page.name === "JSX") destinations.set(page.old, "reference/ui/jsx.md");
      else destinations.set(page.old, "reference/index.md");
    }
  }
  function rewrite(content, from, to) {
    return content.replace(/\]\(([^\s)]+)\)/g, (whole, href) => {
      if (/^(?:[a-z]+:|\/)/i.test(href)) return whole;
      const [file, fragment] = href.split("#");
      const original = file
        ? path.posix.normalize(path.posix.join(path.posix.dirname(from), file))
        : from;
      const destination =
        anchorDestinations.get(`${original}#${fragment}`) ?? destinations.get(original);
      if (!destination) return `](${relative(to, `${original}${fragment ? `#${fragment}` : ""}`)})`;
      return `](${relative(to, destination)})`;
    });
  }
  for (const entry of manifest.exports) {
    entry.legacyPage = entry.page;
    entry.page = destinations.get(entry.page) ?? entry.page;
    const raw = rawPages.get(entry.legacyPage);
    entry.kind = raw ? ReflectionKind[raw.kind] : "Namespace";
  }

  const guideLink = (page, guide) => path.posix.relative(path.posix.dirname(`api/${page}`), guide);
  for (const group of groups.values()) {
    let topicGroup = group;
    while (topicGroup && !topics[topicGroup.key]) topicGroup = topicGroup.parent;
    const topic = topicGroup ? topics[topicGroup.key] : undefined;
    const lines = [
      header,
      `# ${group.title}`,
      "",
      `[API 任务入口](${relative(group.page, "index.md")}) · [公开模块](${relative(group.page, "reference/index.md")})`,
      "",
    ];
    if (group.parent)
      lines.push(`[${group.parent.title}](${relative(group.page, group.parent.page)})`, "");
    if (topic) {
      lines.push(rewrite(topic.intro, `reference/${topicGroup.key}.md`, group.page), "");
      if (topic.example && !group.parent)
        lines.push("## 使用示例", "", `\`\`\`${topic.language ?? "ts"}`, topic.example, "```", "");
    } else if (group.key.startsWith("domains/")) {
      lines.push(
        "这些构造器将配置写入对应的原生游戏内容目录；相邻的 Spec 列出完整字段、可选性与继承结构。共享字段以使用位置命名，不能作为独立包符号导入。若字段包含重复键或复杂原生内容，可通过 CwtNode 保留其结构。",
        "",
      );
      const definitions = [
        ...new Set(group.entries.map((entry) => entry.name.replace(/Spec$/, ""))),
      ].filter((name) => native.definitions[name]);
      if (definitions.length) {
        lines.push("| 内容 | 输出目录 |", "| --- | --- |");
        for (const name of definitions)
          lines.push(`| ${name} | \`${native.definitions[name].folder}\` |`);
        lines.push("");
      }
    } else
      lines.push(
        "这些接口描述相应游戏上下文。效果通过 `.effects` 发出，条件通过 `.triggers` 检查；继承的原生命令可查[效果与条件目录](../../commands/index.md)。",
        "",
      );
    if (group.children) {
      lines.push("## 按内容展开", "");
      for (const child of group.children)
        lines.push(`- [${child.title}](${relative(group.page, child.page)})`);
      lines.push("");
    }
    if (group.entries.length) {
      lines.push(
        "## 本页参考",
        "",
        ...group.entries.map(
          (entry) =>
            `- [${entry.name}](#${entry.anchor})${publicNames.has(entry.name) ? "" : "（共享字段）"}`,
        ),
        "",
      );
      for (const entry of group.entries)
        lines.push(rewrite(entry.content, entry.old, group.page), "");
    }
    const guide =
      topic?.guide ?? (group.key.startsWith("domains/") ? "content-domains.md" : "scopes.md");
    lines.push(
      "## 完整示例与工作流",
      "",
      `[阅读${topic?.title ?? group.title}指南](${guideLink(group.page, guide)})`,
      "",
    );
    const content = lines.join("\n");
    if (Buffer.byteLength(content) > 150000)
      throw new Error(`Reference page is too large: ${group.page}`);
    generated.set(`docs/api/${group.page}`, content);
  }

  for (const module of manifest.modules) {
    const entries = manifest.exports.filter((entry) => entry.module === module.name);
    const lines = [
      header,
      `# ${module.name}`,
      "",
      "按任务选择参考页。函数、输入配置与返回句柄尽量在同一页，重导出指向同一份详细参考。",
      "",
      "| 公开符号 | 任务参考 |",
      "| --- | --- |",
    ];
    for (const entry of entries)
      lines.push(`| \`${entry.name}\` | [${entry.name}](${relative(module.page, entry.page)}) |`);
    lines.push("");
    generated.set(`docs/api/${module.page}`, lines.join("\n"));
  }
  const index = [
    header,
    "# 公开模块与任务参考",
    "",
    "TypeDoc 负责从当前包导出生成参数、字段、继承和源码位置；参考区按作者任务组织，相关符号共享一页。",
    "",
    "## 模块入口",
    "",
  ];
  for (const module of manifest.modules)
    index.push(`- [${module.name}](${relative("reference/index.md", module.page)})`);
  index.push("", "## 任务", "");
  for (const group of groups.values())
    if (!group.parent)
      index.push(`- [${group.title}](${relative("reference/index.md", group.page)})`);
  generated.set("docs/api/reference/index.md", index.join("\n") + "\n");

  // Keep compatibility as data, not Markdown pages. build-docs writes tiny HTML
  // redirects after Zensical has rendered only real content. New source links
  // must use canonical destinations, and aliases never enter search or nav.
  const baseline = JSON.parse(
    fs.readFileSync(path.join(root, "scripts/api-legacy-0.3.json"), "utf8"),
  );
  const legacy = new Map(baseline.pages.map((entry) => [entry.page, entry.anchors]));
  for (const [old, anchors] of legacy) {
    const key = `docs/api/${old}`;
    if (!generated.has(key)) continue;
    const content = generated.get(key);
    const currentIds = new Set([
      ...[...content.matchAll(/<a id="([^"]+)"/g)].map((match) => match[1]),
      ...[...content.matchAll(/^#+ (.+)$/gm)].map((match) => headingSlug(match[1])),
      "__skip",
    ]);
    generated.set(
      key,
      content +
        "\n" +
        anchors
          .filter((anchor) => !currentIds.has(anchor))
          .map((anchor) => `<a id="${anchor}"></a>`)
          .join("\n") +
        "\n",
    );
  }
  const redirects = [];
  for (const [old, anchors] of legacy) {
    if (generated.has(`docs/api/${old}`)) continue;
    const renamed = [...rawPages.values()].filter(
      (page) =>
        page.name === path.posix.basename(old, ".md") && !page.old.includes("/field-types/"),
    );
    const target =
      destinations.get(old) ??
      (renamed.length === 1 ? destinations.get(renamed[0].old) : undefined) ??
      "reference/index.md";
    const anchorSource = destinations.has(old) ? old : renamed.length === 1 ? renamed[0].old : old;
    const mappings = {};
    for (const anchor of anchors) {
      const destination = anchorDestinations.get(`${anchorSource}#${anchor}`);
      if (destination && destination !== target) mappings[anchor] = destination;
    }
    for (const [source, destination] of anchorDestinations)
      if (source.startsWith(`${old}#`) && destination !== target)
        mappings[source.slice(old.length + 1)] = destination;
    redirects.push({ from: old, to: target, anchors: mappings });
  }
  manifest.referencePages = [...groups.values()].map((group) => ({
    page: group.page,
    title: group.title,
    symbols: group.entries.map((entry) => entry.name),
    parent: group.parent?.page,
  }));
  manifest.compatibility = {
    version: baseline.version,
    pages: baseline.pages.length,
    anchors: baseline.pages.reduce((sum, page) => sum + page.anchors.length, 0),
  };
  generated.set("docs/api/redirects.json", JSON.stringify(redirects));
  generated.set(
    "docs/api/navigation.json",
    JSON.stringify(
      [...groups.values()]
        .filter((group) => !group.parent)
        .map((group) => ({ title: group.title, path: group.page })),
      null,
      2,
    ),
  );
  return { groups, destinations, anchorDestinations, rewrite };
}

export function generateTaskNavigation({ source, groups }) {
  const start = "    # api-nav:start";
  const end = "    # api-nav:end";
  if (!source.includes(start) || !source.includes(end))
    throw new Error("Zensical API navigation markers are missing");
  const sections = [
    ["玩法参考", "hoi4/"],
    ["界面参考", "ui/"],
    ["项目与工具", "project/"],
    ["编译与原生语法", /^(compiler|pdx|eslint)\//],
    ["原生内容", "domains/"],
  ];
  const lines = [start, '    { "公开模块" = "api/reference/index.md" },'];
  for (const [title, prefix] of sections) {
    lines.push(`    { ${JSON.stringify(title)} = [`);
    for (const group of groups.values()) {
      if (
        group.parent ||
        !(typeof prefix === "string" ? group.key.startsWith(prefix) : prefix.test(group.key))
      )
        continue;
      lines.push(
        `      { ${JSON.stringify(group.title)} = ${JSON.stringify(`api/${group.page}`)} },`,
      );
    }
    lines.push("    ] },");
  }
  lines.push(end);
  return (
    source.slice(0, source.indexOf(start)) +
    lines.join("\n") +
    source.slice(source.indexOf(end) + end.length)
  );
}
