import Color from "color";
import { Point, drawDashedLine, lerp } from "./util";

export default class Road extends Phaser.GameObjects.Graphics {
    width: number;
    laneCount: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    borders: Point[][];

    constructor(scene: Phaser.Scene, x: number, width: number, laneCount: number) {
        super(scene);
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = -width / 2;
        this.right = width / 2;

        const infinity = 100000;
        this.top = -infinity;
        this.bottom = infinity;

        const topLeft: Point = { x: this.left, y: this.top };
        const bottomLeft: Point = { x: this.left, y: this.bottom };
        const topRight: Point = { x: this.right, y: this.top };
        const bottomRight: Point = { x: this.right, y: this.bottom };

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight],
        ];

        this.draw();
    }

    getLaneCenter(laneIndex: number) {
        const laneWidth = this.width / this.laneCount;
        return this.x + this.left + laneWidth / 2 + Math.min(laneIndex, this.laneCount - 1) * laneWidth;
    }

    draw() {
        for (let i = 1; i < this.laneCount; i++) {
            const xPos = lerp(this.left, this.right, i / this.laneCount);
            drawDashedLine(this, 5, Color("white").rgbNumber(), xPos, this.top, xPos, this.bottom, 50);
        }

        this.lineStyle(5, Color("white").rgbNumber());
        this.borders.forEach((b) => {
            this.lineStyle(5, Color("white").rgbNumber());
            this.lineBetween(b[0].x, b[0].y, b[1].x, b[1].y);
        });
    }
}
