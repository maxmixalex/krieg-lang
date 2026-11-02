# My Krieg Mod

Install Krieg, then run `npx krieg build`. The output is `build/mod` and a sibling `.mod` launcher descriptor.

Use `npx krieg pack` for a portable ZIP: extract the folder and `.mod` file into the Hearts of Iron IV user mod directory, enable the mod, and open the decisions screen. The demonstration decision schedules an event one day later.

Use `npx krieg world` after changing project dependencies or gameRoots to refresh editor declarations. This source is compiled statically; do not run it with Node or ts-node.
