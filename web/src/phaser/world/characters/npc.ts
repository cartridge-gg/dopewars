import { CHARACTER_ASSET_KEYS } from "../../assets/asset-keys";
import { Character } from "./character";
import { DIRECTION } from "../../common/direction";
import { exhaustiveGuard } from "../../utils/guard";

export class NPC extends Character {
  private _lastPlayerDirection: DIRECTION = DIRECTION.NONE;

  constructor(config: any) {
    super({
      ...config,
      assetKey: CHARACTER_ASSET_KEYS.NPC,
      origin: { x: -0.1, y: -0.1 },
      idleFrameConfig: {
        DOWN: 80,
        LEFT: 83,
        UP: 81,
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
            `NPC_${this._direction}`
        ) {
          this._phaserGameObject.play(`NPC_${this._direction}`);
        }
        break;
      case DIRECTION.NONE:
        break;
      default:
        // We should never reach this default case
        exhaustiveGuard(this._direction);
    }
  }

  //   playerMoved(playerDirection: DIRECTION): void {
  //     this._lastPlayerDirection = playerDirection;
  //     // Optionally, add logic to decide whether the NPC should move immediately
  //     // in response to the player's movement, or under certain conditions.
  //   }

  //   moveCharacter(): void {
  //     if (this._lastPlayerDirection === DIRECTION.NONE) {
  //       // If the player hasn't moved, the NPC shouldn't move either.
  //       return;
  //     }

  //     super.moveCharacter(this._lastPlayerDirection);

  //     // After moving, reset the last player direction.
  //     this._lastPlayerDirection = DIRECTION.NONE;

  //     // NPC-specific animation or additional logic here.
  //   }
}
