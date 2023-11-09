import { shortString } from "starknet";
import { useEffect, useMemo, useState } from "react";
import { REFETCH_INTERVAL, SCALING_FACTOR } from "../constants";
import {
  Player,
  Drug as DrugType,
  Item as ItemType,
  Encounter,
  usePlayerLogsQuery,
  World__EventEdge,
} from "@/generated/graphql";
import { PlayerStatus, ItemEnum, ItemTextEnum } from "../types";
import { ParseEventResult, parseEvent } from "@/dojo/events";

export class PlayerLogs {
  logs: World__EventEdge[];
  parsedLogs: { log: World__EventEdge; parsed: ParseEventResult }[];

  constructor(logs: World__EventEdge[]) {
    this.logs = logs || [];
    this.parsedLogs = this.logs
      .map((e: World__EventEdge) => {
        const id = e.node.id.split(":");
        return {
          idx : id[0] * 1_000 + id[2],
          blocknumber: id[0],
          event_idx: id[2],
          log: e,
          parsed: parseEvent(e.node),
        };
      })
      //.sort((a,b) => a.idx - b.idx)
      //.reverse();
  }

  static create(edges: World__EventEdge[]): PlayerLogs | undefined {
    if (!edges || edges.length === 0) return undefined;
    return new PlayerLogs(edges || []);
  }
}

export interface PlayerLogsInterface {
  playerLogs?: PlayerLogs;
  isFetched: boolean;
}

export const usePlayerLogs = ({ gameId, playerId }: { gameId?: string; playerId?: string }): PlayerLogsInterface => {
  const { data, isFetched } = usePlayerLogsQuery(
    { game_id: gameId || "", player_id: playerId || "" },
    {
      enabled: !!gameId && !!playerId,
      refetchInterval: 3 * REFETCH_INTERVAL,
    },
  );

  const playerLogs = useMemo(() => {
    return PlayerLogs.create(data?.events?.edges as World__EventEdge[]);
  }, [data]);

  return {
    playerLogs,
    isFetched,
  };
};
