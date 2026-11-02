/** Compile-time HOI4 interface components. These functions are never executed. */
import type { Definition } from "../sdk/index.js";
import type { NativeIntrinsicElements } from "./native.js";
export * from "./native.js";

export interface GuiElement {
  readonly __kriegGuiElement: unique symbol;
}
export type GuiChild = GuiElement | readonly GuiChild[] | false | undefined;
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
