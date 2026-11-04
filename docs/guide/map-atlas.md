# 省份图集与铁路规划 {#_1}

Krieg 可以读取最终生效的省份位图，按州和战略区域索引省份，并把有序途经点转换为原生铁路路径。构建器保留完整的现有 `map/railways.txt`，再追加新连接。这项功能用于编写地图数据，不会在事件中执行铁路命令，也不会模拟游戏中的补给。

## 在 TypeScript 中浏览地图 {#typescript}

按加载顺序配置本地游戏和模组的数据根目录，然后运行 `krieg types .` 或 `krieg build .`。生成的 `@project/geography` 模块为每个区域提供精确的省份属性：

```ts
import { geography, baseGeography } from "@project/geography";

const berlin = geography.states[64].provinces[6521];
const provinceId = berlin.id;
const originalBerlin = baseGeography.states[64].provinces[6521];
```

省份引用携带字面量类型的 `id`、`kind`（`"land"`、`"sea"` 或 `"lake"`）和 `terrain`。区域对象携带原生 ID 和本地化键。悬停说明显示省份所属的州和战略区域。名称来自原生元数据中的本地化键，不是翻译后的显示名称。

`geography.states[stateId].provinces` 和 `geography.strategicRegions[regionId].provinces` 都只包含实际属于该区域的省份键。访问其他州的省份会产生 TypeScript 错误。未分配归属的省份不会出现在虚构的区域下。海洋和湖泊省份可以属于战略区域，其字面量类型会如实保留。

使用标准 TypeScript 键补全时，把光标放在 `geography.states[64].provinces[""]` 的引号内，候选项就是该州的省份 ID。选定后，`["6521"]` 和 `[6521]` 都是合法的 TypeScript 访问方式；`.6521` 不是合法的 JavaScript 语法。对得到的省份引用使用普通点补全，会显示 `id`、`kind` 和 `terrain`。

既有 Krieg 编写 API 需要数值省份 ID 时，传入 `.id`。这些引用是编译期值，编译后成为实际数字，不会输出运行时 JavaScript 对象。各区域索引共享省份类型。通过真实生成的项目符号按字面量键访问时，编译器只解析所选属性，无须把整个世界构造为编译器值。

### 当前地理数据与基础快照 {#_2}

`baseGeography` 描述 `gameRoots` 按加载顺序和 `replace_path` 规则合并后的生效数据，取自项目资源、依赖包和源码声明应用之前。

`geography` 包含项目资源和可被静态发现的源码声明。字面量形式的 `StateHistory` 省份列表、导入的原生文件，以及完整的 `DataFile`／有序 PDX 州和战略区域声明，都会参与这份视图。项目的 `replacePath` 会先移除对应的旧元数据，再索引新声明。

如果某个州通过辅助函数生成省份列表，源码发现过程可能知道州 ID，却无法提前得到列表。此时 Krieg 会让当前州的省份补全保持为空，并报告 `KRG_ATLAS_INCOMPLETE` 警告。普通构建仍可编译该辅助函数；铁路规划在编译完成后运行，读取已生成的完整原生州文件。

改写某个州自身的省份列表时，应从 `baseGeography` 读取现有归属。如果读取该州正在计算的 `geography` 列表，声明就会依赖自身：

```ts
import { StateHistory, state, country } from "krieg-lang/hoi4";
import { baseGeography } from "@project/geography";

// An illustrative state replacement: preserve the full intended membership,
// not just the single province shown here.
StateHistory({
  state: state(64),
  path: "history/states/64-Brandenburg.txt",
  name: "STATE_64",
  manpower: 1000000,
  category: "city",
  owner: country("GER"),
  provinces: [baseGeography.states[64].provinces[6521].id],
});
```

替换州文件时应使用实际存在的原文件路径；另建一个声明相同州 ID 的文件会报错。这个例子用于说明引用机制，不是完整的勃兰登堡州历史。自动化测试另行验证完整六省州的替换、TypeScript 诊断和原生输出。

## 声明铁路走廊 {#_3}

`krgconfig.json` 中的 `railways` 是内置编写 API。它接受端点和可选的有序中间途经点，无须作者逐一列出沿途所有相邻省份：

```json
{
  "name": "railway-extension",
  "gameRoots": ["/path/to/Hearts of Iron IV"],
  "railways": {
    "routes": [
      {
        "name": "east-corridor",
        "level": 1,
        "via": [6521, 6282],
        "avoidStates": [65]
      }
    ]
  }
}
```

请根据实际加载的地图选择省份 ID 和排除项。示例端点之间可能已经存在其他等级的铁路，这会产生明确的冲突诊断，不会隐式升级继承的路网。可复现验证脚本会为每份真实地图分别选取尚未占用的三省走廊，再通过同一个 CLI 验证构建；不一致的输入组合会记录为失败，不会被正向对照结果替代。

运行：

```sh
krieg check .
krieg build .
```

路径依据**编译完成后的最终生效地图**规划，包括生成的州历史。每对相邻途经点之间使用广度优先搜索，以跨越省界数最少为目标。邻居按省份 ID 升序访问，因此等长路径的选择可重复。`avoidProvinces`、`avoidStates` 和 `avoidStrategicRegions` 是可选的已知 ID 数组。途经点被排除、排除项不存在、某段不可达或路径重复经过某个省份，都会产生诊断。

途经点顺序必须保持。规划器独立求取各段最短路径，如果合并后重复经过省份，就拒绝该路线。它不会求解“经过所有途经点的全局最短简单路径”这一更复杂的问题。各段合并成环时，请更换途经点或拆成多条路线。

### 安全地输出完整文件 {#_4}

HOI4 把 `map/railways.txt` 作为整份文件加载。如果只输出新请求的走廊，就会删除继承世界中的铁路网。Krieg 按以下步骤生成文件：

1. 读取经过加载顺序、项目资源和源码输出合并后的完整铁路文件。
2. 检查原生行能否安全解释，并验证基线涉及的每个省份。
3. 根据最终图集规划新路线。
4. 保留基线的每一个字节，包括注释、换行符和既有特殊连接。
5. 仅追加新边；遇到已存在的同等级边时，把新路线拆成对应的原生行。

原生行格式为 `level count province province ...`。同等级重叠会共用已有边。请求与已有边不同的等级会产生 `KRG_RAILWAY_CONFLICT`，不会隐式覆盖等级。真实基线路网中也存在同一条边在多行中具有不同等级的情况；这些行保留原顺序和原字节，只有新增请求触及这种等级不明确的边时才会被拒绝。新增路线彼此冲突时也会报错。对已生成的输出重复应用同一规划，不会追加重复行。

完整基线中的省份必须存在、属于陆地、实际出现在位图中，并具有州归属。`createRailwayOverlay` 自身就会验证这一边界：失败时返回 `KRG_RAILWAY_BASE_LAND`，指向基线源文件和原始行号，并且不返回输出文件。保留原始行不意味着跳过这些基础有效性检查。既有特殊连接不会被重新解释为普通陆地接壤，也不要求它们满足新增路线的保守邻接规则。

缺少基线文件时，默认产生 `KRG_RAILWAY_BASE`。有意从空路网开始制作全面转换地图时，可以显式设置 `"allowEmptyBase": true`。已有的空基线文件本身就是明确的空路网。规划失败不会产生铁路输出；项目构建失败时，也不会替换上一次成功构建的产物。

生成的覆盖文件包含原生整文件替换所必需的继承铁路数据，不会把无关游戏文件复制到模组中。

## 使用带类型的项目 API {#api}

构建脚本和其他 Node 工具可以通过 `krieg-lang/project` 导入相同实现。回调收到的图集来自最终生效的世界：

```ts
import { buildProject } from "krieg-lang/project";

const result = buildProject(".", {
  railways: (atlas) => ({
    routes: [
      {
        name: "planned-link",
        level: 2,
        via: [atlas.land(6521), atlas.land(6282)],
        avoidProvinces: [atlas.land(3340)],
      },
    ],
  }),
});

if (!result.success) console.error(result.diagnostics);
```

回调在调用方的 Node 构建脚本中执行，不属于静态编译的 `.krg.ts` 语言。`RailwayLevel` 是联合类型 `1 | 2 | 3 | 4 | 5`。`LandProvinceRef` 要求字面量类型 `"land"`，因此带类型的海洋或湖泊对象不能作为铁路途经点。JSON 配置仍可使用普通数值 ID，加载图集后会检查其有效性。`atlas.land(id)` 也会拒绝不存在、未绘入位图或没有州归属的省份。

需要重复进行地理操作而不重建项目时：

```ts
import { ProvinceAtlas, writeEditorProject } from "krieg-lang/project";

const world = writeEditorProject(".");
const atlas = new ProvinceAtlas(world.effectiveFiles);
const route = atlas.planRailway({
  via: [atlas.land(6521), atlas.land(6282)],
  avoidStates: [65],
});

console.log(route.provinces, route.steps);
console.log(atlas.provinceAt(100, 200));
```

`writeEditorProject` 返回编译前可发现的世界。地理数据由辅助函数生成时，请使用 `buildProject` 的铁路回调取得最终编译后的图集。用不完整的元数据构造图集会产生明确错误。

`indexGeography(files)` 提供不解码位图的轻量定义／州／区域索引。`ProvinceAtlas.neighbors(id)` 暴露包括水域在内的物理接壤，便于检查地图。`canBuildRailwayBetween(a, b)` 应用规划器的保守陆地检查。`createRailwayOverlay(files, plan)` 返回诊断、已解析路线和行数；成功时还返回完整的原生 `OutputFile`。

## 图集验证的范围 {#_5}

解码器要求未压缩的 24 位 BMP，使用 40 字节 `BITMAPINFOHEADER`、单个颜色平面和完整像素行。它按 BGR 解释字节，处理每行四字节对齐，并统一处理正高度的自下而上位图和负高度的自上而下位图。`provinceAt(x, y)` 使用左上角为原点的栅格坐标。每个像素的颜色都会与 `definition.csv` 核对。

只有水平和垂直接触才形成省界，角点接触不会。世界的左右边界默认环绕连接。针对明确不环绕的测试地图，可以使用 `new ProvinceAtlas(files, { wrapX: false })`。上下边界不会环绕。

新增铁路路径要求省份是已绘制、州归属明确的陆地省份。路径会排除不可通行州，以及 `adjacencies.csv` 中列出的所有省份对：不可通行边被阻断；带条件的海路、海峡或规则连接不会被视为一定可铺设铁路的陆地接壤。原文件中的特殊铁路连接仍予保留。

这些检查确定保守的地理连续性，不评估当前控制者、所有者、外交通行权、脚本邻接条件、河流补给、铁路转换、补给吞吐量或引擎运行时寻路。作者不主动排除时，路线也可以跨州或跨国界。构造器生成的物理图可供复用，但不保证游戏中一定能通行。

随附的 [Map modding 文章，修订版 105627](https://hoi4.paradoxwikis.com/index.php?title=Map_modding&oldid=105627#Supply_nodes_and_railways)，日期为 2026-10-21，记录了原生铁路格式，以及无效、不存在、无州归属或不连续定义可能导致崩溃的情况。同文的[邻接章节](https://hoi4.paradoxwikis.com/index.php?title=Map_modding&oldid=105627#Adjacencies)区分了不可通行连接和带条件的海路连接。

## 复现真实地图检查 {#_6}

运行 `npm ci` 和 `npm run build` 后，提供三份随附文本快照和完整地图的本地副本：

```sh
node scripts/validate-map-atlas.mjs \
  --corpora /private/corpora \
  --provided-maps /private/provided-maps \
  --wiki /private/offline-wiki \
  --out /tmp/map-atlas.json
```

输入目录结构为 `corpora/Hearts of Iron IV/map`、`corpora/Kaiserreich`、`corpora/TNO`、`provided-maps/KR/map` 和 `provided-maps/TNO/map`。裁剪后的 Kaiserreich 文本快照使用已记录的固定版本描述文件中的显式替换路径；这不能证明随附二进制地图与其版本一致。脚本不修改源文件，也不把源文件加入 Git。临时原生输出会在检查后删除。

脚本记录核心输入指纹，扫描全部真实像素，验证标准 TypeScript 的精确区域补全和悬停信息，检查排除规则与冲突，并尝试真实 CLI 构建。成功的输入组合还会进行两次构建、逐字节比较完整原始铁路前缀，并验证原生输出的确定性。原始组合若含缺失州归属等输入问题，会保留失败诊断及未执行检查的原因；不得把这类结果写成零错误通过。

需要验证有来源的配套州数据时，可额外传入 `--kr-states <固定官方配套根目录>`。该对照单独记为 `Kaiserreich-matched`，不会替换原始 Kaiserreich 组合的结果，也不能据此推断其余模组文件的版本。

本轮已记录的[验证报告](https://github.com/maxmixalex/krieg-lang/blob/main/reports/validation/map-atlas.json)区分以下四组输入。定义数包含省份 0 哨兵；物理边数包含水域接壤，不等于可铺设铁路的边数。

| 输入组合                         | 省份定义数 | 物理边数 | 原铁路行数 | 真实 CLI 结果                                   |
| -------------------------------- | ---------: | -------: | ---------: | ----------------------------------------------- |
| 原版快照                         |     13,414 |   39,715 |        909 | 两次成功；保留全部原字节并新增 1 行             |
| 上传 KR 地图 + 原 KR 文本快照    |     13,951 |   41,372 |      1,030 | 两次拒绝；18 个铁路省份缺少州归属，不写铁路输出 |
| 上传 TNO 地图 + 原 TNO 文本快照  |     20,006 |   59,464 |      2,756 | 两次成功；保留全部原字节并新增 1 行             |
| KR 地图 + 有来源的固定配套州数据 |     13,951 |   41,372 |      1,030 | 两次成功；保留全部原字节并新增 1 行             |

四组输入的标准 TypeScript 区域省份补全和字面量 ID 悬停检查均通过，语义诊断为 0。这项编辑器检查不能抵消原 KR 组合的铁路构建失败。单元测试和集成测试还覆盖位图方向与行对齐、角点接触、边界环绕、无州归属和未绘制省份、不可通行州、源码覆盖，以及从基础快照完整替换州省份列表。
