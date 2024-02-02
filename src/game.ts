import { Scene } from "phaser";
import Car from "./car";

const LANES = 3;

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    car: Car;

    constructor() {
        super("Game");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x808080);
        this.car = new Car(this, this.cameras.main.width / 2, 900, 60, 100);
    }

    update(_time: number, deltaMs: number) {
        const delta = deltaMs / 1000;
        this.car.update(delta);
    }
}
