# 完整示例：原版与 Kaiserreich

仓库提供两种阅读深度：`first-mod` 和 `logistics` 用少量文件说明基本机制；`vanilla-complete` 和 `kaiserreich-complete` 将国家、地区、军队、玩法、界面、双语文本和资源组合为可以检查与构建的完整模组项目。所有示例源代码、人物设定与随包美术均为示例原创内容；本地游戏和模组仅作为读取上下文。

| 项目                   | 场景                   | 主要入口                                            |
| ---------------------- | ---------------------- | --------------------------------------------------- |
| `first-mod`            | 第一个事件与决议       | 初始化布局、构建、本地化                            |
| `logistics`            | 复用后勤与地区逻辑     | 作用域、辅助函数、依赖                              |
| `scripted-families`    | 有限参数表与具名变体   | 类型化参数、跨模块句柄、普通原生调用                |
| `vanilla-complete`     | 科西嘉公民共和国 `KRG` | 原版地区 1 的完整替换、国家创建、重建玩法           |
| `kaiserreich-complete` | 撒丁重建联盟 `KRL`     | Kaiserreich 地区 114 的完整替换、依赖叠加与重建玩法 |

两个完整示例已使用新作者接口：`programme.krg.ts` 中的 `FocusGraph` 用节点和关系描述玩法，决议通过类型化句柄查询国策、安排事件；`interface.krg.tsx` 中的 `ScriptedWindow` 把控件和点击、显示条件写在同一处。实际写法见[国策图与事件调度](typed-gameplay.md)、[界面与 TSX](ui.md)和[本地化键补全](localisation.md)。

## 从仓库执行

```sh
git clone https://github.com/maxmixalex/krieg-lang.git
cd krieg-lang
npm ci
npm run build
npm run test:examples
```

最后一条命令会检查仓库中的独立示例，不要求你提交本地游戏文件。要根据实际安装核对完整引用，再执行对应的基础目录命令。

### 有限脚本变体 {#scripted-families}

`scripted-families/src/positions.krg.ts` 用一张固定百分比与成本表生成三个效果和三个条件，`main.krg.ts` 中两个事件复用同一个 `medium` 句柄。每个变体只定义一次，事件中只写原生 `name = yes` 调用。这种结构适合滑块档位、固定奖励和预设建设计划。参数在编译期确定，游戏条件仍在运行时检查；详细边界见[脚本化内容](scripted-content.md)。

```sh
node dist/cli.js build examples/scripted-families
```

### 原版项目

```sh
node dist/cli.js check examples/vanilla-complete \
  --game-root "/path/to/Hearts of Iron IV"
node dist/cli.js build examples/vanilla-complete \
  --game-root "/path/to/Hearts of Iron IV"
node dist/cli.js pack examples/vanilla-complete \
  --game-root "/path/to/Hearts of Iron IV" \
  --out ./vanilla-complete.zip
```

项目创建新的国家标签，提供原创领袖、完整的科西嘉地区定义、开局师模板与单位、国策和决议、事件、脚本化效果、动态文本、GUI 与旗帜。它保留基础地图的现有省份边界，通过确切文件路径替换地区历史；战略区域数据按所用世界的省份集合编写。

### Kaiserreich 项目

```sh
node dist/cli.js check examples/kaiserreich-complete \
  --game-root "/path/to/Hearts of Iron IV" \
  --game-root "/path/to/Kaiserreich"
node dist/cli.js build examples/kaiserreich-complete \
  --game-root "/path/to/Hearts of Iron IV" \
  --game-root "/path/to/Kaiserreich"
node dist/cli.js pack examples/kaiserreich-complete \
  --game-root "/path/to/Hearts of Iron IV" \
  --game-root "/path/to/Kaiserreich" \
  --out ./kaiserreich-complete.zip
```

目录顺序表示原版先载入、Kaiserreich 再覆盖，项目最后叠加。这里的 `--game-root` 是构建上下文；启动游戏时仍需启用匹配版本的 Kaiserreich，并保留该示例的模组依赖。示例在撒丁岛构建新的原创小国玩法，不把 Kaiserreich 的叙事、头像或其他专有资产复制到输出。

## 阅读与修改顺序

先读 `krgconfig.json`，了解本地包、资源映射、翻译和世界引用。随后按下表阅读源码；每次只调整一个层次，再运行 `check` 和 `build`，对照生成的原生文件。

| 文件 / 目录             | 阅读目标                                                | 适合练习的修改                               |
| ----------------------- | ------------------------------------------------------- | -------------------------------------------- |
| `src/country.krg.ts`    | 标签、颜色、人物、国家/地区历史、OOB                    | 改原创国家文本、初始点数或建筑，保留合法引用 |
| `src/map.krg.ts`        | 地区所属战略区域与原生地图结构                          | 对照基础区域修改天气配置                     |
| `src/programme.krg.ts`  | 国策、决议、事件、脚本化条件/效果、本地化与 meta effect | 修改重建成本与奖励，并检查所有调用处         |
| `src/interface.krg.tsx` | 容器、控件、sprite 与 Scripted GUI 接线                 | 调整布局、文本或按钮显示条件                 |
| `localisation/`         | YAML 与原生 `.yml` 双语言输入                           | 为新增键同时补齐英文与简体中文               |
| `assets/`               | 原创图片、旗帜等原生字节                                | 用符合原生规格的自制资源替换                 |
| `packages/civic-kit/`   | 显式 Krieg 源码包与共享逻辑                             | 增加有类型的辅助函数并在项目导入             |

当原生结构具有重复键时，源码会保留有序表示，例如同一师模板中的多个 `infantry`。不要把这种结构简化为重复 JavaScript 属性；后一个属性会覆盖前一个。专门的领域 API 会在可建模时提供更强的字段检查，见 [内容定义](content-domains.md)。

## 检查输出与运行

成功输出位于各项目的 `build/mod`；构建结果还提供启动器描述文件路径和每个输出的哈希清单。先确认预期的 `common`、`history`、`interface`、`localisation` 与 `gfx` 文件都出现，再在游戏中启用匹配依赖。压缩包是可移植发布产物，不包含作为 `gameRoots` 提供的基础游戏或大型模组。

构建成功证明当前类型、静态语法、资源及已实现引用检查通过。确认新国家可选、事件能触发、国策与决议正确结算、动态文本和按钮更新，以及读档后的状态一致，仍属于游戏内验收。示例 README 记录各自前提，验证层次见 [验证与兼容性](validation.md)。
