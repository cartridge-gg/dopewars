import { ASSET_KEYS } from "@/phaser/assets/asset-keys";
import {
  Attack,
  BattleCharacterConfig,
  Character,
  Coordinate,
} from "../../types/type";
import { HealthBar } from "../ui/health-bar";

export class BattleCharacter {
  protected _scene!: Phaser.Scene;
  protected _characterDetails!: Character;
  protected _healthBar!: HealthBar;
  protected _phaserGameObject: Phaser.GameObjects.Image;
  protected _currentHealth!: number;
  protected _maxHealth!: number;
  protected _characterAttacks!: Attack[];
  protected _phaserHealthBarGameContainer!: Phaser.GameObjects.Container;

  constructor(config: BattleCharacterConfig, position: Coordinate) {
    this._scene = config.scene;
    this._characterDetails = config.characterDetails;
    this._currentHealth = this._characterDetails.currentHp;
    this._maxHealth = this._characterDetails.maxHp;
    this._characterAttacks = [];

    this._phaserGameObject = this._scene.add.image(
      position.x,
      position.y,
      this._characterDetails.assetKey,
      this._characterDetails.assetFrame || 0
    );
    this.#createHealthBarComponents(config.scaleHealthBarBackgroundImageByY);

    //load json file
    const data = this._scene.cache.json.get(ASSET_KEYS.ATTACKS);
    this._characterDetails.attackIds.forEach((attackId) => {
      const characterAttack = data.find(
        (attack: Attack) => attack.id === attackId
      );
      if (characterAttack !== undefined) {
        this._characterAttacks.push(characterAttack);
      }
    });
  }

  get isFainted(): boolean {
    return this._currentHealth <= 0;
  }

  get name(): string {
    return this._characterDetails.name;
  }

  get attacks(): Attack[] {
    return [...this._characterAttacks];
  }

  get baseAttack(): number {
    return this._characterDetails.baseAttack;
  }

  get level(): number {
    return this._characterDetails.currentLevel;
  }

  takeDamage(damage: number, callback?: () => void): void {
    // Update current monster health and animate health bar
    this._currentHealth -= damage;
    if (this._currentHealth < 0) {
      this._currentHealth = 0;
    }
    this._healthBar.setMeterPercentageAnimated(
      this._currentHealth / this._maxHealth,
      { callback }
    );
  }

  #createHealthBarComponents(scaleHealthBarBackgroundImageByY = 1) {
    this._healthBar = new HealthBar(this._scene, 34, 34);

    const characterNameGameText = this._scene.add.text(30, 20, this.name, {
      color: "#FCE700",
      fontSize: "32px",
    });

    const healthBarBgImage = this._scene.add
      .image(0, 0, ASSET_KEYS.HEALTH_BAR_BACKGROUND)
      .setOrigin(0)
      .setScale(1, scaleHealthBarBackgroundImageByY);

    const monsterHealthBarLevelText = this._scene.add.text(
      characterNameGameText.width + 35,
      23,
      ``,
      {
        color: "#ED474B",
        fontSize: "28px",
      }
    );

    const monsterHpText = this._scene.add.text(30, 55, "HP", {
      color: "#FF6505",
      fontSize: "24px",
      fontStyle: "italic",
    });

    this._phaserHealthBarGameContainer = this._scene.add.container(555, 0, [
      healthBarBgImage,
      characterNameGameText,
      this._healthBar.container,
      monsterHealthBarLevelText,
      monsterHpText,
    ]);
  }
}
