const { prompt } = require("enquirer");
const fs = require("fs");
const path = require("path");
const { addMarketAppsVersion } = require("./platform/feishu.js");

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

const inputVersionInfo = ({ version }) => {
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
  ]);
};

const run = async () => {
  const defaultVersionInfo = getDefaultVersion();
  if (!defaultVersionInfo) {
    return;
  }
  try {
    const { version } = await inputVersionInfo(defaultVersionInfo);
    console.log("\nNew Version Info:", version);

    await addMarketAppsVersion(version);
  } catch (error) {
    console.error(error);
  }
};

if (require.main === module) {
  run();
}
