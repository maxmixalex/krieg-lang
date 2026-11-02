# 语言与执行模型

Krieg 源码同时满足两个条件：它是严格类型检查能够通过的 TypeScript，也是 Krieg 可以静态翻译的语言子集。理解这两个条件，可以解释为什么编辑器认识某种语法，编译器却可能拒绝它。

## 编译器读取什么

编译器解析 TypeScript AST，解析模块与符号，检查类型，再把定义、作用域、条件和效果降级到 Paradox 脚本。`.krg.ts` 中的函数不会被 Node.js 调用，导入也不会运行模块的 JavaScript。

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

## 常量与可复用函数

`const` 可以保存可静态求值的字符串、数字、布尔值、数组或对象。辅助函数需要给参数写出类型：

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

## 条件与比较

支持布尔组合 `&&`、`||`、`!` 及已建模属性的比较。`country.politicalPower >= 50` 中的属性读取对应游戏条件；不同属性可接受的比较形式由编译器决定。不要把所有 JavaScript 对象操作都当成游戏表达式。

回调返回的条件必须符合其声明的作用域类型。例如事件的 `trigger` 返回布尔表达式，`immediate` 则描述效果。类型错误和无法降级的表达式都会阻止成功编译。

## 数值变量

效果回调中，受支持的数值 `let` 声明与算术会降级为游戏变量操作。它们描述游戏运行时的数据，而不会在 Node.js 中执行运算。使用明确的数值初始值与编译器支持的算术操作；不要把对象、函数或任意动态值赋给游戏变量。

编译器会为中间结果管理变量名称。编译后应检查生成的变量操作，尤其是会被多处展开的辅助函数和复杂算术，确认它们符合预期的游戏逻辑。

## 常量数组遍历

唯一支持的循环形式是对可静态确定数组的 `for...of`，并使用 `const` 标识符绑定：

```typescript
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";

ScriptedEffect("set_preparation_flags", (country: CountryScope) => {
  for (const flag of ["industry_ready", "army_ready"]) {
    country.effects.setCountryFlag(flag);
  }
});
```

这会生成两条 `set_country_flag`。如果目标是遍历游戏运行时存在的国家或地区，应使用 `everyCountry`、`everyState` 等作用域 API；两者的行为不同。

## 导入与模块

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

项目源码和源码依赖必须使用 `.krg.ts`。编译器只接受自己生成的声明模块，不接受用户通过相对 `.d.ts` 文件注入额外运行时声明。普通类型别名与接口可以直接写在 `.krg.ts` 中。

## 不支持的结构

| 结构                                  | 原因或替代方式                                 |
| ------------------------------------- | ---------------------------------------------- |
| `any`、未标注的函数参数               | 失去静态类型边界；使用明确的 SDK 类型          |
| `async`、`await`、Promise             | 没有 JavaScript 异步执行过程                   |
| 类、`new`、`this`                     | 不属于 DSL 的数据与作用域模型                  |
| `while`、`do`、传统 `for`、`for...in` | 不做任意动态循环；用常量展开或游戏作用域遍历   |
| `try`、`throw`、生成器                | 不对应当前语言中的游戏执行结构                 |
| `eval`、动态 `import`、`require`      | 不能动态加载或执行编译期代码                   |
| `Math`、`JSON`、文件与网络 API        | 属于 JavaScript 运行时；在独立预处理步骤中使用 |
| 普通 npm JavaScript 依赖              | 使用声明了 Krieg 源码入口的包                  |

除 `as const` 外的类型断言、非空断言，以及 `@ts-ignore`、`@ts-expect-error`、`@ts-nocheck` 都会被拒绝。它们不能用来把错误的游戏参数强行变成合法输入。

这张表帮助理解常见边界。最终支持范围以编译诊断、SDK 声明和测试为准；遇到没有覆盖的游戏结构，可以使用[有序 PDX 表示](native-import.md)。
