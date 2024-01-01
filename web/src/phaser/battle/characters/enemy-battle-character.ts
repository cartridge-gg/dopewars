import { BattleCharacterConfig } from "../../types/type";
import { BattleCharacter } from "./battle-character";


const ENEMY_POSITION = Object.freeze({
    x: 738,
    y: 316,
  });
  
  export class EnemyBattleCharacter extends BattleCharacter {
    constructor(config:BattleCharacterConfig) {
      super({ ...config, scaleHealthBarBackgroundImageByY: 0.8 }, ENEMY_POSITION);
    }
  }