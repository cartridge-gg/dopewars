import { ConfigStore } from "../stores/config";
import { GamePropertyClass } from "./ GameProperty";
import { GameClass, WantedByLocation } from "./Game";
import Bits from "./utils/Bits";

export class WantedClass extends GamePropertyClass {
    bitsSize = 3n;
    //
    wantedByLocation: WantedByLocation = new Map()

    constructor(configStore: ConfigStore, game: GameClass, packed: bigint) {
        super(configStore, game, packed);

        for (let locationId of [1, 2, 3, 4, 5, 6]) {
            const location = configStore.getLocationById(locationId)!;

            const wantedTick = this.getWantedTick(locationId)
            const wantedValue = this.getValueByTick(wantedTick)

            this.wantedByLocation.set(location.location, wantedValue);
        }
    }

    getWantedTick(locationId: number) {
        const index = (BigInt(locationId) - 1n) * this.bitsSize
        const wantedTick = Number(Bits.extract(this.packed, index, this.bitsSize));
        return wantedTick
    }

    getValueByTick(tick: number) {
        const totalValues = 2 ** Number(this.bitsSize)
        const step = 100 / (totalValues - 1)
        return Math.floor(tick * step)
    }
}