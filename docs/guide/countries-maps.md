# 创建国家与修改地图 {#_1}

国家定义、地区历史与地图是互相引用的一组文件。先确定当前基础游戏和上层模组的有效世界，再添加国家、分配现有地区或修改地图；这样标签、地区编号、省份编号和原生路径都有明确来源。

## 一个可加载国家需要什么 {#_2}

| 内容             | 原生位置                                   | 需要互相对应的标识                    |
| ---------------- | ------------------------------------------ | ------------------------------------- |
| 国家标签         | `common/country_tags/`                     | 标签 → `countries/` 内的定义文件      |
| 颜色与图形文化   | `common/countries/`                        | 国家标签中的文件名、合法色彩和文化    |
| 开局国家历史     | `history/countries/`                       | 标签、首都地区、OOB、人物             |
| 地区历史         | `history/states/`                          | 地区 ID、省份集合、拥有者、核心、建筑 |
| 人物与肖像       | `common/characters/`、`gfx/`、`interface/` | 招募人物 ID、sprite、实际贴图         |
| 开局军队         | `history/units/`                           | 国家历史的 OOB 名、师模板和省份位置   |
| 旗帜             | `gfx/flags/`、`medium/`、`small/`          | 标签及需要的意识形态后缀              |
| 本地化与可选国策 | `localisation/`、`common/national_focus/`  | 标签、形容词、领袖、国策等文本键      |

新增标签并不自动赋予地区；改变地区拥有者也不会自动创建标签、旗帜或政府。仓库的 [两个完整示例](../ports/complete-examples.md) 将这些内容放在一起，并用原创人物和美术替代复制游戏资产。

## 标签、颜色与图形文化 {#_3}

`CountryDefinition` 同时输出国家标签映射和 `common/countries` 中的定义；颜色会保留原生 `rgb` 标签。它与国家历史、地区和旗帜共同构成国家，而不会凭空生成这些资源。

导入或复制原生国家文件时，颜色也可以使用合法的无标签三元组，例如 `color = { 40 140 125 }`。国家标签文件中的 `dynamic_tags = yes` 是原生控制项，用于后续动态标签，不是国家标签本身；项目检查会保留这两种原生写法。

```typescript
import { CountryDefinition } from "krieg-lang/hoi4";

CountryDefinition({
  id: "KRG",
  graphicalCulture: "western_european_gfx",
  color: [40, 140, 125],
});
```

## 国家历史与地区历史 {#_4}

```typescript
import { CountryHistory, StateHistory, country, state, type CountryScope } from "krieg-lang/hoi4";

CountryHistory({
  country: country("KRG"),
  capital: state(1),
  oob: "civ_1936",
  startingTrainBuffer: 1,
  history: (country: CountryScope) => {
    country.effects.set_political_power(100);
    country.effects.set_stability(0.65);
    country.effects.set_war_support(0.2);
  },
});

StateHistory({
  state: state(1),
  path: "history/states/1-France.txt",
  name: "civ_island_name",
  manpower: 325000,
  category: "town",
  provinces: [3838, 9851, 11804],
  owner: country("KRG"),
  cores: [country("KRG"), country("FRA")],
  resources: { steel: 2 },
  buildings: {
    infrastructure: 3,
    industrial_complex: 2,
    3838: { naval_base: 2 },
  },
  victoryPoints: [{ province: 3838, value: 5 }],
});
```

这段展示历史 API，假定配套标签、文本、OOB 与基础地图已经存在。`StateHistory` 输出的是完整地区定义；省略原地区的字段不会把它们自动合并回来。覆盖现有地区时使用其确切原生 `path`，避免生成两个具有相同 ID 的地区文件。国家历史同样提供 `path`，用于替换现有历史。

`world.countries` 与 `world.states` 可为独立编译提供引用范围；它们不生成游戏定义。实际项目应结合源定义和 `gameRoots` 生成的世界类型，运行 `krieg world` 后在编辑器使用 `@project/countries` 与 `@project/states`。

## 地图中不同层次的含义 {#_5}

| 层次       | 文件                                       | 修改会影响什么                              |
| ---------- | ------------------------------------------ | ------------------------------------------- |
| 省份边界   | `map/provinces.bmp`                        | 每个像素属于哪个省份                        |
| 省份元数据 | `map/definition.csv`                       | ID、RGB、陆地/海洋/湖泊、沿海、地形与大陆   |
| 地区       | `history/states/`                          | 省份分组、拥有者、人口、资源、建筑与胜利点  |
| 战略区域   | `map/strategicregions/`                    | 区域省份集合、海洋地形与天气                |
| 邻接       | `map/adjacencies.csv`、规则文件            | 特殊跨海、通道或不可通行连接                |
| 补给网络   | `map/railways.txt`、`map/supply_nodes.txt` | 铁路路径与节点                              |
| 外观       | 地形、河流、高度、树木及纹理               | 各自的可视或地形数据；不是省份 RGB 表的替代 |

复用现有省份时通常只需编辑相应历史与区域数据；真正改变边界时才需要维护位图和省份定义。旧 Wiki 的 `supplyareas` 属于另一版本的补给系统，不能替代当前铁路和补给节点文件。

## 联合校验 {#_6}

构建器在有效世界上检查地图。基础检查覆盖省份 ID/RGB 唯一性、位图格式与未知颜色、尺寸、地区/区域重复 ID 和省份归属、铁路及补给行结构和省份引用。国家检查关注标签、国家定义、首都、OOB、人物、拥有者与旗帜；附加地图检查的准确范围见 [覆盖清单](../coverage.md) 和当前 API。

原生海峡邻接允许省略默认的 `sea` 类型；邻接终止行同样可以保留空类型列。浮动港的位置记录可以引用陆地端点，海军基地及 `naval_base_spawn` 则检查海洋端点。海洋省份通常使用大陆编号 `0`，但原版也存在已分配大陆的海洋省份，因此这类情况只发出警告；引用不存在的大陆仍是错误。

有基础目录时，缺失引用可以与完整上下文核对；没有基础目录的独立示例只证明自己写出的文件和已知声明通过检查。项目自有文件与基础世界应区别诊断，避免把读取基础游戏等同于重新制作或重新打包全部游戏内容。

```sh
node dist/cli.js check examples/vanilla-complete \
  --game-root "/path/to/Hearts of Iron IV"

node dist/cli.js check examples/kaiserreich-complete \
  --game-root "/path/to/Hearts of Iron IV" \
  --game-root "/path/to/Kaiserreich"
```

## 在游戏中完成验证 {#_7}

成功构建后，把生成的模组和启动器描述文件放到本地模组加载环境，使用与配置一致的版本和依赖顺序。检查开局是否出现新国家、首都与拥有者是否正确、军队是否位于合法省份、旗帜是否在不同尺寸界面显示，再检查铁路、通行、天气和相关日志。地图检查无法替代游戏完整加载与路径搜索。

原生主题入口：[Country creation](https://hoi4.paradoxwikis.com/Country_creation)、[State modding](https://hoi4.paradoxwikis.com/State_modding)、[Map modding](https://hoi4.paradoxwikis.com/Map_modding)、[Strategic region modding](https://hoi4.paradoxwikis.com/Strategic_region_modding)。
