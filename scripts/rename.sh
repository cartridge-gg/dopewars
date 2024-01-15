#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..


export LOBBY_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "lobby" ).address')


sozo execute $LOBBY_ADDRESS set_name -c $1,$2,0x2a2a2a2a2a2a2a