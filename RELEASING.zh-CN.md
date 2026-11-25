# 发布指南

[English](RELEASING.md) · 简体中文

版本通知和协议共用以下发布流程。命令在本仓库根目录执行，首次运行前先执行 `yarn install`。

## 升级并打 Tag

1. 用 `git diff` 核对变更，自行 `git add` 和 `git commit` 本次要发布的文件。
2. 升级 npm 包版本并创建 Tag。

   ```bash
   node scripts/upgrade_version.js
   ```

3. 推送分支和 Tag，触发 GitHub Actions 发布 npm 包。 [发布工作流](.github/workflows/publish.yml)

   ```bash
   git push && git push --tags
   ```

## 刷新 CDN

### 检查发布状态

打开[发布状态检查页](https://wisdomgardeninc.github.io/mobile-assets/pages/check-release.html)，查看 npm 和 jsDelivr 的最新版本。填入本次 `package.json` 的版本号或 Git Tag，两处都显示「已就绪」后再刷新。 [npm 包](https://www.npmjs.com/package/@wisdomgarden/mobile-assets) · [jsDelivr 包数据](https://data.jsdelivr.com/v1/package/npm/@wisdomgarden/mobile-assets)

### 选择刷新范围

按本次改动选择对应命令。

```bash
bash scripts/refresh_cdn.sh version   # 版本通知、LMS 兼容配置、七牛的 toggle.json
bash scripts/refresh_cdn.sh legal     # 根目录和 app-legal/ 的协议文件
bash scripts/refresh_cdn.sh mhesi     # 刷新 mhesi 的 jsDelivr 缓存
bash scripts/refresh_cdn.sh identity  # 上传 Google 登录代理到七牛
bash scripts/refresh_cdn.sh all       # 所有范围，省略参数时也是如此
```

- 七牛上传和刷新使用 `qshell`，存储空间为 `lms-mobile`。jsDelivr 缓存刷新使用 `curl`。
- 要纳入上传或刷新的文件，在脚本里修改对应分组。 [刷新脚本](scripts/refresh_cdn.sh)
- npm 内容已经正确时，可用本次发布的文件单独重刷。只使用新版本的固定 jsDelivr 地址时，可跳过刷新。 [jsDelivr 缓存说明](https://www.jsdelivr.com/tools/purge)

## 发布 App 更新通知

1. 在 `mobile-assistant` 更新版本信息后，回到本仓库，用它的实际目录同步。

   ```bash
   bash scripts/sync_version_files.sh "/path/to/mobile-assistant"
   ```

2. [升级并打 Tag](#升级并打-tag)。
3. [检查发布状态](#检查发布状态)。
4. [刷新 CDN](#选择刷新范围)，选择 `version`。刷新后核对版本和最低支持版本，独立的 iOS 或 Android 配置有变动时一并核对。 [七牛配置](https://mobile-download.tronclass.com.cn/version_update.json) · [jsDelivr 配置](https://cdn.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/version_update.json)

[发版预览](https://wisdomgardeninc.github.io/mobile-assets/pages/preview-release.html)展示 GitHub Pages 上的版本和发布说明。

## 更新隐私政策和用户协议

1. 修改 `app-legal/` 下的文件，保留页面及依赖的相对路径，按需同步仍有调用方的根目录副本。 [协议维护说明](app-legal/README.md)
2. [升级并打 Tag](#升级并打-tag)，[检查发布状态](#检查发布状态)。
3. [刷新 CDN](#选择刷新范围)，选择 `legal`，然后核对线上协议。

应用市场审核快照按原七牛路径手工上传。 [审核快照说明](app-legal/store-review/README.md)

## 发布 GitHub Pages 页面

仅更新 GitHub Pages 时，提交改动并推送 Pages 发布分支，部署完成后打开页面验收。

```bash
git push
```

## 更新 mhesi App 版本信息

```bash
node mhesi/update_app_version_md.cjs
```

[升级并打 Tag](#升级并打-tag) → [检查发布状态](#检查发布状态) → [刷新 CDN](#选择刷新范围)，选择 `mhesi`。 [mhesi 资源清单](mhesi/assets-list.md)
