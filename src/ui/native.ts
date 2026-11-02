/** Generated native interface controls from CWT and observed legacy field facts. No JavaScript runtime. */

import type { GuiElement, GuiChild } from './index.js';

import type { NativeContainerProps, DropDownBoxProps, NativeButtonProps, OverlappingElementsBoxProps, NativeGridBoxProps, NativeListBoxProps, SmoothListBoxProps, NativeIconProps, PositionProps, BrowserProps, NativeTextProps, EditBoxProps, CheckboxProps, ScrollbarProps, ExtendedScrollbarProps, WindowProps, TextBoxProps, GuiButtonProps } from '../sdk/domains.js';

export declare function NativeContainer(props: NativeContainerProps & { children?: GuiChild }): GuiElement;

export declare function DropDownBox(props: DropDownBoxProps & { children?: GuiChild }): GuiElement;

export declare function NativeButton(props: NativeButtonProps): GuiElement;

export declare function OverlappingElementsBox(props: OverlappingElementsBoxProps): GuiElement;

export declare function NativeGridBox(props: NativeGridBoxProps): GuiElement;

export declare function NativeListBox(props: NativeListBoxProps): GuiElement;

export declare function SmoothListBox(props: SmoothListBoxProps): GuiElement;

export declare function NativeIcon(props: NativeIconProps): GuiElement;

export declare function Position(props: PositionProps): GuiElement;

export declare function Browser(props: BrowserProps): GuiElement;

export declare function NativeText(props: NativeTextProps): GuiElement;

export declare function EditBox(props: EditBoxProps): GuiElement;

export declare function Checkbox(props: CheckboxProps): GuiElement;

export declare function Scrollbar(props: ScrollbarProps): GuiElement;

export declare function ExtendedScrollbar(props: ExtendedScrollbarProps): GuiElement;

/** Legacy engine control observed in native GUI corpora. The supplied upstream CWTools has no rule for this control. */

export declare function Window(props: WindowProps & { children?: GuiChild }): GuiElement;

/** Legacy engine control observed in native GUI corpora. The supplied upstream CWTools has no rule for this control. */

export declare function TextBox(props: TextBoxProps): GuiElement;

/** Legacy engine control observed in native GUI corpora. The supplied upstream CWTools has no rule for this control. */

export declare function GuiButton(props: GuiButtonProps): GuiElement;

export interface NativeIntrinsicElements {
  "containerWindowType": NativeContainerProps & { children?: GuiChild };
  "dropDownBoxType": DropDownBoxProps & { children?: GuiChild };
  "buttonType": NativeButtonProps;
  "OverlappingElementsBoxType": OverlappingElementsBoxProps;
  "gridBoxType": NativeGridBoxProps;
  "listBoxType": NativeListBoxProps;
  "smoothListBoxType": SmoothListBoxProps;
  "iconType": NativeIconProps;
  "positionType": PositionProps;
  "browserType": BrowserProps;
  "instantTextBoxType": NativeTextProps;
  "editBoxType": EditBoxProps;
  "checkboxType": CheckboxProps;
  "scrollbarType": ScrollbarProps;
  "extendedScrollbarType": ExtendedScrollbarProps;
  "windowType": WindowProps & { children?: GuiChild };
  "textBoxType": TextBoxProps;
  "guiButtonType": GuiButtonProps;
}
