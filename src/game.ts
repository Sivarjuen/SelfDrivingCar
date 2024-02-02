import { Scene } from "phaser";
import Car from "./car";
import Color from "color";
import Road from "./road";

const LANES = 3;

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    car: Car;
    road: Road;

    constructor() {
        super("Game");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x808080);
        this.road = this.add.existing(
            new Road(
                this,
                this.cameras.main.width / 2,
                this.cameras.main.width * 0.9,
                LANES
            )
        );
        this.car = this.add.existing(
            new Car(
                this,
                this.road.getLaneCenter(1),
                900,
                60,
                100,
                Color("blue").rgbNumber()
            )
        );

        this.camera.startFollow(this.car, false, 0.1);
    }

    update(_time: number, deltaMs: number) {
        const delta = deltaMs / 1000;
        this.car.update(delta, this.road.borders);
        this.camera.pan(
            this.cameras.main.width / 2,
            this.car.y - this.cameras.main.height * 0.3,
            0
        );
    }
}
