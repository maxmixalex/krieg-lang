import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import test from "node:test";
import { compileProject, compileSource, renderFocusTreeMermaid } from "../dist/compiler/index.js";
import { normalizeFocusGraph } from "../dist/compiler/gameplay.js";
import { comparePdxSemantic, emitPdx, parsePdx } from "../dist/pdx/index.js";
import { buildProject, writeEditorProject } from "../dist/project/index.js";
import { editorService } from "./support/editor-service.mjs";

const imports =
  "import {FocusGraph,FocusNodes,ScriptedEffect,type FocusNodeKey} from 'krieg-lang/hoi4';";

function compile(source) {
  const result = compileSource(`${imports}\n${source}`);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  return result.outputs;
}

function reject(source, code) {
  const result = compileSource(`${imports}\n${source}`);
  assert.equal(result.success, false, "Expected a checked focus graph failure");
  assert.deepEqual(result.outputs, [], "Invalid graphs cannot leave partial output");
  assert.ok(
    result.diagnostics.some((entry) => entry.code === code),
    JSON.stringify(result.diagnostics),
  );
}

function property(block, key) {
  return block.items.filter((item) => item.kind === "property" && item.key.text === key);
}

test("the Chinese guide compiles and its checked-in static preview matches actual native output", () => {
  const guide = readFileSync("docs/typed-gameplay.md", "utf8");
  const source = guide.match(/```typescript\n([\s\S]*?)\n```/)[1];
  const result = compileSource(source);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  const output = result.outputs.find((file) => file.path.startsWith("common/national_focus/"));
  const diagram = renderFocusTreeMermaid(output.document, "reconstruction_tree");
  assert.equal(readFileSync("docs/assets/focus-authoring.mmd", "utf8"), diagram);
  const svg = readFileSync("docs/assets/focus-authoring.svg", "utf8");
  assert.ok(svg.includes(createHash("sha256").update(diagram).digest("hex")));
  assert.match(svg, /<svg /);
  for (const text of ["REC_industry", "REC_relief", "OR", "AND", "exclusive"])
    assert.ok(svg.includes(text), text);
  assert.doesNotMatch(svg, /<script\b|<foreignObject\b/);
});

test("local selectors describe a choice, independent development and AND/OR convergence with exact native semantics", () => {
  const [output] = compile(`
    export const tree=FocusGraph({id:'reconstruction',prefix:'REC',nodes:{
      charter:{cost:3},
      industry:{requires:f=>f.charter,exclusiveWith:f=>f.relief,cost:5},
      relief:{requires:f=>f.charter,cost:5},
      assembly:{requires:f=>({any:[f.industry,f.relief]}),cost:5},
      trade:{requires:f=>f.charter,cost:3},
      congress:{requires:f=>({all:[f.assembly,f.trade]}),cost:5}
    }});`);
  const expected = parsePdx(`focus_tree={id=reconstruction country={factor=1}
    focus={id=REC_charter x=0 y=0 cost=3}
    focus={id=REC_industry x=0 y=1 cost=5 prerequisite={focus=REC_charter} mutually_exclusive={focus=REC_relief}}
    focus={id=REC_relief x=2 y=1 cost=5 prerequisite={focus=REC_charter} mutually_exclusive={focus=REC_industry}}
    focus={id=REC_assembly x=0 y=2 cost=5 prerequisite={focus=REC_industry focus=REC_relief}}
    focus={id=REC_trade x=4 y=1 cost=3 prerequisite={focus=REC_charter}}
    focus={id=REC_congress x=0 y=3 cost=5 prerequisite={focus=REC_assembly} prerequisite={focus=REC_trade}}
  }`);
  assert.deepEqual(expected.diagnostics, []);
  assert.ok(comparePdxSemantic(output.document, expected.document), emitPdx(output.document));
  const [legacy] = compile(`FocusGraph({id:'reconstruction',prefix:'REC',nodes:{
    charter:{cost:3},industry:{cost:5},relief:{cost:5},assembly:{cost:5},trade:{cost:3},congress:{cost:5}
  },sequences:[['charter','industry'],['charter','relief'],['charter','trade']],
    choices:[['industry','relief']],joins:[{to:'assembly',any:['industry','relief']},{to:'congress',all:['assembly','trade']}]});`);
  assert.ok(comparePdxSemantic(output.document, legacy.document));
});

test("nested alternatives preserve boolean semantics for every completion combination", () => {
  const [output] = compile(`FocusGraph({id:'nested',nodes:{
    a:{},b:{},c:{},d:{},
    finish:{requires:f=>({any:[{all:[f.a,f.b]},{all:[f.c,f.d]}]})},
    absorbed:{requires:f=>({any:[f.a,{all:[f.a,f.b]}]})}
  }});`);
  const tree = property(output.document, "focus_tree")[0].value;
  const nodes = new Map(
    property(tree, "focus").map(({ value }) => [property(value, "id")[0].value.text, value]),
  );
  const groups = (name) =>
    property(nodes.get(name), "prerequisite").map(({ value }) =>
      property(value, "focus").map((item) => item.value.text),
    );
  assert.deepEqual(groups("nested_finish"), [
    ["nested_a", "nested_c"],
    ["nested_a", "nested_d"],
    ["nested_b", "nested_c"],
    ["nested_b", "nested_d"],
  ]);
  assert.deepEqual(groups("nested_absorbed"), [["nested_a"]]);
  for (let mask = 0; mask < 16; mask++) {
    const completed = new Set(
      ["a", "b", "c", "d"].filter((_, index) => mask & (1 << index)).map((key) => `nested_${key}`),
    );
    const native = groups("nested_finish").every((group) =>
      group.some((key) => completed.has(key)),
    );
    assert.equal(
      native,
      Boolean((mask & 1 && mask & 2) || (mask & 4 && mask & 8)),
      `completed mask ${mask}`,
    );
  }
});

test("FocusNodes modules retain internal selectors across files, bind inputs and acquire each graph's prefix", () => {
  const result = compileProject({
    rootDir: "/virtual/focus-modules",
    files: ["main.krg.ts"],
    sources: {
      "infrastructure.krg.ts": `import {FocusNodes,type EventDefinition} from 'krieg-lang/hoi4';
      export function infrastructure(report:EventDefinition<'country'>){return FocusNodes({
        charter:{cost:3},harbour:{requires:f=>f.charter,completionReward:c=>c.schedule(report,{days:1})}
      });}`,
      "main.krg.ts": `${imports}import {CountryEvent} from 'krieg-lang/hoi4';
      import {infrastructure} from './infrastructure.krg.js';
      const report=CountryEvent({id:'module.1',hidden:true});
      const module=infrastructure(report);
      export const north=FocusGraph({id:'north',prefix:'NOR',nodes:{...module,
        bonds:{requires:f=>f.charter},congress:{requires:f=>({all:[f.harbour,f.bonds]})}
      }});
      export const south=FocusGraph({id:'south',prefix:'SOU',nodes:module});
      export const reward=ScriptedEffect('reward',c=>c.completeFocus(north.focuses.congress));`,
    },
  });
  assert.equal(result.success, true, JSON.stringify(result.diagnostics));
  assert.equal(result.outputs.length, 4);
  const native = result.outputs.map((output) => emitPdx(output.document)).join("\n");
  for (const id of ["NOR_charter", "NOR_harbour", "SOU_charter", "SOU_harbour"])
    assert.match(native, new RegExp(`id = ${id}`));
  assert.match(native, /complete_national_focus = NOR_congress/);
  assert.equal((native.match(/country_event = \{/g) ?? []).length, 3);
  assert.deepEqual(compile(`export const module=FocusNodes({a:{},b:{requires:f=>f.a}});`), []);
});

test("local rules coexist with legacy edges and preserve compatible node specifications", () => {
  const [output] = compile(`
    const root:import('krieg-lang/hoi4').FocusNodeSpec={cost:3};
    FocusGraph({id:'mixed',nodes:{root,child:{requires:f=>f.root},end:{requires:f=>f.child}},
      sequences:[['root','child']],joins:[{to:'end',all:['root']}]});`);
  const native = emitPdx(output.document);
  assert.equal((native.match(/focus = mixed_root/g) ?? []).length, 2);
  assert.equal((native.match(/focus = mixed_child/g) ?? []).length, 1);
});

test("node-local rules reject cycles, self-exclusion, impossible alternatives and forged local keys", () => {
  reject(`FocusGraph({id:'bad',nodes:{a:{requires:f=>f.b},b:{requires:f=>f.a}}});`, "KRG2603");
  reject(`FocusGraph({id:'bad',nodes:{a:{exclusiveWith:f=>f.a}}});`, "KRG2603");
  reject(
    `FocusGraph({id:'bad',nodes:{a:{exclusiveWith:f=>[f.b,f.c]},b:{},c:{},
    end:{requires:f=>({all:[f.a,{any:[f.b,f.c]}]})}}});`,
    "KRG2604",
  );
  assert.throws(
    () =>
      normalizeFocusGraph({ id: "bad", nodes: { a: {}, b: { requires: true } } }, () => ({
        _krg: "focus-node-key",
        key: "a",
      })),
    (error) => error.code === "KRG2602",
  );
  reject(`FocusGraph({id:'bad',nodes:{a:{},b:{exclusiveWith:f=>[f.a,f.a]}}});`, "KRG2601");
  reject(
    `FocusGraph({id:'one',prefix:'DUP',nodes:{a:{},b:{requires:f=>f.a}}});
    FocusGraph({id:'two',prefix:'DUP',nodes:{a:{}}});`,
    "KRG2607",
  );
});

test("OR alternatives can keep exclusive branches viable without imposing a single active state", () => {
  const [output] = compile(`FocusGraph({id:'viable',nodes:{
    a:{exclusiveWith:f=>f.b},b:{},c:{},
    alternatives:{requires:f=>({any:[{all:[f.a,f.b]},f.c]})},
    independent:{requires:f=>({all:[f.c,{any:[f.a,f.b]}]})}
  }});`);
  const native = emitPdx(output.document);
  assert.match(native, /id = viable_alternatives/);
  assert.match(native, /id = viable_independent/);
});

test("nested prerequisite expansion has a checked diagnostic instead of unbounded output", () => {
  const nodes = Array.from({ length: 18 }, (_, i) => `n${i}:{}`).join(",");
  const groups = Array.from({ length: 9 }, (_, i) => `{all:[f.n${i * 2},f.n${i * 2 + 1}]}`).join(
    ",",
  );
  reject(
    `FocusGraph({id:'bounded',nodes:{${nodes},finish:{requires:f=>({any:[${groups}]})}}});`,
    "KRG2610",
  );
});

function project(t, source) {
  const root = mkdtempSync(join(tmpdir(), "krieg-focus-author-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (file, text) => {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), text);
  };
  write("krgconfig.json", JSON.stringify({ name: "focus-author", outDir: "build/mod" }));
  write("package.json", JSON.stringify({ name: "focus-author", version: "1.0.0", type: "module" }));
  write("src/main.krg.ts", `${imports}\n${source}`);
  write(
    "tsconfig.json",
    JSON.stringify({ extends: "./.krieg/tsconfig.json", include: ["src/**/*.krg.ts"] }),
  );
  writeEditorProject(root);
  return { root, write };
}

function tsc(root) {
  return spawnSync(
    process.execPath,
    [
      resolve("node_modules/typescript/bin/tsc"),
      "--noEmit",
      "--pretty",
      "false",
      "--project",
      join(root, "tsconfig.json"),
    ],
    { encoding: "utf8" },
  );
}

test("stock TypeScript accepts modular local selectors and keeps exact output handle IDs", (t) => {
  const { root } = project(
    t,
    `
    const infrastructure=FocusNodes({charter:{cost:3},harbour:{requires:f=>f.charter}});
    const tree=FocusGraph({id:'editor',prefix:'ED',nodes:{...infrastructure,
      bonds:{requires:f=>f.charter,exclusiveWith:f=>f.relief,completionReward:c=>c.effects.addPoliticalPower(10)},
      relief:{requires:f=>f.charter},
      assembly:{requires:f=>({all:[f.harbour,{any:[f.bonds,f.relief]}]})}
    }});
    const literal:'ED_assembly'=tree.focuses.assembly.id;
    ScriptedEffect('use',c=>c.completeFocus(tree.focuses.harbour));`,
  );
  const result = tsc(root);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("stock TypeScript rejects selector typos, untyped keys, empty groups and foreign focus handles", (t) => {
  const { root } = project(
    t,
    `
    const module=FocusNodes({a:{},b:{requires:f=>f.missing}});
    const forged:FocusNodeKey<'a'>={key:'a'};
    const outside=FocusGraph({id:'outside',nodes:{a:{}}});
    FocusGraph({id:'bad',nodes:{a:{},b:{requires:f=>'a'},c:{exclusiveWith:f=>f.typo},
      d:{requires:f=>({any:[]})},e:{requires:f=>outside.focuses.a},
      g:{requires:f=>({any:[f.a],all:[f.a]})}
    }});`,
  );
  const result = tsc(root);
  assert.notEqual(result.status, 0);
  for (const expected of [
    /missing/,
    /typo/,
    /Type 'string'/,
    /any: \[\]/,
    /__kriegFocusNode/,
    /all/,
  ])
    assert.match(result.stdout, expected);
});

test("TypeScript LanguageService offers exact node selectors inside local rules and imported module spreads", (t) => {
  const source = `${imports}
    const infrastructure=FocusNodes({charter:{},harbour:{requires:f=>f.__MODULE__}});
    const tree=FocusGraph({id:'editor',prefix:'ED',nodes:{...infrastructure,
      relief:{requires:f=>f.__REQUIRES__,exclusiveWith:f=>f.__EXCLUDES__},
      assembly:{requires:f=>({any:[f.__ANY__]})}
    }});
    tree.focuses.__HANDLE__;
    const exact=tree.focuses.harbour;
  `;
  const { root, write } = project(t, "");
  write("src/main.krg.ts", source);
  const service = editorService(join(root, "tsconfig.json"));
  t.after(() => service.dispose());
  const file = join(root, "src/main.krg.ts");
  const entries = (marker) =>
    service
      .getCompletionsAtPosition(file, source.indexOf(marker), {})
      ?.entries.map((entry) => entry.name)
      .sort() ?? [];
  assert.deepEqual(entries("__MODULE__"), ["charter", "harbour"]);
  for (const marker of ["__REQUIRES__", "__EXCLUDES__", "__ANY__", "__HANDLE__"])
    assert.deepEqual(entries(marker), ["assembly", "charter", "harbour", "relief"], marker);
  const info = service.getQuickInfoAtPosition(file, source.lastIndexOf("harbour") + 2);
  assert.match(info.displayParts.map((part) => part.text).join(""), /FocusReference<"ED_harbour">/);
});

test("Mermaid preview follows compiled native groups and does not collapse independent focuses into states", () => {
  const [output] = compile(`FocusGraph({id:'preview',nodes:{root:{},
    a:{requires:f=>f.root,exclusiveWith:f=>f.b},b:{requires:f=>f.root},trade:{requires:f=>f.root},
    congress:{requires:f=>({all:[f.trade,{any:[f.a,f.b]}]})}
  }});`);
  const diagram = renderFocusTreeMermaid(output.document, "preview");
  assert.match(diagram, /^flowchart TD/);
  assert.match(diagram, /\{"AND"\}/);
  assert.match(diagram, /\{"OR"\}/);
  assert.equal((diagram.match(/\|"exclusive"\|/g) ?? []).length, 1);
  for (const key of ["root", "a", "b", "trade", "congress"])
    assert.ok(diagram.includes(`preview_${key}`));
  assert.match(diagram, /not simulated/);
});

test("native preview expands supplied shared branches, marks external dependencies and escapes labels", () => {
  const parsed = parsePdx(`
    shared_focus={id=shared_root}
    joint_focus={id=joint_child prerequisite={focus=shared_root} prerequisite={focus=external}}
    shared_focus={id=unrelated}
    focus_tree={id=first shared_focus=shared_root focus={id="strange<id>#end" prerequisite={focus=joint_child} mutually_exclusive={focus=outside}}}
    focus_tree={id=second focus={id=second_root}}
  `);
  assert.deepEqual(parsed.diagnostics, []);
  const diagram = renderFocusTreeMermaid(parsed.document, "first");
  assert.match(diagram, /shared_root \(shared\)/);
  assert.match(diagram, /joint_child \(shared\)/);
  assert.match(diagram, /External: external/);
  assert.match(diagram, /External: outside/);
  assert.match(diagram, /strange#60;id#62;#35;end/);
  assert.match(diagram, /\. "excludes" \.->/);
  assert.doesNotMatch(diagram, /unrelated|second_root|<id>/);
  assert.throws(() => renderFocusTreeMermaid(parsed.document), /exactly one/);
  assert.throws(
    () => renderFocusTreeMermaid(parsed.document, "missing"),
    /Available: first, second/,
  );
});

function cli(args) {
  return spawnSync(process.execPath, [resolve("dist/cli.js"), ...args], {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
}

test("graph CLI previews current checked output without writing a mod and preserves files on failure", (t) => {
  const { root, write } = project(
    t,
    `FocusGraph({id:'cli_tree',nodes:{a:{},b:{requires:f=>f.a}}});`,
  );
  const stdout = cli(["graph", root, "--focus", "cli_tree"]);
  assert.equal(stdout.status, 0, stdout.stderr);
  assert.match(stdout.stdout, /cli_tree_b/);
  assert.equal(existsSync(join(root, "build/mod")), false);
  const saved = join(root, "preview", "tree.mmd");
  const json = cli(["graph", root, "--focus", "cli_tree", "--out", saved, "--json"]);
  assert.equal(json.status, 0, json.stderr);
  const result = JSON.parse(json.stdout);
  assert.equal(result.success, true);
  assert.equal(readFileSync(saved, "utf8"), result.mermaid);
  write("src/main.krg.ts", `${imports}FocusGraph({id:'bad',nodes:{a:{requires:f=>f.missing}}});`);
  const failed = cli(["graph", root, "--focus", "cli_tree", "--out", saved, "--json"]);
  assert.equal(failed.status, 1);
  assert.equal(JSON.parse(failed.stdout).success, false);
  assert.equal(readFileSync(saved, "utf8"), result.mermaid);
  assert.equal(existsSync(join(root, "build/mod")), false);
});

test("complete vanilla and Kaiserreich example migrations preserve original focus output and render through the CLI", () => {
  for (const [name, prefix] of [
    ["vanilla-complete", "civ"],
    ["kaiserreich-complete", "srd"],
  ]) {
    const focus = [];
    const result = buildProject(resolve("examples", name), {
      check: true,
      onOutput(file) {
        if (file.path.startsWith("common/national_focus/")) focus.push(file.readText());
      },
    });
    assert.equal(result.success, true, JSON.stringify(result.diagnostics));
    assert.equal(focus.length, 1);
    // This native contract predates the migration: IDs, positions, prerequisites and rewards all stay unchanged.
    const tree = parsePdx(focus[0]).document;
    const expected = parsePdx(`focus_tree={id=${prefix}_island_tree
      country={factor=0 modifier={add=10 tag=${prefix === "civ" ? "KRG" : "KRL"}}}
      focus={id=${prefix}_charter icon=GFX_${prefix}_focus x=1 y=0 cost=3 completion_reward={add_stability=0.05}}
      focus={id=${prefix}_harbour icon=GFX_${prefix}_focus x=0 y=1 cost=5 prerequisite={focus=${prefix}_charter}
        completion_reward={country_event={id=${prefix}_congress.1 days=1}}}
      focus={id=${prefix}_bonds icon=GFX_${prefix}_focus x=2 y=1 cost=5 prerequisite={focus=${prefix}_charter}
        completion_reward={set_country_flag=${prefix}_bonds_unlocked ${prefix}_redeem_bond=yes}}
      focus={id=${prefix}_cooperation icon=GFX_${prefix}_focus x=1 y=2 cost=5
        prerequisite={focus=${prefix}_harbour} prerequisite={focus=${prefix}_bonds}
        completion_reward={country_event={id=${prefix}_congress.2 days=1}}}
    }`);
    assert.deepEqual(expected.diagnostics, []);
    assert.ok(comparePdxSemantic(tree, expected.document), focus[0]);
    const block = property(tree, "focus_tree")[0].value;
    const nodes = property(block, "focus").map((item) => item.value);
    assert.deepEqual(
      nodes.map((node) => [
        property(node, "id")[0].value.text,
        property(node, "x")[0].value.text,
        property(node, "y")[0].value.text,
      ]),
      [
        [`${prefix}_charter`, "1", "0"],
        [`${prefix}_harbour`, "0", "1"],
        [`${prefix}_bonds`, "2", "1"],
        [`${prefix}_cooperation`, "1", "2"],
      ],
    );
    assert.deepEqual(
      property(nodes[3], "prerequisite").map(({ value }) =>
        property(value, "focus").map((ref) => ref.value.text),
      ),
      [[`${prefix}_harbour`], [`${prefix}_bonds`]],
    );
    const preview = cli([
      "graph",
      resolve("examples", name),
      "--focus",
      `${prefix}_island_tree`,
      "--json",
    ]);
    assert.equal(preview.status, 0, preview.stderr);
    assert.match(JSON.parse(preview.stdout).mermaid, /\{"AND"\}/);
  }
});
