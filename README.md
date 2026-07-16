# mobile-assets

Static assets hosted for the TronClass mobile apps: app version-update configs
(`version_update_*.json`, `version_aligner.json`, `toggle.json`), the privacy
policy / user agreement documents (root + `app-legal/`), the mhesi version files
and login-proxy pages, plus a few standalone HTML tools.

Everything is published to npm as [@wisdomgarden/mobile-assets](https://www.npmjs.com/package/@wisdomgarden/mobile-assets)
and served to the apps through two CDNs:

- **jsDelivr** — served straight from the npm package (`cdn.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/...`).
- **qiniu** — files are uploaded to the `lms-mobile` bucket and served from `https://mobile-download.tronclass.com.cn/...`.

So updating an asset is: edit the file → publish a new version → refresh the CDN
caches. The two common tasks (update version info / update privacy policy) both
follow that flow; the shared steps are documented first.

## Publish and add tag

1. use `git diff` to check the changed files
2. commit all files, e.g. `git commit -m "update version file"`
3. `node scripts/upgrade_version.js` — bumps the project version number and adds a new git tag
4. `git push && git push --tags` — pushes to GitHub; the GitHub Action then publishes to npm

## Refresh CDN

Publishing to npm does **not** refresh the CDN caches — you must purge/re-upload
after the new version is live.

1. Wait ~10 minutes, then check [jsDelivr package data](https://data.jsdelivr.com/v1/package/npm/@wisdomgarden/mobile-assets)
   until the latest tag matches `package.json.version`.
2. Run the refresh command **for the scope you changed** — each scope only touches
   its own files / CDNs, so updating the version no longer re-uploads the legal
   docs and vice versa:

   ```bash
   bash scripts/refresh_cdn.sh version    # version_update_*.json / version_aligner.json / toggle.json
   bash scripts/refresh_cdn.sh legal      # privacy-policy / user-agreement / children / summary (root + app-legal/)
   bash scripts/refresh_cdn.sh mhesi      # mhesi/version/*.json + mhesi/third-party-login-proxy/
   bash scripts/refresh_cdn.sh identity   # identity-web-login-proxy/ directory
   bash scripts/refresh_cdn.sh all        # everything (default when no scope given)
   ```

Notes:

- Requires `qshell` configured for the `lms-mobile` bucket (used for the qiniu
  upload + refresh; jsDelivr only needs `curl`).
- The file list for each scope is maintained in **one place** inside
  `scripts/refresh_cdn.sh` — jsDelivr purge, qiniu upload and qiniu refresh are all
  derived from it. If you add a new file, add it to the matching group array there.

## Update version info

1. Sync version files from [mobile-assistant](https://gitlab.tronclass.com.cn/lms/mobile-assistant):
   `bash ./scripts/sync_version_files.sh [path-to-mobile-assistant]` (defaults to `../mobile-assistant`).
2. [Publish and add tag](#publish-and-add-tag).
3. [Refresh CDN](#refresh-cdn): `bash scripts/refresh_cdn.sh version`.
4. Preview the release note: local live server `./preview-release.html`, or
   [online from GitHub Pages](https://wisdomgardeninc.github.io/mobile-assets/preview-release.html).

## Update privacy policy

Privacy-policy / user-agreement files live in `app-legal/`. Keep the whole set in
that folder — pages load `policy-common.*` / `marked-4.0.1.min.js` and fetch their
`*-info.json` / `*-<lang>.md` by relative path.

1. Edit the files under `app-legal/`.
2. [Publish and add tag](#publish-and-add-tag).
3. [Refresh CDN](#refresh-cdn): `bash scripts/refresh_cdn.sh legal`.

- Root-level copies are legacy duplicates for already-released apps still using the
  root URLs; edit them in sync, and delete once those app versions are retired.
- China app-market review snapshots: see `app-legal/store-review/`.
