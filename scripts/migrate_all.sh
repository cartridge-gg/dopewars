#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

. ./scripts/dope_mock.sh

popd +0

scarb run migrate