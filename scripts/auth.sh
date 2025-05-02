#!/bin/bash
set -euo pipefail

if [ $# -ge 1 ]; then
    export PROFILE=$1
else
    export PROFILE="dev"
fi

export WORLD_ADDRESS=$(cat ./manifest_$PROFILE.json | jq -r '.world.address')
export RYO_ADDRESS=$(cat ./manifest_$PROFILE.json | jq -r '.contracts[] | select(.tag == "dopewars-ryo" ).address')

if [ $PROFILE == "dev" ]; then
    echo "emit items config"
    sozo -P $PROFILE execute dopewars-config emit_items_config
fi;

if [ $PROFILE == "dopewars" ]; then
    echo "emit items config"
    sozo -P $PROFILE execute dopewars-config emit_items_config
fi;

if [ $PROFILE == "ryosepolia" ]; then
    echo "grant owner on dopewars-ryo to clicksave controller"
    export RYO_SELECTOR="0x032b65ba76433a3384da18dba9d4a63d3a7de35be8bf53a61d71928482a6d75e"
    sozo -P $PROFILE execute $WORLD_ADDRESS grant_owner -c $RYO_SELECTOR,0x40eef43f4d7b9cc357312a83365c3649273886c5394efafdcc9144bd6b86424 --keystore ../../../sozo_acc 
fi;

if [ $PROFILE == "mainnet" ]; then
    echo "grant owner on dopewars-ryo to 0x04042b..."
    export RYO_SELECTOR="0x032b65ba76433a3384da18dba9d4a63d3a7de35be8bf53a61d71928482a6d75e"
    sozo -P $PROFILE execute --fee eth $WORLD_ADDRESS grant_owner -c $RYO_SELECTOR,0x04042b3F651F6d6Ff03b929437AdC30257333723970071b05cb0E2270C9dc385 --keystore ../../../dopewars_key 
fi;