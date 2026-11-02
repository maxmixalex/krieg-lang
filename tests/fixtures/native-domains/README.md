# Native domain audit fixtures

These are original minimal public-SDK examples. They use factual native identifiers and enum values where references are necessary; their callbacks and authored content are not copied game scripts. `manifest.json` records reference-file hashes and rule locations. `support/` contains original text, a one-pixel DDS, PCM WAV and Ogg Vorbis sound. External mesh/animation files are **not** distributed: `external-assets.json` pins their public source commit, Git blob SHA, SHA-256 and observed binary header.

Run the repeatable external audit after building the compiler:

```sh
node scripts/audit-native-domains.mjs \
  --vanilla "/path/to/Hearts of Iron IV" \
  --rules "/path/to/cwtools-hoi4-config/Config" \
  --cwtools "/path/to/cwtools" \
  --fetch-assets
```

Alternatively provide `--assets /path/to/verified-overlay`, using the `auditPath` layout in the external-asset manifest. Only temporary audit inputs receive those binaries. The audit checks their hashes and `@@b@` header; CWTools checks definitions and file resolution, not mesh decoding or in-game rendering.

The report separately records untouched upstream rules and a temporary compatibility copy. Four domains need explicit path/type-identifier corrections for the supplied rules and `cwtools 2.3.0`: `ScientistTrait`, `FocusStyle`, `ContinuousFocusPalette`, `OnAction`. Every correction retains field constraints, records exact before/after hashes and links to a hashed native file. Positive samples must add **zero** diagnostics, including warnings. Each constructor also has a deliberately invalid counterpart that must produce a diagnostic at its own native path. This prevents unmatched files from silently passing.

Ordinary CI compiles these sources and compares paths, fixture hashes and emitted-text hashes to the independently reviewed report. It does not regenerate expected hashes and does not require commercial game files. A fixture/schema/support change requires explicitly rerunning the external audit, reviewing both rule-set results, then committing the updated report. `--compile-only --out /tmp/candidate.json` is useful while editing, but cannot establish native evidence.

`--seed` prepares new candidate sources from schema facts and an installed game; it overwrites candidate fixtures and is not a way to approve them. Hand-review and native validation are mandatory before updating the checked-in golden report. No test in this directory launches the game.
