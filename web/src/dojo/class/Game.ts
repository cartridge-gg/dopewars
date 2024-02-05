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
export type WantedByLocation = Map<string, number>;

export class GameClass {
    packed: bigint;

    markets: MarketsClass;
    items: ItemsClass;
    drugs: DrugsClass;
    wanted: WantedClass;
    player: PlayerClass;


    constructor(configStore: ConfigStore, gameStorePacked: GameStorePacked) {
        this.packed = gameStorePacked.packed;
        //
        const markets = configStore.getGameStoreLayoutItem("Markets")
        const marketsPacked = Bits.extract(this.packed, markets.idx, markets.bits);
        this.markets = new MarketsClass(configStore, marketsPacked)

        const items = configStore.getGameStoreLayoutItem("Items")
        const itemsPacked = Bits.extract(this.packed, items.idx, items.bits);
        this.items = new ItemsClass(configStore, itemsPacked)

        const drugs = configStore.getGameStoreLayoutItem("Drugs")
        const drugsPacked = Bits.extract(this.packed, drugs.idx, drugs.bits);
        this.drugs = new DrugsClass(configStore, drugsPacked)

        const wanted = configStore.getGameStoreLayoutItem("Wanted")
        const wantedPacked = Bits.extract(this.packed, wanted.idx, wanted.bits);
        this.wanted = new WantedClass(configStore, wantedPacked)

        const player = configStore.getGameStoreLayoutItem("Player")
        const playerPacked = Bits.extract(this.packed, player.idx, player.bits)
        this.player = new PlayerClass(configStore, playerPacked);

        console.log("Game", this)
    }
}

export class MarketsClass {
    //
    drugCountByLocation = 4n;
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
            const location = configStore.getLocationById(locationId)!;

            for (let drugId of [0, 1, 2, 3, /*4, 5*/]) {
                const drug = configStore.getDrugById(drugId)!;
                const price = this.getDrugPrice(locationId , drugId as Drug);

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
        const start = BigInt((BigInt(locationId-1) * this.drugCountByLocation + BigInt(drugId)) * this.bitsSize);
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


export class ItemsClass {
    bitsSize = 2n;
    //
    packed: bigint;
    //
    attack: ItemConfigFull;
    defense: ItemConfigFull;
    speed: ItemConfigFull;
    transport: ItemConfigFull;

    constructor(configStore: ConfigStore, packed: bigint) {
        this.packed = packed

        const attackLevel = Number(Bits.extract(this.packed, 0n * this.bitsSize, this.bitsSize));
        const defenseLevel = Number(Bits.extract(this.packed, 1n * this.bitsSize, this.bitsSize));
        const speedLevel = Number(Bits.extract(this.packed, 2n * this.bitsSize, this.bitsSize));
        const transportLevel = Number(Bits.extract(this.packed, 3n * this.bitsSize, this.bitsSize));

        this.attack = configStore.getItemByIds(0, attackLevel)
        this.defense = configStore.getItemByIds(1, defenseLevel)
        this.speed = configStore.getItemByIds(2, speedLevel)

        this.transport = configStore.getItemByIds(3, transportLevel)
    }
}


export class DrugsClass {
    //
    packed: bigint;
    //
    drug: DrugConfigFull | undefined;
    quantity: number;

    constructor(configStore: ConfigStore, packed: bigint) {
        this.packed = packed

        const drugId = Number(Bits.extract(this.packed, 0n, 3n));
        this.quantity = Number(Bits.extract(this.packed, 3n, 13n));

        this.drug = this.quantity > 0 ?
            configStore.getDrugById(drugId)
            : undefined

    }
}

export class WantedClass {
    bitsSize = 3n;
    //
    packed: bigint;
    //
    wantedByLocation: WantedByLocation = new Map()

    constructor(configStore: ConfigStore, packed: bigint) {
        this.packed = packed

        for (let locationId of [1n, 2n, 3n, 4n, 5n, 6n]) {
            const location = configStore.getLocationById(locationId)!;

            const index = (locationId - 1n) * this.bitsSize
            const wantedTick = Number(Bits.extract(this.packed, index, this.bitsSize));
            const wantedValue = this.getValueByTick(wantedTick)

            this.wantedByLocation.set(location.location, wantedValue);
        }
    }

    getValueByTick(tick: number) {
        const totalValues = Number(this.bitsSize) ** 2
        const step = 100 / totalValues
        return Math.floor(tick * step)
    }
}


export class PlayerClass {
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

        const cash = configStore.getPlayerLayoutItem("Cash")
        const health = configStore.getPlayerLayoutItem("Health")
        const turn = configStore.getPlayerLayoutItem("Turn")
        const status = configStore.getPlayerLayoutItem("Status")
        const prevLocation = configStore.getPlayerLayoutItem("PrevLocation")
        const location = configStore.getPlayerLayoutItem("Location")
        const nextLocation = configStore.getPlayerLayoutItem("NextLocation")

        this.cash = Number(Bits.extract(this.packed, cash.idx, cash.bits))
        this.health = Number(Bits.extract(this.packed, health.idx, health.bits))
        this.turn = Number(Bits.extract(this.packed, turn.idx, turn.bits))
        this.status = Number(Bits.extract(this.packed, status.idx, status.bits))

        const prevLocationId = Bits.extract(this.packed, prevLocation.idx, prevLocation.bits);
        const locationId = Bits.extract(this.packed, location.idx, location.bits);
        const nextLocationId = Bits.extract(this.packed, nextLocation.idx, nextLocation.bits);

        this.prevLocation = configStore.getLocationById(prevLocationId)
        this.location = configStore.getLocationById(locationId)
        this.nextLocation = configStore.getLocationById(nextLocationId)

    }

}



