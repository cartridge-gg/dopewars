import { DIRECTION } from "../common/direction";
import Phaser from "phaser";

export class Controls {
  private scene: Phaser.Scene;
  private cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
  private lockPlayerInput: boolean;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
    this.lockPlayerInput = false;
  }

  get isInputLocked(): boolean {
    return this.lockPlayerInput;
  }

  set lockInput(value: boolean) {
    this.lockPlayerInput = value;
  }

  wasSpaceKeyPressed(): boolean {
    return (
      (this.cursorKeys?.space !== undefined &&
        Phaser.Input.Keyboard.JustDown(this.cursorKeys.space)) ||
      false
    ); // Ensures the return type is boolean by returning false if undefined
  }

  wasBackKeyPressed(): boolean {
    return (
      (this.cursorKeys?.shift &&
        Phaser.Input.Keyboard.JustDown(this.cursorKeys.shift)) ||
      false
    );
  }

  getDirectionKeyJustPressed(): DIRECTION {
    if (!this.cursorKeys) {
      return DIRECTION.NONE;
    }
    let selectedDirection = DIRECTION.NONE;
    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)) {
      return DIRECTION.LEFT;
    } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)) {
      return DIRECTION.RIGHT;
    } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)) {
      return DIRECTION.UP;
    } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)) {
      return DIRECTION.DOWN;
    }

    return DIRECTION.NONE;
  }

  getDirectionKeyPressedDown(): DIRECTION {
    if (!this.cursorKeys) {
      return DIRECTION.NONE;
    }

    if (this.cursorKeys.left.isDown) {
      return DIRECTION.LEFT;
    } else if (this.cursorKeys.right.isDown) {
      return DIRECTION.RIGHT;
    } else if (this.cursorKeys.up.isDown) {
      return DIRECTION.UP;
    } else if (this.cursorKeys.down.isDown) {
      return DIRECTION.DOWN;
    }

    return DIRECTION.NONE;
  }
}
