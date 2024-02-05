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

export type Game = {
  __typename?: 'Game';
  avatar_id?: Maybe<Scalars['u8']>;
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  game_mode?: Maybe<Scalars['Enum']>;
  max_turns?: Maybe<Scalars['u8']>;
};

export type GameConfig = {
  __typename?: 'GameConfig';
  cash?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  health?: Maybe<Scalars['u8']>;
  key?: Maybe<Scalars['u8']>;
  max_turns?: Maybe<Scalars['u8']>;
};

export type GameConfigConnection = {
  __typename?: 'GameConfigConnection';
  edges?: Maybe<Array<Maybe<GameConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type GameConfigEdge = {
  __typename?: 'GameConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<GameConfig>;
};

export type GameConfigOrder = {
  direction: OrderDirection;
  field: GameConfigOrderField;
};

export enum GameConfigOrderField {
  Cash = 'CASH',
  Health = 'HEALTH',
  Key = 'KEY',
  MaxTurns = 'MAX_TURNS'
}

export type GameConfigWhereInput = {
  cash?: InputMaybe<Scalars['u32']>;
  cashEQ?: InputMaybe<Scalars['u32']>;
  cashGT?: InputMaybe<Scalars['u32']>;
  cashGTE?: InputMaybe<Scalars['u32']>;
  cashLT?: InputMaybe<Scalars['u32']>;
  cashLTE?: InputMaybe<Scalars['u32']>;
  cashNEQ?: InputMaybe<Scalars['u32']>;
  health?: InputMaybe<Scalars['u8']>;
  healthEQ?: InputMaybe<Scalars['u8']>;
  healthGT?: InputMaybe<Scalars['u8']>;
  healthGTE?: InputMaybe<Scalars['u8']>;
  healthLT?: InputMaybe<Scalars['u8']>;
  healthLTE?: InputMaybe<Scalars['u8']>;
  healthNEQ?: InputMaybe<Scalars['u8']>;
  key?: InputMaybe<Scalars['u8']>;
  keyEQ?: InputMaybe<Scalars['u8']>;
  keyGT?: InputMaybe<Scalars['u8']>;
  keyGTE?: InputMaybe<Scalars['u8']>;
  keyLT?: InputMaybe<Scalars['u8']>;
  keyLTE?: InputMaybe<Scalars['u8']>;
  keyNEQ?: InputMaybe<Scalars['u8']>;
  max_turns?: InputMaybe<Scalars['u8']>;
  max_turnsEQ?: InputMaybe<Scalars['u8']>;
  max_turnsGT?: InputMaybe<Scalars['u8']>;
  max_turnsGTE?: InputMaybe<Scalars['u8']>;
  max_turnsLT?: InputMaybe<Scalars['u8']>;
  max_turnsLTE?: InputMaybe<Scalars['u8']>;
  max_turnsNEQ?: InputMaybe<Scalars['u8']>;
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
  AvatarId = 'AVATAR_ID',
  GameId = 'GAME_ID',
  GameMode = 'GAME_MODE',
  MaxTurns = 'MAX_TURNS'
}

export type GameStorePacked = {
  __typename?: 'GameStorePacked';
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  packed?: Maybe<Scalars['felt252']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
};

export type GameStorePackedConnection = {
  __typename?: 'GameStorePackedConnection';
  edges?: Maybe<Array<Maybe<GameStorePackedEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type GameStorePackedEdge = {
  __typename?: 'GameStorePackedEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<GameStorePacked>;
};

export type GameStorePackedOrder = {
  direction: OrderDirection;
  field: GameStorePackedOrderField;
};

export enum GameStorePackedOrderField {
  GameId = 'GAME_ID',
  Packed = 'PACKED',
  PlayerId = 'PLAYER_ID'
}

export type GameStorePackedWhereInput = {
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

export type GameWhereInput = {
  avatar_id?: InputMaybe<Scalars['u8']>;
  avatar_idEQ?: InputMaybe<Scalars['u8']>;
  avatar_idGT?: InputMaybe<Scalars['u8']>;
  avatar_idGTE?: InputMaybe<Scalars['u8']>;
  avatar_idLT?: InputMaybe<Scalars['u8']>;
  avatar_idLTE?: InputMaybe<Scalars['u8']>;
  avatar_idNEQ?: InputMaybe<Scalars['u8']>;
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

export type ItemConfig = {
  __typename?: 'ItemConfig';
  cost?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  level?: Maybe<Scalars['Enum']>;
  level_id?: Maybe<Scalars['u8']>;
  slot?: Maybe<Scalars['Enum']>;
  slot_id?: Maybe<Scalars['u8']>;
  stat?: Maybe<Scalars['u32']>;
};

export type ItemConfigConnection = {
  __typename?: 'ItemConfigConnection';
  edges?: Maybe<Array<Maybe<ItemConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type ItemConfigEdge = {
  __typename?: 'ItemConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<ItemConfig>;
};

export type ItemConfigMeta = {
  __typename?: 'ItemConfigMeta';
  entity?: Maybe<World__Entity>;
  level?: Maybe<Scalars['Enum']>;
  level_id?: Maybe<Scalars['u8']>;
  name?: Maybe<Scalars['felt252']>;
  slot?: Maybe<Scalars['Enum']>;
  slot_id?: Maybe<Scalars['u8']>;
};

export type ItemConfigMetaConnection = {
  __typename?: 'ItemConfigMetaConnection';
  edges?: Maybe<Array<Maybe<ItemConfigMetaEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type ItemConfigMetaEdge = {
  __typename?: 'ItemConfigMetaEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<ItemConfigMeta>;
};

export type ItemConfigMetaOrder = {
  direction: OrderDirection;
  field: ItemConfigMetaOrderField;
};

export enum ItemConfigMetaOrderField {
  Level = 'LEVEL',
  LevelId = 'LEVEL_ID',
  Name = 'NAME',
  Slot = 'SLOT',
  SlotId = 'SLOT_ID'
}

export type ItemConfigMetaWhereInput = {
  level?: InputMaybe<Scalars['Enum']>;
  level_id?: InputMaybe<Scalars['u8']>;
  level_idEQ?: InputMaybe<Scalars['u8']>;
  level_idGT?: InputMaybe<Scalars['u8']>;
  level_idGTE?: InputMaybe<Scalars['u8']>;
  level_idLT?: InputMaybe<Scalars['u8']>;
  level_idLTE?: InputMaybe<Scalars['u8']>;
  level_idNEQ?: InputMaybe<Scalars['u8']>;
  name?: InputMaybe<Scalars['felt252']>;
  nameEQ?: InputMaybe<Scalars['felt252']>;
  nameGT?: InputMaybe<Scalars['felt252']>;
  nameGTE?: InputMaybe<Scalars['felt252']>;
  nameLT?: InputMaybe<Scalars['felt252']>;
  nameLTE?: InputMaybe<Scalars['felt252']>;
  nameNEQ?: InputMaybe<Scalars['felt252']>;
  slot?: InputMaybe<Scalars['Enum']>;
  slot_id?: InputMaybe<Scalars['u8']>;
  slot_idEQ?: InputMaybe<Scalars['u8']>;
  slot_idGT?: InputMaybe<Scalars['u8']>;
  slot_idGTE?: InputMaybe<Scalars['u8']>;
  slot_idLT?: InputMaybe<Scalars['u8']>;
  slot_idLTE?: InputMaybe<Scalars['u8']>;
  slot_idNEQ?: InputMaybe<Scalars['u8']>;
};

export type ItemConfigOrder = {
  direction: OrderDirection;
  field: ItemConfigOrderField;
};

export enum ItemConfigOrderField {
  Cost = 'COST',
  Level = 'LEVEL',
  LevelId = 'LEVEL_ID',
  Slot = 'SLOT',
  SlotId = 'SLOT_ID',
  Stat = 'STAT'
}

export type ItemConfigWhereInput = {
  cost?: InputMaybe<Scalars['u32']>;
  costEQ?: InputMaybe<Scalars['u32']>;
  costGT?: InputMaybe<Scalars['u32']>;
  costGTE?: InputMaybe<Scalars['u32']>;
  costLT?: InputMaybe<Scalars['u32']>;
  costLTE?: InputMaybe<Scalars['u32']>;
  costNEQ?: InputMaybe<Scalars['u32']>;
  level?: InputMaybe<Scalars['Enum']>;
  level_id?: InputMaybe<Scalars['u8']>;
  level_idEQ?: InputMaybe<Scalars['u8']>;
  level_idGT?: InputMaybe<Scalars['u8']>;
  level_idGTE?: InputMaybe<Scalars['u8']>;
  level_idLT?: InputMaybe<Scalars['u8']>;
  level_idLTE?: InputMaybe<Scalars['u8']>;
  level_idNEQ?: InputMaybe<Scalars['u8']>;
  slot?: InputMaybe<Scalars['Enum']>;
  slot_id?: InputMaybe<Scalars['u8']>;
  slot_idEQ?: InputMaybe<Scalars['u8']>;
  slot_idGT?: InputMaybe<Scalars['u8']>;
  slot_idGTE?: InputMaybe<Scalars['u8']>;
  slot_idLT?: InputMaybe<Scalars['u8']>;
  slot_idLTE?: InputMaybe<Scalars['u8']>;
  slot_idNEQ?: InputMaybe<Scalars['u8']>;
  stat?: InputMaybe<Scalars['u32']>;
  statEQ?: InputMaybe<Scalars['u32']>;
  statGT?: InputMaybe<Scalars['u32']>;
  statGTE?: InputMaybe<Scalars['u32']>;
  statLT?: InputMaybe<Scalars['u32']>;
  statLTE?: InputMaybe<Scalars['u32']>;
  statNEQ?: InputMaybe<Scalars['u32']>;
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

export type ModelUnion = DrugConfig | DrugConfigMeta | Game | GameConfig | GameStorePacked | ItemConfig | ItemConfigMeta | Leaderboard | LocationConfig | LocationConfigMeta | RyoMeta;

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

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
  entities?: Maybe<World__EntityConnection>;
  entity: World__Entity;
  events?: Maybe<World__EventConnection>;
  gameConfigModels?: Maybe<GameConfigConnection>;
  gameModels?: Maybe<GameConnection>;
  gameStorePackedModels?: Maybe<GameStorePackedConnection>;
  itemConfigMetaModels?: Maybe<ItemConfigMetaConnection>;
  itemConfigModels?: Maybe<ItemConfigConnection>;
  leaderboardModels?: Maybe<LeaderboardConnection>;
  locationConfigMetaModels?: Maybe<LocationConfigMetaConnection>;
  locationConfigModels?: Maybe<LocationConfigConnection>;
  metadatas?: Maybe<World__MetadataConnection>;
  model: World__Model;
  models?: Maybe<World__ModelConnection>;
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


export type World__QueryGameConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<GameConfigOrder>;
  where?: InputMaybe<GameConfigWhereInput>;
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


export type World__QueryGameStorePackedModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<GameStorePackedOrder>;
  where?: InputMaybe<GameStorePackedWhereInput>;
};


export type World__QueryItemConfigMetaModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ItemConfigMetaOrder>;
  where?: InputMaybe<ItemConfigMetaWhereInput>;
};


export type World__QueryItemConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ItemConfigOrder>;
  where?: InputMaybe<ItemConfigWhereInput>;
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
  transactionHash: Scalars['String'];
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

export type RyoMetasQueryVariables = Exact<{ [key: string]: never; }>;


export type RyoMetasQuery = { __typename?: 'World__Query', ryoMetaModels?: { __typename?: 'RyoMetaConnection', edges?: Array<{ __typename?: 'RyoMetaEdge', node?: { __typename?: 'RyoMeta', id?: any | null, initialized?: any | null, leaderboard_version?: any | null } | null } | null> | null } | null };

export type LeaderboardMetasQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u32']>;
}>;


export type LeaderboardMetasQuery = { __typename?: 'World__Query', leaderboardModels?: { __typename?: 'LeaderboardConnection', edges?: Array<{ __typename?: 'LeaderboardEdge', node?: { __typename?: 'Leaderboard', version?: any | null, high_score?: any | null, next_version_timestamp?: any | null } | null } | null> | null } | null };

export type ConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type ConfigQuery = { __typename?: 'World__Query', drugConfigModels?: { __typename?: 'DrugConfigConnection', edges?: Array<{ __typename?: 'DrugConfigEdge', node?: { __typename?: 'DrugConfig', drug?: any | null, drug_id?: any | null, base?: any | null, step?: any | null, weight?: any | null, from_turn?: any | null, to_turn?: any | null } | null } | null> | null } | null, drugConfigMetaModels?: { __typename?: 'DrugConfigMetaConnection', edges?: Array<{ __typename?: 'DrugConfigMetaEdge', node?: { __typename?: 'DrugConfigMeta', drug?: any | null, name?: any | null } | null } | null> | null } | null, locationConfigModels?: { __typename?: 'LocationConfigConnection', edges?: Array<{ __typename?: 'LocationConfigEdge', node?: { __typename?: 'LocationConfig', location?: any | null, location_id?: any | null } | null } | null> | null } | null, locationConfigMetaModels?: { __typename?: 'LocationConfigMetaConnection', edges?: Array<{ __typename?: 'LocationConfigMetaEdge', node?: { __typename?: 'LocationConfigMeta', location?: any | null, name?: any | null } | null } | null> | null } | null, itemConfigModels?: { __typename?: 'ItemConfigConnection', edges?: Array<{ __typename?: 'ItemConfigEdge', node?: { __typename?: 'ItemConfig', slot?: any | null, level?: any | null, slot_id?: any | null, level_id?: any | null, cost?: any | null, stat?: any | null } | null } | null> | null } | null, itemConfigMetaModels?: { __typename?: 'ItemConfigMetaConnection', edges?: Array<{ __typename?: 'ItemConfigMetaEdge', node?: { __typename?: 'ItemConfigMeta', slot?: any | null, level?: any | null, name?: any | null } | null } | null> | null } | null };

export type GameByIdQueryVariables = Exact<{
  gameId?: InputMaybe<Scalars['u32']>;
}>;


export type GameByIdQuery = { __typename?: 'World__Query', gameModels?: { __typename?: 'GameConnection', edges?: Array<{ __typename?: 'GameEdge', node?: { __typename?: 'Game', game_id?: any | null, game_mode?: any | null, max_turns?: any | null, avatar_id?: any | null } | null } | null> | null } | null };

export type GameStorePackedQueryVariables = Exact<{
  gameId: Scalars['String'];
  playerId: Scalars['String'];
}>;


export type GameStorePackedQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', id?: string | null, models?: Array<{ __typename: 'DrugConfig' } | { __typename: 'DrugConfigMeta' } | { __typename: 'Game' } | { __typename: 'GameConfig' } | { __typename: 'GameStorePacked', game_id?: any | null, player_id?: any | null, packed?: any | null } | { __typename: 'ItemConfig' } | { __typename: 'ItemConfigMeta' } | { __typename: 'Leaderboard' } | { __typename: 'LocationConfig' } | { __typename: 'LocationConfigMeta' } | { __typename: 'RyoMeta' } | null> | null } | null } | null> | null } | null };

export type GameStorePackedSubscriptionSubscriptionVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type GameStorePackedSubscriptionSubscription = { __typename?: 'World__Subscription', entityUpdated: { __typename?: 'World__Entity', id?: string | null, keys?: Array<string | null> | null, models?: Array<{ __typename: 'DrugConfig' } | { __typename: 'DrugConfigMeta' } | { __typename: 'Game' } | { __typename: 'GameConfig' } | { __typename: 'GameStorePacked', game_id?: any | null, player_id?: any | null, packed?: any | null } | { __typename: 'ItemConfig' } | { __typename: 'ItemConfigMeta' } | { __typename: 'Leaderboard' } | { __typename: 'LocationConfig' } | { __typename: 'LocationConfigMeta' } | { __typename: 'RyoMeta' } | null> | null } };


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

export const ConfigDocument = `
    query Config {
  drugConfigModels(order: {field: DRUG_ID, direction: ASC}) {
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
  drugConfigMetaModels {
    edges {
      node {
        drug
        name
      }
    }
  }
  locationConfigModels(order: {field: LOCATION_ID, direction: ASC}) {
    edges {
      node {
        location
        location_id
      }
    }
  }
  locationConfigMetaModels {
    edges {
      node {
        location
        name
      }
    }
  }
  itemConfigModels(limit: 16) {
    edges {
      node {
        slot
        level
        slot_id
        level_id
        cost
        stat
      }
    }
  }
  itemConfigMetaModels(limit: 16) {
    edges {
      node {
        slot
        level
        name
      }
    }
  }
}
    `;
export const useConfigQuery = <
      TData = ConfigQuery,
      TError = unknown
    >(
      variables?: ConfigQueryVariables,
      options?: UseQueryOptions<ConfigQuery, TError, TData>
    ) =>
    useQuery<ConfigQuery, TError, TData>(
      variables === undefined ? ['Config'] : ['Config', variables],
      useFetchData<ConfigQuery, ConfigQueryVariables>(ConfigDocument).bind(null, variables),
      options
    );

useConfigQuery.getKey = (variables?: ConfigQueryVariables) => variables === undefined ? ['Config'] : ['Config', variables];
;

export const useInfiniteConfigQuery = <
      TData = ConfigQuery,
      TError = unknown
    >(
      variables?: ConfigQueryVariables,
      options?: UseInfiniteQueryOptions<ConfigQuery, TError, TData>
    ) =>{
    const query = useFetchData<ConfigQuery, ConfigQueryVariables>(ConfigDocument)
    return useInfiniteQuery<ConfigQuery, TError, TData>(
      variables === undefined ? ['Config.infinite'] : ['Config.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteConfigQuery.getKey = (variables?: ConfigQueryVariables) => variables === undefined ? ['Config.infinite'] : ['Config.infinite', variables];
;

export const GameByIdDocument = `
    query GameById($gameId: u32) {
  gameModels(where: {game_id: $gameId}) {
    edges {
      node {
        game_id
        game_mode
        max_turns
        avatar_id
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

export const GameStorePackedDocument = `
    query GameStorePacked($gameId: String!, $playerId: String!) {
  entities(keys: [$gameId, $playerId]) {
    totalCount
    edges {
      node {
        id
        models {
          __typename
          ... on GameStorePacked {
            game_id
            player_id
            packed
          }
        }
      }
    }
  }
}
    `;
export const useGameStorePackedQuery = <
      TData = GameStorePackedQuery,
      TError = unknown
    >(
      variables: GameStorePackedQueryVariables,
      options?: UseQueryOptions<GameStorePackedQuery, TError, TData>
    ) =>
    useQuery<GameStorePackedQuery, TError, TData>(
      ['GameStorePacked', variables],
      useFetchData<GameStorePackedQuery, GameStorePackedQueryVariables>(GameStorePackedDocument).bind(null, variables),
      options
    );

useGameStorePackedQuery.getKey = (variables: GameStorePackedQueryVariables) => ['GameStorePacked', variables];
;

export const useInfiniteGameStorePackedQuery = <
      TData = GameStorePackedQuery,
      TError = unknown
    >(
      variables: GameStorePackedQueryVariables,
      options?: UseInfiniteQueryOptions<GameStorePackedQuery, TError, TData>
    ) =>{
    const query = useFetchData<GameStorePackedQuery, GameStorePackedQueryVariables>(GameStorePackedDocument)
    return useInfiniteQuery<GameStorePackedQuery, TError, TData>(
      ['GameStorePacked.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGameStorePackedQuery.getKey = (variables: GameStorePackedQueryVariables) => ['GameStorePacked.infinite', variables];
;

export const GameStorePackedSubscriptionDocument = `
    subscription GameStorePackedSubscription($id: ID) {
  entityUpdated(id: $id) {
    id
    keys
    models {
      __typename
      ... on GameStorePacked {
        game_id
        player_id
        packed
      }
    }
  }
}
    `;