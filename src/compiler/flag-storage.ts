import { atom as a, block as b, property as p, type PdxItem } from "../pdx/ast.js";
import { indexDispatch } from "./indexed-dispatch.js";

/** One table defines both persistent achievement flags and the load/store
 * protocol. The native array is zero-based, like the index accepted by mark. */
export function flagStorage(
  group: string,
  prefix: string,
  count: number,
  scope: "global" | "country",
  array: string,
  index: string,
) {
  const load: PdxItem[] = [p("clear_array", a(array))];
  for (let i = 0; i < count; i++) {
    const flag = prefix + i;
    const limit = p(
      "limit",
      b([
        p(
          "OR",
          b([
            p("has_" + scope + "_flag", a(flag)),
            p(
              "has_completed_custom_achievement",
              b([p("mod", a(group)), p("achievement", a(flag))]),
            ),
          ]),
        ),
      ]),
    );
    const append = (v: string) => p("add_to_array", b([p(array, a(v))]));
    load.push(p("if", b([limit, append("1")])), p("else", b([append("0")])));
  }
  const cmp = (op: "<" | ">", n: number) => p("check_variable", b([p(index, a(String(n)), op)]));
  const mark = [
    p(
      "if",
      b([
        p("limit", b([cmp(">", -1), cmp("<", count)])),
        ...indexDispatch(index, count, 0, "clamp", (i) => [
          p("set_" + scope + "_flag", a(prefix + i)),
        ]),
        p("remove_from_array", b([p("array", a(array)), p("index", a(index))])),
        p("add_to_array", b([p("array", a(array)), p("value", a("1")), p("index", a(index))])),
      ]),
    ),
  ];
  return { load, mark };
}
