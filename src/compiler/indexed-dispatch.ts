import { atom, block, property, type PdxItem, type PdxOperator } from "../pdx/ast.js";

/** Compile a finite catalogue into an ordered, logarithmic native branch tree. */
export function indexDispatch(
  variable: string,
  length: number,
  first: number,
  outside: "ignore" | "clamp",
  leaf: (offset: number) => PdxItem[],
): PdxItem[] {
  const check = (op: PdxOperator, n: number) =>
    property("check_variable", block([property(variable, atom(String(n)), op)]));
  const arm = (tests: PdxItem[], body: PdxItem[]) =>
    property("if", block([property("limit", block(tests)), ...body]));
  function descend(lo: number, hi: number): PdxItem[] {
    if (hi - lo === 1) return leaf(lo);
    const mid = lo + Math.floor((hi - lo) / 2);
    return [
      arm([check("<", first + mid)], descend(lo, mid)),
      property("else", block(descend(mid, hi))),
    ];
  }
  const tree = descend(0, length);
  return outside === "clamp"
    ? tree
    : [arm([property("NOT", block([check("<", first)])), check("<", first + length)], tree)];
}
