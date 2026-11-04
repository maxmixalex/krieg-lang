# 把游戏报错定位回源码 {#_1}

游戏日志引用的是生成的 `.txt`、`.gui` 等文件。先用 `krieg build` 构建要调试的版本，然后把日志里的模组相对路径和行号交给 `krieg trace`。无需手工在展开后的效果块里搜索命令。

以仓库的 `examples/first-mod` 为例：

```sh
npx krieg build examples/first-mod
npx krieg trace examples/first-mod --at events/krieg_krieg_demo_1.txt:9
```

```text
events/krieg_krieg_demo_1.txt:9 → src/main.krg.ts:8:3 (expression)
  expanded at src/main.krg.ts:21:45
```

第一个位置是 `celebrate` 里调用 `addStability` 的地方；第二个位置是这次展开 `celebrate` 的调用点。同一辅助函数被多个事件复用时，可以从后者判断游戏正在执行哪个事件。路径相对于项目根目录，行和列从 1 开始。

## 一次处理整份日志 {#_2}

```sh
npx krieg trace ./my-mod --log "/path/to/Hearts of Iron IV/logs/error.log"
npx krieg trace ./my-mod --log ./error.log --json
```

支持 `events/example.txt:12`、`file: "events/example.txt", near line: 12` 和 `events/example.txt line: 12` 等路径与行号形式，也识别 Windows 反斜杠。没有脚本路径和行号的引擎消息会跳过；识别出路径但它不属于本次构建时，结果保留日志行号并解释原因。也可以对单个 `--at` 位置使用 `--json`，或从 Node 工具中调用 `krieg-lang/project` 的 `traceOutput` 与 `traceGameLog`。

## 定位精度 {#_3}

| 标记          | 打开的位置                                                                             |
| ------------- | -------------------------------------------------------------------------------------- |
| `expression`  | 生成该效果、条件或界面元素的表达式。有静态辅助函数展开时会列出可用的调用点。           |
| `style`       | 实际生成这个界面字段的 `.krg.css` 声明，附上使用它的 TSX 位置。                        |
| `declaration` | 生成这段内容的声明。例如合并到同一个 Lua 文件里的两次 `DefineFile`，会指回各自的调用。 |
| `file`        | 只知道来源文件。复制的原生文本和无细粒度位置的内容不会显示猜测的源码行号。             |

定位表保存在本地构建目录的 `.krieg-build.json` 中；发布 ZIP 不包含它。`trace` 校验本地生成文件的内容，若文件已被手工改动，会要求重建。定位表示**上次成功构建时**的源码位置：如果后来移动过源代码，或日志来自玩家安装的另一个版本，请切换到对应的源版本并重新构建。编译失败不会覆盖上一份成功的构建记录。
