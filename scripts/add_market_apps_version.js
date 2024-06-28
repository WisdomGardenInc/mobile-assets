const { prompt } = require("enquirer");
const { addMarketAppsVersion } = require("./platform/feishu.js");
const utils = require("./utils.cjs");

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

    await addMarketAppsVersion(version);
  } catch (error) {
    console.error(error);
  }
};

if (require.main === module) {
  run();
}
