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
echo " "
echo ryo     : $RYO_ADDRESS
echo config  : $CONFIG_ADDRESS
echo game    : $GAME_ADDRESS
echo "---------------------------------------------------------------------------"

# enable system -> component authorizations

RYO_COMPONENTS=("RyoMeta" "Leaderboard")
CONFIG_COMPONENTS=("GameConfig" "DrugConfig" "DrugConfigMeta" "LocationConfig" "LocationConfigMeta" "HustlerItemBaseConfig" "HustlerItemTiersConfig")
GAME_COMPONENTS=("Game" "GameStorePacked" "Leaderboard" "RyoMeta")


for component in ${RYO_COMPONENTS[@]}; do
    sozo -P $PROFILE auth writer $component $RYO_ADDRESS --world $WORLD_ADDRESS
    sleep $TX_SLEEP
done

for component in ${CONFIG_COMPONENTS[@]}; do
    sozo -P $PROFILE auth writer $component $CONFIG_ADDRESS --world $WORLD_ADDRESS
    sleep $TX_SLEEP
done

for component in ${GAME_COMPONENTS[@]}; do
    sozo -P $PROFILE auth writer $component $GAME_ADDRESS --world $WORLD_ADDRESS
    sleep $TX_SLEEP
done

echo "Default authorizations have been successfully set."

echo "Initializing..."
sozo -P $PROFILE execute $RYO_ADDRESS initialize
echo "Initialized RYO!"
sleep $TX_SLEEP

sozo -P $PROFILE execute $CONFIG_ADDRESS initialize
echo "Initialized CONFIG!"
sleep $TX_SLEEP
