# 图片、音频、模型与其他原生资源

资源管线把已有文件放到正确的游戏路径，保留其字节，并执行已建模的格式和引用检查。适合图片、旗帜、音频、模型、字体、shader 以及其他由游戏直接读取的内容。资源本身不经过 TypeScript 求值，也不会因为放入项目就自动生成对应的游戏定义。

## 声明资源目录

```json
{
  "assets": [
    { "from": "assets/gfx", "to": "gfx" },
    { "from": "assets/sound", "to": "sound" },
    { "from": "assets/common/defines", "to": "common/defines" }
  ]
}
```

`from` 相对于项目根目录，`to` 是模组输出中的游戏路径。可以映射单个文件或整个目录；项目之外的路径、上级目录跳转和对编译器元数据的覆盖会被拒绝。多个资源映射落到同一目标也会报错。

项目需要覆盖依赖包的同路径资源时，在该资源规则设置 `"override": true`。它是明确的替换意图，并不改变原生数据库中不同文件同名对象的游戏解释规则。依赖加载与 `replacePath` 见 [项目与依赖](projects.md)。

## 每类资源的作者工作

| 资源         | 常用位置                          | 配套定义                        | Krieg 检查的层次                                                     |
| ------------ | --------------------------------- | ------------------------------- | -------------------------------------------------------------------- |
| 图片与图标   | `gfx/interface/`、`gfx/leaders/`  | `.gfx` sprite、人物或 GUI 引用  | PNG、DDS、BMP、TGA 头部与尺寸；已知文件引用                          |
| 国家旗帜     | `gfx/flags/`、`medium/`、`small/` | 国家标签与意识形态后缀          | 常见旗帜格式与尺寸、国家工作流中的引用                               |
| 音效         | `sound/`                          | `.asset` 音效名及脚本/GUI 引用  | Ogg/WAV 容器头与原生文件路径；不解码声音                             |
| 音乐与电台   | `music/`                          | 音轨 `.asset`、权重与电台定义   | 字节保留、已有通用音频与引用检查                                     |
| 模型与动画   | `gfx/models/`                     | `.asset` 实体、mesh、动画、贴图 | `Mesh` / `Entity` / `ModelAnimation` 有类型，二进制字节保留          |
| 字体         | `fonts/` 与相关 interface 定义    | 字体注册与 GUI 的 `font`        | 路径和字节保留；不重新生成字体或验证字形                             |
| 粒子与后处理 | `gfx/particles/`、`gfx/FX/`       | 原生粒子、shader 与实体定义     | `Particle` / `PdxParticle` 有类型；shader 字节保留，视觉在游戏内验证 |
| Lua Defines  | `common/defines/*.lua`            | 原生 `NDefines` 设置            | `Defines` / `DefineFile` 生成真实 Lua；键、值类型和安全路径检查      |

文件头通过检查只表示它看起来符合已建模容器结构，不能替代完整图像/音频解码，也不证明游戏支持它使用的压缩模式、shader、骨骼或字体组合。

## Sprite 与图片分开管理

图片先作为资源进入 `gfx/`，再通过 `SpriteFile` / `Sprite` 定义名字和文件路径，最后由界面、事件或其他内容引用 sprite 名称。代码与完整示例见 [界面与 TSX](ui.md)。导入已有 `.gfx`、`.asset` 或 `.gui` 时，有序 PDX 保留重复条目和原扩展名，适合复杂动画 sprite、字体或模型定义。

如果报错提示文件引用不存在，先检查资源是否真的映射到了声明的 `texturefile` 等路径，注意大小写与 `/` 分隔符。只把名称加入 `world` 或只写一个 `GFX_` 字符串，不会创建文件。外部基础资源需要通过 `gameRoots` 提供检查上下文。

## 用类型编写 Lua Defines

`Defines` 将已知根、命名空间和键投射为 TypeScript 字段；未识别的键或错误值类型会导致编译失败。它生成静态 Lua 赋值，不执行 Lua。可以与 `.krg.ts` 中的其他游戏定义共同构建：

```typescript
import { Defines, DefineFile } from "krieg-lang/hoi4";

Defines("tutorial_tuning", {
  NDefines: { NGame: { EVENT_TIMEOUT_DEFAULT: 14 } },
});

DefineFile("common/defines/tutorial_trains.lua", {
  NDefines_Graphics: { NGraphics: { MIN_TRAIN_WAGON_COUNT: 2 } },
});
```

第一个调用默认写入 `common/defines/krieg_tutorial_tuning.lua`，第二个明确指定输出路径。当前声明包括 `NDefines`、`NDefines_Graphics` 和 `NDefines_CareerProfile`；生成事实只含键名与值类型，没有复制原版默认值。[Defines API](api/defines.md) 按根和命名空间组织全部键。数值能通过类型检查，并不保证该平衡参数在特定版本或组合下具有预期体验。

需要保留手写复杂 Lua 时，可继续使用资源目录逐字节复制；它不会获得 `DefineFile` 的键名检查。源代码中的 JavaScript 函数仍不会被执行。

## 地图资源的额外约束

`provinces.bmp`、`terrain.bmp`、`rivers.bmp`、`heightmap.bmp` 和 `trees.bmp` 各有不同像素格式及地图含义。不能统一保存成普通 PNG 或对所有 BMP 使用同一种色深。地图表格、位图和省份归属的联合检查见 [国家与地图](countries-maps.md)。

图形制作仍在熟悉的图像、音频和三维工具中进行，导出的最终文件放进项目资源目录。构建产生的 manifest 记录路径、大小和 SHA-256，便于确认一次修改是否真的进入输出以及打包是否可重现。

原生主题参照 [Graphical asset modding](https://hoi4.paradoxwikis.com/Graphical_asset_modding)、[Entity modding](https://hoi4.paradoxwikis.com/Entity_modding)、[Sound modding](https://hoi4.paradoxwikis.com/Sound_modding) 与 [Defines](https://hoi4.paradoxwikis.com/Defines)。这些主题的当前支持层次与证据见 [功能覆盖](coverage.md)。
