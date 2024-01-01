import Phaser from "phaser";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { Background } from "../battle/background";
import { EnemyBattleCharacter } from "../battle/characters/enemy-battle-character";
import { PlayerBattleCharacter } from "../battle/characters/player-battle-character";
import { SCENE_KEYS } from "./scene-keys";
import { ASSET_KEYS, DIRECTION, direction } from "../assets/asset-keys";
import { CurrentState } from "../types/type";

export class BattleScene extends Phaser.Scene {
  #battleMenu!: BattleMenu;
  #cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  #activePlayerCharacter!: PlayerBattleCharacter; // define player
  #activeEnemyCharacter!: EnemyBattleCharacter; // define enemy
  #activePlayerAttackIndex!: number;

  constructor() {
    super(SCENE_KEYS.BATTLE_SCENE);
  }

  init() {
    this.#activePlayerAttackIndex = -1;
  }

  create() {
    this.scene.remove(SCENE_KEYS.WORLD_SCENE);
    // Create background
    const background = new Background(this);
    background.showCity();

    // Create player
    // this.add.image(256, 316, ASSET_KEYS.MAFIA, 0);
    this.#activePlayerCharacter = new PlayerBattleCharacter({
      scene: this,
      characterDetails: {
        name: ASSET_KEYS.MAFIA,
        assetKey: ASSET_KEYS.MAFIA,
        assetFrame: 0,
        currentHp: 25,
        maxHp: 25,
        attackIds: [1], // Choose attack
        baseAttack: 20,
        currentLevel: 6,
      },
      scaleHealthBarBackgroundImageByY: 1, // Default value
    });

    // Create enemy
    // this.add.image(768, 316, ASSET_KEYS.POLICE, 0);
    this.#activeEnemyCharacter = new EnemyBattleCharacter({
      scene: this,
      characterDetails: {
        name: ASSET_KEYS.POLICE,
        assetKey: ASSET_KEYS.POLICE,
        assetFrame: 0,
        currentHp: 25,
        maxHp: 25,
        attackIds: [4], // Choose attack
        baseAttack: 5,
        currentLevel: 6,
      },
      scaleHealthBarBackgroundImageByY: 1, // Default value
    });

    // Render main info pane and sub info pane
    this.#battleMenu = new BattleMenu(this); //?
    this.#battleMenu.showMainBattleMenu();

    // Cursor key control
    this.#cursorKeys = this.input.keyboard!.createCursorKeys();

    this.scale.setGameSize(1024, 576);
  }

  update() {
    console.log(this.#battleMenu.selectedAttack);

    const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(this.#cursorKeys.space);

    if (wasSpaceKeyPressed) {
      this.#battleMenu.handlePlayerInput("OK");
      this.#activePlayerAttackIndex = this.#battleMenu.selectedAttack;

      if (this.#battleMenu.currentState === CurrentState.MENU) {
        if (this.#activePlayerAttackIndex === 0) {
          this.#battleMenu.currentState = CurrentState.ATTACK;
          this.handleBattleSequence();
        }
        if (this.#activePlayerAttackIndex === 1) {
          this.#battleMenu.currentState = CurrentState.PAY;
          this.#battleMenu.updateInfoPaneMessagesAndWaitForInput([`You Paid ! `], () => {
            this.#handlePay();
          });
        }
        if (this.#activePlayerAttackIndex === 2) {
          this.#battleMenu.currentState = CurrentState.RUN;
          this.#battleMenu.updateInfoPaneMessagesAndWaitForInput([`You Run ! `], () => {
            this.#handleRun();
          });
        }
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift)) {
      this.#battleMenu.handlePlayerInput("CANCEL");
      return;
    }

    let selectedDirection: direction = DIRECTION.NONE;
    if (this.#cursorKeys.left.isDown) {
      selectedDirection = DIRECTION.LEFT;
    } else if (this.#cursorKeys.right.isDown) {
      selectedDirection = DIRECTION.RIGHT;
    } else if (this.#cursorKeys.up.isDown) {
      selectedDirection = DIRECTION.UP;
    } else if (this.#cursorKeys.down.isDown) {
      selectedDirection = DIRECTION.DOWN;
    }

    if (selectedDirection !== DIRECTION.NONE) {
      this.#battleMenu.handlePlayerInput(selectedDirection);
    }
  }

  handleBattleSequence() {
    // general battle flow
    // show attack used, brief pause
    // then play attack animation, brief pause
    // then play damage animation, brief pause
    // then play health bar animation, brief pause
    // then repeat the steps above for the other character

    this.#playerAttack();
  }

  #playerAttack() {
    this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
      [`${this.#activePlayerCharacter.name} attempt to ${this.#activePlayerCharacter.attacks[0].name}`],
      () => {
        this.time.delayedCall(500, () => {
          // Characters attacking alternately
          this.#activeEnemyCharacter.takeDamage(this.#activePlayerCharacter.baseAttack, () => {
            this.#enemyAttack();
          });
        });
      },
    );
  }

  #enemyAttack() {
    if (this.#activeEnemyCharacter.isFainted) {
      this.#posBattleSequenceCheck();
      return;
    }
    this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
      [` ${this.#activeEnemyCharacter.attacks[0].name} attack you back`],
      () => {
        this.time.delayedCall(500, () => {
          // Characters attacking alternately
          this.#activePlayerCharacter.takeDamage(this.#activeEnemyCharacter.baseAttack, () => {
            this.#posBattleSequenceCheck();
          });
        });
      },
    );
  }

  #posBattleSequenceCheck() {
    if (this.#activePlayerCharacter.isFainted) {
      this.#battleMenu.updateInfoPaneMessagesAndWaitForInput([`You died! `], () => {
        this.#transitionToNextScene();
      });
      return;
    }

    if (this.#activeEnemyCharacter.isFainted) {
      this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
        [`You beat the ${this.#activeEnemyCharacter.name} `],
        () => {
          this.#transitionToNextScene();
        },
      );
      return;
    }

    this.#battleMenu.showMainBattleMenu();
  }

  #transitionToNextScene() {
    this.cameras.main.fadeOut(2600, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENE_KEYS.BATTLE_SCENE);
    });
  }

  #handlePay() {
    this.cameras.main.fadeOut(2600, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENE_KEYS.BATTLE_SCENE);
    });
  }
  #handleRun() {
    this.cameras.main.fadeOut(2600, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENE_KEYS.BATTLE_SCENE);
    });
  }
}
