#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/../dope_mock/
pwd
scarb run migrate