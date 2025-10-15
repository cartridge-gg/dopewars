#!/bin/bash

# Start Dope Wars dev server with SSL proxy
# This script starts the Next.js dev server and local-ssl-proxy

set -e

echo "🚀 Starting Dope Wars development server with SSL..."

# Navigate to web directory and start dev server in background
cd web
echo "📦 Installing dependencies..."
pnpm i

echo "🔧 Starting Next.js dev server on port 3000..."
pnpm run dev &
DEV_PID=$!

# Wait for dev server to start
echo "⏳ Waiting for dev server to start..."
sleep 5

# Start SSL proxy in foreground
echo "🔒 Starting SSL proxy on port 3001..."
local-ssl-proxy --source 3001 --target 3000 --cert ./certificates/localhost.pem --key ./certificates/localhost-key.pem &
PROXY_PID=$!

echo ""
echo "✅ Servers started!"
echo "   - Dev server: http://localhost:3000"
echo "   - SSL proxy:  https://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $DEV_PID 2>/dev/null || true
    kill $PROXY_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for processes
wait
