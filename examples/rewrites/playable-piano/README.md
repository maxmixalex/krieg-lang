# Playable Piano: authored Krieg port

This project rewrites the supplied Interactive Piano mod as a typed TSX keyboard, two scripted windows, a CSS module, an English YAML dictionary and an `AudioBank`. It retains the 25 playable notes and their exact shortcuts, positions, sound names, WAV bytes, 0.8 volume, compressor settings, author attribution, workshop link and animated metronome. The unused 808 clip/texture assets remain available from the private input. The original compatibility declaration, `1.9.*`, is retained; it is not a new compatibility test.

From the repository root:

```sh
node scripts/rewrite-inputs.mjs /path/to/mods.zip playable-piano
node dist/cli.js build examples/rewrites/playable-piano
node dist/cli.js pack examples/rewrites/playable-piano
node scripts/audit-alpha-rewrites.mjs /path/to/private-mods
```

The original ZIP is private input. `original-assets/` is ignored by git and restores only media and translation data, never original `.txt`, `.gui`, `.gfx`, `.asset` or `.lua` logic. Published repository sources are the new authored project. The local package includes the user's supplied media; no ownership or redistribution permission is inferred.

| Original behavior                                 | Authored implementation             | Difference / verification                                                                               |
| ------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Open flag, disabled open button, close and Escape | `ScriptedWindow` callbacks          | Oracle executes original and generated effects and compares flag state.                                 |
| 15 white and 10 black keys                        | Two typed note tables and TSX `For` | Every shortcut, coordinate, texture alias and sound binding is compared to the original.                |
| 25 sound resources, effects and category          | One `AudioBank`                     | Clip bytes are SHA-256 matched; volume/category/compressor data are compared.                           |
| Four-frame metronome at 2 FPS                     | `AnimatedSprite`                    | All animation properties match the original. There is no separate metronome toggle in the supplied mod. |
| Literal English labels                            | Authored YAML keys                  | Display strings retain the original meaning and credit.                                                 |

Build and package validation do not run HOI4. Actual sound playback, window rendering and shortcut delivery remain game smoke checks. The deterministic differential oracle documents its arithmetic and engine-model limits in the JSON report.
