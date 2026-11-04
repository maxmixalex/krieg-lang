import * as p from "../pdx/ast.js";

/** Declarative palette lowering; the input is authored data, never imported native text. */
export function countryHeatmap(value: unknown): {
  id: string;
  path: string;
  document: p.PdxDocument;
} {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("CountryHeatmap requires a record.");
  const spec = value as Record<string, unknown>;
  const allowed = [
    "id",
    "path",
    "metric",
    "maximumDivisor",
    "bands",
    "maximumColor",
    "fallbackColor",
    "highlightMaximum",
    "roundThresholds",
    "updateDaily",
  ];
  for (const key of Object.keys(spec))
    if (!allowed.includes(key)) throw new Error(`Unknown CountryHeatmap field '${key}'.`);
  for (const key of ["highlightMaximum", "roundThresholds", "updateDaily"])
    if (spec[key] !== undefined && typeof spec[key] !== "boolean")
      throw new Error(`CountryHeatmap ${key} must be boolean.`);
  const identifier = (input: unknown): string => {
    if (typeof input !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(input))
      throw new Error("CountryHeatmap IDs and metric names must be safe identifiers.");
    return input;
  };
  const id = identifier(spec.id),
    metric = identifier(spec.metric),
    pivot = `value_${metric}`;
  const divisor = spec.maximumDivisor ?? 1;
  if (typeof divisor !== "number" || !Number.isFinite(divisor) || divisor <= 0)
    throw new Error("CountryHeatmap maximumDivisor must be positive.");
  if (!Array.isArray(spec.bands) || !spec.bands.length || spec.bands.length > 100)
    throw new Error("CountryHeatmap needs 1–100 descending bands.");
  const set = (name: string, val: string | number): p.PdxProperty =>
    p.property("set_temp_variable", p.block([p.property(name, p.atom(String(val)))]));
  const calc = (op: string, name: string, val: string | number): p.PdxProperty =>
    p.property(op, p.block([p.property(name, p.atom(String(val)))]));
  const check = (name: string, val: string | number, op: p.PdxOperator = "="): p.PdxProperty =>
    p.property("check_variable", p.block([p.property(name, p.atom(String(val)), op)]));
  const color = (input: unknown): p.PdxItem[] => {
    if (
      !Array.isArray(input) ||
      input.length !== 3 ||
      input.some((v) => typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 1)
    )
      throw new Error("CountryHeatmap colors need three numbers between zero and one.");
    return [set("red", input[0]), set("green", input[1]), set("blue", input[2])];
  };
  const findMaximum = p.property(
    "any_country",
    p.block([
      p.property(
        "all_other_country",
        p.block([p.property("NOT", p.block([check(metric, `PREV.${metric}`, ">")]))]),
      ),
      set(pivot, metric),
      calc("divide_temp_variable", pivot, divisor),
    ]),
  );
  const calculations: p.PdxItem[] = [findMaximum];
  const equal: p.PdxItem[] = [
    p.property("limit", p.block([check(metric, pivot)])),
    ...color(spec.maximumColor),
  ];
  if (spec.highlightMaximum !== false)
    equal.push(
      p.property(
        "if",
        p.block([
          p.property(
            "limit",
            p.block([
              p.property("all_other_country", p.block([check(metric, `PREV.${metric}`, "<")])),
            ]),
          ),
          set("highlighted", 1),
        ]),
      ),
    );
  const paint: p.PdxItem[] = [
    set("alpha", 1),
    set("thickness", 1),
    p.property("if", p.block(equal)),
  ];
  let previous = 1;
  for (const [index, raw] of spec.bands.entries()) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      throw new Error("Each CountryHeatmap band requires fraction and color.");
    const band = raw as Record<string, unknown>;
    if (Object.keys(band).some((k) => !["fraction", "color"].includes(k)))
      throw new Error("Unknown CountryHeatmap band field.");
    const fraction = band.fraction;
    if (
      typeof fraction !== "number" ||
      !Number.isFinite(fraction) ||
      fraction <= 0 ||
      fraction >= previous
    )
      throw new Error("CountryHeatmap fractions must strictly descend between zero and one.");
    previous = fraction;
    const threshold = `${pivot}_minus_${index}`;
    calculations.push(set(threshold, pivot), calc("multiply_temp_variable", threshold, fraction));
    if (spec.roundThresholds !== false)
      calculations.push(p.property("round_temp_variable", p.atom(threshold)));
    paint.push(
      p.property(
        "else_if",
        p.block([
          p.property(
            "limit",
            p.block([p.property("NOT", p.block([check(metric, threshold, "<")]))]),
          ),
          ...color(band.color),
        ]),
      ),
    );
  }
  paint.push(p.property("else", p.block(color(spec.fallbackColor))));
  calculations.push(p.property("FROM", p.block(paint)));
  const body = [
    p.property(
      "top",
      p.block([
        p.property("type", p.atom("country")),
        p.property("color", p.block(calculations)),
        p.property("thickness", p.atom("no")),
      ]),
    ),
    p.property("bottom", p.block([p.property("type", p.atom("none"))])),
    p.property("far_text", p.atom("country")),
    p.property("near_text", p.atom("state")),
    p.property("update_daily", p.atom(spec.updateDaily === false ? "no" : "yes")),
  ];
  const path = spec.path ?? "common/map_modes/krieg_heatmaps.txt";
  if (typeof path !== "string" || !/^common\/map_modes\/.+\.txt$/.test(path))
    throw new Error("CountryHeatmap path must be common/map_modes/*.txt.");
  return {
    id,
    path,
    document: p.document([
      p.property("scripted_map_modes", p.block([p.property(id, p.block(body))])),
    ]),
  };
}
