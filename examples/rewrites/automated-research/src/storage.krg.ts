import { ScriptedEffect, country, type CountryScope } from "krieg-lang/hoi4";
import { saveBits } from "./persistence.krg.ts";
import { countryFlags } from "./save-facts.krg.ts";
import { technologies } from "./technologies.krg.ts";
import { dead } from "./graph.krg.ts";
import { owned } from "./lookup.krg.ts";
import { find, insert, prerequisites, exclusiveSweep, clearEditable } from "./queue.krg.ts";
import { restoreMio, applyAuto } from "./mio.krg.ts";
import { update } from "./core.krg.ts";

const nameColumns = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
] as const;
const metaColumns = [
  "rq_svx",
  "rq_svtag",
  "rq_svva",
  "rq_svvb",
  "rq_svvc",
  "rq_svmod",
  "rq_svok",
  "rq_svf",
  "rq_svpid",
] as const;
export const dlcs = [
  { index: 0, name: "Together for Victory", affectsTech: false },
  { index: 1, name: "Death or Dishonor", affectsTech: false },
  { index: 2, name: "Waking the Tiger", affectsTech: false },
  { index: 3, name: "Man the Guns", affectsTech: true },
  { index: 4, name: "La Resistance", affectsTech: true },
  { index: 5, name: "Battle for the Bosporus", affectsTech: false },
  { index: 6, name: "No Step Back", affectsTech: true },
  { index: 7, name: "By Blood Alone", affectsTech: true },
  { index: 8, name: "Arms Against Tyranny", affectsTech: true },
  { index: 9, name: "Trial of Allegiance", affectsTech: false },
  { index: 10, name: "Gotterdammerung", affectsTech: true },
  { index: 11, name: "Graveyard of Empires", affectsTech: true },
  { index: 12, name: "Thunder at Our Gates", affectsTech: true },
  { index: 13, name: "Peace For Our Time", affectsTech: true },
  { index: 14, name: "No Compromise, No Surrender", affectsTech: true },
  { index: 15, name: "Poland: United and Ready", affectsTech: false },
] as const;
export const flagCode = ScriptedEffect("rq_flag_code", (c: CountryScope) => {
  c.setTempVariable("rq_fc", 0);
  for (const flag of countryFlags) {
    if (c.triggers.original_tag(country(flag.tag))) {
      c.setTempVariable("rq_fc", flag.code);
      for (const government of flag.governments) {
        if (c.triggers.has_government(government.name)) c.setTempVariable("rq_fc", government.code);
      }
    }
  }
});
export const message = ScriptedEffect("rq_msg_set", (c: CountryScope) => {
  c.setVariable("rq_msg", c.variable("rq_msgk"));
  c.addVariable("rq_ld_dirty", 1);
  c.addVariable("rq_msg_cn", 1);
  c.setVariable("rq_msg_t", 2);
  c.addVariable("rq_dirty", 1);
});
export const messageTick = ScriptedEffect("rq_msg_tick", (c: CountryScope) => {
  if (c.variable("rq_msg_t") > 0) {
    c.subtractVariable("rq_msg_t", 1);
    if (c.variable("rq_msg_t") < 1) c.setVariable("rq_msg", 0);
  }
});
export const writeBits = ScriptedEffect("rq_bits_write", (c: CountryScope) => {
  c.setTempVariable("rq_wk", 0);
  c.whileLoop(
    (c) => c.variable("rq_wk") < c.variable("rq_wn"),
    (c) => {
      c.setTempVariable("rq_wb", c.variable("rq_wv") % 2);
      if (c.variable("rq_wb") === 1) {
        c.setTempVariable("rq_bj", c.variable("rq_bp"));
        c.run(saveBits.mark);
      }
      c.setTempVariable("rq_wv", (c.variable("rq_wv") - c.variable("rq_wb")) / 2);
      c.addTempVariable("rq_bp", 1);
      c.addTempVariable("rq_wk", 1);
    },
  );
});
export const readBits = ScriptedEffect("rq_bits_read", (c: CountryScope) => {
  c.setTempVariable("rq_rv", 0);
  c.setTempVariable("rq_rm", 1);
  c.setTempVariable("rq_rk", 0);
  c.whileLoop(
    (c) => c.variable("rq_rk") < c.variable("rq_rn"),
    (c) => {
      if (c.variable("rq_rp") < 8192 && c.arrayAt("rq_bits", c.variable("rq_rp")) === 1)
        c.addTempVariable("rq_rv", c.variable("rq_rm"));
      c.multiplyTempVariable("rq_rm", 2);
      c.addTempVariable("rq_rp", 1);
      c.addTempVariable("rq_rk", 1);
    },
  );
});
function write(c: CountryScope, value: number, width: number) {
  c.setTempVariable("rq_wv", value);
  c.setTempVariable("rq_wn", width);
  c.run(writeBits);
}
function readInto(c: CountryScope, name: string, width: number) {
  c.setTempVariable("rq_rn", width);
  c.run(readBits);
  c.setTempVariable(name, c.variable("rq_rv"));
}
function readArray(c: CountryScope, name: string, count: number, width: number) {
  c.clearArray(name);
  c.setTempVariable("rq_ri", 0);
  c.whileLoop(
    (c) => c.variable("rq_ri") < count,
    (c) => {
      c.setTempVariable("rq_rn", width);
      c.run(readBits);
      c.arrayPush(name, c.variable("rq_rv"));
      c.addTempVariable("rq_ri", 1);
    },
  );
}
function widthOfPalette(c: CountryScope, count: string, output: string) {
  c.setTempVariable(output, 0);
  for (const rule of [
    { threshold: 0, width: 1 },
    { threshold: 1, width: 2 },
    { threshold: 3, width: 3 },
    { threshold: 7, width: 4 },
  ]) {
    if (c.variable(count) > rule.threshold) c.setTempVariable(output, rule.width);
  }
}
export const freeStorage = ScriptedEffect("rq_stream_free", (c: CountryScope) => {
  c.setVariable("rq_bsaves", (8192 - c.variable("rq_bend")) / 200);
  c.effects.round_variable("rq_bsaves");
  c.clampVariable("rq_bsaves", { min: 0 });
});
export const firstParent = ScriptedEffect("rq_first_parent", (c: CountryScope) => {
  c.setTempVariable("rq_fp", 0);
  c.dispatchByIndex(
    "rq_t",
    technologies,
    (c, tech) => {
      c.setTempVariable("rq_fp", tech.saveParent);
    },
    { first: 1, outOfRange: "clamp" },
  );
});
export const compactPicks = ScriptedEffect("rq_wpicks", (c: CountryScope) => {
  c.clearArray("rq_wp");
  c.clearArray("rq_wpm");
  c.setTempVariable("rq_wi", 0);
  c.whileLoop(
    (c) => c.variable("rq_wi") < c.arrayLength("rq_wl"),
    (c) => {
      c.setTempVariable("rq_wcur", c.arrayAt("rq_wl", c.variable("rq_wi")));
      c.setTempVariable("rq_wcm", c.arrayAt("rq_wlm", c.variable("rq_wi")));
      c.setTempVariable("rq_wkeep", 1);
      c.setTempVariable("rq_wj", c.variable("rq_wi") + 1);
      if (c.variable("rq_wj") < c.arrayLength("rq_wl")) {
        c.setTempVariable("rq_t", c.arrayAt("rq_wl", c.variable("rq_wj")));
        c.run(firstParent);
        if (c.variable("rq_fp") === c.variable("rq_wcur") && c.variable("rq_wcm") < 1)
          c.setTempVariable("rq_wkeep", 0);
      }
      if (c.variable("rq_wkeep") === 1 && c.arrayLength("rq_wp") < 63) {
        c.arrayPush("rq_wp", c.variable("rq_wcur"));
        c.arrayPush("rq_wpm", c.variable("rq_wcm"));
      }
      c.addTempVariable("rq_wi", 1);
    },
  );
});
// Append-only, little-endian v3 record. Existing bits are never reset: a record's
// second bit is its tombstone, allowing deleted saves to remain deleted across games.
export const streamPut = ScriptedEffect("rq_stream_put", (c: CountryScope) => {
  c.clearArray("rq_wpal");
  c.clearArray("rq_wpx");
  c.forEachValue("rq_wpm", { value: "wmv" }, (c) => {
    c.setTempVariable("rq_wx", 0);
    if (c.variable("wmv") > 0) {
      if (!c.arrayContains("rq_wpal", c.variable("wmv")) && c.arrayLength("rq_wpal") < 15)
        c.arrayPush("rq_wpal", c.variable("wmv"));
      c.forEachValue("rq_wpal", { value: "wav", index: "wai" }, (c) => {
        if (c.variable("wav") === c.variable("wmv"))
          c.setTempVariable("rq_wx", c.variable("wai") + 1);
      });
    }
    c.arrayPush("rq_wpx", c.variable("rq_wx"));
  });
  c.setTempVariable("rq_wpn", c.arrayLength("rq_wpal"));
  widthOfPalette(c, "rq_wpn", "rq_wpw");
  c.setTempVariable("rq_wnl", c.arrayLength("rq_tx_n"));
  c.clampTempVariable("rq_wnl", { max: 24 });
  c.setTempVariable(
    "rq_wneed",
    c.variable("rq_wnl") * 7 +
      89 +
      c.variable("rq_wpn") * 10 +
      c.arrayLength("rq_wp") * (c.variable("rq_wpw") + 10) +
      c.variable("rq_bend"),
  );
  if (c.variable("rq_wneed") < 8193) {
    c.setTempVariable("rq_pid", -(c.variable("rq_bend") + 1));
    c.setTempVariable("rq_bp", c.variable("rq_bend"));
    write(c, 1, 2);
    write(c, 533, 10);
    write(c, 30, 5);
    write(c, c.variable("rq_wnl"), 5);
    c.setTempVariable("rq_wi", 0);
    c.whileLoop(
      (c) => c.variable("rq_wi") < c.variable("rq_wnl"),
      (c) => {
        write(c, c.arrayAt("rq_tx_n", c.variable("rq_wi")), 7);
        c.addTempVariable("rq_wi", 1);
      },
    );
    write(c, c.variable("rq_fc"), 11);
    write(c, c.arrayLength("rq_wp"), 6);
    c.forEachValue("rq_wp", { value: "wpv" }, (c) => write(c, c.variable("wpv"), 10));
    write(c, c.variable("rq_wpn"), 4);
    write(c, 10, 4);
    c.forEachValue("rq_wpal", { value: "wav" }, (c) => write(c, c.variable("wav"), 10));
    if (c.variable("rq_wpw") > 0)
      c.forEachValue("rq_wpx", { value: "wxv" }, (c) =>
        write(c, c.variable("wxv"), c.variable("rq_wpw")),
      );
    write(c, 1, 4);
    write(c, 19, 6);
    write(c, 3, 6);
    write(c, 16, 5);
    for (const dlc of dlcs) {
      c.setTempVariable("rq_dlc_bit", 0);
      if (c.triggers.has_dlc(dlc.name)) c.setTempVariable("rq_dlc_bit", 1);
      write(c, c.variable("rq_dlc_bit"), 1);
    }
    write(c, 0, 5);
    c.setVariable("rq_bend", c.variable("rq_bp"));
    c.run(freeStorage);
    c.setTempVariable("rq_wpn", c.arrayLength("rq_wp"));
  } else
    c.effects.set_temp_variable_to_random({ var: "rq_pid", min: 1, max: 1000000, integer: true });
});
export const streamLoad = ScriptedEffect("rq_stream_load", (c: CountryScope) => {
  c.run(saveBits.load);
  c.setTempVariable("rq_rp", 0);
  c.setTempVariable("rq_sgo", 1);
  c.whileLoop(
    (c) => c.variable("rq_sgo") === 1 && c.variable("rq_rp") < 8158,
    (c) => {
      if (c.arrayAt("rq_bits", c.variable("rq_rp")) === 0) c.setTempVariable("rq_sgo", 0);
      else {
        c.setTempVariable("rq_rs", c.variable("rq_rp"));
        c.addTempVariable("rq_rp", 1);
        c.setTempVariable("rq_rdel", c.arrayAt("rq_bits", c.variable("rq_rp")));
        c.addTempVariable("rq_rp", 1);
        readInto(c, "rq_rtag", 10);
        readInto(c, "rq_rnl", 5);
        c.setTempVariable("rq_rv2", 0);
        c.setTempVariable("rq_rv3", 0);
        if (c.variable("rq_rnl") === 31) {
          c.setTempVariable("rq_rv2", 1);
          readInto(c, "rq_rnl", 5);
        } else if (c.variable("rq_rnl") === 30) {
          c.setTempVariable("rq_rv2", 1);
          c.setTempVariable("rq_rv3", 1);
          readInto(c, "rq_rnl", 5);
        }
        readArray(c, "rq_rname", c.variable("rq_rnl"), 7);
        readInto(c, "rq_rfl", 11);
        readInto(c, "rq_rcnt", 6);
        readArray(c, "rq_rtech", c.variable("rq_rcnt"), 10);
        c.clearArray("rq_rmio");
        c.clearArray("rq_rpal");
        c.setTempVariable("rq_rpw", 0);
        if (c.variable("rq_rv2") === 1) {
          readInto(c, "rq_rpn", 4);
          c.setTempVariable("rq_rmw", 10);
          if (c.variable("rq_rv3") === 1) readInto(c, "rq_rmw", 4);
          readArray(c, "rq_rpal", c.variable("rq_rpn"), c.variable("rq_rmw"));
          widthOfPalette(c, "rq_rpn", "rq_rpw");
        }
        c.setTempVariable("rq_ri", 0);
        c.whileLoop(
          (c) => c.variable("rq_ri") < c.variable("rq_rcnt"),
          (c) => {
            c.setTempVariable("rq_rmv", 0);
            if (c.variable("rq_rv2") === 1 && c.variable("rq_rpw") > 0) {
              c.setTempVariable("rq_rn", c.variable("rq_rpw"));
              c.run(readBits);
              if (c.variable("rq_rv") > 0 && c.variable("rq_rv") <= c.arrayLength("rq_rpal")) {
                c.setTempVariable("rq_palette_index", c.variable("rq_rv") - 1);
                c.setTempVariable("rq_rmv", c.arrayAt("rq_rpal", c.variable("rq_palette_index")));
              }
            }
            c.arrayPush("rq_rmio", c.variable("rq_rmv"));
            c.addTempVariable("rq_ri", 1);
          },
        );
        for (const name of ["rq_rva", "rq_rvb", "rq_rvc"]) c.setTempVariable(name, 0);
        c.clearArray("rq_rdlc");
        c.clearArray("rq_rmn");
        if (c.variable("rq_rv3") === 1) {
          readInto(c, "rq_rva", 4);
          readInto(c, "rq_rvb", 6);
          readInto(c, "rq_rvc", 6);
          readInto(c, "rq_rdn", 5);
          readArray(c, "rq_rdlc", c.variable("rq_rdn"), 1);
          readInto(c, "rq_rml", 5);
          readArray(c, "rq_rmn", c.variable("rq_rml"), 7);
        }
        c.setTempVariable("rq_rtok", 0);
        if (c.variable("rq_rtag") === 533) c.setTempVariable("rq_rtok", 1);
        c.setTempVariable("rq_rmok", 1);
        c.setTempVariable("rq_rdok", 1);
        if (c.variable("rq_rv3") === 1) {
          if (c.arrayLength("rq_rmn") !== 0) c.setTempVariable("rq_rmok", 0);
          for (const dlc of dlcs) {
            if (dlc.affectsTech && c.arrayLength("rq_rdlc") > dlc.index) {
              if (
                (c.arrayAt("rq_rdlc", dlc.index) === 1 && !c.triggers.has_dlc(dlc.name)) ||
                (c.arrayAt("rq_rdlc", dlc.index) === 0 && c.triggers.has_dlc(dlc.name))
              )
                c.setTempVariable("rq_rdok", 0);
            }
          }
        }
        c.setTempVariable("rq_rok", c.variable("rq_rtok"));
        if (c.variable("rq_rdok") === 0) c.setTempVariable("rq_rok", 0);
        c.setTempVariable("rq_pid", -(c.variable("rq_rs") + 1));
        if (
          c.variable("rq_rdel") === 0 &&
          c.variable("rq_rp") < 8193 &&
          !c.arrayContains("rq_svpid", c.variable("rq_pid")) &&
          !c.arrayContains("rq_pdel", c.variable("rq_pid")) &&
          c.arrayLength("rq_svlen") < 30
        ) {
          c.forEachValue("rq_rtech", { value: "rtv", index: "rti" }, (c) => {
            c.arrayPush("rq_svq", c.variable("rtv"));
            c.arrayPush("rq_svm", c.arrayAt("rq_rmio", c.variable("rti")));
          });
          c.arrayPush("rq_svlen", c.variable("rq_rcnt"));
          c.arrayPush("rq_svf", c.variable("rq_rfl"));
          c.arrayPush("rq_svpid", c.variable("rq_pid"));
          for (const column of nameColumns) {
            c.setTempVariable("rq_c", 0);
            if (c.arrayLength("rq_rname") > column)
              c.setTempVariable("rq_c", c.arrayAt("rq_rname", column));
            c.arrayPush("rq_nm" + column, c.variable("rq_c"));
          }
          for (const pair of [
            { column: "rq_svx", value: "rq_rv3" },
            { column: "rq_svtag", value: "rq_rtok" },
            { column: "rq_svva", value: "rq_rva" },
            { column: "rq_svvb", value: "rq_rvb" },
            { column: "rq_svvc", value: "rq_rvc" },
            { column: "rq_svmod", value: "rq_rmok" },
            { column: "rq_svok", value: "rq_rok" },
          ])
            c.arrayPush(pair.column, c.variable(pair.value));
          for (const dlc of dlcs) {
            c.setTempVariable("rq_c", 2);
            if (c.arrayLength("rq_rdlc") > dlc.index)
              c.setTempVariable("rq_c", c.arrayAt("rq_rdlc", dlc.index));
            c.arrayPush("rq_sd" + dlc.index, c.variable("rq_c"));
            c.setTempVariable("rq_c", 0);
            if (c.arrayLength("rq_rmn") > dlc.index)
              c.setTempVariable("rq_c", c.arrayAt("rq_rmn", dlc.index));
            c.arrayPush("rq_mn" + dlc.index, c.variable("rq_c"));
          }
        }
      }
    },
  );
  c.setVariable("rq_bend", c.variable("rq_rp"));
  c.run(freeStorage);
});
export const saveFind = ScriptedEffect("rq_sv_find", (c: CountryScope) => {
  c.setTempVariable("rq_lo", 0);
  c.forEachValue("rq_svlen", { value: "lv", index: "li" }, (c) => {
    if (c.variable("li") < c.variable("rq_lsi")) c.addTempVariable("rq_lo", c.variable("lv"));
  });
  c.setTempVariable("rq_ln", c.arrayAt("rq_svlen", c.variable("rq_lsi")));
});
export const saveClear = ScriptedEffect("rq_sv_clear", (c: CountryScope) => {
  for (const array of ["rq_svq", "rq_svm", "rq_svlen"]) c.clearArray(array);
  for (const column of metaColumns) c.clearArray(column);
  for (const column of nameColumns) c.clearArray("rq_nm" + column);
  for (const dlc of dlcs) {
    c.clearArray("rq_sd" + dlc.index);
    c.clearArray("rq_mn" + dlc.index);
  }
});
export const saveDelete = ScriptedEffect("rq_sv_delete", (c: CountryScope) => {
  c.setVariable("rq_msg", 0);
  c.run(saveFind);
  c.whileLoop(
    (c) => c.variable("rq_ln") > 0,
    (c) => {
      c.arrayRemoveAt("rq_svq", c.variable("rq_lo"));
      c.arrayRemoveAt("rq_svm", c.variable("rq_lo"));
      c.subtractTempVariable("rq_ln", 1);
    },
  );
  c.setTempVariable("rq_pid", c.arrayAt("rq_svpid", c.variable("rq_lsi")));
  if (c.variable("rq_pid") < 0) {
    c.setTempVariable("rq_bj", -c.variable("rq_pid"));
    c.run(saveBits.mark);
  }
  c.arrayPush("rq_pdel", c.variable("rq_pid"));
  c.addVariable("rq_ld_dirty", 1);
  c.arrayRemoveAt("rq_svlen", c.variable("rq_lsi"));
  for (const column of metaColumns) c.arrayRemoveAt(column, c.variable("rq_lsi"));
  for (const column of nameColumns) c.arrayRemoveAt("rq_nm" + column, c.variable("rq_lsi"));
  for (const dlc of dlcs) {
    c.arrayRemoveAt("rq_sd" + dlc.index, c.variable("rq_lsi"));
    c.arrayRemoveAt("rq_mn" + dlc.index, c.variable("rq_lsi"));
  }
  c.addVariable("rq_dirty", 1);
});
export const saveHere = ScriptedEffect("rq_sv_add_here", (c: CountryScope) => {
  for (const column of ["rq_svx", "rq_svtag", "rq_svva", "rq_svmod", "rq_svok"])
    c.arrayPush(column, 1);
  c.arrayPush("rq_svvb", 19);
  c.arrayPush("rq_svvc", 3);
  for (const dlc of dlcs) {
    if (c.triggers.has_dlc(dlc.name)) c.arrayPush("rq_sd" + dlc.index, 1);
    else c.arrayPush("rq_sd" + dlc.index, 0);
    c.arrayPush("rq_mn" + dlc.index, 0);
  }
});
export const saveDo = ScriptedEffect("rq_save_do", (c: CountryScope) => {
  c.clearArray("rq_wl");
  c.clearArray("rq_wlm");
  c.forEachValue("rq_done", { value: "dv", index: "di" }, (c) => {
    c.arrayPush("rq_wl", c.variable("dv"));
    c.arrayPush("rq_wlm", c.arrayAt("rq_donem", c.variable("di")));
  });
  c.forEachValue("rq_queue", { value: "qv", index: "qi" }, (c) => {
    if (c.arrayAt("rq_qsrc", c.variable("qi")) !== 1) {
      c.arrayPush("rq_wl", c.variable("qv"));
      c.arrayPush("rq_wlm", c.arrayAt("rq_qmio", c.variable("qi")));
    }
  });
  if (c.arrayLength("rq_tx_n") < 1) {
    for (const letter of [43, 21, 5, 21, 5, 63]) c.arrayPush("rq_tx_n", letter);
    c.setTempVariable("rq_nn", c.arrayLength("rq_svlen") + 1);
    c.setTempVariable("rq_nt", 53);
    c.whileLoop(
      (c) => c.variable("rq_nn") > 9,
      (c) => {
        c.addTempVariable("rq_nt", 1);
        c.subtractTempVariable("rq_nn", 10);
      },
    );
    if (c.variable("rq_nt") > 53) c.arrayPush("rq_tx_n", c.variable("rq_nt"));
    c.arrayPush("rq_tx_n", c.variable("rq_nn") + 53);
  }
  c.setVariable("rq_typing", 0);
  c.run(compactPicks);
  c.setTempVariable("rq_dup", 0);
  c.setTempVariable("rq_do", 0);
  c.forEachValue("rq_svlen", { value: "dl", index: "di" }, (c) => {
    if (c.variable("dl") === c.arrayLength("rq_wp")) {
      c.setTempVariable("rq_deq", 1);
      for (const column of nameColumns) {
        c.setTempVariable("rq_c", 0);
        if (c.arrayLength("rq_tx_n") > column)
          c.setTempVariable("rq_c", c.arrayAt("rq_tx_n", column));
        if (c.variable("rq_c") !== c.arrayAt("rq_nm" + column, c.variable("di")))
          c.setTempVariable("rq_deq", 0);
      }
      c.setTempVariable("rq_dk", 0);
      c.whileLoop(
        (c) => c.variable("rq_deq") === 1 && c.variable("rq_dk") < c.variable("dl"),
        (c) => {
          c.setTempVariable("rq_dx", c.variable("rq_do") + c.variable("rq_dk"));
          if (
            c.arrayAt("rq_svq", c.variable("rq_dx")) !== c.arrayAt("rq_wp", c.variable("rq_dk")) ||
            c.arrayAt("rq_svm", c.variable("rq_dx")) !== c.arrayAt("rq_wpm", c.variable("rq_dk"))
          )
            c.setTempVariable("rq_deq", 0);
          c.addTempVariable("rq_dk", 1);
        },
      );
      if (c.variable("rq_deq") === 1) c.setTempVariable("rq_dup", 1);
    }
    c.addTempVariable("rq_do", c.variable("dl"));
  });
  if (c.arrayLength("rq_svlen") > 29) c.setTempVariable("rq_msgk", 11);
  else if (c.arrayLength("rq_wp") < 1) c.setTempVariable("rq_msgk", 12);
  else if (c.variable("rq_dup") === 1) c.setTempVariable("rq_msgk", 13);
  else {
    c.run(flagCode);
    c.run(streamPut);
    c.arrayPush("rq_svpid", c.variable("rq_pid"));
    c.forEachValue("rq_wp", { value: "wv", index: "wi" }, (c) => {
      c.arrayPush("rq_svq", c.variable("wv"));
      c.arrayPush("rq_svm", c.arrayAt("rq_wpm", c.variable("wi")));
    });
    c.arrayPush("rq_svlen", c.arrayLength("rq_wp"));
    c.arrayPush("rq_svf", c.variable("rq_fc"));
    c.run(saveHere);
    for (const column of nameColumns) {
      c.setTempVariable("rq_c", 0);
      if (c.arrayLength("rq_tx_n") > column)
        c.setTempVariable("rq_c", c.arrayAt("rq_tx_n", column));
      c.arrayPush("rq_nm" + column, c.variable("rq_c"));
    }
    c.setTempVariable("rq_msgk", 1);
    if (c.variable("rq_pid") > 0) c.setTempVariable("rq_msgk", 2);
  }
  c.run(message);
});
export const loadGo = ScriptedEffect("rq_load_go", (c: CountryScope) => {
  c.run(saveFind);
  clearEditable(c);
  c.clearArray("rq_added");
  c.setTempVariable("rq_lk", 0);
  c.whileLoop(
    (c) => c.variable("rq_lk") < c.variable("rq_ln"),
    (c) => {
      c.setTempVariable("rq_lx", c.variable("rq_lo") + c.variable("rq_lk"));
      c.setTempVariable("rq_t", c.arrayAt("rq_svq", c.variable("rq_lx")));
      c.setTempVariable("rq_lm", c.arrayAt("rq_svm", c.variable("rq_lx")));
      c.run(owned);
      c.run(dead);
      c.run(find);
      if (
        c.variable("rq_owned") === 0 &&
        c.variable("rq_dead") === 0 &&
        c.variable("rq_qi") === -1
      ) {
        c.setTempVariable("rq_ins_t", c.variable("rq_t"));
        c.setTempVariable("rq_ins_p", 0);
        c.setTempVariable("rq_ins_m", 0);
        c.setTempVariable("rq_ins_s", 0);
        c.setTempVariable("rq_qi", c.arrayLength("rq_queue"));
        c.run(insert);
        c.setTempVariable("rq_tl", c.variable("rq_t"));
        c.arrayPush("rq_added", c.variable("rq_tl"));
        c.setTempVariable("rq_lml", c.variable("rq_lm"));
        c.run(find);
        c.setTempVariable("rq_pp", c.variable("rq_qi"));
        c.run(prerequisites);
        c.setTempVariable("rq_t", c.variable("rq_tl"));
        c.setTempVariable("rq_lm", c.variable("rq_lml"));
        if (c.variable("rq_lm") > 0) c.run(restoreMio);
        else {
          c.run(find);
          c.run(applyAuto);
        }
      }
      c.addTempVariable("rq_lk", 1);
    },
  );
  c.run(exclusiveSweep);
  c.setVariable("rq_ml_t", 0);
  c.setVariable("rq_msg_si", c.variable("rq_lsi"));
  c.setTempVariable("rq_msgk", 3);
  c.run(message);
  c.run(update);
});
export const loadDo = ScriptedEffect("rq_load_do", (c: CountryScope) => {
  if (c.arrayAt("rq_svok", c.variable("rq_lsi")) !== 1) {
    c.setVariable("rq_msg_si", c.variable("rq_lsi"));
    c.setTempVariable("rq_msgk", 21);
    c.run(message);
  } else c.run(loadGo);
});
