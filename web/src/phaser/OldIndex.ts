import { useEffect } from 'react';
import 'phaser';
import TestScene from './scenes/TestScene';
import { GridEngine } from "grid-engine";

export default function OldIndex() {
    useEffect(() => {
        loadGame();
    }, []);

    const loadGame = async () => {
        if (typeof window !== 'object') {
        return;
        }

        var config = {
            type: Phaser.AUTO,
            parent: 'dopergangers',
            backgroundColor: '#4eb3e7',
            physics: {
                default: 'arcade',
                arcade: {
                gravity: { y: 0 },
                },
            },
            render: {
                antialias: false,
            },
            scale: {
                width: '100%',
                // height: '100%',
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },

            plugins: {
                scene: [
                    {
                        key: "gridEngine",
                        plugin: GridEngine,
                        mapping: "gridEngine",
                    },
                ],
            },

            scene:[TestScene]
        };

        var game = new Phaser.Game(config);

        // game.scene.add('main', Main);
        // game.scene.start('main');
    };

    return null;
}