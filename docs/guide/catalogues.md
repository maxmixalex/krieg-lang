# 有类型的表、成组声明与运行时查表

同一批选项要出现在按钮、事件或科研队列时，先决定**谁在选行**。作者在编译时已经知道的事实可以直接映射；玩家在游戏中选择的是运行时索引，需要生成游戏能执行的查找。

| 需求                           | 接口                                                     | 结果                                                    |
| ------------------------------ | -------------------------------------------------------- | ------------------------------------------------------- |
| 用逻辑名查静态行或派生资源     | `indexBy(rows, key, value?)`                             | 只含实际键名的只读记录；重复键报错                      |
| 按编号创建一系列声明           | `DefinitionSeries(first, count, make)`                   | 普通原生定义；回调必须返回声明，仍检查各自类型          |
| 根据游戏变量选择一条效果       | `scope.dispatchByIndex(variable, rows, apply, options?)` | 深度随行数按对数增长的原生分支树                        |
| 给外部模组已有脚本建立类型契约 | `gameScripts(scope, contract)`                           | 可传给 `run` 或 `test` 的精确作用域句柄，不重复定义脚本 |

<!-- example:compile -->

```typescript
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";

const grants = [{ technology: "basic_machine_tools" }, { technology: "construction1" }] as const;

ScriptedEffect("grant_selected_technology", (country: CountryScope) => {
  country.dispatchByIndex(
    "selected_technology",
    grants,
    (c, row) => c.grantTechnology(row.technology, { popup: true }),
    { first: 1 },
  );
});
```

默认越界不发奖励。若需复现老模组把过小／过大的值分别落在第一／最后一项的行为，可显式选择 `outOfRange: "clamp"`。区间下界包含、上界不包含；存档编号应保持稳定，不要按显示名称改变表序。单个分派支持 1–4096 项，`DefinitionSeries` 支持 1–16384 项。

`gameScripts("country", { triggers: ["politics_authorised"] })` 声明的是**既有游戏接口**：编辑器能补全 `triggers.politics_authorised`，也会拒绝把它当作效果或在州作用域调用。这个声明不安装依赖，也不证明外部模组一定定义了那个脚本；仍须配置目标版本并在实际加载组合中验证。

需要“已解锁即永久保存”的连续编号标记时，`FlagAchievements` 可创建一组成就；其 `storage` 形式还会生成将成就／游戏 flag 恢复到零基数组、并按索引标记一位的两个效果。它不负责给整个存档自动编解码。[钢琴](../ports/playable-piano.md)展示编译期索引，科研项目则同时使用游戏期分派与持久化。
