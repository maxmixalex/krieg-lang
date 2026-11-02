import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { coverageIssues } from "../scripts/check-coverage.mjs";

const inventory = JSON.parse(
  fs.readFileSync(new URL("../docs/coverage-inventory.json", import.meta.url), "utf8"),
);
const manifest = JSON.parse(
  fs.readFileSync(new URL("../docs/api/manifest.json", import.meta.url), "utf8"),
);

test("published coverage claims point to public APIs, real guides and named executable evidence", () => {
  assert.deepEqual(coverageIssues(inventory, manifest), []);
  assert.ok(
    inventory.families.length >= 50,
    "retain the Wiki topic families, not just individual command counts",
  );
  for (const module of [
    "krieg-lang",
    "krieg-lang/hoi4",
    "krieg-lang/compiler",
    "krieg-lang/project",
    "krieg-lang/pdx",
    "krieg-lang/ui",
    "krieg-lang/ui/jsx-runtime",
    "krieg-lang/eslint",
  ]) {
    assert.ok(
      manifest.exports.some((entry) => entry.module === module),
      `missing public module ${module}`,
    );
  }
});

test("coverage gate refuses generic-wrapper semantic claims and nonexistent test evidence", () => {
  const falseClaim = structuredClone(inventory);
  falseClaim.families.find((entry) => entry.id === "events").api = ["krieg-lang/hoi4:DataFile"];
  assert.ok(
    coverageIssues(falseClaim, manifest).some((issue) =>
      issue.includes("generic DataFile/ordered PDX wrapper"),
    ),
  );
  const missingEvidence = structuredClone(inventory);
  missingEvidence.families.find((entry) => entry.id === "events").tests[0].test =
    "nonexistent coverage proof";
  assert.ok(
    coverageIssues(missingEvidence, manifest).some((issue) =>
      issue.includes("test does not exist"),
    ),
  );
});
