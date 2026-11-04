# 编辑器与格式化 {#_1}

`.krg.ts` 与 `.krg.tsx` 使用 TypeScript / TSX 文件扩展名，因此可以使用已有的 TypeScript 编辑器支持。补全和跳转来自类型声明，语言子集提示来自 Krieg 的 ESLint 插件，最终检查由 `krieg check` 完成。

## TypeScript 类型检查 {#typescript}

在项目目录执行：

```sh
npx krieg world
npx tsc --noEmit
```

`world` 根据项目配置生成编辑器需要的声明。国家标签、地区编号与 SDK 类型可以通过标准 TypeScript 语言服务进入补全和诊断；这里不需要安装独立的 Krieg 语言服务器。

使用初始化项目生成的 `tsconfig.json`。它包含严格检查及项目类型映射。自己配置时，应保留 `strict: true` 和 `noEmit: true`，并使用 Krieg 生成的类型配置。`noEmit` 保证类型检查不产生 JavaScript；真正的游戏输出由 `krieg build` 生成。

首次克隆模组项目后，先运行 `npm install`，再运行 `npx krieg check` 或 `npx krieg world`，恢复被 Git 忽略的 `.krieg` 声明，然后使用编辑器或 `npx tsc --noEmit`。生成配置与编译器都启用 `exactOptionalPropertyTypes`：不提供可选字段时应省略该字段，只有字段类型明确允许时才能显式传入 `undefined`。

生成配置也包含 TSX 的 `jsx` / `jsxImportSource` 设置，指向 `krieg-lang/ui` 的类型入口；不需要 React 依赖或运行时转换。添加 `.krg.tsx` 后运行 `krieg world`，再检查编辑器是否使用项目自己的 `tsconfig.json`。

修改 `gameRoots`、依赖或显式的 `world` 列表后重新运行 `krieg world`。如果编辑器暂时仍显示旧类型，重新载入项目或重启 TypeScript 语言服务即可。

## ESLint {#eslint}

项目中安装 ESLint：

```sh
npm install --save-dev eslint
```

建立 `eslint.config.mjs`：

```javascript
import krieg from "krieg-lang/eslint";

export default [krieg.configs.recommended];
```

然后运行：

```sh
npx eslint "src/**/*.krg.{ts,tsx}"
```

该配置使用标准 `typescript-eslint` parser。插件包含以下规则：

| 规则                        | 检查内容                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `krieg/no-any`              | 拒绝显式 `any`                                                                     |
| `krieg/allowed-imports`     | 只允许 SDK、生成的项目引用、相对源码模块及显式列入配置的 Krieg npm 包              |
| `krieg/supported-syntax`    | 提示异步、类、动态循环、类型逃逸和 JavaScript 运行时调用等不支持的结构             |
| `krieg/explicit-parameters` | 要求独立辅助函数注明参数类型；内联回调可由调用上下文推导，编译器继续拒绝隐式 `any` |

如果项目使用了可复用的 Krieg npm 源码包，可以声明允许的包名：

```javascript
import krieg from "krieg-lang/eslint";

export default [
  krieg.configs.recommended,
  {
    files: ["**/*.krg.{ts,tsx}"],
    rules: {
      "krieg/allowed-imports": ["error", { packages: ["@my-team/krieg-common"] }],
    },
  },
];
```

这只是编辑器的导入规则。构建器还会检查该包是否按[项目依赖约定](projects.md)显式导出了 Krieg 源码。把普通 JavaScript 包加入 ESLint 允许列表不会使它变成可执行的编译期模块。

ESLint 提供快速反馈，不负责完整的项目分析。跨文件类型、引用、作用域和输出语义仍需执行 `krieg check`。

## Prettier {#prettier}

Prettier 自带的 TypeScript parser 可以直接格式化 `.krg.ts`：

```sh
npm install --save-dev prettier
npx prettier --write "src/**/*.krg.{ts,tsx}"
```

不需要自定义 parser 或源码预处理器。若需要显式覆盖，可以在 `.prettierrc.json` 中写：

```json
{
  "overrides": [
    {
      "files": "*.krg.ts",
      "options": { "parser": "typescript" }
    }
  ]
}
```

格式化只改变 TypeScript 的排版，不负责验证游戏行为。

## 常见提示 {#_2}

**编辑器说 `countries.GER` 不存在。** 先确认该国家来自当前项目的游戏和模组叠加视图，再运行 `krieg world`。如果你正在做不依赖游戏安装的测试，可在配置中显式声明 `world.countries`。

**TypeScript 检查通过，但 Krieg 不接受。** TypeScript 能表达的语言范围更大。Krieg 额外要求可以静态降级为 Paradox 脚本；例如 `while` 是合法 TypeScript，却不在 Krieg 语言中。

**调用 SDK 时运行时报错或找不到导出。** SDK 的值声明供静态编译器识别。不要用 `node`、`tsx` 或 `ts-node` 执行 `.krg.ts`，应运行 `krieg check` 或 `krieg build`。

工具的原生配置方式可参考 [TypeScript strict](https://www.typescriptlang.org/tsconfig/strict)、[TypeScript noEmit](https://www.typescriptlang.org/tsconfig/noEmit)、[ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files) 和 [Prettier 配置](https://prettier.io/docs/configuration)。
