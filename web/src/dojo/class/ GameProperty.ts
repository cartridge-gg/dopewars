import { ConfigStoreClass } from "../stores/config";
import { GameClass } from "./Game";

export abstract class GamePropertyClass {
  game: GameClass;

  packed: bigint;

  constructor(game: GameClass, packed: bigint) {
    this.game = game;
    this.packed = packed;
  }
}
