import Color from "color";
import Controls from "./controls";
import Sensor from "./sensor";
import { Point, Segment } from "./types";
import { polysIntersect } from "./util";

export default class Car extends Phaser.GameObjects.Rectangle {
    shape: Phaser.GameObjects.Rectangle;

    speed = 0;
    acceleration = 2;
    maxSpeed = 300;
    friction = 0.8;
    angularVel = 1.5;
    damaged = false;
    initColour: number;

    controls: Controls;
    sensors: Sensor;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        colour: number
    ) {
        super(scene, x, y, width, height, colour);
        this.initColour = colour;
        this.controls = new Controls();
        this.sensors = scene.add.existing(new Sensor(scene, this));
    }

    update(delta: number, roadBorders: Segment[]) {
        this.#move(delta);
        const damagedThisFrame = this.#assessDamage(roadBorders);
        if (this.damaged != damagedThisFrame) {
            this.damaged = damagedThisFrame;
            this.fillColor = this.damaged
                ? Color("red").rgbNumber()
                : this.initColour;
        }

        this.sensors.update(roadBorders);
    }

    #assessDamage(roadBorders: Segment[]) {
        const polyPoints: Point[] = [
            { x: this.getTopLeft().x!, y: this.getTopLeft().y! },
            { x: this.getTopRight().x!, y: this.getTopRight().y! },
            { x: this.getBottomRight().x!, y: this.getBottomRight().y! },
            { x: this.getBottomLeft().x!, y: this.getBottomLeft().y! },
        ];
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(polyPoints, [...roadBorders[i]])) return true;
        }
        return false;
    }

    #move(delta: number) {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (Math.abs(this.speed) > 0.1) {
            const flip = this.speed > 0 ? -1 : 1;
            if (this.controls.left) {
                this.rotation += this.angularVel * flip * delta;
            }
            if (this.controls.right) {
                this.rotation -= this.angularVel * flip * delta;
            }
        }

        this.x += Math.sin(this.rotation) * this.speed * delta;
        this.y -= Math.cos(this.rotation) * this.speed * delta;
    }
}
