#!/bin/bash
set -euo pipefail

if [ $# -ge 1 ]; then
    export PROFILE=$1
else
    export PROFILE="dev"
fi

echo "emit quests"
sozo -P $PROFILE execute dopewars-ryo update_quests
