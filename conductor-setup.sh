#!/bin/bash
set -euo pipefail

echo "🎮 Setting up Dope Wars workspace..."

# Check for required Dojo tools
echo "Checking for required tools..."

if ! command -v scarb &> /dev/null; then
    echo "❌ Error: scarb not found. Please install the Dojo toolchain."
    echo "   Visit: https://book.dojoengine.org/getting-started/quick-start.html"
    exit 1
fi

if ! command -v sozo &> /dev/null; then
    echo "❌ Error: sozo not found. Please install the Dojo toolchain."
    echo "   Visit: https://book.dojoengine.org/getting-started/quick-start.html"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm not found. Please install pnpm."
    echo "   Run: npm install -g pnpm"
    exit 1
fi

echo "✅ All required tools found"

# Check for and symlink .env files if they exist in the root repo
if [ -n "${CONDUCTOR_ROOT_PATH:-}" ]; then
    if [ -f "$CONDUCTOR_ROOT_PATH/web/.env.local" ]; then
        echo "Symlinking .env.local from root repo..."
        ln -sf "$CONDUCTOR_ROOT_PATH/web/.env.local" web/.env.local
        echo "✅ Symlinked web/.env.local"
    fi

    if [ -f "$CONDUCTOR_ROOT_PATH/.env" ]; then
        echo "Symlinking .env from root repo..."
        ln -sf "$CONDUCTOR_ROOT_PATH/.env" .env
        echo "✅ Symlinked .env"
    fi
fi

# Build contracts
echo "Building contracts with sozo..."
sozo build

# Install web dependencies
echo "Installing web dependencies..."
cd web
pnpm install

echo ""
echo "✅ Workspace setup complete!"
echo "   You can now use the 'Run' button to start the dev server"
echo "   Or manually run: cd web && pnpm dev"
