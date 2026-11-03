import type { PdxBlock, PdxDocument, PdxItem, PdxProperty } from "../pdx/ast.js";

function properties(items: readonly PdxItem[], key: string): PdxProperty[] {
  return items.filter(
    (item): item is PdxProperty => item.kind === "property" && item.key.text === key,
  );
}

function scalar(item: PdxProperty, label: string): string {
  if (item.value.kind !== "atom") throw new Error(`${label} must be a native scalar.`);
  return item.value.text;
}

function identifier(block: PdxBlock, label: string): string {
  const ids = properties(block.items, "id");
  if (ids.length !== 1) throw new Error(`${label} must have exactly one native ID.`);
  return scalar(ids[0], `${label} ID`);
}

/** Labels never become Mermaid identifiers, directives, HTML, or line breaks. */
function label(text: string): string {
  return text
    .replace(/[\r\n\u2028\u2029]/g, " ")
    .replace(/[&<>"'#\[\]{}|`\\]/g, (character) => `#${character.codePointAt(0)};`);
}

function references(block: PdxBlock, field: string): string[][] {
  return properties(block.items, field).map((item) => {
    if (item.value.kind !== "block") throw new Error(`Focus ${field} must be a native block.`);
    return properties(item.value.items, "focus").map((focus) =>
      scalar(focus, `Focus ${field} reference`),
    );
  });
}

/**
 * Render a selected native focus tree as a static Mermaid prerequisite graph.
 * @remarks Accepts actual compiled/parsed PDX; it never evaluates author source.
 * Pass a document combining national-focus files to resolve shared/joint branches.
 * Multiple prerequisite groups feed an AND gate; each multi-focus group uses OR.
 * Missing definitions remain explicit external nodes. Shared descendants present
 * in the supplied document are included, without evaluating allow_branch.
 * Conditions, bypasses, scripted completion, localisation and game positions are
 * not simulated. A one-way native exclusion stays directed; symmetric exclusions
 * become one undirected dotted edge. Ambiguous or missing tree IDs are errors.
 */
export function renderFocusTreeMermaid(document: PdxDocument, treeId?: string): string {
  const trees = properties(document.items, "focus_tree").map((tree) => {
    if (tree.value.kind !== "block") throw new Error("focus_tree must be a native block.");
    return { id: identifier(tree.value, "Focus tree"), block: tree.value };
  });
  const matches = treeId === undefined ? trees : trees.filter((tree) => tree.id === treeId);
  if (matches.length !== 1)
    throw new Error(
      matches.length === 0
        ? `Focus tree '${treeId ?? "(unspecified)"}' was not found. Available: ${trees.map((tree) => tree.id).join(", ") || "none"}.`
        : `Select exactly one focus tree; ${matches.length} trees match '${treeId ?? "(unspecified)"}'.`,
    );
  const tree = matches[0];
  const nodes = new Map<string, PdxBlock>();
  const add = (id: string, block: PdxBlock): void => {
    if (nodes.has(id)) throw new Error(`Focus tree '${tree.id}' contains duplicate focus '${id}'.`);
    nodes.set(id, block);
  };
  for (const focus of properties(tree.block.items, "focus")) {
    if (focus.value.kind !== "block") throw new Error("focus must be a native block.");
    add(identifier(focus.value, "Focus"), focus.value);
  }

  const shared = new Map<string, PdxBlock>();
  for (const item of document.items) {
    if (
      item.kind !== "property" ||
      !["shared_focus", "joint_focus"].includes(item.key.text) ||
      item.value.kind !== "block"
    )
      continue;
    const id = identifier(item.value, "Shared focus");
    if (shared.has(id)) throw new Error(`Duplicate shared focus '${id}' in preview input.`);
    shared.set(id, item.value);
  }
  const sharedChildren = new Map<string, string[]>();
  for (const [id, block] of shared)
    for (const parent of new Set(references(block, "prerequisite").flat())) {
      const children = sharedChildren.get(parent) ?? [];
      children.push(id);
      sharedChildren.set(parent, children);
    }
  const selectedShared = new Set(
    properties(tree.block.items, "shared_focus").map((item) => scalar(item, "shared_focus")),
  );
  const queue = [...selectedShared];
  for (let index = 0; index < queue.length; index++) {
    const id = queue[index];
    const block = shared.get(id);
    if (block) add(id, block);
    for (const child of sharedChildren.get(id) ?? [])
      if (!selectedShared.has(child)) {
        selectedShared.add(child);
        queue.push(child);
      }
  }

  const names = new Map<string, string>();
  const lines = [
    "flowchart TD",
    `  %% Focus tree: ${label(tree.id)}`,
    '  note["Static graph: availability, bypasses, allow_branch and game positions are not simulated."]',
    "  classDef external stroke-dasharray:5 5",
  ];
  const node = (id: string): string => {
    const previous = names.get(id);
    if (previous) return previous;
    const name = `f${names.size}`;
    names.set(id, name);
    const external = !nodes.has(id);
    const caption = `${external ? "External: " : ""}${id}${selectedShared.has(id) && !external ? " (shared)" : ""}`;
    lines.push(`  ${name}["${label(caption)}"]${external ? ":::external" : ""}`);
    return name;
  };
  for (const id of nodes.keys()) node(id);
  for (const id of selectedShared) node(id);
  let gate = 0;
  for (const [id, block] of nodes) {
    const groups = references(block, "prerequisite");
    let destination = node(id);
    if (groups.length > 1) {
      const and = `g${gate++}`;
      lines.push(`  ${and}{"AND"}`, `  ${and} --> ${destination}`);
      destination = and;
    }
    for (const group of groups) {
      if (group.length === 1) lines.push(`  ${node(group[0])} --> ${destination}`);
      else {
        const or = `g${gate++}`;
        lines.push(`  ${or}{"${group.length ? "OR" : "EMPTY prerequisite"}"}`);
        for (const parent of group) lines.push(`  ${node(parent)} --> ${or}`);
        lines.push(`  ${or} --> ${destination}`);
      }
    }
  }
  const exclusions = new Map(
    [...nodes].map(([id, block]) => [id, new Set(references(block, "mutually_exclusive").flat())]),
  );
  const emitted = new Set<string>();
  for (const [left, rights] of exclusions)
    for (const right of rights) {
      const symmetric = exclusions.get(right)?.has(left) === true;
      const pair = JSON.stringify([left, right].sort());
      if (symmetric && emitted.has(pair)) continue;
      emitted.add(pair);
      lines.push(
        symmetric
          ? `  ${node(left)} -.-|"exclusive"| ${node(right)}`
          : `  ${node(left)} -. "excludes" .-> ${node(right)}`,
      );
    }
  return lines.join("\n") + "\n";
}
