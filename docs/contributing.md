# 参与开发

仓库是一个 TypeScript npm 包。编译器、SDK、PDX 工具、项目构建器和 ESLint 插件通过独立入口组织，测试使用 Node.js 自带的测试运行器。文档使用原生 Zensical 配置；API Reference 由 TypeScript Compiler API 从实际导出与 JSDoc 生成。

## 本地检查

```sh
npm ci
npm run build
npm run check
npm run generate:domains:check
npm run generate:defines:check
npm run docs:api:check
npm run docs:coverage
npm run lint
npm run format:check
npm test
npm run test:examples
npm run test:package
```

先构建再执行 ESLint，因为仓库的 ESLint 配置会使用本包构建后的插件。`test:examples` 检查示例项目，`test:package` 将本地 tarball 安装到独立目录，并验证安装后的初始化与构建流程。

需要自动排版时运行 `npm run format`。语言规则应由编译器和测试解释清楚；不要通过放宽为 `any` 或忽略错误来让检查通过。

## 测试应该覆盖什么

编译器修改应同时覆盖成功例子和错误边界。比较生成的 PDX 结构时，保留重复键和条目顺序。涉及非法 JavaScript 调用的测试，应证明编译器拒绝它，并证明源码没有被执行。

新增语法、SDK 或项目配置字段时，同时更新至少一个可运行示例和对应教程。新导入能力应验证完整的原生输入 → `.krg.ts` → 原生输出路径，而不是只比较透传文本。

正常 CI 使用仓库内可分发的合成夹具。真实游戏目录与大型模组是另外的本地语料，不能把它们复制进普通测试夹具或发布包。

## 文档

安装固定版本的 Zensical：

```sh
python -m venv .venv
.venv/bin/python -m pip install -r requirements-docs.txt
.venv/bin/zensical serve
```

Windows 使用 `.venv\Scripts\python` 和 `.venv\Scripts\zensical`。提交前执行干净的严格构建：

```sh
.venv/bin/zensical build --clean --strict
```

页面位于 `docs/`，导航和语言设置位于 `zensical.toml`。教程先解释读者要完成的任务，再说明代码与输出；长篇运行日志、数据集清单和实验记录不应替代教程。

### API 与覆盖清单

```sh
npm run docs:api
npm run docs:api:check
npm run docs:coverage
```

`docs:api` 读取 `package.json` 的每个 TypeScript 公开入口，解析真实导出、重载、接口字段、JSDoc 和 CWT 命令来源，再生成 `docs/api/`。不手工编辑生成页。`--check` 重新计算相同内容并比较文件，任何缺失、过期或多余页面都会使 CI 失败。新增公开入口也会自动纳入。

`docs/coverage-inventory.json` 将 Wiki 主题与当前 API、原生路径、教程和测试关联。检查器拒绝把仅有 `DataFile` / 有序 PDX 的条目标成语义 API，也检查证据文件和测试名称确实存在。添加功能时，先更新声明和成功/失败测试，再更新清单与教程，最后重新生成 API。新增教程的完整 `typescript` / `tsx` 代码块会进入编译测试。

相关官方说明：[Zensical 配置](https://zensical.org/docs/setup/basics/)、[构建命令](https://zensical.org/docs/usage/build/)、[GitHub Pages 发布](https://zensical.org/docs/publish-your-site/)。

## GitHub Actions

普通 CI 在 Node.js 22 和 24 上检查构建、类型、ESLint、Prettier、测试、示例以及打包安装。文档独立执行严格构建，并上传静态预览产物。

`Publish documentation` 在每次推送 `main` 时自动运行，也可手动触发。构建任务检查 API 同步与覆盖清单，执行 Zensical 严格构建并上传 Pages artifact；部署任务仅在构建成功后运行，并单独申请 `pages: write` 与 `id-token: write`。仓库的 Pages Source 必须配置为 GitHub Actions。部署日志中的 `page_url` 和成功的 `github-pages` environment 是实际发布结果。

没有自动 npm 发布工作流。发布新包前，应审核版本、包内容和许可证，并显式决定发布目标。

## 在本机或专用 runner 上跑语料

```sh
node dist/cli.js corpus /path/to/local/game --out /tmp/krieg-game-report.json
```

大型语料不放进每次 PR 的普通 CI。需要自动运行时，为可信 Linux runner 添加 `krieg-corpus` 标签，手动从 `main` 运行 `Validate local corpus`，填写 runner 本机的数据集绝对路径。

这个工作流只读取本地数据并在 runner 的临时目录写报告，不自动上传游戏文件或重建文件。语料层次的含义和失败处理见[验证与兼容性](validation.md)。

## 更新规则和对比外部检查器

维护 CWT 规则数据时，可以从本机规则目录重新生成元数据：

```sh
npm run build
node scripts/generate-schema.mjs /path/to/hoi4-rules
node scripts/generate-sdk.mjs
node scripts/generate-domains.mjs /path/to/hoi4-rules/Config
npm run build
npm run docs:api
```

Defines 的声明同样可由固定元数据重建：`npm run generate:defines`；CI 使用 `npm run generate:defines:check`。Lua 输出按独立语法解析验证，编译器不运行 Lua。

领域元数据保存在 `src/schema/hoi4-domains.json`。只从仓库中的固定元数据重建声明时，运行 `npm run generate:domains`；`npm run generate:domains:check` 检查领域声明与原生 GUI 声明是否同步，不需要本机游戏目录或上传数据。

第一次构建提供规则提取器和声明生成器；生成命令分别更新源规则快照与 SDK 声明，最后一次构建把它们放入可安装包。

使用本机的 CWTools 可执行文件对比原始目录和重建目录时，运行：

```sh
node scripts/compare-cwtools.mjs \
  /path/to/cwtools /path/to/hoi4-rules \
  /path/to/original /path/to/reconstructed ./reports/cwtools
```

如果检查目标需要基础游戏上下文，可以在最后追加 vanilla 目录。原始内容可能已经有诊断，因此应比较同一套规则和同一环境下的基线与重建结果，解释新增或消失的诊断。结构往返相同和外部检查器诊断相同是不同证据，都不能替代实际游戏运行。

## 原生领域金样本

`tests/fixtures/native-domains` 的原创样例覆盖命名领域构造器，`tests/native-domain-audit.test.mjs` 固定比较独立原生审计后的路径与输出哈希。修改字段、路由、样例或支持资源后，先跑 `node scripts/audit-native-domains.mjs --compile-only --out /tmp/domain-candidate.json` 检查编译，再按 fixtures README 用真实只读游戏目录、固定 CWT 和 CWTools 重跑外部正负审计。`--fetch-assets` 只把固定版本模型资源下载到临时审计输入，绝不能提交这些第三方二进制。

报告同时保存原规则与兼容副本；4 项兼容修正具有原生文件证据和前后哈希。先审查正向零诊断、逐域负向匹配和差异解释，再提交更新的报告。CI 不自动刷新 golden，也不会将缺少原生规则的旧式 GUI 算入 CWT 通过数。
