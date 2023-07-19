#!/bin/bash
set -euxo pipefail
pushd $(dirname "$0")/..

export WORLD_ADDRESS="0x26065106fa319c3981618e7567480a50132f23932226a51c219ffb8e47daa84";

# to see system dependencies, run:
# > sozo system dependency NAME

sozo auth writer Game create_game;
sozo auth writer Location create_game;
sozo auth writer Market create_game;
sozo auth writer Name create_game;
sozo auth writer Player create_game;
sozo auth writer Risks create_game;

sozo auth writer Game join_game;
sozo auth writer Location join_game;
sozo auth writer Player join_game;

sozo auth writer Name set_name;

sozo auth writer Drug buy;
sozo auth writer Market buy;
sozo auth writer Name buy;
sozo auth writer Player buy;

sozo auth writer Drug sell;
sozo auth writer Market sell;
sozo auth writer Name sell;
sozo auth writer Player sell;

sozo auth writer Location travel;
sozo auth writer Player travel;
