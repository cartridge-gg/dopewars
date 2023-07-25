import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  QueryFunctionContext,
} from "react-query";
import { useFetchData } from "@/hooks/fetcher";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ContractAddress: any;
  DateTime: any;
  bool: any;
  felt252: any;
  u8: any;
  u32: any;
  u64: any;
  u128: any;
  usize: any;
};

export type ComponentUnion =
  | Drug
  | Game
  | Location
  | Market
  | Name
  | Player
  | Risks;

export type Drug = {
  __typename?: "Drug";
  entity?: Maybe<Entity>;
  entity_id: Scalars["ID"];
  quantity: Scalars["usize"];
};

export type Entity = {
  __typename?: "Entity";
  componentNames: Scalars["String"];
  components?: Maybe<Array<Maybe<ComponentUnion>>>;
  createdAt: Scalars["DateTime"];
  id: Scalars["ID"];
  keys: Scalars["String"];
  updatedAt: Scalars["DateTime"];
};

export type Event = {
  __typename?: "Event";
  createdAt: Scalars["DateTime"];
  data: Scalars["String"];
  id: Scalars["ID"];
  keys: Scalars["String"];
  systemCall: SystemCall;
  systemCallId: Scalars["Int"];
};

export type Game = {
  __typename?: "Game";
  creator: Scalars["felt252"];
  entity?: Maybe<Entity>;
  entity_id: Scalars["ID"];
  game_id: Scalars["u32"];
  is_finished: Scalars["bool"];
  max_players: Scalars["usize"];
  max_turns: Scalars["usize"];
  num_players: Scalars["usize"];
  start_time: Scalars["u64"];
};

export type Location = {
  __typename?: "Location";
  entity?: Maybe<Entity>;
  entity_id: Scalars["ID"];
  name: Scalars["felt252"];
};

export type Market = {
  __typename?: "Market";
  cash: Scalars["u128"];
  entity?: Maybe<Entity>;
  entity_id: Scalars["ID"];
  quantity: Scalars["usize"];
};

export type Name = {
  __typename?: "Name";
  entity?: Maybe<Entity>;
  entity_id: Scalars["ID"];
  short_string: Scalars["felt252"];
};

export type Player = {
  __typename?: "Player";
  cash: Scalars["u128"];
  entity?: Maybe<Entity>;
  entity_id: Scalars["ID"];
  health: Scalars["u8"];
  turns_remaining: Scalars["usize"];
};

export type Query = {
  __typename?: "Query";
  drugComponents?: Maybe<Array<Maybe<Drug>>>;
  entities?: Maybe<Array<Maybe<Entity>>>;
  entity: Entity;
  event: Event;
  events?: Maybe<Array<Maybe<Event>>>;
  gameComponents?: Maybe<Array<Maybe<Game>>>;
  locationComponents?: Maybe<Array<Maybe<Location>>>;
  marketComponents?: Maybe<Array<Maybe<Market>>>;
  nameComponents?: Maybe<Array<Maybe<Name>>>;
  playerComponents?: Maybe<Array<Maybe<Player>>>;
  risksComponents?: Maybe<Array<Maybe<Risks>>>;
  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<Array<Maybe<SystemCall>>>;
  systems?: Maybe<Array<Maybe<System>>>;
};

export type QueryDrugComponentsArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  quantity?: InputMaybe<Scalars["usize"]>;
};

export type QueryEntitiesArgs = {
  componentName?: InputMaybe<Scalars["String"]>;
  keys: Array<Scalars["String"]>;
  limit?: InputMaybe<Scalars["Int"]>;
};

export type QueryEntityArgs = {
  id: Scalars["ID"];
};

export type QueryEventArgs = {
  id: Scalars["ID"];
};

export type QueryEventsArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
};

export type QueryGameComponentsArgs = {
  creator?: InputMaybe<Scalars["felt252"]>;
  game_id?: InputMaybe<Scalars["u32"]>;
  is_finished?: InputMaybe<Scalars["bool"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  max_players?: InputMaybe<Scalars["usize"]>;
  max_turns?: InputMaybe<Scalars["usize"]>;
  num_players?: InputMaybe<Scalars["usize"]>;
  start_time?: InputMaybe<Scalars["u64"]>;
};

export type QueryLocationComponentsArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  name?: InputMaybe<Scalars["felt252"]>;
};

export type QueryMarketComponentsArgs = {
  cash?: InputMaybe<Scalars["u128"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  quantity?: InputMaybe<Scalars["usize"]>;
};

export type QueryNameComponentsArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  short_string?: InputMaybe<Scalars["felt252"]>;
};

export type QueryPlayerComponentsArgs = {
  cash?: InputMaybe<Scalars["u128"]>;
  health?: InputMaybe<Scalars["u8"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  turns_remaining?: InputMaybe<Scalars["usize"]>;
};

export type QueryRisksComponentsArgs = {
  arrested?: InputMaybe<Scalars["u8"]>;
  hurt?: InputMaybe<Scalars["u8"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  mugged?: InputMaybe<Scalars["u8"]>;
  travel?: InputMaybe<Scalars["u8"]>;
};

export type QuerySystemArgs = {
  id: Scalars["ID"];
};

export type QuerySystemCallArgs = {
  id: Scalars["Int"];
};

export type QuerySystemsArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
};

export type Risks = {
  __typename?: "Risks";
  arrested: Scalars["u8"];
  entity?: Maybe<Entity>;
  entity_id: Scalars["ID"];
  hurt: Scalars["u8"];
  mugged: Scalars["u8"];
  travel: Scalars["u8"];
};

export type System = {
  __typename?: "System";
  address: Scalars["ContractAddress"];
  classHash: Scalars["felt252"];
  createdAt: Scalars["DateTime"];
  id: Scalars["ID"];
  name: Scalars["String"];
  systemCalls: Array<SystemCall>;
  transactionHash: Scalars["felt252"];
};

export type SystemCall = {
  __typename?: "SystemCall";
  createdAt: Scalars["DateTime"];
  data: Scalars["String"];
  id: Scalars["ID"];
  system: System;
  systemId: Scalars["ID"];
  transactionHash: Scalars["String"];
};

export type AvailableGamesQueryVariables = Exact<{ [key: string]: never }>;

export type AvailableGamesQuery = {
  __typename?: "Query";
  gameComponents?: Array<{
    __typename?: "Game";
    game_id: any;
    creator: any;
    num_players: any;
    max_players: any;
    max_turns: any;
    start_time: any;
  } | null> | null;
};

export type UserGamesQueryVariables = Exact<{
  id: Scalars["felt252"];
}>;

export type UserGamesQuery = {
  __typename?: "Query";
  gameComponents?: Array<{ __typename?: "Game"; game_id: any } | null> | null;
};

export type GlobalScoresQueryVariables = Exact<{
  limit?: InputMaybe<Scalars["Int"]>;
}>;

export type GlobalScoresQuery = {
  __typename?: "Query";
  playerComponents?: Array<{
    __typename?: "Player";
    cash: any;
    entity?: {
      __typename?: "Entity";
      keys: string;
      components?: Array<
        | { __typename: "Drug" }
        | { __typename: "Game" }
        | { __typename: "Location" }
        | { __typename: "Market" }
        | { __typename: "Name"; short_string: any }
        | { __typename: "Player" }
        | { __typename: "Risks" }
        | null
      > | null;
    } | null;
  } | null> | null;
};

export type GameEntityQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GameEntityQuery = {
  __typename?: "Query";
  entity: {
    __typename?: "Entity";
    components?: Array<
      | { __typename: "Drug" }
      | {
          __typename: "Game";
          creator: any;
          game_id: any;
          is_finished: any;
          max_players: any;
          max_turns: any;
          num_players: any;
          start_time: any;
        }
      | { __typename: "Location" }
      | { __typename: "Market" }
      | { __typename: "Name" }
      | { __typename: "Player" }
      | { __typename: "Risks" }
      | null
    > | null;
  };
};

export type PlayerEntityQueryVariables = Exact<{
  gameId: Scalars["String"];
  playerId: Scalars["String"];
}>;

export type PlayerEntityQuery = {
  __typename?: "Query";
  entities?: Array<{
    __typename?: "Entity";
    components?: Array<
      | { __typename: "Drug"; quantity: any }
      | { __typename: "Game" }
      | { __typename: "Location"; name: any }
      | { __typename: "Market" }
      | { __typename: "Name"; short_string: any }
      | { __typename: "Player"; cash: any; health: any; turns_remaining: any }
      | { __typename: "Risks" }
      | null
    > | null;
  } | null> | null;
};

export type LocationEntitiesQueryVariables = Exact<{
  gameId: Scalars["String"];
  location: Scalars["String"];
}>;

export type LocationEntitiesQuery = {
  __typename?: "Query";
  entities?: Array<{
    __typename?: "Entity";
    components?: Array<
      | { __typename: "Drug" }
      | { __typename: "Game" }
      | { __typename: "Location"; name: any }
      | { __typename: "Market"; cash: any; quantity: any }
      | { __typename: "Name"; short_string: any }
      | { __typename: "Player" }
      | {
          __typename: "Risks";
          arrested: any;
          hurt: any;
          mugged: any;
          travel: any;
        }
      | null
    > | null;
  } | null> | null;
};

export const AvailableGamesDocument = `
    query AvailableGames {
  gameComponents(limit: 10) {
    game_id
    creator
    num_players
    max_players
    max_turns
    start_time
  }
}
    `;
export const useAvailableGamesQuery = <
  TData = AvailableGamesQuery,
  TError = unknown,
>(
  variables?: AvailableGamesQueryVariables,
  options?: UseQueryOptions<AvailableGamesQuery, TError, TData>,
) =>
  useQuery<AvailableGamesQuery, TError, TData>(
    variables === undefined
      ? ["AvailableGames"]
      : ["AvailableGames", variables],
    useFetchData<AvailableGamesQuery, AvailableGamesQueryVariables>(
      AvailableGamesDocument,
    ).bind(null, variables),
    options,
  );

useAvailableGamesQuery.getKey = (variables?: AvailableGamesQueryVariables) =>
  variables === undefined ? ["AvailableGames"] : ["AvailableGames", variables];
export const useInfiniteAvailableGamesQuery = <
  TData = AvailableGamesQuery,
  TError = unknown,
>(
  variables?: AvailableGamesQueryVariables,
  options?: UseInfiniteQueryOptions<AvailableGamesQuery, TError, TData>,
) => {
  const query = useFetchData<AvailableGamesQuery, AvailableGamesQueryVariables>(
    AvailableGamesDocument,
  );
  return useInfiniteQuery<AvailableGamesQuery, TError, TData>(
    variables === undefined
      ? ["AvailableGames.infinite"]
      : ["AvailableGames.infinite", variables],
    (metaData) => query({ ...variables, ...(metaData.pageParam ?? {}) }),
    options,
  );
};

useInfiniteAvailableGamesQuery.getKey = (
  variables?: AvailableGamesQueryVariables,
) =>
  variables === undefined
    ? ["AvailableGames.infinite"]
    : ["AvailableGames.infinite", variables];
export const UserGamesDocument = `
    query UserGames($id: felt252!) {
  gameComponents(creator: $id) {
    game_id
  }
}
    `;
export const useUserGamesQuery = <TData = UserGamesQuery, TError = unknown>(
  variables: UserGamesQueryVariables,
  options?: UseQueryOptions<UserGamesQuery, TError, TData>,
) =>
  useQuery<UserGamesQuery, TError, TData>(
    ["UserGames", variables],
    useFetchData<UserGamesQuery, UserGamesQueryVariables>(
      UserGamesDocument,
    ).bind(null, variables),
    options,
  );

useUserGamesQuery.getKey = (variables: UserGamesQueryVariables) => [
  "UserGames",
  variables,
];
export const useInfiniteUserGamesQuery = <
  TData = UserGamesQuery,
  TError = unknown,
>(
  variables: UserGamesQueryVariables,
  options?: UseInfiniteQueryOptions<UserGamesQuery, TError, TData>,
) => {
  const query = useFetchData<UserGamesQuery, UserGamesQueryVariables>(
    UserGamesDocument,
  );
  return useInfiniteQuery<UserGamesQuery, TError, TData>(
    ["UserGames.infinite", variables],
    (metaData) => query({ ...variables, ...(metaData.pageParam ?? {}) }),
    options,
  );
};

useInfiniteUserGamesQuery.getKey = (variables: UserGamesQueryVariables) => [
  "UserGames.infinite",
  variables,
];
export const GlobalScoresDocument = `
    query GlobalScores($limit: Int) {
  playerComponents(turns_remaining: 0, limit: $limit) {
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
}
    `;
export const useGlobalScoresQuery = <
  TData = GlobalScoresQuery,
  TError = unknown,
>(
  variables?: GlobalScoresQueryVariables,
  options?: UseQueryOptions<GlobalScoresQuery, TError, TData>,
) =>
  useQuery<GlobalScoresQuery, TError, TData>(
    variables === undefined ? ["GlobalScores"] : ["GlobalScores", variables],
    useFetchData<GlobalScoresQuery, GlobalScoresQueryVariables>(
      GlobalScoresDocument,
    ).bind(null, variables),
    options,
  );

useGlobalScoresQuery.getKey = (variables?: GlobalScoresQueryVariables) =>
  variables === undefined ? ["GlobalScores"] : ["GlobalScores", variables];
export const useInfiniteGlobalScoresQuery = <
  TData = GlobalScoresQuery,
  TError = unknown,
>(
  variables?: GlobalScoresQueryVariables,
  options?: UseInfiniteQueryOptions<GlobalScoresQuery, TError, TData>,
) => {
  const query = useFetchData<GlobalScoresQuery, GlobalScoresQueryVariables>(
    GlobalScoresDocument,
  );
  return useInfiniteQuery<GlobalScoresQuery, TError, TData>(
    variables === undefined
      ? ["GlobalScores.infinite"]
      : ["GlobalScores.infinite", variables],
    (metaData) => query({ ...variables, ...(metaData.pageParam ?? {}) }),
    options,
  );
};

useInfiniteGlobalScoresQuery.getKey = (
  variables?: GlobalScoresQueryVariables,
) =>
  variables === undefined
    ? ["GlobalScores.infinite"]
    : ["GlobalScores.infinite", variables];
export const GameEntityDocument = `
    query GameEntity($id: ID!) {
  entity(id: $id) {
    components {
      __typename
      ... on Game {
        creator
        game_id
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
export const useGameEntityQuery = <TData = GameEntityQuery, TError = unknown>(
  variables: GameEntityQueryVariables,
  options?: UseQueryOptions<GameEntityQuery, TError, TData>,
) =>
  useQuery<GameEntityQuery, TError, TData>(
    ["GameEntity", variables],
    useFetchData<GameEntityQuery, GameEntityQueryVariables>(
      GameEntityDocument,
    ).bind(null, variables),
    options,
  );

useGameEntityQuery.getKey = (variables: GameEntityQueryVariables) => [
  "GameEntity",
  variables,
];
export const useInfiniteGameEntityQuery = <
  TData = GameEntityQuery,
  TError = unknown,
>(
  variables: GameEntityQueryVariables,
  options?: UseInfiniteQueryOptions<GameEntityQuery, TError, TData>,
) => {
  const query = useFetchData<GameEntityQuery, GameEntityQueryVariables>(
    GameEntityDocument,
  );
  return useInfiniteQuery<GameEntityQuery, TError, TData>(
    ["GameEntity.infinite", variables],
    (metaData) => query({ ...variables, ...(metaData.pageParam ?? {}) }),
    options,
  );
};

useInfiniteGameEntityQuery.getKey = (variables: GameEntityQueryVariables) => [
  "GameEntity.infinite",
  variables,
];
export const PlayerEntityDocument = `
    query PlayerEntity($gameId: String!, $playerId: String!) {
  entities(keys: [$gameId, $playerId]) {
    components {
      __typename
      ... on Player {
        cash
        health
        turns_remaining
      }
      ... on Location {
        name
      }
      ... on Drug {
        quantity
      }
      ... on Name {
        short_string
      }
    }
  }
}
    `;
export const usePlayerEntityQuery = <
  TData = PlayerEntityQuery,
  TError = unknown,
>(
  variables: PlayerEntityQueryVariables,
  options?: UseQueryOptions<PlayerEntityQuery, TError, TData>,
) =>
  useQuery<PlayerEntityQuery, TError, TData>(
    ["PlayerEntity", variables],
    useFetchData<PlayerEntityQuery, PlayerEntityQueryVariables>(
      PlayerEntityDocument,
    ).bind(null, variables),
    options,
  );

usePlayerEntityQuery.getKey = (variables: PlayerEntityQueryVariables) => [
  "PlayerEntity",
  variables,
];
export const useInfinitePlayerEntityQuery = <
  TData = PlayerEntityQuery,
  TError = unknown,
>(
  variables: PlayerEntityQueryVariables,
  options?: UseInfiniteQueryOptions<PlayerEntityQuery, TError, TData>,
) => {
  const query = useFetchData<PlayerEntityQuery, PlayerEntityQueryVariables>(
    PlayerEntityDocument,
  );
  return useInfiniteQuery<PlayerEntityQuery, TError, TData>(
    ["PlayerEntity.infinite", variables],
    (metaData) => query({ ...variables, ...(metaData.pageParam ?? {}) }),
    options,
  );
};

useInfinitePlayerEntityQuery.getKey = (
  variables: PlayerEntityQueryVariables,
) => ["PlayerEntity.infinite", variables];
export const LocationEntitiesDocument = `
    query LocationEntities($gameId: String!, $location: String!) {
  entities(keys: [$gameId, $location]) {
    components {
      __typename
      ... on Name {
        short_string
      }
      ... on Market {
        cash
        quantity
      }
      ... on Location {
        name
      }
      ... on Risks {
        arrested
        hurt
        mugged
        travel
      }
    }
  }
}
    `;
export const useLocationEntitiesQuery = <
  TData = LocationEntitiesQuery,
  TError = unknown,
>(
  variables: LocationEntitiesQueryVariables,
  options?: UseQueryOptions<LocationEntitiesQuery, TError, TData>,
) =>
  useQuery<LocationEntitiesQuery, TError, TData>(
    ["LocationEntities", variables],
    useFetchData<LocationEntitiesQuery, LocationEntitiesQueryVariables>(
      LocationEntitiesDocument,
    ).bind(null, variables),
    options,
  );

useLocationEntitiesQuery.getKey = (
  variables: LocationEntitiesQueryVariables,
) => ["LocationEntities", variables];
export const useInfiniteLocationEntitiesQuery = <
  TData = LocationEntitiesQuery,
  TError = unknown,
>(
  variables: LocationEntitiesQueryVariables,
  options?: UseInfiniteQueryOptions<LocationEntitiesQuery, TError, TData>,
) => {
  const query = useFetchData<
    LocationEntitiesQuery,
    LocationEntitiesQueryVariables
  >(LocationEntitiesDocument);
  return useInfiniteQuery<LocationEntitiesQuery, TError, TData>(
    ["LocationEntities.infinite", variables],
    (metaData) => query({ ...variables, ...(metaData.pageParam ?? {}) }),
    options,
  );
};

useInfiniteLocationEntitiesQuery.getKey = (
  variables: LocationEntitiesQueryVariables,
) => ["LocationEntities.infinite", variables];
