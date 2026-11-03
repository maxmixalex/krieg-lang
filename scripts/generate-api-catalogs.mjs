import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

// Game data catalogs are metadata views; all public API signatures, fields,
// inheritance, examples and cross references are rendered by TypeDoc.
export function generateGameCatalogs({ root, manifest, generated, header }) {
  const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
  const parse = (file) => ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true);
  const schema = JSON.parse(read("src/schema/hoi4-schema.json"));
  const slug = (name) => name.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
  const escape = (value) => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
  // Use the actual generated declarations for callable command types. The CWT
  // projection supplies every overload's original name, scope and provenance.
  const commandFile = parse("src/sdk/commands.ts");
  const commandSignatures = new Map();
  for (const node of commandFile.statements) {
    if (
      !ts.isInterfaceDeclaration(node) ||
      !/^Generated.*(?:Effects|Triggers)$/.test(node.name.text)
    )
      continue;
    const kind = node.name.text.endsWith("Effects") ? "effect" : "trigger";
    for (const member of node.members) {
      if (!member.name) continue;
      const key = `${kind}:${member.name.text}`;
      const signatures = commandSignatures.get(key) ?? new Set();
      signatures.add(member.getText());
      commandSignatures.set(key, signatures);
    }
  }
  const buckets = ["a-c", "d-f", "g-i", "j-l", "m-o", "p-r", "s-u", "v-z"];
  const commandGroups = new Map();
  for (const rule of schema.commands) {
    if (!/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(rule.name)) continue;
    const key = `${rule.kind}:${rule.name}`;
    const rules = commandGroups.get(key) ?? [];
    rules.push(rule);
    commandGroups.set(key, rules);
  }
  const counts = { effect: 0, trigger: 0 };
  const commandIndex = [
    header,
    "# CWT 效果与条件目录",
    "",
    "本目录连接游戏原生命令名、SDK 的实际 TypeScript 签名、合法作用域和原始 CWT 位置。这里保留 `snake_case` 名称，例如 `country.effects.add_political_power(25)`；少量手工建模的易读别名另见 [作用域 API](../scopes.md)。",
    "",
    "CWT 版本固定在仓库快照；这些规则不等价于游戏引擎实现。动态键和重复条目用 `CwtNode` 表达，无法安全投射的表达式保留 `CwtOpaque`。",
    "",
    `来源：${schema.provenance.source}；SHA-256：\`${schema.provenance.sha256}\`；${schema.provenance.files} 个规则文件。`,
    "",
    "| 原生命令首字母 | 效果 | 条件 |",
    "| --- | --- | --- |",
  ];
  for (const bucket of buckets) {
    commandIndex.push(
      `| ${bucket.toUpperCase()} | [效果](effect-${bucket}.md) | [条件](trigger-${bucket}.md) |`,
    );
    for (const kind of ["effect", "trigger"]) {
      const entries = [...commandGroups]
        .filter(
          ([, rules]) =>
            rules[0].kind === kind &&
            rules[0].name[0].toLowerCase() >= bucket[0] &&
            rules[0].name[0].toLowerCase() <= bucket[2],
        )
        .sort(([a], [b]) => a.localeCompare(b, "en"));
      const lines = [
        header,
        `# ${kind === "effect" ? "效果" : "条件"} ${bucket.toUpperCase()}`,
        "",
        "[命令目录](index.md) · 签名由当前生成的 SDK 提取，说明及作用域来自 CWT。",
        "",
      ];
      for (const [key, rules] of entries) {
        const first = rules[0];
        counts[kind]++;
        manifest.commands.push({
          name: first.name,
          kind,
          page: `commands/${kind}-${bucket}.md#${slug(first.name)}`,
          overloads: rules.length,
        });
        lines.push(
          `## ${first.name}`,
          "",
          ...[...new Set(rules.map((rule) => rule.description).filter(Boolean))].map(
            (description) => description.replaceAll("\n", " "),
          ),
          "",
          `作用域：${[...new Set(rules.flatMap((rule) => rule.scopes))].map((scope) => `\`${scope}\``).join("、")}`,
          "",
          "```ts",
          [...(commandSignatures.get(key) ?? [])].join("\n"),
          "```",
          "",
          "CWT 来源：",
        );
        for (const rule of rules)
          lines.push(
            `- [${rule.source}:${rule.line}](https://github.com/cwtools/cwtools-hoi4-config/blob/master/${rule.source}#L${rule.line})${rule.pushScope ? `；进入 \`${rule.pushScope}\` 作用域` : ""}`,
          );
        lines.push("");
        if (!commandSignatures.has(key))
          throw new Error(`CWT command has no SDK declaration: ${key}`);
      }
      if (!entries.length) lines.push("此字母段没有固定名称的命令。", "");
      generated.set(`docs/api/commands/${kind}-${bucket}.md`, lines.join("\n"));
    }
  }
  commandIndex.push(
    "",
    `共 ${counts.effect} 个效果名、${counts.trigger} 个条件名。一个名称可能有多个 CWT 重载，目录不会将重载误计为额外命令。`,
    "",
  );
  generated.set("docs/api/commands/index.md", commandIndex.join("\n"));

  const domains = JSON.parse(read("src/schema/hoi4-domains.json"));
  const lookup = (name) => {
    const entry = manifest.exports.find(
      (item) => item.module === "krieg-lang/hoi4" && item.name === name,
    );
    if (!entry) throw new Error(`Catalog has no public API: ${name}`);
    return entry.page;
  };
  const categories = [
    [
      "事件、国策、决议与政治",
      /Event|Focus|Decision|Ideas|Ideology|Autonomy|BalanceOfPower|Country|Character|Cosmetic|Opinion|GameRule/,
    ],
    [
      "科研、工业、装备与作战",
      /Technology|Doctrine|Equipment|Unit|Division|Ship|Military|Mio|Special|Scientist|Raid|Combat|Ace|Ability|Resource|Building/,
    ],
    ["情报、阵营与和平", /Intelligence|Operation|Occupation|Faction|Peace|WarGoal|Resistance/],
    ["地图、历史与环境", /Map|Terrain|Weather|Climate|Supply|Strategic|Adjacency|Region/],
    [
      "图形、字体、音乐与声音",
      /Sprite|Graphic|Font|Light|Mesh|Entity|Animation|Particle|Portrait|Music|Sound/,
    ],
    ["AI、规则与其他定义", /.*/],
  ];
  const groups = new Map(categories.map(([name]) => [name, []]));
  for (const entry of Object.entries(domains.definitions).sort(([a], [b]) =>
    a.localeCompare(b, "en"),
  )) {
    const group = entry[0].startsWith("Ai")
      ? "AI、规则与其他定义"
      : categories.find(([, pattern]) => pattern.test(entry[0]))[0];
    groups.get(group).push(entry);
  }
  const domainLines = [
    header,
    "# 原生内容领域目录",
    "",
    "从要生成的游戏文件找到构造器，再进入 Spec 查看完整字段。TypeDoc 会保留字段类型、继承、可选性与交叉链接；嵌套字段点击其类型即可继续查看。",
    "",
    "[常用玩法 API](../typed-gameplay.md) · [领域写作指南](../content-domains.md) · [支持层次](../coverage.md)",
    "",
    "## 按内容查找",
    "",
  ];
  for (const [title, entries] of groups) {
    if (!entries.length) continue;
    domainLines.push(
      `### ${title}`,
      "",
      "| 构造器 | 字段规格 | 输出目录 | CWT 来源 |",
      "| --- | --- | --- | --- |",
    );
    for (const [name, value] of entries)
      domainLines.push(
        `| [\`${name}\`](${lookup(name)}) | [\`${name}Spec\`](${lookup(`${name}Spec`)}) | \`${value.folder}\` | [${value.source}:${value.line}](https://github.com/cwtools/cwtools-hoi4-config/blob/master/Config/${value.source}#L${value.line}) |`,
      );
    domainLines.push("");
  }
  domainLines.push(
    "## 规则来源与投射边界",
    "",
    `来源：${domains.provenance.source}；SHA-256：\`${domains.provenance.sha256}\`。`,
    "",
    ...domains.limitations.map((value) => `- ${value}`),
    "",
  );
  generated.set("docs/api/domains.md", domainLines.join("\n"));
  manifest.domains = {
    provenance: domains.provenance,
    definitions: Object.keys(domains.definitions),
    limitations: domains.limitations,
  };

  const defines = parse("src/sdk/defines.ts");
  const declaration = defines.statements.find(
    (node) => ts.isInterfaceDeclaration(node) && node.name.text === "DefineOverrides",
  );
  if (!declaration) throw new Error("DefineOverrides declaration is missing");
  const defineIndex = [
    header,
    "# Lua Defines 命名空间",
    "",
    "只列出字段名与实际 TypeScript 值类型；所有字段可选，只填写需要覆盖的值。",
    "",
    "[Defines / DefineFile](../defines.md) · [完整 DefineOverrides 类型](../" +
      lookup("DefineOverrides") +
      ")",
    "",
    "| Lua 根 | 命名空间 | 键数量 |",
    "| --- | --- | --- |",
  ];
  for (const rootNode of declaration.members) {
    for (const namespace of rootNode.type.members) {
      const rootName = rootNode.name.text;
      const namespaceName = namespace.name.text;
      const filename = `${slug(rootName)}-${slug(namespaceName)}.md`;
      defineIndex.push(
        `| \`${rootName}\` | [${namespaceName}](${filename}) | ${namespace.type.members.length} |`,
      );
      const lines = [
        header,
        `# ${rootName}.${namespaceName}`,
        "",
        "[全部命名空间](namespaces.md) · [如何生成 Defines](../defines.md)",
        "",
        "| 键 | TypeScript 类型 |",
        "| --- | --- |",
        ...namespace.type.members.map(
          (member) =>
            `| <a id="${slug(member.name.text)}"></a> \`${member.name.text}\` | \`${escape(member.type.getText())}\` |`,
        ),
        "",
      ];
      generated.set(`docs/api/defines/${filename}`, lines.join("\n"));
    }
  }
  generated.set("docs/api/defines/namespaces.md", defineIndex.join("\n") + "\n");
}
