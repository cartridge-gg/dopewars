import { useSystems } from "@/dojo/hooks/useSystems";
import "phaser";

export default class TestScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private controls!: Phaser.Cameras.Controls.SmoothedKeyControl;

  constructor() {
    super({ key: "TestScene" });
  }

  preload() {
    // this.load.image("tiles", "/phaser/tiles/cloud_tileset.png");
    // this.load.tilemapTiledJSON(
    //     "cloud-city-map",
    //     "/phaser/maps/cloud_city.json",
    // );
    this.load.image("tiles", "/phaser/tiles/tilemap_packed.png");
    this.load.tilemapTiledJSON("hood-map", "/phaser/maps/hood1.json");

    // this.load.spritesheet("player", "/phaser/spritesheets/characters.png", {
    //     frameWidth: 52,
    //     frameHeight: 72,
    // });
    this.load.spritesheet("player", "/phaser/spritesheets/player1.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("player2", "/phaser/spritesheets/player2.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  create() {
    const hoodTilemap = this.make.tilemap({ key: "hood-map" });
    hoodTilemap.addTilesetImage("hood1", "tiles");
    for (let i = 0; i < hoodTilemap.layers.length; i++) {
      const layer = hoodTilemap.createLayer(i, "hood1", 0, 0)?.setOrigin(0, 0);
      layer.scale = 4;
    }

    const {} = useSystems();

    const playerSprite = this.add.sprite(0, 0, "player");
    const player2Sprite = this.add.sprite(0, 0, "player2");

    playerSprite.scale = 4;
    player2Sprite.scale = 4;
    this.cameras.main.startFollow(playerSprite, true);
    // this.cameras.main.setFollowOffset(
    //     -playerSprite.width,
    //     -playerSprite.height,
    // );

    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          speed: 8,
          walkingAnimationMapping: 0,
          startPosition: { x: 3, y: 3 },
        },
        {
          id: "player2",
          sprite: player2Sprite,
          speed: 8,
          walkingAnimationMapping: 0,
          startPosition: { x: 5, y: 5 },
        },
      ],
    };

    this.gridEngine.create(hoodTilemap, gridEngineConfig);

    const controlConfig = {
      camera: this.cameras.main,
      left: this.cursors.left,
      right: this.cursors.right,
      up: this.cursors.up,
      down: this.cursors.down,
      acceleration: 0.02,
      drag: 0.0005,
      maxSpeed: 1.0,
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    //console.log(this.input.mousePointer.x, this.input.mousePointer.y);

    // const cloudCityTilemap = this.make.tilemap({ key: "cloud-city-map" });
    // cloudCityTilemap.addTilesetImage("Cloud City", "tiles");
    // for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
    //     const layer = cloudCityTilemap.createLayer(i, "Cloud City", 0, 0);
    //     layer.scale = 3;
    // }

    // const playerSprite = this.add.sprite(0, 0, "player");
    // playerSprite.scale = 1.5;
    // this.cameras.main.startFollow(playerSprite, true);
    // this.cameras.main.setFollowOffset(
    //     -playerSprite.width,
    //     -playerSprite.height,
    // );

    // const gridEngineConfig = {
    //     characters: [
    //         {
    //             id: "player",
    //             sprite: playerSprite,
    //             speed: 8,
    //             walkingAnimationMapping: 6,
    //             startPosition: { x: 8, y: 8 },
    //         },
    //     ],
    // };

    // this.gridEngine.create(cloudCityTilemap, gridEngineConfig);
  }

  update(t, dt) {
    //this.controls.update(dt);
    if (this.cursors.left.isDown) {
      this.gridEngine.move("player", "left");
    } else if (this.cursors.right.isDown) {
      this.gridEngine.move("player", "right");
    } else if (this.cursors.up.isDown) {
      this.gridEngine.move("player", "up");
    } else if (this.cursors.down.isDown) {
      this.gridEngine.move("player", "down");
    }
  }
}
