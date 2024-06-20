#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

if [ $# -ge 1 ]; then
    export PROFILE=$1
else
    export PROFILE="dev"
fi

TX_SLEEP=1

export WORLD_ADDRESS=$(cat ./manifests/$PROFILE/manifest.json | jq -r '.world.address')

export RYO_ADDRESS=$(cat ./manifests/$PROFILE/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::ryo::ryo" ).address')
export CONFIG_ADDRESS=$(cat ./manifests/$PROFILE/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::config::config::config" ).address')
export GAME_ADDRESS=$(cat ./manifests/$PROFILE/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::game::game" ).address')
export LAUNDROMAT_ADDRESS=$(cat ./manifests/$PROFILE/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::laundromat::laundromat" ).address')
export DEVTOOLS_ADDRESS=$(cat ./manifests/$PROFILE/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::systems::devtools::devtools" ).address')

export PAPER_MOCK_ADDRESS=$(cat ./manifests/$PROFILE/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::_mocks::paper_mock::paper_mock" ).address')

echo "---------------------------------------------------------------------------"
echo profile    : $PROFILE
echo "---------------------------------------------------------------------------"
echo world      : $WORLD_ADDRESS
echo "---------------------------------------------------------------------------"
echo ryo        : $RYO_ADDRESS
echo config     : $CONFIG_ADDRESS
echo game       : $GAME_ADDRESS
echo laundromat : $LAUNDROMAT_ADDRESS
echo devtools   : $DEVTOOLS_ADDRESS
echo "---------------------------------------------------------------------------"
echo paper      : $PAPER_MOCK_ADDRESS
echo "---------------------------------------------------------------------------"

sleep 2

sozo -P $PROFILE execute -vvv --world $WORLD_ADDRESS $CONFIG_ADDRESS initialize_1  --wait 
echo "Initialized CONFIG 1!"
sleep $TX_SLEEP

sozo -P $PROFILE execute -vvv --world $WORLD_ADDRESS $CONFIG_ADDRESS initialize_2  --wait 
echo "Initialized CONFIG 2!"
sleep $TX_SLEEP


