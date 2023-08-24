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
  bool: any;
  felt252: any;
  u8: any;
  u64: any;
  u128: any;
  usize: any;
};

export type ComponentUnion = Drug | Game | Market | Name | Player | Risks;

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Drug = {
  __typename?: 'Drug';
  entity?: Maybe<Entity>;
  quantity?: Maybe<Scalars['usize']>;
};

export type DrugConnection = {
  __typename?: 'DrugConnection';
  edges?: Maybe<Array<Maybe<DrugEdge>>>;
  totalCount: Scalars['Int'];
};

export type DrugEdge = {
  __typename?: 'DrugEdge';
  cursor: Scalars['Cursor'];
  node?: Maybe<Drug>;
};

export type DrugOrder = {
  direction: Direction;
  field: DrugOrderOrderField;
};

export enum DrugOrderOrderField {
  Quantity = 'QUANTITY'
}

export type DrugWhereInput = {
  quantity?: InputMaybe<Scalars['Int']>;
  quantityGT?: InputMaybe<Scalars['Int']>;
  quantityGTE?: InputMaybe<Scalars['Int']>;
  quantityLT?: InputMaybe<Scalars['Int']>;
  quantityLTE?: InputMaybe<Scalars['Int']>;
  quantityNEQ?: InputMaybe<Scalars['Int']>;
};

export type Entity = {
  __typename?: 'Entity';
  componentNames?: Maybe<Scalars['String']>;
  components?: Maybe<Array<Maybe<ComponentUnion>>>;
  createdAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  keys?: Maybe<Array<Maybe<Scalars['String']>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type EntityConnection = {
  __typename?: 'EntityConnection';
  edges?: Maybe<Array<Maybe<EntityEdge>>>;
  totalCount: Scalars['Int'];
};

export type EntityEdge = {
  __typename?: 'EntityEdge';
  cursor: Scalars['Cursor'];
  node?: Maybe<Entity>;
};

export type Event = {
  __typename?: 'Event';
  createdAt?: Maybe<Scalars['DateTime']>;
  data?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  keys?: Maybe<Scalars['String']>;
  systemCall: SystemCall;
  systemCallId?: Maybe<Scalars['Int']>;
};

export type EventConnection = {
  __typename?: 'EventConnection';
  edges?: Maybe<Array<Maybe<EventEdge>>>;
  totalCount: Scalars['Int'];
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor: Scalars['Cursor'];
  node?: Maybe<Event>;
};

export type Game = {
  __typename?: 'Game';
  creator?: Maybe<Scalars['ContractAddress']>;
  entity?: Maybe<Entity>;
  is_finished?: Maybe<Scalars['bool']>;
  max_players?: Maybe<Scalars['usize']>;
  max_turns?: Maybe<Scalars['usize']>;
  num_players?: Maybe<Scalars['usize']>;
  start_time?: Maybe<Scalars['u64']>;
};

export type GameConnection = {
  __typename?: 'GameConnection';
  edges?: Maybe<Array<Maybe<GameEdge>>>;
  totalCount: Scalars['Int'];
};

export type GameEdge = {
  __typename?: 'GameEdge';
  cursor: Scalars['Cursor'];
  node?: Maybe<Game>;
};

export type GameOrder = {
  direction: Direction;
  field: GameOrderOrderField;
};

export enum GameOrderOrderField {
  Creator = 'CREATOR',
  IsFinished = 'IS_FINISHED',
  MaxPlayers = 'MAX_PLAYERS',
  MaxTurns = 'MAX_TURNS',
  NumPlayers = 'NUM_PLAYERS',
  StartTime = 'START_TIME'
}

export type GameWhereInput = {
  creator?: InputMaybe<Scalars['String']>;
  creatorGT?: InputMaybe<Scalars['String']>;
  creatorGTE?: InputMaybe<Scalars['String']>;
  creatorLT?: InputMaybe<Scalars['String']>;
  creatorLTE?: InputMaybe<Scalars['String']>;
  creatorNEQ?: InputMaybe<Scalars['String']>;
  is_finished?: InputMaybe<Scalars['Int']>;
  is_finishedGT?: InputMaybe<Scalars['Int']>;
  is_finishedGTE?: InputMaybe<Scalars['Int']>;
  is_finishedLT?: InputMaybe<Scalars['Int']>;
  is_finishedLTE?: InputMaybe<Scalars['Int']>;
  is_finishedNEQ?: InputMaybe<Scalars['Int']>;
  max_players?: InputMaybe<Scalars['Int']>;
  max_playersGT?: InputMaybe<Scalars['Int']>;
  max_playersGTE?: InputMaybe<Scalars['Int']>;
  max_playersLT?: InputMaybe<Scalars['Int']>;
  max_playersLTE?: InputMaybe<Scalars['Int']>;
  max_playersNEQ?: InputMaybe<Scalars['Int']>;
  max_turns?: InputMaybe<Scalars['Int']>;
  max_turnsGT?: InputMaybe<Scalars['Int']>;
  max_turnsGTE?: InputMaybe<Scalars['Int']>;
  max_turnsLT?: InputMaybe<Scalars['Int']>;
  max_turnsLTE?: InputMaybe<Scalars['Int']>;
  max_turnsNEQ?: InputMaybe<Scalars['Int']>;
  num_players?: InputMaybe<Scalars['Int']>;
  num_playersGT?: InputMaybe<Scalars['Int']>;
  num_playersGTE?: InputMaybe<Scalars['Int']>;
  num_playersLT?: InputMaybe<Scalars['Int']>;
  num_playersLTE?: InputMaybe<Scalars['Int']>;
  num_playersNEQ?: InputMaybe<Scalars['Int']>;
  start_time?: InputMaybe<Scalars['Int']>;
  start_timeGT?: InputMaybe<Scalars['Int']>;
  start_timeGTE?: InputMaybe<Scalars['Int']>;
  start_timeLT?: InputMaybe<Scalars['Int']>;
  start_timeLTE?: InputMaybe<Scalars['Int']>;
  start_timeNEQ?: InputMaybe<Scalars['Int']>;
};

export type Market = {
  __typename?: 'Market';
  cash?: Maybe<Scalars['u128']>;
  entity?: Maybe<Entity>;
  quantity?: Maybe<Scalars['usize']>;
};

export type MarketConnection = {
  __typename?: 'MarketConnection';
  edges?: Maybe<Array<Maybe<MarketEdge>>>;
  totalCount: Scalars['Int'];
};

export type MarketEdge = {
  __typename?: 'MarketEdge';
  cursor: Scalars['Cursor'];
  node?: Maybe<Market>;
};

export type MarketOrder = {
  direction: Direction;
  field: MarketOrderOrderField;
};

export enum MarketOrderOrderField {
  Cash = 'CASH',
  Quantity = 'QUANTITY'
}

export type MarketWhereInput = {
  cash?: InputMaybe<Scalars['String']>;
  cashGT?: InputMaybe<Scalars['String']>;
  cashGTE?: InputMaybe<Scalars['String']>;
  cashLT?: InputMaybe<Scalars['String']>;
  cashLTE?: InputMaybe<Scalars['String']>;
  cashNEQ?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['Int']>;
  quantityGT?: InputMaybe<Scalars['Int']>;
  quantityGTE?: InputMaybe<Scalars['Int']>;
  quantityLT?: InputMaybe<Scalars['Int']>;
  quantityLTE?: InputMaybe<Scalars['Int']>;
  quantityNEQ?: InputMaybe<Scalars['Int']>;
};

export type Name = {
  __typename?: 'Name';
  entity?: Maybe<Entity>;
  short_string?: Maybe<Scalars['felt252']>;
};

export type NameConnection = {
  __typename?: 'NameConnection';
  edges?: Maybe<Array<Maybe<NameEdge>>>;
  totalCount: Scalars['Int'];
};

export type NameEdge = {
  __typename?: 'NameEdge';
  cursor: Scalars['Cursor'];
  node?: Maybe<Name>;
};

export type NameOrder = {
  direction: Direction;
  field: NameOrderOrderField;
};

export enum NameOrderOrderField {
  ShortString = 'SHORT_STRING'
}

export type NameWhereInput = {
  short_string?: InputMaybe<Scalars['String']>;
  short_stringGT?: InputMaybe<Scalars['String']>;
  short_stringGTE?: InputMaybe<Scalars['String']>;
  short_stringLT?: InputMaybe<Scalars['String']>;
  short_stringLTE?: InputMaybe<Scalars['String']>;
  short_stringNEQ?: InputMaybe<Scalars['String']>;
};

export type Player = {
  __typename?: 'Player';
  cash?: Maybe<Scalars['u128']>;
  entity?: Maybe<Entity>;
  health?: Maybe<Scalars['u8']>;
  location_id?: Maybe<Scalars['felt252']>;
  turns_remaining?: Maybe<Scalars['usize']>;
};

export type PlayerConnection = {
  __typename?: 'PlayerConnection';
  edges?: Maybe<Array<Maybe<PlayerEdge>>>;
  totalCount: Scalars['Int'];
};

export type PlayerEdge = {
  __typename?: 'PlayerEdge';
  cursor: Scalars['Cursor'];
  node?: Maybe<Player>;
};

export type PlayerOrder = {
  direction: Direction;
  field: PlayerOrderOrderField;
};

export enum PlayerOrderOrderField {
  Cash = 'CASH',
  Health = 'HEALTH',
  LocationId = 'LOCATION_ID',
  TurnsRemaining = 'TURNS_REMAINING'
}

export type PlayerWhereInput = {
  cash?: InputMaybe<Scalars['String']>;
  cashGT?: InputMaybe<Scalars['String']>;
  cashGTE?: InputMaybe<Scalars['String']>;
  cashLT?: InputMaybe<Scalars['String']>;
  cashLTE?: InputMaybe<Scalars['String']>;
  cashNEQ?: InputMaybe<Scalars['String']>;
  health?: InputMaybe<Scalars['Int']>;
  healthGT?: InputMaybe<Scalars['Int']>;
  healthGTE?: InputMaybe<Scalars['Int']>;
  healthLT?: InputMaybe<Scalars['Int']>;
  healthLTE?: InputMaybe<Scalars['Int']>;
  healthNEQ?: InputMaybe<Scalars['Int']>;
  location_id?: InputMaybe<Scalars['String']>;
  location_idGT?: InputMaybe<Scalars['String']>;
  location_idGTE?: InputMaybe<Scalars['String']>;
  location_idLT?: InputMaybe<Scalars['String']>;
  location_idLTE?: InputMaybe<Scalars['String']>;
  location_idNEQ?: InputMaybe<Scalars['String']>;
  turns_remaining?: InputMaybe<Scalars['Int']>;
  turns_remainingGT?: InputMaybe<Scalars['Int']>;
  turns_remainingGTE?: InputMaybe<Scalars['Int']>;
  turns_remainingLT?: InputMaybe<Scalars['Int']>;
  turns_remainingLTE?: InputMaybe<Scalars['Int']>;
  turns_remainingNEQ?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  drugComponents?: Maybe<DrugConnection>;
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  event: Event;
  events?: Maybe<EventConnection>;
  gameComponents?: Maybe<GameConnection>;
  marketComponents?: Maybe<MarketConnection>;
  nameComponents?: Maybe<NameConnection>;
  playerComponents?: Maybe<PlayerConnection>;
  risksComponents?: Maybe<RisksConnection>;
  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<SystemCallConnection>;
  systems?: Maybe<SystemConnection>;
};


export type QueryDrugComponentsArgs = {
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


export type QueryGameComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<GameOrder>;
  where?: InputMaybe<GameWhereInput>;
};


export type QueryMarketComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<MarketOrder>;
  where?: InputMaybe<MarketWhereInput>;
};


export type QueryNameComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<NameOrder>;
  where?: InputMaybe<NameWhereInput>;
};


export type QueryPlayerComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<PlayerOrder>;
  where?: InputMaybe<PlayerWhereInput>;
};


export type QueryRisksComponentsArgs = {
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
  arrested?: Maybe<Scalars['u8']>;
  entity?: Maybe<Entity>;
  hurt?: Maybe<Scalars['u8']>;
  mugged?: Maybe<Scalars['u8']>;
  travel?: Maybe<Scalars['u8']>;
};

export type RisksConnection = {
  __typename?: 'RisksConnection';
  edges?: Maybe<Array<Maybe<RisksEdge>>>;
  totalCount: Scalars['Int'];
};

export type RisksEdge = {
  __typename?: 'RisksEdge';
  cursor: Scalars['Cursor'];
  node?: Maybe<Risks>;
};

export type RisksOrder = {
  direction: Direction;
  field: RisksOrderOrderField;
};

export enum RisksOrderOrderField {
  Arrested = 'ARRESTED',
  Hurt = 'HURT',
  Mugged = 'MUGGED',
  Travel = 'TRAVEL'
}

export type RisksWhereInput = {
  arrested?: InputMaybe<Scalars['Int']>;
  arrestedGT?: InputMaybe<Scalars['Int']>;
  arrestedGTE?: InputMaybe<Scalars['Int']>;
  arrestedLT?: InputMaybe<Scalars['Int']>;
  arrestedLTE?: InputMaybe<Scalars['Int']>;
  arrestedNEQ?: InputMaybe<Scalars['Int']>;
  hurt?: InputMaybe<Scalars['Int']>;
  hurtGT?: InputMaybe<Scalars['Int']>;
  hurtGTE?: InputMaybe<Scalars['Int']>;
  hurtLT?: InputMaybe<Scalars['Int']>;
  hurtLTE?: InputMaybe<Scalars['Int']>;
  hurtNEQ?: InputMaybe<Scalars['Int']>;
  mugged?: InputMaybe<Scalars['Int']>;
  muggedGT?: InputMaybe<Scalars['Int']>;
  muggedGTE?: InputMaybe<Scalars['Int']>;
  muggedLT?: InputMaybe<Scalars['Int']>;
  muggedLTE?: InputMaybe<Scalars['Int']>;
  muggedNEQ?: InputMaybe<Scalars['Int']>;
  travel?: InputMaybe<Scalars['Int']>;
  travelGT?: InputMaybe<Scalars['Int']>;
  travelGTE?: InputMaybe<Scalars['Int']>;
  travelLT?: InputMaybe<Scalars['Int']>;
  travelLTE?: InputMaybe<Scalars['Int']>;
  travelNEQ?: InputMaybe<Scalars['Int']>;
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
  cursor: Scalars['Cursor'];
  node?: Maybe<SystemCall>;
};

export type SystemConnection = {
  __typename?: 'SystemConnection';
  edges?: Maybe<Array<Maybe<SystemEdge>>>;
  totalCount: Scalars['Int'];
};

export type SystemEdge = {
  __typename?: 'SystemEdge';
  cursor: Scalars['Cursor'];
  node?: Maybe<System>;
};

export type AvailableGamesQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableGamesQuery = { __typename?: 'Query', gameComponents?: { __typename?: 'GameConnection', totalCount: number, edges?: Array<{ __typename?: 'GameEdge', cursor: any, node?: { __typename?: 'Game', creator?: any | null, num_players?: any | null, max_players?: any | null, max_turns?: any | null, start_time?: any | null } | null } | null> | null } | null };

export type GlobalScoresQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GlobalScoresQuery = { __typename?: 'Query', playerComponents?: { __typename?: 'PlayerConnection', totalCount: number, edges?: Array<{ __typename?: 'PlayerEdge', cursor: any, node?: { __typename?: 'Player', cash?: any | null, entity?: { __typename?: 'Entity', keys?: Array<string | null> | null, components?: Array<{ __typename: 'Drug' } | { __typename: 'Game' } | { __typename: 'Market' } | { __typename: 'Name', short_string?: any | null } | { __typename: 'Player' } | { __typename: 'Risks' } | null> | null } | null } | null } | null> | null } | null };

export type GameEntityQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GameEntityQuery = { __typename?: 'Query', entity: { __typename?: 'Entity', components?: Array<{ __typename: 'Drug' } | { __typename: 'Game', creator?: any | null, is_finished?: any | null, max_players?: any | null, max_turns?: any | null, num_players?: any | null, start_time?: any | null } | { __typename: 'Market' } | { __typename: 'Name' } | { __typename: 'Player' } | { __typename: 'Risks' } | null> | null } };

export type PlayerEntityQueryVariables = Exact<{
  gameId: Scalars['String'];
  playerId: Scalars['String'];
}>;


export type PlayerEntityQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'EntityEdge', cursor: any, node?: { __typename?: 'Entity', components?: Array<{ __typename: 'Drug', quantity?: any | null } | { __typename: 'Game' } | { __typename: 'Market' } | { __typename: 'Name', short_string?: any | null } | { __typename: 'Player', cash?: any | null, health?: any | null, turns_remaining?: any | null } | { __typename: 'Risks' } | null> | null } | null } | null> | null } | null };

export type LocationEntitiesQueryVariables = Exact<{
  gameId: Scalars['String'];
  locationId: Scalars['String'];
}>;


export type LocationEntitiesQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'EntityEdge', cursor: any, node?: { __typename?: 'Entity', keys?: Array<string | null> | null, components?: Array<{ __typename: 'Drug' } | { __typename: 'Game' } | { __typename: 'Market', cash?: any | null, quantity?: any | null } | { __typename: 'Name' } | { __typename: 'Player' } | { __typename: 'Risks', arrested?: any | null, hurt?: any | null, mugged?: any | null, travel?: any | null } | null> | null } | null } | null> | null } | null };


export const AvailableGamesDocument = `
    query AvailableGames {
  gameComponents(first: 10) {
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
    query GlobalScores($limit: Int) {
  playerComponents(
    first: $limit
    where: {turns_remaining: 0}
    order: {direction: DESC, field: CASH}
  ) {
    totalCount
    edges {
      node {
        cash
        entity {
          keys
          components {
            __typename
            ... on Name {
              short_string
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

export const GameEntityDocument = `
    query GameEntity($id: ID!) {
  entity(id: $id) {
    components {
      __typename
      ... on Game {
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
        components {
          __typename
          ... on Player {
            cash
            health
            turns_remaining
          }
          ... on Drug {
            quantity
          }
          ... on Name {
            short_string
          }
        }
      }
      cursor
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
        components {
          __typename
          ... on Market {
            cash
            quantity
          }
          ... on Risks {
            arrested
            hurt
            mugged
            travel
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
