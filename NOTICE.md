# Source and dependency notices

The Krieg implementation is supplied in this repository without a blanket open-source license (`UNLICENSED` in package.json). No license for the project owner's original code has been chosen on their behalf.

The bundled HOI4 command schema and generated command interfaces derive from the CWTools HOI4 configuration, distributed under the MIT license. The full upstream notice is included in [third_party/cwtools-hoi4-config-LICENSE](third_party/cwtools-hoi4-config-LICENSE). The schema records the source rules' content hash. `scripts/generate-schema.mjs` reads the supplied rules, and `scripts/generate-sdk.mjs` generates TypeScript command interfaces from that schema. The documented generation workflow rebuilds between these steps.

TypeScript, typescript-eslint, fflate, ESLint, Prettier and Zensical retain their respective upstream licenses. npm and Python install these tools as dependencies; their source code is not copied into Krieg's implementation.

Hearts of Iron IV, Kaiserreich and The New Order source datasets and the user-supplied CWTools executables are validation inputs, not part of this repository or the npm package. Published validation summaries contain counts, hashes and diagnostic comparisons, without redistributing those game or mod datasets. Example projects and test fixtures in this repository were written for Krieg.
