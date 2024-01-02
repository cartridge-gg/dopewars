import { useEffect } from 'react';
import 'phaser';
import { PreloadScene } from './scenes/preload-scene';
import { WorldScene } from './scenes/world-scene';
import { BattleScene } from './scenes/battle-scene';
import {
    subscribePhaserEvent,
    unsubscribePhaserEvent,
} from "./events/gameEventCenter";
import { useSystems } from "@/dojo/hooks/useSystems";
import { useRouter } from "next/router";
import { Direction} from "@/dojo/types";

export default function Index() {
    const router = useRouter();
    const gameId = router.query.gameId as string;
    const { move } = useSystems();

    useEffect(() => {
        loadGame();
        subscribePhaserEvent("move", handleMoveTxn);
        return () => unsubscribePhaserEvent("move", handleMoveTxn);
    }, []);

    const handleCustomEvent = (event: any) => {
        console.log("Received data:", event.detail);
    };

    const handleMoveTxn = async (event: any) => {
        console.log("move event: ", event.detail);
        const res = await move(gameId, Direction.Down);
        console.log("move res: ", res);
    }

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
                width: 1024,
                height: 576,
                //mode: Phaser.Scale.FIT,
                //autoCenter: Phaser.Scale.CENTER_BOTH,

                // previous
                //width: '100%',
                // height: '100%',
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            backgroundColor: '#4eb3e7',
            scene: [PreloadScene, WorldScene, BattleScene],
            //scene: [PreloadScene, WorldScene],
        };

        var game = new Phaser.Game(config);

        // game.scene.add('main', Main);
        // game.scene.start('main');
    };

    return null;
}
