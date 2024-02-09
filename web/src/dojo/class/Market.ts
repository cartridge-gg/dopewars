import { ConfigStore } from "../stores/config";
import { GamePropertyClass } from "./ GameProperty";
import { DrugMarket, GameClass, MarketsByLocation } from "./Game";
import Bits from "./utils/Bits";

export class MarketsClass extends GamePropertyClass {
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
