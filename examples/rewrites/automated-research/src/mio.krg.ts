import {
  ScriptedEffect,
  country,
  countryTarget,
  mioTarget,
  type CountryScope,
} from "krieg-lang/hoi4";
import { organizationDisplay } from "./organization-display.krg.ts";
import { mioTechnologyFacts, mioClasses } from "./mio-facts.krg.ts";
import { find, setMio } from "./queue.krg.ts";
import { update } from "./core.krg.ts";
import { apsClose } from "./ui-actions.krg.ts";
const slots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const classes = mioClasses;
const bits = [
  { bit: 9, value: 512 },
  { bit: 8, value: 256 },
  { bit: 7, value: 128 },
  { bit: 6, value: 64 },
  { bit: 5, value: 32 },
  { bit: 4, value: 16 },
  { bit: 3, value: 8 },
  { bit: 2, value: 4 },
  { bit: 1, value: 2 },
  { bit: 0, value: 1 },
] as const;
// Stable organization IDs are the save ABI. Native flags memoize those IDs on the
// real organization scope; unknown organizations remain 0 and cannot be selected.
export const indexThis = ScriptedEffect(
  "rq_mio_index_this",
  "military_industrial_organization",
  (m) => {
    m.setTempVariable("rq_mio_i", 0);
    if (m.triggers.has_mio_flag("rq_ix6895")) {
      for (const bit of bits)
        if (m.triggers.has_mio_flag("rq_ix6895_" + bit.bit))
          m.addTempVariable("rq_mio_i", bit.value);
    } else {
      for (const organization of organizationDisplay)
        if (
          m.variable("rq_mio_i") === 0 &&
          m.triggers.is_military_industrial_organization(organization.id)
        )
          m.setTempVariable("rq_mio_i", organization.index);
      m.effects.set_mio_flag("rq_ix6895");
      m.setTempVariable("rq_mio_r", m.variable("rq_mio_i"));
      for (const bit of bits)
        if (m.variable("rq_mio_r") >= bit.value) {
          m.effects.set_mio_flag("rq_ix6895_" + bit.bit);
          m.subtractTempVariable("rq_mio_r", bit.value);
        }
    }
  },
);
export const fits = ScriptedEffect("rq_mio_fits", "military_industrial_organization", (m) => {
  m.setTempVariable("rq_fit", 0);
  m.setTempVariable("rq_fiteq", 0);
  m.dispatchByIndex(
    "rq_t",
    mioTechnologyFacts,
    (m, tech) => {
      for (const category of tech.categories)
        if (m.triggers.has_mio_research_category(category)) m.setTempVariable("rq_fit", 1);
      for (const equipment of tech.equipment)
        if (m.triggers.has_mio_equipment_type(equipment)) {
          m.setTempVariable("rq_fit", 1);
          m.setTempVariable("rq_fiteq", 1);
        }
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const checkOption = ScriptedEffect("rq_check_mio_option", (c: CountryScope) => {
  c.setTempVariable("rq_c", 0);
  c.effects.every_military_industrial_organization({
    limit: (m) => m.triggers.is_mio_available(true),
    effects: (m) => {
      m.run(fits);
      if (m.variable("rq_fit") === 1) m.setTempVariable("rq_c", 1);
    },
  });
});
export const csGet = ScriptedEffect("rq_cs_get", (c: CountryScope) => {
  c.setTempVariable("rq_cs", -1);
  c.dispatchByIndex(
    "rq_t",
    mioTechnologyFacts,
    (c, tech) => c.setTempVariable("rq_cs", tech.category),
    { first: 1, outOfRange: "clamp" },
  );
});
export const mslotSet = ScriptedEffect("rq_mslot_set", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_t",
    mioTechnologyFacts,
    (c, tech) => c.setVariable("rq_ms_" + tech.id, c.variable("rq_val")),
    { first: 1, outOfRange: "clamp" },
  );
});
export const bind = ScriptedEffect("rq_mio_set", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_t",
    mioTechnologyFacts,
    (c, tech) => c.setVariable("rq_m_" + tech.id, c.variable("rq_pick")),
    { first: 1, outOfRange: "clamp" },
  );
});
export const clearMio = ScriptedEffect("rq_mio_clear", (c: CountryScope) => {
  c.dispatchByIndex("rq_t", mioTechnologyFacts, (c, tech) => c.clearVariable("rq_m_" + tech.id), {
    first: 1,
    outOfRange: "clamp",
  });
});
export const bonus = ScriptedEffect("rq_mio_bonus", (c: CountryScope) => {
  c.setTempVariable("rq_mb", 0);
  c.dispatchByIndex(
    "rq_t",
    mioTechnologyFacts,
    (c, tech) => {
      if (c.triggers.has_variable("rq_m_" + tech.id))
        c.militaryOrganization(mioTarget(`var:rq_m_${tech.id}`), (m) =>
          m.setTempVariable("rq_mb", m.variable("research_bonus")),
        );
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const checkAssignment = ScriptedEffect("rq_mio_check", (c: CountryScope) => {
  c.setTempVariable("rq_mdrop", 0);
  c.dispatchByIndex(
    "rq_t",
    mioTechnologyFacts,
    (c, tech) => {
      if (c.triggers.has_variable("rq_m_" + tech.id))
        c.militaryOrganization(mioTarget(`var:rq_m_${tech.id}`), (m) => {
          if (m.triggers.is_mio_available(false)) m.setTempVariable("rq_mdrop", 1);
        });
      else c.setTempVariable("rq_mdrop", 1);
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const flagUsed = ScriptedEffect("rq_mio_flag_used", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_t",
    mioTechnologyFacts,
    (c, tech) => {
      if (c.triggers.has_variable("rq_m_" + tech.id))
        c.militaryOrganization(mioTarget(`var:rq_m_${tech.id}`), (m) =>
          m.effects.set_mio_flag("rq_used"),
        );
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const funds = ScriptedEffect("rq_mio_funds", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_t",
    mioTechnologyFacts,
    (c, tech) => c.setTempVariable("rq_funds", tech.funds),
    { first: 1, outOfRange: "clamp" },
  );
});
export const pay = ScriptedEffect("rq_mio_pay", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_t",
    mioTechnologyFacts,
    (c, tech) => {
      if (c.triggers.has_variable("rq_m_" + tech.id))
        c.militaryOrganization(mioTarget(`var:rq_m_${tech.id}`), (m) =>
          m.effects.add_mio_funds(tech.funds),
        );
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const design = ScriptedEffect("rq_mio_design", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_t",
    mioTechnologyFacts,
    (c, tech) => {
      if (c.triggers.has_variable("rq_m_" + tech.id)) {
        c.setTempVariable("rq_mio_named", 0);
        for (const variant of tech.variants) {
          if (
            variant.country === ""
              ? c.variable("rq_mio_named") === 0
              : c.triggers.tag(country(variant.country))
          ) {
            c.effects.create_equipment_variant({
              type: variant.type,
              parent_version: 0,
              design_team: "var:rq_m_" + tech.id,
              ...(variant.name === "" ? {} : { name: variant.name }),
              mark_older_equipment_obsolete: true,
            });
            if (variant.country !== "") c.setTempVariable("rq_mio_named", 1);
          }
        }
      }
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const assignMio = ScriptedEffect("rq_assign_mio", (c: CountryScope) => {
  c.run(clearMio);
  if (c.variable("rq_val") > 0) c.run(bind);
  c.run(setMio);
});
export const autoGet = ScriptedEffect("rq_auto_get", (c: CountryScope) => {
  c.setTempVariable("rq_aval", 0);
  for (const group of classes)
    if (
      c.variable("rq_cs") === group.category &&
      c.variable("rq_auto" + group.category + "_i") > 0 &&
      c.triggers.has_variable("rq_auto" + group.category + "_ref")
    ) {
      c.setTempVariable("rq_acand", c.variable("rq_auto" + group.category + "_i"));
      c.militaryOrganization(mioTarget(`var:rq_auto${group.category}_ref`), (m) => {
        if (m.triggers.is_mio_available(true)) m.setTempVariable("rq_aval", m.variable("rq_acand"));
      });
      if (c.variable("rq_aval") > 0)
        c.setVariable("rq_pick", c.variable("rq_auto" + group.category + "_ref"));
    }
});
export const autoSet = ScriptedEffect("rq_auto_set", (c: CountryScope) => {
  for (const group of classes)
    if (c.variable("rq_cs") === group.category) {
      c.setVariable("rq_auto" + group.category + "_i", c.variable("rq_val"));
      if (c.variable("rq_val") > 0)
        c.setVariable("rq_auto" + group.category + "_ref", c.variable("rq_pick"));
      else c.clearVariable("rq_auto" + group.category + "_ref");
    }
});
export const applyAuto = ScriptedEffect("rq_apply_auto", (c: CountryScope) => {
  c.run(csGet);
  if (c.variable("rq_cs") > -1) {
    c.run(autoGet);
    if (c.variable("rq_aval") > 0) {
      c.setTempVariable("rq_val", c.variable("rq_aval"));
      c.run(assignMio);
    }
  }
});
export const upkeep = ScriptedEffect("rq_mio_upkeep", (c: CountryScope) => {
  c.effects.every_military_industrial_organization((m) => m.effects.clr_mio_flag("rq_used"));
  c.forEachValue("rq_queue", { value: "uv", index: "ui" }, (c) => {
    if (c.arrayAt("rq_qmio", c.variable("ui")) > 0) {
      c.setTempVariable("rq_t", c.variable("uv"));
      c.run(checkAssignment);
      if (c.variable("rq_mdrop") === 1) {
        c.run(clearMio);
        c.setTempVariable("rq_qi", c.variable("ui"));
        c.setTempVariable("rq_val", 0);
        c.run(setMio);
      } else c.run(flagUsed);
    }
  });
});
export const maintenanceZero = ScriptedEffect("rq_mpp_zero", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_mio_i",
    organizationDisplay,
    (c, organization) => c.setVariable("rq_mppv_" + organization.index, 0),
    { first: 1, outOfRange: "clamp" },
  );
});
export const maintenanceAdd = ScriptedEffect("rq_mpp_add", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_mio_i",
    organizationDisplay,
    (c, organization) => {
      c.subtractVariable("rq_mppv_" + organization.index, 0.1);
      if (!c.triggers.has_dynamic_modifier({ modifier: "rq_mpp_" + organization.index }))
        c.effects.add_dynamic_modifier({ modifier: "rq_mpp_" + organization.index });
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const maintenanceOff = ScriptedEffect("rq_mpp_off", (c: CountryScope) => {
  c.dispatchByIndex(
    "rq_mio_i",
    organizationDisplay,
    (c, organization) => {
      c.effects.remove_dynamic_modifier({ modifier: "rq_mpp_" + organization.index });
      c.clearVariable("rq_mppv_" + organization.index);
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const maintenance = ScriptedEffect("rq_mpp_apply", (c: CountryScope) => {
  c.clearArray("rq_mppnew");
  c.forEachValue("rq_mppc", { value: "cv" }, (c) => {
    c.setTempVariable("rq_mio_i", c.variable("cv"));
    if (!c.arrayContains("rq_mppnew", c.variable("cv"))) {
      c.arrayPush("rq_mppnew", c.variable("cv"));
      c.run(maintenanceZero);
    }
    c.run(maintenanceAdd);
  });
  c.forEachValue("rq_mppon", { value: "ov" }, (c) => {
    if (!c.arrayContains("rq_mppnew", c.variable("ov"))) {
      c.setTempVariable("rq_mio_i", c.variable("ov"));
      c.run(maintenanceOff);
    }
  });
  c.clearArray("rq_mppon");
  c.forEachValue("rq_mppnew", { value: "nv" }, (c) => c.arrayPush("rq_mppon", c.variable("nv")));
  c.effects.force_update_dynamic_modifier(true);
});
export const restoreMio = ScriptedEffect("rq_mio_restore", (c: CountryScope) => {
  c.setTempVariable("rq_mgot", 0);
  c.effects.every_military_industrial_organization({
    limit: (m) => m.triggers.is_mio_available(true),
    effects: (m) => {
      if (m.variable("rq_mgot") === 0) {
        m.run(indexThis);
        if (m.variable("rq_mio_i") === m.variable("rq_lm")) {
          m.run(fits);
          if (m.variable("rq_fit") === 1) {
            m.country(countryTarget("ROOT"), (owner) =>
              owner.setVariable("rq_pick", mioTarget("PREV")),
            );
            m.setTempVariable("rq_mgot", 1);
          }
        }
      }
    },
  });
  c.run(find);
  if (c.variable("rq_mgot") === 1) {
    c.setTempVariable("rq_val", c.variable("rq_lm"));
    c.run(assignMio);
  } else c.run(applyAuto);
});
export const scan = ScriptedEffect("rq_ml_scan", (c: CountryScope) => {
  c.effects.every_military_industrial_organization({
    limit: (m) => m.triggers.is_mio_available(true),
    effects: (m) => {
      m.run(fits);
      if (m.variable("rq_fit") === 1) {
        m.run(indexThis);
        if (m.variable("rq_mln") < 10 && m.variable("rq_mio_i") > 0) {
          m.setTempVariable("rq_mb", m.variable("research_bonus"));
          m.setTempVariable("rq_mls", 0);
          if (m.triggers.is_mio_assigned_to_task(true)) m.setTempVariable("rq_mls", 1);
          for (const slot of slots)
            if (m.variable("rq_mln") === slot - 1)
              m.country(countryTarget("ROOT"), (owner) => {
                owner.setVariable("rq_ml" + slot + "_ref", mioTarget("PREV"));
                owner.setVariable("rq_ml" + slot + "_i", owner.variable("rq_mio_i"));
                owner.setVariable("rq_ml" + slot + "_b", owner.variable("rq_mb"));
                owner.setVariable("rq_ml" + slot + "_s", owner.variable("rq_mls"));
              });
          m.addTempVariable("rq_mln", 1);
        }
      }
    },
  });
});
export const refresh = ScriptedEffect("rq_ml_refresh", (c: CountryScope) => {
  for (const slot of slots) {
    c.setVariable("rq_ml" + slot + "_i", 0);
    c.setVariable("rq_ml" + slot + "_s", 0);
    c.clearVariable("rq_ml" + slot + "_ref");
  }
  c.setVariable("rq_ml_n", 0);
  c.setVariable("rq_ml_cur", 0);
  if (c.variable("rq_ml_t") > 0) {
    c.setTempVariable("rq_t", c.variable("rq_ml_t"));
    c.run(find);
    if (c.variable("rq_qi") > -1) {
      c.setVariable("rq_ml_cur", c.arrayAt("rq_qmio", c.variable("rq_qi")));
      c.run(funds);
      c.setVariable("rq_ml_funds", c.variable("rq_funds"));
      c.setTempVariable("rq_mln", 0);
      c.run(scan);
      c.setVariable("rq_ml_n", c.variable("rq_mln"));
      for (const slot of slots)
        if (
          c.variable("rq_ml" + slot + "_i") > 0 &&
          c.variable("rq_ml" + slot + "_i") === c.variable("rq_ml_cur")
        )
          c.setVariable("rq_ml" + slot + "_s", 3);
    } else c.setVariable("rq_ml_t", 0);
  }
  c.addVariable("rq_dirty", 1);
});
export const rowMio = ScriptedEffect("rq_row_mio", (c: CountryScope) => {
  c.setTempVariable("rq_t", c.arrayAt("rq_queue", c.variable("rq_k")));
  c.setVariable("rq_dlg", 0);
  c.setVariable("rq_clr", 0);
  c.run(apsClose);
  if (c.variable("rq_typing") === 2) c.setVariable("rq_typing", 0);
  if (c.variable("rq_ml_t") === c.variable("rq_t")) c.setVariable("rq_ml_t", 0);
  else c.setVariable("rq_ml_t", c.variable("rq_t"));
  c.run(refresh);
});
export const pick = ScriptedEffect("rq_ml_pick", (c: CountryScope) => {
  c.setTempVariable("rq_t", c.variable("rq_ml_t"));
  c.run(find);
  if (c.variable("rq_qi") > -1) {
    c.setTempVariable("rq_tq", c.variable("rq_qi"));
    c.setTempVariable("rq_val", 0);
    for (const slot of slots)
      if (c.variable("rq_mlk") === slot) {
        c.setTempVariable("rq_val", c.variable("rq_ml" + slot + "_i"));
        c.setVariable("rq_pick", c.variable("rq_ml" + slot + "_ref"));
      }
    c.run(assignMio);
    if (c.variable("rq_mlsh") === 1) {
      c.run(csGet);
      if (c.variable("rq_cs") > -1) {
        c.run(autoSet);
        if (c.variable("rq_val") > 0) {
          c.setTempVariable("rq_csme", c.variable("rq_cs"));
          c.forEachValue("rq_queue", { value: "av", index: "ai" }, (c) => {
            if (
              c.variable("ai") !== c.variable("rq_tq") &&
              c.arrayAt("rq_qmio", c.variable("ai")) < 1 &&
              !c.arrayContains("rq_vanilla", c.variable("av"))
            ) {
              c.setTempVariable("rq_t", c.variable("av"));
              c.run(csGet);
              if (c.variable("rq_cs") === c.variable("rq_csme")) {
                c.setTempVariable("rq_qi", c.variable("ai"));
                c.run(assignMio);
              }
            }
          });
        }
      }
    }
  }
  c.run(update);
  c.run(refresh);
});
export const autoClick = ScriptedEffect("rq_ml_auto_toggle", (c: CountryScope) => {
  if (c.triggers.hasCountryFlag("rq_ml_auto")) {
    c.effects.clearCountryFlag("rq_ml_auto");
    c.setVariable("rq_ml_autof", 1);
  } else {
    c.effects.setCountryFlag("rq_ml_auto");
    c.setVariable("rq_ml_autof", 2);
  }
});
export const clearClick = ScriptedEffect("rq_ml_clear_click", (c: CountryScope) => {
  c.setTempVariable("rq_mlk", 0);
  c.setTempVariable("rq_mlsh", 0);
  c.run(pick);
});
export const close = ScriptedEffect("rq_ml_close", (c: CountryScope) => {
  c.setVariable("rq_ml_t", 0);
  c.run(refresh);
});
export const vanillaMioSpeed = ScriptedEffect("rq_vanilla_mio_speed", (c: CountryScope) => {
  if (c.arrayAt("rq_qmio", c.variable("vi")) > 0) {
    c.run(bonus);
    c.addTempVariable("rq_tspd", c.variable("rq_mb"));
  }
});
// Native research slots expose only organization task-count changes. Match new
// tasks in two passes (equipment-exact first, category-only second), and clear
// inferred native assignments when the observed count falls.
export const vanillaMio = ScriptedEffect("rq_vanilla_mio", (c: CountryScope) => {
  if (c.arrayLength("rq_mtc") < 526)
    c.effects.resize_array({ array: "rq_mtc", value: -1, size: 526 });
  for (const column of ["rq_vt", "rq_vq", "rq_vm"]) c.clearArray(column);
  c.forEachValue("rq_queue", { value: "mv", index: "mi" }, (c) => {
    if (c.arrayContains("rq_vanilla", c.variable("mv"))) {
      c.arrayPush("rq_vt", c.variable("mv"));
      c.arrayPush("rq_vq", c.variable("mi"));
      c.arrayPush("rq_vm", c.arrayAt("rq_qmio", c.variable("mi")));
    }
  });
  c.effects.every_military_industrial_organization((m) => {
    m.run(indexThis);
    if (m.variable("rq_mio_i") > 0) {
      m.setTempVariable("rq_mtn", m.variable("number_of_currently_assigned_tasks"));
      m.country(countryTarget("ROOT"), (owner) => {
        owner.setTempVariable("rq_mtp", owner.arrayAt("rq_mtc", owner.variable("rq_mio_i")));
        owner.arraySet("rq_mtc", owner.variable("rq_mio_i"), owner.variable("rq_mtn"));
      });
      if (m.variable("rq_mtp") > -1 && m.variable("rq_mtn") > m.variable("rq_mtp")) {
        m.setTempVariable("rq_mneed", m.variable("rq_mtn") - m.variable("rq_mtp"));
        m.setTempVariable("rq_mfound", 0);
        m.forRange({ start: 0, end: 2, index: "rq_mpass" }, (m) => {
          // Country arrays hold the native projects; MIO scope must read ROOT.
          m.forEachValue("ROOT.rq_vt", { value: "mv", index: "mk", break: "rq_mfound" }, (m) => {
            if (m.arrayAt("ROOT.rq_vm", m.variable("mk")) === 0) {
              m.setTempVariable("rq_t", m.variable("mv"));
              m.run(fits);
              if (
                m.variable("rq_fit") === 1 &&
                (m.variable("rq_mpass") === 1 || m.variable("rq_fiteq") === 1)
              ) {
                m.setTempVariable("rq_qi", m.arrayAt("ROOT.rq_vq", m.variable("mk")));
                m.arraySet("ROOT.rq_vm", m.variable("mk"), m.variable("rq_mio_i"));
                m.country(countryTarget("ROOT"), (owner) => {
                  owner.setVariable("rq_pick", mioTarget("PREV"));
                  owner.setTempVariable("rq_val", owner.variable("rq_mio_i"));
                  owner.run(assignMio);
                });
                m.subtractTempVariable("rq_mneed", 1);
                if (m.variable("rq_mneed") < 1) m.setTempVariable("rq_mfound", 1);
              }
            }
          });
        });
      } else if (m.variable("rq_mtp") > -1 && m.variable("rq_mtn") < m.variable("rq_mtp")) {
        m.country(countryTarget("ROOT"), (owner) => {
          owner.forEachValue("rq_queue", { value: "mv", index: "mi" }, (owner) => {
            if (
              owner.arrayContains("rq_vanilla", owner.variable("mv")) &&
              owner.arrayAt("rq_qmio", owner.variable("mi")) === owner.variable("rq_mio_i")
            ) {
              owner.setTempVariable("rq_t", owner.variable("mv"));
              owner.setTempVariable("rq_qi", owner.variable("mi"));
              owner.setTempVariable("rq_val", 0);
              owner.run(assignMio);
            }
          });
        });
      }
    }
  });
});
export const plannerMio = ScriptedEffect("rq_ap_mio", (c: CountryScope) => {
  if (c.variable("rq_ap_miof") === 2 && c.triggers.hasCountryFlag("rq_ap_on")) {
    c.forEachValue("rq_queue", { value: "amv", index: "ami" }, (c) => {
      if (
        c.arrayAt("rq_qmio", c.variable("ami")) < 1 &&
        c.arrayContains("rq_ap_set", c.variable("amv")) &&
        !c.arrayContains("rq_vanilla", c.variable("amv"))
      ) {
        c.setTempVariable("rq_t", c.variable("amv"));
        c.setTempVariable("rq_mln", 0);
        c.run(scan);
        c.setTempVariable("rq_apmk", 0);
        c.setTempVariable("rq_apmb", -1);
        for (const slot of slots)
          if (
            c.variable("rq_mln") > slot - 1 &&
            c.variable("rq_ml" + slot + "_i") > 0 &&
            c.variable("rq_ml" + slot + "_b") > c.variable("rq_apmb")
          ) {
            c.setTempVariable("rq_apmk", slot);
            c.setTempVariable("rq_apmb", c.variable("rq_ml" + slot + "_b"));
          }
        if (c.variable("rq_apmk") > 0) {
          for (const slot of slots)
            if (c.variable("rq_apmk") === slot) {
              c.setTempVariable("rq_val", c.variable("rq_ml" + slot + "_i"));
              c.setVariable("rq_pick", c.variable("rq_ml" + slot + "_ref"));
            }
          c.setTempVariable("rq_t", c.variable("amv"));
          c.setTempVariable("rq_qi", c.variable("ami"));
          c.run(assignMio);
        }
      }
    });
    c.run(refresh);
  }
});
export const refreshSlot = ScriptedEffect("rq_refresh_mslot", (c: CountryScope) => {
  if (c.variable("rq_mq") > 0) {
    c.forEachValue("rq_mslot", { value: "sv", index: "si" }, (c) => {
      if (c.variable("sv") === c.variable("rq_mq"))
        c.setTempVariable("rq_val", c.variable("si") + 1);
    });
    if (c.variable("rq_val") === 0 && c.arrayLength("rq_mslot") < 16) {
      c.arrayPush("rq_mslot", c.variable("rq_mq"));
      c.setTempVariable("rq_val", c.arrayLength("rq_mslot"));
      for (const slot of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
        if (c.variable("rq_val") === slot) c.setVariable("rq_msv" + slot, c.variable("rq_mq"));
    }
  }
  c.run(mslotSet);
});
export const treeSlots = ScriptedEffect("rq_mio_tree_slots", (c: CountryScope) => {
  for (const tech of mioTechnologyFacts) c.setVariable("rq_ms_" + tech.id, 0);
  c.clearArray("rq_mslot");
  c.forEachValue("rq_queue", { value: "rq_mtree_t", index: "rq_mtree_i" }, (c) => {
    c.setTempVariable("rq_t", c.variable("rq_mtree_t"));
    c.setTempVariable("rq_mq", c.arrayAt("rq_qmio", c.variable("rq_mtree_i")));
    c.setTempVariable("rq_val", 0);
    if (c.variable("rq_mq") > 0) c.run(refreshSlot);
  });
});
