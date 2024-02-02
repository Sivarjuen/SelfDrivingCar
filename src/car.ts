import Controls from "./controls";

export default class Car extends Phaser.GameObjects.Rectangle {
    shape: Phaser.GameObjects.Rectangle;
    collider: MatterJS.BodyType;

    speed: number = 0;
    acceleration: number = 2;
    maxSpeed: number = 200;
    friction: number = 0.8;

    angularVel: number = 1.5;

    controls: Controls;
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, colour: number) {
        super(scene, x, y, width, height, colour);
        this.collider = scene.matter.add.rectangle(x, y, width, height, {
            isSensor: true,
            friction: 1,
            frictionAir: 1,
        });
        this.controls = new Controls();
    }

    update(delta: number) {
        this.#move(delta);
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

        if (this.speed != 0) {
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

        this.collider.position = { x: this.x, y: this.y };
        this.collider.angle = this.rotation;
    }
}
