import Phaser from "phaser";

export class GameScene extends Phaser.Scene {

    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;


    private joystickBase!: Phaser.GameObjects.Arc;
    private joystickThumb!: Phaser.GameObjects.Arc;
    private joystickPointer?: Phaser.Input.Pointer;
    private joystickVector = new Phaser.Math.Vector2(0, 0);
    private joystickRadius = 40;


    private btnA!: Phaser.GameObjects.Arc;
    private btnB!: Phaser.GameObjects.Arc;
    private pressA = false;
    private pressB = false;

    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.image("player", "assets/logo.png");
        this.load.image("grass", "assets/cesped.jpg");

    }

    create() {
        const gameHeight = this.scale.height * 0.7;
        const uiHeight = this.scale.height * 0.3;

        this.add.tileSprite(
            0,
            0,
            this.scale.width,
            gameHeight,
            "grass"
        )
            .setOrigin(0)
            .setDepth(0);


        this.physics.world.setBounds(0, 0, this.scale.width, gameHeight);


        this.player = this.physics.add.sprite(
            this.scale.width / 2,
            gameHeight / 2,
            "player"
        );
        this.player.setScale(0.2);
        this.player.setCollideWorldBounds(true);


        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }


        const baseY = gameHeight + uiHeight / 2;

        this.add.rectangle(
            this.scale.width / 2,
            baseY,
            this.scale.width,
            uiHeight,
            0x000000,
            0.6
        ).setScrollFactor(0);

        const joystickX = 90;
        const joystickY = baseY;

        this.joystickBase = this.add.circle(
            joystickX,
            joystickY,
            this.joystickRadius,
            0xffffff,
            0.2
        ).setScrollFactor(0).setDepth(10).setInteractive();

        this.joystickThumb = this.add.circle(
            joystickX,
            joystickY,
            this.joystickRadius / 2,
            0xffffff,
            0.6
        ).setScrollFactor(0).setDepth(11);

        this.input.on("pointerdown", (pointer: any) => {
            if (
                Phaser.Math.Distance.Between(pointer.x, pointer.y, joystickX, joystickY)
                <= this.joystickRadius
            ) {
                this.joystickPointer = pointer;
            }
        });

        this.input.on("pointerup", (pointer: any) => {
            if (this.joystickPointer?.id === pointer.id) {
                this.joystickPointer = undefined;
                this.joystickVector.set(0, 0);
                this.joystickThumb.setPosition(joystickX, joystickY);
            }
        });

        this.input.on("pointermove", (pointer: any) => {
            if (!this.joystickPointer || pointer.id !== this.joystickPointer.id) return;

            const dx = pointer.x - joystickX;
            const dy = pointer.y - joystickY;

            const distance = Math.min(this.joystickRadius, Math.hypot(dx, dy));
            const angle = Math.atan2(dy, dx);

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            this.joystickThumb.setPosition(joystickX + x, joystickY + y);
            this.joystickVector.set(x / this.joystickRadius, y / this.joystickRadius);
        });

        const btnAX = this.scale.width - 90;
        const btnAY = baseY - 25;

        const btnBX = this.scale.width - 150;
        const btnBY = baseY + 25;

        this.btnA = this.add.circle(btnAX, btnAY, 28, 0xfff, 0.8)
            .setScrollFactor(0)
            .setDepth(11)
            .setInteractive();

        this.btnB = this.add.circle(btnBX, btnBY, 24, 0xfff, 0.8)
            .setScrollFactor(0)
            .setDepth(11)
            .setInteractive();

        this.add.text(btnAX - 6, btnAY - 10, "A", { color: "#fff", fontSize: "18px" })
            .setScrollFactor(0).setDepth(12);

        this.add.text(btnBX - 6, btnBY - 10, "B", { color: "#fff", fontSize: "18px" })
            .setScrollFactor(0).setDepth(12);

        this.btnA.on("pointerdown", () => this.pressA = true);
        this.btnA.on("pointerup", () => this.pressA = false);
        this.btnA.on("pointerout", () => this.pressA = false);

        this.btnB.on("pointerdown", () => this.pressB = true);
        this.btnB.on("pointerup", () => this.pressB = false);
        this.btnB.on("pointerout", () => this.pressB = false);
    }

    update() {
        const speed = this.pressB ? 200 : 120;
        this.player.setVelocity(0);


        this.player.setVelocity(
            this.joystickVector.x * speed,
            this.joystickVector.y * speed
        );


        if (this.cursors?.left?.isDown) this.player.setVelocityX(-speed);
        if (this.cursors?.right?.isDown) this.player.setVelocityX(speed);
        if (this.cursors?.up?.isDown) this.player.setVelocityY(-speed);
        if (this.cursors?.down?.isDown) this.player.setVelocityY(speed);


        if (this.pressA) {

        }
    }
}