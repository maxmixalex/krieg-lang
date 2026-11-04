import { searchFilter } from "./search.krg.ts";
import { bonus as mioBonus } from "./mio.krg.ts";
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { inTab, available } from "./graph.krg.ts";
import { nameFont, nameRank } from "./lookup.krg.ts";
import { computeCost, technologySpeed, daysLeft } from "./progress.krg.ts";
import { orderInfo } from "./queue.krg.ts";

export const groupView = ScriptedEffect("rq_group_view", (c: CountryScope) => {
  if (c.variable("rq_grp_on") === 1) {
    c.clearArray("rq_gv");
    c.forEachValue("rq_view", { value: "gv" }, (c) => {
      if (c.arrayAt("rq_qst", c.variable("gv")) < 3) c.arrayPush("rq_gv", c.variable("gv"));
    });
    c.forEachValue("rq_view", { value: "gv" }, (c) => {
      if (c.arrayAt("rq_qst", c.variable("gv")) > 2) c.arrayPush("rq_gv", c.variable("gv"));
    });
    c.clearArray("rq_view");
    c.forEachValue("rq_gv", { value: "gv" }, (c) => c.arrayPush("rq_view", c.variable("gv")));
  }
  c.clearArray("rq_gv");
});
export const sortView = ScriptedEffect("rq_sort_view", (c: CountryScope) => {
  c.setTempVariable("rq_sk", 0);
  c.setTempVariable("rq_sd", 1);
  if (c.variable("rq_sortn_f") > 1) {
    c.setTempVariable("rq_sk", 1);
    if (c.variable("rq_sortn_f") === 3) c.setTempVariable("rq_sd", -1);
  } else if (c.variable("rq_sortt_f") > 1) {
    c.setTempVariable("rq_sk", 2);
    if (c.variable("rq_sortt_f") === 3) c.setTempVariable("rq_sd", -1);
  }
  if (c.variable("rq_sk") > 0) {
    c.clearArray("rq_skey");
    c.clearArray("rq_sidx");
    c.forEachValue("rq_view", { value: "sv" }, (c) => {
      c.setTempVariable("rq_t", c.arrayAt("rq_queue", c.variable("sv")));
      if (c.variable("rq_sk") === 1) {
        c.run(nameRank);
        c.setTempVariable("rq_key", c.variable("rq_nr") * c.variable("rq_sd"));
      } else
        c.setTempVariable("rq_key", c.arrayAt("rq_qdays", c.variable("sv")) * c.variable("rq_sd"));
      c.arrayPush("rq_skey", c.variable("rq_key"));
      c.arrayPush("rq_sidx", c.variable("sv"));
    });
    c.clearArray("rq_view");
    c.setTempVariable("rq_sn", 0);
    c.whileLoop(
      (c) => c.arrayLength("rq_skey") > 0 && c.variable("rq_sn") < 999,
      (c) => {
        c.addTempVariable("rq_sn", 1);
        c.setTempVariable("rq_bk", 0);
        c.setTempVariable("rq_bv", c.arrayAt("rq_skey", 0));
        c.forEachValue("rq_skey", { value: "kv", index: "ki" }, (c) => {
          if (c.variable("kv") < c.variable("rq_bv")) {
            c.setTempVariable("rq_bv", c.variable("kv"));
            c.setTempVariable("rq_bk", c.variable("ki"));
          }
        });
        c.arrayPush("rq_view", c.arrayAt("rq_sidx", c.variable("rq_bk")));
        c.arrayRemoveAt("rq_skey", c.variable("rq_bk"));
        c.arrayRemoveAt("rq_sidx", c.variable("rq_bk"));
      },
    );
  }
  c.clearArray("rq_sidx");
  c.clearArray("rq_skey");
});
export const capView = ScriptedEffect("rq_view_cap", (c: CountryScope) => {
  c.setTempVariable("rq_vcap", 50);
  c.setVariable("rq_vcf", 2);
  if (c.variable("rq_vcm") === 1) {
    c.setTempVariable("rq_vcap", 75);
    c.setVariable("rq_vcf", 3);
  }
  if (c.variable("rq_vcm") === 2) {
    c.setTempVariable("rq_vcap", 100);
    c.setVariable("rq_vcf", 4);
  }
  if (c.variable("rq_vcm") === 3) {
    c.setTempVariable("rq_vcap", 0);
    c.setVariable("rq_vcf", 5);
  }
  if (c.variable("rq_vcm") === 4) {
    c.setTempVariable("rq_vcap", 25);
    c.setVariable("rq_vcf", 1);
  }
  c.clearArray("rq_vshow");
  c.forEachValue("rq_view", { value: "cv", index: "ci" }, (c) => {
    if (
      c.variable("rq_vcap") === 0 ||
      c.variable("ci") < c.variable("rq_vcap") ||
      c.arrayAt("rq_qst", c.variable("cv")) < 3
    )
      c.arrayPush("rq_vshow", c.variable("cv"));
  });
});
export const refresh = ScriptedEffect("rq_refresh", (c: CountryScope) => {
  for (const array of [
    "rq_view",
    "rq_qst",
    "rq_qpct",
    "rq_qbarx",
    "rq_qdays",
    "rq_qname",
    "rq_qfont",
    "rq_qfs",
    "rq_qtb",
    "rq_qsh",
    "rq_qlb",
    "rq_qla",
    "rq_qya",
    "rq_qah",
    "rq_qef",
    "rq_qdn",
    "rq_qbc",
    "rq_qmb",
  ])
    c.clearArray(array);
  c.forEachValue("rq_queue", { value: "pv", index: "pi" }, (c) => {
    c.setTempVariable("rq_t", c.variable("pv"));
    c.setTempVariable("rq_st", 4);
    if (c.arrayContains("rq_vanilla", c.variable("pv"))) c.setTempVariable("rq_st", 1);
    else if (c.arrayContains("rq_active", c.variable("pv"))) c.setTempVariable("rq_st", 2);
    else {
      c.run(available);
      if (c.variable("rq_avail") === 1) c.setTempVariable("rq_st", 3);
    }
    c.arrayPush("rq_qst", c.variable("rq_st"));
    c.arrayPush("rq_qname", c.variable("pv"));
    c.run(nameFont);
    c.arrayPush("rq_qfont", c.variable("rq_fs"));
    c.arrayPush("rq_qfs", c.variable("rq_fs"));
    c.setTempVariable("rq_intab", 1);
    if (c.variable("rq_tabn") > 0) c.run(inTab);
    if (c.variable("rq_intab") === 1) c.arrayPush("rq_view", c.variable("pi"));
    c.run(computeCost);
    c.setTempVariable("rq_p", c.arrayAt("rq_qprog", c.variable("pi")));
    c.setTempVariable("rq_x", c.variable("rq_p") / c.variable("rq_base_cost"));
    c.clampTempVariable("rq_x", { min: 0, max: 1 });
    c.arrayPush("rq_qpct", c.variable("rq_x"));
    c.setTempVariable("rq_bar_x", c.variable("rq_x") * 160 - 160);
    c.effects.round_temp_variable("rq_bar_x");
    c.arrayPush("rq_qbarx", c.variable("rq_bar_x"));
    c.setTempVariable("rq_mb", 0);
    if (c.arrayAt("rq_qmio", c.variable("pi")) > 0) c.run(mioBonus);
    c.arrayPush("rq_qmb", c.variable("rq_mb"));
    c.setTempVariable("rq_r", c.variable("rq_base_cost") - c.variable("rq_p"));
    c.run(technologySpeed);
    c.setTempVariable("rq_spd", c.variable("rq_tspd") + c.variable("rq_mb"));
    for (const pair of [
      { array: "rq_qtb", value: "rq_tb" },
      { array: "rq_qsh", value: "rq_tsh" },
      { array: "rq_qlb", value: "rq_lbv" },
      { array: "rq_qla", value: "rq_lba" },
      { array: "rq_qya", value: "rq_ya" },
      { array: "rq_qah", value: "rq_ahead" },
      { array: "rq_qdn", value: "rq_p" },
      { array: "rq_qbc", value: "rq_base_cost" },
    ])
      c.arrayPush(pair.array, c.variable(pair.value));
    c.setTempVariable("rq_ef", c.variable("rq_spd") / c.variable("rq_ahead"));
    c.clampTempVariable("rq_ef", { min: 0.1 });
    c.arrayPush("rq_qef", c.variable("rq_ef"));
    c.setTempVariable("rq_vdl", 0);
    if (c.arrayContains("rq_vanilla", c.variable("pv"))) c.setTempVariable("rq_vdl", 1);
    c.run(daysLeft);
    if (c.variable("rq_vdl") === 1) c.addTempVariable("rq_x", 0.499);
    else c.subtractTempVariable("rq_x", 0.499);
    c.effects.round_temp_variable("rq_x");
    c.clampTempVariable("rq_x", { min: 1 });
    c.arrayPush("rq_qdays", c.variable("rq_x"));
  });
  searchFilter(c);
  c.run(groupView);
  c.run(sortView);
  c.run(capView);
  c.run(orderInfo);
  c.setVariable("rq_qn", c.arrayLength("rq_queue"));
  c.setVariable("rq_tq_n", c.arrayLength("rq_queue"));
  c.setVariable(
    "rq_waiting",
    c.arrayLength("rq_queue") - c.arrayLength("rq_vanilla") - c.arrayLength("rq_active"),
  );
  c.effects.setCountryFlag("rq_q_shown");
  c.addVariable("rq_dirty", 1);
});
