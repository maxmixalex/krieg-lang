/** Compile-time HOI4 interface components. These functions are never executed. */
import type {
  Definition,
  Effect,
  Trigger,
  GuiAiWeight,
  GuiParentWindowToken,
  ScriptedGuiContext,
  ScriptedGuiScope,
  ScriptedGuiSpec,
} from "../sdk/index.js";
import type { NativeIntrinsicElements } from "./native.js";
export * from "./native.js";

export interface GuiElement {
  readonly __kriegGuiElement: unique symbol;
}
export type GuiChild = GuiElement | readonly GuiChild[] | boolean | null | undefined;
export type GuiCoordinate = number | `${number}%` | `@${string}`;
export interface GuiPosition {
  x: GuiCoordinate;
  y: GuiCoordinate;
}
export interface GuiSize {
  width: GuiCoordinate;
  height: GuiCoordinate;
}
export type GuiOrientation =
  | "UPPER_LEFT"
  | "UPPER_RIGHT"
  | "LOWER_LEFT"
  | "LOWER_RIGHT"
  | "CENTER"
  | "CENTER_UP"
  | "CENTER_DOWN"
  | "CENTER_LEFT"
  | "CENTER_RIGHT"
  | "RIGHT"
  | "LEFT"
  | "CENTER_LOWER"
  | "UP"
  | "DOWN";
export type GuiOrigin =
  | "center"
  | "center_up"
  | "center_down"
  | "center_left"
  | "center_right"
  | "lower_left"
  | "lower_right"
  | "upper_right"
  | "upper_left"
  | "right"
  | "left";
export interface ElementProps {
  name: string;
  position?: GuiPosition;
  size?: GuiSize;
  orientation?: GuiOrientation;
  origo?: GuiOrigin;
  scale?: number;
  rotation?: number;
  hide?: boolean;
  tooltip?: string;
  tooltipDelayed?: string;
}
export interface ContainerProps extends ElementProps {
  children?: GuiChild;
  moveable?: boolean;
  clipping?: boolean;
  fullscreen?: boolean;
  verticalScrollbar?: string;
  horizontalScrollbar?: string;
  autohideScrollbars?: boolean;
  clickToFront?: boolean;
  smoothScrolling?: boolean | number;
  scrollWheelFactor?: number;
}
export interface IconProps extends ElementProps {
  spriteType: string;
  frame?: number;
  alwaysTransparent?: boolean;
  centerPosition?: boolean;
}
export interface ButtonProps extends ElementProps {
  spriteType?: string;
  text?: string;
  font?: string;
  shortcut?: string;
  frame?: number;
  borderSize?: GuiPosition;
  format?: "left" | "center" | "right";
  multiline?: boolean;
  noClickSound?: boolean;
}
export interface TextProps extends ElementProps {
  text: string;
  font?: string;
  maxWidth?: GuiCoordinate;
  maxHeight?: GuiCoordinate;
  format?: "left" | "center" | "right";
  verticalAlignment?: "top" | "center" | "bottom";
  multiline?: boolean;
  fixedSize?: boolean;
  alwaysTransparent?: boolean;
  borderSize?: GuiPosition;
}
export interface GridBoxProps extends ElementProps {
  slotsize?: GuiSize;
  maxSlotsHorizontal?: number;
  maxSlotsVertical?: number;
  format?: GuiOrientation;
  addHorizontal?: boolean;
  padding?: { top?: number; bottom?: number; left?: number; right?: number };
}
export interface ListBoxProps extends ElementProps {
  horizontal?: 0 | 1;
  spacing?: number;
  scrollbartype?: string;
  borderSize?: GuiPosition;
  offset?: GuiPosition;
  alwaysTransparent?: boolean;
}
export declare function Container(props: ContainerProps): GuiElement;
export declare function Icon(props: IconProps): GuiElement;
export declare function Button(props: ButtonProps): GuiElement;
export declare function Text(props: TextProps): GuiElement;
export declare function GridBox(props: GridBoxProps): GuiElement;
export declare function ListBox(props: ListBoxProps): GuiElement;
/** Repeated children stay in source order and lower to repeated native guiTypes entries. */
export declare function GuiFile(path: string, elements: GuiChild): Definition;

/** A reference to an existing game variable, without allocating or initializing it. */
export interface GuiVariable<Name extends string = string> {
  /** Use this name with native setVariable/addToVariable and the window's dirty field. */
  readonly name: Name;
  readonly __kriegGuiVariable: unique symbol;
}

/**
 * Bind a scripted window property to a native game variable.
 * Numeric values are constants; variable references remain unquoted native names.
 * This does not create a variable or add an automatic dirty update.
 *
 * @example
 * ```tsx
 * const frame = GuiVariable("programme_frame");
 * // Inside ScriptedWindow's layout callback:
 * // <ui.Icon name="status" spriteType="GFX_status" properties={{ frame }} />
 * ```
 */
export declare function GuiVariable<const Name extends string>(name: Name): GuiVariable<Name>;

export interface GuiPositionBindings {
  x?: number | GuiVariable;
  y?: number | GuiVariable;
}
export interface GuiFrameBindings extends GuiPositionBindings {
  frame?: number | GuiVariable;
}
export interface GuiTextureBindings extends GuiFrameBindings {
  image?: string;
}
/** Visibility is an engine trigger, evaluated in the enclosing window's context. */
export interface GuiElementBindings<S> {
  visible?: Trigger<S>;
  properties?: GuiPositionBindings;
}
export interface GuiButtonBindings<S> extends GuiElementBindings<S> {
  click?: Effect<S>;
  enabled?: Trigger<S>;
  aiWeight?: GuiAiWeight<S>;
  properties?: GuiFrameBindings;
}
export interface GuiIconBindings<S> extends GuiElementBindings<S> {
  properties?: GuiTextureBindings;
}

/** Contextual components supplied by ScriptedWindow; ordinary source helpers can forward them. */
export interface GuiBindings<S> {
  Container(props: ContainerProps & GuiElementBindings<S>): GuiElement;
  Button(props: ButtonProps & GuiButtonBindings<S>): GuiElement;
  Icon(props: IconProps & GuiIconBindings<S>): GuiElement;
  Text(props: TextProps & GuiElementBindings<S>): GuiElement;
  GridBox(props: GridBoxProps & GuiElementBindings<S>): GuiElement;
  ListBox(props: ListBoxProps & GuiElementBindings<S>): GuiElement;
}

export type ScriptedWindowParent =
  | { parentWindowToken?: never; parentWindowName?: never; parentScriptedGui?: never }
  | {
      parentWindowToken: GuiParentWindowToken;
      parentWindowName?: never;
      parentScriptedGui?: never;
    }
  | { parentWindowToken?: never; parentWindowName: string; parentScriptedGui?: never }
  | { parentWindowToken?: never; parentWindowName?: never; parentScriptedGui: string };

/** The root container supplies windowName; element bindings supply behavior records. */
export type ScriptedWindowSpec<C extends ScriptedGuiContext> = Omit<
  ScriptedGuiSpec<C>,
  | "windowName"
  | "effects"
  | "triggers"
  | "properties"
  | "dynamicLists"
  | "aiWeights"
  | "parentWindowToken"
  | "parentWindowName"
  | "parentScriptedGui"
> & {
  path: `interface/${string}.gui`;
} & (C extends "decision_category"
    ? { parentWindowToken?: never; parentWindowName?: never; parentScriptedGui?: never }
    : ScriptedWindowParent);

/**
 * Author a static layout and its game behavior together.
 * Emits one interface .gui and one common/scripted_guis definition. The layout
 * must contain exactly one root Container and unique element names. Callback
 * scopes are inferred from context; no JavaScript or DOM event handler runs.
 * Use ScriptedGui for externally authored windows or dynamic game-array lists.
 *
 * @example
 * ```tsx
 * ScriptedWindow(
 *   { name: "investment", path: "interface/investment.gui", context: "player_context" },
 *   ui => <ui.Container name="investment_window">
 *     <ui.Button name="invest" text="INVEST"
 *       enabled={country => country.politicalPower >= 25}
 *       click={country => country.effects.addPoliticalPower(-25)} />
 *   </ui.Container>,
 * );
 * ```
 */
export declare function ScriptedWindow<C extends ScriptedGuiContext>(
  spec: ScriptedWindowSpec<C>,
  layout: (ui: GuiBindings<ScriptedGuiScope<C>>) => GuiChild,
): Definition;

/**
 * Expand a typed, compile-time array into ordered GUI children.
 * The callback is interpreted once for each source item. This is not a game
 * dynamic_list: use ScriptedGui.dynamicLists for arrays whose contents change in game.
 *
 * @example
 * ```tsx
 * <For each={["economy", "industry"] as const}>
 *   {(name, index) => <Text name={name} text={name} position={{ x: 8, y: index * 24 }} />}
 * </For>
 * ```
 */
export declare function For<T>(props: {
  each: readonly T[];
  children: (item: T, index: number) => GuiChild;
}): GuiElement;

export interface SpriteSpec {
  name: string;
  textureFile: string;
  noOfFrames?: number;
  effectFile?: string;
  transparenceCheck?: boolean;
  loadType?: "INGAME";
  lazyLoad?: boolean;
}
export declare function Sprite(spec: SpriteSpec): GuiElement;
export declare function SpriteFile(
  path: string,
  sprites: GuiElement | readonly GuiElement[],
): Definition;

/** Both native element tags and imported PascalCase components are statically checked. */
// TypeScript requires this namespace to define its JSX contract.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
  export type Element = GuiElement;
  export interface ElementChildrenAttribute {
    children: unknown;
  }
  export type IntrinsicElements = NativeIntrinsicElements;
}
