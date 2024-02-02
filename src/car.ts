import Controls from "./controls";

export default class Car {
    body: MatterJS.BodyType;

    vel: number;
    acceleration: number;
    maxSpeed: number;
    friction: number;

    angularVel: number;
    angle: number;

    controls: Controls;
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        this.body = scene.matter.add.rectangle(x, y, width, height);
        this.vel = 0;
        this.acceleration = 20;
        this.maxSpeed = 300;
        this.friction = 5;

        this.angularVel = 2;
        this.angle = 0;

        this.controls = new Controls();
        console.log(this.body);
        this.body.velocity = { x: 0, y: -100 };
        this.body.speed = 10;
    }

    update(delta: number) {
        if (this.controls.forward) {
            this.vel += this.acceleration;
        }
        if (this.controls.reverse) {
            this.vel -= this.acceleration;
        }

        if (this.vel != 0) {
            const flip = this.vel > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += this.angularVel * delta * flip;
            }

            if (this.controls.right) {
                this.angle -= this.angularVel * delta * flip;
            }
        }

        this.vel = this.vel > 0 ? Math.min(this.vel, this.maxSpeed) : Math.max(this.vel, -this.maxSpeed / 2);

        if (Math.abs(this.vel) <= this.friction) this.vel = 0;

        // this.body.setVelocity(Math.sin(this.angle) * this.vel, Math.cos(this.angle) * this.vel);

        // this.x -= Math.sin(this.angle) * this.vel * delta;
        // this.y -= Math.cos(this.angle) * this.vel * delta;

        // this.setVelocity(Math.sin(this.angle) * this.vel, Math.cos(this.angle) * this.vel);
        // this.body.velocity = { x: Math.sin(this.angle) * this.vel, y: Math.cos(this.angle) * this.vel };

        // this.body.position = { x: 200, y: 500 };
        this.body.velocity = { x: 0, y: -100 };
        // this.body.speed = 10;
    }

    draw(g: any) {
        return;
        // g.save();
        // g.translateCanvas(this.x, this.y);
        // g.rotateCanvas(-this.angle);
        // g.fillStyle(Color("blue").rgbNumber());
        // g.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        // g.restore();
    }
}
