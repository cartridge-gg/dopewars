import Phaser from "phaser";
import { SCENE_KEYS } from "./scene-keys";
import { WORLD_ASSET_KEYS } from "../assets/asset-keys";
import { Player } from "../world/characters/player";

import { TILE_SIZE, TILED_COLLISION_LAYER_ALPHA } from "../world/config";
import { Controls } from "../utils/controls";
import { DIRECTION } from "../common/direction";
import { NPC } from "../world/characters/npc";
import { useSystems } from "@/dojo/hooks/useSystems";
import { useCallback } from "react";
import { publishPhaserEvent } from "../events/gameEventCenter";
import catcherQtable from "../assets/catcherQtable.json";

const PLAYER_POSITION = Object.freeze({ x: 0 * TILE_SIZE, y: 0 * TILE_SIZE });
const NPC_POSITION = Object.freeze({ x: 11 * TILE_SIZE, y: 1 * TILE_SIZE });
const NPC_POSITION2 = Object.freeze({ x: 5 * TILE_SIZE, y: 9 * TILE_SIZE });

export class WorldScene extends Phaser.Scene {
  protected player: any;
  protected npc: NPC;
  protected npc2: NPC;
  protected npc3: NPC;
  controls: any;
  mapScale = 3.2;

  constructor() {
    super({ key: SCENE_KEYS.WORLD_SCENE });
  }
  create() {
    console.log(`[${WorldScene.name}:create] invoked`);
    //console.log(23%20, Math.floor(23/20));
    const x = 6 * TILE_SIZE;
    const y = 22 * TILE_SIZE;

    this.cameras.main.setBounds(0, 0, 320, 320);
    this.cameras.main.setZoom(this.mapScale);
    this.cameras.main.centerOn(x, y);

    const map = this.make.tilemap({ key: WORLD_ASSET_KEYS.WORLD_MAIN_LEVEL });

    const collisionTiles = map.addTilesetImage("collision", WORLD_ASSET_KEYS.WORLD_COLLISION);
    if (!collisionTiles) {
      console.log(`[${WorldScene.name}:create] error while creating collision tileset`);
      return;
    }
    const collisionLayer = map.createLayer("Collision", collisionTiles, 0, 0);
    if (!collisionLayer) {
      console.log(`[${WorldScene.name}:create] error while creating collision layer`);
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

    this.npc2 = new NPC({
      scene: this,
      position: NPC_POSITION2,
      scale: 0.9,
      direction: DIRECTION.DOWN,
      collisionLayer: collisionLayer,
    });

    this.npc3 = new NPC({
      scene: this,
      position: { x: 17 * TILE_SIZE, y: 8 * TILE_SIZE},
      scale: 0.9,
      direction: DIRECTION.DOWN,
      collisionLayer: collisionLayer,
    });

    this.cameras.main.startFollow(this.player.sprite);

    const foreground = this.add.image(0, 0, WORLD_ASSET_KEYS.WORLD_FOREGROUND, 0).setOrigin(0);
    //foreground.scale = this.mapScale;

    this.controls = new Controls(this);

    this.cameras.main.fadeIn(1000, 0, 0, 0);

    //console.log(catcherQtable);
  }

  convertAIInputToDirection(npc: NPC) {
    const ai_vision_input = `(${this.player.getIndex()}, ${this.npc.getIndex()}, ${219})`
    const moveNumber = catcherQtable[ai_vision_input] ? 
      catcherQtable[ai_vision_input].indexOf(Math.max.apply(Math, catcherQtable[ai_vision_input]))
      : Math.floor(Math.random()*4);

    switch(moveNumber) {
      case 0:
        return DIRECTION.LEFT;
      case 1:
        return DIRECTION.RIGHT;
      case 2:
        return DIRECTION.UP;
      case 3:
        return DIRECTION.DOWN;
      default:
        return DIRECTION.NONE;
    }

  }

  update(time: any) {
    const selectedDirection = this.controls.getDirectionKeyJustPressed();
    const npcMove = DIRECTION.RIGHT; //GET FROM CONTRACT.

    if (selectedDirection !== DIRECTION.NONE) {
      publishPhaserEvent("move", selectedDirection);
      this.player.moveCharacter(selectedDirection);
      // console.log(this.player.getIndex()); // player coords
      // console.log(this.npc.getIndex()); // npc coords
      // console.log(199) // door coords
      //const ai_vision_input = `(${this.player.getIndex()}, ${this.npc.getIndex()}, ${219})`
      // console.log(ai_vision_input)
      // console.log(catcherQtable[ai_vision_input])
      // console.log(Math.max.apply(Math, catcherQtable[ai_vision_input]))
      //console.log(catcherQtable[ai_vision_input].indexOf(Math.max.apply(Math, catcherQtable[ai_vision_input])))
      // 0=LEFT, 1=RIGHT, 2=UP, 3=DOWN

      //console.log(this.convertAIInputToDirection(ai_vision_input))
      //MOVE NPC
      this.npc.moveCharacter(this.convertAIInputToDirection(this.npc));
      this.npc2.moveCharacter(this.convertAIInputToDirection(this.npc2));
      this.npc3.moveCharacter(this.convertAIInputToDirection(this.npc3));
    }
    this.player.update(time);
    this.npc.update(time);
    this.npc2.update(time);
    this.npc3.update(time);

    if (
      this.player.getPosition().x === this.npc.getPosition().x &&
      this.player.getPosition().y === this.npc.getPosition().y
    ) {
      console.log("Player and NPC are on the same tile!");
      //return;
      //START GAME
      this.scene.remove(SCENE_KEYS.WORLD_SCENE);
      this.scene.start(SCENE_KEYS.BATTLE_SCENE);
    }
    
  }
}
