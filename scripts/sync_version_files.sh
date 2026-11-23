#!/bin/bash

set -e

ASSISTANT_REPO_RELATIVE_PATH="${1:-../mobile-assistant}"

cp "${ASSISTANT_REPO_RELATIVE_PATH}"/{version_update.json,version_update_android.json,version_update_ios.json,version_aligner.json} .
