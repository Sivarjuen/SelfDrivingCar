export type Point = {
    x: number;
    y: number;
};

export type Ray = [Point, Point];
export type Segment = [Point, Point];
export type IntersectionPoint = {
    x: number;
    y: number;
    offset: number;
};
