import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, QueryFunctionContext } from 'react-query';
import { useFetchData } from '@/hooks/fetcher';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ContractAddress: any;
  Cursor: any;
  DateTime: any;
  Enum: any;
  bool: any;
  felt252: any;
  u8: any;
  u32: any;
  u64: any;
  u128: any;
  usize: any;
};

export type BlindedMarket = {
  __typename?: 'BlindedMarket';
  cash?: Maybe<Scalars['felt252']>;
  drug_id?: Maybe<Scalars['Enum']>;
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  location_id?: Maybe<Scalars['Enum']>;
  quantity?: Maybe<Scalars['felt252']>;
};

export type BlindedMarketConnection = {
  __typename?: 'BlindedMarketConnection';
  edges?: Maybe<Array<Maybe<BlindedMarketEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type BlindedMarketEdge = {
  __typename?: 'BlindedMarketEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<BlindedMarket>;
};

export type BlindedMarketOrder = {
  direction: OrderDirection;
  field: BlindedMarketOrderField;
};

export enum BlindedMarketOrderField {
  Cash = 'CASH',
  DrugId = 'DRUG_ID',
  GameId = 'GAME_ID',
  LocationId = 'LOCATION_ID',
  Quantity = 'QUANTITY'
}

export type BlindedMarketWhereInput = {
  cash?: InputMaybe<Scalars['felt252']>;
  cashEQ?: InputMaybe<Scalars['felt252']>;
  cashGT?: InputMaybe<Scalars['felt252']>;
  cashGTE?: InputMaybe<Scalars['felt252']>;
  cashLT?: InputMaybe<Scalars['felt252']>;
  cashLTE?: InputMaybe<Scalars['felt252']>;
  cashNEQ?: InputMaybe<Scalars['felt252']>;
  drug_id?: InputMaybe<Scalars['Enum']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  location_id?: InputMaybe<Scalars['Enum']>;
  quantity?: InputMaybe<Scalars['felt252']>;
  quantityEQ?: InputMaybe<Scalars['felt252']>;
  quantityGT?: InputMaybe<Scalars['felt252']>;
  quantityGTE?: InputMaybe<Scalars['felt252']>;
  quantityLT?: InputMaybe<Scalars['felt252']>;
  quantityLTE?: InputMaybe<Scalars['felt252']>;
  quantityNEQ?: InputMaybe<Scalars['felt252']>;
};

export type Drug = {
  __typename?: 'Drug';
  drug_id?: Maybe<Scalars['Enum']>;
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  quantity?: Maybe<Scalars['usize']>;
};

export type DrugConnection = {
  __typename?: 'DrugConnection';
  edges?: Maybe<Array<Maybe<DrugEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type DrugEdge = {
  __typename?: 'DrugEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Drug>;
};

export type DrugOrder = {
  direction: OrderDirection;
  field: DrugOrderField;
};

export enum DrugOrderField {
  DrugId = 'DRUG_ID',
  GameId = 'GAME_ID',
  PlayerId = 'PLAYER_ID',
  Quantity = 'QUANTITY'
}

export type DrugWhereInput = {
  drug_id?: InputMaybe<Scalars['Enum']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  quantity?: InputMaybe<Scalars['usize']>;
  quantityEQ?: InputMaybe<Scalars['usize']>;
  quantityGT?: InputMaybe<Scalars['usize']>;
  quantityGTE?: InputMaybe<Scalars['usize']>;
  quantityLT?: InputMaybe<Scalars['usize']>;
  quantityLTE?: InputMaybe<Scalars['usize']>;
  quantityNEQ?: InputMaybe<Scalars['usize']>;
};

export type Encounter = {
  __typename?: 'Encounter';
  demand_pct?: Maybe<Scalars['u8']>;
  encounter_id?: Maybe<Scalars['Enum']>;
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  health?: Maybe<Scalars['u8']>;
  level?: Maybe<Scalars['u8']>;
  payout?: Maybe<Scalars['u128']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
};

export type EncounterConnection = {
  __typename?: 'EncounterConnection';
  edges?: Maybe<Array<Maybe<EncounterEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type EncounterEdge = {
  __typename?: 'EncounterEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Encounter>;
};

export type EncounterOrder = {
  direction: OrderDirection;
  field: EncounterOrderField;
};

export enum EncounterOrderField {
  DemandPct = 'DEMAND_PCT',
  EncounterId = 'ENCOUNTER_ID',
  GameId = 'GAME_ID',
  Health = 'HEALTH',
  Level = 'LEVEL',
  Payout = 'PAYOUT',
  PlayerId = 'PLAYER_ID'
}

export type EncounterWhereInput = {
  demand_pct?: InputMaybe<Scalars['u8']>;
  demand_pctEQ?: InputMaybe<Scalars['u8']>;
  demand_pctGT?: InputMaybe<Scalars['u8']>;
  demand_pctGTE?: InputMaybe<Scalars['u8']>;
  demand_pctLT?: InputMaybe<Scalars['u8']>;
  demand_pctLTE?: InputMaybe<Scalars['u8']>;
  demand_pctNEQ?: InputMaybe<Scalars['u8']>;
  encounter_id?: InputMaybe<Scalars['Enum']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  health?: InputMaybe<Scalars['u8']>;
  healthEQ?: InputMaybe<Scalars['u8']>;
  healthGT?: InputMaybe<Scalars['u8']>;
  healthGTE?: InputMaybe<Scalars['u8']>;
  healthLT?: InputMaybe<Scalars['u8']>;
  healthLTE?: InputMaybe<Scalars['u8']>;
  healthNEQ?: InputMaybe<Scalars['u8']>;
  level?: InputMaybe<Scalars['u8']>;
  levelEQ?: InputMaybe<Scalars['u8']>;
  levelGT?: InputMaybe<Scalars['u8']>;
  levelGTE?: InputMaybe<Scalars['u8']>;
  levelLT?: InputMaybe<Scalars['u8']>;
  levelLTE?: InputMaybe<Scalars['u8']>;
  levelNEQ?: InputMaybe<Scalars['u8']>;
  payout?: InputMaybe<Scalars['u128']>;
  payoutEQ?: InputMaybe<Scalars['u128']>;
  payoutGT?: InputMaybe<Scalars['u128']>;
  payoutGTE?: InputMaybe<Scalars['u128']>;
  payoutLT?: InputMaybe<Scalars['u128']>;
  payoutLTE?: InputMaybe<Scalars['u128']>;
  payoutNEQ?: InputMaybe<Scalars['u128']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
};

export type Game = {
  __typename?: 'Game';
  creator?: Maybe<Scalars['ContractAddress']>;
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  game_mode?: Maybe<Scalars['Enum']>;
  max_players?: Maybe<Scalars['usize']>;
  max_turns?: Maybe<Scalars['usize']>;
  num_players?: Maybe<Scalars['usize']>;
  start_time?: Maybe<Scalars['u64']>;
};

export type GameConnection = {
  __typename?: 'GameConnection';
  edges?: Maybe<Array<Maybe<GameEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type GameEdge = {
  __typename?: 'GameEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Game>;
};

export type GameOrder = {
  direction: OrderDirection;
  field: GameOrderField;
};

export enum GameOrderField {
  Creator = 'CREATOR',
  GameId = 'GAME_ID',
  GameMode = 'GAME_MODE',
  MaxPlayers = 'MAX_PLAYERS',
  MaxTurns = 'MAX_TURNS',
  NumPlayers = 'NUM_PLAYERS',
  StartTime = 'START_TIME'
}

export type GameWhereInput = {
  creator?: InputMaybe<Scalars['ContractAddress']>;
  creatorEQ?: InputMaybe<Scalars['ContractAddress']>;
  creatorGT?: InputMaybe<Scalars['ContractAddress']>;
  creatorGTE?: InputMaybe<Scalars['ContractAddress']>;
  creatorLT?: InputMaybe<Scalars['ContractAddress']>;
  creatorLTE?: InputMaybe<Scalars['ContractAddress']>;
  creatorNEQ?: InputMaybe<Scalars['ContractAddress']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_mode?: InputMaybe<Scalars['Enum']>;
  max_players?: InputMaybe<Scalars['usize']>;
  max_playersEQ?: InputMaybe<Scalars['usize']>;
  max_playersGT?: InputMaybe<Scalars['usize']>;
  max_playersGTE?: InputMaybe<Scalars['usize']>;
  max_playersLT?: InputMaybe<Scalars['usize']>;
  max_playersLTE?: InputMaybe<Scalars['usize']>;
  max_playersNEQ?: InputMaybe<Scalars['usize']>;
  max_turns?: InputMaybe<Scalars['usize']>;
  max_turnsEQ?: InputMaybe<Scalars['usize']>;
  max_turnsGT?: InputMaybe<Scalars['usize']>;
  max_turnsGTE?: InputMaybe<Scalars['usize']>;
  max_turnsLT?: InputMaybe<Scalars['usize']>;
  max_turnsLTE?: InputMaybe<Scalars['usize']>;
  max_turnsNEQ?: InputMaybe<Scalars['usize']>;
  num_players?: InputMaybe<Scalars['usize']>;
  num_playersEQ?: InputMaybe<Scalars['usize']>;
  num_playersGT?: InputMaybe<Scalars['usize']>;
  num_playersGTE?: InputMaybe<Scalars['usize']>;
  num_playersLT?: InputMaybe<Scalars['usize']>;
  num_playersLTE?: InputMaybe<Scalars['usize']>;
  num_playersNEQ?: InputMaybe<Scalars['usize']>;
  start_time?: InputMaybe<Scalars['u64']>;
  start_timeEQ?: InputMaybe<Scalars['u64']>;
  start_timeGT?: InputMaybe<Scalars['u64']>;
  start_timeGTE?: InputMaybe<Scalars['u64']>;
  start_timeLT?: InputMaybe<Scalars['u64']>;
  start_timeLTE?: InputMaybe<Scalars['u64']>;
  start_timeNEQ?: InputMaybe<Scalars['u64']>;
};

export type Item = {
  __typename?: 'Item';
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  item_id?: Maybe<Scalars['Enum']>;
  level?: Maybe<Scalars['u8']>;
  name?: Maybe<Scalars['felt252']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  value?: Maybe<Scalars['usize']>;
};

export type ItemConnection = {
  __typename?: 'ItemConnection';
  edges?: Maybe<Array<Maybe<ItemEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type ItemEdge = {
  __typename?: 'ItemEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Item>;
};

export type ItemOrder = {
  direction: OrderDirection;
  field: ItemOrderField;
};

export enum ItemOrderField {
  GameId = 'GAME_ID',
  ItemId = 'ITEM_ID',
  Level = 'LEVEL',
  Name = 'NAME',
  PlayerId = 'PLAYER_ID',
  Value = 'VALUE'
}

export type ItemWhereInput = {
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  item_id?: InputMaybe<Scalars['Enum']>;
  level?: InputMaybe<Scalars['u8']>;
  levelEQ?: InputMaybe<Scalars['u8']>;
  levelGT?: InputMaybe<Scalars['u8']>;
  levelGTE?: InputMaybe<Scalars['u8']>;
  levelLT?: InputMaybe<Scalars['u8']>;
  levelLTE?: InputMaybe<Scalars['u8']>;
  levelNEQ?: InputMaybe<Scalars['u8']>;
  name?: InputMaybe<Scalars['felt252']>;
  nameEQ?: InputMaybe<Scalars['felt252']>;
  nameGT?: InputMaybe<Scalars['felt252']>;
  nameGTE?: InputMaybe<Scalars['felt252']>;
  nameLT?: InputMaybe<Scalars['felt252']>;
  nameLTE?: InputMaybe<Scalars['felt252']>;
  nameNEQ?: InputMaybe<Scalars['felt252']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  value?: InputMaybe<Scalars['usize']>;
  valueEQ?: InputMaybe<Scalars['usize']>;
  valueGT?: InputMaybe<Scalars['usize']>;
  valueGTE?: InputMaybe<Scalars['usize']>;
  valueLT?: InputMaybe<Scalars['usize']>;
  valueLTE?: InputMaybe<Scalars['usize']>;
  valueNEQ?: InputMaybe<Scalars['usize']>;
};

export type Leaderboard = {
  __typename?: 'Leaderboard';
  entity?: Maybe<World__Entity>;
  high_score?: Maybe<Scalars['u128']>;
  next_version_timestamp?: Maybe<Scalars['u64']>;
  version?: Maybe<Scalars['u32']>;
};

export type LeaderboardConnection = {
  __typename?: 'LeaderboardConnection';
  edges?: Maybe<Array<Maybe<LeaderboardEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type LeaderboardEdge = {
  __typename?: 'LeaderboardEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Leaderboard>;
};

export type LeaderboardOrder = {
  direction: OrderDirection;
  field: LeaderboardOrderField;
};

export enum LeaderboardOrderField {
  HighScore = 'HIGH_SCORE',
  NextVersionTimestamp = 'NEXT_VERSION_TIMESTAMP',
  Version = 'VERSION'
}

export type LeaderboardWhereInput = {
  high_score?: InputMaybe<Scalars['u128']>;
  high_scoreEQ?: InputMaybe<Scalars['u128']>;
  high_scoreGT?: InputMaybe<Scalars['u128']>;
  high_scoreGTE?: InputMaybe<Scalars['u128']>;
  high_scoreLT?: InputMaybe<Scalars['u128']>;
  high_scoreLTE?: InputMaybe<Scalars['u128']>;
  high_scoreNEQ?: InputMaybe<Scalars['u128']>;
  next_version_timestamp?: InputMaybe<Scalars['u64']>;
  next_version_timestampEQ?: InputMaybe<Scalars['u64']>;
  next_version_timestampGT?: InputMaybe<Scalars['u64']>;
  next_version_timestampGTE?: InputMaybe<Scalars['u64']>;
  next_version_timestampLT?: InputMaybe<Scalars['u64']>;
  next_version_timestampLTE?: InputMaybe<Scalars['u64']>;
  next_version_timestampNEQ?: InputMaybe<Scalars['u64']>;
  version?: InputMaybe<Scalars['u32']>;
  versionEQ?: InputMaybe<Scalars['u32']>;
  versionGT?: InputMaybe<Scalars['u32']>;
  versionGTE?: InputMaybe<Scalars['u32']>;
  versionLT?: InputMaybe<Scalars['u32']>;
  versionLTE?: InputMaybe<Scalars['u32']>;
  versionNEQ?: InputMaybe<Scalars['u32']>;
};

export type Market = {
  __typename?: 'Market';
  cash?: Maybe<Scalars['u128']>;
  drug_id?: Maybe<Scalars['Enum']>;
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  location_id?: Maybe<Scalars['Enum']>;
  quantity?: Maybe<Scalars['usize']>;
};

export type MarketConnection = {
  __typename?: 'MarketConnection';
  edges?: Maybe<Array<Maybe<MarketEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type MarketEdge = {
  __typename?: 'MarketEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Market>;
};

export type MarketOrder = {
  direction: OrderDirection;
  field: MarketOrderField;
};

export enum MarketOrderField {
  Cash = 'CASH',
  DrugId = 'DRUG_ID',
  GameId = 'GAME_ID',
  LocationId = 'LOCATION_ID',
  Quantity = 'QUANTITY'
}

export type MarketWhereInput = {
  cash?: InputMaybe<Scalars['u128']>;
  cashEQ?: InputMaybe<Scalars['u128']>;
  cashGT?: InputMaybe<Scalars['u128']>;
  cashGTE?: InputMaybe<Scalars['u128']>;
  cashLT?: InputMaybe<Scalars['u128']>;
  cashLTE?: InputMaybe<Scalars['u128']>;
  cashNEQ?: InputMaybe<Scalars['u128']>;
  drug_id?: InputMaybe<Scalars['Enum']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  location_id?: InputMaybe<Scalars['Enum']>;
  quantity?: InputMaybe<Scalars['usize']>;
  quantityEQ?: InputMaybe<Scalars['usize']>;
  quantityGT?: InputMaybe<Scalars['usize']>;
  quantityGTE?: InputMaybe<Scalars['usize']>;
  quantityLT?: InputMaybe<Scalars['usize']>;
  quantityLTE?: InputMaybe<Scalars['usize']>;
  quantityNEQ?: InputMaybe<Scalars['usize']>;
};

export type ModelUnion = BlindedMarket | Drug | Encounter | Game | Item | Leaderboard | Market | Player | RyoMeta;

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Player = {
  __typename?: 'Player';
  attack?: Maybe<Scalars['usize']>;
  avatar_id?: Maybe<Scalars['u8']>;
  cash?: Maybe<Scalars['u128']>;
  defense?: Maybe<Scalars['usize']>;
  drug_count?: Maybe<Scalars['usize']>;
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  game_over?: Maybe<Scalars['bool']>;
  health?: Maybe<Scalars['u8']>;
  hood_id?: Maybe<Scalars['Enum']>;
  leaderboard_version?: Maybe<Scalars['u32']>;
  location_id?: Maybe<Scalars['Enum']>;
  mainnet_address?: Maybe<Scalars['ContractAddress']>;
  max_items?: Maybe<Scalars['u8']>;
  max_turns?: Maybe<Scalars['usize']>;
  name?: Maybe<Scalars['felt252']>;
  next_location_id?: Maybe<Scalars['Enum']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  speed?: Maybe<Scalars['usize']>;
  status?: Maybe<Scalars['Enum']>;
  transport?: Maybe<Scalars['usize']>;
  turn?: Maybe<Scalars['usize']>;
  wanted?: Maybe<Scalars['u8']>;
};

export type PlayerConnection = {
  __typename?: 'PlayerConnection';
  edges?: Maybe<Array<Maybe<PlayerEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type PlayerEdge = {
  __typename?: 'PlayerEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Player>;
};

export type PlayerOrder = {
  direction: OrderDirection;
  field: PlayerOrderField;
};

export enum PlayerOrderField {
  Attack = 'ATTACK',
  AvatarId = 'AVATAR_ID',
  Cash = 'CASH',
  Defense = 'DEFENSE',
  DrugCount = 'DRUG_COUNT',
  GameId = 'GAME_ID',
  GameOver = 'GAME_OVER',
  Health = 'HEALTH',
  HoodId = 'HOOD_ID',
  LeaderboardVersion = 'LEADERBOARD_VERSION',
  LocationId = 'LOCATION_ID',
  MainnetAddress = 'MAINNET_ADDRESS',
  MaxItems = 'MAX_ITEMS',
  MaxTurns = 'MAX_TURNS',
  Name = 'NAME',
  NextLocationId = 'NEXT_LOCATION_ID',
  PlayerId = 'PLAYER_ID',
  Speed = 'SPEED',
  Status = 'STATUS',
  Transport = 'TRANSPORT',
  Turn = 'TURN',
  Wanted = 'WANTED'
}

export type PlayerWhereInput = {
  attack?: InputMaybe<Scalars['usize']>;
  attackEQ?: InputMaybe<Scalars['usize']>;
  attackGT?: InputMaybe<Scalars['usize']>;
  attackGTE?: InputMaybe<Scalars['usize']>;
  attackLT?: InputMaybe<Scalars['usize']>;
  attackLTE?: InputMaybe<Scalars['usize']>;
  attackNEQ?: InputMaybe<Scalars['usize']>;
  avatar_id?: InputMaybe<Scalars['u8']>;
  avatar_idEQ?: InputMaybe<Scalars['u8']>;
  avatar_idGT?: InputMaybe<Scalars['u8']>;
  avatar_idGTE?: InputMaybe<Scalars['u8']>;
  avatar_idLT?: InputMaybe<Scalars['u8']>;
  avatar_idLTE?: InputMaybe<Scalars['u8']>;
  avatar_idNEQ?: InputMaybe<Scalars['u8']>;
  cash?: InputMaybe<Scalars['u128']>;
  cashEQ?: InputMaybe<Scalars['u128']>;
  cashGT?: InputMaybe<Scalars['u128']>;
  cashGTE?: InputMaybe<Scalars['u128']>;
  cashLT?: InputMaybe<Scalars['u128']>;
  cashLTE?: InputMaybe<Scalars['u128']>;
  cashNEQ?: InputMaybe<Scalars['u128']>;
  defense?: InputMaybe<Scalars['usize']>;
  defenseEQ?: InputMaybe<Scalars['usize']>;
  defenseGT?: InputMaybe<Scalars['usize']>;
  defenseGTE?: InputMaybe<Scalars['usize']>;
  defenseLT?: InputMaybe<Scalars['usize']>;
  defenseLTE?: InputMaybe<Scalars['usize']>;
  defenseNEQ?: InputMaybe<Scalars['usize']>;
  drug_count?: InputMaybe<Scalars['usize']>;
  drug_countEQ?: InputMaybe<Scalars['usize']>;
  drug_countGT?: InputMaybe<Scalars['usize']>;
  drug_countGTE?: InputMaybe<Scalars['usize']>;
  drug_countLT?: InputMaybe<Scalars['usize']>;
  drug_countLTE?: InputMaybe<Scalars['usize']>;
  drug_countNEQ?: InputMaybe<Scalars['usize']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_over?: InputMaybe<Scalars['bool']>;
  health?: InputMaybe<Scalars['u8']>;
  healthEQ?: InputMaybe<Scalars['u8']>;
  healthGT?: InputMaybe<Scalars['u8']>;
  healthGTE?: InputMaybe<Scalars['u8']>;
  healthLT?: InputMaybe<Scalars['u8']>;
  healthLTE?: InputMaybe<Scalars['u8']>;
  healthNEQ?: InputMaybe<Scalars['u8']>;
  hood_id?: InputMaybe<Scalars['Enum']>;
  leaderboard_version?: InputMaybe<Scalars['u32']>;
  leaderboard_versionEQ?: InputMaybe<Scalars['u32']>;
  leaderboard_versionGT?: InputMaybe<Scalars['u32']>;
  leaderboard_versionGTE?: InputMaybe<Scalars['u32']>;
  leaderboard_versionLT?: InputMaybe<Scalars['u32']>;
  leaderboard_versionLTE?: InputMaybe<Scalars['u32']>;
  leaderboard_versionNEQ?: InputMaybe<Scalars['u32']>;
  location_id?: InputMaybe<Scalars['Enum']>;
  mainnet_address?: InputMaybe<Scalars['ContractAddress']>;
  mainnet_addressEQ?: InputMaybe<Scalars['ContractAddress']>;
  mainnet_addressGT?: InputMaybe<Scalars['ContractAddress']>;
  mainnet_addressGTE?: InputMaybe<Scalars['ContractAddress']>;
  mainnet_addressLT?: InputMaybe<Scalars['ContractAddress']>;
  mainnet_addressLTE?: InputMaybe<Scalars['ContractAddress']>;
  mainnet_addressNEQ?: InputMaybe<Scalars['ContractAddress']>;
  max_items?: InputMaybe<Scalars['u8']>;
  max_itemsEQ?: InputMaybe<Scalars['u8']>;
  max_itemsGT?: InputMaybe<Scalars['u8']>;
  max_itemsGTE?: InputMaybe<Scalars['u8']>;
  max_itemsLT?: InputMaybe<Scalars['u8']>;
  max_itemsLTE?: InputMaybe<Scalars['u8']>;
  max_itemsNEQ?: InputMaybe<Scalars['u8']>;
  max_turns?: InputMaybe<Scalars['usize']>;
  max_turnsEQ?: InputMaybe<Scalars['usize']>;
  max_turnsGT?: InputMaybe<Scalars['usize']>;
  max_turnsGTE?: InputMaybe<Scalars['usize']>;
  max_turnsLT?: InputMaybe<Scalars['usize']>;
  max_turnsLTE?: InputMaybe<Scalars['usize']>;
  max_turnsNEQ?: InputMaybe<Scalars['usize']>;
  name?: InputMaybe<Scalars['felt252']>;
  nameEQ?: InputMaybe<Scalars['felt252']>;
  nameGT?: InputMaybe<Scalars['felt252']>;
  nameGTE?: InputMaybe<Scalars['felt252']>;
  nameLT?: InputMaybe<Scalars['felt252']>;
  nameLTE?: InputMaybe<Scalars['felt252']>;
  nameNEQ?: InputMaybe<Scalars['felt252']>;
  next_location_id?: InputMaybe<Scalars['Enum']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  speed?: InputMaybe<Scalars['usize']>;
  speedEQ?: InputMaybe<Scalars['usize']>;
  speedGT?: InputMaybe<Scalars['usize']>;
  speedGTE?: InputMaybe<Scalars['usize']>;
  speedLT?: InputMaybe<Scalars['usize']>;
  speedLTE?: InputMaybe<Scalars['usize']>;
  speedNEQ?: InputMaybe<Scalars['usize']>;
  status?: InputMaybe<Scalars['Enum']>;
  transport?: InputMaybe<Scalars['usize']>;
  transportEQ?: InputMaybe<Scalars['usize']>;
  transportGT?: InputMaybe<Scalars['usize']>;
  transportGTE?: InputMaybe<Scalars['usize']>;
  transportLT?: InputMaybe<Scalars['usize']>;
  transportLTE?: InputMaybe<Scalars['usize']>;
  transportNEQ?: InputMaybe<Scalars['usize']>;
  turn?: InputMaybe<Scalars['usize']>;
  turnEQ?: InputMaybe<Scalars['usize']>;
  turnGT?: InputMaybe<Scalars['usize']>;
  turnGTE?: InputMaybe<Scalars['usize']>;
  turnLT?: InputMaybe<Scalars['usize']>;
  turnLTE?: InputMaybe<Scalars['usize']>;
  turnNEQ?: InputMaybe<Scalars['usize']>;
  wanted?: InputMaybe<Scalars['u8']>;
  wantedEQ?: InputMaybe<Scalars['u8']>;
  wantedGT?: InputMaybe<Scalars['u8']>;
  wantedGTE?: InputMaybe<Scalars['u8']>;
  wantedLT?: InputMaybe<Scalars['u8']>;
  wantedLTE?: InputMaybe<Scalars['u8']>;
  wantedNEQ?: InputMaybe<Scalars['u8']>;
};

export type RyoMeta = {
  __typename?: 'RyoMeta';
  entity?: Maybe<World__Entity>;
  id?: Maybe<Scalars['u32']>;
  initialized?: Maybe<Scalars['bool']>;
  leaderboard_version?: Maybe<Scalars['u32']>;
};

export type RyoMetaConnection = {
  __typename?: 'RyoMetaConnection';
  edges?: Maybe<Array<Maybe<RyoMetaEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type RyoMetaEdge = {
  __typename?: 'RyoMetaEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<RyoMeta>;
};

export type RyoMetaOrder = {
  direction: OrderDirection;
  field: RyoMetaOrderField;
};

export enum RyoMetaOrderField {
  Id = 'ID',
  Initialized = 'INITIALIZED',
  LeaderboardVersion = 'LEADERBOARD_VERSION'
}

export type RyoMetaWhereInput = {
  id?: InputMaybe<Scalars['u32']>;
  idEQ?: InputMaybe<Scalars['u32']>;
  idGT?: InputMaybe<Scalars['u32']>;
  idGTE?: InputMaybe<Scalars['u32']>;
  idLT?: InputMaybe<Scalars['u32']>;
  idLTE?: InputMaybe<Scalars['u32']>;
  idNEQ?: InputMaybe<Scalars['u32']>;
  initialized?: InputMaybe<Scalars['bool']>;
  leaderboard_version?: InputMaybe<Scalars['u32']>;
  leaderboard_versionEQ?: InputMaybe<Scalars['u32']>;
  leaderboard_versionGT?: InputMaybe<Scalars['u32']>;
  leaderboard_versionGTE?: InputMaybe<Scalars['u32']>;
  leaderboard_versionLT?: InputMaybe<Scalars['u32']>;
  leaderboard_versionLTE?: InputMaybe<Scalars['u32']>;
  leaderboard_versionNEQ?: InputMaybe<Scalars['u32']>;
};

export type World__Content = {
  __typename?: 'World__Content';
  coverUri?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  iconUri?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  socials?: Maybe<Array<Maybe<World__Social>>>;
  website?: Maybe<Scalars['String']>;
};

export type World__Entity = {
  __typename?: 'World__Entity';
  createdAt?: Maybe<Scalars['DateTime']>;
  eventId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  keys?: Maybe<Array<Maybe<Scalars['String']>>>;
  models?: Maybe<Array<Maybe<ModelUnion>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type World__EntityConnection = {
  __typename?: 'World__EntityConnection';
  edges?: Maybe<Array<Maybe<World__EntityEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__EntityEdge = {
  __typename?: 'World__EntityEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__Entity>;
};

export type World__Event = {
  __typename?: 'World__Event';
  createdAt?: Maybe<Scalars['DateTime']>;
  data?: Maybe<Array<Maybe<Scalars['String']>>>;
  id?: Maybe<Scalars['ID']>;
  keys?: Maybe<Array<Maybe<Scalars['String']>>>;
  transactionHash?: Maybe<Scalars['String']>;
};

export type World__EventConnection = {
  __typename?: 'World__EventConnection';
  edges?: Maybe<Array<Maybe<World__EventEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__EventEdge = {
  __typename?: 'World__EventEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__Event>;
};

export type World__Metadata = {
  __typename?: 'World__Metadata';
  content?: Maybe<World__Content>;
  coverImg?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  iconImg?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  uri?: Maybe<Scalars['String']>;
  worldAddress: Scalars['String'];
};

export type World__MetadataConnection = {
  __typename?: 'World__MetadataConnection';
  edges?: Maybe<Array<Maybe<World__MetadataEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__MetadataEdge = {
  __typename?: 'World__MetadataEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__Metadata>;
};

export type World__Model = {
  __typename?: 'World__Model';
  classHash?: Maybe<Scalars['felt252']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['felt252']>;
};

export type World__ModelConnection = {
  __typename?: 'World__ModelConnection';
  edges?: Maybe<Array<Maybe<World__ModelEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__ModelEdge = {
  __typename?: 'World__ModelEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__Model>;
};

export type World__ModelOrder = {
  direction: OrderDirection;
  field: World__ModelOrderField;
};

export enum World__ModelOrderField {
  ClassHash = 'CLASS_HASH',
  Name = 'NAME'
}

export type World__PageInfo = {
  __typename?: 'World__PageInfo';
  endCursor?: Maybe<Scalars['Cursor']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']>;
  startCursor?: Maybe<Scalars['Cursor']>;
};

export type World__Query = {
  __typename?: 'World__Query';
  blindedMarketModels?: Maybe<BlindedMarketConnection>;
  drugModels?: Maybe<DrugConnection>;
  encounterModels?: Maybe<EncounterConnection>;
  entities?: Maybe<World__EntityConnection>;
  entity: World__Entity;
  events?: Maybe<World__EventConnection>;
  gameModels?: Maybe<GameConnection>;
  itemModels?: Maybe<ItemConnection>;
  leaderboardModels?: Maybe<LeaderboardConnection>;
  marketModels?: Maybe<MarketConnection>;
  metadatas?: Maybe<World__MetadataConnection>;
  model: World__Model;
  models?: Maybe<World__ModelConnection>;
  playerModels?: Maybe<PlayerConnection>;
  ryoMetaModels?: Maybe<RyoMetaConnection>;
  transaction: World__Transaction;
  transactions?: Maybe<World__TransactionConnection>;
};


export type World__QueryBlindedMarketModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<BlindedMarketOrder>;
  where?: InputMaybe<BlindedMarketWhereInput>;
};


export type World__QueryDrugModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<DrugOrder>;
  where?: InputMaybe<DrugWhereInput>;
};


export type World__QueryEncounterModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<EncounterOrder>;
  where?: InputMaybe<EncounterWhereInput>;
};


export type World__QueryEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type World__QueryEntityArgs = {
  id: Scalars['ID'];
};


export type World__QueryEventsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type World__QueryGameModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<GameOrder>;
  where?: InputMaybe<GameWhereInput>;
};


export type World__QueryItemModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ItemOrder>;
  where?: InputMaybe<ItemWhereInput>;
};


export type World__QueryLeaderboardModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<LeaderboardOrder>;
  where?: InputMaybe<LeaderboardWhereInput>;
};


export type World__QueryMarketModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<MarketOrder>;
  where?: InputMaybe<MarketWhereInput>;
};


export type World__QueryMetadatasArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type World__QueryModelArgs = {
  id: Scalars['ID'];
};


export type World__QueryModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<World__ModelOrder>;
};


export type World__QueryPlayerModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<PlayerOrder>;
  where?: InputMaybe<PlayerWhereInput>;
};


export type World__QueryRyoMetaModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<RyoMetaOrder>;
  where?: InputMaybe<RyoMetaWhereInput>;
};


export type World__QueryTransactionArgs = {
  transactionHash: Scalars['ID'];
};


export type World__QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type World__Social = {
  __typename?: 'World__Social';
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type World__Subscription = {
  __typename?: 'World__Subscription';
  entityUpdated: World__Entity;
  eventEmitted: World__Event;
  modelRegistered: World__Model;
};


export type World__SubscriptionEntityUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type World__SubscriptionEventEmittedArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type World__SubscriptionModelRegisteredArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type World__Transaction = {
  __typename?: 'World__Transaction';
  calldata?: Maybe<Array<Maybe<Scalars['felt252']>>>;
  createdAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  maxFee?: Maybe<Scalars['felt252']>;
  nonce?: Maybe<Scalars['felt252']>;
  senderAddress?: Maybe<Scalars['felt252']>;
  signature?: Maybe<Array<Maybe<Scalars['felt252']>>>;
  transactionHash?: Maybe<Scalars['felt252']>;
};

export type World__TransactionConnection = {
  __typename?: 'World__TransactionConnection';
  edges?: Maybe<Array<Maybe<World__TransactionEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__TransactionEdge = {
  __typename?: 'World__TransactionEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__Transaction>;
};

export type GlobalScoresQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u32']>;
  limit?: InputMaybe<Scalars['Int']>;
  cursor?: InputMaybe<Scalars['Cursor']>;
}>;


export type GlobalScoresQuery = { __typename?: 'World__Query', playerModels?: { __typename?: 'PlayerConnection', totalCount: number, edges?: Array<{ __typename?: 'PlayerEdge', cursor?: any | null, node?: { __typename?: 'Player', game_id?: any | null, player_id?: any | null, name?: any | null, avatar_id?: any | null, cash?: any | null, health?: any | null, turn?: any | null, game_over?: any | null } | null } | null> | null } | null };

export type MarketPricesQueryVariables = Exact<{
  gameId?: InputMaybe<Scalars['u32']>;
}>;


export type MarketPricesQuery = { __typename?: 'World__Query', marketModels?: { __typename?: 'MarketConnection', edges?: Array<{ __typename?: 'MarketEdge', node?: { __typename?: 'Market', drug_id?: any | null, location_id?: any | null, quantity?: any | null, cash?: any | null } | null } | null> | null } | null };

export type BlindedMarketPricesQueryVariables = Exact<{
  gameId?: InputMaybe<Scalars['u32']>;
}>;


export type BlindedMarketPricesQuery = { __typename?: 'World__Query', blindedMarketModels?: { __typename?: 'BlindedMarketConnection', edges?: Array<{ __typename?: 'BlindedMarketEdge', node?: { __typename?: 'BlindedMarket', drug_id?: any | null, location_id?: any | null, quantity?: any | null, cash?: any | null } | null } | null> | null } | null };

export type RyoMetasQueryVariables = Exact<{ [key: string]: never; }>;


export type RyoMetasQuery = { __typename?: 'World__Query', ryoMetaModels?: { __typename?: 'RyoMetaConnection', edges?: Array<{ __typename?: 'RyoMetaEdge', node?: { __typename?: 'RyoMeta', id?: any | null, initialized?: any | null, leaderboard_version?: any | null } | null } | null> | null } | null };

export type LeaderboardMetasQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u32']>;
}>;


export type LeaderboardMetasQuery = { __typename?: 'World__Query', leaderboardModels?: { __typename?: 'LeaderboardConnection', edges?: Array<{ __typename?: 'LeaderboardEdge', node?: { __typename?: 'Leaderboard', version?: any | null, high_score?: any | null, next_version_timestamp?: any | null } | null } | null> | null } | null };

export type PlayerPropsFragment = { __typename?: 'Player', name?: any | null, avatar_id?: any | null, mainnet_address?: any | null, cash?: any | null, status?: any | null, hood_id?: any | null, location_id?: any | null, drug_count?: any | null, health?: any | null, turn?: any | null, max_turns?: any | null, max_items?: any | null, attack?: any | null, defense?: any | null, transport?: any | null, speed?: any | null, wanted?: any | null, game_over?: any | null };

export type PlayerEntityQueryVariables = Exact<{
  gameId: Scalars['String'];
  playerId: Scalars['String'];
}>;


export type PlayerEntityQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', id?: string | null, models?: Array<{ __typename: 'BlindedMarket' } | { __typename: 'Drug', drug_id?: any | null, quantity?: any | null } | { __typename: 'Encounter', encounter_id?: any | null, level?: any | null, health?: any | null, payout?: any | null } | { __typename: 'Game' } | { __typename: 'Item', item_id?: any | null, level?: any | null, name?: any | null, value?: any | null } | { __typename: 'Leaderboard' } | { __typename: 'Market' } | { __typename: 'Player', name?: any | null, avatar_id?: any | null, mainnet_address?: any | null, cash?: any | null, status?: any | null, hood_id?: any | null, location_id?: any | null, drug_count?: any | null, health?: any | null, turn?: any | null, max_turns?: any | null, max_items?: any | null, attack?: any | null, defense?: any | null, transport?: any | null, speed?: any | null, wanted?: any | null, game_over?: any | null } | { __typename: 'RyoMeta' } | null> | null } | null } | null> | null } | null };

export type PlayerEntitySubscriptionSubscriptionVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type PlayerEntitySubscriptionSubscription = { __typename?: 'World__Subscription', entityUpdated: { __typename?: 'World__Entity', id?: string | null, keys?: Array<string | null> | null, models?: Array<{ __typename: 'BlindedMarket' } | { __typename: 'Drug' } | { __typename: 'Encounter' } | { __typename: 'Game' } | { __typename: 'Item' } | { __typename: 'Leaderboard' } | { __typename: 'Market' } | { __typename: 'Player', name?: any | null, avatar_id?: any | null, mainnet_address?: any | null, cash?: any | null, status?: any | null, hood_id?: any | null, location_id?: any | null, drug_count?: any | null, health?: any | null, turn?: any | null, max_turns?: any | null, max_items?: any | null, attack?: any | null, defense?: any | null, transport?: any | null, speed?: any | null, wanted?: any | null, game_over?: any | null } | { __typename: 'RyoMeta' } | null> | null } };

export type PlayerEntityRelatedDataSubscriptionSubscriptionVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type PlayerEntityRelatedDataSubscriptionSubscription = { __typename?: 'World__Subscription', entityUpdated: { __typename?: 'World__Entity', id?: string | null, keys?: Array<string | null> | null, models?: Array<{ __typename: 'BlindedMarket' } | { __typename: 'Drug', drug_id?: any | null, quantity?: any | null } | { __typename: 'Encounter', encounter_id?: any | null, level?: any | null, health?: any | null, payout?: any | null } | { __typename: 'Game' } | { __typename: 'Item', item_id?: any | null, level?: any | null, name?: any | null, value?: any | null } | { __typename: 'Leaderboard' } | { __typename: 'Market' } | { __typename: 'Player' } | { __typename: 'RyoMeta' } | null> | null } };

export type LocationEntitiesQueryVariables = Exact<{
  gameId: Scalars['String'];
  locationId: Scalars['String'];
}>;


export type LocationEntitiesQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EntityEdge', cursor?: any | null, node?: { __typename?: 'World__Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'BlindedMarket' } | { __typename: 'Drug' } | { __typename: 'Encounter' } | { __typename: 'Game' } | { __typename: 'Item' } | { __typename: 'Leaderboard' } | { __typename: 'Market', cash?: any | null, quantity?: any | null, location_id?: any | null, drug_id?: any | null } | { __typename: 'Player' } | { __typename: 'RyoMeta' } | null> | null } | null } | null> | null } | null };

export type PlayerLogsQueryVariables = Exact<{
  game_id: Scalars['String'];
  player_id: Scalars['String'];
}>;


export type PlayerLogsQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null, createdAt?: any | null } | null } | null> | null } | null };

export const PlayerPropsFragmentDoc = `
    fragment PlayerProps on Player {
  name
  avatar_id
  mainnet_address
  cash
  status
  hood_id
  location_id
  drug_count
  health
  turn
  max_turns
  max_items
  attack
  defense
  transport
  speed
  wanted
  game_over
}
    `;
export const GlobalScoresDocument = `
    query GlobalScores($version: u32, $limit: Int, $cursor: Cursor) {
  playerModels(
    where: {game_over: true, leaderboard_version: $version}
    order: {direction: DESC, field: CASH}
    first: $limit
    after: $cursor
  ) {
    totalCount
    edges {
      node {
        game_id
        player_id
        name
        avatar_id
        cash
        health
        turn
        game_over
      }
      cursor
    }
  }
}
    `;
export const useGlobalScoresQuery = <
      TData = GlobalScoresQuery,
      TError = unknown
    >(
      variables?: GlobalScoresQueryVariables,
      options?: UseQueryOptions<GlobalScoresQuery, TError, TData>
    ) =>
    useQuery<GlobalScoresQuery, TError, TData>(
      variables === undefined ? ['GlobalScores'] : ['GlobalScores', variables],
      useFetchData<GlobalScoresQuery, GlobalScoresQueryVariables>(GlobalScoresDocument).bind(null, variables),
      options
    );

useGlobalScoresQuery.getKey = (variables?: GlobalScoresQueryVariables) => variables === undefined ? ['GlobalScores'] : ['GlobalScores', variables];
;

export const useInfiniteGlobalScoresQuery = <
      TData = GlobalScoresQuery,
      TError = unknown
    >(
      variables?: GlobalScoresQueryVariables,
      options?: UseInfiniteQueryOptions<GlobalScoresQuery, TError, TData>
    ) =>{
    const query = useFetchData<GlobalScoresQuery, GlobalScoresQueryVariables>(GlobalScoresDocument)
    return useInfiniteQuery<GlobalScoresQuery, TError, TData>(
      variables === undefined ? ['GlobalScores.infinite'] : ['GlobalScores.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGlobalScoresQuery.getKey = (variables?: GlobalScoresQueryVariables) => variables === undefined ? ['GlobalScores.infinite'] : ['GlobalScores.infinite', variables];
;

export const MarketPricesDocument = `
    query MarketPrices($gameId: u32) {
  marketModels(first: 36, where: {game_id: $gameId}) {
    edges {
      node {
        drug_id
        location_id
        quantity
        cash
      }
    }
  }
}
    `;
export const useMarketPricesQuery = <
      TData = MarketPricesQuery,
      TError = unknown
    >(
      variables?: MarketPricesQueryVariables,
      options?: UseQueryOptions<MarketPricesQuery, TError, TData>
    ) =>
    useQuery<MarketPricesQuery, TError, TData>(
      variables === undefined ? ['MarketPrices'] : ['MarketPrices', variables],
      useFetchData<MarketPricesQuery, MarketPricesQueryVariables>(MarketPricesDocument).bind(null, variables),
      options
    );

useMarketPricesQuery.getKey = (variables?: MarketPricesQueryVariables) => variables === undefined ? ['MarketPrices'] : ['MarketPrices', variables];
;

export const useInfiniteMarketPricesQuery = <
      TData = MarketPricesQuery,
      TError = unknown
    >(
      variables?: MarketPricesQueryVariables,
      options?: UseInfiniteQueryOptions<MarketPricesQuery, TError, TData>
    ) =>{
    const query = useFetchData<MarketPricesQuery, MarketPricesQueryVariables>(MarketPricesDocument)
    return useInfiniteQuery<MarketPricesQuery, TError, TData>(
      variables === undefined ? ['MarketPrices.infinite'] : ['MarketPrices.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteMarketPricesQuery.getKey = (variables?: MarketPricesQueryVariables) => variables === undefined ? ['MarketPrices.infinite'] : ['MarketPrices.infinite', variables];
;

export const BlindedMarketPricesDocument = `
    query BlindedMarketPrices($gameId: u32) {
  blindedMarketModels(first: 36, where: {game_id: $gameId}) {
    edges {
      node {
        drug_id
        location_id
        quantity
        cash
      }
    }
  }
}
    `;
export const useBlindedMarketPricesQuery = <
      TData = BlindedMarketPricesQuery,
      TError = unknown
    >(
      variables?: BlindedMarketPricesQueryVariables,
      options?: UseQueryOptions<BlindedMarketPricesQuery, TError, TData>
    ) =>
    useQuery<BlindedMarketPricesQuery, TError, TData>(
      variables === undefined ? ['BlindedMarketPrices'] : ['BlindedMarketPrices', variables],
      useFetchData<BlindedMarketPricesQuery, BlindedMarketPricesQueryVariables>(BlindedMarketPricesDocument).bind(null, variables),
      options
    );

useBlindedMarketPricesQuery.getKey = (variables?: BlindedMarketPricesQueryVariables) => variables === undefined ? ['BlindedMarketPrices'] : ['BlindedMarketPrices', variables];
;

export const useInfiniteBlindedMarketPricesQuery = <
      TData = BlindedMarketPricesQuery,
      TError = unknown
    >(
      variables?: BlindedMarketPricesQueryVariables,
      options?: UseInfiniteQueryOptions<BlindedMarketPricesQuery, TError, TData>
    ) =>{
    const query = useFetchData<BlindedMarketPricesQuery, BlindedMarketPricesQueryVariables>(BlindedMarketPricesDocument)
    return useInfiniteQuery<BlindedMarketPricesQuery, TError, TData>(
      variables === undefined ? ['BlindedMarketPrices.infinite'] : ['BlindedMarketPrices.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteBlindedMarketPricesQuery.getKey = (variables?: BlindedMarketPricesQueryVariables) => variables === undefined ? ['BlindedMarketPrices.infinite'] : ['BlindedMarketPrices.infinite', variables];
;

export const RyoMetasDocument = `
    query RyoMetas {
  ryoMetaModels(limit: 1) {
    edges {
      node {
        id
        initialized
        leaderboard_version
      }
    }
  }
}
    `;
export const useRyoMetasQuery = <
      TData = RyoMetasQuery,
      TError = unknown
    >(
      variables?: RyoMetasQueryVariables,
      options?: UseQueryOptions<RyoMetasQuery, TError, TData>
    ) =>
    useQuery<RyoMetasQuery, TError, TData>(
      variables === undefined ? ['RyoMetas'] : ['RyoMetas', variables],
      useFetchData<RyoMetasQuery, RyoMetasQueryVariables>(RyoMetasDocument).bind(null, variables),
      options
    );

useRyoMetasQuery.getKey = (variables?: RyoMetasQueryVariables) => variables === undefined ? ['RyoMetas'] : ['RyoMetas', variables];
;

export const useInfiniteRyoMetasQuery = <
      TData = RyoMetasQuery,
      TError = unknown
    >(
      variables?: RyoMetasQueryVariables,
      options?: UseInfiniteQueryOptions<RyoMetasQuery, TError, TData>
    ) =>{
    const query = useFetchData<RyoMetasQuery, RyoMetasQueryVariables>(RyoMetasDocument)
    return useInfiniteQuery<RyoMetasQuery, TError, TData>(
      variables === undefined ? ['RyoMetas.infinite'] : ['RyoMetas.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteRyoMetasQuery.getKey = (variables?: RyoMetasQueryVariables) => variables === undefined ? ['RyoMetas.infinite'] : ['RyoMetas.infinite', variables];
;

export const LeaderboardMetasDocument = `
    query LeaderboardMetas($version: u32) {
  leaderboardModels(where: {version: $version}) {
    edges {
      node {
        version
        high_score
        next_version_timestamp
      }
    }
  }
}
    `;
export const useLeaderboardMetasQuery = <
      TData = LeaderboardMetasQuery,
      TError = unknown
    >(
      variables?: LeaderboardMetasQueryVariables,
      options?: UseQueryOptions<LeaderboardMetasQuery, TError, TData>
    ) =>
    useQuery<LeaderboardMetasQuery, TError, TData>(
      variables === undefined ? ['LeaderboardMetas'] : ['LeaderboardMetas', variables],
      useFetchData<LeaderboardMetasQuery, LeaderboardMetasQueryVariables>(LeaderboardMetasDocument).bind(null, variables),
      options
    );

useLeaderboardMetasQuery.getKey = (variables?: LeaderboardMetasQueryVariables) => variables === undefined ? ['LeaderboardMetas'] : ['LeaderboardMetas', variables];
;

export const useInfiniteLeaderboardMetasQuery = <
      TData = LeaderboardMetasQuery,
      TError = unknown
    >(
      variables?: LeaderboardMetasQueryVariables,
      options?: UseInfiniteQueryOptions<LeaderboardMetasQuery, TError, TData>
    ) =>{
    const query = useFetchData<LeaderboardMetasQuery, LeaderboardMetasQueryVariables>(LeaderboardMetasDocument)
    return useInfiniteQuery<LeaderboardMetasQuery, TError, TData>(
      variables === undefined ? ['LeaderboardMetas.infinite'] : ['LeaderboardMetas.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteLeaderboardMetasQuery.getKey = (variables?: LeaderboardMetasQueryVariables) => variables === undefined ? ['LeaderboardMetas.infinite'] : ['LeaderboardMetas.infinite', variables];
;

export const PlayerEntityDocument = `
    query PlayerEntity($gameId: String!, $playerId: String!) {
  entities(keys: [$gameId, $playerId]) {
    totalCount
    edges {
      node {
        id
        models {
          __typename
          ... on Player {
            ...PlayerProps
          }
          ... on Drug {
            drug_id
            quantity
          }
          ... on Item {
            item_id
            level
            name
            value
          }
          ... on Encounter {
            encounter_id
            level
            health
            payout
          }
        }
      }
    }
  }
}
    ${PlayerPropsFragmentDoc}`;
export const usePlayerEntityQuery = <
      TData = PlayerEntityQuery,
      TError = unknown
    >(
      variables: PlayerEntityQueryVariables,
      options?: UseQueryOptions<PlayerEntityQuery, TError, TData>
    ) =>
    useQuery<PlayerEntityQuery, TError, TData>(
      ['PlayerEntity', variables],
      useFetchData<PlayerEntityQuery, PlayerEntityQueryVariables>(PlayerEntityDocument).bind(null, variables),
      options
    );

usePlayerEntityQuery.getKey = (variables: PlayerEntityQueryVariables) => ['PlayerEntity', variables];
;

export const useInfinitePlayerEntityQuery = <
      TData = PlayerEntityQuery,
      TError = unknown
    >(
      variables: PlayerEntityQueryVariables,
      options?: UseInfiniteQueryOptions<PlayerEntityQuery, TError, TData>
    ) =>{
    const query = useFetchData<PlayerEntityQuery, PlayerEntityQueryVariables>(PlayerEntityDocument)
    return useInfiniteQuery<PlayerEntityQuery, TError, TData>(
      ['PlayerEntity.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfinitePlayerEntityQuery.getKey = (variables: PlayerEntityQueryVariables) => ['PlayerEntity.infinite', variables];
;

export const PlayerEntitySubscriptionDocument = `
    subscription PlayerEntitySubscription($id: ID) {
  entityUpdated(id: $id) {
    id
    keys
    models {
      __typename
      ... on Player {
        ...PlayerProps
      }
    }
  }
}
    ${PlayerPropsFragmentDoc}`;
export const PlayerEntityRelatedDataSubscriptionDocument = `
    subscription PlayerEntityRelatedDataSubscription($id: ID) {
  entityUpdated(id: $id) {
    id
    keys
    models {
      __typename
      ... on Drug {
        drug_id
        quantity
      }
      ... on Item {
        item_id
        level
        name
        value
      }
      ... on Encounter {
        encounter_id
        level
        health
        payout
      }
    }
  }
}
    `;
export const LocationEntitiesDocument = `
    query LocationEntities($gameId: String!, $locationId: String!) {
  entities(keys: [$gameId, $locationId]) {
    totalCount
    edges {
      node {
        keys
        models {
          __typename
          ... on Market {
            cash
            quantity
            location_id
            drug_id
          }
        }
      }
      cursor
    }
  }
}
    `;
export const useLocationEntitiesQuery = <
      TData = LocationEntitiesQuery,
      TError = unknown
    >(
      variables: LocationEntitiesQueryVariables,
      options?: UseQueryOptions<LocationEntitiesQuery, TError, TData>
    ) =>
    useQuery<LocationEntitiesQuery, TError, TData>(
      ['LocationEntities', variables],
      useFetchData<LocationEntitiesQuery, LocationEntitiesQueryVariables>(LocationEntitiesDocument).bind(null, variables),
      options
    );

useLocationEntitiesQuery.getKey = (variables: LocationEntitiesQueryVariables) => ['LocationEntities', variables];
;

export const useInfiniteLocationEntitiesQuery = <
      TData = LocationEntitiesQuery,
      TError = unknown
    >(
      variables: LocationEntitiesQueryVariables,
      options?: UseInfiniteQueryOptions<LocationEntitiesQuery, TError, TData>
    ) =>{
    const query = useFetchData<LocationEntitiesQuery, LocationEntitiesQueryVariables>(LocationEntitiesDocument)
    return useInfiniteQuery<LocationEntitiesQuery, TError, TData>(
      ['LocationEntities.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteLocationEntitiesQuery.getKey = (variables: LocationEntitiesQueryVariables) => ['LocationEntities.infinite', variables];
;

export const PlayerLogsDocument = `
    query PlayerLogs($game_id: String!, $player_id: String!) {
  events(last: 1000, keys: ["*", $game_id, $player_id]) {
    totalCount
    edges {
      node {
        id
        keys
        data
        createdAt
      }
    }
  }
}
    `;
export const usePlayerLogsQuery = <
      TData = PlayerLogsQuery,
      TError = unknown
    >(
      variables: PlayerLogsQueryVariables,
      options?: UseQueryOptions<PlayerLogsQuery, TError, TData>
    ) =>
    useQuery<PlayerLogsQuery, TError, TData>(
      ['PlayerLogs', variables],
      useFetchData<PlayerLogsQuery, PlayerLogsQueryVariables>(PlayerLogsDocument).bind(null, variables),
      options
    );

usePlayerLogsQuery.getKey = (variables: PlayerLogsQueryVariables) => ['PlayerLogs', variables];
;

export const useInfinitePlayerLogsQuery = <
      TData = PlayerLogsQuery,
      TError = unknown
    >(
      variables: PlayerLogsQueryVariables,
      options?: UseInfiniteQueryOptions<PlayerLogsQuery, TError, TData>
    ) =>{
    const query = useFetchData<PlayerLogsQuery, PlayerLogsQueryVariables>(PlayerLogsDocument)
    return useInfiniteQuery<PlayerLogsQuery, TError, TData>(
      ['PlayerLogs.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfinitePlayerLogsQuery.getKey = (variables: PlayerLogsQueryVariables) => ['PlayerLogs.infinite', variables];
;
