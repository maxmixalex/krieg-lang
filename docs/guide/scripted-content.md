# 脚本化内容：复用、动态文本与 MetaEffect {#metaeffect}

辅助函数在编译时展开；`ScriptedEffect` / `ScriptedTrigger` 生成由游戏调用的定义；`ScriptedEffectFamily` / `ScriptedTriggerFamily` 用有限参数表在编译时生成多份具名定义；`MetaEffect` 的占位符则由游戏在运行时替换。先确定需要在哪一层复用，再选择 API。

| 需求                           | API                                             | 输出中的调用关系                     |
| ------------------------------ | ----------------------------------------------- | ------------------------------------ |
| 复用一段有类型的代码           | 普通具名函数                                    | 在调用点静态展开                     |
| 多个事件共用一个原生效果       | `ScriptedEffect`、`scope.run()`                 | 保留脚本化效果定义与原生调用         |
| 重用条件                       | `ScriptedTrigger`、`scope.test()`               | 保留脚本化条件定义与原生调用         |
| 用一份逻辑声明几个固定参数版本 | `ScriptedEffectFamily`、`ScriptedTriggerFamily` | 每个变体一份普通原生定义，调用不展开 |
| 按状态选择显示文本             | `ScriptedLocalisation`                          | 有序 `defined_text` / `text` 分支    |
| 让游戏替换原生效果片段中的参数 | `MetaEffect`                                    | `meta_effect` 的 `text` 与参数块     |

## 脚本化效果与条件 {#_1}

```typescript
import { ScriptedEffect, ScriptedTrigger, type CountryScope } from "krieg-lang/hoi4";

const canRebuild = ScriptedTrigger(
  "can_rebuild_industry",
  (country: CountryScope) =>
    country.politicalPower >= 25 && !country.triggers.hasCountryFlag("industry_rebuilt"),
);

const rebuild = ScriptedEffect("rebuild_industry", (country: CountryScope) => {
  if (country.test(canRebuild)) {
    country.effects.addPoliticalPower(-25);
    country.effects.setCountryFlag("industry_rebuilt");
  }
});

ScriptedEffect("request_reconstruction", (country: CountryScope) => {
  country.run(rebuild);
});
```

句柄保留作用域类型；把国家作用域的效果传给地区作用域会失败。事件、国策、决议和 GUI 回调都可复用同一个句柄。原生输出路径分别是 `common/scripted_effects/` 与 `common/scripted_triggers/`，定义名称是游戏中的调用名。

## 有限参数表：编译期生成具名变体 {#_2}

当几个效果只有成本、奖励、国家或地区等固定参数不同，可以用一张表和一个有类型的回调生成它们：

```typescript
import { ScriptedEffect, ScriptedEffectFamily, ScriptedTriggerFamily } from "krieg-lang/hoi4";

const projects = {
  harbour: { cost: 25, reward: 1 },
  depot: { cost: 40, reward: 2 },
} as const;

export const affordable = ScriptedTriggerFamily(
  "can_build",
  projects,
  (country, p) => country.politicalPower >= p.cost,
);

export const build = ScriptedEffectFamily("build", projects, (country, p) => {
  country.effects.addPoliticalPower(-p.cost);
  country.effects.addStability(p.reward * 0.01);
});

ScriptedEffect("build_harbour_if_possible", (country) => {
  if (country.test(affordable.harbour)) country.run(build.harbour);
});
```

编辑器会补全 `harbour` / `depot` 和 `p.cost` / `p.reward`，检查回调中各字段的用途。`build.harbour` 是普通国家效果句柄，其 `name` 保留字面量类型 `"build_harbour"`。把其中一个 `cost` 改成字符串会使数值运算或效果调用报错；访问不存在的 `build.habour` 也会报错。

每个变体的原生名为 `${prefix}_${key}`，并各自写入 `common/scripted_effects/krieg_<name>.txt` 或 `common/scripted_triggers/krieg_<name>.txt`。上例中的一部分输出是：

```pdx
build_harbour = {
    add_political_power = -25
    add_stability = 0.01
}
can_build_harbour = {
    NOT = { has_political_power < 25 }
}
build_harbour_if_possible = {
    if = {
        limit = { can_build_harbour = yes }
        build_harbour = yes
    }
}
```

每个变体只定义一次。多个事件、跨文件导入或源码包消费者都复用同一原生名；在同一个入口里重复调用不会复制正文。整个参数表都会生成，因此应只列出实际需要的有限变体。相同原生命名空间内的重名会失败，包括与普通 `ScriptedEffect` / `ScriptedTrigger` 的碰撞。

默认作用域为 `country`。第二个参数可以显式指定作用域，此时参数表和回调顺延：

```typescript
import { ScriptedEffectFamily } from "krieg-lang/hoi4";

const manpower = ScriptedEffectFamily(
  "local_recruitment",
  "state",
  { small: { amount: 100 }, large: { amount: 300 } },
  (region, p) => region.effects.addManpower(p.amount),
);
```

`manpower.small` 只能由地区作用域的 `run()` 调用。`ScriptedTriggerFamily` 使用相同的显式作用域形式，并返回供 `test()` 使用的条件句柄。

参数表中的每个变体必须是扁平记录，值限于有限数值、布尔、字符串和合法的 `country(...)` / `state(...)` 引用。不接收函数、任意嵌套对象或数组，也不接收原生代码正文。前缀以 ASCII 字母或下划线开头，随后只能使用字母、数字或下划线；变体键只允许字母、数字或下划线。地区 ID 必须是正的安全整数，国家 tag 必须是三位合法形式。参数本身不证明所引用对象存在于目标模组中；需要项目内精确引用时从 `@project/countries` / `@project/states` 取值。

**这里的参数全部是编译期数据。** `p.cost * 2`、布尔分支和字符串插值只对真实的静态值求值；`country.politicalPower` 等作用域查询仍生成运行时游戏条件。`"$AMOUNT$"` 是普通字符串，不能当成数值或可求值的符号；family 不生成 `$PARAM$` 占位符，也不会偷偷建立临时游戏变量。

可运行例子见 [scripted-families](../ports/complete-examples.md#scripted-families)。它借鉴所附 TNO `TNO_economy_frontend_scripted_effects.txt` 中 `consumer_goods_minimal_set_position_*` 的真实重复结构：各档设置固定百分比，再调用同一个更新效果。示例使用独立变量和标记，两个事件跨文件调用同一个 `medium` 变体。

## 原生契约与选择边界 {#_3}

本项目核对的 HOI4 [Effect / Scripted effects](https://hoi4.paradoxwikis.com/Effect#Scripted_effects)、[Triggers / Scripted triggers](https://hoi4.paradoxwikis.com/Triggers#Scripted_triggers) 和 CWT 规则都使用普通调用：效果为 `name = yes`，条件为 `name = yes/no`。CWT 的 `effects.cwt` / `triggers.cwt` 分别声明 `alias[effect:<scripted_effect>] = yes` 和 `alias[trigger:<scripted_trigger>] = bool`。因此 `run(handle, { AMOUNT: 25 })` 和原生 `name = { AMOUNT = 25 }` 都不是这些 API 的调用形式。

对所附原版、Kaiserreich、TNO 的 `common/scripted_effects` 和 `common/scripted_triggers` 共 646 个文件、825,944 行进行检查，没有发现可执行的 `$PARAM$` 定义；四处 `$Overlord$` 命中均为注释。这里不会把其他 Paradox 游戏的参数宏语法套用到 HOI4。若目标游戏版本增加了不同语法，应先补充该版本的原生证据与 CWT 规则。

需要任意参数组合、并且可以接受调用点展开时，使用普通有类型的 TypeScript 辅助函数。几个固定版本需要被许多事件调用时，使用 family。逻辑和参数完全相同时，单个 `ScriptedEffect` / `ScriptedTrigger` 就够了。需要读取运行时游戏变量时，应明确使用相应的变量命令；[Data structures / Variables](https://hoi4.paradoxwikis.com/Data_structures#Variables) 也专门说明了临时变量跨 scripted 调用的生命周期。只有需要游戏执行动态文本替换时才使用下面的 `MetaEffect`。

## 有序 Scripted Localisation {#scripted-localisation}

```typescript
import { ScriptedLocalisation, type CountryScope } from "krieg-lang/hoi4";

ScriptedLocalisation("GetReconstructionStatus", {
  scope: "country",
  texts: [
    {
      trigger: (country: CountryScope) => country.triggers.hasCountryFlag("industry_rebuilt"),
      localisationKey: "reconstruction_complete",
    },
    {
      trigger: (country: CountryScope) => country.politicalPower >= 25,
      localisationKey: "reconstruction_ready",
    },
    { localisationKey: "reconstruction_waiting" },
  ],
});
```

列表顺序决定第一次匹配的文本。把无条件回退放在最后，避免遮住后续分支。在普通 YAML 中写 `reconstruction_status: "[GetReconstructionStatus]"`，并提供上面三个文本键，即可让游戏选择显示内容。输出位于 `common/scripted_localisation/`，定义使用原生 `defined_text` 结构。

`scope` 明确规定条件回调的作用域。切换为 `state` 时使用 `StateScope`，不会自动把地区当成其所有者国家。文本选择本身不执行效果，也不会改变游戏状态。

需要原生加权文本时，某个 `texts` 条目可使用 `randomList`，每项提供 `weight` 与 `localisationKey`，并可附带条件权重修正。`localisationKey` 与 `randomList` 互斥；详细类型见 [ScriptedLocalisationText](../api/hoi4.md#scriptedlocalisationtext)。随机结果、种子与本地化调用次数的实际关系由游戏版本决定，应在目标游戏中测试。

## MetaEffect：明确保留运行时替换 {#metaeffect_1}

```typescript
import { MetaEffect, ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";

ScriptedEffect("reconstruction_meta_reward", (country: CountryScope) => {
  MetaEffect(country, {
    text: "add_political_power = [AMOUNT] set_country_flag = [FLAG]",
    parameters: {
      AMOUNT: 15,
      FLAG: "reconstruction_meta_complete",
    },
  });
});
```

`text` 是不带最外层花括号的原生效果正文。占位符 `[AMOUNT]`、`[FLAG]` 由字面量类型提取；参数遗漏或多余会被拒绝。编译器把参数和文本写入 `meta_effect`，不会先在 Node.js 中替换字符串或执行其中的命令。

这条入口用于 HOI4 已存在的元效果机制。固定参数、固定效果通常直接写有类型的作用域调用更清楚；使用 MetaEffect 时，要额外检查替换后的原生 token 是否符合目标效果及作用域。内层动态文本没有获得普通 SDK 调用的全部语义保证，`debug` 可用于需要原生诊断的场景。

## 组合场景 {#_4}

一个完整重建功能可以用 `ScriptedTrigger` 统一判断政治点数与完成标记，用 `ScriptedEffect` 实施扣款和奖励，让决议和 GUI 调用同一效果，再用 `ScriptedLocalisation` 显示等待、可用和完成状态。这样文本、按钮和事件共享同一个状态来源，减少各处条件漂移。

对应可运行项目在 [完整示例](../ports/complete-examples.md) 中，GUI 接线见 [界面与 TSX](ui.md)。格式依据包括目标游戏的 `common/scripted_guis/_documentation.md`、原生脚本化本地化与 meta_effect 用例，以及 [CWT 规则](https://github.com/cwtools/cwtools-hoi4-config/blob/master/Config/common/scripted_effects_locs_and_triggers.cwt)。官方主题入口为 [Effects](https://hoi4.paradoxwikis.com/Effects) 与 [Localisation](https://hoi4.paradoxwikis.com/Localisation)。
