# Dopewars Game Ownership Test Plan

This document outlines a test plan to verify the ownership-based access control within the main Dopewars systems (`game`, `decide`, `laundromat`, `slot`). The goal is to ensure that game actions can only be performed by the legitimate owner of the corresponding Game Token NFT.

## 1. Contract Reconnaissance

### a. Primary Contracts Under Test

-   `dopewars::systems::game`
-   `dopewars::systems::decide`
-   `dopewars::systems::laundromat`
-   `dopewars::systems::slot`

### b. Core Functions to Test

| System       | Function Signature                   | Access Control Mechanism                  |
| ------------ | ------------------------------------ | ----------------------------------------- |
| `game`       | `create_game(..., token_id: u64)`    | `assert_token_ownership(..., token_id)`   |
| `game`       | `travel(token_id: u64, ...)`         | `assert_token_ownership(..., token_id)`   |
| `game`       | `end_game(token_id: u64, ...)`       | `assert_token_ownership(..., token_id)`   |
| `decide`     | `decide(token_id: u64, ...)`         | `assert_token_ownership(..., token_id)`   |
| `laundromat` | `register_score(token_id: u64, ...)` | `assert_token_ownership(..., token_id)`   |
| `laundromat` | `claim(..., token_ids: Span<u64>)`   | `assert_token_ownership(..., token_id)`   |
| `slot`       | `roll(token_id: u64)`                | `assert_token_ownership(..., token_id)`   |

### c. Supporting Contracts

-   `dopewars::systems::game_token_system_v0`: Used for minting and transferring the Game Tokens.
-   `dojo::world`: The core world contract.

## 2. Behaviour & Invariant Mapping

-   **Core Invariant:** A player can only call state-changing functions on a game instance if they are the current owner of the `token_id` associated with that game. This applies across all game systems.

## 3. Test Design

### Test Suite: `test_game_ownership.cairo`

-   **Setup Function (`setup_world`)**:
    1.  Deploy the full Dopewars world using the Sepolia fork helper.
    2.  Pre-fund two distinct player accounts: `player_a` and `player_b`.
    3.  Mint a new Game Token NFT and assign ownership to `player_a`.
    4.  As `player_a`, create a game instance to be used in subsequent tests.
    5.  Return the deployed contracts, player accounts, and the `token_id`.

-   **Ownership Tests (Happy Path & Revert Path):**
    -   For each function in the table above (e.g., `travel`, `decide`, `register_score`, `roll`, `claim`):
        -   **`test_owner_can_<function>`**: Call the function as `player_a` (the owner). Assert the call succeeds.
        -   **`test_non_owner_cannot_<function>` (Should Panic)**: Call the function as `player_b` (the non-owner). Assert the transaction reverts.

## 4. Integration & Scenario Tests

This is the most critical part of the test plan, verifying that permissions change correctly upon NFT transfer across all systems.

-   **Scenario: `test_ownership_transfer_and_privilege_change`**
    1.  **Setup:**
        -   Call `setup_world` to get `player_a`, `player_b`, the `game_token` contract, and `player_a`'s `token_id`.

    2.  **Verify Initial Permissions:**
        -   As `player_a`, call `travel`. Assert it succeeds.
        -   As `player_b`, attempt to call `travel`. Assert it `#[should_panic]`.
        -   *(This can be repeated for `decide`, `roll`, etc. to be exhaustive)*

    3.  **Transfer Ownership:**
        -   As `player_a`, call `transfer_from` on the `game_token` contract to send the token to `player_b`.
        -   Assert the new owner of the token is `player_b`.

    4.  **Verify Post-Transfer Permissions:**
        -   **Old Owner (Failure):** As `player_a`, attempt to call `travel`, `decide`, and `roll`. Assert all calls `#[should_panic]`.
        -   **New Owner (Success):** As `player_b`, call `travel`, `decide`, and `roll`. Assert all calls succeed.

## 5. Tooling & Environment

-   **Framework:** `scarb`, `sozo`, `dojo`.
-   **Testing Library:** `dojo_snf_test` for fork testing.
-   **Environment:** Fork of Sepolia, using the configuration from `dopewars/src/tests/test_helper.cairo`.
-   **Test File:** `/Users/oss/cairo_container_1/cairo-devcontainer/dopewars/src/tests/test_game_ownership.cairo`

## 6. Self-Audit

This expanded plan now correctly covers the ownership checks for all specified game systems (`game`, `decide`, `laundromat`, `slot`). The integration test is more robust, verifying that a transfer of ownership revokes privileges from the old owner and grants them to the new owner across all relevant contracts. The plan is comprehensive and aligned with the testing goals.
