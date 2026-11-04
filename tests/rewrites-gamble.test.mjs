import assert from "node:assert/strict";
import { existsSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { compileProject } from "../dist/compiler/index.js";
import {
  gambleInventory,
  loadGamble,
  GambleNativeMachine,
  properties,
  field,
  atom,
} from "./support/gamble-native-machine.mjs";
const root = resolve("examples/rewrites/hearts-of-gamble");
const compiled = compileProject({
  rootDir: root,
  files: readdirSync(root + "/src")
    .filter((f) => /\.krg\.tsx?$/.test(f))
    .map((f) => "src/" + f),
  maxExpansion: 1000000,
});
assert.equal(compiled.success, true, JSON.stringify(compiled.diagnostics));
const rewritten = gambleInventory(
  compiled.outputs.filter((o) => o.document).map((o) => [o.path, o.document]),
);
const originalPath = resolve(
  process.env.KRIEG_PRIVATE_MODS ?? "../private-mods",
  "Hearts-of-Gamble",
);
const original = existsSync(originalPath) ? loadGamble(originalPath) : undefined;
let cases = 0;
function pair(rolls = []) {
  return [new GambleNativeMachine(original, rolls), new GambleNativeMachine(rewritten, rolls)];
}
function same(a, b, label) {
  cases++;
  assert.deepEqual(b.projection(), a.projection(), label);
}
function flags(m) {
  return [...m.country.flags].filter((f) => !f.startsWith("kg_")).sort();
}
function variables(m) {
  return Object.fromEntries(
    Object.entries(m.country.vars)
      .filter(([k]) => !k.startsWith("kg_") && !k.startsWith("krg_"))
      .sort(),
  );
}
function stateSame(a, b, label) {
  same(a, b, label);
  assert.deepEqual(variables(b), variables(a), label + " variables");
  assert.deepEqual(flags(b), flags(a), label + " flags");
}
function seedBets(m, prefix = "") {
  for (const id of rewritten.decisions.keys())
    if (/^(bet_|cups_bet_|hl_bet_)/.test(id) && (!prefix || id.startsWith(prefix)))
      m.country.ideas.add(id + "_idea");
  for (const game of ["roulette", "cups_ball", "highlow", "blackjack"])
    m.country.ideas.add(game + "_on");
}
test("Gamble compiles semantic source with complete entry, gameplay, media and UI definitions", () => {
  assert.equal(rewritten.events.size, 10);
  assert.equal(rewritten.windows.size, 5);
  assert.equal(rewritten.layouts.size, 5);
  assert.ok(rewritten.decisions.size >= 170);
  assert.ok(rewritten.sprites.size >= 300);
  for (const id of [
    "roulette_on",
    "blackjack_on",
    "cups_ball_on",
    "highlow_on",
    "bet_pp",
    "start_new_blackjack",
    "start_new_highlow",
    "start_cups_game",
    "dealer_card8",
    "roulette_number_36",
  ])
    assert.ok(rewritten.decisions.has(id), id);
});
test(
  "all native stake decisions agree on price, strict boundary and duplicate/lock checks",
  { skip: !original },
  () => {
    for (const id of original.decisions.keys())
      if (/^(bet_|cups_bet_|hl_bet_)/.test(id)) {
        for (const scale of [0, 1, 10000]) {
          const [a, b] = pair();
          for (const m of [a, b]) {
            for (const g of ["roulette", "cups_ball", "highlow", "blackjack"])
              m.country.ideas.add(g + "_on");
            if (scale === 0) {
              for (const k of Object.keys(m.country.money)) m.country.money[k] = 0;
              for (const k of Object.keys(m.country.equipment)) m.country.equipment[k] = 0;
            }
            if (scale === 1) {
              Object.assign(m.country.money, {
                pp: 50,
                stability: 0.02,
                ws: 0.02,
                manpower: 10000,
                command: id.startsWith("bet_") ? 10 : 20,
                army: id.startsWith("bet_") ? 15 : 30,
                air: id.startsWith("bet_") ? 15 : 30,
                navy: id.startsWith("bet_") ? 15 : 30,
              });
              Object.assign(m.country.equipment, {
                infantry_equipment: 1000,
                support_equipment: 500,
                artillery_equipment: 500,
                anti_air_equipment: 250,
                anti_tank_equipment: 250,
                convoy_1: 50,
                motorized_equipment: 250,
                train_equipment: id.startsWith("bet_") ? 15 : 20,
              });
            }
          }
          assert.equal(b.decision(id), a.decision(id), id + " affordable " + scale);
          same(a, b, id + " price " + scale);
          assert.deepEqual([...b.country.ideas].sort(), [...a.country.ideas].sort(), id + " ideas");
          assert.equal(b.decision(id), a.decision(id), id + " duplicate");
        }
      }
  },
);
test(
  "roulette all 49 selections × 37 outcomes execute original and emitted event payouts",
  { skip: !original },
  () => {
    const choices = [...original.decisions.keys()].filter((id) =>
      /^roulette_(?:color_(?:red|black)|even$|odd$|dozen_(?:one|two|three)|rank_(?:one|two|three)|half_(?:one|two)|number_\d+$)/.test(
        id,
      ),
    );
    assert.equal(choices.length, 49);
    for (const id of choices)
      for (let n = 0; n <= 36; n++) {
        const [a, b] = pair();
        for (const m of [a, b]) {
          seedBets(m, "bet_");
          m.country.flags.add("you_put_a_bet");
          m.decision(id);
          m.country.ideas.add("number_" + n + "_drawn");
        }
        const options = a.options("gamble.1");
        assert.deepEqual(b.options("gamble.1"), options, id + " outcome " + n);
        for (const option of options) {
          a.option("gamble.1", option);
          b.option("gamble.1", option);
        }
        same(a, b, id + " payout " + n);
      }
  },
);
test(
  "cups three difficulties and every possible selected/revealed cup have identical rewards",
  { skip: !original },
  () => {
    for (const [difficulty, first, last] of [
      ["easy", 3, 5],
      ["medium", 2, 6],
      ["hard", 1, 7],
    ])
      for (let pick = first; pick <= last; pick++)
        for (let result = first; result <= last; result++) {
          const [a, b] = pair();
          for (const m of [a, b]) {
            seedBets(m, "cups_bet_");
            m.country.flags.add("cups_difficulty_" + difficulty);
            m.country.flags.add("player_picked_cup_" + pick);
            m.country.flags.add("cups_results" + result);
            m.country.flags.add("cant_change_options");
          }
          const options = a.options("cups.1");
          assert.deepEqual(b.options("cups.1"), options);
          a.option("cups.1", options[0]);
          b.option("cups.1", options[0]);
          stateSame(a, b, "cups " + difficulty + " " + pick + "/" + result);
        }
  },
);
test(
  "high-low ×0/2/4/6/8 and blackjack natural/win/draw/loss/insurance pay every stake",
  { skip: !original },
  () => {
    for (const rate of [0, 2, 4, 6, 8]) {
      const [a, b] = pair();
      for (const m of [a, b]) {
        seedBets(m, "hl_bet_");
        m.country.vars.multiplier = rate;
        m.country.flags.add("hl_game_started");
      }
      assert.deepEqual(b.options("highlow.1"), a.options("highlow.1"));
      const opt = a.options("highlow.1")[0];
      a.option("highlow.1", opt);
      b.option("highlow.1", opt);
      stateSame(a, b, "highlow payout " + rate);
    }
    for (const id of [1, 2, 3, 5, 6, 7])
      for (const insured of [false, true]) {
        const [a, b] = pair();
        for (const m of [a, b]) seedBets(m, "bet_");
        const option = `blackjack.${id}.${id < 3 && !insured ? "b" : "a"}`;
        a.option("blackjack." + id, option);
        b.option("blackjack." + id, option);
        stateSame(a, b, option);
        if (id < 3 && insured) {
          a.option("blackjack.4", "blackjack.4.a");
          b.option("blackjack.4", "blackjack.4.a");
          stateSame(a, b, "insurance payout " + id);
        }
      }
  },
);
test(
  "every draw outcome agrees across high-low stages, blackjack opening, dealer and player limits",
  { skip: !original },
  () => {
    const missions = [
      "player_card1",
      "dealer_card1",
      "player_card2",
      "dealer_reveals_second_card_2",
      "dealer_card3",
      "dealer_card4",
      "dealer_card5",
      "dealer_card6",
      "dealer_card7",
      "dealer_card8",
      "highlow_card1",
      "highlow_card2",
      "highlow_card3",
      "highlow_card4",
      "highlow_card5",
    ];
    for (const id of missions)
      for (const total of [0, 11, 16, 17, 20, 21])
        for (let i = 0; i < 52; i++) {
          const [a, b] = pair([(i + 0.5) / 52]);
          for (const m of [a, b]) {
            Object.assign(m.country.vars, {
              blackjack_player: total,
              blackjack_dealer: total,
              number_of_aces_player: 1,
              number_of_aces_dealer: 1,
              first_card_power: 8,
              second_card_power: 8,
              third_card_power: 8,
              fourth_card_power: 8,
            });
            m.country.flags.add("higher_chosen");
            m.country.flags.add("hl_cannot_click_button");
          }
          a.timeout(id);
          b.timeout(id);
          stateSame(a, b, id + " " + total + " branch " + i);
        }
    for (const slot of [3, 4, 5, 6, 7, 8])
      for (const total of [10, 11, 16, 20, 21])
        for (let i = 0; i < 52; i++) {
          const [a, b] = pair([(i + 0.5) / 52]);
          for (const m of [a, b]) {
            Object.assign(m.country.vars, { blackjack_player: total, number_of_aces_player: 1 });
            for (let n = 3; n < slot; n++) m.country.flags.add("card_slot_" + n);
          }
          a.click("blackjack_ui", "hit_button");
          b.click("blackjack_ui", "hit_button");
          stateSame(a, b, "hit slot " + slot + " total " + total + " branch " + i);
        }
  },
);
test(
  "native timed lifecycles and UI enabled state follow rounds, insurance and result cleanup",
  { skip: !original },
  () => {
    for (const rolls of [
      [0, 0, 0],
      [0.99, 0.99, 0.99],
      [0.2, 0.2, 0.2],
    ]) {
      const [a, b] = pair(rolls);
      for (const m of [a, b]) {
        m.decision("blackjack_on");
        m.decision("bet_pp_bj");
        m.decision("start_new_blackjack");
        for (const id of [
          "blackjack_start",
          "player_card1",
          "dealer_card1",
          "player_card2",
          "dealer_card2_covered",
          "summing_round",
        ])
          m.timeout(id);
      }
      same(a, b, "opening");
      for (const button of ["hit_button", "stand_button"])
        assert.equal(b.enabled("blackjack_ui", button), a.enabled("blackjack_ui", button));
    }
    const [a, b] = pair([0]);
    for (const m of [a, b]) {
      m.decision("roulette_on");
      if (!m.country.missions.has("roulette_start")) m.country.missions.add("roulette_start");
      m.timeout("roulette_start");
      m.decision("bet_pp");
      m.decision("roulette_number_0");
      m.timeout("bet_time");
      m.timeout("spin_time");
      m.timeout("result_time");
    }
    same(a, b, "roulette loop");
    assert.deepEqual(b.options("gamble.1"), a.options("gamble.1"));
    assert.deepEqual(b.options("gamble.1"), ["gamble.1.f"]);
  },
);
test(
  "all original GUI predicates are exercised against emitted visibility and input gating",
  { skip: !original },
  () => {
    let predicates = 0;
    function refs(body) {
      return properties(body).flatMap((p) =>
        p.key.text === "has_country_flag"
          ? [atom(p.value)]
          : p.value.kind === "block"
            ? refs(p.value)
            : [],
      );
    }
    for (const [gui, window] of original.windows) {
      const originalTests = field(window, "triggers");
      if (!originalTests) continue;
      const emitted = field(rewritten.windows.get(gui), "triggers");
      for (const p of properties(originalTests)) {
        const match = field(emitted, p.key.text);
        assert.ok(match, gui + "/" + p.key.text + " missing");
        const inputs = [...new Set([...refs(p.value), ...refs(match)])];
        const sets = [[], inputs, ...inputs.map((f) => [f])];
        for (const chosen of sets)
          for (const total of [0, 21, 22]) {
            const [a, b] = pair();
            for (const m of [a, b]) {
              m.country.flags = new Set(chosen);
              Object.assign(m.country.vars, {
                blackjack_player: total,
                blackjack_dealer: total,
                multiplier: total === 0 ? 2 : total,
              });
            }
            assert.equal(
              b.condition(match, b.country),
              a.condition(p.value, a.country),
              gui + "/" + p.key.text + " flags " + chosen + " total " + total,
            );
            predicates++;
          }
      }
    }
    cases += predicates;
    assert.ok(predicates > 5000);
  },
);
test(
  "all original leaf decision and idea identifiers remain available",
  { skip: !original },
  () => {
    assert.deepEqual([...rewritten.decisions.keys()].sort(), [...original.decisions.keys()].sort());
    assert.deepEqual([...rewritten.ideas.keys()].sort(), [...original.ideas.keys()].sort());
    for (const idea of rewritten.ideas.values()) assert.ok(field(idea, "allowed_civil_war"));
  },
);
test(
  "insurance peek branches, stale dealer flag and restricted hole cards match the source",
  { skip: !original },
  () => {
    for (const id of [1, 2, 3])
      for (const stale of [false, true])
        for (const roll of [0, 0.999999])
          for (const next of [0, 0.5, 0.999999]) {
            const [a, b] = pair([roll, next, next]);
            for (const m of [a, b]) {
              m.country.vars.blackjack_dealer = id === 3 ? 10 : 11;
              m.country.vars.number_of_aces_dealer = id === 3 ? 0 : 1;
              m.country.flags.add("card_dealer_covered");
              m.country.flags.add("bought_insurance");
              if (stale) m.country.flags.add("dealer_has_not_blackjack");
            }
            a.timeout("dealer_is_checking_blackjack_" + id);
            b.timeout("dealer_is_checking_blackjack_" + id);
            stateSame(a, b, "peek " + id + "/" + stale + "/" + roll + "/" + next);
          }
    for (let i = 0; i < 36; i++) {
      const [a, b] = pair([(i + 0.5) / 36]);
      for (const m of [a, b]) {
        m.country.vars.blackjack_dealer = 11;
        m.country.vars.blackjack_player = 18;
        m.country.vars.number_of_aces_dealer = 1;
        m.country.flags.add("card_dealer_covered");
      }
      a.timeout("dealer_reveals_second_card_1");
      b.timeout("dealer_reveals_second_card_1");
      stateSame(a, b, "restricted card " + i);
    }
  },
);
test(
  "write reproducible native-oracle report when private inputs are present",
  { skip: !original },
  () => {
    mkdirSync(root + "/build", { recursive: true });
    writeFileSync(
      root + "/build/native-oracle.json",
      JSON.stringify(
        {
          schema: 1,
          cases,
          originalPath,
          compiledFiles: compiled.outputs.length,
          scope:
            "Independent interpreter executes original PDX and compiled PDX; no HOI4 engine, visual fonts or event-popup scheduling guarantee.",
          notSemantics: "NOR: verified against supplied official Wiki Triggers section",
        },
        null,
        2,
      ),
    );
    assert.ok(cases > 6000);
  },
);
