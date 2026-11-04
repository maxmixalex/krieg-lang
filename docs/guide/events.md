# 事件、选项与调度

事件负责在游戏中执行立即效果、显示文本并提供选项。国家/新闻事件与地区事件的接收作用域不同。要完整创建并构建一个事件，按[事件教程](../tutorials/event-and-localisation.md)操作；本页用于核对字段职责、ID 和调度语义。

## 事件结构

| 部分                    | 职责                             | 常见误用                                    |
| ----------------------- | -------------------------------- | ------------------------------------------- |
| `id`                    | 稳定事件身份，命名空间加数字后缀 | 只改前导零并不能创建另一个数字身份          |
| `trigger`               | 游戏检查的触发条件               | 不能代替 `isTriggeredOnly` 的显式调度选择   |
| `immediate`             | 事件触发时立即执行的效果         | 不要把选择后才该结算的奖励提前放在这里      |
| `options`               | 保留顺序的选项、选项条件和效果   | `name` 是本地化键；缺失文本不会自动生成译文 |
| `title` / `description` | 玩家文本的键                     | 实际文本放入项目本地化输入                  |
| `hidden`                | 隐藏事件的展示                   | 仍需正确的触发或调用路径                    |

每个事件只能有一份有效定义。语义构造器适合常见事件；特殊领袖/特工事件和完整原生字段可从[领域入口](domains/index.md#_4)进入。签名、可选字段和返回类型集中在[事件 API](../api/reference/hoi4/events.md)。

## 调度与接收作用域 {#scheduling}

<!-- example:compile -->

```typescript
import { CountryEvent, StateEvent, ScriptedEffect, state } from "krieg-lang/hoi4";

export const report = CountryEvent({
  id: "harbour.1",
  hidden: true,
  isTriggeredOnly: true,
  immediate: (country) => country.schedule(followup, { days: 2 }),
});

export const followup = CountryEvent({
  id: "harbour.2",
  hidden: true,
  isTriggeredOnly: true,
  immediate: (country) => country.effects.addStability(0.02),
});

export const inspection = StateEvent({
  id: "harbour.3",
  hidden: true,
  isTriggeredOnly: true,
  immediate: (location) => location.effects.addManpower(100),
});

export const launch = ScriptedEffect("launch_inspection", (country) => {
  country.schedule(report, { days: 1 });
  country.state(state(1), (location) => location.schedule(inspection));
});
```

`CountryEvent` 和 `NewsEvent` 返回 `EventDefinition<"country", ID>`，`StateEvent` 返回 `EventDefinition<"state", ID>`。因此 `country.schedule(inspection)`、`location.schedule(report)`、传入 Idea 句柄或手写 `{ id: "harbour.1" }` 都不能通过普通 TypeScript 检查。国家作用域只显示国家操作，州作用域只显示州操作。

| 调度字段                     | 原生输出与含义                                                 |
| ---------------------------- | -------------------------------------------------------------- |
| `hours` / `days` / `months`  | 固定延时，所有字段相加；游戏按每月 30 天计算                   |
| `randomHours` / `randomDays` | 对应 `random_hours` / `random_days`，额外随机量从 0 到指定上限 |
| 省略延时                     | 立即发送事件                                                   |

数值必须是非负、静态、安全整数。编译器拒绝负数、小数及游戏运行时变量，而不把它们伪装成静态时间。调度本身不会修改事件的 `isTriggeredOnly`：需要仅由效果发送的事件，应显式设置该字段。延时事件在投递时重新检查事件 trigger；接收国家尚不存在时，延时计时会暂停。

前向引用、跨模块事件链和有延时的循环链都能编译。编译器先保存事件身份，再翻译回调；调度生成事件 ID 调用，不内联事件内容，因此不会把游戏运行时循环展开成编译时递归。是否应该循环、何时停止仍由你的玩法条件决定。捕获祖先作用域后调用 `schedule` 或国策句柄操作，会按已有作用域规则生成 `PREV` / `PREV.PREV`。

事件 ID 使用字面量泛型检查最后一个点之后的十进制数字串，支持点分命名空间和前导零。原版的 `SEA_japan_air_accidents_events.01`、KR 的 `japan_legations_crisis_events.000` 与 `UPC.chinademocraticleague.001` 都保留原拼写；负号、十六进制和指数形式在普通 TypeScript 中被拒绝。编译器再检查命名空间字符，并按数字身份识别重复事件：`example.1` 和 `example.001` 会发生冲突。大于 99999 的后缀与游戏保持兼容，但给出 `KRG2609` 警告，因为它会越过命名空间的内部 ID 分配区间。语义事件与国策声明在同一次编译中不能重复 ID；这不是对所有已安装模组或独立编译入口的全局冲突扫描。

原有 `effects.country_event`、`effects.countryEvent` 和原生数据字段仍可接收字符串，以便引用原版或其他模组已有内容。这些字符串不会获得新句柄的接收作用域检查；新编写的语义事件优先通过 `schedule` 组合。

## 验收与关联主题

核对事件输出中的命名空间、ID、选项顺序与调度延时，再在目标游戏中检查实际接收者、投递时的条件以及读档后的事件链。重复循环应有明确停止条件。[国策](focuses.md)和[决议/行动](actions.md)都可以保存并调度事件句柄；文本规则见[本地化](localisation.md)。
