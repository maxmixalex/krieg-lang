# 语言与执行模型 {#_1}

Krieg 的 `.krg.ts` / `.krg.tsx` 源码同时满足两个条件：它是严格类型检查能够通过的 TypeScript，也是 Krieg 可以静态翻译的语言子集。理解这两个条件，可以解释为什么编辑器认识某种语法，编译器却可能拒绝它。

## 编译器读取什么 {#_2}

编译器解析 TypeScript AST，解析模块与符号，检查类型，再把定义、作用域、条件和效果降级到原生游戏文件。普通脚本生成有序 PDX AST，`Defines` / `DefineFile` 生成 Lua 赋值文本；`emitCompileOutput` 根据输出的 `format` 统一序列化。`.krg.ts` 中的函数不会被 Node.js 调用，导入也不会运行模块的 JavaScript。

例如：

```typescript
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";

ScriptedEffect("reward_prepared_country", (country: CountryScope) => {
  if (country.triggers.hasCountryFlag("prepared")) {
    country.effects.addPoliticalPower(25);
  } else {
    country.effects.addPoliticalPower(5);
  }
});
```

编译时不会读取一个真实国家，也不会决定走哪个分支。生成的脚本保留条件，让游戏运行时决定执行哪个效果块。

## 常量与可复用函数 {#_3}

`const` 可以保存可静态求值的字符串、数字、布尔值、数组或对象。独立辅助函数需要给参数写出类型；传给 SDK、TSX 属性和有类型函数的内联回调可以从上下文推导参数。严格 TypeScript 检查继续拒绝隐式 `any`。例如 `ScriptedEffect("reward", country => country.effects.addPoliticalPower(5))` 的 `country` 自动获得国家作用域及其补全。

复用辅助函数时：

```typescript
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";

const reward = 25;

function grantReward(country: CountryScope, amount: number): void {
  country.effects.addPoliticalPower(amount);
  country.effects.setCountryFlag("reward_received");
}

ScriptedEffect("grant_standard_reward", (country: CountryScope) => {
  grantReward(country, reward);
});
```

函数与回调支持浅层对象参数解构，例如 `(country, { values, change: delta }) => { ... }`。字段名称和类型由参数记录推导，独立辅助函数仍需显式标注记录类型。效果中的数值字段在进入函数时取得快照，数值数组字段引用调用方的数组。解构中的默认值、rest、嵌套模式和计算属性名会产生编译与 lint 诊断。

辅助函数调用会静态展开到调用位置。递归和过度展开会产生诊断，不会作为 JavaScript 递归执行。需要保留原生脚本化效果的调用关系时，可以保存 `ScriptedEffect` 返回的句柄，并使用作用域的 `run` 方法：

```typescript
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";

const sharedReward = ScriptedEffect("shared_reward", (country: CountryScope) => {
  country.effects.addPoliticalPower(25);
});

ScriptedEffect("use_shared_reward", (country: CountryScope) => {
  country.run(sharedReward);
});
```

这会保留 `shared_reward = yes` 这样的原生调用。脚本化条件对应 `ScriptedTrigger` 与 `scope.test(...)`；句柄的作用域类型必须匹配调用位置。

## 条件与比较 {#_4}

支持布尔组合 `&&`、`||`、`!` 及已建模属性的比较。`country.politicalPower >= 50` 中的属性读取对应游戏条件；不同属性可接受的比较形式由编译器决定。不要把所有 JavaScript 对象操作都当成游戏表达式。

回调返回的条件必须符合其声明的作用域类型。例如事件的 `trigger` 返回布尔表达式，`immediate` 则描述效果。类型错误和无法降级的表达式都会阻止成功编译。

## 数值变量 {#_5}

效果回调中，受支持的数值 `let` 声明与算术会降级为游戏变量操作。它们描述游戏运行时的数据，而不会在 Node.js 中执行运算。使用明确的数值初始值与编译器支持的算术操作；不要把对象、函数或任意动态值赋给游戏变量。

编译器会为中间结果管理变量名称。编译后应检查生成的变量操作，尤其是会被多处展开的辅助函数和复杂算术，确认它们符合预期的游戏逻辑。

## 常量数组遍历 {#_6}

静态资料表使用 `for...of` 遍历，并使用 `const` 标识符绑定。

```typescript
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";

ScriptedEffect("set_preparation_flags", (country: CountryScope) => {
  for (const flag of ["industry_ready", "army_ready"]) {
    country.effects.setCountryFlag(flag);
  }
});
```

这会生成两条 `set_country_flag`。如果目标是遍历游戏运行时存在的国家或地区，应使用 `everyCountry`、`everyState` 等作用域 API；两者的行为不同。

效果中的 `while` 与计数循环可直接读取游戏里的数值。计数器先初始化一次。游戏在每次迭代前重新读取条件，执行循环体后再更新计数器。例如，下面的效果会发放库存中现有的补给，最多三次。

<!-- example:compile -->

```typescript
import { ScriptedEffect } from "krieg-lang/hoi4";

ScriptedEffect("grant_supply_batches", (country) => {
  let stock = country.variable("available_batches");
  for (let batch = 0; batch < 3; batch++) {
    if (stock > 0) {
      country.effects.addPoliticalPower(1);
      stock--;
    }
  }
  country.setVariable("available_batches", stock);
});
```

`for` 使用单个已初始化的数值 `let` 计数器，更新位置支持 `++`、`--`、`+=`、`-=` 和给计数器重新赋值。循环体内的 `return` 会触发诊断。

## 导入与模块 {#_7}

SDK 从 `krieg-lang/hoi4` 导入，有序 PDX 构造器从 `krieg-lang/pdx` 导入。相对路径可导入项目中的 Krieg 源模块；可复用 npm 包必须显式声明源码入口。辅助函数和常量由编译器解析，不会经过 JavaScript 模块加载器执行。

使用 TypeScript 的 `type` 导入可以清楚地区分纯类型与 DSL 声明：

```typescript
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { grantReward } from "./rewards.krg.js";

ScriptedEffect("shared_reward", (country: CountryScope) => {
  grantReward(country, 25);
});
```

这里的 `.krg.js` 是 TypeScript NodeNext 风格的模块说明符，指向源码中的 `.krg.ts` 模块；它不表示 Krieg 会执行生成的 JavaScript。`import "./definitions.krg.js"` 也可以静态纳入另一个源码模块中的定义。

项目源码和源码依赖必须使用 `.krg.ts` 或 `.krg.tsx`。TSX 专门用于静态界面组件，详见 [界面与 TSX](ui.md)。编译器只接受自己生成的声明模块，不接受用户通过相对 `.d.ts` 文件注入额外运行时声明。普通类型别名与接口可以直接写在 `.krg.ts` 中。

## 不支持的结构 {#_8}

| 结构                                          | 原因或替代方式                                      |
| --------------------------------------------- | --------------------------------------------------- |
| `any`、未标注的函数参数                       | 失去静态类型边界；使用明确的 SDK 类型               |
| `async`、`await`、Promise                     | 没有 JavaScript 异步执行过程                        |
| 类、`new`、`this`                             | 不属于 DSL 的数据与作用域模型                       |
| `do...while`、`for...in`、`break`、`continue` | 效果中可用带条件的 `while` 与基于数值计数器的 `for` |
| `try`、`throw`、生成器                        | 不对应当前语言中的游戏执行结构                      |
| `eval`、动态 `import`、`require`              | 不能动态加载或执行编译期代码                        |
| `Math`、`JSON`、文件与网络 API                | 属于 JavaScript 运行时；在独立预处理步骤中使用      |
| 普通 npm JavaScript 依赖                      | 使用声明了 Krieg 源码入口的包                       |

除 `as const` 外的类型断言、非空断言，以及 `@ts-ignore`、`@ts-expect-error`、`@ts-nocheck` 都会被拒绝。它们不能用来把错误的游戏参数强行变成合法输入。

这张表帮助理解常见边界。最终支持范围以编译诊断、SDK 声明和测试为准；遇到没有覆盖的游戏结构，可以使用[有序 PDX 表示](native-import.md)。
