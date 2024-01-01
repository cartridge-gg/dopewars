import {
  ASSET_KEYS,
  BATTLE_MENU_OPTIONS,
  BATTLE_UI_TEXT_STYLE,
  DIRECTION,
  battleMenuOptions,
  direction,
} from "@/phaser/assets/asset-keys";
import { CurrentState } from "@/phaser/types/type";
import Phaser from "phaser";

export class BattleMenu {
  #scene!: Phaser.Scene;
  #mainBattleMenuPhaserContainerGameObject!: Phaser.GameObjects.Container;
  #battleTextGameObjectLine1!: Phaser.GameObjects.Text;
  #battleTextGameObjectLine2!: Phaser.GameObjects.Text;
  #mainBattleMenuCursorPhaserImageGameObject!: Phaser.GameObjects.Image;
  #selectedBattleMenuOption!: battleMenuOptions;
  #selectedAttackIndex!: number; // attack index

  // Attack state
  public currentState!: CurrentState;
  
  // Callback declare
  #queuedInfoPanelMessages!: string[];
  #queuedInfoPanelCallback?: () => void | undefined;
  #waitingForPlayerInput!: boolean;

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    this.#queuedInfoPanelMessages = [];
    this.#queuedInfoPanelCallback = undefined;
    this.#waitingForPlayerInput = false;
    this.#createMainInfoPane();
    this.#createMainBattlemenu();
    this.currentState = CurrentState.MENU; // reset attack state
  }

  get selectedAttack(): number {
    return this.#selectedAttackIndex;
  }

  showMainBattleMenu() {
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(1);
    this.#battleTextGameObjectLine1.setText("You encountered the...");
    this.#battleTextGameObjectLine1.setAlpha(1);
    this.#battleTextGameObjectLine2.setAlpha(1);

    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(ASSET_KEYS.CURSOR_X, ASSET_KEYS.CURSOR_Y);

    this.currentState = CurrentState.MENU; // Attack state
    this.#selectedAttackIndex = -1; // Reset attack index
  }

  hideMainBattleMenu() {
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(0);
    this.#battleTextGameObjectLine1.setAlpha(0);
    this.#battleTextGameObjectLine2.setAlpha(0);
  }

  ///
  handlePlayerInput(input: direction | "OK" | "CANCEL") {
    console.log(input);

    // Callback 1
    if (this.#waitingForPlayerInput && (input === "CANCEL" || input === "OK")) {
      this.#updateInfoPaneWithMessage();
      return;
    }

    // Cursor handling
    this.#updateSelectedBattleMenuOptionFromInput(input);
    this.#moveMainBattleMenuCursor();

    // Battle option selection
    if (input === "OK") {
      this.#handlePlayerChooseMainBattleOptionWithIndex();
    }
  }

  // Callback 2
  updateInfoPaneMessagesAndWaitForInput(messages: string[], callback: () => void) {
    this.#queuedInfoPanelMessages = messages;
    this.#queuedInfoPanelCallback = callback;

    this.#updateInfoPaneWithMessage();
  }

  // Callback 3
  #updateInfoPaneWithMessage() {
    this.#waitingForPlayerInput = false;
    this.#battleTextGameObjectLine1.setText("").setAlpha(1);

    // Check if all messages have been displayed from the queue and call the callback
    if (this.#queuedInfoPanelMessages.length === 0) {
      if (this.#queuedInfoPanelCallback) {
        this.#queuedInfoPanelCallback();
        this.#queuedInfoPanelCallback = undefined;
      }
      return;
    }

    // Get first message from queue and animate message
    const messageToDisplay = this.#queuedInfoPanelMessages.shift();
    if (messageToDisplay !== undefined) {
      this.#battleTextGameObjectLine1.setText(messageToDisplay);
      this.#waitingForPlayerInput = true;
    }
  }
  ///

  #createMainInfoPane() {
    const padding = 4;
    const rectHeight = 124;
    const borderRadius = 20; // Set the border radius

    // Create a graphics object
    const graphics = this.#scene.add.graphics();

    // Set line style for the border
    graphics.lineStyle(8, 0xaad7d9, 1);

    // Set fill style for the rectangle
    graphics.fillStyle(0x38419D, 1);

    // Draw a rounded rectangle
    graphics.fillRoundedRect(
      padding,
      this.#scene.scale.height - rectHeight - padding,
      this.#scene.scale.width - padding * 2,
      rectHeight,
      borderRadius,
    );

    graphics.strokeRoundedRect(
      padding,
      this.#scene.scale.height - rectHeight - padding,
      this.#scene.scale.width - padding * 2,
      rectHeight,
      borderRadius,
    );
  }

  #createMainBattlemenu() {
    // Text line
    this.#battleTextGameObjectLine1 = this.#scene.add.text(30, 468, "You encountered the...", BATTLE_UI_TEXT_STYLE);
    this.#battleTextGameObjectLine2 = this.#scene.add.text(160, 512, `COPS!!!`, BATTLE_UI_TEXT_STYLE);

    // Cursor
    this.#mainBattleMenuCursorPhaserImageGameObject = this.#scene.add
      .image(ASSET_KEYS.CURSOR_X, ASSET_KEYS.CURSOR_Y, ASSET_KEYS.CURSOR, 0)
      .setOrigin(0.5)
      .setScale(2.5);

    this.#mainBattleMenuPhaserContainerGameObject = this.#scene.add.container(530, 448, [
      this.#createMainInfoSubPane(),
      this.#scene.add.text(75, 22, BATTLE_MENU_OPTIONS.FIGHT, BATTLE_UI_TEXT_STYLE),
      this.#scene.add.text(260, 22, BATTLE_MENU_OPTIONS.PAY, BATTLE_UI_TEXT_STYLE),
      this.#scene.add.text(75, 70, BATTLE_MENU_OPTIONS.RUN, BATTLE_UI_TEXT_STYLE),
      this.#mainBattleMenuCursorPhaserImageGameObject,
    ]);

    this.hideMainBattleMenu();
  }

  #createMainInfoSubPane() {
    const rectWidth = 490;
    const rectHeight = 124;
    const borderRadius = 20; // Set the border radius

    // Create a graphics object
    const graphics = this.#scene.add.graphics();

    // Set line style for the border
    graphics.lineStyle(8, 0x905ac2, 1);

    // Set fill style for the rectangle
    graphics.fillStyle(0xFFE4A7, 1);

    // Draw a rounded rectangle
    graphics.fillRoundedRect(0, 0, rectWidth, rectHeight, borderRadius);
    graphics.strokeRoundedRect(0, 0, rectWidth, rectHeight, borderRadius);

    return graphics;
  }

  #updateSelectedBattleMenuOptionFromInput(direction: direction | "OK" | "CANCEL") {
    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.PAY;
          return;
        case DIRECTION.DOWN:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.RUN;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          return;
      }
    }
    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.PAY) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
          return;
        case DIRECTION.DOWN:
        case DIRECTION.RIGHT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          return;
      }
    }
    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.RUN) {
      switch (direction) {
        case DIRECTION.RIGHT:
          return;
        case DIRECTION.UP:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          return;
      }
    }
    // if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FLEE) {
    //   switch (direction) {
    //     case DIRECTION.LEFT:
    //       this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
    //       return;
    //     case DIRECTION.UP:
    //       this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
    //       return;
    //     case DIRECTION.RIGHT:
    //     case DIRECTION.DOWN:
    //     case DIRECTION.NONE:
    //       return;
    //     default:
    //       return
    //   }
    //   return;
    // }
  }

  #moveMainBattleMenuCursor() {
    switch (this.#selectedBattleMenuOption) {
      case BATTLE_MENU_OPTIONS.FIGHT:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(ASSET_KEYS.CURSOR_X, ASSET_KEYS.CURSOR_Y);
        return;
      case BATTLE_MENU_OPTIONS.PAY:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(228, ASSET_KEYS.CURSOR_Y);
        return;
      case BATTLE_MENU_OPTIONS.RUN:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(ASSET_KEYS.CURSOR_X, 86);
        return;
      // case BATTLE_MENU_OPTIONS.FLEE:
      //   this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(228, 86);
      //   return;
      default:
        return;
    }
  }

  // #handlePlayerChooseMainBattleOption() {
  //   this.hideMainBattleMenu();

  //   if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
  //     this.updateInfoPaneMessagesAndWaitForInput(
  //       ["You choose to FIGHT"],
  //       () => {
  //         this.showMainBattleMenu();
  //       }
  //     );
  //     return;
  //   }

  //   if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.PAY) {
  //     // this.#activeBattleMenu = ACTIVE_BATTLE_MENU.PAY;
  //     this.updateInfoPaneMessagesAndWaitForInput(["You choose to PAY"], () => {
  //       this.showMainBattleMenu();
  //     });
  //     return;
  //   }

  //   if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.RUN) {
  //     // this.#activeBattleMenu = ACTIVE_BATTLE_MENU.RUN;
  //     this.updateInfoPaneMessagesAndWaitForInput(["You Choose to RUN"], () => {
  //       this.showMainBattleMenu();
  //     });
  //     return;
  //   }
  // }

  #handlePlayerChooseMainBattleOptionWithIndex() {
    let selectedMoveIndex = 0;
    this.hideMainBattleMenu();
    switch (this.#selectedBattleMenuOption) {
      case BATTLE_MENU_OPTIONS.FIGHT:
        selectedMoveIndex = 0;
        console.log("index", selectedMoveIndex);
        break;
      case BATTLE_MENU_OPTIONS.PAY:
        selectedMoveIndex = 1;
        console.log("index", selectedMoveIndex);
        break;
      case BATTLE_MENU_OPTIONS.RUN:
        selectedMoveIndex = 2;
        console.log("index", selectedMoveIndex);
        break;
      default:
    }

    this.#selectedAttackIndex = selectedMoveIndex;
  }
}
