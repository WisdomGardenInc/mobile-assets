# privacy-policy files
# policy jump
qshell fput --overwrite lms-mobile policy-jump.html policy-jump.html
# privacy-policy common
qshell fput --overwrite lms-mobile policy-common.js policy-common.js
qshell fput --overwrite lms-mobile policy-common.css policy-common.css
# privacy-policy
qshell fput --overwrite lms-mobile marked.min-4.0.1.js marked.min-4.0.1.js
qshell fput --overwrite lms-mobile privacy-policy.html privacy-policy.html
qshell fput --overwrite lms-mobile privacy-policy-info.json privacy-policy-info.json
qshell fput --overwrite lms-mobile privacy-policy-zh-CN.md privacy-policy-zh-CN.md
qshell fput --overwrite lms-mobile privacy-policy-en.md privacy-policy-en.md
qshell fput --overwrite lms-mobile privacy-policy-zh-TW.md privacy-policy-zh-TW.md
# user-agreement
qshell fput --overwrite lms-mobile user-agreement.html user-agreement.html
qshell fput --overwrite lms-mobile user-agreement-info.json user-agreement-info.json
qshell fput --overwrite lms-mobile user-agreement-zh-CN.md user-agreement-zh-CN.md
qshell fput --overwrite lms-mobile user-agreement-zh-TW.md user-agreement-zh-TW.md
qshell fput --overwrite lms-mobile user-agreement-en.md user-agreement-en.md
# children-privacy-policy
qshell fput --overwrite lms-mobile children-privacy-policy.html children-privacy-policy.html
qshell fput --overwrite lms-mobile children-privacy-policy-info.json children-privacy-policy-info.json
qshell fput --overwrite lms-mobile children-privacy-policy-zh-CN.md children-privacy-policy-zh-CN.md
# summary-privacy-policy
qshell fput --overwrite lms-mobile summary-privacy-policy.html summary-privacy-policy.html
qshell fput --overwrite lms-mobile summary-privacy-policy-zh-CN.md summary-privacy-policy-zh-CN.md

# version update
qshell fput --overwrite lms-mobile toggle.json toggle.json
qshell fput --overwrite lms-mobile version_update_android.json version_update_android.json
qshell fput --overwrite lms-mobile version_update_ios.json version_update_ios.json

# identity-web-login-proxy
qshell qupload2 --bucket=lms-mobile --overwrite --src-dir=./identity-web-login-proxy --key-prefix=identity-web-login-proxy --skip-file-prefixes .

# App version corresponds to server version
qshell fput --overwrite lms-mobile version_aligner.json version_aligner.json