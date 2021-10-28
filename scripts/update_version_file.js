const { prompt } = require("enquirer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const hipaEnv = require("./.hipa.env.js");

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

const getReleaseNote = async ({ version }) => {
  try {
    const { data } = await axios.get(
      `/apps/${hipaEnv.APP_ID}/tables/${hipaEnv.TABLE_ID}/records?filter=${encodeURIComponent(
        `版本号=[eq]${version}`
      )}`,
      {
        baseURL: "https://api.hipacloud.com/v1",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${hipaEnv.API_KEY}`,
        },
        params: {
          pageSize: 1,
        },
      }
    );

    if (data && data.items && data.items.length) {
      const info = data.items[0].values;
      const cn = (info["简体"] || "").trim();
      const tw = (info["繁体"] || "").trim();
      const en = (info["英文"] || "").trim();

      // const release_note_zh_hans = info["简体"];
      // const release_note_zh_hant = info["繁体"];
      // const release_note_en_us = info["英文"];

      return { cn, tw, en };
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateInfoFile = ({ version, lowestVersion }, releaseNote) => {
  console.log(`Version ${version}`);
  if (!releaseNote) {
    console.log("no release note, goto hipacloud create it!");
    console.log(hipaEnv.VERSION_TABLE_URL);
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
    console.log(filePath.substring(3));
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
    const releaseNote = await getReleaseNote(input);
    updateInfoFile(input, releaseNote);
  } catch (error) {
    console.error(error);
  }
};

if (require.main === module) {
  run();
}
