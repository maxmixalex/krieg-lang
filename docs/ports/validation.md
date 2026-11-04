# 六个案例的外部规则检查

六个重写工程使用同一份上传的 CWTools 二进制、CWT 规则和基础游戏语料，分别检查原始目录与最终构建目录。比较按严重级别、错误代码和消息统计重复次数，忽略重写带来的文件名与行号变化。以下为这次完整复核的诊断总数。

| 工程                | 直接检查原作 | 直接检查重写 | 包含全部大文件的原作 | 包含全部大文件的重写 | 新增诊断 |
| ------------------- | -----------: | -----------: | -------------------: | -------------------: | -------: |
| Playable Piano      |            4 |            4 |                    4 |                    4 |        0 |
| State Transfer Tool |            0 |            0 |                    0 |                    0 |        0 |
| TWR GDP Screen      |            2 |            1 |                    2 |                    1 |        0 |
| Hearts of Gamble    |          459 |           14 |                  459 |                   14 |        0 |
| Automated Research  |        2,637 |        5,165 |                7,275 |                5,163 |        0 |
| Hearts of UNO       |          500 |            1 |                  500 |                    1 |        0 |

“新增诊断”来自完整消息多重集比较，包含相同消息新增的重复次数。原作已有的音效引用、本地化或规则限制仍保留在报告中，不能从新增项为零推断项目完全没有诊断。

## 为什么科研项目有两组结果

所提供的 CWTools 会在文件发现阶段静默跳过超过 2,097,152 字节的文件。最小探针验证了这个边界，相同有效效果放在恰好 2 MiB 的文件中可被引用，增加一个空白字节后文件被跳过，调用处出现 `CW263`。

原科研模组有五个文件超过上限，包括生成效果、存储效果、两份脚本本地化和英文翻译。重写版有三个，包括 `rq_bits_load`、`rq_name_codes` 和英文翻译。直接比较会遗漏不同内容，因此原始计数看起来新增了 3,343 个 `design_team` 引用错误和两个效果调用错误。

完整复核只在临时副本中处理这些文件。PDX 去除多余缩进后按顶层定义拆分，每个定义保持完整，并通过解析后的语义比较核对键、顺序、重复项、运算符和字符串。本地化按完整条目行拆分，为每份副本重复语言头，逐行核对文本序列。原始输入、构建产物和 CWT 规则均保留各自的内容与哈希记录。

包含所有文件后，两个效果调用诊断消失。3,343 个军工组织引用诊断在原作和重写中完全相同，所提供规则将 `design_team` 限定为 `mio:<military_industrial_organization>`，游戏自带效果文档则明确允许变量引用。这个差异应随规则版本记录。

## 复现与读取报告

先按[案例入口](index.md)恢复资源并构建六个项目，再在仓库根目录运行以下命令。`corpora` 包含 `cwtools`、`cwtools-hoi4-config-master/cwtools-hoi4-config-master` 和 `Hearts of Iron IV`，也可用 `--game-root` 指定基础游戏目录。

```sh
node scripts/audit-rewrite-cwt.mjs \
  --corpora /path/to/corpora \
  --originals /path/to/unpacked-mods \
  --out /tmp/krieg-cwtools.json \
  --include-large-files \
  playable-piano state-transfer-tool twr-gdp-screen \
  hearts-of-gamble automated-research hearts-of-uno
```

工具逐个执行原作与重写检查，每完成一个工程就保存结果。报告同时记录二进制 SHA-256、各错误类型、完整消息分组、示例位置、增减集合、被大小限制遗漏的路径，以及临时拆分文件的哈希。`includingLargeFiles` 保存包含大文件的第二组结果。实现见[外部检查脚本](https://github.com/maxmixalex/krieg-lang/blob/main/scripts/audit-rewrite-cwt.mjs)。

规则检查用于核对原生结构和已索引引用。行为对照的场景与解释器范围见各案例页面，客户端绘制、实际声音播放和多人同步的验收需要在目标游戏中执行。
