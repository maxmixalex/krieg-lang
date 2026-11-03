# 带类型的玩法图与事件调度

`FocusGraph` 从节点和玩法关系生成完整国策树；`scope.schedule(event, delay)` 接受有接收作用域的事件句柄。两者直接从普通 TypeScript 推导类型，支持跨 `.krg.ts` 模块复用，编辑器不需要专用语言服务器。

本轮审计发现，原有 `FocusTree` 的前置和互斥关系均为字符串，`CountryEvent`、`StateEvent`、`Idea` 又都返回相同的 `IdentifiedDefinition`。这使拼错国策 ID、漏写反向互斥关系和将州事件作为国家事件使用的问题难以在编辑器发现。新增 API 将这些关系作为玩法概念建模。

## 国策图

```typescript
import { CountryEvent, DecisionCategory, FocusGraph } from "krieg-lang/hoi4";

export const report = CountryEvent({
  id: "reconstruction.1",
  hidden: true,
  isTriggeredOnly: true,
  immediate: (country) => country.effects.addPoliticalPower(50),
});

export const reconstruction = FocusGraph({
  id: "reconstruction_tree",
  prefix: "REC",
  nodes: {
    charter: { cost: 3 },
    industry: { cost: 5 },
    relief: { cost: 5 },
    assembly: {
      cost: 5,
      completionReward: (country) => country.schedule(report, { hours: 6, randomHours: 3 }),
    },
  },
  sequences: [
    ["charter", "industry"],
    ["charter", "relief"],
  ],
  choices: [["industry", "relief"]],
  joins: [{ to: "assembly", any: ["industry", "relief"] }],
});

export const decisions = DecisionCategory({
  id: "REC_administration",
  decisions: [
    {
      id: "REC_review",
      cost: 25,
      available: (country) => country.hasCompletedFocus(reconstruction.focuses.assembly),
      completeEffect: (country) => country.schedule(report, { days: 1 }),
    },
  ],
});
```

`nodes` 的键决定补全候选。上例中的 `sequences`、`choices`、`joins.to`、`joins.any` 以及 `reconstruction.focuses` 只接受 `charter`、`industry`、`relief`、`assembly`；拼成 `industries` 会直接得到 TypeScript 错误。`NoInfer` 阻止关系中的拼写错误反过来扩充合法节点集合。不要将节点声明成 `Record<string, FocusNodeSpec>`：这会丢失精确键名，API 会拒绝它。可以使用对象展开和 `satisfies Record<string, FocusNodeSpec>` 复用节点，同时保留实际键名。

| 玩法关系                                | 生成的原生语义                                                      |
| --------------------------------------- | ------------------------------------------------------------------- |
| `sequences: [["a", "b", "c"]]`          | b 以前置 a 解锁，c 以前置 b 解锁                                    |
| `joins: [{ to: "c", all: ["a", "b"] }]` | c 包含两个 `prerequisite` 块，必须同时完成 a、b                     |
| `joins: [{ to: "c", any: ["a", "b"] }]` | c 包含一个有两个 `focus` 条目的 `prerequisite` 块，完成任意一个即可 |
| `choices: [["a", "b", "c"]]`            | 每一对节点都生成双向 `mutually_exclusive` 关系                      |
| 多条路径／多个 join 指向同一节点        | 不同要求以 AND 组合；相同前置组去重                                 |

生成的国策 ID 为 `${prefix}_${节点名}`，缺省前缀为树的 `id`。`reconstruction.focuses.assembly.id` 的类型是字面量 `"REC_assembly"`，改变节点顺序不会改变 ID。句柄可用于 `country.hasCompletedFocus(...)` 和 `country.completeFocus(...)`，后者生成原生 `complete_national_focus`。需要传给原生数据字段时可以取 `.id`。

默认布局按最长前置链计算行号，同一行按节点声明顺序排列，列间距为 2、行间距为 1。可以通过 `layout: { columnSpacing: 4, rowSpacing: 2 }` 调整间距，或给某节点写 `position: { x: 1, y: 2 }` 指定绝对位置。`cost` 仍是游戏的国策点数，默认通常每点七天，由 `NFocus.FOCUS_POINT_DAYS` 决定，不是固定天数。

编译器拒绝空图、自引用、前置环、重复的选择节点及按正常前置／互斥推进必然遇到的互斥死锁。先声明图的身份和句柄，再翻译回调，因此回调也能引用本图的 `focuses`。若 TypeScript 对自引用回调报告循环类型推导，给该回调标注返回类型即可，例如 `available: (country): boolean => country.hasCompletedFocus(tree.focuses.charter)`。这些检查适用于封闭、无环的本地国策图；涉及共享国策、外部前置，或依靠脚本强制完成来突破互斥结构时，继续使用 `FocusTree` 或相应原生 API。

## 事件句柄与接收作用域

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

## 示例与验证

两个完整示例的 `src/programme.krg.ts` 都已迁移到 `FocusGraph` 和事件 `schedule`：

- [原版完整示例](https://github.com/maxmixalex/krieg-lang/blob/main/examples/vanilla-complete/src/programme.krg.ts)
- [Kaiserreich 完整示例](https://github.com/maxmixalex/krieg-lang/blob/main/examples/kaiserreich-complete/src/programme.krg.ts)

迁移保留原国策 ID、位置及两条产业路径的 AND 合流。测试在 `tests/typed-gameplay.test.mjs` 中分别检查原生 PDX 的完整语义、作用域捕获、跨模块句柄、循环事件链、失败时无部分输出，以及实际消费者配置下的 `tsc --noEmit` 正负例。TypeScript LanguageService 还验证节点名、句柄属性、作用域方法、延时字段的精确补全和字面量 ID 的悬停信息。

## 离线 Wiki 审计依据

依据用户提供的 `hoi4-modding-source(1).zip`，导出时间为 2026-11-02。以下为包中 manifest 记录的页面修订；本轮未用运行游戏测试代替静态语义验证。

| 页面与修订                                                                                           | 用于确认的规则                                                                                       |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [National focus modding](https://hoi4.paradoxwikis.com/wiki/National_focus_modding)，revision 105626 | 同一前置组是 OR，不同组是 AND；互斥箭头要求双向关系；重复国策 ID 会破坏连线；cost 单位由 define 决定 |
| [Event modding](https://hoi4.paradoxwikis.com/wiki/Event_modding)，revision 102070                   | 事件数字后缀、命名空间分配、各延时字段相加、国家／新闻事件的共同接收语义、trigger 在投递时检查       |
| [Effect](https://hoi4.paradoxwikis.com/wiki/Effect)，revision 105661                                 | `complete_national_focus` 与 `unlock_national_focus` 等效果的不同用途                                |
