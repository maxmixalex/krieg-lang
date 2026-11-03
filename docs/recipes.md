# 从玩法目标组织事件、国策与决议

把一个玩法拆成状态、入口、条件、结算和文本，通常比按文件类型逐个添加代码更容易维护。下面用“完成重建国策后，允许国家支付 25 政治点购买一次应急援助”贯穿事件、国策、决议与 GUI。各段标注了所属文件，按 [模块规则](language.md) 导入同一个行动，无需在每个入口重写费用和条件。

## 一次定义资格、费用和结算

```typescript
// src/aid.krg.ts
import { CountryAction } from "krieg-lang/hoi4";

export const emergencyAid = CountryAction("emergency_aid", {
  politicalPowerCost: 25,
  available: (country) =>
    country.triggers.hasCountryFlag("reconstruction_authorized") &&
    !country.triggers.hasCountryFlag("aid_received"),
  perform: (country) => {
    country.effects.addStability(0.05);
    country.effects.setCountryFlag("aid_received");
  },
});
```

`reconstruction_authorized` 表示解锁，`aid_received` 防止重复购买。`available` 只需描述玩法资格；政治点是否足够由 `politicalPowerCost` 统一决定。`perform` 描述购买成功后的结算，本次价格由行动接入方式收取，因此这里不再扣除 25 政治点。

`CountryAction` 的两个回调都推导为 `CountryScope`。费用必须是编译期可求值的非负安全整数；`0` 可用于免费行动。标识符必须以 ASCII 字母或下划线开头，后续可包含数字。声明产生共享的具名触发器与效果，其他文件只需要导入行动句柄。

## 国策负责解锁

```typescript
// src/focuses.krg.ts
import { FocusGraph } from "krieg-lang/hoi4";

FocusGraph({
  id: "reconstruction_tree",
  prefix: "reconstruction",
  country: (country) => country.triggers.hasCountryFlag("uses_reconstruction_tree"),
  nodes: {
    authorize: {
      cost: 5,
      completionReward: (country) => {
        country.effects.setCountryFlag("reconstruction_authorized");
      },
    },
    expand: {
      requires: (focus) => focus.authorize,
      cost: 5,
      completionReward: (country) => {
        country.effects.addStability(0.05);
      },
    },
  },
});
```

`country` 描述树的国家选择条件；项目须在适当的国家历史或效果中设置相应标记。`requires` 选择当前图内的国策，编辑器会提供补全并检查拼写。这里生成 `reconstruction_authorize` 与 `reconstruction_expand` 两个稳定 ID，以及后者对前者的原生前置关系。更复杂的分支可使用 `all`、`any` 与 `exclusiveWith`，见 [类型化玩法](typed-gameplay.md)。

为国策准备 ID 同名的标题键、`<ID>_desc` 描述和所需图标。缺少图形或译文并不会改变奖励逻辑，但会破坏玩家界面的可读性。完整资源接线见 [完整示例](examples.md)。

## 决议绑定行动，由游戏收取价格

```typescript
// src/decisions.krg.ts
import { DecisionCategory } from "krieg-lang/hoi4";
import { emergencyAid } from "./aid.krg.js";

DecisionCategory({
  id: "reconstruction_decisions",
  visible: (country) => country.triggers.hasCountryFlag("reconstruction_authorized"),
  decisions: [
    {
      id: "request_emergency_aid",
      action: emergencyAid,
      aiWillDo: 1,
    },
  ],
});
```

绑定 `action` 后，决议不能同时指定 `cost`、`available` 或 `completeEffect`；这些字段由行动统一提供，类型检查和编译器都会检查冲突。此处生成的关键原生内容是：

```text
request_emergency_aid = {
    cost = 25
    available = { emergency_aid_eligible = yes }
    complete_effect = { emergency_aid_perform = yes }
    ai_will_do = { factor = 1 }
}
```

普通国家决议通过原生 `cost` 收费。`complete_effect` 只调用共享结算：政治点刚好为 25 的国家仍能在支付后获得援助，不会因为余额已经变为 0 而再次被费用条件阻挡，也不会重复扣款。

`visible` 决定是否展示；行动的资格决定能否执行。`daysRemove`、`daysReEnable`、`removeEffect` 等字段仍属于决议本身。行动不会自动添加冷却、退款或一次性限制；本例通过结算中的 `aid_received` 标记保证一次性购买。任务、目标决议和自定义资源费用使用相应原生领域 API，见 [内容定义](content-domains.md)。

## GUI 按钮绑定同一个行动

```tsx
// src/panel.krg.tsx
import { ScriptedWindow } from "krieg-lang/ui";
import { emergencyAid } from "./aid.krg.js";

ScriptedWindow(
  {
    name: "reconstruction_panel",
    path: "interface/reconstruction.gui",
    context: "player_context",
    parentWindowToken: "politics_tab",
    visible: (country) => country.triggers.hasCountryFlag("reconstruction_authorized"),
  },
  (ui) => (
    <ui.Container name="reconstruction_window" size={{ width: 300, height: 100 }}>
      <ui.Button
        name="request_aid"
        position={{ x: 20, y: 20 }}
        size={{ width: 240, height: 40 }}
        text="request_emergency_aid"
        action={emergencyAid}
      />
    </ui.Container>
  ),
);
```

`action` 自动接上按钮的可用条件和点击效果，与 `click`、`enabled` 互斥。按钮只有在资格与余额都满足时才可用；点击时生成的原生效果还会再次检查两者。即使显示按钮后国家余额或标记已经变化，也不会无条件扣款或发放奖励。

行动按钮要求国家作用域的 `ScriptedWindow`。在省份窗口等其他作用域中，应通过显式国家选择调用行动的国家效果。布局、精灵和文本配置仍使用 [UI API](ui.md)；`CountryAction` 不会自动创建这些资源。

## 事件与其他效果复用安全执行句柄

```typescript
// src/events.krg.ts
import { CountryEvent } from "krieg-lang/hoi4";
import { emergencyAid } from "./aid.krg.js";

CountryEvent({
  id: "reconstruction.1",
  title: "reconstruction.1.t",
  description: "reconstruction.1.d",
  isTriggeredOnly: true,
  options: [
    {
      name: "reconstruction.1.a",
      trigger: (country) => country.test(emergencyAid.available),
      effects: (country) => country.run(emergencyAid.execute),
    },
    {
      name: "reconstruction.1.b",
      effects: (country) => country.effects.addPoliticalPower(10),
    },
  ],
});
```

`emergencyAid.available` 是包含资格与余额的国家触发器句柄，`emergencyAid.execute` 是安全支付的国家效果句柄。两者沿用已有的 `country.test` 和 `country.run`，可用于事件、脚本化效果及低层 `ScriptedGui`。后者始终在执行时重检；事件选项的 `trigger` 仅负责展示选择。

带价格的执行路径如下。只有 `limit` 满足时才收取一次价格并结算，余额恰好等于价格也满足条件：

```text
emergency_aid_available = {
    emergency_aid_eligible = yes
    NOT = { has_political_power < 25 }
}
emergency_aid_execute = {
    if = {
        limit = { emergency_aid_available = yes }
        add_political_power = -25
        emergency_aid_perform = yes
    }
}
```

购买成功后才应该发生的效果应全部写在 `perform` 中。`country.run(emergencyAid.execute)` 是无返回值的效果调用；在它后面另写的效果不会自动成为购买事务的一部分。句柄也不会自动安排事件；本例的 `isTriggeredOnly` 仍需要通过 `country.schedule(eventHandle, delay)` 或原生命令主动触发事件。

## 使用民族精神持续提供修正

`Idea` 适合把持续修正声明为命名内容，再由 `perform` 添加或移除。稳定性、政治点数增长等字段是国家修正名；不能将任意效果名当作修正名。动态修正、意见修正、自定义修正定义和领袖特质分别有不同的原生用途，查阅 [领域定义](content-domains.md) 与 [Idea API](api/hoi4.md#idea)。

设计时写清修正的生命周期：何时添加、何时移除、是否可重复添加、读档后是否仍与标记一致。使用变量的动态修正还应验证游戏的刷新时机。

## 对照原生输出验收

| 入口                                | 展示或可用条件                               | 收费位置           | 成功结算                             |
| ----------------------------------- | -------------------------------------------- | ------------------ | ------------------------------------ |
| `ui.Button action={emergencyAid}`   | 资格与足够政治点                             | 点击时的 `execute` | 共享 `perform`                       |
| `country.run(emergencyAid.execute)` | 可用 `.available` 提供展示条件；执行始终重检 | 原生 `if/limit` 内 | 共享 `perform`                       |
| 决议 `action: emergencyAid`         | 共享资格，游戏检查原生价格                   | 游戏的 `cost`      | `complete_effect` 调用共享 `perform` |

共享输出位于 `common/scripted_triggers/krieg_emergency_aid_action.txt` 与 `common/scripted_effects/krieg_emergency_aid_action.txt`。`emergency_aid_eligible`、`emergency_aid_available`、`emergency_aid_perform`、`emergency_aid_execute` 是行动生成并保留的原生名称，其他声明重用这些名称会报错。源码中的回调只经过静态编译，不会作为 JavaScript 执行。

先用 `krieg check` 检查类型、作用域和项目引用，再用 `krieg build` 查看输出。检查国策前置、决议扣费位置、事件选项顺序以及标记和文本键。至少验证政治点 24、25、26 三个边界，点击前资格变化，成功后重复点击，以及决议与按钮先后购买同一行动。最后在游戏中验证可见性、刷新时机、结算和保存／载入；编译与原生脚本检查不能替代游戏验收。

完整示例保留原玩法：Vanilla 示例在按钮上直接绑定免费债券行动；Kaiserreich 示例通过 `.available`／`.execute` 展示较低层的接线。两者的付费投资和代表团决议都绑定行动，国策原有的直接奖励仍保持独立。

原生主题入口：[Event modding](https://hoi4.paradoxwikis.com/Event_modding)、[National focus modding](https://hoi4.paradoxwikis.com/National_focus_modding)、[Decision modding](https://hoi4.paradoxwikis.com/Decision_modding)、[Idea modding](https://hoi4.paradoxwikis.com/Idea_modding)。
