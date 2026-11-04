# 决议与共享付费行动 {#_1}

`DecisionCategory` 管理展示与决议，`CountryAction` 管理跨入口共享的资格、价格和奖励。按步骤实现完整玩法请读[国策与付费行动教程](../tutorials/focus-and-action.md)和[按钮教程](../tutorials/action-window.md)；本页用于查询收费契约与边界。

## 一次定义资格、费用和结算 {#_2}

| 字段或句柄            | 意义                                                |
| --------------------- | --------------------------------------------------- |
| `politicalPowerCost`  | 编译期可求值的非负安全整数；`0` 表示免费            |
| `available` 回调      | 玩法资格；余额由价格统一处理                        |
| `perform` 回调        | 成功后的奖励、标记与其他结算；不要在此重复扣费      |
| 返回句柄 `.available` | 包含资格与余额的国家触发器，用 `country.test` 查询  |
| 返回句柄 `.execute`   | 重检资格与余额，再扣款并结算，用 `country.run` 调用 |

两个回调推导为 `CountryScope`。行动 ID 以 ASCII 字母或下划线开头，后续可含数字。声明生成 `<id>_eligible`、`<id>_available`、`<id>_perform`、`<id>_execute` 四个保留名称；其他定义重用这些名称会报错。

## 国策负责解锁 {#_3}

国策完成奖励可设置资格标记，行动的 `available` 读取它。国策选择、前置和互斥属于[国策图](focuses.md)；行动本身不创建国策或安排事件。显示国策还需要 ID 同名标题、`<ID>_desc` 文本和相应图标。

## 决议绑定行动，由游戏收取价格 {#_4}

普通国家决议使用 `action: aid` 后，不再同时填写 `cost`、`available` 或 `completeEffect`。编译器将价格写入原生 `cost`，将资格写入 `available`，将共享结算写入 `complete_effect`。

```text
request_aid = {
    cost = 25
    available = { aid_eligible = yes }
    complete_effect = { aid_perform = yes }
}
```

游戏先按决议价格收费，因此 `complete_effect` 直接结算，余额正好为 25 也能成功，不会重复检查已被扣完的余额。`visible` 控制展示；`daysRemove`、`daysReEnable`、`removeEffect` 等生命周期字段仍属于决议。任务、目标决议和自定义资源费用使用相应[原生决议 API](../api/reference/domains/decisions.md)。

## GUI 按钮绑定同一个行动 {#gui}

国家作用域 `ScriptedWindow` 的按钮使用 `action={aid}`，与 `click`、`enabled` 互斥。可用条件检查资格与余额，点击效果调用 `.execute` 再次检查当前状态。布局、精灵、字体和文字由[界面](ui.md)及[资源](assets.md)系统提供。

其他作用域的窗口不能直接绑定国家行动；先显式切换到目标国家，再调用国家效果句柄。界面显示后余额或标记发生变化，执行时的重检仍然生效。

## 事件与其他效果复用安全执行句柄 {#_5}

事件选项可用 `trigger: c => c.test(aid.available)` 控制展示，使用 `effects: c => c.run(aid.execute)` 执行。`.execute` 无返回值；跟在调用后面的独立效果不会自动成为购买成功的一部分。成功后才该发生的效果都应写在 `perform` 中。

```text
aid_execute = {
    if = {
        limit = { aid_available = yes }
        add_political_power = -25
        aid_perform = yes
    }
}
```

行动不自动提供冷却、退款或一次性限制。一次性购买可在 `perform` 设置标记，并在资格中排除它；撤销、退款和重开必须有明确规则。

## 使用民族精神持续提供修正 {#_6}

需要持续效果时，在成功结算中添加 `Idea`，并定义何时移除。效果命令与修正字段属于不同系统，完整分类和生命周期见[民族精神与修正](ideas.md)。

## 对照原生输出验收 {#_7}

| 入口                       | 可用条件       | 收费位置           | 结算                             |
| -------------------------- | -------------- | ------------------ | -------------------------------- |
| `ui.Button action={aid}`   | 资格与余额     | 点击时 `.execute`  | 共享 `perform`                   |
| `country.run(aid.execute)` | 执行时始终重检 | 原生 `if/limit` 内 | 共享 `perform`                   |
| 决议 `action: aid`         | 资格与原生价格 | 游戏的 `cost`      | `complete_effect` 调用 `perform` |

检查输出中的扣费只有一次，验证余额 24、25、26，点击前资格变化、成功后重复点击，以及决议和按钮先后购买同一行动。游戏中的刷新与保存/载入需另行验收。完整签名集中在[行动 API](../api/reference/hoi4/actions.md)与[决议 API](../api/reference/hoi4/decisions.md)。
