# 静态界面样式

`.krg.css` 把大型 HOI4 界面反复出现的坐标、尺寸、字体、sprite、对齐和滚动选项提取为可复用的类。编译器读取 CSS Modules 风格的默认导入，在构建时展开原生 `.gui` 字段；游戏不加载 CSS，也不运行浏览器布局引擎。

规则由固定版本的 PostCSS 解析，值由 `postcss-value-parser` 解析。Krieg 只接受下文列出的静态子集，并通过控件实际使用的原生 GUI schema 检查属性与值。样式不修改控件名称、本地化文本、点击效果或游戏条件。

## 从一份样式模块开始 {#style-module}

`src/panel.krg.css`：

```css
:root {
  --body-font: hoi_16mbs;
  --button-width: 240px;
}

.panel {
  position: 24px 180px;
  size: 320px 200px;
}

.button {
  size: var(--button-width) 32px;
  font: var(--body-font);
  sprite-type: GFX_investment_button;
}

.importantButton {
  composes: button;
  font: hoi_18mbs;
}
```

`src/panel.krg.tsx`：

```tsx
import { ScriptedWindow, Stack, For } from "krieg-lang/ui";
import styles from "./panel.krg.css";

const investments = [
  { name: "economy", text: "investment_economy", cost: 25 },
  { name: "industry", text: "investment_industry", cost: 50 },
] as const;

ScriptedWindow(
  { name: "investment", path: "interface/investment.gui", context: "player_context" },
  (ui) => (
    <ui.Container name="investment_window" className={styles.panel}>
      <Stack position={{ x: 16, y: 48 }} gap={8}>
        <For each={investments}>
          {(item) => (
            <ui.Button
              name={item.name}
              text={item.text}
              className={styles.importantButton}
              enabled={(country) => country.politicalPower >= item.cost}
              click={(country) => country.effects.addPoliticalPower(-item.cost)}
            />
          )}
        </For>
      </Stack>
    </ui.Container>
  ),
);
```

两个按钮的原生位置分别为 `x = 16, y = 48` 与 `x = 16, y = 88`。按钮的 `size` 使用引擎要求的 `{ x = 240 y = 32 }`，容器的 `size` 使用 `{ width = 320 height = 200 }`。`font` 在按钮上成为 `buttonFont`，在文本控件上成为 `font`。`Stack` 和样式类不留下额外的原生容器或 `className` 字段。

导入类也适用于普通 `GuiFile`、复用的 TSX 源码组件、原生组件 `NativeButton` 等及 `<buttonType>` intrinsic 标签。`ScriptedWindow` 的绑定照常保留。完整项目见 [vanilla-complete 示例](examples.md)，其 `src/interface.krg.css` 与 `src/interface.krg.tsx` 共同定义整个议会面板。

## 精确类名与组合

模块默认导出只包含文件中声明过的类。`styles.importantButton` 可以由标准 TypeScript 补全，`styles.importantButon` 会报错。带连字符的类使用 `styles["important-button"]`。`className` 接受不可自行构造的 `GuiClass`，或按顺序排列的类数组：

```tsx
// src/priority.krg.tsx
import { GuiFile, Button } from "krieg-lang/ui";
import styles from "./panel.krg.css";

GuiFile(
  "interface/priority.gui",
  <Button name="invest" className={[styles.button, styles.importantButton]} font="hoi_20mbs" />,
);
```

覆盖顺序固定：

1. 类中的 `composes` 先按给出的类名顺序展开。
2. 当前类的普通声明按源文件顺序覆盖组合结果；同一属性的最后一条声明生效。
3. `className` 数组从左到右覆盖，后面的类优先。
4. 显式 TSX props 最后覆盖，无论 `className` 在 JSX 属性列表中的位置。

`position`、`size`、`padding` 等是完整属性；覆盖会替换整个坐标或尺寸记录。例如 `position={{ x: 8, y: rowY }}` 必须同时给出两个坐标。没有隐含深合并。

一个文件内每个类只定义一次；重复 `.button` 规则直接报错。需要变化时创建新类并组合。`composes` 只引用本文件的类，允许向后引用，未知类和循环引用报错。类数组也可以包含从不同样式模块导入的类。另一种复用方式是在 `.krg.ts` / `.krg.tsx` 组件中转发类：

```tsx
// src/action.krg.tsx
import { GuiFile, Button, type GuiClass, type GuiElement } from "krieg-lang/ui";
import styles from "./panel.krg.css";

export function Action(props: { name: string; style: GuiClass }): GuiElement {
  return <Button name={props.name} className={props.style} />;
}

GuiFile("interface/action.gui", <Action name="invest" style={styles.importantButton} />);
```

`Icon` 必须能获得 `spriteType`：可以显式写出，也可以传入含 `sprite-type` 的类。若使用类数组且省略显式 sprite，第一项必须是提供 sprite 的类，后续类可覆盖它。该要求由生成声明和编译器共同检查。

## token 与值

`:root` 只声明本模块的 custom properties。`var(--name)` 在编译时替换，`var(--missing, 16px)` 提供回退值。token 可以引用其他 token；未定义引用、重复定义和循环引用均报错。token 不继承到子控件，也不跨模块共享；跨模块使用已经定义好 token 的类即可。

```css
:root {
  --spacing: 12px;
  --row-size: 240px 32px;
  --font: "hoi_18mbs";
}

.row {
  position: var(--spacing) 40px;
  size: var(--row-size);
  font: var(--font);
}
```

坐标接受有限数字、`px`、百分比与原生 `@constant`。`px` 在输出前移除；百分比和 `@constant` 保留原生含义，编译器不求出屏幕像素。不能使用 `em`、`rem`、`vw`、`vh`、`auto` 或 `calc()`。`@constant` 必须在目标 GUI 环境中存在，样式编译不会创建它。

字符串可加引号；含空格时必须加引号。布尔值接受 `yes/no` 或 `true/false`。枚举保持原生大小写，例如 `UPPER_LEFT`、`upper_left`、`center`。CSS 字符转义不属于支持的原生标识子集。

## 支持的属性

这些属性仅能用于原生 schema 支持它们的控件。例如容器不能接受 `font`，文本控件不能接受网格 `padding`。编译器会在应用类时检查该限制；一个类混入了不适用于目标控件的属性，即使最终会被别的属性覆盖，也会报告错误。

| 属性                                                                           | 值与用途                                                     |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `position`, `border-size`, `offset`                                            | 两个坐标：`x y`                                              |
| `size`, `slot-size`                                                            | 两个坐标：`width height`；按具体控件转换原生尺寸字段         |
| `padding`                                                                      | 1–4 个数值像素，按上、右、下、左展开；仅支持原生网格 padding |
| `max-width`, `max-height`                                                      | 单个原生坐标                                                 |
| `font`, `sprite-type`                                                          | 字体或已注册的 sprite 名称                                   |
| `orientation`, `origo`, `format`, `vertical-alignment`                         | 对应控件的原生枚举                                           |
| `scale`, `rotation`, `scroll-wheel-factor`                                     | 有限数值                                                     |
| `frame`, `spacing`, `horizontal`, `max-slots-horizontal`, `max-slots-vertical` | 原生整数；还会检查该控件的数值范围                           |
| `vertical-scrollbar`, `horizontal-scrollbar`, `scrollbar-type`                 | 原生 scrollbar 名称                                          |
| `hide`, `clipping`, `moveable`, `fullscreen`, `multiline`                      | 布尔值                                                       |
| `fixed-size`, `always-transparent`, `center-position`, `add-horizontal`        | 布尔值                                                       |
| `click-to-front`, `autohide-scrollbars`, `smooth-scrolling`, `no-click-sound`  | 布尔值                                                       |

`name`、`text`、tooltip、子节点与游戏行为留在 TSX，以保留名称、翻译及作用域检查。当前没有浏览器 `display`、flex、grid、margin、颜色、边框绘制、动画或响应式媒体规则。`padding` 是原生 `gridBoxType` 的字段，不会为任意控件创建浏览器盒模型。

支持的 selector 只有一个 `.class` 或 `:root`。不支持 selector 列表、后代、子选择器、ID、伪类、嵌套、`@import`、`@media` 或 `!important`。游戏悬停/点击状态使用 sprite 和原生 GUI 行为；显示、启用、动态坐标继续使用 `ScriptedWindow`。

## 静态 Stack 的边界 {#static-stack}

`Stack` 是编译期组合器。`direction` 为 `vertical`（默认）或 `horizontal`；`gap` 为非负数，`position` 是组合起点。它顺序展开 `For`、片段、数组与组件后，为每个直接子控件写入绝对 `position`，沿排列方向累加显式 `size` 与 `gap`。

每个直接子控件必须有排列方向上的非负数值尺寸。百分比、`@constant`、自动文字测量和从图片推断尺寸均不可用。子控件不得再声明 `position`，也不得采用其他锚点、缩放或旋转；将共同起点移至 `Stack.position`，把尺寸放在样式类。用普通容器包住一组复杂控件即可让整个组作为一个有明确尺寸的 Stack 子元素。

Stack 不插入包装容器，因此父坐标系与原生控件名称保持直接关系。它保留子控件的 ScriptedWindow 绑定；运行时隐藏一个按钮不会重新排布其他按钮。游戏动态列表应继续使用 `ScriptedGui.dynamicLists`。

## 编辑器、CLI 与源码包 {#editor-source-packages}

首次导入或修改类后运行：

```bash
npx krieg world
npx tsc --noEmit
npx krieg check
```

`krieg world`、`types`、`check`、`build` 和 `watch` 刷新 `.krieg` 内的精确声明。标准 TypeScript LanguageService 和 `tsc` 使用生成的 `rootDirs` / `paths`，无须 TypeScript 插件，也没有 `declare module "*.css"` 的任意键兜底。单独运行 `tsc` 不会解析 CSS；改类名后要先刷新生成声明或运行 `krieg watch`。原生控件与样式的兼容性仍由 `krieg check` 完成。

声明按实际源文件路径镜像存储在 `.krieg/styles`；不同包的同名 `src/panel.krg.css` 有独立类型。源目录及 `node_modules` 不写入旁置声明，因此只读依赖也可使用。未改变的声明保持 mtime，移除的导入会清理对应生成文件。

源码包可以像普通组件一样在内部相对导入 `.krg.css`，也可以显式导出样式：

```json
{
  "name": "@my-mod/ui-kit",
  "files": ["src", "krgconfig.json"],
  "krieg": {
    "config": "krgconfig.json",
    "exports": {
      ".": "src/index.krg.tsx",
      "./theme": "src/theme.krg.css"
    }
  }
}
```

消费者使用 `import theme from "@my-mod/ui-kit/theme"`。该包必须像其他 Krieg 源码依赖一样显式加入项目，或通过带 `krieg` 元数据的 npm 依赖自动发现；CSS 文件应随源码包发布。本地源码包和安装后的 npm 包使用同一套解析规则。

## ESLint、格式化与诊断

```js
import krieg from "krieg-lang/eslint";

export default [
  { ignores: ["build/**", ".krieg/**", "node_modules/**"] },
  krieg.configs.recommended,
  krieg.configs.styles,
];
```

`krieg.configs.styles` 使用编译器同一个解析器检查 `.krg.css` 的语法、selector、属性、token 与 composition。TSX 中引用哪个原生控件涉及完整项目语义，交给 `krieg check`。Prettier 原生 CSS parser 可以直接格式化 `.krg.css`；TSX 继续使用 TypeScript parser。

| 错误                                       | 定位与处理                                       |
| ------------------------------------------ | ------------------------------------------------ |
| 不存在的 `styles.name`                     | TypeScript 定位 TSX 属性访问，并提供实际类名补全 |
| 重复类 / token、未知 composition、循环变量 | 定位 CSS 规则或声明                              |
| 未支持的 selector、属性、值、`!important`  | 定位 CSS 文件行列                                |
| 类中字段不能用于目标原生控件               | 定位 CSS 属性，消息带 TSX 使用控件的文件行列     |
| Stack 无法静态求出排列                     | 定位子控件或 Stack 声明                          |

构建后的 `krieg trace` 可把由样式生成的原生属性定位到最终获胜的 CSS 声明（`precision: "style"`），并附 TSX 使用点。显式 prop 覆盖的属性回到 TSX 来源，不保留被覆盖的 CSS 来源。它帮助定位游戏错误日志；游戏内的贴图注册、窗口挂接、文本溢出和实际交互仍需要在 HOI4 中验证。

实现与回归覆盖见 `tests/styles.test.mjs`：原生字段输出、覆盖顺序、组件和绑定组合、非法样式、标准 TypeScript LanguageService、同名包隔离、只读 npm 源码包、CLI、ESLint 和生成来源追踪。
