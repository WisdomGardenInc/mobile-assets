const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");
const { BlobServiceClient } = require("@azure/storage-blob");
const env = require("./.env.js");
const AZURE_STORAGE_CONNECTION_STRING = env.AZURE_STORAGE_CONNECTION_STRING;
const fileUrl = process.argv.slice(2)[0];
const CONTAINER_NAME = "mobile-ota";

const uploadFile = async (containerClient, filePath, fileUrl) => {
  const blobName = `${path.basename(path.dirname(fileUrl))}/${path.basename(fileUrl)}`;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  console.log("\nUploading to Azure storage as blob:\n\t", blobName);

  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);

  return blobName;
};

const getContainer = async (blobServiceClient) => {
  console.log("\nCreating container if not exist...");
  console.log("\t", CONTAINER_NAME);

  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  // const createContainerResponse = await containerClient.createIfNotExists();
  // if (createContainerResponse.succeeded) {
  //   console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
  // } else {
  //   console.log(createContainerResponse.errorCode);
  // }
  return containerClient;
};

const listContainer = async (containerClient) => {
  console.log("\nListing blobs...");

  for await (const blob of containerClient.listBlobsFlat()) {
    console.log("\t", "https://aztcmedia.blob.core.windows.net/mobile-ota/" + blob.name);
  }
};

const downloadFile = (fileUrl) => {
  console.log("download file from: ", fileUrl);
  execSync("mkdir -p tmp");
  const filePath = "./tmp/" + path.basename(fileUrl);
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }
  try {
    execSync(`wget -c ${fileUrl} -O ${filePath}`);
    console.log("download done!");
  } catch (error) {
    console.error("download error!", error);
    return "";
  }

  if (!fs.existsSync(filePath)) {
    return "";
  }
  return filePath;
};

const main = async () => {
  if (!fileUrl) {
    console.error("Please provide a file path to upload");
    return;
  }

  const filePath = downloadFile(fileUrl);
  if (!filePath) {
    console.error("download file error exit!");
    return;
  }
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = await getContainer(blobServiceClient);
  const blobName = await uploadFile(containerClient, filePath, fileUrl);
  console.log("\nzip url:");
  console.log("https://aztcmedia.blob.core.windows.net/mobile-ota/" + blobName);
  // await listContainer(containerClient);
};

main()
  .then(() => console.log("Done"))
  .catch((ex) => console.error(ex.message));
