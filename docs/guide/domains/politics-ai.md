# AI、政治与外交

这些定义控制状态、可用规则和权重。条件成立、权重可计算、AI 实际采取某项行为是不同的验收层次；不要用一次编译成功推断全部战略行为。

## 按对象查询

| 领域               | 主要入口                                                | 关联和原生位置                                           |
| ------------------ | ------------------------------------------------------- | -------------------------------------------------------- |
| AI 策略与计划      | `AiStrategy`、`AiStrategyPlan`                          | 国家条件、目标对象、启用/退出条件；`common/ai_strategy*` |
| AI 国策与装备选择  | `AiFocus`、`AiEquipmentDesignGroup`                     | 当前国策 ID、装备分类与生产目标                          |
| 意识形态与国家规则 | `Ideology`、`GameRule`                                  | 政治分类、开局设置与可用选项                             |
| 自治与权力平衡     | `AutonomyState`、`BalanceOfPower`                       | 初始化、区间、阈值与改变它们的效果                       |
| 阵营模板与规则     | `FactionTemplate`、`FactionRule`、`FactionGoal`         | 阵营成员、条件与目标                                     |
| 和平会议与战争目标 | `PeaceActionCategory`、`PeaceActionModifier`、`Wargoal` | 行动类别、成本修正、目标与适用战争                       |

完整字段分别在[AI](../../api/reference/domains/ai.md)、[政治](../../api/reference/domains/politics.md)和[阵营外交](../../api/reference/domains/factions.md)参考。每个构造器页保留原生路径和 CWT 来源。

## 规则与权重

给每一项策略写清目标、开始条件和结束条件。权重是游戏选择中的输入，不能当作必然执行的命令。引用外部国家、地区或国策时使用当前[有效世界](../projects.md#_2)核对；新增政治状态需要明确初始化路径。

## 用玩法标记启用科研计划

这份计划把适用国家、启用条件和工业科研权重放在同一个定义中。它适合与设置 `reconstruction_authorized` 的国策奖励配合。

<!-- example:compile -->

```typescript
import { AiStrategyPlan, country, type CountryScope } from "krieg-lang/hoi4";

AiStrategyPlan({
  id: "reconstruction_industry_plan",
  name: "reconstruction_industry_plan",
  desc: "reconstruction_industry_plan_desc",
  allowed: (scope: CountryScope) => scope.triggers.tag(country("GER")),
  enable: (scope: CountryScope) => scope.triggers.hasCountryFlag("reconstruction_authorized"),
  research: { industry: 1.5 },
  weight: { base: 1 },
});
```

项目世界需包含 `GER`，并为名称和描述补齐本地化。构建后在 `common/ai_strategy_plans/` 核对 `allowed`、`enable` 和 `research` 三个原生块。`industry = 1.5` 参与 AI 科研偏好计算，实际选择还受可研究科技和其他策略影响。需要随玩法阶段退出时，在同一计划中按 API 字段配置 `abort`，并用对应游戏状态验收退出路径。

## 验收

核对生成 ID、原生目录、条件作用域及外部引用，再在目标版本、DLC 和加载顺序下观察实际行为。测试边界包括条件从不满足到满足、目标对象消失、重复激活和保存/载入。持续修正应另外核对[民族精神与修正](../ideas.md)的生命周期。
