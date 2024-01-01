import { useEffect } from 'react';
import 'phaser';
import { PreloadScene } from './scenes/preload-scene';
import { WorldScene } from './scenes/world-scene';
import {
    subscribePhaserEvent,
    unsubscribePhaserEvent,
} from "./events/gameEventCenter";

export default function Index() {
    useEffect(() => {
        loadGame();
        subscribePhaserEvent("move", handleCustomEvent);
        return () => unsubscribePhaserEvent("move", handleCustomEvent);
    }, []);

    const handleCustomEvent = (event: any) => {
        console.log("Received data:", event.detail);
    };

    const loadGame = async () => {
        if (typeof window !== 'object') {
        return;
        }

        var config = {
            type: Phaser.AUTO,
            pixelArt: false,
            render: {
                antialias: false,
            },
            parent: "dopergangers",
            physics: {
                default: 'arcade',
                arcade: {
                gravity: { y: 0 },
                },
            },
            scale: {
                // width: 320,
                // height: 320,
                //mode: Phaser.Scale.FIT,
                //autoCenter: Phaser.Scale.CENTER_BOTH,

                // previous
                width: '100%',
                // height: '100%',
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            backgroundColor: '#4eb3e7',
            scene: [PreloadScene, WorldScene],
        };

        var game = new Phaser.Game(config);

        // game.scene.add('main', Main);
        // game.scene.start('main');
    };

    return null;
}
