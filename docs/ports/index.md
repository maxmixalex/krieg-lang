# Ports：实际工程与迁移案例

案例用于观察一个真实项目怎样组织代码、资源、界面和验收。它与[Tutorials](../tutorials/index.md)的连续练习不同：先读项目的原始范围和保留行为，再看源码及实际构建记录。

## 原版与大型模组中的完整项目

[原版与 Kaiserreich 完整项目](complete-examples.md)提供国家、地区历史、国策、决议、事件、界面与资源的整体组织。`scripted-families` 展示有限参数表如何生成重复脚本；地图例子见[地图手册](../guide/map-atlas.md)。

## 上传模组的重写项目

下列目录对应独立的实际 port。各项目 README 说明输入来源、保留的功能、改写方式、构建命令和已执行验收；验证结论以项目记录为准。

六个最终构建的原作／重写 CWTools 比较，以及科研项目的大文件检查范围，集中记录在[外部规则检查](validation.md)。

| 项目                                        | 源工程                                                                                                          |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [Automated Research](automated-research.md) | [automated-research](https://github.com/maxmixalex/krieg-lang/tree/main/examples/rewrites/automated-research)   |
| Hearts of Gamble                            | [hearts-of-gamble](https://github.com/maxmixalex/krieg-lang/tree/main/examples/rewrites/hearts-of-gamble)       |
| Hearts of Uno                               | [hearts-of-uno](https://github.com/maxmixalex/krieg-lang/tree/main/examples/rewrites/hearts-of-uno)             |
| Playable Piano                              | [playable-piano](https://github.com/maxmixalex/krieg-lang/tree/main/examples/rewrites/playable-piano)           |
| State Transfer Tool                         | [state-transfer-tool](https://github.com/maxmixalex/krieg-lang/tree/main/examples/rewrites/state-transfer-tool) |
| TWR GDP Screen                              | [twr-gdp-screen](https://github.com/maxmixalex/krieg-lang/tree/main/examples/rewrites/twr-gdp-screen)           |

## 阅读和复现

1. 阅读项目 README 的游戏版本、上层模组和输入要求。
2. 检查 `krgconfig.json` 中的依赖、资源和覆盖路径，再阅读源码入口。
3. 执行项目记录的 `check`、`build` 和专项验收命令。
4. 对照保留行为检查原生输出；有游戏内验收记录时，再按相同环境复现。

有序导入、语义重写、构建通过和游戏运行是不同结果。保留原生资源通常合理；已经转成有类型源码的玩法应能指出具体声明、跨文件连接和行为证据。检查层次见[验证手册](../guide/validation.md)，最小迁移过程见[迁移教程](../tutorials/native-port.md)。

## 先看哪些例子

从[钢琴](playable-piano.md)跟踪一个快捷键如何连到 WAV，用[州转移](state-transfer.md)看国家与州如何协作。[GDP 面板](gdp.md)展示公式和共享排序，[UNO 与赌场](card-games.md)展示牌表、下注规则和可复用控件。[自动科研](automated-research.md)进一步把技术资料、队列、持久化和界面连接起来。每篇列出对应的原生行为检查与验证范围。

从仓库根目录运行 `node scripts/rewrite-inputs.mjs /path/to/mods.zip playable-piano` 可以恢复一个案例使用的图像、音频和翻译；省略案例名可恢复全部六项。工具校验输入版本且不复制任何原生玩法脚本。随后执行 `node dist/cli.js build examples/rewrites/playable-piano`。若手头没有上传的模组，教程区的五课不需要这些私有输入。
