import Phaser from "phaser";
import { SCENE_KEYS } from "./scene-keys";
import { WORLD_ASSET_KEYS } from "../assets/asset-keys";
import { Player } from "../world/characters/player";

import { TILE_SIZE, TILED_COLLISION_LAYER_ALPHA } from "../world/config";
import { Controls } from "../utils/controls";
import { DIRECTION } from "../common/direction";
import { NPC } from "../world/characters/npc";
import { publishPhaserEvent } from "../events/gameEventCenter";

const PLAYER_POSITION = Object.freeze({ x: 0 * TILE_SIZE, y: 0 * TILE_SIZE });
const NPC_POSITION = Object.freeze({ x: 1 * TILE_SIZE, y: 0 * TILE_SIZE });

export class WorldScene extends Phaser.Scene {
  protected player: any;
  protected npc: any;
  controls: any;
  mapScale = 4;

  constructor() {
    super({ key: SCENE_KEYS.WORLD_SCENE });
  }
  create() {
    console.log(`[${WorldScene.name}:create] invoked`);

    const x = 6 * TILE_SIZE;
    const y = 22 * TILE_SIZE;

    this.cameras.main.setBounds(0, 0, 320, 320);
    this.cameras.main.setZoom(this.mapScale);
    this.cameras.main.centerOn(x, y);

    const map = this.make.tilemap({ key: WORLD_ASSET_KEYS.WORLD_MAIN_LEVEL });

    const collisionTiles = map.addTilesetImage(
      "collision",
      WORLD_ASSET_KEYS.WORLD_COLLISION
    );
    if (!collisionTiles) {
      console.log(
        `[${WorldScene.name}:create] error while creating collision tileset`
      );
      return;
    }
    const collisionLayer = map.createLayer("Collision", collisionTiles, 0, 0);
    if (!collisionLayer) {
      console.log(
        `[${WorldScene.name}:create] error while creating collision layer`
      );
      return;
    }

    collisionLayer.setAlpha(TILED_COLLISION_LAYER_ALPHA).setDepth(2);
    //collisionLayer.scale = this.mapScale;

    const mapImage = this.add.image(0, 0, WORLD_ASSET_KEYS.WORLD_BACKGROUND, 0).setOrigin(0);
    // this.add.image(0, 0, WORLD_ASSET_KEYS.WORLD_BACKGROUND).setOrigin(0, 0);
    //mapImage.scale = this.mapScale;

    this.player = new Player({
      scene: this,
      position: PLAYER_POSITION,
      //scale: this.mapScale,
      scale: 0.2,
      direction: DIRECTION.DOWN,
      collisionLayer: collisionLayer,
    });
    //this.player.scale = this.mapScale;

    this.npc = new NPC({
      scene: this,
      position: NPC_POSITION,
      scale: 0.9,
      direction: DIRECTION.DOWN,
      collisionLayer: collisionLayer,
    });

    this.cameras.main.startFollow(this.player.sprite);

    const foreground= this.add.image(0, 0, WORLD_ASSET_KEYS.WORLD_FOREGROUND, 0).setOrigin(0);
    //foreground.scale = this.mapScale;

    this.controls = new Controls(this);

    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  update(time: any) {
    const selectedDirection = this.controls.getDirectionKeyJustPressed();
    const npcMove = DIRECTION.RIGHT; //GET FROM CONTRACT.

    if (selectedDirection !== DIRECTION.NONE) {
      publishPhaserEvent("move", selectedDirection);
      this.player.moveCharacter(selectedDirection);
      //MOVE NPC
      this.npc.moveCharacter(npcMove);
    }
    this.player.update(time);
    this.npc.update(time);

    if (
      this.player.getPosition().x === this.npc.getPosition().x &&
      this.player.getPosition().y === this.npc.getPosition().y
    ) {
      console.log("Player and NPC are on the same tile!");
      return;
      //START GAME
    }
    
  }
}
