# 科技、学说、装备与部队

这些领域组成一条引用链：科技或学说提供解锁，装备定义原型和属性，部队定义使用哪些装备，历史文件决定开局已拥有的内容。改一端后要核对引用的另一端。

## 对象与原生位置

| 对象               | 构造器入口                                       | 原生位置 / 关联                                                           |
| ------------------ | ------------------------------------------------ | ------------------------------------------------------------------------- |
| 科技、共享加成     | `Technology`、`TechnologySharingGroup`           | `common/technologies/`、`common/technology_sharing/`                      |
| 学说、子学说与轨道 | `DoctrineFolder`、`Subdoctrine`、`DoctrineTrack` | 查询[科技 API](../../api/reference/domains/technology.md)中的当前输出路径 |
| 装备与模块         | `Equipment`、`EquipmentGroup`、`EquipmentModule` | `common/units/equipment/` 及模块规则                                      |
| 单位与战术         | `Unit`、`CombatTactic`                           | 单位类别、装备需求、可用条件                                              |
| 开局编制与单位     | `UnitHistory`                                    | `history/units/`；师模板中的重复兵种不能合并                              |

完整字段见[装备 API](../../api/reference/domains/equipment.md)与[单位 API](../../api/reference/domains/units.md)。领域构造器做当前 CWT 投射的结构检查；实际解锁效果、科技布局和版本行为仍需目标游戏验收。

## 科技与每日挂钩 {#technology-example}

命名构造器使用 `id` 确定原生对象，默认输出目录由领域决定。需要覆盖已有文件时使用 `outputPath`；科技自身的原生 `path` 字段仍表示科技连线，不作为输出文件名。

<!-- example:compile -->

```typescript
import { Technology, OnAction, type CountryScope } from "krieg-lang/hoi4";

Technology({
  id: "tutorial_workshop_methods",
  researchCost: 0.5,
  startYear: 1936,
  categories: ["industry"],
  folder: [{ name: "industry_folder", position: { x: 0, y: 8 } }],
  onResearchComplete: (country: CountryScope) => {
    country.effects.setCountryFlag("tutorial_methods_ready");
    country.effects.addPoliticalPower(5);
  },
});

OnAction({
  id: "on_daily",
  effect: [
    (country: CountryScope) => {
      if (country.triggers.hasCountryFlag("tutorial_methods_ready")) {
        country.effects.setCountryFlag("tutorial_workshop_day_seen");
      }
    },
  ],
});
```

`OnAction` 的钩子名决定回调作用域：例如每日国家挂钩与全局开局挂钩不是同一作用域。重复原生块由数组表示，不会合并同名字段。科技还需要对应本地化、图标和适合实际科技树的布局；示例中的固定坐标应按你的目标模组调整。

## 布局、引用与验收

科技的原生 `path` 表示科技连线，构造器的 `outputPath` 才是输出文件路径。科技 ID、分类和目录必须与目标科技树一致，并配套标题、描述、图标与坐标。`OnAction` 的钩子名决定作用域；每日国家挂钩和全局开局挂钩不能互换回调。

检查装备原型、科技解锁、单位所需装备与开局库存是否一致。部队编制的多个同名兵种位置应保留数组/有序条目；复杂迁移可查[有序 PDX](../native-import.md)。
