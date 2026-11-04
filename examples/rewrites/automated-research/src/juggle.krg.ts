import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { daysLeft } from "./progress.krg.ts";
import { find, setProgress } from "./queue.krg.ts";
import { owned } from "./lookup.krg.ts";
import { dead } from "./graph.krg.ts";

export const days = ScriptedEffect("rq_jg_days", (c: CountryScope) => {
  c.setTempVariable("rq_qi", c.arrayAt("rq_lh_i", c.variable("rq_jg_li")));
  c.setTempVariable(
    "rq_r",
    c.arrayAt("rq_lh_c", c.variable("rq_jg_li")) - c.arrayAt("rq_qprog", c.variable("rq_qi")),
  );
  c.setTempVariable("rq_spd", c.arrayAt("rq_lh_b", c.variable("rq_jg_li")));
  c.setTempVariable("rq_ya", c.arrayAt("rq_lh_y", c.variable("rq_jg_li")));
  c.setTempVariable("rq_vdl", 0);
  c.run(daysLeft);
});
export const give = ScriptedEffect("rq_jg_give", (c: CountryScope) => {
  c.run(days);
  c.setTempVariable("rq_jg_w", c.variable("rq_r"));
  if (c.variable("rq_x") > c.variable("rq_jg_g")) {
    c.setTempVariable("rq_jg_w", 0);
    c.setTempVariable("rq_jg_ad", c.variable("rq_ya") * 365);
    c.setTempVariable("rq_jg_t", c.variable("rq_x") - c.variable("rq_jg_g") + 0.5);
    c.setTempVariable("rq_jg_n", 0);
    c.whileLoop(
      (c) => c.variable("rq_jg_n") < c.variable("rq_jg_g"),
      (c) => {
        c.addTempVariable("rq_jg_n", 1);
        c.setTempVariable("rq_jg_c", c.variable("rq_jg_ad") - c.variable("rq_jg_t"));
        c.clampTempVariable("rq_jg_c", { min: 0 });
        c.multiplyTempVariable("rq_jg_c", 2);
        c.divideTempVariable("rq_jg_c", 365);
        c.addTempVariable("rq_jg_c", 1);
        c.setTempVariable("rq_jg_r", c.variable("rq_spd") / c.variable("rq_jg_c"));
        c.addTempVariable("rq_jg_w", c.variable("rq_jg_r"));
        c.addTempVariable("rq_jg_t", 1);
      },
    );
  }
  c.setTempVariable("rq_val", c.arrayAt("rq_qprog", c.variable("rq_qi")) + c.variable("rq_jg_w"));
  c.run(setProgress);
});
export const bankUsed = ScriptedEffect("rq_bu_get", (c: CountryScope) => {
  c.setTempVariable("rq_bu", 0);
  c.forEachValue("rq_bu_t", { value: "buv", index: "bui" }, (c) => {
    if (c.variable("buv") === c.variable("rq_t"))
      c.setTempVariable("rq_bu", c.arrayAt("rq_bu_v", c.variable("bui")));
  });
});
export const bankAdd = ScriptedEffect("rq_bu_add", (c: CountryScope) => {
  c.setTempVariable("rq_bu_i", -1);
  c.forEachValue("rq_bu_t", { value: "buv", index: "bui" }, (c) => {
    if (c.variable("buv") === c.variable("rq_t")) c.setTempVariable("rq_bu_i", c.variable("bui"));
  });
  if (c.variable("rq_bu_i") > -1) {
    c.setTempVariable("rq_bu", c.arrayAt("rq_bu_v", c.variable("rq_bu_i")) + c.variable("rq_jg_g"));
    c.arraySet("rq_bu_v", c.variable("rq_bu_i"), c.variable("rq_bu"));
  } else {
    c.arrayPush("rq_bu_t", c.variable("rq_t"));
    c.arrayPush("rq_bu_v", c.variable("rq_jg_g"));
  }
});
export const bankApply = ScriptedEffect("rq_bk_apply", (c: CountryScope) => {
  if (c.variable("rq_no_progress") !== 1) {
    c.forEachValue("rq_bkp_t", { value: "bkv", index: "bki" }, (c) => {
      c.setTempVariable("rq_jg_li", -1);
      c.forEachValue("rq_lh_t", { value: "jlv", index: "jli" }, (c) => {
        if (c.variable("jlv") === c.variable("bkv"))
          c.setTempVariable("rq_jg_li", c.variable("jli"));
      });
      if (c.variable("rq_jg_li") > -1) {
        c.setTempVariable("rq_jg_g", c.arrayAt("rq_bkp_v", c.variable("bki")));
        c.setTempVariable("rq_qi", c.arrayAt("rq_lh_i", c.variable("rq_jg_li")));
        c.setTempVariable(
          "rq_val",
          c.arrayAt("rq_lh_s", c.variable("rq_jg_li")) * c.variable("rq_jg_g") +
            c.arrayAt("rq_qprog", c.variable("rq_qi")),
        );
        c.run(setProgress);
        c.setTempVariable("rq_t", c.variable("bkv"));
        c.run(bankAdd);
      }
    });
    c.clearArray("rq_bkp_t");
    c.clearArray("rq_bkp_v");
    c.clearArray("rq_sp_nt");
    c.clearArray("rq_sp_nv");
    c.forEachValue("rq_sp_t", { value: "spv", index: "spi" }, (c) => {
      c.setTempVariable("rq_t", c.variable("spv"));
      c.run(owned);
      c.run(dead);
      if (c.variable("rq_owned") === 0 && c.variable("rq_dead") === 0) {
        c.arrayPush("rq_sp_nt", c.variable("spv"));
        c.arrayPush("rq_sp_nv", c.arrayAt("rq_sp_v", c.variable("spi")));
      }
    });
    c.clearArray("rq_sp_t");
    c.clearArray("rq_sp_v");
    c.forEachValue("rq_sp_nt", { value: "spv", index: "spi" }, (c) => {
      c.arrayPush("rq_sp_t", c.variable("spv"));
      c.arrayPush("rq_sp_v", c.arrayAt("rq_sp_nv", c.variable("spi")));
    });
    c.clearArray("rq_bu_nt");
    c.clearArray("rq_bu_nv");
    c.forEachValue("rq_bu_t", { value: "buv", index: "bui" }, (c) => {
      if (
        c.arrayContains("rq_queue", c.variable("buv")) ||
        c.arrayContains("rq_sp_t", c.variable("buv"))
      ) {
        c.arrayPush("rq_bu_nt", c.variable("buv"));
        c.arrayPush("rq_bu_nv", c.arrayAt("rq_bu_v", c.variable("bui")));
      }
    });
    c.clearArray("rq_bu_t");
    c.clearArray("rq_bu_v");
    c.forEachValue("rq_bu_nt", { value: "buv", index: "bui" }, (c) => {
      c.arrayPush("rq_bu_t", c.variable("buv"));
      c.arrayPush("rq_bu_v", c.arrayAt("rq_bu_nv", c.variable("bui")));
    });
  }
});
export const plan = ScriptedEffect("rq_jg_plan", (c: CountryScope) => {
  c.clearArray("rq_jg_fire");
  if (
    !c.triggers.has_country_flag("rq_ap_on") ||
    c.variable("rq_ap_jgf") !== 2 ||
    c.arrayLength("rq_jgl") < 1
  ) {
    c.clearArray("rq_jg_r");
    c.clearArray("rq_jg_d");
  }
  if (!c.triggers.has_country_flag("rq_ap_on")) c.clearArray("rq_jg_u");
  c.setTempVariable("rq_jg_go", 1);
  c.setTempVariable("rq_jg_k", 0);
  c.whileLoop(
    (c) => c.variable("rq_jg_go") === 1 && c.variable("rq_jg_k") < 20,
    (c) => {
      c.addTempVariable("rq_jg_k", 1);
      c.setTempVariable("rq_jg_go", 0);
      c.setTempVariable("rq_jg_fi", -1);
      c.forEachValue("rq_jg_r", { value: "jrv", index: "jri" }, (c) => {
        if (!c.arrayContains("rq_active", c.variable("jrv")))
          c.setTempVariable("rq_jg_fi", c.variable("jri"));
      });
      if (c.variable("rq_jg_fi") > -1) {
        c.arrayRemoveAt("rq_jg_r", c.variable("rq_jg_fi"));
        c.arrayRemoveAt("rq_jg_d", c.variable("rq_jg_fi"));
        c.setTempVariable("rq_jg_go", 1);
      }
    },
  );
  // Locked research slots may lend only capacity whose previous project ended,
  // or a newly filled slot that has not accumulated progress.
  if (c.triggers.has_game_rule({ rule: "rq_lock_slots", option: "ON" })) {
    c.setTempVariable("rq_jg_fr", c.variable("rq_lanes_n") - c.variable("rq_jg_pn"));
    c.clampTempVariable("rq_jg_fr", { min: 0 });
    c.setTempVariable("rq_jg_fi2", c.variable("rq_jg_ip") - c.variable("rq_lanes"));
    c.clampTempVariable("rq_jg_fi2", { min: 0 });
    c.addTempVariable("rq_jg_fr", c.variable("rq_jg_fi2"));
    c.forEachValue("rq_jg_prev", { value: "jpv" }, (c) => {
      if (
        !c.arrayContains("rq_active", c.variable("jpv")) &&
        !c.arrayContains("rq_vanilla", c.variable("jpv"))
      ) {
        c.setTempVariable("rq_t", c.variable("jpv"));
        c.run(find);
        if (c.variable("rq_qi") === -1) c.addTempVariable("rq_jg_fr", 1);
        else if (
          c.arrayContains("rq_jg_el", c.variable("jpv")) &&
          !(c.arrayAt("rq_qprog", c.variable("rq_qi")) > 0)
        )
          c.addTempVariable("rq_jg_fr", 1);
      }
    });
    c.clearArray("rq_jg_keep");
    c.forEachValue("rq_active", { value: "jev" }, (c) => {
      if (
        c.arrayContains("rq_jg_prev", c.variable("jev")) &&
        c.arrayContains("rq_jg_el", c.variable("jev"))
      )
        c.arrayPush("rq_jg_keep", c.variable("jev"));
      else if (
        !c.arrayContains("rq_jg_prev", c.variable("jev")) &&
        !c.arrayContains("rq_jgl", c.variable("jev")) &&
        c.variable("rq_jg_fr") > 0
      ) {
        c.arrayPush("rq_jg_keep", c.variable("jev"));
        c.subtractTempVariable("rq_jg_fr", 1);
      }
    });
    c.clearArray("rq_jg_el");
    c.forEachValue("rq_jg_keep", { value: "jkv" }, (c) =>
      c.arrayPush("rq_jg_el", c.variable("jkv")),
    );
    c.clearArray("rq_jg_prev");
    c.forEachValue("rq_active", { value: "jpv" }, (c) =>
      c.arrayPush("rq_jg_prev", c.variable("jpv")),
    );
    c.setVariable("rq_jg_pn", c.variable("rq_lanes_n"));
    c.setVariable("rq_jg_ip", c.variable("rq_lanes"));
  }
  c.clearArray("rq_jg_pool");
  c.forEachValue("rq_active", { value: "jav" }, (c) => {
    if (
      !c.arrayContains("rq_jgl", c.variable("jav")) &&
      !c.arrayContains("rq_jg_r", c.variable("jav"))
    ) {
      c.setTempVariable("rq_jg_ok", 1);
      if (c.triggers.has_game_rule({ rule: "rq_lock_slots", option: "ON" })) {
        if (!c.arrayContains("rq_jg_el", c.variable("jav"))) c.setTempVariable("rq_jg_ok", 0);
        c.setTempVariable("rq_t", c.variable("jav"));
        c.run(find);
        if (c.variable("rq_qi") > -1 && c.arrayAt("rq_qprog", c.variable("rq_qi")) > 0)
          c.setTempVariable("rq_jg_ok", 0);
      }
      if (c.variable("rq_jg_ok") === 1) c.arrayPush("rq_jg_pool", c.variable("jav"));
    }
  });
  if (
    c.triggers.has_country_flag("rq_ap_on") &&
    c.variable("rq_ap_jgf") === 2 &&
    c.variable("rq_no_progress") !== 1
  ) {
    c.setTempVariable("rq_jg_free", c.arrayLength("rq_jg_pool") - c.arrayLength("rq_jg_r"));
    c.forEachValue("rq_lh_t", { value: "jlv", index: "jli" }, (c) => {
      if (
        c.variable("rq_jg_free") > 0 &&
        c.arrayContains("rq_jgl", c.variable("jlv")) &&
        !c.arrayContains("rq_jg_r", c.variable("jlv")) &&
        !c.arrayContains("rq_jg_u", c.variable("jlv"))
      ) {
        c.setTempVariable("rq_jg_li", c.variable("jli"));
        c.run(days);
        c.setTempVariable("rq_t", c.variable("jlv"));
        c.run(bankUsed);
        if (c.variable("rq_x") > 1 && c.variable("rq_bu") < 30) {
          c.arrayPush("rq_jg_r", c.variable("jlv"));
          c.arrayPush("rq_jg_d", 0);
          c.subtractTempVariable("rq_jg_free", 1);
        }
      }
    });
  }
  c.clearArray("rq_jga");
  c.clearArray("rq_jgr");
  c.clearArray("rq_jgx");
  c.clearArray("rq_jg_nd");
  c.setTempVariable("rq_jg_pi", c.arrayLength("rq_jg_pool"));
  c.forEachValue("rq_jg_r", { value: "jrv", index: "jri" }, (c) => {
    c.setTempVariable("rq_jg_dd", c.arrayAt("rq_jg_d", c.variable("jri")));
    c.subtractTempVariable("rq_jg_pi", 1);
    if (c.variable("rq_jg_pi") > -1) {
      if (c.variable("rq_no_progress") !== 1) {
        c.addTempVariable("rq_jg_dd", 1);
        c.setTempVariable("rq_jg_li", -1);
        c.forEachValue("rq_lh_t", { value: "jlv", index: "jli" }, (c) => {
          if (c.variable("jlv") === c.variable("jrv"))
            c.setTempVariable("rq_jg_li", c.variable("jli"));
        });
        if (c.variable("rq_jg_li") > -1) {
          c.run(days);
          c.setTempVariable("rq_t", c.variable("jrv"));
          c.run(bankUsed);
          c.setTempVariable("rq_jg_g", 30 - c.variable("rq_bu"));
          c.clampTempVariable("rq_jg_g", { min: 0 });
          if (
            !(c.variable("rq_jg_dd") < c.variable("rq_jg_g")) ||
            !(c.variable("rq_jg_dd") < c.variable("rq_x"))
          ) {
            c.arrayPush("rq_jg_fire", c.variable("jrv"));
            c.run(give);
          }
        }
      }
      c.setTempVariable("rq_jg_dv", c.arrayAt("rq_jg_pool", c.variable("rq_jg_pi")));
      c.arrayPush("rq_jga", c.variable("rq_jg_dv"));
      c.arrayPush("rq_jgr", c.variable("jrv"));
      c.arrayPush("rq_jgx", c.variable("rq_jg_dd"));
    }
    c.arrayPush("rq_jg_nd", c.variable("rq_jg_dd"));
  });
  c.clearArray("rq_jg_d");
  c.forEachValue("rq_jg_nd", { value: "jnv" }, (c) => c.arrayPush("rq_jg_d", c.variable("jnv")));
  c.clearArray("rq_jg_keep");
  c.clearArray("rq_jg_pool");
});
export const snap = ScriptedEffect("rq_jg_snap", (c: CountryScope) => {
  c.clearArray("rq_jg_sr");
  c.forEachValue("rq_jg_r", { value: "jsv" }, (c) => {
    c.setTempVariable("rq_t", c.variable("jsv"));
    c.run(find);
    c.arrayPush("rq_jg_sr", c.variable("rq_qi"));
  });
});
export const follow = ScriptedEffect("rq_jg_follow", (c: CountryScope) => {
  c.forEachValue("rq_jg_sr", { value: "jsv", index: "jsi" }, (c) => {
    if (
      c.variable("jsv") > -1 &&
      c.variable("jsv") < c.arrayLength("rq_queue") &&
      c.variable("jsi") < c.arrayLength("rq_jg_r") &&
      (c.variable("rq_jg_only") === 0 ||
        c.arrayAt("rq_jg_r", c.variable("jsi")) === c.variable("rq_jg_only"))
    ) {
      c.setTempVariable("rq_jg_nt", c.arrayAt("rq_queue", c.variable("jsv")));
      if (c.variable("rq_jg_only") === 0 || !c.arrayContains("rq_jg_r", c.variable("rq_jg_nt")))
        c.arraySet("rq_jg_r", c.variable("jsi"), c.variable("rq_jg_nt"));
    }
  });
});
