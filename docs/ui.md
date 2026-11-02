# 界面与 TSX

一个能响应游戏状态的界面由三部分组成：`.gui` 定义控件布局，`.gfx` 将 sprite 名称连接到图片，`common/scripted_guis` 把点击、显示条件和动态属性连接到游戏脚本。Krieg 分别提供 `GuiFile`、`SpriteFile` 与 `ScriptedGui`，使这三份原生内容能够在同一项目中管理。

## 定义布局

把下面代码放进 `src/reconstruction.krg.tsx`。它使用静态组件；编译器读取 JSX AST，不启动 React，也不创建浏览器 DOM。

```tsx
import { Button, Container, GuiFile, Text } from "krieg-lang/ui";

GuiFile(
  "interface/reconstruction.gui",
  <Container
    name="reconstruction_window"
    position={{ x: 24, y: 180 }}
    size={{ width: 360, height: 180 }}
  >
    <Text
      name="status"
      position={{ x: 16, y: 12 }}
      text="reconstruction_status"
      font="hoi_18mbs"
      maxWidth={320}
      maxHeight={60}
    />
    <Button
      name="invest"
      position={{ x: 16, y: 96 }}
      size={{ width: 280, height: 36 }}
      text="reconstruction_invest"
      font="hoi_18mbs"
    />
  </Container>,
);
```

`name` 是连接 Scripted GUI 行为的稳定标识。控件顺序会保留为原生重复条目；不会像 JavaScript 对象键那样覆盖相同类型的兄弟控件。坐标支持数字、百分比字符串和原生 `@常量`，具体属性及枚举见 [UI API](api/ui.md)。

常用布局入口是 `Container`、`Icon`、`Button`、`Text`、`GridBox`、`ListBox`。完整 CWT 控件还包括 `DropDownBox`、`OverlappingElementsBox`、`SmoothListBox`、`Position`、`Browser`、`EditBox`、`Checkbox`、`Scrollbar`、`ExtendedScrollbar`，以及使用原生字段投射的 `NativeContainer` / `NativeButton` / `NativeGridBox` / `NativeListBox` / `NativeIcon` / `NativeText`。所有控件的完整字段可从 [UI API](api/ui.md) 跳转到对应规格。

还提供从真实原版、Kaiserreich 与 TNO GUI 语料归纳的旧式 `Window`、`TextBox` 和 `GuiButton`。当前共十八种原生控件：十五种有上游 CWT 规则及独立正负原生审计；这三种旧式控件属于语料观察字段投射，上游规则没有覆盖，不能计入 CWT 通过数量。

原生 intrinsic 标签如 `<containerWindowType>` 也有类型检查。只有原生规则允许嵌套 GUI 别名的父控件接受 `children`；它不等同于给任意控件追加子节点。片段与有类型的源代码组件可静态展开；运行时组件库、DOM 事件处理器与任意函数执行不属于该模型。

## 给按钮连接游戏逻辑

```typescript
import { ScriptedGui, type CountryScope } from "krieg-lang/hoi4";

ScriptedGui({
  name: "reconstruction_panel",
  windowName: "reconstruction_window",
  context: "player_context",
  parentWindowToken: "politics_tab",
  visible: (country: CountryScope) => !country.isAI,
  effects: {
    invest_click: (country: CountryScope) => {
      country.effects.addPoliticalPower(-25);
      country.effects.setCountryFlag("industry_rebuilt");
    },
  },
  triggers: {
    invest_click_enabled: (country: CountryScope) =>
      country.politicalPower >= 25 && !country.triggers.hasCountryFlag("industry_rebuilt"),
  },
});
```

`windowName` 对应布局容器名，`invest_click` 与 `invest_click_enabled` 对应按钮 `invest`。`context` 决定条件与效果的作用域；例如 `selected_state_context` 使用 `StateScope`，国家效果需要明确切换到所有者或控制者。

API 对行为键名使用后缀类型约束，避免把没有原生意义的 `onClick` 写入输出。`parentWindowToken` 只能使用已建模的原生父窗口 token；按名称挂接另一个窗口可用 `parentWindowName`。父窗口确实存在、布局不被遮挡、文本不溢出等仍需要游戏内检查。

## Sprite 与资源

```typescript
import { Sprite, SpriteFile } from "krieg-lang/ui";

SpriteFile("interface/reconstruction.gfx", [
  Sprite({
    name: "GFX_reconstruction_badge",
    textureFile: "gfx/interface/reconstruction_badge.dds",
    noOfFrames: 1,
  }),
]);
```

在 `assets` 配置中加入实际图片文件，然后在 `Icon` 的 `spriteType` 或按钮属性中引用 `GFX_reconstruction_badge`。图片路径、sprite 名称和 GUI 控件名是不同的标识；放入一张图片不会自动注册同名 sprite。构建器检查已拥有资源的文件引用与部分格式，贴图视觉效果及 shader 行为由游戏验证。

## 动态属性、列表与 AI

`properties` 按元素名设置 `image`、`frame`、`x`、`y`；值可以引用游戏中的变量。`dynamicLists` 连接数组、当前值与索引、条目容器，并可描述每项按钮的 AI 权重。列表数据来自游戏，不是 TypeScript 的静态 `for...of` 数组展开。

`aiEnabled`、`aiCheck`、`aiCheckScope` 分别保留原生 AI 判定层次；权重、测试间隔、测试范围和父级测试引用通过明确字段配置。一个给玩家显示的按钮不会因为存在点击效果就自动成为合理的 AI 行为。详细字段和当前作用域约束以 [ScriptedGuiSpec](api/hoi4.md#scriptedguispec) 为准。

## 项目与编辑器

运行 `krieg world` 更新生成配置，再执行 `tsc --noEmit` 与 `krieg check`。`.krg.tsx` 与 `.krg.ts` 可以相互静态导入；TypeScript JSX 类型入口使用 `krieg-lang/ui/jsx-runtime`。生成的编辑器配置会包含 JSX 设置，ESLint 与 Prettier 也使用原生 TSX 支持。

完整布局、翻译与游戏逻辑组合见 [原版与 Kaiserreich 示例](examples.md)。原生格式参照 [Scripted GUI modding](https://hoi4.paradoxwikis.com/Scripted_GUI_modding)、[Interface modding](https://hoi4.paradoxwikis.com/Interface_modding)、目标安装的 `common/scripted_guis/_documentation.md` 及 [CWT interface/gui.cwt](https://github.com/cwtools/cwtools-hoi4-config/blob/master/Config/interface/gui.cwt)。
