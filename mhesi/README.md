## update mhesi version info

### I. update version info

update version info in `mhesi/version/ios.json` and `mhesi/version/android.json`

```javascript
node ./mhesi/update_app_version_md.cjs
```

### II. upgrade package `mobile-assets` version

1. ues `git diff` to check the changed files
2. then commit all files `git add . && git commit -m "update mhesi version file"`
3. `node scripts/upgrade_version.js` increase current project version number and add new tag
4. `git push && git push --tags` push to GitHub, and Github Action publish it to [npm @wisdomgarden/mobile-assets](https://www.npmjs.com/package/@wisdomgarden/mobile-assets)

###  III. refresh cdn
1. after about 10 minutes, check [jsDeliver package data](https://data.jsdelivr.com/v1/package/npm/@wisdomgarden/mobile-assets) util latest tag is same as package.json.version then `bash scripts/refresh_mehis_cdn.sh` refresh json file cdn cache