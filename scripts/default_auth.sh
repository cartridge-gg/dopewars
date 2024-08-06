#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

if [ $# -ge 1 ]; then
    export PROFILE=$1
else
    export PROFILE="dev"
fi

TX_SLEEP=1

export WORLD_ADDRESS=$(cat ./manifests/$PROFILE/deployment/manifest.json | jq -r '.world.address')

export CONFIG_ADDRESS=$(cat ./manifests/$PROFILE/deployment/manifest.json | jq -r '.contracts[] | select(.tag == "dopewars-config" ).address')

echo "---------------------------------------------------------------------------"
echo profile    : $PROFILE
echo "---------------------------------------------------------------------------"
echo world      : $WORLD_ADDRESS
echo "---------------------------------------------------------------------------"
echo config     : $CONFIG_ADDRESS
echo "---------------------------------------------------------------------------"

sleep 2

sozo -P $PROFILE execute -vvv --world $WORLD_ADDRESS $CONFIG_ADDRESS initialize_1  --wait 
echo "Initialized CONFIG 1!"
sleep $TX_SLEEP

sozo -P $PROFILE execute -vvv --world $WORLD_ADDRESS $CONFIG_ADDRESS initialize_2  --wait 
echo "Initialized CONFIG 2!"
sleep $TX_SLEEP


