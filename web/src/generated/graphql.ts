import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, QueryFunctionContext } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTimeUtc: any;
};

export type Component = {
  __typename?: 'Component';
  address: Scalars['String'];
  classHash: Scalars['String'];
  entityStateUpdates: Array<EntityStateUpdate>;
  entityStates: Array<EntityState>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  properties?: Maybe<Scalars['String']>;
  transactionHash: Scalars['String'];
};

export type Entity = {
  __typename?: 'Entity';
  createdAt: Scalars['DateTimeUtc'];
  id: Scalars['String'];
  keys: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  partitionId: Scalars['String'];
  stateUpdates: Array<EntityStateUpdate>;
  states: Array<EntityState>;
  transactionHash: Scalars['String'];
  updatedAt: Scalars['DateTimeUtc'];
};

export type EntityState = {
  __typename?: 'EntityState';
  component: Component;
  componentId: Scalars['String'];
  data?: Maybe<Scalars['String']>;
  entity: Entity;
  entityId: Scalars['String'];
};

export type EntityStateUpdate = {
  __typename?: 'EntityStateUpdate';
  component: Component;
  componentId: Scalars['String'];
  data?: Maybe<Scalars['String']>;
  entity: Entity;
  entityId: Scalars['String'];
  id: Scalars['Int'];
  transactionHash: Scalars['String'];
};

export type Event = {
  __typename?: 'Event';
  createdAt: Scalars['DateTimeUtc'];
  data: Scalars['String'];
  id: Scalars['String'];
  keys: Scalars['String'];
  systemCall: SystemCall;
  systemCallId: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  component: Component;
  components: Array<Component>;
  entities: Array<Entity>;
  entity: Entity;
  event: Event;
  events: Array<Event>;
  system: System;
  systems: Array<System>;
};


export type QueryComponentArgs = {
  id: Scalars['String'];
};


export type QueryEntitiesArgs = {
  keys?: InputMaybe<Array<Scalars['String']>>;
  partitionId: Scalars['String'];
};


export type QueryEntityArgs = {
  id: Scalars['String'];
};


export type QueryEventArgs = {
  id: Scalars['String'];
};


export type QueryEventsArgs = {
  keys: Array<Scalars['String']>;
};


export type QuerySystemArgs = {
  id: Scalars['String'];
};

export type System = {
  __typename?: 'System';
  address: Scalars['String'];
  classHash: Scalars['String'];
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  systemCalls: Array<SystemCall>;
  transactionHash: Scalars['String'];
};

export type SystemCall = {
  __typename?: 'SystemCall';
  data?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  system: System;
  systemId: Scalars['String'];
  transactionHash: Scalars['String'];
};

export type EntityQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type EntityQuery = { __typename?: 'Query', entity: { __typename?: 'Entity', name?: string | null, partitionId: string, keys: string, transactionHash: string, createdAt: any, updatedAt: any } };

export type EntitiesQueryVariables = Exact<{
  partitionId: Scalars['String'];
  keys?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type EntitiesQuery = { __typename?: 'Query', entities: Array<{ __typename?: 'Entity', id: string, name?: string | null, keys: string, transactionHash: string, createdAt: any, updatedAt: any }> };

export type EventQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type EventQuery = { __typename?: 'Query', event: { __typename?: 'Event', id: string, keys: string, data: string } };

export type EventsQueryVariables = Exact<{
  keys: Array<Scalars['String']> | Scalars['String'];
}>;


export type EventsQuery = { __typename?: 'Query', events: Array<{ __typename?: 'Event', id: string, keys: string, data: string }> };


export const EntityDocument = `
    query Entity($id: String!) {
  entity(id: $id) {
    name
    partitionId
    keys
    transactionHash
    createdAt
    updatedAt
  }
}
    `;
export const useEntityQuery = <
      TData = EntityQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: EntityQueryVariables,
      options?: UseQueryOptions<EntityQuery, TError, TData>
    ) =>
    useQuery<EntityQuery, TError, TData>(
      ['Entity', variables],
      fetcher<EntityQuery, EntityQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, EntityDocument, variables),
      options
    );

useEntityQuery.getKey = (variables: EntityQueryVariables) => ['Entity', variables];
;

export const useInfiniteEntityQuery = <
      TData = EntityQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      pageParamKey: keyof EntityQueryVariables,
      variables: EntityQueryVariables,
      options?: UseQueryOptions<EntityQuery, TError, TData>
    ) =>
    useInfiniteQuery<EntityQuery, TError, TData>(
      ['Entity.infinite', variables],
      (metaData) => fetcher<EntityQuery, EntityQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, EntityDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteEntityQuery.getKey = (variables: EntityQueryVariables) => ['Entity.infinite', variables];
;

export const EntitiesDocument = `
    query Entities($partitionId: String!, $keys: [String!]) {
  entities(partitionId: $partitionId, keys: $keys) {
    id
    name
    keys
    transactionHash
    createdAt
    updatedAt
  }
}
    `;
export const useEntitiesQuery = <
      TData = EntitiesQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: EntitiesQueryVariables,
      options?: UseQueryOptions<EntitiesQuery, TError, TData>
    ) =>
    useQuery<EntitiesQuery, TError, TData>(
      ['Entities', variables],
      fetcher<EntitiesQuery, EntitiesQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, EntitiesDocument, variables),
      options
    );

useEntitiesQuery.getKey = (variables: EntitiesQueryVariables) => ['Entities', variables];
;

export const useInfiniteEntitiesQuery = <
      TData = EntitiesQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      pageParamKey: keyof EntitiesQueryVariables,
      variables: EntitiesQueryVariables,
      options?: UseQueryOptions<EntitiesQuery, TError, TData>
    ) =>
    useInfiniteQuery<EntitiesQuery, TError, TData>(
      ['Entities.infinite', variables],
      (metaData) => fetcher<EntitiesQuery, EntitiesQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, EntitiesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteEntitiesQuery.getKey = (variables: EntitiesQueryVariables) => ['Entities.infinite', variables];
;

export const EventDocument = `
    query Event($id: String!) {
  event(id: $id) {
    id
    keys
    data
  }
}
    `;
export const useEventQuery = <
      TData = EventQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: EventQueryVariables,
      options?: UseQueryOptions<EventQuery, TError, TData>
    ) =>
    useQuery<EventQuery, TError, TData>(
      ['Event', variables],
      fetcher<EventQuery, EventQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, EventDocument, variables),
      options
    );

useEventQuery.getKey = (variables: EventQueryVariables) => ['Event', variables];
;

export const useInfiniteEventQuery = <
      TData = EventQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      pageParamKey: keyof EventQueryVariables,
      variables: EventQueryVariables,
      options?: UseQueryOptions<EventQuery, TError, TData>
    ) =>
    useInfiniteQuery<EventQuery, TError, TData>(
      ['Event.infinite', variables],
      (metaData) => fetcher<EventQuery, EventQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, EventDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteEventQuery.getKey = (variables: EventQueryVariables) => ['Event.infinite', variables];
;

export const EventsDocument = `
    query Events($keys: [String!]!) {
  events(keys: $keys) {
    id
    keys
    data
  }
}
    `;
export const useEventsQuery = <
      TData = EventsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: EventsQueryVariables,
      options?: UseQueryOptions<EventsQuery, TError, TData>
    ) =>
    useQuery<EventsQuery, TError, TData>(
      ['Events', variables],
      fetcher<EventsQuery, EventsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, EventsDocument, variables),
      options
    );

useEventsQuery.getKey = (variables: EventsQueryVariables) => ['Events', variables];
;

export const useInfiniteEventsQuery = <
      TData = EventsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      pageParamKey: keyof EventsQueryVariables,
      variables: EventsQueryVariables,
      options?: UseQueryOptions<EventsQuery, TError, TData>
    ) =>
    useInfiniteQuery<EventsQuery, TError, TData>(
      ['Events.infinite', variables],
      (metaData) => fetcher<EventsQuery, EventsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, EventsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteEventsQuery.getKey = (variables: EventsQueryVariables) => ['Events.infinite', variables];
;
