# 协议文件迁移与根目录清理

`app-legal/` 是 TronClass 新版 App 使用的协议目录。根目录的协议文件继续服务旧版 App、官网和部分应用市场链接。根目录文件按各自调用方的迁移情况清理，目前没有统一删除日期。

## 迁移时间

| 日期 | 变更 |
| --- | --- |
| 2026-07-15 | `mobile-assets` 提交 `86c8cc2` 将协议文件整理到 `app-legal/`，保留根目录地址。`mobile-2.0` 提交 `f21a352cb` 将启动隐私摘要、弹窗详情和登录页协议链接切到新目录。 |
| 2026-09-03 | `v2.16.0`（构建 `v2.16.0.67`）是首个包含这次迁移的发版标签。已核对的旧版本 `v2.14.5`、`v2.15.1` 仍走根目录。 |
| 2026-11-25 | `mobile-assets` 提交 `1c069d1` 将根目录渲染出的协议链接统一到 `app-legal/policy-jump.html`，根跳转页继续兼容旧链接。同一提交在原审核快照内更新了儿童隐私链接，快照地址沿用原七牛路径。 |

## 根目录文件何时可以删

| 根目录文件 | 删除前确认 |
| --- | --- |
| `policy-jump.html` | 确认仍走根路径的 TronClass 旧版客户端已退役，并确认当前审核快照已按原七牛路径部署更新后的儿童隐私链接。 |
| `summary-privacy-policy-zh-CN.md`、`summary-privacy-policy.html` | 旧版 App 启动时直接请求摘要 Markdown。确认这些客户端已退役，以及摘要 HTML 的旧链接已迁移到 `app-legal/`。 |
| `privacy-policy.html`、`user-agreement.html`、`children-privacy-policy.html` | 确认 LMS 官网和 `mobile-apple` 已迁移或退役直接链接。仍开放的历史审核快照也要核对，2023-10-18 快照直接链接七牛根目录的 `children-privacy-policy.html`。 |
| `privacy_policy_google_play.html` | 到 Play Console 核对登记地址。如果还登记着根目录 URL，先完成商店地址迁移并确认生效。 |
| 根目录的协议 JSON、Markdown、JS 和 CSS 配套文件 | 确认仍在服务的页面和客户端均已停止请求对应路径。与同一批可退役的页面一起清理。 |

2026-11-25 的仓库配置允许 iOS、Google Play 和大陆 Android 从 `2.14.5` 继续使用，因此旧版 App 所需的根目录文件仍要保留。退役前同时核对统一配置与旧客户端读取的独立配置。 [统一版本配置](../version_update.json) · [iOS 兼容配置](../version_update_ios.json) · [Android 兼容配置](../version_update_android.json)

应用市场登记的带日期快照继续使用原七牛 URL。 [审核快照说明](store-review/README.md) · [当前快照](store-review/privacy-policy-2026-07-15.html) · [2023 年快照](store-review/privacy-policy-2023-10-18.html)

退役某批路径时，同步核对刷新脚本、npm 包和各托管位置。七牛对象需要单独处理。 [CDN 刷新脚本](../scripts/refresh_cdn.sh) · [npm 打包配置](../package.json)
