import { TrainDirection } from "../../Game/Game";
import { linePoints, polyPoints } from "../../Utils/drawing";

export default function IconSvg({ children }: { children: React.ReactNode }) {
    return (
        <svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
            {children}
        </svg>
    );
}

export function InArrowSvg({ direction }: { direction: TrainDirection }) {
    return (
        <>
            <polygon points={polyPoints(direction, { y: 0, x: 27 }, { y: 10, x: 27 }, { y: 10, x: 63 }, { y: 0, x: 63 })} fill="black" />
            <line {...linePoints({ x: 30, y: 0 }, { x: 60, y: 0 }, direction)} stroke="white" />
            <line {...linePoints({ x: 30, y: 0 }, { x: 30, y: 10 }, direction)} stroke="white" />
            <line {...linePoints({ x: 60, y: 0 }, { x: 60, y: 10 }, direction)} stroke="white" />
            <polygon points={polyPoints(direction, { y: 7, x: 45 }, { y: 2, x: 40 }, { y: 2, x: 50 })} fill="white" />
        </>
    );
}

export function OutArrowSvg({ direction }: { direction: TrainDirection }) {
    return (
        <>
            <line {...linePoints({ x: 30, y: 0 }, { x: 60, y: 0 }, direction)} stroke="white" />
            <line {...linePoints({ x: 30, y: 0 }, { x: 30, y: 10 }, direction)} stroke="white" />
            <line {...linePoints({ x: 60, y: 0 }, { x: 60, y: 10 }, direction)} stroke="white" />
            <polygon points={polyPoints(direction, { y: 2, x: 45 }, { y: 7, x: 40 }, { y: 7, x: 50 })} fill="white" />
        </>
    );
}
