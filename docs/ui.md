# 界面与 TSX

一个能响应游戏状态的界面由三部分组成：`.gui` 定义控件布局，`.gfx` 将 sprite 名称连接到图片，`common/scripted_guis` 把点击、显示条件和动态属性连接到游戏脚本。`ScriptedWindow` 把布局和行为合为一个声明，同时生成前后两份原生文件；`SpriteFile` 负责贴图注册。需要连接已有布局、原生修饰键点击或游戏动态列表时，也可以单独使用 `GuiFile` 与 `ScriptedGui`。

重复的坐标、尺寸、字体与 sprite 可放进 [`.krg.css` 样式模块](styles.md)。默认导入提供精确类名补全；`className` 在编译时展开为目标控件的原生字段，支持 token、类组合和明确的覆盖顺序。普通控件、`ui.Button` 等绑定控件、原生组件与 intrinsic 标签都可使用。样式不会创建浏览器 DOM。

## 同一处声明布局和行为

`ScriptedWindow` 的 `context` 决定 `ui` 控件回调的作用域。下面所有 `country` 都由标准 TypeScript 推导为 `CountryScope`，编辑器可以直接补全合法效果与条件，无须重复注明类型或手写 `economy_click` 这样的连接字符串。

```tsx
import { ScriptedWindow, For, GuiVariable } from "krieg-lang/ui";

const dirty = GuiVariable("reconstruction_dirty");
const offset = GuiVariable("reconstruction_badge_x");
const investments = [
  { name: "economy", text: "reconstruction_economy", cost: 25 },
  { name: "industry", text: "reconstruction_industry", cost: 50 },
] as const;

ScriptedWindow(
  {
    name: "reconstruction_panel",
    path: "interface/reconstruction.gui",
    context: "player_context",
    parentWindowToken: "politics_tab",
    dirty: dirty.name,
    visible: (country) => !country.isAI,
  },
  (ui) => (
    <ui.Container name="reconstruction_window" size={{ width: 360, height: 180 }}>
      <ui.Icon name="status" spriteType="GFX_reconstruction_badge" properties={{ x: offset }} />
      <For each={investments}>
        {(investment, index) => (
          <ui.Button
            name={investment.name}
            text={investment.text}
            font="hoi_18mbs"
            position={{ x: 16, y: 48 + index * 44 }}
            size={{ width: 280, height: 36 }}
            enabled={(country) => country.politicalPower >= investment.cost}
            click={(country) => {
              country.effects.addPoliticalPower(-investment.cost);
              country.effects.setVariable({ var: offset.name, value: 16 });
              country.effects.addToVariable({ var: dirty.name, value: 1 });
            }}
          />
        )}
      </For>
    </ui.Container>
  ),
);
```

它生成 `interface/reconstruction.gui` 和 `common/scripted_guis/krieg_reconstruction_panel.txt`。`window_name` 自动取自根容器，按钮名称自动生成对应行为键。修改名称会同时修改布局和连接。组件展开后，编译器检查整个窗口中的控件名称唯一；重复列表条目、嵌套组件重名、空根和多个根都会在产生输出前报错。名称须符合 `[A-Za-z_][A-Za-z0-9_]*`。

| 控件声明                | 原生行为                        |
| ----------------------- | ------------------------------- |
| `ui.Button.click`       | `effects.<name>_click`          |
| `ui.Button.enabled`     | `triggers.<name>_click_enabled` |
| 后代控件的 `visible`    | `triggers.<name>_visible`       |
| 后代控件的 `properties` | `properties.<name>`             |
| `ui.Button.aiWeight`    | `ai_weights.<name>_click`       |

所有绑定控件支持动态 `x`、`y`；按钮另有 `frame`；图标另有 `frame` 和 `image`。数值属性接受数字或 `GuiVariable`，防止把普通文案字符串误用成变量；`image` 接受 sprite 或 scripted localisation 字符串。`GuiVariable` 保留原生变量名称，`.name` 可传给 `setVariable`、`addToVariable` 和 `dirty`，因此写入与读取共用同一份标识。它不会创建或初始化变量，也不会自动增加 dirty；示例明确写出了刷新操作。游戏中的变量存放在哪个国家或地区仍由窗口和效果作用域决定。

根容器只声明布局，整个窗口的可见条件放在 `ScriptedWindow` 的 `visible`。窗口只接受一个父级；`decision_category` 上下文禁止父窗口。`selected_state_context` 与 `state_mapicon` 的控件回调自动改为 `StateScope`，误用国家效果会产生 TypeScript 错误；切换到拥有者后才能调用国家效果。

## 静态组合与复用

`For` 从 `each` 数组推导条目和索引类型，并在编译时按顺序展开控件。每项的效果闭包保留该项参数，所以示例分别生成扣除 25 和 50 政治点数的效果。它共享编译器的展开上限；不是 JavaScript 数组运行时，也不是游戏的 `dynamic_lists`。

`Stack` 可为具有显式数字 `size` 的子控件顺序计算绝对坐标。例如 `<Stack position={{ x: 16, y: 48 }} gap={8}>...</Stack>` 按每个控件高度加 8 排列；`direction="horizontal"` 则使用宽度。子控件不再声明 `position`，并须使用上左锚点、默认缩放和旋转。它不插入原生包装容器，保留 `For` 展开条目的名称与游戏绑定。百分比尺寸、文字自动测量和运行时重排不属于这个静态组合；详见 [静态 Stack 的边界](styles.md#static-stack)。

支持片段、嵌套静态数组、`condition ? element : null` 和静态布尔条件的 `&&` / `||`。布尔值、`null` 和 `undefined` 不产生控件；游戏状态变化应使用控件的 `visible` 条件。`GuiFile` 也支持这些组合形式。

普通组件和导入的源代码组件可一起使用。需要复用行为的组件可以接收 `GuiBindings<CountryScope>`，或相应的地区作用域绑定：

```tsx
import type { CountryScope } from "krieg-lang/hoi4";
import { ScriptedWindow, type GuiBindings, type GuiElement } from "krieg-lang/ui";

function InvestButton(props: {
  ui: GuiBindings<CountryScope>;
  name: string;
  cost: number;
}): GuiElement {
  return (
    <props.ui.Button
      name={props.name}
      text="reconstruction_invest"
      enabled={(country) => country.politicalPower >= props.cost}
      click={(country) => country.effects.addPoliticalPower(-props.cost)}
    />
  );
}

ScriptedWindow(
  { name: "shared_panel", path: "interface/shared.gui", context: "player_context" },
  (ui) => (
    <ui.Container name="shared_window">
      <InvestButton ui={ui} name="small_investment" cost={10} />
      <InvestButton ui={ui} name="large_investment" cost={40} />
    </ui.Container>
  ),
);
```

绑定元数据会穿过片段、普通容器和组件边界，最后由当前窗口统一验证并生成游戏脚本。这里的 `click` 接收游戏作用域，不接受浏览器事件。`onClick`、DOM 控件、React hooks 和运行时组件库不属于该模型。

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

`.krg.css` 默认导入的类名声明同样由 `krieg world` / `build` / `check` / `watch` 刷新，存放于 `.krieg/styles`，不写入源码包或 `node_modules`。标准 TypeScript 补全真实类名；CSS 与原生控件的语义兼容性由 `krieg check` 校验。在 ESLint flat config 中加入 `krieg.configs.styles` 可直接检查样式语法、token 和组合。Prettier 原生支持其 CSS 格式。详见 [样式的项目与源码包接入](styles.md#editor-source-packages)。

完整布局、翻译与游戏逻辑组合见 [原版与 Kaiserreich 示例](examples.md)。本轮绑定语义核对了所提供离线 Wiki 的 [Scripted GUI modding 修订 105160](https://hoi4.paradoxwikis.com/index.php?title=Scripted_GUI_modding&oldid=105160) 与 [Interface modding 修订 100547](https://hoi4.paradoxwikis.com/index.php?title=Interface_modding&oldid=100547)，以及目标安装的 `common/scripted_guis/_documentation.md` 和 [CWT interface/gui.cwt](https://github.com/cwtools/cwtools-hoi4-config/blob/master/Config/interface/gui.cwt)。

`tests/scripted-window.test.mjs` 使用实际生成的 consumer tsconfig 和标准 TypeScript LanguageService 检查控件属性、国家/地区效果、动态属性与 `For` 条目补全；另有输出、组件组合、负例和展开上限测试。这些检查证明类型与原生文件生成一致，不代替游戏内的窗口挂接、布局或点击运行验证。
