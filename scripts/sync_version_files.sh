#!/bin/bash

ASSISTANT_REPO_RELATIVE_PATH="${1:-../mobile-assistant}"

cp ${ASSISTANT_REPO_RELATIVE_PATH}/version_update_android.json .
cp ${ASSISTANT_REPO_RELATIVE_PATH}/version_update_ios.json .
cp ${ASSISTANT_REPO_RELATIVE_PATH}/version_aligner.json .
