# Logistics example

This example uses only the semantic HOI4 SDK: events, decisions, national spirits, national focuses, scripted effects and triggers. A helper imported from another `.krg.ts` module is expanded statically; a finite `for...of` emits repeated flag operations.

The project declares the country references it uses through `world` so it can be compiled without a local game installation. For a real project, set `gameRoots` to your base game and enabled mods to generate their effective country and state types automatically.

From the repository root:

```sh
node dist/cli.js build examples/logistics
node dist/cli.js pack examples/logistics
```

The example intentionally adds a small alternative focus tree for Germany. Use a separate test playset when trying this example alongside other focus-tree mods. It inherits the game's map and existing graphical assets; the source contains no copied game data.
