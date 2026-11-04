import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { compileSource } from "../dist/compiler/index.js";
import { topics } from "./api-topics.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
let checked = 0;
for (const [key, topic] of Object.entries(topics)) {
  if (!topic.example) continue;
  if (/^(hoi4|ui)\//.test(key)) {
    const result = compileSource(topic.example, {
      fileName: `${key.replaceAll("/", "-")}.krg.${topic.language === "tsx" ? "tsx" : "ts"}`,
    });
    if (!result.success)
      throw new Error(`${key}: ${result.diagnostics.map((item) => item.message).join("\n")}`);
  } else {
    const filename = path.join(root, `api-example-${key.replaceAll("/", "-")}.ts`);
    const options = {
      noEmit: true,
      strict: true,
      skipLibCheck: true,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
    };
    const host = ts.createCompilerHost(options);
    const original = host.getSourceFile.bind(host);
    host.getSourceFile = (file, languageVersion, onError, shouldCreateNewSourceFile) =>
      file === filename
        ? ts.createSourceFile(file, topic.example, languageVersion, true)
        : original(file, languageVersion, onError, shouldCreateNewSourceFile);
    const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([filename], options, host));
    if (diagnostics.length)
      throw new Error(
        `${key}: ${diagnostics.map((item) => ts.flattenDiagnosticMessageText(item.messageText, "\n")).join("\n")}`,
      );
  }
  checked++;
}
console.log(`Verified ${checked} task-reference examples against the current public API.`);

let guideExamples = 0;
const guideRoot = path.join(root, "docs/guide");
for (const page of fs.readdirSync(guideRoot, { recursive: true }).sort()) {
  if (!page.endsWith(".md")) continue;
  const source = fs.readFileSync(path.join(guideRoot, page), "utf8");
  const examples = source.matchAll(
    /<!-- example:compile -->\s*```(typescript|tsx)\n([\s\S]*?)\n```/g,
  );
  for (const [index, example] of [...examples].entries()) {
    const result = compileSource(example[2], {
      fileName: `${page.replaceAll(path.sep, "-")}-${index}.krg.${example[1] === "tsx" ? "tsx" : "ts"}`,
    });
    if (!result.success)
      throw new Error(
        `${page} example ${index + 1}: ${result.diagnostics.map((item) => item.message).join("\n")}`,
      );
    guideExamples++;
  }
}
if (!guideExamples) throw new Error("No marked guide examples found");
console.log(`Verified ${guideExamples} complete guide examples from published Markdown.`);
