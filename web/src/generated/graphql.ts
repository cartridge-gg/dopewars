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
  usize: any;
};

export type Drug = {
  __typename?: 'Drug';
  drug_id?: Maybe<Scalars['Enum']>;
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  quantity?: Maybe<Scalars['usize']>;
};

export type DrugConfig = {
  __typename?: 'DrugConfig';
  base?: Maybe<Scalars['usize']>;
  drug?: Maybe<Scalars['Enum']>;
  drug_id?: Maybe<Scalars['u8']>;
  entity?: Maybe<World__Entity>;
  from_turn?: Maybe<Scalars['u8']>;
  step?: Maybe<Scalars['usize']>;
  to_turn?: Maybe<Scalars['u8']>;
  weight?: Maybe<Scalars['usize']>;
};

export type DrugConfigConnection = {
  __typename?: 'DrugConfigConnection';
  edges?: Maybe<Array<Maybe<DrugConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type DrugConfigEdge = {
  __typename?: 'DrugConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<DrugConfig>;
};

export type DrugConfigMeta = {
  __typename?: 'DrugConfigMeta';
  drug?: Maybe<Scalars['Enum']>;
  entity?: Maybe<World__Entity>;
  name?: Maybe<Scalars['felt252']>;
};

export type DrugConfigMetaConnection = {
  __typename?: 'DrugConfigMetaConnection';
  edges?: Maybe<Array<Maybe<DrugConfigMetaEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type DrugConfigMetaEdge = {
  __typename?: 'DrugConfigMetaEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<DrugConfigMeta>;
};

export type DrugConfigMetaOrder = {
  direction: OrderDirection;
  field: DrugConfigMetaOrderField;
};

export enum DrugConfigMetaOrderField {
  Drug = 'DRUG',
  Name = 'NAME'
}

export type DrugConfigMetaWhereInput = {
  drug?: InputMaybe<Scalars['Enum']>;
  name?: InputMaybe<Scalars['felt252']>;
  nameEQ?: InputMaybe<Scalars['felt252']>;
  nameGT?: InputMaybe<Scalars['felt252']>;
  nameGTE?: InputMaybe<Scalars['felt252']>;
  nameLT?: InputMaybe<Scalars['felt252']>;
  nameLTE?: InputMaybe<Scalars['felt252']>;
  nameNEQ?: InputMaybe<Scalars['felt252']>;
};

export type DrugConfigOrder = {
  direction: OrderDirection;
  field: DrugConfigOrderField;
};

export enum DrugConfigOrderField {
  Base = 'BASE',
  Drug = 'DRUG',
  DrugId = 'DRUG_ID',
  FromTurn = 'FROM_TURN',
  Step = 'STEP',
  ToTurn = 'TO_TURN',
  Weight = 'WEIGHT'
}

export type DrugConfigWhereInput = {
  base?: InputMaybe<Scalars['usize']>;
  baseEQ?: InputMaybe<Scalars['usize']>;
  baseGT?: InputMaybe<Scalars['usize']>;
  baseGTE?: InputMaybe<Scalars['usize']>;
  baseLT?: InputMaybe<Scalars['usize']>;
  baseLTE?: InputMaybe<Scalars['usize']>;
  baseNEQ?: InputMaybe<Scalars['usize']>;
  drug?: InputMaybe<Scalars['Enum']>;
  drug_id?: InputMaybe<Scalars['u8']>;
  drug_idEQ?: InputMaybe<Scalars['u8']>;
  drug_idGT?: InputMaybe<Scalars['u8']>;
  drug_idGTE?: InputMaybe<Scalars['u8']>;
  drug_idLT?: InputMaybe<Scalars['u8']>;
  drug_idLTE?: InputMaybe<Scalars['u8']>;
  drug_idNEQ?: InputMaybe<Scalars['u8']>;
  from_turn?: InputMaybe<Scalars['u8']>;
  from_turnEQ?: InputMaybe<Scalars['u8']>;
  from_turnGT?: InputMaybe<Scalars['u8']>;
  from_turnGTE?: InputMaybe<Scalars['u8']>;
  from_turnLT?: InputMaybe<Scalars['u8']>;
  from_turnLTE?: InputMaybe<Scalars['u8']>;
  from_turnNEQ?: InputMaybe<Scalars['u8']>;
  step?: InputMaybe<Scalars['usize']>;
  stepEQ?: InputMaybe<Scalars['usize']>;
  stepGT?: InputMaybe<Scalars['usize']>;
  stepGTE?: InputMaybe<Scalars['usize']>;
  stepLT?: InputMaybe<Scalars['usize']>;
  stepLTE?: InputMaybe<Scalars['usize']>;
  stepNEQ?: InputMaybe<Scalars['usize']>;
  to_turn?: InputMaybe<Scalars['u8']>;
  to_turnEQ?: InputMaybe<Scalars['u8']>;
  to_turnGT?: InputMaybe<Scalars['u8']>;
  to_turnGTE?: InputMaybe<Scalars['u8']>;
  to_turnLT?: InputMaybe<Scalars['u8']>;
  to_turnLTE?: InputMaybe<Scalars['u8']>;
  to_turnNEQ?: InputMaybe<Scalars['u8']>;
  weight?: InputMaybe<Scalars['usize']>;
  weightEQ?: InputMaybe<Scalars['usize']>;
  weightGT?: InputMaybe<Scalars['usize']>;
  weightGTE?: InputMaybe<Scalars['usize']>;
  weightLT?: InputMaybe<Scalars['usize']>;
  weightLTE?: InputMaybe<Scalars['usize']>;
  weightNEQ?: InputMaybe<Scalars['usize']>;
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
  payout?: Maybe<Scalars['u32']>;
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
  payout?: InputMaybe<Scalars['u32']>;
  payoutEQ?: InputMaybe<Scalars['u32']>;
  payoutGT?: InputMaybe<Scalars['u32']>;
  payoutGTE?: InputMaybe<Scalars['u32']>;
  payoutLT?: InputMaybe<Scalars['u32']>;
  payoutLTE?: InputMaybe<Scalars['u32']>;
  payoutNEQ?: InputMaybe<Scalars['u32']>;
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
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  game_mode?: Maybe<Scalars['Enum']>;
  max_turns?: Maybe<Scalars['u8']>;
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
  GameId = 'GAME_ID',
  GameMode = 'GAME_MODE',
  MaxTurns = 'MAX_TURNS'
}

export type GameWhereInput = {
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_mode?: InputMaybe<Scalars['Enum']>;
  max_turns?: InputMaybe<Scalars['u8']>;
  max_turnsEQ?: InputMaybe<Scalars['u8']>;
  max_turnsGT?: InputMaybe<Scalars['u8']>;
  max_turnsGTE?: InputMaybe<Scalars['u8']>;
  max_turnsLT?: InputMaybe<Scalars['u8']>;
  max_turnsLTE?: InputMaybe<Scalars['u8']>;
  max_turnsNEQ?: InputMaybe<Scalars['u8']>;
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
  high_score?: Maybe<Scalars['u32']>;
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
  high_score?: InputMaybe<Scalars['u32']>;
  high_scoreEQ?: InputMaybe<Scalars['u32']>;
  high_scoreGT?: InputMaybe<Scalars['u32']>;
  high_scoreGTE?: InputMaybe<Scalars['u32']>;
  high_scoreLT?: InputMaybe<Scalars['u32']>;
  high_scoreLTE?: InputMaybe<Scalars['u32']>;
  high_scoreNEQ?: InputMaybe<Scalars['u32']>;
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

export type LocationConfig = {
  __typename?: 'LocationConfig';
  entity?: Maybe<World__Entity>;
  location?: Maybe<Scalars['Enum']>;
  location_id?: Maybe<Scalars['u8']>;
};

export type LocationConfigConnection = {
  __typename?: 'LocationConfigConnection';
  edges?: Maybe<Array<Maybe<LocationConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type LocationConfigEdge = {
  __typename?: 'LocationConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<LocationConfig>;
};

export type LocationConfigMeta = {
  __typename?: 'LocationConfigMeta';
  entity?: Maybe<World__Entity>;
  location?: Maybe<Scalars['Enum']>;
  name?: Maybe<Scalars['felt252']>;
};

export type LocationConfigMetaConnection = {
  __typename?: 'LocationConfigMetaConnection';
  edges?: Maybe<Array<Maybe<LocationConfigMetaEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type LocationConfigMetaEdge = {
  __typename?: 'LocationConfigMetaEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<LocationConfigMeta>;
};

export type LocationConfigMetaOrder = {
  direction: OrderDirection;
  field: LocationConfigMetaOrderField;
};

export enum LocationConfigMetaOrderField {
  Location = 'LOCATION',
  Name = 'NAME'
}

export type LocationConfigMetaWhereInput = {
  location?: InputMaybe<Scalars['Enum']>;
  name?: InputMaybe<Scalars['felt252']>;
  nameEQ?: InputMaybe<Scalars['felt252']>;
  nameGT?: InputMaybe<Scalars['felt252']>;
  nameGTE?: InputMaybe<Scalars['felt252']>;
  nameLT?: InputMaybe<Scalars['felt252']>;
  nameLTE?: InputMaybe<Scalars['felt252']>;
  nameNEQ?: InputMaybe<Scalars['felt252']>;
};

export type LocationConfigOrder = {
  direction: OrderDirection;
  field: LocationConfigOrderField;
};

export enum LocationConfigOrderField {
  Location = 'LOCATION',
  LocationId = 'LOCATION_ID'
}

export type LocationConfigWhereInput = {
  location?: InputMaybe<Scalars['Enum']>;
  location_id?: InputMaybe<Scalars['u8']>;
  location_idEQ?: InputMaybe<Scalars['u8']>;
  location_idGT?: InputMaybe<Scalars['u8']>;
  location_idGTE?: InputMaybe<Scalars['u8']>;
  location_idLT?: InputMaybe<Scalars['u8']>;
  location_idLTE?: InputMaybe<Scalars['u8']>;
  location_idNEQ?: InputMaybe<Scalars['u8']>;
};

export type MarketPacked = {
  __typename?: 'MarketPacked';
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  packed?: Maybe<Scalars['felt252']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
};

export type MarketPackedConnection = {
  __typename?: 'MarketPackedConnection';
  edges?: Maybe<Array<Maybe<MarketPackedEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type MarketPackedEdge = {
  __typename?: 'MarketPackedEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<MarketPacked>;
};

export type MarketPackedOrder = {
  direction: OrderDirection;
  field: MarketPackedOrderField;
};

export enum MarketPackedOrderField {
  GameId = 'GAME_ID',
  Packed = 'PACKED',
  PlayerId = 'PLAYER_ID'
}

export type MarketPackedWhereInput = {
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  packed?: InputMaybe<Scalars['felt252']>;
  packedEQ?: InputMaybe<Scalars['felt252']>;
  packedGT?: InputMaybe<Scalars['felt252']>;
  packedGTE?: InputMaybe<Scalars['felt252']>;
  packedLT?: InputMaybe<Scalars['felt252']>;
  packedLTE?: InputMaybe<Scalars['felt252']>;
  packedNEQ?: InputMaybe<Scalars['felt252']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
};

export type ModelUnion = Drug | DrugConfig | DrugConfigMeta | Encounter | Game | Item | Leaderboard | LocationConfig | LocationConfigMeta | MarketPacked | Player | RyoMeta;

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Player = {
  __typename?: 'Player';
  attack?: Maybe<Scalars['usize']>;
  avatar_id?: Maybe<Scalars['u8']>;
  cash?: Maybe<Scalars['u32']>;
  defense?: Maybe<Scalars['usize']>;
  drug_count?: Maybe<Scalars['usize']>;
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  game_over?: Maybe<Scalars['bool']>;
  health?: Maybe<Scalars['u8']>;
  leaderboard_version?: Maybe<Scalars['u32']>;
  location_id?: Maybe<Scalars['Enum']>;
  name?: Maybe<Scalars['felt252']>;
  next_location_id?: Maybe<Scalars['Enum']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  speed?: Maybe<Scalars['usize']>;
  status?: Maybe<Scalars['Enum']>;
  transport?: Maybe<Scalars['usize']>;
  turn?: Maybe<Scalars['u8']>;
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
  LeaderboardVersion = 'LEADERBOARD_VERSION',
  LocationId = 'LOCATION_ID',
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
  cash?: InputMaybe<Scalars['u32']>;
  cashEQ?: InputMaybe<Scalars['u32']>;
  cashGT?: InputMaybe<Scalars['u32']>;
  cashGTE?: InputMaybe<Scalars['u32']>;
  cashLT?: InputMaybe<Scalars['u32']>;
  cashLTE?: InputMaybe<Scalars['u32']>;
  cashNEQ?: InputMaybe<Scalars['u32']>;
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
  leaderboard_version?: InputMaybe<Scalars['u32']>;
  leaderboard_versionEQ?: InputMaybe<Scalars['u32']>;
  leaderboard_versionGT?: InputMaybe<Scalars['u32']>;
  leaderboard_versionGTE?: InputMaybe<Scalars['u32']>;
  leaderboard_versionLT?: InputMaybe<Scalars['u32']>;
  leaderboard_versionLTE?: InputMaybe<Scalars['u32']>;
  leaderboard_versionNEQ?: InputMaybe<Scalars['u32']>;
  location_id?: InputMaybe<Scalars['Enum']>;
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
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
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
  drugConfigMetaModels?: Maybe<DrugConfigMetaConnection>;
  drugConfigModels?: Maybe<DrugConfigConnection>;
  drugModels?: Maybe<DrugConnection>;
  encounterModels?: Maybe<EncounterConnection>;
  entities?: Maybe<World__EntityConnection>;
  entity: World__Entity;
  events?: Maybe<World__EventConnection>;
  gameModels?: Maybe<GameConnection>;
  itemModels?: Maybe<ItemConnection>;
  leaderboardModels?: Maybe<LeaderboardConnection>;
  locationConfigMetaModels?: Maybe<LocationConfigMetaConnection>;
  locationConfigModels?: Maybe<LocationConfigConnection>;
  marketPackedModels?: Maybe<MarketPackedConnection>;
  metadatas?: Maybe<World__MetadataConnection>;
  model: World__Model;
  models?: Maybe<World__ModelConnection>;
  playerModels?: Maybe<PlayerConnection>;
  ryoMetaModels?: Maybe<RyoMetaConnection>;
  transaction: World__Transaction;
  transactions?: Maybe<World__TransactionConnection>;
};


export type World__QueryDrugConfigMetaModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<DrugConfigMetaOrder>;
  where?: InputMaybe<DrugConfigMetaWhereInput>;
};


export type World__QueryDrugConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<DrugConfigOrder>;
  where?: InputMaybe<DrugConfigWhereInput>;
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


export type World__QueryLocationConfigMetaModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<LocationConfigMetaOrder>;
  where?: InputMaybe<LocationConfigMetaWhereInput>;
};


export type World__QueryLocationConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<LocationConfigOrder>;
  where?: InputMaybe<LocationConfigWhereInput>;
};


export type World__QueryMarketPackedModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<MarketPackedOrder>;
  where?: InputMaybe<MarketPackedWhereInput>;
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
  id: Scalars['ID'];
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

export type RyoMetasQueryVariables = Exact<{ [key: string]: never; }>;


export type RyoMetasQuery = { __typename?: 'World__Query', ryoMetaModels?: { __typename?: 'RyoMetaConnection', edges?: Array<{ __typename?: 'RyoMetaEdge', node?: { __typename?: 'RyoMeta', id?: any | null, initialized?: any | null, leaderboard_version?: any | null } | null } | null> | null } | null };

export type LeaderboardMetasQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u32']>;
}>;


export type LeaderboardMetasQuery = { __typename?: 'World__Query', leaderboardModels?: { __typename?: 'LeaderboardConnection', edges?: Array<{ __typename?: 'LeaderboardEdge', node?: { __typename?: 'Leaderboard', version?: any | null, high_score?: any | null, next_version_timestamp?: any | null } | null } | null> | null } | null };

export type DrugConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type DrugConfigQuery = { __typename?: 'World__Query', drugConfigModels?: { __typename?: 'DrugConfigConnection', edges?: Array<{ __typename?: 'DrugConfigEdge', node?: { __typename?: 'DrugConfig', drug?: any | null, drug_id?: any | null, base?: any | null, step?: any | null, weight?: any | null, from_turn?: any | null, to_turn?: any | null } | null } | null> | null } | null };

export type DrugConfigMetaQueryVariables = Exact<{ [key: string]: never; }>;


export type DrugConfigMetaQuery = { __typename?: 'World__Query', drugConfigMetaModels?: { __typename?: 'DrugConfigMetaConnection', edges?: Array<{ __typename?: 'DrugConfigMetaEdge', node?: { __typename?: 'DrugConfigMeta', drug?: any | null, name?: any | null } | null } | null> | null } | null };

export type LocationConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type LocationConfigQuery = { __typename?: 'World__Query', locationConfigModels?: { __typename?: 'LocationConfigConnection', edges?: Array<{ __typename?: 'LocationConfigEdge', node?: { __typename?: 'LocationConfig', location?: any | null, location_id?: any | null } | null } | null> | null } | null };

export type LocationConfigMetaQueryVariables = Exact<{ [key: string]: never; }>;


export type LocationConfigMetaQuery = { __typename?: 'World__Query', locationConfigMetaModels?: { __typename?: 'LocationConfigMetaConnection', edges?: Array<{ __typename?: 'LocationConfigMetaEdge', node?: { __typename?: 'LocationConfigMeta', location?: any | null, name?: any | null } | null } | null> | null } | null };

export type PlayerPropsFragment = { __typename?: 'Player', name?: any | null, avatar_id?: any | null, cash?: any | null, status?: any | null, location_id?: any | null, next_location_id?: any | null, drug_count?: any | null, health?: any | null, turn?: any | null, attack?: any | null, defense?: any | null, transport?: any | null, speed?: any | null, wanted?: any | null, game_over?: any | null };

export type GameByIdQueryVariables = Exact<{
  gameId?: InputMaybe<Scalars['u32']>;
}>;


export type GameByIdQuery = { __typename?: 'World__Query', gameModels?: { __typename?: 'GameConnection', edges?: Array<{ __typename?: 'GameEdge', node?: { __typename?: 'Game', game_id?: any | null, game_mode?: any | null, max_turns?: any | null } | null } | null> | null } | null };

export type PlayerEntityQueryVariables = Exact<{
  gameId: Scalars['String'];
  playerId: Scalars['String'];
}>;


export type PlayerEntityQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', id?: string | null, models?: Array<{ __typename: 'Drug', drug_id?: any | null, quantity?: any | null } | { __typename: 'DrugConfig' } | { __typename: 'DrugConfigMeta' } | { __typename: 'Encounter', encounter_id?: any | null, level?: any | null, health?: any | null, payout?: any | null } | { __typename: 'Game' } | { __typename: 'Item', item_id?: any | null, level?: any | null, name?: any | null, value?: any | null } | { __typename: 'Leaderboard' } | { __typename: 'LocationConfig' } | { __typename: 'LocationConfigMeta' } | { __typename: 'MarketPacked', game_id?: any | null, packed?: any | null } | { __typename: 'Player', name?: any | null, avatar_id?: any | null, cash?: any | null, status?: any | null, location_id?: any | null, next_location_id?: any | null, drug_count?: any | null, health?: any | null, turn?: any | null, attack?: any | null, defense?: any | null, transport?: any | null, speed?: any | null, wanted?: any | null, game_over?: any | null } | { __typename: 'RyoMeta' } | null> | null } | null } | null> | null } | null };

export type PlayerEntitySubscriptionSubscriptionVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type PlayerEntitySubscriptionSubscription = { __typename?: 'World__Subscription', entityUpdated: { __typename?: 'World__Entity', id?: string | null, keys?: Array<string | null> | null, models?: Array<{ __typename: 'Drug' } | { __typename: 'DrugConfig' } | { __typename: 'DrugConfigMeta' } | { __typename: 'Encounter' } | { __typename: 'Game' } | { __typename: 'Item' } | { __typename: 'Leaderboard' } | { __typename: 'LocationConfig' } | { __typename: 'LocationConfigMeta' } | { __typename: 'MarketPacked', game_id?: any | null, packed?: any | null } | { __typename: 'Player', name?: any | null, avatar_id?: any | null, cash?: any | null, status?: any | null, location_id?: any | null, next_location_id?: any | null, drug_count?: any | null, health?: any | null, turn?: any | null, attack?: any | null, defense?: any | null, transport?: any | null, speed?: any | null, wanted?: any | null, game_over?: any | null } | { __typename: 'RyoMeta' } | null> | null } };

export type PlayerEntityRelatedDataSubscriptionSubscriptionVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type PlayerEntityRelatedDataSubscriptionSubscription = { __typename?: 'World__Subscription', entityUpdated: { __typename?: 'World__Entity', id?: string | null, keys?: Array<string | null> | null, models?: Array<{ __typename: 'Drug', drug_id?: any | null, quantity?: any | null } | { __typename: 'DrugConfig' } | { __typename: 'DrugConfigMeta' } | { __typename: 'Encounter', encounter_id?: any | null, level?: any | null, health?: any | null, payout?: any | null } | { __typename: 'Game' } | { __typename: 'Item', item_id?: any | null, level?: any | null, name?: any | null, value?: any | null } | { __typename: 'Leaderboard' } | { __typename: 'LocationConfig' } | { __typename: 'LocationConfigMeta' } | { __typename: 'MarketPacked' } | { __typename: 'Player' } | { __typename: 'RyoMeta' } | null> | null } };

export type PlayerLogsQueryVariables = Exact<{
  game_id: Scalars['String'];
  player_id: Scalars['String'];
}>;


export type PlayerLogsQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null, createdAt?: any | null } | null } | null> | null } | null };

export const PlayerPropsFragmentDoc = `
    fragment PlayerProps on Player {
  name
  avatar_id
  cash
  status
  location_id
  next_location_id
  drug_count
  health
  turn
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

export const DrugConfigDocument = `
    query DrugConfig {
  drugConfigModels {
    edges {
      node {
        drug
        drug_id
        base
        step
        weight
        from_turn
        to_turn
      }
    }
  }
}
    `;
export const useDrugConfigQuery = <
      TData = DrugConfigQuery,
      TError = unknown
    >(
      variables?: DrugConfigQueryVariables,
      options?: UseQueryOptions<DrugConfigQuery, TError, TData>
    ) =>
    useQuery<DrugConfigQuery, TError, TData>(
      variables === undefined ? ['DrugConfig'] : ['DrugConfig', variables],
      useFetchData<DrugConfigQuery, DrugConfigQueryVariables>(DrugConfigDocument).bind(null, variables),
      options
    );

useDrugConfigQuery.getKey = (variables?: DrugConfigQueryVariables) => variables === undefined ? ['DrugConfig'] : ['DrugConfig', variables];
;

export const useInfiniteDrugConfigQuery = <
      TData = DrugConfigQuery,
      TError = unknown
    >(
      variables?: DrugConfigQueryVariables,
      options?: UseInfiniteQueryOptions<DrugConfigQuery, TError, TData>
    ) =>{
    const query = useFetchData<DrugConfigQuery, DrugConfigQueryVariables>(DrugConfigDocument)
    return useInfiniteQuery<DrugConfigQuery, TError, TData>(
      variables === undefined ? ['DrugConfig.infinite'] : ['DrugConfig.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteDrugConfigQuery.getKey = (variables?: DrugConfigQueryVariables) => variables === undefined ? ['DrugConfig.infinite'] : ['DrugConfig.infinite', variables];
;

export const DrugConfigMetaDocument = `
    query DrugConfigMeta {
  drugConfigMetaModels {
    edges {
      node {
        drug
        name
      }
    }
  }
}
    `;
export const useDrugConfigMetaQuery = <
      TData = DrugConfigMetaQuery,
      TError = unknown
    >(
      variables?: DrugConfigMetaQueryVariables,
      options?: UseQueryOptions<DrugConfigMetaQuery, TError, TData>
    ) =>
    useQuery<DrugConfigMetaQuery, TError, TData>(
      variables === undefined ? ['DrugConfigMeta'] : ['DrugConfigMeta', variables],
      useFetchData<DrugConfigMetaQuery, DrugConfigMetaQueryVariables>(DrugConfigMetaDocument).bind(null, variables),
      options
    );

useDrugConfigMetaQuery.getKey = (variables?: DrugConfigMetaQueryVariables) => variables === undefined ? ['DrugConfigMeta'] : ['DrugConfigMeta', variables];
;

export const useInfiniteDrugConfigMetaQuery = <
      TData = DrugConfigMetaQuery,
      TError = unknown
    >(
      variables?: DrugConfigMetaQueryVariables,
      options?: UseInfiniteQueryOptions<DrugConfigMetaQuery, TError, TData>
    ) =>{
    const query = useFetchData<DrugConfigMetaQuery, DrugConfigMetaQueryVariables>(DrugConfigMetaDocument)
    return useInfiniteQuery<DrugConfigMetaQuery, TError, TData>(
      variables === undefined ? ['DrugConfigMeta.infinite'] : ['DrugConfigMeta.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteDrugConfigMetaQuery.getKey = (variables?: DrugConfigMetaQueryVariables) => variables === undefined ? ['DrugConfigMeta.infinite'] : ['DrugConfigMeta.infinite', variables];
;

export const LocationConfigDocument = `
    query LocationConfig {
  locationConfigModels {
    edges {
      node {
        location
        location_id
      }
    }
  }
}
    `;
export const useLocationConfigQuery = <
      TData = LocationConfigQuery,
      TError = unknown
    >(
      variables?: LocationConfigQueryVariables,
      options?: UseQueryOptions<LocationConfigQuery, TError, TData>
    ) =>
    useQuery<LocationConfigQuery, TError, TData>(
      variables === undefined ? ['LocationConfig'] : ['LocationConfig', variables],
      useFetchData<LocationConfigQuery, LocationConfigQueryVariables>(LocationConfigDocument).bind(null, variables),
      options
    );

useLocationConfigQuery.getKey = (variables?: LocationConfigQueryVariables) => variables === undefined ? ['LocationConfig'] : ['LocationConfig', variables];
;

export const useInfiniteLocationConfigQuery = <
      TData = LocationConfigQuery,
      TError = unknown
    >(
      variables?: LocationConfigQueryVariables,
      options?: UseInfiniteQueryOptions<LocationConfigQuery, TError, TData>
    ) =>{
    const query = useFetchData<LocationConfigQuery, LocationConfigQueryVariables>(LocationConfigDocument)
    return useInfiniteQuery<LocationConfigQuery, TError, TData>(
      variables === undefined ? ['LocationConfig.infinite'] : ['LocationConfig.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteLocationConfigQuery.getKey = (variables?: LocationConfigQueryVariables) => variables === undefined ? ['LocationConfig.infinite'] : ['LocationConfig.infinite', variables];
;

export const LocationConfigMetaDocument = `
    query LocationConfigMeta {
  locationConfigMetaModels {
    edges {
      node {
        location
        name
      }
    }
  }
}
    `;
export const useLocationConfigMetaQuery = <
      TData = LocationConfigMetaQuery,
      TError = unknown
    >(
      variables?: LocationConfigMetaQueryVariables,
      options?: UseQueryOptions<LocationConfigMetaQuery, TError, TData>
    ) =>
    useQuery<LocationConfigMetaQuery, TError, TData>(
      variables === undefined ? ['LocationConfigMeta'] : ['LocationConfigMeta', variables],
      useFetchData<LocationConfigMetaQuery, LocationConfigMetaQueryVariables>(LocationConfigMetaDocument).bind(null, variables),
      options
    );

useLocationConfigMetaQuery.getKey = (variables?: LocationConfigMetaQueryVariables) => variables === undefined ? ['LocationConfigMeta'] : ['LocationConfigMeta', variables];
;

export const useInfiniteLocationConfigMetaQuery = <
      TData = LocationConfigMetaQuery,
      TError = unknown
    >(
      variables?: LocationConfigMetaQueryVariables,
      options?: UseInfiniteQueryOptions<LocationConfigMetaQuery, TError, TData>
    ) =>{
    const query = useFetchData<LocationConfigMetaQuery, LocationConfigMetaQueryVariables>(LocationConfigMetaDocument)
    return useInfiniteQuery<LocationConfigMetaQuery, TError, TData>(
      variables === undefined ? ['LocationConfigMeta.infinite'] : ['LocationConfigMeta.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteLocationConfigMetaQuery.getKey = (variables?: LocationConfigMetaQueryVariables) => variables === undefined ? ['LocationConfigMeta.infinite'] : ['LocationConfigMeta.infinite', variables];
;

export const GameByIdDocument = `
    query GameById($gameId: u32) {
  gameModels(where: {game_id: $gameId}) {
    edges {
      node {
        game_id
        game_mode
        max_turns
      }
    }
  }
}
    `;
export const useGameByIdQuery = <
      TData = GameByIdQuery,
      TError = unknown
    >(
      variables?: GameByIdQueryVariables,
      options?: UseQueryOptions<GameByIdQuery, TError, TData>
    ) =>
    useQuery<GameByIdQuery, TError, TData>(
      variables === undefined ? ['GameById'] : ['GameById', variables],
      useFetchData<GameByIdQuery, GameByIdQueryVariables>(GameByIdDocument).bind(null, variables),
      options
    );

useGameByIdQuery.getKey = (variables?: GameByIdQueryVariables) => variables === undefined ? ['GameById'] : ['GameById', variables];
;

export const useInfiniteGameByIdQuery = <
      TData = GameByIdQuery,
      TError = unknown
    >(
      variables?: GameByIdQueryVariables,
      options?: UseInfiniteQueryOptions<GameByIdQuery, TError, TData>
    ) =>{
    const query = useFetchData<GameByIdQuery, GameByIdQueryVariables>(GameByIdDocument)
    return useInfiniteQuery<GameByIdQuery, TError, TData>(
      variables === undefined ? ['GameById.infinite'] : ['GameById.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGameByIdQuery.getKey = (variables?: GameByIdQueryVariables) => variables === undefined ? ['GameById.infinite'] : ['GameById.infinite', variables];
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
          ... on MarketPacked {
            game_id
            packed
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
      ... on MarketPacked {
        game_id
        packed
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
