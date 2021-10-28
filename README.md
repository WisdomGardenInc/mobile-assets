## Update assets flow

### update version info: `version_update_android.json / version_update_ios.json`

1. [HiPaCloud](https://hipacloud.com/apps/61246bbeb74fa7ca113500cb/tables/61357f137c852d44c4e9248d) Create a new version record and improve the release notes.
2. `node scripts/update_version_file.js` update json file with hipa remote data, or edit it manually
3. check for errors then git commit
4. `bash scripts/upgrade_version.js` create current project version and tag
5. `git push --follow-tags` push to GitHub, and Github Action publish it to [npm @wisdomgarden/mobile-assets](https://www.npmjs.com/package/@wisdomgarden/mobile-assets)
6. after about 10 minutes, check [jsDeliver package data](https://data.jsdelivr.com/v1/package/npm/@wisdomgarden/mobile-assets) util latest tag is same as package.json.version then `bash scripts/refresh_cdn.sh` refresh json file cdn cache


if update other file, edit `assets-list.md`, then run `bash scripts/refresh_cdn.sh` refresh it.



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
