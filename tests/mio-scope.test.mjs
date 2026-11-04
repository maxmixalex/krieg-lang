import test from "node:test";
import assert from "node:assert/strict";
import { compileSource, emitCompileOutput } from "../dist/compiler/index.js";
const prelude = "import {ScriptedEffect,countryTarget,mioTarget} from 'krieg-lang/hoi4';";
test("MIO pointers are acquired from real scopes and entered through typed targets", () => {
  const r = compileSource(
    prelude +
      `ScriptedEffect('mio',c=>{c.effects.every_military_industrial_organization(m=>{m.country(countryTarget('ROOT'),owner=>owner.setVariable('selected',mioTarget('PREV')));});c.militaryOrganization(mioTarget('var:selected'),m=>m.effects.add_mio_funds(500));});`,
  );
  assert.equal(r.success, true, JSON.stringify(r.diagnostics));
  const out = r.outputs.map(emitCompileOutput).join("\n");
  assert.match(out, /every_military_industrial_organization/);
  assert.match(out, /value = PREV/);
  assert.match(out, /var:selected = \{\s*add_mio_funds = 500/);
});
test("country pointers and malformed paths cannot be used as MIO targets", () => {
  for (const target of ["countryTarget('ROOT')", "mioTarget('var:bad} injected')"]) {
    const r = compileSource(
      prelude +
        `ScriptedEffect('bad',c=>c.militaryOrganization(${target},m=>m.effects.add_mio_funds(1)));`,
    );
    assert.equal(r.success, false);
    assert.ok(
      r.diagnostics.some((d) => ["KRG2041", "KRG2701", "TS2345"].includes(d.code)),
      JSON.stringify(r.diagnostics),
    );
  }
});
