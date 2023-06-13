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
  FieldElement: any;
  bool: any;
  u8: any;
  u32: any;
};

export type Cash = {
  __typename?: 'Cash';
  amount: Scalars['u32'];
};

export type Component = {
  __typename?: 'Component';
  classHash: Scalars['FieldElement'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  storage?: Maybe<Storage>;
  transactionHash: Scalars['FieldElement'];
};

export type Entity = {
  __typename?: 'Entity';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  keys: Scalars['String'];
  partition: Scalars['FieldElement'];
  transactionHash: Scalars['FieldElement'];
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
  is_finished: Scalars['bool'];
};

export type Query = {
  __typename?: 'Query';
  cash: Cash;
  component: Component;
  components?: Maybe<Array<Maybe<Component>>>;
  entities: Array<Entity>;
  entity: Entity;
  event: Event;
  events?: Maybe<Array<Maybe<Event>>>;
  game: Game;
  stats: Stats;
  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<Array<Maybe<SystemCall>>>;
  systems?: Maybe<Array<Maybe<System>>>;
};


export type QueryComponentArgs = {
  id: Scalars['ID'];
};


export type QueryComponentsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryEntitiesArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  partition: Scalars['FieldElement'];
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


export type QuerySystemArgs = {
  id: Scalars['ID'];
};


export type QuerySystemCallArgs = {
  id: Scalars['Int'];
};


export type QuerySystemsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type Stats = {
  __typename?: 'Stats';
  health: Scalars['u8'];
  mana: Scalars['u8'];
};

export type Storage = Cash | Game | Stats;

export type System = {
  __typename?: 'System';
  address: Scalars['Address'];
  classHash: Scalars['FieldElement'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  systemCalls: Array<SystemCall>;
  transactionHash: Scalars['FieldElement'];
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

export type ComponentQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ComponentQuery = { __typename?: 'Query', component: { __typename?: 'Component', name: string, classHash: any, transactionHash: any, createdAt: any } };

export type ComponentsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type ComponentsQuery = { __typename?: 'Query', components?: Array<{ __typename?: 'Component', name: string, classHash: any, transactionHash: any, createdAt: any } | null> | null };

export type EntityQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type EntityQuery = { __typename?: 'Query', entity: { __typename?: 'Entity', partition: any, keys: string, transactionHash: any, createdAt: any } };

export type EntitiesQueryVariables = Exact<{
  partition: Scalars['FieldElement'];
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type EntitiesQuery = { __typename?: 'Query', entities: Array<{ __typename?: 'Entity', partition: any, keys: string, transactionHash: any, createdAt: any }> };

export type EventQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type EventQuery = { __typename?: 'Query', event: { __typename?: 'Event', keys: string, data: string, createdAt: any, systemCall: { __typename?: 'SystemCall', transactionHash: string } } };

export type EventsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type EventsQuery = { __typename?: 'Query', events?: Array<{ __typename?: 'Event', keys: string, data: string, createdAt: any, systemCall: { __typename?: 'SystemCall', transactionHash: string } } | null> | null };
