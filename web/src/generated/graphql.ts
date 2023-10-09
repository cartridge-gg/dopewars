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
};

export type Drug = {
  __typename?: 'Drug';
  drug_id?: Maybe<Scalars['Enum']>;
  entity?: Maybe<Entity>;
  game_id?: Maybe<Scalars['u32']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  quantity?: Maybe<Scalars['u32']>;
};

export type DrugConnection = {
  __typename?: 'DrugConnection';
  edges?: Maybe<Array<Maybe<DrugEdge>>>;
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
  quantity?: InputMaybe<Scalars['u32']>;
  quantityEQ?: InputMaybe<Scalars['u32']>;
  quantityGT?: InputMaybe<Scalars['u32']>;
  quantityGTE?: InputMaybe<Scalars['u32']>;
  quantityLT?: InputMaybe<Scalars['u32']>;
  quantityLTE?: InputMaybe<Scalars['u32']>;
  quantityNEQ?: InputMaybe<Scalars['u32']>;
};

export type Entity = {
  __typename?: 'Entity';
  createdAt?: Maybe<Scalars['DateTime']>;
  eventId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  keys?: Maybe<Array<Maybe<Scalars['String']>>>;
  modelNames?: Maybe<Scalars['String']>;
  models?: Maybe<Array<Maybe<ModelUnion>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type EntityConnection = {
  __typename?: 'EntityConnection';
  edges?: Maybe<Array<Maybe<EntityEdge>>>;
  totalCount: Scalars['Int'];
};

export type EntityEdge = {
  __typename?: 'EntityEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Entity>;
};

export type Event = {
  __typename?: 'Event';
  createdAt?: Maybe<Scalars['DateTime']>;
  data?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  keys?: Maybe<Scalars['String']>;
  systemCall: SystemCall;
  transactionHash?: Maybe<Scalars['String']>;
};

export type EventConnection = {
  __typename?: 'EventConnection';
  edges?: Maybe<Array<Maybe<EventEdge>>>;
  totalCount: Scalars['Int'];
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Event>;
};

export type Game = {
  __typename?: 'Game';
  creator?: Maybe<Scalars['ContractAddress']>;
  entity?: Maybe<Entity>;
  game_id?: Maybe<Scalars['u32']>;
  game_mode?: Maybe<Scalars['Enum']>;
  is_finished?: Maybe<Scalars['bool']>;
  max_players?: Maybe<Scalars['u32']>;
  max_turns?: Maybe<Scalars['u32']>;
  num_players?: Maybe<Scalars['u32']>;
  start_time?: Maybe<Scalars['u64']>;
};

export type GameConnection = {
  __typename?: 'GameConnection';
  edges?: Maybe<Array<Maybe<GameEdge>>>;
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
  IsFinished = 'IS_FINISHED',
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
  is_finished?: InputMaybe<Scalars['bool']>;
  is_finishedEQ?: InputMaybe<Scalars['bool']>;
  is_finishedGT?: InputMaybe<Scalars['bool']>;
  is_finishedGTE?: InputMaybe<Scalars['bool']>;
  is_finishedLT?: InputMaybe<Scalars['bool']>;
  is_finishedLTE?: InputMaybe<Scalars['bool']>;
  is_finishedNEQ?: InputMaybe<Scalars['bool']>;
  max_players?: InputMaybe<Scalars['u32']>;
  max_playersEQ?: InputMaybe<Scalars['u32']>;
  max_playersGT?: InputMaybe<Scalars['u32']>;
  max_playersGTE?: InputMaybe<Scalars['u32']>;
  max_playersLT?: InputMaybe<Scalars['u32']>;
  max_playersLTE?: InputMaybe<Scalars['u32']>;
  max_playersNEQ?: InputMaybe<Scalars['u32']>;
  max_turns?: InputMaybe<Scalars['u32']>;
  max_turnsEQ?: InputMaybe<Scalars['u32']>;
  max_turnsGT?: InputMaybe<Scalars['u32']>;
  max_turnsGTE?: InputMaybe<Scalars['u32']>;
  max_turnsLT?: InputMaybe<Scalars['u32']>;
  max_turnsLTE?: InputMaybe<Scalars['u32']>;
  max_turnsNEQ?: InputMaybe<Scalars['u32']>;
  num_players?: InputMaybe<Scalars['u32']>;
  num_playersEQ?: InputMaybe<Scalars['u32']>;
  num_playersGT?: InputMaybe<Scalars['u32']>;
  num_playersGTE?: InputMaybe<Scalars['u32']>;
  num_playersLT?: InputMaybe<Scalars['u32']>;
  num_playersLTE?: InputMaybe<Scalars['u32']>;
  num_playersNEQ?: InputMaybe<Scalars['u32']>;
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
  entity?: Maybe<Entity>;
  game_id?: Maybe<Scalars['u32']>;
  item_id?: Maybe<Scalars['Enum']>;
  level?: Maybe<Scalars['u8']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
};

export type ItemConnection = {
  __typename?: 'ItemConnection';
  edges?: Maybe<Array<Maybe<ItemEdge>>>;
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
  PlayerId = 'PLAYER_ID'
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
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
};

export type Market = {
  __typename?: 'Market';
  cash?: Maybe<Scalars['u128']>;
  drug_id?: Maybe<Scalars['Enum']>;
  entity?: Maybe<Entity>;
  game_id?: Maybe<Scalars['u32']>;
  location_id?: Maybe<Scalars['Enum']>;
  quantity?: Maybe<Scalars['u32']>;
};

export type MarketConnection = {
  __typename?: 'MarketConnection';
  edges?: Maybe<Array<Maybe<MarketEdge>>>;
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
  quantity?: InputMaybe<Scalars['u32']>;
  quantityEQ?: InputMaybe<Scalars['u32']>;
  quantityGT?: InputMaybe<Scalars['u32']>;
  quantityGTE?: InputMaybe<Scalars['u32']>;
  quantityLT?: InputMaybe<Scalars['u32']>;
  quantityLTE?: InputMaybe<Scalars['u32']>;
  quantityNEQ?: InputMaybe<Scalars['u32']>;
};

export type Model = {
  __typename?: 'Model';
  classHash?: Maybe<Scalars['felt252']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['felt252']>;
};

export type ModelConnection = {
  __typename?: 'ModelConnection';
  edges?: Maybe<Array<Maybe<ModelEdge>>>;
  totalCount: Scalars['Int'];
};

export type ModelEdge = {
  __typename?: 'ModelEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Model>;
};

export type ModelUnion = Drug | Game | Item | Market | Player | Risks;

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Player = {
  __typename?: 'Player';
  bag_limit?: Maybe<Scalars['u32']>;
  cash?: Maybe<Scalars['u128']>;
  drug_count?: Maybe<Scalars['u32']>;
  entity?: Maybe<Entity>;
  game_id?: Maybe<Scalars['u32']>;
  health?: Maybe<Scalars['u8']>;
  location_id?: Maybe<Scalars['Enum']>;
  name?: Maybe<Scalars['felt252']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  run_attempts?: Maybe<Scalars['u8']>;
  status?: Maybe<Scalars['Enum']>;
  turns_remaining?: Maybe<Scalars['u32']>;
  turns_remaining_on_death?: Maybe<Scalars['u32']>;
};

export type PlayerConnection = {
  __typename?: 'PlayerConnection';
  edges?: Maybe<Array<Maybe<PlayerEdge>>>;
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
  BagLimit = 'BAG_LIMIT',
  Cash = 'CASH',
  DrugCount = 'DRUG_COUNT',
  GameId = 'GAME_ID',
  Health = 'HEALTH',
  LocationId = 'LOCATION_ID',
  Name = 'NAME',
  PlayerId = 'PLAYER_ID',
  RunAttempts = 'RUN_ATTEMPTS',
  Status = 'STATUS',
  TurnsRemaining = 'TURNS_REMAINING',
  TurnsRemainingOnDeath = 'TURNS_REMAINING_ON_DEATH'
}

export type PlayerWhereInput = {
  bag_limit?: InputMaybe<Scalars['u32']>;
  bag_limitEQ?: InputMaybe<Scalars['u32']>;
  bag_limitGT?: InputMaybe<Scalars['u32']>;
  bag_limitGTE?: InputMaybe<Scalars['u32']>;
  bag_limitLT?: InputMaybe<Scalars['u32']>;
  bag_limitLTE?: InputMaybe<Scalars['u32']>;
  bag_limitNEQ?: InputMaybe<Scalars['u32']>;
  cash?: InputMaybe<Scalars['u128']>;
  cashEQ?: InputMaybe<Scalars['u128']>;
  cashGT?: InputMaybe<Scalars['u128']>;
  cashGTE?: InputMaybe<Scalars['u128']>;
  cashLT?: InputMaybe<Scalars['u128']>;
  cashLTE?: InputMaybe<Scalars['u128']>;
  cashNEQ?: InputMaybe<Scalars['u128']>;
  drug_count?: InputMaybe<Scalars['u32']>;
  drug_countEQ?: InputMaybe<Scalars['u32']>;
  drug_countGT?: InputMaybe<Scalars['u32']>;
  drug_countGTE?: InputMaybe<Scalars['u32']>;
  drug_countLT?: InputMaybe<Scalars['u32']>;
  drug_countLTE?: InputMaybe<Scalars['u32']>;
  drug_countNEQ?: InputMaybe<Scalars['u32']>;
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
  location_id?: InputMaybe<Scalars['Enum']>;
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
  run_attempts?: InputMaybe<Scalars['u8']>;
  run_attemptsEQ?: InputMaybe<Scalars['u8']>;
  run_attemptsGT?: InputMaybe<Scalars['u8']>;
  run_attemptsGTE?: InputMaybe<Scalars['u8']>;
  run_attemptsLT?: InputMaybe<Scalars['u8']>;
  run_attemptsLTE?: InputMaybe<Scalars['u8']>;
  run_attemptsNEQ?: InputMaybe<Scalars['u8']>;
  status?: InputMaybe<Scalars['Enum']>;
  turns_remaining?: InputMaybe<Scalars['u32']>;
  turns_remainingEQ?: InputMaybe<Scalars['u32']>;
  turns_remainingGT?: InputMaybe<Scalars['u32']>;
  turns_remainingGTE?: InputMaybe<Scalars['u32']>;
  turns_remainingLT?: InputMaybe<Scalars['u32']>;
  turns_remainingLTE?: InputMaybe<Scalars['u32']>;
  turns_remainingNEQ?: InputMaybe<Scalars['u32']>;
  turns_remaining_on_death?: InputMaybe<Scalars['u32']>;
  turns_remaining_on_deathEQ?: InputMaybe<Scalars['u32']>;
  turns_remaining_on_deathGT?: InputMaybe<Scalars['u32']>;
  turns_remaining_on_deathGTE?: InputMaybe<Scalars['u32']>;
  turns_remaining_on_deathLT?: InputMaybe<Scalars['u32']>;
  turns_remaining_on_deathLTE?: InputMaybe<Scalars['u32']>;
  turns_remaining_on_deathNEQ?: InputMaybe<Scalars['u32']>;
};

export type Query = {
  __typename?: 'Query';
  drugModels?: Maybe<DrugConnection>;
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  event: Event;
  events?: Maybe<EventConnection>;
  gameModels?: Maybe<GameConnection>;
  itemModels?: Maybe<ItemConnection>;
  marketModels?: Maybe<MarketConnection>;
  model: Model;
  models?: Maybe<ModelConnection>;
  playerModels?: Maybe<PlayerConnection>;
  risksModels?: Maybe<RisksConnection>;
  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<SystemCallConnection>;
  systems?: Maybe<SystemConnection>;
};


export type QueryDrugModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<DrugOrder>;
  where?: InputMaybe<DrugWhereInput>;
};


export type QueryEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryEntityArgs = {
  id: Scalars['ID'];
};


export type QueryEventArgs = {
  id: Scalars['ID'];
};


export type QueryGameModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<GameOrder>;
  where?: InputMaybe<GameWhereInput>;
};


export type QueryItemModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ItemOrder>;
  where?: InputMaybe<ItemWhereInput>;
};


export type QueryMarketModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<MarketOrder>;
  where?: InputMaybe<MarketWhereInput>;
};


export type QueryModelArgs = {
  id: Scalars['ID'];
};


export type QueryPlayerModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<PlayerOrder>;
  where?: InputMaybe<PlayerWhereInput>;
};


export type QueryRisksModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<RisksOrder>;
  where?: InputMaybe<RisksWhereInput>;
};


export type QuerySystemArgs = {
  id: Scalars['ID'];
};


export type QuerySystemCallArgs = {
  id: Scalars['Int'];
};

export type Risks = {
  __typename?: 'Risks';
  capture?: Maybe<Scalars['u8']>;
  entity?: Maybe<Entity>;
  game_id?: Maybe<Scalars['u32']>;
  location_id?: Maybe<Scalars['Enum']>;
  travel?: Maybe<Scalars['u8']>;
};

export type RisksConnection = {
  __typename?: 'RisksConnection';
  edges?: Maybe<Array<Maybe<RisksEdge>>>;
  totalCount: Scalars['Int'];
};

export type RisksEdge = {
  __typename?: 'RisksEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Risks>;
};

export type RisksOrder = {
  direction: OrderDirection;
  field: RisksOrderField;
};

export enum RisksOrderField {
  Capture = 'CAPTURE',
  GameId = 'GAME_ID',
  LocationId = 'LOCATION_ID',
  Travel = 'TRAVEL'
}

export type RisksWhereInput = {
  capture?: InputMaybe<Scalars['u8']>;
  captureEQ?: InputMaybe<Scalars['u8']>;
  captureGT?: InputMaybe<Scalars['u8']>;
  captureGTE?: InputMaybe<Scalars['u8']>;
  captureLT?: InputMaybe<Scalars['u8']>;
  captureLTE?: InputMaybe<Scalars['u8']>;
  captureNEQ?: InputMaybe<Scalars['u8']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  location_id?: InputMaybe<Scalars['Enum']>;
  travel?: InputMaybe<Scalars['u8']>;
  travelEQ?: InputMaybe<Scalars['u8']>;
  travelGT?: InputMaybe<Scalars['u8']>;
  travelGTE?: InputMaybe<Scalars['u8']>;
  travelLT?: InputMaybe<Scalars['u8']>;
  travelLTE?: InputMaybe<Scalars['u8']>;
  travelNEQ?: InputMaybe<Scalars['u8']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  entityUpdated: Entity;
  modelRegistered: Model;
};


export type SubscriptionEntityUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type SubscriptionModelRegisteredArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type System = {
  __typename?: 'System';
  classHash?: Maybe<Scalars['felt252']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  systemCalls: Array<SystemCall>;
  transactionHash?: Maybe<Scalars['felt252']>;
};

export type SystemCall = {
  __typename?: 'SystemCall';
  createdAt?: Maybe<Scalars['DateTime']>;
  data?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  system: System;
  systemId?: Maybe<Scalars['ID']>;
  transactionHash?: Maybe<Scalars['String']>;
};

export type SystemCallConnection = {
  __typename?: 'SystemCallConnection';
  edges?: Maybe<Array<Maybe<SystemCallEdge>>>;
  totalCount: Scalars['Int'];
};

export type SystemCallEdge = {
  __typename?: 'SystemCallEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<SystemCall>;
};

export type SystemConnection = {
  __typename?: 'SystemConnection';
  edges?: Maybe<Array<Maybe<SystemEdge>>>;
  totalCount: Scalars['Int'];
};

export type SystemEdge = {
  __typename?: 'SystemEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<System>;
};

export type AvailableGamesQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableGamesQuery = { __typename?: 'Query', gameModels?: { __typename?: 'GameConnection', totalCount: number, edges?: Array<{ __typename?: 'GameEdge', cursor?: any | null, node?: { __typename?: 'Game', creator?: any | null, num_players?: any | null, max_players?: any | null, max_turns?: any | null, start_time?: any | null } | null } | null> | null } | null };

export type GlobalScoresQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  cursor?: InputMaybe<Scalars['Cursor']>;
}>;


export type GlobalScoresQuery = { __typename?: 'Query', playerModels?: { __typename?: 'PlayerConnection', totalCount: number, edges?: Array<{ __typename?: 'PlayerEdge', cursor?: any | null, node?: { __typename?: 'Player', cash?: any | null, health?: any | null, entity?: { __typename?: 'Entity', models?: Array<{ __typename: 'Drug' } | { __typename: 'Game' } | { __typename: 'Item' } | { __typename: 'Market' } | { __typename: 'Player', name?: any | null, player_id?: any | null, game_id?: any | null } | { __typename: 'Risks' } | null> | null } | null } | null } | null> | null } | null };

export type MarketPricesQueryVariables = Exact<{
  gameId?: InputMaybe<Scalars['u32']>;
}>;


export type MarketPricesQuery = { __typename?: 'Query', marketModels?: { __typename?: 'MarketConnection', edges?: Array<{ __typename?: 'MarketEdge', node?: { __typename?: 'Market', drug_id?: any | null, location_id?: any | null, quantity?: any | null, cash?: any | null } | null } | null> | null } | null };

export type GameEntityQueryVariables = Exact<{
  id: Scalars['u32'];
}>;


export type GameEntityQuery = { __typename?: 'Query', gameModels?: { __typename?: 'GameConnection', edges?: Array<{ __typename?: 'GameEdge', node?: { __typename?: 'Game', game_id?: any | null, game_mode?: any | null, creator?: any | null, is_finished?: any | null, max_players?: any | null, max_turns?: any | null, num_players?: any | null, start_time?: any | null } | null } | null> | null } | null };

export type PlayerEntityQueryVariables = Exact<{
  gameId: Scalars['String'];
  playerId: Scalars['String'];
}>;


export type PlayerEntityQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', models?: Array<{ __typename: 'Drug', drug_id?: any | null, quantity?: any | null } | { __typename: 'Game' } | { __typename: 'Item', item_id?: any | null, level?: any | null } | { __typename: 'Market' } | { __typename: 'Player', name?: any | null, cash?: any | null, status?: any | null, health?: any | null, drug_count?: any | null, bag_limit?: any | null, location_id?: any | null, turns_remaining?: any | null, turns_remaining_on_death?: any | null } | { __typename: 'Risks' } | null> | null } | null } | null> | null } | null };

export type LocationEntitiesQueryVariables = Exact<{
  gameId: Scalars['String'];
  locationId: Scalars['String'];
}>;


export type LocationEntitiesQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'EntityEdge', cursor?: any | null, node?: { __typename?: 'Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Drug' } | { __typename: 'Game' } | { __typename: 'Item' } | { __typename: 'Market', cash?: any | null, quantity?: any | null } | { __typename: 'Player' } | { __typename: 'Risks', travel?: any | null, capture?: any | null } | null> | null } | null } | null> | null } | null };


export const AvailableGamesDocument = `
    query AvailableGames {
  gameModels(first: 10) {
    totalCount
    edges {
      node {
        creator
        num_players
        max_players
        max_turns
        start_time
      }
      cursor
    }
  }
}
    `;
export const useAvailableGamesQuery = <
      TData = AvailableGamesQuery,
      TError = unknown
    >(
      variables?: AvailableGamesQueryVariables,
      options?: UseQueryOptions<AvailableGamesQuery, TError, TData>
    ) =>
    useQuery<AvailableGamesQuery, TError, TData>(
      variables === undefined ? ['AvailableGames'] : ['AvailableGames', variables],
      useFetchData<AvailableGamesQuery, AvailableGamesQueryVariables>(AvailableGamesDocument).bind(null, variables),
      options
    );

useAvailableGamesQuery.getKey = (variables?: AvailableGamesQueryVariables) => variables === undefined ? ['AvailableGames'] : ['AvailableGames', variables];
;

export const useInfiniteAvailableGamesQuery = <
      TData = AvailableGamesQuery,
      TError = unknown
    >(
      variables?: AvailableGamesQueryVariables,
      options?: UseInfiniteQueryOptions<AvailableGamesQuery, TError, TData>
    ) =>{
    const query = useFetchData<AvailableGamesQuery, AvailableGamesQueryVariables>(AvailableGamesDocument)
    return useInfiniteQuery<AvailableGamesQuery, TError, TData>(
      variables === undefined ? ['AvailableGames.infinite'] : ['AvailableGames.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteAvailableGamesQuery.getKey = (variables?: AvailableGamesQueryVariables) => variables === undefined ? ['AvailableGames.infinite'] : ['AvailableGames.infinite', variables];
;

export const GlobalScoresDocument = `
    query GlobalScores($limit: Int, $cursor: Cursor) {
  playerModels(
    first: $limit
    after: $cursor
    where: {turns_remaining: 0}
    order: {direction: DESC, field: CASH}
  ) {
    totalCount
    edges {
      node {
        cash
        health
        entity {
          models {
            __typename
            ... on Player {
              name
              player_id
              game_id
            }
          }
        }
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

export const GameEntityDocument = `
    query GameEntity($id: u32!) {
  gameModels(where: {game_id: $id}) {
    edges {
      node {
        game_id
        game_mode
        creator
        is_finished
        max_players
        max_turns
        num_players
        start_time
      }
    }
  }
}
    `;
export const useGameEntityQuery = <
      TData = GameEntityQuery,
      TError = unknown
    >(
      variables: GameEntityQueryVariables,
      options?: UseQueryOptions<GameEntityQuery, TError, TData>
    ) =>
    useQuery<GameEntityQuery, TError, TData>(
      ['GameEntity', variables],
      useFetchData<GameEntityQuery, GameEntityQueryVariables>(GameEntityDocument).bind(null, variables),
      options
    );

useGameEntityQuery.getKey = (variables: GameEntityQueryVariables) => ['GameEntity', variables];
;

export const useInfiniteGameEntityQuery = <
      TData = GameEntityQuery,
      TError = unknown
    >(
      variables: GameEntityQueryVariables,
      options?: UseInfiniteQueryOptions<GameEntityQuery, TError, TData>
    ) =>{
    const query = useFetchData<GameEntityQuery, GameEntityQueryVariables>(GameEntityDocument)
    return useInfiniteQuery<GameEntityQuery, TError, TData>(
      ['GameEntity.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGameEntityQuery.getKey = (variables: GameEntityQueryVariables) => ['GameEntity.infinite', variables];
;

export const PlayerEntityDocument = `
    query PlayerEntity($gameId: String!, $playerId: String!) {
  entities(keys: [$gameId, $playerId]) {
    totalCount
    edges {
      node {
        models {
          __typename
          ... on Player {
            name
            cash
            status
            health
            drug_count
            bag_limit
            location_id
            turns_remaining
            turns_remaining_on_death
          }
          ... on Drug {
            drug_id
            quantity
          }
          ... on Item {
            item_id
            level
          }
        }
      }
    }
  }
}
    `;
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
          }
          ... on Risks {
            travel
            capture
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
