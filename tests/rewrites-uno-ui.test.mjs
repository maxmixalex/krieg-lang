import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { compileProject } from "../dist/compiler/index.js";
import { parsePdx } from "../dist/pdx/index.js";
import { readOriginal } from "../scripts/rewrite-inputs.mjs";
import { UnoNativeMachine, properties, field, atom } from "./support/uno-native-machine.mjs";

const root = resolve("examples/rewrites/hearts-of-uno");
const result = compileProject({ rootDir: root, files: ["src/interface.krg.tsx"] });
assert.equal(result.success, true, JSON.stringify(result.diagnostics));
const output = (path) => {
  const item = result.outputs.find((output) => output.path === path);
  assert.ok(item, path);
  return item.document;
};
const window = field(field(output("interface/UNO.gui"), "guiTypes"), "containerWindowType");
const gui = field(field(output("common/scripted_guis/krieg_UNO_ui.txt"), "scripted_gui"), "UNO_ui");
const triggers = new Map(
  properties(field(gui, "triggers")).map((item) => [item.key.text, item.value]),
);
function controls(window) {
  return properties(window)
    .filter((item) => item.value.kind === "block" && field(item.value, "name"))
    .map((item) => ({ name: atom(field(item.value, "name")), body: item.value }));
}
const elements = controls(window);
const byName = new Map(elements.map((item) => [item.name, item.body]));
const inputPath = resolve(process.env.KRIEG_PRIVATE_MODS ?? "../private-mods");
const originals = existsSync(inputPath) ? readOriginal(inputPath, "hearts-of-uno") : undefined;
function originalDocument(path) {
  const bytes = originals?.get(path);
  assert.ok(bytes, `Missing pinned original ${path}`);
  const parsed = parsePdx(Buffer.from(bytes).toString("utf8"));
  assert.deepEqual(
    parsed.diagnostics.filter((item) => item.severity === "error"),
    [],
  );
  return parsed.document;
}
function machine(viewer = 1) {
  const value = new UnoNativeMachine(new Map());
  value.countries.forEach((country, index) => {
    country.vars.ku_seat = index + 1;
    country.flags.add(`this_is_player_${index + 1}`);
    value.targets[`ku_p${index + 1}`] = country;
  });
  return { value, country: value.countries[viewer - 1] };
}
function visible(name, value, country) {
  const trigger = triggers.get(`${name}_visible`);
  assert.ok(trigger, name);
  return value.condition(trigger, country);
}
function oldCardName(id) {
  const copies = ["one", "two", "three", "four"];
  if (id > 100) return `wild_${id <= 104 ? "color" : "plus"}_${copies[(id - 101) % 4]}_p1`;
  const color = ["red", "blue", "yellow", "green"][Math.floor((id - 1) / 25)];
  const slot = (id - 1) % 25;
  if (slot === 0) return `${color}_0_p1`;
  const rank = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "block", "reverse", "plus"][
    Math.floor((slot - 1) / 2)
  ];
  return `${color}_${rank}_${copies[(slot - 1) % 2]}_p1`;
}
function geometry(block) {
  const fields = [
    "position",
    "spriteType",
    "text",
    "font",
    "format",
    "maxHeight",
    "maxwidth",
    "pdx_tooltip",
    "scale",
  ];
  const normalized = (value) =>
    value.kind === "atom"
      ? value.text
      : Object.fromEntries(
          properties(value).map((item) => [item.key.text.toLowerCase(), normalized(item.value)]),
        );
  return Object.fromEntries(
    fields.flatMap((key) => {
      const item = properties(block).find(
        (item) => item.key.text.toLowerCase() === key.toLowerCase(),
      );
      return item ? [[key.toLowerCase(), normalized(item.value)]] : [];
    }),
  );
}

test("UNO TSX expands all fixed card slots, perspectives and status cues with unique bindings", () => {
  assert.equal(new Set(elements.map((item) => item.name)).size, elements.length);
  const names = [...byName.keys()];
  assert.equal(names.filter((name) => /^play_\d+$/.test(name)).length, 108);
  assert.equal(names.filter((name) => /^covered_card\d_p\d_p\dp$/.test(name)).length, 210);
  assert.equal(names.filter((name) => /^player_\d_p\dp$/.test(name)).length, 36);
  assert.equal(names.filter((name) => /^player_\d_p\dp_uno$/.test(name)).length, 36);
  assert.equal(names.filter((name) => /^player_\d_num_cards_p\dp$/.test(name)).length, 36);
  assert.equal(names.filter((name) => /^top_/.test(name)).length, 54);
  for (const name of [
    "clockwise_queue",
    "counter_clockwise_queue",
    "waiting_for_players",
    "everyone_draws_seven",
    "choose_color_middle",
    "num_of_all_cards",
  ])
    assert.ok(byName.has(name), name);
  const sprites = properties(field(output("interface/UNO.gfx"), "spriteTypes"));
  for (let count = 1; count <= 7; count++)
    assert.ok(
      sprites.some((item) => atom(field(item.value, "name")) === `GFX_card_covered${count}`),
    );
});

test(
  "UNO emits the original geometry, sprites and ten-language keys for all restored controls",
  { skip: !originals && "pinned Hearts-of-UNO input unavailable" },
  () => {
    const originalWindow = field(
      field(originalDocument("interface/UNO.gui"), "guiTypes"),
      "containerWindowType",
    );
    const originalElements = controls(originalWindow);
    const originalByName = new Map(originalElements.map((item) => [item.name, item.body]));
    for (let id = 1; id <= 108; id++)
      assert.deepEqual(
        geometry(byName.get(`play_${id}`)),
        geometry(originalByName.get(oldCardName(id))),
        `card ${id}`,
      );
    let compared = 0;
    for (const item of elements) {
      if (/^play_|^top_|^choose_(red|blue|yellow|green)$|^deck$|^Background$/.test(item.name))
        continue;
      // The uploaded source gives these two different labels the same _uno name.
      // The component generates one unique name for the country and one for its warning.
      if (["player_6_p6p", "player_6_p6p_uno"].includes(item.name)) {
        const old = originalElements.find(
          (candidate) =>
            candidate.name === "player_6_p6p_uno" &&
            atom(field(field(candidate.body, "position"), "y")) ===
              (item.name.endsWith("_uno") ? "380" : "400"),
        );
        const expected = geometry(old.body);
        if (!item.name.endsWith("_uno")) expected.text = "player_5";
        assert.deepEqual(geometry(item.body), expected, item.name);
      } else {
        assert.ok(originalByName.has(item.name), item.name);
        assert.deepEqual(geometry(item.body), geometry(originalByName.get(item.name)), item.name);
      }
      compared++;
    }
    assert.equal(compared, 359);
    for (const color of ["red", "blue", "yellow", "green"])
      assert.deepEqual(
        geometry(byName.get(`choose_${color}`)),
        geometry(originalByName.get(`color_middle_${color}`)),
      );
    const deck = geometry(byName.get("deck"));
    delete deck.pdx_tooltip;
    assert.deepEqual(deck, geometry(originalByName.get("deck_of_cards_red")));
    for (const item of elements.filter((item) => item.name.startsWith("top_"))) {
      const old = originalElements.find(
        (candidate) =>
          candidate.name.endsWith("_middle") &&
          field(candidate.body, "spriteType") &&
          atom(field(candidate.body, "spriteType")) === atom(field(item.body, "spriteType")),
      );
      assert.ok(old, item.name);
      assert.deepEqual(geometry(item.body), geometry(old.body), item.name);
    }
  },
);

test("all perspectives reveal only the matching opponent card-back count and UNO warning", () => {
  for (let viewer = 1; viewer <= 6; viewer++) {
    for (const count of [0, 1, 2, 6, 7, 8, 108]) {
      const { value, country } = machine(viewer);
      for (const player of value.countries)
        player.arrays.ku_hand = Array.from({ length: count }, (_, i) => i + 1);
      const backs = elements.filter(
        (item) => item.name.startsWith("covered_card") && visible(item.name, value, country),
      );
      assert.equal(backs.length, count === 0 ? 0 : 5, `viewer=${viewer}, count=${count}`);
      for (const back of backs)
        assert.match(
          back.name,
          new RegExp(`^covered_card${Math.min(count, 7)}_p[2-6]_p${viewer}p$`),
        );
      const warnings = elements.filter(
        (item) => /^player_\d_p\dp_uno$/.test(item.name) && visible(item.name, value, country),
      );
      assert.equal(warnings.length, count === 1 ? 6 : 0);
      value.global.vars.ku_dealing = 1;
      for (const warning of warnings) assert.equal(visible(warning.name, value, country), false);
    }
  }
});

test(
  "restored card backs and UNO warnings match native visibility across all six views",
  { skip: !originals && "pinned Hearts-of-UNO input unavailable" },
  () => {
    const originalGui = field(
      field(originalDocument("common/scripted_guis/UNO_OLD.txt"), "scripted_gui"),
      "UNO_ui",
    );
    const originalTriggers = new Map(
      properties(field(originalGui, "triggers")).map((item) => [item.key.text, item.value]),
    );
    const targets = elements.filter((item) => /^covered_card|^player_\d_p\dp_uno$/.test(item.name));
    let cases = 0;
    for (let viewer = 1; viewer <= 6; viewer++) {
      for (const dealing of [0, 1, 42]) {
        for (let offset = 0; offset <= 8; offset++) {
          const { value, country } = machine(viewer);
          value.global.vars.ku_dealing = dealing;
          value.global.vars.seven_cards = dealing;
          value.countries.forEach((player, index) => {
            const count = (index + offset) % 9;
            player.arrays.ku_hand = Array.from({ length: count }, (_, i) => i + 1);
            value.global.vars[`p${index + 1}_num_of_cards`] = count;
          });
          for (const target of targets) {
            const original = originalTriggers.get(`${target.name}_visible`);
            assert.ok(original, target.name);
            assert.equal(
              visible(target.name, value, country),
              value.condition(original, country),
              `${target.name}, view=${viewer}, deal=${dealing}, offset=${offset}`,
            );
            cases++;
          }
        }
      }
    }
    assert.equal(cases, 39852);
  },
);

test("UNO status controls follow color, direction, deal and choosing stages", () => {
  const { value, country } = machine(3);
  country.flags.add("ku_host");
  value.global.flags.add("ku_started");
  Object.assign(value.global.vars, {
    ku_turn: 3,
    ku_direction: -1,
    ku_color: 4,
    ku_rank: 13,
    ku_pending: 4,
    ku_choose_color: 1,
  });
  for (let seat = 2; seat <= 6; seat++) value.global.flags.add(`ku_seat_${seat}`);
  for (const name of [
    "current_color_green",
    "counter_clockwise_queue",
    "player_3_turn",
    "drawing_cards_number3",
    "choose_color_middle",
  ])
    assert.equal(visible(name, value, country), true, name);
  for (const name of [
    "current_color_red",
    "clockwise_queue",
    "player_2_turn",
    "drawing_cards_number2",
    "waiting_for_players",
  ])
    assert.equal(visible(name, value, country), false, name);
  value.global.vars.ku_dealing = 6;
  assert.equal(visible("everyone_draws_seven", value, country), true);
  value.global.flags.delete("ku_seat_6");
  assert.equal(visible("waiting_for_players", value, country), true);
  assert.equal(visible("everyone_draws_seven", value, country), false);
});

test("the reusable TSX player component rejects country/state scope errors before emission", () => {
  const source = readFileSync(resolve(root, "src/interface.krg.tsx"), "utf8");
  const invalid = source.replace(
    'player.variable("ku_hand^num") === count',
    'player.triggers.hasStateFlag("invalid")',
  );
  assert.notEqual(invalid, source);
  const rejected = compileProject({
    rootDir: root,
    files: ["src/interface.krg.tsx"],
    sources: { "src/interface.krg.tsx": invalid },
  });
  assert.equal(rejected.success, false);
  assert.deepEqual(rejected.outputs, []);
  assert.ok(
    rejected.diagnostics.some((item) => item.code === "TS2339"),
    JSON.stringify(rejected.diagnostics),
  );
});
