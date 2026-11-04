import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { technologies } from "./technologies.krg.ts";
import { iconPlacement } from "./icon-state.krg.ts";
import { xpTechnologies } from "./progress-facts.krg.ts";
import { historyRefresh } from "./history.krg.ts";

export const setTreePosition = ScriptedEffect("rq_pos_set", (c: CountryScope) => {
  c.setTempVariable("rq_pf", c.variable("rq_val"));
  if (c.variable("rq_val") > 549) c.subtractTempVariable("rq_pf", 549);
  else if (c.variable("rq_val") > 99) c.subtractTempVariable("rq_pf", 99);
  c.dispatchByIndex(
    "rq_t",
    technologies,
    (c, tech) => {
      c.setVariable("rq_p_" + tech.id, c.variable("rq_val"));
      c.setVariable("rq_pf_" + tech.id, c.variable("rq_pf"));
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const treeMarkers = ScriptedEffect("rq_tree_sync", (c: CountryScope) => {
  // Clear only the previously displayed marker set; queue edits cannot leave a
  // stale technology badge on a different tree tab.
  c.forEachValue("rq_posprev", { value: "rq_mark_tech" }, (c) => {
    c.setTempVariable("rq_t", c.variable("rq_mark_tech"));
    c.setTempVariable("rq_val", 0);
    c.run(setTreePosition);
  });
  c.clearArray("rq_posprev");
  c.forEachValue("rq_queue", { value: "rq_mark_tech", index: "rq_mark_row" }, (c) => {
    c.setTempVariable("rq_t", c.variable("rq_mark_tech"));
    c.arrayPush("rq_posprev", c.variable("rq_mark_tech"));
    c.setTempVariable("rq_val", c.variable("rq_mark_row") + 1);
    c.clampTempVariable("rq_val", { max: 1000 });
    c.run(setTreePosition);
  });
});
export const uiState = ScriptedEffect("rq_ui_state", (c: CountryScope) => {
  c.run(treeMarkers);
  for (const array of [
    "rq_qno",
    "rq_qix",
    "rq_qiy",
    "rq_qiw",
    "rq_qxs",
    "rq_qxk",
    "rq_qxc",
    "rq_qxp",
    "rq_qcu",
    "rq_qcd",
  ])
    c.clearArray(array);
  c.forEachValue("rq_queue", { value: "rq_ui_tech", index: "rq_ui_row" }, (c) => {
    c.setTempVariable("rq_t", c.variable("rq_ui_tech"));
    c.setTempVariable("rq_val", c.variable("rq_ui_row") + 1);
    c.arrayPush("rq_qno", c.variable("rq_val"));
    c.run(iconPlacement);
    c.arrayPush("rq_qix", c.variable("rq_ix"));
    c.arrayPush("rq_qiy", c.variable("rq_iy"));
    c.arrayPush("rq_qiw", c.variable("rq_iw"));
    c.setTempVariable("rq_xs", 0);
    c.setTempVariable("rq_xk", 0);
    c.setTempVariable("rq_xc", 0);
    c.setTempVariable("rq_xp", 0);
    for (const xp of xpTechnologies) {
      if (c.variable("rq_ui_tech") === xp.index) {
        c.setTempVariable("rq_xs", 1);
        c.setTempVariable("rq_xk", xp.kind);
        c.setTempVariable("rq_xc", xp.cost);
        c.setTempVariable("rq_xp", xp.speed);
        if (c.arrayAt("rq_xpw", xp.index) === 1) c.setTempVariable("rq_xs", 2);
        if (c.arrayAt("rq_xpb", xp.index) === 1) c.setTempVariable("rq_xs", 3);
      }
    }
    c.arrayPush("rq_qxs", c.variable("rq_xs"));
    c.arrayPush("rq_qxk", c.variable("rq_xk"));
    c.arrayPush("rq_qxc", c.variable("rq_xc"));
    c.arrayPush("rq_qxp", c.variable("rq_xp"));
    c.arrayPush("rq_qcu", 2);
    c.arrayPush("rq_qcd", 2);
  });
  c.forEachValue("rq_view", { value: "rq_ui_row", index: "rq_ui_visible" }, (c) => {
    c.setTempVariable("rq_up", 4);
    c.setTempVariable("rq_down", 4);
    if (c.variable("rq_sortn_f") < 2 && c.variable("rq_sortt_f") < 2) {
      c.setTempVariable("rq_up", 2);
      if (c.variable("rq_ui_visible") > 0) {
        c.setTempVariable("rq_before", c.variable("rq_ui_visible") - 1);
        c.setTempVariable("rq_previous", c.arrayAt("rq_view", c.variable("rq_before")));
        if (c.variable("rq_previous") > c.variable("rq_ui_row")) c.setTempVariable("rq_up", 5);
        else if (c.variable("rq_previous") >= c.arrayLength("rq_vanilla")) {
          c.setTempVariable("rq_up", 1);
          if (c.arrayAt("rq_qpar", c.variable("rq_ui_row")) >= c.variable("rq_previous"))
            c.setTempVariable("rq_up", 0);
        }
      }
      c.setTempVariable("rq_down", 2);
      c.setTempVariable("rq_next", c.variable("rq_ui_visible") + 1);
      c.setTempVariable("rq_found", 0);
      if (c.variable("rq_next") < c.arrayLength("rq_view")) c.setTempVariable("rq_down", 3);
      c.whileLoop(
        (c) => c.variable("rq_found") === 0 && c.variable("rq_next") < c.arrayLength("rq_view"),
        (c) => {
          c.setTempVariable("rq_after", c.arrayAt("rq_view", c.variable("rq_next")));
          if (
            c.variable("rq_grp_on") === 1 &&
            c.arrayAt("rq_qst", c.variable("rq_ui_row")) < 3 &&
            c.arrayAt("rq_qst", c.variable("rq_after")) > 3
          )
            c.setTempVariable("rq_down", 5);
          else if (
            c.variable("rq_after") > c.variable("rq_ui_row") &&
            c.arrayAt("rq_qpar", c.variable("rq_after")) < c.variable("rq_ui_row")
          ) {
            c.setTempVariable("rq_down", 1);
            c.setTempVariable("rq_found", 1);
          }
          c.addTempVariable("rq_next", 1);
        },
      );
    }
    c.arraySet("rq_qcu", c.variable("rq_ui_row"), c.variable("rq_up"));
    c.arraySet("rq_qcd", c.variable("rq_ui_row"), c.variable("rq_down"));
  });
  if (c.variable("rq_dlg") === 3) c.run(historyRefresh);
});
