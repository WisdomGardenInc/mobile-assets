const { prompt } = require("enquirer");
const fs = require("fs");
const path = require("path");
const { getReleaseNote } = require("./platform/hipa.js");

const versionInfoAndroidFile = path.join(__dirname, "..", "version_update_android.json");
const versionInfoIOSFile = path.join(__dirname, "..", "version_update_ios.json");

const versionReg = new RegExp(/^\d+(\.\d+)*$/);

const getBiggerVersion = (aData, bData, versionFileName) =>
  aData[versionFileName] > bData[versionFileName] ? aData[versionFileName] : bData[versionFileName];

const getDefaultVersion = () => {
  const iosVersionInfo = require(versionInfoIOSFile);
  const androidVersionInfo = require(versionInfoAndroidFile);

  const version = getBiggerVersion(iosVersionInfo, androidVersionInfo, "version");
  const lowestVersion = getBiggerVersion(iosVersionInfo, androidVersionInfo, "allow_lowest_version");

  if (!versionReg.test(version) || !versionReg.test(lowestVersion)) {
    console.error("invalid version format");
    console.error("version:", version);
    console.error("lowestVersion:", lowestVersion);
    return null;
  }

  const versionInfo = version.split(".");
  versionInfo[2] = parseInt(versionInfo[2]) + 1;
  return { version: versionInfo.join("."), lowestVersion };
};

const inputVersionInfo = ({ version, lowestVersion }) => {
  return prompt([
    {
      name: "version",
      type: "input",
      message: "input the app new version",
      initial: version,
      validate: (value) => {
        if (!versionReg.test(value)) {
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
        if (!versionReg.test(value)) {
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

  for (filePath of [versionInfoIOSFile, versionInfoAndroidFile]) {
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
  const defaultVersionInfo = getDefaultVersion();
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
