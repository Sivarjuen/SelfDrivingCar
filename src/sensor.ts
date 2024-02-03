import Color from "color";
import Car from "./car";
import { getIntersection, lerp } from "./util";
import { IntersectionPoint, Point, Ray, Segment } from "./types";

export default class Sensor extends Phaser.GameObjects.Graphics {
    car: Car;
    rayCount: number;
    rayLength: number;
    raySpread: number;
    rays: Ray[];
    readings: (IntersectionPoint | undefined)[];

    constructor(scene: Phaser.Scene, car: Car) {
        super(scene);
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 300;
        this.raySpread = Math.PI / 2;

        this.rays = [];
        this.readings = [];

        this.depth = 1;
    }

    update(roadBorders: Segment[], traffic: Car[]) {
        this.#castRays();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders, traffic)
            );
        }
        this.draw();
    }

    #getReading(ray: Ray, roadBorders: Segment[], traffic: Car[]) {
        let touches: IntersectionPoint[] = [];

        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(ray as Segment, roadBorders[i]);
            if (touch) touches.push(touch);
        }

        for (let i = 0; i < traffic.length; i++) {
            const polyPoints = traffic[i].getPolyPoints();
            for (let j = 0; j < polyPoints.length; j++) {
                const touch = getIntersection(ray as Segment, [
                    polyPoints[j],
                    polyPoints[(j + 1) % polyPoints.length],
                ]);
                if (touch) touches.push(touch);
            }
            const touch = getIntersection(ray as Segment, roadBorders[i]);
            if (touch) touches.push(touch);
        }

        const offsets = touches.map((e) => e.offset);
        const minOffset = Math.min(...offsets);
        return touches.find((e) => e.offset === minOffset);
    }

    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle =
                lerp(
                    this.raySpread / 2,
                    -this.raySpread / 2,
                    this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
                ) - this.car.rotation;
            const start: Point = { x: this.car.x, y: this.car.y };
            const end: Point = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength,
            };
            this.rays.push([start, end]);
        }
    }

    draw() {
        this.clear();
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1];
            const reading = this.readings[i];
            if (reading !== undefined) {
                end = { x: reading.x, y: reading.y };
            }

            this.lineStyle(3, Color("yellow").rgbNumber());
            this.lineBetween(
                this.rays[i][0].x,
                this.rays[i][0].y,
                end.x,
                end.y
            );

            this.lineStyle(3, Color("red").rgbNumber());
            this.lineBetween(
                this.rays[i][1].x,
                this.rays[i][1].y,
                end.x,
                end.y
            );
        }
    }
}
