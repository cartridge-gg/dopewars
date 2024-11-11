#!/bin/bash
set -euo pipefail

if [ $# -ge 1 ]; then
    export PROFILE=$1
else
    export PROFILE="dev"
fi

mkdir -p ./web/src/manifests
cp ./manifest_$PROFILE.json ./web/src/manifests/


