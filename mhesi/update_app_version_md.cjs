const path = require("path");
const fs = require("fs");
const { prompt } = require("enquirer");

const versionInfoAndroidFile = path.join(__dirname, "version", "android.json");
const versionInfoIOSFile = path.join(__dirname, "version", "ios.json");
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
  return {
    version: versionInfo.join("."),
    lowestVersion,
    currentVersion: version,
  };
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
          return `New version ${value} format error. e.g. 1.1.1`;
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
          return `Allow lowest version ${value} format error. e.g. 1.1.1`;
        }
        return true;
      },
    },
    {
      name: "updateType",
      type: "select",
      message: "Need force update?",
      choices: [
        { name: "yes", message: "Yes (需要强制更新)", value: 0 },
        { name: "no", message: "No (不需要强制更新)", value: 1 },
      ],
      result: (value) => {
        return value === "yes" ? "0" : "1";
      },
    },
    {
      type: "input",
      name: "releaseNoteEn",
      message:
        "Please input release note for en-us (e.g. update description):\n",
      initial: "",
      required: true,
    },
    {
      type: "input",
      name: "releaseNoteTh",
      message: "Please input release note for th-th (e.g. ปรับปรุงคำอธิบาย):\n",
      initial: "",
    },
  ]);
};

const updateInfoFile = (newVersionInfo) => {
  console.log(`Version ${newVersionInfo.version}`);

  for (filePath of [versionInfoAndroidFile, versionInfoIOSFile]) {
    const versionInfo = require(filePath);

    versionInfo['version'] = newVersionInfo.version;
    versionInfo["allow_lowest_version"] = newVersionInfo.lowestVersion;
    versionInfo["release_note_en_us"] = newVersionInfo.releaseNoteEn;
    versionInfo["release_note_th_th"] = newVersionInfo.releaseNoteTh;

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
    updateInfoFile(input);
  } catch (error) {
    console.error(error);
  }
};

if (require.main === module) {
  run();
}
