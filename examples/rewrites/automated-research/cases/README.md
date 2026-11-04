# Executable comparison with the uploaded mod

From the repository root:

```sh
npm run build
node dist/cli.js build examples/rewrites/automated-research
node examples/rewrites/automated-research/cases/verify.mjs
node examples/rewrites/automated-research/cases/verify-ui.mjs
```

The original mod must be available at `../private-mods/Automated-Research`, or pass
its path as the first argument. The second optional argument selects a compiled
mod directory. No original script is an input to the Krieg build. The original
is read only by this comparison test.

`native-machine.mjs` is an independent interpreter of the native PDX subset used
by these cases. It receives parsed original or compiled native definitions. It
never imports the port's TypeScript facts or copies its queue/scoring algorithms.
Unknown native operations throw. World fixtures provide engine query results
(e.g. country factories, wars, researched technologies) explicitly. Inherited game
scripted triggers are fixture inputs; the interpreter does not claim to implement
the base game's entire rule set. Native `NOT` is NOR, and temporary variables and
arrays are separate from persistent save state.

The cases compare state after concrete actions and multi-day sequences:

- All 552 grants, research costs, start dates, prerequisite alternatives and save
  ancestors; 32 combinations of the major DLC visibility branches.
- Queue insertion/removal/movement, progress restoration, prerequisite repair,
  exclusive technology paths and locked/native-slot handling.
- All 1,040 idea bonus entries, research sharing, changing ahead penalties,
  estimated completion days, purchases of XP and breakthrough payouts.
- Empty-slot banking followed by reuse, then priority-lane borrowing over 40 days,
  lock rules, already-used bank days and queue edits while borrowing.
- V3 achievement streams compared bit for bit, fresh-reader import, arbitrary MIO
  palette IDs, DLC compatibility and deletion tombstones.
- All 255 AI conditions across 24 world fixtures and all 552 preference weights
  across 12 world fixtures; full replanning with zero, one and four slots,
  prerequisite priorities, automatic-row cleanup and manual ownership.

`verification.json` records the final counts and hashes of both native effect
sets. A passing comparison certifies only the projections and scenarios named in
`verify.mjs`; it is not a run in HOI4 or a claim about rendering, multiplayer,
engine iteration budgets, all saved-game versions, or organizations absent from
the fixture. UI and MIO/bonus cases have their own coverage boundaries.

`verify-ui.mjs` compares national technology labels, organization labels, saved
queue names and flag images, window visibility, tree geometry and modifier
clicks. It also compares all 1,499 sprite declarations, including 77 default
country flags whose codes have no government-specific sprite. Sprite names,
types, paths and animation fields must agree. Numeric fields accept equivalent
native spellings such as `0` and `0.0`. The report is `ui-verification.json`.
