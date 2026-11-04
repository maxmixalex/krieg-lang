# 03：国策解锁一项付费行动

**目标：** 完成授权国策后，花 25 政治点购买一次援助。**所需资料：** [02](event-and-localisation.md) 的项目。**结果：** 国策图、决议与一组共享效果/条件；完成第二个国策会调度上一课的事件。

## 定义一次性行动

新建 `src/aid.krg.ts`：

<!-- tutorial:file src/aid.krg.ts -->

```typescript
import { CountryAction } from "krieg-lang/hoi4";

export const aid = CountryAction("tutorial_aid", {
  politicalPowerCost: 25,
  available: (country) =>
    country.triggers.hasCountryFlag("tutorial_authorized") &&
    !country.triggers.hasCountryFlag("tutorial_aid_received"),
  perform: (country) => {
    country.effects.addStability(0.05);
    country.effects.setCountryFlag("tutorial_aid_received");
  },
});
```

费用由行动声明统一提供。`perform` 只写成功后的奖励与标记。

## 用国策解锁，并接上决议

新建 `src/programme.krg.ts`：

<!-- tutorial:file src/programme.krg.ts -->

```typescript
import { country, DecisionCategory, FocusGraph } from "krieg-lang/hoi4";
import { aid } from "./aid.krg.js";
import { welcome } from "./tutorial.krg.js";

export const programme = FocusGraph({
  id: "tutorial_tree",
  prefix: "TUT",
  country: (scope) => scope.triggers.tag(country("GER")),
  nodes: {
    authorize: {
      cost: 1,
      completionReward: (scope) => {
        scope.effects.setCountryFlag("tutorial_authorized");
      },
    },
    report: {
      cost: 1,
      requires: (focus) => focus.authorize,
      completionReward: (scope) => scope.schedule(welcome, { days: 1 }),
    },
  },
});

DecisionCategory({
  id: "tutorial_office",
  visible: (scope) => scope.triggers.hasCountryFlag("tutorial_authorized"),
  decisions: [{ id: "tutorial_request_aid", action: aid }],
});
```

`.krg.js` 是 TypeScript 的相对导入写法，对应同目录 `.krg.ts`。国策输出 ID 是 `TUT_authorize` 和 `TUT_report`，后者前置由实际节点推导。这个教学树以 `GER` 为选择条件；在已有大型模组中使用时，应核对该国原有树的选择权重、加载顺序和新游戏结果。

## 补齐玩家看到的文本

用下面的完整内容替换 `localisation/tutorial.zh.json`，保留上一课三个键：

<!-- tutorial:file localisation/tutorial.zh.json -->

```json
{
  "tutorial.1.t": "新的开始",
  "tutorial.1.d": "我们已经准备好迈出下一步。",
  "tutorial.1.a": "开始行动。",
  "TUT_authorize": "批准援助",
  "TUT_authorize_desc": "允许申请一次应急援助。",
  "TUT_report": "提交报告",
  "TUT_report_desc": "于一天后安排报告事件。",
  "tutorial_office": "重建办公室",
  "tutorial_request_aid": "申请应急援助",
  "tutorial_request_aid_desc": "支付25点政治点数，提高5%稳定度。"
}
```

## 构建并核对收费路径

```sh
npx krieg check
npx krieg build
npx krieg graph --focus tutorial_tree --out tutorial-tree.mmd
```

检查 `common/national_focus/` 中 `TUT_report` 指向 `TUT_authorize`；决议文件应含 `cost = 25`。`common/scripted_triggers/` 中应有 `tutorial_aid_eligible`；`common/scripted_effects/` 中的 `tutorial_aid_perform` 设置一次性标记。决议由游戏的原生费用机制扣款，完成效果只结算奖励。

游戏验收要覆盖余额 24、25、26，以及成功后再次购买。完整规则见[行动手册](../guide/actions.md)；多路线的 AND、OR、互斥和模块组合见[国策手册](../guide/focuses.md)。下一课：[把同一个行动接到 TSX 按钮](action-window.md)。
