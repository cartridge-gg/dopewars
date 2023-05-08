![Roll Your Own Banner](.github/banner-wide.png)

# Roll Your Own

![Github Actions][gha-badge]

[gha-badge]: https://img.shields.io/github/actions/workflow/status/cartridge-gg/rollyourown/test.yml?branch=main

Roll Your Own is an onchain adaptation of the original Drug Wars game, built on Starknet using the [Dojo Engine](https://github.com/dojoengine/dojo).

### Development

Install the [latest Dojo toolchain](https://github.com/dojoengine/dojo/releases)

```bash
# Build the game
dojo build
```

### Mechanics

As in the original, players will land in Dope Wars locations, arbitraging the price of drugs in an attempt to stack paper and own the streets.

RYO extends the core game mechanic of arbitraging drugs in different neighborhoods to a multiplayer environment where each player’s actions affect the in-game economy, creating a competitive and evolving environment. During each turn, a player will travel to a neighborhood, review the current market prices for drugs, and decide to Buy or Sell. After each turn is complete, the market prices will be affected by the previous player’s turn, adding a new layer of strategy to the game. Random events affect prices between turns to avoid making the game too deterministic.

#### Game Loop

The following game loop is repeated until the end condition of the game is reached:

```mermaid
flowchart TD
    A[Join game lobby] -->|Deposit fee + Commit to Loadout| B[Wait for Start]
    B --> |Markets initialized, Loadout revealed|C[Arrives at random location]
    C --> |Buys / Sells drugs on local markets|D[Select next location to travel to]
    D --> |Player travels without incident|END[Turn ends]
    D --> F[Player is Mugged]
    F --> F1[Fight]
    F --> F2[Run]
    F2 --> F12[Win] --> END
    F2 --> L[Lose]
    L --> |Player loses their stash|END
    D --> G[Chased by Cops]
    G --> F1[Fight]
    G --> F2[Run]
    F1 --> F12
    F1 --> L
    END --> |Market prices update|C
```
