import { TrackDirection, TrackGameCell } from "../../Game/Game";
import { linePoints } from "../../Utils/drawing";
import { getPointOnCircle } from "../../Utils/geometry";
import IconSvg from "./IconSvg";

export function StraightTrackSvg({ direction, color = "white" }: { direction: "horizontal" | "vertical", color?: string }) {
    const lines: JSX.Element[] = [];

    const totalLines = 15;
    const gap = 90 / (totalLines - 1);
    for (let i = 0; i < totalLines; i++) {
        const p1 = { x: 30, y: i * gap };
        const p2 = { x: 60, y: i * gap };

        lines.push(<line key={`line-${i}`} {...linePoints(p1, p2, direction)} stroke={color} />);
    }

    if (direction === "vertical") {
        lines.push(<line key="line-left" x1="30" y1="90" x2="30" y2="0" stroke={color} />);
        lines.push(<line key="line-right" x1="60" y1="90" x2="60" y2="0" stroke={color} />);
    } else {
        lines.push(<line key="line-top" y1="30" x1="90" y2="30" x2="0" stroke={color} />);
        lines.push(<line key="line-bottom" y1="60" x1="90" y2="60" x2="0" stroke={color} />);
    }

    return <>{lines}</>;
}

export function CornerTrackSvg({ direction, color = "white" }: { direction: "top-left" | "top-right" | "bottom-left" | "bottom-right", color?: string }) {
    const lines: JSX.Element[] = [];

    const totalLines = 11;
    const gapDegrees = 90 / (totalLines - 1);
    for (let i = 0; i < totalLines; i++) {
        const p1 = getPointOnCircle(60, i * gapDegrees);
        const p2 = getPointOnCircle(30, i * gapDegrees);

        lines.push(<line key={`line-${i}`} {...linePoints(p1, p2, direction)} stroke={color} />);
    }

    switch (direction) {
        case "top-right":
            lines.push(<path key="line-inner" d="M 90 -30 A 1 1 0 0 0 90 30" stroke={color} fill="transparent" />);
            lines.push(<path key="line-outer" d="M 90 -60 A 1 1 0 0 0 90 60" stroke={color} fill="transparent" />);
            break;
        case "bottom-right":
            lines.push(<path key="line-inner" d="M 120 90 A 1 1 0 0 0 60 90" stroke={color} fill="transparent" />);
            lines.push(<path key="line-outer" d="M 150 90 A 1 1 0 0 0 30 90" stroke={color} fill="transparent" />);
            break;
        case "bottom-left":
            lines.push(<path key="line-inner" d="M 0 120 A 1 1 0 0 0 0 60" stroke={color} fill="transparent" />);
            lines.push(<path key="line-outer" d="M 0 150 A 1 1 0 0 0 0 30" stroke={color} fill="transparent" />);
            break;
        case "top-left":
            lines.push(<path key="line-inner" d="M -30 0 A 1 1 0 0 0 30 0" stroke={color} fill="transparent" />);
            lines.push(<path key="line-outer" d="M -60 0 A 1 1 0 0 0 60 0" stroke={color} fill="transparent" />);
            break;
    }

    return <>{lines}</>;
}

export function TrackSvg({ direction, color = "white" }: { direction: TrackDirection, color?: string }) {
    switch (direction) {
        case "horizontal":
        case "vertical":
            return <StraightTrackSvg direction={direction} color={color} />;
        case "top-right":
        case "bottom-right":
        case "bottom-left":
        case "top-left":
            return <CornerTrackSvg direction={direction} color={color} />;

    }
    return null;
}

export default function TrackCell({ cell }: { cell: Readonly<TrackGameCell> }) {
    switch (cell.direction) {
        case "horizontal":
        case "vertical":
            return <IconSvg><StraightTrackSvg direction={cell.direction} /></IconSvg>;
        default:
            return <IconSvg><CornerTrackSvg direction={cell.direction} /></IconSvg>;
    }
}