import { basename } from "node:path";
import { parsePdx } from "../pdx/index.js";
import type { PdxItem, PdxProperty } from "../pdx/ast.js";
import { imageInfo } from "./assets.js";
import { fileBytes, properties } from "./world.js";
import type { WorldFile } from "./world.js";
import type { ProjectDiagnostic } from "./types.js";

/** Validate authored country files against the effective vanilla/mod/project world. */
export function validateCountries(
  files: Map<string, WorldFile>,
  ownedPaths: ReadonlySet<string>,
  world: { countries: readonly string[]; states: readonly number[] },
  completeWorld = false,
): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = [];
  const countries = new Set(world.countries),
    states = new Set(world.states);
  const referenceSeverity = completeWorld ? "error" : "warning";
  const report = (code: string, message: string, file: WorldFile, incomplete = false): void => {
    diagnostics.push({
      code,
      message,
      file: file.source,
      severity: incomplete ? referenceSeverity : "error",
    });
  };
  const parse = (file: WorldFile): PdxItem[] =>
    parsePdx(Buffer.from(fileBytes(file)).toString("utf8")).document.items;
  const characters = new Set<string>();
  for (const [path, file] of files)
    if (/^common\/characters\/.+\.txt$/.test(path)) {
      for (const outer of properties(parse(file)))
        if (outer.key.text === "characters" && outer.value.kind === "block")
          for (const character of properties(outer.value.items)) characters.add(character.key.text);
    }
  const seenTags = new Map<string, string>();
  for (const path of ownedPaths) {
    const file = files.get(path);
    if (!file) continue;
    if (/^common\/country_tags\/.+\.txt$/.test(path)) {
      for (const tag of properties(parse(file))) {
        if (tag.key.text === "dynamic_tags") {
          if (tag.value.kind !== "atom" || tag.value.quoted || tag.value.text !== "yes")
            report("KRG_COUNTRY_TAG", "The native dynamic_tags control must be yes.", file);
          continue;
        }
        if (!/^[A-Z][A-Z0-9]{2}$/.test(tag.key.text)) {
          report("KRG_COUNTRY_TAG", `Invalid three-character country tag ${tag.key.text}.`, file);
          continue;
        }
        const previous = seenTags.get(tag.key.text);
        if (previous)
          report(
            "KRG_COUNTRY_DUPLICATE",
            `Country ${tag.key.text} is also declared in ${previous}.`,
            file,
          );
        seenTags.set(tag.key.text, file.source);
        if (tag.value.kind !== "atom" || !/^countries\/[^\0\r\n]+\.txt$/.test(tag.value.text))
          report(
            "KRG_COUNTRY_FILE",
            `Country ${tag.key.text} must refer to countries/<name>.txt.`,
            file,
          );
        else if (!files.has(`common/${tag.value.text}`))
          report(
            "KRG_COUNTRY_FILE",
            `Country ${tag.key.text} references missing common/${tag.value.text}.`,
            file,
            true,
          );
      }
    }
    if (/^history\/countries\/.+\.txt$/.test(path)) {
      const tag = basename(path).slice(0, 3);
      if (!countries.has(tag))
        report(
          "KRG_COUNTRY_TAG",
          `History filename references undefined country ${tag}.`,
          file,
          true,
        );
      const visit = (items: PdxItem[]): void => {
        for (const property of properties(items)) {
          if (property.value.kind === "block") visit(property.value.items);
          if (property.value.kind !== "atom") continue;
          const value = property.value.text;
          if (property.key.text === "capital" && !states.has(Number(value)))
            report(
              "KRG_COUNTRY_CAPITAL",
              `Capital references undefined state ${value}.`,
              file,
              true,
            );
          if (
            ["oob", "set_oob", "load_oob", "load_oob_before_factions"].includes(
              property.key.text,
            ) &&
            !files.has(`history/units/${value}.txt`)
          )
            report(
              "KRG_COUNTRY_OOB",
              `Country history references missing history/units/${value}.txt.`,
              file,
              true,
            );
          if (property.key.text === "recruit_character" && !characters.has(value))
            report(
              "KRG_COUNTRY_CHARACTER",
              `Country history recruits undefined character ${value}.`,
              file,
              true,
            );
        }
      };
      visit(parse(file));
    }
    if (/^history\/states\/.+\.txt$/.test(path)) {
      const visit = (items: PdxItem[]): void => {
        for (const property of properties(items)) {
          if (property.value.kind === "block") visit(property.value.items);
          if (
            property.value.kind === "atom" &&
            ["owner", "controller", "add_core_of", "add_claim_by"].includes(property.key.text) &&
            !countries.has(property.value.text)
          )
            report(
              "KRG_COUNTRY_STATE",
              `State ${property.key.text} references undefined country ${property.value.text}.`,
              file,
              true,
            );
        }
      };
      visit(parse(file));
    }
    if (/^gfx\/flags\/(?:medium\/|small\/)?[^/]+\.tga$/i.test(path)) {
      try {
        const info = imageInfo(fileBytes(file), ".tga")!;
        const [width, height] = path.includes("/medium/")
          ? [41, 26]
          : path.includes("/small/")
            ? [10, 7]
            : [82, 52];
        if (info.width !== width || info.height !== height)
          report(
            "KRG_COUNTRY_FLAG",
            `Flag ${path} must be ${width}×${height}; found ${info.width}×${info.height}.`,
            file,
          );
      } catch (error) {
        report("KRG_COUNTRY_FLAG", (error as Error).message, file);
      }
    }
    if (/^common\/countries\/[^/]+\.txt$/.test(path) && basename(path) !== "colors.txt") {
      const props = properties(parse(file));
      const color: PdxProperty | undefined = props.find((prop) => prop.key.text === "color");
      if (color) {
        // Native country files also use bare numeric triples; a color-model tag
        // is optional. Preserve constants for the game's own variable resolution.
        const block =
          color.value.kind === "block"
            ? color.value
            : color.value.kind === "tagged"
              ? color.value.value
              : undefined;
        if (
          !block ||
          block.items.length !== 3 ||
          block.items.some(
            (item) =>
              item.kind !== "atom" ||
              item.quoted ||
              (!/^@[A-Za-z_][A-Za-z0-9_]*$/.test(item.text) &&
                (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(item.text) ||
                  !Number.isFinite(Number(item.text)))),
          )
        )
          report(
            "KRG_COUNTRY_COLOR",
            "Country color requires three numeric components or native constants in a block, optionally tagged rgb or hsv.",
            file,
          );
      }
    }
  }
  return diagnostics;
}
