# 命令行

在安装了 Krieg 的项目中，通过 `npx krieg` 使用命令。`--help` 显示当前实现支持的参数，`--version` 显示版本。项目参数省略时使用当前目录。

| 命令                                         | 用途                                               |
| -------------------------------------------- | -------------------------------------------------- |
| `krieg init <directory>`                     | 创建包含事件、决议和中英文本地化的完整示例项目     |
| `krieg check [project]`                      | 检查配置、类型、脚本、资源与地图，并刷新编辑器声明 |
| `krieg build [project]`                      | 检查并写出模组和启动器描述文件                     |
| `krieg pack [project]`                       | 构建并生成可移植 ZIP                               |
| `krieg world [project]`                      | 刷新 `.krieg` 下的编辑器声明和世界类型             |
| `krieg watch [project]`                      | 监听项目输入变化并重新构建                         |
| `krieg import <input> --out <directory>`     | 导入原生文件或目录，生成有序 `.krg.ts` 项目        |
| `krieg corpus <dataset> --out <report.json>` | 检查本地完整语料目录，并输出逐层报告               |

## 创建与构建

```sh
npx krieg init ./my-mod
npx krieg check ./my-mod
npx krieg build ./my-mod
npx krieg pack ./my-mod --out ./my-mod.zip
```

`init` 要求目标不存在或为空。创建后需先在新项目内安装其依赖，再运行其他命令。`check` 会刷新编辑器元数据，但不替换模组构建目录。

`build` 会先完成验证，成功后再替换自己的输出目录。目标非空且不属于同一 Krieg 项目时会拒绝覆盖。

## 指定本地基础游戏与大型模组

```sh
npx krieg check . --game-root "/path/to/Hearts of Iron IV"
npx krieg build . \
  --game-root "/path/to/Hearts of Iron IV" \
  --game-root "/path/to/Kaiserreich"
```

`--game-root` 可重复，按从基础游戏到上层模组的顺序排列，并替换本次命令使用的 `krgconfig.json` 游戏根配置。`--game-replace-path <directory>` 可重复，作用于最后一个命令行游戏根，用于显式指定上层模组的目录替换。它不修改配置文件，也不把基础游戏或上层模组复制到输出。`check`、`build`、`pack`、`world` 与 `watch` 使用同一套有效视图。开发者可为自己的安装路径保留本地命令，仓库配置中不必提交机器专属路径。

同时检查输入版本、DLC、模组版本和加载顺序；这些条件决定引用是否合法及游戏中的最终行为。两个完整项目的命令见 [完整示例](examples.md)。

## 持续构建

```sh
npx krieg watch
```

命令首先进行一次构建，然后监听项目和依赖的输入变动。工具生成目录、构建输出及 `node_modules` 中的变动不会触发无限重建。按 `Ctrl+C` 停止；持续监听命令不支持 `--json`。

## 导入选项

```sh
npx krieg import ./event.txt --out ./imported --path events/event.txt
```

`--path` 是单文件在游戏中的目标路径，单文件导入时必填。目录导入沿用原有相对路径，包括 `.gui`、`.gfx` 和 `.asset` 等扩展名。导入产生的是有序 PDX 源码，详细说明见[导入原生脚本](native-import.md)。

## 语料选项

```sh
npx krieg corpus /path/to/game --name vanilla --out ./reports/vanilla.json
```

| 参数                      | 含义                                           |
| ------------------------- | ---------------------------------------------- |
| `--name <label>`          | 为报告设置可读的数据集名称                     |
| `--out <path>`            | 报告 JSON 路径，必填                           |
| `--imported <directory>`  | 保存生成的 `.krg.ts` 迁移源码                  |
| `--generated <directory>` | 保存重建的原生脚本及其他文件                   |
| `--skip-typecheck`        | 显式跳过完整 TypeScript 编译层，报告会记录跳过 |

默认包含完整 TypeScript 编译层。输入很大时检查可能需要较长时间，进度写到标准错误，摘要写到标准输出，完整报告写入指定文件；使用 `--json` 时标准输出也包含完整报告。任一实际执行的验证层失败时，命令返回非零状态；输入本身的错误也会保留在报告中。

### 大语料的内存设置

普通的 `npx krieg corpus ...` 会自动准备语料进程需要的 Node.js 设置：启用 `--expose-gc`，并在没有显式堆配置时使用 `--max-old-space-size=3072`。需要时，CLI 会携带原参数重新启动自身，继承环境和标准输入输出，并传递退出状态。日常使用无需手工添加这些标志。

父进程通过 Node.js 参数或 `NODE_OPTIONS` 显式指定的堆设置会被保留。完整 TypeScript 编译在独立的批次进程中运行，每个编译进程默认使用 5632 MiB 的老生代堆设置；父进程在启动编译批次前会调用可用的垃圾回收接口，减少上一阶段数据与编译进程同时占用内存的情况。

这些数值是 V8 老生代堆的上限，不能当作整个进程树的内存上限。实际占用还包括其他堆区域、缓冲区和运行时开销。需要调整父进程设置时，可直接运行安装包中的 CLI，例如：

```sh
node --max-old-space-size=4096 ./node_modules/krieg-lang/dist/cli.js \
  corpus /path/to/game --out ./reports/game.json
```

Node.js 标志的定义见[官方命令行文档](https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-mib)。

## 机器可读输出

```sh
npx krieg check --json
npx krieg build --json
npx krieg import ./old-mod --out ./new-mod --json
```

`--json` 便于 CI 或编辑器工具读取完整诊断。普通文本模式只打印有限数量的诊断，完整结果应以 JSON 为准。不要仅依赖一段控制台成功文字判断质量；同时检查退出状态和结果中的 `success` 或各验证层的计数。
