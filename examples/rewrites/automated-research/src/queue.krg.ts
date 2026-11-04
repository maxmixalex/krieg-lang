import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { clearMio, applyAuto, checkOption } from "./mio.krg.ts";
import { mark as markBonus } from "./bonus.krg.ts";
import { claim } from "./planner.krg.ts";
import { parents, blocked, exclusiveQueued } from "./graph.krg.ts";

// The queue is one logical table with four columns; mutations always operate on a row.
const columns = [
  { array: "rq_queue", input: "rq_ins_t" },
  { array: "rq_qprog", input: "rq_ins_p" },
  { array: "rq_qmio", input: "rq_ins_m" },
  { array: "rq_qsrc", input: "rq_ins_s" },
] as const;
export const find = ScriptedEffect("rq_q_find", (c: CountryScope) => {
  c.setTempVariable("rq_qi", -1);
  c.setTempVariable("rq_fb", 0);
  c.forEachValue("rq_queue", { value: "fv", index: "fi", break: "rq_fb" }, (c) => {
    if (c.variable("fv") === c.variable("rq_t")) {
      c.setTempVariable("rq_qi", c.variable("fi"));
      c.setTempVariable("rq_fb", 1);
    }
  });
});
export const read = ScriptedEffect("rq_q_read", (c: CountryScope) => {
  for (const column of columns)
    c.setTempVariable(column.input, c.arrayAt(column.array, c.variable("rq_qi")));
});
export const takeProgress = ScriptedEffect("rq_sp_take", (c: CountryScope) => {
  c.setTempVariable("rq_sp_p", 0);
  c.setTempVariable("rq_sp_i", -1);
  c.forEachValue("rq_sp_t", { value: "spv", index: "spi" }, (c) => {
    if (c.variable("spv") === c.variable("rq_sp_k"))
      c.setTempVariable("rq_sp_i", c.variable("spi"));
  });
  if (c.variable("rq_sp_i") > -1) {
    c.setTempVariable("rq_sp_p", c.arrayAt("rq_sp_v", c.variable("rq_sp_i")));
    c.arrayRemoveAt("rq_sp_t", c.variable("rq_sp_i"));
    c.arrayRemoveAt("rq_sp_v", c.variable("rq_sp_i"));
  }
});
export const storeProgress = ScriptedEffect("rq_sp_store", (c: CountryScope) => {
  c.setTempVariable("rq_sp_q", c.variable("rq_sp_p"));
  c.run(takeProgress);
  c.arrayPush("rq_sp_t", c.variable("rq_sp_k"));
  c.arrayPush("rq_sp_v", c.variable("rq_sp_q"));
});
export const remove = ScriptedEffect("rq_q_remove_at", (c: CountryScope) => {
  c.addVariable("rq_rows_v", 1);
  c.setTempVariable("rq_bm_t", c.arrayAt("rq_queue", c.variable("rq_qi")));
  c.run(markBonus);
  if (c.arrayAt("rq_qprog", c.variable("rq_qi")) > 0) {
    c.setTempVariable("rq_sp_k", c.arrayAt("rq_queue", c.variable("rq_qi")));
    c.setTempVariable("rq_sp_p", c.arrayAt("rq_qprog", c.variable("rq_qi")));
    c.run(storeProgress);
  }
  for (const column of columns) c.arrayRemoveAt(column.array, c.variable("rq_qi"));
});
export const insert = ScriptedEffect("rq_q_insert_at", (c: CountryScope) => {
  c.addVariable("rq_rows_v", 1);
  c.setTempVariable("rq_bm_t", c.variable("rq_ins_t"));
  c.run(markBonus);
  c.setTempVariable("rq_sp_k", c.variable("rq_ins_t"));
  c.run(takeProgress);
  if (c.variable("rq_sp_p") > c.variable("rq_ins_p"))
    c.setTempVariable("rq_ins_p", c.variable("rq_sp_p"));
  if (c.variable("rq_qi") < c.arrayLength("rq_queue")) {
    for (const column of columns)
      c.arrayInsert(column.array, c.variable("rq_qi"), c.variable(column.input));
  } else {
    for (const column of columns) c.arrayPush(column.array, c.variable(column.input));
  }
});
export const move = ScriptedEffect("rq_q_move", (c: CountryScope) => {
  c.run(read);
  c.run(remove);
  c.setTempVariable("rq_qi", c.variable("rq_qj"));
  c.run(insert);
});
export const setProgress = ScriptedEffect("rq_set_prog", (c: CountryScope) => {
  c.addVariable("rq_rows_v", 1);
  c.setTempVariable("rq_bm_t", c.arrayAt("rq_queue", c.variable("rq_qi")));
  c.run(markBonus);
  c.arraySet("rq_qprog", c.variable("rq_qi"), c.variable("rq_val"));
});
export const setMio = ScriptedEffect("rq_set_mio", (c: CountryScope) => {
  c.addVariable("rq_rows_v", 1);
  c.arraySet("rq_qmio", c.variable("rq_qi"), c.variable("rq_val"));
});
// Resolve a prerequisite chain iteratively. Alternative parents are OR choices,
// so a parent already before the child wins; otherwise move or insert the first candidate.
export const prerequisites = ScriptedEffect("rq_prereqs", (c: CountryScope) => {
  c.setTempVariable("rq_cur", c.variable("rq_t"));
  c.setTempVariable("rq_go", 1);
  c.setTempVariable("rq_n", 0);
  c.whileLoop(
    (c) => c.variable("rq_go") === 1 && c.variable("rq_n") < 60,
    (c) => {
      c.addTempVariable("rq_n", 1);
      c.setTempVariable("rq_go", 0);
      c.setTempVariable("rq_t", c.variable("rq_cur"));
      c.run(parents);
      if (c.variable("rq_have") === 0) {
        c.setTempVariable("rq_bef", 0);
        c.setTempVariable("rq_aft", -1);
        c.setTempVariable("rq_new", 0);
        c.forEachValue("rq_pars", { value: "pa" }, (c) => {
          c.setTempVariable("rq_t", c.variable("pa"));
          c.run(find);
          if (c.variable("rq_qi") > -1 && c.variable("rq_qi") < c.variable("rq_pp"))
            c.setTempVariable("rq_bef", 1);
          else if (c.variable("rq_qi") > c.variable("rq_pp") && c.variable("rq_aft") === -1) {
            c.setTempVariable("rq_aft", c.variable("rq_qi"));
            c.setTempVariable("rq_aftt", c.variable("pa"));
          } else if (c.variable("rq_qi") === -1 && c.variable("rq_new") === 0) {
            c.run(blocked);
            if (c.variable("rq_dead") === 0) c.setTempVariable("rq_new", c.variable("pa"));
          }
        });
        if (c.variable("rq_bef") === 0) {
          if (c.variable("rq_aft") > -1) {
            c.setTempVariable("rq_qi", c.variable("rq_aft"));
            c.setTempVariable("rq_qj", c.variable("rq_pp"));
            c.run(move);
            c.setTempVariable("rq_cur", c.variable("rq_aftt"));
            c.setTempVariable("rq_go", 1);
          } else if (c.variable("rq_new") > 0) {
            c.setTempVariable("rq_ins_t", c.variable("rq_new"));
            c.setTempVariable("rq_ins_p", 0);
            c.setTempVariable("rq_ins_m", 0);
            c.setTempVariable("rq_ins_s", 0);
            c.setTempVariable("rq_qi", c.variable("rq_pp"));
            c.run(insert);
            c.arrayPush("rq_added", c.variable("rq_new"));
            c.setTempVariable("rq_t", c.variable("rq_new"));
            c.setTempVariable("rq_qi", c.variable("rq_pp"));
            c.run(applyAuto);
            c.setTempVariable("rq_cur", c.variable("rq_new"));
            c.setTempVariable("rq_go", 1);
          }
        }
      }
    },
  );
});
export const prune = ScriptedEffect("rq_prune", (c: CountryScope) => {
  c.setTempVariable("rq_pgo", 1);
  c.setTempVariable("rq_pn", 0);
  c.whileLoop(
    (c) => c.variable("rq_pgo") === 1 && c.variable("rq_pn") < 300,
    (c) => {
      c.addTempVariable("rq_pn", 1);
      c.setTempVariable("rq_pgo", 0);
      c.setTempVariable("rq_pk", -1);
      c.setTempVariable("rq_pb", 0);
      c.forEachValue("rq_queue", { value: "pv2", index: "pi2", break: "rq_pb" }, (c) => {
        if (!c.arrayContains("rq_vanilla", c.variable("pv2"))) {
          c.setTempVariable("rq_t", c.variable("pv2"));
          c.run(parents);
          if (c.variable("rq_have") === 0) {
            c.setTempVariable("rq_pq", 0);
            c.forEachValue("rq_pars", { value: "pa2" }, (c) => {
              if (c.arrayContains("rq_queue", c.variable("pa2"))) c.setTempVariable("rq_pq", 1);
            });
            if (c.variable("rq_pq") === 0) {
              c.setTempVariable("rq_pk", c.variable("pi2"));
              c.setTempVariable("rq_pb", 1);
            }
          }
        }
      });
      if (c.variable("rq_pk") > -1) {
        c.setTempVariable("rq_qi", c.variable("rq_pk"));
        c.setTempVariable("rq_t", c.arrayAt("rq_queue", c.variable("rq_pk")));
        c.run(clearMio);
        c.run(remove);
        if (c.variable("rq_ml_t") === c.variable("rq_t")) c.setVariable("rq_ml_t", 0);
        c.setTempVariable("rq_pgo", 1);
      }
    },
  );
});
export const exclusiveSweep = ScriptedEffect("rq_xor_sweep", (c: CountryScope) => {
  c.clearArray("rq_xrm");
  c.forEachValue("rq_added", { value: "av" }, (c) => {
    c.setTempVariable("rq_t", c.variable("av"));
    c.run(exclusiveQueued);
  });
  if (c.arrayLength("rq_xrm") > 0) {
    c.forEachValue("rq_xrm", { value: "xv" }, (c) => {
      c.setTempVariable("rq_t", c.variable("xv"));
      c.run(find);
      if (
        c.variable("rq_qi") > -1 &&
        !(
          c.triggers.has_game_rule({ rule: "rq_lock_slots", option: "ON" }) &&
          c.arrayContains("rq_active", c.variable("xv"))
        )
      ) {
        c.run(clearMio);
        c.run(remove);
        if (c.variable("rq_ml_t") === c.variable("xv")) c.setVariable("rq_ml_t", 0);
      }
    });
    c.run(prune);
  }
});
export const positions = ScriptedEffect("rq_qpos_build", (c: CountryScope) => {
  c.clearArray("rq_qpos");
  c.forRange({ start: 0, end: 553, index: "rq_position_init" }, (c) => c.arrayPush("rq_qpos", -1));
  c.forEachValue("rq_queue", { value: "pv", index: "pi" }, (c) =>
    c.arraySet("rq_qpos", c.variable("pv"), c.variable("pi")),
  );
});
export const orderInfo = ScriptedEffect("rq_order_info", (c: CountryScope) => {
  c.clearArray("rq_qpar");
  c.clearArray("rq_qroot");
  c.run(positions);
  c.forEachValue("rq_queue", { value: "ov", index: "oi" }, (c) => {
    c.setTempVariable("rq_opar", -1);
    c.setTempVariable("rq_t", c.variable("ov"));
    c.run(parents);
    if (c.variable("rq_have") === 0) {
      c.forEachValue("rq_pars", { value: "oa" }, (c) => {
        c.setTempVariable("rq_qi", c.arrayAt("rq_qpos", c.variable("oa")));
        if (
          c.variable("rq_qi") > -1 &&
          c.variable("rq_qi") < c.variable("oi") &&
          (c.variable("rq_opar") === -1 || c.variable("rq_qi") < c.variable("rq_opar"))
        )
          c.setTempVariable("rq_opar", c.variable("rq_qi"));
      });
    }
    c.arrayPush("rq_qpar", c.variable("rq_opar"));
    c.setTempVariable("rq_oroot", c.variable("oi"));
    if (c.variable("rq_opar") > -1)
      c.setTempVariable("rq_oroot", c.arrayAt("rq_qroot", c.variable("rq_opar")));
    c.arrayPush("rq_qroot", c.variable("rq_oroot"));
  });
});
export const fixOrder = ScriptedEffect("rq_fix_order", (c: CountryScope) => {
  c.setTempVariable("rq_fx_go", 1);
  c.setTempVariable("rq_fx_n", 0);
  c.whileLoop(
    (c) => c.variable("rq_fx_go") === 1 && c.variable("rq_fx_n") < 200,
    (c) => {
      c.addTempVariable("rq_fx_n", 1);
      c.setTempVariable("rq_fx_go", 0);
      c.setTempVariable("rq_fx_b", 0);
      c.run(positions);
      c.forEachValue("rq_queue", { value: "xv", index: "xi", break: "rq_fx_b" }, (c) => {
        if (!c.arrayContains("rq_vanilla", c.variable("xv"))) {
          c.setTempVariable("rq_t", c.variable("xv"));
          c.run(parents);
          if (c.variable("rq_have") === 0) {
            c.setTempVariable("rq_fx_bef", 0);
            c.setTempVariable("rq_fx_aft", -1);
            c.forEachValue("rq_pars", { value: "xa" }, (c) => {
              c.setTempVariable("rq_qi", c.arrayAt("rq_qpos", c.variable("xa")));
              if (c.variable("rq_qi") > -1 && c.variable("rq_qi") < c.variable("xi"))
                c.setTempVariable("rq_fx_bef", 1);
              else if (
                c.variable("rq_qi") > c.variable("xi") &&
                (c.variable("rq_fx_aft") === -1 || c.variable("rq_qi") < c.variable("rq_fx_aft"))
              )
                c.setTempVariable("rq_fx_aft", c.variable("rq_qi"));
            });
            if (c.variable("rq_fx_bef") === 0 && c.variable("rq_fx_aft") > -1) {
              c.setTempVariable("rq_fx_i", c.variable("xi"));
              c.setTempVariable("rq_fx_j", c.variable("rq_fx_aft"));
              c.setTempVariable("rq_fx_b", 1);
              c.setTempVariable("rq_fx_go", 1);
            }
          }
        }
      });
      if (c.variable("rq_fx_go") === 1) {
        c.setTempVariable("rq_qi", c.variable("rq_fx_i"));
        c.setTempVariable("rq_qj", c.variable("rq_fx_j"));
        c.run(move);
      }
    },
  );
});
export function clearEditable(c: CountryScope) {
  c.setVariable("rq_clr", 0);
  c.setTempVariable("rq_ci", c.arrayLength("rq_queue"));
  c.whileLoop(
    (c) => c.variable("rq_ci") > 0,
    (c) => {
      c.subtractTempVariable("rq_ci", 1);
      c.setTempVariable("rq_t", c.arrayAt("rq_queue", c.variable("rq_ci")));
      if (
        !c.arrayContains("rq_vanilla", c.variable("rq_t")) &&
        !(
          c.triggers.has_game_rule({ rule: "rq_lock_slots", option: "ON" }) &&
          c.arrayContains("rq_active", c.variable("rq_t"))
        )
      ) {
        c.run(clearMio);
        c.setTempVariable("rq_qi", c.variable("rq_ci"));
        c.run(remove);
      }
    },
  );
  c.setVariable("rq_ml_t", 0);
}
export function treeEdit(c: CountryScope) {
  c.run(find);
  if (c.variable("rq_qi") > -1) {
    if (c.variable("rq_top") === 1) {
      c.setTempVariable("rq_qj", c.arrayLength("rq_vanilla"));
      c.run(move);
      c.setTempVariable("rq_pp", c.variable("rq_qj"));
      c.setTempVariable("rq_tc", c.variable("rq_t"));
      c.clearArray("rq_added");
      c.arrayPush("rq_added", c.variable("rq_tc"));
      c.run(prerequisites);
      c.run(exclusiveSweep);
      c.setTempVariable("rq_t", c.variable("rq_tc"));
      c.run(claim);
    } else if (c.variable("rq_mopen") === 1 && c.arrayContains("rq_vanilla", c.variable("rq_t")))
      c.setTempVariable("rq_c", 0);
    else if (c.variable("rq_mopen") === 1) {
      c.run(checkOption);
      if (c.variable("rq_c") === 1) c.setVariable("rq_ml_t", c.variable("rq_t"));
    } else if (!(
      c.triggers.has_game_rule({ rule: "rq_lock_slots", option: "ON" }) &&
      c.arrayContains("rq_active", c.variable("rq_t"))
    )) {
      if (!c.arrayContains("rq_vanilla", c.variable("rq_t"))) {
        c.run(clearMio);
        c.run(remove);
        if (c.variable("rq_ml_t") === c.variable("rq_t")) c.setVariable("rq_ml_t", 0);
        c.setTempVariable("rq_tc", c.variable("rq_t"));
        c.run(prune);
        c.setTempVariable("rq_t", c.variable("rq_tc"));
      } else {
        c.run(read);
        c.run(remove);
        c.setTempVariable("rq_ins_s", 0);
        c.run(insert);
      }
    }
  } else {
    c.setTempVariable("rq_ins_t", c.variable("rq_t"));
    c.setTempVariable("rq_ins_p", 0);
    c.setTempVariable("rq_ins_m", 0);
    c.setTempVariable("rq_ins_s", 0);
    c.setTempVariable("rq_qi", c.arrayLength("rq_queue"));
    if (c.variable("rq_top") === 1) c.setTempVariable("rq_qi", c.arrayLength("rq_vanilla"));
    c.run(insert);
    c.run(find);
    c.run(applyAuto);
    c.setTempVariable("rq_tc", c.variable("rq_t"));
    c.run(find);
    c.setTempVariable("rq_pp", c.variable("rq_qi"));
    c.clearArray("rq_added");
    c.arrayPush("rq_added", c.variable("rq_tc"));
    c.run(prerequisites);
    c.run(exclusiveSweep);
    c.setTempVariable("rq_t", c.variable("rq_tc"));
    c.run(claim);
    c.setVariable("rq_ml_t", 0);
    if (c.variable("rq_mopen") === 1) {
      c.run(checkOption);
      if (c.variable("rq_c") === 1) c.setVariable("rq_ml_t", c.variable("rq_t"));
    }
  }
}
export const takeVanillaProgress = ScriptedEffect("rq_gp_take", (c: CountryScope) => {
  c.setTempVariable("rq_gpv_r", 0);
  c.setTempVariable("rq_gpi", -1);
  c.forEachValue("rq_gpk", { value: "gk", index: "gi" }, (c) => {
    if (c.variable("gk") === c.variable("rq_t")) c.setTempVariable("rq_gpi", c.variable("gi"));
  });
  if (c.variable("rq_gpi") > -1) {
    c.setTempVariable("rq_gpv_r", c.arrayAt("rq_gpv", c.variable("rq_gpi")));
    c.arrayRemoveAt("rq_gpk", c.variable("rq_gpi"));
    c.arrayRemoveAt("rq_gpv", c.variable("rq_gpi"));
  }
});
export const storeVanillaProgress = ScriptedEffect("rq_gp_store", (c: CountryScope) => {
  c.run(takeVanillaProgress);
  c.arrayPush("rq_gpk", c.variable("rq_t"));
  c.arrayPush("rq_gpv", c.variable("rq_val"));
});
