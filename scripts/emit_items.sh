#!/bin/bash
set -euo pipefail

if [ $# -ge 1 ]; then
    export PROFILE=$1
else
    export PROFILE="dev"
fi

echo "emit items config"
sozo -P $PROFILE execute dopewars-config emit_items_config
