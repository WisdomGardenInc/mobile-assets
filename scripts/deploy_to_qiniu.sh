# privacy-policy
qshell fput --overwrite lms-mobile privacy-policy-zh-CN.md privacy-policy-zh-CN.md
qshell fput --overwrite lms-mobile privacy-policy-zh-TW.md privacy-policy-zh-TW.md
qshell fput --overwrite lms-mobile privacy-policy-en.md privacy-policy-en.md

qshell fput --overwrite lms-mobile privacy-policy-info.json privacy-policy-info.json

qshell fput --overwrite lms-mobile privacy-policy.html privacy-policy-qiniu.html

# version update
qshell fput --overwrite lms-mobile toggle.json toggle.json
qshell fput --overwrite lms-mobile version_update_android.json version_update_android.json
qshell fput --overwrite lms-mobile version_update_ios.json version_update_ios.json

# identity-web-login-proxy
qshell qupload2 --bucket=lms-mobile --overwrite --src-dir=./identity-web-login-proxy --key-prefix=identity-web-login-proxy --skip-file-prefixes .