import { GameStorePacked } from "@/generated/graphql";
import { computed, makeObservable, observable } from "mobx";
import { CairoCustomEnum } from "starknet";
import { ConfigStore, DrugConfigFull, LocationConfigFull } from "../stores/config";
import { Drug, ItemSlot, ShopAction, TradeAction, TradeDirection } from "../types";
import Bits from "./Bits";

export type DrugMarket = {
    drug: string;
    drugId: number;
    price: number;
    weight: number;
};

export type MarketsByLocation = Map<string, DrugMarket[]>;
export type WantedByLocation = Map<string, number>;

export type WithCost = { cost: number };
export type PendingCall = (TradeAction | ShopAction);
export type PendingCallWithCost = (TradeAction | ShopAction) & WithCost;

export const isTradeAction = (i: PendingCall): i is TradeAction => "direction" in i;
export const isShopAction = (i: PendingCall): i is ShopAction => "slot" in i;

export const pendingCallToCairoEnum = (i: PendingCall) => {
    if (isTradeAction(i)) {
        return new CairoCustomEnum({ Trade: (i as TradeAction), Shop: undefined });
    } else if (isShopAction(i)) {
        return new CairoCustomEnum({ Trade: undefined, Shop: (i as ShopAction) });
    }
}

export class GameClass {
    packed: bigint;

    markets: MarketsClass;
    items: ItemsClass;
    drugs: DrugsClass;
    wanted: WantedClass;
    player: PlayerClass;

    pending: Array<PendingCallWithCost>;

    constructor(configStore: ConfigStore, gameStorePacked: GameStorePacked) {
        this.packed = gameStorePacked.packed;
        //
        const markets = configStore.getGameStoreLayoutItem("Markets")
        const marketsPacked = Bits.extract(this.packed, markets.idx, markets.bits);
        this.markets = new MarketsClass(configStore, this, marketsPacked)

        const items = configStore.getGameStoreLayoutItem("Items")
        const itemsPacked = Bits.extract(this.packed, items.idx, items.bits);
        this.items = new ItemsClass(configStore, this, itemsPacked)

        const drugs = configStore.getGameStoreLayoutItem("Drugs")
        const drugsPacked = Bits.extract(this.packed, drugs.idx, drugs.bits);
        this.drugs = new DrugsClass(configStore, this, drugsPacked)

        const wanted = configStore.getGameStoreLayoutItem("Wanted")
        const wantedPacked = Bits.extract(this.packed, wanted.idx, wanted.bits);
        this.wanted = new WantedClass(configStore, this, wantedPacked)

        const player = configStore.getGameStoreLayoutItem("Player")
        const playerPacked = Bits.extract(this.packed, player.idx, player.bits)
        this.player = new PlayerClass(configStore, this, playerPacked);

        this.pending = []

        makeObservable(this, {
            pending: observable,
        })

        console.log("Game", this)
    }


    clearPendingCalls() {
        this.pending = []
    }

    pushCall(call: PendingCallWithCost) {
        this.pending.push(call)
    }

    getPendingCalls(): Array<PendingCall> {
        return this.pending
            .map(i => {
                const {
                    cost: _,
                    ...withoutCost
                } = i
                return withoutCost
            })
    }
}


//
//
//

export abstract class GameSubClass {
    game: GameClass;
    configStore: ConfigStore;
    packed: bigint;

    constructor(configStore: ConfigStore, game: GameClass, packed: bigint) {
        this.configStore = configStore
        this.game = game
        this.packed = packed
    }

}

//
//
//

export class MarketsClass extends GameSubClass {
    drugCountByLocation = 4n;
    bitsSize = 6n;
    //
    marketsByLocation: MarketsByLocation = new Map()

    constructor(configStore: ConfigStore, game: GameClass, packed: bigint) {
        super(configStore, game, packed);

        //const availableDrugs =  TODO: filter available drugs by turn

        for (let locationId of [1, 2, 3, 4, 5, 6]) {
            const location = configStore.getLocationById(locationId)!;

            for (let drugId of [0, 1, 2, 3, /*4, 5*/]) {
                const drug = configStore.getDrugById(drugId)!;
                const price = this.getDrugPrice(locationId, drugId as Drug);

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
        const start = BigInt((BigInt(locationId - 1) * this.drugCountByLocation + BigInt(drugId)) * this.bitsSize);
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


export class ItemsClass extends GameSubClass {
    bitsSize = 2n;
    //
    attackLevel: number;
    defenseLevel: number;
    speedLevel: number;
    transportLevel: number;

    constructor(configStore: ConfigStore, game: GameClass, packed: bigint) {
        super(configStore, game, packed);

        this.attackLevel = Number(Bits.extract(this.packed, BigInt(ItemSlot.Attack) * this.bitsSize, this.bitsSize));
        this.defenseLevel = Number(Bits.extract(this.packed, BigInt(ItemSlot.Defense) * this.bitsSize, this.bitsSize));
        this.speedLevel = Number(Bits.extract(this.packed, BigInt(ItemSlot.Speed) * this.bitsSize, this.bitsSize));
        this.transportLevel = Number(Bits.extract(this.packed, BigInt(ItemSlot.Transport) * this.bitsSize, this.bitsSize));

        makeObservable(this, {
            attack: computed,
            defense: computed,
            speed: computed,
            transport: computed,
            game: observable,
        })

    }

    get attack() {
        let level = this.attackLevel
        if (this.game?.pending && this.game?.pending?.length > 0) {
            level += this.game.pending
                .filter(isShopAction)
                .map(i => i as ShopAction)
                .filter(i => i.slot === ItemSlot.Attack)
                .length
        }
        return this.configStore.getItemByIds(0, level)
    }

    get defense() {
        let level = this.defenseLevel
        if (this.game?.pending && this.game?.pending?.length > 0) {
            level += this.game.pending
                .filter(isShopAction)
                .map(i => i as ShopAction)
                .filter(i => i.slot === ItemSlot.Defense)
                .length
        }

        return this.configStore.getItemByIds(1, level)
    }

    get speed() {
        let level = this.speedLevel
        if (this.game?.pending && this.game?.pending?.length > 0) {
            level += this.game.pending
                .filter(isShopAction)
                .map(i => i as ShopAction)
                .filter(i => i.slot === ItemSlot.Speed)
                .length
        }

        return this.configStore.getItemByIds(2, level)
    }

    get transport() {
        let level = this.transportLevel
        if (this.game?.pending && this.game?.pending?.length > 0) {
            level += this.game.pending
                .filter(isShopAction)
                .map(i => i as ShopAction)
                .filter(i => i.slot === ItemSlot.Transport)
                .length
        }
        return this.configStore.getItemByIds(3, level)
    }
}


export class DrugsClass extends GameSubClass {
    private _drug: DrugConfigFull | undefined;
    private _quantity: number;

    constructor(configStore: ConfigStore, game: GameClass, packed: bigint) {
        super(configStore, game, packed);

        const drugId = Number(Bits.extract(this.packed, 0n, 3n));
        this._quantity = Number(Bits.extract(this.packed, 3n, 13n));

        this._drug = this.quantity > 0 ?
            configStore.getDrugById(drugId)
            : undefined

    }

    get drug() {
        if (this.game?.pending?.length === 0) return this._drug

        const { drug } = this.simulateTrades()
        return drug
    }

    get quantity() {
        if (this.game?.pending?.length === 0) return this._quantity

        const { quantity } = this.simulateTrades()
        return quantity
    }

    private simulateTrades = () => {
        let drug = this._drug
        let quantity = this._quantity

        if (!this.game?.pending || this.game?.pending?.length === 0) return { drug, quantity }
        const trades = this.game.pending.filter(isTradeAction).map(i => i as TradeAction)

        for (let trade of trades) {
            if (trade.direction === TradeDirection.Buy) {
                if (!drug || drug.drug_id === trade.drug) {
                    drug = this.configStore.getDrugById(trade.drug)
                    quantity += trade.quantity
                }
                else {
                    console.log("******* should not happend")
                }

            }

            if (trade.direction === TradeDirection.Sell) {
                if (drug && drug.drug_id === trade.drug) {
                    quantity -= trade.quantity
                    if (quantity === 0) {
                        drug = undefined
                    }
                }
                else {
                    console.log("******* should not happend")
                }
            }
        }
        return {
            drug,
            quantity
        }

    }
}

export class WantedClass extends GameSubClass {
    bitsSize = 3n;
    //
    wantedByLocation: WantedByLocation = new Map()

    constructor(configStore: ConfigStore, game: GameClass, packed: bigint) {
        super(configStore, game, packed);

        for (let locationId of [1, 2, 3, 4, 5, 6]) {
            const location = configStore.getLocationById(locationId)!;

            const index = (BigInt(locationId) - 1n) * this.bitsSize
            const wantedTick = Number(Bits.extract(this.packed, index, this.bitsSize));
            const wantedValue = this.getValueByTick(wantedTick)

            this.wantedByLocation.set(location.location, wantedValue);
        }
    }

    getValueByTick(tick: number) {
        const totalValues = 2 ** Number(this.bitsSize)
        const step = 100 / (totalValues - 1)
        return Math.floor(tick * step)
    }
}


export class PlayerClass extends GameSubClass {
    private _cash: number;
    health: number;
    turn: number;
    status: number;
    prevLocation: LocationConfigFull;
    location: LocationConfigFull;
    nextLocation: LocationConfigFull;

    constructor(configStore: ConfigStore, game: GameClass, packed: bigint) {
        super(configStore, game, packed);

        const cash = configStore.getPlayerLayoutItem("Cash")
        const health = configStore.getPlayerLayoutItem("Health")
        const turn = configStore.getPlayerLayoutItem("Turn")
        const status = configStore.getPlayerLayoutItem("Status")
        const prevLocation = configStore.getPlayerLayoutItem("PrevLocation")
        const location = configStore.getPlayerLayoutItem("Location")
        const nextLocation = configStore.getPlayerLayoutItem("NextLocation")

        this._cash = Number(Bits.extract(this.packed, cash.idx, cash.bits))
        this.health = Number(Bits.extract(this.packed, health.idx, health.bits))
        this.turn = Number(Bits.extract(this.packed, turn.idx, turn.bits))
        this.status = Number(Bits.extract(this.packed, status.idx, status.bits))

        const prevLocationId = Bits.extract(this.packed, prevLocation.idx, prevLocation.bits);
        const locationId = Bits.extract(this.packed, location.idx, location.bits);
        const nextLocationId = Bits.extract(this.packed, nextLocation.idx, nextLocation.bits);

        this.prevLocation = configStore.getLocationById(Number(prevLocationId))
        this.location = configStore.getLocationById(Number(locationId))
        this.nextLocation = configStore.getLocationById(Number(nextLocationId))

        makeObservable(this, {
            cash: computed,
            game: observable,
        })

    }

    get cash() {
        if (!this.game?.pending || this.game?.pending?.length === 0) return this._cash
        const overrideCash = this.game.pending
            .map(i => {
                if (isTradeAction(i)) {
                    return i.direction === TradeDirection.Buy ? -i.cost : i.cost
                } else if (isShopAction(i)) {
                    return -i.cost
                } else {
                    return 0
                }
            })
            .reduce((acc, curr) => { return acc + curr }, this._cash)

        return overrideCash
    }

}



