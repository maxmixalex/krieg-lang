# Krieg

**用严格的 TypeScript 子集编写 Hearts of Iron IV 模组。**

Krieg 把 `.krg.ts`、`.krg.tsx` 和界面样式 `.krg.css` 静态编译为原生 PDX 脚本、GUI 与 Lua Defines，并处理项目依赖、资源、本地化与模组打包。你可以使用熟悉的 TypeScript 编辑器、类型提示、ESLint 和 Prettier；源文件不会被当作 JavaScript 执行。

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

编写成套玩法时，可以直接选择更高层的入口：

| 要写的内容                                               | 作者描述什么                               | Krieg 负责什么                                       |
| -------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| [有参数的效果与数组](docs/tutorials/typed-allocation.md) | 具名参数、库存字段和数值数组               | 检查作用域与参数，生成效果调用和临时存储             |
| [国策图与延时事件](docs/guide/focuses.md)                | 节点、路线、互斥选择和事件句柄             | 推导引用，生成前置组和双向互斥，检查接收作用域       |
| [可交互界面](docs/guide/ui.md)                           | TSX 控件及其点击、可用和显示条件           | 同时生成布局和 Scripted GUI，绑定正确的原生控件名    |
| [界面样式](docs/guide/styles.md)                         | 布局类、可复用的设计变量与每个控件的覆盖值 | 生成原生 GUI 属性，并给导入的类名提供补全            |
| [还原游戏报错](docs/guide/debugging.md)                  | 游戏日志中的文件和行号                     | 定位到源代码及静态辅助函数的调用处                   |
| [可复用的付费行动](docs/guide/actions.md)                | 一次声明国家行动的资格、政治点成本与奖励   | 游戏决议按原生费用收费；按钮和事件在执行时重查并支付 |
| [可复用脚本变体](docs/guide/scripted-content.md)         | 一组具名配置和一个有类型的回调             | 为每种配置生成可重复调用的普通游戏脚本               |
| [地图与铁路](docs/guide/map-atlas.md)                    | 途经点、排除区域和铁路等级                 | 按真实位图求陆地路径，保留原生基础铁路表             |

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
npm install ../krieg-lang/krieg-lang-0.6.0.tgz
npx krieg check
npx krieg build
```

从[第一个模组](docs/tutorials/first-mod.md)继续，了解生成的文件、如何修改事件以及如何查看输出。

也可以从 [GitHub Actions 的成功 CI 运行](https://github.com/maxmixalex/krieg-lang/actions/workflows/ci.yml)下载 `krieg-npm-package` 构建产物（保留 30 天）：内含 Node 24 实际安装并通过消费者验收的 `.tgz` 和 `SHA256SUMS`，安装步骤见[第一个模组](docs/tutorials/first-mod.md)。这是可下载的 CI 归档；该流程不会向 npm registry 发布版本。

## 可以做什么

- 编写事件、国策、决议、民族精神、脚本化效果和条件、国家与地区历史；使用 CWT 规则生成的领域构造器管理人物、科技、装备、AI、军工组织等内容。
- 使用 Scripted Localisation、MetaEffect、Scripted GUI 与静态 TSX 组件，生成原生文本选择、动态效果和 `.gui` / `.gfx` 界面文件。
- 用 `Defines` / `DefineFile` 静态生成 Lua 赋值，检查三个原生根下的已知键与值类型。
- 用 JSON、YAML 或原生 HOI4 本地化维护多语言文本，保留原生文本的顺序、注释、版本和转义。
- 检查国家引用、旗帜、地图位图、地区/区域、邻接与补给网络，并在真实原版或大型模组上下文中构建。
- 在有类型的国家、地区等作用域中调用效果和条件，并把 `if`、布尔表达式、数值运算、运行时循环和数组读写编译为对应脚本。
- 使用相对模块和显式声明为 Krieg 源码包的 npm 依赖，复用有类型的辅助函数。
- 建立项目与游戏资源的有效视图，生成国家标签和地区编号类型，并检查资源、本地化及输出路径冲突。
- 将原生 PDX 文本导入可编辑的有序语法表示，保留重复键和条目顺序。
- 为本地游戏或模组目录运行语料检查，并生成说明实际检查范围的报告。

文档站点：[maxmixalex.github.io/krieg-lang](https://maxmixalex.github.io/krieg-lang/)。

| 目标                   | 文档入口                                                                    |
| ---------------------- | --------------------------------------------------------------------------- |
| 从零完成一个可编译项目 | [Tutorials：安装、事件、国策、行动、TSX 与迁移](docs/tutorials/index.md)    |
| 按领域理解规则         | [Guides：语言、玩法、人物、科技、AI、地图、文本与界面](docs/guide/index.md) |
| 查精确签名和命令       | [Reference：API、CLI、原生命令与 Defines](docs/reference/index.md)          |
| 阅读实际模组重写       | [Ports：完整项目与上传模组案例](docs/ports/index.md)                        |

旧版已发布文档 URL 和锚点保留跳转；当前入口与深链兼容由严格文档构建检查。覆盖清单区分语义 API、CWT 结构校验、原生资源、版本条件和游戏硬编码边界。

Krieg 使用受限的 TypeScript 语法。普通 npm 运行时代码、`any`、异步任务和类不属于语言。效果回调支持运行时数值循环与数组遍历。CWT 命令元数据、原生语法往返和游戏引擎验证是不同层次；编译或语料检查成功不等于已经在 HOI4 中验证全部行为。

## 开发

```sh
npm ci
npm run build
npm run check
npm run docs:api:check
npm run docs:coverage
npm run docs:tutorials
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
# 提交前检查：
PATH=".venv/bin:$PATH" npm run docs:check
```

Windows 对应命令位于 `.venv\Scripts\`。API Reference 使用固定版本的 [TypeDoc](https://typedoc.org/) 和 [typedoc-plugin-markdown](https://typedoc-plugin-markdown.org/)，从公开入口生成函数、重载、字段、JSDoc 示例与源码链接，并接入 Zensical 的导航和搜索。游戏命令与 Defines 另有数据目录。修改声明后运行 `npm run docs:api`；CI 检查生成一致性、完整 HTML 链接/锚点以及 API 搜索收录。普通 CI 严格构建文档并保留预览；每次推送 `main` 后自动通过 GitHub Actions 部署到 Pages。开发与语料测试约定见[参与开发](docs/contributing.md)。
