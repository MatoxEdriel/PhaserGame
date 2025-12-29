import Phaser from "phaser";

export class BootScene extends Phaser.Scene {

    constructor() {
        super("BootScene");
    }

    preload() {
        this.load.image("logo", "assets/logo.png");
    }

    create() {

        this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            "logo"
        );

        this.time.delayedCall(1500, () => {
            this.scene.start("GameScene");
        });
    }
}