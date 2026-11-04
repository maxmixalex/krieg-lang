# Reference：查名称、签名与命令

已经知道要查什么时使用本区。规则和取舍见[领域手册](../guide/index.md)，按步骤完成项目见[教程](../tutorials/index.md)。

| 已知信息        | 查找位置                                         | 能查到什么                                       |
| --------------- | ------------------------------------------------ | ------------------------------------------------ |
| CLI 动词或参数  | [命令行](cli.md)                                 | 项目参数、游戏根、导入、语料和 JSON 输出         |
| 作者任务        | [API 按任务索引](../api/index.md)                | 构造器、Spec 和返回句柄的同页入口                |
| 效果/条件原生名 | [命令目录](../api/commands/index.md)             | `snake_case` 命令、重载、参数、作用域与 CWT 来源 |
| 输出目录或领域  | [内容定义目录](../api/domains.md)                | 对应领域构造器、原生路径与字段                   |
| Lua 参数        | [Defines 命名空间](../api/defines/namespaces.md) | 根、命名空间、键名和值类型                       |
| 工具模块        | [公开模块](../api/reference/index.md)            | compiler、project、pdx、ui、ESLint               |
| 支持范围        | [Wiki 覆盖与证据](../coverage.md)                | 语义 API、结构检查、原生资源和验证边界           |

## 搜索方法

站内搜索可直接输入 `CountryEvent`、`completionReward`、`add_political_power` 或 `START_DATE`。符号页将参数、返回类型和相关 Spec 放在一起，避免在只含一个字段的页面之间来回切换。代码声明是签名来源；修改公开 API 后由 `npm run docs:api` 同步生成。

0.3 和 0.4 的已发布 URL 与锚点仍能到达对应内容。旧地址不进入新导航和搜索；按新的领域或任务入口继续浏览即可。
