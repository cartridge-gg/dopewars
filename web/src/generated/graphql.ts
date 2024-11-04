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
};

export type Erc__Balance = {
  __typename?: 'ERC__Balance';
  balance: Scalars['String'];
  tokenMetadata: Erc__Token;
  type: Scalars['String'];
};

export type Erc__Token = {
  __typename?: 'ERC__Token';
  contractAddress: Scalars['String'];
  decimals: Scalars['String'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  tokenId: Scalars['String'];
};

export type Erc__Transfer = {
  __typename?: 'ERC__Transfer';
  amount: Scalars['String'];
  executedAt: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
  tokenMetadata: Erc__Token;
  transactionHash: Scalars['String'];
  type: Scalars['String'];
};

export type ModelUnion = Dopewars_Claimed | Dopewars_DrugConfig | Dopewars_Erc20BalanceEvent | Dopewars_EncounterStatsConfig | Dopewars_Game | Dopewars_GameConfig | Dopewars_GameCreated | Dopewars_GameOver | Dopewars_GameStorePacked | Dopewars_HighVolatility | Dopewars_HustlerItemBaseConfig | Dopewars_HustlerItemTiersConfig | Dopewars_LocationConfig | Dopewars_NewHighScore | Dopewars_NewSeason | Dopewars_RyoAddress | Dopewars_RyoConfig | Dopewars_Season | Dopewars_SeasonSettings | Dopewars_SortedList | Dopewars_SortedListItem | Dopewars_TradeDrug | Dopewars_TravelEncounter | Dopewars_TravelEncounterResult | Dopewars_Traveled | Dopewars_UpgradeItem;

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

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
  executedAt?: Maybe<Scalars['DateTime']>;
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
  executedAt?: Maybe<Scalars['DateTime']>;
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

export type World__EventMessage = {
  __typename?: 'World__EventMessage';
  createdAt?: Maybe<Scalars['DateTime']>;
  eventId?: Maybe<Scalars['String']>;
  executedAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  keys?: Maybe<Array<Maybe<Scalars['String']>>>;
  models?: Maybe<Array<Maybe<ModelUnion>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type World__EventMessageConnection = {
  __typename?: 'World__EventMessageConnection';
  edges?: Maybe<Array<Maybe<World__EventMessageEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__EventMessageEdge = {
  __typename?: 'World__EventMessageEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__EventMessage>;
};

export type World__Metadata = {
  __typename?: 'World__Metadata';
  content?: Maybe<World__Content>;
  coverImg?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  executedAt?: Maybe<Scalars['DateTime']>;
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
  executedAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  namespace?: Maybe<Scalars['String']>;
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
  dopewarsClaimedModels?: Maybe<Dopewars_ClaimedConnection>;
  dopewarsDrugConfigModels?: Maybe<Dopewars_DrugConfigConnection>;
  dopewarsEncounterStatsConfigModels?: Maybe<Dopewars_EncounterStatsConfigConnection>;
  dopewarsErc20BalanceEventModels?: Maybe<Dopewars_Erc20BalanceEventConnection>;
  dopewarsGameConfigModels?: Maybe<Dopewars_GameConfigConnection>;
  dopewarsGameCreatedModels?: Maybe<Dopewars_GameCreatedConnection>;
  dopewarsGameModels?: Maybe<Dopewars_GameConnection>;
  dopewarsGameOverModels?: Maybe<Dopewars_GameOverConnection>;
  dopewarsGameStorePackedModels?: Maybe<Dopewars_GameStorePackedConnection>;
  dopewarsHighVolatilityModels?: Maybe<Dopewars_HighVolatilityConnection>;
  dopewarsHustlerItemBaseConfigModels?: Maybe<Dopewars_HustlerItemBaseConfigConnection>;
  dopewarsHustlerItemTiersConfigModels?: Maybe<Dopewars_HustlerItemTiersConfigConnection>;
  dopewarsLocationConfigModels?: Maybe<Dopewars_LocationConfigConnection>;
  dopewarsNewHighScoreModels?: Maybe<Dopewars_NewHighScoreConnection>;
  dopewarsNewSeasonModels?: Maybe<Dopewars_NewSeasonConnection>;
  dopewarsRyoAddressModels?: Maybe<Dopewars_RyoAddressConnection>;
  dopewarsRyoConfigModels?: Maybe<Dopewars_RyoConfigConnection>;
  dopewarsSeasonModels?: Maybe<Dopewars_SeasonConnection>;
  dopewarsSeasonSettingsModels?: Maybe<Dopewars_SeasonSettingsConnection>;
  dopewarsSortedListItemModels?: Maybe<Dopewars_SortedListItemConnection>;
  dopewarsSortedListModels?: Maybe<Dopewars_SortedListConnection>;
  dopewarsTradeDrugModels?: Maybe<Dopewars_TradeDrugConnection>;
  dopewarsTravelEncounterModels?: Maybe<Dopewars_TravelEncounterConnection>;
  dopewarsTravelEncounterResultModels?: Maybe<Dopewars_TravelEncounterResultConnection>;
  dopewarsTraveledModels?: Maybe<Dopewars_TraveledConnection>;
  dopewarsUpgradeItemModels?: Maybe<Dopewars_UpgradeItemConnection>;
  entities?: Maybe<World__EntityConnection>;
  entity: World__Entity;
  ercBalance?: Maybe<Array<Maybe<Erc__Balance>>>;
  ercTransfer?: Maybe<Array<Maybe<Erc__Transfer>>>;
  eventMessage: World__EventMessage;
  eventMessages?: Maybe<World__EventMessageConnection>;
  events?: Maybe<World__EventConnection>;
  metadatas?: Maybe<World__MetadataConnection>;
  model: World__Model;
  models?: Maybe<World__ModelConnection>;
  transaction: World__Transaction;
  transactions?: Maybe<World__TransactionConnection>;
};


export type World__QueryDopewarsClaimedModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_ClaimedOrder>;
  where?: InputMaybe<Dopewars_ClaimedWhereInput>;
};


export type World__QueryDopewarsDrugConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_DrugConfigOrder>;
  where?: InputMaybe<Dopewars_DrugConfigWhereInput>;
};


export type World__QueryDopewarsEncounterStatsConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_EncounterStatsConfigOrder>;
  where?: InputMaybe<Dopewars_EncounterStatsConfigWhereInput>;
};


export type World__QueryDopewarsErc20BalanceEventModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_Erc20BalanceEventOrder>;
  where?: InputMaybe<Dopewars_Erc20BalanceEventWhereInput>;
};


export type World__QueryDopewarsGameConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_GameConfigOrder>;
  where?: InputMaybe<Dopewars_GameConfigWhereInput>;
};


export type World__QueryDopewarsGameCreatedModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_GameCreatedOrder>;
  where?: InputMaybe<Dopewars_GameCreatedWhereInput>;
};


export type World__QueryDopewarsGameModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_GameOrder>;
  where?: InputMaybe<Dopewars_GameWhereInput>;
};


export type World__QueryDopewarsGameOverModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_GameOverOrder>;
  where?: InputMaybe<Dopewars_GameOverWhereInput>;
};


export type World__QueryDopewarsGameStorePackedModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_GameStorePackedOrder>;
  where?: InputMaybe<Dopewars_GameStorePackedWhereInput>;
};


export type World__QueryDopewarsHighVolatilityModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_HighVolatilityOrder>;
  where?: InputMaybe<Dopewars_HighVolatilityWhereInput>;
};


export type World__QueryDopewarsHustlerItemBaseConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_HustlerItemBaseConfigOrder>;
  where?: InputMaybe<Dopewars_HustlerItemBaseConfigWhereInput>;
};


export type World__QueryDopewarsHustlerItemTiersConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_HustlerItemTiersConfigOrder>;
  where?: InputMaybe<Dopewars_HustlerItemTiersConfigWhereInput>;
};


export type World__QueryDopewarsLocationConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_LocationConfigOrder>;
  where?: InputMaybe<Dopewars_LocationConfigWhereInput>;
};


export type World__QueryDopewarsNewHighScoreModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_NewHighScoreOrder>;
  where?: InputMaybe<Dopewars_NewHighScoreWhereInput>;
};


export type World__QueryDopewarsNewSeasonModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_NewSeasonOrder>;
  where?: InputMaybe<Dopewars_NewSeasonWhereInput>;
};


export type World__QueryDopewarsRyoAddressModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_RyoAddressOrder>;
  where?: InputMaybe<Dopewars_RyoAddressWhereInput>;
};


export type World__QueryDopewarsRyoConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_RyoConfigOrder>;
  where?: InputMaybe<Dopewars_RyoConfigWhereInput>;
};


export type World__QueryDopewarsSeasonModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_SeasonOrder>;
  where?: InputMaybe<Dopewars_SeasonWhereInput>;
};


export type World__QueryDopewarsSeasonSettingsModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_SeasonSettingsOrder>;
  where?: InputMaybe<Dopewars_SeasonSettingsWhereInput>;
};


export type World__QueryDopewarsSortedListItemModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_SortedListItemOrder>;
  where?: InputMaybe<Dopewars_SortedListItemWhereInput>;
};


export type World__QueryDopewarsSortedListModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_SortedListOrder>;
  where?: InputMaybe<Dopewars_SortedListWhereInput>;
};


export type World__QueryDopewarsTradeDrugModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_TradeDrugOrder>;
  where?: InputMaybe<Dopewars_TradeDrugWhereInput>;
};


export type World__QueryDopewarsTravelEncounterModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_TravelEncounterOrder>;
  where?: InputMaybe<Dopewars_TravelEncounterWhereInput>;
};


export type World__QueryDopewarsTravelEncounterResultModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_TravelEncounterResultOrder>;
  where?: InputMaybe<Dopewars_TravelEncounterResultWhereInput>;
};


export type World__QueryDopewarsTraveledModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_TraveledOrder>;
  where?: InputMaybe<Dopewars_TraveledWhereInput>;
};


export type World__QueryDopewarsUpgradeItemModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_UpgradeItemOrder>;
  where?: InputMaybe<Dopewars_UpgradeItemWhereInput>;
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


export type World__QueryErcBalanceArgs = {
  accountAddress: Scalars['String'];
};


export type World__QueryErcTransferArgs = {
  accountAddress: Scalars['String'];
  limit: Scalars['Int'];
};


export type World__QueryEventMessageArgs = {
  id: Scalars['ID'];
};


export type World__QueryEventMessagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
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
  eventMessageUpdated: World__EventMessage;
  modelRegistered: World__Model;
};


export type World__SubscriptionEntityUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type World__SubscriptionEventEmittedArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type World__SubscriptionEventMessageUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type World__SubscriptionModelRegisteredArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type World__Transaction = {
  __typename?: 'World__Transaction';
  calldata?: Maybe<Array<Maybe<Scalars['felt252']>>>;
  createdAt?: Maybe<Scalars['DateTime']>;
  executedAt?: Maybe<Scalars['DateTime']>;
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

export type Dopewars_Claimed = {
  __typename?: 'dopewars_Claimed';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  paper?: Maybe<Scalars['u32']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  rank?: Maybe<Scalars['u16']>;
  season_version?: Maybe<Scalars['u16']>;
};

export type Dopewars_ClaimedConnection = {
  __typename?: 'dopewars_ClaimedConnection';
  edges?: Maybe<Array<Maybe<Dopewars_ClaimedEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_ClaimedEdge = {
  __typename?: 'dopewars_ClaimedEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_Claimed>;
};

export type Dopewars_ClaimedOrder = {
  direction: OrderDirection;
  field: Dopewars_ClaimedOrderField;
};

export enum Dopewars_ClaimedOrderField {
  GameId = 'GAME_ID',
  Paper = 'PAPER',
  PlayerId = 'PLAYER_ID',
  Rank = 'RANK',
  SeasonVersion = 'SEASON_VERSION'
}

export type Dopewars_ClaimedWhereInput = {
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  paper?: InputMaybe<Scalars['u32']>;
  paperEQ?: InputMaybe<Scalars['u32']>;
  paperGT?: InputMaybe<Scalars['u32']>;
  paperGTE?: InputMaybe<Scalars['u32']>;
  paperIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  paperLIKE?: InputMaybe<Scalars['u32']>;
  paperLT?: InputMaybe<Scalars['u32']>;
  paperLTE?: InputMaybe<Scalars['u32']>;
  paperNEQ?: InputMaybe<Scalars['u32']>;
  paperNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  paperNOTLIKE?: InputMaybe<Scalars['u32']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  rank?: InputMaybe<Scalars['u16']>;
  rankEQ?: InputMaybe<Scalars['u16']>;
  rankGT?: InputMaybe<Scalars['u16']>;
  rankGTE?: InputMaybe<Scalars['u16']>;
  rankIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  rankLIKE?: InputMaybe<Scalars['u16']>;
  rankLT?: InputMaybe<Scalars['u16']>;
  rankLTE?: InputMaybe<Scalars['u16']>;
  rankNEQ?: InputMaybe<Scalars['u16']>;
  rankNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  rankNOTLIKE?: InputMaybe<Scalars['u16']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_DrugConfig = {
  __typename?: 'dopewars_DrugConfig';
  base?: Maybe<Scalars['u16']>;
  drug?: Maybe<Scalars['Enum']>;
  drug_id?: Maybe<Scalars['u8']>;
  drugs_mode?: Maybe<Scalars['Enum']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  name?: Maybe<Dopewars_DrugConfig_Bytes16>;
  step?: Maybe<Scalars['u16']>;
  weight?: Maybe<Scalars['u16']>;
};

export type Dopewars_DrugConfigConnection = {
  __typename?: 'dopewars_DrugConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_DrugConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_DrugConfigEdge = {
  __typename?: 'dopewars_DrugConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_DrugConfig>;
};

export type Dopewars_DrugConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_DrugConfigOrderField;
};

export enum Dopewars_DrugConfigOrderField {
  Base = 'BASE',
  Drug = 'DRUG',
  DrugsMode = 'DRUGS_MODE',
  DrugId = 'DRUG_ID',
  Name = 'NAME',
  Step = 'STEP',
  Weight = 'WEIGHT'
}

export type Dopewars_DrugConfigWhereInput = {
  base?: InputMaybe<Scalars['u16']>;
  baseEQ?: InputMaybe<Scalars['u16']>;
  baseGT?: InputMaybe<Scalars['u16']>;
  baseGTE?: InputMaybe<Scalars['u16']>;
  baseIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  baseLIKE?: InputMaybe<Scalars['u16']>;
  baseLT?: InputMaybe<Scalars['u16']>;
  baseLTE?: InputMaybe<Scalars['u16']>;
  baseNEQ?: InputMaybe<Scalars['u16']>;
  baseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  baseNOTLIKE?: InputMaybe<Scalars['u16']>;
  drug?: InputMaybe<Scalars['Enum']>;
  drug_id?: InputMaybe<Scalars['u8']>;
  drug_idEQ?: InputMaybe<Scalars['u8']>;
  drug_idGT?: InputMaybe<Scalars['u8']>;
  drug_idGTE?: InputMaybe<Scalars['u8']>;
  drug_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idLIKE?: InputMaybe<Scalars['u8']>;
  drug_idLT?: InputMaybe<Scalars['u8']>;
  drug_idLTE?: InputMaybe<Scalars['u8']>;
  drug_idNEQ?: InputMaybe<Scalars['u8']>;
  drug_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  drugs_mode?: InputMaybe<Scalars['Enum']>;
  step?: InputMaybe<Scalars['u16']>;
  stepEQ?: InputMaybe<Scalars['u16']>;
  stepGT?: InputMaybe<Scalars['u16']>;
  stepGTE?: InputMaybe<Scalars['u16']>;
  stepIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  stepLIKE?: InputMaybe<Scalars['u16']>;
  stepLT?: InputMaybe<Scalars['u16']>;
  stepLTE?: InputMaybe<Scalars['u16']>;
  stepNEQ?: InputMaybe<Scalars['u16']>;
  stepNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  stepNOTLIKE?: InputMaybe<Scalars['u16']>;
  weight?: InputMaybe<Scalars['u16']>;
  weightEQ?: InputMaybe<Scalars['u16']>;
  weightGT?: InputMaybe<Scalars['u16']>;
  weightGTE?: InputMaybe<Scalars['u16']>;
  weightIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  weightLIKE?: InputMaybe<Scalars['u16']>;
  weightLT?: InputMaybe<Scalars['u16']>;
  weightLTE?: InputMaybe<Scalars['u16']>;
  weightNEQ?: InputMaybe<Scalars['u16']>;
  weightNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  weightNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_DrugConfig_Bytes16 = {
  __typename?: 'dopewars_DrugConfig_Bytes16';
  value?: Maybe<Scalars['u128']>;
};

export type Dopewars_Erc20BalanceEvent = {
  __typename?: 'dopewars_ERC20BalanceEvent';
  balance?: Maybe<Scalars['u256']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  owner?: Maybe<Scalars['ContractAddress']>;
  token_address?: Maybe<Scalars['ContractAddress']>;
};

export type Dopewars_Erc20BalanceEventConnection = {
  __typename?: 'dopewars_ERC20BalanceEventConnection';
  edges?: Maybe<Array<Maybe<Dopewars_Erc20BalanceEventEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_Erc20BalanceEventEdge = {
  __typename?: 'dopewars_ERC20BalanceEventEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_Erc20BalanceEvent>;
};

export type Dopewars_Erc20BalanceEventOrder = {
  direction: OrderDirection;
  field: Dopewars_Erc20BalanceEventOrderField;
};

export enum Dopewars_Erc20BalanceEventOrderField {
  Balance = 'BALANCE',
  Owner = 'OWNER',
  TokenAddress = 'TOKEN_ADDRESS'
}

export type Dopewars_Erc20BalanceEventWhereInput = {
  balance?: InputMaybe<Scalars['u256']>;
  balanceEQ?: InputMaybe<Scalars['u256']>;
  balanceGT?: InputMaybe<Scalars['u256']>;
  balanceGTE?: InputMaybe<Scalars['u256']>;
  balanceIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  balanceLIKE?: InputMaybe<Scalars['u256']>;
  balanceLT?: InputMaybe<Scalars['u256']>;
  balanceLTE?: InputMaybe<Scalars['u256']>;
  balanceNEQ?: InputMaybe<Scalars['u256']>;
  balanceNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  balanceNOTLIKE?: InputMaybe<Scalars['u256']>;
  owner?: InputMaybe<Scalars['ContractAddress']>;
  ownerEQ?: InputMaybe<Scalars['ContractAddress']>;
  ownerGT?: InputMaybe<Scalars['ContractAddress']>;
  ownerGTE?: InputMaybe<Scalars['ContractAddress']>;
  ownerIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  ownerLIKE?: InputMaybe<Scalars['ContractAddress']>;
  ownerLT?: InputMaybe<Scalars['ContractAddress']>;
  ownerLTE?: InputMaybe<Scalars['ContractAddress']>;
  ownerNEQ?: InputMaybe<Scalars['ContractAddress']>;
  ownerNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  ownerNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  token_address?: InputMaybe<Scalars['ContractAddress']>;
  token_addressEQ?: InputMaybe<Scalars['ContractAddress']>;
  token_addressGT?: InputMaybe<Scalars['ContractAddress']>;
  token_addressGTE?: InputMaybe<Scalars['ContractAddress']>;
  token_addressIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  token_addressLIKE?: InputMaybe<Scalars['ContractAddress']>;
  token_addressLT?: InputMaybe<Scalars['ContractAddress']>;
  token_addressLTE?: InputMaybe<Scalars['ContractAddress']>;
  token_addressNEQ?: InputMaybe<Scalars['ContractAddress']>;
  token_addressNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  token_addressNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
};

export type Dopewars_EncounterStatsConfig = {
  __typename?: 'dopewars_EncounterStatsConfig';
  attack_base?: Maybe<Scalars['u8']>;
  attack_step?: Maybe<Scalars['u8']>;
  defense_base?: Maybe<Scalars['u8']>;
  defense_step?: Maybe<Scalars['u8']>;
  encounter?: Maybe<Scalars['Enum']>;
  encounters_mode?: Maybe<Scalars['Enum']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  health_base?: Maybe<Scalars['u8']>;
  health_step?: Maybe<Scalars['u8']>;
  speed_base?: Maybe<Scalars['u8']>;
  speed_step?: Maybe<Scalars['u8']>;
};

export type Dopewars_EncounterStatsConfigConnection = {
  __typename?: 'dopewars_EncounterStatsConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_EncounterStatsConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_EncounterStatsConfigEdge = {
  __typename?: 'dopewars_EncounterStatsConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_EncounterStatsConfig>;
};

export type Dopewars_EncounterStatsConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_EncounterStatsConfigOrderField;
};

export enum Dopewars_EncounterStatsConfigOrderField {
  AttackBase = 'ATTACK_BASE',
  AttackStep = 'ATTACK_STEP',
  DefenseBase = 'DEFENSE_BASE',
  DefenseStep = 'DEFENSE_STEP',
  Encounter = 'ENCOUNTER',
  EncountersMode = 'ENCOUNTERS_MODE',
  HealthBase = 'HEALTH_BASE',
  HealthStep = 'HEALTH_STEP',
  SpeedBase = 'SPEED_BASE',
  SpeedStep = 'SPEED_STEP'
}

export type Dopewars_EncounterStatsConfigWhereInput = {
  attack_base?: InputMaybe<Scalars['u8']>;
  attack_baseEQ?: InputMaybe<Scalars['u8']>;
  attack_baseGT?: InputMaybe<Scalars['u8']>;
  attack_baseGTE?: InputMaybe<Scalars['u8']>;
  attack_baseIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attack_baseLIKE?: InputMaybe<Scalars['u8']>;
  attack_baseLT?: InputMaybe<Scalars['u8']>;
  attack_baseLTE?: InputMaybe<Scalars['u8']>;
  attack_baseNEQ?: InputMaybe<Scalars['u8']>;
  attack_baseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attack_baseNOTLIKE?: InputMaybe<Scalars['u8']>;
  attack_step?: InputMaybe<Scalars['u8']>;
  attack_stepEQ?: InputMaybe<Scalars['u8']>;
  attack_stepGT?: InputMaybe<Scalars['u8']>;
  attack_stepGTE?: InputMaybe<Scalars['u8']>;
  attack_stepIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attack_stepLIKE?: InputMaybe<Scalars['u8']>;
  attack_stepLT?: InputMaybe<Scalars['u8']>;
  attack_stepLTE?: InputMaybe<Scalars['u8']>;
  attack_stepNEQ?: InputMaybe<Scalars['u8']>;
  attack_stepNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attack_stepNOTLIKE?: InputMaybe<Scalars['u8']>;
  defense_base?: InputMaybe<Scalars['u8']>;
  defense_baseEQ?: InputMaybe<Scalars['u8']>;
  defense_baseGT?: InputMaybe<Scalars['u8']>;
  defense_baseGTE?: InputMaybe<Scalars['u8']>;
  defense_baseIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defense_baseLIKE?: InputMaybe<Scalars['u8']>;
  defense_baseLT?: InputMaybe<Scalars['u8']>;
  defense_baseLTE?: InputMaybe<Scalars['u8']>;
  defense_baseNEQ?: InputMaybe<Scalars['u8']>;
  defense_baseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defense_baseNOTLIKE?: InputMaybe<Scalars['u8']>;
  defense_step?: InputMaybe<Scalars['u8']>;
  defense_stepEQ?: InputMaybe<Scalars['u8']>;
  defense_stepGT?: InputMaybe<Scalars['u8']>;
  defense_stepGTE?: InputMaybe<Scalars['u8']>;
  defense_stepIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defense_stepLIKE?: InputMaybe<Scalars['u8']>;
  defense_stepLT?: InputMaybe<Scalars['u8']>;
  defense_stepLTE?: InputMaybe<Scalars['u8']>;
  defense_stepNEQ?: InputMaybe<Scalars['u8']>;
  defense_stepNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defense_stepNOTLIKE?: InputMaybe<Scalars['u8']>;
  encounter?: InputMaybe<Scalars['Enum']>;
  encounters_mode?: InputMaybe<Scalars['Enum']>;
  health_base?: InputMaybe<Scalars['u8']>;
  health_baseEQ?: InputMaybe<Scalars['u8']>;
  health_baseGT?: InputMaybe<Scalars['u8']>;
  health_baseGTE?: InputMaybe<Scalars['u8']>;
  health_baseIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  health_baseLIKE?: InputMaybe<Scalars['u8']>;
  health_baseLT?: InputMaybe<Scalars['u8']>;
  health_baseLTE?: InputMaybe<Scalars['u8']>;
  health_baseNEQ?: InputMaybe<Scalars['u8']>;
  health_baseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  health_baseNOTLIKE?: InputMaybe<Scalars['u8']>;
  health_step?: InputMaybe<Scalars['u8']>;
  health_stepEQ?: InputMaybe<Scalars['u8']>;
  health_stepGT?: InputMaybe<Scalars['u8']>;
  health_stepGTE?: InputMaybe<Scalars['u8']>;
  health_stepIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  health_stepLIKE?: InputMaybe<Scalars['u8']>;
  health_stepLT?: InputMaybe<Scalars['u8']>;
  health_stepLTE?: InputMaybe<Scalars['u8']>;
  health_stepNEQ?: InputMaybe<Scalars['u8']>;
  health_stepNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  health_stepNOTLIKE?: InputMaybe<Scalars['u8']>;
  speed_base?: InputMaybe<Scalars['u8']>;
  speed_baseEQ?: InputMaybe<Scalars['u8']>;
  speed_baseGT?: InputMaybe<Scalars['u8']>;
  speed_baseGTE?: InputMaybe<Scalars['u8']>;
  speed_baseIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  speed_baseLIKE?: InputMaybe<Scalars['u8']>;
  speed_baseLT?: InputMaybe<Scalars['u8']>;
  speed_baseLTE?: InputMaybe<Scalars['u8']>;
  speed_baseNEQ?: InputMaybe<Scalars['u8']>;
  speed_baseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  speed_baseNOTLIKE?: InputMaybe<Scalars['u8']>;
  speed_step?: InputMaybe<Scalars['u8']>;
  speed_stepEQ?: InputMaybe<Scalars['u8']>;
  speed_stepGT?: InputMaybe<Scalars['u8']>;
  speed_stepGTE?: InputMaybe<Scalars['u8']>;
  speed_stepIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  speed_stepLIKE?: InputMaybe<Scalars['u8']>;
  speed_stepLT?: InputMaybe<Scalars['u8']>;
  speed_stepLTE?: InputMaybe<Scalars['u8']>;
  speed_stepNEQ?: InputMaybe<Scalars['u8']>;
  speed_stepNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  speed_stepNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_Game = {
  __typename?: 'dopewars_Game';
  claimable?: Maybe<Scalars['u32']>;
  claimed?: Maybe<Scalars['bool']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  final_score?: Maybe<Scalars['u32']>;
  game_id?: Maybe<Scalars['u32']>;
  game_mode?: Maybe<Scalars['Enum']>;
  game_over?: Maybe<Scalars['bool']>;
  hustler_id?: Maybe<Scalars['u16']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  player_name?: Maybe<Dopewars_Game_Bytes16>;
  position?: Maybe<Scalars['u16']>;
  registered?: Maybe<Scalars['bool']>;
  season_version?: Maybe<Scalars['u16']>;
};

export type Dopewars_GameConfig = {
  __typename?: 'dopewars_GameConfig';
  cash?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  health?: Maybe<Scalars['u8']>;
  max_rounds?: Maybe<Scalars['u8']>;
  max_turns?: Maybe<Scalars['u8']>;
  max_wanted_shopping?: Maybe<Scalars['u8']>;
  rep_buy_item?: Maybe<Scalars['u8']>;
  rep_carry_drugs?: Maybe<Scalars['u8']>;
  rep_drug_step?: Maybe<Scalars['u8']>;
  rep_hospitalized?: Maybe<Scalars['u8']>;
  rep_jailed?: Maybe<Scalars['u8']>;
  season_version?: Maybe<Scalars['u16']>;
};

export type Dopewars_GameConfigConnection = {
  __typename?: 'dopewars_GameConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_GameConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_GameConfigEdge = {
  __typename?: 'dopewars_GameConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_GameConfig>;
};

export type Dopewars_GameConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_GameConfigOrderField;
};

export enum Dopewars_GameConfigOrderField {
  Cash = 'CASH',
  Health = 'HEALTH',
  MaxRounds = 'MAX_ROUNDS',
  MaxTurns = 'MAX_TURNS',
  MaxWantedShopping = 'MAX_WANTED_SHOPPING',
  RepBuyItem = 'REP_BUY_ITEM',
  RepCarryDrugs = 'REP_CARRY_DRUGS',
  RepDrugStep = 'REP_DRUG_STEP',
  RepHospitalized = 'REP_HOSPITALIZED',
  RepJailed = 'REP_JAILED',
  SeasonVersion = 'SEASON_VERSION'
}

export type Dopewars_GameConfigWhereInput = {
  cash?: InputMaybe<Scalars['u32']>;
  cashEQ?: InputMaybe<Scalars['u32']>;
  cashGT?: InputMaybe<Scalars['u32']>;
  cashGTE?: InputMaybe<Scalars['u32']>;
  cashIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cashLIKE?: InputMaybe<Scalars['u32']>;
  cashLT?: InputMaybe<Scalars['u32']>;
  cashLTE?: InputMaybe<Scalars['u32']>;
  cashNEQ?: InputMaybe<Scalars['u32']>;
  cashNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cashNOTLIKE?: InputMaybe<Scalars['u32']>;
  health?: InputMaybe<Scalars['u8']>;
  healthEQ?: InputMaybe<Scalars['u8']>;
  healthGT?: InputMaybe<Scalars['u8']>;
  healthGTE?: InputMaybe<Scalars['u8']>;
  healthIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthLIKE?: InputMaybe<Scalars['u8']>;
  healthLT?: InputMaybe<Scalars['u8']>;
  healthLTE?: InputMaybe<Scalars['u8']>;
  healthNEQ?: InputMaybe<Scalars['u8']>;
  healthNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthNOTLIKE?: InputMaybe<Scalars['u8']>;
  max_rounds?: InputMaybe<Scalars['u8']>;
  max_roundsEQ?: InputMaybe<Scalars['u8']>;
  max_roundsGT?: InputMaybe<Scalars['u8']>;
  max_roundsGTE?: InputMaybe<Scalars['u8']>;
  max_roundsIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  max_roundsLIKE?: InputMaybe<Scalars['u8']>;
  max_roundsLT?: InputMaybe<Scalars['u8']>;
  max_roundsLTE?: InputMaybe<Scalars['u8']>;
  max_roundsNEQ?: InputMaybe<Scalars['u8']>;
  max_roundsNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  max_roundsNOTLIKE?: InputMaybe<Scalars['u8']>;
  max_turns?: InputMaybe<Scalars['u8']>;
  max_turnsEQ?: InputMaybe<Scalars['u8']>;
  max_turnsGT?: InputMaybe<Scalars['u8']>;
  max_turnsGTE?: InputMaybe<Scalars['u8']>;
  max_turnsIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  max_turnsLIKE?: InputMaybe<Scalars['u8']>;
  max_turnsLT?: InputMaybe<Scalars['u8']>;
  max_turnsLTE?: InputMaybe<Scalars['u8']>;
  max_turnsNEQ?: InputMaybe<Scalars['u8']>;
  max_turnsNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  max_turnsNOTLIKE?: InputMaybe<Scalars['u8']>;
  max_wanted_shopping?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingEQ?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingGT?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingGTE?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  max_wanted_shoppingLIKE?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingLT?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingLTE?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingNEQ?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  max_wanted_shoppingNOTLIKE?: InputMaybe<Scalars['u8']>;
  rep_buy_item?: InputMaybe<Scalars['u8']>;
  rep_buy_itemEQ?: InputMaybe<Scalars['u8']>;
  rep_buy_itemGT?: InputMaybe<Scalars['u8']>;
  rep_buy_itemGTE?: InputMaybe<Scalars['u8']>;
  rep_buy_itemIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_buy_itemLIKE?: InputMaybe<Scalars['u8']>;
  rep_buy_itemLT?: InputMaybe<Scalars['u8']>;
  rep_buy_itemLTE?: InputMaybe<Scalars['u8']>;
  rep_buy_itemNEQ?: InputMaybe<Scalars['u8']>;
  rep_buy_itemNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_buy_itemNOTLIKE?: InputMaybe<Scalars['u8']>;
  rep_carry_drugs?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsEQ?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsGT?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsGTE?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_carry_drugsLIKE?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsLT?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsLTE?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsNEQ?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_carry_drugsNOTLIKE?: InputMaybe<Scalars['u8']>;
  rep_drug_step?: InputMaybe<Scalars['u8']>;
  rep_drug_stepEQ?: InputMaybe<Scalars['u8']>;
  rep_drug_stepGT?: InputMaybe<Scalars['u8']>;
  rep_drug_stepGTE?: InputMaybe<Scalars['u8']>;
  rep_drug_stepIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_drug_stepLIKE?: InputMaybe<Scalars['u8']>;
  rep_drug_stepLT?: InputMaybe<Scalars['u8']>;
  rep_drug_stepLTE?: InputMaybe<Scalars['u8']>;
  rep_drug_stepNEQ?: InputMaybe<Scalars['u8']>;
  rep_drug_stepNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_drug_stepNOTLIKE?: InputMaybe<Scalars['u8']>;
  rep_hospitalized?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedEQ?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedGT?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedGTE?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_hospitalizedLIKE?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedLT?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedLTE?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedNEQ?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_hospitalizedNOTLIKE?: InputMaybe<Scalars['u8']>;
  rep_jailed?: InputMaybe<Scalars['u8']>;
  rep_jailedEQ?: InputMaybe<Scalars['u8']>;
  rep_jailedGT?: InputMaybe<Scalars['u8']>;
  rep_jailedGTE?: InputMaybe<Scalars['u8']>;
  rep_jailedIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_jailedLIKE?: InputMaybe<Scalars['u8']>;
  rep_jailedLT?: InputMaybe<Scalars['u8']>;
  rep_jailedLTE?: InputMaybe<Scalars['u8']>;
  rep_jailedNEQ?: InputMaybe<Scalars['u8']>;
  rep_jailedNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_jailedNOTLIKE?: InputMaybe<Scalars['u8']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_GameConnection = {
  __typename?: 'dopewars_GameConnection';
  edges?: Maybe<Array<Maybe<Dopewars_GameEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_GameCreated = {
  __typename?: 'dopewars_GameCreated';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  game_mode?: Maybe<Scalars['Enum']>;
  hustler_id?: Maybe<Scalars['u16']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  player_name?: Maybe<Scalars['felt252']>;
};

export type Dopewars_GameCreatedConnection = {
  __typename?: 'dopewars_GameCreatedConnection';
  edges?: Maybe<Array<Maybe<Dopewars_GameCreatedEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_GameCreatedEdge = {
  __typename?: 'dopewars_GameCreatedEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_GameCreated>;
};

export type Dopewars_GameCreatedOrder = {
  direction: OrderDirection;
  field: Dopewars_GameCreatedOrderField;
};

export enum Dopewars_GameCreatedOrderField {
  GameId = 'GAME_ID',
  GameMode = 'GAME_MODE',
  HustlerId = 'HUSTLER_ID',
  PlayerId = 'PLAYER_ID',
  PlayerName = 'PLAYER_NAME'
}

export type Dopewars_GameCreatedWhereInput = {
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  game_mode?: InputMaybe<Scalars['Enum']>;
  hustler_id?: InputMaybe<Scalars['u16']>;
  hustler_idEQ?: InputMaybe<Scalars['u16']>;
  hustler_idGT?: InputMaybe<Scalars['u16']>;
  hustler_idGTE?: InputMaybe<Scalars['u16']>;
  hustler_idIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  hustler_idLIKE?: InputMaybe<Scalars['u16']>;
  hustler_idLT?: InputMaybe<Scalars['u16']>;
  hustler_idLTE?: InputMaybe<Scalars['u16']>;
  hustler_idNEQ?: InputMaybe<Scalars['u16']>;
  hustler_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  hustler_idNOTLIKE?: InputMaybe<Scalars['u16']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_name?: InputMaybe<Scalars['felt252']>;
  player_nameEQ?: InputMaybe<Scalars['felt252']>;
  player_nameGT?: InputMaybe<Scalars['felt252']>;
  player_nameGTE?: InputMaybe<Scalars['felt252']>;
  player_nameIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_nameLIKE?: InputMaybe<Scalars['felt252']>;
  player_nameLT?: InputMaybe<Scalars['felt252']>;
  player_nameLTE?: InputMaybe<Scalars['felt252']>;
  player_nameNEQ?: InputMaybe<Scalars['felt252']>;
  player_nameNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_nameNOTLIKE?: InputMaybe<Scalars['felt252']>;
};

export type Dopewars_GameEdge = {
  __typename?: 'dopewars_GameEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_Game>;
};

export type Dopewars_GameOrder = {
  direction: OrderDirection;
  field: Dopewars_GameOrderField;
};

export enum Dopewars_GameOrderField {
  Claimable = 'CLAIMABLE',
  Claimed = 'CLAIMED',
  FinalScore = 'FINAL_SCORE',
  GameId = 'GAME_ID',
  GameMode = 'GAME_MODE',
  GameOver = 'GAME_OVER',
  HustlerId = 'HUSTLER_ID',
  PlayerId = 'PLAYER_ID',
  PlayerName = 'PLAYER_NAME',
  Position = 'POSITION',
  Registered = 'REGISTERED',
  SeasonVersion = 'SEASON_VERSION'
}

export type Dopewars_GameOver = {
  __typename?: 'dopewars_GameOver';
  cash?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  health?: Maybe<Scalars['u8']>;
  hustler_id?: Maybe<Scalars['u16']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  player_name?: Maybe<Scalars['felt252']>;
  reputation?: Maybe<Scalars['u8']>;
  season_version?: Maybe<Scalars['u16']>;
  turn?: Maybe<Scalars['u8']>;
};

export type Dopewars_GameOverConnection = {
  __typename?: 'dopewars_GameOverConnection';
  edges?: Maybe<Array<Maybe<Dopewars_GameOverEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_GameOverEdge = {
  __typename?: 'dopewars_GameOverEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_GameOver>;
};

export type Dopewars_GameOverOrder = {
  direction: OrderDirection;
  field: Dopewars_GameOverOrderField;
};

export enum Dopewars_GameOverOrderField {
  Cash = 'CASH',
  GameId = 'GAME_ID',
  Health = 'HEALTH',
  HustlerId = 'HUSTLER_ID',
  PlayerId = 'PLAYER_ID',
  PlayerName = 'PLAYER_NAME',
  Reputation = 'REPUTATION',
  SeasonVersion = 'SEASON_VERSION',
  Turn = 'TURN'
}

export type Dopewars_GameOverWhereInput = {
  cash?: InputMaybe<Scalars['u32']>;
  cashEQ?: InputMaybe<Scalars['u32']>;
  cashGT?: InputMaybe<Scalars['u32']>;
  cashGTE?: InputMaybe<Scalars['u32']>;
  cashIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cashLIKE?: InputMaybe<Scalars['u32']>;
  cashLT?: InputMaybe<Scalars['u32']>;
  cashLTE?: InputMaybe<Scalars['u32']>;
  cashNEQ?: InputMaybe<Scalars['u32']>;
  cashNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cashNOTLIKE?: InputMaybe<Scalars['u32']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  health?: InputMaybe<Scalars['u8']>;
  healthEQ?: InputMaybe<Scalars['u8']>;
  healthGT?: InputMaybe<Scalars['u8']>;
  healthGTE?: InputMaybe<Scalars['u8']>;
  healthIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthLIKE?: InputMaybe<Scalars['u8']>;
  healthLT?: InputMaybe<Scalars['u8']>;
  healthLTE?: InputMaybe<Scalars['u8']>;
  healthNEQ?: InputMaybe<Scalars['u8']>;
  healthNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthNOTLIKE?: InputMaybe<Scalars['u8']>;
  hustler_id?: InputMaybe<Scalars['u16']>;
  hustler_idEQ?: InputMaybe<Scalars['u16']>;
  hustler_idGT?: InputMaybe<Scalars['u16']>;
  hustler_idGTE?: InputMaybe<Scalars['u16']>;
  hustler_idIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  hustler_idLIKE?: InputMaybe<Scalars['u16']>;
  hustler_idLT?: InputMaybe<Scalars['u16']>;
  hustler_idLTE?: InputMaybe<Scalars['u16']>;
  hustler_idNEQ?: InputMaybe<Scalars['u16']>;
  hustler_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  hustler_idNOTLIKE?: InputMaybe<Scalars['u16']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_name?: InputMaybe<Scalars['felt252']>;
  player_nameEQ?: InputMaybe<Scalars['felt252']>;
  player_nameGT?: InputMaybe<Scalars['felt252']>;
  player_nameGTE?: InputMaybe<Scalars['felt252']>;
  player_nameIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_nameLIKE?: InputMaybe<Scalars['felt252']>;
  player_nameLT?: InputMaybe<Scalars['felt252']>;
  player_nameLTE?: InputMaybe<Scalars['felt252']>;
  player_nameNEQ?: InputMaybe<Scalars['felt252']>;
  player_nameNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_nameNOTLIKE?: InputMaybe<Scalars['felt252']>;
  reputation?: InputMaybe<Scalars['u8']>;
  reputationEQ?: InputMaybe<Scalars['u8']>;
  reputationGT?: InputMaybe<Scalars['u8']>;
  reputationGTE?: InputMaybe<Scalars['u8']>;
  reputationIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  reputationLIKE?: InputMaybe<Scalars['u8']>;
  reputationLT?: InputMaybe<Scalars['u8']>;
  reputationLTE?: InputMaybe<Scalars['u8']>;
  reputationNEQ?: InputMaybe<Scalars['u8']>;
  reputationNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  reputationNOTLIKE?: InputMaybe<Scalars['u8']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnLIKE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
  turnNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_GameStorePacked = {
  __typename?: 'dopewars_GameStorePacked';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  packed?: Maybe<Scalars['felt252']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
};

export type Dopewars_GameStorePackedConnection = {
  __typename?: 'dopewars_GameStorePackedConnection';
  edges?: Maybe<Array<Maybe<Dopewars_GameStorePackedEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_GameStorePackedEdge = {
  __typename?: 'dopewars_GameStorePackedEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_GameStorePacked>;
};

export type Dopewars_GameStorePackedOrder = {
  direction: OrderDirection;
  field: Dopewars_GameStorePackedOrderField;
};

export enum Dopewars_GameStorePackedOrderField {
  GameId = 'GAME_ID',
  Packed = 'PACKED',
  PlayerId = 'PLAYER_ID'
}

export type Dopewars_GameStorePackedWhereInput = {
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  packed?: InputMaybe<Scalars['felt252']>;
  packedEQ?: InputMaybe<Scalars['felt252']>;
  packedGT?: InputMaybe<Scalars['felt252']>;
  packedGTE?: InputMaybe<Scalars['felt252']>;
  packedIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  packedLIKE?: InputMaybe<Scalars['felt252']>;
  packedLT?: InputMaybe<Scalars['felt252']>;
  packedLTE?: InputMaybe<Scalars['felt252']>;
  packedNEQ?: InputMaybe<Scalars['felt252']>;
  packedNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  packedNOTLIKE?: InputMaybe<Scalars['felt252']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
};

export type Dopewars_GameWhereInput = {
  claimable?: InputMaybe<Scalars['u32']>;
  claimableEQ?: InputMaybe<Scalars['u32']>;
  claimableGT?: InputMaybe<Scalars['u32']>;
  claimableGTE?: InputMaybe<Scalars['u32']>;
  claimableIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  claimableLIKE?: InputMaybe<Scalars['u32']>;
  claimableLT?: InputMaybe<Scalars['u32']>;
  claimableLTE?: InputMaybe<Scalars['u32']>;
  claimableNEQ?: InputMaybe<Scalars['u32']>;
  claimableNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  claimableNOTLIKE?: InputMaybe<Scalars['u32']>;
  claimed?: InputMaybe<Scalars['bool']>;
  final_score?: InputMaybe<Scalars['u32']>;
  final_scoreEQ?: InputMaybe<Scalars['u32']>;
  final_scoreGT?: InputMaybe<Scalars['u32']>;
  final_scoreGTE?: InputMaybe<Scalars['u32']>;
  final_scoreIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  final_scoreLIKE?: InputMaybe<Scalars['u32']>;
  final_scoreLT?: InputMaybe<Scalars['u32']>;
  final_scoreLTE?: InputMaybe<Scalars['u32']>;
  final_scoreNEQ?: InputMaybe<Scalars['u32']>;
  final_scoreNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  final_scoreNOTLIKE?: InputMaybe<Scalars['u32']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  game_mode?: InputMaybe<Scalars['Enum']>;
  game_over?: InputMaybe<Scalars['bool']>;
  hustler_id?: InputMaybe<Scalars['u16']>;
  hustler_idEQ?: InputMaybe<Scalars['u16']>;
  hustler_idGT?: InputMaybe<Scalars['u16']>;
  hustler_idGTE?: InputMaybe<Scalars['u16']>;
  hustler_idIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  hustler_idLIKE?: InputMaybe<Scalars['u16']>;
  hustler_idLT?: InputMaybe<Scalars['u16']>;
  hustler_idLTE?: InputMaybe<Scalars['u16']>;
  hustler_idNEQ?: InputMaybe<Scalars['u16']>;
  hustler_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  hustler_idNOTLIKE?: InputMaybe<Scalars['u16']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  position?: InputMaybe<Scalars['u16']>;
  positionEQ?: InputMaybe<Scalars['u16']>;
  positionGT?: InputMaybe<Scalars['u16']>;
  positionGTE?: InputMaybe<Scalars['u16']>;
  positionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  positionLIKE?: InputMaybe<Scalars['u16']>;
  positionLT?: InputMaybe<Scalars['u16']>;
  positionLTE?: InputMaybe<Scalars['u16']>;
  positionNEQ?: InputMaybe<Scalars['u16']>;
  positionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  positionNOTLIKE?: InputMaybe<Scalars['u16']>;
  registered?: InputMaybe<Scalars['bool']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_Game_Bytes16 = {
  __typename?: 'dopewars_Game_Bytes16';
  value?: Maybe<Scalars['u128']>;
};

export type Dopewars_HighVolatility = {
  __typename?: 'dopewars_HighVolatility';
  drug_id?: Maybe<Scalars['u8']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  increase?: Maybe<Scalars['bool']>;
  location_id?: Maybe<Scalars['u8']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
};

export type Dopewars_HighVolatilityConnection = {
  __typename?: 'dopewars_HighVolatilityConnection';
  edges?: Maybe<Array<Maybe<Dopewars_HighVolatilityEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_HighVolatilityEdge = {
  __typename?: 'dopewars_HighVolatilityEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_HighVolatility>;
};

export type Dopewars_HighVolatilityOrder = {
  direction: OrderDirection;
  field: Dopewars_HighVolatilityOrderField;
};

export enum Dopewars_HighVolatilityOrderField {
  DrugId = 'DRUG_ID',
  GameId = 'GAME_ID',
  Increase = 'INCREASE',
  LocationId = 'LOCATION_ID',
  PlayerId = 'PLAYER_ID'
}

export type Dopewars_HighVolatilityWhereInput = {
  drug_id?: InputMaybe<Scalars['u8']>;
  drug_idEQ?: InputMaybe<Scalars['u8']>;
  drug_idGT?: InputMaybe<Scalars['u8']>;
  drug_idGTE?: InputMaybe<Scalars['u8']>;
  drug_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idLIKE?: InputMaybe<Scalars['u8']>;
  drug_idLT?: InputMaybe<Scalars['u8']>;
  drug_idLTE?: InputMaybe<Scalars['u8']>;
  drug_idNEQ?: InputMaybe<Scalars['u8']>;
  drug_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  increase?: InputMaybe<Scalars['bool']>;
  location_id?: InputMaybe<Scalars['u8']>;
  location_idEQ?: InputMaybe<Scalars['u8']>;
  location_idGT?: InputMaybe<Scalars['u8']>;
  location_idGTE?: InputMaybe<Scalars['u8']>;
  location_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  location_idLIKE?: InputMaybe<Scalars['u8']>;
  location_idLT?: InputMaybe<Scalars['u8']>;
  location_idLTE?: InputMaybe<Scalars['u8']>;
  location_idNEQ?: InputMaybe<Scalars['u8']>;
  location_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  location_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
};

export type Dopewars_HustlerItemBaseConfig = {
  __typename?: 'dopewars_HustlerItemBaseConfig';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  id?: Maybe<Scalars['u32']>;
  initial_tier?: Maybe<Scalars['u8']>;
  name?: Maybe<Scalars['felt252']>;
  slot?: Maybe<Scalars['Enum']>;
  slot_id?: Maybe<Scalars['u8']>;
};

export type Dopewars_HustlerItemBaseConfigConnection = {
  __typename?: 'dopewars_HustlerItemBaseConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_HustlerItemBaseConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_HustlerItemBaseConfigEdge = {
  __typename?: 'dopewars_HustlerItemBaseConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_HustlerItemBaseConfig>;
};

export type Dopewars_HustlerItemBaseConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_HustlerItemBaseConfigOrderField;
};

export enum Dopewars_HustlerItemBaseConfigOrderField {
  Id = 'ID',
  InitialTier = 'INITIAL_TIER',
  Name = 'NAME',
  Slot = 'SLOT',
  SlotId = 'SLOT_ID'
}

export type Dopewars_HustlerItemBaseConfigWhereInput = {
  id?: InputMaybe<Scalars['u32']>;
  idEQ?: InputMaybe<Scalars['u32']>;
  idGT?: InputMaybe<Scalars['u32']>;
  idGTE?: InputMaybe<Scalars['u32']>;
  idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  idLIKE?: InputMaybe<Scalars['u32']>;
  idLT?: InputMaybe<Scalars['u32']>;
  idLTE?: InputMaybe<Scalars['u32']>;
  idNEQ?: InputMaybe<Scalars['u32']>;
  idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  idNOTLIKE?: InputMaybe<Scalars['u32']>;
  initial_tier?: InputMaybe<Scalars['u8']>;
  initial_tierEQ?: InputMaybe<Scalars['u8']>;
  initial_tierGT?: InputMaybe<Scalars['u8']>;
  initial_tierGTE?: InputMaybe<Scalars['u8']>;
  initial_tierIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  initial_tierLIKE?: InputMaybe<Scalars['u8']>;
  initial_tierLT?: InputMaybe<Scalars['u8']>;
  initial_tierLTE?: InputMaybe<Scalars['u8']>;
  initial_tierNEQ?: InputMaybe<Scalars['u8']>;
  initial_tierNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  initial_tierNOTLIKE?: InputMaybe<Scalars['u8']>;
  name?: InputMaybe<Scalars['felt252']>;
  nameEQ?: InputMaybe<Scalars['felt252']>;
  nameGT?: InputMaybe<Scalars['felt252']>;
  nameGTE?: InputMaybe<Scalars['felt252']>;
  nameIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  nameLIKE?: InputMaybe<Scalars['felt252']>;
  nameLT?: InputMaybe<Scalars['felt252']>;
  nameLTE?: InputMaybe<Scalars['felt252']>;
  nameNEQ?: InputMaybe<Scalars['felt252']>;
  nameNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  nameNOTLIKE?: InputMaybe<Scalars['felt252']>;
  slot?: InputMaybe<Scalars['Enum']>;
  slot_id?: InputMaybe<Scalars['u8']>;
  slot_idEQ?: InputMaybe<Scalars['u8']>;
  slot_idGT?: InputMaybe<Scalars['u8']>;
  slot_idGTE?: InputMaybe<Scalars['u8']>;
  slot_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  slot_idLIKE?: InputMaybe<Scalars['u8']>;
  slot_idLT?: InputMaybe<Scalars['u8']>;
  slot_idLTE?: InputMaybe<Scalars['u8']>;
  slot_idNEQ?: InputMaybe<Scalars['u8']>;
  slot_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  slot_idNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_HustlerItemTiersConfig = {
  __typename?: 'dopewars_HustlerItemTiersConfig';
  cost?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  slot?: Maybe<Scalars['Enum']>;
  slot_id?: Maybe<Scalars['u8']>;
  stat?: Maybe<Scalars['u32']>;
  tier?: Maybe<Scalars['u8']>;
};

export type Dopewars_HustlerItemTiersConfigConnection = {
  __typename?: 'dopewars_HustlerItemTiersConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_HustlerItemTiersConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_HustlerItemTiersConfigEdge = {
  __typename?: 'dopewars_HustlerItemTiersConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_HustlerItemTiersConfig>;
};

export type Dopewars_HustlerItemTiersConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_HustlerItemTiersConfigOrderField;
};

export enum Dopewars_HustlerItemTiersConfigOrderField {
  Cost = 'COST',
  Slot = 'SLOT',
  SlotId = 'SLOT_ID',
  Stat = 'STAT',
  Tier = 'TIER'
}

export type Dopewars_HustlerItemTiersConfigWhereInput = {
  cost?: InputMaybe<Scalars['u32']>;
  costEQ?: InputMaybe<Scalars['u32']>;
  costGT?: InputMaybe<Scalars['u32']>;
  costGTE?: InputMaybe<Scalars['u32']>;
  costIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  costLIKE?: InputMaybe<Scalars['u32']>;
  costLT?: InputMaybe<Scalars['u32']>;
  costLTE?: InputMaybe<Scalars['u32']>;
  costNEQ?: InputMaybe<Scalars['u32']>;
  costNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  costNOTLIKE?: InputMaybe<Scalars['u32']>;
  slot?: InputMaybe<Scalars['Enum']>;
  slot_id?: InputMaybe<Scalars['u8']>;
  slot_idEQ?: InputMaybe<Scalars['u8']>;
  slot_idGT?: InputMaybe<Scalars['u8']>;
  slot_idGTE?: InputMaybe<Scalars['u8']>;
  slot_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  slot_idLIKE?: InputMaybe<Scalars['u8']>;
  slot_idLT?: InputMaybe<Scalars['u8']>;
  slot_idLTE?: InputMaybe<Scalars['u8']>;
  slot_idNEQ?: InputMaybe<Scalars['u8']>;
  slot_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  slot_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  stat?: InputMaybe<Scalars['u32']>;
  statEQ?: InputMaybe<Scalars['u32']>;
  statGT?: InputMaybe<Scalars['u32']>;
  statGTE?: InputMaybe<Scalars['u32']>;
  statIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  statLIKE?: InputMaybe<Scalars['u32']>;
  statLT?: InputMaybe<Scalars['u32']>;
  statLTE?: InputMaybe<Scalars['u32']>;
  statNEQ?: InputMaybe<Scalars['u32']>;
  statNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  statNOTLIKE?: InputMaybe<Scalars['u32']>;
  tier?: InputMaybe<Scalars['u8']>;
  tierEQ?: InputMaybe<Scalars['u8']>;
  tierGT?: InputMaybe<Scalars['u8']>;
  tierGTE?: InputMaybe<Scalars['u8']>;
  tierIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  tierLIKE?: InputMaybe<Scalars['u8']>;
  tierLT?: InputMaybe<Scalars['u8']>;
  tierLTE?: InputMaybe<Scalars['u8']>;
  tierNEQ?: InputMaybe<Scalars['u8']>;
  tierNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  tierNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_LocationConfig = {
  __typename?: 'dopewars_LocationConfig';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  location?: Maybe<Scalars['Enum']>;
  location_id?: Maybe<Scalars['u8']>;
  name?: Maybe<Dopewars_LocationConfig_Bytes16>;
};

export type Dopewars_LocationConfigConnection = {
  __typename?: 'dopewars_LocationConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_LocationConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_LocationConfigEdge = {
  __typename?: 'dopewars_LocationConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_LocationConfig>;
};

export type Dopewars_LocationConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_LocationConfigOrderField;
};

export enum Dopewars_LocationConfigOrderField {
  Location = 'LOCATION',
  LocationId = 'LOCATION_ID',
  Name = 'NAME'
}

export type Dopewars_LocationConfigWhereInput = {
  location?: InputMaybe<Scalars['Enum']>;
  location_id?: InputMaybe<Scalars['u8']>;
  location_idEQ?: InputMaybe<Scalars['u8']>;
  location_idGT?: InputMaybe<Scalars['u8']>;
  location_idGTE?: InputMaybe<Scalars['u8']>;
  location_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  location_idLIKE?: InputMaybe<Scalars['u8']>;
  location_idLT?: InputMaybe<Scalars['u8']>;
  location_idLTE?: InputMaybe<Scalars['u8']>;
  location_idNEQ?: InputMaybe<Scalars['u8']>;
  location_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  location_idNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_LocationConfig_Bytes16 = {
  __typename?: 'dopewars_LocationConfig_Bytes16';
  value?: Maybe<Scalars['u128']>;
};

export type Dopewars_NewHighScore = {
  __typename?: 'dopewars_NewHighScore';
  cash?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  health?: Maybe<Scalars['u8']>;
  hustler_id?: Maybe<Scalars['u16']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  player_name?: Maybe<Scalars['felt252']>;
  reputation?: Maybe<Scalars['u8']>;
  season_version?: Maybe<Scalars['u16']>;
};

export type Dopewars_NewHighScoreConnection = {
  __typename?: 'dopewars_NewHighScoreConnection';
  edges?: Maybe<Array<Maybe<Dopewars_NewHighScoreEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_NewHighScoreEdge = {
  __typename?: 'dopewars_NewHighScoreEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_NewHighScore>;
};

export type Dopewars_NewHighScoreOrder = {
  direction: OrderDirection;
  field: Dopewars_NewHighScoreOrderField;
};

export enum Dopewars_NewHighScoreOrderField {
  Cash = 'CASH',
  GameId = 'GAME_ID',
  Health = 'HEALTH',
  HustlerId = 'HUSTLER_ID',
  PlayerId = 'PLAYER_ID',
  PlayerName = 'PLAYER_NAME',
  Reputation = 'REPUTATION',
  SeasonVersion = 'SEASON_VERSION'
}

export type Dopewars_NewHighScoreWhereInput = {
  cash?: InputMaybe<Scalars['u32']>;
  cashEQ?: InputMaybe<Scalars['u32']>;
  cashGT?: InputMaybe<Scalars['u32']>;
  cashGTE?: InputMaybe<Scalars['u32']>;
  cashIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cashLIKE?: InputMaybe<Scalars['u32']>;
  cashLT?: InputMaybe<Scalars['u32']>;
  cashLTE?: InputMaybe<Scalars['u32']>;
  cashNEQ?: InputMaybe<Scalars['u32']>;
  cashNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cashNOTLIKE?: InputMaybe<Scalars['u32']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  health?: InputMaybe<Scalars['u8']>;
  healthEQ?: InputMaybe<Scalars['u8']>;
  healthGT?: InputMaybe<Scalars['u8']>;
  healthGTE?: InputMaybe<Scalars['u8']>;
  healthIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthLIKE?: InputMaybe<Scalars['u8']>;
  healthLT?: InputMaybe<Scalars['u8']>;
  healthLTE?: InputMaybe<Scalars['u8']>;
  healthNEQ?: InputMaybe<Scalars['u8']>;
  healthNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthNOTLIKE?: InputMaybe<Scalars['u8']>;
  hustler_id?: InputMaybe<Scalars['u16']>;
  hustler_idEQ?: InputMaybe<Scalars['u16']>;
  hustler_idGT?: InputMaybe<Scalars['u16']>;
  hustler_idGTE?: InputMaybe<Scalars['u16']>;
  hustler_idIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  hustler_idLIKE?: InputMaybe<Scalars['u16']>;
  hustler_idLT?: InputMaybe<Scalars['u16']>;
  hustler_idLTE?: InputMaybe<Scalars['u16']>;
  hustler_idNEQ?: InputMaybe<Scalars['u16']>;
  hustler_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  hustler_idNOTLIKE?: InputMaybe<Scalars['u16']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_name?: InputMaybe<Scalars['felt252']>;
  player_nameEQ?: InputMaybe<Scalars['felt252']>;
  player_nameGT?: InputMaybe<Scalars['felt252']>;
  player_nameGTE?: InputMaybe<Scalars['felt252']>;
  player_nameIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_nameLIKE?: InputMaybe<Scalars['felt252']>;
  player_nameLT?: InputMaybe<Scalars['felt252']>;
  player_nameLTE?: InputMaybe<Scalars['felt252']>;
  player_nameNEQ?: InputMaybe<Scalars['felt252']>;
  player_nameNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_nameNOTLIKE?: InputMaybe<Scalars['felt252']>;
  reputation?: InputMaybe<Scalars['u8']>;
  reputationEQ?: InputMaybe<Scalars['u8']>;
  reputationGT?: InputMaybe<Scalars['u8']>;
  reputationGTE?: InputMaybe<Scalars['u8']>;
  reputationIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  reputationLIKE?: InputMaybe<Scalars['u8']>;
  reputationLT?: InputMaybe<Scalars['u8']>;
  reputationLTE?: InputMaybe<Scalars['u8']>;
  reputationNEQ?: InputMaybe<Scalars['u8']>;
  reputationNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  reputationNOTLIKE?: InputMaybe<Scalars['u8']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_NewSeason = {
  __typename?: 'dopewars_NewSeason';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  key?: Maybe<Scalars['u16']>;
  season_version?: Maybe<Scalars['u16']>;
};

export type Dopewars_NewSeasonConnection = {
  __typename?: 'dopewars_NewSeasonConnection';
  edges?: Maybe<Array<Maybe<Dopewars_NewSeasonEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_NewSeasonEdge = {
  __typename?: 'dopewars_NewSeasonEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_NewSeason>;
};

export type Dopewars_NewSeasonOrder = {
  direction: OrderDirection;
  field: Dopewars_NewSeasonOrderField;
};

export enum Dopewars_NewSeasonOrderField {
  Key = 'KEY',
  SeasonVersion = 'SEASON_VERSION'
}

export type Dopewars_NewSeasonWhereInput = {
  key?: InputMaybe<Scalars['u16']>;
  keyEQ?: InputMaybe<Scalars['u16']>;
  keyGT?: InputMaybe<Scalars['u16']>;
  keyGTE?: InputMaybe<Scalars['u16']>;
  keyIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  keyLIKE?: InputMaybe<Scalars['u16']>;
  keyLT?: InputMaybe<Scalars['u16']>;
  keyLTE?: InputMaybe<Scalars['u16']>;
  keyNEQ?: InputMaybe<Scalars['u16']>;
  keyNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  keyNOTLIKE?: InputMaybe<Scalars['u16']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_RyoAddress = {
  __typename?: 'dopewars_RyoAddress';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  key?: Maybe<Scalars['u8']>;
  laundromat?: Maybe<Scalars['ContractAddress']>;
  paper?: Maybe<Scalars['ContractAddress']>;
  treasury?: Maybe<Scalars['ContractAddress']>;
  vrf?: Maybe<Scalars['ContractAddress']>;
};

export type Dopewars_RyoAddressConnection = {
  __typename?: 'dopewars_RyoAddressConnection';
  edges?: Maybe<Array<Maybe<Dopewars_RyoAddressEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_RyoAddressEdge = {
  __typename?: 'dopewars_RyoAddressEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_RyoAddress>;
};

export type Dopewars_RyoAddressOrder = {
  direction: OrderDirection;
  field: Dopewars_RyoAddressOrderField;
};

export enum Dopewars_RyoAddressOrderField {
  Key = 'KEY',
  Laundromat = 'LAUNDROMAT',
  Paper = 'PAPER',
  Treasury = 'TREASURY',
  Vrf = 'VRF'
}

export type Dopewars_RyoAddressWhereInput = {
  key?: InputMaybe<Scalars['u8']>;
  keyEQ?: InputMaybe<Scalars['u8']>;
  keyGT?: InputMaybe<Scalars['u8']>;
  keyGTE?: InputMaybe<Scalars['u8']>;
  keyIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  keyLIKE?: InputMaybe<Scalars['u8']>;
  keyLT?: InputMaybe<Scalars['u8']>;
  keyLTE?: InputMaybe<Scalars['u8']>;
  keyNEQ?: InputMaybe<Scalars['u8']>;
  keyNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  keyNOTLIKE?: InputMaybe<Scalars['u8']>;
  laundromat?: InputMaybe<Scalars['ContractAddress']>;
  laundromatEQ?: InputMaybe<Scalars['ContractAddress']>;
  laundromatGT?: InputMaybe<Scalars['ContractAddress']>;
  laundromatGTE?: InputMaybe<Scalars['ContractAddress']>;
  laundromatIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  laundromatLIKE?: InputMaybe<Scalars['ContractAddress']>;
  laundromatLT?: InputMaybe<Scalars['ContractAddress']>;
  laundromatLTE?: InputMaybe<Scalars['ContractAddress']>;
  laundromatNEQ?: InputMaybe<Scalars['ContractAddress']>;
  laundromatNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  laundromatNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  paper?: InputMaybe<Scalars['ContractAddress']>;
  paperEQ?: InputMaybe<Scalars['ContractAddress']>;
  paperGT?: InputMaybe<Scalars['ContractAddress']>;
  paperGTE?: InputMaybe<Scalars['ContractAddress']>;
  paperIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  paperLIKE?: InputMaybe<Scalars['ContractAddress']>;
  paperLT?: InputMaybe<Scalars['ContractAddress']>;
  paperLTE?: InputMaybe<Scalars['ContractAddress']>;
  paperNEQ?: InputMaybe<Scalars['ContractAddress']>;
  paperNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  paperNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  treasury?: InputMaybe<Scalars['ContractAddress']>;
  treasuryEQ?: InputMaybe<Scalars['ContractAddress']>;
  treasuryGT?: InputMaybe<Scalars['ContractAddress']>;
  treasuryGTE?: InputMaybe<Scalars['ContractAddress']>;
  treasuryIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  treasuryLIKE?: InputMaybe<Scalars['ContractAddress']>;
  treasuryLT?: InputMaybe<Scalars['ContractAddress']>;
  treasuryLTE?: InputMaybe<Scalars['ContractAddress']>;
  treasuryNEQ?: InputMaybe<Scalars['ContractAddress']>;
  treasuryNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  treasuryNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  vrf?: InputMaybe<Scalars['ContractAddress']>;
  vrfEQ?: InputMaybe<Scalars['ContractAddress']>;
  vrfGT?: InputMaybe<Scalars['ContractAddress']>;
  vrfGTE?: InputMaybe<Scalars['ContractAddress']>;
  vrfIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  vrfLIKE?: InputMaybe<Scalars['ContractAddress']>;
  vrfLT?: InputMaybe<Scalars['ContractAddress']>;
  vrfLTE?: InputMaybe<Scalars['ContractAddress']>;
  vrfNEQ?: InputMaybe<Scalars['ContractAddress']>;
  vrfNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  vrfNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
};

export type Dopewars_RyoConfig = {
  __typename?: 'dopewars_RyoConfig';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  initialized?: Maybe<Scalars['bool']>;
  key?: Maybe<Scalars['u8']>;
  paper_fee?: Maybe<Scalars['u16']>;
  paper_reward_launderer?: Maybe<Scalars['u16']>;
  paused?: Maybe<Scalars['bool']>;
  season_duration?: Maybe<Scalars['u32']>;
  season_time_limit?: Maybe<Scalars['u16']>;
  season_version?: Maybe<Scalars['u16']>;
  treasury_balance?: Maybe<Scalars['u32']>;
  treasury_fee_pct?: Maybe<Scalars['u8']>;
};

export type Dopewars_RyoConfigConnection = {
  __typename?: 'dopewars_RyoConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_RyoConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_RyoConfigEdge = {
  __typename?: 'dopewars_RyoConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_RyoConfig>;
};

export type Dopewars_RyoConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_RyoConfigOrderField;
};

export enum Dopewars_RyoConfigOrderField {
  Initialized = 'INITIALIZED',
  Key = 'KEY',
  PaperFee = 'PAPER_FEE',
  PaperRewardLaunderer = 'PAPER_REWARD_LAUNDERER',
  Paused = 'PAUSED',
  SeasonDuration = 'SEASON_DURATION',
  SeasonTimeLimit = 'SEASON_TIME_LIMIT',
  SeasonVersion = 'SEASON_VERSION',
  TreasuryBalance = 'TREASURY_BALANCE',
  TreasuryFeePct = 'TREASURY_FEE_PCT'
}

export type Dopewars_RyoConfigWhereInput = {
  initialized?: InputMaybe<Scalars['bool']>;
  key?: InputMaybe<Scalars['u8']>;
  keyEQ?: InputMaybe<Scalars['u8']>;
  keyGT?: InputMaybe<Scalars['u8']>;
  keyGTE?: InputMaybe<Scalars['u8']>;
  keyIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  keyLIKE?: InputMaybe<Scalars['u8']>;
  keyLT?: InputMaybe<Scalars['u8']>;
  keyLTE?: InputMaybe<Scalars['u8']>;
  keyNEQ?: InputMaybe<Scalars['u8']>;
  keyNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  keyNOTLIKE?: InputMaybe<Scalars['u8']>;
  paper_fee?: InputMaybe<Scalars['u16']>;
  paper_feeEQ?: InputMaybe<Scalars['u16']>;
  paper_feeGT?: InputMaybe<Scalars['u16']>;
  paper_feeGTE?: InputMaybe<Scalars['u16']>;
  paper_feeIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  paper_feeLIKE?: InputMaybe<Scalars['u16']>;
  paper_feeLT?: InputMaybe<Scalars['u16']>;
  paper_feeLTE?: InputMaybe<Scalars['u16']>;
  paper_feeNEQ?: InputMaybe<Scalars['u16']>;
  paper_feeNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  paper_feeNOTLIKE?: InputMaybe<Scalars['u16']>;
  paper_reward_launderer?: InputMaybe<Scalars['u16']>;
  paper_reward_laundererEQ?: InputMaybe<Scalars['u16']>;
  paper_reward_laundererGT?: InputMaybe<Scalars['u16']>;
  paper_reward_laundererGTE?: InputMaybe<Scalars['u16']>;
  paper_reward_laundererIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  paper_reward_laundererLIKE?: InputMaybe<Scalars['u16']>;
  paper_reward_laundererLT?: InputMaybe<Scalars['u16']>;
  paper_reward_laundererLTE?: InputMaybe<Scalars['u16']>;
  paper_reward_laundererNEQ?: InputMaybe<Scalars['u16']>;
  paper_reward_laundererNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  paper_reward_laundererNOTLIKE?: InputMaybe<Scalars['u16']>;
  paused?: InputMaybe<Scalars['bool']>;
  season_duration?: InputMaybe<Scalars['u32']>;
  season_durationEQ?: InputMaybe<Scalars['u32']>;
  season_durationGT?: InputMaybe<Scalars['u32']>;
  season_durationGTE?: InputMaybe<Scalars['u32']>;
  season_durationIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  season_durationLIKE?: InputMaybe<Scalars['u32']>;
  season_durationLT?: InputMaybe<Scalars['u32']>;
  season_durationLTE?: InputMaybe<Scalars['u32']>;
  season_durationNEQ?: InputMaybe<Scalars['u32']>;
  season_durationNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  season_durationNOTLIKE?: InputMaybe<Scalars['u32']>;
  season_time_limit?: InputMaybe<Scalars['u16']>;
  season_time_limitEQ?: InputMaybe<Scalars['u16']>;
  season_time_limitGT?: InputMaybe<Scalars['u16']>;
  season_time_limitGTE?: InputMaybe<Scalars['u16']>;
  season_time_limitIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_time_limitLIKE?: InputMaybe<Scalars['u16']>;
  season_time_limitLT?: InputMaybe<Scalars['u16']>;
  season_time_limitLTE?: InputMaybe<Scalars['u16']>;
  season_time_limitNEQ?: InputMaybe<Scalars['u16']>;
  season_time_limitNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_time_limitNOTLIKE?: InputMaybe<Scalars['u16']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
  treasury_balance?: InputMaybe<Scalars['u32']>;
  treasury_balanceEQ?: InputMaybe<Scalars['u32']>;
  treasury_balanceGT?: InputMaybe<Scalars['u32']>;
  treasury_balanceGTE?: InputMaybe<Scalars['u32']>;
  treasury_balanceIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  treasury_balanceLIKE?: InputMaybe<Scalars['u32']>;
  treasury_balanceLT?: InputMaybe<Scalars['u32']>;
  treasury_balanceLTE?: InputMaybe<Scalars['u32']>;
  treasury_balanceNEQ?: InputMaybe<Scalars['u32']>;
  treasury_balanceNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  treasury_balanceNOTLIKE?: InputMaybe<Scalars['u32']>;
  treasury_fee_pct?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctEQ?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctGT?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctGTE?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  treasury_fee_pctLIKE?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctLT?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctLTE?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctNEQ?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  treasury_fee_pctNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_Season = {
  __typename?: 'dopewars_Season';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  high_score?: Maybe<Scalars['u32']>;
  next_version_timestamp?: Maybe<Scalars['u64']>;
  paper_balance?: Maybe<Scalars['u32']>;
  paper_fee?: Maybe<Scalars['u16']>;
  season_duration?: Maybe<Scalars['u32']>;
  season_time_limit?: Maybe<Scalars['u16']>;
  treasury_fee_pct?: Maybe<Scalars['u8']>;
  version?: Maybe<Scalars['u16']>;
};

export type Dopewars_SeasonConnection = {
  __typename?: 'dopewars_SeasonConnection';
  edges?: Maybe<Array<Maybe<Dopewars_SeasonEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_SeasonEdge = {
  __typename?: 'dopewars_SeasonEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_Season>;
};

export type Dopewars_SeasonOrder = {
  direction: OrderDirection;
  field: Dopewars_SeasonOrderField;
};

export enum Dopewars_SeasonOrderField {
  HighScore = 'HIGH_SCORE',
  NextVersionTimestamp = 'NEXT_VERSION_TIMESTAMP',
  PaperBalance = 'PAPER_BALANCE',
  PaperFee = 'PAPER_FEE',
  SeasonDuration = 'SEASON_DURATION',
  SeasonTimeLimit = 'SEASON_TIME_LIMIT',
  TreasuryFeePct = 'TREASURY_FEE_PCT',
  Version = 'VERSION'
}

export type Dopewars_SeasonSettings = {
  __typename?: 'dopewars_SeasonSettings';
  cash_mode?: Maybe<Scalars['Enum']>;
  drugs_mode?: Maybe<Scalars['Enum']>;
  encounters_mode?: Maybe<Scalars['Enum']>;
  encounters_odds_mode?: Maybe<Scalars['Enum']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  health_mode?: Maybe<Scalars['Enum']>;
  season_version?: Maybe<Scalars['u16']>;
  turns_mode?: Maybe<Scalars['Enum']>;
  wanted_mode?: Maybe<Scalars['Enum']>;
};

export type Dopewars_SeasonSettingsConnection = {
  __typename?: 'dopewars_SeasonSettingsConnection';
  edges?: Maybe<Array<Maybe<Dopewars_SeasonSettingsEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_SeasonSettingsEdge = {
  __typename?: 'dopewars_SeasonSettingsEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_SeasonSettings>;
};

export type Dopewars_SeasonSettingsOrder = {
  direction: OrderDirection;
  field: Dopewars_SeasonSettingsOrderField;
};

export enum Dopewars_SeasonSettingsOrderField {
  CashMode = 'CASH_MODE',
  DrugsMode = 'DRUGS_MODE',
  EncountersMode = 'ENCOUNTERS_MODE',
  EncountersOddsMode = 'ENCOUNTERS_ODDS_MODE',
  HealthMode = 'HEALTH_MODE',
  SeasonVersion = 'SEASON_VERSION',
  TurnsMode = 'TURNS_MODE',
  WantedMode = 'WANTED_MODE'
}

export type Dopewars_SeasonSettingsWhereInput = {
  cash_mode?: InputMaybe<Scalars['Enum']>;
  drugs_mode?: InputMaybe<Scalars['Enum']>;
  encounters_mode?: InputMaybe<Scalars['Enum']>;
  encounters_odds_mode?: InputMaybe<Scalars['Enum']>;
  health_mode?: InputMaybe<Scalars['Enum']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
  turns_mode?: InputMaybe<Scalars['Enum']>;
  wanted_mode?: InputMaybe<Scalars['Enum']>;
};

export type Dopewars_SeasonWhereInput = {
  high_score?: InputMaybe<Scalars['u32']>;
  high_scoreEQ?: InputMaybe<Scalars['u32']>;
  high_scoreGT?: InputMaybe<Scalars['u32']>;
  high_scoreGTE?: InputMaybe<Scalars['u32']>;
  high_scoreIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  high_scoreLIKE?: InputMaybe<Scalars['u32']>;
  high_scoreLT?: InputMaybe<Scalars['u32']>;
  high_scoreLTE?: InputMaybe<Scalars['u32']>;
  high_scoreNEQ?: InputMaybe<Scalars['u32']>;
  high_scoreNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  high_scoreNOTLIKE?: InputMaybe<Scalars['u32']>;
  next_version_timestamp?: InputMaybe<Scalars['u64']>;
  next_version_timestampEQ?: InputMaybe<Scalars['u64']>;
  next_version_timestampGT?: InputMaybe<Scalars['u64']>;
  next_version_timestampGTE?: InputMaybe<Scalars['u64']>;
  next_version_timestampIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  next_version_timestampLIKE?: InputMaybe<Scalars['u64']>;
  next_version_timestampLT?: InputMaybe<Scalars['u64']>;
  next_version_timestampLTE?: InputMaybe<Scalars['u64']>;
  next_version_timestampNEQ?: InputMaybe<Scalars['u64']>;
  next_version_timestampNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  next_version_timestampNOTLIKE?: InputMaybe<Scalars['u64']>;
  paper_balance?: InputMaybe<Scalars['u32']>;
  paper_balanceEQ?: InputMaybe<Scalars['u32']>;
  paper_balanceGT?: InputMaybe<Scalars['u32']>;
  paper_balanceGTE?: InputMaybe<Scalars['u32']>;
  paper_balanceIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  paper_balanceLIKE?: InputMaybe<Scalars['u32']>;
  paper_balanceLT?: InputMaybe<Scalars['u32']>;
  paper_balanceLTE?: InputMaybe<Scalars['u32']>;
  paper_balanceNEQ?: InputMaybe<Scalars['u32']>;
  paper_balanceNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  paper_balanceNOTLIKE?: InputMaybe<Scalars['u32']>;
  paper_fee?: InputMaybe<Scalars['u16']>;
  paper_feeEQ?: InputMaybe<Scalars['u16']>;
  paper_feeGT?: InputMaybe<Scalars['u16']>;
  paper_feeGTE?: InputMaybe<Scalars['u16']>;
  paper_feeIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  paper_feeLIKE?: InputMaybe<Scalars['u16']>;
  paper_feeLT?: InputMaybe<Scalars['u16']>;
  paper_feeLTE?: InputMaybe<Scalars['u16']>;
  paper_feeNEQ?: InputMaybe<Scalars['u16']>;
  paper_feeNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  paper_feeNOTLIKE?: InputMaybe<Scalars['u16']>;
  season_duration?: InputMaybe<Scalars['u32']>;
  season_durationEQ?: InputMaybe<Scalars['u32']>;
  season_durationGT?: InputMaybe<Scalars['u32']>;
  season_durationGTE?: InputMaybe<Scalars['u32']>;
  season_durationIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  season_durationLIKE?: InputMaybe<Scalars['u32']>;
  season_durationLT?: InputMaybe<Scalars['u32']>;
  season_durationLTE?: InputMaybe<Scalars['u32']>;
  season_durationNEQ?: InputMaybe<Scalars['u32']>;
  season_durationNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  season_durationNOTLIKE?: InputMaybe<Scalars['u32']>;
  season_time_limit?: InputMaybe<Scalars['u16']>;
  season_time_limitEQ?: InputMaybe<Scalars['u16']>;
  season_time_limitGT?: InputMaybe<Scalars['u16']>;
  season_time_limitGTE?: InputMaybe<Scalars['u16']>;
  season_time_limitIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_time_limitLIKE?: InputMaybe<Scalars['u16']>;
  season_time_limitLT?: InputMaybe<Scalars['u16']>;
  season_time_limitLTE?: InputMaybe<Scalars['u16']>;
  season_time_limitNEQ?: InputMaybe<Scalars['u16']>;
  season_time_limitNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_time_limitNOTLIKE?: InputMaybe<Scalars['u16']>;
  treasury_fee_pct?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctEQ?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctGT?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctGTE?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  treasury_fee_pctLIKE?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctLT?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctLTE?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctNEQ?: InputMaybe<Scalars['u8']>;
  treasury_fee_pctNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  treasury_fee_pctNOTLIKE?: InputMaybe<Scalars['u8']>;
  version?: InputMaybe<Scalars['u16']>;
  versionEQ?: InputMaybe<Scalars['u16']>;
  versionGT?: InputMaybe<Scalars['u16']>;
  versionGTE?: InputMaybe<Scalars['u16']>;
  versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  versionLIKE?: InputMaybe<Scalars['u16']>;
  versionLT?: InputMaybe<Scalars['u16']>;
  versionLTE?: InputMaybe<Scalars['u16']>;
  versionNEQ?: InputMaybe<Scalars['u16']>;
  versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  versionNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_SortedList = {
  __typename?: 'dopewars_SortedList';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  list_id?: Maybe<Scalars['felt252']>;
  locked?: Maybe<Scalars['bool']>;
  process_cursor_k0?: Maybe<Scalars['u32']>;
  process_cursor_k1?: Maybe<Scalars['ContractAddress']>;
  process_max_size?: Maybe<Scalars['u32']>;
  process_size?: Maybe<Scalars['u32']>;
  processed?: Maybe<Scalars['bool']>;
  size?: Maybe<Scalars['u32']>;
};

export type Dopewars_SortedListConnection = {
  __typename?: 'dopewars_SortedListConnection';
  edges?: Maybe<Array<Maybe<Dopewars_SortedListEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_SortedListEdge = {
  __typename?: 'dopewars_SortedListEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_SortedList>;
};

export type Dopewars_SortedListItem = {
  __typename?: 'dopewars_SortedListItem';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  item_k0?: Maybe<Scalars['u32']>;
  item_k1?: Maybe<Scalars['ContractAddress']>;
  list_id?: Maybe<Scalars['felt252']>;
  next_k0?: Maybe<Scalars['u32']>;
  next_k1?: Maybe<Scalars['ContractAddress']>;
};

export type Dopewars_SortedListItemConnection = {
  __typename?: 'dopewars_SortedListItemConnection';
  edges?: Maybe<Array<Maybe<Dopewars_SortedListItemEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_SortedListItemEdge = {
  __typename?: 'dopewars_SortedListItemEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_SortedListItem>;
};

export type Dopewars_SortedListItemOrder = {
  direction: OrderDirection;
  field: Dopewars_SortedListItemOrderField;
};

export enum Dopewars_SortedListItemOrderField {
  ItemK0 = 'ITEM_K0',
  ItemK1 = 'ITEM_K1',
  ListId = 'LIST_ID',
  NextK0 = 'NEXT_K0',
  NextK1 = 'NEXT_K1'
}

export type Dopewars_SortedListItemWhereInput = {
  item_k0?: InputMaybe<Scalars['u32']>;
  item_k0EQ?: InputMaybe<Scalars['u32']>;
  item_k0GT?: InputMaybe<Scalars['u32']>;
  item_k0GTE?: InputMaybe<Scalars['u32']>;
  item_k0IN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  item_k0LIKE?: InputMaybe<Scalars['u32']>;
  item_k0LT?: InputMaybe<Scalars['u32']>;
  item_k0LTE?: InputMaybe<Scalars['u32']>;
  item_k0NEQ?: InputMaybe<Scalars['u32']>;
  item_k0NOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  item_k0NOTLIKE?: InputMaybe<Scalars['u32']>;
  item_k1?: InputMaybe<Scalars['ContractAddress']>;
  item_k1EQ?: InputMaybe<Scalars['ContractAddress']>;
  item_k1GT?: InputMaybe<Scalars['ContractAddress']>;
  item_k1GTE?: InputMaybe<Scalars['ContractAddress']>;
  item_k1IN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  item_k1LIKE?: InputMaybe<Scalars['ContractAddress']>;
  item_k1LT?: InputMaybe<Scalars['ContractAddress']>;
  item_k1LTE?: InputMaybe<Scalars['ContractAddress']>;
  item_k1NEQ?: InputMaybe<Scalars['ContractAddress']>;
  item_k1NOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  item_k1NOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  list_id?: InputMaybe<Scalars['felt252']>;
  list_idEQ?: InputMaybe<Scalars['felt252']>;
  list_idGT?: InputMaybe<Scalars['felt252']>;
  list_idGTE?: InputMaybe<Scalars['felt252']>;
  list_idIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  list_idLIKE?: InputMaybe<Scalars['felt252']>;
  list_idLT?: InputMaybe<Scalars['felt252']>;
  list_idLTE?: InputMaybe<Scalars['felt252']>;
  list_idNEQ?: InputMaybe<Scalars['felt252']>;
  list_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  list_idNOTLIKE?: InputMaybe<Scalars['felt252']>;
  next_k0?: InputMaybe<Scalars['u32']>;
  next_k0EQ?: InputMaybe<Scalars['u32']>;
  next_k0GT?: InputMaybe<Scalars['u32']>;
  next_k0GTE?: InputMaybe<Scalars['u32']>;
  next_k0IN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  next_k0LIKE?: InputMaybe<Scalars['u32']>;
  next_k0LT?: InputMaybe<Scalars['u32']>;
  next_k0LTE?: InputMaybe<Scalars['u32']>;
  next_k0NEQ?: InputMaybe<Scalars['u32']>;
  next_k0NOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  next_k0NOTLIKE?: InputMaybe<Scalars['u32']>;
  next_k1?: InputMaybe<Scalars['ContractAddress']>;
  next_k1EQ?: InputMaybe<Scalars['ContractAddress']>;
  next_k1GT?: InputMaybe<Scalars['ContractAddress']>;
  next_k1GTE?: InputMaybe<Scalars['ContractAddress']>;
  next_k1IN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  next_k1LIKE?: InputMaybe<Scalars['ContractAddress']>;
  next_k1LT?: InputMaybe<Scalars['ContractAddress']>;
  next_k1LTE?: InputMaybe<Scalars['ContractAddress']>;
  next_k1NEQ?: InputMaybe<Scalars['ContractAddress']>;
  next_k1NOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  next_k1NOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
};

export type Dopewars_SortedListOrder = {
  direction: OrderDirection;
  field: Dopewars_SortedListOrderField;
};

export enum Dopewars_SortedListOrderField {
  ListId = 'LIST_ID',
  Locked = 'LOCKED',
  Processed = 'PROCESSED',
  ProcessCursorK0 = 'PROCESS_CURSOR_K0',
  ProcessCursorK1 = 'PROCESS_CURSOR_K1',
  ProcessMaxSize = 'PROCESS_MAX_SIZE',
  ProcessSize = 'PROCESS_SIZE',
  Size = 'SIZE'
}

export type Dopewars_SortedListWhereInput = {
  list_id?: InputMaybe<Scalars['felt252']>;
  list_idEQ?: InputMaybe<Scalars['felt252']>;
  list_idGT?: InputMaybe<Scalars['felt252']>;
  list_idGTE?: InputMaybe<Scalars['felt252']>;
  list_idIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  list_idLIKE?: InputMaybe<Scalars['felt252']>;
  list_idLT?: InputMaybe<Scalars['felt252']>;
  list_idLTE?: InputMaybe<Scalars['felt252']>;
  list_idNEQ?: InputMaybe<Scalars['felt252']>;
  list_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  list_idNOTLIKE?: InputMaybe<Scalars['felt252']>;
  locked?: InputMaybe<Scalars['bool']>;
  process_cursor_k0?: InputMaybe<Scalars['u32']>;
  process_cursor_k0EQ?: InputMaybe<Scalars['u32']>;
  process_cursor_k0GT?: InputMaybe<Scalars['u32']>;
  process_cursor_k0GTE?: InputMaybe<Scalars['u32']>;
  process_cursor_k0IN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  process_cursor_k0LIKE?: InputMaybe<Scalars['u32']>;
  process_cursor_k0LT?: InputMaybe<Scalars['u32']>;
  process_cursor_k0LTE?: InputMaybe<Scalars['u32']>;
  process_cursor_k0NEQ?: InputMaybe<Scalars['u32']>;
  process_cursor_k0NOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  process_cursor_k0NOTLIKE?: InputMaybe<Scalars['u32']>;
  process_cursor_k1?: InputMaybe<Scalars['ContractAddress']>;
  process_cursor_k1EQ?: InputMaybe<Scalars['ContractAddress']>;
  process_cursor_k1GT?: InputMaybe<Scalars['ContractAddress']>;
  process_cursor_k1GTE?: InputMaybe<Scalars['ContractAddress']>;
  process_cursor_k1IN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  process_cursor_k1LIKE?: InputMaybe<Scalars['ContractAddress']>;
  process_cursor_k1LT?: InputMaybe<Scalars['ContractAddress']>;
  process_cursor_k1LTE?: InputMaybe<Scalars['ContractAddress']>;
  process_cursor_k1NEQ?: InputMaybe<Scalars['ContractAddress']>;
  process_cursor_k1NOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  process_cursor_k1NOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  process_max_size?: InputMaybe<Scalars['u32']>;
  process_max_sizeEQ?: InputMaybe<Scalars['u32']>;
  process_max_sizeGT?: InputMaybe<Scalars['u32']>;
  process_max_sizeGTE?: InputMaybe<Scalars['u32']>;
  process_max_sizeIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  process_max_sizeLIKE?: InputMaybe<Scalars['u32']>;
  process_max_sizeLT?: InputMaybe<Scalars['u32']>;
  process_max_sizeLTE?: InputMaybe<Scalars['u32']>;
  process_max_sizeNEQ?: InputMaybe<Scalars['u32']>;
  process_max_sizeNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  process_max_sizeNOTLIKE?: InputMaybe<Scalars['u32']>;
  process_size?: InputMaybe<Scalars['u32']>;
  process_sizeEQ?: InputMaybe<Scalars['u32']>;
  process_sizeGT?: InputMaybe<Scalars['u32']>;
  process_sizeGTE?: InputMaybe<Scalars['u32']>;
  process_sizeIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  process_sizeLIKE?: InputMaybe<Scalars['u32']>;
  process_sizeLT?: InputMaybe<Scalars['u32']>;
  process_sizeLTE?: InputMaybe<Scalars['u32']>;
  process_sizeNEQ?: InputMaybe<Scalars['u32']>;
  process_sizeNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  process_sizeNOTLIKE?: InputMaybe<Scalars['u32']>;
  processed?: InputMaybe<Scalars['bool']>;
  size?: InputMaybe<Scalars['u32']>;
  sizeEQ?: InputMaybe<Scalars['u32']>;
  sizeGT?: InputMaybe<Scalars['u32']>;
  sizeGTE?: InputMaybe<Scalars['u32']>;
  sizeIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  sizeLIKE?: InputMaybe<Scalars['u32']>;
  sizeLT?: InputMaybe<Scalars['u32']>;
  sizeLTE?: InputMaybe<Scalars['u32']>;
  sizeNEQ?: InputMaybe<Scalars['u32']>;
  sizeNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  sizeNOTLIKE?: InputMaybe<Scalars['u32']>;
};

export type Dopewars_TradeDrug = {
  __typename?: 'dopewars_TradeDrug';
  drug_id?: Maybe<Scalars['u8']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  is_buy?: Maybe<Scalars['bool']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  price?: Maybe<Scalars['u32']>;
  quantity?: Maybe<Scalars['u32']>;
  turn?: Maybe<Scalars['u8']>;
};

export type Dopewars_TradeDrugConnection = {
  __typename?: 'dopewars_TradeDrugConnection';
  edges?: Maybe<Array<Maybe<Dopewars_TradeDrugEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_TradeDrugEdge = {
  __typename?: 'dopewars_TradeDrugEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_TradeDrug>;
};

export type Dopewars_TradeDrugOrder = {
  direction: OrderDirection;
  field: Dopewars_TradeDrugOrderField;
};

export enum Dopewars_TradeDrugOrderField {
  DrugId = 'DRUG_ID',
  GameId = 'GAME_ID',
  IsBuy = 'IS_BUY',
  PlayerId = 'PLAYER_ID',
  Price = 'PRICE',
  Quantity = 'QUANTITY',
  Turn = 'TURN'
}

export type Dopewars_TradeDrugWhereInput = {
  drug_id?: InputMaybe<Scalars['u8']>;
  drug_idEQ?: InputMaybe<Scalars['u8']>;
  drug_idGT?: InputMaybe<Scalars['u8']>;
  drug_idGTE?: InputMaybe<Scalars['u8']>;
  drug_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idLIKE?: InputMaybe<Scalars['u8']>;
  drug_idLT?: InputMaybe<Scalars['u8']>;
  drug_idLTE?: InputMaybe<Scalars['u8']>;
  drug_idNEQ?: InputMaybe<Scalars['u8']>;
  drug_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  is_buy?: InputMaybe<Scalars['bool']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  price?: InputMaybe<Scalars['u32']>;
  priceEQ?: InputMaybe<Scalars['u32']>;
  priceGT?: InputMaybe<Scalars['u32']>;
  priceGTE?: InputMaybe<Scalars['u32']>;
  priceIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  priceLIKE?: InputMaybe<Scalars['u32']>;
  priceLT?: InputMaybe<Scalars['u32']>;
  priceLTE?: InputMaybe<Scalars['u32']>;
  priceNEQ?: InputMaybe<Scalars['u32']>;
  priceNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  priceNOTLIKE?: InputMaybe<Scalars['u32']>;
  quantity?: InputMaybe<Scalars['u32']>;
  quantityEQ?: InputMaybe<Scalars['u32']>;
  quantityGT?: InputMaybe<Scalars['u32']>;
  quantityGTE?: InputMaybe<Scalars['u32']>;
  quantityIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  quantityLIKE?: InputMaybe<Scalars['u32']>;
  quantityLT?: InputMaybe<Scalars['u32']>;
  quantityLTE?: InputMaybe<Scalars['u32']>;
  quantityNEQ?: InputMaybe<Scalars['u32']>;
  quantityNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  quantityNOTLIKE?: InputMaybe<Scalars['u32']>;
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnLIKE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
  turnNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_TravelEncounter = {
  __typename?: 'dopewars_TravelEncounter';
  attack?: Maybe<Scalars['u8']>;
  defense?: Maybe<Scalars['u8']>;
  demand_pct?: Maybe<Scalars['u8']>;
  encounter?: Maybe<Scalars['felt252']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  health?: Maybe<Scalars['u8']>;
  level?: Maybe<Scalars['u8']>;
  payout?: Maybe<Scalars['u32']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  speed?: Maybe<Scalars['u8']>;
  turn?: Maybe<Scalars['u8']>;
};

export type Dopewars_TravelEncounterConnection = {
  __typename?: 'dopewars_TravelEncounterConnection';
  edges?: Maybe<Array<Maybe<Dopewars_TravelEncounterEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_TravelEncounterEdge = {
  __typename?: 'dopewars_TravelEncounterEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_TravelEncounter>;
};

export type Dopewars_TravelEncounterOrder = {
  direction: OrderDirection;
  field: Dopewars_TravelEncounterOrderField;
};

export enum Dopewars_TravelEncounterOrderField {
  Attack = 'ATTACK',
  Defense = 'DEFENSE',
  DemandPct = 'DEMAND_PCT',
  Encounter = 'ENCOUNTER',
  GameId = 'GAME_ID',
  Health = 'HEALTH',
  Level = 'LEVEL',
  Payout = 'PAYOUT',
  PlayerId = 'PLAYER_ID',
  Speed = 'SPEED',
  Turn = 'TURN'
}

export type Dopewars_TravelEncounterResult = {
  __typename?: 'dopewars_TravelEncounterResult';
  action?: Maybe<Scalars['Enum']>;
  cash_earnt?: Maybe<Scalars['u32']>;
  cash_loss?: Maybe<Scalars['u32']>;
  dmg_dealt?: Maybe<Array<Maybe<Dopewars_TravelEncounterResult_U8u8>>>;
  dmg_taken?: Maybe<Array<Maybe<Dopewars_TravelEncounterResult_U8u8>>>;
  drug_id?: Maybe<Scalars['u8']>;
  drug_loss?: Maybe<Array<Maybe<Scalars['u32']>>>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  outcome?: Maybe<Scalars['Enum']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  rep_neg?: Maybe<Scalars['u8']>;
  rep_pos?: Maybe<Scalars['u8']>;
  rounds?: Maybe<Scalars['u8']>;
  turn?: Maybe<Scalars['u8']>;
  turn_loss?: Maybe<Scalars['u8']>;
};

export type Dopewars_TravelEncounterResultConnection = {
  __typename?: 'dopewars_TravelEncounterResultConnection';
  edges?: Maybe<Array<Maybe<Dopewars_TravelEncounterResultEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_TravelEncounterResultEdge = {
  __typename?: 'dopewars_TravelEncounterResultEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_TravelEncounterResult>;
};

export type Dopewars_TravelEncounterResultOrder = {
  direction: OrderDirection;
  field: Dopewars_TravelEncounterResultOrderField;
};

export enum Dopewars_TravelEncounterResultOrderField {
  Action = 'ACTION',
  CashEarnt = 'CASH_EARNT',
  CashLoss = 'CASH_LOSS',
  DmgDealt = 'DMG_DEALT',
  DmgTaken = 'DMG_TAKEN',
  DrugId = 'DRUG_ID',
  DrugLoss = 'DRUG_LOSS',
  GameId = 'GAME_ID',
  Outcome = 'OUTCOME',
  PlayerId = 'PLAYER_ID',
  RepNeg = 'REP_NEG',
  RepPos = 'REP_POS',
  Rounds = 'ROUNDS',
  Turn = 'TURN',
  TurnLoss = 'TURN_LOSS'
}

export type Dopewars_TravelEncounterResultWhereInput = {
  action?: InputMaybe<Scalars['Enum']>;
  cash_earnt?: InputMaybe<Scalars['u32']>;
  cash_earntEQ?: InputMaybe<Scalars['u32']>;
  cash_earntGT?: InputMaybe<Scalars['u32']>;
  cash_earntGTE?: InputMaybe<Scalars['u32']>;
  cash_earntIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cash_earntLIKE?: InputMaybe<Scalars['u32']>;
  cash_earntLT?: InputMaybe<Scalars['u32']>;
  cash_earntLTE?: InputMaybe<Scalars['u32']>;
  cash_earntNEQ?: InputMaybe<Scalars['u32']>;
  cash_earntNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cash_earntNOTLIKE?: InputMaybe<Scalars['u32']>;
  cash_loss?: InputMaybe<Scalars['u32']>;
  cash_lossEQ?: InputMaybe<Scalars['u32']>;
  cash_lossGT?: InputMaybe<Scalars['u32']>;
  cash_lossGTE?: InputMaybe<Scalars['u32']>;
  cash_lossIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cash_lossLIKE?: InputMaybe<Scalars['u32']>;
  cash_lossLT?: InputMaybe<Scalars['u32']>;
  cash_lossLTE?: InputMaybe<Scalars['u32']>;
  cash_lossNEQ?: InputMaybe<Scalars['u32']>;
  cash_lossNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cash_lossNOTLIKE?: InputMaybe<Scalars['u32']>;
  drug_id?: InputMaybe<Scalars['u8']>;
  drug_idEQ?: InputMaybe<Scalars['u8']>;
  drug_idGT?: InputMaybe<Scalars['u8']>;
  drug_idGTE?: InputMaybe<Scalars['u8']>;
  drug_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idLIKE?: InputMaybe<Scalars['u8']>;
  drug_idLT?: InputMaybe<Scalars['u8']>;
  drug_idLTE?: InputMaybe<Scalars['u8']>;
  drug_idNEQ?: InputMaybe<Scalars['u8']>;
  drug_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  outcome?: InputMaybe<Scalars['Enum']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  rep_neg?: InputMaybe<Scalars['u8']>;
  rep_negEQ?: InputMaybe<Scalars['u8']>;
  rep_negGT?: InputMaybe<Scalars['u8']>;
  rep_negGTE?: InputMaybe<Scalars['u8']>;
  rep_negIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_negLIKE?: InputMaybe<Scalars['u8']>;
  rep_negLT?: InputMaybe<Scalars['u8']>;
  rep_negLTE?: InputMaybe<Scalars['u8']>;
  rep_negNEQ?: InputMaybe<Scalars['u8']>;
  rep_negNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_negNOTLIKE?: InputMaybe<Scalars['u8']>;
  rep_pos?: InputMaybe<Scalars['u8']>;
  rep_posEQ?: InputMaybe<Scalars['u8']>;
  rep_posGT?: InputMaybe<Scalars['u8']>;
  rep_posGTE?: InputMaybe<Scalars['u8']>;
  rep_posIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_posLIKE?: InputMaybe<Scalars['u8']>;
  rep_posLT?: InputMaybe<Scalars['u8']>;
  rep_posLTE?: InputMaybe<Scalars['u8']>;
  rep_posNEQ?: InputMaybe<Scalars['u8']>;
  rep_posNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_posNOTLIKE?: InputMaybe<Scalars['u8']>;
  rounds?: InputMaybe<Scalars['u8']>;
  roundsEQ?: InputMaybe<Scalars['u8']>;
  roundsGT?: InputMaybe<Scalars['u8']>;
  roundsGTE?: InputMaybe<Scalars['u8']>;
  roundsIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  roundsLIKE?: InputMaybe<Scalars['u8']>;
  roundsLT?: InputMaybe<Scalars['u8']>;
  roundsLTE?: InputMaybe<Scalars['u8']>;
  roundsNEQ?: InputMaybe<Scalars['u8']>;
  roundsNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  roundsNOTLIKE?: InputMaybe<Scalars['u8']>;
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnLIKE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
  turnNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnNOTLIKE?: InputMaybe<Scalars['u8']>;
  turn_loss?: InputMaybe<Scalars['u8']>;
  turn_lossEQ?: InputMaybe<Scalars['u8']>;
  turn_lossGT?: InputMaybe<Scalars['u8']>;
  turn_lossGTE?: InputMaybe<Scalars['u8']>;
  turn_lossIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turn_lossLIKE?: InputMaybe<Scalars['u8']>;
  turn_lossLT?: InputMaybe<Scalars['u8']>;
  turn_lossLTE?: InputMaybe<Scalars['u8']>;
  turn_lossNEQ?: InputMaybe<Scalars['u8']>;
  turn_lossNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turn_lossNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_TravelEncounterResult_U8u8 = {
  __typename?: 'dopewars_TravelEncounterResult_u8u8';
  _0?: Maybe<Scalars['u8']>;
  _1?: Maybe<Scalars['u8']>;
};

export type Dopewars_TravelEncounterWhereInput = {
  attack?: InputMaybe<Scalars['u8']>;
  attackEQ?: InputMaybe<Scalars['u8']>;
  attackGT?: InputMaybe<Scalars['u8']>;
  attackGTE?: InputMaybe<Scalars['u8']>;
  attackIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attackLIKE?: InputMaybe<Scalars['u8']>;
  attackLT?: InputMaybe<Scalars['u8']>;
  attackLTE?: InputMaybe<Scalars['u8']>;
  attackNEQ?: InputMaybe<Scalars['u8']>;
  attackNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attackNOTLIKE?: InputMaybe<Scalars['u8']>;
  defense?: InputMaybe<Scalars['u8']>;
  defenseEQ?: InputMaybe<Scalars['u8']>;
  defenseGT?: InputMaybe<Scalars['u8']>;
  defenseGTE?: InputMaybe<Scalars['u8']>;
  defenseIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defenseLIKE?: InputMaybe<Scalars['u8']>;
  defenseLT?: InputMaybe<Scalars['u8']>;
  defenseLTE?: InputMaybe<Scalars['u8']>;
  defenseNEQ?: InputMaybe<Scalars['u8']>;
  defenseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defenseNOTLIKE?: InputMaybe<Scalars['u8']>;
  demand_pct?: InputMaybe<Scalars['u8']>;
  demand_pctEQ?: InputMaybe<Scalars['u8']>;
  demand_pctGT?: InputMaybe<Scalars['u8']>;
  demand_pctGTE?: InputMaybe<Scalars['u8']>;
  demand_pctIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  demand_pctLIKE?: InputMaybe<Scalars['u8']>;
  demand_pctLT?: InputMaybe<Scalars['u8']>;
  demand_pctLTE?: InputMaybe<Scalars['u8']>;
  demand_pctNEQ?: InputMaybe<Scalars['u8']>;
  demand_pctNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  demand_pctNOTLIKE?: InputMaybe<Scalars['u8']>;
  encounter?: InputMaybe<Scalars['felt252']>;
  encounterEQ?: InputMaybe<Scalars['felt252']>;
  encounterGT?: InputMaybe<Scalars['felt252']>;
  encounterGTE?: InputMaybe<Scalars['felt252']>;
  encounterIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  encounterLIKE?: InputMaybe<Scalars['felt252']>;
  encounterLT?: InputMaybe<Scalars['felt252']>;
  encounterLTE?: InputMaybe<Scalars['felt252']>;
  encounterNEQ?: InputMaybe<Scalars['felt252']>;
  encounterNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  encounterNOTLIKE?: InputMaybe<Scalars['felt252']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  health?: InputMaybe<Scalars['u8']>;
  healthEQ?: InputMaybe<Scalars['u8']>;
  healthGT?: InputMaybe<Scalars['u8']>;
  healthGTE?: InputMaybe<Scalars['u8']>;
  healthIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthLIKE?: InputMaybe<Scalars['u8']>;
  healthLT?: InputMaybe<Scalars['u8']>;
  healthLTE?: InputMaybe<Scalars['u8']>;
  healthNEQ?: InputMaybe<Scalars['u8']>;
  healthNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthNOTLIKE?: InputMaybe<Scalars['u8']>;
  level?: InputMaybe<Scalars['u8']>;
  levelEQ?: InputMaybe<Scalars['u8']>;
  levelGT?: InputMaybe<Scalars['u8']>;
  levelGTE?: InputMaybe<Scalars['u8']>;
  levelIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  levelLIKE?: InputMaybe<Scalars['u8']>;
  levelLT?: InputMaybe<Scalars['u8']>;
  levelLTE?: InputMaybe<Scalars['u8']>;
  levelNEQ?: InputMaybe<Scalars['u8']>;
  levelNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  levelNOTLIKE?: InputMaybe<Scalars['u8']>;
  payout?: InputMaybe<Scalars['u32']>;
  payoutEQ?: InputMaybe<Scalars['u32']>;
  payoutGT?: InputMaybe<Scalars['u32']>;
  payoutGTE?: InputMaybe<Scalars['u32']>;
  payoutIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  payoutLIKE?: InputMaybe<Scalars['u32']>;
  payoutLT?: InputMaybe<Scalars['u32']>;
  payoutLTE?: InputMaybe<Scalars['u32']>;
  payoutNEQ?: InputMaybe<Scalars['u32']>;
  payoutNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  payoutNOTLIKE?: InputMaybe<Scalars['u32']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  speed?: InputMaybe<Scalars['u8']>;
  speedEQ?: InputMaybe<Scalars['u8']>;
  speedGT?: InputMaybe<Scalars['u8']>;
  speedGTE?: InputMaybe<Scalars['u8']>;
  speedIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  speedLIKE?: InputMaybe<Scalars['u8']>;
  speedLT?: InputMaybe<Scalars['u8']>;
  speedLTE?: InputMaybe<Scalars['u8']>;
  speedNEQ?: InputMaybe<Scalars['u8']>;
  speedNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  speedNOTLIKE?: InputMaybe<Scalars['u8']>;
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnLIKE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
  turnNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_Traveled = {
  __typename?: 'dopewars_Traveled';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  from_location_id?: Maybe<Scalars['u8']>;
  game_id?: Maybe<Scalars['u32']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  to_location_id?: Maybe<Scalars['u8']>;
  turn?: Maybe<Scalars['u8']>;
};

export type Dopewars_TraveledConnection = {
  __typename?: 'dopewars_TraveledConnection';
  edges?: Maybe<Array<Maybe<Dopewars_TraveledEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_TraveledEdge = {
  __typename?: 'dopewars_TraveledEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_Traveled>;
};

export type Dopewars_TraveledOrder = {
  direction: OrderDirection;
  field: Dopewars_TraveledOrderField;
};

export enum Dopewars_TraveledOrderField {
  FromLocationId = 'FROM_LOCATION_ID',
  GameId = 'GAME_ID',
  PlayerId = 'PLAYER_ID',
  ToLocationId = 'TO_LOCATION_ID',
  Turn = 'TURN'
}

export type Dopewars_TraveledWhereInput = {
  from_location_id?: InputMaybe<Scalars['u8']>;
  from_location_idEQ?: InputMaybe<Scalars['u8']>;
  from_location_idGT?: InputMaybe<Scalars['u8']>;
  from_location_idGTE?: InputMaybe<Scalars['u8']>;
  from_location_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  from_location_idLIKE?: InputMaybe<Scalars['u8']>;
  from_location_idLT?: InputMaybe<Scalars['u8']>;
  from_location_idLTE?: InputMaybe<Scalars['u8']>;
  from_location_idNEQ?: InputMaybe<Scalars['u8']>;
  from_location_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  from_location_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  to_location_id?: InputMaybe<Scalars['u8']>;
  to_location_idEQ?: InputMaybe<Scalars['u8']>;
  to_location_idGT?: InputMaybe<Scalars['u8']>;
  to_location_idGTE?: InputMaybe<Scalars['u8']>;
  to_location_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  to_location_idLIKE?: InputMaybe<Scalars['u8']>;
  to_location_idLT?: InputMaybe<Scalars['u8']>;
  to_location_idLTE?: InputMaybe<Scalars['u8']>;
  to_location_idNEQ?: InputMaybe<Scalars['u8']>;
  to_location_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  to_location_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnLIKE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
  turnNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_UpgradeItem = {
  __typename?: 'dopewars_UpgradeItem';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  item_level?: Maybe<Scalars['u8']>;
  item_slot?: Maybe<Scalars['u8']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  turn?: Maybe<Scalars['u8']>;
};

export type Dopewars_UpgradeItemConnection = {
  __typename?: 'dopewars_UpgradeItemConnection';
  edges?: Maybe<Array<Maybe<Dopewars_UpgradeItemEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_UpgradeItemEdge = {
  __typename?: 'dopewars_UpgradeItemEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_UpgradeItem>;
};

export type Dopewars_UpgradeItemOrder = {
  direction: OrderDirection;
  field: Dopewars_UpgradeItemOrderField;
};

export enum Dopewars_UpgradeItemOrderField {
  GameId = 'GAME_ID',
  ItemLevel = 'ITEM_LEVEL',
  ItemSlot = 'ITEM_SLOT',
  PlayerId = 'PLAYER_ID',
  Turn = 'TURN'
}

export type Dopewars_UpgradeItemWhereInput = {
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  item_level?: InputMaybe<Scalars['u8']>;
  item_levelEQ?: InputMaybe<Scalars['u8']>;
  item_levelGT?: InputMaybe<Scalars['u8']>;
  item_levelGTE?: InputMaybe<Scalars['u8']>;
  item_levelIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  item_levelLIKE?: InputMaybe<Scalars['u8']>;
  item_levelLT?: InputMaybe<Scalars['u8']>;
  item_levelLTE?: InputMaybe<Scalars['u8']>;
  item_levelNEQ?: InputMaybe<Scalars['u8']>;
  item_levelNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  item_levelNOTLIKE?: InputMaybe<Scalars['u8']>;
  item_slot?: InputMaybe<Scalars['u8']>;
  item_slotEQ?: InputMaybe<Scalars['u8']>;
  item_slotGT?: InputMaybe<Scalars['u8']>;
  item_slotGTE?: InputMaybe<Scalars['u8']>;
  item_slotIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  item_slotLIKE?: InputMaybe<Scalars['u8']>;
  item_slotLT?: InputMaybe<Scalars['u8']>;
  item_slotLTE?: InputMaybe<Scalars['u8']>;
  item_slotNEQ?: InputMaybe<Scalars['u8']>;
  item_slotNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  item_slotNOTLIKE?: InputMaybe<Scalars['u8']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnLIKE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
  turnNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type ConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type ConfigQuery = { __typename?: 'World__Query', dopewarsRyoAddressModels?: { __typename?: 'dopewars_RyoAddressConnection', edges?: Array<{ __typename?: 'dopewars_RyoAddressEdge', node?: { __typename?: 'dopewars_RyoAddress', key?: any | null, paper?: any | null, treasury?: any | null, laundromat?: any | null } | null } | null> | null } | null, dopewarsRyoConfigModels?: { __typename?: 'dopewars_RyoConfigConnection', edges?: Array<{ __typename?: 'dopewars_RyoConfigEdge', node?: { __typename?: 'dopewars_RyoConfig', key?: any | null, initialized?: any | null, paused?: any | null, season_version?: any | null, season_duration?: any | null, season_time_limit?: any | null, paper_fee?: any | null, paper_reward_launderer?: any | null, treasury_fee_pct?: any | null, treasury_balance?: any | null } | null } | null> | null } | null, dopewarsDrugConfigModels?: { __typename?: 'dopewars_DrugConfigConnection', edges?: Array<{ __typename?: 'dopewars_DrugConfigEdge', node?: { __typename?: 'dopewars_DrugConfig', drugs_mode?: any | null, drug?: any | null, drug_id?: any | null, base?: any | null, step?: any | null, weight?: any | null, name?: { __typename?: 'dopewars_DrugConfig_Bytes16', value?: any | null } | null } | null } | null> | null } | null, dopewarsLocationConfigModels?: { __typename?: 'dopewars_LocationConfigConnection', edges?: Array<{ __typename?: 'dopewars_LocationConfigEdge', node?: { __typename?: 'dopewars_LocationConfig', location?: any | null, location_id?: any | null, name?: { __typename?: 'dopewars_LocationConfig_Bytes16', value?: any | null } | null } | null } | null> | null } | null, dopewarsHustlerItemBaseConfigModels?: { __typename?: 'dopewars_HustlerItemBaseConfigConnection', edges?: Array<{ __typename?: 'dopewars_HustlerItemBaseConfigEdge', node?: { __typename?: 'dopewars_HustlerItemBaseConfig', slot?: any | null, id?: any | null, slot_id?: any | null, name?: any | null, initial_tier?: any | null } | null } | null> | null } | null, dopewarsHustlerItemTiersConfigModels?: { __typename?: 'dopewars_HustlerItemTiersConfigConnection', edges?: Array<{ __typename?: 'dopewars_HustlerItemTiersConfigEdge', node?: { __typename?: 'dopewars_HustlerItemTiersConfig', slot?: any | null, slot_id?: any | null, tier?: any | null, cost?: any | null, stat?: any | null } | null } | null> | null } | null, dopewarsEncounterStatsConfigModels?: { __typename?: 'dopewars_EncounterStatsConfigConnection', edges?: Array<{ __typename?: 'dopewars_EncounterStatsConfigEdge', node?: { __typename?: 'dopewars_EncounterStatsConfig', encounters_mode?: any | null, encounter?: any | null, health_base?: any | null, health_step?: any | null, attack_base?: any | null, attack_step?: any | null, defense_base?: any | null, defense_step?: any | null, speed_base?: any | null, speed_step?: any | null } | null } | null> | null } | null };

export type GameConfigQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u16']>;
}>;


export type GameConfigQuery = { __typename?: 'World__Query', dopewarsGameConfigModels?: { __typename?: 'dopewars_GameConfigConnection', edges?: Array<{ __typename?: 'dopewars_GameConfigEdge', node?: { __typename?: 'dopewars_GameConfig', season_version?: any | null, cash?: any | null, health?: any | null, max_turns?: any | null, max_wanted_shopping?: any | null, rep_drug_step?: any | null, rep_buy_item?: any | null, rep_carry_drugs?: any | null, rep_hospitalized?: any | null, rep_jailed?: any | null } | null } | null> | null } | null };

export type AllGameConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type AllGameConfigQuery = { __typename?: 'World__Query', dopewarsGameConfigModels?: { __typename?: 'dopewars_GameConfigConnection', edges?: Array<{ __typename?: 'dopewars_GameConfigEdge', node?: { __typename?: 'dopewars_GameConfig', season_version?: any | null, cash?: any | null, health?: any | null, max_turns?: any | null, max_wanted_shopping?: any | null, rep_drug_step?: any | null, rep_buy_item?: any | null, rep_carry_drugs?: any | null, rep_hospitalized?: any | null, rep_jailed?: any | null } | null } | null> | null } | null };

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


export type GameByIdQuery = { __typename?: 'World__Query', dopewarsGameModels?: { __typename?: 'dopewars_GameConnection', edges?: Array<{ __typename?: 'dopewars_GameEdge', node?: { __typename?: 'dopewars_Game', season_version?: any | null, game_id?: any | null, game_mode?: any | null, hustler_id?: any | null, player_id?: any | null, game_over?: any | null, final_score?: any | null, registered?: any | null, claimed?: any | null, claimable?: any | null, position?: any | null, player_name?: { __typename?: 'dopewars_Game_Bytes16', value?: any | null } | null } | null } | null> | null } | null };

export type RegisteredGamesBySeasonQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u16']>;
}>;


export type RegisteredGamesBySeasonQuery = { __typename?: 'World__Query', dopewarsGameModels?: { __typename?: 'dopewars_GameConnection', edges?: Array<{ __typename?: 'dopewars_GameEdge', node?: { __typename?: 'dopewars_Game', season_version?: any | null, game_id?: any | null, player_id?: any | null, hustler_id?: any | null, final_score?: any | null, registered?: any | null, claimed?: any | null, claimable?: any | null, position?: any | null, player_name?: { __typename?: 'dopewars_Game_Bytes16', value?: any | null } | null } | null } | null> | null } | null };

export type GamesByPlayerQueryVariables = Exact<{
  playerId?: InputMaybe<Scalars['String']>;
}>;


export type GamesByPlayerQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', id?: string | null, keys?: Array<string | null> | null, models?: Array<{ __typename: 'dopewars_Claimed' } | { __typename: 'dopewars_DrugConfig' } | { __typename: 'dopewars_ERC20BalanceEvent' } | { __typename: 'dopewars_EncounterStatsConfig' } | { __typename: 'dopewars_Game', game_id?: any | null, player_id?: any | null, season_version?: any | null, game_mode?: any | null, hustler_id?: any | null, game_over?: any | null, final_score?: any | null, registered?: any | null, claimed?: any | null, claimable?: any | null, position?: any | null, player_name?: { __typename?: 'dopewars_Game_Bytes16', value?: any | null } | null } | { __typename: 'dopewars_GameConfig' } | { __typename: 'dopewars_GameCreated' } | { __typename: 'dopewars_GameOver' } | { __typename: 'dopewars_GameStorePacked', game_id?: any | null, player_id?: any | null, packed?: any | null } | { __typename: 'dopewars_HighVolatility' } | { __typename: 'dopewars_HustlerItemBaseConfig' } | { __typename: 'dopewars_HustlerItemTiersConfig' } | { __typename: 'dopewars_LocationConfig' } | { __typename: 'dopewars_NewHighScore' } | { __typename: 'dopewars_NewSeason' } | { __typename: 'dopewars_RyoAddress' } | { __typename: 'dopewars_RyoConfig' } | { __typename: 'dopewars_Season' } | { __typename: 'dopewars_SeasonSettings' } | { __typename: 'dopewars_SortedList' } | { __typename: 'dopewars_SortedListItem' } | { __typename: 'dopewars_TradeDrug' } | { __typename: 'dopewars_TravelEncounter' } | { __typename: 'dopewars_TravelEncounterResult' } | { __typename: 'dopewars_Traveled' } | { __typename: 'dopewars_UpgradeItem' } | null> | null } | null } | null> | null } | null };

export type GameStorePackedQueryVariables = Exact<{
  gameId: Scalars['String'];
  playerId: Scalars['String'];
}>;


export type GameStorePackedQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', id?: string | null, models?: Array<{ __typename: 'dopewars_Claimed' } | { __typename: 'dopewars_DrugConfig' } | { __typename: 'dopewars_ERC20BalanceEvent' } | { __typename: 'dopewars_EncounterStatsConfig' } | { __typename: 'dopewars_Game' } | { __typename: 'dopewars_GameConfig' } | { __typename: 'dopewars_GameCreated' } | { __typename: 'dopewars_GameOver' } | { __typename: 'dopewars_GameStorePacked', game_id?: any | null, player_id?: any | null, packed?: any | null } | { __typename: 'dopewars_HighVolatility' } | { __typename: 'dopewars_HustlerItemBaseConfig' } | { __typename: 'dopewars_HustlerItemTiersConfig' } | { __typename: 'dopewars_LocationConfig' } | { __typename: 'dopewars_NewHighScore' } | { __typename: 'dopewars_NewSeason' } | { __typename: 'dopewars_RyoAddress' } | { __typename: 'dopewars_RyoConfig' } | { __typename: 'dopewars_Season' } | { __typename: 'dopewars_SeasonSettings' } | { __typename: 'dopewars_SortedList' } | { __typename: 'dopewars_SortedListItem' } | { __typename: 'dopewars_TradeDrug' } | { __typename: 'dopewars_TravelEncounter' } | { __typename: 'dopewars_TravelEncounterResult' } | { __typename: 'dopewars_Traveled' } | { __typename: 'dopewars_UpgradeItem' } | null> | null } | null } | null> | null } | null };

export type GameStorePackedSubscriptionSubscriptionVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type GameStorePackedSubscriptionSubscription = { __typename?: 'World__Subscription', entityUpdated: { __typename?: 'World__Entity', id?: string | null, keys?: Array<string | null> | null, models?: Array<{ __typename: 'dopewars_Claimed' } | { __typename: 'dopewars_DrugConfig' } | { __typename: 'dopewars_ERC20BalanceEvent' } | { __typename: 'dopewars_EncounterStatsConfig' } | { __typename: 'dopewars_Game' } | { __typename: 'dopewars_GameConfig' } | { __typename: 'dopewars_GameCreated' } | { __typename: 'dopewars_GameOver' } | { __typename: 'dopewars_GameStorePacked', game_id?: any | null, player_id?: any | null, packed?: any | null } | { __typename: 'dopewars_HighVolatility' } | { __typename: 'dopewars_HustlerItemBaseConfig' } | { __typename: 'dopewars_HustlerItemTiersConfig' } | { __typename: 'dopewars_LocationConfig' } | { __typename: 'dopewars_NewHighScore' } | { __typename: 'dopewars_NewSeason' } | { __typename: 'dopewars_RyoAddress' } | { __typename: 'dopewars_RyoConfig' } | { __typename: 'dopewars_Season' } | { __typename: 'dopewars_SeasonSettings' } | { __typename: 'dopewars_SortedList' } | { __typename: 'dopewars_SortedListItem' } | { __typename: 'dopewars_TradeDrug' } | { __typename: 'dopewars_TravelEncounter' } | { __typename: 'dopewars_TravelEncounterResult' } | { __typename: 'dopewars_Traveled' } | { __typename: 'dopewars_UpgradeItem' } | null> | null } };

export type TravelEncounterByPlayerQueryVariables = Exact<{
  travelEncounterSelector?: InputMaybe<Scalars['String']>;
  playerId?: InputMaybe<Scalars['String']>;
}>;


export type TravelEncounterByPlayerQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null } | null } | null> | null } | null };

export type TravelEncounterResultsByPlayerQueryVariables = Exact<{
  travelEncounterResultSelector?: InputMaybe<Scalars['String']>;
  playerId?: InputMaybe<Scalars['String']>;
}>;


export type TravelEncounterResultsByPlayerQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null } | null } | null> | null } | null };

export type TradedDrugByPlayerQueryVariables = Exact<{
  tradeDrugSelector?: InputMaybe<Scalars['String']>;
  playerId?: InputMaybe<Scalars['String']>;
}>;


export type TradedDrugByPlayerQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null } | null } | null> | null } | null };

export type GetAllGamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllGamesQuery = { __typename?: 'World__Query', dopewarsGameModels?: { __typename?: 'dopewars_GameConnection', edges?: Array<{ __typename?: 'dopewars_GameEdge', node?: { __typename?: 'dopewars_Game', game_id?: any | null, player_id?: any | null, season_version?: any | null, position?: any | null, final_score?: any | null, claimable?: any | null, claimed?: any | null, player_name?: { __typename?: 'dopewars_Game_Bytes16', value?: any | null } | null } | null } | null> | null } | null };

export type SeasonByVersionQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u16']>;
  listId?: InputMaybe<Scalars['felt252']>;
}>;


export type SeasonByVersionQuery = { __typename?: 'World__Query', dopewarsSeasonModels?: { __typename?: 'dopewars_SeasonConnection', edges?: Array<{ __typename?: 'dopewars_SeasonEdge', node?: { __typename?: 'dopewars_Season', version?: any | null, season_duration?: any | null, season_time_limit?: any | null, paper_fee?: any | null, treasury_fee_pct?: any | null, next_version_timestamp?: any | null, paper_balance?: any | null } | null } | null> | null } | null, dopewarsSeasonSettingsModels?: { __typename?: 'dopewars_SeasonSettingsConnection', edges?: Array<{ __typename?: 'dopewars_SeasonSettingsEdge', node?: { __typename?: 'dopewars_SeasonSettings', season_version?: any | null, cash_mode?: any | null, health_mode?: any | null, turns_mode?: any | null, drugs_mode?: any | null, encounters_mode?: any | null, encounters_odds_mode?: any | null, wanted_mode?: any | null } | null } | null> | null } | null, dopewarsSortedListModels?: { __typename?: 'dopewars_SortedListConnection', edges?: Array<{ __typename?: 'dopewars_SortedListEdge', node?: { __typename?: 'dopewars_SortedList', list_id?: any | null, size?: any | null, locked?: any | null, processed?: any | null, process_size?: any | null, process_max_size?: any | null } | null } | null> | null } | null };

export type SeasonsQueryVariables = Exact<{ [key: string]: never; }>;


export type SeasonsQuery = { __typename?: 'World__Query', dopewarsSeasonModels?: { __typename?: 'dopewars_SeasonConnection', edges?: Array<{ __typename?: 'dopewars_SeasonEdge', node?: { __typename?: 'dopewars_Season', version?: any | null, season_duration?: any | null, season_time_limit?: any | null, paper_fee?: any | null, treasury_fee_pct?: any | null, next_version_timestamp?: any | null, paper_balance?: any | null } | null } | null> | null } | null, dopewarsSeasonSettingsModels?: { __typename?: 'dopewars_SeasonSettingsConnection', edges?: Array<{ __typename?: 'dopewars_SeasonSettingsEdge', node?: { __typename?: 'dopewars_SeasonSettings', season_version?: any | null, cash_mode?: any | null, health_mode?: any | null, turns_mode?: any | null, drugs_mode?: any | null, encounters_mode?: any | null, encounters_odds_mode?: any | null } | null } | null> | null } | null, dopewarsSortedListModels?: { __typename?: 'dopewars_SortedListConnection', edges?: Array<{ __typename?: 'dopewars_SortedListEdge', node?: { __typename?: 'dopewars_SortedList', list_id?: any | null, size?: any | null, locked?: any | null, processed?: any | null, process_size?: any | null, process_max_size?: any | null } | null } | null> | null } | null };

export type SeasonSettingsQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u16']>;
}>;


export type SeasonSettingsQuery = { __typename?: 'World__Query', dopewarsSeasonSettingsModels?: { __typename?: 'dopewars_SeasonSettingsConnection', edges?: Array<{ __typename?: 'dopewars_SeasonSettingsEdge', node?: { __typename?: 'dopewars_SeasonSettings', season_version?: any | null, cash_mode?: any | null, health_mode?: any | null, turns_mode?: any | null, drugs_mode?: any | null, encounters_mode?: any | null, encounters_odds_mode?: any | null } | null } | null> | null } | null };

export type AllSeasonSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllSeasonSettingsQuery = { __typename?: 'World__Query', dopewarsSeasonSettingsModels?: { __typename?: 'dopewars_SeasonSettingsConnection', edges?: Array<{ __typename?: 'dopewars_SeasonSettingsEdge', node?: { __typename?: 'dopewars_SeasonSettings', season_version?: any | null, cash_mode?: any | null, health_mode?: any | null, turns_mode?: any | null, drugs_mode?: any | null, encounters_mode?: any | null, encounters_odds_mode?: any | null } | null } | null> | null } | null };

export type HallOfFameQueryVariables = Exact<{ [key: string]: never; }>;


export type HallOfFameQuery = { __typename?: 'World__Query', dopewarsGameModels?: { __typename?: 'dopewars_GameConnection', edges?: Array<{ __typename?: 'dopewars_GameEdge', node?: { __typename?: 'dopewars_Game', game_id?: any | null, player_id?: any | null, hustler_id?: any | null, season_version?: any | null, final_score?: any | null, position?: any | null, claimable?: any | null, player_name?: { __typename?: 'dopewars_Game_Bytes16', value?: any | null } | null } | null } | null> | null } | null };

export type ClaimableQueryVariables = Exact<{
  playerId?: InputMaybe<Scalars['ContractAddress']>;
}>;


export type ClaimableQuery = { __typename?: 'World__Query', dopewarsGameModels?: { __typename?: 'dopewars_GameConnection', edges?: Array<{ __typename?: 'dopewars_GameEdge', node?: { __typename?: 'dopewars_Game', game_id?: any | null, season_version?: any | null, player_id?: any | null, hustler_id?: any | null, claimed?: any | null, claimable?: any | null, final_score?: any | null, position?: any | null, player_name?: { __typename?: 'dopewars_Game_Bytes16', value?: any | null } | null } | null } | null> | null } | null };

export type GameOverEventsQueryVariables = Exact<{
  gameOverSelector?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['String']>;
}>;


export type GameOverEventsQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, transactionHash?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null, createdAt?: any | null } | null } | null> | null } | null };


export const ConfigDocument = `
    query Config {
  dopewarsRyoAddressModels(limit: 1) {
    edges {
      node {
        key
        paper
        treasury
        laundromat
      }
    }
  }
  dopewarsRyoConfigModels(limit: 1) {
    edges {
      node {
        key
        initialized
        paused
        season_version
        season_duration
        season_time_limit
        paper_fee
        paper_reward_launderer
        treasury_fee_pct
        treasury_balance
      }
    }
  }
  dopewarsDrugConfigModels(limit: 24, order: {field: DRUG_ID, direction: ASC}) {
    edges {
      node {
        drugs_mode
        drug
        drug_id
        base
        step
        weight
        name {
          value
        }
      }
    }
  }
  dopewarsLocationConfigModels(order: {field: LOCATION_ID, direction: ASC}) {
    edges {
      node {
        location
        location_id
        name {
          value
        }
      }
    }
  }
  dopewarsHustlerItemBaseConfigModels {
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
  dopewarsHustlerItemTiersConfigModels(limit: 24) {
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
  dopewarsEncounterStatsConfigModels(limit: 100) {
    edges {
      node {
        encounters_mode
        encounter
        health_base
        health_step
        attack_base
        attack_step
        defense_base
        defense_step
        speed_base
        speed_step
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

export const GameConfigDocument = `
    query GameConfig($version: u16) {
  dopewarsGameConfigModels(where: {season_version: $version}) {
    edges {
      node {
        season_version
        cash
        health
        max_turns
        max_wanted_shopping
        rep_drug_step
        rep_buy_item
        rep_carry_drugs
        rep_hospitalized
        rep_jailed
      }
    }
  }
}
    `;
export const useGameConfigQuery = <
      TData = GameConfigQuery,
      TError = unknown
    >(
      variables?: GameConfigQueryVariables,
      options?: UseQueryOptions<GameConfigQuery, TError, TData>
    ) =>
    useQuery<GameConfigQuery, TError, TData>(
      variables === undefined ? ['GameConfig'] : ['GameConfig', variables],
      useFetchData<GameConfigQuery, GameConfigQueryVariables>(GameConfigDocument).bind(null, variables),
      options
    );

useGameConfigQuery.getKey = (variables?: GameConfigQueryVariables) => variables === undefined ? ['GameConfig'] : ['GameConfig', variables];
;

export const useInfiniteGameConfigQuery = <
      TData = GameConfigQuery,
      TError = unknown
    >(
      variables?: GameConfigQueryVariables,
      options?: UseInfiniteQueryOptions<GameConfigQuery, TError, TData>
    ) =>{
    const query = useFetchData<GameConfigQuery, GameConfigQueryVariables>(GameConfigDocument)
    return useInfiniteQuery<GameConfigQuery, TError, TData>(
      variables === undefined ? ['GameConfig.infinite'] : ['GameConfig.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGameConfigQuery.getKey = (variables?: GameConfigQueryVariables) => variables === undefined ? ['GameConfig.infinite'] : ['GameConfig.infinite', variables];
;

export const AllGameConfigDocument = `
    query AllGameConfig {
  dopewarsGameConfigModels(limit: 420) {
    edges {
      node {
        season_version
        cash
        health
        max_turns
        max_wanted_shopping
        rep_drug_step
        rep_buy_item
        rep_carry_drugs
        rep_hospitalized
        rep_jailed
      }
    }
  }
}
    `;
export const useAllGameConfigQuery = <
      TData = AllGameConfigQuery,
      TError = unknown
    >(
      variables?: AllGameConfigQueryVariables,
      options?: UseQueryOptions<AllGameConfigQuery, TError, TData>
    ) =>
    useQuery<AllGameConfigQuery, TError, TData>(
      variables === undefined ? ['AllGameConfig'] : ['AllGameConfig', variables],
      useFetchData<AllGameConfigQuery, AllGameConfigQueryVariables>(AllGameConfigDocument).bind(null, variables),
      options
    );

useAllGameConfigQuery.getKey = (variables?: AllGameConfigQueryVariables) => variables === undefined ? ['AllGameConfig'] : ['AllGameConfig', variables];
;

export const useInfiniteAllGameConfigQuery = <
      TData = AllGameConfigQuery,
      TError = unknown
    >(
      variables?: AllGameConfigQueryVariables,
      options?: UseInfiniteQueryOptions<AllGameConfigQuery, TError, TData>
    ) =>{
    const query = useFetchData<AllGameConfigQuery, AllGameConfigQueryVariables>(AllGameConfigDocument)
    return useInfiniteQuery<AllGameConfigQuery, TError, TData>(
      variables === undefined ? ['AllGameConfig.infinite'] : ['AllGameConfig.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteAllGameConfigQuery.getKey = (variables?: AllGameConfigQueryVariables) => variables === undefined ? ['AllGameConfig.infinite'] : ['AllGameConfig.infinite', variables];
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
  dopewarsGameModels(where: {game_id: $gameId}) {
    edges {
      node {
        season_version
        game_id
        game_mode
        hustler_id
        player_name {
          value
        }
        player_id
        game_over
        final_score
        registered
        claimed
        claimable
        position
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

export const RegisteredGamesBySeasonDocument = `
    query RegisteredGamesBySeason($version: u16) {
  dopewarsGameModels(
    limit: 9001
    where: {season_version: $version, registered: true}
    order: {field: FINAL_SCORE, direction: DESC}
  ) {
    edges {
      node {
        season_version
        game_id
        player_id
        player_name {
          value
        }
        hustler_id
        final_score
        registered
        claimed
        claimable
        position
      }
    }
  }
}
    `;
export const useRegisteredGamesBySeasonQuery = <
      TData = RegisteredGamesBySeasonQuery,
      TError = unknown
    >(
      variables?: RegisteredGamesBySeasonQueryVariables,
      options?: UseQueryOptions<RegisteredGamesBySeasonQuery, TError, TData>
    ) =>
    useQuery<RegisteredGamesBySeasonQuery, TError, TData>(
      variables === undefined ? ['RegisteredGamesBySeason'] : ['RegisteredGamesBySeason', variables],
      useFetchData<RegisteredGamesBySeasonQuery, RegisteredGamesBySeasonQueryVariables>(RegisteredGamesBySeasonDocument).bind(null, variables),
      options
    );

useRegisteredGamesBySeasonQuery.getKey = (variables?: RegisteredGamesBySeasonQueryVariables) => variables === undefined ? ['RegisteredGamesBySeason'] : ['RegisteredGamesBySeason', variables];
;

export const useInfiniteRegisteredGamesBySeasonQuery = <
      TData = RegisteredGamesBySeasonQuery,
      TError = unknown
    >(
      variables?: RegisteredGamesBySeasonQueryVariables,
      options?: UseInfiniteQueryOptions<RegisteredGamesBySeasonQuery, TError, TData>
    ) =>{
    const query = useFetchData<RegisteredGamesBySeasonQuery, RegisteredGamesBySeasonQueryVariables>(RegisteredGamesBySeasonDocument)
    return useInfiniteQuery<RegisteredGamesBySeasonQuery, TError, TData>(
      variables === undefined ? ['RegisteredGamesBySeason.infinite'] : ['RegisteredGamesBySeason.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteRegisteredGamesBySeasonQuery.getKey = (variables?: RegisteredGamesBySeasonQueryVariables) => variables === undefined ? ['RegisteredGamesBySeason.infinite'] : ['RegisteredGamesBySeason.infinite', variables];
;

export const GamesByPlayerDocument = `
    query GamesByPlayer($playerId: String) {
  entities(limit: 9001, keys: ["*", $playerId]) {
    edges {
      node {
        id
        keys
        models {
          __typename
          ... on dopewars_Game {
            game_id
            player_id
            season_version
            game_mode
            hustler_id
            player_name {
              value
            }
            game_over
            final_score
            registered
            claimed
            claimable
            position
          }
          ... on dopewars_GameStorePacked {
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
export const useGamesByPlayerQuery = <
      TData = GamesByPlayerQuery,
      TError = unknown
    >(
      variables?: GamesByPlayerQueryVariables,
      options?: UseQueryOptions<GamesByPlayerQuery, TError, TData>
    ) =>
    useQuery<GamesByPlayerQuery, TError, TData>(
      variables === undefined ? ['GamesByPlayer'] : ['GamesByPlayer', variables],
      useFetchData<GamesByPlayerQuery, GamesByPlayerQueryVariables>(GamesByPlayerDocument).bind(null, variables),
      options
    );

useGamesByPlayerQuery.getKey = (variables?: GamesByPlayerQueryVariables) => variables === undefined ? ['GamesByPlayer'] : ['GamesByPlayer', variables];
;

export const useInfiniteGamesByPlayerQuery = <
      TData = GamesByPlayerQuery,
      TError = unknown
    >(
      variables?: GamesByPlayerQueryVariables,
      options?: UseInfiniteQueryOptions<GamesByPlayerQuery, TError, TData>
    ) =>{
    const query = useFetchData<GamesByPlayerQuery, GamesByPlayerQueryVariables>(GamesByPlayerDocument)
    return useInfiniteQuery<GamesByPlayerQuery, TError, TData>(
      variables === undefined ? ['GamesByPlayer.infinite'] : ['GamesByPlayer.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGamesByPlayerQuery.getKey = (variables?: GamesByPlayerQueryVariables) => variables === undefined ? ['GamesByPlayer.infinite'] : ['GamesByPlayer.infinite', variables];
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
          ... on dopewars_GameStorePacked {
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
      ... on dopewars_GameStorePacked {
        game_id
        player_id
        packed
      }
    }
  }
}
    `;
export const TravelEncounterByPlayerDocument = `
    query TravelEncounterByPlayer($travelEncounterSelector: String, $playerId: String) {
  events(limit: 99999, keys: [$travelEncounterSelector, "*", $playerId]) {
    edges {
      node {
        id
        keys
        data
      }
    }
  }
}
    `;
export const useTravelEncounterByPlayerQuery = <
      TData = TravelEncounterByPlayerQuery,
      TError = unknown
    >(
      variables?: TravelEncounterByPlayerQueryVariables,
      options?: UseQueryOptions<TravelEncounterByPlayerQuery, TError, TData>
    ) =>
    useQuery<TravelEncounterByPlayerQuery, TError, TData>(
      variables === undefined ? ['TravelEncounterByPlayer'] : ['TravelEncounterByPlayer', variables],
      useFetchData<TravelEncounterByPlayerQuery, TravelEncounterByPlayerQueryVariables>(TravelEncounterByPlayerDocument).bind(null, variables),
      options
    );

useTravelEncounterByPlayerQuery.getKey = (variables?: TravelEncounterByPlayerQueryVariables) => variables === undefined ? ['TravelEncounterByPlayer'] : ['TravelEncounterByPlayer', variables];
;

export const useInfiniteTravelEncounterByPlayerQuery = <
      TData = TravelEncounterByPlayerQuery,
      TError = unknown
    >(
      variables?: TravelEncounterByPlayerQueryVariables,
      options?: UseInfiniteQueryOptions<TravelEncounterByPlayerQuery, TError, TData>
    ) =>{
    const query = useFetchData<TravelEncounterByPlayerQuery, TravelEncounterByPlayerQueryVariables>(TravelEncounterByPlayerDocument)
    return useInfiniteQuery<TravelEncounterByPlayerQuery, TError, TData>(
      variables === undefined ? ['TravelEncounterByPlayer.infinite'] : ['TravelEncounterByPlayer.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteTravelEncounterByPlayerQuery.getKey = (variables?: TravelEncounterByPlayerQueryVariables) => variables === undefined ? ['TravelEncounterByPlayer.infinite'] : ['TravelEncounterByPlayer.infinite', variables];
;

export const TravelEncounterResultsByPlayerDocument = `
    query TravelEncounterResultsByPlayer($travelEncounterResultSelector: String, $playerId: String) {
  events(limit: 99999, keys: [$travelEncounterResultSelector, "*", $playerId]) {
    edges {
      node {
        id
        keys
        data
      }
    }
  }
}
    `;
export const useTravelEncounterResultsByPlayerQuery = <
      TData = TravelEncounterResultsByPlayerQuery,
      TError = unknown
    >(
      variables?: TravelEncounterResultsByPlayerQueryVariables,
      options?: UseQueryOptions<TravelEncounterResultsByPlayerQuery, TError, TData>
    ) =>
    useQuery<TravelEncounterResultsByPlayerQuery, TError, TData>(
      variables === undefined ? ['TravelEncounterResultsByPlayer'] : ['TravelEncounterResultsByPlayer', variables],
      useFetchData<TravelEncounterResultsByPlayerQuery, TravelEncounterResultsByPlayerQueryVariables>(TravelEncounterResultsByPlayerDocument).bind(null, variables),
      options
    );

useTravelEncounterResultsByPlayerQuery.getKey = (variables?: TravelEncounterResultsByPlayerQueryVariables) => variables === undefined ? ['TravelEncounterResultsByPlayer'] : ['TravelEncounterResultsByPlayer', variables];
;

export const useInfiniteTravelEncounterResultsByPlayerQuery = <
      TData = TravelEncounterResultsByPlayerQuery,
      TError = unknown
    >(
      variables?: TravelEncounterResultsByPlayerQueryVariables,
      options?: UseInfiniteQueryOptions<TravelEncounterResultsByPlayerQuery, TError, TData>
    ) =>{
    const query = useFetchData<TravelEncounterResultsByPlayerQuery, TravelEncounterResultsByPlayerQueryVariables>(TravelEncounterResultsByPlayerDocument)
    return useInfiniteQuery<TravelEncounterResultsByPlayerQuery, TError, TData>(
      variables === undefined ? ['TravelEncounterResultsByPlayer.infinite'] : ['TravelEncounterResultsByPlayer.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteTravelEncounterResultsByPlayerQuery.getKey = (variables?: TravelEncounterResultsByPlayerQueryVariables) => variables === undefined ? ['TravelEncounterResultsByPlayer.infinite'] : ['TravelEncounterResultsByPlayer.infinite', variables];
;

export const TradedDrugByPlayerDocument = `
    query TradedDrugByPlayer($tradeDrugSelector: String, $playerId: String) {
  events(limit: 99999, keys: [$tradeDrugSelector, "*", $playerId]) {
    edges {
      node {
        id
        keys
        data
      }
    }
  }
}
    `;
export const useTradedDrugByPlayerQuery = <
      TData = TradedDrugByPlayerQuery,
      TError = unknown
    >(
      variables?: TradedDrugByPlayerQueryVariables,
      options?: UseQueryOptions<TradedDrugByPlayerQuery, TError, TData>
    ) =>
    useQuery<TradedDrugByPlayerQuery, TError, TData>(
      variables === undefined ? ['TradedDrugByPlayer'] : ['TradedDrugByPlayer', variables],
      useFetchData<TradedDrugByPlayerQuery, TradedDrugByPlayerQueryVariables>(TradedDrugByPlayerDocument).bind(null, variables),
      options
    );

useTradedDrugByPlayerQuery.getKey = (variables?: TradedDrugByPlayerQueryVariables) => variables === undefined ? ['TradedDrugByPlayer'] : ['TradedDrugByPlayer', variables];
;

export const useInfiniteTradedDrugByPlayerQuery = <
      TData = TradedDrugByPlayerQuery,
      TError = unknown
    >(
      variables?: TradedDrugByPlayerQueryVariables,
      options?: UseInfiniteQueryOptions<TradedDrugByPlayerQuery, TError, TData>
    ) =>{
    const query = useFetchData<TradedDrugByPlayerQuery, TradedDrugByPlayerQueryVariables>(TradedDrugByPlayerDocument)
    return useInfiniteQuery<TradedDrugByPlayerQuery, TError, TData>(
      variables === undefined ? ['TradedDrugByPlayer.infinite'] : ['TradedDrugByPlayer.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteTradedDrugByPlayerQuery.getKey = (variables?: TradedDrugByPlayerQueryVariables) => variables === undefined ? ['TradedDrugByPlayer.infinite'] : ['TradedDrugByPlayer.infinite', variables];
;

export const GetAllGamesDocument = `
    query GetAllGames {
  dopewarsGameModels(limit: 9001) {
    edges {
      node {
        game_id
        player_id
        season_version
        position
        player_name {
          value
        }
        final_score
        claimable
        claimed
      }
    }
  }
}
    `;
export const useGetAllGamesQuery = <
      TData = GetAllGamesQuery,
      TError = unknown
    >(
      variables?: GetAllGamesQueryVariables,
      options?: UseQueryOptions<GetAllGamesQuery, TError, TData>
    ) =>
    useQuery<GetAllGamesQuery, TError, TData>(
      variables === undefined ? ['GetAllGames'] : ['GetAllGames', variables],
      useFetchData<GetAllGamesQuery, GetAllGamesQueryVariables>(GetAllGamesDocument).bind(null, variables),
      options
    );

useGetAllGamesQuery.getKey = (variables?: GetAllGamesQueryVariables) => variables === undefined ? ['GetAllGames'] : ['GetAllGames', variables];
;

export const useInfiniteGetAllGamesQuery = <
      TData = GetAllGamesQuery,
      TError = unknown
    >(
      variables?: GetAllGamesQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllGamesQuery, TError, TData>
    ) =>{
    const query = useFetchData<GetAllGamesQuery, GetAllGamesQueryVariables>(GetAllGamesDocument)
    return useInfiniteQuery<GetAllGamesQuery, TError, TData>(
      variables === undefined ? ['GetAllGames.infinite'] : ['GetAllGames.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGetAllGamesQuery.getKey = (variables?: GetAllGamesQueryVariables) => variables === undefined ? ['GetAllGames.infinite'] : ['GetAllGames.infinite', variables];
;

export const SeasonByVersionDocument = `
    query SeasonByVersion($version: u16, $listId: felt252) {
  dopewarsSeasonModels(where: {version: $version}) {
    edges {
      node {
        version
        season_duration
        season_time_limit
        paper_fee
        treasury_fee_pct
        next_version_timestamp
        paper_balance
      }
    }
  }
  dopewarsSeasonSettingsModels(where: {season_version: $version}) {
    edges {
      node {
        season_version
        cash_mode
        health_mode
        turns_mode
        drugs_mode
        encounters_mode
        encounters_odds_mode
        wanted_mode
      }
    }
  }
  dopewarsSortedListModels(where: {list_id: $listId}) {
    edges {
      node {
        list_id
        size
        locked
        processed
        process_size
        process_max_size
      }
    }
  }
}
    `;
export const useSeasonByVersionQuery = <
      TData = SeasonByVersionQuery,
      TError = unknown
    >(
      variables?: SeasonByVersionQueryVariables,
      options?: UseQueryOptions<SeasonByVersionQuery, TError, TData>
    ) =>
    useQuery<SeasonByVersionQuery, TError, TData>(
      variables === undefined ? ['SeasonByVersion'] : ['SeasonByVersion', variables],
      useFetchData<SeasonByVersionQuery, SeasonByVersionQueryVariables>(SeasonByVersionDocument).bind(null, variables),
      options
    );

useSeasonByVersionQuery.getKey = (variables?: SeasonByVersionQueryVariables) => variables === undefined ? ['SeasonByVersion'] : ['SeasonByVersion', variables];
;

export const useInfiniteSeasonByVersionQuery = <
      TData = SeasonByVersionQuery,
      TError = unknown
    >(
      variables?: SeasonByVersionQueryVariables,
      options?: UseInfiniteQueryOptions<SeasonByVersionQuery, TError, TData>
    ) =>{
    const query = useFetchData<SeasonByVersionQuery, SeasonByVersionQueryVariables>(SeasonByVersionDocument)
    return useInfiniteQuery<SeasonByVersionQuery, TError, TData>(
      variables === undefined ? ['SeasonByVersion.infinite'] : ['SeasonByVersion.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteSeasonByVersionQuery.getKey = (variables?: SeasonByVersionQueryVariables) => variables === undefined ? ['SeasonByVersion.infinite'] : ['SeasonByVersion.infinite', variables];
;

export const SeasonsDocument = `
    query Seasons {
  dopewarsSeasonModels(limit: 420, order: {field: VERSION, direction: DESC}) {
    edges {
      node {
        version
        season_duration
        season_time_limit
        paper_fee
        treasury_fee_pct
        next_version_timestamp
        paper_balance
      }
    }
  }
  dopewarsSeasonSettingsModels(limit: 420) {
    edges {
      node {
        season_version
        cash_mode
        health_mode
        turns_mode
        drugs_mode
        encounters_mode
        encounters_odds_mode
      }
    }
  }
  dopewarsSortedListModels(limit: 420) {
    edges {
      node {
        list_id
        size
        locked
        processed
        process_size
        process_max_size
      }
    }
  }
}
    `;
export const useSeasonsQuery = <
      TData = SeasonsQuery,
      TError = unknown
    >(
      variables?: SeasonsQueryVariables,
      options?: UseQueryOptions<SeasonsQuery, TError, TData>
    ) =>
    useQuery<SeasonsQuery, TError, TData>(
      variables === undefined ? ['Seasons'] : ['Seasons', variables],
      useFetchData<SeasonsQuery, SeasonsQueryVariables>(SeasonsDocument).bind(null, variables),
      options
    );

useSeasonsQuery.getKey = (variables?: SeasonsQueryVariables) => variables === undefined ? ['Seasons'] : ['Seasons', variables];
;

export const useInfiniteSeasonsQuery = <
      TData = SeasonsQuery,
      TError = unknown
    >(
      variables?: SeasonsQueryVariables,
      options?: UseInfiniteQueryOptions<SeasonsQuery, TError, TData>
    ) =>{
    const query = useFetchData<SeasonsQuery, SeasonsQueryVariables>(SeasonsDocument)
    return useInfiniteQuery<SeasonsQuery, TError, TData>(
      variables === undefined ? ['Seasons.infinite'] : ['Seasons.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteSeasonsQuery.getKey = (variables?: SeasonsQueryVariables) => variables === undefined ? ['Seasons.infinite'] : ['Seasons.infinite', variables];
;

export const SeasonSettingsDocument = `
    query SeasonSettings($version: u16) {
  dopewarsSeasonSettingsModels(where: {season_version: $version}) {
    edges {
      node {
        season_version
        cash_mode
        health_mode
        turns_mode
        drugs_mode
        encounters_mode
        encounters_odds_mode
      }
    }
  }
}
    `;
export const useSeasonSettingsQuery = <
      TData = SeasonSettingsQuery,
      TError = unknown
    >(
      variables?: SeasonSettingsQueryVariables,
      options?: UseQueryOptions<SeasonSettingsQuery, TError, TData>
    ) =>
    useQuery<SeasonSettingsQuery, TError, TData>(
      variables === undefined ? ['SeasonSettings'] : ['SeasonSettings', variables],
      useFetchData<SeasonSettingsQuery, SeasonSettingsQueryVariables>(SeasonSettingsDocument).bind(null, variables),
      options
    );

useSeasonSettingsQuery.getKey = (variables?: SeasonSettingsQueryVariables) => variables === undefined ? ['SeasonSettings'] : ['SeasonSettings', variables];
;

export const useInfiniteSeasonSettingsQuery = <
      TData = SeasonSettingsQuery,
      TError = unknown
    >(
      variables?: SeasonSettingsQueryVariables,
      options?: UseInfiniteQueryOptions<SeasonSettingsQuery, TError, TData>
    ) =>{
    const query = useFetchData<SeasonSettingsQuery, SeasonSettingsQueryVariables>(SeasonSettingsDocument)
    return useInfiniteQuery<SeasonSettingsQuery, TError, TData>(
      variables === undefined ? ['SeasonSettings.infinite'] : ['SeasonSettings.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteSeasonSettingsQuery.getKey = (variables?: SeasonSettingsQueryVariables) => variables === undefined ? ['SeasonSettings.infinite'] : ['SeasonSettings.infinite', variables];
;

export const AllSeasonSettingsDocument = `
    query AllSeasonSettings {
  dopewarsSeasonSettingsModels(limit: 420) {
    edges {
      node {
        season_version
        cash_mode
        health_mode
        turns_mode
        drugs_mode
        encounters_mode
        encounters_odds_mode
      }
    }
  }
}
    `;
export const useAllSeasonSettingsQuery = <
      TData = AllSeasonSettingsQuery,
      TError = unknown
    >(
      variables?: AllSeasonSettingsQueryVariables,
      options?: UseQueryOptions<AllSeasonSettingsQuery, TError, TData>
    ) =>
    useQuery<AllSeasonSettingsQuery, TError, TData>(
      variables === undefined ? ['AllSeasonSettings'] : ['AllSeasonSettings', variables],
      useFetchData<AllSeasonSettingsQuery, AllSeasonSettingsQueryVariables>(AllSeasonSettingsDocument).bind(null, variables),
      options
    );

useAllSeasonSettingsQuery.getKey = (variables?: AllSeasonSettingsQueryVariables) => variables === undefined ? ['AllSeasonSettings'] : ['AllSeasonSettings', variables];
;

export const useInfiniteAllSeasonSettingsQuery = <
      TData = AllSeasonSettingsQuery,
      TError = unknown
    >(
      variables?: AllSeasonSettingsQueryVariables,
      options?: UseInfiniteQueryOptions<AllSeasonSettingsQuery, TError, TData>
    ) =>{
    const query = useFetchData<AllSeasonSettingsQuery, AllSeasonSettingsQueryVariables>(AllSeasonSettingsDocument)
    return useInfiniteQuery<AllSeasonSettingsQuery, TError, TData>(
      variables === undefined ? ['AllSeasonSettings.infinite'] : ['AllSeasonSettings.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteAllSeasonSettingsQuery.getKey = (variables?: AllSeasonSettingsQueryVariables) => variables === undefined ? ['AllSeasonSettings.infinite'] : ['AllSeasonSettings.infinite', variables];
;

export const HallOfFameDocument = `
    query HallOfFame {
  dopewarsGameModels(
    limit: 420
    where: {position: 1}
    order: {field: SEASON_VERSION, direction: DESC}
  ) {
    edges {
      node {
        game_id
        player_id
        player_name {
          value
        }
        hustler_id
        season_version
        final_score
        position
        claimable
      }
    }
  }
}
    `;
export const useHallOfFameQuery = <
      TData = HallOfFameQuery,
      TError = unknown
    >(
      variables?: HallOfFameQueryVariables,
      options?: UseQueryOptions<HallOfFameQuery, TError, TData>
    ) =>
    useQuery<HallOfFameQuery, TError, TData>(
      variables === undefined ? ['HallOfFame'] : ['HallOfFame', variables],
      useFetchData<HallOfFameQuery, HallOfFameQueryVariables>(HallOfFameDocument).bind(null, variables),
      options
    );

useHallOfFameQuery.getKey = (variables?: HallOfFameQueryVariables) => variables === undefined ? ['HallOfFame'] : ['HallOfFame', variables];
;

export const useInfiniteHallOfFameQuery = <
      TData = HallOfFameQuery,
      TError = unknown
    >(
      variables?: HallOfFameQueryVariables,
      options?: UseInfiniteQueryOptions<HallOfFameQuery, TError, TData>
    ) =>{
    const query = useFetchData<HallOfFameQuery, HallOfFameQueryVariables>(HallOfFameDocument)
    return useInfiniteQuery<HallOfFameQuery, TError, TData>(
      variables === undefined ? ['HallOfFame.infinite'] : ['HallOfFame.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteHallOfFameQuery.getKey = (variables?: HallOfFameQueryVariables) => variables === undefined ? ['HallOfFame.infinite'] : ['HallOfFame.infinite', variables];
;

export const ClaimableDocument = `
    query Claimable($playerId: ContractAddress) {
  dopewarsGameModels(
    where: {player_id: $playerId, claimed: false, claimableGT: 0}
  ) {
    edges {
      node {
        game_id
        season_version
        player_id
        player_name {
          value
        }
        hustler_id
        claimed
        claimable
        final_score
        position
      }
    }
  }
}
    `;
export const useClaimableQuery = <
      TData = ClaimableQuery,
      TError = unknown
    >(
      variables?: ClaimableQueryVariables,
      options?: UseQueryOptions<ClaimableQuery, TError, TData>
    ) =>
    useQuery<ClaimableQuery, TError, TData>(
      variables === undefined ? ['Claimable'] : ['Claimable', variables],
      useFetchData<ClaimableQuery, ClaimableQueryVariables>(ClaimableDocument).bind(null, variables),
      options
    );

useClaimableQuery.getKey = (variables?: ClaimableQueryVariables) => variables === undefined ? ['Claimable'] : ['Claimable', variables];
;

export const useInfiniteClaimableQuery = <
      TData = ClaimableQuery,
      TError = unknown
    >(
      variables?: ClaimableQueryVariables,
      options?: UseInfiniteQueryOptions<ClaimableQuery, TError, TData>
    ) =>{
    const query = useFetchData<ClaimableQuery, ClaimableQueryVariables>(ClaimableDocument)
    return useInfiniteQuery<ClaimableQuery, TError, TData>(
      variables === undefined ? ['Claimable.infinite'] : ['Claimable.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteClaimableQuery.getKey = (variables?: ClaimableQueryVariables) => variables === undefined ? ['Claimable.infinite'] : ['Claimable.infinite', variables];
;

export const GameOverEventsDocument = `
    query GameOverEvents($gameOverSelector: String, $version: String) {
  events(last: 1000, keys: [$gameOverSelector, "*", "*", $version]) {
    totalCount
    edges {
      node {
        id
        transactionHash
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
