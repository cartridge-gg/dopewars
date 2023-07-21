#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export WORLD_ADDRESS="0x26065106fa319c3981618e7567480a50132f23932226a51c219ffb8e47daa84";

# make sure all components/systems are deployed
COMPONENTS=("Game" "Location" "Market" "Name" "Player" "Risks")
SYSTEMS=("create_game" "join_game" "set_name" "travel" "buy" "sell")

# check components
for component in ${COMPONENTS[@]}; do
    sozo component entity $component
done

# check systems
for system in ${SYSTEMS[@]}; do
    SYSTEM_OUTPUT=$(sozo system get $system)
    if [[ "$SYSTEM_OUTPUT" == "0x0" ]]; then
        echo "Error: $system is not deployed"
        exit 1
    fi
done

# enable system -> component authorizations
CREATE_GAME_COMPONENTS=("Game" "Location" "Market" "Name" "Player" "Risks")
JOIN_GAME_COMPONENTS=("Game" "Location" "Player")
SET_NAME_COMPONENTS=("Name")
BUY_COMPONENTS=("Drug" "Market" "Name" "Player")
SELL_COMPONENTS=("Drug" "Market" "Name" "Player")
TRAVEL_COMPONENTS=("Location" "Player")

for component in ${CREATE_GAME_COMPONENTS[@]}; do
    sozo auth writer $component create_game
done

for component in ${JOIN_GAME_COMPONENTS[@]}; do
    sozo auth writer $component join_game 
done

for component in ${SET_NAME_COMPONENTS[@]}; do
    sozo auth writer $component set_name 
done

for component in ${BUY_COMPONENTS[@]}; do
    sozo auth writer $component buy 
done

for component in ${SELL_COMPONENTS[@]}; do
    sozo auth writer $component sell 
done

for component in ${TRAVEL_COMPONENTS[@]}; do
    sozo auth writer $component travel 
done

echo "Default authorizations have been successfully set."