import Phaser from "phaser";
import { SCENE_KEYS } from "./scene-keys";
import {
  CHARACTER_ASSET_KEYS,
  WORLD_ASSET_KEYS,
  DATA_ASSET_KEYS,
} from "../assets/asset-keys";
import { DataUtils } from "../utils/data-utils";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
    });
  }

  preload() {
    console.log(`[${PreloadScene.name}:preload] invoked`);

    //load world assets
    this.load.image(
      WORLD_ASSET_KEYS.WORLD_BACKGROUND,
      "/phaser/gameMap/images/doperganger_background.png"
    );
    this.load.tilemapTiledJSON(
      WORLD_ASSET_KEYS.WORLD_MAIN_LEVEL,
      `/phaser/gameMap/data/fullmap.json`
    );

    this.load.image(
      WORLD_ASSET_KEYS.WORLD_COLLISION,
      "/phaser/gameMap/images/collision.png"
    );
    this.load.image(
      WORLD_ASSET_KEYS.WORLD_FOREGROUND,
      "/phaser/gameMap/images/foreground.png"
    );

    //load json data
    this.load.json(DATA_ASSET_KEYS.ANIMATIONS, "/phaser/gameMap/data/animation.json");

    // load character images
    //Player
    this.load.spritesheet(
      CHARACTER_ASSET_KEYS.PLAYER,
      `/phaser/gameMap/images/custom.png`,
      {
        frameWidth: 64,
        frameHeight: 88,
      }
    );
    //NPC
    // this.load.spritesheet(CHARACTER_ASSET_KEYS.NPC, ``, {
    //   frameWidth: 16,
    //   frameHeight: 16,
    // });
  }

  create() {
    console.log(`[${PreloadScene.name}:create] invoked`);
    this.createAnimations();
    this.scene.start(SCENE_KEYS.WORLD_SCENE);
  }

  private createAnimations() {
    const animations = DataUtils.getAnimations(this);

    animations.forEach((animation: any) => {
      const frames = animation.frames
        ? this.anims.generateFrameNumbers(animation.assetKey, {
            frames: animation.frames,
          })
        : this.anims.generateFrameNumbers(animation.assetKey, {}); // Provide an empty object as the second argument
      this.anims.create({
        key: animation.key,
        frames: frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
        delay: animation.delay,
        yoyo: animation.yoyo,
      });
    });
  }
}
