# 验证与兼容性

一次检查能证明什么，取决于它检查的层次。Krieg 把语言、项目资源和语料往返分开记录，便于定位错误，也避免把不同程度的成功当成同一个结论。

## 如何复核 0.3 的作者接口

[离线 Wiki 对照](coverage.md)记录本次输入的 54 个页面修订。对 API 的检查分三步：用真实项目 `tsconfig.json` 查询 TypeScript 的补全和悬停；让模组构建器降低代码并比较原生文件；从实际 npm 压缩包安装后，用下游 CLI、ESLint 和 `tsc` 重跑作者流程。国策图与事件调度检查跨模块句柄、前置组合、事件接收作用域和命名空间；TSX 检查控件与 Scripted GUI 的绑定以及静态循环的闭包。

给定的地图补充包实际包含 `KR.zip`、`TNO.zip`。原版地图来自 `cwtools` 数据包。将补充包各自解压到含 `map/` 的根目录；例如下面的命令使用本地 KR 位图和表格，不从上游下载替代地图：

```sh
node scripts/validate-complete-examples.mjs --corpora /path/to/corpora --provided-kr-map /path/to/KR
```

项目输出与两套真实基准的原生检查见[完整项目验证](https://github.com/maxmixalex/krieg-lang/blob/main/reports/validation/v0.3.0-complete-examples.json)。对同一批原版、Kaiserreich 和 TNO 输入复跑全量严格导入时，使用 `node scripts/verify-supplied-corpora.mjs --corpora /path/to/corpora`；它分别检查输入清单、层级计数及原有解析失败路径，并保留原始报告。所有这些检查均不启动游戏。

## v0.2.0 的新增验证证据

v0.2.0 的完整语料检查使用冻结编译产物 `12761686ff11de9ff38e49615ae48c2f23667c1cbf73f027b017b2839f1f383c`：原版 5,311、Kaiserreich 5,041、TNO 7,196 个可解析 PDX 文件，共 **17,548 / 17,548** 完成实际严格 TypeScript 编译、静态降级、确切目标路径与规范 PDX 语义哈希匹配。19,910 个输入文件的清单哈希未变；32 个既有原始解析错误和 TNO 的两个附加格式问题仍原样记录。[v0.2.0 完整报告](https://github.com/maxmixalex/krieg-lang/blob/main/reports/validation/v0.2.0-corpus-summary.json) 说明冻结产物、输入清单和逐层结果。

这组全量结果验证有序迁移通道。随后增加或修正的命名领域、Lua 与 UI 通过对应的独立回归及原生审计；不能把冻结产物的全量结果自动描述为之后每次源码修改都重新跑过全语料。

| 新增验证     | 实际证据                                                                           | 明确边界                                                                    |
| ------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 命名原生领域 | 111 个原创 public-SDK 样例，112 个原生文件；正向零新增诊断，逐域破坏样例均触发规则 | 107 个直接使用原规则；4 个使用逐条记录的临时兼容修正，原规则结果保留        |
| 原生 GUI     | 15 种上游规则控件，正向零诊断和逐控件必填字段删除探针全部通过                      | 另 3 种旧式控件基于三语料字段观察投射，无上游 CWT 规则，不计入原生 CWT 分数 |
| 完整项目     | 原版 70、Kaiserreich 88 个输出文件；项目诊断为零，原生检查无错误                   | 每例保留并解释两条冗余 AND 提示；KR 审计基准的地图补充和替换目录单独记录    |
| Lua Defines  | 独立 Lua 5.1 解析器检查真实赋值文本；三个根下的键和值类型检查                      | 不执行 Lua，不证明某个平衡参数的游戏效果                                    |

[领域审计](https://github.com/maxmixalex/krieg-lang/blob/main/reports/validation/domain-native-audit.json)、[GUI 审计](https://github.com/maxmixalex/krieg-lang/blob/main/reports/validation/gui-native-audit.json)、[GUI 语料清单](https://github.com/maxmixalex/krieg-lang/blob/main/reports/validation/gui-corpus-inventory.json) 与 [完整项目报告](https://github.com/maxmixalex/krieg-lang/blob/main/reports/validation/complete-examples.json) 均保留工具/输入信息。领域审计的 `ScientistTrait`、`FocusStyle`、`ContinuousFocusPalette`、`OnAction` 需要 CWT 路径或内部类型标识兼容修正；修正不放宽字段规则，也不改动游戏输出。

普通 CI 将原创 fixtures 再次编译，比较已独立审计的路径、文本哈希、源文件和资源哈希。它不会从当前实现重新生成“期望结果”。刷新金样本必须显式重跑外部审计；模型/动画验证依赖的公开固定版本资源只下载到临时目录，仓库不分发这些二进制。所有上述报告均注明 `engineValidation: "not-run"`。

## 编写项目时的检查

| 检查                     | 能发现的问题                                           |
| ------------------------ | ------------------------------------------------------ |
| 标准 TypeScript 类型检查 | 错误参数类型、未知成员、生成世界引用不存在             |
| Krieg 语言检查           | 不支持的语法、不能静态求值的结构、非法调用和作用域使用 |
| 输出检查                 | 重复定义或路径冲突、无效原生输出结构                   |
| 项目资源检查             | 已支持资源格式的问题、缺失文件、地图和本地化结构问题   |
| 游戏内测试               | 引擎实际加载、事件触发、界面表现及游戏行为             |

`krieg check` 和 `krieg build` 共用项目检查流程。ESLint 是较快的编辑反馈，不能替代完整项目检查。

## CWT 的角色

仓库中的命令元数据来自 HOI4 CWT 规则，包含命令名称、作用域、字段、基数和可表达的值约束。SDK 根据这些元数据提供相应原生命令，以及常用命令的驼峰 API。

把规则整理成 TypeScript 声明，并不等于实现了完整 CWTools 规则引擎。高级 CWT 表达式和动态键不能简单地转成静态对象类型；它们保留明确的类型边界，需要时使用 `cwt(...)` 的有序结构。此时调用者承担更低层字段含义的检查责任。

语义定义 API、结构化 `DataFile`、生成命令声明和有序 PDX 提供不同程度的建模与检查。能通过有序 PDX 或 `DataFile` 表达某个文件，不代表这个文件已经具有完整的专用语义 SDK。

## 语料报告的层次

`krieg corpus` 为输入文件保留类别、相对路径、字节数和 SHA-256，并分别记录以下层的 `attempted`、`passed`、`failed`、`skipped`：

| 报告字段                     | 实际执行的工作                                                 |
| ---------------------------- | -------------------------------------------------------------- |
| `parse`                      | 把选中的 PDX 文件解析为有序语法树                              |
| `canonicalSemanticRoundtrip` | 规范化发射、重新解析并比较有序结构                             |
| `constructorStaticRecompile` | 导出 `.krg.ts` 构造器源码，再静态解释并比较结构                |
| `typescriptCompile`          | 使用完整 Krieg/TypeScript 编译流程编译迁移源码，并比较输出结构 |
| `ancillarySyntax`            | 检查本地化和部分地图表的行格式                                 |

这里的 `canonicalSemanticRoundtrip` 使用语法树的结构含义，包括顺序、重复键、token 和运算符；它不运行游戏脚本，也不判断某条游戏命令在当前位置一定有效。

一个文件解析失败时，无法执行的后续层应记为 `skipped`。把没有运行的层计入通过数量，会掩盖真实覆盖范围。使用 `--skip-typecheck` 时，完整 TypeScript 层也必须明确记为跳过。启用完整编译时，工具可以跳过已被更强的 TypeScript 编译与哈希比较覆盖的轻量构造器解释层；应结合报告中的说明判断跳过原因。

## 文件分类

游戏目录同时包含 PDX 脚本、本地化、地图表、二进制资源和说明文字。语料工具先分类再处理，不能因为扩展名是 `.txt` 就把所有文本当成脚本。例如铁路表、补给节点和 credits 文本需要不同处理。

报告中的库存统计保留这些文件。查看结果时，应同时检查分类数量和各层分母，不能仅截取一个通过百分比。已有输入错误会原样进入诊断，不会为了增加通过率而从数据集中悄悄移除。

## 大语料的执行方式

语料扫描与完整 TypeScript 编译使用独立的进程。扫描按文件推进，编译按批次进入新的工作进程，批次结束后释放其 TypeScript 程序与语法树。生产 CLI 会自动准备父进程的堆与垃圾回收设置，并在启动编译批次前回收已不再使用的父进程数据；具体默认值和覆盖方式见[命令行](cli.md)。

全量语料结果由报告中记录的固定编译器快照与验证驱动产生。生产 CLI 的自动内存设置使用独立回归验证；这两类证据分别对应各自的执行入口与版本。复现某份历史报告时，应使用它记录的快照和执行命令；评估当前 CLI 时，应记录当前版本及实际运行结果。

## 游戏内验证

当前语料报告明确记录 `engineValidation: "not-run"`。本地解析、结构比较和 TypeScript 检查不启动 HOI4，因此不能证明所有事件、地图、UI、资源或规则在目标引擎中正常工作。

实际发布模组前，应在目标游戏版本中加载生成的模组，检查错误日志，并运行涉及的决议、事件和交互路径。报告问题时，注明游戏版本、模组依赖顺序和最小复现。这样可以区分编译器的转换错误、输入本身的问题和引擎行为差异。

## 仓库中的验证证据

仓库保留了三组本地语料的汇总报告，输入总计 19,910 个文件。所有 17,548 个可解析 PDX 文件都完成了实际的严格 TypeScript 编译、静态降级和有序结构哈希比较：

| 数据集      | 全部输入文件 | PDX 候选 | 完整编译并匹配 | 原始解析错误 |
| ----------- | -----------: | -------: | -------------: | -----------: |
| Vanilla     |        5,479 |    5,332 |          5,311 |           21 |
| Kaiserreich |        6,144 |    5,041 |          5,041 |            0 |
| TNO         |        8,287 |    7,207 |          7,196 |           11 |

32 个原始解析错误仍保留在报告中，没有计入完整编译的通过分母。这些结果绑定报告里的输入清单哈希和编译器快照。最新高层 SDK 的原生输出另有 CWTools 夹具检查；它和有序导入验证使用不同的入口与测试内容。

可追溯的详细结果见仓库中的 [语料汇总](https://github.com/maxmixalex/krieg-lang/blob/main/reports/validation/corpus-summary.json)、[完整 TypeScript 验证汇总](https://github.com/maxmixalex/krieg-lang/blob/main/reports/validation/full-typescript-summary.json) 与 [高层 SDK 原生检查](https://github.com/maxmixalex/krieg-lang/blob/main/reports/validation/sdk-native-audit-cwtools.json)。

## 报告问题

一个有用的问题报告通常包含：最小 `.krg.ts` 或原生片段、`krgconfig.json` 中相关配置、实际诊断、预期原生输出，以及 `krieg --version`。如果问题来自语料测试，附上该文件的类别、哈希和失败层即可；无需发布整个游戏目录。
