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
  u16: any;
  u32: any;
  u64: any;
  u128: any;
  u256: any;
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

export type Erc20AllowanceModel = {
  __typename?: 'ERC20AllowanceModel';
  amount?: Maybe<Scalars['u256']>;
  entity?: Maybe<World__Entity>;
  owner?: Maybe<Scalars['ContractAddress']>;
  spender?: Maybe<Scalars['ContractAddress']>;
  token?: Maybe<Scalars['ContractAddress']>;
};

export type Erc20AllowanceModelConnection = {
  __typename?: 'ERC20AllowanceModelConnection';
  edges?: Maybe<Array<Maybe<Erc20AllowanceModelEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Erc20AllowanceModelEdge = {
  __typename?: 'ERC20AllowanceModelEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Erc20AllowanceModel>;
};

export type Erc20AllowanceModelOrder = {
  direction: OrderDirection;
  field: Erc20AllowanceModelOrderField;
};

export enum Erc20AllowanceModelOrderField {
  Amount = 'AMOUNT',
  Owner = 'OWNER',
  Spender = 'SPENDER',
  Token = 'TOKEN'
}

export type Erc20AllowanceModelWhereInput = {
  amount?: InputMaybe<Scalars['u256']>;
  amountEQ?: InputMaybe<Scalars['u256']>;
  amountGT?: InputMaybe<Scalars['u256']>;
  amountGTE?: InputMaybe<Scalars['u256']>;
  amountLT?: InputMaybe<Scalars['u256']>;
  amountLTE?: InputMaybe<Scalars['u256']>;
  amountNEQ?: InputMaybe<Scalars['u256']>;
  owner?: InputMaybe<Scalars['ContractAddress']>;
  ownerEQ?: InputMaybe<Scalars['ContractAddress']>;
  ownerGT?: InputMaybe<Scalars['ContractAddress']>;
  ownerGTE?: InputMaybe<Scalars['ContractAddress']>;
  ownerLT?: InputMaybe<Scalars['ContractAddress']>;
  ownerLTE?: InputMaybe<Scalars['ContractAddress']>;
  ownerNEQ?: InputMaybe<Scalars['ContractAddress']>;
  spender?: InputMaybe<Scalars['ContractAddress']>;
  spenderEQ?: InputMaybe<Scalars['ContractAddress']>;
  spenderGT?: InputMaybe<Scalars['ContractAddress']>;
  spenderGTE?: InputMaybe<Scalars['ContractAddress']>;
  spenderLT?: InputMaybe<Scalars['ContractAddress']>;
  spenderLTE?: InputMaybe<Scalars['ContractAddress']>;
  spenderNEQ?: InputMaybe<Scalars['ContractAddress']>;
  token?: InputMaybe<Scalars['ContractAddress']>;
  tokenEQ?: InputMaybe<Scalars['ContractAddress']>;
  tokenGT?: InputMaybe<Scalars['ContractAddress']>;
  tokenGTE?: InputMaybe<Scalars['ContractAddress']>;
  tokenLT?: InputMaybe<Scalars['ContractAddress']>;
  tokenLTE?: InputMaybe<Scalars['ContractAddress']>;
  tokenNEQ?: InputMaybe<Scalars['ContractAddress']>;
};

export type Erc20BalanceModel = {
  __typename?: 'ERC20BalanceModel';
  account?: Maybe<Scalars['ContractAddress']>;
  amount?: Maybe<Scalars['u256']>;
  entity?: Maybe<World__Entity>;
  token?: Maybe<Scalars['ContractAddress']>;
};

export type Erc20BalanceModelConnection = {
  __typename?: 'ERC20BalanceModelConnection';
  edges?: Maybe<Array<Maybe<Erc20BalanceModelEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Erc20BalanceModelEdge = {
  __typename?: 'ERC20BalanceModelEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Erc20BalanceModel>;
};

export type Erc20BalanceModelOrder = {
  direction: OrderDirection;
  field: Erc20BalanceModelOrderField;
};

export enum Erc20BalanceModelOrderField {
  Account = 'ACCOUNT',
  Amount = 'AMOUNT',
  Token = 'TOKEN'
}

export type Erc20BalanceModelWhereInput = {
  account?: InputMaybe<Scalars['ContractAddress']>;
  accountEQ?: InputMaybe<Scalars['ContractAddress']>;
  accountGT?: InputMaybe<Scalars['ContractAddress']>;
  accountGTE?: InputMaybe<Scalars['ContractAddress']>;
  accountLT?: InputMaybe<Scalars['ContractAddress']>;
  accountLTE?: InputMaybe<Scalars['ContractAddress']>;
  accountNEQ?: InputMaybe<Scalars['ContractAddress']>;
  amount?: InputMaybe<Scalars['u256']>;
  amountEQ?: InputMaybe<Scalars['u256']>;
  amountGT?: InputMaybe<Scalars['u256']>;
  amountGTE?: InputMaybe<Scalars['u256']>;
  amountLT?: InputMaybe<Scalars['u256']>;
  amountLTE?: InputMaybe<Scalars['u256']>;
  amountNEQ?: InputMaybe<Scalars['u256']>;
  token?: InputMaybe<Scalars['ContractAddress']>;
  tokenEQ?: InputMaybe<Scalars['ContractAddress']>;
  tokenGT?: InputMaybe<Scalars['ContractAddress']>;
  tokenGTE?: InputMaybe<Scalars['ContractAddress']>;
  tokenLT?: InputMaybe<Scalars['ContractAddress']>;
  tokenLTE?: InputMaybe<Scalars['ContractAddress']>;
  tokenNEQ?: InputMaybe<Scalars['ContractAddress']>;
};

export type Erc20MetadataModel = {
  __typename?: 'ERC20MetadataModel';
  decimals?: Maybe<Scalars['u8']>;
  entity?: Maybe<World__Entity>;
  name?: Maybe<Scalars['felt252']>;
  symbol?: Maybe<Scalars['felt252']>;
  token?: Maybe<Scalars['ContractAddress']>;
  total_supply?: Maybe<Scalars['u256']>;
};

export type Erc20MetadataModelConnection = {
  __typename?: 'ERC20MetadataModelConnection';
  edges?: Maybe<Array<Maybe<Erc20MetadataModelEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Erc20MetadataModelEdge = {
  __typename?: 'ERC20MetadataModelEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Erc20MetadataModel>;
};

export type Erc20MetadataModelOrder = {
  direction: OrderDirection;
  field: Erc20MetadataModelOrderField;
};

export enum Erc20MetadataModelOrderField {
  Decimals = 'DECIMALS',
  Name = 'NAME',
  Symbol = 'SYMBOL',
  Token = 'TOKEN',
  TotalSupply = 'TOTAL_SUPPLY'
}

export type Erc20MetadataModelWhereInput = {
  decimals?: InputMaybe<Scalars['u8']>;
  decimalsEQ?: InputMaybe<Scalars['u8']>;
  decimalsGT?: InputMaybe<Scalars['u8']>;
  decimalsGTE?: InputMaybe<Scalars['u8']>;
  decimalsLT?: InputMaybe<Scalars['u8']>;
  decimalsLTE?: InputMaybe<Scalars['u8']>;
  decimalsNEQ?: InputMaybe<Scalars['u8']>;
  name?: InputMaybe<Scalars['felt252']>;
  nameEQ?: InputMaybe<Scalars['felt252']>;
  nameGT?: InputMaybe<Scalars['felt252']>;
  nameGTE?: InputMaybe<Scalars['felt252']>;
  nameLT?: InputMaybe<Scalars['felt252']>;
  nameLTE?: InputMaybe<Scalars['felt252']>;
  nameNEQ?: InputMaybe<Scalars['felt252']>;
  symbol?: InputMaybe<Scalars['felt252']>;
  symbolEQ?: InputMaybe<Scalars['felt252']>;
  symbolGT?: InputMaybe<Scalars['felt252']>;
  symbolGTE?: InputMaybe<Scalars['felt252']>;
  symbolLT?: InputMaybe<Scalars['felt252']>;
  symbolLTE?: InputMaybe<Scalars['felt252']>;
  symbolNEQ?: InputMaybe<Scalars['felt252']>;
  token?: InputMaybe<Scalars['ContractAddress']>;
  tokenEQ?: InputMaybe<Scalars['ContractAddress']>;
  tokenGT?: InputMaybe<Scalars['ContractAddress']>;
  tokenGTE?: InputMaybe<Scalars['ContractAddress']>;
  tokenLT?: InputMaybe<Scalars['ContractAddress']>;
  tokenLTE?: InputMaybe<Scalars['ContractAddress']>;
  tokenNEQ?: InputMaybe<Scalars['ContractAddress']>;
  total_supply?: InputMaybe<Scalars['u256']>;
  total_supplyEQ?: InputMaybe<Scalars['u256']>;
  total_supplyGT?: InputMaybe<Scalars['u256']>;
  total_supplyGTE?: InputMaybe<Scalars['u256']>;
  total_supplyLT?: InputMaybe<Scalars['u256']>;
  total_supplyLTE?: InputMaybe<Scalars['u256']>;
  total_supplyNEQ?: InputMaybe<Scalars['u256']>;
};

export type Game = {
  __typename?: 'Game';
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['u32']>;
  game_mode?: Maybe<Scalars['Enum']>;
  game_over?: Maybe<Scalars['bool']>;
  hustler_id?: Maybe<Scalars['u16']>;
  leaderboard_version?: Maybe<Scalars['u16']>;
  max_rounds?: Maybe<Scalars['u8']>;
  max_turns?: Maybe<Scalars['u8']>;
  max_wanted_shopping?: Maybe<Scalars['u8']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  player_name?: Maybe<Scalars['u128']>;
};

export type GameConfig = {
  __typename?: 'GameConfig';
  cash?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  health?: Maybe<Scalars['u8']>;
  key?: Maybe<Scalars['u8']>;
  max_rounds?: Maybe<Scalars['u8']>;
  max_turns?: Maybe<Scalars['u8']>;
  max_wanted_shopping?: Maybe<Scalars['u8']>;
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
  MaxRounds = 'MAX_ROUNDS',
  MaxTurns = 'MAX_TURNS',
  MaxWantedShopping = 'MAX_WANTED_SHOPPING'
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
  max_rounds?: InputMaybe<Scalars['u8']>;
  max_roundsEQ?: InputMaybe<Scalars['u8']>;
  max_roundsGT?: InputMaybe<Scalars['u8']>;
  max_roundsGTE?: InputMaybe<Scalars['u8']>;
  max_roundsLT?: InputMaybe<Scalars['u8']>;
  max_roundsLTE?: InputMaybe<Scalars['u8']>;
  max_roundsNEQ?: InputMaybe<Scalars['u8']>;
  max_turns?: InputMaybe<Scalars['u8']>;
  max_turnsEQ?: InputMaybe<Scalars['u8']>;
  max_turnsGT?: InputMaybe<Scalars['u8']>;
  max_turnsGTE?: InputMaybe<Scalars['u8']>;
  max_turnsLT?: InputMaybe<Scalars['u8']>;
  max_turnsLTE?: InputMaybe<Scalars['u8']>;
  max_turnsNEQ?: InputMaybe<Scalars['u8']>;
  max_wanted_shopping?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingEQ?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingGT?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingGTE?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingLT?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingLTE?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingNEQ?: InputMaybe<Scalars['u8']>;
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
  GameOver = 'GAME_OVER',
  HustlerId = 'HUSTLER_ID',
  LeaderboardVersion = 'LEADERBOARD_VERSION',
  MaxRounds = 'MAX_ROUNDS',
  MaxTurns = 'MAX_TURNS',
  MaxWantedShopping = 'MAX_WANTED_SHOPPING',
  PlayerId = 'PLAYER_ID',
  PlayerName = 'PLAYER_NAME'
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
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_mode?: InputMaybe<Scalars['Enum']>;
  game_over?: InputMaybe<Scalars['bool']>;
  hustler_id?: InputMaybe<Scalars['u16']>;
  hustler_idEQ?: InputMaybe<Scalars['u16']>;
  hustler_idGT?: InputMaybe<Scalars['u16']>;
  hustler_idGTE?: InputMaybe<Scalars['u16']>;
  hustler_idLT?: InputMaybe<Scalars['u16']>;
  hustler_idLTE?: InputMaybe<Scalars['u16']>;
  hustler_idNEQ?: InputMaybe<Scalars['u16']>;
  leaderboard_version?: InputMaybe<Scalars['u16']>;
  leaderboard_versionEQ?: InputMaybe<Scalars['u16']>;
  leaderboard_versionGT?: InputMaybe<Scalars['u16']>;
  leaderboard_versionGTE?: InputMaybe<Scalars['u16']>;
  leaderboard_versionLT?: InputMaybe<Scalars['u16']>;
  leaderboard_versionLTE?: InputMaybe<Scalars['u16']>;
  leaderboard_versionNEQ?: InputMaybe<Scalars['u16']>;
  max_rounds?: InputMaybe<Scalars['u8']>;
  max_roundsEQ?: InputMaybe<Scalars['u8']>;
  max_roundsGT?: InputMaybe<Scalars['u8']>;
  max_roundsGTE?: InputMaybe<Scalars['u8']>;
  max_roundsLT?: InputMaybe<Scalars['u8']>;
  max_roundsLTE?: InputMaybe<Scalars['u8']>;
  max_roundsNEQ?: InputMaybe<Scalars['u8']>;
  max_turns?: InputMaybe<Scalars['u8']>;
  max_turnsEQ?: InputMaybe<Scalars['u8']>;
  max_turnsGT?: InputMaybe<Scalars['u8']>;
  max_turnsGTE?: InputMaybe<Scalars['u8']>;
  max_turnsLT?: InputMaybe<Scalars['u8']>;
  max_turnsLTE?: InputMaybe<Scalars['u8']>;
  max_turnsNEQ?: InputMaybe<Scalars['u8']>;
  max_wanted_shopping?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingEQ?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingGT?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingGTE?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingLT?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingLTE?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingNEQ?: InputMaybe<Scalars['u8']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_name?: InputMaybe<Scalars['u128']>;
  player_nameEQ?: InputMaybe<Scalars['u128']>;
  player_nameGT?: InputMaybe<Scalars['u128']>;
  player_nameGTE?: InputMaybe<Scalars['u128']>;
  player_nameLT?: InputMaybe<Scalars['u128']>;
  player_nameLTE?: InputMaybe<Scalars['u128']>;
  player_nameNEQ?: InputMaybe<Scalars['u128']>;
};

export type HustlerItemBaseConfig = {
  __typename?: 'HustlerItemBaseConfig';
  entity?: Maybe<World__Entity>;
  id?: Maybe<Scalars['u32']>;
  initial_tier?: Maybe<Scalars['u8']>;
  name?: Maybe<Scalars['felt252']>;
  slot?: Maybe<Scalars['Enum']>;
  slot_id?: Maybe<Scalars['u8']>;
};

export type HustlerItemBaseConfigConnection = {
  __typename?: 'HustlerItemBaseConfigConnection';
  edges?: Maybe<Array<Maybe<HustlerItemBaseConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type HustlerItemBaseConfigEdge = {
  __typename?: 'HustlerItemBaseConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<HustlerItemBaseConfig>;
};

export type HustlerItemBaseConfigOrder = {
  direction: OrderDirection;
  field: HustlerItemBaseConfigOrderField;
};

export enum HustlerItemBaseConfigOrderField {
  Id = 'ID',
  InitialTier = 'INITIAL_TIER',
  Name = 'NAME',
  Slot = 'SLOT',
  SlotId = 'SLOT_ID'
}

export type HustlerItemBaseConfigWhereInput = {
  id?: InputMaybe<Scalars['u32']>;
  idEQ?: InputMaybe<Scalars['u32']>;
  idGT?: InputMaybe<Scalars['u32']>;
  idGTE?: InputMaybe<Scalars['u32']>;
  idLT?: InputMaybe<Scalars['u32']>;
  idLTE?: InputMaybe<Scalars['u32']>;
  idNEQ?: InputMaybe<Scalars['u32']>;
  initial_tier?: InputMaybe<Scalars['u8']>;
  initial_tierEQ?: InputMaybe<Scalars['u8']>;
  initial_tierGT?: InputMaybe<Scalars['u8']>;
  initial_tierGTE?: InputMaybe<Scalars['u8']>;
  initial_tierLT?: InputMaybe<Scalars['u8']>;
  initial_tierLTE?: InputMaybe<Scalars['u8']>;
  initial_tierNEQ?: InputMaybe<Scalars['u8']>;
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

export type HustlerItemTiersConfig = {
  __typename?: 'HustlerItemTiersConfig';
  cost?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  slot?: Maybe<Scalars['Enum']>;
  slot_id?: Maybe<Scalars['u8']>;
  stat?: Maybe<Scalars['u32']>;
  tier?: Maybe<Scalars['u8']>;
};

export type HustlerItemTiersConfigConnection = {
  __typename?: 'HustlerItemTiersConfigConnection';
  edges?: Maybe<Array<Maybe<HustlerItemTiersConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type HustlerItemTiersConfigEdge = {
  __typename?: 'HustlerItemTiersConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<HustlerItemTiersConfig>;
};

export type HustlerItemTiersConfigOrder = {
  direction: OrderDirection;
  field: HustlerItemTiersConfigOrderField;
};

export enum HustlerItemTiersConfigOrderField {
  Cost = 'COST',
  Slot = 'SLOT',
  SlotId = 'SLOT_ID',
  Stat = 'STAT',
  Tier = 'TIER'
}

export type HustlerItemTiersConfigWhereInput = {
  cost?: InputMaybe<Scalars['u32']>;
  costEQ?: InputMaybe<Scalars['u32']>;
  costGT?: InputMaybe<Scalars['u32']>;
  costGTE?: InputMaybe<Scalars['u32']>;
  costLT?: InputMaybe<Scalars['u32']>;
  costLTE?: InputMaybe<Scalars['u32']>;
  costNEQ?: InputMaybe<Scalars['u32']>;
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
  tier?: InputMaybe<Scalars['u8']>;
  tierEQ?: InputMaybe<Scalars['u8']>;
  tierGT?: InputMaybe<Scalars['u8']>;
  tierGTE?: InputMaybe<Scalars['u8']>;
  tierLT?: InputMaybe<Scalars['u8']>;
  tierLTE?: InputMaybe<Scalars['u8']>;
  tierNEQ?: InputMaybe<Scalars['u8']>;
};

export type InitializableModel = {
  __typename?: 'InitializableModel';
  entity?: Maybe<World__Entity>;
  initialized?: Maybe<Scalars['bool']>;
  token?: Maybe<Scalars['ContractAddress']>;
};

export type InitializableModelConnection = {
  __typename?: 'InitializableModelConnection';
  edges?: Maybe<Array<Maybe<InitializableModelEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type InitializableModelEdge = {
  __typename?: 'InitializableModelEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<InitializableModel>;
};

export type InitializableModelOrder = {
  direction: OrderDirection;
  field: InitializableModelOrderField;
};

export enum InitializableModelOrderField {
  Initialized = 'INITIALIZED',
  Token = 'TOKEN'
}

export type InitializableModelWhereInput = {
  initialized?: InputMaybe<Scalars['bool']>;
  token?: InputMaybe<Scalars['ContractAddress']>;
  tokenEQ?: InputMaybe<Scalars['ContractAddress']>;
  tokenGT?: InputMaybe<Scalars['ContractAddress']>;
  tokenGTE?: InputMaybe<Scalars['ContractAddress']>;
  tokenLT?: InputMaybe<Scalars['ContractAddress']>;
  tokenLTE?: InputMaybe<Scalars['ContractAddress']>;
  tokenNEQ?: InputMaybe<Scalars['ContractAddress']>;
};

export type Leaderboard = {
  __typename?: 'Leaderboard';
  claimed?: Maybe<Scalars['bool']>;
  entity?: Maybe<World__Entity>;
  high_score?: Maybe<Scalars['u32']>;
  next_version_timestamp?: Maybe<Scalars['u64']>;
  paper_balance?: Maybe<Scalars['u256']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  version?: Maybe<Scalars['u16']>;
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
  Claimed = 'CLAIMED',
  HighScore = 'HIGH_SCORE',
  NextVersionTimestamp = 'NEXT_VERSION_TIMESTAMP',
  PaperBalance = 'PAPER_BALANCE',
  PlayerId = 'PLAYER_ID',
  Version = 'VERSION'
}

export type LeaderboardWhereInput = {
  claimed?: InputMaybe<Scalars['bool']>;
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
  paper_balance?: InputMaybe<Scalars['u256']>;
  paper_balanceEQ?: InputMaybe<Scalars['u256']>;
  paper_balanceGT?: InputMaybe<Scalars['u256']>;
  paper_balanceGTE?: InputMaybe<Scalars['u256']>;
  paper_balanceLT?: InputMaybe<Scalars['u256']>;
  paper_balanceLTE?: InputMaybe<Scalars['u256']>;
  paper_balanceNEQ?: InputMaybe<Scalars['u256']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  version?: InputMaybe<Scalars['u16']>;
  versionEQ?: InputMaybe<Scalars['u16']>;
  versionGT?: InputMaybe<Scalars['u16']>;
  versionGTE?: InputMaybe<Scalars['u16']>;
  versionLT?: InputMaybe<Scalars['u16']>;
  versionLTE?: InputMaybe<Scalars['u16']>;
  versionNEQ?: InputMaybe<Scalars['u16']>;
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

export type ModelUnion = DrugConfig | DrugConfigMeta | Erc20AllowanceModel | Erc20BalanceModel | Erc20MetadataModel | Game | GameConfig | GameStorePacked | HustlerItemBaseConfig | HustlerItemTiersConfig | InitializableModel | Leaderboard | LocationConfig | LocationConfigMeta | RyoConfig;

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type RyoConfig = {
  __typename?: 'RyoConfig';
  entity?: Maybe<World__Entity>;
  initialized?: Maybe<Scalars['bool']>;
  key?: Maybe<Scalars['u8']>;
  leaderboard_version?: Maybe<Scalars['u16']>;
  paper_address?: Maybe<Scalars['ContractAddress']>;
  paper_fee?: Maybe<Scalars['u16']>;
  paused?: Maybe<Scalars['bool']>;
};

export type RyoConfigConnection = {
  __typename?: 'RyoConfigConnection';
  edges?: Maybe<Array<Maybe<RyoConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type RyoConfigEdge = {
  __typename?: 'RyoConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<RyoConfig>;
};

export type RyoConfigOrder = {
  direction: OrderDirection;
  field: RyoConfigOrderField;
};

export enum RyoConfigOrderField {
  Initialized = 'INITIALIZED',
  Key = 'KEY',
  LeaderboardVersion = 'LEADERBOARD_VERSION',
  PaperAddress = 'PAPER_ADDRESS',
  PaperFee = 'PAPER_FEE',
  Paused = 'PAUSED'
}

export type RyoConfigWhereInput = {
  initialized?: InputMaybe<Scalars['bool']>;
  key?: InputMaybe<Scalars['u8']>;
  keyEQ?: InputMaybe<Scalars['u8']>;
  keyGT?: InputMaybe<Scalars['u8']>;
  keyGTE?: InputMaybe<Scalars['u8']>;
  keyLT?: InputMaybe<Scalars['u8']>;
  keyLTE?: InputMaybe<Scalars['u8']>;
  keyNEQ?: InputMaybe<Scalars['u8']>;
  leaderboard_version?: InputMaybe<Scalars['u16']>;
  leaderboard_versionEQ?: InputMaybe<Scalars['u16']>;
  leaderboard_versionGT?: InputMaybe<Scalars['u16']>;
  leaderboard_versionGTE?: InputMaybe<Scalars['u16']>;
  leaderboard_versionLT?: InputMaybe<Scalars['u16']>;
  leaderboard_versionLTE?: InputMaybe<Scalars['u16']>;
  leaderboard_versionNEQ?: InputMaybe<Scalars['u16']>;
  paper_address?: InputMaybe<Scalars['ContractAddress']>;
  paper_addressEQ?: InputMaybe<Scalars['ContractAddress']>;
  paper_addressGT?: InputMaybe<Scalars['ContractAddress']>;
  paper_addressGTE?: InputMaybe<Scalars['ContractAddress']>;
  paper_addressLT?: InputMaybe<Scalars['ContractAddress']>;
  paper_addressLTE?: InputMaybe<Scalars['ContractAddress']>;
  paper_addressNEQ?: InputMaybe<Scalars['ContractAddress']>;
  paper_fee?: InputMaybe<Scalars['u16']>;
  paper_feeEQ?: InputMaybe<Scalars['u16']>;
  paper_feeGT?: InputMaybe<Scalars['u16']>;
  paper_feeGTE?: InputMaybe<Scalars['u16']>;
  paper_feeLT?: InputMaybe<Scalars['u16']>;
  paper_feeLTE?: InputMaybe<Scalars['u16']>;
  paper_feeNEQ?: InputMaybe<Scalars['u16']>;
  paused?: InputMaybe<Scalars['bool']>;
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
  contractAddress?: Maybe<Scalars['felt252']>;
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
  erc20AllowanceModelModels?: Maybe<Erc20AllowanceModelConnection>;
  erc20BalanceModelModels?: Maybe<Erc20BalanceModelConnection>;
  erc20MetadataModelModels?: Maybe<Erc20MetadataModelConnection>;
  events?: Maybe<World__EventConnection>;
  gameConfigModels?: Maybe<GameConfigConnection>;
  gameModels?: Maybe<GameConnection>;
  gameStorePackedModels?: Maybe<GameStorePackedConnection>;
  hustlerItemBaseConfigModels?: Maybe<HustlerItemBaseConfigConnection>;
  hustlerItemTiersConfigModels?: Maybe<HustlerItemTiersConfigConnection>;
  initializableModelModels?: Maybe<InitializableModelConnection>;
  leaderboardModels?: Maybe<LeaderboardConnection>;
  locationConfigMetaModels?: Maybe<LocationConfigMetaConnection>;
  locationConfigModels?: Maybe<LocationConfigConnection>;
  metadatas?: Maybe<World__MetadataConnection>;
  model: World__Model;
  models?: Maybe<World__ModelConnection>;
  ryoConfigModels?: Maybe<RyoConfigConnection>;
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


export type World__QueryErc20AllowanceModelModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Erc20AllowanceModelOrder>;
  where?: InputMaybe<Erc20AllowanceModelWhereInput>;
};


export type World__QueryErc20BalanceModelModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Erc20BalanceModelOrder>;
  where?: InputMaybe<Erc20BalanceModelWhereInput>;
};


export type World__QueryErc20MetadataModelModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Erc20MetadataModelOrder>;
  where?: InputMaybe<Erc20MetadataModelWhereInput>;
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


export type World__QueryHustlerItemBaseConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<HustlerItemBaseConfigOrder>;
  where?: InputMaybe<HustlerItemBaseConfigWhereInput>;
};


export type World__QueryHustlerItemTiersConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<HustlerItemTiersConfigOrder>;
  where?: InputMaybe<HustlerItemTiersConfigWhereInput>;
};


export type World__QueryInitializableModelModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<InitializableModelOrder>;
  where?: InputMaybe<InitializableModelWhereInput>;
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


export type World__QueryRyoConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<RyoConfigOrder>;
  where?: InputMaybe<RyoConfigWhereInput>;
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

export type ConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type ConfigQuery = { __typename?: 'World__Query', ryoConfigModels?: { __typename?: 'RyoConfigConnection', edges?: Array<{ __typename?: 'RyoConfigEdge', node?: { __typename?: 'RyoConfig', key?: any | null, initialized?: any | null, paused?: any | null, leaderboard_version?: any | null, paper_address?: any | null, paper_fee?: any | null } | null } | null> | null } | null, drugConfigModels?: { __typename?: 'DrugConfigConnection', edges?: Array<{ __typename?: 'DrugConfigEdge', node?: { __typename?: 'DrugConfig', drug?: any | null, drug_id?: any | null, base?: any | null, step?: any | null, weight?: any | null, from_turn?: any | null, to_turn?: any | null } | null } | null> | null } | null, drugConfigMetaModels?: { __typename?: 'DrugConfigMetaConnection', edges?: Array<{ __typename?: 'DrugConfigMetaEdge', node?: { __typename?: 'DrugConfigMeta', drug?: any | null, name?: any | null } | null } | null> | null } | null, locationConfigModels?: { __typename?: 'LocationConfigConnection', edges?: Array<{ __typename?: 'LocationConfigEdge', node?: { __typename?: 'LocationConfig', location?: any | null, location_id?: any | null } | null } | null> | null } | null, locationConfigMetaModels?: { __typename?: 'LocationConfigMetaConnection', edges?: Array<{ __typename?: 'LocationConfigMetaEdge', node?: { __typename?: 'LocationConfigMeta', location?: any | null, name?: any | null } | null } | null> | null } | null, hustlerItemBaseConfigModels?: { __typename?: 'HustlerItemBaseConfigConnection', edges?: Array<{ __typename?: 'HustlerItemBaseConfigEdge', node?: { __typename?: 'HustlerItemBaseConfig', slot?: any | null, id?: any | null, slot_id?: any | null, name?: any | null, initial_tier?: any | null } | null } | null> | null } | null, hustlerItemTiersConfigModels?: { __typename?: 'HustlerItemTiersConfigConnection', edges?: Array<{ __typename?: 'HustlerItemTiersConfigEdge', node?: { __typename?: 'HustlerItemTiersConfig', slot?: any | null, slot_id?: any | null, tier?: any | null, cost?: any | null, stat?: any | null } | null } | null> | null } | null };

export type GameEventsQueryVariables = Exact<{
  gameId: Scalars['String'];
}>;


export type GameEventsQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null, createdAt?: any | null } | null } | null> | null } | null };

export type GameEventsSubscriptionSubscriptionVariables = Exact<{
  gameId?: InputMaybe<Scalars['String']>;
}>;


export type GameEventsSubscriptionSubscription = { __typename?: 'World__Subscription', eventEmitted: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null, createdAt?: any | null } };

export type GameByIdQueryVariables = Exact<{
  gameId?: InputMaybe<Scalars['u32']>;
}>;


export type GameByIdQuery = { __typename?: 'World__Query', gameModels?: { __typename?: 'GameConnection', edges?: Array<{ __typename?: 'GameEdge', node?: { __typename?: 'Game', game_id?: any | null, game_mode?: any | null, max_turns?: any | null, max_wanted_shopping?: any | null, hustler_id?: any | null, game_over?: any | null } | null } | null> | null } | null };

export type GameStorePackedQueryVariables = Exact<{
  gameId: Scalars['String'];
  playerId: Scalars['String'];
}>;


export type GameStorePackedQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', id?: string | null, models?: Array<{ __typename: 'DrugConfig' } | { __typename: 'DrugConfigMeta' } | { __typename: 'ERC20AllowanceModel' } | { __typename: 'ERC20BalanceModel' } | { __typename: 'ERC20MetadataModel' } | { __typename: 'Game' } | { __typename: 'GameConfig' } | { __typename: 'GameStorePacked', game_id?: any | null, player_id?: any | null, packed?: any | null } | { __typename: 'HustlerItemBaseConfig' } | { __typename: 'HustlerItemTiersConfig' } | { __typename: 'InitializableModel' } | { __typename: 'Leaderboard' } | { __typename: 'LocationConfig' } | { __typename: 'LocationConfigMeta' } | { __typename: 'RyoConfig' } | null> | null } | null } | null> | null } | null };

export type GameStorePackedSubscriptionSubscriptionVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type GameStorePackedSubscriptionSubscription = { __typename?: 'World__Subscription', entityUpdated: { __typename?: 'World__Entity', id?: string | null, keys?: Array<string | null> | null, models?: Array<{ __typename: 'DrugConfig' } | { __typename: 'DrugConfigMeta' } | { __typename: 'ERC20AllowanceModel' } | { __typename: 'ERC20BalanceModel' } | { __typename: 'ERC20MetadataModel' } | { __typename: 'Game' } | { __typename: 'GameConfig' } | { __typename: 'GameStorePacked', game_id?: any | null, player_id?: any | null, packed?: any | null } | { __typename: 'HustlerItemBaseConfig' } | { __typename: 'HustlerItemTiersConfig' } | { __typename: 'InitializableModel' } | { __typename: 'Leaderboard' } | { __typename: 'LocationConfig' } | { __typename: 'LocationConfigMeta' } | { __typename: 'RyoConfig' } | null> | null } };

export type LeaderboardsQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u16']>;
}>;


export type LeaderboardsQuery = { __typename?: 'World__Query', leaderboardModels?: { __typename?: 'LeaderboardConnection', edges?: Array<{ __typename?: 'LeaderboardEdge', node?: { __typename?: 'Leaderboard', version?: any | null, player_id?: any | null, high_score?: any | null, next_version_timestamp?: any | null, paper_balance?: any | null, claimed?: any | null } | null } | null> | null } | null };

export type GameOverEventsQueryVariables = Exact<{
  gameOverSelector?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['String']>;
}>;


export type GameOverEventsQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null, createdAt?: any | null } | null } | null> | null } | null };


export const ConfigDocument = `
    query Config {
  ryoConfigModels(limit: 1) {
    edges {
      node {
        key
        initialized
        paused
        leaderboard_version
        paper_address
        paper_fee
      }
    }
  }
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
  hustlerItemBaseConfigModels {
    edges {
      node {
        slot
        id
        slot_id
        name
        initial_tier
      }
    }
  }
  hustlerItemTiersConfigModels(limit: 24) {
    edges {
      node {
        slot
        slot_id
        tier
        cost
        stat
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

export const GameEventsDocument = `
    query GameEvents($gameId: String!) {
  events(last: 1000, keys: ["*", $gameId]) {
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
export const useGameEventsQuery = <
      TData = GameEventsQuery,
      TError = unknown
    >(
      variables: GameEventsQueryVariables,
      options?: UseQueryOptions<GameEventsQuery, TError, TData>
    ) =>
    useQuery<GameEventsQuery, TError, TData>(
      ['GameEvents', variables],
      useFetchData<GameEventsQuery, GameEventsQueryVariables>(GameEventsDocument).bind(null, variables),
      options
    );

useGameEventsQuery.getKey = (variables: GameEventsQueryVariables) => ['GameEvents', variables];
;

export const useInfiniteGameEventsQuery = <
      TData = GameEventsQuery,
      TError = unknown
    >(
      variables: GameEventsQueryVariables,
      options?: UseInfiniteQueryOptions<GameEventsQuery, TError, TData>
    ) =>{
    const query = useFetchData<GameEventsQuery, GameEventsQueryVariables>(GameEventsDocument)
    return useInfiniteQuery<GameEventsQuery, TError, TData>(
      ['GameEvents.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGameEventsQuery.getKey = (variables: GameEventsQueryVariables) => ['GameEvents.infinite', variables];
;

export const GameEventsSubscriptionDocument = `
    subscription GameEventsSubscription($gameId: String) {
  eventEmitted(keys: ["*", $gameId]) {
    id
    keys
    data
    createdAt
  }
}
    `;
export const GameByIdDocument = `
    query GameById($gameId: u32) {
  gameModels(where: {game_id: $gameId}) {
    edges {
      node {
        game_id
        game_mode
        max_turns
        max_wanted_shopping
        hustler_id
        game_over
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
export const LeaderboardsDocument = `
    query Leaderboards($version: u16) {
  leaderboardModels(where: {version: $version}) {
    edges {
      node {
        version
        player_id
        high_score
        next_version_timestamp
        paper_balance
        claimed
      }
    }
  }
}
    `;
export const useLeaderboardsQuery = <
      TData = LeaderboardsQuery,
      TError = unknown
    >(
      variables?: LeaderboardsQueryVariables,
      options?: UseQueryOptions<LeaderboardsQuery, TError, TData>
    ) =>
    useQuery<LeaderboardsQuery, TError, TData>(
      variables === undefined ? ['Leaderboards'] : ['Leaderboards', variables],
      useFetchData<LeaderboardsQuery, LeaderboardsQueryVariables>(LeaderboardsDocument).bind(null, variables),
      options
    );

useLeaderboardsQuery.getKey = (variables?: LeaderboardsQueryVariables) => variables === undefined ? ['Leaderboards'] : ['Leaderboards', variables];
;

export const useInfiniteLeaderboardsQuery = <
      TData = LeaderboardsQuery,
      TError = unknown
    >(
      variables?: LeaderboardsQueryVariables,
      options?: UseInfiniteQueryOptions<LeaderboardsQuery, TError, TData>
    ) =>{
    const query = useFetchData<LeaderboardsQuery, LeaderboardsQueryVariables>(LeaderboardsDocument)
    return useInfiniteQuery<LeaderboardsQuery, TError, TData>(
      variables === undefined ? ['Leaderboards.infinite'] : ['Leaderboards.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteLeaderboardsQuery.getKey = (variables?: LeaderboardsQueryVariables) => variables === undefined ? ['Leaderboards.infinite'] : ['Leaderboards.infinite', variables];
;

export const GameOverEventsDocument = `
    query GameOverEvents($gameOverSelector: String, $version: String) {
  events(last: 1000, keys: [$gameOverSelector, "*", "*", $version]) {
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
export const useGameOverEventsQuery = <
      TData = GameOverEventsQuery,
      TError = unknown
    >(
      variables?: GameOverEventsQueryVariables,
      options?: UseQueryOptions<GameOverEventsQuery, TError, TData>
    ) =>
    useQuery<GameOverEventsQuery, TError, TData>(
      variables === undefined ? ['GameOverEvents'] : ['GameOverEvents', variables],
      useFetchData<GameOverEventsQuery, GameOverEventsQueryVariables>(GameOverEventsDocument).bind(null, variables),
      options
    );

useGameOverEventsQuery.getKey = (variables?: GameOverEventsQueryVariables) => variables === undefined ? ['GameOverEvents'] : ['GameOverEvents', variables];
;

export const useInfiniteGameOverEventsQuery = <
      TData = GameOverEventsQuery,
      TError = unknown
    >(
      variables?: GameOverEventsQueryVariables,
      options?: UseInfiniteQueryOptions<GameOverEventsQuery, TError, TData>
    ) =>{
    const query = useFetchData<GameOverEventsQuery, GameOverEventsQueryVariables>(GameOverEventsDocument)
    return useInfiniteQuery<GameOverEventsQuery, TError, TData>(
      variables === undefined ? ['GameOverEvents.infinite'] : ['GameOverEvents.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGameOverEventsQuery.getKey = (variables?: GameOverEventsQueryVariables) => variables === undefined ? ['GameOverEvents.infinite'] : ['GameOverEvents.infinite', variables];
;
