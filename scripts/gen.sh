#!/bin/bash
set -euo pipefail

cp ./target/dev/manifest.json ./web/manifest.json 

pushd $(dirname "$0")/../web

yarn run gen:dojo
prettier --write ./src/dojo/generated
