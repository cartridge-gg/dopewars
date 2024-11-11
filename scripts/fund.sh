#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

sozo execute --world 0x04fc1ccab8ac4ce48480a8fbb3d0628e6e52ecc63ca5a3c0dc8a2161a9b01705 \
 --account-address 0x127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec \
 --private-key 0xc5b2fcab997346f3ea1c00b002ecf6f382c5f9c9659a3894eb783c5320f912 \
 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7 transfer \
 -c 0x04898bcbd19688e76a62f28c735ede49513bdc9e5721d2fc611e36933c6b690f,u256:10000000000000000 -vvv
