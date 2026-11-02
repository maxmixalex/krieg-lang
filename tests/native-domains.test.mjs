import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { compileSource } from "../dist/compiler/index.js";
import { emitPdx } from "../dist/pdx/index.js";
import { DOMAIN_SCHEMA } from "../dist/compiler/domain-registry.js";
import { cwtType } from "../dist/compiler/sdk.js";
import { commandValueError } from "../dist/compiler/command-validation.js";
import { loadBundledSchema } from "../dist/schema/index.js";

function valid(source, options = {}) {
  const result = compileSource(source, options);
  assert.equal(result.success, true, JSON.stringify(result.diagnostics, null, 2));
  return result.outputs;
}
function invalid(source, code) {
  const result = compileSource(source);
  assert.equal(result.success, false);
  assert.deepEqual(result.outputs, []);
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.code === code),
    JSON.stringify(result.diagnostics),
  );
}

/** Compiler-contract fixtures deliberately use placeholder references; they are not engine fixtures. */
function value(rule, depth = 0) {
  if (depth > 20) throw new Error("Fixture expansion exceeded the schema depth");
  if (rule.kind === "union") return value(rule.variants[0], depth + 1);
  if (rule.kind === "scalar") {
    if (rule.literals?.length) return JSON.stringify(rule.literals[0]);
    if (rule.format === "day-month") return '"0.0"';
    if (rule.type === "number")
      return String(rule.min ?? (rule.max !== undefined && rule.max < 0 ? rule.max : 0));
    return rule.type === "boolean" ? "false" : '"krg_reference"';
  }
  if (rule.kind === "callback")
    return `(scope:ScopeByName[${JSON.stringify(rule.scope)}])=>${rule.mode === "trigger" ? "true" : "{}"}`;
  if (rule.kind === "opaque") return "cwt([])";
  if (rule.kind === "list") return `[${value(rule.element, depth + 1)}]`;
  if (rule.kind === "map") return `{krg_entry:${value(rule.value, depth + 1)}}`;
  return `{${fields(rule.shape, depth + 1).join(",")}}`;
}
function fields(shape, depth = 0) {
  const entries = Object.entries(DOMAIN_SCHEMA.shapes[shape]);
  const required = entries.filter(([, field]) => field.required);
  const selected = required.length ? required : entries.slice(0, 1);
  return selected.map(
    ([key, field]) =>
      `${JSON.stringify(key)}:${field.repeated ? `[${Array.from({ length: Math.max(1, field.minCount ?? 0) }, () => value(field.value, depth)).join(",")}]` : value(field.value, depth)}`,
  );
}

test("every native domain constructor checks its projected schema and emits its registered native path and wrapper", () => {
  const names = Object.keys(DOMAIN_SCHEMA.definitions);
  const expected = new Map();
  const declarations = names.map((name, index) => {
    const definition = DOMAIN_SCHEMA.definitions[name];
    const id =
      definition.kind === "country"
        ? "KRG"
        : definition.kind === "event"
          ? `krg_${name}.1`
          : definition.byId
            ? Object.keys(definition.byId)[0]
            : definition.idType === "number"
              ? 9000 + index
              : `krg_contract_${name}`;
    const shape = definition.byId?.[id] ?? definition.shape;
    expected.set(name, {
      id,
      path: `${definition.folder}/${definition.fileName ?? `krieg_${String(id).replace(/[^a-zA-Z0-9_]/g, "_")}${definition.extension ?? ".txt"}`}`,
    });
    const data =
      definition.kind === "country"
        ? ['graphicalCulture:"western_european_gfx"', "color:[10,20,30]"]
        : fields(shape);
    if (definition.rootField)
      data.push(
        `${definition.rootField}:${JSON.stringify(definition.rootValues?.[0] ?? "krg_category")}`,
      );
    return `export const entry${index}=${name}({id:${JSON.stringify(id)},${data.join(",")}});`;
  });
  const outputs = valid(
    `import {${names.join(",")},cwt,type ScopeByName} from 'krieg-lang/hoi4';${declarations.join("\n")}`,
  );
  for (const [name, definition] of Object.entries(DOMAIN_SCHEMA.definitions)) {
    const destination = expected.get(name);
    const output = outputs.find((output) => output.path === destination.path);
    assert.ok(output, `${name} emitted no file at ${destination.path}`);
    assert.equal(output.representation, "schema-native");
    const root =
      definition.root ??
      (definition.rootField
        ? (definition.rootValues?.[0] ?? "krg_category")
        : definition.idMode === "anonymous"
          ? undefined
          : (definition.nodeName ?? String(destination.id)));
    if (root)
      assert.ok(
        output.document.items.some((item) => item.kind === "property" && item.key.text === root),
        `${name} is missing native wrapper ${root}`,
      );
  }
});

test("all declared native GUI control factories use declared fields and exact engine type names", () => {
  const controls = Object.entries(DOMAIN_SCHEMA.gui);
  const source = `import {GuiFile,Container,${controls.map(([, control]) => control.name).join(",")}} from 'krieg-lang/ui';import {cwt,type ScopeByName} from 'krieg-lang/hoi4';export default GuiFile('interface/all_controls.gui',Container({name:'krg_controls',children:[${controls.map(([, control]) => `${control.name}({${fields(control.shape).join(",")}})`).join(",")}]}));`;
  const [output] = valid(source);
  const container = output.document.items[0].value.items[0];
  const keys = container.value.items
    .filter((item) => item.kind === "property")
    .map((item) => item.key.text);
  for (const [native] of controls) assert.ok(keys.includes(native), `Missing native ${native}`);
});

test("native event variants and advanced focus forms preserve callbacks and ordered conditional text", () => {
  const outputs =
    valid(`import {NativeCountryEvent,NativeStateEvent,NativeFocusTree,ContinuousFocusPalette,SharedFocus,JointFocus,FocusStyle,type CountryScope,type StateScope} from 'krieg-lang/hoi4';
    NativeCountryEvent({id:'native.1',title:[{trigger:(c:CountryScope)=>c.isAI,text:'AI_TITLE'},'DEFAULT_TITLE'],desc:['DESC'],isTriggeredOnly:true,timeoutDays:20,after:[(c:CountryScope)=>c.effects.setCountryFlag('after')],option:[{name:'OPTION',effects:(c:CountryScope)=>c.effects.addPoliticalPower(5)}]});
    NativeStateEvent({id:'native.2',hidden:true,isTriggeredOnly:true,immediate:[(s:StateScope)=>s.effects.addManpower(5)]});
    NativeFocusTree({id:'native_tree',country:{base:0},resetOnCivilwar:false,focus:[{id:'native_focus',icon:['GFX_goal_generic_construct_civ_factory'],cost:2,x:0,y:0,completionReward:(c:CountryScope)=>c.effects.addPoliticalPower(5)}]});
    ContinuousFocusPalette({id:'native_palette',country:{base:0},position:{x:40,y:40},focus:[{id:'native_continuous',icon:['GFX_goal_generic_construct_civ_factory'],dailyCost:1,selectEffect:(c:CountryScope)=>c.effects.setCountryFlag('continuous')}]});
    SharedFocus({id:'native_shared',icon:['GFX_goal_generic_construct_civ_factory'],cost:2,x:0,y:0});
    JointFocus({id:'native_joint',icon:['GFX_goal_generic_construct_civ_factory'],cost:2,x:1,y:0});
    FocusStyle({id:'native_style',unavailable:'GFX_focus_unavailable',completed:'GFX_focus_completed',available:'GFX_focus_available',current:'GFX_focus_current'});`);
  const text = outputs.map((output) => emitPdx(output.document)).join("\n");
  assert.match(text, /add_namespace = native/);
  assert.match(text, /title = \{\s+trigger =/);
  assert.match(text, /timeout_days = 20/);
  assert.match(text, /state_event = \{[\s\S]*add_manpower = 5/);
  assert.match(text, /continuous_focus_palette =/);
  assert.match(text, /select_effect = \{\s+set_country_flag = continuous/);
  assert.match(text, /shared_focus =/);
  assert.match(text, /joint_focus =/);
  assert.match(text, /style = \{\s+name = native_style/);
  invalid(
    `import {NativeStateEvent,type CountryScope} from 'krieg-lang/hoi4';NativeStateEvent({id:'bad.1',immediate:[(c:CountryScope)=>c.effects.addPoliticalPower(5)]});`,
    "TS2322",
  );
});

test("native country, characters, technology, on-actions and strategic weather use actual engine syntax", () => {
  const outputs =
    valid(`import {CountryDefinition,Character,Technology,OnAction,StrategicRegion,OpinionModifier,type CountryScope,type AnyScope} from 'krieg-lang/hoi4';
    export const nation=CountryDefinition({id:'KRG',graphicalCulture:'western_european_gfx',color:[14,32,64]});
    export const leader=Character({id:'krg_leader',name:'KRG_LEADER',portraits:{civilian:{large:'gfx/leaders/krg.dds'}},countryLeader:[{ideology:'despotism',traits:[]}]});
    export const tech=Technology({id:'krg_research',startYear:1936,researchCost:1,categories:['industry'],onResearchComplete:(c:CountryScope)=>c.effects.addPoliticalPower(5)});
    export const hook=OnAction({id:'on_startup',effect:[(world:AnyScope)=>world.everyCountry((c:CountryScope)=>c.effects.setCountryFlag('krg_started'))]});
    export const opinion=OpinionModifier({id:'krg_friend',value:10,decay:1});
    export const region=StrategicRegion({id:9001,name:'KRG_TEST_REGION',provinces:[3838],weather:{period:[{between:['0.0','30.11'],temperature:[0,10],noPhenomenon:1,minSnowLevel:0}]}});`);
  const text = outputs.map((output) => emitPdx(output.document)).join("\n");
  assert.match(text, /KRG = "countries\/krieg_KRG.txt"/);
  assert.match(text, /color = rgb \{\s+14\s+32\s+64/);
  assert.match(text, /characters = \{\s+krg_leader =/);
  assert.match(text, /country_leader = \{\s+ideology = despotism/);
  assert.match(text, /on_research_complete = \{\s+add_political_power = 5/);
  assert.match(text, /on_actions = \{\s+on_startup = \{\s+effect = \{\s+every_country =/);
  assert.match(text, /between = \{\s+0\.0\s+30\.11/);
});

test("all native event scopes and targeted decision current scopes use scope-specific commands", () => {
  const variants = [
    ["NativeCountryEvent", "country_event", "CountryScope", "addPoliticalPower(1)"],
    ["NativeNewsEvent", "news_event", "CountryScope", "addPoliticalPower(2)"],
    ["NativeStateEvent", "state_event", "StateScope", "addManpower(3)"],
    ["NativeUnitLeaderEvent", "unit_leader_event", "UnitLeaderScope", "add_attack(4)"],
    [
      "NativeOperativeEvent",
      "operative_leader_event",
      "OperativeScope",
      "add_nationality(country('GER'))",
    ],
  ];
  for (const [constructor, root, scope, command] of variants) {
    const [output] = valid(
      `import {${constructor},country,type ${scope}} from 'krieg-lang/hoi4';${constructor}({id:'scope.1',hidden:true,isTriggeredOnly:true,immediate:[(s:${scope})=>s.effects.${command}]});`,
    );
    const text = emitPdx(output.document);
    assert.match(text, /add_namespace = scope/);
    assert.ok(text.includes(`${root} = {`), constructor);
    invalid(
      `import {${constructor}} from 'krieg-lang/hoi4';${constructor}({id:'missing_namespace',hidden:true});`,
      "KRG2123",
    );
  }
  const outputs =
    valid(`import {NativeDecision,type CountryScope,type StateScope} from 'krieg-lang/hoi4';
    NativeDecision({id:'country_target',category:'krg_targets',targets:['GER'],targetTrigger:(c:CountryScope)=>c.isAI,completeEffect:(c:CountryScope)=>c.effects.addPoliticalPower(3)});
    NativeDecision({id:'state_target',category:'krg_targets',stateTarget:true,targets:[1],targetTrigger:(c:CountryScope)=>c.isAI,completeEffect:(c:CountryScope)=>c.effects.addPoliticalPower(4),highlightStates:{highlightStatesTrigger:(s:StateScope)=>s.triggers.hasStateFlag('krg_highlight')}});`);
  const text = outputs.map((output) => emitPdx(output.document)).join("\n");
  assert.match(text, /state_target = yes/);
  assert.match(text, /highlight_states_trigger = \{\s+has_state_flag = krg_highlight/);
  assert.match(text, /complete_effect = \{\s+add_political_power = 4/);
  invalid(
    `import {NativeDecision,type StateScope} from 'krieg-lang/hoi4';NativeDecision({id:'bad',category:'krg_targets',stateTarget:true,completeEffect:(s:StateScope)=>s.effects.addManpower(4)});`,
    "TS2322",
  );
  invalid(
    `import {NativeOperativeEvent,type UnitLeaderScope} from 'krieg-lang/hoi4';NativeOperativeEvent({id:'scope.2',immediate:[(s:UnitLeaderScope)=>s.effects.add_attack(1)]});`,
    "TS2322",
  );
});

test("native callback unions choose the declared game scope instead of the first schema variant", () => {
  const [output] = valid(
    `import {ResistanceComplianceModifier,type StateScope} from 'krieg-lang/hoi4';ResistanceComplianceModifier({id:'state_test',type:'state_resistance_modifier',icon:1,smallIcon:1,threshold:10,margin:1,visible:(s:StateScope)=>s.triggers.hasStateFlag('krg_visible'),onEnable:(s:StateScope)=>s.effects.addManpower(5)});`,
  );
  assert.match(emitPdx(output.document), /on_enable = \{\s+add_manpower = 5/);
  assert.match(emitPdx(output.document), /visible = \{\s+has_state_flag = krg_visible/);
});

test("native repeated fields enforce CWT minimum cardinality", () => {
  const definition = DOMAIN_SCHEMA.definitions.BalanceOfPower;
  assert.equal(DOMAIN_SCHEMA.shapes[definition.shape].side.minCount, 2);
  const source = `import {BalanceOfPower} from 'krieg-lang/hoi4';BalanceOfPower({id:'too_few',leftSide:'left',rightSide:'right',initialValue:0,side:[{id:'left',icon:'GFX_left',range:[{id:'left_range',min:-1,max:0}]}]});`;
  invalid(source, "KRG2115");
});

test("native definitions reject unknown fields, numeric bounds and incompatible nested callback scopes", () => {
  invalid(
    `import {Technology} from 'krieg-lang/hoi4';const spec={id:'bad',researchCost:1,misspelledField:true};Technology(spec);`,
    "KRG2115",
  );
  invalid(
    `import {CountryDefinition} from 'krieg-lang/hoi4';CountryDefinition({id:'KRG',graphicalCulture:'western_european_gfx',color:[256,0,0]});`,
    "KRG2115",
  );
  invalid(
    `import {CountryDefinition} from 'krieg-lang/hoi4';CountryDefinition({id:'123',graphicalCulture:'western_european_gfx',color:[0,0,0]});`,
    "KRG2116",
  );
  invalid(
    `import {Technology,type StateScope} from 'krieg-lang/hoi4';Technology({id:'bad',onResearchComplete:(s:StateScope)=>s.effects.addManpower(5)});`,
    "TS2322",
  );
  invalid(
    `import {OnAction,type CountryScope} from 'krieg-lang/hoi4';OnAction({id:'on_startup',effect:[(c:CountryScope)=>c.effects.addPoliticalPower(5)]});`,
    "TS2345",
  );
  invalid(
    `import {BalanceOfPower} from 'krieg-lang/hoi4';BalanceOfPower({id:'bad',leftSide:'left',rightSide:'right',initialValue:2,side:[]});`,
    "KRG2115",
  );
});

test("native domain coverage labels retain explicit external-validation gaps", () => {
  const coverage = JSON.parse(
    fs.readFileSync(new URL("../src/schema/hoi4-domain-coverage.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(
    Object.keys(coverage.domains).sort(),
    Object.keys(DOMAIN_SCHEMA.definitions).sort(),
  );
  assert.ok(
    Object.values(coverage.domains).every(
      (domain) =>
        domain.compilerContractTest ===
        "every native domain constructor checks its projected schema and emits its registered native path and wrapper",
    ),
  );
  assert.ok(coverage.engineValidation === "not-run");
});

test("unannotated CWT command fields retain the upstream default cardinality of one", () => {
  // CWTools RulesParser.getOptionsFromComments uses (1, 1, true) when no cardinality comment exists.
  const schema = loadBundledSchema();
  const rule = {
    type: "block",
    expression: "{...}",
    fields: [
      { name: "mandatory", value: { type: "scalar", expression: "int" } },
      { name: "optional", cardinality: "0..1", value: { type: "scalar", expression: "int" } },
    ],
  };
  const declaration = cwtType(rule, schema);
  assert.match(declaration, /"mandatory": number/);
  assert.match(declaration, /"optional"\?: number/);
  assert.match(commandValueError({}, rule, schema), /Missing required command field 'mandatory'/);
  assert.equal(commandValueError({ mandatory: 1 }, rule, schema), undefined);
});
