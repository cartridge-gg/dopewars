# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dope Wars is an onchain adaptation of the original Drug Wars game, built on Starknet using the Dojo Engine. It's a multiplayer game where players arbitrage drug prices across different neighborhoods in a fictional NYC, creating a competitive and evolving economic environment.

## Common Development Commands

### Core Dojo/Sozo Commands
```bash
# Build contracts
sozo build

# Local development with Katana
katana --disable-fee
sozo migrate
torii --world {world_address}

# Run default authorization and initialization
./scripts/default_auth.sh [local]

# Generate TypeScript bindings and copy manifest
./scripts/gen.sh
```

### Scarb Script Shortcuts
```bash
# Full migration with auth and codegen
scarb run migrate

# Start Katana with development config
scarb run katana

# Start Torii indexer
scarb run torii

# Generate TypeScript bindings only
scarb run gendojo

# Copy manifest files
scarb run copy_manifest

# Run authorization scripts
scarb run auth
```

### Frontend Development
```bash
cd web
yarn install && yarn dev  # Start frontend at http://localhost:3000
yarn build               # Build for production
yarn lint                # Run ESLint
yarn format             # Format with Prettier
yarn gen                # GraphQL codegen
```

### Testing
```bash
# Run Cairo tests
sozo test

# Frontend tests
cd web && yarn test
```

## Architecture Overview

### Core Structure
- **Cairo Contracts** (`src/`): Smart contracts written in Cairo for Starknet
  - `systems/`: Core game logic (game.cairo, decide.cairo, etc.)
  - `models/`: Data models and structures
  - `config/`: Game configuration (drugs, locations, encounters, etc.)
  - `packing/`: Data packing utilities for optimized storage
  - `utils/`: Math, random number generation, and helper utilities

- **Frontend** (`web/`): Next.js application with Dojo integration
  - `src/dojo/`: Dojo client setup, hooks, and TypeScript bindings
  - TypeScript bindings are auto-generated from Cairo contracts

### Key Concepts
- **Game Loop**: Players travel between locations, trade drugs, encounter events
- **Packing System**: Optimized data storage using bit packing for gas efficiency
- **VRF Integration**: Verifiable random function for game randomness
- **Multi-Network**: Supports dev, dopewars, sepolia, and mainnet deployments

### Contract Systems
- `game.cairo`: Core game mechanics (create_game, travel, end_game)
- `decide.cairo`: Decision-making for encounters (run, pay, fight)
- `laundromat.cairo`: Money laundering mechanics
- `ryo.cairo`: RYO token integration
- `helpers/`: Trading, traveling, shopping logic

### Frontend Integration
- Dojo client connects to Torii indexer for real-time game state
- GraphQL codegen creates typed queries from Dojo schema
- Multiple wallet connectors (Cartridge, Braavos, ArgentX)
- Real-time updates via WebSocket subscriptions

## Development Profiles

The project supports multiple deployment profiles:
- `dev`: Local Katana development
- `dopewars`: Slot deployment
- `ryosepolia`: Sepolia testnet
- `mainnet`: Starknet mainnet
- `provable-dw`: Provable deployment

Profile-specific configurations are in `dojo_*.toml` files.

## Important Notes

- Cairo version is pinned to 2.12.1
- Dojo version is currently v1.7.0
- Frontend uses Next.js 15.3.1 with React 18
- Always run `./scripts/gen.sh` after contract changes to update TypeScript bindings
- The `manifest_*.json` files contain deployed contract addresses and must be copied to `web/src/manifests/`
- VRF provider integration requires specific setup for randomness
- Achievement system is integrated via the `achievement` package