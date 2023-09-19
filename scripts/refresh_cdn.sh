#!/bin/bash

# refresh jsdelivr
curl https://data.jsdelivr.com/v1/package/npm/@wisdomgarden/mobile-assets

declare -a tasks=(
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/version_update_android.json"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/version_update_ios.json"
  # "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/privacy-policy-info.json"
  # "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/privacy-policy-zh-CN.md"
  # "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/privacy-policy-zh-TW.md"
  # "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/privacy-policy-en.md"
)

for i in "${tasks[@]}"
do
   curl $i
done

# refresh qiniu
bash ./scripts/deploy_to_qiniu.sh
qshell cdnrefresh -i ./scripts/refresh_qiniu_cdn.txt