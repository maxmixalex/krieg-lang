# 游戏变量、已保存的作用域和数组

效果内的 `let` 数值、算术中间值和数值快照使用编译器命名的原生临时变量。它们在同一效果链中的嵌套作用域里共享值，并由游戏在效果链结束时释放。重复执行局部数组声明会先清空对应的临时数组，再写入初始元素。

<!-- example:compile -->

```typescript
import { ScriptedEffect } from "krieg-lang/hoi4";

ScriptedEffect("summarize_scores", (country) => {
  let scores: number[] = [10, 20];
  scores.push(30);
  scores[0] += 5;

  let total = 0;
  for (const score of scores) total += score;
  if (scores.includes(30)) country.setVariable("score_total", total);

  const saved = country.numberArray("saved_scores");
  saved.length = 0;
  for (const score of scores) saved.push(score);
});
```

`let scores = [10, 20]` 可以推断数值元素。空数组需要 `number[]` 注解。`const scores: number[] = []` 同样创建临时数组，并允许修改元素。普通 `const` 数组和只读数组继续支持编译期资料表、静态变换和展开。`scope.numberArray("name")` 引用该作用域中已有的持久数值数组，修改会直接写回原生存储。

| TypeScript 写法                           | 行为                               |
| ----------------------------------------- | ---------------------------------- |
| `scores[index]`、`scores.length`          | 在运行时读取元素或长度，可用于条件 |
| `scores[index] = value`、`+=`、`-=`、`++` | 更新对应元素                       |
| `scores.push(value, other)`               | 追加数值，返回追加后的长度快照     |
| `scores.includes(value)`                  | 生成原生数组成员条件               |
| `scores.splice(index, 1, replacement)`    | 删除、插入元素，作为独立语句使用   |
| `scores.length = 0`                       | 清空数组                           |
| `for (const score of scores)`             | 遍历运行时数组，循环值为数值快照   |

运行时数组目前只支持数值元素。索引必须是有效的非负整数，访问已有元素时需保证索引小于数组长度。`splice` 的删除数量必须是非负整数常量，起点使用非负索引，返回的删除列表暂不可保存。数组绑定暂不支持整体重新赋值，`length` 只支持赋值为零。传给源代码辅助函数或参数化 scripted effect 的运行时数组按引用共享，标量参数按值快照。

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
