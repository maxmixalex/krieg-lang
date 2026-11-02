import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { CorpusCompileInput, CorpusCompileResult } from "./index.js";

const corpusRuntimeGuard = "KRIEG_CORPUS_RUNTIME_REEXEC";
const heapOption =
  /^--(?:max[-_]old[-_]space[-_]size(?:[-_]percentage)?|max[-_]heap[-_]size)(?:=|$)/;
const environmentHeapOption =
  /(?:^|[\s"'])--(?:max[-_]old[-_]space[-_]size(?:[-_]percentage)?|max[-_]heap[-_]size)(?:=|[\s"']|$)/;

/** Preserve explicit Node heap choices while supplying the measured corpus defaults. */
export function corpusRuntimeArguments(
  execArgv: readonly string[],
  nodeOptions: string | undefined,
  gcExposed: boolean,
): string[] | undefined {
  const hasHeap =
    execArgv.some((argument) => heapOption.test(argument)) ||
    environmentHeapOption.test(nodeOptions ?? "");
  if (hasHeap && gcExposed) return undefined;
  return [
    ...execArgv,
    ...(!gcExposed ? ["--expose-gc"] : []),
    ...(!hasHeap ? ["--max-old-space-size=3072"] : []),
  ];
}

export interface CorpusRuntimeExit {
  code: number | null;
  signal: NodeJS.Signals | null;
}

/** Relaunch only the corpus CLI; no shell or authored source is evaluated. */
export async function ensureCorpusRuntime(
  entrypoint: string,
  argv: readonly string[],
): Promise<CorpusRuntimeExit | undefined> {
  const execArgv = corpusRuntimeArguments(
    process.execArgv,
    process.env.NODE_OPTIONS,
    typeof global.gc === "function",
  );
  if (!execArgv) return undefined;
  if (process.env[corpusRuntimeGuard] === "1")
    throw new Error(
      "The corpus runtime could not expose garbage collection after relaunch. Check conflicting Node/V8 flags.",
    );
  return new Promise<CorpusRuntimeExit>((resolve, reject) => {
    const child = spawn(process.execPath, [...execArgv, entrypoint, ...argv], {
      stdio: "inherit",
      env: { ...process.env, [corpusRuntimeGuard]: "1" },
    });
    const interrupt = () => child.kill("SIGINT");
    const terminate = () => child.kill("SIGTERM");
    const cleanup = () => {
      process.off("SIGINT", interrupt);
      process.off("SIGTERM", terminate);
    };
    process.on("SIGINT", interrupt);
    process.on("SIGTERM", terminate);
    child.once("error", (error) => {
      cleanup();
      reject(error);
    });
    child.once("close", (code, signal) => {
      cleanup();
      resolve({ code, signal });
    });
  });
}

/** The worker runs the compiler, never authored source. Recycling bounds TS heap use. */
export async function compileCorpusBatch(
  files: CorpusCompileInput[],
): Promise<CorpusCompileResult[]> {
  // Collect dead parent-side ASTs before allocating a job and starting its worker.
  // The corpus CLI exposes GC; embedded callers without it still work normally.
  global.gc?.();
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
