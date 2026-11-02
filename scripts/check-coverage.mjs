import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import prettier from "prettier";

const root = fileURLToPath(new URL("../", import.meta.url));
const labels = {
  semantic: "语义 API",
  schema: "CWT 结构校验",
  "native-ordered": "有序原生结构",
  "native-asset": "原生文件工作流",
  hardcoded: "游戏硬编码",
  "version-conditional": "版本条件",
  "not-applicable": "非编译内容",
};
const generic = new Set(["DataFile", "SourceFile", "file", "document", "property", "block"]);
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
function testNames(file) {
  const names = new Set();
  const source = ts.createSourceFile(
    file,
    read(file),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(source) === "test" &&
      node.arguments[0] &&
      ts.isStringLiteralLike(node.arguments[0])
    )
      names.add(node.arguments[0].text);
    ts.forEachChild(node, visit);
  }
  visit(source);
  return names;
}

/** Check evidence links as well as the distinction between semantic and native support. */
export function coverageIssues(inventory, manifest) {
  const issues = [];
  const identities = new Set();
  const exports = new Set(manifest.exports.map((entry) => `${entry.module}:${entry.name}`));
  const tests = new Map();
  for (const family of inventory.families) {
    const report = (message) => issues.push(`${family.id}: ${message}`);
    if (identities.has(family.id)) report("duplicate family ID");
    identities.add(family.id);
    if (!labels[family.level]) report(`unknown support level ${family.level}`);
    if (!family.topic || !family.boundary || !family.group)
      report("topic, group and explicit boundary are required");
    if (
      !family.wiki.length ||
      family.wiki.some((url) => !url.startsWith("https://hoi4.paradoxwikis.com/"))
    )
      report("canonical official Wiki topic links are required");
    if (!fs.existsSync(path.join(root, "docs", family.guide)))
      report(`guide does not exist: ${family.guide}`);
    for (const symbol of family.api)
      if (!exports.has(symbol)) report(`public export does not exist: ${symbol}`);
    if (
      ["semantic", "schema"].includes(family.level) &&
      !family.api.some((entry) => !generic.has(entry.split(":").at(-1)))
    )
      report("a generic DataFile/ordered PDX wrapper cannot establish semantic or schema support");
    if (family.level === "schema" && !family.ruleSources.length)
      report("schema support requires named CWT rule provenance");
    if (
      !["hardcoded", "not-applicable"].includes(family.level) &&
      (!family.tests.length || !family.nativePaths.length || !family.api.length)
    )
      report(
        "implemented/native/versioned content requires APIs, native paths and executable test evidence",
      );
    if (family.nativeAudit?.length) {
      const audit = JSON.parse(read("reports/validation/domain-native-audit.json"));
      for (const name of family.nativeAudit) {
        const result = audit.domains[name];
        if (!family.api.some((api) => api.endsWith(`:${name}`)))
          report(`native audit ${name} is not a listed API`);
        if (
          !result?.nativeCwt.passed ||
          !result?.ruleMatch.passed ||
          result.nativeCwt.diagnostics.length
        )
          report(`native audit has no reviewed positive/negative evidence for ${name}`);
        if (result && result.originalRuleMatch.passed === false && !result.ruleCorrections.length)
          report(`unexplained original rule mismatch for ${name}`);
        if (result && result.engineValidation !== "not-run")
          report(`unexpected engine claim for ${name}`);
      }
    }
    for (const evidence of family.tests) {
      if (!fs.existsSync(path.join(root, evidence.file))) {
        report(`test file does not exist: ${evidence.file}`);
        continue;
      }
      if (!tests.has(evidence.file)) tests.set(evidence.file, testNames(evidence.file));
      if (!tests.get(evidence.file).has(evidence.test))
        report(`test does not exist: ${evidence.file} :: ${evidence.test}`);
    }
  }
  return issues;
}

function table(inventory, manifest) {
  const publicLinks = new Map(
    manifest.exports.map((entry) => [`${entry.module}:${entry.name}`, `api/${entry.page}`]),
  );
  const lines = [];
  const safe = (value) => value.replaceAll("|", "\\|").replaceAll("\n", " ");
  for (const group of [...new Set(inventory.families.map((entry) => entry.group))]) {
    lines.push(
      `## ${group}`,
      "",
      "| Wiki 主题 | 当前入口与层次 | 原生位置 | 验证边界 |",
      "| --- | --- | --- | --- |",
    );
    for (const family of inventory.families.filter((entry) => entry.group === group)) {
      const apis = family.api
        .map((item) => `[\`${item.split(":").at(-1)}\`](${publicLinks.get(item)})`)
        .join("、");
      const paths = family.nativePaths.map((item) => `\`${item}\``).join("；");
      lines.push(
        `| [${family.topic}](${family.wiki[0]}) | **${labels[family.level]}**${apis ? `：${apis}` : ""}；[指南](${family.guide}) | ${paths || "—"} | ${safe(family.boundary)} |`,
      );
    }
    lines.push("");
  }
  return lines.join("\n");
}

async function main() {
  const inventory = JSON.parse(read("docs/coverage-inventory.json"));
  const manifest = JSON.parse(read("docs/api/manifest.json"));
  const issues = coverageIssues(inventory, manifest);
  const page = read("docs/coverage.md");
  const start = "<!-- coverage:start -->";
  const end = "<!-- coverage:end -->";
  if (!page.includes(start) || !page.includes(end))
    issues.push("coverage.md is missing generated-table markers");
  const source =
    page.slice(0, page.indexOf(start) + start.length) +
    "\n\n" +
    table(inventory, manifest) +
    "\n" +
    page.slice(page.indexOf(end));
  const options = JSON.parse(read(".prettierrc.json"));
  const content = await prettier.format(source, { ...options, filepath: "docs/coverage.md" });
  if (process.argv.includes("--write") && !issues.length)
    fs.writeFileSync(path.join(root, "docs/coverage.md"), content);
  else if (page !== content)
    issues.push("coverage.md table is stale; run node scripts/check-coverage.mjs --write");
  if (issues.length) {
    console.error(issues.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      `Checked ${inventory.families.length} topic families, public API links, native paths, guides and named test evidence.`,
    );
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await main();
