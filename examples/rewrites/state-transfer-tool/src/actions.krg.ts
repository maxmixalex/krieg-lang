import {
  countryTarget,
  stateTarget,
  OnAction,
  ScriptedLocalisation,
  type CountryScope,
  type StateScope,
} from "krieg-lang/hoi4";

export const markFlag = "marked_for_transfer";
export const root = countryTarget("ROOT");
export const selectedState = stateTarget("FROM.FROM");

export function toolVisible(c: CountryScope | StateScope): boolean {
  return c.countryMatches(
    root,
    (player) => !player.isAI && player.triggers.has_global_flag("transfer_enabled"),
  );
}
export function hasMarks(c: CountryScope): boolean {
  return c.variable("ROOT.marked_states") > 0;
}
export function isMarked(s: StateScope): boolean {
  return s.stateMatches(selectedState, (selected) => selected.triggers.hasStateFlag(markFlag));
}
export function toggleEnabled(c: CountryScope): void {
  if (c.triggers.has_global_flag("transfer_enabled")) c.effects.clr_global_flag("transfer_enabled");
  else c.effects.set_global_flag("transfer_enabled");
}
export function toggleHidden(c: CountryScope): void {
  if (c.triggers.has_global_flag("hidden_switch")) c.effects.clr_global_flag("hidden_switch");
  else c.effects.set_global_flag("hidden_switch");
}
export function markState(s: StateScope): void {
  s.state(selectedState, (selected) => selected.effects.setStateFlag(markFlag));
  s.addVariable("ROOT.marked_states", 1);
}
export function unmarkState(s: StateScope): void {
  s.state(selectedState, (selected) => selected.effects.clearStateFlag(markFlag));
  s.subtractVariable("ROOT.marked_states", 1);
}
export function markCountry(c: CountryScope, colonial: boolean): void {
  c.setTempVariable("ROOT.marks", countryTarget("THIS"));
  c.country(countryTarget("var:marks"), (selected) => {
    selected.everyState(
      (s) =>
        !s.triggers.hasStateFlag(markFlag) &&
        (!colonial ||
          (!s.triggers.is_in_home_area(true) && !s.triggers.is_core_of(countryTarget("PREV")))),
      (s) => {
        s.effects.setStateFlag(markFlag);
        s.addVariable("ROOT.marked_states", 1);
      },
    );
  });
}
export function clearMarks(c: CountryScope): void {
  c.country(root, (player) => player.setVariable("marked_states", 0));
  c.everyGlobalState(
    (s) => s.triggers.hasStateFlag(markFlag),
    (s) => s.effects.clearStateFlag(markFlag),
  );
}
export function settleStates(c: CountryScope, core: boolean): void {
  c.country(root, (player) => player.setVariable("marked_states", 0));
  c.setTempVariable("taker", countryTarget("THIS"));
  c.everyGlobalState(
    (s) => s.triggers.hasStateFlag(markFlag),
    (s) => {
      if (core) {
        if (!s.triggers.is_core_of(countryTarget("var:taker")))
          s.effects.add_core_of(countryTarget("var:taker"));
        else s.effects.remove_core_of(countryTarget("var:taker"));
      } else
        s.country(countryTarget("var:taker"), (recipient) =>
          recipient.effects.transfer_state(stateTarget("PREV")),
        );
      s.effects.clearStateFlag(markFlag);
    },
  );
}

export const startup = OnAction({
  id: "on_startup",
  outputPath: "common/on_actions/st_on_actions.txt",
  effect: [
    (world) => {
      world.everyCountry(
        (c) => !c.isAI,
        (c) => c.setVariable("ROOT.marked_states", 0),
      );
    },
  ],
});
export const textRules = [
  ScriptedLocalisation("mark_state_tooltip", {
    scope: "state",
    texts: [
      { trigger: (s) => s.triggers.hasStateFlag(markFlag), localisationKey: "mark_state_no" },
      { localisationKey: "mark_state_yes" },
    ],
  }),
  ScriptedLocalisation("mark_status", {
    scope: "state",
    texts: [
      { trigger: (s) => s.triggers.hasStateFlag(markFlag), localisationKey: "mark_status_marked" },
      { localisationKey: "mark_status_unmarked" },
    ],
  }),
  ScriptedLocalisation("transfer_states_tooltip", {
    scope: "country",
    texts: [
      {
        trigger: (c) => c.triggers.has_global_flag("transfer_enabled"),
        localisationKey: "transfer_states_off",
      },
      { localisationKey: "transfer_states_on" },
    ],
  }),
  ScriptedLocalisation("ST_TOOLTIP", {
    scope: "country",
    texts: [
      {
        trigger: (c) => c.triggers.has_global_flag("transfer_enabled"),
        localisationKey: "ST_TOOLTIP_off",
      },
      { localisationKey: "ST_TOOLTIP_on" },
    ],
  }),
];
