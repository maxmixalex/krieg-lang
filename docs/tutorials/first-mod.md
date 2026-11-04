# 01：安装并构建第一个模组 {#_1}

**目标：** 创建 `hello-krieg`，得到原生事件、决议和本地化。**所需资料：** Node.js 22.17 或更新版本、npm、Git；本课无需启动 HOI4。**结果：** `build/mod`、启动器描述文件和可分发 ZIP。

## 安装当前仓库版本 {#_2}

在终端运行：

```sh
git clone https://github.com/maxmixalex/krieg-lang.git
cd krieg-lang
npm ci
npm run build
npm pack
node dist/cli.js init ../hello-krieg
cd ../hello-krieg
npm install ../krieg-lang/krieg-lang-0.5.0.tgz
npx krieg check
npx krieg build
```

`npm pack` 生成本地安装包。若使用 [GitHub Actions 成功 CI](https://github.com/maxmixalex/krieg-lang/actions/workflows/ci.yml) 的 `krieg-npm-package` 归档，先解压并核对 `SHA256SUMS`，再用 `npx --yes --package=./krieg-lang-0.5.0.tgz krieg init hello-krieg` 创建项目，在项目中安装该 `.tgz`。CI 归档保留 30 天；流程不向 npm registry 发布版本。

## 理解项目中的文件 {#_3}

后续教程中的路径都相对于 `hello-krieg`。

| 路径              | 用途                                              |
| ----------------- | ------------------------------------------------- |
| `src/main.krg.ts` | 初始事件与决议；每个 `.krg.ts` 都由编译器静态读取 |
| `krgconfig.json`  | 源码、输出、本地化、资源与依赖的配置              |
| `localisation/`   | 中英文文本输入                                    |
| `.krieg/`         | 自动生成的编辑器声明                              |
| `build/mod/`      | 游戏实际读取的原生文件                            |

打开 `src/main.krg.ts`：`krieg_demo_begin` 决议花费 25 政治点，于一天后安排 `krieg_demo.1`。事件选项增加稳定度并设置完成标记。不要用 `node`、`tsx` 或 `ts-node` 执行这个文件。

## 检查输出 {#_6}

确认以下结果：

| 输出目录                                                | 应出现的内容              |
| ------------------------------------------------------- | ------------------------- |
| `events/`                                               | `id = krieg_demo.1`       |
| `common/decisions/`                                     | `cost = 25`、事件延时调用 |
| `localisation/english/` 与 `localisation/simp_chinese/` | 各自语言头与示例文本      |
| 模组根目录                                              | `descriptor.mod`          |

```sh
npx krieg pack --out ./hello-krieg.zip
```

需要自动构建时运行 `npx krieg watch`，按 `Ctrl+C` 退出。ZIP 是原生模组发布包；共享源码使用[源码包约定](../guide/projects.md#npm)。

## 接入真实游戏内容 {#_7}

在 `gameRoots` 中配置本机游戏和上层模组，运行 `npx krieg world` 后再检查。它们决定有效国家、地区与资源引用；目录顺序和覆盖规则见[项目手册](../guide/projects.md)。游戏加载与验收见[验证手册](../guide/validation.md)。

下一课：[添加事件与中文文本](event-and-localisation.md)。编辑器补全与格式化可单独查[编辑器手册](../guide/editor.md)。
