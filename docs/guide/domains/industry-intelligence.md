# 工业、情报与特殊项目

军工组织、情报行动和特殊项目都有自己的对象图与阶段。先确定当前游戏版本和 DLC，再核对完整对象关系；只声明一个根对象通常不足以形成可用玩法。

## 按系统拆分资料

| 系统             | 入口                                          | 必须一起核对                               |
| ---------------- | --------------------------------------------- | ------------------------------------------ |
| 工业与建筑       | `Building`、`Resource`                        | 地区/省份建筑、资源、成本与地图支持        |
| 军工组织         | `MilitaryIndustrialOrganization`、`MioPolicy` | 允许国家、装备类别、父特质、资金与解锁条件 |
| 情报机构         | `IntelligenceAgencyUpgrade`                   | 升级 ID、条件、成本与机构状态              |
| 行动             | `Operation`、`OperationPhase`                 | 准备/执行阶段、令牌、目标与效果作用域      |
| 特殊项目         | `SpecialProject`、`Specialization`            | 科研类别、设施、进度与项目奖励             |
| 原型奖励与科学家 | `PrototypeReward`、`ScientistTrait`           | 奖励类别、科学家角色与项目关联             |
| 突袭             | `Raid`、`RaidCategory`                        | 目标、设施、装备与执行环境                 |

完整定义从[工业 API](../../api/reference/domains/industry.md)、[情报 API](../../api/reference/domains/intelligence.md)、[装备 API](../../api/reference/domains/equipment.md)、[单位 API](../../api/reference/domains/units.md)进入。当前规则来源和验证边界逐项列在[覆盖清单](../../coverage.md)。

## 项目组织

将对象定义、启动条件、阶段效果、本地化和资源分别放入有明确职责的源码文件，通过稳定 ID 连接。若需要替换现有原生文件，指定确切 `outputPath` 并检查最终有效文件集合，避免旧定义和新定义同时存在。

## 把机构升级接入后续事件

下面的机构升级提供一层平民情报修正，并在完成时设置可供事件或决议读取的标记。`picture` 引用目标游戏已有的 sprite。

<!-- example:compile -->

```typescript
import { IntelligenceAgencyUpgrade, type CountryScope } from "krieg-lang/hoi4";

IntelligenceAgencyUpgrade({
  id: "reconstruction_contacts",
  branch: "branch_intelligence",
  picture: "GFX_agency_defense_department",
  available: (country: CountryScope) =>
    country.triggers.hasCountryFlag("reconstruction_authorized"),
  level: [
    {
      modifier: { entries: { civilian_intel_factor: 0.05 } },
      completeEffect: (country: CountryScope) =>
        country.effects.setCountryFlag("reconstruction_contacts_ready"),
    },
  ],
});
```

构建后检查 `common/intelligence_agency_upgrades/` 中的 `level`、`modifier` 和 `complete_effect`。其他玩法通过 `hasCountryFlag("reconstruction_contacts_ready")` 读取完成状态。为升级补齐本地化，并在配置了目标游戏与 DLC 的项目中核对图标、可用条件和升级后的状态。

## 验收

检查父子关系、阶段引用、成本和奖励是否完整。游戏中分别验证未解锁、可开始、进行中、成功、失败或取消，以及保存/载入后的状态。`supportedVersion` 只是描述符信息，不会为旧版本或缺失 DLC 提供系统实现。
