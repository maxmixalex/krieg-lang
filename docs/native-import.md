# 导入原生脚本

迁移现有模组时，第一步通常是保留文件的已有结构。Paradox 脚本允许重复键、裸值和同一块中的混合条目，普通 JavaScript 对象无法完整表达这些结构。Krieg 使用有序 PDX AST 表示它们。

## 导入一个文件

单文件导入需要声明它在游戏中的目标路径：

```sh
npx krieg import ./old-event.txt --out ./migrated-mod --path events/tutorial.txt
```

命令创建一个完整的 Krieg 项目。源脚本被转换为 `.krg.ts` 构造器调用，输出路径仍是 `events/tutorial.txt`。如果输入是一个模组目录，可以直接导入整个目录：

```sh
npx krieg import ./existing-mod --out ./migrated-mod
```

工具按文件类别转换 PDX 脚本，并复制其他资源。输出必须使用独立目录；解析失败会返回诊断并保留已有目标目录。

## 导入后的源码是什么

例如原始文件包含重复条件：

```text
example_effect = {
  add_political_power = 25
  set_country_flag = prepared
  set_country_flag = rewarded
}
```

有序表示会显式保留每个条目：

```typescript
import * as pdx from "krieg-lang/pdx";

export default pdx.file(
  "common/scripted_effects/example.txt",
  pdx.document([
    pdx.property(
      "example_effect",
      pdx.block([
        pdx.property("add_political_power", pdx.atom("25")),
        pdx.property("set_country_flag", pdx.atom("prepared")),
        pdx.property("set_country_flag", pdx.atom("rewarded")),
      ]),
    ),
  ]),
);
```

这是可编辑的 TypeScript AST 构造代码，返回的表示标记为 `ordered-pdx`。它没有被自动改写成 `ScriptedEffect`、`CountryEvent` 等更高层结构。需要更有表达力的代码时，可以逐个把稳定的小区域改写成语义 API，并比较前后的原生输出。

## 构造器

| 构造器                                | 表达的结构                                 |
| ------------------------------------- | ------------------------------------------ |
| `pdx.atom(text)`                      | 未加引号的 token；数值和宏也保留其文本形式 |
| `pdx.quoted(text)`                    | 已有转义词法内容的带引号 token             |
| `pdx.string(text)`                    | 普通字符串，构造时转义引号与反斜杠         |
| `pdx.property(key, value, operator?)` | 键、值及可选运算符，默认 `=`               |
| `pdx.block(items)`                    | 有序块，可以包含重复属性和裸值             |
| `pdx.tagged(tag, block)`              | 如 `rgb { ... }` 的带标签块                |
| `pdx.document(items)`                 | 文件的根条目                               |
| `pdx.file(path, document)`            | 输出路径及文档                             |

不能把 `set_country_flag` 写成普通对象的两个同名属性，然后期望它们都会保留。需要重复键时，使用 `pdx.property` 条目数组。

## 保留结构和保留原文

默认发射器会规范化缩进与空白，省略注释，但保留条目顺序、重复属性、运算符、引号 token、宏以及带标签的块。这里的往返比较是有序语法结构比较。

解析 API 另有显式原文保留模式，可用于取回解析时保存的文本。原文透传不能证明 AST 修改后的结果等价，也不能替代重新发射和比较。迁移测试应检查规范化输出，而不是只把输入文本复制回去。

## 结构化数据文件

不需要重复键或特殊有序结构时，可以使用 `DataFile`，以类型受限的普通记录表达数据：

```typescript
import { DataFile } from "krieg-lang/hoi4";

DataFile("common/scripted_variables/tutorial.txt", {
  "@tutorial_reward": 25,
  "@tutorial_stability": 0.05,
});
```

该入口接受字符串、数字、布尔值、国家与地区引用，以及由这些值组成的嵌套记录或数组。输出标记为 `structured-data`。它检查数据形状，不提供每一种游戏数据库的完整字段语义验证；不能据此声称某个尚未建模的游戏领域已有专用 SDK。

需要重复键、显式运算符、带标签块或严格控制条目顺序时，继续使用有序 PDX。迁移工具默认生成有序表示，不会猜测一个原生文件是否适合自动改写成 `DataFile`。

## 整个语料目录的验证

```sh
npx krieg corpus /path/to/local/mod \
  --name my-mod \
  --out ./reports/my-mod.json \
  --imported ./migration-sources \
  --generated ./reconstructed-mod
```

报告、迁移源码和重建目录必须放在输入目录外。命令会分类输入文件，记录哈希，并分别统计解析、规范化结构往返、构造器静态重编译、完整 TypeScript 编译以及附属文件语法检查。

语料中的原始语法错误仍会进入报告，后续无法执行的层会记为跳过。没有被选为 PDX 脚本的图片、说明文件和地图表不会混进 PDX 成功率。每一层的含义见[验证与兼容性](validation.md)。

完成导入后，在目标项目安装 Krieg，运行 `krieg check` 和 `krieg build`，然后逐步把需要维护的内容改写成语义 API。
