#!/bin/bash
set -euo pipefail

if [ $# -ge 1 ]; then
    export PROFILE=$1
else
    export PROFILE="dev"
fi

npx abi-wan-kanabi@2.2.0 --input ./target/$PROFILE/rollyourown_config.contract_class.json --output ./web/src/dojo/abis/configAbi.ts
npx abi-wan-kanabi@2.2.0 --input ./target/$PROFILE/rollyourown_paper_mock.contract_class.json --output ./web/src/dojo/abis/paperAbi.ts

pushd $(dirname "$0")/../web

pnpm run gen:dojo
