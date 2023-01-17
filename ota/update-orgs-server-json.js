const env = require("./.env.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const getOtaProdVersion = async () => {
  const versionReg = /^(\d+\.\d+\.\d+)\.(\d{10})\(([a-zA-Z0-9]{8})\)$/;

  const config = {
    headers: {
      "X-LC-Id": env.LEANCLOUD_ID,
      "X-LC-Key": env.LEANCLOUD_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: {
      where: `{"env":"prod"}`,
    },
  };

  const { data } = await axios.get("https://trcsvqct.lc-cn-n1-shared.com/1.1/classes/OTAVersion", config);

  const otaInfo = data?.results?.[0];
  console.log(otaInfo);

  if (!otaInfo) {
    return null;
  }

  if (!versionReg.test(otaInfo["version"])) {
    return null;
  }

  return otaInfo;
};

const updateJSON = (orgsFilePath, otaInfo) => {
  const orgsFileJSON = require(orgsFilePath);
  const otaVersion = orgsFileJSON["orgs"][0];

  const readableVersion = otaInfo["readableVersion"];
  const version = otaInfo["version"];
  const zipFileName = version.replace(/[\(\)]/g, ".") + "zip";

  otaVersion["readableVersion"] = readableVersion;
  otaVersion["version"] = version;
  otaVersion["zipFileUrl"] = `https://mobile-download.tronclass.com.cn/mobile-2.0/ota/prod/${zipFileName}`;
  otaVersion["zipFileUrlTW"] = `https://aztcmedia.blob.core.windows.net/mobile-ota/prod/${zipFileName}`;
  otaVersion["force"] = otaInfo["force"];
  otaVersion["compatiblePastNativeVersion"] = otaInfo["compatiblePastNativeVersion"];

  console.log("\n------------------------------->\n");
  console.log(otaVersion);

  fs.writeFileSync(orgsFilePath, JSON.stringify(orgsFileJSON, null, 2));
};

const main = async () => {
  if (!env.TC_ORGS_TOOLS_PROJECT_PATH) {
    throw new Error("Please set tc-orgs-tools path in env.js");
  }

  const orgsFilePath = path.join(env.TC_ORGS_TOOLS_PROJECT_PATH, "orgs.json");

  if (!fs.existsSync(orgsFilePath)) {
    throw new Error(`${orgsFilePath} not existed.`);
  }

  const otaInfo = await getOtaProdVersion();

  if (!otaInfo) {
    throw new Error("find ota information error.");
  }

  updateJSON(orgsFilePath, otaInfo);
};

main()
  .then(() => console.log("Done"))
  .catch((ex) => console.error(ex.message));
