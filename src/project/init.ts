import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { writeEditorProject } from "./editor.js";

export const starterSource = `import { CountryEvent, DecisionCategory, type CountryScope } from "krieg-lang/hoi4";

function celebrate(country: CountryScope, amount: number): void {
  country.effects.addStability(amount);
  country.effects.setCountryFlag("krieg_demo_complete");
}

export default [
  CountryEvent({
    id: "krieg_demo.1",
    title: "krieg_demo.1.t",
    description: "krieg_demo.1.d",
    isTriggeredOnly: true,
    options: [{
      name: "krieg_demo.1.a",
      effects: (country: CountryScope) => celebrate(country, 0.05),
    }],
  }),
  DecisionCategory({
    id: "krieg_demo_category",
    decisions: [{
      id: "krieg_demo_begin",
      cost: 25,
      visible: (country: CountryScope) => !country.triggers.hasCountryFlag("krieg_demo_complete"),
      completeEffect: (country: CountryScope) => {
        country.effects.countryEvent({ id: "krieg_demo.1", days: 1 });
      },
    }],
  }),
];
`;

export function initProject(destination: string): string {
  const root = resolve(destination);
  if (existsSync(root) && readdirSync(root).length)
    throw new Error(`Project directory is not empty: ${root}`);
  const name =
    basename(root)
      .replace(/[^A-Za-z0-9_-]/g, "-")
      .replace(/^[^A-Za-z0-9]+/, "") || "krieg-mod";
  const files: Record<string, string> = {
    "krgconfig.json":
      JSON.stringify(
        {
          $schema: "./node_modules/krieg-lang/schemas/krgconfig.schema.json",
          name,
          sourceDir: "src",
          outDir: "build/mod",
          mod: {
            name: "My Krieg Mod",
            version: "0.1.0",
            supportedVersion: "1.19.*",
            tags: ["Gameplay"],
          },
          localisation: [
            { language: "english", from: "localisation/english.json" },
            { language: "simp_chinese", from: "localisation/simp_chinese.json" },
          ],
        },
        null,
        2,
      ) + "\n",
    "package.json":
      JSON.stringify(
        {
          name: name.toLowerCase(),
          version: "0.1.0",
          private: true,
          type: "module",
          scripts: {
            check: "krieg check",
            build: "krieg build",
            pack: "krieg pack",
            watch: "krieg watch",
            world: "krieg world",
            format: "prettier --write src",
          },
          devDependencies: { "krieg-lang": "^0.1.0", prettier: "3.9.10" },
        },
        null,
        2,
      ) + "\n",
    "tsconfig.json":
      JSON.stringify(
        {
          extends: "./.krieg/tsconfig.json",
          include: ["src/**/*.krg.ts", ".krieg/types/**/*.d.ts"],
        },
        null,
        2,
      ) + "\n",
    ".gitignore": "node_modules/\nbuild/\n.krieg/\n",
    ".prettierrc.json":
      JSON.stringify({ semi: true, singleQuote: false, tabWidth: 2 }, null, 2) + "\n",
    "src/main.krg.ts": starterSource,
    "localisation/english.json":
      JSON.stringify(
        {
          krieg_demo_category: "Krieg demonstration",
          krieg_demo_begin: "Celebrate our first mod",
          krieg_demo_begin_desc:
            "Spend 25 political power to trigger the demonstration event tomorrow.",
          "krieg_demo.1.t": "Our first Krieg mod",
          "krieg_demo.1.d":
            "The decision, event and localisation were built from one Krieg project.",
          "krieg_demo.1.a": "Celebrate!",
        },
        null,
        2,
      ) + "\n",
    "localisation/simp_chinese.json":
      JSON.stringify(
        {
          krieg_demo_category: "Krieg 示例",
          krieg_demo_begin: "庆祝第一个模组",
          krieg_demo_begin_desc: "花费25点政治点数，于明天触发示例事件。",
          "krieg_demo.1.t": "我们的第一个 Krieg 模组",
          "krieg_demo.1.d": "这个决议、事件和本地化都由同一个 Krieg 项目构建。",
          "krieg_demo.1.a": "庆祝！",
        },
        null,
        2,
      ) + "\n",
    "README.md":
      "# My Krieg Mod\n\nInstall Krieg, then run `npx krieg build`. The output is `build/mod` and a sibling `.mod` launcher descriptor.\n\nUse `npx krieg pack` for a portable ZIP: extract the folder and `.mod` file into the Hearts of Iron IV user mod directory, enable the mod, and open the decisions screen. The demonstration decision schedules an event one day later.\n\nUse `npx krieg world` after changing project dependencies or gameRoots to refresh editor declarations. This source is compiled statically; do not run it with Node or ts-node.\n",
  };
  for (const [path, text] of Object.entries(files)) {
    const dest = resolve(root, path);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, text);
  }
  writeEditorProject(root);
  return root;
}
