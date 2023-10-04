#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/../web

yarn run gen:dojo
prettier --write ./src/dojo/generated
