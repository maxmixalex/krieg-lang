# 游戏变量、已保存的作用域和数组

`for (const row of catalogue)` 处理作者写在源码中的静态资料。`scope.forRange`、`scope.whileLoop` 和 `scope.forEachValue` 处理游戏运行当时才存在的值。先分清这两类操作，就能避免把应由游戏逐日执行的逻辑展开成一份固定结果。

<!-- example:compile -->

```typescript
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";

ScriptedEffect("count_expensive_projects", (c: CountryScope) => {
  c.setVariable("expensive_projects", 0);
  c.forEachValue("project_costs", { value: "cost", index: "slot" }, (country) => {
    if (country.variable("cost") > 25) country.addVariable("expensive_projects", 1);
  });
});
```

- **持久、临时与数组。** `setVariable` 与 `setTempVariable` 对应不同的游戏存储期；同名并不表示可任意互换。`arrayAt`、`arrayLength`、`arrayInsert`、`arrayRemove`、`arraySet` 把数组、位置和值分成独立参数。平行数组的顺序和原子更新仍由玩法作者负责。
- **作用域。** `countryTarget("ROOT")`、`stateTarget("FROM.FROM")` 与 `mioTarget("PREV")` 描述不同类别。读取一个保存的组织时，进入 `militaryOrganization` 的回调；不要把组织指针当国家标签。清理地图上任意国家的标记用 `everyGlobalState`；只处理本国拥有的州才用 `everyState`。
- **数值条件。** 政治点、军种经验、工厂数等可直接使用 TypeScript 比较。`c.deployedAircraft("cas") > 400` 会在正确的原生结构里比较 size；`dateBefore`、`dateAfter`、`dateOnOrAfter` 比较游戏日期。不要用猜测的引擎变量名代替这些查询。

这些作用域和条件在[州转移](../ports/state-transfer.md)和[GDP 面板](../ports/gdp.md)中有完整的原作对照。
