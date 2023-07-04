import { Account, CallData, shortString } from "starknet";
import { useDojo } from "./dojo";
import { TradeDirection } from "./state";

interface RyoWorldInterface {
  create: (
    startTime: number,
    maxPlayers: number,
    maxTurns: number,
  ) => Promise<void>;
  join: (gameId: string) => Promise<void>;
  travel: (gameId: string, locationId: string) => Promise<void>;
  trade: (
    gameId: string,
    locationId: string,
    drugId: string,
    quantity: number,
    direction: TradeDirection,
  ) => Promise<void>;
}

const useRyoWorld = (
  account: Account,
  worldAddress: string,
): RyoWorldInterface => {
  const { execute } = useDojo();

  const create = async (
    startTime: number,
    maxPlayers: number,
    maxTurns: number,
  ) => {
    await execute("create", []);
  };

  const join = async (gameId: string) => {
    await execute("join", []);
  };

  const travel = async (gameId: string, locationId: string) => {
    await execute("travel", []);
  };

  const trade = async (
    gameId: string,
    locationId: string,
    drugId: string,
    quantity: number,
    direction: TradeDirection,
  ) => {
    await execute("trade", []);
  };

  return {
    create,
    join,
    trade,
    travel,
  };
};
