/** Generated native interface controls from CWT and observed legacy field facts. No JavaScript runtime. */

import type { GuiElement, GuiChild, GuiStyleProps } from './index.js';

import type { NativeContainerProps, DropDownBoxProps, NativeButtonProps, OverlappingElementsBoxProps, NativeGridBoxProps, NativeListBoxProps, SmoothListBoxProps, NativeIconProps, PositionProps, BrowserProps, NativeTextProps, EditBoxProps, CheckboxProps, ScrollbarProps, ExtendedScrollbarProps, WindowProps, TextBoxProps, GuiButtonProps } from '../sdk/domains.js';

export declare function NativeContainer(props: NativeContainerProps & GuiStyleProps & { children?: GuiChild }): GuiElement;

export declare function DropDownBox(props: DropDownBoxProps & GuiStyleProps & { children?: GuiChild }): GuiElement;

export declare function NativeButton(props: NativeButtonProps & GuiStyleProps): GuiElement;

export declare function OverlappingElementsBox(props: OverlappingElementsBoxProps & GuiStyleProps): GuiElement;

export declare function NativeGridBox(props: NativeGridBoxProps & GuiStyleProps): GuiElement;

export declare function NativeListBox(props: NativeListBoxProps & GuiStyleProps): GuiElement;

export declare function SmoothListBox(props: SmoothListBoxProps & GuiStyleProps): GuiElement;

export declare function NativeIcon(props: NativeIconProps & GuiStyleProps): GuiElement;

export declare function Position(props: PositionProps & GuiStyleProps): GuiElement;

export declare function Browser(props: BrowserProps & GuiStyleProps): GuiElement;

export declare function NativeText(props: NativeTextProps & GuiStyleProps): GuiElement;

export declare function EditBox(props: EditBoxProps & GuiStyleProps): GuiElement;

export declare function Checkbox(props: CheckboxProps & GuiStyleProps): GuiElement;

export declare function Scrollbar(props: ScrollbarProps & GuiStyleProps): GuiElement;

export declare function ExtendedScrollbar(props: ExtendedScrollbarProps & GuiStyleProps): GuiElement;

/** Legacy engine control observed in native GUI corpora. The supplied upstream CWTools has no rule for this control. */

export declare function Window(props: WindowProps & GuiStyleProps & { children?: GuiChild }): GuiElement;

/** Legacy engine control observed in native GUI corpora. The supplied upstream CWTools has no rule for this control. */

export declare function TextBox(props: TextBoxProps & GuiStyleProps): GuiElement;

/** Legacy engine control observed in native GUI corpora. The supplied upstream CWTools has no rule for this control. */

export declare function GuiButton(props: GuiButtonProps & GuiStyleProps): GuiElement;

export interface NativeIntrinsicElements {
  "containerWindowType": NativeContainerProps & GuiStyleProps & { children?: GuiChild };
  "dropDownBoxType": DropDownBoxProps & GuiStyleProps & { children?: GuiChild };
  "buttonType": NativeButtonProps & GuiStyleProps;
  "OverlappingElementsBoxType": OverlappingElementsBoxProps & GuiStyleProps;
  "gridBoxType": NativeGridBoxProps & GuiStyleProps;
  "listBoxType": NativeListBoxProps & GuiStyleProps;
  "smoothListBoxType": SmoothListBoxProps & GuiStyleProps;
  "iconType": NativeIconProps & GuiStyleProps;
  "positionType": PositionProps & GuiStyleProps;
  "browserType": BrowserProps & GuiStyleProps;
  "instantTextBoxType": NativeTextProps & GuiStyleProps;
  "editBoxType": EditBoxProps & GuiStyleProps;
  "checkboxType": CheckboxProps & GuiStyleProps;
  "scrollbarType": ScrollbarProps & GuiStyleProps;
  "extendedScrollbarType": ExtendedScrollbarProps & GuiStyleProps;
  "windowType": WindowProps & GuiStyleProps & { children?: GuiChild };
  "textBoxType": TextBoxProps & GuiStyleProps;
  "guiButtonType": GuiButtonProps & GuiStyleProps;
}
