# State Transfer Tool: authored Krieg port

Four typed windows colocate their buttons, triggers and effects. Shared functions express selection, country marking, colonial filters, transfer and core toggling; `countryTarget` / `stateTarget` preserve the original `ROOT`, `FROM.FROM` and saved-target semantics. The six original translations are restored from the private input. The original dependencies and `1.13.*` compatibility declaration are retained.

```sh
node scripts/rewrite-inputs.mjs /path/to/mods.zip state-transfer-tool
node dist/cli.js build examples/rewrites/state-transfer-tool
node dist/cli.js pack examples/rewrites/state-transfer-tool
node scripts/audit-alpha-rewrites.mjs /path/to/private-mods
```

| Contract                                     | Coverage / differences                                                                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Open/hide global toggles and their shortcuts | Preserved, including the offscreen hide switch.                                                                                                         |
| Selected-state mark/unmark                   | `FROM.FROM` and `ROOT.marked_states` updates preserved; paired buttons retain their visibility and enabled conditions.                                  |
| Mark all owned / non-home non-core states    | Exact owned-state selection, flags and counter writes preserved.                                                                                        |
| Clear all / award / toggle cores             | `everyGlobalState` explicitly covers all world states; country operations retain the saved target and clear consumed marks.                             |
| Startup and dynamic text                     | Startup counter initialization and all four ordered scripted-localisation definitions preserved.                                                        |
| Native representation                        | Explicit TS booleans and shared helpers replace native repeated blocks; skin aliases and field order can differ without changing the declared behavior. |

The input-backed differential oracle uses three countries and six states with different owners, controllers, core memberships and home-area status. It executes ten original/generated actions in sequence, compares all resulting ownership, control, cores, flags and counters, then checks the window visibility matrix. Neither the oracle nor a successful package is an actual HOI4 gameplay run.

`original-assets/` contains user-owned input data and is excluded from git. The original native scripts are never copied into the build as assets.
