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

# dev/katana
# export TREASURY_ADDRESS="0xe29882a1fcba1e7e10cad46212257fea5c752a4f9b1b1ec683c503a2cf5c8a";

# sepolia deployer
export TREASURY_ADDRESS="0x3677d8443f74dcc6cd23c4b3f217256c70f084ee7edc4ddc431af2ce91eb936";

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

sleep 5

# enable system -> models authorizations
sozo -P $PROFILE auth grant --world $WORLD_ADDRESS --fee-estimate-multiplier 100 --wait writer\
 RyoConfig,$RYO_ADDRESS \
 RyoAddress,$RYO_ADDRESS \
 Season,$RYO_ADDRESS \
 \
 GameConfig,$CONFIG_ADDRESS \
 DrugConfig,$CONFIG_ADDRESS \
 LocationConfig,$CONFIG_ADDRESS \
 HustlerItemBaseConfig,$CONFIG_ADDRESS \
 HustlerItemTiersConfig,$CONFIG_ADDRESS \
 EncounterConfig,$CONFIG_ADDRESS \
 Game,$GAME_ADDRESS \
 \
 GameStorePacked,$GAME_ADDRESS \
 RyoConfig,$GAME_ADDRESS \
 Season,$GAME_ADDRESS \
 SortedList,$GAME_ADDRESS \
 SortedListItem,$GAME_ADDRESS \
 \
 SortedList,$LAUNDROMAT_ADDRESS \
 SortedListItem,$LAUNDROMAT_ADDRESS \
 Season,$LAUNDROMAT_ADDRESS \
 Game,$LAUNDROMAT_ADDRESS \
 RyoConfig,$LAUNDROMAT_ADDRESS \
 \
 SortedList,$DEVTOOLS_ADDRESS \
 SortedListItem,$DEVTOOLS_ADDRESS \
 SortedList,$DEVTOOLS_ADDRESS \
 SortedListItem,$DEVTOOLS_ADDRESS \
 Game,$DEVTOOLS_ADDRESS \
 GameStorePacked,$DEVTOOLS_ADDRESS \

echo "Default authorizations have been successfully set."

echo "Initializing..."
sozo -P $PROFILE execute  --world $WORLD_ADDRESS $RYO_ADDRESS initialize --calldata $PAPER_MOCK_ADDRESS,$TREASURY_ADDRESS,$LAUNDROMAT_ADDRESS --fee-estimate-multiplier 100  --wait
echo "Initialized RYO!"
sleep $TX_SLEEP

sozo -P $PROFILE execute --world $WORLD_ADDRESS $CONFIG_ADDRESS initialize_1 --fee-estimate-multiplier 10 --wait 
echo "Initialized CONFIG 1!"
sleep $TX_SLEEP

sozo -P $PROFILE execute --world $WORLD_ADDRESS $CONFIG_ADDRESS initialize_2 --fee-estimate-multiplier 10 --wait 
echo "Initialized CONFIG 2!"
sleep $TX_SLEEP






#
# PAPER MOCK
# 

sozo -P $PROFILE auth grant --world $WORLD_ADDRESS --fee-estimate-multiplier 100  --wait writer\
 ERC20MetadataModel,$PAPER_MOCK_ADDRESS \
 ERC20BalanceModel,$PAPER_MOCK_ADDRESS \
 ERC20AllowanceModel,$PAPER_MOCK_ADDRESS \
 InitializableModel,$PAPER_MOCK_ADDRESS \

sozo -P $PROFILE execute --world $WORLD_ADDRESS $PAPER_MOCK_ADDRESS initializer --fee-estimate-multiplier 10 --wait 
echo "Initialized PAPER_MOCK!"
sleep $TX_SLEEP
