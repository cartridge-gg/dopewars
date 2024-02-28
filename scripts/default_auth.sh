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

export PAPER_MOCK_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "rollyourown::_mocks::paper_mock::paper_mock" ).address')

echo "---------------------------------------------------------------------------"
echo profile : $PROFILE
echo "---------------------------------------------------------------------------"
echo world   : $WORLD_ADDRESS
echo "---------------------------------------------------------------------------"
echo ryo     : $RYO_ADDRESS
echo config  : $CONFIG_ADDRESS
echo game    : $GAME_ADDRESS
echo paper   : $PAPER_MOCK_ADDRESS
echo "---------------------------------------------------------------------------"

# enable system -> models authorizations
sozo -P $PROFILE auth grant --world $WORLD_ADDRESS --wait writer\
 RyoConfig,$RYO_ADDRESS \
 Leaderboard,$RYO_ADDRESS \
 GameConfig,$CONFIG_ADDRESS \
 DrugConfig,$CONFIG_ADDRESS \
 DrugConfigMeta,$CONFIG_ADDRESS \
 LocationConfig,$CONFIG_ADDRESS \
 LocationConfigMeta,$CONFIG_ADDRESS \
 HustlerItemBaseConfig,$CONFIG_ADDRESS \
 Game,$GAME_ADDRESS \
 GameStorePacked,$GAME_ADDRESS \
 RyoConfig,$GAME_ADDRESS \
 Leaderboard,$GAME_ADDRESS \
 > /dev/null


# remove later
sozo -P $PROFILE auth grant --world $WORLD_ADDRESS --wait writer\
 ERC20MetadataModel,$PAPER_MOCK_ADDRESS \
 ERC20BalanceModel,$PAPER_MOCK_ADDRESS \
 ERC20AllowanceModel,$PAPER_MOCK_ADDRESS \
 ERC20BridgeableModel,$PAPER_MOCK_ADDRESS \
 > /dev/null

echo "Default authorizations have been successfully set."

echo "Initializing..."
sozo -P $PROFILE execute  --world $WORLD_ADDRESS $RYO_ADDRESS initialize --calldata $PAPER_MOCK_ADDRESS --wait > /dev/null
echo "Initialized RYO!"
sleep $TX_SLEEP

sozo -P $PROFILE execute --world $WORLD_ADDRESS $CONFIG_ADDRESS initialize --wait > /dev/null
echo "Initialized CONFIG!"
sleep $TX_SLEEP

# remove later
sozo -P $PROFILE execute --world $WORLD_ADDRESS $PAPER_MOCK_ADDRESS initializer --wait > /dev/null
echo "Initialized PAPER_MOCK!"
sleep $TX_SLEEP
