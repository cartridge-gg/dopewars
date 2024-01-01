import { CHARACTER_ASSET_KEYS } from "../../assets/asset-keys";
import { Character } from "./character";
import { DIRECTION } from "../../common/direction";
import { exhaustiveGuard } from "../../utils/guard";

export class Player extends Character {
  constructor(config: any) {
    super({
      ...config,
      assetKey: CHARACTER_ASSET_KEYS.PLAYER,
      origin: { x: -0.2, y: 0.022 },
      idleFrameConfig: {
        DOWN: 7,
        LEFT: 10,
        UP: 1,
        RIGHT: 4,
        NONE: 7,
      },
    });
  }

  moveCharacter(direction: any) {
    super.moveCharacter(direction);

    switch (this._direction) {
      case DIRECTION.DOWN:
      case DIRECTION.LEFT:
      case DIRECTION.RIGHT:
      case DIRECTION.UP:
        if (
          !this._phaserGameObject.anims.isPlaying ||
          this._phaserGameObject.anims.currentAnim?.key !==
            `PLAYER_${this._direction}`
        ) {
          this._phaserGameObject.play(`PLAYER_${this._direction}`);
        }
        break;
      case DIRECTION.NONE:
        break;
      default:
        // We should never reach this default case
        exhaustiveGuard(this._direction);
    }
  }
}
