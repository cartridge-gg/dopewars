#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

if [ $# -ge 1 ]; then
    export PROFILE=$1
else
    export PROFILE="dev"
fi

TX_SLEEP=0.5

export WORLD_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.world.address')

export RYO_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::ryo::ryo" ).address')
export CONFIG_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::config::config::config" ).address')
export GAME_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::game::game" ).address')

echo "---------------------------------------------------------------------------"
echo profile : $PROFILE
echo "---------------------------------------------------------------------------"
echo world   : $WORLD_ADDRESS
echo "---------------------------------------------------------------------------"
echo ryo     : $RYO_ADDRESS
echo config  : $CONFIG_ADDRESS
echo game    : $GAME_ADDRESS
echo "---------------------------------------------------------------------------"

# enable system -> models authorizations
sozo -P $PROFILE auth grant --world $WORLD_ADDRESS --wait writer\
 RyoMeta,$RYO_ADDRESS \
 Leaderboard,$RYO_ADDRESS \
 GameConfig,$CONFIG_ADDRESS \
 DrugConfig,$CONFIG_ADDRESS \
 DrugConfigMeta,$CONFIG_ADDRESS \
 LocationConfig,$CONFIG_ADDRESS \
 LocationConfigMeta,$CONFIG_ADDRESS \
 HustlerItemBaseConfig,$CONFIG_ADDRESS \
 Game,$GAME_ADDRESS \
 GameStorePacked,$GAME_ADDRESS \
 Leaderboard,$GAME_ADDRESS \
 RyoMeta,$GAME_ADDRESS \
 > /dev/null


echo "Default authorizations have been successfully set."

echo "Initializing..."
sozo -P $PROFILE execute  --world $WORLD_ADDRESS $RYO_ADDRESS initialize --wait > /dev/null
echo "Initialized RYO!"
sleep $TX_SLEEP

sozo -P $PROFILE execute --world $WORLD_ADDRESS $CONFIG_ADDRESS initialize --wait > /dev/null
echo "Initialized CONFIG!"
sleep $TX_SLEEP
