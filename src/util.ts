import { IntersectionPoint, Segment } from "./types";

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function rad2deg(n: number): number {
    return n * (180 / Math.PI);
}

export function drawDashedLine(
    g: Phaser.GameObjects.Graphics,
    width: number,
    colour: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    sectionLength: number
) {
    let steps =
        Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / sectionLength;

    for (let i = 0; i < steps - 1; i++) {
        const startX = (i / steps) * (x2 - x1) + x1;
        const startY = (i / steps) * (y2 - y1) + y1;
        const endX = ((i + 1) / steps) * (x2 - x1) + x1;
        const endY = ((i + 1) / steps) * (y2 - y1) + y1;

        g.lineStyle(width, colour, 0);
        if (i % 2 === 0) g.lineStyle(width, colour, 1);

        g.lineBetween(startX, startY, endX, endY);
    }
}

export function getIntersection(
    s1: Segment,
    s2: Segment
): IntersectionPoint | undefined {
    const [A, B] = s1;
    const [C, D] = s2;

    console.log(A, B, C, D);

    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom !== 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t,
            };
        }
    }
}
