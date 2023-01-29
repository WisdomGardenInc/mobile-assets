const path = require("path");
const fs = require("fs");
const { BlobServiceClient } = require("@azure/storage-blob");
const env = require("./.env.js");
const AZURE_STORAGE_CONNECTION_STRING = env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "mobile-ota";
const QINIU_BUCKET = "lms-mobile";
const { execSync } = require("child_process");

// two weeks ago
const expTime = new Date(new Date().getTime() - 3600 * 24 * 14 * 1000);
console.log("will delete before: ", new Date(expTime));

const filterAzureOldBlob = async (containerClient, prodFileName) => {
  const blobs = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    const blobTime = new Date(blob.properties.lastModified);
    if (blob.name.endsWith(".zip") && !blob.deleted && !blob.name.endsWith(prodFileName) && blobTime < expTime) {
      blobs.push(blob);
    }
  }

  return blobs;
};

const clearAzure = async (prodFileName) => {
  console.log("Clearing Azure old OTA blobs\n");
  const containerClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING).getContainerClient(
    CONTAINER_NAME
  );
  const blobs = await filterAzureOldBlob(containerClient, prodFileName);
  if (!blobs.length) {
    console.log("no old OTA blobs");
    return;
  }

  for (const blob of blobs) {
    await containerClient.deleteBlob(blob.name, {
      deleteSnapshots: "include",
    });
    console.log(`delete blob: ${blob.name}`);
  }
  console.log("\nClearing Azure old OTA blobs done!");
};

const filterQiniuOldBlob = (prodFileName) => {
  // qshell listbucket2 --prefix mobile-2.0/ota/ --suffixes '.zip' --end "2022-06-01-00-00-00" lms-mobile

  const expDate = new Date(expTime);
  const expDateStr = `${expDate.getFullYear()}-${expDate.getMonth() + 1}-${expDate.getDate()}-00-00-00`;
  const command = `qshell listbucket2 --prefix mobile-2.0/ota/ --suffixes '.zip' --end "${expDateStr}" ${QINIU_BUCKET}`;

  const blobNames = execSync(command)
    .toString()
    .split("\n")
    .map((item) => item.trim().split("\t")[0].trim())
    .filter((item) => item.length && !item.endsWith(prodFileName));

  return blobNames;
};

const clearQiniu = (prodFileName) => {
  console.log("Clearing QiNiu old OTA blobs\n");

  const blobs = filterQiniuOldBlob(prodFileName);
  if (!blobs.length) {
    console.log("no old OTA blobs");
    return;
  }

  for (const blob of blobs) {
    execSync(`qshell delete ${QINIU_BUCKET} ${blob}`);
    console.log(`delete blob: ${blob}`);
  }
  console.log("\nClearing QiNiu old OTA done!");
};

const getProdUsingOtaFileName = () => {
  if (!env.TC_ORGS_TOOLS_PROJECT_PATH) {
    throw new Error("Please set tc-orgs-tools path in env.js");
  }

  const orgsFilePath = path.join(env.TC_ORGS_TOOLS_PROJECT_PATH, "orgs.json");

  if (!fs.existsSync(orgsFilePath)) {
    throw new Error(`${orgsFilePath} not existed.`);
  }

  const orgsFileJSON = require(orgsFilePath);
  const otaVersion = orgsFileJSON["orgs"][0];

  return ["zipFileUrl", "zipFileUrlTW"].map((key) => path.join("prod", path.basename(otaVersion[key])));
};

const main = async () => {
  const [cnFileName, twFileName] = getProdUsingOtaFileName();
  console.log(`CN prod ota file name: ${cnFileName}`);
  console.log(`TW prod ota file name: ${twFileName}`);

  console.log();
  clearQiniu(cnFileName);
  console.log();
  await clearAzure(twFileName);
};

main()
  .then(() => console.log("Done"))
  .catch((ex) => console.error(ex.message));
