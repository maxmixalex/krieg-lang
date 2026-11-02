#!/usr/bin/env node
/** Generate typed native-definition projections from the supplied MIT CWT schema. */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { parseCwtRules } from "../dist/schema/cwt.js";

const root = process.argv[2];
if (!root)
  throw new Error(
    "Usage: node scripts/generate-domains.mjs <CWT Config directory> | --from-schema | --check",
  );
const output = path.resolve(import.meta.dirname, "../src");
function extract(root) {
  function files(directory) {
    return fs
      .readdirSync(directory, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))
      .flatMap((entry) =>
        entry.isDirectory()
          ? files(path.join(directory, entry.name))
          : entry.name.endsWith(".cwt")
            ? [path.join(directory, entry.name)]
            : [],
      );
  }
  const documents = files(root).map((file) => ({
    source: path.relative(root, file).replaceAll(path.sep, "/"),
    text: fs.readFileSync(file, "utf8"),
  }));
  const nodes = documents.flatMap((file) =>
    parseCwtRules(file.text, file.source).nodes.map((node) => ({ ...node, source: file.source })),
  );
  const aliases = new Map(),
    single = new Map(),
    enums = new Map();
  for (const node of nodes) {
    const alias = /^alias\[([^:]+):(.+)\]$/.exec(node.key);
    if (alias) {
      const entries = aliases.get(alias[1]) ?? [];
      entries.push({ ...node, key: alias[2] });
      aliases.set(alias[1], entries);
    }
    const one = /^single_alias\[(.+)\]$/.exec(node.key);
    if (one) {
      const entries = single.get(one[1]) ?? [];
      entries.push(node);
      single.set(one[1], entries);
    }
    if (node.key === "enums" && Array.isArray(node.value))
      for (const value of node.value) {
        const match = /^enum\[(.+)\]$/.exec(value.key);
        if (match && Array.isArray(value.value)) {
          const literals = value.value
            .filter((item) => !item.key && typeof item.value === "string")
            .map((item) => unquote(item.value));
          if (literals.length) enums.set(match[1], literals);
        }
      }
  }
  function unquote(text) {
    return typeof text === "string" ? text.replace(/^"|"$/g, "") : undefined;
  }
  function camel(text) {
    return text.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  }
  function scopeOf(comments, outer) {
    const scope = comments
      .join("\n")
      .match(/(?:THIS|this)\s*=\s*([\w_]+)/)?.[1]
      ?.toLowerCase();
    return scope
      ? ({ unitleader: "unit_leader", invalid: "any", no_scope: "any" }[scope] ?? scope)
      : outer;
  }
  const scopes = new Set([
    "country",
    "state",
    "character",
    "unit_leader",
    "operative",
    "project",
    "combat",
    "military_industrial_organization",
    "purchase_contract",
    "unit",
    "raid",
    "operation",
    "any",
  ]);
  function scope(comments, outer) {
    const value = scopeOf(comments, outer);
    return scopes.has(value) ? value : "any";
  }
  function union(values) {
    const flat = values.flatMap((value) => (value.kind === "union" ? value.variants : [value]));
    const unique = [...new Map(flat.map((value) => [JSON.stringify(value), value])).values()];
    return unique.length === 1 ? unique[0] : { kind: "union", variants: unique };
  }
  function dynamicKey(key) {
    return (
      key !== "" &&
      (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) || ["scalar", "int", "float", "any"].includes(key)) &&
      !/^alias_name\[(?:effect|trigger)\]$/.test(key)
    );
  }
  const shapes = {},
    shapeCache = new Map(),
    omissions = new Set(),
    valuesCache = new WeakMap(),
    valuesPending = new WeakMap(),
    scalarCache = new Map(),
    scalarPending = new Set();
  let sequence = 0;
  function scalar(expression, depth, scopeName, trail) {
    const ref = /^single_alias_right\[([^\]]+)\]$/.exec(expression);
    if (ref) {
      if (depth > 14 || trail.includes(ref[1]))
        return { kind: "opaque", reason: "recursive CWT alias " + ref[1] };
      const rules = single.get(ref[1]);
      return rules
        ? union(
            rules.map((rule) =>
              valueOf(rule.value, scope(rule.comments, scopeName), depth + 1, [...trail, ref[1]]),
            ),
          )
        : { kind: "opaque", reason: "unresolved CWT alias " + ref[1] };
    }
    if (expression === "bool") return { kind: "scalar", type: "boolean" };
    if (expression === "yes" || expression === "no")
      return { kind: "scalar", type: "boolean", literals: [expression === "yes"] };
    const num =
      /^(int|float)(?:\[(-?(?:\d+(?:\.\d+)?|inf))?\.\.(-?(?:\d+(?:\.\d+)?|inf))?\])?$/.exec(
        expression,
      );
    if (num)
      return {
        kind: "scalar",
        type: "number",
        ...(num[1] === "int" ? { integer: true } : {}),
        ...(num[2] !== undefined && !num[2].includes("inf") ? { min: Number(num[2]) } : {}),
        ...(num[3] !== undefined && !num[3].includes("inf") ? { max: Number(num[3]) } : {}),
      };
    if (/^[-+]?\d+(?:\.\d+)?$/.test(expression))
      return { kind: "scalar", type: "number", literals: [Number(expression)] };
    const en = /^enum\[([^\]]+)\]$/.exec(expression);
    if (en)
      return ["provinces", "state_id", "state_ids"].includes(en[1])
        ? union([
            { kind: "scalar", type: "number", integer: true },
            { kind: "scalar", type: "string" },
          ])
        : {
            kind: "scalar",
            type: "string",
            ...(enums.has(en[1]) ? { literals: enums.get(en[1]) } : {}),
          };
    if (/^(variable_field|value_field|int_variable_field)/.test(expression))
      return union([
        { kind: "scalar", type: "number" },
        { kind: "scalar", type: "string" },
      ]);
    if (/^(colour|color|percentage)/.test(expression))
      return expression.includes("percentage")
        ? union([
            { kind: "scalar", type: "number" },
            { kind: "scalar", type: "string" },
          ])
        : { kind: "opaque", reason: "tagged native colour" };
    if (expression === "scalar" || expression === "any_scalar")
      return union([
        { kind: "scalar", type: "string" },
        { kind: "scalar", type: "number" },
        { kind: "scalar", type: "boolean" },
      ]);
    if (
      /^(?:<|scope\[|value\[|value_set\[|filepath|icon|localisation|localization|date|datetime|country_tag|variable|event_target|enum\[)/.test(
        expression,
      )
    )
      return { kind: "scalar", type: "string" };
    if (/alias_match_left|alias_name/.test(expression))
      return { kind: "opaque", reason: "dynamic CWT alias" };
    return { kind: "scalar", type: "string", literals: [unquote(expression)] };
  }
  function flatten(input, scopeName, conditional = false, trail = []) {
    const result = [];
    for (const original of input) {
      const node = { ...original, scope: scope(original.comments, scopeName), conditional };
      if (/^subtype\[/.test(node.key) && Array.isArray(node.value)) {
        result.push(...flatten(node.value, node.scope, true, trail));
        continue;
      }
      const alias = /^(?:alias_name|alias_keys_field)\[([^\]]+)\]$/.exec(node.key);
      if (alias && !["effect", "trigger"].includes(alias[1])) {
        if (trail.includes(alias[1]) || trail.length > 8) {
          result.push({ ...node, key: "__opaque_alias_" + alias[1], opaque: true });
          continue;
        }
        const rules = aliases.get(alias[1]);
        if (rules) {
          result.push(
            ...flatten(
              rules.map((rule) => ({
                ...rule,
                comments: [
                  ...rule.comments.filter((comment) => !/^##\s*cardinality/.test(comment)),
                  "## cardinality = 0..1",
                ],
                ...(/^alias_keys_field/.test(node.key) ? { value: node.value } : {}),
              })),
              node.scope,
              true,
              [...trail, alias[1]],
            ),
          );
          continue;
        }
      }
      const keyEnum = /^enum\[([^\]]+)\]$/.exec(node.key);
      if (keyEnum && enums.has(keyEnum[1])) {
        for (const key of enums.get(keyEnum[1]))
          result.push({
            ...node,
            key,
            conditional: true,
            comments: [
              ...node.comments.filter((comment) => !/^##\s*cardinality/.test(comment)),
              "## cardinality = 0..1",
            ],
          });
        continue;
      }
      result.push(node);
    }
    return result;
  }
  function valueOf(raw, scopeName, depth = 0, trail = []) {
    if (typeof raw === "string") {
      const key = scopeName + ":" + raw;
      if (scalarCache.has(key)) return scalarCache.get(key);
      if (scalarPending.has(key)) return { kind: "opaque", reason: "recursive CWT alias" };
      scalarPending.add(key);
      const value = scalar(raw, depth, scopeName, trail);
      scalarPending.delete(key);
      scalarCache.set(key, value);
      return value;
    }
    const cached = valuesCache.get(raw)?.get(scopeName);
    if (cached) return cached;
    if (valuesPending.get(raw)?.has(scopeName))
      return { kind: "opaque", reason: "recursive CWT block" };
    const pending = valuesPending.get(raw) ?? new Set();
    pending.add(scopeName);
    valuesPending.set(raw, pending);
    const result = blockValue(raw, scopeName, depth, trail);
    pending.delete(scopeName);
    const cache = valuesCache.get(raw) ?? new Map();
    cache.set(scopeName, result);
    valuesCache.set(raw, cache);
    return result;
  }
  function blockValue(raw, scopeName, depth = 0, trail = []) {
    if (depth > 16) return { kind: "opaque", reason: "bounded nested CWT structure" };
    const expanded = flatten(raw, scopeName);
    if (expanded.length === 1 && /^alias_name\[(effect|trigger)\]$/.test(expanded[0].key))
      return {
        kind: "callback",
        mode: expanded[0].key.includes("effect") ? "effect" : "trigger",
        scope: expanded[0].scope,
      };
    if (expanded.length && expanded.every((node) => node.key === ""))
      return {
        kind: "list",
        element: union(expanded.map((node) => valueOf(node.value, node.scope, depth + 1, trail))),
      };
    const dynamic = expanded.filter((node) => dynamicKey(node.key));
    const onlyDynamic = expanded.length > 0 && dynamic.length === expanded.length;
    if (onlyDynamic)
      return {
        kind: "map",
        value: union(dynamic.map((node) => valueOf(node.value, node.scope, depth + 1, trail))),
      };
    const fields = {};
    for (const node of expanded) {
      let key = camel(node.key),
        name = node.key,
        v;
      if (node.key === "") {
        key = "values";
        name = "";
        v = { kind: "list", element: valueOf(node.value, node.scope, depth + 1, trail) };
      } else if (/^alias_name\[(effect|trigger)\]$/.test(node.key)) {
        const mode = node.key.includes("effect") ? "effect" : "trigger";
        key = mode === "effect" ? "effects" : "trigger";
        name = "";
        v = { kind: "callback", mode, scope: node.scope };
      } else if (node.opaque) {
        key = "native";
        name = "";
        v = { kind: "opaque", reason: "recursive dynamic alias" };
      } else if (dynamicKey(node.key)) {
        key = "entries";
        name = "";
        v = { kind: "map", value: valueOf(node.value, node.scope, depth + 1, trail) };
      } else v = valueOf(node.value, node.scope, depth + 1, trail);
      // CWTools RulesParser.getOptionsFromComments defaults an unannotated field to 1..1.
      const cardinality =
        node.comments.join("\n").match(/##\s*cardinality\s*=\s*([^\n]+)/)?.[1] ?? "1..1";
      const repeated = name !== "" && /\.\.(?:inf|[2-9]|\d{2,})/.test(cardinality);
      const bounds = /^(?:~)?(\d+)\.\.(inf|\d+)/.exec(cardinality);
      const minCount = node.conditional ? 0 : Number(bounds?.[1] ?? 0);
      const maxCount = bounds?.[2] === "inf" ? undefined : Number(bounds?.[2] ?? 1);
      const required =
        !node.conditional &&
        /^(?:~)?[1-9]\d*\.\./.test(cardinality) &&
        !node.key.startsWith("alias");
      if (fields[key]) {
        fields[key].value = union([fields[key].value, v]);
        if (repeated) fields[key].repeated = true;
        fields[key].required = Boolean(fields[key].required && required);
        if (fields[key].repeated) {
          fields[key].minCount = Math.min(fields[key].minCount ?? 0, minCount);
          fields[key].maxCount =
            fields[key].maxCount === undefined || maxCount === undefined
              ? undefined
              : Math.max(fields[key].maxCount, maxCount);
        }
      } else
        fields[key] = {
          name,
          value: v,
          ...(repeated ? { repeated: true, minCount, maxCount } : {}),
          ...(required ? { required: true } : {}),
        };
      if (node.comments.some((comment) => comment.startsWith("###")))
        fields[key].description = node.comments
          .filter((comment) => comment.startsWith("###"))
          .map((comment) => comment.replace(/^###\s*/, ""))
          .join(" ");
    }
    const signature = JSON.stringify(fields);
    let shape = shapeCache.get(signature);
    if (!shape) {
      shape = `NativeShape${++sequence}`;
      shapeCache.set(signature, shape);
      shapes[shape] = fields;
    }
    return { kind: "object", shape };
  }
  const names = {
    ability: "Ability",
    ace: "Ace",
    achievement: "Achievement",
    ai_strategy: "AiStrategy",
    ai_strategy_plan: "AiStrategyPlan",
    autonomy: "AutonomyState",
    bookmark: "Bookmark",
    balance_of_power: "BalanceOfPower",
    building: "Building",
    spawn_point: "SpawnPoint",
    character: "Character",
    collection: "Collection",
    combat_tactic: "CombatTactic",
    ai_area: "AiArea",
    ai_focus: "AiFocus",
    ai_peace: "AiPeace",
    ai_template: "AiTemplate",
    ai_equipment_design_group: "AiEquipmentDesignGroup",
    ai_faction_theater: "AiFactionTheater",
    country_file: "CountryDefinition",
    country_tag_alias: "CountryTagAlias",
    difficulty_setting: "DifficultySetting",
    doctrine_folder: "DoctrineFolder",
    grand_doctrine: "GrandDoctrine",
    subdoctrine: "Subdoctrine",
    doctrine_track: "DoctrineTrack",
    dynamic_modifier: "DynamicModifier",
    equipment: "Equipment",
    upgrade: "EquipmentUpgrade",
    module: "EquipmentModule",
    critical_part: "CriticalPart",
    equipment_group: "EquipmentGroup",
    faction_goal: "FactionGoal",
    faction_member_upgrade: "FactionMemberUpgrade",
    faction_rule: "FactionRule",
    faction_rule_group: "FactionRuleGroup",
    faction_template: "FactionTemplate",
    faction_upgrade: "FactionUpgrade",
    game_rule: "GameRule",
    idea_category: "IdeaCategory",
    ideology: "Ideology",
    intelligence_agency: "IntelligenceAgency",
    intelligence_agency_upgrade: "IntelligenceAgencyUpgrade",
    scripted_map_modes: "ScriptedMapMode",
    military_industrial_organization: "MilitaryIndustrialOrganization",
    mio_policy: "MioPolicy",
    modifier_definition: "ModifierDefinition",
    mtth: "MeanTimeToHappen",
    occupation_law: "OccupationLaw",
    operation_phase: "OperationPhase",
    operation_token: "OperationToken",
    operation: "Operation",
    opinion: "OpinionModifier",
    peace_action_categories: "PeaceActionCategory",
    peace_ai_desires: "PeaceAiDesire",
    peace_action_modifiers: "PeaceActionModifier",
    raid_category: "RaidCategory",
    raid: "Raid",
    resistance_compliance_modifier: "ResistanceComplianceModifier",
    resource: "Resource",
    country_scorer: "CountryScorer",
    special_project: "SpecialProject",
    sp_prototype_reward: "PrototypeReward",
    specialization: "Specialization",
    static_modifier: "StaticModifier",
    strategic_location: "StrategicLocation",
    technology: "Technology",
    tech_sharing_group: "TechnologySharingGroup",
    terrain: "Terrain",
    graphical_terrain: "GraphicalTerrain",
    country_leader_trait: "CountryLeaderTrait",
    unit_leader_trait: "UnitLeaderTrait",
    scientist_trait: "ScientistTrait",
    unit_medal: "UnitMedal",
    unit: "Unit",
    division_name: "DivisionNames",
    ship_name: "ShipNames",
    wargoal: "Wargoal",
    graphic_db: "GraphicDatabase",
    light: "Light",
    pdxmesh: "Mesh",
    entity: "Entity",
    model_animation: "ModelAnimation",
    pdxparticle: "PdxParticle",
    particle: "Particle",
    oob: "UnitHistory",
    state_category: "StateCategory",
    bitmapfonts: "BitmapFont",
    adjaceny_rule: "AdjacencyRule",
    supply_area: "SupplyArea",
    strategic_region: "StrategicRegion",
    music: "MusicPlaylistEntry",
    musicasset: "MusicAsset",
    portrait: "Portrait",
    soundcategory: "SoundCategory",
    soundeffect: "SoundEffect",
    sound: "SoundAsset",
  };
  const overrides = {
    character: { root: "characters" },
    equipment: { root: "equipments" },
    bookmark: { nodeName: "bookmark" },
    autonomy: { nodeName: "autonomy_state" },
    tech_sharing_group: { nodeName: "technology_sharing_group" },
    strategic_region: { nodeName: "strategic_region", idType: "number" },
    supply_area: { nodeName: "supply_area", idType: "number" },
    intelligence_agency: { root: "intelligence_agency", idMode: "anonymous" },
    intelligence_agency_upgrade: { root: "intelligence_agency_upgrades" },
    combat_tactic: {
      fileName: "combat_tactics.txt",
      nodeName: "tactic",
      idMode: "field",
      idField: "id",
    },
    musicasset: { nodeName: "music" },
    music: { nodeName: "music" },
    soundcategory: { folder: "sound", nodeName: "category" },
    soundeffect: { folder: "sound", nodeName: "soundeffect" },
    sound: { folder: "sound", nodeName: "sound" },
    country_file: { kind: "country" },
    pdxparticle: { extension: ".gfx" },
    particle: { extension: ".asset" },
    light: { extension: ".asset" },
    bitmapfonts: { nodeName: "bitmapfont" },
    model_animation: { nodeName: "animation" },
    adjaceny_rule: { nodeName: "adjacency_rule", fileName: "adjacency_rules.txt" },
  };
  overrides.scientist_trait = { folder: "common/scientist_traits" };
  overrides.combat_tactic = { fileName: "combat_tactics.txt", idMode: "key" };
  overrides.intelligence_agency_upgrade = {
    rootField: "branch",
    rootValues: [
      "branch_intelligence",
      "branch_defense",
      "branch_operation",
      "branch_operative",
      "branch_crypto",
    ],
  };
  const definitions = {};
  for (const container of nodes.filter((node) => node.key === "types"))
    for (const type of container.value) {
      const native = /^type\[(.+)\]$/.exec(type.key)?.[1],
        name = names[native];
      if (!name || !Array.isArray(type.value)) continue;
      const rule = nodes.find((node) => node.key === native);
      if (!rule) continue;
      const options = Object.fromEntries(
        type.value
          .filter((node) => typeof node.value === "string")
          .map((node) => [node.key, unquote(node.value)]),
      );
      const folder = options.path?.replace(/^game\//, "");
      if (!folder) continue;
      let v = valueOf(rule.value, scope(rule.comments, "country"));
      if (v.kind === "map") {
        const shape = `${name}Map`;
        shapes[shape] = { entries: { name: "", value: v, required: true } };
        v = { kind: "object", shape };
      }
      if (v.kind !== "object") {
        omissions.add(name + ": root is not an ordinary CWT object");
        continue;
      }
      let rootKey = options.skip_root_key;
      if (rootKey === "any") rootKey = undefined;
      const def = {
        folder,
        ...(rootKey ? { root: rootKey } : {}),
        idMode:
          options.type_per_file === "yes" ? "anonymous" : options.name_field ? "field" : "key",
        ...(options.name_field ? { idField: options.name_field, nodeName: native } : {}),
        ...(options.path_extension ? { extension: options.path_extension } : {}),
        ...(options.path_file ? { fileName: options.path_file } : {}),
        shape: v.shape,
        source: rule.source,
        line: rule.line,
        ...(overrides[native] ?? {}),
      };
      const ownFields = { ...shapes[def.shape] };
      def.shape = `${name}Body`;
      shapes[def.shape] = ownFields;
      if (def.idMode === "field") delete ownFields[camel(def.idField)];
      if (def.idMode === "key" && ownFields.id) {
        ownFields.nativeId = ownFields.id;
        delete ownFields.id;
      }
      definitions[name] = def;
    }
  function addDefinition(name, ruleName, options, scopeName = "country") {
    const rule = nodes.find((node) => node.key === ruleName);
    if (!rule) throw new Error(`Missing native definition rule ${ruleName}`);
    let value = valueOf(rule.value, scopeName);
    if (value.kind === "map") {
      const shape = `${name}Map`;
      shapes[shape] = { entries: { name: "", value, required: true } };
      value = { kind: "object", shape };
    }
    if (value.kind !== "object") throw new Error(`Unsupported native root ${ruleName}`);
    const shape = `${name}Body`;
    shapes[shape] = { ...shapes[value.shape] };
    if (options.idMode === "field") delete shapes[shape][camel(options.idField ?? "id")];
    definitions[name] = { ...options, shape, source: rule.source, line: rule.line };
  }
  for (const [name, nodeName, scopeName] of [
    ["NativeCountryEvent", "country_event", "country"],
    ["NativeStateEvent", "state_event", "state"],
    ["NativeNewsEvent", "news_event", "country"],
    ["NativeUnitLeaderEvent", "unit_leader_event", "unit_leader"],
    ["NativeOperativeEvent", "operative_leader_event", "operative"],
  ])
    addDefinition(
      name,
      "event",
      { folder: "events", nodeName, idMode: "field", idField: "id", kind: "event" },
      scopeName,
    );
  for (const [name, ruleName, nodeName, folder, idField] of [
    ["NativeFocusTree", "focus_tree", "focus_tree", "common/national_focus", "id"],
    [
      "ContinuousFocusPalette",
      "continous_focus_tree",
      "continuous_focus_palette",
      "common/continuous_focus",
      "id",
    ],
    ["SharedFocus", "shared_focus", "shared_focus", "common/national_focus", "id"],
    ["JointFocus", "shared_focus", "joint_focus", "common/national_focus", "id"],
    ["FocusStyle", "style", "style", "common/national_focus", "name"],
  ])
    addDefinition(name, ruleName, { folder, nodeName, idMode: "field", idField });
  addDefinition("NativeDecisionCategory", "decision_category", {
    folder: "common/decisions/categories",
    idMode: "key",
  });
  addDefinition("NativeDecision", "decision", {
    folder: "common/decisions",
    rootField: "category",
    idMode: "key",
  });
  addDefinition("NativeIdeas", "ideas", {
    folder: "common/ideas",
    root: "ideas",
    idMode: "anonymous",
  });
  // on_actions has a distinct native scope for each hook, retained as a discriminated union.
  const hooks = nodes.find((node) => node.key === "on_action");
  const hookBody = Array.isArray(hooks?.value) ? hooks.value : undefined;
  if (Array.isArray(hookBody)) {
    const byId = {};
    for (const hook of hookBody) {
      if (!/^on_\w+$/.test(hook.key)) continue;
      const v = valueOf(hook.value, scope(hook.comments, "country"));
      if (v.kind === "object") byId[hook.key] = v.shape;
    }
    if (Object.keys(byId).length)
      definitions.OnAction = {
        folder: "common/on_actions",
        root: "on_actions",
        idMode: "key",
        shape: Object.values(byId)[0],
        byId,
        source: hooks.source,
        line: hooks.line,
      };
  }
  // Country files use tagged RGB and have a second, linked country-tags output.
  if (definitions.CountryDefinition) {
    const fields = {
      graphicalCulture: {
        name: "graphical_culture",
        value: { kind: "scalar", type: "string" },
        required: true,
      },
      graphicalCulture2d: {
        name: "graphical_culture_2d",
        value: { kind: "scalar", type: "string" },
      },
      color: {
        name: "color",
        value: {
          kind: "list",
          element: { kind: "scalar", type: "number", integer: true, min: 0, max: 255 },
        },
        required: true,
      },
      useLegacyAiPpSpend: {
        name: "use_legacy_ai_pp_spend",
        value: { kind: "scalar", type: "boolean" },
      },
    };
    shapes.NativeCountry = fields;
    definitions.CountryDefinition.shape = "NativeCountry";
  }
  // HOI4 weather dates are lexical day.month tokens; retain leading/trailing zeroes.
  for (const fields of Object.values(shapes))
    if (fields.between?.value.kind === "list")
      fields.between.value.element = union([
        fields.between.value.element,
        { kind: "scalar", type: "string", format: "day-month" },
      ]);
  const gui = {};
  const guiNames = {
    containerWindowType: "NativeContainer",
    buttonType: "NativeButton",
    iconType: "NativeIcon",
    instantTextBoxType: "NativeText",
    gridBoxType: "NativeGridBox",
    listBoxType: "NativeListBox",
    dropDownBoxType: "DropDownBox",
    OverlappingElementsBoxType: "OverlappingElementsBox",
    smoothListBoxType: "SmoothListBox",
    positionType: "Position",
    browserType: "Browser",
    textBoxType: "TextBox",
    editBoxType: "EditBox",
    checkboxType: "Checkbox",
    scrollbarType: "Scrollbar",
    windowType: "Window",
  };
  for (const rule of aliases.get("gui") ?? []) {
    if (!Array.isArray(rule.value)) continue;
    const filtered = rule.value.filter((field) => field.key !== "alias_name[gui]");
    let v = valueOf(filtered, "country");
    if (v.kind !== "object") continue;
    const name =
      guiNames[rule.key] ??
      rule.key.replace(/Type$/, "").replace(/^./, (char) => char.toUpperCase());
    const shape = `${name}Props`;
    shapes[shape] = { ...shapes[v.shape] };
    // The control-specific size rule overrides the shared gui_standard alias.
    // Native CWTools rejects width/height for these two controls; x/y is required.
    if (["buttonType", "browserType"].includes(rule.key)) {
      const size = rule.value.find((field) => field.key === "size");
      if (size) shapes[shape].size = { name: "size", value: valueOf(size.value, "country") };
    }
    gui[rule.key] = {
      name,
      shape,
      validation: "upstream-cwt",
      ...(rule.value.some((field) => field.key === "alias_name[gui]") ? { children: true } : {}),
    };
  }
  // Older engine controls remain in all supplied GUI corpora but have no upstream CWT rules.
  // Keep their observed field facts explicit and their validation status distinct.
  const legacy = JSON.parse(
    fs.readFileSync(path.join(output, "schema/hoi4-legacy-gui.json"), "utf8"),
  );
  for (const [native, control] of Object.entries(legacy.controls)) {
    const shape = `${control.name}Props`;
    shapes[shape] = Object.fromEntries(
      Object.entries(control.fields).map(([key, field]) => {
        const values = field.types.map((type) =>
          type === "coordinates"
            ? scalar("single_alias_right[gui_position]", 0, "country", [])
            : {
                kind: "scalar",
                type,
                ...(field.enum
                  ? {
                      literals: enums.get(
                        field.enum === "orientation" ? "containerOrientations" : "guiTextFormats",
                      ),
                    }
                  : {}),
              },
        );
        return [
          key,
          { name: field.name, value: union(values), ...(field.required ? { required: true } : {}) },
        ];
      }),
    );
    gui[native] = {
      name: control.name,
      shape,
      validation: "corpus-observed",
      ...(control.children ? { children: true } : {}),
    };
  }
  const reachable = new Set();
  function visitValue(value) {
    if (value.kind === "object") visitShape(value.shape);
    else if (value.kind === "union") value.variants.forEach(visitValue);
    else if (value.kind === "list") visitValue(value.element);
    else if (value.kind === "map") visitValue(value.value);
  }
  function visitShape(shape) {
    if (reachable.has(shape)) return;
    reachable.add(shape);
    for (const field of Object.values(shapes[shape])) visitValue(field.value);
  }
  for (const definition of Object.values(definitions)) {
    visitShape(definition.shape);
    for (const shape of Object.values(definition.byId ?? {})) visitShape(shape);
  }
  for (const value of Object.values(gui)) visitShape(value.shape);
  for (const shape of Object.keys(shapes)) if (!reachable.has(shape)) delete shapes[shape];
  return {
    formatVersion: 1,
    provenance: {
      source: "https://github.com/cwtools/cwtools-hoi4-config (uploaded MIT snapshot)",
      sha256: createHash("sha256")
        .update(documents.map((document) => document.source + "\n" + document.text).join("\n"))
        .digest("hex"),
      files: documents.length,
    },
    definitions,
    shapes,
    gui,
    limitations: [
      "CWT subtype branches are merged as optional alternatives; native CWTools remains authoritative for branch-dependent requirements.",
      "Reference strings are checked for shape; project and native validation resolve game IDs.",
      "Dynamic keys remain typed maps; recursive, tagged and unresolved native syntax requires explicit CwtNode.",
      "Native interface declarations describe engine controls; hardcoded widgets still depend on the engine behavior of their parent windows.",
      "Window, TextBox and GuiButton fields come from observed native GUI corpus facts; the supplied upstream CWT has no corresponding control rules.",
      ...omissions,
    ],
  };
}
const schema =
  root === "--check" || root === "--from-schema"
    ? JSON.parse(fs.readFileSync(path.join(output, "schema/hoi4-domains.json"), "utf8"))
    : extract(root);
const { definitions, shapes, gui = {} } = schema;
function typeOf(v) {
  switch (v.kind) {
    case "scalar":
      return v.format === "day-month"
        ? "`${number}.${number}`"
        : v.literals?.length
          ? v.literals.map((value) => JSON.stringify(value)).join(" | ")
          : v.type;
    case "object":
      return v.shape;
    case "list":
      return `readonly (${typeOf(v.element)})[]`;
    case "map":
      return `{ readonly [key: string]: ${typeOf(v.value)} }`;
    case "callback":
      return `${v.mode === "effect" ? "Effect" : "Trigger"}<ScopeByName[${JSON.stringify(v.scope)}]>`;
    case "opaque":
      return "CwtNode";
    case "union":
      return v.variants.map(typeOf).join(" | ");
  }
}
function fieldsType(shape, top = false) {
  return Object.entries(shapes[shape])
    .filter(([key]) => !top || key !== "id")
    .map(
      ([key, field]) =>
        `  ${JSON.stringify(key)}${field.required ? "" : "?"}: ${field.repeated ? `readonly (${typeOf(field.value)})[]` : typeOf(field.value)};`,
    )
    .join("\n");
}
const lines = [
  "/** Generated from MIT CWT definitions and observed legacy GUI field facts. Run scripts/generate-domains.mjs; do not edit. */",
  `import type { Definition, IdentifiedDefinition, CwtNode, Effect, Trigger, ScopeByName } from './index.js';`,
];
for (const [name, def] of Object.entries(definitions)) {
  lines.push(`/** Native ${def.folder}; schema: ${def.source}:${def.line}. */`);
  if (def.byId)
    lines.push(
      `export type ${name}Spec = ${Object.entries(def.byId)
        .map(([id, shape]) => `{ id: ${JSON.stringify(id)}; outputPath?: string; } & ${shape}`)
        .join(" | ")};`,
    );
  else
    lines.push(
      `export interface ${name}Spec extends ${def.shape} {\n  id: ${def.idType ?? "string"};\n  outputPath?: string;\n${def.rootField ? `  ${def.rootField}: ${def.rootValues ? def.rootValues.map((value) => JSON.stringify(value)).join(" | ") : "string"};\n` : ""}}`,
    );
  lines.push(
    `export declare function ${name}(spec: ${name}Spec): ${def.idType === "number" ? "Definition" : "IdentifiedDefinition"};`,
  );
}
const exportedShapes = new Set(Object.values(gui).map((value) => value.shape));
for (const shape of Object.keys(shapes))
  lines.push(
    Object.keys(shapes[shape]).length
      ? `${exportedShapes.has(shape) ? "export " : ""}interface ${shape} {\n${fieldsType(shape)}\n}`
      : `${exportedShapes.has(shape) ? "export " : ""}type ${shape} = { readonly [key: string]: never };`,
  );
const nativeUi = [
  `/** Generated native interface controls from CWT and observed legacy field facts. No JavaScript runtime. */`,
  `import type { GuiElement, GuiChild } from './index.js';`,
  `import type { ${[...exportedShapes].join(", ")} } from '../sdk/domains.js';`,
];
for (const { name, shape, children, validation } of Object.values(gui)) {
  if (validation === "corpus-observed")
    nativeUi.push(
      `/** Legacy engine control observed in native GUI corpora. The supplied upstream CWTools has no rule for this control. */`,
    );
  nativeUi.push(
    `export declare function ${name}(props: ${shape}${children ? " & { children?: GuiChild }" : ""}): GuiElement;`,
  );
}
nativeUi.push(
  `export interface NativeIntrinsicElements {\n${Object.entries(gui)
    .map(
      ([native, { shape, children }]) =>
        `  ${JSON.stringify(native)}: ${shape}${children ? " & { children?: GuiChild }" : ""};`,
    )
    .join("\n")}\n}`,
);
const products = [
  ["sdk/domains.ts", lines.join("\n\n") + "\n"],
  ["ui/native.ts", nativeUi.join("\n\n") + "\n"],
];
if (root !== "--check" && root !== "--from-schema")
  fs.writeFileSync(
    path.join(output, "schema/hoi4-domains.json"),
    JSON.stringify(schema, null, 2) + "\n",
  );
for (const [file, content] of products) {
  const target = path.join(output, file);
  if (root === "--check") {
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== content) {
      console.error(`Generated file is stale: ${file}`);
      process.exitCode = 1;
    }
  } else fs.writeFileSync(target, content);
}
console.log(
  JSON.stringify({
    definitions: Object.keys(definitions).length,
    guiElements: Object.keys(gui).length,
    shapes: Object.keys(shapes).length,
    limitations: schema.limitations,
  }),
);
