# 第一个模组

这一页创建一个可以检查、编译和打包的小项目。需要 Node.js 22.17 或更新版本和 npm；从源码安装时还需要 Git。编译器本身不需要启动 HOI4。

可以从 [GitHub Actions 的成功 CI 运行](https://github.com/maxmixalex/krieg-lang/actions/workflows/ci.yml)下载 `krieg-npm-package`（保留 30 天），解压得到已通过消费者验收的 `krieg-lang-0.4.0.tgz` 与 `SHA256SUMS`。用 SHA-256 工具校验后，在解压目录运行 `npx --yes --package=./krieg-lang-0.4.0.tgz krieg init hello-krieg`，再运行 `cd hello-krieg`、`npm install --save-dev ../krieg-lang-0.4.0.tgz` 和 `npx krieg build`。这是 CI 归档安装方式，该流程不会向 npm registry 发布版本；下面提供从源码安装的完整步骤。

## 安装当前仓库版本

先把工具打包成一个可安装的 npm 文件：

```sh
git clone https://github.com/maxmixalex/krieg-lang.git
cd krieg-lang
npm ci
npm run build
npm pack
```

这会生成 `krieg-lang-0.4.0.tgz`。这里使用本地安装包，避免把“仓库里已经有代码”和“npm 上已经发布版本”混为一谈。

创建项目，并把刚打好的包安装进去：

```sh
node dist/cli.js init ../hello-krieg
cd ../hello-krieg
npm install ../krieg-lang/krieg-lang-0.4.0.tgz
npx krieg check
npx krieg build
```

后续命令都在 `hello-krieg` 项目目录中运行。`check` 给出配置和编译诊断；`build` 生成模组目录。输出路径由 `krgconfig.json` 的 `outDir` 控制，默认是 `build/mod`。

## 理解项目中的文件

| 位置             | 用途                                  |
| ---------------- | ------------------------------------- |
| `krgconfig.json` | 源码、输出、资源、依赖以及模组信息    |
| `src/*.krg.ts`   | Krieg 源代码；编译器静态读取这些文件  |
| `package.json`   | npm 工具和模块依赖                    |
| `tsconfig.json`  | 编辑器和 `tsc` 使用的严格类型检查配置 |
| `.krieg/`        | 根据项目生成的编辑器声明与工具元数据  |
| `build/mod/`     | 原生游戏脚本、本地化、资源与描述文件  |

## 写一个事件

可以在源目录中新建 `tutorial.krg.ts`。这里使用 `tutorial.1` 作为事件 ID，避免和初始示例重复：

```typescript
import { CountryEvent, Option, loc, type CountryScope } from "krieg-lang/hoi4";

CountryEvent({
  id: "tutorial.1",
  title: loc("tutorial.1.t"),
  description: loc("tutorial.1.d"),
  isTriggeredOnly: true,
  options: [
    Option<CountryScope>({
      name: loc("tutorial.1.a"),
      effects: (country: CountryScope) => {
        country.effects.addPoliticalPower(25);
        country.effects.setCountryFlag("tutorial_complete");
      },
    }),
  ],
});
```

事件 ID 使用命名空间加数字。`loc` 标记本地化键，`CountryScope` 把回调参数限定为国家作用域，`effects` 中的调用会生成原生效果。

## 添加中文文本

新建 `localisation/tutorial.zh.json`：

```json
{
  "tutorial.1.t": "新的开始",
  "tutorial.1.d": "我们已经准备好迈出下一步。",
  "tutorial.1.a": "开始行动。"
}
```

在 `krgconfig.json` 现有的 `localisation` 数组中追加这一项：

```json
{
  "language": "simp_chinese",
  "from": "localisation/tutorial.zh.json"
}
```

这段 JSON 是一条配置项，不是整个配置文件。保留初始项目已经声明的其他本地化输入。构建器将 JSON 转换为带正确语言头的游戏本地化文件。

## 检查输出

```sh
npx krieg check
npx krieg build
```

打开 `build/mod/events/` 下生成的文本，找到 `tutorial.1`。其中的选项效果应包含：

```text
add_political_power = 25
set_country_flag = tutorial_complete
```

同时检查输出的本地化目录和 `descriptor.mod`。源文件有类型错误、未知引用或输出冲突时，应先修复诊断，再使用新的输出。

可以用下面的命令持续构建或打包：

```sh
npx krieg watch
npx krieg pack
```

`watch` 会持续占用当前终端，按 `Ctrl+C` 结束后再执行下一条命令。打包产物用于分发构建后的模组；可复用的 Krieg 源码库使用另一套 npm 包声明，见[项目、资源与依赖](projects.md)。

## 接入真实游戏内容

初始项目可以使用显式的国家和地区列表完成自包含示例。开发真实模组时，在 `gameRoots` 中配置本机的游戏目录与叠加模组，执行 `npx krieg world`，再检查项目。生成的类型会反映项目看到的国家标签与地区编号。

接下来阅读[编辑器与格式化](editor.md)，把类型检查和语言规则提示接入日常编辑流程；然后阅读[作用域、条件与效果](scopes.md)来编写更复杂的游戏逻辑。
