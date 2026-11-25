# mobile-assets

[English](README.md) · 简体中文

这个仓库托管 TronClass 和 mhesi App 使用的静态资源，也提供开发和发布维护用的浏览器工具。

[工具导航](https://wisdomgardeninc.github.io/mobile-assets/pages/tools/) · [发布指南](RELEASING.zh-CN.md) · [资源清单](assets-list.md)

## 主要文件和目录

| 资源 | 用途 |
| --- | --- |
| `version_update*.json`、`version_aligner.json` | App 更新通知和 LMS 版本兼容配置。 |
| [`app-legal/`](app-legal/) 与根目录协议文件 | 隐私政策、用户协议和应用市场审核快照。 |
| [`callback.html`](callback.html)、[`identity-web-login-proxy/`](identity-web-login-proxy/) | 原生 App 身份登录资源。 |
| [`youtube-video-analysis.html`](youtube-video-analysis.html) | App 内的 YouTube 播放和观看统计。 |
| [`mhesi/`](mhesi/) | mhesi 版本、登录和 App 关联资源。 |
| [`pages/`](pages/) | 自用的浏览器工具和发版验收页面。 |
| [`scripts/`](scripts/) | 版本配置同步、npm 发版和 CDN 刷新。 |
