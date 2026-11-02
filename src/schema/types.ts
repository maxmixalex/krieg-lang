/** A conservative, provenance-bearing projection of CWT rules, not CWTools. */
export interface CwtValueRule {
  type: "scalar" | "block";
  /** Literal CWT value expression, e.g. int, bool, <idea>, scope[country]. */
  expression: string;
  fields?: CwtFieldRule[];
}
export interface CwtFieldRule {
  name: string;
  value: CwtValueRule;
  cardinality?: string;
  description?: string;
}
export interface CwtCommandRule {
  name: string;
  kind: "effect" | "trigger";
  scopes: string[];
  pushScope?: string;
  value: CwtValueRule;
  description?: string;
  source: string;
  line: number;
}
export interface CwtSchema {
  formatVersion: 1;
  provenance: { source: string; sha256: string; files: number };
  /** Overloads remain separate; dynamic names such as <scripted_effect> are retained. */
  commands: CwtCommandRule[];
  scopes: string[];
  singleAliases: Record<string, CwtValueRule>;
  /** Every definition is retained when an alias is overloaded in the CWT source. */
  singleAliasOverloads?: Record<string, CwtValueRule[]>;
  diagnostics: { source: string; line: number; message: string }[];
}
