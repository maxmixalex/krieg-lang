# Automated Research：高层 Krieg 重写

这份工程把上传模组的科研队列、进度调度、自动策略、跨局保存及界面重写为领域数据、共用算法和 TSX。构建不读取原作游戏脚本，也没有内嵌 PDX 或通用 AST 到 TypeScript 转译器。原作的图片、字体和译文等资源由 `original-assets/` 提供，路径及内容的授权沿用用户提供的资源；这些资源不复制进 Git。

## 构建与验证

在仓库根目录执行：

```sh
npm run build
node scripts/rewrite-inputs.mjs /path/to/mods.zip automated-research
node dist/cli.js world examples/rewrites/automated-research
npx tsc --noEmit -p examples/rewrites/automated-research/tsconfig.json
node dist/cli.js check examples/rewrites/automated-research
node dist/cli.js build examples/rewrites/automated-research
node examples/rewrites/automated-research/cases/verify.mjs
node examples/rewrites/automated-research/cases/verify-ui.mjs
node examples/rewrites/automated-research/cases/authoring.mjs
```

独立对照读取 `../private-mods/Automated-Research`；也可向 `verify.mjs` 传入原作路径。原作只参与测试，不参与构建。详细命令、解释器边界和各组投影见 [cases/README.md](cases/README.md)。完整项目编译还会验证 TSX、资源引用和其他作者并行补齐的组织、奖励、界面模块。

项目的 `package.json` 提供本地 Krieg 依赖和构建命令，`tsconfig.json` 继承 `krieg world` 生成的编辑器配置。标准 TypeScript 可以检查全部 50 个源文件，并为 TSX 属性、组件参数和作用域回调提供补全。

核心报告 [cases/verification.json](cases/verification.json) 当前记录 **18,831 项检查、17 组场景**。比较双方都是实际原生定义：一方来自上传原作，另一方来自 Krieg 编译结果。解释器独立执行 PDX，并在遇到未实现的原生命令时失败；它不会导入重写的领域事实来计算“预期答案”。

界面报告记录 **193,091 项检查、9 组场景**，覆盖国家化名称、组织信息、输入字符、保存队列显示、控件状态、467 个科技树矩形、修饰键点击和全部 1,499 个 sprite 声明。[cases/ui-verification.json](cases/ui-verification.json)

## 已实现的行为

| 子系统         | 高层模块及行为                                                                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 技术目录与依赖 | 552 项科技的成本、年份、前置选择、互斥路线、原生科研捕获、DLC 可见性，以及保存时使用的独立祖先关系。                                                                 |
| 队列           | 四列同步插入、删除、移动、进度暂存与恢复；自动插入或前移前置；依赖修复、删除级联、锁槽保护；普通、置顶、移至底部等玩家操作。                                         |
| 每日推进       | 原生科研槽保留、模组科研槽分配、随日期下降的提前惩罚、预计天数、完成授予、空槽最多 30 天的银行积累和复用。界面刷新不推进科研。                                       |
| 优先科研       | 借用其他合资格槽位、既有银行天数上限、锁槽资格、逐日积累与兑现、玩家移动或删除后的借用关系维护。                                                                     |
| 研究修正       | 1,040 项理念奖励、90 个共享组、XP 一次性购买和突破进度；一次性国策奖励及军工组织由独立模块处理并接入同一生命周期。                                                   |
| 自动策略       | 552 项偏好、408 项可自动选择的科技、255 个显式国家条件；历史策略与国家能力；可用项目优先、前瞻限制、五项人工优先目标、自动项目清理、玩家接管、随机前移和定期重规划。 |
| 保存           | 原作兼容的小端位流；v1/v2/v3 读取、v3 写入、名字与组织调色板、DLC 兼容标记、追加容量、删除墓碑、重复保存检查；恢复时重新验证组织。                                   |
| 界面           | TSX 科技树和窗口、真实列表绑定、筛选排序、搜索输入、组织选择、历史显示与入口；语言、图标位置和国家化名称数据独立维护。                                               |

原生名称、科技序号、组织序号及保存格式属于兼容接口，故保留原标识。原作一处 `tag = Ger` 也使用显式 `spelling: "verbatim"` 保留输入，避免在移植中擅自修改原行为。

## 为什么作者需要维护的内容更少

`technologies.krg.ts` 记录技术事实，`graph.krg.ts`、`lookup.krg.ts`、`progress.krg.ts` 共同消费；修改成本无需寻找多份科技分派树。`queue.krg.ts` 用一个四列描述维护所有行操作，进度、组织和来源不会分别编写删除或移动分支。

自动策略的原作在 `rq_ap_one`、`rq_ap_kids` 和 `rq_ap_weigh` 三份分派中重复科技知识，合计 38,515 行原生文本。这里用 `ai-facts.krg.ts`、`ai-policy.krg.ts`、`weights.krg.ts` 和 `planner.krg.ts` 表达事实、条件、公式及共用规划流程。行数受格式影响，因此不把行数比例当作开发时间或运行速度的证明。

[cases/authoring.mjs](cases/authoring.mjs) 提供可执行的修改实验：只在内存中把 `early_fighter` 的一个成本数值从 220 改为 230，重新编译，再执行真实科研槽处理器。成本查询应同步变为 230；相同初始进度 219 的完成日从第 1 天变为第 11 天；授予的科技标识保持相同。实验不编辑任何原生文件，也不修改仓库源码。结果写入 `cases/authoring.json`。

## 军工组织的内部 ID 和显示名称

比利时船厂在界面上使用本地化键 `cockerill_shipyards`，而游戏触发器识别 `BEL_cockerill_shipyards_organization`。两列保存在同一条组织记录里，分别用于界面显示与游戏逻辑。专项测试从上传原作的身份判断分支提取全部 525 个组织 ID，对比首次辨认和缓存后再次进入的结果。这捕获了 32 条记录的身份与显示键差异。

设计团队的装备变体也可拥有通用名称。重写根据变体记录生成 `name` 字段，兼容没有专属命名的国家。执行 `node examples/rewrites/automated-research/cases/verify-mio-bonus.mjs /path/to/Automated-Research` 可以重跑组织、装备变体、科研奖励和排队场景，共 10,466 项检查。

## 实测范围与尚未证明的部分

核心对照包括全部技术数据、32 组主要 DLC 组合、全部理念条目、255 条策略条件在 24 个世界中的结果、全部科技权重在 12 个世界中的结果，以及真正的自动选入队列。槽位借用测试覆盖锁槽、已用银行天数、暂停和 40 天连续执行。保存测试包含旧格式、连续记录、墓碑、默认名字、重复保存、空队列和容量上限。日期测试覆盖 1936、1939、闰日及原作 1900–1960 边界。

76 项玩家树和行操作执行到 `rq_update` 刷新边界，对照其队列变更；另外 40 项完整 `rq_tick` / `rq_update` 流程验证每日推进及重复暂停刷新。军工组织对象和一次性焦点奖励的专项测试由对应的组织感知解释器补充，不能用核心中的零组织场景替代。

这些结果不等同于在 HOI4 内启动模组：游戏渲染、完整旧存档迁移、多人同步、引擎循环预算和实际帧耗时仍需游戏内验证。工程没有以编译成功、输出文件数量或原生定义数量宣称全量等价。
