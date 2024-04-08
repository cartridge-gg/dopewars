#!/bin/bash
set -euo pipefail

# TODO use ./target/[profile]
cp ./manifests/dev/manifest.json ./web/manifest.json 

npx abi-wan-kanabi@2.2.0 --input ./target/dev/rollyourown::config::config::config.json --output ./web/src/dojo/abis/configAbi.ts
npx abi-wan-kanabi@2.2.0 --input ./target/dev/rollyourown::_mocks::paper_mock::paper_mock.json --output ./web/src/dojo/abis/paperAbi.ts

pushd $(dirname "$0")/../web

pnpm run gen:dojo
prettier --write ./src/dojo/generated
