# Release guide

English · [简体中文](RELEASING.zh-CN.md)

App update notices and legal assets share the release steps below. Run commands from the repository root and run `yarn install` before the first release.

## Upgrade and tag

1. Review the changes with `git diff`, then stage and commit the files for this release with `git add` and `git commit`.
2. Bump the npm package version and create the tag.

   ```bash
   node scripts/upgrade_version.js
   ```

3. Push the branch and tags to trigger the npm publishing workflow. [Publishing workflow](.github/workflows/publish.yml)

   ```bash
   git push && git push --tags
   ```

## Refresh the CDN

### Check the release status

Refresh when the latest npm version and jsDelivr's `tags.latest` both match `package.json`. [npm package](https://www.npmjs.com/package/@wisdomgarden/mobile-assets) · [jsDelivr package data](https://data.jsdelivr.com/v1/package/npm/@wisdomgarden/mobile-assets)

### Select a refresh scope

Run the command for the files you changed.

```bash
bash scripts/refresh_cdn.sh version   # App update notices, LMS compatibility, and toggle.json on Qiniu
bash scripts/refresh_cdn.sh legal     # Root and app-legal/ policy assets
bash scripts/refresh_cdn.sh mhesi     # Purge mhesi files on jsDelivr
bash scripts/refresh_cdn.sh identity  # Upload the Google login proxy to Qiniu
bash scripts/refresh_cdn.sh all       # All scopes, also the default with no argument
```

- Qiniu uploads and refreshes use `qshell` with the `lms-mobile` bucket. jsDelivr purges use `curl`.
- To include a new file in a scope, update the corresponding group in the script. [Refresh script](scripts/refresh_cdn.sh)
- If npm already has the correct content, rerun the refresh with the files from that release. Skip the refresh when using only the new exact-version jsDelivr URL. [jsDelivr cache documentation](https://www.jsdelivr.com/tools/purge)

## Publish App update notices

1. After updating version information in `mobile-assistant`, sync it from its actual directory.

   ```bash
   bash scripts/sync_version_files.sh "/path/to/mobile-assistant"
   ```

2. [Upgrade and tag](#upgrade-and-tag).
3. [Check the release status](#check-the-release-status).
4. [Refresh the CDN](#select-a-refresh-scope) with the `version` scope. Check the versions and minimum supported versions, including platform-specific files if they changed. [Qiniu JSON](https://mobile-download.tronclass.com.cn/version_update.json) · [jsDelivr JSON](https://cdn.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/version_update.json)

The [release preview](https://wisdomgardeninc.github.io/mobile-assets/pages/preview-release.html) shows the versions and release notes on GitHub Pages.

## Update privacy policies and user agreements

1. Edit `app-legal/`, preserve relative paths to dependencies, and update root copies that still have callers. [Policy maintenance](app-legal/README.md)
2. [Upgrade and tag](#upgrade-and-tag), then [check the release status](#check-the-release-status).
3. [Refresh the CDN](#select-a-refresh-scope) with the `legal` scope, then verify the published policies.

Upload app market review snapshots manually to their existing Qiniu paths. [Review snapshot instructions](app-legal/store-review/README.md)

## Publish GitHub Pages

For GitHub Pages-only changes, commit and push the publishing branch. Open the page after deployment.

```bash
git push
```

## Update mhesi app version information

```bash
node mhesi/update_app_version_md.cjs
```

[Upgrade and tag](#upgrade-and-tag) → [Check the release status](#check-the-release-status) → [Refresh the CDN](#select-a-refresh-scope) with the `mhesi` scope. [mhesi asset list](mhesi/assets-list.md)
