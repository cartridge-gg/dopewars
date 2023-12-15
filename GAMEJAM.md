# CAIRO

Project actually uses dojo v0.3.15.
to install matching toolchain version (katana, sozo, torii) just `dojoup -v v0.3.15`.

## Models

Game Models, types (stucts/enums) & simples helpers impl (into, introspection on enums,..)

#### Game
Stores Game related informations like game_mode (actually used for testing to load different settings), start_time & max_turns.

Some legacy fields (max_players, num_players, creator) are not used atm.
(Actually thoses fields could sit in Player as there is always 1 Game for 1 Player)

#### Player
Represent a Player in a Game. (keys are `game_id` & `player_id`)
Common player infos (name, avatar, ..)
Game related infos (cash, health, location, ..)

status: PlayerStatus is used for handling special events in game loop (Normal is default, AtPawnshop for when player can access it, BeingMugged/BeingArrested when doing encounters while traveling )

#### Location (not a model)
This is not a model, just enum/helpers to handle Locations

#### Drug
Stores quantity of each drug owned by a Player for a Game
(keys : `game_id`, `player_id`, `drug_id`)

#### Item
Stores Items owner by a Player for a Game
(keys : `game_id`, `player_id`, `item_id`)

#### Market
Stores "liquidity pools" for a Game, 1 pool for each drug (x6) and each location (x6) --> 36 pools
(keys: `game_id`, `location_id`, `drug_id`)

Each pool contains cash & quantity for a drug at a location in the current game and act as a uniswapV2 pool.

#### Encounter
Stores encounters for a Player in a Game
(keys: `game_id`, `player_id`, `encouter_id`)

There is 2 types of encounters (Gangs/Cops)
level, health, payout( what you earn if you beat em), demand_pct(how much they want in %)

#### Ryo
Store RYO related infos.
Actually only used for handling leaderboards (with leaderboard_version).

It should be initialized after migration

#### Leaderboard
A new leaderboard version is created if there has been no new highscore for a configurable period (1 day / 1 week ..)
It stores the `high_score` & `next_version_timestamp` for a leaderboard version.


## Systems

Contracts with callable entrypoints

#### Ryo
This is use to initialize RYO related infos

Actually used to setup first leaderboard.

#### Lobby
Entrypoint to create a game via `create_game`.

Initialize Game & Player models with settings.

Initialize Markets (lps for each location/drug)

Emit events

#### Travel
At game start you have to chose a location, this is done calling `travel` function.

It checks your player_status (you cannot travel if you are AtPawnshop or Being Mugged/Arrested) and other stuff (max_turns, valid location_id, ..)

If you don't make encounter, you land in the desired location and can sell drugs for profit$.

If you meet Cops or Gangs, player_status is changed and you'll have to make decisions.

Also handles end game if you are at max_turns, you end game calling `end_game`.

An help fn `on_turn_end` is used to handle turn_end.
A turn can end from travel, decide, or shop (when leaving pawnshop).

It check if player should be redirected to pawnshop, update turn number & wanted. And call `market::market_variations` to make prices changes.

#### Decide

`decide` function is used to handle player choices (fight, pay, run).
When meeting encounter, you only can `decide` until resolution. Events are emitted for each decision to be handled by front.

When resolved it then change you player_status to Normal
& call the `travel::on_turn_end` fn.

#### Shop

When player_status is AtPawnshop, you can either `buy_item` or `skip`. Notice they both call the `travel::on_turn_end` fn too to handle turn end.

`available_items` is called by front to compute which items are buyable.

#### Trade

Allow player to `buy` or `sell` drugs at his location.

It uses uniswapV2 constant product formula  x * y = k

### Constants

`const SCALING_FACTOR: u128 = 10_000;`
Its used for cash precision (100 is stored as 100 * SCALING_FACTOR = 1_000_000 )

## Utils

#### Settings

This is where almost all settings are set. 
There is differents traits for diff kinds of settings (SettingsTrait, DrugSettingsTrait, PlayerSettingsTrait..) used to retrieve settings for given parameters.

All settings traits use game_mode.Its been used to handle 2 games modes (limited turn nb / unlimited) and is actually used to for testing and allow to override default settings.

(ex: to test encounters & death, set a default high wanted(% chance of making encounters) and a low hp level)

#### Events

Helper to emit raw events (could probly be removed now)

#### Random

Helper to handle 'randomness'

#### Math

Helpers for some math operations `add_capped` & `sub_capped`

#### Market

Helpers to manage Markets (initialization, price variations, inflation xd)

#### Risk

Helpers to handle risks while traveling / runing

#### Shop

Helper to check if shop is opened for a given player

#### Leaderboard

Helpers to handle Leaderboards

`on_game_start` is called at each game start to check if current leaderboard should be historized

`on_game_end` check if its a new highscore & update it, and reset next_version_timestamp.


## WEB / NEXT.JS

### Most useful files

`/dojo/hooks/useSystems.ts` : smart contracts interactions calls

`/dojo/queries/*` : hooks to deal with graphQL

`/dojo/events.ts` : event types & parsing 

`/graphql/*` : graphql queries & subscriptions used by codegen to gen `/generated` using `yarn gen` or `scarb run gendojo`

`/hooks/player.tsx` : handle graphql subscriptions for a player/game

### Most useless files 

`/dojo/generated` : this is some mainly unused generated code, **only contractEvents > WorldEvents is used**

`/dojo/setup/create*` : unused


## HOW TO

### Add a new field to Player model

#### CAIRO  

- update `models/player.cairo` to add a new field
- (*optionnal*) add a PlayerSettings in `utils/settings.cairo` if needed
- update `systems/lobby.cairo` to initialize field at game start
- do what you want with this field in cairo code

Launch katana 
`katana --disable-fee`

Launch torii, we will need it for graphql codegen
`torii --world_address [deployed_world_address]`

use sozo to build & migrate
`sozo build && scarb run migrate`

check [readme](./README.md) for more details

#### FRONT END  

- add field to `PlayerProps` in `graphql/entities.graphql`

it will be retrieved by the `PlayerEntity` query which retrieve player state & all related datas ( drugs, items, encounters)

it will be updated thx to `PlayerEntitySubscription` graphql subscription

- since we have a new field to query, we have to launch graphql codegen with `yarn gen` ( this will call torii )

`/generated/graphql.ts` & `/generated/introspections.ts` will be updated
you should see your new field in `type Player` & `PlayerPropsFragmentDoc` 

- in `dojo/queries/usePlayerEntity` add your field in `class PlayerEntity`, handle it in `constructor` & `update`

- use field in UI, for ex `components/Header.tsx`
we retrieve playerEntity using playerEntityStore from useDojocontext() : 

#### ENJOY

```rust
const { playerEntityStore} = useDojoContext();
const { playerEntity } = playerEntityStore;`

if (player.entity.swag_level === 420 ) {
    console.log("blaze it")
}
```





