# 有限脚本变体

`positions.krg.ts` 的一张参数表生成三个普通 scripted effect 和三个 scripted trigger。两个事件跨文件引用同一个 `medium` 变体；每个变体只定义一次，调用仍是 `family_set_position_medium = yes`。

例子的重复结构来自所附 TNO 经济脚本中固定百分比滑块的 `consumer_goods_minimal_set_position_*`：各档设置不同常量，再调用同一更新效果。本例使用自己的变量和标记，可独立编译；没有接入 TNO 的经济系统或制作滑块界面。

在本仓库根目录运行：

```sh
npm run build
node dist/cli.js build examples/scripted-families
```

`ScriptedEffectFamily` 的参数在编译期确定。游戏执行原生定义时仍会读取实时政治点数并检查条件。见[脚本化内容指南](../../docs/scripted-content.md)。
