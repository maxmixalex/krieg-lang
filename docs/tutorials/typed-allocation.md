# 06 在两个仓库间调拨补给

沿用第 01 节创建的项目。国家的补给库存需要随存档保留，每次调拨时使用的数组只需要活到本次效果执行完毕。下面用同一份效果把前线需求限制在后方实际库存以内。

## 编写调拨效果

新建 `src/supply.krg.ts`，写入完整文件。

<!-- tutorial:file src/supply.krg.ts -->

```typescript
import { ScriptedEffect, variableState } from "krieg-lang/hoi4";

const stores = variableState("country", { rear: "supply_rear", front: "supply_front" });

const transfer = ScriptedEffect(
  "tutorial_transfer",
  { stock: "number[]", requested: "number" },
  (_country, { stock, requested }) => {
    let moved = requested;
    if (moved > stock[0]) moved = stock[0];
    stock[0] -= moved;
    stock[1] += moved;
  },
);

export const supplyFront = ScriptedEffect("tutorial_supply_front", (country) => {
  const depot = country.variables(stores);
  let stock = [depot.rear, depot.front];
  transfer(country, { stock, requested: 10 });
  depot.rear = stock[0];
  depot.front = stock[1];
});
```

`variableState` 把源码字段和存档名对应起来。输入 `depot.` 时编辑器会列出 `rear` 和 `front`。在 `transfer` 的调用处，把 `requested` 改成字符串或拼错字段名，TypeScript 会标出错误。改回正确调用后，在项目根目录运行以下命令。

```sh
npx krieg build
```

## 检查结果

构建目录的 `common/scripted_effects/` 包含 `tutorial_supply_front`。在国家作用域调用 `tutorial_supply_front = yes` 即可执行调拨。

| 调拨前（后方，前线） | 要求数量 | 调拨后（后方，前线） |
| -------------------- | -------- | -------------------- |
| 18，2                | 10       | 8，12                |
| 6，4                 | 10       | 0，10                |
| 0，5                 | 10       | 0，5                 |

在同一次执行中，`transfer` 修改调用方那份数组，两项赋值再将数量写回该国家。另一个国家使用自己的库存。全局计数器可以用 `variableState("global", ...)` 声明并直接访问其属性。

涉及三个以上参与方时，可以用 `for...of` 遍历运行时数组。TWR 的议席分配会轮流从其他党派转移席位，保留原模组的上限和分配顺序。[TWR 迁移案例](../ports/gdp.md)
