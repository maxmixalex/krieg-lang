# 用 TypeScript 编写 HOI4 模组

Krieg 是一个静态编译语言和模组项目工具。源文件使用 `.krg.ts` 或界面用的 `.krg.tsx` 扩展名，可从组件导入 `.krg.css` 样式模块，语法属于 TypeScript 的严格子集；输出是游戏读取的 Paradox 脚本、本地化与资源文件。

如果你写过 HOI4 脚本，可以把事件、国策、效果和作用域当作熟悉的游戏概念来使用。TypeScript 提供编辑时的类型检查、跳转和补全，Krieg 负责把这些有类型的表达式翻译成原生脚本。

## 从一个事件开始

```typescript
import { CountryEvent, type CountryScope } from "krieg-lang/hoi4";

CountryEvent({
  id: "tutorial.1",
  hidden: true,
  isTriggeredOnly: true,
  immediate: (country: CountryScope) => {
    country.effects.addPoliticalPower(25);
  },
});
```

`CountryEvent` 描述一个事件；`CountryScope` 表示回调中的当前国家。`addPoliticalPower(25)` 会被编译为 `add_political_power = 25`。编译器读取这些函数调用的结构，不会在 Node.js 中运行它们。

准备实际创建模组时，直接阅读[第一个模组](getting-started.md)。那一页从安装工具开始，一直到检查生成的输出。

## 文档怎么读

| 你的目标                          | 从这里开始                            |
| --------------------------------- | ------------------------------------- |
| 跑通第一个项目                    | [第一个模组](getting-started.md)      |
| 配置补全、类型检查与格式化        | [编辑器与格式化](editor.md)           |
| 理解 `if`、变量和辅助函数         | [语言与执行模型](language.md)         |
| 写作用域切换、国策或事件条件      | [作用域、条件与效果](scopes.md)       |
| 管理图片、本地化和可复用模块      | [项目、资源与依赖](projects.md)       |
| 迁移现有 Paradox 脚本             | [导入原生脚本](native-import.md)      |
| 将玩法拆成事件、国策与决议        | [玩法组合](recipes.md)                |
| 从分支、合流和互斥关系生成国策树  | [国策图与事件调度](typed-gameplay.md) |
| 按状态选择文本或使用 meta effect  | [脚本化内容](scripted-content.md)     |
| 用 TSX 编写界面并连接游戏行为     | [界面与 TSX](ui.md)                   |
| 创建国家、修改地区与地图          | [国家与地图](countries-maps.md)       |
| 按地区查省份、用途经点规划铁路    | [地图索引与铁路规划](map-atlas.md)    |
| 写 YAML 翻译或保留原生本地化      | [本地化](localisation.md)             |
| 从完整原版 / Kaiserreich 项目学习 | [完整示例](examples.md)               |
| 查精确签名、继承字段与命令作用域  | [按任务查找 API](api/index.md)        |
| 核对 Wiki 主题与实际支持层次      | [功能覆盖](coverage.md)               |
| 判断某次检查到底证明了什么        | [验证与兼容性](validation.md)         |

API Reference 由 TypeDoc 生成，并按编写任务把构造器、输入类型和返回句柄组合在同一页。先读用途说明与示例，再查精确签名和字段；API 名、字段名和原生命令均进入站内搜索，旧符号链接会跳转到当前参考位置。

写国策时，先看[节点条件与关系图](typed-gameplay.md)；给界面排版，用[静态样式与布局](styles.md)。同一个玩法同时出现在事件、按钮和决议时，可以用[共享行动](recipes.md)统一资格、费用与奖励。游戏日志只给出原生文件行号时，用[源码定位](debugging.md)找到应该改的那行。

## 内容入口与检查层次

新内容通常使用事件、国策和效果等语义 API。它们能表达游戏概念，也能提供更准确的作用域和参数类型。

按固定 CWT 快照生成的领域构造器提供科技、人物、装备、AI、军工组织等内容的类型与原生结构检查，完整字段和原始规则位置见 [领域 API](api/domains.md)。这些构造器的投射边界会单独公开，不等价于游戏引擎实现。

结构明确、尚未专门建模的数据文件可以使用 `DataFile`，把有类型的标量、记录和数组写成原生结构。这一入口检查数据形状，具体游戏字段的含义仍需调用者确认。

已有内容可以使用有序 PDX 表示。这种表示直接描述键、运算符、值与条目顺序，能够保留同名键和复杂嵌套。它适合迁移、暂未建模的结构，以及需要逐项控制原生输出的文件。它的边界和语义 API 不同，详见[导入原生脚本](native-import.md)。

## 当前版本的边界

Krieg 不执行源文件中的 JavaScript。不能通过 `fetch`、`node:fs` 或任意 npm 库在编译期间运行代码，也不能使用 `any` 绕过类型检查。需要这类处理时，在独立的构建脚本里预先生成数据，再让 Krieg 编译明确的输入。

CWT 提供命令和作用域元数据，测试会检查编译结果与原生语法。最终的事件触发、界面布局和游戏规则仍需要在目标 HOI4 版本中验证。遇到支持范围的问题时，请先阅读[验证与兼容性](validation.md)，再携带最小复现提交问题。
