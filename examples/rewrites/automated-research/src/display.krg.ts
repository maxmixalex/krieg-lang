import {
  ScriptedLocalisation,
  country,
  type CountryScope,
  type ScriptedLocalisationText,
  type Trigger,
} from "krieg-lang/hoi4";
import { technologyDisplay } from "./technology-display.krg.ts";
import { organizationDisplay } from "./organization-display.krg.ts";
import { countryFlags } from "./save-facts.krg.ts";

// Finite compile-time ranges keep numbered display families readable.
const ordinals = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
] as const;
function range(first: number, count: number): readonly number[] {
  return ordinals.filter((n) => n < count).map((n) => n + first);
}

type Text = ScriptedLocalisationText<CountryScope>;
type NationalVariant = {
  readonly tags: readonly string[];
  readonly prefix: string;
  readonly suffix: string;
  readonly dlcs: readonly string[];
  readonly literal: boolean;
};
function label(name: string, texts: readonly Text[]) {
  return ScriptedLocalisation(name, { scope: "country", texts });
}
function fallback(key = "RQ_EMPTY"): Text {
  return { localisationKey: key };
}
function when(key: string, trigger: Trigger<CountryScope>): Text {
  return { localisationKey: key, trigger };
}
function national(
  groups: readonly NationalVariant[],
  test: Trigger<CountryScope>,
): readonly Text[] {
  return groups.flatMap((g) =>
    g.tags.map((tag) =>
      when(
        g.literal ? g.prefix : g.prefix + tag + g.suffix,
        (c) =>
          test(c) &&
          c.triggers.tag(country(tag)) &&
          (g.dlcs.length === 0 || g.dlcs.some((dlc) => c.triggers.has_dlc(dlc))),
      ),
    ),
  );
}
function technologyTexts(variable: string, kind: "name" | "icon"): readonly Text[] {
  return [
    ...technologyDisplay.flatMap((t) => [
      ...national(
        kind === "name" ? t.nationalNames : t.nationalIcons,
        (c) => c.variable(variable) === t.index,
      ),
      when(kind === "name" ? t.name : t.icon, (c) => c.variable(variable) === t.index),
    ]),
    fallback(),
  ];
}
function organizationTexts(variable: string, kind: "name" | "icon" | "type"): readonly Text[] {
  return [
    ...organizationDisplay.map((org) =>
      when(
        kind === "name" ? org.name : kind === "icon" ? org.icon : org.type,
        (c) => c.variable(variable) === org.index,
      ),
    ),
    fallback(kind === "icon" ? "RQ_MIO_ICON_NONE" : "RQ_EMPTY"),
  ];
}

// Visible selectors consume the actual queue/history/catalogue ID, with country
// names and DLC artwork chosen at display time in the player's country scope.
export const technologySelectors = [
  { name: "rq_qe_name", variable: "rq_queue^rq_ev", kind: "name" },
  { name: "rq_qe_icon", variable: "rq_queue^rq_ev", kind: "icon" },
  { name: "rq_ml_tname", variable: "rq_ml_t", kind: "name" },
  { name: "rq_qe_bnfor", variable: "rq_qbf^rq_ev", kind: "name" },
  { name: "rq_st_fnamel", variable: "rq_st_f", kind: "name" },
  { name: "rq_st_ficon", variable: "rq_st_f", kind: "icon" },
  { name: "rq_st_lnamel", variable: "rq_st_l", kind: "name" },
  { name: "rq_st_licon", variable: "rq_st_l", kind: "icon" },
] as const;
export const technologyLabels = technologySelectors.map((s) =>
  label(s.name, technologyTexts(s.variable, s.kind)),
);
export const treeNames = technologyDisplay.map((t) => [
  label("rq_trname_" + t.index, [...national(t.nationalNames, () => true), fallback(t.name)]),
  label("rq_trh_" + t.index, [fallback("RQ_TRHB_" + t.index)]),
  label("rq_trm_" + t.index, [
    ...range(1, 16).map((slot) =>
      when("RQ_MSL" + slot, (c) => c.variable("rq_ms_" + t.id) === slot),
    ),
    fallback("RQ_MIO_ICON_NONE"),
  ]),
]);
export const queueOrganizationLabels = [
  label("rq_qe_mioname", organizationTexts("rq_qmio^rq_ev", "name")),
  label("rq_qe_mioicon", organizationTexts("rq_qmio^rq_ev", "icon")),
];
export const organizationChoices = range(1, 10).map((slot) => [
  label("rq_ml" + slot + "_icon", organizationTexts("rq_ml" + slot + "_i", "icon")),
  label("rq_ml" + slot + "_mname", organizationTexts("rq_ml" + slot + "_i", "name")),
  label("rq_ml" + slot + "_mtype", organizationTexts("rq_ml" + slot + "_i", "type")),
  label("rq_ml" + slot + "_state", [
    when("RQ_ML_ST1", (c) => c.variable("rq_ml" + slot + "_s") === 1),
    fallback(),
  ]),
  label("rq_ml" + slot + "_pick_tt", [
    when("RQ_ML_PICK_TT1", (c) => c.variable("rq_ml" + slot + "_s") === 1),
    when("RQ_ML_PICK_TT3", (c) => c.variable("rq_ml" + slot + "_s") === 3),
    fallback("RQ_ML_PICK_TT0"),
  ]),
]);
export const organizationSlots = range(1, 16).map((slot) =>
  label("rq_msl" + slot, organizationTexts("rq_msv" + slot, "icon")),
);

// Text input is the mod's 69-character alphabet, stored as integers in arrays.
function characterText(name: string, variable: string, guard: Trigger<CountryScope>) {
  return label(name, [
    ...range(1, 69).map((ch) => when("RQ_CH" + ch, (c) => guard(c) && c.variable(variable) === ch)),
    fallback(),
  ]);
}
export const searchCharacters = range(0, 16).map((i) =>
  characterText("rq_cs" + i, "rq_tx_s^" + i, (c) => c.arrayLength("rq_tx_s") > i),
);
export const nameCharacters = range(0, 24).flatMap((i) => [
  characterText("rq_cn" + i, "rq_tx_n^" + i, (c) => c.arrayLength("rq_tx_n") > i),
  characterText("rq_cl" + i, "rq_nm" + i + "^rq_si", () => true),
  characterText("rq_cm" + i, "rq_nm" + i + "^rq_msg_si", () => true),
]);
export const modCharacters = range(0, 16).flatMap((i) => [
  characterText("rq_sx_mc" + i, "rq_mn" + i + "^rq_si", () => true),
  characterText("rq_ly_mc" + i, "rq_mn" + i + "^rq_msg_si", () => true),
]);
export const savedFlag = label("rq_sl_flag", [
  ...countryFlags.flatMap((f) =>
    f.governments.map((g) =>
      when("RQ_FLAG_" + g.code, (c) => c.variable("rq_svf^rq_si") === g.code),
    ),
  ),
  fallback("RQ_FLAG_NONE"),
]);
export const versionNumbers = ["sx", "ly"].flatMap((mode) =>
  ["a", "b", "c"].map((part) =>
    label("rq_" + mode + "_v" + part, [
      ...range(1, 63).map((n) =>
        when(
          "RQ_NUM" + n,
          (c) => c.variable("rq_svv" + part + (mode === "sx" ? "^rq_si" : "^rq_msg_si")) === n,
        ),
      ),
      fallback("RQ_NUM0"),
    ]),
  ),
);

export const textInputs = [
  label("rq_s_txt", [
    when("RQ_S_TYPING", (c) => c.variable("rq_typing") === 1),
    when("RQ_S_SHOW", (c) => c.arrayLength("rq_tx_s") > 0),
    fallback("RQ_S_HINT"),
  ]),
  label("rq_n_txt", [
    when("RQ_N_TYPING", (c) => c.variable("rq_typing") === 2),
    when("RQ_N_SHOW", (c) => c.arrayLength("rq_tx_n") > 0),
    fallback("RQ_N_HINT"),
  ]),
  label("rq_sv_ok_tt", [
    when("RQ_SV_FULL_TT", (c) => c.arrayLength("rq_svlen") > 29),
    fallback("RQ_SV_OK_TT"),
  ]),
  label("rq_t_tt", [
    when("RQ_T_CLOSE", (c) => c.triggers.hasCountryFlag("rq_q_open")),
    fallback("RQ_T_OPEN"),
  ]),
  label("rq_b_mode", [
    when("RQ_B_MODE_ON", (c) => c.triggers.hasCountryFlag("rq_qmode")),
    fallback("RQ_B_MODE_OFF"),
  ]),
  label("rq_qe_mio_tt", [
    when("RQ_QE_MIO_TTB", (c) => c.variable("rq_qmio^rq_ev") > 0),
    fallback("RQ_MIO_PICK_TT"),
  ]),
  label("rq_ml_auto_txt", [
    when("RQ_ML_AUTO_ON", (c) => c.triggers.hasCountryFlag("rq_ml_auto")),
    fallback("RQ_ML_AUTO_OFF"),
  ]),
  label("rq_qe_appr", [when("RQ_AP_PRIROW", (c) => c.variable("rq_qapr^rq_ev") === 1), fallback()]),
  label("rq_qe_state", [
    when("RQ_QE_ST2J", (c) => c.variable("rq_qjg^rq_ev") === 1),
    when("RQ_QE_ST1", (c) => c.variable("rq_qst^rq_ev") === 1),
    when("RQ_QE_ST2", (c) => c.variable("rq_qst^rq_ev") === 2),
    when("RQ_QE_ST3P", (c) => c.variable("rq_qst^rq_ev") === 3 && c.variable("rq_qpct^rq_ev") > 0),
    when("RQ_QE_ST4P", (c) => c.variable("rq_qst^rq_ev") === 4 && c.variable("rq_qpct^rq_ev") > 0),
    when("RQ_ST3", (c) => c.variable("rq_qst^rq_ev") === 3),
    when("RQ_ST4", (c) => c.variable("rq_qst^rq_ev") === 4),
    fallback(),
  ]),
  label("rq_qe_state_tt", [
    when("RQ_QE_FROZEN_TT", (c) => c.variable("rq_qst^rq_ev") > 2),
    fallback(),
  ]),
  label("rq_qe_xp_tt", [
    when("RQ_XP_TT2", (c) => c.variable("rq_qxs^rq_ev") === 2),
    when("RQ_XP_TT3", (c) => c.variable("rq_qxs^rq_ev") === 3),
    fallback("RQ_XP_TT1"),
  ]),
  label("rq_qe_xp_kind", [
    when("RQ_XP_K1", (c) => c.variable("rq_qxk^rq_ev") === 1),
    when("RQ_XP_K2", (c) => c.variable("rq_qxk^rq_ev") === 2),
    fallback("RQ_XP_K3"),
  ]),
  label("rq_qe_t_xp", [when("RQ_QE_T_XP", (c) => c.variable("rq_qxs^rq_ev") === 3), fallback()]),
];
export const progressLabels = [
  {
    name: "base",
    variable: "rq_speed_shown",
    baseline: 1,
    prefix: "BASE",
    neutral: "RQ_BT_BASE_E",
  },
  { name: "sp", variable: "rq_qtb^rq_ev", baseline: 0, prefix: "SP", neutral: "RQ_EMPTY" },
  { name: "fb", variable: "rq_qlb^rq_ev", baseline: 0, prefix: "FB", neutral: "RQ_EMPTY" },
  { name: "ef", variable: "rq_qef^rq_ev", baseline: 1, prefix: "EF", neutral: "RQ_BT_EF_E" },
].map((p) =>
  label("rq_qe_t_" + p.name, [
    when("RQ_BT_" + p.prefix + "_G", (c) => c.variable(p.variable) > p.baseline),
    when("RQ_BT_" + p.prefix + "_R", (c) => c.variable(p.variable) < p.baseline),
    fallback(p.neutral),
  ]),
);
export const bonusLabels = [
  { name: "rq_qe_t_sh", variable: "rq_qsh^rq_ev", threshold: 0, yes: "RQ_BT_SH_G", no: "RQ_EMPTY" },
  { name: "rq_qe_t_fy", variable: "rq_qla^rq_ev", threshold: 0, yes: "RQ_BT_FY_G", no: "RQ_EMPTY" },
  {
    name: "rq_qe_t_mio",
    variable: "rq_qmb^rq_ev",
    threshold: 0,
    yes: "RQ_BT_MIO_G",
    no: "RQ_EMPTY",
  },
  {
    name: "rq_qe_t_ah",
    variable: "rq_qya^rq_ev",
    threshold: 0.05,
    yes: "RQ_BT_AH_R",
    no: "RQ_EMPTY",
  },
  { name: "rq_qe_t_jg", variable: "rq_qjg^rq_ev", threshold: 0, yes: "RQ_BT_JG_G", no: "RQ_EMPTY" },
  { name: "rq_qe_swb", variable: "rq_qlb^rq_ev", threshold: 0, yes: "RQ_SWB", no: "RQ_EMPTY" },
  { name: "rq_qe_swl", variable: "rq_qya^rq_ev", threshold: 0.05, yes: "RQ_SWL", no: "RQ_SWN" },
  { name: "rq_qe_bnsl", variable: "rq_qsh^rq_ev", threshold: 0, yes: "RQ_BNSL", no: "RQ_EMPTY" },
  { name: "rq_qe_bna", variable: "rq_qba^rq_ev", threshold: 0, yes: "RQ_BNA", no: "RQ_EMPTY" },
  { name: "rq_qe_bara", variable: "rq_qla^rq_ev", threshold: 0, yes: "RQ_BARA", no: "RQ_EMPTY" },
].map((p) =>
  label(p.name, [when(p.yes, (c) => c.variable(p.variable) > p.threshold), fallback(p.no)]),
);

const compatibilityDlc = [
  { id: 3, name: "Man the Guns" },
  { id: 4, name: "La Resistance" },
  { id: 6, name: "No Step Back" },
  { id: 7, name: "By Blood Alone" },
  { id: 8, name: "Arms Against Tyranny" },
  { id: 10, name: "Gotterdammerung" },
  { id: 11, name: "Graveyard of Empires" },
  { id: 12, name: "Thunder at Our Gates" },
  { id: 13, name: "Peace For Our Time" },
  { id: 14, name: "No Compromise, No Surrender" },
] as const;
function sameVersion(c: CountryScope, index: string) {
  return (
    c.variable("rq_svva^" + index) === 1 &&
    c.variable("rq_svvb^" + index) === 19 &&
    c.variable("rq_svvc^" + index) === 3
  );
}
function missingDlc(c: CountryScope, id: number, name: string, index: string) {
  return c.variable("rq_sd" + id + "^" + index) === 1 && !c.triggers.has_dlc(name);
}
function extraDlc(c: CountryScope, id: number, name: string, index: string) {
  return c.variable("rq_sd" + id + "^" + index) === 0 && c.triggers.has_dlc(name);
}
export const saveCompatibility = [
  { prefix: "sx", key: "SX", index: "rq_si" },
  { prefix: "ly", key: "LY", index: "rq_msg_si" },
].flatMap((mode) => [
  label("rq_" + mode.prefix + "_mod", [
    when("RQ_" + mode.key + "_MOD", (c) => c.variable("rq_mn0^" + mode.index) > 0),
    fallback("RQ_MOD_NONE"),
  ]),
  label("rq_" + mode.prefix + "_rmod", [
    when(
      "RQ_" + mode.key + "_RMOD",
      (c) =>
        c.variable("rq_svx^" + mode.index) === 1 &&
        c.variable("rq_svmod^" + mode.index) === 0 &&
        c.variable("rq_mn0^" + mode.index) > 0,
    ),
    fallback(),
  ]),
  label("rq_" + mode.prefix + "_rmodx", [fallback()]),
  label("rq_" + mode.prefix + "_rver", [
    when(
      "RQ_" + mode.key + "_RVER",
      (c) =>
        c.variable("rq_svx^" + mode.index) === 1 &&
        c.variable("rq_svtag^" + mode.index) === 0 &&
        !sameVersion(c, mode.index),
    ),
    fallback(),
  ]),
  label("rq_" + mode.prefix + "_rdm", [
    when(
      "RQ_" + mode.key + "_RDM",
      (c) =>
        c.variable("rq_svx^" + mode.index) === 1 &&
        compatibilityDlc.some((d) => missingDlc(c, d.id, d.name, mode.index)),
    ),
    fallback(),
  ]),
  label("rq_" + mode.prefix + "_rde", [
    when(
      "RQ_" + mode.key + "_RDE",
      (c) =>
        c.variable("rq_svx^" + mode.index) === 1 &&
        compatibilityDlc.some((d) => extraDlc(c, d.id, d.name, mode.index)),
    ),
    fallback(),
  ]),
  label("rq_" + mode.prefix + "_rtag", [
    when(
      "RQ_RTAG_OLD",
      (c) => c.variable("rq_svtag^" + mode.index) === 0 && c.variable("rq_svx^" + mode.index) === 0,
    ),
    when(
      "RQ_RTAG",
      (c) =>
        c.variable("rq_svtag^" + mode.index) === 0 &&
        c.variable("rq_svmod^" + mode.index) === 1 &&
        sameVersion(c, mode.index),
    ),
    fallback(),
  ]),
  ...compatibilityDlc.flatMap((d) => [
    label("rq_" + mode.prefix + "_dm" + d.id, [
      when(
        "RQ_DLCF" + d.id,
        (c) =>
          missingDlc(c, d.id, d.name, mode.index) &&
          !compatibilityDlc.some(
            (previous) =>
              previous.id < d.id && missingDlc(c, previous.id, previous.name, mode.index),
          ),
      ),
      when("RQ_DLCN" + d.id, (c) => missingDlc(c, d.id, d.name, mode.index)),
      fallback(),
    ]),
    label("rq_" + mode.prefix + "_de" + d.id, [
      when(
        "RQ_DLCF" + d.id,
        (c) =>
          extraDlc(c, d.id, d.name, mode.index) &&
          !compatibilityDlc.some(
            (previous) => previous.id < d.id && extraDlc(c, previous.id, previous.name, mode.index),
          ),
      ),
      when("RQ_DLCN" + d.id, (c) => extraDlc(c, d.id, d.name, mode.index)),
      fallback(),
    ]),
  ]),
]);
export const savedDlcList = compatibilityDlc.map((d) =>
  label("rq_sx_dd" + d.id, [
    when(
      "RQ_DLCRF" + d.id,
      (c) =>
        missingDlc(c, d.id, d.name, "rq_si") &&
        !compatibilityDlc.some((p) => p.id < d.id && c.variable("rq_sd" + p.id + "^rq_si") === 1),
    ),
    when(
      "RQ_DLCF" + d.id,
      (c) =>
        c.variable("rq_sd" + d.id + "^rq_si") === 1 &&
        !compatibilityDlc.some((p) => p.id < d.id && c.variable("rq_sd" + p.id + "^rq_si") === 1),
    ),
    when("RQ_DLCRN" + d.id, (c) => missingDlc(c, d.id, d.name, "rq_si")),
    when("RQ_DLCN" + d.id, (c) => c.variable("rq_sd" + d.id + "^rq_si") === 1),
    fallback(),
  ]),
);
export const saveMessages = [
  label("rq_sx_dlc", [
    when("RQ_SX_DLC", (c) =>
      compatibilityDlc.some((d) => c.variable("rq_sd" + d.id + "^rq_si") === 1),
    ),
    fallback("RQ_MOD_NONE"),
  ]),
  label("rq_sx_det", [
    when("RQ_SX_DET", (c) => c.variable("rq_svx^rq_si") === 1),
    fallback("RQ_SX_DET0"),
  ]),
  label("rq_sx_st", [
    when("RQ_SX_OK", (c) => c.variable("rq_svok^rq_si") === 1),
    fallback("RQ_SX_NO"),
  ]),
  label("rq_sl_infot", [
    when("RQ_SL_INFO", (c) => c.variable("rq_svok^rq_si") === 1),
    fallback("RQ_SL_INFO_NO"),
  ]),
  label("rq_ld_okt", [when("RQ_LD_OK", (c) => c.variable("rq_msg") === 3), fallback()]),
  label("rq_ld_msg", [when("RQ_LD_FAIL", (c) => c.variable("rq_msg") === 21), fallback()]),
  label("rq_sd_msg", [
    when("RQ_SV_OK", (c) => c.variable("rq_msg") === 1),
    when("RQ_SV_HERE", (c) => c.variable("rq_msg") === 2),
    when("RQ_SV_FAIL_FULL", (c) => c.variable("rq_msg") === 11),
    when("RQ_SV_FAIL_EMPTY", (c) => c.variable("rq_msg") === 12),
    when("RQ_SV_FAIL_DUP", (c) => c.variable("rq_msg") === 13),
    fallback(),
  ]),
];

export const historyDates = [
  { p: "f", key: "F" },
  { p: "l", key: "L" },
  { p: "s", key: "S" },
].flatMap((d) => [
  label("rq_st_" + d.p + "mon", [
    ...range(1, 11).map((month) =>
      when("RQ_ST_M" + month, (c) => c.variable("rq_st_" + d.p + "mo") === month),
    ),
    fallback("RQ_ST_M0"),
  ]),
  label("rq_st_" + d.p + "year", [
    when(
      "RQ_ST_" + d.key + "Y0",
      (c) => c.variable("rq_st_" + d.p + "yy") < 10 && c.variable("rq_st_" + d.p + "yy") > -1,
    ),
    when(
      "RQ_ST_" + d.key + "Y1",
      (c) => c.variable("rq_st_" + d.p + "yy") < 100 && c.variable("rq_st_" + d.p + "yy") > -1,
    ),
    fallback("RQ_ST_" + d.key + "Y2"),
  ]),
]);
export const historyLabels = [
  ...[
    { p: "f", key: "F" },
    { p: "l", key: "L" },
  ].flatMap((d) => [
    label("rq_st_" + d.p + "namet", [
      when("RQ_ST_" + d.key + "NAMEL", (c) => c.variable("rq_st_" + d.p) > 0),
      fallback("RQ_ST_NONE"),
    ]),
    label("rq_st_" + d.p + "date", [
      when("RQ_ST_" + d.key + "DATEF", (c) => c.variable("rq_st_" + d.p) > 0),
      fallback(),
    ]),
  ]),
  label("rq_st_sdate", [
    when("RQ_ST_SDATEF", (c) => c.triggers.hasCountryFlag("rq_st_on")),
    fallback("RQ_ST_TODAY"),
  ]),
  label("rq_st_avgt", [
    when("RQ_ST_AVG", (c) => c.variable("rq_st_n") > 0),
    fallback("RQ_ST_DASH"),
  ]),
];
