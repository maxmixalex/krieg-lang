# TWR GDP Screen: authored Krieg port

The project manually re-expresses the supplied mod's GDP arithmetic, lifecycle hooks, ranking, auxiliary seat allocator, dynamic text, two map modes and country-list UI in Krieg. Shared functions cover factory aggregation, law multipliers and resource terms. A typed palette replaces repeated map-color blocks. The quicksort macro is replaced by twelve typed finite specializations (four arrays × three metrics). The original Yard1 algorithm attribution and reimu's projection attribution remain in `ranking.krg.ts`.

```sh
node scripts/rewrite-inputs.mjs /path/to/mods.zip twr-gdp-screen
node dist/cli.js build examples/rewrites/twr-gdp-screen
node dist/cli.js pack examples/rewrites/twr-gdp-screen
node scripts/audit-alpha-rewrites.mjs /path/to/private-mods
node --test tests/runtime-state.test.mjs tests/rewrite-differential.test.mjs
```

| Domain                  | Coverage / deliberate differences                                                                                                                                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GDP calculation         | All active arithmetic, weights, caps, resource divisors, state scopes and original operation order are preserved. Ten original effect bodies match after documented normalization of equivalent syntax.                                                                                                                   |
| Sorting                 | Original randomized iterative quicksort, temporary stack, swap order, reverse path and shared selector behavior are preserved. Every one of twelve macro specializations is structurally compared to the original template. Invalid selectors now do nothing instead of producing an unresolved source-text substitution. |
| Lifecycle               | Startup includes the original `calculate_GDP = no` invocation token; monthly and external map refresh calls remain unchanged.                                                                                                                                                                                             |
| Supplemental helpers    | `gdp_init_calc`, `gdp_growth_calc`, `sum_cap` and `example_sum_cap_usage` are included, even though some are not invoked by the GDP window.                                                                                                                                                                               |
| Window                  | Three country-scope dynamic lists, flag textures, selection, both sorts, dirty updates and close/open behaviors remain. One unbound decorative flag-frame name is made unique for the typed window contract.                                                                                                              |
| Map modes               | Both palettes, 19 thresholds, scaling (5.5 and 1), rounding, highlighting and update policy match the original. One native `scripted_map_modes` wrapper contains both declarations.                                                                                                                                       |
| Translations / metadata | Four original languages and the original dependency/load ordering and `1.13.5` compatibility declaration remain. The restoration tool repairs missing indentation and one known, SHA-checked missing Japanese quote; the input ZIP is unchanged.                                                                          |

Several surprising original behaviors are intentionally retained: the military occupation term subtracts the civilian occupation value; percentage growth subtracts 100 only when the ratio is exactly zero or 100; `country_GDP_T` is not reset before accumulation; both sort buttons share the same reverse-selector state. The port is not an economic-formula correction.

The input-backed oracle executes original and generated PDX for three countries under normal laws, severe mobilisation and zero-resource cases, then checks reverse and per-capita sorts. It also compares two complete map-mode structures. It uses deterministic floating-point arithmetic, a defined zero-division fallback and a modeled loop bound; HOI4 fixed-point overflow, exact temporary-variable lifetime, rendering and actual engine execution require game testing. These limits are emitted with the reproducible JSON report.

Only new source and validation code belong in git. `original-assets/` is private restoration output; no original gameplay script is imported or copied into the package.
