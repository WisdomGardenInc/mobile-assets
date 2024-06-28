const { prompt } = require("enquirer");
const fs = require("fs");
const { getReleaseNote } = require("./platform/feishu.js");
const utils = require("./utils.cjs");

const inputVersionInfo = ({ version, lowestVersion }) => {
  return prompt([
    {
      name: "version",
      type: "input",
      message: "input the app new version",
      initial: version,
      validate: (value) => {
        if (!utils.versionReg.test(value)) {
          return `newVersion version ${value} format error. e.g. 1.1.1`;
        }
        return true;
      },
    },
    {
      name: "lowestVersion",
      type: "input",
      message: "input allow lowest version",
      initial: lowestVersion,
      validate: (value) => {
        if (!utils.versionReg.test(value)) {
          return `allowLowestVersion version ${value} format error. e.g. 1.1.1`;
        }
        return true;
      },
    },
  ]);
};

const updateInfoFile = ({ version, lowestVersion }, releaseNote, tableUrl) => {
  console.log(`Version ${version}`);
  if (!releaseNote) {
    console.log("no release note, goto hipacloud create it!");
    console.log(tableUrl);
    return;
  }
  console.log(releaseNote);

  for (filePath of [utils.versionInfoIOSFile, utils.versionInfoAndroidFile]) {
    const versionInfo = require(filePath);

    versionInfo.version = version;
    versionInfo["allow_lowest_version"] = lowestVersion;
    versionInfo["release_note_en_us"] = releaseNote.en;
    versionInfo["release_note_zh_hans"] = releaseNote.cn;
    versionInfo["release_note_zh_hant"] = releaseNote.tw;
    if (filePath.search("android") !== -1) {
      versionInfo[
        "app_store_url_cn"
      ] = `https://mobile-download.tronclass.com.cn/mobile-2.0/app/android/app-release-${version}.apk`;
    }

    const versionInfoStr = JSON.stringify(versionInfo, null, 2);
    console.log("-----------------------------");
    console.log(filePath);
    console.log(versionInfoStr);

    fs.writeFileSync(filePath, versionInfoStr, {
      encoding: "utf8",
      flag: "w",
    });
  }
};

const run = async () => {
  const defaultVersionInfo = utils.getDefaultVersion();
  if (!defaultVersionInfo) {
    return;
  }
  try {
    const input = await inputVersionInfo(defaultVersionInfo);
    console.log("\nNew Version Info:");
    console.log(input);
    const { releaseNote, tableUrl } = await getReleaseNote(input);
    updateInfoFile(input, releaseNote, tableUrl);
  } catch (error) {
    console.error(error);
  }
};

if (require.main === module) {
  run();
}
