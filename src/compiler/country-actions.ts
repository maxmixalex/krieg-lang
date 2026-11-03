import type ts from "typescript";
import * as pdx from "../pdx/ast.js";
import type { CompileOutput, PdxCompileOutput } from "./types.js";

type Fail = (node: ts.Node, code: string, message: string) => never;
type Mode = "effect" | "trigger";
interface ScriptedHandle {
  _krg: "definition";
  name: string;
  scope: "country";
  definitionKind: Mode;
  outputs: CompileOutput[];
}
interface ActionValue {
  _krg: "definition";
  id: string;
  politicalPowerCost: number;
  available: ScriptedHandle;
  execute: ScriptedHandle;
  outputs: CompileOutput[];
  pendingOutput: () => CompileOutput[];
}
interface ActionParts {
  eligible: ScriptedHandle;
  perform: ScriptedHandle;
}
interface ActionHost {
  claim(mode: Mode, name: string): void;
  callback(value: unknown, mode: Mode, prefix: string): pdx.PdxItem[];
  output(path: string, document: pdx.PdxDocument): PdxCompileOutput;
}

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function call(handle: ScriptedHandle): pdx.PdxProperty {
  return pdx.property(handle.name, pdx.atom("yes"));
}

/** Compiler-owned identities keep source records from impersonating paid actions. */
export class CountryActions {
  private readonly actions = new WeakMap<object, ActionParts>();
  private readonly callbacks = new WeakSet<object>();

  constructor(private readonly fail: Fail) {}

  declare(id: unknown, value: unknown, node: ts.Node, host: ActionHost): ActionValue {
    if (typeof id !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(id))
      this.fail(node, "KRG2620", "CountryAction requires a safe ASCII identifier.");
    if (!record(value) || "_krg" in value)
      this.fail(node, "KRG2620", "CountryAction requires a compile-time specification.");
    const extra = Object.keys(value).filter(
      (key) => !["politicalPowerCost", "available", "perform"].includes(key),
    );
    if (extra.length)
      this.fail(node, "KRG2620", `CountryAction has unsupported fields: ${extra.join(", ")}.`);
    const cost = value.politicalPowerCost;
    if (typeof cost !== "number" || !Number.isSafeInteger(cost) || cost < 0)
      this.fail(
        node,
        "KRG2620",
        "CountryAction.politicalPowerCost must be a non-negative compile-time safe integer.",
      );
    for (const key of ["available", "perform"])
      if (
        (key === "perform" || value[key] !== undefined) &&
        (!record(value[key]) || value[key]._krg !== "function")
      )
        this.fail(node, "KRG2620", `CountryAction.${key} requires a typed country callback.`);
    const handle = (suffix: string, mode: Mode): ScriptedHandle => {
      const name = `${id}_${suffix}`;
      host.claim(mode, name);
      const result: ScriptedHandle = {
        _krg: "definition",
        name,
        scope: "country",
        definitionKind: mode,
        outputs: [],
      };
      this.callbacks.add(result);
      return result;
    };
    const eligible = handle("eligible", "trigger");
    const available = handle("available", "trigger");
    const perform = handle("perform", "effect");
    const execute = handle("execute", "effect");
    const result: ActionValue = {
      _krg: "definition",
      id,
      politicalPowerCost: cost,
      available,
      execute,
      outputs: [],
      pendingOutput: () => {
        const eligibility =
          value.available === undefined
            ? [pdx.property("always", pdx.atom("yes"))]
            : host.callback(value.available, "trigger", eligible.name);
        const effect = host.callback(value.perform, "effect", perform.name);
        const affordable: pdx.PdxItem[] = [call(eligible)];
        const payment: pdx.PdxItem[] = [];
        if (cost > 0) {
          // Native >= is represented as NOT(<), including an exactly equal balance.
          affordable.push(
            pdx.property(
              "NOT",
              pdx.block([pdx.property("has_political_power", pdx.atom(String(cost)), "<")]),
            ),
          );
          payment.push(pdx.property("add_political_power", pdx.atom(String(-cost))));
        }
        return [
          host.output(
            `common/scripted_triggers/krieg_${id}_action.txt`,
            pdx.document([
              pdx.property(eligible.name, pdx.block(eligibility)),
              pdx.property(available.name, pdx.block(affordable)),
            ]),
          ),
          host.output(
            `common/scripted_effects/krieg_${id}_action.txt`,
            pdx.document([
              pdx.property(perform.name, pdx.block(effect)),
              pdx.property(
                execute.name,
                pdx.block([
                  pdx.property(
                    "if",
                    pdx.block([
                      pdx.property("limit", pdx.block([call(available)])),
                      ...payment,
                      call(perform),
                    ]),
                  ),
                ]),
              ),
            ]),
          ),
        ];
      },
    };
    this.actions.set(result, { eligible, perform });
    return result;
  }

  private resolve(value: unknown, node: ts.Node): ActionValue {
    if (!record(value) || !this.actions.has(value))
      this.fail(
        node,
        "KRG2621",
        "Expected a declared CountryAction; fabricated handles are not allowed.",
      );
    return value as unknown as ActionValue;
  }

  decision(spec: Record<string, unknown>, node: ts.Node): Record<string, unknown> {
    if (spec.action === undefined) return spec;
    const action = this.resolve(spec.action, node);
    if (["cost", "available", "completeEffect"].some((key) => spec[key] !== undefined))
      this.fail(
        node,
        "KRG2622",
        "A decision action owns cost, available and completeEffect; put eligibility and settlement in CountryAction.",
      );
    const parts = this.actions.get(action)!;
    const result: Record<string, unknown> = {
      ...spec,
      cost: action.politicalPowerCost,
      available: parts.eligible,
      completeEffect: parts.perform,
    };
    delete result.action;
    return result;
  }

  button(props: Record<string, unknown>, context: unknown, node: ts.Node): Record<string, unknown> {
    if (props.action === undefined) return props;
    const action = this.resolve(props.action, node);
    if (["global_context", "selected_state_context", "state_mapicon"].includes(String(context)))
      this.fail(
        node,
        "KRG2623",
        "A CountryAction button requires a country-scoped ScriptedWindow.",
      );
    if (props.click !== undefined || props.enabled !== undefined)
      this.fail(
        node,
        "KRG2622",
        "A button action owns click and enabled; put eligibility and settlement in CountryAction.",
      );
    const result: Record<string, unknown> = {
      ...props,
      click: action.execute,
      enabled: action.available,
    };
    delete result.action;
    return result;
  }

  /** Internal callback slots reuse authentic scripted handles, never synthetic source code. */
  callback(value: unknown, scope: string, mode: Mode, node: ts.Node): pdx.PdxItem[] | undefined {
    if (!record(value) || !this.callbacks.has(value)) return undefined;
    const handle = value as unknown as ScriptedHandle;
    if (scope !== "country" || handle.definitionKind !== mode)
      this.fail(
        node,
        "KRG2623",
        "CountryAction callbacks require their declared country scope and mode.",
      );
    return [call(handle)];
  }
}
