import { SetupNetworkResult } from "./setupNetwork";
import { Account, BigNumberish, GetTransactionReceiptResponse } from "starknet";
import { EntityIndex, getComponentValue } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { updatePositionWithDirection } from "../utils";
import { getEvents, setComponentsFromEvents } from "@dojoengine/utils";
import { parseAllEvents, JoinedEventData, MarketEventData, AdverseEventData, ConsequenceEventData } from "./events";
import { WorldEvents } from "./generated/contractEvents";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls({ execute, contractComponents }: SetupNetworkResult) {

    const executeAndReceipt = async (signer: Account, contract: string, system: string, callData: BigNumberish[]): {
        hash: string,
        receipt: GetTransactionReceiptResponse,
        events: any[],
        parsedEvents: any[],
    } => {
        const tx = await execute(signer, contract, system, callData);
        const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })
        const events = getEvents(receipt)
        const parsedEvents = parseAllEvents(receipt)

        setComponentsFromEvents(contractComponents, events);

        return {
            hash: tx.transaction_hash,
            receipt,
            events,
            parsedEvents
        }
    }

    const createGame = async (signer: Account, startTime: number, maxPlayers: number, nbTurns: number) => {
        const {
            hash,
            receipt,
            events,
            parsedEvents
        } = await executeAndReceipt(signer, "lobby", 'create_game', [startTime, maxPlayers, nbTurns]);

        const joinedEvent = parsedEvents.find(e => e.eventType === WorldEvents.PlayerJoined) as JoinedEventData

        return {
            hash,
            gameId: joinedEvent.gameId
        }
    };

    const travel = async (signer: Account, gameId: string, locationId: string) => {
        const {
            hash,
            receipt,
            events,
            parsedEvents
        } = await executeAndReceipt(signer, "travel", 'travel', [gameId, locationId]);

        return {
            hash,
            event: parsedEvents.find(e => e.eventType === WorldEvents.AdverseEvent) as AdverseEventData,
            events: parsedEvents.filter(e => e.eventType === WorldEvents.MarketEvent).map(e => e as MarketEventData),
        }
    }

    const buy = async (signer: Account, gameId: string, locationId: string, drugId: string, quantity: number) => {
        const {
            hash,
            receipt,
            events,
            parsedEvents
        } = await executeAndReceipt(signer, "trade", 'buy', [gameId, locationId, drugId, quantity]);

        return {
            hash
        }
    }

    const sell = async (signer: Account, gameId: string, locationId: string, drugId: string, quantity: number) => {
        const {
            hash,
            receipt,
            events,
            parsedEvents
        } = await executeAndReceipt(signer, "trade", 'sell', [gameId, locationId, drugId, quantity]);

        return {
            hash
        }
    }

    const decide = async (signer: Account, gameId: string, action: Action, nextLocationId: string) => {
        const {
            hash,
            receipt,
            events,
            parsedEvents
        } = await executeAndReceipt(signer, "decide", 'decide', [gameId, action, nextLocationId]);

        return {
            hash,
            event: parsedEvents.find(e => e.eventType === WorldEvents.Consequence) as ConsequenceEventData,
        }
    }

    const setName = async (signer: Account, gameId: string, playerName: string) => {
        const {
            hash,
            receipt,
            events,
            parsedEvents
        } = await executeAndReceipt(signer, "lobby", 'set_name', [gameId, playerName]);

        return {
            hash
        }
    }


    return {
        createGame,
        travel,
        buy,
        sell,
        decide,
        setName
    };

}

