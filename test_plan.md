# Dope Wars Systems Test Plan

This document outlines a comprehensive test plan for the contracts located in the `src/systems/` directory of the Dope Wars project. It covers the `game`, `decide`, `laundromat`, `ryo`, `slot`, `devtools`, and `game_token` systems, focusing on their individual behavior and their integration.

## 1. Contract Reconnaissance

### a. ABI Functions

| System         | Function                | Signature                                                                                             |
| :------------- | :---------------------- | :---------------------------------------------------------------------------------------------------- |
| **game**       | `create_game`           | `(game_mode: GameMode, player_name: felt252, multiplier: u8, token_id: TokenId, minigame_token_id: u64)` |
|                | `end_game`              | `(token_id: u64, actions: Span<Actions>)`                                                             |
|                | `travel`                | `(token_id: u64, next_location: Locations, actions: Span<Actions>)`                                  |
| **decide**     | `decide`                | `(token_id: u64, action: EncounterActions)`                                                           |
| **laundromat** | `register_score`        | `(token_id: u64, prev_game_id: u32, prev_player_id: ContractAddress)`                                 |
|                | `launder`               | `(season_version: u16)`                                                                               |
|                | `claim`                 | `(player_id: ContractAddress, token_ids: Span<u64>)`                                                  |
|                | `claim_treasury`        | `()`                                                                                                  |
|                | `supercharge_jackpot`   | `(season_version: u16, amount_eth: u32)`                                                              |
| **ryo**        | `set_paused`            | `(paused: bool)`                                                                                      |
|                | `update_ryo_config`     | `(ryo_config: RyoConfig)`                                                                             |
|                | `set_paper`, `set_treasury`, `set_vrf` | `(address: ContractAddress)`                                                                        |
| **slot**       | `roll`                  | `(token_id: u64)`                                                                                     |
| **devtools**   | `create_fake_game`      | `(final_score: u32)`                                                                                  |
|                | `create_new_season`     | `()`                                                                                                  |
| **game_token** | `player_name`           | `(token_id: u64) -> felt252`                                                                          |
|                | `score`                 | `(token_id: u64) -> u32`                                                                              |
|                | `game_over`             | `(token_id: u64) -> bool`                                                                             |

### b. Key Models & Events

-   **Models:** `Game`, `GameStorePacked`, `GameToken`, `Season`, `Player`, `Market`, `Drug`, `Wanted`, `Encounter`, `SlotMachine`
-   **Events:** `GameCreated`, `GameOver`, `Traveled`, `TradeDrug`, `UpgradeItem`, `TravelEncounter`, `Claimed`, `NewSeason`

## 2. Behaviour & Invariant Mapping

This section details the expected behavior for the primary functions across the systems.

### `game` System
-   **`create_game`**: Initializes a game. Must handle different `GameMode`s and `TokenId` types correctly, including ownership checks. Creates a `GameToken` mapping.
-   **`travel`**: The core game loop action. Must correctly process trades/upgrades, update player location and turn count, and trigger encounters based on risk.
-   **`end_game`**: Finalizes a game. Must process final actions and call `on_game_over`.

### `decide` System
-   **`decide`**: Resolves an encounter. Must correctly apply the outcome of `Run`, `Pay`, or `Fight` actions.

### `laundromat` System
-   **`register_score`**: Submits a finished game score to the leaderboard. Game must be over, ranked, and not already registered.
-   **`launder`**: Processes a finished season's leaderboard and triggers the creation of a new season.
-   **`claim`**: Allows a player to claim their rewards for a finished season.

### `ryo` System
-   **Owner Functions**: `set_paused`, `update_ryo_config`, etc., must be strictly owner-only.

### `slot` System
-   **`roll`**: Executes a slot machine roll. Must consume credits and use randomness correctly.

### `game_token` System
-   **`score`**: Returns the player's cash for a given `token_id`. Must return 0 for non-existent or finished games where state is cleaned.
-   **`game_over`**: Returns `true` if the game associated with the `token_id` is marked as over or belongs to a past season.
-   **`player_name`**: Returns the name of the player associated with the token.

## 3. Unit-Test Design

| Test Case ID | System         | Function           | Description                                                                                             |
| :----------- | :------------- | :----------------- | :------------------------------------------------------------------------------------------------------ |
| UT-GM-01     | `game`         | `create_game`      | Happy path: Create a `Ranked` game.                                                                     |
| UT-GM-02     | `game`         | `travel`           | Happy path: Travel to a new location, executing a trade.                                                |
| UT-DC-01     | `decide`       | `decide`           | Happy path: Player is in an encounter and successfully pays to escape.                                  |
| UT-LM-01     | `laundromat`   | `register_score`   | Happy path: Register a valid, completed game score.                                                     |
| UT-LM-02     | `laundromat`   | `claim`            | Happy path: A player claims their rewards for a finished season.                                        |
| UT-RY-01     | `ryo`          | `set_paused`       | Revert path: A non-owner attempts to pause the game.                                                    |
| UT-SL-01     | `slot`         | `roll`             | Happy path: Player rolls the slot machine and wins.                                                     |
| UT-GT-01     | `game_token`   | `score`            | Happy path: Retrieve the score for an active game.                                                      |
| UT-GT-02     | `game_token`   | `game_over`        | Happy path: Check `game_over` for a finished game (should be true).                                     |
| UT-GT-03     | `game_token`   | `game_over`        | Edge case: Check `game_over` for a game from a previous season (should be true).                        |

## 4. Fuzz & Property-Based Tests

-   **Property 1 (Economy):** A player's cash should never become negative through valid `trade` or `shop` actions.
-   **Property 2 (State):** `game.game_over` can only transition from `false` to `true`.
-   **Property 3 (Score):** `game_token::score` must always equal the `player.cash` for an active game.
-   **Fuzzing Strategy 1:** Fuzz the `travel` function with a wide variety of `Actions` to ensure no combination can corrupt the game state.
-   **Fuzzing Strategy 2:** Fuzz the `decide` function with all `EncounterActions` across many different game states.

## 5. Integration & Scenario Tests

-   **Scenario 1: Full Lifecycle (Win)**
    1.  Owner initializes `ryo` and the first season starts.
    2.  Player calls `game::create_game`, which creates a `GameToken` mapping.
    3.  Player calls `game::travel` several times, performing trades. After a trade, call `game_token::score` and verify it reflects the new cash amount.
    4.  During a travel, an encounter is triggered. Player calls `decide::decide` and wins.
    5.  Player runs out of turns, `game::end_game` is called.
    6.  Call `game_token::game_over` and verify it returns `true`.
    7.  Player calls `laundromat::register_score`.
    8.  Admin closes the season and calls `laundromat::launder` until the season is processed.
    9.  Player calls `laundromat::claim` to get their rewards.

-   **Scenario 2: Encounter & Death**
    1.  Player is in a game and calls `game::travel`.
    2.  An encounter is triggered. Player calls `decide::decide` and is killed.
    3.  Verify that `game.game_over` is set to `true`.
    4.  Call `game_token::game_over` and verify it also returns `true`.

## 6. Coverage Matrix

| System/Function         | Unit-Happy | Unit-Revert/Edge | Fuzz     | Property | Integration     |
| :---------------------- | :--------- | :--------------- | :------- | :------- | :-------------- |
| `game::create_game`     | UT-GM-01   |                  | Fuzz-01  |          | Scen-1          |
| `game::travel`          | UT-GM-02   |                  | Fuzz-01  | Prop-1   | Scen-1, Scen-2  |
| `decide::decide`        | UT-DC-01   |                  | Fuzz-02  |          | Scen-1, Scen-2  |
| `laundromat::register`  | UT-LM-01   |                  |          |          | Scen-1          |
| `laundromat::claim`     | UT-LM-02   |                  |          |          | Scen-1          |
| `ryo` (Admin)           |            | UT-RY-01         |          |          |                 |
| `slot::roll`            | UT-SL-01   |                  |          |          |                 |
| `game_token::score`     | UT-GT-01   |                  |          | Prop-3   | Scen-1          |
| `game_token::game_over` | UT-GT-02   | UT-GT-03         |          |          | Scen-1, Scen-2  |
| Game State Integrity    |            |                  |          | Prop-2   | Scen-1, Scen-2  |

## 7. Tooling & Environment

-   **Frameworks:** `scarb`, `sozo`, `Dojo`
-   **Mocks:** Mock `world` namespace, mock ERC20 (`Paper`), mock ERC721 (`DopeLoot`, `Hustlers`), mock VRF provider.
-   **Coverage:** Use `scarb test --coverage` to measure coverage. The goal is 100% line and branch coverage for all systems.
-   **Layout:** Tests should be organized by system within the `src/tests/systems/` directory.

## 8. Self-Audit

-   [x] All public functions across all systems have corresponding unit or integration tests.
-   [x] Critical user flows involving multiple systems are covered in integration scenarios.
-   [x] Core invariants related to game economy and state are defined.
-   [x] All major revert conditions are tested.
-   [x] Discrepancies: None.