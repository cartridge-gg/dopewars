#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export WORLD_ADDRESS="0x3c3dfeb374720dfd73554dc2b9e0583cb9668efb3055d07d1533afa5d219fd5";

# make sure all components/systems are deployed
COMPONENTS=("Game" "Market" "Name" "Player" "Risks")
SYSTEMS=("create_game" "join_game" "set_name" "travel" "buy" "sell")

# check components
for component in ${COMPONENTS[@]}; do
    sozo component entity $component --world $WORLD_ADDRESS > /dev/null
done

# check systems
for system in ${SYSTEMS[@]}; do
    SYSTEM_OUTPUT=$(sozo system get $system --world $WORLD_ADDRESS)
    if [[ "$SYSTEM_OUTPUT" == "0x0" ]]; then
        echo "Error: $system is not deployed"
        exit 1
    fi
done

# enable system -> component authorizations
CREATE_GAME_COMPONENTS=("Game" "Market" "Name" "Player" "Risks")
JOIN_GAME_COMPONENTS=("Game" "Player")
SET_NAME_COMPONENTS=("Name")
BUY_COMPONENTS=("Drug" "Market" "Name" "Player")
SELL_COMPONENTS=("Drug" "Market" "Name" "Player")
TRAVEL_COMPONENTS=("Player")

for component in ${CREATE_GAME_COMPONENTS[@]}; do
    sozo auth writer $component create_game --world $WORLD_ADDRESS
done

for component in ${JOIN_GAME_COMPONENTS[@]}; do
    sozo auth writer $component join_game --world $WORLD_ADDRESS
done

for component in ${SET_NAME_COMPONENTS[@]}; do
    sozo auth writer $component set_name --world $WORLD_ADDRESS
done

for component in ${BUY_COMPONENTS[@]}; do
    sozo auth writer $component buy --world $WORLD_ADDRESS
done

for component in ${SELL_COMPONENTS[@]}; do
    sozo auth writer $component sell --world $WORLD_ADDRESS
done

for component in ${TRAVEL_COMPONENTS[@]}; do
    sozo auth writer $component travel --world $WORLD_ADDRESS
done

echo "Default authorizations have been successfully set."