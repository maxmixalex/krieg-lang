# 04：用 TSX 连接同一个行动

**目标：** 在政治窗口中增加一个援助按钮，复用上一课的资格、价格和奖励。**所需资料：** [03](focus-and-action.md) 的项目。**结果：** 一份 `.gui` 布局和自动匹配控件名称的 Scripted GUI。

## 声明布局与行为

新建 `src/panel.krg.tsx`：

<!-- tutorial:file src/panel.krg.tsx -->

```tsx
import { ScriptedWindow } from "krieg-lang/ui";
import { aid } from "./aid.krg.js";

ScriptedWindow(
  {
    name: "tutorial_panel",
    path: "interface/tutorial.gui",
    context: "player_context",
    parentWindowToken: "politics_tab",
    visible: (country) => country.triggers.hasCountryFlag("tutorial_authorized"),
  },
  (ui) => (
    <ui.Container
      name="tutorial_window"
      position={{ x: 20, y: 180 }}
      size={{ width: 300, height: 80 }}
    >
      <ui.Button
        name="request_aid"
        position={{ x: 20, y: 20 }}
        size={{ width: 260, height: 36 }}
        text="tutorial_request_aid"
        action={aid}
      />
    </ui.Container>
  ),
);
```

`context` 使按钮效果运行于玩家国家作用域。`action={aid}` 提供可用条件和点击效果，按钮文本复用已有的本地化键。这里专注接线；字体、sprite 和具体位置应按目标游戏窗口配置，详见[界面手册](../guide/ui.md)与[资源手册](../guide/assets.md)。

## 检查两份原生文件

```sh
npx krieg world
npx krieg check
npx krieg build
```

`interface/tutorial.gui` 应出现 `tutorial_window` 和 `request_aid`。`common/scripted_guis/krieg_tutorial_panel.txt` 的窗口名应为同一个 `tutorial_window`，点击键是 `request_aid_click`，可用键是 `request_aid_click_enabled`。点击效果调用 `tutorial_aid_execute`，执行时再次检查资格与余额，然后扣费并结算。

这让按钮和决议共享一次性标记：任一入口成功购买后，另一入口也失去资格。先检查这些原生连接，再在游戏中确认窗口挂接、按钮样式、文本宽度和状态刷新。

## 继续扩展

复制按钮时使用唯一 `name`。多个控件可用[样式类与 Stack](../guide/styles.md)统一布局；已有窗口和动态列表用[ScriptedGui 参考](../api/reference/ui/scripted-gui.md)。先通过[行动规则](../guide/actions.md)理解收费和重检，再增加冷却或退款。

下一课：[迁移一份原生脚本](native-port.md)，使用独立项目练习有序数据。
