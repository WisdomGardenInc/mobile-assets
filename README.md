# Update assets flow

## Update version info

### I. Sync version file files
  - In Project [mobile-assistant](https://gitlab.tronclass.com.cn/lms/mobile-assistant), prepare the preliminary work according to readme.md.
  - You should clone mobile-assistant into the same directory as the current project.
  - use `bash ./scripts/sync_version_files.sh` to sync latest file


### II. upgrade package `mobile-assets` version

1. ues `git diff` to check the changed files
2. then commit all files `git commit -m "update version file"`
3. `node scripts/upgrade_version.js` increase current project version number and add new tag
4. `git push && git push --tags` push to GitHub, and Github Action publish it to [npm @wisdomgarden/mobile-assets](https://www.npmjs.com/package/@wisdomgarden/mobile-assets)

###  III. refresh cdn

1. after about 10 minutes, check [jsDeliver package data](https://data.jsdelivr.com/v1/package/npm/@wisdomgarden/mobile-assets) util latest tag is same as package.json.version then `bash scripts/refresh_cdn.sh` refresh json file cdn cache
2. preview release note. local use live server `./preview-release.html` or [Online from GitHub Pages](https://wisdomgardeninc.github.io/mobile-assets/preview-release.html)

if update other file, edit `refresh_cdn.sh`, then run `bash scripts/refresh_cdn.sh` refresh it.

## Update privacy policy

Privacy-policy / user-agreement files live in `app-legal/`. Edit them there, then
publish via [II](#II-upgrade-package-mobile-assets-version). Keep the whole set in
that folder — pages load `policy-common.*` / `marked-4.0.1.min.js` and fetch their
`*-info.json` / `*-<lang>.md` by relative path.

- Root-level copies are legacy duplicates for already-released apps still using the
  root URLs; edit them in sync, and delete once those app versions are retired.
- China app-market review snapshots: see `app-legal/store-review/`.
