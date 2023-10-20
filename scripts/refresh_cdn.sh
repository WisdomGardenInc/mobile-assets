#!/bin/bash

# refresh jsdelivr
curl https://data.jsdelivr.com/v1/package/npm/@wisdomgarden/mobile-assets

declare -a tasks=(
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/version_update_android.json"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/version_update_ios.json"
  
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/policy-common.js"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/policy-common.css"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/privacy-policy.html"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/privacy-policy-info.json"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/privacy-policy-zh-CN.md"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/privacy-policy-en.md"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/privacy-policy-zh-TW.md"

  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/user-agreement.html"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/user-agreement-info.json"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/user-agreement-zh-CN.md"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/user-agreement-zh-TW.md"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/user-agreement-en.md"

  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/children-privacy-policy.html"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/children-privacy-policy-info.json"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/children-privacy-policy-zh-CN.md"

  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/summary-privacy-policy.html"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/summary-privacy-policy-zh-CN.md"
)

for i in "${tasks[@]}"
do
   curl $i
done

# refresh qiniu
bash ./scripts/deploy_to_qiniu.sh
qshell cdnrefresh -i ./scripts/refresh_qiniu_cdn.txt