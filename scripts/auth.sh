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
    echo "do nothing"
fi;

if [ $PROFILE == "ryo1" ]; then
    echo "do nothing"
fi;

if [ $PROFILE == "ryosepolia" ]; then
    echo "grant owner on dopewars-ryo to click_save controller"
    export RYO_SELECTOR="0x032b65ba76433a3384da18dba9d4a63d3a7de35be8bf53a61d71928482a6d75e"
    sozo -P $PROFILE execute $WORLD_ADDRESS grant_owner -c $RYO_SELECTOR,0x44cea566ac53bf7c36b298e36536c1a53ba0b0bdf66b2c5f437965605acface --keystore ../../../sozo_acc 
fi;

if [ $PROFILE == "mainnet" ]; then
    echo "todo"
fi;