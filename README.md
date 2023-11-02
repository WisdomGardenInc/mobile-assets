## Update assets flow


### Add version records before uploading to the market

1. ~~[HiPaCloud](https://hipacloud.com/apps/61246bbeb74fa7ca113500cb/tables/61357f137c852d44c4e9248d)~~[飞书多维表格](https://wisdomgarden.feishu.cn/base/bascnGagJw701WLXVakop4vQlwc?table=tblgnx3liFOXJ3el&view=vewRsmyLYE) Create a new version record and improve the release notes, need edit it manually.

2. `node scripts/add_market_apps_version.js` Batch increase market version records


### Update version info is used to send update notifications
**update `version_update_android.json / version_update_ios.json`**

1. `node scripts/update_app_version_md.js` update json file with ~~hipa~~ feishu remote data, or edit it manually
2. check for errors then git commit `git commit -m "update version file"`
3. `node scripts/upgrade_version.js` increase current project version number and add new tag
4. `git push && git push --tags` push to GitHub, and Github Action publish it to [npm @wisdomgarden/mobile-assets](https://www.npmjs.com/package/@wisdomgarden/mobile-assets)
5. after about 10 minutes, check [jsDeliver package data](https://data.jsdelivr.com/v1/package/npm/@wisdomgarden/mobile-assets) util latest tag is same as package.json.version then `bash scripts/refresh_cdn.sh` refresh json file cdn cache
6. preview release note. local use live server `./preview-release.html` or [Online from GitHub Pages](https://wisdomgardeninc.github.io/mobile-assets/preview-release.html)

if update other file, edit `refresh_cdn.sh`, then run `bash scripts/refresh_cdn.sh` refresh it.


### update privacy policy
1. `bash scripts/sync_privacy_files.sh`
2. goto [update version info] step 3


##### release note use markdown syntax
```
{
  "version": "2.0.8",
  "update_type": 1, // 0 force update
  "allow_lowest_version": "2.1.3", // if less than allow_lowest_version force update
  "app_store_url": "https://play.google.com/store/apps/details?id=com.wisdomgarden.trpc",
  "app_store_url_cn": "https://sj.qq.com/myapp/detail.htm?apkName=com.wisdomgarden.trpc", // only for android
  "release_note_en_us": "- IOS security zone adjustment\n- Repair job description is not displayed\n- Optimized job review logic\n- Fixed the problem that the default avatar was not displayed on the answering result page and the scoring page\n- Fix the interactive list, the students clicked and did not respond\n- Optimized the prompt information of interactive teaching materials\n- QR code sign-in failure page optimization\n- UI optimization",
  "release_note_zh_hans": "- IOS安全区域调整\n- 修复作业描述不显示\n- 作业批改逻辑优化\n- 修复抢答结果页和评分页面不显示默认头像\n- 修复互动列表，学生点击抢答无响应\n- 互动教材播放提示信息优化\n- 二维码签到失败页面优化\n- UI优化",
  "release_note_zh_hant": "- IOS安全區域調整\n- 修復作業描述不顯示問題\n- 作業批改邏輯優化\n- 修復搶答結果頁和評分頁面不顯示默認頭像問題\n- 修復互動列表，學生點擊搶答無反應問題\n- 互動教材播放提示文案優化\n- QR Code簽到失敗頁面優化\n- UI優化",
}
```

##### Upload zip file to Azure for TW
CMD: `node ota/upload-to-azure.js qiniuZipUrl`
e.g. `node ota/upload-to-azure.js https://mobile-download.tronclass.com.cn/mobile-2.0/ota/prod/2.2.9.1656581179.d71a7d06.zip`


paremeter `qiniuZipUrl`: the latest ota zip file url on qiniu


### Update tc-orgs-tool Ota Org Information
https://gitlab.tronclass.com.cn/lms/tc-orgs-tool

#### before
- Clone `git clone git@gitlab.tronclass.com.cn:lms/tc-orgs-tool.git`
- Edit `ota/.env.js` set project path & [LeanCloud API](https://leancloud.cn/docs/#REST-API) authorization information
- Make sure [OTAVersion prod env](https://console.leancloud.cn/apps/tRcsVqctq7saBytI0LpOCznA-gzGzoHsz/storage/data/OTAVersion) information correctly.
- Run `node ota/update-orgs-server-json.js`
- Goto `tc-orgs-tool` project, run `python update_orgs.py`

