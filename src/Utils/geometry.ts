export type Point = {
    x: number; y:
    number
};

export type LineSegment = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
};

/** Return the point for a given angle on a circle of given radius */
export function getPointOnCircle(radius: number, angleInDegrees: number): Point {
    // Convert angle from degrees to radians
    const angleInRadians = (angleInDegrees * Math.PI) / 180;

    // Calculate x and y coordinates using trigonometric functions
    const x = radius * Math.cos(angleInRadians);
    const y = radius * Math.sin(angleInRadians);

    return { x, y };
}

/** Return the point on a unit 4 pointed star (the shape of track corners)*/
export function getPointOnStar(angleInDegrees: number): Point {
    //getPointOnCircle works with angles outside 0-360, but piecewise part doesn't
    let normalizedDegree = angleInDegrees % 360;
    if (normalizedDegree < 0) {
        normalizedDegree += 360;
    }

    const point = getPointOnCircle(.5, normalizedDegree);
    if (normalizedDegree < 90) {
        return { x: 1 - point.x, y: 1 - point.y };
    } else if (normalizedDegree < 180) {
        return { x: 1 + point.x, y: point.y };
    } else if (normalizedDegree < 270) {
        return { x: - point.x, y: - point.y };
    } else {
        return { x: point.x, y: 1 + point.y };
    }
}

export function getClosestEdge(target: DOMRect, point: Point) {
    const { x, y } = point;
    const { top, right, bottom, left } = target;

    const distanceToTop = y - top;
    const distanceToRight = right - x;
    const distanceToBottom = bottom - y;
    const distanceToLeft = x - left;

    const minDistance = Math.min(distanceToTop, distanceToRight, distanceToBottom, distanceToLeft);

    if (minDistance === distanceToTop) {
        return "top";
    } else if (minDistance === distanceToRight) {
        return "right";
    } else if (minDistance === distanceToBottom) {
        return "bottom";
    } else if (minDistance === distanceToLeft) {
        return "left";
    } else {
        return undefined;
    }
}

export function detectEdge(motionLine: LineSegment, element: HTMLElement) {
    const rect = element.getBoundingClientRect();

    const top: LineSegment = {
        startX: rect.left,
        startY: rect.top,
        endX: rect.right,
        endY: rect.top,
    };

    const right: LineSegment = {
        startX: rect.right,
        startY: rect.top,
        endX: rect.right,
        endY: rect.bottom,
    };

    const bottom: LineSegment = {
        startX: rect.left,
        startY: rect.bottom,
        endX: rect.right,
        endY: rect.bottom,
    };

    const left: LineSegment = {
        startX: rect.left,
        startY: rect.top,
        endX: rect.left,
        endY: rect.bottom,
    };

    if (lineSegmentsIntersect(motionLine, top)) {
        return 'top';
    } else if (lineSegmentsIntersect(motionLine, right)) {
        return 'right';
    } else if (lineSegmentsIntersect(motionLine, bottom)) {
        return 'bottom';
    } else if (lineSegmentsIntersect(motionLine, left)) {
        return 'left';
    } else {
        return undefined;
    }
}

export function getMotionLineSegment(event: MouseEvent): LineSegment {
    const startX = event.clientX - event.movementX;
    const startY = event.clientY - event.movementY;
    const endX = event.clientX;
    const endY = event.clientY;

    return { startX, startY, endX, endY };
}

function lineSegmentsIntersect(segment1: LineSegment, segment2: LineSegment): boolean {
    const { startX: x1, startY: y1, endX: x2, endY: y2 } = segment1;
    const { startX: x3, startY: y3, endX: x4, endY: y4 } = segment2;

    const det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
    if (det === 0) {
        return false;
    } else {
        const lambda = ((y4 - y3) * (x4 - x1) + (x3 - x4) * (y4 - y1)) / det;
        const gamma = ((y1 - y2) * (x4 - x1) + (x2 - x1) * (y4 - y1)) / det;
        return (0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1);
    }
}
