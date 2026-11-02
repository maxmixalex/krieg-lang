# 从玩法目标组织事件、国策与决议

把一个玩法拆成状态、入口、条件、结算和文本，通常比按文件类型逐个添加代码更容易维护。下面用“完成重建国策后，允许国家购买一次应急援助”贯穿事件、国策、决议和民族精神。

## 先定义状态与结算

```typescript
import { ScriptedEffect, ScriptedTrigger, type CountryScope } from "krieg-lang/hoi4";

export const aidAvailable = ScriptedTrigger(
  "aid_available",
  (country: CountryScope) =>
    country.triggers.hasCountryFlag("reconstruction_authorized") &&
    !country.triggers.hasCountryFlag("aid_received") &&
    country.politicalPower >= 25,
);

export const grantAid = ScriptedEffect("grant_aid", (country: CountryScope) => {
  country.effects.addPoliticalPower(-25);
  country.effects.addStability(0.05);
  country.effects.setCountryFlag("aid_received");
});
```

`reconstruction_authorized` 表示解锁，`aid_received` 防止重复购买。把结算放在脚本化效果中，可以让事件、决议和 GUI 都调用同一份效果；条件句柄用于共享可用性。为便于文档每段独立编译，以下示例直接写出相应条件和效果；实际项目按 [模块规则](language.md) 导入公共句柄。

## 国策负责解锁

```typescript
import { Focus, FocusTree, type CountryScope } from "krieg-lang/hoi4";

FocusTree({
  id: "reconstruction_tree",
  country: (country: CountryScope) => country.triggers.hasCountryFlag("uses_reconstruction_tree"),
  focuses: [
    Focus({
      id: "authorize_reconstruction",
      x: 0,
      y: 0,
      cost: 5,
      completionReward: (country: CountryScope) => {
        country.effects.setCountryFlag("reconstruction_authorized");
      },
    }),
    Focus({
      id: "expand_reconstruction",
      x: 0,
      y: 1,
      cost: 5,
      prerequisites: [["authorize_reconstruction"]],
      completionReward: (country: CountryScope) => {
        country.effects.addStability(0.05);
      },
    }),
  ],
});
```

`country` 描述树的国家选择条件；项目须在适当的国家历史或效果中设置相应标记。`prerequisites` 的每个内层数组是 OR 组，多个内层数组之间是 AND：`[["a", "b"], ["c"]]` 表示 `a` 或 `b` 之一完成，并且 `c` 完成。它不能扁平化成三个都必须完成或三个任选其一。

为国策准备 ID 同名的标题键、`<ID>_desc` 描述和所需图标。缺少图形或译文并不会改变奖励逻辑，但会破坏玩家界面的可读性。完整资源接线见 [完整示例](examples.md)。

## 决议负责玩家选择

```typescript
import { Decision, DecisionCategory, type CountryScope } from "krieg-lang/hoi4";

DecisionCategory({
  id: "reconstruction_decisions",
  visible: (country: CountryScope) => country.triggers.hasCountryFlag("reconstruction_authorized"),
  decisions: [
    Decision({
      id: "request_emergency_aid",
      cost: 25,
      available: (country: CountryScope) => !country.triggers.hasCountryFlag("aid_received"),
      completeEffect: (country: CountryScope) => {
        country.effects.addStability(0.05);
        country.effects.setCountryFlag("aid_received");
      },
      aiWillDo: 1,
    }),
  ],
});
```

这里 `cost: 25` 由决议系统收取，因此结算不再次扣除政治点数。若复用前面自行扣款的 `grantAid`，就必须统一费用归属，避免扣两次。这个差别应在设计共享效果时明确，而不是靠编译器猜测。

`visible` 决定何时展示，`available` 决定能否执行；完成标记使一次性奖励不会在之后再次获得。移除计时、重新启用计时和移除效果有独立字段。复杂目标决议、任务与版本特定字段见 [内容定义](content-domains.md) 和对应原生规则。

## 事件负责反馈与分支

```typescript
import { CountryEvent, Option, type CountryScope } from "krieg-lang/hoi4";

CountryEvent({
  id: "reconstruction.1",
  title: "reconstruction.1.t",
  description: "reconstruction.1.d",
  isTriggeredOnly: true,
  options: [
    Option<CountryScope>({
      name: "reconstruction.1.a",
      effects: (country: CountryScope) => {
        country.effects.addWarSupport(0.02);
      },
    }),
    Option<CountryScope>({
      name: "reconstruction.1.b",
      effects: (country: CountryScope) => {
        country.effects.addPoliticalPower(10);
      },
    }),
  ],
});
```

`isTriggeredOnly` 表示事件通过其他内容调用；你需要在目标效果中使用 `country.effects.countryEvent({ id: "reconstruction.1", days: 1 })`，或使用相应原生命令。仅定义事件不会自动给国家触发它。两个选项展示不同结算，选项顺序会保留。

## 使用民族精神持续提供修正

`Idea` 适合把持续修正声明为命名内容，再由效果添加或移除。稳定性、政治点数增长等字段是国家修正名；不能将任意效果名当作修正名。动态修正、意见修正、自定义修正定义和领袖特质分别有不同的原生用途，查阅 [领域定义](content-domains.md) 与 [Idea API](api/hoi4.md#idea)。

设计时写清修正的生命周期：何时添加、何时移除、是否可重复添加、读档后是否仍与标记一致。使用变量的动态修正还应验证游戏的刷新时机。

## 对照原生输出验收

先用 `krieg check` 检查类型、作用域和项目引用，再用 `krieg build` 查看输出。检查国策选择块和前置分组、决议扣费位置、事件命名空间与选项顺序，以及所有标记和文本键是否统一。最后在游戏内验证可见性、按钮状态、结算和保存/载入；源码能编译不替代玩法验收。

原生主题入口：[Event modding](https://hoi4.paradoxwikis.com/Event_modding)、[National focus modding](https://hoi4.paradoxwikis.com/National_focus_modding)、[Decision modding](https://hoi4.paradoxwikis.com/Decision_modding)、[Idea modding](https://hoi4.paradoxwikis.com/Idea_modding)。
