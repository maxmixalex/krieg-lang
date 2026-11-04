# Guides：按领域查规则

手册按概念和对象组织，可以独立查阅。每个主题解释用途、输入/输出、相邻系统和限制；完整字段交给 API Reference。想跟着步骤完成一个项目，先读[Tutorials](../tutorials/index.md)。

| 领域       | 手册入口                                                                              | 典型问题                                     |
| ---------- | ------------------------------------------------------------------------------------- | -------------------------------------------- |
| 语言       | [执行模型](language.md)、[作用域](scopes.md)                                          | `if` 何时执行？怎样切换到地区拥有者？        |
| 玩法       | [事件](events.md)、[国策](focuses.md)、[行动与决议](actions.md)、[民族精神](ideas.md) | 如何安排事件、写 AND/OR 前置或避免重复扣费？ |
| 复用       | [脚本效果/条件、有限变体、MetaEffect](scripted-content.md)                            | 源码展开和原生运行时调用有什么区别？         |
| 人物       | [人物、领袖与特质](domains/characters.md)                                             | 定义、招募、角色和肖像怎样关联？             |
| 科技与部队 | [科技、学说、装备](domains/technology.md)                                             | 解锁、装备原型和编制怎样接通？               |
| 政治与 AI  | [AI、政治与外交](domains/politics-ai.md)                                              | 状态、权重、目标和生命周期如何安排？         |
| 工业与情报 | [军工、行动与特殊项目](domains/industry-intelligence.md)                              | 阶段、父特质、科研和奖励需要哪些资料？       |
| 国家与地图 | [国家历史](countries-maps.md)、[地图索引与铁路](map-atlas.md)                         | 国家、地区、省份与基础地图怎样联合检查？     |
| 文本与资源 | [本地化](localisation.md)、[图像/音频/Defines](assets.md)                             | 输入格式、原生资源与重复键如何处理？         |
| 界面       | [TSX 与行为](ui.md)、[样式和 Stack](styles.md)                                        | 布局、按钮行为、状态刷新怎样连接？           |
| 工程       | [配置与依赖](projects.md)、[编辑器](editor.md)                                        | 目录覆盖、世界引用、源码包如何组织？         |
| 迁移与排错 | [原生导入](native-import.md)、[验证层次](validation.md)、[源码追踪](debugging.md)     | 当前检查证明了什么，游戏错误对应哪行源码？   |

原生内容的整体选择原则见[领域入口与边界](domains/index.md)。需要某个精确命令、参数或路径时转到[查询入口](../reference/index.md)，需要看实际工程取舍时转到[port 案例](../ports/index.md)。

[目录与运行时查表](catalogues.md)解释静态与游戏期查找；[变量与数组](runtime-state.md)列出作用域和存储期；[动态列表与修饰键](window-interaction.md)用于按游戏状态重复条目。
