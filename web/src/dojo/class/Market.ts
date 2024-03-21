import { ConfigStoreClass } from "../stores/config";
import { GamePropertyClass } from "./ GameProperty";
import { DrugMarket, GameClass, MarketsByLocation } from "./Game";
import Bits from "./utils/Bits";

export class MarketsClass extends GamePropertyClass {
    drugCountByLocation = 4n;
    bitsSize = 6n;
    //
    marketsByLocation: MarketsByLocation = new Map()

    constructor(configStore: ConfigStoreClass, game: GameClass, packed: bigint) {
        super(configStore, game, packed);

        const drugLevel = game.player?.drugLevel || 0

        for (let locationId of [1, 2, 3, 4, 5, 6]) {
            const location = configStore.getLocationById(locationId)!;

            for (let drugId of [0, 1, 2, 3, /*4, 5*/]) {
                const drugIdWithDrugLevel = drugId + drugLevel

                const drug = configStore.getDrugById(drugIdWithDrugLevel)!;
                const price = this.getDrugPrice(locationId, drugIdWithDrugLevel);

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

    getTick(locationId: number, drugId: number) {
        const start = BigInt((BigInt(locationId - 1) * this.drugCountByLocation + (BigInt(drugId) % this.drugCountByLocation)) * this.bitsSize);
        return Bits.extract(this.packed, start, this.bitsSize)
    }

    getDrugPriceByTick(drugId: number, tick: bigint) {
        const drugConfig = this.configStore.getDrugById(drugId)!;
        return Number(tick) * Number(drugConfig.step) + Number(drugConfig.base);
    }

    getDrugPrice(locationId: number, drugId: number): number {
        const tick = this.getTick(locationId, drugId);
        return this.getDrugPriceByTick(drugId, tick);
    }

}
