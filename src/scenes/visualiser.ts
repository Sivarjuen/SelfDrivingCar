import { Scene } from "phaser";

export class Visualiser extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    initX: number;

    constructor() {
        super({ key: "Visualiser", active: true });
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setSize(
            (2 * this.sys.game.canvas.width) / 3,
            this.sys.game.canvas.height - 100
        );
        this.camera.x = this.sys.game.canvas.width / 3;
        this.initX = this.camera.x;

        this.scale.on(Phaser.Scale.Events.RESIZE, (e: any) => {
            this.camera.setSize(e.width - this.initX, e.height);
        });
        this.camera.setBackgroundColor(0x1c1c1c);
    }

    update(_time: number, deltaMs: number) {
        const delta = deltaMs / 1000;
    }
}
