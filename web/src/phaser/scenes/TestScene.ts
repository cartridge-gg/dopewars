import 'phaser';

export default class TestScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    constructor() {
        super({ key: 'TestScene' });
    }

    preload() {

        this.load.image("tiles", "/phaser/tiles/cloud_tileset.png");
        this.load.tilemapTiledJSON(
            "cloud-city-map",
            "/phaser/maps/cloud_city.json",
        );

        this.load.spritesheet("player", "/phaser/spritesheets/characters.png", {
            frameWidth: 52,
            frameHeight: 72,
        });

        this.cursors = this.input.keyboard!.createCursorKeys();

    }

    create() {
        const cloudCityTilemap = this.make.tilemap({ key: "cloud-city-map" });
        cloudCityTilemap.addTilesetImage("Cloud City", "tiles");
        for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
            const layer = cloudCityTilemap.createLayer(i, "Cloud City", 0, 0);
            layer.scale = 3;
        }

        const playerSprite = this.add.sprite(0, 0, "player");
        playerSprite.scale = 1.5;
        this.cameras.main.startFollow(playerSprite, true);
        this.cameras.main.setFollowOffset(
            -playerSprite.width,
            -playerSprite.height,
        );

        const gridEngineConfig = {
            characters: [
                {
                    id: "player",
                    sprite: playerSprite,
                    speed: 8,
                    walkingAnimationMapping: 6,
                    startPosition: { x: 8, y: 8 },
                },
            ],
        };

        this.gridEngine.create(cloudCityTilemap, gridEngineConfig);
    }

    update() {

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