#!/bin/bash
set -euo pipefail

if [ $# -ge 1 ]; then
    PROFILE=$1
else
    PROFILE="dev"
fi

NAMESPACE="dopewars_v0"

WORLD_ADDRESS=$(cat ./manifest_$PROFILE.json | jq -r '.world.address')
RYO_ADDRESS=$(cat ./manifest_$PROFILE.json | jq -r '.contracts[] | select(.tag == "dopewars_v0-ryo" ).address')

LAUNDROMAT_ADDRESS=$(cat ./manifest_$PROFILE.json | jq -r '.contracts[] | select(.tag == "dopewars_v0-laundromat" ).address')

DOPE_HUSTLERS_ADDRESS=$(cat ./web/src/manifests_dope/manifest_$PROFILE.json | jq -r '.contracts[] | select(.tag == "dope-DopeHustlers" ).address')
DOPE_GEAR_ADDRESS=$(cat ./web/src/manifests_dope/manifest_$PROFILE.json | jq -r '.contracts[] | select(.tag == "dope-DopeGear" ).address')

echo "emit items config"
sozo -P $PROFILE execute dopewars_v0-config emit_items_config --wait

echo "emit quests"
sozo -P $PROFILE execute dopewars_v0-ryo update_quests

echo "grant minter role to laundromat for dope_hustlers"
sozo -P $PROFILE execute $DOPE_HUSTLERS_ADDRESS grant_role sstr:MINTER_ROLE $LAUNDROMAT_ADDRESS --wait

echo "grant minter role to laundromat for dope_gear"
sozo -P $PROFILE execute $DOPE_GEAR_ADDRESS grant_role sstr:MINTER_ROLE $LAUNDROMAT_ADDRESS --wait

# if [ $PROFILE == "dev" ]; then
# fi

# if [ $PROFILE == "dopewars" ]; then
# fi

if [ $PROFILE == "sepolia" ]; then
    echo "grant owner on dopewars_v0-ryo to clicksave controller"
    RYO_SELECTOR="0x032b65ba76433a3384da18dba9d4a63d3a7de35be8bf53a61d71928482a6d75e"
    sozo -P $PROFILE execute $WORLD_ADDRESS grant_owner $RYO_SELECTOR 0x40eef43f4d7b9cc357312a83365c3649273886c5394efafdcc9144bd6b86424 --wait
fi

if [ $PROFILE == "mainnet" ]; then
    echo "grant owner on dopewars_v0-ryo to 0x04042b..."
    RYO_SELECTOR="0x032b65ba76433a3384da18dba9d4a63d3a7de35be8bf53a61d71928482a6d75e"
    sozo -P $PROFILE execute $WORLD_ADDRESS grant_owner $RYO_SELECTOR 0x04042b3F651F6d6Ff03b929437AdC30257333723970071b05cb0E2270C9dc385 --wait
fi
