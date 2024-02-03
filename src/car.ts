import Color from "color";
import Controls, { ControlType } from "./controls";
import Sensor from "./sensor";
import { Point, Segment } from "./types";
import { polysIntersect } from "./util";
import NeuralNetwork from "./network";

export default class Car extends Phaser.GameObjects.Rectangle {
    shape: Phaser.GameObjects.Rectangle;

    speed = 0;
    acceleration = 2;
    maxSpeed = 300;
    friction = 0.8;
    angularVel = 1.5;
    damaged = false;
    initColour: number;

    controlType: ControlType;
    controls: Controls;
    sensors: Sensor;
    brain: NeuralNetwork;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        controlType: ControlType
    ) {
        super(scene, x, y, width, height, 0xffffff);

        this.controlType = controlType;
        this.controls = new Controls(controlType);
        if (controlType === ControlType.DUMMY) {
            this.initColour = Color("orange").rgbNumber();
            this.maxSpeed = 200;
        } else {
            this.sensors = scene.add.existing(new Sensor(scene, this));
            this.brain = new NeuralNetwork([this.sensors.rayCount, 6, 4]);
            this.depth = 2;
            this.initColour = Color("blue").rgbNumber();
        }

        this.fillColor = this.initColour;
    }

    update(delta: number, roadBorders: Segment[] = [], traffic: Car[] = []) {
        if (!this.damaged) {
            this.#move(delta);
            this.damaged = this.#assessDamage(roadBorders, traffic);
            if (this.damaged) {
                this.fillColor = this.damaged
                    ? Color("red").rgbNumber()
                    : this.initColour;
                this.fillAlpha = 0.2;
            }
        }

        if (this.sensors) {
            this.sensors.update(roadBorders, traffic);
            const offsets = this.sensors.readings.map((s) =>
                s === undefined ? 0 : 1 - s.offset
            );
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);

            if (this.controlType === ControlType.AI) {
                this.controls.forward = outputs[0] === 1;
                this.controls.left = outputs[1] === 1;
                this.controls.right = outputs[2] === 1;
                this.controls.reverse = outputs[3] === 1;
            }
        }
    }

    #assessDamage(roadBorders: Segment[], traffic: Car[]) {
        const polyPoints = this.getPolyPoints();
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(polyPoints, [...roadBorders[i]])) return true;
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(polyPoints, traffic[i].getPolyPoints()))
                return true;
        }

        return false;
    }

    getPolyPoints(): Point[] {
        return [
            { x: this.getTopLeft().x!, y: this.getTopLeft().y! },
            { x: this.getTopRight().x!, y: this.getTopRight().y! },
            { x: this.getBottomRight().x!, y: this.getBottomRight().y! },
            { x: this.getBottomLeft().x!, y: this.getBottomLeft().y! },
        ];
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
