import * as pdx from "../pdx/ast.js";

/** Expand an authored clip table; this module never reads or imports native scripts. */
export function audioBank(
  category: unknown,
  value: unknown,
): {
  path: string;
  document: pdx.PdxDocument;
  sounds: Record<string, string>;
} {
  const object = (input: unknown): Record<string, unknown> => {
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new Error("AudioBank requires a record.");
    return input as Record<string, unknown>;
  };
  const id = (input: unknown): string => {
    if (typeof input !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(input))
      throw new Error("AudioBank identifiers must be safe ASCII names.");
    return input;
  };
  const spec = object(value);
  for (const key of Object.keys(spec))
    if (!["path", "clips", "volume", "alwaysLoad", "compressor", "maxAudible"].includes(key))
      throw new Error(`Unknown AudioBank field '${key}'.`);
  if (typeof spec.path !== "string" || !/^sound\/.+\.asset$/.test(spec.path))
    throw new Error("AudioBank path must be a sound/*.asset path.");
  const clips = object(spec.clips);
  if (!Object.keys(clips).length) throw new Error("AudioBank needs at least one clip.");
  const volume = spec.volume ?? 1;
  if (typeof volume !== "number" || !Number.isFinite(volume) || volume < 0)
    throw new Error("AudioBank volume must be finite and non-negative.");
  if (spec.alwaysLoad !== undefined && typeof spec.alwaysLoad !== "boolean")
    throw new Error("AudioBank alwaysLoad must be boolean.");
  if (
    spec.maxAudible !== undefined &&
    (typeof spec.maxAudible !== "number" ||
      !Number.isSafeInteger(spec.maxAudible) ||
      spec.maxAudible < 1)
  )
    throw new Error("AudioBank maxAudible must be a positive whole number.");
  const sounds: Record<string, string> = Object.create(null);
  const items: pdx.PdxItem[] = [];
  for (const [name, file] of Object.entries(clips)) {
    id(name);
    if (
      typeof file !== "string" ||
      !file ||
      file.startsWith("/") ||
      file.includes("\\") ||
      file.split("/").some((p) => p === ".." || !p) ||
      !/\.(wav|ogg)$/i.test(file)
    )
      throw new Error(`AudioBank clip '${name}' must point to a relative WAV or OGG file.`);
    sounds[name] = name;
    items.push(
      pdx.property(
        "sound",
        pdx.block([
          pdx.property("name", pdx.string(name)),
          pdx.property("file", pdx.string(file)),
          pdx.property("always_load", pdx.atom(spec.alwaysLoad === false ? "no" : "yes")),
        ]),
      ),
    );
    items.push(
      pdx.property(
        "soundeffect",
        pdx.block([
          pdx.property("name", pdx.atom(name)),
          pdx.property("volume", pdx.atom(String(volume))),
          pdx.property("sounds", pdx.block([pdx.property("sound", pdx.atom(name))])),
          ...(spec.maxAudible === undefined
            ? []
            : [
                pdx.property("max_audible", pdx.atom(String(spec.maxAudible))),
                pdx.property("max_audible_behaviour", pdx.atom("fail")),
              ]),
        ]),
      ),
    );
  }
  const fields = [
    pdx.property("name", pdx.string(id(category))),
    pdx.property("soundeffects", pdx.block(Object.keys(sounds).map((name) => pdx.atom(name)))),
  ];
  if (spec.compressor !== undefined) {
    const compressor = object(spec.compressor);
    const allowed = [
      "enabled",
      "pregain",
      "postgain",
      "ratio",
      "threshold",
      "attacktime",
      "releasetime",
    ];
    for (const [key, val] of Object.entries(compressor)) {
      if (
        !allowed.includes(key) ||
        (key === "enabled"
          ? typeof val !== "boolean"
          : typeof val !== "number" || !Number.isFinite(val))
      )
        throw new Error(`Invalid AudioBank compressor field '${key}'.`);
    }
    if (typeof compressor.enabled !== "boolean")
      throw new Error("AudioBank compressor requires enabled.");
    fields.push(
      pdx.property(
        "compressor",
        pdx.block(
          Object.entries(compressor).map(([key, val]) =>
            pdx.property(
              key,
              pdx.atom(typeof val === "boolean" ? (val ? "yes" : "no") : String(val)),
            ),
          ),
        ),
      ),
    );
  }
  items.push(pdx.property("category", pdx.block(fields)));
  return { path: spec.path, document: pdx.document(items), sounds };
}
