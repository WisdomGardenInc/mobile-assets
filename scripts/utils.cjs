const path = require("path");

const versionInfoAndroidFile = path.join(
  __dirname,
  "..",
  "version_update_android.json"
);
const versionInfoIOSFile = path.join(
  __dirname,
  "..",
  "version_update_ios.json"
);

const versionReg = new RegExp(/^\d+(\.\d+)*$/);

const getBiggerVersion = (aData, bData, versionFileName) =>
  aData[versionFileName] > bData[versionFileName]
    ? aData[versionFileName]
    : bData[versionFileName];

const getDefaultVersion = () => {
  const iosVersionInfo = require(versionInfoIOSFile);
  const androidVersionInfo = require(versionInfoAndroidFile);

  const version = getBiggerVersion(
    iosVersionInfo,
    androidVersionInfo,
    "version"
  );
  const lowestVersion = getBiggerVersion(
    iosVersionInfo,
    androidVersionInfo,
    "allow_lowest_version"
  );

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

module.exports = {
  versionReg,
  versionInfoAndroidFile,
  versionInfoIOSFile,
  getDefaultVersion,
};
