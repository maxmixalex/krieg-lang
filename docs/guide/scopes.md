# 作用域、条件与效果 {#_1}

作用域决定一条命令作用于哪个游戏对象，也决定当前位置能使用哪些效果和条件。Krieg 把这个区别写进 TypeScript 类型中。国家回调使用 `CountryScope`，地区回调使用 `StateScope`；给参数标明类型后，编辑器可以提供相应 API。

SDK 为 CWT 中的作用域提供对应类型：

| 作用域标识                         | TypeScript 类型                       |
| ---------------------------------- | ------------------------------------- |
| `country`                          | `CountryScope`                        |
| `state`                            | `StateScope`                          |
| `character`                        | `CharacterScope`                      |
| `unit_leader`                      | `UnitLeaderScope`                     |
| `operative`                        | `OperativeScope`                      |
| `project`                          | `ProjectScope`                        |
| `combat`                           | `CombatScope`                         |
| `military_industrial_organization` | `MilitaryIndustrialOrganizationScope` |
| `purchase_contract`                | `PurchaseContractScope`               |
| `unit`                             | `UnitScope`                           |
| `raid`                             | `RaidScope`                           |
| `operation`                        | `OperationScope`                      |
| `any`                              | `AnyScope`                            |

例如 `ScriptedEffect(name, "character", callback)` 可以声明角色作用域的脚本化效果；回调参数需要标注 `CharacterScope`。每种类型只暴露相应 CWT 元数据允许的命令。能切换作用域的原生命令可以接受有类型的回调，或带 `limit` 与 `effects` 的结构。

## 条件回调和效果回调 {#_2}

效果回调返回 `void`，条件回调返回 `boolean`：

```typescript
import { CountryEvent, type CountryScope } from "krieg-lang/hoi4";

CountryEvent({
  id: "preparation.1",
  hidden: true,
  isTriggeredOnly: true,
  trigger: (country: CountryScope) =>
    country.triggers.hasCountryFlag("prepared") && country.politicalPower >= 50,
  immediate: (country: CountryScope) => {
    country.effects.addPoliticalPower(-50);
    country.effects.addStability(0.05);
  },
});
```

`triggers` 产生条件，`effects` 产生效果。两者不能互换。条件里调用效果、在错误作用域中调用命令，或传入错误类型的参数，都应修复后再构建。

## 切换到另一个作用域 {#_3}

国家的 `capital` 回调进入地区作用域；地区的 `owner` 回调返回其拥有者的国家作用域：

```typescript
import { ScriptedEffect, type CountryScope, type StateScope } from "krieg-lang/hoi4";

ScriptedEffect("support_capital", (country: CountryScope) => {
  country.capital((capital: StateScope) => {
    capital.effects.addManpower(1000);
    capital.owner((owner: CountryScope) => {
      owner.effects.setCountryFlag("capital_supported");
    });
  });
});
```

需要指定目标时，优先导入项目生成的引用：

```typescript
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { countries } from "@project/countries";

ScriptedEffect("support_germany", (scope: CountryScope) => {
  scope.country(countries.GER, (germany: CountryScope) => {
    germany.effects.addPoliticalPower(25);
  });
});
```

这个示例要求项目的有效世界中存在 `GER`。`countries.GER` 来自 `@project/countries`，`states[1]` 来自 `@project/states`；没有出现在项目视图中的成员会触发类型错误。SDK 也提供 `country("GER")` 与 `state(1)` 这些较低层的引用构造器，但它们的参数类型本身不枚举完整世界。不要把随意的字符串强制断言为 `CountryRef` 来绕过检查。

## 有类型的游戏变量 {#typed-variable-state}

`variableState` 用一份显式映射声明数值变量。全局变量直接作为对象属性读写，编辑器补全属性名并检查数值类型。

```typescript
import { ScriptedEffect, ScriptedTrigger, variableState } from "krieg-lang/hoi4";

export const uno = variableState("global", { dealing: "ku_dealing" });
const playerState = variableState("country", { score: "ku_score" });

ScriptedTrigger("dealing_finished", (country) => uno.dealing <= 0);
ScriptedEffect("start_dealing", (country) => {
  uno.dealing = 42;
  const player = country.variables(playerState);
  player.score = 0;
  country.everyState((state) => {
    player.score += 1;
    uno.dealing -= 1;
  });
});
```

`uno.dealing` 对应 `global.ku_dealing`。国家或地区变量布局通过相应作用域的 `variables` 绑定，跨回调捕获后仍指向原来的游戏对象。映射中的原生名字必须是简单标识符。同一布局不能把两个属性映射到同一个变量。

声明布局不会初始化存档里的值。读取发生在游戏回调中，写入仅允许在效果回调中，支持 `=`、`+=`、`-=`、`*=`、`/=`、`%=` 和独立的 `++`、`--`。将属性保存为数值 `const` 会取得当前值的快照。需要直接操作原生命名路径时，可以继续使用 `variable`、`setVariable` 等 API。

## 在游戏运行时遍历 {#_4}

`everyCountry` 可以接受一个条件回调和一个效果回调：

```typescript
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";

ScriptedEffect("reward_prepared_countries", (country: CountryScope) => {
  country.everyCountry(
    (candidate: CountryScope) => candidate.triggers.hasCountryFlag("prepared"),
    (candidate: CountryScope) => {
      candidate.effects.addPoliticalPower(10);
    },
  );
});
```

这里会生成带 `limit` 的原生国家遍历块。实际遍历哪些国家由游戏运行时决定。`anyCountry` 和 `allCountries` 用于条件；国家还提供地区范围的对应 API。完整签名可以直接通过编辑器跳转到 SDK 声明查看。

## 国策 {#_5}

```typescript
import { Focus, FocusTree, type CountryScope } from "krieg-lang/hoi4";

FocusTree({
  id: "tutorial_tree",
  default: true,
  focuses: [
    Focus({
      id: "tutorial_start",
      x: 0,
      y: 0,
      cost: 10,
      completionReward: (country: CountryScope) => {
        country.effects.addPoliticalPower(50);
      },
    }),
    Focus({
      id: "tutorial_continue",
      x: 0,
      y: 1,
      cost: 10,
      prerequisites: [["tutorial_start"]],
    }),
  ],
});
```

`prerequisites` 的每个内部数组是一个“满足其中一个”的组，不同组之间需要同时满足。例如 `[["a", "b"], ["c"]]` 表示完成 `a` 或 `b`，并且完成 `c`。这种结构会保留原生脚本中多个 `prerequisite` 块的含义。

国策 ID 也是本地化键的基础。完整项目应为标题和说明提供对应文本，并为使用的图标提供可解析的资源。

## 其他定义入口 {#_6}

| 入口                                          | 主要用途                     |
| --------------------------------------------- | ---------------------------- |
| `CountryEvent`、`StateEvent`、`NewsEvent`     | 国家事件、地区事件和新闻事件 |
| `FocusTree`、`Focus`                          | 国策树与国策                 |
| `DecisionCategory`、`Decision`                | 决议分类与决议               |
| `Idea`                                        | 民族精神及其修正             |
| `ScriptedEffect`、`ScriptedTrigger`           | 国家作用域的脚本化效果与条件 |
| `StateScriptedEffect`、`StateScriptedTrigger` | 地区作用域的脚本化效果与条件 |
| `CountryHistory`、`StateHistory`              | 指定国家或地区的历史脚本     |
| `SourceFile`                                  | 写入明确路径的有序 PDX 文档  |

SDK 同时暴露经过整理的驼峰命名辅助 API 和来自 CWT 的原生命令名称。例如 `addPoliticalPower` 与 `add_political_power` 可以表达同一原生效果。复杂 CWT 参数不会随意放宽成 `any`；需要时使用有类型的 `cwt(...)` 有序块，或迁移到 `SourceFile`。具体支持程度见[验证与兼容性](validation.md)。

## 地区历史需要完整地区数据 {#_7}

`CountryHistory` 接受包含 `country`、`capital` 的完整声明对象，还可提供 `oob`、`startingTrainBuffer`、`history` 和 `path`。`history` 是国家作用域的效果回调。`StateHistory` 接受完整的地区声明，因为原生地区文件需要包含 ID、名称、人口、类型、所有者和省份列表，而不仅是一个历史效果块：

```typescript
import { StateHistory, loc, type StateScope } from "krieg-lang/hoi4";
import { countries } from "@project/countries";
import { states } from "@project/states";

StateHistory({
  state: states[1],
  name: loc("STATE_1"),
  manpower: 100000,
  category: "rural",
  provinces: [1],
  owner: countries.GER,
  cores: [countries.GER],
  history: (state: StateScope) => {
    state.effects.setStateFlag("tutorial_state");
  },
});
```

示例编号需要替换为自己地图中的有效编号，并提供对应本地化。还可以声明资源、建筑、胜利点等字段。两个历史 API 都可以用 `path` 指定需要覆盖的原生文件路径，并且都不会自动合并基础游戏中的已有历史文件。生成地区时，应通过精确文件路径或项目替换策略避免保留两个相同 ID 的地区文件。
