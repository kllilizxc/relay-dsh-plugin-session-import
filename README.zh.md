# Relay DSH 会话导入中心

> **稳定版 `0.2.3` 已在官方 DSH `0.1.5-rc.2` 和 `0.1.6-alpha.1` 上验证。** 无需修改实现。[从 npm 安装](https://www.npmjs.com/package/relay-dsh-plugin-session-import) · [兼容性证据](https://github.com/yangbobo2021/Relay/tree/codex/relay-foundation/dsh-lab/dsh-0.1.6-alpha.1-20260915)。

> **发布通道：** `latest` → `0.2.3`；`next` → `0.2.4-rc.1`。

```bash
npx @deepseek-ai/dsh@0.1.6-alpha.1 plugin --profile web add relay-dsh-plugin-session-import@next relay-dsh-plugin-codex@next
npx @deepseek-ai/dsh@0.1.6-alpha.1 web
```

[![DSH 兼容版本](https://img.shields.io/badge/DSH-0.1.1--rc.2%20%7C%200.1.2--alpha.2%20%7C%200.1.2--alpha.3-2f7d68)](https://github.com/deepseek-ai/deepseek-harness)

[English](README.md) | 中文

面向 DeepSeek Harness 的中立会话导入入口。它只提供一个侧栏入口和类型化
Provider 插槽，Codex、Claude 等插件继续拥有各自的扫描与导入流程。

详见 [SPEC.md](./SPEC.md) 与[交付验收](./docs/spec/acceptance.md)。

已在官方 DSH `0.1.1-rc.2` 中同时安装 Codex、Claude Provider 验证：
[展开侧栏](./docs/images/session-import-wide-menu.jpg)与
[折叠侧栏](./docs/images/session-import-rail-menu.jpg)。