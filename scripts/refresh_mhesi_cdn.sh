#!/bin/bash

# refresh jsdelivr
curl https://data.jsdelivr.com/v1/package/npm/@wisdomgarden/mobile-assets

declare -a tasks=(
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/mhesi/version/android.json"
  "https://purge.jsdelivr.net/npm/@wisdomgarden/mobile-assets@latest/mhesi/version/ios.json"
)

for i in "${tasks[@]}"
do
   curl $i
done
