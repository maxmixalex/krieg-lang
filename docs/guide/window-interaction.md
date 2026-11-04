# 动态列表与修饰键操作

静态的 `For` 在构建时展开固定数量的控件。为了显示某个国家**此刻**的手牌或科研队列，使用绑定到游戏数组的 `ui.GridBox`：编译器同时生成外层布局、重复条目模板及其 Scripted GUI 绑定。

<!-- example:compile -->

```tsx
import { GuiVariable, ScriptedWindow } from "krieg-lang/ui";

ScriptedWindow({ name: "hand", path: "interface/hand.gui", context: "player_context" }, (ui) => (
  <ui.Container name="hand_window">
    <ui.GridBox
      name="cards"
      slotsize={{ width: 56, height: 80 }}
      list={{
        array: "hand",
        index: GuiVariable("card_index"),
        value: GuiVariable("card_value"),
        entry: (
          <ui.Container name="card_entry">
            <ui.Button
              name="play_card"
              text="PLAY"
              properties={{ frame: GuiVariable("card_value") }}
              click={(c) => c.setVariable("selected_card", c.variable("card_index"))}
            />
          </ui.Container>
        ),
      }}
    />
  </ui.Container>
));
```

这里 `card_index` 表示位置，`card_value` 表示内容：两个相同的牌值也可以点击不同的位置。条目内的作用域取决于所用列表及 `entryScope`，不能想当然地把每类列表都当作国家。请不要让同一 Scripted GUI 里的不同条目模板碰巧使用相同的控件名。

一个按钮存在多种操作时，用 `events={{ rightClick: …, shiftClick: …, controlClick: … }}` 就近声明，只写真正支持的原生事件。普通 `click`、资格判断、UI 图片与样式不必搬到另一份对象中。未知事件名会报错；对于已有收费动作，保持原有资格和扣费归属。地图／GUI 里的 `ROOT`、条目作用域和真实鼠标焦点仍要按目标界面核对。

[基础 TSX 手册](ui.md) · [样式与 Stack](styles.md) · [自动科研队列](../ports/automated-research.md)
