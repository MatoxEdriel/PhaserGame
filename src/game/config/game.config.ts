import Phaser from "phaser";
import { BootScene } from "../scenes/BootScene";
import { GameScene } from "../scenes/GameScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,


    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,


    },

    input: {
        keyboard: true,
        touch: true,
    },

    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [BootScene,
        GameScene
    ]
};