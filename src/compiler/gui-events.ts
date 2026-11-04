import type ts from "typescript";

/** Native modifier clicks are authored separately from the primary action. */
export const GUI_MOUSE_EVENTS = {
  rightClick: "right_click",
  shiftClick: "shift_click",
  controlClick: "control_click",
  altClick: "alt_click",
  shiftRightClick: "shift_right_click",
  controlRightClick: "control_right_click",
  altRightClick: "alt_right_click",
} as const;

export function composeGuiMouseEvents(
  name: string,
  value: unknown,
  effects: Record<string, unknown>,
  node: ts.Node,
  fail: (node: ts.Node, code: string, message: string) => never,
): void {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    fail(node, "KRG2145", "Button events requires a record of native mouse callbacks.");
  for (const [event, callback] of Object.entries(value)) {
    if (!Object.prototype.hasOwnProperty.call(GUI_MOUSE_EVENTS, event))
      fail(node, "KRG2145", `Unknown button mouse event '${event}'.`);
    if (callback !== undefined)
      effects[`${name}_${GUI_MOUSE_EVENTS[event as keyof typeof GUI_MOUSE_EVENTS]}`] = callback;
  }
}
