import { GameStorePacked } from "@/generated/graphql";
import { ConfigStore, ItemConfigFull, LocationConfigFull } from "../stores/config";
import { Drug } from "../types";
import Bits from "./Bits";


export type DrugMarket = {
    drug: string;
    drugId: number;
    price: number;
    weight: number;
  };
  
export type MarketsByLocation = Map<string, DrugMarket[]>;
  
export class Game {
    packed: bigint;

    marketsPacked: bigint;
    markets: Markets;

    itemsPacked: bigint;
    items: Items;

    playerPacked: bigint;
    player: Player;


    constructor(configStore: ConfigStore, gameStorePacked: GameStorePacked) {
        this.packed = gameStorePacked.packed;
        //
        this.marketsPacked = Bits.extract(this.packed, 0n, 144n);
        this.markets = new Markets(configStore, this.marketsPacked)

        this.itemsPacked = Bits.extract(this.packed, 144n, 8n);
        this.items = new Items(configStore, this.itemsPacked)

        this.playerPacked = Bits.extract(this.packed, 144n + 8n, 44n)
        this.player = new Player(configStore, this.playerPacked);

        console.log("Game", this)
    }
}


export class Player {
    packed: bigint;
    //
    cash: number;
    health: number;
    turn: number;
    status: number;
    prevLocation: LocationConfigFull;
    location: LocationConfigFull;
    nextLocation: LocationConfigFull;

    constructor(configStore: ConfigStore, playerPacked: bigint) {
        this.packed = playerPacked;

        this.cash = Bits.extract(this.packed, 0n, 28n)
        this.health = Bits.extract(this.packed, 28n, 7n)
        this.turn = Bits.extract(this.packed, 28n + 7n, 5n)
        this.status = Bits.extract(this.packed, 28n + 7n + 5n, 2n)

        const prevLocationId = Bits.extract(this.packed, 28n + 7n + 5n + 2n, 3n);
        const locationId = Bits.extract(this.packed, 28n + 7n + 5n + 2n + 3n, 3n);
        const nextLocationId = Bits.extract(this.packed, 28n + 7n + 5n + 2n + 3n + 3n, 3n);

        this.prevLocation = configStore.getLocationById(prevLocationId)
        this.location = configStore.getLocationById(locationId)
        this.nextLocation = configStore.getLocationById(nextLocationId)

    }

}


export class Items {
    packed: bigint;
    //
    attack: ItemConfigFull;
    defense: ItemConfigFull;
    speed: ItemConfigFull;
    transport: ItemConfigFull;

    constructor(configStore: ConfigStore, packed: bigint) {
        this.packed = packed

        const attackLevel = Number(Bits.extract(this.packed, 0n, 2n));
        const defenseLevel = Number(Bits.extract(this.packed, 2n, 2n));
        const speedLevel = Number(Bits.extract(this.packed, 4n, 2n));
        const transportLevel = Number(Bits.extract(this.packed, 6n, 2n));

        this.attack = configStore.getItemByIds(0, attackLevel)
        this.defense = configStore.getItemByIds(1, defenseLevel)
        this.speed = configStore.getItemByIds(2, speedLevel)
        this.transport = configStore.getItemByIds(3, transportLevel)
    }
}


export class Markets {
    //
    locationCount = 6n;
    bitsSize = 6n;
    //
    configStore: ConfigStore;
    //
    packed: bigint;
    //
    marketsByLocation: MarketsByLocation = new Map()

    constructor(configStore: ConfigStore, packed: bigint) {
        this.configStore = configStore
        this.packed = packed

        //const availableDrugs =  TODO: filter available drugs by turn

        for (let locationId of [1, 2, 3, 4, 5, 6]) {
            for (let drugId of [0, 1, 2, 3, 4, 5]) {
                const drug = configStore.getDrugById(drugId)!;
                const location = configStore.getLocationById(locationId)!;
                const price = this.getDrugPrice(locationId - 1, drugId as Drug);

                const drugMarket: DrugMarket = {
                    drug: drug.drug,
                    drugId: drug.drug_id,
                    price: price,
                    weight: drug.weight / 100
                };

                if (this.marketsByLocation.has(location.location)) {
                    this.marketsByLocation.get(location.location)?.push(drugMarket);
                } else {
                    this.marketsByLocation.set(location.location, [drugMarket]);
                }
            }
        }
    }

    getTick(locationId: number, drugId: Drug) {
        const start = BigInt((BigInt(locationId) * this.locationCount + BigInt(drugId)) * this.bitsSize);
        return Bits.extract(this.packed, start, this.bitsSize)
    }

    getDrugPriceByTick(drugId: Drug, tick: bigint) {
        const drugConfig = this.configStore.getDrugById(drugId);
        return Number(tick) * Number(drugConfig.step) + Number(drugConfig.base);
    }

    getDrugPrice(locationId: number, drugId: Drug): number {
        const tick = this.getTick(locationId, drugId);
        return this.getDrugPriceByTick(drugId, tick);
    }

}




