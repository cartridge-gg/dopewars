#!/bin/bash
set -euo pipefail

cp ./target/dev/manifest.json ./web/manifest.json 

npx abi-wan-kanabi --input ./target/dev/rollyourown::config::config::config.json --output ./web/src/dojo/abis/configAbi.ts

pushd $(dirname "$0")/../web

pnpm run gen:dojo
prettier --write ./src/dojo/generated
