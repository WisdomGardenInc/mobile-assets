#!/bin/bash

APP_REPO_RELATIVE_PATH="../mobile-2.5"


VERSION=$(node -p -e "require('${APP_REPO_RELATIVE_PATH}/package.json').version")

cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/marked.min-4.0.1.js .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/policy-common.js .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/policy-common.css .

cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/privacy-policy.html .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/privacy-policy-info.json .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/privacy-policy-zh-CN.md .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/privacy-policy-en.md .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/privacy-policy-zh-TW.md .

cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/user-agreement.html .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/user-agreement-info.json .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/user-agreement-zh-CN.md .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/user-agreement-zh-TW.md .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/user-agreement-en.md .

cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/children-privacy-policy.html .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/children-privacy-policy-info.json .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/children-privacy-policy-zh-CN.md .

cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/summary-privacy-policy.html .
cp ${APP_REPO_RELATIVE_PATH}/doc/privacy-policy/summary-privacy-policy-zh-CN.md .

FILES_TO_REPLACE_VERSION=(
    "children-privacy-policy.html"
    "privacy-policy.html"
    "summary-privacy-policy.html"
    "user-agreement.html"
)

for file in "${FILES_TO_REPLACE_VERSION[@]}"; do
    if [ -f "$file" ]; then
        gsed -i "s/v={version}/v=$VERSION/g" "$file"
    else
        echo "File not existed - $file"
    fi
done