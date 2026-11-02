# Corsican Civic Republic

This complete authored example creates the fictional **KRG** government in vanilla's actual state **1**. It includes a full country definition, an elected fictional leader, country and state histories, an initial four-battalion guard, original flags in all three sizes, a schematic original portrait, and a connected programme of focuses, decisions, events, politics, research, production and optional DLC systems. All art and narrative text in this folder are original; game and Kaiserreich files are read from a separately selected installation.

Enable this example on top of the base game.

## Build and select a base

From the repository root:

```sh
npm install
npm run build
node dist/cli.js build examples/vanilla-complete
node dist/cli.js pack examples/vanilla-complete
```

The first command without game roots checks authored source, exact declared references, package composition, localisation, original assets and internal map relationships. Select your installed base to validate inherited references too:

```sh
node dist/cli.js build examples/vanilla-complete --game-root "/path/to/Hearts of Iron IV"
```

`--game-root` entries are applied in order; an installed mod's `descriptor.mod` supplies its `replace_path` rules. No absolute machine paths are stored in this example. The output is `build/mod` beside `vanilla-complete.mod`; packing writes a relocatable ZIP. Extract the ZIP into your HOI4 user `mod` directory and enable the appropriate base and example. Choose the **An Island Programme** bookmark and select **KRG**, or select the new island country from the 1936 map.

When using the example as its own project, install its local `krieg-lang` development dependency and run `npm run build`. After changing base roots, run `krieg world` with those same root options to refresh editor declarations. Run `npm run lint` from this example directory to use its included `eslint.project.mjs`. That configuration permits only this project's opted-in civic-kit package; the generated editor declarations independently resolve the package's exact public source exports.

## Play through the connected systems

1. **Start the assembly.** Country history sets the starting government to `democratic`, recruits the leader, loads the Island Guard and initialises the assembly balance. An `on_startup` hook schedules the introductory event two days later.
2. **Invest in the harbour.** Complete A Civic Charter and Revive the Harbour, or use Fund the Harbour Programme. The congress event offers investment or a refund. Investment awards the national spirit and variable-backed workshop modifier, adds manpower in state 1, builds the local rail path, updates the UI variable and records the approval flag.
3. **Use community bonds.** Complete Community Bonds. Its scripted effect expands a native `meta_effect` whose amount comes from a game variable. The politics panel displays scripted localisation and allows one additional redemption. Its click handler clears the unlock flag and refreshes the panel's dirty variable.
4. **Develop engineering.** Equip the Engineering Group grants Workshop Methods, enables the custom small-arms variant and engineering battalion, adds weapons, loads the typed engineering OOB and moves the balance toward the workshop side. The technology can also be researched in the industry folder. Its completion effect grants equipment.
5. **Choose political arrangements.** Approve Cooperative Government selects an authored ideology and the leader's matching ideology role. Discuss a Voluntary Treaty opens an event offering association under **FRA**, or continued independence. The choice explicitly changes autonomy only when accepted.
6. **Extend the programme with DLC.** With La Resistance, establish the Coastal Information Service, research Harbour Contacts and use the Coastal Survey operation. Its phase awards a harbour-chart token and an operative outcome reward. With Arms Against Tyranny, the Island Design Cooperative inherits the base infantry-equipment MIO tree and adds a research-completion fund reward. With Gotterdammerung, the Coastal Signal Beacon special project and a wartime coastal reconnaissance raid become available. The demonstration decision completes the beacon by script; its country effect always applies, while the facility effect depends on the engine having a facility context.
7. **Let the AI use the same plan.** The authored AI strategy plan names the four focuses and prioritises industrial research. The custom bookmark points to the same country, ideology, history description and starting focus.

The intelligence agency declaration adds a country-specific name/logo option. Its `available` condition controls that option; the example leaves the inherited agency list in place. Both supplied bases author multiple `intelligence_agency` blocks in `common/intelligence_agencies/00_intelligence_agencies.txt`, including independently gated country options.

The optional systems use the relevant DLC conditions. A naval base, operative network, war target, research facility or production assignment may still be required by the game's normal UI. Script validation does not simulate these engine requirements.

## Source and output map

| Source                      | Authored native features                                                                                                                                                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/country.krg.ts`        | `CountryDefinition`, `Character`, `CountryHistory`, `StateHistory`; ordered PDX preserves four repeated infantry entries in the initial OOB                                                                                       |
| `src/map.krg.ts`            | `StrategicRegion` replaces the exact base filename for region 169, retains the complete factual province membership and supplies authored weather                                                                                 |
| `src/programme.krg.ts`      | Four-focus tree, national spirit, three core events, investment/delegation decisions, scripted effects/triggers, opinion modifier, dynamic modifier, scripted localisation and startup hook                                       |
| `src/systems.krg.ts`        | Technology, equipment, unit and typed additional OOB; balance of power, ideology, autonomy; agency/upgrade, operation/phase/token; MIO, special project, raid/category, AI plan and bookmark; decisions and event connecting them |
| `src/interface.krg.tsx`     | Imported static UI components, reusable source component, sprites, scripted GUI callbacks and typed asset references                                                                                                              |
| `src/timing.krg.ts`         | A typed native Lua define sets unanswered event timeout to fourteen days                                                                                                                                                          |
| `packages/civic-kit`        | A local, npm-compatible source package with a `krieg.exports` public import, reusable helper, trigger, effect and English localisation                                                                                            |
| `localisation/english.yaml` | Flat YAML mapping including a multiline block string, Unicode and game text substitutions                                                                                                                                         |
| `localisation/chinese.yml`  | A small native Chinese localisation sample whose BOM, comment, version numbers and escapes are preserved                                                                                                                          |
| `assets/gfx`                | Original TGA flags, portrait and UI textures; never recompressed by the project build                                                                                                                                             |

The package is imported as `@krieg-examples/civ-civic-kit`. Its local dependency path exposes the same public module declared in `package.json` as an installed npm package would; dependency outputs are emitted once before the application. The tests also cover installed npm package composition elsewhere in the repository.

The base map supplies all other states, province definitions, bitmaps, supply tables, terrain and model positions. This is a targeted world extension. The repository's separate map validator tests exercise original synthetic province/terrain/height/rivers/trees/cities/normal bitmaps, definition CSV, continents, state/region membership, strait rules, railway and supply rows, building positions and unit stacks, with explicit broken fixtures for each diagnostic family.

## Verification and boundaries

`tests/complete-examples.test.mjs` builds both complete projects and checks the actual emitted native relationships, exact initial state/province references, dependency deduplication, UI lowering, localisation bytes, flags and reproducible packaging. It injects missing assets and duplicate localisation and verifies that the last successful build remains intact. CLI tests select two bases in order, apply explicit replacement rules, check exact generated country declarations and verify the configuration remains unchanged.

`tests/localisation.test.mjs` and `tests/map-country.test.mjs` cover positive input and specific malformed input cases. `tests/native-domains.test.mjs` and the independent native-domain audit cover broader SDK constructors separately. The two playable scenarios are integrated examples of the features listed above; their feature count is not a claim that every SDK field or every engine interaction has been exercised.

Run the external native checker against the supplied text corpora with:

```sh
node scripts/validate-complete-examples.mjs --corpora /path/to/corpora --fetch-kr-map
```

The command records selected base layers, output hashes, external diagnostics and input fingerprints in `reports/validation/complete-examples.json`. Static compilation and CWTools validation have been performed; an HOI4 launch, game UI inspection, save/load and multiplayer run remain separate engine checks. The recorded native run has zero errors and two `CW251` warnings per example: the compiler emits explicit `AND` blocks for the investment condition and the agency's country/DLC condition, where native syntax already implies conjunction. The warnings remain visible in the report; no diagnostic is suppressed.

The external two-example command also validates Kaiserreich. Because that supplied snapshot omits map text and a descriptor, the command can fetch a pinned official map supplement into scratch. See the [Kaiserreich example's provenance](../kaiserreich-complete/README.md#kaiserreich-validation-provenance) for the exact hybrid base used in its report. Vanilla uses the supplied vanilla text snapshot directly.
