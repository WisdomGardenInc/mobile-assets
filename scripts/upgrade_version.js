#!/usr/bin/env node
const { prompt } = require("enquirer");
const versionReg = new RegExp(/^\d+(\.\d+)*$/);
const shell = require("shelljs");
const shellSilentOption = { silent: true };

const getCurrentVersion = () => {
  try {
    const packageJSON = require("../package.json");

    return packageJSON.version;
  } catch (error) {
    console.error("find or parse package.json error");
    return null;
  }
};

const increaseVersionNumber = (currentVersion) => {
  const verNumArr = currentVersion.split(".");

  verNumArr[verNumArr.length - 1] = parseInt(verNumArr[verNumArr.length - 1]) + 1;
  return verNumArr.join(".");
};

const checkVersionFormat = (version) => {
  return versionReg.test(version);
};

const gitCommit = (version) => {
  shell.exec(`git tag v${version} -d`, shellSilentOption);
  shell.exec(`git commit --amend -m "bump to version ${version}" --no-verify`, shellSilentOption);
  shell.exec(`git tag v${version}`, shellSilentOption);
  console.log(`bump to version ${version}, add tag v${version}`);
};

const updatePackageVersion = (version) => {
  const result = shell.exec(`yarn version --new-version ${version} --no-verify`, shellSilentOption);

  if (result.code === 0) {
    return true;
  } else {
    console.error(result.stderr);
    return false;
  }
};

const updateVersion = ({ version }) => {
  const result = updatePackageVersion(version);

  if (result) {
    gitCommit(version);
  }
};

const checkGitWorkingDirectoryClean = () => {
  const result = shell.exec("git status --untracked-files=no --porcelain", shellSilentOption);

  if (result.stdout) {
    console.error("Please make git working directory is clean!");
    return false;
  }
  return true;
};

const inputVersionInfo = (newVersion) => {
  return prompt([
    {
      name: "version",
      type: "input",
      message: "input the new version",
      initial: newVersion,
      validate: (value) => {
        if (!checkVersionFormat(value)) {
          return `newVersion version ${value} format error. e.g. 1.1.1`;
        }
        return true;
      },
    }
  ]);
};

const run = async () => {
  if (!checkGitWorkingDirectoryClean()) {
    return;
  }
  const currentVersion = getCurrentVersion();
  let newVersion = null;

  if (!currentVersion) {
    console.error("can not get current version.");
    return;
  }

  console.log(`
Current Version Info:
version: ${currentVersion}
------------
`);

  newVersion = increaseVersionNumber(currentVersion);
  let input = null;

  try {
    input = await inputVersionInfo(newVersion);
    console.log("\nNew Version Info:");
    console.log(input);
  } catch (error) {
    console.error(error);
  }

  if (!input) {
    console.error(`invalid input.`);
  }

  if (!newVersion) {
    console.error(`invalid version number.`);
    return;
  }
  updateVersion(input);
};

if (require.main === module) {
  run();
}
