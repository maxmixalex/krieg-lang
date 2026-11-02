import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { CorpusCompileInput, CorpusCompileResult } from "./index.js";

/** The worker runs the compiler, never authored source. Recycling bounds TS heap use. */
export async function compileCorpusBatch(
  files: CorpusCompileInput[],
): Promise<CorpusCompileResult[]> {
  const work = mkdtempSync(join(tmpdir(), "krieg-corpus-ts-"));
  const jobPath = join(work, "job.json"),
    resultPath = join(work, "result.json");
  writeFileSync(jobPath, JSON.stringify({ files, rootDir: work, resultPath }));
  try {
    const outcome = await new Promise<{ code: number | null; stderr: string }>((done, reject) => {
      const child = spawn(
        process.execPath,
        [
          "--max-old-space-size=5632",
          fileURLToPath(new URL("./compiler-worker.js", import.meta.url)),
          jobPath,
        ],
        { stdio: ["ignore", "ignore", "pipe"] },
      );
      let stderr = "";
      child.stderr.on("data", (buffer: Buffer) => {
        stderr = (stderr + buffer.toString()).slice(-12000);
      });
      child.once("error", reject);
      child.once("close", (code) => done({ code, stderr }));
    });
    if (outcome.code !== 0) {
      // A failed large batch is retried in smaller independent compiler programs.
      if (files.length > 1) {
        const middle = Math.ceil(files.length / 2);
        return [
          ...(await compileCorpusBatch(files.slice(0, middle))),
          ...(await compileCorpusBatch(files.slice(middle))),
        ];
      }
      return files.map((file) => ({
        sourcePath: file.sourcePath,
        success: false,
        diagnostics: [
          {
            code: "KRG_CORPUS_COMPILER_PROCESS",
            message: `TypeScript compiler worker exited ${outcome.code}: ${outcome.stderr}`,
          },
        ],
      }));
    }
    return JSON.parse(readFileSync(resultPath, "utf8")) as CorpusCompileResult[];
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}
