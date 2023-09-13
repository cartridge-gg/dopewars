#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export RPC_URL="http://localhost:5050";
#export RPC_URL="https://api.cartridge.gg/x/rollyourown/katana";
export WORLD_ADDRESS="0x3c3dfeb374720dfd73554dc2b9e0583cb9668efb3055d07d1533afa5d219fd5";

# enable system -> component authorizations
CREATE_GAME_COMPONENTS=("Game" "Market" "Name" "Player" "Risks")
JOIN_GAME_COMPONENTS=("Game" "Player")
SET_NAME_COMPONENTS=("Name")
BUY_COMPONENTS=("Drug" "Market" "Name" "Player")
SELL_COMPONENTS=("Drug" "Market" "Name" "Player")
TRAVEL_COMPONENTS=("Player")
DECIDE_COMPONENTS=("Player" "Drug")

for component in ${CREATE_GAME_COMPONENTS[@]}; do
    sozo auth writer $component create_game --world $WORLD_ADDRESS --rpc-url $RPC_URL
    sleep 0.1
done

for component in ${JOIN_GAME_COMPONENTS[@]}; do
    sozo auth writer $component join_game --world $WORLD_ADDRESS --rpc-url $RPC_URL
    sleep 0.1
done

for component in ${SET_NAME_COMPONENTS[@]}; do
    sozo auth writer $component set_name --world $WORLD_ADDRESS --rpc-url $RPC_URL
    sleep 0.1
done

for component in ${BUY_COMPONENTS[@]}; do
    sozo auth writer $component buy --world $WORLD_ADDRESS --rpc-url $RPC_URL
    sleep 0.1
done

for component in ${SELL_COMPONENTS[@]}; do
    sozo auth writer $component sell --world $WORLD_ADDRESS --rpc-url $RPC_URL
    sleep 0.1
done

for component in ${TRAVEL_COMPONENTS[@]}; do
    sozo auth writer $component travel --world $WORLD_ADDRESS --rpc-url $RPC_URL
    sleep 0.1
done

for component in ${TRAVEL_COMPONENTS[@]}; do
    sozo auth writer $component decide --world $WORLD_ADDRESS --rpc-url $RPC_URL
    sleep 0.1
done

for component in ${DECIDE_COMPONENTS[@]}; do
    sozo auth writer $component decide --world $WORLD_ADDRESS --rpc-url $RPC_URL
    sleep 0.1
done

echo "Default authorizations have been successfully set."