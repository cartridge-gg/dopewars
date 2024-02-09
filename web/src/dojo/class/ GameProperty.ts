import { ConfigStore } from "../stores/config";
import { GameClass } from "./Game";

export abstract class GamePropertyClass {
    game: GameClass;
    configStore: ConfigStore;
    packed: bigint;

    constructor(configStore: ConfigStore, game: GameClass, packed: bigint) {
        this.configStore = configStore
        this.game = game
        this.packed = packed
    }

}