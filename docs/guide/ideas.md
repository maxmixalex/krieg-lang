# 民族精神与修正

民族精神是可添加和移除的具名内容；修正是它持续改变的数值，效果是在特定时刻执行的动作。用 `Idea` 建模常见国家民族精神，用原生 `NativeIdeas` / `IdeaCategory` 表达完整分类与字段。完整签名见[Idea API](../api/reference/hoi4/ideas.md)。

## 选择入口

| 要表达的内容             | 入口                          | 需要核对                           |
| ------------------------ | ----------------------------- | ---------------------------------- |
| 国家民族精神             | `Idea`                        | `id`、本地化、图标、添加与移除路径 |
| 原生 idea 分类和完整定义 | `IdeaCategory`、`NativeIdeas` | 原生根块、允许条件、槽位与分类     |
| 固定数值修正             | `StaticModifier`              | 修正适用对象与数值单位             |
| 依赖变量的修正           | `DynamicModifier`             | 变量所在作用域、启用条件与刷新时机 |
| 双边意见修正             | `OpinionModifier`             | 双方国家、持续时间、关系方向       |
| 自定义修正定义           | `ModifierDefinition`          | 游戏版本、显示与使用位置           |

原生领域构造器与字段在[政治领域 API](../api/reference/domains/politics.md)和[规则领域 API](../api/reference/domains/rules.md)中查询。不要把 `addPoliticalPower` 这样的效果命令当作 `modifier` 字段。

## 生命周期

`modifier` 描述持续存在时的影响，`onAdd` / `onRemove` 描述加入与移除瞬间执行的效果。先确定创建、添加、升级、替换和移除路径，再选择标记或变量记录玩法状态。反复添加同一 ID、先移除再添加、读档后状态恢复都应有确定结果。

[共享行动](actions.md)可以在成功结算中添加民族精神，[事件](events.md)和[国策](focuses.md)也可以改变其生命周期。将同一份奖励同时写进多个入口时，应确认不会重复触发。

## 添加和撤销一项重建政策

下面的完整文件定义一个每天增加政治点收入的民族精神，以及添加、撤销它的两个效果。`onAdd` 和 `onRemove` 让标记随实际民族精神同步更新。

<!-- example:compile -->

```typescript
import { Idea, ScriptedEffect } from "krieg-lang/hoi4";

Idea({
  id: "reconstruction_policy",
  modifier: { political_power_gain: 0.1 },
  onAdd: (country) => country.effects.setCountryFlag("reconstruction_policy_active"),
  onRemove: (country) => country.effects.clearCountryFlag("reconstruction_policy_active"),
});

export const adoptPolicy = ScriptedEffect("adopt_reconstruction_policy", (country) => {
  if (!country.triggers.has_idea("reconstruction_policy")) {
    country.effects.add_ideas("reconstruction_policy");
  }
});

export const repealPolicy = ScriptedEffect("repeal_reconstruction_policy", (country) => {
  country.effects.remove_ideas("reconstruction_policy");
});
```

在事件、国策或行动的国家效果中调用 `country.run(adoptPolicy)` 或 `country.run(repealPolicy)`。构建后检查 `common/ideas/` 中的持续修正，以及 `common/scripted_effects/` 中的添加和移除调用。为 `reconstruction_policy` 和 `reconstruction_policy_desc` 提供译文，图标通过 `picture` 接入项目资源。

## 验收

编译后核对原生分类、ID 与修正值；游戏中核对本地化、图标、提示中的单位、加减后的数值，以及保存/载入后的状态。动态修正额外检查刷新时机。规则快照和引擎验证的区别见[验证手册](validation.md)。
