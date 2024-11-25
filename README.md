![Dope Wars Banner](.github/banner-wide-dw.png)

# Dope Wars

![Github Actions][gha-badge]

[gha-badge]: https://img.shields.io/github/actions/workflow/status/cartridge-gg/rollyourown/test.yml?branch=main

Dope Wars is an onchain adaptation of the original Drug Wars game, built on Starknet using the [Dojo Engine](https://github.com/dojoengine/dojo).

## Development

Install the latest Dojo toolchain from [releases](https://github.com/dojoengine/dojo/releases) or follow the [installation guide](https://book.dojoengine.org/getting-started/quick-start.html)

### With Katana

```bash
# Start Katana
katana --disable-fee

# Build the game
sozo build

# Migrate the world, this will declare/deploy contracts to katana and take note of the world address
sozo migrate

# Start indexer, graphql endpoint at http://localhost:8080
torii --world {world_address}

# Setup default authorization & initialization
./scripts/default_auth.sh [local]

# Copy manifest.json into web directory & do graphql/ts codegen
./scripts/gen.sh

# Start frontend, located at http://localhost:3000
cd web
yarn install && yarn dev
```

In Scarb.toml, there is various shortcut defined using scripts.
For exemple `scarb run migrate` will execute `sozo migrate` then gen.sh / default_auth.sh

```bash
sozo build && scarb run migrate
```

#### Any errors when doing `sozo build` ?

This might be because your version of sozo is not correct.

Check the `Scarb.toml` file and get the `rev` or `tag` from the `dojo` dependency:
```toml
[dependencies]
dojo = { git = "https://github.com/dojoengine/dojo.git", rev = "ca2d2e6dd1ef0fe311310ba0728be8743b1d5cc8" }
# or
dojo = { git = "https://github.com/dojoengine/dojo.git", tag = "v0.3.15"}
```

In this example, this is how we would install the correct `rev` version:
```bash
git clone https://github.com/dojoengine/dojo.git
cd dojo
git checkout ca2d2e6dd1ef0fe311310ba0728be8743b1d5cc8
dojoup -p .
```

For tagged version, you can use dojoup:
```bash
dojoup -v v0.3.15
```

This will reinstall the binaries in your `~/.dojo/bin` folder.

### With Madara

TBD

## Mechanics

As in the original Drug Wars, players will land in a fictional NYC, arbitraging the price of drugs in an attempt to stack paper and own the streets.

Dope Wars extends the core game mechanic of arbitraging drugs in different neighborhoods to a multiplayer environment where each player’s actions affect the in-game economy, creating a competitive and evolving environment. During each turn, a player will travel to a neighborhood, review the current market prices for drugs, and decide to Buy or Sell. After each turn is complete, the market prices will be affected by the previous player’s turn, adding a new layer of strategy to the game. Random events affect prices between turns to avoid making the game too deterministic.

### Game Loop

The following game loop is repeated until the end condition of the game is reached:

```mermaid
graph TB
    J{{Join game lobby}} -->|Deposit fee + Commit to Loadout| B[Wait for Start]
    B --> |Markets initialized, Loadout revealed|TS
    TS[Turn Sarts] --> TsN
    TsN([Player at Location])
    TsS([Player is in the Shop])

    TsN --> Trade{{Buys / Sells drugs on local markets}}
    Trade --> Travel{{Select next location to travel to}}
    Travel --> Safe[/Player travels without incident/]
    Travel --> E[/Player Encounters Gang / Cops/] --> ED
    TsS --> Shop{{Player Can Buy an Item}}

    subgraph Encounter
        ED{{Select Pay / Run / Fight}}
        ED --> CP[Pay] & CF[Fight\n] & CR[Run]

        CP --> |Pay Them Off|Op([Paid])

        CR --> |Escapes|Oe([Escaped])
        CR --> |Gets Caught|Oc([Captured])

        CF --> |Wins Fight|Ov([Victorious])
        CF --> |Looses Fight|Oc
        Oc --> Oc0>Loose Some Health]
        Oc0 --> Oc1[/Has Some Health Left/]
        Oc0 --> Oc2[/Has None Health Left/]
        Oc1 --> ED
        Oc2 --> Od([Dead])
        Op --> L>Loose some drugs / money]
        Oe --> R>Location gets Randomised]
        Ov --> W>Gain Some Money]

    end
    Shop --> ET[End Travel]
    Safe --> CS[Check if Shop is Open\nShop opens every nth turn]
     
    L --> CS
     
    R --> CS
    W --> CS
    Od --> GO[Game Over]

    
    CS --> SO[/Shop Open/] --> TsS
    CS --> SC[/Shop Closed/]
    SC --> ET --> MU>Markets Update] --> TE[Turn Ends] --> TS


```

### Future improvements

Currently, game initialization state is hidden during the `join` phase, players commit to a loadout (i.e. their weapons, clothing, etc) and reveal it upon their first turn. Once the game has begun, market state is randomly initialized (each location contains a constant product market) and players can start the game loop. Market state is transparent, players can view the prices at other locations as well as other player balances.

- Player inventories should be hidden until the game end condition is reached, at which point, they would reveal their current inventory
- Mugging is currently PVE, eventually, it would be cool to do it PVP, in which case, the mugger should not know the loadout of their target until the mugging is performed. Ideally there is a mechanism to force the "mugger" and "muggee" to reveal their loadout. See https://github.com/FlynnSC/zk-hunt#search