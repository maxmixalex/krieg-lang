# 02：添加事件与中文文本

**目标：** 点击事件选项后获得 25 政治点，并设置完成标记。**所需资料：** [01](first-mod.md) 的 `hello-krieg`。**结果：** 新的 `tutorial.1` 事件和配套中文本地化；保留初始示例。

## 写一个事件 {#event}

新建 `src/tutorial.krg.ts`，复制完整文件：

<!-- tutorial:file src/tutorial.krg.ts -->

```typescript
import { CountryEvent, Option, loc, type CountryScope } from "krieg-lang/hoi4";

export const welcome = CountryEvent({
  id: "tutorial.1",
  title: loc("tutorial.1.t"),
  description: loc("tutorial.1.d"),
  isTriggeredOnly: true,
  options: [
    Option<CountryScope>({
      name: loc("tutorial.1.a"),
      effects: (country: CountryScope) => {
        country.effects.addPoliticalPower(25);
        country.effects.setCountryFlag("tutorial_complete");
      },
    }),
  ],
});
```

`isTriggeredOnly` 表示由其他效果明确安排这个事件。`welcome` 是后续文件可以导入的句柄；这段代码只定义内容，构建时不会增加任何国家的政治点。

## 添加中文文本 {#text}

新建 `localisation/tutorial.zh.json`：

<!-- tutorial:file localisation/tutorial.zh.json -->

```json
{
  "tutorial.1.t": "新的开始",
  "tutorial.1.d": "我们已经准备好迈出下一步。",
  "tutorial.1.a": "开始行动。"
}
```

将本课的 `krgconfig.json` 替换为下面的完整配置。它保留初始中英文输入，加入新中文文件，并为下一课声明原版国家 `GER`。`world` 只声明引用，不会创建国家。

<!-- tutorial:file krgconfig.json -->

```json
{
  "$schema": "./node_modules/krieg-lang/schemas/krgconfig.schema.json",
  "name": "hello-krieg",
  "sourceDir": "src",
  "outDir": "build/mod",
  "mod": {
    "name": "My Krieg Mod",
    "version": "0.1.0",
    "supportedVersion": "1.19.*",
    "tags": ["Gameplay"]
  },
  "world": { "countries": ["GER"] },
  "localisation": [
    { "language": "english", "from": "localisation/english.json" },
    { "language": "simp_chinese", "from": "localisation/simp_chinese.json" },
    { "language": "simp_chinese", "from": "localisation/tutorial.zh.json" }
  ]
}
```

## 构建并核对

```sh
npx krieg check
npx krieg build
```

在 `build/mod/events/` 查找 `tutorial.1`。选项中应有 `add_political_power = 25` 和 `set_country_flag = tutorial_complete`；中文目录应包含新文本和 `l_simp_chinese:` 语言头。若只写了 JSON 而没在配置中声明，文本不会进入输出。

本课只添加中文教程文本；需要英文时，在英文输入中增加相同键。发布时应核对所有目标语言。详查[事件与调度](../guide/events.md)、[条件与效果](../guide/scopes.md)、[本地化格式与重复键](../guide/localisation.md)。

下一课：[国策解锁一项付费行动](focus-and-action.md)。
