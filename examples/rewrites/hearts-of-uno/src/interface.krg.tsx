import {
  ScriptedWindow,
  For,
  SpriteFile,
  Sprite,
  type GuiBindings,
  type GuiChild,
  type GuiElement,
  type GuiPosition,
} from "krieg-lang/ui";
import { countryTarget, type CountryScope, type Trigger } from "krieg-lang/hoi4";
import { cards, colors, faces, seats, guestSeats, type Card } from "./cards.krg.ts";
import { canPlay, chooseColor, draw, plays, turn } from "./game.krg.ts";
import { cardWeight, colorWeight, deckWeight } from "./ai.krg.ts";
import { uno } from "./state.krg.ts";

// Each position is relative to the viewing player, clockwise around the original table.
const places = [
  { slot: 1, label: { x: 650, y: 650 }, count: { x: 650, y: 600 } },
  { slot: 2, label: { x: 70, y: 400 }, count: { x: 200, y: 500 } },
  { slot: 3, label: { x: 300, y: 200 }, count: { x: 400, y: 300 } },
  { slot: 4, label: { x: 650, y: 30 }, count: { x: 650, y: 200 } },
  { slot: 5, label: { x: 1000, y: 200 }, count: { x: 900, y: 300 } },
  { slot: 6, label: { x: 1220, y: 400 }, count: { x: 1100, y: 500 } },
] as const;
const opponents = [
  { slot: 2, x: 100, singleX: 130, y: 430 },
  { slot: 3, x: 320, singleX: 360, y: 230 },
  { slot: 4, x: 670, singleX: 710, y: 60 },
  { slot: 5, x: 1020, singleX: 1060, y: 230 },
  { slot: 6, x: 1240, singleX: 1270, y: 430 },
] as const;
const colorPositions = [
  { x: 451, y: 550 },
  { x: 451, y: 450 },
  { x: 548, y: 549 },
  { x: 548, y: 450 },
] as const;
const backSizes = [1, 2, 3, 4, 5, 6, 7] as const;

function Label(props: {
  ui: GuiBindings<CountryScope>;
  name: string;
  position: GuiPosition;
  text: string;
  visible: Trigger<CountryScope>;
}): GuiElement {
  return (
    <props.ui.Text
      name={props.name}
      position={props.position}
      text={props.text}
      font="hoi_18mbs"
      format="center"
      maxHeight={24}
      maxWidth={200}
      visible={props.visible}
    />
  );
}

/** Typed content slots keep the frame reusable without hiding game behavior. */
function TableFrame(props: {
  ui: GuiBindings<CountryScope>;
  status: GuiChild;
  children?: GuiChild;
}): GuiElement {
  return (
    <props.ui.Container
      name="UNO_ui_window"
      position={{ x: 0, y: 0 }}
      size={{ width: 800, height: 650 }}
      orientation="CENTER"
      origo="center"
      moveable
      fadeTime={70}
      fadeType="linear"
      clickToFront={false}
      clipping={false}
      background={{ name: "Background", spriteType: "GFX_UNO_background" }}
    >
      {props.status}
      {props.children}
    </props.ui.Container>
  );
}

function handPosition(card: Card): GuiPosition {
  if (card.color === 0)
    return { x: 1300 + ((card.id - 101) % 4) * 25, y: card.rank === 14 ? 700 : 750 };
  // Retain the source's green_1_one coordinate, which shares a later slot.
  return { x: card.id === 77 ? 750 : 50 + ((card.id - 1) % 50) * 25, y: card.id <= 50 ? 700 : 750 };
}

function Hand(props: { ui: GuiBindings<CountryScope> }): GuiElement {
  return (
    <For each={cards}>
      {(card, index) => (
        <props.ui.Button
          name={`play_${card.id}`}
          spriteType={`GFX_card_${card.face}`}
          position={handPosition(card)}
          visible={(country) => country.arrayContains("ku_hand", card.id)}
          enabled={(country) => canPlay(country, card)}
          click={(country) => country.run(plays[index])}
          aiWeight={cardWeight(card)}
        />
      )}
    </For>
  );
}

/** One component maps all six seat perspectives to names, UNO warnings and card backs. */
function Players(props: { ui: GuiBindings<CountryScope> }): GuiElement {
  return (
    <For each={seats}>
      {(viewer) => (
        <>
          <For each={opponents}>
            {(place) => (
              <For each={backSizes}>
                {(count) => (
                  <props.ui.Icon
                    name={`covered_card${count}_p${place.slot}_p${viewer}p`}
                    spriteType={`GFX_card_covered${count}`}
                    position={{ x: count === 1 ? place.singleX : place.x, y: place.y }}
                    tooltip={`UNO_P${((viewer + place.slot - 2) % 6) + 1}_NUM_OF_CARDS`}
                    visible={(country) =>
                      country.variable("ku_seat") === viewer &&
                      country.countryMatches(
                        countryTarget(`event_target:ku_p${((viewer + place.slot - 2) % 6) + 1}`),
                        (player) =>
                          count === 7
                            ? player.variable("ku_hand^num") >= 7
                            : player.variable("ku_hand^num") === count,
                      )
                    }
                  />
                )}
              </For>
            )}
          </For>
          <For each={places}>
            {(place) => (
              <>
                <Label
                  ui={props.ui}
                  name={`player_${place.slot}_p${viewer}p`}
                  position={place.label}
                  text={`player_${((viewer + place.slot - 2) % 6) + 1}`}
                  visible={(country) => country.variable("ku_seat") === viewer}
                />
                <Label
                  ui={props.ui}
                  name={`player_${place.slot}_p${viewer}p_uno`}
                  position={{ x: place.label.x, y: place.label.y - 20 }}
                  text={`player_${((viewer + place.slot - 2) % 6) + 1}_uno`}
                  visible={(country) =>
                    country.variable("ku_seat") === viewer &&
                    uno.dealing <= 0 &&
                    country.countryMatches(
                      countryTarget(`event_target:ku_p${((viewer + place.slot - 2) % 6) + 1}`),
                      (player) => player.variable("ku_hand^num") === 1,
                    )
                  }
                />
                <Label
                  ui={props.ui}
                  name={`player_${place.slot}_num_cards_p${viewer}p`}
                  position={place.count}
                  text={`player_${((viewer + place.slot - 2) % 6) + 1}_num_cards`}
                  visible={(country) =>
                    country.triggers.is_debug(true) && country.variable("ku_seat") === viewer
                  }
                />
              </>
            )}
          </For>
        </>
      )}
    </For>
  );
}

function Status(props: { ui: GuiBindings<CountryScope> }): GuiElement {
  return (
    <>
      <For each={colors}>
        {(color) => (
          <Label
            ui={props.ui}
            name={`current_color_${color.name}`}
            position={{ x: 640, y: 300 }}
            text={`current_color_${color.name}`}
            visible={(country) => country.variable("global.ku_color") === color.id}
          />
        )}
      </For>
      <For
        each={[
          { name: "clockwise_queue", direction: 1 },
          { name: "counter_clockwise_queue", direction: -1 },
        ]}
      >
        {(direction) => (
          <Label
            ui={props.ui}
            name={direction.name}
            position={{ x: 640, y: 320 }}
            text={direction.name}
            visible={(country) =>
              country.triggers.has_global_flag("ku_started") &&
              country.variable("global.ku_direction") === direction.direction
            }
          />
        )}
      </For>
      <For each={seats}>
        {(seat) => (
          <>
            <Label
              ui={props.ui}
              name={`player_${seat}_turn`}
              position={{ x: 650, y: 250 }}
              text={`player_${seat}_turn`}
              visible={(country) => country.variable("global.ku_turn") === seat}
            />
            <Label
              ui={props.ui}
              name={`drawing_cards_number${seat}`}
              position={{ x: 740, y: 520 }}
              text={`drawing_cards_number${seat}`}
              visible={(country) =>
                country.variable("ku_seat") === seat &&
                turn(country) &&
                country.variable("global.ku_pending") > 0
              }
            />
            <Label
              ui={props.ui}
              name={`player_${seat}_perspective`}
              position={{ x: 100, y: 600 }}
              text={`player_${seat}_perspective`}
              visible={(country) =>
                country.triggers.is_debug(true) && country.variable("ku_seat") === seat
              }
            />
            <Label
              ui={props.ui}
              name={`p${seat}_plus`}
              position={{ x: 500, y: 340 + seat * 20 }}
              text={`p${seat}_plus`}
              visible={(country) => country.triggers.is_debug(true)}
            />
          </>
        )}
      </For>
      <Label
        ui={props.ui}
        name="num_of_all_cards"
        position={{ x: 740, y: 500 }}
        text="num_of_all_cards"
        visible={(country) => country.triggers.has_global_flag("ku_started")}
      />
      <Label
        ui={props.ui}
        name="everyone_draws_seven"
        position={{ x: 640, y: 530 }}
        text="everyone_draws_seven"
        visible={(country) =>
          country.triggers.has_global_flag("ku_started") &&
          uno.dealing > 0 &&
          guestSeats.every((seat) => country.triggers.has_global_flag(`ku_seat_${seat}`))
        }
      />
      <Label
        ui={props.ui}
        name="waiting_for_players"
        position={{ x: 640, y: 530 }}
        text="waiting_for_players"
        visible={(country) =>
          country.anyCountry((player) => player.triggers.hasCountryFlag("ku_host")) &&
          !guestSeats.every((seat) => country.triggers.has_global_flag(`ku_seat_${seat}`))
        }
      />
      <Label
        ui={props.ui}
        name="choose_color_middle"
        position={{ x: 450, y: 420 }}
        text="choose_color_middle"
        visible={(country) => turn(country) && country.variable("global.ku_choose_color") === 1}
      />
      <For
        each={[
          { name: "seven_cards", x: 580, y: 360 },
          { name: "num_of_seven_cards", x: 560, y: 360 },
          ...[...colors, { name: "wild", id: 0 }].map((color, index) => ({
            name: `num_of_${color.name}_cards`,
            x: 570,
            y: 380 + index * 20,
          })),
        ]}
      >
        {(label) => (
          <Label
            ui={props.ui}
            name={label.name}
            position={{ x: label.x, y: label.y }}
            text={label.name}
            visible={(country) => country.triggers.is_debug(true)}
          />
        )}
      </For>
    </>
  );
}

export const table = ScriptedWindow(
  {
    name: "UNO_ui",
    path: "interface/UNO.gui",
    context: "player_context",
    visible: (country) =>
      country.triggers.hasCountryFlag("ku_open") ||
      (country.isAI && country.triggers.hasCountryFlag("ku_joined")),
    aiEnabled: (country) => country.isAI && country.triggers.hasCountryFlag("ku_joined"),
    aiCheck: (country) => country.isAI,
    aiCheckScope: turn,
    aiTestInterval: 1,
  },
  (ui) => (
    <TableFrame ui={ui} status={<Status ui={ui} />}>
      <ui.Button
        name="deck"
        spriteType="GFX_UNO_deck"
        position={{ x: 800, y: 350 }}
        tooltip="ku_draw_tt"
        visible={(country) => country.triggers.has_global_flag("ku_started")}
        enabled={(country) =>
          turn(country) &&
          country.variable("global.ku_choose_color") === 0 &&
          country.variable("global.ku_remaining") > 0
        }
        click={(country) => country.run(draw)}
        aiWeight={deckWeight}
      />
      <For each={colors}>
        {(color, index) => (
          <ui.Button
            name={`choose_${color.name}`}
            spriteType={`GFX_color_middle_${color.name}`}
            position={colorPositions[index]}
            visible={(country) => turn(country) && country.variable("global.ku_choose_color") === 1}
            click={(country) => chooseColor(country, color.id)}
            aiWeight={colorWeight(color.id)}
          />
        )}
      </For>
      <For each={faces}>
        {(face) => (
          <ui.Icon
            name={`top_${face.name}`}
            spriteType={`GFX_card_${face.name}`}
            position={{ x: 700, y: 360 }}
            visible={(country) =>
              country.variable("global.ku_rank") === face.rank &&
              (face.color === 0 || country.variable("global.ku_color") === face.color) &&
              country.triggers.has_global_flag("ku_started")
            }
          />
        )}
      </For>
      <Hand ui={ui} />
      <Players ui={ui} />
    </TableFrame>
  ),
);

export const sprites = SpriteFile("interface/UNO.gfx", [
  ...faces.map((face) =>
    Sprite({ name: `GFX_card_${face.name}`, textureFile: `gfx/interface/cards/${face.name}.dds` }),
  ),
  ...backSizes.map((count) =>
    Sprite({
      name: `GFX_card_covered${count}`,
      textureFile: `gfx/interface/cards/covered${count}.dds`,
    }),
  ),
  ...colors.map((color) =>
    Sprite({
      name: `GFX_color_middle_${color.name}`,
      textureFile: `gfx/interface/gui/${color.name}.dds`,
    }),
  ),
  Sprite({ name: "GFX_UNO_deck", textureFile: "gfx/interface/cards/deck.dds" }),
  Sprite({ name: "GFX_UNO_background", textureFile: "gfx/interface/gui/background.dds" }),
  ...["small", "big", "event"].map((name) =>
    Sprite({ name: `GFX_UNO_${name}`, textureFile: `gfx/interface/gui/UNO_${name}.dds` }),
  ),
]);
