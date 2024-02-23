import { computed, makeObservable, observable } from "mobx";
import { ConfigStore, LocationConfigFull } from "../stores/config";
import { Drugs, TradeDirection } from "../types";
import { GamePropertyClass } from "./ GameProperty";
import { GameClass, isShopAction, isTradeAction } from "./Game";
import Bits from "./utils/Bits";

export class PlayerClass extends GamePropertyClass {
    private _cash: number;
    health: number;
    turn: number;
    status: number;
    prevLocation: LocationConfigFull;
    location: LocationConfigFull;
    nextLocation: LocationConfigFull;
    drugLevel: number;

    constructor(configStore: ConfigStore, game: GameClass, packed: bigint) {
        super(configStore, game, packed);

        const cash = configStore.getPlayerLayoutItem("Cash")
        const health = configStore.getPlayerLayoutItem("Health")
        const turn = configStore.getPlayerLayoutItem("Turn")
        const status = configStore.getPlayerLayoutItem("Status")
        const prevLocation = configStore.getPlayerLayoutItem("PrevLocation")
        const location = configStore.getPlayerLayoutItem("Location")
        const nextLocation = configStore.getPlayerLayoutItem("NextLocation")
        const drugLevel = configStore.getPlayerLayoutItem("DrugLevel")

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

        this.drugLevel = Number(Bits.extract(this.packed, drugLevel.idx, drugLevel.bits))

        makeObservable(this, {
            cash: computed,
            game: observable,
            location: observable,
            wanted: computed,
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

    //
    //
    //

    get wanted() {
        // at home
        if (!this.location) return 0;

        // TODO: use type
        if (this.status === 0) {
            return this.game.wanted.getWantedTick(this.location.location_id)
        } else {
            // when mugged / arrested display next_location
            return this.game.wanted.getWantedTick(this.nextLocation.location_id)
        }

    }

    canBuy(drug: Drugs) {
        return true
    }

    canSell(drug: Drugs) {
        return true
    }

}