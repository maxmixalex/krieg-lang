# 科技、人物、AI 与其他内容定义 {#ai}

事件和国策只是模组内容的一部分。人物、科技、装备、AI、自治、权力平衡、情报、军工组织、特殊项目和其他系统各有原生目录、根块、字段规则与作用域。Krieg 按当前规则快照提供领域定义和原生表示；选择入口时先确认你需要的具体字段属于哪一种支持层次。

## 根据任务选择入口 {#_1}

从[人物与特质](characters.md)、[科技与装备](technology.md)、[AI/政治/外交](politics-ai.md)、[工业/情报/特殊项目](industry-intelligence.md)进入各领域。每页列出对象关系、原生位置、构造器和验收要点。

| 内容                     | 与哪些系统相连                         | 首先核对                               |
| ------------------------ | -------------------------------------- | -------------------------------------- |
| 人物、顾问、领袖特质     | 国家历史、招募效果、肖像、意识形态     | 人物 ID、角色类型、特质分类与图形引用  |
| 科技、学说、装备与单位   | 科技目录、解锁、装备原型、模块、师模板 | 根目录、科技路径和前置、单位与装备关系 |
| AI 战略与计划            | 国家条件、国策选择、外交和生产目标     | 策略类型、对象、权重及启用/退出条件    |
| 动态/静态/意见修正       | ideas、国家/地区作用域、双边关系       | 修正类别、数值、变量与实际刷新时机     |
| 自治、权力平衡、阵营     | 国家状态、初始化、阈值与效果           | 原生 ID、可用性、范围及激活路径        |
| 军工组织与政策           | 允许国家、装备分类、特质树、资金       | DLC/版本前提、父特质与可解锁路径       |
| 情报机构与行动           | 升级、阶段、令牌、国家条件             | 文件族、行动阶段与作用域               |
| 特殊项目、突袭           | 科研、设施、装备、目标和奖励           | 当前版本规则、所需对象与执行上下文     |
| 书签、规则、成就、名称表 | 新游戏设置、国家引用、用户界面         | 固定根名、引用与游戏限制               |

逐主题的入口、原生路径和边界见 [功能覆盖](../../coverage.md)。效果/条件命令的可用作用域和参数类型直接查 [CWT 命令目录](../../api/commands/index.md)，不要把某个目录下的定义字段与效果命令混淆。

## 领域规则与原生规则 {#_2}

CWT 是规则快照：它描述字段、枚举、基数、引用及作用域，并可能包含别名、动态键或版本条件。由它生成的 TypeScript 类型能够帮助作者填入已建模字段；编译器的结构检查还能发现类型系统无法独立表达的基数、重复条目和原生形状问题。

规则投射不等价于游戏引擎实现。某个字段需要动态名称、重复键、作用域切换或未投射别名时，明确的 `CwtNode` / 有序结构保留原生表达能力，同时保留较窄的保证。不能因为一个命名构造器接受有序数据，就推断每个可能的组合均获得了完整游戏语义校验。

## 科技与每日挂钩 {#_3}

科技、学说、装备与单位按各自的原生根块定义，相关联的 ID 和解锁关系需一起核对。完整示例与字段职责已移到[科技、学说与装备](technology.md#technology-example)。

## 高级事件与国策形式 {#_4}

常用的 `CountryEvent`、`FocusTree`、`Decision`、`Idea` 优先表达常见作者意图。需要原生完整字段时，使用对应的 `NativeCountryEvent` / `NativeStateEvent` / `NativeNewsEvent` / `NativeUnitLeaderEvent` / `NativeOperativeEvent`、`NativeFocusTree`、`NativeDecisionCategory` / `NativeDecision` 和 `NativeIdeas`。两组入口可在同一源工程中使用，但不要让它们重复生成同一对象。

```typescript
import { ContinuousFocusPalette } from "krieg-lang/hoi4";

ContinuousFocusPalette({
  id: "tutorial_continuous_palette",
  country: { factor: 0 },
  position: { x: 50, y: 1000 },
  focus: [
    {
      id: "tutorial_continuous_training",
      icon: ["GFX_goal_generic_army_doctrines"],
      dailyCost: 0.5,
      modifier: { entries: { political_power_gain: 0.1 } },
    },
  ],
});
```

这里 `country.factor = 0` 使示例不会覆盖实际国家默认选择；接入项目时明确编写国家选择条件。连续国策按日消耗政治点数，普通国策的 `cost` 与完成奖励是另一种字段结构。共享国策、联合国策和样式分别使用 `SharedFocus`、`JointFocus`、`FocusStyle`；字段之间的引用、屏幕布局及版本限制依然需要独立验证。

## 何时使用有序结构 {#_5}

已有脚本迁移、重复同名键以及尚未专门建模的原生段落适合有序 PDX。下面是一个结构展示：条目按顺序保存，同名字段不合并。原生结构的具体字段规则仍需匹配你选择的领域。

```typescript
import { SourceFile } from "krieg-lang/hoi4";
import { atom, block, document, property, string } from "krieg-lang/pdx";

SourceFile(
  "history/units/tutorial_units.txt",
  document([
    property(
      "division_template",
      block([
        property("name", string("Tutorial Guard")),
        property(
          "regiments",
          block([
            property("infantry", block([property("x", atom("0")), property("y", atom("0"))])),
            property("infantry", block([property("x", atom("0")), property("y", atom("1"))])),
          ]),
        ),
      ]),
    ),
  ]),
);
```

这里编译器保证有序 PDX 的结构、可发射 token 与路径安全；它没有从这个任意 `SourceFile` 自动获得“师模板语义模型”。若相同内容已有专门领域入口，应选择该入口以获得其声明的字段与规则检查。

## 与项目世界联合使用 {#_6}

定义中的国家、地区、资源和 sprite 引用通常来自当前有效世界。先按原版 → 上层模组 → 项目依赖 → 当前项目的顺序配置输入，再生成世界类型。新增定义与被替换定义应使用稳定 ID；需要替换整个文件时指定确切原生路径，避免留下两个不相容版本。

涉及 DLC 或新游戏系统时，在目标版本的真实安装中确认文件布局和规则。`supportedVersion` 只写入描述符，不会使旧游戏拥有新功能；同样，规则包含某个字段也不证明用户启用了所需 DLC。

## 增加与维护一个领域 {#_7}

维护者先从当前 CWT 和原生游戏文档确定目录、外层根块、ID 位置、字段与作用域，再添加声明和降级规则。测试应包括可接受的最小定义、关键嵌套字段、重复项、非法字段/值及不合法作用域。随后更新覆盖清单和教程，运行 API 同步检查，使文档公开展示当前规则与限制。

CWT 的源码位置会保留在生成文档中。原生 Wiki 主题可从 [Modding](https://hoi4.paradoxwikis.com/Modding) 和 [覆盖清单](../../coverage.md) 跳转；本地游戏版本的文档与规则应作为最终核对上下文。
