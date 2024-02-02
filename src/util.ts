export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

export function rad2deg(n: number) {
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
    let steps = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / sectionLength;

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

export type Point = {
    x: number;
    y: number;
};
