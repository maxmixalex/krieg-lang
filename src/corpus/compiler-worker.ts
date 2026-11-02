import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { compileProject } from "../compiler/index.js";
import { semanticPdx } from "../pdx/index.js";
import type { CorpusCompileInput, CorpusCompileResult } from "./index.js";

interface Job {
  files: CorpusCompileInput[];
  rootDir: string;
  resultPath: string;
}
const job = JSON.parse(readFileSync(process.argv[2], "utf8")) as Job;
const paths = job.files.map((file) => resolve(job.rootDir, file.sourcePath));
const result = compileProject({
  rootDir: job.rootDir,
  files: paths,
  sources: Object.fromEntries(job.files.map((file, i) => [paths[i], file.source])),
  maxExpansion: 20_000_000,
});
const results: CorpusCompileResult[] = job.files.map((file, i) => {
  const own = result.diagnostics.filter(
    (diagnostic) =>
      !diagnostic.file ||
      resolve(diagnostic.file) === paths[i] ||
      !paths.includes(resolve(diagnostic.file)),
  );
  const output = result.outputs.filter((out) => out.path === file.outputPath);
  if (output.length !== 1)
    return {
      sourcePath: file.sourcePath,
      success: false,
      diagnostics: [
        ...own,
        {
          code: "KRG_CORPUS_OUTPUT",
          message: `Expected one output ${file.outputPath}, received ${output.length}.`,
        },
      ],
    };
  const semanticHash = createHash("sha256")
    .update(JSON.stringify(semanticPdx(output[0].document)))
    .digest("hex");
  return {
    sourcePath: file.sourcePath,
    success: !own.some((d) => d.severity === "error"),
    diagnostics: own,
    semanticHash,
  };
});
writeFileSync(job.resultPath, JSON.stringify(results));
