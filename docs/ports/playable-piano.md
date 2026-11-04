# Playable Piano：让一行琴键资料连起声音和界面

原模组要让 25 个键分别对应按钮位置、快捷键、sound、soundeffect 和 WAV。最容易漏的是后两处：按钮引用的是 soundeffect 的名字，它再指向声音资源。只改按钮名或路径，界面仍可能出现，但按下去不会得到预期的音符。

[重写项目](https://github.com/maxmixalex/krieg-lang/tree/main/examples/rewrites/playable-piano)用黑键和白键两张表描述琴键。白键的位置从序号计算，黑键另记落在哪两个白键之间。下面是项目里的同一条连接：

```tsx
<For each={whiteKeys}>
  {(key, i) => (
    <ui.Button
      name={key.note + "_key"}
      position={{ x: 8 + i * 50, y: 60 }}
      className={styles.white}
      shortcut={key.shortcut}
      clickSound={piano.sounds[`${key.note}_piano_note`]}
    />
  )}
</For>
```

声音银行用 `indexBy` 从这两张表推导 clip 名和文件路径。例如白键资料 `{ note: "C1", shortcut: "z" }` 得到 `C1_piano_note`；`AudioBank` 负责生成 sound、soundeffect 与共同的混音设置。改快捷键只需要改该行；增加音符则增加一行和对应 WAV。两个音符导出相同名字时，编译器会指出重复键；访问不存在的声音句柄时，TypeScript 会在编辑阶段报错。

**怎样核对。** 验收中逐一跟踪 25 个按钮的快捷键、坐标、声音句柄、WAV 路径及文件哈希，并对比音量 0.8、压缩器、节拍器 4 帧／2 fps 与开关操作。原音频和图像从同一份输入恢复，不重新编码。实际声音设备上的延迟与音色仍需进游戏试听。

[声音与图像手册](../guide/assets.md) · [TSX 控件](../guide/ui.md) · [复现输入](index.md)
