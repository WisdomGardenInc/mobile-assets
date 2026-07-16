#!/bin/bash

# Refresh CDN caches for @wisdomgarden/mobile-assets.
#
# Usage:
#   bash scripts/refresh_cdn.sh [scope]
#
#   version     version_update_*.json / version_aligner.json / toggle.json
#   legal       privacy-policy / user-agreement / children / summary (root + app-legal/)
#   mhesi       mhesi/version/*.json
#   identity    identity-web-login-proxy/ directory
#   all         everything above (default)
#
# Each scope refreshes only the CDNs that actually host those files, so
# updating the app version no longer re-uploads / purges the legal docs
# (and vice versa). The file list for each group is maintained ONCE here;
# jsDelivr purge, qiniu upload and qiniu refresh are all derived from it.

PKG="@wisdomgarden/mobile-assets"
BUCKET="lms-mobile"
JSDELIVR_PURGE="https://purge.jsdelivr.net/npm/${PKG}@latest"
QINIU_HOST="https://mobile-download.tronclass.com.cn"

# ---------------------------------------------------------------------------
# File groups. Relative path == local path == CDN key for every entry.
# ---------------------------------------------------------------------------

# Served on BOTH jsDelivr and qiniu.
VERSION_FILES=(
  version_update_android.json
  version_update_ios.json
  version_aligner.json
)

# Served on qiniu ONLY (not published/purged on jsDelivr today).
VERSION_FILES_QINIU_ONLY=(
  toggle.json
)

# Served on BOTH jsDelivr and qiniu.
LEGAL_FILES=(
  policy-jump.html
  policy-common.js
  policy-common.css
  marked.min-4.0.1.js
  privacy-policy.html
  privacy-policy-info.json
  privacy-policy-zh-CN.md
  privacy-policy-en.md
  privacy-policy-zh-TW.md
  user-agreement.html
  user-agreement-info.json
  user-agreement-zh-CN.md
  user-agreement-zh-TW.md
  user-agreement-en.md
  children-privacy-policy.html
  children-privacy-policy-info.json
  children-privacy-policy-zh-CN.md
  summary-privacy-policy.html
  summary-privacy-policy-zh-CN.md
  app-legal/policy-jump.html
  app-legal/policy-common.js
  app-legal/policy-common.css
  app-legal/marked-4.0.1.min.js
  app-legal/privacy-policy.html
  app-legal/privacy-policy-info.json
  app-legal/privacy-policy-zh-CN.md
  app-legal/privacy-policy-en.md
  app-legal/privacy-policy-zh-TW.md
  app-legal/user-agreement.html
  app-legal/user-agreement-info.json
  app-legal/user-agreement-zh-CN.md
  app-legal/user-agreement-zh-TW.md
  app-legal/user-agreement-en.md
  app-legal/children-privacy-policy.html
  app-legal/children-privacy-policy-info.json
  app-legal/children-privacy-policy-zh-CN.md
  app-legal/summary-privacy-policy.html
  app-legal/summary-privacy-policy-zh-CN.md
  app-legal/privacy_policy_google_play.html
)

# Served on jsDelivr ONLY (qiniu does not host mhesi).
MHESI_FILES=(
  mhesi/version/android.json
  mhesi/version/ios.json
  mhesi/third-party-login-proxy/native-callback.html
  mhesi/third-party-login-proxy/normal.css
  mhesi/third-party-login-proxy/favicon.ico
)

# ---------------------------------------------------------------------------
# Primitives
# ---------------------------------------------------------------------------

purge_jsdelivr() {
  for f in "$@"; do
    echo "  purge  ${f}"
    curl -s "${JSDELIVR_PURGE}/${f}" > /dev/null
  done
}

qiniu_upload() {
  for f in "$@"; do
    qshell fput --overwrite "${BUCKET}" "${f}" "${f}"
  done
}

qiniu_refresh() {
  local list
  list="$(mktemp)"
  for f in "$@"; do
    echo "${QINIU_HOST}/${f}" >> "${list}"
  done
  qshell cdnrefresh -i "${list}"
  rm -f "${list}"
}

# ---------------------------------------------------------------------------
# Scopes
# ---------------------------------------------------------------------------

refresh_version() {
  echo ">> version: jsDelivr purge"
  purge_jsdelivr "${VERSION_FILES[@]}"
  echo ">> version: qiniu upload"
  qiniu_upload "${VERSION_FILES[@]}" "${VERSION_FILES_QINIU_ONLY[@]}"
  echo ">> version: qiniu refresh"
  qiniu_refresh "${VERSION_FILES[@]}" "${VERSION_FILES_QINIU_ONLY[@]}"
}

refresh_legal() {
  echo ">> legal: jsDelivr purge"
  purge_jsdelivr "${LEGAL_FILES[@]}"
  echo ">> legal: qiniu upload"
  qiniu_upload "${LEGAL_FILES[@]}"
  echo ">> legal: qiniu refresh"
  qiniu_refresh "${LEGAL_FILES[@]}"
}

refresh_mhesi() {
  echo ">> mhesi: jsDelivr purge"
  purge_jsdelivr "${MHESI_FILES[@]}"
}

refresh_identity() {
  echo ">> identity-web-login-proxy: qiniu upload"
  qshell qupload2 --bucket="${BUCKET}" --overwrite \
    --src-dir=./identity-web-login-proxy \
    --key-prefix=identity-web-login-proxy --skip-file-prefixes .
}

# ---------------------------------------------------------------------------
# Dispatch
# ---------------------------------------------------------------------------

scope="${1:-all}"

echo "== jsDelivr package data =="
curl -s "https://data.jsdelivr.com/v1/package/npm/${PKG}"
echo

case "${scope}" in
  version)        refresh_version ;;
  legal|privacy)  refresh_legal ;;
  mhesi)          refresh_mhesi ;;
  identity)       refresh_identity ;;
  all)
    refresh_version
    refresh_legal
    refresh_mhesi
    refresh_identity
    ;;
  *)
    echo "usage: $0 [version|legal|mhesi|identity|all]" >&2
    exit 1
    ;;
esac

echo "== done: ${scope} =="
