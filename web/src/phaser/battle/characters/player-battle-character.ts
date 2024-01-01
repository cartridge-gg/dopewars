import { BattleCharacterConfig } from "../../types/type";
import { BattleCharacter } from "./battle-character";

const PLAYER_POSITION = Object.freeze({
  x: 256,
  y: 316,
});

export class PlayerBattleCharacter extends BattleCharacter {
  #healthBarTextGameObject!: Phaser.GameObjects.Text;

  constructor(config: BattleCharacterConfig) {
    super(config, PLAYER_POSITION);
    this._phaserGameObject.setFlipX(true);
    this._phaserHealthBarGameContainer.setPosition(0, 0);
    this.#addHealthBarComponents();
  }

  #setHealthBarText() {
    this.#healthBarTextGameObject.setText(
      `${this._currentHealth}/${this._maxHealth}`
    );
  }

  #addHealthBarComponents() {
    this.#healthBarTextGameObject = this._scene.add
      .text(443, 80, "", {
        color: "#7E3D3F",
        fontSize: "16px",
      })
      .setOrigin(1, 0);
    this.#setHealthBarText();

    this._phaserHealthBarGameContainer.add(this.#healthBarTextGameObject);
  }

  takeDamage(damage: number, callback?: () => void):void {
    super.takeDamage(damage, callback);
    this.#setHealthBarText();
  }
}
