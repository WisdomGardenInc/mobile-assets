const { prompt } = require("enquirer");
const fs = require("fs");
const path = require("path");
const { getVersionAlignerInfo } = require("./platform/feishu.js");
const utils = require("./utils.cjs");

const versionAlignerFilePath = path.join(
  __dirname,
  "..",
  "version_aligner.json"
);

const updateVersionAlignerFile = ({ mobileVersion, serverVersion }) => {
  const versionAlignerJson = require(versionAlignerFilePath);
  const info = versionAlignerJson.find(
    (item) => item.mobileVersion === mobileVersion
  );
  if (info) {
    info.serverVersion = serverVersion;
  } else {
    versionAlignerJson.unshift({
      mobileVersion,
      serverVersion,
    });
  }
  const versionAlignerStr = JSON.stringify(versionAlignerJson, null, 2);
  fs.writeFileSync(versionAlignerFilePath, versionAlignerStr, {
    encoding: "utf8",
    flag: "w",
  });
};

const changeVersionAlignerByVersion = async (version) => {
  const result = await getVersionAlignerInfo(version);
  if (!result.mobileVersion || !result.serverVersion) {
    return;
  }
  updateVersionAlignerFile(result);
};

module.exports = {
  changeVersionAlignerByVersion,
};

const inputVersionInfo = ({ version }) => {
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
  ]);
};

const run = async () => {
  const defaultVersionInfo = utils.getDefaultVersion();
  if (!defaultVersionInfo) {
    return;
  }
  try {
    const { version } = await inputVersionInfo(defaultVersionInfo);
    console.log("\nNew Version Info:", version);
    await changeVersionAlignerByVersion(version);
  } catch (error) {
    console.log("error", error);
  }
};

if (require.main === module) {
  run();
}
