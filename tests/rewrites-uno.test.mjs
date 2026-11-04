import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { compileProject, emitCompileOutput } from "../dist/compiler/index.js";
import { parsePdx } from "../dist/pdx/index.js";
import { readOriginal } from "../scripts/rewrite-inputs.mjs";
import { UnoNativeMachine, properties, field } from "./support/uno-native-machine.mjs";

const root = resolve("examples/rewrites/hearts-of-uno");
const result = compileProject({
  rootDir: root,
  files: [
    "src/cards.krg.ts",
    "src/game.krg.ts",
    "src/decisions.krg.ts",
    "src/interface.krg.tsx",
    "src/audio.krg.ts",
  ],
});
assert.equal(result.success, true, JSON.stringify(result.diagnostics));
const definitions = new Map(
  result.outputs
    .filter((o) => o.path.startsWith("common/scripted_effects/"))
    .flatMap((o) => properties(o.document).map((p) => [p.key.text, p.value])),
);
const window = field(
  field(result.outputs.find((o) => o.path.includes("scripted_guis/")).document, "scripted_gui"),
  "UNO_ui",
);
for (const click of properties(field(window, "effects")))
  definitions.set(click.key.text, click.value);
const inputPath = resolve(process.env.KRIEG_PRIVATE_MODS ?? "../private-mods");
const originals = existsSync(inputPath) ? readOriginal(inputPath, "hearts-of-uno") : undefined;
function originalDocument(path) {
  const bytes = originals?.get(path);
  assert.ok(bytes, `Missing pinned original ${path}`);
  const parsed = parsePdx(Buffer.from(bytes).toString("utf8"));
  assert.equal(parsed.diagnostics.filter((d) => d.severity === "error").length, 0);
  return parsed.document;
}
function game() {
  return new UnoNativeMachine(definitions);
}
function started() {
  const machine = game();
  machine.run("ku_host");
  machine.run("ku_fill_ai");
  machine.run("ku_start");
  return machine;
}
function playState(card, seat = 1) {
  const machine = game();
  machine.global.flags.add("ku_started");
  Object.assign(machine.global.vars, {
    ku_turn: seat,
    ku_direction: 1,
    ku_color: 1,
    ku_rank: 0,
    ku_top: 1,
  });
  const player = machine.countries[seat - 1];
  player.vars.ku_seat = seat;
  player.arrays.ku_hand = [card, 80];
  return machine;
}

test("UNO emits every physical card in its original slot with bound actions and source-owned assets", () => {
  assert.equal([...definitions.keys()].filter((key) => key.startsWith("ku_play_")).length, 108);
  const ui = result.outputs.find((o) => o.path === "interface/UNO.gui");
  const gui = emitCompileOutput(result.outputs.find((o) => o.path.includes("scripted_guis/")));
  assert.match(gui, /play_1_visible = \{\s+is_in_array = \{\s+array = ku_hand\s+value = 1/);
  assert.match(gui, /play_108_click = \{\s+ku_play_108 = yes/);
  assert.equal((emitCompileOutput(ui).match(/name = "play_\d+"/g) ?? []).length, 108);
  const sounds = emitCompileOutput(result.outputs.find((o) => o.path === "sound/krieg_uno.asset"));
  assert.doesNotMatch(sounds, /place_card\.wav/); // the archive's original sound declaration references this missing file
  assert.match(sounds, /file = "UNO\/card_dealt.wav"/);
  assert.equal((sounds.match(/max_audible = 1/g) ?? []).length, 12);
  assert.equal((sounds.match(/max_audible_behaviour = fail/g) ?? []).length, 12);
});

test("six-country lobby, manual seven-card deal and physical deck conservation execute from compiled native scripts", () => {
  const machine = started();
  assert.equal(machine.global.vars.ku_remaining, 107);
  assert.equal(machine.global.vars.ku_dealing, 42);
  assert.ok(machine.global.vars.ku_top >= 1 && machine.global.vars.ku_top <= 100);
  assert.equal(machine.countries.filter((c) => c.flags.has("ku_joined")).length, 6);
  assert.deepEqual(
    machine.countries.map((c) => c.arrays.ku_hand.length),
    [0, 0, 0, 0, 0, 0],
  );
  for (let seat = 1; seat <= 6; seat++) {
    for (let draw = 0; draw < 7; draw++) {
      assert.equal(machine.global.vars.ku_turn, seat);
      machine.run("ku_draw", machine.countries[seat - 1]);
    }
  }
  assert.equal(machine.global.vars.ku_dealing, 0);
  assert.equal(machine.global.vars.ku_turn, 1);
  assert.equal(machine.global.vars.ku_remaining, 65);
  const held = machine.countries.flatMap((c) => c.arrays.ku_hand);
  assert.equal(held.length, 42);
  assert.equal(new Set([...held, machine.global.vars.ku_top]).size, 43);
  for (const id of held) assert.equal(machine.global.vars[`ku_deck_${id}`], 0);
  assert.equal(
    Object.entries(machine.global.vars).filter(
      ([key, value]) => key.startsWith("ku_deck_") && value === 1,
    ).length,
    65,
  );
});

test("an opening draw-two card is displayed without executing its penalty, as in the uploaded start decision", () => {
  const machine = new UnoNativeMachine(definitions, 0);
  machine.run("ku_host");
  machine.run("ku_fill_ai");
  machine.run("ku_start");
  assert.equal(machine.global.vars.ku_top, 24);
  assert.equal(machine.global.vars.ku_rank, 12);
  assert.equal(machine.global.vars.ku_pending, 0);
  assert.equal(machine.global.vars.ku_turn, 1);
  assert.equal(machine.global.vars.ku_direction, 1);
});

test("wrong turn, wrong color and unowned cards cannot play", () => {
  for (const mutate of [
    (m) => (m.global.vars.ku_turn = 2),
    (m) => (m.global.vars.ku_color = 2),
    (m) => (m.countries[0].arrays.ku_hand = [80]),
  ]) {
    const machine = playState(2);
    mutate(machine);
    const before = JSON.stringify({ g: machine.global.vars, h: machine.countries[0].arrays });
    machine.run("ku_play_2");
    assert.equal(
      JSON.stringify({ g: machine.global.vars, h: machine.countries[0].arrays }),
      before,
    );
  }
});

test("native skip/reverse/wild/stacked penalties have the observed six-player transitions", () => {
  let machine = playState(20);
  machine.run("ku_play_20");
  assert.equal(machine.global.vars.ku_turn, 3);
  machine = playState(22);
  machine.run("ku_play_22");
  assert.equal(machine.global.vars.ku_turn, 6);
  assert.equal(machine.global.vars.ku_direction, -1);
  machine = playState(24);
  machine.run("ku_play_24");
  assert.equal(machine.global.vars.ku_pending, 2);
  assert.equal(machine.global.vars.ku_turn, 2);
  machine.countries[1].vars.ku_seat = 2;
  machine.countries[1].arrays.ku_hand = [105, 80];
  machine.run("ku_play_105", machine.countries[1]);
  assert.equal(machine.global.vars.ku_pending, 6);
  assert.equal(machine.global.vars.ku_choose_color, 1);
  assert.equal(machine.global.vars.ku_turn, 2);
  machine = playState(101);
  machine.run("ku_play_101");
  assert.equal(machine.global.vars.ku_choose_color, 1);
  assert.equal(machine.global.vars.ku_turn, 1);
});

test("reshuffle retains the original current-card recycling edge case; reset clears only UNO state", () => {
  const machine = started();
  machine.countries[0].arrays.ku_hand = [2, 3];
  machine.countries[1].arrays.ku_hand = [4];
  machine.global.vars.ku_top = 1;
  machine.run("ku_reshuffle");
  assert.equal(machine.global.vars.ku_remaining, 105);
  assert.equal(machine.global.vars.ku_deck_1, 1);
  for (const id of [2, 3, 4]) assert.equal(machine.global.vars[`ku_deck_${id}`], 0);
  machine.countries[0].flags.add("unrelated_mod");
  machine.global.vars.unrelated_mod = 91;
  machine.run("ku_reset");
  assert.equal(machine.global.vars.ku_remaining, 0);
  assert.equal(machine.global.flags.has("ku_lobby"), false);
  assert.ok(machine.countries.every((c) => c.arrays.ku_hand.length === 0));
  assert.equal(Object.keys(machine.targets).length, 0);
  assert.equal(machine.global.vars.unrelated_mod, 91);
  assert.ok(machine.countries[0].flags.has("unrelated_mod"));
});

test("the final card advances and schedules result events while reset waits for acknowledgement", () => {
  const machine = playState(1);
  machine.countries[0].arrays.ku_hand = [1];
  machine.run("ku_play_1");
  assert.equal(machine.global.flags.has("ku_started"), true);
  assert.equal(machine.global.vars.ku_turn, 2);
  assert.ok(machine.countries[0].flags.has("ku_winner"));
  assert.equal(machine.events.length, 6);
  assert.ok(machine.events.every((e) => e.id === "uno.1"));
});

test(
  "uploaded original native handlers independently agree for normal/skip/reverse/draw-two/wild moves",
  { skip: !originals },
  () => {
    const document = originalDocument("common/scripted_guis/UNO_OLD.txt");
    const source = field(field(field(document, "scripted_gui"), "UNO_ui"), "effects");
    const original = new Map(properties(source).map((p) => [p.key.text, p.value]));
    const cases = [
      { id: 1, key: "red_0", rank: "zero" },
      { id: 20, key: "red_block_one", rank: "block" },
      { id: 22, key: "red_reverse_one", rank: "reverse" },
      { id: 24, key: "red_plus_one", rank: "plus" },
      { id: 101, key: "wild_color_one", rank: "wild_color" },
      { id: 105, key: "wild_plus_one", rank: "wild_plus" },
    ];
    for (const entry of cases)
      for (const count of [2, 1]) {
        const legacy = new UnoNativeMachine(original),
          modern = playState(entry.id);
        for (const flag of [
          "game_started",
          "clockwise_queue",
          "red_middle",
          "zero_middle",
          "player_1_turn",
        ])
          legacy.global.flags.add(flag);
        legacy.countries[0].flags.add("this_is_player_1");
        legacy.countries[0].flags.add(`card_${entry.key}`);
        legacy.global.vars.p1_num_of_cards = count;
        if (count === 1) modern.countries[0].arrays.ku_hand = [entry.id];
        legacy.run(`${entry.key}_p1_click`);
        modern.run(`ku_play_${entry.id}`);
        const legacyTurn = [1, 2, 3, 4, 5, 6].find((seat) =>
          legacy.global.flags.has(`player_${seat}_turn`),
        );
        assert.equal(modern.global.vars.ku_turn, legacyTurn, entry.key + " turn");
        assert.equal(
          modern.global.vars.ku_direction,
          legacy.global.flags.has("clockwise_queue") ? 1 : -1,
          entry.key + " direction",
        );
        assert.equal(
          modern.countries[0].arrays.ku_hand.length,
          legacy.global.vars.p1_num_of_cards,
          entry.key + " hand",
        );
        assert.equal(
          legacy.countries[0].flags.has(`card_${entry.key}`),
          false,
          entry.key + " removed",
        );
        assert.ok(legacy.global.flags.has(`${entry.rank}_middle`), entry.key + " top rank");
        assert.equal(
          Boolean(modern.global.vars.ku_choose_color),
          legacy.global.flags.has("player_is_choosing_a_color"),
          entry.key + " color phase",
        );
        if (entry.id === 24 || entry.id === 105)
          assert.equal(modern.global.vars.ku_pending, legacy.global.vars.num_of_cards_to_draw_p2);
        assert.equal(
          modern.global.flags.has("ku_started"),
          legacy.global.flags.has("game_started"),
          entry.key + " result timing",
        );
        assert.equal(modern.events.length, legacy.events.length, entry.key + " result recipients");
        if (entry.id === 101 || entry.id === 105) {
          legacy.run("color_middle_red_click");
          modern.run("choose_red_click");
          assert.equal(
            modern.global.vars.ku_turn,
            [1, 2, 3, 4, 5, 6].find((seat) => legacy.global.flags.has(`player_${seat}_turn`)),
            entry.key + " chosen color turn",
          );
          assert.equal(modern.global.vars.ku_choose_color, 0);
          assert.equal(legacy.global.flags.has("player_is_choosing_a_color"), false);
        }
      }
    const legacy = new UnoNativeMachine(original),
      modern = playState(1);
    legacy.countries[0].flags.add("this_is_player_1");
    legacy.countries[0].vars.seven_first_cards = 6;
    for (const flag of [
      "game_started",
      "clockwise_queue",
      "red_middle",
      "zero_middle",
      "player_1_turn",
    ])
      legacy.global.flags.add(flag);
    Object.assign(legacy.global.vars, {
      seven_cards: 42,
      num_of_all_cards: 25,
      num_of_red_cards: 25,
      p1_num_of_cards: 0,
    });
    legacy.global.vars.red_0 = 1;
    for (const rank of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "block", "reverse", "plus"])
      for (const copy of ["one", "two"]) legacy.global.vars[`red_${rank}_${copy}`] = 1;
    modern.countries[0].arrays.ku_hand = [];
    modern.countries[0].vars.ku_deal_remaining = 7;
    Object.assign(modern.global.vars, { ku_dealing: 42, ku_remaining: 25, ku_top: 26 });
    for (let id = 1; id <= 108; id++) modern.global.vars[`ku_deck_${id}`] = id <= 25 ? 1 : 0;
    for (let index = 0; index < 7; index++) {
      legacy.run("deck_of_cards_red_click");
      modern.run("ku_draw");
      assert.equal(modern.countries[0].arrays.ku_hand.length, legacy.global.vars.p1_num_of_cards);
      assert.equal(modern.global.vars.ku_remaining, legacy.global.vars.num_of_all_cards);
      assert.equal(modern.global.vars.ku_dealing, legacy.global.vars.seven_cards);
    }
    assert.equal(modern.global.vars.ku_turn, 2);
    assert.ok(legacy.global.flags.has("player_2_turn"));
    const decisions = originalDocument("common/decisions/UNO_decisions_OLD.txt");
    const reshuffle = field(
      field(field(field(decisions, "UNO_decisions"), "UNO_reshuffle_the_deck"), "complete_effect"),
      "hidden_effect",
    );
    const oldShuffle = new UnoNativeMachine(original),
      newShuffle = playState(1);
    oldShuffle.global.flags.add("red_middle");
    oldShuffle.global.flags.add("zero_middle");
    oldShuffle.countries[0].flags.add("card_red_1_one");
    oldShuffle.countries[0].flags.add("card_red_1_two");
    oldShuffle.countries[1].flags.add("card_red_2_one");
    newShuffle.countries[0].arrays.ku_hand = [2, 3];
    newShuffle.countries[1].arrays.ku_hand = [4];
    oldShuffle.execute(reshuffle, oldShuffle.countries[0]);
    newShuffle.run("ku_reshuffle");
    assert.equal(newShuffle.global.vars.ku_remaining, oldShuffle.global.vars.num_of_all_cards);
    assert.equal(newShuffle.global.vars.ku_deck_1, oldShuffle.global.vars.red_0);
    assert.equal(newShuffle.global.vars.ku_deck_1, 1); // preserve the upstream top-card recycling edge
  },
);
