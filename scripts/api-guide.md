# API Reference

先选择你要完成的任务。每张任务参考将函数、输入 Spec、选项和返回句柄放在一起，先解释用途与写法，再连续列出完整参数和字段。所有签名由 **TypeDoc** 从当前公开入口生成，与教程共享 Zensical 导航和站内搜索。

当前版本：`{{version}}`。编写 `.krg.ts` / `.krg.tsx` 时使用 `krieg-lang/hoi4` 和 `krieg-lang/ui`；Node.js 工具使用编译器、项目或 PDX 入口。

## 按写作任务查找

| 你要完成的事                           | 从这里开始                            | 参数与字段                                                                                                                                                                                                       |
| -------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 新建事件与选项                         | [玩法指南](../typed-gameplay.md)      | [CountryEvent](reference/hoi4/functions/CountryEvent.md)、[EventSpec](reference/hoi4/interfaces/EventSpec.md)、[Option](reference/hoi4/functions/Option.md)                                                      |
| 编排分支、互斥、合流，再用句柄安排事件 | [类型化玩法图](../typed-gameplay.md)  | [FocusGraph](reference/hoi4/functions/FocusGraph.md)、[EventDefinition](reference/hoi4/interfaces/EventDefinition.md)                                                                                            |
| 在按钮、事件与决议间共享付费行动       | [共享行动指南](../recipes.md)         | [CountryAction](reference/hoi4/functions/CountryAction.md)、[CountryActionSpec](reference/hoi4/interfaces/CountryActionSpec.md)、[CountryActionDefinition](reference/hoi4/interfaces/CountryActionDefinition.md) |
| 从有限配置生成可被游戏复用的脚本       | [脚本化内容](../scripted-content.md)  | [ScriptedEffectFamily](reference/hoi4/functions/ScriptedEffectFamily.md)、[ScriptedTriggerFamily](reference/hoi4/functions/ScriptedTriggerFamily.md)                                                             |
| 用 TSX 把按钮与游戏行为绑定            | [界面与 TSX](../ui.md)                | [ScriptedWindow](reference/ui/functions/ScriptedWindow.md)、[For](reference/ui/functions/For.md)、[GuiVariable](reference/ui/functions/GuiVariable.md)                                                           |
| 复用界面样式与固定间距布局             | [样式与 Stack](../styles.md)          | [样式 API](reference/ui/styles.md)                                                                                                                                                                               |
| 从游戏原生报错回到源码                 | [排错指南](../debugging.md)           | [来源追踪 API](reference/project/debugging.md)                                                                                                                                                                   |
| 从实际地图规划一条铁路                 | [地图索引与铁路规划](../map-atlas.md) | [ProvinceAtlas](reference/root/classes/ProvinceAtlas.md)、[createRailwayOverlay](reference/root/functions/createRailwayOverlay.md)                                                                               |
| 写国策树与奖励                         | [事件、国策与决议组合](../recipes.md) | [FocusTree](reference/hoi4/functions/FocusTree.md)、[FocusSpec](reference/hoi4/interfaces/FocusSpec.md)                                                                                                          |
| 编写决议与民族精神                     | [玩法指南](../typed-gameplay.md)      | [DecisionCategory](reference/hoi4/functions/DecisionCategory.md)、[IdeaSpec](reference/hoi4/interfaces/IdeaSpec.md)                                                                                              |
| 切换国家、地区作用域                   | [作用域指南](../scopes.md)            | [CountryScope](reference/hoi4/interfaces/CountryScope.md)、[StateScope](reference/hoi4/interfaces/StateScope.md)                                                                                                 |
| 查原版 `snake_case` 命令               | [效果与条件目录](commands/index.md)   | 每个命令列出实际签名、重载、作用域和 CWT 来源                                                                                                                                                                    |
| 写人物、科技、装备、AI 或其他内容      | [领域目录](domains.md)                | 按原生输出目录定位构造器和完整 Spec                                                                                                                                                                              |
| 复用效果、条件或动态文本               | [脚本化内容](../scripted-content.md)  | [ScriptedEffect](reference/hoi4/functions/ScriptedEffect.md)、[ScriptedTrigger](reference/hoi4/functions/ScriptedTrigger.md)、[ScriptedLocalisation](reference/hoi4/functions/ScriptedLocalisation.md)           |
| 编写 TSX 组件并连接游戏行为            | [界面与 TSX](../ui.md)                | [UI 公开符号](reference/ui/index.md)、[ScriptedGuiSpec](reference/hoi4/interfaces/ScriptedGuiSpec.md)                                                                                                            |
| 覆盖 Lua Defines                       | [Defines API](defines.md)             | [命名空间与键目录](defines/namespaces.md)                                                                                                                                                                        |
| 处理国家、地区与地图                   | [国家与地图](../countries-maps.md)    | [CountryHistorySpec](reference/hoi4/interfaces/CountryHistorySpec.md)、[StateHistorySpec](reference/hoi4/interfaces/StateHistorySpec.md)                                                                         |
| 写编译与项目工具                       | [项目工作流](../projects.md)          | [compiler](reference/compiler/index.md)、[project](reference/project/index.md)、[pdx](reference/pdx/index.md)                                                                                                    |

## 如何阅读任务参考

`?` 表示可选字段。点击字段类型可继续查看对象结构；表内的小锚点支持直接链接到字段。继承字段已经包含在 Spec 的字段表里，无需自行追踪 `extends`。共享的原生字段结构用使用位置命名，例如 `TechnologySpec.aiResearchWeights fields`；这些是字段详情，不能把标题作为独立符号导入。

每个符号都有独立稳定锚点，字段锚点包含所属符号名；函数有多个调用方式时，章节分别列出每个重载。JSDoc 中的说明、`@example` 示例、参数说明和分类随源代码一起更新。每项声明都附有源码链接，可核对实现或声明的位置。

站内搜索支持 API 名称和字段名，例如 `CountryEvent`、`completionReward`、`add_political_power` 或 `START_DATE`。原生命令查找优先使用命令目录；共享结构详情通过所属字段进入，避免用内部编号猜类型。

## 公开模块

| 导入路径                    | 参考                                               |
| --------------------------- | -------------------------------------------------- |
| `krieg-lang/hoi4`           | [玩法、作用域与原生内容](reference/hoi4/index.md)  |
| `krieg-lang/ui`             | [UI / TSX 组件与属性](reference/ui/index.md)       |
| `krieg-lang/ui/jsx-runtime` | [自动 JSX 类型](reference/ui/jsx-runtime/index.md) |
| `krieg-lang/compiler`       | [编译器](reference/compiler/index.md)              |
| `krieg-lang/project`        | [项目构建与验证](reference/project/index.md)       |
| `krieg-lang/pdx`            | [有序原生语法](reference/pdx/index.md)             |
| `krieg-lang/eslint`         | [编辑器规则与配置](reference/eslint/index.md)      |
| `krieg-lang`                | [Node.js 聚合入口](reference/root/index.md)        |

动态数据目录与 CWT 快照描述已知结构和来源；具体游戏行为的验证层次见[验证与兼容性](../validation.md)，主题支持与测试证据见[功能覆盖](../coverage.md)。
