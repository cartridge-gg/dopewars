#!/bin/bash
set -euo pipefail

if [ $# -ge 1 ]; then
    export PROFILE=$1
else
    export PROFILE="dev"
fi

npx abi-wan-kanabi@2.2.0 --input ./target/$PROFILE/contracts/dopewars-config-45ebce66.json --output ./web/src/dojo/abis/configAbi.ts
npx abi-wan-kanabi@2.2.0 --input ./target/$PROFILE/contracts/dopewars-paper_mock-3534f748.json --output ./web/src/dojo/abis/paperAbi.ts

pushd $(dirname "$0")/../web

pnpm run gen:dojo
pnpm exec prettier --write ./src/dojo/generated
