import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { compileProject } from "../compiler/index.js";
import type { CompileOptions, CompileResult } from "../compiler/types.js";

/** Entry modules are independent; TypeScript still loads each entry's imports. */
export function* compileProjectChunks(options: CompileOptions): Generator<CompileResult> {
  const size = (file: string): number =>
    options.sources?.[file] === undefined
      ? statSync(file).size
      : Buffer.byteLength(options.sources[file]);
  const total = options.files.reduce((n, file) => n + size(file), 0);
  if (total < 4 * 1024 * 1024 && options.files.length <= 50) {
    yield compileProject(options);
    return;
  }
  let chunk: string[] = [],
    bytes = 0;
  for (const file of options.files) {
    const length = size(file);
    if (chunk.length && (chunk.length >= 50 || bytes + length > 8 * 1024 * 1024)) {
      yield isolated({
        ...options,
        files: chunk,
        maxExpansion: options.maxExpansion ?? 20_000_000,
      });
      chunk = [];
      bytes = 0;
    }
    chunk.push(file);
    bytes += length;
  }
  if (chunk.length)
    yield isolated({ ...options, files: chunk, maxExpansion: options.maxExpansion ?? 20_000_000 });
}

function isolated(options: CompileOptions): CompileResult {
  const temp = mkdtempSync(join(tmpdir(), "krieg-build-compiler-"));
  const resultPath = join(temp, "result.json"),
    jobPath = join(temp, "job.json");
  try {
    writeFileSync(jobPath, JSON.stringify({ options, resultPath }));
    const child = spawnSync(
      process.execPath,
      [
        "--max-old-space-size=5632",
        fileURLToPath(new URL("./compiler-worker.js", import.meta.url)),
        jobPath,
      ],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1024 * 1024 },
    );
    if (child.error || child.status !== 0)
      return {
        success: false,
        outputs: [],
        diagnostics: [
          {
            code: "KRG_COMPILER_PROCESS",
            severity: "error",
            message: `Compiler batch failed: ${child.error?.message ?? child.stderr ?? `exit ${child.status}`}`,
          },
        ],
      };
    return JSON.parse(readFileSync(resultPath, "utf8")) as CompileResult;
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}
