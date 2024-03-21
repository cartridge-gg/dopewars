import { ConfigStoreClass } from "../stores/config";
import { GameClass } from "./Game";

export abstract class GamePropertyClass {
    game: GameClass;
    configStore: ConfigStoreClass;
    packed: bigint;

    constructor(configStore: ConfigStoreClass, game: GameClass, packed: bigint) {
        this.configStore = configStore
        this.game = game
        this.packed = packed
    }

}