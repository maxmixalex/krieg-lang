# 项目、资源与依赖

一个 Krieg 项目由源码、配置和资源组成。构建器先解析依赖顺序，合并项目看到的游戏内容，再检查源码与资源，最后生成模组目录。这样，编辑器中的国家与地区引用和构建时使用的视图来自同一份配置。

## `krgconfig.json`

下面是一份包含常用字段的配置：

```json
{
  "$schema": "./node_modules/krieg-lang/schemas/krgconfig.schema.json",
  "name": "my-mod",
  "sourceDir": "src",
  "outDir": "build/mod",
  "mod": {
    "name": "我的模组",
    "version": "0.1.0",
    "supportedVersion": "1.19.*",
    "tags": ["Gameplay"],
    "replacePath": [],
    "dependencies": []
  },
  "dependencies": [],
  "assets": [{ "from": "gfx", "to": "gfx" }],
  "localisation": [{ "language": "simp_chinese", "from": "localisation/zh.yaml" }],
  "gameRoots": [],
  "world": { "countries": ["GER"], "states": [1] },
  "strictAssets": true
}
```

只有实际存在的资源目录和本地化文件才应加入配置。`supportedVersion` 是写入模组描述文件的目标版本声明，应按你实际测试的游戏版本设置。

| 字段           | 含义                                             |
| -------------- | ------------------------------------------------ |
| `name`         | 稳定的项目标识，用于输出名称和生成文件           |
| `sourceDir`    | `.krg.ts` 源码所在目录，默认 `src`               |
| `outDir`       | 构建目录，默认 `build/mod`；必须与输入目录分开   |
| `mod`          | 写入模组描述文件的信息                           |
| `dependencies` | 显式 Krieg 依赖，可以是 npm 包名或本地项目路径   |
| `assets`       | 从项目输入复制到游戏相对路径的资源规则           |
| `localisation` | 语言和 JSON 字典输入                             |
| `gameRoots`    | 按顺序叠加的本机游戏或模组根目录                 |
| `world`        | 额外显式声明的国家标签、地区编号，适合自包含测试 |
| `strictAssets` | 启用资源结构与引用检查，默认 `true`              |

配置会拒绝拼错的字段、目录逃逸和输入输出重叠。模组目录应使用项目内的独立位置；构建器只替换属于同一 Krieg 项目的既有构建输出。

## 游戏目录与世界引用

`gameRoots` 的顺序从底层到上层：

```json
{
  "gameRoots": [
    "/games/Hearts of Iron IV",
    {
      "path": "/mods/my-overhaul",
      "replacePath": ["common/country_tags", "history/states"]
    }
  ]
}
```

路径保存在你自己的项目配置中；不要把别人的机器路径当作通用默认值。配置发生变化后，运行：

```sh
npx krieg world
```

生成的声明提供按当前项目裁剪的虚拟模块：

| 模块                    | 示例                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `@project/countries`    | `countries.GER`                                                                         |
| `@project/states`       | `states[1]`                                                                             |
| `@project/assets`       | `assets["gfx/interface/example.dds"]`                                                   |
| `@project/localisation` | `messages.reconstruction_title`（键名和译文预览）、`translated`（全部项目语言均有译文） |
| `@project/geography`    | `geography.states[1].provinces[3838].id`（按地区缩小省份选择范围）                      |

这些成员来自当前有效视图。依赖与替换路径改变世界内容后，旧成员可能消失，相关引用会得到类型诊断。

世界视图也会读取源码中的声明。原生导入产生的有序 PDX 国家标签与地区文件、字面量 `DataFile` 以及 `StateHistory` 的明确地区 ID，都会在完整类型检查前参与索引。这个步骤只读取已识别 SDK 调用的静态结构，遵守依赖顺序与替换路径，不执行 JavaScript，也不会把未调用辅助函数里的“可能定义”加入世界。

如果国家或地区元数据需要通过辅助函数展开才能确定，预先声明准确的 `world.countries` 或 `world.states`。工具会用 `KRG_WORLD_SOURCE` 提示无法在声明发现阶段确定的元数据；它不会为了消除类型错误而接受任意标签或编号。

Krieg 当前按指定目录的直接文件处理 `replacePath`。例如 `history/states` 替换该目录中的文件；它不会自动把所有更深层子目录都视为同一个替换目录。请显式列出需要替换的目录，并检查构建与世界诊断。

## 资源与路径冲突

资源规则将输入文件或目录映射到模组内路径：

```json
{
  "assets": [
    { "from": "gfx", "to": "gfx" },
    { "from": "audio/theme.ogg", "to": "music/theme.ogg" }
  ]
}
```

路径冲突会得到错误。确实需要让当前层覆盖依赖中的同路径资源时，为该规则声明 `"override": true`。不同大小写却会落到同一文件的输出路径也会被拒绝，避免在不同操作系统上得到不同结果。

`strictAssets` 检查已支持的图片和资源头、地图相关结构及文件引用。对于完整转换项目，应配置真实 `gameRoots`，让检查器能够看到基础游戏提供的文件。关闭该选项会减少检查，不会修复缺失文件或无效资源。

## 本地化

本地化输入是键到字符串的 JSON 对象：

```json
{
  "example.1.t": "新的计划",
  "example.1.d": "第一行。\n第二行。",
  "example.1.a": "执行计划。"
}
```

构建时会生成带 UTF-8 BOM、语言头和转义文本的 `.yml` 文件。支持的语言标识包括 `english`、`french`、`german`、`spanish`、`braz_por`、`polish`、`russian`、`japanese`、`simp_chinese` 和 `korean`。

同一语言内重复的键应在输入层修复。不同语言可以使用相同键；这正是多语言文本的正常组织方式。

## npm 源码包

可复用库通过 `package.json` 中的 `krieg` 字段声明项目配置和源码入口：

```json
{
  "name": "@my-team/krieg-common",
  "version": "0.1.0",
  "type": "module",
  "files": ["src", "krgconfig.json", "localisation"],
  "krieg": {
    "config": "krgconfig.json",
    "exports": {
      ".": "src/index.krg.ts",
      "./rewards": "src/rewards.krg.ts"
    }
  }
}
```

使用 `npm pack` 可以在本地测试这个包的安装结果。消费项目通过 npm 安装它，放入 `package.json` 的 `dependencies`，便会自动发现其 `krieg` 声明；也可以在 `krgconfig.json` 的 `dependencies` 中显式列出它。

消费方的源码可以导入导出的辅助函数：

```typescript
import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
import { grantReward } from "@my-team/krieg-common/rewards";

ScriptedEffect("my_reward", (country: CountryScope) => {
  grantReward(country, 25);
});
```

编译器读取被声明的 `.krg.ts`，不会执行 npm 包中的 JavaScript。普通 JavaScript 依赖不会因为已安装就自动变成 Krieg 库。

依赖图先构建依赖，再构建消费项目。循环依赖、同包多份安装导致的游戏符号歧义和输出冲突都会得到诊断。`mod.dependencies` 则是写给启动器的模组名称，和这里的源码依赖是两个不同字段。

## 构建与打包

```sh
npx krieg build
npx krieg pack --out build/my-mod.zip
```

构建会生成模组目录、`descriptor.mod`、相邻的启动器 `.mod` 文件以及输出清单。打包命令生成可分发 ZIP，把模组目录和可移植的启动器描述文件放在一起。失败的检查不会替换上一次成功构建的模组目录。

## 原生与 YAML 本地化

`localisation` 条目可使用 JSON 字符串字典、平面 YAML 字符串字典或 HOI4 原生 `.yml`。默认按扩展名识别：`.json` → JSON、`.yaml` → YAML、`.yml` → HOI4；也可用 `format` 显式选择 `json`、`yaml`、`hoi4`。完整转义、BOM、重复键与原生保留规则见 [本地化](localisation.md)。

一次命令可用重复 `--game-root` 覆盖基础游戏输入，按原版到上层模组排列；`--game-replace-path` 应用到最后一个命令行游戏根，用于需要显式目录替换的上层模组。它们不修改已提交配置，见 [CLI](cli.md)。
