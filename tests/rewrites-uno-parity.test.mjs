import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import test, { after } from "node:test";
import { compileProject } from "../dist/compiler/index.js";
import { parsePdx } from "../dist/pdx/index.js";
import { inputs, readOriginal } from "../scripts/rewrite-inputs.mjs";
import { UnoNativeMachine, properties, field, atom } from "./support/uno-native-machine.mjs";

const root = resolve("examples/rewrites/hearts-of-uno");
const compiled = compileProject({
  rootDir: root,
  files: ["src/game.krg.ts", "src/interface.krg.tsx", "src/audio.krg.ts", "src/decisions.krg.ts"],
});
assert.equal(compiled.success, true, JSON.stringify(compiled.diagnostics));
const definitions = new Map(
  compiled.outputs
    .filter((output) => output.path.startsWith("common/scripted_effects/"))
    .flatMap((output) => properties(output.document).map((entry) => [entry.key.text, entry.value])),
);
const generatedGui = field(
  field(
    compiled.outputs.find((output) => output.path.includes("scripted_guis/")).document,
    "scripted_gui",
  ),
  "UNO_ui",
);
for (const entry of properties(field(generatedGui, "effects")))
  definitions.set(entry.key.text, entry.value);

const input = resolve(process.env.KRIEG_PRIVATE_MODS ?? "../private-mods");
const original = existsSync(input) ? readOriginal(input, "hearts-of-uno") : undefined;
const inputRequired = {
  skip: original ? false : "Supply the pinned mods.zip with KRIEG_PRIVATE_MODS.",
};
const report = {
  inputTreeSha256: inputs["hearts-of-uno"].treeSha256,
  checks: {},
  limits: [
    "Native commands execute in a bounded test interpreter, not the HOI4 client.",
    "Mapped gameplay state preserves outcomes, not save compatibility or identical random streams.",
    "AI comparisons cover native weights, not the engine's AI scheduling.",
  ],
};
function document(bytes) {
  const parsed = parsePdx(Buffer.from(bytes).toString("utf8"));
  assert.deepEqual(
    parsed.diagnostics.filter((item) => item.severity === "error"),
    [],
  );
  return parsed.document;
}
const legacyGui = original
  ? field(
      field(document(original.get("common/scripted_guis/UNO_OLD.txt")), "scripted_gui"),
      "UNO_ui",
    )
  : undefined;
const legacyEffects = legacyGui
  ? new Map(properties(field(legacyGui, "effects")).map((entry) => [entry.key.text, entry.value]))
  : undefined;

// Derive the physical-card inventory from the independent input handlers. No
// authored card catalogue or gameplay implementation is imported by this oracle.
const colorNames = ["red", "blue", "yellow", "green"];
const rankNames = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "block",
  "reverse",
  "plus",
  "wild_color",
  "wild_plus",
];
const copyNames = ["one", "two", "three", "four"];
const legacyCards = legacyEffects
  ? [...legacyEffects.keys()]
      .filter((key) => key.endsWith("_p1_click"))
      .map((key) => {
        const name = key.replace(/_p1_click$/, "");
        const parts = name.split("_");
        const color = colorNames.indexOf(parts[0]) + 1;
        const rank = color
          ? /^\d$/.test(parts[1])
            ? Number(parts[1])
            : rankNames.indexOf(parts[1])
          : parts[1] === "color"
            ? 13
            : 14;
        const copy = rank === 0 ? 1 : copyNames.indexOf(parts[2]) + 1;
        const id = color
          ? (color - 1) * 25 + (rank === 0 ? 1 : rank * 2) + copy - 1
          : 100 + (rank - 13) * 4 + copy;
        return { key, name, color, rank, id };
      })
  : [];

function paired({
  seat = 1,
  direction = 1,
  color = 1,
  rank = 0,
  dealing = 0,
  pending = 0,
  defending = true,
  active = true,
  hand = [],
} = {}) {
  const legacy = new UnoNativeMachine(legacyEffects);
  const modern = new UnoNativeMachine(definitions);
  const oldPlayer = legacy.countries[seat - 1];
  const newPlayer = modern.countries[seat - 1];
  legacy.global.flags = new Set([
    "game_started",
    direction === 1 ? "clockwise_queue" : "counter_clockwise_queue",
    `${colorNames[color - 1] ?? "wild"}_middle`,
    `${rankNames[rank]}_middle`,
    `player_${active ? seat : (seat % 6) + 1}_turn`,
  ]);
  oldPlayer.flags.add(`this_is_player_${seat}`);
  oldPlayer.vars.seven_first_cards = 6;
  Object.assign(legacy.global.vars, {
    seven_cards: dealing,
    [`p${seat}_num_of_cards`]: hand.length,
    [`num_of_cards_to_draw_p${seat}`]: pending,
  });
  if (defending) legacy.global.flags.add(`p${seat}_chance_to_defend`);
  for (const card of hand) oldPlayer.flags.add(`card_${card.name}`);
  modern.global.flags.add("ku_started");
  Object.assign(modern.global.vars, {
    ku_turn: active ? seat : (seat % 6) + 1,
    ku_direction: direction,
    ku_color: color,
    ku_rank: rank,
    ku_pending: pending,
    ku_penalty_started: defending ? 0 : 1,
    ku_dealing: dealing,
  });
  newPlayer.vars.ku_seat = seat;
  newPlayer.vars.ku_deal_remaining = 7;
  newPlayer.arrays.ku_hand = hand.map((card) => card.id);
  return { legacy, modern, oldPlayer, newPlayer };
}

function soundFiles(documents) {
  const entries = documents.flatMap(properties);
  const clips = new Map(
    entries
      .filter((entry) => entry.key.text === "sound")
      .map((entry) => [atom(field(entry.value, "name")), atom(field(entry.value, "file"))]),
  );
  return new Map(
    entries
      .filter((entry) => entry.key.text === "soundeffect")
      .map((entry) => {
        const name = atom(field(entry.value, "name"));
        const clip = atom(field(field(entry.value, "sounds"), "sound"));
        assert.ok(clips.has(clip), `Missing sound clip ${clip}`);
        return [name, clips.get(clip)];
      }),
  );
}
const oldSounds = original
  ? soundFiles(
      [...original]
        .filter(([path]) => path.startsWith("sound/") && path.endsWith(".asset"))
        .map(([, bytes]) => document(bytes)),
    )
  : undefined;
const newSounds = soundFiles(
  compiled.outputs
    .filter((output) => output.path.endsWith(".asset"))
    .map((output) => output.document),
);
function playedSnapshot(pair, seat, modern) {
  const machine = modern ? pair.modern : pair.legacy;
  const player = modern ? pair.newPlayer : pair.oldPlayer;
  const soundMap = modern ? newSounds : oldSounds;
  return {
    turn: modern
      ? machine.global.vars.ku_turn
      : [1, 2, 3, 4, 5, 6].find((value) => machine.global.flags.has(`player_${value}_turn`)),
    direction: modern
      ? machine.global.vars.ku_direction
      : machine.global.flags.has("clockwise_queue")
        ? 1
        : -1,
    hand: modern ? player.arrays.ku_hand.length : machine.global.vars[`p${seat}_num_of_cards`],
    pending: modern
      ? machine.global.vars.ku_pending
      : [1, 2, 3, 4, 5, 6].reduce(
          (sum, value) => sum + (machine.global.vars[`num_of_cards_to_draw_p${value}`] ?? 0),
          0,
        ),
    choosing: modern
      ? Boolean(machine.global.vars.ku_choose_color)
      : machine.global.flags.has("player_is_choosing_a_color"),
    recipients: machine.events.map((event) => [event.country, event.id]),
    sounds: machine.sounds.map((name) => {
      assert.ok(soundMap.has(name), `Undeclared sound ${name}`);
      return soundMap.get(name);
    }),
  };
}

test(
  "every original physical-card handler preserves all seats, directions, final-card timing and sound order",
  inputRequired,
  () => {
    assert.equal(legacyCards.length, 108);
    assert.equal(new Set(legacyCards.map((card) => card.id)).size, 108);
    let checked = 0;
    for (const card of legacyCards)
      for (const seat of [1, 2, 3, 4, 5, 6])
        for (const direction of [1, -1])
          for (const count of [2, 1])
            for (const pending of card.rank === 12 || card.rank === 14 ? [0, 4] : [0])
              for (const dealing of card.rank === 13 ? [0] : [0, 42]) {
                const hand =
                  count === 1 ? [card] : [card, legacyCards.find((other) => other.id !== card.id)];
                const pair = paired({
                  seat,
                  direction,
                  color: card.color || 1,
                  hand,
                  pending,
                  dealing,
                });
                pair.legacy.run(card.key, pair.oldPlayer);
                pair.modern.run(`ku_play_${card.id}`, pair.newPlayer);
                assert.deepEqual(
                  playedSnapshot(pair, seat, true),
                  playedSnapshot(pair, seat, false),
                  JSON.stringify({ card: card.name, seat, direction, count, pending, dealing }),
                );
                assert.equal(
                  pair.modern.global.vars[`p${seat}_num_of_cards`],
                  pair.legacy.global.vars[`p${seat}_num_of_cards`],
                );
                for (const target of [1, 2, 3, 4, 5, 6])
                  assert.equal(
                    pair.modern.global.vars[`num_of_cards_to_draw_p${target}`],
                    pair.legacy.global.vars[`num_of_cards_to_draw_p${target}`] ?? 0,
                  );
                checked++;
              }
    report.checks.cardTransitions = checked;
  },
);

test(
  "all card acceptance predicates retain opening-deal and penalty-defense behavior",
  inputRequired,
  () => {
    let checked = 0;
    for (const card of legacyCards)
      for (const color of [1, 2, 3, 4])
        for (let rank = 0; rank < 15; rank++)
          for (const dealing of [0, 42])
            for (const phase of ["normal", "defend", "drawing"])
              for (const active of [true, false]) {
                const pair = paired({
                  color,
                  rank,
                  dealing,
                  active,
                  hand: [card],
                  pending: phase === "normal" ? 0 : 2,
                  defending: phase !== "drawing",
                });
                const enabled = field(field(legacyGui, "triggers"), `${card.key}_enabled`);
                const oldLimit = field(properties(legacyEffects.get(card.key))[0].value, "limit");
                const newLimit = field(
                  properties(definitions.get(`ku_play_${card.id}`))[0].value,
                  "limit",
                );
                const expected =
                  pair.legacy.condition(enabled, pair.oldPlayer) &&
                  pair.legacy.condition(oldLimit, pair.oldPlayer);
                assert.equal(
                  pair.modern.condition(newLimit, pair.newPlayer),
                  expected,
                  JSON.stringify({ card: card.name, color, rank, dealing, phase, active }),
                );
                checked++;
              }
    report.checks.cardAcceptance = checked;
  },
);

test(
  "replacing a wild during color selection preserves the next player's pending draw and turn",
  inputRequired,
  () => {
    let checked = 0;
    for (const card of legacyCards.filter((entry) => entry.color === 0))
      for (const seat of [1, 2, 3, 4, 5, 6])
        for (const direction of [1, -1])
          for (const color of colorNames) {
            const pair = paired({
              seat,
              direction,
              color: 0,
              rank: 14,
              hand: [card, legacyCards.find((entry) => entry.color === 1)],
            });
            const receiver = ((seat - 1 + direction + 6) % 6) + 1;
            pair.legacy.global.flags.add("player_is_choosing_a_color");
            pair.legacy.global.vars[`num_of_cards_to_draw_p${receiver}`] = 4;
            pair.modern.global.vars.ku_choose_color = 1;
            pair.modern.global.vars.ku_pending = 4;
            pair.legacy.run(card.key, pair.oldPlayer);
            pair.modern.run(`ku_play_${card.id}`, pair.newPlayer);
            assert.deepEqual(
              playedSnapshot(pair, seat, true),
              playedSnapshot(pair, seat, false),
              `${card.name} replacement`,
            );
            assert.equal(
              pair.modern.global.vars[`num_of_cards_to_draw_p${receiver}`],
              pair.legacy.global.vars[`num_of_cards_to_draw_p${receiver}`],
            );
            pair.legacy.run(`color_middle_${color}_click`, pair.oldPlayer);
            pair.modern.run(`choose_${color}_click`, pair.newPlayer);
            assert.deepEqual(
              playedSnapshot(pair, seat, true),
              playedSnapshot(pair, seat, false),
              `${card.name} ${color} selection`,
            );
            assert.equal(pair.modern.global.vars.ku_color, colorNames.indexOf(color) + 1);
            checked++;
          }
    report.checks.wildReplacement = checked;
  },
);

function weight(machine, body, country) {
  const rule = field(body, "ai_will_do");
  let value = Number(atom(field(rule, "base")));
  for (const entry of properties(rule).filter((item) => item.key.text === "modifier")) {
    const condition = {
      kind: "block",
      items: properties(entry.value).filter((item) => item.key.text !== "factor"),
    };
    if (machine.condition(condition, country)) value *= Number(atom(field(entry.value, "factor")));
  }
  return value;
}
test(
  "all 117 original AI weights preserve ordinary, wild, draw-four, color and deck priorities",
  inputRequired,
  () => {
    const source = properties(field(legacyGui, "ai_weights"));
    const output = field(generatedGui, "ai_weights");
    assert.equal(source.length, 117);
    assert.equal(new Set(source.map((entry) => entry.key.text)).size, 117);
    const rows = source.map((entry) => {
      const card = legacyCards.find((candidate) => candidate.key === entry.key.text);
      const generatedKey = card
        ? `play_${card.id}_click`
        : entry.key.text.startsWith("color_middle_")
          ? entry.key.text.replace("color_middle_", "choose_")
          : "deck_click";
      const generated = field(output, generatedKey);
      assert.ok(generated, generatedKey);
      return { original: entry.value, generated, label: entry.key.text };
    });
    let checked = 0;
    function compare(pair, rowsToCheck) {
      for (const row of rowsToCheck) {
        assert.equal(
          weight(pair.modern, row.generated, pair.newPlayer),
          weight(pair.legacy, row.original, pair.oldPlayer),
          row.label,
        );
        checked++;
      }
    }
    for (const color of [0, 1, 2, 3, 4])
      for (let rank = 0; rank < 15; rank++)
        for (const dealing of [-1, 0, 42])
          for (const hand of [[], legacyCards])
            compare(paired({ color, rank, dealing, hand }), rows);
    const colorRules = rows.filter(
      (row) => row.label.startsWith("color_middle_") || row.label.startsWith("wild_color_"),
    );
    for (const card of legacyCards)
      for (const color of [1, 2, 3, 4]) compare(paired({ color, hand: [card] }), colorRules);
    report.checks.aiWeights = checked;
  },
);

test("original localization counters follow dealing, deck colors, reshuffle and reset", () => {
  const machine = new UnoNativeMachine(definitions);
  machine.run("ku_host");
  machine.run("ku_fill_ai");
  machine.run("ku_start");
  function counters() {
    assert.equal(machine.global.vars.num_of_all_cards, machine.global.vars.ku_remaining);
    assert.equal(machine.global.vars.seven_cards, machine.global.vars.ku_dealing);
    assert.equal(
      [...colorNames, "wild"].reduce(
        (sum, color) => sum + machine.global.vars[`num_of_${color}_cards`],
        0,
      ),
      machine.global.vars.ku_remaining,
    );
    for (let seat = 1; seat <= 6; seat++)
      assert.equal(
        machine.global.vars[`p${seat}_num_of_cards`],
        machine.countries[seat - 1].arrays.ku_hand.length,
      );
  }
  counters();
  for (let seat = 1; seat <= 6; seat++)
    for (let card = 0; card < 7; card++) {
      machine.run("ku_draw", machine.countries[seat - 1]);
      counters();
      assert.equal(machine.countries[seat - 1].vars.seven_first_cards, Math.max(5 - card, 0));
    }
  machine.run("ku_reshuffle");
  counters();
  machine.run("ku_reset");
  counters();
  report.checks.localizationCounters = 45;
});

test(
  "original decision order, icons and tooltip keys survive the typed lobby rewrite",
  inputRequired,
  () => {
    const source = field(
      document(original.get("common/decisions/UNO_decisions_OLD.txt")),
      "UNO_decisions",
    );
    const output = field(
      compiled.outputs.find(
        (entry) =>
          entry.path.startsWith("common/decisions/") && !entry.path.includes("/categories/"),
      ).document,
      "UNO_decisions",
    );
    const sourceCategory = field(
      document(original.get("common/decisions/categories/UNO_decisions.txt")),
      "UNO_decisions",
    );
    const outputCategory = field(
      compiled.outputs.find((entry) => entry.path.startsWith("common/decisions/categories/"))
        .document,
      "UNO_decisions",
    );
    assert.equal(atom(field(outputCategory, "priority")), atom(field(sourceCategory, "priority")));
    assert.equal(atom(field(outputCategory, "icon")), atom(field(sourceCategory, "icon")));
    assert.deepEqual(
      properties(output)
        .map((entry) => entry.key.text)
        .sort(),
      properties(source)
        .map((entry) => entry.key.text)
        .sort(),
    );
    for (const entry of properties(source)) {
      const generated = field(output, entry.key.text);
      assert.equal(
        atom(field(generated, "priority")),
        atom(field(entry.value, "priority")),
        entry.key.text,
      );
      assert.equal(
        atom(field(generated, "icon")),
        atom(field(entry.value, "icon")),
        entry.key.text,
      );
      const tooltip = field(field(entry.value, "complete_effect"), "custom_effect_tooltip");
      if (tooltip)
        assert.equal(
          atom(field(field(generated, "complete_effect"), "custom_effect_tooltip")),
          atom(tooltip),
          entry.key.text,
        );
    }
    report.checks.decisions = properties(source).length;
  },
);

after(() => {
  if (!original) return;
  report.sourceScriptSha256 = createHash("sha256")
    .update(original.get("common/scripted_guis/UNO_OLD.txt"))
    .digest("hex");
  report.completed = Object.keys(report.checks).length === 6;
  mkdirSync(resolve(root, "build"), { recursive: true });
  writeFileSync(resolve(root, "build/native-parity.json"), JSON.stringify(report, null, 2) + "\n");
});
