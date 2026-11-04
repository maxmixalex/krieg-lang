# 人物、领袖与特质

人物定义、国家历史中的招募、角色特质和肖像是四类独立内容。新人物能通过结构检查，不表示已被分配到任何国家或会出现在游戏界面。

## 内容关系

| 内容         | 入口                 | 原生位置 / 核对对象                             |
| ------------ | -------------------- | ----------------------------------------------- |
| 人物与角色   | `Character`          | `common/characters/`；人物 ID、国家、角色定义   |
| 国家领袖特质 | `CountryLeaderTrait` | `common/country_leader/`；意识形态与国家修正    |
| 将领特质     | `UnitLeaderTrait`    | `common/unit_leader/`；军种、可获得性与特质路径 |
| 科学家特质   | `ScientistTrait`     | 特殊项目系统的角色与当前规则                    |
| 肖像         | `Portrait`           | `portraits/` 与图形资源                         |
| 开局招募     | `CountryHistory`     | `history/countries/`；引用实际人物 ID           |

参数与原生字段见[人物 API](../../api/reference/domains/characters.md)。国家历史关联见[国家手册](../countries-maps.md)，肖像字节与 sprite 关联见[资源手册](../assets.md)。

## 定义与接线

先决定人物 ID 和角色，再声明肖像、特质、可用条件；最后在国家历史或明确效果中招募。同一个人物的政治角色和军事角色应按其各自字段填写。保持稳定 ID，使事件、顾问可见条件和历史文件指向同一对象。

以[原版完整项目](../../ports/complete-examples.md)中的 `country.krg.ts` 为整体对照：国家标签、人物和开局历史在一个可构建项目里共同存在。仅查看单个 Spec 无法证明这些跨文件关系已接通。

## 定义领袖并提供招募入口

将下面的声明放在一个 `.krg.ts` 文件中。`Character` 生成角色定义，`recruitLeader` 可以从目标国家的历史、事件或国策奖励中调用。

<!-- example:compile -->

```typescript
import { Character, ScriptedEffect } from "krieg-lang/hoi4";

Character({
  id: "reconstruction_valenti",
  name: "reconstruction_valenti",
  gender: "female",
  countryLeader: [{ ideology: "liberalism", traits: [], expire: "1965.1.1.1" }],
});

export const recruitLeader = ScriptedEffect("recruit_reconstruction_leader", (country) => {
  country.effects.recruit_character("reconstruction_valenti");
});
```

在国家效果里使用 `country.run(recruitLeader)`，然后检查 `common/characters/` 的 ID 与招募效果完全一致。`name` 对应本地化键。`liberalism` 必须存在于目标模组的意识形态定义，领袖的实际启用还取决于国家政治状态。肖像可通过 `portraits.civilian.large` 指向已注册 sprite，完整接线见原版示例的 `country.krg.ts` 和资源配置。

## 验收

结构检查后，再核对角色是否出现于正确国家、肖像能否加载、特质是否作用于正确对象、重复招募与读档行为。修改国家领袖时也要检查对应的意识形态与开局政治设置。规则来源与当前支持证据见[覆盖清单](../../coverage.md)。
