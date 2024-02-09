import { ConfigStore } from "../stores/config";
import { GamePropertyClass } from "./ GameProperty";
import { GameClass } from "./Game";
import Bits from "./utils/Bits";


enum EncounterSlot {
    Cops,
    Gangs
}

export class EncountersClass extends GamePropertyClass {
    bitsSize = 3n;
    //
    copsLevel: number;
    gangLevel: number;

    constructor(configStore: ConfigStore, game: GameClass, packed: bigint) {
        super(configStore, game, packed);

        this.copsLevel = Number(Bits.extract(this.packed, BigInt(EncounterSlot.Cops) * this.bitsSize, this.bitsSize));
        this.gangLevel = Number(Bits.extract(this.packed, BigInt(EncounterSlot.Gangs) * this.bitsSize, this.bitsSize));

    }


}