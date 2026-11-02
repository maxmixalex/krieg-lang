# Krieg

**用严格的 TypeScript 子集编写 Hearts of Iron IV 模组。**

Krieg 把 `.krg.ts` 源文件静态编译为 Paradox 脚本，并处理项目依赖、资源、本地化与模组打包。你可以使用熟悉的 TypeScript 编辑器、类型提示、ESLint 和 Prettier；源文件不会被当作 JavaScript 执行。

```typescript
import { CountryEvent, Option, loc, type CountryScope } from "krieg-lang/hoi4";

CountryEvent({
  id: "hello.1",
  title: loc("hello.1.t"),
  description: loc("hello.1.d"),
  isTriggeredOnly: true,
  options: [
    Option<CountryScope>({
      name: loc("hello.1.a"),
      effects: (country: CountryScope) => {
        if (country.politicalPower >= 50) {
          country.effects.addPoliticalPower(25);
          country.effects.setCountryFlag("hello_complete");
        }
      },
    }),
  ],
});
```

这里的 `if` 会生成游戏运行时的条件效果块。编译器读取 TypeScript AST、检查类型和 Krieg 语言规则，再生成原生脚本；它不调用上面的函数。

## 从源码开始

需要 Node.js 22.17 或更新版本。仓库提供本地打包与安装流程，以下命令不依赖已经发布的 npm 版本：

```sh
git clone https://github.com/maxmixalex/krieg-lang.git
cd krieg-lang
npm ci
npm run build
npm pack
node dist/cli.js init ../hello-krieg
cd ../hello-krieg
npm install ../krieg-lang/krieg-lang-0.1.0.tgz
npx krieg check
npx krieg build
```

从[第一个模组](docs/getting-started.md)继续，了解生成的文件、如何修改事件以及如何查看输出。

## 可以做什么

- 编写事件、国策、决议、民族精神、脚本化效果和条件、国家与地区历史。
- 在有类型的国家、地区等作用域中调用效果和条件，并把 `if`、布尔表达式、数值变量及常量数组遍历编译为对应脚本。
- 使用相对模块和显式声明为 Krieg 源码包的 npm 依赖，复用有类型的辅助函数。
- 建立项目与游戏资源的有效视图，生成国家标签和地区编号类型，并检查资源、本地化及输出路径冲突。
- 将原生 PDX 文本导入可编辑的有序语法表示，保留重复键和条目顺序。
- 为本地游戏或模组目录运行语料检查，并生成说明实际检查范围的报告。

完整说明见[文档首页](docs/index.md)、[语言模型](docs/language.md)、[项目配置](docs/projects.md)和[验证边界](docs/validation.md)。

Krieg 使用受限的 TypeScript 语法。普通 npm 运行时代码、`any`、异步任务、类以及动态循环不属于语言。CWT 命令元数据、原生语法往返和游戏引擎验证是不同层次；编译或语料检查成功不等于已经在 HOI4 中验证全部行为。

## 开发

```sh
npm ci
npm run build
npm run check
npm run lint
npm run format:check
npm test
npm run test:examples
npm run test:package
```

文档使用原生 [Zensical](https://zensical.org/)，配置在 `zensical.toml`：

```sh
python -m venv .venv
.venv/bin/python -m pip install -r requirements-docs.txt
.venv/bin/zensical serve
```

Windows 对应命令位于 `.venv\Scripts\`。CI 构建文档并保留预览产物；仓库启用 GitHub Pages 后，可手动运行 `Publish documentation` 工作流。开发与语料测试约定见[参与开发](docs/contributing.md)。
