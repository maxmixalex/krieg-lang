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

默认包含完整 TypeScript 编译层。输入很大时检查可能需要较长时间，进度写到标准错误，报告写到标准输出及指定文件。任一实际执行的验证层失败时，命令返回非零状态；输入本身的错误也会保留在报告中。

## 机器可读输出

```sh
npx krieg check --json
npx krieg build --json
npx krieg import ./old-mod --out ./new-mod --json
```

`--json` 便于 CI 或编辑器工具读取完整诊断。普通文本模式只打印有限数量的诊断，完整结果应以 JSON 为准。不要仅依赖一段控制台成功文字判断质量；同时检查退出状态和结果中的 `success` 或各验证层的计数。
