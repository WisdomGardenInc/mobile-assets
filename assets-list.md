# 资源托管

| 文件或目录 | 托管位置 | 用途 |
| --- | --- | --- |
| `version_update*.json`、`version_aligner.json` | 七牛、jsDelivr（以已发布包为准） | TronClass 版本通知和 LMS 版本兼容配置 |
| `toggle.json` | 七牛、jsDelivr | 开关配置，七牛由 `version` 范围刷新 |
| 根目录与 `app-legal/` 下的协议及配套文件 | 七牛、GitHub Pages、jsDelivr（包内文件） | App 和官网的协议页面 |
| 根目录 `privacy_policy_google_play.html`、`app-legal/store-review/*.html` | 七牛、GitHub Pages | 审核使用七牛根目录地址，Pages 保留仓库副本 |
| `callback.html` | 七牛、jsDelivr | 原生 App 登录回调 |
| `identity-web-login-proxy/` | GitHub Pages、七牛 | App 的 Google 登录走 Pages，七牛有上传副本 |
| `youtube-video-analysis.html` | GitHub Pages、七牛、jsDelivr | App 的 YouTube 播放与统计走 Pages |
| `mhesi/version/*.json` | jsDelivr | mhesi 版本配置的 CDN 发布入口，Pages 有仓库副本 |
| `mhesi/third-party-login-proxy/`、`mhesi/apple-app-site-association` | GitHub Pages | mhesi 登录回调和 Apple App 关联 |
| `pages/` | GitHub Pages | 团队工具、发版预览和发布状态检查 |
| `favicon.ico` | 七牛、GitHub Pages | 站点图标 |
| `tools/` 下的旧工具 | 七牛 | 已单独上传的工具副本 |

[七牛上传和刷新范围](scripts/refresh_cdn.sh) · [审核快照清单](app-legal/store-review/README.md) · [npm 打包配置](package.json) · [jsDelivr 已发布包](https://cdn.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/) · [GitHub Pages 站点](https://wisdomgardeninc.github.io/mobile-assets/)
