# 脚本化内容：复用、动态文本与 MetaEffect

脚本化内容有三个不同执行时机：辅助函数在编译时展开，`ScriptedEffect` / `ScriptedTrigger` 生成可由游戏调用的定义，`MetaEffect` 的占位符由游戏在运行时替换。先确定哪一层需要复用，再选择 API。

| 需求                           | API                               | 输出中的调用关系                  |
| ------------------------------ | --------------------------------- | --------------------------------- |
| 复用一段有类型的代码           | 普通具名函数                      | 在调用点静态展开                  |
| 多个事件共用一个原生效果       | `ScriptedEffect`、`scope.run()`   | 保留脚本化效果定义与原生调用      |
| 重用条件                       | `ScriptedTrigger`、`scope.test()` | 保留脚本化条件定义与原生调用      |
| 按状态选择显示文本             | `ScriptedLocalisation`            | 有序 `defined_text` / `text` 分支 |
| 让游戏替换原生效果片段中的参数 | `MetaEffect`                      | `meta_effect` 的 `text` 与参数块  |

## 脚本化效果与条件

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

## 有序 Scripted Localisation

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

需要原生加权文本时，某个 `texts` 条目可使用 `randomList`，每项提供 `weight` 与 `localisationKey`，并可附带条件权重修正。`localisationKey` 与 `randomList` 互斥；详细类型见 [ScriptedLocalisationText](api/hoi4.md#scriptedlocalisationtext)。随机结果、种子与本地化调用次数的实际关系由游戏版本决定，应在目标游戏中测试。

## MetaEffect：明确保留运行时替换

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

## 组合场景

一个完整重建功能可以用 `ScriptedTrigger` 统一判断政治点数与完成标记，用 `ScriptedEffect` 实施扣款和奖励，让决议和 GUI 调用同一效果，再用 `ScriptedLocalisation` 显示等待、可用和完成状态。这样文本、按钮和事件共享同一个状态来源，减少各处条件漂移。

对应可运行项目在 [完整示例](examples.md) 中，GUI 接线见 [界面与 TSX](ui.md)。格式依据包括目标游戏的 `common/scripted_guis/_documentation.md`、原生脚本化本地化与 meta_effect 用例，以及 [CWT 规则](https://github.com/cwtools/cwtools-hoi4-config/blob/master/Config/common/scripted_effects_locs_and_triggers.cwt)。官方主题入口为 [Effects](https://hoi4.paradoxwikis.com/Effects) 与 [Localisation](https://hoi4.paradoxwikis.com/Localisation)。
