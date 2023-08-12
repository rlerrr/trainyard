import { Point } from "./geometry";

type PointDirection = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "horizontal" | "vertical" | "top" | "bottom" | "right" | "left";

/** Convert 2 points to a <line> element's attributes, in a given direction */
export function linePoints(p1: Point, p2: Point, direction: PointDirection) {
    p1 = rotatePoint(p1, direction);
    p2 = rotatePoint(p2, direction);
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
}

/** Convert polygon points to a <polygon> element's 'points' attribute format, in a given direction */
export const polyPoints = (direction: PointDirection, ...args: Point[]) =>
    args.map(p => rotatePoint(p, direction)).map(p => `${p.x},${p.y}`).join(' ');

/** 
 * Rotate a given point into a given direction.  
 * TODO: this function is one big hack 
 * */
export function rotatePoint(p: Point, direction: PointDirection): Point {
    switch (direction) {
        case "top-right":
            return { x: 90 - p.x, y: p.y };
        case "bottom-left":
        case "bottom":
            return { y: 90 - p.y, x: p.x };
        case "bottom-right":
            return { x: 90 - p.x, y: 90 - p.y };
        case "horizontal":
        case "left":
            return { x: p.y, y: p.x };
        case "right":
            return { x: 90 - p.y, y: 90 - p.x };
    }

    return p;
}