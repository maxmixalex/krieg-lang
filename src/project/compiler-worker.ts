import { readFileSync, writeFileSync } from "node:fs";
import { compileProject } from "../compiler/index.js";
import type { CompileOptions } from "../compiler/types.js";

const job = JSON.parse(readFileSync(process.argv[2], "utf8")) as {
  options: CompileOptions;
  resultPath: string;
};
// This executes the trusted compiler only. Project sources are AST input data.
const result = compileProject(job.options);
writeFileSync(job.resultPath, JSON.stringify(result));
