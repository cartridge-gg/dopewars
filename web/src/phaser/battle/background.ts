import { ASSET_KEYS } from "../assets/asset-keys";


export class Background {
  #scene:Phaser.Scene
  #backgroundGameObject:Phaser.GameObjects.Image

  constructor(scene:Phaser.Scene) {
    this.#scene = scene;

    this.#backgroundGameObject = this.#scene.add
      .image(0, 0,ASSET_KEYS.CITY)
      .setOrigin(0)
  }

  showCity() {
    this.#backgroundGameObject.setTexture(ASSET_KEYS.CITY)
  }
}