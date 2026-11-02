# 本地化：YAML、原生文本与动态选择

本地化有两层：文本文件提供翻译，`ScriptedLocalisation` 根据游戏状态选择文本键。普通文本适合 YAML 或 JSON；迁移现有模组时可以保留原生 `.yml` 的顺序、版本号、注释与转义。动态选择的 API 见 [脚本化内容](scripted-content.md)。

## 选择输入格式

| 输入    | 默认识别 | 适用场景                         | 构建行为                                    |
| ------- | -------- | -------------------------------- | ------------------------------------------- |
| `.yaml` | `yaml`   | 新写的平面键值表、多行段落       | 排序键、转义内容，生成带 BOM 的 HOI4 `.yml` |
| `.json` | `json`   | 编辑器或数据工具生成的字符串字典 | 与 YAML 生成相同的原生格式                  |
| `.yml`  | `hoi4`   | 现有 HOI4 本地化文件             | 检查后保留文本；缺少 BOM 时补上             |

HOI4 的 `KEY:0 "text"` 是自己的本地化方言，不能当作普通 YAML 解析。扩展名不同有意区分两者；已有文件名称不方便更改时，使用配置中的 `format` 显式指定。

```json
{
  "localisation": [
    { "language": "english", "from": "localisation/en.yaml" },
    { "language": "simp_chinese", "from": "localisation/zh.yaml" },
    { "language": "english", "from": "localisation/legacy.yml", "format": "hoi4" }
  ]
}
```

这是 `krgconfig.json` 的相关字段，其他项目字段见 [项目配置](projects.md)。输出名称为 `localisation/<language>/<项目名>_<输入文件名>_l_<language>.yml`，多个输入文件应使用不同的文件名。

## 编写 YAML 文本

```yaml
reconstruction_title: "重建委员会"
reconstruction_desc: |
  工厂需要修复，铁路需要重新连通。
  委员会建议先拨出一笔应急资金。
reconstruction_cost: "投入 §Y25§! 点政治点数"
reconstruction_ready: "[ROOT.GetName] 的准备已经完成。"
reconstruction_count: "100"
```

键只能含字母、数字、下划线、点和连字符；值必须是字符串。数字或布尔值需要加引号，避免 YAML 将它们解析为数值或真假值。多行字符串会转换为原生文本内的 `\n`；双引号、反斜杠、换行和制表符会按原生输出要求转义。YAML 输入不使用嵌套对象、数组、别名或自定义标签。

文本中的 `$OTHER_KEY$`、`[ROOT.GetName]`、颜色标记与图标标记会作为文本保留。它们是否符合当前游戏的本地化格式、对象与作用域，由游戏解释；Krieg 不在构建时计算这些插值。查阅目标安装中的 `documentation/loc_objects_documentation.md` 与 `loc_formatter_documentation.md`，不要把 TypeScript 模板插值与游戏文本插值混用。

## 保留原生 `.yml`

```yaml
l_english:
 reconstruction_title:0 "Reconstruction Council"
 reconstruction_desc:3 "A first line.\nA second line with \"quotes\"."
 # A translator's note remains here.
 reconstruction_cost:0 "Invest §Y25§! political power"
```

文件必须有且只有一个合法的 `l_language:` 头，且与配置的 `language` 相同。每个条目要缩进，值用双引号包围；已有整数版本号和可省略版本号都会保留。注释、键顺序、原有换行风格及显式转义不被重写。检查失败会提供文件与行号，便于翻译维护者定位问题。

支持的语言标识是 `english`、`french`、`german`、`spanish`、`braz_por`、`polish`、`russian`、`japanese`、`simp_chinese`、`korean`。普通 JSON/YAML 会生成 UTF-8 BOM、语言头和版本 `0`；原生输入只在需要时添加 BOM。

## 重复键与依赖

同一个输入内的重复键会失败，包括 JSON 的重复属性。最终项目与依赖的有效输出也会检查 `(language, key)` 重复，包含通过 `assets` 放入的原生本地化文件。不同语言可以使用相同键；同一语言应只保留一个有效定义。

需要替换依赖文件时，按 [资源覆盖规则](projects.md) 显式声明同路径覆盖；覆盖发生后才检查最终文件集合。新文件里重新定义另一个仍存在文件的同语言键，会作为重复定义报告。基础游戏视图不会被重新打包为项目本地化。

## 从文本到动态选择

在事件、决议或界面中，`loc("reconstruction_title")` 表达一个本地化键。它不会自动创建对应翻译。`ScriptedLocalisation` 定义的名称则通过游戏表达式如 `[GetReconstructionStatus]` 使用，定义内的每个 `localisationKey` 仍需提供翻译。

完整的 YAML、动态文本与双语言示例见 [原版与 Kaiserreich 项目](examples.md)。原生格式的官方主题链接是 [Localisation](https://hoi4.paradoxwikis.com/Localisation)，相关验证边界见 [功能覆盖](coverage.md)。
