import assert from "node:assert/strict";
import { cpSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, basename } from "node:path";
import { createHash } from "node:crypto";
import { comparePdxSemantic, emitPdx, parsePdx } from "../../dist/pdx/index.js";

// The supplied CWTools executable silently excludes larger files from discovery.
// Its limit was reproduced with valid scripts immediately below/above 2 MiB.
export const cwtoolsFileLimit = 2 * 1024 * 1024;
const hash = (source) => createHash("sha256").update(source).digest("hex");
export function oversizedFiles(root) {
  return readdirSync(root, { recursive: true })
    .filter((file) => /\.(txt|gui|gfx|asset|yml)$/i.test(file))
    .map((file) => ({ path: file.replaceAll("\\", "/"), bytes: statSync(join(root, file)).size }))
    .filter((file) => file.bytes > cwtoolsFileLimit)
    .sort((a, b) => a.path.localeCompare(b.path));
}

/** Only temporary validation copies are changed. Source projects and builds stay intact. */
export function prepareCwtoolsInputs(root, destination) {
  cpSync(root, destination, { recursive: true });
  const changes = [];
  for (const file of oversizedFiles(root)) {
    const source = readFileSync(join(root, file.path), "utf8");
    const chunks = [];
    let current = "";
    let currentBytes = 0;
    let header = "";
    let pieces;
    if (file.path.endsWith(".yml")) {
      const lines = source.replace(/^\uFEFF/, "").split(/\r?\n/);
      assert.match(lines[0], /^l_[a-z_]+:\s*$/, `${file.path}: unsupported localisation header`);
      header = `\uFEFF${lines[0]}\n`;
      pieces = lines.slice(1).map((line) => `${line}\n`);
    } else {
      const parsed = parsePdx(source);
      assert.equal(parsed.diagnostics.length, 0, `${file.path}: PDX parse diagnostics`);
      pieces = parsed.document.items.map((item) =>
        emitPdx({ items: [item] }, { indent: "", newline: " " }),
      );
      const rebuilt = parsePdx(pieces.join("\n"));
      assert.equal(rebuilt.diagnostics.length, 0, `${file.path}: compact PDX diagnostics`);
      assert.equal(comparePdxSemantic(parsed.document, rebuilt.document), true, file.path);
    }
    const limit = cwtoolsFileLimit - Buffer.byteLength(header) - 1024;
    for (const piece of pieces) {
      const bytes = Buffer.byteLength(piece);
      assert.ok(bytes <= limit, `${file.path}: one definition exceeds the checker file limit`);
      if (currentBytes + bytes > limit) {
        chunks.push(current);
        current = "";
        currentBytes = 0;
      }
      current += piece;
      currentBytes += bytes;
    }
    if (current) chunks.push(current);
    assert.equal(chunks.join(""), pieces.join(""), `${file.path}: split content changed`);
    const extension = extname(file.path);
    const stem = basename(file.path, extension);
    const outputs = chunks.map((chunk, index) => {
      const suffix = String(index + 1).padStart(3, "0");
      const name = file.path.endsWith(".yml")
        ? `${stem.replace(/_l_[a-z_]+$/, "")}_cwaudit_${suffix}${stem.match(/_l_[a-z_]+$/)?.[0] ?? ""}${extension}`
        : `${stem}_cwaudit_${suffix}${extension}`;
      const relative = join(dirname(file.path), name);
      const text = header + chunk;
      writeFileSync(join(destination, relative), text);
      return {
        path: relative.replaceAll("\\", "/"),
        bytes: Buffer.byteLength(text),
        sha256: hash(text),
      };
    });
    rmSync(join(destination, file.path));
    changes.push({ ...file, sha256: hash(source), outputs });
  }
  assert.equal(oversizedFiles(destination).length, 0);
  return changes;
}
