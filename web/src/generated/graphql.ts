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
  Address: any;
  DateTime: any;
  bool: any;
  felt252: any;
  u8: any;
  u32: any;
  u64: any;
  u128: any;
  usize: any;
};

export type Authrole = {
  __typename?: 'Authrole';
  id: Scalars['felt252'];
};

export type Authstatus = {
  __typename?: 'Authstatus';
  is_authorized: Scalars['bool'];
};

export type Cash = {
  __typename?: 'Cash';
  amount: Scalars['u128'];
};

export type ComponentUnion = Authrole | Authstatus | Cash | Drug | Game | Location | Market | Risks | Stats;

export type Drug = {
  __typename?: 'Drug';
  id: Scalars['u32'];
  quantity: Scalars['usize'];
};

export type Entity = {
  __typename?: 'Entity';
  componentNames: Scalars['String'];
  components?: Maybe<Array<Maybe<ComponentUnion>>>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  keys: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Event = {
  __typename?: 'Event';
  createdAt: Scalars['DateTime'];
  data: Scalars['String'];
  id: Scalars['ID'];
  keys: Scalars['String'];
  systemCall: SystemCall;
  systemCallId: Scalars['Int'];
};

export type Game = {
  __typename?: 'Game';
  creator: Scalars['felt252'];
  game_id: Scalars['u32'];
  is_finished: Scalars['bool'];
  max_locations: Scalars['usize'];
  max_players: Scalars['usize'];
  max_turns: Scalars['usize'];
  num_players: Scalars['usize'];
  start_time: Scalars['u64'];
};

export type Location = {
  __typename?: 'Location';
  id: Scalars['u32'];
};

export type Market = {
  __typename?: 'Market';
  cash: Scalars['u128'];
  quantity: Scalars['usize'];
};

export type Query = {
  __typename?: 'Query';
  authroleComponents?: Maybe<Array<Maybe<Authrole>>>;
  authstatusComponents?: Maybe<Array<Maybe<Authstatus>>>;
  cashComponents?: Maybe<Array<Maybe<Cash>>>;
  drugComponents?: Maybe<Array<Maybe<Drug>>>;
  entities?: Maybe<Array<Maybe<Entity>>>;
  entity: Entity;
  event: Event;
  events?: Maybe<Array<Maybe<Event>>>;
  gameComponents?: Maybe<Array<Maybe<Game>>>;
  locationComponents?: Maybe<Array<Maybe<Location>>>;
  marketComponents?: Maybe<Array<Maybe<Market>>>;
  risksComponents?: Maybe<Array<Maybe<Risks>>>;
  statsComponents?: Maybe<Array<Maybe<Stats>>>;
  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<Array<Maybe<SystemCall>>>;
  systems?: Maybe<Array<Maybe<System>>>;
};


export type QueryAuthroleComponentsArgs = {
  id?: InputMaybe<Scalars['felt252']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryAuthstatusComponentsArgs = {
  is_authorized?: InputMaybe<Scalars['bool']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryCashComponentsArgs = {
  amount?: InputMaybe<Scalars['u128']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryDrugComponentsArgs = {
  id?: InputMaybe<Scalars['u32']>;
  limit?: InputMaybe<Scalars['Int']>;
  quantity?: InputMaybe<Scalars['usize']>;
};


export type QueryEntitiesArgs = {
  keys: Array<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryEntityArgs = {
  id: Scalars['ID'];
};


export type QueryEventArgs = {
  id: Scalars['ID'];
};


export type QueryEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryGameComponentsArgs = {
  creator?: InputMaybe<Scalars['felt252']>;
  game_id?: InputMaybe<Scalars['u32']>;
  is_finished?: InputMaybe<Scalars['bool']>;
  limit?: InputMaybe<Scalars['Int']>;
  max_locations?: InputMaybe<Scalars['usize']>;
  max_players?: InputMaybe<Scalars['usize']>;
  max_turns?: InputMaybe<Scalars['usize']>;
  num_players?: InputMaybe<Scalars['usize']>;
  start_time?: InputMaybe<Scalars['u64']>;
};


export type QueryLocationComponentsArgs = {
  id?: InputMaybe<Scalars['u32']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryMarketComponentsArgs = {
  cash?: InputMaybe<Scalars['u128']>;
  limit?: InputMaybe<Scalars['Int']>;
  quantity?: InputMaybe<Scalars['usize']>;
};


export type QueryRisksComponentsArgs = {
  arrested?: InputMaybe<Scalars['u8']>;
  hurt?: InputMaybe<Scalars['u8']>;
  killed?: InputMaybe<Scalars['u8']>;
  limit?: InputMaybe<Scalars['Int']>;
  mugged?: InputMaybe<Scalars['u8']>;
  travel?: InputMaybe<Scalars['u8']>;
};


export type QueryStatsComponentsArgs = {
  arrested?: InputMaybe<Scalars['bool']>;
  health?: InputMaybe<Scalars['u8']>;
  limit?: InputMaybe<Scalars['Int']>;
  respect?: InputMaybe<Scalars['u8']>;
  turns_remaining?: InputMaybe<Scalars['usize']>;
};


export type QuerySystemArgs = {
  id: Scalars['ID'];
};


export type QuerySystemCallArgs = {
  id: Scalars['Int'];
};


export type QuerySystemsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type Risks = {
  __typename?: 'Risks';
  arrested: Scalars['u8'];
  hurt: Scalars['u8'];
  killed: Scalars['u8'];
  mugged: Scalars['u8'];
  travel: Scalars['u8'];
};

export type Stats = {
  __typename?: 'Stats';
  arrested: Scalars['bool'];
  health: Scalars['u8'];
  respect: Scalars['u8'];
  turns_remaining: Scalars['usize'];
};

export type System = {
  __typename?: 'System';
  address: Scalars['Address'];
  classHash: Scalars['felt252'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  systemCalls: Array<SystemCall>;
  transactionHash: Scalars['felt252'];
};

export type SystemCall = {
  __typename?: 'SystemCall';
  createdAt: Scalars['DateTime'];
  data: Scalars['String'];
  id: Scalars['ID'];
  system: System;
  systemId: Scalars['ID'];
  transactionHash: Scalars['String'];
};

export type AvailableGamesQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableGamesQuery = { __typename?: 'Query', gameComponents?: Array<{ __typename?: 'Game', game_id: any, creator: any, num_players: any, max_players: any, max_locations: any, max_turns: any, start_time: any } | null> | null };

export type UserGamesQueryVariables = Exact<{
  id: Scalars['felt252'];
}>;


export type UserGamesQuery = { __typename?: 'Query', gameComponents?: Array<{ __typename?: 'Game', game_id: any } | null> | null };

export type PlayerQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PlayerQuery = { __typename?: 'Query', entity: { __typename?: 'Entity', components?: Array<{ __typename: 'Authrole' } | { __typename: 'Authstatus' } | { __typename: 'Cash', amount: any } | { __typename: 'Drug' } | { __typename: 'Game' } | { __typename: 'Location', id: any } | { __typename: 'Market' } | { __typename: 'Risks' } | { __typename: 'Stats' } | null> | null } };

export type LocationQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type LocationQuery = { __typename?: 'Query', entity: { __typename?: 'Entity', components?: Array<{ __typename: 'Authrole' } | { __typename: 'Authstatus' } | { __typename: 'Cash' } | { __typename: 'Drug' } | { __typename: 'Game' } | { __typename: 'Location', id: any } | { __typename: 'Market' } | { __typename: 'Risks', travel: any, hurt: any, killed: any, mugged: any, arrested: any } | { __typename: 'Stats' } | null> | null } };

export type MarketQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type MarketQuery = { __typename?: 'Query', entity: { __typename?: 'Entity', components?: Array<{ __typename: 'Authrole' } | { __typename: 'Authstatus' } | { __typename: 'Cash' } | { __typename: 'Drug' } | { __typename: 'Game' } | { __typename: 'Location' } | { __typename: 'Market', cash: any, quantity: any } | { __typename: 'Risks' } | { __typename: 'Stats' } | null> | null } };
