# 用 TypeScript 编写 HOI4 模组

Krieg 是一个静态编译语言和模组项目工具。源文件使用 `.krg.ts` 扩展名，语法属于 TypeScript 的严格子集；输出是游戏读取的 Paradox 脚本、本地化与资源文件。

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

| 你的目标                     | 从这里开始                       |
| ---------------------------- | -------------------------------- |
| 跑通第一个项目               | [第一个模组](getting-started.md) |
| 配置补全、类型检查与格式化   | [编辑器与格式化](editor.md)      |
| 理解 `if`、变量和辅助函数    | [语言与执行模型](language.md)    |
| 写作用域切换、国策或事件条件 | [作用域、条件与效果](scopes.md)  |
| 管理图片、本地化和可复用模块 | [项目、资源与依赖](projects.md)  |
| 迁移现有 Paradox 脚本        | [导入原生脚本](native-import.md) |
| 判断某次检查到底证明了什么   | [验证与兼容性](validation.md)    |

## 三种内容入口

新内容通常使用事件、国策和效果等语义 API。它们能表达游戏概念，也能提供更准确的作用域和参数类型。

结构明确、尚未专门建模的数据文件可以使用 `DataFile`，把有类型的标量、记录和数组写成原生结构。这一入口检查数据形状，具体游戏字段的含义仍需调用者确认。

已有内容可以使用有序 PDX 表示。这种表示直接描述键、运算符、值与条目顺序，能够保留同名键和复杂嵌套。它适合迁移、暂未建模的结构，以及需要逐项控制原生输出的文件。它的边界和语义 API 不同，详见[导入原生脚本](native-import.md)。

## 当前版本的边界

Krieg 不执行源文件中的 JavaScript。不能通过 `fetch`、`node:fs` 或任意 npm 库在编译期间运行代码，也不能使用 `any` 绕过类型检查。需要这类处理时，在独立的构建脚本里预先生成数据，再让 Krieg 编译明确的输入。

CWT 提供命令和作用域元数据，测试会检查编译结果与原生语法。最终的事件触发、界面布局和游戏规则仍需要在目标 HOI4 版本中验证。遇到支持范围的问题时，请先阅读[验证与兼容性](validation.md)，再携带最小复现提交问题。
