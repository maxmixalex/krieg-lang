# 自动科研的技术目录、队列与持久化

自动科研需要让技术资料、完成进度、策略选择、军工组织和存储格式保持一致。这个案例把可维护的事实表与共用操作拆开，修改一项科技时，成本查询、推进逻辑和界面读取同一个定义。[Automated Research 源工程](https://github.com/maxmixalex/krieg-lang/tree/main/examples/rewrites/automated-research)

## 从一次成本修改跟踪数据

`technologies.krg.ts` 记录 552 项科技的 ID、成本、年份和依赖。`lookup.krg.ts` 生成游戏变量索引对应的查询，`progress.krg.ts` 消费查询结果推进科研。`cases/authoring.mjs` 在内存中把 `early_fighter` 的成本从 220 改成 230，重新编译后执行真正的科研槽处理器。相同的初始进度 219，完成时间应从第 1 天变为第 11 天，科技身份仍由同一条目录记录提供。

这个修改实验适合检查资料有没有被复制到多份分派代码里。从仓库根目录运行以下命令，输入资源恢复方式见[案例复现入口](index.md)。

```sh
node dist/cli.js build examples/rewrites/automated-research
node examples/rewrites/automated-research/cases/authoring.mjs
```

## 按职责阅读源码

| 需要修改的行为             | 主要文件                                                | 共同维护的约束                         |
| -------------------------- | ------------------------------------------------------- | -------------------------------------- |
| 科技成本、年份、前置和互斥 | `technologies.krg.ts`、`graph.krg.ts`                   | 稳定编号、解锁关系和存储中的祖先关系   |
| 队列插入、删除和移动       | `queue.krg.ts`                                          | 科技、进度、组织和来源四列同步变更     |
| 每日进度与优先科研         | `progress.krg.ts`、`juggle.krg.ts`                      | 空槽积累、锁槽、借用关系与完成时机     |
| 自动策略                   | `ai-facts.krg.ts`、`ai-policy.krg.ts`、`planner.krg.ts` | 国家条件、技术偏好、手动目标和重新规划 |
| 军工组织与奖励             | `mio.krg.ts`、`bonus.krg.ts`                            | 组织身份、可用性、分配和一次性奖励消费 |
| 存储与恢复                 | `persistence.krg.ts`、`storage.krg.ts`                  | 位流版本、组织调色板、墓碑和容量       |
| 科技树与列表               | `tree.krg.tsx`、`queue-ui.krg.tsx`                      | 布局与绑定使用同一项技术或队列条目     |

原生科技编号、组织编号和存储位序是兼容接口。调整展示名称可以修改本地化或显示资料，重新排列目录时则需要同时考虑持久化格式。运行时数组和组织指针的类型约束见[变量与作用域](../guide/runtime-state.md)，分派表的生成方式见[目录与查表](../guide/catalogues.md)。

## 对照原作验证

核心 `cases/verify.mjs` 解析原作和编译结果，分别执行 PDX，再比较场景中的状态。当前核心记录包含 18,831 项检查和 17 组场景，覆盖全部科技资料、队列操作、科研银行、优先槽借用、自动策略以及存储版本。解释器遇到未实现的命令会失败，基础游戏的科技与国家查询由明确的场景数据提供。

```sh
node examples/rewrites/automated-research/cases/verify.mjs /path/to/Automated-Research
node examples/rewrites/automated-research/cases/verify-mio-bonus.mjs /path/to/Automated-Research
node examples/rewrites/automated-research/cases/verify-ui.mjs /path/to/Automated-Research
```

军工组织与一次性奖励、界面原生结构各有专项检查。界面报告包含 193,091 项检查和 9 组场景，覆盖完整控件与标签，1,499 项 sprite 定义与原作一致。应一起阅读各报告，尤其是组织编号到真实对象的映射、组织可用性变化和奖励消耗。核心、专项与修改实验的结果分别记录在工程的 `cases/` 目录。

实际游戏的固定点精度、引擎循环预算、旧存档的完整迁移、客户端绘制和多人同步需要游戏内验收。CWTools 的直接检查会跳过部分大文件，完整复核的输入处理和结果见[六个案例的外部规则检查](validation.md)，各检查层次见[验证手册](../guide/validation.md)。
