import { ScriptedWindow, For } from "krieg-lang/ui";
import {
  games,
  cards,
  slots,
  cups,
  difficulties,
  resources,
  supported,
  betIdea,
  numbers,
  reds,
} from "./catalogue.krg.ts";
import { canClose, closeGame } from "./casino.krg.ts";
import { canHit, canStand, hit, stand } from "./blackjack.krg.ts";
import { guess, cashOut } from "./highlow.krg.ts";
import { pickCup } from "./cups.krg.ts";
import { numberWords } from "./media.krg.ts";
import styles from "./table.krg.css";
export default [
  ScriptedWindow(
    {
      name: "casino_ui",
      path: "interface/krieg_casino.gui",
      context: "decision_category",
      visible: () => true,
    },
    (ui) => (
      <ui.Container name="casino_ui_window" size={{ width: "100%", height: 250 }}>
        <ui.Icon
          name="casino_background"
          spriteType="GFX_casino_background"
          position={{ x: -3, y: 0 }}
        />
      </ui.Container>
    ),
  ),
  ScriptedWindow(
    {
      name: "blackjack_ui",
      path: "interface/krieg_blackjack.gui",
      context: "player_context",
      visible: (c) => c.triggers.hasIdea("blackjack_on"),
    },
    (ui) => (
      <ui.Container
        name="blackjack_ui_window"
        className={styles.window}
        fadeTime={100}
        fadeType="linear"
        background={{ name: "Background", spriteType: "GFX_blackjack_background" }}
      >
        <For
          each={[
            { who: "player", y: 408 },
            { who: "dealer", y: 137 },
          ]}
        >
          {(row) => (
            <For each={slots}>
              {(slot) => (
                <For each={cards}>
                  {(card) => (
                    <ui.Icon
                      name={`card_${card.code}_slot_${slot}_${row.who}`}
                      position={{ x: 325 + slot * 20, y: row.y }}
                      spriteType={`GFX_${card.image}`}
                      visible={(c) =>
                        c.triggers.hasCountryFlag(`card_${card.code}_${slot}_slot_${row.who}`)
                      }
                    />
                  )}
                </For>
              )}
            </For>
          )}
        </For>
        <ui.Icon
          name="card_covered"
          position={{ x: 365, y: 137 }}
          spriteType="GFX_card_covered"
          visible={(c) => c.triggers.hasCountryFlag("card_dealer_covered")}
        />
        <ui.Button
          name="hit_button"
          position={{ x: 50, y: 450 }}
          className={styles.action}
          clickSound="click_ok"
          text="HIT_BUTTON"
          enabled={canHit}
          click={(c) => c.run(hit)}
        />
        <ui.Button
          name="stand_button"
          position={{ x: 200, y: 450 }}
          className={styles.action}
          clickSound="click_ok"
          text="STAND_BUTTON"
          enabled={canStand}
          click={(c) => c.run(stand)}
        />
        <ui.Text
          name="blackjack_score"
          position={{ x: 10, y: 400 }}
          text="blackjack_score"
          className={styles.label}
        />
        <ui.Text
          name="blackjack_dealer_score"
          position={{ x: 10, y: 100 }}
          text="blackjack_dealer_score"
          className={styles.label}
        />
        <For
          each={[
            { who: "player", y: 400 },
            { who: "dealer", y: 100 },
          ]}
        >
          {(row) => (
            <ui.Text
              name={`${row.who}_bust`}
              position={{ x: 160, y: row.y }}
              text={`${row.who}_bust`}
              className={styles.label}
              visible={(c) => c.variable(`blackjack_${row.who}`) > 21}
            />
          )}
        </For>
        <ui.Text
          name="player_blackjack"
          position={{ x: 160, y: 400 }}
          text="player_blackjack"
          className={styles.label}
          visible={(c) =>
            c.variable("blackjack_player") === 21 && !c.triggers.hasCountryFlag("card_slot_3")
          }
        />
        <ui.Text
          name="dealer_blackjack"
          position={{ x: 160, y: 100 }}
          text="dealer_blackjack"
          className={styles.label}
          visible={(c) =>
            c.variable("blackjack_dealer") === 21 &&
            !c.triggers.hasCountryFlag("no_blackjack_dealer_text")
          }
        />
        <ui.Button
          name="close"
          position={{ x: 660, y: 12 }}
          className={styles.close}
          text="KG_CLOSE"
          tooltip="KG_CLOSE"
          enabled={(c) => canClose(c, games[3])}
          click={(c) => closeGame(c, games[3])}
        />
        <ui.Text
          name="ledger_title"
          text="KG_LEDGER"
          position={{ x: 20, y: 618 }}
          font="hoi_16mbs"
          maxWidth={130}
          maxHeight={24}
        />
        <For each={resources.filter((r) => supported(games[3], r))}>
          {(r, i) => (
            <ui.Icon
              name={`stake_${r.id}`}
              spriteType={`GFX_idea_${betIdea(games[3], r)}`}
              position={{ x: 150 + i * 40, y: 615 }}
              scale={0.5}
              tooltip={betIdea(games[3], r)}
              visible={(c) => c.triggers.hasIdea(betIdea(games[3], r))}
            />
          )}
        </For>
      </ui.Container>
    ),
  ),
  ScriptedWindow(
    {
      name: "highlow_ui",
      path: "interface/krieg_highlow.gui",
      context: "player_context",
      visible: (c) => c.triggers.hasIdea("highlow_on"),
    },
    (ui) => (
      <ui.Container
        name="highlow_ui_window"
        className={styles.window}
        fadeTime={100}
        fadeType="linear"
        background={{ name: "Background", spriteType: "GFX_highlow_background" }}
      >
        <For each={[1, 2, 3, 4, 5]}>
          {(slot) => (
            <ui.Icon
              name={`card_covered${slot}`}
              position={{ x: slot * 150 - 50, y: 200 }}
              spriteType="GFX_card_covered"
              visible={(c) => !c.triggers.hasCountryFlag(`hl_covered${slot}_visible`)}
            />
          )}
        </For>
        <For each={[1, 2, 3, 4, 5]}>
          {(slot) => (
            <For each={cards}>
              {(card) => (
                <ui.Icon
                  name={`card_${card.code}_slot${slot}`}
                  position={{ x: slot * 150 - 50, y: 200 }}
                  spriteType={`GFX_${card.image}`}
                  visible={(c) => c.triggers.hasCountryFlag(`hl_card_${card.code}_slot${slot}`)}
                />
              )}
            </For>
          )}
        </For>
        <For
          each={[
            { id: "higher", text: "HIGHER_BUTTON" },
            { id: "even", text: "EVEN_BUTTON" },
            { id: "lower", text: "LOWER_BUTTON" },
          ]}
        >
          {(row, i) => (
            <ui.Button
              name={`${row.id}_button`}
              position={{ x: 250 + i * 150, y: 400 }}
              text={row.text}
              className={styles.action}
              clickSound="click_ok"
              enabled={(c) => !c.triggers.hasCountryFlag("hl_cannot_click_button")}
              click={(c) => guess(c, row.id)}
            />
          )}
        </For>
        <ui.Button
          name="payout_button"
          position={{ x: 400, y: 450 }}
          text="PAYOUT_BUTTON"
          className={styles.action}
          clickSound="click_ok"
          enabled={(c) =>
            [2, 4, 6, 8].some((rate) => c.variable("multiplier") === rate) &&
            !c.triggers.hasCountryFlag("hl_cannot_click_button")
          }
          click={cashOut}
        />
        <ui.Text
          name="multiplier"
          position={{ x: 360, y: 150 }}
          text="multiplier_text"
          className={styles.label}
        />
        <ui.Button
          name="close"
          position={{ x: 660, y: 12 }}
          className={styles.close}
          text="KG_CLOSE"
          tooltip="KG_CLOSE"
          enabled={(c) => canClose(c, games[2])}
          click={(c) => closeGame(c, games[2])}
        />
        <ui.Text
          name="ledger_title"
          text="KG_LEDGER"
          position={{ x: 20, y: 618 }}
          font="hoi_16mbs"
          maxWidth={130}
          maxHeight={24}
        />
        <For each={resources.filter((r) => supported(games[2], r))}>
          {(r, i) => (
            <ui.Icon
              name={`stake_${r.id}`}
              spriteType={`GFX_idea_${betIdea(games[2], r)}`}
              position={{ x: 150 + i * 40, y: 615 }}
              scale={0.5}
              tooltip={betIdea(games[2], r)}
              visible={(c) => c.triggers.hasIdea(betIdea(games[2], r))}
            />
          )}
        </For>
      </ui.Container>
    ),
  ),
  ScriptedWindow(
    {
      name: "cups_ball_ui",
      path: "interface/krieg_cups.gui",
      context: "player_context",
      visible: (c) =>
        c.triggers.hasIdea("cups_ball_on") &&
        [1, 2, 3].some((n) => c.triggers.hasCountryFlag(`cups_dealer${n}`)),
    },
    (ui) => (
      <ui.Container
        name="cups_ball_ui_window"
        className={styles.window}
        fadeTime={100}
        fadeType="linear"
        background={{ name: "Background", spriteType: "GFX_cups_background" }}
      >
        <For each={[1, 2, 3]}>
          {(n) => (
            <ui.Icon
              name={`cups_dealer${n}`}
              spriteType={`GFX_cups_dealer${n}`}
              position={{ x: 36, y: 40 }}
              alwaysTransparent
              visible={(c) => c.triggers.hasCountryFlag(`cups_dealer${n}`)}
            />
          )}
        </For>
        <ui.Icon
          name="cups_cloud"
          spriteType="GFX_cups_cloud"
          position={{ x: 520, y: 40 }}
          visible={(c) => !c.triggers.hasCountryFlag("hide_the_cloud")}
        />
        <ui.Text
          name="cups_dealer"
          position={{ x: 680, y: 190 }}
          text="cups_dealer"
          className={styles.label}
          visible={(c) => !c.triggers.hasCountryFlag("hide_the_cloud")}
        />
        <For
          each={[
            { id: "one", phase: 0 },
            { id: "two", phase: 1 },
            { id: "three", phase: 2 },
          ]}
        >
          {(row) => (
            <ui.Text
              name={`cups_question_${row.id}`}
              position={{ x: 560, y: 100 }}
              text={`cups_question_${row.id}`}
              font="hoi_22tech"
              maxWidth={220}
              maxHeight={100}
              visible={(c) =>
                row.phase === 0
                  ? !difficulties.some((d) => c.triggers.hasCountryFlag(`cups_difficulty_${d.id}`))
                  : row.phase === 1
                    ? difficulties.some((d) =>
                        c.triggers.hasCountryFlag(`cups_difficulty_${d.id}`),
                      ) && !c.triggers.hasCountryFlag("cant_change_options")
                    : c.triggers.hasCountryFlag("player_chooses_a_cup")
              }
            />
          )}
        </For>
        <For each={cups}>
          {(n) => (
            <ui.Button
              name={`empty_cup${n}`}
              spriteType="GFX_empty_cup"
              position={{ x: n * 100 - 35, y: 450 }}
              visible={(c) =>
                !c.triggers.hasCountryFlag(`cups_results${n}`) &&
                (n === 4
                  ? c.triggers.hasCountryFlag("hide_the_ball")
                  : c.triggers.hasCountryFlag("difficulty_has_been_chosen") &&
                    difficulties
                      .filter((d) => n >= d.first && n <= d.last)
                      .some((d) => c.triggers.hasCountryFlag(`cups_difficulty_${d.id}`)))
              }
              click={(c) => pickCup(c, n)}
            />
          )}
        </For>
        <For each={cups}>
          {(n) => (
            <ui.Icon
              name={`cup_lifted${n}`}
              spriteType="GFX_empty_cup"
              position={{ x: n * 100 - 35, y: 390 }}
              visible={(c) =>
                n === 4
                  ? (c.triggers.hasCountryFlag("cups_results4") ||
                      c.triggers.hasCountryFlag("difficulty_has_been_chosen")) &&
                    !c.triggers.hasCountryFlag("hide_the_ball")
                  : c.triggers.hasCountryFlag(`cups_results${n}`)
              }
            />
          )}
        </For>
        <For each={cups}>
          {(n) => (
            <ui.Icon
              name={`white_ball${n}`}
              spriteType="GFX_white_ball"
              position={{ x: n * 100 - 23, y: 500 }}
              visible={(c) =>
                n === 4
                  ? (c.triggers.hasCountryFlag("cups_results4") ||
                      c.triggers.hasCountryFlag("difficulty_has_been_chosen")) &&
                    !c.triggers.hasCountryFlag("hide_the_ball")
                  : c.triggers.hasCountryFlag(`cups_results${n}`)
              }
            />
          )}
        </For>
        <ui.Button
          name="close"
          position={{ x: 660, y: 12 }}
          className={styles.close}
          text="KG_CLOSE"
          tooltip="KG_CLOSE"
          enabled={(c) => canClose(c, games[1])}
          click={(c) => closeGame(c, games[1])}
        />
        <ui.Text
          name="ledger_title"
          text="KG_LEDGER"
          position={{ x: 20, y: 618 }}
          font="hoi_16mbs"
          maxWidth={130}
          maxHeight={24}
        />
        <For each={resources.filter((r) => supported(games[1], r))}>
          {(r, i) => (
            <ui.Icon
              name={`stake_${r.id}`}
              spriteType={`GFX_idea_${betIdea(games[1], r)}`}
              position={{ x: 150 + i * 40, y: 615 }}
              scale={0.5}
              tooltip={betIdea(games[1], r)}
              visible={(c) => c.triggers.hasIdea(betIdea(games[1], r))}
            />
          )}
        </For>
      </ui.Container>
    ),
  ),
  ScriptedWindow(
    {
      name: "gambling_ui",
      path: "interface/krieg_roulette.gui",
      context: "decision_category",
      visible: () => true,
    },
    (ui) => (
      <ui.Container name="gambling_ui_window" size={{ width: "100%", height: 210 }}>
        <ui.Icon
          name="roulette_bg"
          spriteType="GFX_roulette_background"
          position={{ x: -3, y: 0 }}
        />
        <ui.Text
          name="gambling_text"
          text="gambling_text"
          position={{ x: 260, y: 10 }}
          font="hoi_18mbs"
          maxWidth={300}
          maxHeight={24}
          format="center"
        />
        <For each={numbers}>
          {(n) => (
            <ui.Icon
              name={`number_${numberWords[n]}`}
              spriteType={`GFX_number_${numberWords[n]}`}
              position={{ x: 375, y: 30 }}
              visible={(c) => c.triggers.hasCountryFlag(`number_${n}_drawn`)}
            />
          )}
        </For>
        <For
          each={[
            { id: "red_text", y: 100, ns: numbers.filter((n) => reds.some((r) => r === n)) },
            {
              id: "black_text",
              y: 100,
              ns: numbers.filter((n) => n > 0 && !reds.some((r) => r === n)),
            },
            { id: "green_text", y: 100, ns: [0] },
            { id: "even_text", y: 120, ns: numbers.filter((n) => n > 0 && n % 2 === 0) },
            { id: "odd_text", y: 120, ns: numbers.filter((n) => n % 2 === 1) },
            ...[
              { id: "first", i: 0 },
              { id: "second", i: 1 },
              { id: "third", i: 2 },
            ].map((row) => ({
              id: `${row.id}_dozen`,
              y: 140,
              ns: numbers.filter((n) => n > row.i * 12 && n <= (row.i + 1) * 12),
            })),
            ...[
              { id: "first", i: 1 },
              { id: "second", i: 2 },
              { id: "third", i: 0 },
            ].map((row) => ({
              id: `${row.id}_rank`,
              y: 160,
              ns: numbers.filter((n) => n > 0 && n % 3 === row.i),
            })),
            ...[
              { id: "first", i: 0 },
              { id: "second", i: 1 },
            ].map((row) => ({
              id: `${row.id}_half`,
              y: 180,
              ns: numbers.filter((n) => n > row.i * 18 && n <= (row.i + 1) * 18),
            })),
          ]}
        >
          {(row) => (
            <ui.Text
              name={row.id}
              text={row.id}
              position={{ x: 175, y: row.y }}
              font="hoi_18mbs"
              maxWidth={300}
              maxHeight={24}
              format="right"
              visible={(c) => row.ns.some((n) => c.triggers.hasCountryFlag(`number_${n}_drawn`))}
            />
          )}
        </For>
        <For
          each={[
            { id: "none_text", y: 100 },
            { id: "evenodd_none_text", y: 120 },
            { id: "none_dozen", y: 140 },
            { id: "none_rank", y: 160 },
            { id: "none_half", y: 180 },
          ]}
        >
          {(row) => (
            <ui.Text
              name={row.id}
              text={row.id}
              position={{ x: 175, y: row.y }}
              font="hoi_18mbs"
              maxWidth={300}
              maxHeight={24}
              format="right"
              visible={(c) => !numbers.some((n) => c.triggers.hasCountryFlag(`number_${n}_drawn`))}
            />
          )}
        </For>
        <For
          each={[
            { id: "col_text", y: 100, x: 200 },
            { id: "evenodd_text", y: 120, x: 200 },
            { id: "dozen_text", y: 140, x: 200 },
            { id: "rank_text", y: 160, x: 200 },
            { id: "half_text", y: 180, x: 205 },
          ]}
        >
          {(row) => (
            <ui.Text
              name={row.id}
              text={row.id}
              position={{ x: row.x, y: row.y }}
              font="hoi_18mbs"
              maxWidth={300}
              maxHeight={24}
              format="center"
            />
          )}
        </For>
      </ui.Container>
    ),
  ),
];
