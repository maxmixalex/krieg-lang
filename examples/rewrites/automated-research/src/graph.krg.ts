import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { technologies } from "./technologies.krg.ts";

const catalogue = { first: 1, outOfRange: "clamp" } as const;
export const parents = ScriptedEffect("rq_parents_get", (c: CountryScope) => {
  c.clearArray("rq_pars");
  c.setTempVariable("rq_have", 0);
  c.dispatchByIndex(
    "rq_t",
    technologies,
    (country, tech) => {
      if (tech.parents.length === 0) country.setTempVariable("rq_have", 1);
      for (const parent of tech.parents) country.arrayPush("rq_pars", parent);
      for (const parentId of tech.parentIds) {
        if (country.triggers.has_tech(parentId)) country.setTempVariable("rq_have", 1);
      }
    },
    catalogue,
  );
});
export const available = ScriptedEffect("rq_check_available", (c: CountryScope) => {
  c.setTempVariable("rq_avail", 0);
  c.run(parents);
  c.dispatchByIndex(
    "rq_t",
    technologies,
    (country, tech) => {
      if (
        country.triggers.can_research(tech.id) &&
        !country.triggers.has_tech(tech.id) &&
        !country.arrayContains("global.rq_hid", tech.index) &&
        country.variable("rq_have") === 1
      ) {
        country.setTempVariable("rq_avail", 1);
      }
    },
    catalogue,
  );
});
const exclusiveChoices = [
  { index: 189, other: 215, otherId: "dispersed_industry" },
  { index: 215, other: 189, otherId: "concentrated_industry" },
  { index: 261, other: 485, otherId: "streamlined_line" },
  { index: 485, other: 261, otherId: "flexible_line" },
] as const;
export const dead = ScriptedEffect("rq_check_dead", (c: CountryScope) => {
  c.setTempVariable("rq_dead", 0);
  if (c.arrayContains("global.rq_hid", c.variable("rq_t"))) c.setTempVariable("rq_dead", 1);
  for (const choice of exclusiveChoices) {
    if (c.variable("rq_t") === choice.index && c.triggers.has_tech(choice.otherId))
      c.setTempVariable("rq_dead", 1);
  }
});
export const blocked = ScriptedEffect("rq_check_blocked", (c: CountryScope) => {
  c.run(dead);
  for (const choice of exclusiveChoices) {
    if (c.variable("rq_t") === choice.index && c.arrayContains("rq_vanilla", choice.other))
      c.setTempVariable("rq_dead", 1);
  }
});
export const exclusiveQueued = ScriptedEffect("rq_xor_get", (c: CountryScope) => {
  for (const choice of exclusiveChoices) {
    if (
      c.variable("rq_t") === choice.index &&
      c.arrayContains("rq_queue", choice.other) &&
      !c.arrayContains("rq_vanilla", choice.other) &&
      !c.arrayContains("rq_added", choice.other)
    ) {
      c.arrayPush("rq_xrm", choice.other);
    }
  }
});
export const capture = ScriptedEffect("rq_capture_scan", (c: CountryScope) => {
  c.clearArray("rq_captured");
  for (const tech of technologies) {
    if (c.triggers.is_researching_technology(tech.id)) c.arrayPush("rq_captured", tech.index);
  }
});
export const technologyBonus = ScriptedEffect("rq_tech_bonus_do", (c: CountryScope) => {
  c.setTempVariable("rq_tb", 0);
  c.dispatchByIndex(
    "rq_t",
    technologies,
    (country, tech) => {
      country.setTempVariable("rq_tbp", 0);
      country.setTempVariable("rq_tbn", 0);
      for (const category of tech.categories) {
        if (country.variable("rq_cb_" + category) > country.variable("rq_tbp"))
          country.setTempVariable("rq_tbp", country.variable("rq_cb_" + category));
        if (country.variable("rq_cb_" + category) < country.variable("rq_tbn"))
          country.setTempVariable("rq_tbn", country.variable("rq_cb_" + category));
      }
      country.setTempVariable("rq_tb", country.variable("rq_tbp") + country.variable("rq_tbn"));
    },
    catalogue,
  );
});
export const inTab = ScriptedEffect("rq_in_tab", (c: CountryScope) => {
  c.setTempVariable("rq_intab", 0);
  c.dispatchByIndex(
    "rq_t",
    technologies,
    (country, tech) => {
      for (const tab of tech.tabs) {
        if (country.variable("rq_tabm" + tab) === 1) country.setTempVariable("rq_intab", 1);
      }
    },
    catalogue,
  );
});

import { visibility } from "./visibility.krg.ts";
export const scanDlc = ScriptedEffect("rq_dlc_scan", (c: CountryScope) => {
  c.clearArray("global.rq_vis");
  c.clearArray("global.rq_hid");
  c.setTempVariable("rq_vch", 1);
  c.setTempVariable("rq_vn", 0);
  c.whileLoop(
    (c) => c.variable("rq_vch") === 1 && c.variable("rq_vn") < 10,
    (c) => {
      c.setTempVariable("rq_vch", 0);
      c.addTempVariable("rq_vn", 1);
      for (const rule of visibility) {
        if (!c.arrayContains("global.rq_vis", rule.index)) {
          c.setTempVariable("rq_dlc_ok", 1);
          for (const dlc of rule.requires) {
            if (!c.triggers.has_dlc(dlc)) c.setTempVariable("rq_dlc_ok", 0);
          }
          for (const dlc of rule.excludes) {
            if (c.triggers.has_dlc(dlc)) c.setTempVariable("rq_dlc_ok", 0);
          }
          if (rule.anyDlc.length + rule.withoutDlc.length > 0) {
            c.setTempVariable("rq_dlc_choice", 0);
            for (const dlc of rule.anyDlc) {
              if (c.triggers.has_dlc(dlc)) c.setTempVariable("rq_dlc_choice", 1);
            }
            for (const dlc of rule.withoutDlc) {
              if (!c.triggers.has_dlc(dlc)) c.setTempVariable("rq_dlc_choice", 1);
            }
            if (c.variable("rq_dlc_choice") === 0) c.setTempVariable("rq_dlc_ok", 0);
          }
          if (rule.parents.length > 0) {
            c.setTempVariable("rq_dlc_parent", 0);
            for (const parent of rule.parents) {
              if (c.arrayContains("global.rq_vis", parent)) c.setTempVariable("rq_dlc_parent", 1);
            }
            if (c.variable("rq_dlc_parent") === 0) c.setTempVariable("rq_dlc_ok", 0);
          }
          if (c.variable("rq_dlc_ok") === 1) {
            c.arrayPush("global.rq_vis", rule.index);
            c.setTempVariable("rq_vch", 1);
          }
        }
      }
    },
  );
  for (const tech of technologies) {
    if (!c.arrayContains("global.rq_vis", tech.index)) c.arrayPush("global.rq_hid", tech.index);
  }
});
