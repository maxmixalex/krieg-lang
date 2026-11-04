# 05：迁移一份原生脚本

**目标：** 将现有脚本转换为可编辑源码，保留两个同名标记效果的顺序。**所需资料：** 已安装 Krieg；本页给出的原生样本。**结果：** 独立 `migrated-aid` 项目，重建后仍有两条 `set_country_flag`。

## 准备原始文件

在 `hello-krieg` 旁创建 `old-aid.txt`，写入：

<!-- tutorial:native old-aid.txt -->

```text
tutorial_legacy_aid = {
  add_political_power = 25
  set_country_flag = tutorial_prepared
  set_country_flag = tutorial_rewarded
}
```

## 导入到独立目录

在 `hello-krieg` 项目中执行：

```sh
npx krieg import ../old-aid.txt --out ../migrated-aid   --path common/scripted_effects/tutorial_legacy_aid.txt
cd ../migrated-aid
npm install ../krieg-lang/krieg-lang-0.5.0.tgz
npx krieg check
npx krieg build
```

`--path` 指定游戏中的相对路径。目标必须为空；导入目录不能位于输入目录内部。完整目录迁移可以直接传入模组根目录，见[导入手册](../guide/native-import.md)。

## 阅读迁移源码并比较

打开生成的 `src/` 文件，找到三个有序 `pdx.property` 条目。两个 `set_country_flag` 分别存在。它们不能改成一个普通对象里的两个同名属性，因为后者无法保存重复条目。

再打开 `build/mod/common/scripted_effects/tutorial_legacy_aid.txt`，按顺序核对 `add_political_power = 25`、`tutorial_prepared`、`tutorial_rewarded`。缩进可能变化；验收关注 token、运算符、顺序和重复项。

需要维护某段玩法时，再把该段改写为具名 `ScriptedEffect`，对照原生语义。完整导入保留结构；逐项改写才能把国家作用域、条件和句柄纳入更高层类型检查。查询[有序 PDX API](../api/pdx.md)和[验证层次](../guide/validation.md)。

真实项目包含资源、GUI、翻译与跨文件引用；继续阅读[实际 port 案例](../ports/index.md)，按各项目的输入与验收记录复现。
